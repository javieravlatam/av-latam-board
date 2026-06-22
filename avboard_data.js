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
 *   Chile ventas → 21/06/2026
 *   Chile CxC    → 17/05/2026 (2 entidades)
 *   Perú ventas  → 19/06/2026
 *   Perú CxC     → 10/05/2026
 *
 * Actualizado: 2026-06-22
 */

var AVBOARD = (function() {

  var meta = {
    version:      '2026-06-22',
    tc_clp_usd:   950,
    meta_mn:      0.25,
    cortes: {
      chile_ventas: '21/06/2026',
      chile_cxc:    '17/05/2026',
      peru_ventas:  '19/06/2026',
      peru_cxc:     '10/05/2026'
    },
    meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  };

  var grupo = {
    ytd_usd:      791105,
    ytd_clp:      751549367,
    chile_ytd_usd: 412919,
    peru_ytd_usd:  378186,
    rtc_activos:  12,
    mn_chile:     0.179,
    mn_peru:      null
  };

  var chile_ventas = {
    ytd_5m:          392272667,
    ytd_4m:          304047745,
    mayo_parcial:    60181659,
    ppto_anual:      792640368.0,
    ppto_4m:         193244968,
    ppto_5m:         246979768,
    cumplimiento_4m: 1.5734,
    cumplimiento_t1: 1.1857,
    mensual_real:  [88231364, 35651978, 52370709, 127793694, 60181659, 28043263, 0, 0, 0, 0, 0, 0],
    mensual_ppto:  [72303400.0, 36596500.0, 39746700.0, 44598368.0, 53734800.0, 71112400.0, 37720500.0, 82581300.0, 102341400.0, 93908900.0, 86921300.0, 71074800.0],
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
      almeida: [0, 0, 0, 0, 210000, 330000, 0, 0, 0, 0, 0, 0],
      caroca: [14820273, 6389076, 31913309, 10171393, 9822200, 23454020, 0, 0, 0, 0, 0, 0],
      encina: [13510783, 7262717, 6819022, 5495612, 8815784, 486243, 0, 0, 0, 0, 0, 0],
      laratro: [37027580, 10378585, 5487150, 97504189, 18073675, 1827000, 0, 0, 0, 0, 0, 0],
      munoz: [2195728, 765600, 1274728, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      velasquez: [14491000, 9912000, 5196500, 14622500, 23260000, 1806000, 0, 0, 0, 0, 0, 0],
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
      total: 0.303,
      velasquez: 0.144,
      laratro: 0.328,
      caroca: 0.684,
      encina: 0.290,
      veverka: 0.936,
      munoz: 0.531,
      impacto_potencial_clp: 161837652
    },
    mn_real:  0.179,
    mn_meta:  0.250
  };

  var chile_cxc = {
    corte:    '17/05/2026',
    entidades: 2,
    total:    138511571,
    vencida:  57858879,
    al_dia:   80652692,
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
        total:  33656806,
        tramos: {
          t90:   23647064,
          t6190: 9247014,
          t3160: 762728,
          t030:  0
        }
      }
    },
    tramos: {
      t90:   29978866,
      t6190: 16908155,
      t3160: 10971858,
      t030:  80652692
    },
    tramos_pct: {
      t90:   0.2164,
      t6190: 0.1221,
      t3160: 0.0792,
      t030:  0.5823
    },
    por_rtc: {
      velasquez: {
        total:   41948928,
        pct:     0.3029,
        vencida: 19111995,
        t90:     0,
        riesgo: 'RIESGO'
      },
      encina: {
        total:   22486724,
        pct:     0.1623,
        vencida: 6940354,
        t90:     0,
        riesgo: 'RIESGO'
      },
      laratro: {
        total:   20577619,
        pct:     0.1486,
        vencida: 6815864,
        t90:     2858024,
        riesgo: 'CRÍTICO'
      },
      otros: {
        total:   19904603,
        pct:     0.1437,
        vencida: 19471190,
        t90:     18618455,
        riesgo: 'CRÍTICO'
      },
      neira: {
        total:   9965856,
        pct:     0.0719,
        vencida: 9965856,
        t90:     3754844,
        riesgo: 'CRÍTICO'
      },
      franco_riffo: {
        total:   9247014,
        pct:     0.0668,
        vencida: 9247014,
        t90:     0,
        riesgo: 'RIESGO'
      },
      caroca: {
        total:   7101558,
        pct:     0.0513,
        vencida: 7101558,
        t90:     2173830,
        riesgo: 'CRÍTICO'
      },
      veverka: {
        total:   5886216,
        pct:     0.0425,
        vencida: 1266636,
        t90:     1266636,
        riesgo: 'CRÍTICO'
      },
      munoz: {
        total:   1393053,
        pct:     0.0101,
        vencida: 1393053,
        t90:     1307077,
        riesgo: 'CRÍTICO'
      }
    },
    cuentas_criticas: [
      {
        cliente: "NIVALDO ANTONIO FLORES EGAÑA",
        rtc: "CAPEL",
        dias: 597,
        monto: 5318824,
        estado: "CRÍTICO",
        alerta: "PRIORIDAD_MAXIMA"
      },
      {
        cliente: "TRANSACCIONES AGRICOLAS SPA",
        rtc: "JOSÉ LORENZONI",
        dias: 193,
        monto: 3856957,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "AGROCOMERCIAL Y GANADERA LOMA LARGA LIMITADA",
        rtc: "JUAN PABLO NEIRA",
        dias: 102,
        monto: 3754844,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "AGRICOLA LOS QUILLAYES SPA",
        rtc: "GUILLERMO PRADENAS",
        dias: 367,
        monto: 2813517,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "AGRIC LOS SAUSALES LTDA",
        rtc: "CAPEL",
        dias: 395,
        monto: 2523276,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "AGROINSUMOS KULLIN SPA",
        rtc: "PABLO LARATRO",
        dias: 176,
        monto: 1936809,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "LOS PARRONALES DE CAMARICO S A",
        rtc: "CAPEL",
        dias: 387,
        monto: 1877820,
        estado: "CRÍTICO",
        alerta: "URGENTE"
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
        dias: 135,
        monto: 1307077,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "SOC AGRICOLA VIENTO NORTE LTDA",
        rtc: "IVÁN VEVERKA",
        dias: 326,
        monto: 961996,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "AGRICOLA HIJUELA SAN JOSE DE PIRQUE SPA",
        rtc: "GUILLERMO PRADENAS",
        dias: 408,
        monto: 948192,
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
        cliente: "VICENTE ADAN LAGOS SALDANA",
        rtc: "GUILLERMO PRADENAS",
        dias: 524,
        monto: 742655,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "MAGALY DEL CARMEN ORELLANA PINO",
        rtc: "JORGE CAROCA",
        dias: 143,
        monto: 700134,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "PEDRO JUAN BUGUENO TELLO",
        rtc: "IVÁN VEVERKA",
        dias: 668,
        monto: 304640,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "ROMERO Y RIQUELME SPA",
        rtc: "GUILLERMO PRADENAS",
        dias: 493,
        monto: 240975,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "NEWEN BOTANICUM SPA",
        rtc: "JOSELIN MUÑOZ",
        dias: 698,
        monto: 150289,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "GERALDINE MORILLO",
        rtc: "JOSELIN MUÑOZ",
        dias: 698,
        monto: 145950,
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
    ytd_5m:       378186,
    ytd_4m:       259813,
    mayo_parcial: 84159,
    ppto_anual:   1380014.8,
    ppto_4m:      292677.2,
    ppto_5m:      358399.2,
    cumplimiento_4m: 0.8877,
    cumplimiento_5m: 1.0552,
    mensual_real: [70232, 38180, 87967, 63434, 84159, 0, 0, 0, 0, 0, 0, 0],
    mensual_ppto: [54018.4, 60698.8, 103228.0, 74732.0, 65722.0, 104999.0, 127929.0, 208900.0, 211628.0, 182802.0, 108220.0, 77137.6],
    por_vendedor: {
      aguirre: {
        nombre: "Lisbeth Aguirre",
        ytd:    105597,
        mayo:   49431
      },
      atalaya: {
        nombre: "Omar Atalaya",
        ytd:    85589,
        mayo:   8400
      },
      diaz: {
        nombre: "Susan Diaz",
        ytd:    17220,
        mayo:   2600
      },
      gonzales: {
        nombre: "Antonio Gonzales",
        ytd:    696,
        mayo:   0
      },
      infante: {
        nombre: "Oscar Infante",
        ytd:    146424,
        mayo:   22328
      },
      navarro: {
        nombre: "Nicoll Navarro",
        ytd:    14620,
        mayo:   0
      },
      valladares: {
        nombre: "Patricia Valladares",
        ytd:    8040,
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
      aguirre: [0, 6184, 28681, 13447, 49431, 0, 0, 0, 0, 0, 0, 0],
      atalaya: [29881, 8108, 20000, 6600, 8400, 0, 0, 0, 0, 0, 0, 0],
      diaz: [0, 0, 0, 6300, 2600, 0, 0, 0, 0, 0, 0, 0],
      gonzales: [600, 0, 96, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      infante: [32831, 16188, 38190, 36887, 22328, 0, 0, 0, 0, 0, 0, 0],
      navarro: [6920, 7700, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
