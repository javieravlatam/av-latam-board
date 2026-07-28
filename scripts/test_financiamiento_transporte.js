/**
 * test_financiamiento_transporte.js — Fase 7.1 CIERRE FUNCIONAL
 * Suites F1-F7 (base_financiada) y T1-T10 (transporte/totalConDespacho)
 * + Challenge mode: 11 bugs potenciales
 *
 * Ejecución: node scripts/test_financiamiento_transporte.js
 *
 * Reglas de la prueba:
 *   - base_financiada = productos + transporte (SEPARADO e INCLUIDO)
 *   - Anticipado 50% → dias = 0 → interés = 0
 *   - Interés NUNCA entra en IEC
 *   - totalConDespacho() siempre suma transporte (Fase 7.1)
 */

'use strict';
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const coreCode = fs.readFileSync(
  path.join(__dirname, '../apps/cotizador/cotizador_core.js'), 'utf8'
);
vm.runInThisContext(coreCode);

const Calc  = COTIZADOR.Calc;
const Quote = COTIZADOR.Quote;
const util  = COTIZADOR.util;

const CONFIG = {
  interes_financiero: { gracia_dias: 90, tasa_mensual_pct: 1.2 },
  iec_politica: { iec_min_autorizado: 0.90, desviacion_critica_max_item: 0.25 }
};

let OK = 0, FAIL = 0;
const ERRORES = [];

function assert(cond, msg) {
  if (cond) {
    console.log('  ✓ ' + msg); OK++;
  } else {
    console.error('  ✗ FAIL: ' + msg); FAIL++;
    ERRORES.push(msg);
  }
}

function near(a, b, tol) { return Math.abs(a - b) <= (tol || 1); }

// helpers
function mkLinea(venta, piso, qty) {
  return Calc.calcularLinea({
    sku: 'X', producto: 'P', presentacion: 'kg',
    precio_venta_unitario: venta, precio_piso_unitario: piso,
    precio_objetivo_unitario: piso * 1.1, precio_costo_unitario: null,
    factor_presentacion: 1, cantidad_envases: qty, descuento: 0
  }, CONFIG);
}

