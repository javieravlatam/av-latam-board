# SIC-AV — Auditoría Externa Crítica
**Grupo AV LATAM · Revisión independiente previa a producción**

Versión: 1.0 · Fecha: 2026-07-12 · Autor: Claude (Anthropic), actuando como consultor senior independiente en diseño de incentivos comerciales

**Mandato de esta auditoría:** encontrar debilidades, no proponer soluciones elegantes. Este documento es deliberadamente incómodo. No se modificó ningún archivo del proyecto para producirlo — es una lectura crítica de `SIC_AV_POLICY_V1.md`, `SIC_AV_MODELOS_COMPARADOS.md`, `SIC_AV_CASOS_PRUEBA.csv`, `SIC_AV_SIMULADOR_V1.html`, `SIC_AV_DECISIONES_GERENCIA.md`, `SIC_AV_MASTER_ARCHITECTURE.md`, `SIC_AV_IMPLEMENTATION_STRATEGY.md` y `ARQUITECTURA_ACTUAL_AV_LATAM_BOARD.md`.

---

## Análisis por rol

### 1. Gerente General — ¿esto mueve la empresa hacia donde queremos?

El sistema mueve la empresa hacia **disciplina de precio piso y cobranza rápida**, que son objetivos reales y bien medidos. Pero no mueve la empresa hacia **rentabilidad real** — el IEC mide si se vendió sobre o bajo un precio mínimo, no si el producto vendido deja buen margen. Un vendedor puede maximizar su comisión empujando volumen en SKUs de bajo margen pero sobre piso (el propio Board ya identifica "productos que destruyen margen" como un problema activo — 11 SKUs con margen negativo al corte de julio), y el SIC-AV, tal como está diseñado, no lo penaliza ni lo distingue. Esto es una desconexión real entre el sistema de incentivos y la rentabilidad de la compañía. También preocupa el incentivo de "cerrar el ciclo" — con el corte fijo del día 25, existe el riesgo de presión de cobranza agresiva o descuentos informales a clientes en los últimos días del ciclo para cruzar un umbral de cumplimiento, deteriorando la relación comercial a cambio de comisión de corto plazo. El Modelo C mitiga el riesgo de manipulación de un salto abrupto, pero no elimina el incentivo a "empujar" el cierre de ciclo en sí.

### 2. Director Financiero — ¿riesgo de pagar mal, o de que se dispare el costo?

Sí a ambos. El riesgo de pago incorrecto es alto mientras la plataforma de origen (AV LATAM Board) siga dependiendo de identificadores de vendedor inestables, actualización manual vía regex sobre HTML, y una clave de acceso compartida para todos los roles — nada de esto es exclusivo del SIC-AV, pero el SIC-AV hereda ese riesgo en su totalidad porque calcula dinero real sobre esos mismos datos. El riesgo de costo disparado es estructural: el Modelo C recomendado eleva el techo combinado de Factor Presupuesto × Factor IEC a 110%×110%=121% (más el bono de excedente), contra un techo mucho más bajo en la política actual — esto es, por diseño, más generoso, y no hay ningún tope agregado de costo comercial a nivel compañía que actúe como límite de seguridad si muchos vendedores sobrecumplen a la vez (por ejemplo, en un mes con una venta extraordinaria de mercado). Tampoco existe hoy un control que impida que un cambio de presupuesto a mitad de ciclo (ya contemplado como excepción autorizable) se use, de forma involuntaria o deliberada, para inflar el cumplimiento aparente de un vendedor.

### 3. Gerente Comercial — ¿motiva, desmotiva, es demasiado complejo?

Motiva en el diseño matemático (elimina saltos, premia calidad sin castigar volumen razonable), pero probablemente **desmotiva en la percepción**, por dos razones. Primera: la psicología de metas discretas ("llegué al 100%") suele motivar más que una curva continua, aunque esta última sea técnicamente más justa — es una tensión real entre rigor matemático y experiencia humana que el diseño actual no resuelve. Segunda: multiplicar el Factor de Presupuesto por el Factor IEC castiga de forma compuesta a alguien que es simplemente mediocre (no malo) en ambas dimensiones — 90% de cumplimiento y 90% de IEC no dan 90% de resultado, dan 81%. Un vendedor que se percibe a sí mismo como "bastante bueno" en dos frentes puede sentir que el sistema lo trata como si fuera malo en uno. Es probablemente demasiado complejo para explicarse sin el simulador — y el simulador no sustituye la capacidad de un vendedor de anticipar mentalmente su comisión en la calle, frente a un cliente.

