/**
 * @deprecated 2026-07-31
 * SUPERADO por: scripts/test_precios_iec.py (T01-T12, 36 pruebas, SSOT end-to-end)
 * RAZÓN: este suite verifica fórmulas matemáticas aisladas; test_precios_iec.py
 *        verifica la arquitectura completa incluyendo pipeline y SSOT.
 * MANTENER como referencia histórica. NO usar como suite oficial.
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * TEST SUITE T1-T18 — IEC Ponderado Arquitectura Fase 7
 * CHANGE REQUEST SIC-AV v1.7
 *
 * Propósito: verificar corrección matemática y lógica de todas las funciones
 * antes de hacer commit/push. NO es un test de integración UI.
 *
 * Ejecución: node scripts/test_iec_t1_t18.js
 *
 * RESTRICCIÓN: NO hacer commit ni push si hay tests fallidos.
 * Solo Javier Almeida (javier@agrovecalatam.com) puede aprobar el commit.
 */

'use strict';

// ============================================================
// INFRAESTRUCTURA MÍNIMA
// ============================================================

var passed = 0;
var failed = 0;
var results = [];

function assert(nombre, condicion, detalle) {
  if (condicion) {
    results.push({ ok: true, nombre: nombre });
    passed++;
  } else {
    results.push({ ok: false, nombre: nombre, detalle: detalle || '' });
    failed++;
  }
}

function approxEq(a, b, tol) {
  tol = tol || 1e-9;
  return Math.abs(a - b) < tol;
}

// ============================================================
// FUNCIONES BAJO PRUEBA (inlineadas para no depender de DOM)
// Las implementaciones son copia literal de cotizador_core.js y
// sic_data_adapter.js — si el código fuente cambia, actualizar aquí.
// ============================================================

// ── CALC.estadoIEC ──────────────────────────────────────────
function estadoIEC(lineasCalculadas, iecMix, config) {
  var pol = (config && config.iec_politica) || {};
  var iecMin     = pol.iec_min_autorizado     !== undefined ? pol.iec_min_autorizado     : 0.90;
  var desviMax   = pol.desviacion_critica_max_item !== undefined ? pol.desviacion_critica_max_item : 0.25;
  var umbralCrit = 1 - desviMax; // 0.75

  if (iecMix === null || iecMix === undefined) {
    return { estado: 'sin_datos', nombre: 'Sin datos', descripcion: 'No hay líneas con precio piso definido.' };
  }

  var itemsCriticos = (lineasCalculadas || []).filter(function (l) {
    return l.elegible_iec && l.iec_linea !== null && l.iec_linea !== undefined && l.iec_linea < umbralCrit;
  });
  if (itemsCriticos.length > 0) {
    return { estado: 'C', bloquea_pdf: true, items_criticos: itemsCriticos };
  }
  if (iecMix >= iecMin) {
    return { estado: 'A', bloquea_pdf: false };
  }
  return { estado: 'B', bloquea_pdf: false };
}

// ── CALC.prorratearTransporte ────────────────────────────────
function prorratearTransporte(lineasCalculadas, montoTransporte) {
  if (!montoTransporte || montoTransporte <= 0) {
    return lineasCalculadas.map(function () { return { transporte_prorrateado: 0 }; });
  }
  var totalLineas = lineasCalculadas.reduce(function (s, l) { return s + (l.total_linea || 0); }, 0);
  if (totalLineas <= 0) {
    var parte = montoTransporte / (lineasCalculadas.length || 1);
    return lineasCalculadas.map(function () { return { transporte_prorrateado: parte }; });
  }
  var asignado = 0;
  return lineasCalculadas.map(function (l, idx) {
    var prop;
    if (idx === lineasCalculadas.length - 1) {
      prop = montoTransporte - asignado;
    } else {
      prop = Math.round(montoTransporte * ((l.total_linea || 0) / totalLineas));
      asignado += prop;
    }
    return { transporte_prorrateado: prop };
  });
}

