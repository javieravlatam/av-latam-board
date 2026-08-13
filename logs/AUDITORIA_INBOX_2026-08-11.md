# AUDITORÍA INBOX — AV LATAM GRUPO
**Fecha:** 2026-08-11  
**Alcance:** /inbox completo — Chile + Perú  
**Estado:** PRE-IMPLEMENTACIÓN — solo diagnóstico y diseño  
**NO se modificó ningún archivo. NO se hizo commit. NO se hizo push.**

---

## RESUMEN EJECUTIVO

| Métrica | Valor |
|---|---|
| Total archivos en /inbox | 78 |
| Archivos procesables (.xlsx) | 74 |
| Archivos no procesables | 4 (1 .eml, 1 .rtf, 2 temporales ~$) |
| Duplicados exactos (mismo hash) | 2 pares |
| Conflictos mismo período distinto contenido | 4 casos |
| Fuentes identificadas | 7 tipos |
| Países cubiertos | Chile + Perú |
| Rango temporal | 2024 – 2026-08-11 |
| Archivo vigente más reciente (CL ventas) | 2026-07-27 |
| Archivo vigente más reciente (PE ventas) | 2026-08-11 |

---

## 1. INVENTARIO COMPLETO

### 1.1 PERÚ — VENTAS (24 snapshots acumulados)

| Archivo | Fecha corte | MD5 | Tamaño | Estado |
|---|---|---|---|---|
| VENTAS FACTURADAS AL 15.04.2026.xlsx | 2026-04-15 | fcb001fd | 33.9 KB | HISTÓRICO |
| VENTAS FACTURADAS AL 16.04.2026.xlsx | 2026-04-16 | 5d6991ab | 34.1 KB | HISTÓRICO |
| VENTAS FACTURADAS AL 17.04.2026.xlsx | 2026-04-17 | 5d4072ae | 34.1 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 21.04.2026.xlsx | 2026-04-21 | 2cd202c5 | 34.4 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 24.04.2026.xlsx | 2026-04-24 | f6199dfe | 35.1 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 29.04.2026.xlsx | 2026-04-29 | 5eee8d86 | 36.7 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 11.05.2026.xlsx | 2026-05-11 | d7865096 | 36.9 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 15.05.2026.xlsx | 2026-05-15 | 29deb911 | 37.3 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 18.05.2026.xlsx | 2026-05-18 | bfa469ec | 37.4 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 22.05.2026.xlsx | 2026-05-22 | 9b2db93a | 37.8 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 29.05.2026.xlsx | 2026-05-29 | 6db8d8bd | 37.9 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 02.06.2026.xlsx | 2026-06-02 | db4bf9b5 | 37.9 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 17.06.2026.xlsx | 2026-06-17 | 75ac3d81 | 38.8 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 19.06.2026.xlsx | 2026-06-19 | ba0bbe62 | 38.8 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 22.06.2026.xlsx | 2026-06-22 | 6794ee9b | 39.0 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 30.06.2026.xlsx | 2026-06-30 | e7f85148 | 39.7 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 03.07.2026.xlsx | 2026-07-03 | 045a0bdb | 39.1 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 10.07.2026.xlsx | 2026-07-10 | 5b137900 | 39.5 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 13.07.2026.xlsx | 2026-07-13 | 7bdbd8c3 | 40.3 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 16.07.2026.xlsx | 2026-07-16 | 24d883df | 40.8 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 20.07.2026.xlsx | 2026-07-20 | 15ada7ae | 41.2 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 21.07.2026.xlsx | 2026-07-21 | 5b6e30f9 | 41.6 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 30.07.2026.xlsx | 2026-07-30 | eda93aa4 | 41.6 KB | HISTÓRICO ⚠️ CONFLICTO |
| AGROVECA PERU - VENTAS AL 30.07.2026 2.xlsx | 2026-07-30 | 9457aa5d | 41.7 KB | HISTÓRICO — v2 (134 rows vs 133) |
| AGROVECA PERU - VENTAS AL 31.07.2026.xlsx | 2026-07-31 | c5eb494d | 41.7 KB | HISTÓRICO |
| AGROVECA PERU - VENTAS AL 04.08.2026.xlsx | 2026-08-04 | 31f980d3 | 41.6 KB | HISTÓRICO |
| **AGROVECA PERU - VENTAS AL 11.08.2026.xlsx** | **2026-08-11** | **a4973104** | **42.5 KB** | **VIGENTE** |

**Estructura PE VENTAS (sheets):**
- `RESUMEN` — pivot por vendedor (no parseable directamente)
- `Hoja1` — lista de clientes (auxiliar)
- `VENTAS [MES]` — ventas del mes en curso
- `VENTAS ACUMULADAS 2026` — acumulado YTD ← **fuente principal**

**Columnas `VENTAS ACUMULADAS 2026`:**
```
PERIODO | FECHA EMISION | FECHA VENCIMIENTO | SERIE | FACTURA | NUMERO (RUC) |
DENOMINACION O RAZON SOCIAL | DOLARES | CONCEPTO | VENDEDOR
```

