/**
 * SIC-AV — Motor de calculo (prototipo, Fase 4)
 * =============================================================
 * MODELO DEMOSTRATIVO -- PENDIENTE DE APROBACION GERENCIAL.
 * No conectado a datos productivos de AV LATAM Board.
 * No usa nombres reales de vendedores, clientes ni facturas.
 *
 * Este archivo implementa, en JavaScript puro (sin dependencias externas),
 * el modelo descrito en docs/sic_av/SIC_AV_POLICY_V1.md, actualizado por:
 *   - CHANGE REQUEST SIC-AV v1.1 (2026-07-12): Factor de Cumplimiento de
 *     Presupuesto por tramos fijos (0% / 80% / 100%). El factor nunca supera 100%.
 *   - CHANGE REQUEST SIC-AV v1.3 (2026-07-13): Factor IEC tambien por tramos
 *     fijos (20% / 70% / 80% / 90% / 105%), reemplazando por completo la
 *     curva continua/interpolada anterior -- ya NO existe interpolacion en
 *     ningun factor del sistema; unica fuente de verdad entre motor,
 *     dashboard, PDF y la pagina "Politica y Factores" (sic_politica.html).
 *   - CHANGE REQUEST SIC-AV v1.4 (2026-07-13): se ELIMINO por completo el
 *     Factor de Precio Piso del calculo de comision (decision de Gerencia
 *     General: toda venta facturada es una operacion valida y previamente
 *     aprobada por la compañia, el SIC no aplica controles adicionales de
 *     autorizacion por precio piso). Una venta bajo piso ya NO produce
 *     comision cero, bloqueo, retencion ni excepcion manual -- entra al
 *     calculo normal igual que cualquier otra venta. El precio piso se
 *     mantiene unicamente como dato informativo por factura, insumo del
 *     Factor IEC (ver data/iec_<pais>_demo.json) y clasificacion de la venta
 *     (sobre piso / bajo piso / no evaluable, ver SIC.clasificacionPiso). El
 *     IEC es el UNICO mecanismo por el cual el precio piso impacta la
 *     comision.
 *   - CHANGE REQUEST SIC-AV v1.6 (2026-07-13): ARQUITECTURA TEMPORAL
 *     DEFINITIVA -- se elimina el concepto "Presupuesto del ciclo 26-25".
 *     El SIC opera con DOS periodos distintos, coordinados pero no
 *     mezclados (ver TEMPORAL_MODEL_AUDIT_v1.6.md y TEMPORAL_MODEL_v1.6.md):
 *       (A) PERIODO DE COBRANZA (26 del mes anterior -> 25 del mes actual,
 *           definicion sin cambios en `ctx.params.ciclos`): determina cobros
 *           efectivamente recibidos, facturas cobradas, edad de cartera,
 *           tasa base de comision y la liquidacion del periodo.
 *       (B) MES DE DESEMPEÑO (el ultimo mes calendario completamente
 *           cerrado -- por definicion, el mes calendario anterior al mes de
 *           cierre del periodo de cobranza): determina presupuesto, venta
 *           neta del mes, cumplimiento de presupuesto, Factor de
 *           Presupuesto, IEC, Factor IEC y Bono por Excedente.
 *     Formula oficial revisada:
 *       Cobros efectivos del periodo 26-25 x Tasa segun edad de cartera
 *         x Factor de Cumplimiento del mes calendario cerrado
 *         x Factor IEC del mismo mes calendario cerrado
 *       + Bono por Excedente del mes calendario cerrado
 *       - Notas de Credito - Devoluciones - Ajustes aplicables
 *       = Remuneracion Variable del periodo
 *     El Bono por Excedente YA NO se pondera por Factor IEC (formula v1.6:
 *     Bono = Excedente del mes x 2%, donde Excedente = venta neta del mes -
 *     presupuesto del mismo mes; si el resultado es <= 0, Bono = 0). No se
 *     prorratea presupuesto entre dos meses para formar un "presupuesto de
 *     ciclo" -- el presupuesto y el IEC se leen o calculan directamente
 *     sobre el mes calendario correspondiente.
 *
 * Parametrizado desde data/parametros_<pais>.json -- ningun valor de la
 * formula esta hardcodeado aqui, todo se lee desde esa tabla configurable.
 *
 * Formula definitiva (CHANGE REQUEST SIC-AV v1.6):
 *   Comision Base por Pago = Monto Cobrado (periodo 26-25) x Tasa por Edad de Cartera
 *   Comision Ajustada = Comision Base x Factor Presupuesto (mes desempeño) x Factor IEC (mes desempeño)
 *   Bono por Excedente = max(0, Venta Neta Mes - Presupuesto Mes) x 2%  [SIN Factor IEC, ver v1.6]
 *   Comision Final del Periodo = Suma(Comision Ajustada) + Bono Excedente + Bono Consistencia Trimestral
 *                                - Notas de Credito - Devoluciones - Ajustes autorizados
 *
 * La edad de cartera NUNCA se cuenta dos veces: vive unicamente en la tasa
 * variable (SIC.tasaCartera), no existe un factor de cartera adicional.
 */
