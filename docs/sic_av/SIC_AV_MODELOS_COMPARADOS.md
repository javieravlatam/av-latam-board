# SIC-AV — Modelos Comparados
**Grupo AV LATAM · Fase 3 — Comparación técnica de alternativas de cálculo**

Versión: 1.0 (V1, no aprobada) · Fecha: 2026-07-12 · Autor: Claude (Anthropic), modo Cowork

Todas las cifras de este documento son **sintéticas**, construidas para ilustrar el comportamiento matemático de cada modelo — no representan vendedores, montos ni resultados reales de Grupo AV LATAM. Los 15 casos completos con todos los campos de cálculo están en `SIC_AV_CASOS_PRUEBA.csv`.

---

## 0. Convenciones usadas en este documento

Se comparan tres modelos, aplicados de forma consistente a lo largo de todo este análisis y del simulador:

- **Modelo A — Política Actual:** tablas con saltos, tal como fueron entregadas por Javier el 2026-07-12 (presupuesto: ≤50%→0%, 51-79%→70%, ≥80%→100%; IEC: tabla ya documentada en `docs/AVBOARD_BUSINESS_RULES.md`). Bono por excedente sin condicionamiento (2% flat, sin gating de IEC/piso), tal como está escrito literalmente en la política actual.
- **Modelo C — Progresivo Recomendado:** factor continuo/interpolado tanto para presupuesto como para IEC, con una tabla de IEC deliberadamente menos punitiva en el tramo bajo (alineada con el principio filosófico 8). Bono por excedente condicionado por Factor IEC y Factor de Precio Piso vigentes.
- **Modelo B — Alternativo (escala progresiva por tramos):** los mismos anclajes de tabla que el Modelo C, pero como escalones discretos en vez de una curva continua. Bono por excedente con el mismo condicionamiento que el Modelo C.

Ninguno de los tres queda adoptado por este documento. La recomendación técnica se indica en cada sección, y la decisión final se deja explícitamente pendiente de Gerencia General (`SIC_AV_DECISIONES_GERENCIA.md`).

---

## 1. Tasa por Edad de Cartera — Opción 1 vs. Opción 2

**Opción 1:** mantener la tasa variable por tramo de días (tal como está la política actual) y no aplicar ningún factor adicional de cartera.
**Opción 2:** usar una comisión base única de 5% y convertir cada tramo de cartera en un factor multiplicador equivalente (ej. contado = 5%×1,6 = 8%; 31-180 días = 5%×1,2 = 6%; 181-210 días = 5%×0,5 = 2,5%; etc.).

| Criterio | Opción 1 (tasa variable) | Opción 2 (base × factor) |
|---|---|---|
| Resultado matemático | Idéntico | Idéntico |
| Riesgo de doble conteo | Ninguno — la cartera vive en un solo lugar de la fórmula | Ninguno, si se implementa con disciplina, pero agrega una capa de abstracción innecesaria |
| Auditabilidad | Alta — la tasa aplicada es exactamente la que Gerencia ya aprobó, sin transformación intermedia | Media — cada auditoría debe verificar que el factor equivalente reproduce exactamente la tasa aprobada |
| Facilidad de explicación al vendedor | Alta — "cobraste a los 15 días, tu tasa es 7,5%" | Media — "tu base es 5%, tu factor de cartera es 1,5×" es un paso adicional de traducción |
| Necesidad real de que interactúe multiplicativamente con otros factores | Baja — la cartera no necesita combinarse con presupuesto/IEC como un multiplicador aparte, ya está resuelta en la tasa | — |

**Recomendación: Opción 1.** La tasa variable por tramo de días es matemáticamente idéntica a la Opción 2, pero más auditable porque es exactamente la tabla que Gerencia ya definió, sin una capa de traducción que pueda introducir errores de redondeo o de interpretación. La fórmula del SIC-AV usa entonces:

