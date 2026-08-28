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
 *   Perú ventas  → 24/08/2026
 *   Perú CxC     → 24/08/2026
 *
 * Actualizado: 2026-08-25
 */

var AVBOARD = (function() {

  var meta = {
    version:      '2026-08-25',
    tc_clp_usd:   950.0,
    meta_mn:      0.25,
    cortes: {
      chile_ventas: '12/08/2026',
      chile_cxc:    '12/08/2026',
      peru_ventas:  '24/08/2026',
      peru_cxc:     '24/08/2026'
    },
    meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  };

  var grupo = {
    ytd_usd:      911665,
    ytd_clp:      866081339,
    chile_ytd_usd: 435933,
    peru_ytd_usd:  475732,
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
    ppto_anual:      861321350,
    ppto_4m:         213591350,
    ppto_5m:         453621350,
    cumplimiento_4m: 1.2612,
    cumplimiento_5m: 0.913,
    cumplimiento_t1: 1.0544,
    mensual_real:  [88231364, 35651978, 52370709, 93119694, 60181659, 40410263, 36680202, 7490070, 0, 0, 0, 0],
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
      almeida: [0, 0, 0, 0, 210000, 330000, 0, 0, 0, 0, 0, 0],
      caroca: [14820273, 6389076, 31913309, 10171393, 9822200, 23594020, 8223602, 1746000, 0, 0, 0, 0],
      encina: [13510783, 7262717, 6819022, 5495612, 8815784, 486243, 0, 0, 0, 0, 0, 0],
      laratro: [37027580, 10378585, 5487150, 62830189, 18073675, 5077000, 10867000, 3675070, 0, 0, 0, 0],
      munoz: [2195728, 765600, 1274728, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      velasquez: [14491000, 9912000, 5196500, 14622500, 23260000, 10923000, 17296000, 2069000, 0, 0, 0, 0],
      veverka: [6186000, 944000, 1680000, 0, 0, 0, 293600, 0, 0, 0, 0, 0]
    },
    rtc_mensual_ppto: {
      caroca: [12500000, 6000000, 14500000, 8831000, 12500000, 8730000, 6000000, 25500000, 10800000, 8700000, 5000000, 12500000],
      encina: [14200000, 7500000, 7500000, 5000000, 5000000, 5000000, 5000000, 12000000, 21000000, 28000000, 31000000, 28700000],
      franco_riffo: [1769000, 1490000, 4709000, 3836000, 3065000, 4175000, 0, 0, 0, 0, 0, 0],
      laratro: [36000000, 10600000, 7500000, 16600000, 22500000, 10000000, 7800000, 21000000, 25000000, 20000000, 37500000, 19500000],
      munoz: [6025000, 5310000, 3978000, 3306000, 5661000, 8360000, 0, 0, 0, 0, 0, 0],
      velasquez: [14858000, 11502000, 6500000, 10000000, 5000000, 20000000, 38000000, 12000000, 48000000, 50000000, 18000000, 20000000],
      veverka: [6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000, 6000000]
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
    ytd_5m:       475732,
    ytd_4m:       259813,
    mayo_parcial: 53716,
    ppto_anual:   1210600,
    ppto_4m:      247291,
    ppto_5m:      611600,
    ppto_mes_label: 'Ago',
    cumplimiento_4m: 1.0506,
    cumplimiento_5m: 0.7778,
    mensual_real: [70232, 38180, 87967, 63434, 84159, 46084, 31959, 53716, 0, 0, 0, 0],
    mensual_ppto: [51669, 60148, 27946, 107528, 78467, 103476, 98366, 84000, 178000, 153000, 158000, 110000],
    por_vendedor: {
      aguirre: {
        nombre: "Lizbeth Aguirre",
        ytd:    169302,
        mayo:   45816
      },
      atalaya: {
        nombre: "Omar Atalaya",
        ytd:    89789,
        mayo:   4200
      },
      diaz: {
        nombre: "Susan Diaz",
        ytd:    19460,
        mayo:   2000
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
        ytd:    22435,
        mayo:   1700
      }
    },
    rtc_ppto_anual: {
      infante: 193569,
      aguirre: 424539,
      atalaya: 240367,
      gonzales: 29000,
      valladares: 90826,
      diaz: 167300,
      martha: 65000
    },
    rtc_mensual_ppto: {
      aguirre: [12025, 10572, 10000, 16149, 13128, 7644, 25021, 30000, 100000, 70000, 90000, 40000],
      atalaya: [22123, 17722, 10139, 17028, 21306, 34049, 25000, 19000, 23000, 23000, 18000, 10000],
      diaz: [0, 0, 0, 0, 0, 22300, 15000, 15000, 30000, 30000, 20000, 35000],
      gonzales: [1261, 1469, 2498, 1820, 1521, 2431, 8000, 0, 5000, 0, 5000, 0],
      infante: [16260, 30164, 0, 67708, 37358, 26733, 15346, 0, 0, 0, 0, 0],
      martha: [0, 0, 0, 0, 0, 0, 0, 10000, 10000, 15000, 15000, 15000],
      valladares: [0, 221, 5310, 4823, 5153, 10319, 10000, 10000, 10000, 15000, 10000, 10000]
    },
    rtc_mensual_real: {
      aguirre: [0, 13884, 28681, 13447, 49431, 11404, 6638, 45816, 0, 0, 0, 0],
      atalaya: [29881, 8108, 20000, 6600, 8400, 12600, 0, 4200, 0, 0, 0, 0],
      diaz: [0, 0, 0, 6300, 2600, 8320, 240, 2000, 0, 0, 0, 0],
      gonzales: [600, 0, 96, 0, 0, 6720, 8146, 0, 0, 0, 0, 0],
      infante: [39751, 16188, 38190, 36887, 22328, 0, 5840, 0, 0, 0, 0, 0],
      valladares: [0, 0, 1000, 200, 1400, 7040, 11095, 1700, 0, 0, 0, 0]
    },
    iec: {
      total:      1.0727,
      aguirre:    1.0719,
      infante:    1.2753,
      atalaya:    0.9818,
      valladares: 0.8568,
      gonzales:   1.0504,
      navarro:    1.1647,
      diaz:       0.8518,
      vne_total:  264876.2,
      vpt_total:  246925.8,
      impacto_potencial_usd: 4000
    },
    mn_real:  null,
    mn_meta:  0.250
  };

  var peru_cxc = {
    "corte": "24/08/2026",
    "total": 125038,
    "supra": 202820,
    "n_documentos": 55,
    "tramos": {
      "no_vencida": 60573,
      "t030": 31556,
      "t3160": 0,
      "t6190": 1322,
      "t90": 31587
    },
    "tramos_pct": {
      "no_vencida": 0.484,
      "t030": 0.252,
      "t3160": 0.0,
      "t6190": 0.011,
      "t90": 0.253
    },
    "vencida": 64465,
    "por_vendedor": {
      "geldres": {
        "total": 10874,
        "pct": 0.087,
        "vencida": 10874,
        "t90": 10874,
        "riesgo": "CRÍTICO"
      },
      "atalaya": {
        "total": 9493,
        "pct": 0.0759,
        "vencida": 9493,
        "t90": 9493,
        "riesgo": "CRÍTICO"
      },
      "infante": {
        "total": 4418,
        "pct": 0.0353,
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
        "pct": 0.0934,
        "vencida": 2775,
        "t90": 200,
        "riesgo": "CRÍTICO"
      },
      "aguirre": {
        "total": 79582,
        "pct": 0.6365,
        "vencida": 38176,
        "t90": 8395,
        "riesgo": "CRÍTICO"
      },
      "gonzales": {
        "total": 6720,
        "pct": 0.0537,
        "vencida": 0,
        "t90": 0,
        "riesgo": "NORMAL"
      },
      "diaz": {
        "total": 2260,
        "pct": 0.0181,
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
        "dias": 317,
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
        "dias": 419,
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
        "dias": 167,
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
        "dias": 637,
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
        "dias": 865,
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
        "dias": 754,
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
        "dias": 137,
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
        "dias": 203,
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
        "dias": 258,
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
        "dias": 226,
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
        "dias": 195,
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
        "dias": 195,
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
        "dias": 68,
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
        "dias": 69,
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
        "dias": 137,
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
        "dias": 865,
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
        "dias": 754,
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
        "dias": 637,
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
        "dias": 419,
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
        "dias": 317,
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
        "dias": 258,
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
        "dias": 226,
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
        "dias": 203,
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
        "dias": 195,
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
        "dias": 195,
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
        "dias": 194,
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
        "dias": 185,
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
        "dias": 167,
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
        "dias": 167,
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
        "dias": 167,
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
        "dias": 137,
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
        "dias": 137,
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
        "dias": 136,
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
        "dias": 131,
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
        "dias": 125,
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
        "dias": 69,
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
        "dias": 68,
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
        "dias": 28,
        "tramo": "0-30d",
        "monto": 2000.0,
        "estado": "Normal"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA PAMPA BAJA S.A.C.",
        "folio": "1150.0",
        "emision": "08/10/2026",
        "vencimiento": "12/08/2026",
        "dias": 12,
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
        "dias": 12,
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
        "dias": 12,
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
        "dias": 4,
        "tramo": "0-30d",
        "monto": 375.0,
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
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1099.0",
        "emision": "25/06/2026",
        "vencimiento": "24/08/2026",
        "dias": 0,
        "tramo": "Al día",
        "monto": 1350.0,
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
        "folio": "1027.0",
        "emision": "28/04/2026",
        "vencimiento": "26/08/2026",
        "dias": -2,
        "tramo": "Al día",
        "monto": 3736.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1028.0",
        "emision": "28/04/2026",
        "vencimiento": "26/08/2026",
        "dias": -2,
        "tramo": "Al día",
        "monto": 1380.6,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1026.0",
        "emision": "28/04/2026",
        "vencimiento": "26/08/2026",
        "dias": -2,
        "tramo": "Al día",
        "monto": 936.0,
        "estado": "Al día"
      },
      {
        "vendedor": "ANTONIO GONZALES",
        "cliente": "SUREXPORT PERU BERRIES S.A.C",
        "folio": "1103.0",
        "emision": "30/06/2026",
        "vencimiento": "29/08/2026",
        "dias": -5,
        "tramo": "Al día",
        "monto": 3600.0,
        "estado": "Al día"
      },
      {
        "vendedor": "ANTONIO GONZALES",
        "cliente": "POB S.A.C.",
        "folio": "1102.0",
        "emision": "30/06/2026",
        "vencimiento": "29/08/2026",
        "dias": -5,
        "tramo": "Al día",
        "monto": 3120.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "CORPORACION ESAN E & F S.A.C",
        "folio": "1077.0",
        "emision": "01/06/2026",
        "vencimiento": "30/08/2026",
        "dias": -6,
        "tramo": "Al día",
        "monto": 7160.24,
        "estado": "Al día"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "SOCIEDAD EXPORTADORA VERFRUT SOCIEDAD ANONIMA CERRADA",
        "folio": "1076.0",
        "emision": "01/06/2026",
        "vencimiento": "30/08/2026",
        "dias": -6,
        "tramo": "Al día",
        "monto": 2400.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1152.0",
        "emision": "08/11/2026",
        "vencimiento": "12/09/2026",
        "dias": -19,
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
        "dias": -19,
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
        "dias": -20,
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
        "dias": -25,
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
        "dias": -26,
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
        "dias": -27,
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
        "dias": -30,
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
        "dias": -30,
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
        "dias": -35,
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
        "dias": -46,
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
        "dias": -48,
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
        "dias": -50,
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
        "dias": -55,
        "tramo": "Al día",
        "monto": 500.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "CORPORACION AGROLATINA S.A.C",
        "folio": "1139.0",
        "emision": "30/07/2026",
        "vencimiento": "28/10/2026",
        "dias": -65,
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
        "dias": -77,
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
        "dias": -78,
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
        "dias": -78,
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
        "dias": -78,
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
        "dias": -80,
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
        "dias": -80,
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
        "dias": -83,
        "tramo": "Al día",
        "monto": 2000.0,
        "estado": "Al día"
      },
      {
        "vendedor": "OSCAR INFANTE",
        "cliente": "I Q F DEL PERU SA",
        "folio": "1049.0",
        "emision": "14/05/2026",
        "vencimiento": "08/12/2026",
        "dias": -106,
        "tramo": "Al día",
        "monto": 320.0,
        "estado": "Al día"
      }
    ]
  };

  var productos = [
    { pais:"CL", producto:"AV MOVE", formato:"20 L", ventas:40713409, cantidad:8840.0, precio_uni_prom:4605.59, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"20 L", ventas:13485302, cantidad:2895.0, precio_uni_prom:4658.14, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"20 L", ventas:17866572, cantidad:2910.0, precio_uni_prom:6139.72, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"20 L", ventas:5533520, cantidad:3160.0, precio_uni_prom:1751.11, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"?", ventas:209000, cantidad:22.0, precio_uni_prom:9500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"20 L", ventas:14194052, cantidad:7100.0, precio_uni_prom:1999.16, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2700, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"20 L", ventas:7558969, cantidad:4780.0, precio_uni_prom:1581.37, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"20 L", ventas:4846470, cantidad:1900.0, precio_uni_prom:2550.77, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"20 L", ventas:7828855, cantidad:3060.0, precio_uni_prom:2558.45, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"250 GR", ventas:7924000, cantidad:514.0, precio_uni_prom:15416.34, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"20 L", ventas:6302457, cantidad:3960.0, precio_uni_prom:1591.53, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"PK-DEFEND MAX", formato:"20 L", ventas:560000, cantidad:140.0, precio_uni_prom:4000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PK-DEFEND MAX", formato:"5 L", ventas:67150, cantidad:15.0, precio_uni_prom:4476.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"20 L", ventas:772000, cantidad:280.0, precio_uni_prom:2757.14, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:12000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"5 L", ventas:194000, cantidad:20.0, precio_uni_prom:9700.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:13000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"1 L", ventas:171200, cantidad:62.0, precio_uni_prom:2761.29, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:14000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"20 L", ventas:10268599, cantidad:5060.0, precio_uni_prom:2029.37, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"1 L", ventas:16757, cantidad:14.0, precio_uni_prom:1196.93, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN", formato:"5 L", ventas:463716, cantidad:105.0, precio_uni_prom:4416.34, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANALISIS FOLIAR CEREZO", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV AMIN", formato:"20 L", ventas:2054120, cantidad:980.0, precio_uni_prom:2096.04, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"20 L", ventas:2796760, cantidad:1820.0, precio_uni_prom:1536.68, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2900, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"500 GR", ventas:5764473, cantidad:502.0, precio_uni_prom:11483.01, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"ODIN TEBUCONAZOLE 43% LT", formato:"?", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"5 L", ventas:897139, cantidad:135.0, precio_uni_prom:6645.47, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:9000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV NEMA OFF", formato:"500 GR", ventas:1281420, cantidad:43.0, precio_uni_prom:29800.47, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"5 L", ventas:475678, cantidad:160.0, precio_uni_prom:2972.99, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"5 L", ventas:1584727, cantidad:575.0, precio_uni_prom:2756.05, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"5 L", ventas:4238785, cantidad:376.0, precio_uni_prom:11273.36, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:14000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"1 L", ventas:158478, cantidad:14.0, precio_uni_prom:11319.86, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:18000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"5 L", ventas:951432, cantidad:310.0, precio_uni_prom:3069.14, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"5 L", ventas:297450, cantidad:135.0, precio_uni_prom:2203.33, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"5 L", ventas:368547, cantidad:130.0, precio_uni_prom:2834.98, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"20 L", ventas:591315, cantidad:260.0, precio_uni_prom:2274.29, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"20 L", ventas:2308360, cantidad:1020.0, precio_uni_prom:2263.1, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2900, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN", formato:"1 L", ventas:597474, cantidad:127.0, precio_uni_prom:4704.52, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"1 L", ventas:242335, cantidad:50.0, precio_uni_prom:4846.7, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"1 L", ventas:396129, cantidad:103.0, precio_uni_prom:3845.91, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"1 L", ventas:577500, cantidad:137.0, precio_uni_prom:4215.33, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"20 L", ventas:1714000, cantidad:840.0, precio_uni_prom:2040.48, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"5 L", ventas:306787, cantidad:115.0, precio_uni_prom:2667.71, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV N-P MIX", formato:"20 L", ventas:0, cantidad:20.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"5 L", ventas:1620167, cantidad:125.0, precio_uni_prom:12961.34, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:17000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BLOOM", formato:"5 L", ventas:1622252, cantidad:280.0, precio_uni_prom:5793.76, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:9500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"20 L", ventas:2533565, cantidad:1480.0, precio_uni_prom:1711.87, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"200 L", ventas:900000, cantidad:400.0, precio_uni_prom:2250.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO LOS LIRIOS", formato:"?", ventas:0, cantidad:9.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO LA MONTAÑA", formato:"?", ventas:0, cantidad:4.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO SANTA LUISA", formato:"?", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"5 L", ventas:280760, cantidad:70.0, precio_uni_prom:4010.86, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"1 L", ventas:871758, cantidad:126.0, precio_uni_prom:6918.71, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:15000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"1 L", ventas:489990, cantidad:95.0, precio_uni_prom:5157.79, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"1 L", ventas:1491290, cantidad:345.0, precio_uni_prom:4322.58, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"1 L", ventas:522974, cantidad:118.0, precio_uni_prom:4431.98, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"1 L", ventas:12035, cantidad:2.0, precio_uni_prom:6017.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BLOOM", formato:"1 L", ventas:661538, cantidad:111.0, precio_uni_prom:5959.8, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:11000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOBODEN CRYOPHILE", formato:"250 GR", ventas:2380000, cantidad:140.0, precio_uni_prom:17000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"XCARATOR", formato:"20 L", ventas:4966000, cantidad:2000.0, precio_uni_prom:2483.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"200 L", ventas:1515000, cantidad:800.0, precio_uni_prom:1893.75, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MOVE", formato:"5 L", ventas:2488950, cantidad:420.0, precio_uni_prom:5926.07, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"?", ventas:32707, cantidad:2.0, precio_uni_prom:16353.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"5 L", ventas:785900, cantidad:185.0, precio_uni_prom:4248.11, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"20 L", ventas:15833260, cantidad:2130.0, precio_uni_prom:7433.46, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:13500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MOVE", formato:"1 L", ventas:430960, cantidad:46.0, precio_uni_prom:9368.7, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"5 L", ventas:152650, cantidad:45.0, precio_uni_prom:3392.22, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"5 L", ventas:1630750, cantidad:240.0, precio_uni_prom:6794.79, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:11000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"5 L", ventas:162300, cantidad:60.0, precio_uni_prom:2705.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"5 L", ventas:35400, cantidad:35.0, precio_uni_prom:1011.43, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"K-DEFEND MAX", formato:"20 L", ventas:0, cantidad:200.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"1 L", ventas:255690, cantidad:46.0, precio_uni_prom:5558.48, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"5 L", ventas:285603, cantidad:75.0, precio_uni_prom:3808.04, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"1 L", ventas:360156, cantidad:110.0, precio_uni_prom:3274.15, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"5 L", ventas:1240832, cantidad:240.0, precio_uni_prom:5170.13, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"1 L", ventas:246007, cantidad:55.0, precio_uni_prom:4472.85, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV DEFENDER MAX", formato:"1 L", ventas:0, cantidad:15.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV DEFENDER MAX", formato:"5 L", ventas:0, cantidad:50.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"1 L", ventas:240715, cantidad:25.0, precio_uni_prom:9628.6, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:12500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV15 40-20", formato:"20 L", ventas:3228040, cantidad:1000.0, precio_uni_prom:3228.04, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
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
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"200 L", ventas:4002000, cantidad:2360.0, precio_uni_prom:1695.76, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV15 40-20", formato:"1 L", ventas:453359, cantidad:63.0, precio_uni_prom:7196.17, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV15 40-20", formato:"5 L", ventas:896253, cantidad:170.0, precio_uni_prom:5272.08, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"1000 L", ventas:28200000, cantidad:16000.0, precio_uni_prom:1762.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2200, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"200 L", ventas:8490000, cantidad:5250.0, precio_uni_prom:1617.14, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"200 L", ventas:4916000, cantidad:1160.0, precio_uni_prom:4237.93, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5400, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"1 L", ventas:103668, cantidad:26.0, precio_uni_prom:3987.23, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV PRADERAS", formato:"250 GR", ventas:3210908, cantidad:226.0, precio_uni_prom:14207.56, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODENPRO POTASIO", formato:"20 L", ventas:3780000, cantidad:2000.0, precio_uni_prom:1890.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"20 L", ventas:3552400, cantidad:1580.0, precio_uni_prom:2248.35, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2700, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"500 ML", ventas:0, cantidad:11.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"K-DEFEND MAX", formato:"5 L", ventas:0, cantidad:10.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BLOOM", formato:"20 L", ventas:5597500, cantidad:1440.0, precio_uni_prom:3887.15, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANALISIS V-CO", formato:"0000 HOJAS", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANALISIS V-C0", formato:"0000 HOJAS", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"200 L", ventas:1400000, cantidad:1000.0, precio_uni_prom:1400.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT", formato:"500 ML", ventas:16805, cantidad:120.0, precio_uni_prom:140.04, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"200 L", ventas:900000, cantidad:200.0, precio_uni_prom:4500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"1 L", ventas:3902, cantidad:1.0, precio_uni_prom:3902.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"SOLUFOS", formato:"500 GR", ventas:5000000, cantidad:400.0, precio_uni_prom:12500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CRYOPHILE", formato:"250 GR", ventas:15356000, cantidad:1536.0, precio_uni_prom:9997.4, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"20 L", ventas:80000, cantidad:40.0, precio_uni_prom:2000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANALISIS FOLIAR", formato:"?", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"500 ML", ventas:0, cantidad:4.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"500 ML", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PRODRUCTOS DE", formato:"1 L", ventas:96000, cantidad:9.0, precio_uni_prom:10666.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANALSIS FOLIAR", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"20 L", ventas:8288000, cantidad:1130.0, precio_uni_prom:7334.51, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:14500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANÁLSIS FOLIAR", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS SUELO EPS", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS SUELO BÁSICO", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS AGUA DE RIEGO", formato:"?", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"BIOAV INVERNAL", formato:"250 GR", ventas:36118228, cantidad:1778.0, precio_uni_prom:20313.96, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PROTECT PRADERAS", formato:"250 GR", ventas:28800000, cantidad:1600.0, precio_uni_prom:18000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"1 L", ventas:172200, cantidad:24.0, precio_uni_prom:7175.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"FOLIBAC BIO INVIERNO", formato:"250 GR", ventas:15900000, cantidad:600.0, precio_uni_prom:26500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"20 L", ventas:0, cantidad:160.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN GUARDIAN MAX", formato:"20 L", ventas:450000, cantidad:200.0, precio_uni_prom:2250.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MACRO FRUIT", formato:"20 L", ventas:4900000, cantidad:3080.0, precio_uni_prom:1590.91, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"PRODUCTOS VARIOS", formato:"?", ventas:3243095, cantidad:0.0, precio_uni_prom:null, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"20 GR", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"5 L", ventas:20000, cantidad:10.0, precio_uni_prom:2000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"FOLIBAC FLY", formato:"250 GR", ventas:1325000, cantidad:50.0, precio_uni_prom:26500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"HERBIFEN AMINA 2,4D 20L", formato:"?", ventas:0, cantidad:60.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"POWER MAXX GLIFOSATO MONOAMONICO 75%", formato:"?", ventas:0, cantidad:1140.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"200 L", ventas:0, cantidad:1000.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:14000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"200 L", ventas:1360000, cantidad:760.0, precio_uni_prom:1789.47, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2600, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"200 L", ventas:680000, cantidad:1000.0, precio_uni_prom:680.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"200 ML", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"200 L", ventas:2120000, cantidad:600.0, precio_uni_prom:3533.33, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2600, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"1000 L", ventas:3250000, cantidad:1000.0, precio_uni_prom:3250.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2400, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"7", formato:"?", ventas:104800, cantidad:20.0, precio_uni_prom:5240.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV BIOPOTASICO", formato:"1 L", ventas:66000, cantidad:12.0, precio_uni_prom:5500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOPOTASICO", formato:"5 L", ventas:180000, cantidad:40.0, precio_uni_prom:4500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"1000 L", ventas:2600000, cantidad:1000.0, precio_uni_prom:2600.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2200, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"1000 L", ventas:2850000, cantidad:1000.0, precio_uni_prom:2850.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"200 L", ventas:680000, cantidad:200.0, precio_uni_prom:3400.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2600, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"QUARTEC CRIO SACHET", formato:"250 GR", ventas:1000000, cantidad:50.0, precio_uni_prom:20000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"250 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT CONC.", formato:"250 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT CONC.", formato:"500 ML", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM CONC.", formato:"250 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT", formato:"250 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"1000 L", ventas:0, cantidad:1000.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"200 L", ventas:0, cantidad:200.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:11000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE", formato:"200 L (tier)", ventas:60875.0, cantidad:5088.0, precio_uni_prom:11.9644, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:12.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ALGAP 30", formato:"20 L (tier)", ventas:960.0, cantidad:100.0, precio_uni_prom:9.6, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MICRO MIX", formato:"1000 L (tier)", ventas:3149.0, cantidad:470.0, precio_uni_prom:6.7, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"REGALIA MAX", formato:"?", ventas:52504.0, cantidad:1576.0, precio_uni_prom:33.3147, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV MAX FULVIC 45%", formato:"1000 L (tier)", ventas:1400.0, cantidad:500.0, precio_uni_prom:2.8, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2.2, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS ZINC MANGANESO", formato:"20 L (tier)", ventas:480.0, cantidad:80.0, precio_uni_prom:6.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5.8, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE", formato:"1000 L (tier)", ventas:94884.0, cantidad:8800.0, precio_uni_prom:10.7823, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV AMIN", formato:"200 L (tier)", ventas:1265.0, cantidad:170.0, precio_uni_prom:7.4412, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"200 L (tier)", ventas:24077.5, cantidad:1735.0, precio_uni_prom:13.8775, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:12.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"200 L (tier)", ventas:7956.0, cantidad:1700.0, precio_uni_prom:4.68, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"REGALIA", formato:"?", ventas:9712.0, cantidad:244.0, precio_uni_prom:39.8033, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV CYTO PRIME", formato:"200 L (tier)", ventas:4693.0, cantidad:247.0, precio_uni_prom:19.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:17.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV CYTO PRIME", formato:"20 L (tier)", ventas:741.0, cantidad:39.0, precio_uni_prom:19.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:19.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS NUTRI MIX", formato:"1 L (tier)", ventas:17.0, cantidad:2.0, precio_uni_prom:8.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"20 L (tier)", ventas:1118.4, cantidad:208.0, precio_uni_prom:5.3769, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"1000 L (tier)", ventas:5557.4, cantidad:751.0, precio_uni_prom:7.4, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS CALCIO", formato:"200 L (tier)", ventas:1126.4, cantidad:256.0, precio_uni_prom:4.4, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3.8, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ALGAP 30", formato:"200 L (tier)", ventas:8632.0, cantidad:828.0, precio_uni_prom:10.4251, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"REGALIA MAXX", formato:"?", ventas:96481.64, cantidad:2785.0, precio_uni_prom:34.6433, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE", formato:"20 L (tier)", ventas:4086.0, cantidad:366.0, precio_uni_prom:11.1639, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:13.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV HUMIC ROOT", formato:"200 L (tier)", ventas:280.0, cantidad:80.0, precio_uni_prom:3.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS ZINC", formato:"200 L (tier)", ventas:3150.0, cantidad:420.0, precio_uni_prom:7.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6.8, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV MOVE", formato:"1000 L (tier)", ventas:5477.5, cantidad:626.0, precio_uni_prom:8.75, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV MOVE", formato:"20 L (tier)", ventas:280.0, cantidad:32.0, precio_uni_prom:8.75, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS BORO", formato:"20 L (tier)", ventas:1150.0, cantidad:230.0, precio_uni_prom:5.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"1000 L (tier)", ventas:13476.0, cantidad:1048.0, precio_uni_prom:12.8588, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:11.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV AMIN SUGAR", formato:"20 L (tier)", ventas:200.0, cantidad:20.0, precio_uni_prom:10.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV BIOSOLARIS", formato:"200 L (tier)", ventas:16960.0, cantidad:1240.0, precio_uni_prom:13.6774, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:16.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"20 L (tier)", ventas:480.0, cantidad:40.0, precio_uni_prom:12.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:13.8, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS HIERRO", formato:"200 L (tier)", ventas:600.0, cantidad:80.0, precio_uni_prom:7.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV AMIN", formato:"20 L (tier)", ventas:320.0, cantidad:40.0, precio_uni_prom:8.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4.2, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV BIOSOLARIS", formato:"1 L (tier)", ventas:26.0, cantidad:2.0, precio_uni_prom:13.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:20.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV BIOSOLARIS", formato:"20 L (tier)", ventas:234.0, cantidad:18.0, precio_uni_prom:13.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:17.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MICRO MIX", formato:"200 L (tier)", ventas:850.0, cantidad:100.0, precio_uni_prom:8.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS HIERRO", formato:"20 L (tier)", ventas:375.0, cantidad:50.0, precio_uni_prom:7.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ZINC", formato:"?", ventas:2250.0, cantidad:300.0, precio_uni_prom:7.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"LST AV AMIN", formato:"?", ventas:500.0, cantidad:100.0, precio_uni_prom:5.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" }
  ];

  var rentabilidad = {
    alertas_nivel1: [],
    alertas_nivel2: [],
    impacto_clp:    0,
    skus_bajo_piso_chile: 0,
    skus_bajo_piso_peru:   0,
    skus_sin_costo_chile: 137,
    skus_sin_costo_peru:   37
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

// ── INSIGHTS AI · Diagnóstico elaborado por AI a petición de la GG ──────────
// Generado: 28/08/2026 | Corte PE: 24/08/2026 | Corte CL: 12/08/2026
AVBOARD.insights = {
  generated_at: "28/08/2026",
  label: "Diagnóstico elaborado por AI a petición de la GG · 8m Ene–Ago 2026",
  peru: {
    diagnostico: "Perú acumula USD 475,731 en 8 meses — cumplimiento grupal del 77.8% sobre ppto. L. Aguirre es el único vendedor sobre meta con 135.9% (USD 169,301), compensando parcialmente las brechas del resto del equipo. O. Infante lleva 82.2% con meses clave ya consumidos. O. Atalaya cae a 54.0% (USD 89,789 vs ppto 166,367) — brecha de USD 76,578. Los tres vendedores H2 (Díaz 37.2%, Valladares 49.0%, Martha Hidalgo 0%) representan el mayor riesgo para el cierre del año. El presupuesto H2 concentra el 63% del año — Agosto tiene el mayor ppto mensual histórico (USD 84,000). Para alcanzar meta anual se requieren USD 661,869 en los 4 meses restantes.",
    acciones: [
      "L. Aguirre: proteger posición — revisar cartera Sep-Dic y gestionar riesgo de concentración en un solo vendedor",
      "O. Atalaya: reunión de revisión urgente — 54% en 8m requiere plan de recuperación formal con KPIs semanales",
      "S. Díaz y P. Valladares: evaluación de viabilidad H2 — si no alcanzan 70% a Sep → protocolo de absorción de zona",
      "M. Hidalgo: cero ventas en 8 meses — revisar onboarding, asignación de cartera y condiciones de campo",
      "O. Infante: seguimiento mensual — con Ago-Dic sin ppto asignado, riesgo de caída libre en H2"
    ]
  },
  chile: {
    diagnostico: "Chile acumula CLP 413.6M en 8 meses — cumplimiento grupal del 85.1% sobre ppto. J. Caroca (112.8%) y P. Laratro (116.2%) son los referentes del equipo, generando CLP 260.1M (63% del total). R. Encina cae a 69.3% — brecha CLP 18.8M en 8m, con riesgo de no recuperar en H2 dado que su ppto de Sep-Dic es de CLP 97M. F. Velásquez en 83.0% pero con margen neto crítico. I. Veverka confirma inviabilidad: 19.0% en 8 meses (CLP 9.1M vs ppto CLP 48M) — subsidio sostenido empresa. V. Muñoz sin actividad desde Marzo — zona efectivamente inactiva. Para cerrar el año en meta se requieren CLP 451M en Sep-Dic.",
    acciones: [
      "I. Veverka: ejecutar resolución de zona inmediatamente — absorción por Laratro o Caroca. No continuar inversión en zona",
      "V. Muñoz: zona inactiva desde Marzo — definir cierre o reasignación de cartera antes de Sep",
      "R. Encina: establecer meta mínima CLP 12M/mes Sep-Dic. Si no cumple Oct → revisión estructural de zona",
      "F. Velásquez: monitoreo semanal de margen — cualquier operación bajo piso de MN debe ser rechazada por Jefe Zona",
      "Caroca y Laratro: analizar expansión de cartera en Q4 — absorber clientes de zonas en liquidación"
    ]
  }
};
