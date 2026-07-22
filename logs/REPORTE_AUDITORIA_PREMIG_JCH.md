# REPORTE DE AUDITORÍA PRE-MIGRACIÓN
## Panel_Jefes_Chile_2026.html → FORMATO JAVIER v1.1

**Fecha:** 2026-07-22  
**Auditor:** Claude (Fase A — FORMATO JAVIER v1.1)  
**Archivo auditado:** `Panel_Jefes_Chile_2026.html`  
**Backup verificado:** `Panel_Jefes_Chile_2026.html.bak_20260722`  
**MD5 backup:** `dd70f73ee5a496056cfb43ffa28c2d64` (idéntico al original)  
**Estado:** ORIGINAL INTACTO — ninguna modificación realizada  

---

## MÉTRICAS DEL ARCHIVO

| Métrica | Valor |
|---|---|
| Líneas totales | 1,550 |
| Tamaño | ~77 KB |
| Líneas de `<style>` | 150 |
| Ocurrencias `style=` inline | 241 |
| Charts (new Chart) | 5 instancias |
| Variables CSS locales | 14 |
| Total `<th>` sin `scope=` | 43 / 43 (100% sin scope) |

---

## 1. INVENTARIO DE VARIABLES CSS ANTIGUAS

### Variables con equivalente directo en DS

| Variable antigua | Usos | Token FORMATO JAVIER |
|---|---|---|
| `--red` | 71 | `--danger` |
| `--dim` | 40 | `--text-dim` |
| `--amber` | 40 | `--warning` |
| `--muted` | 39 | `--text-muted` |
| `--green` | 32 | `--domain-accent` / `--positive` |
| `--bdr` | 12 | `--border` |
| `--s2` | 12 | `--surface-2` |
| `--s1` | 7 | `--surface` |
| `--bg` | 6 | `--bg` (sin cambio) |
| `--blue` | 4 | `--info` |
| `--text` | 3 | `--text` (sin cambio) |
| `--s3` | 1 | `--surface-3` |
| `--bdim` | 1 | `--border-dim` |
| `--red2` | 0 usos reales | `--danger-dark` |

**Total reemplazos directos: ~268 referencias**

### Variables SIN equivalente en DS — REQUIEREN DECISIÓN

