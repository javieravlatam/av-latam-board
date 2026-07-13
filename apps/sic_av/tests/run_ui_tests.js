const { JSDOM, VirtualConsole } = require('jsdom');
// CORRECCION v1.6: el servidor ahora debe levantarse desde la RAIZ DEL
// REPOSITORIO (no desde apps/sic_av/), porque sic_chile.html/sic_peru.html
// tambien hacen fetch real de Panel_IEC_Auditoria_2026.html y avboard_data.js,
// que viven dos niveles arriba de apps/sic_av/ -- mismo requisito ya
// documentado para run_datos_reales_ui_test.js y run_dashboard_real_test.js.
// Ver README.md, seccion 3b.
const BASE = 'http://localhost:8123/apps/sic_av/';

/**
 * NOTA (CORRECCION SIC AV v1.6 -- "publicado sin data real"): las pruebas de
 * CONTENIDO del dashboard (tarjetas de comision demo, filtro de estado,
 * historico de 6 ciclos fijos, PDF via SICPDF._construirHtml, seleccion de
 * ciclo con "Vigente"/"Cerrado" sobre datos SINTETICOS, etc.) que vivian aqui
 * se RETIRARON porque sic_chile.html / sic_peru.html ya no cargan datos demo
 * -- cargan datos reales via SICAdapter (ver js/sic_data_adapter.js). Esas
 * aserciones asumian una estructura que dejo de existir a proposito. La
 * cobertura de CONTENIDO real (tarjetas Bloque 1/2, conciliacion, estados
 * "Pendiente de carga/integracion/calculo", aislamiento por pais, ausencia de
 * datos demo) esta en tests/run_dashboard_real_test.js. Este archivo sigue
 * cubriendo lo que NO cambio: el guard de autenticacion (sic_auth.js, sin
 * modificar) y la pagina Politica y Factores (sic_politica.html, sin tocar).
 */

function vc() {
  const virtualConsole = new VirtualConsole();
  // Silenciar "Not implemented: navigation" y errores de red esperados sin ensuciar la salida.
  virtualConsole.on('jsdomError', () => {});
  return virtualConsole;
}

function polyfills(window) {
  // jsdom no inyecta fetch en window; usamos el fetch nativo de Node, resolviendo
  // rutas relativas contra window.location (el fetch nativo de Node exige URL absoluta).
  window.fetch = (url, opts) => fetch(new URL(url, window.location.href).href, opts);
  if (!window.URL.createObjectURL) window.URL.createObjectURL = () => 'blob:mock-url';
  if (!window.URL.revokeObjectURL) window.URL.revokeObjectURL = () => {};
}

async function cargar(pathFile, sessionRaw) {
  const dom = await JSDOM.fromURL(BASE + pathFile, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc(),
    beforeParse(window) {
      polyfills(window);
      if (sessionRaw) window.sessionStorage.setItem('sic_av_session', sessionRaw);
    }
  });
  await new Promise(r => setTimeout(r, 800));
  return dom;
}

async function testAccesoCorrecto(pais, clave) {
  console.log('\n=== Acceso correcto ' + pais + ' (clave "' + clave + '") ===');
  const dom = await cargar('index.html');
  const win = dom.window, doc = win.document;
  doc.getElementById(pais === 'CL' ? 'clave-cl' : 'clave-pe').value = clave;
  win.intentarAcceso(pais);
  await new Promise(r => setTimeout(r, 100));
  const sesion = JSON.parse(win.sessionStorage.getItem('sic_av_session') || 'null');
  console.log('Sesion creada:', sesion);
  const ok = !!(sesion && sesion.pais === pais);
  console.log(ok ? 'OK' : 'FALLO');
  return ok;
}

async function crearSesion(pais, clave) {
  const dom = await cargar('index.html');
  dom.window.document.getElementById(pais === 'CL' ? 'clave-cl' : 'clave-pe').value = clave;
  dom.window.intentarAcceso(pais);
  await new Promise(r => setTimeout(r, 100));
  return dom.window.sessionStorage.getItem('sic_av_session');
}

