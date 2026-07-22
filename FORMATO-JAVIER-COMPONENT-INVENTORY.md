# FORMATO JAVIER — Inventario de Componentes

**Versión del sistema:** v1.1  
**Fecha:** 2026-07-21  
**Estándar:** AV LATAM Design System · Estándar Oficial  
**Nomenclatura:** BEM · Prefijo `av-`

Este es el catálogo oficial. Ningún componente nuevo debe implementarse en un panel antes de estar registrado aquí.

---

## CATEGORÍA: CORE

Componentes de uso universal. Presentes en todos los paneles AV LATAM.

---

### av-panel

| Campo | Valor |
|---|---|
| **Categoría** | Core |
| **Propósito** | Contenedor principal de secciones de datos. Unidad visual base del sistema. |
| **Archivo** | `formato-javier-components.css` |
| **Aplicaciones** | BOARD · SIC · CRM · Finanzas · todas |

**Variantes:**  
`.av-panel` — base · `.av-panel__header` — cabecera · `.av-panel__title` — título · `.av-panel__subtitle` — subtítulo

**Dependencias:** `--surface`, `--border`, `--panel-radius`, `--panel-padding`

**Ejemplo:**
```html
<div class="av-panel">
  <div class="av-panel__header">
    <h2 class="av-panel__title">Ventas Netas</h2>
    <span class="av-panel__subtitle">Mes actual</span>
  </div>
  <!-- contenido -->
</div>
```

---

### av-kpi-xl

| Campo | Valor |
|---|---|
| **Categoría** | Core |
| **Propósito** | KPI hero — la cifra más importante del panel. Zona 1. Máximo 1-2 por vista. |
| **Archivo** | `formato-javier-components.css` |
| **Aplicaciones** | BOARD · SIC · CRM · Finanzas · todas |

**Variantes semánticas:** `.av-ok` · `.av-warn` · `.av-alert`  
**Elementos:** `__val` (Bebas Neue 56px) · `__label` · `__sub` · `__badge`

**Dependencias:** `--font-display`, `--domain-accent`, `--surface`

---

### av-kpi-lg

| Campo | Valor |
|---|---|
| **Categoría** | Core |
| **Propósito** | KPI de segundo nivel. Filas de métricas clave. |
| **Archivo** | `formato-javier-components.css` |
| **Aplicaciones** | BOARD · SIC · CRM · Finanzas · todas |

**Variantes semánticas:** `.av-ok` · `.av-warn` · `.av-alert`  
**Elementos:** `__val` (Bebas Neue 40px) · `__label` · `__sub`

---

### av-kpi-sm

| Campo | Valor |
|---|---|
| **Categoría** | Core |
| **Propósito** | KPI compacto para tablas de resumen, sidebars y grids densos. |
| **Archivo** | `formato-javier-components.css` |
| **Aplicaciones** | BOARD · SIC · CRM · Finanzas · todas |

**Variantes semánticas:** `.av-ok` · `.av-warn` · `.av-alert`  
**Elementos:** `__val` (Bebas Neue 22px) · `__label`

---

### av-kpi-inline

| Campo | Valor |
|---|---|
| **Categoría** | Core |
| **Propósito** | KPI horizontal — label a la izquierda, valor a la derecha. Para listas de métricas. |
| **Archivo** | `formato-javier-components.css` |
| **Aplicaciones** | BOARD · SIC · todas |

**Elementos:** `__label` · `__val`

---

### av-nav

| Campo | Valor |
|---|---|
| **Categoría** | Core |
| **Propósito** | Barra de navegación principal de cada aplicación. |
| **Archivo** | `formato-javier-components.css` |
| **Aplicaciones** | Todas — uno por aplicación |

**Elementos:** `__brand` · `__logo` · `__title` · `__links`  
**Dependencias:** `--surface`, `--domain-accent`

---

### av-nav-item

| Campo | Valor |
|---|---|
| **Categoría** | Core |
| **Propósito** | Ítem de navegación dentro de av-nav. Estados: default / hover / active. |
| **Archivo** | `formato-javier-components.css` |
| **Aplicaciones** | Todas |

**Modificadores:** `.active`

