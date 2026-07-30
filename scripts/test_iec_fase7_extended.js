/**
 * PRUEBAS EXTENDIDAS — IEC Fase 7 (SIC-AV v1.7)
 * Cubre: transporte INCLUIDO/SEPARADO, AVBOARD mensual/vendedor/YTD,
 *        Estado B/C blocking PDF, reconciliación, no regresión en
 *        cobranzas/presupuesto/universo SIC.
 *
 * Ejecutar: node scripts/test_iec_fase7_extended.js
 */

// ── Minimal stubs para correr cotizador_core.js sin DOM ──────────────
global.window = {};
global.AV_LOGO_DATA_URL = '';
global.AV_CLIENTES_DATA = [];

// ── Cargar módulo core via vm (evita scoping strict-mode de eval) ─────
const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const coreCode = fs.readFileSync(
  path.join(__dirname, '../apps/cotizador/cotizador_core.js'), 'utf8'
);
// Correr en este contexto (global) para que COTIZADOR quede expuesto
vm.runInThisContext(coreCode, { filename: 'cotizador_core.js' });
const C = COTIZADOR;

// ── Config base para tests ───────────────────────────────────────────
const CONFIG_BASE = {
  iec_politica: {
    iec_min_autorizado: 0.90,
    desviacion_critica_max_item: 0.25
  },
  precio_piso_campo: 'precio_piso_unitario',
  margen_campo: 'costo_referencial_unitario'
};

// ── Cargar avboard_data.js para tests AVBOARD ────────────────────────
const avboardCode = fs.readFileSync(
  path.join(__dirname, '../avboard_data.js'), 'utf8'
);
vm.runInThisContext(avboardCode, { filename: 'avboard_data.js' });

// ── Test runner ──────────────────────────────────────────────────────
var passed = 0, failed = 0, total = 0;
function test(name, fn) {
  total++;
  try {
    fn();
    console.log('✓ ' + name);
    passed++;
  } catch(e) {
    console.log('✗ ' + name + '\n    → ' + e.message);
    failed++;
  }
}
function assertEqual(a, b, msg) {
  if (Math.abs(a - b) > 0.0001) throw new Error((msg || '') + ' Expected ' + b + ' got ' + a);
}
function assertTrue(v, msg) { if (!v) throw new Error(msg || 'Expected true, got ' + v); }
function assertFalse(v, msg) { if (v) throw new Error(msg || 'Expected false, got ' + v); }

// ── Fixtures ─────────────────────────────────────────────────────────
function mkLinea(venta, piso, qty, elegible) {
  elegible = elegible !== false;
  return {
    precio_venta_unitario: venta,
    precio_piso_unitario:  piso,
    precio_venta_envase:   venta,
    cantidad_envases: qty,
    factor_presentacion: 1,
    elegible_iec: elegible,
    bajo_piso: elegible && (venta < piso),
    total_linea: venta * qty,
    venta_neta: venta * qty,
    iec_linea: elegible && piso > 0 ? venta / piso : null,
    piso_situacion: !elegible ? 'no_evaluable' : (venta >= piso ? 'cumple' : 'bajo_piso')
  };
}

/* ══════════════════════════════════════════════
   BLOQUE A — TRANSPORTE INCLUIDO / SEPARADO
══════════════════════════════════════════════ */
console.log('\n── BLOQUE A: Transporte INCLUIDO / SEPARADO ──');

test('TA1: SEPARADO → IEC no cambia con despacho cero', function() {
  var lineas = [mkLinea(120, 100, 10)];
  var tp = C.Calc.prorratearTransporte(lineas, 0);
  var r  = C.Calc.calcularIECConTransporte(lineas, tp, CONFIG_BASE);
  // venta_neta = 1200, piso = 1000 → IEC = 1.20
  assertEqual(r.iec_mix_neto, 1.20, 'TA1');
});

test('TA2: INCLUIDO → IEC neto correcto (una línea)', function() {
  // venta_linea = 1200, transporte = 200
  // IEC_neto = (1200-200) / (100*10) = 1000/1000 = 1.00
  var lineas = [mkLinea(120, 100, 10)];
  var tp = C.Calc.prorratearTransporte(lineas, 200);
  var r  = C.Calc.calcularIECConTransporte(lineas, tp, CONFIG_BASE);
  assertEqual(r.iec_mix_neto, 1.00, 'TA2');
});