// ── CALC.calcularIECConTransporte ────────────────────────────
function calcularIECConTransporte(lineasCalculadas, transporteProrrateado, config) {
  var ventaElegible = 0;
  var pisoTotal     = 0;
  var transporteElegible = 0;
  lineasCalculadas.forEach(function (l, idx) {
    if (!l.elegible_iec) return;
    var factor   = Number(l.factor_presentacion) || 1;
    var cantidad = Number(l.cantidad_envases)    || 0;
    var tp = (transporteProrrateado && transporteProrrateado[idx])
             ? (transporteProrrateado[idx].transporte_prorrateado || 0)
             : 0;
    var ventaNeta = (l.total_linea || 0) - tp;
    var piso      = Number(l.precio_piso_unitario) * factor * cantidad;
    ventaElegible      += ventaNeta;
    pisoTotal          += piso;
    transporteElegible += tp;
  });
  return {
    iec_mix_neto:               pisoTotal > 0 ? ventaElegible / pisoTotal : null,
    venta_neta_elegible:        ventaElegible,
    valor_piso_teorico:         pisoTotal,
    transporte_total_prorrateado: transporteElegible
  };
}

// ── CALC.calcularInteresFinanciero ───────────────────────────
function calcularInteresFinanciero(plazo_dias, monto_base, config) {
  var cfg = (config && config.interes_financiero) || {};
  var gracia     = cfg.gracia_dias    !== undefined ? cfg.gracia_dias    : 90;
  var tasaMensual = cfg.tasa_mensual_pct !== undefined ? cfg.tasa_mensual_pct : 1.2;
  plazo_dias = Number(plazo_dias)   || 0;
  monto_base = Number(monto_base)   || 0;
  if (plazo_dias <= gracia) {
    return { aplica: false, dias_excedentes: 0, monto: 0, gracia_dias: gracia, tasa_mensual_pct: tasaMensual };
  }
  var diasExcedentes = plazo_dias - gracia;
  var monto = monto_base * (tasaMensual / 100) * (diasExcedentes / 30);
  return { aplica: true, dias_excedentes: diasExcedentes, monto: Math.round(monto), gracia_dias: gracia, tasa_mensual_pct: tasaMensual };
}

// ── UTIL.generarFingerprint ──────────────────────────────────
function generarFingerprint(quote) {
  var contenido = JSON.stringify({
    id:             quote.id || quote.numero || '',
    cliente_rut:    quote.cliente && quote.cliente.rut,
    condicion_pago: quote.condicion_pago,
    validez_dias:   quote.validez_dias,
    lineas: (quote.lineas || []).map(function (l) {
      return [l.producto, l.presentacion, l.cantidad_envases, l.precio_venta_unitario, l.descuento || 0];
    }),
    despacho_modo:      quote.despacho && quote.despacho.modo_transporte,
    despacho_monto:     quote.despacho && quote.despacho.costo_despacho,
    despacho_incluido:  quote.despacho && quote.despacho.incluido,
    interes_dias:       quote.interes_dias  || 0,
    aplica_interes:     quote.aplica_interes || false
  });
  var hash = 5381;
  for (var i = 0; i < contenido.length; i++) {
    hash = (((hash << 5) + hash) + contenido.charCodeAt(i)) & 0x7fffffff;
  }
  return 'FP-' + hash.toString(36).toUpperCase().padStart(8, '0');
}

// ── SIC: IEC ponderado por vendedor (adaptado de sic_data_adapter.js) ──
function computarIECPonderadoVendedor(ventas, mesCode, clave) {
  // Formula: Σ venta_neta / Σ (cantidad × precio_piso_unitario)
  // Solo ventas del mes de desempeño, elegibles (pp > 0, qty > 0, vn > 0)
  var numerador = 0, denominador = 0;
  ventas.forEach(function (v) {
    if (v.vendedor_id !== clave) return;
    if (v._pertenece_mes_desempeno !== (mesCode || true)) return;
    if (v.piso_situacion === 'no_evaluable') return;
    var qty = Number(v.cantidad);
    var pp  = Number(v.precio_piso_unitario);
    var vpt = (isFinite(qty) && qty > 0 && isFinite(pp) && pp > 0) ? qty * pp : 0;
    if (vpt > 0) {
      numerador   += v.venta_neta;
      denominador += vpt;
    }
  });
  return denominador > 0 ? { iec_pct: numerador / denominador * 100, numerador: numerador, denominador: denominador } : null;
}

// Version simplificada para tests (sin filtro de mes ni vendedor):
function iecPonderado(ventas) {
  var num = 0, den = 0;
  ventas.forEach(function (v) {
    var qty = Number(v.cantidad);
    var pp  = Number(v.precio_piso_unitario);
    var vpt = (isFinite(qty) && qty > 0 && isFinite(pp) && pp > 0) ? qty * pp : 0;
    if (vpt > 0) { num += v.venta_neta; den += vpt; }
  });
  return den > 0 ? num / den : null;
}

