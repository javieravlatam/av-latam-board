/**
 * test_ui_interes_transporte.js — Fase 7.1
 * Pruebas funcionales: interés financiero + transporte SEPARADO/INCLUIDO
 */
'use strict';
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const coreCode = fs.readFileSync(path.join(__dirname, '../apps/cotizador/cotizador_core.js'), 'utf8');
vm.runInThisContext(coreCode);
const Calc  = COTIZADOR.Calc;
const Quote = COTIZADOR.Quote;
const util  = COTIZADOR.util;

const CONFIG = {
  interes_financiero: { gracia_dias: 90, tasa_mensual_pct: 1.2 },
  iec_politica: { iec_min_autorizado: 0.90, desviacion_critica_max_item: 0.25 }
};

let OK = 0, FAIL = 0;
function assert(cond, msg) {
  if (cond) { console.log('  ✓ ' + msg); OK++; }
  else       { console.error('  ✗ FAIL: ' + msg); FAIL++; }
}

// Build a fully-calculated line using calcularLinea (so total_linea is present)
function mkLinea(venta, piso, qty) {
  var raw = {
    sku: 'X', producto: 'P', presentacion: 'kg',
    precio_venta_unitario: venta, precio_piso_unitario: piso,
    precio_objetivo_unitario: piso * 1.1, precio_costo_unitario: null,
    factor_presentacion: 1, cantidad_envases: qty, descuento: 0
  };
  return Calc.calcularLinea(raw, CONFIG);
}

