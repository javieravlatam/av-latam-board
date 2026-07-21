# CONTROL DE CALIDAD DE DATOS — AV LATAM 2026

**Fecha:** 2026-07-13  
**Alcance:** Todos los paneles del repositorio `av-latam-board` + capa SIC-AV  
**Propósito:** Registro vivo de inconsistencias de datos, brechas estructurales y deudas técnicas identificadas. Se actualiza con cada auditoría.

---

## Categorías de severidad

| Nivel | Significado |
|-------|-------------|
| 🔴 CRÍTICO | Dato actualmente erróneo en producción; afecta decisiones de negocio |
| 🟠 ALTO | Dato incompleto o inconsistente; puede afectar análisis si no se advierte |
| 🟡 MEDIO | Brecha conocida con workaround documentado; no afecta datos actuales |
| 🔵 INFO | Diferencia de diseño o limitación estructural; no hay error, es una elección |

---

## 1. Problemas activos

### [DQ-001] 🔴 TX_PE — Bug de fechas en 88/92 registros (96%)

**Detectado:** 2026-07-13  
**Archivo afectado:** `Panel_IEC_Auditoria_2026.html` → constante `TX_PE`  
**Descripción:** Las fechas de venta de Perú (Excel DD/MM/YYYY) fueron parseadas como MM/DD/YYYY al construir TX_PE. Resultado: 40 registros con día y mes invertidos; 48 registros con `fecha:NaN`.  
**Impacto:** Ciclos SIC-AV Perú no representativos. Transacciones en ciclos incorrectos o excluidas.  
**Workaround activo:** `sic_data_adapter.js` usa `_parseArrayJsLiteral` para leer NaN sin romper; detecta fechas fuera de rango y advierte. No corrige fechas invertidas.  
**Fix requerido:** Implementar `build_tx_pe()` + `update_panel_iec_pe()` en `scripts/update_avboard.py` con `format='%d/%m/%Y'`.  
**Documentación detallada:** `PERU_DATE_ROOT_CAUSE_ANALYSIS.md`  
**Responsable fix:** Pipeline (fuera de `apps/sic_av/`)  
**Estado:** ABIERTO

---

### [DQ-002] 🔴 TX_PE — No se regenera con el pipeline

**Detectado:** 2026-07-13  
**Archivo afectado:** `scripts/update_avboard.py`, `Panel_IEC_Auditoria_2026.html`  
**Descripción:** `main()` en el pipeline ejecuta `build_tx_cl()` + `update_panel_iec()` para Chile, pero no existe equivalente para Perú. TX_PE es estática — no se actualiza cuando llegan nuevas ventas de Perú.  
**Impacto:** TX_PE refleja solo el estado del Excel de Perú usado en la carga inicial (fecha desconocida). Cualquier venta nueva de Perú NO aparece en TX_PE.  
**Fix requerido:** Mismo que DQ-001 — implementar `build_tx_pe()` y `update_panel_iec_pe()`.  
**Estado:** ABIERTO

---

### [DQ-003] 🔴 CxC Perú congelado en 10/05/2026

**Detectado:** Sesión anterior (confirmado en `DATA_SOURCE_AUDIT.md §Actualización Fase 4`)  
**Archivo afectado:** `scripts/update_avboard.py` → `extract_peru_cxc_static()`  
**Descripción:** La función `extract_peru_cxc_static()` retorna datos hardcodeados del corte 10/05/2026, independientemente de qué archivos CxC de Perú estén en `inbox/`. El CxC de Perú NO se actualiza automáticamente.  
**Impacto:** Cartera Perú en todos los paneles muestra datos de mayo, aunque los datos de cierre junio estén disponibles.  
**Fix requerido:** Implementar `extract_peru_cxc()` real que lea `AGROVECA - CUENTAS POR COBRAR *.xlsx` desde `inbox/` (análogo a `extract_cxc_chile()`).  
**Estado:** ABIERTO — documentado como problema conocido en sesiones anteriores

---

