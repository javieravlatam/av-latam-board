# SIC-AV — Decisiones Pendientes de Gerencia General
**Grupo AV LATAM · Fase 3**

Versión: 1.0 · Fecha: 2026-07-12 · Autor: Claude (Anthropic), modo Cowork

Este documento resume **exclusivamente** las decisiones que debe tomar Gerencia General (o el cuerpo que corresponda) antes de que el SIC-AV pueda considerarse una política aprobada. Ninguna recomendación aquí listada está adoptada — son insumos para la decisión, no la decisión misma.

---

### Decisión 1 — Modelo de Factor de Cumplimiento de Presupuesto

- **Opciones:** Modelo A (política actual, con saltos 51-79%→70% / ≥80%→100%) · Modelo B (escala progresiva de 8 tramos) · Modelo C (continuo/interpolado).
- **Recomendación:** Modelo C — elimina el salto abrupto 79%→80% que hoy genera riesgo de manipulación cerca del umbral, sin perder auditabilidad (fórmula explícita y versionada).
- **Impacto:** afecta directamente el monto de comisión de todo cumplimiento entre 50% y 110% — es el factor de mayor impacto financiero de toda la fórmula.
- **Riesgo:** adoptar el Modelo C sin validar su costo total contra datos reales de un ciclo (Fase 7 del roadmap) podría generar sorpresas de costo respecto al Modelo A actual.
- **Fecha requerida:** antes de iniciar la Fase 1 de implementación del SIC-AV (`SIC_AV_MASTER_ARCHITECTURE.md`, sección 14).

### Decisión 2 — Modelo de Factor IEC

- **Opciones:** Modelo IEC A (tabla ya documentada en `docs/AVBOARD_BUSINESS_RULES.md`, hoy usada solo como score de cliente) · Modelo IEC B (progresivo, piso más alto) · Modelo IEC C (continuo/interpolado).
- **Recomendación:** Modelo IEC C — evita que un vendedor de buen volumen pero disciplina de precios imperfecta pierda el 80% de su comisión por un solo indicador (ver simulación de los 4 escenarios en `SIC_AV_MODELOS_COMPARADOS.md`, sección 3).
- **Impacto:** determina cuánto se premia la calidad de venta frente al volumen — es la decisión que más define el "carácter" del sistema (motivador vs. castigador).
- **Riesgo:** la tabla actual (`docs/AVBOARD_BUSINESS_RULES.md`) ya se usa para otro propósito (score de cliente); cambiarla solo para comisión sin comunicarlo claramente puede generar confusión sobre qué tabla aplica a qué.
- **Fecha requerida:** misma fecha que la Decisión 1 — ambos factores se multiplican entre sí y deben aprobarse juntos para evaluar el efecto combinado.

### Decisión 3 — Valor del Factor de Precio Piso Autorizado

- **Opciones:** veto total incluso con autorización (equivalente a Opción A) · comisión completa con autorización (Opción B pura) · comisión reducida con autorización, con un factor configurable (Opción B+C combinada, valor ilustrado en V1 como 0,50).
- **Recomendación:** B+C combinada, con el valor exacto del factor (0,50 es solo ilustrativo) a definir por Gerencia Comercial y Gerencia General en conjunto.
- **Impacto:** afecta cuántas ventas bajo piso autorizadas siguen siendo atractivas comercialmente para el vendedor — un factor muy bajo podría desincentivar ventas estratégicas legítimas; uno muy alto podría erosionar la disciplina de precios.
- **Riesgo:** si el factor se fija demasiado alto, la autorización formal podría convertirse en un atajo sistemático en vez de una excepción real.
- **Fecha requerida:** antes de Fase 2 (Motor de cálculo en ambiente de prueba) de `SIC_AV_MASTER_ARCHITECTURE.md`.

### Decisión 4 — Confirmación del supuesto de tabla combinada de cartera

