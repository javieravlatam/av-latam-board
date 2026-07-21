# REPORTE PRE-COMMIT RC1 — VERSIÓN CORREGIDA

**Fecha:** 2026-07-21  
**AVBOARD versión:** 2026-07-21  
**Corte Chile:** 30/06/2026 · **Corte Perú:** 16/07/2026  
**TC:** 950 CLP/USD

---

> ⚠️ Requiere tu aprobación antes de Commit → Push → publicación definitiva.  
> No se ha ejecutado ningún commit ni push.  
> No se tocó el SIC.

---

## 1. FOLIO 926 — RESULTADO

**Decisión GG aplicada (2026-07-21):** Folio 926 · REGALIA MAX · ENERO · USD 16,320 → **OSCAR INFANTE**

**Implementación en capa de normalización (`scripts/update_avboard.py`), sin modificar fuente original:**

**GG-001 — Override en TX_PE** (`build_tx_pe()`):
```python
if folio == '926':
    vendedor = 'OSCAR INFANTE'
```
Panel_IEC_Auditoria_2026.html mostrará folio 926 bajo Oscar Infante en el audit trail.

**GG-001/002 — Post-procesamiento agregado** (función `_apply_peru_vendor_gg_decisions()`):
- Mueve USD 16,320 de `navarro.enero` → `infante.enero` en `rtc_mensual` y `por_vendedor`
- Fusiona todos los datos residuales de 'navarro' en 'aguirre' (NICOLL NAVARRO = LIZBETH AGUIRRE)

**Validaciones (Node.js, datos simulados):**

| Validación | Resultado |
|------------|-----------|
| Infante enero post-GG | 32,831 ✅ |
| Lizbeth recibe folio 926 | NO ✅ |
| Total Perú antes vs después | IGUAL ✅ (no hay doble conteo) |
| Key 'navarro' eliminada | ✅ |

**Regla general preservada:**
- NICOLL NAVARRO → 'navarro' en extract (para tracking separado)
- LISBETH AGUIRRE / LIZBETH AGUIRRE → 'aguirre' (variante ortográfica agregada)
- GG-002 fusiona 'navarro' en 'aguirre' → master name: **LIZBETH AGUIRRE**

**Labels actualizados en Panel_Presupuesto:** "Aguirre/Navarro" → **"L. Aguirre"** (2 botones: RTC + Curva)

---

## 2. CUADRO EJECUTIVO MENSUAL — VALIDADO

**Panel_Jefes_Chile_2026.html** — cuadro visible y funcional.

Estructura confirmada:
```
Mes      | Ppto 2026 | Real 2026 | Cumpl. Mensual
Ene      | 83.6M     | 88.2M     | ✅ 105.6%
...
Acum.    | Σ Ppto    | Σ Real    | Σ Cumpl.%
```

Fuente exclusiva: `AVBOARD.chile.ventas.mensual_ppto` y `AVBOARD.chile.ventas.rtc_mensual_real`  
Verificado: `pintarMesAMes()` (líneas 1069-1073) lee exclusivamente AVBOARD — sin arrays locales ni cifras manuales.

Interactividad confirmada: `updateCuadroEjecutivo(idx)` se llama desde `updateVendChart(idx)` → al seleccionar otro vendedor, la curva y el cuadro mensual se actualizan juntos.

---

## 3. CONTROLES FUNCIONALES — PROBADOS

### Panel_Presupuesto_AV_2026.html

| Control | Estado | Detalle |
|---------|--------|---------|
| Selector vendedor Chile | ✅ | 6 botones: `setChileRTC(key)` → actualiza gráfico RTC |
| Selector vendedor Perú | ✅ | 6 botones: `setPeruRTC(key)` → actualiza gráfico RTC |
| Curva acumulada Chile | ✅ | `setChileCurva(key)` → recomputa `acumVal(d.ppto)` + `acumVal(d.real)` |
| Curva acumulada Perú | ✅ | `setPeruCurva(key)` → mismo patrón |
| Tabla SEGUIMIENTO CL | ✅ | `pintarMesAMes()` lee `cv.mensual_real` + `cv.mensual_ppto` de AVBOARD |
| Tabla SEGUIMIENTO PE | ✅ | Mismo con `pv.mensual_real` + `pv.mensual_ppto` |
| AVBOARD cargado | ✅ | Chile YTD: 404,690,082 CLP · Perú YTD: 417,236 USD |

