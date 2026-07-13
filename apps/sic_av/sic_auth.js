/**
 * SIC-AV — Autenticacion de PROTOTIPO (Fase 4)
 * =============================================================
 * ADVERTENCIA: esto NO es autenticacion productiva. Es una clave unica
 * compartida por pais, solo para efectos de este prototipo aislado.
 * En produccion debe reemplazarse por autenticacion individual por
 * vendedor, con usuario propio, por requisitos de trazabilidad y
 * auditoria (ver docs/sic_av/SIC_AV_AUDITORIA_EXTERNA.md, hallazgo
 * sobre la clave compartida de AV LATAM Board, y README.md de este
 * modulo, seccion "Advertencia de autenticacion productiva").
 *
 * Toda la logica de validacion vive centralizada aqui -- ningun otro
 * archivo debe comparar claves directamente.
 */
(function (global) {
  "use strict";

  var CLAVES = {
    // Las claves NUNCA se guardan en archivos de datos JSON -- viven
    // unicamente en este archivo de codigo, y no se muestran en pantalla.
    CL: "chile26",
    PE: "peru26"
  };

  var SESSION_KEY = "sic_av_session";

  var SICAuth = {};

  /** Intenta autenticar con una clave ingresada. Retorna el pais si es valida, o null. */
  SICAuth.autenticar = function (claveIngresada) {
    var paises = Object.keys(CLAVES);
    for (var i = 0; i < paises.length; i++) {
      if (claveIngresada === CLAVES[paises[i]]) {
        var sesion = { pais: paises[i], inicio: new Date().toISOString() };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
        return paises[i];
      }
    }
    return null;
  };

  /** Retorna la sesion activa ({pais, inicio}) o null si no hay sesion valida. */
  SICAuth.sesionActiva = function () {
    var raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      var sesion = JSON.parse(raw);
      if (sesion && (sesion.pais === "CL" || sesion.pais === "PE")) return sesion;
      return null;
    } catch (e) {
      return null;
    }
  };

  /**
   * Guard de acceso: debe llamarse al inicio de sic_chile.html / sic_peru.html.
   * Si no hay sesion valida para el pais esperado, redirige a index.html --
   * esto impide entrar cambiando solo la URL sin haber autenticado antes.
   */
  SICAuth.exigirSesion = function (paisEsperado) {
    var sesion = SICAuth.sesionActiva();
    if (!sesion || sesion.pais !== paisEsperado) {
      window.location.href = "index.html";
      return null;
    }
    return sesion;
  };

  SICAuth.cerrarSesion = function () {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  };

  SICAuth.paisActivo = function () {
    var s = SICAuth.sesionActiva();
    return s ? s.pais : null;
  };

  global.SICAuth = SICAuth;
})(typeof window !== "undefined" ? window : globalThis);
