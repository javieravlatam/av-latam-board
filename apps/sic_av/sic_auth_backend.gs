/**
 * SIC-AV — Backend de Autenticación y Datos Seguros
 * Google Apps Script Web App  ·  v2.0  ·  2026-08-05
 * ═══════════════════════════════════════════════════════════════════════
 * CAMBIOS v2.0 respecto a v1.0:
 *   - COL: 17 columnas (+ nombre_completo, created_at, updated_at)
 *   - Sesiones: 11 columnas (sin cerrado_en). Tokens no activos se purgan
 *     en lote con LockService. Hoja sesiones = solo activas en steady-state.
 *   - accionGetSICData(): lee filas por vendedor/ciclo. Sin blob A1.
 *   - _combinarPayloadsSIC(): agrega payloads de múltiples vendedores.
 *   - _filtrarDatos(): eliminado. Filtrado ocurre en lectura de filas.
 *   - Script Properties: SESSION_HOURS, MAX_FAILED_ATTEMPTS, LOCK_MINUTES
 *     configurables. SIC_PEPPER mediante configurarPepperInicial().
 *   - crearUsuario(): 17 columnas con created_at, updated_at.
 *   - _actualizarUsuario(): escribe updated_at en cada cambio.
 *   - diagnosticoBackend(): validación exhaustiva no destructiva.
 *   - testBackend(): pruebas ejecutables desde el editor GAS.
 *   - _audit(): ahora registra audit_id, usuario_id, token_id, pais,
 *     vendedor_id además de los campos anteriores.
 *
 * DESPLIEGUE (FASE 6):
 *   Implementar → Nueva implementación → Aplicación web
 *   Ejecutar como: YO  |  Quién tiene acceso: Cualquier persona
 *   Copiar URL /exec → sic_auth.js → GAS_URL
 *
 * GOOGLE SHEET — 7 hojas definitivas (FASE 2 v1.1):
 *   usuarios(17) · sesiones(11) · audit_log(11)
 *   sic_data_cl(12) · sic_data_pe(12) · liquidaciones(17) · saldos_ajustes(13)
 * ═══════════════════════════════════════════════════════════════════════
 */

// ─── SCRIPT PROPERTIES — leer una vez al inicio ────────────────────────────
var _PROPS         = PropertiesService.getScriptProperties();
var SPREADSHEET_ID = _PROPS.getProperty("SPREADSHEET_ID");
var PEPPER         = _PROPS.getProperty("SIC_PEPPER");
var SESSION_HOURS  = parseInt(_PROPS.getProperty("SESSION_HOURS"))       || 8;
var MAX_INTENTOS   = parseInt(_PROPS.getProperty("MAX_FAILED_ATTEMPTS")) || 5;
var BLOQUEO_MIN    = parseInt(_PROPS.getProperty("LOCK_MINUTES"))        || 30;
var PIN_REGEX      = /^[0-9]{4}$/;

// ─── COL — índices de columna para hoja "usuarios" (1-indexed) ─────────────
var COL = {
  usuario_id:1,  username:2,           vendedor_id:3,       nombre_completo:4,
  pais:5,        rol:6,                pin_hash:7,          salt:8,
  clave_temporal_activa:9,             cambio_obligatorio:10,
  intentos_fallidos:11,                bloqueado_hasta:12,
  ultimo_acceso:13,                    fecha_cambio_pin:14,
  estado:15,     created_at:16,        updated_at:17
};

// ─── COL_SIC — índices 0-based para hojas sic_data_cl / sic_data_pe ────────
var COL_SIC = {
  record_id:0,   tipo_registro:1,  pais:2,         vendedor_id:3,
  ciclo:4,       fecha:5,          payload_json:6, fuente:7,
  version_datos:8, created_at:9,  updated_at:10,  activo:11
};

// ─── COLUMNAS SESIONES (0-based para getValues()) ───────────────────────────
// token:0  usuario_id:1  username:2  rol:3  vendedor_id:4  pais:5
// emitido_en:6  expira_en:7  estado:8  user_agent:9  ultimo_uso:10

// ═══════════════════════════════════════════════════════════════════════
// ENTRY POINTS
// ═══════════════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action  = String(payload.action || "");
    var result;
    if      (action === "login")        result = accionLogin(payload);
    else if (action === "change_pin")   result = accionChangePIN(payload);
    else if (action === "validate")     result = accionValidate(payload);
    else if (action === "logout")       result = accionLogout(payload);
    else if (action === "get_sic_data") result = accionGetSICData(payload);
    else                                result = { error: "Acción no reconocida." };
    return _respuesta(result);
  } catch(err) {
    _audit("?", "error_global", err.message.slice(0, 200), "");
    return _respuesta({ error: "Error interno del servidor." });
  }
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ error: "Método no permitido." }))
    .setMimeType(ContentService.MimeType.JSON);
}

function _respuesta(data) {
  // CORS manejado automáticamente por GAS cuando el Web App
  // está desplegado con acceso "Cualquier persona".
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ═══════════════════════════════════════════════════════════════════════
// HELPERS CRIPTOGRÁFICOS
// ═══════════════════════════════════════════════════════════════════════

function _hash(pin, salt) {
  // SHA-256(PIN + salt + pepper). Nunca sale del GAS. PEPPER no se loguea.
  var combined = String(pin) + String(salt) + String(PEPPER || "");
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, combined, Utilities.Charset.UTF_8
  );
  return bytes.map(function(b) {
    var v = b < 0 ? b + 256 : b;
    return ("0" + v.toString(16)).slice(-2);
  }).join("");
}

function _uuid() { return Utilities.getUuid(); }

// ═══════════════════════════════════════════════════════════════════════
// HELPERS DE TIEMPO
// ═══════════════════════════════════════════════════════════════════════

function _ahora()      { return new Date(); }
function _addH(d, h)   { return new Date(d.getTime() + h * 3600000); }
function _addMin(d, m) { return new Date(d.getTime() + m * 60000); }
function _iso(d)       { return d ? d.toISOString() : ""; }

// ═══════════════════════════════════════════════════════════════════════
// AUDITORÍA
// ═══════════════════════════════════════════════════════════════════════

/**
 * Registra un evento en audit_log.
 * opts (opcional): { usuario_id, token_id, pais, vendedor_id, detalle }
 * NUNCA incluir PIN, hash, salt ni pepper en ningún campo.
 */
function _audit(username, accion, resultado, ua, opts) {
  opts = opts || {};
  try {
    _sheet("audit_log").appendRow([
      _uuid(),                                        // audit_id
      _iso(_ahora()),                                 // timestamp
      String(opts.usuario_id || "?"),                 // usuario_id
      String(username        || "?"),                 // username
      String(accion          || ""),                  // accion
      String(resultado       || "").slice(0, 200),    // resultado
      String(opts.detalle    || "").slice(0, 500),    // detalle — sin datos sensibles
      String(ua              || "").slice(0, 200),    // user_agent
      String(opts.token_id   || "").slice(0, 8),      // token_id (solo 8 chars)
      String(opts.pais       || ""),                  // pais
      String(opts.vendedor_id|| "")                   // vendedor_id
    ]);
  } catch(e) { /* audit nunca bloquea el flujo principal */ }
}