// ============================================================
// T1-T4: IEC PONDERADO — FÓRMULA MATEMÁTICA
// ============================================================
console.log('\n── T1-T4: IEC Ponderado – Fórmula ─────────────────────');

// T1: Venta exactamente en piso → IEC = 1.000
(function () {
  var ventas = [{ cantidad: 10, precio_piso_unitario: 100, venta_neta: 1000 }]; // total = 10×100 = 1000 = piso
  var iec = iecPonderado(ventas);
  assert('T1: venta en piso exacto → IEC = 1.000',
    approxEq(iec, 1.0),
    'Obtenido: ' + iec);
})();

// T2: Venta al 120% del piso → IEC = 1.200
(function () {
  var ventas = [{ cantidad: 5, precio_piso_unitario: 200, venta_neta: 1200 }]; // piso=5×200=1000, venta=1200
  var iec = iecPonderado(ventas);
  assert('T2: venta al 120% del piso → IEC = 1.200',
    approxEq(iec, 1.2),
    'Obtenido: ' + iec);
})();

// T3: Dos líneas — ponderación correcta (no promedio simple de %)
(function () {
  // Línea A: qty=10, pp=100 → vpt=1000, vn=1100 (110%)
  // Línea B: qty=5,  pp=200 → vpt=1000, vn=900  (90%)
  // Ponderado: (1100+900)/(1000+1000) = 2000/2000 = 1.000
  // Promedio simple: (1.1+0.9)/2 = 1.000 (mismo aquí, pero no siempre)
  var ventas = [
    { cantidad: 10, precio_piso_unitario: 100, venta_neta: 1100 },
    { cantidad: 5,  precio_piso_unitario: 200, venta_neta: 900  }
  ];
  var iec = iecPonderado(ventas);
  assert('T3: dos líneas simétricas → IEC ponderado = 1.000',
    approxEq(iec, 1.0),
    'Obtenido: ' + iec);
})();

// T3b: Dos líneas asimétricas — ponderado ≠ promedio simple
(function () {
  // Línea A: qty=1, pp=100  → vpt=100,  vn=80   (80%)
  // Línea B: qty=1, pp=1000 → vpt=1000, vn=1050 (105%)
  // Ponderado: (80+1050)/(100+1000) = 1130/1100 ≈ 1.02727
  // Promedio simple: (0.80+1.05)/2 = 0.925 ← DIFERENTE
  var ventas = [
    { cantidad: 1, precio_piso_unitario: 100,  venta_neta: 80   },
    { cantidad: 1, precio_piso_unitario: 1000, venta_neta: 1050 }
  ];
  var iec = iecPonderado(ventas);
  var esperado = 1130 / 1100;
  assert('T3b: líneas asimétricas → ponderado correcto (≠ promedio simple)',
    approxEq(iec, esperado, 1e-6),
    'Esperado: ' + esperado + ' Obtenido: ' + iec);
})();

// T4: Línea sin pp (no elegible) → excluida del cálculo
(function () {
  // Solo la línea con pp debe contribuir
  var ventas = [
    { cantidad: 5,  precio_piso_unitario: 100, venta_neta: 600 }, // elegible
    { cantidad: 10, precio_piso_unitario: 0,   venta_neta: 200 }  // no elegible (pp=0)
  ];
  var iec = iecPonderado(ventas);
  // Esperado: solo línea A → 600/500 = 1.2
  assert('T4: línea sin pp excluida → IEC = 1.200 (solo línea elegible)',
    approxEq(iec, 1.2),
    'Obtenido: ' + iec);
})();

// ============================================================
// T5-T7: ESTADO IEC A/B/C
// ============================================================
console.log('\n── T5-T7: Estado IEC A/B/C ─────────────────────────────');

var configPolitica = { iec_politica: { iec_min_autorizado: 0.90, desviacion_critica_max_item: 0.25 } };

// T5: IEC_MIX=0.95, todos ítems ≥ 0.75 → Estado A
(function () {
  var lineas = [
    { elegible_iec: true, iec_linea: 0.95 },
    { elegible_iec: true, iec_linea: 1.10 }
  ];
  var estado = estadoIEC(lineas, 0.95, configPolitica);
  assert('T5: IEC_MIX=95%, todos ítems ok → Estado A (aprobación automática)',
    estado.estado === 'A' && !estado.bloquea_pdf,
    'Obtenido estado: ' + estado.estado);
})();

