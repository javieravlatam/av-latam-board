/**
 * SIC-AV — Backend de Autenticación y Datos Seguros
 * Google Apps Script Web App  ·  v1.0  ·  2026-08-04
 * ═══════════════════════════════════════════════════════════════════════
 * DESPLIEGUE:
 *   1. Abrir script.google.com, crear proyecto "sic-av-auth"
 *   2. Pegar este código en Code.gs
 *   3. En Script Properties agregar:  SIC_PEPPER = <cadena aleatoria secreta>
 *                                     SPREADSHEET_ID = <ID del Google Sheet>
 *   4. Implementar → Nueva implementación → Aplicación web
 *      Ejecutar como: YO  |  Quién tiene acceso: Cualquier persona
 *   5. Copiar la URL de la webapp y ponerla en sic_auth.js → GAS_URL
 *
 * GOOGLE SHEET requerido (mismo Spreadsheet):
 *   Hoja "usuarios"   — ver columnas abajo
 *   Hoja "sesiones"   — tokens activos
 *   Hoja "audit_log"  — registro de accesos
 *   Hoja "sic_data_cl" — datos SIC Chile (columna A fila 1 = JSON completo)
 *   Hoja "sic_data_pe" — datos SIC Perú  (columna A fila 1 = JSON completo)
 *
 * COLUMNAS hoja "usuarios":
 *   A  usuario_id            (string único, ej. "usr_001")
 *   B  username              (apellido / "admin", lowercase)
 *   C  vendedor_id           (clave interna en datos, null para admin/gerencia)
 *   D  pais                  ("CL" | "PE" | "AMBOS")
 *   E  rol                   ("vendedor" | "gerencia" | "financiera" | "admin")
 *   F  pin_hash              (SHA-256 del PIN concatenado con salt y pepper)
 *   G  salt                  (UUID individual por usuario)
 *   H  clave_temporal_activa (TRUE/FALSE)
 *   I  cambio_obligatorio    (TRUE/FALSE)
 *   J  intentos_fallidos     (int)
 *   K  bloqueado_hasta       (ISO datetime o vacío)
 *   L  ultimo_acceso         (ISO datetime)
 *   M  fecha_cambio_pin      (ISO datetime)
 *   N  estado                ("activo" | "inactivo")
 *
 * COLUMNAS hoja "sesiones":
 *   A  token  B  usuario_id  C  username  D  vendedor_id  E  pais  F  rol
 *   G  emitido  H  expira  I  estado ("activa"|"invalida"|"expirada")  J  user_agent
 *
 * COLUMNAS hoja "audit_log":
 *   A  timestamp  B  username  C  accion  D  resultado  E  user_agent
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

// ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
var SPREADSHEET_ID  = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
var PEPPER          = PropertiesService.getScriptProperties().getProperty("SIC_PEPPER");
var SESSION_HOURS   = 8;
var MAX_INTENTOS    = 5;
var BLOQUEO_MIN     = 30;
var PIN_REGEX       = /^[0-9]{4}$/;

// ─── ENTRY POINTS ─────────────────────────────────────────────────────────────
function doPost(e) {
  var cors = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "https://REEMPLAZAR_CON_DOMINIO_GITHUB_PAGES.github.io",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type"
  };
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
    return _respuesta(result, cors);
  } catch (err) {
    _audit("?", "error_global", err.message, "");
    return _respuesta({ error: "Error interno del servidor." }, cors);
  }
}

function doGet() {
  // GET no sirve datos — evita scraping accidental
  return ContentService.createTextOutput(JSON.stringify({ error: "Método no permitido." }))
    .setMimeType(ContentService.MimeType.JSON);
}

function _respuesta(data, headers) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── HELPERS CRIPTOGRÁFICOS ───────────────────────────────────────────────────
function _hash(pin, salt) {
  // SHA-256(pin || salt || pepper). Nunca sale del GAS.
  var combined = String(pin) + String(salt) + String(PEPPER || "");
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, combined, Utilities.Charset.UTF_8);
  return bytes.map(function(b) {
    var v = b < 0 ? b + 256 : b;
    return ("0" + v.toString(16)).slice(-2);
  }).join("");
}

function _uuid() {
  return Utilities.getUuid();
}

// ─── HELPERS TIEMPO ───────────────────────────────────────────────────────────
function _ahora()           { return new Date(); }
function _addH(d, h)        { return new Date(d.getTime() + h * 3600000); }
function _addMin(d, m)      { return new Date(d.getTime() + m * 60000); }
function _iso(d)            { return d ? d.toISOString() : ""; }

// ─── AUDIT ────────────────────────────────────────────────────────────────────
function _audit(username, accion, resultado, ua) {
  try {
    _sheet("audit_log").appendRow([_iso(_ahora()), username, accion, resultado, (ua || "").slice(0, 200)]);
  } catch(e) {}
}

// ─── SHEET ACCESS ─────────────────────────────────────────────────────────────
function _sheet(name) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);
}

function _sheetData(name) {
  var sh = _sheet(name);
  if (!sh) return [];
  var range = sh.getDataRange();
  return range.getNumRows() > 1 ? range.getValues() : [];
}

// ─── MODELO USUARIO ───────────────────────────────────────────────────────────
// Columnas (1-indexed): A=1 B=2 ... N=14
var COL = {
  usuario_id:1, username:2, vendedor_id:3, pais:4, rol:5,
  pin_hash:6, salt:7, clave_temporal_activa:8, cambio_obligatorio:9,
  intentos_fallidos:10, bloqueado_hasta:11, ultimo_acceso:12,
  fecha_cambio_pin:13, estado:14
};

function _buscarUsuario(username) {
  var data = _sheetData("usuarios");
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][COL.username - 1]).toLowerCase() === username.toLowerCase()) {
      var bloq = data[i][COL.bloqueado_hasta - 1];
      return {
        row:                   i + 1,
        usuario_id:            String(data[i][COL.usuario_id - 1]),
        username:              String(data[i][COL.username - 1]),
        vendedor_id:           data[i][COL.vendedor_id - 1] || null,
        pais:                  String(data[i][COL.pais - 1]),
        rol:                   String(data[i][COL.rol - 1]),
        pin_hash:              String(data[i][COL.pin_hash - 1]),
        salt:                  String(data[i][COL.salt - 1]),
        clave_temporal_activa: data[i][COL.clave_temporal_activa - 1] === true || String(data[i][COL.clave_temporal_activa - 1]).toUpperCase() === "TRUE",
        cambio_obligatorio:    data[i][COL.cambio_obligatorio - 1] === true || String(data[i][COL.cambio_obligatorio - 1]).toUpperCase() === "TRUE",
        intentos_fallidos:     parseInt(data[i][COL.intentos_fallidos - 1]) || 0,
        bloqueado_hasta:       bloq ? new Date(bloq) : null,
        ultimo_acceso:         data[i][COL.ultimo_acceso - 1],
        fecha_cambio_pin:      data[i][COL.fecha_cambio_pin - 1],
        estado:                String(data[i][COL.estado - 1])
      };
    }
  }
  return null;
}

function _actualizarUsuario(row, campos) {
  var sh = _sheet("usuarios");
  Object.keys(campos).forEach(function(k) {
    if (COL[k]) {
      var v = campos[k];
      sh.getRange(row, COL[k]).setValue(v === null || v === undefined ? "" : v);
    }
  });
}

// ─── MODELO SESIÓN ────────────────────────────────────────────────────────────
function _crearToken(usr, userAgent) {
  var token   = _uuid();
  var emitido = _ahora();
  var expira  = _addH(emitido, SESSION_HOURS);
  _sheet("sesiones").appendRow([
    token, usr.usuario_id, usr.username, usr.vendedor_id || "",
    usr.pais, usr.rol, _iso(emitido), _iso(expira), "activa",
    (userAgent || "").slice(0, 200)
  ]);
  return { token: token, expira: _iso(expira) };
}

function _validarToken(token) {
  if (!token) return null;
  var data = _sheetData("sesiones");
  var sh   = _sheet("sesiones");
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === token && data[i][8] === "activa") {
      var expira = new Date(data[i][7]);
      if (expira > _ahora()) {
        return {
          row:        i + 1,
          token:      token,
          usuario_id: String(data[i][1]),
          username:   String(data[i][2]),
          vendedor_id:String(data[i][3]) || null,
          pais:       String(data[i][4]),
          rol:        String(data[i][5]),
          expira:     data[i][7]
        };
      } else {
        sh.getRange(i + 1, 9).setValue("expirada");
        return null;
      }
    }
  }
  return null;
}

function _invalidarToken(token) {
  if (!token) return;
  var data = _sheetData("sesiones");
  var sh   = _sheet("sesiones");
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === token) { sh.getRange(i + 1, 9).setValue("invalida"); return; }
  }
}

// ─── ACCIÓN: LOGIN ────────────────────────────────────────────────────────────
function accionLogin(payload) {
  var username = String(payload.username || "").trim().toLowerCase();
  var pin      = String(payload.pin || "");
  var ua       = String(payload.user_agent || "");

  // Validar formato PIN sin revelar si el usuario existe
  if (!PIN_REGEX.test(pin)) {
    Utilities.sleep(600);
    _audit(username, "login", "formato_pin_invalido", ua);
    return { error: "Usuario o contraseña incorrectos." };
  }

  var lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch(e) { return { error: "Servicio ocupado. Intente en unos segundos." }; }

  try {
    var usr = _buscarUsuario(username);
    if (!usr || usr.estado !== "activo") {
      Utilities.sleep(800);
      _audit(username, "login", "usuario_no_encontrado_o_inactivo", ua);
      return { error: "Usuario o contraseña incorrectos." };
    }

    // ¿Bloqueado?
    if (usr.bloqueado_hasta && usr.bloqueado_hasta > _ahora()) {
      _audit(username, "login", "cuenta_bloqueada", ua);
      return { error: "Cuenta bloqueada temporalmente. Intente en " + BLOQUEO_MIN + " minutos." };
    }

    // Verificar PIN
    if (_hash(pin, usr.salt) !== usr.pin_hash) {
      var intentos = usr.intentos_fallidos + 1;
      var campos = { intentos_fallidos: intentos };
      if (intentos >= MAX_INTENTOS) {
        campos.bloqueado_hasta = _iso(_addMin(_ahora(), BLOQUEO_MIN));
        campos.intentos_fallidos = 0;
        _audit(username, "login", "bloqueado_por_" + MAX_INTENTOS + "_intentos", ua);
      } else {
        _audit(username, "login", "pin_incorrecto_intento_" + intentos, ua);
      }
      _actualizarUsuario(usr.row, campos);
      Utilities.sleep(600);
      return { error: "Usuario o contraseña incorrectos." };
    }

    // PIN correcto: limpiar contadores
    _actualizarUsuario(usr.row, { intentos_fallidos: 0, bloqueado_hasta: null, ultimo_acceso: _iso(_ahora()) });

    // ¿Cambio obligatorio?
    if (usr.cambio_obligatorio) {
      // Token temporal solo válido para change_pin
      var tempToken = _crearToken(Object.assign({}, usr, { rol: "_temp_cambio_" + usr.rol }), ua);
      _audit(username, "login", "cambio_obligatorio_requerido", ua);
      return { cambio_obligatorio: true, token_temp: tempToken.token, expira: tempToken.expira };
    }

    var sesion = _crearToken(usr, ua);
    _audit(username, "login", "ok", ua);
    return {
      ok: true,
      token:      sesion.token,
      expira:     sesion.expira,
      nombre:     usr.username,
      rol:        usr.rol,
      pais:       usr.pais,
      vendedor_id: usr.vendedor_id || null,
      cambio_obligatorio: false
    };

  } finally { lock.releaseLock(); }
}

// ─── ACCIÓN: CHANGE PIN ───────────────────────────────────────────────────────
function accionChangePIN(payload) {
  var token    = String(payload.token || "");
  var pinActual = String(payload.pin_actual || "");
  var pinNuevo  = String(payload.pin_nuevo  || "");
  var ua        = String(payload.user_agent || "");

  if (!PIN_REGEX.test(pinNuevo)) {
    return { error: "El PIN debe tener exactamente 4 dígitos numéricos." };
  }
  if (!PIN_REGEX.test(pinActual)) {
    return { error: "Usuario o contraseña incorrectos." };
  }
  if (pinNuevo === pinActual) {
    return { error: "El nuevo PIN debe ser diferente al actual." };
  }

  // Validar token (incluyendo token temporal de cambio obligatorio)
  var sesion = _validarToken(token);
  if (!sesion) return { error: "Sesión inválida o expirada." };

  // Extraer rol real si es token temporal
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
      _audit(sesion.username, "change_pin", "pin_actual_incorrecto", ua);
      return { error: "El PIN actual no es correcto." };
    }

    var nuevoSalt = _uuid();
    var nuevoHash = _hash(pinNuevo, nuevoSalt);

    _actualizarUsuario(usr.row, {
      pin_hash:             nuevoHash,
      salt:                 nuevoSalt,
      clave_temporal_activa: false,
      cambio_obligatorio:   false,
      fecha_cambio_pin:     _iso(_ahora())
    });

    // Invalidar token anterior, emitir sesión real con rol correcto
    _invalidarToken(token);
    var usrActualizado = _buscarUsuario(sesion.username);
    usrActualizado.rol = rolReal;
    var nuevaSesion = _crearToken(usrActualizado, ua);

    _audit(sesion.username, "change_pin", "ok", ua);
    return {
      ok:         true,
      token:      nuevaSesion.token,
      expira:     nuevaSesion.expira,
      nombre:     usrActualizado.username,
      rol:        rolReal,
      pais:       usrActualizado.pais,
      vendedor_id: usrActualizado.vendedor_id || null
    };

  } finally { lock.releaseLock(); }
}

// ─── ACCIÓN: VALIDATE ─────────────────────────────────────────────────────────
function accionValidate(payload) {
  var token  = String(payload.token || "");
  var sesion = _validarToken(token);
  if (!sesion) return { ok: false, error: "Sesión inválida o expirada." };
  return {
    ok:         true,
    rol:        sesion.rol,
    pais:       sesion.pais,
    vendedor_id: sesion.vendedor_id || null,
    expira:     sesion.expira
  };
}

// ─── ACCIÓN: LOGOUT ───────────────────────────────────────────────────────────
function accionLogout(payload) {
  var token  = String(payload.token || "");
  var sesion = _validarToken(token);
  if (sesion) _audit(sesion.username, "logout", "ok", "");
  _invalidarToken(token);
  return { ok: true };
}

// ─── ACCIÓN: GET SIC DATA ─────────────────────────────────────────────────────
function accionGetSICData(payload) {
  var token = String(payload.token || "");
  var pais  = String(payload.pais  || "").toUpperCase();

  var sesion = _validarToken(token);
  if (!sesion) return { error: "Sesión inválida o expirada." };

  // Validar acceso al país
  if (sesion.pais !== "AMBOS" && sesion.pais !== pais) {
    _audit(sesion.username, "get_sic_data_" + pais, "acceso_denegado_pais", "");
    return { error: "Sin acceso a este país." };
  }

  // Determinar filtro de vendedor
  // SELLER  → siempre su propio vendedor_id (ignorar cualquier campo extra del payload)
  // ADMIN   → todos (vendedorFiltro = null)
  var esAdmin = (sesion.rol === "admin" || sesion.rol === "gerencia" || sesion.rol === "financiera");
  var vendedorFiltro = esAdmin ? null : (sesion.vendedor_id || null);

  try {
    var sheetName = pais === "CL" ? "sic_data_cl" : "sic_data_pe";
    var sh = _sheet(sheetName);
    if (!sh) return { error: "Datos no disponibles para este país." };

    // Datos almacenados como JSON en celda A1
    var rawJson = sh.getRange(1, 1).getValue();
    if (!rawJson) return { error: "Sin datos cargados para este país. Ejecute el pipeline de carga." };

    var allData = JSON.parse(rawJson);
    var filtered = _filtrarDatos(allData, vendedorFiltro);

    _audit(sesion.username, "get_sic_data_" + pais, "ok_vendedor=" + (vendedorFiltro || "ALL"), "");
    return { ok: true, data: filtered };

  } catch(err) {
    _audit(sesion.username, "get_sic_data_" + pais, "error: " + err.message, "");
    return { error: "Error al procesar datos." };
  }
}

// ─── FILTRADO DE DATOS SIC ────────────────────────────────────────────────────
function _filtrarDatos(allData, vendedorFiltro) {
  // allData = { tx:[], ppto:{}, cobranzas_raw:{}, vencimientos:[], universo_sic_raw:{} }
  // vendedorFiltro = null → todos | string → solo ese vendedor

  var r = {};

  // TX (transacciones)
  if (allData.tx) {
    r.tx = vendedorFiltro
      ? allData.tx.filter(function(t) {
          return String(t.vendedor_id || "").toLowerCase() === vendedorFiltro ||
                 String(t.vendedor   || "").toLowerCase().indexOf(vendedorFiltro.replace(/_/g," ")) !== -1;
        })
      : allData.tx;
  }

  // Presupuesto: filtrar por vendedor en cada sub-objeto
  if (allData.ppto) {
    if (!vendedorFiltro) {
      r.ppto = allData.ppto;
    } else {
      r.ppto = {};
      var ppto = allData.ppto;
      Object.keys(ppto).forEach(function(k) {
        var val = ppto[k];
        if (val !== null && typeof val === "object" && !Array.isArray(val)) {
          // Objeto con claves por vendedor (ej. rtc_mensual_ppto)
          r.ppto[k] = {};
          if (val[vendedorFiltro] !== undefined) r.ppto[k][vendedorFiltro] = val[vendedorFiltro];
        } else {
          // Escalar o array (ciclos, version, etc.)
          r.ppto[k] = val;
        }
      });
    }
  }

  // Cobranzas
  if (allData.cobranzas_raw) {
    if (!vendedorFiltro) {
      r.cobranzas_raw = allData.cobranzas_raw;
    } else {
      var cr = allData.cobranzas_raw;
      r.cobranzas_raw = {};
      // Copiar campos escalares
      Object.keys(cr).forEach(function(k) {
        if (k !== "cobranzas" && k !== "resumen_por_vendedor" && k !== "abonos_pendientes_detalle" && k !== "folios_pendientes" && k !== "folios_parciales") {
          r.cobranzas_raw[k] = cr[k];
        }
      });
      // Filtrar cobranzas individuales
      if (cr.cobranzas) {
        r.cobranzas_raw.cobranzas = cr.cobranzas.filter(function(c) {
          return String(c.vendedor_id || "").toLowerCase() === vendedorFiltro ||
                 String(c.vendedor   || "").toLowerCase().indexOf(vendedorFiltro.replace(/_/g," ")) !== -1;
        });
      }
      // Filtrar resumen — usa nombre canónico como clave, se filtra por coincidencia parcial
      if (cr.resumen_por_vendedor) {
        r.cobranzas_raw.resumen_por_vendedor = {};
        Object.keys(cr.resumen_por_vendedor).forEach(function(nombre) {
          // Comparar el nombre canónico con el vendedorFiltro (normalizado)
          var nombreNorm = nombre.toLowerCase().replace(/\s+/g, "_").replace(/[áàä]/g,"a").replace(/[éèë]/g,"e").replace(/[íìï]/g,"i").replace(/[óòö]/g,"o").replace(/[úùü]/g,"u").replace(/[ñ]/g,"n");
          if (nombreNorm.indexOf(vendedorFiltro.replace(/_/g," ").split(" ")[0]) !== -1 ||
              vendedorFiltro.indexOf(nombre.toLowerCase().split(" ")[1] || "") !== -1) {
            r.cobranzas_raw.resumen_por_vendedor[nombre] = cr.resumen_por_vendedor[nombre];
          }
        });
      }
      // Abonos y folios filtrados
      if (cr.abonos_pendientes_detalle) r.cobranzas_raw.abonos_pendientes_detalle = [];
      if (cr.folios_pendientes) r.cobranzas_raw.folios_pendientes = [];
      if (cr.folios_parciales)  r.cobranzas_raw.folios_parciales  = [];
    }
  }

  // Vencimientos
  if (allData.vencimientos) {
    r.vencimientos = vendedorFiltro
      ? allData.vencimientos.filter(function(v) {
          return String(v.vendedor_id || "").toLowerCase() === vendedorFiltro ||
                 String(v.vendedor   || "").toLowerCase().indexOf(vendedorFiltro.replace(/_/g," ")) !== -1;
        })
      : allData.vencimientos;
  }

  // Universo SIC
  if (allData.universo_sic_raw) {
    if (!vendedorFiltro) {
      r.universo_sic_raw = allData.universo_sic_raw;
    } else {
      var u = allData.universo_sic_raw;
      r.universo_sic_raw = { schema_version: u.schema_version, pais: u.pais, fuente: u.fuente, fecha_proceso: u.fecha_proceso };
      r.universo_sic_raw.claves_presupuestadas = (u.claves_presupuestadas || []).filter(function(c) { return c === vendedorFiltro; });
      r.universo_sic_raw.nombres_canonicos_por_clave = {};
      if (u.nombres_canonicos_por_clave && u.nombres_canonicos_por_clave[vendedorFiltro]) {
        r.universo_sic_raw.nombres_canonicos_por_clave[vendedorFiltro] = u.nombres_canonicos_por_clave[vendedorFiltro];
      }
    }
  }

  return r;
}

// ═══════════════════════════════════════════════════════════════════════
// UTILIDADES DE ADMINISTRACIÓN (ejecutar manualmente en GAS editor)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Crear usuario inicial. Ejecutar una vez por usuario desde el editor de GAS.
 * Ejemplo:
 *   crearUsuario("usr_001","laratro","laratro","CL","vendedor","1234")
 *   crearUsuario("usr_000","admin",null,"AMBOS","admin","2727")
 */
