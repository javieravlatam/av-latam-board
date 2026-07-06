/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  COTIZADOR AV LATAM · Motor de inteligencia comercial            ║
 * ║  Archivo: cotizador_core.js                                      ║
 * ║  Módulo independiente — NO depende de avboard_data.js ni de      ║
 * ║  avboard_clientes.js en tiempo de ejecución (catálogos propios   ║
 * ║  en apps/cotizador/data/, generados a partir de esos archivos    ║
 * ║  como semilla inicial, sin modificarlos).                        ║
 * ║                                                                    ║
 * ║  NO tocar dashboards existentes desde este archivo.               ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Arquitectura de persistencia (Fase 1):
 *   Storage.Adapter = LocalStorageAdapter → guarda cotizaciones en el
 *   navegador (localStorage), namespaced por país. Es un placeholder
 *   intencional: todo el motor está escrito contra una interfaz de
 *   adapter (save/get/list/remove) para que el día de mañana se pueda
 *   enchufar un RemoteAdapter (API REST hacia Executive Board / CRM /
 *   Pedidos / Facturación) cambiando UNA línea (Storage.setAdapter),
 *   sin tocar el resto del motor ni las pantallas HTML.
 *
 * Fase 2 — Centro Comercial AV LATAM (2026-07-01):
 *   Arquitectura de Fase 1 CONGELADA — todo lo agregado abajo es aditivo
 *   (nuevos campos/módulos), nada fue removido ni renombrado. El IEC y el
 *   semáforo siguen calculándose 100% contra Precio Piso, sin cambios.
 *   Se agregó: precio_objetivo por línea (concepto nuevo, sin política
 *   activa todavía), Recomendacion (narrativa comercial del panel
 *   derecho) y Pipeline (barra visual decorativa, sin funcionalidad).
 *
 * Fase 3 — Motor Logístico Inteligente (2026-07-01):
 *   Aditivo sobre Fase 1/2 congeladas. Módulo Logistica: calcula distancia
 *   (OpenRouteService, opcional) y costo de despacho. El despacho vive en
 *   quote.despacho{} — completamente separado de quote.totales{} — por lo
 *   que NO participa jamás de Calc.calcularLinea/calcularTotales, del IEC
 *   ni del semáforo. La API key nunca está hardcodeada: se lee siempre de
 *   data/config.json → logistica.api_key. Si no hay key, si el origen no
 *   está configurado, o si la llamada falla, el sistema cae a ingreso
 *   manual de distancia sin bloquear la cotización.
 *
 * Fase 4 — Corrección crítica: precio por presentación (2026-07-01):
 *   [SUPERADA por la Corrección Final de abajo — se mantiene este párrafo
 *   solo como registro histórico]. Introdujo tipo_precio y precios
 *   guardados a nivel de presentación completa (precio_*_presentacion).
 *   Ese modelo resultó más complejo de lo que la tabla de precios piso
 *   real requiere (que siempre trabaja por litro/kilo) y fue revertido.
 *
 * Corrección Final — Lógica simple de cálculo por presentación (2026-07-01):
 *   Vuelve al modelo simple y comercialmente correcto: precio lista,
 *   objetivo, piso y venta son SIEMPRE precio UNITARIO por litro o kilo
 *   (precio_*_unitario), NO por presentación completa. La fórmula única es:
 *     total_linea = precio_venta_unitario × factor_presentacion × cantidad_envases
 *   factor_presentacion = 1 para las presentaciones pequeñas configuradas en
 *   data/config.json → presentaciones_por_unidad (ej. "250 GR", "500 GR" —
 *   se cotizan directo por envase, no por contenido); para el resto es el
 *   contenido numérico de la presentación (20 para "20 L", 25 para "25 KG").
 *   No hardcodeada: la lista de excepciones vive 100% en config.json. Ver
 *   Calc.calcularLinea/Calc.factorPresentacion y README sección 14. Los
 *   campos *_presentacion de Fase 4 se conservan en el catálogo solo como
 *   compatibilidad interna — ya NO gobiernan el cálculo ni se muestran en
 *   la grilla operativa.
 */

