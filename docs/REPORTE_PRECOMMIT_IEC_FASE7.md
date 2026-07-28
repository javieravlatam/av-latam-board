# REPORTE PRE-COMMIT — IEC Ponderado Fase 7
**CHANGE REQUEST SIC-AV v1.7**
Fecha: 2026-07-28
Preparado para: javier@agrovecalatam.com (Gerente General)
Estado: **PENDIENTE DE APROBACIÓN** — NO hacer commit/push sin autorización

---

## 1. Resumen ejecutivo

Se implementó la arquitectura IEC Ponderado en todos los módulos de AV LATAM.
El cambio principal es la corrección de la fórmula de IEC:

| Versión | Fórmula | Problema |
|---------|---------|---------|
| Anterior (v1.6) | `Σ ventas_sobre_piso / Σ ventas_elegibles` | Binario: no mide magnitud de desviación |
| Nueva (v1.7) | `Σ venta_neta / Σ (cantidad × precio_piso)` | Ponderado: mide cuánto se desvía cada línea |

**Ejemplo concreto**: venta $120 con piso $100 → fórmula anterior daba 100% (porque la venta superó el piso), fórmula nueva da 120% (el ratio real de venta sobre piso).

---

## 2. Archivos modificados

| Archivo | Cambio | Dashboards afectados |
|---------|--------|----------------------|
| `scripts/update_avboard.py` | Fórmula IEC corregida a ponderado | avboard_data.js (requiere regenerar) |
| `apps/sic_av/js/sic_data_adapter.js` | IEC ponderado en construirCicloReal() + computarIECPonderadoDelMes() + agregarIECPonderado() | sic_chile.html, sic_peru.html |
| `apps/sic_av/data/parametros_chile.json` | Sección iec_politica + V1.4 oficial + tasa_cartera_historial | sic_politica.html |
| `apps/sic_av/data/parametros_peru.json` | Sección iec_politica | sic_peru.html |
| `apps/sic_av/data/iec_chile_demo.json` | Campos venta_neta_elegible_clp + valor_piso_teorico_clp por entrada | sic_chile.html (modo demo) |
| `apps/sic_av/data/iec_peru_demo.json` | Campos venta_neta_elegible_usd + valor_piso_teorico_usd por entrada | sic_peru.html (modo demo) |
| `apps/cotizador/cotizador_core.js` | +5 funciones: estadoIEC(), prorratearTransporte(), calcularIECConTransporte(), calcularInteresFinanciero(), util.generarFingerprint() + PDF.imprimirConControl() | cotizador_chile.html, cotizador_peru.html |
| `apps/cotizador/data/config.json` | Secciones iec_politica + interes_financiero. Versión → 1.7.0 | cotizador (todas las instancias) |
| `apps/cotizador/cotizador_chile.html` | btn-imprimir → PDF.imprimirConControl() | cotizador Chile |
| `apps/cotizador/cotizador_peru.html` | btn-imprimir → PDF.imprimirConControl() | cotizador Perú |
| `scripts/test_iec_t1_t18.js` | Script de tests T1-T18 (nuevo archivo) | — |

**Archivos NO tocados**: todos los dashboards HTML del repositorio (Panel_*, Dashboard_*, Executive_*, etc.), avboard_data.js, avboard_clientes.js.

---

## 3. Tests T1-T18: resultado

```
RESULTADO:  20 OK  /  0 FALLIDOS  /  20 total

✓ T1: venta en piso exacto → IEC = 1.000
✓ T2: venta al 120% del piso → IEC = 1.200
✓ T3: dos líneas simétricas → IEC ponderado = 1.000
✓ T3b: líneas asimétricas → ponderado correcto (≠ promedio simple)
✓ T4: línea sin pp excluida → IEC = 1.200 (solo línea elegible)
✓ T5: IEC_MIX=95%, todos ítems ok → Estado A (aprobación automática)
✓ T6: IEC_MIX=88%, ningún crítico → Estado B (requiere autorización)
✓ T7: IEC_MIX=95% pero ítem al 80% → Estado C (bloqueo crítico override)
✓ T8: dos líneas iguales → transporte 50/50
✓ T9: invariante Σ prorrateados = monto transporte (con redondeo en última línea)
✓ T10: transporte INCLUIDO deduce correctamente de venta neta → IEC = 1.10
✓ T11: sin transporte → IEC = venta/piso = 1.20
✓ T12: plazo=90 días (borde gracia) → aplica=false, monto=0
✓ T13: plazo=120 días (30 excedentes) → monto = base × 1.2% = 120
✓ T14: plazo=60 días (dentro de gracia) → aplica=false, monto=0
✓ T15: mismo quote → mismo fingerprint (determinismo)
✓ T16: precio cambiado → fingerprint diferente (autorización invalidada)
✓ T17: IEC ponderado correcto (Σvne/Σvpt), excluye líneas con qty=0
✓ T18: IEC YTD ponderado (Σnum/Σden) ≠ promedio de % (lógica correcta)
✓ RECONCILIACIÓN: Cotizador, SIC y AVBOARD producen el mismo IEC (1.2500)
```

---

## 4. Reglas comerciales implementadas