```
Comisión Base = Venta Neta Cobrada × Tasa por Edad de Cartera (tabla combinada, país + tipo cliente)
Comisión Final = Comisión Base × Factor Presupuesto × Factor IEC × Factor Precio Piso + Bono Excedente + Bonificaciones − Ajustes
```

Esto responde directamente a la advertencia de Javier de no contar dos veces el efecto de cartera: **la cartera vive únicamente en la tasa, no aparece de nuevo como factor.**

---

## 2. Factor de Cumplimiento de Presupuesto

### Modelo A — Política Actual

| Cumplimiento | Factor |
|---|---|
| ≤ 50% | 0% |
| 51% – 79% | 70% |
| ≥ 80% | 100% |

### Modelo B — Escala Progresiva por Tramos (referencia inicial no aprobada)

| Cumplimiento | Factor |
|---|---|
| < 50% | 0% |
| 50% – 59,99% | 50% |
| 60% – 69,99% | 65% |
| 70% – 79,99% | 80% |
| 80% – 89,99% | 90% |
| 90% – 99,99% | 100% |
| 100% – 109,99% | 105% |
| ≥ 110% | 110% |

### Modelo C — Continuo / Interpolado

Misma tabla de anclajes que el Modelo B, pero conectados con interpolación lineal en vez de escalones, de modo que no existe ningún salto brusco entre un cumplimiento de 79,9% y 80,1%, por ejemplo. Fórmula: interpolación lineal por tramos entre los puntos (0%,0%), (50%,50%), (60%,65%), (70%,80%), (80%,90%), (90%,100%), (100%,105%), (110%,110%), con techo de 110% para cumplimientos mayores.

### Comparación

| Criterio | Modelo A (actual) | Modelo B (progresivo) | Modelo C (continuo) |
|---|---|---|---|
| Capacidad motivadora | Baja — no premia sobrecumplimiento en el factor (solo vía bono de excedente aparte) | Media-Alta — premia gradualmente hasta 110% | Alta — cada punto adicional de cumplimiento se traduce en más comisión, sin esperar cruzar un umbral |
| Impacto financiero | Más conservador (nunca supera 100% en el factor) | Mayor costo potencial (hasta 110%) | Similar a B en el límite superior, pero distribuido de forma continua |
| Facilidad de explicación | Alta — 3 tramos simples | Media — 8 tramos | Media-Alta — requiere explicar una fórmula, no una tabla, pero el resultado es más fácil de justificar caso a caso ("subiste 1 punto de cumplimiento, tu factor subió proporcionalmente") |
| Riesgo de saltos ("cliff risk") | **Alto** — el salto de 79%→80% (de 70% a 100% de factor) es exactamente el problema que Javier señaló | Medio — quedan 8 saltos menores, pero ninguno tan abrupto como el de política actual | **Ninguno** — no hay saltos, la función es continua |
| Comportamiento que incentiva | Riesgo de manipulación cerca del umbral 80% (posponer o adelantar una venta pequeña para cruzar el corte) | Menor riesgo, pero persiste en los bordes de cada tramo | Mínimo riesgo de manipulación — cualquier venta adicional siempre ayuda proporcionalmente, sin punto de quiebre que valga la pena manipular |
| Sostenibilidad financiera | Alta previsibilidad, pero motivacionalmente pobre | Requiere validar el costo total con datos reales antes de aprobar | Requiere la misma validación que B, con la ventaja de que el costo crece suavemente, sin "picos" alrededor de un umbral |

**Recomendación técnica: Modelo C.** Es el que mejor resuelve el problema concreto que Javier señaló (el salto 79%→80%) sin perder auditabilidad — el simulador expone la fórmula exacta punto por punto, por lo que "continuo" no significa "no auditable". **Si Gerencia General prefiere una alternativa más simple de comunicar en un solo documento impreso, el Modelo B es la segunda mejor opción** — conserva casi todo el beneficio motivacional del Modelo C, a cambio de reintroducir saltos menores en los bordes de cada tramo. **La decisión final queda pendiente de Gerencia General** (`SIC_AV_DECISIONES_GERENCIA.md`).

