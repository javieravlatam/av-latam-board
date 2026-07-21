# INFORME PREIMPLEMENTACIÓN — Panel Jefes Perú 2026
## Cuadro Ejecutivo Mensual + Estándar de Panel Ejecutivo

**Fecha:** 2026-07-13  
**Auditoría:** FASE 1–4 completadas  
**Estado:** PENDIENTE DE DECISIÓN GERENCIAL — NO IMPLEMENTAR hasta obtener confirmación en los ítems marcados

---

## Resumen ejecutivo

Se completó la auditoría completa de datos y estructura del `Panel_Jefes_Peru_2026.html`. El análisis revela que el Panel puede mejorarse para alcanzar la paridad con el Panel Chile (cuadro ejecutivo mensual + bloque resumen), pero **hay 4 decisiones operativas que deben tomarse antes de escribir código**, y **3 problemas de datos que deben validarse**. Todos los demás ítems son de diseño o implementación y pueden resolverse unilateralmente.

---

## PARTE A — Diseño propuesto (FASE 3)

### A.1 Estructura objetivo (equivalente a Chile)

El cuadro ejecutivo mensual de Perú tendrá la misma arquitectura que Chile, con las siguientes diferencias inherentes a la disponibilidad de datos:

```
Tab: Detalle por Vendedor
├── Selector de vendedor (8 botones, igual que Chile)
├── Gráfico mensual (3 series)
│   ├── Real 2026: desde AVBOARD.peru.ventas.rtc_mensual_real[avbKey]
│   ├── Real 2025: *** VER ÍTEM #3 *** (no hay dato mensual)
│   └── Ppto 2026: desde v.pptoMes (hardcoded) o derivado de rtc_ppto_anual/12
├── Cuadro ejecutivo mensual (tabla 3 filas × 13 columnas)
│   ├── Fila 1: Ppto 2026 — "N/A" si ppto=null
│   ├── Fila 2: Real 2026 — "Pend." si avbKey=null y período en curso
│   └── Fila 3: Cumplimiento — Real/Ppto×100, coloreado
└── Bloque resumen (2 paneles)
    ├── Panel A: Acumulado al corte (Ppto Acum / Real Acum / Cumpl %)
    └── Panel B: Presupuesto anual total (desde rtc_ppto_anual o sum(pptoMes))
```

### A.2 Mapeo avbKey para vendedoresData de Perú

| Vendedor | avbKey propuesto | rtc_mensual_real | rtc_ppto_anual | pptoMes en Panel |
|----------|-----------------|-----------------|----------------|-----------------|
| OSCAR INFANTE | `infante` | ✅ disponible | 485,058 USD | ✅ disponible (12 meses) |
| OMAR ATALAYA | `atalaya` | ✅ disponible | 248,424 USD | ✅ disponible (12 meses) |
| LISBETH AGUIRRE | `aguirre` | ✅ disponible | 223,930 USD | ✅ disponible (12 meses) |
| NICOLL NAVARRO | `navarro` | ✅ disponible | null | null ⚠️ |
| PATRICIA VALLADARES | `valladares` | ✅ disponible | 142,372 USD | null ⚠️ ver ítem #2 |
| ANTONIO GONZALES | `gonzales` | ✅ disponible | 37,250 USD | parcial (4 meses con valor) |
| SUSAN DIAZ | `diaz` | ✅ disponible | null | null ⚠️ |
| JOSE GELDRES | `null` | ❌ no en AVBOARD | null | null (inactivo) |

### A.3 Corte Perú

```javascript
var corteIdxPE = (function(){
  try {
    var s = AVBOARD.meta.cortes.peru_ventas || '';
    var p = s.split('/');
    return p.length >= 2 ? parseInt(p[1], 10) - 1 : 5;
  } catch(e) { return 5; }
})();
// Resultado actual: cortes.peru_ventas = '30/06/2026' → corteIdxPE = 5 (junio, 0-indexed)
```

### A.4 Lógica de presupuesto mensual (cascada)

Para cada vendedor, el presupuesto mensual se determina en este orden de prioridad:

1. Si `v.pptoMes !== null` → usar `v.pptoMes` (12 meses ya en K USD)
2. Si `avbKey !== null` y `AVBOARD.peru.ventas.rtc_ppto_anual[avbKey]` existe → usar `Array(12).fill(rtc_ppto_anual[avbKey] / 12 / 1000)` con nota "prorrateo anual"
3. Si ninguno → `pptoArr = null` → mostrar "N/A" en toda la fila Ppto

---

