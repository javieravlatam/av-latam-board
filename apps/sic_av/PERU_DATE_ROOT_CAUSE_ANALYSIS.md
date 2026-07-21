# AUDITORÍA DE FECHAS PERÚ — Análisis de Causa Raíz TX_PE

**Fecha:** 2026-07-13  
**Alcance:** TX_PE en `Panel_IEC_Auditoria_2026.html` — 92 registros de venta Perú 2026  
**Autor:** Sistema AVBOARD (Claude)  
**Estado:** DOCUMENTADO — fix pendiente en pipeline (fuera de `apps/sic_av/`)

---

## 1. Resumen ejecutivo

TX_PE contiene **errores críticos de fecha en el 96% de los registros** (88/92). La causa es que la fecha de las ventas Perú (formato Excel DD/MM/YYYY, estándar local) fue parseada como MM/DD/YYYY (estándar US) al construir TX_PE, produciendo dos tipos de error:

- **Inversión de día y mes** (40 registros, 43%): cuando el día original DD ≤ 12, Excel/pandas interpreta ese DD como mes → la fecha queda invertida.
- **Fecha NaN** (48 registros, 52%): cuando el día original DD está en el rango 13–25, la interpretación MM/DD produce un mes inválido (>12) → pandas devuelve NaT, serializado como `NaN` en TX_PE.
- **Fecha correcta** (4 registros, 4%): cuando el día original DD ≥ 26 no puede ser un mes válido → el parser cae en formato correcto (o la celda estaba guardada como serial de fecha Excel, no texto).

**Consecuencia directa para el SIC-AV:** cualquier ciclo comercial 26→25 reconstruido desde TX_PE puede asignar transacciones al ciclo equivocado o excluirlas por completo. `sic_data_adapter.js` ya detecta y advierte sobre las fechas fuera de rango, pero **no puede corregir las fechas invertidas** sin asumir la fecha real (que el adaptador no conoce).

---

## 2. Evidencia

### 2.1 Patrón de inversión confirmado (40/92 registros)

Evidencia más clara — `dd_fecha_almacenada == número_de_mes_asignado`:

| Folio | Mes asignado | Fecha almacenada | Fecha ISO real deducida | Fecha original Excel (inferida) |
|-------|-------------|-----------------|------------------------|--------------------------------|
| 897   | ENERO (01)  | 2026-**05**-**01** | 2026-01-05 | 05/01/2026 (5 ene) |
| (ej.) | FEBRERO (02)| 2026-**07**-**02** | 2026-02-07 | 07/02/2026 (7 feb) |
| 989   | MARZO (03)  | 2026-03-**26**     | 2026-03-26 ✓ | 26/03/2026 (DD≥26, sin ambigüedad) |
| 992   | MARZO (03)  | 2026-03-**30**     | 2026-03-30 ✓ | 30/03/2026 (DD≥26) |
| 993   | MARZO (03)  | 2026-03-**31**     | 2026-03-31 ✓ | 31/03/2026 (DD≥26) |
| 998   | MARZO (03)  | 2026-03-**26**     | 2026-03-26 ✓ | 26/03/2026 (DD≥26) |

**Regla confirmada:** para los 40 registros con fecha almacenada válida e inversión, el día (`dd`) del campo `fecha` en TX_PE es igual al número de mes del campo `mes`. Esto prueba la inversión DD↔MM.

### 2.2 Registros con fecha NaN (48/92)

Corresponden a transacciones cuya fecha original en Excel tenía un día (DD) en el rango 13–25. Al leer como MM/DD:
- Mes resultante = DD original (ej. "15") → inválido (no existe mes 15)
- pandas retorna NaT → serializado como `NaN` en el objeto JS de TX_PE
- `sic_data_adapter.js` usa `_parseArrayJsLiteral` (función constructora, no `JSON.parse`) para leer TX_PE sin que el `NaN` crudo rompa el parseo — esto es ya conocido y documentado en `DATA_SOURCE_AUDIT.md §3.2`

### 2.3 Confirmación del bug en DATA_SOURCE_AUDIT.md existente

La sección 3.2 ya documenta este hallazgo:

> "Al extraer TX_PE de Panel_IEC_Auditoria_2026.html se encontraron fechas como 2026-12-03 y 2026-05-01 para transacciones cuyo archivo fuente solo cubre hasta junio 2026. Ejemplo verificado: el folio 897 (FECHA EMISION real = 05/01/2026, es decir 5 de enero en formato DD/MM) aparece en TX_PE con fecha:2026-05-01 (1 de mayo) — el día y el mes quedaron invertidos al parsear."

---

## 3. Causa raíz técnica

### 3.1 Mecanismo

```
Fuente Excel (Perú):  "05/01/2026"  →  (Perú: DD/MM/YYYY = 5 de enero)
Pandas lee como:       MM/DD/YYYY   →  mes=05, día=01  →  2026-05-01 (1 de mayo)
TX_PE almacena:        "fecha":"2026-05-01"   ← INCORRECTO
Fecha real:            "fecha":"2026-01-05"   ← CORRECTO
```

La causa es la ausencia de `dayfirst=True` o `format='%d/%m/%Y'` al parsear las fechas del Excel de Perú.

### 3.2 Localización del bug en el pipeline

El bug ocurrió en el proceso que generó TX_PE por **primera y única vez**. La función `update_panel_iec()` en `scripts/update_avboard.py` (línea 1728) **SOLO actualiza TX_CL** — no existe `build_tx_pe()` ni `update_panel_iec_pe()`:

