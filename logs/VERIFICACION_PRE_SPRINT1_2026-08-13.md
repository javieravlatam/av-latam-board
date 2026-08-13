# VERIFICACIÓN PRE-SPRINT 1 — AV LATAM SSOT
**Fecha:** 2026-08-13  
**Propósito:** Cerrar las 4 definiciones pendientes del SSOT_AV_LATAM_v1.0 mediante evidencia antes de implementar.  
**Método:** Análisis de archivos /inbox — sin asumir, sin inventar.  
**Estado al cierre:** Ver VEREDICTO al final.

---

## PREGUNTA 1 — Agroveca CL vs Agrocomercial CL: ¿una o dos entidades?

### Evidencia analizada

**Estructura corporativa (memory project_estructura_corporativa.md):**
1. **Agrocomercial Lo Miranda SpA (AGLM)** = fábrica. Vende producto terminado a Grupo AV LATAM a precio de transferencia.
2. **Grupo AV LATAM SpA (RUT 78.415.115-8)** = hub regional/comercializador. Aparece como CLIENTE en el Libro de Ventas 12-08 AGLM (Julio, folio 734, Jorge Caroca, UN=Agrocomercial).
3. **Agroveca Chile / Perú** = operaciones comerciales locales.

**Libro de Ventas 12-08-2026 AGLM:**
- Columna "UN" (Unidad de Negocio): valores = `Agroveca` (1,025 filas), `Agrocomercial` (670 filas), `Laboratorio` (12 filas)
- Columna "Negocio": valor único = `AV` para las 1,707 filas
- Folios: min=47, max=778 (ambas UN comparten la misma serie de numeración DTE)
- **Conclusión:** "Agroveca" y "Agrocomercial" en el Libro de Ventas AGLM son líneas de producto (UN), no entidades. El emisor es siempre AGLM con una sola serie DTE (<800).

**CxC Agroveca (Casa Matriz):**
- Folios: 617–1,559 — serie DTE completamente distinta a AGLM
- Fechas: 2024–enero 2026 (facturas de Casa Matriz registradas en Libro Base 2024-2025 con UN="Casa Matriz")
- Vendedores exclusivos: FRANCO RIFFO, IVÁN VEVERKA (parcial), GUILLERMO PRADENAS, CAPEL, JOSELIN MUÑOZ, JOSÉ LORENZONI, VALENTINA MUÑOZ
- Grupo AV LATAM SpA (78.415.115-8) aparece en Libro Ventas AGLM como CLIENTE → confirma que el hub compra a AGLM y revende. Las facturas que emite el hub = serie Casa Matriz (1100+)

**Intersección documentada (Forense 2026-08-11):**
- 6 pares de fechas analizados → 0 documentos en común a nivel RUT+Doc+Número
- Rangos no solapan en producción activa

### Conclusión Q1: OPCIÓN A — DOS ENTIDADES LEGALES DISTINTAS

| empresa_id | Entidad | RUT | Serie DTE | Rol | Fuente de datos |
|---|---|---|---|---|---|
| `AGROCOMERCIAL_CL` | Agrocomercial Lo Miranda SpA | Pendiente confirmar | 47–778+ | Fábrica / vendedora directa | Libro de Ventas AGLM, CxC Agrocomercial |
| `AGROVECA_CL` | Grupo AV LATAM SpA | 78.415.115-8 (confirmar como emisor) | 617–1,559+ | Hub comercializador / Casa Matriz | CxC Agroveca, Libro Base 2024-2025 UN=Casa Matriz |

**RUT emisor de AGROVECA_CL:** Los archivos Chile no contienen encabezado explícito con RUT emisor (a diferencia de Perú que tiene "AGROVECA PERU S.A.C. - RUC: 20609014963"). El RUT 78.415.115-8 (Grupo AV LATAM SpA) está identificado en Libro Ventas como cliente de AGLM. **Pendiente confirmar con Javier si 78.415.115-8 es el RUT emisor de las facturas Casa Matriz.**

