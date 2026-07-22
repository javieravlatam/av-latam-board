# REPORTE PRE-COMMIT — Panel Presupuesto
**Fecha:** 2026-07-21  
**Archivo:** `Panel_Presupuesto_AV_2026.html`  
**Fuente de datos:** `avboard_data.js` (corte Chile 30/06/2026 · Perú 20/07/2026)

---

## Cambios implementados

### 1. Selector de período T1/T2/T3/T4/S1/S2/YTD — Chile y Perú

- **Chile "Real vs Ppto · Por RTC"**: tabla 100% hardcodeada reemplazada por tabla dinámica `id="ch-rvsp-tbl"` con 7 botones de período. Función `renderChileRvsPpto(periodoKey, btn)` lee exclusivamente de `AVBOARD.chile.ventas.rtc_mensual_real` y `rtc_mensual_ppto`.
- **Perú "Real vs Ppto · Por Zona"**: tabla parcialmente dinámica reemplazada por tabla totalmente dinámica con función `renderPeruRvsPpto(periodoKey, btn)`. Lee de `AVBOARD.peru.ventas.rtc_mensual_real` (real) y `PE_MES_DATA[key].ppto` (ppto — no existe `rtc_mensual_ppto` para Perú en AVBOARD).
- Ambas tablas se inicializan con T1 al cargar, vía llamadas `renderChileRvsPpto('t1')` y `renderPeruRvsPpto('t1')` al final del IIFE populate.

### 2. Selector de vendedor — Seguimiento mes a mes Chile y Perú

- **Chile Seguimiento**: 6 botones (Equipo completo · J. Caroca · P. Laratro · R. Encina · F. Velásquez · I. Veverka). Función `setChileMesVendor(key, btn)`. Prefiere `AVBOARD.chile.ventas.rtc_mensual_real/ppto`, fallback a `CH_MES_DATA`.  
- **Perú Seguimiento**: 7 botones (Equipo completo + 6 zonas). Función `setPeruMesVendor(key, btn)`. Lee de `AVBOARD.peru.ventas.rtc_mensual_real`, ppto de `PE_MES_DATA[key].ppto`.
- Fila `cl-pptousd-row` se oculta al seleccionar vendedor individual (solo aplica a equipo).
- Equipo completo inicia como activo por defecto.

### 3. Eliminación de lógica hardcodeada

- Reemplazado el IIFE inline de 50 líneas que actualizaba `pe-t1-tbl` con datos T1 fijos.
- Eliminada la tabla Chile "Real vs Ppto T1" con 6 filas hardcodeadas y valores de Abr fijos.

---

## Validación Node.js

### Prueba 1 — Chile selector de período (18/18 checks HTML ✅)

| Período | Real (K CLP) | Ppto (K CLP) | Cumpl |
|---------|-------------|-------------|-------|
| T1 | 176.254 | 167.160 | 105.4% |
| T2 | 227.756 | 147.161 | 154.8% |
| T3 | 0 | 250.100 | 0.0% |
| T4 | 0 | 296.900 | 0.0% |
| S1 | 404.010 | 314.321 | 128.5% |
| S2 | 0 | 547.000 | 0.0% |
| YTD | 404.010 | 314.321 | 128.5% |

Chile YTD endIdx = 5 (Junio) ✅  
Assert Caroca T1 real = 53.122.658 CLP ✅

### Prueba 2 — Perú selector de período

| Período | Real (USD) | Ppto (USD) | Cumpl |
|---------|-----------|-----------|-------|
| T1 | 196.379 | 213.385 | 92.0% |
| T2 | 176.457 | 211.955 | 83.3% |
| T3 | 29.204 | 424.419 | 6.9% |
| T4 | 0 | 352.275 | 0.0% |
| S1 | 372.836 | 425.340 | 87.7% |
| S2 | 29.204 | 776.694 | 3.8% |
| YTD | 402.040 | 526.015 | 76.4% |

Assert T1 ppto total = 213.385 ✅ (coincide con valor previo hardcodeado)

### Prueba 3 — Perú T1 por vendedor

| Vendedor | Real | Ppto | Cumpl |
|----------|------|------|-------|
| L. Aguirre | 42.565 | 35.370 | 120.3% |
| O. Atalaya | 57.989 | 53.634 | 108.1% |
| O. Infante | 94.129 | 114.735 | 82.0% |
| A. Gonzales | 696 | 4.000 | 17.4% |
| P. Valladares | 1.000 | 5.646 | 17.7% |
| M. Hidalgo | 0 | 0 | N/A |

### Prueba 4 — Selector vendedor mes a mes

| Caso | Resultado |
|------|-----------|
| Chile Laratro YTD real | 173.548K CLP |
| Chile Laratro ppto anual | 234.000K CLP |
| Chile Laratro S1 cumpl | 168.2% |
| Perú Infante YTD real | 159.184 USD |
| Perú Infante ppto anual | 485.058 USD |
| Perú Infante pendiente | 325.874 USD |
| Perú Aguirre YTD real | 121.345 USD |

---

## Integridad del sistema

| Check | Estado |
|-------|--------|
| selector Chile período | ✅ |
| selector Perú período | ✅ |
| selector Chile mes a mes | ✅ |
| selector Perú mes a mes | ✅ |
| ch-rvsp-tbl dinámico | ✅ |
| pe-t1-tbl dinámico | ✅ |
| renderChileRvsPpto function | ✅ |
| renderPeruRvsPpto function | ✅ |
| setChileMesVendor function | ✅ |
| setPeruMesVendor function | ✅ |
| cl-pptousd-row con id | ✅ |
| llamada inicial renderChile T1 | ✅ |
| llamada inicial renderPeru T1 | ✅ |
| sin hardcoded "53.123K" | ✅ |
| sin hardcoded "72.175" | ✅ |
| Chart.js cargado una sola vez | ✅ |
| sin DOMContentLoaded | ✅ |
| sin destroy() | ✅ |

---

## Notas y limitaciones

- **Muñoz (Chile)**: tiene real en `rtc_mensual_real` pero NO tiene `rtc_mensual_ppto`. Se muestra con ppto "–" y real calculado desde AVBOARD. Comportamiento correcto (Muñoz no tiene ppto oficial registrado).
- **Diaz (Perú)**: aparece en `rtc_mensual_real` pero no tiene ppto oficial ni está en la lista de vendedores del presupuesto. No se incluye en las tablas de período. El TOTAL del equipo (de `pv.mensual_real`) incluye Diaz, pero las sumas de vendedores individuales no. Discrepancia de ~17.460 USD YTD. Aceptable — consistente con comportamiento previo.
- **Peru `rtc_mensual_ppto`**: no existe en AVBOARD para Perú. Los valores de ppto por vendedor/mes vienen de `PE_MES_DATA` (hardcodeados pero consistentes con el ppto oficial aprobado).
- **T3/T4/S2 Chile**: cumplimiento 0% es correcto — no hay datos reales a partir de Julio (corte 30/06).

---

## Restricciones cumplidas

- ✅ NO se modificó el SIC
- ✅ NO se modificó el pipeline
- ✅ NO se modificaron las reglas comerciales
- ✅ Cambios limitados exclusivamente a `Panel_Presupuesto_AV_2026.html`
- ✅ Reporte pre-commit generado antes del commit/push

---

## Commit propuesto

```
feat Presupuesto: selector período T1/T2/T3/T4/S1/S2/YTD + selector vendedor seguimiento mensual [skip ci]
```

**Archivos modificados:** `Panel_Presupuesto_AV_2026.html`