---

### av-nav-tabs · av-tab

| Campo | Valor |
|---|---|
| **Categoría** | Core |
| **Propósito** | Tabs de navegación secundaria dentro de un panel. |
| **Archivo** | `formato-javier-components.css` |
| **Aplicaciones** | BOARD · SIC · todas |

**Modificadores de av-tab:** `.active`

---

### av-sel--pill · av-sel--chip · av-sel--tab

| Campo | Valor |
|---|---|
| **Categoría** | Core |
| **Propósito** | Selectores interactivos: filtros de período, categoría, vendedor, etc. |
| **Archivo** | `formato-javier-components.css` |
| **Aplicaciones** | BOARD · SIC · CRM |

**Variantes de forma:**  
`.av-sel--pill` (border-radius 20px, suave) · `.av-sel--chip` (radius 4px, compacto) · `.av-sel--tab` (sin radius, tab plano)  
**Contenedor:** `.av-sel-group`  
**Estados:** `.active`

---

### av-table

| Campo | Valor |
|---|---|
| **Categoría** | Core |
| **Propósito** | Tabla de datos ejecutivos. Zona 3 — responde ¿Por qué cambió? |
| **Archivo** | `formato-javier-components.css` |
| **Aplicaciones** | Todas |

**Modificadores de celda:** `.num` (mono, right-align) · `.name` (semibold) · `.muted`

---

### av-badge · av-badge-dot

| Campo | Valor |
|---|---|
| **Categoría** | Core |
| **Propósito** | Etiqueta de estado semántico. No usar para categorías sin valor de estado. |
| **Archivo** | `formato-javier-components.css` |
| **Aplicaciones** | Todas |

**Modificadores:** `.ok` · `.warn` · `.alert` · `.info` · `.neutral`

---

### av-progress-wrap · av-progress-fill

| Campo | Valor |
|---|---|
| **Categoría** | Core |
| **Propósito** | Barra de progreso para % de cumplimiento de presupuesto o meta. |
| **Archivo** | `formato-javier-components.css` |
| **Aplicaciones** | BOARD · SIC · todas |

**Elementos de fila:** `.av-progress-row` · `.av-progress-label` · `.av-progress-pct`  
**Modificadores de fill:** `.ok` · `.warn` · `.alert`

---

### av-delta-chip

| Campo | Valor |
|---|---|
| **Categoría** | Core |
| **Propósito** | Chip de variación vs período anterior o presupuesto. Zona 2 — ¿Qué cambió? |
| **Archivo** | `formato-javier-components.css` |
| **Aplicaciones** | Todas |

**Elementos:** `__label` · `__val`  
**Modificadores:** `.ok` · `.warn` · `.alert` · `.info`  
**Contenedor de fila:** `.av-delta-row`

---

### av-btn

| Campo | Valor |
|---|---|
| **Categoría** | Core |
| **Propósito** | Botón de acción. Usar exclusivamente para acciones con efecto, no para navegación. |
| **Archivo** | `formato-javier-components.css` |
| **Aplicaciones** | Todas |

**Modificadores:** `.primary` · `.danger`

---

## CATEGORÍA: EXECUTIVE

Componentes del Executive UX Framework. Implementan el modelo de 4 preguntas.

---

### av-exec-summary

| Campo | Valor |
|---|---|
| **Categoría** | Executive |
| **Propósito** | Grid de resumen ejecutivo. Zona 1. Exactamente 1 por vista. |
| **Archivo** | `formato-javier-executive.css` |
| **Aplicaciones** | Todas — en posición top de panel principal |

**Dependencias:** debe contener av-kpi-* como hijos directos

---

### av-insight

| Campo | Valor |
|---|---|
| **Categoría** | Executive |
| **Propósito** | Hallazgo analítico no urgente. Zona 2-3. Patrón detectado que merece atención. |
| **Archivo** | `formato-javier-executive.css` |
| **Aplicaciones** | BOARD · SIC · CRM · Analytics |

**Elementos:** `__title` · `__body`  
**Color semántico:** info (azul)  
**NO usar para:** alertas activas, acciones requeridas, riesgos operativos

---