### 4. RTC — preguntas que haría, partes que no entendería, lo que sentiría injusto

- "¿Por qué mi comisión bajó si vendí más este mes?" (posible si el IEC o la cartera empeoraron aunque el volumen subió).
- "Mi cliente pagó tarde porque el área de Finanzas se demoró en facturar, no por mi culpa — ¿por qué me descuentan la tasa de cartera igual?"
- "Recibí un descuento en mi comisión por una nota de crédito de una venta de hace ocho meses que ni recuerdo — ¿por qué aparece ahora?"
- "Mi compañero vendió menos que yo y ganó más — ¿eso es un error o es a propósito?" (es a propósito, por diseño, pero requiere una explicación activa, no autoevidente).
- "Pedí autorización verbal de mi jefe para vender bajo piso porque el cliente amenazaba con irse, pero quedó registrada dos días después — ¿cuenta o no cuenta?"
- Lo que sentiría injusto: que una venta bajo piso autorizada por Gerencia solo le pague la mitad de comisión — sentirá que cumplió lo que le pidieron y aun así lo penalizan.
- Lo que no entendería: por qué existen dos tablas distintas (edad de cartera y pronto pago) que en la práctica se combinan en una sola tabla invisible para él — el modelo interno es más complejo que lo que ve en pantalla.

### 5. Recursos Humanos — administrable, explicable, incorporable a contratos

Administrable solo parcialmente hoy — depende de un pipeline mayormente manual que no escala bien a más vendedores (ver Escalabilidad). Explicable con esfuerzo, no de forma inmediata — requiere material de capacitación más allá del propio documento de política. Incorporable a contratos **con dificultad real**: redactar en un anexo laboral una fórmula con interpolación lineal es inusual y puede generar rechazo o incomprensión en una negociación individual o colectiva; lo más viable es referenciar una "Política Vigente, versión X" externa, lo cual exige un mecanismo formal de cómo se comunican y aceptan los cambios de versión — mecanismo que hoy no existe. Ambigüedades pendientes que RR.HH. no puede resolver sola: qué ocurre con la comisión de un vendedor que finiquita su contrato con ventas pendientes de cobro (la propia política lo declara "fuera de alcance técnico", pero no puede quedar fuera del alcance legal).

### 6. Área Legal — riesgos y conceptos a definir mejor

Esta es, probablemente, el área con mayor riesgo no mitigado del proyecto completo:

- **Modificación unilateral de remuneración variable:** si la comisión se ha pagado de forma reiterada y previsible, cambiar la tabla de factores o el modelo de cálculo puede constituir una modificación de condiciones esenciales del contrato bajo la legislación laboral chilena (y con lógica similar en Perú) — el "versionado técnico" que propone la política no equivale a un mecanismo legal de modificación válida.
- **Descuento de remuneraciones ya pagadas:** el mecanismo de "ajuste negativo" por notas de crédito o devoluciones posteriores implica, en la práctica, descontar de un pago futuro un monto ya liquidado en un ciclo anterior — varios países limitan estrictamente los descuentos de sueldo (en Chile, el artículo 58 del Código del Trabajo, por ejemplo) y esto no ha sido revisado por asesoría legal.
- **Momento de devengo de la comisión:** la filosofía "una venta termina cuando se cobra" puede chocar con interpretaciones laborales de que la comisión se devenga al momento de la venta o servicio prestado, no de su cobro — si no queda redactado como una condición contractual explícita y válida, un tribunal laboral podría no reconocer la distinción potencial/liberada que es central a este sistema.
- **Comisión tras término de la relación laboral:** la política reconoce el caso pero lo deja pendiente — es exactamente el tipo de vacío que genera demandas.
- **Definiciones ambiguas que Legal debe cerrar:** qué constituye "autorización formal" válida (¿verbal, correo, formulario firmado?), quién tiene autoridad de aprobación en cada excepción, y cómo interactúan los "reversos" con el finiquito de un trabajador que ya no está en la empresa.
- **Revisión país por país:** Chile y Perú tienen regímenes laborales distintos — una sola aprobación de Gerencia General no reemplaza una revisión legal local independiente en cada país.