**Notas PE VENTAS:**
- `CONCEPTO` = descripción libre (ej: "60 LTS AV SILFORTE") — sin SKU ni cantidad separada
- `NUMERO` = RUC del cliente (11 dígitos PE)
- Primeros 3 archivos (VENTAS FACTURADAS) tienen mismo formato que el resto — mismo parser aplica
- ⚠️ **CONFLICTO 30.07:** dos archivos distintos. `30.07.2026 2.xlsx` tiene 1 fila más → es la versión más completa. En pipeline: seleccionar v2 como vigente, marcar v1 como histórico descartado.

---

### 1.2 PERÚ — VENTAS COBRADAS (1 archivo acumulado)

| Archivo | Fecha corte | MD5 | Tamaño | Estado |
|---|---|---|---|---|
| **AGROVECA PERU - REPORTE DE VENTAS COBRADAS 2026.xlsx** | 2026-08-07 | 27febb5e | 24.7 KB | **VIGENTE** |

**Columnas `VENTAS ACUMULADAS 2026`:**
```
PERIODO | FECHA EMISION | FECHA VENCIMIENTO | FECHA DE PAGO | SERIE | FACTURA |
NUMERO (RUC) | DENOMINACION | DOLARES | CONCEPTO | VENDEDOR | DIAS
```

**Relación con VENTAS PE:** misma clave SERIE+FACTURA. Una fila en COBRADAS = una factura de VENTAS que ya fue pagada, con FECHA_DE_PAGO y DIAS.

---

### 1.3 PERÚ — COMISIONES (1 archivo acumulado)

| Archivo | Fecha corte | MD5 | Tamaño | Estado |
|---|---|---|---|---|
| **AGROVECA PERU - COMISIONES TRABAJADORES 2026.xlsx** | 2026-05 (vigente parcial) | 8a771bda | 55.4 KB | **VIGENTE** |

**Sheets:**
- `VENTAS ACUMULADAS 2026` — misma estructura que COBRADAS + `PERIODO DE PAGO | PORCENTAJE | COMISION POR PAGAR`
- `VENTAS MAYO` — ventas mensuales del período
- `COMISIONES POR PAGAR` — pivot por vendedor/período
- `RESUMEN` — KPIs

**Notas:** Este archivo es la fuente actual de cobranzas PE en el SIC. Columnas extra (PORCENTAJE, COMISION POR PAGAR) no se usan en SIC pero están presentes. El pipeline debe usar `VENTAS ACUMULADAS 2026` de COBRADAS (más actualizado: 07.08) en lugar de COMISIONES (mayo).

---

### 1.4 PERÚ — CxC (11 snapshots, rango 2025-2026)

| Archivo | Fecha corte | MD5 | Tamaño | Estado |
|---|---|---|---|---|
| AGROVECA - CUENTAS POR COBRAR AL 13..04.2025.xlsx | 2025-04-13 | db3b03de | 19.8 KB | HISTÓRICO (2025) |
| AGROVECA - CUENTAS POR COBRAR AL 17..04.2025.xlsx | 2025-04-17 | c9ae73a0 | 19.9 KB | HISTÓRICO (2025) |
| AGROVECA - CUENTAS POR COBRAR AL- 17..04.2025 .xlsx | 2025-04-17 | **c9ae73a0** | 19.9 KB | **DUPLICADO EXACTO** del anterior |
| AGROVECA - CUENTAS POR COBRAR AL 20..04.2025.xlsx | 2025-04-20 | aeb5da00 | 19.8 KB | HISTÓRICO (2025) |
| AGROVECA - CUENTAS POR COBRAR AL 27..04.2025.xlsx | 2025-04-27 | 231d4cbd | 20.2 KB | HISTÓRICO (2025) |
| AGROVECA - CUENTAS POR COBRAR AL 29..04.2025.xlsx | 2025-04-29 | 97339039 | 20.5 KB | HISTÓRICO (2025) |
| AGROVECA - CUENTAS POR COBRAR AL 10..05.2025.xlsx | 2025-05-10 | fef746c6 | 21.1 KB | HISTÓRICO (2025) |
| AGROVECA - CUENTAS POR COBRAR AL 18..05.2025.xlsx | 2025-05-18 | d78371a3 | 20.4 KB | HISTÓRICO (2025) |
| AGROVECA - CUENTAS POR COBRAR AL 25..05.2025.xlsx | 2025-05-25 | d384b887 | 20.5 KB | HISTÓRICO (2025) |
| AGROVECA - CUENTAS POR COBRAR AL 02..06.2025.xlsx | 2025-06-02 | 44ab2d03 | 20.7 KB | HISTÓRICO (2025) |
| **AGROVECA - CUENTAS POR COBRAR AL 13..07.2026.xlsx** | **2026-07-13** | **b9121da4** | **20.5 KB** | **VIGENTE** |

**Estructura (sheet AGROVECA, rows después de 5 líneas de header):**
```
CODIGO | NOMBRE | TD | SER. | NUMERO | FECHA | VENCIM | VENCIM | SALDO | GLOSA
```

**Notas:** La doble columna VENCIM probablemente = vencimiento original + vencimiento real (mora). Formato distinto al CxC Chile (sin Días Mora, sin Tramo). El pipeline necesita un parser diferente para PE vs CL.

---

### 1.5 CHILE — VENTAS (18 archivos, incluyendo early format)

#### Early format — Abril (5 archivos)

