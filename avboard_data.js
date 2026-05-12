/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  AVBOARD · Capa de datos global · Agroveca Grupo LATAM 2026     ║
 * ║  Archivo: avboard_data.js                                        ║
 * ║  Propósito: fuente única de verdad para todos los dashboards     ║
 * ║                                                                  ║
 * ║  REGLAS DE USO                                                   ║
 * ║  · Este archivo NO se edita manualmente salvo en corte oficial   ║
 * ║  · Todos los valores son canónicos y ya validados por Claude     ║
 * ║  · Al actualizar: reemplazar sección completa del corte          ║
 * ║  · Unidades: CLP absoluto · USD absoluto · TC referencia 950     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Cortes:
 *   Chile ventas → 11/05/2026 (Mayo parcial al 08/05)
 *   Chile CxC    → 08/05/2026 (2 entidades)
 *   Perú ventas  → 11/05/2026
 *   Perú CxC     → 10/05/2026
 *
 * Actualizado: 2026-05-12
 */

/* ─────────────────────────────────────────────────────────────
   EXPORTACIÓN GLOBAL
───────────────────────────────────────────────────────────── */
var AVBOARD = (function() {

  /* ═══════════════════════════════════════════════
     META · Sistema y parámetros globales
  ═══════════════════════════════════════════════ */
  var meta = {
    version:      '2026-05-12',
    tc_clp_usd:   950,           // Tipo de cambio referencia
    meta_mn:      0.25,          // Meta margen neto (25%)
    cortes: {
      chile_ventas: '11/05/2026',
      chile_cxc:    '08/05/2026',
      peru_ventas:  '11/05/2026',
      peru_cxc:     '10/05/2026'
    },
    meses: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  };


  /* ═══════════════════════════════════════════════
     GRUPO · Consolidado LATAM
  ═══════════════════════════════════════════════ */
  var grupo = {
    // YTD 5m (Jan–May parcial)
    ytd_usd:         674536,        // Chile 349,432 + Perú 325,104
    ytd_clp:         640809200,      // aprox (Chile 331.96M + Perú equiv. 308.85M)

    // Distribución por país
    chile_ytd_usd:   349432,        // 331,961,000 / TC 950
    peru_ytd_usd:    325103,

    // Vendedores activos
    rtc_activos:     12,            // 7 Chile + 5 Perú (aprox)

    // Margen neto consolidado
    mn_chile:        0.179,         // 17.9% (calculado T1)
    mn_peru:         null           // N/D — sin costo por SKU Perú
  };


  /* ═══════════════════════════════════════════════
     CHILE · Ventas
     Unidades: CLP absoluto
  ═══════════════════════════════════════════════ */
  var chile_ventas = {

    // ── Totales YTD ──────────────────────────────
    ytd_5m:          331961000,     // CLP (Jan–May parcial 08/05)
    ytd_4m:          306628000,     // CLP (Jan–Abr definitivo)
    mayo_parcial:     25333000,     // CLP al 08/05 (no definitivo)

    // ── Presupuesto ──────────────────────────────
    ppto_anual:      861321000,     // CLP
    ppto_4m:         213591000,     // CLP (Jan–Abr)
    ppto_5m:         264591000,     // CLP (Jan–May)

    // ── Cumplimiento ─────────────────────────────
    cumplimiento_4m: 1.436,         // 143.6% Real 4m / Ppto 4m
    cumplimiento_t1: 1.054,         // 105.4% Real T1 / Ppto T1

    // ── Mensual real (CLP) · índice 0=Ene ────────
    mensual_real: [
      88231000,   // Ene
      35652000,   // Feb
      52371000,   // Mar
     130374000,   // Abr  ← definitivo (batch Laratro 30/04)
      25333000,   // May  ← parcial al 08/05
              0,  // Jun
              0,  // Jul
              0,  // Ago
              0,  // Sep
              0,  // Oct
              0,  // Nov
              0   // Dic
    ],

    // ── Mensual presupuesto (CLP) ────────────────
    mensual_ppto: [
      83558000,   // Ene
      41602000,   // Feb
      42000000,   // Mar
      46431000,   // Abr
      51000000,   // May
      49730000,   // Jun
      62800000,   // Jul
      76500000,   // Ago
     110800000,   // Sep
     112700000,   // Oct
      97500000,   // Nov
      86700000    // Dic
    ],

    // ── Por RTC · Real T1 (Jan–Mar) CLP ──────────
    // Nota: Abr/May por RTC no disponible en corte — se consolidan en equipo
    rtc_real_t1: {
      caroca:    53123000,
      laratro:   52893000,
      encina:    27593000,
      velasquez: 29600000,
      veverka:    8810000
    },

    // ── Por RTC · Ppto T1 (Jan–Mar) CLP ──────────
    rtc_ppto_t1: {
      caroca:    33000000,
      laratro:   54100000,
      encina:    29200000,
      velasquez: 32860000,
      veverka:   18000000
    },

    // ── Por RTC · Mensual real (CLP) ─────────────
    rtc_mensual_real: {
      caroca:    [14820000,  6389000, 31913000, 10171000, null, null, null, null, null, null, null, null],
      laratro:   [37028000, 10379000,  5487000,  1701000, null, null, null, null, null, null, null, null],
      encina:    [13511000,  7263000,  6819000,   803000, null, null, null, null, null, null, null, null],
      velasquez: [14491000,  9912000,  5197000,  1890000, null, null, null, null, null, null, null, null],
      veverka:   [ 6186000,   944000,  1680000,        0, null, null, null, null, null, null, null, null]
    },

    // ── Por RTC · Mensual ppto (CLP) ────────────
    rtc_mensual_ppto: {
      caroca:    [12500000, 6000000, 14500000,  8831000, 12500000,  8730000,  6000000, 25500000, 10800000,  8700000,  5000000, 12500000],
      laratro:   [36000000,10600000,  7500000, 16600000, 22500000, 10000000,  7800000, 21000000, 25000000, 20000000, 37500000, 19500000],
      encina:    [14200000, 7500000,  7500000,  5000000,  5000000,  5000000,  5000000, 12000000, 21000000, 28000000, 31000000, 28700000],
      velasquez: [14858000,11502000,  6500000, 10000000,  5000000, 20000000, 38000000, 12000000, 48000000, 50000000, 18000000, 20000000],
      veverka:   [ 6000000, 6000000,  6000000,  6000000,  6000000,  6000000,  6000000,  6000000,  6000000,  6000000,  6000000,  6000000]
    },

    // ── IEC · Índice de Eficiencia Comercial ─────
    // IEC = % del valor de ventas a precio piso o superior
    iec: {
      total:     0.453,   // 45.3% · CLP 79.1M bajo piso identificado
      velasquez: 0.231,   // 23.1% · mayor brecha absoluta CLP 6.8M
      laratro:   null,    // T/B/D
      caroca:    null,    // T/B/D
      encina:    null,    // T/B/D
      veverka:   null,    // T/B/D
      impacto_potencial_clp: 25400000  // +CLP 25.4M YTD si se ajustan precios piso
    },

    // ── Margen neto ──────────────────────────────
    mn_real:  0.179,      // 17.9% promedio calculado T1
    mn_meta:  0.250       // 25.0% objetivo
  };


  /* ═══════════════════════════════════════════════
     CHILE · CxC (Cuentas por Cobrar)
     Unidades: CLP absoluto
     Fuente: 2 entidades (Agrocomercial + Agroveca Chile) · corte 08/05/2026
  ═══════════════════════════════════════════════ */
  var chile_cxc = {

    corte:    '08/05/2026',
    entidades: 2,          // NUEVO: 2 entidades consolidadas

    // ── Totales combinados ───────────────────────
    total:    134698594,
    vencida:   36209379,   // >30d
    al_dia:    98489215,   // 0-30d y sin vencer

    // ── Por entidad ──────────────────────────────
    por_entidad: {
      agrocomercial: {
        nombre: 'Agrocomercial',
        total:   68112335,
        tramos: {
          t90:    5286135,
          t6190:  4756891,
          t3160: 11693785,
          t030:  46375524
        }
      },
      agroveca_chile: {
        nombre: 'Agroveca Chile',
        total:   66586259,
        tramos: {
          t90:   10587748,
          t6190:  2593170,
          t3160:  1291650,
          t030:  52113691
        }
      }
    },

    // ── Tramos combinados ────────────────────────
    tramos: {
      t90:    15873883,    // +90d CRÍTICO 🔴
      t6190:   7350061,    // 61-90d RIESGO
      t3160:  12985435,    // 31-60d ALERTA
      t030:   98489215     // 0-30d NORMAL (incluye no vencidas)
    },

    // ── Porcentajes ──────────────────────────────
    tramos_pct: {
      t90:    0.1178,      // 11.8%
      t6190:  0.0546,      //  5.5%
      t3160:  0.0964,      //  9.6%
      t030:   0.7312       // 73.1%
    },

    // ── Por RTC (2 entidades combinadas) ─────────
    por_rtc: {
      neira: {
        total:    39464290,
        pct:      0.293,
        vencida:  16395630,
        t90:      13895630,
        riesgo:  'CRÍTICO'
      },
      laratro: {
        total:    44939482,
        pct:      0.334,
        vencida:   3043466,
        t90:       1460166,
        riesgo:  'CRÍTICO'
      },
      encina: {
        total:    19344022,
        pct:      0.144,
        vencida:  11693785,
        t90:             0,
        riesgo:  'ALERTA'
      },
      velasquez: {
        total:    14358540,
        pct:      0.107,
        vencida:          0,
        t90:              0,
        riesgo:  'NORMAL'
      },
      otros: {
        total:    16592260,
        pct:      0.123,
        vencida:   4607317,
        t90:        518087,
        riesgo:  'RIESGO'
      }
    },

    // ── Cuentas críticas +90d ────────────────────
    cuentas_criticas: [
      {
        cliente:  'LOMA LARGA LTDA',
        rtc:      'Neira / Laratro',
        dias:     '92-114d',
        monto:    12421934,
        estado:   'CRÍTICO',
        alerta:   'PRIORIDAD_MAXIMA',
        nota:     '2 entidades: Agrocomercial 2,891,224 + Agroveca Chile 9,530,710'
      },
      {
        cliente:  'AGRICOLA RIBERA LIMITADA',
        rtc:      'Jorge Caroca',
        dias:     104,
        monto:     1473696,
        estado:   'CRÍTICO',
        alerta:   'URGENTE'
      },
      {
        cliente:  'AGROINSUMOS KULLIN',
        rtc:      'Laratro / Neira',
        dias:     '97d+',
        monto:     1460166,   // combinado 2 entidades
        estado:   'CRÍTICO',
        alerta:   'URGENTE'
      },
      {
        cliente:  'MAGALY ORELLANA PINO',
        rtc:      'Jorge Caroca',
        dias:     73,
        monto:      182047,
        estado:   'RIESGO',
        alerta:   'SEGUIMIENTO'
      },
      {
        cliente:  'SOC. AGRIC. TIERRA DE BACO',
        rtc:      'Varios',
        dias:     '31-43d',
        monto:     2915500,
        estado:   'ALERTA',
        alerta:   'SEGUIMIENTO'
      },
      {
        cliente:  'GOYASERVICE SPA',
        rtc:      'Jorge Caroca',
        dias:     null,
        monto:     4194750,
        estado:   'RESUELTO',
        alerta:   null,
        nota:     'PAGADO ✅ entre 17/04 y 29/04'
      }
    ]
  };


  /* ═══════════════════════════════════════════════
     PERÚ · Ventas
     Unidades: USD absoluto
  ═══════════════════════════════════════════════ */
  var peru_ventas = {

    // ── Totales YTD ──────────────────────────────
    ytd_5m:    325103,      // USD (Jan–May parcial 11/05) · exacto 325,103.9 → 325,103
    ytd_4m:    260112,      // USD (Jan–Abr definitivo)
    mayo_parcial: 64991,    // USD al 11/05

    // ── Presupuesto ──────────────────────────────
    ppto_anual: 1137034,    // USD
    ppto_4m:     284684,    // USD (Jan–Abr)
    ppto_5m:     346630,    // USD (Jan–May)

    // ── Cumplimiento ─────────────────────────────
    cumplimiento_4m: 0.914, // 91.4%
    cumplimiento_5m: 0.938, // 93.8%

    // ── Mensual real (USD) ────────────────────────
    mensual_real: [
      70232,   // Ene
      38180,   // Feb
      87966,   // Mar
      63734,   // Abr  ← definitivo
      64991,   // May  ← parcial al 11/05
          0,   // Jun
          0,   // Jul
          0,   // Ago
          0,   // Sep
          0,   // Oct
          0,   // Nov
          0    // Dic
    ],

    // ── Mensual presupuesto (USD) ─────────────────
    mensual_ppto: [
      51674,    // Ene
      58489,    // Feb
     103222,    // Mar
      71299,    // Abr
      61946,    // May
      78710,    // Jun
     100675,    // Jul
     178180,    // Ago
     125564,    // Sep
     165842,    // Oct
      98481,    // Nov
      42952     // Dic
    ],

    // ── Por vendedor · YTD 5m (USD) ──────────────
    por_vendedor: {
      infante: {
        nombre:  'O. Infante',
        ytd:     121072,
        ppto_t1: 94144,     // real T1 (actual en presupuesto)
        mayo:     13296,
        mayo_detalle: 'IQF 7,920 + AMFRESH 5,376'
      },
      aguirre: {
        nombre:  'L. Aguirre',
        ytd:      97107,
        ppto_t1:  26314,    // real T1 (alta aceleración reciente)
        mayo:     48495,
        mayo_detalle: 'FAMILY FARMS 19,800×2 + UVICA 1,170 + REITER 7,725'
      },
      atalaya: {
        nombre:  'O. Atalaya',
        ytd:      64589,
        ppto_t1:  59071,
        mayo:         0
      },
      navarro: {
        nombre:  'N. Navarro',
        ytd:      30940,
        ppto_t1:  null,    // combinado con Aguirre en ppto
        mayo:         0
      },
      gonzales: {
        nombre:  'A. Gonzales',
        ytd:        696,
        ppto_t1:    696,
        mayo:         0
      },
      valladares: {
        nombre:  'P. Valladares',
        ytd:       1800,
        ppto_t1:   1000,
        mayo:         0
      },
      diaz: {
        nombre:  'S. Díaz',
        ytd:       8900,
        ppto_t1:   null,
        mayo:         0
      }
    },

    // ── Por vendedor · Ppto anual (USD) ──────────
    rtc_ppto_anual: {
      infante:    485058,
      aguirre:    223930,   // combinado con Navarro en ppto original
      atalaya:    248424,
      gonzales:    37250,
      valladares: 142372
    },

    // ── Por vendedor · Mensual real (USD) ────────
    rtc_mensual_real: {
      infante:    [16526, 16188, 38881, 22550, 13296, null, null, null, null, null, null, null],
      aguirre:    [26314, 14221, 31640,  2172, 48495, null, null, null, null, null, null, null],
      atalaya:    [30071,  9000, 20000,     0,     0, null, null, null, null, null, null, null],
      gonzales:   [  600,     0,    96,     0,     0, null, null, null, null, null, null, null],
      valladares: [    0,     0,  1000,     0,     0, null, null, null, null, null, null, null]
    },

    // ── IEC · Índice de Eficiencia Comercial ─────
    iec: {
      total:      null,     // T/B/D — sin costo cargado para todos los SKUs Perú
      aguirre:    null,
      infante:    null,
      atalaya:    0.867,    // 86.7% — IEC bueno, monitorear en mayor volumen
      valladares: 0.167,    // 16.7% — 3/4 transacciones bajo piso
      gonzales:   null,
      impacto_potencial_usd: 4000  // USD 4K YTD (pequeño impacto)
    },

    // ── Margen neto ──────────────────────────────
    mn_real:  null,         // N/D — sin costo por SKU Perú
    mn_meta:  0.250
  };


  /* ═══════════════════════════════════════════════
     PERÚ · CxC (Cuentas por Cobrar)
     Unidades: USD absoluto
     Fuente: corte 10/05/2026 (excl. PAGADO A SUPRA)
  ═══════════════════════════════════════════════ */
  var peru_cxc = {

    corte:  '10/05/2026',

    // ── Cartera activa (excl. SUPRA) ─────────────
    total:     117964,
    supra:     196841,      // factoring excluido de gestión directa

    // ── Tramos activos ───────────────────────────
    tramos: {
      no_vencida:  79300,   // sin vencer
      t030:        10534,   // 0-30d
      t3160:        3149,   // 31-60d ALERTA
      t6190:        1360,   // 61-90d RIESGO
      t90:         23621    // +90d CRÍTICO
    },

    // ── Porcentajes ──────────────────────────────
    tramos_pct: {
      no_vencida: 0.672,    // 67.2%
      t030:       0.089,    //  8.9%
      t3160:      0.027,    //  2.7%
      t6190:      0.012,    //  1.2%
      t90:        0.200     // 20.0%
    },

    // ── Vencida total ────────────────────────────
    vencida: 38664,         // todo lo que tiene algún día de mora

    // ── Por vendedor ─────────────────────────────
    por_vendedor: {
      infante: {
        total:   28153,
        pct:     0.239,
        vencida: 15881,
        t90:      4598,
        riesgo: 'CRÍTICO'
      },
      geldres: {
        total:   10874,
        pct:     0.092,
        vencida: 10874,
        t90:     10874,
        riesgo: 'CRÍTICO'
      },
      atalaya: {
        total:   15343,     // nota: CORP OLMOS podría ser SUPRA
        pct:     0.130,
        vencida: 15343,
        t90:     15343,
        riesgo: 'CRÍTICO'
      },
      aguirre_navarro: {
        total:   58942,     // ampliado 10/05: nuevas facturas ESAN, UVICA, AGROLATINA
        pct:     0.499,
        vencida:  1432,
        t90:          0,
        riesgo: 'RIESGO'
      },
      gonzales_valladares: {
        total:    1600,
        pct:      0.014,
        vencida:   800,
        t90:           0,
        riesgo: 'NORMAL'
      },
      pradenas_sin_asignar: {
        total:    7030,
        pct:      0.060,
        vencida:  4830,
        t90:          0,
        riesgo: 'NORMAL'
      }
    },

    // ── Cuentas críticas +90d ────────────────────
    cuentas_criticas: [
      {
        cliente: 'PAODISA S.A.',
        vendedor: 'J. Geldres',
        dias:     '468-648d',
        monto:    10874.40,
        estado:   'CRÍTICO',
        nota:     '4 facturas 2024 · proceso legal pendiente'
      },
      {
        cliente: 'AGROFER MJ E.I.R.L.',
        vendedor: 'O. Atalaya',
        dias:     211,
        monto:    9493.00,
        estado:   'CRÍTICO',
        nota:     'acuerdo de pago urgente'
      },
      {
        cliente: 'LUNA QUINTANILLA BRYAN ALEXANDER',
        vendedor: 'O. Infante',
        dias:     '97-143d',
        monto:    2349.05,
        estado:   'CRÍTICO',
        nota:     '2 folios (743 y 841)'
      },
      {
        cliente: 'EPIC FARMS S.A.C.',
        vendedor: 'A. Gonzalez',
        dias:     107,
        monto:    600.00,
        estado:   'CRÍTICO',
        nota:     'escaló desde 61-90d'
      },
      {
        cliente: 'INVERSIONES AJS S.A.C.',
        vendedor: 'O. Infante',
        dias:     323,
        monto:    304.00,
        estado:   'CRÍTICO',
        nota:     ''
      },
      {
        cliente: 'CORP. AGRIC. OLMOS S.A.',
        vendedor: 'O. Atalaya',
        dias:     339,
        monto:    5850.44,
        estado:   'SUPRA',
        nota:     '⚫ PAGADO A SUPRA — factoring'
      },
      {
        cliente: 'AMFRESH PERU AGRISIL (2 facturas)',
        vendedor: 'O. Infante',
        dias:     '339-373d',
        monto:    3289.00,
        estado:   'SUPRA',
        nota:     '⚫ PAGADO A SUPRA — factoring'
      }
    ]
  };


  /* ═══════════════════════════════════════════════
     RENTABILIDAD · Pricing Chile
     Fuente: modulo_rentabilidad_pricing.xlsx
     Corte: T1 2026 (datos históricos)
  ═══════════════════════════════════════════════ */
  var rentabilidad = {
    // Alertas críticas de margen
    alertas_nivel1: [
      { pais:'CL', sku:'HUMIC ROOT (formato N/D)', margen:-0.335, accion:'REVISAR_O_DESCONTINUAR' },
      { pais:'CL', sku:'PLUS MICRO MIX 1L',        margen:-0.143, accion:'SUBIR_PRECIO_O_DESCONTINUAR' }
    ],
    alertas_nivel2: [
      { pais:'CL', sku:'PLUS MICRO MIX (formato N/D)', margen:0.090 },
      { pais:'CL', sku:'PLUS ZINC (formato N/D)',       margen:0.031 },
      { pais:'CL', sku:'PLUS ZINC MANGANESO 1L',        margen:0.059 }
    ],
    // Impacto potencial ajuste de precios
    impacto_clp:    25400000,   // +CLP 25.4M YTD si se llevan precios al piso
    skus_bajo_piso_chile: 71,
    skus_bajo_piso_peru:   5,
    skus_sin_costo_chile: 11,   // CLP 28.6M en ventas sin clasificar
    skus_sin_costo_peru:   4    // USD 64.8K en ventas sin clasificar
  };


  /* ═══════════════════════════════════════════════
     API PÚBLICA
  ═══════════════════════════════════════════════ */
  return {
    meta:         meta,
    grupo:        grupo,
    chile: {
      ventas: chile_ventas,
      cxc:    chile_cxc
    },
    peru: {
      ventas: peru_ventas,
      cxc:    peru_cxc
    },
    rentabilidad: rentabilidad,

    // ── Helpers ──────────────────────────────────
    tc:       function() { return meta.tc_clp_usd; },
    clpToUsd: function(clp) { return Math.round(clp / meta.tc_clp_usd); },
    usdToClp: function(usd) { return usd * meta.tc_clp_usd; },
    fmt_clp:  function(v) { return v.toLocaleString('es-CL'); },
    fmt_usd:  function(v) { return v.toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0}); },
    fmt_pct:  function(v) { return (v * 100).toFixed(1) + '%'; },

    // ── Accesos directos ─────────────────────────
    chile_ytd:    function() { return chile_ventas.ytd_5m; },
    peru_ytd:     function() { return peru_ventas.ytd_5m; },
    grupo_ytd_usd: function() { return grupo.ytd_usd; },

    cxc_chile_t90: function() { return chile_cxc.tramos.t90; },
    cxc_peru_t90:  function() { return peru_cxc.tramos.t90; },
    cxc_alerta_loma_larga: function() {
      return chile_cxc.cuentas_criticas.find(function(c) {
        return c.cliente.indexOf('LOMA LARGA') >= 0;
      });
    }
  };

})();

