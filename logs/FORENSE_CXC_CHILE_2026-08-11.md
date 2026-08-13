# INFORME FORENSE — CxC CHILE: Agroveca vs Agrocomercial
**Fecha:** 2026-08-11  
**Método:** Análisis de intersección por Rut+Documento+Número, cruce con Libro de Ventas, cruce con Libro Base  
**Conclusión:** al final del documento  
**NO se implementó ninguna regla. NO se asumió nada.**

---

## 1. EVIDENCIA CUANTITATIVA — 6 fechas con ambos archivos

| Fecha | Agroveca (filas) | Agrocomercial (filas) | Docs en AMBOS | Solo Agroveca | Solo Agrocomercial |
|---|---|---|---|---|---|
| 08-05 | 23 | 61 | **0** | 23 | 57 |
| 17-05 | 22 | 63 | **0** | 22 | 59 |
| 24-05 | 22 | 53 | **0** | 22 | 49 |
| 31-05 | 22 | 47 | **0** | 22 | 43 |
| 07-06 | 17 | 42 | **0** | 17 | 40 |
| 21-06 | 28 | 26 | **0** | 28 | 24 |

**En los 6 pares de fechas analizados: 0 documentos en común.** La intersección Rut+Documento+Número es vacía en todos los casos.

---

## 2. EVIDENCIA — RANGOS DE NÚMERO DE DOCUMENTO

Los números de factura revelan sistemas de facturación completamente distintos:

| Familia | Rango de Números | Ejemplos |
|---|---|---|
| CxC **Agroveca** | **1100 – 1600** | 1302, 1328, 1426, 1507, 1539, 1558 |
| CxC **Agrocomercial** | **137 – 755** | 207, 272, 453, 525, 641, 750 |
| CxC **early (1204/1704/2904)** | **250 – 619** | 250, 341, 453, 525, 602 |

Los rangos **no se solapan**. No existe un número de documento presente en Agroveca que también aparezca en Agrocomercial.

---

## 3. EVIDENCIA — CRUCE CON LIBRO DE VENTAS 2026

El Libro de Ventas 2026 (inbox) registra ventas con dos Unidades de Negocio:

| UN en Libro Ventas | Filas | Rango de Folios |
|---|---|---|
| Agroveca | 1,058 | 0 – 756 |
| Agrocomercial | 576 | 58 – 763 |
| Laboratorio | 12 | — |

### Cruce CxC Agrocomercial → Libro Ventas 2026

Los 31 números únicos de CxC Agrocomercial (vigente 21-07) se cruzaron contra los folios del Libro Ventas 2026:

- **29 de 31 números encontrados** como Folios en el Libro Ventas 2026
- Distribución: 37 filas de UN=Agroveca + 23 filas de UN=Agrocomercial

**Conclusión:** Los números del CxC Agrocomercial **son los folios del Libro de Ventas 2026**. Son el mismo sistema de facturación.

### Cruce CxC Agroveca → Libro Ventas 2026

Los 17 números únicos de CxC Agroveca (vigente 07-06) se cruzaron contra los folios del Libro Ventas 2026:

- **0 de 17 números encontrados**

**Conclusión:** Los números del CxC Agroveca **NO pertenecen al sistema que genera el Libro de Ventas 2026**.

---

## 4. EVIDENCIA — CRUCE CON LIBRO BASE 2024-2025

Se buscaron los 15 folios únicos del CxC Agroveca en el Libro Base (ventas chile 2024-2025):

| Folio | Cliente | Vendedor | Fecha emisión | UN en Libro Base |
|---|---|---|---|---|
| 1302 | AGRICOLA SAN PEDRO SPA | PABLO LARATRO | 18/08/2025 | **Casa Matriz** |
| 1303 | SOCIEDAD AGRICOLA ESPERANZA SPA | PABLO LARATRO | 18/08/2025 | **Casa Matriz** |
| 1305 | AGRICOLA TRES SOLES S A | JORGE CAROCA | 19/08/2025 | **Casa Matriz** |
| 1328 | MAGALY DEL CARMEN ORELLANA PINO | JORGE CAROCA | 29/08/2025 | **Casa Matriz** |
| 1348 | JOSE CRISTOBAL GONZALEZ CORREA | JORGE CAROCA | 08/09/2025 | **Casa Matriz** |
| 1426 | AGROINSUMOS KULLIN SPA | PABLO LARATRO | 21/09/2025 | **Casa Matriz** |
| 1459 | SOC AGRICOLA PALO ALTO LIMITADA | PABLO LARATRO | 03/10/2025 | **Casa Matriz** |
| 1495 | SOC AGRICOLA PALO ALTO LIMITADA | PABLO LARATRO | 14/10/2025 | **Casa Matriz** |
| 1506 | ANGELA MARIA DIAZ SCHMIDT AGR. E.I.R.L. | FRANCO RIFFO | 20/10/2025 | **Casa Matriz** |
| 1507 | AGROCOMERCIAL POLANCO SPA | FRANCO RIFFO | 20/10/2025 | **Casa Matriz** |
| 1522 | RAMADA DE CAMPOS SPA | JORGE CAROCA | 24/10/2025 | **Casa Matriz** |
| 1525 | SOC AGRICOLA PALO ALTO LIMITADA | PABLO LARATRO | 27/10/2025 | **Casa Matriz** |
| 1539 | AGROINSUMOS KULLIN SPA | PABLO LARATRO | 11/11/2025 | **Casa Matriz** |
| 1545 | ANGELA MARIA DIAZ SCHMIDT AGR. E.I.R.L. | IVÁN VEVERKA | 21/11/2025 | **Casa Matriz** |
| 1549 | ANGELA MARIA DIAZ SCHMIDT AGR. E.I.R.L. | IVÁN VEVERKA | 28/11/2025 | **Casa Matriz** |