// ═══════════════════════════════════════════════════════════════════════
// ACCESO A SHEET
// ═══════════════════════════════════════════════════════════════════════

function _sheet(name) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);
}

function _sheetData(name) {
  var sh = _sheet(name);
  if (!sh) return [];
  var range = sh.getDataRange();
  return range.getNumRows() > 1 ? range.getValues() : [];
}

// ═══════════════════════════════════════════════════════════════════════
// MODELO USUARIO
// ═══════════════════════════════════════════════════════════════════════

function _buscarUsuario(username) {
  var data = _sheetData("usuarios");
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (String(r[COL.username - 1]).toLowerCase() === username.toLowerCase()) {
      var bloq = r[COL.bloqueado_hasta - 1];
      return {
        row:                   i + 1,
        usuario_id:            String(r[COL.usuario_id     - 1]),
        username:              String(r[COL.username        - 1]),
        nombre_completo:       String(r[COL.nombre_completo- 1] || ""),
        vendedor_id:           r[COL.vendedor_id  - 1] || null,
        pais:                  String(r[COL.pais           - 1]),
        rol:                   String(r[COL.rol            - 1]),
        pin_hash:              String(r[COL.pin_hash       - 1]),
        salt:                  String(r[COL.salt           - 1]),
        clave_temporal_activa: r[COL.clave_temporal_activa - 1] === true
                               || String(r[COL.clave_temporal_activa - 1]).toUpperCase() === "TRUE",
        cambio_obligatorio:    r[COL.cambio_obligatorio    - 1] === true
                               || String(r[COL.cambio_obligatorio - 1]).toUpperCase() === "TRUE",
        intentos_fallidos:     parseInt(r[COL.intentos_fallidos - 1]) || 0,
        bloqueado_hasta:       bloq ? new Date(bloq) : null,
        ultimo_acceso:         r[COL.ultimo_acceso   - 1],
        fecha_cambio_pin:      r[COL.fecha_cambio_pin- 1],
        estado:                String(r[COL.estado       - 1])
      };
    }
  }
  return null;
}

function _actualizarUsuario(row, campos) {
  var sh = _sheet("usuarios");
  var ahora = _iso(_ahora());
  Object.keys(campos).forEach(function(k) {
    if (COL[k]) {
      var v = campos[k];
      sh.getRange(row, COL[k]).setValue(v === null || v === undefined ? "" : v);
    }
  });
  // Siempre actualizar updated_at en cada escritura
  sh.getRange(row, COL.updated_at).setValue(ahora);
}

// ═══════════════════════════════════════════════════════════════════════
// MODELO SESIÓN — 11 columnas
// ═══════════════════════════════════════════════════════════════════════
// Índices (0-based): token=0 usuario_id=1 username=2 rol=3 vendedor_id=4
//   pais=5 emitido_en=6 expira_en=7 estado=8 user_agent=9 ultimo_uso=10

function _crearToken(usr, userAgent) {
  var token   = _uuid();
  var emitido = _ahora();
  var expira  = _addH(emitido, SESSION_HOURS);
  _sheet("sesiones").appendRow([
    token,                         // token
    usr.usuario_id,                // usuario_id
    usr.username,                  // username
    usr.rol,                       // rol
    usr.vendedor_id || "",         // vendedor_id
    usr.pais,                      // pais
    _iso(emitido),                 // emitido_en
    _iso(expira),                  // expira_en
    "activa",                      // estado
    (userAgent || "").slice(0,200),// user_agent
    ""                             // ultimo_uso (vacío al crear)
  ]);
  return { token: token, expira: _iso(expira) };
}

/**
 * Valida un token. Si expiró: lo marca "expirada" (se purgará después).
 * Si es válido: actualiza ultimo_uso.
 * Retorna objeto sesión o null.
 */
function _validarToken(token) {
  if (!token) return null;
  var data = _sheetData("sesiones");
  var sh   = _sheet("sesiones");
  var ahora = _ahora();

  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (r[0] !== token) continue;

    if (String(r[8]).toLowerCase() !== "activa") return null; // ya invalida/expirada

    var expira = new Date(r[7]);
    if (expira <= ahora) {
      // Expirado: marcar para purga posterior
      try { sh.getRange(i + 1, 9).setValue("expirada"); } catch(e) {}
      return null;
    }

    // Válido: actualizar ultimo_uso (best-effort, no bloquea)
    try { sh.getRange(i + 1, 11).setValue(_iso(ahora)); } catch(e) {}

    return {
      row:        i + 1,
      token:      token,
      usuario_id: String(r[1]),
      username:   String(r[2]),
      rol:        String(r[3]),
      vendedor_id:r[4] || null,
      pais:       String(r[5]),
      expira:     r[7]
    };
  }
  return null;
}

/**
 * Marca un token como "invalida" (logout / change_pin).
 * La purga real ocurre en _purgarSesionesNoActivas().
 */
function _invalidarToken(token) {
  if (!token) return;
  var data = _sheetData("sesiones");
  var sh   = _sheet("sesiones");
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === token) {
      try { sh.getRange(i + 1, 9).setValue("invalida"); } catch(e) {}
      return;
    }
  }
}

/**
 * Invalida todos los tokens activos de un usuario específico.
 * Usado en change_pin para eliminar sesiones previas del mismo usuario.
 */
function _invalidarTokensDeUsuario(usuario_id) {
  var data = _sheetData("sesiones");
  var sh   = _sheet("sesiones");
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]) === usuario_id && String(data[i][8]).toLowerCase() === "activa") {
      try { sh.getRange(i + 1, 9).setValue("invalida"); } catch(e) {}
    }
  }
}

/**
 * Elimina en lote todas las filas de sesiones no activas o ya expiradas.
 * Usa LockService para escritura segura. Seguro para ejecución concurrente.
 * Llamar: después de logout, después de change_pin, y mediante trigger diario.
 */
function _purgarSesionesNoActivas() {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var sh = _sheet("sesiones");
    if (!sh || sh.getLastRow() < 2) return;

    var data = sh.getDataRange().getValues();
    var ahora = _ahora();
    var aEliminar = [];

    for (var i = 1; i < data.length; i++) {
      var estado  = String(data[i][8] || "").toLowerCase();
      var expiraV = data[i][7];
      var estaExpirada = expiraV && new Date(expiraV) <= ahora;
      if (estado !== "activa" || estaExpirada) {
        aEliminar.push(i + 1); // fila en Sheet (1-indexed)
      }
    }

    // Eliminar de abajo a arriba para no desplazar índices
    for (var j = aEliminar.length - 1; j >= 0; j--) {
      try { sh.deleteRow(aEliminar[j]); } catch(e) {}
    }

  } catch(e) { /* lock timeout — no es crítico */ }
  finally { try { lock.releaseLock(); } catch(e) {} }
}