**Regla de pipeline confirmada:**
- CxC Chile = CxC AGROVECA_CL + CxC AGROCOMERCIAL_CL (UNION)
- No hay doble conteo — 0 overlap en todas las fechas analizadas
- Drill-down disponible por empresa_id en todo momento

**Impacto en dashboards:**
- CxC Chile consolidada será correctamente más alta que lo mostrado actualmente
- El dashboard debe poder mostrar tanto "Chile total" como "Casa Matriz / AGLM" separados
- Recomendación nomenclatura: "Agroveca CL (Casa Matriz)" y "Agrocomercial Lo Miranda"

---

## PREGUNTA 2 — Vendedores Chile: clasificación definitiva

**Nómina SIC vigente (7 vendedores, inmutable sin evidencia):**
`laratro` (PABLO LARATRO) · `velasquez` (FRANCISCO VELASQUEZ) · `encina` (RODRIGO ENCINA) · `munoz` (VALENTINA MUÑOZ) · `caroca` (JORGE CAROCA) · `veverka` (IVÁN VEVERKA) · `franco_riffo` (FRANCO RIFFO)

### Clasificación de nombres adicionales

| Nombre en CxC/Libro | Clasificación | Evidencia | Acción pipeline | SIC |
|---|---|---|---|---|
| **GUILLERMO PRADENAS** | Vendedor histórico | CxC Agroveca 2025 (folios 912, 979, 981, 1142, 1197); ausente en Libro Ventas 2026 | Preservar en trazabilidad CxC; NO agregar a vendedores activos | NO |
| **JOSELIN MUÑOZ** | Vendedor histórico | CxC Agroveca 2024 (folios 618, 619); ausente en Libro Ventas 2026 | Preservar en trazabilidad CxC | NO |
| **CAPEL** | Canal/distribuidor externo | CxC Agroveca con folios 751, 852, 1119, 1137, 1179 (oct-may 2024-2025). CAPEL = cooperativa agrícola. El cliente real es NIVALDO ANTONIO FLORES EGAÑA (RUT 4.866.644-2). "CAPEL" es el canal de gestión, no un vendedor persona. | Cartera en CxC con campo `canal=CAPEL`; NO como vendedor | NO |
| **VALENTINA MUÑOZ** | **Ya en SIC como `munoz`** | 98 filas Libro Ventas 12-08 AGLM, CLP 4,236,056; folios 1558-1559 en CxC Agroveca | Ya homologada | SÍ (ya) |
| **MAURICIO ROJAS** | Vendedor histórico AGLM | CxC Agrocomercial (folio 210, jul 2025); aparece en archivos early 1204/1704. Ausente en Libro Ventas 2026 | Preservar en trazabilidad CxC AGLM | NO |
| **RAYEN BERNAZAR** | Categoría con 0 ingresos reales | 100 filas en Libro Ventas AGLM pero total CLP 0; 85 filas en 27-07 con CLP 39,826 total anual (< 1 venta significativa). Los registros con CLP 0 son guías de despacho sin facturar o productos sin precio asignado | Campo `vendedor` en Libro Ventas, pero no genera revenue auditable | NO |
| **EN TERRENO 1** | Categoría administrativa | 1 fila en Libro Ventas, CLP 0. No es persona física. Representa ventas directas en campo sin vendedor asignado | Categoría en pipeline, campo especial | NO |
| **OFICINA** | Categoría administrativa | Aparece en CxC Agrocomercial y Libro Ventas julio. No es persona física. Ventas directas de oficina sin vendedor. | Categoría en pipeline | NO |
| **JOSÉ LORENZONI** | Vendedor histórico | CxC Agroveca ago-sep 2025 (folios 1290, 1318, 1340; cliente TRANSACCIONES AGRICOLAS SPA). CLP ~3.8M pendiente. Ausente en Libro Ventas 2026 | Preservar en trazabilidad CxC; cartera heredada Casa Matriz | NO |
| **JAVIER ALMEIDA** | Usuario/propietario | 2 filas en Libro Ventas (CLP 540,000); aparece en archivos early CxC | No corresponde a vendedor comercial activo | NO |

