# Informe Técnico — ventas_cl_parser.py
**Sprint 1 Stage 2 · AV LATAM Executive Intelligence Pipeline**
**Generado:** 2026-08-13

---

## Ejecución

| Campo | Valor |
|---|---|
| Archivo leído | `Libro de Ventas 12-08-2026 - AGLM.xlsx` |
| Fuente | `pipeline/raw_registry.json` → vigente VENTAS_CL\|AGROCOMERCIAL_CL |
| Versión de esquema detectada | **v20** (20 columnas transaccionales) |
| Empresa | AGROCOMERCIAL_CL |
| País | CL |
| Moneda | CLP |
| Fecha de corte | 2026-08-12 |

## Filas

| Concepto | Cantidad |
|---|---|
| Filas raw (sin header) | 1,708 |
| Filas procesadas | **1,707** |
| Filas descartadas | 1 |
| — fila_vacía | 1 |

## Totales

| Concepto | Valor |
|---|---|
| **Total CLP** | **$ 414,135,939** |
| Verificación vs AVBOARD YTD | ✅ Coincide (±2M tolerancia) |

## Vendedores encontrados (10)

| Vendedor (raw) | SIC ID | Total CLP |
|---|---|---|
| PABLO LARATRO | laratro | $ 153,416,249 |
| JORGE CAROCA | caroca | $ 106,679,873 |
| FRANCISCO VELASQUEZ | velasquez | $ 97,770,000 |
| RODRIGO ENCINA | encina | $ 42,390,161 |
| IVAN VEVERKA | veverka | $ 9,103,600 |
| VALENTINA MUÑOZ | munoz | $ 4,236,056 |
| JAVIER ALMEIDA | almeida | $ 540,000 |
| RAYEN BERNAZAR | bernazar | $ 0 |
| EN TERRENO 1 | terreno_1 | $ 0 |
| LABORATORIO | laboratorio | $ 0 |

Vendedores sin SIC ID: **ninguno** ✅

## Esquemas soportados

| Schema | Columnas | Archivos en inbox |
|---|---|---|
| v20 | 20 (estándar vigente) | 7 |
| v21 | 21 (+Fecha Pago Fct.) | 1 |
| v25 | 25 (+Tipo Cliente, Comisión, Plazo) | 1 |
| vSUMARIO | 10 (presupuesto/cumplimiento) | 5 — rechazado, no transaccional |

## Advertencias

### ⚠ FOLIO_NULO (1 fila)
Una fila sin número de folio. Se procesa y se asigna tx_id basado en fecha+rut+producto+cantidad. No bloquea el pipeline.

### ⚠ TX_ID_DUPLICADO (6 hashes repetidos = 12 filas)
Filas con contenido idéntico en la fuente Excel:
- **Folio 185** (5 pares): mismas 5 líneas de producto aparecen dos veces exactas. Probable: copia accidental en el libro fuente.
- **Folio 736** (1 par): línea duplicada exacta.

El parser **preserva todas las filas** tal como están en la fuente. La deduplicación es responsabilidad del **Reconciliador (Stage 4)**, no del parser.

## Outputs generados

| Archivo | Filas | Columnas |
|---|---|---|
| `pipeline/canonical/ventas_cl.parquet` | 1,707 | 30 |
| `pipeline/canonical/ventas_cl.csv` | 1,707 | 30 |

### Columnas canónicas (30)
`tx_id`, `empresa_id`, `pais_id`, `moneda`, `fecha_corte`, `mes`, `rut_cliente`, `razon_social`, `fecha_tx`, `region`, `vendedor_raw`, `vendedor_id`, `tipo_cliente`, `producto`, `unidad_negocio`, `tipo_doc`, `folio`, `unidad_medida`, `cantidad`, `total_clp`, `precio_unitario`, `moneda_doc`, `pais_doc`, `fecha_venc`, `negocio`, `comentarios`, `fecha_guia`, `fecha_pago_fct`, `pipeline_version`, `archivo_fuente`

## Decisiones técnicas

- **No deduplicar en el parser**: el parser preserva la fuente fiel. La deduplicación es del reconciliador.
- **tx_id incluye cantidad**: para distinguir dos líneas del mismo producto en el mismo folio (multi-línea legítima).
- **vSUMARIO rechazado**: los 5 archivos con formato presupuesto/cumplimiento no son transaccionales. Si el vigente fuera uno de ellos, el parser retorna error claro.
- **Vendedores no reconocidos → advertencia, no error**: el pipeline no se detiene, pero el ID SIC queda nulo.