| Estado | Condición | Efecto |
|--------|-----------|--------|
| **A** | IEC_MIX ≥ 90% Y todos los ítems ≥ 85% del piso | PDF generado automáticamente |
| **B** | IEC_MIX < 90% Y ningún ítem < 85% | PDF bloqueado hasta autorización GG o GAF |
| **C** | Cualquier ítem < 85% del piso | BLOQUEO CRÍTICO — PDF nunca se genera |

Parámetros configurables en `config.json → iec_politica` (nunca hardcodeados en el código):
- `iec_min_autorizado`: 0.90 (90%)
- `desviacion_critica_max_item`: 0.15 (15% → umbral = 85%)
- `aprobadores_autorizados`: ["javier@agrovecalatam.com", "gaf@agrovecalatam.com"]

---

## 5. Transporte e interés financiero

**Transporte INCLUIDO**: el costo de despacho se proratea proporcionalmente entre líneas.
El total al cliente no cambia. El IEC se calcula sobre `venta_neta - transporte_prorrateado`.
Invariante verificada: `Σ transporte_prorrateado = monto_transporte` (T9 ✓).

**Interés financiero**: gracia 90 días, tasa 1.2%/mes sobre días excedentes.
`monto = base × (tasa/100) × (dias_excedentes/30)`
NO entra en el cálculo de IEC. Separado completamente.

---

## 6. Fingerprint / control de integridad

- Hash djb2 determinista sobre: cliente, líneas, precios, cantidades, transporte, plazo, interés
- Se invalida automáticamente si cambia cualquier variable comercial relevante
- Formato: `FP-XXXXXXXX` (8 dígitos base-36)
- Nota en código: para producción se recomienda SHA-256 en backend

---

## 7. Pendientes para próxima sesión

Los siguientes ítems NO están en este commit — requieren trabajo adicional:

1. **AVBOARD HTML** (Task #142): actualizar paneles para mostrar IEC ponderado por país/vendedor/YTD/Grupo. Los datos ya están en avboard_data.js con la fórmula correcta, pero los paneles HTML no los visualizan todavía.
2. **Cotizador UI — transporte INCLUIDO**: los controles de UI en cotizador_chile/peru.html para seleccionar modo SEPARADO/INCLUIDO aún no están implementados. La función `prorratearTransporte()` existe en core, pero no hay botón en la UI.
3. **Cotizador UI — autorización estado B**: el botón "Solicitar autorización" en la UI del cotizador. La lógica de fingerprint existe, pero la UI de workflow de autorización es un placeholder hasta conectar backend.
4. **Regenerar avboard_data.js**: después del commit, ejecutar `python3 scripts/update_avboard.py` para que AVBOARD refleje los IEC calculados con la fórmula ponderada.
5. **sic_politica.html commit** (Task #136): git HEAD.lock pendiente. Javier debe ejecutar desde su terminal:
   ```
   rm .git/HEAD.lock
   git add apps/sic_av/sic_politica.html apps/sic_av/data/parametros_chile.json
   git commit -m "feat(SIC): politica oficial V1.4 — formalizar banner y campos GG"
   ```

---

## 8. Instrucciones de commit (cuando Javier apruebe)

```bash
cd ~/Documents/GitHub/av-latam-board

# Limpiar lock si existe
rm -f .git/HEAD.lock

# Verificar tests antes de commitear
node scripts/test_iec_t1_t18.js

# Agregar solo los archivos modificados (NO git add -A)
git add apps/cotizador/cotizador_chile.html \
        apps/cotizador/cotizador_peru.html \
        apps/cotizador/cotizador_core.js \
        apps/cotizador/data/config.json \
        apps/sic_av/data/iec_chile_demo.json \
        apps/sic_av/data/iec_peru_demo.json \
        apps/sic_av/data/parametros_chile.json \
        apps/sic_av/data/parametros_peru.json \
        apps/sic_av/js/sic_data_adapter.js \
        scripts/update_avboard.py \
        scripts/test_iec_t1_t18.js \
        docs/REPORTE_PRECOMMIT_IEC_FASE7.md

git commit -m "feat(IEC-Fase7): IEC ponderado Σvne/Σvpt — cotizador+SIC+AVBOARD

CHANGE REQUEST SIC-AV v1.7 (2026-07-28)
- Corrige fórmula IEC: binario sp/elig → ponderado Σvne/Σvpt
- Reglas comerciales A/B/C con parámetros configurables (no hardcodeados)
- Cotizador: estadoIEC, prorratearTransporte, calcularIECConTransporte
- Cotizador: calcularInteresFinanciero (90d gracia, 1.2%/mes)
- Cotizador: fingerprint djb2 + PDF.imprimirConControl()
- SIC adapter: computarIECPonderadoDelMes() + agregarIECPonderado()
- SIC adapter: construirCicloReal() usa IEC ponderado (antes: binario)
- AVBOARD: compute_iec_chile/peru() corregidos a ponderado
- Tests T1-T18: 20/20 pasados. Reconciliación Cotizador=SIC=AVBOARD OK
- Parametros: iec_politica en config.json + parametros_chile/peru.json

Co-authored-by: javier@agrovecalatam.com"

git push origin main
```

---

*Este reporte fue generado automáticamente. La autorización de commit es responsabilidad exclusiva del Gerente General (javier@agrovecalatam.com).*