function crearUsuario(usuario_id, username, vendedor_id, pais, rol, pinInicial) {
  var sh   = _sheet("usuarios");
  var salt = _uuid();
  var hash = _hash(pinInicial, salt);
  sh.appendRow([
    usuario_id,
    username.toLowerCase(),
    vendedor_id || "",
    pais,
    rol,
    hash,
    salt,
    true,   // clave_temporal_activa
    true,   // cambio_obligatorio
    0,      // intentos_fallidos
    "",     // bloqueado_hasta
    "",     // ultimo_acceso
    "",     // fecha_cambio_pin
    "activo"
  ]);
  Logger.log("Usuario creado: " + username);
}

/**
 * Cargar datos SIC en la hoja correspondiente.
 * Ejecutar después de cada actualización del pipeline.
 * El JSON debe incluir: { tx:[], ppto:{}, cobranzas_raw:{}, vencimientos:[], universo_sic_raw:{} }
 */
function cargarDatosSIC(pais, jsonString) {
  var sheetName = pais === "CL" ? "sic_data_cl" : "sic_data_pe";
  var sh = _sheet(sheetName);
  sh.getRange(1, 1).setValue(jsonString);
  Logger.log("Datos SIC " + pais + " cargados: " + jsonString.length + " chars");
}

/**
 * Limpiar tokens expirados (ejecutar periódicamente con un trigger diario).
 */
function limpiarTokensExpirados() {
  var sh   = _sheet("sesiones");
  var data = sh.getDataRange().getValues();
  var ahora = _ahora();
  for (var i = data.length - 1; i >= 1; i--) {
    if (data[i][8] !== "activa") continue;
    if (new Date(data[i][7]) < ahora) sh.getRange(i + 1, 9).setValue("expirada");
  }
}
