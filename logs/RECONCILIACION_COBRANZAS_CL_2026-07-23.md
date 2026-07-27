# RECONCILIACIÓN SIC-CHILE — COBRANZAS REALES
## SIC-AV v1.7 Fase 2 — Integración Fecha Pago Fct.

**Fecha:** 2026-07-23  
**Estado:** 🟢 INTEGRACIÓN COMPLETA — PENDIENTE APROBACIÓN COMMIT  
**Elaborado por:** Sistema AV LATAM Executive Intelligence

---

## RESULTADO PRINCIPAL

> **TOTAL COBRADO DEMOSTRABLE (año 2026): CLP 130,309,303**
>
> Verificado como: Σ montos de 285 documentos únicos Chile/AV con `Fecha Pago Fct.` válida (PAGADA + PAGADA_ABONOS), sin doble conteo, sin inventar cifras.

---

## FUENTES

| ID | Archivo | Rol |
|----|---------|-----|
| **F2** | `Libro de Ventas 20-07-2026.xlsx` | **Autoridad de cobranza** — contiene `Fecha Pago Fct.` |
| **F1** | `Ventas Julio GRUPO AV LATAM.xlsx` | Validación cruzada de folios julio |

---

## ÍTEM 1 — Total documentos únicos F2

**487 documentos** Chile/AV identificados en el Libro de Ventas 2026.  
Rango de folios: 63 a 754 (no secuencial; incluye años anteriores parcialmente).

---

## ÍTEM 2 — Documentos reconciliados F1 ∩ F2

**487/487 folios coinciden** entre F1 y F2.  
Todos los folios del archivo comercial julio están contenidos en el Libro de Ventas anual.  
(F1 es un subconjunto de F2 — ambas fuentes cubren el mismo universo de documentos.)

---

## ÍTEM 3 — Documentos no reconciliados

**2 documentos** con diferencia de monto entre fuentes:

| Folio | Monto F1 | Monto F2 | Decisión |
|-------|----------|----------|----------|
| 739 | CLP 0 | CLP 1,323,000 | F2 es autoritativo |
| 740 | CLP 0 | CLP 1,520,000 | F2 es autoritativo |

F2 (Libro de Ventas oficial) es la fuente autorizada para montos. F1 probablemente registró estas facturas con monto 0 por un error de captura o ausencia de línea de detalle.

---

## ÍTEM 4 — Documentos con Fecha Pago Fct. válida

**285 documentos** — desglose:

| Tipo | Cantidad |
|------|----------|
| PAGADA | 274 |
| PAGADA_ABONOS | 11 |
| **Total** | **285** |

**Folios con impacto en ciclo julio 2026** (ventana 2026-06-26 → 2026-07-25):

| Folio | Tipo | Fecha Pago | Monto (CLP) | Relevancia SIC |
|-------|------|-----------|-------------|----------------|
| 718 | PAGADA | 2026-07-15 | 160,000 | VELASQUEZ — factura junio, mes_desempeno=junio ✅ |
| 731 | PAGADA_ABONOS | 2026-07-04 | 224,000 | VELASQUEZ — folio julio ✅ |
| 738 | PAGADA | 2026-07-14 | 160,000 | VELASQUEZ — folio julio ✅ |
| 749 | PAGADA | 2026-07-20 | 0 | Folio julio, monto=0 |
| 752 | PAGADA | 2026-07-21 | 0 | Folio julio, monto=0 |

---

## ÍTEM 5 — Documentos pendientes

| Estado | Cantidad |
|--------|----------|
| PENDIENTE | 200 |
| PARCIAL | 2 |
| Total sin cobro completo | **202** |

---

## ÍTEM 6 — Monto facturado total (F2, sin doble conteo)

**CLP 428,228,304**

---

## ÍTEM 7 — Monto cobrado demostrable

**CLP 130,309,303** (año completo 2026, Chile/AV)

**Ciclo SIC julio 2026 — VELASQUEZ:**  
`venta_cobrada = CLP 544,000`

Desglose:
- Folio 718 (junio, mes_desempeno=junio, pagado 2026-07-15): CLP 160,000
- Folio 731 (julio, pagado 2026-07-04): CLP 224,000
- Folio 738 (julio, pagado 2026-07-14): CLP 160,000

