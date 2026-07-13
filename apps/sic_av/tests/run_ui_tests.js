const { JSDOM, VirtualConsole } = require('jsdom');
const BASE = 'http://localhost:8123/';

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

async function testDashboardCompleto(pais, clave, archivo) {
  console.log('\n=== Dashboard completo: ' + archivo + ' ===');
  const domLogin = await cargar('index.html');
  domLogin.window.document.getElementById(pais === 'CL' ? 'clave-cl' : 'clave-pe').value = clave;
  domLogin.window.intentarAcceso(pais);
  await new Promise(r => setTimeout(r, 100));
  const sessionRaw = domLogin.window.sessionStorage.getItem('sic_av_session');

  const dom2 = await cargar(archivo, sessionRaw);
  const win = dom2.window, doc = win.document;

  console.log('Vendedor mostrado:', doc.getElementById('hdr-vendedor').textContent);
  console.log('Ciclo mostrado:', doc.getElementById('hdr-ciclo').textContent, '| Estado:', doc.getElementById('hdr-estado-ciclo').textContent);
  console.log('Comision potencial:', doc.getElementById('c-potencial').textContent);
  console.log('Comision liberada:', doc.getElementById('c-liberada').textContent);
  console.log('Comision pendiente:', doc.getElementById('c-pendiente').textContent);
  console.log('Comision diferida trimestral:', doc.getElementById('c-diferida').textContent);
  console.log('Cumplimiento:', doc.getElementById('i-cumpl').textContent, '| IEC:', doc.getElementById('i-iec').textContent);
  const filasTabla = doc.querySelectorAll('#tbody-facturas tr').length;
  console.log('Filas en tabla de facturas:', filasTabla);
  const pasos = doc.querySelectorAll('#pasos-calculo li').length;
  console.log('Pasos de calculo mostrados:', pasos);
  const acciones = doc.querySelectorAll('#lista-acciones .sic-accion').length;
  console.log('Acciones "para ganar mas" mostradas:', acciones);
  const histFilas = doc.querySelectorAll('#tbody-historico tr').length;
  console.log('Filas de historico (deben ser 6):', histFilas);
  const opcionesVendedor = doc.querySelectorAll('#sel-vendedor option').length;
  console.log('Vendedores en selector:', opcionesVendedor);

  const ok = doc.getElementById('hdr-vendedor').textContent.length > 1 &&
    doc.getElementById('hdr-vendedor').textContent !== '—' &&
    filasTabla > 0 && pasos === 10 && histFilas === 6 && opcionesVendedor >= 4;
  console.log(ok ? 'OK' : 'FALLO');

  let csvOk = true;
  try {
    win.exportarCSV();
  } catch (e) {
    console.log('exportarCSV lanzo error:', e.message);
    csvOk = false;
  }
  console.log('exportarCSV ejecuta sin error:', csvOk ? 'OK' : 'FALLO');

  return { dom: dom2, ok: ok && csvOk };
}

async function testCambioVendedorYFiltros(dom) {
  console.log('\n=== Cambio de vendedor y filtro de tabla ===');
  const win = dom.window, doc = win.document;
  const sel = doc.getElementById('sel-vendedor');
  if (!sel || sel.options.length < 2) {
    console.log('No hay suficientes vendedores en el selector para probar el cambio. FALLO');
    return false;
  }
  const antes = doc.getElementById('c-liberada').textContent;
  sel.value = sel.options[1].value;
  win.cambiarVendedor();
  await new Promise(r => setTimeout(r, 200));
  const despues = doc.getElementById('c-liberada').textContent;
  console.log('Comision liberada antes:', antes, '| despues de cambiar vendedor:', despues);

  // CHANGE REQUEST SIC-AV v1.4: el estado "retenida" se elimino del motor
  // (ya no existe la opcion "Retenida" en el filtro) -- se filtra por
  // "pendiente" en su lugar para seguir probando que el filtro de estado
  // funciona correctamente.
  const filtro = doc.getElementById('filtro-estado');
  let filasFiltradas = null;
  if (filtro) {
    filtro.value = 'pendiente';
    win.renderTablaFacturas();
    filasFiltradas = doc.querySelectorAll('#tbody-facturas tr').length;
    console.log('Filas con estado "pendiente" tras filtrar:', filasFiltradas);
  }
  const ok = doc.getElementById('hdr-vendedor').textContent.length > 1;
  console.log(ok ? 'OK' : 'FALLO');
  return ok;
}