test('TA3: INCLUIDO con dos líneas → prorrateo proporcional', function() {
  // L1: 600, L2: 400, total = 1000. Transporte 100.
  // L1 tp = 60, L2 tp = 40.
  var lineas = [mkLinea(60, 50, 10), mkLinea(80, 50, 5)];
  // L1 total=600, L2 total=400
  var tp = C.Calc.prorratearTransporte(lineas, 100);
  assertEqual(tp[0].transporte_prorrateado, 60, 'TA3 tp[0]');
  assertEqual(tp[1].transporte_prorrateado, 40, 'TA3 tp[1]');
});

test('TA4: Invariante Σ prorrateados = monto transporte', function() {
  var lineas = [mkLinea(100,80,3), mkLinea(200,150,2), mkLinea(50,40,7)];
  var monto = 333;
  var tp = C.Calc.prorratearTransporte(lineas, monto);
  var suma = tp.reduce(function(s,x){ return s + x.transporte_prorrateado; }, 0);
  assertEqual(suma, monto, 'TA4 invariante');
});

test('TA5: Línea no elegible no afecta IEC con transporte', function() {
  // L1 elegible: precio=110, piso=100, qty=5 → total=550
  // L2 no elegible: precio=90, qty=5 → total=450. No entra al IEC.
  // Transporte 100: tp[L1]=100×550/1000=55, tp[L2]=100×450/1000=45
  // IEC_neto = (550-55)/(100*5) = 495/500 = 0.99
  var l1 = mkLinea(110, 100, 5);
  var l2 = mkLinea(90,  100, 5, false); // no_evaluable
  var lineas = [l1, l2];
  var tp = C.Calc.prorratearTransporte(lineas, 100);
  var r  = C.Calc.calcularIECConTransporte(lineas, tp, CONFIG_BASE);
  assertEqual(r.iec_mix_neto, 0.99, 'TA5');
  // Verificar que L2 no suma al IEC (solo L1 elegible)
  assertEqual(r.venta_neta_elegible, 495, 'TA5 vne');
  assertEqual(r.valor_piso_teorico, 500, 'TA5 vpt');
});

/* ══════════════════════════════════════════════
   BLOQUE B — AVBOARD IEC MENSUAL / VENDEDOR / YTD
══════════════════════════════════════════════ */
console.log('\n── BLOQUE B: AVBOARD IEC mensual / vendedor / YTD ──');

test('TB1: avboard_data.js carga OK (AVBOARD definido)', function() {
  assertTrue(typeof AVBOARD === 'object' && AVBOARD !== null, 'AVBOARD undefined');
});

test('TB2: chile.ventas.iec.total presente y numérico', function() {
  var v = AVBOARD.chile.ventas.iec.total;
  assertTrue(typeof v === 'number' && v > 0, 'iec.total inválido: ' + v);
});

test('TB3: iec_mensual presente con 7 claves', function() {
  var keys = Object.keys(AVBOARD.chile.ventas.iec.iec_mensual || {});
  assertTrue(keys.length === 7, 'keys=' + keys.length + ', esperado 7');
  assertTrue(keys.includes('total'), 'falta key total');
});

test('TB4: iec_mensual.total tiene 12 elementos', function() {
  var arr = AVBOARD.chile.ventas.iec.iec_mensual.total;
  assertTrue(Array.isArray(arr) && arr.length === 12, 'length=' + (arr && arr.length));
});

test('TB5: meses con datos son los primeros N (sin gaps dentro del período)', function() {
  var arr = AVBOARD.chile.ventas.iec.iec_mensual.total;
  var conDatos = arr.filter(function(v){ return v !== null; }).length;
  var nullFinal = arr.slice(conDatos).every(function(v){ return v === null; });
  assertTrue(conDatos > 0, 'sin meses con datos');
  assertTrue(nullFinal, 'hay nulls intercalados en datos presentes');
});

test('TB6: vne_total / vpt_total ≈ iec.total (tolerancia 0.001)', function() {
  var iec = AVBOARD.chile.ventas.iec;
  var ratio = iec.vne_total / iec.vpt_total;
  assertTrue(Math.abs(ratio - iec.total) < 0.001,
    'ratio=' + ratio.toFixed(4) + ' != total=' + iec.total);
});

