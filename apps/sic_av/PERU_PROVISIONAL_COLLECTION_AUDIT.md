# PERÚ — Auditoría de Cobranza Provisional (archivo histórico de comisiones 2026)

Fecha: 2026-07-13 (presentación: mañana). Fuente auditada: `inbox/AGROVECA PERU -  COMISIONES TRABAJADORES 2026.xlsx`. Esta auditoría cubre las Fases 1 y 4 del CHANGE REQUEST "PRIORIDAD PRESENTACIÓN — INTEGRAR COBRANZA PROVISIONAL PERÚ". **No se hizo commit de ningún cambio** — este documento y los archivos preparados (ver sección 6) están pendientes de tu confirmación antes de wirearse al dashboard en vivo.

## 1. Hojas revisadas

| Hoja | Contenido | ¿Tiene fecha de pago? | ¿Se usó? |
|---|---|---|---|
| `RESUMEN` | Tabla dinámica de ventas acumuladas por vendedor y mes | No | No (agregado, sin trazabilidad por factura) |
| `Hoja1` | Lista de razones sociales de clientes (catálogo) | No | No (no es transaccional) |
| `VENTAS MAYO` | Registro de ventas de abril 2026, sin columna de pago | No | No (redundante con TX_PE, sin dato nuevo) |
| `VENTAS ACUMULADAS 2026` | Registro de ventas enero–mayo/junio 2026, **con columna FECHA DE PAGO** | **Sí** | **Sí — única fuente usable** |
| `COMISIONES POR PAGAR` | Tabla dinámica de comisión histórica por vendedor/mes | No | No (es el resultado de la fórmula histórica que la instrucción prohíbe usar como regla SIC) |

## 2. Campos encontrados en `VENTAS ACUMULADAS 2026`

`PERIODO`, `FECHA EMISION`, `FECHA VENCIMIENTO`, `FECHA DE PAGO`, `SERIE`, `FACTURA`, `NUMERO`, `DENOMINACION O RAZON SOCIAL` (cliente), `DOLARES` (monto), `CONCEPTO` (producto), `VENDEDOR`, `DIAS`, `PERIODO DE PAGO`, `PORCENTAJE`, `COMISION POR PAGAR`.

Del CHANGE REQUEST, **solo se importaron**: `FACTURA` (folio), `VENDEDOR` (solo para cruce/validación, no para el cálculo), `DOLARES` (monto), `FECHA DE PAGO`. Explícitamente **no se importaron** `DIAS`, `PORCENTAJE` ni `COMISION POR PAGAR` — son la fórmula histórica de comisión del Excel, prohibida como regla SIC por instrucción explícita.

135 filas totales en la hoja; **109 son transacciones reales** (26 filas descartadas: 19 vacías/separadoras y 1 fila de "Total general" sin factura — no aportan dato).

## 3. Hallazgos de integridad (Fase 1)

- **Fechas mixtas en el mismo archivo**: las columnas de fecha mezclan celdas de tipo fecha nativo de Excel (`datetime`) con texto libre `DD/MM/AAAA` en las mismas columnas. Las 109 fechas de emisión y las 31 fechas de pago **parsearon correctamente al 100%** (0 fechas inválidas, 0 `#VALUE!`).
- **Sin pagos parciales**: no existe una columna de "monto pagado" distinta de `DOLARES` (monto facturado), y ninguna factura tiene más de una fila (0 duplicados de `SERIE`+`FACTURA`). El archivo asume, por diseño, que si hay `FECHA DE PAGO` la línea completa se pagó por su monto total — no se puede distinguir un pago parcial de uno total con este archivo.
- **31 de 109 facturas tienen `FECHA DE PAGO` válida** (cobrables); **78 no tienen fecha de pago** (siguen sin cobrar, sin cambios respecto al estado actual del dashboard).
- **0 registros incompletos** entre los que sí tienen fecha de pago (los 31 tienen factura, vendedor y monto completos) — no hubo que descartar ninguno por dato faltante.
- **Conciliación contra TX_PE (fuente ya usada por el SIC)**: las 31 facturas pagadas **coinciden 1:1 por número de folio** con `TX_PE` (la fuente que ya lee `sic_datos_reales.html`/`sic_peru.html`). **0 discrepancias de monto** (Excel `DOLARES` = TX_PE `total` en los 31 casos) y **0 discrepancias de nombre de vendedor** entre el Excel y TX_PE para el mismo folio. Esto da alta confianza en que ambas fuentes describen la misma transacción real.