**15/15 folios encontrados. Todos con UN="Casa Matriz". Todos emitidos entre agosto y noviembre 2025.**

Los folios 1558 y 1559 (también en CxC Agroveca pero más recientes) NO aparecen en el Libro Base 2024-2025, lo que indica que el Libro Base tiene corte en ~noviembre 2025.

---

## 5. EVIDENCIA — ARCHIVOS EARLY (1204/1704/2904)

Los tres archivos anteriores al renombramiento tienen:
- Números en rango **250–619** (mismo rango Agrocomercial)
- Vendedores: FRANCISCO VELASQUEZ, JAVIER ALMEIDA, JORGE CAROCA, PABLO LARATRO, RODRIGO ENCINA... (mismo set Agrocomercial)
- Estructura idéntica al CxC Agrocomercial

**Conclusión:** Los archivos "Cuentas Cobrar 1204/1704/2904" **son la misma familia que Agrocomercial**, solo con un nombre diferente antes del cambio de nomenclatura. Son continuos.

---

## 6. EVIDENCIA — CLIENTES EN COMÚN, DOCUMENTOS DISTINTOS

Cuando el mismo cliente (RUT) aparece en ambas familias, sus documentos son **distintos** (ningún folio en común):

| Fecha | RUT | Razón Social | Docs Agroveca | Docs Agrocomercial | Overlap |
|---|---|---|---|---|---|
| 08-05 | 11.673.695-0 | MAGALY ORELLANA PINO | [1328] | [272] | 0 |
| 08-05 | 77.582.414-K | AGROINSUMOS KULLIN SPA | [1426, 1539] | [414, 415, 416] | 0 |
| 08-05 | 77.598.960-2 | AGROCOMERCIAL LOMA LARGA LTDA | [1499, 1500] | [341, 354, 403] | 0 |
| 07-06 | 77.582.414-K | AGROINSUMOS KULLIN SPA | [1426, 1539] | [414, 415, 416] | 0 |
| 07-06 | 6.725.491-0 | JOSE GONZALEZ CORREA | [1348] | [494] | 0 |
| 21-06 | 11.673.695-0 | MAGALY ORELLANA PINO | [1328] | [272] | 0 |

El cliente MAGALY ORELLANA PINO (RUT 11.673.695-0) tiene:
- Folio **1328** en Agroveca: emitido 29/08/2025, CLP 518,087 acumulado
- Folio **272** en Agrocomercial: emitido 17/10/2025, CLP 182,047

**Son dos facturas distintas emitidas a la misma persona por dos entidades distintas, en fechas distintas.**

---

## 7. EVIDENCIA — VENDEDORES EXCLUSIVOS DE CADA SISTEMA

Vendedores que aparecen **solo** en Agroveca (y no en Agrocomercial) de forma consistente:
- **FRANCO RIFFO** (4 de 6 fechas)
- **IVÁN VEVERKA** / **IVAN VEVERKA** — aparece en ambos pero con acento distinto (¿un bug de normalización?)
- **CAPEL**, **GUILLERMO PRADENAS**, **JOSELIN MUÑOZ**, **JOSÉ LORENZONI** (en 21-06 solamente — posiblemente gestores de cobro externos)

Vendedores que aparecen **solo** en Agrocomercial de forma consistente:
- **FRANCISCO VELASQUEZ** (5 de 6 fechas)
- **RODRIGO ENCINA** (5 de 6 fechas)
- **RAYEN BERNAZAR** (3 de 6 fechas)
- **OFICINA** (categoría especial)
- **JAVIER ALMEIDA** (aparece también en archivos early)
- **EN TERRENO 1** (categoría especial)
- **MAURICIO ROJAS** (en early y Agrocomercial)

