# SIC-AV — Prototipo Funcional del Módulo de Comisiones (v1.6 — flujo principal con datos reales)

**CORRECCIÓN v1.6 (2026-07-13):** `sic_chile.html` y `sic_peru.html` — el flujo principal al que se llega desde el Portal → SIC AV → País — dejaron de mostrar datos demostrativos. Ahora cargan datos reales del AV LATAM Board a través de `js/sic_data_adapter.js` (mismo adaptador de solo lectura ya usado por `sic_datos_reales.html`), sin duplicar lógica y sin modificar `sic_core.js`. Antes de esta corrección, el acceso principal mostraba datos sintéticos y solo `sic_datos_reales.html` (una vista secundaria) tenía datos reales — ver detalle en `CHANGELOG.md`.

**Estado de cobranza real (actualizado 2026-07-13, ver `COLLECTION_SOURCE_AUDIT.md`):** no existe hoy, en ninguna fuente del AV LATAM Board, fecha ni monto real de cobro por factura. La comisión (potencial y liberada) sobre datos reales queda marcada como **pendiente de integración de cobranza real**, nunca como "$0" definitivo — ver `sic_chile.html`/`sic_peru.html` (Bloque 2), `sic_datos_reales.html`, y `PRESENTATION_READINESS.md` antes de cualquier presentación ejecutiva.

Sistema Integral de Incentivos Comerciales de Grupo AV LATAM. Este es un **prototipo aislado**, construido para validar visualmente el modelo de cálculo definido en la Fase 3 (`docs/sic_av/SIC_AV_POLICY_V1.md`) antes de integrarlo a AV LATAM Board. No está conectado a datos productivos ni al Board.

Actualizado el 2026-07-13 según el **CHANGE REQUEST SIC-AV v1.4**: se eliminó por completo el Factor de Precio Piso del cálculo de comisión (decisión de Gerencia General: toda venta facturada se considera una operación válida y previamente aprobada por la compañía). Una venta bajo piso ya **no** produce comisión cero, reducción, bloqueo, retención ni excepción manual — entra al cálculo normal igual que cualquier otra venta. El precio piso se mantiene únicamente como dato informativo por factura, insumo del Factor IEC y clasificación de la venta (sobre piso / bajo piso / no evaluable); el **Factor IEC es el único mecanismo** por el cual el precio piso puede impactar la comisión (ver sección 6). El mismo día, el **CHANGE REQUEST SIC-AV v1.3** agregó la página "Política y Factores" (`sic_politica.html`, accesible desde ambos dashboards) y dejó definido el Factor IEC por tramos fijos, reemplazando la curva continua/interpolada anterior — ya no queda ningún factor calculado por interpolación. También el 2026-07-13, el **CHANGE REQUEST SIC-AV v1.2** agregó el selector de ciclo comercial (sección 6b). El 2026-07-12, el **CHANGE REQUEST SIC-AV v1.1** dejó definidos el Factor de Cumplimiento de Presupuesto y la tabla de edad de cartera de Chile. El bono de consistencia trimestral sigue siendo demostrativo/ilustrativo en sus tramos de liberación.

> **MODELO DEMOSTRATIVO — BONO DE CONSISTENCIA TRIMESTRAL PENDIENTE DE APROBACIÓN GERENCIAL.** Todos los datos, vendedores, clientes y cifras de este prototipo son sintéticos.

---

## 1. Objetivo

Permitir que Gerencia General, Gerencia Comercial y Finanzas **vean y prueben** cómo se comportaría el nuevo esquema de incentivos SIC-AV en la práctica — con datos ficticios de Chile y Perú — antes de tomar las decisiones pendientes (`docs/sic_av/SIC_AV_DECISIONES_GERENCIA.md`) y antes de que exista una sola línea de integración con datos reales.

El vendedor (demo) puede, en menos de dos minutos:
1. Ver cuánta comisión tiene liberada, pendiente y potencial en el ciclo vigente — o en cualquier ciclo histórico que seleccione.
2. Entender, paso a paso, cómo se construyó esa comisión.
3. Ver el detalle factura por factura que la explica.
4. Ver qué comisión quedó diferida por incumplir presupuesto, y bajo qué condiciones se libera al cierre del trimestre.
5. Ver ideas concretas (sin promesas de pago) de qué acciones aumentarían su comisión.
6. Ver su histórico de ciclos anteriores, y consultar el detalle completo de cualquiera de ellos mediante el selector de ciclo.
7. Descargar un informe ejecutivo en PDF del ciclo vigente o de cualquier ciclo histórico seleccionado.

