# SIC-AV — Auditoría Profunda de Cobranzas (CHANGE REQUEST v1.5, Fase 4)

Fecha: 2026-07-13. Alcance: todo el repositorio `av-latam-board` (no solo `apps/sic_av/`) — scripts de actualización, `inbox/`, salidas JS/HTML, logs, `versions/`, archivos Excel de respaldo en la raíz. Objetivo: determinar de forma definitiva si existe, en algún punto del flujo actual, una fuente de **fecha real de cobro por factura**, **monto efectivamente cobrado por factura**, **aplicación parcial de cobros** o **saldo de factura** — aunque no esté expuesta hoy en `avboard_data.js`.

**Regla seguida en esta auditoría:** no se asumió que la cobranza no existe solo porque no aparecía en los archivos ya revisados en v1.5 Fase 1. Se releyó columna por columna cada archivo Excel de `inbox/`, se greppeó todo `.py`/`.js`/`.html`/`.md`/`.json` del repo por los términos solicitados, y se ejecutó un experimento de diffing histórico entre cortes de CxC (detallado en la sección 3) para probar empíricamente si el dato existe de forma indirecta.

---

## 1. Inventario de cobranzas (Fase 4.1)

| Dato | Archivo | Ruta | Campo | Granularidad | País | Utilidad para SIC |
|---|---|---|---|---|---|---|
| Saldo pendiente por factura (foto a una fecha de corte) | `Cuentas Cobrar Agroveca *.xlsx`, `Cuentas Cobrar  Agrocomercial*.xlsx` (hoja `Detalle Mora`) | `inbox/` | `Total Doc` | Por factura, snapshot | Chile | ✅ Usable como saldo pendiente actual — **no** como cobro |
| Días de mora (respecto a vencimiento, no a facturación) | ídem | `inbox/` | `Días Mora` | Por factura, snapshot | Chile | ⚠️ Aproximación, no equivale a "días de cartera" del SIC (que se cuenta desde facturación) |
| Tramo de mora (bucket contable 0-30/31-60/61-90/+90) | ídem | `inbox/` | `Tramo` | Por factura, snapshot | Chile | ⚠️ No son los tramos propios del SIC (8%/7,5%/6%/3%/2,5%/0,5%) |
| Saldo pendiente por factura (foto a una fecha de corte) | `AGROVECA - CUENTAS POR COBRAR AL ....xlsx` (hoja con nombre de entidad) | `inbox/` | `SALDO` | Por factura, snapshot | Perú | ⚠️ Ver hallazgo 4.1 — el pipeline real **no lee estos archivos**, usa un valor congelado |
| Fecha de emisión / vencimiento | ambos formatos CxC | `inbox/` | `Emisión`/`FECHA`, `Vencimiento`/`VENCIM` | Por factura | CL y PE | ✅ Ya disponible (no es fecha de cobro) |
| Nota de cesión a factoring (SUPRA, Perú) | `docs/AVBOARD_BUSINESS_RULES.md`, `scripts/update_avboard.py` (`extract_peru_cxc_static`) | raíz / `scripts/` | `nota: "PAGADO A SUPRA — factoring"` | Agregado, hardcodeado | Perú | ❌ No es cobro del cliente — es traspaso de la cuenta a un tercero, no cierra el ciclo de venta neta cobrada |
| Nota manual de resolución puntual | `scripts/update_avboard.py` línea 511-519 | `scripts/` | `'nota': 'PAGADO ✅ entre 17/04 y 29/04'` | Un solo caso (GOYASERVICE SPA), hardcodeado a mano | Chile | ❌ Evidencia de que SÍ se puede inferir una ventana de pago comparando cortes — pero está hecho a mano, una sola vez, no es un mecanismo del pipeline |
| Comentarios libres en Libro de Ventas | `Libro de Ventas *.xlsx` (hoja `VENTAS`, columna `Comentarios`) | `inbox/` | `Comentarios` | Por línea de venta | Chile | ❌ Revisadas 7 planillas completas — 361 comentarios no vacíos, ninguno menciona pago/cobro/cancelación (son notas logísticas: guías, acuerdos de entrega, "3 cuotas") |
| Reportes ya construidos (Excel de gestión) | `modulo_cxc_2026.xlsx`, `Panel_CxC_AV_Latam_2026.html` (`chileData`/`peruData`) | raíz | mismas columnas que CxC | Por factura, snapshot único | CL y PE | ❌ Mismos campos que el CxC crudo (saldo, mora, tramo) — sin fecha de pago, confirmando que no hay una fuente más rica en ningún reporte ya construido |
| Presupuesto, ventas, IEC, precio piso | ya auditados en v1.5 Fase 1 | — | — | — | — | Ver `DATA_SOURCE_AUDIT.md` — sin cambios |