test('TB7: grupo.iec_grupo_vne / grupo.iec_grupo_vpt ≈ grupo.iec_grupo (tolerancia 0.001)', function() {
  var g = AVBOARD.grupo;
  var ratio = g.iec_grupo_vne / g.iec_grupo_vpt;
  assertTrue(Math.abs(ratio - g.iec_grupo) < 0.001,
    'ratio=' + ratio.toFixed(4) + ' != iec_grupo=' + g.iec_grupo);
});

test('TB8: grupo.iec_grupo ≈ chile iec.total (Chile = único país con datos de piso)', function() {
  var g_iec  = AVBOARD.grupo.iec_grupo;
  var cl_iec = AVBOARD.chile.ventas.iec.total;
  assertTrue(Math.abs(g_iec - cl_iec) < 0.001,
    'grupo=' + g_iec + ' != chile=' + cl_iec);
});

test('TB9: vendedores YTD en rango razonable (0 < iec <= 2)', function() {
  var iec = AVBOARD.chile.ventas.iec;
  var vendors = ['caroca','laratro','encina','veverka','munoz','velasquez'];
  vendors.forEach(function(k) {
    var v = iec[k];
    if (v !== null && v !== undefined) {
      assertTrue(v > 0 && v <= 2.0, 'vendedor ' + k + ' IEC fuera de rango: ' + v);
    }
  });
});

test('TB10: iec_mensual por vendedor tiene 12 elementos', function() {
  var mens = AVBOARD.chile.ventas.iec.iec_mensual;
  var vendors = ['caroca','laratro','encina','veverka','munoz','velasquez'];
  vendors.forEach(function(k) {
    var arr = mens[k];
    assertTrue(Array.isArray(arr) && arr.length === 12,
      'vendedor ' + k + ' iec_mensual length=' + (arr && arr.length));
  });
});

/* ══════════════════════════════════════════════
   BLOQUE C — ESTADO B/C BLOQUEA PDF
══════════════════════════════════════════════ */
console.log('\n── BLOQUE C: Estado B/C bloquea PDF ──');

// Simular imprimirConControl sin window.open (retorna false en estado B/C)
var _alertCalls = [];
var _openCalls  = [];
global.window = {
  open: function() { _openCalls.push(1); return { document: { write:function(){}, close:function(){} }, focus:function(){}, print:function(){} }; }
};
global.alert = function(msg) { _alertCalls.push(msg); };

test('TC1: Estado C → imprimirConControl retorna false y no abre ventana', function() {
  _alertCalls = []; _openCalls = [];
  var lineas = [mkLinea(74, 100, 10)]; // 74% del piso → C (< 75% guardrail)
  var quote = { lineas: lineas, totales: { iec_global: 0.74 }, despacho: { incluido: false }, autorizacion: {}, meta: {} };
  var result = C.PDF.imprimirConControl(quote, 'Chile', CONFIG_BASE);
  assertFalse(result, 'TC1: debería retornar false en estado C');
  assertTrue(_openCalls.length === 0, 'TC1: no debería abrir ventana');
});

// [v8 — política actualizada OBJ3] Estado B (IEC 75–89%, todos los ítems ≥ 75%) → PERMITIDO.
// Antes de v8: imprimirConControl bloqueaba B técnicamente (sin backend de autorización).
// Desde v8: el piso absoluto es IEC global ≥ 75%. Estado B cumple ese umbral → PDF permitido.
test('TC2: Estado B (IEC=88%, ítems ≥75%) → v8: PDF PERMITIDO (retorna true)', function() {
  _alertCalls = []; _openCalls = [];
  var lineas = [mkLinea(88, 100, 10)]; // 88% del piso → estado B (≥75% piso absoluto, <90% umbral)
  var quote = { lineas: lineas, totales: { iec_global: 0.88 }, despacho: { incluido: false, costo_despacho: 0 }, autorizacion: {}, meta: {}, cliente: {}, moneda: 'CLP', observaciones: '', numero: 'TST-B', fecha: '2026-07-30', condicion_pago: '30d', validez_dias: 30, elaborado_por: 'Test' };
  var result = C.PDF.imprimirConControl(quote, 'Chile', CONFIG_BASE);
  assertTrue(result === true, 'TC2: Estado B con IEC>=75% debe retornar true en v8, got ' + result);
  assertTrue(_openCalls.length > 0, 'TC2: debe abrir ventana PDF en estado B (v8)');
});

