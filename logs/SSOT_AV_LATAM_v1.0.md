# SSOT AV LATAM — Modelo Canónico de Datos Corporativo
## Versión 1.0 — Documento de Diseño

**Clasificación:** Documento técnico de arquitectura  
**Estado:** BORRADOR — pendiente de aprobación  
**Fecha:** 2026-08-11  
**Autor:** Claude (AV LATAM Executive Intelligence)  
**Aplica a:** AV BOARD · SIC · Cotizador · IA · Automatizaciones  

---

> **ESTE DOCUMENTO ES SOLO DISEÑO.**  
> Nada aquí ha sido implementado. Ningún archivo fue modificado.  
> La implementación comenzará únicamente después de aprobación explícita.

---

## ÍNDICE

1. [Principios fundacionales](#1-principios-fundacionales)
2. [Arquitectura general](#2-arquitectura-general)
3. [Jerarquía corporativa](#3-jerarquía-corporativa-latam--país--empresa)
4. [Modelo de datos por dominio](#4-modelo-de-datos-por-dominio)
5. [Modelo de relaciones](#5-modelo-de-relaciones)
6. [Pipeline corporativo](#6-pipeline-corporativo)
7. [Reglas de consolidación](#7-reglas-de-consolidación)
8. [Estrategia de versionado](#8-estrategia-de-versionado)
9. [Estrategia de auditoría](#9-estrategia-de-auditoría)
10. [Estrategia de escalabilidad](#10-estrategia-de-escalabilidad)
11. [Compatibilidad futura con Supabase](#11-compatibilidad-futura-con-supabase)
12. [Compatibilidad con múltiples empresas y países](#12-compatibilidad-con-múltiples-empresas-y-países)
13. [Impacto sobre AV BOARD](#13-impacto-sobre-av-board)
14. [Impacto sobre SIC](#14-impacto-sobre-sic)
15. [Impacto sobre IA](#15-impacto-sobre-ia)
16. [Riesgos](#16-riesgos)
17. [Recomendaciones](#17-recomendaciones)

---

## 1. PRINCIPIOS FUNDACIONALES

### 1.1 Los diez principios

**P1 — Inbox es la única puerta de entrada**  
Todo dato que ingresa al sistema lo hace a través de `/inbox`. Ningún proceso puede consumir datos directamente desde un archivo externo sin pasar por el pipeline.

**P2 — SSOT es la única fuente de verdad**  
AV BOARD, SIC, Cotizador e IA consumen únicamente el dataset canónico. Ningún consumidor lee directamente del inbox, de archivos raw ni de normalizados.

**P3 — Nunca asumir. Siempre demostrar.**  
Las reglas de consolidación se basan en evidencia de datos, no en suposiciones sobre el nombre de los archivos. Si hay ambigüedad, se genera alerta — no se decide silenciosamente.

**P4 — Trazabilidad total**  
Todo registro canónico debe poder reconstruir su origen: archivo, fila, hash, versión, reglas aplicadas, timestamp.

**P5 — Idempotencia**  
Ejecutar el pipeline dos veces con el mismo inbox produce exactamente el mismo resultado. Sin duplicados, sin acumulación artificial.

**P6 — No regresión**  
Ningún cambio al pipeline puede romper SIC, AV BOARD, IEC, Cotizador ni la autenticación. Cada cambio requiere prueba de compatibilidad.

**P7 — Empresas primero, países después**  
Los datos existen a nivel de empresa legal. La consolidación por país y por LATAM es una capa posterior — nunca un colapso que destruya la granularidad original.

**P8 — Los snapshots no se suman; se reemplazan**  
Un archivo "VENTAS AL 11.08" no se agrega a "VENTAS AL 04.08". Reemplaza al snapshot anterior del mismo tipo+empresa+país. El histórico se conserva pero se marca como no vigente.

**P9 — Calidad antes que completitud**  
Un dato con flag de calidad es mejor que un dato inventado. El sistema prefiere reportar "DATO NO DISPONIBLE" a interpolar o asumir.

**P10 — Diseñar para Supabase desde el inicio**  
Los nombres de tablas, claves y relaciones siguen convenciones SQL desde el primer día, aunque la implementación actual sea en JSON/archivos. Migrar a Supabase no debe requerir rediseñar el modelo.

---

## 2. ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FUENTES EXTERNAS                                │
│   Agroveca CL · Agrocomercial CL · Agroveca PE · (Ecuador futuro)      │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │  archivos xlsx, csv, pdf
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            /inbox                                        │
│                  ÚNICA PUERTA DE ENTRADA OFICIAL                        │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         CAPA RAW                                         │
│  inbox_detector · clasificación · hash · metadata · registro de ingesta │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      CAPA DE NORMALIZACIÓN                               │
│  parsers por tipo · catálogos de homologación · flags de calidad        │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      CAPA DE VALIDACIÓN                                  │
│  reglas por dominio · alertas · bloqueos · data quality report          │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     CAPA DE RECONCILIACIÓN                               │
│  empresa → país → LATAM · precedencia por campo · upsert canónico       │
└───────────────────────────┬─────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     DATASET CANÓNICO (SSOT)                             │
│  ventas · cxc · cobranzas · presupuesto · precios · iec · comisiones   │
│  clientes · productos · liquidaciones · saldos · ajustes                │
└──────┬──────────────────────────────────────────────────────────────────┘
       │
       ├──────────────────────────────────┐
       │                                  │
       ▼                                  ▼
┌──────────────┐                 ┌─────────────────────┐
│  AV BOARD    │                 │       SIC            │
│  (dashboards)│                 │  (GAS Backend)       │
└──────────────┘                 └─────────────────────┘
       │                                  │
       ├─────────────┐           ┌────────┘
       │             │           │
       ▼             ▼           ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│Cotizador │  │  IA/LLM  │  │ Reportes │
└──────────┘  └──────────┘  └──────────┘
```

---

## 3. JERARQUÍA CORPORATIVA: LATAM → PAÍS → EMPRESA

### 3.1 Estructura actual

```
AV LATAM GRUPO (holding)
│  RTC / matriz: Lo Miranda
│  Participación: 45% en empresas país
│
├── CHILE
│   ├── Agroveca (Casa Matriz)
│   │   empresa_id: AGROVECA_CL
│   │   serie facturación: 1000+
│   │   RUT: [pendiente confirmar]
│   │
│   └── Agrocomercial
│       empresa_id: AGROCOMERCIAL_CL
│       serie facturación: <800
│       RUT: [pendiente confirmar]
│
├── PERÚ
│   └── Agroveca Peru S.A.C.
│       empresa_id: AGROVECA_PE
│       RUC: 20609014963
│       Serie facturación: E001-xxx
│
└── ECUADOR (futuro — evidenciado en Libro Base)
    └── [pendiente]
        empresa_id: TBD_EC
```

### 3.2 Tabla `empresas` (catálogo maestro)

| Campo | Tipo | Descripción |
|---|---|---|
| `empresa_id` | string PK | Identificador canónico (ej: AGROVECA_CL) |
| `nombre_legal` | string | Razón social legal completa |
| `pais_id` | string FK | CL / PE / EC |
| `rut_ruc` | string | Identificador fiscal |
| `moneda` | string | CLP / USD / PEN |
| `serie_facturas_min` | int | Rango mínimo de folio (para detección) |
| `serie_facturas_max` | int | Rango máximo de folio (para detección) |
| `activa` | bool | Si la empresa está operativa |
| `latam_consolidar` | bool | Si se incluye en consolidado LATAM |
| `fuentes_conocidas` | string[] | Patrones de nombre de archivo asociados |

### 3.3 Tabla `paises` (catálogo maestro)

| Campo | Tipo | Descripción |
|---|---|---|
| `pais_id` | string PK | CL / PE / EC / AR... |
| `nombre` | string | Chile / Perú / Ecuador |
| `moneda_local` | string | CLP / PEN / USD |
| `moneda_reporte` | string | Moneda usada en reportes LATAM |
| `tc_referencia` | float | Tipo de cambio a USD (actualizable) |
| `activo` | bool | Si el país está operativo |

---

## 4. MODELO DE DATOS POR DOMINIO

### Convenciones globales de trazabilidad

Todo dataset canónico incluye estos campos de trazabilidad en cada registro:

| Campo | Tipo | Descripción |
|---|---|---|
| `record_id` | string | SHA256 de la clave natural — identificador global único |
| `pais_id` | string | CL / PE / EC |
| `empresa_id` | string | AGROVECA_CL / AGROCOMERCIAL_CL / AGROVECA_PE |
| `source_file` | string | Nombre del archivo origen |
| `source_hash` | string | MD5 del archivo origen |
| `source_row` | int | Número de fila en el archivo origen |
| `source_type` | string | Tipo de fuente (VENTAS_CL / CXC_PE / etc.) |
| `fecha_corte` | date | Fecha de corte del snapshot origen |
| `fecha_ingesta` | datetime | Timestamp de procesamiento |
| `pipeline_version` | string | Versión del pipeline que lo generó |
| `rules_applied` | string[] | Lista de reglas de normalización aplicadas |
| `flags_calidad` | string[] | Alertas de calidad (DATO_PROVISIONAL / SIN_SKU / etc.) |
| `estado_registro` | string | CANONICAL / HISTÓRICO / REEMPLAZADO / CONFLICTO |
| `reemplazado_por` | string | record_id del registro que lo reemplazó |
| `created_at` | datetime | Primera vez que este registro fue creado |
| `updated_at` | datetime | Última actualización |

---

### 4.1 VENTAS

**Descripción:** Registro de cada línea de venta facturada. Granularidad: una fila por línea de producto dentro de una factura.

**Clave primaria (PK):**
```
record_id = SHA256(pais_id + empresa_id + doc_tipo + doc_numero + rut_cliente + fila_origen)
```

**Clave alternativa (AK) — para deduplicación:**
```
pais_id + empresa_id + doc_tipo + doc_numero + rut_cliente
```
(Si hay múltiples líneas por factura, la AK es + fila_origen)

| Campo | Tipo | Nulo | Fuente CL | Fuente PE |
|---|---|---|---|---|
| `pais_id` | string | NO | constante | constante |
| `empresa_id` | string | NO | AGROVECA_CL / AGROCOMERCIAL_CL | AGROVECA_PE |
| `periodo` | string | NO | MES | PERIODO |
| `mes` | int | NO | derivado | derivado |
| `año` | int | NO | derivado | derivado |
| `fecha_emision` | date | NO | Fecha | FECHA EMISION |
| `fecha_vencimiento` | date | SÍ | FECHA VENCIMIENTO | FECHA VENCIMIENTO |
| `doc_tipo` | string | NO | Documento | "Factura Electrónica" |
| `doc_serie` | string | SÍ | — | SERIE (E001) |
| `doc_numero` | string | NO | Folio | FACTURA |
| `rut_cliente` | string | NO | Rut | NUMERO (RUC) |
| `nombre_cliente` | string | SÍ | Razón Social | DENOMINACION |
| `cliente_id` | string | SÍ | normalizado | normalizado |
| `vendedor_raw` | string | SÍ | Vendedor | VENDEDOR |
| `vendedor_id` | string | SÍ | normalizado | normalizado |
| `region` | string | SÍ | Región | — |
| `tipo_cliente` | string | SÍ | Tipo de Cliente (v3+) | — |
| `producto_raw` | string | SÍ | Producto | CONCEPTO (texto libre) |
| `sku` | string | SÍ | del Libro Base | extraído de CONCEPTO |
| `producto_normalizado` | string | SÍ | PRODUCTO AV | extraído |
| `presentacion` | string | SÍ | UN/UM | extraída |
| `unidad_medida` | string | SÍ | UM | — |
| `cantidad` | float | SÍ | Cantidad | extraída (best-effort) |
| `precio_unitario` | float | SÍ | Precio Uni | calculado |
| `total` | float | NO | Total | DOLARES |
| `moneda` | string | NO | CLP | USD |
| `fecha_pago` | date | SÍ | Fecha Pago Fct. (v3+) | — |
| `negocio` | string | SÍ | Negocio | — |
| `comentarios` | string | SÍ | Comentarios | — |
| `plazo_facturacion` | string | SÍ | Plazo Facturación (v3+) | — |
| `comision_pct` | float | SÍ | % Comisión (v3+) | — |
| `comision_monto` | float | SÍ | Moto Comisión (v3+) | — |

**Relaciones:**
- → `clientes` por `(pais_id, rut_cliente)`
- → `vendedores` por `vendedor_id`
- → `productos` por `(pais_id, sku)`
- → `precios_piso` por `(pais_id, sku, periodo)`
- → `cxc` por `(empresa_id, doc_tipo, doc_numero, rut_cliente)` — estado de cobro

---

### 4.2 CXC (CUENTAS POR COBRAR)

**Descripción:** Estado de mora de documentos pendientes de cobro en un corte de fecha. Granularidad: una fila por documento (factura/nota) pendiente.

**Clave primaria:**
```
record_id = SHA256(empresa_id + rut_cliente + doc_tipo + doc_numero + fecha_corte)
```

**Clave alternativa:**
```
empresa_id + rut_cliente + doc_tipo + doc_numero
```

| Campo | Tipo | Nulo | Fuente CL | Fuente PE |
|---|---|---|---|---|
| `empresa_id` | string | NO | AGROVECA_CL / AGROCOMERCIAL_CL | AGROVECA_PE |
| `fuente_cxc` | string | NO | AGROVECA_CL / AGROCOMERCIAL_CL | AGROVECA_PE |
| `fecha_corte` | date | NO | Row 0 del archivo | del nombre |
| `rut_cliente` | string | NO | Rut | CODIGO/NOMBRE |
| `ruc_cliente` | string | SÍ | — | extraído |
| `nombre_cliente` | string | SÍ | Razón Social | NOMBRE |
| `cliente_id` | string | SÍ | normalizado | normalizado |
| `vendedor_raw` | string | SÍ | Vendedor | — |
| `vendedor_id` | string | SÍ | normalizado | — |
| `doc_tipo` | string | NO | Documento | TD |
| `doc_serie` | string | SÍ | — | SER. |
| `doc_numero` | string | NO | Número | NUMERO |
| `fecha_emision` | date | SÍ | Emisión | FECHA |
| `fecha_vencimiento` | date | SÍ | Vencimiento | VENCIM (1) |
| `fecha_vencimiento_real` | date | SÍ | — | VENCIM (2) |
| `dias_mora` | int | SÍ | Días Mora | calculado |
| `tramo` | string | SÍ | Tramo (0-30/31-60/61-90/+90) | calculado |
| `estado_mora` | string | SÍ | Estado (Normal/Riesgo/Crítico) | calculado |
| `condicion` | string | SÍ | Condición (Crédito/Contado) | — |
| `saldo` | float | NO | Total Doc | SALDO |
| `moneda` | string | NO | CLP | PEN/USD |
| `mes_referencia` | string | SÍ | Mes | calculado |

**Relaciones:**
- → `ventas` por `(empresa_id, doc_tipo, doc_numero, rut_cliente)`
- → `clientes` por `(pais_id, rut_cliente)`
- → `vendedores` por `vendedor_id`
- → `saldos` (aggregation)

---

### 4.3 COBRANZAS (VENTAS COBRADAS)

**Descripción:** Facturas que ya fueron cobradas (pagadas). Granularidad: una fila por factura cobrada. Disponible actualmente solo para Perú.

**Clave primaria:**
```
record_id = SHA256(empresa_id + doc_serie + doc_numero + fecha_pago)
```

**Clave alternativa:**
```
empresa_id + doc_serie + doc_numero
```

| Campo | Tipo | Nulo | Fuente PE |
|---|---|---|---|
| `empresa_id` | string | NO | AGROVECA_PE |
| `periodo` | string | SÍ | PERIODO |
| `fecha_emision` | date | NO | FECHA EMISION |
| `fecha_vencimiento` | date | SÍ | FECHA VENCIMIENTO |
| `fecha_pago` | date | NO | FECHA DE PAGO |
| `dias_cobranza` | int | SÍ | DIAS |
| `doc_serie` | string | NO | SERIE |
| `doc_numero` | string | NO | FACTURA |
| `ruc_cliente` | string | SÍ | NUMERO |
| `nombre_cliente` | string | SÍ | DENOMINACION |
| `monto_cobrado` | float | NO | DOLARES |
| `moneda` | string | NO | USD |
| `concepto` | string | SÍ | CONCEPTO |
| `vendedor_raw` | string | SÍ | VENDEDOR |
| `vendedor_id` | string | SÍ | normalizado |

**Relaciones:**
- → `ventas` por `(empresa_id, doc_serie, doc_numero)`
- → `clientes` por `(pais_id, ruc_cliente)`
- → `comisiones` por vendedor + ciclo (para IEC)

---

### 4.4 PRESUPUESTO

**Descripción:** Presupuesto de ventas por vendedor y mes. Granularidad: una fila por vendedor+mes+año.

**Clave primaria:**
```
record_id = SHA256(pais_id + vendedor_id + año + mes)
```

**Clave alternativa (única):**
```
pais_id + vendedor_id + año + mes
```

| Campo | Tipo | Nulo | Fuente |
|---|---|---|---|
| `pais_id` | string | NO | Libro Base / Presupuesto Pais sheet |
| `vendedor_id` | string | NO | normalizado desde RTC |
| `vendedor_raw` | string | SÍ | RTC original |
| `año` | int | NO | 2026 |
| `mes` | int | NO | 1-12 |
| `ppto_monto` | float | NO | valor mensual |
| `moneda` | string | NO | CLP / USD |
| `version` | string | SÍ | v2026-01 (fecha de la última actualización) |

**Relaciones:**
- → `vendedores` por `(pais_id, vendedor_id)`

---

### 4.5 PRODUCTOS

**Descripción:** Catálogo maestro de productos AV LATAM. Granularidad: una fila por SKU+país.

**Clave primaria:**
```
sku (canónico — global único por construcción)
```

**Clave alternativa:**
```
pais_id + nombre_normalizado + presentacion
```

| Campo | Tipo | Nulo | Descripción |
|---|---|---|---|
| `sku` | string PK | NO | AV-AMI-002-20L |
| `pais_id` | string | NO | CL / PE |
| `nombre_av` | string | NO | AV Algap 30 |
| `nombre_comercial` | string[] | SÍ | Variantes de nombre en documentos |
| `presentacion` | string | NO | 1 L / 5 L / 20 L / 200 L |
| `unidad_medida` | string | SÍ | LITROS / UNIDAD / KG |
| `categoria` | string | SÍ | Nutrición foliar / Bioestimulante… |
| `activo` | bool | NO | Si está en catálogo vigente |

---

### 4.6 CLIENTES

**Descripción:** Catálogo de clientes únicos por país. Granularidad: una fila por cliente (RUT/RUC).

**Clave primaria:**
```
cliente_id = SHA256(pais_id + rut_ruc)
```

**Clave alternativa:**
```
pais_id + rut_ruc
```

| Campo | Tipo | Nulo | Descripción |
|---|---|---|---|
| `cliente_id` | string PK | NO | identificador canónico |
| `pais_id` | string | NO | CL / PE |
| `rut_ruc` | string | NO | RUT (CL) / RUC (PE) |
| `nombre_raw` | string | SÍ | nombre como aparece en documentos |
| `nombre_normalizado` | string | SÍ | versión limpia y estandarizada |
| `nombre_aliases` | string[] | SÍ | todas las variantes encontradas |
| `region` | string | SÍ | región o departamento |
| `tipo_cliente` | string | SÍ | Cliente final / Distribuidor / Cooperativa |
| `vendedor_principal` | string | SÍ | vendedor_id con más ventas |
| `primera_compra` | date | SÍ | fecha mínima en ventas |
| `ultima_compra` | date | SÍ | fecha máxima en ventas |
| `activo` | bool | SÍ | si tiene actividad en los últimos 12 meses |

---

### 4.7 VENDEDORES

**Descripción:** Catálogo canónico de vendedores por país. Granularidad: una fila por vendedor_id.

**Clave primaria:** `vendedor_id` (string canónico, ej: `laratro`)

| Campo | Tipo | Nulo | Descripción |
|---|---|---|---|
| `vendedor_id` | string PK | NO | laratro / velasquez / aguirre… |
| `pais_id` | string | NO | CL / PE |
| `nombre_canónico` | string | NO | PABLO LARATRO |
| `nombre_aliases` | string[] | SÍ | todas las variantes de nombre en docs |
| `empresa_ids` | string[] | SÍ | empresas donde tiene ventas |
| `activo` | bool | NO | si tiene actividad vigente |
| `rol_sic` | string | SÍ | vendedor / admin / observador |

---

### 4.8 PRECIOS PISO

**Descripción:** Tabla de precios mínimos por SKU y período. Granularidad: una fila por SKU+país+vigencia.

**Clave primaria:**
```
pais_id + sku + vigente_desde
```

| Campo | Tipo | Nulo | Descripción |
|---|---|---|---|
| `pais_id` | string | NO | CL / PE |
| `sku` | string | NO | SKU canónico |
| `producto` | string | SÍ | nombre del producto |
| `presentacion` | string | NO | formato (1 L, 20 L…) |
| `precio_piso` | float | NO | precio mínimo autorizado |
| `moneda` | string | NO | CLP / USD |
| `costo_fabrica` | float | SÍ | costo Lo Miranda |
| `margen_objetivo` | float | SÍ | % margen configurado |
| `margen_calculado` | float | SÍ | margen al precio piso |
| `vigente_desde` | date | NO | fecha desde la que aplica |
| `vigente_hasta` | date | SÍ | null si es el actual |
| `fuente` | string | SÍ | archivo origen |

---

### 4.9 IEC (ÍNDICE DE EFICIENCIA COMERCIAL)

**Descripción:** Resultado del cálculo IEC por vendedor y ciclo. Una fila por vendedor+ciclo.

**Clave primaria:**
```
pais_id + vendedor_id + ciclo
```

| Campo | Tipo | Nulo | Descripción |
|---|---|---|---|
| `pais_id` | string | NO | CL / PE |
| `vendedor_id` | string | NO | vendedor canónico |
| `ciclo` | string | NO | 2026-07 |
| `ventas_periodo` | float | NO | total ventas del ciclo |
| `ventas_elegibles` | float | NO | ventas sobre precio piso (VNE) |
| `ventas_sobre_tope` | float | NO | ventas sobre precio máx (VPT) |
| `iec` | float | NO | resultado IEC (VNE/VPT) |
| `moneda` | string | NO | CLP / USD |
| `fuente_calculo` | string | NO | pipeline que generó el IEC |
| `formula_version` | string | NO | versión de la fórmula IEC aplicada |

**Regla crítica:** Existe UNA SOLA fórmula IEC oficial. Ningún dashboard ni script puede recalcularla independientemente. AV BOARD y SIC deben consumir el mismo campo `iec` del SSOT.

**Relaciones:**
- → `ventas` por `(pais_id, vendedor_id, ciclo)`
- → `precios_piso` por `(pais_id, sku, periodo)`
- → `liquidaciones` como input

---

### 4.10 COMISIONES

**Descripción:** Comisiones calculadas por vendedor y ciclo. Granularidad: una fila por vendedor+ciclo+tipo de comisión.

**Clave primaria:**
```
pais_id + empresa_id + vendedor_id + ciclo + tipo_comision
```

| Campo | Tipo | Nulo | Descripción |
|---|---|---|---|
| `pais_id` | string | NO | CL / PE |
| `empresa_id` | string | NO | empresa que paga la comisión |
| `vendedor_id` | string | NO | |
| `ciclo` | string | NO | 2026-07 |
| `tipo_comision` | string | NO | VENTAS / COBRANZA / BONO / AJUSTE |
| `base_calculo` | float | SÍ | monto sobre el que se aplica |
| `porcentaje` | float | SÍ | % de comisión |
| `monto_comision` | float | NO | monto final calculado |
| `moneda` | string | NO | CLP / USD |
| `estado` | string | NO | CALCULADA / APROBADA / PAGADA |
| `periodo_pago` | string | SÍ | cuándo se paga |

---

### 4.11 LIQUIDACIONES

**Descripción:** Resumen de liquidación por vendedor y ciclo. Agrega ventas, IEC y comisiones.

**Clave primaria:**
```
pais_id + vendedor_id + ciclo
```

| Campo | Tipo | Descripción |
|---|---|---|
| `pais_id` | string | |
| `vendedor_id` | string | |
| `ciclo` | string | 2026-07 |
| `ventas_ciclo` | float | total ventas del período |
| `ppto_ciclo` | float | presupuesto del período |
| `cumplimiento_pct` | float | % de cumplimiento |
| `iec` | float | IEC del ciclo |
| `comision_total` | float | suma de todas las comisiones |
| `cobranza_efectiva` | float | monto cobrado en el período |
| `dias_cobranza_promedio` | float | |
| `moneda` | string | |
| `estado` | string | BORRADOR / REVISIÓN / APROBADA / CERRADA |

---

### 4.12 SALDOS

**Descripción:** Saldo neto por cliente y fecha de corte (derivado de CxC y Cobranzas).

**Clave primaria:**
```
pais_id + empresa_id + cliente_id + fecha_corte
```

| Campo | Tipo | Descripción |
|---|---|---|
| `cliente_id` | string | |
| `empresa_id` | string | |
| `fecha_corte` | date | |
| `saldo_vigente` | float | documentos no vencidos |
| `saldo_0_30` | float | mora 0-30 días |
| `saldo_31_60` | float | mora 31-60 días |
| `saldo_61_90` | float | mora 61-90 días |
| `saldo_mas_90` | float | mora >90 días (crítico) |
| `saldo_total` | float | suma de todos los tramos |
| `moneda` | string | |

---

### 4.13 AJUSTES

**Descripción:** Notas de crédito, correcciones y ajustes manuales al dataset canónico.

**Clave primaria:**
```
record_id = SHA256(empresa_id + tipo_ajuste + documento_referencia + fecha_ajuste)
```

| Campo | Tipo | Descripción |
|---|---|---|
| `empresa_id` | string | |
| `tipo_ajuste` | string | NOTA_CREDITO / CORRECCION_MANUAL / DEVOLUCION |
| `documento_referencia` | string | doc_numero original afectado |
| `rut_cliente` | string | |
| `monto_ajuste` | float | positivo o negativo |
| `moneda` | string | |
| `fecha_ajuste` | date | |
| `motivo` | string | descripción libre |
| `aprobado_por` | string | quien autorizó |

---

## 5. MODELO DE RELACIONES

```
precios_piso ──────┐
                   │
productos ─────────┤
                   │
vendedores ────────┼──── ventas ─────────────── cxc
                   │       │                      │
clientes ──────────┘       │                      │
                           │                      │
                    cobranzas                  saldos
                           │
                      comisiones
                           │
                        iec
                           │
                    liquidaciones
                           │
                       ajustes
```

### 5.1 Relaciones clave

| Relación | Cardinalidad | Clave de join |
|---|---|---|
| ventas → clientes | N:1 | pais_id + rut_cliente |
| ventas → vendedores | N:1 | vendedor_id |
| ventas → productos | N:1 | pais_id + sku |
| ventas → precios_piso | N:1 | pais_id + sku + periodo |
| ventas → cxc | 1:N | empresa_id + doc_tipo + doc_numero |
| cxc → clientes | N:1 | pais_id + rut_cliente |
| cobranzas → ventas | N:1 | empresa_id + doc_serie + doc_numero |
| iec → ventas | N:N | pais_id + vendedor_id + ciclo |
| iec → precios_piso | N:N | pais_id + sku + periodo |
| comisiones → iec | N:1 | pais_id + vendedor_id + ciclo |
| liquidaciones → iec | 1:1 | pais_id + vendedor_id + ciclo |
| saldos → cxc | 1:N | empresa_id + cliente_id + fecha_corte |

---

## 6. PIPELINE CORPORATIVO

### 6.1 Etapa 1 — DETECCIÓN (inbox_detector)

**Input:** `/inbox/*`  
**Output:** `raw_registry.json`

Acciones:
1. Enumerar todos los archivos en /inbox
2. Para cada archivo: calcular MD5, obtener tamaño, extensión, fecha de modificación
3. Detectar duplicados exactos por hash
4. Clasificar en tipo de fuente:
   - Por nombre del archivo (señal auxiliar)
   - Por estructura de hojas y columnas (señal primaria)
   - Por rango de contenido (señal de validación)
5. Detectar fecha_corte (desde nombre + desde contenido)
6. Detectar empresa_id por:
   - Rango de numeración de documentos
   - RUC/RUT presente en encabezado
   - Nombre del archivo
7. Registrar en raw_registry.json con estado: RECONOCIDO / NO_RECONOCIDO / DUPLICADO
8. Generar alerta para archivos NO_RECONOCIDOS — nunca ignorarlos

**Tipos de fuente reconocidos:**
```
VENTAS_CL        → Libro de Ventas / Ventas al DD-MM
VENTAS_PE        → AGROVECA PERU - VENTAS AL DD.MM.YYYY
CXC_CL_AGROVECA  → Cuentas Cobrar Agroveca (números 1000+)
CXC_CL_AGROCOMERCIAL → Cuentas Cobrar Agrocomercial / 1204/1704/2904
CXC_PE           → AGROVECA - CUENTAS POR COBRAR AL
COBRANZAS_PE     → REPORTE DE VENTAS COBRADAS / COMISIONES TRABAJADORES
PRECIOS_PISO_CL  → precios piso CHile
PRECIOS_PISO_PE  → precio piso peru
PRESUPUESTO      → nuevo libro base AV 2026 (sheet Presupuesto Pais)
LIBRO_BASE       → nuevo libro base AV 2026
NO_RECONOCIDO    → cualquier otro
```

---

### 6.2 Etapa 2 — NORMALIZACIÓN (parsers por tipo)

**Input:** archivos clasificados por tipo  
**Output:** `normalized/{tipo}/{empresa_id}/{fecha_corte}.json`

Acciones por tipo:
- Aplicar parser específico para el tipo de fuente
- Mapear columnas a nombres canónicos (aliases catalog)
- Normalizar fechas → ISO 8601
- Normalizar montos → float (eliminar separadores, símbolos de moneda)
- Normalizar RUT/RUC → formato canónico
- Resolver vendedor_raw → vendedor_id (catálogo de homologación)
- Resolver producto_raw → sku (catálogo de productos, fuzzy si necesario)
- Asignar flags de calidad:
  - `SIN_SKU` — producto no resuelto
  - `VENDEDOR_DESCONOCIDO` — vendedor no en catálogo
  - `MONTO_CERO` — línea con total = 0
  - `DATO_PROVISIONAL` — fuente provisional
  - `EXTRACTION_FALLIDA` — parsing parcial

**Regla de schema evolution (CL ventas):**
```
v1 (hasta 11-05): 21 columnas — sin fecha_pago, sin tipo_cliente
v2 (desde 20-07): + Fecha Pago Fct.
v3 (desde 27-07): + Tipo de Cliente + % Comisión + Moto Comisión + Plazo Facturación
```
El parser detecta automáticamente la versión por presencia de columnas, no por nombre del archivo.

---

### 6.3 Etapa 3 — VALIDACIÓN (data quality engine)

**Input:** datos normalizados  
**Output:** `quality_reports/{fecha}/{tipo}.json` + alertas en `logs/alertas.md`

Validaciones por dominio:

**VENTAS:**
- Fecha emisión no futura
- Total ≥ 0 (si < 0, posible nota de crédito → flag AJUSTE_PROBABLE)
- RUT/RUC válido (algoritmo de verificación)
- Vendedor en catálogo activo
- SKU existe en PRODUCTOS (si no → flag SIN_SKU)
- No hay duplicados de doc_tipo+doc_numero en el mismo empresa_id+ciclo

**CXC:**
- Días mora ≥ 0
- Vencimiento ≥ Emisión
- Saldo > 0 (si = 0 → documento puede estar saldado, flag REVISAR)
- Consistencia de tramos (saldo en +90 → dias_mora debe ser ≥ 90)

**PRECIOS_PISO:**
- Precio > 0
- SKU en catálogo PRODUCTOS
- Margen calculado > 0 (si < 0 → ALERTA CRÍTICA precio bajo costo)

**PRESUPUESTO:**
- Suma mensual > 0 para vendedores activos
- Vendedor en catálogo

---

### 6.4 Etapa 4 — RECONCILIACIÓN

**Input:** datos validados de múltiples snapshots y empresas  
**Output:** upsert en el dataset canónico

**Regla de snapshot:**
```
Para cada (tipo, pais_id, empresa_id):
  1. Ordenar snapshots por fecha_corte DESC
  2. El más reciente = VIGENTE
  3. Anteriores = HISTÓRICO
  4. Misma fecha_corte + distinto hash = CONFLICTO → alerta + no procesar automáticamente
```

**Regla de upsert por dominio:**
```
VENTAS:
  Clave: empresa_id + doc_tipo + doc_numero + rut_cliente
  Estrategia: INSERT si no existe / UPDATE si existe y la versión es más nueva

CXC:
  Clave: empresa_id + rut_cliente + doc_tipo + doc_numero
  Estrategia: REPLACE — cada snapshot es el estado actual en esa fecha de corte
  El SSOT de CxC = snapshot más reciente disponible

PRESUPUESTO:
  Clave: pais_id + vendedor_id + año + mes
  Estrategia: INSERT OR IGNORE — el presupuesto no cambia retroactivamente salvo revisión explícita
```

**Precedencia por campo (Perú ejemplo):**
```
fecha_emision   → VENTAS (fuente más directa)
valor_venta     → VENTAS
saldo_pendiente → CXC
fecha_pago      → COBRANZAS
dias_cobranza   → COBRANZAS
precio_piso     → PRECIOS_PISO (fuente oficial)
iec             → cálculo del motor IEC único
comision        → cálculo del motor de comisiones
```

---

### 6.5 Etapa 5 — CONSOLIDACIÓN

**Nivel empresa:** los datos existen ya reconciliados por empresa.

**Nivel país:**
```
ventas_pais = UNION(ventas_empresa_1, ventas_empresa_2, ...)
cxc_pais = UNION(cxc_agroveca_cl, cxc_agrocomercial_cl)
  → deduplicar por (rut+doc_tipo+doc_numero) — probado que no hay overlap
  → conservar campo fuente_cxc para drill-down
```

**Nivel LATAM:**
```
ventas_latam = UNION por pais con conversión a moneda de reporte
  → campo pais_id siempre presente
  → campo empresa_id siempre presente
  → tipo de cambio aplicado = tc_referencia del catálogo paises
  → campo moneda_original conservado
```

**Nunca consolidar desde inbox.** La consolidación opera sobre datos canónicos de empresa, no sobre archivos crudos.

---

### 6.6 Etapa 6 — PUBLICACIÓN A SERVICIOS

**Output:** archivos JSON en `/repo/data/` + payload GAS backend (para SIC)

```
/repo/data/
  ventas_cl.json          ← consumido por AV BOARD
  ventas_pe.json          ← consumido por AV BOARD
  cxc_cl.json             ← consumido por AV BOARD
  cxc_pe.json             ← consumido por AV BOARD
  presupuesto.json        ← consumido por AV BOARD + SIC
  precios_piso.json       ← consumido por AV BOARD + IEC
  iec.json                ← consumido por AV BOARD + SIC
  clientes.json           ← consumido por Cotizador
  productos.json          ← consumido por Cotizador + AV BOARD
```

**Para SIC:** payload JSON por vendedor generado desde el SSOT y cargado vía `cargarDatosSIC()` — nunca desde Excel directamente.

---

## 7. REGLAS DE CONSOLIDACIÓN

### 7.1 Reglas de empresa → país

| Dominio | Regla |
|---|---|
| Ventas | UNION. Deduplicar por empresa_id+doc_tipo+doc_numero (sin colisión teórica entre empresas por rangos distintos). |
| CxC | UNION. Probado experimentalmente: 0 overlap entre Agroveca CL y Agrocomercial CL. Mantener `fuente_cxc`. |
| Cobranzas | Solo PE actualmente. Extensible por empresa_id. |
| Presupuesto | No aplica consolidación por empresa — el presupuesto se asigna por vendedor, no por empresa. |
| Precios Piso | Consolidar por sku: si el mismo SKU tiene precio en dos archivos, usar el más reciente (fecha_vigencia). |
| IEC | Se calcula por vendedor+ciclo a nivel LATAM, usando todos los ventas del vendedor sin distinción de empresa. |

### 7.2 Reglas de país → LATAM

| Dominio | Regla |
|---|---|
| Ventas | UNION con conversión a USD al tc_referencia. Campo moneda_original conservado. |
| CxC | UNION por país. Saldo total LATAM = suma por país. |
| Presupuesto | UNION. Cada vendedor tiene presupuesto en su moneda local. |
| Precios Piso | Catálogo separado por país. No se consolida — los precios son en moneda local. |
| IEC | Consolidación por vendedor_id (cross-country si aplica en el futuro). |

### 7.3 Reglas de integridad

1. **Nunca sumar snapshots acumulados.** Solo el snapshot más reciente es vigente.
2. **Misma fecha, distinto hash = CONFLICTO.** No procesar automáticamente.
3. **Hash idéntico = DUPLICADO.** No reprocesar. Registrar en log.
4. **Campo requerido ausente = flag_calidad**, no error fatal. El pipeline continúa.
5. **Documento no homologado = flag VENDEDOR_DESCONOCIDO / SIN_SKU.** Se incorpora con flag, no se descarta.

---

## 8. ESTRATEGIA DE VERSIONADO

### 8.1 Ciclo de vida de un registro

```
RAW          → archivo detectado y registrado en inbox
NORMALIZADO  → datos parseados y mapeados a esquema canónico
VALIDADO     → reglas de calidad aplicadas, flags asignados
CANONICAL    → registro activo en el SSOT, versión vigente
HISTÓRICO    → reemplazado por una versión más reciente del mismo dato
REEMPLAZADO  → explícitamente marcado como obsoleto (corrección manual)
CONFLICTO    → dos fuentes contradictorias sin resolución automática
```

### 8.2 Versión de dataset

```
version_datos = {tipo}_{empresa_id}_{fecha_corte}_{pipeline_run}
Ejemplo: VENTAS_CL_AGROVECA_2026-07-27_20260811T233500Z
```

### 8.3 Versión de archivo fuente

Cada archivo tiene:
```json
{
  "source_file": "Libro de Ventas 27 -07-2026 Actualizada.xlsx",
  "source_hash": "f6b8f570",
  "source_version": "VENTAS_CL_AGROCOMERCIAL_2026-07-27",
  "fecha_corte": "2026-07-27",
  "fecha_ingesta": "2026-08-11T23:35:00Z",
  "estado": "VIGENTE",
  "reemplaza_a": "Libro de Ventas 20-07-2026.xlsx"
}
```

### 8.4 Reconstrucción histórica

El sistema debe poder responder: "¿Cuál era el dataset canónico de ventas Chile al 15 de junio de 2026?"

Para ello: conservar todos los snapshots procesados con su estado (VIGENTE / HISTÓRICO). El snapshot vigente a una fecha dada es el más reciente cuya `fecha_corte` ≤ fecha consultada.

---

## 9. ESTRATEGIA DE AUDITORÍA

### 9.1 Preguntas que todo registro debe responder

| Pregunta | Campo |
|---|---|
| ¿De qué archivo vino? | `source_file` |
| ¿Qué fila originó el dato? | `source_row` |
| ¿Qué versión del archivo? | `source_hash` |
| ¿Qué pipeline lo procesó? | `pipeline_version` |
| ¿Cuándo? | `fecha_ingesta` |
| ¿Qué reglas se aplicaron? | `rules_applied` |
| ¿Qué modificaciones sufrió? | `flags_calidad` |
| ¿Fue reemplazado? | `estado_registro` + `reemplazado_por` |

### 9.2 Logs del sistema

**`/logs/update_log.txt`** — log operativo, append-only
```
[2026-08-11T23:35:00Z] RUN pipeline v1.0
  archivos detectados: 78
  reconocidos: 74
  no reconocidos: 4 (.eml, .rtf, .~$, .DS_Store)
  duplicados: 2
  vigentes procesados: 12
  registros upserted: 2,847
  alertas generadas: 3
```

**`/logs/resumen_actualizacion.md`** — resumen ejecutivo, append-only (Gerencia General)

**`/logs/alertas.md`** — alertas activas, actualizar solo si hay cambios

**`/logs/quality_report_{fecha}.md`** — informe de calidad por corrida

### 9.3 Inmutabilidad de logs

Los logs son **append-only**. Nunca sobrescribir. El historial de corridas es evidencia operativa.

---

## 10. ESTRATEGIA DE ESCALABILIDAD

### 10.1 Dimensión: más empresas

El modelo soporta nuevas empresas sin cambios de schema:
1. Agregar fila en `empresas` con el nuevo `empresa_id`
2. Definir rango de numeración de documentos
3. Agregar patrones de nombre de archivo en `fuentes_conocidas`
4. El detector y los parsers recogen la nueva empresa automáticamente

### 10.2 Dimensión: más países

1. Agregar fila en `paises`
2. Crear parser para el formato local de ventas y CxC
3. Agregar reglas de homologación de vendedores y productos
4. El pipeline de consolidación LATAM incluye el nuevo país automáticamente

### 10.3 Dimensión: más dominios

Nuevos dominios (ej: INVENTARIO, DEVOLUCIONES) se agregan como nuevos datasets canónicos con los campos estándar de trazabilidad. No requieren cambios a los dominios existentes.

### 10.4 Dimensión: más volumen

El diseño JSON por archivo es adecuado hasta ~50,000 registros/dominio. A mayor escala:
- Migrar a Supabase (ver Sección 11)
- Mantener el mismo schema — solo cambia el motor de almacenamiento

### 10.5 Dimensión: más frecuencia

El pipeline es idempotente. Se puede ejecutar diariamente, semanalmente o en tiempo real sin efectos secundarios.

---

## 11. COMPATIBILIDAD FUTURA CON SUPABASE

### 11.1 Principio de diseño

El modelo de datos está diseñado desde el inicio con convenciones SQL/PostgreSQL, aunque la implementación actual sea en JSON. Migrar a Supabase no debe requerir rediseñar el modelo — solo reescribir las capas de lectura/escritura.

### 11.2 Mapeo JSON → Supabase

| Archivo JSON actual | Tabla Supabase |
|---|---|
| `ventas_cl.json` | `ventas` (con pais_id='CL') |
| `ventas_pe.json` | `ventas` (con pais_id='PE') |
| `cxc_cl.json` | `cxc` (con pais_id='CL') |
| `precios_piso.json` | `precios_piso` |
| `presupuesto.json` | `presupuesto` |
| `empresas` | `empresas` |
| `paises` | `paises` |
| `vendedores` | `vendedores` |
| `clientes` | `clientes` |
| `productos` | `productos` |

### 11.3 Convenciones ya adoptadas

- Nombres de campos en `snake_case`
- PKs como SHA256 (strings) — compatibles con UUID si se quiere migrar
- Timestamps en ISO 8601
- Booleanos como `bool` (no 0/1)
- Arrays como `string[]` — equivale a `jsonb` en PostgreSQL
- Campos de auditoría estándar (`created_at`, `updated_at`, `estado_registro`)

### 11.4 Row Level Security (Supabase RLS)

El modelo ya incluye `pais_id` y `empresa_id` en todos los registros. Esto permite configurar RLS directamente:
```sql
-- Un usuario de Chile solo ve datos de Chile
CREATE POLICY "pais_isolation" ON ventas
  USING (pais_id = current_setting('app.pais_id'));
```

### 11.5 Supabase Edge Functions

En el futuro, las funciones del pipeline (detector, parsers, reconciliador) pueden migrar a Edge Functions de Supabase, mantiendo el mismo contrato de entrada/salida.

### 11.6 Autenticación

El sistema SIC usa autenticación propia (GAS + hash + sesión). Con Supabase, se puede migrar a Supabase Auth (JWT) manteniendo los mismos roles:
```
role: admin → acceso total
role: vendedor → solo su pais_id + vendedor_id
role: viewer → solo lectura
```

---

## 12. COMPATIBILIDAD CON MÚLTIPLES EMPRESAS Y PAÍSES

### 12.1 Diseño multi-empresa (ya implementado en el modelo)

El campo `empresa_id` es parte de la clave en todos los dominios relevantes. La jerarquía `empresa_id → pais_id → LATAM` está embebida en cada registro.

No existe ningún punto del modelo donde se asuma empresa única. Los catálogos (`empresas`, `paises`) definen explícitamente las entidades activas.

### 12.2 Diseño multi-país (ya implementado)

El campo `pais_id` está presente en todos los dominios. Los catálogos de vendedores, productos y clientes son por país.

Para agregar Ecuador:
1. Insertar en `paises`: `{pais_id: "EC", moneda_local: "USD"}`
2. Insertar empresas Ecuador en `empresas`
3. Crear parsers para el formato de archivos Ecuador
4. Los dashboards LATAM incluirán EC automáticamente

### 12.3 Multi-moneda

El campo `moneda` está en todos los registros monetarios. La conversión ocurre solo en la consolidación LATAM y se conserva la moneda original. El `tc_referencia` en `paises` es actualizable sin cambio de schema.

---

## 13. IMPACTO SOBRE AV BOARD

### 13.1 Cambios requeridos

| Componente | Cambio | Impacto |
|---|---|---|
| Fuente de datos | Leer desde `/repo/data/*.json` (SSOT) en lugar de archivos Excel directamente | MEDIO |
| Ventas Chile | Mismo parser de datos, nueva ruta de fuente | BAJO |
| Ventas Perú | Mismo parser de datos, nueva ruta de fuente | BAJO |
| CxC Chile | Nueva fuente unificada (Agroveca + Agrocomercial) — saldo total mayor | ALTO |
| CxC Perú | Mismo parser, nueva ruta | BAJO |
| IEC | Ya calculado en SSOT — AV BOARD solo consume el campo `iec` | BAJO |
| Módulo Productos | Consume `precios_piso.json` del SSOT — sin cambio en visualización | BAJO |
| Presupuesto | Consume `presupuesto.json` del SSOT | BAJO |

### 13.2 Lo que NO cambia

- Estructura HTML/CSS de los dashboards
- Lógica de visualización y cálculo de KPIs
- Chart.js, configuración de gráficos
- Autenticación
- Estructura de carpetas `/repo`

### 13.3 Verificación de no regresión

Antes de conectar AV BOARD al SSOT, ejecutar una corrida completa del pipeline y comparar:
- Total ventas CL: debe ser igual al actual
- Total ventas PE: debe ser igual al actual
- IEC: debe ser igual al actual
- CxC Chile: será mayor (suma de dos empresas) — esto es correcto, no un error

---

## 14. IMPACTO SOBRE SIC

### 14.1 Cambios requeridos

| Componente | Cambio | Impacto |
|---|---|---|
| Fuente de datos vendedor | Leer payload desde SSOT (ventas + presupuesto + iec + cobranzas) | BAJO |
| Cobranzas PE | Cambiar de COMISIONES_TRABAJADORES a COBRANZAS (más actualizado) | BAJO |
| Cobranzas CL | Incorporar saldo CxC Chile del SSOT (cuando haya datos reales) | BAJO |
| IEC | Ya viene del SSOT — no recalcular en SIC | NINGUNO |
| Autenticación | Sin cambio | NINGUNO |
| Backend GAS | Sin cambio en estructura | NINGUNO |
| `cargarDatosSIC()` | Los payloads se generan desde el SSOT, no desde Excel | BAJO |

### 14.2 Lo que NO cambia

- sic_core.js — sin modificar
- sic_auth_backend.gs — sin modificar
- Frontend SIC — sin modificar
- Fórmula IEC — sin modificar
- Motor de comisiones — sin modificar
- Estructura de usuarios y sesiones
- Backend GAS deployment

### 14.3 Beneficio inmediato para SIC

Los payloads por vendedor se generan automáticamente desde el SSOT en cada corrida del pipeline. Esto elimina el proceso manual de `_cargarDatosSICLote()` — que en el futuro será ejecutado por el pipeline, no manualmente.

---

## 15. IMPACTO SOBRE IA

### 15.1 El SSOT habilita IA real

Con el SSOT implementado, la IA (Claude) puede:
- Responder preguntas sobre ventas, clientes, productos, cobranzas con datos reales
- Detectar anomalías en tendencias de ventas vs presupuesto
- Identificar clientes en riesgo de mora antes de que venza
- Sugerir ajustes de precios piso basados en rentabilidad real
- Comparar ciclos: "¿cómo están los vendedores vs el mismo período del año anterior?"

### 15.2 Contexto que la IA necesita del SSOT

- **Ventas:** tendencias por vendedor, producto, cliente
- **CxC:** aging de cartera, clientes críticos
- **Presupuesto:** gap vs actual
- **IEC:** performance comercial
- **Precios piso:** margen real vs margen objetivo
- **Clientes:** concentración, riesgo, evolución

### 15.3 Principio de IA sobre SSOT

La IA no debe interpretar archivos raw. Siempre consume datos canónicos validados. Esto garantiza que las respuestas de la IA sean coherentes con los dashboards y los reportes.

---

## 16. RIESGOS

### 16.1 Riesgos técnicos

| Riesgo | Probabilidad | Severidad | Mitigación |
|---|---|---|---|
| Schema evolution de archivos fuente sin notificación | ALTA | MEDIA | Parser con columnas opcionales + flag de versión detectada |
| Snapshot acumulado con dato retroactivo corregido | MEDIA | ALTA | El SSOT toma siempre el más reciente — si hay corrección, se carga snapshot nuevo |
| Dos archivos del mismo período con distinto contenido (conflicto) | MEDIA | ALTA | Alerta obligatoria — no procesar automáticamente, esperar decisión humana |
| Archivo .eml o no-xlsx en inbox | ALTA | BAJA | Detector lo clasifica NO_RECONOCIDO, continúa con el resto |
| Vendedor nuevo no en catálogo | ALTA | BAJA | Flag VENDEDOR_DESCONOCIDO, catálogo actualizable en caliente |
| Producto sin SKU (especialmente PE CONCEPTO) | ALTA | MEDIA | Flag SIN_SKU, dato incluido con flag, mejorar extracción iterativamente |
| IEC calculado distinto entre pipeline y motor actual | BAJA | CRÍTICA | Verificar paridad ANTES de desactivar el motor actual |

### 16.2 Riesgos operativos

| Riesgo | Probabilidad | Severidad | Mitigación |
|---|---|---|---|
| Archivo depositado en inbox con nombre cambiado | ALTA | BAJA | Detección por estructura, no por nombre |
| Archivo corrupto o incompleto | MEDIA | MEDIA | Validación de integridad antes de procesar, alerta si falla |
| Inbox muy grande (>200 archivos) | MEDIA | BAJA | El detector procesa todos sin límite — solo más tiempo |
| Doble ejecución del pipeline | BAJA | NINGUNA | Idempotencia garantizada por hash-check y upsert |
| Pérdida de historial | BAJA | CRÍTICA | Nunca sobrescribir — solo marcar como HISTÓRICO |

### 16.3 Riesgos de negocio

| Riesgo | Probabilidad | Severidad | Mitigación |
|---|---|---|---|
| CxC Chile subestimada actualmente (faltaba Agroveca) | CONFIRMADO | ALTA | El nuevo SSOT corrige esto — avisar que el número subirá |
| Cobranzas PE usando COMISIONES en lugar de COBRADAS | CONFIRMADO | MEDIA | Reemplazar fuente en próxima corrida |
| Presupuesto desactualizado para H2 2026 | MEDIA | MEDIA | Solicitar actualización del Libro Base |
| IEC diferente entre AV BOARD y SIC | BAJA | ALTA | Motor único en SSOT elimina este riesgo |

---

## 17. RECOMENDACIONES

### 17.1 Antes de implementar

1. **Confirmar razón social legal** de Agroveca CL vs Agrocomercial CL (impacta nomenclatura en dashboards)
2. **Confirmar vendedores activos** en Chile — hay variantes (MAURICIO ROJAS, JUAN PABLO NEIRA, RAYEN BERNAZAR, EN TERRENO 1, CAPEL) que no están en el SIC actual
3. **Confirmar presupuesto vigente** — el Libro Base tiene ppto hasta diciembre 2026 pero algunos meses tienen 0 (especialmente segunda mitad)
4. **Confirmar tipo de cambio** para consolidación LATAM (CLP/USD referencia)

### 17.2 Orden de implementación sugerido (post-aprobación)

**Sprint 1 — Infraestructura base:**
1. `inbox_detector.py` con clasificación y raw_registry
2. Parser VENTAS_CL (con schema evolution)
3. Parser VENTAS_PE (con extracción de CONCEPTO)
4. Dataset canónico ventas (JSON)
5. Verificación de paridad vs avboard_data.js actual

**Sprint 2 — CxC y Cobranzas:**
6. Parser CXC_CL (Agroveca + Agrocomercial unificados)
7. Parser CXC_PE
8. Parser COBRANZAS_PE
9. Dataset canónico CxC y cobranzas

**Sprint 3 — Precios y catálogos:**
10. Parser PRECIOS_PISO (CL + PE)
11. Catálogo de productos con SKU
12. Catálogo de vendedores (homologación)
13. Catálogo de clientes

**Sprint 4 — IEC y conexión a servicios:**
14. Motor IEC único (basado en ventas canónicas + precios piso canónicos)
15. Generador de payloads SIC desde SSOT
16. Conexión AV BOARD al SSOT

**Sprint 5 — Calidad y automatización:**
17. Data quality report automático
18. Scheduler del pipeline (cron/schedule tool)
19. Alertas proactivas

### 17.3 Principios de implementación

- **Nunca romper antes de tener el reemplazo funcionando.** Los cambios son aditivos hasta que el SSOT esté verificado.
- **Paridad primero.** La primera corrida del pipeline debe producir números idénticos a los actuales para todos los KPIs ya validados.
- **Una corrida en seco antes de conectar.** El pipeline se ejecuta, genera JSON, y se compara manualmente con el estado actual antes de que cualquier consumidor lo lea.
- **Incrementos pequeños y verificables.** Cada sprint entrega algo funcionando y verificado, no un sistema completo que se prueba al final.

---

## GLOSARIO

| Término | Definición |
|---|---|
| SSOT | Single Source of Truth — el dataset canónico |
| Raw | Dato tal como llegó del inbox, sin transformar |
| Normalizado | Dato parseado, columnas mapeadas, tipos corregidos |
| Canónico | Dato validado, reconciliado, vigente en el SSOT |
| Snapshot | Archivo que refleja el estado de los datos en una fecha de corte |
| Idempotente | Que produce el mismo resultado sin importar cuántas veces se ejecute |
| Upsert | INSERT si no existe, UPDATE si ya existe |
| Empresa_id | Identificador canónico de la entidad legal (AGROVECA_CL, AGROCOMERCIAL_CL, AGROVECA_PE) |
| Pais_id | Identificador de país (CL, PE, EC) |
| Vendedor_id | Identificador canónico de vendedor (laratro, aguirre, etc.) |
| Record_id | SHA256 de la clave natural — identificador global único e inmutable |
| Flag de calidad | Marcador que indica un problema o limitación en el dato, sin invalidarlo |
| IEC | Índice de Eficiencia Comercial — ventas elegibles / ventas sobre precio tope |
| tc_referencia | Tipo de cambio de referencia para consolidación LATAM |
| LATAM | Consolidación total del grupo, todos los países |

---

## APROBACIÓN

> **Pendiente de revisión y aprobación por Javier Almeida**  
> Antes de comenzar cualquier implementación.

**Versión:** 1.0  
**Próxima acción:** Revisión → Feedback → Aprobación → Sprint 1  

---

*Documento producido por Claude — AV LATAM Executive Intelligence — 2026-08-11*
