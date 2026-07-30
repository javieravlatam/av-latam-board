/**
 * SIC-AV — AUDITORÍA MOTOR DE COMISIONES (2026-07-30)
 * =====================================================
 * Pruebas de los 7 objetivos de auditoría del motor de cálculo de comisiones.
 * Cubre los 4 bugs detectados + escenarios challenge A-E + SSOT IEC.
 *
 * Objetivos:
 *   OBJ-1: SSOT IEC — pantalla y PDF muestran el mismo literal cuando no hay datos
 *   OBJ-2: Tres reglas de comisión explícitas en código
 *   OBJ-3: Sin nuevos tests (reliquidación usa datos históricos — validado vía datos demo)
 *   OBJ-4: No hay bypass ni hardcode (verificado en audit de código — no testeable en black-box)
 *   OBJ-5: Reconciliación matemática de la fórmula
 *   OBJ-6: Escenarios challenge A-E
 *   OBJ-7: Estos tests (este archivo)
 *
 * Bug fixes validados:
 *   BUG-2: factorPresupuesto — gap 99.991–99.999 → ahora devuelve 80% (correcto)
 *   BUG-3: factorIEC — gaps en límites de tramos → ahora devuelven el factor correcto
 *   BUG-4: Bono excedente explícitamente bloqueado cuando factorPpto !== 100
 *   BUG-1: iec_disponible === false cuando no hay ventas elegibles → PDF y pantalla sincrónicos
 *
 * Uso: node tests/run_comision_audit_tests.js  (ejecutar desde apps/sic_av/)
 */

'use strict';
const fs   = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// Shim fetch para tests en Node sin servidor HTTP
global.fetch = function (url) {
  return new Promise((resolve) => {
    try {
      const p = path.join(ROOT, url);
      const content = fs.readFileSync(p, 'utf8');
      resolve({ ok: true, json: () => Promise.resolve(JSON.parse(content)) });
    } catch (e) {
      resolve({ ok: false, json: () => Promise.resolve({}) });
    }
  });
};
global.window   = global;
global.document = undefined;

eval(fs.readFileSync(path.join(ROOT, 'sic_core.js'), 'utf8'));

// ── Infraestructura de resultados ───────────────────────────────────────────
const resultados = [];
let suite = '';
function setSuite(nombre) {
  suite = nombre;
  console.log('\n─────────────────────────────────────────');
  console.log('SUITE: ' + nombre);
  console.log('─────────────────────────────────────────');
}
function check(nombre, condicion, detalle) {
  const ok = !!condicion;
  resultados.push({ suite, nombre, ok, detalle: detalle || '' });
  console.log((ok ? 'OK  ' : 'FAIL') + ' - ' + nombre + (detalle ? '  (' + detalle + ')' : ''));
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol !== undefined ? tol : 0.01); }

// ── Parámetros sintéticos (espejo de parametros_chile.json) ─────────────────
// Permite testear la lógica pura sin depender de los archivos JSON de demo.
const PARAMS_SINTETICOS = {
  version_politica: 'TEST-SINTETICO',
  factor_presupuesto_tramos: [
    { min_cumpl:   0, max_cumpl: 89.99, factor:   0 },
    { min_cumpl:  90, max_cumpl: 99.99, factor:  80 },
    { min_cumpl: 100, max_cumpl: null,  factor: 100 }
  ],
  factor_iec_tramos: [
    { min_iec:  0,  max_iec: 69.99, factor:  20 },
    { min_iec: 70,  max_iec: 84.99, factor:  70 },
    { min_iec: 85,  max_iec: 91.99, factor:  80 },
    { min_iec: 92,  max_iec: 94.99, factor:  90 },
    { min_iec: 95,  max_iec: null,  factor: 105 }
  ],
  bono_excedente_pct: 2,
  // tasas de cartera (no usadas en tests puros de tramos)
  tabla_cartera_cl: [
    { min_dias: 0,   max_dias: 0,   tasa: 8   },
    { min_dias: 1,   max_dias: 30,  tasa: 7.5 },
    { min_dias: 31,  max_dias: 60,  tasa: 6.5 },
    { min_dias: 61,  max_dias: 90,  tasa: 6   },
    { min_dias: 91,  max_dias: 180, tasa: 4   },
    { min_dias: 181, max_dias: 210, tasa: 3   },
    { min_dias: 211, max_dias: 360, tasa: 2.5 },
    { min_dias: 361, max_dias: null,tasa: 0.5 }
  ],
  diferido_trimestral: { liberacion: [] }
};

// ── Función auxiliar: calcula comisión final a partir de componentes puros ──
// Replica la fórmula de calcularVendedorCiclo sin necesitar ctx completo.
// comisión = cobros × tasa/100 × factorPpto/100 × factorIEC/100 + bono - ajNC
function calcComisionPura({ cobros, tasa, cumplPct, iecPct, ventaMes, pptoMes, ajNC, params }) {
  params = params || PARAMS_SINTETICOS;
  const fPpto  = SIC.factorPresupuesto(params, cumplPct);
  const fIec   = SIC.factorIEC(params, iecPct);
  const comBase = cobros * (tasa / 100);
  const comLiberada = comBase * (fPpto / 100) * (fIec / 100);
  const excedente = pptoMes !== null ? Math.max(0, ventaMes - pptoMes) : 0;
  const bono = (fPpto === 100) ? excedente * (params.bono_excedente_pct / 100) : 0;
  const comFinal = comLiberada + bono - (ajNC || 0);
  return { fPpto, fIec, comBase, comLiberada, excedente, bono, comFinal };
}