## 2. Estructura de la carpeta

```
apps/sic_av/
├── index.html              Pantalla de acceso (selección de país + clave)
├── sic_chile.html           Dashboard del vendedor — Chile (v1.6: datos REALES vía SICAdapter, ya no demo)
├── sic_peru.html            Dashboard del vendedor — Perú (v1.6: datos REALES vía SICAdapter, ya no demo)
├── sic_politica.html         Página "Política y Factores" (accesible desde ambos dashboards)
├── sic_datos_reales.html      Vista de auditoría técnica — mismo ciclo real 26-25, con conciliación y advertencias en detalle (ver sección 3b)
├── sic_core.js               Motor de cálculo (SIC.*), sin dependencias externas — SIN modificar en v1.5
├── sic_auth.js                Autenticación de prototipo, centralizada (SICAuth.*) — SIN modificar en v1.5
├── sic_pdf.js                  Generador del Informe Ejecutivo en PDF (SICPDF.*)
├── sic_styles.css               Estilos (estilo AV LATAM: blanco, azul corporativo, minimalista) — SIN modificar en v1.5
├── js/
│   └── sic_data_adapter.js        NUEVO (v1.5) — Adaptador de solo lectura entre las fuentes reales del Board y sic_core.js (SICAdapter.*)
├── data/                          14 archivos JSON de datos demostrativos (ver sección 5)
├── tests/
│   ├── run_engine_tests.js        Pruebas del motor de cálculo y del PDF (Node, sin navegador) — 49/49
│   ├── run_ui_tests.js             Pruebas de autenticación, aislamiento por país y "Política y Factores" (jsdom + servidor HTTP) — 9/9
│   ├── run_adapter_tests.js         Pruebas del adaptador de datos reales (Node, fs.readFileSync) — 26/26
│   ├── run_datos_reales_ui_test.js   Prueba de humo de sic_datos_reales.html, vista de auditoría técnica (jsdom + servidor HTTP) — 13/13
│   └── run_dashboard_real_test.js     NUEVO (v1.6) — Prueba de humo del flujo principal con datos reales: sic_chile.html/sic_peru.html (jsdom + servidor HTTP) — 24/24
├── reports/                        Carpeta sugerida para informes PDF generados durante pruebas
├── DATA_SOURCE_AUDIT.md             NUEVO (v1.5) — Auditoría de dónde vive cada dato del SIC en las fuentes reales del Board
├── COLLECTION_SOURCE_AUDIT.md        NUEVO (v1.5 Fase 4) — Auditoría profunda de cobranzas en TODO el repositorio (no solo apps/sic_av/)
├── PRESENTATION_READINESS.md         NUEVO (v1.5 Fase 4) — Qué está listo/pendiente para la presentación ejecutiva, riesgos, recomendación
├── CHANGELOG.md                      NUEVO (v1.5 Fase 4) — Historial de cambios del módulo SIC-AV, versión por versión
├── TEST_RESULTS.md                  Resultados de las pruebas automatizadas (ver conteo actualizado en ese archivo)
└── README.md                         Este archivo
```

Ningún archivo fuera de `apps/sic_av/` fue creado, leído para modificar, ni tocado durante esta fase. `sic_datos_reales.html` y `js/sic_data_adapter.js` **leen** (nunca escriben) dos archivos del Board fuera de esta carpeta: `Panel_IEC_Auditoria_2026.html` y `avboard_data.js`, ambos en la raíz del repositorio. La auditoría profunda de cobranzas (Fase 4) también **leyó** (sin modificar) archivos adicionales del Board fuera de `apps/sic_av/`: `scripts/update_avboard.py`, `scripts/version_avboard.py`, múltiples archivos de `inbox/`, `versions/manifest.json` y `Panel_CxC_AV_Latam_2026.html` — documentado en `COLLECTION_SOURCE_AUDIT.md`.

## 3. Cómo abrir el prototipo localmente

El prototipo usa `fetch()` para cargar los JSON de `data/` y (desde v1.6, en `sic_chile.html`/`sic_peru.html`/`sic_datos_reales.html`) las fuentes reales del Board. Los navegadores bloquean `fetch()` sobre archivos abiertos con doble clic (protocolo `file://`) por política de CORS — **es necesario un servidor HTTP local**, no basta con abrir `index.html` directamente.