**IVÁN VEVERKA vs IVAN VEVERKA:** el mismo vendedor con y sin tilde aparece en distintos archivos. En Agroveca siempre "IVÁN" (con acento), en Agrocomercial a veces "IVAN" (sin acento). Misma persona, normalización inconsistente.

---

## 8. MAPA TEMPORAL

```
2024                    2025 (ago-nov)          2025-2026
├─ Libro Base ──────────────────────────────────────────────┤
│  UN=Casa Matriz                                           │
│  Folios 1100-1600 (generados en ago-nov 2025)            │
│  → Estos folios quedan como CxC pendiente en Agroveca     │
└───────────────────────────────────────────────────────────┘

               2025-2026
               ├─ Agrocomercial (sistema alterno) ──────────────────┤
               │  Folios 137-763 (serie propia, ≠ Casa Matriz)      │
               │  Primero llamado "Cuentas Cobrar 1204/1704/2904"   │
               │  Luego "Cuentas Cobrar Agrocomercial DD-MM"        │
               │  Coincide con folios del Libro de Ventas 2026      │
               └────────────────────────────────────────────────────┘
```

---

## 9. CONCLUSIÓN DEFINITIVA

### Hipótesis descartadas

- ❌ **Un reporte reemplaza al otro** — imposible: 0 documentos en común en todas las fechas analizadas. Si uno reemplazara al otro, los mismos documentos deberían aparecer en ambos.

- ❌ **Uno es subconjunto del otro** — imposible: sin ningún documento compartido, ninguno puede ser subconjunto del otro.

- ❌ **Son dos carteras distintas del mismo sistema** — descartado: los rangos de numeración son distintos (1100-1600 vs 137-755) e identifican sistemas de facturación independientes.

### Hipótesis confirmada

✅ **Son dos razones sociales distintas (o dos sistemas de facturación independientes) cuyos documentos son mutuamente exclusivos**

**CxC "Agroveca"** = Cartera de facturas emitidas por **Agroveca (entidad Casa Matriz)**, con serie de numeración 1100+, vigentes desde 2025. Estas facturas aparecen en el Libro Base 2024-2025 con UN="Casa Matriz" pero NO en el Libro de Ventas 2026. Son facturas 2025 no cobradas que siguen vigentes en 2026.

**CxC "Agrocomercial"** = Cartera de facturas emitidas por **Agrocomercial** (entidad separada), con serie de numeración <800, vigentes desde 2025-2026. Estas facturas SÍ coinciden con folios del Libro de Ventas 2026 (sistema de facturación activo).

**Los archivos "Cuentas Cobrar 1204/1704/2904"** = familia Agrocomercial bajo nombre anterior. Mismos números, mismos vendedores.

---

## 10. REGLA DE PIPELINE — DEMOSTRADA CON DATOS

La regla que se puede demostrar con evidencia es:

> **Las dos carteras deben UNIRSE (UNION), no reemplazarse.**  
> Ninguna puede descartarse sin perder facturas reales.  
> La clave de deduplicación global es: `pais + fuente + rut + documento_tipo + número`.  
> Dado que los rangos son distintos, no habrá colisiones — pero el pipeline debe verificar siempre.

**Campo `fuente`** necesario en dataset CxC canónico:
- `AGROVECA_CL` para los archivos serie 1100+
- `AGROCOMERCIAL_CL` para los archivos serie <800

**El saldo total real de CxC Chile = CxC Agroveca + CxC Agrocomercial** (sin doble conteo, confirmado por 0 overlap).

**Ejemplo 08-05:**
- CxC Agroveca: CLP 66,586,259
- CxC Agrocomercial: CLP 68,112,335
- **Total real CxC Chile: CLP 134,698,594**
- (No es CLP 68M ni CLP 66M — ambas son parciales)

---

## 11. PREGUNTA RESIDUAL PARA JAVIER

> La evidencia confirma que son dos sistemas distintos. Sin embargo, no está claro si representan:
> (a) **Dos razones sociales legales distintas** (ej: "Agroveca S.A." y "Agrocomercial Lo Miranda S.A.")  
> (b) **Una misma empresa con dos facturadores electrónicos distintos** (ej: DTE por dos sistemas)
>
> Esto no cambia la regla del pipeline (siempre UNION), pero es relevante para la nomenclatura en dashboards y reportes: ¿se muestran separados o consolidados bajo "Chile"?

---

*Informe producido por Claude — AV LATAM Executive Intelligence — 2026-08-11*  
*Basado en análisis de 6 pares de archivos + cruce con Libro de Ventas 2026 + Libro Base 2024-2025*