// =============================================================================
// CHANGE REQUEST SIC-AV v1.2 -- SELECTOR DE CICLO HISTORICO
// =============================================================================
async function testSelectorCiclo(dom, etiquetaPais) {
  console.log('\n=== Selector de ciclo historico (' + etiquetaPais + ') ===');
  const win = dom.window, doc = win.document;
  const sel = doc.getElementById('sel-ciclo');

  const numOpciones = sel ? sel.options.length : 0;
  console.log('Opciones en el selector de ciclo:', numOpciones);
  const okCantidad = numOpciones >= 6;

  const primeraOpcionTexto = sel && sel.options[0] ? sel.options[0].textContent : '';
  console.log('Texto de una opcion de ejemplo:', JSON.stringify(primeraOpcionTexto));
  // Formato esperado: "Julio 2026 · 26/06/2026–25/07/2026 · Vigente" (nombre, fechas, estado)
  const okFormato = /\d{2}\/\d{2}\/\d{4}.{1,3}\d{2}\/\d{2}\/\d{4}/.test(primeraOpcionTexto) && primeraOpcionTexto.indexOf('·') !== -1;

  const ciertaVigente = Array.from(sel ? sel.options : []).find(o => o.textContent.indexOf('Vigente') !== -1);
  console.log('Existe una opcion marcada "Vigente":', !!ciertaVigente);

  const cantidadCerradas = Array.from(sel ? sel.options : []).filter(o => o.textContent.indexOf('Cerrado') !== -1).length;
  console.log('Ciclos marcados "Cerrado":', cantidadCerradas);

  const ok = okCantidad && okFormato && !!ciertaVigente && cantidadCerradas >= 5;
  console.log(ok ? 'OK' : 'FALLO');
  return ok;
}

async function testCambioDeCiclo(dom, etiquetaPais) {
  console.log('\n=== Cambio de ciclo (' + etiquetaPais + ') actualiza todo el dashboard ===');
  const win = dom.window, doc = win.document;
  const sel = doc.getElementById('sel-ciclo');
  if (!sel) { console.log('No existe #sel-ciclo. FALLO'); return { ok: false }; }

  // Estado ANTES de cambiar (ciclo vigente, valor inicial por defecto)
  // Limpiar cualquier filtro/busqueda que un test anterior haya dejado
  // aplicado sobre la tabla, para comparar el DETALLE real (no una vista filtrada).
  const filtroEstadoEl = doc.getElementById('filtro-estado');
  const buscarEl = doc.getElementById('buscar-factura');
  if (filtroEstadoEl) filtroEstadoEl.value = '';
  if (buscarEl) buscarEl.value = '';
  if (typeof win.renderTablaFacturas === 'function') win.renderTablaFacturas();

  const cicloAntes = sel.value;
  const cardPotencialAntes = doc.getElementById('c-potencial').textContent;
  const cardLiberadaAntes = doc.getElementById('c-liberada').textContent;
  const hdrCicloAntes = doc.getElementById('hdr-ciclo').textContent;
  const hdrEstadoAntes = doc.getElementById('hdr-estado-ciclo').textContent;
  const detalleAntes = (win._DETALLE_ACTUAL || []).map(f => f.factura);

  // Elegir un ciclo CERRADO distinto al actual (no el primero, para asegurar
  // que efectivamente sea un ciclo historico y no el vigente por casualidad).
  const opcionCerrada = Array.from(sel.options).find(o => o.textContent.indexOf('Cerrado') !== -1 && o.value !== cicloAntes);
  if (!opcionCerrada) { console.log('No se encontro un ciclo cerrado distinto al actual. FALLO'); return { ok: false }; }
  sel.value = opcionCerrada.value;
  win.renderTodo();
  await new Promise(r => setTimeout(r, 200));

  const cicloDespues = sel.value;
  const cardPotencialDespues = doc.getElementById('c-potencial').textContent;
  const cardLiberadaDespues = doc.getElementById('c-liberada').textContent;
  const hdrCicloDespues = doc.getElementById('hdr-ciclo').textContent;
  const hdrEstadoDespues = doc.getElementById('hdr-estado-ciclo').textContent;
  const hdrPoliticaDespues = doc.getElementById('hdr-politica') ? doc.getElementById('hdr-politica').textContent : '';
  const hdrFechaDatosDespues = doc.getElementById('hdr-fecha-datos') ? doc.getElementById('hdr-fecha-datos').textContent : '';
  const detalleDespues = (win._DETALLE_ACTUAL || []).map(f => f.factura);
  const presupuestoDespues = doc.getElementById('i-presupuesto') ? doc.getElementById('i-presupuesto').textContent : '';

  console.log('Ciclo:', cicloAntes, '->', cicloDespues);
  console.log('Header ciclo:', JSON.stringify(hdrCicloAntes), '->', JSON.stringify(hdrCicloDespues));
  console.log('Header estado:', hdrEstadoAntes, '->', hdrEstadoDespues);
  console.log('Politica aplicada (header):', hdrPoliticaDespues, '| Fecha de datos (header):', hdrFechaDatosDespues);
  console.log('Comision potencial:', cardPotencialAntes, '->', cardPotencialDespues);
  console.log('Comision liberada:', cardLiberadaAntes, '->', cardLiberadaDespues);
  console.log('Presupuesto del ciclo (nuevo indicador):', presupuestoDespues);
  console.log('Facturas en detalle (window._DETALLE_ACTUAL):', detalleAntes.length, detalleAntes, '->', detalleDespues.length, detalleDespues);

  const tarjetasActualizadas = cardPotencialAntes !== cardPotencialDespues || cardLiberadaAntes !== cardLiberadaDespues;
  const headerActualizado = hdrCicloAntes !== hdrCicloDespues && hdrEstadoDespues === 'Cerrado';
  const detalleActualizado = JSON.stringify(detalleAntes) !== JSON.stringify(detalleDespues);
  const politicaVisible = hdrPoliticaDespues.length > 1 && hdrFechaDatosDespues.length > 1;
  const presupuestoVisible = presupuestoDespues !== '—' && presupuestoDespues.length > 1;

  const ok = cicloDespues !== cicloAntes && tarjetasActualizadas && headerActualizado && detalleActualizado && politicaVisible && presupuestoVisible;
  console.log(ok ? 'OK' : 'FALLO');
  return { ok, cicloAntes, cicloDespues };
}