---

## 3. Factor IEC

### Modelo IEC A — Tabla Actual Documentada

| IEC | Factor |
|---|---|
| < 70% | 20% |
| 70% – 84,9% | 70% |
| 85% – 91,9% | 80% |
| 92% – 94,9% | 90% |
| ≥ 95% | 105% |

**Evaluación:** esta tabla (documentada en `docs/AVBOARD_BUSINESS_RULES.md`, sección 2, con fecha 2026-05-15) fue diseñada como un score de referencia comercial/cliente, no como política de pago de comisión monetaria — no debe asumirse aprobada para este propósito solo porque ya existe en el repositorio. Evaluada bajo la nueva filosofía SIC-AV, es **demasiado punitiva en el extremo bajo**: un vendedor con IEC 65% (bajo el umbral, pero no catastrófico) recibe solo 20% de factor — una reducción del 80% de su comisión potencial por un solo indicador, lo que contradice el principio filosófico 8 ("sacrificar IEC para generar mayor volumen no debe eliminar necesariamente la capacidad de ganar una buena comisión").

### Modelo IEC B — Tabla Progresiva y Motivadora (propuesta, no aprobada)

| IEC | Factor |
|---|---|
| < 50% | 40% |
| 50% – 69,9% | 60% |
| 70% – 84,9% | 80% |
| 85% – 91,9% | 90% |
| 92% – 94,9% | 100% |
| ≥ 95% | 110% |

Eleva el piso (40% en vez de 20% para el tramo más bajo; 60% en vez de 20% para 50-70%) y sube ligeramente el techo (110% en vez de 105%) — conserva el incentivo a la excelencia sin castigar tan duramente la disciplina imperfecta.

### Modelo IEC C — Continuo / Interpolado

Mismos anclajes que el Modelo B, interpolados linealmente: (0%,40%), (50%,60%), (70%,80%), (85%,90%), (92%,100%), (95%,110%), con techo de 110% desde 95% en adelante.

### Simulación de los cuatro escenarios solicitados

Se usa el **Factor de Cumplimiento de Presupuesto Modelo C** (el recomendado en la sección 2) como base común, para aislar el efecto de elegir uno u otro modelo de IEC. El "combinado" es Factor Presupuesto × Factor IEC — el multiplicador que se aplica sobre la comisión base antes del bono de excedente.

| Escenario | Cumplimiento → Factor Ppto (Modelo C) | IEC | Factor IEC — Modelo A | Factor IEC — Modelo B | Factor IEC — Modelo C | Combinado A | Combinado B | Combinado C |
|---|---|---|---|---|---|---|---|---|
| 130% cumpl., IEC 75% (volumen alto, calidad media) | 110% (techo) | 75% | 70% | 80% | 83,3% | 77,0% | 88,0% | 91,6% |
| 100% cumpl., IEC 98% (equilibrado, calidad excelente) | 105% | 98% | 105% | 110% | 110% (techo) | 110,3% | 115,5% | 115,5% |
| 90% cumpl., IEC 95% (volumen algo bajo, calidad excelente) | 100% | 95% | 105% | 110% | 110% (techo) | 105,0% | 110,0% | 110,0% |
| 110% cumpl., IEC 90% (volumen alto, calidad buena no excelente) | 110% | 90% | 80% | 90% | 97,1% | 88,0% | 99,0% | 106,8% |

**Lectura ejecutiva:**

