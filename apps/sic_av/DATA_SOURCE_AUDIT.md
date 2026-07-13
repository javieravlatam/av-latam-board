# SIC-AV — Auditoría de Fuentes de Datos Reales (CHANGE REQUEST v1.5, FASE 1)

Fecha: 2026-07-13
Alcance: identificar dónde vive HOY cada dato que el SIC necesita, dentro del repositorio real `av-latam-board` (rama actual, sin tocar ningún archivo fuente). No se creó ninguna base paralela ni plantilla de carga manual — este documento es puramente de lectura y diagnóstico.

Método: lectura directa de los scripts de procesamiento (`scripts/update_avboard.py`, `scripts/ppto_libro_base.py`), de las capas de datos ya generadas (`avboard_data.js`, `avboard_clientes.js`, `Panel_IEC_Auditoria_2026.html` → `TX_CL`/`TX_PE`), y de los archivos fuente crudos en `inbox/` (Excel), abiertos con `openpyxl`/`pandas` para verificar columnas reales, no solo lo documentado.

---

## 1. Mapa de capas existentes (de más cruda a más procesada)

```
inbox/*.xlsx (fuente primaria, Excel, llega del equipo)
    │  procesado por scripts/update_avboard.py y scripts/ppto_libro_base.py
    ▼
avboard_data.js            ← agregados mensuales por país/RTC (fuente única de verdad para paneles ejecutivos)
avboard_clientes.js        ← CLIENTES_CL / CLIENTES_PE, un registro por cliente (agregado YTD)
Panel_IEC_Auditoria_2026.html → TX_CL / TX_PE  ← ÚNICA capa con el detalle POR TRANSACCIÓN (fecha, folio, vendedor, producto, pv, pp)
```

**Hallazgo arquitectónico clave:** `avboard_data.js` y `avboard_clientes.js` son agregados por **mes calendario** o **YTD** — no contienen fecha ni folio por línea, por lo que **no sirven para construir el ciclo comercial 26→25 del SIC** (que exige granularidad diaria). La única capa ya procesada con granularidad de transacción es `TX_CL`/`TX_PE` (dentro de `Panel_IEC_Auditoria_2026.html`), que sí trae `fecha`, `folio`, `vendedor`, `producto`, `pv` (precio venta), `pp` (precio piso), `total`. Esa es la fuente que el adaptador SIC debe leer para reconstruir ciclos 26-25, no `avboard_data.js`.

---

## 2. Matriz de datos

