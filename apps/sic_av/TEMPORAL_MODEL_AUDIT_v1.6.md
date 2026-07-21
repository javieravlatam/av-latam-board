# SIC-AV v1.6 — Auditoría del Modelo Temporal (Período de Cobranza 26–25 + Mes de Desempeño)

Fecha: 2026-07-13. CHANGE REQUEST: eliminar el concepto "Presupuesto del ciclo 26–25" y operar con dos períodos distintos y coordinados: **Período de cobranza** (26→25, sin cambios en su definición) para todo lo relacionado a cobros/cartera/liquidación, y **Mes de desempeño** (el último mes calendario completamente cerrado) para presupuesto/venta neta/cumplimiento/IEC/Bono por Excedente/consistencia trimestral.

Este documento se escribió ANTES de modificar ningún archivo, auditando línea por línea `sic_core.js`, `data/parametros_{chile,peru}.json`, `data/presupuestos_{chile,peru}_demo.json`, `data/iec_{chile,peru}_demo.json`, `data/ventas_{chile,peru}_demo.json` y `js/sic_data_adapter.js`.

## 1. Dónde se calculaba "presupuesto por ciclo" (a eliminar)

| Regla actual | Problema | Regla nueva | Archivo afectado | Cambio requerido |
|---|---|---|---|---|
| `presupuestoDe(ctx, vendedorId, ciclo)` (sic_core.js:208-211) busca en `ctx.presupuestos` por `x.ciclo === ciclo` (código de PERÍODO 26-25, ej. `"2026-07"`) | El presupuesto se asocia a un período de cobranza, no a un mes calendario — mezcla dos conceptos distintos bajo un mismo código | Buscar por `x.mes === mesDesempeño` en un arreglo re-etiquetado | `sic_core.js` | Nueva función `presupuestoDelMes(ctx, vendedorId, mesCode)`; retiro de `presupuestoDe` |
| `data/presupuestos_{chile,peru}_demo.json`: cada registro tiene campo `"ciclo"` | El campo se llama "ciclo" pero en la práctica ya representaba un valor mensual — la etiqueta induce a mezclar los dos períodos | Renombrar campo a `"mes"` (mismo valor, migración explícita, ver sección 5) | `data/presupuestos_*_demo.json` | Migración de campo, documentada, sin reinterpretar valores |
| `js/sic_data_adapter.js`, `SICAdapter._presupuestoDelCiclo` (líneas 460-474) **prorratea** el presupuesto mensual real de Chile entre los dos meses calendario que cruza el período 26-25 (`_proporcionMeses`), y para Perú divide el anual entre 12 | Es exactamente el "presupuesto artificial 26-25" que la nueva arquitectura prohíbe explícitamente ("No prorratear presupuestos mensuales para formar un 'presupuesto de ciclo'") | Usar el presupuesto mensual real de Chile **directamente por índice de mes calendario** (`rtc_mensual_ppto[vendedorClave][mesIdx]`, sin prorrateo — de hecho más simple y más preciso que hoy). Perú mantiene anual/12 como aproximación de mes calendario (no es un prorrateo entre dos meses, es una única aproximación mensual, permitida) | `js/sic_data_adapter.js` | Nueva función `_presupuestoDelMes`; retiro del uso de `_proporcionMeses` para presupuesto |

## 2. Dónde se calculaba "cumplimiento del ciclo" (a eliminar)

| Regla actual | Problema | Regla nueva | Archivo afectado | Cambio requerido |
|---|---|---|---|---|
| `SIC.calcularVendedorCiclo` (sic_core.js:326): `cumplimientoPct = ventaCobradaCiclo / presupuesto * 100` — usa **venta COBRADA** del período 26-25 | La nueva regla exige explícitamente "No utilizar cobranzas para calcular cumplimiento" — el cumplimiento debe ser venta **facturada** (neta) del mes calendario, no venta cobrada del período | `cumplimientoPct = ventaNetaMes / presupuestoMes * 100` | `sic_core.js` | Nueva función `ventaNetaDelMes(ctx, vendedorId, mesCode)`; reemplazo del cálculo de `cumplimientoPct` |

## 3. Dónde se tomaba "IEC del ciclo" (a eliminar)

| Regla actual | Problema | Regla nueva | Archivo afectado | Cambio requerido |
|---|---|---|---|---|
| `iecDe(ctx, vendedorId, ciclo)` (sic_core.js:212-215) busca en `ctx.iec` por `x.ciclo === ciclo` | Igual que presupuesto: el IEC debe corresponder al mes de desempeño, no al período 26-25 | Buscar por `x.mes === mesDesempeño` | `sic_core.js` | Nueva función `iecDelMes(ctx, vendedorId, mesCode)` |
| `data/iec_{chile,peru}_demo.json`: campo `"ciclo"` | Misma mezcla conceptual | Renombrar a `"mes"` (migración explícita) | `data/iec_*_demo.json` | Migración de campo |
| `js/sic_data_adapter.js`, bloque `construirCicloReal` (líneas 394-418): agrega `sp/bp/no_evaluable` de `ventas` **filtradas por período 26-25** (`ventas` ya viene filtrada por período en la línea 274) | El IEC real hoy se calcula sobre las ventas del período de cobranza, no del mes calendario | Nueva agregación sobre ventas filtradas por **mes calendario** (rango 1 al último día del mes de desempeño), independiente del filtro de período que ya usa `ventas`/`cobranzas` | `js/sic_data_adapter.js` | Nueva función que filtra TX por mes calendario y agrega sp/bp/no_evaluable + venta neta total, análoga a la actual pero con otro rango de fechas |

## 4. Dónde se calculaba "Bono por Excedente del ciclo" (a eliminar)