**Términos buscados sin ningún resultado real en todo el repositorio** (excluyendo los JSON demo sintéticos de `apps/sic_av/data/`, creados por este mismo proyecto): `fecha_pago`, `fecha_cobro`, `monto_pagado`, `factura_pagada`, `abono`. El único lugar donde estos términos existen es `apps/sic_av/data/cobranzas_*_demo.json` — datos **inventados para la Fase 4 demo del prototipo**, no reales.

## 2. Trazabilidad del pipeline (Fase 4.2)

`scripts/update_avboard.py`, función `detect_inbox_files()` (línea ~160): para Chile, toma con `sorted(..., reverse=True)[0]` **solo el archivo CxC más reciente** de `Cuentas Cobrar Agroveca *.xlsx` y `Cuentas Cobrar Agrocomercial*.xlsx` — descarta explícitamente todos los cortes anteriores en cada corrida. La lista `required` de archivos obligatorios (línea 1954) incluye `cxc_agro` y `cxc_avch` (Chile) pero **no incluye ningún archivo de CxC de Perú** — no existe glob para `AGROVECA - CUENTAS POR COBRAR *.xlsx` en `detect_inbox_files()`.

`extract_cxc_chile()` (línea 413): lee el corte único más reciente de cada entidad chilena, calcula tramos y saldo por RTC — es una función de **agregación de una foto**, no compara contra cortes anteriores. No existe en todo `update_avboard.py` ninguna función que compare dos cortes de CxC entre sí (el único lugar donde esa comparación existe es la nota manual hardcodeada de GOYASERVICE, hecha por una persona, no por código).

`extract_peru_cxc_static()` (línea 1912): retorna un **diccionario Python hardcodeado**, con el comentario explícito `# Default static value (unchanged between cortes unless new Peru CxC arrives)` y `"corte": "10/05/2026"` fijo en el código. **El CxC de Perú en `avboard_data.js` no se actualiza automáticamente — está congelado desde el 10/05/2026**, independientemente de qué archivos existan hoy en `inbox/`. Es un hallazgo nuevo de esta Fase 4, no reportado en la auditoría v1.5 Fase 1 (que se enfocó en qué campos existen, no en si se refrescan).

`scripts/version_avboard.py`: el sistema de versionado ya existente (`versions/manifest.json`, 2 versiones guardadas, ambas del mismo día 2026-06-03) **no incluye los archivos CxC crudos de `inbox/`** entre lo que respalda — solo copia `nuevo libro base AV 2026.xlsx`, `avboard_data.js`, `avboard_clientes.js` y los logs. Es decir: aunque el pipeline empezara hoy a versionar, no quedaría un historial de CxC crudo para diffing futuro salvo que se agregue explícitamente.

**Dato descartado en el proceso que sí existía en origen:** ninguno de los campos de `Detalle Mora` se pierde al pasar a `avboard_data.js` (se agregan a nivel de tramo/RTC, pero el crudo por factura no se descarta — simplemente nunca tuvo un campo de fecha de pago que perder). Lo que sí se "descarta" en la práctica es **la serie histórica de cortes**: cada corrida solo mira el archivo más nuevo y los anteriores quedan sin usar en `inbox/` (por eso siguen ahí, acumulados, en vez de ser reemplazados o archivados).

## 3. Experimento: ¿se puede reconstruir una ventana de cobro comparando cortes sucesivos?

Dado que múltiples cortes fechados de CxC Chile ya coexisten en `inbox/` (Agroveca: 12/04, 17/04, 29/04, 07/05, 17/05, 25/05, 31/05, 07/06, 21/06 · Agrocomercial: 07/05, 17/05, 25/05, 31/05, 07/06, 17/06, 21/06 — 2026), se ejecutó (solo lectura, sin modificar ningún archivo) un diff factura-por-factura entre cada par de cortes consecutivos, usando `(Rut, Número)` como clave.

**Resultado Agrocomercial (la serie más limpia):** en las 6 transiciones analizadas, entre 21 y 41 facturas se mantienen "en común" entre cortes consecutivos, y entre 5 y 19 desaparecen por transición (79 en total, CLP ~106,6M) — un patrón consistente con facturas que se resuelven (pagadas, u otro motivo) dentro de ventanas de 4 a 10 días.

