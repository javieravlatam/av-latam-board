# AVBOARD — Arquitectura Master del Ecosistema
**Agroveca Grupo LATAM · Inteligencia Comercial 2026**
Versión: 1.0 · Fecha: 2026-05-15 · Mantenido por: Claude (Anthropic) vía Cowork

---

## 1. Visión General

AVBOARD es el sistema de inteligencia comercial de Agroveca Grupo LATAM. Es un ecosistema de dashboards HTML estáticos, archivos de datos JavaScript y módulos Excel, integrado y mantenido por Claude en modo automatizado.

**Principio central:** todo el ecosistema vive en archivos locales. No hay servidor, no hay base de datos, no hay API. Los datos se inyectan directamente en los HTMLs como variables JavaScript o se exponen como archivos `.js` compartidos.

---

## 2. Estructura de Carpetas

```
avboard/
├── inbox/          ← Archivos fuente que llegan del equipo (xlsx, csv)
│   ├── Libro de Ventas *.xlsx          — ventas Chile
│   ├── AGROVECA PERU VENTAS *.xlsx     — ventas Perú
│   ├── Cuentas Cobrar *.xlsx           — CxC Chile (2 entidades)
│   ├── AGROVECA CxC *.xlsx             — CxC Perú
│   ├── precios piso CHile .xlsx        — tabla precios mínimos Chile
│   └── precio piso peru.xlsx           — tabla precios mínimos Perú
│
├── repo/           ← Dashboards HTML y archivos de datos
│   ├── dashboard.html                  — ENTRADA PRINCIPAL (menú)
│   ├── index.html                      — portada antigua (no usar)
│   ├── avboard_data.js                 — capa de datos global consolidada
│   ├── avboard_clientes.js             — motor CRM 193 clientes
│   ├── Panel_IEC_Auditoria_2026.html   — motor IEC transaccional (TX_CL + TX_PE)
│   ├── Panel_Clientes_AV_2026.html     — CRM ejecutivo 193 clientes
│   ├── Panel_CxC_AV_Latam_2026.html    — cuentas por cobrar LATAM
│   ├── Panel_Chile_AV_2026.html        — ventas Chile detallado
│   ├── Panel_Peru_AV_2026.html         — ventas Perú detallado
│   ├── Panel_Presupuesto_AV_2026.html  — seguimiento presupuesto
│   ├── Panel_Productos_AV_2026.html    — análisis productos (estático)
│   ├── Panel_Rentabilidad_AV_2026.html — rentabilidad y pricing
│   ├── Panel_Jefes_Index.html          — directorio para jefes de país
│   ├── Panel_Jefes_Chile_2026.html     — panel jefe Chile
│   ├── Panel_Jefes_Peru_2026.html      — panel jefe Perú
│   ├── Panel_Jefes_Grupo_AV_2026.html  — panel gerencia grupo
│   ├── Dashboard_Comercial_AV_Latam_2026.html — resumen ejecutivo
│   ├── Executive_Board_View_AV_Latam_2026.html — vista directorio
│   ├── modulo_cxc_2026.xlsx            — modelo CxC Excel
│   ├── modulo_productos_2026.xlsx      — análisis productos Excel
│   ├── modulo_rentabilidad_pricing.xlsx — modelo rentabilidad Excel
│   └── productos_consolidado.xlsx      — catálogo productos
│
├── logs/           ← Trazabilidad del sistema (append-only)
│   ├── update_log.txt          — registro cronológico de todas las actualizaciones
│   ├── resumen_actualizacion.md — resúmenes ejecutivos por corte
│   ├── alertas.md              — alertas activas del sistema
│   ├── diagnostico_panel_clientes.md — auditoría Panel Clientes
│   └── panel_update_map.md     — mapa de qué campos actualiza cada panel
│
└── docs/           ← Documentación del ecosistema (esta carpeta)
    ├── AVBOARD_MASTER_ARCHITECTURE.md   ← este archivo
    ├── AVBOARD_UPDATE_PROTOCOL.md
    └── AVBOARD_BUSINESS_RULES.md
```

---

## 3. Inventario de Paneles

### 3.1 Punto de entrada

| Archivo | Rol | Audiencia |
|---|---|---|
| `dashboard.html` | Menú principal con cards a todos los paneles | Todos |

### 3.2 Paneles operativos (datos vivos)

