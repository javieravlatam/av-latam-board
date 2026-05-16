# AVBOARD — Reglas de Negocio
**Agroveca Grupo LATAM · Motor de inteligencia comercial 2026**
Versión: 1.0 · Fecha: 2026-05-15

---

## 1. IEC — Índice de Eficiencia Comercial

### 1.1 Definición

El IEC mide qué porcentaje del valor vendido en productos con precio piso fue facturado **a precio igual o superior al piso mínimo**.

Es el indicador central de disciplina de precios del equipo comercial.

### 1.2 Fórmula IEC Global

```
IEC = Σ (Venta sobre piso)  /  Σ (Venta elegible)

Donde:
  Venta elegible   = líneas de factura cuyo producto tiene precio piso definido
  Venta sobre piso = monto de líneas donde precio de venta ≥ precio piso
  Venta bajo piso  = monto de líneas donde precio de venta < precio piso
  
Identidad matemática: SP + BP = Elig (siempre)
```

### 1.3 Fórmula IEC por Factura (folio)

```
IEC_factura = Σ SP (líneas de ese folio)  /  Σ Elig (líneas de ese folio)

Interpretación: qué % del valor elegible de esa factura cumplió precio piso
```

### 1.4 Elegibilidad de una línea

Una línea de venta es **elegible** si el producto tiene un precio piso definido en la tabla vigente para ese país. Productos sin precio piso son excluidos del cálculo y aparecen en el tab "Cobertura" del Panel IEC.

### 1.5 Impacto por línea

```
Impacto negativo de una línea = t.bp / Σ Elig total del período
(% de puntos porcentuales que esa línea resta al IEC global)

Impacto positivo de un folio = f.sp / Σ Elig total del período
(% de puntos porcentuales que ese folio suma al IEC global)

Propiedad: suma de todos los impactos negativos = 1 − IEC
           suma de todos los impactos positivos  = IEC
```

---

## 2. Factores IEC — Escala de Comisión

El factor IEC determina el multiplicador de comisión aplicable al vendedor según su IEC del período.

| IEC del vendedor | Factor (% de comisión base) |
|---|---|
| Menor a 70% | **20%** |
| 70% — 84.9% | **70%** |
| 85% — 91.9% | **80%** |
| 92% — 94.9% | **90%** |
| 95% o más | **105%** |

**En código:**
```javascript
function getFactor(iec) {
  if (iec < 0.70) return 20;
  if (iec < 0.85) return 70;
  if (iec < 0.92) return 80;
  if (iec < 0.95) return 90;
  return 105;
}
```

**Interpretación ejecutiva:**
- Factor 20%: vendedor con severa disciplina de precios — casi toda su venta está bajo piso
- Factor 70%: en zona de alerta — más de 15% de su venta bajo piso
- Factor 80%: aceptable — entre 8% y 15% bajo piso
- Factor 90%: bueno — menos del 8% bajo piso
- Factor 105%: referente — vendedor que supera la política de precios en casi toda su venta

---

## 3. Simulación IEC — Escenarios de Mejora

El Panel IEC incluye 3 escenarios de simulación que responden a la pregunta: ¿cuánto mejoraría el IEC si se hubieran respetado los precios piso en ciertos casos?

### Fórmula de simulación

```
IEC_sim = (SP_total + BP_recuperado) / Elig_total

Donde BP_recuperado = suma del BP de los casos seleccionados
      (si hubieran cumplido piso, ese BP se convierte en SP)
```

**Propiedades garantizadas:**
- `IEC_sim ≥ IEC` siempre (solo puede mejorar)
- `IEC_sim ≤ 100%` siempre
- `Mejora = IEC_sim − IEC ≥ 0`

### Los 3 escenarios

**Escenario 1 — Top 3 facturas críticas:** tomar las 3 facturas con mayor monto bajo piso y simular que cumplieron. Muestra el impacto de los folios más problemáticos.

**Escenario 2 — Top 5 SKUs críticos:** tomar los 5 productos con mayor acumulación de venta bajo piso en el período y simular que todas sus líneas cumplieron. Muestra el impacto de corregir los productos más conflictivos.

**Escenario 3 — Top 3 clientes críticos:** tomar los 3 clientes con mayor monto bajo piso y simular que todas sus líneas cumplieron. Muestra el impacto de negociar precio con los clientes más problemáticos.

---

## 4. Score de Clientes — Fórmula

El score es un índice sintético de salud comercial de 0 a 100 que integra 5 dimensiones.

### 4.1 Fórmula de Score Total