### av-risk

| Campo | Valor |
|---|---|
| **Categoría** | Executive |
| **Propósito** | Riesgo activo identificado. Zona 4. Requiere objeto + magnitud + status. |
| **Archivo** | `formato-javier-executive.css` |
| **Aplicaciones** | Todas |

**Elementos:** `__header` · `__title` · `__body`  
**Color semántico:** danger (rojo)  
**NO usar para:** hipótesis, proyecciones sin datos, riesgos sin evidencia

---

### av-opportunity

| Campo | Valor |
|---|---|
| **Categoría** | Executive |
| **Propósito** | Upside cuantificable y accionable en el período actual. Zona 4. |
| **Archivo** | `formato-javier-executive.css` |
| **Aplicaciones** | BOARD · SIC · CRM · Ventas |

**Elementos:** `__title` · `__body`  
**Color semántico:** positive (verde)  
**NO usar para:** análisis largo plazo, proyecciones sin datos históricos

---

### av-action

| Campo | Valor |
|---|---|
| **Categoría** | Executive |
| **Propósito** | Acción ejecutiva recomendada. Zona 4. El componente de mayor impacto del sistema. |
| **Archivo** | `formato-javier-executive.css` |
| **Aplicaciones** | Todas |

**Elementos:** `__title` · `__meta`  
**Color semántico:** warning (ámbar)  
**OBLIGATORIO:** acción específica + responsable + plazo + impacto esperado.  
Si falta alguno: usar `av-insight` o `av-risk` en su lugar.

---

### av-forecast

| Campo | Valor |
|---|---|
| **Categoría** | Executive |
| **Propósito** | Proyección de cierre de período. Zona 1-2. Complementa, nunca reemplaza al KPI real. |
| **Archivo** | `formato-javier-executive.css` |
| **Aplicaciones** | BOARD · SIC · Finanzas |

**Elementos:** `__label` · `__val` (Bebas Neue 40px) · `__delta` · `__confidence`  
**OBLIGATORIO:** indicador de confianza visible (porcentaje o rango)  
**NO usar:** sin intervalo de confianza, como KPI hero principal

---

### av-alert-banner

| Campo | Valor |
|---|---|
| **Categoría** | Executive |
| **Propósito** | Alerta crítica de ancho completo. Máximo 2 visibles simultáneamente. |
| **Archivo** | `formato-javier-executive.css` |
| **Aplicaciones** | Todas |

**Modificadores:** `.alert` · `.warn` · `.info` · `.ok`  
**Elementos:** `__dot` · `__text` · `__tag`  
**Regla de límite:** si hay más de 2 alertas activas, mostrar banner de resumen con link

---

### av-decision

| Campo | Valor |
|---|---|
| **Categoría** | Executive |
| **Propósito** | Tarjeta de decisión para módulos de aprobación. Compras, Finanzas, RR.HH. |
| **Archivo** | `formato-javier-executive.css` |
| **Aplicaciones** | Finanzas · Compras · RR.HH. · futuras apps transaccionales |

**Elementos:** `__title` · `__body` · `__actions` · `__btn`  
**Modificadores de btn:** `.primary` · `.danger`

---

## CATEGORÍA: DOMAIN

Archivos de override por aplicación. Un archivo por dominio.

---

### formato-javier-board.css

| Campo | Valor |
|---|---|
| **Categoría** | Domain |
| **Propósito** | Override de `--domain-accent` para la aplicación BOARD. |
| **Archivo** | `design-system/domains/formato-javier-board.css` |
| **Acento** | `#7AB648` — verde AV |

---

## REGLAS DE USO

1. **No crear componentes fuera de este inventario.** Si se necesita uno nuevo, registrarlo aquí primero y gestionarlo como v1.2.
2. **No modificar archivos del design system en una migración de panel.** Las limitaciones se resuelven en versiones futuras.
3. **Override limit:** máximo 25 líneas de CSS panel-específico. Si se supera, escalar a nueva versión.
4. **Emojis prohibidos** en todos los componentes. Usar Phosphor Icons (Regular, 1.5px).
5. **Font size mínimo:** 11px en cualquier elemento visible.