### [DQ-004] 🟠 Discrepancia infante enero: Panel 16.5K vs AVBOARD 32.8K

**Detectado:** 2026-07-13  
**Archivo afectado:** `Panel_Jefes_Peru_2026.html` → `vendedoresData[0].meses26[0]`  
**Descripción:** El valor hardcodeado para OSCAR INFANTE enero 2026 en el Panel Jefes Perú es USD 16.5K, mientras que AVBOARD muestra USD 32.8K (`rtc_mensual_real.infante[0] = 32831`). Diferencia: USD 16.3K (47% menos en el Panel).  
**Impacto:** Cuadro ejecutivo Perú (cuando se implemente) mostrará acumulado incorrecto si se usa el valor hardcodeado de enero.  
**Fix requerido:** Validar con operaciones cuál es la cifra correcta; migrar Panel a `AVBOARD.peru.ventas.rtc_mensual_real` como fuente principal.  
**Estado:** PENDIENTE DE VALIDACIÓN OPERATIVA

---

### [DQ-005] 🟠 Datos de junio 2026 ausentes en Panel_Jefes_Peru (hardcoded)

**Detectado:** 2026-07-13  
**Archivo afectado:** `Panel_Jefes_Peru_2026.html` → `vendedoresData[*].meses26[5]`  
**Descripción:** Todos los vendedores tienen `null` en junio (`meses26[5]`), aunque AVBOARD ya tiene datos reales de cierre junio para 6 de 7 vendedores activos (`aguirre:11404, atalaya:12600, diaz:8320, gonzales:6720, infante:0, valladares:7040`).  
**Causa:** El Panel hardcodea `meses26` — cuando el pipeline actualizó AVBOARD con datos de junio, el Panel no se actualizó.  
**Fix requerido:** Migrar `meses26` a lectura dinámica desde `AVBOARD.peru.ventas.rtc_mensual_real`.  
**Estado:** PENDIENTE (bloqueado por decisión de implementación)

---

### [DQ-006] 🟠 Valladares: ppto Panel null vs AVBOARD 142K anual

**Detectado:** 2026-07-13  
**Archivo afectado:** `Panel_Jefes_Peru_2026.html` → `vendedoresData[4].ppto` / `AVBOARD.peru.ventas.rtc_ppto_anual`  
**Descripción:** Panel muestra `ppto:null` para PATRICIA VALLADARES. AVBOARD tiene `rtc_ppto_anual.valladares: 142372` USD. Inconsistencia entre la fuente autorizada (AVBOARD, generado desde el Libro Base) y los valores hardcodeados del Panel.  
**Impacto:** Cuadro ejecutivo Perú calculará cumplimiento incorrecto para Valladares si usa valor del Panel.  
**Fix requerido:** Decidir si el presupuesto de Valladares es 0 (Panel dice null) o 142K (AVBOARD). Validar con Gerencia Comercial. Si es 142K, desechar el ppto hardcodeado del Panel y leer desde AVBOARD.  
**Estado:** PENDIENTE DE VALIDACIÓN OPERATIVA

---

### [DQ-007] 🟡 Geldres ausente de AVBOARD rtc_mensual_real

**Detectado:** 2026-07-13  
**Archivo afectado:** `avboard_data.js` → `peru.ventas.rtc_mensual_real`  
**Descripción:** JOSE GELDRES (`inactivo2026:true` en el Panel) tiene venta 2.6K en mayo según el Panel hardcodeado, pero no tiene clave en `rtc_mensual_real` de AVBOARD. Sus ventas 2026 (si existieran) no se procesarían en el pipeline.  
**Workaround:** El Panel mantiene el dato hardcodeado; el cuadro ejecutivo de Geldres mostraría ese dato con avbKey=null.  
**Estado:** ACEPTADO (vendedor inactivo; dado de baja en el procesamiento AVBOARD)

---

### [DQ-008] 🟡 Peru NO tiene rtc_mensual_ppto por vendedor en AVBOARD

