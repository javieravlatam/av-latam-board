/**
 * SIC-AV — Pruebas del adaptador de datos reales (sic_data_adapter.js)
 * =========================================================================================
 * CHANGE REQUEST SIC-AV v1.5 (Fase 2/3): valida que el adaptador lea correctamente las
 * fuentes reales de AV LATAM Board (Panel_IEC_Auditoria_2026.html -> TX_CL/TX_PE,
 * avboard_data.js -> presupuesto real) y construya un ciclo real 26-25 completo,
 * SIN modificar sic_core.js ni ningun archivo del Board (todo se lee con fs.readFileSync
 * de solo lectura).
 *
 * Uso: node tests/run_adapter_tests.js   (ejecutar desde la carpeta apps/sic_av/)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');       // apps/sic_av/
const REPO_ROOT = path.join(ROOT, '..', '..'); // raiz real del repo (donde viven los archivos del Board)

global.fetch = function (url) {
  return new Promise((resolve) => {
    try {
      const p = path.join(ROOT, url);
      const content = fs.readFileSync(p, 'utf8');
      resolve({ ok: true, text: () => Promise.resolve(content), json: () => Promise.resolve(JSON.parse(content)) });
    } catch (e) {
      resolve({ ok: false, statusText: e.message });
    }
  });
};
global.window = global;

eval(fs.readFileSync(path.join(ROOT, 'sic_core.js'), 'utf8'));
eval(fs.readFileSync(path.join(ROOT, 'js', 'sic_data_adapter.js'), 'utf8'));

const resultados = [];
function check(nombre, condicion, detalle) {
  resultados.push({ nombre, ok: !!condicion, detalle: detalle || '' });
  console.log((condicion ? 'OK  ' : 'FAIL') + ' - ' + nombre + (detalle ? '  (' + detalle + ')' : ''));
}

(async () => {
  // Confirmar que las fuentes reales del Board existen y son legibles (no se modifican).
  const existePanelIec = fs.existsSync(path.join(REPO_ROOT, 'Panel_IEC_Auditoria_2026.html'));
  const existeAvboardData = fs.existsSync(path.join(REPO_ROOT, 'avboard_data.js'));
  check('fuentes_reales_del_board_accesibles', existePanelIec && existeAvboardData,
    'Panel_IEC_Auditoria_2026.html=' + existePanelIec + ' avboard_data.js=' + existeAvboardData);

  const fuentes = await SICAdapter.cargarFuentesReales();
  check('tx_cl_extraido', Array.isArray(fuentes.tx.TX_CL) && fuentes.tx.TX_CL.length > 0,
    'TX_CL=' + fuentes.tx.TX_CL.length + ' transacciones reales');
  check('tx_pe_extraido', Array.isArray(fuentes.tx.TX_PE) && fuentes.tx.TX_PE.length > 0,
    'TX_PE=' + fuentes.tx.TX_PE.length + ' transacciones reales');
  check('presupuesto_real_extraido',
    Object.keys(fuentes.presupuesto.CL.rtc_mensual_ppto).length > 0 &&
    Object.keys(fuentes.presupuesto.PE.rtc_ppto_anual).length > 0,
    'CL rtc con ppto mensual=' + Object.keys(fuentes.presupuesto.CL.rtc_mensual_ppto).length +
    ' | PE rtc con ppto anual=' + Object.keys(fuentes.presupuesto.PE.rtc_ppto_anual).length);

  // Asignacion de ciclo 26-25: casos de borde.
  check('asignar_ciclo_dentro_del_mes',
    SICAdapter.asignarCiclo('2026-03-10').ciclo === '2026-03',
    'fecha 2026-03-10 -> ciclo ' + SICAdapter.asignarCiclo('2026-03-10').ciclo);
  check('asignar_ciclo_cruce_de_mes',
    SICAdapter.asignarCiclo('2026-03-26').ciclo === '2026-04' &&
    SICAdapter.asignarCiclo('2026-03-25').ciclo === '2026-03',
    'fecha 2026-03-26 -> ' + SICAdapter.asignarCiclo('2026-03-26').ciclo + ' (dia 26 pasa al ciclo siguiente); fecha 2026-03-25 -> ' + SICAdapter.asignarCiclo('2026-03-25').ciclo);
  check('asignar_ciclo_cruce_de_anio',
    SICAdapter.asignarCiclo('2025-12-26').ciclo === '2026-01',
    'fecha 2025-12-26 -> ciclo ' + SICAdapter.asignarCiclo('2025-12-26').ciclo);

  // Normalizacion de vendedor: comercial, no comercial, y sin mapeo conocido.
  const vLaratro = SICAdapter.normalizarVendedor('CL', 'PABLO LARATRO');
  check('normalizar_vendedor_comercial_mapeado', vLaratro.esComercial && vLaratro.mapeado && vLaratro.clave === 'laratro',
    'clave=' + vLaratro.clave);
  const vOficina = SICAdapter.normalizarVendedor('CL', 'OFICINA');
  check('normalizar_vendedor_no_comercial_excluido', vOficina.esComercial === false,
    'OFICINA esComercial=' + vOficina.esComercial);
  const vDesconocido = SICAdapter.normalizarVendedor('CL', 'RAYEN BERNAZAR');
  check('normalizar_vendedor_sin_mapeo_reportado', vDesconocido.esComercial === true && vDesconocido.mapeado === false,
    'RAYEN BERNAZAR: esComercial=' + vDesconocido.esComercial + ' mapeado=' + vDesconocido.mapeado + ' (debe reportarse, no descartarse)');

  // ---------------------------------------------------------------------
  // Ciclo real completo: Chile, ciclo 2026-03 (26/02/2026 - 25/03/2026),
  // totalmente contenido en el rango real de TX_CL (2026-01-02 a 2026-06-25).
  // ---------------------------------------------------------------------
  const paramsCL = await SIC.cargarPais('CL').then(ctx => ctx.params);
  const cicloRealCL = SICAdapter.construirCicloReal('CL', '2026-03', fuentes, paramsCL);

  check('ciclo_real_chile_tiene_ventas', cicloRealCL.ventas.length > 0,
    'ventas reales en el ciclo 2026-03 Chile: ' + cicloRealCL.ventas.length);
  check('ciclo_real_chile_marcado_cerrado_y_origen_real',
    cicloRealCL.ciclo_info.estado === 'cerrado' && cicloRealCL.ciclo_info.origen === 'real',
    'estado=' + cicloRealCL.ciclo_info.estado + ' origen=' + cicloRealCL.ciclo_info.origen);
  check('ciclo_real_chile_advierte_cobranza_no_disponible',
    cicloRealCL.advertencias.some(a => a.tipo === 'cobranza_no_disponible') && cicloRealCL.cobranzas.length === 0,
    'advertencia de cobranza presente=' + cicloRealCL.advertencias.some(a => a.tipo === 'cobranza_no_disponible') + ', cobranzas=' + cicloRealCL.cobranzas.length);

  // -- Reconciliacion independiente: sumar directamente TX_CL filtrando por
  // el mismo ciclo (sin reusar el codigo interno del adaptador) y comparar
  // contra la suma de ventas que construyo SICAdapter.construirCicloReal,
  // filtrando por la bandera _pertenece_periodo (CHANGE REQUEST v1.6: el
  // adaptador ahora devuelve tambien transacciones del mes calendario de
  // desempeño, que puede no coincidir con la ventana 26-25 -- la bandera
  // permite reconciliar solo el bloque de periodo, igual que antes). --
  let sumaIndependiente = 0, countIndependiente = 0;
  fuentes.tx.TX_CL.forEach(function (t) {
    const c = SICAdapter.asignarCiclo(t.fecha);
    if (c.ciclo !== '2026-03') return;
    const vend = SICAdapter.normalizarVendedor('CL', t.vendedor);
    if (!vend.esComercial) return;
    sumaIndependiente += Number(t.total) || 0;
    countIndependiente++;
  });
  const ventasDelPeriodo = cicloRealCL.ventas.filter(v => v._pertenece_periodo);
  const sumaAdaptador = ventasDelPeriodo.reduce((s, v) => s + v.venta_neta, 0);
  check('conciliacion_venta_facturada_chile_2026_03',
    Math.abs(sumaIndependiente - sumaAdaptador) < 0.01 && countIndependiente === ventasDelPeriodo.length,
    'suma independiente=' + Math.round(sumaIndependiente) + ' (n=' + countIndependiente + ') vs suma adaptador (solo periodo)=' + Math.round(sumaAdaptador) + ' (n=' + ventasDelPeriodo.length + ')');

  // -- Motor SIC sin modificar, corriendo sobre datos reales --
  if (cicloRealCL.vendedores.length > 0) {
    const vendedorPrueba = cicloRealCL.vendedores[0].id;
    const r = SIC.calcularVendedorCiclo(cicloRealCL, vendedorPrueba, '2026-03');
    check('motor_sic_corre_sobre_datos_reales',
      r.venta_facturada_periodo >= 0 && r.comision_liberada === 0 && r.comision_potencial >= 0,
      'vendedor=' + vendedorPrueba + ' venta_facturada_periodo=' + Math.round(r.venta_facturada_periodo) + ' comision_liberada=' + r.comision_liberada + ' (0 esperado, ver brecha de cobranza) comision_potencial=' + Math.round(r.comision_potencial));

    const iecReal = cicloRealCL.iec.find(i => i.vendedor_id === vendedorPrueba);
    check('iec_real_recalculado_por_mes_desempeno',
      !!iecReal && iecReal.iec_pct >= 0 && iecReal.iec_pct <= 100,
      'IEC real del vendedor ' + vendedorPrueba + ' en el mes de desempeño ' + cicloRealCL.mes_desempeno + ': ' + (iecReal ? iecReal.iec_pct : 'N/A') + '%');

    const pptoReal = cicloRealCL.presupuestos.find(p => p.vendedor_id === vendedorPrueba);
    check('presupuesto_real_mes_desempeno_sin_prorrateo',
      !!pptoReal && (pptoReal.presupuesto === null || pptoReal.presupuesto >= 0),
      'presupuesto del mes de desempeño ' + cicloRealCL.mes_desempeno + ' (lectura directa, sin prorratear) para ' + vendedorPrueba + ': ' + (pptoReal && pptoReal.presupuesto !== null ? Math.round(pptoReal.presupuesto) : 'Pendiente de carga'));
  } else {
    check('motor_sic_corre_sobre_datos_reales', false, 'no hay vendedores en el ciclo real para probar');
  }

  // -- Validaciones de integridad: deben reportarse, nunca excluirse en silencio --
  const tiposAdvertencia = SICAdapter.resumirAdvertencias(cicloRealCL.advertencias);
  console.log('Advertencias del ciclo real Chile 2026-03:', JSON.stringify(tiposAdvertencia, null, 2));
  check('validaciones_reportadas_no_silenciosas',
    Object.keys(tiposAdvertencia).length > 0,
    'tipos de advertencia detectados: ' + Object.keys(tiposAdvertencia).join(', '));

  // -- Vendedor con ventas reales pero sin presupuesto (ver DATA_SOURCE_AUDIT.md 3.4):
  // si 'munoz' aparece con ventas en el ciclo probado, debe generar advertencia. --
  const munozEnCiclo = cicloRealCL.vendedores.some(v => v.id === 'munoz');
  if (munozEnCiclo) {
    check('detecta_vendedor_sin_presupuesto_conocido',
      cicloRealCL.advertencias.some(a => a.tipo === 'vendedor_sin_presupuesto' && a.detalle.indexOf('munoz') !== -1),
      'munoz presente en el ciclo y advertencia de presupuesto generada');
  } else {
    console.log('(munoz no vendio en el ciclo 2026-03 -- prueba de "vendedor sin presupuesto" no aplica en este ciclo especifico)');
  }

  // ---------------------------------------------------------------------
  // Ciclo real Peru (mismo ciclo 2026-03) -- Peru tiene menos cobertura y un
  // bug de fecha conocido (ver DATA_SOURCE_AUDIT.md 3.2); la prueba valida
  // que el adaptador al menos construye el ciclo sin lanzar excepciones y
  // que reporta la falta de tipo_cliente.
  // ---------------------------------------------------------------------
  const paramsPE = await SIC.cargarPais('PE').then(ctx => ctx.params);
  let cicloRealPE = null, errorPE = null;
  try {
    cicloRealPE = SICAdapter.construirCicloReal('PE', '2026-03', fuentes, paramsPE);
  } catch (e) {
    errorPE = e.message;
  }
  check('ciclo_real_peru_construye_sin_excepciones', !errorPE, errorPE || 'sin errores');
  if (cicloRealPE) {
    check('ciclo_real_peru_advierte_tipo_cliente_no_disponible',
      cicloRealPE.ventas.length === 0 || cicloRealPE.advertencias.some(a => a.tipo === 'tipo_cliente_no_disponible'),
      'ventas PE en el ciclo=' + cicloRealPE.ventas.length + ', advertencia tipo_cliente presente=' + cicloRealPE.advertencias.some(a => a.tipo === 'tipo_cliente_no_disponible'));
  }

  // ---------------------------------------------------------------------
  // Validaciones nuevas de integridad (v1.5 Fase 3): factura sin vendedor,
  // moneda inconsistente, y cobro-vs-factura. Se prueban con fixtures
  // sinteticos inyectados directamente (no via fetch) porque el ciclo real
  // 2026-03 no contiene hoy ninguna de estas anomalias -- la prueba debe
  // demostrar que la logica reacciona SI aparecieran, no solo que hoy esta
  // en cero.
  // ---------------------------------------------------------------------
  const fuentesSinteticas = {
    tx: {
      TX_CL: [
        { fecha: '2026-03-05', folio: 'SINT-1', doc: 'Factura', cliente: 'CLIENTE X', vendedor: '', producto: 'AV MOVE', formato: '20 L', total: 100000, pv: 5000, pp: 4000, elegible: true, sp: 100000, bp: 0, cumple: true },
        { fecha: '2026-03-06', folio: 'SINT-2', doc: 'Factura', cliente: 'CLIENTE Y', vendedor: 'PABLO LARATRO', producto: 'AV MOVE', formato: '20 L', total: 50000, pv: 12, pp: 10, elegible: true, sp: 50000, bp: 0, cumple: true }
      ],
      TX_PE: [
        { fecha: '2026-03-07', folio: 'SINT-3', cliente: 'CLIENTE Z', vendedor: 'NICOLL NAVARRO', producto: 'AV MOVE', formato: '20 L', qty: 1, total: 500, pv: 25000, pp: 20000, elegible: true, sp: 500, bp: 0, cumple: true }
      ]
    },
    presupuesto: fuentes.presupuesto
  };
  const cicloSinteticoCL = SICAdapter.construirCicloReal('CL', '2026-03', fuentesSinteticas, paramsCL);
  check('detecta_factura_sin_vendedor',
    cicloSinteticoCL.advertencias.some(a => a.tipo === 'factura_sin_vendedor' && a.detalle.indexOf('SINT-1') !== -1) &&
    !cicloSinteticoCL.ventas.some(v => v._folio_original === 'SINT-1'),
    'SINT-1 (vendedor vacio) genero advertencia y quedo excluida de ventas');
  check('detecta_moneda_inconsistente_cl',
    cicloSinteticoCL.advertencias.some(a => a.tipo === 'moneda_inconsistente' && a.detalle.indexOf('SINT-2') !== -1),
    'SINT-2 (pv=12 en Chile, escala USD) genero advertencia de moneda inconsistente');

  const cicloSinteticoPE = SICAdapter.construirCicloReal('PE', '2026-03', fuentesSinteticas, paramsPE);
  check('detecta_moneda_inconsistente_pe',
    cicloSinteticoPE.advertencias.some(a => a.tipo === 'moneda_inconsistente' && a.detalle.indexOf('SINT-3') !== -1),
    'SINT-3 (pv=25000 en Peru, escala CLP) genero advertencia de moneda inconsistente');

  // -- Validacion cobro-vs-factura: probada directamente sobre la funcion
  // interna con fixtures, ya que `cobranzas` real siempre esta vacio hoy. --
  const advertenciasCobranza = [];
  const ventasFixture = [{ factura: 'REAL-CL-1', venta_neta: 100000 }];
  SICAdapter._validarCobranzas(
    [{ factura: 'REAL-CL-1', monto: 150000 }, { factura: 'REAL-CL-999', monto: 5000 }],
    ventasFixture,
    advertenciasCobranza
  );
  check('detecta_cobro_superior_al_facturado',
    advertenciasCobranza.some(a => a.tipo === 'cobro_superior_al_facturado'),
    'cobro de 150000 sobre factura de 100000 genero advertencia');
  check('detecta_cobro_sin_factura',
    advertenciasCobranza.some(a => a.tipo === 'cobro_sin_factura'),
    'cobro referenciando REAL-CL-999 (no existe) genero advertencia');

  console.log('\n\n========== RESUMEN PRUEBAS ADAPTADOR DE DATOS REALES ==========');
  let todoOk = true;
  resultados.forEach(r => { if (!r.ok) todoOk = false; });
  console.log(resultados.filter(r => r.ok).length + '/' + resultados.length + ' pruebas OK');
  console.log('RESULTADO GLOBAL:', todoOk ? 'TODO OK' : 'HAY FALLOS');
  process.exit(todoOk ? 0 : 1);
})();