### 7. Desarrollo — qué será difícil de programar, qué puede fallar

Lo más difícil: la prorrata de comisión entre ciclos (una venta facturada en un ciclo y cobrada, parcial o totalmente, en ciclos posteriores) exige un manejo de estado cuidadoso que hoy no tiene dónde vivir de forma confiable — la plataforma base son archivos regenerados completos en cada corte, no una base transaccional. Los cálculos más propensos a error: el bono de excedente cuando una venta que generó excedente se cobra en un ciclo distinto al de facturación (¿qué presupuesto se usa?), y la conciliación cuando hay pagos parciales múltiples sobre la misma factura. Información que falta para programar en serio (ya identificada en fases anteriores, y confirmada aquí): fecha de cobro real, ID único y estable de vendedor, historial de transferencia de cartera, y — nuevo hallazgo de esta auditoría — un esquema claro de a qué nivel se agrega el cálculo (línea de factura vs. factura completa) para facturas con múltiples productos, que hoy no está resuelto de forma inequívoca entre los documentos existentes.

### 8. Auditor Externo — ¿es realmente auditable?

En diseño, sí — el principio *append-only*, el versionado de factores y la trazabilidad de excepciones están bien pensados. En la práctica, hoy no, por una razón muy concreta que cualquier auditor externo señalaría de inmediato: **AV LATAM Board usa una sola clave de acceso compartida para todos los roles** (`sessionStorage.getItem('av_auth')`, la misma para Directores, Jefes y cualquier otro perfil). Mientras eso no cambie, ninguna afirmación de "quién aprobó" o "quién modificó" es verificable — cualquier persona con la clave puede actuar como cualquier rol. Tampoco existe hoy un reporte automático de conciliación que compare, al cierre de cada ciclo, la suma de comisiones individuales contra el total pagado — depende de revisión manual, lo cual no es una garantía de control, es una promesa de diligencia.

### 9. Escalabilidad — 20, 100, 300 vendedores; 5 países; 10 monedas

Con 20 vendedores, el sistema (incluso con su base manual actual) es manejable. Con 100, el pipeline de actualización manual/regex sobre HTML se vuelve un cuello de botella real y una fuente de error humano recurrente — el propio historial del Board ya registra bugs de esta naturaleza (roster de vendedores desincronizado, cifras estáticas desactualizadas). Con 300 vendedores, la arquitectura de archivos planos sin base de datos, sin autenticación individual y sin concurrencia real **deja de ser viable** — no es una advertencia técnica menor, es un techo estructural ya identificado en la Fase 2 de este mismo proyecto. Con 5 países, el sistema hoy tiene la lógica de tasas y presupuesto semi-hardcodeada para Chile y Perú específicamente (no como una tabla de configuración por país genérica) — agregar países adicionales hoy implicaría duplicar código, no agregar filas de configuración. Con 10 monedas, el sistema hoy usa un tipo de cambio de referencia único y fijo (950 CLP/USD) — un escenario multi-moneda real requiere series históricas de tipo de cambio por fecha, que no existen en ningún lugar de la plataforma actual.

### 10. Simplicidad — qué eliminar, qué conservar