| Dato SIC | Fuente actual | Ruta | Campo origen | Transformación requerida | Estado |
|---|---|---|---|---|---|
| Vendedores (nombre) | `TX_CL`/`TX_PE` (campo `vendedor`), `avboard_data.js` (claves RTC), `nuevo libro base AV 2026.xlsx` hoja `Presupuesto Pais` | `Panel_IEC_Auditoria_2026.html`; `avboard_data.js`; `inbox/nuevo libro base AV 2026.xlsx` | `vendedor` (nombre completo, mayúsculas) | Normalizar nombre → clave (`rtc_name_map` ya existe en Python para CxC; ventas usa otro `rtc_map` parcialmente distinto); excluir entradas no comerciales (`OFICINA`, `LABORATORIO`, `EN TERRENO 1`, `JAVIER ALMEIDA`) | ⚠️ Parcial — 3 mapeos de nombre→clave distintos y no unificados (ver sección 4) |
| Cargos (RTC/KAM/Jefe) | — | — | — | No existe ningún campo de "cargo" en todo el repositorio (`grep cargo` = 0 resultados) | ❌ Faltante — el prototipo demo lo tenía sintético; en real no existe |
| Equipos | — | — | — | No existe agrupación de equipos comerciales en ninguna fuente | ❌ Faltante |
| Países | Nombre de archivo / hoja | `inbox/Libro de Ventas *.xlsx` (Chile) vs `inbox/AGROVECA PERU - VENTAS *.xlsx` (Perú) | Implícito por archivo, campo `PAÍS` presente en Chile (`'CHILE'`) | Ya distinguible sin ambigüedad — un archivo por país | ✅ Disponible |
| Ciclos comerciales (26→25) | — (no existe en ninguna fuente) | — | `fecha` (día exacto) en `TX_CL`/`TX_PE` | Recalcular: todo dato con granularidad diaria (`TX_CL`/`TX_PE`) puede re-agruparse en ventanas 26→25; los agregados mensuales de `avboard_data.js` NO pueden (prorrateo obligado si se usan) | ⚠️ Reconstruible solo desde `TX_CL`/`TX_PE`, no desde `avboard_data.js` |
| Presupuestos | `nuevo libro base AV 2026.xlsx`, hoja `Presupuesto Pais` (real, por RTC, mensual) | `inbox/nuevo libro base AV 2026.xlsx` | Filas `RTC` × columnas `ENE..DIC` | Prorratear mensual → ventana 26-25 (proporción de días); mapear nombre RTC → clave vendedor | ✅ Fuente primaria real existe, pero **no se lee automáticamente** — `scripts/update_avboard.py` usa diccionarios `PPTO_RTC_CL`/`PPTO_RTC_ANUAL_PE` **hardcodeados** en vez de leer esta hoja directamente (hallazgo ya documentado en Fase 2 de `project_sic_av`, sigue vigente) |
| Ventas facturadas | `TX_CL`/`TX_PE` (`total`, `fecha`) o `Libro de Ventas *.xlsx` / `AGROVECA PERU VENTAS *.xlsx` (crudo) | `Panel_IEC_Auditoria_2026.html`; `inbox/Libro de Ventas *.xlsx`; `inbox/AGROVECA PERU -  VENTAS *.xlsx` | `Total` (Chile) / `DOLARES` (Perú, dentro de `CONCEPTO` hay cantidad embebida) | Perú: parsear `CONCEPTO` (ej. `"300 LTS VECASIL FORTE"`) para separar cantidad+producto — ya existe `parse_concepto_pe()` en Python | ✅ Fuente primaria disponible; derivado (`TX_CL`/`TX_PE`) ya normalizado y es la mejor fuente para el SIC |
| Ventas cobradas (venta neta cobrada) | — (no existe como tal) | — | — | **No existe ningún archivo con fecha de pago real por factura.** Los archivos `Cuentas Cobrar *.xlsx` / `AGROVECA - CUENTAS POR COBRAR *.xlsx` son *reportes de saldo pendiente* (snapshot a una fecha de corte), no un libro de cobros. Una factura que no aparece en el snapshot se infiere "ya cobrada", pero no se sabe cuándo | ❌ Faltante — brecha estructural, ver sección 3.1 |
| Facturas (folio/documento) | `TX_CL`/`TX_PE` (`folio`, `doc`) y CxC (`Número`) | `Panel_IEC_Auditoria_2026.html`; `inbox/Cuentas Cobrar *.xlsx` (hoja `Detalle Mora`) | `folio` / `Número` | Folio permite cruzar TX de venta ↔ registro CxC pendiente (match exacto observado) | ✅ Disponible, cruzable por folio |
| Fecha de factura | `TX_CL`/`TX_PE` (`fecha`), CxC (`Emisión`) | ídem | `fecha` / `Emisión` | Ninguna — ya en formato ISO en TX_CL/TX_PE | ✅ Disponible — **con una excepción real detectada (ver 3.2, bug de fecha Perú)** |
| Fecha de cobro | — | — | — | No existe. Ver 3.1 | ❌ Faltante |
| Días de cartera | Derivable solo de forma aproximada | `Cuentas Cobrar *.xlsx` hoja `Detalle Mora`, campo `Días Mora` | `Días Mora` = días entre `Vencimiento` y la fecha de corte del snapshot (NO desde `fecha factura`, y solo para facturas AÚN pendientes) | Para facturas ya pagadas no hay forma de calcular días reales al cobro; para pendientes, `Días Mora` es una aproximación distinta a la definición SIC (que cuenta desde `fecha_factura` hasta el pago real) | ❌ No calculable con precisión desde las fuentes actuales |
| Notas de crédito | — | — | — | No existe ningún tipo de documento "Nota de Crédito" en `Libro de Ventas` (`Documento` solo tiene `Factura Electrónica`, `Guía de Despacho Electrónica`, `Boleta Electronica`); tampoco montos negativos en `Total` (0 filas negativas verificadas) | ❌ Faltante — no hay ninguna fuente de NC hoy |
| Devoluciones | — | — | — | Mismo caso que NC — no existe ninguna fuente | ❌ Faltante |
| Ajustes | — | — | — | No existe ningún concepto de "ajuste autorizado" en ninguna fuente | ❌ Faltante |
| IEC | `TX_CL`/`TX_PE` (`elegible`, `sp`, `bp`, `cumple`) y resumen ya calculado en `avboard_data.js` (`chile_ventas.iec`) | `Panel_IEC_Auditoria_2026.html`; `avboard_data.js` | Fórmula: `IEC = Σsp / Σelegible` (ya documentada en `docs/AVBOARD_BUSINESS_RULES.md`, sección 1-2) — **misma tabla de tramos (20/70/80/90/105%) que ya usa `sic_core.js`** | El IEC de `avboard_data.js` es mensual/YTD; para el ciclo 26-25 del SIC hay que recalcularlo desde `TX_CL`/`TX_PE` filtrando por fecha del ciclo (posible, granularidad diaria disponible) | ✅ Recalculable con precisión desde TX_CL/TX_PE |
| Precio de venta | `TX_CL`/`TX_PE` (`pv`), `Libro de Ventas` (`Precio Uni`) | ídem | `pv` / `Precio Uni` | Ninguna, ya numérico | ✅ Disponible |
| Precio piso | `TX_CL`/`TX_PE` (`pp`), tablas `inbox/precios piso CHile .xlsx` / `inbox/precio piso peru.xlsx` (hoja "Lista de precios") | ídem | `pp` / columna `Precio Piso AV` | Requiere matching producto+formato (funciones `normalize_prod_name`, `parse_producto_formato`, `buscar_piso_chile/peru` ya existen y funcionan en Python) — 47 clientes Chile / 21 Perú quedan sin match (documentado en `AVBOARD_BUSINESS_RULES.md` §11) | ✅ Disponible, con cobertura incompleta ya cuantificada |
| Clientes | `avboard_clientes.js` (`CLIENTES_CL`/`CLIENTES_PE`) | `avboard_clientes.js` | objeto completo por cliente (`id`, `nombre`, `rut`, `pais`, `region`, `vendedor`, moneda, ventas, iec, cxc, productos, score) | Ninguna — estructura ya agregada y madura | ✅ Disponible (agregado YTD, no por ciclo) |
| Productos | `TX_CL`/`TX_PE` (`producto`, `formato`, `producto_orig`) | ídem | ya normalizado a nombre canónico + formato | Ninguna | ✅ Disponible |
| Costo de fábrica | `inbox/precios piso CHile .xlsx` / `precio piso peru.xlsx`, hoja `Pricing Piso *` | ídem | `COSTO FÁBRICA (PKG)` | No requerido por el SIC (solo relevante para el futuro módulo PRODUCTOS) | ➖ Fuera de alcance de este CR |

