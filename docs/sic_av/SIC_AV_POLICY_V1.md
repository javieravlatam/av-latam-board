# SIC-AV — Política de Incentivos Comerciales V1
**Grupo AV LATAM · Fase 3 — Modelo de negocio y simulador (borrador para aprobación)**

Versión: 1.0 (V1, no aprobada) · Fecha: 2026-07-12 · Autor: Claude (Anthropic), modo Cowork
Estado: **BORRADOR DE POLÍTICA — NINGÚN VALOR DE ESTE DOCUMENTO ESTÁ APROBADO.** Ningún archivo de AV LATAM Board fue modificado para producir este documento. No hubo commit ni push. Todo lo aquí descrito se valida en un simulador aislado (`SIC_AV_SIMULADOR_V1.html`), no conectado al Board.

Construido a partir de: `ARQUITECTURA_ACTUAL_AV_LATAM_BOARD.md`, `SIC_AV_MASTER_ARCHITECTURE.md`, `SIC_AV_IMPLEMENTATION_STRATEGY.md`, `docs/AVBOARD_BUSINESS_RULES.md`, `docs/AVBOARD_UPDATE_PROTOCOL.md`, y la política de comisiones vigente entregada por Javier el 2026-07-12. Ningún dato de este documento proviene de una fuente distinta a esas.

---

## 1. Filosofía

1. La comisión debe ser principalmente motivadora, no castigadora.
2. Un buen vendedor debe poder construir el nivel de ingresos que desea alcanzar.
3. Una venta termina cuando se cobra — la comisión **liberada** depende del cobro efectivo, nunca solo de la factura.
4. No basta con vender; hay que vender bien.
5. El cumplimiento del presupuesto es la base del compromiso comercial.
6. El comercial debe ser Hunter y Farmer al mismo tiempo.
7. El sistema premia volumen, calidad, rentabilidad y correcta gestión territorial — ninguna de las cuatro dimensiones por sí sola define el resultado.
8. Sacrificar IEC para generar mayor volumen no elimina necesariamente la capacidad de ganar una buena comisión — pero tampoco la maximiza; ver sección 6 de `SIC_AV_MODELOS_COMPARADOS.md` para la evidencia numérica de este principio.
9. Dos comerciales pueden alcanzar una comisión similar por caminos distintos (más volumen con IEC menor, o menos volumen con IEC excelente), siempre que ambas gestiones sean rentables y sostenibles.
10. El sistema es transparente, auditable, predecible y comprensible para RTC, KAM y Jefe de Ventas.
11. Todo comercial puede ver: comisión potencial, comisión liberada, comisión pendiente, detalle por factura, factores aplicados, y las acciones necesarias para mejorar su ingreso.

## 2. Alcance

Aplica a la fuerza comercial de Grupo AV LATAM en Chile y Perú, en los cargos RTC, KAM y Jefe de Ventas (ver tratamiento por cargo en sección 9). No reemplaza ni interviene AV LATAM Board — reutiliza sus datos según el diseño ya aprobado en `SIC_AV_MASTER_ARCHITECTURE.md` y `SIC_AV_IMPLEMENTATION_STRATEGY.md`. Esta versión (V1) es la base de discusión con Gerencia General; no autoriza pago alguno.

## 3. Definiciones