**Desde v1.6, el servidor debe levantarse siempre desde la raíz del repositorio** (ver sección 3b) — ya no solo para `sic_datos_reales.html`, sino también para el flujo principal (`sic_chile.html`/`sic_peru.html`), porque ambos ahora leen `Panel_IEC_Auditoria_2026.html` y `avboard_data.js` en vivo.

Para detener el servidor: `Ctrl+C` en la terminal donde quedó corriendo.

## 3b. Cómo abrir el prototipo con datos reales (v1.6)

`sic_chile.html`, `sic_peru.html` y `sic_datos_reales.html` leen en vivo `Panel_IEC_Auditoria_2026.html` y `avboard_data.js`, que viven en la **raíz del repositorio** (dos niveles arriba de `apps/sic_av/`). Los servidores HTTP estáticos (incluido `python3 -m http.server`) no sirven archivos fuera de la carpeta desde la que se levantan, así que el servidor debe levantarse desde la **raíz del repo**, no desde `apps/sic_av/`:

```bash
cd <raíz-del-repositorio>          # donde vive Panel_IEC_Auditoria_2026.html
python3 -m http.server 8123
```

Luego abrir: `http://localhost:8123/apps/sic_av/index.html`. Con el servidor levantado así, todas las páginas del prototipo (`sic_chile.html`, `sic_peru.html`, `sic_politica.html`, `sic_datos_reales.html`) funcionan igual, solo cambia la URL base.

`js/sic_data_adapter.js` es de **solo lectura**: no escribe en `Panel_IEC_Auditoria_2026.html` ni en `avboard_data.js`, no modifica `sic_core.js`. Requiere la misma sesión de `sic_auth.js` que el resto del prototipo (clave por país) — no se agregó ni se modificó ningún mecanismo de autenticación.

`sic_datos_reales.html` sigue disponible como **vista de auditoría técnica** (conciliación detallada, tabla completa de advertencias) — accesible desde el botón "Datos Reales (auditoría técnica)" en `sic_chile.html`/`sic_peru.html`; ya no es la única forma de ver datos reales, porque el dashboard principal los muestra directamente.

## 4. Claves de acceso (prototipo)

| País | Clave |
|---|---|
| Chile | `chile26` |
| Perú | `peru26` |

Cada clave da acceso **únicamente** a su país — una clave válida de un país es rechazada explícitamente si se ingresa en el formulario del otro país (aislamiento verificado en `tests/run_ui_tests.js`, prueba `aislamiento_pais`). No hay forma de acceder a `sic_chile.html` o `sic_peru.html` cambiando solo la URL sin haber pasado antes por `index.html` con la clave correcta — cada pantalla exige una sesión válida en `sessionStorage` al cargar (`SICAuth.exigirSesion`).

**Esto NO es autenticación productiva.** Ver advertencia en la sección 12.

## 5. Datos demostrativos

14 archivos JSON en `data/`, 7 por país (todos sintéticos, sin nombres reales):

- `parametros_<pais>.json` — tabla de edad de cartera, tramos fijos del Factor Presupuesto (Política V1.1) y del Factor IEC (Política V1.2), bono por excedente, tramos de liberación del diferido trimestral, ciclos y trimestres. Ya no incluye una tabla de factor de precio piso (eliminada en la Política V1.4).
- `vendedores_<pais>.json` — 4 vendedores por país (mezcla de RTC, KAM y Jefe de Ventas).
- `ventas_<pais>_demo.json` — ≥30 facturas por país, con cliente embebido en cada registro. Cubre: pago contado, pronto pago (1-30 días), tramos intermedios, cobro tardío, pago parcial, factura pendiente sin cobro, venta bajo piso (informativo, ya no distingue autorizada/no autorizada para efectos de comisión), venta sobre presupuesto.
- `cobranzas_<pais>_demo.json` — pagos asociados a cada factura (incluye pagos parciales en múltiples fechas) y notas de crédito anidadas bajo la clave `notas_credito`.
- `presupuestos_<pais>_demo.json` — presupuesto mensual por vendedor y ciclo, incluyendo meses calibrados para probar los 4 tramos de liberación trimestral (50%, 75%, 100% y 0%/no cumple).
- `iec_<pais>_demo.json` — Índice de Ejecución Comercial por vendedor y ciclo.
- `precios_piso_<pais>_demo.json` — precio piso por producto y presentación.

Moneda: CLP para Chile, USD para Perú.

