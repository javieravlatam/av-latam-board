/**
 * SIC-AV — Prueba de humo del FLUJO PRINCIPAL con datos reales
 * =========================================================================================
 * CORRECCION PRIORITARIA (v1.6): sic_chile.html / sic_peru.html dejaron de cargar datos
 * demostrativos -- ahora cargan datos reales del AV LATAM Board via SICAdapter (mismo
 * patron ya probado en sic_datos_reales.html). Esta prueba confirma, sirviendo los
 * archivos por HTTP (jsdom + fetch real), que:
 *   - el flujo Portal -> SIC AV -> pais -> dashboard llega a datos reales (no demo);
 *   - Chile ve datos reales de Chile, Peru ve datos reales de Peru (aislamiento);
 *   - los campos sin fuente real muestran los textos de estado exigidos ("Pendiente de
 *     carga" / "Pendiente de integracion" / "Pendiente de calculo"), nunca $0 ni datos
 *     inventados;
 *   - no quedan tarjetas de comision ($0) mostradas como resultado definitivo;
 *   - cambiar de vendedor/ciclo re-renderiza con datos reales distintos;
 *   - CSV exporta sin lanzar error.
 *
 * Requisito: servidor HTTP levantado desde la RAIZ DEL REPOSITORIO (igual que
 * run_datos_reales_ui_test.js), porque sic_chile.html/sic_peru.html ahora tambien
 * hacen fetch de Panel_IEC_Auditoria_2026.html y avboard_data.js.
 *
 * Uso:
 *   cd <raiz-del-repo>
 *   python3 -m http.server 8123 &
 *   cd apps/sic_av
 *   node tests/run_dashboard_real_test.js
 */
const { JSDOM, VirtualConsole } = require('jsdom');
const BASE = 'http://localhost:8123/apps/sic_av/';

const erroresConsola = [];
function vc() {
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (err) => {
    const msg = String(err && err.message || err);
    // Benignos y ya documentados: bloqueo CORS de fuentes/fonts y el intento
    // de navegacion real de jsdom (window.location.href = ...), que no
    // implementa navegacion mientras runScripts:'dangerously' esta activo.
    if (msg.indexOf('Not implemented: navigation') !== -1) return;
    if (msg.indexOf('Could not load font') !== -1) return;
    erroresConsola.push(msg);
  });
  return virtualConsole;
}
function polyfills(window) {
  window.fetch = (url, opts) => fetch(new URL(url, window.location.href).href, opts);
  if (!window.URL.createObjectURL) window.URL.createObjectURL = () => 'blob:mock-url';
  if (!window.URL.revokeObjectURL) window.URL.revokeObjectURL = () => {};
}
async function cargar(archivo, sessionRaw) {
  const dom = await JSDOM.fromURL(BASE + archivo, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc(),
    beforeParse(window) {
      polyfills(window);
      if (sessionRaw) window.sessionStorage.setItem('sic_av_session', sessionRaw);
    }
  });
  await new Promise(r => setTimeout(r, 2500));
  return dom;
}
async function crearSesion(pais, clave) {
  const dom = await cargar('index.html');
  dom.window.document.getElementById(pais === 'CL' ? 'clave-cl' : 'clave-pe').value = clave;
  dom.window.intentarAcceso(pais);
  await new Promise(r => setTimeout(r, 100));
  return dom.window.sessionStorage.getItem('sic_av_session');
}

const resultados = [];
function check(nombre, condicion, detalle) {
  resultados.push({ nombre, ok: !!condicion, detalle: detalle || '' });
  console.log((condicion ? 'OK  ' : 'FAIL') + ' - ' + nombre + (detalle ? '  (' + detalle + ')' : ''));
}

