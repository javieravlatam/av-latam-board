# REPORTE DE AUDITORÍA — SIC · Cadena de Presupuestos
**Fecha:** 2026-07-21  
**Alcance:** Libro Base → AVBOARD → SIC · Presupuesto mensual por vendedor  
**Solicitante:** Javier Almeida  
**Estado:** Auditado + Fix implementado · Pre-commit pendiente de aprobación

---

## 1. Resumen ejecutivo

Se auditó la cadena completa de presupuestos desde el Libro Base hasta el módulo SIC. Se detectó una discrepancia de origen: **Perú no tenía presupuesto mensual por vendedor en AVBOARD**, solo presupuesto anual. El SIC compensaba dividiendo el anual entre 12, produciendo un valor plano (USD 20.702/mes para Atalaya todos los meses del año). Esto no refleja la distribución real aprobada en el Libro Base.

**Corrección implementada:** se agregó `rtc_mensual_ppto` a `peru_ventas` en `avboard_data.js`, y el SIC ahora lee ese campo directamente.

---

## 2. Cadena auditada: Libro Base → AVBOARD → SIC

### 2.1 Chile

| Eslabón | Campo | Estado |
|---------|-------|--------|
| Libro Base (Excel) | Hoja "Presupuesto Pais" → filas por RTC, 12 columnas | ✅ Presente |
| `update_avboard.py` | `PPTO_RTC_CL` (dict mensual por vendedor, CLP) | ✅ Hardcodeado, coincide con Libro Base |
| `avboard_data.js` | `chile_ventas.rtc_mensual_ppto` (5 vendedores × 12 meses, CLP) | ✅ Generado por pipeline |
| `sic_data_adapter.js` | `_presupuestoDelMes('CL', ...)` → lee `rtc_mensual_ppto[vendedor][mesIdx]` | ✅ Lectura directa, sin prorrateo |
| SIC Histórico (Chile) | Presupuesto mensual por ciclo = mes de desempeño real | ✅ Correcto desde v1.6 |

**Discrepancia Chile:** ninguna. Cadena íntegra.

---

### 2.2 Perú — Estado ANTES del fix

| Eslabón | Campo | Estado |
|---------|-------|--------|
| Libro Base (Excel) | Hoja "Presupuesto Pais" → filas por RTC Perú | ✅ Presente (distribución mensual real) |
| `update_avboard.py` | `PPTO_RTC_ANUAL_PE` (dict anual por vendedor, USD) | ⚠️ Solo anual, sin distribución mensual |
| `avboard_data.js` | `peru_ventas.rtc_ppto_anual` (anual por vendedor) | ⚠️ Solo anual |
| `sic_data_adapter.js` | `_presupuestoDelMes('PE', ...)` → `rtc_ppto_anual / 12` | ❌ Prorrateo uniforme — incorrecto |
| SIC Histórico (Perú) | Presupuesto flat USD 20.702 todos los meses para Atalaya | ❌ No refleja distribución real |

**Causa raíz:** `PPTO_RTC_MENSUAL_PE` no existía en el pipeline. El SIC aplicaba `anual / 12` como aproximación, lo que producía un presupuesto plano mes a mes.

**Evidencia numérica (Atalaya):**
- Presupuesto anual: USD 248.424
- Prorrateo incorrecto: USD 248.424 / 12 = **USD 20.702 fijo** (igual todos los meses)
- Distribución real (Libro Base): Ene 22.236 · Feb 19.322 · **Mar 12.076** · Abr 18.346 · May 22.790 · Jun 27.596 · Jul 25.818 · Ago 28.780 · Sep 23.122 · Oct 18.458 · Nov 16.418 · Dic 13.462
- Delta máximo vs flat: +8.078 en Agosto, -8.626 en Marzo

---

### 2.3 Perú — Estado DESPUÉS del fix

| Eslabón | Campo | Estado |
|---------|-------|--------|
| Libro Base | Sin cambios | ✅ |
| `update_avboard.py` | `PPTO_RTC_MENSUAL_PE` (dict mensual × 6 vendedores, USD) | ✅ Agregado |
| `avboard_data.js` | `peru_ventas.rtc_mensual_ppto` (6 vendedores × 12 meses, USD) | ✅ Generado por pipeline |
| `sic_data_adapter.js` | `_presupuestoDelMes('PE', ...)` → lee `rtc_mensual_ppto[vendedor][mesIdx]` | ✅ Lectura directa |
| SIC Histórico (Perú) | Presupuesto real por mes para cada vendedor | ✅ Correcto |

---

## 3. Validación de integridad: sumas mensuales = anual