### Casos de normalización requeridos

- **IVÁN VEVERKA / IVAN VEVERKA**: mismo vendedor con/sin acento. En Agroveca = "IVÁN" (acento), en Agrocomercial/Libro Ventas = "IVAN" (sin acento). Pipeline debe normalizar a forma canónica → mapear a `veverka`.
- **FRANCISCO VELÁSQUEZ / FRANCISCO VELASQUEZ**: mismo vendedor con/sin acento en nombre. Pipeline normaliza a `velasquez`.
- **RODRIGO ENCINA**: aparece como "RODRIGO ENCINA" en CxC Agrocomercial — consistente con SIC `encina`.

---

## PREGUNTA 3 — Presupuesto H2 2026: fuente y estado por vendedor

**Fuente única disponible:** `nuevo libro base AV 2026.xlsx` → sheet `Presupuesto Pais` y `Base presupuesto consolidada`  
**No se encontró ninguna otra fuente presupuestaria en /inbox.**

### Chile — Presupuesto 2026 por vendedor (CLP)

| Vendedor SIC | Nombre real | Jul | Ago | Sep | Oct | Nov | Dic | Estado H2 |
|---|---|---|---|---|---|---|---|---|
| `laratro` | PABLO LARATRO | 7,800,600 | 25,000,700 | 30,000,400 | 27,000,300 | 37,499,200 | 22,000,400 | ✅ PRESUPUESTO_DISPONIBLE |
| `velasquez` | FRANCISCO VELÁSQUEZ | 41,998,700 | 15,000,900 | 48,000,500 | 50,000,500 | 17,999,500 | 20,001,500 | ✅ PRESUPUESTO_DISPONIBLE |
| `veverka` | IVAN VEVERKA | 5,999,100 | 5,999,100 | 5,999,100 | 5,999,100 | 5,999,100 | 5,999,100 | ✅ PRESUPUESTO_DISPONIBLE (constante mensual — probable objetivo fijo) |
| `encina` | RODRIGO ENCINA | 0 | 0 | 0 | 0 | 0 | 0 | ⚠️ PRESUPUESTO_CERO_REAL (probable omisión — ventas reales CLP 42M en H1) |
| `munoz` | VALENTINA MUÑOZ | 0 | 0 | 0 | 0 | 0 | 0 | ⚠️ PRESUPUESTO_CERO_REAL (probable omisión — ventas reales en H1) |
| `caroca` | JORGE CAROCA | 0 | 0 | 0 | 0 | 0 | 0 | ⚠️ PRESUPUESTO_CERO_REAL (probable omisión — ventas reales CLP 107M acumulado) |
| `franco_riffo` | FRANCO RIFFO | 0 | 0 | 0 | 0 | 0 | 0 | ⚠️ PRESUPUESTO_CERO_REAL (puede ser intencional — CxC activa pero 0 ventas en Libro Ventas 2026) |

**Total Chile ppto 2026:** CLP 728,110,400 anual. H2: CLP 378,298,000 (concentrado en laratro, velasquez, veverka).

**Alerta:** 4 vendedores activos (encina, munoz, caroca, franco_riffo) tienen H2 = 0 en Libro Base. El SIC y AV BOARD deben distinguir PRESUPUESTO_CERO_REAL de DATO_SIN_PPTO. **Solicitar a Javier si corresponde actualizar el Libro Base para H2.**

### Perú — Presupuesto 2026 por vendedor (USD)