| Panel | Fuente de datos | Descripción |
|---|---|---|
| `Panel_IEC_Auditoria_2026.html` | TX_CL + TX_PE embebidos | Motor IEC transaccional. 773 tx Chile + 92 tx Perú. Tabs: vendedores, productos, clientes, transacciones, heatmap, cobertura, radiografía vendedor |
| `Panel_Clientes_AV_2026.html` | `avboard_clientes.js` | CRM ejecutivo. 151 clientes Chile + 42 Perú. Score, IEC, CxC, evolución mensual, recomendaciones automáticas |
| `Panel_CxC_AV_Latam_2026.html` | `avboard_data.js` | Cuentas por cobrar consolidadas. CLP + USD. Aging, mora crítica, por cliente |
| `Panel_Chile_AV_2026.html` | `avboard_data.js` | Ventas Chile por RTC, mensual, vs presupuesto, IEC resumen |
| `Panel_Peru_AV_2026.html` | `avboard_data.js` | Ventas Perú por RTC, mensual, IEC resumen |
| `Panel_Presupuesto_AV_2026.html` | `avboard_data.js` | Seguimiento de presupuesto mensual Chile y Perú |

### 3.3 Paneles ejecutivos (datos consolidados)

| Panel | Fuente de datos | Descripción |
|---|---|---|
| `Dashboard_Comercial_AV_Latam_2026.html` | `avboard_data.js` | Resumen ejecutivo LATAM: KPIs grupo, por país |
| `Executive_Board_View_AV_Latam_2026.html` | `avboard_data.js` | Vista directorio. CEO P&L, diagnóstico Perú, tendencias |
| `Panel_Jefes_Index.html` | Estático (links) | Directorio de paneles para jefes de país |
| `Panel_Jefes_Chile_2026.html` | `avboard_data.js` | Panel jefe Chile: ventas, IEC, CxC, vendedores |
| `Panel_Jefes_Peru_2026.html` | `avboard_data.js` | Panel jefe Perú: ventas, IEC, CxC, vendedores |
| `Panel_Jefes_Grupo_AV_2026.html` | `avboard_data.js` | Panel gerencia grupo: consolidado LATAM |

### 3.4 Paneles analíticos (datos semipermanentes)

| Panel | Fuente de datos | Descripción |
|---|---|---|
| `Panel_Productos_AV_2026.html` | Datos embebidos estáticos | Catálogo y análisis de productos (no se actualiza en cada corte) |
| `Panel_Rentabilidad_AV_2026.html` | `modulo_rentabilidad_pricing.xlsx` | Rentabilidad por SKU, costo fábrica, pricing. Requiere re-generación manual |

---

## 4. Capas de Datos

### 4.1 `avboard_data.js` — Capa Global

Es la **fuente única de verdad** para todos los paneles ejecutivos y operativos (excepto IEC y Clientes). Se carga como `<script src="avboard_data.js">` y expone `window.AVBOARD` con el objeto completo.

**Estructura interna:**

```
AVBOARD
├── meta          — versión, tipo de cambio, fechas de corte, meses
├── grupo         — YTD LATAM consolidado, distribución por país
├── chile_ventas  — YTD, mensual real, mensual ppto, por RTC, IEC resumen
├── chile_cxc     — total, vencida, al día, por entidad (Agrocomercial + Agroveca)
├── peru_ventas   — YTD, mensual real, mensual ppto, por RTC, IEC resumen
├── peru_cxc      — total, saldos, por cliente
└── [.get()]      — métodos de acceso: AVBOARD.get('chile_ventas'), etc.
```

**Secciones IEC en avboard_data.js:**

```javascript
chile_ventas.iec = {
  total:     0.360,   // IEC global Chile
  velasquez: 0.133,
  laratro:   0.398,
  caroca:    0.620,
  encina:    0.316,
  veverka:   0.780,
  munoz:     0.495,
  impacto_potencial_clp: 149791772
}
```

**Regla crítica:** este archivo NO se edita manualmente. Solo Claude lo actualiza con datos validados. Al actualizar, siempre reemplazar la sección completa del corte.

---

### 4.2 `avboard_clientes.js` — Motor CRM

Expone dos arrays globales: `CLIENTES_CL` (151 clientes Chile) y `CLIENTES_PE` (42 clientes Perú).

**Versión actual:** v1.2 — precios piso Chile actualizados 15/05/2026.

**Estructura de cada cliente:**