(function (global) {
  "use strict";

  var SIC = {};

  // ---------------------------------------------------------------------
  // Utilidades de fecha
  // ---------------------------------------------------------------------
  SIC.diasEntre = function (fechaA, fechaB) {
    var a = new Date(fechaA + "T00:00:00");
    var b = new Date(fechaB + "T00:00:00");
    return Math.round((b - a) / 86400000);
  };

  SIC.hoyDemo = function () {
    // Fecha de referencia del prototipo (fija, para reproducibilidad de la demo).
    // Se fija cerca del cierre del ciclo vigente (2026-07-25) para que los
    // pagos de ejemplo de este ciclo ya hayan ocurrido. En una integracion
    // real esto seria new Date().
    return "2026-07-24";
  };

  // ---------------------------------------------------------------------
  // A2. Aritmetica de meses (CHANGE REQUEST SIC-AV v1.6) -- todas las
  // funciones trabajan sobre codigos "YYYY-MM", sin depender de Date() para
  // evitar problemas de huso horario.
  // ---------------------------------------------------------------------
  SIC._shiftMes = function (mesCode, delta) {
    var partes = mesCode.split("-");
    var y = parseInt(partes[0], 10), m = parseInt(partes[1], 10);
    var total = (y * 12 + (m - 1)) + delta;
    var yy = Math.floor(total / 12);
    var mm = (total % 12) + 1;
    return yy + "-" + (mm < 10 ? "0" + mm : String(mm));
  };

  // Mes de desempeño de un periodo de cobranza 26-25: el mes calendario
  // inmediatamente anterior al mes de cierre del periodo (CHANGE REQUEST
  // v1.6, seccion 1.B -- ej. periodo con cierre 25 de junio -> mes de
  // desempeño = mayo).
  SIC.mesDesempenoDe = function (cicloCode) {
    return SIC._shiftMes(cicloCode, -1);
  };

  // Inversa: dado un mes de desempeño, el periodo de cobranza que lo liquida
  // (el que cierra el mes calendario siguiente).
  SIC.periodoQueLiquidaMes = function (mesCode) {
    return SIC._shiftMes(mesCode, 1);
  };

  SIC._diasEnMes = function (anio, mes1a12) {
    return new Date(anio, mes1a12, 0).getDate();
  };

  // Rango completo (dia 1 al ultimo dia) del mes calendario correspondiente
  // a un codigo "YYYY-MM" -- usado para presupuesto/venta neta/IEC del mes
  // de desempeño, NUNCA para el periodo de cobranza (que sigue siendo 26-25).
  SIC.rangoMesCalendario = function (mesCode) {
    var partes = mesCode.split("-");
    var y = parseInt(partes[0], 10), m = parseInt(partes[1], 10);
    var ultimoDia = SIC._diasEnMes(y, m);
    var mm = m < 10 ? "0" + m : String(m);
    return { inicio: mesCode + "-01", cierre: mesCode + "-" + (ultimoDia < 10 ? "0" + ultimoDia : String(ultimoDia)) };
  };

  // ---------------------------------------------------------------------
  // B. Tasa por Edad de Cartera -- unica fuente del efecto de cartera (Opcion 1)
  // Chile (Politica V1.1): tabla unica por dias, sin distincion de tipo de
  // cliente -- params.tasa_cartera es un arreglo plano.
  // Peru: se mantiene la tabla por tipo de cliente (objeto con sub-tablas).
  // ---------------------------------------------------------------------
  SIC.tasaCartera = function (params, tipoCliente, dias) {
    var tabla = Array.isArray(params.tasa_cartera)
      ? params.tasa_cartera
      : (params.tasa_cartera[tipoCliente] || params.tasa_cartera["Distribuidor"]);
    for (var i = 0; i < tabla.length; i++) {
      var tramo = tabla[i];
      if (tramo.max_dias === null || dias <= tramo.max_dias) {
        return tramo.tasa;
      }
    }
    return tabla[tabla.length - 1].tasa;
  };

  // ---------------------------------------------------------------------
  // C. Factor de Cumplimiento de Presupuesto (Politica V1.1 -- tramos fijos,
  // reemplaza el Modelo C continuo/interpolado de la version anterior).
  // < 90% -> 0% | 90% - 99,99% -> 80% | >= 100% -> 100%. NUNCA supera 100%.
  // ---------------------------------------------------------------------
  SIC.factorPresupuesto = function (params, cumplPct) {
    var tramos = params.factor_presupuesto_tramos;
    for (var i = 0; i < tramos.length; i++) {
      var t = tramos[i];
      if (cumplPct >= t.min_cumpl && (t.max_cumpl === null || cumplPct <= t.max_cumpl)) {
        return t.factor;
      }
    }
    // Defensivo: los tramos de la politica cubren todo el rango >= 0, esto
    // solo se alcanzaria con datos invalidos (cumplimiento negativo).
    return tramos[0].factor;
  };

  // ---------------------------------------------------------------------
  // D. Factor IEC (Politica V1.2 -- tramos fijos, reemplaza la curva
  // continua/interpolada anterior). El margen NUNCA participa aqui --
  // el IEC solo representa disciplina de precio piso, no rentabilidad.
  // < 70% -> 20% | 70%-84,99% -> 70% | 85%-91,99% -> 80% | 92%-94,99% -> 90% | >= 95% -> 105%.
  // ---------------------------------------------------------------------
  SIC.factorIEC = function (params, iecPct) {
    var tramos = params.factor_iec_tramos;
    for (var i = 0; i < tramos.length; i++) {
      var t = tramos[i];
      if (iecPct >= t.min_iec && (t.max_iec === null || iecPct <= t.max_iec)) {
        return t.factor;
      }
    }
    // Defensivo: los tramos de la politica cubren todo el rango >= 0.
    return tramos[0].factor;
  };

  // ---------------------------------------------------------------------
  // E. Precio Piso -- CHANGE REQUEST SIC-AV v1.4: eliminado como factor de
  // comision (ya no existe SIC.factorPiso ni ninguna reduccion/veto de
  // comision basada en precio piso). Se mantiene unicamente como:
  //   - dato informativo por factura (precio_venta_unitario vs
  //     precio_piso_unitario, piso_situacion crudo);
  //   - insumo del Factor IEC (data/iec_<pais>_demo.json ya agrega
  //     ventas_sobre_piso / ventas_bajo_piso / ventas_no_evaluables);
  //   - clasificacion de la venta para presentacion (ver funcion siguiente).
  // El IEC es el UNICO mecanismo por el cual el precio piso impacta la
  // comision -- una venta bajo piso, por si sola, nunca produce comision
  // cero, reduccion adicional, bloqueo, retencion ni excepcion manual.
  // ---------------------------------------------------------------------
  SIC.clasificacionPiso = function (pisoSituacion) {
    if (pisoSituacion === "cumple") return "sobre_piso";
    if (pisoSituacion === "autorizada" || pisoSituacion === "no_autorizada") return "bajo_piso";
    return "no_evaluable";
  };

  // ---------------------------------------------------------------------
  // Carga de datos (fetch de los JSON locales del prototipo)
  // ---------------------------------------------------------------------
  SIC.cargarPais = function (pais) {
    var prefijo = pais === "CL" ? "chile" : "peru";
    var archivos = {
      parametros: "data/parametros_" + prefijo + ".json",
      vendedores: "data/vendedores_" + prefijo + ".json",
      ventas: "data/ventas_" + prefijo + "_demo.json",
      cobranzas: "data/cobranzas_" + prefijo + "_demo.json",
      presupuestos: "data/presupuestos_" + prefijo + "_demo.json",
      iec: "data/iec_" + prefijo + "_demo.json",
      precios_piso: "data/precios_piso_" + prefijo + "_demo.json"
    };
    var keys = Object.keys(archivos);
    return Promise.all(keys.map(function (k) {
      return fetch(archivos[k]).then(function (r) {
        if (!r.ok) throw new Error("No se pudo cargar " + archivos[k]);
        return r.json();
      });
    })).then(function (results) {
      var data = {};
      keys.forEach(function (k, i) { data[k] = results[i]; });
      return {
        pais: pais,
        params: data.parametros,
        vendedores: data.vendedores.vendedores,
        ventas: data.ventas.ventas,
        cobranzas: data.cobranzas.cobranzas,
        notas_credito: data.cobranzas.notas_credito || [],
        presupuestos: data.presupuestos.presupuestos,
        iec: data.iec.iec,
        precios_piso: data.precios_piso.precios_piso
      };
    });
  };

  // ---------------------------------------------------------------------
  // Helpers de consulta sobre el contexto cargado
  // ---------------------------------------------------------------------
  function cobrosDeFactura(ctx, factura) {
    return ctx.cobranzas.filter(function (c) { return c.factura === factura; });
  }
  function ventasDeVendedorCiclo(ctx, vendedorId, ciclo) {
    var cicloInfo = ctx.params.ciclos.filter(function (c) { return c.ciclo === ciclo; })[0];
    return ctx.ventas.filter(function (v) {
      return v.vendedor_id === vendedorId;
    }).filter(function (v) {
      // una venta "pertenece" al ciclo en que se factura, para efectos de
      // proyeccion; el cobro puede ocurrir en el mismo ciclo o en uno posterior.
      return v.fecha_factura >= cicloInfo.inicio && v.fecha_factura <= cicloInfo.cierre;
    });
  }
  // Facturas relevantes para la vista de un ciclo: las facturadas dentro del
  // ciclo, mas cualquier factura de un ciclo anterior que reciba un pago
  // dentro de este ciclo o que siga con saldo pendiente (cartera vigente) --
  // asi una factura antigua de cobro tardio sigue siendo visible hasta que
  // se resuelve, tal como ocurriria en la operacion real.
  function facturasRelevantesCiclo(ctx, vendedorId, ciclo) {
    var cicloInfo = ctx.params.ciclos.filter(function (c) { return c.ciclo === ciclo; })[0];
    return ctx.ventas.filter(function (v) { return v.vendedor_id === vendedorId; }).filter(function (v) {
      var facturadaEnCiclo = v.fecha_factura >= cicloInfo.inicio && v.fecha_factura <= cicloInfo.cierre;
      var pagoEnCiclo = cobrosDeFactura(ctx, v.factura).some(function (p) {
        return p.fecha_pago >= cicloInfo.inicio && p.fecha_pago <= cicloInfo.cierre;
      });
      var esCarteraViejaPendiente = v.fecha_factura < cicloInfo.inicio && !cobrosDeFactura(ctx, v.factura).some(function (p) {
        return p.fecha_pago <= cicloInfo.cierre;
      });
      return facturadaEnCiclo || pagoEnCiclo || esCarteraViejaPendiente;
    });
  }
  // CHANGE REQUEST SIC-AV v1.6: presupuesto e IEC ya NO se buscan por
  // "ciclo" (periodo de cobranza 26-25) -- se buscan por "mes" (mes de
  // desempeño, el ultimo mes calendario completamente cerrado). Los
  // arreglos ctx.presupuestos/ctx.iec migraron su campo de "ciclo" a "mes"
  // (ver data/presupuestos_*_demo.json, data/iec_*_demo.json y
  // js/sic_data_adapter.js). Si no hay dato para ese mes, retorna null (no
  // 0) para que el llamador pueda distinguir "sin presupuesto/IEC cargado"
  // de "presupuesto/IEC es cero" -- regla v1.6 seccion 13: "Pendiente de
  // carga", nunca inventar ni tratar como cero silenciosamente.
  function presupuestoDelMes(ctx, vendedorId, mesCode) {
    var p = ctx.presupuestos.filter(function (x) { return x.vendedor_id === vendedorId && x.mes === mesCode; })[0];
    return p ? p.presupuesto : null;
  }
  function iecDelMes(ctx, vendedorId, mesCode) {
    var i = ctx.iec.filter(function (x) { return x.vendedor_id === vendedorId && x.mes === mesCode; })[0];
    return i || null;
  }
  // Venta neta del mes de desempeño: suma de venta_neta de TODAS las ventas
  // del vendedor cuya fecha_factura cae dentro del mes calendario completo
  // (dia 1 al ultimo dia), SIN IMPORTAR a que periodo de cobranza 26-25
  // pertenezcan -- es un concepto de mes calendario puro, independiente del
  // periodo de cobranza (CHANGE REQUEST v1.6, seccion 1.B y 2).
  function ventaNetaDelMes(ctx, vendedorId, mesCode) {
    var rango = SIC.rangoMesCalendario(mesCode);
    return ctx.ventas.filter(function (v) {
      return v.vendedor_id === vendedorId && v.fecha_factura >= rango.inicio && v.fecha_factura <= rango.cierre;
    }).reduce(function (s, v) { return s + v.venta_neta; }, 0);
  }
  SIC._helpers = {
    cobrosDeFactura: cobrosDeFactura, ventasDeVendedorCiclo: ventasDeVendedorCiclo, facturasRelevantesCiclo: facturasRelevantesCiclo,
    presupuestoDelMes: presupuestoDelMes, iecDelMes: iecDelMes, ventaNetaDelMes: ventaNetaDelMes
  };

  // ---------------------------------------------------------------------
  // Calculo por factura: retorna el detalle completo de una linea, ya
  // aplicando Factor Presupuesto / Factor IEC del ciclo (que son unicos
  // por vendedor+ciclo). Distingue comision potencial (sobre venta
  // facturada) de comision liberada (sobre lo efectivamente cobrado).
  // CHANGE REQUEST SIC-AV v1.4: toda venta facturada se considera una
  // operacion valida y previamente aprobada por la compañia -- el precio
  // piso ya NO participa en este calculo (ni reduce ni anula la comision
  // de una factura por si solo); solo se conserva como dato informativo y
  // como clasificacion (ver SIC.clasificacionPiso).
  // ---------------------------------------------------------------------
  SIC.calcularFactura = function (ctx, venta, factorPpto, factorIec, hoy) {
    var pagos = cobrosDeFactura(ctx, venta.factura);
    var montoCobrado = pagos.reduce(function (s, p) { return s + p.monto; }, 0);
    var nc = ctx.notas_credito.filter(function (n) { return n.factura === venta.factura; });
    var montoNC = nc.reduce(function (s, n) { return s + n.monto_nc; }, 0);
    var ventaNetaReconocida = venta.venta_neta - montoNC;
    var saldoPendiente = Math.max(0, ventaNetaReconocida - montoCobrado);

    // Comision base y ajustada por cada pago (liberada)
    var comisionBaseLiberada = 0, comisionAjustadaLiberada = 0;
    var detallesPago = pagos.map(function (p) {
      var dias = SIC.diasEntre(venta.fecha_factura, p.fecha_pago);
      var tasa = SIC.tasaCartera(ctx.params, venta.tipo_cliente, dias);
      var base = p.monto * (tasa / 100);
      var ajustada = base * (factorPpto / 100) * (factorIec / 100);
      comisionBaseLiberada += base;
      comisionAjustadaLiberada += ajustada;
      return { fecha_pago: p.fecha_pago, monto: p.monto, dias_al_cobro: dias, tasa_cartera: tasa, comision_base: base, comision_ajustada: ajustada };
    });

    // REVISION GG (2026-07-13), punto 2: la proyeccion sobre saldo no cobrado
    // (comision potencial adicional, estimada con la tasa de los dias
    // transcurridos hasta hoy) SOLO tiene sentido si existe una fuente real
    // de cobranza conectada (ctx.cobranzas con al menos un registro real).
    // Cuando no existe ninguna fuente de cobranza conectada (brecha
    // documentada en DATA_SOURCE_AUDIT.md seccion 3.1 -- caso de los
    // dashboards reales sic_chile.html/sic_peru.html, donde ctx.cobranzas
    // siempre es []), esta proyeccion NO se calcula: no se inventa un monto
    // de comision sobre una cobranza que nunca fue observada. La UI debe
    // mostrar "Pendiente de calculo" (nunca "$0" ni una cifra estimada) en
    // este caso -- ver SIC.calcularVendedorCiclo -> cobranza_fuente_disponible.
    var cobranzaFuenteDisponible = ctx.cobranzas.length > 0;
    var comisionBaseProyectada = 0, comisionAjustadaProyectada = 0;
    if (cobranzaFuenteDisponible) {
      var diasProyeccion = SIC.diasEntre(venta.fecha_factura, hoy);
      if (diasProyeccion < 0) diasProyeccion = 0;
      var tasaProyeccion = SIC.tasaCartera(ctx.params, venta.tipo_cliente, diasProyeccion);
      comisionBaseProyectada = saldoPendiente * (tasaProyeccion / 100);
      comisionAjustadaProyectada = comisionBaseProyectada * (factorPpto / 100) * (factorIec / 100);
    }

    var comisionPotencialTotal = comisionAjustadaLiberada + comisionAjustadaProyectada;

    // Estado de la factura: depende UNICAMENTE del cobro efectivo -- una
    // venta bajo piso (autorizada o no) ya no produce el estado "retenida"
    // ni bloquea el calculo normal de la comision (CHANGE REQUEST v1.4).
    var estado;
    if (montoCobrado <= 0) {
      estado = "potencial";
    } else if (saldoPendiente > 0.01) {
      estado = "pendiente";
    } else {
      estado = "liberada";
    }

    return {
      factura: venta.factura,
      fecha_factura: venta.fecha_factura,
      cliente_nombre: venta.cliente_nombre,
      tipo_cliente: venta.tipo_cliente,
      producto: venta.producto,
      formato: venta.formato,
      cantidad: venta.cantidad,
      precio_venta_unitario: venta.precio_venta_unitario,
      precio_piso_unitario: venta.precio_piso_unitario,
      piso_situacion: venta.piso_situacion,
      clasificacion_piso: SIC.clasificacionPiso(venta.piso_situacion),
      venta_neta: venta.venta_neta,
      venta_neta_reconocida: ventaNetaReconocida,
      monto_cobrado: montoCobrado,
      saldo_pendiente: saldoPendiente,
      pagos: detallesPago,
      dias_al_cobro: detallesPago.length ? detallesPago[detallesPago.length - 1].dias_al_cobro : null,
      tasa_cartera: detallesPago.length ? detallesPago[detallesPago.length - 1].tasa_cartera : tasaProyeccion,
      factor_presupuesto: factorPpto,
      factor_iec: factorIec,
      comision_base: comisionBaseLiberada + comisionBaseProyectada,
      comision_liberada: comisionAjustadaLiberada,
      comision_potencial: comisionPotencialTotal,
      nota_credito_aplicada: montoNC,
      estado: estado
    };
  };

  // ---------------------------------------------------------------------
  // Calculo agregado del ciclo para un vendedor: comision potencial,
  // liberada, pendiente, validada, pagada, bono de excedente, y detalle
  // completo por factura.
  // ---------------------------------------------------------------------
  SIC.calcularVendedorCiclo = function (ctx, vendedorId, ciclo) {
    var hoy = SIC.hoyDemo();
    var cicloInfo = ctx.params.ciclos.filter(function (c) { return c.ciclo === ciclo; })[0];

    // CHANGE REQUEST SIC-AV v1.6: mes de desempeño derivado del periodo de
    // cobranza (el mes calendario inmediatamente anterior al cierre del
    // periodo). Presupuesto, venta neta, cumplimiento, Factor Presupuesto,
    // IEC, Factor IEC y Bono por Excedente se calculan TODOS sobre este mes
    // -- nunca sobre el periodo 26-25 ni prorrateados entre dos meses.
    var mesDesempeno = SIC.mesDesempenoDe(ciclo);
    var mesDesempenoInfo = SIC.rangoMesCalendario(mesDesempeno);

    var presupuestoMes = presupuestoDelMes(ctx, vendedorId, mesDesempeno); // null si no hay dato cargado
    var iecInfo = iecDelMes(ctx, vendedorId, mesDesempeno); // null si no hay dato cargado
    var iecPct = iecInfo ? iecInfo.iec_pct : 0;
    var ventaNetaMes = ventaNetaDelMes(ctx, vendedorId, mesDesempeno);

    var ventasCiclo = facturasRelevantesCiclo(ctx, vendedorId, ciclo);

    // Monto efectivamente cobrado DENTRO DEL PERIODO DE COBRANZA (26-25),
    // sumando TODOS los pagos cuya fecha cae dentro de esa ventana, sin
    // importar en que periodo se facturo la venta original. Este es un
    // indicador del PERIODO DE COBRANZA, no del mes de desempeño -- ya NO
    // se usa para calcular cumplimiento (regla v1.6, seccion 3: "No
    // utilizar cobranzas para calcular cumplimiento").
    var montoCobradoPeriodo = 0;
    ctx.ventas.filter(function (v) { return v.vendedor_id === vendedorId; }).forEach(function (v) {
      cobrosDeFactura(ctx, v.factura).forEach(function (p) {
        if (p.fecha_pago >= cicloInfo.inicio && p.fecha_pago <= cicloInfo.cierre) {
          montoCobradoPeriodo += p.monto;
        }
      });
    });

    // Cumplimiento del MES DE DESEMPEÑO: venta neta del mes / presupuesto
    // del mismo mes -- si falta presupuesto cargado, no se calcula (0%,
    // Factor Presupuesto 0%) para no inventar un cumplimiento sin base.
    var cumplimientoPct = (presupuestoMes !== null && presupuestoMes > 0) ? (ventaNetaMes / presupuestoMes * 100) : 0;
    var factorPpto = SIC.factorPresupuesto(ctx.params, cumplimientoPct);
    var factorIec = SIC.factorIEC(ctx.params, iecPct);

    var detalleFacturas = ventasCiclo.map(function (v) {
      return SIC.calcularFactura(ctx, v, factorPpto, factorIec, hoy);
    });

    var comisionLiberada = detalleFacturas.reduce(function (s, f) { return s + f.comision_liberada; }, 0);
    var comisionPotencial = detalleFacturas.reduce(function (s, f) { return s + f.comision_potencial; }, 0);
    var comisionPendiente = comisionPotencial - comisionLiberada;

    // F. Bono por Excedente del MES DE DESEMPEÑO (formula revisada CHANGE
    // REQUEST v1.6, seccion 5): Excedente = venta neta del mes - presupuesto
    // del mismo mes (nunca negativo); Bono = Excedente x 2%. YA NO se
    // pondera por Factor IEC (a diferencia de la formula v1.1-v1.5) ni se
    // calcula sobre cobranza ni sobre presupuesto prorrateado del periodo
    // 26-25.
    var excedenteMes = (presupuestoMes !== null) ? Math.max(0, ventaNetaMes - presupuestoMes) : 0;
    var bonoExcedente = excedenteMes * (ctx.params.bono_excedente_pct / 100);

    // Ajustes por notas de credito aplicadas EN ESTE periodo de cobranza
    // (sobre ventas de periodos anteriores) -- nunca se reescribe el
    // periodo original. Este ajuste sigue viviendo en el periodo de
    // cobranza (es sobre facturas y su cobro/reconocimiento), no en el mes
    // de desempeño.
    var ajustesNC = 0;
    ctx.notas_credito.forEach(function (n) {
      if (n.ciclo_aplicacion !== ciclo) return;
      var venta = ctx.ventas.filter(function (v) { return v.factura === n.factura; })[0];
      if (!venta) return;
      var perteneceAlPeriodo = venta.fecha_factura >= cicloInfo.inicio && venta.fecha_factura <= cicloInfo.cierre;
      if (perteneceAlPeriodo) return; // si la venta es del propio periodo vigente, ya se reconocio neta de NC arriba
      var tasaOriginal = SIC.tasaCartera(ctx.params, venta.tipo_cliente, 30); // aproximacion: tasa de referencia rapida
      ajustesNC += n.monto_nc * (tasaOriginal / 100);
    });

    var comisionFinal = comisionLiberada + bonoExcedente - ajustesNC;

    var estadoCiclo = cicloInfo.estado; // "cerrado" | "vigente"
    var comisionValidada = estadoCiclo === "cerrado" ? comisionFinal : 0;
    var comisionPagada = estadoCiclo === "cerrado" ? comisionFinal : 0;

    return {
      vendedor_id: vendedorId,
      ciclo: ciclo,
      ciclo_info: cicloInfo,
      // --- MES DE DESEMPEÑO (presupuesto / venta neta / cumplimiento / IEC / excedente / bono) ---
      mes_desempeno: mesDesempeno,
      mes_desempeno_info: mesDesempenoInfo,
      presupuesto_mes: presupuestoMes, // null = "Pendiente de carga" (sin dato)
      venta_neta_mes: ventaNetaMes,
      cumplimiento_pct: cumplimientoPct,
      factor_presupuesto: factorPpto,
      iec_pct: iecPct,
      iec_disponible: iecInfo !== null, // false = "Pendiente de carga" (sin dato)
      factor_iec: factorIec,
      ventas_sobre_piso: iecInfo ? (iecInfo.ventas_sobre_piso_clp !== undefined ? iecInfo.ventas_sobre_piso_clp : iecInfo.ventas_sobre_piso_usd) : 0,
      ventas_bajo_piso: iecInfo ? (iecInfo.ventas_bajo_piso_clp !== undefined ? iecInfo.ventas_bajo_piso_clp : iecInfo.ventas_bajo_piso_usd) : 0,
      ventas_no_evaluables: iecInfo ? (iecInfo.ventas_no_evaluables_clp !== undefined ? iecInfo.ventas_no_evaluables_clp : iecInfo.ventas_no_evaluables_usd) : 0,
      excedente_mes: excedenteMes,
      bono_excedente: bonoExcedente,
      // --- PERIODO DE COBRANZA (26-25): monto cobrado / facturas cobradas / edad de cartera / comision base / ajustes / comision liquidada ---
      venta_facturada_periodo: ventasDeVendedorCiclo(ctx, vendedorId, ciclo).reduce(function (s, v) { return s + v.venta_neta; }, 0),
      venta_cobrada: montoCobradoPeriodo,
      ajustes_nc: ajustesNC,
      comision_base_total: detalleFacturas.reduce(function (s, f) { return s + f.comision_base; }, 0),
      comision_potencial: comisionPotencial,
      comision_liberada: comisionLiberada,
      comision_pendiente: comisionPendiente,
      comision_validada: comisionValidada,
      comision_pagada: comisionPagada,
      comision_final: comisionFinal,
      detalle_facturas: detalleFacturas,
      // Clasificacion informativa (CHANGE REQUEST v1.4): ya no distingue
      // autorizada/no_autorizada -- esa distincion de aprobacion excepcional
      // se elimino del SIC. Solo cuenta cuantas facturas del periodo quedaron
      // clasificadas como "bajo piso", sin que eso afecte la comision.
      ventas_bajo_piso_count: detalleFacturas.filter(function (f) { return f.clasificacion_piso === "bajo_piso"; }).length
    };
  };

  // ---------------------------------------------------------------------
  // G. Comision Diferida Trimestral
  // ---------------------------------------------------------------------
  SIC.calcularDiferidoTrimestral = function (ctx, vendedorId, trimestreCode, condicionesDemo) {
    var trimInfo = ctx.params.trimestres.filter(function (t) { return t.trimestre === trimestreCode; })[0];
    var diferidoAcumulado = 0;
    var presupuestoTrimestral = 0;
    var ventaNetaTrimestral = 0;
    var iecs = [];

    // CHANGE REQUEST SIC-AV v1.6, seccion 6: la consistencia trimestral se
    // evalua sobre MESES CALENDARIO (trimInfo.meses, ej. abril/mayo/junio),
    // no sobre periodos de cobranza 26-25. Para cada mes de desempeño del
    // trimestre se deriva el periodo de cobranza que lo liquida (el que
    // cierra al mes siguiente) para obtener la comision base/liberada real
    // de ese periodo -- pero el presupuesto/venta neta/IEC usados para el
    // cumplimiento trimestral son siempre los del mes calendario.
    trimInfo.meses.forEach(function (mesCode) {
      var cicloDelMes = SIC.periodoQueLiquidaMes(mesCode);
      var r = SIC.calcularVendedorCiclo(ctx, vendedorId, cicloDelMes);
      presupuestoTrimestral += (r.presupuesto_mes || 0);
      ventaNetaTrimestral += r.venta_neta_mes;
      iecs.push(r.iec_pct);
      // La porcion diferida es exactamente lo que el Factor de Presupuesto
      // redujo, aislado de IEC/NC (que nunca se restituyen). CHANGE REQUEST
      // SIC-AV v1.4: el precio piso ya no participa en el calculo de
      // comision, por lo tanto tampoco en esta reconstruccion.
      if (r.factor_presupuesto < 100) {
        var comisionSinFactorPpto = r.comision_base_total * (r.factor_iec / 100);
        var diferidoCiclo = Math.max(0, comisionSinFactorPpto - r.comision_liberada);
        diferidoAcumulado += diferidoCiclo;
      }
    });

    var cumplimientoTrimestral = presupuestoTrimestral > 0 ? (ventaNetaTrimestral / presupuestoTrimestral * 100) : 0;
    var iecTrimestral = iecs.length ? (iecs.reduce(function (s, v) { return s + v; }, 0) / iecs.length) : 0;

    var pctLiberacion = 0;
    var regla = ctx.params.diferido_trimestral.liberacion.filter(function (r) {
      return cumplimientoTrimestral >= r.min_cumpl && (r.max_cumpl === null || cumplimientoTrimestral <= r.max_cumpl);
    })[0];
    if (regla) pctLiberacion = regla.pct_liberacion;

    var condicionesOk = true;
    var motivosNoCumplidos = [];
    if (iecTrimestral < ctx.params.diferido_trimestral.iec_minimo) {
      condicionesOk = false;
      motivosNoCumplidos.push("IEC trimestral (" + iecTrimestral.toFixed(1) + "%) bajo el minimo demostrativo (" + ctx.params.diferido_trimestral.iec_minimo + "%)");
    }
    // CHANGE REQUEST SIC-AV v1.4: se elimino la condicion de "ventas bajo
    // piso sin autorizacion" -- el precio piso ya no puede bloquear ni
    // retener la liberacion del diferido trimestral. El IEC trimestral
    // (condicion de arriba) sigue siendo el unico canal por el que el
    // precio piso puede influir en este calculo.
    if (condicionesDemo && condicionesDemo.cartera_fuera_estandar) {
      condicionesOk = false;
      motivosNoCumplidos.push("Cartera fuera del estandar demostrativo");
    }
    if (condicionesDemo && condicionesDemo.observaciones_financieras_graves) {
      condicionesOk = false;
      motivosNoCumplidos.push("Observaciones financieras graves registradas");
    }

    var pctLiberacionFinal = condicionesOk ? pctLiberacion : 0;
    var montoLiberado = diferidoAcumulado * (pctLiberacionFinal / 100);
    var montoPendiente = diferidoAcumulado - montoLiberado;

    return {
      trimestre: trimestreCode,
      estado: trimInfo.estado,
      diferido_acumulado: diferidoAcumulado,
      cumplimiento_trimestral: cumplimientoTrimestral,
      iec_trimestral: iecTrimestral,
      pct_liberacion_por_cumplimiento: pctLiberacion,
      condiciones_cumplidas: condicionesOk,
      motivos_no_cumplidos: motivosNoCumplidos,
      pct_liberacion_final: pctLiberacionFinal,
      monto_liberado: montoLiberado,
      monto_pendiente: montoPendiente
    };
  };

  // ---------------------------------------------------------------------
  // Historico (todos los ciclos definidos en parametros)
  // ---------------------------------------------------------------------
  // CHANGE REQUEST SIC-AV v1.6, seccion 12: cada liquidacion (periodo de
  // cobranza) del historico conserva su identificador, fechas del periodo,
  // el mes de desempeño asociado y todos los indicadores de ambos periodos
  // -- sin perder compatibilidad con el historico existente (mismos campos
  // ciclo/estado/comision_* de siempre, mas los campos nuevos de v1.6).
  SIC.calcularHistorico = function (ctx, vendedorId) {
    return ctx.params.ciclos.map(function (c) {
      var r = SIC.calcularVendedorCiclo(ctx, vendedorId, c.ciclo);
      return {
        identificador_liquidacion: c.ciclo,
        ciclo: c.ciclo,
        estado: c.estado,
        fecha_cierre: c.cierre,
        periodo_cobranza_inicio: c.inicio,
        periodo_cobranza_cierre: c.cierre,
        mes_desempeno: r.mes_desempeno,
        presupuesto_mes: r.presupuesto_mes,
        venta_neta_mes: r.venta_neta_mes,
        venta_cobrada: r.venta_cobrada,
        comision_potencial: r.comision_potencial,
        comision_liberada: r.comision_liberada,
        comision_pagada: r.comision_pagada,
        cumplimiento_pct: r.cumplimiento_pct,
        iec_pct: r.iec_pct,
        excedente_mes: r.excedente_mes,
        bono_excedente: r.bono_excedente
      };
    });
  };

  // ---------------------------------------------------------------------
  // "Que puedo hacer para ganar mas" -- simulaciones de proyeccion,
  // nunca promesas de pago.
  // ---------------------------------------------------------------------
  SIC.simularAcciones = function (ctx, vendedorId, ciclo) {
    var base = SIC.calcularVendedorCiclo(ctx, vendedorId, ciclo);
    var acciones = [];

    // 1. Cobrar la factura pendiente de mayor saldo -- CHANGE REQUEST v1.4:
    // ya no se excluyen las ventas bajo piso no autorizadas, toda venta
    // facturada con saldo pendiente es una oportunidad valida de cobro.
    var pendientes = base.detalle_facturas.filter(function (f) { return f.saldo_pendiente > 0; });
    if (pendientes.length) {
      pendientes.sort(function (a, b) { return b.saldo_pendiente - a.saldo_pendiente; });
      var top = pendientes[0];
      var tasaHoy = SIC.tasaCartera(ctx.params, top.tipo_cliente, SIC.diasEntre(top.fecha_factura, SIC.hoyDemo()));
      var incremento = top.saldo_pendiente * (tasaHoy / 100) * (base.factor_presupuesto / 100) * (base.factor_iec / 100);
      acciones.push({
        tipo: "cobrar_factura",
        descripcion: "Si cobra la factura " + top.factura + ", su comision liberada aumentaria en una estimacion de " + Math.round(incremento).toLocaleString(),
        monto_estimado: incremento
      });
    }

    // 2. Alcanzar 100% de presupuesto del mes de desempeño (CHANGE REQUEST
    // v1.6: el cumplimiento se mide sobre venta neta del mes, no sobre
    // venta cobrada del periodo).
    if (base.cumplimiento_pct < 100 && base.presupuesto_mes > 0) {
      var faltante = base.presupuesto_mes - base.venta_neta_mes;
      var factor100 = SIC.factorPresupuesto(ctx.params, 100);
      var comisionActual = base.comision_liberada;
      var comisionSi100 = base.comision_base_total * (factor100 / 100) * (base.factor_iec / 100);
      acciones.push({
        tipo: "alcanzar_presupuesto",
        descripcion: "Si alcanza el 100% del presupuesto (faltan aprox. " + Math.round(faltante).toLocaleString() + "), su comision proyectada podria aumentar en una estimacion de " + Math.round(Math.max(0, comisionSi100 - comisionActual)).toLocaleString(),
        monto_estimado: Math.max(0, comisionSi100 - comisionActual)
      });
    }

    // 3. Mejorar IEC hasta 95%
    if (base.iec_pct < 95) {
      var factorIec95 = SIC.factorIEC(ctx.params, 95);
      var comisionSiIec95 = base.comision_base_total * (base.factor_presupuesto / 100) * (factorIec95 / 100);
      acciones.push({
        tipo: "mejorar_iec",
        descripcion: "Si mejora su IEC desde " + base.iec_pct.toFixed(1) + "% hacia 95%, su comision proyectada podria aumentar en una estimacion de " + Math.round(Math.max(0, comisionSiIec95 - base.comision_liberada)).toLocaleString(),
        monto_estimado: Math.max(0, comisionSiIec95 - base.comision_liberada)
      });
    }

    // 4. Diferido trimestral -- CHANGE REQUEST v1.4: ya no se pasa condicion
    // de ventas bajo piso (eliminada del motor de diferido trimestral).
    // CHANGE REQUEST v1.6: trimestres[].ciclos fue renombrado a
    // trimestres[].meses (meses calendario de desempeño, no periodos 26-25).
    // Se deriva el mes de desempeño de este ciclo y se busca ahi.
    var mesDesempenoDeEsteCiclo = SIC.mesDesempenoDe(ciclo);
    var trimestreActual = ctx.params.trimestres.filter(function (t) { return t.meses.indexOf(mesDesempenoDeEsteCiclo) !== -1; })[0];
    if (trimestreActual) {
      var diferido = SIC.calcularDiferidoTrimestral(ctx, vendedorId, trimestreActual.trimestre, {
        cartera_fuera_estandar: false,
        observaciones_financieras_graves: false
      });
      if (diferido.diferido_acumulado > 0) {
        acciones.push({
          tipo: "diferido_trimestral",
          descripcion: "Si mantiene el cumplimiento trimestral, podria liberar un monto potencial de " + Math.round(diferido.diferido_acumulado).toLocaleString() + " de comision diferida al cierre del trimestre " + trimestreActual.trimestre,
          monto_estimado: diferido.diferido_acumulado
        });
      }
    }

    return acciones;
  };

  global.SIC = SIC;
})(typeof window !== "undefined" ? window : globalThis);