| Término | Definición |
|---|---|
| **Venta facturada** | Monto de una línea o factura emitida, sin importar si ya fue cobrada. Solo sirve para proyección — nunca es base de pago. |
| **Venta neta cobrada** | Monto efectivamente pagado por el cliente sobre una factura, neto de impuestos excluibles (sección 9, caso "impuestos"). Es la única base que libera comisión pagable. |
| **Comisión potencial** | Estimación calculada sobre venta facturada elegible — de referencia, no pagable. |
| **Comisión liberada** | Calculada sobre venta efectivamente cobrada — es la que avanza hacia el pago. |
| **Comisión pendiente** | Generada por ventas facturadas y aún no cobradas; se recalcula y libera a medida que se cobra (incluso en ciclos posteriores). |
| **Comisión validada** | Comisión liberada revisada conjuntamente por Comercial y Finanzas al cierre del ciclo. |
| **Comisión aprobada** | Comisión validada autorizada formalmente para pago. |
| **Comisión pagada** | Comisión aprobada ya incorporada a remuneraciones. |
| **Tasa por edad de cartera** | Porcentaje de comisión que corresponde según cuántos días transcurrieron entre la fecha de factura y la fecha de cobro (tabla combinada, sección 5). |
| **Factor de Cumplimiento de Presupuesto** | Multiplicador aplicado según el % de cumplimiento del presupuesto del ciclo (sección 6; ver los tres modelos comparados en `SIC_AV_MODELOS_COMPARADOS.md`). |
| **Factor IEC** | Multiplicador aplicado según el Índice de Eficiencia Comercial del ciclo (sección 7). |
| **Factor de Precio Piso** | Multiplicador o veto aplicado cuando una venta se realizó bajo el precio piso vigente (sección 8). |
| **Bono por Excedente** | Monto adicional sobre la porción de venta cobrada que excede el presupuesto del ciclo (sección 10). |
| **Ciclo comercial** | Ventana de cálculo oficial: del día 26 de un mes al día 25 del mes siguiente (sección 4). |

## 4. Ciclo Oficial

- **Inicio:** día 26 de cada mes. **Cierre:** día 25 del mes siguiente. Ejemplo: ciclo julio 2026 = 26 junio 2026 al 25 julio 2026.
- El presupuesto y el cumplimiento de un ciclo se congelan con los datos vigentes al cierre (día 25), salvo excepción registrada (sección 9, caso "cambio de presupuesto con el ciclo abierto").
- La comisión **potencial** de un ciclo se calcula en tiempo real mientras el ciclo está abierto, usando venta facturada.
- La comisión **liberada** de un ciclo puede seguir creciendo después del cierre formal del ciclo, a medida que se cobran facturas de ese ciclo — esa liberación posterior no reabre el ciclo, se registra como comisión pendiente que se libera con fecha propia.

## 5. Tasa por Edad de Cartera — tratamiento de la política actual

**Decisión de diseño (Opción 1 recomendada, ver comparación completa en `SIC_AV_MODELOS_COMPARADOS.md` sección 1):** la edad de cartera se expresa como una **tasa de comisión variable por tramo de días**, no como un factor multiplicador adicional. Esto evita contar dos veces el efecto de cartera, porque la política que Javier entregó ya expresa el plazo de cobro como una tasa distinta (5%, 2,5%, 0,5%, etc.) — introducir además un "factor de cartera" separado duplicaría el castigo/premio por el mismo evento.

**Supuesto de modelamiento que requiere confirmación de Finanzas:** la política entregada describe dos tablas separadas por país ("edad de cartera" y "pronto pago") que se superponen en el tramo 0-180 días (Chile) y 0-60 días (Perú). Este documento las combina en una única tabla por país/tipo de cliente, donde el tramo de pronto pago (más granular y con tasas más altas) reemplaza al tramo equivalente de la tabla de edad de cartera, y esta última retoma el control a partir del día donde termina el pronto pago. Los límites de ambas tablas coinciden exactamente en ese punto de corte (día 180 en Chile, día 60→día 61 en Perú), lo que sugiere que esta es la lectura correcta, pero **debe confirmarse explícitamente con Finanzas antes de aprobar la política** (ver `SIC_AV_DECISIONES_GERENCIA.md`).

### Tabla combinada — Chile, Distribuidor

| Días al cobro | Tasa |
|---|---|
| Contado (0 días) | 8% |
| 1–30 días | 7,5% |
| 31–180 días | 6% |
| 181–210 días | 2,5% |
| Más de 210 días | 0,5% |

### Tabla combinada — Chile, Cliente Final / Agroindustria

| Días al cobro | Tasa |
|---|---|
| Contado (0 días) | 8% |
| 1–30 días | 7,5% |
| 31–180 días | 6% |
| 181–210 días | 3% |
| 211–360 días | 2,5% |
| Más de 360 días | 0,5% |

### Tabla combinada — Perú, Distribuidor y Agroindustria

| Días al cobro | Tasa |
|---|---|
| Contado (0 días) | 8% |
| 1–30 días | 7,5% |
| 31–60 días | 6% |
| 61–120 días | 5% |
| 121–180 días | 2,5% |
| Más de 180 días | 0,5% |

