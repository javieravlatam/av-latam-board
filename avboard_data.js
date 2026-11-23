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
 *   Chile ventas → 17/11/2026
 *   Chile CxC    → 19/11/2026 (2 entidades)
 *   Perú ventas  → 19/11/2026
 *   Perú CxC     → 27/10/2026
 *
 * Actualizado: 2026-11-23
 */

var AVBOARD = (function() {

  var meta = {
    version:      '2026-11-23',
    tc_clp_usd:   950.0,
    meta_mn:      0.25,
    cortes: {
      chile_ventas: '17/11/2026',
      chile_cxc:    '19/11/2026',
      peru_ventas:  '19/11/2026',
      peru_cxc:     '27/10/2026'
    },
    meses: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  };

  var grupo = {
    ytd_usd:      1661867,
    ytd_clp:      1578774067,
    chile_ytd_usd: 898245,
    peru_ytd_usd:  763622,
    rtc_activos:  12,
    mn_chile:     0.179,
    mn_peru:      null,
    // IEC Grupo ponderado (Fase 7): Σvne/Σvpt across countries con datos de piso.
    // Peru excluido hasta tener precio_piso por transacción. Nota: valor < 1.0 = bajo piso.
    iec_grupo: 1.0736,
    iec_grupo_nota: 'Chile solamente — Perú sin precio piso por transacción',
    iec_grupo_vne: 597280282,
    iec_grupo_vpt: 556309700
  };

  var chile_ventas = {
    ytd_5m:          853333167,
    ytd_4m:          265380205,
    mayo_parcial:    52527246,
    ppto_anual:      861321350,
    ppto_4m:         213591350,
    ppto_5m:         774621350,
    cumplimiento_4m: 1.2425,
    cumplimiento_5m: 1.1016,
    cumplimiento_t1: 1.0528,
    mensual_real:      [87963014, 35651978, 52370709, 89394504, 60181659, 40410263, 32990397, 52452730, 247288327, 102102340, 52527246, 0],
    mensual_real_2025: [61542300, 57866927, 38859549, 44207090, 131497893, 36794291, 33920027, 75002645, 101082901, 134545170, 43630394, 6994835],
    mensual_ppto:      [83558032, 41601950, 42000000, 46431368, 51000000, 49730000, 62800000, 76500000, 110800000, 112700000, 97500000, 86700000],
    rtc_real_t1:   {
      caroca: 52854308,
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
      caroca: [14551923, 6389076, 31913309, 10171393, 9822200, 23594020, 4533797, 26156190, 85033978, 42935480, 10358646, 0],
      encina: [13510783, 7262717, 6819022, 2252517, 8815784, 486243, 0, 151120, 182395, 124020, 0, 0],
      laratro: [37027580, 10378585, 5487150, 62348094, 18073675, 5077000, 10867000, 15784570, 91338168, 30140340, 19974600, 0],
      munoz: [2195728, 765600, 1274728, 0, 0, 0, 0, 24000, 0, 0, 0, 0],
      velasquez: [14491000, 9912000, 5196500, 14622500, 23260000, 10923000, 17296000, 10336850, 69223786, 19959000, 18844000, 0],
      veverka: [6186000, 944000, 1680000, 0, 0, 0, 293600, 0, 1510000, 8868500, 3350000, 0]
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
      total: 1.074,
      velasquez: 1.051,
      laratro: 1.014,
      caroca: 1.236,
      encina: 1.034,
      veverka: 1.345,
      munoz: 1.086,
      impacto_potencial_clp: 187006755,
      vne_total: 597280282,
      vpt_total: 556309700,
      iec_mensual: {
        total:     [1.0867, 1.0062, 1.1115, 0.9167, 0.8784, 1.1987, 1.1132, 1.3472, 1.1105, 1.0594, 1.1594, null],
        velasquez: [0.9482, 0.9433, 1.1398, 0.8487, 0.8697, 1.1360, 1.0581, 1.0529, 1.1871, 1.1174, 1.1162, null],
        laratro:   [1.1355, 1.0202, 1.0745, 0.9263, 0.8693, 1.3136, 1.1982, 1.5852, 0.9426, 0.9572, 1.1528, null],
        caroca:    [1.1297, 1.0259, 1.1120, 1.3000, 1.1515, 1.2322, 1.1146, 1.4065, 1.2429, 1.1513, 1.1530, null],
        encina:    [0.9874, 1.0384, 1.2057, 0.9826, 0.9946, 0.9606, null, 1.0642, 1.0621, 1.1678, null, null],
        veverka:   [1.3988, 1.1238, 1.1200, null, null, null, 1.6561, null, null, 1.3187, 1.5367, null],
        munoz:     [1.1782, 1.3671, 0.8877, null, null, null, null, 1.2000, null, null, null, null]
      }
    },
    mn_real:  0.179,
    mn_meta:  0.250,
    rtc_prod_vendedor: {"laratro": {"ALGAP 30 - 20 L": 544000, "AV ALGAP 30 - 1 L": 47200, "AV ALGAP 30 - 20 L": 22259080, "AV ALGAP 30 - 5 L": 221000, "AV AMIN": 2177870, "AV AMIN - 20 L": 4388800, "AV AMIN - 5 L": 74000, "AV AMIN SUGAR - 1 L": 10957, "AV AMIN SUGAR - 20 L": 4624599, "AV AMIN SUGAR - 5 L": 120287, "AV BALANCE": 4697666, "AV BALANCE - 1 L": 15000, "AV BALANCE - 20 L": 15512000, "AV BALANCE - 5 L": 947500, "AV BIO FOLIAR": 1684446, "AV BIO MYCOFORCE - 250 GR": 38000, "AV BIOSOLARIS - 1 L": 57800, "AV BIOSOLARIS - 5 L": 65000, "AV BIOVECA FOLIAR - 250 GR": 1549000, "AV BIOVECA INVERNAL - 250 GR": 11536000, "AV BIOVECA NEMA OFF - 500 GR": 286000, "AV BIOVECA PRADERAS - 250 GR": 2813000, "AV BIOVECA RAIZ - 500 GR": 1218425, "AV BLOOM": 7689923, "AV BLOOM - 1 L": 35800, "AV BLOOM - 20 L": 7212000, "AV BLOOM - 5 L": 324000, "AV CYTO PRIME": 2113547, "AV CYTO PRIME - 1 L": 142500, "AV CYTO PRIME - 20 L": 3208000, "AV CYTO PRIME - 5 L": 1270500, "AV FRUCTUS - 5 L": 135000, "AV HUMIC ROOT - 1000 L": 21400000, "AV HUMIC ROOT - 20 L": 932000, "AV HUMIC ROOT - 200 L": 2110000, "AV MAX FULVIC 45% - 1000 L": 2600000, "AV MAX FULVIC 45% - 20 L": 1384000, "AV MAX FULVIC 45% - 200 L": 9622000, "AV MAX FULVIC 45% - 5 L": 72500, "AV MAX GREEN GUARDIAN - 20 L": 450000, "AV MICROMIX X 20LT": 96000, "AV MOVE": 3579172, "AV MOVE - 1 L": 30000, "AV MOVE - 20 L": 36384000, "AV MOVE - 5 L": 585000, "AV MOVE X 1LT": 7500, "AV MOVE X 20LT": 1800000, "AV MOVE X 5LT": 37500, "AV MÁXIMO FULVICO 45% - 200 L": 580000, "AV NITRUM 36 - 5 L": 32500, "AV PLUS BORO": 647353, "AV PLUS BORO - 1 L": 116200, "AV PLUS BORO - 20 L": 1712920, "AV PLUS BORO - 200 L": 2720000, "AV PLUS BORO - 5 L": 247250, "AV PLUS CALCIO - 1 L": 121100, "AV PLUS CALCIO - 1000 L": 3250000, "AV PLUS CALCIO - 20 L": 4041000, "AV PLUS CALCIO - 200 L": 3440000, "AV PLUS CALCIO - 5 L": 128850, "AV PLUS CALCIO BORO": 1728103, "AV PLUS CALCIO BORO - 20 L": 547920, "AV PLUS CALCIO BORO - 5 L": 59175, "AV PLUS HIERRO - 200 L": 680000, "AV PLUS MACRO FRUIT": 2866936, "AV PLUS MACRO FRUIT - 1 L": 8400, "AV PLUS MACRO FRUIT - 20 L": 5572000, "AV PLUS MACRO FRUIT - 5 L": 111000, "AV PLUS MAGNESIO": 2169729, "AV PLUS MAGNESIO - 1 L": 6450, "AV PLUS MAGNESIO - 20 L": 9982600, "AV PLUS MAGNESIO - 200 L": 680000, "AV PLUS MAGNESIO - 5 L": 110250, "AV PLUS MANGANESO - 1 L": 21000, "AV PLUS MANGANESO - 1000 L": 2850000, "AV PLUS MANGANESO - 20 L": 4054000, "AV PLUS MANGANESO - 200 L": 1360000, "AV PLUS MANGANESO - 5 L": 72000, "AV PLUS MICRO MIX - 1 L": 5500, "AV PLUS MICRO MIX - 20 L": 3091470, "AV PLUS MICRO MIX - 5 L": 384040, "AV PLUS NUTRI MIX - 1 L": 109620, "AV PLUS NUTRI MIX - 20 L": 3101400, "AV PLUS NUTRI MIX - 5 L": 50000, "AV PLUS POTASIO": 1643069, "AV PLUS POTASIO - 1 L": 2450, "AV PLUS POTASIO - 1000 L": 3000000, "AV PLUS POTASIO - 20 L": 13129712, "AV PLUS POTASIO - 5 L": 170250, "AV PLUS ZINC": 893847, "AV PLUS ZINC - 1 L": 120200, "AV PLUS ZINC - 20 L": 2320600, "AV PLUS ZINC - 200 L": 2040000, "AV PLUS ZINC - 5 L": 123000, "AV PLUS ZINC MANGANESO - 1 L": 11252, "AV PLUS ZINC MANGANESO - 20 L": 1283445, "AV PLUS ZINC MANGANESO - 200 L": 928000, "AV PLUS ZINC MANGANESO - 5 L": 65510, "AV ROOT MAX - 1 L": 36000, "AV ROOT MAX - 20 L": 8745900, "AV ROOT MAX - 200 L": 4916000, "AV ROOT MAX - 5 L": 1217250, "AV SILFORTE": 1738037, "AV SILFORTE - 1 L": 70000, "AV SILFORTE - 20 L": 14099652, "AV SILFORTE - 200 L": 3920000, "AV SILFORTE - 5 L": 1024000, "AV-AMIN SUGAR - 1 L": 9300, "AV-AMIN SUGAR - 20 L": 62000, "AV-BIOSOLARIS - 1 L": 38400, "AV-BIOSOLARIS - 20 L": 512000, "AV-BIOSOLARIS - 5 L": 64000, "AV-SILFORTE - 20 L": 272000, "AV15 40-20 - 1 L": 81600, "AV15 40-20 - 20 L": 1291340, "AV15 40-20 - 5 L": 40810, "BIOVECA FOLIAR - 250 GRS": 56000, "BIOVECA FOLIAR 250 GRS": 196000, "CYTOPRIME": 209000, "PLANCHA AV PLUS - 200 L": 680000, "VECA HUMIC ROOT - 20 L": 990000, "VECA MICROMIX - 20 L": 440000, "VECA MOVE - 20 L": 2504000, "VECA PLUS MAGNESIO - 20 L": 510000, "VECA PLUS POTASIO - 20 L": 408000, "VECA ROOT MAX - 20 L": 630000, "VECASIL FORTE - 20 L": 1008000, "VECASIL FORTE X 20LT": 228800}, "velasquez": {"AV ALGAP 30 - 1 L": 52500, "AV ALGAP 30 - 1000 L": 6800000, "AV ALGAP 30 - 20 L": 5026000, "AV ALGAP 30 - 200 L": 1400000, "AV ALGAP 30 - 5 L": 278750, "AV AMIN - 1 L": 37800, "AV AMIN - 20 L": 395000, "AV AMIN - 5 L": 63000, "AV AMIN SUGAR - 1000 L": 15500000, "AV AMIN SUGAR - 20 L": 9527000, "AV AMIN SUGAR - 200 L": 8590000, "AV AMIN SUGAR - 5 L": 529500, "AV AMINSUGAR - 20 L": 255000, "AV BALANCE - 1 L": 67200, "AV BALANCE - 20 L": 11960000, "AV BALANCE - 200 L": 2600000, "AV BALANCE - 5 L": 1314500, "AV BIOSOLARIS - 20 L": 260000, "AV BIOSOLARIS - 5 L": 65000, "AV BIOVECA FOLIAR - 250 GR": 2855000, "AV BIOVECA INVERNAL - 250 GR": 12630000, "AV BIOVECA INVIERNO - 250 GR": 320000, "AV BIOVECA NEMA OFF - 500 GR": 64000, "AV BIOVECA RAIZ - 500 GR": 2982000, "AV BLOOM - 1 L": 66000, "AV BLOOM - 20 L": 4430000, "AV BLOOM - 5 L": 1247650, "AV CYTO NUT - 20 L": 2400000, "AV CYTO NUT - 200 L": 16000000, "AV CYTO PRIME - 1 L": 66046, "AV CYTO PRIME - 20 L": 13040400, "AV CYTO PRIME - 200 L": 12000000, "AV CYTO PRIME - 5 L": 1425220, "AV HUMIC ROOT - 1000 L": 8600000, "AV HUMIC ROOT - 20 L": 3396000, "AV HUMIC ROOT - 200 L": 6700000, "AV HUMIC ROOT - 5 L": 20000, "AV HUMIC ROOT X 20LT": 100000, "AV MAX FULVIC - 20 L": 150000, "AV MAX FULVIC 45% - 20 L": 6020000, "AV MAX FULVIC 45% - 5 L": 35000, "AV MOVE - 1 L": 10000, "AV MOVE - 20 L": 5930000, "AV MOVE - 5 L": 765000, "AV NITRUM 36 - 20 L": 600000, "AV PLUS BORO - 1 L": 128400, "AV PLUS BORO - 20 L": 1445000, "AV PLUS BORO - 5 L": 195000, "AV PLUS CALCIO - 1 L": 12800, "AV PLUS CALCIO - 20 L": 3848000, "AV PLUS CALCIO - 200 L": 1780000, "AV PLUS CALCIO - 5 L": 254000, "AV PLUS HIERRO - 20 L": 80000, "AV PLUS MAGNESIO - 1 L": 38400, "AV PLUS MAGNESIO - 20 L": 600000, "AV PLUS MAGNESIO - 5 L": 219000, "AV PLUS MICRO MIX - 20 L": 2006000, "AV PLUS MICRO MIX - 200 L": 900000, "AV PLUS MICRO MIX - 5 L": 532500, "AV PLUS NUTRI MIX - 1 L": 19500, "AV PLUS NUTRI MIX - 20 L": 500000, "AV PLUS NUTRI MIX - 200 L": 569970, "AV PLUS NUTRI MIX - 5 L": 191000, "AV PLUS POTASIO - 1 L": 25600, "AV PLUS POTASIO - 20 L": 3872000, "AV PLUS POTASIO - 200 L": 550000, "AV PLUS POTASIO - 5 L": 449000, "AV PLUS ZINC - 1 L": 132900, "AV PLUS ZINC - 20 L": 1958000, "AV PLUS ZINC - 200 L": 550000, "AV PLUS ZINC - 5 L": 235000, "AV ROOT MAX - 20 L": 5250000, "AV ROOT MAX - 200 L": 1500000, "AV ROOT MAX - 5 L": 847500, "AV ROOT MAX X 20LT": 160000, "AV SILFORTE - 20 L": 8380000, "AV SILFORTE - 200 L": 3225000, "AV SILFORTE - 5 L": 742500, "AV15 40-20 - 1 L": 156000, "AV15 40-20 - 20 L": 1203000, "AV15 40-20 - 5 L": 224000, "BIOTENS - 20 L": 1200000, "BIOVECA FOLIAR 250 GR": 35000, "Prodructos de 1 litro": 96000, "VECA AMIN SUGAR - 20 L": 130000, "VECA MAX FULVIC 45% - 20 L": 1250000, "VECA PLUS BORO - 20 L": 760000, "VECA PLUS ZINC - 20 L": 760000, "VECA ROOT MAX - 20 L": 160000, "VECASIL FORTE - 20 L": 320000}, "caroca": {"A5 - 5 L": 1760000, "AV ALGAP 30 - 1 L": 90126, "AV ALGAP 30 - 20 L": 11618000, "AV ALGAP 30 - 5 L": 198295, "AV AMIN - 1 L": 74892, "AV AMIN - 20 L": 3991880, "AV AMIN - 5 L": 339091, "AV AMIN SUGAR - 20 L": 178200, "AV AMIN SUGAR - 5 L": 665850, "AV BALANCE - 1 L": 601875, "AV BALANCE - 20 L": 4370000, "AV BALANCE - 5 L": 1758045, "AV BIOPOTASICO - 1 L": 66000, "AV BIOPOTASICO - 20 L": 400000, "AV BIOPOTASICO - 5 L": 360000, "AV BIOVECA FOLIAR - 250 GR": 2107882, "AV BIOVECA INVERNAL - 250 GR": 5942250, "AV BIOVECA INVIERNO - 250 GR": 3010000, "AV BIOVECA NEMA OFF - 500 GR": 950340, "AV BIOVECA PRADERAS - 250 GR": 662408, "AV BIOVECA RAIZ - 500 GR": 3867418, "AV BLOOM - 1 L": 413094, "AV BLOOM - 20 L": 1213200, "AV BLOOM - 5 L": 1184912, "AV CYTO PRIME - 1 L": 1036384, "AV CYTO PRIME - 20 L": 800000, "AV CYTO PRIME - 5 L": 3474512, "AV HUMIC ROOT - 20 L": 10608520, "AV HUMIC ROOT - 5 L": 40000, "AV MAX FULVIC 45% - 20 L": 4118254, "AV MAX FULVIC 45% - 200 L": 720000, "AV MAX FULVIC 45% - 5 L": 217500, "AV MOVE - 1 L": 283200, "AV MOVE - 20 L": 4336000, "AV MOVE - 5 L": 915107, "AV NITRUM 36 - 20 L": 2160000, "AV PLUS BORO - 1 L": 309882, "AV PLUS BORO - 1000 L": 7500000, "AV PLUS BORO - 20 L": 615000, "AV PLUS BORO - 200 L": 1500000, "AV PLUS BORO - 5 L": 379965, "AV PLUS CALCIO - 1 L": 490658, "AV PLUS CALCIO - 20 L": 3577071, "AV PLUS CALCIO - 5 L": 765537, "AV PLUS CALCIO BORO - 1 L": 115867, "AV PLUS CALCIO BORO - 20 L": 1736000, "AV PLUS CALCIO BORO - 5 L": 284221, "AV PLUS MACRO FRUIT - 1 L": 225000, "AV PLUS MACRO FRUIT - 20 L": 670540, "AV PLUS MACRO FRUIT - 5 L": 105000, "AV PLUS MAGNESIO - 1 L": 251776, "AV PLUS MAGNESIO - 20 L": 5473600, "AV PLUS MAGNESIO - 5 L": 167670, "AV PLUS MANGANESO - 1 L": 15000, "AV PLUS MANGANESO - 20 L": 235360, "AV PLUS MANGANESO - 5 L": 50000, "AV PLUS MICRO MIX - 1 L": 127500, "AV PLUS MICRO MIX - 20 L": 1552000, "AV PLUS MICRO MIX - 5 L": 100215, "AV PLUS NP MIX - 5 L": 42500, "AV PLUS NUTRI MIX - 1 L": 98848, "AV PLUS NUTRI MIX - 20 L": 559440, "AV PLUS NUTRI MIX - 5 L": 387835, "AV PLUS POTASIO - 1 L": 246016, "AV PLUS POTASIO - 20 L": 9465591, "AV PLUS POTASIO - 5 L": 306437, "AV PLUS ZINC - 1 L": 235081, "AV PLUS ZINC - 20 L": 2533200, "AV PLUS ZINC - 5 L": 418700, "AV ROOT MAX - 1 L": 340332, "AV ROOT MAX - 20 L": 12653802, "AV ROOT MAX - 5 L": 647389, "AV SILFORTE - 1 L": 820800, "AV SILFORTE - 20 L": 4122000, "AV SILFORTE - 5 L": 90000, "AV15 40-20 - 1 L": 40026, "AV15 40-20 - 20 L": 326900, "AV15 40-20 - 5 L": 119848, "BALANCE 500CC GATILLO": 16805, "BIOBODEN CRYOPHILE - 250 GRS": 1190000, "BIOPOTASICO 500CC GATILLO": 16805, "BIOTENS - 20 L": 13200000, "BIOTENS - 5 L": 700000, "BIOVECA FOLIAR": 32707, "BIOVECA NEMAOFF - 500 GR": 121080, "BIOVECA RAIZ - 500 GRS": 360000, "BLOOM MAX - 20 L": 1000000, "BODEN PRO BORO - 20 L": 205400, "BODEN PRO ZINC - 20 L": 205400, "BODENPRO CALCIO - 20 L": 1382400, "BODENPRO FOSKA - 20 L": 726400, "BODENPRO MAGNESIO - 20 L": 1507840, "BODENPRO POTASIO - 20 L": 3780000, "CRYOPHILE - 250 G": 1700000, "CRYOPHILE - 250 GR": 15356000, "FOLIBAC BIO INVIERNO - 250 G": 15900000, "FOLIBAC FLY - 250 G": 1325000, "FOLIBAC SOIL - 500 GR": 262500, "FUNGISTOP 500CC GATILLO": 16805, "GREEN PLANT 500CC GATILLO": 16805, "NUTRAMIX 500CC GATILLO": 16805, "NUTRI MIX - 5 L": 30935, "PROBIORGAN IRG - 1 L": 1140000, "PROTECT PRADERAS - 250 G": 44610000, "QUARTEC CRIO SACHET 250 GRS": 1000000, "QUARTEC FILOSFERA - 250 GR": 6200000, "RAIZ 500CC GATILLO": 16805, "SILFORTEM 500 CC GATILLO": 16805, "SILIK FORTE - 20 L": 5200000, "SOLUFOS - 500 GR": 5000000, "TRIHORGAN - 1 L": 1320000, "VECA AMIN - 1 L": 17679, "VECA AMIN - 5 L": 30275, "VECA BALANCE (CALIBRE MAX) - 1 L": 328500, "VECA BALANCE (CALIBRE MAX) - 20 L": 1014000, "VECA BALANCE (CALIBRE MAX) - 5 L": 1417500, "VECA BALANCE - 1 L": 30660, "VECA BALANCE - 5 L": 198450, "VECA BLOOM - 1 L": 34160, "VECA BLOOM - 5 L": 80500, "VECA MAX FULVIC 45% - 20 L": 172203, "VECA MOVE - 5 L": 53038, "VECA PLUS BORO - 5 L": 22050, "VECA PLUS CALCIO - 1 L": 174300, "VECA PLUS CALCIO - 20 L": 89689, "VECA PLUS CALCIO - 5 L": 247071, "VECA PLUS CALCIO BORO - 1 L": 54180, "VECA PLUS CALCIO BORO - 20 L": 86800, "VECA PLUS HIERRO - 1 L": 5810, "VECA PLUS MAGNESIO - 20 L": 89689, "VECA PLUS POTASIO - 1 L": 203350, "VECA PLUS POTASIO - 20 L": 337489, "VECA PLUS POTASIO - 5 L": 441000, "VECA PLUS ZINC - 1 L": 17430, "VECA PLUS ZINC - 5 L": 22050, "XCARATOR - 20 L": 2483000}, "encina": {"AV ALGAP 30 - 1 L": 45000, "AV ALGAP 30 - 20 L": 462775, "AV ALGAP 30 - 5 L": 102572, "AV AMIN - 1 L": 278790, "AV AMIN - 20 L": 196520, "AV AMIN - 5 L": 137325, "AV AMIN SUGAR - 20 L": 220000, "AV AMIN SUGAR - 5 L": 105195, "AV AMIN X 1 LT": 8025, "AV AMIN X 5 LT": 40125, "AV BALANCE - 1 L": 245023, "AV BALANCE - 20 L": 2356360, "AV BALANCE - 5 L": 713790, "AV BALANCE X 20LT": 396900, "AV BIOSOLARIS - 1 L": 133475, "AV BIOVECA FOLIAR - 250 GR": 1505000, "AV BIOVECA INVERNAL - 250 GR": 8006002, "AV BIOVECA RAIZ - 500 GR": 34650, "AV BLOOM - 1 L": 214284, "AV BLOOM - 20 L": 157500, "AV BLOOM - 5 L": 206365, "AV HUMIC ROOT - 1 L": 12320, "AV HUMIC ROOT - 20 L": 358000, "AV HUMIC ROOT - 200 L": 1000000, "AV MAX FULVIC 45% - 1 L": 5294, "AV MAX FULVIC 45% - 5 L": 20550, "AV MOVE - 1 L": 110260, "AV MOVE - 20 L": 2632649, "AV MOVE - 5 L": 617055, "AV MOVE X 20LT": 158760, "AV PLUS BORO - 1 L": 89585, "AV PLUS BORO - 20 L": 374360, "AV PLUS BORO - 5 L": 50400, "AV PLUS CALCIO - 1 L": 134562, "AV PLUS CALCIO - 20 L": 80000, "AV PLUS CALCIO - 5 L": 227326, "AV PLUS CALCIO BORO - 1 L": 63746, "AV PLUS CALCIO BORO - 20 L": 152206, "AV PLUS CALCIO BORO - 5 L": 149200, "AV PLUS HIERRO - 1 L": 6225, "AV PLUS HIERRO - 5 L": 35400, "AV PLUS MAGNESIO - 1 L": 143992, "AV PLUS MAGNESIO - 20 L": 1460880, "AV PLUS MAGNESIO - 5 L": 246825, "AV PLUS MAGNESIO x 5 LT": 20000, "AV PLUS MANGANESO - 5 L": 24790, "AV PLUS MICRO MIX - 1 L": 49668, "AV PLUS MICRO MIX - 20 L": 1078000, "AV PLUS MICRO MIX - 5 L": 156900, "AV PLUS NUTRI MIX - 1 L": 379092, "AV PLUS NUTRI MIX - 20 L": 164000, "AV PLUS POTASIO - 1 L": 669723, "AV PLUS POTASIO - 20 L": 2939780, "AV PLUS POTASIO - 5 L": 551645, "AV PLUS POTASIO x 5 LT": 20000, "AV PLUS ROOT MAX x 5LT": 49750, "AV PLUS ZINC - 1 L": 46698, "AV PLUS ZINC - 5 L": 35400, "AV PLUS ZINC MANGANESO - 20 L": 684120, "AV ROOT MAX - 1 L": 112624, "AV ROOT MAX - 20 L": 149600, "AV SILFORTE - 1 L": 98087, "AV SILFORTE - 20 L": 3958120, "AV SILFORTE - 5 L": 198750, "AV15 40-20 - 1 L": 286290, "AV15 40-20 - 20 L": 213700, "AV15 40-20 - 5 L": 511595, "BIOVECA FOLIAR - 250 GR": 1925000, "BIOVECA FOLIAR - 250 GRS": 875000, "BIOVECA NEMAOFF 500 GRS": 35000, "PK DEFENDER MAX X 5LT": 27150, "VECA AMIN - 5 L": 75900, "VECA CALCIO BORO - 20 L": 228309, "VECA PLUS CALCIO BORO\tX 5LT": 47510, "VECA PLUS CALCIO X 1LT": 27150, "VECA PLUS CALCIO X 5LT": 20365, "VECA PLUS MAGNESIO X 1LT": 38010, "VECA PLUS MAGNESIO X 5LT": 20365, "VECA PLUS POTASIO X 1LT": 59730, "VECA PLUS POTASIO X 5LT": 81460, "VECA PLUS ZINC X 5 LT": 20365, "VECA ROOT MAX X 1LT": 29684}, "veverka": {"7": 104800, "AV ALGAP 30 - 20 L": 3380000, "AV ALGAP 30 x 20 LT": 1314000, "AV AMIN - 20 L": 2358000, "AV BIOVECA FOLIAR - 250 GR": 900000, "AV BIOVECA INVERNAL - 250 GR": 950000, "AV BIOVECA RAIZ - 500 GR": 1008000, "AV BLOOM - 20 L": 474000, "AV MAX FULVIC 45% - 20 L": 78000, "AV MAX FULVIC 45% - 200 L": 3042000, "AV MOVE - 20 L": 1512000, "AV MOVE - 20 L AVCH-110": 1008000, "AV PLUS AMIN x 20 LT": 936000, "AV PLUS CALCIO - 20 L": 480000, "AV PLUS CALCIO BORO - 5 L": 24500, "AV PLUS HIERRO - 20 L": 240000, "AV PLUS MAGNESIO - 20 L": 494400, "AV PLUS MAGNESIO x 20 LT": 94000, "AV PLUS POTASIO x 20 LT": 752000, "AV PLUS ZINC - 20 L": 94400, "AV ROOT MAX - 20 L": 498000, "AV ROOT MAX x 20 LT": 2670000, "BIOVECA FOLIAR 250 GRS": 420000}, "munoz": {"ALGAP 30 - 1 L": 110100, "AV PLUS CALCIO BORO - 1 L": 162840, "AV PLUS MAGNESIO X 20 LT": 100000, "AV PLUS NP MIX - 1 L": 172200, "AV PLUS NUTRI MIX - 1 L": 73308, "AV PLUS POTASIO - 1 L": 74100, "AV PLUS POTASIO X 20 LT": 100000, "AV ROOT MAX - 1 L": 176280, "AV ROOT MAX - 20 L": 765600, "AV ROOT MAX X 20 LT": 200000, "AV15 40-20 - 20 L": 640000, "PK-DEFEND MAX - 20 L": 560000, "PK-DEFEND MAX - 5 L": 40000, "VECA AMIN - 1 L": 330300, "VECA NUTRI MIX - 1 L": 146160, "VECA PLUS CALCIO BORO - 1 L": 242208, "VECA PLUS MAGNESIO - 1 L": 73392, "VECA PLUS POTASIO - 1 L": 293568}, "almeida": {"AV BIOVECA INVERNAL - 250 GR": 210000, "AV MAX FULVIC 45% - 20 L": 330000}}
  };

  var chile_cxc = {
    corte:    '19/11/2026',
    entidades: 2,
    total:    242267762,
    vencida:  46113159,
    al_dia:   0,
    por_entidad: {
      agrocomercial: {
        nombre: 'Agrocomercial',
        total:  242267762,
        tramos: {
          t90:   39984154,
          t6190: 638435,
          t3160: 5490570,
          t030:  0
        }
      },
      agroveca_chile: {
        nombre: 'Agroveca Chile',
        total:  0,
        tramos: {
          t90:   0,
          t6190: 0,
          t3160: 0,
          t030:  0
        }
      }
    },
    tramos: {
      t90:   39984154,
      t6190: 638435,
      t3160: 5490570,
      t030:  0
    },
    tramos_pct: {
      t90:   0.165,
      t6190: 0.0026,
      t3160: 0.0227,
      t030:  0.0
    },
    por_rtc: {
      laratro: {
        total:   102362445,
        pct:     0.4225,
        vencida: 29196893,
        t90:     208250,
        riesgo: 'CRÍTICO'
      },
      caroca: {
        total:   78839490,
        pct:     0.3254,
        vencida: 7800759,
        t90:     408170,
        riesgo: 'CRÍTICO'
      },
      velasquez: {
        total:   55145944,
        pct:     0.2276,
        vencida: 42437934,
        t90:     39367734,
        riesgo: 'CRÍTICO'
      },
      encina: {
        total:   2656223,
        pct:     0.011,
        vencida: 2194479,
        t90:     0,
        riesgo: 'RIESGO'
      },
      veverka: {
        total:   2441523,
        pct:     0.0101,
        vencida: 518959,
        t90:     0,
        riesgo: 'NORMAL'
      },
      otros: {
        total:   793577,
        pct:     0.0033,
        vencida: 581841,
        t90:     0,
        riesgo: 'RIESGO'
      },
      munoz: {
        total:   28560,
        pct:     0.0001,
        vencida: 28560,
        t90:     0,
        riesgo: 'RIESGO'
      }
    },
    cuentas_criticas: [
      {
        cliente: "AGRICOLA SEMINARIO LIMITADA",
        rtc: "FRANCISCO VELASQUEZ",
        dias: 112,
        monto: 39367734,
        estado: "CRÍTICO",
        alerta: "PRIORIDAD_MAXIMA"
      },
      {
        cliente: "AGRICOLA MARIO ALEJANDRO VIDAL NUNEZ EIRL",
        rtc: "JORGE CAROCA",
        dias: 104,
        monto: 408170,
        estado: "CRÍTICO",
        alerta: "URGENTE"
      },
      {
        cliente: "AGRICOLA SANTA ANDREA LIMITADA",
        rtc: "PABLO LARATRO",
        dias: 109,
        monto: 208250,
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
    ytd_5m:       763622,
    ytd_4m:       307470,
    mayo_parcial: 26555,
    ppto_anual:   1210600,
    ppto_4m:      247291,
    ppto_5m:      1100600,
    ppto_mes_label: 'Nov',
    cumplimiento_4m: 1.2434,
    cumplimiento_5m: 0.6938,
    mensual_real:      [90672, 43016, 87967, 85815, 96473, 51180, 34646, 65806, 82736, 98755, 26555, 0],
    mensual_real_2025: [59128.76, 36687.0, 70947.9, 42486.1, 24250.0, 27780.4, 48123.4, 52993.1, 0, 120639.3, 82518.95, 54009.38],
    mensual_ppto:      [51669, 60148, 27946, 107528, 78467, 103476, 98366, 84000, 178000, 153000, 158000, 110000],
    por_vendedor: {
      aguirre: {
        nombre: "Lizbeth Aguirre",
        ytd:    291434,
        mayo:   17045
      },
      atalaya: {
        nombre: "Omar Atalaya",
        ytd:    89789,
        mayo:   0
      },
      caroca: {
        nombre: "Jorge Caroca",
        ytd:    151508,
        mayo:   8190
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
        ytd:    25165,
        mayo:   1320
      }
    },
    rtc_ppto_anual: {
      atalaya: 240383.3,
      aguirre: 424576.3,
      infante: 193568.0,
      valladares: 90857.5,
      diaz: 167360.0,
      gonzales: 29018.0,
      martha: 65010.0,
      caroca: 0,
      geldres: 0
    },
    rtc_mensual_ppto: {
      aguirre: [12025.0, 10572.5, 10000.0, 16149.3, 13128.5, 7643.7, 25021.0, 30017.2, 100008.0, 70008.4, 90002.7, 40000.0],
      atalaya: [22122.8, 17721.8, 10138.6, 17027.5, 21306.5, 34048.8, 25000.0, 19000.0, 23000.0, 23001.0, 18011.0, 10005.3],
      caroca: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      diaz: [0.0, 0.0, 0.0, 0.0, 0.0, 22300.0, 15000.0, 15000.0, 30040.0, 30005.0, 20010.0, 35005.0],
      geldres: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      gonzales: [1261.0, 1469.0, 2498.0, 1820.0, 1521.0, 2431.0, 8000.0, 0.0, 5009.0, 0.0, 5009.0, 0.0],
      infante: [16259.900000000001, 30163.999999999996, 0.0, 67708.1, 37357.7, 26732.800000000003, 15345.5, 0.0, 0.0, 0.0, 0.0, 0.0],
      martha: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 10005.0, 10005.0, 15000.0, 15000.0, 15000.0],
      valladares: [0.0, 220.8, 5309.8, 4823.0, 5153.0, 10319.4, 10000.0, 10003.5, 10000.0, 15027.0, 10001.0, 10000.0]
    },
    rtc_mensual_real: {
      aguirre: [0, 13884, 28681, 13447, 49431, 11404, 6638, 53346, 39320, 58238, 17045, 0],
      atalaya: [29881, 8108, 20000, 6600, 8400, 12600, 0, 4200, 0, 0, 0, 0],
      caroca: [20440, 4836, 0, 22401, 12314, 5096, 2687, 2160, 34276, 39107, 8190, 0],
      diaz: [0, 0, 0, 6300, 2600, 8320, 240, 4400, 4940, 0, 0, 0],
      gonzales: [600, 0, 96, 0, 0, 6720, 8146, 0, 0, 0, 0, 0],
      infante: [39751, 16188, 38190, 36867, 22328, 0, 5840, 0, 0, 0, 0, 0],
      martha: [0, 0, 0, 0, 0, 0, 0, 0, 4200, 0, 0, 0],
      valladares: [0, 0, 1000, 200, 1400, 7040, 11095, 1700, 0, 1410, 1320, 0]
    },
    iec: {
      total:      1.0131,
      aguirre:    0.9425,
      infante:    1.2753,
      atalaya:    0.9818,
      valladares: 0.8647,
      gonzales:   1.0504,
      navarro:    1.1647,
      diaz:       0.8555,
      vne_total:  377763.96,
      vpt_total:  372876.8,
      impacto_potencial_usd: 4000
    },
    mn_real:  null,
    mn_meta:  0.250,
    rtc_prod_vendedor: {"infante": {"AV SILFORTE": 42372.0, "AV PLUS MICRO MIX": 3149.0, "AV PLUS ZINC MANGANESO": 480.0, "REGALIA MAX": 18240.0, "AV CYTO PRIME": 5434.0, "AV ROOT MAX": 27533.5, "AV PLUS MAGNESIO": 6208.6, "AV AMIN": 985.0, "AV ALGAP 30": 1232.0, "REGALIA": 7840.0, "AV PLUS ZINC": 3150.0, "AV MOVE": 5757.5}, "aguirre": {"AV PLUS MAGNESIO": 14165.2, "AV ALGAP 30": 6400.0, "REGALIA": 1872.0, "AV PLUS NUTRI MIX": 17.0, "AV PLUS CALCIO": 1126.4, "REGALIA MAX": 8290.0, "REGALIA MAXX": 90856.0, "AV SILFORTE": 70427.0, "AV HUMIC ROOT": 36840.0, "AV PLUS BORO": 1150.0, "AV ROOT MAX": 10520.0, "AV PLUS MICRO MIX": 850.0, "AV ZINC": 2250.0, "TS AV MAX FULVIC": 600.0, "AV BIOSOLARIS": 3550.0, "LST AV SILFORTE": 810.0, "SILFORTE": 2840.0, "AV MAX FULVIC 45%": 1716.0, "AV SIFORTE": 2200.0, "AV AMIN SUGAR": 595.0, "BODEN ENERGY": 2100.0, "AV BALANCE": 14.76}, "navarro": {"AV SILFORTE": 4200.0, "AV ALGAP 30": 560.0, "REGALIA MAX": 760.0, "AV MAX FULVIC 45%": 1400.0, "AV ROOT MAX": 7700.0}, "atalaya": {"AV SILFORTE": 64030.0, "REGALIA MAX": 25214.0}, "gonzales": {"AV AMIN": 600.0, "AV SILFORTE": 6816.0, "REGALIA MAXX": 8145.64}, "valladares": {"AV SILFORTE": 18160.0, "AV AMIN SUGAR": 200.0, "AV PLUS HIERRO": 1425.0, "AV ALGAP 30": 1400.0, "LST AV AMIN": 500.0, "HUMIC ROOT. 40 LTS AV MAGENSIO": 600.0}, "diaz": {"AV BIOSOLARIS": 22160.0, "AV SILFORTE": 4640.0}, "martha": {"SILFORTE": 4200.0}, "geldres": {"AV SIL FORTE - 20LTS": 3285.0, "AV SILFORTE -": 91.25, "AV PLUS MAGNESIO": 800.0, "ECKLOMOON": 7080.0, "ULTIMATE MAGNESIO": 2140.0, "ALGAEPRO": 1000.0, "NAMINPRO": 1687.4, "N- AMIN PRO": 660.0, "ALGA E PRO": 9690.0}, "caroca": {"AV SIL FORTE - 20LTS": 3285.0, "AV SILFORTE -": 91.25, "AV PLUS MAGNESIO": 800.0, "ECKLOMOON": 7080.0, "ULTIMATE MAGNESIO": 2140.0, "ALGAEPRO": 1000.0, "NAMINPRO": 1687.4, "N- AMIN PRO": 660.0, "ALGA E PRO": 9690.0}}
  };

  var peru_cxc = {
    "corte": "27/10/2026",
    "total": 173463,
    "supra": 202336,
    "n_documentos": 55,
    "tramos": {
      "no_vencida": 56514,
      "t030": 3104,
      "t3160": 26428,
      "t6190": 27781,
      "t90": 59636
    },
    "tramos_pct": {
      "no_vencida": 0.326,
      "t030": 0.018,
      "t3160": 0.152,
      "t6190": 0.16,
      "t90": 0.344
    },
    "vencida": 116949,
    "por_vendedor": {
      "geldres": {
        "total": 10874,
        "pct": 0.0627,
        "vencida": 10874,
        "t90": 10874,
        "riesgo": "CRÍTICO"
      },
      "atalaya": {
        "total": 9493,
        "pct": 0.0547,
        "vencida": 9493,
        "t90": 9493,
        "riesgo": "CRÍTICO"
      },
      "infante": {
        "total": 4098,
        "pct": 0.0236,
        "vencida": 2871,
        "t90": 2871,
        "riesgo": "CRÍTICO"
      },
      "caroca": {
        "total": 46026,
        "pct": 0.2653,
        "vencida": 44291,
        "t90": 31059,
        "riesgo": "CRÍTICO"
      },
      "aguirre": {
        "total": 94211,
        "pct": 0.5431,
        "vencida": 45060,
        "t90": 5079,
        "riesgo": "CRÍTICO"
      },
      "gonzales": {
        "total": 3600,
        "pct": 0.0208,
        "vencida": 3600,
        "t90": 0,
        "riesgo": "RIESGO"
      },
      "diaz": {
        "total": 4660,
        "pct": 0.0269,
        "vencida": 260,
        "t90": 260,
        "riesgo": "CRÍTICO"
      },
      "valladares": {
        "total": 500,
        "pct": 0.0029,
        "vencida": 500,
        "t90": 0,
        "riesgo": "RIESGO"
      }
    },
    "cuentas_criticas": [
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA PAMPA BAJA S.A.C.",
        "folio": "1150.0",
        "emision": "08/10/2026",
        "vencimiento": "12/08/2026",
        "dias": 76,
        "tramo": "61-90d",
        "monto": 26845.0,
        "estado": "Riesgo"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "AGROCOMERCIAL MABU PERU S.A.C",
        "folio": "923.0",
        "emision": "26/01/2026",
        "vencimiento": "25/06/2026",
        "dias": 124,
        "tramo": "+90d",
        "monto": 14500.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "OMAR ATALAYA",
        "cliente": "AGROFER MJ E.I.R.L.",
        "folio": "671.0",
        "emision": "13/06/2025",
        "vencimiento": "11/10/2025",
        "dias": 381,
        "tramo": "+90d",
        "monto": 9493.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "TERRA MOON S.A.C.",
        "folio": "1068.0",
        "emision": "30/05/2026",
        "vencimiento": "09/03/2026",
        "dias": 232,
        "tramo": "+90d",
        "monto": 7080.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "AGROCOMERCIAL MABU PERU S.A.C",
        "folio": "964.0",
        "emision": "27/02/2026",
        "vencimiento": "27/06/2026",
        "dias": 122,
        "tramo": "+90d",
        "monto": 4836.5,
        "estado": "Crítico"
      },
      {
        "vendedor": "JOSE GELDRES",
        "cliente": "PAODISA S.A.",
        "folio": "579.0",
        "emision": "11/08/2024",
        "vencimiento": "01/07/2025",
        "dias": 483,
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
        "dias": 701,
        "tramo": "+90d",
        "monto": 3546.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "TERRA MOON S.A.C.",
        "folio": "1057.0",
        "emision": "19/05/2026",
        "vencimiento": "09/03/2026",
        "dias": 232,
        "tramo": "+90d",
        "monto": 2502.4,
        "estado": "Crítico"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "AGROCOMERCIAL MABU PERU S.A.C",
        "folio": "1081.0",
        "emision": "06/08/2026",
        "vencimiento": "10/06/2026",
        "dias": 139,
        "tramo": "+90d",
        "monto": 2140.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "CORPORACION AGROLATINA S.A.C",
        "folio": "1025.0",
        "emision": "28/04/2026",
        "vencimiento": "27/07/2026",
        "dias": 92,
        "tramo": "+90d",
        "monto": 2000.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JOSE GELDRES",
        "cliente": "PAODISA S.A.",
        "folio": "509.0",
        "emision": "09/05/2024",
        "vencimiento": "11/04/2024",
        "dias": 929,
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
        "dias": 818,
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
        "dias": 267,
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
        "dias": 199,
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
        "dias": 322,
        "tramo": "+90d",
        "monto": 1005.05,
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
        "dias": 929,
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
        "dias": 818,
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
        "dias": 701,
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
        "dias": 483,
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
        "dias": 381,
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
        "dias": 322,
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
        "dias": 267,
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
        "dias": 259,
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
        "dias": 258,
        "tramo": "+90d",
        "monto": 140.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "TERRA MOON S.A.C.",
        "folio": "1068.0",
        "emision": "30/05/2026",
        "vencimiento": "09/03/2026",
        "dias": 232,
        "tramo": "+90d",
        "monto": 7080.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "TERRA MOON S.A.C.",
        "folio": "1057.0",
        "emision": "19/05/2026",
        "vencimiento": "09/03/2026",
        "dias": 232,
        "tramo": "+90d",
        "monto": 2502.4,
        "estado": "Crítico"
      },
      {
        "vendedor": "SUSAN DIAZ",
        "cliente": "AGRICOLA CAMPO NOBLE S.A.C",
        "folio": "1080.0",
        "emision": "05/06/2026",
        "vencimiento": "10/03/2026",
        "dias": 231,
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
        "dias": 231,
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
        "dias": 229,
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
        "dias": 229,
        "tramo": "+90d",
        "monto": 70.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRO DIRECT S.A.C.",
        "folio": "1233.0",
        "emision": "10/05/2026",
        "vencimiento": "11/04/2026",
        "dias": 199,
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
        "dias": 199,
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
        "dias": 195,
        "tramo": "+90d",
        "monto": 3295.25,
        "estado": "Crítico"
      },
      {
        "vendedor": "nan",
        "cliente": "SERVICIOS BIOINSUMOS PERU SOCIEDAD ANONIMA CERRADA.",
        "folio": "891.0",
        "emision": "22/12/2025",
        "vencimiento": "21/04/2026",
        "dias": 189,
        "tramo": "+90d",
        "monto": 2200.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "AGROCOMERCIAL MABU PERU S.A.C",
        "folio": "1081.0",
        "emision": "06/08/2026",
        "vencimiento": "10/06/2026",
        "dias": 139,
        "tramo": "+90d",
        "monto": 2140.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "OSCAR INFANTE",
        "cliente": "LUNA QUINTANILLA BRYAN ALEXANDER",
        "folio": "981.0",
        "emision": "18/03/2026",
        "vencimiento": "16/06/2026",
        "dias": 133,
        "tramo": "+90d",
        "monto": 522.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "AGROCOMERCIAL MABU PERU S.A.C",
        "folio": "923.0",
        "emision": "26/01/2026",
        "vencimiento": "25/06/2026",
        "dias": 124,
        "tramo": "+90d",
        "monto": 14500.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "AGROCOMERCIAL MABU PERU S.A.C",
        "folio": "964.0",
        "emision": "27/02/2026",
        "vencimiento": "27/06/2026",
        "dias": 122,
        "tramo": "+90d",
        "monto": 4836.5,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "CORPORACION AGROLATINA S.A.C",
        "folio": "1025.0",
        "emision": "28/04/2026",
        "vencimiento": "27/07/2026",
        "dias": 92,
        "tramo": "+90d",
        "monto": 2000.0,
        "estado": "Crítico"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA PAMPA BAJA S.A.C.",
        "folio": "1150.0",
        "emision": "08/10/2026",
        "vencimiento": "12/08/2026",
        "dias": 76,
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
        "dias": 76,
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
        "dias": 59,
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
        "dias": 45,
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
        "dias": 37,
        "tramo": "31-60d",
        "monto": 2200.0,
        "estado": "Alerta"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "AGROCOMERCIAL MABU PERU S.A.C",
        "folio": "1052.0",
        "emision": "26/05/2026",
        "vencimiento": "23/09/2026",
        "dias": 34,
        "tramo": "31-60d",
        "monto": 12.0,
        "estado": "Alerta"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "TERRA MOON S.A.C.",
        "folio": "1033.0",
        "emision": "29/04/2026",
        "vencimiento": "26/09/2026",
        "dias": 31,
        "tramo": "31-60d",
        "monto": 10616.0,
        "estado": "Alerta"
      },
      {
        "vendedor": "PATRICIA VALLADARES",
        "cliente": "AGRICOLA LIMONES CORONADO S.R.L.",
        "folio": "1172.0",
        "emision": "19/08/2026",
        "vencimiento": "18/10/2026",
        "dias": 9,
        "tramo": "0-30d",
        "monto": 500.0,
        "estado": "Normal"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "AGROCOMERCIAL MABU PERU S.A.C",
        "folio": "1098.0",
        "emision": "24/06/2026",
        "vencimiento": "22/10/2026",
        "dias": 5,
        "tramo": "0-30d",
        "monto": 2604.43,
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
        "cliente": "CORPORACION AGROLATINA S.A.C",
        "folio": "1139.0",
        "emision": "30/07/2026",
        "vencimiento": "28/10/2026",
        "dias": -1,
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
        "dias": -5,
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
        "dias": -6,
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
        "dias": -14,
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
        "dias": -14,
        "tramo": "Al día",
        "monto": 1227.2,
        "estado": "Al día"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "AGROCOMERCIAL MABU PERU S.A.C",
        "folio": "1120.0",
        "emision": "14/07/2026",
        "vencimiento": "11/11/2026",
        "dias": -15,
        "tramo": "Al día",
        "monto": 15.0,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "UVICA S.A.C.",
        "folio": "1123.0",
        "emision": "15/07/2026",
        "vencimiento": "12/11/2026",
        "dias": -16,
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
        "dias": -16,
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
        "dias": -17,
        "tramo": "Al día",
        "monto": 1080.0,
        "estado": "Al día"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "AGROCOMERCIAL MABU PERU S.A.C",
        "folio": "1125.0",
        "emision": "17/07/2026",
        "vencimiento": "14/11/2026",
        "dias": -18,
        "tramo": "Al día",
        "monto": 1687.4,
        "estado": "Al día"
      },
      {
        "vendedor": "SUSAN DIAZ",
        "cliente": "BLUEWAY ALLIANCE CORP PERU S.A.C.",
        "folio": "1166.0",
        "emision": "17/08/2026",
        "vencimiento": "15/11/2026",
        "dias": -19,
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
        "dias": -19,
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
        "dias": -25,
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
        "dias": -26,
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
        "dias": -27,
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
        "dias": -29,
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
        "dias": -33,
        "tramo": "Al día",
        "monto": 5760.0,
        "estado": "Al día"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "AGROCOMERCIAL MABU PERU S.A.C",
        "folio": "1170.0",
        "emision": "18/08/2026",
        "vencimiento": "17/12/2026",
        "dias": -51,
        "tramo": "Al día",
        "monto": 10.0,
        "estado": "Al día"
      },
      {
        "vendedor": "JORGE CAROCA",
        "cliente": "AGROCOMERCIAL MABU PERU S.A.C",
        "folio": "1174.0",
        "emision": "24/08/2026",
        "vencimiento": "22/12/2026",
        "dias": -56,
        "tramo": "Al día",
        "monto": 22.5,
        "estado": "Al día"
      },
      {
        "vendedor": "LISBETH AGUIRRE",
        "cliente": "AGRICOLA SAFCO PERU S.A.",
        "folio": "1218.0",
        "emision": "25/09/2026",
        "vencimiento": "24/12/2026",
        "dias": -58,
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
        "dias": -59,
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
        "dias": -59,
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
        "dias": -59,
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
        "dias": -62,
        "tramo": "Al día",
        "monto": 18000.0,
        "estado": "Al día"
      }
    ]
  };

  var productos = [
    { pais:"CL", producto:"AV MOVE", formato:"20 L", ventas:56265409, cantidad:11640.0, precio_uni_prom:4833.8, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"20 L", ventas:31882902, cantidad:5455.0, precio_uni_prom:5844.71, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"20 L", ventas:32388572, cantidad:5710.0, precio_uni_prom:5672.25, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"20 L", ventas:16384520, cantidad:6820.0, precio_uni_prom:2402.42, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"?", ventas:2322547, cantidad:131.0, precio_uni_prom:17729.37, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"20 L", ventas:31004572, cantidad:12780.0, precio_uni_prom:2426.02, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2700, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"20 L", ventas:18805169, cantidad:8860.0, precio_uni_prom:2122.48, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"20 L", ventas:8263470, cantidad:3200.0, precio_uni_prom:2582.33, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"20 L", ventas:44603855, cantidad:11700.0, precio_uni_prom:3812.3, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"250 GR", ventas:12423882, cantidad:773.0, precio_uni_prom:16072.29, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"20 L", ventas:13502457, cantidad:8180.0, precio_uni_prom:1650.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"PK-DEFEND MAX", formato:"20 L", ventas:560000, cantidad:140.0, precio_uni_prom:4000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PK-DEFEND MAX", formato:"5 L", ventas:67150, cantidad:15.0, precio_uni_prom:4476.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"20 L", ventas:772000, cantidad:280.0, precio_uni_prom:2757.14, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:12000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"5 L", ventas:194000, cantidad:20.0, precio_uni_prom:9700.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:13000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOSOLARIS", formato:"1 L", ventas:229675, cantidad:66.0, precio_uni_prom:3479.92, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:14000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"20 L", ventas:14996799, cantidad:6820.0, precio_uni_prom:2198.94, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"1 L", ventas:20257, cantidad:15.0, precio_uni_prom:1350.47, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN", formato:"5 L", ventas:759716, cantidad:145.0, precio_uni_prom:5239.42, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANALISIS FOLIAR CEREZO", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV AMIN", formato:"20 L", ventas:12266200, cantidad:3280.0, precio_uni_prom:3739.7, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"20 L", ventas:12115760, cantidad:5120.0, precio_uni_prom:2366.36, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2900, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"500 GR", ventas:9470493, cantidad:645.0, precio_uni_prom:14682.93, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"ODIN TEBUCONAZOLE 43% LT", formato:"?", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"5 L", ventas:2761889, cantidad:360.0, precio_uni_prom:7671.91, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:9000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV NEMA OFF", formato:"500 GR", ventas:1456420, cantidad:48.0, precio_uni_prom:30342.08, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"5 L", ventas:784110, cantidad:230.0, precio_uni_prom:3409.17, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"5 L", ventas:2019792, cantidad:675.0, precio_uni_prom:2992.28, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"5 L", ventas:6349785, cantidad:721.0, precio_uni_prom:8806.91, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:14000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"1 L", ventas:1244930, cantidad:72.0, precio_uni_prom:17290.69, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:18000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"5 L", ventas:1643149, cantidad:485.0, precio_uni_prom:3387.94, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"5 L", ventas:894665, cantidad:295.0, precio_uni_prom:3032.76, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"5 L", ventas:854515, cantidad:250.0, precio_uni_prom:3418.06, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"20 L", ventas:2751235, cantidad:920.0, precio_uni_prom:2990.47, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"20 L", ventas:4907280, cantidad:1940.0, precio_uni_prom:2529.53, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2900, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN", formato:"1 L", ventas:747486, cantidad:146.0, precio_uni_prom:5119.77, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"1 L", ventas:552309, cantidad:121.0, precio_uni_prom:4564.54, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"1 L", ventas:552020, cantidad:129.0, precio_uni_prom:4279.22, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"1 L", ventas:826528, cantidad:188.0, precio_uni_prom:4396.43, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"20 L", ventas:4324840, cantidad:1620.0, precio_uni_prom:2669.65, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"5 L", ventas:800617, cantidad:225.0, precio_uni_prom:3558.3, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV N-P MIX", formato:"20 L", ventas:0, cantidad:20.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"5 L", ventas:6170232, cantidad:560.0, precio_uni_prom:11018.27, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:17000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BLOOM", formato:"5 L", ventas:3043427, cantidad:490.0, precio_uni_prom:6211.08, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:9500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"20 L", ventas:6256925, cantidad:3040.0, precio_uni_prom:2058.2, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"200 L", ventas:8590000, cantidad:2200.0, precio_uni_prom:3904.55, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO LOS LIRIOS", formato:"?", ventas:0, cantidad:9.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO LA MONTAÑA", formato:"?", ventas:0, cantidad:4.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS FOLIAR - CAMPO SANTA LUISA", formato:"?", ventas:0, cantidad:8.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"5 L", ventas:659770, cantidad:210.0, precio_uni_prom:3141.76, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"1 L", ventas:1288258, cantidad:164.0, precio_uni_prom:7855.23, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:15000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"1 L", ventas:960570, cantidad:189.0, precio_uni_prom:5082.38, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"1 L", ventas:1574537, cantidad:363.0, precio_uni_prom:4337.57, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"1 L", ventas:638841, cantidad:136.0, precio_uni_prom:4697.36, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"1 L", ventas:12035, cantidad:2.0, precio_uni_prom:6017.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BLOOM", formato:"1 L", ventas:763338, cantidad:121.0, precio_uni_prom:6308.58, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:11000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOBODEN CRYOPHILE", formato:"250 GR", ventas:1190000, cantidad:140.0, precio_uni_prom:8500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"XCARATOR", formato:"20 L", ventas:2483000, cantidad:2000.0, precio_uni_prom:1241.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"200 L", ventas:7145000, cantidad:1380.0, precio_uni_prom:5177.54, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MOVE", formato:"5 L", ventas:2972700, cantidad:500.0, precio_uni_prom:5945.4, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"?", ventas:32707, cantidad:2.0, precio_uni_prom:16353.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"5 L", ventas:1173655, cantidad:260.0, precio_uni_prom:4514.06, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"20 L", ventas:35609260, cantidad:4010.0, precio_uni_prom:8880.11, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:13500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MOVE", formato:"1 L", ventas:440960, cantidad:49.0, precio_uni_prom:8999.18, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"5 L", ventas:345550, cantidad:115.0, precio_uni_prom:3004.78, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"5 L", ventas:2130250, cantidad:315.0, precio_uni_prom:6762.7, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:11000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"5 L", ventas:212300, cantidad:85.0, precio_uni_prom:2497.65, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"5 L", ventas:35400, cantidad:35.0, precio_uni_prom:1011.43, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"K-DEFEND MAX", formato:"20 L", ventas:0, cantidad:200.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"1 L", ventas:344926, cantidad:65.0, precio_uni_prom:5306.55, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO BORO", formato:"5 L", ventas:564606, cantidad:135.0, precio_uni_prom:4182.27, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"1 L", ventas:694920, cantidad:144.0, precio_uni_prom:4825.83, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"5 L", ventas:1420832, cantidad:280.0, precio_uni_prom:5074.4, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"1 L", ventas:644067, cantidad:129.0, precio_uni_prom:4992.77, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV DEFENDER MAX", formato:"1 L", ventas:0, cantidad:15.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV DEFENDER MAX", formato:"5 L", ventas:0, cantidad:50.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV SILFORTE", formato:"1 L", ventas:988887, cantidad:165.0, precio_uni_prom:5993.25, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:12500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV15 40-20", formato:"20 L", ventas:3674940, cantidad:1080.0, precio_uni_prom:3402.72, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOPOTASICO", formato:"500 ML", ventas:16805, cantidad:90.0, precio_uni_prom:186.72, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP", formato:"500 ML", ventas:16805, cantidad:86.0, precio_uni_prom:195.41, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"500 ML", ventas:16805, cantidad:72.0, precio_uni_prom:233.4, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM", formato:"500 ML", ventas:16805, cantidad:103.0, precio_uni_prom:163.16, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX", formato:"500 ML", ventas:16805, cantidad:215.0, precio_uni_prom:78.16, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"500 ML", ventas:16805, cantidad:210.0, precio_uni_prom:80.02, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"200 ML", ventas:0, cantidad:27.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOPOTASICO CONC.", formato:"200 ML", ventas:0, cantidad:7.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP CONC.", formato:"200 ML", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV RAIZ", formato:"20 GR", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"500 ML", ventas:0, cantidad:7.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"200 ML", ventas:0, cantidad:54.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"200 ML", ventas:0, cantidad:37.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM CONC.", formato:"200 ML", ventas:0, cantidad:24.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"200 L", ventas:13384000, cantidad:6140.0, precio_uni_prom:2179.8, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV15 40-20", formato:"1 L", ventas:563916, cantidad:81.0, precio_uni_prom:6961.93, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV15 40-20", formato:"5 L", ventas:896253, cantidad:170.0, precio_uni_prom:5272.08, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"1000 L", ventas:30000000, cantidad:19000.0, precio_uni_prom:1578.95, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2200, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"200 L", ventas:9810000, cantidad:6000.0, precio_uni_prom:1635.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ROOT MAX", formato:"200 L", ventas:6416000, cantidad:1540.0, precio_uni_prom:4166.23, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5400, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"1 L", ventas:182668, cantidad:43.0, precio_uni_prom:4248.09, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV PRADERAS", formato:"250 GR", ventas:3475408, cantidad:248.0, precio_uni_prom:14013.74, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODENPRO POTASIO", formato:"20 L", ventas:3780000, cantidad:2000.0, precio_uni_prom:1890.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"20 L", ventas:7666200, cantidad:3020.0, precio_uni_prom:2538.48, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2700, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"500 ML", ventas:0, cantidad:13.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"K-DEFEND MAX", formato:"5 L", ventas:0, cantidad:10.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BLOOM", formato:"20 L", ventas:13486700, cantidad:2560.0, precio_uni_prom:5268.24, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANALISIS V-CO", formato:"0000 HOJAS", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANALISIS V-C0", formato:"0000 HOJAS", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"200 L", ventas:1400000, cantidad:1000.0, precio_uni_prom:1400.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT", formato:"500 ML", ventas:16805, cantidad:160.0, precio_uni_prom:105.03, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MICRO MIX", formato:"200 L", ventas:900000, cantidad:200.0, precio_uni_prom:4500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"1 L", ventas:47252, cantidad:13.0, precio_uni_prom:3634.77, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"SOLUFOS", formato:"500 GR", ventas:5000000, cantidad:400.0, precio_uni_prom:12500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CRYOPHILE", formato:"250 GR", ventas:17056000, cantidad:1636.0, precio_uni_prom:10425.43, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"20 L", ventas:320000, cantidad:100.0, precio_uni_prom:3200.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANALISIS FOLIAR", formato:"?", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"500 ML", ventas:0, cantidad:6.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"500 ML", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PRODRUCTOS DE", formato:"1 L", ventas:96000, cantidad:9.0, precio_uni_prom:10666.67, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANALSIS FOLIAR", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"20 L", ventas:17048400, cantidad:1710.0, precio_uni_prom:9969.82, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:14500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"ANÁLSIS FOLIAR", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS SUELO EPS", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS SUELO BÁSICO", formato:"?", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"ANÁLISIS AGUA DE RIEGO", formato:"?", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"NO_CLASIFICABLE" },
    { pais:"CL", producto:"BIOAV INVERNAL", formato:"250 GR", ventas:39274252, cantidad:1945.0, precio_uni_prom:20192.42, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PROTECT PRADERAS", formato:"250 GR", ventas:44610000, cantidad:2955.0, precio_uni_prom:15096.45, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"1 L", ventas:172200, cantidad:24.0, precio_uni_prom:7175.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"FOLIBAC BIO INVIERNO", formato:"250 GR", ventas:15900000, cantidad:600.0, precio_uni_prom:26500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"20 L", ventas:0, cantidad:160.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN GUARDIAN MAX", formato:"20 L", ventas:450000, cantidad:200.0, precio_uni_prom:2250.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MACRO FRUIT", formato:"20 L", ventas:6242540, cantidad:3620.0, precio_uni_prom:1724.46, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOAV FOLIAR", formato:"20 GR", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV HUMIC ROOT", formato:"5 L", ventas:60000, cantidad:15.0, precio_uni_prom:4000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"FOLIBAC FLY", formato:"250 GR", ventas:1325000, cantidad:50.0, precio_uni_prom:26500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"HERBIFEN AMINA 2,4D 20L", formato:"?", ventas:0, cantidad:60.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"POWER MAXX GLIFOSATO MONOAMONICO 75%", formato:"?", ventas:0, cantidad:1140.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV CYTO PRIME", formato:"200 L", ventas:12000000, cantidad:1600.0, precio_uni_prom:7500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:14000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"200 L", ventas:4220000, cantidad:2360.0, precio_uni_prom:1788.14, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2600, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC", formato:"200 L", ventas:2590000, cantidad:2000.0, precio_uni_prom:1295.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"200 ML", ventas:0, cantidad:12.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"200 L", ventas:5220000, cantidad:2200.0, precio_uni_prom:2372.73, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2600, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS CALCIO", formato:"1000 L", ventas:3250000, cantidad:2000.0, precio_uni_prom:1625.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2400, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"7", formato:"?", ventas:104800, cantidad:20.0, precio_uni_prom:5240.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV BIOPOTASICO", formato:"1 L", ventas:66000, cantidad:36.0, precio_uni_prom:1833.33, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOPOTASICO", formato:"5 L", ventas:360000, cantidad:120.0, precio_uni_prom:3000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV MAX FULVIC 45%", formato:"1000 L", ventas:2600000, cantidad:1000.0, precio_uni_prom:2600.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2200, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"1000 L", ventas:2850000, cantidad:1001.0, precio_uni_prom:2847.15, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS ZINC MANGANESO", formato:"200 L", ventas:2288000, cantidad:1120.0, precio_uni_prom:2042.86, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2600, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"QUARTEC CRIO SACHET", formato:"250 GR", ventas:1000000, cantidad:50.0, precio_uni_prom:20000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"NUTRAMIX CONC.", formato:"250 ML", ventas:0, cantidad:17.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT CONC.", formato:"250 ML", ventas:0, cantidad:11.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
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
    { pais:"CL", producto:"AV PLUS MACRO FRUIT", formato:"1 L", ventas:233400, cantidad:40.0, precio_uni_prom:5835.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV AMIN SUGAR", formato:"1000 L", ventas:15500000, cantidad:4000.0, precio_uni_prom:3875.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"RAÍZ DE AV BIOVECA", formato:"500 GR", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CONCENTRADO PARA RAÍCES", formato:"250 ML", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CONCENTRADO DE RAÍZ", formato:"500 ML", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"CONCENTRACIÓN DE EQUILIBRIO", formato:"250 ML", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILFORTEM CONC.", formato:"500 ML", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NP-MIX", formato:"5 L", ventas:42500, cantidad:5.0, precio_uni_prom:8500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"A5", formato:"5 L", ventas:1760000, cantidad:160.0, precio_uni_prom:11000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MACRO FRUIT", formato:"5 L", ventas:216000, cantidad:65.0, precio_uni_prom:3323.08, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BALANCE", formato:"?", ventas:4697666, cantidad:528.0, precio_uni_prom:8897.09, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"PLUS POTASIO", formato:"?", ventas:0, cantidad:40.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"?", ventas:0, cantidad:30.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"FORMATO_NO_IDENTIFICADO" },
    { pais:"CL", producto:"AV PLUS HIERRO", formato:"200 L", ventas:680000, cantidad:600.0, precio_uni_prom:1133.33, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2800, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS MAGNESIO", formato:"200 L", ventas:680000, cantidad:800.0, precio_uni_prom:850.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOTENS", formato:"20 L", ventas:14400000, cantidad:780.0, precio_uni_prom:18461.54, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BALANCE CONC.", formato:"250 ML", ventas:0, cantidad:16.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOPOTASICO CONC.", formato:"250 ML", ventas:0, cantidad:3.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"RAIZ CONC.", formato:"250 ML", ventas:0, cantidad:5.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FUNGISTOP CONC.", formato:"250 ML", ventas:0, cantidad:1.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"TERRAPULSE CONC.", formato:"250 ML", ventas:0, cantidad:4.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
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
    { pais:"CL", producto:"TRIHORGAN", formato:"1 L", ventas:1320000, cantidad:120.0, precio_uni_prom:11000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"PROBIORGAN IRG", formato:"1 L", ventas:1140000, cantidad:120.0, precio_uni_prom:9500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS BORO", formato:"1000 L", ventas:7500000, cantidad:3000.0, precio_uni_prom:2500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2400, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIOPOTASICO", formato:"20 L", ventas:400000, cantidad:100.0, precio_uni_prom:4000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"QUARTEC FILOSFERA", formato:"250 GR", ventas:6200000, cantidad:310.0, precio_uni_prom:20000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"FOLIBAC SOIL", formato:"500 GR", ventas:262500, cantidad:10.0, precio_uni_prom:26250.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS NUTRI MIX", formato:"200 L", ventas:569970, cantidad:200.0, precio_uni_prom:2849.85, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODENPRO CALCIO", formato:"20 L", ventas:1382400, cantidad:1280.0, precio_uni_prom:1080.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODENPRO MAGNESIO", formato:"20 L", ventas:1507840, cantidad:980.0, precio_uni_prom:1538.61, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"SILIK FORTE", formato:"20 L", ventas:5200000, cantidad:1600.0, precio_uni_prom:3250.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV NITRUM 36", formato:"20 L", ventas:2760000, cantidad:760.0, precio_uni_prom:3631.58, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BIOTENS", formato:"5 L", ventas:700000, cantidad:45.0, precio_uni_prom:15555.56, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV FRUCTUS", formato:"5 L", ventas:135000, cantidad:15.0, precio_uni_prom:9000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV NITRUM 36", formato:"5 L", ventas:32500, cantidad:5.0, precio_uni_prom:6500.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"BODENPRO FOSKA", formato:"20 L", ventas:726400, cantidad:200.0, precio_uni_prom:3632.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"GREEN PLANT CONC.", formato:"200 ML", ventas:0, cantidad:2.0, precio_uni_prom:0.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV BIO MYCOFORCE", formato:"250 GR", ventas:38000, cantidad:1.0, precio_uni_prom:38000.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV ALGAP 30", formato:"1000 L", ventas:6800000, cantidad:2000.0, precio_uni_prom:3400.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3000, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"CL", producto:"AV PLUS POTASIO", formato:"200 L", ventas:550000, cantidad:200.0, precio_uni_prom:2750.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2500, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE", formato:"200 L (tier)", ventas:110085.0, cantidad:8978.0, precio_uni_prom:12.2616, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:12.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ALGAP 30", formato:"20 L (tier)", ventas:960.0, cantidad:100.0, precio_uni_prom:9.6, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MICRO MIX", formato:"1000 L (tier)", ventas:3149.0, cantidad:470.0, precio_uni_prom:6.7, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"REGALIA MAX", formato:"?", ventas:52504.0, cantidad:1576.0, precio_uni_prom:33.3147, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV MAX FULVIC 45%", formato:"1000 L (tier)", ventas:2752.0, cantidad:1020.0, precio_uni_prom:2.698, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2.2, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS ZINC MANGANESO", formato:"20 L (tier)", ventas:480.0, cantidad:80.0, precio_uni_prom:6.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5.8, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE", formato:"1000 L (tier)", ventas:94884.0, cantidad:8800.0, precio_uni_prom:10.7823, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV AMIN", formato:"200 L (tier)", ventas:1265.0, cantidad:170.0, precio_uni_prom:7.4412, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"200 L (tier)", ventas:25477.5, cantidad:1835.0, precio_uni_prom:13.8842, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:12.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"200 L (tier)", ventas:12398.0, cantidad:2740.0, precio_uni_prom:4.5248, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"REGALIA", formato:"?", ventas:9712.0, cantidad:244.0, precio_uni_prom:39.8033, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV CYTO PRIME", formato:"200 L (tier)", ventas:4693.0, cantidad:247.0, precio_uni_prom:19.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:17.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV CYTO PRIME", formato:"20 L (tier)", ventas:741.0, cantidad:39.0, precio_uni_prom:19.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:19.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS NUTRI MIX", formato:"1 L (tier)", ventas:17.0, cantidad:2.0, precio_uni_prom:8.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:10.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"20 L (tier)", ventas:1188.4, cantidad:228.0, precio_uni_prom:5.2123, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS MAGNESIO", formato:"1000 L (tier)", ventas:7587.4, cantidad:1331.0, precio_uni_prom:5.7005, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS CALCIO", formato:"200 L (tier)", ventas:1126.4, cantidad:256.0, precio_uni_prom:4.4, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3.8, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ALGAP 30", formato:"200 L (tier)", ventas:8632.0, cantidad:828.0, precio_uni_prom:10.4251, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"REGALIA MAXX", formato:"?", ventas:99001.64, cantidad:2857.0, precio_uni_prom:34.6523, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SILFORTE", formato:"20 L (tier)", ventas:5676.0, cantidad:506.0, precio_uni_prom:11.2174, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:13.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV HUMIC ROOT", formato:"200 L (tier)", ventas:840.0, cantidad:240.0, precio_uni_prom:3.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:3.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS ZINC", formato:"200 L (tier)", ventas:3150.0, cantidad:420.0, precio_uni_prom:7.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6.8, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV MOVE", formato:"1000 L (tier)", ventas:5477.5, cantidad:626.0, precio_uni_prom:8.75, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV MOVE", formato:"20 L (tier)", ventas:280.0, cantidad:32.0, precio_uni_prom:8.75, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:8.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV PLUS BORO", formato:"20 L (tier)", ventas:1150.0, cantidad:230.0, precio_uni_prom:5.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:4.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ROOT MAX", formato:"1000 L (tier)", ventas:19236.0, cantidad:1528.0, precio_uni_prom:12.589, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:11.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV AMIN SUGAR", formato:"20 L (tier)", ventas:200.0, cantidad:20.0, precio_uni_prom:10.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:7.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SIL FORTE - 20LTS", formato:"?", ventas:3285.0, cantidad:900.0, precio_uni_prom:3.65, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV BIOSOLARIS", formato:"200 L (tier)", ventas:25450.0, cantidad:1870.0, precio_uni_prom:13.6096, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:16.0, clasif:"nan", estado:"SIN_COSTO" },
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
    { pais:"PE", producto:"AV PLUS HIERRO", formato:"20 L (tier)", ventas:825.0, cantidad:110.0, precio_uni_prom:7.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:5.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV ZINC", formato:"?", ventas:2250.0, cantidad:300.0, precio_uni_prom:7.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"N- AMIN PRO", formato:"?", ventas:660.0, cantidad:240.0, precio_uni_prom:2.75, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"LST AV AMIN", formato:"?", ventas:500.0, cantidad:100.0, precio_uni_prom:5.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"ALGA E PRO", formato:"?", ventas:9690.0, cantidad:1560.0, precio_uni_prom:6.2115, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"SILFORTE", formato:"?", ventas:7040.0, cantidad:620.0, precio_uni_prom:11.3548, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"TS AV MAX FULVIC", formato:"?", ventas:600.0, cantidad:200.0, precio_uni_prom:3.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV HUMIC ROOT", formato:"1000 L (tier)", ventas:36000.0, cantidad:20000.0, precio_uni_prom:1.8, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"LST AV SILFORTE", formato:"?", ventas:810.0, cantidad:60.0, precio_uni_prom:13.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV SIFORTE", formato:"?", ventas:2200.0, cantidad:200.0, precio_uni_prom:11.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV AMIN SUGAR", formato:"200 L (tier)", ventas:595.0, cantidad:70.0, precio_uni_prom:8.5, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:6.0, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV MAX FULVIC 45%", formato:"200 L (tier)", ventas:364.0, cantidad:140.0, precio_uni_prom:2.6, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:2.5, clasif:"nan", estado:"SIN_COSTO" },
    { pais:"PE", producto:"BODEN ENERGY", formato:"?", ventas:2100.0, cantidad:300.0, precio_uni_prom:7.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"HUMIC ROOT. 40 LTS AV MAGENSIO", formato:"?", ventas:600.0, cantidad:120.0, precio_uni_prom:5.0, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:null, clasif:null, estado:"SIN_COSTO" },
    { pais:"PE", producto:"AV BALANCE", formato:"1 L (tier)", ventas:14.76, cantidad:1.0, precio_uni_prom:14.76, costo_unidad:null, costo_total:null, margen_total:null, margen_pct:null, piso:15.0, clasif:"nan", estado:"SIN_COSTO" }
  ];

  var rentabilidad = {
    alertas_nivel1: [],
    alertas_nivel2: [],
    impacto_clp:    0,
    skus_bajo_piso_chile: 0,
    skus_bajo_piso_peru:   0,
    skus_sin_costo_chile: 190,
    skus_sin_costo_peru:   55
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