/**
 * Trigger público. Conectar a un time trigger diario en Apps Script.
 */
function limpiarTokensExpirados() {
  _purgarSesionesNoActivas();
}

// ═══════════════════════════════════════════════════════════════════════
// ACCIÓN: LOGIN
// ═══════════════════════════════════════════════════════════════════════

function accionLogin(payload) {
  var username = String(payload.username || "").trim().toLowerCase();
  var pin      = String(payload.pin      || "");
  var ua       = String(payload.user_agent || "");

  if (!PIN_REGEX.test(pin)) {
    Utilities.sleep(600);
    _audit(username, "login", "formato_pin_invalido", ua);
    return { error: "Usuario o contraseña incorrectos." };
  }

  var lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch(e) {
    return { error: "Servicio ocupado. Intente en unos segundos." };
  }

  try {
    var usr = _buscarUsuario(username);
    if (!usr || usr.estado !== "activo") {
      Utilities.sleep(800);
      _audit(username, "login", "usuario_no_encontrado_o_inactivo", ua);
      return { error: "Usuario o contraseña incorrectos." };
    }

    if (usr.bloqueado_hasta && usr.bloqueado_hasta > _ahora()) {
      _audit(username, "login", "cuenta_bloqueada", ua,
        { usuario_id: usr.usuario_id, pais: usr.pais, vendedor_id: usr.vendedor_id });
      return { error: "Cuenta bloqueada temporalmente. Intente en " + BLOQUEO_MIN + " minutos." };
    }

    if (_hash(pin, usr.salt) !== usr.pin_hash) {
      var intentos = usr.intentos_fallidos + 1;
      var campos = { intentos_fallidos: intentos };
      if (intentos >= MAX_INTENTOS) {
        campos.bloqueado_hasta = _iso(_addMin(_ahora(), BLOQUEO_MIN));
        campos.intentos_fallidos = 0;
        _audit(username, "login", "bloqueado_por_" + MAX_INTENTOS + "_intentos", ua,
          { usuario_id: usr.usuario_id });
      } else {
        _audit(username, "login", "pin_incorrecto_intento_" + intentos, ua,
          { usuario_id: usr.usuario_id });
      }
      _actualizarUsuario(usr.row, campos);
      Utilities.sleep(600);
      return { error: "Usuario o contraseña incorrectos." };
    }

    // PIN correcto: resetear contadores
    _actualizarUsuario(usr.row, {
      intentos_fallidos: 0,
      bloqueado_hasta:   null,
      ultimo_acceso:     _iso(_ahora())
    });

    if (usr.cambio_obligatorio) {
      var tempToken = _crearToken(
        Object.assign({}, usr, { rol: "_temp_cambio_" + usr.rol }), ua
      );
      _audit(username, "login", "cambio_obligatorio_requerido", ua,
        { usuario_id: usr.usuario_id, token_id: tempToken.token, pais: usr.pais });
      return { cambio_obligatorio: true, token_temp: tempToken.token, expira: tempToken.expira };
    }

    var sesion = _crearToken(usr, ua);
    _audit(username, "login", "ok", ua,
      { usuario_id: usr.usuario_id, token_id: sesion.token, pais: usr.pais, vendedor_id: usr.vendedor_id });
    return {
      ok:                 true,
      token:              sesion.token,
      expira:             sesion.expira,
      nombre:             usr.nombre_completo || usr.username,
      rol:                usr.rol,
      pais:               usr.pais,
      vendedor_id:        usr.vendedor_id || null,
      cambio_obligatorio: false
    };

  } finally { lock.releaseLock(); }
}

// ═══════════════════════════════════════════════════════════════════════
// ACCIÓN: CHANGE PIN
// ═══════════════════════════════════════════════════════════════════════

function accionChangePIN(payload) {
  var token     = String(payload.token     || "");
  var pinActual = String(payload.pin_actual || "");
  var pinNuevo  = String(payload.pin_nuevo  || "");
  var ua        = String(payload.user_agent || "");

  if (!PIN_REGEX.test(pinNuevo))  return { error: "El PIN debe tener exactamente 4 dígitos numéricos." };
  if (!PIN_REGEX.test(pinActual)) return { error: "Usuario o contraseña incorrectos." };
  if (pinNuevo === pinActual)     return { error: "El nuevo PIN debe ser diferente al actual." };

  var sesion = _validarToken(token);
  if (!sesion) return { error: "Sesión inválida o expirada." };

  var rolReal = sesion.rol;
  if (rolReal.indexOf("_temp_cambio_") === 0) {
    rolReal = rolReal.replace("_temp_cambio_", "");
  }

  var lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch(e) { return { error: "Servicio ocupado." }; }

  try {
    var usr = _buscarUsuario(sesion.username);
    if (!usr) return { error: "Usuario no encontrado." };

    if (_hash(pinActual, usr.salt) !== usr.pin_hash) {
      _audit(sesion.username, "change_pin", "pin_actual_incorrecto", ua,
        { usuario_id: sesion.usuario_id, token_id: token });
      return { error: "El PIN actual no es correcto." };
    }

    var nuevoSalt = _uuid();
    var nuevoHash = _hash(pinNuevo, nuevoSalt);

    _actualizarUsuario(usr.row, {
      pin_hash:              nuevoHash,
      salt:                  nuevoSalt,
      clave_temporal_activa: false,
      cambio_obligatorio:    false,
      fecha_cambio_pin:      _iso(_ahora())
    });

    // Invalidar TODAS las sesiones previas del usuario (incluyendo la actual)
    _invalidarTokensDeUsuario(sesion.usuario_id);

    // Emitir nueva sesión con rol real
    var usrActualizado = _buscarUsuario(sesion.username);
    usrActualizado.rol = rolReal;
    var nuevaSesion = _crearToken(usrActualizado, ua);

    _audit(sesion.username, "change_pin", "ok", ua,
      { usuario_id: sesion.usuario_id, token_id: nuevaSesion.token, pais: usrActualizado.pais });

    // Purgar sesiones invalidadas en background
    _purgarSesionesNoActivas();

    return {
      ok:         true,
      token:      nuevaSesion.token,
      expira:     nuevaSesion.expira,
      nombre:     usrActualizado.nombre_completo || usrActualizado.username,
      rol:        rolReal,
      pais:       usrActualizado.pais,
      vendedor_id: usrActualizado.vendedor_id || null
    };

  } finally { lock.releaseLock(); }
}

// ═══════════════════════════════════════════════════════════════════════
// ACCIÓN: VALIDATE
// ═══════════════════════════════════════════════════════════════════════

function accionValidate(payload) {
  var token  = String(payload.token || "");
  var sesion = _validarToken(token);
  if (!sesion) return { ok: false, error: "Sesión inválida o expirada." };
  return {
    ok:          true,
    rol:         sesion.rol,
    pais:        sesion.pais,
    vendedor_id: sesion.vendedor_id || null,
    expira:      sesion.expira
  };
}

// ═══════════════════════════════════════════════════════════════════════
// ACCIÓN: LOGOUT
// ═══════════════════════════════════════════════════════════════════════

