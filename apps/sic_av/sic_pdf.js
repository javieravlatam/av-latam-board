/**
 * SIC-AV — Generador de Informe Ejecutivo (Fase 4)
 * =============================================================
 * Patron reutilizado de apps/cotizador/cotizador_core.js (PDF.imprimir):
 * abre una ventana nueva con una vista imprimible y llama a window.print(),
 * permitiendo "Guardar como PDF" desde el dialogo nativo del navegador.
 * 100% local, sin librerias externas ni CDN -- documentado en README.md.
 *
 * Titulo del informe: INFORME EJECUTIVO DE GESTION COMERCIAL.
 */
(function (global) {
  "use strict";

  function fmt(pais, n) {
    var moneda = pais === "CL" ? "CLP" : "USD";
    var val = Math.round((n || 0) * (pais === "CL" ? 1 : 100)) / (pais === "CL" ? 1 : 100);
    return moneda + " " + val.toLocaleString("es-CL", { minimumFractionDigits: pais === "CL" ? 0 : 2, maximumFractionDigits: pais === "CL" ? 0 : 2 });
  }
  function pct(n) { return (Math.round((n || 0) * 10) / 10) + "%"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[<>&]/g, function (c) { return { "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]; }); }
  var MESES_PDF = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  function nombreCicloPdf(codigoCiclo) {
    var partes = String(codigoCiclo || "").split("-");
    var mes = MESES_PDF[parseInt(partes[1], 10) - 1] || codigoCiclo;
    return mes + " " + partes[0];
  }
  function fechaDDMMYYYYPdf(iso) {
    if (!iso) return "—";
    var p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function codigoInforme(pais, vendedorId, ciclo) {
    var ts = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 12);
    return "SIC-AV-" + pais + "-" + vendedorId + "-" + ciclo + "-" + ts;
  }

  function filasFactura(pais, detalle) {
    return detalle.map(function (f) {
      return "<tr>" +
        "<td>" + esc(f.factura) + "</td>" +
        "<td>" + esc(f.fecha_factura) + "</td>" +
        "<td>" + esc(f.cliente_nombre) + "</td>" +
        "<td>" + esc(f.tipo_cliente) + "</td>" +
        "<td>" + esc(f.producto) + " (" + esc(f.formato) + ")</td>" +
        "<td class='num'>" + fmt(pais, f.venta_neta) + "</td>" +
        "<td class='num'>" + fmt(pais, f.monto_cobrado) + "</td>" +
        "<td class='num'>" + fmt(pais, f.saldo_pendiente) + "</td>" +
        "<td class='num'>" + (f.dias_al_cobro == null ? "—" : f.dias_al_cobro) + "</td>" +
        "<td class='num'>" + (f.tasa_cartera == null ? "—" : f.tasa_cartera + "%") + "</td>" +
        "<td>" + esc(f.piso_situacion) + "</td>" +
        "<td class='num'>" + fmt(pais, f.comision_liberada) + "</td>" +
        "<td><span class='estado estado-" + esc(f.estado) + "'>" + esc(f.estado) + "</span></td>" +
        "</tr>";
    }).join("");
  }

  function construirHtml(opts) {
    var pais = opts.pais, vendedor = opts.vendedor, r = opts.resultado, diferido = opts.diferido, acciones = opts.acciones, params = opts.params;
    var codigo = codigoInforme(pais, vendedor.id, r.ciclo);
    var fechaGeneracion = new Date().toISOString().slice(0, 19).replace("T", " ");

    var oportunidades = acciones.map(function (a) {
      return "<li>" + esc(a.descripcion) + "</li>";
    }).join("");

    return "" +
      "<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'>" +
      "<title>Informe Ejecutivo de Gestion Comercial — " + esc(vendedor.nombre) + "</title>" +
      "<style>" + estilosPdf() + "</style></head><body>" +

      // PORTADA
      "<section class='portada'>" +
      "<div class='logo-slot'>AV LATAM</div>" +
      "<h1>INFORME EJECUTIVO DE GESTION COMERCIAL</h1>" +
      "<p class='sistema'>Sistema Integral de Incentivos Comerciales — SIC-AV</p>" +
      "<table class='tabla-portada'>" +
      "<tr><td>Pais</td><td>" + (pais === "CL" ? "Chile" : "Peru") + "</td></tr>" +
      "<tr><td>Comercial</td><td>" + esc(vendedor.nombre) + "</td></tr>" +
      "<tr><td>Cargo</td><td>" + esc(vendedor.cargo) + "</td></tr>" +
      "<tr><td>Período de cobranza</td><td>" + fechaDDMMYYYYPdf(r.ciclo_info.inicio) + " a " + fechaDDMMYYYYPdf(r.ciclo_info.cierre) + "</td></tr>" +
      "<tr><td>Mes de desempeño aplicado</td><td>" + esc(nombreCicloPdf(r.mes_desempeno)) + "</td></tr>" +
      "<tr><td>Estado del período</td><td>" + esc(r.ciclo_info.estado === "vigente" ? "Vigente" : (r.ciclo_info.estado === "cerrado" ? "Cerrado" : r.ciclo_info.estado)) + "</td></tr>" +
      "<tr><td>Version de politica aplicada a este ciclo</td><td>" + esc(r.ciclo_info.policy_version || params.version_politica) + "</td></tr>" +
      "<tr><td>Fecha de datos del ciclo</td><td>" + fechaDDMMYYYYPdf(r.ciclo_info.fecha_datos) + "</td></tr>" +
      "<tr><td>Fecha de generacion del informe</td><td>" + fechaGeneracion + "</td></tr>" +
      "<tr><td>Codigo unico del informe</td><td>" + codigo + "</td></tr>" +
      "</table>" +
      "<div class='banner-demo'>DATOS REALES AV LATAM BOARD — Cobranza integrada: 274 facturas PAGADA con fecha y monto verificados. Comision diferida trimestral pendiente de implementacion. Sujeto a aprobacion gerencial antes de liquidacion oficial.</div>" +
      "</section>" +

      // RESUMEN EJECUTIVO -- CHANGE REQUEST v1.6: indicadores del MES DE
      // DESEMPEÑO (presupuesto, venta neta, cumplimiento, IEC, excedente,
      // bono) y del PERIODO DE COBRANZA (venta facturada, venta cobrada,
      // comisiones) se muestran por separado, nunca mezclados.
      "<section class='bloque'>" +
      "<h2>Resumen Ejecutivo — Indicadores del Mes de Desempeño (" + esc(nombreCicloPdf(r.mes_desempeno)) + ")</h2>" +
      "<table class='tabla-resumen'>" +
      "<tr><td>Presupuesto del mes de desempeño</td><td class='num'>" + (r.presupuesto_mes === null ? "Pendiente de carga" : fmt(pais, r.presupuesto_mes)) + "</td>" +
      "<td>Venta neta del mes de desempeño</td><td class='num'>" + fmt(pais, r.venta_neta_mes) + "</td></tr>" +
      "<tr><td>Cumplimiento del mes de desempeño</td><td class='num'>" + pct(r.cumplimiento_pct) + "</td>" +
      "<td>Factor de Presupuesto</td><td class='num'>" + pct(r.factor_presupuesto) + "</td></tr>" +
      // AUDITORIA SIC-AV 2026-07-30 OBJETIVO 1 — SSOT: verificar iec_disponible
      // antes de mostrar valores. Cuando iec_disponible===false no hay ventas
      // elegibles en el mes de desempeno y el IEC no fue calculado; mostrar
      // "Pendiente de carga" exactamente igual que la pantalla principal.
      "<tr><td>IEC del mes de desempeño</td><td class='num'>" + (r.iec_disponible === false ? "Pendiente de carga" : pct(r.iec_pct)) + "</td>" +
      "<td>Factor IEC</td><td class='num'>" + (r.iec_disponible === false ? "Pendiente de carga" : pct(r.factor_iec)) + "</td></tr>" +
      "<tr><td>Excedente del mes de desempeño</td><td class='num'>" + fmt(pais, r.excedente_mes) + "</td>" +
      "<td>Bono por excedente</td><td class='num'>" + fmt(pais, r.bono_excedente) + "</td></tr>" +
      "</table></section>" +

      "<section class='bloque'>" +
      "<h2>Resumen Ejecutivo — Indicadores del Período de Cobranza</h2>" +
      "<table class='tabla-resumen'>" +
      "<tr><td>Comision potencial</td><td class='num'>" + fmt(pais, r.comision_potencial) + "</td>" +
      "<td>Comision liberada</td><td class='num'>" + fmt(pais, r.comision_liberada) + "</td></tr>" +
      "<tr><td>Comision pendiente</td><td class='num'>" + fmt(pais, r.comision_pendiente) + "</td>" +
      "<td>Comision validada</td><td class='num'>" + fmt(pais, r.comision_validada) + "</td></tr>" +
      "<tr><td>Comision pagada</td><td class='num'>" + fmt(pais, r.comision_pagada) + "</td>" +
      "<td>Comision diferida (trimestre)</td><td class='num'>" + fmt(pais, diferido.diferido_acumulado) + "</td></tr>" +
      "<tr><td>Venta facturada (período)</td><td class='num'>" + fmt(pais, r.venta_facturada_periodo) + "</td>" +
      "<td>Venta cobrada (período)</td><td class='num'>" + fmt(pais, r.venta_cobrada) + "</td></tr>" +
      "</table></section>" +

      // COMO SE CONSTRUYO
      "<section class='bloque'>" +
      "<h2>Como se Construyo</h2>" +
      "<table class='tabla-resumen'>" +
      "<tr><td>Comision base (total del ciclo)</td><td class='num'>" + fmt(pais, r.comision_base_total) + "</td></tr>" +
      "<tr><td>Factor de Cumplimiento de Presupuesto</td><td class='num'>" + pct(r.factor_presupuesto) + "</td></tr>" +
      "<tr><td>Factor IEC</td><td class='num'>" + (r.iec_disponible === false ? "Pendiente de carga" : pct(r.factor_iec)) + "</td></tr>" +
      "<tr><td>Comision generada del periodo</td><td class='num'>" + fmt(pais, r.comision_generada) + "</td></tr>" +
      "<tr><td>Bono por Excedente</td><td class='num'>+" + fmt(pais, r.bono_excedente) + "</td></tr>" +
      "<tr><td>Notas de Credito del periodo</td><td class='num'>-" + fmt(pais, r.ajustes_nc) + "</td></tr>" +
      // POLITICA v1.7: saldo anterior solo se muestra si es mayor que cero
      (r.saldo_ajustes_anterior > 0 ? "<tr><td>Saldo anterior por compensar</td><td class='num'>-" + fmt(pais, r.saldo_ajustes_anterior) + "</td></tr>" : "") +
      "<tr class='subtotal'><td>Resultado economico del ciclo</td><td class='num'>" + fmt(pais, r.resultado_economico) + "</td></tr>" +
      "<tr class='total'><td>Comision pagable (nunca negativa)</td><td class='num'>" + fmt(pais, r.comision_pagable) + "</td></tr>" +
      (r.saldo_ajustes_por_compensar > 0 ? "<tr class='alerta'><td>Nuevo saldo por compensar en ciclos futuros</td><td class='num'>" + fmt(pais, r.saldo_ajustes_por_compensar) + "</td></tr>" : "") +
      "</table>" +
      "<p class='nota-formula'>Formula (POLITICA SIC-AV v1.7): Cobros efectivos del período 26-25 &times; Tasa segun edad de cartera &times; Factor Presupuesto &times; Factor IEC + Bono Excedente (solo si Factor Presupuesto=100%) - NC del periodo - Saldo anterior = Resultado Economico. Comision Pagable = max(0, Resultado Economico). Los ajustes NC no se pierden: si el resultado es negativo, el saldo queda pendiente para el siguiente ciclo con comision positiva. Reglas: (A) fPpto=0 implica comision_generada=0; (B) fPpto=0 implica bono=0; (C) comision_pagable siempre >= 0; (D) NC nunca se eliminan; (E) saldo anterior se aplica antes de calcular comision_pagable.</p>" +
      "</section>" +

      // DETALLE POR FACTURA
      "<section class='bloque salto-pagina'>" +
      "<h2>Detalle por Factura</h2>" +
      "<table class='tabla-facturas'>" +
      "<thead><tr><th>Factura</th><th>Fecha</th><th>Cliente</th><th>Tipo</th><th>Producto</th>" +
      "<th class='num'>Venta neta</th><th class='num'>Cobrado</th><th class='num'>Saldo</th>" +
      "<th class='num'>Dias</th><th class='num'>Tasa</th><th>Piso</th><th class='num'>Comision</th><th>Estado</th></tr></thead>" +
      "<tbody>" + filasFactura(pais, r.detalle_facturas) + "</tbody>" +
      "</table></section>" +

      // COMISION DIFERIDA TRIMESTRAL
      "<section class='bloque'>" +
      "<h2>Comision Diferida Trimestral (" + esc(diferido.trimestre) + ")</h2>" +
      "<table class='tabla-resumen'>" +
      "<tr><td>Monto acumulado</td><td class='num'>" + fmt(pais, diferido.diferido_acumulado) + "</td></tr>" +
      "<tr><td>Cumplimiento trimestral</td><td class='num'>" + pct(diferido.cumplimiento_trimestral) + "</td></tr>" +
      "<tr><td>IEC trimestral</td><td class='num'>" + pct(diferido.iec_trimestral) + "</td></tr>" +
      "<tr><td>Porcentaje de liberacion</td><td class='num'>" + diferido.pct_liberacion_final + "%</td></tr>" +
      "<tr><td>Monto liberado</td><td class='num'>" + fmt(pais, diferido.monto_liberado) + "</td></tr>" +
      "<tr><td>Monto pendiente</td><td class='num'>" + fmt(pais, diferido.monto_pendiente) + "</td></tr>" +
      "</table>" +
      (diferido.motivos_no_cumplidos && diferido.motivos_no_cumplidos.length ?
        "<p class='nota-formula'>Condiciones no cumplidas: " + diferido.motivos_no_cumplidos.map(esc).join("; ") + "</p>" : "") +
      "</section>" +

      // OPORTUNIDADES DE MEJORA
      "<section class='bloque'>" +
      "<h2>Oportunidades de Mejora</h2>" +
      "<ul class='lista-oportunidades'>" + (oportunidades || "<li>Sin oportunidades adicionales identificadas para este ciclo.</li>") + "</ul>" +
      "<p class='nota-formula'>Estas cifras son estimaciones y proyecciones — no constituyen una promesa de pago.</p>" +
      "</section>" +

      // TRAZABILIDAD
      "<section class='bloque'>" +
      "<h2>Trazabilidad</h2>" +
      "<table class='tabla-resumen'>" +
      "<tr><td>Version de politica</td><td>" + esc(params.version_politica) + "</td></tr>" +
      "<tr><td>Modelo utilizado</td><td>Politica V1.4: Factor de Presupuesto por tramos fijos (0% / 80% / 100%) + Factor IEC por tramos fijos (20% / 70% / 80% / 90% / 105%). Sin interpolacion en ningun factor. El Factor de Precio Piso fue eliminado del calculo -- toda venta facturada entra al calculo normal; el precio piso solo impacta la comision de forma indirecta, a traves del Factor IEC.</td></tr>" +
      "<tr><td>Fecha de datos</td><td>" + fechaDDMMYYYYPdf(r.ciclo_info.fecha_datos) + " — Datos reales AV LATAM Board (cobranzas_cl_v2)</td></tr>" +
      "<tr><td>Fecha de calculo</td><td>" + fechaGeneracion + "</td></tr>" +
      "<tr><td>Fecha de generacion del informe</td><td>" + fechaGeneracion + "</td></tr>" +
      "<tr><td>Codigo unico</td><td>" + codigo + "</td></tr>" +
      "</table>" +
      "<p class='nota-legal'>Documento generado con datos reales del AV LATAM Board. La comision diferida trimestral es preliminar (pendiente de implementacion de logica multi-ciclo). Sujeto a aprobacion gerencial antes de constituir liquidacion oficial de remuneraciones.</p>" +
      "</section>" +

      "<script>window.onload = function(){ setTimeout(function(){ window.print(); }, 300); };<\/script>" +
      "</body></html>";
  }

  function estilosPdf() {
    return "" +
      "*{box-sizing:border-box;} body{font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#1b2027;margin:0;padding:24px 30px;font-size:12px;}" +
      "h1{font-size:20px;color:#0d3b66;margin:18px 0 4px;text-align:center;letter-spacing:0.02em;}" +
      "h2{font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:#4a7fb5;border-bottom:1px solid #e4e7eb;padding-bottom:6px;margin:0 0 12px;}" +
      ".logo-slot{width:120px;margin:0 auto;text-align:center;border:1.5px solid #0d3b66;color:#0d3b66;padding:10px;border-radius:8px;font-weight:700;font-size:12px;letter-spacing:0.06em;}" +
      ".portada{text-align:center;padding-bottom:18px;border-bottom:2px solid #0d3b66;margin-bottom:26px;}" +
      ".sistema{color:#5b6470;font-size:12.5px;margin:0 0 18px;}" +
      ".tabla-portada{margin:0 auto;border-collapse:collapse;font-size:12px;}" +
      ".tabla-portada td{padding:5px 14px;text-align:left;border-bottom:1px solid #eee;}" +
      ".tabla-portada td:first-child{color:#5b6470;font-weight:600;}" +
      ".banner-demo{margin-top:16px;background:#fff8ec;border:1px solid #f0d9a8;color:#a8681a;padding:8px 14px;border-radius:6px;font-size:10.5px;font-weight:700;display:inline-block;}" +
      ".bloque{margin-bottom:26px;page-break-inside:avoid;}" +
      ".salto-pagina{page-break-before:auto;}" +
      ".tabla-resumen{width:100%;border-collapse:collapse;font-size:11.5px;}" +
      ".tabla-resumen td{padding:6px 10px;border-bottom:1px solid #eee;}" +
      ".tabla-resumen td.num{text-align:right;font-variant-numeric:tabular-nums;font-weight:600;}" +
      ".tabla-resumen tr.total td{border-top:2px solid #0d3b66;font-weight:700;color:#0d3b66;padding-top:10px;}" +
      ".nota-formula{font-size:10px;color:#5b6470;margin-top:8px;line-height:1.5;}" +
      ".nota-legal{font-size:10.5px;color:#a83232;font-weight:600;margin-top:10px;}" +
      "table.tabla-facturas{width:100%;border-collapse:collapse;font-size:9.5px;}" +
      "table.tabla-facturas thead{display:table-header-group;}" +
      "table.tabla-facturas tr{page-break-inside:avoid;}" +
      "table.tabla-facturas th{background:#f7f8fa;text-transform:uppercase;letter-spacing:0.02em;color:#5b6470;padding:6px 6px;text-align:left;border-bottom:1px solid #ccc;font-size:8.5px;}" +
      "table.tabla-facturas td{padding:5px 6px;border-bottom:1px solid #eee;}" +
      "table.tabla-facturas td.num{text-align:right;font-variant-numeric:tabular-nums;}" +
      ".estado{padding:2px 6px;border-radius:10px;font-size:8px;font-weight:700;text-transform:uppercase;}" +
      ".estado-liberada{background:#e7f6ee;color:#1e7d4a;} .estado-potencial{background:#eef3f8;color:#4a7fb5;}" +
      ".estado-pendiente{background:#fff4e0;color:#b8791a;} .estado-retenida{background:#fbe9e9;color:#a83232;} .estado-anulada{background:#eee;color:#777;}" +
      ".lista-oportunidades{margin:0;padding-left:18px;font-size:11.5px;line-height:1.8;}" +
      "@page{size:A4;margin:14mm 12mm;}" +
      "@media print{ body{padding:0;} }";
  }

  // -----------------------------------------------------------------------
  // Estilos exclusivos del PDF de Politica Oficial (Format JAVIER)
  // -----------------------------------------------------------------------
  function estilosPoliticaPdf() {
    return [
      "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}",
      "body{font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#1b2027;background:#F4F6F9;font-size:11px;}",
      ".portada{background:#1B4F8A;color:#fff;padding:42px 32px;text-align:center;page-break-after:always;-webkit-print-color-adjust:exact;print-color-adjust:exact;display:flex;flex-direction:column;align-items:center;min-height:100vh;justify-content:center;}",
      ".p-logo{display:inline-block;border:2px solid rgba(255,255,255,.6);color:#fff;padding:9px 18px;border-radius:8px;font-weight:800;font-size:12px;letter-spacing:.1em;margin-bottom:26px;}",
      ".portada h1{font-size:22px;font-weight:900;letter-spacing:.05em;margin-bottom:8px;}",
      ".portada h2{font-size:12px;font-weight:400;opacity:.85;margin-bottom:28px;}",
      ".p-badge{display:inline-block;background:#27AE60;color:#fff;padding:5px 14px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.04em;margin-bottom:22px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}",
      ".p-tabla{border-collapse:collapse;margin:0 auto;}",
      ".p-tabla td{padding:7px 16px;text-align:left;border-bottom:1px solid rgba(255,255,255,.15);font-size:10.5px;}",
      ".p-tabla td:first-child{color:rgba(255,255,255,.75);font-weight:600;padding-right:20px;white-space:nowrap;}",
      "section{background:#fff;padding:18px 24px;margin-bottom:0;border-top:3px solid #1B4F8A;page-break-inside:avoid;}",
      "h2.sec{font-size:12.5px;color:#1B4F8A;font-weight:800;border-bottom:2px solid #1B4F8A;padding-bottom:7px;margin-bottom:14px;letter-spacing:.04em;text-transform:uppercase;}",
      "h3.sub{font-size:11px;color:#1B4F8A;font-weight:700;margin:14px 0 7px;border-left:3px solid #1B4F8A;padding-left:8px;}",
      "p.txt{font-size:10.5px;color:#4A5568;line-height:1.6;margin-bottom:8px;}",
      "code{background:#EBF2FB;color:#1B4F8A;padding:1px 5px;border-radius:3px;font-size:10px;font-family:monospace;}",
      ".flow-diagram{padding:12px 0;}",
      ".flow-row{display:flex;align-items:center;gap:6px;flex-wrap:nowrap;margin-bottom:8px;}",
      ".fbox{background:#EBF2FB;border:1.5px solid #1B4F8A;color:#1B4F8A;border-radius:6px;padding:8px 10px;font-size:9.5px;font-weight:700;text-align:center;line-height:1.4;min-width:68px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}",
      ".fbox small{font-weight:400;font-size:8px;display:block;margin-top:2px;}",
      ".fbox.grn{background:#E7F6EE;border-color:#1E7D4A;color:#1E7D4A;}",
      ".fbox.amb{background:#FFF4E0;border-color:#B8791A;color:#B8791A;}",
      ".fbox.res{background:#1B4F8A;color:#fff;border-color:#0d3060;font-size:10px;}",
      ".fop{font-size:16px;font-weight:900;color:#9BA5B0;flex-shrink:0;}",
      "table.pol{width:100%;border-collapse:collapse;font-size:10.5px;margin:8px 0;}",
      "table.pol thead tr{background:#1B4F8A;-webkit-print-color-adjust:exact;print-color-adjust:exact;}",
      "table.pol th{padding:7px 10px;text-align:left;color:#fff;font-size:9.5px;letter-spacing:.04em;font-weight:700;}",
      "table.pol th.tc{text-align:right;}",
      "table.pol td{padding:6px 10px;border-bottom:1px solid #E8ECF0;}",
      "table.pol td.tc{text-align:right;font-weight:700;color:#1B4F8A;}",
      ".ej{background:#F4F6F9;border:1px solid #D1D9E6;border-radius:8px;padding:12px 16px;margin:8px 0;}",
      ".ej h4{font-size:10px;font-weight:800;color:#1B4F8A;margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em;}",
      ".ej-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #E0E6EF;font-size:10.5px;}",
      ".ej-row:last-child{border-bottom:none;}",
      ".ej-lbl{color:#5B6470;}",
      ".ej-val{font-weight:700;color:#1b2027;}",
      ".ej-row.tot{border-top:2px solid #1B4F8A;margin-top:4px;padding-top:8px;}",
      ".ej-row.tot .ej-lbl{font-weight:700;color:#1B4F8A;}",
      ".ej-row.tot .ej-val{color:#1B4F8A;font-size:12px;}",
      ".faq-item{border-left:3px solid #1B4F8A;padding:9px 14px;margin-bottom:10px;background:#F7F9FC;border-radius:0 6px 6px 0;}",
      ".faq-q{font-weight:700;color:#1B4F8A;font-size:11px;margin-bottom:4px;}",
      ".faq-a{color:#4A5568;font-size:10.5px;line-height:1.5;}",
      ".gov-block{background:#FFF8EC;border:1px solid #F0D9A8;border-radius:8px;padding:12px 16px;margin-bottom:10px;}",
      ".gov-block h4{font-size:10.5px;font-weight:700;color:#B8791A;margin-bottom:5px;}",
      ".gov-block p{font-size:10.5px;color:#5B6470;line-height:1.5;}",
      ".legal{font-size:9px;color:#9BA5B0;margin-top:12px;line-height:1.4;border-top:1px solid #E8ECF0;padding-top:10px;}",
      "@page{size:A4;margin:13mm 11mm;}",
      "@media print{body{background:#fff;} section{page-break-inside:avoid;} }"
    ].join("");
  }

  // -----------------------------------------------------------------------
  // Informe "Politica y Factores" (CHANGE REQUEST SIC-AV v1.3)
  // -----------------------------------------------------------------------
  function tablaCarteraPaisActivoPdf(params) {
    return Array.isArray(params.tasa_cartera) ? params.tasa_cartera : params.tasa_cartera["Distribuidor"];
  }
  function textoTramoDiasPdf(tramo, idx, tabla) {
    var desde = idx === 0 ? 0 : tabla[idx - 1].max_dias + 1;
    if (tramo.max_dias === null) return "Mas de " + tabla[idx - 1].max_dias + " dias";
    if (desde === 0 && tramo.max_dias === 0) return "Contado";
    return desde + "-" + tramo.max_dias + " dias";
  }
  function filas2Col(items, fmtIzq, fmtDer) {
    return items.map(function (it) { return "<tr><td>" + fmtIzq(it) + "</td><td class='num'>" + fmtDer(it) + "</td></tr>"; }).join("");
  }

  function construirHtmlPolitica(opts) {
    var pais = opts.pais, ciclo = opts.ciclo, params = opts.params;
    var paisNombre = pais === "CL" ? "Chile" : "Perú";
    var moneda     = pais === "CL" ? "CLP" : "USD";

    var cicloInfo = params.ciclos.filter(function (c) { return c.ciclo === ciclo; })[0] ||
      params.ciclos.filter(function (c) { return c.ciclo === params.ciclo_vigente; })[0];
    var fechaGen = new Date().toISOString().slice(0, 19).replace("T", " ");

    // ─── Tasa cartera ──────────────────────────────────────────────────────
    var tablaC = Array.isArray(params.tasa_cartera)
      ? params.tasa_cartera
      : params.tasa_cartera["Distribuidor"];

    function tasaDias(dias) {
      for (var i = 0; i < tablaC.length; i++) {
        var desde = i === 0 ? 0 : tablaC[i - 1].max_dias + 1;
        var hasta = tablaC[i].max_dias;
        if (dias >= desde && (hasta === null || dias <= hasta)) return tablaC[i].tasa;
      }
      return tablaC[tablaC.length - 1].tasa;
    }

    function factorDe(tramos, minK, maxK, v) {
      for (var i = 0; i < tramos.length; i++) {
        if (v >= tramos[i][minK] && (tramos[i][maxK] === null || v <= tramos[i][maxK]))
          return tramos[i].factor;
      }
      return tramos[tramos.length - 1].factor;
    }

    // ─── IEC política ──────────────────────────────────────────────────────
    var iecPol    = params.iec_politica || {};
    var iecMinAut = iecPol.iec_min_autorizado_pct || 90;
    var iecDesv   = iecPol.desviacion_critica_max_item_pct || 25;
    var umbralCrit = 100 - iecDesv;

    // ─── Ejemplo integral ──────────────────────────────────────────────────
    // Inputs ilustrativos — todos los factores se computan desde params.
    var EJ_PPTO  = pais === "CL" ? 10000000 : 10000;
    var EJ_DIAS  = 15;   // cae en tramo 1-30 d.
    var EJ_CUMPL = 97;   // cae en tramo 90-99.99%
    var EJ_IEC   = 98;   // cae en tramo >=95%

    var ejTasa    = tasaDias(EJ_DIAS);
    var ejFPpto   = factorDe(params.factor_presupuesto_tramos, "min_cumpl", "max_cumpl", EJ_CUMPL);
    var ejFIEC    = factorDe(params.factor_iec_tramos, "min_iec", "max_iec", EJ_IEC);
    var ejCobrado = Math.round(EJ_PPTO * EJ_CUMPL / 100);
    var ejComBase = Math.round(ejCobrado * ejTasa / 100);
    var ejComGen  = Math.round(ejComBase * ejFPpto / 100 * ejFIEC / 100);
    var ejExced   = Math.max(0, ejCobrado - EJ_PPTO);
    var ejBono    = Math.round(ejExced * params.bono_excedente_pct / 100);
    var ejPagable = Math.max(0, ejComGen + ejBono);

    // Escenario B con sobrecumplimiento
    var EJ2_CUMPL  = 112;
    var ej2FPpto   = factorDe(params.factor_presupuesto_tramos, "min_cumpl", "max_cumpl", EJ2_CUMPL);
    var ej2Cobrado = Math.round(EJ_PPTO * EJ2_CUMPL / 100);
    var ej2ComBase = Math.round(ej2Cobrado * ejTasa / 100);
    var ej2ComGen  = Math.round(ej2ComBase * ej2FPpto / 100 * ejFIEC / 100);
    var ej2Exced   = Math.max(0, ej2Cobrado - EJ_PPTO);
    var ej2Bono    = Math.round(ej2Exced * params.bono_excedente_pct / 100);
    var ej2Pagable = ej2ComGen + ej2Bono;

    // ─── Helpers ──────────────────────────────────────────────────────────
    function fm(n)  { return moneda + " " + Math.round(n).toLocaleString("es-CL"); }
    function fp(n)  { return n + "%"; }
    function ex(s)  { return String(s == null ? "" : s).replace(/[<>&]/g, function (c) { return {"<":"&lt;",">":"&gt;","&":"&amp;"}[c]; }); }
    function ejRow(lbl, val, cls) {
      return "<div class='ej-row" + (cls ? " " + cls : "") + "'>" +
        "<span class='ej-lbl'>" + lbl + "</span>" +
        "<span class='ej-val'>" + val + "</span></div>";
    }

    // ─── Table builders ───────────────────────────────────────────────────
    function tbCartera() {
      return tablaC.map(function (t, i) {
        var desde = i === 0 ? 0 : tablaC[i - 1].max_dias + 1;
        var hasta = t.max_dias;
        var rango = (i === 0 && t.max_dias === 0) ? "Contado (0 días)"
          : (hasta === null ? "Más de " + tablaC[i - 1].max_dias + " días"
          : desde + " – " + hasta + " días");
        return "<tr><td>" + rango + "</td><td class='tc'>" + t.tasa + "%</td></tr>";
      }).join("");
    }

    function tbPpto() {
      return params.factor_presupuesto_tramos.map(function (t) {
        var rango = t.max_cumpl === null ? t.min_cumpl + "% o más"
          : (t.min_cumpl === 0 ? "Menos de 90%" : t.min_cumpl + "% – " + t.max_cumpl + "%");
        return "<tr><td>" + rango + "</td><td class='tc'>" + t.factor + "%</td></tr>";
      }).join("");
    }

    function tbIEC() {
      return params.factor_iec_tramos.map(function (t) {
        var rango = t.max_iec === null ? t.min_iec + "% o más"
          : (t.min_iec === 0 ? "Menos de 70%" : t.min_iec + "% – " + t.max_iec + "%");
        return "<tr><td>" + rango + "</td><td class='tc'>" + t.factor + "%</td></tr>";
      }).join("");
    }

    function tbDiferido() {
      return params.diferido_trimestral.liberacion.map(function (t) {
        var rango = t.max_cumpl === null ? t.min_cumpl + "% o más"
          : t.min_cumpl + "% – " + t.max_cumpl + "%";
        return "<tr><td>" + rango + "</td><td class='tc'>" + t.pct_liberacion + "%</td></tr>";
      }).join("");
    }

    // ─── Estados IEC ──────────────────────────────────────────────────────
    var tbEstadosIEC = "<table class='pol'><thead><tr><th>Estado</th><th>Condición</th><th>Consecuencia</th></tr></thead><tbody>" +
      "<tr><td><strong>A — Normal</strong></td><td>IEC_MIX ≥ " + iecMinAut + "% y ningún ítem bajo " + umbralCrit + "%</td><td>Comisión normal, sin bloqueos</td></tr>" +
      "<tr><td><strong>B — Autorización</strong></td><td>IEC_MIX &lt; " + iecMinAut + "% y ningún ítem bajo " + umbralCrit + "%</td><td>Requiere autorización GG/GD antes de liquidación</td></tr>" +
      "<tr><td><strong>C — Excepción crítica</strong></td><td>Algún ítem &lt; " + umbralCrit + "%</td><td>Excepción crítica · Requiere autorización GG/GD</td></tr>" +
      "</tbody></table>";

    var mesDesempeno = cicloInfo
      ? nombreCicloPdf(cicloInfo.mes_desempeno || cicloInfo.ciclo)
      : "—";

    return "<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'>" +
      "<title>Política Oficial SIC-AV — " + paisNombre + "</title>" +
      "<style>" + estilosPoliticaPdf() + "</style></head><body>" +

      // ════ PORTADA ════
      "<div class='portada'>" +
      "<div class='p-logo'>AV LATAM</div>" +
      "<h1>POLÍTICA OFICIAL</h1>" +
      "<h2>Sistema Integral de Incentivos Comerciales — SIC-AV</h2>" +
      "<div class='p-badge'>" + ex(params.politica_estado || "Vigente") + "</div>" +
      "<table class='p-tabla'>" +
      "<tr><td>País</td><td>" + paisNombre + "</td></tr>" +
      "<tr><td>Versión de política</td><td>" + ex(params.version_politica) + "</td></tr>" +
      "<tr><td>Vigente desde</td><td>" + fechaDDMMYYYYPdf(params.politica_vigente_desde) + "</td></tr>" +
      (cicloInfo ? "<tr><td>Período consultado</td><td>" + fechaDDMMYYYYPdf(cicloInfo.inicio) + " al " + fechaDDMMYYYYPdf(cicloInfo.cierre) + "</td></tr>" : "") +
      "<tr><td>Mes de desempeño</td><td>" + mesDesempeno + "</td></tr>" +
      "<tr><td>Autoriza modificaciones</td><td>" + ex(params.cambios_requieren_autorizacion || "—") + "</td></tr>" +
      "<tr><td>Fecha de generación</td><td>" + fechaGen + "</td></tr>" +
      "</table></div>" +

      // ════ CÓMO FUNCIONA ════
      "<section><h2 class='sec'>¿Cómo funciona el SIC-AV?</h2>" +
      "<p class='txt'>El SIC-AV calcula la comisión en dos etapas. Primero, la <strong>Comisión Base</strong>: cada cobro del período se multiplica por la tasa que corresponde a los días entre la factura y su pago. Segundo, la <strong>Comisión Final</strong>: el resultado se multiplica por los factores del mes de desempeño y se suman bonos.</p>" +
      "<div class='flow-diagram'>" +
      "<div class='flow-row'>" +
      "<div class='fbox'>Cobros<br>del período<small>por factura</small></div>" +
      "<div class='fop'>×</div>" +
      "<div class='fbox'>Tasa Cartera<small>según días al cobro</small></div>" +
      "<div class='fop'>=</div>" +
      "<div class='fbox grn'>Comisión<br>Base<small>Σ todas las facturas</small></div>" +
      "</div>" +
      "<div class='flow-row' style='margin-top:10px'>" +
      "<div class='fbox grn'>Comisión<br>Base</div>" +
      "<div class='fop'>×</div>" +
      "<div class='fbox'>Factor<br>Presupuesto</div>" +
      "<div class='fop'>×</div>" +
      "<div class='fbox'>Factor<br>IEC</div>" +
      "<div class='fop'>+</div>" +
      "<div class='fbox amb'>Bono<br>Excedente</div>" +
      "<div class='fop'>−</div>" +
      "<div class='fbox'>NC &amp;<br>Saldo ant.</div>" +
      "<div class='fop'>=</div>" +
      "<div class='fbox res'>Comisión<br>Pagable</div>" +
      "</div></div>" +
      "<p class='txt'>La <strong>Comisión Pagable</strong> es siempre ≥ 0. Los Factores de Presupuesto e IEC se calculan sobre el <em>mes de desempeño</em>, no sobre el período de cobranza.</p>" +
      "</section>" +

      // ════ DEFINICIONES ════
      "<section><h2 class='sec'>Definiciones Clave</h2>" +
      "<table class='pol'><thead><tr><th>Término</th><th>Definición</th></tr></thead><tbody>" +
      "<tr><td><strong>Período de cobranza</strong></td><td>Ventana de fechas (inicio – cierre) en que se acumulan los pagos recibidos. Genera la comisión base.</td></tr>" +
      "<tr><td><strong>Mes de desempeño</strong></td><td>Mes calendario inmediatamente anterior al cierre del período. Base para presupuesto, IEC y bono.</td></tr>" +
      "<tr><td><strong>Venta neta</strong></td><td>Facturación del comercial en el mes de desempeño, sin impuestos.</td></tr>" +
      "<tr><td><strong>Cobro efectivo</strong></td><td>Pagos verificados recibidos dentro del período de cobranza.</td></tr>" +
      "<tr><td><strong>IEC</strong></td><td>Índice de Eficiencia Comercial. Fórmula: IEC (%) = Σ venta_neta_elegible ÷ Σ (cantidad × precio_piso_unitario) × 100.</td></tr>" +
      "<tr><td><strong>Precio piso</strong></td><td>Precio mínimo autorizado por producto/formato. Impacta comisión únicamente a través del Factor IEC.</td></tr>" +
      "<tr><td><strong>Factor Presupuesto</strong></td><td>Multiplicador por tramos según % de cumplimiento del presupuesto del mes de desempeño. Máximo 100%.</td></tr>" +
      "<tr><td><strong>Factor IEC</strong></td><td>Multiplicador por tramos según IEC del mes de desempeño.</td></tr>" +
      "<tr><td><strong>Bono por excedente</strong></td><td>" + fp(params.bono_excedente_pct) + " sobre la venta neta que supere el presupuesto del mes. Requiere Factor Presupuesto = 100%.</td></tr>" +
      "<tr><td><strong>Comisión diferida</strong></td><td>Porción retenida cuando Factor Presupuesto &lt; 100%. Se libera trimestralmente si se cumplen las condiciones.</td></tr>" +
      "</tbody></table></section>" +

      // ════ FACTORES ════
      "<section><h2 class='sec'>Factores y Reglas de Cálculo</h2>" +

      "<h3 class='sub'>1. Tasa de Cartera</h3>" +
      "<p class='txt'><code>Comisión Base = Σ (cobro_factura × tasa_factura)</code> — la tasa depende de los días entre emisión y pago de cada factura.</p>" +
      "<table class='pol'><thead><tr><th>Días al cobro</th><th class='tc'>Tasa</th></tr></thead><tbody>" + tbCartera() + "</tbody></table>" +

      "<h3 class='sub'>2. Factor de Cumplimiento de Presupuesto</h3>" +
      "<p class='txt'>Calculado sobre el <strong>mes de desempeño</strong>. No supera el 100%; el sobrecumplimiento se reconoce vía Bono por Excedente.</p>" +
      "<table class='pol'><thead><tr><th>Cumplimiento del mes de desempeño</th><th class='tc'>Factor Presupuesto</th></tr></thead><tbody>" + tbPpto() + "</tbody></table>" +

      "<h3 class='sub'>3. Factor IEC</h3>" +
      "<p class='txt'><code>IEC (%) = Σ venta_neta_elegible ÷ Σ (cantidad × precio_piso_unitario) × 100</code><br>Es el único mecanismo por el que el precio piso afecta la comisión.</p>" +
      "<table class='pol'><thead><tr><th>IEC del mes de desempeño</th><th class='tc'>Factor IEC</th></tr></thead><tbody>" + tbIEC() + "</tbody></table>" +
      "<p class='txt'>Estados de la política IEC:</p>" + tbEstadosIEC +

      "<h3 class='sub'>4. Bono por Excedente del Mes de Desempeño</h3>" +
      "<p class='txt'><code>Bono = max(0, venta_neta_mes − presupuesto_mes) × " + fp(params.bono_excedente_pct) + "</code><br>" +
      "Se incorpora en la liquidación del ciclo siguiente. <strong>Condición:</strong> cumplimiento ≥ 100%.</p>" +

      "<h3 class='sub'>5. Precio Piso — Tratamiento Vigente (V1.4)</h3>" +
      "<p class='txt'>Toda venta facturada es una operación válida y aprobada. Una venta bajo piso <strong>no produce reducción, bloqueo ni excepción adicional</strong>.</p>" +
      "<table class='pol'><thead><tr><th>Situación</th><th class='tc'>Impacto directo en comisión</th></tr></thead><tbody>" +
      "<tr><td>Venta ≥ precio piso</td><td class='tc' style='color:#1E7D4A'>Normal</td></tr>" +
      "<tr><td>Venta &lt; precio piso</td><td class='tc'>Normal (impacta IEC — solo informativo)</td></tr>" +
      "</tbody></table>" +

      "<h3 class='sub'>6. Comisión Diferida Trimestral</h3>" +
      "<p class='txt'>La porción retenida por Factor Presupuesto &lt; 100% se libera al cierre del trimestre según el cumplimiento trimestral del mes de desempeño.</p>" +
      "<table class='pol'><thead><tr><th>Cumplimiento trimestral</th><th class='tc'>% de liberación</th></tr></thead><tbody>" + tbDiferido() + "</tbody></table>" +
      "<p class='txt'>Condiciones adicionales: IEC trimestral mínimo " + fp(params.diferido_trimestral.iec_minimo) + ", cartera dentro de estándar, sin observaciones financieras graves.</p>" +
      "</section>" +

      // ════ EJEMPLO INTEGRAL ════
      "<section><h2 class='sec'>Ejemplo Integral Ilustrativo</h2>" +
      "<p class='txt'>Factores y comisiones computados desde los parámetros vigentes. Montos base son ilustrativos y redondos.</p>" +

      "<h3 class='sub'>Escenario A — Cumplimiento " + EJ_CUMPL + "% (sin excedente)</h3>" +
      "<div class='ej'><h4>Inputs del escenario (ilustrativos)</h4>" +
      ejRow("Presupuesto del mes de desempeño", fm(EJ_PPTO)) +
      ejRow("Venta cobrada del período", fm(ejCobrado) + " (" + EJ_CUMPL + "% del presupuesto)") +
      ejRow("Días promedio al cobro", EJ_DIAS + " días") +
      "</div>" +
      "<div class='ej'><h4>Paso 1 — Comisión Base</h4>" +
      ejRow("Tasa de cartera (" + EJ_DIAS + " días) → de tabla", fp(ejTasa)) +
      ejRow("Comisión Base = " + fm(ejCobrado) + " × " + fp(ejTasa), fm(ejComBase)) +
      "</div>" +
      "<div class='ej'><h4>Paso 2 — Factores del mes de desempeño</h4>" +
      ejRow("Cumplimiento de presupuesto", fp(EJ_CUMPL)) +
      ejRow("Factor Presupuesto → de tabla", fp(ejFPpto)) +
      ejRow("IEC del mes de desempeño (ilustrativo)", fp(EJ_IEC)) +
      ejRow("Factor IEC → de tabla", fp(ejFIEC)) +
      ejRow("Comisión Generada = " + fm(ejComBase) + " × " + fp(ejFPpto) + " × " + fp(ejFIEC), fm(ejComGen)) +
      "</div>" +
      "<div class='ej'><h4>Paso 3 — Resultado final</h4>" +
      ejRow("Comisión Generada", fm(ejComGen)) +
      ejRow("Excedente (venta − presupuesto)", fm(ejExced)) +
      ejRow("Bono por excedente (" + fp(params.bono_excedente_pct) + ")", fm(ejBono)) +
      ejRow("Notas de crédito / Saldo anterior", fm(0)) +
      ejRow("Comisión Pagable = max(0, resultado)", fm(ejPagable), "tot") +
      "</div>" +

      "<h3 class='sub'>Escenario B — Cumplimiento " + EJ2_CUMPL + "% (con excedente)</h3>" +
      "<div class='ej'><h4>Inputs del escenario (ilustrativos)</h4>" +
      ejRow("Presupuesto del mes de desempeño", fm(EJ_PPTO)) +
      ejRow("Venta cobrada del período", fm(ej2Cobrado) + " (" + EJ2_CUMPL + "% del presupuesto)") +
      ejRow("Días promedio al cobro", EJ_DIAS + " días") +
      "</div>" +
      "<div class='ej'><h4>Cálculo completo</h4>" +
      ejRow("Comisión Base = " + fm(ej2Cobrado) + " × " + fp(ejTasa), fm(ej2ComBase)) +
      ejRow("Factor Presupuesto (" + fp(EJ2_CUMPL) + " → " + fp(ej2FPpto) + ")", fp(ej2FPpto)) +
      ejRow("Factor IEC (" + fp(EJ_IEC) + " → " + fp(ejFIEC) + ")", fp(ejFIEC)) +
      ejRow("Comisión Generada", fm(ej2ComGen)) +
      ejRow("Excedente = " + fm(ej2Cobrado) + " − " + fm(EJ_PPTO), fm(ej2Exced)) +
      ejRow("Bono por excedente (" + fp(params.bono_excedente_pct) + ")", fm(ej2Bono)) +
      ejRow("Comisión Pagable = max(0, resultado)", fm(ej2Pagable), "tot") +
      "</div></section>" +

      // ════ FAQ ════
      "<section><h2 class='sec'>Preguntas Frecuentes</h2>" +

      "<div class='faq-item'><div class='faq-q'>¿Qué pasa si mi cumplimiento es menor al " + fp(params.factor_presupuesto_tramos[0].max_cumpl) + "?</div>" +
      "<div class='faq-a'>El Factor Presupuesto es " + fp(params.factor_presupuesto_tramos[0].factor) + ": la comisión generada del período es cero. No cancela comisiones ya liquidadas en ciclos anteriores ni el diferido acumulado.</div></div>" +

      "<div class='faq-item'><div class='faq-q'>¿Puede ser negativa mi comisión?</div>" +
      "<div class='faq-a'>No. La Comisión Pagable es siempre max(0, resultado económico). Si las notas de crédito o el saldo anterior producen un resultado negativo, el saldo queda pendiente para el siguiente ciclo con comisión positiva.</div></div>" +

      "<div class='faq-item'><div class='faq-q'>¿Cómo afecta el precio piso a mi comisión?</div>" +
      "<div class='faq-a'>El precio piso no bloquea ni reduce directamente ninguna factura. Su único impacto es a través del Factor IEC: si el IEC del mes de desempeño cae bajo " + fp(params.factor_iec_tramos[params.factor_iec_tramos.length - 1].min_iec) + "%, el Factor IEC será menor al máximo posible (" + fp(params.factor_iec_tramos[params.factor_iec_tramos.length - 1].factor) + "%).</div></div>" +

      "<div class='faq-item'><div class='faq-q'>¿Cuándo se libera la comisión diferida?</div>" +
      "<div class='faq-a'>Al cierre de cada trimestre, si el cumplimiento trimestral ≥ " + fp(params.diferido_trimestral.liberacion[0].min_cumpl) + " y el IEC trimestral supera el mínimo de " + fp(params.diferido_trimestral.iec_minimo) + ". El porcentaje de liberación varía según la tabla de diferido.</div></div>" +

      "<div class='faq-item'><div class='faq-q'>¿En qué ciclo se paga el Bono por Excedente?</div>" +
      "<div class='faq-a'>El bono generado en el mes de desempeño se incorpora en la liquidación del ciclo siguiente. Es el " + fp(params.bono_excedente_pct) + " sobre la venta neta que supere el presupuesto del mes.</div></div>" +

      "<div class='faq-item'><div class='faq-q'>¿Qué diferencia hay entre período de cobranza y mes de desempeño?</div>" +
      "<div class='faq-a'>El período de cobranza define las fechas de inicio y cierre de la ventana de cobros. El mes de desempeño es el mes calendario inmediatamente anterior al cierre del período. Ejemplo: período que cierra el 25/07 usa Junio como mes de desempeño.</div></div>" +

      "</section>" +

      // ════ GOBERNANZA ════
      "<section><h2 class='sec'>Gobernanza y Autorización</h2>" +

      "<div class='gov-block'><h4>⚠ Quién puede modificar esta política</h4>" +
      "<p>Toda modificación a factores, tasas, porcentajes, tablas o reglas <strong>requiere autorización escrita del Gerente General</strong> (" + ex(params.cambios_requieren_autorizacion || "—") + "). Todo cambio debe registrarse en el historial del archivo de parámetros con versión, fecha, autor y nota.</p></div>" +

      "<div class='gov-block'><h4>Fuente única de verdad</h4>" +
      "<p>Este documento se genera automáticamente desde <code>parametros_" + pais.toLowerCase() + ".json</code>. <strong>No existe versión manual de esta política.</strong> En caso de discrepancia, prevalece el archivo de parámetros activo en producción.</p></div>" +

      (params.tasa_cartera_historial && params.tasa_cartera_historial.length > 0 ?
        "<h3 class='sub'>Historial de versiones</h3>" +
        "<table class='pol'><thead><tr><th>Versión</th><th>Vigente desde</th><th>Autor</th><th>Nota</th></tr></thead><tbody>" +
        params.tasa_cartera_historial.map(function (h) {
          return "<tr><td>" + ex(h.version || "—") + "</td><td>" + fechaDDMMYYYYPdf(h.vigente_desde) + "</td><td>" + ex(h.autor || "—") + "</td><td style='font-size:9.5px'>" + ex(h.nota || "—") + "</td></tr>";
        }).join("") +
        "</tbody></table>"
      : "") +

      "<p class='legal'>Documento generado automáticamente el " + fechaGen + " desde los parámetros vigentes de AV LATAM Board. Confidencial — uso interno. Versión: " + ex(params.version_politica) + " — " + ex(params.politica_estado || "Estado no especificado") + ". Sujeto a aprobación gerencial antes de constituir liquidación oficial de remuneraciones.</p>" +
      "</section>" +

      "<script>window.onload = function(){ setTimeout(function(){ window.print(); }, 400); };<\/script>" +
      "</body></html>";
  }

  var SICPDF = {};

  /**
   * Genera y abre el Informe Ejecutivo de Gestion Comercial en una ventana
   * nueva, lista para imprimir / guardar como PDF. No depende de ninguna
   * libreria externa ni CDN.
   */
  SICPDF.generarInforme = function (opts) {
    var html = construirHtml(opts);
    var win = window.open("", "_blank");
    if (!win) {
      alert("El navegador bloqueo la ventana del informe. Habilite ventanas emergentes para este sitio.");
      return null;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
    return win;
  };

  /**
   * Genera y abre el informe "Politica y Factores" (CHANGE REQUEST SIC-AV v1.3)
   * en una ventana nueva, lista para imprimir / guardar como PDF. Mismo patron
   * que generarInforme(), sin dependencias externas.
   */
  SICPDF.generarInformePolitica = function (opts) {
    var html = construirHtmlPolitica(opts);
    var win = window.open("", "_blank");
    if (!win) {
      alert("El navegador bloqueo la ventana del informe. Habilite ventanas emergentes para este sitio.");
      return null;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
    return win;
  };

  // Expuesto para pruebas (permite construir el HTML sin abrir ventana)
  SICPDF._construirHtml = construirHtml;
  SICPDF._construirHtmlPolitica = construirHtmlPolitica;
  SICPDF._codigoInforme = codigoInforme;

  global.SICPDF = SICPDF;
})(typeof window !== "undefined" ? window : globalThis);
