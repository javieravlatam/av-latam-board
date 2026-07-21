# SIC-AV — Modelo Temporal v1.6 (fuente técnica oficial)

**CHANGE REQUEST SIC-AV v1.6 (2026-07-13), aprobado para implementación por Gerencia General.**
Este documento es la fuente técnica oficial de la arquitectura temporal del SIC-AV a partir de v1.6. Reemplaza cualquier referencia previa a "Presupuesto del ciclo 26-25", "Cumplimiento del ciclo", "IEC del ciclo", "Excedente del ciclo" o "Meta del período 26-25". Ver también `TEMPORAL_MODEL_AUDIT_v1.6.md` (auditoría realizada antes de implementar este modelo).

## 1. El problema que resuelve

Antes de v1.6, el SIC-AV calculaba presupuesto, cumplimiento, IEC y excedente directamente sobre el período de cobranza 26-25 — ya fuera leyendo un "presupuesto de ciclo" prorrateado entre dos meses calendario (Chile, en el adaptador de datos reales) o etiquetando el presupuesto mensual demo con el código del ciclo (motor y datos demo). Esto mezclaba dos conceptos de negocio distintos — cuándo se factura/cobra (calendario comercial 26-25) y contra qué meta de negocio se mide el desempeño (mes calendario) — bajo una sola etiqueta, y obligaba a prorratear presupuestos mensuales reales para formar un "presupuesto de ciclo" que no corresponde a ningún mes calendario real.

## 2. Los dos períodos

### A. Período de cobranza (26 → 25)

Definición **sin cambios**: del día 26 del mes anterior al día 25 del mes en curso. Vive en `ctx.params.ciclos[]` (campo `ciclo`, `inicio`, `cierre`, `estado`), exactamente igual que antes de v1.6.

Determina exclusivamente:
- Cobranzas efectivamente recibidas y facturas cobradas.
- Fecha efectiva de pago y monto cobrado (incluye pagos parciales).
- Edad de cartera y tasa base de comisión (`SIC.tasaCartera`).
- La liquidación del período (comisión potencial/liberada/pagada/final).

### B. Mes de desempeño

El **último mes calendario completamente cerrado** antes del cierre del período de cobranza — es decir, el mes calendario inmediatamente anterior al mes en que cierra el período. Ejemplo: una liquidación con cierre el 25 de junio de 2026 tiene como período de cobranza el 26 de mayo al 25 de junio de 2026, y su mes de desempeño es **mayo de 2026** (el mes calendario completo — 1 al 31 de mayo — que ya cerró antes de esta liquidación).

Determina exclusivamente:
- Presupuesto comercial y venta neta del mes.
- Cumplimiento de presupuesto y Factor de Presupuesto.
- IEC y Factor IEC.
- Excedente y Bono por Excedente.
- Consistencia trimestral (evaluada sobre 3 meses calendario, no 3 períodos).

**Regla explícita:** ambos bloques se muestran siempre juntos (dashboard, PDF, política), nunca mezclados. No se prorratea presupuesto entre dos meses para formar un "presupuesto de ciclo". No se usa cobranza para calcular cumplimiento ni IEC. No se usa venta parcial del mes en curso — el mes de desempeño es siempre un mes ya cerrado.

## 3. Aritmética de meses (`sic_core.js`)

Todas las funciones trabajan sobre códigos `"YYYY-MM"` sin usar `Date()` para evitar problemas de huso horario (excepto para calcular el último día de un mes, donde `new Date(y, m, 0).getDate()` es seguro y year/leap-aware).

| Función | Qué hace | Ejemplo |
|---|---|---|
| `SIC._shiftMes(mesCode, delta)` | Aritmética base: suma/resta `delta` meses a un código, manejando year-rollover. | `_shiftMes("2026-01", -1)` → `"2025-12"` |
| `SIC.mesDesempenoDe(cicloCode)` | Mes de desempeño de un período de cobranza: el mes calendario inmediatamente anterior al mes de cierre del período. | `mesDesempenoDe("2026-07")` → `"2026-06"` (período cierra 25/07) |
| `SIC.periodoQueLiquidaMes(mesCode)` | Inversa: el período de cobranza que liquida un mes de desempeño dado. | `periodoQueLiquidaMes("2026-06")` → `"2026-07"` |
| `SIC.rangoMesCalendario(mesCode)` | Rango completo (día 1 al último día) de un mes calendario — leap-year aware. | `rangoMesCalendario("2028-02")` → `{inicio:"2028-02-01", cierre:"2028-02-29"}` |