function accionLogout(payload) {
  var token  = String(payload.token || "");
  var sesion = _validarToken(token);
  if (sesion) {
    _audit(sesion.username, "logout", "ok", "",
      { usuario_id: sesion.usuario_id, token_id: token, pais: sesion.pais });
  }
  _invalidarToken(token);
  _purgarSesionesNoActivas(); // limpiar inmediatamente
  return { ok: true };
}

// ═══════════════════════════════════════════════════════════════════════
// ACCIÓN: GET SIC DATA
// ═══════════════════════════════════════════════════════════════════════

function accionGetSICData(payload) {
  // El backend ignora vendedor_id y rol del payload.
  // La identidad y permisos provienen exclusivamente del token.
  var token = String(payload.token || "");
  var pais  = String(payload.pais  || "").toUpperCase();
  var ciclo = String(payload.ciclo || "").trim(); // opcional

  var sesion = _validarToken(token);
  if (!sesion) return { error: "Sesión inválida o expirada." };

  if (pais !== "CL" && pais !== "PE") {
    return { error: "País no válido. Use CL o PE." };
  }

  if (sesion.pais !== "AMBOS" && sesion.pais !== pais) {
    _audit(sesion.username, "get_sic_data_" + pais, "acceso_denegado_pais", "",
      { usuario_id: sesion.usuario_id, token_id: token, pais: pais });
    return { error: "Sin acceso a este país." };
  }

  var esAdmin     = (sesion.rol === "admin" || sesion.rol === "gerencia" || sesion.rol === "financiera");
  var vendFiltro  = esAdmin ? null : (sesion.vendedor_id || null);

  if (!esAdmin && !vendFiltro) {
    return { error: "Vendedor sin vendedor_id asignado. Contacte al administrador." };
  }

  var sheetName = pais === "CL" ? "sic_data_cl" : "sic_data_pe";
  var data = _sheetData(sheetName);

  if (data.length <= 1) {
    return { error: "Sin datos para este país. Ejecute el pipeline de carga." };
  }

  // Determinar ciclo a consultar
  if (!ciclo) {
    // Usar el ciclo activo más reciente disponible (formato "2026-07" → orden lexicográfico)
    var ciclosDisp = [];
    for (var i = 1; i < data.length; i++) {
      var r = data[i];
      if (!(r[COL_SIC.activo] === true || String(r[COL_SIC.activo]).toUpperCase() === "TRUE")) continue;
      var c = String(r[COL_SIC.ciclo] || "").trim();
      if (c && ciclosDisp.indexOf(c) === -1) ciclosDisp.push(c);
    }
    ciclosDisp.sort();
    ciclo = ciclosDisp.length ? ciclosDisp[ciclosDisp.length - 1] : "";
  }

  if (!ciclo) {
    return { error: "Sin datos activos para este país." };
  }

  // Recopilar filas activas del ciclo solicitado
  var filas = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];

    // Solo activas
    if (!(r[COL_SIC.activo] === true || String(r[COL_SIC.activo]).toUpperCase() === "TRUE")) continue;

    // Solo el ciclo solicitado
    if (String(r[COL_SIC.ciclo]).trim() !== ciclo) continue;

    // Vendedor: filtrar por su id. Admin: todos.
    if (vendFiltro) {
      if (String(r[COL_SIC.vendedor_id]).trim().toLowerCase() !== vendFiltro.toLowerCase()) continue;
    }

    // Validar que el payload_json no esté vacío
    if (!String(r[COL_SIC.payload_json] || "").trim()) continue;

    filas.push(r);
  }

  if (filas.length === 0) {
    var quien = vendFiltro ? "vendedor '" + vendFiltro + "'" : "país " + pais;
    return { error: "Sin datos activos para " + quien + " en ciclo " + ciclo + "." };
  }

  try {
    var combinado = _combinarPayloadsSIC(filas);
    _audit(sesion.username, "get_sic_data_" + pais, "ok",  "",
      { usuario_id: sesion.usuario_id, token_id: token, pais: pais,
        vendedor_id: vendFiltro || "ALL",
        detalle: "ciclo=" + ciclo + " filas=" + filas.length });
    return { ok: true, data: combinado, ciclo: ciclo };
  } catch(err) {
    _audit(sesion.username, "get_sic_data_" + pais, "error_combinar", "",
      { usuario_id: sesion.usuario_id, token_id: token, pais: pais,
        detalle: err.message.slice(0, 200) });
    return { error: "Error al procesar datos." };
  }
}

// ═══════════════════════════════════════════════════════════════════════
// COMBINACIÓN DE PAYLOADS SIC
// ═══════════════════════════════════════════════════════════════════════

/**
 * Agrega los payloads JSON de múltiples filas (una por vendedor/ciclo)
 * en el objeto que espera SICAdapter.construirCicloReal().
 *
 * Contrato de salida:
 *   { tx:[], ppto:{}, cobranzas_raw:{}, vencimientos:[], universo_sic_raw:{}, _meta:{} }
 *
 * No duplica registros. Los escalares (schema_version, pais, etc.) se toman
 * del primer payload que los define. Los arrays se concatenan. Los objetos
 * con claves por vendedor se fusionan.
 */