/* ─────────────────────────────────────────────────────────────
   VERIFICACIÓN DE INTEGRIDAD (auto-check al cargar)
───────────────────────────────────────────────────────────── */
(function verificarIntegridad() {
  var ok = true;
  var errores = [];

  // Chile ventas mensual debe sumar al YTD 5m
  var sumaChile = AVBOARD.chile.ventas.mensual_real.reduce(function(a,b){ return a+b; }, 0);
  if (sumaChile !== AVBOARD.chile.ventas.ytd_5m) {
    errores.push('Chile mensual_real suma ' + sumaChile + ' ≠ ytd_5m ' + AVBOARD.chile.ventas.ytd_5m);
    ok = false;
  }

  // Peru ventas mensual debe sumar al YTD 5m
  var sumaPeruR = AVBOARD.peru.ventas.mensual_real.reduce(function(a,b){ return a+b; }, 0);
  if (sumaPeruR !== AVBOARD.peru.ventas.ytd_5m) {
    errores.push('Perú mensual_real suma ' + sumaPeruR + ' ≠ ytd_5m ' + AVBOARD.peru.ventas.ytd_5m);
    ok = false;
  }

  // Chile CxC entidades deben sumar al total
  var sumaCxcCH = AVBOARD.chile.cxc.por_entidad.agrocomercial.total +
                  AVBOARD.chile.cxc.por_entidad.agroveca_chile.total;
  if (sumaCxcCH !== AVBOARD.chile.cxc.total) {
    errores.push('Chile CxC entidades suman ' + sumaCxcCH + ' ≠ total ' + AVBOARD.chile.cxc.total);
    ok = false;
  }

  // Chile CxC tramos deben sumar al total
  var t = AVBOARD.chile.cxc.tramos;
  var sumaTrCH = t.t90 + t.t6190 + t.t3160 + t.t030;
  if (sumaTrCH !== AVBOARD.chile.cxc.total) {
    errores.push('Chile CxC tramos suman ' + sumaTrCH + ' ≠ total ' + AVBOARD.chile.cxc.total);
    ok = false;
  }

  // Peru CxC tramos deben sumar al total
  var tp = AVBOARD.peru.cxc.tramos;
  var sumaTrPE = tp.no_vencida + tp.t030 + tp.t3160 + tp.t6190 + tp.t90;
  var diffPE = Math.abs(sumaTrPE - AVBOARD.peru.cxc.total);
  if (diffPE > 5) {  // tolerancia $5 por redondeos
    errores.push('Perú CxC tramos suman ' + sumaTrPE + ' ≠ total ' + AVBOARD.peru.cxc.total + ' (diff ' + diffPE + ')');
    ok = false;
  }

  if (ok) {
    console.log('[AVBOARD] ✅ Integridad OK · ' + AVBOARD.meta.version);
  } else {
    console.warn('[AVBOARD] ⚠ Errores de integridad:');
    errores.forEach(function(e){ console.warn('  · ' + e); });
  }
})();