- Bajo el **Modelo A** (actual), el vendedor de alto volumen con IEC apenas decente (escenario 1: 130%/IEC75%) termina con un combinado de **77,0%** — notablemente peor que el vendedor de bajo volumen relativo con excelente IEC (escenario 3: 90%/IEC95%, combinado **105,0%**). La brecha de 28 puntos entre ambos perfiles está dominada casi enteramente por la dureza de la tabla IEC actual, no por una diferencia real y proporcional de mérito comercial.
- Bajo el **Modelo C** (recomendado), esa misma brecha se reduce a **91,6% vs. 110,0%** — sigue premiando la calidad por sobre el volumen bruto (como debe ser, principio filosófico 4), pero sin castigar tan severamente al vendedor que generó volumen real con una disciplina de precios razonable, no mala.
- El escenario 4 (110%/IEC90%) es el más ilustrativo del principio filosófico 9 ("dos comerciales pueden lograr comisión similar por caminos distintos"): bajo el Modelo C, este perfil (**106,8%**) queda muy cerca del escenario 1 de alto volumen (**91,6%**) y del escenario 3 de alta calidad (**110,0%**) — hay un espacio razonable de combinaciones ganadoras, no un solo camino correcto.
- En los escenarios 2 y 3 (IEC excelente, ≥95%), los tres modelos convergen por arriba de 100% — ningún modelo penaliza a un vendedor con excelente disciplina de precios, sin importar cuál se elija. La diferencia real entre modelos se concentra en el tramo medio-bajo de IEC (escenarios 1 y 4), que es exactamente donde debe resolverse el balance entre volumen y calidad.

**Recomendación técnica: Modelo IEC C**, por las mismas razones que en la sección 2 (elimina saltos, mantiene auditabilidad vía fórmula explícita, y produce el balance volumen/calidad más alineado con la filosofía SIC-AV). El Modelo B es la alternativa de repliegue si Gerencia prioriza simplicidad de comunicación. **Aprobación final pendiente de Gerencia General.**

---

## 4. Precio Piso — Alternativas

| Alternativa | Descripción | Evaluación |
|---|---|---|
| **A — No genera comisión** | Cualquier venta bajo piso, autorizada o no, tiene Factor de Precio Piso = 0 | Simple y sin ambigüedad, pero no deja espacio para excepciones de negocio legítimas (ej. cierre de inventario, cliente estratégico) — contradice la orientación inicial de Gerencia de permitir autorización formal |
| **B — Genera comisión solo con autorización previa** | Sin autorización = 0; con autorización = comisión completa, sin reducción | Reconoce la excepción de negocio, pero no diferencia entre "vendí bajo piso porque no había otra opción" y "vendí bajo piso porque fue mi decisión de precio" — puede incentivar el uso de la autorización como atajo sistemático |
| **C — Comisión reducida mediante factor configurable** | Aplica siempre un factor <1 a la venta bajo piso, exista o no autorización | Sin distinguir autorización, trata igual una excepción aprobada por Gerencia que una decisión unilateral del vendedor — no es coherente con el principio de que la autorización debe tener valor |
| **B + C combinada (recomendada)** | Sin autorización = veto total (Factor = 0); con autorización formal = comisión reducida (Factor configurable, V1 ilustrativo 0,50) | Distingue claramente entre una infracción (veto) y una excepción de negocio aprobada (reducción, no anulación) — es la que mejor refleja la orientación inicial de Gerencia citada en el brief de Fase 3 |

**Recomendación: B + C combinada**, ya desarrollada en `SIC_AV_POLICY_V1.md`, sección 8. El valor exacto del factor de autorización (ilustrado en 0,50 para el simulador) queda pendiente de aprobación de Gerencia General.

---

## 5. Bono por Excedente — Alternativas

| Alternativa | Descripción |
|---|---|
| **A — Mantener 2% adicional sobre excedente cobrado** | Igual que la política actual, pero condicionado por Factor IEC y Factor de Precio Piso vigentes de esa venta (refinamiento propuesto) |
| **B — Multiplicador de sobrecumplimiento** | En vez de un porcentaje flat, el bono escala según cuánto se superó el presupuesto (ej. 100-119% de excedente relativo → +1%; 120-149% → +2%; ≥150% → +3%) |