| Archivo | Fecha corte | MD5 | Tamaño | Estado |
|---|---|---|---|---|
| Ventas al 012-04..xlsx | 2026-04-12 | 804fe250 | 153.5 KB | HISTÓRICO |
| Ventas al 21-04.xlsx | 2026-04-21 | 96925901 | 148.8 KB | HISTÓRICO |
| Ventas al 22-04.xlsx | 2026-04-22 | d1c0f0bd | 152.6 KB | HISTÓRICO |
| Ventas al 26-04.xlsx | 2026-04-26 | 9c18bbfb | 142.6 KB | HISTÓRICO |
| Ventas al 29-04.xlsx | 2026-04-29 | bdbcb221 | 143.7 KB | HISTÓRICO |

#### Libro de Ventas (12 archivos)

| Archivo | Fecha corte | MD5 | Tamaño | Estado |
|---|---|---|---|---|
| Libro de Ventas 11-05-2026.xlsx | 2026-05-11 | 49dd08fc | 173.0 KB | HISTÓRICO |
| Libro de Ventas 18-05-2026.xlsx | 2026-05-18 | 769e9bfd | 194.9 KB | HISTÓRICO |
| Libro de Ventas 24-05-2026.xlsx | 2026-05-24 | ef16b8ed | 197.8 KB | HISTÓRICO |
| Libro de Ventas 31-05-2026.xlsx | 2026-05-31 | a8cffe00 | 202.6 KB | HISTÓRICO |
| Libro de Ventas 07-06-2026.xlsx | 2026-06-07 | 751d9abe | 207.5 KB | HISTÓRICO |
| Libro de Ventas 21-06-2026.xlsx | 2026-06-21 | 6faf6458 | 231.0 KB | **DUPLICADO EXACTO** |
| Libro de Ventas 21-06-2026 2.xlsx | 2026-06-21 | **6faf6458** | 231.0 KB | **DUPLICADO EXACTO** del anterior |
| Libro de Ventas 30-06-2026.xlsx | 2026-06-30 | e46352c4 | 235.5 KB | HISTÓRICO ⚠️ CONFLICTO |
| Libro de Ventas 30-06-2026 - AGLM.xlsx | 2026-06-30 | fc982263 | 235.5 KB | HISTÓRICO — versión AGLM (misma fila count) |
| Libro de Ventas 20-07-2026.xlsx | 2026-07-20 | bc66405c | 241.3 KB | HISTÓRICO |
| Libro de Ventas 27 -07-2026 Actualizada.xlsx | 2026-07-27 | f6b8f570 | 291.4 KB | **VIGENTE** (más filas + más columnas) |
| Libro de Ventas 29-07-2026 - AGLM.xlsx | 2026-07-29 | 0eb0fe0a | 184.6 KB | ⚠️ CONFLICTO — ver nota |

#### Archivo adicional

| Archivo | Fecha corte | MD5 | Tamaño | Estado |
|---|---|---|---|---|
| Ventas Julio GRUPO AV LATAM.xlsx | 2026-07 | 8611122b | 16.6 KB | ⚠️ PARCIAL — solo julio, 61 filas |

**Evolución de columnas Chile VENTAS:**

| Versión | Columnas |
|---|---|
| v1 (Ventas al 012-04) | MES, Rut, Razón Social, Fecha, Región, Vendedor, Producto, UN, Documento, Folio, UM, Cantidad, Total, Precio Uni, T/C Promedio, Moneda, PAÍS, FECHA VENCIMIENTO, Negocio, Comentarios, Fecha guía |
| v2 (desde 11-05-2026) | igual pero sin T/C Promedio → agrega Fecha Pago Fct. en 20-07 |
| v3 (27-07-2026 Actualizada) | + Tipo de Cliente, % Comisión, Moto Comisión, Plazo Facturación |

⚠️ **El pipeline debe tolerar columnas faltantes** (backward compatible).

**Conflictos CL ventas:**
- `30-06-2026` vs `30-06-2026 - AGLM`: mismas filas (1,501 c/u), hashes distintos → probable diferencia en metadatos/fórmulas Excel, contenido idéntico. Usar cualquiera, marcar el otro como duplicado-meta.
- `29-07-2026 - AGLM` (1,618 filas, data hasta 27.07) vs `27-07-2026 Actualizada` (1,647 filas, misma fecha tope): **"Actualizada"** tiene 29 filas más y las nuevas columnas de comisión → es el archivo más completo. El "AGLM" 29-07 es una versión anterior del mismo período. **Vigente: 27-07 Actualizada.**

---

### 1.6 CHILE — CxC (18 archivos, dos familias)

#### Familia A: "Cuentas Cobrar 1204/1704/2904" (early, pre-mayo)

| Archivo | Fecha corte | MD5 | Filas dato | Estado |
|---|---|---|---|---|
| Cuentas Cobrar 1204.xlsx | 2026-04-12 | 0bd30c9a | 69 | HISTÓRICO |
| Cuentas Cobrar 1704.xlsx | 2026-04-17 | 46fe0dc0 | ~60 | HISTÓRICO |
| Cuentas Cobrar 2904.xlsx | 2026-04-29 | 220cb332 | ~50 | HISTÓRICO |

#### Familia B: "Cuentas Cobrar Agroveca DD-MM"