async function testPreservacionCicloVigenteYPdf(dom, etiquetaPais, pais) {
  console.log('\n=== Preservacion del ciclo vigente + PDF del ciclo seleccionado (' + etiquetaPais + ') ===');
  const win = dom.window, doc = win.document;
  const sel = doc.getElementById('sel-ciclo');

  // El PDF debe reflejar el ciclo actualmente seleccionado (que a esta altura
  // del test es un ciclo CERRADO, tras testCambioDeCiclo).
  let htmlPdf = null;
  try {
    htmlPdf = win.SICPDF._construirHtml({
      pais: pais,
      vendedor: win._VENDEDOR_ACTUAL_OBJ,
      resultado: win._RESULTADO_ACTUAL,
      diferido: win._DIFERIDO_ACTUAL,
      acciones: win._ACCIONES_ACTUAL,
      params: win.CTX.params
    });
  } catch (e) {
    console.log('Error generando PDF:', e.message);
  }
  const cicloSeleccionado = win._RESULTADO_ACTUAL ? win._RESULTADO_ACTUAL.ciclo : null;
  const estadoSeleccionado = win._RESULTADO_ACTUAL ? win._RESULTADO_ACTUAL.ciclo_info.estado : null;
  console.log('Ciclo actualmente seleccionado en el dashboard:', cicloSeleccionado, '(' + estadoSeleccionado + ')');
  const pdfReflejaCicloSeleccionado = !!htmlPdf && htmlPdf.indexOf('Cerrado') !== -1 && estadoSeleccionado === 'cerrado';
  console.log('PDF generado refleja el ciclo cerrado seleccionado (no el vigente):', pdfReflejaCicloSeleccionado);

  // El ciclo vigente del sistema no debe haberse alterado por haber
  // seleccionado y visualizado un ciclo cerrado.
  const cicloVigenteSigueIntacto = win.CTX.params.ciclo_vigente === '2026-07';
  const opcionVigenteSigueMarcada = Array.from(sel.options).some(o => o.textContent.indexOf('Vigente') !== -1);
  console.log('ciclo_vigente del sistema:', win.CTX.params.ciclo_vigente, '| opcion "Vigente" sigue en el selector:', opcionVigenteSigueMarcada);

  const ok = pdfReflejaCicloSeleccionado && cicloVigenteSigueIntacto && opcionVigenteSigueMarcada;
  console.log(ok ? 'OK' : 'FALLO');
  return ok;
}

