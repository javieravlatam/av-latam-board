# CHANGELOG — FORMATO JAVIER

Registro de versiones del design system corporativo AV LATAM.  
Convención: [Semver implícito] · Fecha ISO · Alcance · Archivos.

---

## v1.1 · 2026-07-21

### Alcance

Estándar corporativo oficial para TODAS las aplicaciones AV LATAM:
BOARD · SIC · CRM · Trading · Finanzas · Compras · Logística · RR.HH. · Mobile · Futuros desarrollos.

### Principios añadidos respecto a v1.0

1. Decisión antes que decoración — Executive UX Framework (4 preguntas)
2. Sistema de componentes ejecutivos (8 componentes)
3. Motion design accesible (`prefers-reduced-motion`)
4. Accesibilidad WCAG 2.1 AA (contraste, focus rings, sr-only)
5. Sistema de iconografía unificado (Phosphor Icons · Regular 1.5px)
6. Nomenclatura BEM estricta (`av-*__element.modifier`)

### Archivos creados

| Archivo | Propósito |
|---|---|
| `design-system/formato-javier-tokens.css` | Tokens CSS — 3 capas: primitivos / semánticos / modo claro |
| `design-system/formato-javier-base.css` | Reset mínimo · Google Fonts · Tipografía · Focus |
| `design-system/formato-javier-components.css` | Componentes core: panel, KPI, nav, tabs, selectores, tabla, badges, progress, delta, botones |
| `design-system/formato-javier-executive.css` | 8 componentes ejecutivos: exec-summary, insight, risk, opportunity, action, forecast, alert-banner, decision |
| `design-system/formato-javier-motion.css` | Timing vars · Easing curves · Transiciones por componente · `prefers-reduced-motion` |
| `design-system/formato-javier-utilities.css` | Grids (fijos y asimétricos) · Flex helpers · Spacing · `av-sr-only` |
| `design-system/formato-javier.css` | Entry point para bundlers (Vite/Rollup/Webpack) — no usar en HTML estático |
| `design-system/domains/formato-javier-board.css` | Domain override: `--domain-accent: #7AB648` para aplicación BOARD |
| `js/av-chart-colors.js` | `window.AV_CHART_COLORS`, `window.AV_CHART_SEQUENCES`, `window.AV_CHART_DEFAULTS()` |
| `FORMATO-JAVIER-COMPONENT-INVENTORY.md` | Inventario oficial de componentes |
| `CHANGELOG-FORMATO-JAVIER.md` | Este archivo |

### Cómo cargar el design system en HTML estático

```html
<!-- Cargar en este orden exacto — cada hoja en un <link> separado (HTTP/2 paralelo) -->
<link rel="stylesheet" href="../design-system/formato-javier-tokens.css">
<link rel="stylesheet" href="../design-system/formato-javier-base.css">
<link rel="stylesheet" href="../design-system/formato-javier-components.css">
<link rel="stylesheet" href="../design-system/formato-javier-executive.css">
<link rel="stylesheet" href="../design-system/formato-javier-motion.css">
<link rel="stylesheet" href="../design-system/formato-javier-utilities.css">
<!-- Domain override — cambiar según aplicación -->
<link rel="stylesheet" href="../design-system/domains/formato-javier-board.css">
<!-- Chart colors — antes que los scripts de panel -->
<script src="../js/av-chart-colors.js"></script>
```

### Reglas de gobernanza

- **CSS override limit:** máximo 25 líneas de CSS residual por panel. Si se supera, el sistema debe evolucionar (v1.2), nunca acumular overrides.
- **Emojis prohibidos:** usar exclusivamente Phosphor Icons (Regular, 1.5px).
- **Font size mínimo:** 11px en cualquier elemento visible.
- **Chart.js:** cargar una sola vez · sin `DOMContentLoaded` · sin `destroy()`.
- **Commits:** no hacer push sin aprobación explícita de Javier Almeida.
- **Modificaciones:** cualquier cambio al sistema se gestiona como v1.2, v1.3, etc.

### Validación de migración (por panel)

Criterios de aceptación (reemplazan cualquier comparación visual subjetiva):

1. Valores de datos exactamente iguales antes y después
2. Todas las funciones, filtros, selectores, tablas y gráficos preservados
3. Cero errores de consola · cero regresiones JavaScript
4. Cumplimiento completo con FORMATO JAVIER v1.1
5. Consistencia visual con otros paneles migrados
6. Validado a 1280×800 y 1920×1080

---

## v1.0 · [fecha previa]

Versión inicial — aplicación BOARD exclusivamente.  
Ver implementaciones en `/repo/*.html`.

---

_Las mejoras futuras se gestionan como v1.2, v1.3, etc.  
No modificar una versión ya aprobada y en producción._