(async () => {
  const sessionCL = await crearSesion('CL', 'chile26');
  const sessionPE = await crearSesion('PE', 'peru26');

  const domCL = await cargar('sic_chile.html', sessionCL);
  const docCL = domCL.window.document;
  const domPE = await cargar('sic_peru.html', sessionPE);
  const docPE = domPE.window.document;

  // -- Sin datos demo/sinteticos en ningun lado del documento --
  const textoCL = docCL.body.innerHTML;
  const textoPE = docPE.body.innerHTML;
  check('sin_banner_demo_chile', textoCL.indexOf('MODELO DEMOSTRATIVO') === -1 && textoCL.indexOf('Datos sinteticos') === -1, 'banner=' + docCL.querySelector('.sic-demo-banner').textContent.slice(0, 60));
  check('sin_banner_demo_peru', textoPE.indexOf('MODELO DEMOSTRATIVO') === -1 && textoPE.indexOf('Datos sinteticos') === -1, 'banner=' + docPE.querySelector('.sic-demo-banner').textContent.slice(0, 60));

  // -- Vendedor y ciclo reales cargados (no '—') --
  const vendedorCL = docCL.getElementById('hdr-vendedor').textContent;
  const vendedorPE = docPE.getElementById('hdr-vendedor').textContent;
  check('vendedor_real_chile', vendedorCL !== '—' && vendedorCL.length > 1, 'hdr-vendedor=' + vendedorCL);
  check('vendedor_real_peru', vendedorPE !== '—' && vendedorPE.length > 1, 'hdr-vendedor=' + vendedorPE);

  const cicloCL = docCL.getElementById('hdr-ciclo').textContent;
  const cicloPE = docPE.getElementById('hdr-ciclo').textContent;
  check('ciclo_real_chile', /^\w+ \d{4}/.test(cicloCL), 'hdr-ciclo=' + cicloCL);
  check('ciclo_real_peru', /^\w+ \d{4}/.test(cicloPE), 'hdr-ciclo=' + cicloPE);

  // -- Aislamiento por pais: el vendedor de un pais no debe ser un vendedor del otro pais --
  const opcionesVendCL = Array.from(docCL.getElementById('sel-vendedor').options).map(o => o.textContent);
  const opcionesVendPE = Array.from(docPE.getElementById('sel-vendedor').options).map(o => o.textContent);
  const sinSolapeVendedores = opcionesVendCL.every(v => opcionesVendPE.indexOf(v) === -1);
  check('aislamiento_vendedores_por_pais', sinSolapeVendedores, 'CL=' + opcionesVendCL.join('|') + ' PE=' + opcionesVendPE.join('|'));

  // -- Moneda correcta por pais (CLP en Chile, USD en Peru) --
  const facturadaCL = docCL.getElementById('c-facturada').textContent;
  const facturadaPE = docPE.getElementById('c-facturada').textContent;
  check('venta_facturada_moneda_chile', facturadaCL.indexOf('CLP') !== -1, 'c-facturada=' + facturadaCL);
  check('venta_facturada_moneda_peru', facturadaPE.indexOf('USD') !== -1, 'c-facturada=' + facturadaPE);

  // -- Nunca $0 disfrazado de venta facturada real (si hay ventas, debe ser > 0) --
  check('venta_facturada_no_es_cero_chile', facturadaCL !== 'CLP 0', 'c-facturada=' + facturadaCL);
  check('venta_facturada_no_es_cero_peru', facturadaPE.indexOf('USD 0.00') === -1, 'c-facturada=' + facturadaPE);

  // -- Bloque 2 fijo: nunca una tarjeta de comision como KPI de Bloque 1, y el
  // texto exacto de estados pendientes debe estar presente --
  const yaNoHayTarjetasComisionCL = !docCL.getElementById('c-potencial') && !docCL.getElementById('c-liberada');
  const yaNoHayTarjetasComisionPE = !docPE.getElementById('c-potencial') && !docPE.getElementById('c-liberada');
  check('sin_tarjetas_comision_kpi_chile', yaNoHayTarjetasComisionCL);
  check('sin_tarjetas_comision_kpi_peru', yaNoHayTarjetasComisionPE);

  const mensajeBloque2CL = docCL.querySelector('.estado-comision-titulo').textContent;
  check('mensaje_calculo_pendiente_chile', mensajeBloque2CL.indexOf('pendiente de integración de cobranza real') !== -1, mensajeBloque2CL);

  check('texto_cobranza_pendiente_integracion_chile', textoCL.indexOf('Pendiente de integración') !== -1);
  check('texto_comision_pendiente_calculo_chile', textoCL.indexOf('Pendiente de cálculo') !== -1);
  check('texto_cobranza_pendiente_integracion_peru', textoPE.indexOf('Pendiente de integración') !== -1);
  check('texto_comision_pendiente_calculo_peru', textoPE.indexOf('Pendiente de cálculo') !== -1);

  // -- Historico sin columnas de comision (solo venta/presupuesto/cumplimiento/IEC) --
  const theadHistoricoCL = docCL.querySelector('.sic-historico thead').textContent;
  check('historico_sin_columnas_comision_chile',
    theadHistoricoCL.indexOf('Comision potencial') === -1 && theadHistoricoCL.indexOf('Comision liberada') === -1 && theadHistoricoCL.indexOf('Comision pagada') === -1,
    theadHistoricoCL.trim());

  // -- Tabla de facturas: filas presentes y ninguna con monto de comision (columna eliminada) --
  const filasFacturasCL = docCL.querySelectorAll('#tbody-facturas tr').length;
  const theadFacturasCL = docCL.querySelector('#tabla-facturas thead').textContent;
  check('tabla_facturas_poblada_chile', filasFacturasCL > 0, 'filas=' + filasFacturasCL);
  check('tabla_facturas_sin_columna_comision_chile', theadFacturasCL.indexOf('Comision') === -1, theadFacturasCL.trim());

  // -- Cambio de vendedor re-renderiza con datos distintos (si hay >= 2 vendedores) --
  if (opcionesVendCL.length >= 2) {
    const sel = docCL.getElementById('sel-vendedor');
    const antes = docCL.getElementById('c-facturada').textContent;
    sel.value = Array.from(sel.options).filter(o => o.textContent !== vendedorCL)[0].value;
    domCL.window.cambiarVendedor();
    const despues = docCL.getElementById('c-facturada').textContent;
    check('cambio_de_vendedor_actualiza_datos_chile', antes !== despues || docCL.getElementById('hdr-vendedor').textContent !== vendedorCL, 'antes=' + antes + ' despues=' + despues);
  } else {
    check('cambio_de_vendedor_actualiza_datos_chile', true, 'solo 1 vendedor disponible en el ciclo -- no aplica');
  }

  // -- CSV exporta sin lanzar error --
  let csvOk = true;
  try { domCL.window.exportarCSV(); } catch (e) { csvOk = false; console.log('exportarCSV lanzo error:', e.message); }
  check('exportar_csv_sin_error_chile', csvOk);

  // -- Sin errores de consola inesperados en ninguna de las dos cargas --
  check('cero_errores_consola_inesperados', erroresConsola.length === 0, erroresConsola.join(' | '));

  console.log('\n\n========== RESUMEN PRUEBA DASHBOARD REAL (sic_chile.html / sic_peru.html) ==========');
  let todoOk = true;
  resultados.forEach(r => { if (!r.ok) todoOk = false; });
  console.log(resultados.filter(r => r.ok).length + '/' + resultados.length + ' pruebas OK');
  console.log('RESULTADO GLOBAL:', todoOk ? 'TODO OK' : 'HAY FALLOS');
  process.exit(todoOk ? 0 : 1);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