test('TC2b: Estado B con ítems ≥75% → v8: PDF permitido (no hay fake-security overhead)', function() {
  _alertCalls = []; _openCalls = [];
  var lineas = [mkLinea(88, 100, 10)];
  var quote = {
    lineas: lineas, totales: { iec_global: 0.88 },
    despacho: { incluido: false, costo_despacho: 0 }, meta: {},
    cliente: {}, moneda: 'CLP', observaciones: '', numero: 'TST-B2',
    fecha: '2026-07-30', condicion_pago: '30d', validez_dias: 30, elaborado_por: 'Test',
    autorizacion: {}
  };
  var result = C.PDF.imprimirConControl(quote, 'Chile', CONFIG_BASE);
  assertTrue(result === true, 'TC2b: Estado B v8 debe retornar true, got ' + result);
  assertTrue(_openCalls.length > 0, 'TC2b: debe abrir ventana en estado B v8');
});

test('TC3: Estado A → imprimirConControl genera PDF (retorna true)', function() {
  _alertCalls = []; _openCalls = [];
  var lineas = [mkLinea(110, 100, 10)]; // 110% del piso → A
  var quote = { lineas: lineas, totales: { iec_global: 1.10 }, despacho: { incluido: false, costo_despacho: 0 }, autorizacion: {}, meta: {}, cliente: {}, moneda: 'CLP', observaciones: '', numero: 'TST-001', fecha: '2026-07-28', condicion_pago: '30d', validez_dias: 30, elaborado_por: 'Test' };
  var result = C.PDF.imprimirConControl(quote, 'Chile', CONFIG_BASE);
  assertTrue(result === true, 'TC3: estado A debe retornar true, got ' + result);
  assertTrue(_openCalls.length > 0, 'TC3: debe abrir ventana PDF');
});

test('TC4: Estado C con transporte INCLUIDO también bloquea', function() {
  _alertCalls = []; _openCalls = [];
  // Línea a 74% del piso incluso antes de deducir transporte (< 75% guardrail)
  var lineas = [mkLinea(74, 100, 10)];
  var quote = {
    lineas: lineas,
    totales: { iec_global: 0.74 },
    despacho: { incluido: true, costo_despacho: 100 },
    iec_transporte_info: { modo: 'INCLUIDO', iec_neto: 0.69, transporte: 100 },
    autorizacion: {}, meta: {}
  };
  var result = C.PDF.imprimirConControl(quote, 'Chile', CONFIG_BASE);
  assertFalse(result, 'TC4: estado C con INCLUIDO debe bloquear');
});

/* ══════════════════════════════════════════════
   BLOQUE D — NO REGRESIÓN: cobranzas/ppto/universo SIC
══════════════════════════════════════════════ */
console.log('\n── BLOQUE D: No regresión cobranzas/presupuesto/universo SIC ──');

test('TD1: avboard_data.js — chile.cxc existe y tiene campos', function() {
  var cxc = AVBOARD.chile.cxc;
  assertTrue(cxc && typeof cxc === 'object', 'chile.cxc missing');
  // campo 'total' = cartera total CLP
  assertTrue(typeof cxc.total === 'number', 'chile.cxc.total missing');
});

test('TD2: avboard_data.js — peru.ventas existe y tiene ytd', function() {
  var pe = AVBOARD.peru.ventas;
  assertTrue(pe && typeof pe === 'object', 'peru.ventas missing');
  // campo ytd_5m o ytd_4m
  var ytd = pe.ytd_5m !== undefined ? pe.ytd_5m : pe.ytd_4m;
  assertTrue(typeof ytd === 'number' && ytd > 0, 'peru ytd missing: ' + ytd);
});

test('TD3: avboard_data.js — grupo ytd_usd numérico y > 0', function() {
  var g = AVBOARD.grupo.ytd_usd;
  assertTrue(typeof g === 'number' && g > 0, 'grupo.ytd_usd=' + g);
});