**Detectado:** 2026-07-13  
**Descripción:** A diferencia de Chile (que tiene `chile_ventas.rtc_mensual_ppto` con 12 meses por vendedor), Perú solo tiene `peru_ventas.rtc_ppto_anual` (total anual por vendedor, sin desglose mensual).  
**Fuente primaria existente:** El "Libro Base AV 2026" tiene hoja "Presupuesto Pais" con desglose mensual por vendedor para Chile pero no para Perú.  
**Impacto:** El cuadro ejecutivo de Perú no puede calcular cumplimiento mensual exacto desde AVBOARD; debe usar `pptoMes` hardcodeado (donde existe) o prorrateo anual/12 (donde solo hay anual).  
**Fix requerido:** Solicitar a Finanzas Perú desglose mensual de presupuesto por RTC, igual que Chile.  
**Estado:** BRECHA ESTRUCTURAL — pendiente de acción de Finanzas Perú

---

### [DQ-009] 🟡 Real 2025 mensual por vendedor no disponible para Perú

**Detectado:** 2026-07-13  
**Descripción:** El Panel Chile tiene `meses` (12 meses de 2025 por vendedor) que se usa para el gráfico de comparación. El Panel Perú solo tiene `real25` (total anual 2025), sin desglose mensual.  
**Impacto:** El gráfico del cuadro ejecutivo Perú no puede mostrar serie "Real 2025" mensual desde ninguna fuente actual.  
**Opciones:** (a) Omitir la serie 2025 en el cuadro Perú; (b) Prorratear `real25/12` como estimación (no recomendado sin advertencia visible); (c) Solicitar datos mensuales 2025 a Gerencia Perú.  
**Estado:** BRECHA ESTRUCTURAL — decisión pendiente de Gerencia

---

### [DQ-010] 🟡 Tres mapeos nombre→clave de vendedor no unificados en el pipeline

**Detectado:** Sesión anterior (confirmado en `DATA_SOURCE_AUDIT.md §3.3`)  
**Archivo afectado:** `scripts/update_avboard.py`  
**Descripción:** Existen tres diccionarios `nombre→clave` diferentes en el pipeline: `rtc_map` (ventas), `rtc_name_map` (CxC), `PPTO_RTC_CL` (presupuesto). Coberturas distintas: "RAYEN BERNAZAR" mapea a `bernazar` en ventas pero a `otros` en CxC.  
**Impacto:** Inconsistencias en reportes agregados. SIC-AV usa su propio `VENDEDOR_MAP` unificado (no afectado).  
**Fix requerido:** Unificar los tres diccionarios en `update_avboard.py` en uno solo reutilizable.  
**Estado:** ABIERTO (baja urgencia para el SIC-AV; alta urgencia para el resto de AVBOARD)

---

### [DQ-011] 🔵 Presupuesto Perú: Navarro, Diaz, Geldres sin asignación formal

**Detectado:** 2026-07-13  
**Descripción:** NICOLL NAVARRO, SUSAN DIAZ y JOSE GELDRES tienen `ppto:null` en el Panel y no aparecen en `rtc_ppto_anual` de AVBOARD. No existe presupuesto formal asignado en ninguna fuente.  
**Impacto:** Cumplimiento no calculable para estos vendedores; cuadro ejecutivo mostrará "N/A".  
**Decisión:** Si Gerencia asigna presupuesto, actualizar el Libro Base AV 2026 para que el pipeline lo capture.  
**Estado:** DECISIÓN DE GERENCIA PENDIENTE

---

### [DQ-012] 🔵 Navarro: solo 2 meses de data (ene-feb) luego inactividad

**Detectado:** 2026-07-13  
**Descripción:** NICOLL NAVARRO tiene ventas solo en enero (26.3K) y febrero (7.7K), luego 0 en meses siguientes. No está marcada como `inactivo2026`. Podría ser baja de cartera o ausencia de datos.  
**Impacto:** El cuadro ejecutivo mostraría 4 meses en cero (mar-jun). Puede ser dato real o falta de carga.  
**Estado:** PENDIENTE DE CONFIRMACIÓN OPERATIVA

---

