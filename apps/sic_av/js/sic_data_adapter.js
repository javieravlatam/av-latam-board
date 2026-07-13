/**
 * SIC-AV — Adaptador de datos reales (CHANGE REQUEST SIC-AV v1.5, Fase 2)
 * =========================================================================================
 * Capa de adaptacion de SOLO LECTURA entre las fuentes reales YA EXISTENTES de AV LATAM
 * Board y el motor de calculo SIC (sic_core.js), que NO se modifica.
 *
 * Fuentes reales que este archivo lee (nunca escribe, nunca modifica):
 *   - Panel_IEC_Auditoria_2026.html  -> TX_CL / TX_PE (detalle transaccional real,
 *     unica capa de AVBOARD con granularidad diaria -- fecha, folio, vendedor,
 *     producto, precio de venta, precio piso).
 *   - avboard_data.js                -> presupuesto mensual real por RTC (Chile) /
 *     presupuesto anual real por RTC (Peru).
 *
 * NO crea una base de datos paralela: no copia ni persiste estas fuentes en un
 * archivo propio, las lee en cada carga y las transforma en memoria al formato
 * que sic_core.js ya espera (mismo "ctx" que usa la Fase 4 con datos demo).
 *
 * Brechas conocidas (documentadas en detalle en apps/sic_av/DATA_SOURCE_AUDIT.md):
 *   - No existe en ninguna fuente una fecha de cobro real por factura. Los
 *     archivos de Cuentas por Cobrar son fotos de saldo pendiente a una fecha
 *     de corte, no un libro de cobros. Por eso este adaptador NO inventa
 *     fechas de pago: cada venta real que construye queda con
 *     venta_cobrada = 0 (comision liberada = 0) y una advertencia explicita,
 *     hasta que AVBOARD incorpore una fuente real de cobranza.
 *   - Perú no distingue tipo_cliente (Distribuidor/Cliente Final) a nivel de
 *     transaccion -- se usa "Distribuidor" por defecto y se advierte.
 *   - El presupuesto real de Perú solo existe a nivel ANUAL por vendedor (no
 *     mensual como Chile) -- el prorrateo a un ciclo es una aproximacion mas
 *     gruesa que la de Chile, y se marca como tal.
 *
 * Este archivo se usa igual que sic_core.js: se carga con <script src> y
 * expone `window.SICAdapter`. No depende de ninguna libreria externa ni CDN.
 */