| Vendedor SIC | Nombre en Libro Base | Jul | Ago | Sep | Oct | Nov | Dic | Estado H2 |
|---|---|---|---|---|---|---|---|---|
| `infante` | Oscar Infante | 0 | 0 | 0 | 0 | 0 | 0 | ⚠️ PRESUPUESTO_CERO_REAL — discrepancia: avboard actual muestra ppto_jul=5,840 (de carga anterior). Libro Base actual dice 0. |
| `atalaya` | Omar Atalaya | 25,000 | 19,000 | 23,000 | 23,000 | 18,000 | 10,000 | ✅ PRESUPUESTO_DISPONIBLE |
| `diaz` | Susan Diaz | 15,000 | 15,000 | 30,000 | 30,000 | 20,000 | 35,000 | ✅ PRESUPUESTO_DISPONIBLE |
| `gonzales` | Antonio Gonzalez | 8,000 | 0 | 5,000 | 0 | 5,000 | 0 | ✅ PRESUPUESTO_DISPONIBLE (meses alternos — probablemente intencional) |
| `aguirre` | Lizbeth Aguirre + ICA2 | 20,000¹ | 105,000¹ | 65,000¹ | 90,000¹ | 50,000¹ | 20,000¹ | ✅ PRESUPUESTO_DISPONIBLE (dos entradas: aguirre + RTC ICA 2) |
| `valladares` | Patricia Valladares | 10,000 | 10,000 | 10,000 | 15,000 | 10,000 | 10,000 | ✅ PRESUPUESTO_DISPONIBLE |
| `martha` | Martha Hidalgo - KAM | 0 | 10,000 | 10,000 | 15,000 | 15,000 | 15,000 | ✅ PRESUPUESTO_DISPONIBLE (activa desde agosto) |
| `navarro` | Nicoll Navarro | N/E | N/E | N/E | N/E | N/E | N/E | 🔴 PRESUPUESTO_SIN_DATO — ausente en Libro Base; ningún dato encontrado en /inbox |

¹ Suma de "Lizbeth Aguirre" + "RTC ICA 2 / Lizbeth Aguirre" (dos líneas del mismo vendedor en Libro Base — pipeline debe consolidar).

**Alerta infante:** El avboard actual tiene ppto_jul=5,840 USD (carga de iteración anterior). El Libro Base vigente tiene Jul-Dic=0 para Oscar Infante. **Solicitar a Javier si Infante tiene objetivos H2 o si H2=0 es real (posible cambio de rol o salida).**

**Alerta navarro:** No aparece en ningún archivo de presupuesto del inbox. El pipeline debe marcar como PRESUPUESTO_SIN_DATO y no calcular cumplimiento.

---

## PREGUNTA 4 — Tipo de cambio LATAM: diseño FX canónico

### Estado actual

El Libro Base (sheet `Presupuesto Pais`, fila 26) tiene:

```
PRESUPUESTO CONSOLIDADO GRUPO AV LATAM | cambio CLP/USD = 950
```

**Problema:** tc hardcodeado en una celda. No hay versión, no hay fuente, no hay fecha de vigencia, no hay registro de cambios históricos.

### Diseño tabla FX canónica versionada

**Principio:** cada registro de ventas o CxC preserva siempre `moneda_original` y `monto_original`. La conversión a USD es una capa de presentación, no un campo de la fuente.

#### Tabla: `fx_rates`