## 4. HALLAZGO CRÍTICO — el bug de fecha ya conocido de TX_PE invalida la asignación de ciclo para la mayoría de estas facturas

Esto es lo más importante de este documento y la razón por la que **no habilité el cálculo de comisión en el dashboard todavía**.

Ya existía una nota (`DATA_SOURCE_AUDIT.md`, `PRESENTATION_READINESS.md`) sobre "algunas transacciones de Perú con día/mes invertido". Al cruzar la `FECHA EMISION` del Excel (formato peruano DD/MM, parseada correctamente) contra la `fecha` que ya trae `TX_PE` para el mismo folio, encontré que **no es un problema esporádico — es un patrón sistemático y 100% consistente**:

- De las 92 transacciones de `TX_PE`, solo 44 tienen una fecha no nula.
- **De esas 44, 40 (90,9%) tienen día ≤ 12** — es decir, son ambiguas entre DD/MM y MM/DD.
- **Las 32 que se pudieron comparar directamente contra el Excel muestran, sin una sola excepción, exactamente un intercambio de día y mes** (ej. Excel `2026-01-06` ↔ TX_PE `2026-06-01`; Excel `2026-02-03` ↔ TX_PE `2026-03-02`). No es ruido — es un patrón determinístico.
- **Consecuencia para el ciclo comercial**: el ciclo 26→25 se asigna por `SICAdapter.asignarCiclo(fecha)`, que depende directamente de esta fecha. De las **13 facturas** con cobranza provisional que hoy caen dentro del rango de política vigente (2026-02 a 2026-07), **10 (77%) cambiarían de ciclo** si se usara la fecha correcta del Excel en vez de la de TX_PE. Ejemplo concreto: la factura 966 (vendedor OMAR ATALAYA, USD 10.000) hoy se asigna al ciclo `2026-02` usando el `2026-02-03` de TX_PE, pero su `FECHA EMISION` real en el Excel es `2026-03-02` — pertenecería al ciclo `2026-03`.
- Al intentar una prueba de corrección (usar la fecha del Excel en vez de la de TX_PE), las 3 facturas de OSCAR INFANTE que había verificado inicialmente **dejaron de pertenecer al ciclo `2026-06` por completo** — su fecha corregida las mueve a enero, fuera incluso del rango de política vigente (2026-02 a 2026-07).

**Por qué esto detiene la integración hoy:** el motor `sic_core.js` no solo usa la fecha de venta para "días de cartera" — la usa para decidir a qué ciclo comercial pertenece la venta. Si esa fecha está sistemáticamente invertida, no es un problema cosmético de "días de cartera un poco raros": son ventas (y ahora también cobros) **asignadas al ciclo equivocado**, lo que puede alterar venta facturada, presupuesto, cumplimiento e IEC del ciclo — no solo la comisión. Este bug **ya afecta el dashboard `sic_peru.html` publicado hoy en v1.6** (para venta facturada/IEC/presupuesto), independientemente de esta cobranza — pero se vuelve mucho más visible y riesgoso ahora que intentamos calcular comisión, porque "días de cartera" y "tasa aplicada" dependen directamente de esa misma fecha.

## 5. Datos utilizados vs. descartados