| Archivo | Fecha corte | MD5 | Filas dato | Estado |
|---|---|---|---|---|
| Cuentas Cobrar Agroveca 08-05.xlsx | 2026-05-08 | cae7de4e | ~20 | HISTÓRICO |
| Cuentas Cobrar Agroveca 17-05.xlsx | 2026-05-17 | 9827b447 | ~20 | HISTÓRICO |
| Cuentas Cobrar Agroveca 24-05.xlsx | 2026-05-24 | 19084e01 | ~20 | HISTÓRICO |
| Cuentas Cobrar Agroveca 31-05.xlsx | 2026-05-31 | df1781fa | ~20 | HISTÓRICO |
| Cuentas Cobrar Agroveca 07-06.xlsx | 2026-06-07 | bfa9a4e9 | 17 | HISTÓRICO |
| Cuentas Cobrar Agroveca 21-06.xlsx | 2026-06-21 | efc27e4a | ~20 | HISTÓRICO |

#### Familia C: "Cuentas Cobrar Agrocomercial DD-MM" (más reciente y más completa)

| Archivo | Fecha corte | MD5 | Filas dato | Estado |
|---|---|---|---|---|
| Cuentas Cobrar  AGrocomercial 08-05.xlsx | 2026-05-08 | 883a0069 | 63 | HISTÓRICO |
| Cuentas Cobrar  AGrocomercial 17-05.xlsx | 2026-05-17 | 7925a83b | ~60 | HISTÓRICO |
| Cuentas Cobrar  Agrocomercial 24-05.xlsx | 2026-05-24 | fa9eaff8 | ~60 | HISTÓRICO |
| Cuentas Cobrar  Agrocomercial 31-05.xlsx | 2026-05-31 | 8534081b | ~60 | HISTÓRICO |
| Cuentas Cobrar  Agrocomercial 07-06.xlsx | 2026-06-07 | 0e1b2f53 | 42 | HISTÓRICO |
| Cuentas Cobrar  Agrocomercial 17-06.xlsx | 2026-06-17 | 47f23ea3 | ~35 | HISTÓRICO |
| Cuentas Cobrar  Agrocomercial 21-06.xlsx | 2026-06-21 | abeabe44 | ~35 | HISTÓRICO |
| **Cuentas Cobrar  Agrocomercial 21-07.xlsx** | **2026-07-21** | **4d55e035** | **31** | **VIGENTE** |

**Columnas (idénticas en las 3 familias):**
```
Rut | Razón Social | Vendedor | Documento | Número | Días Mora |
Emisión | Vencimiento | Mes | Tramo | Estado | Condición | Total Doc
```

**⚠️ CONFLICTO CRÍTICO — Familia B vs C en mismas fechas:**

En las mismas fechas (08-05, 17-05, 24-05, 31-05, 07-06, 21-06) hay dos versiones:
- "Agroveca" (~17-20 filas) 
- "Agrocomercial" (~42-63 filas)

Las dos tienen exactamente las mismas columnas pero diferente número de registros. **Hipótesis:** son dos carteras de clientes distintas (Agroveca = cartera directa / Agrocomercial = cartera ampliada) que el sistema reporta por separado pero deben consolidarse.

**Decisión requerida de Javier:** ¿Son carteras distintas que deben sumarse, o la "Agrocomercial" supercede a "Agroveca"? El pipeline no puede asumir esto sin confirmación.

**Por ahora:** tratar como dos fuentes complementarias. La reconciliación usará Rut+Documento+Número como clave para deduplicar si hay traslape.

---

### 1.7 LIBRO BASE (1 archivo maestro)

| Archivo | MD5 | Tamaño | Estado |
|---|---|---|---|
| nuevo libro base AV 2026.xlsx | ac7118d2 | 865.7 KB | **MAESTRO** |

**Sheets y contenido:**

| Sheet | Columnas clave | Uso |
|---|---|---|
| `ventas chile 2024 2025` | PERIODO, MES, Rut, Fecha, Razón Social, Región, Vendedor, Producto, SKU, PRODUCTO AV, UN, Documento, Folio, UM, Cantidad, Total, PAÍS, Fecha Vencimiento | Histórico 2024-2025 — NO reemplazable por inbox actual |
| `ventas peru 2025` | PERIODO, FECHA EMISION, FECHA VENCIMIENTO, SERIE, FACTURA, NUMERO, DENOMINACION, DOLARES, CONCEPTO, VENDEDOR | Histórico PE 2025 |
| `Base presupuesto consolidada` | PAÍS, MONEDA, RTC, Zona, Cliente, Cultivo, SKU, Producto, Presentación, Mes, Cantidad, Precio Piso, Total Venta | Presupuesto 2026 (base detalle) |
| `Presupuesto Pais` | RTC (vendedor), ENE..DIC | **Presupuesto 2026 por vendedor/mes (CL+PE)** |
| `Pricing Piso Chile` | SKU, PRODUCTO, FORMATO, PRECIO COMPRA LO MIRANDA, COSTO, PRECIO PISO CALCULADO, PRECIO PROM REAL, PRECIO PISO PROPUESTO, MARGEN | Precios con costos (analítico) |
| `precios piso chile` | SKU, PRODUCTO, FORMATO, PRECIO PISO AV | Precios operativos (sin costos) |
| `Pricing Piso Peru` | SKU, PRODUCTO, FORMATO, COSTO USD, PRECIO PISO CALCULADO, PRECIO PROM REAL, PRECIO PISO PROPUESTO | Precios PE con costos |
| `precios piso peru` | SKU, PRODUCTO, FORMATO, PRECIO PISO AV (USD) | Precios PE operativos |
| `Listado Productos` | País, SKU, Producto, Presentación, Moneda, Precio Piso, N° Registros | Master de productos por país |