**Eliminaría:** mantener tres modelos completos (Actual, Recomendado, Alternativo) en producción de forma permanente — una vez que Gerencia decida, el modelo descartado debería archivarse como referencia histórica, no coexistir indefinidamente como una opción activa del simulador. También simplificaría la fórmula combinando el Factor de Presupuesto y el Factor IEC en un solo índice ponderado (en vez de dos multiplicadores independientes), reduciendo el efecto de castigo compuesto ya señalado en la sección de Gerencia Comercial. **Conservaría, sin negociar:** el veto de precio piso no autorizado (protege la disciplina de precios de forma no ambigua), la base de cálculo sobre venta efectivamente cobrada (protege el flujo de caja real de la compañía), y el principio de trazabilidad *append-only* (es la base de cualquier confianza futura en el sistema, incluso si hoy no está completamente implementado).

---

## Casos límite — hallazgos adicionales

| Caso límite | Estado en el diseño actual |
|---|---|
| Vendedor que cambia de país (CL↔PE) | **No cubierto.** Solo se define transferencia de cartera dentro de un mismo país. |
| Vendedor que cambia de cartera | Cubierto a nivel de principio (fecha efectiva de transferencia), pero sin fórmula exacta de cómo se divide la comisión de una venta a mitad de transición. |
| Venta compartida (cliente o factura) | Cubierto a nivel de principio (registro de reparto explícito), pero **sin mecanismo de resolución de disputa** si las partes no acuerdan el porcentaje. |
| Nota de crédito un año después | Cubierto — ajuste registrado en el ciclo de la NC, sin reescribir el ciclo original. Genera, sin embargo, el riesgo legal ya señalado de descuento de remuneración ya pagada. |
| Cliente que paga en cuotas | Bien cubierto — pago parcial proporcional, con saldo como comisión pendiente. |
| Presupuesto modificado a mitad de ciclo | Cubierto como excepción aprobable, pero **sin control anti-manipulación** (segregación de funciones, doble aprobación). |
| Cambio de precio piso durante el ciclo | **No resuelto explícitamente** en la política de comisión — no queda claro si aplica el piso vigente a la fecha exacta de la venta o el vigente al cierre del ciclo. |
| Devolución parcial | **No cubierto** — solo se modela la devolución total. |
| Pago en otra moneda (descalce venta/pago) | **No cubierto** — solo se aborda venta en moneda distinta a la de reporte consolidado, no el descalce venta-pago. |
| Cuentas estratégicas con condiciones especiales | **No cubierto** como categoría propia — un plazo de pago largo aprobado por Gerencia para un cliente estratégico caería en los mismos tramos de mora que castigan al vendedor por una decisión que no fue suya. |
| KAM apoyando a RTC / RTC apoyando a KAM | Cubierto a nivel de principio (registro de apoyo), sin definir el porcentaje de reparto por defecto ni el flujo de aprobación. |
| Clientes nacionales vs. regionales (multi-país) | **No cubierto** — no se define qué tabla de tasas ni qué vendedor recibe crédito si un cliente compra a través de más de un país. |
| Facturas con múltiples productos | Cubierto a nivel de línea individual, pero **el nivel de agregación para el cálculo de comisión (línea vs. factura completa) no está resuelto de forma inequívoca**. |

---

## Los 30 Principales Riesgos