## 2. Problemas resueltos

| ID | Descripción | Fecha resolución |
|----|-------------|-----------------|
| — | Chile: presupuesto hardcodeado 861.3M vs Libro Base 792.6M → corregido en `update_avboard.py` | Sesión anterior |
| — | Cache-busting (?v=) desactualizado en paneles → automatizado en `sync_cache_busting()` | Sesión anterior |
| — | Panel Presupuesto: curva acumulada hardcodeada a 5 meses → dinámica | Sesión anterior |
| — | CxC Perú: panel congelado al 2025 → actualizado al 10/05/2026 (estático, ver DQ-003) | Sesión anterior |

---

## 3. Brechas estructurales permanentes (sin fix previsto)

Estos elementos no tienen fuente de datos disponible hoy en `inbox/` ni en ningún sistema conocido de Agroveca. No se espera fix a corto plazo sin cambios en los procesos operativos.

| Brecha | Impacto en SIC-AV | Acción recomendada |
|--------|------------------|-------------------|
| **Fecha de cobro real** por factura (no existe en CxC) | Comisión "liberada" no calculable con exactitud | Solicitar reporte de cobros a Finanzas |
| **Notas de crédito / devoluciones** (no existen en fuentes actuales) | SIC-AV deja en 0; no inventa | Incorporar si existen en sistema contable |
| **Cargo y equipo del vendedor** (no existe en ningún campo) | Filtros por cargo/equipo no disponibles | Tabla maestra manual (Excel/JSON) |
| **Presupuesto mensual Perú por vendedor** | Prorrateo anual/12 como aproximación | Solicitar desglose a Finanzas Perú |
| **Historial mensual 2025 por vendedor (Perú)** | Sin comparativo 2025 en gráficos mensuales | Solicitar a Gerencia Perú |

---

## 4. Protocolo de actualización de este documento

- Agregar un nuevo ítem [DQ-NNN] cuando se detecte una inconsistencia nueva en auditoría
- Mover ítems a "Problemas resueltos" cuando el fix sea confirmado en producción (después del commit y push, no antes)
- Mantener la sección de "Brechas estructurales" estática hasta que haya un proceso operativo que la cubra
- No eliminar ítems — solo mover o marcar como RESUELTO con fecha

*Documentos relacionados: `DATA_SOURCE_AUDIT.md`, `COLLECTION_SOURCE_AUDIT.md`, `PERU_DATE_ROOT_CAUSE_ANALYSIS.md`, `PERU_PROVISIONAL_COLLECTION_AUDIT.md`*

---

### [DQ-013] 🔴 Folio 926 (USD 16,320 REGALIA MAX): atribución contradictoria entre fuentes

**Detectado:** 2026-07-13  
**Archivo afectado:** `Panel_IEC_Auditoria_2026.html` (TX_PE) vs `avboard_data.js` (RESUMEN Excel)  
**Descripción:** El folio 926, USD 16,320, aparece bajo NICOLL NAVARRO en TX_PE y bajo OSCAR INFANTE en el RESUMEN Excel que alimenta a AVBOARD. Esta sola factura explica la discrepancia de Infante enero (16.5K vs 32.8K) y el exceso del total navarro en TX_PE.  
**Impacto:** El cuadro ejecutivo de Infante no puede mostrar dato fiable de enero hasta resolver la atribución. El acumulado de LIZBETH AGUIRRE (navarro+aguirre consolidado) también se ve afectado.  
**Fix requerido:** Verificar en el sistema contable de AGROVECA PERU a qué vendedor pertenece la factura 926. Una vez confirmado: (a) si es INFANTE → AVBOARD es correcto, TX_PE es incorrecto; corregir cuando se implemente build_tx_pe; (b) si es NAVARRO/AGUIRRE → TX_PE es correcto, RESUMEN Excel tiene error de clasificación; corregir en fuente.  
**Documentación:** `PERU_VENDOR_NORMALIZATION_REPORT.md §3`  
**Estado:** ABIERTO — PENDIENTE DECISIÓN DE GERENCIA