---

## 3. Hallazgos críticos (bloquean precisión, no bloquean avanzar)

### 3.1 No existe fecha de cobro real en ninguna fuente

Los archivos `Cuentas Cobrar *.xlsx` (Chile, 2 entidades) y `AGROVECA - CUENTAS POR COBRAR *.xlsx` (Perú) son **reportes de saldo pendiente a una fecha de corte** ("REPORTE DE DOCUMENTOS PENDIENTES" / hoja `Detalle Mora`), no un libro de cobros. Contienen: `Emisión`, `Vencimiento`, `Días Mora` (respecto al corte), `Tramo` (0-30/31-60/61-90/+90 — bucket estándar, **no** los tramos propios del SIC), `Saldo`. No contienen una columna de "fecha de pago".

Esto significa que:
- Para una factura que **ya no aparece** en el snapshot más reciente, se puede inferir que fue pagada, pero no se sabe el día exacto — solo que ocurrió entre la fecha del snapshot anterior (donde sí aparecía) y la fecha del snapshot actual.
- Para una factura que **sí aparece**, se conoce cuánto lleva vencida respecto a su fecha de vencimiento (no de facturación), a la fecha del corte — no es lo mismo que "días al cobro" tal como lo define el SIC.

**Consecuencia para el adaptador:** la "venta neta cobrada" y los "días de cartera" del SIC no pueden calcularse con precisión histórica hoy. El adaptador debe: (a) usar el snapshot CxC más reciente disponible para clasificar cada factura como `pendiente` (aparece, con saldo) o `presuntamente_cobrada` (no aparece), (b) marcar explícitamente esa segunda categoría como una **estimación**, nunca como un hecho, y (c) para "días de cartera" de facturas pendientes, usar `Días Mora` con una nota de que mide antigüedad desde vencimiento, no desde facturación.