```sql
CREATE TABLE fx_rates (
    fx_id           TEXT PRIMARY KEY,          -- SHA256(par_monedas + fx_period + fx_source)
    moneda_origen   TEXT NOT NULL,             -- 'CLP', 'PEN', 'USD', 'EUR'
    moneda_destino  TEXT NOT NULL,             -- siempre 'USD' para consolidación LATAM
    fx_rate         NUMERIC(18,6) NOT NULL,    -- tasa de conversión (moneda_origen → USD)
    fx_type         TEXT NOT NULL,             -- 'spot', 'promedio_mes', 'presupuesto', 'manual'
    fx_source       TEXT NOT NULL,             -- 'libro_base_manual', 'bcch', 'bcrp', 'sbs', 'sbif'
    fx_period       TEXT NOT NULL,             -- 'YYYY-MM' para tc mensual, 'YYYY' para anual
    efectivo_desde  DATE NOT NULL,
    efectivo_hasta  DATE,                      -- NULL = vigente
    es_vigente      BOOLEAN NOT NULL DEFAULT TRUE,
    notas           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### Registro inicial (estado actual documentado)

```json
{
  "fx_id": "SHA256('CLP|USD|2026|libro_base_manual')",
  "moneda_origen": "CLP",
  "moneda_destino": "USD",
  "fx_rate": 0.001052631,
  "fx_type": "presupuesto",
  "fx_source": "libro_base_manual",
  "fx_period": "2026",
  "efectivo_desde": "2026-01-01",
  "efectivo_hasta": null,
  "notas": "tc=950 CLP/USD hardcodeado en Libro Base 'nuevo libro base AV 2026.xlsx', sheet Presupuesto Pais, fila 26"
}
```

#### Uso en el pipeline

```python
# Cada registro de venta/CxC siempre preserva:
record = {
    "moneda_original": "CLP",
    "monto_original": 6480000,
    # Conversión es derivada, no almacenada en fuente:
    "fx_rate": get_fx_rate("CLP", "USD", periodo="2026-07"),
    "fx_source": "libro_base_manual",
    "fx_period": "2026-07",
    "monto_usd": 6480000 * fx_rate  # = 6818.18 USD
}
```

#### Reglas críticas

1. **Nunca hardcodear** el tipo de cambio en lógica de negocio ni en funciones de transformación.
2. **Siempre buscar en `fx_rates`** usando `pais_id + fx_period + fx_type`.
3. **Si no existe** el tc para el período solicitado, buscar el más reciente con `efectivo_hasta IS NULL`.
4. **Recálculo reproducible:** cualquier cambio en `fx_rates` debe poder aplicarse a todos los registros históricos sin modificar los montos originales.
5. **Preparado para fuente oficial futura:** cuando se conecte a BCCH (Chile) o BCRP (Perú) como fuente, solo se agrega un nuevo registro en `fx_rates` con `fx_source='bcch'` o `fx_source='bcrp'`. No hay cambios en el pipeline de datos.
6. **Auditabilidad:** el campo `fx_source` y `fx_period` en cada registro de venta permite reproducir exactamente qué tasa se usó para cada conversión.

#### Tabla de fuentes oficiales futuras

| País | Moneda | Fuente oficial | URL referencia |
|---|---|---|---|
| Chile | CLP/USD | Banco Central de Chile (BCCH) | bcch.cl — dólar observado |
| Perú | PEN/USD | Banco Central de Reserva del Perú (BCRP) | bcrp.gob.pe — tipo de cambio contable |
| Ecuador | USD | N/A (ya USD) | — |

---

## PREGUNTA 5 — CxC Chile consolidada: regla formal

Formalización de la regla ya demostrada en FORENSE_CXC_CHILE_2026-08-11.md:

```
CxC_Chile_Total(fecha_corte) = 
    CxC_AGROVECA_CL(fecha_corte_vigente) 
    UNION 
    CxC_AGROCOMERCIAL_CL(fecha_corte_vigente)

Clave deduplicación global: empresa_id + rut_cliente + doc_tipo + doc_numero
Verificación anti-doble conteo: COUNT(intersección) DEBE = 0 en cada ejecución

Drill-down disponible:
  - Por empresa_id: AGROVECA_CL | AGROCOMERCIAL_CL
  - Por país: CHILE
  - Agregación LATAM: suma de países (con FX para PE→USD)