```javascript
{
  id:       "cl_762092301",    // hash basado en RUT/RUC
  nombre:   "AGRICOLA X",
  rut:      "76.209.230-1",
  pais:     "CL",              // o "PE"
  region:   "SEXTA",
  vendedor: "PABLO LARATRO",
  moneda:   "CLP",             // o "USD"

  ventas: {
    ytd:          72188000,
    mensual:      { ENERO: ..., FEBRERO: ..., ... },
    n_tx:         30,
    n_docs:       4,
    meses_activos: 3,
    frecuencia:   0.6,         // meses_activos / 5
    ticket_prom:  18047000,
    tendencia:    "creciente", // "creciente" | "estable" | "decreciente"
    tendencia_pct: 500         // capped ±500%
  },

  iec: {
    pct:            0.1147,   // IEC del cliente (0–1)
    factor:         0.2,      // factor comisión aplicable (0.2|0.7|0.8|0.9|1.05)
    tx_elegible:    28,
    tx_cumple:      4,
    monto_elegible: 59980000,
    monto_bajo_piso: 53100000
  },

  cxc: {
    saldo:    15981700,
    max_mora: -22,            // días de mora (negativo = adelantado)
    tramo:    "0-30",
    estado:   "Normal"        // "Normal"|"Alerta"|"Mora"|"Crítico"
  },

  productos: {
    top: [{ prod, monto, pct }, ...]  // top 5 productos del cliente
  },

  // Scores (0–100 cada uno)
  score:      38.5,    // Score total ponderado
  iec_score:  8.2,     // IEC convertido a 0–100
  freq_score: 60.0,    // Frecuencia convertida a 0–100
  cxc_score:  62.5,    // CxC convertida a 0–100
  div_score:  40.0,    // Diversificación convertida a 0–100
  vol_score:  25.0,    // Volumen convertido a 0–100

  estado:  "riesgo",   // semáforo: "ok"|"oportunidad"|"alerta"|"riesgo"|"critico"|"sin_datos"
  insight: "..."       // texto ejecutivo automático
}
```

**Clientes con IEC null:** 47 Chile + 21 Perú sin precio piso mapeado. Score calculado con IEC neutro = 50 para esos clientes.

---

### 4.3 TX_CL y TX_PE — Transacciones IEC Embebidas

Viven directamente en `Panel_IEC_Auditoria_2026.html` como variables `const TX_CL = [...]` y `const TX_PE = [...]`.

**Estructura de cada transacción:**

```javascript
{
  mes:          "ENERO",
  fecha:        "2026-01-02",
  folio:        "395",
  doc:          "Factura Electrónica",
  cliente:      "FRUTICOLA RIO BLANCO SPA",
  vendedor:     "PABLO LARATRO",
  producto:     "AV MOVE",            // nombre canónico normalizado
  formato:      "20 L",               // formato normalizado
  producto_orig: "VECA MOVE - 20 L", // nombre original del sistema contable
  total:        1300000,              // monto total de la línea (CLP o USD)
  pv:           6500.0,               // precio de venta unitario
  pp:           7500.0,               // precio piso (null si no elegible)
  elegible:     true,                 // tiene precio piso definido
  sp:           0,                    // monto sobre piso (= total si cumple, 0 si no)
  bp:           1300000,              // monto bajo piso (= total si no cumple, 0 si sí)
  cumple:       false                 // pv >= pp
}
```

**Volumen actual:**
- TX_CL: 773 transacciones (Chile, Ene–May 2026)
- TX_PE: 92 transacciones (Perú, Ene–May 2026)

**Regla crítica:** TX_PE NUNCA se modifica cuando se actualiza precio piso Chile. Son datos y fuentes independientes.

---

## 5. Navegación y Dependencias

### 5.1 Mapa de navegación

```
dashboard.html (menú principal)
├── Panel_IEC_Auditoria_2026.html
├── Panel_Clientes_AV_2026.html
├── Panel_CxC_AV_Latam_2026.html
├── Panel_Chile_AV_2026.html
├── Panel_Peru_AV_2026.html
├── Panel_Presupuesto_AV_2026.html
├── Panel_Productos_AV_2026.html
├── Panel_Rentabilidad_AV_2026.html
├── Panel_Jefes_Index.html
│   ├── Panel_Jefes_Chile_2026.html
│   │   └── → Panel_IEC_Auditoria_2026.html (link directo)
│   ├── Panel_Jefes_Peru_2026.html
│   │   └── → Panel_IEC_Auditoria_2026.html (link directo)
│   └── Panel_Jefes_Grupo_AV_2026.html
├── Dashboard_Comercial_AV_Latam_2026.html
└── Executive_Board_View_AV_Latam_2026.html
```