**Notas críticas:** Este es el único archivo que tiene SKU canónico para ambos países y costos de fábrica. Es la base del Libro Base actual (`avboard_data.js`). El pipeline canónico debe mantenerlo como referencia maestra de presupuesto e histórico, no sobreescribirlo.

---

### 1.8 PRECIOS PISO (2 archivos independientes)

| Archivo | MD5 | Tamaño | Contenido | Estado |
|---|---|---|---|---|
| precios piso CHile .xlsx | 4eef26b2 | 46.9 KB | SKU+Producto+Formato+Precio Piso AV (CLP) | **VIGENTE** |
| precio piso peru.xlsx | 2fde0556 | 29.3 KB | PRODUCTO+FORMATO+Precio Piso AV (USD) — **sin SKU** | **VIGENTE** |

**⚠️ Inconsistencia crítica:** `precios piso CHile.xlsx` tiene columna SKU (clave canónica). `precio piso peru.xlsx` solo tiene PRODUCTO+FORMATO (nombre libre, sin SKU). El pipeline PE no puede hacer join por SKU contra la tabla de precios standalone.

**Resolución:** usar el Libro Base (`precios piso peru` sheet) como fuente PE con SKU, ya que sí lo tiene.

---

### 1.9 ARCHIVOS NO PROCESABLES

| Archivo | MD5 | Tamaño | Tipo | Acción |
|---|---|---|---|---|
| Libro de ventas al 21-06-2026.eml | 230c5f0d | 321.2 KB | Email MIME con adjunto | Clasificar NO_RECONOCIDO. El adjunto xlsx interno debe extraerse manualmente o ignorarse si el Libro de Ventas 21-06-2026.xlsx ya está en inbox. |
| test.txt.rtf | 3be1e3c8 | 0.4 KB | RTF de prueba | Ignorar — ruido, no contiene datos |
| ~$nuevo libro base AV 2026.xlsx | — | — | Temporal Excel | Ignorar siempre |
| .DS_Store | — | — | macOS metadata | Ignorar siempre |

---

## 2. DUPLICADOS EXACTOS (mismo hash MD5)

| Hash | Archivo 1 | Archivo 2 | Acción |
|---|---|---|---|
| c9ae73a0 | AGROVECA - CUENTAS POR COBRAR AL 17..04.2025.xlsx | AGROVECA - CUENTAS POR COBRAR AL- 17..04.2025 .xlsx | Conservar el de nombre canónico (sin guión), marcar el otro como DUPLICADO — no reprocesar |
| 6faf6458 | Libro de Ventas 21-06-2026.xlsx | Libro de Ventas 21-06-2026 2.xlsx | Conservar el nombre base, marcar "2" como DUPLICADO — no reprocesar |

---

## 3. CONFLICTOS (misma fecha, contenido distinto)

| Conflicto | Archivo A | Archivo B | Veredicto |
|---|---|---|---|
| PE ventas 30.07 | 30.07.2026.xlsx (133 filas) | 30.07.2026 2.xlsx (134 filas) | **"2" es más completo** → vigente. El original → histórico descartado |
| CL ventas 30.06 | 30-06-2026.xlsx (1,501 filas) | 30-06-2026 - AGLM.xlsx (1,501 filas) | Mismo contenido, diferencia de metadatos. Usar cualquiera → v1 canónico |
| CL ventas 27/29.07 | 27-07-2026 Actualizada (1,647 filas, 25 cols) | 29-07-2026 - AGLM (1,618 filas, 22 cols) | **"Actualizada" es más completa** → vigente. AGLM 29-07 → histórico |
| CxC CL misma fecha | Agroveca [fecha] | Agrocomercial [fecha] | **Carteras distintas** — NO descartar. Reconciliar por clave Rut+Documento+Número |

---

## 4. RELACIONES ENTRE ARCHIVOS

