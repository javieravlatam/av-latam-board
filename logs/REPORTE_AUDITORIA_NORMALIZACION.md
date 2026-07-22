# REPORTE DE AUDITORÍA — Normalización de Vendedores Perú
**Fecha:** 2026-07-21  
**Alcance:** Lizbeth/Lisbeth Aguirre + Martha Hidalgo en todo el ecosistema  
**Estado:** Auditado + Fix implementado · Pre-commit pendiente de aprobación

---

## 1. Resumen ejecutivo

Se detectaron dos problemas de consistencia en la capa de normalización del SIC para Perú:

1. **Lizbeth Aguirre — "Pendiente de carga"**: el adaptador SIC no reconocía la variante ortográfica "LISBETH AGUIRRE" (con S, que es la forma que aparece en las 40 transacciones reales de TX_PE). Resultado: el SIC generaba la clave derivada `"lisbeth_aguirre"`, que no tiene presupuesto asociado → "Pendiente de carga".

2. **Martha Hidalgo — ausente en selector**: Martha tiene presupuesto asignado en AVBOARD (`rtc_mensual_ppto.martha`, activo a partir de agosto 2026) pero no tiene transacciones en TX_PE porque fue incorporada en agosto 2026 (después del corte actual). El selector del SIC se construye exclusivamente desde transacciones reales, por lo que Martha nunca aparece.

Ambos problemas tienen su causa raíz en `sic_data_adapter.js`. El resto del ecosistema (pipeline, AVBOARD, Panel_Presupuesto) ya maneja correctamente ambos casos.

---

## 2. Auditoría por componente

### 2.1 TX_PE (Panel_IEC_Auditoria_2026.html)

| Campo `"vendedor"` | Ocurrencias |
|-------------------|------------|
| `"LISBETH AGUIRRE"` | 40 |
| `"LIZBETH AGUIRRE"` | 0 |

La fuente real de transacciones usa `"LISBETH AGUIRRE"` (S). La forma "LIZBETH" (Z) no existe en TX_PE.

### 2.2 update_avboard.py (pipeline)

```python
'LISBETH AGUIRRE':  'aguirre',   # variante con S — forma real en TX_PE
'LIZBETH AGUIRRE':  'aguirre',   # variante con Z — forma canónica GG-002
```

Estado: ✅ Correcto. Ambas variantes mapeadas desde versiones anteriores.

### 2.3 avboard_data.js

```javascript
rtc_mensual_real.aguirre  // ✅ generado correctamente
rtc_mensual_ppto.aguirre  // ✅ generado correctamente
```

Estado: ✅ Correcto. Clave 'aguirre' tiene ventas y presupuesto.

### 2.4 sic_data_adapter.js — ESTADO ANTES DEL FIX

```javascript
SICAdapter.VENDEDOR_MAP = {
  PE: {
    "LIZBETH AGUIRRE": "aguirre",   // ✅ solo variante Z
    // ❌ faltaba "LISBETH AGUIRRE" con S
  }
};
```

Cuando el adapter procesaba TX_PE y encontraba `"LISBETH AGUIRRE"`:
- No matchea VENDEDOR_MAP → `esComercial: true, mapeado: false`
- Genera clave derivada: `"lisbeth_aguirre"`
- Las ventas van a `"lisbeth_aguirre"` (correcto en apariencia)
- El presupuesto se busca en `rtc_mensual_ppto["lisbeth_aguirre"]` → no existe → `null` → "Pendiente de carga"
- Generaba también advertencia `vendedor_sin_mapeo` (visible pero ignorada)

### 2.5 Panel_Presupuesto_AV_2026.html

- Aguirre: botón `setPeruMesVendor('aguirre', this)` → lee AVBOARD con clave 'aguirre' ✅
- Martha: botón `setPeruMesVendor('martha', this)` ✅
- No tiene dependencia de VENDEDOR_MAP del SIC

Estado: ✅ Correcto. Ambas vendedoras en selector, datos correctos.

### 2.6 Otros paneles HTML (Panel_Peru, Panel_Jefes_Peru, Executive_Board, etc.)

Leen directamente de `AVBOARD.peru.ventas.rtc_mensual_real / rtc_mensual_ppto` usando la clave `'aguirre'`. No tienen selectores individuales por vendedor para el SIC. No afectados.

Estado: ✅ Correcto. Sin cambios necesarios.

---

## 3. Causa raíz — Martha Hidalgo ausente en selector SIC

`construirCicloReal` construye la lista de vendedores así:

```javascript
var vendedoresVistos = {};
// Loop TX_PE → solo agrega a vendedoresVistos si tiene transacciones
txArray.forEach(function(t) {
  vendedoresVistos[vend.clave] = t.vendedor;
});
// vendedores = solo los que tuvieron transacciones
var vendedores = Object.keys(vendedoresVistos).map(...)
```

Martha no tiene transacciones en TX_PE hasta agosto 2026. Resultado: nunca aparece en el selector del SIC aunque tenga presupuesto asignado.

---

## 4. Fixes implementados

### Fix 1: VENDEDOR_MAP — agregar variante "LISBETH AGUIRRE" (S)