## 6. Factor de Cumplimiento de Presupuesto

Ver los tres modelos completos (A: política actual, B: escala progresiva, C: continuo/interpolado) y su comparación en `SIC_AV_MODELOS_COMPARADOS.md`, sección 2. **Ningún modelo queda adoptado en este documento** — la recomendación técnica (Modelo C) queda marcada como pendiente de aprobación de Gerencia General en `SIC_AV_DECISIONES_GERENCIA.md`.

## 7. Factor IEC

Ver los tres modelos completos y su simulación contra los cuatro escenarios solicitados (130%/IEC75%, 100%/IEC98%, 90%/IEC95%, 110%/IEC90%) en `SIC_AV_MODELOS_COMPARADOS.md`, sección 3. La tabla hoy documentada en `docs/AVBOARD_BUSINESS_RULES.md` (sección 2) **no debe asumirse aprobada para el cálculo de comisión monetaria** — ese documento la definió como referencia conceptual/score de cliente, no como política de pago.

## 8. Precio Piso

**Tratamiento recomendado (Opción B+C combinada, ver alternativas completas en `SIC_AV_MODELOS_COMPARADOS.md` sección 4), alineado con la orientación inicial de Gerencia:**

1. Una línea de venta **sobre o igual al precio piso** no sufre ajuste — Factor de Precio Piso = 1,0.
2. Una línea de venta **bajo el precio piso sin autorización formal previa** genera **Factor de Precio Piso = 0** — esa línea no genera ninguna comisión, sin importar el resto de los factores. Es un veto, no una reducción.
3. Una línea de venta **bajo el precio piso con autorización formal previa y trazable** genera comisión reducida mediante un **Factor de Precio Piso configurable, ilustrado en V1 como 0,50 (no aprobado)** — es decir, ni comisión completa ni comisión cero: se reconoce que hubo una excepción de negocio válida, pero no se premia igual que una venta a piso o sobre piso.
4. La autorización debe registrar: responsable, motivo, fecha, y condiciones especiales aplicadas. Sin estos cuatro campos, la venta se trata como no autorizada (regla 2).
5. El IEC del ciclo **debe seguir contabilizando esa línea como bajo piso** (`elegible=true`, `cumple=false`, `bp=monto`), exista o no autorización — la autorización afecta la comisión, no la medición de disciplina de precios. Esto preserva la visibilidad ejecutiva del IEC real incluso cuando la excepción fue aprobada.

## 9. Casos Especiales

Para cada caso: principio, forma de cálculo, responsable de validación, evidencia requerida, impacto en la comisión, trazabilidad.