1. La fórmula no incluye ningún factor de rentabilidad/margen real — solo mide disciplina de precio piso, no si el producto vendido deja buen margen.
2. Multiplicar Factor Presupuesto × Factor IEC compone castigos de forma desproporcionada para un desempeño simplemente mediocre (no malo) en ambas dimensiones.
3. No existe un tope agregado de costo comercial a nivel compañía que actúe como límite de seguridad ante sobrecumplimiento simultáneo de muchos vendedores.
4. Un cambio de presupuesto a mitad de ciclo (ya contemplado como excepción) puede usarse para inflar artificialmente el cumplimiento o excedente sin un control anti-manipulación definido.
5. No hay una prueba documentada de que fraccionar un pago en varias partes sea neutral respecto a la tasa de cartera aplicada — riesgo de arbitraje no verificado.
6. No existe tratamiento para un vendedor que cambia de país a mitad de ciclo o de año.
7. No existe regla explícita sobre qué precio piso aplica si este cambia durante el mismo ciclo comercial.
8. No existe tratamiento para devolución parcial de una factura (solo devolución total).
9. No existe tratamiento para descalce de moneda entre la venta facturada y el pago recibido.
10. No existe una categoría de "cuenta estratégica con condiciones pre-aprobadas" que exima a un vendedor de la penalización estándar por mora cuando el plazo largo fue decisión de Gerencia.
11. El reparto en cuentas o facturas compartidas no define un mecanismo de resolución de disputa si las partes no coinciden en el porcentaje.
12. No está definido si se acepta autorización retroactiva de una venta bajo piso, ni el plazo máximo para registrarla.
13. Riesgo legal de modificación unilateral de remuneración variable al cambiar tablas de factores ya utilizadas de forma reiterada.
14. Riesgo legal de descuento sobre comisión ya pagada por ajustes de notas de crédito o devoluciones posteriores.
15. Tensión no resuelta entre "comisión se paga contra el cobro" y la posible doctrina laboral de devengo al momento de la venta.
16. Vacío legal y operativo sobre la comisión de un vendedor que finiquita su contrato con ventas pendientes de cobro.
17. La autenticación compartida de AV LATAM Board (una sola clave para todos los roles) hace que la trazabilidad de aprobaciones no sea verificable en la práctica hoy.
18. El pipeline de datos de origen sigue siendo mayormente manual y basado en edición regex sobre HTML — alto riesgo de error humano al escalar el número de vendedores.
19. Los identificadores de vendedor (apellido en minúscula en Chile, nombre completo en Perú) no son estables — riesgo de pagar comisión a la persona equivocada.
20. No existe un mecanismo automático de conciliación cierre-a-cierre entre la suma de comisiones individuales y el total pagado.
21. La arquitectura actual (archivos planos, sin base de datos, sin concurrencia real) no soporta bien un crecimiento a 100-300 vendedores.
22. País y moneda están hoy semi-hardcodeados para Chile y Perú — agregar países adicionales requeriría duplicar lógica, no solo configurar datos.
23. El tipo de cambio de referencia es un valor único y fijo — no existe una serie histórica de tipo de cambio necesaria para un escenario multi-moneda real.
24. Complejidad percibida alta para el vendedor de campo — difícil de estimar mentalmente sin recurrir al simulador.
25. Tensión entre el rigor matemático del modelo continuo y la psicología motivacional de metas discretas — puede sentirse menos "conquistable" pese a ser más justo.
26. No existe control de concentración de cliente en el bono de excedente — una sola venta grande de un cliente puede generar el bono completo sin distinguirlo de crecimiento diversificado y sostenible.
27. No está resuelto qué ocurre con un cliente que compra a través de más de un país (cliente regional) — qué tabla de tasas y qué vendedor recibe el crédito.
28. El nivel de agregación del cálculo (por línea de factura vs. por factura completa) no está resuelto de forma inequívoca para facturas con múltiples productos.
29. Los valores ilustrativos no aprobados (ej. Factor de Precio Piso Autorizado = 0,5) podrían filtrarse a producción sin un control de "gate" que impida su uso sin aprobación explícita.
30. Ninguna de las 7 decisiones pendientes de Gerencia tiene fecha límite dura ni mecanismo de escalamiento si no se resuelve a tiempo — riesgo de que el proyecto quede indefinidamente en fase de diseño.

---

## Los 30 Puntos Fuertes