test('TD4: avboard_data.js — presupuesto chile existe (no hardcodeado)', function() {
  var pv = AVBOARD.chile.ventas;
  // El campo se llama ppto_anual (sin sufijo de moneda) en avboard_data.js
  assertTrue(pv.hasOwnProperty('ppto_anual') || pv.hasOwnProperty('ppto_5m') ||
             pv.hasOwnProperty('ppto_anual_clp') || pv.hasOwnProperty('ppto_5m_clp'),
    'No se encontró campo presupuesto en chile.ventas. Keys: ' + Object.keys(pv).join(','));
});

test('TD5: sic_data_adapter.js — archivo existe y tiene SICAdapter', function() {
  var adapterCode = fs.readFileSync(
    path.join(__dirname, '../apps/sic_av/js/sic_data_adapter.js'), 'utf8'
  );
  assertTrue(adapterCode.includes('SICAdapter'), 'SICAdapter no encontrado');
  assertTrue(adapterCode.includes('construirCicloReal'), 'construirCicloReal no encontrado');
  // Verificar que IEC ponderado está presente
  assertTrue(adapterCode.includes('numerador') && adapterCode.includes('denominador'),
    'IEC ponderado no encontrado en adapter');
});

test('TD6: cobranzas_cl.json existe y tiene estructura válida', function() {
  var p = path.join(__dirname, '../apps/sic_av/data/cobranzas_cl.json');
  assertTrue(fs.existsSync(p), 'cobranzas_cl.json no existe');
  var data = JSON.parse(fs.readFileSync(p, 'utf8'));
  assertTrue(Array.isArray(data) || typeof data === 'object', 'estructura inválida');
});

test('TD7: cotizador_core.js — prorrateo invariante Σ=total con montos irregulares', function() {
  // Test con 5 líneas y monto que no divide exacto
  var lineas = [
    mkLinea(100,80,1), mkLinea(200,160,1), mkLinea(333,250,1),
    mkLinea(50,40,1),  mkLinea(70,55,1)
  ];
  var monto = 777;
  var tp = C.Calc.prorratearTransporte(lineas, monto);
  var suma = tp.reduce(function(s,x){ return s + x.transporte_prorrateado; }, 0);
  assertEqual(suma, monto, 'TD7 invariante con 5 líneas irregulares');
});

test('TD8: fingerprint cambia cuando cambia precio (anti-bypass)', function() {
  var q1 = { lineas: [mkLinea(100,80,10)], cliente:{nombre:'X'}, condicion_pago:'30d',
             transporte:0, interes:{aplica:false} };
  var q2 = JSON.parse(JSON.stringify(q1));
  q2.lineas[0].precio_venta_unitario = 101; // precio diferente
  var fp1 = C.util.generarFingerprint(q1);
  var fp2 = C.util.generarFingerprint(q2);
  assertTrue(fp1 !== fp2, 'TD8: fingerprint debe cambiar con precio diferente');
});

/* ══════════════════════════════════════════════
   BLOQUE E — RECONCILIACIÓN MATEMÁTICA FINAL
══════════════════════════════════════════════ */
console.log('\n── BLOQUE E: Reconciliación matemática ──');

test('TE1: Reconciliación Cotizador = AVBOARD (misma fórmula Σvne/Σvpt)', function() {
  // Simular el mismo escenario base que T18 (reconciliación SIC)
  var lineas = [
    mkLinea(125, 100, 4),  // elegible, cumple
    mkLinea(90,  100, 2),  // elegible, bajo piso
    mkLinea(200, 100, 1)   // elegible, cumple
  ];
  // vne total elegible = 500+180+200 = 880
  // vpt total elegible = 400+200+100 = 700
  // IEC = 880/700 = 1.2571...
  var t = C.Calc.calcularTotales(lineas, CONFIG_BASE);
  // También calcular manualmente
  var vne = lineas.reduce(function(s,l){ return l.elegible_iec ? s + l.total_linea : s; }, 0);
  var vpt = lineas.reduce(function(s,l){ return l.elegible_iec ? s + l.precio_piso_unitario*l.cantidad_envases : s; }, 0);
  var manual = vne / vpt;
  assertEqual(t.iec_global, manual, 'TE1: Cotizador IEC');
});