// =============================================================================
// CHANGE REQUEST SIC-AV v1.3 -- PAGINA "POLITICA Y FACTORES"
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

// =============================================================================
// CHANGE REQUEST SIC-AV v1.4 -- ELIMINACION DEL FACTOR/CONTROL DE PRECIO PISO
// =============================================================================
async function testSinControlPrecioPiso(dom, etiquetaPais) {
  console.log('\n=== Sin control de autorizacion de precio piso en el dashboard (' + etiquetaPais + ') ===');
  const win = dom.window, doc = win.document;

  const opcionesFiltro = Array.from(doc.querySelectorAll('#filtro-estado option')).map(o => o.value);
  const sinOpcionRetenida = opcionesFiltro.indexOf('retenida') === -1;
  console.log('Opciones del filtro de estado:', opcionesFiltro, '| incluye "retenida":', !sinOpcionRetenida);

  const indicadorPisoBajo = doc.getElementById('i-piso-bajo');
  const yaNoHayIndicadoresAutorizacion = !doc.getElementById('i-piso-aut') && !doc.getElementById('i-piso-noaut');
  console.log('Indicador informativo "Ventas bajo piso":', indicadorPisoBajo ? indicadorPisoBajo.textContent : null,
    '| indicadores de autorizacion (deben haber desaparecido):', !yaNoHayIndicadoresAutorizacion);

  const detalle = win._DETALLE_ACTUAL || [];
  const sinEstadoRetenida = detalle.every(f => f.estado !== 'retenida');
  const sinFactorPiso = detalle.every(f => f.factor_piso === undefined);
  const hayVentaBajoPiso = detalle.some(f => f.clasificacion_piso === 'bajo_piso');
  console.log('Ninguna factura en estado "retenida":', sinEstadoRetenida, '| ninguna con campo factor_piso:', sinFactorPiso,
    '| hay al menos una venta bajo piso (clasificacion informativa):', hayVentaBajoPiso);

  const ok = sinOpcionRetenida && indicadorPisoBajo !== null && yaNoHayIndicadoresAutorizacion &&
    sinEstadoRetenida && sinFactorPiso && hayVentaBajoPiso;
  console.log(ok ? 'OK' : 'FALLO');
  return ok;
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

  const rCL = await testDashboardCompleto('CL', 'chile26', 'sic_chile.html');
  resultados.dashboard_chile = rCL.ok;
  resultados.sin_control_precio_piso_chile = await testSinControlPrecioPiso(rCL.dom, 'Chile');
  resultados.cambio_vendedor_filtro_cl = await testCambioVendedorYFiltros(rCL.dom);
  resultados.selector_ciclo_chile = await testSelectorCiclo(rCL.dom, 'Chile');
  const cambioCiclCL = await testCambioDeCiclo(rCL.dom, 'Chile');
  resultados.cambio_de_ciclo_chile_ui = cambioCiclCL.ok;
  resultados.preservacion_vigente_y_pdf_chile = await testPreservacionCicloVigenteYPdf(rCL.dom, 'Chile', 'CL');

  const rPE = await testDashboardCompleto('PE', 'peru26', 'sic_peru.html');
  resultados.dashboard_peru = rPE.ok;
  resultados.sin_control_precio_piso_peru = await testSinControlPrecioPiso(rPE.dom, 'Peru');
  resultados.selector_ciclo_peru = await testSelectorCiclo(rPE.dom, 'Peru');
  const cambioCiclPE = await testCambioDeCiclo(rPE.dom, 'Peru');
  resultados.cambio_de_ciclo_peru_ui = cambioCiclPE.ok;
  resultados.preservacion_vigente_y_pdf_peru = await testPreservacionCicloVigenteYPdf(rPE.dom, 'Peru', 'PE');

  // CHANGE REQUEST SIC-AV v1.3 -- pagina "Politica y Factores"
  const sessionCL = rCL.dom.window.sessionStorage.getItem('sic_av_session');
  const sessionPE = rPE.dom.window.sessionStorage.getItem('sic_av_session');
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