1. Distingue explícitamente comisión potencial, liberada, pendiente, validada, aprobada y pagada — alinea el pago con el cobro real, protegiendo el flujo de caja de la compañía.
2. El veto de precio piso no autorizado es una regla clara y no ambigua que protege la disciplina de precios sin excepciones silenciosas.
3. La autorización de venta bajo piso exige responsable, motivo, fecha y condiciones — crea un rastro de auditoría en vez de erosionar la política de precios en silencio.
4. Los modelos continuos (Presupuesto e IEC) eliminan los saltos abruptos que hoy generan riesgo real de manipulación cerca de un umbral.
5. Se rechaza explícitamente reutilizar automáticamente la tabla de IEC ya existente (diseñada para otro propósito) sin confirmación de Gerencia — muestra rigor metodológico.
6. El principio *append-only* para ajustes de notas de crédito y devoluciones preserva la integridad histórica del cálculo.
7. El documento reconoce abiertamente que faltan datos críticos (fecha de cobro, ID de vendedor, etc.) y no finge que el sistema puede operar sin ellos — evita un lanzamiento prematuro sobre una base de datos incompleta.
8. Reutiliza la infraestructura ya existente de IEC y precio piso de AV LATAM Board en vez de construir una fuente paralela.
9. El simulador se construyó de forma completamente aislada antes de tocar producción — secuencia de implementación responsable.
10. El ciclo comercial (26 al 25) está definido de forma explícita y sin ambigüedad sobre a qué mes pertenece cada venta.
11. Se analizó explícitamente el riesgo de contar dos veces el efecto de cartera (Opción 1 vs. Opción 2) antes de fijar la fórmula — muestra que se buscó activamente un error estructural conocido.
12. El bono de excedente está condicionado por el Factor IEC y el Factor de Precio Piso — evita premiar volumen sin calidad específicamente en el componente de sobrecumplimiento.
13. La arquitectura de roles se dejó deliberadamente abierta, sin inventar porcentajes por cargo — evita decisiones de compensación sensibles tomadas sin la autoridad correspondiente.
14. La tabla de 18 casos especiales cubre una porción significativa de la complejidad real del negocio antes de la entrada en operación, reduciendo sorpresas post-lanzamiento.
15. La gobernanza exige versionado y prohíbe cambios retroactivos silenciosos sobre ciclos ya cerrados.
16. Existe un procedimiento de reclamo definido, con escalamiento claro (Jefe de Ventas → Gerencia Comercial → Finanzas).
17. La fórmula separa conceptualmente "cuánto vendiste", "qué tan bien vendiste" y "cuánto cumpliste tu meta" en componentes distintos, en vez de una mezcla confusa.
18. El simulador permite a Gerencia probar escenarios hipotéticos antes de comprometer una política con impacto de costo real.
19. Los casos de prueba validan explícitamente los escenarios de comisión cero (piso no autorizado, venta sin cobro) — mentalidad de prueba defensiva, no solo de casos felices.
20. El proyecto está atado a un roadmap de fases (0 a 8) en vez de un lanzamiento de una sola vez — reduce el riesgo de implementación.
21. La filosofía nombra explícitamente el equilibrio "Hunter y Farmer" como objetivo medible, dando un criterio futuro de evaluación del sistema.
22. Se reconoce explícitamente que Perú tiene hoy menor madurez de datos que Chile, evitando una falsa simetría entre países.
23. La tabla de tasa de cartera premia de forma significativa el cobro rápido (contado/pronto pago), dando dientes financieros reales a la filosofía de "vender bien".
24. El bono de excedente se calcula solo sobre el excedente, nunca sobre la venta total — evita premiar dos veces el mismo volumen base.
25. La reapertura de un ciclo cerrado requiere aprobación de Gerencia General — evita cambios retroactivos casuales.
26. El IEC sigue contabilizando una venta como "bajo piso" incluso si fue autorizada — preserva la visibilidad ejecutiva real de la disciplina de precios, separada del efecto en la comisión.
27. La comisión se calcula en la moneda de origen de la venta, evitando que el ruido cambiario distorsione el resultado individual.
28. La disciplina de "no fijar porcentajes por cargo sin aprobación" evita decisiones apresuradas sobre una estructura de compensación sensible.
29. Se distingue con claridad la comisión potencial (herramienta de proyección) de la comisión pagable, evitando crear expectativas de pago no respaldadas.
30. El conjunto completo de entregables de la Fase 3 (política, comparación de modelos, casos de prueba, simulador, decisiones pendientes) da a Gerencia una base verificable y falsable para decidir, en vez de un memo abstracto de política.

---

## Las 20 Preguntas Obligatorias Antes de Producción

