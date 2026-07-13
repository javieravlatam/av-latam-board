# SIC-AV — CHANGELOG

Historial de cambios del módulo SIC-AV (`apps/sic_av/`), versión por versión. Todo el trabajo vive dentro de esta carpeta salvo cuando se indica explícitamente lo contrario; ningún cambio de este historial modificó `sic_core.js` de forma retroactiva a menos que se declare, ni tocó autenticación, ni se hizo commit/push.

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
