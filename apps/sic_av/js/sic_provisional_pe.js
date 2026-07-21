/**
 * SIC-AV — Capa de importación PROVISIONAL de cobranza real (Perú)
 * =========================================================================================
 * PRIORIDAD PRESENTACIÓN (2026-07-13): habilitar el cálculo SIC en Perú con una fuente
 * PROVISIONAL de fecha de pago por factura, mientras Finanzas entrega el reporte oficial
 * de cobranza (esperado mañana). Este archivo es una capa de importación SEPARADA de
 * `js/sic_data_adapter.js` (que no se modifica) y de `sic_core.js` (que tampoco se
 * modifica) -- solo AGREGA registros de cobranza al `ctx.cobranzas` que el motor ya sabe
 * consumir sin cambios.
 *
 * Fuente: `data/cobranza_pe_provisional_2026.json`, generado UNA VEZ (fuera del navegador,
 * con Node/Python) a partir de "AGROVECA PERU -  COMISIONES TRABAJADORES 2026.xlsx"
 * (hoja "VENTAS ACUMULADAS 2026", única hoja del archivo con columna "FECHA DE PAGO").
 * Ver `PERU_PROVISIONAL_COLLECTION_AUDIT.md` para el detalle completo de la auditoría de
 * esa fuente (que columnas se usaron, cuales no, y por que).
 *
 * REGLA EXPLÍCITA (CHANGE REQUEST): de ese Excel solo se importan datos operativos
 * (factura/folio, fecha de pago, monto) -- NUNCA su fórmula histórica de comisión
 * (columnas PORCENTAJE / COMISION POR PAGAR de ese archivo). El cálculo de comisión
 * sigue siendo responsabilidad exclusiva de `sic_core.js` y sus reglas SIC vigentes.
 *
 * Esta fuente es PROVISIONAL por diseño: no reemplaza ni modifica `js/sic_data_adapter.js`,
 * no toca los archivos fuente del Board, no crea una base de datos paralela de ventas
 * (las ventas siguen viniendo 100% de `SICAdapter.construirCicloReal`, vía TX_PE) -- esta
 * capa únicamente ATA (por número de folio) una fecha y un monto de pago real a una venta
 * que el adaptador de datos reales ya construyó.
 */
(function (global) {
  "use strict";

  var SICProvisionalPE = {};

  SICProvisionalPE.RUTA = "data/cobranza_pe_provisional_2026.json";

  SICProvisionalPE.cargar = function () {
    return fetch(SICProvisionalPE.RUTA).then(function (r) {
      if (!r.ok) throw new Error("No se pudo leer " + SICProvisionalPE.RUTA);
      return r.json();
    });
  };

  // Ata los registros de cobranza provisional al cicloReal YA CONSTRUIDO por
  // SICAdapter.construirCicloReal (mutando cicloReal.cobranzas y
  // cicloReal.advertencias in place). El match es por numero de folio
  // (venta._folio_original, el mismo folio real de TX_CL/TX_PE que ya usa el
  // adaptador) -- nunca por nombre de vendedor ni por monto, para no depender
  // de que la ortografia del vendedor coincida entre fuentes.
  //
  // Un registro cuyo folio no aparece entre las ventas de ESTE ciclo
  // simplemente no se aplica aqui (no es un error): puede pertenecer a otro
  // ciclo (se aplicara cuando se consulte ese ciclo), o a un folio que TX_PE
  // no tiene registrado con una fecha de venta valida dentro del rango de
  // politica vigente (ver auditoria, seccion de fechas fuera de rango).
  SICProvisionalPE.aplicarCobranza = function (cicloReal, registros) {
    var resumen = { aplicados: 0, monto_aplicado: 0, no_encontrados_en_este_ciclo: 0, total_facturas_ciclo: cicloReal.ventas.length };
    if (!registros || !registros.length) return resumen;

    var ventaPorFolio = {};
    cicloReal.ventas.forEach(function (v) { ventaPorFolio[String(v._folio_original)] = v; });

    registros.forEach(function (reg) {
      var venta = ventaPorFolio[String(reg.folio)];
      if (!venta) { resumen.no_encontrados_en_este_ciclo++; return; }
      cicloReal.cobranzas.push({ factura: venta.factura, fecha_pago: reg.fecha_pago, monto: reg.monto });
      resumen.aplicados++;
      resumen.monto_aplicado += reg.monto;
    });

    if (resumen.aplicados === 0) return resumen;

    // Orden cronologico ascendente: sic_core.js usa el ULTIMO pago del arreglo
    // como resumen a nivel de factura (dias_al_cobro/tasa_cartera) -- con un
    // solo pago por factura en esta fuente (sin pagos parciales detectados,
    // ver auditoria) esto no cambia el resultado, pero se ordena de todas
    // formas para dejar el comportamiento correcto si a futuro hay >1 pago
    // por factura.
    cicloReal.cobranzas.sort(function (a, b) {
      return a.fecha_pago < b.fecha_pago ? -1 : (a.fecha_pago > b.fecha_pago ? 1 : 0);
    });

    // La advertencia generica "cobranza_no_disponible" que puso el adaptador
    // (sin modificar ese archivo) ya no describe con precision este ciclo,
    // porque SI hay cobranza real -- aunque sea provisional y parcial. Se
    // reemplaza aqui mismo (en esta capa separada) por una advertencia mas
    // precisa, sin tocar js/sic_data_adapter.js.
    cicloReal.advertencias = cicloReal.advertencias.filter(function (a) { return a.tipo !== "cobranza_no_disponible"; });
    var cobertura = resumen.total_facturas_ciclo > 0 ? Math.round((resumen.aplicados / resumen.total_facturas_ciclo) * 1000) / 10 : 0;
    cicloReal.advertencias.push({
      tipo: "cobranza_provisional_aplicada",
      detalle: resumen.aplicados + " de " + resumen.total_facturas_ciclo + " factura(s) de este ciclo (" + cobertura + "%) tienen cobro real PROVISIONAL aplicado, desde el archivo historico de comisiones Peru 2026 -- pendiente de conciliacion con el reporte oficial de Finanzas. El resto permanece sin fecha de cobro real conocida."
    });

    return resumen;
  };

  global.SICProvisionalPE = SICProvisionalPE;
})(typeof window !== "undefined" ? window : globalThis);