| Variable | Usos | Situación |
|---|---|---|
| `--orange` (#E67E22) | 14 | No existe en DS. Usado para tramo CxC 61–90d ("Riesgo"). Distinto de `--warning` (#F5A623). |
| `--purple` (#9B59B6) | 1 (solo chart) | No existe en DS. Solo en `chartRegion` como 7° color de serie. |

**Decisión requerida para `--orange`:** Ver Sección 10 (Riesgos Confirmados).

---

## 2. INVENTARIO DE ESTILOS INLINE

**241 ocurrencias `style=`** distribuidas en:

| Categoría | Líneas | Naturaleza |
|---|---|---|
| Semáforo mensual (ENE–ABR) | 267–295 | Hardcodeados: datos históricos cerrados. Se preservan. |
| Donut y strips YTD | 296–325 | Mixto: layout + colores inline. Se reemplaza con clases DS. |
| Micro-layout (flex, gap, padding) | varios | Se reemplaza con `.av-flex*`, `.av-gap-*`, `.av-p-*` de utilities. |
| Colores semánticos inline (`color:var(--red)`, etc.) | ~120 | Se reemplaza con `.av-text-danger`, `.av-text-warning`, etc. |
| Grids inline (`display:grid;grid-template-columns:...`) | ~15 | Se reemplaza con `.av-grid-2`, `.av-grid-auto`, etc. |
| Tablas IEC (celdas con `font-size:10px;color:var(--red)`) | ~40 | Se reemplaza con `.av-text-danger` + migración de font-size. |
| CxC cards (`background:rgba(...)`) | 452–472 | Residual: únicas del panel (tramos CxC). Ver Sección 10. |
| Pricing cards (#516–542) | ~20 | Residual: únicas del panel (IEC KPI cards). Ver Sección 10. |

---

## 3. INVENTARIO DE CLASES ACTUALES Y CORRESPONDENCIA CON FORMATO JAVIER

### Clases con equivalente en DS (se eliminan del panel)

| Clase actual | Equivalente DS | Archivo DS |
|---|---|---|
| `.kpi` | `.av-kpi-lg` | components.css |
| `.kpi-lbl` | `.av-kpi-lg__label` | components.css |
| `.kpi-val` | `.av-kpi-lg__val` | components.css |
| `.kpi-sub` | `.av-kpi-lg__sub` | components.css |
| `.kpi-g` | `.av-ok` | components.css |
| `.kpi-a` | `.av-warn` | components.css |
| `.kpi-r` | `.av-alert` | components.css |
| `.kpi-b` | inline `color:var(--info)` | — |
| `.tabs` | `.av-nav-tabs` | components.css |
| `.tab` | `.av-tab` | components.css |
| `.tab.active` | `.av-tab.active` | components.css |
| `.vbtn` | `.av-sel--chip` | components.css |
| `.vbtn.active` | `.av-sel--chip.active` | components.css |
| `.vend-btns` | `.av-sel-group` | components.css |
| `.badge` | `.av-badge` | components.css |
| `.b-ok` | `.av-badge.ok` | components.css |
| `.b-warn` | `.av-badge.warn` | components.css |
| `.b-crit` | `.av-badge.alert` | components.css |
| `.b-risk` | `.av-badge.warn` (naranja → ámbar) | components.css |
| `.b-nd` | `.av-badge.neutral` | components.css |
| `.sema` | `.av-badge-dot` | components.css |
| `.s-ok` | `.av-badge-dot.ok` | components.css |
| `.s-warn` | `.av-badge-dot.warn` | components.css |
| `.s-crit` | `.av-badge-dot.alert` | components.css |
| `.s-risk` | `.av-badge-dot.warn` | components.css |
| `.cumpl-bar` | `.av-progress-wrap` | components.css |
| `.cumpl-fill` | `.av-progress-fill` | components.css |
| `table.tbl` | `.av-table` | components.css |
| `.mono` | `.av-mono` | base.css |
| `.c` | `.av-text-center` (o atributo) | utilities.css |
| `.r` | `.av-text-right` (o atributo) | utilities.css |
| `.g2` | `.av-grid-2` | utilities.css |
| `.g3` | `.av-grid-3` | utilities.css |
| `.np` (nav pills) | `.av-nav-item` | components.css |
| `.btn-logout` | `.av-btn.danger` | components.css |
| `.page` | `.av-page` | base.css |

### Clases SIN equivalente en DS — CSS RESIDUAL

| Clase actual | Situación | Líneas est. |
|---|---|---|
| `.hdr`, `.hdr-l`, `.logo`, `.htitle`, `.hsub`, `.hcorte`, `.hnav` | Nav única del panel (estructura sticky) | ~10 |
| `.sec` | Header de sección interno | 2 |
| `.chart-wrap`, `.chart-title`, `.chart-canvas`, `.chart-canvas-sm` | Wrappers de gráficos | 4 |
| `.mes-table`, `.mes-cell`, `.mes-lbl`, `.mes-v`, `.mes-p` | Grilla mensual compacta (única) | 5 |
| `.cxc-grid`, `.cxc-card`, `.tramo`, `.monto`, `.detail` | Tarjetas CxC por tramo (única) | 5 |
| `.pricing-cards`, `.pc`, `.pc-icon`, `.pc-val`, `.pc-lbl` | Tarjetas KPI IEC (única) | 5 |
| `.exec-wrap`, `.exec-scroll` | Tabla ejecutiva scrollable | 2 |
| `table.tbl-exec`, `.th-acum`, `.td-acum` + sticky col | Tabla ejecutiva con col fija | 8 |
| `.ce-bajo`, `.ce-parcial`, `.ce-ok`, `.ce-cursor`, `.ce-nd` | Semáforo de cumplimiento tabla | 4 |
| `.res-bloque`, `.res-card`, `.res-card-title`, `.res-kpis`, `.res-kpi-lbl`, `.res-kpi-val` | Bloque resumen al pie | 5 |
| `.footer` (layout + separador) | Footer básico | 2 |

**TOTAL ESTIMADO RESIDUAL: ~52 líneas**

> ⚠️ **ALERTA LÍMITE:** Estimación supera el límite de 25 líneas establecido en FORMATO JAVIER v1.1.  
> Ver Sección 10 — Riesgo R-001.

---

## 4. DEPENDENCIAS DE CLASE EN FUNCIONES JS

### `switchTab(t, el)` (líneas 996–1001)

```js
document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
el.classList.add('active');
document.getElementById('tab-' + t).classList.add('active');
```

**Dependencias críticas:**

| Elemento | Uso actual | En migración |
|---|---|---|
| `.tab` (querySelector) | Selector de todos los tabs | Cambiar a `.av-tab` |
| `.tab-content` (querySelector) | Selector de todos los contenidos | **NO CAMBIAR** — no es clase de estilo DS |
| `.tab.active` (CSS) | Tab activo visual | `.av-tab.active` |
| `id="tab-{ventas/vendedores/clientes/cxc}"` | IDs de contenido | **NO CAMBIAR** |

**Acción requerida:** `switchTab` debe actualizarse de `.tab` → `.av-tab`.  
**IDs de contenido NO cambian.**

### `iecTab(country, tab, btn)` (líneas 1398–1406)

```js
['vend','prod','cli'].forEach(t => {
  const el = document.getElementById('iec-' + country + '-' + t);
  if(el) el.style.display = t===tab ? '' : 'none';
});
document.getElementById('iec-sel-' + country).querySelectorAll('.vbtn').forEach(b => b.classList.remove('active'));
```

**Dependencias críticas:**

| Elemento | Uso actual | En migración |
|---|---|---|
| `.vbtn` (querySelectorAll) | Todos los chips de selector | Cambiar a `.av-sel--chip` |
| `id="iec-cl-{vend/prod/cli}"` | IDs de tablas | **NO CAMBIAR** |
| `id="iec-sel-cl"` | Contenedor selector | **NO CAMBIAR** |
| `style.display = ''/'none'` | Show/hide por display | **NO CAMBIAR** — independiente del DS |

**Acción requerida:** `iecTab` debe actualizarse de `.vbtn` → `.av-sel--chip`.

### Vendedor selector dinámico (líneas 1103–1116)

```js
btn.className = 'vbtn' + (i===0 ? ' active' : '');
document.querySelectorAll('.vbtn').forEach(b => b.classList.remove('active'));
```

**Acción requerida:** Cambiar `'vbtn'` → `'av-sel--chip'` en las dos líneas.

### `cerrarSesion()` (línea 1408)

Sin dependencia de clases CSS. **Sin cambios.**

---

## 5. INVENTARIO DE 5 CHARTS CHART.JS Y COLORES HARDCODEADOS

### Chart.defaults global (línea 926)

```js
Chart.defaults.color = '#8fa892';       // → AV_CHART_COLORS.TEXT_MUTED
Chart.defaults.font.family = "'DM Mono',monospace";
Chart.defaults.font.size = 10;           // ≥11px requerido
```

**Acción:** Reemplazar por `Object.assign(Chart.defaults, AV_CHART_DEFAULTS().plugins)` o asignar desde `AV_CHART_COLORS`. El `font.size: 10` debe elevarse a 11.

### Chart 1: `chartVentas` (barras + línea, líneas 1004–1028)

| Dataset | Color actual | Token DS |
|---|---|---|
| Real 2025 (ref.) | `rgba(122,182,72,0.15)` / `rgba(122,182,72,0.3)` | `AV_CHART_COLORS.GREEN_DIM` |
| Real 2026 | `rgba(122,182,72,0.70)` / `G (#7AB648)` | `AV_CHART_COLORS.GREEN` |
| Ppto 2026 (línea) | `B (#4A9EDB)` | `AV_CHART_COLORS.INFO` |
| Grid | `rgba(122,182,72,0.06)` | `AV_CHART_COLORS.GRID` |
| Eje title color | `#5a7060` | `AV_CHART_COLORS.TEXT_MUTED` |

### Chart 2: `chartVendedor` (barras dinámicas, líneas 1140–1173)

| Dataset | Color actual | Token DS |
|---|---|---|
| Real 2026 | `rgba(122,182,72,0.80)` / `G` | `AV_CHART_COLORS.GREEN` |
| Real 2025 | `rgba(122,182,72,0.22)` / `rgba(122,182,72,0.45)` | `AV_CHART_COLORS.GREEN_DIM` |
| Ppto 2026 (línea) | `B` | `AV_CHART_COLORS.INFO` |
| Grid | `rgba(122,182,72,0.06)` | `AV_CHART_COLORS.GRID` |

### Chart 3: `chartRTC` (barras horizontales, líneas 1330–1347)

| Dataset | Color actual | Token DS |
|---|---|---|
| Ventas 2025 (escala) | `[G,G,'rgba(122,182,72,0.65)',…'rgba(122,182,72,0.25)']` | `AV_CHART_SEQUENCES.GREEN_SCALE` (adaptar) |
| Grid | `rgba(122,182,72,0.06)` | `AV_CHART_COLORS.GRID` |

### Chart 4: `chartRegion` (doughnut, líneas 1350–1367)

| Color | Región | Token DS |
|---|---|---|
| `G (#7AB648)` | VII Maule | `AV_CHART_COLORS.GREEN` |
| `rgba(122,182,72,0.8)` | VI O'Higgins | — |
| `rgba(122,182,72,0.65)` | IV Coquimbo | — |
| `A (#F5A623)` | RM | `AV_CHART_COLORS.WARNING` |
| `O (#E67E22)` | V Valparaíso | `AV_CHART_COLORS.GREEN` + opacity (sin equiv. exacto) |
| `B (#4A9EDB)` | X Los Lagos | `AV_CHART_COLORS.INFO` |
| `'#9B59B6'` | Otras | Inline (no en DS) |
| `'#080e09'` (border) | — | `AV_CHART_COLORS.GRID` aprox. |
| Legend font.size: 9 | — | Elevar a 11 |

### Chart 5: `chartCumplCL` (doughnut cumplimiento, líneas 1369–1396)

| Elemento | Estado | Observación |
|---|---|---|
| Data inicial `[199.6, 14.0]` | Hardcodeado | Se actualiza desde AVBOARD en populate (línea 1469). Patrón **OK** — preservar. |
| `backgroundColor` inicial | Hardcodeado rgba | Se reescribe por AVBOARD. |
| `borderColor '#999'` en legend | Hardcodeado | → `AV_CHART_COLORS.TEXT_DIM` |
| Legend font.size: 9 | Hardcodeado | → 11 |
| animation.duration: 600 | OK | Consistente con `--dur-chart: 500ms` |

---

## 6. INVENTARIO DE EMOJIS E ICONOS

### Emojis en UI visible (HTML — deben migrarse a Phosphor Icons)

| Emoji | Ubicación | Línea | Ícono Phosphor |
|---|---|---|---|
| 🇨🇱 | `.htitle` nav header | 174 | Texto plano "Chile" o `<i class="ph ph-globe-hemisphere-west">` |
| ⚡ | Nav link IEC | 180 | `<i class="ph ph-lightning">` |
| 📋 | Nav link CxC | 181 | `<i class="ph ph-clipboard-text">` |
| 📈 | Tab Ventas | 223 | `<i class="ph ph-chart-line">` |
| 👤 | Tab Vendedores | 224 | `<i class="ph ph-user">` |
| 🏢 | Tab Clientes | 225 | `<i class="ph ph-buildings">` |
| 💳 | Tab CxC | 226 | `<i class="ph ph-credit-card">` |
| 🔐 | Btn logout | 187 | `<i class="ph ph-lock">` |
| ✅ | Badges semáforo ENE/MAR (2) | 272, 286 | Texto "Meta" (badge verde ya indica estado) |
| 🟡 | Badge semáforo FEB | 279 | Texto "Bajo" (badge ámbar) |
| 🔴 | Badge semáforo ABR | 293 | Texto "Parcial" (badge rojo) |
| ✅ | CxC card 0–30d | 454 | Texto "0–30d Normal" |
| 🟡 | CxC card 31–60d | 458 | Texto "31–60d Alerta" |
| 🟠 | CxC card 61–90d | 463 | Texto "61–90d Riesgo" |
| 🔴 | CxC card +90d | 468 | Texto "+90d Crítico" |
| 📊 | IEC KPI card 1 | 518 | `<i class="ph ph-chart-bar">` o eliminar |
| ⚠️ | IEC KPI card 2 | 523 | `<i class="ph ph-warning">` |
| 📋 | IEC KPI card 3 | 528 | `<i class="ph ph-clipboard-text">` |
| 💰 | IEC KPI card 4 | 533 | `<i class="ph ph-money">` |
| 🗂️ | IEC KPI card 5 + alerta | 538, 817 | `<i class="ph ph-folders">` |
| 👤 | IEC selector Vendedores | 546 | `<i class="ph ph-user">` |
| 📦 | IEC selector Productos | 547 | `<i class="ph ph-package">` |
| 🏢 | IEC selector Clientes | 548 | `<i class="ph ph-buildings">` |
| 🏠 | Footer Hub | 890 | `<i class="ph ph-house">` |
| 📋 | Footer CxC | 891 | `<i class="ph ph-clipboard-text">` |

### Emojis en JS/lógica (NO son UI visible — tratamiento diferente)

| Emoji | Contexto | Acción |
|---|---|---|
| `⛔` | Error banner JS dinámico (línea 904) | Reemplazar por texto o `ph-x-circle` |
| `🚨` (×22) | Texto en celdas tabla IEC (HTML estático + JS) | Reemplazar por texto "URGENTE" o `.av-badge.alert` |
| `✅` | `cxcLabel.ok = '✅ Al día'` (línea 1313 JS) | Texto "Al día" |
| `⚠️` | `cxcLabel.warn` (línea 1314 JS) | Texto "En seguimiento" |
| `⚠️` | Alerta bloque pricing (línea 878) | `<i class="ph ph-warning">` |
| `✅`, `❌` | `console.log` JS (líneas 916–917) | No son UI — **dejar como están** |
| `🔧`, `⚠️` | Celdas tabla IEC JS hardcode (líneas 592, 607) | Texto "Reforzar", "Monitorear" |

**Total emojis en UI a migrar: 25 instancias únicas (contando duplicados: ~43 ocurrencias)**

---

## 7. REVISIÓN DE TABLAS — ACCESIBILIDAD

| Tabla | `<thead>` | `scope=` | `<caption>` | IDs dinámicos | Estado |
|---|---|---|---|---|---|
| Ventas mensuales | ✅ | ❌ | ❌ | `tbody-ventas` | Incompleta |
| Ranking Vendedores | ✅ | ❌ | ❌ | `tbody-vendedores` | Incompleta |
| Top 15 Clientes | ✅ | ❌ | ❌ | `tbody-clientes` | Incompleta |
| Clientes Críticos CxC | ✅ | ❌ | ❌ | `jch-tbody-criticos` | Incompleta |
| IEC Vendedores | ✅ | ❌ | ❌ | — (estática) | Incompleta |
| IEC Productos | ✅ | ❌ | ❌ | — (estática) | Incompleta |
| IEC Clientes | ✅ | ❌ | ❌ | — (estática) | Incompleta |
| Sin piso (pricing) | ✅ | ❌ | ❌ | — (estática) | Incompleta |
| `tbl-exec` (ejecutiva) | ✅ | ❌ | ❌ | `tbl-exec-container` | Incompleta |

**43 `<th>` sin `scope=` — en migración se agrega `scope="col"` / `scope="row"`.**

---

## 8. TEXTOS CON FONT-SIZE INFERIOR A 11px

### Categorías detectadas

| Tamaño | Ocurrencias | Ejemplos | Acción en migración |
|---|---|---|---|
| **8px** | 7 | `.mes-cell .mes-lbl`, `.mes-cell .mes-p`, donut labels inline, `.pc-lbl small` | → 11px (mínimo DS) |
| **9px** | ~18 (CSS) + ~20 (inline) | `.kpi-lbl`, `.htitle .hsub`, `table.tbl th`, `.badge` inline, `.res-kpi-lbl` | → 11px |
| **10px** | ~45 inline | Celdas IEC, nav pills, chart titles, strips YTD, `.hcorte`, `.footer` | → 11px |

**Impacto visual:** Los textos de 8–9px son principalmente etiquetas de ejes de chart, leyendas de badges, y meta-datos de panel. Al elevarlos a 11px el layout puede expandirse levemente en secciones densas (`.mes-table`, `.cxc-grid`, `.tbl-exec`).

---

## 9. POSIBLES OVERFLOW Y CONFLICTOS DE LAYOUT

| Elemento | Riesgo | Severidad |
|---|---|---|
| `.page` con `max-width:1320px` vs DS `--container-max:1440px` | Diferencia de 120px — el panel se verá algo más estrecho o ancho dependiendo de la pantalla. Ajustar a `.av-page`. | BAJO |
| `.tbl-exec` (`width:max-content`) dentro de `.exec-scroll` | Tabla horizontal scrollable con col sticky. Es el único caso en el panel con esta complejidad. El DS no tiene este patrón — debe preservarse como CSS residual. | MEDIO (estructural único) |
| Font-size elevación 8px→11px en `.mes-table` | Grid de 12 columnas fijo (`repeat(12,1fr)`). Con texto más grande puede colisionar en pantallas <1280px. | MEDIO |
| Font-size elevación 9px→11px en `.tbl-exec th` | Encabezados de tabla muy compactos (8px actuales). Al elevar, la tabla ejecutiva puede necesitar mayor `padding`. | BAJO-MEDIO |
| Gradiente `.hdr` → `var(--surface)` solid | Cambio visual intencional del DS. Sin riesgo de overflow. | BAJO (diseño) |
| `.g2`, `.g3` → `.av-grid-2`, `.av-grid-3` | Las nuevas clases tienen `gap: var(--space-4)` (16px) vs el gap actual de 16px. Idéntico. | NINGUNO |
| `--orange` 14 usos sin equivalente DS | Si se elimina la variable sin reemplazar refs, las tarjetas CxC 61–90d quedarán sin color. | ALTO (dato funcional) |

---

## 10. ESTIMACIÓN DE CSS RESIDUAL ESPECÍFICO DEL PANEL

### Estimación detallada post-migración

| Bloque residual | Líneas est. |
|---|---|
| Nav sticky custom (`.hdr`, `.hdr-l`, `.htitle`, `.hsub`, `.hcorte`) | 10 |
| Sección header interno (`.sec`) | 2 |
| Chart wrappers (`.chart-wrap`, `.chart-title`, `.chart-canvas`) | 3 |
| Grilla mensual compacta (`.mes-table`, `.mes-*`) | 5 |
| CxC tramo cards (`.cxc-grid`, `.cxc-card`) | 5 |
| IEC pricing cards (`.pricing-cards`, `.pc`, `.pc-icon`, `.pc-val`, `.pc-lbl`) | 5 |
| Tabla ejecutiva scrollable (`tbl-exec`, sticky col, `th-acum`, `td-acum`) | 8 |
| Semáforo cumplimiento en tabla (`.ce-*`) | 4 |
| Bloque resumen (`.res-bloque`, `.res-card`, `.res-card-title`, `.res-kpi-*`) | 5 |
| Footer layout | 2 |
| **TOTAL ESTIMADO** | **~49 líneas** |

> 🔴 **LÍMITE SUPERADO: ~49 líneas estimadas vs límite de 25.**  
> Conforme a la regla: "Si se supera, STOP y determinar si el design system necesita evolucionar."

---

## RIESGOS CONFIRMADOS

### R-001 — CSS Residual supera el límite de 25 líneas (CRÍTICO)

**Descripción:** El panel tiene 8 grupos de estilos panel-específicos que suman ~49 líneas después de la migración. El límite aprobado es 25.

**Causa:** El panel contiene 4 componentes únicos sin equivalente en DS v1.1:
- `.tbl-exec` (tabla ejecutiva scrollable con col sticky) — 8 líneas
- `.mes-table` (grilla mensual 12 col compacta) — 5 líneas
- `.cxc-grid/.cxc-card` (tarjetas CxC 4 tramos) — 5 líneas
- `.pricing-cards/.pc` (tarjetas KPI IEC) — 5 líneas

**Opciones:**

| Opción | Descripción | Impacto |
|---|---|---|
| A | Agregar los 4 componentes al DS como v1.2 ANTES de migrar | Retraso ~1 sesión, resultado limpio |
| B | Migrar con exceso documentado, planificar v1.2 para esos componentes | Deuda técnica registrada, migración inmediata |
| C | Componer los componentes únicos con primitivos DS existentes | Reduce residual ~15 líneas pero puede complicar HTML |

**Recomendación:** Opción B — migrar con exceso documentado y registrar como deuda v1.2. Los 4 componentes únicos son estructuralmente necesarios y difíciles de componer sin sobrecarga de HTML.

---

### R-002 — `--orange` sin equivalente en DS (ALTO)

**Descripción:** 14 usos de `--orange` (#E67E22) para el tramo CxC 61–90d "Riesgo". Si se elimina sin resolver, las tarjetas perderán color diferencial respecto a `--warning`.

**Decisión requerida:**
- Mapear a `--warning` (#F5A623): se pierde la distinción visual naranja/ámbar.
- Agregar `--av-orange-500: #E67E22` a tokens y `--caution: var(--av-orange-500)` como semántico → implica modificar el DS → corresponde a v1.2.
- Usar `rgba(230,126,34,x)` inline en el bloque residual CxC → sin tocar el DS.

**Recomendación:** Inline en residual. El naranja CxC es un caso único de este panel. No justifica evolucionar el DS sin una necesidad sistémica confirmada en más paneles.

---

### R-003 — Semáforo mensual ENE–ABR hardcodeado (BAJO-MEDIO)

**Descripción:** Las 4 filas del semáforo mensual (líneas 267–295) tienen datos fijos en HTML: porcentajes, montos, anchos de barra. Son datos históricos correctos pero no dinámicos.

**Estado:** Este patrón existía antes de la migración DS. No es una regresión introducida por la migración.

**Decisión:** Preservar como está. No es responsabilidad de la migración DS hacer este dato dinámico. Registrar en backlog (Task #54 relacionado).

---

### R-004 — Chart.defaults `font.size: 10` (BAJO)

**Descripción:** El global `Chart.defaults.font.size = 10` viola el mínimo de 11px del DS.

**Acción:** Cambiar a `11` al migrar.

---

### R-005 — `chartCumplCL` datos hardcodeados iniciales (BAJO)

**Descripción:** El donut se inicializa con `data:[199.6,14.0]` (valores históricos), pero se actualiza desde AVBOARD en el bloque populate. El patrón es correcto; los valores iniciales son sólo placeholders.

**Acción:** Ninguna — preservar el patrón. Confirmar en pruebas que el update de AVBOARD sobreescribe correctamente.

---

## CORRESPONDENCIA DE CLASES — TABLA MAESTRA

| Clase actual | Clase FORMATO JAVIER v1.1 | Cambio tipo |
|---|---|---|
| `.kpis` | `.av-exec-summary` (o `.av-grid-auto`) | Renombrar |
| `.kpi` | `.av-kpi-lg` | Renombrar |
| `.kpi-lbl` | `.av-kpi-lg__label` | Renombrar |
| `.kpi-val` | `.av-kpi-lg__val` | Renombrar |
| `.kpi-sub` | `.av-kpi-lg__sub` | Renombrar |
| `.kpi-g` | `.av-ok` | Renombrar |
| `.kpi-a` | `.av-warn` | Renombrar |
| `.kpi-r` | `.av-alert` | Renombrar |
| `.tabs` | `.av-nav-tabs` | Renombrar |
| `.tab` | `.av-tab` | Renombrar (+ JS) |
| `.tab-content` | `.tab-content` | **Sin cambio** |
| `.vbtn` | `.av-sel--chip` | Renombrar (+ JS x3) |
| `.vend-btns` | `.av-sel-group` | Renombrar |
| `table.tbl` | `.av-table` | Renombrar |
| `.badge` | `.av-badge` | Renombrar |
| `.b-ok` | `.ok` (mod de av-badge) | Renombrar |
| `.b-warn` | `.warn` (mod de av-badge) | Renombrar |
| `.b-crit` | `.alert` (mod de av-badge) | Renombrar |
| `.b-risk` | `.warn` (mod de av-badge) | Renombrar + pérdida visual naranja |
| `.b-nd` | `.neutral` (mod de av-badge) | Renombrar |
| `.sema` | `.av-badge-dot` | Renombrar |
| `.s-ok` → `.s-warn` → `.s-crit` | `.ok/.warn/.alert` (mod) | Renombrar |
| `.cumpl-bar` | `.av-progress-wrap` | Renombrar |
| `.cumpl-fill` | `.av-progress-fill` | Renombrar |
| `.mono` | `.av-mono` | Renombrar |
| `.g2` / `.g3` | `.av-grid-2` / `.av-grid-3` | Renombrar |
| `.np` | `.av-nav-item` | Renombrar |
| `.btn-logout` | `.av-btn.danger` | Renombrar |
| `.page` | `.av-page` | Renombrar |
| `.c` / `.r` | `.av-text-center` / `.av-text-right` | Renombrar (alta frecuencia: 231 usos) |

---

## CAMBIOS PROPUESTOS

### Fase 1 — `<head>`: reemplazar `<style>` por `<link>` + Phosphor Icons

```html
<!-- Reemplazar todo el bloque <style> con: -->
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
<link rel="stylesheet" href="design-system/formato-javier-tokens.css">
<link rel="stylesheet" href="design-system/formato-javier-base.css">
<link rel="stylesheet" href="design-system/formato-javier-components.css">
<link rel="stylesheet" href="design-system/formato-javier-executive.css">
<link rel="stylesheet" href="design-system/formato-javier-motion.css">
<link rel="stylesheet" href="design-system/formato-javier-utilities.css">
<link rel="stylesheet" href="design-system/domains/formato-javier-board.css">
<style>
/* CSS RESIDUAL — Panel_Jefes_Chile_2026 — FORMATO JAVIER v1.1 */
/* Límite: 25 líneas. Actual estimado: ~49 (ver REPORTE_AUDITORIA_PREMIG_JCH.md R-001) */
/* Deuda técnica v1.2: tbl-exec, mes-table, cxc-card, pricing-cards */
:root { --orange: #E67E22; }                         /* CxC tramo 61-90d (ver R-002) */
/* ... resto del residual ... */
</style>
```

### Fase 2 — JS: Chart.js

```js
// Reemplazar const G/A/O/R/B/M con:
const G = AV_CHART_COLORS.GREEN;
const A = AV_CHART_COLORS.WARNING;
const O = '#E67E22';                       // orange: sin equiv. DS — inline
const R = AV_CHART_COLORS.DANGER;
const B = AV_CHART_COLORS.INFO;
const M = '#9B59B6';                       // purple: chartRegion 7a serie — inline

// Chart.defaults
Chart.defaults.color = AV_CHART_COLORS.TEXT_MUTED;
Chart.defaults.font.family = AV_CHART_DEFAULTS().scales.x.ticks.font.family;
Chart.defaults.font.size = 11;            // ← mínimo DS
```

### Fase 3 — JS: funciones dependientes de clases

```js
// switchTab: cambiar '.tab' → '.av-tab'
function switchTab(t, el) {
  document.querySelectorAll('.av-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-' + t).classList.add('active');
}

// iecTab: cambiar '.vbtn' → '.av-sel--chip'
function iecTab(country, tab, btn) {
  ['vend','prod','cli'].forEach(t => {
    const el = document.getElementById('iec-' + country + '-' + t);
    if(el) el.style.display = t===tab ? '' : 'none';
  });
  const sel = document.getElementById('iec-sel-' + country);
  if(sel) sel.querySelectorAll('.av-sel--chip').forEach(b => b.classList.remove('active'));
  if(btn) btn.classList.add('active');
}

// Vendedor selector: cambiar 'vbtn' → 'av-sel--chip'
btn.className = 'av-sel--chip' + (i===0 ? ' active' : '');
document.querySelectorAll('.av-sel--chip').forEach(b => b.classList.remove('active'));
```

---

## PRUEBAS QUE DEBERÁN EJECUTARSE

### T-01 — Resolución de tokens CSS

Verificar que todas las variables CSS del DS se resuelven sin errores en DevTools.  
**Método:** DevTools → Elements → Computed → buscar `var(--*) not resolved`.

### T-02 — Invariancia de datos (crítico)

Para cada KPI del panel verificar que los valores exactos son idénticos antes y después de la migración:

- `jch-kpi-ytd-val` (Real 2026 YTD CLP)
- `jch-kpi-cumpl-val` (% Cumplimiento)
- `jch-kpi-ppto-val` (Presupuesto Anual)
- `jch-kpi-top-name` (Top Vendedor)
- Las 5 cifras del semáforo mensual (ENE–ABR)
- Los 4 valores de tarjetas CxC
- Los 5 valores de tarjetas IEC
- La tabla ranking vendedores

### T-03 — Selectores y tabs interactivos

Verificar que `switchTab`, `iecTab`, y el selector de vendedor funcionan correctamente con las nuevas clases DS.

- `switchTab('ventas', this)` activa `tab-ventas` ✓
- `switchTab('vendedores', this)` activa `tab-vendedores` ✓
- `switchTab('clientes', this)` activa `tab-clientes` ✓
- `switchTab('cxc', this)` activa `tab-cxc` ✓
- `iecTab('cl','vend',this)` muestra `iec-cl-vend`, oculta prod/cli ✓
- `iecTab('cl','prod',this)` muestra `iec-cl-prod` ✓
- `iecTab('cl','cli',this)` muestra `iec-cl-cli` ✓
- Selector de vendedor (8 botones) actualiza chart y cuadro ejecutivo ✓

### T-04 — Colores Chart.js desde AV_CHART_COLORS

Verificar en DevTools que `window.AV_CHART_COLORS` existe y que los 5 charts usan sus valores.

### T-05 — Emojis eliminados de UI

Búsqueda en DOM: `document.body.innerHTML.match(/[\u{1F300}-\u{1FFFF}]/gu)` debe retornar null o solo los de lógica JS interna.

### T-06 — Console errors = 0

DevTools → Console → recargar → sin errores rojos. Warnings aceptados si son de Chart.js deprecation.

### T-07 — Font-size ≥ 11px

DevTools → Elements → computed styles → ningún elemento visible con `font-size` < 11px.

### T-08 — Contraste WCAG AA

Revisar texto en `.av-text-muted` sobre `--surface` con herramienta de contraste. Mínimo 4.5:1.

### T-09 — Tamaños de pantalla

Verificar layout completo en 1280×800 y 1920×1080 sin overflow horizontal ni contenido cortado.

### T-10 — AVBOARD data load

Verificar que el AVBOARD guard no emite error banner, y que los KPIs se actualizan dinámicamente desde `AVBOARD.chile.ventas`.

---

## CONFIRMACIÓN DE INTEGRIDAD DEL ORIGINAL

```
Archivo original:  Panel_Jefes_Chile_2026.html
Backup:            Panel_Jefes_Chile_2026.html.bak_20260722
MD5 original:      dd70f73ee5a496056cfb43ffa28c2d64
MD5 backup:        dd70f73ee5a496056cfb43ffa28c2d64
Estado:            IDÉNTICOS — ninguna modificación realizada
```

**El archivo original permanece intacto. La migración NO ha comenzado.**

---

## DECISIONES REQUERIDAS ANTES DE INICIAR MIGRACIÓN

1. **R-001 — CSS residual ~49 líneas:** ¿Aceptar exceso con deuda v1.2 (Opción B) o agregar los 4 componentes al DS ahora (Opción A)?

2. **R-002 — `--orange`:** ¿Inline en residual (recomendado) o mapear a `--warning`?

3. **Scope accesibilidad:** ¿Agregar `scope="col"` a todos los `<th>` durante la migración o diferir?

Una vez resueltas las tres decisiones, la migración piloto puede comenzar.

---

*Reporte generado automáticamente por el sistema de auditoría AV LATAM BOARD.*  
*No modificar manualmente — regenerar si el archivo fuente cambia.*