| Regla actual | Problema | Regla nueva | Archivo afectado | Cambio requerido |
|---|---|---|---|---|
| `SIC.calcularVendedorCiclo` (sic_core.js:343-344): `excedenteCobrado = max(0, ventaCobradaCiclo - presupuesto)`; `bonoExcedente = excedenteCobrado * bono_pct/100 * factorIec/100` | Dos problemas: (a) usa venta **cobrada** del período, no venta neta del mes; (b) multiplica por Factor IEC, que la nueva fórmula (sección 5 del CHANGE REQUEST) **ya no incluye** | `excedenteMes = max(0, ventaNetaMes - presupuestoMes)`; `bonoExcedente = excedenteMes * bono_pct/100` (sin Factor IEC) | `sic_core.js` | Reescribir el cálculo del bono; **cambio de fórmula**, no solo de fuente de datos |

## 5. Dónde se asigna el período 26-25 (se mantiene, no se toca)

`SICAdapter.asignarCiclo` (`js/sic_data_adapter.js`) y `ctx.params.ciclos` (`data/parametros_*.json`) siguen representando el **Período de cobranza** — su definición (día 26 del mes anterior a día 25 del actual) NO cambia. Lo único que cambia es que ahora, además, se deriva de cada período de cobranza su **mes de desempeño** correspondiente (el mes calendario inmediatamente anterior al mes de cierre del período — ver ejemplo del CHANGE REQUEST: cierre 25 de junio → mes de desempeño mayo).

## 6. Consistencia trimestral (a corregir)

| Regla actual | Problema | Regla nueva | Archivo afectado | Cambio requerido |
|---|---|---|---|---|
| `ctx.params.trimestres[].ciclos` (parametros_*.json): arreglo de 3 **códigos de período** 26-25 (ej. `["2026-05","2026-06","2026-07"]`) | La nueva regla exige evaluar consistencia sobre **meses calendario** (ej. abril/mayo/junio), no sobre períodos 26-25 | Renombrar a `trimestres[].meses`, con los 3 meses de desempeño correspondientes (derivados restando 1 mes a cada período anterior) | `data/parametros_*.json` | Migración de campo + recálculo de valores (shift de -1 mes) |
| `SIC.calcularDiferidoTrimestral` (sic_core.js:401-422) sobre cada `ciclo` del trimestre, usa `r.presupuesto` (ciclo) y `r.venta_cobrada` para "cumplimiento trimestral" | Debe recalcularse sobre venta neta mensual / presupuesto mensual, para ser consistente con la regla de la sección 2 | Iterar `trimInfo.meses`; para cada mes, derivar el período de cobranza que lo liquida (`mes + 1 mes`) para obtener `comision_base_total`/`comision_liberada` (que siguen naciendo de cobros reales del período), y usar `presupuesto_mes`/`venta_neta_mes` para el cumplimiento trimestral | `sic_core.js` | Nueva función `SIC.periodoQueLiquidaMes(mesCode)` (inversa de mes de desempeño); reescritura de `calcularDiferidoTrimestral` |

## 7. Terminología a reemplazar en UI/PDF/Política

Buscado en `sic_chile.html`, `sic_peru.html`, `sic_politica.html`, `sic_pdf.js`, `sic_datos_reales.html`: aparecen las etiquetas "Presupuesto del ciclo", "Cumplimiento de presupuesto" (sin distinguir período), "IEC del ciclo" (implícito, mostrado simplemente como "IEC del ciclo" en `sic_datos_reales.html`) y "venta facturada (ciclo)". Todas deben migrar a la terminología obligatoria: Período de cobranza / Mes de desempeño / Presupuesto del mes de desempeño / Cumplimiento del mes de desempeño / IEC del mes de desempeño / Bono por Excedente del mes de desempeño.

## 8. Compatibilidad con datos reales ya publicados (v1.6 anterior, "fix: load validated real data")

`sic_chile.html`/`sic_peru.html` y `sic_datos_reales.html` ya construyen un `cicloReal` real vía `SICAdapter.construirCicloReal` y lo pasan a `SIC.calcularVendedorCiclo` sin datos demo. Como el motor ahora busca `ctx.presupuestos`/`ctx.iec` por `mes` (mes de desempeño) en lugar de `ciclo`, **`construirCicloReal` debe producir esos arreglos ya re-etiquetados y calculados sobre el mes calendario correcto** (ver secciones 1 y 3) — si no se actualiza el adaptador real en el mismo cambio, presupuesto/IEC reales dejarían de encontrarse (mostrarían siempre "Pendiente de carga", una regresión de capacidad, no un error, pero regresión al fin). Se actualiza en este mismo CHANGE REQUEST para no romper lo ya publicado.

## 9. Resumen de archivos a modificar

`sic_core.js`, `data/parametros_chile.json`, `data/parametros_peru.json`, `data/presupuestos_chile_demo.json`, `data/presupuestos_peru_demo.json`, `data/iec_chile_demo.json`, `data/iec_peru_demo.json`, `js/sic_data_adapter.js`, `sic_chile.html`, `sic_peru.html`, `sic_datos_reales.html`, `sic_politica.html`, `sic_pdf.js`, `tests/run_engine_tests.js`, `tests/run_adapter_tests.js`, y las suites de UI en la medida que referencien IDs/etiquetas renombrados.

**No se toca:** `sic_auth.js` (autenticación), `Panel_Jefes_Chile_2026.html`, `Panel_Jefes_Peru_2026.html`, ninguna fuente AVBOARD (`avboard_data.js`, `Panel_IEC_Auditoria_2026.html` se siguen leyendo, nunca escribiendo).
