# Arquitectura Mínima Segura — Flujo Autorización Estado B

**Documento:** SIC-AV v1.7 · Fase 7
**Fecha:** 2026-07-28
**Autor:** Sistema AV LATAM (generado automáticamente)

---

## Por qué NO se implementa autorización en el frontend actual

GitHub Pages es un host de archivos estáticos. Todo el código JavaScript es descargable y
auditable por cualquier usuario. Cualquier "código de autorización" almacenado o validado
en el HTML/JS puede ser bypasseado editando el archivo localmente o desde DevTools.

**Esto incluye**: claves hardcodeadas, localStorage, sessionStorage, hashes comparados en
JS, flags booleanos, cualquier variable de autorización en el cliente.

---

## Lo que SÍ implementa la Fase 7 (frontend estático, sin riesgo)

1. **Bloqueo Estado C**: absoluto, nunca genera PDF si hay ítem < 85% del piso.
   No hay forma de bypasearlo desde el cotizador UI → `PDF.imprimirConControl()` retorna false.

2. **Bloqueo Estado B**: muestra fingerprint de la cotización y contacto. El PDF
   no se genera. El fingerprint es determinista (djb2 sobre contenido comercial) — cambia
   si se modifica cualquier precio, cantidad o transporte.

3. **Fingerprint**: permite al autorizador (GG / GAF) confirmar que aprueba exactamente
   la versión que ve, comunicándolo por correo al vendedor con el código FP-XXXXXXXX.

---

## Arquitectura mínima para autorización real (Estado B)

Para implementar autorización segura sin riesgo de bypass, se requiere **exactamente uno**
de los siguientes:

### Opción A — Función serverless (recomendada)

```
Vendedor (cotizador) → genera fingerprint FP-XXXXXXXX
    → envía cotización + FP por correo al GG/GAF
GG/GAF → abre link: https://api.agrovecalatam.com/autorizar?fp=FP-XXXXXXXX
    → función serverless (Netlify/Vercel/AWS Lambda) registra la aprobación
    → cotizador consulta el estado: GET /api/autorizacion?fp=FP-XXXXXXXX
    → si aprobado: PDF.imprimir() se desbloquea
```

Costo estimado: USD 0 (tier gratuito Netlify/Vercel) + 1-2 días de desarrollo.

### Opción B — Spreadsheet + Apps Script

```
GG/GAF → anota FP-XXXXXXXX en Google Sheet protegida
Apps Script expone: GET endpoint /exec?fp=FP-XXXXXXXX → {aprobado: true/false}
Cotizador consulta → debloquea si aprobado
```

Costo: USD 0 si se tiene Google Workspace.

### Opción C — Email con enlace mágico (simplest)

```
Vendedor → botón "Solicitar autorización" → abre mailto: con FP y datos
GG/GAF responde → vendedor ingresa manualmente el FP de respuesta
Sistema verifica que el FP ingresado === FP calculado de la cotización actual
(no almacena, solo compara en memoria)
```

Limitación: no hay registro de quién autorizó ni cuándo. Aceptable para volumen bajo.

---

## Qué NO hacer

- ❌ Hardcodear una contraseña de autorización en el HTML/JS
- ❌ Comparar un hash secreto en el cliente
- ❌ Usar localStorage para "recordar" que fue autorizado
- ❌ Crear un campo oculto de autorización en el formulario
- ❌ Implementar cualquier lógica de seguridad que viva únicamente en el navegador

---

## Estado actual del sistema (2026-07-28)

| Estado | PDF | Comportamiento |
|--------|-----|----------------|
| A | ✅ Se genera | IEC ≥ 90% y todos los ítems ≥ 85% |
| B | ❌ Bloqueado | Muestra FP + contacto GG/GAF. **Sin autorización backend.** |
| C | ❌ Bloqueado | Bloqueo crítico permanente. Corrección de precios requerida. |

La Opción A (serverless) está lista para implementar cuando se requiera.
Contactar al equipo técnico para activar.