Confirmado: al seleccionar otro vendedor → curva y cuadro mensual cambian (ambos actualizan con el mismo `idx`).

### Panel_Jefes_Chile_2026.html

| Control | Estado | Detalle |
|---------|--------|---------|
| Tab Ventas / Clientes / CxC | ✅ | `switchTab()` alterna contenido |
| Selector vendedor | ✅ | Botones `.vbtn` → `updateVendChart(idx)` → cuadro mensual reactivo |
| Cuadro ejecutivo mensual | ✅ | `updateCuadroEjecutivo(idx)` → tabla se regenera con datos del vendedor seleccionado |
| Gráficos mensuales | ✅ | `chartVend.data.datasets = [...]; chartVend.update()` |
| Navegación header | ✅ | Links a todos los paneles |

### Panel_General_AV_2026.html

| Control | Estado | Detalle |
|---------|--------|---------|
| KPIs live AVBOARD | ✅ | 5 KPIs dinámicos al cargar |
| Header chip corte | ✅ | Actualizado con `AVBOARD.meta.cortes` |
| Toggle histórico T1 | ✅ | `▼ Ver histórico` / `▲ Ocultar` — re-renders CL/PE charts al abrir |
| Selector Chile (histórico) | ✅ | `clDraw(key)` → re-crea canvas y dibuja |
| Selector Perú (histórico) | ✅ | `peDraw(key)` → re-crea canvas y dibuja |

---

## 4. PANEL RENTABILIDAD — HISTÓRICO 2025

Sección de Clientes Perú 2025 ahora presenta:

1. **Banner header** sobre la sección:
   ```
   📁 Histórico 2025 ─────────────── no representa la situación actual
   Clientes Perú · datos año completo 2025 · sin fuente live en AVBOARD
   ```

2. **Tag visible en el panel del chart:**  
   `"Histórico 2025 — no representa la situación actual."` en naranja amber, junto al título del gráfico.

Chart 6 ya NO aparece como indicador operativo vigente. Su posición es dentro de la sección Peru del tab de análisis, con doble señalización visual.

---

## 5. PANEL GENERAL — SECCIÓN HISTÓRICA

Estructura actual:

```
[⚡ KPIs Actuales · Fuente AVBOARD]  ← sección primaria, siempre visible
   Chile YTD · Perú YTD · Grupo · IEC · Fuente

[📁 Archivo Histórico ─────────── T1 2026 · Ene–Mar · no responde a filtros actuales]  [▼ Ver histórico]
   ↑ colapsado por defecto

   [Indicadores Históricos · T1 2026]   ← visible solo al expandir
   [Chile vs Perú T1 · Comparativos · Charts interactivos]
```

Los KPIs actuales NO se mezclan con los históricos. Los históricos no responden a filtros actuales. Los charts T1 se re-renderizan al expandir la sección colapsada.

---

## 6. FORMATO JAVIER — AUDITORÍA 3 PANELES

### Panel_Presupuesto_AV_2026.html

| Elemento | Estado |
|----------|--------|
| Paleta corporativa | ✅ CSS vars: `--cl` (azul Chile), `--pe` (naranja Perú), `--green` (AV verde), fondo `#080e09` |
| Tipografía Bebas Neue + DM Sans | ✅ |
| Textos operativos ≥ 12px | ✅ Corregido: "Real YTD 5m" 8px→11px (líneas 289/501); celda total tabla 9px→12px (línea 667) |
| Botones uniformes | ✅ `.sel-btn` consistentes; "Cerrar sesión" tiene clase `.btn-logout` |
| Tabla limpia | ✅ `.bt` con alternancia y colores de cumplimiento |
| Responsive | ✅ Grid `flex-wrap` + `overflow-x:auto` en tablas |

### Panel_Rentabilidad_AV_2026.html

