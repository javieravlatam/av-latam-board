# Arquitectura SSOT — AV LATAM Board
**Versión:** 2026-07-31  
**Estado:** IMPLEMENTADA — pendiente certificación 100% (ver dictamen)  
**Autor:** Claude / Javier Almeida (AV LATAM)

---

## 1. Principio Rector

> **Una sola fuente de verdad para precios piso, productos y presentaciones.**  
> Todos los módulos del ecosistema consumen el mismo dataset generado desde el Libro Base oficial.  
> Ningún módulo calcula ni hardcodea precios por cuenta propia.

---

## 2. Pipeline Oficial

```
inbox/nuevo libro base AV 2026.xlsx          ← ORIGEN ÚNICO (SSOT)
         │
         ▼
scripts/build_master_dataset.py              ← lee Libro Base → genera JSON
         │
         ▼
data/master_prices.json                      ← DATASET CANÓNICO (246 SKUs)
         │
         ├──▶ scripts/gen_cotizador_json.py  → apps/cotizador/data/productos_chile.json
         │                                      apps/cotizador/data/productos_peru.json
         │
         └──▶ scripts/update_avboard.py      ← lee master + ventas + cobranzas
                       │                        calcula IEC Chile (compute_iec_chile)
                       │                        calcula IEC Perú  (compute_iec_peru)
                       │
                       ▼
               avboard_data.js               ← archivo JS generado (NO editar manualmente)
                       │
                       ├──▶ Panel_IEC_Auditoria_2026.html    (IEC bimestral auditado)
                       ├──▶ avboard_*.html                   (Executive Board)
                       └──▶ SIC dashboards                   (comisiones RTCs)
```

---

## 3. Archivos del Ecosistema

### 3.1 SSOT — Origen

| Archivo | Rol | Quién lo escribe | Quién lo lee |
|---------|-----|-----------------|--------------|
| `inbox/nuevo libro base AV 2026.xlsx` | Libro Base oficial AV LATAM | Equipo comercial | `build_master_dataset.py`, `update_avboard.py` |

### 3.2 Capa de Generación

| Script | Input | Output | Frecuencia |
|--------|-------|--------|------------|
| `scripts/build_master_dataset.py` | Libro Base | `data/master_prices.json` | Cada vez que se actualiza el Libro Base |
| `scripts/gen_cotizador_json.py` | `data/master_prices.json` | JSONs cotizador CL + PE | Después de `build_master_dataset.py` |
| `scripts/update_avboard.py` | Libro Base + ventas CL/PE + cobranzas | `avboard_data.js` | Cada vez que llegan archivos al inbox |

### 3.3 Dataset Canónico

| Archivo | Contenido | Registros |
|---------|-----------|-----------|
| `data/master_prices.json` | 246 SKUs (142 CL + 104 PE) con precio piso, costo, margen | 100% con precio piso |

### 3.4 Consumidores

| Módulo | Consume | IEC |
|--------|---------|-----|
| `Panel_IEC_Auditoria_2026.html` | `avboard_data.js` + TX_CL / TX_PE incrustados | Fase 7 ponderada (VNE/VPT) |
| `apps/cotizador/` | `productos_chile.json`, `productos_peru.json` | N/A (solo precios) |
| Executive Board | `avboard_data.js` | N/A (ventas, CxC) |
| SIC (comisiones) | `avboard_data.js` | IEC Chile (bloque `iec`) |

---

## 4. Fórmula IEC Oficial (Fase 7 Ponderada)

```
IEC = Σ(Venta Neta Elegible) / Σ(Cantidad × Precio Piso)
    = VNE / VPT
```

- **VNE (Venta Neta Elegible)**: monto total de cada transacción que tiene precio piso definido.
- **VPT (Valor a Precio Teórico)**: `qty × precio_piso` por transacción.
- **Elegible**: transacción cuyo producto tiene precio piso en el Libro Base.

### Implementaciones

| Módulo | Función | Estado |
|--------|---------|--------|
| `update_avboard.py` | `compute_iec_chile(tx_cl)` | ✅ Fase 7 |
| `update_avboard.py` | `compute_iec_peru(tx_pe)` | ✅ Fase 7 (eliminó hardcode 2026-07-31) |
| `Panel_IEC_Auditoria_2026.html` | `computeStats(tx)` | ✅ Fase 7 (migrado 2026-07-28) |

### Fórmula Binaria — DEPRECATED

```
@deprecated desde 2026-07-28
IEC_binario = SP / VE
  SP = Σ total (solo transacciones SOBRE precio piso)
  VE = Σ total (todas las transacciones elegibles)
```
Permanece en Panel_IEC como referencia histórica, marcado `@deprecated`.

---

## 5. Selección de Precio Piso

Cuando el Libro Base tiene dos columnas de precio:

1. **"NUEVO PRECIO PISO PROPUESTO"** (col J) → se usa si existe y es > 0
2. **"PRECIO PISO (CALCULADO)"** (col G) → fallback

Esta lógica está en `build_master_dataset.py → _parse_sheet()`.

---

## 6. Reconciliación IEC (estado julio-2026)