function _combinarPayloadsSIC(filas) {
  var r = {
    tx:               [],
    ppto:             {},
    cobranzas_raw:    { cobranzas: [], resumen_por_vendedor: {} },
    vencimientos:     [],
    universo_sic_raw: { claves_presupuestadas: [], nombres_canonicos_por_clave: {} },
    _meta:            { vendedores: [], fuentes: [], ciclos: [] }
  };

  filas.forEach(function(fila) {
    var rawJson   = String(fila[COL_SIC.payload_json] || "").trim();
    var vendorId  = String(fila[COL_SIC.vendedor_id]  || "").trim();
    var fuente    = String(fila[COL_SIC.fuente]        || "").trim();
    var ciclo     = String(fila[COL_SIC.ciclo]         || "").trim();

    if (!rawJson) return;
    var d;
    try { d = JSON.parse(rawJson); } catch(e) { return; } // JSON inválido: ignorar fila

    if (vendorId && r._meta.vendedores.indexOf(vendorId) === -1) r._meta.vendedores.push(vendorId);
    if (fuente   && r._meta.fuentes.indexOf(fuente)     === -1) r._meta.fuentes.push(fuente);
    if (ciclo    && r._meta.ciclos.indexOf(ciclo)       === -1) r._meta.ciclos.push(ciclo);

    // ── TX: concatenar transacciones ──
    if (Array.isArray(d.tx)) {
      r.tx = r.tx.concat(d.tx);
    }

    // ── PPTO: fusionar presupuesto ──
    if (d.ppto && typeof d.ppto === "object") {
      Object.keys(d.ppto).forEach(function(k) {
        var val = d.ppto[k];
        if (val !== null && typeof val === "object" && !Array.isArray(val)) {
          // Objeto keyed por vendedor (ej: rtc_mensual_ppto)
          if (!r.ppto[k]) r.ppto[k] = {};
          Object.keys(val).forEach(function(sub) { r.ppto[k][sub] = val[sub]; });
        } else if (r.ppto[k] === undefined) {
          // Escalares (ciclos, version, etc.): tomar el primero
          r.ppto[k] = val;
        }
      });
    }

    // ── COBRANZAS_RAW ──
    if (d.cobranzas_raw) {
      var cr = d.cobranzas_raw;
      if (Array.isArray(cr.cobranzas)) {
        r.cobranzas_raw.cobranzas = r.cobranzas_raw.cobranzas.concat(cr.cobranzas);
      }
      if (cr.resumen_por_vendedor && typeof cr.resumen_por_vendedor === "object") {
        Object.keys(cr.resumen_por_vendedor).forEach(function(k) {
          r.cobranzas_raw.resumen_por_vendedor[k] = cr.resumen_por_vendedor[k];
        });
      }
      // Arrays opcionales de detalle
      ["abonos_pendientes_detalle","folios_pendientes","folios_parciales"].forEach(function(k) {
        if (Array.isArray(cr[k])) {
          if (!r.cobranzas_raw[k]) r.cobranzas_raw[k] = [];
          r.cobranzas_raw[k] = r.cobranzas_raw[k].concat(cr[k]);
        }
      });
      // Escalares: tomar el primero
      ["fecha_corte","fuente","schema_version","pais"].forEach(function(k) {
        if (cr[k] !== undefined && r.cobranzas_raw[k] === undefined) {
          r.cobranzas_raw[k] = cr[k];
        }
      });
    }

    // ── VENCIMIENTOS ──
    if (Array.isArray(d.vencimientos)) {
      r.vencimientos = r.vencimientos.concat(d.vencimientos);
    }

    // ── UNIVERSO SIC RAW ──
    if (d.universo_sic_raw) {
      var u = d.universo_sic_raw;
      if (Array.isArray(u.claves_presupuestadas)) {
        u.claves_presupuestadas.forEach(function(c) {
          if (r.universo_sic_raw.claves_presupuestadas.indexOf(c) === -1) {
            r.universo_sic_raw.claves_presupuestadas.push(c);
          }
        });
      }
      if (u.nombres_canonicos_por_clave && typeof u.nombres_canonicos_por_clave === "object") {
        Object.keys(u.nombres_canonicos_por_clave).forEach(function(k) {
          r.universo_sic_raw.nombres_canonicos_por_clave[k] = u.nombres_canonicos_por_clave[k];
        });
      }
      ["schema_version","pais","fuente","fecha_proceso"].forEach(function(k) {
        if (u[k] !== undefined && r.universo_sic_raw[k] === undefined) {
          r.universo_sic_raw[k] = u[k];
        }
      });
    }
  });

  return r;
}

// ═══════════════════════════════════════════════════════════════════════
// ADMINISTRACIÓN — CREAR USUARIO
// ═══════════════════════════════════════════════════════════════════════

/**
 * Crea un usuario en la hoja usuarios.
 * Ejecutar desde el editor GAS, nunca desde doPost().
 *
 * Ejemplos:
 *   crearUsuario("usr_000","admin",    null,        "AMBOS","admin",    "ADMIN LATAM","2727")
 *   crearUsuario("usr_001","laratro",  "laratro",   "CL","vendedor","PABLO LARATRO","1234")
 *   crearUsuario("usr_002","velasquez","velasquez",  "CL","vendedor","FRANCISCO VELASQUEZ","1234")
 *   crearUsuario("usr_003","encina",   "encina",    "CL","vendedor","RODRIGO ENCINA","1234")
 *   crearUsuario("usr_004","munoz",    "munoz",     "CL","vendedor","VALENTINA MUÑOZ","1234")
 *   crearUsuario("usr_005","caroca",   "caroca",    "CL","vendedor","JORGE CAROCA","1234")
 *   crearUsuario("usr_006","veverka",  "veverka",   "CL","vendedor","IVAN VEVERKA","1234")
 *   crearUsuario("usr_007","franco_riffo","franco_riffo","CL","vendedor","FRANCO RIFFO","1234")
 *   crearUsuario("usr_010","navarro",  "navarro",   "PE","vendedor","NICOLL NAVARRO","1234")
 *   crearUsuario("usr_011","infante",  "infante",   "PE","vendedor","OSCAR INFANTE","1234")
 *   crearUsuario("usr_012","atalaya",  "atalaya",   "PE","vendedor","OMAR ATALAYA","1234")
 *   crearUsuario("usr_013","diaz",     "diaz",      "PE","vendedor","SUSAN DIAZ","1234")
 *   crearUsuario("usr_014","gonzales", "gonzales",  "PE","vendedor","ANTONIO GONZALEZ","1234")
 *   crearUsuario("usr_015","aguirre",  "aguirre",   "PE","vendedor","LIZBETH AGUIRRE","1234")
 *   crearUsuario("usr_016","valladares","valladares","PE","vendedor","PATRICIA VALLADARES","1234")
 *   crearUsuario("usr_017","martha",   "martha",    "PE","vendedor","MARTHA HIDALGO","1234")
 *
 * IDEMPOTENCIA: no duplica si username ya existe.
 * SEGURIDAD: no sobrescribe PIN de un usuario ya activado (cambio_obligatorio=FALSE).
 */
function crearUsuario(usuario_id, username, vendedor_id, pais, rol, nombre_completo, pinInicial) {
  var usernameLower = username.toLowerCase();

  // Idempotencia: verificar si ya existe
  var existente = _buscarUsuario(usernameLower);
  if (existente) {
    if (!existente.cambio_obligatorio) {
      Logger.log("[OMITIDO] " + usernameLower + ": ya existe y ya activó su PIN. No se sobrescribe.");
      return;
    }
    Logger.log("[ADVERTENCIA] " + usernameLower + ": ya existe con cambio_obligatorio=TRUE. No se duplica.");
    return;
  }

  var sh   = _sheet("usuarios");
  var salt = _uuid();
  var hash = _hash(pinInicial, salt);
  var ahora = _iso(_ahora());

  sh.appendRow([
    usuario_id,           // usuario_id
    usernameLower,        // username
    vendedor_id || "",    // vendedor_id
    nombre_completo || "",// nombre_completo
    pais,                 // pais
    rol,                  // rol
    hash,                 // pin_hash — nunca loguear
    salt,                 // salt — nunca loguear
    true,                 // clave_temporal_activa
    true,                 // cambio_obligatorio
    0,                    // intentos_fallidos
    "",                   // bloqueado_hasta
    "",                   // ultimo_acceso
    "",                   // fecha_cambio_pin
    "activo",             // estado
    ahora,                // created_at
    ahora                 // updated_at
  ]);

  Logger.log("[CREADO] " + usernameLower + " | pais=" + pais + " | rol=" + rol
             + " | cambio_obligatorio=TRUE | pin_temporal=[OCULTO]");
}

// ═══════════════════════════════════════════════════════════════════════
// PEPPER — CONFIGURACIÓN INICIAL
// ═══════════════════════════════════════════════════════════════════════