**Hallazgo adicional (Fase 3, verificado ejecutando el motor sin modificar sobre datos reales):** la ausencia de cobranza no solo deja en 0 la comisión *liberada* — también deja en 0 la comisión *potencial* que hoy calcula `sic_core.js`. Esto porque `SIC.calcularVendedorCiclo` calcula el `cumplimiento_pct` (y por lo tanto el Factor de Presupuesto) sobre `venta_cobrada`, no sobre `venta_facturada` (ver `sic_core.js` línea ~326: `cumplimientoPct = ventaCobradaCiclo / presupuesto * 100`). Con `venta_cobrada = 0` en todo ciclo real, el cumplimiento del motor es siempre 0%, el Factor de Presupuesto queda en 0% (tramo `<90% -> 0%`), y ese factor multiplica tanto la comisión liberada como la comisión potencial proyectada — dejando ambas en 0, incluso cuando hay venta facturada real significativa. Esto es correcto y esperado del motor sin modificar (no es un bug del adaptador ni del CR v1.5): confirma que **ningún resultado de comisión (potencial o liberada) será representativo sobre datos reales mientras no exista una fuente real de cobranza**. Lo que sí es representativo hoy: venta facturada, presupuesto prorrateado, IEC real, y un cumplimiento aproximado calculado fuera del motor como venta facturada / presupuesto (ilustrativo, no equivalente al cumplimiento oficial del SIC que exige venta cobrada).

### 3.2 Bug de fecha detectado en TX_PE (Perú)

Al extraer `TX_PE` de `Panel_IEC_Auditoria_2026.html` se encontraron fechas como `"2026-12-03"` y `"2026-05-01"` para transacciones cuyo archivo fuente (`AGROVECA PERU - VENTAS AL 30.06.2026.xlsx`) solo cubre hasta junio 2026. Ejemplo verificado: el folio `897` (`FECHA EMISION` real = `05/01/2026`, es decir 5 de enero en formato DD/MM) aparece en `TX_PE` con `"fecha":"2026-05-01"` (1 de mayo) — el día y el mes quedaron **invertidos** al parsear (se interpretó como MM/DD en vez de DD/MM). Esto es un bug real en el pipeline de Perú, independiente del SIC, que **no fue introducido por este trabajo** — se documenta aquí porque afecta directamente la fiabilidad de cualquier ciclo 26-25 construido sobre `TX_PE` hasta que se corrija en el pipeline de AVBOARD. El adaptador SIC debe poder detectar y advertir estos casos (fecha fuera del rango del corte declarado), no corregirlos silenciosamente.

### 3.3 Tres mapeos de nombre de vendedor distintos, no unificados

`scripts/update_avboard.py` usa **tres diccionarios nombre→clave diferentes** en tres lugares distintos:
- `extract_chile_ventas()` (línea ~228): `rtc_map` — 8 nombres, incluye `'RAYEN BERNAZAR': 'bernazar'`, `'JAVIER ALMEIDA': 'almeida'`.
- `extract_cxc_chile()` (línea ~450): `rtc_name_map` — 9 nombres, incluye `'RAYEN BERNAZAR': 'otros'`, `'JUAN PABLO NEIRA': 'neira'` (no está en el mapa de ventas).
- `PPTO_RTC_CL` (línea 107): solo 5 claves (`caroca`, `laratro`, `encina`, `velasquez`, `veverka`) — **no incluye** `munoz`, `almeida`, `franco_riffo`, `bernazar`, `neira`.

Esto quiere decir que hoy mismo, dentro de AVBOARD, "Rayen Bernazar" se clasifica como `bernazar` en ventas pero como `otros` en cartera — el mismo nombre real, dos claves distintas según el panel. El SIC no debe copiar este patrón: el adaptador usa **un único mapa de normalización de vendedor**, documentado y centralizado.

### 3.4 Vendedores con venta real pero sin presupuesto (validación aplicable de inmediato)

Comparando `avboard_data.js → chile_ventas.rtc_mensual_real` (7 claves: `almeida, caroca, encina, laratro, munoz, velasquez, veverka`) contra `rtc_mensual_ppto` (5 claves: `caroca, encina, laratro, velasquez, veverka`): **`munoz` (Valentina Muñoz) tiene ventas reales pero no tiene presupuesto asignado** en ninguna fuente localizada (tampoco en `PPTO_RTC_CL` ni en la hoja `Presupuesto Pais` de `nuevo libro base AV 2026.xlsx`, que tampoco trae una fila para "Valentina Muñoz" con datos — sí trae una fila "VALENTINA MUÑOZ" con presupuesto en la hoja del libro base, por lo que el hueco está en `update_avboard.py`, no en la fuente original). `almeida` (Javier Almeida) no es un vendedor comercial — es una cuenta interna/de prueba que aparece mezclada en el campo `Vendedor` del Libro de Ventas junto con `OFICINA`, `LABORATORIO`, `EN TERRENO 1` — el adaptador debe excluir estas 4 entradas no comerciales.

