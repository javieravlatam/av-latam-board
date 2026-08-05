/**
 * SIC-AV — sic_auth.js  v3.0  (Central Auth Client)
 * ═══════════════════════════════════════════════════════════════════
 * Reemplaza v2.0. Diferencias críticas:
 *
 *  ✗ ELIMINADO  USUARIOS[] — ya no existe en este archivo
 *  ✗ ELIMINADO  CLAVE_DEFAULT — ya no existe en este archivo
 *  ✗ ELIMINADO  validación local de credenciales
 *  ✗ ELIMINADO  localStorage para PINs o credenciales
 *  ✓ NUEVO      toda autenticación ocurre en el backend GAS
 *  ✓ NUEVO      token opaco UUID en sessionStorage (no credentials)
 *  ✓ NUEVO      SICAuth.getSICData(pais) → datos filtrados por backend
 *  ✓ NUEVO      migración automática: limpia sic_pw_* legacy de localStorage
 *
 * CONFIGURAR ANTES DE USAR:
 *   GAS_URL → URL de la webapp Google Apps Script desplegada.
 * ═══════════════════════════════════════════════════════════════════
 */
(function (global) {
  "use strict";

  // URL del backend GAS. Reemplazar con la URL real del Web App desplegado.
  var GAS_URL = "PENDIENTE_REEMPLAZAR_CON_URL_GAS_WEBAPP";

  var SK_SESSION = "sic_av_session";
  var SK_TOKEN   = "sic_av_token";

  function _token() {
    try { return sessionStorage.getItem(SK_TOKEN) || null; } catch (e) { return null; }
  }

  function _post(body) {
    return fetch(GAS_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(Object.assign({ user_agent: navigator.userAgent.slice(0, 200) }, body))
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  function _guardarSesion(data) {
    try {
      sessionStorage.setItem(SK_SESSION, JSON.stringify({
        nombre:      data.nombre || "",
        rol:         data.rol,
        pais:        data.pais,
        vendedor_id: data.vendedor_id || null,
        expira:      data.expira
      }));
      sessionStorage.setItem(SK_TOKEN, data.token);
    } catch (e) {}
  }

  function _limpiar() {
    try { sessionStorage.removeItem(SK_SESSION); } catch (e) {}
    try { sessionStorage.removeItem(SK_TOKEN);   } catch (e) {}
    try {
      // Migración: eliminar credenciales legacy (sic_pw_*) de localStorage
      Object.keys(localStorage)
        .filter(function (k) { return k.indexOf("sic_pw_") === 0 || k === "sic_av_session"; })
        .forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
  }

  var SICAuth = {};

  /**
   * Login: envía username + PIN al backend.
   * Retorna Promise<{ ok, token, rol, pais, vendedor_id, nombre, expira }
   *               | { cambio_obligatorio:true, token_temp, expira }
   *               | { error }>
   */
  SICAuth.autenticar = function (usuario, pin) {
    return _post({ action: "login", username: usuario, pin: pin });
  };

  /**
   * Cambio de PIN. token puede ser token_temp (primer acceso) o token normal.
   * Retorna Promise<{ ok, token, rol, pais, vendedor_id, nombre, expira } | { error }>
   */
  SICAuth.cambiarClave = function (token, pinActual, pinNuevo) {
    return _post({ action: "change_pin", token: token, pin_actual: pinActual, pin_nuevo: pinNuevo });
  };

  /**
   * Valida el token activo contra el backend.
   * Retorna Promise<{ ok, rol, pais, vendedor_id, expira } | { ok:false, error }>
   */
  SICAuth.validarSesion = function () {
    var tok = _token();
    if (!tok) return Promise.resolve({ ok: false });
    return _post({ action: "validate", token: tok }).then(function (r) {
      if (!r.ok) _limpiar();
      return r;
    });
  };

  /**
   * Obtiene datos SIC filtrados para el usuario autenticado.
   * El backend decide qué datos corresponden — el frontend NO envía vendedor_id.
   * Retorna Promise<{ ok, data:{ tx, ppto, cobranzas_raw, vencimientos, universo_sic_raw } } | { error }>
   */
  SICAuth.getSICData = function (pais) {
    var tok = _token();
    if (!tok) return Promise.reject(new Error("Sin sesión activa."));
    return _post({ action: "get_sic_data", token: tok, pais: pais });
  };

  /** Guarda sesión desde respuesta del backend. Solo llamar con datos del servidor. */
  SICAuth.guardarSesion = function (data) { _guardarSesion(data); };

  /** Sesión en memoria (sin round-trip al backend). */
  SICAuth.sesionActiva = function () {
    try {
      var raw = sessionStorage.getItem(SK_SESSION);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s || !s.rol || !s.expira) return null;
      if (new Date(s.expira) < new Date()) { _limpiar(); return null; }
      return s;
    } catch (e) { return null; }
  };

  /** Guard de acceso. Redirige a index.html si no hay sesión válida para el país. */
  SICAuth.exigirSesion = function (paisEsperado) {
    var s = SICAuth.sesionActiva();
    if (!s) { window.location.href = "index.html"; return null; }
    if (s.pais !== "AMBOS" && s.pais !== paisEsperado) { window.location.href = "index.html"; return null; }
    return s;
  };

  /** Invalida token en backend + limpia sessionStorage + redirige. */
  SICAuth.cerrarSesion = function () {
    var tok = _token();
    if (tok) _post({ action: "logout", token: tok }).catch(function () {});
    _limpiar();
    window.location.href = "index.html";
  };

  SICAuth.esAdmin = function () {
    var s = SICAuth.sesionActiva();
    return !!(s && (s.rol === "admin" || s.rol === "gerencia" || s.rol === "financiera"));
  };

  SICAuth.paisActivo = function () { var s = SICAuth.sesionActiva(); return s ? s.pais : null; };
  SICAuth.getToken   = function () { return _token(); };

  global.SICAuth = SICAuth;

})(typeof window !== "undefined" ? window : globalThis);
