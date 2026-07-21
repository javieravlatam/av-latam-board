/**
 * SIC-AV — Prueba de humo de la pagina de datos reales (sic_datos_reales.html)
 * =========================================================================================
 * CHANGE REQUEST SIC-AV v1.5 (Fase 3): a diferencia de run_adapter_tests.js (que corre en
 * Node contra fs.readFileSync), esta prueba renderiza sic_datos_reales.html en un DOM real
 * (jsdom) sirviendo los archivos por HTTP, para confirmar que:
 *   - la pagina carga sin sesion -> redirige (no expone datos sin autenticacion, reutilizando
 *     SICAuth.sesionActiva() SIN modificar sic_auth.js);
 *   - con sesion valida, hace fetch real de Panel_IEC_Auditoria_2026.html y avboard_data.js
 *     por HTTP (no por fs), arma un ciclo real y pinta los KPIs, la tabla de vendedores, el
 *     detalle por factura y las advertencias;
 *   - la conciliacion fuente-vs-adaptador coincide exactamente.
 *
 * Requisito: el servidor HTTP debe levantarse desde la RAIZ DEL REPOSITORIO (no desde
 * apps/sic_av/ como las demas paginas del prototipo), porque esta pagina necesita leer
 * Panel_IEC_Auditoria_2026.html y avboard_data.js, que viven dos niveles arriba de
 * apps/sic_av/. Ver README.md, seccion "Datos reales (v1.5)".
 *
 * Uso:
 *   cd <raiz-del-repo>
 *   python3 -m http.server 8123 &
 *   cd apps/sic_av
 *   node tests/run_datos_reales_ui_test.js
 */
const { JSDOM, VirtualConsole } = require('jsdom');
const BASE = 'http://localhost:8123/apps/sic_av/';

