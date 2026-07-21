# SIC-AV — Preparación para la Presentación Ejecutiva

Fecha: 2026-07-13 (presentación: mañana). Este documento resume, para quien va a presentar, qué del SIC-AV está listo para mostrarse hoy con datos reales, qué sigue siendo demostrativo, y qué riesgos hay que tener presentes.

> **Nota v1.6 (2026-07-13):** este documento fue escrito antes del CHANGE REQUEST v1.6 (arquitectura temporal definitiva, ver `TEMPORAL_MODEL_v1.6.md`). Dos afirmaciones de abajo quedaron desactualizadas por ese cambio, no por un error nuevo: (1) el "presupuesto" ya no se prorratea al ciclo 26-25 — se lee directamente del mes calendario de desempeño; (2) la comisión **potencial** ya puede ser distinta de $0 con datos reales, porque el Factor de Presupuesto ahora depende de venta neta/presupuesto del mes de desempeño (no de cobranza) — la comisión **liberada** sigue en $0 hasta que exista cobranza real, que es la afirmación central de este documento y sigue vigente.

## Qué está listo

El motor de cálculo (`sic_core.js`) está operativo y sin cambios desde la Fase 4 original — las reglas de Presupuesto, IEC, cartera y la eliminación del Factor de Precio Piso (v1.1-v1.4) siguen vigentes y aprobadas. El adaptador de datos reales (`js/sic_data_adapter.js`) conecta el motor a las fuentes reales del AV LATAM Board sin modificarlo. La página `sic_datos_reales.html` muestra un ciclo comercial real completo (26→25) por país, con conciliación exacta entre la fuente (`TX_CL`/`TX_PE`) y lo que construyó el adaptador. 108 pruebas automatizadas están en OK, 0 fallos.

## Qué está validado (se puede mostrar como dato real)

- **Venta facturada** del ciclo, por vendedor y consolidada — conciliada exactamente contra la fuente (verificado para Chile y Perú).
- **Presupuesto** prorrateado al ciclo 26-25 (mensual real en Chile; anual/12 en Perú, marcado como aproximación).
- **IEC real** del ciclo, recalculado directo desde las transacciones con la misma fórmula y tramos que ya usa AVBOARD.
- **Precio piso**, como clasificación informativa (sobre piso / bajo piso / no evaluable) — nunca como factor que reduce comisión (regla ya definitiva desde v1.4).
- **Número de facturas y de vendedores** del ciclo.
- **Advertencias de integridad** — cada anomalía real detectada (vendedor sin mapeo, posible duplicado, monto inválido, fecha inválida, moneda inconsistente, vendedor sin presupuesto/IEC) se muestra, nunca se oculta.

## Qué NO debe presentarse como definitivo

**La comisión (potencial y liberada) sobre datos reales.** No existe en ninguna fuente conectada del AV LATAM Board una fecha ni un monto real de cobro por factura — los archivos de Cuentas por Cobrar son fotos de saldo pendiente, no un libro de cobros (detalle completo en `COLLECTION_SOURCE_AUDIT.md`). El motor, al no tener venta cobrada, calcula internamente 0 tanto para comisión potencial como liberada — esto es el comportamiento correcto del motor dado el dato disponible, **no un resultado de negocio**. `sic_datos_reales.html` ya no muestra esa cifra como una tarjeta de KPI: muestra un mensaje de estado ("Cálculo definitivo pendiente de integración de cobranza real por factura") en un bloque separado. Si se presenta este ciclo real mañana, **no decir "la comisión de este vendedor es cero"** — decir que el cálculo de comisión está pendiente de una fuente de cobranza que aún no existe.

El **cumplimiento de presupuesto** que se muestra en Bloque 1 (venta facturada / presupuesto) es una aproximación informativa para efectos de la demo — no es el cumplimiento oficial del SIC, que por política se calcula sobre venta cobrada.

## Riesgos a mencionar si preguntan

1. **Perú:** el CxC vive congelado en el código desde el 10/05/2026 (no es solo falta de dato — el pipeline no lo refresca). Si preguntan por saldo de cartera de Perú, aclarar que la cifra que muestra hoy AVBOARD no es de esta semana.
2. **Bug de fechas en Perú (`TX_PE`):** algunas transacciones tienen día/mes invertido o fecha inválida; el adaptador las excluye del ciclo con advertencia visible, no las corrige adivinando.
3. **Mapeo de vendedor:** algunos nombres reales (ej. "RAYEN BERNAZAR") aún no tienen una clave normalizada confirmada por Comercial — aparecen con advertencia, no se descartan.
4. **La técnica de diffing de cortes CxC** (mencionada en `COLLECTION_SOURCE_AUDIT.md` sección 3) es prometedora pero no está validada — si se menciona en la presentación, dejar explícito que requiere confirmación de Finanzas antes de usarse para calcular comisión real.

## Recomendación ejecutiva

Mostrar el SIC-AV como lo que es hoy: un motor de cálculo ya definido y aprobado en sus reglas, corriendo correctamente sobre datos reales de venta, presupuesto e IEC — con un solo bloqueante concreto y ya diagnosticado (fecha y monto de cobro real por factura) para poder liberar comisión real. Ese bloqueante no es un problema del SIC ni de este desarrollo: es una brecha de origen en el registro de cobranzas de Finanzas/Contabilidad, con una recomendación concreta ya escrita (`COLLECTION_SOURCE_AUDIT.md`, sección 5) sobre el dato mínimo necesario para cerrarla. La recomendación es presentar esto como el siguiente paso a decidir con Gerencia General y Finanzas, no como un defecto del prototipo.
