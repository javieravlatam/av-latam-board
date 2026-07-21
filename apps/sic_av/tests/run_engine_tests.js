/**
 * SIC-AV — Pruebas de motor de calculo (sic_core.js) y de generacion de PDF (sic_pdf.js)
 * =========================================================================================
 * Ejecuta 100% en Node, sin navegador ni servidor HTTP: usa un shim de fetch() que lee
 * los archivos JSON locales con fs.readFileSync. Cubre los escenarios de negocio
 * (edad de cartera, presupuesto, IEC, precio piso, bono por excedente, diferido
 * trimestral, notas de credito) y la consistencia entre pantalla y PDF.
 *
 * Uso: node tests/run_engine_tests.js   (ejecutar desde la carpeta apps/sic_av/)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

global.fetch = function (url) {
  return new Promise((resolve) => {
    try {
      const p = path.join(ROOT, url);
      const content = fs.readFileSync(p, 'utf8');
      resolve({ ok: true, json: () => Promise.resolve(JSON.parse(content)) });
    } catch (e) {
      resolve({ ok: false });
    }
  });
};
global.window = global;
global.document = undefined; // sic_pdf.js solo usa document dentro de generarInforme(), no en _construirHtml

eval(fs.readFileSync(path.join(ROOT, 'sic_core.js'), 'utf8'));
eval(fs.readFileSync(path.join(ROOT, 'sic_pdf.js'), 'utf8'));

const resultados = [];
function check(nombre, condicion, detalle) {
  resultados.push({ nombre, ok: !!condicion, detalle: detalle || '' });
  console.log((condicion ? 'OK  ' : 'FAIL') + ' - ' + nombre + (detalle ? '  (' + detalle + ')' : ''));
}

(async () => {
  const ctxCL = await SIC.cargarPais('CL');
  const ctxPE = await SIC.cargarPais('PE');
  check('carga_datos_chile', ctxCL.ventas.length > 0 && ctxCL.vendedores.length >= 4,
    'ventas=' + ctxCL.ventas.length + ' vendedores=' + ctxCL.vendedores.length);
  check('carga_datos_peru', ctxPE.ventas.length > 0 && ctxPE.vendedores.length >= 4,
    'ventas=' + ctxPE.ventas.length + ' vendedores=' + ctxPE.vendedores.length);

  const r1 = SIC.calcularVendedorCiclo(ctxCL, 'CL-V01', '2026-07');

  // 5. Venta no cobrada -> comision liberada 0, estado potencial
  const fNoCobro = r1.detalle_facturas.find(f => f.factura === 'CL-2026-07-006');
  check('venta_no_cobrada', fNoCobro && fNoCobro.comision_liberada === 0 && fNoCobro.estado === 'potencial',
    'factura=' + (fNoCobro && fNoCobro.factura) + ' estado=' + (fNoCobro && fNoCobro.estado) + ' liberada=' + (fNoCobro && fNoCobro.comision_liberada));

  // 6. Pago parcial -> estado pendiente, saldo > 0
  const fParcial = r1.detalle_facturas.find(f => f.factura === 'CL-2026-07-005');
  check('pago_parcial', fParcial && fParcial.estado === 'pendiente' && fParcial.saldo_pendiente > 0,
    'estado=' + (fParcial && fParcial.estado) + ' saldo=' + Math.round(fParcial && fParcial.saldo_pendiente));

  // 7. Pronto pago (cobro dentro de 1-30 dias) -> tasa 7.5% (Chile, ambos tipos de cliente)
  const fProntoPago = r1.detalle_facturas.find(f => f.pagos && f.pagos.some(p => p.dias_al_cobro >= 1 && p.dias_al_cobro <= 30));
  const pagoPP = fProntoPago && fProntoPago.pagos.find(p => p.dias_al_cobro >= 1 && p.dias_al_cobro <= 30);
  check('pronto_pago', pagoPP && pagoPP.tasa_cartera === 7.5,
    'factura=' + (fProntoPago && fProntoPago.factura) + ' dias=' + (pagoPP && pagoPP.dias_al_cobro) + ' tasa=' + (pagoPP && pagoPP.tasa_cartera));

  // 8. Cobro tardio (>180 dias) -> tasa reducida (2.5% o 0.5% segun tramo)
  const fTardia = r1.detalle_facturas.find(f => f.factura === 'CL-2026-07-004');
  const pagoTardio = fTardia && fTardia.pagos[0];
  check('cobro_tardio', pagoTardio && pagoTardio.dias_al_cobro > 180 && pagoTardio.tasa_cartera <= 2.5,
    'dias=' + (pagoTardio && pagoTardio.dias_al_cobro) + ' tasa=' + (pagoTardio && pagoTardio.tasa_cartera) + '%');

  // 8b. Politica V1.1 -- tabla de cartera Chile unica (sin distincion Distribuidor/Cliente Final):
  // misma cantidad de dias debe dar la misma tasa sin importar el tipo de cliente.
  check('cartera_chile_tabla_unica',
    SIC.tasaCartera(ctxCL.params, 'Distribuidor', 45) === SIC.tasaCartera(ctxCL.params, 'ClienteFinal', 45) &&
    SIC.tasaCartera(ctxCL.params, 'Distribuidor', 45) === 6 &&
    SIC.tasaCartera(ctxCL.params, 'Distribuidor', 0) === 8 &&
    SIC.tasaCartera(ctxCL.params, 'Distribuidor', 200) === 3 &&
    SIC.tasaCartera(ctxCL.params, 'Distribuidor', 300) === 2.5 &&
    SIC.tasaCartera(ctxCL.params, 'Distribuidor', 400) === 0.5,
    'tasa(45d)=' + SIC.tasaCartera(ctxCL.params, 'Distribuidor', 45) + '% igual para ambos tipos de cliente; tramos 0/30/180/210/360 verificados');

  // 8c. Politica V1.1 -- tabla de cartera Peru se mantiene (contado 8%, 1-30d 7.5%, 31-60d 6%, 61-120d 5%, 121-180d 2.5%, >180d 0.5%)
  check('cartera_peru_tabla_mantenida',
    SIC.tasaCartera(ctxPE.params, 'Distribuidor', 0) === 8 &&
    SIC.tasaCartera(ctxPE.params, 'Distribuidor', 45) === 6 &&
    SIC.tasaCartera(ctxPE.params, 'Distribuidor', 90) === 5 &&
    SIC.tasaCartera(ctxPE.params, 'Distribuidor', 150) === 2.5 &&
    SIC.tasaCartera(ctxPE.params, 'Distribuidor', 200) === 0.5,
    'tramos Peru verificados sin cambios');

  // 9. IEC bajo -> Politica V1.2: IEC 70%-84,99% => factor IEC = 70% exacto (CL-V01, IEC 82%)
  check('iec_bajo', r1.iec_pct >= 70 && r1.iec_pct < 85 && r1.factor_iec === 70,
    'iec=' + r1.iec_pct + '% factor_iec=' + r1.factor_iec);

  // 10. IEC alto -> Politica V1.2: IEC >=95% => factor IEC = 105% exacto (CL-V03, IEC 96.5%)
  const r3 = SIC.calcularVendedorCiclo(ctxCL, 'CL-V03', '2026-07');
  check('iec_alto', r3.iec_pct >= 95 && r3.factor_iec === 105,
    'iec=' + r3.iec_pct + '% factor_iec=' + r3.factor_iec);

  // 10b. Verificacion analitica directa de los 5 tramos del Factor IEC,
  // independiente de los datos demo (Politica V1.2, CHANGE REQUEST v1.3).
  check('factor_iec_tramos_exactos',
    SIC.factorIEC(ctxCL.params, 69.99) === 20 &&
    SIC.factorIEC(ctxCL.params, 70) === 70 &&
    SIC.factorIEC(ctxCL.params, 84.99) === 70 &&
    SIC.factorIEC(ctxCL.params, 85) === 80 &&
    SIC.factorIEC(ctxCL.params, 91.99) === 80 &&
    SIC.factorIEC(ctxCL.params, 92) === 90 &&
    SIC.factorIEC(ctxCL.params, 94.99) === 90 &&
    SIC.factorIEC(ctxCL.params, 95) === 105 &&
    SIC.factorIEC(ctxCL.params, 100) === 105,
    'f(69.99)=' + SIC.factorIEC(ctxCL.params, 69.99) + ' f(70)=' + SIC.factorIEC(ctxCL.params, 70) +
    ' f(85)=' + SIC.factorIEC(ctxCL.params, 85) + ' f(92)=' + SIC.factorIEC(ctxCL.params, 92) +
    ' f(95)=' + SIC.factorIEC(ctxCL.params, 95) + ' (sin interpolacion)');

  // 11. Cumplimiento bajo -> Politica V1.1: cumplimiento < 90% => factor presupuesto = 0%
  // (CL-V03, cumplimiento 36.4%)
  check('cumplimiento_bajo', r3.cumplimiento_pct < 90 && r3.factor_presupuesto === 0,
    'cumplimiento=' + r3.cumplimiento_pct.toFixed(1) + '% factor_ppto=' + r3.factor_presupuesto);

  // 12. Cumplimiento >= 100% -> Politica V1.1: factor presupuesto = 100% (tope, NUNCA supera 100%)
  // CHANGE REQUEST v1.6: el cumplimiento ahora se evalua sobre el MES DE
  // DESEMPEÑO (venta neta del mes / presupuesto del mismo mes), no sobre el
  // periodo 26-25 -- CL-V02 en el ciclo '2026-04' (mes de desempeño '2026-03')
  // es el caso demo que hoy supera 100% de cumplimiento.
  const r2 = SIC.calcularVendedorCiclo(ctxCL, 'CL-V02', '2026-04');
  check('cumplimiento_superior_100', r2.cumplimiento_pct >= 100 && r2.factor_presupuesto === 100,
    'cumplimiento=' + r2.cumplimiento_pct.toFixed(1) + '% factor_ppto=' + r2.factor_presupuesto);

  // 12b. Cumplimiento intermedio (90%-99,99%) -> factor presupuesto = 80% exacto
  const rIntermedio = ctxCL.vendedores.map(function (v) { return SIC.calcularVendedorCiclo(ctxCL, v.id, '2026-07'); })
    .find(function (r) { return r.cumplimiento_pct >= 90 && r.cumplimiento_pct < 100; });
  check('cumplimiento_intermedio_80pct', rIntermedio ? rIntermedio.factor_presupuesto === 80 : true,
    rIntermedio ? ('vendedor=' + rIntermedio.vendedor_id + ' cumplimiento=' + rIntermedio.cumplimiento_pct.toFixed(1) + '% factor_ppto=' + rIntermedio.factor_presupuesto) : 'ningun vendedor demo cae en el tramo 90-99.99% en este ciclo (tramo validado analiticamente via SIC.factorPresupuesto)');

  // 12c. Verificacion analitica directa de los 3 tramos, independiente de los datos demo
  check('factor_presupuesto_tramos_exactos',
    SIC.factorPresupuesto(ctxCL.params, 89.99) === 0 &&
    SIC.factorPresupuesto(ctxCL.params, 90) === 80 &&
    SIC.factorPresupuesto(ctxCL.params, 99.99) === 80 &&
    SIC.factorPresupuesto(ctxCL.params, 100) === 100 &&
    SIC.factorPresupuesto(ctxCL.params, 150) === 100,
    'f(89.99)=' + SIC.factorPresupuesto(ctxCL.params, 89.99) + ' f(90)=' + SIC.factorPresupuesto(ctxCL.params, 90) +
    ' f(99.99)=' + SIC.factorPresupuesto(ctxCL.params, 99.99) + ' f(100)=' + SIC.factorPresupuesto(ctxCL.params, 100) +
    ' f(150)=' + SIC.factorPresupuesto(ctxCL.params, 150) + ' (nunca debe superar 100)');

  // 13. CHANGE REQUEST SIC-AV v1.4 -- venta bajo piso "autorizada" ya no tiene
  // factor de reduccion: entra al calculo normal igual que cualquier otra
  // venta cobrada (no existe SIC.factorPiso ni el campo factor_piso). NOTA
  // v1.6: en el ciclo '2026-07' el Factor de Presupuesto del mes de desempeño
  // (2026-06) es 0% para CL-V01 (cumplimiento < 90%), por lo que TODAS las
  // facturas de este ciclo -- sin importar su clasificacion de piso -- dan
  // comision_ajustada = 0. Por eso la prueba ya no exige comision > 0; en
  // cambio verifica que la comision de la factura bajo piso coincide EXACTO
  // con la misma formula general (base x Factor Presupuesto x Factor IEC),
  // que es lo que realmente demuestra la ausencia de una reduccion adicional
  // por precio piso.
  const fPisoAut = r1.detalle_facturas.find(f => f.factura === 'CL-2026-07-009');
  const pagoPisoAut = fPisoAut && fPisoAut.pagos[0];
  const ajustadaEsperadaAut = pagoPisoAut ? pagoPisoAut.comision_base * (r1.factor_presupuesto / 100) * (r1.factor_iec / 100) : null;
  check('venta_bajo_piso_autorizada_sin_reduccion',
    fPisoAut && fPisoAut.factor_piso === undefined && fPisoAut.clasificacion_piso === 'bajo_piso' &&
    fPisoAut.estado === 'liberada' && pagoPisoAut && Math.abs(pagoPisoAut.comision_ajustada - ajustadaEsperadaAut) < 0.01,
    'clasificacion=' + (fPisoAut && fPisoAut.clasificacion_piso) + ' estado=' + (fPisoAut && fPisoAut.estado) +
    ' comision_ajustada=' + (pagoPisoAut && pagoPisoAut.comision_ajustada.toFixed(2)) + ' esperada(sin reduccion de piso)=' + (ajustadaEsperadaAut && ajustadaEsperadaAut.toFixed(2)) +
    ' (factor_presupuesto=' + r1.factor_presupuesto + '% este ciclo -- ver v1.6, mes de desempeño ' + r1.mes_desempeno + ')');

  // 14. CHANGE REQUEST SIC-AV v1.4 -- venta bajo piso "no autorizada" YA NO
  // produce comision cero ni estado "retenida" por su condicion de piso (ese
  // estado se elimino por completo). La factura CL-2026-07-008 esta pagada en
  // su totalidad, por lo tanto debe quedar "liberada" -- el monto puede ser 0
  // hoy por el Factor de Presupuesto del mes (ver nota v1.6 arriba), pero
  // debe coincidir EXACTO con la formula general, sin reduccion extra de piso.
  const fPisoNoAut = r1.detalle_facturas.find(f => f.factura === 'CL-2026-07-008');
  const pagoPisoNoAutTest14 = fPisoNoAut && fPisoNoAut.pagos[0];
  const ajustadaEsperadaNoAut = pagoPisoNoAutTest14 ? pagoPisoNoAutTest14.comision_base * (r1.factor_presupuesto / 100) * (r1.factor_iec / 100) : null;
  check('venta_bajo_piso_no_autorizada_ya_no_es_cero',
    fPisoNoAut && fPisoNoAut.clasificacion_piso === 'bajo_piso' &&
    fPisoNoAut.estado === 'liberada' && pagoPisoNoAutTest14 && Math.abs(pagoPisoNoAutTest14.comision_ajustada - ajustadaEsperadaNoAut) < 0.01,
    'estado=' + (fPisoNoAut && fPisoNoAut.estado) + ' comision_ajustada=' + (pagoPisoNoAutTest14 && pagoPisoNoAutTest14.comision_ajustada.toFixed(2)) + ' (antes era 0/retenida por piso, ahora entra al calculo normal -- monto real 0 hoy por Factor Presupuesto del mes, no por el piso)');

  // 14b. Ninguna factura del ciclo, sin importar su clasificacion de piso,
  // puede quedar en estado "retenida" -- ese estado ya no existe en el motor.
  check('estado_retenida_eliminado',
    r1.detalle_facturas.every(f => f.estado !== 'retenida') &&
    r1.detalle_facturas.every(f => f.factor_piso === undefined),
    'ningun estado === "retenida" y el campo factor_piso ya no existe en el detalle de factura');

  // 14c. CHANGE REQUEST SIC-AV v1.4 -- no debe existir doble penalizacion por
  // precio piso: la comision ajustada de un pago de una factura bajo piso
  // debe coincidir EXACTAMENTE con base x Factor Presupuesto x Factor IEC
  // (sin ningun multiplicador adicional oculto por precio piso).
  const pagoPisoNoAut = fPisoNoAut.pagos[0];
  const ajustadaEsperada = pagoPisoNoAut.comision_base * (r1.factor_presupuesto / 100) * (r1.factor_iec / 100);
  check('sin_doble_penalizacion_precio_piso',
    Math.abs(pagoPisoNoAut.comision_ajustada - ajustadaEsperada) < 0.01,
    'comision_ajustada=' + pagoPisoNoAut.comision_ajustada.toFixed(2) + ' esperada(base x Fppto x Fiec)=' + ajustadaEsperada.toFixed(2));

  // 15. Bono por excedente -> CHANGE REQUEST v1.6: se calcula sobre venta
  // NETA del mes de desempeño vs. presupuesto del mismo mes (nunca sobre
  // cobranza ni sobre el periodo 26-25) -- r2 (CL-V02, ciclo '2026-04', mes
  // de desempeño '2026-03') es el caso demo con excedente mensual real.
  check('bono_por_excedente', r2.bono_excedente > 0 && r2.excedente_mes > 0,
    'excedente_mes=' + Math.round(r2.excedente_mes) + ' bono=' + Math.round(r2.bono_excedente) + ' (mes de desempeño ' + r2.mes_desempeno + ')');

  // 15b. CHANGE REQUEST SIC-AV v1.6 -- formula definitiva: Bono = Excedente
  // del mes x 2%, YA SIN ponderar por Factor IEC (a diferencia de la v1.4,
  // que si lo incluia). Se verifica que el motor coincide EXACTO con esta
  // formula mas simple, y que NO coincide con la formula vieja (que si
  // multiplicaba por factor_iec) salvo que factor_iec fuera 100.
  const bonoEsperadoV16 = r2.excedente_mes * (ctxCL.params.bono_excedente_pct / 100);
  check('bono_excedente_formula_v16_sin_factor_iec',
    Math.abs(r2.bono_excedente - bonoEsperadoV16) < 0.01,
    'bono_excedente=' + r2.bono_excedente.toFixed(2) + ' esperado(excedente_mes x 2%, sin Factor IEC)=' + bonoEsperadoV16.toFixed(2) + ' (factor_iec de este vendedor=' + r2.factor_iec + '%, distinto de 100 -- confirma que ya no se pondera)');

  // 16. Comision diferida -> aisla exclusivamente la porcion reducida por Factor Presupuesto
  const dif01 = SIC.calcularDiferidoTrimestral(ctxCL, 'CL-V01', '2026-Q2', {
    cartera_fuera_estandar: false, observaciones_financieras_graves: false
  });
  check('comision_diferida_trimestral', dif01.diferido_acumulado > 0,
    'diferido_acumulado=' + Math.round(dif01.diferido_acumulado) + ' trimestre=' + dif01.trimestre);

  // 17-19. Liberacion trimestral en los 3 tramos (50% / 75% / 100%). CHANGE
  // REQUEST v1.6: la consistencia trimestral ahora se evalua sobre MESES
  // CALENDARIO (trimInfo.meses), no sobre periodos 26-25 -- con los datos
  // demo migrados, ningun vendedor real de 2026-Q1/Q2 cae exactamente en los
  // 3 tramos de liberacion a la vez que cumple el minimo de IEC trimestral
  // (95%), asi que estos 3 tramos se verifican con un contexto SINTETICO
  // (clonado de ctxCL, sin alterar los datos demo reales) que aisla
  // exactamente la variable que cada tramo prueba: cumplimiento_trimestral.
  // Este mismo patron ya se usaba en tests/run_adapter_tests.js (fixtures
  // sinteticos) para casos limite que los datos reales/demo no cubren hoy.
  const ctxCLSint = JSON.parse(JSON.stringify(ctxCL));
  function agregarVendedorSintetico(id, ventaMensual) {
    ['2026-01', '2026-02', '2026-03'].forEach(function (mes) {
      ctxCLSint.presupuestos.push({ vendedor_id: id, mes: mes, presupuesto: 100000 });
      ctxCLSint.iec.push({ vendedor_id: id, mes: mes, iec_pct: 100, ventas_sobre_piso_clp: ventaMensual, ventas_bajo_piso_clp: 0, ventas_no_evaluables_clp: 0 });
      ctxCLSint.ventas.push({ factura: 'SINT-' + id + '-' + mes, fecha_factura: mes + '-15', vendedor_id: id, cliente_nombre: 'SINTETICO (prueba de tramo)', tipo_cliente: 'Distribuidor', producto: 'SINTETICO', formato: 'SINTETICO', venta_neta: ventaMensual, precio_venta_unitario: 100, precio_piso_unitario: 50, piso_situacion: 'cumple' });
    });
  }
  agregarVendedorSintetico('SIC-SINT-Q1-50', 102000);  // 306.000 / 300.000 = 102% -> tramo 100-104,99% = 50%
  agregarVendedorSintetico('SIC-SINT-Q1-75', 107000);  // 321.000 / 300.000 = 107% -> tramo 105-109,99% = 75%
  agregarVendedorSintetico('SIC-SINT-Q1-100', 115000); // 345.000 / 300.000 = 115% -> tramo >=110% = 100%

  const difQ1_50 = SIC.calcularDiferidoTrimestral(ctxCLSint, 'SIC-SINT-Q1-50', '2026-Q1', {
    cartera_fuera_estandar: false, observaciones_financieras_graves: false
  });
  check('liberacion_trimestral_50pct', difQ1_50.pct_liberacion_final === 50,
    'cumpl_trim=' + difQ1_50.cumplimiento_trimestral.toFixed(1) + '% (sintetico, IEC trimestral=' + difQ1_50.iec_trimestral.toFixed(1) + '%)');

  const difQ1_75 = SIC.calcularDiferidoTrimestral(ctxCLSint, 'SIC-SINT-Q1-75', '2026-Q1', {
    cartera_fuera_estandar: false, observaciones_financieras_graves: false
  });
  check('liberacion_trimestral_75pct', difQ1_75.pct_liberacion_final === 75,
    'cumpl_trim=' + difQ1_75.cumplimiento_trimestral.toFixed(1) + '% (sintetico, IEC trimestral=' + difQ1_75.iec_trimestral.toFixed(1) + '%)');

  const difQ1_100 = SIC.calcularDiferidoTrimestral(ctxCLSint, 'SIC-SINT-Q1-100', '2026-Q1', {
    cartera_fuera_estandar: false, observaciones_financieras_graves: false
  });
  check('liberacion_trimestral_100pct', difQ1_100.pct_liberacion_final === 100,
    'cumpl_trim=' + difQ1_100.cumplimiento_trimestral.toFixed(1) + '% (sintetico, IEC trimestral=' + difQ1_100.iec_trimestral.toFixed(1) + '%)');

  // El caso "0% no cumple" SI se demuestra con datos demo reales -- CL-V04 en
  // 2026-Q2 tiene cumplimiento trimestral bajo (55.1%, meses abril/mayo/junio),
  // insuficiente para cualquier tramo de liberacion.
  const difQ2_V04 = SIC.calcularDiferidoTrimestral(ctxCL, 'CL-V04', '2026-Q2', {
    cartera_fuera_estandar: false, observaciones_financieras_graves: false
  });
  check('liberacion_trimestral_0pct_no_cumple', difQ2_V04.pct_liberacion_final === 0,
    'cumpl_trim=' + difQ2_V04.cumplimiento_trimestral.toFixed(1) + '% liberado=' + Math.round(difQ2_V04.monto_liberado) + ' de ' + Math.round(difQ2_V04.diferido_acumulado));

  // 20. Nota de credito -> ajuste negativo aplicado en el ciclo de emision (append-only, no reescribe ciclos cerrados)
  check('nota_de_credito', r1.ajustes_nc > 0,
    'ajustes_nc=' + Math.round(r1.ajustes_nc) + ' (factura con NC: CL-2026-07-010)');

  // 21 y 22. Generacion de PDF y consistencia pantalla <-> PDF
  const vendedorObj = ctxCL.vendedores.find(v => v.id === 'CL-V01');
  const acciones1 = SIC.simularAcciones(ctxCL, 'CL-V01', '2026-07');
  const htmlPdf = SICPDF._construirHtml({ pais: 'CL', vendedor: vendedorObj, resultado: r1, diferido: dif01, acciones: acciones1, params: ctxCL.params });
  check('generacion_pdf', typeof htmlPdf === 'string' && htmlPdf.indexOf('INFORME EJECUTIVO DE GESTION COMERCIAL') !== -1 && htmlPdf.indexOf('<tbody>') !== -1,
    'longitud_html=' + htmlPdf.length);

  function fmtCL(n) { return 'CLP ' + (Math.round(n || 0)).toLocaleString('es-CL'); }
  const liberadaEnPantallaFmt = fmtCL(r1.comision_liberada);
  const potencialEnPantallaFmt = fmtCL(r1.comision_potencial);
  const consistente = htmlPdf.indexOf(liberadaEnPantallaFmt) !== -1 && htmlPdf.indexOf(potencialEnPantallaFmt) !== -1
    && htmlPdf.indexOf(String(r1.detalle_facturas.length ? '' : '')) !== -1; // placeholder, ver conteo de filas abajo
  const filasEnPdf = (htmlPdf.match(/<tr>/g) || []).length; // incluye filas de tablas de resumen + detalle
  check('consistencia_pantalla_pdf', htmlPdf.indexOf(liberadaEnPantallaFmt) !== -1 && htmlPdf.indexOf(potencialEnPantallaFmt) !== -1,
    'comision_liberada=' + liberadaEnPantallaFmt + ' presente_en_pdf=' + (htmlPdf.indexOf(liberadaEnPantallaFmt) !== -1) + ' | potencial presente=' + (htmlPdf.indexOf(potencialEnPantallaFmt) !== -1));

  // Verificaciones adicionales Peru (misma logica, otro pais/moneda)
  const rp1 = SIC.calcularVendedorCiclo(ctxPE, 'PE-V01', '2026-07');
  const peNoCobro = rp1.detalle_facturas.find(f => f.comision_liberada === 0 && f.estado === 'potencial');
  check('peru_venta_no_cobrada', !!peNoCobro, peNoCobro ? peNoCobro.factura : 'no encontrada');
  // CHANGE REQUEST SIC-AV v1.4: una venta bajo piso no autorizada en Peru,
  // si esta pagada, tambien debe entrar al calculo normal, igual que en Chile
  // -- misma logica, sin distincion por pais. CHANGE REQUEST v1.6: el monto
  // exacto ya no se exige > 0 (puede ser 0 por el Factor de Presupuesto del
  // mes de desempeño, sin relacion con el piso) -- se verifica en cambio que
  // coincide EXACTO con la formula general, sin reduccion extra por piso.
  const peNoAut = rp1.detalle_facturas.find(f => f.piso_situacion === 'no_autorizada');
  const pagoPeNoAut = peNoAut && peNoAut.pagos && peNoAut.pagos[0];
  const ajustadaEsperadaPe = pagoPeNoAut ? pagoPeNoAut.comision_base * (rp1.factor_presupuesto / 100) * (rp1.factor_iec / 100) : null;
  check('peru_bajo_piso_no_autorizada_sin_reduccion',
    peNoAut && peNoAut.factor_piso === undefined &&
    (pagoPeNoAut ? Math.abs(pagoPeNoAut.comision_ajustada - ajustadaEsperadaPe) < 0.01 : true),
    peNoAut ? (peNoAut.factura + ' comision_ajustada=' + (pagoPeNoAut ? pagoPeNoAut.comision_ajustada.toFixed(2) : 'sin pagos') + ' (factor_presupuesto=' + rp1.factor_presupuesto + '% este ciclo)') : 'no encontrada');

  // =========================================================================
  // CHANGE REQUEST SIC-AV v1.2 -- SELECTOR DE CICLO HISTORICO
  // =========================================================================

  // 23. Selector con al menos 6 ciclos, en ambos paises, cada uno con
  // nombre/fechas/estado disponibles para renderizar la opcion.
  check('selector_al_menos_6_ciclos',
    ctxCL.params.ciclos.length >= 6 && ctxPE.params.ciclos.length >= 6 &&
    ctxCL.params.ciclos.every(c => c.ciclo && c.inicio && c.cierre && c.estado) &&
    ctxPE.params.ciclos.every(c => c.ciclo && c.inicio && c.cierre && c.estado),
    'CL=' + ctxCL.params.ciclos.length + ' ciclos, PE=' + ctxPE.params.ciclos.length + ' ciclos, todos con inicio/cierre/estado');

  // 24. Cambio de ciclo Chile -> resultados de un ciclo cerrado antiguo son
  // distintos (y coherentes) respecto al ciclo vigente para el mismo vendedor.
  const rClVigente = SIC.calcularVendedorCiclo(ctxCL, 'CL-V01', '2026-07');
  const rClCerrado = SIC.calcularVendedorCiclo(ctxCL, 'CL-V01', '2026-04');
  check('cambio_de_ciclo_chile',
    rClCerrado.ciclo === '2026-04' && rClCerrado.ciclo_info.estado === 'cerrado' &&
    rClCerrado.presupuesto_mes !== rClVigente.presupuesto_mes &&
    rClCerrado.venta_facturada_periodo !== rClVigente.venta_facturada_periodo,
    'vigente(2026-07): presupuesto_mes=' + Math.round(rClVigente.presupuesto_mes) + ' | cerrado(2026-04): presupuesto_mes=' + Math.round(rClCerrado.presupuesto_mes) + ' estado=' + rClCerrado.ciclo_info.estado);

  // 25. Cambio de ciclo Peru -> mismo comportamiento, independiente de Chile.
  const rPeVigente = SIC.calcularVendedorCiclo(ctxPE, 'PE-V01', '2026-07');
  const rPeCerrado = SIC.calcularVendedorCiclo(ctxPE, 'PE-V01', '2026-04');
  check('cambio_de_ciclo_peru',
    rPeCerrado.ciclo === '2026-04' && rPeCerrado.ciclo_info.estado === 'cerrado' &&
    rPeCerrado.presupuesto_mes !== rPeVigente.presupuesto_mes,
    'vigente(2026-07): presupuesto_mes=' + Math.round(rPeVigente.presupuesto_mes) + ' | cerrado(2026-04): presupuesto_mes=' + Math.round(rPeCerrado.presupuesto_mes));

  // 26. Actualizacion de tarjetas -- comision potencial/liberada/pendiente
  // difieren entre ciclo vigente y un ciclo cerrado (el cambio de ciclo
  // realmente recalcula las tarjetas, no solo el encabezado).
  check('actualizacion_de_tarjetas',
    rClVigente.comision_potencial !== rClCerrado.comision_potencial &&
    rClVigente.comision_liberada !== rClCerrado.comision_liberada,
    'liberada vigente=' + Math.round(rClVigente.comision_liberada) + ' vs liberada cerrado(2026-04)=' + Math.round(rClCerrado.comision_liberada));

  // 27. Actualizacion de detalle -- el detalle por factura del ciclo cerrado
  // seleccionado es una lista distinta (facturas propias de ESE periodo),
  // no el detalle del ciclo vigente.
  check('actualizacion_de_detalle',
    rClCerrado.detalle_facturas.length > 0 &&
    JSON.stringify(rClCerrado.detalle_facturas.map(f => f.factura).sort()) !== JSON.stringify(rClVigente.detalle_facturas.map(f => f.factura).sort()),
    'facturas ciclo 2026-04=' + rClCerrado.detalle_facturas.length + ', facturas ciclo 2026-07=' + rClVigente.detalle_facturas.length + ' (listas distintas)');

  // 28. PDF del ciclo seleccionado -- el informe generado para un ciclo
  // CERRADO refleja el nombre/fechas/estado de ESE ciclo, no el del vigente.
  // CHANGE REQUEST v1.6: trimestres[].ciclos se renombro a trimestres[].meses
  // (meses calendario de desempeño). Se busca por el mes de desempeño del
  // ciclo '2026-04' (que es '2026-03'), no por el codigo de ciclo directo.
  const trimCerrado = ctxCL.params.trimestres.find(t => t.meses.indexOf(SIC.mesDesempenoDe('2026-04')) !== -1);
  const difCerrado = SIC.calcularDiferidoTrimestral(ctxCL, 'CL-V01', trimCerrado.trimestre, {
    cartera_fuera_estandar: false, observaciones_financieras_graves: false
  });
  const accionesCerrado = SIC.simularAcciones(ctxCL, 'CL-V01', '2026-04');
  const htmlPdfCerrado = SICPDF._construirHtml({ pais: 'CL', vendedor: vendedorObj, resultado: rClCerrado, diferido: difCerrado, acciones: accionesCerrado, params: ctxCL.params });
  // CHANGE REQUEST v1.6: la portada del PDF ya no muestra un nombre de
  // "ciclo comercial" -- muestra por separado el Período de cobranza (fechas
  // 26-25) y el Mes de desempeño aplicado (mes calendario). Para el ciclo
  // '2026-04' eso es el período 26/03/2026-25/04/2026 con mes de desempeño
  // "Marzo 2026" -- y no debe contener el mes de desempeño del ciclo
  // vigente ('2026-07' -> "Junio 2026").
  check('pdf_del_ciclo_seleccionado',
    htmlPdfCerrado.indexOf('Marzo 2026') !== -1 &&
    htmlPdfCerrado.indexOf('26/03/2026') !== -1 && htmlPdfCerrado.indexOf('25/04/2026') !== -1 &&
    htmlPdfCerrado.indexOf('Junio 2026') === -1,
    'PDF del ciclo 2026-04 contiene su mes de desempeño ("Marzo 2026") y sus fechas de período (26/03/2026 a 25/04/2026), y NO contiene "Junio 2026" (mes de desempeño del ciclo vigente 2026-07)');

  // 29. Preservacion del ciclo vigente -- consultar ciclos cerrados no debe
  // alterar cual es el ciclo vigente del sistema.
  check('preservacion_ciclo_vigente',
    ctxCL.params.ciclo_vigente === '2026-07' && ctxPE.params.ciclo_vigente === '2026-07' &&
    ctxCL.params.ciclos.find(c => c.ciclo === ctxCL.params.ciclo_vigente).estado === 'vigente',
    'ciclo_vigente CL=' + ctxCL.params.ciclo_vigente + ' PE=' + ctxPE.params.ciclo_vigente + ' (no cambia tras consultar ciclos cerrados)');

  // 30. Aislamiento por pais -- los ciclos de Chile y Peru son listas
  // independientes (mismas fechas de calendario, pero cargadas por separado
  // desde sus propios parametros_<pais>.json, sin mezclarse).
  check('aislamiento_por_pais_ciclos',
    ctxCL.params.ciclos.length === ctxPE.params.ciclos.length &&
    ctxCL.params.ciclos !== ctxPE.params.ciclos &&
    ctxCL.pais === 'CL' && ctxPE.pais === 'PE',
    'CL y PE cargan arreglos de ciclos independientes (' + ctxCL.params.ciclos.length + ' cada uno), sin compartir referencia');

  // 31. Ciclo cerrado no cambia al "modificar" (consultar) parametros actuales --
  // calcular el ciclo cerrado 2026-04 antes y despues de calcular el vigente
  // 2026-07 debe dar exactamente el mismo resultado (sin efectos de estado
  // compartido / sin recalculo con el contexto del ciclo "actual").
  const rClCerradoAntes = SIC.calcularVendedorCiclo(ctxCL, 'CL-V01', '2026-04');
  SIC.calcularVendedorCiclo(ctxCL, 'CL-V01', '2026-07'); // simula "ver el ciclo vigente" en medio
  const rClCerradoDespues = SIC.calcularVendedorCiclo(ctxCL, 'CL-V01', '2026-04');
  check('ciclo_cerrado_no_cambia',
    rClCerradoAntes.comision_final === rClCerradoDespues.comision_final &&
    rClCerradoAntes.presupuesto_mes === rClCerradoDespues.presupuesto_mes &&
    rClCerradoAntes.cumplimiento_pct === rClCerradoDespues.cumplimiento_pct &&
    JSON.stringify(rClCerradoAntes.detalle_facturas.map(f => f.factura)) === JSON.stringify(rClCerradoDespues.detalle_facturas.map(f => f.factura)),
    'comision_final ciclo 2026-04 antes=' + Math.round(rClCerradoAntes.comision_final) + ' despues=' + Math.round(rClCerradoDespues.comision_final) + ' (identico, sin efectos de estado compartido)');

  // =========================================================================
  // CHANGE REQUEST SIC-AV v1.3 -- PAGINA "POLITICA Y FACTORES"
  // =========================================================================

  // 32. Tabla de presupuesto correcta -- los 3 tramos definitivos, tal como
  // deben aparecer en la pagina de politica.
  check('politica_tabla_presupuesto_correcta',
    ctxCL.params.factor_presupuesto_tramos.length === 3 &&
    ctxCL.params.factor_presupuesto_tramos[0].factor === 0 &&
    ctxCL.params.factor_presupuesto_tramos[1].factor === 80 &&
    ctxCL.params.factor_presupuesto_tramos[2].factor === 100,
    'tramos=' + JSON.stringify(ctxCL.params.factor_presupuesto_tramos.map(t => t.factor)));

  // 33. Tabla Chile -- 6 tramos de cartera, sin distincion de tipo de cliente,
  // exactamente como se pide en la pagina de politica.
  check('politica_tabla_chile_correcta',
    Array.isArray(ctxCL.params.tasa_cartera) && ctxCL.params.tasa_cartera.length === 6 &&
    JSON.stringify(ctxCL.params.tasa_cartera.map(t => t.tasa)) === JSON.stringify([8, 7.5, 6, 3, 2.5, 0.5]),
    'tasas CL=' + JSON.stringify(ctxCL.params.tasa_cartera.map(t => t.tasa)));

  // 34. Tabla Peru -- 6 tramos propios, distintos de los de Chile (31-60/61-120/121-180 vs 31-180/181-210/211-360).
  const tablaCarteraPe = ctxPE.params.tasa_cartera.Distribuidor;
  check('politica_tabla_peru_correcta',
    tablaCarteraPe.length === 6 &&
    JSON.stringify(tablaCarteraPe.map(t => t.tasa)) === JSON.stringify([8, 7.5, 6, 5, 2.5, 0.5]) &&
    JSON.stringify(tablaCarteraPe.map(t => t.max_dias)) === JSON.stringify([0, 30, 60, 120, 180, null]),
    'tasas PE=' + JSON.stringify(tablaCarteraPe.map(t => t.tasa)) + ' dias=' + JSON.stringify(tablaCarteraPe.map(t => t.max_dias)));

  // 35. Tabla IEC -- 5 tramos definitivos.
  check('politica_tabla_iec_correcta',
    ctxCL.params.factor_iec_tramos.length === 5 &&
    JSON.stringify(ctxCL.params.factor_iec_tramos.map(t => t.factor)) === JSON.stringify([20, 70, 80, 90, 105]),
    'factores IEC=' + JSON.stringify(ctxCL.params.factor_iec_tramos.map(t => t.factor)));

  // 36. Bono por excedente -- el ejemplo de la pagina (100.000 / 120.000 / 20.000 / 400) es correcto.
  const ejPptoPol = 100000, ejVentaPol = 120000, ejExcedentePol = ejVentaPol - ejPptoPol;
  const ejBonoPol = ejExcedentePol * (ctxCL.params.bono_excedente_pct / 100);
  check('politica_bono_excedente_ejemplo',
    ejExcedentePol === 20000 && ejBonoPol === 400,
    'presupuesto=' + ejPptoPol + ' venta=' + ejVentaPol + ' excedente=' + ejExcedentePol + ' bono=' + ejBonoPol);

  // 37. CHANGE REQUEST SIC-AV v1.4 -- el Factor de Precio Piso se elimino
  // por completo del motor: ya no debe existir params.factor_piso ni la
  // funcion SIC.factorPiso en ninguno de los dos paises.
  check('politica_precio_piso_eliminado',
    ctxCL.params.factor_piso === undefined && ctxPE.params.factor_piso === undefined &&
    typeof SIC.factorPiso === 'undefined' && typeof SIC.clasificacionPiso === 'function',
    'factor_piso ausente en parametros de ambos paises; SIC.factorPiso ya no existe; SIC.clasificacionPiso disponible como clasificacion informativa');

  // 38. Consistencia trimestral -- tramos de liberacion vigentes (50/75/100%) y
  // condicion de aislamiento (nunca recupera IEC/cartera/piso/NC/devoluciones,
  // documentada aparte de la formula de calculo real ya validada en la prueba
  // "comision_diferida_trimestral").
  check('politica_consistencia_trimestral_tramos',
    JSON.stringify(ctxCL.params.diferido_trimestral.liberacion.map(t => t.pct_liberacion)) === JSON.stringify([50, 75, 100]),
    'tramos=' + JSON.stringify(ctxCL.params.diferido_trimestral.liberacion.map(t => t.pct_liberacion)));

  // 39. PDF de politica -- se genera y contiene las tablas/version/pais/vigencia/fecha de generacion.
  const htmlPoliticaCL = SICPDF._construirHtmlPolitica({ pais: 'CL', ciclo: '2026-07', params: ctxCL.params });
  check('pdf_politica_generado',
    typeof htmlPoliticaCL === 'string' &&
    htmlPoliticaCL.indexOf('POLITICA Y FACTORES DEL SIC-AV') !== -1 &&
    htmlPoliticaCL.indexOf('Chile') !== -1 &&
    htmlPoliticaCL.indexOf(ctxCL.params.ciclos.filter(c => c.ciclo === '2026-07')[0].policy_version) !== -1 &&
    htmlPoliticaCL.indexOf('Vigente desde') !== -1 &&
    htmlPoliticaCL.indexOf('Fecha de generacion') !== -1 &&
    htmlPoliticaCL.indexOf('Factor de Cumplimiento de Presupuesto') !== -1 &&
    htmlPoliticaCL.indexOf('Bono por Excedente') !== -1 &&
    htmlPoliticaCL.indexOf('Edad de Cartera') !== -1 &&
    htmlPoliticaCL.indexOf('Factor IEC') !== -1 &&
    htmlPoliticaCL.indexOf('Precio Piso') !== -1 &&
    htmlPoliticaCL.indexOf('Bono de Consistencia Trimestral') !== -1,
    'longitud_html=' + htmlPoliticaCL.length + ' (todas las secciones y metadatos presentes)');

  // 40. Aislamiento por pais -- el PDF de politica de Chile NO debe contener
  // los tramos de dias propios de Peru (31-60/61-120/121-180 dias), y viceversa.
  const htmlPoliticaPE = SICPDF._construirHtmlPolitica({ pais: 'PE', ciclo: '2026-07', params: ctxPE.params });
  check('politica_aislamiento_por_pais',
    htmlPoliticaCL.indexOf('31-60 dias') === -1 && htmlPoliticaCL.indexOf('61-120 dias') === -1 &&
    htmlPoliticaPE.indexOf('31-180 dias') === -1 && htmlPoliticaPE.indexOf('181-210 dias') === -1 &&
    htmlPoliticaCL.indexOf('Edad de Cartera — Chile') !== -1 && htmlPoliticaPE.indexOf('Edad de Cartera — Peru') !== -1,
    'PDF Chile solo muestra tramos de Chile, PDF Peru solo muestra tramos de Peru');

  console.log('\n\n========== RESUMEN MOTOR + PDF ==========');
  let todoOk = true;
  resultados.forEach(r => { if (!r.ok) todoOk = false; });
  console.log(resultados.filter(r => r.ok).length + '/' + resultados.length + ' pruebas OK');
  console.log('RESULTADO GLOBAL:', todoOk ? 'TODO OK' : 'HAY FALLOS');

  fs.writeFileSync(path.join(__dirname, '_last_run_engine.json'), JSON.stringify(resultados, null, 2));
  process.exit(todoOk ? 0 : 1);
})();