1. ¿Qué modelo de Factor de Presupuesto y de Factor IEC queda aprobado — A, B o C — y con qué valores finales de tabla?
2. ¿Se confirma con Finanzas que la tabla de "pronto pago" reemplaza a la de "edad de cartera" en el tramo de días correspondiente, o existe una lectura distinta de cómo interactúan ambas tablas?
3. ¿Cuál es el valor final y aprobado del Factor de Precio Piso autorizado?
4. ¿Existe un tope agregado de costo comercial que dispare una revisión obligatoria si el gasto en comisiones supera un porcentaje definido de venta o margen del grupo?
5. ¿Qué control formal (doble aprobación, segregación de funciones) impide que un cambio de presupuesto a mitad de ciclo se use para inflar el cumplimiento o el excedente de un vendedor?
6. ¿Qué tratamiento recibe un vendedor que cambia de país (Chile↔Perú) a mitad de un ciclo o de un año?
7. ¿Qué precio piso aplica exactamente a una venta cuando el precio piso cambia durante el mismo ciclo — el vigente a la fecha de la venta o el vigente al cierre del ciclo?
8. ¿Cómo se calcula el efecto de una devolución parcial de una factura, a diferencia de la devolución total ya definida?
9. ¿Qué ocurre cuando el cliente paga en una moneda distinta a la moneda de facturación de la venta?
10. ¿Existirá una categoría de "cuenta estratégica con condiciones pre-aprobadas" que exima a un vendedor de la penalización estándar por mora cuando el plazo largo fue una decisión de Gerencia?
11. ¿Qué mecanismo de resolución de disputa aplica cuando un RTC y un KAM no llegan a acuerdo sobre el porcentaje de reparto de una cuenta o factura compartida?
12. ¿Se acepta la autorización retroactiva de una venta bajo precio piso, y en qué plazo máximo debe registrarse?
13. ¿Ha sido revisada esta política por asesoría laboral local, de forma independiente, en Chile y en Perú, antes de incorporarla a cualquier contrato o anexo?
14. ¿Qué mecanismo legal ampara los descuentos sobre comisión ya pagada por notas de crédito o devoluciones posteriores, dados los límites legales a los descuentos de remuneraciones en cada país?
15. ¿Cómo se define contractualmente el momento en que la comisión se devenga (venta vs. cobro), de forma que resista una eventual disputa laboral?
16. ¿Qué política de liquidación aplica a un vendedor que termina su relación laboral con ventas todavía pendientes de cobro, y en qué plazo se resuelve?
17. ¿Se reemplazará la clave de acceso compartida de AV LATAM Board por autenticación individual antes de que el SIC-AV calcule comisiones reales?
18. ¿A qué nivel de agregación se calcula la comisión de una factura con múltiples productos — por línea o por factura consolidada — y está esto alineado entre Comercial, Finanzas y Desarrollo?
19. ¿Qué volumen de vendedores, países y monedas debe soportar el sistema en los próximos 24 meses, y puede la arquitectura actual sostenerlo sin un rediseño mayor?
20. ¿Quién tiene la autoridad final y el plazo límite para cerrar cada una de las 7 decisiones pendientes de `SIC_AV_DECISIONES_GERENCIA.md`, y qué ocurre operativamente si no se cierran a tiempo?

---

## Las 10 Recomendaciones Más Importantes

1. Incorporar un factor o control de rentabilidad/margen real antes de aprobar la fórmula final — el sistema hoy puede premiar volumen en productos de bajo margen sin distinguirlo de una venta realmente rentable.
2. Definir un tope agregado de costo comercial a nivel compañía, con revisión financiera obligatoria si se supera.
3. Sustituir la autenticación compartida de AV LATAM Board por acceso individual antes de calcular cualquier comisión real — es prerrequisito de la trazabilidad que el sistema promete.
4. Encargar una revisión legal-laboral independiente en Chile y en Perú antes de incorporar esta política a cualquier contrato, anexo o comunicación formal a la fuerza de ventas.
5. Resolver explícitamente, antes del piloto, los casos límite hoy no cubiertos: cambio de país del vendedor, cambio de precio piso a mitad de ciclo, devolución parcial, descalce de moneda, y cuentas estratégicas con condiciones pre-aprobadas.
6. Definir un mecanismo formal de control (doble aprobación y segregación de funciones) para cualquier cambio de presupuesto durante un ciclo abierto.
7. Evaluar reemplazar la multiplicación independiente de Factor de Presupuesto y Factor IEC por un índice ponderado único, para evitar el castigo compuesto de un desempeño simplemente mediocre en ambas dimensiones.
8. Establecer un control de "gate" que impida que valores ilustrativos no aprobados (por ejemplo, el Factor de Precio Piso Autorizado = 0,5) lleguen a un cálculo de comisión real sin aprobación explícita y registrada.
9. Construir el mecanismo de conciliación automática cierre-a-cierre (suma de comisiones individuales contra el total pagado) antes de iniciar el piloto con datos reales.
10. Asignar fecha límite y responsable de escalamiento a cada una de las 7 decisiones pendientes de Gerencia General — sin esto, el proyecto puede permanecer indefinidamente en fase de diseño sin una fecha real de entrada en producción.