```
LIBRO BASE ──────────────────────────────────────────────────────┐
│ ventas chile 2024-2025 → base histórica CL (no reemplazar)     │
│ ventas peru 2025 → base histórica PE (no reemplazar)           │
│ presupuesto pais → ppto por vendedor/mes (SSOT ppto)           │
│ precios piso chile/peru + SKU → SSOT precios con costos        │
└──────────────────────────────────────────────────────────────┘
         ↓ alimenta avboard_data.js actual

INBOX CHILE VENTAS (snapshots)
  Ventas al 012-04 → Libro de Ventas → ... → 27-07 Actualizada
  Acumulados: cada snapshot contiene TODO el año hasta esa fecha
  Clave: Rut + Folio (por fila)
  Join con: LIBRO BASE (SKU, presupuesto, precio piso)
  Join con: CxC CHILE (Rut + Número = misma factura)

INBOX CHILE CxC
  Cuentas Cobrar [fecha] → estado de mora por documento
  Clave: Rut + Documento + Número
  Join con: VENTAS CL (Rut + Folio → mismo documento)
  Dos fuentes paralelas: Agroveca + Agrocomercial (¿se suman?)

INBOX PERU VENTAS (snapshots)
  VENTAS FACTURADAS → AGROVECA PERU VENTAS → ... → 11.08
  Acumulados: VENTAS ACUMULADAS 2026 contiene todo YTD
  Clave: SERIE + FACTURA (E001-1141 = única)
  Join con: COBRADAS (SERIE+FACTURA → fecha de pago)
  Join con: COMISIONES (SERIE+FACTURA → comisión asignada)
  Join con: CxC PE (SERIE+NUMERO? → saldo pendiente)

INBOX PERU COBRADAS
  REPORTE VENTAS COBRADAS 2026 → facturas pagadas YTD
  Clave: SERIE + FACTURA
  Relación: subconjunto de VENTAS PE (solo las cobradas)

INBOX PERU COMISIONES
  COMISIONES TRABAJADORES 2026 → fuente actual SIC
  Clave: SERIE + FACTURA
  Contiene: cobranzas + comisiones calculadas

INBOX PERU CxC
  CUENTAS POR COBRAR [fecha] → saldo pendiente por cliente
  Clave: SER. + NUMERO (código cliente interno)
  ⚠️ Formato diferente a VENTAS (no usa SERIE+FACTURA)
  Necesita tabla de lookup: CODIGO/NOMBRE → RUC

PRECIOS PISO CL/PE
  → SSOT precios vigentes (reemplaza lo que está en Libro Base si más nuevos)
  → fuente IEC, motor SIC, módulo productos AVBOARD
```

---

## 5. DISEÑO DEL DATASET CANÓNICO

### 5.1 `ventas_canonico` (por fila de factura)

| Campo | Chile | Perú | Tipo |
|---|---|---|---|
| `record_id` | SHA256(pais+folio+rut) | SHA256(pais+serie+factura) | string |
| `pais` | "CL" | "PE" | string |
| `fecha_emision` | Fecha | FECHA EMISION | date |
| `fecha_vencimiento` | FECHA VENCIMIENTO | FECHA VENCIMIENTO | date |
| `doc_tipo` | Documento | "Factura" | string |
| `doc_serie` | — | SERIE | string |
| `doc_numero` | Folio | FACTURA | string |
| `cliente_rut_ruc` | Rut | NUMERO | string |
| `cliente_nombre` | Razón Social | DENOMINACION | string |
| `vendedor_raw` | Vendedor | VENDEDOR | string |
| `vendedor_id` | normalizado | normalizado | string |
| `producto_raw` | Producto | CONCEPTO | string |
| `sku` | SKU (si disponible) | — (extraer de CONCEPTO) | string |
| `producto_normalizado` | PRODUCTO AV | extraído | string |
| `presentacion` | UN/UM | extraída | string |
| `cantidad` | Cantidad | extraída (no nativa) | number |
| `precio_unitario` | Precio Uni | calculado | number |
| `total` | Total | DOLARES | number |
| `moneda` | CLP | USD | string |
| `mes` | MES | PERIODO (mes) | string |
| `region` | Región | — | string |
| `tipo_cliente` | Tipo de Cliente (v3+) | — | string |
| `fecha_pago` | Fecha Pago Fct. (v3+) | FECHA DE PAGO (COBRADAS) | date |
| `dias_cobranza` | calculado | DIAS (COBRADAS) | number |
| `estado_cobro` | inferido de CxC | inferido | string |
| — | | | |
| `source_file` | nombre archivo | nombre archivo | string |
| `source_type` | VENTAS_CL | VENTAS_PE | string |
| `source_hash` | MD5 | MD5 | string |
| `fecha_corte` | fecha del snapshot | fecha del snapshot | date |
| `fecha_ingesta` | timestamp proceso | timestamp proceso | datetime |
| `version_datos` | auto | auto | string |
| `flags_calidad` | lista de flags | lista de flags | string[] |

### 5.2 `cxc_canonico` (por documento pendiente)

| Campo | Chile | Perú | Tipo |
|---|---|---|---|
| `record_id` | SHA256(pais+rut+tipo_doc+numero) | SHA256(pais+codigo+serie+numero) | string |
| `pais` | CL | PE | string |
| `cliente_rut_ruc` | Rut | NOMBRE (hasta tener RUC) | string |
| `cliente_nombre` | Razón Social | NOMBRE | string |
| `vendedor_id` | normalizado | — | string |
| `doc_tipo` | Documento | TD | string |
| `doc_serie` | — | SER. | string |
| `doc_numero` | Número | NUMERO | string |
| `fecha_emision` | Emisión | FECHA | date |
| `fecha_vencimiento` | Vencimiento | VENCIM (1) | date |
| `fecha_vencimiento_real` | — | VENCIM (2) | date |
| `dias_mora` | Días Mora | calculado | number |
| `tramo` | Tramo | calculado | string |
| `estado_mora` | Estado | calculado | string |
| `saldo` | Total Doc | SALDO | number |
| `moneda` | CLP | PEN/USD | string |
| `fuente` | Agroveca/Agrocomercial | AGROVECA PE | string |
| + campos de trazabilidad estándar | | | |

### 5.3 `presupuesto_canonico` (por vendedor/mes)

