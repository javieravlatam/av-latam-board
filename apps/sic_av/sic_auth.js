/**
 * SIC-AV — Autenticacion individual por usuario (v2.0)
 * =============================================================
 * Reemplaza el esquema de clave compartida por pais (Fase 4)
 * por autenticacion individual: cada vendedor tiene su propio
 * acceso y solo puede ver su informacion.
 *
 * Roles:
 *   vendedor   — accede a su pais, solo ve su propio selector
 *   gerencia   — accede a ambos paises, ve todos los vendedores
 *   financiera — accede a ambos paises, ve todos los vendedores
 *
 * Contraseñas:
 *   - Clave inicial para todos: "1234"
 *   - El usuario cambia su clave en el primer ingreso (obligatorio)
 *   - La clave personalizada se guarda en localStorage del navegador
 *   - Si el usuario limpia el cache o usa otro equipo, vuelve a "1234"
 *   - Las claves NUNCA se transmiten ni se guardan en el servidor
 *
 * ADVERTENCIA: esto es seguridad perimetral para un sitio estatico.
 * No es autenticacion productiva con backend. Adecuado para uso
 * interno en GitHub Pages con acceso controlado por URL.
 */
(function (global) {
  "use strict";

  // ------------------------------------------------------------------
  // Tabla de usuarios — agregar/quitar vendedores aqui.
  // Las claves NO se guardan aqui: se guardan en localStorage.
  // "pais": "CL" | "PE" | "AMBOS"
  // ------------------------------------------------------------------
  var USUARIOS = [
    // Gerencia — acceso completo a ambos paises
    { id: "gerencia",    nombre: "Gerencia General",    rol: "gerencia",   pais: "AMBOS", vendedor_id: null },
    { id: "financiera",  nombre: "Gerencia Financiera", rol: "financiera", pais: "AMBOS", vendedor_id: null },

    // Chile
    { id: "laratro",     nombre: "Pablo Laratro",       rol: "vendedor", pais: "CL", vendedor_id: "laratro"    },
    { id: "velasquez",   nombre: "Francisco Velasquez", rol: "vendedor", pais: "CL", vendedor_id: "velasquez"  },
    { id: "encina",      nombre: "Rodrigo Encina",      rol: "vendedor", pais: "CL", vendedor_id: "encina"     },
    { id: "munoz",       nombre: "Valentina Muñoz",     rol: "vendedor", pais: "CL", vendedor_id: "munoz"      },
    { id: "caroca",      nombre: "Jorge Caroca",        rol: "vendedor", pais: "CL", vendedor_id: "caroca"     },
    { id: "veverka",     nombre: "Ivan Veverka",        rol: "vendedor", pais: "CL", vendedor_id: "veverka"    },
    { id: "franco_riffo",nombre: "Franco Riffo",        rol: "vendedor", pais: "CL", vendedor_id: "franco_riffo"},

    // Peru
    { id: "navarro",     nombre: "Nicoll Navarro",      rol: "vendedor", pais: "PE", vendedor_id: "navarro"    },
    { id: "infante",     nombre: "Oscar Infante",       rol: "vendedor", pais: "PE", vendedor_id: "infante"    },
    { id: "atalaya",     nombre: "Omar Atalaya",        rol: "vendedor", pais: "PE", vendedor_id: "atalaya"    },
    { id: "diaz",        nombre: "Susan Diaz",          rol: "vendedor", pais: "PE", vendedor_id: "diaz"       },
    { id: "gonzales",    nombre: "Antonio Gonzalez",    rol: "vendedor", pais: "PE", vendedor_id: "gonzales"   },
    { id: "aguirre",     nombre: "Lisbeth Aguirre",     rol: "vendedor", pais: "PE", vendedor_id: "aguirre"    },
    { id: "valladares",  nombre: "Patricia Valladares", rol: "vendedor", pais: "PE", vendedor_id: "valladares" },
    { id: "martha",      nombre: "Martha Hidalgo",      rol: "vendedor", pais: "PE", vendedor_id: "martha"     }
  ];

  var CLAVE_DEFAULT  = "1234";
  var STORAGE_PW     = "sic_pw_";      // localStorage: clave personalizada
  var SESSION_KEY    = "sic_av_session";

  // ------------------------------------------------------------------
  // Helpers internos
  // ------------------------------------------------------------------
  function _buscarUsuario(id) {
    for (var i = 0; i < USUARIOS.length; i++) {
      if (USUARIOS[i].id === id) return USUARIOS[i];
    }
    return null;
  }

  function _obtenerClave(id) {
    try { return localStorage.getItem(STORAGE_PW + id) || CLAVE_DEFAULT; } catch (e) { return CLAVE_DEFAULT; }
  }

  function _esClaveDefault(id) {
    try { return !localStorage.getItem(STORAGE_PW + id); } catch (e) { return true; }
  }

  // ------------------------------------------------------------------
  // API pública
  // ------------------------------------------------------------------
  var SICAuth = {};

  /**
   * Intenta autenticar. Retorna la sesion si es valida, o null.
   * La sesion queda guardada en sessionStorage.
   */
  SICAuth.autenticar = function (usuario, clave) {
    var usr = _buscarUsuario((usuario || "").trim().toLowerCase());
    if (!usr) return null;
    if (clave !== _obtenerClave(usr.id)) return null;

    var sesion = {
      usuario:       usr.id,
      nombre:        usr.nombre,
      rol:           usr.rol,
      pais:          usr.pais,
      vendedor_id:   usr.vendedor_id,
      primer_ingreso: _esClaveDefault(usr.id),
      inicio:        new Date().toISOString()
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
    return sesion;
  };

  /**
   * Retorna la sesion activa o null.
   */
  SICAuth.sesionActiva = function () {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s || !s.usuario || !s.rol) return null;
      return s;
    } catch (e) { return null; }
  };

  /**
   * Guard de acceso. Debe llamarse al inicio de sic_chile.html / sic_peru.html.
   * Redirige a index.html si no hay sesion valida para el pais esperado.
   * Gerencia y financiera tienen acceso a ambos paises.
   */
  SICAuth.exigirSesion = function (paisEsperado) {
    var sesion = SICAuth.sesionActiva();
    if (!sesion) { window.location.href = "index.html"; return null; }
    var tieneAcceso = sesion.pais === "AMBOS" || sesion.pais === paisEsperado;
    if (!tieneAcceso) { window.location.href = "index.html"; return null; }
    return sesion;
  };

  /**
   * Cambia la clave del usuario autenticado.
   * Retorna true si OK, false si la clave actual no coincide.
   */
  SICAuth.cambiarClave = function (claveActual, claveNueva) {
    var sesion = SICAuth.sesionActiva();
    if (!sesion) return false;
    if (claveActual !== _obtenerClave(sesion.usuario)) return false;
    try {
      localStorage.setItem(STORAGE_PW + sesion.usuario, claveNueva);
      sesion.primer_ingreso = false;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
      return true;
    } catch (e) { return false; }
  };

  SICAuth.cerrarSesion = function () {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  };

  SICAuth.paisActivo = function () {
    var s = SICAuth.sesionActiva();
    return s ? s.pais : null;
  };

  /** Retorna true si la sesion activa tiene acceso a todos los vendedores. */
  SICAuth.esGerencia = function () {
    var s = SICAuth.sesionActiva();
    return s && (s.rol === "gerencia" || s.rol === "financiera");
  };

  global.SICAuth = SICAuth;
})(typeof window !== "undefined" ? window : globalThis);
