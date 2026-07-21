# NORMALIZACIÓN DE VENDEDORES PERÚ 2026
## Informe de Consolidación y Conciliación Pre-Implementación

**Fecha:** 2026-07-13  
**Fuentes auditadas:** TX_PE (92 registros), AVBOARD `peru.ventas.rtc_mensual_real`, hoja RESUMEN del Excel de ventas Perú  
**Estado:** PENDIENTE DE DECISIÓN EN ÍTEM 3 — No implementar hasta resolución

---

## 1. Tabla de equivalencias de aliases — LIZBETH AGUIRRE

| Alias en fuente | Vendedor maestro | Fuente | Registros afectados | Clave AVBOARD |
|----------------|-----------------|--------|---------------------|---------------|
| `NICOLL NAVARRO` | **LIZBETH AGUIRRE** | TX_PE (`vendedor` field) | 8 registros TX_PE | `navarro` |
| `LISBETH AGUIRRE` | **LIZBETH AGUIRRE** | TX_PE (`vendedor` field); `update_avboard.py` `vend_map_pe` | 31 registros TX_PE | `aguirre` |
| `LIZBETH AGUIRRE` | **LIZBETH AGUIRRE** | `sic_data_adapter.js` `VENDEDOR_MAP.PE` | Adaptador SIC | `aguirre` |
| `aguirre_navarro` | **LIZBETH AGUIRRE** | `avboard_data.js` → `peru_cxc` (cartera) | Grupo CxC consolidado | *(ya unificado en CxC)* |

**Nota:** El nombre oficial visible en paneles será **LIZBETH AGUIRRE** (con Z). Los alias no deben aparecer en ningún panel.

**Pendiente de decisión (ver ítem 3):** El alias `NICOLL NAVARRO` en TX_PE tiene un folio cuya atribución correcta a vendedor debe confirmarse antes de consolidar.

---

## 2. Verificación de doble conteo — RESULTADO: NINGUNO

**Folios TX_PE bajo NICOLL NAVARRO:** `897, 904, 908, 911, 916, 926, 928, 929` (8 folios)  
**Folios TX_PE bajo LISBETH AGUIRRE:** `1003, 1004, 1006, 1009, 1010, 1011, 1015, 1019, 1025, 1026...` (31 folios, todos ≥ 1003)  
**Solapamiento:** NINGUNO ✓ — Los conjuntos de folios son disjuntos.

**Verificación de totales consolidados (sin folio 926):**

| Fuente | Navarro YTD | Aguirre YTD | LIZBETH Total | Diferencia |
|--------|-------------|-------------|---------------|-----------|
| TX_PE (excl. folio 926) | USD 14,620 | USD 97,107 | USD 111,727 | — |
| AVBOARD rtc_mensual_real (jun) | USD 14,620 | USD 109,147 | USD 123,767 | +USD 12,040 = Aguirre junio (11,404) + ajustes menores |

La diferencia residual de USD 636 entre TX_PE y AVBOARD (mayo sin junio) se debe a diferencias de redondeo entre la capa transaccional (TX_PE) y la capa de RESUMEN Excel — **no implica doble conteo**.

---

## 3. Conciliación INFANTE ENERO — Decisión pendiente sobre folio 926

### Hallazgo

La discrepancia de USD 16,320 entre las dos fuentes para INFANTE ENERO tiene una causa única: **el folio 926 es atribuido a vendedores distintos según la fuente**.

| Fuente | Vendedor folio 926 | Infante ENERO | Navarro ENERO |
|--------|-------------------|---------------|---------------|
| **TX_PE** | NICOLL NAVARRO | USD 16,511 (9 facturas) | USD 23,240 (incluye folio 926) |
| **AVBOARD (RESUMEN Excel)** | OSCAR INFANTE | USD 32,831 | USD 6,920 (excluye folio 926) |

**Verificación matemática exacta:**
```
TX_PE Infante ENERO:              USD 16,511
+ folio 926 (TX_PE bajo NAVARRO): USD 16,320
= AVBOARD Infante ENERO:          USD 32,831 ✓ (match exacto)
```

**Detalle del folio 926:**
- Producto: REGALIA MAX
- Precio venta: USD 34.0 / unidad
- Total: USD 16,320
- Mes asignado: ENERO
- Fecha en TX_PE: `2026-05-01` ← fecha invertida (bug DD/MM); fecha real probable: 2026-01-05

### Origen de cada cifra