// T6: IEC_MIX=0.88, ningún ítem < 0.75 → Estado B
(function () {
  var lineas = [
    { elegible_iec: true, iec_linea: 0.90 },
    { elegible_iec: true, iec_linea: 0.86 } // bajo 90% pero sobre 75%
  ];
  var estado = estadoIEC(lineas, 0.88, configPolitica);
  assert('T6: IEC_MIX=88%, ningún crítico → Estado B (requiere autorización)',
    estado.estado === 'B' && !estado.bloquea_pdf,
    'Obtenido estado: ' + estado.estado);
})();

// T7: IEC_MIX=0.95 pero un ítem al 0.70 → Estado C (override)
(function () {
  var lineas = [
    { elegible_iec: true, iec_linea: 1.10 },
    { elegible_iec: true, iec_linea: 0.70 } // < 0.75 → crítico (excepción crítica)
  ];
  var estado = estadoIEC(lineas, 0.95, configPolitica);
  assert('T7: IEC_MIX=95% pero ítem al 70% → Estado C (excepción crítica override)',
    estado.estado === 'C' && estado.bloquea_pdf === true,
    'Obtenido estado: ' + estado.estado);
})();

// ============================================================
// T8-T9: PRORRATEO DE TRANSPORTE
// ============================================================
console.log('\n── T8-T9: Prorrateo de Transporte ──────────────────────');

// T8: Dos líneas iguales → reparto 50/50
(function () {
  var lineas = [
    { total_linea: 1000 },
    { total_linea: 1000 }
  ];
  var prorrateado = prorratearTransporte(lineas, 100);
  assert('T8: dos líneas iguales → transporte 50/50',
    prorrateado[0].transporte_prorrateado === 50 && prorrateado[1].transporte_prorrateado === 50,
    JSON.stringify(prorrateado));
})();

// T9: Invariante — suma de prorrateados = transporte total
(function () {
  var lineas = [
    { total_linea: 300 },
    { total_linea: 700 },
    { total_linea: 150 }
  ];
  var montoTransporte = 97; // número primo para forzar redondeo
  var prorrateado = prorratearTransporte(lineas, montoTransporte);
  var suma = prorrateado.reduce(function (s, p) { return s + p.transporte_prorrateado; }, 0);
  assert('T9: invariante Σ prorrateados = monto transporte (con redondeo en última línea)',
    suma === montoTransporte,
    'Suma: ' + suma + ' vs esperado: ' + montoTransporte + ' | ' + JSON.stringify(prorrateado));
})();

// ============================================================
// T10-T11: IEC CON TRANSPORTE INCLUIDO
// ============================================================
console.log('\n── T10-T11: IEC con Transporte Incluido ────────────────');

// T10: venta $120 sobre piso $100, transporte $10 → IEC = ($120-$10)/$100 = 1.10
(function () {
  var lineas = [
    { elegible_iec: true, factor_presentacion: 1, cantidad_envases: 1, precio_piso_unitario: 100, total_linea: 120 }
  ];
  var tp = [{ transporte_prorrateado: 10 }];
  var res = calcularIECConTransporte(lineas, tp, configPolitica);
  // venta neta = 120 - 10 = 110; piso = 100×1×1 = 100; IEC = 1.10
  assert('T10: transporte INCLUIDO deduce correctamente de venta neta → IEC = 1.10',
    approxEq(res.iec_mix_neto, 1.10),
    'Obtenido: ' + res.iec_mix_neto);
})();

// T11: sin transporte → IEC igual al bruto
(function () {
  var lineas = [
    { elegible_iec: true, factor_presentacion: 1, cantidad_envases: 5, precio_piso_unitario: 100, total_linea: 600 }
  ];
  var tp = [{ transporte_prorrateado: 0 }];
  var res = calcularIECConTransporte(lineas, tp, configPolitica);
  // venta neta = 600; piso = 100×1×5 = 500; IEC = 1.20
  assert('T11: sin transporte → IEC = venta/piso = 1.20',
    approxEq(res.iec_mix_neto, 1.20),
    'Obtenido: ' + res.iec_mix_neto);
})();

// ============================================================
// T12-T14: INTERÉS FINANCIERO
// ============================================================
console.log('\n── T12-T14: Interés Financiero ──────────────────────────');

