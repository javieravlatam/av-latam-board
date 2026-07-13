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
      "<tr><td>Ciclo comercial</td><td>" + esc(nombreCicloPdf(r.ciclo)) + " (" + fechaDDMMYYYYPdf(r.ciclo_info.inicio) + " a " + fechaDDMMYYYYPdf(r.ciclo_info.cierre) + ")</td></tr>" +
      "<tr><td>Estado del ciclo</td><td>" + esc(r.ciclo_info.estado === "vigente" ? "Vigente" : (r.ciclo_info.estado === "cerrado" ? "Cerrado" : r.ciclo_info.estado)) + "</td></tr>" +
      "<tr><td>Version de politica aplicada a este ciclo</td><td>" + esc(r.ciclo_info.policy_version || params.version_politica) + "</td></tr>" +
      "<tr><td>Fecha de datos del ciclo</td><td>" + fechaDDMMYYYYPdf(r.ciclo_info.fecha_datos) + "</td></tr>" +
      "<tr><td>Fecha de generacion del informe</td><td>" + fechaGeneracion + "</td></tr>" +
      "<tr><td>Codigo unico del informe</td><td>" + codigo + "</td></tr>" +
      "</table>" +
      "<div class='banner-demo'>MODELO DEMOSTRATIVO — PENDIENTE DE APROBACION GERENCIAL. Datos sinteticos, sin valor contractual.</div>" +
      "</section>" +

      // RESUMEN EJECUTIVO
      "<section class='bloque'>" +
      "<h2>Resumen Ejecutivo</h2>" +
      "<table class='tabla-resumen'>" +
      "<tr><td>Comision potencial</td><td class='num'>" + fmt(pais, r.comision_potencial) + "</td>" +
      "<td>Comision liberada</td><td class='num'>" + fmt(pais, r.comision_liberada) + "</td></tr>" +
      "<tr><td>Comision pendiente</td><td class='num'>" + fmt(pais, r.comision_pendiente) + "</td>" +
      "<td>Comision validada</td><td class='num'>" + fmt(pais, r.comision_validada) + "</td></tr>" +
      "<tr><td>Comision pagada</td><td class='num'>" + fmt(pais, r.comision_pagada) + "</td>" +
      "<td>Comision diferida (trimestre)</td><td class='num'>" + fmt(pais, diferido.diferido_acumulado) + "</td></tr>" +
      "<tr><td>Presupuesto del ciclo</td><td class='num'>" + fmt(pais, r.presupuesto) + "</td>" +
      "<td>Cumplimiento</td><td class='num'>" + pct(r.cumplimiento_pct) + "</td></tr>" +
      "<tr><td>IEC del ciclo</td><td class='num'>" + pct(r.iec_pct) + "</td>" +
      "<td>Venta facturada</td><td class='num'>" + fmt(pais, r.venta_facturada) + "</td></tr>" +
      "<tr><td>Venta cobrada</td><td class='num'>" + fmt(pais, r.venta_cobrada) + "</td>" +
      "<td>Bono por excedente</td><td class='num'>" + fmt(pais, r.bono_excedente) + "</td></tr>" +
      "</table></section>" +

      // COMO SE CONSTRUYO
      "<section class='bloque'>" +
      "<h2>Como se Construyo</h2>" +
      "<table class='tabla-resumen'>" +
      "<tr><td>Comision base (total del ciclo)</td><td class='num'>" + fmt(pais, r.comision_base_total) + "</td></tr>" +
      "<tr><td>Factor de Cumplimiento de Presupuesto</td><td class='num'>" + pct(r.factor_presupuesto) + "</td></tr>" +
      "<tr><td>Factor IEC</td><td class='num'>" + pct(r.factor_iec) + "</td></tr>" +
      "<tr><td>Bonificaciones (excedente)</td><td class='num'>" + fmt(pais, r.bono_excedente) + "</td></tr>" +
      "<tr><td>Ajustes (notas de credito de ciclos anteriores)</td><td class='num'>-" + fmt(pais, r.ajustes_nc) + "</td></tr>" +
      "<tr class='total'><td>Resultado final del ciclo</td><td class='num'>" + fmt(pais, r.comision_final) + "</td></tr>" +
      "</table>" +
      "<p class='nota-formula'>Formula (Politica V1.4): Comision Ajustada = Comision Base &times; Factor Presupuesto &times; Factor IEC. " +
      "Comision Final = Suma(Comision Ajustada) + Bono Excedente + Bono Consistencia Trimestral - Notas de Credito - Devoluciones - Ajustes. " +
      "La edad de cartera no se cuenta dos veces: vive unicamente en la tasa por tramo de dias. El precio piso ya no es un factor de la formula -- toda venta facturada entra al calculo normal; el precio piso solo impacta la comision de forma indirecta, a traves del Factor IEC.</p>" +
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
      "<tr><td>Fecha de datos</td><td>Datos demostrativos, corte sintetico</td></tr>" +
      "<tr><td>Fecha de calculo</td><td>" + fechaGeneracion + "</td></tr>" +
      "<tr><td>Fecha de generacion del informe</td><td>" + fechaGeneracion + "</td></tr>" +
      "<tr><td>Codigo unico</td><td>" + codigo + "</td></tr>" +
      "</table>" +
      "<p class='nota-legal'>Documento generado con datos demostrativos. No constituye liquidacion oficial de remuneraciones.</p>" +
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
    var cicloInfo = params.ciclos.filter(function (c) { return c.ciclo === ciclo; })[0] ||
      params.ciclos.filter(function (c) { return c.ciclo === params.ciclo_vigente; })[0];
    var fechaGeneracion = new Date().toISOString().slice(0, 19).replace("T", " ");
    var monedaEj = pais === "CL" ? "CLP" : "USD";
    var ejPpto = 100000, ejVenta = 120000, ejExcedente = ejVenta - ejPpto;
    var ejBono = ejExcedente * (params.bono_excedente_pct / 100);

    var filasPresupuesto = filas2Col(params.factor_presupuesto_tramos, function (t) {
      return t.max_cumpl === null ? (t.min_cumpl + "% o mas") : (t.min_cumpl === 0 ? "Menos de " + (t.max_cumpl + 0.01).toFixed(0) + "%" : t.min_cumpl + "%-" + t.max_cumpl + "%");
    }, function (t) { return t.factor + "%"; });

    var tablaCartera = tablaCarteraPaisActivoPdf(params);
    var filasCartera = tablaCartera.map(function (t, idx) {
      return "<tr><td>" + textoTramoDiasPdf(t, idx, tablaCartera) + "</td><td class='num'>" + t.tasa + "%</td></tr>";
    }).join("");

    var filasIec = filas2Col(params.factor_iec_tramos, function (t) {
      return t.max_iec === null ? (t.min_iec + "% o mas") : (t.min_iec === 0 ? "Menos de 70%" : t.min_iec + "%-" + t.max_iec + "%");
    }, function (t) { return t.factor + "%"; });

    var filasDiferido = filas2Col(params.diferido_trimestral.liberacion, function (t) {
      return t.max_cumpl === null ? (t.min_cumpl + "% o mas") : (t.min_cumpl + "%-" + t.max_cumpl + "%");
    }, function (t) { return t.pct_liberacion + "%"; });

    return "" +
      "<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'>" +
      "<title>Politica y Factores SIC-AV — " + (pais === "CL" ? "Chile" : "Peru") + "</title>" +
      "<style>" + estilosPdf() + "</style></head><body>" +

      "<section class='portada'>" +
      "<div class='logo-slot'>AV LATAM</div>" +
      "<h1>POLITICA Y FACTORES DEL SIC-AV</h1>" +
      "<p class='sistema'>Sistema Integral de Incentivos Comerciales — SIC-AV</p>" +
      "<table class='tabla-portada'>" +
      "<tr><td>Pais</td><td>" + (pais === "CL" ? "Chile" : "Peru") + "</td></tr>" +
      "<tr><td>Ciclo consultado</td><td>" + esc(nombreCicloPdf(cicloInfo.ciclo)) + " (" + fechaDDMMYYYYPdf(cicloInfo.inicio) + " a " + fechaDDMMYYYYPdf(cicloInfo.cierre) + ") · " + esc(cicloInfo.estado === "vigente" ? "Vigente" : "Cerrado") + "</td></tr>" +
      "<tr><td>Version de politica</td><td>" + esc(cicloInfo.policy_version || params.version_politica) + "</td></tr>" +
      "<tr><td>Vigente desde</td><td>" + fechaDDMMYYYYPdf(params.politica_vigente_desde) + "</td></tr>" +
      "<tr><td>Estado de la politica</td><td>" + esc(params.politica_estado || "—") + "</td></tr>" +
      "<tr><td>Fecha de generacion</td><td>" + fechaGeneracion + "</td></tr>" +
      "</table>" +
      "<div class='banner-demo'>MODELO DEMOSTRATIVO — PRECIO PISO Y BONO DE CONSISTENCIA TRIMESTRAL PENDIENTES DE APROBACION GERENCIAL.</div>" +
      "</section>" +

      "<section class='bloque'>" +
      "<h2>Factor de Cumplimiento de Presupuesto</h2>" +
      "<table class='tabla-resumen'><thead><tr><th>Cumplimiento del ciclo</th><th class='num'>Factor</th></tr></thead><tbody>" + filasPresupuesto + "</tbody></table>" +
      "<p class='nota-formula'>El factor de presupuesto nunca supera el 100%. El sobrecumplimiento se reconoce mediante el Bono por Excedente.</p>" +
      "</section>" +

      "<section class='bloque'>" +
      "<h2>Bono por Excedente</h2>" +
      "<p class='nota-formula'>2% sobre la venta neta cobrada que exceda el presupuesto del ciclo.</p>" +
      "<table class='tabla-resumen'>" +
      "<tr><td>Presupuesto (ejemplo)</td><td class='num'>" + monedaEj + " " + ejPpto.toLocaleString("es-CL") + "</td></tr>" +
      "<tr><td>Venta cobrada (ejemplo)</td><td class='num'>" + monedaEj + " " + ejVenta.toLocaleString("es-CL") + "</td></tr>" +
      "<tr><td>Excedente (ejemplo)</td><td class='num'>" + monedaEj + " " + ejExcedente.toLocaleString("es-CL") + "</td></tr>" +
      "<tr class='total'><td>Bono por excedente (2%)</td><td class='num'>" + monedaEj + " " + ejBono.toLocaleString("es-CL") + "</td></tr>" +
      "</table></section>" +

      "<section class='bloque'>" +
      "<h2>Edad de Cartera — " + (pais === "CL" ? "Chile" : "Peru") + "</h2>" +
      "<table class='tabla-resumen'><thead><tr><th>Tramo de dias</th><th class='num'>Tasa</th></tr></thead><tbody>" + filasCartera + "</tbody></table>" +
      "</section>" +

      "<section class='bloque'>" +
      "<h2>Factor IEC</h2>" +
      "<table class='tabla-resumen'><thead><tr><th>IEC del ciclo</th><th class='num'>Factor</th></tr></thead><tbody>" + filasIec + "</tbody></table>" +
      "<p class='nota-formula'>El IEC mide la disciplina de gestion comercial del vendedor (principalmente el respeto del precio piso) — no la rentabilidad ni el margen del producto.</p>" +
      "</section>" +

      "<section class='bloque'>" +
      "<h2>Tratamiento de Precio Piso</h2>" +
      "<p class='nota-formula'>CHANGE REQUEST SIC-AV v1.4 (aprobado por Gerencia General): toda venta facturada se considera una operacion valida y previamente aprobada por la compañia. El SIC ya NO aplica un factor de reduccion ni un veto de comision por precio piso -- una venta bajo piso, por si sola, nunca produce comision cero, reduccion adicional, bloqueo, retencion ni excepcion manual.</p>" +
      "<table class='tabla-resumen'>" +
      "<tr><td>Venta sobre o igual al piso</td><td class='num'>Comision normal</td></tr>" +
      "<tr><td>Venta bajo piso</td><td class='num'>Comision normal (informativo, no reduce ni bloquea)</td></tr>" +
      "</table>" +
      "<p class='nota-formula'>El precio piso se mantiene como dato informativo por factura, como comparacion entre precio de venta y precio piso, y como insumo del Factor IEC -- el IEC es el UNICO mecanismo por el cual el precio piso puede impactar la comision.</p>" +
      "</section>" +

      "<section class='bloque'>" +
      "<h2>Bono de Consistencia Trimestral</h2>" +
      "<p class='nota-formula'>Aisla exclusivamente la porcion de comision retenida por no alcanzar el Factor de Presupuesto. Nunca recupera reducciones causadas por IEC, edad de cartera, notas de credito o devoluciones.</p>" +
      "<table class='tabla-resumen'><thead><tr><th>Cumplimiento trimestral</th><th class='num'>% de liberacion</th></tr></thead><tbody>" + filasDiferido + "</tbody></table>" +
      "<p class='nota-formula'>Condiciones para liberar: IEC trimestral minimo " + params.diferido_trimestral.iec_minimo + "%, cartera dentro de estandar, sin observaciones financieras graves.</p>" +
      "</section>" +

      "<section class='bloque'>" +
      "<p class='nota-legal'>Documento generado con datos y parametros demostrativos. No constituye politica oficial de remuneraciones hasta su aprobacion formal por Gerencia General.</p>" +
      "</section>" +

      "<script>window.onload = function(){ setTimeout(function(){ window.print(); }, 300); };<\/script>" +
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