var COTIZADOR = (function () {
  'use strict';

  var BASE_PATH = ''; // relativo a apps/cotizador/ — las páginas viven ahí mismo
  var STORAGE_PREFIX = 'cotizador_av_';
  var _configCache = null;

  // ────────────────────────────────────────────────────────────────
  // UTILIDADES
  // ────────────────────────────────────────────────────────────────
  var util = {
    formatMoney: function (value, moneda) {
      if (value === null || value === undefined || isNaN(value)) return '—';
      var n = Number(value);
      if (moneda === 'USD') {
        return 'US$ ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      // CLP: sin decimales, separador de miles con punto (es-CL)
      return '$ ' + Math.round(n).toLocaleString('es-CL');
    },
    formatPct: function (value, decimals) {
      if (value === null || value === undefined || isNaN(value)) return '—';
      return (value * 100).toFixed(decimals === undefined ? 1 : decimals) + '%';
    },
    /**
     * Fase 5 (2026-07-02): formatea un número para mostrarlo en un campo
     * editable YA no enfocado — sin símbolo de moneda (a diferencia de
     * formatMoney), solo el número agrupado. CLP: entero con separador de
     * miles ("8.000"). USD: 2 decimales con separador de miles ("1,250.50").
     * Usado por el patrón "type=number mientras edita / type=text formateado
     * al salir" de los campos de precio (ver cotizador_chile.html/peru.html).
     */
    formatNumeroEdit: function (value, moneda) {
      if (value === null || value === undefined || isNaN(value)) return '';
      var n = Number(value);
      if (moneda === 'USD') {
        return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      return Math.round(n).toLocaleString('es-CL');
    },
    todayISO: function () {
      var d = new Date();
      return d.toISOString().slice(0, 10);
    },
    todayDisplay: function () {
      var d = new Date();
      return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
    },
    uid: function () {
      return 'q_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    },
    nowISO: function () {
      return new Date().toISOString();
    },
    escapeHTML: function (s) {
      if (s === null || s === undefined) return '';
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
  };

  // ────────────────────────────────────────────────────────────────
  // CARGA DE DATOS (config + catálogos por país)
  // ────────────────────────────────────────────────────────────────
  function fetchJSON(path) {
    return fetch(BASE_PATH + path).then(function (r) {
      if (!r.ok) throw new Error('No se pudo cargar ' + path + ' (HTTP ' + r.status + ')');
      return r.json();
    });
  }

  function loadConfig() {
    if (_configCache) return Promise.resolve(_configCache);
    return fetchJSON('data/config.json').then(function (cfg) {
      _configCache = cfg;
      return cfg;
    });
  }

  /**
   * Inicializa el cotizador para un país: trae config + catálogo de
   * productos + catálogo de clientes. Todo se carga "automáticamente"
   * al seleccionar el país, tal como pide el spec del portal.
   */
  function init(pais) {
    return loadConfig().then(function (cfg) {
      var pcfg = cfg.paises[pais];
      if (!pcfg) throw new Error('País no configurado: ' + pais);
      return Promise.all([
        fetchJSON(pcfg.productos_file),
        fetchJSON(pcfg.clientes_file)
      ]).then(function (res) {
        return {
          config: cfg,
          paisConfig: pcfg,
          productos: res[0],
          clientes: res[1]
        };
      });
    });
  }

  // ────────────────────────────────────────────────────────────────
  // NUMERACIÓN AUTOMÁTICA — AV-CL-AAAA-0001 / AV-PE-AAAA-0001
  // Contador persistido en localStorage (ver nota de arquitectura de
  // Storage más abajo: es la misma limitación de "por navegador").
  // ────────────────────────────────────────────────────────────────
  var Numbering = {
    _key: function (pais, anio) {
      return STORAGE_PREFIX + 'seq_' + pais + '_' + anio;
    },
    peek: function (pais) {
      var anio = new Date().getFullYear();
      var raw = localStorage.getItem(this._key(pais, anio));
      return raw ? parseInt(raw, 10) : 0;
    },
    next: function (pais, prefijo) {
      var anio = new Date().getFullYear();
      var key = this._key(pais, anio);
      var current = parseInt(localStorage.getItem(key) || '0', 10);
      var next = current + 1;
      localStorage.setItem(key, String(next));
      var padded = ('0000' + next).slice(-4);
      return prefijo + '-' + anio + '-' + padded;
    }
  };

  // ────────────────────────────────────────────────────────────────
  // INTELIGENCIA COMERCIAL — IEC, márgenes, semáforo
  // ────────────────────────────────────────────────────────────────
  var Calc = {
    /**
     * Normaliza una presentación a forma comparable: extrae el primer
     * número y la primera letra de la unidad (GR→G, KG→K, L→L, UN→U), para
     * poder comparar contra data/config.json → presentaciones_por_unidad
     * sin depender de que el texto sea idéntico carácter por carácter
     * (ej. "500 GR" y "500 G" deben matchear igual).
     */
    _normalizarPresentacion: function (str) {
      if (!str) return '';
      var s = String(str).trim().toUpperCase().replace(',', '.');
      var m = s.match(/(\d+(?:\.\d+)?)\s*([A-ZÁÉÍÓÚ]+)/);
      if (!m) return s;
      return m[1] + m[2].charAt(0);
    },

    /**
     * Corrección Final (2026-07-01): factor_presentacion NO hardcodeado.
     * Si la presentación está en config.presentaciones_por_unidad (ej.
     * "250 GR", "500 GR") → factor = 1 (se cotiza directo por envase). Si
     * no está en la lista → factor = contenido numérico de la presentación
     * (litros/kilos por envase), tomado de linea.contenido_presentacion.
     */
    factorPresentacion: function (presentacion, contenidoPresentacion, config) {
      var lista = (config && config.presentaciones_por_unidad) || [];
      var norm = Calc._normalizarPresentacion(presentacion);
      var esPorUnidad = lista.some(function (p) { return Calc._normalizarPresentacion(p) === norm; });
      if (esPorUnidad) return 1;
      var contenido = Number(contenidoPresentacion);
      return (contenido && contenido > 0) ? contenido : 1;
    },

    /** Lee un precio unitario con fallback a nombres de campo de fases anteriores. */
    _leerUnitario: function (linea, campoNuevo, campoLegacyV1, campoLegacyPresentacion) {
      if (linea[campoNuevo] !== undefined && linea[campoNuevo] !== null) return Number(linea[campoNuevo]);
      if (campoLegacyV1 && linea[campoLegacyV1] !== undefined && linea[campoLegacyV1] !== null) return Number(linea[campoLegacyV1]);
      if (campoLegacyPresentacion && linea[campoLegacyPresentacion] !== undefined && linea[campoLegacyPresentacion] !== null) {
        var contenido = Number(linea.contenido_presentacion) || 1;
        return Number(linea[campoLegacyPresentacion]) / contenido;
      }
      return null;
    },

    /**
     * Corrección Final (2026-07-01) — modelo simple y comercialmente
     * correcto. precio_lista_unitario / precio_objetivo_unitario /
     * precio_piso_unitario / precio_venta_unitario son SIEMPRE precio por
     * litro o kilo (nunca por presentación completa). Fórmula única:
     *   factor_presentacion = 1 (excepción configurada) | contenido de la presentación
     *   total_linea  = precio_venta_unitario × factor_presentacion × cantidad_envases
     *   IEC_linea    = total_linea / (precio_piso_unitario × factor_presentacion × cantidad_envases)
     * Fallback defensivo a precio_piso/precio_piso_presentacion (fases
     * anteriores) para no romper cotizaciones ya guardadas.
     *
     * linea: { presentacion, contenido_presentacion, cantidad_envases,
     *          precio_piso_unitario, precio_lista_unitario, precio_objetivo_unitario,
     *          costo_referencial_unitario, precio_venta_unitario }
     * Devuelve un nuevo objeto con los campos calculados agregados.
     */
    calcularLinea: function (linea, config) {
      var cantidad = Number(linea.cantidad_envases !== undefined ? linea.cantidad_envases : linea.cantidad) || 0;
      var factor = Calc.factorPresentacion(linea.presentacion, linea.contenido_presentacion, config);

      var piso = Calc._leerUnitario(linea, 'precio_piso_unitario', 'precio_piso', 'precio_piso_presentacion');
      var pu = Number(linea.precio_venta_unitario !== undefined ? linea.precio_venta_unitario : linea.precio_unitario) || 0;
      var costo = Calc._leerUnitario(linea, 'costo_referencial_unitario', 'costo_referencial', 'costo_referencial_presentacion');
      var objetivo = Calc._leerUnitario(linea, 'precio_objetivo_unitario', null, 'precio_objetivo_presentacion');

      var venta_total_linea = pu * factor * cantidad;
      var total_linea = venta_total_linea;
      var elegible = piso !== null && piso > 0;
      var piso_total_linea = elegible ? piso * factor * cantidad : null;
      var iec_linea = (elegible && piso_total_linea > 0) ? (venta_total_linea / piso_total_linea) : null;
      var precioEnvaseVenta = pu * factor;
      var precioEnvasePiso = elegible ? piso * factor : null;
      var bajo_piso = elegible ? (precioEnvaseVenta < precioEnvasePiso) : false;
      var sobre_piso = elegible ? (precioEnvaseVenta >= precioEnvasePiso) : null;
      var costoTotalLinea = costo !== null ? costo * factor * cantidad : null;
      var margen_linea = costoTotalLinea !== null ? (venta_total_linea - costoTotalLinea) : null;
      var margen_pct = (margen_linea !== null && total_linea > 0) ? (margen_linea / total_linea) : null;
      var ganado = elegible ? Math.max(0, venta_total_linea - piso_total_linea) : 0;
      var cedido = elegible ? Math.max(0, piso_total_linea - venta_total_linea) : 0;

      // ── Fase 2: Precio Objetivo (aditivo — NO participa del IEC/semáforo,
      // que siguen atados exclusivamente al Precio Piso). Solo alimenta la
      // recomendación comercial. Ahora también en precio unitario.
      var tiene_objetivo = objetivo !== null && objetivo > 0;
      var objetivo_total_linea = tiene_objetivo ? objetivo * factor * cantidad : null;
      var bajo_objetivo = tiene_objetivo ? (venta_total_linea < objetivo_total_linea) : false;
      var brecha_objetivo = tiene_objetivo ? Math.max(0, objetivo_total_linea - venta_total_linea) : 0;

      var out = {};
      for (var k in linea) out[k] = linea[k];
      out.cantidad_envases = cantidad;
      out.factor_presentacion = factor;
      out.precio_venta_unitario = pu;
      out.precio_piso_unitario = piso;
      out.precio_objetivo_unitario = objetivo;
      out.precio_venta_envase = precioEnvaseVenta; // precio ya multiplicado por el envase — uso en PDF/UI
      out.total_linea = total_linea;
      out.iec_linea = iec_linea;
      out.margen_linea = margen_linea;
      out.margen_pct = margen_pct;
      out.elegible_iec = elegible;
      out.bajo_piso = bajo_piso;
      out.sobre_piso = sobre_piso;
      out.valor_ganado = ganado;
      out.valor_cedido = cedido;
      out.tiene_objetivo = tiene_objetivo;
      out.bajo_objetivo = bajo_objetivo;
      out.brecha_objetivo = brecha_objetivo;
      return out;
    },

    /**
     * IEC GLOBAL de la cotización + resumen ejecutivo.
     * Fórmula: IEC_global = Σ(venta_total_linea, líneas elegibles) / Σ(precio_piso_unitario × factor_presentacion × cantidad_envases, líneas elegibles)
     */
    calcularTotales: function (lineasCalculadas, config) {
      var precio_piso_total = 0;
      var valor_cotizado_total = 0;
      var valor_cotizado_elegible = 0;
      var piso_total_elegible = 0;
      var margen_estimado = 0;
      var margen_conocido = true;
      var valor_ganado = 0;
      var valor_cedido = 0;
      var n_bajo_piso = 0;
      var n_sobre_piso = 0;
      var n_sin_piso = 0;
      var n_bajo_objetivo = 0;
      var valor_brecha_objetivo = 0;

      lineasCalculadas.forEach(function (l) {
        var cantidad = Number(l.cantidad_envases) || 0;
        valor_cotizado_total += l.total_linea || 0;
        if (l.elegible_iec) {
          var factor = Number(l.factor_presentacion) || 1;
          var pisoLinea = Number(l.precio_piso_unitario) * factor * cantidad;
          precio_piso_total += pisoLinea;
          piso_total_elegible += pisoLinea;
          valor_cotizado_elegible += l.total_linea || 0;
          if (l.bajo_piso) n_bajo_piso++; else n_sobre_piso++;
        } else {
          n_sin_piso++;
        }
        if (l.margen_linea !== null && l.margen_linea !== undefined) {
          margen_estimado += l.margen_linea;
        } else {
          margen_conocido = false;
        }
        valor_ganado += l.valor_ganado || 0;
        valor_cedido += l.valor_cedido || 0;
        // Fase 2 — aditivo: conteo de líneas bajo Precio Objetivo (concepto
        // nuevo, no altera el IEC/semáforo de arriba, calculados solo con piso).
        if (l.bajo_objetivo) { n_bajo_objetivo++; valor_brecha_objetivo += l.brecha_objetivo || 0; }
      });

      var iec_global = piso_total_elegible > 0 ? (valor_cotizado_elegible / piso_total_elegible) : null;
      var semaforo = Calc.semaforo(iec_global, config);

      return {
        precio_piso_total: precio_piso_total,
        valor_cotizado_total: valor_cotizado_total,
        iec_global: iec_global,
        margen_estimado: margen_conocido ? margen_estimado : null,
        margen_estimado_parcial: !margen_conocido,
        valor_ganado: valor_ganado,
        valor_cedido: valor_cedido,
        n_lineas_bajo_piso: n_bajo_piso,
        n_lineas_sobre_piso: n_sobre_piso,
        n_lineas_sin_piso: n_sin_piso,
        n_lineas_bajo_objetivo: n_bajo_objetivo,
        valor_brecha_objetivo: valor_brecha_objetivo,
        semaforo: semaforo
      };
    },

    /** Traduce el IEC global a un semáforo de política comercial. */
    semaforo: function (iecGlobal, config) {
      var th = (config && config.iec && config.iec.semaforo) || { verde_min: 1.03, amarillo_min: 0.98, naranja_min: 0.90 };
      var labels = (config && config.iec && config.iec.semaforo && config.iec.semaforo.labels) || {};
      if (iecGlobal === null || iecGlobal === undefined) {
        return { clave: 'sin_datos', nombre: 'Sin datos', descripcion: 'Sin líneas con piso definido', color: '#5a7060' };
      }
      if (iecGlobal >= th.verde_min) {
        return merge({ clave: 'verde', color: '#7AB648' }, labels.verde);
      }
      if (iecGlobal >= th.amarillo_min) {
        return merge({ clave: 'amarillo', color: '#F5A623' }, labels.amarillo);
      }
      if (iecGlobal >= th.naranja_min) {
        return merge({ clave: 'naranja', color: '#E08A2B' }, labels.naranja);
      }
      return merge({ clave: 'rojo', color: '#E74C3C' }, labels.rojo);
    }
  };

  function merge(base, extra) {
    var out = {};
    for (var k in base) out[k] = base[k];
    if (extra) for (var k2 in extra) out[k2] = extra[k2];
    return out;
  }

  // ────────────────────────────────────────────────────────────────
  // RECOMENDACIÓN COMERCIAL (Fase 2) — capa de presentación sobre los
  // totales ya calculados. NO modifica IEC/semáforo/margen: solo los
  // interpreta en lenguaje de negociación para asistir al vendedor.
  // ────────────────────────────────────────────────────────────────
  var Recomendacion = {
    generar: function (totales, moneda) {
      if (!totales || totales.iec_global === null || totales.iec_global === undefined) {
        return {
          nivel: 'sin_datos', icono: '⚪', titulo: 'Sin datos suficientes',
          cuerpo: 'Agrega líneas con precio piso definido para recibir una recomendación comercial.'
        };
      }
      // Prioridad 1: alguna línea realmente bajo precio piso (o semáforo naranja/rojo) → riesgo real de política.
      if (totales.n_lineas_bajo_piso > 0 || totales.semaforo.clave === 'naranja' || totales.semaforo.clave === 'rojo') {
        return {
          nivel: 'rojo', icono: '🔴', titulo: 'Riesgo Comercial',
          cuerpo: 'Cotización bajo política (' + totales.n_lineas_bajo_piso + ' línea(s) bajo Precio Piso). Requiere autorización antes de emitir.'
        };
      }
      // Prioridad 2: nada bajo piso, pero sí hay líneas bajo Precio Objetivo → alerta temprana.
      if (totales.n_lineas_bajo_objetivo > 0) {
        return {
          nivel: 'amarillo', icono: '🟡', titulo: 'Atención',
          cuerpo: 'Existen ' + totales.n_lineas_bajo_objetivo + ' producto(s) bajo Precio Objetivo. Se recomienda revisar antes de enviar.'
        };
      }
      // Prioridad 3: todo sobre política y sobre objetivo → negociación saludable.
      return {
        nivel: 'verde', icono: '🟢', titulo: 'Excelente negociación',
        cuerpo: 'Todos los productos cumplen la política comercial. IEC Global ' + util.formatPct(totales.iec_global) + '. Valor generado: ' + util.formatMoney(totales.valor_ganado, moneda) + '.'
      };
    }
  };

  // ────────────────────────────────────────────────────────────────
  // PIPELINE VISUAL (Fase 2) — barra decorativa, SIN funcionalidad.
  // No reemplaza estados_transiciones ni Quote.cambiarEstado.
  // ────────────────────────────────────────────────────────────────
  var Pipeline = {
    etapas: function (config) {
      return (config && config.pipeline_visual && config.pipeline_visual.etapas) || ['BORRADOR', 'ENVIADA', 'NEGOCIACIÓN', 'ACEPTADA', 'PEDIDO'];
    },
    /** Devuelve la etapa visual (o null si el estado real no mapea a ninguna, ej. RECHAZADA) */
    etapaActual: function (estadoReal, config) {
      var mapa = (config && config.pipeline_visual && config.pipeline_visual.mapa_estado_real) || {};
      return mapa.hasOwnProperty(estadoReal) ? mapa[estadoReal] : null;
    }
  };

  // ────────────────────────────────────────────────────────────────
  // MOTOR LOGÍSTICO (Fase 3) — distancia + costo de despacho.
  // Completamente aislado de Calc/IEC/semáforo: quote.despacho{} nunca
  // se lee dentro de Calc.calcularLinea/calcularTotales.
  // ────────────────────────────────────────────────────────────────
  var Logistica = {
    nuevoDespacho: function () {
      return {
        direccion: '', ciudad: '',
        distancia_km: null, tiempo_min: null,
        costo_km: 0, costo_despacho: 0,
        incluido: false,
        estado: 'sin_calcular',   // sin_calcular | calculando | automatico | manual | error_fallback_manual
        mensaje: ''
      };
    },

    origenPais: function (config, pais) {
      var log = config && config.logistica;
      if (!log) return '';
      return pais === 'PE' ? (log.origen_peru || '') : (log.origen_chile || '');
    },

    costoKmPais: function (config, pais) {
      var log = config && config.logistica;
      if (!log) return 0;
      return Number(pais === 'PE' ? log.costo_km_peru_usd : log.costo_km_chile_clp) || 0;
    },

    /** Fase 6: timeout configurable (data/config.json → logistica.timeout_ms). Default 10000ms si no está definido. */
    timeoutMs: function (config) {
      var log = config && config.logistica;
      var ms = log && Number(log.timeout_ms);
      return (ms && ms > 0) ? ms : 10000;
    },

    /** true si el sistema tiene lo mínimo (key + origen real) para intentar el cálculo automático. */
    apiDisponible: function (config, pais) {
      var log = config && config.logistica;
      if (!log || !log.api_key) return false;
      var origen = Logistica.origenPais(config, pais);
      if (!origen || /^PENDIENTE|DIRECCION OFICIAL/i.test(origen)) return false;
      return true;
    },

    calcularCostoDespacho: function (distanciaKm, costoKm) {
      var d = Number(distanciaKm) || 0;
      var c = Number(costoKm) || 0;
      return Math.round(d * c * 100) / 100;
    },

    /**
     * Geocodifica una dirección con OpenRouteService (Pelias). Devuelve
     * Promise<[lon, lat]> o rechaza si no encuentra resultados.
     */
    _geocode: function (apiKey, texto) {
      var url = 'https://api.openrouteservice.org/geocode/search?api_key=' + encodeURIComponent(apiKey) +
        '&text=' + encodeURIComponent(texto) + '&size=1';
      return fetch(url).then(function (r) {
        if (!r.ok) throw new Error('Geocodificación falló (HTTP ' + r.status + ')');
        return r.json();
      }).then(function (data) {
        var f = data && data.features && data.features[0];
        if (!f) throw new Error('No se encontró la dirección: "' + texto + '"');
        return f.geometry.coordinates; // [lon, lat]
      });
    },

    /** Llama directions v2 (driving-car) entre dos coordenadas [lon,lat]. */
    _directions: function (apiKey, coordOrigen, coordDestino) {
      return fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
        method: 'POST',
        headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ coordinates: [coordOrigen, coordDestino] })
      }).then(function (r) {
        if (!r.ok) throw new Error('Cálculo de ruta falló (HTTP ' + r.status + ')');
        return r.json();
      }).then(function (data) {
        var f = data && data.features && data.features[0];
        var s = f && f.properties && f.properties.summary;
        if (!s) throw new Error('Respuesta de ruta sin datos de distancia.');
        return { distancia_km: s.distance / 1000, tiempo_min: s.duration / 60 };
      });
    },

    _conTimeout: function (promise, ms, mensajeTimeout) {
      var timeout = new Promise(function (_, reject) {
        setTimeout(function () { reject(new Error(mensajeTimeout || 'Tiempo de espera agotado.')); }, ms);
      });
      return Promise.race([promise, timeout]);
    },

    /**
     * Calcula distancia/tiempo automáticamente vía OpenRouteService.
     * Devuelve Promise<{distancia_km, tiempo_min}>. Quien llama SIEMPRE
     * debe capturar el error y caer a ingreso manual — nunca debe
     * bloquear la cotización (ver cotizador_chile.html/cotizador_peru.html).
     * Fase 6: el timeout ya NO está hardcodeado — se recibe como parámetro
     * (léase con Logistica.timeoutMs(config) desde data/config.json →
     * logistica.timeout_ms, default 10000ms si no está definido).
     */
    calcularDistanciaAutomatica: function (origenTexto, destinoTexto, apiKey, timeoutMs) {
      var self = this;
      var trabajo = self._geocode(apiKey, origenTexto).then(function (coordOrigen) {
        return self._geocode(apiKey, destinoTexto).then(function (coordDestino) {
          return self._directions(apiKey, coordOrigen, coordDestino);
        });
      });
      var ms = (timeoutMs && timeoutMs > 0) ? timeoutMs : 10000;
      return self._conTimeout(trabajo, ms, 'La consulta a OpenRouteService demoró demasiado.');
    }
  };

  // ────────────────────────────────────────────────────────────────
  // MODELO DE COTIZACIÓN
  // ────────────────────────────────────────────────────────────────
  var Quote = {
    nueva: function (pais, paisConfig, elaboradoPor) {
      var numero = Numbering.next(pais, paisConfig.prefijo_numero);
      return {
        id: util.uid(),
        numero: numero,
        pais: pais,
        moneda: paisConfig.moneda,
        fecha: util.todayISO(),
        cliente: {
          nombre: '', rut: '', contacto: '', rtc: '',
          // Fase 2 — aditivo: autoload desde el catálogo de clientes cuando existan.
          direccion: '', ciudad: '', correo: '', telefono: '', condicion_pago_habitual: ''
        },
        elaborado_por: elaboradoPor || '',
        condicion_pago: '',
        validez_dias: 15,
        lugar_entrega: '',
        observaciones: '',
        comentarios_internos: '',
        estado: 'BORRADOR',
        lineas: [],
        totales: null,
        // Fase 3 — aditivo: motor logístico. Completamente separado de
        // `totales` (IEC/margen/piso) — ver Quote.totalConDespacho().
        despacho: Logistica.nuevoDespacho(),
        historial_estados: [{ estado: 'BORRADOR', fecha: util.nowISO(), por: elaboradoPor || '' }],
        meta: { creado: util.nowISO(), actualizado: util.nowISO(), version_sistema: '1.0.0' }
      };
    },

    lineaVacia: function () {
      return {
        sku: '', producto: '', presentacion: '', unidad: '',
        // Corrección Final — modelo simple: precios SIEMPRE por litro/kilo.
        contenido_presentacion: 1, cantidad_envases: 1,
        precio_piso_unitario: null, precio_lista_unitario: null, precio_objetivo_unitario: null,
        costo_referencial_unitario: null,
        precio_venta_unitario: 0
      };
    },

    /**
     * Fase 2 (vuelto a nivel de precio unitario en la Corrección Final):
     * sugiere un Precio Objetivo inicial entre Piso y Lista (ambos por
     * litro/kilo), usando el factor de data/config.json → objetivo.factor_default.
     * Es solo una sugerencia editable — no implementa política alguna.
     */
    sugerirObjetivoUnitario: function (precioPisoUnitario, precioListaUnitario, config) {
      var factor = (config && config.objetivo && config.objetivo.factor_default) || 0.5;
      var piso = Number(precioPisoUnitario) || 0;
      var lista = precioListaUnitario === null || precioListaUnitario === undefined ? null : Number(precioListaUnitario);
      if (piso <= 0) return null;
      if (lista !== null && lista > piso) return piso + (lista - piso) * factor;
      return piso;
    },

    /** Recalcula líneas y totales in-place. Devuelve la cotización. */
    recalcular: function (quote, config) {
      quote.lineas = quote.lineas.map(function (l) { return Calc.calcularLinea(l, config); });
      quote.totales = Calc.calcularTotales(quote.lineas, config);
      quote.meta.actualizado = util.nowISO();
      return quote;
    },

    /**
     * Fase 3: total comercial = subtotal de productos (quote.totales,
     * intacto) + despacho SOLO si el usuario decidió incluirlo. Esta es
     * la única función que combina ambos números — Calc.calcularTotales
     * nunca conoce quote.despacho, por lo que IEC/margen/piso quedan
     * exactamente iguales se incluya o no el despacho.
     */
    totalConDespacho: function (quote) {
      var subtotal = quote.totales ? quote.totales.valor_cotizado_total : 0;
      var despacho = (quote.despacho && quote.despacho.incluido) ? (Number(quote.despacho.costo_despacho) || 0) : 0;
      return { subtotal_productos: subtotal, costo_despacho: despacho, total: subtotal + despacho };
    },

    /** Cambia de estado respetando la máquina de estados de config.json */
    cambiarEstado: function (quote, nuevoEstado, actor, config) {
      var permitidos = (config.estados_transiciones && config.estados_transiciones[quote.estado]) || [];
      if (permitidos.indexOf(nuevoEstado) === -1) {
        throw new Error('Transición no permitida: ' + quote.estado + ' → ' + nuevoEstado);
      }
      quote.estado = nuevoEstado;
      quote.historial_estados.push({ estado: nuevoEstado, fecha: util.nowISO(), por: actor || '' });
      quote.meta.actualizado = util.nowISO();
      return quote;
    }
  };

  // ────────────────────────────────────────────────────────────────
  // STORAGE — patrón adapter (hoy: localStorage · mañana: API)
  // ────────────────────────────────────────────────────────────────
  var LocalStorageAdapter = {
    _key: function (pais) { return STORAGE_PREFIX + 'quotes_' + pais; },
    _readAll: function (pais) {
      try {
        var raw = localStorage.getItem(this._key(pais));
        return raw ? JSON.parse(raw) : [];
      } catch (e) { return []; }
    },
    _writeAll: function (pais, list) {
      localStorage.setItem(this._key(pais), JSON.stringify(list));
    },
    save: function (quote) {
      var list = this._readAll(quote.pais);
      var idx = list.findIndex(function (q) { return q.id === quote.id; });
      if (idx >= 0) list[idx] = quote; else list.push(quote);
      this._writeAll(quote.pais, list);
      return Promise.resolve(quote);
    },
    get: function (pais, id) {
      var list = this._readAll(pais);
      var found = list.find(function (q) { return q.id === id; });
      return Promise.resolve(found || null);
    },
    list: function (pais, filtros) {
      var list = this._readAll(pais);
      filtros = filtros || {};
      var out = list.filter(function (q) {
        if (filtros.cliente && (q.cliente.nombre || '').toLowerCase().indexOf(filtros.cliente.toLowerCase()) === -1) return false;
        if (filtros.rtc && (q.cliente.rtc || '').toLowerCase().indexOf(filtros.rtc.toLowerCase()) === -1) return false;
        if (filtros.numero && (q.numero || '').toLowerCase().indexOf(filtros.numero.toLowerCase()) === -1) return false;
        if (filtros.estado && q.estado !== filtros.estado) return false;
        if (filtros.fechaDesde && q.fecha < filtros.fechaDesde) return false;
        if (filtros.fechaHasta && q.fecha > filtros.fechaHasta) return false;
        return true;
      });
      out.sort(function (a, b) { return (b.meta.actualizado || '').localeCompare(a.meta.actualizado || ''); });
      return Promise.resolve(out);
    },
    remove: function (pais, id) {
      var list = this._readAll(pais).filter(function (q) { return q.id !== id; });
      this._writeAll(pais, list);
      return Promise.resolve(true);
    }
  };

  var _adapter = LocalStorageAdapter;

  var Storage = {
    /**
     * Punto de extensión: para integrar con un backend real (Executive
     * Board / CRM / Pipeline / Pedidos / Facturación) basta con crear
     * un adapter que implemente {save, get, list, remove} devolviendo
     * Promises con la misma forma y llamar Storage.setAdapter(adapter).
     * Ningún otro archivo del cotizador necesita cambiar.
     */
    setAdapter: function (adapter) { _adapter = adapter; },
    current: function () { return _adapter; },
    save: function (quote) { return _adapter.save(quote); },
    get: function (pais, id) { return _adapter.get(pais, id); },
    list: function (pais, filtros) { return _adapter.list(pais, filtros); },
    remove: function (pais, id) { return _adapter.remove(pais, id); }
  };

  // ────────────────────────────────────────────────────────────────
  // PDF CLIENTE — vista limpia, sin datos internos
  // (Fase 1: impresión de navegador / "Guardar como PDF". La carpeta
  // exports/ queda reservada para cuando se sume generación server-side).
  // ────────────────────────────────────────────────────────────────
  var CAMPOS_PROHIBIDOS_CLIENTE = [
    'precio_piso', 'precio_piso_unitario', 'iec_linea', 'margen_linea', 'margen_pct',
    'costo_referencial', 'costo_referencial_unitario', 'valor_ganado', 'valor_cedido',
    // Fase 2 — el concepto Precio Objetivo tampoco es información para el cliente.
    'precio_objetivo', 'precio_objetivo_unitario', 'precio_lista_ref', 'precio_lista_unitario',
    'bajo_objetivo', 'brecha_objetivo', 'tiene_objetivo', 'n_lineas_bajo_objetivo', 'valor_brecha_objetivo',
    // Fase 3 — lógica interna del motor logístico: nunca al cliente.
    'distancia_km', 'tiempo_min', 'costo_km', 'proveedor_api', 'api_key', 'estado', 'mensaje',
    // Corrección Final — el cliente ve un único "Precio unitario" (por
    // envase, ya calculado), nunca el desglose por litro/kilo ni el
    // factor de presentación interno.
    'factor_presentacion', 'contenido_presentacion', 'precio_venta_unitario',
    // Fase 4 (histórico/compatibilidad interna — ya no gobierna el cálculo,
    // se mantiene en la whitelist negativa por si algún borrador antiguo aún los trae):
    'tipo_precio', 'unidad_contenido', 'precio_piso_presentacion', 'precio_lista_presentacion',
    'precio_objetivo_presentacion', 'costo_referencial_presentacion', 'precio_venta_presentacion_calculado'
  ];

  var PDF = {
    /** Devuelve SOLO los datos permitidos para el cliente — nunca piso/IEC/costo/margen/alertas. */
    vistaCliente: function (quote) {
      // Fase 3: el despacho solo aparece en la vista cliente como un monto
      // (si está incluido) — nunca distancia/costo por km/proveedor/estado.
      var conDespacho = Quote.totalConDespacho(quote);
      var despachoIncluido = !!(quote.despacho && quote.despacho.incluido);
      return {
        numero: quote.numero,
        fecha: quote.fecha,
        cliente: {
          nombre: quote.cliente.nombre, rut: quote.cliente.rut, contacto: quote.cliente.contacto,
          direccion: quote.cliente.direccion || '', ciudad: quote.cliente.ciudad || ''
        },
        elaborado_por: quote.elaborado_por,
        condicion_pago: quote.condicion_pago,
        validez_dias: quote.validez_dias,
        lugar_entrega: quote.lugar_entrega,
        observaciones: quote.observaciones,
        moneda: quote.moneda,
        lineas: quote.lineas.map(function (l) {
          return {
            producto: l.producto,
            presentacion: l.presentacion,
            // Corrección Final: "Precio Unitario Comercial" = precio por
            // envase ya calculado (precio_venta_unitario × factor_presentacion)
            // — nunca el precio por litro/kilo ni el factor interno.
            cantidad: l.cantidad_envases,
            precio_unitario: l.precio_venta_envase,
            total_linea: l.total_linea
          };
        }),
        subtotal_productos: conDespacho.subtotal_productos,
        despacho_incluido: despachoIncluido,
        despacho_monto: despachoIncluido ? conDespacho.costo_despacho : 0,
        total: conDespacho.total
      };
    },
    /**
     * Fase 2: PDF cliente rediseñado — imagen corporativa (marca AV +
     * wordmark Agroveca), y firma manual de "Elaborado por" (el nombre
     * viene del campo que el vendedor escribió a mano en el encabezado
     * de la cotización — NUNCA un usuario de sistema automático).
     * Sigue sin mostrar piso/objetivo/costo/IEC/margen/alertas/comentarios.
     */
    imprimir: function (quote, paisNombre) {
      var v = PDF.vistaCliente(quote);
      var win = window.open('', '_blank');
      var filas = v.lineas.map(function (l) {
        return '<tr>' +
          '<td>' + util.escapeHTML(l.producto) + '</td>' +
          '<td>' + util.escapeHTML(l.presentacion) + '</td>' +
          '<td class="num">' + l.cantidad + '</td>' +
          '<td class="num">' + util.formatMoney(l.precio_unitario, v.moneda) + '</td>' +
          '<td class="num">' + util.formatMoney(l.total_linea, v.moneda) + '</td>' +
          '</tr>';
      }).join('');
      var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Cotización ' + util.escapeHTML(v.numero) + '</title>' +
        '<style>' +
        '*{box-sizing:border-box}' +
        'body{font-family:Arial,Helvetica,sans-serif;color:#1a2a1c;padding:0;max-width:800px;margin:0 auto;background:#fff}' +
        '.doc-header{display:flex;align-items:center;justify-content:space-between;padding:26px 34px;background:#0f1a10;color:#fff}' +
        '.brand{display:flex;align-items:center;gap:14px}' +
        '.brand-mark{height:42px;background:#ffffff;border-radius:9px;display:flex;align-items:center;justify-content:center;padding:5px 12px}' +
        '.brand-mark img{height:30px;width:auto;display:block}' +
        '.brand-name{font-size:15px;font-weight:700;letter-spacing:1px}' +
        '.brand-sub{font-size:10px;color:#a9c9ac;letter-spacing:1.5px;text-transform:uppercase;margin-top:2px}' +
        '.doc-tag{text-align:right;font-size:10px;color:#a9c9ac;letter-spacing:1px;text-transform:uppercase}' +
        '.doc-body{padding:30px 34px}' +
        '.doc-title{font-size:19px;font-weight:800;color:#0f1a10;letter-spacing:.5px;margin-bottom:2px}' +
        '.doc-num{font-family:"Courier New",monospace;font-size:13px;color:#3d6b25;margin-bottom:22px}' +
        'table{width:100%;border-collapse:collapse;margin:18px 0}' +
        'th{background:#f0f4ee;text-align:left;padding:9px 8px;font-size:10.5px;text-transform:uppercase;letter-spacing:.5px;color:#3d6b25;border-bottom:2px solid #7AB648}' +
        'td{padding:9px 8px;border-bottom:1px solid #e5e5e5;font-size:13px}' +
        '.num{text-align:right}' +
        '.total-row td{font-weight:800;border-top:2px solid #7AB648;font-size:15px;color:#0f1a10}' +
        '.grid{display:grid;grid-template-columns:1fr 1fr;gap:9px 28px;margin-bottom:8px;font-size:12.5px;border:1px solid #e5e5e5;border-radius:10px;padding:18px 20px;background:#fafbf9}' +
        '.grid b{color:#3d6b25;display:block;font-size:9.5px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;font-weight:700}' +
        '.grid span{font-size:13px}' +
        '.obs{margin:18px 0;font-size:12.5px;line-height:1.6}' +
        '.obs b{color:#3d6b25}' +
        '.firma{margin-top:56px;display:flex;justify-content:flex-start}' +
        '.firma-box{width:280px;text-align:center}' +
        '.firma-linea{border-top:1px solid #1a2a1c;margin-bottom:6px;padding-top:8px;font-size:13px;min-height:18px}' +
        '.firma-label{font-size:9.5px;color:#666;text-transform:uppercase;letter-spacing:1px}' +
        '.doc-footer{margin-top:34px;padding-top:14px;border-top:1px solid #e5e5e5;font-size:10px;color:#999;display:flex;justify-content:space-between}' +
        '@media print{.doc-header{background:#0f1a10 !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}}' +
        '</style></head><body>' +
        '<div class="doc-header">' +
        '<div class="brand"><div class="brand-mark"><img src="' + (typeof AV_LOGO_DATA_URL !== 'undefined' ? AV_LOGO_DATA_URL : '') + '" alt="AV LATAM"></div><div><div class="brand-name">AGROVECA GRUPO LATAM</div><div class="brand-sub">Centro Comercial AV LATAM · ' + util.escapeHTML(paisNombre || '') + '</div></div></div>' +
        '<div class="doc-tag">Cotización Comercial<br>' + util.escapeHTML(v.fecha) + '</div>' +
        '</div>' +
        '<div class="doc-body">' +
        '<div class="doc-title">COTIZACIÓN COMERCIAL</div>' +
        '<div class="doc-num">' + util.escapeHTML(v.numero) + '</div>' +
        '<div class="grid">' +
        '<div><b>Cliente</b><span>' + util.escapeHTML(v.cliente.nombre || '—') + '</span></div>' +
        '<div><b>RUT / RUC</b><span>' + util.escapeHTML(v.cliente.rut || '—') + '</span></div>' +
        (v.cliente.direccion ? '<div><b>Dirección</b><span>' + util.escapeHTML(v.cliente.direccion) + '</span></div>' : '') +
        (v.cliente.ciudad ? '<div><b>Ciudad</b><span>' + util.escapeHTML(v.cliente.ciudad) + '</span></div>' : '') +
        '<div><b>Contacto</b><span>' + util.escapeHTML(v.cliente.contacto || '—') + '</span></div>' +
        '<div><b>Condición de pago</b><span>' + util.escapeHTML(v.condicion_pago || '—') + '</span></div>' +
        '<div><b>Validez de la oferta</b><span>' + v.validez_dias + ' días</span></div>' +
        '<div><b>Lugar de entrega</b><span>' + util.escapeHTML(v.lugar_entrega || '—') + '</span></div>' +
        '</div>' +
        '<table><thead><tr><th>Producto</th><th>Presentación</th><th class="num">Cantidad</th><th class="num">Precio Unitario Comercial</th><th class="num">Subtotal</th></tr></thead>' +
        '<tbody>' + filas +
        (v.despacho_incluido ?
          '<tr><td colspan="4">Subtotal Productos</td><td class="num">' + util.formatMoney(v.subtotal_productos, v.moneda) + '</td></tr>' +
          '<tr><td colspan="4">Despacho / Entrega</td><td class="num">' + util.formatMoney(v.despacho_monto, v.moneda) + '</td></tr>'
          : '') +
        '<tr class="total-row"><td colspan="4">TOTAL</td><td class="num">' + util.formatMoney(v.total, v.moneda) + '</td></tr></tbody></table>' +
        (v.observaciones ? '<div class="obs"><b>Observaciones / Condiciones comerciales:</b><br>' + util.escapeHTML(v.observaciones) + '</div>' : '') +
        '<div class="firma">' +
        '<div class="firma-box">' +
        '<div class="firma-linea">' + (v.elaborado_por ? util.escapeHTML(v.elaborado_por) : '&nbsp;') + '</div>' +
        '<div class="firma-label">Elaborado por</div>' +
        '</div></div>' +
        '<div class="doc-footer"><span>Documento generado por el Centro Comercial AV LATAM · Cotizador. No válido como factura.</span><span>' + util.escapeHTML(v.numero) + '</span></div>' +
        '</div>' +
        '</body></html>';
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(function () { win.print(); }, 300);
    }
  };

  // ────────────────────────────────────────────────────────────────
  // EXPORT JSON — snapshot descargable (trazabilidad / respaldo manual)
  // ────────────────────────────────────────────────────────────────
  var Export = {
    descargarJSON: function (quote) {
      var blob = new Blob([JSON.stringify(quote, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = quote.numero + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return {
    util: util,
    init: init,
    loadConfig: loadConfig,
    Numbering: Numbering,
    Calc: Calc,
    Quote: Quote,
    Storage: Storage,
    LocalStorageAdapter: LocalStorageAdapter,
    PDF: PDF,
    Export: Export,
    // Fase 2 — aditivos:
    Recomendacion: Recomendacion,
    Pipeline: Pipeline,
    // Fase 3 — aditivo:
    Logistica: Logistica
  };
})();