## 4. Fórmula oficial (v1.6)

```
Comisión Base por Pago  = Monto Cobrado (período 26-25) × Tasa por Edad de Cartera
Comisión Ajustada       = Comisión Base × Factor Presupuesto (mes de desempeño) × Factor IEC (mes de desempeño)
Bono por Excedente      = max(0, Venta Neta del Mes − Presupuesto del Mismo Mes) × 2%   [SIN Factor IEC]
Comisión Final          = Σ(Comisión Ajustada) + Bono Excedente + Bono Consistencia Trimestral
                          − Notas de Crédito − Devoluciones − Ajustes autorizados
```

Cambio explícito respecto a v1.4/v1.5: el Bono por Excedente **ya no se pondera por Factor IEC**. La edad de cartera nunca se cuenta dos veces — vive únicamente en la tasa variable (`SIC.tasaCartera`).

Tablas de tramos **sin cambios** (Política V1.1/V1.2, vigentes):
- Factor de Cumplimiento de Presupuesto: `<90%` → 0%, `90-99,99%` → 80%, `≥100%` → 100%.
- Factor IEC: `<70%` → 20%, `70-84,99%` → 70%, `85-91,99%` → 80%, `92-94,99%` → 90%, `≥95%` → 105%.

## 5. Campos del motor (`sic_core.js`)

`SIC.calcularVendedorCiclo(ctx, vendedorId, ciclo)` sigue siendo el punto de entrada principal (clave = código de período de cobranza), pero deriva internamente el mes de desempeño y expone ambos bloques en el mismo resultado:

**Bloque período de cobranza:** `ciclo`, `ciclo_info` (inicio/cierre/estado), `venta_facturada_periodo`, `venta_cobrada`, `ajustes_nc`, `detalle_facturas`, `comision_base_total`, `comision_potencial`, `comision_liberada`, `comision_pendiente`, `comision_validada`, `comision_pagada`, `comision_final`.

**Bloque mes de desempeño:** `mes_desempeno`, `mes_desempeno_info` (inicio/cierre del mes calendario), `presupuesto_mes` (`null` si no hay dato — nunca 0 inventado), `venta_neta_mes`, `cumplimiento_pct`, `factor_presupuesto`, `iec_pct`, `iec_disponible` (booleano — distingue "IEC es 0%" de "no hay IEC cargado"), `factor_iec`, `excedente_mes`, `bono_excedente`.

Campos v1.4/v1.5 **eliminados** de este resultado: `presupuesto` (ahora `presupuesto_mes`), `venta_facturada` (ahora `venta_facturada_periodo`), `excedente_cobrado` (ahora `excedente_mes`, y ya sin ponderación IEC).

## 6. Datos y adaptador real

`ctx.presupuestos[]` y `ctx.iec[]` (tanto demo como real) se indexan por `{vendedor_id, mes}` — **no** por `{vendedor_id, ciclo}`. `presupuestoDelMes`/`iecDelMes` retornan `null` cuando no encuentran registro, nunca `0`.

`js/sic_data_adapter.js` (`SICAdapter.construirCicloReal`) ya no prorratea presupuesto entre dos meses calendario (las funciones `_proporcionMeses`/`_presupuestoDelCiclo` fueron eliminadas). El presupuesto real de Chile se lee directamente de `rtc_mensual_ppto[vendedor][mesIdx]` para el mes de desempeño exacto; el de Perú sigue siendo `anual / 12` (aproximación pre-existente, no un prorrateo de ciclo — es la única granularidad real disponible). El IEC real se recalcula sobre las transacciones del mes de desempeño (antes se calculaba, de hecho, sobre las transacciones del período).