async function testClaveIncorrecta() {
  console.log('\n=== Clave incorrecta ===');
  const dom = await cargar('index.html');
  const win = dom.window, doc = win.document;
  doc.getElementById('clave-cl').value = 'clave-mala-cualquiera';
  win.intentarAcceso('CL');
  const err = doc.getElementById('error-cl').textContent;
  const sesion = win.sessionStorage.getItem('sic_av_session');
  console.log('Error mostrado:', JSON.stringify(err), '| Sesion (debe ser null):', sesion);
  const ok = err.length > 0 && sesion === null;
  console.log(ok ? 'OK' : 'FALLO');
  return ok;
}

async function testAislamientoPais() {
  console.log('\n=== Aislamiento por pais (clave valida de Peru usada en el campo de Chile) ===');
  const dom = await cargar('index.html');
  const win = dom.window, doc = win.document;
  doc.getElementById('clave-cl').value = 'peru26';
  win.intentarAcceso('CL');
  const err = doc.getElementById('error-cl').textContent;
  const sesion = win.sessionStorage.getItem('sic_av_session');
  console.log('Error mostrado:', JSON.stringify(err), '| Sesion (debe ser null):', sesion);
  const ok = sesion === null && err.length > 0;
  console.log(ok ? 'OK' : 'FALLO');
  return ok;
}

async function testAccesoSinAuth(archivo) {
  console.log('\n=== Acceso directo a ' + archivo + ' sin sesion previa (el guard no debe inicializar el dashboard) ===');
  const dom = await cargar(archivo); // sin sessionRaw -> sin sesion
  const win = dom.window, doc = win.document;
  const sesionActiva = win.SICAuth.sesionActiva();
  const vendedorTxt = doc.getElementById('hdr-vendedor') ? doc.getElementById('hdr-vendedor').textContent : null;
  const filasTabla = doc.querySelectorAll('#tbody-facturas tr').length;
  console.log('sesionActiva():', sesionActiva, '| hdr-vendedor:', vendedorTxt, '| filas tabla:', filasTabla);
  const ok = sesionActiva === null && vendedorTxt === '—' && filasTabla === 0;
  console.log(ok ? 'OK' : 'FALLO');
  return ok;
}

// =============================================================================
// CHANGE REQUEST SIC-AV v1.3 -- PAGINA "POLITICA Y FACTORES" (sin cambios)
// =============================================================================
async function testCargaPaginaPolitica(sessionRaw, etiquetaPais) {
  console.log('\n=== Carga de la pagina Politica y Factores (' + etiquetaPais + ') ===');
  const dom = await cargar('sic_politica.html', sessionRaw);
  const win = dom.window, doc = win.document;

  const sesionActiva = win.SICAuth.sesionActiva();
  const filasPresupuesto = doc.querySelectorAll('#tbody-presupuesto tr').length;
  const filasIec = doc.querySelectorAll('#tbody-iec tr').length;
  const filasDiferido = doc.querySelectorAll('#tbody-diferido tr').length;
  const filasCartera = doc.querySelectorAll('#tbody-cartera tr').length;
  const version = doc.getElementById('hdr-version').textContent;
  const estadoPolitica = doc.getElementById('hdr-estado-politica').textContent;
  const bonoEjBono = doc.getElementById('bono-ej-bono').textContent;

  console.log('sesionActiva():', sesionActiva && sesionActiva.pais);
  console.log('Filas presupuesto:', filasPresupuesto, '| Filas IEC:', filasIec, '| Filas diferido:', filasDiferido, '| Filas cartera:', filasCartera);
  console.log('Version de politica:', version, '| Estado:', estadoPolitica, '| Ejemplo bono excedente:', bonoEjBono);

  const ok = !!sesionActiva && filasPresupuesto === 3 && filasIec === 5 && filasDiferido >= 1 &&
    filasCartera === 6 && version.length > 1 && version !== '—' && estadoPolitica.length > 1 && estadoPolitica !== '—' &&
    bonoEjBono.indexOf('400') !== -1;
  console.log(ok ? 'OK' : 'FALLO');
  return { ok, dom };
}

