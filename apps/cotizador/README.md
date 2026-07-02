# Cotizador AV LATAM — Centro Comercial AV LATAM

Módulo corporativo de cotizaciones para Chile y Perú con inteligencia
comercial integrada. Vive en `apps/cotizador/` como una aplicación
**completamente independiente** del resto de av-latam-board: no importa
`avboard_data.js` ni `avboard_clientes.js` en tiempo de ejecución, no
depende de `update_avboard.py`, y no modifica ningún dashboard existente.

> **Fase 1 (2026-07-01): arquitectura APROBADA y CONGELADA.** Fase 2
> (2026-07-01, mismo día) evolucionó la experiencia de usuario y sumó
> conceptos nuevos — todo de forma **aditiva**: estructura de carpetas,
> rutas, motor de IEC/semáforo/margen y acceso principal quedaron
> exactamente iguales. El detalle de qué cambió está en la sección 10.

## 1. Estructura

```
apps/cotizador/
├── index.html              Portal — selección de país
├── cotizador.css           Estilos compartidos (misma identidad visual que av-latam-board)
├── cotizador_core.js        Motor: datos, numeración, IEC, semáforo, storage, PDF, export
├── cotizador_chile.html      Pantalla de trabajo — Chile (CLP)
├── cotizador_peru.html       Pantalla de trabajo — Perú (USD)
├── data/
│   ├── config.json          Semáforo IEC, condiciones de pago, estados, numeración
│   ├── productos_chile.json  Catálogo Chile (89 SKUs activos)
│   ├── productos_peru.json   Catálogo Perú (29 SKUs activos)
│   ├── clientes_chile.json   Clientes Chile (148)
│   └── clientes_peru.json    Clientes Perú (42)
├── templates/                Reservado para plantillas de documento futuras
├── exports/                   Reservado para exportaciones server-side futuras
└── README.md                  Este archivo
```

## 2. Origen de los datos semilla

Los catálogos de `data/` se generaron **una sola vez**, el 2026-07-01, leyendo
(sin modificar) `avboard_data.js` (`AVBOARD.productos`, filtrado a
`estado:"OK"` y `piso` definido) y `avboard_clientes.js`
(`CLIENTES_CL` / `CLIENTES_PE`). Son una fotografía inicial, no una
sincronización en vivo.

Campos importantes:
- `precio_piso` y `costo_referencial`: vienen de la tabla piso real, son
  confiables para el cálculo de IEC/margen.
- `precio_lista_ref`: **no es un precio de lista oficial** — es el
  promedio de venta realizado YTD (`precio_uni_prom`), incluido solo como
  referencia en el catálogo. En varios SKUs es menor al precio piso
  (porque refleja ventas históricas, algunas bajo política). No se usa en
  ningún cálculo de IEC/margen ni se autocarga en las líneas de
  cotización — el vendedor siempre ingresa el Precio Unitario de Venta a
  mano. Pendiente: que Javier defina una lista oficial de precios si se
  quiere reemplazar este campo referencial.

Para regenerar los catálogos con datos más recientes (nuevo corte de
`avboard_data.js`), repetir el proceso de extracción — no hay un script
automatizado todavía (queda como mejora futura, ver sección 6).

## 3. Modelo de datos — objeto Cotización

```js
{
  id, numero,              // "AV-CL-2026-0001" / "AV-PE-2026-0001"
  pais, moneda,            // "CL"/"PE", "CLP"/"USD"
  fecha,
  cliente: { nombre, rut, contacto, rtc },
  elaborado_por, condicion_pago, validez_dias, lugar_entrega, observaciones,
  comentarios_internos,     // NUNCA se incluye en el PDF cliente
  estado,                   // BORRADOR|EMITIDA|ENVIADA|APROBADA|RECHAZADA|CONVERTIDA_A_PEDIDO
  lineas: [{
    sku, producto, presentacion, unidad, cantidad,
    precio_piso, costo_referencial, precio_unitario,
    // calculados: total_linea, iec_linea, margen_linea, margen_pct,
    // elegible_iec, bajo_piso, sobre_piso, valor_ganado, valor_cedido
  }],
  totales: {
    precio_piso_total, valor_cotizado_total, iec_global,
    margen_estimado, valor_ganado, valor_cedido,
    n_lineas_bajo_piso, n_lineas_sobre_piso, n_lineas_sin_piso,
    semaforo: { clave, nombre, descripcion, color }
  },
  historial_estados: [{ estado, fecha, por }],
  meta: { creado, actualizado, version_sistema }
}
```

## 4. Inteligencia comercial

**IEC de línea** = `precio_unitario / precio_piso` (solo si la línea tiene
piso definido; si no, la línea queda marcada `elegible_iec:false` y no
entra al cálculo global — igual que en la metodología de IEC por cliente
de `update_avboard.py::compute_iec_chile`, que también excluye
transacciones sin piso mapeado).