| Criterio | Alternativa A (2% flat, refinada) | Alternativa B (multiplicador escalonado) |
|---|---|---|
| Capacidad motivadora | Buena, constante | Mayor para sobrecumplimientos extremos, pero no diferencia a un vendedor que apenas superó presupuesto |
| Facilidad de auditoría | Alta — una sola tasa | Media — requiere tramos adicionales y su propia tabla de aprobación |
| Riesgo de manipulación | Bajo | Medio — podría incentivar concentrar cobros en un ciclo para alcanzar el siguiente tramo |
| Consistencia con el resto del modelo | Alta — no introduce una familia de tablas nueva | Baja — duplicaría la lógica de "tramos" que ya existe en presupuesto e IEC, aumentando la complejidad total del sistema sin evidencia de que el beneficio lo justifique |

**Recomendación: Alternativa A (2% flat, refinada con el condicionamiento de IEC y Precio Piso ya descrito en `SIC_AV_POLICY_V1.md`, sección 10).** Es más fácil de auditar y ya es la tasa con la que la fuerza comercial está familiarizada — el cambio real y valioso no es el porcentaje, sino que ahora exige la misma disciplina de calidad que el resto de la comisión. **El valor de 2% y su condicionamiento exacto quedan sujetos a confirmación de Gerencia General.**

---

## 6. Roles Comerciales — Opciones Ejecutivas

Sin inventar porcentajes distintos por cargo (instrucción explícita de Javier), se presentan solo opciones de arquitectura:

### RTC y KAM — comisión base

- **Opción 1 (uniforme):** RTC y KAM usan exactamente la misma tabla de tasas, factores y bono. Más simple, más auditable, pero no diferencia el tipo de gestión (cuentas clave vs. territorio amplio).
- **Opción 2 (diferenciada por vigencia futura):** misma fórmula base, pero con posibilidad de configurar campañas o bonificaciones específicas por cargo (ya contemplado como "F. Campañas configurables" en `SIC_AV_MASTER_ARCHITECTURE.md`, sección 5.B) — no es una tasa distinta, es una capa adicional opcional.

### KAM — componente individual vs. corporativo

- **Opción A:** 100% individual, igual que un RTC, sobre sus cuentas asignadas.
- **Opción B:** componente individual (sus cuentas) + componente corporativo (desempeño agregado del país o segmento que gestiona) — reconoce que un KAM suele influir en resultados más allá de su cartera directa.

### Jefe de Ventas

- **Opción A:** solo bono de equipo (sobre el desempeño agregado de su equipo), sin cartera propia.
- **Opción B:** cartera propia (comisionada igual que cualquier RTC/KAM) + bono de equipo como componente aparte.
- **Opción C:** bono de equipo calculado como un porcentaje del pool de comisiones generado por su equipo, en vez de una fórmula independiente — más simple de calcular, pero acopla el bono del jefe directamente a la fórmula de sus subordinados (riesgo: cualquier cambio de política afecta dos niveles a la vez).

### Evitar doble comisión en cuentas compartidas

Regla arquitectónica recomendada (no un porcentaje): por defecto, cada factura tiene **un único vendedor responsable de registro**. Cualquier reparto (RTC+KAM, Jefe con cartera propia y apoyo territorial, etc.) requiere un registro explícito de asignación porcentual, con fecha de inicio/término y aprobación de Gerencia Comercial — nunca un reparto automático implícito. Esto es consistente con el caso especial "Cliente compartido" y "Factura compartida" de `SIC_AV_POLICY_V1.md`, sección 9.

**Todas las decisiones de esta sección quedan pendientes de Gerencia General** — ver `SIC_AV_DECISIONES_GERENCIA.md`.

---

## 7. Comparación de Modelos — Métricas Agregadas (sobre los 15 casos sintéticos)