**Nota v1.6:** `sic_chile.html`/`sic_peru.html` siguen llamando a `SIC.cargarPais()` (que internamente sigue haciendo fetch de los 7 JSON de esta sección, sin modificar `sic_core.js`), pero **solo usan el campo `ctx.params`** (la política: tramos, cartera, ciclos) de esa llamada. Los campos `ventas`/`cobranzas`/`presupuestos`/`iec`/`precios_piso` que trae esa misma llamada son descartados por el dashboard principal — los datos de venta/presupuesto/IEC que sí se muestran vienen de `js/sic_data_adapter.js` (fuentes reales del Board). `sic_politica.html` sigue usando estos JSON de forma normal, sin cambios.

## 6. Modelo de cálculo aplicado

```
Comisión Base por Factura   = Venta Neta Cobrada × Tasa por Edad de Cartera
Comisión Ajustada           = Comisión Base × Factor Presupuesto × Factor IEC
Comisión Final del Ciclo    = Σ(Comisión Ajustada) + Bono Excedente + Bono Consistencia Trimestral
                               − Notas de Crédito − Devoluciones − Ajustes autorizados
```

- **Edad de cartera (DEFINITIVO — Política V1.1):**
  - **Chile:** una sola tabla oficial, sin distinción Distribuidor/Cliente Final — Contado 8%, 1-30 días 7,5%, 31-180 días 6%, 181-210 días 3%, 211-360 días 2,5%, más de 360 días 0,5%.
  - **Perú:** Contado 8%, 1-30 días 7,5%, 31-60 días 6%, 61-120 días 5%, 121-180 días 2,5%, más de 180 días 0,5%.
- **Factor de Cumplimiento de Presupuesto (DEFINITIVO — Política V1.1):** tramos fijos, ya no es una curva continua/interpolada. Cumplimiento menor a 90% → factor 0%; entre 90% y 99,99% → factor 80%; 100% o más → factor 100%. **El factor nunca supera 100%** (se eliminaron las referencias a 105%/110% e interpolaciones del modelo anterior). El sobrecumplimiento se reconoce vía Bono por Excedente, no vía este factor.
- **Factor IEC (DEFINITIVO — Política V1.2):** tramos fijos, ya no es una curva continua/interpolada. IEC menor a 70% → factor 20%; 70%-84,99% → 70%; 85%-91,99% → 80%; 92%-94,99% → 90%; 95% o más → 105%. Sigue siendo uno de los cinco pilares del SIC-AV — mide disciplina de gestión (respeto del precio piso), no rentabilidad. **Desde la Política V1.4, el IEC es el único mecanismo por el cual el precio piso puede impactar la comisión.**
- **Precio piso (DEFINITIVO — Política V1.4, CHANGE REQUEST v1.4, 2026-07-13):** se **eliminó por completo** como factor de comisión — ya no existe una tabla de factores de reducción ni de veto por precio piso. Toda venta facturada se considera una operación válida y previamente aprobada por la compañía; una venta bajo piso, por sí sola, **no** produce comisión cero, reducción adicional, bloqueo, retención ni excepción manual. El precio piso se mantiene únicamente como: dato informativo por factura, comparación entre precio de venta y precio piso, insumo del Factor IEC, y clasificación de la venta (sobre piso / bajo piso / no evaluable).
- **Bono por excedente (actualizado v1.4):** 2% sobre la venta neta cobrada que exceda el presupuesto, condicionado al Factor IEC — es independiente del Factor de Presupuesto. Ya no se pondera por precio piso (eliminado del cálculo).
- **Comisión Diferida Trimestral / Bono de Consistencia (mecanismo sin cambios, condición de precio piso eliminada en v1.4):** aísla **exclusivamente** la porción de comisión retenida por no alcanzar el Factor de Presupuesto. La reliquidación al cierre de trimestre nunca restituye reducciones causadas por IEC, cartera, notas de crédito o devoluciones. Tramos de liberación: cumplimiento trimestral 100-104,99% → 50%, 105-109,99% → 75%, ≥110% → 100%; condicionado a IEC trimestral ≥95%, cartera dentro de estándar y sin observaciones financieras graves. Ya no exige la ausencia de "ventas bajo piso no autorizadas" — esa condición se eliminó junto con el factor de precio piso.

## 6b. Selector de ciclo histórico (v1.2)