**IEC GLOBAL** = `Σ(valor cotizado en líneas elegibles) / Σ(precio piso × cantidad en líneas elegibles)`.
Compara el valor total cotizado contra el valor total al precio piso, tal
como pide el spec. 1.00 = exactamente en piso.

**Semáforo** (umbrales configurables en `data/config.json → iec.semaforo`,
sin tocar código):
| Nivel | Regla por defecto | Significado |
|---|---|---|
| 🟢 Verde | IEC ≥ 1.03 | Cotización sobre política |
| 🟡 Amarillo | 0.98 ≤ IEC < 1.03 | Muy cercana al precio piso |
| 🟠 Naranja | 0.90 ≤ IEC < 0.98 | Bajo política |
| 🔴 Rojo | IEC < 0.90 | Crítica |

Los umbrales exactos (1.03 / 0.98 / 0.90) son un punto de partida
razonable, no una política ya validada por Javier — ajustar en
`config.json` cuando se defina la política oficial.

**Valor ganado / cedido**: suma de `(precio_unitario − piso) × cantidad`
por línea, con piso a favor (ganado) o en contra (cedido) del piso.

**Margen estimado**: `(precio_unitario − costo_referencial) × cantidad`,
sumado por línea. Si alguna línea no tiene costo cargado, el total queda
marcado `margen_estimado_parcial:true` para no mostrar una cifra falsa.

## 5. PDF cliente vs. panel interno

`COTIZADOR.PDF.vistaCliente()` construye explícitamente un objeto
**whitelist** (solo los campos permitidos) — no hay riesgo de fuga de
piso/IEC/costo/margen/alertas/comentarios internos porque esos campos
simplemente no existen en el objeto que llega a la vista de impresión.
El panel interno (columna derecha de cada pantalla de país) es la única
superficie donde se muestran esos datos.

## 6. Persistencia — patrón adapter (importante)

**Fase 1 (actual): 100% client-side.** Las cotizaciones, la numeración
automática y el historial se guardan en `localStorage` del navegador. Esto
significa:
- El historial es **por navegador/equipo**, no compartido entre usuarios
  todavía.
- La numeración (`AV-CL-2026-0001`, etc.) es correlativa dentro de ese
  mismo navegador — dos personas cotizando desde equipos distintos pueden
  generar el mismo número.