## PARTE B — 10 ítems de validación preimplementación (FASE 5)

### [DECISIÓN GERENCIA] Ítem 1 — Discrepancia infante enero: ¿16.5K o 32.8K?

**Hallazgo:** Panel hardcodeado tiene USD 16.5K para OSCAR INFANTE enero 2026. AVBOARD (`rtc_mensual_real.infante[0] = 32,831`) tiene USD 32.8K. Diferencia: USD 16,331 (47%).

**Opciones:**
- A) La cifra de AVBOARD es correcta (viene del Excel de ventas Perú procesado por el pipeline) → migrar a AVBOARD; el Panel tenía un dato incorrecto hardcodeado
- B) La cifra del Panel es correcta → hay un error en el pipeline de extracción de ventas Perú de enero

**Acción requerida:** Operaciones o Gerencia Perú confirmar venta real de Infante en enero 2026.  
**Impacto si no se valida:** Cuadro ejecutivo implementado con cifra de enero incorrecta.

---

### [DECISIÓN GERENCIA] Ítem 2 — Valladares: ¿ppto 0 o 142K USD?

**Hallazgo:** Panel dice `ppto:null` para PATRICIA VALLADARES. AVBOARD tiene `rtc_ppto_anual.valladares = 142,372 USD` (proveniente del Libro Base AV 2026 → hoja "Presupuesto Pais"). Son fuentes contradictorias.

**Opciones:**
- A) AVBOARD es correcto (Libro Base tiene el número) → mostrar Ppto 142K, calcular cumplimiento contra ese número
- B) Panel es correcto (Valladares fue asignada sin presupuesto formal) → mostrar "N/A" para ppto Valladares; ignorar el número del Libro Base

**Acción requerida:** Gerencia Comercial confirmar si Valladares tiene presupuesto formal 2026.

---

### [DECISIÓN GERENCIA] Ítem 3 — Real 2025 mensual para Perú: ¿incluir o no?

**Hallazgo:** El gráfico de Chile tiene "Real 2025" mensual (12 valores). El Panel Perú solo tiene el total anual (`real25` en K USD), sin desglose mensual en ninguna fuente.

**Opciones:**
- A) Omitir serie 2025 del gráfico Perú → gráfico solo muestra Real 2026 + Ppto 2026 (como está hoy, pero actualizando Real 2026 a AVBOARD)
- B) Agregar serie 2025 con prorrateo `real25/12` y nota "Estimado (anual/12)" → visible pero con advertencia
- C) Solicitar datos mensuales 2025 de Perú a Gerencia Perú (retrasaría implementación)

**Recomendación:** Opción A (omitir). No hay dato mensual real; prorratear puede inducir a error.  
**Acción requerida:** Aprobación de Gerencia.

---

### [DECISIÓN GERENCIA] Ítem 4 — Navarro y Diaz: ¿datos completos o vendedoras nuevas?

**Hallazgo:**
- NICOLL NAVARRO: datos solo en enero (26.3K) y febrero (7.7K); cero en mar-jun. No marcada como `inactivo2026`.
- SUSAN DIAZ: dato solo en abril (6.3K); cero en ene-mar; cero en may-jun en el Panel (pero AVBOARD tiene jun=8.32K para diaz).

**Pregunta:** ¿Estas vendedoras dejaron de operar en sus meses en cero, o hay datos faltantes que no se cargaron?

**Impacto:** Si hay datos faltantes, el cuadro ejecutivo mostrará ceros que no son reales. Si es dato real, los ceros son correctos.  
**Acción requerida:** Operaciones Perú confirmar actividad de Navarro y Diaz por mes.

---

### [TÉCNICO — sin bloqueante] Ítem 5 — Datos de junio ausentes en el Panel (stale hardcoded)

**Hallazgo:** Todos los vendedores tienen `meses26[5] = null` en el Panel, aunque AVBOARD tiene datos de junio para 6 de 7 vendedores activos. La implementación del cuadro ejecutivo corrige esto automáticamente al migrar a AVBOARD como fuente.

**Acción:** Al implementar, se reemplaza `v.meses26` por lectura de `AVBOARD.peru.ventas.rtc_mensual_real[v.avbKey]`. Los datos de junio aparecerán automáticamente.  
**Decisión requerida:** Ninguna. Corrección incluida en la implementación.

---

### [TÉCNICO — sin bloqueante] Ítem 6 — Fórmula cumplimiento: consistencia con Chile