### 3.5 Registro "CAPEL" en la hoja de presupuesto

La hoja `Presupuesto Pais` de `nuevo libro base AV 2026.xlsx` incluye una fila `CAPEL` con presupuesto asignado (360.000 CLP anual) que no corresponde a ninguna persona vendedora conocida en ninguna otra fuente — podría ser un cliente, una línea de negocio o un centro de costo. Se deja marcado como pendiente de aclaración, no se asume nada.

### 3.6 Diferencias Chile vs Perú

| Aspecto | Chile | Perú |
|---|---|---|
| Granularidad de venta | Por línea de factura (`Libro de Ventas`) | Por línea de factura, pero cantidad+producto vienen concatenados en `CONCEPTO` y requieren parseo (`parse_concepto_pe`) |
| Unidades de negocio | 3 (`Agroveca`, `Agrocomercial`, `Laboratorio`) — CxC solo consolida 2 (`Agrocomercial`, `Agroveca Chile`); `Laboratorio` no tiene CxC propio localizado | 1 sola entidad (`AGROVECA PERU S.A.C.`) |
| Moneda | CLP (100% de las filas verificadas) | USD |
| Tabla de cartera SIC | 0/30/180/210/360 días (definitiva, política V1.1) | 0/30/60/120/180 días (definitiva, sin cambios) — **tramos distintos entre países, ya reflejados correctamente en `parametros_<pais>.json`** |
| CxC — snapshots disponibles | 6 cortes semanales/quincenales (may-jun 2026) por 2 entidades | 9 cortes (abr-jun 2025, más antiguos y con nombre de archivo inconsistente) |
| Vendedor: fuente de nombre | Nombre completo en `Vendedor` (Libro de Ventas) | Nombre completo en `VENDEDOR` (Registro de Ventas) — mismo patrón |
| Precio piso | Tabla propia, moneda CLP | Tabla propia, moneda USD |
| Bug de fecha (3.2) | No detectado | Detectado (folios con mes/día invertido) |

---

## 4. Campos disponibles — resumen ejecutivo

Disponibles y confiables hoy: vendedor (nombre), país, fecha de factura (Chile confiable; Perú con bug puntual a vigilar), folio, cliente, producto, formato, precio de venta, precio piso, venta facturada (monto), presupuesto mensual real por RTC (fuente primaria en Excel, aunque el script actual la hardcodea en vez de leerla), IEC (recalculable con precisión por ciclo desde TX_CL/TX_PE).

## 5. Campos faltantes — resumen ejecutivo

No existen en ninguna fuente hoy: cargo del vendedor, equipo comercial, fecha de cobro real, notas de crédito, devoluciones, ajustes autorizados. Días de cartera solo aproximables (no exactos) para facturas aún pendientes; para facturas ya pagadas, no hay forma de saber cuándo se cobraron.

## 6. Conclusión de Fase 1

Existe suficiente dato real (Chile y Perú) para reconstruir **ventas facturadas, presupuesto, IEC y comisión sobre precio de venta** con un ciclo comercial 26-25 real. **No existe** dato suficiente para calcular con exactitud la "venta neta cobrada" ni los "días de cartera" tal como los define el SIC — cualquier cifra de comisión "liberada" derivada de datos reales debe mostrarse marcada como **estimada**, nunca como definitiva, hasta que AVBOARD incorpore una fuente real de fecha de cobro (hoy no existe ni como proyecto). Se procede a Fase 2 (adaptador) con esta limitación documentada y visible en el propio adaptador y en la interfaz.

> **Actualización Fase 4 (2026-07-13):** una auditoría profunda y definitiva de cobranzas, cubriendo todo el repositorio (no solo `apps/sic_av/`) — scripts, `inbox/`, `versions/`, reportes ya construidos — confirma y profundiza esta conclusión. Ver `COLLECTION_SOURCE_AUDIT.md` para el detalle completo, incluyendo un hallazgo nuevo: **el CxC de Perú en `avboard_data.js` está congelado/hardcodeado en el código del pipeline (`extract_peru_cxc_static()`, corte fijo `10/05/2026`) y no se refresca desde ningún archivo de `inbox/`** — ni siquiera con la brecha ya conocida de falta de fecha de pago.

## 7. Correcciones pendientes de calidad de datos (Fase 4.5 — causa, impacto, propuesta)