### 5.2 Dependencias de datos

```
inbox/Libro de Ventas *.xlsx
    └──► procesar con Python ──► TX_CL en Panel_IEC_Auditoria_2026.html
                              └──► CLIENTES_CL en avboard_clientes.js
                              └──► chile_ventas en avboard_data.js

inbox/precios piso CHile .xlsx
    └──► cruzar con TX_CL ──► recalcular IEC por tx
                           └──► recalcular IEC por cliente en avboard_clientes.js
                           └──► recalcular IEC resumen en avboard_data.js

inbox/AGROVECA PERU VENTAS *.xlsx
    └──► procesar con Python ──► TX_PE en Panel_IEC_Auditoria_2026.html
                              └──► CLIENTES_PE en avboard_clientes.js
                              └──► peru_ventas en avboard_data.js

inbox/Cuentas Cobrar *.xlsx (2 archivos Chile)
    └──► procesar con Python ──► chile_cxc en avboard_data.js
                              └──► cxc por cliente en avboard_clientes.js

avboard_data.js
    └──► usado por: todos los paneles ejecutivos y operativos (salvo Panel_IEC y Panel_Clientes)

avboard_clientes.js
    └──► usado solo por: Panel_Clientes_AV_2026.html
```

---

## 6. Autenticación

Todos los paneles ejecutivos y operativos incluyen un guard de acceso en JavaScript:

```javascript
// Al inicio de cada panel sensible:
if (sessionStorage.getItem('av_auth') !==
    '7cd4374e16e78510de24a08115c3b44f6d0d72762d41054e6ef8fa0cb5e0c45b') {
  window.location.href = 'dashboard.html';
}
```

La clave se setea en `dashboard.html` cuando el usuario ingresa la contraseña correcta. La sesión dura mientras el navegador esté abierto.

---

## 7. Reglas Técnicas Críticas

Estas reglas NO deben violarse nunca:

1. **Chart.js se carga una sola vez** por archivo. No duplicar el `<script src>`.
2. **No usar `destroy()`** en charts. El patrón correcto es: si el chart existe, hacer `.update('none')`; si no existe, crear con `new Chart(...)`.
3. **No usar `DOMContentLoaded`**. Todo el código de inicialización va al final del `<script>`, inline.
4. **No romper dashboards existentes** al agregar nuevas funcionalidades. Solo agregar, nunca modificar lo que ya funciona.
5. **TX_PE es independiente de TX_CL**. Nunca modificar TX_PE al actualizar precios piso Chile, ni viceversa.
6. **Los logs son append-only**. Nunca sobrescribir `update_log.txt` ni `alertas.md`. Solo agregar entradas.
7. **avboard_data.js no se edita manualmente**. Solo Claude lo actualiza en cortes oficiales.
8. **El precio piso Chile y Perú son tablas separadas**. Tienen fuentes de datos diferentes y ciclos de actualización independientes.

---

## 8. Estado Actual del Sistema (15/05/2026)

| Componente | Corte | Estado |
|---|---|---|
| Ventas Chile | 11/05/2026 (May parcial) | ✅ Activo |
| Ventas Perú | 11/05/2026 (May parcial) | ✅ Activo |
| CxC Chile | 08/05/2026 | ✅ Activo |
| CxC Perú | 10/05/2026 | ✅ Activo |
| Precios piso Chile | 14/05/2026 | ✅ Actualizado |
| Precios piso Perú | Sin cambios desde inicio | ✅ Vigente |
| Panel IEC | TX_CL v2 (15/05) | ✅ Activo |
| Panel Clientes | v1.2 (15/05) | ✅ Activo |
| avboard_data.js | 2026-05-12 + IEC 15/05 | ✅ Activo |

---

## 9. Claves de Identificación

| Entidad | Identificador | Formato |
|---|---|---|
| Cliente Chile | `cl_{rut_sin_puntos_sin_guion}` | `cl_762092301` |
| Cliente Perú | `pe_{ruc}` | `pe_20123456789` |
| Vendedor Chile | apellido en minúscula | `laratro`, `veverka` |
| Vendedor Perú | nombre completo en data | `RODRIGUEZ GUZMAN` |

---

*Documento generado automáticamente por Claude · Agroveca AVBOARD 2026*