**Definición confirmada:**
```
cumplimiento_acum = sum(Real[0..corteIdx]) / sum(Ppto[0..corteIdx]) × 100
```
Igual que Chile. NO es promedio de porcentajes mensuales. Si `ppto_acum = 0`, mostrar "N/A".

Para vendedores con prorrateo anual/12, el denominador usa los mismos `n` meses prorateados.

**Acción:** Ninguna — implementar fórmula estándar.

---

### [TÉCNICO — sin bloqueante] Ítem 7 — Umbrales de colores

Mismos umbrales que Chile (semáforo estándar AV LATAM):
- 🔴 `< 80%` → `ce-bajo` (rojo)
- 🟡 `80–99%` → `ce-parcial` (ámbar)
- ✅ `≥ 100%` → `ce-ok` (verde)

Sin cambios respecto a Chile.

---

### [TÉCNICO — sin bloqueante] Ítem 8 — Geldres: tratamiento de vendedor inactivo

**Decisión de diseño:** JOSE GELDRES tiene `avbKey = null` (no en AVBOARD 2026), `inactivo2026: true`, y datos hardcodeados (`meses26[4]=2.6`).

**Tratamiento propuesto:**
- Mostrar en la tabla de vendedores con nota "Sin actividad 2026" (ya existe en el Panel)
- En el cuadro ejecutivo: fila Real 2026 muestra 0 en todos los meses, con nota de "Inactivo"
- En el bloque resumen: excluir de los totales generales (o marcar explícitamente como excluido)
- El mes con 2.6K en mayo queda como dato del Panel (si Operaciones lo confirma como real, puede hardcodearse)

---

### [TÉCNICO — sin bloqueante] Ítem 9 — Moneda: USD (no CLP)

El Panel Perú opera en USD. El cuadro ejecutivo debe:
- Mostrar valores en K USD (igual que el gráfico actual)
- Tooltip: "USD X.XK"
- No aplicar conversión de tipo de cambio (a diferencia de paneles agregados Chile/Perú)

---

### [TÉCNICO — sin bloqueante] Ítem 10 — Reglas Chart.js (mantener paridad con sistema)

Reglas existentes que aplican a cualquier modificación del Panel:
1. `Chart.js` se carga **una sola vez** — no duplicar el tag `<script>`
2. **No usar** `destroy()` ni `DOMContentLoaded`
3. La instancia del gráfico (`chartVend`) se reutiliza con `.data.datasets = [...]; .update()`
4. **No romper** la estructura visual existente — solo agregar después del bloque del gráfico
5. **No modificar** los paneles KPI superiores, la tabla de vendedores ni el gráfico agregado del país

---

## PARTE C — Checklist de aprobación

Para proceder con la implementación, necesito confirmación de Javier en los siguientes puntos:

| # | Pregunta | Decisión | Nota |
|---|---------|---------|------|
| 1 | Infante enero: ¿16.5K (Panel) o 32.8K (AVBOARD)? | ⬜ Panel / ⬜ AVBOARD | — |
| 2 | Valladares ppto: ¿null o 142K USD? | ⬜ null / ⬜ 142K / ⬜ Confirmar con Finanzas | — |
| 3 | Gráfico Real 2025 Perú: ¿omitir o mostrar estimado? | ⬜ Omitir / ⬜ Estimado anual/12 | Recomiendo Omitir |
| 4 | Navarro/Diaz: ¿datos correctos o hay datos faltantes? | ⬜ Correctos / ⬜ Faltan datos | — |

Una vez recibida la confirmación de estos 4 puntos, la implementación puede proceder sin pausas adicionales. Los ítems 5–10 están resueltos por diseño y no requieren validación operativa.

---

## PARTE D — Archivos que se modificarán

| Archivo | Tipo de cambio | Riesgo |
|---------|---------------|--------|
| `Panel_Jefes_Peru_2026.html` | Agregar CSS, HTML (cuadro ejecutivo + bloque resumen), JS (avbKey, AVBOARD lookups, updateVendChart, updateCuadroEjecutivo) | Medio — cambio estructural; se usará jsdom post-modificación |
| `logs/update_log.txt` | Agregar entrada | Bajo |

**Archivos que NO se tocan:**
- `sic_core.js` ✅
- `sic_data_adapter.js` ✅
- `avboard_data.js` ✅
- `scripts/update_avboard.py` ✅
- Cualquier otro panel HTML ✅

---

*Documentos de soporte: `PERU_DATE_ROOT_CAUSE_ANALYSIS.md`, `DATA_QUALITY_CONTROL_AV_LATAM.md`, `DATA_SOURCE_AUDIT.md`*