| Campo | Origen |
|---|---|
| `pais` | CL / PE |
| `vendedor_id` | normalizado desde RTC |
| `mes` | ENE..DIC |
| `año` | 2026 |
| `ppto_monto` | valor mensual |
| `moneda` | CLP / USD |
| `source_file` | Libro Base / sheet Presupuesto Pais |

### 5.4 `precios_piso_canonico` (por SKU+país)

| Campo | Origen |
|---|---|
| `pais` | CL / PE |
| `sku` | SKU canónico |
| `producto` | nombre normalizado |
| `presentacion` | formato (1L, 5L, 20L…) |
| `precio_piso` | valor |
| `moneda` | CLP / USD |
| `costo_fabrica` | de Pricing sheets (si disponible) |
| `margen_calculado` | calculado si hay costo |
| `vigente_desde` | fecha del archivo |

---

## 6. CATÁLOGOS DE NORMALIZACIÓN REQUERIDOS

### 6.1 Vendedores (homologación obligatoria)

| Variantes en inbox | vendedor_id canónico | País |
|---|---|---|
| PABLO LARATRO, P LARATRO | laratro | CL |
| FRANCISCO VELASQUEZ, FRANCISCO VELÁSQUEZ | velasquez | CL |
| RODRIGO ENCINA | encina | CL |
| SERGIO MUÑOZ, SERGIO MUNOZ | munoz | CL |
| JORGE CAROCA | caroca | CL |
| MARIO VEVERKA | veverka | CL |
| FRANCO RIFFO | franco_riffo | CL |
| MAURICIO ROJAS | rojas | CL (¿activo?) |
| JAVIER ALMEIDA | almeida | CL (¿admin, no vendedor?) |
| NICOLL NAVARRO, NICOLL | navarro | PE |
| OSCAR INFANTE | infante | PE |
| LISBETH AGUIRRE, LIZBETH AGUIRRE | aguirre | PE |
| — | atalaya | PE |
| — | diaz | PE |
| — | gonzales | PE |
| — | valladares | PE |
| — | martha | PE |
| JOSE GELDRES | geldres | PE (¿activo?) |

### 6.2 Claves de documentos

| País | Clave de factura | Notas |
|---|---|---|
| CL | Rut + Folio | Rut = cliente, Folio = número correlativo |
| PE | SERIE + FACTURA | Ej: E001-1141 |

---

## 7. SNAPSHOTS VIGENTES DEFINITIVOS

| Tipo | País | Archivo vigente | Fecha corte |
|---|---|---|---|
| VENTAS | PE | AGROVECA PERU - VENTAS AL 11.08.2026.xlsx | 2026-08-11 |
| VENTAS | CL | Libro de Ventas 27-07-2026 Actualizada.xlsx | 2026-07-27 |
| CxC | CL | Cuentas Cobrar Agrocomercial 21-07.xlsx | 2026-07-21 |
| CxC | PE | AGROVECA - CUENTAS POR COBRAR AL 13..07.2026.xlsx | 2026-07-13 |
| COBRADAS | PE | AGROVECA PERU - REPORTE DE VENTAS COBRADAS 2026.xlsx | 2026-08-07 |
| COMISIONES | PE | AGROVECA PERU - COMISIONES TRABAJADORES 2026.xlsx | 2026-05 (parcial) |
| PRECIOS PISO | CL | precios piso CHile.xlsx (+ Libro Base para costos) | vigente |
| PRECIOS PISO | PE | Libro Base (precios piso peru sheet — tiene SKU) | vigente |
| PRESUPUESTO | CL+PE | Libro Base (Presupuesto Pais sheet) | 2026-01 a 12 |

---

## 8. CAMBIOS ESTRICTAMENTE NECESARIOS EN EL PIPELINE

### 8.1 Nuevo módulo: `inbox_detector.py`

**Función:** escanear /inbox, clasificar cada archivo, calcular hash, detectar duplicados y snapshots.

**Debe:**
- Reconocer archivos por estructura de columnas + nombre (nombre es señal auxiliar, no clave)
- Clasificar en: VENTAS_PE / VENTAS_CL / CXC_PE / CXC_CL / COBRADAS_PE / COMISIONES_PE / PRECIOS_PISO_CL / PRECIOS_PISO_PE / PRESUPUESTO / LIBRO_BASE / NO_RECONOCIDO
- Detectar fecha_corte desde nombre Y desde contenido (header row)
- Calcular MD5 por archivo
- Generar inventario JSON en /logs

### 8.2 Actualizar `reconciliar_ventas_cl.py`

**Cambios:**
- Aceptar ruta dinámica (snapshot vigente detectado por detector, no hardcodeado)
- Tolerar columnas opcionales (v1/v2/v3 schema)
- Normalizar vendedor_id desde catálogo
- Normalizar SKU desde Libro Base (join por Producto+Presentación)
- Generar `ventas_cl_canonico.json` con campos de trazabilidad

### 8.3 Actualizar `reconciliar_ventas_pe.py`

**Cambios:**
- Usar sheet `VENTAS ACUMULADAS 2026` del snapshot vigente
- Cruzar con `COBRADAS` (SERIE+FACTURA → fecha_pago, dias)
- Normalizar vendedor_id
- Intentar extraer producto+cantidad de CONCEPTO (best-effort, con flag si falla)
- Join con precios piso PE del Libro Base por CONCEPTO → SKU (fuzzy match con flag_calidad si ambiguo)