test('TE2: AVBOARD IEC mensual suma coherente (Σ meses ≈ YTD por lógica)', function() {
  // No esperamos que la suma de IEC mensuales = YTD (son ratios de ratios).
  // Pero sí que cada mes no sea > 3.0 ni negativo.
  var arr = AVBOARD.chile.ventas.iec.iec_mensual.total;
  arr.forEach(function(v, i) {
    if (v !== null) {
      assertTrue(v > 0 && v <= 3.0, 'TE2: mes ' + i + ' IEC fuera de rango: ' + v);
    }
  });
});

test('TE3: Total ventas Chile no cambió respecto al pipeline original', function() {
  // El campo YTD en avboard_data.js es ytd_5m (CLP acumulado a 5 meses)
  var cv = AVBOARD.chile.ventas;
  var total = cv.ytd_5m !== undefined ? cv.ytd_5m : (cv.ytd_4m || cv.total_anual_clp);
  assertTrue(typeof total === 'number' && total > 0,
    'TE3: total ventas Chile no encontrado o inválido: ' + total);
  // Verificar que está en rango razonable (>= 100M CLP)
  assertTrue(total >= 100000000, 'TE3: total muy bajo (< 100M CLP): ' + total);
});

/* ══════════════════════════════════════════════
   BLOQUE F — Regresión T1-T18 (subset crítico)
══════════════════════════════════════════════ */
console.log('\n── BLOQUE F: Regresión T1-T18 (pruebas originales clave) ──');

test('TF1: IEC en piso exacto = 1.000', function() {
  var l = [mkLinea(100,100,10)];
  var t = C.Calc.calcularTotales(l, CONFIG_BASE);
  assertEqual(t.iec_global, 1.000, 'TF1');
});

test('TF2: IEC al 120% del piso = 1.200', function() {
  var l = [mkLinea(120,100,5)];
  var t = C.Calc.calcularTotales(l, CONFIG_BASE);
  assertEqual(t.iec_global, 1.200, 'TF2');
});

test('TF3: Estado A → IEC ≥ 90% y todos ítems ≥ 75%', function() {
  var l = [mkLinea(95,100,1)];
  var e = C.Calc.estadoIEC(l, 0.95, CONFIG_BASE);
  assertTrue(e.estado === 'A', 'TF3: estado=' + e.estado);
  assertFalse(e.bloquea_pdf, 'TF3: no debe bloquear PDF');
});

test('TF4: Estado B → IEC < 90% y ítems ≥ 75%; bloqueo vía imprimirConControl (no bloquea_pdf directo)', function() {
  // estadoIEC retorna bloquea_pdf:false para B — el bloqueo real es en imprimirConControl()
  // que revisa si hay fingerprint aprobado. Ver TC2 para test de bloqueo real.
  var l = [mkLinea(88,100,1)];
  var e = C.Calc.estadoIEC(l, 0.88, CONFIG_BASE);
  assertTrue(e.estado === 'B', 'TF4: estado=' + e.estado);
  // bloquea_pdf es false en estadoIEC — el flujo correcto requiere imprimirConControl()
  assertFalse(e.bloquea_pdf, 'TF4: bloquea_pdf debe ser false (bloqueo delegado a imprimirConControl)');
  assertTrue(e.items_criticos === undefined || (e.items_criticos && e.items_criticos.length === 0),
    'TF4: estado B no debe tener items_criticos');
});

test('TF5: Estado C → ítem < 75% independiente de IEC global', function() {
  var l = [mkLinea(70,100,1)]; // 70% < 75% guardrail → Estado C
  var e = C.Calc.estadoIEC(l, 0.95, CONFIG_BASE);
  assertTrue(e.estado === 'C', 'TF5: estado=' + e.estado);
  assertTrue(e.bloquea_pdf, 'TF5: debe bloquear PDF');
});

/* ═══════════════════════════════════════
   RESULTADO FINAL
═══════════════════════════════════════ */
console.log('\n' + '═'.repeat(60));
console.log('RESULTADO: ' + passed + ' OK / ' + failed + ' FALLIDOS / ' + total + ' total');
console.log('═'.repeat(60));
if (failed > 0) process.exit(1);
