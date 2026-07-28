# Guía de Actualización de Política SIC-AV

**Gobernanza:** Todo cambio a los factores del SIC requiere autorización escrita del Gerente General (`javier@agrovecalatam.com`). Ningún otro rol puede modificar estos archivos.

---

## Archivos fuente (uno por país)

| País | Archivo |
|------|---------|
| Chile | `apps/sic_av/data/parametros_chile.json` |
| Perú | `apps/sic_av/data/parametros_peru.json` |

El SIC lee estos archivos en tiempo real cada vez que se abre el dashboard. Cualquier cambio aquí se refleja inmediatamente en todos los cálculos de comisión.

---

## Qué controla cada campo

### 1. `tasa_cartera` — Edad de cartera (comisión base)

Define el porcentaje de comisión según los días de antigüedad de la factura.

```json
"tasa_cartera": [
  { "max_dias": 0,    "tasa": 8   },   // Contado
  { "max_dias": 30,   "tasa": 7.5 },   // 1–30 días
  { "max_dias": 180,  "tasa": 6   },   // 31–180 días
  { "max_dias": 210,  "tasa": 3   },   // 181–210 días
  { "max_dias": 360,  "tasa": 2.5 },   // 211–360 días
  { "max_dias": null, "tasa": 0.5 }    // Más de 360 días
]
```

`max_dias: 0` = Contado (pagado el mismo día o antes del vencimiento).
`max_dias: null` = sin límite superior (último tramo).

---

### 2. `factor_presupuesto_tramos` — Factor de Presupuesto

Multiplica la comisión base según el % de cumplimiento del presupuesto mensual.

```json
"factor_presupuesto_tramos": [
  { "min_cumpl": 0,   "max_cumpl": 89.99, "factor": 0   },  // < 90%: sin comisión
  { "min_cumpl": 90,  "max_cumpl": 99.99, "factor": 80  },  // 90–99.9%: 80%
  { "min_cumpl": 100, "max_cumpl": null,  "factor": 100 }   // ≥ 100%: 100%
]
```

---

### 3. `factor_iec_tramos` — Factor IEC (Índice de Eficiencia de Cobranza)

Ajusta la comisión según la calidad de la cobranza. Puede superar el 100% (premio).

```json
"factor_iec_tramos": [
  { "min_iec": 0,  "max_iec": 69.99, "factor": 20  },
  { "min_iec": 70, "max_iec": 84.99, "factor": 70  },
  { "min_iec": 85, "max_iec": 91.99, "factor": 80  },
  { "min_iec": 92, "max_iec": 94.99, "factor": 90  },
  { "min_iec": 95, "max_iec": null,  "factor": 105 }   // IEC ≥ 95%: premio
]
```

---

### 4. `bono_excedente_pct` — Bono por Excedente de Venta

Porcentaje adicional que se paga sobre la venta neta que supera el 100% del presupuesto.

```json
"bono_excedente_pct": 2
```

Ejemplo: si el vendedor vendió $120,000 con presupuesto de $100,000, el excedente es $20,000. El bono = $20,000 × 2% = $400.

---

### 5. `diferido_trimestral` — Bono de Consistencia Trimestral

Define cuánto de la comisión diferida se libera al cierre del trimestre.

```json
"diferido_trimestral": {
  "liberacion": [
    { "min_cumpl": 100, "max_cumpl": 104.99, "pct_liberacion": 50  },
    { "min_cumpl": 105, "max_cumpl": 109.99, "pct_liberacion": 75  },
    { "min_cumpl": 110, "max_cumpl": null,   "pct_liberacion": 100 }
  ],
  "iec_minimo": 95,
  "condiciones": ["cartera_estandar", "sin_observaciones_financieras_graves"]
}
```

---

## Cómo hacer una actualización

### Paso 1 — Identifica qué cambiar

Decide cuál de los 5 bloques anteriores necesita cambio y los valores nuevos.

### Paso 2 — Abre el archivo JSON

```
apps/sic_av/data/parametros_chile.json   ← Chile
apps/sic_av/data/parametros_peru.json    ← Perú
```

### Paso 3 — Si cambias `tasa_cartera`, registra en el historial

**Este paso es obligatorio.** Antes de modificar `tasa_cartera`, agrega una entrada al array `tasa_cartera_historial` con la versión anterior (para conservar trazabilidad):

```json
"tasa_cartera_historial": [
  {
    "version": "SIC-AV V1.4",            // versión anterior (la que ya existe)
    "vigente_desde": "2026-07-28",
    "autor": "javier@agrovecalatam.com",
    "nota": "Descripción del cambio anterior...",
    "tabla": [ /* copia exacta de la tabla anterior */ ]
  },
  {
    "version": "SIC-AV V1.5",            // versión nueva
    "vigente_desde": "YYYY-MM-DD",       // fecha de hoy
    "autor": "javier@agrovecalatam.com",
    "nota": "Describe qué cambió y por qué.",
    "tabla": [ /* nueva tabla */ ]
  }
]
```

Luego actualiza `tasa_cartera` con la nueva tabla activa.

### Paso 4 — Actualiza los campos de versión

```json
"version_politica": "SIC-AV V1.5",
"version_vigente_desde": "YYYY-MM-DD",
"version_autor": "javier@agrovecalatam.com",
"politica_vigente_desde": "YYYY-MM-DD",
"advertencia": "POLITICA OFICIAL — Aprobada por Gerencia General (javier@agrovecalatam.com) el YYYY-MM-DD. ..."
```

### Paso 5 — Avisa a Claude

Carga el archivo actualizado al inbox o compártelo en chat. Claude verificará consistencia, actualizará `sic_politica.html` si corresponde y generará el commit.

---

## Versión actual (Chile)

| Campo | Valor |
|-------|-------|
| Versión | SIC-AV V1.4 |
| Vigente desde | 28/07/2026 |
| Autor | javier@agrovecalatam.com |
| Estado | Vigente — Aprobada por Gerencia General |

---

## Historial de versiones

| Versión | Vigente desde | Cambio principal |
|---------|--------------|-----------------|
| SIC-AV V1.4 | 28/07/2026 | Versión inaugural oficial. Elimina tag demostrativo. Tasa cartera: Contado 8%, 1–30d 7.5%, 31–180d 6%, 181–210d 3%, 211–360d 2.5%, +360d 0.5%. |

*(Actualizar esta tabla cada vez que se registre una nueva versión en `tasa_cartera_historial`.)*