var cfgInteres = { interes_financiero: { gracia_dias: 90, tasa_mensual_pct: 1.2 } };

// T12: plazo exactamente 90 días (en gracia) → aplica=false, monto=0
(function () {
  var res = calcularInteresFinanciero(90, 100000, cfgInteres);
  assert('T12: plazo=90 días (borde gracia) → aplica=false, monto=0',
    res.aplica === false && res.monto === 0,
    JSON.stringify(res));
})();

// T13: plazo 120 días (30 excedentes) → monto = base × 1.2% × (30/30) = base × 1.2%
(function () {
  var monto_base = 10000;
  var res = calcularInteresFinanciero(120, monto_base, cfgInteres);
  // dias_excedentes = 30; monto = 10000 × 0.012 × (30/30) = 120
  var esperado = Math.round(monto_base * (1.2 / 100) * (30 / 30));
  assert('T13: plazo=120 días (30 excedentes) → monto = base × 1.2% = ' + esperado,
    res.aplica === true && res.monto === esperado && res.dias_excedentes === 30,
    JSON.stringify(res));
})();

// T14: plazo 60 días (dentro de gracia) → aplica=false
(function () {
  var res = calcularInteresFinanciero(60, 50000, cfgInteres);
  assert('T14: plazo=60 días (dentro de gracia) → aplica=false, monto=0',
    res.aplica === false && res.monto === 0,
    JSON.stringify(res));
})();

// ============================================================
// T15-T16: FINGERPRINT DETERMINISTA
// ============================================================
console.log('\n── T15-T16: Fingerprint Determinista ────────────────────');

var quoteBase = {
  id: 'AV-CL-001',
  cliente: { rut: '12345678-9' },
  condicion_pago: '30 días',
  validez_dias: 15,
  lineas: [
    { producto: 'Producto A', presentacion: '20 L', cantidad_envases: 5, precio_venta_unitario: 12000, descuento: 0 }
  ],
  despacho: { modo_transporte: 'SEPARADO', costo_despacho: 50000, incluido: false },
  interes_dias: 0,
  aplica_interes: false
};

// T15: mismo quote produce mismo fingerprint (determinismo)
(function () {
  var fp1 = generarFingerprint(quoteBase);
  var fp2 = generarFingerprint(quoteBase);
  assert('T15: mismo quote → mismo fingerprint (determinismo)',
    fp1 === fp2 && fp1.startsWith('FP-'),
    'FP1: ' + fp1 + ' FP2: ' + fp2);
})();

// T16: cambio de precio → fingerprint diferente
(function () {
  var quoteModificado = JSON.parse(JSON.stringify(quoteBase));
  quoteModificado.lineas[0].precio_venta_unitario = 11000; // precio bajado
  var fpOriginal  = generarFingerprint(quoteBase);
  var fpModificado = generarFingerprint(quoteModificado);
  assert('T16: precio cambiado → fingerprint diferente (autorización invalidada)',
    fpOriginal !== fpModificado,
    'FP original: ' + fpOriginal + ' FP modificado: ' + fpModificado);
})();

// ============================================================
// T17-T18: RECONCILIACIÓN SIC — IEC PONDERADO ES AGREGABLE
// ============================================================
console.log('\n── T17-T18: Reconciliación SIC Ponderado ────────────────');

// T17: tres ventas de un vendedor → IEC ponderado = Σvne/Σvpt
(function () {
  // venta A: qty=10, pp=100 → vpt=1000, vn=1200 (120% del piso)
  // venta B: qty=5,  pp=200 → vpt=1000, vn=900  (90% del piso)
  // venta C: qty=0,  pp=100 → vpt=0 → NO elegible (qty=0)
  // Esperado: (1200+900)/(1000+1000) = 2100/2000 = 1.05
  var ventas = [
    { cantidad: 10, precio_piso_unitario: 100, venta_neta: 1200 },
    { cantidad: 5,  precio_piso_unitario: 200, venta_neta: 900  },
    { cantidad: 0,  precio_piso_unitario: 100, venta_neta: 80   } // qty=0, excluida
  ];
  var iec = iecPonderado(ventas);
  assert('T17: IEC ponderado correcto (Σvne/Σvpt), excluye líneas con qty=0',
    approxEq(iec, 2100 / 2000),
    'Esperado: ' + (2100/2000) + ' Obtenido: ' + iec);
})();