Esto es una limitación conocida y aceptada para la Fase 1 ("portal
funcional + pantallas base"), no un descuido. El motor está escrito para
que la migración a un backend compartido sea de bajo impacto:

```js
COTIZADOR.Storage.setAdapter({
  save(quote)          { /* POST a la API */ },
  get(pais, id)         { /* GET */ },
  list(pais, filtros)   { /* GET con query params */ },
  remove(pais, id)      { /* DELETE */ }
});
```

Todas las pantallas llaman siempre a `COTIZADOR.Storage.*`, nunca a
`localStorage` directamente — cambiar el adapter no requiere tocar
`cotizador_chile.html` ni `cotizador_peru.html`.

## 7. Integraciones futuras (arquitectura preparada, NO implementadas)

- **Executive Board**: el objeto `totales` de cada cotización (IEC global,
  margen estimado, semáforo) es el shape natural para alimentar un futuro
  panel de "Cotizaciones activas" — mismo lenguaje de KPIs que ya usa
  avboard (IEC, margen, semáforo verde/ámbar/rojo).
- **CRM / Pipeline Comercial**: el campo `estado` y `historial_estados` ya
  modelan un pipeline (BORRADOR → EMITIDA → ENVIADA → APROBADA/RECHAZADA).
  Falta la vista de pipeline agregada (kanban/funnel), no el dato.
- **Pedidos**: el estado `CONVERTIDA_A_PEDIDO` es el gancho — cuando exista
  el módulo de Pedidos, la transición `APROBADA → CONVERTIDA_A_PEDIDO`
  puede disparar la creación del pedido vía el adapter remoto.
- **Facturación**: la vista limpia de `PDF.vistaCliente()` (sin datos
  internos) es prácticamente el shape de una factura — reutilizable.
- **Reportes Comerciales**: `Storage.list(pais, filtros)` ya soporta
  filtrar por cliente/RTC/fecha/estado/número — es la base de cualquier
  reporte agregado.

Ninguna de estas integraciones se desarrolló en esta fase, tal como se
pidió explícitamente.

## 8. Módulo futuro: CLIENTES

No implementado en esta fase. Cuando se aborde, el catálogo
`clientes_chile.json` / `clientes_peru.json` ya trae `id`, `nombre`,
`rut`, `vendedor_rtc`, `región`, `moneda` — base suficiente para cruzar
con `Storage.list()` y construir evolución por cliente, rentabilidad por
cliente, concentración y riesgo sin rediseñar el modelo de datos.

## 9. Reglas respetadas

- No se modificó ningún dashboard existente (`dashboard.html`,
  `Executive_Board_View_*`, `Panel_*`), ni `update_avboard.py`, ni
  `avboard_data.js`/`avboard_clientes.js`.
- No se usó Chart.js en este módulo (no hace falta en esta fase).
- No se eliminó información previa del repo.
- Todo lo nuevo vive exclusivamente dentro de `apps/cotizador/`.

## 10. Fase 2 — Centro Comercial AV LATAM (2026-07-01)

Evolución de experiencia/funcionalidad sobre la arquitectura congelada
de Fase 1. Todo lo siguiente es **aditivo** — nada de lo descrito en las
secciones 1–9 fue removido, renombrado ni reestructurado.

**Identidad visual:** header y tipografía ahora replican exactamente el
patrón del Executive Board (`.header`, `.logo-mark` "AV", `.header-title`,
`.header-corte` con fecha) en `index.html`, `cotizador_chile.html` y
`cotizador_peru.html`. Encabezado de marca cambiado a
"CENTRO COMERCIAL AV LATAM" con el subtítulo de país/módulo debajo.

**Navegación preparada (sin desarrollar):** `data/config.json →
navegacion.items` controla la barra superior (Portal, Nueva Cotización,
Historial disponibles; Clientes, Productos, Configuración marcados
`disponible:false` → se ven como "Próximamente", inertes, sin handlers).
Agregar un módulo futuro es, en el mejor caso, cambiar ese flag — la
navegación ya está lista para crecer sin tocar HTML.

**Encabezado de cotización:** rediseñado como hero visual
(`.quote-hero`) que destaca Número, Estado, País y Moneda de un vistazo,
sin tocar `Numbering.next()` ni el formato `AV-XX-AAAA-0001`.

**Datos del cliente — autocarga:** al seleccionar un cliente del
catálogo se rellenan automáticamente RUT/RUC, RTC, dirección, ciudad,
correo, teléfono y condición de pago habitual (cuando existen en
`data/clientes_*.json`). Como estos catálogos vienen de
`avboard_clientes.js`, que no trae dirección/correo/teléfono/condición
habitual, esos campos hoy llegan vacíos y quedan editables — ver tarjeta
de resumen `.cliente-card` que muestra explícitamente qué se autocargó y
qué falta completar. Cuando exista una fuente real (CRM), completar esos
campos en el JSON es todo lo que se necesita — el HTML ya los consume.

**Grilla tipo ERP:** la tabla de líneas ahora muestra Producto,
Presentación, Cantidad, Precio Lista (ref.), **Precio Objetivo**, Precio
Piso, Precio Venta, Total e IEC. El IEC sigue calculándose exclusivamente
contra Precio Piso (`Calc.calcularLinea`/`calcularTotales`, sin cambios).

**Precio Objetivo (concepto nuevo):** campo editable por línea
(`linea.precio_objetivo`), sugerido automáticamente entre Piso y Lista
(`Quote.sugerirObjetivo()`, factor configurable en
`config.json → objetivo.factor_default`, hoy 0.5 = punto medio). Todavía
NO participa del IEC ni del semáforo — solo alimenta la nueva
recomendación comercial (abajo) y queda preparado para una política
formal futura.

**Panel de Inteligencia Comercial → Recomendación:** `COTIZADOR.
Recomendacion.generar(totales, moneda)` traduce los totales (ya
calculados, sin cambios) a un mensaje de negociación en 3 niveles:
🟢 Excelente negociación (todo sobre piso y objetivo) · 🟡 Atención
(alguna línea bajo Objetivo pero ninguna bajo Piso) · 🔴 Riesgo Comercial
(alguna línea bajo Piso). El detalle numérico (IEC, margen, ganado/
cedido, semáforo) se conserva íntegro en el panel "Detalle técnico".

**Pipeline visual:** `COTIZADOR.Pipeline` dibuja la barra BORRADOR →
ENVIADA → NEGOCIACIÓN → ACEPTADA → PEDIDO usando
`config.json → pipeline_visual.mapa_estado_real` para resaltar la etapa
más cercana al `estado` real de la cotización. Es decorativo: no tiene
`onclick`, no dispara `Quote.cambiarEstado`, y `RECHAZADA` (que no mapea
a ninguna etapa) se muestra aparte como badge rojo.

**Herramientas / Más opciones:** "Exportar JSON" se movió del botón
principal a un menú desplegable (`.tools-menu`, botón "⋯ Herramientas").
Las acciones comerciales (Guardar, Cambiar estado, PDF Cliente) quedaron
como botones primarios visibles.

**PDF cliente rediseñado:** header corporativo con marca "AV" (logo
oficial del ecosistema, mismo mark que usan los dashboards) + wordmark
"AGROVECA GRUPO LATAM · Centro Comercial AV LATAM", ficha de cliente en
tarjeta, tabla de productos con más aire, y un bloque de firma al pie
("Elaborado por" con línea en blanco) que muestra el texto que el
vendedor escribió a mano en el encabezado — nunca un usuario de sistema.
Sigue sin mostrar piso/objetivo/costo/IEC/margen/alertas/comentarios
internos (whitelist ampliada en `CAMPOS_PROHIBIDOS_CLIENTE`).

**No tocado en Fase 2 (verificado con `git diff`):** `index.html` raíz
(gate de acceso / Acceso Cotizador), todos los dashboards y paneles,
`update_avboard.py`, `avboard_data.js`, `avboard_clientes.js`,
`estados_transiciones`, `Calc.semaforo()`, `Storage`/adapter pattern,
rutas y estructura de carpetas de `apps/cotizador/`.

## 11. Modelo de datos del Centro Comercial (arquitectura futura — no conectada)

Antes de cerrar la sesión de Fase 2 se dejó diseñado el modelo de datos
canónico que usarán las próximas fases del Centro Comercial AV LATAM
(CRM Clientes, Productos, Pricing, Pipeline Comercial). Vive en
`data/modelo/` como un conjunto de archivos **puramente documentales**:
ninguna pantalla, ni `cotizador_core.js`, los carga o depende de ellos.
No se conectó a ninguna base de datos real — es solo el contrato de
campos para cuando corresponda construir esos módulos.

```
data/modelo/
├── modelo_centro_comercial.json   Manifest: entidades, relaciones (FK), roadmap
├── clientes.schema.json           18 campos (CLIENTES)
├── productos.schema.json          11 campos (PRODUCTOS)
├── cotizaciones.schema.json       12 campos (COTIZACIONES — encabezado)
├── detalle_cotizacion.schema.json 11 campos (DETALLE_COTIZACION)
└── configuracion.schema.json      6 secciones (CONFIGURACION, singleton)
```

Cada campo de cada schema documenta: tipo, si es obligatorio, una
descripción, un ejemplo y — el dato más importante para no perder
trazabilidad — **`origen_actual`**: dice explícitamente si el campo ya
existe hoy en Fase 1/2 (y con qué nombre) o si es 100% nuevo y todavía
no tiene ninguna fuente de datos real.

**Resumen de brechas reales (lo que NO existe todavía en ningún archivo):**
- CLIENTES: `cargo`, `lista_precios`, `cultivo_principal`, `superficie`, `observaciones`.
- PRODUCTOS: `categoria` (clasificación técnica/agronómica), y un `precio_lista` oficial (hoy solo hay un promedio referencial, ver sección 2).
- COTIZACIONES: `cliente_id` como referencia formal al cliente (hoy es texto libre nombre/RUT, sin integridad referencial).
- CONFIGURACION: la sección `iva` completa — hoy ninguna cotización calcula ni muestra IVA.

Todo lo demás (la gran mayoría de los campos pedidos) **ya existe** en
`../config.json`, `../productos_*.json`, `../clientes_*.json` o en el
objeto `Quote` de `cotizador_core.js`, solo que con nombres de campo
levemente distintos — cada schema documenta la equivalencia exacta.

**Cómo se usará cuando se aborden los módulos futuros:** el manifest
`modelo_centro_comercial.json → roadmap_integracion` detalla, módulo por
módulo (CRM Clientes, Productos+Pricing, Pipeline Comercial, Reportes
Comerciales), qué entidad consumirá y qué falta completar. La
recomendación registrada ahí es migrar por extensión (agregar campos
nuevos a los archivos operativos que ya existen) en vez de crear fuentes
de datos paralelas, para no duplicar la lógica de carga que
`cotizador_core.js` ya tiene resuelta.

## 12. Motor Logístico Inteligente (Fase 3) — distancia y costo de despacho

Cálculo automático (opcional) de distancia y costo de despacho, aditivo
sobre las Fases 1/2 congeladas. Vive en `quote.despacho{}` — un objeto
**completamente separado** de `quote.totales{}` — por lo que el despacho
nunca participa de `Calc.calcularLinea`/`calcularTotales`, del IEC ni del
semáforo. Verificado con pruebas manuales (ver punto "Validaciones" más
abajo): el IEC global da exactamente el mismo número con el despacho
incluido o excluido; solo el total comercial cambia.

### Cómo configurar OpenRouteService

1. Crear una cuenta gratuita en [openrouteservice.org](https://openrouteservice.org/dev/#/signup) y generar una API key (plan gratuito: 2.000 llamadas/día, suficiente para uso interno).
2. Pegar la key en `data/config.json → logistica.api_key`. **Nunca** se escribe en `cotizador_core.js` ni en ningún HTML — el motor siempre la lee desde `config.json` en tiempo de ejecución (`ctx.config.logistica.api_key`).
3. Completar `logistica.origen_chile` y `logistica.origen_peru` con la dirección real de la bodega/planta de despacho de cada país (hoy quedan con un texto `"PENDIENTE — completar..."` a propósito — no se inventó ninguna dirección). Mientras el origen no esté completado, el sistema no intenta la llamada automática y usa ingreso manual directamente, sin mostrar error.
4. Ajustar `logistica.costo_km_chile_clp` (arranca en **1000 CLP/km**, el valor que pidió Javier) y `logistica.costo_km_peru_usd` (arranca en **0**, pendiente de definir) según la política de cada país.

```json
"logistica": {
  "proveedor_api": "openrouteservice",
  "api_key": "",
  "origen_chile": "PENDIENTE — completar dirección oficial de origen (bodega/planta) Chile",
  "origen_peru": "PENDIENTE — completar dirección oficial de origen (bodega/planta) Perú",
  "costo_km_chile_clp": 1000,
  "costo_km_peru_usd": 0,
  "fallback_manual": true
}
```

**Advertencia de seguridad, por transparencia:** como el módulo es 100%
client-side (ver sección 6 sobre el patrón adapter), la API key viaja en
las llamadas que hace el navegador — cualquiera que inspeccione la
pestaña Red de las herramientas de desarrollador puede verla. Es
aceptable para una key de plan gratuito de uso interno; si se necesita
ocultarla completamente, hace falta un backend/proxy intermedio (fuera
de alcance de esta fase).

### Cómo funciona el fallback manual

El sistema **nunca bloquea la cotización** por no poder calcular la
distancia. El botón "Calcular distancia" (panel DESPACHO / ENTREGA, en
cada pantalla de país):

1. Si falta la API key, o el origen del país sigue con el texto
   `"PENDIENTE..."`, no intenta ninguna llamada — pasa directo a estado
   `manual` con un mensaje claro, y el campo Distancia (km) queda
   editable para que el vendedor la escriba a mano.
2. Si hay key y origen configurados, geocodifica origen y destino y
   calcula la ruta contra OpenRouteService (`driving-car`), con un
   timeout de 12 segundos.
3. Si la API responde bien → estado `automatico`, distancia y tiempo se
   completan solos.
4. Si la API falla por cualquier motivo (sin resultados de geocodificación,
   error HTTP, timeout, CORS, cuota agotada) → estado
   `error_fallback_manual`, con el mensaje de error mostrado y el campo
   Distancia (km) sigue editable — el vendedor sigue cotizando sin
   interrupciones.

En todos los casos, Costo despacho = Distancia (km) × Costo por km, y el
usuario decide con el selector "Incluir despacho en la cotización" si
ese monto se suma o no al total — nunca se agrega solo.

### Qué NO afecta el despacho

- **IEC de línea e IEC Global**: siguen calculándose exclusivamente con
  `precio_piso`, exactamente igual que en Fase 1/2. `quote.despacho` no
  es un input de `Calc.calcularLinea` ni de `Calc.calcularTotales`.
- **Margen estimado**: idem — se calcula solo con `costo_referencial`.
- **Precio Piso / Precio Objetivo**: no se tocan.
- El único número que cambia al incluir despacho es el **total
  comercial** (`Quote.totalConDespacho()` = subtotal productos + costo
  despacho, solo si `incluido:true`).

### PDF cliente

Si el despacho está incluido, aparece como una línea separada
"Despacho / Entrega" con su monto, entre el detalle de productos y el
TOTAL — nunca se muestra distancia, costo por km, proveedor de la API,
ni ningún dato de la lógica interna (whitelist ampliada en
`CAMPOS_PROHIBIDOS_CLIENTE`, igual que IEC/piso/margen desde Fase 1).

### Validaciones realizadas en esta sesión

- IEC global antes/después de activar el despacho: idéntico (probado con
  una cotización de ejemplo vía script de Node — sin cambios en el motor
  de cálculo).
- Total cotizado: cambia exactamente en el monto del despacho al
  activarlo/desactivarlo.
- `PDF.vistaCliente()`: `despacho_incluido` refleja el estado del toggle,
  y nunca expone `distancia_km`/`costo_km`/`api_key`.

## 13. Corrección crítica: precio por presentación (Fase 4, 2026-07-01) — SUPERADA

> ⚠️ **Este modelo fue revertido el mismo día** (ver sección 14). La tabla
> de precios piso real de Agroveca trabaja por litro/kilo, no por
> presentación completa — el modelo `precio_*_presentacion` resultó más
> complejo de lo necesario. Se deja esta sección como registro histórico;
> el modelo vigente hoy es el de la sección 14.

**El problema real:** el catálogo semilla (extraído de `avboard_data.js`)
trae `precio_piso`/`precio_lista_ref`/`costo_referencial` **por litro o
por kilo**, porque así están registradas las ventas históricas en el
libro de ventas — no por envase. Las Fases 1-3 trataban ese número como
si fuera directamente el precio del envase completo, lo cual es
incorrecto para cualquier presentación distinta de "1 L": para AV MOVE
20 L, el piso real por tambor es **150.000** (7.500/L × 20 L), no 7.500.
Además, no todos los productos se negocian por contenido — algunos
(ej. un futuro SKU tipo BIOVECA) se cotizan directo por envase/unidad.

**El modelo corregido — cada línea ahora distingue:**

| Campo | Significado |
|---|---|
| `tipo_precio` | `LITRO` \| `KILO` \| `PRESENTACION` \| `UNIDAD` |
| `contenido_presentacion` | Litros/kilos por envase (LITRO/KILO), o **1** por convención (PRESENTACION/UNIDAD) |
| `unidad_contenido` | `L` \| `KG` \| `UN` |
| `precio_piso_presentacion` / `precio_lista_presentacion` / `precio_objetivo_presentacion` | Precios oficiales de referencia, **siempre por presentación completa** (ya multiplicados por `contenido_presentacion` en el catálogo) |
| `cantidad_envases` | Antes "Cantidad" — número de envases/presentaciones cotizados |
| `precio_venta_unitario` | Lo único que escribe el vendedor: precio por litro/kilo (LITRO/KILO) o precio directo por envase (PRESENTACION/UNIDAD, donde `contenido_presentacion=1` hace que sea el mismo número) |
| `precio_venta_presentacion_calculado` | Calculado, no editable: `precio_venta_unitario × contenido_presentacion` |

**Fórmula única para los 4 tipos** (`Calc.calcularLinea` en `cotizador_core.js`):

```
precio_venta_presentacion_calculado = precio_venta_unitario × contenido_presentacion
total_linea                         = precio_venta_presentacion_calculado × cantidad_envases
IEC_linea                           = total_linea / (precio_piso_presentacion × cantidad_envases)
                                     = precio_venta_presentacion_calculado / precio_piso_presentacion
IEC_global                          = Σ(total_linea, líneas elegibles) / Σ(precio_piso_presentacion × cantidad_envases, líneas elegibles)
```

El truco de `contenido_presentacion = 1` para PRESENTACION/UNIDAD hace
que la misma fórmula sirva para los dos casos del spec sin ramas
especiales — validado con los dos ejemplos exactos que dio Javier:

| Caso | tipo_precio | Entrada | Cálculo | Total esperado | Resultado |
|---|---|---|---|---|---|
| AV MOVE 20 L, cant. 3 | LITRO | precio venta unitario 8.000 | 8.000×20=160.000 → ×3 | 480.000 | ✅ 480.000 |
| BIOVECA unidad, cant. 3 | PRESENTACION | precio venta presentación 25.000 | 25.000×1=25.000 → ×3 | 75.000 | ✅ 75.000 |

**Cómo se clasificó el catálogo actual:** los 118 SKU activos
(89 Chile + 29 Perú) se reclasificaron automáticamente por patrón de
texto en `presentacion` (`"20 L"` → LITRO/20, `"250 GR"` → KILO/0.25,
etc.) — **ningún SKU quedó sin clasificar** (100% de las presentaciones
actuales usan L o GR). El ejemplo de BIOVECA del spec es ilustrativo: no
existe hoy ningún SKU real de tipo PRESENTACION/UNIDAD en el catálogo —
cuando se agregue uno, basta con setear `tipo_precio: "UNIDAD"` (o
`"PRESENTACION"`) y `contenido_presentacion: 1` en su entrada de
`productos_chile.json`/`productos_peru.json`.

**Compatibilidad con cotizaciones ya guardadas:** `Calc.calcularLinea`
incluye un fallback defensivo — si una línea guardada en `localStorage`
antes de esta corrección no tiene `cantidad_envases`/`precio_venta_unitario`/
`precio_piso_presentacion`, se leen los nombres antiguos
(`cantidad`/`precio_unitario`/`precio_piso`) tratando el contenido como 1,
para que el Historial no se rompa. Se recomienda revisar y re-guardar
cualquier cotización BORRADOR creada antes de hoy.

**Qué NO se tocó:** el motor de despacho (Fase 3, sigue 100% separado),
el semáforo, la máquina de estados, el patrón de Storage, y ningún
dashboard fuera de `apps/cotizador/`.

**PDF cliente:** la columna "Precio Unitario Comercial" ahora muestra
`precio_venta_presentacion_calculado` (el precio real por envase que
paga el cliente) — nunca el precio por litro/kilo interno ni
`tipo_precio`. Whitelist ampliada en `CAMPOS_PROHIBIDOS_CLIENTE`.

## 14. Corrección Final: lógica simple de cálculo por presentación (2026-07-01)

**Por qué se revirtió la Fase 4:** el modelo de precio por presentación
(sección 13) era técnicamente correcto pero no correspondía a cómo está
construida la tabla de precios piso real de Agroveca, que **siempre**
trabaja con precio unitario por litro o kilo — nunca por presentación
completa. Javier pidió volver a un modelo simple y comercialmente
correcto el mismo día.

**Regla general — todos los precios son precio unitario por litro/kilo:**

| Campo | Significado |
|---|---|
| `precio_lista_unitario` | Precio de lista de referencia, por litro/kilo |
| `precio_objetivo_unitario` | Precio objetivo sugerido, por litro/kilo |
| `precio_piso_unitario` | Precio piso oficial, por litro/kilo — el único que gobierna el IEC |
| `precio_venta_unitario` | Lo único que escribe el vendedor: precio por litro/kilo (o precio directo por envase en las excepciones de abajo) |
| `cantidad_envases` | Número de envases cotizados |
| `contenido_presentacion` | Litros/kilos por envase (ej. 20 para "20 L") — usado solo para calcular `factor_presentacion` |

**Fórmula general:**

```
total_linea = precio_venta_unitario × factor_presentacion × cantidad_envases
```

**Excepción — presentaciones pequeñas que se cotizan directo por envase**
(ej. 250 g, 500 g): NO se multiplican por su contenido. Configurable en
`data/config.json` → `presentaciones_por_unidad` (lista de texto, **no
hardcodeada** en `cotizador_core.js`):

```json
"presentaciones_por_unidad": ["250 GR", "500 GR"]
```

`Calc.factorPresentacion(presentacion, contenido_presentacion, config)`
normaliza el texto de la presentación (número + primera letra de la
unidad — así "500 GR" y "500 G" matchean igual) y compara contra esta
lista:

```
factor_presentacion = 1                        si la presentación está en presentaciones_por_unidad
factor_presentacion = contenido_presentacion    en cualquier otro caso
```

**IEC** usa el mismo factor en ambos lados, línea y global:

```
IEC_linea  = (precio_venta_unitario × factor_presentacion × cantidad_envases)
           / (precio_piso_unitario  × factor_presentacion × cantidad_envases)
IEC_global = Σ(venta_total_linea, líneas elegibles) / Σ(piso_total_linea, líneas elegibles)
```

**Despacho:** sin cambios — sigue viviendo en `quote.despacho{}`,
completamente separado de `Calc.calcularLinea`/`calcularTotales`. Nunca
afecta IEC, precio piso ni margen; solo se suma al total general si el
usuario lo incluye (`Quote.totalConDespacho`).

**Validado con los 4 casos exactos del spec** (`Calc.calcularLinea` vía
Node, y flujo completo `Quote.nueva → recalcular → totalConDespacho →
PDF.vistaCliente`):

| Caso | Presentación | Cant. envases | Precio venta unitario | Cálculo | Total esperado | Resultado |
|---|---|---|---|---|---|---|
| 1 | AV MOVE 20 L | 3 | 8.000/L | 8.000 × 20 × 3 | 480.000 | ✅ 480.000 (IEC 1,142857 con piso 7.000/L) |
| 2 | Formato 25 KG | 2 | 4.500/KG | 4.500 × 25 × 2 | 225.000 | ✅ 225.000 |
| 3 | Formato 500 g (excepción) | 4 | 10.000/envase | 10.000 × 1 × 4 | 40.000 | ✅ 40.000 |
| 4 | Formato 250 g (excepción) | 6 | 8.000/envase | 8.000 × 1 × 6 | 48.000 | ✅ 48.000 |

También se validó: activar/desactivar despacho **no cambia** el IEC
global (probado con Caso 1 + Caso 3 combinados: IEC = 1,140351 antes y
después de incluir despacho); el total **sí** cambia (520.000 →
565.000 con 45 km × 1.000 CLP/km); `PDF.vistaCliente()` no expone
ninguno de `precio_piso_unitario`, `precio_lista_unitario`,
`precio_objetivo_unitario`, `factor_presentacion`, `contenido_presentacion`,
`precio_venta_unitario`, ni ningún campo del motor logístico — el
cliente ve `producto`, `presentacion`, `cantidad`, `precio_unitario`
(ya el precio por envase) y `subtotal`.

**Catálogo:** `productos_chile.json`/`productos_peru.json` recibieron los
4 campos `*_unitario` de forma aditiva (`precio_piso_unitario` = alias
de `precio_piso` ya existente desde Fase 1, `precio_lista_unitario` =
alias de `precio_lista_ref`, `costo_referencial_unitario` = alias de
`costo_referencial`, `precio_objetivo_unitario` = calculado con
`Quote.sugerirObjetivoUnitario`). **No se borró ningún campo** — los
campos `tipo_precio`/`precio_*_presentacion` de la Fase 4 se conservan
en el catálogo como compatibilidad interna, pero ya no gobiernan el
cálculo ni aparecen en la grilla operativa ni en la whitelist positiva
del PDF.

**UI:** la grilla de líneas (Chile y Perú) volvió a 9 columnas: Producto,
Presentación, Cant. envases, P. Lista unit., P. Objetivo unit., P. Piso
unit., P. Venta unit., Total línea, IEC. El input de precio venta
muestra un sufijo (`/L`, `/KG` o `/envase` según corresponda) para que
el vendedor sepa qué está ingresando.

## 15. Fase 5 — Ajustes finales de UX (2026-07-02)

Arquitectura aprobada y congelada desde la Corrección Final (sección 14).
Esta fase es puramente de experiencia de usuario — no toca IEC, despacho,
numeración, estados ni ningún archivo fuera de `apps/cotizador/`.

**Logo corporativo.** El mark de texto "AV" del header (placeholder desde
Fase 1) se reemplazó por el logo oficial de AV LATAM. Fuente: el único
lugar del repo con un archivo de imagen real es el portal principal de
acceso (`index.html` raíz, bloque `.logo-box`) — el Executive Board
(`dashboard.html`, `Executive_Board_View_AV_Latam_2026.html`) hoy usa el
mismo tipo de mark de texto "AV" que tenía el Cotizador, no una imagen,
así que se tomó el portal principal como fuente única. La imagen se
extrajo **sin modificar** `index.html` (solo lectura) y se guardó en un
archivo nuevo, `apps/cotizador/assets_logo.js` (constante
`AV_LOGO_DATA_URL`, ~33 KB base64), cargado por `apps/cotizador/index.html`,
`cotizador_chile.html` y `cotizador_peru.html` antes de `cotizador_core.js`.
Aparece en: header de las 3 pantallas (caja blanca redondeada, 40px de
alto, imagen a 28px — mismo criterio que el portal principal, sin
agrandarla) y en el PDF cliente / vista previa (mismo archivo, `.brand-mark`
ahora con `<img>` en vez de texto). Si el logo cambia, se actualiza solo
`assets_logo.js`.

**Edición de precios estilo ERP.** El campo "Precio Venta Unitario" (y
también "Precio Objetivo Unitario") perdía el foco en cada tecla porque
el sistema recalculaba y repintaba toda la tabla en cada evento `input`
— eso destruye y vuelve a crear el `<input>`, así que el navegador
"suelta" el foco. Solución: cada campo alterna entre dos modos:
- **Enfocado (editando):** `type="number"`, con el `step` del país
  (spinner nativo), valor crudo sin formato — el usuario escribe "8000"
  de corrido, sin que nada recalcule ni repinte mientras tipea.
- **Sin foco:** `type="text"`, valor formateado ("8.000" en Chile, "8.50"
  en Perú) — HTML5 `type="number"` no admite separador de miles, por
  eso el cambio de tipo.

El cálculo completo (`Quote.recalcular` + repintado de la tabla) se
dispara **solo** en `blur`, `Enter` (que fuerza el blur) o al cambiar de
producto/línea — nunca en `input`. Internamente el valor sigue siendo
número (`parseFloat`), nunca se guarda como texto formateado. El campo
"Cantidad envases" recibió el mismo criterio de recalcular solo al
salir/Enter, sin el formato de miles (es un conteo, no un precio).

**Spinner por país.** `STEP_PRECIO` se define una sola vez por archivo
a partir de la variable `PAIS` ya existente (`'CL'` → 500, `'PE'` → 0.1)
y alimenta el atributo `step` del input en modo edición — nunca
incrementa de a 1.

**Validado:** con jsdom (simulación de teclado real, carácter por
carácter) se confirmó que el nodo `<input>` **no se destruye** durante
la escritura (mismo objeto DOM antes/después de tipear "8000"), que el
formato "8.000" aparece recién al disparar `blur`, que el `step` es 500
tras reenfocar en Chile, y que el logo se carga con el mismo tamaño
(33.366 caracteres base64) que el original. Los 4 casos de la Corrección
Final (sección 14) y la independencia IEC/despacho se re-verificaron
intactos tras estos cambios.