Calculado a partir de los 45 registros (15 casos × 3 modelos) de `SIC_AV_CASOS_PRUEBA.csv`. Cifras sintéticas, en la unidad monetaria de cada caso (CLP o USD según el país del caso) — no se combinan entre países en este resumen por tratarse de monedas distintas; se listan como referencia de forma y comportamiento, no de magnitud absoluta.

| Métrica | Modelo A (Actual) | Modelo B (Alternativo) | Modelo C (Recomendado) |
|---|---|---|---|
| Casos con comisión final = 0 (de 15) | 5 (casos 1, 2, 9, 12, 13) | 3 (casos 9 con cumpl. 40%→factor 0%, y 12; el caso 1 y 2 ya no quedan en cero) | 1 (caso 12 — el veto de precio piso no autorizado, que debe seguir siendo cero en cualquier modelo) |
| Sensibilidad al presupuesto | Alta cerca del umbral 80% (salto abrupto) | Media — 8 tramos suavizan el salto pero no lo eliminan | Baja/continua — cada punto de cumplimiento adicional aporta proporcionalmente |
| Sensibilidad al IEC | Muy alta en el tramo bajo (<70% → penalización de 80% del factor) | Alta pero menos severa (<50%→60% de reducción) | Gradual — la penalización crece proporcionalmente, sin quiebres |
| Sensibilidad a la cobranza (tasa de cartera) | Igual en los tres modelos — no varía, porque la tasa de cartera es la misma tabla en los tres (Opción 1, sección 1) | Igual | Igual |
| Capacidad motivadora (evaluación cualitativa) | Baja | Media-Alta | Alta |
| Facilidad de comprensión (evaluación cualitativa) | Alta (pocos tramos) | Media (más tramos, pero sigue siendo tabla) | Media (requiere entender una fórmula, no solo una tabla) |
| Riesgo de manipulación cerca de un umbral | Alto (79%→80%, IEC 69,9%→70%) | Medio (persiste en los bordes de cada tramo) | Mínimo (no hay bordes que crucen un salto significativo) |
| Auditabilidad | Alta | Alta | Alta, siempre que la fórmula de interpolación esté documentada y congelada por versión (ver gobernanza, `SIC_AV_POLICY_V1.md` sección 12) |

**Nota sobre "costo total para la compañía" y "% de ventas destinado a comisión":** no se calculan aquí como cifra agregada porque los 15 casos sintéticos no representan una distribución realista del volumen de ventas de la compañía — presentar un promedio o total sobre datos sintéticos daría una falsa sensación de precisión financiera. Esta comparación de costo real **debe hacerse en la Fase 7 (Piloto con datos reales)** del roadmap ya definido en `SIC_AV_MASTER_ARCHITECTURE.md`, corriendo cada modelo sobre un ciclo comercial real completo antes de decidir cuál se adopta en producción.

---

## Recomendación Ejecutiva

Si la decisión fuera solo técnica (no de negocio), el modelo recomendado es: **Opción 1 para la tasa de cartera (sin factor adicional) + Modelo C para presupuesto + Modelo IEC C + Precio Piso B/C combinado + Bono de Excedente Alternativa A refinada.** Este conjunto elimina los saltos abruptos que hoy generan riesgo de manipulación cerca de un umbral, mantiene la comisión completamente auditable mediante una fórmula explícita y versionada, y produce el mejor equilibrio entre volumen y calidad exigido por la nueva filosofía (sección 3, escenario 4). **Ninguna de estas cinco decisiones queda aprobada por este documento — cada una se lista formalmente en `SIC_AV_DECISIONES_GERENCIA.md` para resolución de Gerencia General.**

---

*Documento generado por Claude (Anthropic) · Modo Cowork · Fase 3 — Comparación de modelos, sin implementación · Agroveca AV LATAM · 2026-07-12*
