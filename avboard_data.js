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
 *   Chile ventas → 29/07/2026
 *   Chile CxC    → 21/07/2026 (2 entidades)
 *   Perú ventas  → 31/07/2026
 *   Perú CxC     → 10/05/2026
 *
 * Actualizado: 2026-07-31
 */

var AVBOARD = (function() {

  var meta = {
    version:      '2026-07-31',
    tc_clp_usd:   950,
    meta_mn:      0.25,
    cortes: {
      chile_ventas: '29/07/2026',
      chile_cxc:    '21/07/2026',
      peru_ventas:  '31/07/2026',
      peru_cxc:     '10/05/2026'
    },
    meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  };

  var grupo = {
    ytd_usd:      834987,
    ytd_clp:      793238097,
    chile_ytd_usd: 412971,
    peru_ytd_usd:  422016,
    rtc_activos:  12,
    mn_chile:     0.179,
    mn_peru:      null,
    // IEC Grupo ponderado (Fase 7): Σvne/Σvpt across countries con datos de piso.
    // Peru excluido hasta tener precio_piso por transacción. Nota: valor < 1.0 = bajo piso.
    iec_grupo: 0.5165,
    iec_grupo_nota: 'Chile solamente — Perú sin precio piso por transacción',
    iec_grupo_vne: 310072290,
    iec_grupo_vpt: 600279600
  };

  var chile_ventas = {
    ytd_5m:          392322897,
    ytd_4m:          269373745,
    mayo_parcial:    22306815,
    ppto_anual:      728110400.0,
    ppto_4m:         228338100,
    ppto_5m:         405611000,
    cumplimiento_4m: 1.1797,
    cumplimiento_5m: 0.9672,
    cumplimiento_t1: 0.9979,
    mensual_real:  [88231364, 35651978, 52370709, 93119694, 60181659, 40460678, 22306815, 0, 0, 0, 0, 0],
    mensual_ppto:  [82144800.0, 46296700.0, 48185000.0, 51711600.0, 62175700.0, 59298800.0, 55798400.0, 46000700.0, 84000000.0, 82999900.0, 61497800.0, 48001000.0],
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
      caroca: [14820273, 6389076, 31913309, 10171393, 9822200, 23454020, 7132215, 0, 0, 0, 0, 0],
      encina: [13510783, 7262717, 6819022, 5495612, 8815784, 486243, 0, 0, 0, 0, 0, 0],
      laratro: [37027580, 10378585, 5487150, 62830189, 18073675, 5077000, 6480000, 0, 0, 0, 0, 0],
      munoz: [2195728, 765600, 1274728, 0, 0, 50415, 0, 0, 0, 0, 0, 0],
      velasquez: [14491000, 9912000, 5196500, 14622500, 23260000, 10923000, 8401000, 0, 0, 0, 0, 0],
      veverka: [6186000, 944000, 1680000, 0, 0, 0, 293600, 0, 0, 0, 0, 0]
    },
    rtc_mensual_ppto: {
      caroca: [12500000, 6000000, 14500000, 8831000, 12500000, 8730000, 6000000, 25500000, 10800000, 8700000, 5000000, 12500000],
      encina: [14200000, 7500000, 7500000, 5000000, 5000000, 5000000, 5000000, 12000000, 21000000, 28000000, 31000000, 28700000],
      laratro: [36000000, 10600000, 7500000, 16600000, 22500000, 10000000, 7800000, 21000000, 25000000, 20000000, 37500000, 19500000],
      velasquez: [14858000, 11502000, 6500000, 10000000, 5000000, 20000000, 38000000, 12000000, 48000000, 50000000, 18000000, 20000000],
      veverka: [6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000]
    },
    iec: {
      total: 0.516,
      velasquez: 0.461,
      laratro: 0.532,
      caroca: 0.596,
      encina: 0.510,
      veverka: 0.674,
      munoz: 0.741,
      impacto_potencial_clp: 194502426,
      vne_total: 310072290,
      vpt_total: 600279600,
      iec_mensual: {
        total:     [0.6866, 0.4756, 0.6439, 0.4938, 0.4111, 0.4802, 0.4274, null, null, null, null, null],
        velasquez: [0.6608, 0.6987, 0.5221, 0.5401, 0.3062, 0.4977, 0.4867, null, null, null, null, null],
        laratro:   [0.8439, 0.3472, 0.6609, 0.4929, 0.5724, 0.2959, 0.4447, null, null, null, null, null],
        caroca:    [0.4307, 0.3917, 0.7688, 1.1091, 0.2359, 0.9827, 0.5771, null, null, null, null, null],
        encina:    [0.5259, 0.4940, 0.6288, 0.2521, 0.8752, 0.3215, 0.0000, null, null, null, null, null],
        veverka:   [1.1304, 0.6556, 0.6512, null, 0.0000, null, 1.2587, null, null, null, null, null],
        munoz:     [0.5935, 1.1259, 0.8277, null, null, null, null, null, null, null, null, null]
      }
    },
    mn_real:  0.179,
    mn_meta:  0.250
  };

  var chile_cxc = {
    corte:    '21/07/2026',
    entidades: 2,
    total:    55651095,
    vencida:  37896961,
    al_dia:   17754134,
    por_entidad: {
      agrocomercial: {
        nombre: 'Agrocomercial',
        total:  21994289,
        tramos: {
          t90:   2575345,
          t6190: 1588650,
          t3160: 76160,
          t030:  17754134
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
      t90:   26222409,
      t6190: 10835664,
      t3160: 838888,
      t030:  17754134
    },
    tramos_pct: {
      t90:   0.4712,
      t6190: 0.1947,
      t3160: 0.0151,
      t030:  0.319
    },
    por_rtc: {
      otros: {
        total:   20585090,
        pct:     0.3699,
        vencida: 20585090,
        t90:     20341664,
        riesgo: 'CRÍTICO'
      },
      laratro: {
        total:   13098159,
        pct:     0.2354,
        vencida: 13098159,
        t90:     2436109,
        riesgo: 'CRÍTICO'
      },
      franco_riffo: {
        total:   9247014,
        pct:     0.1662,
        vencida: 9247014,
        t90:     0,
        riesgo: 'RIESGO'
      },
      velasquez: {
        total:   6105890,
        pct:     0.1097,
        vencida: 6105890,
        t90:     0,
        riesgo: 'RIESGO'
      },
      caroca: {
        total:   2816796,
        pct:     0.0506,
        vencida: 2816796,
        t90:     700134,
        riesgo: 'CRÍTICO'
      },
      veverka: {
        total:   1616020,
        pct:     0.029,
        vencida: 1616020,
        t90:     1266636,
        riesgo: 'CRÍTICO'
      },
      munoz: {
        total:   1367071,
        pct:     0.0246,
        vencida: 1367071,
        t90:     1307077,
        riesgo: 'CRÍTICO'
      },
      encina: {
        total:   815055,
        pct:     0.0146,
        vencida: 815055,
        t90:     170789,
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
        cliente: "AGRICOLA, GANADERA Y FORESTAL SAN RAMON LIMITADA",
        rtc: "MAURICIO ROJAS",
        dias: 480,
        monto: 1405390,
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
        dias: 157,
        monto: 700134,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "AGROINSUMOS KULLIN",
        rtc: "PABLO LARATRO",
        dias: 181,
        monto: 499300,
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
        dias: 132,
        monto: 170789,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "JUAN FRANCISCO VARGAS MANCILLA",
        rtc: "OFICINA",
        dias: 123,
        monto: 170259,
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
        cliente: "SEGUNDO ALADINO MANSILLA ROJAS",
        rtc: "MAURICIO ROJAS",
        dias: 373,
        monto: 147560,
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
    ytd_5m:       422016,
    ytd_4m:       259813,
    mayo_parcial: 31959,
    ppto_anual:   1210600.0,
    ppto_4m:      287777.3,
    ppto_5m:      350134.3,
    cumplimiento_4m: 0.9028,
    cumplimiento_5m: 0.7999,
    mensual_real: [70232, 38180, 87967, 63434, 84159, 46084, 31959, 0, 0, 0, 0, 0],
    mensual_ppto: [51668.700000000004, 60148.09999999999, 101803.8, 74156.7, 62357.0, 99465.7, 78000.0, 159000.0, 143000.0, 173000.0, 118000.0, 90000.0],
    por_vendedor: {
      aguirre: {
        nombre: "Lizbeth Aguirre",
        ytd:    123486,
        mayo:   6638
      },
      atalaya: {
        nombre: "Omar Atalaya",
        ytd:    85589,
        mayo:   0
      },
      diaz: {
        nombre: "Susan Diaz",
        ytd:    17460,
        mayo:   240
      },
      gonzales: {
        nombre: "Antonio Gonzales",
        ytd:    15562,
        mayo:   8146
      },
      infante: {
        nombre: "Oscar Infante",
        ytd:    159184,
        mayo:   5840
      },
      valladares: {
        nombre: "Patricia Valladares",
        ytd:    20735,
        mayo:   11095
      }
    },
    rtc_ppto_anual: {
      infante: 193568,
      aguirre: 424540,
      atalaya: 240366,
      gonzales: 29000,
      valladares: 90826,
      diaz: 167300,
      martha: 65000
    },
    rtc_mensual_ppto: {
      aguirre: [12025, 10573, 16149, 13129, 7644, 15021, 20000, 105000, 65000, 90000, 50000, 20000],
      atalaya: [22123, 17722, 10139, 17028, 21307, 34049, 25000, 19000, 23000, 23000, 18000, 10000],
      diaz: [0, 0, 0, 0, 0, 22300, 15000, 15000, 30000, 30000, 20000, 35000],
      gonzales: [1261, 1469, 2498, 1820, 1521, 2431, 8000, 0, 5000, 0, 5000, 0],
      infante: [16260, 30164, 67708, 37358, 26733, 15346, 0, 0, 0, 0, 0, 0],
      martha: [0, 0, 0, 0, 0, 0, 0, 10000, 10000, 15000, 15000, 15000],
      valladares: [0, 221, 5310, 4823, 5153, 10319, 10000, 10000, 10000, 15000, 10000, 10000]
    },
    rtc_mensual_real: {
      aguirre: [0, 13884, 28681, 13447, 49431, 11404, 6638, 0, 0, 0, 0, 0],
      atalaya: [29881, 8108, 20000, 6600, 8400, 12600, 0, 0, 0, 0, 0, 0],
      diaz: [0, 0, 0, 6300, 2600, 8320, 240, 0, 0, 0, 0, 0],
      gonzales: [600, 0, 96, 0, 0, 6720, 8146, 0, 0, 0, 0, 0],
      infante: [39751, 16188, 38190, 36887, 22328, 0, 5840, 0, 0, 0, 0, 0],
      valladares: [0, 0, 1000, 200, 1400, 7040, 11095, 0, 0, 0, 0, 0]
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
    { pais:"CL", producto:"AV MOVE", formato:"20 L", ventas:40713409, cantidad:8840.0, precio_uni_prom:4605.59, costo_unidad:2797.75, costo_total:24732110, margen_total:15981299, margen_pct:0.3925, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"20 L", ventas:13285302, cantidad:2875.0, precio_uni_prom:4620.97, costo_unidad:1320.6, costo_total:3796725, margen_total:9488577, margen_pct:0.7142, piso:8500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV SILFORTE", formato:"20 L", ventas:17416572, cantidad:2870.0, precio_uni_prom:6068.49, costo_unidad:2319.7, costo_total:6657539, margen_total:10759033, margen_pct:0.6177, piso:10000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"20 L", ventas:5533520, cantidad:3160.0, precio_uni_prom:1751.11, costo_unidad:1503.6, costo_total:4751376, margen_total:782144, margen_pct:0.1413, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"?", ventas:209000, cantidad:22.0, precio_uni_prom:9500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"20 L", ventas:14134052, cantidad:7080.0, precio_uni_prom:1996.34, costo_unidad:1871.75, costo_total:13251990, margen_total:882062, margen_pct:0.0624, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"20 L", ventas:7498969, cantidad:4760.0, precio_uni_prom:1575.41, costo_unidad:1444.7, costo_total:6876772, margen_total:622197, margen_pct:0.083, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"20 L", ventas:4846470, cantidad:1900.0, precio_uni_prom:2550.77, costo_unidad:2532.8, costo_total:4812320, margen_total:34150, margen_pct:0.007, piso:5500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"20 L", ventas:7508855, cantidad:2980.0, precio_uni_prom:2519.75, costo_unidad:1882.2, costo_total:5608956, margen_total:1899899, margen_pct:0.253, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"250 GR", ventas:7924000, cantidad:514.0, precio_uni_prom:15416.34, costo_unidad:8500.0, costo_total:4369000, margen_total:3555000, margen_pct:0.4486, piso:33500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"20 L", ventas:4982457, cantidad:3440.0, precio_uni_prom:1448.39, costo_unidad:1503.6, costo_total:5172384, margen_total:-189927, margen_pct:-0.0381, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"PK-DEFEND MAX", formato:"20 L", ventas:560000, cantidad:140.0, precio_uni_prom:4000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PK-DEFEND MAX", formato:"5 L", ventas:67150, cantidad:15.0, precio_uni_prom:4476.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"20 L", ventas:772000, cantidad:280.0, precio_uni_prom:2757.14, costo_unidad:2309.75, costo_total:646730, margen_total:125270, margen_pct:0.1623, piso:14000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"5 L", ventas:194000, cantidad:20.0, precio_uni_prom:9700.0, costo_unidad:3026.8, costo_total:60536, margen_total:133464, margen_pct:0.688, piso:15000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"1 L", ventas:171200, cantidad:62.0, precio_uni_prom:2761.29, costo_unidad:4143.0, costo_total:256866, margen_total:-85666, margen_pct:-0.5004, piso:16000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"20 L", ventas:10178599, cantidad:5040.0, precio_uni_prom:2019.56, costo_unidad:1756.45, costo_total:8852508, margen_total:1326091, margen_pct:0.1303, piso:6500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"1 L", ventas:16757, cantidad:14.0, precio_uni_prom:1196.93, costo_unidad:3589.0, costo_total:50246, margen_total:-33489, margen_pct:-1.9985, piso:9000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN", formato:"5 L", ventas:463716, cantidad:105.0, precio_uni_prom:4416.34, costo_unidad:2553.0, costo_total:268065, margen_total:195651, margen_pct:0.4219, piso:7000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANALISIS FOLIAR CEREZO", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV AMIN", formato:"20 L", ventas:2054120, cantidad:980.0, precio_uni_prom:2096.04, costo_unidad:1835.9, costo_total:1799182, margen_total:254938, margen_pct:0.1241, piso:5500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"20 L", ventas:2676760, cantidad:1780.0, precio_uni_prom:1503.8, costo_unidad:1277.15, costo_total:2273327, margen_total:403433, margen_pct:0.1507, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"500 GR", ventas:5764473, cantidad:414.0, precio_uni_prom:13923.85, costo_unidad:10500.0, costo_total:4347000, margen_total:1417473, margen_pct:0.2459, piso:36500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ODIN TEBUCONAZOLE 43% LT", formato:"?", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"5 L", ventas:805139, cantidad:125.0, precio_uni_prom:6441.11, costo_unidad:3358.2, costo_total:419775, margen_total:385364, margen_pct:0.4786, piso:9000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV NEMA OFF", formato:"500 GR", ventas:1281420, cantidad:43.0, precio_uni_prom:29800.47, costo_unidad:10500.0, costo_total:451500, margen_total:829920, margen_pct:0.6477, piso:35000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"5 L", ventas:475678, cantidad:160.0, precio_uni_prom:2972.99, costo_unidad:2161.8, costo_total:345888, margen_total:129790, margen_pct:0.2729, piso:4000, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"5 L", ventas:1563995, cantidad:570.0, precio_uni_prom:2743.85, costo_unidad:2588.8, costo_total:1475616, margen_total:88379, margen_pct:0.0565, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"5 L", ventas:4238785, cantidad:376.0, precio_uni_prom:11273.36, costo_unidad:3514.8, costo_total:1321565, margen_total:2917220, margen_pct:0.6882, piso:14000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"1 L", ventas:127150, cantidad:12.0, precio_uni_prom:10595.83, costo_unidad:4500.0, costo_total:54000, margen_total:73150, margen_pct:0.5753, piso:18000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"5 L", ventas:893332, cantidad:295.0, precio_uni_prom:3028.24, costo_unidad:1994.2, costo_total:588289, margen_total:305043, margen_pct:0.3415, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"5 L", ventas:237450, cantidad:120.0, precio_uni_prom:1978.75, costo_unidad:1973.6, costo_total:236832, margen_total:618, margen_pct:0.0026, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"5 L", ventas:312815, cantidad:115.0, precio_uni_prom:2720.13, costo_unidad:2830.0, costo_total:325450, margen_total:-12635, margen_pct:-0.0404, piso:5000, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"20 L", ventas:591315, cantidad:260.0, precio_uni_prom:2274.29, costo_unidad:1360.55, costo_total:353743, margen_total:237572, margen_pct:0.4018, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"20 L", ventas:2168360, cantidad:980.0, precio_uni_prom:2212.61, costo_unidad:1256.7, costo_total:1231566, margen_total:936794, margen_pct:0.432, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN", formato:"1 L", ventas:597474, cantidad:127.0, precio_uni_prom:4704.52, costo_unidad:3669.0, costo_total:465963, margen_total:131511, margen_pct:0.2201, piso:7800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"1 L", ventas:167395, cantidad:37.0, precio_uni_prom:4524.19, costo_unidad:3946.0, costo_total:146002, margen_total:21393, margen_pct:0.1278, piso:6000, clasif:"🔴 BAJO PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"1 L", ventas:373675, cantidad:99.0, precio_uni_prom:3774.49, costo_unidad:3278.0, costo_total:324522, margen_total:49153, margen_pct:0.1315, piso:6000, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"1 L", ventas:528780, cantidad:129.0, precio_uni_prom:4099.07, costo_unidad:4047.0, costo_total:522063, margen_total:6717, margen_pct:0.0127, piso:8000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"20 L", ventas:1714000, cantidad:840.0, precio_uni_prom:2040.48, costo_unidad:2214.35, costo_total:1860054, margen_total:-146054, margen_pct:-0.0852, piso:6800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"5 L", ventas:306787, cantidad:115.0, precio_uni_prom:2667.71, costo_unidad:2599.2, costo_total:298908, margen_total:7879, margen_pct:0.0257, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV N-P MIX", formato:"20 L", ventas:0, cantidad:20.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"5 L", ventas:1130167, cantidad:95.0, precio_uni_prom:11896.49, costo_unidad:3384.0, costo_total:321480, margen_total:808687, margen_pct:0.7155, piso:17000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BLOOM", formato:"5 L", ventas:1577252, cantidad:275.0, precio_uni_prom:5735.46, costo_unidad:2980.2, costo_total:819555, margen_total:757697, margen_pct:0.4804, piso:9500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"20 L", ventas:2101565, cantidad:1360.0, precio_uni_prom:1545.27, costo_unidad:1838.4, costo_total:2500224, margen_total:-398659, margen_pct:-0.1897, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"200 L", ventas:900000, cantidad:400.0, precio_uni_prom:2250.0, costo_unidad:1192.45, costo_total:476980, margen_total:423020, margen_pct:0.47, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO LOS LIRIOS", formato:"?", ventas:0, cantidad:9.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO LA MONTAÑA", formato:"?", ventas:0, cantidad:4.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO SANTA LUISA", formato:"?", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"5 L", ventas:280760, cantidad:70.0, precio_uni_prom:4010.86, costo_unidad:2931.4, costo_total:205198, margen_total:75562, margen_pct:0.2691, piso:7200, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"1 L", ventas:871758, cantidad:126.0, precio_uni_prom:6918.71, costo_unidad:4631.0, costo_total:583506, margen_total:288252, margen_pct:0.3307, piso:15000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"1 L", ventas:384152, cantidad:76.0, precio_uni_prom:5054.63, costo_unidad:3110.0, costo_total:236360, margen_total:147792, margen_pct:0.3847, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"1 L", ventas:1452420, cantidad:337.0, precio_uni_prom:4309.85, costo_unidad:3705.0, costo_total:1248585, margen_total:203835, margen_pct:0.1403, piso:6000, clasif:"🔴 BAJO PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"1 L", ventas:522974, cantidad:118.0, precio_uni_prom:4431.98, costo_unidad:3194.0, costo_total:376892, margen_total:146082, margen_pct:0.2793, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"1 L", ventas:12035, cantidad:2.0, precio_uni_prom:6017.5, costo_unidad:3154.0, costo_total:6308, margen_total:5727, margen_pct:0.4759, piso:6000, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV BLOOM", formato:"1 L", ventas:661538, cantidad:111.0, precio_uni_prom:5959.8, costo_unidad:4096.0, costo_total:454656, margen_total:206882, margen_pct:0.3127, piso:11000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOBODEN CRYOPHILE", formato:"250 GR", ventas:2380000, cantidad:140.0, precio_uni_prom:17000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"XCARATOR", formato:"20 L", ventas:4966000, cantidad:2000.0, precio_uni_prom:2483.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"200 L", ventas:1515000, cantidad:800.0, precio_uni_prom:1893.75, costo_unidad:2038.15, costo_total:1630520, margen_total:-115520, margen_pct:-0.0763, piso:8800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV MOVE", formato:"5 L", ventas:2488950, cantidad:420.0, precio_uni_prom:5926.07, costo_unidad:3514.8, costo_total:1476216, margen_total:1012734, margen_pct:0.4069, piso:7800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"?", ventas:32707, cantidad:2.0, precio_uni_prom:16353.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"5 L", ventas:710900, cantidad:175.0, precio_uni_prom:4062.29, costo_unidad:3249.8, costo_total:568715, margen_total:142185, margen_pct:0.2, piso:6500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"20 L", ventas:15833260, cantidad:2070.0, precio_uni_prom:7648.92, costo_unidad:2797.75, costo_total:5791342, margen_total:10041918, margen_pct:0.6342, piso:13500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV MOVE", formato:"1 L", ventas:430960, cantidad:46.0, precio_uni_prom:9368.7, costo_unidad:4631.0, costo_total:213026, margen_total:217934, margen_pct:0.5057, piso:8800, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"5 L", ventas:117650, cantidad:35.0, precio_uni_prom:3361.43, costo_unidad:2221.6, costo_total:77756, margen_total:39894, margen_pct:0.3391, piso:5800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV SILFORTE", formato:"5 L", ventas:1630750, cantidad:240.0, precio_uni_prom:6794.79, costo_unidad:3036.8, costo_total:728832, margen_total:901918, margen_pct:0.5531, piso:10800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"5 L", ventas:162300, cantidad:60.0, precio_uni_prom:2705.0, costo_unidad:2555.4, costo_total:153324, margen_total:8976, margen_pct:0.0553, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"5 L", ventas:35400, cantidad:35.0, precio_uni_prom:1011.43, costo_unidad:2038.0, costo_total:71330, margen_total:-35930, margen_pct:-1.015, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"K-DEFEND MAX", formato:"20 L", ventas:0, cantidad:200.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"1 L", ventas:255690, cantidad:46.0, precio_uni_prom:5558.48, costo_unidad:3715.0, costo_total:170890, margen_total:84800, margen_pct:0.3317, piso:6800, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"5 L", ventas:285603, cantidad:75.0, precio_uni_prom:3808.04, costo_unidad:2077.6, costo_total:155820, margen_total:129783, margen_pct:0.4544, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"1 L", ventas:360156, cantidad:110.0, precio_uni_prom:3274.15, costo_unidad:4474.0, costo_total:492140, margen_total:-131984, margen_pct:-0.3665, piso:10000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"5 L", ventas:1240832, cantidad:240.0, precio_uni_prom:5170.13, costo_unidad:2473.4, costo_total:593616, margen_total:647216, margen_pct:0.5216, piso:8000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"1 L", ventas:137556, cantidad:36.0, precio_uni_prom:3821.0, costo_unidad:3090.0, costo_total:111240, margen_total:26316, margen_pct:0.1913, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV DEFENDER MAX", formato:"1 L", ventas:0, cantidad:15.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV DEFENDER MAX", formato:"5 L", ventas:0, cantidad:50.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"1 L", ventas:190715, cantidad:20.0, precio_uni_prom:9535.75, costo_unidad:4153.0, costo_total:83060, margen_total:107655, margen_pct:0.5645, piso:12000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV15 40-20", formato:"20 L", ventas:3228040, cantidad:1000.0, precio_uni_prom:3228.04, costo_unidad:1873.2, costo_total:1873200, margen_total:1354840, margen_pct:0.4197, piso:5500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOPOTASICO", formato:"500 ML", ventas:16805, cantidad:39.0, precio_uni_prom:430.9, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP", formato:"500 ML", ventas:26888, cantidad:57.0, precio_uni_prom:471.72, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"500 ML", ventas:43693, cantidad:42.0, precio_uni_prom:1040.31, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM", formato:"500 ML", ventas:16805, cantidad:66.0, precio_uni_prom:254.62, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX", formato:"500 ML", ventas:26888, cantidad:130.0, precio_uni_prom:206.83, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"500 ML", ventas:26888, cantidad:146.0, precio_uni_prom:184.16, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"200 ML", ventas:0, cantidad:27.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOPOTASICO CONC.", formato:"200 ML", ventas:0, cantidad:7.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP CONC.", formato:"200 ML", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"20 GR", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"500 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"200 ML", ventas:0, cantidad:53.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"200 ML", ventas:0, cantidad:36.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM CONC.", formato:"200 ML", ventas:0, cantidad:24.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"200 L", ventas:2842000, cantidad:1960.0, precio_uni_prom:1450.0, costo_unidad:1223.05, costo_total:2397178, margen_total:444822, margen_pct:0.1565, piso:3200, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV15 40-20", formato:"1 L", ventas:438390, cantidad:61.0, precio_uni_prom:7186.72, costo_unidad:3706.0, costo_total:226066, margen_total:212324, margen_pct:0.4843, piso:9000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV15 40-20", formato:"5 L", ventas:896253, cantidad:170.0, precio_uni_prom:5272.08, costo_unidad:2590.2, costo_total:440334, margen_total:455919, margen_pct:0.5087, piso:6500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"1000 L", ventas:21600000, cantidad:13000.0, precio_uni_prom:1661.54, costo_unidad:1159.92, costo_total:15078960, margen_total:6521040, margen_pct:0.3019, piso:2800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"200 L", ventas:7170000, cantidad:4050.0, precio_uni_prom:1770.37, costo_unidad:1223.05, costo_total:4953352, margen_total:2216648, margen_pct:0.3092, piso:3200, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"200 L", ventas:4916000, cantidad:1160.0, precio_uni_prom:4237.93, costo_unidad:1179.85, costo_total:1368626, margen_total:3547374, margen_pct:0.7216, piso:7000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"1 L", ventas:103668, cantidad:26.0, precio_uni_prom:3987.23, costo_unidad:4366.0, costo_total:113516, margen_total:-9848, margen_pct:-0.095, piso:8000, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV PRADERAS", formato:"250 GR", ventas:3210908, cantidad:226.0, precio_uni_prom:14207.56, costo_unidad:10500.0, costo_total:2373000, margen_total:837908, margen_pct:0.261, piso:31000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BODENPRO POTASIO", formato:"20 L", ventas:3780000, cantidad:2000.0, precio_uni_prom:1890.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"20 L", ventas:2912400, cantidad:1400.0, precio_uni_prom:2080.29, costo_unidad:2112.95, costo_total:2958130, margen_total:-45730, margen_pct:-0.0157, piso:4000, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"500 ML", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"K-DEFEND MAX", formato:"5 L", ventas:0, cantidad:10.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BLOOM", formato:"20 L", ventas:5597500, cantidad:1440.0, precio_uni_prom:3887.15, costo_unidad:2263.3, costo_total:3259152, margen_total:2338348, margen_pct:0.4177, piso:9000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANALISIS V-CO", formato:"0000 HOJAS", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANALISIS V-C0", formato:"0000 HOJAS", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"200 L", ventas:1400000, cantidad:1000.0, precio_uni_prom:1400.0, costo_unidad:1600.65, costo_total:1600650, margen_total:-200650, margen_pct:-0.1433, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"GREEN PLANT", formato:"500 ML", ventas:26888, cantidad:96.0, precio_uni_prom:280.08, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"200 L", ventas:900000, cantidad:200.0, precio_uni_prom:4500.0, costo_unidad:2251.27, costo_total:450254, margen_total:449746, margen_pct:0.4997, piso:4500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"1 L", ventas:3902, cantidad:1.0, precio_uni_prom:3902.0, costo_unidad:3671.0, costo_total:3671, margen_total:231, margen_pct:0.0592, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"SOLUFOS", formato:"500 GR", ventas:5000000, cantidad:400.0, precio_uni_prom:12500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CRYOPHILE", formato:"250 GR", ventas:15356000, cantidad:1536.0, precio_uni_prom:9997.4, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"20 L", ventas:80000, cantidad:40.0, precio_uni_prom:2000.0, costo_unidad:1320.95, costo_total:52838, margen_total:27162, margen_pct:0.3395, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANALISIS FOLIAR", formato:"?", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"500 ML", ventas:0, cantidad:4.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"500 ML", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PRODRUCTOS DE", formato:"1 L", ventas:96000, cantidad:9.0, precio_uni_prom:10666.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANALSIS FOLIAR", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"20 L", ventas:7988000, cantidad:990.0, precio_uni_prom:8068.69, costo_unidad:2667.0, costo_total:2640330, margen_total:5347670, margen_pct:0.6695, piso:15800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANÁLSIS FOLIAR", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS SUELO EPS", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS SUELO BÁSICO", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS AGUA DE RIEGO", formato:"?", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"BIOAV INVERNAL", formato:"250 GR", ventas:33333905, cantidad:1678.0, precio_uni_prom:19865.26, costo_unidad:8500.0, costo_total:14263000, margen_total:19070905, margen_pct:0.5721, piso:34800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"PROTECT PRADERAS", formato:"250 GR", ventas:28800000, cantidad:1600.0, precio_uni_prom:18000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"1 L", ventas:172200, cantidad:24.0, precio_uni_prom:7175.0, costo_unidad:4666.0, costo_total:111984, margen_total:60216, margen_pct:0.3497, piso:8000, clasif:"🔴 BAJO PISO", estado:"OK" },
    { pais:"CL", producto:"FOLIBAC BIO INVIERNO", formato:"250 GR", ventas:15900000, cantidad:600.0, precio_uni_prom:26500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"20 L", ventas:0, cantidad:160.0, precio_uni_prom:0.0, costo_unidad:2833.4, costo_total:453344, margen_total:-453344, margen_pct:null, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"GREEN GUARDIAN MAX", formato:"20 L", ventas:450000, cantidad:200.0, precio_uni_prom:2250.0, costo_unidad:2157.3, costo_total:431460, margen_total:18540, margen_pct:0.0412, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MACRO FRUIT", formato:"20 L", ventas:4900000, cantidad:3080.0, precio_uni_prom:1590.91, costo_unidad:2097.55, costo_total:6460454, margen_total:-1560454, margen_pct:-0.3185, piso:5500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"PRODUCTOS VARIOS", formato:"?", ventas:3243095, cantidad:0.0, precio_uni_prom:null, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"20 GR", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"5 L", ventas:20000, cantidad:10.0, precio_uni_prom:2000.0, costo_unidad:2221.6, costo_total:22216, margen_total:-2216, margen_pct:-0.1108, piso:5800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"FOLIBAC FLY", formato:"250 GR", ventas:1325000, cantidad:50.0, precio_uni_prom:26500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"HERBIFEN AMINA 2,4D 20L", formato:"?", ventas:0, cantidad:60.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"POWER MAXX GLIFOSATO MONOAMONICO 75%", formato:"?", ventas:0, cantidad:1140.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"200 L", ventas:0, cantidad:200.0, precio_uni_prom:0.0, costo_unidad:2385.43, costo_total:477086, margen_total:-477086, margen_pct:null, piso:14000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"200 L", ventas:680000, cantidad:380.0, precio_uni_prom:1789.47, costo_unidad:975.12, costo_total:370546, margen_total:309454, margen_pct:0.4551, piso:2500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"200 L", ventas:0, cantidad:800.0, precio_uni_prom:0.0, costo_unidad:1831.4, costo_total:1465120, margen_total:-1465120, margen_pct:null, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"200 ML", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"200 L", ventas:720000, cantidad:200.0, precio_uni_prom:3600.0, costo_unidad:995.62, costo_total:199124, margen_total:520876, margen_pct:0.7234, piso:2500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"1000 L", ventas:3250000, cantidad:1000.0, precio_uni_prom:3250.0, costo_unidad:932.49, costo_total:932490, margen_total:2317510, margen_pct:0.7131, piso:2000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"7", formato:"?", ventas:104800, cantidad:20.0, precio_uni_prom:5240.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV BIOPOTASICO", formato:"1 L", ventas:66000, cantidad:12.0, precio_uni_prom:5500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOPOTASICO", formato:"5 L", ventas:180000, cantidad:40.0, precio_uni_prom:4500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"1000 L", ventas:2600000, cantidad:1000.0, precio_uni_prom:2600.0, costo_unidad:1159.92, costo_total:1159920, margen_total:1440080, margen_pct:0.5539, piso:2800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"1000 L", ventas:2850000, cantidad:1000.0, precio_uni_prom:2850.0, costo_unidad:1493.72, costo_total:1493720, margen_total:1356280, margen_pct:0.4759, piso:3000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV SILFORTE", formato:"200 L (tier)", ventas:47615.0, cantidad:3928.0, precio_uni_prom:12.1219, costo_unidad:2.15, costo_total:8445.2, margen_total:39169.8, margen_pct:0.8226, piso:12.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
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
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"20 L (tier)", ventas:978.4, cantidad:168.0, precio_uni_prom:5.8238, costo_unidad:1.5, costo_total:252.0, margen_total:726.4, margen_pct:0.7424, piso:5.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"1000 L (tier)", ventas:5557.4, cantidad:751.0, precio_uni_prom:7.4, costo_unidad:1.12, costo_total:841.12, margen_total:4716.28, margen_pct:0.8486, piso:4.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS CALCIO", formato:"200 L (tier)", ventas:1126.4, cantidad:256.0, precio_uni_prom:4.4, costo_unidad:1.05, costo_total:268.8, margen_total:857.6, margen_pct:0.7614, piso:3.8, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ALGAP 30", formato:"200 L (tier)", ventas:8632.0, cantidad:828.0, precio_uni_prom:10.4251, costo_unidad:1.7, costo_total:1407.6, margen_total:7224.4, margen_pct:0.8369, piso:8.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"REGALIA MAXX", formato:"?", ventas:73731.64, cantidad:2135.0, precio_uni_prom:34.5347, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE", formato:"20 L (tier)", ventas:2176.0, cantidad:206.0, precio_uni_prom:10.5631, costo_unidad:2.4, costo_total:494.4, margen_total:1681.6, margen_pct:0.7728, piso:13.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
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
    { pais:"PE", producto:"AV PLUS MICRO MIX", formato:"200 L (tier)", ventas:850.0, cantidad:100.0, precio_uni_prom:8.5, costo_unidad:2.275, costo_total:227.5, margen_total:622.5, margen_pct:0.7324, piso:5.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS HIERRO", formato:"20 L (tier)", ventas:375.0, cantidad:50.0, precio_uni_prom:7.5, costo_unidad:1.35, costo_total:67.5, margen_total:307.5, margen_pct:0.82, piso:5.0, clasif:"🟢 SOBRE PISO", estado:"OK" }
  ];

  var rentabilidad = {
    alertas_nivel1: [{ pais:"CL", sku:"AV PLUS MACRO FRUIT 20 L", margen:-0.3185, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS ZINC MANGANESO 20 L", margen:-0.1897, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV ALGAP 30 200 L", margen:-0.1433, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV MAX FULVIC 45% 20 L", margen:-0.0381, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS NUTRI MIX 20 L", margen:-0.0852, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV ROOT MAX 1 L", margen:-0.3665, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV SILFORTE 200 L", margen:-0.0763, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV BIOSOLARIS 1 L", margen:-0.5004, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS ZINC 20 L", margen:-0.0157, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS HIERRO 5 L", margen:-1.015, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV AMIN SUGAR 1 L", margen:-1.9985, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS ZINC 5 L", margen:-0.0404, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS MICRO MIX 1 L", margen:-0.095, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV HUMIC ROOT 5 L", margen:-0.1108, accion:"REVISAR_O_DESCONTINUAR" }],
    alertas_nivel2: [{ pais:"CL", sku:"AV PLUS BORO 5 L", margen:0.0026 }, { pais:"CL", sku:"AV PLUS MICRO MIX 20 L", margen:0.007 }, { pais:"CL", sku:"AV PLUS NUTRI MIX 1 L", margen:0.0127 }, { pais:"CL", sku:"AV ALGAP 30 5 L", margen:0.0257 }, { pais:"CL", sku:"GREEN GUARDIAN MAX 20 L", margen:0.0412 }, { pais:"CL", sku:"AV PLUS ZINC MANGANESO 5 L", margen:0.0553 }, { pais:"CL", sku:"AV PLUS POTASIO 5 L", margen:0.0565 }, { pais:"CL", sku:"AV PLUS ZINC MANGANESO 1 L", margen:0.0592 }, { pais:"CL", sku:"AV PLUS POTASIO 20 L", margen:0.0624 }, { pais:"CL", sku:"AV PLUS MAGNESIO 20 L", margen:0.083 }],
    impacto_clp:    -2968762,
    skus_bajo_piso_chile: 86,
    skus_bajo_piso_peru:   6,
    skus_sin_costo_chile: 37,
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