---

## Veredicto Final

# SÍ, PERO...

**No apruebo este sistema para operar en una multinacional tal como está hoy — pero sí apruebo la dirección, el rigor metodológico y la arquitectura de fondo, condicionado al cierre de un conjunto específico y acotado de brechas antes de calcular una sola comisión real.**

La razón para no responder un "NO" categórico es que el trabajo de diseño hecho hasta esta fase es genuinamente sólido en sus fundamentos: separa correctamente comisión potencial de comisión liberada, protege la disciplina de precio piso con un veto real (no una sugerencia), elimina de forma demostrable los saltos que hoy generan riesgo de manipulación en la política vigente, y — algo poco común en un primer diseño — reconoce abiertamente sus propias brechas de datos en vez de esconderlas detrás de una fórmula elegante. El propio hecho de que este documento pueda escribirse con el nivel de detalle que tiene, citando líneas de código, campos exactos y casos de prueba verificables, es evidencia de que el proyecto se está construyendo con una disciplina poco habitual para este tipo de iniciativa.

La razón para no responder un "SÍ" sin condiciones es que existen al menos tres categorías de riesgo que, en una multinacional real, bloquearían la puesta en producción de cualquier sistema que calcule remuneración variable:

Primero, el **riesgo legal-laboral no está evaluado** — ni la modificación de condiciones esenciales del contrato, ni los límites a los descuentos de remuneraciones ya pagadas, ni el momento de devengo de la comisión, tienen hoy una revisión de asesoría legal local en Chile y en Perú. Ningún sistema de incentivos debería activarse en una multinacional sin ese paso, sin importar cuán bien diseñada esté la matemática.

Segundo, el **control interno de la plataforma base no sostiene la trazabilidad que el sistema promete** — mientras AV LATAM Board opere con una clave de acceso compartida y un pipeline mayormente manual, ninguna afirmación de "quién aprobó qué" es verificable en la práctica, y esto es exactamente lo que un auditor externo real señalaría primero, sin necesidad de revisar una sola fórmula.

Tercero, el **sistema hoy no protege la rentabilidad de la compañía**, solo la disciplina de precio piso — son cosas relacionadas pero no idénticas, y esta es la brecha que, si se pasa por alto, puede terminar pagando comisiones completas sobre ventas que, en términos de margen real, no le convienen a Grupo AV LATAM.

Ninguna de estas tres categorías requiere rediseñar el sistema desde cero — las tres son resolubles dentro del roadmap ya definido (`SIC_AV_MASTER_ARCHITECTURE.md`, sección 14) y de las decisiones ya listadas en `SIC_AV_DECISIONES_GERENCIA.md`, más las nuevas preguntas que agrega esta auditoría. Por eso la respuesta correcta no es "NO" ni "SÍ" — es "SÍ, PERO": sí a la dirección y al rigor del diseño, condicionado a que estas tres categorías de riesgo se cierren formalmente, con evidencia registrada de su cierre, antes de que el SIC-AV calcule una sola comisión que afecte el ingreso real de una persona.

---

*Documento generado por Claude (Anthropic), actuando como consultor externo independiente · Auditoría crítica, sin modificaciones al proyecto · Agroveca AV LATAM · 2026-07-12*