**Resultado Agroveca:** el mismo diff funciona razonablemente en 7 de 8 transiciones, pero la transición 29/04→07/05 muestra **cero facturas en común** (los números de folio de un corte al otro no se solapan en absoluto — folios ~500-600 vs. ~1100-1300), lo que impide confiar en esa transición específica sin validación humana: podría ser un cambio real de serie de numeración, un archivo de una fuente distinta, o un artefacto de carga — no se puede determinar solo con estos datos.

**Resultado adicional (importante):** en ninguna de las 13 transiciones analizadas (ambas entidades) se observó una factura que **cambiara de monto** permaneciendo en la cartera — es decir, **no se detectó nunca un pago parcial**: cada factura está, en todos los cortes disponibles, en su monto íntegro o ya no está. Esto es evidencia directa (no solo ausencia de documentación) de que hoy no existe aplicación parcial de cobros registrada en ningún corte disponible.

**Interpretación:** esta técnica puede aproximar una **ventana de resolución** (5 a 14 días de ancho, no una fecha exacta) para un subconjunto de facturas — pero "desaparece del corte" no equivale de forma confiable a "el cliente pagó": también puede significar condonación, error de captura, cesión (ver nota SUPRA en Perú), o reclasificación contable. No es un mecanismo del pipeline hoy (se hizo con un script ad-hoc para esta auditoría, fuera de `update_avboard.py`), no cubre Perú (cuyo CxC está congelado, sección 2), y la anomalía de folios de Agroveca muestra que no es mecánicamente confiable sin revisión de Finanzas.

## 4. Clasificación del escenario (Fase 4.3)

### Escenario identificado: **C — Existe saldo CxC, pero no movimientos de cobro confiables por factura**

No es A: no existe ninguna fuente con fecha de cobro real y monto cobrado por factura, lista para usar.

No es B en sentido estricto: no existe un agregado de cobranza confiable (ni por factura ni por vendedor/ciclo) — lo más cercano es el saldo pendiente por tramo de mora, que mide *lo que falta cobrar*, no *lo que se cobró y cuándo*.

Es C, con un matiz encontrado en esta Fase 4 que no estaba en la Fase 1: existe una **señal indirecta y parcial** (el diffing de cortes CxC de Chile) que podría, con trabajo adicional y validación de Finanzas, aproximar una ventana de pago para un subconjunto de facturas de Chile — pero no está automatizada, no cubre Perú, y tiene al menos una anomalía sin explicar. No se puede tratar como una fuente D (inexistente) porque hay evidencia real y reproducible; tampoco se puede tratar como B (confiable) porque no pasa el estándar de "no inventar, no asumir" sin que Finanzas confirme una muestra.

**No se reconstruye "de forma confiable" ninguna fecha ni monto exacto de cobro** — se confirma la conclusión de la Fase 1 (`DATA_SOURCE_AUDIT.md` sección 3.1), con evidencia adicional del pipeline (Perú CxC congelado) y del experimento de diffing (útil como pista futura, no como fuente hoy).

## 5. Mínimo dato requerido para pasar a Escenario A

Para que el SIC pueda calcular comisión liberada real, se requiere que Finanzas incorpore, para cada factura: **fecha de pago** (o de cada abono, si hay pagos parciales) y **monto pagado** en esa fecha. El camino de menor costo, dado lo encontrado en esta Fase 4:

1. Que el pipeline **conserve** (no descarte) cada corte de CxC recibido en `inbox/`, en vez de que solo el último quede accesible.
2. Automatizar el diff factura-por-factura entre cortes consecutivos (la misma lógica probada en la sección 3), marcando cada factura resuelta con una **ventana** de fechas, no una fecha exacta.
3. Que Finanzas valide una muestra de esas ventanas contra sus propios registros de tesorería, para confirmar si "desaparece del corte" realmente equivale a "pagado" en la mayoría de los casos, y para explicar la anomalía de folios de Agroveca.
4. Recién con esa validación, tratar la ventana aproximada como una fecha de cobro utilizable por el SIC (con menor precisión que una fecha exacta, pero muy superior a no tener nada).
5. Resolver primero la brecha de Perú: hoy no hay ningún camino, ni siquiera aproximado, porque el CxC de Perú ni siquiera se refresca desde `inbox/` (está hardcodeado en el código).

Este plan no se ejecuta en este cambio — se documenta como recomendación, conforme a la restricción de no modificar archivos fuente del Board ni el pipeline en esta fase.