function vc() {
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', () => {});
  return virtualConsole;
}
function polyfills(window) {
  window.fetch = (url, opts) => fetch(new URL(url, window.location.href).href, opts);
}
async function cargar(sessionRaw) {
  const dom = await JSDOM.fromURL(BASE + 'sic_datos_reales.html', {
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

const resultados = [];
function check(nombre, condicion, detalle) {
  resultados.push({ nombre, ok: !!condicion, detalle: detalle || '' });
  console.log((condicion ? 'OK  ' : 'FAIL') + ' - ' + nombre + (detalle ? '  (' + detalle + ')' : ''));
}

(async () => {
  // Sin sesion: la pagina debe redirigir (window.location.href = index.html),
  // reutilizando SICAuth.sesionActiva() sin modificar sic_auth.js.
  const domSinSesion = await cargar(null);
  check('sin_sesion_no_expone_datos',
    !domSinSesion.window.document.getElementById('c-facturada') ||
    domSinSesion.window.document.getElementById('c-facturada').textContent === '—',
    'sin sesion, los KPIs no deben quedar poblados con datos reales');

  // Con sesion CL valida: debe cargar fuentes reales por HTTP y pintar el ciclo mas reciente.
  const dom = await cargar(JSON.stringify({ pais: 'CL', inicio: new Date().toISOString() }));
  const doc = dom.window.document;

  const hdrCiclo = doc.getElementById('hdr-ciclo').textContent;
  check('carga_ciclo_real_chile', hdrCiclo !== '—' && /^\d{4}-\d{2}/.test(hdrCiclo), 'hdr-ciclo=' + hdrCiclo);

  const facturada = doc.getElementById('c-facturada').textContent;
  check('kpi_venta_facturada_poblado', facturada.indexOf('CLP') !== -1 && facturada !== 'CLP 0', 'c-facturada=' + facturada);

  const reconBadge = doc.getElementById('recon-badge').textContent;
  const reconFuente = doc.getElementById('recon-fuente').textContent;
  const reconAdaptador = doc.getElementById('recon-adaptador').textContent;
  check('conciliacion_fuente_vs_adaptador_coincide',
    reconBadge.indexOf('Coincide exactamente') !== -1 && reconFuente === reconAdaptador,
    'badge=' + reconBadge + ' fuente=' + reconFuente + ' adaptador=' + reconAdaptador);

  const filasVendedores = doc.querySelectorAll('#tbody-vendedores tr').length;
  check('tabla_vendedores_poblada', filasVendedores > 0, 'filas=' + filasVendedores);

  const filasFacturas = doc.querySelectorAll('#tbody-facturas-real tr').length;
  check('tabla_facturas_poblada', filasFacturas > 0, 'filas=' + filasFacturas);

  const advertenciasBadge = doc.getElementById('advertencias-total-badge').textContent;
  check('advertencias_visibles_no_silenciosas', /^\d+ advertencia/.test(advertenciasBadge), advertenciasBadge);

  const opcionesCiclo = Array.from(doc.getElementById('sel-ciclo-real').options).map(o => o.value);
  check('selector_ciclo_dentro_del_rango_de_politica',
    opcionesCiclo.length > 0 && opcionesCiclo.every(c => c >= '2026-02' && c <= '2026-07'),
    'ciclos=' + opcionesCiclo.join(','));

  // Fase 4 (v1.5): Bloque 1 (datos reales validados) y Bloque 2 (estado del
  // calculo de comisiones) deben estar claramente separados -- Bloque 2 no
  // debe mostrar una cifra de comision como si fuera un resultado comercial.
  const bloque1 = doc.body.innerHTML.indexOf('Datos reales validados') !== -1;
  const bloque2 = doc.body.innerHTML.indexOf('Estado del cálculo de comisiones') !== -1;
  check('bloques_1_y_2_presentes_y_separados', bloque1 && bloque2, 'bloque1=' + bloque1 + ' bloque2=' + bloque2);

  const mensajePendiente = doc.querySelector('.estado-comision-titulo');
  check('mensaje_calculo_pendiente_visible',
    !!mensajePendiente && mensajePendiente.textContent.indexOf('pendiente de integración de cobranza real') !== -1,
    'texto=' + (mensajePendiente ? mensajePendiente.textContent : 'N/A'));

  // El Bloque 1 debe traer precio piso y # de facturas/vendedores como dato validado.
  const piso = doc.getElementById('c-piso').textContent;
  const nFacturas = doc.getElementById('c-n-facturas').textContent;
  check('bloque1_precio_piso_y_conteos_poblados',
    piso !== '—' && nFacturas !== '—' && Number(nFacturas) > 0,
    'piso=' + piso + ' n-facturas=' + nFacturas);

  // La cifra tecnica queda en una nota de auditoria dentro del Bloque 2, nunca
  // como una tarjeta de KPI de comision. CHANGE REQUEST v1.6: el Factor de
  // Presupuesto ahora se calcula sobre venta NETA del mes de desempeño (no
  // sobre venta COBRADA) -- por lo tanto la comision POTENCIAL ya puede ser
  // distinta de 0 aunque la cobranza real siga en 0 (es el comportamiento
  // correcto y esperado de la formula v1.6: potencial refleja desempeño de
  // venta/presupuesto/IEC, liberada sigue exigiendo cobranza real). Lo que se
  // verifica aqui es que la comision LIBERADA (que si depende de venta
  // cobrada = 0) se mantiene en 0, y que ya no existen las tarjetas antiguas
  // c-potencial/c-liberada como KPI de Bloque 1.
  const potencialTecnico = doc.getElementById('c-potencial-tecnico').textContent;
  const liberadaTecnico = doc.getElementById('c-liberada-tecnico').textContent;
  const tarjetasAntiguasEliminadas = !doc.getElementById('c-potencial') && !doc.getElementById('c-liberada');
  check('nota_tecnica_liberada_en_cero_sin_tarjeta_de_kpi',
    /\s0([.,]0+)?$/.test(liberadaTecnico) && tarjetasAntiguasEliminadas,
    'potencial_tecnico=' + potencialTecnico + ' (ya no necesariamente 0 -- v1.6, ver Factor de Presupuesto) liberada_tecnico=' + liberadaTecnico + ' tarjetas_antiguas_eliminadas=' + tarjetasAntiguasEliminadas);

  // La tabla de vendedores no debe mostrar montos de comision -- solo un estado.
  const primeraFilaVendedor = doc.querySelector('#tbody-vendedores tr');
  const muestraPendienteCobranza = primeraFilaVendedor && primeraFilaVendedor.textContent.indexOf('Pendiente de cobranza') !== -1;
  check('tabla_vendedores_sin_monto_comision', !!muestraPendienteCobranza, 'fila=' + (primeraFilaVendedor ? primeraFilaVendedor.textContent.trim().slice(0, 120) : 'N/A'));

  console.log('\n\n========== RESUMEN PRUEBA UI DATOS REALES ==========');
  let todoOk = true;
  resultados.forEach(r => { if (!r.ok) todoOk = false; });
  console.log(resultados.filter(r => r.ok).length + '/' + resultados.length + ' pruebas OK');
  console.log('RESULTADO GLOBAL:', todoOk ? 'TODO OK' : 'HAY FALLOS');
  process.exit(todoOk ? 0 : 1);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