No se corrige ninguna de estas automáticamente en esta fase — se documenta causa, impacto y propuesta para que Gerencia/Finanzas decida cuándo abordarlas.

**1. Bug de fechas en TX_PE (sección 3.2).** Causa: el parseo de `AGROVECA PERU - VENTAS AL *.xlsx` invierte día/mes al construir `TX_PE` dentro de `Panel_IEC_Auditoria_2026.html` (ej. `05/01/2026` → `2026-05-01` en vez de `2026-01-05`), y en varios registros el resultado es directamente `NaN`. Impacto: cualquier ciclo 26-25 reconstruido sobre `TX_PE` puede tener transacciones en el ciclo equivocado o excluidas por completo; el adaptador SIC ya detecta y excluye (con advertencia visible) las fechas inválidas, pero no puede corregir las invertidas sin arriesgar adivinar. Propuesta: corregir el parseo de fecha en el script que genera `Panel_IEC_Auditoria_2026.html` (fuera del alcance de `apps/sic_av/`), no en el adaptador.

**2. Presupuesto mensual de Perú no existe como tal (solo anual).** Causa: `avboard_data.js` solo trae `peru_ventas.rtc_ppto_anual` — no hay un desglose mensual real capturado en ninguna fuente. Impacto: el prorrateo del adaptador (anual/12) es una aproximación más gruesa que la de Chile (que sí prorratea con datos mensuales reales), y puede sobre o subestimar el presupuesto de un ciclo específico si las ventas de Perú son estacionales. Propuesta: pedir a Finanzas Perú un desglose mensual de presupuesto por RTC, igual al que ya existe para Chile en "Presupuesto Pais" del Libro Base.

**3. Tres mapeos de nombre de vendedor no unificados (sección 3.3).** Causa: `scripts/update_avboard.py` mantiene `rtc_map`, `rtc_name_map` y los diccionarios `PPTO_RTC_CL`/`PPTO_RTC_ANUAL_PE` por separado, con coberturas distintas (ej. `RAYEN BERNAZAR` mapea a `bernazar` en ventas pero a `otros` en CxC). Impacto: un mismo vendedor real puede aparecer con dos claves distintas según el panel, lo que ya se evitó en el adaptador SIC con un mapa único (`SICAdapter.VENDEDOR_MAP`), pero el problema persiste en el resto de AVBOARD. Propuesta: unificar los tres diccionarios en `update_avboard.py` en uno solo, reutilizable por todas las funciones de extracción.

**4. Perú no distingue tipo de cliente (Distribuidor/Cliente Final).** Causa: ni `TX_PE` ni el Registro de Ventas de Perú traen ese campo a nivel de transacción. Impacto: el adaptador SIC asume "Distribuidor" por defecto para toda venta de Perú, con advertencia visible en cada factura — si la tasa de cartera realmente distinguiera por tipo de cliente en Perú (hoy no distingue, ver sección 3), el impacto real sería menor al aparente. Propuesta: si Comercial Perú confirma que sí hay distinción operativa, capturarla en el Registro de Ventas como columna nueva.

**5. Ausencia total de notas de crédito, devoluciones y ajustes.** Causa: no existe ningún tipo de documento "Nota de Crédito" en ninguna fuente (`Libro de Ventas` solo tiene Factura Electrónica, Guía de Despacho Electrónica, Boleta Electrónica; 0 filas con monto negativo verificadas). Impacto: el SIC no puede hoy aplicar el término "− Notas de Crédito − Devoluciones − Ajustes autorizados" de su propia fórmula sobre datos reales — el adaptador los deja en `0` explícitamente, no los inventa. Propuesta: si estos documentos existen en el sistema contable de Agroveca fuera de los Excel de `inbox/`, incorporarlos como una fuente nueva; si no existen como proceso formal, documentarlo como decisión de Gerencia (no como brecha técnica).

**6. Falta de cargo y equipo del vendedor.** Causa: ninguna fuente (`TX_CL`/`TX_PE`, CxC, Libro de Ventas) trae el cargo (RTC/KAM/Jefe de Ventas) ni el equipo comercial como atributo — es información que hoy solo existe, si acaso, en la cabeza de Gerencia Comercial. Impacto: el adaptador SIC deja `cargo: "No disponible en fuente real"` explícito en cada vendedor real. Propuesta: mantener una tabla maestra simple (Excel o JSON) de vendedor → cargo → equipo → país, que Comercial actualice manualmente cuando cambie, y que el adaptador lea como fuente adicional de solo lectura.
