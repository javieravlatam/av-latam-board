# exports/

Reservado para archivos exportados por el sistema (PDFs generados
server-side, lotes de cotizaciones, respaldos). En la Fase 1 las
exportaciones (PDF cliente y JSON de respaldo) se descargan directamente
al navegador del usuario — no se escriben archivos en el repositorio,
porque el módulo corre 100% client-side (sin backend).

Esta carpeta queda preparada para cuando exista un proceso server-side
(ver README.md del módulo, sección "Integraciones futuras") que sí
escriba aquí.