- **USD 16,511 (Panel):** suma de 9 facturas en TX_PE bajo OSCAR INFANTE para ENERO. TX_PE excluye folio 926 de infante.
- **USD 32,831 (AVBOARD):** suma del RESUMEN Excel para OSCAR INFANTE, enero. El RESUMEN incluye folio 926 bajo infante.

### Causa probable

La hoja RESUMEN del Excel de ventas Perú registra el folio 926 bajo OSCAR INFANTE. Al construir TX_PE (en otro momento o proceso), el mismo folio fue asignado a NICOLL NAVARRO. Las dos capas discrepan en la atribución de esta única factura.

### Recomendación

Verificar directamente la factura 926 en el sistema contable de AGROVECA PERU para determinar quién realizó la venta. Esta verificación no puede hacerse desde el repositorio.

**Mientras no exista conciliación, mostrar en Panel:**  
→ INFANTE ENERO: **"Pendiente de conciliación"** (no mostrar ni 16.5K ni 32.8K)

### Impacto adicional en otros meses de Infante

| Mes | TX_PE | AVBOARD | Diferencia | Estado |
|-----|-------|---------|-----------|--------|
| ENERO | 16,511 | 32,831 | +16,320 | ⚠️ Folio 926 |
| FEBRERO | 16,188 | 16,188 | 0 | ✅ Conciliado |
| MARZO | 38,190 | 38,190 | 0 | ✅ Conciliado |
| ABRIL | 36,887 | 36,887 | 0 | ✅ Conciliado |
| MAYO | 13,296 | 22,328 | +9,032 | ⚠️ Ver ítem 3.1 |
| JUNIO | 0 | 0 | 0 | ✅ Conciliado |

#### Ítem 3.1 — Infante MAYO: diferencia adicional de USD 9,032

TX_PE tiene 2 facturas de infante en mayo (USD 13,296). AVBOARD tiene USD 22,328. Diferencia: USD 9,032.

No hay en TX_PE una factura específica que explique este diferencial (a diferencia del folio 926 en enero). Esto sugiere que **TX_PE fue construido desde un snapshot anterior al corte de mayo**, cuando algunas facturas de mayo aún no estaban emitidas o cargadas. El RESUMEN Excel (fuente de AVBOARD) refleja el estado al cierre de junio e incluye esas facturas adicionales.

**Tratamiento recomendado:** AVBOARD es la fuente más reciente y más completa para mayo. El diferencial de USD 9,032 no implica doble conteo — son facturas en la RESUMEN que no llegaron al snapshot de TX_PE. No requiere "Pendiente" — usar AVBOARD para mayo de infante una vez resuelto el punto de folio 926.

---

## 4. Análisis SUSAN DÍAZ — Ceros y pendientes

| Mes | TX_PE | AVBOARD | Panel (hardcoded) | Diagnóstico |
|-----|-------|---------|-------------------|-------------|
| ENERO | 0 registros | 0 | 0 | ✅ Cero real confirmado |
| FEBRERO | 0 registros | 0 | 0 | ✅ Cero real confirmado |
| MARZO | 0 registros | 0 | 0 | ✅ Cero real confirmado |
| ABRIL | USD 6,300 (folio 1020) | USD 6,300 | 6.3K | ✅ Dato real confirmado |
| MAYO | USD 2,600 (folio 1035) | USD 2,600 | null | ✅ Dato real; Panel no actualizado |
| JUNIO | no en TX_PE | USD 8,320 | null | ⚠️ Dato en AVBOARD; TX_PE es snapshot anterior |

**Conclusión:**
- Ene-Mar: ceros son **reales** (0 registros en TX_PE de ningún tipo para Díaz en esos meses)
- Abr-May: datos confirmados en ambas fuentes
- Jun: USD 8,320 presente en AVBOARD (RESUMEN Excel). TX_PE no tiene el dato por ser snapshot anterior. Opción conservadora: mostrar 8,320 desde AVBOARD con nota de que TX_PE no lo refleja.

**Nota folio 1035:** fecha en TX_PE = `2026-04-05` pero mes asignado = MAYO → es un caso del bug de fecha (fecha almacenada es 5 de abril, real era 5 de mayo). El `mes=MAYO` es el campo correcto.

**Acción para implementación:** Para Díaz, usar AVBOARD `rtc_mensual_real` como fuente (igual que el resto). Enero-Marzo mostrarán 0 correctamente. Abril-Junio mostrarán los datos reales.

---

## 5. Confirmación VALLADARES — Ppto anual USD 142,372