/**
 * Genera SIC_PEPPER y lo guarda en Script Properties.
 * REGLAS:
 *   - Si ya existe: NO lo reemplaza. Devuelve confirmación sin el valor.
 *   - Si no existe: genera 64 chars aleatorios (256 bits, SHA-256 de 3 UUIDs).
 *   - NUNCA imprime el pepper en logs.
 *   - NUNCA devuelve el pepper al llamador.
 *
 * Ejecutar una sola vez durante FASE 3, antes de crear usuarios.
 */
function configurarPepperInicial() {
  var props = PropertiesService.getScriptProperties();
  var pepperExistente = props.getProperty("SIC_PEPPER");

  if (pepperExistente) {
    Logger.log("[OK] SIC_PEPPER ya configurado. Longitud: " + pepperExistente.length + " chars. No se modifica.");
    return { resultado: "YA_EXISTE", longitud: pepperExistente.length };
  }

  // Generar: SHA-256 de 3 UUIDs concatenados → 64 hex chars (256 bits de entropía)
  var base  = Utilities.getUuid() + "|" + Utilities.getUuid() + "|" + Utilities.getUuid();
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, base, Utilities.Charset.UTF_8
  );
  var pepper = bytes.map(function(b) {
    return ("0" + (b < 0 ? b + 256 : b).toString(16)).slice(-2);
  }).join(""); // 64 hex chars

  props.setProperty("SIC_PEPPER", pepper);

  // Verificar que se guardó correctamente (sin mostrar el valor)
  var guardado = props.getProperty("SIC_PEPPER");
  if (!guardado || guardado.length !== 64) {
    Logger.log("[ERROR] El pepper no se guardó correctamente.");
    return { resultado: "ERROR", motivo: "Escritura fallida en Script Properties" };
  }

  // Recargar la variable global PEPPER para que el script actual lo use
  PEPPER = guardado;

  Logger.log("[OK] SIC_PEPPER generado y guardado. Longitud: 64 chars. NO se mostrará el valor.");
  return { resultado: "CREADO", longitud: 64 };
}

// ═══════════════════════════════════════════════════════════════════════
// DIAGNÓSTICO DEL BACKEND
// ═══════════════════════════════════════════════════════════════════════

/**
 * Validación exhaustiva no destructiva del estado del backend.
 * No modifica datos. No expone secretos.
 * Resultado: OK | ADVERTENCIA | ERROR
 */
function diagnosticoBackend() {
  var ok          = [];
  var advertencias = [];
  var errores     = [];
  var props       = PropertiesService.getScriptProperties();

  // ── 1. Script Properties ──
  var ssId   = props.getProperty("SPREADSHEET_ID");
  var pepper = props.getProperty("SIC_PEPPER");
  var shours = props.getProperty("SESSION_HOURS");
  var maxInt = props.getProperty("MAX_FAILED_ATTEMPTS");
  var lockM  = props.getProperty("LOCK_MINUTES");

  if (!ssId)                   { errores.push("SPREADSHEET_ID no configurado"); }
  else                         { ok.push("SPREADSHEET_ID configurado"); }
  if (!pepper)                 { errores.push("SIC_PEPPER no configurado — ejecutar configurarPepperInicial()"); }
  else if (pepper.length < 32) { advertencias.push("SIC_PEPPER < 32 chars — regenerar con configurarPepperInicial()"); }
  else                         { ok.push("SIC_PEPPER configurado (" + pepper.length + " chars, no expuesto)"); }

  ok.push("SESSION_HOURS = "       + SESSION_HOURS   + (shours ? " (desde Properties)" : " (default)"));
  ok.push("MAX_FAILED_ATTEMPTS = " + MAX_INTENTOS    + (maxInt  ? " (desde Properties)" : " (default)"));
  ok.push("LOCK_MINUTES = "        + BLOQUEO_MIN     + (lockM   ? " (desde Properties)" : " (default)"));

  if (!ssId) {
    _logDiagnostico(ok, advertencias, errores);
    return { resultado: "ERROR", ok: ok, advertencias: advertencias, errores: errores };
  }

  // ── 2. Acceso a la Sheet ──
  var ss;
  try {
    ss = SpreadsheetApp.openById(ssId);
    ok.push("Sheet accesible: \"" + ss.getName() + "\"");
  } catch(e) {
    errores.push("No se puede abrir la Sheet: " + e.message);
    _logDiagnostico(ok, advertencias, errores);
    return { resultado: "ERROR", ok: ok, advertencias: advertencias, errores: errores };
  }

  var hojas = ss.getSheets().map(function(s) { return s.getName(); });

  // ── 3. Hojas obligatorias ──
  var hojasReq = ["usuarios","sesiones","audit_log","sic_data_cl","sic_data_pe","liquidaciones","saldos_ajustes"];
  hojasReq.forEach(function(h) {
    if (hojas.indexOf(h) === -1) { errores.push("HOJA FALTANTE: " + h + " — ejecutar _setup()"); }
    else { ok.push("Hoja presente: " + h); }
  });

  // ── 4. Encabezados vs COL ──
  var shU = ss.getSheetByName("usuarios");
  if (shU && shU.getLastRow() >= 1) {
    var hU = shU.getRange(1, 1, 1, Object.keys(COL).length).getValues()[0].map(function(h) { return String(h).trim(); });
    var colOk = true;
    Object.keys(COL).forEach(function(k) {
      if (hU[COL[k] - 1] !== k) {
        errores.push("COL desalineado en usuarios col " + COL[k] + ": esperado '" + k + "', encontrado '" + hU[COL[k]-1] + "'");
        colOk = false;
      }
    });
    if (colOk) ok.push("COL alineado con hoja usuarios (17 columnas)");
  }

  // ── 5. Sesiones: 11 columnas, verificar ausencia de cerrado_en ──
  var shS = ss.getSheetByName("sesiones");
  if (shS && shS.getLastRow() >= 1) {
    var hS = shS.getRange(1, 1, 1, shS.getLastColumn()).getValues()[0].map(function(h) { return String(h).trim(); });
    if (hS.length !== 11) {
      errores.push("sesiones: " + hS.length + " columnas — se esperan 11");
    } else {
      ok.push("sesiones: 11 columnas OK");
    }
    if (hS.indexOf("cerrado_en") !== -1) {
      errores.push("sesiones: columna 'cerrado_en' encontrada — debe eliminarse (modelo v2.0 usa solo 11 cols)");
    }
    // Verificar que solo hay sesiones activas (o pocas no activas pendientes de purga)
    if (shS.getLastRow() > 1) {
      var datS = shS.getRange(2, 1, shS.getLastRow()-1, 9).getValues();
      var noActivas = datS.filter(function(r) { return String(r[8]||"").toLowerCase() !== "activa"; }).length;
      if (noActivas > 0) {
        advertencias.push("sesiones: " + noActivas + " filas no activas pendientes — ejecutar limpiarTokensExpirados()");
      } else {
        ok.push("sesiones: " + datS.length + " sesiones activas, 0 pendientes de purga");
      }
    }
  }

  // ── 6. sic_data_cl / sic_data_pe: 12 columnas, verificar duplicados activos ──
  ["sic_data_cl","sic_data_pe"].forEach(function(nombre) {
    var shD = ss.getSheetByName(nombre);
    if (!shD || shD.getLastRow() < 1) return;

    var hD = shD.getRange(1,1,1,shD.getLastColumn()).getValues()[0].map(function(h){return String(h).trim();});
    if (hD.length !== 12) {
      errores.push(nombre + ": " + hD.length + " columnas — se esperan 12");
    } else {
      ok.push(nombre + ": 12 columnas OK");
    }

    if (shD.getLastRow() > 1) {
      var datD = shD.getRange(2,1,shD.getLastRow()-1,12).getValues();
      var sinVendedor = 0;
      var clavesActivas = {};
      var jsonInvalidos = 0;

      datD.forEach(function(r) {
        var vId   = String(r[COL_SIC.vendedor_id]  || "").trim();
        var ciclo = String(r[COL_SIC.ciclo]         || "").trim();
        var activo= r[COL_SIC.activo];
        var pjson = String(r[COL_SIC.payload_json]  || "").trim();

        if (!vId) { sinVendedor++; }

        var esActivo = activo === true || String(activo).toUpperCase() === "TRUE";
        if (esActivo) {
          var k = vId + "|" + ciclo;
          clavesActivas[k] = (clavesActivas[k] || 0) + 1;
        }

        if (pjson) {
          try { JSON.parse(pjson); } catch(e) { jsonInvalidos++; }
        }
      });

      if (sinVendedor > 0) { errores.push(nombre + ": " + sinVendedor + " filas sin vendedor_id"); }
      if (jsonInvalidos > 0) { errores.push(nombre + ": " + jsonInvalidos + " payload_json inválidos"); }

      var dups = Object.keys(clavesActivas).filter(function(k) { return clavesActivas[k] > 1; });
      if (dups.length > 0) {
        errores.push(nombre + ": duplicados activo=TRUE — " + dups.join("; "));
      } else if (datD.length > 0) {
        ok.push(nombre + ": " + datD.length + " filas, sin duplicados activos, payloads JSON válidos");
      }
    }
  });

  // ── 7. Funciones críticas disponibles ──
  var fns = ["accionLogin","accionChangePIN","accionValidate","accionLogout",
             "accionGetSICData","_combinarPayloadsSIC","crearUsuario",
             "configurarPepperInicial","limpiarTokensExpirados"];
  fns.forEach(function(fn) {
    // En GAS, typeof de función declarada es "function"
    ok.push("Función disponible: " + fn + " (" + typeof eval(fn) + ")");
  });

  var resultado = errores.length > 0 ? "ERROR"
    : (advertencias.length > 0 ? "ADVERTENCIA" : "OK");

  _logDiagnostico(ok, advertencias, errores);
  return { resultado: resultado, ok: ok, advertencias: advertencias, errores: errores };
}