| Caso | Principio | Forma de cálculo | Responsable de validación | Evidencia requerida | Impacto en comisión | Trazabilidad |
|---|---|---|---|---|---|---|
| **Pago parcial** | La comisión se libera en proporción a lo efectivamente cobrado | Se calcula solo sobre el monto parcial cobrado, con la tasa de cartera correspondiente a los días transcurridos hasta ese pago parcial | Finanzas | Comprobante de pago parcial, folio asociado | Comisión liberada parcial; el saldo queda como comisión pendiente | Cada pago parcial es un registro propio, vinculado al folio |
| **Factura pagada en varios ciclos** | Cada pago libera comisión en el ciclo en que ocurre, no en el ciclo de la factura original | La tasa de cartera de cada pago se calcula con los días transcurridos hasta ESE pago específico, no hasta el pago final | Finanzas | Historial de pagos por folio | Comisión liberada fraccionada entre ciclos | El folio original conecta todos los pagos parciales asociados |
| **Nota de crédito** | Reduce retroactivamente la venta neta cobrada reconocida | Se recalcula la comisión de la venta afectada con el monto neto (post-NC); la diferencia se registra como ajuste negativo en el ciclo donde se emite la NC, nunca reescribiendo un ciclo ya cerrado | Finanzas | Documento de nota de crédito, folio asociado | Ajuste negativo en el ciclo de emisión de la NC | Ver caso de ejemplo completo (Caso 15) en `SIC_AV_CASOS_PRUEBA.csv` |
| **Devolución** | Mismo tratamiento que nota de crédito | Igual que NC — reduce venta neta cobrada reconocida, ajuste registrado en el ciclo de la devolución | Comercial + Finanzas | Documento de devolución, motivo | Ajuste negativo en el ciclo de la devolución | Nunca se modifica el ciclo original |
| **Anulación de factura** | Una factura anulada nunca generó venta cobrada real | Se elimina del cálculo de comisión desde el origen (no es un ajuste, es una corrección de dato) | Finanzas | Documento de anulación | Comisión de esa factura nunca se libera; si ya se había proyectado como potencial, se retira de la proyección | Registro de anulación con fecha y motivo |
| **Descuento posterior a la factura** | Reduce la base comisionable de esa línea específica | Se trata igual que una nota de crédito parcial — ajuste sobre el monto neto reconocido | Finanzas + Comercial | Autorización del descuento, motivo | Ajuste proporcional al descuento | Vinculado al folio y a la autorización del descuento |
| **Venta bajo piso autorizada** | Genera comisión reducida, nunca completa | Factor de Precio Piso configurable (V1 ilustrativo: 0,50) aplicado sobre esa línea | Gerencia Comercial (autorización) | Registro de autorización: responsable, motivo, fecha, condiciones | Comisión reducida de esa línea; IEC sigue contando la venta como bajo piso | Autorización queda enlazada a la línea/folio específico |
| **Venta bajo piso no autorizada** | No genera comisión — veto total | Factor de Precio Piso = 0 sobre esa línea | Motor de Excepciones (detección automática) | Ninguna — es la ausencia de autorización lo que activa el veto | Comisión de esa línea = 0, sin importar otros factores | Queda registrada como alerta para revisión de Gerencia Comercial |
| **Cambio de vendedor** | La comisión de una venta corresponde a quien era responsable de la cartera al momento de la venta, salvo transferencia formal registrada | Se usa el vendedor responsable vigente en la fecha de la transferencia (ver `SIC_AV_MASTER_ARCHITECTURE.md`, sección 12 — "fecha efectiva de transferencia de cartera") | RR.HH. + Gerencia Comercial | Registro de transferencia con fecha efectiva | Divide la comisión entre el vendedor anterior y el nuevo según la fecha de corte | Registro de transferencia es un dato de primera clase, no un comentario |
| **Cliente compartido** | Requiere una regla explícita de reparto, nunca reparto automático por defecto | Reparto porcentual configurable por cuenta (ej. 70/30), registrado como asignación explícita | Gerencia Comercial | Acuerdo de reparto documentado | Comisión de cada venta de ese cliente se divide según el reparto vigente | Reparto versionado, con fecha de inicio/término |
| **Factura compartida** | Mismo principio que cliente compartido, a nivel de línea/folio | Reparto porcentual configurable por folio | Gerencia Comercial | Acuerdo de reparto para ese folio específico | División de comisión de esa factura entre los vendedores involucrados | Registro por folio |
| **Venta de RTC con apoyo de KAM** | Requiere reparto explícito si el KAM tiene componente individual sobre esa cuenta | Ver sección 9 (roles) — reparto configurable, no automático | Gerencia Comercial | Acuerdo de apoyo documentado | Depende del modelo de rol elegido (pendiente Gerencia) | Registro de la cuenta como "compartida RTC+KAM" |
| **Venta de KAM con apoyo territorial** | Mismo principio anterior, en sentido inverso | Igual que el caso anterior | Gerencia Comercial | Acuerdo de apoyo documentado | Depende del modelo de rol elegido (pendiente Gerencia) | Registro de la cuenta como "compartida KAM+RTC" |
| **Jefe de Ventas con cartera propia** | Su cartera propia se comisiona igual que cualquier RTC/KAM; su bono de equipo (si existe) es un componente aparte | La cartera propia usa la misma fórmula de esta política; el bono de equipo se calcula sobre el desempeño agregado del equipo (modelo pendiente, sección 9 de este documento) | Gerencia Comercial | — | Dos componentes separados y visibles por separado en el Portal | Cada componente se audita independientemente |
| **Cobro posterior al término laboral del vendedor** | La comisión pertenece a quien generó la venta, no a quien está activo al momento del cobro, salvo definición contraria de RR.HH. | Se libera la comisión pendiente al vendedor saliente (o a quien RR.HH. determine como destinatario), con el mismo cálculo de cartera | RR.HH. + Finanzas | Registro de término laboral con fecha | Comisión pendiente se paga según la política de liquidación final que defina RR.HH. (fuera del alcance técnico de este documento) | Registro de vendedor "inactivo con comisión pendiente" |
| **Factura incobrable** | No genera comisión liberada — nunca se cobró | Se retira de la proyección de comisión potencial cuando se declara incobrable | Finanzas | Declaración formal de incobrabilidad | Comisión potencial asociada se anula; no hay comisión liberada que reversar (nunca se liberó) | Registro de declaración de incobrable, con fecha y motivo |
| **Reapertura de un ciclo cerrado** | Excepcional, requiere aprobación explícita y registra el motivo | Se recalcula el ciclo completo con los datos corregidos; la diferencia contra lo ya pagado se registra como ajuste en el ciclo de la reapertura, nunca sobrescribiendo el cálculo original | Gerencia General (aprobación) | Motivo formal de reapertura | Ajuste registrado en el ciclo donde se aprueba la reapertura | El cálculo original permanece visible, marcado como "reemplazado por reapertura X" |
| **Error de carga** | Se corrige en el origen del dato, no como ajuste de comisión | Se corrige el dato fuente (venta, cobro, etc.) y se recalcula; si el ciclo ya cerró, sigue el mismo tratamiento que "reapertura de ciclo cerrado" | Quien detecta el error + Gerencia Comercial (aprobación si el ciclo ya cerró) | Evidencia del error y de la corrección | Depende de si el ciclo está abierto (corrección directa) o cerrado (ajuste registrado) | Registro de la corrección con motivo |
| **Cambio de presupuesto con el ciclo abierto** | El presupuesto usado para cumplimiento y excedente es el vigente al cierre del ciclo, salvo excepción aprobada | Un cambio de presupuesto a mitad de ciclo requiere aprobación de Gerencia Comercial y se registra como excepción — no se aplica retroactivamente sin ese registro | Gerencia Comercial | Aprobación formal del cambio, con motivo y fecha efectiva | Determina qué presupuesto se usa para el cumplimiento y el excedente de ese ciclo | Registro de excepción vinculado al ciclo afectado |
| **Venta en moneda distinta** | La comisión se calcula en la moneda de la venta (CLP en Chile, USD en Perú); no se convierte para el cálculo, solo para consolidación de reportes de grupo | La tasa de cartera, los factores y el bono se aplican sobre el monto en moneda original | Finanzas | — | Sin impacto en el cálculo individual; sí afecta reportes consolidados LATAM | El tipo de cambio usado en reportes queda registrado con fecha (ver `avboard_data.js → meta.tc_clp_usd`) |
| **Tipo de cambio** | Solo relevante para consolidación de reportes de grupo, no para el cálculo individual de comisión | Se usa el TC de referencia vigente del sistema al momento del reporte consolidado | Finanzas | — | Ninguno en la comisión individual | El TC usado queda registrado en el reporte, no en el cálculo de comisión |
| **Impuestos que deben excluirse de la base comisionable** | La comisión se calcula sobre venta neta, no sobre el monto con impuestos incluidos | Se excluye IVA (Chile) e IGV (Perú) de la base antes de aplicar la tasa de cartera | Finanzas | — | Reduce la base comisionable al monto neto real | Debe quedar explícito en el detalle por factura qué monto es neto y cuál es el impuesto excluido |