```
Score = IEC_score × 30% + Frecuencia_score × 25% + CxC_score × 25%
      + Diversificación_score × 10% + Volumen_score × 10%
```

### 4.2 Conversión de IEC a IEC_score (0–100)

| IEC del cliente | IEC_score |
|---|---|
| 0% | 0 |
| 0–70% | Interpolación lineal: (IEC / 70%) × 50 |
| 70–85% | Interpolación lineal: 50 + ((IEC−70%) / 15%) × 25 |
| 85–92% | Interpolación lineal: 75 + ((IEC−85%) / 7%) × 15 |
| 92–100% | Interpolación lineal: 90 + ((IEC−92%) / 8%) × 10 |
| 100% | 100 |

### 4.3 Conversión de Frecuencia a Frecuencia_score

```
Frecuencia = meses_activos / 5   (YTD 5 meses)
Frecuencia_score = Frecuencia × 100

Ejemplos:
  5/5 meses activos → score 100
  3/5 meses activos → score 60
  1/5 meses activos → score 20
```

### 4.4 Conversión de CxC a CxC_score

| Estado mora del cliente | CxC_score |
|---|---|
| Sin deuda / sin datos | 75 (neutro) |
| Pagado adelantado o al día (0-30d) | 100 |
| 31–60 días vencido | 50 |
| 61–90 días vencido | 25 |
| Más de 90 días vencido | 0 |

### 4.5 Conversión de Diversificación a Div_score

```
Div_score basado en número de productos distintos comprados YTD:
  1 producto   → 10
  2 productos  → 30
  3 productos  → 50
  4 productos  → 70
  5+ productos → 90–100
```

### 4.6 Conversión de Volumen a Vol_score

Basado en percentil del cliente dentro de su país (Chile o Perú), comparando YTD en moneda local. El cliente de mayor venta obtiene 100; el menor, un score mínimo proporcional.

---

## 5. Estados Semafóricos de Clientes

El campo `estado` clasifica a cada cliente en una de 6 categorías:

| Estado | Código | Criterio |
|---|---|---|
| 🔴 Crítico | `critico` | Mora >90 días O (mora >60d Y IEC crítico) |
| 🟠 Riesgo | `riesgo` | Mora 61–90 días O (mora >30d Y IEC bajo 43%) |
| 🟡 Alerta | `alerta` | Mora 31–60 días O IEC bajo 70% |
| ⚪ Sin datos | `sin_datos` | Sin compras YTD o sin información suficiente |
| 🔵 Oportunidad | `oportunidad` | Cliente dormido o con baja frecuencia pero buen IEC histórico |
| 🟢 OK | `ok` | Todos los indicadores dentro de parámetros normales |

**Prioridad de asignación:** si un cliente tiene mora crítica Y IEC bajo, prevalece `critico`.

---

## 6. Clientes Dormidos

Un cliente se considera **dormido** cuando:
- Tiene compras históricas en el sistema (aparece en `CLIENTES_CL` o `CLIENTES_PE`)
- No registra compras en los últimos 2 meses del período activo

En la práctica para el período Ene–May 2026: cliente dormido = sin compras en Abril y Mayo.

La recomendación automática para clientes dormidos es `💤 Reactivación` — contacto proactivo del vendedor.

---

## 7. Recomendaciones Comerciales Automáticas (Panel Clientes)

Las recomendaciones se generan por prioridad descendente. Se muestra la primera que aplique.

| Prioridad | Condición | Recomendación |
|---|---|---|
| 1 | Mora crítica (>60d) + cliente top revenue | 🔴 Riesgo estratégico — gestión directa urgente |
| 2 | Mora crítica (>60d) | 🔴 Mora crítica — escalar a cobranza |
| 3 | Mora alta (>30d) | ⚠️ Priorizar cobranza antes de venta nueva |
| 4 | Mora media (>0d) | 📋 Seguimiento CxC — coordinar pago |
| 5 | IEC crítico (<43%) + top revenue | 🔴 Urgente: pricing fuera de política en cliente clave |
| 6 | IEC crítico (<43%) | ⚠️ Revisar política de precio con el cliente |
| 7 | IEC bajo (<70%) | 💡 Ajustar condiciones de venta |
| 8 | Sin IEC + top revenue | ❓ Incluir en política IEC |
| 9 | Cliente mono-producto + no dormido | 📦 Cross-selling — ampliar portafolio |
| 10 | Cliente dormido | 💤 Reactivación urgente |
| 11 | Score alto + IEC bueno + frecuencia alta + sin mora | 🚀 Cliente estratégico — mantener y expandir |
| 12 | Score alto + sin mora + sin IEC bajo | 💰 Potencial de crecimiento — propuesta de volumen |
| 13 | (ninguna aplica) | ✅ Sin acciones urgentes |