El encabezado de `sic_chile.html` y `sic_peru.html` incluye un selector "Ciclo comercial" con los 6 ciclos demo de cada país (`2026-02` a `2026-07`), mostrando nombre del ciclo, fecha inicial, fecha final y estado — por ejemplo: *Julio 2026 · 26/06/2026–25/07/2026 · Vigente*. Al cambiar de ciclo se recalcula todo el dashboard para ese período (tarjetas, indicadores, presupuesto, detalle por factura, "cómo se construyó", oportunidades y el informe PDF), usando exactamente el mismo motor de cálculo — cada ciclo ya se calculaba de forma independiente, así que consultar uno histórico no altera ni recalcula el ciclo vigente.

Cada ciclo, en `parametros_<pais>.json`, ahora incluye dos campos adicionales junto a `ciclo`/`inicio`/`cierre`/`estado`:

- `policy_version` — versión de la política aplicada a ese ciclo. **Hoy siempre vale `"SIC v1.1"`** para los 6 ciclos, porque el prototipo solo tiene implementada una única política vigente; no existe todavía un motor que recalcule ciclos históricos con una política distinta a la actual.
- `fecha_datos` — fecha de corte de los datos de ese ciclo (se usa la fecha de cierre del ciclo).

Estos dos campos se muestran en el encabezado del dashboard ("Política aplicada" / "Datos al") y en la portada del PDF, para que quede explícito qué versión de política respalda cada cifra. El modelo de datos queda preparado para que, en una futura versión, cada ciclo pueda referenciar una política distinta a través de `policy_version` (por ejemplo, si Gerencia aprueba una nueva política y se quiere preservar cómo se calculaban los ciclos ya cerrados bajo la política anterior) — pero esa lógica de multi-versión **no está implementada** en este prototipo, por decisión explícita para mantenerlo simple y estable en esta fase.

Detalle completo de la política base y los 18 casos especiales: `docs/sic_av/SIC_AV_POLICY_V1.md`. Las decisiones definitivas de esta sección quedaron fijadas por el CHANGE REQUEST SIC-AV v1.1 (2026-07-12).

## 7. Limitaciones del prototipo

- **Desde v1.6, venta facturada, presupuesto e IEC son datos REALES** (leídos en vivo de `Panel_IEC_Auditoria_2026.html` y `avboard_data.js` vía `js/sic_data_adapter.js`) — ya no son sintéticos en `sic_chile.html`/`sic_peru.html`. La **comisión (potencial y liberada) sigue sin ser representativa**, porque no existe fuente real de cobranza por factura (ver `COLLECTION_SOURCE_AUDIT.md`) — se muestra como "Pendiente de cálculo", nunca como cifra definitiva ni como "$0".
- Conectado de solo lectura a `Panel_IEC_Auditoria_2026.html` y `avboard_data.js` del AV LATAM Board (no a `update_avboard.py`, `ppto_libro_base.py` ni al Inbox directamente — esos son fuentes upstream de esos dos archivos).
- El presupuesto/política de tramos (cartera, IEC, diferido) sigue viniendo de los 14 JSON de `data/` (`SIC.cargarPais` → `ctx.params`), que son estáticos.
- El PDF se genera con `window.print()` (patrón ya usado en `apps/cotizador/cotizador_core.js`) — depende de que el usuario elija "Guardar como PDF" en el diálogo de impresión del navegador; no genera un archivo `.pdf` directamente.
- No implementa roles ni permisos distintos entre RTC, KAM y Jefe de Ventas más allá de mostrarlos como etiqueta — la arquitectura de roles queda pendiente de decisión de Gerencia (ver `docs/sic_av/SIC_AV_DECISIONES_GERENCIA.md`).
- No incluye margen, costo de fábrica ni rentabilidad real — deliberadamente, para no exponer información confidencial al vendedor.
- Autenticación de un solo nivel por país (no por vendedor individual) — ver advertencia sección 12.

## 8. Decisiones que Gerencia General debe aprobar antes de producción

**Ya definidas y aprobadas:**
- Factor de Cumplimiento de Presupuesto por tramos fijos (0% / 80% / 100%, tope 100%) — CHANGE REQUEST v1.1, 2026-07-12.
- Tabla única de edad de cartera para Chile (sin distinción Distribuidor/Cliente Final) y confirmación de la tabla de Perú — CHANGE REQUEST v1.1, 2026-07-12.
- Factor IEC por tramos fijos (20% / 70% / 80% / 90% / 105%), reemplazando la curva continua/interpolada — CHANGE REQUEST v1.3, 2026-07-13.
- Eliminación del Factor de Precio Piso como factor de comisión: toda venta facturada es una operación válida, el precio piso solo impacta la comisión de forma indirecta a través del Factor IEC — CHANGE REQUEST v1.4, 2026-07-13.