Suma: **CLP 544,000** — confirmado por test Node.js con TX_CL real.

> Nota: la cifra anterior de 384K era incompleta (solo folios 731+738). El folio 718 es una factura de junio (mes_desempeno del ciclo julio), cobrada dentro de la ventana del ciclo. SIC la incluye correctamente.

---

## ÍTEM 8 — Monto pendiente de cobro

**CLP 297,919,001** (CLP 428,228,304 − CLP 130,309,303)

---

## ÍTEM 9 — Resultado por vendedor (año completo 2026)

| Vendedor | PAGADAS | PENDIENTES | PARCIALES | Facturado (CLP) | Cobrado (CLP) |
|----------|---------|-----------|----------|-----------------|---------------|
| PABLO LARATRO | 73 | 60 | 1 | 185,479,135 | 64,168,420 |
| JORGE CAROCA | 35 | 36 | 0 | 97,535,486 | 12,274,743 |
| FRANCISCO VELASQUEZ | 83 | 40 | 0 | 90,987,242 | 37,409,000 |
| RODRIGO ENCINA | 51 | 54 | 1 | 39,147,066 | 7,907,143 |
| VALENTINA MUÑOZ | 17 | 4 | 0 | 4,516,381 | 3,141,823 |
| IVAN VEVERKA | 11 | 4 | 0 | 9,103,600 | 4,016,000 |
| RAYEN BERNAZAR | 15 | 2 | 0 | 1,459,394 | 1,392,174 |
| **TOTAL** | **285** | **200** | **2** | **428,227,304** | **130,309,303** |

> ⚠ RAYEN BERNAZAR no existe en `SICAdapter.VENDEDOR_MAP.CL`. Sus 15 facturas (CLP 1.4M cobrado) no aparecen en el SIC Chile. Requiere decisión: incorporar al mapa o confirmar que es vendedora de otra línea de negocio.

---

## ÍTEM 10 — Documentos duplicados detectados

**Guía 321 → Factura 733** (Francisco Velasquez / UC Valparaíso, CLP 595,000)

La guía fue convertida en factura. Ambas existen en TX_CL. El SIC actualmente puede estar contabilizando esta venta dos veces para Velasquez.  
**Acción requerida:** decisión de negocio sobre si excluir Guía 321 de TX_CL.

---

## ÍTEM 11 — Guías y facturas relacionadas

| Folio | Tipo | Estado |
|-------|------|--------|
| 321 | Guía de Despacho | ⚠ Supersede por Factura 733 |
| 322 | Guía de Despacho | Autónoma (sin par de factura) |
| 327 | Guía de Despacho | Autónoma — vencimiento 2027-05-15 |
| 328 | Guía de Despacho | Autónoma — vencimiento 2027-05-15 |
| 329 | Guía de Despacho | Autónoma — vencimiento 2027-07-15 |

---

## ÍTEM 12 — Diferencias entre fuentes

| Folio | Monto F1 | Monto F2 | Δ | Acción |
|-------|----------|----------|---|--------|
| 739 | 0 | 1,323,000 | 1,323,000 | F2 autoritativo — cobranza emitida correctamente |
| 740 | 0 | 1,520,000 | 1,520,000 | F2 autoritativo — cobranza emitida correctamente |

---

## VERIFICACIÓN MATEMÁTICA

```
TOTAL COBRADO = Σ montos de facturas únicas con Fecha Pago Fct.

  Folio  63:     35,000
  Folio 128:  5,943,000
  Folio 166:  1,056,000
  + 282 folios adicionales...
  Folio 718:    160,000
  Folio 731:    224,000
  Folio 738:    160,000
  ──────────────────────
  SUMA:    130,309,303 CLP ✅

  CLP 428,228,304 (facturado) − CLP 130,309,303 (cobrado) = CLP 297,919,001 (pendiente) ✅
```

---

## ARCHIVOS MODIFICADOS EN ESTA FASE