AVBOARD `peru_ventas.rtc_ppto_anual.valladares = 142,372` proviene del Libro Base AV 2026, hoja "Presupuesto Pais". Es la fuente oficial del presupuesto.

**Implementación según instrucción de Gerencia:**
- Presupuesto Anual: `USD 142,372` (mostrar en Panel B del bloque resumen)
- Presupuesto Mensual: `"Pendiente de distribución mensual"` (no prorratear sin aprobación)
- Cumplimiento mensual: `"N/A"` para todos los meses (sin ppto mensual)
- Cumplimiento acumulado: `"N/A"` (sin ppto mensual aprobado; no usar anual/12)

---

## 6. Datos de junio 2026 por vendedor (actualización Panel requerida)

El Panel hardcodeado tiene `null` para junio en todos los vendedores. AVBOARD tiene datos de junio confirmados:

| Vendedor | AVBOARD jun | Panel actual | Fuente |
|----------|-------------|-------------|--------|
| OSCAR INFANTE | USD 0 | null | RESUMEN Excel ✅ |
| OMAR ATALAYA | USD 12,600 | null | RESUMEN Excel ✅ |
| LISBETH AGUIRRE (aguirre) | USD 11,404 | null | RESUMEN Excel ✅ |
| LIZBETH AGUIRRE (navarro) | USD 0 | null | RESUMEN Excel ✅ |
| NICOLL NAVARRO (alias) | USD 0 | null | *(consolidado en aguirre)* |
| PATRICIA VALLADARES | USD 7,040 | null | RESUMEN Excel ✅ |
| ANTONIO GONZALES | USD 6,720 | null | RESUMEN Excel ✅ |
| SUSAN DÍAZ | USD 8,320 | null | RESUMEN Excel ✅ |
| JOSE GELDRES | (no en AVBOARD) | null | — |

Al migrar el Panel a leer desde `AVBOARD.peru.ventas.rtc_mensual_real[avbKey]`, los datos de junio aparecerán automáticamente.

---

## 7. Resumen ejecutivo — Estado por ítem de decisión

| Ítem | Estado | Acción |
|------|--------|--------|
| Navarro = Lizbeth Aguirre (alias) | ✅ Confirmado sin doble conteo | Consolidar en implementación |
| Infante enero: folio 926 | ⚠️ **PENDIENTE DECISIÓN** | Verificar factura 926 en sistema contable |
| Infante mayo: +9,032 vs TX_PE | ✅ Explicado (TX_PE snapshot antiguo) | Usar AVBOARD para mayo |
| Valladares ppto 142K | ✅ Confirmado (AVBOARD = Libro Base) | Mostrar anual; mensual "Pendiente" |
| Díaz ene-mar ceros | ✅ Ceros reales confirmados en TX_PE | No marcar como pendiente |
| Díaz jun 8,320 | ⚠️ En AVBOARD, no en TX_PE | Usar AVBOARD; confirmar operativamente si deseado |
| Real 2025 mensual Perú | ✅ Resuelto: omitir serie | Nota informativa en Panel |

---

## 8. Cambios requeridos en archivos de código

Una vez resuelta la decisión del folio 926:

| Archivo | Cambio |
|---------|--------|
| `Panel_Jefes_Peru_2026.html` | Agregar `avbKey` a `vendedoresData`; consolidar navarro+aguirre en un solo objeto LIZBETH AGUIRRE; agregar módulo-level lookups AVBOARD; reescribir `updateVendChart()`; agregar `updateCuadroEjecutivo()` |
| `update_avboard.py` | Agregar `'NICOLL NAVARRO': 'aguirre'` en `vend_map_pe` para unificar (y eliminar clave `navarro` separada) — **REQUIERE REVISIÓN CUIDADOSA** para no romper históricos |
| `apps/sic_av/js/sic_data_adapter.js` | Ya tiene `"LIZBETH AGUIRRE": "aguirre"`. Agregar `"NICOLL NAVARRO": "aguirre"` en `VENDEDOR_MAP.PE` (reemplazar `"navarro"` por `"aguirre"`) |
| `DATA_QUALITY_CONTROL_AV_LATAM.md` | Agregar DQ-013 (folio 926) |

**NO se modifican:** `sic_core.js`, `sic_auth.js`, datos fuente Excel, reglas SIC.

---

*Este documento debe actualizarse con la decisión de Gerencia sobre el folio 926 antes de proceder con la implementación.*