```python
# scripts/update_avboard.py línea 2038 (main)
tx_cl = build_tx_cl(cl_v['df'], piso_dict)
n_tx  = update_panel_iec(tx_cl, cortes['chile_ventas'])
# ← NO hay equivalente para Perú
```

**TX_PE no se regenera con cada ejecución del pipeline.** Es una capa estática dentro de `Panel_IEC_Auditoria_2026.html`, construida en un momento anterior (fecha desconocida) con parseo de fecha incorrecto, y nunca actualizada desde entonces.

### 3.3 Por qué el 4% (4 registros) quedó correcto

Los 4 folios con DD ≥ 26 (2026-03-26, 2026-03-30, 2026-03-31) son correctos porque:
- **Hipótesis A (más probable):** las celdas correspondientes en el Excel de Perú estaban guardadas como tipo "Fecha" (serial de fecha Excel), no como texto. `openpyxl` las entrega como objetos `datetime` de Python → correctas sin importar `dayfirst`.
- **Hipótesis B:** con DD=26/30/31, la interpretación MM/DD habría generado un mes inválido (igual que el rango 13–25), y el parser intentó un fallback DD/MM que funcionó.

La distinción entre A y B no es necesaria para el fix — en ambos casos la solución es la misma.

---

## 4. Impacto cuantificado

| Tipo | Registros | % | Impacto en SIC-AV |
|------|-----------|---|-------------------|
| Fecha correcta | 4 | 4% | Ninguno |
| Fecha invertida (DD↔MM) | 40 | 43% | Transacción en ciclo equivocado |
| Fecha NaN | 48 | 52% | Transacción excluida del ciclo (advertencia visible) |
| **Total con error** | **88** | **96%** | **Ciclos SIC no representativos** |

El importe total afectado no puede calcularse sin conocer los `total` por folio en TX_PE, pero con el 96% de registros comprometidos, **ningún resultado de ciclo SIC basado en TX_PE debe considerarse fiable hasta corregir el pipeline**.

---

## 5. Propuesta de corrección

### Alternativa A — Corrección en el pipeline (RECOMENDADA)

Implementar `build_tx_pe()` y `update_panel_iec_pe()` en `scripts/update_avboard.py` usando parseo explícito:

```python
# En la función de extracción del Excel de Perú para TX_PE
df['fecha_dt'] = pd.to_datetime(df['FECHA EMISION'],
                                format='%d/%m/%Y',
                                dayfirst=True,
                                errors='coerce')
```

Esto garantiza DD/MM/YYYY y elimina la ambigüedad. Las fechas que resulten NaN después del fix con `format` explícito serán genuinamente inválidas (celdas vacías o mal formateadas), no artefactos del parseo.

**Pasos requeridos (fuera del alcance de `apps/sic_av/`):**
1. Crear `build_tx_pe(df_pe, piso_pe_dict)` análoga a `build_tx_cl()` en `scripts/update_avboard.py`
2. Crear `update_panel_iec_pe(tx_pe, corte_date)` que reemplace `const TX_PE = [...]` en `Panel_IEC_Auditoria_2026.html`
3. Integrar ambas en `main()` del pipeline

**Resultado:** TX_PE se regenera en cada ejecución del pipeline, con fechas correctas, igual que TX_CL.

### Alternativa B — Workaround en el adaptador SIC (NO RECOMENDADA)

Inferir la fecha correcta a partir del campo `mes` usando el día almacenado como "número de mes real":

```javascript
// SOLO aplicable a registros donde fecha es válida pero invertida
// No aplicable a los 48 NaN — imposible recuperar la fecha sin el día original
if (tx.fecha && tx.mes) {
  var partes = tx.fecha.split('-'); // [YYYY, mm_stored, dd_stored]
  var ddOriginal = parseInt(partes[1], 10); // el mm_stored = DD original
  // … reconstruir fecha
}
```

**Por qué NO se recomienda:**
- Solo recupera 40/88 registros (los invertidos), los 48 NaN siguen perdidos
- Introduce lógica de corrección dentro del adaptador SIC, que ya es responsable del cálculo de ciclos, no de la calidad de los datos fuente
- Crea dependencia circular entre el adaptador y los errores específicos del pipeline actual
- Si el pipeline se corrige en el futuro, este workaround quedaría obsoleto y podría producir doble corrección

### Decisión recomendada

Implementar **Alternativa A** en la próxima ventana de mantenimiento del pipeline. Mientras tanto:
- El SIC-AV continúa con Perú en modo "datos de venta reales desde fuente provisional" (`sic_provisional_pe.js`)
- Las advertencias de "fecha inválida" ya visibles en el SIC-AV son el comportamiento correcto — no suprimirlas
- No implementar Alternativa B

---

## 6. Checklist de verificación post-fix

Una vez implementada la Alternativa A:

- [ ] `build_tx_pe()` existe en `scripts/update_avboard.py`
- [ ] `update_panel_iec_pe()` reemplaza `TX_PE` en `Panel_IEC_Auditoria_2026.html` en cada ejecución
- [ ] Ejecutar pipeline → verificar que `TX_PE` tiene 0 registros con `fecha:NaN`
- [ ] Ejecutar pipeline → verificar que la distribución de fechas por mes es coherente (ej. registros de ENERO tienen `fecha` en rango 01/01–31/01)
- [ ] Re-ejecutar pruebas SIC-AV (108 pruebas) → 108/108 OK
- [ ] Actualizar `DATA_SOURCE_AUDIT.md §7` marcando ítem 1 como RESUELTO

---

*Ver también: `DATA_SOURCE_AUDIT.md §3.2`, `COLLECTION_SOURCE_AUDIT.md`, `DATA_QUALITY_CONTROL_AV_LATAM.md`*
