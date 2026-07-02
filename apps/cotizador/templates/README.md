# templates/

Reservado para plantillas de documento (PDF cliente, futuros formatos de
Pedido/Factura). En la Fase 1 el PDF cliente se genera en memoria dentro de
`COTIZADOR.PDF.imprimir()` (en `cotizador_core.js`) y se imprime vía
`window.print()` — no requiere un archivo de plantilla separado todavía.

Cuando se sume generación de PDF server-side o un editor de plantillas,
esta carpeta alojará los layouts (ej. `plantilla_cotizacion_cliente.html`,
`plantilla_pedido.html`) y `COTIZADOR.PDF` pasará a cargarlos desde aquí
en lugar de tener el HTML embebido en el core.