| Archivo | Tipo | Cambio |
|---------|------|--------|
| `scripts/reconciliar_ventas_cl.py` | NUEVO | Generador de cobranzas_cl.json + reporte |
| `apps/sic_av/data/cobranzas_cl.json` | GENERADO | 285 cobranzas, CLP 130,309,303 |
| `apps/sic_av/js/sic_data_adapter.js` | MODIFICADO | `construirCobranzasReales()` + bloque cobranza en `construirCicloReal()` |
| `apps/sic_av/sic_chile.html` | MODIFICADO | 4to fetch Promise.all + `FUENTES.cobranzas_raw` + `hayCobranzas` |

**Motor `sic_core.js`: INTACTO. AVBOARD: INTACTO. Dashboards existentes: INTACTOS.**

---

## ESTADO ACTUAL DEL DASHBOARD

| KPI | Antes | Después |
|-----|-------|---------|
| `c-cobrado` (VELASQUEZ julio) | "Pendiente de integración" | **CLP 544,000** |
| `comision_liberada` | 0 | 0 (correcto — factorPpto=0% por cumplimiento 54.6% < umbral 70%) |
| Fuente cobranzas | ninguna | cobranzas_cl.json (285 registros) |
| advertencia en ciclo | `cobranza_no_disponible` | `cobranza_fuente_conectada` |

> `comision_liberada = 0` no es un bug de cobranzas. Es la regla de negocio preexistente: `factorPpto = 0%` cuando cumplimiento < 70%. El presupuesto debe resolverse por separado.

---

## ALERTAS ABIERTAS

| # | Alerta | Urgencia |
|---|--------|----------|
| A1 | RAYEN BERNAZAR no está en VENDEDOR_MAP.CL — 15 facturas y CLP 1.4M invisible para SIC | 🟡 Media |
| A2 | Guía 321 / Factura 733 — posible doble conteo Velasquez en TX_CL | 🔴 Alta |
| A3 | Folios 739/740: monto 0 en F1, monto real en F2 — revisar captura en archivo comercial | 🟡 Media |
| A4 | LARATRO tiene 60 pendientes / CLP 121M sin cobrar (65% de su cartera) | 🔴 Alta |
| A5 | CAROCA: 36 pendientes, ratio cobrado/facturado solo 12.6% | 🟡 Media |
| A6 | ENCINA: 54 pendientes, ratio cobrado/facturado solo 20.2% | 🟡 Media |

---

---

## VALIDACIÓN REGLA UNIVERSO SIC (ACLARACIÓN 2026-07-23)

### Regla de negocio

> **UNIVERSO SIC = PERSONAS PRESENTES EN EL PRESUPUESTO VIGENTE**
>
> - En presupuesto → aparece individualmente en SIC con su clave RTC
> - Fuera de presupuesto → operaciones clasificadas como **OTROS** (con trazabilidad individual en detalle)
> - La lista se actualiza automáticamente cuando cambia `inbox/nuevo libro base AV 2026.xlsx`
> - NO hardcodear nombres. La regla es dinámica.

### Implementación

Archivo nuevo/modificado: `scripts/ppto_libro_base.py` — funciones `leer_universo_sic()` y `es_en_universo_sic()`.

`scripts/reconciliar_ventas_cl.py` — ahora taggea cada cobranza con `vendedor`, `en_universo_sic`, `categoria_sic`.

`apps/sic_av/data/cobranzas_cl.json` — regenerado con los nuevos campos.

### VALIDACIÓN 7 PUNTOS

**V1 — Fuente del presupuesto vigente:**
`inbox/nuevo libro base AV 2026.xlsx` → hoja `Base presupuesto consolidada` (granular) con fallback a `Presupuesto Pais` (agregado). Detectada por schema, no por nombre de archivo.

**V2 — Campo identificador del vendedor presupuestado:**
Columna `RTC` en ambas hojas. Posición 2 (0-indexed) en `Base presupuesto consolidada`. Se lee dinámicamente por nombre de columna, no por posición.

**V3 — Construcción dinámica del universo SIC:**
`leer_universo_sic()` lee todos los RTCs únicos de Chile/Perú desde el archivo de presupuesto. Excluye entidades no-persona (CAPEL, etc.). Retorna `{CL: {rtcs: [...], claves_norm: {...}}, PE: {...}}`. Cada ejecución de `reconciliar_ventas_cl.py` relée el archivo.