---

## 8. Recomendaciones Automáticas IEC por Vendedor (Panel IEC)

Se generan hasta 6 recomendaciones para el vendedor seleccionado:

| Condición | Recomendación |
|---|---|
| IEC < 43% | 🔴 Pricing fuera de política — plan de acción inmediato |
| IEC < 70% | ⚠️ Revisar pricing — IEC bajo 70% |
| IEC ≥ 92% | ✅ Excelente disciplina de precios |
| Cliente con BP > 10% del total | ⚠️ Cliente crítico — renegociar condiciones |
| SKU con BP > 8% del total | 📦 SKU destructivo — revisar precio mínimo |
| >65% líneas OK pero IEC < 85% | 💡 Oportunidad de mix — focos específicos |
| Líneas con gap > 20% (pv < pp×0.80) | 💸 Exceso de descuento — verificar autorización |
| Facturas limpias (IEC=100%) con IEC global < 85% | ✅ Facturas modelo — replicar práctica |

---

## 9. Reglas CxC — Cuentas por Cobrar

### 9.1 Tramos de Antigüedad

| Tramo | Descripción | Impacto en cliente |
|---|---|---|
| Al día | Vencimiento futuro o 0–30d | Normal |
| 31–60d | Mora leve | Alerta |
| 61–90d | Mora media | Riesgo |
| >90d | Mora crítica | Crítico |

### 9.2 Fuentes de CxC Chile (2 entidades)

- **Agrocomercial:** clientes directos de la línea Agrocomercial
- **Agroveca Chile:** clientes de la línea Agroveca

Ambas se consolidan. El total CxC Chile es la suma de ambas entidades.

### 9.3 Supra (factoring)

Algunos saldos están cedidos a Supra (factoring) y se excluyen de la gestión directa. Se identifican con `nota: "⚫ PAGADO A SUPRA — factoring"` en el sistema. No se cobran directamente al cliente.

### 9.4 Clientes CxC sin match de ventas

Existen clientes con saldo CxC pero sin compras en el YTD activo. Se agrupan como `CXC_SIN_MATCH_CL` en el sistema y se tratan como clientes en seguimiento.

---

## 10. Tipo de Cambio y Monedas

| País | Moneda | Tipo de cambio referencia |
|---|---|---|
| Chile | CLP (peso chileno) | — |
| Perú | USD (dólar americano) | 1 USD = 950 CLP |

El tipo de cambio de referencia se almacena en `avboard_data.js → meta.tc_clp_usd = 950`. Para conversiones consolidadas LATAM se usa este TC.

---

## 11. Interpretación Comercial — Guía de Lectura

### ¿Qué significa un IEC bajo?

Un IEC bajo no siempre significa que el vendedor esté negociando mal. Puede indicar:
1. El precio piso estaba fijado por encima del precio de mercado para ese producto
2. El cliente negoció condiciones especiales que no están reflejadas en el sistema
3. Hay descuentos autorizados que el sistema no conoce
4. El vendedor genuinamente está cediendo precio sin autorización

El Panel IEC permite identificar cuál de estos casos aplica mirando: el gap%, la concentración en pocos SKUs o clientes, y la evolución histórica.

### ¿Qué significa un IEC de 100%?

El cliente o vendedor facturó toda su venta elegible a precio igual o superior al piso. Es el estándar objetivo. No implica que el precio sea óptimo — solo que respeta la política mínima.

### ¿Por qué hay clientes sin IEC?

47 clientes Chile y 21 clientes Perú no tienen IEC porque:
- Sus productos no tienen precio piso definido, o
- El nombre del producto en el sistema contable no pudo mapearse al catálogo de precios piso

Estos clientes no están excluidos del sistema — aparecen con `iec.pct = null` y su score se calcula con IEC neutro (50 puntos).

### Lectura de la simulación: ¿qué escenario elegir?

- **Escenario facturas:** útil si hay pocas facturas grandes que arrastran el IEC. Acción: renegociar esas facturas puntualmente.
- **Escenario SKUs:** útil si un producto específico está sistemáticamente fuera de piso. Acción: revisar si el precio piso de ese producto es realista.
- **Escenario clientes:** útil si un cliente específico concentra el problema. Acción: visita comercial focalizada.

El escenario con mayor mejora indica dónde está la palanca de corrección más eficiente.

---

*Documento generado por Claude · Agroveca AVBOARD 2026*