### 8.4 Nuevo `reconciliar_cxc_cl.py`

**Función:** consolidar ambas fuentes CxC Chile (Agroveca + Agrocomercial) con deduplicación por Rut+Documento+Número.

### 8.5 Nuevo `reconciliar_cxc_pe.py`

**Función:** procesar CxC PE (formato distinto: CODIGO/NOMBRE/SER./NUMERO/SALDO).

### 8.6 Actualizar `update_avboard.py`

**Cambios:**
- Consumir datasets canónicos (JSON) en lugar de leer Excel directamente
- No cambiar lógica de cálculo de IEC ni estructura visual

### 8.7 Sin cambios (prohibición vigente)

- sic_core.js — sin modificar
- sic_auth_backend.gs — sin modificar
- Frontend SIC — sin modificar
- Cotizador — sin modificar
- master_prices.json — sin modificar (encima de precios piso no es lo mismo)

---

## 9. IMPACTO EN AV BOARD

| Panel | Impacto | Acción requerida |
|---|---|---|
| Ventas Chile | MEDIO — pipeline ahora leerá snapshot vigente detectado automáticamente | Verificar que cifras sean idénticas tras primera corrida |
| Ventas Perú | MEDIO — idem | Verificar |
| CxC Chile | ALTO — actualmente hardcodeado; pasará a dataset canónico | Probar reconciliación CxC antes de conectar |
| CxC Perú | ALTO — sin pipeline actual; nuevo módulo | Probar antes de conectar |
| IEC | BAJO — no cambia fórmula, solo fuente de datos (mismos valores) | Verificar paridad IEC pipeline nuevo = IEC actual |
| Módulo Productos | BAJO — precios piso ya en pipeline | Verificar SKUs |
| Presupuesto | SIN CAMBIO — Libro Base sigue siendo fuente | Ninguna |

**Regla de no regresión:** la primera corrida del nuevo pipeline debe producir cifras idénticas a las actuales para ventas CL y PE. Si hay diferencia, bloquear antes de actualizar AVBOARD.

---

## 10. IMPACTO EN SIC

| Afectado | Impacto | Acción |
|---|---|---|
| Cobranzas PE | POSITIVO — pasará a usar COBRADAS (07.08) en lugar de COMISIONES (mayo) → más actualizado | Actualizar payload SIC PE cobranzas en próximo ciclo |
| Cobranzas CL | SIN CAMBIO — sigue siendo stub hasta que haya datos reales | Ninguna |
| Ventas/ppto | SIN CAMBIO — ya certificado FASE 5.4 | Ninguna |
| IEC | SIN CAMBIO — no tocar fórmula | Ninguna |
| Autenticación | SIN CAMBIO | Ninguna |

---

## 11. RIESGOS

| Riesgo | Probabilidad | Severidad | Mitigación |
|---|---|---|---|
| CxC Chile: Agroveca ≠ Agrocomercial son carteras distintas | ALTA | MEDIA | Preguntar a Javier antes de consolidar |
| PE CONCEPTO → SKU: extracción fallida para algunos productos | ALTA | BAJA | Usar flag_calidad, no bloquear pipeline |
| Schema evolution CL ventas v1→v3: columnas faltantes crashean parser | MEDIA | ALTA | Implementar con columnas opcionales + defaults |
| precio piso peru standalone sin SKU | ALTA | MEDIA | Usar Libro Base como fuente PE con SKU |
| .eml en inbox: pipeline crashea en binario no-Excel | ALTA | BAJA | Skipear extensiones no-xlsx con log |
| Snapshots acumulados PE: no sumar YTD entre archivos | — | CRÍTICA | Regla explícita: solo el snapshot más reciente como vigente |
| Reprocesamiento doble: hash idéntico → deduplicar por MD5 antes de procesar | — | ALTA | Implementar hash-check como primera validación |

---

## 12. PREGUNTA ABIERTA PARA JAVIER (bloquea diseño)

> **¿"Cuentas Cobrar Agroveca" y "Cuentas Cobrar Agrocomercial" son dos carteras de clientes distintas que deben sumarse, o la "Agrocomercial" reemplaza a "Agroveca" en las mismas fechas?**

Según los datos: en las mismas fechas la familia Agrocomercial tiene 2-3x más filas que la familia Agroveca, con los mismos vendedores pero más clientes. No hay overlap obvio de Rut+Número. Son probablemente carteras complementarias (no duplicadas), pero sin confirmación no se puede consolidar.

---

## PRÓXIMO PASO

Una vez que Javier responda la pregunta sobre CxC Chile y apruebe este diseño:

1. Implementar `inbox_detector.py`
2. Implementar `reconciliar_cxc_cl.py`
3. Actualizar `reconciliar_ventas_cl.py` y `reconciliar_ventas_pe.py`
4. Primera corrida con paridad check vs estado actual
5. Conectar AVBOARD al dataset canónico
6. Actualizar SIC cobranzas PE

**NO implementar hasta aprobación explícita de este plan.**

---

*Auditoría producida por Claude — AV LATAM Executive Intelligence — 2026-08-11*