(function (global) {
  "use strict";

  var SICAdapter = {};

  // Rutas relativas a las fuentes reales del Board, asumiendo que el archivo
  // que usa este adaptador vive en apps/sic_av/ (dos niveles bajo la raiz del
  // repo, donde realmente estan Panel_IEC_Auditoria_2026.html y avboard_data.js).
  SICAdapter.RUTAS = {
    panelIec: "../../Panel_IEC_Auditoria_2026.html",
    avboardData: "../../avboard_data.js"
  };

  // ---------------------------------------------------------------------
  // A. Normalizacion de vendedor -- UN SOLO mapa nombre->clave (a diferencia
  // de los 3 mapas nombre->clave distintos y no unificados que hoy coexisten
  // en scripts/update_avboard.py -- ver DATA_SOURCE_AUDIT.md seccion 3.3).
  // ---------------------------------------------------------------------
  SICAdapter.VENDEDOR_MAP = {
    CL: {
      "PABLO LARATRO": "laratro",
      "FRANCISCO VELASQUEZ": "velasquez",
      "RODRIGO ENCINA": "encina",
      "VALENTINA MUÑOZ": "munoz",
      "JORGE CAROCA": "caroca",
      "IVAN VEVERKA": "veverka",
      "FRANCO RIFFO": "franco_riffo"
    },
    PE: {
      "NICOLL NAVARRO": "navarro",
      "OSCAR INFANTE": "infante",
      "OMAR ATALAYA": "atalaya",
      "SUSAN DIAZ": "diaz",
      "ANTONIO GONZALEZ": "gonzales",
      "ANTONIO GONZALES": "gonzales",
      "LIZBETH AGUIRRE": "aguirre",
      "PATRICIA VALLADARES": "valladares"
    }
  };

  // Entradas del campo "vendedor" que NO son personal comercial. Se excluyen
  // del SIC y se reportan como advertencia -- nunca en silencio (regla del
  // CHANGE REQUEST v1.5: "No excluir silenciosamente registros").
  SICAdapter.NO_COMERCIAL = ["OFICINA", "LABORATORIO", "EN TERRENO 1", "JAVIER ALMEIDA"];

  SICAdapter.normalizarVendedor = function (pais, nombreCrudo) {
    var n = String(nombreCrudo || "").trim().toUpperCase();
    if (SICAdapter.NO_COMERCIAL.indexOf(n) !== -1) {
      return { clave: null, nombre: n, esComercial: false, mapeado: true };
    }
    var mapa = SICAdapter.VENDEDOR_MAP[pais] || {};
    if (mapa[n]) {
      return { clave: mapa[n], nombre: n, esComercial: true, mapeado: true };
    }
    // Vendedor real detectado pero sin mapeo conocido: no se descarta ni se
    // inventa una clave -- se reporta como advertencia y se usa una clave
    // derivada del nombre para no perder el dato.
    return { clave: n.toLowerCase().replace(/[^a-z0-9]+/g, "_"), nombre: n, esComercial: true, mapeado: false };
  };

  // ---------------------------------------------------------------------
  // B. Ciclo comercial 26 -> 25 (misma regla que sic_chile.html/sic_peru.html
  // ya documentan): si el dia de la fecha es <= 25, el ciclo es ese mes; si
  // es >= 26, el ciclo es el mes siguiente.
  // ---------------------------------------------------------------------
  SICAdapter.asignarCiclo = function (fechaISO) {
    var partes = String(fechaISO).split("-");
    var y = parseInt(partes[0], 10), m = parseInt(partes[1], 10), d = parseInt(partes[2], 10);
    var cicloY = y, cicloM = m;
    if (d >= 26) {
      cicloM += 1;
      if (cicloM > 12) { cicloM = 1; cicloY += 1; }
    }
    var cicloCode = cicloY + "-" + (cicloM < 10 ? "0" + cicloM : String(cicloM));
    var inicioM = cicloM - 1, inicioY = cicloY;
    if (inicioM < 1) { inicioM = 12; inicioY -= 1; }
    var inicio = inicioY + "-" + (inicioM < 10 ? "0" + inicioM : String(inicioM)) + "-26";
    var cierre = cicloY + "-" + (cicloM < 10 ? "0" + cicloM : String(cicloM)) + "-25";
    return { ciclo: cicloCode, inicio: inicio, cierre: cierre };
  };

  SICAdapter._diasEnMes = function (anio, mes1a12) {
    return new Date(anio, mes1a12, 0).getDate();
  };

  // Proporcion de dias que un ciclo 26->25 toma de cada uno de los dos meses
  // calendario que cruza -- usado para prorratear presupuesto mensual real.
  SICAdapter._proporcionMeses = function (cicloCode) {
    var partes = cicloCode.split("-");
    var y = parseInt(partes[0], 10), m = parseInt(partes[1], 10);
    var mesAnteriorIdx = m - 2; // 0-based, mes anterior al del ciclo
    var mesActualIdx = m - 1;   // 0-based
    var anioAnterior = y;
    if (mesAnteriorIdx < 0) { mesAnteriorIdx = 11; anioAnterior = y - 1; }
    var diasMesAnterior = SICAdapter._diasEnMes(anioAnterior, mesAnteriorIdx + 1);
    var diasMesActual = SICAdapter._diasEnMes(y, mesActualIdx + 1);
    var diasDelAnterior = diasMesAnterior - 25; // del 26 al fin de mes
    var diasDelActual = 25; // del 1 al 25
    return {
      mesAnteriorIdx: mesAnteriorIdx, mesActualIdx: mesActualIdx,
      pctAnterior: diasDelAnterior / diasMesAnterior,
      pctActual: diasDelActual / diasMesActual
    };
  };

  // ---------------------------------------------------------------------
  // C. Extraccion de TX_CL / TX_PE desde Panel_IEC_Auditoria_2026.html
  // (texto crudo, sin ejecutar el HTML) -- unica capa de AVBOARD con
  // granularidad diaria por transaccion.
  // ---------------------------------------------------------------------
  SICAdapter._sanearJson = function (texto) {
    // El HTML real contiene caracteres de control crudos dentro de strings
    // (ej. tabs pegados desde comentarios de Excel), invalidos en JSON
    // estricto. Se reemplazan por un espacio -- no altera montos, fechas ni
    // claves, solo texto libre no usado por el SIC (comentarios/glosas).
    return texto.replace(/[\x00-\x1F]/g, " ");
  };

  SICAdapter._parseArrayJsLiteral = function (texto) {
    // TX_CL/TX_PE se serializaron como literal de objeto JS, no como JSON
    // estricto -- se detectaron valores "NaN" crudos (bug real de parseo de
    // fechas en Peru, ver DATA_SOURCE_AUDIT.md seccion 3.2) que JSON.parse
    // rechaza. Se evalua como literal de arreglo JS (sin ejecutar codigo
    // externo, es solo el arreglo de datos) para tolerar NaN igual que lo
    // toleraria el propio Panel_IEC_Auditoria_2026.html al cargarlo.
    // eslint-disable-next-line no-new-func
    return new Function("return (" + SICAdapter._sanearJson(texto) + ");")();
  };

  SICAdapter.extraerTX = function (htmlTexto) {
    var out = { TX_CL: [], TX_PE: [] };
    var mCL = htmlTexto.match(/const TX_CL = (\[[\s\S]*?\]);/);
    var mPE = htmlTexto.match(/const TX_PE = (\[[\s\S]*?\]);/);
    if (mCL) out.TX_CL = SICAdapter._parseArrayJsLiteral(mCL[1]);
    if (mPE) out.TX_PE = SICAdapter._parseArrayJsLiteral(mPE[1]);
    return out;
  };

  // ---------------------------------------------------------------------
  // D. Extraccion de presupuesto real desde avboard_data.js (texto crudo,
  // sin ejecutar el archivo -- se evita re-disparar sus console.log y
  // efectos de IIFE, y se evita depender de que el runtime lo haya cargado
  // como <script src>).
  // ---------------------------------------------------------------------
  SICAdapter._extraerBloqueObjeto = function (texto, clave) {
    // Extrae el contenido entre { } que sigue a "clave:" o "clave =" (declaracion
    // de variable), respetando anidacion.
    var idx = texto.indexOf(clave + ":");
    if (idx === -1) idx = texto.indexOf(clave + " =");
    if (idx === -1) idx = texto.indexOf(clave + "=");
    if (idx === -1) return null;
    var inicio = texto.indexOf("{", idx);
    if (inicio === -1) return null;
    var profundidad = 0;
    for (var i = inicio; i < texto.length; i++) {
      if (texto[i] === "{") profundidad++;
      else if (texto[i] === "}") {
        profundidad--;
        if (profundidad === 0) return texto.slice(inicio, i + 1);
      }
    }
    return null;
  };

  SICAdapter._objetoJsALiteral = function (bloque) {
    // avboard_data.js usa sintaxis JS de objeto (claves sin comillas), no
    // JSON estricto -- se envuelve en parentesis y se evalua como literal de
    // objeto (sin ejecutar el resto del archivo ni sus efectos).
    // eslint-disable-next-line no-new-func
    return new Function("return (" + bloque + ");")();
  };

  SICAdapter.extraerPresupuestoReal = function (avboardDataTexto) {
    var chileVentasBloque = SICAdapter._extraerBloqueObjeto(avboardDataTexto, "var chile_ventas");
    var peruVentasBloque = SICAdapter._extraerBloqueObjeto(avboardDataTexto, "var peru_ventas");
    var chileVentas = chileVentasBloque ? SICAdapter._objetoJsALiteral(chileVentasBloque) : null;
    var peruVentas = peruVentasBloque ? SICAdapter._objetoJsALiteral(peruVentasBloque) : null;
    return {
      CL: {
        rtc_mensual_ppto: (chileVentas && chileVentas.rtc_mensual_ppto) || {},
        rtc_mensual_real: (chileVentas && chileVentas.rtc_mensual_real) || {},
        fuente: "avboard_data.js -> chile_ventas.rtc_mensual_ppto (real, mensual)"
      },
      PE: {
        rtc_ppto_anual: (peruVentas && peruVentas.rtc_ppto_anual) || {},
        rtc_mensual_real: (peruVentas && peruVentas.rtc_mensual_real) || {},
        fuente: "avboard_data.js -> peru_ventas.rtc_ppto_anual (real, SOLO ANUAL -- no existe desglose mensual real para Peru)"
      }
    };
  };

  // ---------------------------------------------------------------------
  // E. Carga de fuentes reales (fetch, solo lectura)
  // ---------------------------------------------------------------------
  SICAdapter.cargarFuentesReales = function () {
    return Promise.all([
      fetch(SICAdapter.RUTAS.panelIec).then(function (r) {
        if (!r.ok) throw new Error("No se pudo leer " + SICAdapter.RUTAS.panelIec);
        return r.text();
      }),
      fetch(SICAdapter.RUTAS.avboardData).then(function (r) {
        if (!r.ok) throw new Error("No se pudo leer " + SICAdapter.RUTAS.avboardData);
        return r.text();
      })
    ]).then(function (resultados) {
      var tx = SICAdapter.extraerTX(resultados[0]);
      var ppto = SICAdapter.extraerPresupuestoReal(resultados[1]);
      return { tx: tx, presupuesto: ppto };
    });
  };

  // ---------------------------------------------------------------------
  // F. Construccion del ciclo real: transforma TX_CL/TX_PE + presupuesto
  // real en el mismo "ctx" que sic_core.js ya consume (SIC.calcularVendedorCiclo,
  // SIC.calcularDiferidoTrimestral, etc. NO se modifican -- solo se les da un
  // ctx construido con datos reales en vez de los JSON demo).
  // ---------------------------------------------------------------------
  SICAdapter.construirCicloReal = function (pais, cicloCode, fuentes, paramsPolitica) {
    var advertencias = [];
    var txArray = pais === "CL" ? fuentes.tx.TX_CL : fuentes.tx.TX_PE;
    if (!txArray || !txArray.length) {
      advertencias.push({ tipo: "sin_datos", detalle: "No se encontraron transacciones reales para " + pais + " en " + SICAdapter.RUTAS.panelIec });
    }

    var cicloInfo = null;
    var ventas = [];
    var vendedoresVistos = {};
    var foliosVistos = {};
    var monedaEsperada = pais === "CL" ? "CLP" : "USD";

    var fechasInvalidas = 0;
    (txArray || []).forEach(function (t, idx) {
      // Validacion: fecha ausente/invalida (ej. NaN -- bug real detectado en
      // TX_PE, ver DATA_SOURCE_AUDIT.md seccion 3.2). No se descarta en
      // silencio: se cuenta y se reporta una advertencia agregada.
      if (t.fecha === null || t.fecha === undefined || typeof t.fecha === "number" || !/^\d{4}-\d{2}-\d{2}$/.test(String(t.fecha))) {
        fechasInvalidas++;
        return;
      }
      var cInfo = SICAdapter.asignarCiclo(t.fecha);
      if (cInfo.ciclo !== cicloCode) return; // fuera del ciclo solicitado
      if (!cicloInfo) cicloInfo = cInfo;

      // Validacion: factura sin vendedor (campo vacio/ausente en la fuente).
      // No se descarta en silencio: se reporta y la fila se excluye del ciclo
      // porque no hay a quien atribuir la venta.
      if (!t.vendedor || String(t.vendedor).trim() === "") {
        advertencias.push({ tipo: "factura_sin_vendedor", detalle: "Folio " + t.folio + ": la fuente real no trae vendedor asociado -- fila excluida del ciclo" });
        return;
      }

      var vend = SICAdapter.normalizarVendedor(pais, t.vendedor);
      if (!vend.esComercial) {
        advertencias.push({ tipo: "vendedor_no_comercial_excluido", detalle: "Fila " + idx + ": vendedor '" + t.vendedor + "' excluido (no es personal comercial)" });
        return;
      }
      if (!vend.mapeado) {
        advertencias.push({ tipo: "vendedor_sin_mapeo", detalle: "Vendedor real '" + t.vendedor + "' no tiene clave normalizada conocida -- se genero una clave derivada (" + vend.clave + "). Confirmar con Comercial antes de usar en produccion." });
      }
      vendedoresVistos[vend.clave] = t.vendedor;

      // -- Validaciones de integridad (regla: no excluir en silencio) --
      var monto = Number(t.total);
      if (!isFinite(monto)) {
        advertencias.push({ tipo: "monto_invalido", detalle: "Folio " + t.folio + ": total no numerico (" + t.total + ")" });
        return;
      }
      if (monto < 0) {
        advertencias.push({ tipo: "monto_negativo", detalle: "Folio " + t.folio + ": monto negativo (" + monto + ") -- no deberia ocurrir segun fuente actual (ver DATA_SOURCE_AUDIT.md 'Notas de credito')" });
      }
      var claveFolio = pais + "-" + t.folio + "-" + idx;
      if (foliosVistos[t.folio] && foliosVistos[t.folio] !== idx) {
        advertencias.push({ tipo: "posible_factura_duplicada", detalle: "Folio " + t.folio + " aparece mas de una vez en el ciclo (puede ser normal si son lineas distintas de la misma factura)" });
      }
      foliosVistos[t.folio] = idx;

      // Validacion: moneda inconsistente. Ninguna fuente real trae un campo
      // "moneda" por transaccion (se asume CLP para todo TX_CL y USD para
      // todo TX_PE, a nivel de archivo -- ver DATA_SOURCE_AUDIT.md seccion
      // "campos faltantes"). Como no hay campo que contradecir directamente,
      // se aplica una heuristica de rango de precio unitario para detectar
      // filas cuya magnitud no corresponde a la moneda asumida de su pais
      // (ej. un pv de 12 en Chile, propio de una escala USD, o un pv de
      // 25000 en Peru, propio de una escala CLP). Esto NO corrige el dato,
      // solo lo expone para revision manual.
      var pvNum = Number(t.pv);
      if (isFinite(pvNum) && pvNum > 0) {
        if (pais === "CL" && pvNum < 50) {
          advertencias.push({ tipo: "moneda_inconsistente", detalle: "Folio " + t.folio + ": precio unitario (" + pvNum + ") tiene una escala tipica de USD, no de CLP -- revisar moneda de origen (" + monedaEsperada + " asumido)" });
        }
        if (pais === "PE" && pvNum > 1000) {
          advertencias.push({ tipo: "moneda_inconsistente", detalle: "Folio " + t.folio + ": precio unitario (" + pvNum + ") tiene una escala tipica de CLP, no de USD -- revisar moneda de origen (" + monedaEsperada + " asumido)" });
        }
      }

      var tipoClienteSupuesto = pais === "PE" ? "Distribuidor" : "Distribuidor";
      if (pais === "PE") {
        advertencias.push({ tipo: "tipo_cliente_no_disponible", detalle: "Peru: TX_PE no distingue Distribuidor/Cliente Final -- se asume 'Distribuidor' por defecto para la factura " + t.folio + " (ver DATA_SOURCE_AUDIT.md seccion 2)" });
      }

      ventas.push({
        factura: "REAL-" + pais + "-" + t.folio,
        fecha_factura: t.fecha,
        vendedor_id: vend.clave,
        cliente_nombre: t.cliente,
        tipo_cliente: tipoClienteSupuesto,
        producto: t.producto,
        formato: t.formato,
        cantidad: t.qty || null,
        precio_venta_unitario: t.pv,
        precio_piso_unitario: t.pp,
        piso_situacion: t.elegible ? (t.cumple ? "cumple" : "no_evaluada_autorizacion") : "no_evaluable",
        venta_neta: monto,
        _real: true,
        _folio_original: t.folio,
        _documento: t.doc || null
      });
    });

    if (fechasInvalidas > 0) {
      advertencias.push({ tipo: "fecha_invalida", detalle: fechasInvalidas + " transaccion(es) real(es) de " + pais + " con fecha ausente o invalida (ej. NaN) fueron excluidas de este ciclo -- ver DATA_SOURCE_AUDIT.md seccion 3.2 (bug de fecha conocido en el pipeline de Peru)" });
    }

    if (!cicloInfo) {
      cicloInfo = SICAdapter.asignarCiclo(cicloCode + "-15");
      advertencias.push({ tipo: "ciclo_sin_transacciones", detalle: "Ningun registro real cae en el ciclo " + cicloCode + " para " + pais });
    }
    cicloInfo.estado = "cerrado"; // todo ciclo real reconstruido de datos historicos se trata como cerrado
    cicloInfo.policy_version = paramsPolitica.version_politica;
    cicloInfo.fecha_datos = cicloInfo.cierre;
    cicloInfo.origen = "real";

    // -- Cobranza: BRECHA CONOCIDA -- no existe fecha de cobro real en
    // ninguna fuente conectada (ver DATA_SOURCE_AUDIT.md seccion 3.1). No se
    // inventa: se deja sin cobranzas, por lo que toda venta real queda en
    // estado "potencial" hasta que exista una fuente real de pagos.
    var cobranzas = [];
    advertencias.push({
      tipo: "cobranza_no_disponible",
      detalle: "No existe ninguna fuente conectada con fecha de cobro real por factura. La comision LIBERADA de este ciclo real sera 0 para todas las facturas -- solo la comision POTENCIAL (sobre venta facturada) es representativa. Ver DATA_SOURCE_AUDIT.md seccion 3.1."
    });
    // Validaciones "cobro sin factura" y "cobro superior al facturado" quedan
    // implementadas aqui mismo (no en un modulo aparte) para que se activen
    // automaticamente el dia que exista una fuente real de cobranza -- hoy
    // son un no-op porque `cobranzas` siempre esta vacio (brecha 3.1).
    SICAdapter._validarCobranzas(cobranzas, ventas, advertencias);

    // -- Presupuesto: prorrateo del presupuesto mensual/anual real al ciclo 26-25 --
    var presupuestos = [];
    var vendedoresSinPresupuesto = [];
    Object.keys(vendedoresVistos).forEach(function (clave) {
      var monto = SICAdapter._presupuestoDelCiclo(pais, clave, cicloCode, fuentes.presupuesto);
      if (monto === null) {
        vendedoresSinPresupuesto.push(clave);
        advertencias.push({ tipo: "vendedor_sin_presupuesto", detalle: "Vendedor '" + clave + "' (" + vendedoresVistos[clave] + ") tiene ventas reales en este ciclo pero no se encontro presupuesto real asociado" });
        monto = 0;
      }
      presupuestos.push({ vendedor_id: clave, ciclo: cicloCode, presupuesto: monto });
    });

    // -- IEC real del ciclo: recalculado directamente desde TX (SP/Elegible),
    // exactamente la misma formula que docs/AVBOARD_BUSINESS_RULES.md y que
    // ya usa SIC.factorIEC (misma tabla de tramos 20/70/80/90/105%). --
    var iec = [];
    Object.keys(vendedoresVistos).forEach(function (clave) {
      var sp = 0, elegible = 0, bajoPiso = 0, noEvaluable = 0;
      ventas.forEach(function (v) {
        if (v.vendedor_id !== clave) return;
        if (v.piso_situacion === "no_evaluable") { noEvaluable += v.venta_neta; return; }
        elegible += v.venta_neta;
        if (v.piso_situacion === "cumple") sp += v.venta_neta; else bajoPiso += v.venta_neta;
      });
      var iecPct = elegible > 0 ? (sp / elegible * 100) : 0;
      if (elegible === 0) {
        advertencias.push({ tipo: "vendedor_sin_iec", detalle: "Vendedor '" + clave + "' no tiene ventas elegibles (con precio piso) en este ciclo -- IEC no calculable, se usa 0%" });
      }
      var campoSobre = pais === "CL" ? "ventas_sobre_piso_clp" : "ventas_sobre_piso_usd";
      var campoBajo = pais === "CL" ? "ventas_bajo_piso_clp" : "ventas_bajo_piso_usd";
      var campoNoEval = pais === "CL" ? "ventas_no_evaluables_clp" : "ventas_no_evaluables_usd";
      var registro = { vendedor_id: clave, ciclo: cicloCode, iec_pct: Math.round(iecPct * 100) / 100 };
      registro[campoSobre] = sp;
      registro[campoBajo] = bajoPiso;
      registro[campoNoEval] = noEvaluable;
      iec.push(registro);
    });

    // -- Vendedores del ciclo (solo los que aparecen con ventas reales) --
    var vendedores = Object.keys(vendedoresVistos).map(function (clave) {
      return { id: clave, nombre: vendedoresVistos[clave], cargo: "No disponible en fuente real (ver DATA_SOURCE_AUDIT.md)" };
    });

    return {
      pais: pais,
      params: paramsPolitica,
      vendedores: vendedores,
      ventas: ventas,
      cobranzas: cobranzas,
      notas_credito: [],
      presupuestos: presupuestos,
      iec: iec,
      ciclo_info: cicloInfo,
      advertencias: advertencias
    };
  };

  // Validaciones sobre cobranza vs. facturacion: "cobro sin factura" (un pago
  // que no referencia ninguna factura real del ciclo) y "cobro superior al
  // facturado" (un pago mayor al monto neto de su factura). Recibe la lista
  // real de cobranzas (hoy siempre [], ver brecha 3.1) y las ventas ya
  // construidas del ciclo, para no depender de otro estado externo.
  SICAdapter._validarCobranzas = function (cobranzas, ventas, advertencias) {
    if (!cobranzas || !cobranzas.length) return;
    var facturaPorId = {};
    ventas.forEach(function (v) { facturaPorId[v.factura] = v; });
    cobranzas.forEach(function (c) {
      var factura = facturaPorId[c.factura];
      if (!factura) {
        advertencias.push({ tipo: "cobro_sin_factura", detalle: "Cobro registrado para '" + c.factura + "' no corresponde a ninguna factura real de este ciclo" });
        return;
      }
      if (Number(c.monto) > Number(factura.venta_neta)) {
        advertencias.push({ tipo: "cobro_superior_al_facturado", detalle: "Cobro de " + c.monto + " excede el monto facturado (" + factura.venta_neta + ") de '" + c.factura + "'" });
      }
    });
  };

  SICAdapter._presupuestoDelCiclo = function (pais, vendedorClave, cicloCode, presupuestoReal) {
    var prop = SICAdapter._proporcionMeses(cicloCode);
    if (pais === "CL") {
      var serie = presupuestoReal.CL.rtc_mensual_ppto[vendedorClave];
      if (!serie) return null;
      var pptoAnterior = serie[prop.mesAnteriorIdx] || 0;
      var pptoActual = serie[prop.mesActualIdx] || 0;
      return Math.round(pptoAnterior * prop.pctAnterior + pptoActual * prop.pctActual);
    }
    // Peru: solo hay presupuesto ANUAL real -- prorrateo grueso (anual / 12),
    // marcado como aproximacion mayor que la de Chile.
    var anual = presupuestoReal.PE.rtc_ppto_anual[vendedorClave];
    if (anual === undefined) return null;
    return Math.round((anual / 12) * 100) / 100;
  };

  // ---------------------------------------------------------------------
  // G. Reporte de validaciones agrupado (para mostrar advertencias visibles,
  // nunca ocultarlas -- requisito explicito del CHANGE REQUEST v1.5).
  // ---------------------------------------------------------------------
  SICAdapter.resumirAdvertencias = function (advertencias) {
    var porTipo = {};
    advertencias.forEach(function (a) {
      porTipo[a.tipo] = (porTipo[a.tipo] || 0) + 1;
    });
    return porTipo;
  };

  global.SICAdapter = SICAdapter;
})(typeof window !== "undefined" ? window : globalThis);
