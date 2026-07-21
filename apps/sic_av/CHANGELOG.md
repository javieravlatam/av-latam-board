# SIC-AV — CHANGELOG

Historial de cambios del módulo SIC-AV (`apps/sic_av/`), versión por versión. Todo el trabajo vive dentro de esta carpeta salvo cuando se indica explícitamente lo contrario; ningún cambio de este historial modificó `sic_core.js` de forma retroactiva a menos que se declare, ni tocó autenticación, ni se hizo commit/push.

## v1.6 (2026-07-13) — Arquitectura temporal definitiva: período de cobranza + mes de desempeño

**CHANGE REQUEST SIC-AV v1.6.** Se elimina por completo el concepto "Presupuesto del ciclo 26-25". El SIC opera ahora con dos períodos coordinados pero nunca mezclados: (A) **Período de cobranza** (26 del mes anterior → 25 del mes actual, definición sin cambios) — determina cobros efectivos, facturas cobradas, edad de cartera, tasa base y la liquidación del período; (B) **Mes de desempeño** (el último mes calendario completamente cerrado) — determina presupuesto, venta neta, cumplimiento, Factor de Presupuesto, IEC, Factor IEC y Bono por Excedente. Ver `TEMPORAL_MODEL_v1.6.md` (fuente técnica oficial) y `TEMPORAL_MODEL_AUDIT_v1.6.md` (auditoría previa a la implementación).

