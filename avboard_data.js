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
 *   Chile ventas → 12/08/2026
 *   Chile CxC    → 12/08/2026 (2 entidades)
 *   Perú ventas  → 12/08/2026
 *   Perú CxC     → 10/05/2026
 *
 * Actualizado: 2026-08-13
 */

var AVBOARD = (function() {

  var meta = {
    version:      '2026-08-13',
    tc_clp_usd:   950,
    meta_mn:      0.25,
    cortes: {
      chile_ventas: '12/08/2026',
      chile_cxc:    '12/08/2026',
      peru_ventas:  '12/08/2026',
      peru_cxc:     '10/05/2026'
    },
    meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  };

  var grupo = {
    ytd_usd:      907425,
    ytd_clp:      862053339,
    chile_ytd_usd: 435933,
    peru_ytd_usd:  471492,
    rtc_activos:  12,
    mn_chile:     0.179,
    mn_peru:      null,
    // IEC Grupo ponderado (Fase 7): Σvne/Σvpt across countries con datos de piso.
    // Peru excluido hasta tener precio_piso por transacción. Nota: valor < 1.0 = bajo piso.
    iec_grupo: 1.0115,
    iec_grupo_nota: 'Chile solamente — Perú sin precio piso por transacción',
    iec_grupo_vne: 276636718,
    iec_grupo_vpt: 273501100
  };

  var chile_ventas = {
    ytd_5m:          414135939,
    ytd_4m:          269373745,
    mayo_parcial:    7490070,
    ppto_anual:      728110400.0,
    ppto_4m:         228338100,
    ppto_5m:         451611700,
    cumplimiento_4m: 1.1797,
    cumplimiento_5m: 0.917,
    cumplimiento_t1: 0.9979,
    mensual_real:  [88231364, 35651978, 52370709, 93119694, 60181659, 40410263, 36680202, 7490070, 0, 0, 0, 0],
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
      caroca:    32998600.0,
      laratro:   54102100.0,
      encina:    15382200.0,
      velasquez: 32862300.0,
      veverka:   17997300.0
    },
    rtc_mensual_real: {
      almeida: [0, 0, 0, 0, 210000, 330000, 0, 0, 0, 0, 0, 0],
      caroca: [14820273, 6389076, 31913309, 10171393, 9822200, 23594020, 8223602, 1746000, 0, 0, 0, 0],
      encina: [13510783, 7262717, 6819022, 5495612, 8815784, 486243, 0, 0, 0, 0, 0, 0],
      laratro: [37027580, 10378585, 5487150, 62830189, 18073675, 5077000, 10867000, 3675070, 0, 0, 0, 0],
      munoz: [2195728, 765600, 1274728, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      velasquez: [14491000, 9912000, 5196500, 14622500, 23260000, 10923000, 17296000, 2069000, 0, 0, 0, 0],
      veverka: [6186000, 944000, 1680000, 0, 0, 0, 293600, 0, 0, 0, 0, 0]
    },
    rtc_mensual_ppto: {
      caroca: [12500800.0, 5998800.0, 14499000.0, 8831500.0, 12500800.0, 8729100.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      encina: [4989800.0, 5394500.0, 4997900.0, 3137100.0, 2447800.0, 2035600.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      franco_riffo: [1769600.0, 1490500.0, 4709800.0, 3836200.0, 3065800.0, 4175800.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      laratro: [36000700.0, 10600500.0, 7500900.0, 16600300.0, 22500000.0, 9999800.0, 7800600.0, 25000700.0, 30000400.0, 27000300.0, 37499200.0, 22000400.0],
      munoz: [6025500.0, 5310600.0, 3978000.0, 3306600.0, 5661500.0, 8360100.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      velasquez: [14859300.0, 11502700.0, 6500300.0, 10000800.0, 10000700.0, 19999300.0, 41998700.0, 15000900.0, 48000500.0, 50000500.0, 17999500.0, 20001500.0],
      veverka: [5999100.0, 5999100.0, 5999100.0, 5999100.0, 5999100.0, 5999100.0, 5999100.0, 5999100.0, 5999100.0, 5999100.0, 5999100.0, 5999100.0]
    },
    iec: {
      total: 1.012,
      velasquez: 0.957,
      laratro: 1.011,
      caroca: 1.126,
      encina: 1.034,
      veverka: 1.305,
      munoz: 1.085,
      impacto_potencial_clp: 110802333,
      vne_total: 276636718,
      vpt_total: 273501100,
      iec_mensual: {
        total:     [1.0868, 1.0062, 1.1115, 0.9178, 0.8784, 1.1987, 1.1132, 1.0735, null, null, null, null],
        velasquez: [0.9482, 0.9433, 1.1398, 0.8487, 0.8697, 1.1360, 1.0581, 0.9238, null, null, null, null],
        laratro:   [1.1355, 1.0202, 1.0745, 0.9276, 0.8693, 1.3136, 1.1982, 1.2793, null, null, null, null],
        caroca:    [1.1291, 1.0259, 1.1120, 1.3000, 1.1515, 1.2322, 1.1146, 1.0044, null, null, null, null],
        encina:    [0.9874, 1.0384, 1.2057, 0.9826, 0.9946, 0.9606, null, null, null, null, null, null],
        veverka:   [1.3988, 1.1238, 1.1200, null, null, null, 1.6561, null, null, null, null, null],
        munoz:     [1.1782, 1.3671, 0.8877, null, null, null, null, null, null, null, null, null]
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
    ytd_5m:       471492,
    ytd_4m:       259813,
    mayo_parcial: 49476,
    ppto_anual:   1210600.0,
    ppto_4m:      287777.3,
    ppto_5m:      350134.3,
    cumplimiento_4m: 0.9028,
    cumplimiento_5m: 0.6867,
    mensual_real: [70232, 38180, 87967, 63434, 84159, 46084, 31959, 49476, 0, 0, 0, 0],
    mensual_ppto: [51668.700000000004, 60148.09999999999, 101803.8, 74156.7, 62357.0, 99465.7, 78000.0, 159000.0, 143000.0, 173000.0, 118000.0, 90000.0],
    por_vendedor: {
      aguirre: {
        nombre: "Lizbeth Aguirre",
        ytd:    167562,
        mayo:   44076
      },
      atalaya: {
        nombre: "Omar Atalaya",
        ytd:    89789,
        mayo:   4200
      },
      diaz: {
        nombre: "Susan Diaz",
        ytd:    17460,
        mayo:   0
      },
      gonzales: {
        nombre: "Antonio Gonzales",
        ytd:    15562,
        mayo:   0
      },
      infante: {
        nombre: "Oscar Infante",
        ytd:    159184,
        mayo:   0
      },
      valladares: {
        nombre: "Patricia Valladares",
        ytd:    21935,
        mayo:   1200
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
      aguirre: [12025.0, 10572.5, 16149.3, 13128.5, 7643.7, 15021.0, 20000.0, 105000.0, 65000.0, 90000.0, 50000.0, 20000.0],
      atalaya: [22122.8, 17721.8, 10138.6, 17027.5, 21306.5, 34048.8, 25000.0, 19000.0, 23000.0, 23000.0, 18000.0, 10000.0],
      diaz: [0.0, 0.0, 0.0, 0.0, 0.0, 22300.0, 15000.0, 15000.0, 30000.0, 30000.0, 20000.0, 35000.0],
      gonzales: [1261.0, 1469.0, 2498.0, 1820.0, 1521.0, 2431.0, 8000.0, 0.0, 5000.0, 0.0, 5000.0, 0.0],
      infante: [16259.900000000001, 30163.999999999996, 67708.1, 37357.7, 26732.800000000003, 15345.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      martha: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 10000.0, 10000.0, 15000.0, 15000.0, 15000.0],
      valladares: [0.0, 220.8, 5309.8, 4823.0, 5153.0, 10319.4, 10000.0, 10000.0, 10000.0, 15000.0, 10000.0, 10000.0]
    },
    rtc_mensual_real: {
      aguirre: [0, 13884, 28681, 13447, 49431, 11404, 6638, 44076, 0, 0, 0, 0],
      atalaya: [29881, 8108, 20000, 6600, 8400, 12600, 0, 4200, 0, 0, 0, 0],
      diaz: [0, 0, 0, 6300, 2600, 8320, 240, 0, 0, 0, 0, 0],
      gonzales: [600, 0, 96, 0, 0, 6720, 8146, 0, 0, 0, 0, 0],
      infante: [39751, 16188, 38190, 36887, 22328, 0, 5840, 0, 0, 0, 0, 0],
      valladares: [0, 0, 1000, 200, 1400, 7040, 11095, 1200, 0, 0, 0, 0]
    },
    iec: {
      total:      1.0756,
      aguirre:    1.0752,
      infante:    1.2753,
      atalaya:    0.9818,
      valladares: 0.8568,
      gonzales:   1.0504,
      navarro:    1.1647,
      diaz:       0.8540,
      vne_total:  261136.2,
      vpt_total:  242785.8,
      impacto_potencial_usd: 4000
    },
    mn_real:  null,
    mn_meta:  0.250
  };

  var peru_cxc = {
    "corte": "10/08/2026",
    "total": 86287,
    "supra": 196841,
    "tramos": {
      "no_vencida": 49733,
      "t030": 6520,
      "t3160": 1322,
      "t6190": 0,
      "t90": 28712
    },
    "tramos_pct": {
      "no_vencida": 0.576,
      "t030": 0.076,
      "t3160": 0.015,
      "t6190": 0.000,
      "t90": 0.333
    },
    "vencida": 30034,
    "cuentas_criticas": [
      {"cliente":"AGROFER MJ E.I.R.L.","rtc":"OMAR ATALAYA","dias":306,"monto":9493,"estado":"CRÍTICO","alerta":"URGENTE"},
      {"cliente":"PAODISA S.A.","rtc":"JOSE GELDRES","dias":743,"monto":1478,"estado":"CRÍTICO","alerta":"URGENTE"},
      {"cliente":"PAODISA S.A.","rtc":"JOSE GELDRES","dias":647,"monto":1773,"estado":"CRÍTICO","alerta":"URGENTE"},
      {"cliente":"PAODISA S.A.","rtc":"JOSE GELDRES","dias":626,"monto":3546,"estado":"CRÍTICO","alerta":"URGENTE"},
      {"cliente":"PAODISA S.A.","rtc":"JOSE GELDRES","dias":583,"monto":4078,"estado":"CRÍTICO","alerta":"URGENTE"},
      {"cliente":"SERVICIOS BIOINSUMOS PERU SAC","rtc":"SIN ASIGNAR","dias":174,"monto":15,"estado":"CRÍTICO","alerta":"URGENTE"},
      {"cliente":"SERVICIOS BIOINSUMOS PERU SAC","rtc":"SIN ASIGNAR","dias":120,"monto":3780,"estado":"CRÍTICO","alerta":"URGENTE"},
      {"cliente":"SERVICIOS BIOINSUMOS PERU SAC","rtc":"SIN ASIGNAR","dias":114,"monto":2200,"estado":"CRÍTICO","alerta":"URGENTE"},
      {"cliente":"LUNA QUINTANILLA BRYAN ALEXANDER","rtc":"OSCAR INFANTE","dias":247,"monto":1005,"estado":"CRÍTICO","alerta":"URGENTE"},
      {"cliente":"LUNA QUINTANILLA BRYAN ALEXANDER","rtc":"OSCAR INFANTE","dias":192,"monto":1344,"estado":"CRÍTICO","alerta":"URGENTE"}
    ],
    "por_vendedor": {
      "aguirre": {
        "total": 38551,
        "pct": 0.447,
        "vencida": 2000,
        "t90": 0,
        "riesgo": "MONITOREO"
      },
      "geldres": {
        "total": 10874,
        "pct": 0.126,
        "vencida": 10874,
        "t90": 10874,
        "riesgo": "CRÍTICO"
      },
      "valladares": {
        "total": 9975,
        "pct": 0.116,
        "vencida": 0,
        "t90": 0,
        "riesgo": "OK"
      },
      "atalaya": {
        "total": 9493,
        "pct": 0.110,
        "vencida": 9493,
        "t90": 9493,
        "riesgo": "CRÍTICO"
      },
      "gonzales": {
        "total": 6720,
        "pct": 0.078,
        "vencida": 0,
        "t90": 0,
        "riesgo": "OK"
      },
      "infante": {
        "total": 4418,
        "pct": 0.051,
        "vencida": 3191,
        "t90": 2349,
        "riesgo": "RIESGO"
      },
      "diaz": {
        "total": 260,
        "pct": 0.003,
        "vencida": 0,
        "t90": 0,
        "riesgo": "OK"
      },
      "otros": {
        "total": 5996,
        "pct": 0.069,
        "vencida": 5996,
        "t90": 5996,
        "riesgo": "CRÍTICO"
      }
    }
  };

  var productos = [
    { pais:"CL", producto:"AV MOVE", formato:"20 L", ventas:40713409, cantidad:8840.0, precio_uni_prom:4605.59, costo_unidad:3014.95, costo_total:26652158, margen_total:14061251, margen_pct:0.3454, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"20 L", ventas:13485302, cantidad:2895.0, precio_uni_prom:4658.14, costo_unidad:2569.2, costo_total:7437834, margen_total:6047468, margen_pct:0.4484, piso:7000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV SILFORTE", formato:"20 L", ventas:17866572, cantidad:2910.0, precio_uni_prom:6139.72, costo_unidad:2212.85, costo_total:6439394, margen_total:11427178, margen_pct:0.6396, piso:8000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"20 L", ventas:5533520, cantidad:3160.0, precio_uni_prom:1751.11, costo_unidad:1434.05, costo_total:4531598, margen_total:1001922, margen_pct:0.1811, piso:3000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"?", ventas:209000, cantidad:22.0, precio_uni_prom:9500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"20 L", ventas:14194052, cantidad:7100.0, precio_uni_prom:1999.16, costo_unidad:1197.0, costo_total:8498700, margen_total:5695352, margen_pct:0.4012, piso:2700, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"20 L", ventas:7558969, cantidad:4780.0, precio_uni_prom:1581.37, costo_unidad:1422.1, costo_total:6797638, margen_total:761331, margen_pct:0.1007, piso:3000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"20 L", ventas:4846470, cantidad:1900.0, precio_uni_prom:2550.77, costo_unidad:1575.8, costo_total:2994020, margen_total:1852450, margen_pct:0.3822, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"20 L", ventas:7828855, cantidad:3060.0, precio_uni_prom:2558.45, costo_unidad:1770.55, costo_total:5417883, margen_total:2410972, margen_pct:0.308, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"250 GR", ventas:7924000, cantidad:514.0, precio_uni_prom:15416.34, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"20 L", ventas:6302457, cantidad:3960.0, precio_uni_prom:1591.53, costo_unidad:1434.05, costo_total:5678838, margen_total:623619, margen_pct:0.0989, piso:3000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"PK-DEFEND MAX", formato:"20 L", ventas:560000, cantidad:140.0, precio_uni_prom:4000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PK-DEFEND MAX", formato:"5 L", ventas:67150, cantidad:15.0, precio_uni_prom:4476.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"20 L", ventas:772000, cantidad:280.0, precio_uni_prom:2757.14, costo_unidad:2020.2, costo_total:565656, margen_total:206344, margen_pct:0.2673, piso:12000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"5 L", ventas:194000, cantidad:20.0, precio_uni_prom:9700.0, costo_unidad:2602.6, costo_total:52052, margen_total:141948, margen_pct:0.7317, piso:13000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"1 L", ventas:171200, cantidad:62.0, precio_uni_prom:2761.29, costo_unidad:4063.0, costo_total:251906, margen_total:-80706, margen_pct:-0.4714, piso:14000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"20 L", ventas:10268599, cantidad:5060.0, precio_uni_prom:2029.37, costo_unidad:1423.45, costo_total:7202657, margen_total:3065942, margen_pct:0.2986, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"1 L", ventas:16757, cantidad:14.0, precio_uni_prom:1196.93, costo_unidad:3466.0, costo_total:48524, margen_total:-31767, margen_pct:-1.8957, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN", formato:"5 L", ventas:463716, cantidad:105.0, precio_uni_prom:4416.34, costo_unidad:2193.6, costo_total:230328, margen_total:233388, margen_pct:0.5033, piso:5500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANALISIS FOLIAR CEREZO", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV AMIN", formato:"20 L", ventas:2054120, cantidad:980.0, precio_uni_prom:2096.04, costo_unidad:1611.15, costo_total:1578927, margen_total:475193, margen_pct:0.2313, piso:4500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"20 L", ventas:2796760, cantidad:1820.0, precio_uni_prom:1536.68, costo_unidad:1653.7, costo_total:3009734, margen_total:-212974, margen_pct:-0.0762, piso:2900, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"500 GR", ventas:5764473, cantidad:502.0, precio_uni_prom:11483.01, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"ODIN TEBUCONAZOLE 43% LT", formato:"?", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"5 L", ventas:897139, cantidad:135.0, precio_uni_prom:6645.47, costo_unidad:3151.6, costo_total:425466, margen_total:471673, margen_pct:0.5258, piso:9000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV NEMA OFF", formato:"500 GR", ventas:1281420, cantidad:43.0, precio_uni_prom:29800.47, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"5 L", ventas:475678, cantidad:160.0, precio_uni_prom:2972.99, costo_unidad:1815.2, costo_total:290432, margen_total:185246, margen_pct:0.3894, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"5 L", ventas:1584727, cantidad:575.0, precio_uni_prom:2756.05, costo_unidad:2355.8, costo_total:1354585, margen_total:230142, margen_pct:0.1452, piso:4500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"5 L", ventas:4238785, cantidad:376.0, precio_uni_prom:11273.36, costo_unidad:1920.0, costo_total:721920, margen_total:3516865, margen_pct:0.8297, piso:14000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"1 L", ventas:158478, cantidad:14.0, precio_uni_prom:11319.86, costo_unidad:8500.0, costo_total:119000, margen_total:39478, margen_pct:0.2491, piso:18000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"5 L", ventas:951432, cantidad:310.0, precio_uni_prom:3069.14, costo_unidad:2236.2, costo_total:693222, margen_total:258210, margen_pct:0.2714, piso:4000, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"5 L", ventas:297450, cantidad:135.0, precio_uni_prom:2203.33, costo_unidad:2070.6, costo_total:279531, margen_total:17919, margen_pct:0.0602, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"5 L", ventas:368547, cantidad:130.0, precio_uni_prom:2834.98, costo_unidad:2431.6, costo_total:316108, margen_total:52439, margen_pct:0.1423, piso:4500, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"20 L", ventas:591315, cantidad:260.0, precio_uni_prom:2274.29, costo_unidad:1703.15, costo_total:442819, margen_total:148496, margen_pct:0.2511, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"20 L", ventas:2308360, cantidad:1020.0, precio_uni_prom:2263.1, costo_unidad:1488.1, costo_total:1517862, margen_total:790498, margen_pct:0.3425, piso:2900, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN", formato:"1 L", ventas:597474, cantidad:127.0, precio_uni_prom:4704.52, costo_unidad:2467.0, costo_total:313309, margen_total:284165, margen_pct:0.4756, piso:6800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"1 L", ventas:242335, cantidad:50.0, precio_uni_prom:4846.7, costo_unidad:2627.0, costo_total:131350, margen_total:110985, margen_pct:0.458, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"1 L", ventas:396129, cantidad:103.0, precio_uni_prom:3845.91, costo_unidad:2801.0, costo_total:288503, margen_total:107626, margen_pct:0.2717, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"1 L", ventas:577500, cantidad:137.0, precio_uni_prom:4215.33, costo_unidad:3026.0, costo_total:414562, margen_total:162938, margen_pct:0.2821, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"20 L", ventas:1714000, cantidad:840.0, precio_uni_prom:2040.48, costo_unidad:1646.5, costo_total:1383060, margen_total:330940, margen_pct:0.1931, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"5 L", ventas:306787, cantidad:115.0, precio_uni_prom:2667.71, costo_unidad:2353.0, costo_total:270595, margen_total:36192, margen_pct:0.118, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV N-P MIX", formato:"20 L", ventas:0, cantidad:20.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"5 L", ventas:1620167, cantidad:125.0, precio_uni_prom:12961.34, costo_unidad:7500.0, costo_total:937500, margen_total:682667, margen_pct:0.4214, piso:17000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BLOOM", formato:"5 L", ventas:1622252, cantidad:280.0, precio_uni_prom:5793.76, costo_unidad:2891.2, costo_total:809536, margen_total:812716, margen_pct:0.501, piso:9500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"20 L", ventas:2533565, cantidad:1480.0, precio_uni_prom:1711.87, costo_unidad:1465.55, costo_total:2169014, margen_total:364551, margen_pct:0.1439, piso:2800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"200 L", ventas:900000, cantidad:400.0, precio_uni_prom:2250.0, costo_unidad:1414.56, costo_total:565824, margen_total:334176, margen_pct:0.3713, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO LOS LIRIOS", formato:"?", ventas:0, cantidad:9.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO LA MONTAÑA", formato:"?", ventas:0, cantidad:4.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO SANTA LUISA", formato:"?", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"5 L", ventas:280760, cantidad:70.0, precio_uni_prom:4010.86, costo_unidad:2039.6, costo_total:142772, margen_total:137988, margen_pct:0.4915, piso:4500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"1 L", ventas:871758, cantidad:126.0, precio_uni_prom:6918.71, costo_unidad:3380.0, costo_total:425880, margen_total:445878, margen_pct:0.5115, piso:15000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"1 L", ventas:489990, cantidad:95.0, precio_uni_prom:5157.79, costo_unidad:3697.0, costo_total:351215, margen_total:138775, margen_pct:0.2832, piso:6500, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"1 L", ventas:1491290, cantidad:345.0, precio_uni_prom:4322.58, costo_unidad:2576.0, costo_total:888720, margen_total:602570, margen_pct:0.4041, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"1 L", ventas:522974, cantidad:118.0, precio_uni_prom:4431.98, costo_unidad:3746.0, costo_total:442028, margen_total:80946, margen_pct:0.1548, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"1 L", ventas:12035, cantidad:2.0, precio_uni_prom:6017.5, costo_unidad:3546.0, costo_total:7092, margen_total:4943, margen_pct:0.4107, piso:7000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BLOOM", formato:"1 L", ventas:661538, cantidad:111.0, precio_uni_prom:5959.8, costo_unidad:4352.0, costo_total:483072, margen_total:178466, margen_pct:0.2698, piso:11000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOBODEN CRYOPHILE", formato:"250 GR", ventas:2380000, cantidad:140.0, precio_uni_prom:17000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"XCARATOR", formato:"20 L", ventas:4966000, cantidad:2000.0, precio_uni_prom:2483.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"200 L", ventas:1515000, cantidad:800.0, precio_uni_prom:1893.75, costo_unidad:2203.92, costo_total:1763136, margen_total:-248136, margen_pct:-0.1638, piso:7000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV MOVE", formato:"5 L", ventas:2488950, cantidad:420.0, precio_uni_prom:5926.07, costo_unidad:3408.2, costo_total:1431444, margen_total:1057506, margen_pct:0.4249, piso:7800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"?", ventas:32707, cantidad:2.0, precio_uni_prom:16353.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"5 L", ventas:785900, cantidad:185.0, precio_uni_prom:4248.11, costo_unidad:1969.0, costo_total:364265, margen_total:421635, margen_pct:0.5365, piso:6500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"20 L", ventas:15833260, cantidad:2130.0, precio_uni_prom:7433.46, costo_unidad:1337.5, costo_total:2848875, margen_total:12984385, margen_pct:0.8201, piso:13500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV MOVE", formato:"1 L", ventas:430960, cantidad:46.0, precio_uni_prom:9368.7, costo_unidad:4394.0, costo_total:202124, margen_total:228836, margen_pct:0.531, piso:8800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"5 L", ventas:152650, cantidad:45.0, precio_uni_prom:3392.22, costo_unidad:1361.2, costo_total:61254, margen_total:91396, margen_pct:0.5987, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV SILFORTE", formato:"5 L", ventas:1630750, cantidad:240.0, precio_uni_prom:6794.79, costo_unidad:2795.4, costo_total:670896, margen_total:959854, margen_pct:0.5886, piso:11000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"5 L", ventas:162300, cantidad:60.0, precio_uni_prom:2705.0, costo_unidad:1858.8, costo_total:111528, margen_total:50772, margen_pct:0.3128, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"5 L", ventas:35400, cantidad:35.0, precio_uni_prom:1011.43, costo_unidad:2085.6, costo_total:72996, margen_total:-37596, margen_pct:-1.062, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"K-DEFEND MAX", formato:"20 L", ventas:0, cantidad:200.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"1 L", ventas:255690, cantidad:46.0, precio_uni_prom:5558.48, costo_unidad:2574.0, costo_total:118404, margen_total:137286, margen_pct:0.5369, piso:6800, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"5 L", ventas:285603, cantidad:75.0, precio_uni_prom:3808.04, costo_unidad:2285.6, costo_total:171420, margen_total:114183, margen_pct:0.3998, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"1 L", ventas:360156, cantidad:110.0, precio_uni_prom:3274.15, costo_unidad:4612.0, costo_total:507320, margen_total:-147164, margen_pct:-0.4086, piso:10000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"5 L", ventas:1240832, cantidad:240.0, precio_uni_prom:5170.13, costo_unidad:2006.0, costo_total:481440, margen_total:759392, margen_pct:0.612, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"1 L", ventas:246007, cantidad:55.0, precio_uni_prom:4472.85, costo_unidad:3531.0, costo_total:194205, margen_total:51802, margen_pct:0.2106, piso:6500, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV DEFENDER MAX", formato:"1 L", ventas:0, cantidad:15.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV DEFENDER MAX", formato:"5 L", ventas:0, cantidad:50.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"1 L", ventas:240715, cantidad:25.0, precio_uni_prom:9628.6, costo_unidad:4256.0, costo_total:106400, margen_total:134315, margen_pct:0.558, piso:12500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV15 40-20", formato:"20 L", ventas:3228040, cantidad:1000.0, precio_uni_prom:3228.04, costo_unidad:2123.8, costo_total:2123800, margen_total:1104240, margen_pct:0.3421, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOPOTASICO", formato:"500 ML", ventas:16805, cantidad:39.0, precio_uni_prom:430.9, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP", formato:"500 ML", ventas:16805, cantidad:57.0, precio_uni_prom:294.82, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"500 ML", ventas:33610, cantidad:47.0, precio_uni_prom:715.11, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM", formato:"500 ML", ventas:16805, cantidad:91.0, precio_uni_prom:184.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX", formato:"500 ML", ventas:16805, cantidad:160.0, precio_uni_prom:105.03, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"500 ML", ventas:16805, cantidad:171.0, precio_uni_prom:98.27, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"200 ML", ventas:0, cantidad:27.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOPOTASICO CONC.", formato:"200 ML", ventas:0, cantidad:7.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP CONC.", formato:"200 ML", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"20 GR", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"500 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"200 ML", ventas:0, cantidad:53.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"200 ML", ventas:0, cantidad:36.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM CONC.", formato:"200 ML", ventas:0, cantidad:24.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"200 L", ventas:4002000, cantidad:2360.0, precio_uni_prom:1695.76, costo_unidad:961.97, costo_total:2270249, margen_total:1731751, margen_pct:0.4327, piso:2500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV15 40-20", formato:"1 L", ventas:453359, cantidad:63.0, precio_uni_prom:7196.17, costo_unidad:3503.0, costo_total:220689, margen_total:232670, margen_pct:0.5132, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV15 40-20", formato:"5 L", ventas:896253, cantidad:170.0, precio_uni_prom:5272.08, costo_unidad:2517.0, costo_total:427890, margen_total:468363, margen_pct:0.5226, piso:6500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"1000 L", ventas:28200000, cantidad:16000.0, precio_uni_prom:1762.5, costo_unidad:1227.8, costo_total:19644800, margen_total:8555200, margen_pct:0.3034, piso:2200, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"200 L", ventas:8490000, cantidad:5250.0, precio_uni_prom:1617.14, costo_unidad:961.97, costo_total:5050342, margen_total:3439658, margen_pct:0.4051, piso:2500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"200 L", ventas:4916000, cantidad:1160.0, precio_uni_prom:4237.93, costo_unidad:2560.3, costo_total:2969948, margen_total:1946052, margen_pct:0.3959, piso:5400, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"1 L", ventas:103668, cantidad:26.0, precio_uni_prom:3987.23, costo_unidad:2955.0, costo_total:76830, margen_total:26838, margen_pct:0.2589, piso:8000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BIOAV PRADERAS", formato:"250 GR", ventas:3210908, cantidad:226.0, precio_uni_prom:14207.56, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODENPRO POTASIO", formato:"20 L", ventas:3780000, cantidad:2000.0, precio_uni_prom:1890.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"20 L", ventas:3552400, cantidad:1580.0, precio_uni_prom:2248.35, costo_unidad:1248.2, costo_total:1972156, margen_total:1580244, margen_pct:0.4448, piso:2700, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"500 ML", ventas:0, cantidad:11.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"K-DEFEND MAX", formato:"5 L", ventas:0, cantidad:10.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BLOOM", formato:"20 L", ventas:5597500, cantidad:1440.0, precio_uni_prom:3887.15, costo_unidad:2308.75, costo_total:3324600, margen_total:2272900, margen_pct:0.4061, piso:7500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANALISIS V-CO", formato:"0000 HOJAS", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANALISIS V-C0", formato:"0000 HOJAS", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"200 L", ventas:1400000, cantidad:1000.0, precio_uni_prom:1400.0, costo_unidad:1761.63, costo_total:1761630, margen_total:-361630, margen_pct:-0.2583, piso:3500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"GREEN PLANT", formato:"500 ML", ventas:16805, cantidad:120.0, precio_uni_prom:140.04, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"200 L", ventas:900000, cantidad:200.0, precio_uni_prom:4500.0, costo_unidad:1569.77, costo_total:313954, margen_total:586046, margen_pct:0.6512, piso:3000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"1 L", ventas:3902, cantidad:1.0, precio_uni_prom:3902.0, costo_unidad:2845.0, costo_total:2845, margen_total:1057, margen_pct:0.2709, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"SOLUFOS", formato:"500 GR", ventas:5000000, cantidad:400.0, precio_uni_prom:12500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CRYOPHILE", formato:"250 GR", ventas:15356000, cantidad:1536.0, precio_uni_prom:9997.4, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"20 L", ventas:80000, cantidad:40.0, precio_uni_prom:2000.0, costo_unidad:1503.05, costo_total:60122, margen_total:19878, margen_pct:0.2485, piso:3000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANALISIS FOLIAR", formato:"?", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"500 ML", ventas:0, cantidad:4.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"500 ML", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PRODRUCTOS DE", formato:"1 L", ventas:96000, cantidad:9.0, precio_uni_prom:10666.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANALSIS FOLIAR", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"20 L", ventas:8288000, cantidad:1130.0, precio_uni_prom:7334.51, costo_unidad:6500.0, costo_total:7345000, margen_total:943000, margen_pct:0.1138, piso:14500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"ANÁLSIS FOLIAR", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS SUELO EPS", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS SUELO BÁSICO", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS AGUA DE RIEGO", formato:"?", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"BIOAV INVERNAL", formato:"250 GR", ventas:36118228, cantidad:1778.0, precio_uni_prom:20313.96, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PROTECT PRADERAS", formato:"250 GR", ventas:28800000, cantidad:1600.0, precio_uni_prom:18000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"1 L", ventas:172200, cantidad:24.0, precio_uni_prom:7175.0, costo_unidad:3697.0, costo_total:88728, margen_total:83472, margen_pct:0.4847, piso:8000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"FOLIBAC BIO INVIERNO", formato:"250 GR", ventas:15900000, cantidad:600.0, precio_uni_prom:26500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"20 L", ventas:0, cantidad:160.0, precio_uni_prom:0.0, costo_unidad:2317.75, costo_total:370840, margen_total:-370840, margen_pct:null, piso:6000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"GREEN GUARDIAN MAX", formato:"20 L", ventas:450000, cantidad:200.0, precio_uni_prom:2250.0, costo_unidad:2223.65, costo_total:444730, margen_total:5270, margen_pct:0.0117, piso:5000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS MACRO FRUIT", formato:"20 L", ventas:4900000, cantidad:3080.0, precio_uni_prom:1590.91, costo_unidad:1896.1, costo_total:5839988, margen_total:-939988, margen_pct:-0.1918, piso:5500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"PRODUCTOS VARIOS", formato:"?", ventas:3243095, cantidad:0.0, precio_uni_prom:null, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"20 GR", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"5 L", ventas:20000, cantidad:10.0, precio_uni_prom:2000.0, costo_unidad:1361.2, costo_total:13612, margen_total:6388, margen_pct:0.3194, piso:4000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"FOLIBAC FLY", formato:"250 GR", ventas:1325000, cantidad:50.0, precio_uni_prom:26500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"HERBIFEN AMINA 2,4D 20L", formato:"?", ventas:0, cantidad:60.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"POWER MAXX GLIFOSATO MONOAMONICO 75%", formato:"?", ventas:0, cantidad:1140.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"200 L", ventas:0, cantidad:1000.0, precio_uni_prom:0.0, costo_unidad:2385.43, costo_total:2385430, margen_total:-2385430, margen_pct:null, piso:14000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"200 L", ventas:1360000, cantidad:760.0, precio_uni_prom:1789.47, costo_unidad:1479.19, costo_total:1124184, margen_total:235816, margen_pct:0.1734, piso:2600, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"200 L", ventas:680000, cantidad:1000.0, precio_uni_prom:680.0, costo_unidad:1242.19, costo_total:1242190, margen_total:-562190, margen_pct:-0.8267, piso:2500, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"200 ML", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"200 L", ventas:2120000, cantidad:600.0, precio_uni_prom:3533.33, costo_unidad:1110.23, costo_total:666138, margen_total:1453862, margen_pct:0.6858, piso:2600, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"1000 L", ventas:3250000, cantidad:1000.0, precio_uni_prom:3250.0, costo_unidad:977.03, costo_total:977030, margen_total:2272970, margen_pct:0.6994, piso:2400, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"7", formato:"?", ventas:104800, cantidad:20.0, precio_uni_prom:5240.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV BIOPOTASICO", formato:"1 L", ventas:66000, cantidad:12.0, precio_uni_prom:5500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOPOTASICO", formato:"5 L", ventas:180000, cantidad:40.0, precio_uni_prom:4500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"1000 L", ventas:2600000, cantidad:1000.0, precio_uni_prom:2600.0, costo_unidad:1227.8, costo_total:1227800, margen_total:1372200, margen_pct:0.5278, piso:2200, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"1000 L", ventas:2850000, cantidad:1000.0, precio_uni_prom:2850.0, costo_unidad:1326.35, costo_total:1326350, margen_total:1523650, margen_pct:0.5346, piso:2500, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"200 L", ventas:680000, cantidad:200.0, precio_uni_prom:3400.0, costo_unidad:1459.55, costo_total:291910, margen_total:388090, margen_pct:0.5707, piso:2600, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"CL", producto:"QUARTEC CRIO SACHET", formato:"250 GR", ventas:1000000, cantidad:50.0, precio_uni_prom:20000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"250 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT CONC.", formato:"250 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT CONC.", formato:"500 ML", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM CONC.", formato:"250 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT", formato:"250 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"1000 L", ventas:0, cantidad:1000.0, precio_uni_prom:0.0, costo_unidad:2453.06, costo_total:2453060, margen_total:-2453060, margen_pct:null, piso:10000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"CL", producto:"AV BALANCE", formato:"200 L", ventas:0, cantidad:200.0, precio_uni_prom:0.0, costo_unidad:2516.18, costo_total:503236, margen_total:-503236, margen_pct:null, piso:11000, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV SILFORTE", formato:"200 L (tier)", ventas:57795.0, cantidad:4808.0, precio_uni_prom:12.0206, costo_unidad:2.15, costo_total:10337.2, margen_total:47457.8, margen_pct:0.8211, piso:12.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ALGAP 30", formato:"20 L (tier)", ventas:960.0, cantidad:100.0, precio_uni_prom:9.6, costo_unidad:2.0, costo_total:200.0, margen_total:760.0, margen_pct:0.7917, piso:10.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS MICRO MIX", formato:"1000 L (tier)", ventas:3149.0, cantidad:470.0, precio_uni_prom:6.7, costo_unidad:2.2, costo_total:1034.0, margen_total:2115.0, margen_pct:0.6716, piso:4.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"REGALIA MAX", formato:"?", ventas:52504.0, cantidad:1576.0, precio_uni_prom:33.3147, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV MAX FULVIC 45%", formato:"1000 L (tier)", ventas:1400.0, cantidad:500.0, precio_uni_prom:2.8, costo_unidad:1.16, costo_total:580.0, margen_total:820.0, margen_pct:0.5857, piso:2.2, clasif:"🟡 EN PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS ZINC MANGANESO", formato:"20 L (tier)", ventas:480.0, cantidad:80.0, precio_uni_prom:6.0, costo_unidad:1.85, costo_total:148.0, margen_total:332.0, margen_pct:0.6917, piso:5.8, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV SILFORTE", formato:"1000 L (tier)", ventas:94884.0, cantidad:8800.0, precio_uni_prom:10.7823, costo_unidad:1.99, costo_total:17512.0, margen_total:77372.0, margen_pct:0.8154, piso:10.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV AMIN", formato:"200 L (tier)", ventas:1265.0, cantidad:170.0, precio_uni_prom:7.4412, costo_unidad:1.275, costo_total:216.75, margen_total:1048.25, margen_pct:0.8287, piso:3.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"200 L (tier)", ventas:24077.5, cantidad:1735.0, precio_uni_prom:13.8775, costo_unidad:1.25, costo_total:2168.75, margen_total:21908.75, margen_pct:0.9099, piso:12.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"200 L (tier)", ventas:7956.0, cantidad:1700.0, precio_uni_prom:4.68, costo_unidad:1.18, costo_total:2006.0, margen_total:5950.0, margen_pct:0.7479, piso:5.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"REGALIA", formato:"?", ventas:9712.0, cantidad:244.0, precio_uni_prom:39.8033, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV CYTO PRIME", formato:"200 L (tier)", ventas:4693.0, cantidad:247.0, precio_uni_prom:19.0, costo_unidad:2.4, costo_total:592.8, margen_total:4100.2, margen_pct:0.8737, piso:17.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV CYTO PRIME", formato:"20 L (tier)", ventas:741.0, cantidad:39.0, precio_uni_prom:19.0, costo_unidad:2.2, costo_total:85.8, margen_total:655.2, margen_pct:0.8842, piso:19.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS NUTRI MIX", formato:"1 L (tier)", ventas:17.0, cantidad:2.0, precio_uni_prom:8.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10.0, clasif:"🟢 SOBRE PISO", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"20 L (tier)", ventas:1118.4, cantidad:208.0, precio_uni_prom:5.3769, costo_unidad:1.5, costo_total:312.0, margen_total:806.4, margen_pct:0.721, piso:5.5, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"1000 L (tier)", ventas:5557.4, cantidad:751.0, precio_uni_prom:7.4, costo_unidad:1.12, costo_total:841.12, margen_total:4716.28, margen_pct:0.8486, piso:4.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV PLUS CALCIO", formato:"200 L (tier)", ventas:1126.4, cantidad:256.0, precio_uni_prom:4.4, costo_unidad:1.05, costo_total:268.8, margen_total:857.6, margen_pct:0.7614, piso:3.8, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ALGAP 30", formato:"200 L (tier)", ventas:8632.0, cantidad:828.0, precio_uni_prom:10.4251, costo_unidad:1.7, costo_total:1407.6, margen_total:7224.4, margen_pct:0.8369, piso:8.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"REGALIA MAXX", formato:"?", ventas:96481.64, cantidad:2785.0, precio_uni_prom:34.6433, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE", formato:"20 L (tier)", ventas:3426.0, cantidad:306.0, precio_uni_prom:11.1961, costo_unidad:2.4, costo_total:734.4, margen_total:2691.6, margen_pct:0.7856, piso:13.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
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
    { pais:"PE", producto:"AV PLUS HIERRO", formato:"20 L (tier)", ventas:375.0, cantidad:50.0, precio_uni_prom:7.5, costo_unidad:1.35, costo_total:67.5, margen_total:307.5, margen_pct:0.82, piso:5.0, clasif:"🟢 SOBRE PISO", estado:"OK" },
    { pais:"PE", producto:"AV ZINC", formato:"?", ventas:2250.0, cantidad:300.0, precio_uni_prom:7.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" }
  ];

  var rentabilidad = {
    alertas_nivel1: [{ pais:"CL", sku:"AV PLUS MACRO FRUIT 20 L", margen:-0.1918, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS ZINC 200 L", margen:-0.8267, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV ALGAP 30 200 L", margen:-0.2583, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV SILFORTE 200 L", margen:-0.1638, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS CALCIO 20 L", margen:-0.0762, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV ROOT MAX 1 L", margen:-0.4086, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV BIOSOLARIS 1 L", margen:-0.4714, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV PLUS HIERRO 5 L", margen:-1.062, accion:"REVISAR_O_DESCONTINUAR" }, { pais:"CL", sku:"AV AMIN SUGAR 1 L", margen:-1.8957, accion:"REVISAR_O_DESCONTINUAR" }],
    alertas_nivel2: [{ pais:"CL", sku:"GREEN GUARDIAN MAX 20 L", margen:0.0117 }, { pais:"CL", sku:"AV PLUS BORO 5 L", margen:0.0602 }, { pais:"CL", sku:"AV MAX FULVIC 45% 20 L", margen:0.0989 }],
    impacto_clp:    -2622151,
    skus_bajo_piso_chile: 82,
    skus_bajo_piso_peru:   7,
    skus_sin_costo_chile: 48,
    skus_sin_costo_peru:   6
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