## 10. Bono por Excedente

Ver desarrollo completo de las dos alternativas (A: mantener 2% flat, B: multiplicador de sobrecumplimiento) y la recomendación en `SIC_AV_MODELOS_COMPARADOS.md`, sección 5. Resumen de la regla recomendada (Alternativa A, refinada):

- El bono se calcula **solo sobre el excedente cobrado** (venta neta cobrada del ciclo que supera el presupuesto vigente de ese ciclo para ese vendedor), nunca sobre la venta total.
- La comisión base (tasa por cartera × factor presupuesto × factor IEC) se calcula sobre el 100% de la venta cobrada, **incluyendo** la porción que excede presupuesto — el bono es un adicional sobre esa porción, no un reemplazo.
- El bono se recomienda condicionar al Factor IEC y al Factor de Precio Piso vigentes de esa misma línea/ciclo — vender de más no debe eximir de la disciplina de precios (principio 4 de la filosofía).
- Se calcula por ciclo, usando el presupuesto congelado al cierre de ese ciclo (sección 4).
- Si la venta que genera el excedente se factura en un ciclo y se cobra en otro, el excedente se determina con el presupuesto del ciclo de facturación (para consistencia con el cumplimiento de ese ciclo), pero el bono se libera cuando efectivamente se cobra, incluso en un ciclo posterior — igual que cualquier comisión pendiente.
- Una nota de crédito posterior reduce el excedente reconocido y genera un ajuste negativo, con el mismo tratamiento del caso general de NC (sección 9).
- Un pago parcial de una factura que genera excedente aplica el bono en proporción a lo efectivamente cobrado de esa porción.