- **Opciones:** confirmar que la tabla de "pronto pago" reemplaza a la tabla de "edad de cartera" en el tramo 0-180 días (Chile) / 0-60 días (Perú), tal como se modeló en `SIC_AV_POLICY_V1.md` sección 5 · o proponer una lectura distinta de cómo interactúan ambas tablas.
- **Recomendación:** confirmar la lectura combinada — los límites de ambas tablas coinciden exactamente en el punto de corte en los tres países/segmentos, lo que sugiere que es la interpretación correcta, pero **no fue confirmada explícitamente por Finanzas** y no debe asumirse sin esa confirmación.
- **Impacto:** si la lectura correcta fuera otra (por ejemplo, que ambas tablas se apliquen de forma excluyente según el tipo de acuerdo comercial con el cliente, no según el plazo), la tabla de tasas completa debe rehacerse.
- **Riesgo:** aprobar el resto del modelo sin cerrar este punto podría obligar a recalcular todos los casos de prueba y el simulador.
- **Fecha requerida:** antes de aprobar `SIC_AV_POLICY_V1.md` en su totalidad — es un prerrequisito de todas las demás decisiones, no una decisión independiente.

### Decisión 5 — Alternativa de Bono por Excedente

- **Opciones:** Alternativa A (mantener 2% flat sobre el excedente cobrado, ahora condicionado por IEC y precio piso) · Alternativa B (multiplicador escalonado de sobrecumplimiento).
- **Recomendación:** Alternativa A — más simple de auditar y ya familiar para la fuerza comercial; el condicionamiento por calidad es el cambio de fondo, no el porcentaje.
- **Impacto:** determina cuánto se premia adicionalmente el sobrecumplimiento de presupuesto, más allá del Factor de Cumplimiento de Presupuesto ya definido en la Decisión 1.
- **Riesgo:** si se aprueba la Alternativa B en el futuro sin coordinarla con la Decisión 1, podría generar una doble recompensa por sobrecumplimiento (una vía el factor de presupuesto ≥110%, otra vía el bono escalonado) que debe modelarse con cuidado para no duplicar incentivos.
- **Fecha requerida:** junto con la Decisión 1.

### Decisión 6 — Arquitectura de Roles Comerciales (RTC / KAM / Jefe de Ventas)

- **Opciones:** comisión uniforme para los tres cargos (Opción 1) vs. componentes diferenciados (KAM con componente corporativo, Jefe de Ventas con cartera propia y/o bono de equipo) — ver el detalle completo de sub-opciones en `SIC_AV_MODELOS_COMPARADOS.md`, sección 6.
- **Recomendación:** ninguna — este documento deliberadamente no recomienda una arquitectura de roles por instrucción explícita de no inventar porcentajes distintos por cargo; se presentan las opciones para que Gerencia Comercial y RR.HH. decidan.
- **Impacto:** define si el sistema necesita una capa adicional de reglas por cargo desde el día uno, o si puede lanzarse con una fórmula única y añadir diferenciación por cargo en una fase posterior.
- **Riesgo:** decidir esto tarde, después de construir el Motor de Comisiones (Fase 2 de `SIC_AV_MASTER_ARCHITECTURE.md`), obligaría a rediseñar el motor para soportar componentes múltiples por comisión.
- **Fecha requerida:** antes de Fase 2 — el motor debe diseñarse ya sabiendo si necesita soportar un solo componente de comisión por vendedor o varios.

### Decisión 7 — Regla de reparto en cuentas y facturas compartidas

- **Opciones:** reparto automático por defecto (ej. 50/50) vs. reparto explícito registrado por excepción, sin reparto automático por defecto (recomendado en `SIC_AV_POLICY_V1.md`, sección 9, casos "Cliente compartido" y "Factura compartida").
- **Recomendación:** sin reparto automático — cada cuenta o factura compartida requiere un registro explícito de asignación porcentual, aprobado por Gerencia Comercial.
- **Impacto:** evita comisión duplicada en cuentas gestionadas por más de un comercial; sin esta regla, el riesgo de pagar dos veces la misma venta es real y ya fue señalado como brecha en `SIC_AV_MASTER_ARCHITECTURE.md`.
- **Riesgo:** si no se define antes del piloto (Fase 7), cualquier cuenta compartida real generará un caso de reclamo sin regla clara para resolverlo.
- **Fecha requerida:** antes de Fase 7 (Piloto con datos reales).

---

*Documento generado por Claude (Anthropic) · Modo Cowork · Fase 3 — Decisiones pendientes, sin implementación · Agroveca AV LATAM · 2026-07-12*