Para que `venta_neta_mes`/IEC del mes de desempeño sean correctos, el adaptador reúne la **unión** de transacciones del período de cobranza solicitado y del mes calendario de desempeño completo (dos ventanas de fecha distintas que solo se solapan parcialmente). Cada venta queda marcada con `_pertenece_periodo` y `_pertenece_mes_desempeno` para que el código consumidor (dashboards, pruebas) pueda filtrar cada bloque por separado sin recalcular fechas.

## 7. Consistencia trimestral

`SIC.calcularDiferidoTrimestral` itera `trimestre.meses` (meses calendario, ej. `["2026-04","2026-05","2026-06"]`), no `trimestre.ciclos`. Para cada mes del trimestre deriva el período de cobranza que lo liquida (`SIC.periodoQueLiquidaMes`) para obtener la comisión base/liberada real de ese período (los cobros ocurren dentro de períodos), pero el presupuesto/venta neta/IEC usados para el cumplimiento trimestral son siempre los del mes calendario. La recuperación solo aplica a la reducción causada por el Factor de Presupuesto — nunca recupera IEC, edad de cartera, notas de crédito, devoluciones ni ajustes.

## 8. Terminología obligatoria

| Término eliminado (v1.4/v1.5) | Reemplazado por (v1.6) |
|---|---|
| Presupuesto del ciclo | Presupuesto del mes de desempeño |
| Cumplimiento del ciclo | Cumplimiento del mes de desempeño |
| IEC del ciclo | IEC del mes de desempeño |
| Excedente del ciclo | Excedente del mes de desempeño |
| Meta del período 26-25 | Presupuesto del mes de desempeño |

Los dos campos (período de cobranza y mes de desempeño) se muestran siempre juntos — dashboard, PDF y política y factores — nunca mezclados en una sola cifra.

## 9. Compatibilidad con datos históricos

Los datos demo migrados (`data/presupuestos_*_demo.json`, `data/iec_*_demo.json`, `data/parametros_*.json`) documentan explícitamente, en un campo `_migracion_v1.6`, que el campo `ciclo` se renombró a `mes` y que los valores se recorrieron -1 mes respecto a su etiqueta anterior, para preservar la cifra que ya se mostraba en cada período vigente/cerrado. No se reinterpretó silenciosamente ningún dato histórico — ver `TEMPORAL_MODEL_AUDIT_v1.6.md` para el detalle exacto por archivo.

`SIC.calcularHistorico` expone, para cada liquidación: `identificador_liquidacion`, `fecha_cierre`, `periodo_cobranza_inicio`, `periodo_cobranza_cierre`, `mes_desempeno`, `presupuesto_mes`, `venta_neta_mes`, `cumplimiento_pct`, `iec_pct`, `excedente_mes`, `bono_excedente`, `venta_cobrada`, `comision_potencial`/`comision_liberada`/`comision_pagada` — conservando siempre la relación liquidación ↔ mes de desempeño.

## 10. Pruebas

`tests/run_v16_temporal_model_tests.js` cubre exactamente los 16 casos exigidos en la sección 14 del CHANGE REQUEST v1.6 (liquidaciones 25 junio/25 julio, Factor Presupuesto e IEC sobre el mismo mes, bono sin cobranza, ausencia de presupuesto de ciclo/prorrateo, dashboard/PDF/política mostrando ambos períodos, histórico, año nuevo/bisiesto, meses sin presupuesto/IEC). Las suites existentes (`run_engine_tests.js`, `run_adapter_tests.js`, `run_ui_tests.js`, `run_datos_reales_ui_test.js`, `run_dashboard_real_test.js`) se actualizaron para los nuevos nombres de campo. Total: 138/138 pruebas OK.

## 11. Qué NO cambió

`sic_auth.js` (autenticación), Panel Jefes Chile, Panel Jefes Perú, ninguna fuente de AVBOARD (`Panel_IEC_Auditoria_2026.html`, `avboard_data.js`), la definición del período de cobranza 26-25 (`SICAdapter.asignarCiclo`), las tablas de tasa de cartera (Chile/Perú) y los tramos de Factor de Presupuesto/Factor IEC/liberación trimestral (solo cambió *sobre qué mes* se evalúan, no los tramos en sí).