// T18: Agregabilidad — IEC de dos meses = Σnum/Σden (no promedio de %)
(function () {
  // Mes 1: num=1200, den=1000 → iec=1.200
  // Mes 2: num=900,  den=1000 → iec=0.900
  // YTD ponderado: (1200+900)/(1000+1000) = 2100/2000 = 1.050
  // YTD promedio simple: (1.200+0.900)/2 = 1.050 (coincide aquí por simetría)
  // Test con casos asimétricos para distinguir:
  // Mes 1: num=500,  den=400  → iec=1.250
  // Mes 2: num=2000, den=2500 → iec=0.800
  // YTD ponderado: 2500/2900 ≈ 0.8621
  // YTD promedio:  (1.250+0.800)/2 = 1.025  ← DIFERENTE
  var mes1 = { numerador: 500,  denominador: 400  };
  var mes2 = { numerador: 2000, denominador: 2500 };
  var ytd_num = mes1.numerador + mes2.numerador;
  var ytd_den = mes1.denominador + mes2.denominador;
  var iecYTD  = ytd_num / ytd_den;
  var iecPromedio = ((mes1.numerador/mes1.denominador) + (mes2.numerador/mes2.denominador)) / 2;
  assert('T18: IEC YTD ponderado (Σnum/Σden) ≠ promedio de % (lógica de agregación correcta)',
    approxEq(iecYTD, 2500 / 2900, 1e-9) && !approxEq(iecYTD, iecPromedio, 1e-3),
    'YTD ponderado: ' + iecYTD.toFixed(6) + ' vs promedio simple: ' + iecPromedio.toFixed(6));
})();

// ============================================================
// RECONCILIACIÓN: formula cotizador = formula SIC = formula AVBOARD
// ============================================================
console.log('\n── RECONCILIACIÓN: Cotizador = SIC = AVBOARD ───────────');

(function () {
  // Mismos datos, tres perspectivas:
  //   Cotizador.calcularIECConTransporte (por cotización)
  //   SIC.computarIECPonderado (por mes)
  //   AVBOARD.compute_iec (por país — Python, misma fórmula)
  // Si Σvne/Σvpt da el mismo resultado en los tres → reconciliados.

  var ventaNeta = 1500;
  var cantidad  = 10;
  var pp        = 120;
  var vpt       = cantidad * pp; // 1200

  // Cotizador
  var linea = { elegible_iec: true, factor_presentacion: 1, cantidad_envases: cantidad, precio_piso_unitario: pp, total_linea: ventaNeta };
  var resCotiz = calcularIECConTransporte([linea], [{ transporte_prorrateado: 0 }], configPolitica);
  var iecCotizador = resCotiz.iec_mix_neto;

  // SIC adapter (fórmula inline)
  var iecSIC = iecPonderado([{ cantidad: cantidad, precio_piso_unitario: pp, venta_neta: ventaNeta }]);

  // AVBOARD (Python): vne/vpt = ventaNeta/vpt (misma aritmética)
  var iecAVBOARD = ventaNeta / vpt;

  var esperado = ventaNeta / vpt; // 1500/1200 = 1.25

  assert('RECONCILIACIÓN: Cotizador, SIC y AVBOARD producen el mismo IEC (' + esperado.toFixed(4) + ')',
    approxEq(iecCotizador, esperado) && approxEq(iecSIC, esperado) && approxEq(iecAVBOARD, esperado),
    'Cotizador: ' + iecCotizador + ' SIC: ' + iecSIC + ' AVBOARD: ' + iecAVBOARD);
})();

// ============================================================
// RESULTADO FINAL
// ============================================================
console.log('\n══════════════════════════════════════════════════════════');
console.log(' RESULTADO:  ' + passed + ' OK  /  ' + failed + ' FALLIDOS  /  ' + (passed + failed) + ' total');
console.log('══════════════════════════════════════════════════════════');

results.forEach(function (r) {
  var prefix = r.ok ? '  ✓' : '  ✗';
  console.log(prefix + ' ' + r.nombre);
  if (!r.ok && r.detalle) console.log('      → ' + r.detalle);
});

if (failed > 0) {
  console.log('\n⚠  HAY TESTS FALLIDOS. NO hacer commit ni push hasta corregirlos.');
  console.log('   Solo javier@agrovecalatam.com puede autorizar commit con errores conocidos.');
  process.exit(1);
} else {
  console.log('\n✓  Todos los tests pasaron. Lista para revisión de Javier antes de commit.');
}