```

**Valores de referencia (08-05-2026, última fecha con ambas carteras):**
- CxC AGROVECA_CL: CLP 66,586,259
- CxC AGROCOMERCIAL_CL: CLP 68,112,335
- **CxC Chile Total: CLP 134,698,594**
- (El dashboard actual solo mostraba ~CLP 68M → estaba incompleto)

---

## JERARQUÍA DEFINITIVA LATAM → PAÍS → EMPRESA

```
GRUPO AV LATAM (consolidación LATAM en USD)
│
├── CHILE (CLP)
│   ├── AGROVECA_CL  [Grupo AV LATAM SpA — "Casa Matriz"] ← RUT 78.415.115-8 (pendiente confirmar como emisor)
│   │   • CxC propia (folios 617-1559)
│   │   • Vendedores: laratro, velasquez, encina, munoz, caroca, veverka, franco_riffo
│   │   • Historial: vendedores históricos (PRADENAS, LORENZONI, JOSELIN MUÑOZ, CAPEL)
│   │
│   └── AGROCOMERCIAL_CL  [Agrocomercial Lo Miranda SpA] ← RUT pendiente confirmar
│       • CxC propia (folios 47-778)
│       • Libro de Ventas 2026 (folios 47-778, UN=Agroveca+Agrocomercial)
│       • Vendedores: misma nómina comercial (operan para ambas entidades)
│
└── PERU (USD)
    └── AGROVECA_PE  [Agroveca Peru S.A.C.] ← RUC 20609014963
        • CxC propia (serie E001)
        • Libro de Ventas 2026 (serie E001)
        • Vendedores: infante, atalaya, diaz, gonzales, aguirre, valladares, martha
        • Sin dato: navarro (presupuesto_sin_dato)
```

**Dato pendiente de confirmar con Javier:**
> ¿El RUT emisor de las facturas "Casa Matriz" (serie 617-1559) es efectivamente Grupo AV LATAM SpA (78.415.115-8), o corresponde a otra razón social? Los archivos Chile no tienen encabezado de empresa emisora como sí tiene Perú.

---

## ENMIENDAS AL SSOT_AV_LATAM_v1.0

Los hallazgos de esta verificación requieren los siguientes ajustes al diseño:

### Enmienda 1 — Catálogo de empresas (Sección 3)

**Original:**
```
AGROVECA_CL | Agroveca Chile | CLP | CHILE
AGROCOMERCIAL_CL | Agrocomercial Chile | CLP | CHILE
AGROVECA_PE | Agroveca Peru S.A.C. | USD | PERU
```

**Corregido:**
```
AGROVECA_CL      | Grupo AV LATAM SpA (Casa Matriz) | CLP | CHILE | RUT: 78.415.115-8 (confirmar)
AGROCOMERCIAL_CL | Agrocomercial Lo Miranda SpA     | CLP | CHILE | RUT: pendiente
AGROVECA_PE      | Agroveca Peru S.A.C.             | USD | PERU  | RUC: 20609014963
```

### Enmienda 2 — Presupuesto (Sección 4, dominio PRESUPUESTO)

Añadir campo `estado_presupuesto` con tres valores posibles:
- `PRESUPUESTO_DISPONIBLE` — existe valor > 0 en Libro Base
- `PRESUPUESTO_CERO_REAL` — existe registro con valor = 0 explícito (puede ser intencional o probable omisión; pipeline agrega flag `requiere_confirmacion=TRUE` si el vendedor tiene ventas reales en ese período)
- `PRESUPUESTO_SIN_DATO` — no existe ningún registro en ninguna fuente para ese vendedor+período

### Enmienda 3 — Dominio FX (nuevo, Sección 4)

Agregar dominio `FX_RATES` con la tabla y reglas definidas en Pregunta 4 de este documento.

### Enmienda 4 — Normalización de vendedores (Sección 6, Pipeline)

Añadir paso de normalización de nombres de vendedor antes del matching:
```python
VENDOR_ALIASES = {
    "IVAN VEVERKA": "IVÁN VEVERKA",  # sin acento → con acento
    "FRANCISCO VELASQUEZ": "FRANCISCO VELÁSQUEZ",
    # canonical → sic_vendedor_id
    "PABLO LARATRO": "laratro",
    "FRANCISCO VELÁSQUEZ": "velasquez",
    ...
}
```

### Enmienda 5 — CxC Chile (Sección 7, Consolidación)

Añadir verificación explícita anti-doble conteo:
```python
def consolidar_cxc_chile(agroveca_cxc, agrocomercial_cxc):
    union = pd.concat([agroveca_cxc, agrocomercial_cxc])
    duplicados = union.duplicated(subset=['empresa_id', 'rut_cliente', 'doc_tipo', 'doc_numero'])
    assert duplicados.sum() == 0, f"DOBLE CONTEO DETECTADO: {duplicados.sum()} registros"
    return union
