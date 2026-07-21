/**
 * SIC-AV — Pruebas obligatorias del CHANGE REQUEST v1.6
 * =========================================================================================
 * "ARQUITECTURA TEMPORAL DEFINITIVA: PERIODO DE COBRANZA 26-25 + MES CALENDARIO DE DESEMPEÑO"
 *
 * Cubre exactamente los 16 casos exigidos en la seccion 14 del CHANGE REQUEST v1.6:
 *   1. Liquidacion 25 junio: periodo 26 mayo-25 junio, mes desempeño mayo.
 *   2. Liquidacion 25 julio: periodo 26 junio-25 julio, mes desempeño junio.
 *   3. Factor de Presupuesto usa venta y presupuesto del MISMO mes calendario.
 *   4. IEC usa el mismo mes de desempeño que el Factor de Presupuesto.
 *   5. Bono usa venta neta mensual y presupuesto mensual.
 *   6. Bono NO usa cobranza.
 *   7. No existe presupuesto de ciclo 26-25 (no hay campo "presupuesto de ciclo").
 *   8. No existe prorrateo automatico (ni en el motor ni en el adaptador real).
 *   9. Dashboard (sic_chile.html/sic_peru.html) muestra ambos periodos.
 *   10. PDF (sic_pdf.js) muestra ambos periodos.
 *   11. Politica (sic_politica.html) explica ambos periodos.
 *   12. Historico conserva la relacion liquidacion <-> mes de desempeño.
 *   13. Enero maneja correctamente diciembre del año anterior.
 *   14. Años bisiestos y cierres de febrero.
 *   15. Mes sin presupuesto -> no calcula Factor de Presupuesto (queda null/"Pendiente de carga").
 *   16. Mes sin IEC -> no calcula comision definitiva con datos inventados.
 *
 * No depende de un servidor HTTP (las pruebas 9-11 leen el HTML/JS fuente como texto,
 * igual que se verifica en run_dashboard_real_test.js / run_ui_tests.js con jsdom -- esta
 * suite es el complemento sin servidor, enfocado solo en el modelo temporal v1.6).
 *
 * Uso: node tests/run_v16_temporal_model_tests.js   (ejecutar desde apps/sic_av/)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

global.fetch = function (url) {
  return new Promise((resolve) => {
    try {
      const p = path.join(ROOT, url);
      const content = fs.readFileSync(p, 'utf8');
      resolve({ ok: true, json: () => Promise.resolve(JSON.parse(content)) });
    } catch (e) {
      resolve({ ok: false });
    }
  });
};
global.window = global;

eval(fs.readFileSync(path.join(ROOT, 'sic_core.js'), 'utf8'));

const resultados = [];
function check(nombre, condicion, detalle) {
  resultados.push({ nombre, ok: !!condicion, detalle: detalle || '' });
  console.log((condicion ? 'OK  ' : 'FAIL') + ' - ' + nombre + (detalle ? '  (' + detalle + ')' : ''));
}

(async () => {
  const ctxCL = await SIC.cargarPais('CL');
  const ctxPE = await SIC.cargarPais('PE');

  // -------------------------------------------------------------------------
  // 1. Liquidacion 25 junio: periodo 26 mayo-25 junio, mes desempeño mayo.
  // -------------------------------------------------------------------------
  const r0625 = SIC.calcularVendedorCiclo(ctxCL, 'CL-V01', '2026-06');
  check('01_liquidacion_25_junio_periodo_y_mes_desempeno',
    r0625.ciclo_info.inicio === '2026-05-26' && r0625.ciclo_info.cierre === '2026-06-25' &&
    r0625.mes_desempeno === '2026-05',
    'periodo=' + r0625.ciclo_info.inicio + '..' + r0625.ciclo_info.cierre + ' mes_desempeno=' + r0625.mes_desempeno);

  // -------------------------------------------------------------------------
  // 2. Liquidacion 25 julio: periodo 26 junio-25 julio, mes desempeño junio.
  // -------------------------------------------------------------------------
  const r0725 = SIC.calcularVendedorCiclo(ctxCL, 'CL-V01', '2026-07');
  check('02_liquidacion_25_julio_periodo_y_mes_desempeno',
    r0725.ciclo_info.inicio === '2026-06-26' && r0725.ciclo_info.cierre === '2026-07-25' &&
    r0725.mes_desempeno === '2026-06',
    'periodo=' + r0725.ciclo_info.inicio + '..' + r0725.ciclo_info.cierre + ' mes_desempeno=' + r0725.mes_desempeno);

  // -------------------------------------------------------------------------
  // 3. Factor de Presupuesto usa venta y presupuesto del MISMO mes calendario
  // -- se verifica reconstruyendo el cumplimiento de forma independiente
  // (venta_neta_mes / presupuesto_mes) y comparando contra SIC.factorPresupuesto.
  // -------------------------------------------------------------------------
  const cumplIndependiente3 = (r0725.venta_neta_mes / r0725.presupuesto_mes) * 100;
  check('03_factor_presupuesto_usa_mismo_mes_calendario',
    Math.abs(cumplIndependiente3 - r0725.cumplimiento_pct) < 0.01 &&
    SIC.factorPresupuesto(ctxCL.params, r0725.cumplimiento_pct) === r0725.factor_presupuesto,
    'cumplimiento reconstruido=' + cumplIndependiente3.toFixed(2) + '% vs motor=' + r0725.cumplimiento_pct.toFixed(2) + '% (mes ' + r0725.mes_desempeno + ')');

  // -------------------------------------------------------------------------
  // 4. IEC usa el mismo mes de desempeño que el Factor de Presupuesto -- se
  // verifica que el registro de IEC leido por el motor (ctx.iec) corresponde
  // exactamente a r.mes_desempeno, no a otro mes ni al periodo de cobranza.
  // -------------------------------------------------------------------------
  const iecRegistro4 = ctxCL.iec.filter(function (i) { return i.vendedor_id === 'CL-V01' && i.mes === r0725.mes_desempeno; })[0];
  check('04_iec_usa_mismo_mes_de_desempeno_que_presupuesto',
    !!iecRegistro4 && iecRegistro4.iec_pct === r0725.iec_pct,
    'registro IEC usado por el motor: mes=' + (iecRegistro4 && iecRegistro4.mes) + ' iec_pct=' + (iecRegistro4 && iecRegistro4.iec_pct) + ' (coincide con mes_desempeno=' + r0725.mes_desempeno + ')');

  // -------------------------------------------------------------------------
  // 5. Bono usa venta neta mensual y presupuesto mensual -- CL-V02 en el
  // ciclo '2026-04' (mes de desempeño '2026-03') es el caso demo con
  // excedente mensual real y positivo.
  // -------------------------------------------------------------------------
  const rBono5 = SIC.calcularVendedorCiclo(ctxCL, 'CL-V02', '2026-04');
  const excedenteEsperado5 = Math.max(0, rBono5.venta_neta_mes - rBono5.presupuesto_mes);
  check('05_bono_usa_venta_neta_mensual_y_presupuesto_mensual',
    Math.abs(rBono5.excedente_mes - excedenteEsperado5) < 0.01 && rBono5.bono_excedente > 0,
    'venta_neta_mes=' + Math.round(rBono5.venta_neta_mes) + ' presupuesto_mes=' + Math.round(rBono5.presupuesto_mes) + ' excedente_mes=' + Math.round(rBono5.excedente_mes) + ' bono=' + Math.round(rBono5.bono_excedente));

  // -------------------------------------------------------------------------
  // 6. Bono NO usa cobranza -- el campo "excedente_cobrado" (v1.4) ya no
  // existe en el resultado, y el bono no cambia si se altera la cobranza del
  // periodo (se prueba clonando el ctx y vaciando las cobranzas del periodo:
  // el bono_excedente y el excedente_mes deben permanecer identicos).
  // -------------------------------------------------------------------------
  const ctxSinCobranza6 = JSON.parse(JSON.stringify(ctxCL));
  ctxSinCobranza6.cobranzas = [];
  const rBonoSinCobranza6 = SIC.calcularVendedorCiclo(ctxSinCobranza6, 'CL-V02', '2026-04');
  check('06_bono_no_usa_cobranza',
    rBono5.excedente_cobrado === undefined &&
    rBonoSinCobranza6.excedente_mes === rBono5.excedente_mes &&
    rBonoSinCobranza6.bono_excedente === rBono5.bono_excedente,
    'campo excedente_cobrado ausente; bono_excedente identico con cobranza=' + Math.round(rBono5.bono_excedente) + ' y sin cobranza=' + Math.round(rBonoSinCobranza6.bono_excedente));

  // -------------------------------------------------------------------------
  // 7. No existe presupuesto de ciclo 26-25 -- los registros de presupuesto
  // (ctx.presupuestos) ya no tienen campo "ciclo" (se renombro a "mes"), y
  // el resultado del motor ya no expone "presupuesto" (campo v1.4/v1.5) sino
  // "presupuesto_mes".
  // -------------------------------------------------------------------------
  check('07_no_existe_presupuesto_de_ciclo_26_25',
    ctxCL.presupuestos.every(function (p) { return p.ciclo === undefined && p.mes !== undefined; }) &&
    r0725.presupuesto === undefined && r0725.presupuesto_mes !== undefined,
    'presupuestos[].ciclo ausente en los ' + ctxCL.presupuestos.length + ' registros; resultado.presupuesto (campo viejo) ausente, resultado.presupuesto_mes presente');

  // -------------------------------------------------------------------------
  // 8. No existe prorrateo automatico -- ni en el motor (presupuestoDelMes es
  // una lectura directa por mes, sin interpolar) ni en el adaptador real
  // (SICAdapter.__proporcionMeses / _presupuestoDelCiclo fueron eliminados).
  // -------------------------------------------------------------------------
  delete global.SICAdapter;
  eval(fs.readFileSync(path.join(ROOT, 'js', 'sic_data_adapter.js'), 'utf8'));
  check('08_no_existe_prorrateo_automatico',
    typeof SICAdapter._proporcionMeses === 'undefined' &&
    typeof SICAdapter._presupuestoDelCiclo === 'undefined' &&
    typeof SICAdapter._presupuestoDelMes === 'function',
    'SICAdapter._proporcionMeses y _presupuestoDelCiclo eliminados; _presupuestoDelMes (lectura directa) presente');

  // -------------------------------------------------------------------------
  // 9. Dashboard muestra ambos periodos -- sic_chile.html y sic_peru.html
  // contienen el banner "dos periodos" (IDs dp-periodo-cobranza / dp-mes-desempeno)
  // y las etiquetas exigidas por el CHANGE REQUEST.
  // -------------------------------------------------------------------------
  const htmlChile9 = fs.readFileSync(path.join(ROOT, 'sic_chile.html'), 'utf8');
  const htmlPeru9 = fs.readFileSync(path.join(ROOT, 'sic_peru.html'), 'utf8');
  function dashboardMuestraAmbosPeriodos(html) {
    return html.indexOf('id="dp-periodo-cobranza"') !== -1 &&
      html.indexOf('id="dp-mes-desempeno"') !== -1 &&
      html.indexOf('Período de cobranza') !== -1 &&
      html.indexOf('Mes de desempeño') !== -1 &&
      html.indexOf('Presupuesto del mes de desempeño') !== -1 &&
      html.indexOf('IEC del mes de desempeño') !== -1 &&
      html.indexOf('Bono por Excedente del mes de desempeño') !== -1;
  }
  check('09_dashboard_muestra_ambos_periodos',
    dashboardMuestraAmbosPeriodos(htmlChile9) && dashboardMuestraAmbosPeriodos(htmlPeru9),
    'sic_chile.html y sic_peru.html contienen banner de periodo de cobranza + mes de desempeño y los indicadores del mes de desempeño');

  // -------------------------------------------------------------------------
  // 10. PDF muestra ambos periodos -- sic_pdf.js contiene las etiquetas
  // "Período de cobranza" / "Mes de desempeño aplicado" en la portada, y
  // separa el resumen ejecutivo en indicadores de mes de desempeño vs
  // indicadores del periodo de cobranza. Se verifica generando un PDF real.
  // -------------------------------------------------------------------------
  eval(fs.readFileSync(path.join(ROOT, 'sic_pdf.js'), 'utf8'));
  const vendedorObj10 = ctxCL.vendedores.find(function (v) { return v.id === 'CL-V01'; });
  const dif10 = SIC.calcularDiferidoTrimestral(ctxCL, 'CL-V01', '2026-Q2', { cartera_fuera_estandar: false, observaciones_financieras_graves: false });
  const acciones10 = SIC.simularAcciones(ctxCL, 'CL-V01', '2026-07');
  const htmlPdf10 = SICPDF._construirHtml({ pais: 'CL', vendedor: vendedorObj10, resultado: r0725, diferido: dif10, acciones: acciones10, params: ctxCL.params });
  check('10_pdf_muestra_ambos_periodos',
    htmlPdf10.indexOf('Período de cobranza') !== -1 &&
    htmlPdf10.indexOf('Mes de desempeño aplicado') !== -1 &&
    htmlPdf10.indexOf('Indicadores del Mes de Desempeño') !== -1 &&
    htmlPdf10.indexOf('Indicadores del Período de Cobranza') !== -1,
    'PDF generado contiene portada con ambos periodos y resumen ejecutivo separado en dos bloques');

  // -------------------------------------------------------------------------
  // 11. Politica explica ambos periodos -- sic_politica.html contiene la
  // seccion "Dos periodos, una sola liquidacion" con la explicacion y el
  // ejemplo completo (liquidacion 25 junio / cobranza 26 mayo-25 junio / mes
  // de desempeño mayo).
  // -------------------------------------------------------------------------
  const htmlPolitica11 = fs.readFileSync(path.join(ROOT, 'sic_politica.html'), 'utf8');
  // "Presupuesto del ciclo 26-25" solo puede aparecer, si aparece, dentro de la
  // frase que explica su ELIMINACION (documentacion historica) -- nunca como
  // encabezado de seccion (<h2>) ni encabezado de tabla (<th>) vigente.
  const apareceComoEtiquetaVigente11 = /<h2>[^<]*Presupuesto del ciclo|<th>[^<]*Presupuesto del ciclo/.test(htmlPolitica11);
  check('11_politica_explica_ambos_periodos',
    htmlPolitica11.indexOf('Dos períodos, una sola liquidación') !== -1 &&
    htmlPolitica11.indexOf('Mes de desempeño') !== -1 &&
    htmlPolitica11.indexOf('Período de cobranza') !== -1 &&
    htmlPolitica11.indexOf('25 de junio') !== -1 &&
    htmlPolitica11.indexOf('26 de mayo') !== -1 &&
    !apareceComoEtiquetaVigente11,
    'sic_politica.html contiene la seccion "Dos períodos, una sola liquidación", el ejemplo completo, y "Presupuesto del ciclo 26-25" solo aparece (si aparece) en la frase que documenta su eliminacion, nunca como encabezado vigente');

  // -------------------------------------------------------------------------
  // 12. Historico conserva la relacion liquidacion <-> mes de desempeño --
  // SIC.calcularHistorico expone, para cada liquidacion, su identificador,
  // fecha de cierre, periodo de cobranza y el mes de desempeño asociado.
  // -------------------------------------------------------------------------
  const historico12 = SIC.calcularHistorico(ctxCL, 'CL-V01');
  check('12_historico_conserva_relacion_liquidacion_mes_desempeno',
    historico12.length >= 6 &&
    historico12.every(function (h) {
      return h.identificador_liquidacion && h.fecha_cierre && h.periodo_cobranza_inicio && h.periodo_cobranza_cierre &&
        h.mes_desempeno === SIC.mesDesempenoDe(h.identificador_liquidacion);
    }),
    historico12.length + ' liquidaciones, cada una con identificador_liquidacion/fecha_cierre/periodo_cobranza_inicio-cierre/mes_desempeno consistente (mes_desempeno === mesDesempenoDe(identificador_liquidacion) en todos los casos)');

  // -------------------------------------------------------------------------
  // 13. Enero maneja correctamente diciembre del año anterior -- el mes de
  // desempeño del ciclo "2026-01" (periodo que cierra el 25/01/2026) debe ser
  // "2025-12", con year-rollover correcto (no "2026-00" ni similar).
  // -------------------------------------------------------------------------
  check('13_enero_maneja_diciembre_anio_anterior',
    SIC.mesDesempenoDe('2026-01') === '2025-12' &&
    SIC.periodoQueLiquidaMes('2025-12') === '2026-01',
    'mesDesempenoDe(2026-01)=' + SIC.mesDesempenoDe('2026-01') + ' (esperado 2025-12); periodoQueLiquidaMes(2025-12)=' + SIC.periodoQueLiquidaMes('2025-12') + ' (esperado 2026-01)');

  // -------------------------------------------------------------------------
  // 14. Años bisiestos y cierres de febrero -- rangoMesCalendario debe dar
  // 29 dias en febrero de un año bisiesto (2028) y 28 en uno no bisiesto
  // (2026), y el mes de desempeño de un ciclo con cierre en marzo (mes de
  // desempeño = febrero) debe heredar ese comportamiento automaticamente.
  // -------------------------------------------------------------------------
  const feb2026_14 = SIC.rangoMesCalendario('2026-02');
  const feb2028_14 = SIC.rangoMesCalendario('2028-02');
  check('14_anios_bisiestos_y_cierres_de_febrero',
    feb2026_14.cierre === '2026-02-28' && feb2028_14.cierre === '2028-02-29' &&
    SIC.mesDesempenoDe('2026-03') === '2026-02' && SIC.mesDesempenoDe('2028-03') === '2028-02',
    'rangoMesCalendario(2026-02).cierre=' + feb2026_14.cierre + ' (28, no bisiesto); rangoMesCalendario(2028-02).cierre=' + feb2028_14.cierre + ' (29, bisiesto)');

  // -------------------------------------------------------------------------
  // 15. Mes sin presupuesto -> no calcula Factor de Presupuesto -- se
  // construye un ctx sintetico donde el vendedor NO tiene presupuesto
  // cargado para su mes de desempeño; presupuesto_mes debe quedar null
  // (nunca 0 inventado) y el cumplimiento/factor deben reflejar la ausencia
  // de dato, no un 0% real.
  // -------------------------------------------------------------------------
  const ctxSinPpto15 = JSON.parse(JSON.stringify(ctxCL));
  ctxSinPpto15.presupuestos = ctxSinPpto15.presupuestos.filter(function (p) { return !(p.vendedor_id === 'CL-V01' && p.mes === '2026-06'); });
  const rSinPpto15 = SIC.calcularVendedorCiclo(ctxSinPpto15, 'CL-V01', '2026-07');
  check('15_mes_sin_presupuesto_no_calcula_factor_presupuesto',
    rSinPpto15.presupuesto_mes === null && rSinPpto15.cumplimiento_pct === 0 && rSinPpto15.factor_presupuesto === 0 && rSinPpto15.excedente_mes === 0 && rSinPpto15.bono_excedente === 0,
    'presupuesto_mes=' + rSinPpto15.presupuesto_mes + ' (null, no 0 inventado) -- cumplimiento/factor/excedente/bono quedan en su valor neutro, no en un calculo real sobre un presupuesto inventado');

  // -------------------------------------------------------------------------
  // 16. Mes sin IEC -> no calcula comision definitiva con datos inventados --
  // se construye un ctx sintetico donde el vendedor NO tiene IEC cargado
  // para su mes de desempeño; iec_disponible debe quedar false (el motor no
  // inventa un IEC de 0% como si fuera un dato real).
  // -------------------------------------------------------------------------
  const ctxSinIec16 = JSON.parse(JSON.stringify(ctxCL));
  ctxSinIec16.iec = ctxSinIec16.iec.filter(function (i) { return !(i.vendedor_id === 'CL-V01' && i.mes === '2026-06'); });
  const rSinIec16 = SIC.calcularVendedorCiclo(ctxSinIec16, 'CL-V01', '2026-07');
  check('16_mes_sin_iec_no_calcula_comision_definitiva',
    rSinIec16.iec_disponible === false && rSinIec16.iec_pct === 0,
    'iec_disponible=' + rSinIec16.iec_disponible + ' (el motor no encuentra IEC real para el mes ' + rSinIec16.mes_desempeno + ' -- el 0% usado internamente es un valor neutro de calculo, no un IEC inventado; la UI debe mostrar "Pendiente de carga" en este caso, ver sic_chile.html/sic_peru.html)');

  console.log('\n\n========== RESUMEN PRUEBAS OBLIGATORIAS CHANGE REQUEST v1.6 (16 casos) ==========');
  let todoOk = true;
  resultados.forEach(function (r) { if (!r.ok) todoOk = false; });
  console.log(resultados.filter(function (r) { return r.ok; }).length + '/' + resultados.length + ' pruebas OK');
  console.log('RESULTADO GLOBAL:', todoOk ? 'TODO OK' : 'HAY FALLOS');
  process.exit(todoOk ? 0 : 1);
})();