async function testAislamientoPaisPolitica(domCL, domPE) {
  console.log('\n=== Aislamiento por pais en Politica y Factores (cada pais solo su propia tabla de cartera) ===');
  const htmlCartCL = domCL.window.document.getElementById('tbody-cartera').innerHTML;
  const htmlCartPE = domPE.window.document.getElementById('tbody-cartera').innerHTML;
  const tituloCL = domCL.window.document.getElementById('cartera-pais-titulo').textContent;
  const tituloPE = domPE.window.document.getElementById('cartera-pais-titulo').textContent;

  console.log('Titulo tabla cartera CL:', tituloCL, '| Titulo tabla cartera PE:', tituloPE);

  const clTieneSusTramos = htmlCartCL.indexOf('31-180 dias') !== -1 && htmlCartCL.indexOf('181-210 dias') !== -1 && htmlCartCL.indexOf('211-360 dias') !== -1;
  const clNoTienePeru = htmlCartCL.indexOf('31-60 dias') === -1 && htmlCartCL.indexOf('61-120 dias') === -1 && htmlCartCL.indexOf('121-180 dias') === -1;
  const peTieneSusTramos = htmlCartPE.indexOf('31-60 dias') !== -1 && htmlCartPE.indexOf('61-120 dias') !== -1 && htmlCartPE.indexOf('121-180 dias') !== -1;
  const peNoTieneChile = htmlCartPE.indexOf('31-180 dias') === -1 && htmlCartPE.indexOf('181-210 dias') === -1 && htmlCartPE.indexOf('211-360 dias') === -1;

  console.log('CL muestra solo sus tramos:', clTieneSusTramos, clNoTienePeru, '| PE muestra solo sus tramos:', peTieneSusTramos, peNoTieneChile);

  const ok = tituloCL === 'Chile' && tituloPE === 'Peru' && clTieneSusTramos && clNoTienePeru && peTieneSusTramos && peNoTieneChile;
  console.log(ok ? 'OK' : 'FALLO');
  return ok;
}

(async () => {
  const resultados = {};
  resultados.acceso_chile = await testAccesoCorrecto('CL', 'chile26');
  resultados.acceso_peru = await testAccesoCorrecto('PE', 'peru26');
  resultados.clave_incorrecta = await testClaveIncorrecta();
  resultados.aislamiento_pais = await testAislamientoPais();
  resultados.sin_auth_chile = await testAccesoSinAuth('sic_chile.html');
  resultados.sin_auth_peru = await testAccesoSinAuth('sic_peru.html');

  // CHANGE REQUEST SIC-AV v1.3 -- pagina "Politica y Factores"
  const sessionCL = await crearSesion('CL', 'chile26');
  const sessionPE = await crearSesion('PE', 'peru26');
  const rPolCL = await testCargaPaginaPolitica(sessionCL, 'Chile');
  resultados.carga_politica_chile = rPolCL.ok;
  const rPolPE = await testCargaPaginaPolitica(sessionPE, 'Peru');
  resultados.carga_politica_peru = rPolPE.ok;
  resultados.aislamiento_politica_por_pais = await testAislamientoPaisPolitica(rPolCL.dom, rPolPE.dom);

  console.log('\n\n========== RESUMEN ==========');
  let todoOk = true;
  Object.keys(resultados).forEach(k => {
    console.log((resultados[k] ? 'OK  ' : 'FAIL') + ' - ' + k);
    if (!resultados[k]) todoOk = false;
  });
  console.log('\nRESULTADO GLOBAL:', todoOk ? 'TODO OK' : 'HAY FALLOS');
  process.exit(todoOk ? 0 : 1);
})();