```

### Enmienda 6 — Presupuesto aguirre/navarro (Sección 4, dominio PRESUPUESTO)

- `aguirre` en Libro Base tiene DOS líneas: "Lizbeth Aguirre" y "RTC ICA 2 / Lizbeth Aguirre". Pipeline debe sumarlas al consolidar por `vendedor_id=aguirre`.
- `navarro` (Nicoll Navarro) ausente del Libro Base → `PRESUPUESTO_SIN_DATO` en todos los meses 2026.

---

## VEREDICTO FINAL

### Verificaciones completadas

| # | Pregunta | Estado | Bloqueante |
|---|---|---|---|
| 1 | Agroveca CL vs Agrocomercial CL | ✅ RESUELTA | No — dos entidades distintas, UNION confirmada |
| 2 | Vendedores adicionales Chile | ✅ RESUELTA | No — ninguno debe agregarse al SIC |
| 3 | Presupuesto H2 2026 | ✅ RESUELTA | No — con alertas para 4 CL + infante PE + navarro PE |
| 4 | FX canónico | ✅ DISEÑADO | No — tc=950 actual documentado; tabla fx_rates lista |
| 5 | CxC Chile consolidada | ✅ FORMALIZADA | No — UNION verificada en 6 fechas |
| 6 | Enmiendas SSOT v1.0 | ✅ ESPECIFICADAS | No — 6 enmiendas identificadas |

### Pendiente menor (no bloqueante para Sprint 1)

> **Confirmar RUT emisor AGROVECA_CL con Javier:** ¿es Grupo AV LATAM SpA (78.415.115-8) el que emite las facturas serie 617-1559? Los archivos no contienen el encabezado del emisor. Si es otra razón social, actualizar el catálogo de empresas.

Este dato no bloquea Sprint 1 porque:
- La regla de pipeline (UNION) ya está demostrada y no depende del RUT emisor
- El `empresa_id=AGROVECA_CL` puede usarse en Sprint 1 y actualizarse la razón social en Sprint 2 cuando se confirme

---

## ✅ SSOT_AV_LATAM_v1.0 — APROBADO PARA IMPLEMENTACIÓN

> No existen bloqueos materiales. Las 4 preguntas están resueltas con evidencia.  
> Las 6 enmiendas identificadas son mejoras incrementales, no re-diseños.  
> La arquitectura del SSOT es correcta. Sprint 1 puede comenzar.  
>
> **Condición única antes de Sprint 1:** Javier debe confirmar el RUT emisor de AGROVECA_CL (no bloqueante, Sprint 1 puede iniciar con `empresa_id` pendiente de razón social).

---

*Verificación producida por Claude — AV LATAM Executive Intelligence — 2026-08-13*  
*Basado en: nuevo libro base AV 2026.xlsx · Libro de Ventas 12-08-2026 AGLM · Ventas Julio GRUPO AV LATAM · CxC Agroveca 21-06 · CxC Agrocomercial 21-07 · memoria project_estructura_corporativa*