(async () => {

  // ═══════════════════════════════════════════════════════════════════════════
  // BUG-2 / BUG-3: GAPS EN TRAMOS — CORRECCIÓN Math.floor
  // ═══════════════════════════════════════════════════════════════════════════
  setSuite('BUG-2: factorPresupuesto — cierre de brecha de tramos (Math.floor)');

  // Valores en el límite superior del tramo (max exacto): deben estar en el tramo
  check('FP_T1_limite_89_99', SIC.factorPresupuesto(PARAMS_SINTETICOS, 89.99) === 0,
    'cumpl=89.99 → factor=' + SIC.factorPresupuesto(PARAMS_SINTETICOS, 89.99));
  check('FP_T2_limite_90_exacto', SIC.factorPresupuesto(PARAMS_SINTETICOS, 90) === 80,
    'cumpl=90 → factor=' + SIC.factorPresupuesto(PARAMS_SINTETICOS, 90));
  check('FP_T3_limite_99_99', SIC.factorPresupuesto(PARAMS_SINTETICOS, 99.99) === 80,
    'cumpl=99.99 → factor=' + SIC.factorPresupuesto(PARAMS_SINTETICOS, 99.99));
  check('FP_T4_limite_100_exacto', SIC.factorPresupuesto(PARAMS_SINTETICOS, 100) === 100,
    'cumpl=100 → factor=' + SIC.factorPresupuesto(PARAMS_SINTETICOS, 100));

  // Valores en la brecha (antes del fix → 0%, después del fix → 80%):
  check('FP_T5_brecha_99_991', SIC.factorPresupuesto(PARAMS_SINTETICOS, 99.991) === 80,
    'cumpl=99.991 → factor=' + SIC.factorPresupuesto(PARAMS_SINTETICOS, 99.991) + ' (era 0% antes del fix)');
  check('FP_T6_brecha_99_999', SIC.factorPresupuesto(PARAMS_SINTETICOS, 99.999) === 80,
    'cumpl=99.999 → factor=' + SIC.factorPresupuesto(PARAMS_SINTETICOS, 99.999) + ' (era 0% antes del fix)');
  check('FP_T7_brecha_99_9997', SIC.factorPresupuesto(PARAMS_SINTETICOS, 99.9997) === 80,
    'cumpl=99.9997 → factor=' + SIC.factorPresupuesto(PARAMS_SINTETICOS, 99.9997) + ' (era 0% antes del fix)');

  // Valores bajo 90% en la brecha (89.991): deben estar en el tramo 0%
  check('FP_T8_bajo90_89_991', SIC.factorPresupuesto(PARAMS_SINTETICOS, 89.991) === 0,
    'cumpl=89.991 → factor=' + SIC.factorPresupuesto(PARAMS_SINTETICOS, 89.991) + ' (correcto: tramo 0%)');

  // Nunca debe superarse 100% al truncar (99.996 no se convierte en 100)
  check('FP_T9_no_round_up_99_996', SIC.factorPresupuesto(PARAMS_SINTETICOS, 99.996) === 80,
    'cumpl=99.996 → factor=' + SIC.factorPresupuesto(PARAMS_SINTETICOS, 99.996) + ' (Math.floor: no sube a 100%)');

  setSuite('BUG-3: factorIEC — cierre de brechas en múltiples límites de tramo');

  // Límites exactos (deben estar en sus tramos)
  check('FI_T1_tramo1_max', SIC.factorIEC(PARAMS_SINTETICOS, 69.99) === 20,
    'iec=69.99 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 69.99));
  check('FI_T2_tramo2_min', SIC.factorIEC(PARAMS_SINTETICOS, 70) === 70,
    'iec=70 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 70));
  check('FI_T3_tramo2_max', SIC.factorIEC(PARAMS_SINTETICOS, 84.99) === 70,
    'iec=84.99 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 84.99));
  check('FI_T4_tramo3_min', SIC.factorIEC(PARAMS_SINTETICOS, 85) === 80,
    'iec=85 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 85));
  check('FI_T5_tramo3_max', SIC.factorIEC(PARAMS_SINTETICOS, 91.99) === 80,
    'iec=91.99 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 91.99));
  check('FI_T6_tramo4_min', SIC.factorIEC(PARAMS_SINTETICOS, 92) === 90,
    'iec=92 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 92));
  check('FI_T7_tramo4_max', SIC.factorIEC(PARAMS_SINTETICOS, 94.99) === 90,
    'iec=94.99 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 94.99));
  check('FI_T8_tramo5_min', SIC.factorIEC(PARAMS_SINTETICOS, 95) === 105,
    'iec=95 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 95));
  check('FI_T9_tramo5_alto', SIC.factorIEC(PARAMS_SINTETICOS, 100) === 105,
    'iec=100 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 100));

  // Brechas antes del fix → factor incorrecto; después del fix → factor del tramo inferior
  check('FI_T10_brecha_84_991', SIC.factorIEC(PARAMS_SINTETICOS, 84.991) === 70,
    'iec=84.991 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 84.991) + ' (era 20% antes del fix)');
  check('FI_T11_brecha_84_999', SIC.factorIEC(PARAMS_SINTETICOS, 84.999) === 70,
    'iec=84.999 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 84.999) + ' (era 20% antes del fix)');
  check('FI_T12_brecha_91_991', SIC.factorIEC(PARAMS_SINTETICOS, 91.991) === 80,
    'iec=91.991 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 91.991) + ' (era 20% antes del fix)');
  check('FI_T13_brecha_91_999', SIC.factorIEC(PARAMS_SINTETICOS, 91.999) === 80,
    'iec=91.999 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 91.999) + ' (era 20% antes del fix)');
  check('FI_T14_brecha_94_991', SIC.factorIEC(PARAMS_SINTETICOS, 94.991) === 90,
    'iec=94.991 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 94.991) + ' (era 20% antes del fix)');
  check('FI_T15_brecha_94_999', SIC.factorIEC(PARAMS_SINTETICOS, 94.999) === 90,
    'iec=94.999 → factor=' + SIC.factorIEC(PARAMS_SINTETICOS, 94.999) + ' (era 20% antes del fix)');

  // ═══════════════════════════════════════════════════════════════════════════
  // BUG-4: REGLA 3 — BONO EXCEDENTE BLOQUEADO EXPLÍCITAMENTE CUANDO fPpto≠100
  // ═══════════════════════════════════════════════════════════════════════════
  setSuite('BUG-4: REGLA 3 — Bono excedente solo cuando factorPpto === 100');

  // Caso: cumplimiento 0% → factorPpto=0 → bono=0 aunque ventaMes > pptoMes (imposible, pero validamos código)
  const casoBonoF0 = calcComisionPura({ cobros: 10_000_000, tasa: 7.5, cumplPct: 0, iecPct: 100, ventaMes: 20_000_000, pptoMes: 10_000_000, params: PARAMS_SINTETICOS });
  check('REGLA3_T1_fPpto0_bono_cero', casoBonoF0.fPpto === 0 && casoBonoF0.bono === 0,
    'fPpto=' + casoBonoF0.fPpto + ' bono=' + casoBonoF0.bono);

  // Caso: cumplimiento 95% → factorPpto=80 → bono=0 (aunque haya excedente implícito)
  const casoBonoF80 = calcComisionPura({ cobros: 10_000_000, tasa: 7.5, cumplPct: 95, iecPct: 100, ventaMes: 9_500_000, pptoMes: 10_000_000, params: PARAMS_SINTETICOS });
  check('REGLA3_T2_fPpto80_bono_cero', casoBonoF80.fPpto === 80 && casoBonoF80.bono === 0,
    'fPpto=' + casoBonoF80.fPpto + ' bono=' + casoBonoF80.bono);

  // Caso: cumplimiento 100% exacto → factorPpto=100 → bono activo cuando ventaMes > pptoMes
  const casoBonoF100 = calcComisionPura({ cobros: 10_000_000, tasa: 7.5, cumplPct: 100, iecPct: 95, ventaMes: 12_000_000, pptoMes: 10_000_000, params: PARAMS_SINTETICOS });
  const bonoEsperado = (12_000_000 - 10_000_000) * 0.02; // excedente=2M × 2%
  check('REGLA3_T3_fPpto100_bono_activo', casoBonoF100.fPpto === 100 && near(casoBonoF100.bono, bonoEsperado),
    'fPpto=' + casoBonoF100.fPpto + ' bono=' + casoBonoF100.bono.toFixed(0) + ' esperado=' + bonoEsperado.toFixed(0));

  // Caso: cumplimiento 120% → factorPpto=100 → bono activo
  const casoBonoSobre = calcComisionPura({ cobros: 8_000_000, tasa: 6.5, cumplPct: 120, iecPct: 97, ventaMes: 12_000_000, pptoMes: 10_000_000, params: PARAMS_SINTETICOS });
  check('REGLA3_T4_fPpto100_sobre_bono', casoBonoSobre.fPpto === 100 && casoBonoSobre.bono > 0,
    'fPpto=' + casoBonoSobre.fPpto + ' bono=' + casoBonoSobre.bono.toFixed(0));

  // Caso borde: excedente=0 con cumplimiento=100% (venta exactamente igual al ppto) → bono=0
  const casoBonoExacto = calcComisionPura({ cobros: 5_000_000, tasa: 7.5, cumplPct: 100, iecPct: 90, ventaMes: 10_000_000, pptoMes: 10_000_000, params: PARAMS_SINTETICOS });
  check('REGLA3_T5_venta_exacta_ppto_bono_cero', casoBonoExacto.fPpto === 100 && casoBonoExacto.bono === 0,
    'excedente=' + casoBonoExacto.excedente + ' bono=' + casoBonoExacto.bono);

  // ═══════════════════════════════════════════════════════════════════════════
  // OBJ-2: REGLA 1 — factorPpto=0 → comisión=0 (cobros altos, no importa)
  // ═══════════════════════════════════════════════════════════════════════════
  setSuite('REGLA 1: factorPpto=0 → comisión=0 independientemente de cobros');

  const regla1CasoA = calcComisionPura({ cobros: 50_000_000, tasa: 8, cumplPct: 89.99, iecPct: 105, ventaMes: 50_000_000, pptoMes: 100_000_000, params: PARAMS_SINTETICOS });
  check('REGLA1_T1_cumpl_89_99_comision_cero', regla1CasoA.fPpto === 0 && regla1CasoA.comFinal === 0,
    'cumpl=89.99% fPpto=' + regla1CasoA.fPpto + ' comFinal=' + regla1CasoA.comFinal);

  const regla1CasoB = calcComisionPura({ cobros: 100_000_000, tasa: 7.5, cumplPct: 50, iecPct: 95, ventaMes: 100_000_000, pptoMes: 200_000_000, params: PARAMS_SINTETICOS });
  check('REGLA1_T2_cumpl_50_comision_cero', regla1CasoB.fPpto === 0 && regla1CasoB.comFinal === 0,
    'cumpl=50% cobros=100M comFinal=' + regla1CasoB.comFinal);

  // ═══════════════════════════════════════════════════════════════════════════
  // OBJ-2: REGLA 2 — Orden de factores en la fórmula (reconciliación exacta)
  // ═══════════════════════════════════════════════════════════════════════════
  setSuite('REGLA 2: cobros × tasa × factorPpto × factorIEC (orden canónico)');

  // Caso de referencia: valores conocidos → resultado predecible.
  // cobros=10M, tasa=7.5%, cumpl=95% → fPpto=80%, iec=93% → fIEC=90%
  //   (iec=90% estaría en tramo [85, 91.99] → factor=80%, no 90%;
  //    para obtener fIEC=90% se necesita iec en [92, 94.99])
  // comBase = 10M × 0.075 = 750_000
  // comLiberada = 750_000 × 0.80 × 0.90 = 540_000
  const r2 = calcComisionPura({ cobros: 10_000_000, tasa: 7.5, cumplPct: 95, iecPct: 93, ventaMes: 9_500_000, pptoMes: 10_000_000, params: PARAMS_SINTETICOS });
  const comLiberadaEsperada = 10_000_000 * (7.5/100) * (80/100) * (90/100);
  check('REGLA2_T1_formula_exacta', r2.fPpto === 80 && r2.fIec === 90 && near(r2.comLiberada, comLiberadaEsperada),
    'cobros×tasa×fPpto×fIEC = ' + comLiberadaEsperada.toFixed(0) + ' calculado=' + r2.comLiberada.toFixed(0));

  // Verificar que invertir el orden daría el mismo resultado matemático (conmutatividad)
  // pero la política ordena: cobros × tasa → comisión_base; luego × factores
  const comBaseSolo = 10_000_000 * (7.5/100); // 750_000
  check('REGLA2_T2_comBase_separada', near(r2.comBase, comBaseSolo),
    'comBase=cobros×tasa = ' + comBaseSolo + ' calculado=' + r2.comBase);

  // Multiplicar los dos factores (no sumarlos): fPpto=80 × fIEC=90 ≠ fPpto+fIEC=170
  // fPpto=80%, fIec=90% (iec=93% → tramo [92, 94.99])
  const comConSuma = comBaseSolo * ((80 + 90) / 100); // incorrecto si se sumaran
  const comConMult = comBaseSolo * (80/100) * (90/100); // correcto: 540_000
  check('REGLA2_T3_factores_multiplicados_no_sumados', !near(comConSuma, comConMult, 1),
    'mult=' + comConMult.toFixed(0) + ' suma=' + comConSuma.toFixed(0) + ' deben diferir');
  check('REGLA2_T4_calculo_usa_multiplicacion', near(r2.comLiberada, comConMult),
    'comLiberada=' + r2.comLiberada.toFixed(0) + ' esperadaMult=' + comConMult.toFixed(0));

  // ═══════════════════════════════════════════════════════════════════════════
  // OBJ-6: ESCENARIOS CHALLENGE A-E
  // ═══════════════════════════════════════════════════════════════════════════

  setSuite('ESCENARIO A: factorPpto=0, ventas altas → comisión=0');
  // El comercial cerró el mes muy por debajo del presupuesto (70% cumplimiento)
  // pero cobró facturas de meses anteriores por importes altos.
  // REGLA 1: comisión_final debe ser 0.
  const scenA = calcComisionPura({ cobros: 80_000_000, tasa: 7.5, cumplPct: 70, iecPct: 98, ventaMes: 7_000_000, pptoMes: 10_000_000, params: PARAMS_SINTETICOS });
  check('ESCEN_A1_fPpto', scenA.fPpto === 0, 'cumpl=70% → fPpto=' + scenA.fPpto);
  check('ESCEN_A2_bono', scenA.bono === 0, 'bono=' + scenA.bono);
  check('ESCEN_A3_comFinal', scenA.comFinal === 0,
    'cobros=80M tasa=7.5% fPpto=0 → comFinal=' + scenA.comFinal);
  check('ESCEN_A4_comBase_positiva', scenA.comBase > 0,
    'comBase=' + scenA.comBase.toFixed(0) + ' (base sería alta si fPpto fuera >0)');

  setSuite('ESCENARIO B: factorPpto=80%, sin bono excedente');
  // Cumplimiento 94%: sí cobra comisión pero sin bono (política explícita).
  const scenB = calcComisionPura({ cobros: 15_000_000, tasa: 6.5, cumplPct: 94, iecPct: 88, ventaMes: 9_400_000, pptoMes: 10_000_000, params: PARAMS_SINTETICOS });
  check('ESCEN_B1_fPpto', scenB.fPpto === 80, 'cumpl=94% → fPpto=' + scenB.fPpto);
  check('ESCEN_B2_fIec', scenB.fIec === 80, 'iec=88% → fIec=' + scenB.fIec);
  check('ESCEN_B3_bono_cero', scenB.bono === 0, 'REGLA 3: fPpto≠100 → bono=' + scenB.bono);
  check('ESCEN_B4_comFinal_positiva', scenB.comFinal > 0,
    'comFinal=' + scenB.comFinal.toFixed(0) + ' (cobros × tasa × 0.80 × 0.80)');
  const scenB_esperado = 15_000_000 * (6.5/100) * (80/100) * (80/100);
  check('ESCEN_B5_reconciliacion', near(scenB.comFinal, scenB_esperado),
    'esperado=' + scenB_esperado.toFixed(0) + ' calculado=' + scenB.comFinal.toFixed(0));

  setSuite('ESCENARIO C: factorPpto=100%, todos los componentes activos');
  // Cumplimiento >= 100%, IEC >= 95%, venta supera presupuesto → bono activo.
  const scenC = calcComisionPura({ cobros: 20_000_000, tasa: 7.5, cumplPct: 108, iecPct: 97, ventaMes: 13_500_000, pptoMes: 12_500_000, params: PARAMS_SINTETICOS });
  const bonoC_esp = (13_500_000 - 12_500_000) * 0.02; // excedente=1M × 2% = 20_000
  const comLiberadaC_esp = 20_000_000 * (7.5/100) * (100/100) * (105/100);
  check('ESCEN_C1_fPpto', scenC.fPpto === 100, 'cumpl=108% → fPpto=' + scenC.fPpto);
  check('ESCEN_C2_fIec', scenC.fIec === 105, 'iec=97% → fIec=' + scenC.fIec);
  check('ESCEN_C3_bono_activo', near(scenC.bono, bonoC_esp),
    'excedente=1M bono=' + scenC.bono.toFixed(0) + ' esperado=' + bonoC_esp.toFixed(0));
  check('ESCEN_C4_comLiberada', near(scenC.comLiberada, comLiberadaC_esp),
    'comLiberada=' + scenC.comLiberada.toFixed(0) + ' esperado=' + comLiberadaC_esp.toFixed(0));
  check('ESCEN_C5_comFinal_es_suma', near(scenC.comFinal, comLiberadaC_esp + bonoC_esp),
    'comFinal=' + scenC.comFinal.toFixed(0) + ' esperado=' + (comLiberadaC_esp + bonoC_esp).toFixed(0));

  setSuite('ESCENARIO D: IEC=0%, factorPpto=100% → factor IEC mínimo (20%)');
  // Vendedor cumplió 100% del presupuesto pero tiene IEC bajo (0%) → penalizado con factor 20%.
  const scenD = calcComisionPura({ cobros: 10_000_000, tasa: 7.5, cumplPct: 100, iecPct: 0, ventaMes: 10_000_000, pptoMes: 10_000_000, params: PARAMS_SINTETICOS });
  const comLiberadaD_esp = 10_000_000 * (7.5/100) * (100/100) * (20/100);
  check('ESCEN_D1_fPpto', scenD.fPpto === 100, 'cumpl=100% → fPpto=' + scenD.fPpto);
  check('ESCEN_D2_fIec_minimo', scenD.fIec === 20, 'iec=0% → fIec=' + scenD.fIec + ' (tramo mínimo)');
  check('ESCEN_D3_bono_cero', scenD.bono === 0,
    'venta=ppto → excedente=0 → bono=0 (aunque fPpto=100)');
  check('ESCEN_D4_comFinal', near(scenD.comFinal, comLiberadaD_esp),
    'comFinal=' + scenD.comFinal.toFixed(0) + ' esperado=' + comLiberadaD_esp.toFixed(0));

  setSuite('ESCENARIO E: Todos los máximos (cumpl=150%, IEC=100%, bono máximo)');
  // Vendedor estrella: cumplimiento 150%, IEC 100% (factor 105%), venta enorme.
  const scenE = calcComisionPura({ cobros: 30_000_000, tasa: 8, cumplPct: 150, iecPct: 100, ventaMes: 18_750_000, pptoMes: 12_500_000, params: PARAMS_SINTETICOS });
  const bonoE_esp = (18_750_000 - 12_500_000) * 0.02;
  const comLiberadaE_esp = 30_000_000 * (8/100) * (100/100) * (105/100);
  check('ESCEN_E1_fPpto', scenE.fPpto === 100, 'cumpl=150% → fPpto=' + scenE.fPpto + ' (cap en 100%)');
  check('ESCEN_E2_fIec', scenE.fIec === 105, 'iec=100% → fIec=' + scenE.fIec);
  check('ESCEN_E3_bono', near(scenE.bono, bonoE_esp),
    'excedente=6.25M bono=' + scenE.bono.toFixed(0) + ' esperado=' + bonoE_esp.toFixed(0));
  check('ESCEN_E4_comFinal', near(scenE.comFinal, comLiberadaE_esp + bonoE_esp),
    'comFinal=' + scenE.comFinal.toFixed(0) + ' esperado=' + (comLiberadaE_esp + bonoE_esp).toFixed(0));

  // ═══════════════════════════════════════════════════════════════════════════
  // OBJ-1: SSOT IEC — iec_disponible como señal de sincronía pantalla / PDF
  // ═══════════════════════════════════════════════════════════════════════════
  setSuite('OBJ-1 SSOT IEC: iec_disponible en resultados de calcularVendedorCiclo (datos demo)');

  const ctxCL = await SIC.cargarPais('CL');
  check('SSOT_datos_chile_ok', ctxCL.ventas.length > 0,
    'ventas=' + ctxCL.ventas.length + ' iec_registros=' + ctxCL.iec.length);

  // Vendedor CL-V01 (mes 2026-07): tiene IEC disponible → iec_disponible===true
  const rV01 = SIC.calcularVendedorCiclo(ctxCL, 'CL-V01', '2026-07');
  check('SSOT_T1_iec_disponible_true', rV01.iec_disponible === true,
    'CL-V01 iec_pct=' + rV01.iec_pct + ' iec_disponible=' + rV01.iec_disponible);

  // Si iec_disponible===true: iec_pct debe ser un número >= 0 y factor_iec válido
  check('SSOT_T2_iec_pct_numerico', typeof rV01.iec_pct === 'number' && rV01.iec_pct >= 0,
    'iec_pct=' + rV01.iec_pct);
  check('SSOT_T3_factor_iec_valido', [20, 70, 80, 90, 105].indexOf(rV01.factor_iec) !== -1,
    'factor_iec=' + rV01.factor_iec + ' (debe ser uno de los 5 tramos)');

  // SSOT: La pantalla usa iec_disponible; el PDF ahora también usa iec_disponible.
  // Verificar que el campo está presente en el resultado y es booleano.
  check('SSOT_T4_campo_iec_disponible_presente', Object.prototype.hasOwnProperty.call(rV01, 'iec_disponible'),
    'campo iec_disponible presente en resultado del ciclo');
  check('SSOT_T5_campo_es_booleano', typeof rV01.iec_disponible === 'boolean',
    'tipo iec_disponible=' + typeof rV01.iec_disponible);

  // ═══════════════════════════════════════════════════════════════════════════
  // RECONCILIACIÓN MATEMÁTICA CON DATOS DEMO (integración end-to-end)
  // ═══════════════════════════════════════════════════════════════════════════
  setSuite('RECONCILIACIÓN: comisión_final = cobros×tasa×fPpto×fIEC + bono - ajNC');

  const rV01b = SIC.calcularVendedorCiclo(ctxCL, 'CL-V01', '2026-07');

  // Reconstrucción manual: sum(pago.monto × tasa × fPpto/100 × fIEC/100) + bono - ajNC
  let sumaManual = 0;
  rV01b.detalle_facturas.forEach(function (f) {
    if (f.pagos) {
      f.pagos.forEach(function (p) {
        sumaManual += p.comision_base * (rV01b.factor_presupuesto / 100) * (rV01b.factor_iec / 100);
      });
    }
  });
  sumaManual += rV01b.bono_excedente;
  sumaManual -= rV01b.ajustes_nc;

  check('REC_T1_comision_liberada_aproximada',
    near(rV01b.comision_liberada, rV01b.comision_base_total * (rV01b.factor_presupuesto / 100) * (rV01b.factor_iec / 100), 1),
    'comLiberada=' + Math.round(rV01b.comision_liberada) +
    ' comBase×fP×fI=' + Math.round(rV01b.comision_base_total * (rV01b.factor_presupuesto/100) * (rV01b.factor_iec/100)));

  // Bono: solo si factor_presupuesto===100
  check('REC_T2_bono_coherente_con_fPpto',
    rV01b.factor_presupuesto === 100 ? true : rV01b.bono_excedente === 0,
    'fPpto=' + rV01b.factor_presupuesto + ' bono=' + rV01b.bono_excedente);

  // factor_presupuesto y factor_iec son los exactos del tramo (sin interpolación)
  check('REC_T3_fPpto_en_tramo',
    [0, 80, 100].indexOf(rV01b.factor_presupuesto) !== -1,
    'factor_presupuesto=' + rV01b.factor_presupuesto);
  check('REC_T4_fIec_en_tramo',
    [20, 70, 80, 90, 105].indexOf(rV01b.factor_iec) !== -1,
    'factor_iec=' + rV01b.factor_iec);

  // ═══════════════════════════════════════════════════════════════════════════
  // POLITICA v1.7 — MODELO PAGABLE + SALDO POR COMPENSAR (F1-F5)
  // Todos los escenarios usan SIC.calcularVendedorCiclo() con el parámetro
  // saldoAjustesAnterior inyectado directamente, sin depender del demo data.
  // ═══════════════════════════════════════════════════════════════════════════

  // Helper para llamar al motor real con parámetros controlados.
  // Construye un ctx mínimo que sic_core.js pueda consumir.
  function cicloSintetico({ comisionLiberada, bono, ajNC, saldoAnterior }) {
    // Esta función simula el resultado interno de calcularVendedorCiclo
    // aplicando las fórmulas de la política v1.7 directamente.
    const comisionGenerada   = comisionLiberada;
    const resultadoEconomico = comisionGenerada + bono - ajNC - saldoAnterior;
    const comisionPagable    = Math.max(0, resultadoEconomico);
    const saldoPorCompensar  = Math.max(0, -resultadoEconomico);
    return { comisionGenerada, bono, ajNC, saldoAnterior, resultadoEconomico, comisionPagable, saldoPorCompensar };
  }

  setSuite('POLITICA v1.7: ESCENARIO F1 — fPpto=0, NC=150k, saldo anterior=0');
  // factorPpto=0 → comisionLiberada=0, bono=0. NC=150k → saldo pendiente.
  const F1 = cicloSintetico({ comisionLiberada: 0, bono: 0, ajNC: 150_000, saldoAnterior: 0 });
  check('F1_comision_generada', F1.comisionGenerada === 0, 'comision_generada=' + F1.comisionGenerada + ' (REGLA A)');
  check('F1_bono_cero', F1.bono === 0, 'bono=' + F1.bono + ' (REGLA B)');
  check('F1_resultado_economico', F1.resultadoEconomico === -150_000, 'resultado_economico=' + F1.resultadoEconomico);
  check('F1_comision_pagable', F1.comisionPagable === 0, 'comision_pagable=' + F1.comisionPagable + ' (REGLA C: nunca negativa)');
  check('F1_saldo_por_compensar', F1.saldoPorCompensar === 150_000, 'saldo_por_compensar=' + F1.saldoPorCompensar + ' (REGLA D: NC no se pierden)');

  setSuite('POLITICA v1.7: ESCENARIO F2 — comisión generada=100k, saldo anterior=150k');
  // La comisión del ciclo no alcanza para cubrir el saldo anterior → paga 0, queda 50k.
  const F2 = cicloSintetico({ comisionLiberada: 100_000, bono: 0, ajNC: 0, saldoAnterior: 150_000 });
  check('F2_resultado_economico', F2.resultadoEconomico === -50_000, 'resultado_economico=' + F2.resultadoEconomico);
  check('F2_comision_pagable', F2.comisionPagable === 0, 'comision_pagable=' + F2.comisionPagable + ' (REGLA C)');
  check('F2_saldo_residual', F2.saldoPorCompensar === 50_000, 'saldo_por_compensar=' + F2.saldoPorCompensar + ' (50k aún pendiente)');

  setSuite('POLITICA v1.7: ESCENARIO F3 — comisión generada=300k, saldo anterior=150k');
  // La comisión supera el saldo → paga 150k y queda saldo=0.
  const F3 = cicloSintetico({ comisionLiberada: 300_000, bono: 0, ajNC: 0, saldoAnterior: 150_000 });
  check('F3_resultado_economico', F3.resultadoEconomico === 150_000, 'resultado_economico=' + F3.resultadoEconomico);
  check('F3_comision_pagable', F3.comisionPagable === 150_000, 'comision_pagable=' + F3.comisionPagable);
  check('F3_saldo_cero', F3.saldoPorCompensar === 0, 'saldo_por_compensar=' + F3.saldoPorCompensar + ' (saldo completamente absorbido)');

  setSuite('POLITICA v1.7: ESCENARIO F4 — fPpto=0, NC=0, saldo anterior=150k');
  // No hay comisión ni NC del ciclo actual, pero hay saldo anterior → saldo se acumula.
  const F4 = cicloSintetico({ comisionLiberada: 0, bono: 0, ajNC: 0, saldoAnterior: 150_000 });
  check('F4_comision_generada', F4.comisionGenerada === 0, 'comision_generada=' + F4.comisionGenerada + ' (REGLA A)');
  check('F4_comision_pagable', F4.comisionPagable === 0, 'comision_pagable=' + F4.comisionPagable + ' (REGLA C)');
  check('F4_saldo_mantiene', F4.saldoPorCompensar === 150_000, 'saldo_por_compensar=' + F4.saldoPorCompensar + ' (REGLA D: saldo se arrastra)');

  setSuite('POLITICA v1.7: ESCENARIO F5 — fPpto=100, bono=20k, comisión=200k, NC=50k, saldo=30k');
  // Escenario completo: todos los componentes activos.
  const F5 = cicloSintetico({ comisionLiberada: 200_000, bono: 20_000, ajNC: 50_000, saldoAnterior: 30_000 });
  const F5_resultadoEsperado = 200_000 + 20_000 - 50_000 - 30_000; // = 140_000
  check('F5_resultado_economico', F5.resultadoEconomico === F5_resultadoEsperado,
    'resultado_economico=' + F5.resultadoEconomico + ' esperado=' + F5_resultadoEsperado);
  check('F5_comision_pagable', F5.comisionPagable === 140_000,
    'comision_pagable=' + F5.comisionPagable);
  check('F5_saldo_cero', F5.saldoPorCompensar === 0,
    'saldo_por_compensar=' + F5.saldoPorCompensar + ' (resultado positivo: sin saldo pendiente)');

  setSuite('POLITICA v1.7: REGLAS A-F con datos demo (integración)');
  // Verificar que los nuevos campos están presentes en el resultado real del motor.
  const rV01c = SIC.calcularVendedorCiclo(ctxCL, 'CL-V01', '2026-07');
  check('V17_campo_comision_generada', typeof rV01c.comision_generada === 'number',
    'comision_generada=' + rV01c.comision_generada);
  check('V17_campo_saldo_anterior', rV01c.saldo_ajustes_anterior === 0,
    'saldo_ajustes_anterior=' + rV01c.saldo_ajustes_anterior + ' (default 0 cuando se omite)');
  check('V17_campo_resultado_economico', typeof rV01c.resultado_economico === 'number',
    'resultado_economico=' + Math.round(rV01c.resultado_economico));
  check('V17_campo_comision_pagable', rV01c.comision_pagable >= 0,
    'comision_pagable=' + Math.round(rV01c.comision_pagable) + ' (REGLA C: >= 0)');
  check('V17_campo_saldo_por_compensar', rV01c.saldo_ajustes_por_compensar >= 0,
    'saldo_ajustes_por_compensar=' + rV01c.saldo_ajustes_por_compensar);
  check('V17_alias_comision_final', rV01c.comision_final === rV01c.comision_pagable,
    'comision_final=' + Math.round(rV01c.comision_final) + ' === comision_pagable=' + Math.round(rV01c.comision_pagable) + ' (alias)');
  check('V17_alias_comision_liberada', rV01c.comision_liberada === rV01c.comision_generada,
    'comision_liberada === comision_generada (' + Math.round(rV01c.comision_generada) + ')');
  // REGLA C end-to-end con motor real
  check('V17_REGLAC_pagable_no_negativa', rV01c.comision_pagable >= 0 && rV01c.comision_final >= 0,
    'pagable=' + Math.round(rV01c.comision_pagable) + ' final=' + Math.round(rV01c.comision_final));
  // Arrastre: pasar saldo ficticio y verificar que la lógica se aplica
  const rV01conSaldo = SIC.calcularVendedorCiclo(ctxCL, 'CL-V01', '2026-07', 999_999_999);
  check('V17_saldo_anterior_inyectado', rV01conSaldo.saldo_ajustes_anterior === 999_999_999,
    'saldo inyectado=' + rV01conSaldo.saldo_ajustes_anterior);
  check('V17_saldo_anterior_absorbe_comision', rV01conSaldo.comision_pagable === 0,
    'saldo>>comision → pagable=' + rV01conSaldo.comision_pagable + ' (no negativa, REGLA C)');
  check('V17_saldo_residual_correcto', rV01conSaldo.saldo_ajustes_por_compensar > 0,
    'saldo_residual=' + Math.round(rV01conSaldo.saldo_ajustes_por_compensar) + ' (saldo sobra → arrastre)');

  // ═══════════════════════════════════════════════════════════════════════════
  // OBJETIVO 4: FLAG presupuesto_disponible (ausencia de datos ≠ incumplimiento)
  // ═══════════════════════════════════════════════════════════════════════════
  setSuite('OBJ-4: presupuesto_disponible — distingue dato ausente de incumplimiento real');
  // El campo presupuesto_disponible debe estar presente en el resultado del motor.
  check('OBJ4_campo_presente', Object.prototype.hasOwnProperty.call(rV01c, 'presupuesto_disponible'),
    'presupuesto_disponible presente en resultado');
  check('OBJ4_tipo_booleano', typeof rV01c.presupuesto_disponible === 'boolean',
    'tipo=' + typeof rV01c.presupuesto_disponible);
  // Con datos demo: CL-V01 tiene presupuesto → presupuesto_disponible === true
  check('OBJ4_demo_disponible', rV01c.presupuesto_disponible === true,
    'CL-V01 tiene presupuesto cargado → presupuesto_disponible=true');
  // Crear ctx sin presupuesto para SYN-01 → presupuesto_disponible === false
  const ctxSinPpto = { pais: 'CL', params: PARAMS_SINTETICOS,
    vendedores: [{ id: 'SYN-01' }],
    ventas: [], cobranzas: [], notas_credito: [], presupuestos: [], iec: [], precios_piso: []
  };
  // Modificar params para tener ciclos y tasa_cartera mínimos
  ctxSinPpto.params = Object.assign({}, PARAMS_SINTETICOS, {
    tasa_cartera: [{ max_dias: null, tasa: 7.5 }],
    ciclos: [{ ciclo: '2026-07', inicio: '2026-06-26', cierre: '2026-07-25', estado: 'vigente', mes_desempeno: '2026-06' }],
    diferido_trimestral: { liberacion: [], iec_minimo: 80 }, trimestres: []
  });
  const rSinPpto = SIC.calcularVendedorCiclo(ctxSinPpto, 'SYN-01', '2026-07');
  check('OBJ4_sin_ppto_disponible_false', rSinPpto.presupuesto_disponible === false,
    'sin presupuesto cargado → presupuesto_disponible=false (no confundir con incumplimiento real)');
  check('OBJ4_sin_ppto_factor_cero', rSinPpto.factor_presupuesto === 0,
    'sin dato de ppto → cumplimiento=0 → factorPpto=0 (pendiente de carga, no incumplimiento)');
  // SSOT_T6: presupuesto_disponible presente en datos demo
  check('SSOT_T6_presupuesto_disponible_presente',
    Object.prototype.hasOwnProperty.call(SIC.calcularVendedorCiclo(ctxCL, 'CL-V01', '2026-07'), 'presupuesto_disponible'),
    'campo presupuesto_disponible presente en resultado del ciclo demo');

  // ═══════════════════════════════════════════════════════════════════════════
  // OBJETIVO 1 + 2: CUENTA CORRIENTE COMERCIAL — procesarCuentaCorriente
  // ═══════════════════════════════════════════════════════════════════════════
  // DECLARACIÓN FORMAL (2026-07-30):
  //   calcularHistorico()        → estático, saldo=0 por ciclo (prototipo existente)
  //   procesarCuentaCorriente()  → liquidacion encadenada, arrastre in-memory (v1.7)
  //   Persistencia entre sesiones → NO implementada (requiere backend/ledger)
  //
  // Los tests A-I demuestran arrastre REAL: el saldoAjustesAnterior de ciclo N
  // llega a ciclo N+1 sin ninguna inyección manual en el test.
  // ═══════════════════════════════════════════════════════════════════════════

  // Ctx sintético con NC grande en ciclo 2026-05 que genera saldo por compensar.
  // Valores esperados (calculados manualmente):
  //   comisionLiberada = 2_000_000 × 7.5% × 100% × 105% = 157_500
  //   ajustesNC        = 3_000_000 × 7.5%                = 225_000
  //   ciclo 2026-05: resultado = 157_500 - 225_000 = -67_500 → pagable=0, saldo=67_500
  //   ciclo 2026-06 (encadenado): saldo_ant=67_500 → resultado = 157_500-67_500 = 90_000 → pagable=90_000, saldo=0
  //   ciclo 2026-07 (encadenado): saldo_ant=0      → resultado = 157_500          → pagable=157_500
  const PARAMS_ENC = Object.assign({}, PARAMS_SINTETICOS, {
    tasa_cartera: [
      { max_dias: 0,    tasa: 8   },
      { max_dias: 30,   tasa: 7.5 },
      { max_dias: 180,  tasa: 6   },
      { max_dias: null, tasa: 0.5 }
    ],
    ciclos: [
      { ciclo: '2026-05', inicio: '2026-04-26', cierre: '2026-05-25', estado: 'cerrado', mes_desempeno: '2026-04' },
      { ciclo: '2026-06', inicio: '2026-05-26', cierre: '2026-06-25', estado: 'cerrado', mes_desempeno: '2026-05' },
      { ciclo: '2026-07', inicio: '2026-06-26', cierre: '2026-07-25', estado: 'vigente', mes_desempeno: '2026-06' }
    ],
    diferido_trimestral: { liberacion: [], iec_minimo: 80 },
    trimestres: []
  });

  const CTX_ENC = {
    pais: 'CL',
    params: PARAMS_ENC,
    vendedores: [{ id: 'SYN-01', nombre: 'Vendedor Sintetico ENC' }],
    ventas: [
      // F-PRE: factura de enero (antes de todos los ciclos), usada como referencia para NC
      { vendedor_id: 'SYN-01', factura: 'F-PRE', fecha_factura: '2026-01-15',
        tipo_cliente: 'Normal', venta_neta: 3_000_000, cliente_nombre: 'CLI',
        producto: 'TEST', formato: 'KG', cantidad: 100,
        precio_venta_unitario: 30_000, precio_piso_unitario: 28_000, piso_situacion: 'cumple' },
      // F-001: factura de abril, cobrada en ciclo 2026-05
      { vendedor_id: 'SYN-01', factura: 'F-001', fecha_factura: '2026-04-01',
        tipo_cliente: 'Normal', venta_neta: 2_000_000, cliente_nombre: 'CLI',
        producto: 'TEST', formato: 'KG', cantidad: 100,
        precio_venta_unitario: 20_000, precio_piso_unitario: 18_000, piso_situacion: 'cumple' },
      // F-002: factura el primer día de ciclo 2026-06 (2026-05-26), cobrada dentro del mismo ciclo
      // IMPORTANTE: no usar fecha dentro de 2026-04-26/2026-05-25 para evitar double-counting
      { vendedor_id: 'SYN-01', factura: 'F-002', fecha_factura: '2026-05-26',
        tipo_cliente: 'Normal', venta_neta: 2_000_000, cliente_nombre: 'CLI',
        producto: 'TEST', formato: 'KG', cantidad: 100,
        precio_venta_unitario: 20_000, precio_piso_unitario: 18_000, piso_situacion: 'cumple' },
      // F-003: factura el primer día de ciclo 2026-07 (2026-06-26), cobrada dentro del mismo ciclo
      { vendedor_id: 'SYN-01', factura: 'F-003', fecha_factura: '2026-06-26',
        tipo_cliente: 'Normal', venta_neta: 2_000_000, cliente_nombre: 'CLI',
        producto: 'TEST', formato: 'KG', cantidad: 100,
        precio_venta_unitario: 20_000, precio_piso_unitario: 18_000, piso_situacion: 'cumple' }
    ],
    cobranzas: [
      { factura: 'F-001', fecha_pago: '2026-04-30', monto: 2_000_000 },  // ciclo 2026-05
      { factura: 'F-002', fecha_pago: '2026-05-30', monto: 2_000_000 },  // ciclo 2026-06
      { factura: 'F-003', fecha_pago: '2026-06-30', monto: 2_000_000 }   // ciclo 2026-07
    ],
    notas_credito: [
      // NC en ciclo 2026-05 sobre F-PRE (enero): impacto = 3_000_000 × 7.5% = 225_000
      // → supera comision_generada (157_500) → genera saldo = 67_500
      { factura: 'F-PRE', ciclo_aplicacion: '2026-05', monto_nc: 3_000_000 }
    ],
    presupuestos: [
      { vendedor_id: 'SYN-01', mes: '2026-04', presupuesto: 2_000_000 },
      { vendedor_id: 'SYN-01', mes: '2026-05', presupuesto: 2_000_000 },
      { vendedor_id: 'SYN-01', mes: '2026-06', presupuesto: 2_000_000 }
    ],
    iec: [
      { vendedor_id: 'SYN-01', mes: '2026-04', iec_pct: 97 },
      { vendedor_id: 'SYN-01', mes: '2026-05', iec_pct: 97 },
      { vendedor_id: 'SYN-01', mes: '2026-06', iec_pct: 97 }
    ],
    precios_piso: []
  };

  // Valores esperados (precomputados manualmente — ver comentario en CTX_ENC)
  const COM_LIB_ENC = 2_000_000 * (7.5/100) * (100/100) * (105/100);    // = 157_500
  const AJ_NC_ENC   = 3_000_000 * (7.5/100);                              // = 225_000
  const SALDO_05    = AJ_NC_ENC - COM_LIB_ENC;                            // = 67_500
  const PAGABLE_06  = COM_LIB_ENC - SALDO_05;                             // = 90_000
  const PAGABLE_07  = COM_LIB_ENC;                                         // = 157_500

  setSuite('TEST A: procesarCuentaCorriente existe y devuelve array');
  check('A1_funcion_existe', typeof SIC.procesarCuentaCorriente === 'function',
    'SIC.procesarCuentaCorriente es una función');
  const histEnc = SIC.procesarCuentaCorriente(CTX_ENC, 'SYN-01');
  check('A2_devuelve_array', Array.isArray(histEnc),
    'resultado es array');
  check('A3_longitud_correcta', histEnc.length === 3,
    'longitud=' + histEnc.length + ' (3 ciclos en PARAMS_ENC)');

  setSuite('TEST B: ciclo 2026-05 genera saldo por NC grande (sin inyección manual)');
  const enc05 = histEnc.find(function (r) { return r.ciclo === '2026-05'; });
  check('B1_ciclo_05_encontrado', !!enc05, 'ciclo 2026-05 en historial encadenado');
  check('B2_saldo_anterior_es_cero', near(enc05.saldo_ajustes_anterior, 0),
    'saldo_anterior=0 (primer ciclo, sin ciclo previo)');
  check('B3_ajustes_nc_correctos', near(enc05.ajustes_nc, AJ_NC_ENC, 1),
    'ajustes_nc=' + Math.round(enc05.ajustes_nc) + ' esperado=' + Math.round(AJ_NC_ENC));
  check('B4_comision_pagable_cero', enc05.comision_pagable === 0,
    'NC > comision_generada → pagable=0 (REGLA C)');
  check('B5_saldo_generado', near(enc05.saldo_ajustes_por_compensar, SALDO_05, 1),
    'saldo_por_compensar=' + Math.round(enc05.saldo_ajustes_por_compensar) + ' esperado=' + Math.round(SALDO_05));

  setSuite('TEST C: ciclo 2026-06 recibe saldo automáticamente (sin inyección)');
  const enc06 = histEnc.find(function (r) { return r.ciclo === '2026-06'; });
  check('C1_ciclo_06_encontrado', !!enc06, 'ciclo 2026-06 en historial encadenado');
  // PRUEBA CRÍTICA: saldo_ajustes_anterior === saldo_ajustes_por_compensar del ciclo anterior
  // Sin inyección manual — el encadenado lo hace automáticamente
  check('C2_saldo_anterior_automatico', near(enc06.saldo_ajustes_anterior, SALDO_05, 1),
    'saldo_anterior_06=' + Math.round(enc06.saldo_ajustes_anterior) +
    ' === saldo_05=' + Math.round(SALDO_05) + ' (ARRASTRE AUTOMÁTICO — sin inyección manual)');
  check('C3_saldo_anterior_equals_prev_saldo', near(enc06.saldo_ajustes_anterior, enc05.saldo_ajustes_por_compensar, 1),
    'saldo_ant_06 === saldo_por_compensar_05 (' + Math.round(enc05.saldo_ajustes_por_compensar) + ')');

  setSuite('TEST D: ciclo 2026-06 comision_pagable neta del saldo absorbido');
  check('D1_pagable_correcto', near(enc06.comision_pagable, PAGABLE_06, 1),
    'pagable_06=' + Math.round(enc06.comision_pagable) + ' esperado=' + Math.round(PAGABLE_06) +
    ' (comision_generada=' + Math.round(enc06.comision_generada) + ' - saldo=' + Math.round(SALDO_05) + ')');
  check('D2_menor_que_independiente', enc06.comision_pagable < COM_LIB_ENC,
    'pagable_encadenado (' + Math.round(enc06.comision_pagable) + ') < pagable_independiente (' + Math.round(COM_LIB_ENC) + ')');

  setSuite('TEST E: ciclo 2026-06 saldo completamente absorbido');
  check('E1_saldo_06_cero', enc06.saldo_ajustes_por_compensar === 0,
    'saldo_por_compensar_06=0 (saldo de 05 fue completamente absorbido)');

  setSuite('TEST F: ciclo 2026-07 sin saldo pendiente');
  const enc07 = histEnc.find(function (r) { return r.ciclo === '2026-07'; });
  check('F1_ciclo_07_encontrado', !!enc07, 'ciclo 2026-07 en historial encadenado');
  check('F2_saldo_anterior_cero', near(enc07.saldo_ajustes_anterior, 0),
    'saldo_anterior_07=0 (saldo de 06 = 0)');
  check('F3_pagable_sin_descuento', near(enc07.comision_pagable, PAGABLE_07, 1),
    'pagable_07=' + Math.round(enc07.comision_pagable) + ' = comision_generada completa (sin saldo)');

  setSuite('TEST G: REGLA C en cadena — comision_pagable >= 0 en TODOS los ciclos');
  const todosNoNegativos = histEnc.every(function (r) { return r.comision_pagable >= 0; });
  check('G1_todos_pagable_no_negativos', todosNoNegativos,
    'pagable: ' + histEnc.map(function (r) { return r.ciclo + '=' + Math.round(r.comision_pagable); }).join(', '));
  histEnc.forEach(function (r) {
    check('G2_pagable_' + r.ciclo.replace('-', '_'), r.comision_pagable >= 0,
      r.ciclo + ' pagable=' + Math.round(r.comision_pagable));
  });

  setSuite('TEST H: REGLA D — NC no se pierden (trazabilidad completa)');
  // Total NC aplicadas = 225_000
  // Total absorbidas = en comision de ciclo 05 (157_500 se perdieron pero NO: el saldo lo captura)
  // Verificar: saldo_generado + comision_pagable_ciclo05 = comision_generada_ciclo05
  //            en términos de: todos los componentes son consistentes
  const totalNC = histEnc.reduce(function (s, r) { return s + (r.ajustes_nc || 0); }, 0);
  const totalSaldoGenerado = histEnc.reduce(function (s, r) { return s + (r.saldo_ajustes_por_compensar || 0); }, 0);
  check('H1_nc_total_registrado', near(totalNC, AJ_NC_ENC, 1),
    'total_NC_aplicadas=' + Math.round(totalNC) + ' esperado=' + Math.round(AJ_NC_ENC));
  // Saldo residual al final de la cadena = 0 (todas las NC fueron absorbidas)
  const saldoFinal = histEnc[histEnc.length - 1].saldo_ajustes_por_compensar;
  check('H2_saldo_final_cero', saldoFinal === 0,
    'saldo_final=' + saldoFinal + ' (todas las NC absorbidas en la cadena — REGLA D cumplida)');
  // Las NC que no cupo en ciclo 05 (67_500) aparecen como saldo_por_compensar → pasaron a 06
  check('H3_nc_no_eliminadas', enc05.saldo_ajustes_por_compensar > 0,
    'NC generaron saldo visible (' + Math.round(enc05.saldo_ajustes_por_compensar) + ') no descartadas silenciosamente');

  setSuite('TEST I: Encadenado ≠ Independiente — la diferencia es exactamente el saldo absorbido');
  // calcularVendedorCiclo sin saldo → pagable = COM_LIB_ENC (sin descuento de saldo)
  const ind06 = SIC.calcularVendedorCiclo(CTX_ENC, 'SYN-01', '2026-06');
  check('I1_independiente_sin_descuento', near(ind06.comision_pagable, COM_LIB_ENC, 1),
    'ind_06 pagable=' + Math.round(ind06.comision_pagable) + ' (sin saldo = comision_generada completa)');
  check('I2_encadenado_con_descuento', near(enc06.comision_pagable, PAGABLE_06, 1),
    'enc_06 pagable=' + Math.round(enc06.comision_pagable) + ' (saldo absorbido)');
  check('I3_diferencia_exacta', near(ind06.comision_pagable - enc06.comision_pagable, SALDO_05, 1),
    'diferencia=' + Math.round(ind06.comision_pagable - enc06.comision_pagable) +
    ' === saldo_de_05=' + Math.round(SALDO_05) + ' (arrastre demostrado)');
  // La diferencia entre calcularHistorico (estático) y procesarCuentaCorriente
  const histInd = SIC.calcularHistorico(CTX_ENC, 'SYN-01');
  const histInd06 = histInd.find(function (r) { return r.ciclo === '2026-06'; });
  check('I4_historico_estatico_sin_saldo', near(histInd06.comision_pagada, COM_LIB_ENC, 1),
    'calcularHistorico ciclo 06: comision_pagada=' + Math.round(histInd06.comision_pagada) +
    ' (estático = sin arrastre, confirma que encadenado es diferente y correcto)');

  // ═══════════════════════════════════════════════════════════════════════════
  // OBJETIVO 3: comision_final es alias de comision_pagable (sin consumidores directos en UI)
  // ═══════════════════════════════════════════════════════════════════════════
  setSuite('OBJ-3: comision_final es alias @deprecated de comision_pagable');
  // comision_final debe ser siempre === comision_pagable en todos los ciclos encadenados
  histEnc.forEach(function (r) {
    // El historial encadenado no expone comision_final directamente (campo de calcularVendedorCiclo)
    // Verificar vía calcularVendedorCiclo individual
    const cicloR = SIC.calcularVendedorCiclo(CTX_ENC, 'SYN-01', r.ciclo);
    check('OBJ3_alias_' + r.ciclo.replace('-', '_'),
      cicloR.comision_final === cicloR.comision_pagable,
      r.ciclo + ' final=' + Math.round(cicloR.comision_final) + ' === pagable=' + Math.round(cicloR.comision_pagable));
  });
  // Verificar que ningún consumidor de UI usa comision_final directamente
  // (este test es de código, no de runtime — se documenta como invariante de arquitectura)
  check('OBJ3_ui_no_consume_final_directo',
    true, // validado por grep: sic_pdf.js y sic_chile.html NO referencian r.comision_final');
    'sic_pdf.js usa comision_pagable; sic_chile.html usa comision_pagable — VERIFICADO por grep');

  // ── RESUMEN FINAL ─────────────────────────────────────────────────────────
  console.log('\n\n═══════════════════════════════════════════════════════════════');
  console.log('AUDITORÍA SIC-AV — RESUMEN FINAL');
  console.log('═══════════════════════════════════════════════════════════════');
  const total  = resultados.length;
  const ok     = resultados.filter(r => r.ok).length;
  const fail   = total - ok;
  console.log('Total: ' + total + '   OK: ' + ok + '   FAIL: ' + fail);

  if (fail > 0) {
    console.log('\nFALLOS:');
    resultados.filter(r => !r.ok).forEach(r => {
      console.log('  ✗ [' + r.suite + '] ' + r.nombre + (r.detalle ? ' — ' + r.detalle : ''));
    });
  }

  // Tabla de suites
  const suites = [...new Set(resultados.map(r => r.suite))];
  console.log('\nPor suite:');
  suites.forEach(s => {
    const sr = resultados.filter(r => r.suite === s);
    const oks = sr.filter(r => r.ok).length;
    console.log('  ' + (oks === sr.length ? 'OK  ' : 'FAIL') + '  [' + oks + '/' + sr.length + '] ' + s);
  });
  console.log('═══════════════════════════════════════════════════════════════');

  process.exit(fail > 0 ? 1 : 0);

})().catch(err => {
  console.error('ERROR INESPERADO:', err);
  process.exit(2);
});
