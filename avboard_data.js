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
 *   Chile ventas → 16/09/2026
 *   Chile CxC    → 12/08/2026 (2 entidades)
 *   Perú ventas  → 18/09/2026
 *   Perú CxC     → 01/09/2026
 *
 * Actualizado: 2026-09-21
 */

var AVBOARD = (function() {

  var meta = {
    version:      '2026-09-21',
    tc_clp_usd:   950.0,
    meta_mn:      0.25,
    cortes: {
      chile_ventas: '16/09/2026',
      chile_cxc:    '12/08/2026',
      peru_ventas:  '18/09/2026',
      peru_cxc:     '01/09/2026'
    },
    meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  };

  var grupo = {
    ytd_usd:      1134567,
    ytd_clp:      1077839048,
    chile_ytd_usd: 633535,
    peru_ytd_usd:  501032,
    rtc_activos:  12,
    mn_chile:     0.179,
    mn_peru:      null,
    // IEC Grupo ponderado (Fase 7): Σvne/Σvpt across countries con datos de piso.
    // Peru excluido hasta tener precio_piso por transacción. Nota: valor < 1.0 = bajo piso.
    iec_grupo: 1.0593,
    iec_grupo_nota: 'Chile solamente — Perú sin precio piso por transacción',
    iec_grupo_vne: 416160156,
    iec_grupo_vpt: 392874900
  };

  var chile_ventas = {
    ytd_5m:          601858648,
    ytd_4m:          269373745,
    mayo_parcial:    142760049,
    ppto_anual:      846050400.0,
    ppto_4m:         228338100,
    ppto_5m:         596163800,
    cumplimiento_4m: 1.1797,
    cumplimiento_5m: 1.0096,
    cumplimiento_t1: 0.9979,
    mensual_real:      [88231364, 35651978, 52370709, 93119694, 60181659, 40410263, 36680202, 52452730, 142760049, 0, 0, 0],
    mensual_real_2025: [61542300, 57866927, 38859549, 44207090, 131497893, 36794291, 33920027, 75002645, 101082901, 134545170, 43630394, 6994835],
    mensual_ppto:      [82144800.0, 46296700.0, 48185000.0, 51711600.0, 62175700.0, 59298800.0, 77599900.0, 60797000.0, 107954300.0, 100848100.0, 83299300.0, 65739200.0],
    rtc_real_t1:   {
      caroca: 53122658,
      encina: 27592522,
      laratro: 52893315,
      munoz: 4236056,
      velasquez: 29599500,
      veverka: 8810000
    },
    rtc_ppto_t1: {
      caroca:    32998600.0,
      laratro:   54102100.0,
      encina:    15382200.0,
      velasquez: 32862300.0,
      veverka:   17997300.0
    },
    rtc_mensual_real: {
      almeida: [0, 0, 0, 0, 210000, 330000, 0, 0, 0, 0, 0, 0],
      caroca: [14820273, 6389076, 31913309, 10171393, 9822200, 23594020, 8223602, 26156190, 44180084, 0, 0, 0],
      encina: [13510783, 7262717, 6819022, 5495612, 8815784, 486243, 0, 151120, 0, 0, 0, 0],
      laratro: [37027580, 10378585, 5487150, 62830189, 18073675, 5077000, 10867000, 15784570, 42879070, 0, 0, 0],
      munoz: [2195728, 765600, 1274728, 0, 0, 0, 0, 24000, 257079, 0, 0, 0],
      velasquez: [14491000, 9912000, 5196500, 14622500, 23260000, 10923000, 17296000, 10336850, 55443816, 0, 0, 0],
      veverka: [6186000, 944000, 1680000, 0, 0, 0, 293600, 0, 0, 0, 0, 0]
    },
    rtc_mensual_ppto: {
      caroca: [12500800.0, 5998800.0, 14499000.0, 8831500.0, 12500800.0, 8729100.0, 13468200.0, 6463000.0, 15621000.0, 9514900.0, 13468200.0, 9404700.0],
      encina: [4989800.0, 5394500.0, 4997900.0, 3137100.0, 2447800.0, 2035600.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      franco_riffo: [1769600.0, 1490500.0, 4709800.0, 3836200.0, 3065800.0, 4175800.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      laratro: [36000700.0, 10600500.0, 7500900.0, 16600300.0, 22500000.0, 9999800.0, 7800600.0, 25000700.0, 30000400.0, 27000300.0, 37499200.0, 22000400.0],
      munoz: [6025500.0, 5310600.0, 3978000.0, 3306600.0, 5661500.0, 8360100.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      velasquez: [14859300.0, 11502700.0, 6500300.0, 10000800.0, 10000700.0, 19999300.0, 41998700.0, 15000900.0, 48000500.0, 50000500.0, 17999500.0, 20001500.0],
      veverka: [5999100.0, 5999100.0, 5999100.0, 5999100.0, 5999100.0, 5999100.0, 14332400.0, 14332400.0, 14332400.0, 14332400.0, 14332400.0, 14332600.0]
    },
    iec: {
      total: 1.059,
      velasquez: 1.031,
      laratro: 1.013,
      caroca: 1.304,
      encina: 1.034,
      veverka: 1.305,
      munoz: 1.086,
      impacto_potencial_clp: 144646662,
      vne_total: 416160156,
      vpt_total: 392874900,
      iec_mensual: {
        total:     [1.0868, 1.0062, 1.1115, 0.9178, 0.8784, 1.1987, 1.1132, 1.3472, 1.1024, null, null, null],
        velasquez: [0.9482, 0.9433, 1.1398, 0.8487, 0.8697, 1.1360, 1.0581, 1.0529, 1.2261, null, null, null],
        laratro:   [1.1355, 1.0202, 1.0745, 0.9276, 0.8693, 1.3136, 1.1982, 1.5852, 0.9278, null, null, null],
        caroca:    [1.1291, 1.0259, 1.1120, 1.3000, 1.1515, 1.2322, 1.1146, 1.4065, 1.3863, null, null, null],
        encina:    [0.9874, 1.0384, 1.2057, 0.9826, 0.9946, 0.9606, null, 1.0642, null, null, null, null],
        veverka:   [1.3988, 1.1238, 1.1200, null, null, null, 1.6561, null, null, null, null, null],
        munoz:     [1.1782, 1.3671, 0.8877, null, null, null, null, 1.2000, null, null, null, null]
      }
    },
    mn_real:  0.179,
    mn_meta:  0.250
  };

  var chile_cxc = {
    corte:    '12/08/2026',
    entidades: 2,
    total:    113697828,
    vencida:  45392016,
    al_dia:   68305812,
    por_entidad: {
      agrocomercial: {
        nombre: 'Agrocomercial',
        total:  80041022,
        tramos: {
          t90:   0,
          t6190: 953190,
          t3160: 10782020,
          t030:  68305812
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
      t90:   23647064,
      t6190: 10200204,
      t3160: 11544748,
      t030:  68305812
    },
    tramos_pct: {
      t90:   0.208,
      t6190: 0.0897,
      t3160: 0.1015,
      t030:  0.6008
    },
    por_rtc: {
      velasquez: {
        total:   45753274,
        pct:     0.4024,
        vencida: 42360584,
        t90:     0,
        riesgo: 'RIESGO'
      },
      otros: {
        total:   18948492,
        pct:     0.1667,
        vencida: 18948492,
        t90:     18618455,
        riesgo: 'CRÍTICO'
      },
      caroca: {
        total:   13918704,
        pct:     0.1224,
        vencida: 6398410,
        t90:     518087,
        riesgo: 'CRÍTICO'
      },
      laratro: {
        total:   13701989,
        pct:     0.1205,
        vencida: 11414809,
        t90:     1936809,
        riesgo: 'CRÍTICO'
      },
      encina: {
        total:   9395264,
        pct:     0.0826,
        vencida: 263466,
        t90:     0,
        riesgo: 'NORMAL'
      },
      franco_riffo: {
        total:   9247014,
        pct:     0.0813,
        vencida: 9247014,
        t90:     0,
        riesgo: 'RIESGO'
      },
      munoz: {
        total:   1367071,
        pct:     0.012,
        vencida: 1367071,
        t90:     1307077,
        riesgo: 'CRÍTICO'
      },
      veverka: {
        total:   1366020,
        pct:     0.012,
        vencida: 1366020,
        t90:     1266636,
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
        monto: 518087,
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
    ytd_5m:       501032,
    ytd_4m:       259793,
    mayo_parcial: 15390,
    ppto_anual:   1210600.0,
    ppto_4m:      247291,
    ppto_5m:      789600,
    ppto_mes_label: 'Sep',
    cumplimiento_4m: 1.0506,
    cumplimiento_5m: 0.6345,
    mensual_real:      [70232, 38180, 87967, 63414, 84159, 46084, 31959, 63646, 15390, 0, 0, 0],
    mensual_real_2025: [59128.76, 36687.0, 70947.9, 42486.1, 24250.0, 27780.4, 48123.4, 52993.1, 0, 120639.3, 82518.95, 54009.38],
    mensual_ppto:      [51668.700000000004, 60148.1, 27946.4, 107527.90000000001, 78466.7, 103475.7, 98366.5, 84000.0, 178000.0, 153000.0, 158000.0, 110000.0],
    por_vendedor: {
      aguirre: {
        nombre: "Lizbeth Aguirre",
        ytd:    183082,
        mayo:   6250
      },
      atalaya: {
        nombre: "Omar Atalaya",
        ytd:    89789,
        mayo:   0
      },
      diaz: {
        nombre: "Susan Diaz",
        ytd:    26800,
        mayo:   4940
      },
      gonzales: {
        nombre: "Antonio Gonzales",
        ytd:    15562,
        mayo:   0
      },
      infante: {
        nombre: "Oscar Infante",
        ytd:    159164,
        mayo:   0
      },
      martha: {
        nombre: "Martha Hidalgo",
        ytd:    4200,
        mayo:   4200
      },
      valladares: {
        nombre: "Patricia Valladares",
        ytd:    22435,
        mayo:   0
      }
    },
    rtc_ppto_anual: {
      atalaya: 240366.0,
      diaz: 167300.0,
      valladares: 90826.0,
      aguirre: 424540.0,
      infante: 193568.0,
      gonzales: 29000.0,
      martha: 65000.0
    },
    rtc_mensual_ppto: {
      aguirre: [12025.0, 10572.5, 10000.0, 16149.3, 13128.5, 7643.7, 25021.0, 30000.0, 100000.0, 70000.0, 90000.0, 40000.0],
      atalaya: [22122.8, 17721.8, 10138.6, 17027.5, 21306.5, 34048.8, 25000.0, 19000.0, 23000.0, 23000.0, 18000.0, 10000.0],
      diaz: [0.0, 0.0, 0.0, 0.0, 0.0, 22300.0, 15000.0, 15000.0, 30000.0, 30000.0, 20000.0, 35000.0],
      gonzales: [1261.0, 1469.0, 2498.0, 1820.0, 1521.0, 2431.0, 8000.0, 0.0, 5000.0, 0.0, 5000.0, 0.0],
      infante: [16259.9, 30164.0, 0.0, 67708.1, 37357.7, 26732.8, 15345.5, 0.0, 0.0, 0.0, 0.0, 0.0],
      martha: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 10000.0, 10000.0, 15000.0, 15000.0, 15000.0],
      valladares: [0.0, 220.8, 5309.8, 4823.0, 5153.0, 10319.4, 10000.0, 10000.0, 10000.0, 15000.0, 10000.0, 10000.0]
    },
    rtc_mensual_real: {
      aguirre: [0, 13884, 28681, 13447, 49431, 11404, 6638, 53346, 6250, 0, 0, 0],
      atalaya: [29881, 8108, 20000, 6600, 8400, 12600, 0, 4200, 0, 0, 0, 0],
      diaz: [0, 0, 0, 6300, 2600, 8320, 240, 4400, 4940, 0, 0, 0],
      gonzales: [600, 0, 96, 0, 0, 6720, 8146, 0, 0, 0, 0, 0],
      infante: [39751, 16188, 38190, 36867, 22328, 0, 5840, 0, 0, 0, 0, 0],
      martha: [0, 0, 0, 0, 0, 0, 0, 0, 4200, 0, 0, 0],
      valladares: [0, 0, 1000, 200, 1400, 7040, 11095, 1700, 0, 0, 0, 0]
    },
    iec: {
      total:      1.0646,
      aguirre:    1.0644,
      infante:    1.2753,
      atalaya:    0.9818,
      valladares: 0.8568,
      gonzales:   1.0504,
      navarro:    1.1647,
      diaz:       0.8555,
      vne_total:  282526.2,
      vpt_total:  265377.8,
      impacto_potencial_usd: 4000
    },
    mn_real:  null,
    mn_meta:  0.250
  };

  var peru_cxc = {
    "corte": "01/09/2026",
    "total": 127565,
    "supra": 202820,
    "n_documentos": 56,
    "tramos": {
      "no_vencida": 46820,
      "t030": 45836,
      "t3160": 2000,
      "t6190": 1322,
      "t90": 31587
    },
    "tramos_pct": {
      "no_vencida": 0.367,
      "t030": 0.359,
      "t3160": 0.016,
      "t6190": 0.01,
      "t90": 0.248
    },
    "vencida": 80745,
    "por_vendedor": {
      "geldres": {
        "total": 10874,
        "pct": 0.0852,
        "vencida": 10874,
        "t90": 10874,
        "riesgo": "CRÍTICO"
      },
      "atalaya": {
        "total": 9493,
        "pct": 0.0744,
        "vencida": 9493,
        "t90": 9493,
        "riesgo": "CRÍTICO"
      },
      "infante": {
        "total": 4418,
        "pct": 0.0346,
        "vencida": 2871,
        "t90": 2349,
        "riesgo": "CRÍTICO"
      },
      "sin_asignar": {
        "total": 15,
        "pct": 0.0001,
        "vencida": 15,
        "t90": 15,
        "riesgo": "CRÍTICO"
      },
      "valladares": {
        "total": 11675,
        "pct": 0.0915,
        "vencida": 5175,
        "t90": 200,
        "riesgo": "CRÍTICO"
      },
      "aguirre": {
        "total": 79709,
        "pct": 0.6249,
        "vencida": 45336,
        "t90": 8395,
        "riesgo": "CRÍTICO"
      },
      "gonzales": {
        "total": 6720,
        "pct": 0.0527,
        "vencida": 6720,
        "t90": 0,
        "riesgo": "RIESGO"
      },
      "diaz": {
        "total": 4660,
        "pct": 0.0365,
        "vencida": 260,
        "t90": 260,
        "riesgo": "CRÍTICO"
      }
    },
    "cuentas_criticas": [
      {
        "vendedor": "OMAR ATALAYA",
        "cliente": "AGROFER MJ E.I.R.L.",
        "folio": "671.0",
        "emision": "13/06/2025",
        "vencimiento": "11/10/2025",
        "dias": 325,
        "tramo": "+90d",
        "monto": 9493.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JOSE GELDRES",
        "cliente": "PAODISA S.A.",
        "folio": "579.0",
        "emision": "11/08/2024",
        "vencimiento": "01/07/2025",
        "dias": 427,
        "tramo": "+90d",
        "monto": 4077.9,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1146.0",
        "emision": "08/04/2026",
        "vencimiento": "10/03/2026",
        "dias": 175,
        "tramo": "+90d",
        "monto": 3780.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JOSE GELDRES",
        "cliente": "PAODISA S.A.",
        "folio": "538.0",
        "emision": "26/09/2024",
        "vencimiento": "25/11/2024",
        "dias": 645,
        "tramo": "+90d",
        "monto": 3546.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JOSE GELDRES",
        "cliente": "PAODISA S.A.",
        "folio": "509.0",
        "emision": "09/05/2024",
        "vencimiento": "11/04/2024",
        "dias": 873,
        "tramo": "+90d",
        "monto": 1773.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JOSE GELDRES",
        "cliente": "PAODISA S.A.",
        "folio": "453.0",
        "emision": "07/01/2024",
        "vencimiento": "31/07/2024",
        "dias": 762,
        "tramo": "+90d",
        "monto": 1477.5,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1043.0",
        "emision": "05/07/2026",
        "vencimiento": "09/04/2026",
        "dias": 145,
        "tramo": "+90d",
        "monto": 1380.6,
        "estado": "Crítico"
      },
      {
        "vendedor": "OSCAR INFANTE",
        "cliente": "LUNA QUINTANILLA BRYAN ALEXANDER",
        "folio": "841.0",
        "emision": "04/11/2025",
        "vencimiento": "02/02/2026",
        "dias": 211,
        "tramo": "+90d",
        "monto": 1344.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "OSCAR INFANTE",
        "cliente": "LUNA QUINTANILLA BRYAN ALEXANDER",
        "folio": "743.0",
        "emision": "10/09/2025",
        "vencimiento": "09/12/2025",
        "dias": 266,
        "tramo": "+90d",
        "monto": 1005.05,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1078.0",
        "emision": "06/03/2026",
        "vencimiento": "10/01/2026",
        "dias": 234,
        "tramo": "+90d",
        "monto": 936.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA RIACHUELO S.A.C",
        "folio": "1142.0",
        "emision": "08/03/2026",
        "vencimiento": "10/02/2026",
        "dias": 203,
        "tramo": "+90d",
        "monto": 908.6,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1141.0",
        "emision": "08/03/2026",
        "vencimiento": "10/02/2026",
        "dias": 203,
        "tramo": "+90d",
        "monto": 810.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "SOCIEDAD EXPORTADORA VERFRUT SOCIEDAD ANONIMA CERRADA",
        "folio": "1053.0",
        "emision": "18/05/2026",
        "vencimiento": "17/06/2026",
        "dias": 76,
        "tramo": "61-90d",
        "monto": 800.0,
        "estado": "Riesgo"
      },
      {
        "vendedor": "OSCAR INFANTE",
        "cliente": "LUNA QUINTANILLA BRYAN ALEXANDER",
        "folio": "981.0",
        "emision": "18/03/2026",
        "vencimiento": "16/06/2026",
        "dias": 77,
        "tramo": "61-90d",
        "monto": 522.0,
        "estado": "Riesgo"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRO DIRECT S.A.C.",
        "folio": "1148.0",
        "emision": "08/05/2026",
        "vencimiento": "09/04/2026",
        "dias": 145,
        "tramo": "+90d",
        "monto": 440.0,
        "estado": "Crítico"
      }
    ],
    "all_documentos": [
      {
        "vendedor": "JOSE GELDRES",
        "cliente": "PAODISA S.A.",
        "folio": "509.0",
        "emision": "09/05/2024",
        "vencimiento": "11/04/2024",
        "dias": 873,
        "tramo": "+90d",
        "monto": 1773.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JOSE GELDRES",
        "cliente": "PAODISA S.A.",
        "folio": "453.0",
        "emision": "07/01/2024",
        "vencimiento": "31/07/2024",
        "dias": 762,
        "tramo": "+90d",
        "monto": 1477.5,
        "estado": "Crítico"
      },
      {
        "vendedor": "JOSE GELDRES",
        "cliente": "PAODISA S.A.",
        "folio": "538.0",
        "emision": "26/09/2024",
        "vencimiento": "25/11/2024",
        "dias": 645,
        "tramo": "+90d",
        "monto": 3546.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JOSE GELDRES",
        "cliente": "PAODISA S.A.",
        "folio": "579.0",
        "emision": "11/08/2024",
        "vencimiento": "01/07/2025",
        "dias": 427,
        "tramo": "+90d",
        "monto": 4077.9,
        "estado": "Crítico"
      },
      {
        "vendedor": "OMAR ATALAYA",
        "cliente": "AGROFER MJ E.I.R.L.",
        "folio": "671.0",
        "emision": "13/06/2025",
        "vencimiento": "11/10/2025",
        "dias": 325,
        "tramo": "+90d",
        "monto": 9493.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "OSCAR INFANTE",
        "cliente": "LUNA QUINTANILLA BRYAN ALEXANDER",
        "folio": "743.0",
        "emision": "10/09/2025",
        "vencimiento": "09/12/2025",
        "dias": 266,
        "tramo": "+90d",
        "monto": 1005.05,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1078.0",
        "emision": "06/03/2026",
        "vencimiento": "10/01/2026",
        "dias": 234,
        "tramo": "+90d",
        "monto": 936.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "OSCAR INFANTE",
        "cliente": "LUNA QUINTANILLA BRYAN ALEXANDER",
        "folio": "841.0",
        "emision": "04/11/2025",
        "vencimiento": "02/02/2026",
        "dias": 211,
        "tramo": "+90d",
        "monto": 1344.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA RIACHUELO S.A.C",
        "folio": "1142.0",
        "emision": "08/03/2026",
        "vencimiento": "10/02/2026",
        "dias": 203,
        "tramo": "+90d",
        "monto": 908.6,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1141.0",
        "emision": "08/03/2026",
        "vencimiento": "10/02/2026",
        "dias": 203,
        "tramo": "+90d",
        "monto": 810.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA SAFCO PERU S.A.",
        "folio": "1143.0",
        "emision": "08/04/2026",
        "vencimiento": "11/02/2026",
        "dias": 202,
        "tramo": "+90d",
        "monto": 140.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "GUILLERMO PRADENAS",
        "cliente": "SERVICIOS BIOINSUMOS PERU SOCIEDAD ANONIMA CERRADA.",
        "folio": "817.0",
        "emision": "23/10/2025",
        "vencimiento": "20/02/2026",
        "dias": 193,
        "tramo": "+90d",
        "monto": 15.25,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1146.0",
        "emision": "08/04/2026",
        "vencimiento": "10/03/2026",
        "dias": 175,
        "tramo": "+90d",
        "monto": 3780.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "SUSAN DIAZ",
        "cliente": "AGRICOLA CAMPO NOBLE S.A.C",
        "folio": "1080.0",
        "emision": "05/06/2026",
        "vencimiento": "10/03/2026",
        "dias": 175,
        "tramo": "+90d",
        "monto": 234.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "SUSAN DIAZ",
        "cliente": "AGRICOLA CAMPO NOBLE S.A.C",
        "folio": "1079.0",
        "emision": "05/06/2026",
        "vencimiento": "10/03/2026",
        "dias": 175,
        "tramo": "+90d",
        "monto": 26.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1043.0",
        "emision": "05/07/2026",
        "vencimiento": "09/04/2026",
        "dias": 145,
        "tramo": "+90d",
        "monto": 1380.6,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRO DIRECT S.A.C.",
        "folio": "1148.0",
        "emision": "08/05/2026",
        "vencimiento": "09/04/2026",
        "dias": 145,
        "tramo": "+90d",
        "monto": 440.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "SOCIEDAD EXPORTADORA VERFRUT SOCIEDAD ANONIMA CERRADA",
        "folio": "1109.0",
        "emision": "07/06/2026",
        "vencimiento": "10/04/2026",
        "dias": 144,
        "tramo": "+90d",
        "monto": 200.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "nan",
        "cliente": "SERVICIOS BIOINSUMOS PERU SOCIEDAD ANONIMA CERRADA.",
        "folio": "887.0",
        "emision": "16/12/2025",
        "vencimiento": "15/04/2026",
        "dias": 139,
        "tramo": "+90d",
        "monto": 3780.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "nan",
        "cliente": "SERVICIOS BIOINSUMOS PERU SOCIEDAD ANONIMA CERRADA.",
        "folio": "891.0",
        "emision": "22/12/2025",
        "vencimiento": "21/04/2026",
        "dias": 133,
        "tramo": "+90d",
        "monto": 2200.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "OSCAR INFANTE",
        "cliente": "LUNA QUINTANILLA BRYAN ALEXANDER",
        "folio": "981.0",
        "emision": "18/03/2026",
        "vencimiento": "16/06/2026",
        "dias": 77,
        "tramo": "61-90d",
        "monto": 522.0,
        "estado": "Riesgo"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "SOCIEDAD EXPORTADORA VERFRUT SOCIEDAD ANONIMA CERRADA",
        "folio": "1053.0",
        "emision": "18/05/2026",
        "vencimiento": "17/06/2026",
        "dias": 76,
        "tramo": "61-90d",
        "monto": 800.0,
        "estado": "Riesgo"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "CORPORACION AGROLATINA S.A.C",
        "folio": "1025.0",
        "emision": "28/04/2026",
        "vencimiento": "27/07/2026",
        "dias": 36,
        "tramo": "31-60d",
        "monto": 2000.0,
        "estado": "Alerta"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA PAMPA BAJA S.A.C.",
        "folio": "1150.0",
        "emision": "08/10/2026",
        "vencimiento": "12/08/2026",
        "dias": 20,
        "tramo": "0-30d",
        "monto": 26845.0,
        "estado": "Normal"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "VIVEROS EL TAMBO S.A.C.",
        "folio": "1115.0",
        "emision": "13/07/2026",
        "vencimiento": "12/08/2026",
        "dias": 20,
        "tramo": "0-30d",
        "monto": 1400.0,
        "estado": "Normal"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1151.0",
        "emision": "08/10/2026",
        "vencimiento": "12/08/2026",
        "dias": 20,
        "tramo": "0-30d",
        "monto": 936.0,
        "estado": "Normal"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "VIVEROS EL TAMBO S.A.C.",
        "folio": "1134.0",
        "emision": "21/07/2026",
        "vencimiento": "20/08/2026",
        "dias": 12,
        "tramo": "0-30d",
        "monto": 375.0,
        "estado": "Normal"
      },
      {
        "vendedor": "ANTONIO GONZALES",
        "cliente": "SUREXPORT PERU BERRIES S.A.C",
        "folio": "1103.0",
        "emision": "30/06/2026",
        "vencimiento": "29/08/2026",
        "dias": 3,
        "tramo": "0-30d",
        "monto": 3600.0,
        "estado": "Normal"
      },
      {
        "vendedor": "ANTONIO GONZALES",
        "cliente": "POB S.A.C.",
        "folio": "1102.0",
        "emision": "30/06/2026",
        "vencimiento": "29/08/2026",
        "dias": 3,
        "tramo": "0-30d",
        "monto": 3120.0,
        "estado": "Normal"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "CORPORACION ESAN E & F S.A.C",
        "folio": "1077.0",
        "emision": "01/06/2026",
        "vencimiento": "30/08/2026",
        "dias": 2,
        "tramo": "0-30d",
        "monto": 7160.24,
        "estado": "Normal"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "SOCIEDAD EXPORTADORA VERFRUT SOCIEDAD ANONIMA CERRADA",
        "folio": "1076.0",
        "emision": "01/06/2026",
        "vencimiento": "30/08/2026",
        "dias": 2,
        "tramo": "0-30d",
        "monto": 2400.0,
        "estado": "Normal"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "536.0",
        "emision": "23/09/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 35370.0,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "476.0",
        "emision": "08/02/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 27451.5,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "494.0",
        "emision": "23/08/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 23224.0,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "492.0",
        "emision": "20/08/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 19714.5,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "459.0",
        "emision": "07/05/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 14657.0,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "505.0",
        "emision": "09/03/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 14424.0,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "SOCIEDAD AGRICOLA DROKASA S.A",
        "folio": "475.0",
        "emision": "08/01/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 11760.0,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "550.0",
        "emision": "10/07/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 11700.0,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "558.0",
        "emision": "14/10/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 8834.0,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "557.0",
        "emision": "14/10/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 8400.0,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "552.0",
        "emision": "10/07/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 6048.0,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "553.0",
        "emision": "10/11/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 4335.0,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "508.0",
        "emision": "09/04/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 4200.0,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "556.0",
        "emision": "14/10/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 4074.0,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "565.0",
        "emision": "18/10/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 2044.0,
        "estado": "Al día"
      },
      {
        "vendedor": "nan",
        "cliente": "RVR AGRO S.R.L.",
        "folio": "555.0",
        "emision": "10/11/2024",
        "vencimiento": "",
        "dias": 0,
        "tramo": "Al día",
        "monto": 604.5,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1152.0",
        "emision": "08/11/2026",
        "vencimiento": "12/09/2026",
        "dias": -11,
        "tramo": "Al día",
        "monto": 10000.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1121.0",
        "emision": "14/07/2026",
        "vencimiento": "12/09/2026",
        "dias": -11,
        "tramo": "Al día",
        "monto": 1350.0,
        "estado": "Al día"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "SOCIEDAD EXPORTADORA VERFRUT SOCIEDAD ANONIMA CERRADA",
        "folio": "1089.0",
        "emision": "15/06/2026",
        "vencimiento": "13/09/2026",
        "dias": -12,
        "tramo": "Al día",
        "monto": 2800.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1132.0",
        "emision": "20/07/2026",
        "vencimiento": "18/09/2026",
        "dias": -17,
        "tramo": "Al día",
        "monto": 2025.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1058.0",
        "emision": "22/05/2026",
        "vencimiento": "19/09/2026",
        "dias": -18,
        "tramo": "Al día",
        "monto": 936.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "CORPORACION AGROLATINA S.A.C",
        "folio": "1094.0",
        "emision": "22/06/2026",
        "vencimiento": "20/09/2026",
        "dias": -19,
        "tramo": "Al día",
        "monto": 2200.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRO DIRECT S.A.C.",
        "folio": "1176.0",
        "emision": "24/08/2026",
        "vencimiento": "23/09/2026",
        "dias": -22,
        "tramo": "Al día",
        "monto": 440.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRO DIRECT S.A.C.",
        "folio": "1177.0",
        "emision": "24/08/2026",
        "vencimiento": "23/09/2026",
        "dias": -22,
        "tramo": "Al día",
        "monto": 220.0,
        "estado": "Al día"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "SOCIEDAD EXPORTADORA VERFRUT SOCIEDAD ANONIMA CERRADA",
        "folio": "1101.0",
        "emision": "30/06/2026",
        "vencimiento": "28/09/2026",
        "dias": -27,
        "tramo": "Al día",
        "monto": 1600.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1084.0",
        "emision": "06/11/2026",
        "vencimiento": "09/10/2026",
        "dias": -38,
        "tramo": "Al día",
        "monto": 850.0,
        "estado": "Al día"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "AGRICOLA LIMONES CORONADO S.R.L.",
        "folio": "1155.0",
        "emision": "12/08/2026",
        "vencimiento": "11/10/2026",
        "dias": -40,
        "tramo": "Al día",
        "monto": 1200.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1161.0",
        "emision": "14/08/2026",
        "vencimiento": "13/10/2026",
        "dias": -42,
        "tramo": "Al día",
        "monto": 1080.0,
        "estado": "Al día"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "AGRICOLA LIMONES CORONADO S.R.L.",
        "folio": "1172.0",
        "emision": "19/08/2026",
        "vencimiento": "18/10/2026",
        "dias": -47,
        "tramo": "Al día",
        "monto": 500.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1180.0",
        "emision": "25/08/2026",
        "vencimiento": "24/10/2026",
        "dias": -53,
        "tramo": "Al día",
        "monto": 1080.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1181.0",
        "emision": "25/08/2026",
        "vencimiento": "24/10/2026",
        "dias": -53,
        "tramo": "Al día",
        "monto": 270.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "CORPORACION AGROLATINA S.A.C",
        "folio": "1139.0",
        "emision": "30/07/2026",
        "vencimiento": "28/10/2026",
        "dias": -57,
        "tramo": "Al día",
        "monto": 2000.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "MANUELITA FYH S.A.C.",
        "folio": "1156.0",
        "emision": "12/08/2026",
        "vencimiento": "09/11/2026",
        "dias": -69,
        "tramo": "Al día",
        "monto": 2250.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "CORPORACION AGROLATINA S.A.C",
        "folio": "1157.0",
        "emision": "12/08/2026",
        "vencimiento": "10/11/2026",
        "dias": -70,
        "tramo": "Al día",
        "monto": 2200.0,
        "estado": "Al día"
      },
      {
        "vendedor": "OSCAR INFANTE",
        "cliente": "INVERSIONES AJS S.A.C.",
        "folio": "1117.0",
        "emision": "13/07/2026",
        "vencimiento": "10/11/2026",
        "dias": -70,
        "tramo": "Al día",
        "monto": 1227.2,
        "estado": "Al día"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "SOCIEDAD EXPORTADORA VERFRUT SOCIEDAD ANONIMA CERRADA",
        "folio": "1114.0",
        "emision": "13/07/2026",
        "vencimiento": "10/11/2026",
        "dias": -70,
        "tramo": "Al día",
        "monto": 400.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1123.0",
        "emision": "15/07/2026",
        "vencimiento": "12/11/2026",
        "dias": -72,
        "tramo": "Al día",
        "monto": 1104.48,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1122.0",
        "emision": "15/07/2026",
        "vencimiento": "12/11/2026",
        "dias": -72,
        "tramo": "Al día",
        "monto": 187.2,
        "estado": "Al día"
      },
      {
        "vendedor": "SUSAN DIAZ",
        "cliente": "BLUEWAY ALLIANCE CORP PERU S.A.C.",
        "folio": "1166.0",
        "emision": "17/08/2026",
        "vencimiento": "15/11/2026",
        "dias": -75,
        "tramo": "Al día",
        "monto": 2000.0,
        "estado": "Al día"
      },
      {
        "vendedor": "SUSAN DIAZ",
        "cliente": "PLANTACIONES DEL SOL S.A.C",
        "folio": "1178.0",
        "emision": "25/08/2026",
        "vencimiento": "23/11/2026",
        "dias": -83,
        "tramo": "Al día",
        "monto": 2400.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA SAFCO PERU S.A.",
        "folio": "1185.0",
        "emision": "27/08/2026",
        "vencimiento": "25/11/2026",
        "dias": -85,
        "tramo": "Al día",
        "monto": 420.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AMFRESH PERU AGRISIL S.R.L.",
        "folio": "1188.0",
        "emision": "31/08/2026",
        "vencimiento": "29/11/2026",
        "dias": -89,
        "tramo": "Al día",
        "monto": 5760.0,
        "estado": "Al día"
      },
      {
        "vendedor": "OSCAR INFANTE",
        "cliente": "I Q F DEL PERU SA",
        "folio": "1049.0",
        "emision": "14/05/2026",
        "vencimiento": "08/12/2026",
        "dias": -98,
        "tramo": "Al día",
        "monto": 320.0,
        "estado": "Al día"
      }
    ]
  };

  var productos = [
    { pais:"CL", producto:"AV MOVE", formato:"20 L", ventas:44703409, cantidad:9340.0, precio_uni_prom:4786.23, costo_unidad:3014.95, costo_total:28159633, margen_total:16543776, margen_pct:0.3701, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"20 L", ventas:27993302, cantidad:4335.0, precio_uni_prom:6457.51, costo_unidad:2569.2, costo_total:11137482, margen_total:16855820, margen_pct:0.6021, piso:7000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV SILFORTE", formato:"20 L", ventas:25866572, cantidad:3890.0, precio_uni_prom:6649.5, costo_unidad:2212.85, costo_total:8607986, margen_total:17258586, margen_pct:0.6672, piso:8000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"20 L", ventas:6089520, cantidad:3540.0, precio_uni_prom:1720.2, costo_unidad:1434.05, costo_total:5076537, margen_total:1012983, margen_pct:0.1663, piso:3000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"?", ventas:209000, cantidad:22.0, precio_uni_prom:9500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"20 L", ventas:23866052, cantidad:9780.0, precio_uni_prom:2440.29, costo_unidad:1197.0, costo_total:11706660, margen_total:12159392, margen_pct:0.5095, piso:2700, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"20 L", ventas:12823569, cantidad:6500.0, precio_uni_prom:1972.86, costo_unidad:1422.1, costo_total:9243650, margen_total:3579919, margen_pct:0.2792, piso:3000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"20 L", ventas:6676470, cantidad:2420.0, precio_uni_prom:2758.87, costo_unidad:1575.8, costo_total:3813436, margen_total:2863034, margen_pct:0.4288, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"20 L", ventas:24688855, cantidad:6840.0, precio_uni_prom:3609.48, costo_unidad:1770.55, costo_total:12110562, margen_total:12578293, margen_pct:0.5095, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"250 GR", ventas:8216500, cantidad:525.0, precio_uni_prom:15650.48, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"20 L", ventas:7622457, cantidad:4260.0, precio_uni_prom:1789.31, costo_unidad:1434.05, costo_total:6109053, margen_total:1513404, margen_pct:0.1985, piso:3000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"PK-DEFEND MAX", formato:"20 L", ventas:560000, cantidad:140.0, precio_uni_prom:4000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PK-DEFEND MAX", formato:"5 L", ventas:67150, cantidad:15.0, precio_uni_prom:4476.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"20 L", ventas:772000, cantidad:280.0, precio_uni_prom:2757.14, costo_unidad:2020.2, costo_total:565656, margen_total:206344, margen_pct:0.2673, piso:12000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"5 L", ventas:194000, cantidad:20.0, precio_uni_prom:9700.0, costo_unidad:2602.6, costo_total:52052, margen_total:141948, margen_pct:0.7317, piso:13000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"1 L", ventas:171200, cantidad:62.0, precio_uni_prom:2761.29, costo_unidad:4063.0, costo_total:251906, margen_total:-80706, margen_pct:-0.4714, piso:14000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"20 L", ventas:12608599, cantidad:5620.0, precio_uni_prom:2243.52, costo_unidad:1423.45, costo_total:7999789, margen_total:4608810, margen_pct:0.3655, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"1 L", ventas:16757, cantidad:14.0, precio_uni_prom:1196.93, costo_unidad:3466.0, costo_total:48524, margen_total:-31767, margen_pct:-1.8957, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN", formato:"5 L", ventas:569216, cantidad:120.0, precio_uni_prom:4743.47, costo_unidad:2193.6, costo_total:263232, margen_total:305984, margen_pct:0.5376, piso:5500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANALISIS FOLIAR CEREZO", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV AMIN", formato:"20 L", ventas:5790120, cantidad:1940.0, precio_uni_prom:2984.6, costo_unidad:1611.15, costo_total:3125631, margen_total:2664489, margen_pct:0.4602, piso:4500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"20 L", ventas:6352760, cantidad:2840.0, precio_uni_prom:2236.89, costo_unidad:1653.7, costo_total:4696508, margen_total:1656252, margen_pct:0.2607, piso:2900, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"500 GR", ventas:6694473, cantidad:532.0, precio_uni_prom:12583.6, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"ODIN TEBUCONAZOLE 43% LT", formato:"?", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"5 L", ventas:992639, cantidad:145.0, precio_uni_prom:6845.79, costo_unidad:3151.6, costo_total:456982, margen_total:535657, margen_pct:0.5396, piso:9000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV NEMA OFF", formato:"500 GR", ventas:1281420, cantidad:43.0, precio_uni_prom:29800.47, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"5 L", ventas:574928, cantidad:180.0, precio_uni_prom:3194.04, costo_unidad:1815.2, costo_total:326736, margen_total:248192, margen_pct:0.4317, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"5 L", ventas:1917045, cantidad:645.0, precio_uni_prom:2972.16, costo_unidad:2355.8, costo_total:1519491, margen_total:397554, margen_pct:0.2074, piso:4500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"5 L", ventas:5540285, cantidad:481.0, precio_uni_prom:11518.26, costo_unidad:1920.0, costo_total:923520, margen_total:4616765, margen_pct:0.8333, piso:14000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"1 L", ventas:409524, cantidad:29.0, precio_uni_prom:14121.52, costo_unidad:8500.0, costo_total:246500, margen_total:163024, margen_pct:0.3981, piso:18000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"5 L", ventas:1190023, cantidad:365.0, precio_uni_prom:3260.34, costo_unidad:2236.2, costo_total:816213, margen_total:373810, margen_pct:0.3141, piso:4000, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"5 L", ventas:465268, cantidad:175.0, precio_uni_prom:2658.67, costo_unidad:2070.6, costo_total:362355, margen_total:102913, margen_pct:0.2212, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"5 L", ventas:517683, cantidad:160.0, precio_uni_prom:3235.52, costo_unidad:2431.6, costo_total:389056, margen_total:128627, margen_pct:0.2485, piso:4500, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"20 L", ventas:819315, cantidad:320.0, precio_uni_prom:2560.36, costo_unidad:1703.15, costo_total:545008, margen_total:274307, margen_pct:0.3348, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"20 L", ventas:3694280, cantidad:1460.0, precio_uni_prom:2530.33, costo_unidad:1488.1, costo_total:2172626, margen_total:1521654, margen_pct:0.4119, piso:2900, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN", formato:"1 L", ventas:660774, cantidad:136.0, precio_uni_prom:4858.63, costo_unidad:2467.0, costo_total:335512, margen_total:325262, margen_pct:0.4922, piso:6800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"1 L", ventas:301890, cantidad:60.0, precio_uni_prom:5031.5, costo_unidad:2627.0, costo_total:157620, margen_total:144270, margen_pct:0.4779, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"1 L", ventas:458529, cantidad:112.0, precio_uni_prom:4094.01, costo_unidad:2801.0, costo_total:313712, margen_total:144817, margen_pct:0.3158, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"1 L", ventas:666120, cantidad:152.0, precio_uni_prom:4382.37, costo_unidad:3026.0, costo_total:459952, margen_total:206168, margen_pct:0.3095, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"20 L", ventas:4229400, cantidad:1600.0, precio_uni_prom:2643.38, costo_unidad:1646.5, costo_total:2634400, margen_total:1595000, margen_pct:0.3771, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"5 L", ventas:640117, cantidad:175.0, precio_uni_prom:3657.81, costo_unidad:2353.0, costo_total:411775, margen_total:228342, margen_pct:0.3567, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV N-P MIX", formato:"20 L", ventas:0, cantidad:20.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"5 L", ventas:2585387, cantidad:195.0, precio_uni_prom:13258.39, costo_unidad:7500.0, costo_total:1462500, margen_total:1122887, margen_pct:0.4343, piso:17000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BLOOM", formato:"5 L", ventas:2421402, cantidad:385.0, precio_uni_prom:6289.36, costo_unidad:2891.2, costo_total:1113112, margen_total:1308290, margen_pct:0.5403, piso:9500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"20 L", ventas:2648925, cantidad:1680.0, precio_uni_prom:1576.74, costo_unidad:1465.55, costo_total:2462124, margen_total:186801, margen_pct:0.0705, piso:2800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"200 L", ventas:1700000, cantidad:600.0, precio_uni_prom:2833.33, costo_unidad:1414.56, costo_total:848736, margen_total:851264, margen_pct:0.5007, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO LOS LIRIOS", formato:"?", ventas:0, cantidad:9.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO LA MONTAÑA", formato:"?", ventas:0, cantidad:4.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO SANTA LUISA", formato:"?", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"5 L", ventas:599770, cantidad:130.0, precio_uni_prom:4613.62, costo_unidad:2039.6, costo_total:265148, margen_total:334622, margen_pct:0.5579, piso:4500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"1 L", ventas:1203958, cantidad:146.0, precio_uni_prom:8246.29, costo_unidad:3380.0, costo_total:493480, margen_total:710478, margen_pct:0.5901, piso:15000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"1 L", ventas:508342, cantidad:100.0, precio_uni_prom:5083.42, costo_unidad:3697.0, costo_total:369700, margen_total:138642, margen_pct:0.2727, piso:6500, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"1 L", ventas:1516890, cantidad:351.0, precio_uni_prom:4321.62, costo_unidad:2576.0, costo_total:904176, margen_total:612714, margen_pct:0.4039, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"1 L", ventas:529081, cantidad:119.0, precio_uni_prom:4446.06, costo_unidad:3746.0, costo_total:445774, margen_total:83307, margen_pct:0.1575, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"1 L", ventas:12035, cantidad:2.0, precio_uni_prom:6017.5, costo_unidad:3546.0, costo_total:7092, margen_total:4943, margen_pct:0.4107, piso:7000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BLOOM", formato:"1 L", ventas:727538, cantidad:117.0, precio_uni_prom:6218.27, costo_unidad:4352.0, costo_total:509184, margen_total:218354, margen_pct:0.3001, piso:11000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOBODEN CRYOPHILE", formato:"250 GR", ventas:2380000, cantidad:140.0, precio_uni_prom:17000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"XCARATOR", formato:"20 L", ventas:4966000, cantidad:2000.0, precio_uni_prom:2483.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"200 L", ventas:1515000, cantidad:800.0, precio_uni_prom:1893.75, costo_unidad:2203.92, costo_total:1763136, margen_total:-248136, margen_pct:-0.1638, piso:7000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV MOVE", formato:"5 L", ventas:2738950, cantidad:445.0, precio_uni_prom:6154.94, costo_unidad:3408.2, costo_total:1516649, margen_total:1222301, margen_pct:0.4463, piso:7800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"?", ventas:32707, cantidad:2.0, precio_uni_prom:16353.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"5 L", ventas:906900, cantidad:210.0, precio_uni_prom:4318.57, costo_unidad:1969.0, costo_total:413490, margen_total:493410, margen_pct:0.5441, piso:6500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"20 L", ventas:24663260, cantidad:2770.0, precio_uni_prom:8903.7, costo_unidad:1337.5, costo_total:3704875, margen_total:20958385, margen_pct:0.8498, piso:13500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV MOVE", formato:"1 L", ventas:440960, cantidad:49.0, precio_uni_prom:8999.18, costo_unidad:4394.0, costo_total:215306, margen_total:225654, margen_pct:0.5117, piso:8800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"5 L", ventas:152650, cantidad:50.0, precio_uni_prom:3053.0, costo_unidad:1361.2, costo_total:68060, margen_total:84590, margen_pct:0.5541, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV SILFORTE", formato:"5 L", ventas:1905750, cantidad:265.0, precio_uni_prom:7191.51, costo_unidad:2795.4, costo_total:740781, margen_total:1164969, margen_pct:0.6113, piso:11000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"5 L", ventas:212300, cantidad:70.0, precio_uni_prom:3032.86, costo_unidad:1858.8, costo_total:130116, margen_total:82184, margen_pct:0.3871, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"5 L", ventas:35400, cantidad:35.0, precio_uni_prom:1011.43, costo_unidad:2085.6, costo_total:72996, margen_total:-37596, margen_pct:-1.062, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"K-DEFEND MAX", formato:"20 L", ventas:0, cantidad:200.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"1 L", ventas:308190, cantidad:54.0, precio_uni_prom:5707.22, costo_unidad:2574.0, costo_total:138996, margen_total:169194, margen_pct:0.549, piso:6800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"5 L", ventas:329603, cantidad:80.0, precio_uni_prom:4120.04, costo_unidad:2285.6, costo_total:182848, margen_total:146755, margen_pct:0.4452, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"1 L", ventas:384156, cantidad:113.0, precio_uni_prom:3399.61, costo_unidad:4612.0, costo_total:521156, margen_total:-137000, margen_pct:-0.3566, piso:10000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"5 L", ventas:1365832, cantidad:260.0, precio_uni_prom:5253.2, costo_unidad:2006.0, costo_total:521560, margen_total:844272, margen_pct:0.6181, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"1 L", ventas:309062, cantidad:65.0, precio_uni_prom:4754.8, costo_unidad:3531.0, costo_total:229515, margen_total:79547, margen_pct:0.2574, piso:6500, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV DEFENDER MAX", formato:"1 L", ventas:0, cantidad:15.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV DEFENDER MAX", formato:"5 L", ventas:0, cantidad:50.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"1 L", ventas:912715, cantidad:90.0, precio_uni_prom:10141.28, costo_unidad:4256.0, costo_total:383040, margen_total:529675, margen_pct:0.5803, piso:12500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV15 40-20", formato:"20 L", ventas:3348040, cantidad:1020.0, precio_uni_prom:3282.39, costo_unidad:2123.8, costo_total:2166276, margen_total:1181764, margen_pct:0.353, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOPOTASICO", formato:"500 ML", ventas:26888, cantidad:42.0, precio_uni_prom:640.19, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP", formato:"500 ML", ventas:40332, cantidad:69.0, precio_uni_prom:584.52, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"500 ML", ventas:60498, cantidad:55.0, precio_uni_prom:1099.96, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM", formato:"500 ML", ventas:16805, cantidad:91.0, precio_uni_prom:184.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX", formato:"500 ML", ventas:26888, cantidad:163.0, precio_uni_prom:164.96, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"500 ML", ventas:36971, cantidad:177.0, precio_uni_prom:208.88, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"200 ML", ventas:0, cantidad:27.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOPOTASICO CONC.", formato:"200 ML", ventas:0, cantidad:7.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP CONC.", formato:"200 ML", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"20 GR", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"500 ML", ventas:0, cantidad:7.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"200 ML", ventas:0, cantidad:53.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"200 ML", ventas:0, cantidad:36.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM CONC.", formato:"200 ML", ventas:0, cantidad:24.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"200 L", ventas:7622000, cantidad:4360.0, precio_uni_prom:1748.17, costo_unidad:961.97, costo_total:4194189, margen_total:3427811, margen_pct:0.4497, piso:2500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV15 40-20", formato:"1 L", ventas:458859, cantidad:66.0, precio_uni_prom:6952.41, costo_unidad:3503.0, costo_total:231198, margen_total:227661, margen_pct:0.4961, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV15 40-20", formato:"5 L", ventas:896253, cantidad:170.0, precio_uni_prom:5272.08, costo_unidad:2517.0, costo_total:427890, margen_total:468363, margen_pct:0.5226, piso:6500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"1000 L", ventas:30000000, cantidad:17000.0, precio_uni_prom:1764.71, costo_unidad:1227.8, costo_total:20872600, margen_total:9127400, margen_pct:0.3042, piso:2200, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"200 L", ventas:9810000, cantidad:5850.0, precio_uni_prom:1676.92, costo_unidad:961.97, costo_total:5627524, margen_total:4182476, margen_pct:0.4263, piso:2500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"200 L", ventas:4916000, cantidad:1160.0, precio_uni_prom:4237.93, costo_unidad:2560.3, costo_total:2969948, margen_total:1946052, margen_pct:0.3959, piso:5400, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"1 L", ventas:177168, cantidad:41.0, precio_uni_prom:4321.17, costo_unidad:2955.0, costo_total:121155, margen_total:56013, margen_pct:0.3162, piso:8000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV PRADERAS", formato:"250 GR", ventas:3503408, cantidad:238.0, precio_uni_prom:14720.2, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODENPRO POTASIO", formato:"20 L", ventas:3780000, cantidad:2000.0, precio_uni_prom:1890.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"20 L", ventas:5313000, cantidad:2200.0, precio_uni_prom:2415.0, costo_unidad:1248.2, costo_total:2746040, margen_total:2566960, margen_pct:0.4831, piso:2700, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"500 ML", ventas:0, cantidad:13.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"K-DEFEND MAX", formato:"5 L", ventas:0, cantidad:10.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BLOOM", formato:"20 L", ventas:9390700, cantidad:1860.0, precio_uni_prom:5048.76, costo_unidad:2308.75, costo_total:4294275, margen_total:5096425, margen_pct:0.5427, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANALISIS V-CO", formato:"0000 HOJAS", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANALISIS V-C0", formato:"0000 HOJAS", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"200 L", ventas:1400000, cantidad:1000.0, precio_uni_prom:1400.0, costo_unidad:1761.63, costo_total:1761630, margen_total:-361630, margen_pct:-0.2583, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"GREEN PLANT", formato:"500 ML", ventas:40332, cantidad:127.0, precio_uni_prom:317.57, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"200 L", ventas:900000, cantidad:200.0, precio_uni_prom:4500.0, costo_unidad:1569.77, costo_total:313954, margen_total:586046, margen_pct:0.6512, piso:3000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"1 L", ventas:18902, cantidad:4.0, precio_uni_prom:4725.5, costo_unidad:2845.0, costo_total:11380, margen_total:7522, margen_pct:0.3979, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"SOLUFOS", formato:"500 GR", ventas:5000000, cantidad:400.0, precio_uni_prom:12500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CRYOPHILE", formato:"250 GR", ventas:15356000, cantidad:1536.0, precio_uni_prom:9997.4, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"20 L", ventas:80000, cantidad:40.0, precio_uni_prom:2000.0, costo_unidad:1503.05, costo_total:60122, margen_total:19878, margen_pct:0.2485, piso:3000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANALISIS FOLIAR", formato:"?", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"500 ML", ventas:0, cantidad:4.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"500 ML", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PRODRUCTOS DE", formato:"1 L", ventas:96000, cantidad:9.0, precio_uni_prom:10666.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANALSIS FOLIAR", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"20 L", ventas:12368400, cantidad:1370.0, precio_uni_prom:9028.03, costo_unidad:6500.0, costo_total:8905000, margen_total:3463400, margen_pct:0.28, piso:14500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANÁLSIS FOLIAR", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS SUELO EPS", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS SUELO BÁSICO", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS AGUA DE RIEGO", formato:"?", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"BIOAV INVERNAL", formato:"250 GR", ventas:37584620, cantidad:1831.0, precio_uni_prom:20526.83, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PROTECT PRADERAS", formato:"250 GR", ventas:39600000, cantidad:2200.0, precio_uni_prom:18000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"1 L", ventas:172200, cantidad:24.0, precio_uni_prom:7175.0, costo_unidad:3697.0, costo_total:88728, margen_total:83472, margen_pct:0.4847, piso:8000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"FOLIBAC BIO INVIERNO", formato:"250 GR", ventas:15900000, cantidad:600.0, precio_uni_prom:26500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"20 L", ventas:0, cantidad:160.0, precio_uni_prom:0.0, costo_unidad:2317.75, costo_total:370840, margen_total:-370840, margen_pct:null, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"GREEN GUARDIAN MAX", formato:"20 L", ventas:450000, cantidad:200.0, precio_uni_prom:2250.0, costo_unidad:2223.65, costo_total:444730, margen_total:5270, margen_pct:0.0117, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MACRO FRUIT", formato:"20 L", ventas:6128000, cantidad:3420.0, precio_uni_prom:1791.81, costo_unidad:1896.1, costo_total:6484662, margen_total:-356662, margen_pct:-0.0582, piso:5500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"PRODUCTOS VARIOS", formato:"?", ventas:3243095, cantidad:0.0, precio_uni_prom:null, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"20 GR", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"5 L", ventas:60000, cantidad:15.0, precio_uni_prom:4000.0, costo_unidad:1361.2, costo_total:20418, margen_total:39582, margen_pct:0.6597, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"FOLIBAC FLY", formato:"250 GR", ventas:1325000, cantidad:50.0, precio_uni_prom:26500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"HERBIFEN AMINA 2,4D 20L", formato:"?", ventas:0, cantidad:60.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"POWER MAXX GLIFOSATO MONOAMONICO 75%", formato:"?", ventas:0, cantidad:1140.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"200 L", ventas:12000000, cantidad:1600.0, precio_uni_prom:7500.0, costo_unidad:2385.43, costo_total:3816688, margen_total:8183312, margen_pct:0.6819, piso:14000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"200 L", ventas:2720000, cantidad:1560.0, precio_uni_prom:1743.59, costo_unidad:1479.19, costo_total:2307536, margen_total:412464, margen_pct:0.1516, piso:2600, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"200 L", ventas:2040000, cantidad:1600.0, precio_uni_prom:1275.0, costo_unidad:1242.19, costo_total:1987504, margen_total:52496, margen_pct:0.0257, piso:2500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"200 ML", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"200 L", ventas:4420000, cantidad:1800.0, precio_uni_prom:2455.56, costo_unidad:1110.23, costo_total:1998414, margen_total:2421586, margen_pct:0.5479, piso:2600, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"1000 L", ventas:3250000, cantidad:1000.0, precio_uni_prom:3250.0, costo_unidad:977.03, costo_total:977030, margen_total:2272970, margen_pct:0.6994, piso:2400, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"7", formato:"?", ventas:104800, cantidad:20.0, precio_uni_prom:5240.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV BIOPOTASICO", formato:"1 L", ventas:66000, cantidad:36.0, precio_uni_prom:1833.33, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOPOTASICO", formato:"5 L", ventas:180000, cantidad:40.0, precio_uni_prom:4500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"1000 L", ventas:2600000, cantidad:1000.0, precio_uni_prom:2600.0, costo_unidad:1227.8, costo_total:1227800, margen_total:1372200, margen_pct:0.5278, piso:2200, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"1000 L", ventas:2850000, cantidad:1001.0, precio_uni_prom:2847.15, costo_unidad:1326.35, costo_total:1327676, margen_total:1522324, margen_pct:0.5341, piso:2500, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"200 L", ventas:1360000, cantidad:600.0, precio_uni_prom:2266.67, costo_unidad:1459.55, costo_total:875730, margen_total:484270, margen_pct:0.3561, piso:2600, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"QUARTEC CRIO SACHET", formato:"250 GR", ventas:1000000, cantidad:50.0, precio_uni_prom:20000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"250 ML", ventas:12000, cantidad:9.0, precio_uni_prom:1333.33, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT CONC.", formato:"250 ML", ventas:16805, cantidad:10.0, precio_uni_prom:1680.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT CONC.", formato:"500 ML", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM CONC.", formato:"250 ML", ventas:18000, cantidad:10.0, precio_uni_prom:1800.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT", formato:"250 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"1000 L", ventas:0, cantidad:1000.0, precio_uni_prom:0.0, costo_unidad:2453.06, costo_total:2453060, margen_total:-2453060, margen_pct:null, piso:10000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"200 L", ventas:2600000, cantidad:400.0, precio_uni_prom:6500.0, costo_unidad:2516.18, costo_total:1006472, margen_total:1593528, margen_pct:0.6129, piso:11000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BIOAV INVIERNO", formato:"250 GR", ventas:3330000, cantidad:102.0, precio_uni_prom:32647.06, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MÁXIMO FULVICO 45%", formato:"200 L", ventas:580000, cantidad:200.0, precio_uni_prom:2900.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MÁXIMO FULVICO 45%", formato:"1000 L", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"1000 L", ventas:3000000, cantidad:1.0, precio_uni_prom:3000000.0, costo_unidad:1057.76, costo_total:1058, margen_total:2998942, margen_pct:0.9996, piso:2500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"PLANCHA AV PLUS", formato:"200 L", ventas:680000, cantidad:200.0, precio_uni_prom:3400.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GATILLO BALANCE", formato:"500 ML", ventas:0, cantidad:15.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GATILLO PARA PLANTAS VERDES DE", formato:"500 ML", ventas:0, cantidad:15.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GATILLO NUTRAMIX", formato:"500 ML", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GATILLO SILFORTEM", formato:"500 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MACRO FRUIT", formato:"1 L", ventas:80400, cantidad:16.0, precio_uni_prom:5025.0, costo_unidad:2659.0, costo_total:42544, margen_total:37856, margen_pct:0.4708, piso:8000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"1000 L", ventas:3700000, cantidad:1000.0, precio_uni_prom:3700.0, costo_unidad:1217.22, costo_total:1217220, margen_total:2482780, margen_pct:0.671, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"RAÍZ DE AV BIOVECA", formato:"500 GR", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CONCENTRADO PARA RAÍCES", formato:"250 ML", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CONCENTRADO DE RAÍZ", formato:"500 ML", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CONCENTRACIÓN DE EQUILIBRIO", formato:"250 ML", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM CONC.", formato:"500 ML", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"5 L", ventas:42500, cantidad:5.0, precio_uni_prom:8500.0, costo_unidad:2710.8, costo_total:13554, margen_total:28946, margen_pct:0.6811, piso:7000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"A5", formato:"5 L", ventas:1760000, cantidad:160.0, precio_uni_prom:11000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MACRO FRUIT", formato:"5 L", ventas:111000, cantidad:30.0, precio_uni_prom:3700.0, costo_unidad:2478.6, costo_total:74358, margen_total:36642, margen_pct:0.3301, piso:6800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"?", ventas:0, cantidad:55.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"PLUS POTASIO", formato:"?", ventas:0, cantidad:40.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"?", ventas:0, cantidad:30.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"200 L", ventas:680000, cantidad:600.0, precio_uni_prom:1133.33, costo_unidad:1494.14, costo_total:896484, margen_total:-216484, margen_pct:-0.3184, piso:2800, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"200 L", ventas:680000, cantidad:600.0, precio_uni_prom:1133.33, costo_unidad:1416.08, costo_total:849648, margen_total:-169648, margen_pct:-0.2495, piso:2500, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"BIOTENS", formato:"20 L", ventas:8000000, cantidad:400.0, precio_uni_prom:20000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"250 ML", ventas:42000, cantidad:7.0, precio_uni_prom:6000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOPOTASICO CONC.", formato:"250 ML", ventas:12000, cantidad:2.0, precio_uni_prom:6000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"250 ML", ventas:24000, cantidad:4.0, precio_uni_prom:6000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP CONC.", formato:"250 ML", ventas:6000, cantidad:1.0, precio_uni_prom:6000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"250 ML", ventas:12000, cantidad:2.0, precio_uni_prom:6000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODEN PRO BORO", formato:"20 L", ventas:205400, cantidad:100.0, precio_uni_prom:2054.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODEN PRO ZINC", formato:"20 L", ventas:205400, cantidad:100.0, precio_uni_prom:2054.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BLOOM MAX", formato:"20 L", ventas:1000000, cantidad:200.0, precio_uni_prom:5000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO NUT", formato:"200 L", ventas:16000000, cantidad:800.0, precio_uni_prom:20000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO NUT", formato:"20 L", ventas:2400000, cantidad:120.0, precio_uni_prom:20000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE", formato:"200 L (tier)", ventas:65435.0, cantidad:5448.0, precio_uni_prom:12.0108, costo_unidad:2.15, costo_total:11713.2, margen_total:53721.8, margen_pct:0.821, piso:12.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ALGAP 30", formato:"20 L (tier)", ventas:960.0, cantidad:100.0, precio_uni_prom:9.6, costo_unidad:2.0, costo_total:200.0, margen_total:760.0, margen_pct:0.7917, piso:10.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS MICRO MIX", formato:"1000 L (tier)", ventas:3149.0, cantidad:470.0, precio_uni_prom:6.7, costo_unidad:2.2, costo_total:1034.0, margen_total:2115.0, margen_pct:0.6716, piso:4.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"REGALIA MAX", formato:"?", ventas:52504.0, cantidad:1576.0, precio_uni_prom:33.3147, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV MAX FULVIC 45%", formato:"1000 L (tier)", ventas:1400.0, cantidad:500.0, precio_uni_prom:2.8, costo_unidad:1.16, costo_total:580.0, margen_total:820.0, margen_pct:0.5857, piso:2.2, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS ZINC MANGANESO", formato:"20 L (tier)", ventas:480.0, cantidad:80.0, precio_uni_prom:6.0, costo_unidad:1.85, costo_total:148.0, margen_total:332.0, margen_pct:0.6917, piso:5.8, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV SILFORTE", formato:"1000 L (tier)", ventas:94884.0, cantidad:8800.0, precio_uni_prom:10.7823, costo_unidad:1.99, costo_total:17512.0, margen_total:77372.0, margen_pct:0.8154, piso:10.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV AMIN", formato:"200 L (tier)", ventas:1265.0, cantidad:170.0, precio_uni_prom:7.4412, costo_unidad:1.275, costo_total:216.75, margen_total:1048.25, margen_pct:0.8287, piso:3.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"200 L (tier)", ventas:24077.5, cantidad:1735.0, precio_uni_prom:13.8775, costo_unidad:1.25, costo_total:2168.75, margen_total:21908.75, margen_pct:0.9099, piso:12.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"200 L (tier)", ventas:8796.0, cantidad:1940.0, precio_uni_prom:4.534, costo_unidad:1.18, costo_total:2289.2, margen_total:6506.8, margen_pct:0.7397, piso:5.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"REGALIA", formato:"?", ventas:9712.0, cantidad:244.0, precio_uni_prom:39.8033, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV CYTO PRIME", formato:"200 L (tier)", ventas:4693.0, cantidad:247.0, precio_uni_prom:19.0, costo_unidad:2.4, costo_total:592.8, margen_total:4100.2, margen_pct:0.8737, piso:17.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV CYTO PRIME", formato:"20 L (tier)", ventas:741.0, cantidad:39.0, precio_uni_prom:19.0, costo_unidad:2.2, costo_total:85.8, margen_total:655.2, margen_pct:0.8842, piso:19.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS NUTRI MIX", formato:"1 L (tier)", ventas:17.0, cantidad:2.0, precio_uni_prom:8.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10.0, clasif:"🟢 SOBRE PISO", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"20 L (tier)", ventas:1118.4, cantidad:208.0, precio_uni_prom:5.3769, costo_unidad:1.5, costo_total:312.0, margen_total:806.4, margen_pct:0.721, piso:5.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"1000 L (tier)", ventas:5557.4, cantidad:751.0, precio_uni_prom:7.4, costo_unidad:1.12, costo_total:841.12, margen_total:4716.28, margen_pct:0.8486, piso:4.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS CALCIO", formato:"200 L (tier)", ventas:1126.4, cantidad:256.0, precio_uni_prom:4.4, costo_unidad:1.05, costo_total:268.8, margen_total:857.6, margen_pct:0.7614, piso:3.8, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ALGAP 30", formato:"200 L (tier)", ventas:8632.0, cantidad:828.0, precio_uni_prom:10.4251, costo_unidad:1.7, costo_total:1407.6, margen_total:7224.4, margen_pct:0.8369, piso:8.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"REGALIA MAXX", formato:"?", ventas:99001.64, cantidad:2857.0, precio_uni_prom:34.6523, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE", formato:"20 L (tier)", ventas:4796.0, cantidad:426.0, precio_uni_prom:11.2582, costo_unidad:2.4, costo_total:1022.4, margen_total:3773.6, margen_pct:0.7868, piso:13.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV HUMIC ROOT", formato:"200 L (tier)", ventas:560.0, cantidad:160.0, precio_uni_prom:3.5, costo_unidad:1.25, costo_total:200.0, margen_total:360.0, margen_pct:0.6429, piso:3.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS ZINC", formato:"200 L (tier)", ventas:3150.0, cantidad:420.0, precio_uni_prom:7.5, costo_unidad:1.85, costo_total:777.0, margen_total:2373.0, margen_pct:0.7533, piso:6.8, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV MOVE", formato:"1000 L (tier)", ventas:5477.5, cantidad:626.0, precio_uni_prom:8.75, costo_unidad:2.5, costo_total:1565.0, margen_total:3912.5, margen_pct:0.7143, piso:6.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV MOVE", formato:"20 L (tier)", ventas:280.0, cantidad:32.0, precio_uni_prom:8.75, costo_unidad:2.85, costo_total:91.2, margen_total:188.8, margen_pct:0.6743, piso:8.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS BORO", formato:"20 L (tier)", ventas:1150.0, cantidad:230.0, precio_uni_prom:5.0, costo_unidad:1.35, costo_total:310.5, margen_total:839.5, margen_pct:0.73, piso:4.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"1000 L (tier)", ventas:19236.0, cantidad:1528.0, precio_uni_prom:12.589, costo_unidad:1.17, costo_total:1787.76, margen_total:17448.24, margen_pct:0.9071, piso:11.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV AMIN SUGAR", formato:"20 L (tier)", ventas:200.0, cantidad:20.0, precio_uni_prom:10.0, costo_unidad:1.8, costo_total:36.0, margen_total:164.0, margen_pct:0.82, piso:7.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV BIOSOLARIS", formato:"200 L (tier)", ventas:21900.0, cantidad:1620.0, precio_uni_prom:13.5185, costo_unidad:2.05, costo_total:3321.0, margen_total:18579.0, margen_pct:0.8484, piso:16.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"20 L (tier)", ventas:1040.0, cantidad:80.0, precio_uni_prom:13.0, costo_unidad:1.8, costo_total:144.0, margen_total:896.0, margen_pct:0.8615, piso:13.8, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS HIERRO", formato:"200 L (tier)", ventas:600.0, cantidad:80.0, precio_uni_prom:7.5, costo_unidad:1.05, costo_total:84.0, margen_total:516.0, margen_pct:0.86, piso:4.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV AMIN", formato:"20 L (tier)", ventas:320.0, cantidad:40.0, precio_uni_prom:8.0, costo_unidad:1.85, costo_total:74.0, margen_total:246.0, margen_pct:0.7688, piso:4.2, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV BIOSOLARIS", formato:"1 L (tier)", ventas:26.0, cantidad:2.0, precio_uni_prom:13.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:20.0, clasif:"🟢 SOBRE PISO", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV BIOSOLARIS", formato:"20 L (tier)", ventas:234.0, cantidad:18.0, precio_uni_prom:13.0, costo_unidad:2.4, costo_total:43.2, margen_total:190.8, margen_pct:0.8154, piso:17.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS MICRO MIX", formato:"200 L (tier)", ventas:850.0, cantidad:100.0, precio_uni_prom:8.5, costo_unidad:2.275, costo_total:227.5, margen_total:622.5, margen_pct:0.7324, piso:5.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS HIERRO", formato:"20 L (tier)", ventas:375.0, cantidad:50.0, precio_uni_prom:7.5, costo_unidad:1.35, costo_total:67.5, margen_total:307.5, margen_pct:0.82, piso:5.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ZINC", formato:"?", ventas:2250.0, cantidad:300.0, precio_uni_prom:7.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"LST AV AMIN", formato:"?", ventas:500.0, cantidad:100.0, precio_uni_prom:5.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"SILFORTE", formato:"?", ventas:4200.0, cantidad:400.0, precio_uni_prom:10.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"TS AV MAX FULVIC", formato:"?", ventas:600.0, cantidad:200.0, precio_uni_prom:3.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" }
  ];

  var rentabilidad = {
    alertas_nivel1: [{ pais:"CL", sku:"AV ALGAP 30 200 L", margen:-0.2583, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS MACRO FRUIT 20 L", margen:-0.0582, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV SILFORTE 200 L", margen:-0.1638, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS HIERRO 200 L", margen:-0.3184, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS MAGNESIO 200 L", margen:-0.2495, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV ROOT MAX 1 L", margen:-0.3566, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV BIOSOLARIS 1 L", margen:-0.4714, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS HIERRO 5 L", margen:-1.062, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV AMIN SUGAR 1 L", margen:-1.8957, accion:"REVISAR_O_DESCONTINUAR" }],
    alertas_nivel2: [{ pais:"CL", sku:"GREEN GUARDIAN MAX 20 L", margen:0.0117 }, { pais:"CL", sku:"AV PLUS ZINC 200 L", margen:0.0257 }, { pais:"CL", sku:"AV PLUS ZINC MANGANESO 20 L", margen:0.0705 }],
    impacto_clp:    -1639629,
    skus_bajo_piso_chile: 86,
    skus_bajo_piso_peru:   7,
    skus_sin_costo_chile: 73,
    skus_sin_costo_peru:   9
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

AVBOARD.insights = null;