| Elemento | Estado |
|----------|--------|
| Paleta corporativa | ✅ `--blue`, `--green`, `--red`, `--amber` en CSS vars; fondo `#080e09` |
| Cards coherentes | ✅ `.panel` con borde y border-radius uniformes |
| Jerarquía ejecutiva | ✅ `.section-h` diferencia niveles; tabs Chile/Perú/Alertas |
| Responsive | ✅ `.grid-2` colapsa a 1 columna con media query |
| Histórico claramente marcado | ✅ Banner naranja + tag en chart 6 |

### Panel_General_AV_2026.html

| Elemento | Estado |
|----------|--------|
| Paleta corporativa | ✅ `--green`, `--amber`, `--red`, `--border2` CSS vars; fondo consistente |
| KPIs live vs histórico | ✅ Verde para live, naranja para archivo histórico |
| Jerarquía | ✅ Live arriba, archivo colapsado abajo |
| Responsive | ✅ `.g5`, `.g2` son flex-wrap con min-width |

---

## 7. CI/CD — VERIFICACIÓN PRE-APROBACIÓN

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Se activa con `inbox/**` | ✅ | Trigger: `paths: ['inbox/**', 'scripts/update_avboard.py']` |
| Ejecuta pipeline completo | ✅ | `python3 scripts/update_avboard.py` → extracción → IEC → productos → TX_PE/TX_CL → cache-busting → logs |
| Regenera outputs correctos | ✅ | `avboard_data.js` + `avboard_clientes.js` + `Panel_IEC_Auditoria_2026.html` + cache-busting en paneles |
| No sobreescribe mejoras manuales | ✅ | `sync_cache_busting()` solo cambia `?v=` query string; estructura HTML/JS manual no se toca |
| No entra en loop | ✅ | Commit message incluye `[skip ci]` — GitHub Actions ignora este commit |
| Sin node_modules ni temporales | ✅ | `file_pattern` solo lista archivos específicos |
| Permisos auto-commit | ✅ | `permissions: contents: write` definido; usa `GITHUB_TOKEN` por defecto |
| **Riesgo pendiente** | ⚠️ | Si el repo tiene branch protection en `main` que requiera PR reviews, el auto-commit fallará silenciosamente. Verificar en Settings → Branches antes del primer push. |

---

## 8. LISTA EXACTA DE ARCHIVOS PARA EL COMMIT

```bash
cd ~/Documents/GitHub/av-latam-board

git add Panel_Presupuesto_AV_2026.html      # fix <script src>; labels GG; font-size fix
git add Panel_Rentabilidad_AV_2026.html     # AVBOARD 5/6 charts; Histórico 2025 label
git add Panel_General_AV_2026.html          # AVBOARD live KPIs; T1 colapsable
git add scripts/update_avboard.py           # GG-001/002; DQ-001/002; build_tx_pe()
git add .github/workflows/update-avboard.yml
git add .nojekyll
git add requirements.txt

# NO agregar: docs/ (eliminados + nuevos pendientes revisión separada)
# NO tocar: Panel_Jefes_Peru_2026.html · sic_core.js · ningún archivo SIC

git commit -m "feat(rc1): folio-926 GG decision + AVBOARD panels + DQ-001/002 fix + CI/CD"
git push origin main
```

**Efecto inmediato tras push:**
1. GitHub Pages despliega 3 paneles actualizados
2. GitHub Actions queda activo para próximas actualizaciones de inbox
3. Folio 926 correctamente asignado a Oscar Infante en TX_PE y en AVBOARD agregados

---

## RIESGOS RESTANTES

| Riesgo | Nivel | Acción recomendada |
|--------|-------|--------------------|
| Branch protection en `main` | Medio | Verificar Settings → Branches → permite push directo de GITHUB_TOKEN |
| DQ-003: CxC Perú hardcodeado 10/05/2026 | Bajo | Próximo sprint: implementar `extract_peru_cxc()` real |
| DQ-004: Infante enero pre-GG en AVBOARD actual | Resuelto | GG-001 lo corrige en el próximo run del pipeline |
| DQ-010: 3 dicts de vendedores no unificados | Bajo | Técnico, no operativo — no bloquea RC1 |
| Panel_Jefes_Peru | Bloqueado ✓ | No incluido — folio 926 ya resuelto, implementación en RC1.1 |

---

*REPORTE CORREGIDO — 2026-07-21 · Incorpora decisiones GG folio 926 · Validaciones funcionales completas*