- **Fórmula oficial revisada:** Cobros efectivos del período 26-25 × Tasa según edad de cartera × Factor de Cumplimiento del mes de desempeño × Factor IEC del mismo mes de desempeño + Bono por Excedente del mes de desempeño − Notas de Crédito − Devoluciones − Ajustes = Remuneración Variable del período.
- **`sic_core.js`:** nuevas funciones de aritmética de meses (`SIC._shiftMes`, `SIC.mesDesempenoDe`, `SIC.periodoQueLiquidaMes`, `SIC.rangoMesCalendario`), reemplazo de `presupuestoDe`/`iecDe` (por ciclo) por `presupuestoDelMes`/`iecDelMes` (por mes calendario, retornan `null` si no hay dato — nunca 0 inventado), nueva `ventaNetaDelMes`. `SIC.calcularVendedorCiclo` deriva el mes de desempeño del período solicitado y calcula presupuesto/venta neta/cumplimiento/IEC/excedente/bono sobre ese mes. **Bono por Excedente ya NO se pondera por Factor IEC** (fórmula v1.6: `Excedente del mes × 2%`). `SIC.calcularDiferidoTrimestral` itera meses calendario (`trimestre.meses`), no períodos. `SIC.calcularHistorico` expone `identificador_liquidacion`/`fecha_cierre`/`periodo_cobranza_inicio`/`periodo_cobranza_cierre`/`mes_desempeno` junto a los indicadores de ambos bloques.
- **`js/sic_data_adapter.js`:** eliminado el prorrateo de presupuesto entre dos meses calendario (`_proporcionMeses`/`_presupuestoDelCiclo` removidos); `_presupuestoDelMes` lee directamente el mes calendario de desempeño. El adaptador ahora reúne, además de las transacciones del período solicitado, las del mes calendario de desempeño completo (banderas `_pertenece_periodo` / `_pertenece_mes_desempeno` en cada venta), y el IEC real se recalcula sobre el mes de desempeño (antes se calculaba, de hecho, sobre el período).
- **Datos demo migrados** (`data/parametros_*.json`, `data/presupuestos_*_demo.json`, `data/iec_*_demo.json`): campo `ciclo` renombrado a `mes` en presupuestos/IEC, valores recorridos -1 mes para preservar las cifras que ya se mostraban en cada período vigente/cerrado; `trimestres[].ciclos` renombrado a `trimestres[].meses`. Cada archivo migrado documenta el cambio en un campo `_migracion_v1.6` explícito — "no reinterpretar silenciosamente".
- **Dashboards** (`sic_chile.html`/`sic_peru.html`): banner "dos períodos" siempre visible (Período de cobranza + Mes de desempeño aplicado), Bloque 1 con los 8 indicadores del mes de desempeño (presupuesto, venta neta, cumplimiento, Factor Presupuesto, IEC, Factor IEC, excedente, Bono por Excedente), Bloque 2 con los indicadores del período de cobranza (venta facturada, # facturas, monto cobrado, precio piso, conciliación).
- **`sic_politica.html`:** nueva sección "Dos períodos, una sola liquidación" con el ejemplo completo (liquidación 25 junio → período 26 mayo-25 junio → mes de desempeño mayo). Tablas de Factor de Presupuesto/IEC/Bono renombradas a "del mes de desempeño".
- **`sic_pdf.js`:** portada muestra Período de cobranza y Mes de desempeño por separado; Resumen Ejecutivo dividido en "Indicadores del Mes de Desempeño" e "Indicadores del Período de Cobranza"; política PDF actualizada con la misma terminología.
- **Pruebas:** todas las suites existentes actualizadas para los nuevos nombres de campo (`presupuesto`→`presupuesto_mes`, `venta_facturada`→`venta_facturada_periodo`, `excedente_cobrado`→`excedente_mes`, `trimestres[].ciclos`→`trimestres[].meses`). Nueva suite `tests/run_v16_temporal_model_tests.js` (16 pruebas, exactamente las exigidas en la sección 14 del CHANGE REQUEST). Total del módulo: 122→**138** pruebas, todas OK.
- **No se modificó:** `sic_auth.js`, Panel Jefes Chile, Panel Jefes Perú, ninguna fuente de AVBOARD. No se hizo commit ni push (pendiente de aprobación de Gerencia General).

## v1.5.1 (2026-07-13) — Corrección: datos reales en el flujo principal

- **Causa:** aunque v1.5 conectó `js/sic_data_adapter.js` a datos reales del Board, ese adaptador solo se usaba en `sic_datos_reales.html` (vista secundaria). `sic_chile.html`/`sic_peru.html` — el flujo al que se llega desde el Portal → SIC AV → País, ya publicado — seguían llamando únicamente a `SIC.cargarPais()`, que retorna datos 100% demostrativos. Resultado: el acceso publicado mostraba datos sintéticos aunque los datos reales ya existían en el sistema.
- **Corrección:** `sic_chile.html`/`sic_peru.html` ahora combinan `SIC.cargarPais().then(ctx => ctx.params)` (política real, sin tocar `sic_core.js`) con `SICAdapter.cargarFuentesReales()` + `SICAdapter.construirCicloReal()` (mismo patrón ya probado en `sic_datos_reales.html`) — sin duplicar lógica, sin crear una base paralela, sin modificar `sic_core.js` ni `sic_auth.js`.
- **UI:** reorganizados en Bloque 1 (datos reales validados: venta facturada, presupuesto, cumplimiento aproximado, IEC, precio piso, # facturas, conciliación con la fuente, fecha de actualización) y Bloque 2 (estado del cálculo de comisiones — mensaje fijo de pendiente, nunca "$0"). Estados de dato faltante: presupuesto/IEC → "Pendiente de carga"; cobranza real → "Pendiente de integración"; comisión definitiva → "Pendiente de cálculo". Secciones dependientes de cobranza (Comisión diferida trimestral, Qué puedo hacer para aumentar mi comisión) reemplazadas por avisos de estado; el botón de PDF ya no genera un informe con comisión fabricada. Se agregó acceso directo a `sic_datos_reales.html` ("Datos Reales · auditoría técnica") desde ambos dashboards.
- **Pruebas:** `tests/run_ui_tests.js` se redujo de 20 a 9 pruebas (se retiraron las aserciones sobre contenido demo que dejó de existir a propósito, se mantuvieron autenticación/aislamiento/política). Se agregó `tests/run_dashboard_real_test.js` (24 pruebas). Total del módulo: 108→**121** pruebas, todas OK.
- **No se modificó:** `sic_core.js`, `sic_auth.js`, reglas SIC, ni ningún archivo fuente del Board.

## v1.5 — Fase 4 (2026-07-13) — Auditoría profunda de cobranzas y cierre para presentación

- **Nuevo:** `COLLECTION_SOURCE_AUDIT.md` — auditoría exhaustiva de cobranzas en todo el repositorio (scripts, `inbox/`, `versions/`, reportes ya construidos), no solo `apps/sic_av/`.
- **Hallazgo:** el CxC de Perú en `avboard_data.js` está congelado/hardcodeado (`extract_peru_cxc_static()` en `scripts/update_avboard.py`, corte fijo `10/05/2026`) — no se refresca desde `inbox/`.
- **Hallazgo:** un experimento de diffing entre cortes sucesivos de CxC Chile (ya presentes en `inbox/`) permite aproximar una ventana de resolución (5-14 días) para un subconjunto de facturas — no automatizado, no cubre Perú, no equivale a fecha exacta de cobro. Ninguna aplicación parcial de pagos fue detectada en ningún corte disponible.
- **Escenario de cobranza clasificado:** **C** — existe saldo CxC, no existen movimientos de cobro confiables por factura.
- **Cambio de UI:** `sic_datos_reales.html` reorganizado en dos bloques explícitos — Bloque 1 (datos reales validados: venta facturada, presupuesto, cumplimiento aproximado, IEC, precio piso, # facturas/vendedores) y Bloque 2 (estado del cálculo de comisiones, con mensaje "pendiente de integración de cobranza real", sin cifra de comisión "$0" como resultado comercial). La tabla de vendedores ya no muestra montos de comisión — solo el estado "Pendiente de cobranza".
- **Pruebas:** `tests/run_datos_reales_ui_test.js` actualizado (9→13 pruebas, ver `TEST_RESULTS.md`). Total del módulo: 104→**108** pruebas, todas OK.
- **Nuevo:** `PRESENTATION_READINESS.md` — qué mostrar y qué no mostrar como definitivo en la presentación ejecutiva de mañana.
- **No se modificó:** `sic_core.js`, reglas SIC, autenticación, ni ningún archivo fuente del Board.

## v1.5 — Fases 1-3 (2026-07-13) — Integración de solo lectura con datos reales del Board

- **Nuevo:** `DATA_SOURCE_AUDIT.md` — auditoría de dónde vive cada dato del SIC (vendedores, ventas, presupuesto, IEC, precio piso) en las fuentes reales de AV LATAM Board.
- **Nuevo:** `js/sic_data_adapter.js` (`SICAdapter.*`) — capa de solo lectura que transforma `Panel_IEC_Auditoria_2026.html` (`TX_CL`/`TX_PE`) y `avboard_data.js` (presupuesto real) al mismo formato que `sic_core.js` ya consumía con datos demo. El motor de cálculo no se modificó.
- **Nuevo:** `sic_datos_reales.html` — página aditiva que muestra un ciclo comercial real completo (26→25), con conciliación fuente-vs-adaptador y advertencias de integridad visibles (nunca exclusiones silenciosas).
- **Nuevo:** `tests/run_adapter_tests.js` (26 pruebas) y `tests/run_datos_reales_ui_test.js` (9 pruebas iniciales).
- Total del módulo: 69→104 pruebas.

## v1.4 (2026-07-13) — Eliminación del Factor de Precio Piso

Toda venta facturada se considera una operación válida y previamente aprobada por la compañía — el SIC ya no aplica controles adicionales de autorización por precio piso. Se eliminó `SIC.factorPiso()`, la tabla `factor_piso`, el estado `"retenida"`, y la ponderación por piso del Bono por Excedente y de la Comisión Diferida Trimestral. El precio piso queda solo como dato informativo y como insumo del Factor IEC (`SIC.clasificacionPiso()`). Total: 64→69 pruebas.

## v1.3 (2026-07-13) — Factor IEC a tramos fijos + página "Política y Factores"

Factor IEC reemplazado por una tabla discreta aprobada por Gerencia General (&lt;70%→20%, 70-84,99%→70%, 85-91,99%→80%, 92-94,99%→90%, ≥95%→105%), eliminando `SIC.interpolar()` por completo. Nueva página `sic_politica.html`. Total: 51→64 pruebas.

## v1.2 (2026-07-13) — Selector de ciclo histórico

Selector de ciclo comercial enriquecido (nombre/fechas/estado), indicador de presupuesto del ciclo, versión de política y fecha de datos en header/PDF. Total: 36→51 pruebas.

## v1.1 (2026-07-12) — Factor de Presupuesto y tabla de cartera Chile definitivos

Factor de Cumplimiento de Presupuesto a tramos fijos (&lt;90%→0%, 90-99,99%→80%, ≥100%→100%). Tabla de edad de cartera Chile unificada (sin distinción Distribuidor/Cliente Final). Total: 32→36 pruebas.

## Fase 4 (2026-07-12) — Prototipo funcional aislado

Primera versión funcional: `index.html`, `sic_chile.html`, `sic_peru.html`, `sic_core.js`, `sic_auth.js`, `sic_pdf.js`, `sic_styles.css`, 14 JSON demo, 2 suites de prueba (32 pruebas). Datos 100% sintéticos, sin conexión al Board.