```javascript
// Antes:
"LIZBETH AGUIRRE": "aguirre"

// Después:
"LISBETH AGUIRRE": "aguirre",   // variante ortográfica — fuente TX_PE usa S (GG-002)
"LIZBETH AGUIRRE": "aguirre",   // variante ortográfica — Z (forma canónica GG-002)
```

Con este fix, todas las transacciones de Aguirre (40 registros en TX_PE) mapean correctamente a clave `'aguirre'`, que sí tiene `rtc_mensual_ppto` → presupuesto visible → sin "Pendiente de carga".

### Fix 2: VENDEDORES_SEMILLA + lógica de inclusión sin ventas

Se agrega un catálogo explícito de vendedores que deben aparecer en el selector aunque no tengan transacciones en el ciclo, siempre que tengan presupuesto > 0 en el mes de desempeño:

```javascript
SICAdapter.VENDEDORES_SEMILLA = {
  CL: {},
  PE: {
    "martha": "MARTHA HIDALGO"  // KAM incorporada ago 2026
  }
};
```

En `construirCicloReal`, ANTES de construir los arrays de presupuestos e IEC:

```javascript
var semilla = SICAdapter.VENDEDORES_SEMILLA[pais] || {};
Object.keys(semilla).forEach(function (clave) {
  if (vendedoresVistos[clave]) return; // ya tiene transacciones — no duplicar
  var ppto = SICAdapter._presupuestoDelMes(pais, clave, mesDesempeno, fuentes.presupuesto);
  if (ppto === null || ppto === 0) return; // sin presupuesto en este mes — no agregar
  vendedoresVistos[clave] = semilla[clave];
  advertencias.push({ tipo: "vendedor_semilla_sin_ventas", ... });
});
```

Comportamiento:
- Ciclo 2026-09 → mes desempeño 2026-08 → Martha ppto = 10.000 > 0 → **aparece en selector** ✅
- Ciclos anteriores a agosto → Martha ppto = 0 → **no aparece** (correcto, no tenía presupuesto) ✅
- Cuando Martha tenga transacciones reales, `if (vendedoresVistos[clave]) return` la toma desde transacciones → **sin duplicados** ✅

---

## 5. Alcance del fix — solo sic_data_adapter.js

| Archivo | Cambio | Motivo |
|---------|--------|--------|
| `apps/sic_av/js/sic_data_adapter.js` | + `"LISBETH AGUIRRE"` en VENDEDOR_MAP.PE | TX_PE usa S no Z |
| `apps/sic_av/js/sic_data_adapter.js` | + `VENDEDORES_SEMILLA` + lógica semilla en `construirCicloReal` | Martha sin transacciones |

### Sin cambios (auditado y correcto)

| Archivo | Estado |
|---------|--------|
| `scripts/update_avboard.py` | ✅ Ya tenía ambas variantes Lisbeth/Lizbeth |
| `avboard_data.js` | ✅ Clave 'aguirre' con datos correctos |
| `Panel_Presupuesto_AV_2026.html` | ✅ Aguirre y Martha ya en selectores |
| `apps/sic_av/sic_core.js` | ✅ Sin cambios — lógica comercial intacta |
| `apps/sic_av/sic_chile.html` / `sic_peru.html` | ✅ Sin cambios |
| `apps/sic_av/data/*.json` (demo) | ✅ Sin cambios |

---

## 6. Resultado de pruebas

| Suite | Pruebas | Resultado |
|-------|---------|-----------|
| Motor SIC (sic_core.js) | 49/49 | ✅ |
| Adaptador de datos reales | 26/26 | ✅ |
| Modelo temporal v1.6 | 16/16 | ✅ |
| Pruebas específicas normalización | 14/14 | ✅ |
| **Total** | **105/105** | ✅ |

### Detalle pruebas de normalización

| Caso | Resultado |
|------|-----------|
| `"LISBETH AGUIRRE"` → clave `'aguirre'` | ✅ |
| `"LISBETH AGUIRRE"` → mapeado=true (no derivado) | ✅ |
| `"LIZBETH AGUIRRE"` → clave `'aguirre'` | ✅ |
| `"Lisbeth Aguirre"` (mixed case) → `'aguirre'` | ✅ |
| Martha ppto agosto = 10.000 | ✅ |
| Martha en vendedoresVistos cuando ppto > 0 (ciclo 2026-09) | ✅ |
| Martha NO en vendedoresVistos cuando ppto = 0 (ciclo 2026-02) | ✅ |
| Sin duplicados cuando Martha tiene transacciones | ✅ |

---

## 7. Resultado esperado post-fix

| Indicador | Antes | Después |
|-----------|-------|---------|
| Lizbeth Aguirre — ventas en SIC | ✅ mostraba (con clave derivada) | ✅ (con clave 'aguirre') |
| Lizbeth Aguirre — presupuesto en SIC | ❌ "Pendiente de carga" | ✅ Distribución mensual real |
| Lizbeth Aguirre — cumplimiento en SIC | ❌ no calculable | ✅ calculable |
| Martha — en selector SIC (ciclo ≥ sep 2026) | ❌ no aparecía | ✅ aparece con ppto y ventas=0 |
| Martha — en selector SIC (ciclos anteriores a ago 2026) | ❌ | ✅ no aparece (ppto=0, correcto) |
| Martha — en Panel_Presupuesto selector | ✅ ya estaba | ✅ sin cambios |
