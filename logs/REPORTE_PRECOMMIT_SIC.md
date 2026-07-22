# REPORTE PRE-COMMIT — SIC · Presupuesto mensual Perú
**Fecha:** 2026-07-21  
**Commit propuesto:** `fix SIC: rtc_mensual_ppto Perú — distribución real Libro Base (no anual/12) [skip ci]`

---

## Problema corregido

El módulo SIC (página `sic_datos_reales.html`) mostraba **el mismo presupuesto USD 20.702 en todos los meses** para Omar Atalaya (y prorrateo equivalente para los demás vendedores Perú). Causa raíz: `avboard_data.js` no tenía `rtc_mensual_ppto` para Perú, solo `rtc_ppto_anual`. El adapter dividía el anual entre 12.

---

## Archivos modificados

| Archivo | Tipo de cambio |
|---------|---------------|
| `scripts/update_avboard.py` | Agrega `PPTO_RTC_MENSUAL_PE` (6 vendedores × 12 meses en USD) + emite `rtc_mensual_ppto` en `peru_ventas` |
| `apps/sic_av/js/sic_data_adapter.js` | Lee `rtc_mensual_ppto[vendedor][mesIdx]` para Perú; fallback anual/12 si el campo no existe |
| `avboard_data.js` | Regenerado: nuevo campo `peru_ventas.rtc_mensual_ppto` |
| `logs/REPORTE_AUDITORIA_SIC.md` | Nuevo — documenta la auditoría completa |

---

## Validación pre-commit

### 1. Sumas anuales — integridad de la distribución mensual

| Vendedor | Ppto Mensual (suma 12m) | Ppto Anual AVBOARD | Match |
|----------|------------------------|--------------------|-------|
| infante | 485.058 | 485.058 | ✅ |
| aguirre | 223.930 | 223.930 | ✅ |
| atalaya | 248.424 | 248.424 | ✅ |
| gonzales | 37.250 | 37.250 | ✅ |
| valladares | 142.372 | 142.372 | ✅ |
| martha | 65.000 | 65.000 | ✅ |

### 2. Atalaya: distribución mensual real vs flat anterior

| Mes | Antes (anual/12) | Ahora (Libro Base) | Delta |
|-----|------------------|--------------------|-------|
| Ene | 20.702 | 22.236 | +1.534 |
| Feb | 20.702 | 19.322 | −1.380 |
| Mar | 20.702 | 12.076 | −8.626 |
| Abr | 20.702 | 18.346 | −2.356 |
| May | 20.702 | 22.790 | +2.088 |
| Jun | 20.702 | 27.596 | +6.894 |
| Jul | 20.702 | 25.818 | +5.116 |
| Ago | 20.702 | 28.780 | +8.078 |
| Sep | 20.702 | 23.122 | +2.420 |
| Oct | 20.702 | 18.458 | −2.244 |
| Nov | 20.702 | 16.418 | −4.284 |
| Dic | 20.702 | 13.462 | −7.240 |

### 3. Consistencia Panel_Presupuesto ↔ AVBOARD ↔ SIC

| Verificación | Resultado |
|-------------|-----------|
| PE_MES_DATA.atalaya.ppto[0] == avboard.rtc_mensual_ppto.atalaya[0] | 22.236 == 22.236 ✅ |
| PE_MES_DATA.infante.ppto[2] == avboard.rtc_mensual_ppto.infante[2] | 66.760 == 66.760 ✅ |
| SICAdapter._presupuestoDelMes('PE','atalaya','2026-01') | 22.236 ✅ (no 20.702) |
| SICAdapter._presupuestoDelMes('PE','atalaya','2026-03') | 12.076 ✅ |
| Fallback anual/12 cuando no hay rtc_mensual_ppto | 20.702 ✅ (compatibilidad) |

### 4. Suite de pruebas

| Suite | OK/Total |
|-------|---------|
| Motor SIC (sic_core.js) | 49/49 ✅ |
| Adaptador de datos reales | 26/26 ✅ |
| Modelo temporal v1.6 | 16/16 ✅ |
| Pruebas específicas rtc_mensual_ppto PE | 12/12 ✅ |

### 5. Restricciones cumplidas

| Restricción | Estado |
|------------|--------|
| No modificar lógica comercial SIC (sic_core.js) | ✅ Sin cambios |
| No modificar reglas de cálculo | ✅ Sin cambios |
| No modificar sic_chile.html / sic_peru.html | ✅ Sin cambios |
| Solo corregir origen y consistencia de datos de presupuesto | ✅ |
| Reporte de auditoría entregado antes del commit | ✅ REPORTE_AUDITORIA_SIC.md |
| avboard_data.js regenerado por pipeline (no editado manualmente) | ✅ |
| Panel_Presupuesto sin tocar | ✅ Sin cambios |

---

## Commit propuesto

```
fix SIC: rtc_mensual_ppto Perú — distribución real Libro Base (no anual/12) [skip ci]
```

**Archivos para `git add`:**
```bash
scripts/update_avboard.py
apps/sic_av/js/sic_data_adapter.js
avboard_data.js
logs/REPORTE_AUDITORIA_SIC.md
logs/REPORTE_PRECOMMIT_SIC.md
```

**Instrucciones para Javier:**
```bash
# Limpiar locks si los hay
rm -f ~/Documents/GitHub/av-latam-board/.git/index.lock

cd ~/Documents/GitHub/av-latam-board
git add scripts/update_avboard.py \
        apps/sic_av/js/sic_data_adapter.js \
        avboard_data.js \
        logs/REPORTE_AUDITORIA_SIC.md \
        logs/REPORTE_PRECOMMIT_SIC.md
git commit -m "fix SIC: rtc_mensual_ppto Perú — distribución real Libro Base (no anual/12) [skip ci]"
git push origin main
```