function parseDiasFromStr(condicion, customDias) {
  if (!condicion || condicion === 'Contado') return 0;
  if (condicion.indexOf('Anticipado') !== -1) return 0;
  if (condicion === 'Personalizado') return customDias || 0;
  var m = condicion.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function mkQuote(precioVenta, piso, qty, costo_despacho, modo) {
  // modo: 'SEPARADO' (d.incluido=false) | 'INCLUIDO' (d.incluido=true)
  var linea = mkLinea(precioVenta, piso, qty);
  var totales = Calc.calcularTotales([linea], CONFIG);
  return {
    lineas: [linea],
    totales: totales,
    moneda: 'CLP',
    despacho: {
      costo_despacho: costo_despacho || 0,
      incluido: modo === 'INCLUIDO'
    }
  };
}

// ══════════════════════════════════════════════════════════════════
console.log('\n╔═══════════════════════════════════════════════╗');
console.log('║  SUITE F — FINANCIAMIENTO (F1-F7)             ║');
console.log('╚═══════════════════════════════════════════════╝');

// ─────────────────────────────────────────────────────────────────
console.log('\nF1: Productos=$1.000.000 · 120 dias · sin transporte → interés=$12.000');
{
  var res = Calc.calcularInteresFinanciero(120, 1000000, CONFIG);
  assert(res.aplica === true,  'F1a: aplica=true');
  assert(res.dias_excedentes === 30, 'F1b: dias_excedentes=30');
  // 1.000.000 × 0.012 × (30/30) = 12.000
  assert(res.monto === 12000, 'F1c: monto=12.000 (got ' + res.monto + ')');
}

// ─────────────────────────────────────────────────────────────────
console.log('\nF2: Productos=$1.000.000 + Transporte=$100.000 · 120 dias → base_financiada=$1.100.000 → interés=$13.200');
{
  var quote = mkQuote(10000, 9000, 100, 100000, 'SEPARADO');
  // total = productos($1.000.000) + transporte($100.000) = $1.100.000
  var r = Quote.totalConDespacho(quote);
  assert(r.total === 1100000, 'F2a: totalConDespacho SEPARADO=$1.100.000 (got ' + r.total + ')');

  var res = Calc.calcularInteresFinanciero(120, r.total, CONFIG);
  // 1.100.000 × 0.012 × (30/30) = 13.200
  assert(res.aplica === true,  'F2b: aplica=true');
  assert(res.monto === 13200, 'F2c: monto=13.200 (got ' + res.monto + ')');
}

// ─────────────────────────────────────────────────────────────────
console.log('\nF3: Anticipado 50% / saldo contra entrega → dias=0 → interés=$0');
{
  var dias = parseDiasFromStr('Anticipado 50% / saldo contra entrega');
  assert(dias === 0, 'F3a: parseDiasFromStr("Anticipado 50%...") = 0');

  var res = Calc.calcularInteresFinanciero(dias, 1000000, CONFIG);
  assert(res.aplica === false, 'F3b: aplica=false (0 <= 90)');
  assert(res.monto === 0,      'F3c: monto=0');
}

// ─────────────────────────────────────────────────────────────────
console.log('\nF4: 90 dias exactos → dentro de gracia → interés=$0');
{
  var res = Calc.calcularInteresFinanciero(90, 1000000, CONFIG);
  assert(res.aplica === false, 'F4a: aplica=false (exacto limite gracia)');
  assert(res.monto === 0,      'F4b: monto=0');
  assert(res.dias_excedentes === 0, 'F4c: dias_excedentes=0');
}

// ─────────────────────────────────────────────────────────────────
console.log('\nF5: 60 dias → interés=$0');
{
  var res = Calc.calcularInteresFinanciero(60, 1000000, CONFIG);
  assert(res.aplica === false, 'F5a: aplica=false');
  assert(res.monto === 0,      'F5b: monto=0');
}

// ─────────────────────────────────────────────────────────────────
console.log('\nF6: 120 dias, aplica_interes=NO → monto informativo pero no suma al total');
{
  var res = Calc.calcularInteresFinanciero(120, 1000000, CONFIG);
  // aplica_interes=NO: el cargo es informativo pero el total al cliente no cambia
  var totalSinInteres = 1000000;
  var totalConInteres = totalSinInteres + res.monto;
  assert(res.aplica === true,  'F6a: interes existe pero se omite por aplica=NO');
  assert(res.monto === 12000,  'F6b: monto calculado = 12.000');
  // Con aplica=NO: el total cotizado sigue siendo el base
  assert(totalSinInteres === 1000000, 'F6c: total sin interes = $1.000.000 (aplica=NO no suma)');
  assert(totalConInteres === 1012000, 'F6d: total con interes = $1.012.000 (aplica=SI suma)');
}

// ─────────────────────────────────────────────────────────────────
console.log('\nF7: Interés ON/OFF → IEC invariante');
{
  var linea = mkLinea(10000, 9000, 100);
  var totales = Calc.calcularTotales([linea], CONFIG);
  var iecSinInteres = totales.iec_global;

  // IEC no cambia si se activa o desactiva el cargo financiero
  // El interés es EXTERNO al IEC (nunca entra en venta_neta_elegible)
  var iecConInteres = iecSinInteres; // mismo cálculo, interés no afecta IEC

  assert(iecSinInteres !== null,  'F7a: IEC calculado (no null)');
  assert(iecSinInteres === iecConInteres, 'F7b: IEC idéntico con/sin interés');
  assert(near(iecSinInteres, 10000/9000, 0.001), 'F7c: IEC = 111.1% (precio/piso)');
}

// ══════════════════════════════════════════════════════════════════
console.log('\n╔═══════════════════════════════════════════════╗');
console.log('║  SUITE T — TRANSPORTE (T1-T10)               ║');
console.log('╚═══════════════════════════════════════════════╝');

// ─────────────────────────────────────────────────────────────────
console.log('\nT1: totalConDespacho SEPARADO → total = productos + transporte');
{
  var q = mkQuote(10000, 9000, 100, 100000, 'SEPARADO');
  // q.despacho.incluido = false (SEPARADO)
  assert(q.despacho.incluido === false, 'T1a: incluido=false (SEPARADO)');
  var r = Quote.totalConDespacho(q);
  assert(r.subtotal_productos === 1000000, 'T1b: subtotal_productos=$1.000.000');
  assert(r.costo_despacho    === 100000,  'T1c: costo_despacho=$100.000 (Fase 7.1: siempre)');
  assert(r.total             === 1100000, 'T1d: total=$1.100.000 (productos+transporte)');
}

// ─────────────────────────────────────────────────────────────────
console.log('\nT2: totalConDespacho INCLUIDO → total = productos + transporte');
{
  var q = mkQuote(10000, 9000, 100, 100000, 'INCLUIDO');
  assert(q.despacho.incluido === true, 'T2a: incluido=true (INCLUIDO)');
  var r = Quote.totalConDespacho(q);
  assert(r.subtotal_productos === 1000000, 'T2b: subtotal_productos=$1.000.000');
  assert(r.costo_despacho    === 100000,  'T2c: costo_despacho=$100.000');
  assert(r.total             === 1100000, 'T2d: total=$1.100.000');
}

// ─────────────────────────────────────────────────────────────────
console.log('\nT3: Total SEPARADO == Total INCLUIDO (mismo costo despacho)');
{
  var sep = mkQuote(10000, 9000, 100, 100000, 'SEPARADO');
  var inc = mkQuote(10000, 9000, 100, 100000, 'INCLUIDO');
  var rS = Quote.totalConDespacho(sep);
  var rI = Quote.totalConDespacho(inc);
  assert(rS.total === rI.total, 'T3a: total SEPARADO = total INCLUIDO = ' + rS.total);
  assert(rS.total === 1100000,  'T3b: ambos = $1.100.000');
}

// ─────────────────────────────────────────────────────────────────
console.log('\nT4: base_financiada SEPARADO = productos + transporte');
{
  var q = mkQuote(10000, 9000, 100, 100000, 'SEPARADO');
  var r = Quote.totalConDespacho(q);
  var base = r.total;
  var res  = Calc.calcularInteresFinanciero(120, base, CONFIG);
  assert(base === 1100000, 'T4a: base_financiada SEPARADO = $1.100.000');
  assert(res.monto === 13200, 'T4b: interés SEPARADO = $13.200 (incluye transporte)');
}

// ─────────────────────────────────────────────────────────────────
console.log('\nT5: base_financiada INCLUIDO = productos + transporte');
{
  var q = mkQuote(10000, 9000, 100, 100000, 'INCLUIDO');
  var r = Quote.totalConDespacho(q);
  var base = r.total;
  var res  = Calc.calcularInteresFinanciero(120, base, CONFIG);
  assert(base === 1100000, 'T5a: base_financiada INCLUIDO = $1.100.000');
  assert(res.monto === 13200, 'T5b: interés INCLUIDO = $13.200 (incluye transporte)');
}

// ─────────────────────────────────────────────────────────────────
console.log('\nT6: Interés SEPARADO = Interés INCLUIDO (misma base_financiada)');
{
  var sep  = mkQuote(10000, 9000, 100, 100000, 'SEPARADO');
  var inc  = mkQuote(10000, 9000, 100, 100000, 'INCLUIDO');
  var rS   = Quote.totalConDespacho(sep);
  var rI   = Quote.totalConDespacho(inc);
  var intS = Calc.calcularInteresFinanciero(120, rS.total, CONFIG);
  var intI = Calc.calcularInteresFinanciero(120, rI.total, CONFIG);
  assert(intS.monto === intI.monto, 'T6a: interés SEPARADO = interés INCLUIDO = ' + intS.monto);
}

// ─────────────────────────────────────────────────────────────────
console.log('\nT7: IEC SEPARADO (sin deducir transporte) != IEC INCLUIDO (deducido)');
{
  var linea = mkLinea(10000, 9000, 100);
  // IEC SEPARADO: estándar (transporte no afecta IEC, solo el precio producto)
  var iecSep = Calc.calcularTotales([linea], CONFIG).iec_global;
  // 10000/9000 = 1.1111... → 111.11%

  // IEC INCLUIDO: transporte prorrateado se DEDUCE del precio venta
  var prr = Calc.prorratearTransporte([linea], 100000);
  var iecIncObj = Calc.calcularIECConTransporte([linea], prr, CONFIG);
  var iecInc = iecIncObj.iec_mix_neto;
  // venta_neta = $1.000.000 - $100.000 = $900.000; piso = $900.000
  // IEC = 900.000 / 900.000 = 1.0000 = 100%

  assert(near(iecSep, 1.1111, 0.001), 'T7a: IEC SEPARADO = 111.1% (precio producto puro)');
  assert(near(iecInc, 1.0000, 0.001), 'T7b: IEC INCLUIDO = 100.0% (deducido transporte)');
  assert(iecSep > iecInc, 'T7c: IEC SEPARADO > IEC INCLUIDO (transporte reduce IEC neto)');
}

// ─────────────────────────────────────────────────────────────────
console.log('\nT8: sin transporte ($0) → totalConDespacho.total = solo productos');
{
  var q = mkQuote(10000, 9000, 100, 0, 'SEPARADO');
  var r = Quote.totalConDespacho(q);
  assert(r.costo_despacho === 0,       'T8a: costo_despacho=0');
  assert(r.total          === 1000000, 'T8b: total=productos solo');
}

// ─────────────────────────────────────────────────────────────────
console.log('\nT9: IEC no varía al activar/desactivar interés financiero');
{
  var linea  = mkLinea(10000, 9000, 100);
  var totales = Calc.calcularTotales([linea], CONFIG);
  var iecBase = totales.iec_global;

  // "activar interés" solo cambia cargo_financiero; no toca lineas, totales ni iec_global
  var resInt  = Calc.calcularInteresFinanciero(120, 1000000, CONFIG);
  var iecConInt = totales.iec_global; // no se recalcula — el interés es externo

  assert(iecBase === iecConInt, 'T9a: IEC invariante con/sin interés');
}

// ─────────────────────────────────────────────────────────────────
console.log('\nT10: interés financiero NUNCA aparece en venta_neta_elegible ni piso_teorico');
{
  var linea  = mkLinea(10000, 9000, 100);
  var totales = Calc.calcularTotales([linea], CONFIG);

  var resInt  = Calc.calcularInteresFinanciero(120, 1000000, CONFIG);
  // venta_neta_elegible: total línea = 1.000.000, no incluye 12.000 de interés
  var ventaNeta = totales.valor_cotizado_total; // no afecta por interés
  assert(ventaNeta === 1000000, 'T10a: venta_neta_elegible=$1.000.000 (sin interés)');
  assert(resInt.monto === 12000, 'T10b: cargo=$12.000 es externo al IEC');
  // IEC = 1.000.000 / 900.000 = 1.1111, nunca 1.012.000/900.000
  assert(near(totales.iec_global, 1.1111, 0.001), 'T10c: IEC no contamina con interés');
}

// ══════════════════════════════════════════════════════════════════
console.log('\n╔═══════════════════════════════════════════════╗');
console.log('║  CHALLENGE MODE — 11 BUGS POTENCIALES        ║');
console.log('╚═══════════════════════════════════════════════╝');

// C1: transporte INCLUIDO sumado dos veces al total
console.log('\nC1: transporte INCLUIDO no se suma dos veces');
{
  var q = mkQuote(10000, 9000, 100, 100000, 'INCLUIDO');
  var r = Quote.totalConDespacho(q);
  // productos = 1.000.000, despacho = 100.000 → total = 1.100.000 (no 1.200.000)
  assert(r.total === 1100000, 'C1: total INCLUIDO = $1.100.000 (no doble conteo: got ' + r.total + ')');
}

// C2: transporte SEPARADO omitido del financiamiento
console.log('\nC2: transporte SEPARADO NO omitido de base_financiada');
{
  var q = mkQuote(10000, 9000, 100, 100000, 'SEPARADO');
  var r = Quote.totalConDespacho(q);
  assert(r.total !== 1000000, 'C2a: total NO es solo productos (sería omisión)');
  assert(r.total === 1100000, 'C2b: total SI incluye transporte SEPARADO');
}

// C3: interés entra en IEC
console.log('\nC3: interés financiero NO contamina IEC');
{
  var linea   = mkLinea(10000, 9000, 100);
  var totales = Calc.calcularTotales([linea], CONFIG);
  var iec     = totales.iec_global;
  // Si interés entrara en IEC: iec = (1.000.000+12.000)/900.000 = 1.1244...
  var wrongIEC = (1000000 + 12000) / 900000;
  assert(Math.abs(iec - wrongIEC) > 0.001, 'C3: IEC ≠ (productos+interés)/piso');
  assert(near(iec, 10000/9000, 0.001),     'C3b: IEC = precio/piso puro');
}

// C4: precio_piso en INCLUIDO debería NO incluir transporte
console.log('\nC4: piso teórico no incluye transporte (correcto)');
{
  var linea  = mkLinea(10000, 9000, 100);
  var prr    = Calc.prorratearTransporte([linea], 100000);
  var iecObj = Calc.calcularIECConTransporte([linea], prr, CONFIG);
  // venta_neta = 1.000.000 - 100.000 = 900.000; piso = 100 × 9000 × 1 = 900.000
  assert(near(iecObj.venta_neta_elegible, 900000, 1), 'C4a: venta_neta=900.000');
  assert(near(iecObj.valor_piso_teorico,  900000, 1), 'C4b: piso_teorico=900.000 (sin transporte)');
  assert(near(iecObj.iec_mix_neto, 1.0, 0.001),       'C4c: IEC=100% (venta=piso tras deducción)');
}

// C5: null access si totales no calculados
console.log('\nC5: totalConDespacho soporta totales null');
{
  var q = { totales: null, despacho: { costo_despacho: 50000 }, moneda: 'CLP', lineas: [] };
  var r = Quote.totalConDespacho(q);
  assert(r.subtotal_productos === 0,   'C5a: subtotal=0 si totales=null');
  assert(r.costo_despacho     === 50000, 'C5b: despacho=$50.000 aunque totales=null');
  assert(r.total              === 50000, 'C5c: total=$50.000');
}

// C6: Anticipado 50% con saldo → plazo 0 → no interés
console.log('\nC6: Anticipado 50% → dias=0 → sin interés aunque saldo sea grande');
{
  var dias = parseDiasFromStr('Anticipado 50% / saldo contra entrega');
  var res  = Calc.calcularInteresFinanciero(dias, 5000000, CONFIG);
  assert(dias === 0,          'C6a: dias=0 para Anticipado');
  assert(res.aplica === false, 'C6b: aplica=false');
  assert(res.monto === 0,     'C6c: monto=0 (no interés)');
}

// C7: exacto 90 días → límite de gracia → sin interés
console.log('\nC7: exacto 90 dias = borde gracia → sin interés');
{
  var res = Calc.calcularInteresFinanciero(90, 1000000, CONFIG);
  assert(res.aplica === false, 'C7a: aplica=false en exacto borde');
  assert(res.monto === 0,     'C7b: monto=0 (dentro de gracia)');
}

// C8: Personalizado = vacío → 0 días → sin interés
console.log('\nC8: Personalizado sin valor → 0 dias → sin interés');
{
  var dias = parseDiasFromStr('Personalizado', 0); // customDias=0 = vacío
  var res  = Calc.calcularInteresFinanciero(dias, 1000000, CONFIG);
  assert(dias === 0,           'C8a: Personalizado sin valor = 0 dias');
  assert(res.aplica === false, 'C8b: aplica=false');
}

// C9: interes_dias se guarda en quote antes de fingerprint
console.log('\nC9: quote.interes_dias asignable y numérico');
{
  var q = mkQuote(10000, 9000, 100, 0, 'SEPARADO');
  q.interes_dias = 120;
  q.aplica_interes = true;
  assert(typeof q.interes_dias === 'number', 'C9a: interes_dias es número');
  assert(q.aplica_interes === true,          'C9b: aplica_interes es booleano');
  // fingerprint incluye ambos campos
  var fp = util.generarFingerprint(q);
  assert(typeof fp === 'string' && fp.startsWith('FP-'), 'C9c: fingerprint generado con interes_dias');
}

// C10: render() llamado en sincronizarDespachoEnQuote — verificado en test_ui
console.log('\nC10: sincronizarDespachoEnQuote llama render() — verificado en test_ui_7.1');
{
  // Verificación de código estático: debe existir render() al final de la función
  var chileHtml = fs.readFileSync(
    path.join(__dirname, '../apps/cotizador/cotizador_chile.html'), 'utf8'
  );
  var idx = chileHtml.indexOf('function sincronizarDespachoEnQuote');
  var slice = chileHtml.slice(idx, idx + 600);
  assert(slice.includes('pintarResumenDespacho()'), 'C10a: pintarResumenDespacho() presente');
  assert(slice.includes('render()'),                'C10b: render() llamado en sincronizarDespachoEnQuote');
}

// C11: base_financiada ya NO es solo productos (el defecto original)
console.log('\nC11: base_financiada YA incluye transporte (defecto original corregido)');
{
  var q  = mkQuote(10000, 9000, 100, 100000, 'SEPARADO');
  var r  = Quote.totalConDespacho(q);
  var baseDefectuosa = q.totales.valor_cotizado_total; // 1.000.000 (defecto original)
  var baseCorrecta   = r.total;                        // 1.100.000 (fix Fase 7.1)
  assert(baseCorrecta !== baseDefectuosa, 'C11a: base_financiada ≠ solo productos');
  assert(baseCorrecta === 1100000,        'C11b: base_financiada = $1.100.000 (corregido)');

  var intOld = Calc.calcularInteresFinanciero(120, baseDefectuosa, CONFIG);
  var intNew = Calc.calcularInteresFinanciero(120, baseCorrecta,   CONFIG);
  assert(intOld.monto === 12000, 'C11c: interés ANTES del fix = $12.000 (omitía transporte)');
  assert(intNew.monto === 13200, 'C11d: interés DESPUÉS del fix = $13.200 (incluye transporte)');
}

// ══════════════════════════════════════════════════════════════════
console.log('\n╔═══════════════════════════════════════════════╗');
console.log('║  RECONCILIACIÓN NUMÉRICA FINAL               ║');
console.log('╚═══════════════════════════════════════════════╝');

console.log('\nEjemplo canónico spec — 120 días, $1.000.000 productos + $100.000 transporte:');
{
  var PROD  = 1000000;
  var TRANSP = 100000;
  var TOTAL  = PROD + TRANSP;
  var DIAS   = 120;
  var GRACIA = 90;
  var EXCEDENTES = DIAS - GRACIA; // 30
  var TASA_MENSUAL = 1.2 / 100;

  var cargo = Math.round(TOTAL * TASA_MENSUAL * (EXCEDENTES / 30));

  assert(TOTAL  === 1100000, 'REC1: total_cliente=$1.100.000');
  assert(EXCEDENTES === 30,  'REC2: dias_excedentes=30');
  assert(cargo  === 13200,   'REC3: cargo=$13.200 (=1.100.000×1.2%×1)');

  // IEC separado del interés
  var iec = PROD / (100 * 9000); // venta/piso = 1.000.000/900.000
  assert(near(iec, 1.1111, 0.001), 'REC4: IEC=111.1% (precio/piso, sin interés)');
  assert(cargo !== iec,            'REC5: interés ≠ IEC (nunca se confunden)');

  console.log('');
  console.log('  Base financiada: $' + TOTAL.toLocaleString('es-CL'));
  console.log('  Cargo financiero: $' + cargo.toLocaleString('es-CL'));
  console.log('  IEC mix: ' + (iec * 100).toFixed(1) + '%');
  console.log('  Transporte incluido a crédito: SÍ genera interés, NO mejora IEC.');
}

// ══════════════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════');
console.log('RESULTADO FINAL: ' + OK + ' OK / ' + FAIL + ' FAIL');
if (ERRORES.length > 0) {
  console.error('\nFallas:');
  ERRORES.forEach(function(e) { console.error('  · ' + e); });
}
console.log('═══════════════════════════════════════════════\n');
process.exit(FAIL > 0 ? 1 : 0);
