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
 *   Chile ventas → 26/10/2026
 *   Chile CxC    → 12/08/2026 (2 entidades)
 *   Perú ventas  → 26/10/2026
 *   Perú CxC     → 19/10/2026
 *
 * Actualizado: 2026-10-28
 */

var AVBOARD = (function() {

  var meta = {
    version:      '2026-10-28',
    tc_clp_usd:   950.0,
    meta_mn:      0.25,
    cortes: {
      chile_ventas: '26/10/2026',
      chile_cxc:    '12/08/2026',
      peru_ventas:  '26/10/2026',
      peru_cxc:     '19/10/2026'
    },
    meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  };

  var grupo = {
    ytd_usd:      1554947,
    ytd_clp:      1477199483,
    chile_ytd_usd: 837920,
    peru_ytd_usd:  717027,
    rtc_activos:  12,
    mn_chile:     0.179,
    mn_peru:      null,
    // IEC Grupo ponderado (Fase 7): Σvne/Σvpt across countries con datos de piso.
    // Peru excluido hasta tener precio_piso por transacción. Nota: valor < 1.0 = bajo piso.
    iec_grupo: 1.0668,
    iec_grupo_nota: 'Chile solamente — Perú sin precio piso por transacción',
    iec_grupo_vne: 540918009,
    iec_grupo_vpt: 507060600
  };

  var chile_ventas = {
    ytd_5m:          796023833,
    ytd_4m:          269373745,
    mayo_parcial:    72844471,
    ppto_anual:      861321350,
    ppto_4m:         213591350,
    ppto_5m:         677121350,
    cumplimiento_4m: 1.2612,
    cumplimiento_5m: 1.1756,
    cumplimiento_t1: 1.0544,
    mensual_real:      [88231364, 35651978, 52370709, 93119694, 60181659, 40410263, 36680202, 52452730, 264080763, 72844471, 0, 0],
    mensual_real_2025: [61542300, 57866927, 38859549, 44207090, 131497893, 36794291, 33920027, 75002645, 101082901, 134545170, 43630394, 6994835],
    mensual_ppto:      [83558032, 41601950, 42000000, 46431368, 51000000, 49730000, 62800000, 76500000, 110800000, 112700000, 97500000, 86700000],
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
      bernazar: [0, 0, 0, 0, 0, 0, 0, 0, 250436, 223521, 0, 0],
      caroca: [14820273, 6389076, 31913309, 10171393, 9822200, 23594020, 8223602, 26156190, 95833978, 29821460, 0, 0],
      encina: [13510783, 7262717, 6819022, 5495612, 8815784, 486243, 0, 151120, 182395, 124020, 0, 0],
      laratro: [37027580, 10378585, 5487150, 62830189, 18073675, 5077000, 10867000, 15784570, 97080168, 26133970, 0, 0],
      munoz: [2195728, 765600, 1274728, 0, 0, 0, 0, 24000, 0, 0, 0, 0],
      velasquez: [14491000, 9912000, 5196500, 14622500, 23260000, 10923000, 17296000, 10336850, 69223786, 9854000, 0, 0],
      veverka: [6186000, 944000, 1680000, 0, 0, 0, 293600, 0, 1510000, 6612500, 0, 0]
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
      total: 1.067,
      velasquez: 1.038,
      laratro: 1.008,
      caroca: 1.247,
      encina: 1.034,
      veverka: 1.309,
      munoz: 1.086,
      impacto_potencial_clp: 177725682,
      vne_total: 540918009,
      vpt_total: 507060600,
      iec_mensual: {
        total:     [1.0868, 1.0062, 1.1115, 0.9178, 0.8784, 1.1987, 1.1132, 1.3472, 1.1156, 1.0298, null, null],
        velasquez: [0.9482, 0.9433, 1.1398, 0.8487, 0.8697, 1.1360, 1.0581, 1.0529, 1.1871, 1.0640, null, null],
        laratro:   [1.1355, 1.0202, 1.0745, 0.9276, 0.8693, 1.3136, 1.1982, 1.5852, 0.9665, 0.9391, null, null],
        caroca:    [1.1291, 1.0259, 1.1120, 1.3000, 1.1515, 1.2322, 1.1146, 1.4065, 1.2429, 1.2151, null, null],
        encina:    [0.9874, 1.0384, 1.2057, 0.9826, 0.9946, 0.9606, null, 1.0642, 1.0621, 1.1678, null, null],
        veverka:   [1.3988, 1.1238, 1.1200, null, null, null, 1.6561, null, null, 1.3151, null, null],
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
    ytd_5m:       717027,
    ytd_4m:       307470,
    mayo_parcial: 78714,
    ppto_anual:   1210600,
    ppto_4m:      247291,
    ppto_5m:      942600,
    ppto_mes_label: 'Oct',
    cumplimiento_4m: 1.2434,
    cumplimiento_5m: 0.7607,
    mensual_real:      [90672, 43016, 87967, 85815, 96473, 51180, 34646, 65806, 82736, 78714, 0, 0],
    mensual_real_2025: [59128.76, 36687.0, 70947.9, 42486.1, 24250.0, 27780.4, 48123.4, 52993.1, 0, 120639.3, 82518.95, 54009.38],
    mensual_ppto:      [51669, 60148, 27946, 107528, 78467, 103476, 98366, 84000, 178000, 153000, 158000, 110000],
    por_vendedor: {
      aguirre: {
        nombre: "Lizbeth Aguirre",
        ytd:    250659,
        mayo:   34507
      },
      atalaya: {
        nombre: "Omar Atalaya",
        ytd:    89789,
        mayo:   0
      },
      caroca: {
        nombre: "Jorge Caroca",
        ytd:    148418,
        mayo:   44207
      },
      diaz: {
        nombre: "Susan Diaz",
        ytd:    26800,
        mayo:   0
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
        mayo:   0
      },
      valladares: {
        nombre: "Patricia Valladares",
        ytd:    22435,
        mayo:   0
      }
    },
    rtc_ppto_anual: {
      infante: 193569,
      aguirre: 424539,
      atalaya: 240367,
      gonzales: 29000,
      valladares: 90826,
      diaz: 167300,
      martha: 65000,
      caroca: 0,
      geldres: 0
    },
    rtc_mensual_ppto: {
      aguirre: [12025, 10572, 10000, 16149, 13128, 7644, 25021, 30000, 100000, 70000, 90000, 40000],
      atalaya: [22123, 17722, 10139, 17028, 21306, 34049, 25000, 19000, 23000, 23000, 18000, 10000],
      caroca: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      diaz: [0, 0, 0, 0, 0, 22300, 15000, 15000, 30000, 30000, 20000, 35000],
      geldres: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      gonzales: [1261, 1469, 2498, 1820, 1521, 2431, 8000, 0, 5000, 0, 5000, 0],
      infante: [16260, 30164, 0, 67708, 37358, 26733, 15346, 0, 0, 0, 0, 0],
      martha: [0, 0, 0, 0, 0, 0, 0, 10000, 10000, 15000, 15000, 15000],
      valladares: [0, 221, 5310, 4823, 5153, 10319, 10000, 10000, 10000, 15000, 10000, 10000]
    },
    rtc_mensual_real: {
      aguirre: [0, 13884, 28681, 13447, 49431, 11404, 6638, 53346, 39320, 34507, 0, 0],
      atalaya: [29881, 8108, 20000, 6600, 8400, 12600, 0, 4200, 0, 0, 0, 0],
      caroca: [20440, 4836, 0, 22401, 12314, 5096, 2687, 2160, 34276, 44207, 0, 0],
      diaz: [0, 0, 0, 6300, 2600, 8320, 240, 4400, 4940, 0, 0, 0],
      gonzales: [600, 0, 96, 0, 0, 6720, 8146, 0, 0, 0, 0, 0],
      infante: [39751, 16188, 38190, 36867, 22328, 0, 5840, 0, 0, 0, 0, 0],
      martha: [0, 0, 0, 0, 0, 0, 0, 0, 4200, 0, 0, 0],
      valladares: [0, 0, 1000, 200, 1400, 7040, 11095, 1700, 0, 0, 0, 0]
    },
    iec: {
      total:      1.0331,
      aguirre:    0.9779,
      infante:    1.2753,
      atalaya:    0.9818,
      valladares: 0.8568,
      gonzales:   1.0504,
      navarro:    1.1647,
      diaz:       0.8555,
      vne_total:  345888.2,
      vpt_total:  334791.8,
      impacto_potencial_usd: 4000
    },
    mn_real:  null,
    mn_meta:  0.250
  };

  var peru_cxc = {
    "corte": "19/10/2026",
    "total": 131002,
    "supra": 202820,
    "n_documentos": 49,
    "tramos": {
      "no_vencida": 56529,
      "t030": 4300,
      "t3160": 13600,
      "t6190": 29781,
      "t90": 26792
    },
    "tramos_pct": {
      "no_vencida": 0.432,
      "t030": 0.033,
      "t3160": 0.104,
      "t6190": 0.227,
      "t90": 0.205
    },
    "vencida": 74473,
    "por_vendedor": {
      "geldres": {
        "total": 10874,
        "pct": 0.083,
        "vencida": 10874,
        "t90": 10874,
        "riesgo": "CRÍTICO"
      },
      "atalaya": {
        "total": 9493,
        "pct": 0.0725,
        "vencida": 9493,
        "t90": 9493,
        "riesgo": "CRÍTICO"
      },
      "infante": {
        "total": 4098,
        "pct": 0.0313,
        "vencida": 2871,
        "t90": 2871,
        "riesgo": "CRÍTICO"
      },
      "sin_asignar": {
        "total": 15,
        "pct": 0.0001,
        "vencida": 15,
        "t90": 15,
        "riesgo": "CRÍTICO"
      },
      "aguirre": {
        "total": 95561,
        "pct": 0.7295,
        "vencida": 45060,
        "t90": 3079,
        "riesgo": "CRÍTICO"
      },
      "gonzales": {
        "total": 3600,
        "pct": 0.0275,
        "vencida": 3600,
        "t90": 0,
        "riesgo": "RIESGO"
      },
      "valladares": {
        "total": 2700,
        "pct": 0.0206,
        "vencida": 2300,
        "t90": 200,
        "riesgo": "CRÍTICO"
      },
      "diaz": {
        "total": 4660,
        "pct": 0.0356,
        "vencida": 260,
        "t90": 260,
        "riesgo": "CRÍTICO"
      }
    },
    "cuentas_criticas": [
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA PAMPA BAJA S.A.C.",
        "folio": "1150.0",
        "emision": "08/10/2026",
        "vencimiento": "12/08/2026",
        "dias": 68,
        "tramo": "61-90d",
        "monto": 26845.0,
        "estado": "Riesgo"
      },
      {
        "vendedor": "OMAR ATALAYA",
        "cliente": "AGROFER MJ E.I.R.L.",
        "folio": "671.0",
        "emision": "13/06/2025",
        "vencimiento": "11/10/2025",
        "dias": 373,
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
        "dias": 475,
        "tramo": "+90d",
        "monto": 4077.9,
        "estado": "Crítico"
      },
      {
        "vendedor": "JOSE GELDRES",
        "cliente": "PAODISA S.A.",
        "folio": "538.0",
        "emision": "26/09/2024",
        "vencimiento": "25/11/2024",
        "dias": 693,
        "tramo": "+90d",
        "monto": 3546.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "CORPORACION AGROLATINA S.A.C",
        "folio": "1025.0",
        "emision": "28/04/2026",
        "vencimiento": "27/07/2026",
        "dias": 84,
        "tramo": "61-90d",
        "monto": 2000.0,
        "estado": "Riesgo"
      },
      {
        "vendedor": "JOSE GELDRES",
        "cliente": "PAODISA S.A.",
        "folio": "509.0",
        "emision": "09/05/2024",
        "vencimiento": "11/04/2024",
        "dias": 921,
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
        "dias": 810,
        "tramo": "+90d",
        "monto": 1477.5,
        "estado": "Crítico"
      },
      {
        "vendedor": "OSCAR INFANTE",
        "cliente": "LUNA QUINTANILLA BRYAN ALEXANDER",
        "folio": "841.0",
        "emision": "04/11/2025",
        "vencimiento": "02/02/2026",
        "dias": 259,
        "tramo": "+90d",
        "monto": 1344.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRO DIRECT S.A.C.",
        "folio": "1233.0",
        "emision": "10/05/2026",
        "vencimiento": "11/04/2026",
        "dias": 191,
        "tramo": "+90d",
        "monto": 1100.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "OSCAR INFANTE",
        "cliente": "LUNA QUINTANILLA BRYAN ALEXANDER",
        "folio": "743.0",
        "emision": "10/09/2025",
        "vencimiento": "09/12/2025",
        "dias": 314,
        "tramo": "+90d",
        "monto": 1005.05,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1151.0",
        "emision": "08/10/2026",
        "vencimiento": "12/08/2026",
        "dias": 68,
        "tramo": "61-90d",
        "monto": 936.0,
        "estado": "Riesgo"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA RIACHUELO S.A.C",
        "folio": "1142.0",
        "emision": "08/03/2026",
        "vencimiento": "10/02/2026",
        "dias": 251,
        "tramo": "+90d",
        "monto": 908.6,
        "estado": "Crítico"
      },
      {
        "vendedor": "OSCAR INFANTE",
        "cliente": "LUNA QUINTANILLA BRYAN ALEXANDER",
        "folio": "981.0",
        "emision": "18/03/2026",
        "vencimiento": "16/06/2026",
        "dias": 125,
        "tramo": "+90d",
        "monto": 522.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRO DIRECT S.A.C.",
        "folio": "1232.0",
        "emision": "10/05/2026",
        "vencimiento": "11/04/2026",
        "dias": 191,
        "tramo": "+90d",
        "monto": 440.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA SAFCO PERU S.A.",
        "folio": "1194.0",
        "emision": "09/04/2026",
        "vencimiento": "12/03/2026",
        "dias": 221,
        "tramo": "+90d",
        "monto": 420.0,
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
        "dias": 921,
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
        "dias": 810,
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
        "dias": 693,
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
        "dias": 475,
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
        "dias": 373,
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
        "dias": 314,
        "tramo": "+90d",
        "monto": 1005.05,
        "estado": "Crítico"
      },
      {
        "vendedor": "OSCAR INFANTE",
        "cliente": "LUNA QUINTANILLA BRYAN ALEXANDER",
        "folio": "841.0",
        "emision": "04/11/2025",
        "vencimiento": "02/02/2026",
        "dias": 259,
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
        "dias": 251,
        "tramo": "+90d",
        "monto": 908.6,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA SAFCO PERU S.A.",
        "folio": "1143.0",
        "emision": "08/04/2026",
        "vencimiento": "11/02/2026",
        "dias": 250,
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
        "dias": 241,
        "tramo": "+90d",
        "monto": 15.25,
        "estado": "Crítico"
      },
      {
        "vendedor": "SUSAN DIAZ",
        "cliente": "AGRICOLA CAMPO NOBLE S.A.C",
        "folio": "1080.0",
        "emision": "05/06/2026",
        "vencimiento": "10/03/2026",
        "dias": 223,
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
        "dias": 223,
        "tramo": "+90d",
        "monto": 26.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA SAFCO PERU S.A.",
        "folio": "1194.0",
        "emision": "09/04/2026",
        "vencimiento": "12/03/2026",
        "dias": 221,
        "tramo": "+90d",
        "monto": 420.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA SAFCO PERU S.A.",
        "folio": "1193.0",
        "emision": "09/04/2026",
        "vencimiento": "12/03/2026",
        "dias": 221,
        "tramo": "+90d",
        "monto": 70.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "SOCIEDAD EXPORTADORA VERFRUT SOCIEDAD ANONIMA CERRADA",
        "folio": "1109.0",
        "emision": "07/06/2026",
        "vencimiento": "10/04/2026",
        "dias": 192,
        "tramo": "+90d",
        "monto": 200.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRO DIRECT S.A.C.",
        "folio": "1233.0",
        "emision": "10/05/2026",
        "vencimiento": "11/04/2026",
        "dias": 191,
        "tramo": "+90d",
        "monto": 1100.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRO DIRECT S.A.C.",
        "folio": "1232.0",
        "emision": "10/05/2026",
        "vencimiento": "11/04/2026",
        "dias": 191,
        "tramo": "+90d",
        "monto": 440.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "nan",
        "cliente": "SERVICIOS BIOINSUMOS PERU SOCIEDAD ANONIMA CERRADA.",
        "folio": "887.0",
        "emision": "16/12/2025",
        "vencimiento": "15/04/2026",
        "dias": 187,
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
        "dias": 181,
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
        "dias": 125,
        "tramo": "+90d",
        "monto": 522.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "CORPORACION AGROLATINA S.A.C",
        "folio": "1025.0",
        "emision": "28/04/2026",
        "vencimiento": "27/07/2026",
        "dias": 84,
        "tramo": "61-90d",
        "monto": 2000.0,
        "estado": "Riesgo"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA PAMPA BAJA S.A.C.",
        "folio": "1150.0",
        "emision": "08/10/2026",
        "vencimiento": "12/08/2026",
        "dias": 68,
        "tramo": "61-90d",
        "monto": 26845.0,
        "estado": "Riesgo"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1151.0",
        "emision": "08/10/2026",
        "vencimiento": "12/08/2026",
        "dias": 68,
        "tramo": "61-90d",
        "monto": 936.0,
        "estado": "Riesgo"
      },
      {
        "vendedor": "ANTONIO GONZALES",
        "cliente": "SUREXPORT PERU BERRIES S.A.C",
        "folio": "1103.0",
        "emision": "30/06/2026",
        "vencimiento": "29/08/2026",
        "dias": 51,
        "tramo": "31-60d",
        "monto": 3600.0,
        "estado": "Alerta"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1152.0",
        "emision": "08/11/2026",
        "vencimiento": "12/09/2026",
        "dias": 37,
        "tramo": "31-60d",
        "monto": 10000.0,
        "estado": "Alerta"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "CORPORACION AGROLATINA S.A.C",
        "folio": "1094.0",
        "emision": "22/06/2026",
        "vencimiento": "20/09/2026",
        "dias": 29,
        "tramo": "0-30d",
        "monto": 2200.0,
        "estado": "Normal"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "SOCIEDAD EXPORTADORA VERFRUT SOCIEDAD ANONIMA CERRADA",
        "folio": "1101.0",
        "emision": "30/06/2026",
        "vencimiento": "28/09/2026",
        "dias": 21,
        "tramo": "0-30d",
        "monto": 1600.0,
        "estado": "Normal"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "AGRICOLA LIMONES CORONADO S.R.L.",
        "folio": "1172.0",
        "emision": "19/08/2026",
        "vencimiento": "18/10/2026",
        "dias": 1,
        "tramo": "0-30d",
        "monto": 500.0,
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
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1180.0",
        "emision": "25/08/2026",
        "vencimiento": "24/10/2026",
        "dias": -5,
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
        "dias": -5,
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
        "dias": -9,
        "tramo": "Al día",
        "monto": 2000.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA RIACHUELO S.A.C",
        "folio": "1191.0",
        "emision": "02/09/2026",
        "vencimiento": "01/11/2026",
        "dias": -13,
        "tramo": "Al día",
        "monto": 2520.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1192.0",
        "emision": "03/09/2026",
        "vencimiento": "02/11/2026",
        "dias": -14,
        "tramo": "Al día",
        "monto": 280.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "CORPORACION AGROLATINA S.A.C",
        "folio": "1157.0",
        "emision": "12/08/2026",
        "vencimiento": "10/11/2026",
        "dias": -22,
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
        "dias": -22,
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
        "dias": -22,
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
        "dias": -24,
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
        "dias": -24,
        "tramo": "Al día",
        "monto": 187.2,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1207.0",
        "emision": "14/09/2026",
        "vencimiento": "13/11/2026",
        "dias": -25,
        "tramo": "Al día",
        "monto": 1080.0,
        "estado": "Al día"
      },
      {
        "vendedor": "SUSAN DIAZ",
        "cliente": "BLUEWAY ALLIANCE CORP PERU S.A.C.",
        "folio": "1166.0",
        "emision": "17/08/2026",
        "vencimiento": "15/11/2026",
        "dias": -27,
        "tramo": "Al día",
        "monto": 2000.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1208.0",
        "emision": "16/09/2026",
        "vencimiento": "15/11/2026",
        "dias": -27,
        "tramo": "Al día",
        "monto": 600.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA CARMEN LUISA S.A.C.",
        "folio": "1212.0",
        "emision": "22/09/2026",
        "vencimiento": "21/11/2026",
        "dias": -33,
        "tramo": "Al día",
        "monto": 280.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRO DIRECT S.A.C.",
        "folio": "1211.0",
        "emision": "22/09/2026",
        "vencimiento": "22/11/2026",
        "dias": -34,
        "tramo": "Al día",
        "monto": 440.0,
        "estado": "Al día"
      },
      {
        "vendedor": "SUSAN DIAZ",
        "cliente": "PLANTACIONES DEL SOL S.A.C",
        "folio": "1178.0",
        "emision": "25/08/2026",
        "vencimiento": "23/11/2026",
        "dias": -35,
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
        "dias": -37,
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
        "dias": -41,
        "tramo": "Al día",
        "monto": 5760.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA SAFCO PERU S.A.",
        "folio": "1218.0",
        "emision": "25/09/2026",
        "vencimiento": "24/12/2026",
        "dias": -66,
        "tramo": "Al día",
        "monto": 2030.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA GUILI S.A.C.",
        "folio": "1220.0",
        "emision": "26/09/2026",
        "vencimiento": "25/12/2026",
        "dias": -67,
        "tramo": "Al día",
        "monto": 5000.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA GUILI S.A.C.",
        "folio": "1221.0",
        "emision": "26/09/2026",
        "vencimiento": "25/12/2026",
        "dias": -67,
        "tramo": "Al día",
        "monto": 4250.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA GUILI S.A.C.",
        "folio": "1219.0",
        "emision": "26/09/2026",
        "vencimiento": "25/12/2026",
        "dias": -67,
        "tramo": "Al día",
        "monto": 3000.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "CORPORACION AGROLATINA S.A.C",
        "folio": "1229.0",
        "emision": "29/09/2026",
        "vencimiento": "28/12/2026",
        "dias": -70,
        "tramo": "Al día",
        "monto": 18000.0,
        "estado": "Al día"
      }
    ]
  };

  var productos = [
    { pais:"CL", producto:"AV MOVE", formato:"20 L", ventas:53369409, cantidad:10920.0, precio_uni_prom:4887.31, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"20 L", ventas:29411302, cantidad:5115.0, precio_uni_prom:5750.01, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"20 L", ventas:31788572, cantidad:5450.0, precio_uni_prom:5832.77, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"20 L", ventas:16384520, cantidad:6820.0, precio_uni_prom:2402.42, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"?", ventas:2322547, cantidad:131.0, precio_uni_prom:17729.37, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"20 L", ventas:27511052, cantidad:11520.0, precio_uni_prom:2388.11, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2700, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"20 L", ventas:18211169, cantidad:8700.0, precio_uni_prom:2093.24, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"20 L", ventas:8161470, cantidad:3060.0, precio_uni_prom:2667.15, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"20 L", ventas:42867855, cantidad:11300.0, precio_uni_prom:3793.62, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"250 GR", ventas:9581500, cantidad:685.0, precio_uni_prom:13987.59, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"20 L", ventas:11372457, cantidad:6560.0, precio_uni_prom:1733.61, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"PK-DEFEND MAX", formato:"20 L", ventas:560000, cantidad:140.0, precio_uni_prom:4000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PK-DEFEND MAX", formato:"5 L", ventas:67150, cantidad:15.0, precio_uni_prom:4476.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"20 L", ventas:772000, cantidad:280.0, precio_uni_prom:2757.14, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:12000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"5 L", ventas:194000, cantidad:20.0, precio_uni_prom:9700.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:13000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"1 L", ventas:184675, cantidad:63.0, precio_uni_prom:2931.35, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:14000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"20 L", ventas:14818599, cantidad:6740.0, precio_uni_prom:2198.61, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"1 L", ventas:20257, cantidad:15.0, precio_uni_prom:1350.47, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN", formato:"5 L", ventas:807716, cantidad:155.0, precio_uni_prom:5211.07, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANALISIS FOLIAR CEREZO", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV AMIN", formato:"20 L", ventas:12073000, cantidad:3220.0, precio_uni_prom:3749.38, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"20 L", ventas:9221760, cantidad:3920.0, precio_uni_prom:2352.49, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2900, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"500 GR", ventas:7963123, cantidad:596.0, precio_uni_prom:13360.94, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"ODIN TEBUCONAZOLE 43% LT", formato:"?", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"5 L", ventas:2023889, cantidad:265.0, precio_uni_prom:7637.32, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:9000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV NEMA OFF", formato:"500 GR", ventas:1281420, cantidad:43.0, precio_uni_prom:29800.47, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"5 L", ventas:739928, cantidad:220.0, precio_uni_prom:3363.31, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"5 L", ventas:1975610, cantidad:665.0, precio_uni_prom:2970.84, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"5 L", ventas:6843285, cantidad:696.0, precio_uni_prom:9832.31, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:14000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"1 L", ventas:1165048, cantidad:64.0, precio_uni_prom:18203.88, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:18000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"5 L", ventas:1510603, cantidad:455.0, precio_uni_prom:3320.01, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"5 L", ventas:850483, cantidad:285.0, precio_uni_prom:2984.15, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"5 L", ventas:722573, cantidad:220.0, precio_uni_prom:3284.42, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"20 L", ventas:2751235, cantidad:920.0, precio_uni_prom:2990.47, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"20 L", ventas:3995280, cantidad:1540.0, precio_uni_prom:2594.34, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2900, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN", formato:"1 L", ventas:698094, cantidad:140.0, precio_uni_prom:4986.39, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"1 L", ventas:525624, cantidad:117.0, precio_uni_prom:4492.51, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"1 L", ventas:460979, cantidad:113.0, precio_uni_prom:4079.46, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"1 L", ventas:779880, cantidad:180.0, precio_uni_prom:4332.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"20 L", ventas:4324840, cantidad:1620.0, precio_uni_prom:2669.65, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"5 L", ventas:800617, cantidad:225.0, precio_uni_prom:3558.3, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV N-P MIX", formato:"20 L", ventas:0, cantidad:20.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"5 L", ventas:6092732, cantidad:555.0, precio_uni_prom:10977.9, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:17000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BLOOM", formato:"5 L", ventas:2953427, cantidad:460.0, precio_uni_prom:6420.49, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:9500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"20 L", ventas:6256925, cantidad:3040.0, precio_uni_prom:2058.2, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"200 L", ventas:2490000, cantidad:800.0, precio_uni_prom:3112.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO LOS LIRIOS", formato:"?", ventas:0, cantidad:9.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO LA MONTAÑA", formato:"?", ventas:0, cantidad:4.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO SANTA LUISA", formato:"?", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"5 L", ventas:659770, cantidad:210.0, precio_uni_prom:3141.76, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"1 L", ventas:1219658, cantidad:159.0, precio_uni_prom:7670.81, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:15000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"1 L", ventas:676750, cantidad:140.0, precio_uni_prom:4833.93, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"1 L", ventas:1536794, cantidad:355.0, precio_uni_prom:4329.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"1 L", ventas:561081, cantidad:124.0, precio_uni_prom:4524.85, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"1 L", ventas:12035, cantidad:2.0, precio_uni_prom:6017.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BLOOM", formato:"1 L", ventas:763338, cantidad:121.0, precio_uni_prom:6308.58, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:11000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOBODEN CRYOPHILE", formato:"250 GR", ventas:2380000, cantidad:140.0, precio_uni_prom:17000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"XCARATOR", formato:"20 L", ventas:4966000, cantidad:2000.0, precio_uni_prom:2483.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"200 L", ventas:3225000, cantidad:980.0, precio_uni_prom:3290.82, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MOVE", formato:"5 L", ventas:3016450, cantidad:505.0, precio_uni_prom:5973.17, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"?", ventas:32707, cantidad:2.0, precio_uni_prom:16353.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"5 L", ventas:1115935, cantidad:260.0, precio_uni_prom:4292.06, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"20 L", ventas:31107260, cantidad:3470.0, precio_uni_prom:8964.63, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:13500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MOVE", formato:"1 L", ventas:440960, cantidad:49.0, precio_uni_prom:8999.18, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"5 L", ventas:183150, cantidad:75.0, precio_uni_prom:2442.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"5 L", ventas:1980900, cantidad:310.0, precio_uni_prom:6390.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:11000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"5 L", ventas:212300, cantidad:85.0, precio_uni_prom:2497.65, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"5 L", ventas:35400, cantidad:35.0, precio_uni_prom:1011.43, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"K-DEFEND MAX", formato:"20 L", ventas:0, cantidad:200.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"1 L", ventas:357430, cantidad:64.0, precio_uni_prom:5584.84, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"5 L", ventas:516183, cantidad:120.0, precio_uni_prom:4301.52, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"1 L", ventas:451920, cantidad:120.0, precio_uni_prom:3766.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"5 L", ventas:1420832, cantidad:280.0, precio_uni_prom:5074.4, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"1 L", ventas:585158, cantidad:119.0, precio_uni_prom:4917.29, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV DEFENDER MAX", formato:"1 L", ventas:0, cantidad:15.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV DEFENDER MAX", formato:"5 L", ventas:0, cantidad:50.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"1 L", ventas:968887, cantidad:163.0, precio_uni_prom:5944.09, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:12500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV15 40-20", formato:"20 L", ventas:3564940, cantidad:1060.0, precio_uni_prom:3363.15, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOPOTASICO", formato:"500 ML", ventas:90747, cantidad:64.0, precio_uni_prom:1417.92, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP", formato:"500 ML", ventas:40332, cantidad:76.0, precio_uni_prom:530.68, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"500 ML", ventas:67220, cantidad:65.0, precio_uni_prom:1034.15, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM", formato:"500 ML", ventas:55121, cantidad:103.0, precio_uni_prom:535.16, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX", formato:"500 ML", ventas:87386, cantidad:184.0, precio_uni_prom:474.92, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"500 ML", ventas:90747, cantidad:199.0, precio_uni_prom:456.02, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"200 ML", ventas:0, cantidad:27.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOPOTASICO CONC.", formato:"200 ML", ventas:0, cantidad:7.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP CONC.", formato:"200 ML", ventas:6202, cantidad:3.0, precio_uni_prom:2067.33, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"20 GR", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"500 ML", ventas:0, cantidad:7.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"200 ML", ventas:6202, cantidad:54.0, precio_uni_prom:114.85, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"200 ML", ventas:6202, cantidad:37.0, precio_uni_prom:167.62, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM CONC.", formato:"200 ML", ventas:0, cantidad:24.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"200 L", ventas:7622000, cantidad:4560.0, precio_uni_prom:1671.49, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV15 40-20", formato:"1 L", ventas:482316, cantidad:69.0, precio_uni_prom:6990.09, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV15 40-20", formato:"5 L", ventas:896253, cantidad:170.0, precio_uni_prom:5272.08, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"1000 L", ventas:32500000, cantidad:19000.0, precio_uni_prom:1710.53, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2200, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"200 L", ventas:10185000, cantidad:6000.0, precio_uni_prom:1697.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"200 L", ventas:6140000, cantidad:1340.0, precio_uni_prom:4582.09, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5400, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"1 L", ventas:182668, cantidad:43.0, precio_uni_prom:4248.09, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV PRADERAS", formato:"250 GR", ventas:3503408, cantidad:248.0, precio_uni_prom:14126.65, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODENPRO POTASIO", formato:"20 L", ventas:3780000, cantidad:2000.0, precio_uni_prom:1890.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"20 L", ventas:7594200, cantidad:2920.0, precio_uni_prom:2600.75, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2700, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"500 ML", ventas:0, cantidad:13.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"K-DEFEND MAX", formato:"5 L", ventas:0, cantidad:10.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BLOOM", formato:"20 L", ventas:12990700, cantidad:2440.0, precio_uni_prom:5324.06, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANALISIS V-CO", formato:"0000 HOJAS", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANALISIS V-C0", formato:"0000 HOJAS", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"200 L", ventas:1400000, cantidad:1000.0, precio_uni_prom:1400.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT", formato:"500 ML", ventas:84025, cantidad:147.0, precio_uni_prom:571.6, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"200 L", ventas:900000, cantidad:200.0, precio_uni_prom:4500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"1 L", ventas:47252, cantidad:13.0, precio_uni_prom:3634.77, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"SOLUFOS", formato:"500 GR", ventas:5000000, cantidad:400.0, precio_uni_prom:12500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CRYOPHILE", formato:"250 GR", ventas:15356000, cantidad:1536.0, precio_uni_prom:9997.4, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"20 L", ventas:80000, cantidad:40.0, precio_uni_prom:2000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANALISIS FOLIAR", formato:"?", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"500 ML", ventas:0, cantidad:4.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"500 ML", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PRODRUCTOS DE", formato:"1 L", ventas:96000, cantidad:9.0, precio_uni_prom:10666.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANALSIS FOLIAR", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"20 L", ventas:12808400, cantidad:1410.0, precio_uni_prom:9083.97, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:14500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANÁLSIS FOLIAR", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS SUELO EPS", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS SUELO BÁSICO", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS AGUA DE RIEGO", formato:"?", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"BIOAV INVERNAL", formato:"250 GR", ventas:39222706, cantidad:1943.0, precio_uni_prom:20186.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PROTECT PRADERAS", formato:"250 GR", ventas:39600000, cantidad:2200.0, precio_uni_prom:18000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"1 L", ventas:172200, cantidad:24.0, precio_uni_prom:7175.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"FOLIBAC BIO INVIERNO", formato:"250 GR", ventas:15900000, cantidad:600.0, precio_uni_prom:26500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"20 L", ventas:0, cantidad:160.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN GUARDIAN MAX", formato:"20 L", ventas:450000, cantidad:200.0, precio_uni_prom:2250.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MACRO FRUIT", formato:"20 L", ventas:6242540, cantidad:3620.0, precio_uni_prom:1724.46, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"PRODUCTOS VARIOS", formato:"?", ventas:3243095, cantidad:0.0, precio_uni_prom:null, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"20 GR", ventas:7017, cantidad:2.0, precio_uni_prom:3508.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"5 L", ventas:60000, cantidad:15.0, precio_uni_prom:4000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"FOLIBAC FLY", formato:"250 GR", ventas:1325000, cantidad:50.0, precio_uni_prom:26500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"HERBIFEN AMINA 2,4D 20L", formato:"?", ventas:0, cantidad:60.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"POWER MAXX GLIFOSATO MONOAMONICO 75%", formato:"?", ventas:0, cantidad:1140.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"200 L", ventas:12000000, cantidad:1600.0, precio_uni_prom:7500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:14000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"200 L", ventas:4220000, cantidad:2360.0, precio_uni_prom:1788.14, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2600, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"200 L", ventas:2040000, cantidad:1800.0, precio_uni_prom:1133.33, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"200 ML", ventas:24808, cantidad:12.0, precio_uni_prom:2067.33, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"200 L", ventas:5220000, cantidad:2200.0, precio_uni_prom:2372.73, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2600, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"1000 L", ventas:3250000, cantidad:2000.0, precio_uni_prom:1625.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2400, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"7", formato:"?", ventas:104800, cantidad:20.0, precio_uni_prom:5240.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV BIOPOTASICO", formato:"1 L", ventas:66000, cantidad:36.0, precio_uni_prom:1833.33, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOPOTASICO", formato:"5 L", ventas:360000, cantidad:120.0, precio_uni_prom:3000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"1000 L", ventas:2600000, cantidad:1000.0, precio_uni_prom:2600.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2200, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"1000 L", ventas:2850000, cantidad:1001.0, precio_uni_prom:2847.15, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"200 L", ventas:1360000, cantidad:800.0, precio_uni_prom:1700.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2600, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"QUARTEC CRIO SACHET", formato:"250 GR", ventas:1000000, cantidad:50.0, precio_uni_prom:20000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"250 ML", ventas:6202, cantidad:10.0, precio_uni_prom:620.2, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT CONC.", formato:"250 ML", ventas:0, cantidad:10.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT CONC.", formato:"500 ML", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM CONC.", formato:"250 ML", ventas:0, cantidad:10.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT", formato:"250 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"1000 L", ventas:0, cantidad:1000.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"200 L", ventas:2600000, cantidad:400.0, precio_uni_prom:6500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:11000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOAV INVIERNO", formato:"250 GR", ventas:3330000, cantidad:102.0, precio_uni_prom:32647.06, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MÁXIMO FULVICO 45%", formato:"200 L", ventas:580000, cantidad:200.0, precio_uni_prom:2900.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MÁXIMO FULVICO 45%", formato:"1000 L", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"1000 L", ventas:3000000, cantidad:1.0, precio_uni_prom:3000000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"PLANCHA AV PLUS", formato:"200 L", ventas:680000, cantidad:200.0, precio_uni_prom:3400.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GATILLO BALANCE", formato:"500 ML", ventas:0, cantidad:15.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GATILLO PARA PLANTAS VERDES DE", formato:"500 ML", ventas:0, cantidad:15.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GATILLO NUTRAMIX", formato:"500 ML", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GATILLO SILFORTEM", formato:"500 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MACRO FRUIT", formato:"1 L", ventas:80400, cantidad:16.0, precio_uni_prom:5025.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"1000 L", ventas:11600000, cantidad:3000.0, precio_uni_prom:3866.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"RAÍZ DE AV BIOVECA", formato:"500 GR", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CONCENTRADO PARA RAÍCES", formato:"250 ML", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CONCENTRADO DE RAÍZ", formato:"500 ML", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CONCENTRACIÓN DE EQUILIBRIO", formato:"250 ML", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM CONC.", formato:"500 ML", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"5 L", ventas:42500, cantidad:5.0, precio_uni_prom:8500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"A5", formato:"5 L", ventas:1760000, cantidad:160.0, precio_uni_prom:11000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MACRO FRUIT", formato:"5 L", ventas:111000, cantidad:45.0, precio_uni_prom:2466.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"?", ventas:4697666, cantidad:528.0, precio_uni_prom:8897.09, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"PLUS POTASIO", formato:"?", ventas:0, cantidad:40.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"?", ventas:0, cantidad:30.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"200 L", ventas:680000, cantidad:600.0, precio_uni_prom:1133.33, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"200 L", ventas:680000, cantidad:800.0, precio_uni_prom:850.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOTENS", formato:"20 L", ventas:12000000, cantidad:620.0, precio_uni_prom:19354.84, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"250 ML", ventas:12404, cantidad:9.0, precio_uni_prom:1378.22, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOPOTASICO CONC.", formato:"250 ML", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"250 ML", ventas:0, cantidad:4.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP CONC.", formato:"250 ML", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"250 ML", ventas:11378, cantidad:4.0, precio_uni_prom:2844.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODEN PRO BORO", formato:"20 L", ventas:205400, cantidad:100.0, precio_uni_prom:2054.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODEN PRO ZINC", formato:"20 L", ventas:205400, cantidad:100.0, precio_uni_prom:2054.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BLOOM MAX", formato:"20 L", ventas:1000000, cantidad:200.0, precio_uni_prom:5000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO NUT", formato:"200 L", ventas:16000000, cantidad:800.0, precio_uni_prom:20000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO NUT", formato:"20 L", ventas:2400000, cantidad:120.0, precio_uni_prom:20000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"1 L", ventas:12320, cantidad:2.0, precio_uni_prom:6160.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"1 L", ventas:5294, cantidad:1.0, precio_uni_prom:5294.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BLOOM", formato:"?", ventas:7689923, cantidad:813.0, precio_uni_prom:9458.7, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV AMIN", formato:"?", ventas:2177870, cantidad:921.0, precio_uni_prom:2364.68, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"?", ventas:1728103, cantidad:630.0, precio_uni_prom:2743.02, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"?", ventas:893847, cantidad:315.0, precio_uni_prom:2837.61, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS MACRO FRUIT", formato:"?", ventas:2866936, cantidad:866.0, precio_uni_prom:3310.55, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"?", ventas:2169729, cantidad:791.0, precio_uni_prom:2743.02, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"?", ventas:1643069, cantidad:599.0, precio_uni_prom:2743.02, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV MOVE", formato:"?", ventas:3579172, cantidad:473.0, precio_uni_prom:7566.96, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"?", ventas:1738037, cantidad:175.0, precio_uni_prom:9931.64, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV BIO FOLIAR", formato:"?", ventas:1684446, cantidad:15900.0, precio_uni_prom:105.94, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"?", ventas:647353, cantidad:236.0, precio_uni_prom:2743.02, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"TRIHORGAN", formato:"1 L", ventas:660000, cantidad:60.0, precio_uni_prom:11000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PROBIORGAN IRG", formato:"1 L", ventas:570000, cantidad:60.0, precio_uni_prom:9500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"1000 L", ventas:7500000, cantidad:3000.0, precio_uni_prom:2500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2400, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOPOTASICO", formato:"20 L", ventas:400000, cantidad:100.0, precio_uni_prom:4000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"QUARTEC FILOSFERA", formato:"250 GR", ventas:6200000, cantidad:310.0, precio_uni_prom:20000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FOLIBAC SOIL", formato:"500 GR", ventas:262500, cantidad:10.0, precio_uni_prom:26250.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"200 L", ventas:569970, cantidad:200.0, precio_uni_prom:2849.85, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODENPRO CALCIO", formato:"20 L", ventas:2744960, cantidad:1280.0, precio_uni_prom:2144.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODENPRO MAGNESIO", formato:"20 L", ventas:2297660, cantidad:980.0, precio_uni_prom:2344.55, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILIK FORTE", formato:"20 L", ventas:10400000, cantidad:1600.0, precio_uni_prom:6500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV NITRUM 36", formato:"20 L", ventas:2080000, cantidad:640.0, precio_uni_prom:3250.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOTENS", formato:"5 L", ventas:700000, cantidad:35.0, precio_uni_prom:20000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV FRUCTUS", formato:"5 L", ventas:35000, cantidad:5.0, precio_uni_prom:7000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV NITRUM 36", formato:"5 L", ventas:32500, cantidad:5.0, precio_uni_prom:6500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODENPRO FOSKA", formato:"20 L", ventas:726400, cantidad:200.0, precio_uni_prom:3632.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT CONC.", formato:"200 ML", ventas:12404, cantidad:2.0, precio_uni_prom:6202.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE", formato:"200 L (tier)", ventas:103785.0, cantidad:8528.0, precio_uni_prom:12.1699, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:12.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ALGAP 30", formato:"20 L (tier)", ventas:960.0, cantidad:100.0, precio_uni_prom:9.6, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MICRO MIX", formato:"1000 L (tier)", ventas:3149.0, cantidad:470.0, precio_uni_prom:6.7, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"REGALIA MAX", formato:"?", ventas:52504.0, cantidad:1576.0, precio_uni_prom:33.3147, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV MAX FULVIC 45%", formato:"1000 L (tier)", ventas:2752.0, cantidad:1020.0, precio_uni_prom:2.698, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2.2, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS ZINC MANGANESO", formato:"20 L (tier)", ventas:480.0, cantidad:80.0, precio_uni_prom:6.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5.8, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE", formato:"1000 L (tier)", ventas:94884.0, cantidad:8800.0, precio_uni_prom:10.7823, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV AMIN", formato:"200 L (tier)", ventas:1265.0, cantidad:170.0, precio_uni_prom:7.4412, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"200 L (tier)", ventas:24077.5, cantidad:1735.0, precio_uni_prom:13.8775, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:12.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"200 L (tier)", ventas:9596.0, cantidad:2140.0, precio_uni_prom:4.4841, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"REGALIA", formato:"?", ventas:9712.0, cantidad:244.0, precio_uni_prom:39.8033, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV CYTO PRIME", formato:"200 L (tier)", ventas:4693.0, cantidad:247.0, precio_uni_prom:19.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:17.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV CYTO PRIME", formato:"20 L (tier)", ventas:741.0, cantidad:39.0, precio_uni_prom:19.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:19.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS NUTRI MIX", formato:"1 L (tier)", ventas:17.0, cantidad:2.0, precio_uni_prom:8.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"20 L (tier)", ventas:1188.4, cantidad:228.0, precio_uni_prom:5.2123, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"1000 L (tier)", ventas:7587.4, cantidad:1331.0, precio_uni_prom:5.7005, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS CALCIO", formato:"200 L (tier)", ventas:1126.4, cantidad:256.0, precio_uni_prom:4.4, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3.8, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS BORO", formato:"20 L (tier)", ventas:1150.0, cantidad:230.0, precio_uni_prom:5.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ALGAP 30", formato:"200 L (tier)", ventas:8632.0, cantidad:828.0, precio_uni_prom:10.4251, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE", formato:"20 L (tier)", ventas:5676.0, cantidad:506.0, precio_uni_prom:11.2174, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:13.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"REGALIA MAXX", formato:"?", ventas:99001.64, cantidad:2857.0, precio_uni_prom:34.6523, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV HUMIC ROOT", formato:"200 L (tier)", ventas:840.0, cantidad:240.0, precio_uni_prom:3.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS ZINC", formato:"200 L (tier)", ventas:3150.0, cantidad:420.0, precio_uni_prom:7.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6.8, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV MOVE", formato:"1000 L (tier)", ventas:5477.5, cantidad:626.0, precio_uni_prom:8.75, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV MOVE", formato:"20 L (tier)", ventas:280.0, cantidad:32.0, precio_uni_prom:8.75, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"1000 L (tier)", ventas:19236.0, cantidad:1528.0, precio_uni_prom:12.589, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:11.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV AMIN SUGAR", formato:"20 L (tier)", ventas:200.0, cantidad:20.0, precio_uni_prom:10.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SIL FORTE - 20LTS", formato:"?", ventas:3285.0, cantidad:900.0, precio_uni_prom:3.65, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV BIOSOLARIS", formato:"200 L (tier)", ventas:23500.0, cantidad:1720.0, precio_uni_prom:13.6628, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:16.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"20 L (tier)", ventas:1040.0, cantidad:80.0, precio_uni_prom:13.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:13.8, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS HIERRO", formato:"200 L (tier)", ventas:600.0, cantidad:80.0, precio_uni_prom:7.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV AMIN", formato:"20 L (tier)", ventas:320.0, cantidad:40.0, precio_uni_prom:8.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4.2, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE -", formato:"?", ventas:91.25, cantidad:25.0, precio_uni_prom:3.65, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"ECKLOMOON", formato:"?", ventas:7080.0, cantidad:1600.0, precio_uni_prom:4.425, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV BIOSOLARIS", formato:"1 L (tier)", ventas:26.0, cantidad:2.0, precio_uni_prom:13.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:20.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV BIOSOLARIS", formato:"20 L (tier)", ventas:234.0, cantidad:18.0, precio_uni_prom:13.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:17.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"ULTIMATE MAGNESIO", formato:"?", ventas:2140.0, cantidad:530.0, precio_uni_prom:4.0377, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MICRO MIX", formato:"200 L (tier)", ventas:850.0, cantidad:100.0, precio_uni_prom:8.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"ALGAEPRO", formato:"?", ventas:1000.0, cantidad:200.0, precio_uni_prom:5.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"NAMINPRO", formato:"?", ventas:1687.4, cantidad:520.0, precio_uni_prom:3.245, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS HIERRO", formato:"20 L (tier)", ventas:375.0, cantidad:50.0, precio_uni_prom:7.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ZINC", formato:"?", ventas:2250.0, cantidad:300.0, precio_uni_prom:7.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"N- AMIN PRO", formato:"?", ventas:660.0, cantidad:240.0, precio_uni_prom:2.75, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"LST AV AMIN", formato:"?", ventas:500.0, cantidad:100.0, precio_uni_prom:5.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"ALGA E PRO", formato:"?", ventas:1500.0, cantidad:300.0, precio_uni_prom:5.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"TS AV MAX FULVIC", formato:"?", ventas:600.0, cantidad:200.0, precio_uni_prom:3.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV HUMIC ROOT", formato:"1000 L (tier)", ventas:18000.0, cantidad:10000.0, precio_uni_prom:1.8, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"SILFORTE", formato:"?", ventas:6160.0, cantidad:540.0, precio_uni_prom:11.4074, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SIFORTE", formato:"?", ventas:2200.0, cantidad:200.0, precio_uni_prom:11.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"LST AV SILFORTE", formato:"?", ventas:810.0, cantidad:60.0, precio_uni_prom:13.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" }
  ];

  var rentabilidad = {
    alertas_nivel1: [],
    alertas_nivel2: [],
    impacto_clp:    0,
    skus_bajo_piso_chile: 0,
    skus_bajo_piso_peru:   0,
    skus_sin_costo_chile: 187,
    skus_sin_costo_peru:   50
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