**Utilizados** (31 registros → `apps/sic_av/data/cobranza_pe_provisional_2026.json`): folio, fecha de pago (ISO), monto, para las 31 facturas con fecha de pago válida y folio confirmado contra TX_PE.

**Descartados / no aplicados al cálculo**:
- Las 78 facturas sin fecha de pago (no aportan cobranza, permanecen como estaban: "potencial").
- La fórmula de comisión del Excel (`PORCENTAJE`, `COMISION POR PAGAR`, `DIAS`) — explícitamente excluida por instrucción, nunca se usó como regla SIC.
- Las hojas `RESUMEN`, `Hoja1`, `VENTAS MAYO`, `COMISIONES POR PAGAR` — no aportan trazabilidad por factura o son resultado agregado de la fórmula prohibida.
- El propio cálculo de "días de cartera" / "tasa aplicada" / "comisión calculada" del motor SIC **no se activó en el dashboard** para ninguna factura, por el hallazgo de la sección 4 — hacerlo hoy mostraría cifras basadas en una fecha de venta con alta probabilidad de estar invertida.

## 6. Archivos preparados (creados, sin wirear al dashboard todavía)

- `apps/sic_av/data/cobranza_pe_provisional_2026.json` — los 31 registros de cobranza provisional extraídos y validados, con metadatos de fuente y advertencia de provisionalidad.
- `apps/sic_av/js/sic_provisional_pe.js` — capa de importación **separada** (no modifica `js/sic_data_adapter.js` ni `sic_core.js`) que ata estos registros a las ventas ya construidas por el adaptador (por número de folio) y los deja listos para que `SIC.calcularVendedorCiclo` los consuma sin cambios, el día que se confirme que es seguro activarlos.
- Ambos archivos fueron probados de forma aislada (Node, fuera del navegador): el match funciona correctamente (31/31 folios encontrados, 0 huérfanos), pero **no están referenciados desde `sic_peru.html`** — el dashboard publicado hoy sigue exactamente igual que en el commit anterior (`fix: load validated real data in SIC dashboards`).

## 7. Monto conciliado (Fase 4)

| Corte | N facturas | Monto (USD) |
|---|---|---|
| Total pagadas con folio confirmado en TX_PE | 31 | 89.558,00 |
| — dentro del rango de política vigente (2026-02 a 2026-07), **usando la fecha de TX_PE (potencialmente invertida)** | 13 | 41.549,00 |
| — fuera de rango (ciclo nulo o fuera de 02–07, por el bug de fecha o por venta en meses aún no vigentes) | 18 | 48.009,00 |

Por vendedor (de las 13 en rango, con fecha **sin corregir** — ver riesgo arriba): `atalaya` USD 13.150, `infante` USD 9.108, `valladares` USD 1.200, y un vendedor **sin mapeo confirmado** (ver sección 8) USD 18.091.

Por ciclo (sin corregir): `2026-02`=15.180, `2026-03`=1.404, `2026-04`=11.907, `2026-05`=3.950, `2026-06`=9.108. **Estos totales por ciclo cambiarían si se corrige el bug de fecha** (sección 4) — no se deben presentar como definitivos por ciclo todavía.

## 8. Otro riesgo detectado: vendedor sin mapeo

El vendedor `LISBETH AGUIRRE` (así aparece, idéntico, tanto en el Excel como en `TX_PE`) no coincide con la entrada `"LIZBETH AGUIRRE"` (con Z) que ya existe en `SICAdapter.VENDEDOR_MAP.PE`. Esto es un problema **preexistente** (no introducido por esta integración): las ventas reales de esta persona ya aparecían como vendedor sin mapear (`lisbeth_aguirre`, clave derivada) en el dashboard `sic_peru.html` publicado hoy, antes de tocar cobranza. Es, con alta probabilidad, la misma persona con una diferencia de tipeo entre fuentes — pero no lo doy por confirmado sin que Comercial lo valide, seg��n la regla de "no inventar información". Es el vendedor con más monto conciliado (USD 18.091 de los 41.549 en rango), así que vale la pena resolver este mapeo cuanto antes.

