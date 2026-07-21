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
 *   Chile ventas → 30/06/2026
 *   Chile CxC    → 21/06/2026 (2 entidades)
 *   Perú ventas  → 16/07/2026
 *   Perú CxC     → 10/05/2026
 *
 * Actualizado: 2026-07-21
 */

var AVBOARD = (function() {

  var meta = {
    version:      '2026-07-21',
    tc_clp_usd:   950,
    meta_mn:      0.25,
    cortes: {
      chile_ventas: '30/06/2026',
      chile_cxc:    '21/06/2026',
      peru_ventas:  '16/07/2026',
      peru_cxc:     '10/05/2026'
    },
    meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  };

  var grupo = {
    ytd_usd:      843226,
    ytd_clp:      801064282,
    chile_ytd_usd: 425990,
    peru_ytd_usd:  417236,
    rtc_activos:  12,
    mn_chile:     0.179,
    mn_peru:      null
  };

  var chile_ventas = {
    ytd_5m:          404690082,
    ytd_4m:          304047745,
    mayo_parcial:    40460678,
    ppto_anual:      792640368.0,
    ppto_4m:         193244968,
    ppto_5m:         318092168,
    cumplimiento_4m: 1.5734,
    cumplimiento_5m: 1.2722,
    cumplimiento_t1: 1.1857,
    mensual_real:  [88231364, 35651978, 52370709, 127793694, 60181659, 40460678, 0, 0, 0, 0, 0, 0],
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
      laratro: [37027580, 10378585, 5487150, 97504189, 18073675, 5077000, 0, 0, 0, 0, 0, 0],
      munoz: [2195728, 765600, 1274728, 0, 0, 50415, 0, 0, 0, 0, 0, 0],
      velasquez: [14491000, 9912000, 5196500, 14622500, 23260000, 10923000, 0, 0, 0, 0, 0, 0],
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
      total: 0.340,
      velasquez: 0.168,
      laratro: 0.328,
      caroca: 0.675,
      encina: 0.394,
      veverka: 0.834,
      munoz: 0.605,
      impacto_potencial_clp: 215695266
    },
    mn_real:  0.179,
    mn_meta:  0.250
  };

  var chile_cxc = {
    corte:    '21/06/2026',
    entidades: 2,
    total:    66426892,
    vencida:  39752112,
    al_dia:   26674780,
    por_entidad: {
      agrocomercial: {
        nombre: 'Agrocomercial',
        total:  32770086,
        tramos: {
          t90:   2426626,
          t6190: 820000,
          t3160: 2848680,
          t030:  26674780
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
      t90:   26073690,
      t6190: 10067014,
      t3160: 3611408,
      t030:  26674780
    },
    tramos_pct: {
      t90:   0.3925,
      t6190: 0.1516,
      t3160: 0.0544,
      t030:  0.4016
    },
    por_rtc: {
      laratro: {
        total:   22445717,
        pct:     0.3379,
        vencida: 12653802,
        t90:     2858024,
        riesgo: 'CRÍTICO'
      },
      otros: {
        total:   19077796,
        pct:     0.2872,
        vencida: 19077796,
        t90:     18788714,
        riesgo: 'CRÍTICO'
      },
      franco_riffo: {
        total:   9247014,
        pct:     0.1392,
        vencida: 9247014,
        t90:     0,
        riesgo: 'RIESGO'
      },
      velasquez: {
        total:   7615098,
        pct:     0.1146,
        vencida: 7615098,
        t90:     0,
        riesgo: 'RIESGO'
      },
      veverka: {
        total:   3722796,
        pct:     0.056,
        vencida: 3722796,
        t90:     2086636,
        riesgo: 'CRÍTICO'
      },
      encina: {
        total:   2173282,
        pct:     0.0327,
        vencida: 333105,
        t90:     333105,
        riesgo: 'CRÍTICO'
      },
      munoz: {
        total:   1307077,
        pct:     0.0197,
        vencida: 1307077,
        t90:     1307077,
        riesgo: 'CRÍTICO'
      },
      caroca: {
        total:   838112,
        pct:     0.0126,
        vencida: 838112,
        t90:     700134,
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
        dias: 150,
        monto: 921215,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "AGROCOMERCIAL Y GANADERA LOMA LARGA LIMITADA",
        rtc: "IVAN VEVERKA",
        dias: 107,
        monto: 820000,
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
        cliente: "JOSE CRISTOBAL GONZALEZ CORREA",
        rtc: "RODRIGO ENCINA",
        dias: 101,
        monto: 170789,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "JUAN FRANCISCO VARGAS MANCILLA",
        rtc: "OFICINA",
        dias: 92,
        monto: 170259,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "AGRICOLA TUNICHE LIMITADA",
        rtc: "RODRIGO ENCINA",
        dias: 93,
        monto: 162316,
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
    ytd_5m:       417236,
    ytd_4m:       259813,
    mayo_parcial: 27179,
    ppto_anual:   1380014.8,
    ppto_4m:      292677.2,
    ppto_5m:      358399.2,
    cumplimiento_4m: 0.8877,
    cumplimiento_5m: 0.7056,
    mensual_real: [70232, 38180, 87967, 63434, 84159, 46084, 27179, 0, 0, 0, 0, 0],
    mensual_ppto: [54018.4, 60698.8, 103228.0, 74732.0, 65722.0, 104999.0, 127929.0, 208900.0, 211628.0, 182802.0, 108220.0, 77137.6],
    por_vendedor: {
      aguirre: {
        nombre: "Lisbeth Aguirre",
        ytd:    111621,
        mayo:   2473
      },
      atalaya: {
        nombre: "Omar Atalaya",
        ytd:    85589,
        mayo:   0
      },
      diaz: {
        nombre: "Susan Diaz",
        ytd:    17220,
        mayo:   0
      },
      gonzales: {
        nombre: "Antonio Gonzales",
        ytd:    15562,
        mayo:   8146
      },
      infante: {
        nombre: "Oscar Infante",
        ytd:    152264,
        mayo:   5840
      },
      navarro: {
        nombre: "Nicoll Navarro",
        ytd:    14620,
        mayo:   0
      },
      valladares: {
        nombre: "Patricia Valladares",
        ytd:    20360,
        mayo:   10720
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
      aguirre: [0, 6184, 28681, 13447, 49431, 11404, 2473, 0, 0, 0, 0, 0],
      atalaya: [29881, 8108, 20000, 6600, 8400, 12600, 0, 0, 0, 0, 0, 0],
      diaz: [0, 0, 0, 6300, 2600, 8320, 0, 0, 0, 0, 0, 0],
      gonzales: [600, 0, 96, 0, 0, 6720, 8146, 0, 0, 0, 0, 0],
      infante: [32831, 16188, 38190, 36887, 22328, 0, 5840, 0, 0, 0, 0, 0],
      navarro: [6920, 7700, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      valladares: [0, 0, 1000, 200, 1400, 7040, 10720, 0, 0, 0, 0, 0]
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

  var productos = [
    { pais:"CL", producto:"AV MOVE", formato:"20 L", ventas:45393409, cantidad:8480.0, precio_uni_prom:5353.0, costo_unidad:2797.75, costo_total:23724920, margen_total:21668489, margen_pct:0.4773, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"20 L", ventas:13146442, cantidad:2795.0, precio_uni_prom:4703.56, costo_unidad:1320.6, costo_total:3691077, margen_total:9455365, margen_pct:0.7192, piso:8500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV SILFORTE", formato:"20 L", ventas:16956572, cantidad:2750.0, precio_uni_prom:6166.03, costo_unidad:2319.7, costo_total:6379175, margen_total:10577397, margen_pct:0.6238, piso:10000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"20 L", ventas:5533520, cantidad:2880.0, precio_uni_prom:1921.36, costo_unidad:1503.6, costo_total:4330368, margen_total:1203152, margen_pct:0.2174, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"?", ventas:209000, cantidad:11.0, precio_uni_prom:19000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"20 L", ventas:16879052, cantidad:6820.0, precio_uni_prom:2474.93, costo_unidad:1871.75, costo_total:12765335, margen_total:4113717, margen_pct:0.2437, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"20 L", ventas:10504569, cantidad:4640.0, precio_uni_prom:2263.92, costo_unidad:1444.7, costo_total:6703408, margen_total:3801161, margen_pct:0.3619, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"20 L", ventas:4706470, cantidad:1800.0, precio_uni_prom:2614.71, costo_unidad:2532.8, costo_total:4559040, margen_total:147430, margen_pct:0.0313, piso:5500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"20 L", ventas:8377855, cantidad:2740.0, precio_uni_prom:3057.61, costo_unidad:1882.2, costo_total:5157228, margen_total:3220627, margen_pct:0.3844, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"250 GR", ventas:7679000, cantidad:507.0, precio_uni_prom:15145.96, costo_unidad:8500.0, costo_total:4309500, margen_total:3369500, margen_pct:0.4388, piso:33500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"20 L", ventas:4982457, cantidad:3380.0, precio_uni_prom:1474.1, costo_unidad:1503.6, costo_total:5082168, margen_total:-99711, margen_pct:-0.02, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"PK-DEFEND MAX", formato:"20 L", ventas:560000, cantidad:140.0, precio_uni_prom:4000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PK-DEFEND MAX", formato:"5 L", ventas:67150, cantidad:15.0, precio_uni_prom:4476.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"20 L", ventas:772000, cantidad:280.0, precio_uni_prom:2757.14, costo_unidad:2309.75, costo_total:646730, margen_total:125270, margen_pct:0.1623, piso:14000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"5 L", ventas:194000, cantidad:20.0, precio_uni_prom:9700.0, costo_unidad:3026.8, costo_total:60536, margen_total:133464, margen_pct:0.688, piso:15000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"1 L", ventas:171200, cantidad:62.0, precio_uni_prom:2761.29, costo_unidad:4143.0, costo_total:256866, margen_total:-85666, margen_pct:-0.5004, piso:16000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"20 L", ventas:9778599, cantidad:4900.0, precio_uni_prom:1995.63, costo_unidad:1756.45, costo_total:8606605, margen_total:1171994, margen_pct:0.1199, piso:6500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"1 L", ventas:16757, cantidad:14.0, precio_uni_prom:1196.93, costo_unidad:3589.0, costo_total:50246, margen_total:-33489, margen_pct:-1.9985, piso:9000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN", formato:"5 L", ventas:463716, cantidad:105.0, precio_uni_prom:4416.34, costo_unidad:2553.0, costo_total:268065, margen_total:195651, margen_pct:0.4219, piso:7000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANALISIS FOLIAR CEREZO", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV AMIN", formato:"20 L", ventas:2454120, cantidad:980.0, precio_uni_prom:2504.2, costo_unidad:1835.9, costo_total:1799182, margen_total:654938, margen_pct:0.2669, piso:5500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"20 L", ventas:2466760, cantidad:1640.0, precio_uni_prom:1504.12, costo_unidad:1277.15, costo_total:2094526, margen_total:372234, margen_pct:0.1509, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"500 GR", ventas:5590473, cantidad:343.0, precio_uni_prom:16298.76, costo_unidad:10500.0, costo_total:3601500, margen_total:1988973, margen_pct:0.3558, piso:36500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ODIN TEBUCONAZOLE 43% LT", formato:"?", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"5 L", ventas:700639, cantidad:115.0, precio_uni_prom:6092.51, costo_unidad:3358.2, costo_total:386193, margen_total:314446, margen_pct:0.4488, piso:9000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV NEMA OFF", formato:"500 GR", ventas:1241420, cantidad:42.0, precio_uni_prom:29557.62, costo_unidad:10500.0, costo_total:441000, margen_total:800420, margen_pct:0.6448, piso:35000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"5 L", ventas:447178, cantidad:155.0, precio_uni_prom:2885.02, costo_unidad:2161.8, costo_total:335079, margen_total:112099, margen_pct:0.2507, piso:4000, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"5 L", ventas:1528995, cantidad:560.0, precio_uni_prom:2730.35, costo_unidad:2588.8, costo_total:1449728, margen_total:79267, margen_pct:0.0518, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"5 L", ventas:3310785, cantidad:296.0, precio_uni_prom:11185.08, costo_unidad:3514.8, costo_total:1040381, margen_total:2270404, margen_pct:0.6858, piso:14000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"1 L", ventas:39750, cantidad:8.0, precio_uni_prom:4968.75, costo_unidad:4500.0, costo_total:36000, margen_total:3750, margen_pct:0.0943, piso:18000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"5 L", ventas:790332, cantidad:270.0, precio_uni_prom:2927.16, costo_unidad:1994.2, costo_total:538434, margen_total:251898, margen_pct:0.3187, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"5 L", ventas:237450, cantidad:120.0, precio_uni_prom:1978.75, costo_unidad:1973.6, costo_total:236832, margen_total:618, margen_pct:0.0026, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"5 L", ventas:249315, cantidad:85.0, precio_uni_prom:2933.12, costo_unidad:2830.0, costo_total:240550, margen_total:8765, margen_pct:0.0352, piso:5000, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"20 L", ventas:591315, cantidad:260.0, precio_uni_prom:2274.29, costo_unidad:1360.55, costo_total:353743, margen_total:237572, margen_pct:0.4018, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"20 L", ventas:1408360, cantidad:780.0, precio_uni_prom:1805.59, costo_unidad:1256.7, costo_total:980226, margen_total:428134, margen_pct:0.304, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN", formato:"1 L", ventas:597474, cantidad:127.0, precio_uni_prom:4704.52, costo_unidad:3669.0, costo_total:465963, margen_total:131511, margen_pct:0.2201, piso:7800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"1 L", ventas:167395, cantidad:37.0, precio_uni_prom:4524.19, costo_unidad:3946.0, costo_total:146002, margen_total:21393, margen_pct:0.1278, piso:6000, clasif:"🔴 BAJO PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"1 L", ventas:366075, cantidad:98.0, precio_uni_prom:3735.46, costo_unidad:3278.0, costo_total:321244, margen_total:44831, margen_pct:0.1225, piso:6000, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"1 L", ventas:528780, cantidad:129.0, precio_uni_prom:4099.07, costo_unidad:4047.0, costo_total:522063, margen_total:6717, margen_pct:0.0127, piso:8000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"20 L", ventas:2264000, cantidad:840.0, precio_uni_prom:2695.24, costo_unidad:2214.35, costo_total:1860054, margen_total:403946, margen_pct:0.1784, piso:6800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"5 L", ventas:224572, cantidad:95.0, precio_uni_prom:2363.92, costo_unidad:2599.2, costo_total:246924, margen_total:-22352, margen_pct:-0.0995, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV N-P MIX", formato:"20 L", ventas:0, cantidad:20.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"5 L", ventas:1130167, cantidad:95.0, precio_uni_prom:11896.49, costo_unidad:3384.0, costo_total:321480, margen_total:808687, margen_pct:0.7155, piso:17000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BLOOM", formato:"5 L", ventas:1529752, cantidad:270.0, precio_uni_prom:5665.75, costo_unidad:2980.2, costo_total:804654, margen_total:725098, margen_pct:0.474, piso:9500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"20 L", ventas:2101565, cantidad:1220.0, precio_uni_prom:1722.59, costo_unidad:1838.4, costo_total:2242848, margen_total:-141283, margen_pct:-0.0672, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"200 L", ventas:900000, cantidad:400.0, precio_uni_prom:2250.0, costo_unidad:1192.45, costo_total:476980, margen_total:423020, margen_pct:0.47, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO LOS LIRIOS", formato:"?", ventas:0, cantidad:9.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO LA MONTAÑA", formato:"?", ventas:0, cantidad:4.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO SANTA LUISA", formato:"?", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"5 L", ventas:183560, cantidad:50.0, precio_uni_prom:3671.2, costo_unidad:2931.4, costo_total:146570, margen_total:36990, margen_pct:0.2015, piso:7200, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"1 L", ventas:667758, cantidad:104.0, precio_uni_prom:6420.75, costo_unidad:4631.0, costo_total:481624, margen_total:186134, margen_pct:0.2787, piso:15000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"1 L", ventas:384152, cantidad:73.0, precio_uni_prom:5262.36, costo_unidad:3110.0, costo_total:227030, margen_total:157122, margen_pct:0.409, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"1 L", ventas:1452420, cantidad:313.0, precio_uni_prom:4640.32, costo_unidad:3705.0, costo_total:1159665, margen_total:292755, margen_pct:0.2016, piso:6000, clasif:"🔴 BAJO PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"1 L", ventas:522974, cantidad:118.0, precio_uni_prom:4431.98, costo_unidad:3194.0, costo_total:376892, margen_total:146082, margen_pct:0.2793, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"1 L", ventas:12035, cantidad:2.0, precio_uni_prom:6017.5, costo_unidad:3154.0, costo_total:6308, margen_total:5727, margen_pct:0.4759, piso:6000, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV BLOOM", formato:"1 L", ventas:650138, cantidad:110.0, precio_uni_prom:5910.35, costo_unidad:4096.0, costo_total:450560, margen_total:199578, margen_pct:0.307, piso:11000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOBODEN CRYOPHILE", formato:"250 GR", ventas:1190000, cantidad:70.0, precio_uni_prom:17000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"XCARATOR", formato:"20 L", ventas:2483000, cantidad:1000.0, precio_uni_prom:2483.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"200 L", ventas:1515000, cantidad:800.0, precio_uni_prom:1893.75, costo_unidad:2038.15, costo_total:1630520, margen_total:-115520, margen_pct:-0.0763, piso:8800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV MOVE", formato:"5 L", ventas:2488950, cantidad:420.0, precio_uni_prom:5926.07, costo_unidad:3514.8, costo_total:1476216, margen_total:1012734, margen_pct:0.4069, piso:7800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"?", ventas:32707, cantidad:2.0, precio_uni_prom:16353.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"5 L", ventas:605900, cantidad:160.0, precio_uni_prom:3786.88, costo_unidad:3249.8, costo_total:519968, margen_total:85932, margen_pct:0.1418, piso:6500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"20 L", ventas:18893260, cantidad:2030.0, precio_uni_prom:9307.02, costo_unidad:2797.75, costo_total:5679432, margen_total:13213828, margen_pct:0.6994, piso:13500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV MOVE", formato:"1 L", ventas:430960, cantidad:46.0, precio_uni_prom:9368.7, costo_unidad:4631.0, costo_total:213026, margen_total:217934, margen_pct:0.5057, piso:8800, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"5 L", ventas:62550, cantidad:25.0, precio_uni_prom:2502.0, costo_unidad:2221.6, costo_total:55540, margen_total:7010, margen_pct:0.1121, piso:5800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV SILFORTE", formato:"5 L", ventas:1400750, cantidad:220.0, precio_uni_prom:6367.05, costo_unidad:3036.8, costo_total:668096, margen_total:732654, margen_pct:0.523, piso:10800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"5 L", ventas:162300, cantidad:40.0, precio_uni_prom:4057.5, costo_unidad:2555.4, costo_total:102216, margen_total:60084, margen_pct:0.3702, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"5 L", ventas:35400, cantidad:35.0, precio_uni_prom:1011.43, costo_unidad:2038.0, costo_total:71330, margen_total:-35930, margen_pct:-1.015, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"K-DEFEND MAX", formato:"20 L", ventas:0, cantidad:200.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"1 L", ventas:255690, cantidad:46.0, precio_uni_prom:5558.48, costo_unidad:3715.0, costo_total:170890, margen_total:84800, margen_pct:0.3317, piso:6800, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"5 L", ventas:285603, cantidad:75.0, precio_uni_prom:3808.04, costo_unidad:2077.6, costo_total:155820, margen_total:129783, margen_pct:0.4544, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"1 L", ventas:360156, cantidad:110.0, precio_uni_prom:3274.15, costo_unidad:4474.0, costo_total:492140, margen_total:-131984, margen_pct:-0.3665, piso:10000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"5 L", ventas:1065832, cantidad:205.0, precio_uni_prom:5199.18, costo_unidad:2473.4, costo_total:507047, margen_total:558785, margen_pct:0.5243, piso:8000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"1 L", ventas:137556, cantidad:36.0, precio_uni_prom:3821.0, costo_unidad:3090.0, costo_total:111240, margen_total:26316, margen_pct:0.1913, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV DEFENDER MAX", formato:"1 L", ventas:0, cantidad:15.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV DEFENDER MAX", formato:"5 L", ventas:0, cantidad:50.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"1 L", ventas:100715, cantidad:8.0, precio_uni_prom:12589.38, costo_unidad:4153.0, costo_total:33224, margen_total:67491, margen_pct:0.6701, piso:12000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV15 40-20", formato:"20 L", ventas:3228040, cantidad:1000.0, precio_uni_prom:3228.04, costo_unidad:1873.2, costo_total:1873200, margen_total:1354840, margen_pct:0.4197, piso:5500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOPOTASICO", formato:"500 ML", ventas:0, cantidad:34.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP", formato:"500 ML", ventas:10083, cantidad:42.0, precio_uni_prom:240.07, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"500 ML", ventas:10083, cantidad:32.0, precio_uni_prom:315.09, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM", formato:"500 ML", ventas:0, cantidad:61.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX", formato:"500 ML", ventas:10083, cantidad:118.0, precio_uni_prom:85.45, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"500 ML", ventas:10083, cantidad:136.0, precio_uni_prom:74.14, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"200 ML", ventas:0, cantidad:27.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOPOTASICO CONC.", formato:"200 ML", ventas:0, cantidad:7.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP CONC.", formato:"200 ML", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"20 GR", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"500 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"200 ML", ventas:0, cantidad:53.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"200 ML", ventas:0, cantidad:36.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM CONC.", formato:"200 ML", ventas:0, cantidad:24.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"200 L", ventas:2842000, cantidad:1560.0, precio_uni_prom:1821.79, costo_unidad:1223.05, costo_total:1907958, margen_total:934042, margen_pct:0.3287, piso:3200, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV15 40-20", formato:"1 L", ventas:438390, cantidad:61.0, precio_uni_prom:7186.72, costo_unidad:3706.0, costo_total:226066, margen_total:212324, margen_pct:0.4843, piso:9000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV15 40-20", formato:"5 L", ventas:896253, cantidad:170.0, precio_uni_prom:5272.08, costo_unidad:2590.2, costo_total:440334, margen_total:455919, margen_pct:0.5087, piso:6500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"1000 L", ventas:23600000, cantidad:13000.0, precio_uni_prom:1815.38, costo_unidad:1159.92, costo_total:15078960, margen_total:8521040, margen_pct:0.3611, piso:2800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"200 L", ventas:7170000, cantidad:4050.0, precio_uni_prom:1770.37, costo_unidad:1223.05, costo_total:4953352, margen_total:2216648, margen_pct:0.3092, piso:3200, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"200 L", ventas:7316000, cantidad:1160.0, precio_uni_prom:6306.9, costo_unidad:1179.85, costo_total:1368626, margen_total:5947374, margen_pct:0.8129, piso:7000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"1 L", ventas:49668, cantidad:14.0, precio_uni_prom:3547.71, costo_unidad:4366.0, costo_total:61124, margen_total:-11456, margen_pct:-0.2307, piso:8000, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV PRADERAS", formato:"250 GR", ventas:3210908, cantidad:222.0, precio_uni_prom:14463.55, costo_unidad:10500.0, costo_total:2331000, margen_total:879908, margen_pct:0.274, piso:31000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BODENPRO POTASIO", formato:"20 L", ventas:3780000, cantidad:2000.0, precio_uni_prom:1890.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"20 L", ventas:2058000, cantidad:840.0, precio_uni_prom:2450.0, costo_unidad:2112.95, costo_total:1774878, margen_total:283122, margen_pct:0.1376, piso:4000, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"500 ML", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"K-DEFEND MAX", formato:"5 L", ventas:0, cantidad:10.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BLOOM", formato:"20 L", ventas:8817500, cantidad:1440.0, precio_uni_prom:6123.26, costo_unidad:2263.3, costo_total:3259152, margen_total:5558348, margen_pct:0.6304, piso:9000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANALISIS V-CO", formato:"0000 HOJAS", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANALISIS V-C0", formato:"0000 HOJAS", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"200 L", ventas:1400000, cantidad:1000.0, precio_uni_prom:1400.0, costo_unidad:1600.65, costo_total:1600650, margen_total:-200650, margen_pct:-0.1433, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"GREEN PLANT", formato:"500 ML", ventas:10083, cantidad:91.0, precio_uni_prom:110.8, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"200 L", ventas:900000, cantidad:200.0, precio_uni_prom:4500.0, costo_unidad:2251.27, costo_total:450254, margen_total:449746, margen_pct:0.4997, piso:4500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"1 L", ventas:3902, cantidad:1.0, precio_uni_prom:3902.0, costo_unidad:3671.0, costo_total:3671, margen_total:231, margen_pct:0.0592, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"SOLUFOS", formato:"500 GR", ventas:5000000, cantidad:400.0, precio_uni_prom:12500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CRYOPHILE", formato:"250 GR", ventas:15356000, cantidad:1536.0, precio_uni_prom:9997.4, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"20 L", ventas:80000, cantidad:40.0, precio_uni_prom:2000.0, costo_unidad:1320.95, costo_total:52838, margen_total:27162, margen_pct:0.3395, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANALISIS FOLIAR", formato:"?", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"500 ML", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"500 ML", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PRODRUCTOS DE", formato:"1 L", ventas:96000, cantidad:9.0, precio_uni_prom:10666.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANALSIS FOLIAR", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"20 L", ventas:6208000, cantidad:750.0, precio_uni_prom:8277.33, costo_unidad:2667.0, costo_total:2000250, margen_total:4207750, margen_pct:0.6778, piso:15800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANÁLSIS FOLIAR", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS SUELO EPS", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS SUELO BÁSICO", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS AGUA DE RIEGO", formato:"?", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"BIOAV INVERNAL", formato:"250 GR", ventas:36820905, cantidad:1405.0, precio_uni_prom:26207.05, costo_unidad:8500.0, costo_total:11942500, margen_total:24878405, margen_pct:0.6757, piso:34800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"PROTECT PRADERAS", formato:"250 GR", ventas:28800000, cantidad:1600.0, precio_uni_prom:18000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"1 L", ventas:172200, cantidad:24.0, precio_uni_prom:7175.0, costo_unidad:4666.0, costo_total:111984, margen_total:60216, margen_pct:0.3497, piso:8000, clasif:"🔴 BAJO PISO", estado:"OK" },
    { pais:"CL", producto:"FOLIBAC BIO INVIERNO", formato:"250 GR", ventas:15900000, cantidad:600.0, precio_uni_prom:26500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"20 L", ventas:0, cantidad:160.0, precio_uni_prom:0.0, costo_unidad:2833.4, costo_total:453344, margen_total:-453344, margen_pct:null, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"GREEN GUARDIAN MAX", formato:"20 L", ventas:900000, cantidad:200.0, precio_uni_prom:4500.0, costo_unidad:2157.3, costo_total:431460, margen_total:468540, margen_pct:0.5206, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MACRO FRUIT", formato:"20 L", ventas:8400000, cantidad:3080.0, precio_uni_prom:2727.27, costo_unidad:2097.55, costo_total:6460454, margen_total:1939546, margen_pct:0.2309, piso:5500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"PRODUCTOS VARIOS", formato:"?", ventas:3243095, cantidad:0.0, precio_uni_prom:null, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"20 GR", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"5 L", ventas:20000, cantidad:10.0, precio_uni_prom:2000.0, costo_unidad:2221.6, costo_total:22216, margen_total:-2216, margen_pct:-0.1108, piso:5800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"FOLIBAC FLY", formato:"250 GR", ventas:1325000, cantidad:50.0, precio_uni_prom:26500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"HERBIFEN AMINA 2,4D 20L", formato:"?", ventas:0, cantidad:60.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"POWER MAXX GLIFOSATO MONOAMONICO 75%", formato:"?", ventas:0, cantidad:1140.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"200 L", ventas:0, cantidad:200.0, precio_uni_prom:0.0, costo_unidad:2385.43, costo_total:477086, margen_total:-477086, margen_pct:null, piso:14000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"200 L", ventas:0, cantidad:180.0, precio_uni_prom:0.0, costo_unidad:975.12, costo_total:175522, margen_total:-175522, margen_pct:null, piso:2500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"200 L", ventas:0, cantidad:600.0, precio_uni_prom:0.0, costo_unidad:1831.4, costo_total:1098840, margen_total:-1098840, margen_pct:null, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"200 ML", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"200 L", ventas:720000, cantidad:200.0, precio_uni_prom:3600.0, costo_unidad:995.62, costo_total:199124, margen_total:520876, margen_pct:0.7234, piso:2500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"1000 L", ventas:3250000, cantidad:1000.0, precio_uni_prom:3250.0, costo_unidad:932.49, costo_total:932490, margen_total:2317510, margen_pct:0.7131, piso:2000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV SILFORTE", formato:"200 L (tier)", ventas:45590.0, cantidad:3778.0, precio_uni_prom:12.0672, costo_unidad:2.15, costo_total:8122.7, margen_total:37467.3, margen_pct:0.8218, piso:12.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ALGAP 30", formato:"20 L (tier)", ventas:960.0, cantidad:100.0, precio_uni_prom:9.6, costo_unidad:2.0, costo_total:200.0, margen_total:760.0, margen_pct:0.7917, piso:10.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS MICRO MIX", formato:"1000 L (tier)", ventas:3149.0, cantidad:470.0, precio_uni_prom:6.7, costo_unidad:2.2, costo_total:1034.0, margen_total:2115.0, margen_pct:0.6716, piso:4.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"REGALIA MAX", formato:"?", ventas:51734.0, cantidad:1554.0, precio_uni_prom:33.2909, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV MAX FULVIC 45%", formato:"1000 L (tier)", ventas:1400.0, cantidad:500.0, precio_uni_prom:2.8, costo_unidad:1.16, costo_total:580.0, margen_total:820.0, margen_pct:0.5857, piso:2.2, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS ZINC MANGANESO", formato:"20 L (tier)", ventas:480.0, cantidad:80.0, precio_uni_prom:6.0, costo_unidad:1.85, costo_total:148.0, margen_total:332.0, margen_pct:0.6917, piso:5.8, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV SILFORTE", formato:"1000 L (tier)", ventas:94884.0, cantidad:8800.0, precio_uni_prom:10.7823, costo_unidad:1.99, costo_total:17512.0, margen_total:77372.0, margen_pct:0.8154, piso:10.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV AMIN", formato:"200 L (tier)", ventas:1265.0, cantidad:170.0, precio_uni_prom:7.4412, costo_unidad:1.275, costo_total:216.75, margen_total:1048.25, margen_pct:0.8287, piso:3.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"200 L (tier)", ventas:24077.5, cantidad:1735.0, precio_uni_prom:13.8775, costo_unidad:1.25, costo_total:2168.75, margen_total:21908.75, margen_pct:0.9099, piso:12.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"200 L (tier)", ventas:7020.0, cantidad:1500.0, precio_uni_prom:4.68, costo_unidad:1.18, costo_total:1770.0, margen_total:5250.0, margen_pct:0.7479, piso:5.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"REGALIA", formato:"?", ventas:9712.0, cantidad:244.0, precio_uni_prom:39.8033, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV CYTO PRIME", formato:"200 L (tier)", ventas:4693.0, cantidad:247.0, precio_uni_prom:19.0, costo_unidad:2.4, costo_total:592.8, margen_total:4100.2, margen_pct:0.8737, piso:17.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV CYTO PRIME", formato:"20 L (tier)", ventas:741.0, cantidad:39.0, precio_uni_prom:19.0, costo_unidad:2.2, costo_total:85.8, margen_total:655.2, margen_pct:0.8842, piso:19.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS NUTRI MIX", formato:"1 L (tier)", ventas:17.0, cantidad:2.0, precio_uni_prom:8.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10.0, clasif:"🟢 SOBRE PISO", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"20 L (tier)", ventas:838.4, cantidad:128.0, precio_uni_prom:6.55, costo_unidad:1.5, costo_total:192.0, margen_total:646.4, margen_pct:0.771, piso:5.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"1000 L (tier)", ventas:5557.4, cantidad:751.0, precio_uni_prom:7.4, costo_unidad:1.12, costo_total:841.12, margen_total:4716.28, margen_pct:0.8486, piso:4.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS CALCIO", formato:"200 L (tier)", ventas:1126.4, cantidad:256.0, precio_uni_prom:4.4, costo_unidad:1.05, costo_total:268.8, margen_total:857.6, margen_pct:0.7614, piso:3.8, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ALGAP 30", formato:"200 L (tier)", ventas:6632.0, cantidad:628.0, precio_uni_prom:10.5605, costo_unidad:1.7, costo_total:1067.6, margen_total:5564.4, margen_pct:0.839, piso:8.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"REGALIA MAXX", formato:"?", ventas:73731.64, cantidad:2135.0, precio_uni_prom:34.5347, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE", formato:"20 L (tier)", ventas:1936.0, cantidad:186.0, precio_uni_prom:10.4086, costo_unidad:2.4, costo_total:446.4, margen_total:1489.6, margen_pct:0.7694, piso:13.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV HUMIC ROOT", formato:"200 L (tier)", ventas:280.0, cantidad:80.0, precio_uni_prom:3.5, costo_unidad:1.25, costo_total:100.0, margen_total:180.0, margen_pct:0.6429, piso:3.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS ZINC", formato:"200 L (tier)", ventas:3150.0, cantidad:420.0, precio_uni_prom:7.5, costo_unidad:1.85, costo_total:777.0, margen_total:2373.0, margen_pct:0.7533, piso:6.8, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV MOVE", formato:"1000 L (tier)", ventas:5477.5, cantidad:626.0, precio_uni_prom:8.75, costo_unidad:2.5, costo_total:1565.0, margen_total:3912.5, margen_pct:0.7143, piso:6.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV MOVE", formato:"20 L (tier)", ventas:280.0, cantidad:32.0, precio_uni_prom:8.75, costo_unidad:2.85, costo_total:91.2, margen_total:188.8, margen_pct:0.6743, piso:8.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS BORO", formato:"20 L (tier)", ventas:1150.0, cantidad:230.0, precio_uni_prom:5.0, costo_unidad:1.35, costo_total:310.5, margen_total:839.5, margen_pct:0.73, piso:4.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"1000 L (tier)", ventas:13476.0, cantidad:1048.0, precio_uni_prom:12.8588, costo_unidad:1.17, costo_total:1226.16, margen_total:12249.84, margen_pct:0.909, piso:11.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV AMIN SUGAR", formato:"20 L (tier)", ventas:200.0, cantidad:20.0, precio_uni_prom:10.0, costo_unidad:1.8, costo_total:36.0, margen_total:164.0, margen_pct:0.82, piso:7.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV BIOSOLARIS", formato:"200 L (tier)", ventas:16960.0, cantidad:1240.0, precio_uni_prom:13.6774, costo_unidad:2.05, costo_total:2542.0, margen_total:14418.0, margen_pct:0.8501, piso:16.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"20 L (tier)", ventas:480.0, cantidad:40.0, precio_uni_prom:12.0, costo_unidad:1.8, costo_total:72.0, margen_total:408.0, margen_pct:0.85, piso:13.8, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS HIERRO", formato:"200 L (tier)", ventas:600.0, cantidad:80.0, precio_uni_prom:7.5, costo_unidad:1.05, costo_total:84.0, margen_total:516.0, margen_pct:0.86, piso:4.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV AMIN", formato:"20 L (tier)", ventas:320.0, cantidad:40.0, precio_uni_prom:8.0, costo_unidad:1.85, costo_total:74.0, margen_total:246.0, margen_pct:0.7688, piso:4.2, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV BIOSOLARIS", formato:"1 L (tier)", ventas:26.0, cantidad:2.0, precio_uni_prom:13.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:20.0, clasif:"🟢 SOBRE PISO", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV BIOSOLARIS", formato:"20 L (tier)", ventas:234.0, cantidad:18.0, precio_uni_prom:13.0, costo_unidad:2.4, costo_total:43.2, margen_total:190.8, margen_pct:0.8154, piso:17.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS MICRO MIX", formato:"200 L (tier)", ventas:850.0, cantidad:100.0, precio_uni_prom:8.5, costo_unidad:2.275, costo_total:227.5, margen_total:622.5, margen_pct:0.7324, piso:5.0, clasif:"🟢 SOBRE PISO", estado:"OK" }
  ];

  var rentabilidad = {
    alertas_nivel1: [{ pais:"CL", sku:"AV ALGAP 30 200 L", margen:-0.1433, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS ZINC MANGANESO 20 L", margen:-0.0672, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV ROOT MAX 1 L", margen:-0.3665, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV SILFORTE 200 L", margen:-0.0763, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV MAX FULVIC 45% 20 L", margen:-0.02, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV BIOSOLARIS 1 L", margen:-0.5004, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS HIERRO 5 L", margen:-1.015, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV AMIN SUGAR 1 L", margen:-1.9985, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV ALGAP 30 5 L", margen:-0.0995, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS MICRO MIX 1 L", margen:-0.2307, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV HUMIC ROOT 5 L", margen:-0.1108, accion:"REVISAR_O_DESCONTINUAR" }],
    alertas_nivel2: [{ pais:"CL", sku:"AV PLUS BORO 5 L", margen:0.0026 }, { pais:"CL", sku:"AV PLUS NUTRI MIX 1 L", margen:0.0127 }, { pais:"CL", sku:"AV PLUS MICRO MIX 20 L", margen:0.0313 }, { pais:"CL", sku:"AV PLUS ZINC 5 L", margen:0.0352 }, { pais:"CL", sku:"AV PLUS POTASIO 5 L", margen:0.0518 }, { pais:"CL", sku:"AV PLUS ZINC MANGANESO 1 L", margen:0.0592 }, { pais:"CL", sku:"AV CYTO PRIME 1 L", margen:0.0943 }],
    impacto_clp:    -880257,
    skus_bajo_piso_chile: 83,
    skus_bajo_piso_peru:   6,
    skus_sin_costo_chile: 35,
    skus_sin_costo_peru:   5
  };

  return {
    meta:         meta,
    grupo:        grupo,
    chile:  { ventas: chile_ventas, cxc: chile_cxc },
    peru:   { ventas: peru_ventas,  cxc: peru_cxc  },
    productos: productos,
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