## 11. Roles Comerciales

Ver desarrollo completo de opciones en `SIC_AV_MODELOS_COMPARADOS.md`, sección 6. **No se fija ningún porcentaje distinto por cargo en este documento.** La arquitectura permite configurar RTC, KAM y Jefe de Ventas con reglas propias, pero las decisiones de fondo (¿todos usan la misma tasa base?, ¿KAM tiene componente corporativo?, ¿Jefe de Ventas tiene cartera propia y/o bono de equipo?) quedan explícitamente pendientes de Gerencia General en `SIC_AV_DECISIONES_GERENCIA.md`.

## 12. Gobernanza

- **Motor de Factores:** todo valor de esta política (tasas, factores, umbrales) vive en tablas configurables versionadas, nunca hardcodeadas — mismo principio ya establecido en `SIC_AV_MASTER_ARCHITECTURE.md`, sección 5.B.
- **Cambios de política:** requieren aprobación de Gerencia General, con fecha de vigencia y responsable registrados. Un cambio de política nunca aplica retroactivamente a un ciclo ya cerrado, salvo reapertura formal (sección 9).
- **Versionado:** cada versión de esta política tiene un número (esta es V1) y una fecha de vigencia. Los cálculos de un ciclo siempre usan la versión de política vigente al momento del ciclo, registrada junto con el cálculo.

## 13. Procedimiento de Reclamo

1. El comercial señala la línea/factura o el factor específico en disputa desde el detalle por factura del Portal del Vendedor (`SIC_AV_MASTER_ARCHITECTURE.md`, sección 7.3).
2. El reclamo se registra con fecha, motivo y evidencia aportada por el comercial.
3. Jefe de Ventas revisa en primera instancia; si no se resuelve, escala a Gerencia Comercial.
4. Finanzas valida cualquier ajuste antes de que se refleje en la comisión.
5. Toda resolución (aceptada o rechazada) queda registrada con motivo — nunca se descarta un reclamo sin dejar traza.
6. Si el reclamo afecta un ciclo ya cerrado, sigue el tratamiento de "reapertura de ciclo cerrado" (sección 9).

## 14. Vigencia

Esta es la versión V1, borrador para discusión. No entra en vigencia hasta aprobación explícita de Gerencia General de cada decisión pendiente listada en `SIC_AV_DECISIONES_GERENCIA.md`. Ninguna comisión real debe calcularse con esta política hasta que ese documento quede cerrado.

## 15. Decisiones Pendientes

Ver `SIC_AV_DECISIONES_GERENCIA.md` para el detalle completo. Resumen de las áreas abiertas: modelo de factor de presupuesto (A/B/C), modelo de factor IEC (A/B/C), valor del Factor de Precio Piso autorizado, confirmación del supuesto de tabla combinada de cartera (sección 5), alternativa de bono por excedente (flat vs. multiplicador), y arquitectura de roles comerciales (sección 11).

---

*Documento generado por Claude (Anthropic) · Modo Cowork · Fase 3 — Política V1, sin implementación · Agroveca AV LATAM · 2026-07-12*