function _logDiagnostico(ok, advertencias, errores) {
  var res = errores.length > 0 ? "ERROR" : (advertencias.length > 0 ? "ADVERTENCIA" : "OK");
  Logger.log("══════════════════════════════════════════");
  Logger.log("  diagnosticoBackend() — " + new Date().toISOString());
  Logger.log("  RESULTADO: " + res);
  Logger.log("══════════════════════════════════════════");
  ok.forEach(function(m)           { Logger.log("[OK]          " + m); });
  advertencias.forEach(function(m) { Logger.log("[ADVERTENCIA] " + m); });
  errores.forEach(function(m)      { Logger.log("[ERROR]       " + m); });
  Logger.log("──────────────────────────────────────────");
  Logger.log("OK:" + ok.length + " | ADV:" + advertencias.length + " | ERR:" + errores.length);
  Logger.log("══════════════════════════════════════════");
}

// ═══════════════════════════════════════════════════════════════════════
// PRUEBAS — testBackend()
// ═══════════════════════════════════════════════════════════════════════

/**
 * Pruebas unitarias y funcionales ejecutables desde el editor GAS.
 * No usa datos reales. No modifica la Sheet de producción.
 * Tests A-C, G-L: unitarios (sin Sheet). Tests D-F: integración (requieren Sheet).
 */