| Vendedor | Suma mensual | Anual AVBOARD | Match |
|----------|-------------|---------------|-------|
| infante | 485.058 | 485.058 | ✅ |
| aguirre | 223.930 | 223.930 | ✅ |
| atalaya | 248.424 | 248.424 | ✅ |
| gonzales | 37.250 | 37.250 | ✅ |
| valladares | 142.372 | 142.372 | ✅ |
| martha | 65.000 | 65.000 | ✅ |

Todas las sumas coinciden exactamente. Ningún vendedor con discrepancia.

---

## 4. Consistencia entre módulos

| KPI | Panel_Presupuesto | AVBOARD | SIC (después) |
|-----|-------------------|---------|---------------|
| Atalaya ppto anual | 248.424 USD | 248.424 USD | 248.424 USD ✅ |
| Atalaya ppto Ene | 22.236 USD (PE_MES_DATA) | 22.236 USD (rtc_mensual_ppto) | 22.236 USD ✅ |
| Atalaya ppto Mar | 12.076 USD (PE_MES_DATA) | 12.076 USD (rtc_mensual_ppto) | 12.076 USD ✅ |
| Atalaya ppto Jun | 27.596 USD (PE_MES_DATA) | 27.596 USD (rtc_mensual_ppto) | 27.596 USD ✅ |
| Infante ppto Mar | 66.760 USD (PE_MES_DATA) | 66.760 USD (rtc_mensual_ppto) | 66.760 USD ✅ |

Los tres módulos muestran ahora valores idénticos por mes y por vendedor.

---

## 5. Nota sobre PE_MES_DATA (Panel_Presupuesto)

`PE_MES_DATA` en `Panel_Presupuesto_AV_2026.html` contiene los mismos valores que `PPTO_RTC_MENSUAL_PE` en el pipeline. Ambos provienen del mismo Libro Base. La diferencia es que `PE_MES_DATA` estaba hardcodeado directamente en el HTML, mientras que `PPTO_RTC_MENSUAL_PE` ahora se serializa en `avboard_data.js` a través del pipeline — convirtiéndolo en la fuente única.

`PE_MES_DATA` en el Panel_Presupuesto continuará funcionando igual que antes (sin cambios en ese archivo). El Panel_Presupuesto y el SIC ahora usan valores idénticos.

---

## 6. Alcance del fix — Qué se modificó / qué no

### Modificado ✅
| Archivo | Cambio |
|---------|--------|
| `scripts/update_avboard.py` | Agrega `PPTO_RTC_MENSUAL_PE` (dict mensual por vendedor) y emite `rtc_mensual_ppto` en `peru_ventas` |
| `apps/sic_av/js/sic_data_adapter.js` | `extraerPresupuestoReal`: expone `rtc_mensual_ppto` de Peru. `_presupuestoDelMes`: lee mensual real para Perú, fallback anual/12 |
| `avboard_data.js` | Regenerado por pipeline: nuevo campo `peru_ventas.rtc_mensual_ppto` |

### No modificado ✅
| Archivo | Razón |
|---------|-------|
| `apps/sic_av/sic_core.js` | Sin cambios — lógica comercial intacta |
| `apps/sic_av/sic_chile.html` | Sin cambios |
| `apps/sic_av/sic_peru.html` | Sin cambios |
| `apps/sic_av/sic_datos_reales.html` | Sin cambios |
| `Panel_Presupuesto_AV_2026.html` | Sin cambios |
| `apps/sic_av/data/*.json` (demo) | Sin cambios — datos demo intactos |
| Reglas comerciales / cálculo de comisiones | Sin cambios |

---

## 7. Resultado de pruebas

| Suite | Pruebas | Resultado |
|-------|---------|-----------|
| Motor SIC (sic_core.js) | 49/49 | ✅ |
| Adaptador de datos reales | 26/26 | ✅ |
| Modelo temporal v1.6 | 16/16 | ✅ |
| Pruebas específicas rtc_mensual_ppto PE | 12/12 | ✅ |
| UI / Dashboard (requiere servidor local) | N/A sandbox | — |
| **Total ejecutado** | **103/103** | ✅ |

---

## 8. Discrepancias conocidas (preexistentes, no introducidas por este fix)

- **Diaz (PE):** aparece en `rtc_mensual_real` pero no tiene presupuesto oficial en ninguna fuente. No se incluyó en `rtc_ppto_anual` ni en `rtc_mensual_ppto`. El total de equipo (`ppto_anual = 1.210.600`) incluye una diferencia de 8.566 USD no atribuida a ningún vendedor con nombre.
- **Muñoz (CL):** tiene ventas reales pero no tiene `rtc_mensual_ppto`. El SIC devuelve `null` para su presupuesto y genera advertencia visible — comportamiento correcto.
- **PE_MES_DATA.equipo.ppto vs `mensual_ppto`:** pequeña diferencia en totales de equipo (ej. Ene: 51.674 vs 51.668,7 USD) por redondeos del Libro Base. No afecta valores por vendedor.