| Módulo | IEC Chile | IEC Perú | Fuente precios |
|--------|-----------|----------|----------------|
| TX_CL (Panel IEC) | **86.3%** | — | Libro Base nuevo (corte 29/07/2026) |
| avboard_data.js | **51.6%** | 86.7% (hardcode legacy) | Archivo mayo-2026 *(pipeline pendiente de re-ejecución)* |

**Gap explicado**: Los precios de mayo-2026 eran 20-25% más altos que los del Libro Base nuevo → VPT mayor → IEC menor. Tras re-ejecutar `update_avboard.py` con el Libro Base actual, avboard_data.js mostrará IEC Chile ~86% y IEC Perú calculado dinámicamente.

---

## 7. Trazabilidad end-to-end

### Chile

```
nuevo libro base AV 2026.xlsx [sheet: Pricing Piso Chile, col J/G]
  → build_master_dataset.py → master_prices.json [precio_piso por SKU]
  → update_avboard.py → load_piso_chile() → build_tx_cl()
    → compute_iec_chile() → avboard_data.js [chile.ventas.iec]
  → Panel_IEC_Auditoria_2026.html [TX_CL incrustado]
    → computeStats() → kIEC display
```

### Perú

```
nuevo libro base AV 2026.xlsx [sheet: Pricing Piso Peru, col J/G]
  → build_master_dataset.py → master_prices.json [precio_piso por SKU]
  → update_avboard.py → load_piso_peru() → build_tx_pe()
    → compute_iec_peru() → avboard_data.js [peru.ventas.iec]
  → Panel_IEC_Auditoria_2026.html [TX_PE incrustado]
    → computeStats() → kIEC display
```

### Cotizador

```
nuevo libro base AV 2026.xlsx
  → build_master_dataset.py → master_prices.json
  → gen_cotizador_json.py → productos_chile.json / productos_peru.json
  → apps/cotizador/
```

---

## 8. Cómo actualizar datos (operación normal)

1. Depositar archivos en `inbox/`:
   - `nuevo libro base AV 2026.xlsx` (cuando cambien precios piso)
   - `ventas CHILE *.xlsx`
   - `ventas PERU *.xlsx`
   - `CxC *.xlsx`

2. Si cambiaron precios piso → ejecutar primero:
   ```bash
   python3 scripts/build_master_dataset.py
   python3 scripts/gen_cotizador_json.py
   ```

3. Ejecutar pipeline principal:
   ```bash
   python3 scripts/update_avboard.py
   ```

4. Verificar:
   ```bash
   python3 scripts/test_precios_iec.py
   ```
   → Debe pasar 36/36. Si T09b falla, hay transacciones con producto `?` que necesitan homologación.

5. Commit y push:
   ```bash
   git --no-optional-locks add avboard_data.js data/master_prices.json \
       apps/cotizador/data/ Panel_IEC_Auditoria_2026.html
   git --no-optional-locks commit -m "chore(data): actualizar ventas [fecha]"
   git --no-optional-locks push
   ```

---

## 9. Archivos Deprecated

| Archivo | Estado | Razón |
|---------|--------|-------|
| `scripts/test_iec_t1_t18.js` | `@deprecated 2026-07-31` | Superado por `test_precios_iec.py` |
| `scripts/test_iec_fase7_extended.js` | `@deprecated 2026-07-31` | Superado por `test_precios_iec.py` |
| `inbox/precios piso CHile*.xlsx` | DEPRECATED (fallback de emergencia) | Migrar al Libro Base |
| `inbox/precio piso peru*.xlsx` | DEPRECATED (fallback de emergencia) | Migrar al Libro Base |
| Fórmula IEC binaria (`sp/ve`) | `@deprecated 2026-07-28` | Reemplazada por Fase 7 ponderada |

---

## 10. Suite de Pruebas Oficial

**Script:** `scripts/test_precios_iec.py`  
**Tests:** T01-T12 (36 aserciones)  
**Umbral mínimo:** 36/36 para certificación

| Bloque | Qué verifica |
|--------|-------------|
| T01 | Libro Base accesible y con ambas hojas |
| T02 | master_prices.json completo (246 SKUs, 0 sin PP) |
| T03 | Pipeline no tiene hardcodes — usa Libro Base |
| T04 | Cotizador alineado con master_prices.json |
| T05 | Fórmula Fase 7 implementada; binaria no es oficial |
| T06 | avboard_data.js tiene IEC Chile numérico |
| T07 | IEC Perú sin hardcode en avboard_data.js |
| T08 | >55% TX Chile y >65% TX Perú tienen precio piso |
| T09 | Sin transacciones con producto `?` |
| T10 | IEC Chile TX_CL Fase 7 > 75% |
| T11 | IEC Perú TX_PE Fase 7 > 85% |
| T12 | Scripts y archivos SSOT existen |

---

## 11. Responsabilidades

| Rol | Responsabilidad |
|-----|----------------|
| **Equipo comercial** | Mantener Libro Base actualizado en `inbox/` |
| **Claude (sistema)** | Ejecutar pipeline, actualizar `avboard_data.js`, registrar en logs |
| **Data quality** | Homologar transacciones con producto `?` (T09b) |
| **Gerencia** | Aprobar cambios antes de commit (constraint vigente desde 2026-07-31) |

---

*Generado automáticamente por pipeline SSOT AV LATAM · 2026-07-31*