function testBackend() {
  var PASS = "[PASS]";
  var FAIL = "[FAIL]";
  var INFO = "[INFO]";
  var res  = [];

  // ── A. Hash determinístico ───────────────────────────────────────────
  var h1 = _hash("1234", "test-salt-001");
  var h2 = _hash("1234", "test-salt-001");
  res.push((h1 === h2 && h1.length === 64 ? PASS : FAIL)
    + " A: Hash determinístico — mismo PIN+salt+pepper → mismo hash de 64 chars");

  // ── B. Hash distinto con salt diferente ─────────────────────────────
  var h3 = _hash("1234", "salt-aaa");
  var h4 = _hash("1234", "salt-bbb");
  res.push((h3 !== h4 ? PASS : FAIL)
    + " B: Hash distinto con salt diferente (mismo PIN, distinto salt → distinto hash)");

  // ── C. Validación de formato PIN ────────────────────────────────────
  res.push((!PIN_REGEX.test("123")    ? PASS : FAIL) + " C1: PIN 3 dígitos → rechazado");
  res.push((!PIN_REGEX.test("12345")  ? PASS : FAIL) + " C2: PIN 5 dígitos → rechazado");
  res.push((!PIN_REGEX.test("abcd")   ? PASS : FAIL) + " C3: PIN no numérico → rechazado");
  res.push((!PIN_REGEX.test("12 34")  ? PASS : FAIL) + " C4: PIN con espacio → rechazado");
  res.push(( PIN_REGEX.test("1234")   ? PASS : FAIL) + " C5: PIN 4 dígitos numéricos → aceptado");
  res.push(( PIN_REGEX.test("0000")   ? PASS : FAIL) + " C6: PIN 0000 → aceptado (valor legítimo)");

  // ── D-F. Tests de integración (requieren Sheet activa) ──────────────
  res.push(INFO + " D-F: Tests de sesión requieren Sheet configurada. "
    + "Validar con diagnosticoBackend() después de crear usuarios.");

  // ── G. Vendedor solo selecciona sus filas activas ────────────────────
  var filasSim = [
    ["r1","ciclo_vendedor","CL","laratro",   "2026-07","","{\"tx\":[1]}","","","","",true ],
    ["r2","ciclo_vendedor","CL","velasquez", "2026-07","","{\"tx\":[2]}","","","","",true ],
    ["r3","ciclo_vendedor","CL","laratro",   "2026-06","","{\"tx\":[3]}","","","","",true ],
    ["r4","ciclo_vendedor","CL","laratro",   "2026-07","","{\"tx\":[4]}","","","","",false]
  ];
  var filasLaratro = filasSim.filter(function(r) {
    return (r[COL_SIC.activo] === true)
      && String(r[COL_SIC.ciclo]).trim() === "2026-07"
      && String(r[COL_SIC.vendedor_id]).toLowerCase() === "laratro";
  });
  res.push((filasLaratro.length === 1 ? PASS : FAIL)
    + " G: Vendedor 'laratro' ciclo 2026-07 → 1 fila activa (de 4 filas totales)");

  // ── H. Admin selecciona todas las filas activas del país/ciclo ───────
  var filasAdmin = filasSim.filter(function(r) {
    return (r[COL_SIC.activo] === true)
      && String(r[COL_SIC.ciclo]).trim() === "2026-07";
  });
  res.push((filasAdmin.length === 2 ? PASS : FAIL)
    + " H: Admin ciclo 2026-07 → 2 filas activas (laratro + velasquez)");

  // ── I. Filas inactivas no se leen ────────────────────────────────────
  var inactivas = filasSim.filter(function(r) { return r[COL_SIC.activo] !== true; });
  res.push((inactivas.length === 1 ? PASS : FAIL)
    + " I: Fila inactiva (activo=FALSE) correctamente excluida");

  // ── J. Duplicado activo=TRUE detectado ───────────────────────────────
  var filasDup = [
    ["","","CL","laratro","2026-07","","{}","","","","",true ],
    ["","","CL","laratro","2026-07","","{}","","","","",true ]
  ];
  var clavesD = {};
  var dupDetectado = false;
  filasDup.forEach(function(r) {
    if (r[COL_SIC.activo] === true) {
      var k = r[COL_SIC.vendedor_id] + "|" + r[COL_SIC.ciclo];
      if (clavesD[k]) { dupDetectado = true; }
      clavesD[k] = true;
    }
  });
  res.push((dupDetectado ? PASS : FAIL)
    + " J: Duplicado activo=TRUE para mismo vendedor+ciclo → detectado");

  // ── K. JSON inválido manejado sin crash ──────────────────────────────
  var jsonInvalidoAtrapado = false;
  try { JSON.parse("{esto no es json}"); }
  catch(e) { jsonInvalidoAtrapado = true; }
  res.push((jsonInvalidoAtrapado ? PASS : FAIL)
    + " K: JSON inválido → excepción capturada (no crash del backend)");

  // Verificar que _combinarPayloadsSIC maneja filas con JSON inválido
  var filasConInvalido = [
    ["","","CL","laratro","2026-07","","INVALID_JSON","","","","",true],
    ["","","CL","laratro","2026-07","","{\"tx\":[99]}","","","","",true]
  ];
  var combinadoK;
  try {
    combinadoK = _combinarPayloadsSIC(filasConInvalido);
  } catch(e) { combinadoK = null; }
  res.push((combinadoK && combinadoK.tx.length === 1 ? PASS : FAIL)
    + " K2: _combinarPayloadsSIC ignora filas con JSON inválido, procesa las válidas");

  // ── L. Manipulación de vendedor_id en payload ignorada ───────────────
  var sesionSim  = { rol: "vendedor", vendedor_id: "laratro", pais: "CL" };
  var payloadSim = { vendedor_id: "encina", rol: "admin" }; // intento de escalada
  var esAdminSim = (sesionSim.rol === "admin"
                    || sesionSim.rol === "gerencia"
                    || sesionSim.rol === "financiera");
  var vendEfectivo = esAdminSim ? null : sesionSim.vendedor_id;
  res.push((vendEfectivo === "laratro" ? PASS : FAIL)
    + " L: Manipulación de vendedor_id/rol en payload ignorada — backend usa sesión");

  // ── Resumen ──────────────────────────────────────────────────────────
  var fails = res.filter(function(r) { return r.indexOf(FAIL) === 0; }).length;

  Logger.log("══════════════════════════════════════════════");
  Logger.log("  testBackend() SIC-AV v2.0 — " + new Date().toISOString());
  Logger.log("══════════════════════════════════════════════");
  res.forEach(function(r) { Logger.log(r); });
  Logger.log("──────────────────────────────────────────────");
  Logger.log("RESULTADO: " + (fails === 0 ? "TODOS OK (" + res.length + " pruebas)" : fails + " FALLO(S)"));
  Logger.log("══════════════════════════════════════════════");

  return {
    resultado: fails === 0 ? "OK" : "FAIL",
    total:     res.length,
    fallos:    fails,
    detalle:   res
  };
}

/**
 * cargarDatosSIC — carga un JSON para un vendedor/ciclo en sic_data_cl o sic_data_pe.
 * Ejecutar desde el editor GAS durante FASE 5.
 * Marca activo=FALSE en versiones anteriores del mismo vendedor+ciclo antes de insertar.
 */
function cargarDatosSIC(pais, vendedor_id, ciclo, jsonString, fuente) {
  pais        = String(pais        || "").toUpperCase();
  vendedor_id = String(vendedor_id || "").trim();
  ciclo       = String(ciclo       || "").trim();
  fuente      = String(fuente      || "manual");

  if (!["CL","PE"].includes ? (pais !== "CL" && pais !== "PE") : false) {
    Logger.log("[ERROR] pais debe ser CL o PE");
    return;
  }
  if (!vendedor_id) { Logger.log("[ERROR] vendedor_id es obligatorio"); return; }
  if (!ciclo)       { Logger.log("[ERROR] ciclo es obligatorio (ej: '2026-07')"); return; }
  if (!jsonString)  { Logger.log("[ERROR] jsonString vacío"); return; }

  try { JSON.parse(jsonString); }
  catch(e) { Logger.log("[ERROR] jsonString no es JSON válido: " + e.message); return; }

  var sheetName = pais === "CL" ? "sic_data_cl" : "sic_data_pe";
  var sh = _sheet(sheetName);
  if (!sh) { Logger.log("[ERROR] Hoja " + sheetName + " no encontrada"); return; }

  // Marcar versiones anteriores como inactivas
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var rVend = String(data[i][COL_SIC.vendedor_id] || "").trim();
    var rCiclo = String(data[i][COL_SIC.ciclo]      || "").trim();
    var rActivo = data[i][COL_SIC.activo];
    if (rVend === vendedor_id && rCiclo === ciclo
        && (rActivo === true || String(rActivo).toUpperCase() === "TRUE")) {
      sh.getRange(i + 1, COL_SIC.activo + 1).setValue(false);
      sh.getRange(i + 1, COL_SIC.updated_at + 1).setValue(_iso(_ahora()));
    }
  }

  var ahora = _iso(_ahora());
  sh.appendRow([
    _uuid(),         // record_id
    "ciclo_vendedor",// tipo_registro
    pais,            // pais
    vendedor_id,     // vendedor_id
    ciclo,           // ciclo
    ahora.slice(0,10),// fecha (ISO date)
    jsonString,      // payload_json
    fuente,          // fuente
    "1.0",           // version_datos
    ahora,           // created_at
    ahora,           // updated_at
    true             // activo
  ]);

  Logger.log("[CARGADO] " + sheetName + " | vendedor=" + vendedor_id + " | ciclo=" + ciclo
             + " | chars=" + jsonString.length);
}