## 9. Nivel de confiabilidad

- **Alto** para lo que el archivo aporta como dato crudo: folio, monto y fecha de pago están completos, sin errores de parseo, y conciliar perfectamente (100%) contra la fuente que el SIC ya usa (TX_PE) en monto y vendedor.
- **Bajo, hoy, para calcular comisión, días de cartera o asignación de ciclo**, porque esos cálculos dependen de la fecha de venta de `TX_PE`, que tiene un bug de inversión día/mes confirmado y sistemático (90,9% de las fechas válidas de Perú son ambiguas; de las que se pudieron verificar, el 100% mostró el patrón de intercambio). El 77% de las facturas con cobranza provisional en rango de política **cambiarían de ciclo** si se usa la fecha correcta.
- **Cobertura parcial de todas formas**: incluso resolviendo el bug de fecha, esta fuente solo cubre 31 de 92 transacciones reales de Perú (34%) — no reemplaza un reporte completo de cobranza.

## 10. Propuesta de integración

**Para mañana (segura, recomendada):** activar únicamente una vista de **reconciliación referencial** en `sic_peru.html` — un bloque adicional (no un reemplazo de Bloque 2) que muestre "N facturas con cobro real detectado en fuente provisional, por USD monto total, pendiente de conciliación de fechas" — sin alimentar `SIC.calcularVendedorCiclo`. Esto permite mostrar a Gerencia que SÍ existe cobranza real localizable para Perú (algo que hoy no se podía decir), sin arriesgar una cifra de comisión calculada sobre una fecha de ciclo potencialmente incorrecta. Mantener Bloque 2 ("Estado del cálculo de comisiones") exactamente como está hoy: "Pendiente de cálculo".

**Para después de la presentación (más completa, requiere más tiempo):** (a) confirmar con Comercial si `LISBETH AGUIRRE` = `LIZBETH AGUIRRE` y corregir el mapeo; (b) decidir con el equipo de datos si el bug de inversión día/mes de `TX_PE` se corrige en el origen (`scripts/update_avboard.py` o el proceso que genera `Panel_IEC_Auditoria_2026.html`) o si se corrige de forma determinística en `js/sic_data_adapter.js` (dado que el patrón de intercambio es 100% consistente, una corrección "si día ≤ 12, intercambiar día/mes" sobre las fechas de `TX_PE` parece viable, pero afecta a TODO el dashboard de Perú, no solo a cobranza, y debe probarse a fondo antes de publicarse); (c) una vez con fechas confiables, activar la integración completa ya construida (`sic_provisional_pe.js`) para mostrar comisión preliminar etiquetada "Cálculo preliminar sujeto a validación financiera".

## 11. Archivos que sería necesario modificar para la integración completa (no hecho aún)

- `apps/sic_av/sic_peru.html` — agregar `<script src="js/sic_provisional_pe.js">`, cargar el JSON en `inicializar()`, llamar `SICProvisionalPE.aplicarCobranza()` antes de `SIC.calcularVendedorCiclo()`, y condicionar Bloque 2 / tabla de detalle / PDF a "preliminar" cuando haya cobranza aplicada.
- Posiblemente `apps/sic_av/js/sic_data_adapter.js` — **solo si** se decide corregir el bug de fecha de forma determinística ahí (opción b de la sección 10); requeriría nuevas pruebas en `run_adapter_tests.js` para blindar la corrección.
- `apps/sic_av/README.md`, `TEST_RESULTS.md`, `CHANGELOG.md` — documentar la versión y el nuevo estado una vez activada.

**No se modificó** `sic_core.js`, `sic_auth.js`, `sic_chile.html`, ni ningún archivo fuente del Board. No hay commit de este trabajo — queda pendiente tu confirmación.