**V4 — Normalización de aliases sin crear duplicados:**
`_norm_rtc()` convierte a mayúsculas y elimina acentos: `"FRANCISCO VELÁSQUEZ"` → `"FRANCISCO VELASQUEZ"`. La normalización es simétrica — mismo resultado desde la fuente presupuesto y desde los datos de venta. Para variantes ortográficas no cubiertas por acentos (ej. GONZALEZ/GONZALES) existe `ALIASES_NOMBRES` en `ppto_libro_base.py`. Ambas variantes resuelven al mismo canónico.

**V5 — Agrupación de personas no presupuestadas en OTROS:**
En `reconciliar_ventas_cl.py`, `_clasificar_vendedor()` retorna `categoria_sic = "OTROS"` si `en_universo_sic = False`. El JSON incluye `resumen_otros` con conteo y CLP agregado, más `detalle` con folio/vendedor/monto para trazabilidad. El resumen SIC muestra OTROS, el detalle mantiene el nombre real.

**V6 — Transición histórica OTROS → presupuestado:**
Cuando una persona es incorporada al presupuesto: en el siguiente `python3 scripts/reconciliar_ventas_cl.py`, sus operaciones dejan de aparecer en OTROS y pasan a su bucket individual. Las operaciones anteriores a la incorporación mantienen `en_universo_sic: false` si se regenera con el libro anterior, pero con el libro nuevo quedan `true`. No hay migración retroactiva necesaria — solo cambia la clasificación en el JSON de salida.

**V7 — Sin pérdida de ventas ni cobranzas:**
Los 285 cobranzas siguen presentes. Solo cambia `en_universo_sic` y `categoria_sic`. La suma total cobrada (CLP 130,309,303) no varía. Los folios de OTROS mantienen `factura`, `fecha_pago`, `monto` intactos para que `cobrosDeFactura()` en `sic_core.js` pueda usarlos si el vendedor aparece en TX_CL.

### Resultado por categoría (cobranzas año 2026)

| Categoría | Origen | PAG | PEND | Facturado (CLP) | Cobrado (CLP) |
|-----------|--------|-----|------|-----------------|---------------|
| En presupuesto | FRANCISCO VELÁSQUEZ, PABLO LARATRO, RODRIGO ENCINA, VALENTINA MUÑOZ, JORGE CAROCA, FRANCO RIFFO | 259 | 194 | 417,664,310 | 124,901,129 |
| **OTROS** | IVAN VEVERKA (11), RAYEN BERNAZAR (15) | **26** | **6** | **10,562,994** | **5,408,174** |

### Decisión pendiente: IVAN VEVERKA

IVAN VEVERKA está en `VENDEDOR_MAP.CL` en `sic_data_adapter.js` pero **no está en el presupuesto vigente**. Sus cobranzas ahora están correctamente en OTROS, pero **sus ventas siguen apareciendo individualmente en SIC Chile** porque VENDEDOR_MAP lo incluye.

Opciones:
1. **Retirar VEVERKA de VENDEDOR_MAP.CL** → sus ventas pasan a OTROS en SIC Chile también. Requiere decisión explícita ya que afecta el display actual.
2. **Mantener temporalmente en VENDEDOR_MAP** → mientras se confirma si se incorporará al presupuesto o no.

Acción requerida: confirmar cuál de las dos opciones aplicar antes del commit.

---

## INSTRUCCIONES DE COMMIT (cuando Javier apruebe)

```bash
cd ~/Documents/GitHub/av-latam-board
git add scripts/reconciliar_ventas_cl.py \
        scripts/ppto_libro_base.py \
        apps/sic_av/data/cobranzas_cl.json \
        apps/sic_av/js/sic_data_adapter.js \
        apps/sic_av/sic_chile.html \
        logs/RECONCILIACION_COBRANZAS_CL_2026-07-23.md
git commit -m "feat(SIC-CL v1.7 Fase 2): cobranzas reales · universo SIC dinámico · OTROS · 285 cobros · CLP 130.3M · 7/7 validaciones ✅"
git push origin main
```