**Pendientes:**
1. Aprobar el mecanismo de Comisión Diferida Trimestral y sus tramos de liberación (100-104,99%→50%, 105-109,99%→75%, ≥110%→100%).
2. Resolver los 3 riesgos bloqueantes identificados en la auditoría externa (`docs/sic_av/SIC_AV_AUDITORIA_EXTERNA.md`): tratamiento de rentabilidad/margen, encuadre legal-laboral del esquema, y reemplazo de la autenticación compartida por autenticación individual antes de cualquier uso con datos reales.
3. Aprobar la arquitectura de roles comerciales (RTC / KAM / Jefe de Ventas) y si difieren en tasas o solo en foco de gestión.
4. Definir el propietario funcional y el flujo de aprobación de excepciones (ver tabla de 18 casos especiales en `docs/sic_av/SIC_AV_POLICY_V1.md`) — notar que, tras el CHANGE REQUEST v1.4, esto ya no aplica a excepciones de precio piso dentro del SIC.

## 9. Cómo reemplazar los datos demo por fuentes reales

Cuando Gerencia apruebe avanzar:
1. Sustituir los 14 archivos de `data/` por extracciones reales desde AV LATAM Board (ventas, cobranzas, presupuestos, IEC, precios piso), manteniendo exactamente la misma estructura de campos que usa `sic_core.js` (`SIC.cargarPais`) — así no hay que tocar el motor de cálculo.
2. Reemplazar la autenticación por país (`sic_auth.js`) por autenticación individual por vendedor, integrada al sistema de acceso que use el Board.
3. Los tramos del Factor Presupuesto, del Factor IEC y la eliminación del Factor de Precio Piso ya son definitivos (ver sección 6); solo restan los tramos del diferido trimestral según las decisiones formales de Gerencia pendientes (sección 8), versionando cada cambio (el campo `version_politica` ya existe para esto).
4. Ejecutar `tests/run_engine_tests.js` y `tests/run_ui_tests.js` contra los datos reales cargados como validación de regresión antes de cualquier publicación a vendedores.

## 10. Pasos hacia el Motor Comercial Central

Este prototipo fue diseñado para no duplicar arquitectura: `sic_core.js` sigue el mismo patrón de "motor de cálculo puro + adaptador de datos" que ya existe (sin conectar) en `apps/cotizador/cotizador_core.js` (patrón `Storage`). El paso natural, descrito en `SIC_AV_IMPLEMENTATION_STRATEGY.md`, es:

1. Extraer `SIC.cargarPais` a un adaptador de datos intercambiable (JSON estático hoy → API/base de datos del Motor Comercial Central mañana), sin cambiar la lógica de `calcularVendedorCiclo` ni `calcularDiferidoTrimestral`.
2. Unificar ese adaptador con el que ya usa `cotizador_core.js`, evitando una segunda fuente de verdad para precios piso, presupuestos y clientes.
3. Solo entonces conectar el Portal del Vendedor a datos productivos — nunca antes de que el Motor Comercial Central exista como pieza compartida.

## 11. Advertencias

**Autenticación productiva.** Las claves `chile26` / `peru26` son compartidas por país y existen únicamente para efectos de este prototipo aislado. No deben usarse ni extenderse a un entorno con datos reales de vendedores bajo ninguna circunstancia — la auditoría externa (`docs/sic_av/SIC_AV_AUDITORIA_EXTERNA.md`) marca la autenticación compartida como uno de los riesgos bloqueantes antes de producción.

**Legal y laboral.** Este prototipo no ha sido revisado por Legal ni por RRHH. El esquema de incentivos que representa (comisión diferida, condiciones de liberación) puede tener implicancias contractuales y laborales que deben validarse antes de comunicarse a la fuerza de ventas real. Ninguna cifra mostrada aquí constituye una promesa de pago ni una liquidación oficial — así lo indica explícitamente cada pantalla y el PDF generado.

**Valores demostrativos.** Todos los montos, porcentajes, nombres de clientes y vendedores son sintéticos y fueron construidos para poder probar cada escenario de negocio (edad de cartera, presupuesto, IEC, precio piso como dato informativo, diferido trimestral, notas de crédito) — no reflejan el desempeño real de ningún vendedor ni de la compañía.
