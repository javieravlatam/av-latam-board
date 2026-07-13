# SIC-AV — Resultados de Pruebas (Prototipo Funcional · v1.6)

Fecha de ejecución: 2026-07-13 (actualizado tras la CORRECCIÓN PRIORITARIA v1.6 — datos reales en el flujo principal)
Entorno: Node.js v22 + jsdom 29 (servidor HTTP local en `localhost:8123`, requerido por CORS al usar `fetch()` sobre archivos `file://`).

**v1.6 (2026-07-13) — Datos reales en el flujo principal (`sic_chile.html`/`sic_peru.html`):** el acceso publicado (Portal → SIC AV → País) mostraba datos demostrativos incluso después de v1.5, porque `sic_chile.html`/`sic_peru.html` seguían llamando solo a `SIC.cargarPais()` (datos demo) — únicamente la vista secundaria `sic_datos_reales.html` usaba `js/sic_data_adapter.js`. Se corrigió: ambos dashboards ahora combinan `SIC.cargarPais().then(ctx => ctx.params)` (política real) con `SICAdapter.cargarFuentesReales()` + `SICAdapter.construirCicloReal()` (mismo patrón ya probado en `sic_datos_reales.html`), sin duplicar lógica ni modificar `sic_core.js`. Se reorganizaron en Bloque 1 (datos reales validados: venta facturada, presupuesto, cumplimiento aproximado, IEC, precio piso, # facturas, conciliación con la fuente, fecha de actualización) y Bloque 2 (estado del cálculo de comisiones, con los textos exigidos: presupuesto/IEC faltante → "Pendiente de carga", cobranza real → "Pendiente de integración", comisión definitiva → "Pendiente de cálculo" — nunca "$0" como resultado). Las secciones que dependían de cobranza (Comisión diferida trimestral, Qué puedo hacer para aumentar mi comisión) se reemplazaron por avisos de estado pendiente; el botón de PDF ya no genera un informe con comisión fabricada. `tests/run_ui_tests.js` se redujo de 20 a 9 pruebas (se retiraron las aserciones sobre contenido demo que dejó de existir a propósito — tarjetas de comisión, filtro de estado, histórico de 6 ciclos fijos, PDF vía `SICPDF._construirHtml` con datos sintéticos — y se conservaron las de autenticación/aislamiento/página de política, que no cambiaron). Se agregó `tests/run_dashboard_real_test.js` (24 pruebas nuevas) para cubrir el contenido real del flujo principal. Total del módulo: 108→**121** pruebas.

**v1.5 Fase 4 (2026-07-13):** auditoría profunda y definitiva de cobranzas en todo el repositorio (no solo `apps/sic_av/`) — ver `COLLECTION_SOURCE_AUDIT.md`. Hallazgo nuevo: el CxC de Perú en `avboard_data.js` está **congelado/hardcodeado** en `scripts/update_avboard.py` (`extract_peru_cxc_static()`, corte fijo `10/05/2026`), no se refresca desde `inbox/`. Un experimento de diffing entre cortes sucesivos de CxC Chile (ya presentes en `inbox/`) muestra que se puede aproximar una ventana de resolución de 5-14 días para un subconjunto de facturas, pero no es automático, no cubre Perú, y no equivale a una fecha de cobro exacta — Escenario **C** (saldo CxC sin movimientos de cobro confiables). `sic_datos_reales.html` se reorganizó en dos bloques explícitos: Bloque 1 (datos reales validados: venta facturada, presupuesto, cumplimiento aproximado, IEC, precio piso, # facturas/vendedores) y Bloque 2 (estado del cálculo de comisiones — mensaje honesto de "pendiente de integración de cobranza real", sin mostrar comisión "$0" como resultado comercial). La tabla de vendedores ya no muestra montos de comisión, solo el estado "Pendiente de cobranza". `tests/run_datos_reales_ui_test.js` pasó de 9 a 13 pruebas (se removió la prueba que esperaba tarjetas `c-potencial`/`c-liberada` con "$0" y se agregaron 5 pruebas que verifican los dos bloques, el mensaje de estado, y que la tabla de vendedores no exhibe montos). El total pasó de 104 a **108** pruebas automatizadas.

**v1.5 Fases 1-3 (2026-07-13):** se agregó `js/sic_data_adapter.js`, una capa de solo lectura que transforma las fuentes reales ya existentes del Board (`Panel_IEC_Auditoria_2026.html` → `TX_CL`/`TX_PE`, `avboard_data.js` → presupuesto real) al mismo formato que `sic_core.js` ya consumía con datos demo — **el motor de cálculo no se modificó**. Se agregó `sic_datos_reales.html`, una página nueva y aditiva (no reemplaza ni modifica `sic_chile.html`/`sic_peru.html`/`sic_politica.html`) que muestra al menos un ciclo comercial real completo (26→25), con conciliación explícita fuente-vs-adaptador y advertencias de integridad visibles (nunca exclusiones silenciosas). Se agregaron dos suites nuevas: `tests/run_adapter_tests.js` (26 pruebas) y `tests/run_datos_reales_ui_test.js` (9 pruebas iniciales, ver arriba). El total pasó de 69 a **104** pruebas automatizadas (49 motor/PDF + 20 UI demo + 26 adaptador + 9 UI datos reales).

**v1.4 (2026-07-13):** se eliminó por completo el Factor de Precio Piso del cálculo de comisión (decisión de Gerencia General: toda venta facturada se considera una operación válida y previamente aprobada por la compañía). Ya no existe `SIC.factorPiso()` ni la tabla `factor_piso` en `parametros_<pais>.json`. Una venta bajo piso —autorizada o no— ya **no** produce comisión cero, reducción adicional, bloqueo, retención (el estado `"retenida"` se eliminó del motor) ni excepción manual: entra al cálculo normal igual que cualquier otra venta. El precio piso se mantiene únicamente como dato informativo por factura (`piso_situacion`, `clasificacion_piso` con valores `sobre_piso` / `bajo_piso` / `no_evaluable`) y como insumo del Factor IEC — el **IEC es el único mecanismo** por el cual el precio piso puede impactar la comisión. El Bono por Excedente y el Bono de Consistencia Trimestral ya no ponderan ni se condicionan por precio piso. El total pasó de 64 a **69** pruebas automatizadas (49 de motor/PDF + 20 de UI).

**v1.3 (2026-07-13):** el Factor IEC pasó del modelo continuo interpolado a tramos fijos, definitivos y aprobados por Gerencia General (IEC &lt;70%→20%, 70-84,99%→70%, 85-91,99%→80%, 92-94,99%→90%, ≥95%→105%). Se eliminó por completo `SIC.interpolar()` — ya no existe interpolación en ningún factor del sistema. Se agregó la página `sic_politica.html` ("Política y Factores"), accesible desde ambos dashboards.

**v1.2 (2026-07-13):** se agregó el selector de ciclo comercial (mínimo 6 ciclos por país, con nombre/fechas/estado) en `sic_chile.html` y `sic_peru.html`, un indicador de "Presupuesto del ciclo", y en el header/PDF la versión de política y fecha de datos del ciclo consultado.

**v1.1 (2026-07-12):** el Factor de Cumplimiento de Presupuesto pasó del Modelo C continuo/interpolado a tramos fijos (cumplimiento &lt;90%→0%, 90-99,99%→80%, ≥100%→100%, nunca supera 100%), y la tabla de edad de cartera de Chile se unificó en una sola tabla (sin distinción Distribuidor/Cliente Final).

Cinco suites automatizadas, ejecutables en cualquier momento:

- `tests/run_engine_tests.js` — motor de cálculo (`sic_core.js`) y generador de PDF (`sic_pdf.js`, incluyendo el PDF de política). No requiere servidor HTTP: usa un *shim* de `fetch()` que lee los JSON locales con `fs.readFileSync`.
- `tests/run_ui_tests.js` — autenticación, aislamiento por país y página "Política y Factores" en un DOM real (jsdom). **Desde v1.6 requiere el servidor HTTP levantado desde la raíz del repositorio** (mismo requisito que las dos suites siguientes), no desde `apps/sic_av/`, porque `sic_chile.html`/`sic_peru.html` ahora también hacen fetch de archivos del Board.
- `tests/run_adapter_tests.js` — lectura y transformación de las fuentes reales del Board (`Panel_IEC_Auditoria_2026.html`, `avboard_data.js`), construcción de un ciclo real 26-25, y conciliación independiente contra el motor SIC sin modificar. No requiere servidor HTTP: usa `fs.readFileSync` directo sobre los archivos reales del repo.
- `tests/run_datos_reales_ui_test.js` — renderiza `sic_datos_reales.html` (vista de auditoría técnica) en un DOM real (jsdom), sirviendo los archivos reales por HTTP.
- `tests/run_dashboard_real_test.js` — **(v1.6)** renderiza `sic_chile.html`/`sic_peru.html` (flujo principal) en un DOM real, confirmando datos reales, aislamiento por país, ausencia de datos demo, textos de estado pendiente exigidos y cero errores de consola.

Cómo ejecutar las cinco suites:

```
cd apps/sic_av
node tests/run_engine_tests.js          # sin dependencias, corre de inmediato
node tests/run_adapter_tests.js         # sin dependencias, corre de inmediato (lee el Board real con fs)

npm install --no-save jsdom             # solo necesario para las suites de UI (dependencia de desarrollo,
                                         # no la usa el prototipo en si -- el prototipo no depende de nada)

cd ../..                                # a la raiz del repo -- desde v1.6, TODAS las suites de UI
python3 -m http.server 8123 &           # requieren el servidor levantado aqui, no en apps/sic_av/
cd apps/sic_av
node tests/run_ui_tests.js
node tests/run_datos_reales_ui_test.js
node tests/run_dashboard_real_test.js
kill %1
```

`jsdom` es exclusivamente una herramienta de prueba (simula un navegador dentro de Node). El prototipo en si mismo — `index.html`, `sic_chile.html`, `sic_peru.html`, `sic_politica.html`, `sic_datos_reales.html` y los archivos `.js`/`.css` — no depende de ninguna libreria externa ni de `node_modules`; corre con cualquier navegador real apuntando al servidor local.

## Resultado global

**121 / 121 pruebas automatizadas en OK.** 0 fallos. (49 de motor/PDF + 9 de UI auth/política + 26 de adaptador de datos reales + 13 de UI de datos reales (auditoría técnica) + 24 de UI de dashboard real (flujo principal).)

## Detalle — Suite de motor y PDF, pruebas nuevas de v1.4 (5 pruebas + 2 reescritas)

| # | Escenario | Resultado | Evidencia |
|---|---|---|---|
| 15 | Venta bajo piso "autorizada" sin reducción | OK | CL-2026-07-009: `factor_piso` ya no existe en el detalle, `clasificacion_piso="bajo_piso"`, estado="liberada", comisión > 0 (antes: factor 0,5) |
| 16 | Venta bajo piso "no autorizada" ya no es cero | OK | CL-2026-07-008 (pagada en su totalidad): estado="liberada" (antes "retenida"), comisión > 0 (antes 0) |
| 17 | Estado "retenida" eliminado | OK | Ninguna factura del ciclo queda en estado `"retenida"`; el campo `factor_piso` ya no existe en ningún detalle de factura |
| 18 | Sin doble penalización por precio piso | OK | La comisión ajustada de un pago de una factura bajo piso coincide EXACTAMENTE con `base × Factor Presupuesto × Factor IEC`, sin multiplicador oculto adicional |
| 19 | Bono por excedente sin ponderación por piso | OK | El bono coincide EXACTAMENTE con `excedente × 2% × Factor IEC`, sin factor de piso |
| 43 | Precio piso eliminado del motor | OK | `params.factor_piso` es `undefined` en ambos países; `SIC.factorPiso` ya no existe; `SIC.clasificacionPiso` disponible como clasificación informativa (sobre_piso / bajo_piso / no_evaluable) |
| — | Perú — bajo piso no autorizado sin reducción | OK | PE-2026-07-009: sin campo `factor_piso`, comisión > 0 cuando la factura está cobrada |

## Detalle — Suite de UI, pruebas nuevas de v1.4 (2 pruebas, jsdom)

| # | Escenario | Resultado | Evidencia |
|---|---|---|---|
| 19 | Sin control de autorización de precio piso — Chile | OK | El filtro de estado ya no tiene la opción "Retenida"; los indicadores "Ventas bajo piso autorizadas/no autorizadas" desaparecieron y fueron reemplazados por un único indicador informativo "Ventas bajo piso"; ninguna factura del detalle tiene estado `"retenida"` ni campo `factor_piso` |
| 20 | Sin control de autorización de precio piso — Perú | OK | Igual al anterior |

## Detalle — Suite de motor y PDF, pruebas de v1.3 (11 pruebas)

| # | Escenario | Resultado | Evidencia |
|---|---|---|---|
| 9 | Factor IEC — tramo bajo (70-84,99%) | OK | CL-V01, IEC=82%, factor IEC=**70%** exacto |
| 10 | Factor IEC — tramo alto (≥95%) | OK | CL-V03, IEC=96,5%, factor IEC=**105%** exacto |
| 11 | Los 5 tramos exactos del Factor IEC | OK | f(69,99%)=20, f(70%)=70, f(84,99%)=70, f(85%)=80, f(91,99%)=80, f(92%)=90, f(94,99%)=90, f(95%)=105, f(100%)=105 — sin interpolación |
| 32 | Política — tabla de Factor de Presupuesto correcta | OK | Tramos `[0, 80, 100]` verificados desde `parametros_<pais>.json` |
| 33 | Política — tabla de cartera Chile correcta | OK | Tasas `[8, 7.5, 6, 3, 2.5, 0.5]` |
| 34 | Política — tabla de cartera Perú correcta | OK | Tasas `[8, 7.5, 6, 5, 2.5, 0.5]`, días `[0, 30, 60, 120, 180, null]` |
| 35 | Política — tabla de Factor IEC correcta | OK | Factores `[20, 70, 80, 90, 105]` |
| 36 | Política — ejemplo de Bono por Excedente | OK | Presupuesto 100.000 / Venta cobrada 120.000 / Excedente 20.000 / Bono 400 |
| 38 | Política — tramos de consistencia trimestral | OK | Tramos de liberación `[50, 75, 100]` |
| 39 | PDF de política generado | OK | `SICPDF._construirHtmlPolitica()` produce HTML con las 6 secciones y metadatos (versión, país, vigencia, fecha de generación) |
| 40 | Política — aislamiento por país | OK | El PDF de política de Chile no contiene los tramos de días de Perú, y viceversa |

## Detalle — Suite de UI, pruebas de v1.3 (3 pruebas, jsdom)

| # | Escenario | Resultado | Evidencia |
|---|---|---|---|
| 16 | Carga de la página Política y Factores — Chile | OK | Sesión activa CL, 3 filas de presupuesto, 5 de IEC, 6 de cartera, versión y estado de política poblados, ejemplo de bono = CLP 400 |
| 17 | Carga de la página Política y Factores — Perú | OK | Igual al anterior, en USD (bono = USD 400,00) |
| 18 | Aislamiento por país en Política y Factores | OK | La tabla de cartera de Chile muestra únicamente sus propios tramos (31-180/181-210/211-360 días) y no los de Perú (31-60/61-120/121-180 días), y viceversa |

## Detalle — Suite de motor y PDF, pruebas de v1.2 (9 pruebas)

| # | Escenario | Resultado | Evidencia |
|---|---|---|---|
| 28 | Selector con al menos 6 ciclos | OK | Chile y Perú: 6 ciclos cada uno, todos con `ciclo`/`inicio`/`cierre`/`estado` |
| 29 | Cambio de ciclo Chile | OK | Ciclo cerrado 2026-04 vs vigente 2026-07: presupuesto y venta facturada distintos (CLP 649.020 vs CLP 6.000.000) |
| 30 | Cambio de ciclo Perú | OK | Mismo comportamiento, independiente de Chile (USD 102.524 vs USD 110.000 de presupuesto) |
| 31 | Actualización de tarjetas | OK | Comisión potencial y liberada cambian entre ciclo vigente y ciclo cerrado 2026-04 |
| 32 | Actualización de detalle | OK | El detalle de facturas del ciclo 2026-04 (2 facturas) es una lista distinta a la del ciclo 2026-07 (9 facturas) |
| 33 | PDF del ciclo seleccionado | OK | El informe generado para el ciclo 2026-04 contiene "Abril 2026" y sus fechas exactas, y NO contiene "Julio 2026" |
| 34 | Preservación del ciclo vigente | OK | `ciclo_vigente` permanece "2026-07" en ambos países tras consultar múltiples ciclos cerrados |
| 35 | Aislamiento por país (ciclos) | OK | Chile y Perú cargan arreglos de ciclos independientes, sin compartir referencia |
| 36 | Ciclo cerrado no cambia | OK | El resultado del ciclo 2026-04 es idéntico antes y después de calcular el ciclo vigente — sin efectos de estado compartido |

## Detalle — Suite de UI, pruebas de v1.2 (6 pruebas, jsdom)

| # | Escenario | Resultado | Evidencia |
|---|---|---|---|
| 10 | Selector de ciclo — Chile | OK | 6 opciones, formato "Febrero 2026 · 26/01/2026–25/02/2026 · Cerrado", 1 ciclo "Vigente" + 5 "Cerrado" |
| 11 | Cambio de ciclo actualiza dashboard — Chile | OK | Header, tarjetas, indicador de presupuesto y detalle de facturas cambian al pasar de julio a febrero 2026 |
| 12 | Preservación del vigente + PDF del ciclo seleccionado — Chile | OK | PDF generado refleja "Cerrado" (no el vigente); `ciclo_vigente` y la opción "Vigente" del selector permanecen intactos |
| 13 | Selector de ciclo — Perú | OK | Igual al de Chile, 6 opciones propias |
| 14 | Cambio de ciclo actualiza dashboard — Perú | OK | Detalle de facturas pasa de 10 a 2 filas al cambiar a un ciclo cerrado |
| 15 | Preservación del vigente + PDF del ciclo seleccionado — Perú | OK | Igual al de Chile |

## Detalle — Suite de motor y PDF (27 pruebas base, cifras actualizadas tras v1.4)

| # | Escenario | Resultado | Evidencia |
|---|---|---|---|
| 1 | Carga de datos Chile | OK | 39 ventas, 4 vendedores cargados desde los 7 JSON de Chile |
| 2 | Carga de datos Perú | OK | 40 ventas, 4 vendedores cargados desde los 7 JSON de Perú |
| 3 | Venta no cobrada | OK | CL-2026-07-006: estado=potencial, comisión liberada=0 |
| 4 | Pago parcial | OK | estado=pendiente, saldo pendiente=CLP 237.600 |
| 5 | Pronto pago (1-30 días) | OK | CL-2026-07-002, 12 días, tasa=7,5% |
| 6 | Cobro tardío (>180 días) | OK | CL-2026-07-004, 231 días, tasa=2,5% |
| 7 | Tabla de cartera Chile unificada | OK | 45 días → 6% igual para Distribuidor y Cliente Final; tramos 0d→8%, 30d→7,5%, 180d→6%, 210d→3%, 360d→2,5%, >360d→0,5% |
| 8 | Tabla de cartera Perú (sin cambios) | OK | 0d→8%, 45d→6%, 90d→5%, 150d→2,5%, 200d→0,5% |
| 11 | Cumplimiento de presupuesto bajo (<90%) | OK | CL-V03, cumplimiento=36,4%, factor presupuesto=**0%** |
| 12 | Cumplimiento de presupuesto ≥100% | OK | CL-V02, cumplimiento=124,0%, factor presupuesto=**100%** (tope) |
| 13 | Tramo intermedio 90-99,99% → 80% | OK | Verificado analíticamente vía `SIC.factorPresupuesto()` |
| 14 | Los 3 tramos exactos del Factor de Presupuesto | OK | f(89,99%)=0, f(90%)=80, f(99,99%)=80, f(100%)=100, f(150%)=100 |
| 20 | Bono por excedente | OK | CL-V02, excedente cobrado=CLP 1.558.000, bono=CLP 24.928 (ya sin ponderación por piso) |
| 21 | Comisión diferida trimestral (acumulación) | OK | CL-V01, trimestre 2026-Q2 (en curso), diferido acumulado=CLP 206.421 |
| 22 | Liberación trimestral — tramo 50% | OK | CL-V01, 2026-Q1 (cerrado), cumplimiento trimestral=102,0%, liberado=CLP 102.270 |
| 23 | Liberación trimestral — tramo 75% | OK | CL-V02, 2026-Q1, cumplimiento trimestral=107,0%, liberado=CLP 61.271 |
| 24 | Liberación trimestral — tramo 100% | OK | CL-V03, 2026-Q1, cumplimiento trimestral=115,0%, liberado=CLP 28.665 (100% de lo diferido) |
| 25 | Liberación trimestral — 0% (no cumple) | OK | CL-V04, 2026-Q1, cumplimiento trimestral=55,1%, liberado=CLP 0 de CLP 462.693 diferidos |
| 26 | Nota de crédito | OK | CL-2026-07-010 con NC vinculada, ajuste aplicado=CLP 3.488 en el ciclo de emisión (append-only) |
| 27 | Generación de PDF | OK | `SICPDF._construirHtml()` produce HTML con título "INFORME EJECUTIVO DE GESTION COMERCIAL" y tabla de detalle |
| 28 | Consistencia pantalla ↔ PDF | OK | Comisión liberada (CLP 358.631, ya sin reducción por piso) mostrada en pantalla aparece idéntica en el HTML del PDF |
| 29 | Perú — venta no cobrada | OK | PE-2026-07-007, comisión liberada=0 |

Nota sobre las liberaciones trimestrales: los tramos asignados a cada vendedor (50/75/100/0%) dependen del cumplimiento trimestral (venta cobrada / presupuesto), que es independiente del Factor de Presupuesto y del Factor IEC — y ahora también independiente de cualquier condición de precio piso, eliminada del motor de diferido trimestral en v1.4.

## Detalle — Suite de UI / autenticación / dashboard (9 pruebas, jsdom)

| # | Escenario | Resultado | Evidencia |
|---|---|---|---|
| 1 | Acceso Chile correcto (clave `chile26`) | OK | Sesión creada `{pais:"CL"}` en `sessionStorage` |
| 2 | Acceso Perú correcto (clave `peru26`) | OK | Sesión creada `{pais:"PE"}` en `sessionStorage` |
| 3 | Clave incorrecta | OK | Mensaje "Clave incorrecta.", sin sesión creada |
| 4 | Aislamiento por país (clave de Perú usada en el campo de Chile) | OK | Mensaje "Esa clave no corresponde a este país.", sin sesión creada — no permite cruzar |
| 5 | Acceso directo a `sic_chile.html` sin sesión previa | OK | El *guard* (`SICAuth.exigirSesion`) impide que `inicializar()` se ejecute; el dashboard queda sin poblar |
| 6 | Acceso directo a `sic_peru.html` sin sesión previa | OK | Igual al anterior, para Perú |
| 7 | Renderizado completo del dashboard Chile | OK | Header, tarjetas, indicadores (incluyendo "Presupuesto del ciclo" y "Ventas bajo piso" informativo), 10 pasos de cálculo, 9 filas de facturas, histórico de 6 ciclos, 4 vendedores en el selector |
| 8 | Renderizado completo del dashboard Perú | OK | Igual al anterior, en USD, 10 filas de facturas |
| 9 | Cambio de vendedor y exportación CSV | OK | Al cambiar de vendedor la comisión liberada cambia; `exportarCSV()` ejecuta sin error |

## Nota metodológica

El motor de cálculo (`sic_core.js`) fue validado primero de forma aislada (sin DOM) para aislar errores de lógica de negocio de errores de integración HTML/JS. Una vez confirmado el motor, se validó la capa de interfaz (autenticación, guards, renderizado, cambio de vendedor, exportación, selector de ciclo y página de política) con un DOM real vía jsdom sirviendo los archivos por HTTP — el mismo modo en que un usuario abriría el prototipo. jsdom no implementa navegación real (`window.location.href = ...`) ni algunas APIs de navegador (`fetch`, `URL.createObjectURL`); estas se resolvieron con *polyfills* explícitos en el arnés de pruebas, no en el código de la aplicación.

La página "Política y Factores" (`sic_politica.html`) lee sus tablas directamente de `parametros_<pais>.json` con la misma lógica de resolución que usa `sic_core.js` (`SIC.tasaCartera`), garantizando que nunca pueda mostrar un valor distinto al que efectivamente calcula el motor — esto se verifica en la prueba de aislamiento por país, comparando el HTML generado, no solo los datos crudos.

La prueba `sin_doble_penalizacion_precio_piso` (motor) y `sin_control_precio_piso_chile`/`sin_control_precio_piso_peru` (UI) son las evidencias directas de que el precio piso ya no reduce ni bloquea la comisión: verifican, respectivamente, que la fórmula real aplicada a una factura bajo piso coincide exactamente con `base × Factor Presupuesto × Factor IEC` (sin término oculto de piso), y que la interfaz ya no ofrece ningún control de autorización o estado "retenida" ligado al precio piso.

## Validación manual recomendada antes de compartir con Gerencia

Aunque las 121 pruebas automatizadas cubren la lógica de negocio y el flujo de datos, se recomienda una revisión visual manual breve (abrir `index.html` en un navegador con el servidor local activo, ingresar ambas claves, revisar el dashboard, la página "Política y Factores" y ambos PDF generados con `window.print() → Guardar como PDF`) antes de cualquier presentación, ya que las pruebas automatizadas no verifican maquetación visual ni el diálogo nativo de impresión del navegador.