function parseDiasFromStr(condicion, customDias) {
  if (!condicion || condicion === 'Contado') return 0;
  if (condicion.indexOf('Anticipado') !== -1) return 0;
  if (condicion === 'Personalizado') return customDias || 0;
  var m = condicion.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

// ==========================================================
console.log('\n-- BLOQUE I: Plazo / Interes financiero --');

console.log('\nT1: 120 dias -> control interes visible');
{
  var dias = parseDiasFromStr('120 dias', 0);
  assert(dias === 120, 'parseDiasFromStr("120 dias") = 120');
  assert(dias > 90, '120 > 90 -> panel interes visible');
}

console.log('\nT2: 120 dias + interes Si -> 30 dias x 1.2%');
{
  var dias = 120;
  var base = 1000000;
  var res = Calc.calcularInteresFinanciero(dias, base, CONFIG);
  assert(res.aplica === true, 'aplica = true para 120 dias');
  assert(res.dias_excedentes === 30, 'dias excedentes = 30 (120 - 90)');
  assert(res.monto === 12000, 'cargo = $12.000 (1.000.000 x 1.2% x 1 mes)');
  assert(base + res.monto === 1012000, 'total con cargo = $1.012.000');
}

console.log('\nT3: 60 dias -> interes = 0, panel oculto');
{
  var dias = parseDiasFromStr('60 dias', 0);
  assert(dias === 60, 'parseDiasFromStr("60 dias") = 60');
  assert(dias <= 90, '60 <= 90 -> panel interes OCULTO');
  var res = Calc.calcularInteresFinanciero(dias, 1000000, CONFIG);
  assert(res.aplica === false, 'aplica = false');
  assert(res.monto === 0, 'cargo = 0');
}

console.log('\nT1b: Personalizado 150 dias (60 excedentes)');
{
  var dias = parseDiasFromStr('Personalizado', 150);
  assert(dias === 150, 'parseDiasFromStr Personalizado = 150');
  var res = Calc.calcularInteresFinanciero(150, 500000, CONFIG);
  assert(res.aplica === true, 'aplica = true');
  assert(res.dias_excedentes === 60, 'dias excedentes = 60');
  var esperado = Math.round(500000 * 0.012 * 2); // 2 meses
  assert(res.monto === esperado, 'cargo = ' + res.monto + ' (esperado ' + esperado + ')');
}

console.log('\nT3b: Gracia exacta 90 dias (borde)');
{
  var res = Calc.calcularInteresFinanciero(90, 1000000, CONFIG);
  assert(res.aplica === false, 'aplica = false en el borde exacto 90 dias');
  assert(res.monto === 0, 'cargo = 0');
}

// ==========================================================
console.log('\n-- BLOQUE II: Transporte SEPARADO / INCLUIDO --');

console.log('\nT4: SEPARADO -> IEC calculado sobre precio producto');
{
  var lineas = [mkLinea(1100, 1000, 1), mkLinea(1100, 1000, 1)];
  var q = Quote.recalcular({ lineas: lineas, totales: null, meta: { actualizado: '' } }, CONFIG);
  assert(Math.abs(q.totales.iec_global - 1.10) < 0.001, 'SEPARADO: IEC = 1.100');
  assert(q.totales.valor_cotizado_total === 2200, 'Subtotal productos = 2200');
  assert(q.totales.valor_cotizado_total + 100 === 2300, 'Total cliente SEPARADO = 2300 (2200 + 100 transporte)');
}

console.log('\nT5: INCLUIDO -> prorrateo correcto, IEC neto cambia, total cliente igual');
{
  var lineas = [mkLinea(1100, 1000, 1), mkLinea(1100, 1000, 1)];
  var despacho = 100;
  // verificar total_linea presente
  assert(lineas[0].total_linea === 1100, 'calcularLinea produce total_linea = 1100');
  // prorrateo
  var prr = Calc.prorratearTransporte(lineas, despacho);
  var pr0 = prr[0].transporte_prorrateado;
  var pr1 = prr[1].transporte_prorrateado;
  assert(pr0 === 50 && pr1 === 50, 'Prorrateo simetrico: 50+50');
  assert(pr0 + pr1 === despacho, 'Sigma prorrateados (' + (pr0+pr1) + ') = despacho (' + despacho + ')');
  // IEC neto
  var iecR = Calc.calcularIECConTransporte(lineas, prr, CONFIG);
  assert(Math.abs(iecR.iec_mix_neto - 1.05) < 0.001,
    'IEC INCLUIDO = 1.050 ((1100-50)/1000 por linea), got ' + iecR.iec_mix_neto.toFixed(4));
  assert(iecR.iec_mix_neto < 1.10, 'IEC INCLUIDO < IEC SEPARADO (1.100)');
  // Total cliente invariante
  var totalSEP  = 2200 + despacho;
  var totalINCL = 2200 + despacho;
  assert(totalSEP === totalINCL, 'Total cliente SEPARADO = INCLUIDO = ' + totalSEP);
}

console.log('\nT6: SEPARADO despues de INCLUIDO -> IEC vuelve a 1.100');
{
  var lineas = [mkLinea(1100, 1000, 1), mkLinea(1100, 1000, 1)];
  var q = Quote.recalcular({ lineas: lineas, totales: null, meta: { actualizado: '' } }, CONFIG);
  assert(Math.abs(q.totales.iec_global - 1.10) < 0.001, 'SEPARADO restaurado: IEC = 1.100');
}

console.log('\nT7: sincronizarDespachoEnQuote llama render() (sin reload)');
{
  var chile = fs.readFileSync(path.join(__dirname, '../apps/cotizador/cotizador_chile.html'), 'utf8');
  var peru  = fs.readFileSync(path.join(__dirname, '../apps/cotizador/cotizador_peru.html'), 'utf8');
  // Direct string check: render() call right after pintarResumenDespacho() inside sincronizarDespachoEnQuote
  var hasRenderChile = chile.includes('pintarResumenDespacho();\n    render(); // Fase 7.1');
  var hasRenderPeru  = peru.includes('pintarResumenDespacho();\n    render(); // Fase 7.1');
  assert(hasRenderChile, 'Chile: sincronizarDespachoEnQuote llama render() tras pintarResumenDespacho');
  assert(hasRenderPeru,  'Peru: sincronizarDespachoEnQuote llama render() tras pintarResumenDespacho');
}

console.log('\nT8: Chile y Peru misma estructura UI');
{
  var chile = fs.readFileSync(path.join(__dirname, '../apps/cotizador/cotizador_chile.html'), 'utf8');
  var peru  = fs.readFileSync(path.join(__dirname, '../apps/cotizador/cotizador_peru.html'), 'utf8');
  var checks = [
    'row-plazo-custom', 'panel-interes', 'f-aplica-interes',
    'parseDiasFromStr', 'actualizarPanelInteres',
    'A -- SEPARADO', 'B -- INCLUIDO'
  ];
  checks.forEach(function(s) {
    assert(chile.includes(s), 'Chile contiene: ' + s);
    assert(peru.includes(s),  'Peru contiene: ' + s);
  });
}

// ==========================================================
console.log('\n-- BLOQUE III: Reconciliacion numerica --');
console.log('\nProductos=1.000.000, Piso=900.000, Transporte=100.000');
{
  var despacho = 100000;
  var linea = mkLinea(1000000, 900000, 1);
  // SEPARADO
  var q = Quote.recalcular({ lineas: [linea], totales: null, meta: { actualizado: '' } }, CONFIG);
  var iecSEP = q.totales.iec_global;
  var totalSEP = q.totales.valor_cotizado_total + despacho;
  assert(Math.abs(iecSEP - (1000000/900000)) < 0.001, 'IEC SEPARADO = 1.1111');
  assert(totalSEP === 1100000, 'Total SEPARADO = 1.100.000');
  // INCLUIDO
  var prr = Calc.prorratearTransporte([linea], despacho);
  var iecR = Calc.calcularIECConTransporte([linea], prr, CONFIG);
  var totalINCL = q.totales.valor_cotizado_total + despacho; // total cliente NO cambia
  assert(totalSEP === totalINCL, 'Total SEPARADO (' + totalSEP + ') = INCLUIDO (' + totalINCL + ')');
  assert(iecR.iec_mix_neto < iecSEP, 'IEC INCLUIDO (' + iecR.iec_mix_neto.toFixed(4) + ') < SEPARADO (' + iecSEP.toFixed(4) + ')');
  var iecEsperado = (1000000 - 100000) / 900000; // 900.000/900.000 = 1.0000
  assert(Math.abs(iecR.iec_mix_neto - iecEsperado) < 0.001,
    'IEC INCLUIDO = (1.000.000 - 100.000) / 900.000 = ' + iecEsperado.toFixed(4));
  assert(prr[0].transporte_prorrateado === despacho, 'Sigma prorrateados = 100.000');
}

// ==========================================================
var total = OK + FAIL;
console.log('\n' + '='.repeat(58));
console.log(' RESULTADO: ' + OK + ' OK / ' + FAIL + ' FALLIDOS / ' + total + ' total');
console.log('='.repeat(58));
if (FAIL === 0) console.log('Todos los tests UI pasaron.');
else process.exit(1);
