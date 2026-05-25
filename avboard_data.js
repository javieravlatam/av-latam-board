/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  AVBOARD · Capa de datos global · Agroveca Grupo LATAM 2026     ║
 * ║  Archivo: avboard_data.js                                        ║
 * ║  Propósito: fuente única de verdad para todos los dashboards     ║
 * ║                                                                  ║
 * ║  GENERADO AUTOMÁTICAMENTE — scripts/update_avboard.py            ║
 * ║  NO EDITAR MANUALMENTE                                           ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Cortes:
 *   Chile ventas → 24/05/2026
 *   Chile CxC    → 17/05/2026 (2 entidades)
 *   Perú ventas  → 22/05/2026
 *   Perú CxC     → 10/05/2026
 *
 * Actualizado: 2026-05-25
 */

var AVBOARD = (function() {

  var meta = {
    version:      '2026-05-25',
    tc_clp_usd:   950,
    meta_mn:      0.25,
    cortes: {
      chile_ventas: '24/05/2026',
      chile_cxc:    '17/05/2026',
      peru_ventas:  '22/05/2026',
      peru_cxc:     '10/05/2026'
    },
    meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  };

  var grupo = {
    ytd_usd:      703550,
    ytd_clp:      668372760,
    chile_ytd_usd: 367678,
    peru_ytd_usd:  335872,
    rtc_activos:  12,
    mn_chile:     0.179,
    mn_peru:      null
  };

  var chile_ventas = {
    ytd_5m:          349294360,
    ytd_4m:          306612701,
    mayo_parcial:    42681659,
    ppto_anual:      861321350,
    ppto_4m:         213591350,
    ppto_5m:         264591350,
    cumplimiento_4m: 1.4355,
    cumplimiento_t1: 1.0544,
    mensual_real:  [88231364, 35651978, 52370709, 130358650, 42681659, 0, 0, 0, 0, 0, 0, 0],
    mensual_ppto:  [83558032, 41601950, 42000000, 46431368, 51000000, 49730000, 62800000, 76500000, 110800000, 112700000, 97500000, 86700000],
    rtc_real_t1:   {
      caroca: 53122658,
      encina: 27592522,
      laratro: 52893315,
      munoz: 4236056,
      velasquez: 29599500,
      veverka: 8810000
    },
    rtc_ppto_t1: {
      caroca:    33000000,
      laratro:   54100000,
      encina:    29200000,
      velasquez: 32860000,
      veverka:   18000000
    },
    rtc_mensual_real: {
      almeida: [0, 0, 0, 0, 210000, 0, 0, 0, 0, 0, 0, 0],
      caroca: [14820273, 6389076, 31913309, 10171393, 9822200, 0, 0, 0, 0, 0, 0, 0],
      encina: [13510783, 7262717, 6819022, 5495612, 8733784, 0, 0, 0, 0, 0, 0, 0],
      laratro: [37027580, 10378585, 5487150, 100069145, 4753675, 0, 0, 0, 0, 0, 0, 0],
      munoz: [2195728, 765600, 1274728, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      velasquez: [14491000, 9912000, 5196500, 14622500, 19162000, 0, 0, 0, 0, 0, 0, 0],
      veverka: [6186000, 944000, 1680000, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    rtc_mensual_ppto: {
      caroca: [12500000, 6000000, 14500000, 8831000, 12500000, 8730000, 6000000, 25500000, 10800000, 8700000, 5000000, 12500000],
      encina: [14200000, 7500000, 7500000, 5000000, 5000000, 5000000, 5000000, 12000000, 21000000, 28000000, 31000000, 28700000],
      laratro: [36000000, 10600000, 7500000, 16600000, 22500000, 10000000, 7800000, 21000000, 25000000, 20000000, 37500000, 19500000],
      velasquez: [14858000, 11502000, 6500000, 10000000, 5000000, 20000000, 38000000, 12000000, 48000000, 50000000, 18000000, 20000000],
      veverka: [6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000]
    },
    iec: {
      total: 0.329,
      velasquez: 0.143,
      laratro: 0.382,
      caroca: 0.671,
      encina: 0.294,
      veverka: 0.936,
      munoz: 0.531,
      impacto_potencial_clp: 146241846
    },
    mn_real:  0.179,
    mn_meta:  0.250
  };

  var chile_cxc = {
    corte:    '17/05/2026',
    entidades: 2,
    total:    162180611,
    vencida:  38674641,
    al_dia:   123505970,
    por_entidad: {
      agrocomercial: {
        nombre: 'Agrocomercial',
        total:  104854765,
        tramos: {
          t90:   6331802,
          t6190: 7661141,
          t3160: 10209130,
          t030:  80652692
        }
      },
      agroveca_chile: {
        nombre: 'Agroveca Chile',
        total:  57325846,
        tramos: {
          t90:   13180918,
          t6190: 1291650,
          t3160: 0,
          t030:  42853278
        }
      }
    },
    tramos: {
      t90:   19512720,
      t6190: 8952791,
      t3160: 10209130,
      t030:  123505970
    },
    tramos_pct: {
      t90:   0.1203,
      t6190: 0.0552,
      t3160: 0.0629,
      t030:  0.7615
    },
    por_rtc: {
      laratro: {
        total:   48832443,
        pct:     0.3011,
        vencida: 11017456,
        t90:     1460166,
        riesgo: 'CRÍTICO'
      },
      velasquez: {
        total:   41948928,
        pct:     0.2587,
        vencida: 19111995,
        t90:     0,
        riesgo: 'RIESGO'
      },
      encina: {
        total:   22486724,
        pct:     0.1387,
        vencida: 6940354,
        t90:     0,
        riesgo: 'RIESGO'
      },
      neira: {
        total:   19212870,
        pct:     0.1185,
        vencida: 9965856,
        t90:     3754844,
        riesgo: 'CRÍTICO'
      },
      franco_riffo: {
        total:   12860413,
        pct:     0.0793,
        vencida: 9530710,
        t90:     9530710,
        riesgo: 'CRÍTICO'
      },
      caroca: {
        total:   9007332,
        pct:     0.0555,
        vencida: 8387651,
        t90:     3459923,
        riesgo: 'CRÍTICO'
      },
      veverka: {
        total:   5152700,
        pct:     0.0318,
        vencida: 0,
        t90:     0,
        riesgo: 'NORMAL'
      },
      munoz: {
        total:   1393053,
        pct:     0.0086,
        vencida: 1393053,
        t90:     1307077,
        riesgo: 'CRÍTICO'
      },
      otros: {
        total:   1286148,
        pct:     0.0079,
        vencida: 852735,
        t90:     0,
        riesgo: 'RIESGO'
      }
    },
    cuentas_criticas: [
      {
        cliente: "AGROCOMERCIAL Y GANADERA LOMA LARGA LIMITADA",
        rtc: "FRANCO RIFFO / JUAN PABLO NEIRA",
        dias: 132,
        monto: 13285554,
        estado: "CRÍTICO",
        alerta: "PRIORIDAD_MAXIMA"
      },
      {
        cliente: "AGRICOLA RIBERA LIMITADA",
        rtc: "JORGE CAROCA",
        dias: 122,
        monto: 1473696,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "COMERCIAL COPELEC S.A.",
        rtc: "VALENTINA MUÑOZ",
        dias: 108,
        monto: 1307077,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "RAMADA DE CAMPOS SPA",
        rtc: "JORGE CAROCA",
        dias: 93,
        monto: 1286093,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "AGROINSUMOS KULLIN",
        rtc: "PABLO LARATRO",
        dias: 115,
        monto: 921215,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "MAGALY DEL CARMEN ORELLANA PINO",
        rtc: "JORGE CAROCA",
        dias: 116,
        monto: 700134,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "AGROINSUMOS KULLIN SPA",
        rtc: "PABLO LARATRO",
        dias: 127,
        monto: 538951,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "GOYASERVICE SPA",
        rtc: "Jorge Caroca",
        dias: null,
        monto: 4194750,
        estado: "RESUELTO",
        alerta: null,
        nota: "PAGADO ✅ entre 17/04 y 29/04"
      }
    ]
  };

  var peru_ventas = {
    ytd_5m:       335872,
    ytd_4m:       260113,
    mayo_parcial: 75759,
    ppto_anual:   1137034,
    ppto_4m:      284684,
    ppto_5m:      346630,
    cumplimiento_4m: 0.9137,
    cumplimiento_5m: 0.969,
    mensual_real: [70232, 38180, 87967, 63734, 75759, 0, 0, 0, 0, 0, 0, 0],
    mensual_ppto: [51674, 58489, 103222, 71299, 61946, 78710, 100675, 178180, 125564, 165842, 98481, 42952],
    por_vendedor: {
      aguirre: {
        nombre: "Lisbeth Aguirre",
        ytd:    98043,
        mayo:   49431
      },
      atalaya: {
        nombre: "Omar Atalaya",
        ytd:    64589,
        mayo:   0
      },
      diaz: {
        nombre: "Susan Diaz",
        ytd:    8900,
        mayo:   2600
      },
      gonzales: {
        nombre: "Antonio Gonzales",
        ytd:    696,
        mayo:   0
      },
      infante: {
        nombre: "Oscar Infante",
        ytd:    130104,
        mayo:   22328
      },
      navarro: {
        nombre: "Nicoll Navarro",
        ytd:    30940,
        mayo:   0
      },
      valladares: {
        nombre: "Patricia Valladares",
        ytd:    2600,
        mayo:   1400
      }
    },
    rtc_ppto_anual: {
      infante: 485058,
      aguirre: 223930,
      atalaya: 248424,
      gonzales: 37250,
      valladares: 142372
    },
    rtc_mensual_real: {
      aguirre: [0, 6184, 28681, 13747, 49431, 0, 0, 0, 0, 0, 0, 0],
      atalaya: [29881, 8108, 20000, 6600, 0, 0, 0, 0, 0, 0, 0, 0],
      diaz: [0, 0, 0, 6300, 2600, 0, 0, 0, 0, 0, 0, 0],
      gonzales: [600, 0, 96, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      infante: [16511, 16188, 38190, 36887, 22328, 0, 0, 0, 0, 0, 0, 0],
      navarro: [23240, 7700, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      valladares: [0, 0, 1000, 200, 1400, 0, 0, 0, 0, 0, 0, 0]
    },
    iec: {
      total: null, aguirre: null, infante: null,
      atalaya: 0.867, valladares: 0.167, gonzales: null,
      impacto_potencial_usd: 4000
    },
    mn_real:  null,
    mn_meta:  0.250
  };

  var peru_cxc = {
    "corte": "10/05/2026",
    "total": 117964,
    "supra": 196841,
    "tramos": {
      "no_vencida": 79300,
      "t030": 10534,
      "t3160": 3149,
      "t6190": 1360,
      "t90": 23621
    },
    "tramos_pct": {
      "no_vencida": 0.672,
      "t030": 0.089,
      "t3160": 0.027,
      "t6190": 0.012,
      "t90": 0.2
    },
    "vencida": 38664,
    "por_vendedor": {
      "infante": {
        "total": 28153,
        "pct": 0.239,
        "vencida": 15881,
        "t90": 4598,
        "riesgo": "CRÍTICO"
      },
      "geldres": {
        "total": 10874,
        "pct": 0.092,
        "vencida": 10874,
        "t90": 10874,
        "riesgo": "CRÍTICO"
      },
      "atalaya": {
        "total": 15343,
        "pct": 0.13,
        "vencida": 15343,
        "t90": 15343,
        "riesgo": "CRÍTICO"
      },
      "aguirre_navarro": {
        "total": 58942,
        "pct": 0.499,
        "vencida": 1432,
        "t90": 0,
        "riesgo": "RIESGO"
      },
      "gonzales_valladares": {
        "total": 1600,
        "pct": 0.014,
        "vencida": 800,
        "t90": 0,
        "riesgo": "NORMAL"
      },
      "pradenas_sin_asignar": {
        "total": 7030,
        "pct": 0.06,
        "vencida": 4830,
        "t90": 0,
        "riesgo": "NORMAL"
      }
    },
    "cuentas_criticas": [
      {
        "cliente": "PAODISA S.A.",
        "vendedor": "J. Geldres",
        "dias": "468-648d",
        "monto": 10874.4,
        "estado": "CRÍTICO",
        "nota": "4 facturas 2024 · proceso legal pendiente"
      },
      {
        "cliente": "AGROFER MJ E.I.R.L.",
        "vendedor": "O. Atalaya",
        "dias": 211,
        "monto": 9493.0,
        "estado": "CRÍTICO",
        "nota": "acuerdo de pago urgente"
      },
      {
        "cliente": "LUNA QUINTANILLA BRYAN ALEXANDER",
        "vendedor": "O. Infante",
        "dias": "97-143d",
        "monto": 2349.05,
        "estado": "CRÍTICO",
        "nota": "2 folios"
      },
      {
        "cliente": "EPIC FARMS S.A.C.",
        "vendedor": "A. Gonzalez",
        "dias": 107,
        "monto": 600.0,
        "estado": "CRÍTICO",
        "nota": "escaló desde 61-90d"
      }
    ]
  };

  var rentabilidad = {
    alertas_nivel1: [{ pais:"CL", sku:"HUMIC ROOT (formato N/D)", margen:-0.335, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"PLUS MICRO MIX 1L", margen:-0.143, accion:"SUBIR_PRECIO_O_DESCONTINUAR" }],
    alertas_nivel2: [{ pais:"CL", sku:"PLUS MICRO MIX (formato N/D)", margen:0.09 }, { pais:"CL", sku:"PLUS ZINC (formato N/D)", margen:0.031 }, { pais:"CL", sku:"PLUS ZINC MANGANESO 1L", margen:0.059 }],
    impacto_clp:    25400000,
    skus_bajo_piso_chile: 71,
    skus_bajo_piso_peru:   5,
    skus_sin_costo_chile: 11,
    skus_sin_costo_peru:   4
  };

  return {
    meta:         meta,
    grupo:        grupo,
    chile:  { ventas: chile_ventas, cxc: chile_cxc },
    peru:   { ventas: peru_ventas,  cxc: peru_cxc  },
    rentabilidad: rentabilidad,
    tc:       function() { return meta.tc_clp_usd; },
    clpToUsd: function(clp) { return Math.round(clp / meta.tc_clp_usd); },
    usdToClp: function(usd) { return usd * meta.tc_clp_usd; },
    fmt_clp:  function(v) { return v.toLocaleString('es-CL'); },
    fmt_usd:  function(v) { return v.toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0}); },
    fmt_pct:  function(v) { return (v * 100).toFixed(1) + '%'; },
    chile_ytd:     function() { return chile_ventas.ytd_5m; },
    peru_ytd:      function() { return peru_ventas.ytd_5m; },
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

(function verificarIntegridad() {
  var ok = true; var errores = [];
  var sumaChile = AVBOARD.chile.ventas.mensual_real.reduce(function(a,b){return a+b;}, 0);
  if (sumaChile !== AVBOARD.chile.ventas.ytd_5m)
    errores.push('Chile mensual suma ' + sumaChile + ' ≠ ytd ' + AVBOARD.chile.ventas.ytd_5m);
  var sumaPeruR = AVBOARD.peru.ventas.mensual_real.reduce(function(a,b){return a+b;}, 0);
  if (Math.abs(sumaPeruR - AVBOARD.peru.ventas.ytd_5m) > 5)
    errores.push('Perú mensual suma ' + sumaPeruR + ' ≠ ytd ' + AVBOARD.peru.ventas.ytd_5m);
  var sumaCxcCH = AVBOARD.chile.cxc.por_entidad.agrocomercial.total +
                  AVBOARD.chile.cxc.por_entidad.agroveca_chile.total;
  if (sumaCxcCH !== AVBOARD.chile.cxc.total)
    errores.push('CxC entidades ' + sumaCxcCH + ' ≠ total ' + AVBOARD.chile.cxc.total);
  var t = AVBOARD.chile.cxc.tramos;
  var sumaTrCH = t.t90 + t.t6190 + t.t3160 + t.t030;
  if (sumaTrCH !== AVBOARD.chile.cxc.total)
    errores.push('CxC tramos ' + sumaTrCH + ' ≠ total ' + AVBOARD.chile.cxc.total);
  if (ok && errores.length === 0) {
    console.log('[AVBOARD] ✅ Integridad OK · ' + AVBOARD.meta.version);
  } else {
    console.warn('[AVBOARD] ⚠ Errores:');
    errores.forEach(function(e){ console.warn('  · ' + e); });
  }
})();
