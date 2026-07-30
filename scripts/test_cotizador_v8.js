/**
 * TEST SUITE v8 — Cotizador AV LATAM
 * OBJ1: búsqueda de productos (Catalogo.filtrarProductos / productosUnicos)
 * OBJ2: separación Producto → Presentación → SKU (Catalogo.presentacionesPara / resolverSKU)
 * OBJ3: bloqueo PDF por IEC global < 75% (imprimirConControl)
 * OBJ4: precio_lista_unitario interno preservado (no eliminado)
 *
 * Ejecutar: node scripts/test_cotizador_v8.js
 *
 * RESTRICCIÓN: NO hacer commit ni push si hay tests fallidos.
 * Solo Javier Almeida (javier@agrovecalatam.com) puede aprobar el commit.
 */

'use strict';

// ── Stubs DOM mínimos para cargar cotizador_core.js sin browser ──────
global.window = {};
global.AV_LOGO_DATA_URL = '';
global.AV_CLIENTES_DATA = [];

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const coreCode = fs.readFileSync(
  path.join(__dirname, '../apps/cotizador/cotizador_core.js'), 'utf8'
);
vm.runInThisContext(coreCode, { filename: 'cotizador_core.js' });
const C = COTIZADOR;

// ── Config base ──────────────────────────────────────────────────────
const CONFIG_BASE = {
  iec_politica: {
    iec_min_autorizado: 0.90,
    desviacion_critica_max_item: 0.25  // guardrail por ítem = 75%
  },
  precio_piso_campo: 'precio_piso_unitario',
  margen_campo: 'costo_referencial_unitario'
};

// ── Catálogo de prueba (sin hardcodear SKUs reales) ──────────────────
const CAT = [
  { sku: 'AV-BIO-1L',  producto: 'AV BIOSOLARIS', presentacion: '1 L',  unidad: 'L',  precio_piso_unitario: 10000, precio_lista_unitario: 12000, contenido_presentacion: 1  },
  { sku: 'AV-BIO-5L',  producto: 'AV BIOSOLARIS', presentacion: '5 L',  unidad: 'L',  precio_piso_unitario: 48000, precio_lista_unitario: 58000, contenido_presentacion: 5  },
  { sku: 'AV-BIO-20L', producto: 'AV BIOSOLARIS', presentacion: '20 L', unidad: 'L',  precio_piso_unitario: 170000, precio_lista_unitario: 205000, contenido_presentacion: 20 },
  { sku: 'AV-AMN-1L',  producto: 'AV AMIN',       presentacion: '1 L',  unidad: 'L',  precio_piso_unitario: 8000,  precio_lista_unitario: 9500,  contenido_presentacion: 1  },
  { sku: 'AV-AMN-5L',  producto: 'AV AMIN',       presentacion: '5 L',  unidad: 'L',  precio_piso_unitario: 38000, precio_lista_unitario: 45000, contenido_presentacion: 5  },
  { sku: 'AV-FUL-1KG', producto: 'AV FULVIC',     presentacion: '1 KG', unidad: 'KG', precio_piso_unitario: 15000, precio_lista_unitario: 18000, contenido_presentacion: 1  },
];

// ── Helpers para tests OBJ3 ──────────────────────────────────────────
function mkLinea(pctPiso, piso, qty) {
  // pctPiso: 88 → precio_venta = piso * 0.88
  var precio_venta = piso * (pctPiso / 100);
  return {
    sku: 'TST-SKU', producto: 'PROD TEST', presentacion: '1 L',
    cantidad_envases: qty, precio_piso_unitario: piso,
    precio_venta_unitario: precio_venta, precio_venta_envase: precio_venta,
    precio_lista_unitario: null, costo_referencial_unitario: null,
    contenido_presentacion: 1, factor_presentacion: 1,
    elegible_iec: true,
    iec_linea: precio_venta / piso,
    bajo_piso: precio_venta < piso,
    bajo_objetivo: false,
    total_linea: precio_venta * qty
  };
}

var alertCalls = [];
var openCalls  = [];
global.alert = function(msg) { alertCalls.push(msg); };
global.window = {
  open: function() {
    openCalls.push(1);
    return { document: { write: function(){}, close: function(){} }, focus: function(){}, print: function(){} };
  }
};

// ── Test runner ──────────────────────────────────────────────────────
var passed = 0, failed = 0, total = 0;
function test(name, fn) {
  total++;
  try {
    fn();
    console.log('✓ ' + name);
    passed++;
  } catch(e) {
    console.log('✗ ' + name + '\n    → ' + e.message);
    failed++;
  }
}
function assertTrue(v, msg)  { if (!v) throw new Error(msg || 'Expected true, got ' + v); }
function assertFalse(v, msg) { if (v)  throw new Error(msg || 'Expected false, got ' + v); }
function assertEqual(a, b, msg) {
  if (a !== b) throw new Error((msg || '') + ' Expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a));
}
function assertDeepIncludes(arr, val, msg) {
  if (!arr.includes(val)) throw new Error((msg || '') + ' Array does not include ' + JSON.stringify(val) + '. Got: ' + JSON.stringify(arr));
}

// ════════════════════════════════════════════════════════════════════
// OBJ1+2 — CATÁLOGO
// ════════════════════════════════════════════════════════════════════
console.log('\n── OBJ1+2: Catálogo (Catalogo namespace) ──');

test('CAT-01: Catalogo está expuesto en COTIZADOR', function() {
  assertTrue(C.Catalogo !== undefined && C.Catalogo !== null, 'COTIZADOR.Catalogo debe estar definido');
  assertTrue(typeof C.Catalogo.productosUnicos === 'function', 'productosUnicos debe ser función');
  assertTrue(typeof C.Catalogo.presentacionesPara === 'function', 'presentacionesPara debe ser función');
  assertTrue(typeof C.Catalogo.resolverSKU === 'function', 'resolverSKU debe ser función');
  assertTrue(typeof C.Catalogo.filtrarProductos === 'function', 'filtrarProductos debe ser función');
});

test('CAT-02: productosUnicos — devuelve nombres únicos y ordenados', function() {
  var unicos = C.Catalogo.productosUnicos(CAT);
  // CAT tiene 3 productos: AV AMIN, AV BIOSOLARIS, AV FULVIC
  assertEqual(unicos.length, 3, 'CAT-02: debe haber 3 productos únicos');
  assertEqual(unicos[0], 'AV AMIN',      'CAT-02: primero alfabético');
  assertEqual(unicos[1], 'AV BIOSOLARIS','CAT-02: segundo');
  assertEqual(unicos[2], 'AV FULVIC',    'CAT-02: tercero');
});

test('CAT-03: productosUnicos — catálogo vacío devuelve []', function() {
  var unicos = C.Catalogo.productosUnicos([]);
  assertEqual(unicos.length, 0, 'CAT-03: debe devolver array vacío');
});

test('CAT-04: productosUnicos — null/undefined devuelve []', function() {
  assertEqual(C.Catalogo.productosUnicos(null).length, 0, 'CAT-04: null → []');
  assertEqual(C.Catalogo.productosUnicos(undefined).length, 0, 'CAT-04: undefined → []');
});

test('CAT-05: presentacionesPara — devuelve presentaciones correctas para un producto', function() {
  var pres = C.Catalogo.presentacionesPara(CAT, 'AV BIOSOLARIS');
  assertEqual(pres.length, 3, 'CAT-05: BIOSOLARIS tiene 3 presentaciones');
  var skus = pres.map(function(p){ return p.sku; });
  assertDeepIncludes(skus, 'AV-BIO-1L',  'CAT-05: SKU 1L');
  assertDeepIncludes(skus, 'AV-BIO-5L',  'CAT-05: SKU 5L');
  assertDeepIncludes(skus, 'AV-BIO-20L', 'CAT-05: SKU 20L');
  // Cada elemento tiene sku + presentacion
  assertTrue(pres[0].presentacion !== undefined, 'CAT-05: campo presentacion presente');
});

test('CAT-06: presentacionesPara — producto con una sola presentación', function() {
  var pres = C.Catalogo.presentacionesPara(CAT, 'AV FULVIC');
  assertEqual(pres.length, 1, 'CAT-06: FULVIC tiene 1 presentación');
  assertEqual(pres[0].sku, 'AV-FUL-1KG', 'CAT-06: SKU correcto');
  assertEqual(pres[0].presentacion, '1 KG', 'CAT-06: presentación correcta');
});

test('CAT-07: presentacionesPara — producto desconocido devuelve []', function() {
  var pres = C.Catalogo.presentacionesPara(CAT, 'PRODUCTO INEXISTENTE');
  assertEqual(pres.length, 0, 'CAT-07: producto inexistente → []');
});

test('CAT-08: resolverSKU — resuelve correctamente nombre+presentación → SKU', function() {
  var sku = C.Catalogo.resolverSKU(CAT, 'AV BIOSOLARIS', '5 L');
  assertEqual(sku, 'AV-BIO-5L', 'CAT-08: SKU correcto para BIOSOLARIS 5L');
});

test('CAT-09: resolverSKU — combinación inexistente devuelve null', function() {
  var sku = C.Catalogo.resolverSKU(CAT, 'AV BIOSOLARIS', '100 L');
  assertEqual(sku, null, 'CAT-09: presentación inexistente → null');
});

test('CAT-10: resolverSKU — producto inexistente devuelve null', function() {
  var sku = C.Catalogo.resolverSKU(CAT, 'PRODUCTO X', '1 L');
  assertEqual(sku, null, 'CAT-10: producto inexistente → null');
});

test('CAT-11: filtrarProductos — coincidencia parcial (subcadena)', function() {
  // "BIO" debe encontrar "AV BIOSOLARIS"
  var matches = C.Catalogo.filtrarProductos(CAT, 'BIO');
  assertEqual(matches.length, 1, 'CAT-11: debe haber 1 coincidencia');
  assertEqual(matches[0], 'AV BIOSOLARIS', 'CAT-11: producto correcto');
});

test('CAT-12: filtrarProductos — case-insensitive', function() {
  var matchesLower = C.Catalogo.filtrarProductos(CAT, 'amin');
  var matchesUpper = C.Catalogo.filtrarProductos(CAT, 'AMIN');
  var matchesMixed = C.Catalogo.filtrarProductos(CAT, 'Amin');
  assertEqual(matchesLower.length, 1, 'CAT-12: lower case');
  assertEqual(matchesUpper.length, 1, 'CAT-12: upper case');
  assertEqual(matchesMixed.length, 1, 'CAT-12: mixed case');
  assertEqual(matchesLower[0], matchesUpper[0], 'CAT-12: mismo resultado');
});

test('CAT-13: filtrarProductos — texto vacío devuelve todos los productos únicos', function() {
  var todos = C.Catalogo.filtrarProductos(CAT, '');
  assertEqual(todos.length, 3, 'CAT-13: texto vacío → todos los productos');
});

test('CAT-14: filtrarProductos — sin coincidencia devuelve []', function() {
  var matches = C.Catalogo.filtrarProductos(CAT, 'XXXXXXXX');
  assertEqual(matches.length, 0, 'CAT-14: sin coincidencia → []');
});

test('CAT-15: filtrarProductos — coincidencia en medio de nombre (no solo al inicio)', function() {
  // "SOLAR" está en medio de "AV BIOSOLARIS"
  var matches = C.Catalogo.filtrarProductos(CAT, 'SOLAR');
  assertEqual(matches.length, 1, 'CAT-15: debe encontrar por coincidencia interna');
  assertEqual(matches[0], 'AV BIOSOLARIS', 'CAT-15: producto correcto');
});

test('CAT-16: filtrarProductos — resultado siempre ordenado alfabéticamente', function() {
  // "AV" aparece en los 3 productos
  var matches = C.Catalogo.filtrarProductos(CAT, 'AV');
  assertEqual(matches.length, 3, 'CAT-16: 3 coincidencias con "AV"');
  assertTrue(matches[0] < matches[1], 'CAT-16: primer < segundo');
  assertTrue(matches[1] < matches[2], 'CAT-16: segundo < tercero');
});

test('CAT-17: filtrarProductos — sin duplicados (producto con múltiples SKUs)', function() {
  // AV BIOSOLARIS tiene 3 SKUs → debe aparecer solo 1 vez
  var matches = C.Catalogo.filtrarProductos(CAT, 'BIOSOLARIS');
  assertEqual(matches.length, 1, 'CAT-17: sin duplicados aunque hay múltiples presentaciones');
});

// ════════════════════════════════════════════════════════════════════
// OBJ3 — BLOQUEO PDF POR IEC GLOBAL < 75%
// ════════════════════════════════════════════════════════════════════
console.log('\n── OBJ3: Bloqueo PDF IEC global < 75% ──');

// Helpers para crear quotes de prueba OBJ3
function mkQuote(iecGlobal, lineas) {
  return {
    lineas: lineas || [],
    totales: { iec_global: iecGlobal },
    despacho: { incluido: false, costo_despacho: 0 },
    autorizacion: {}, meta: {},
    cliente: {}, moneda: 'CLP', observaciones: '',
    numero: 'TST-V8', fecha: '2026-07-30',
    condicion_pago: '30d', validez_dias: 30, elaborado_por: 'Test'
  };
}

test('OBJ3-01: IEC = null (cotización vacía) → bloqueado', function() {
  alertCalls = []; openCalls = [];
  var q = mkQuote(null, []);
  var result = C.PDF.imprimirConControl(q, 'Chile', CONFIG_BASE);
  assertFalse(result, 'OBJ3-01: IEC null debe bloquear');
  assertEqual(openCalls.length, 0, 'OBJ3-01: no debe abrir ventana');
  assertTrue(alertCalls.length > 0, 'OBJ3-01: debe mostrar alert');
});

test('OBJ3-02: IEC = 0.00 (0%) → bloqueado', function() {
  alertCalls = []; openCalls = [];
  var lineas = [mkLinea(0, 100, 5)];
  var result = C.PDF.imprimirConControl(mkQuote(0, lineas), 'Chile', CONFIG_BASE);
  assertFalse(result, 'OBJ3-02: IEC 0% debe bloquear');
});

test('OBJ3-03: IEC = 0.74 (74%) → bloqueado', function() {
  alertCalls = []; openCalls = [];
  var lineas = [mkLinea(74, 100, 10)];
  var result = C.PDF.imprimirConControl(mkQuote(0.74, lineas), 'Chile', CONFIG_BASE);
  assertFalse(result, 'OBJ3-03: IEC 74% debe bloquear');
  assertEqual(openCalls.length, 0, 'OBJ3-03: no debe abrir ventana');
});

test('OBJ3-04: IEC = 0.7499 (74.99%) → bloqueado (límite inferior)', function() {
  alertCalls = []; openCalls = [];
  var lineas = [mkLinea(74.99, 100, 10)];
  var q = mkQuote(0.7499, lineas);
  var result = C.PDF.imprimirConControl(q, 'Chile', CONFIG_BASE);
  assertFalse(result, 'OBJ3-04: IEC 74.99% debe bloquear (< 75%)');
});

test('OBJ3-05: IEC = 0.75 (75.00%) → PERMITIDO (en el umbral exacto)', function() {
  alertCalls = []; openCalls = [];
  // Línea exactamente a 75% del piso, todos ítems >= 75% → Estado B o A
  var lineas = [mkLinea(75, 100, 10)];
  var q = mkQuote(0.75, lineas);
  // Necesitamos campos para que PDF.imprimir() funcione
  q.cliente = { nombre: 'Test', rut: '', contacto: '', direccion: '', ciudad: '' };
  q.moneda = 'CLP'; q.numero = 'TST-75'; q.fecha = '2026-07-30';
  q.condicion_pago = '30d'; q.validez_dias = 30; q.elaborado_por = 'Test';
  q.observaciones = ''; q.lugar_entrega = ''; q.elaborado_por = 'Test';
  var result = C.PDF.imprimirConControl(q, 'Chile', CONFIG_BASE);
  assertTrue(result === true, 'OBJ3-05: IEC exactamente 75% debe ser PERMITIDO, got ' + result);
  assertTrue(openCalls.length > 0, 'OBJ3-05: debe abrir ventana PDF');
});

test('OBJ3-06: IEC = 0.89 (89%, Estado B) → PERMITIDO en v8', function() {
  alertCalls = []; openCalls = [];
  var lineas = [mkLinea(89, 100, 5)];
  var q = mkQuote(0.89, lineas);
  q.cliente = { nombre: 'Test', rut: '', contacto: '', direccion: '', ciudad: '' };
  q.lugar_entrega = '';
  var result = C.PDF.imprimirConControl(q, 'Chile', CONFIG_BASE);
  assertTrue(result === true, 'OBJ3-06: Estado B (IEC 89%) debe ser PERMITIDO en v8, got ' + result);
  assertTrue(openCalls.length > 0, 'OBJ3-06: debe abrir ventana PDF');
});

test('OBJ3-07: IEC = 0.90 (90%, Estado A) → PERMITIDO', function() {
  alertCalls = []; openCalls = [];
  var lineas = [mkLinea(90, 100, 5)];
  var q = mkQuote(0.90, lineas);
  q.cliente = { nombre: 'Test', rut: '', contacto: '', direccion: '', ciudad: '' };
  q.lugar_entrega = '';
  var result = C.PDF.imprimirConControl(q, 'Chile', CONFIG_BASE);
  assertTrue(result === true, 'OBJ3-07: Estado A (IEC 90%) debe ser PERMITIDO, got ' + result);
});

test('OBJ3-08: Estado C (ítem < 75%) + IEC global >= 75% → bloqueado por guardrail de ítem', function() {
  alertCalls = []; openCalls = [];
  // Una línea a 74% (ítem < 75%) pero otra a 110%:
  // Construimos manualmente para que iec_global calculado sea >= 75%
  var l1 = mkLinea(74, 100, 5);  // 74%, bajo piso → Estado C
  var l2 = mkLinea(110, 100, 20); // 110%, alto
  // iec_global ponderado = (74*5 + 110*20)/(25) = (370+2200)/25 = 2570/25 = 102.8% → >=75%
  var q = mkQuote(1.028, [l1, l2]);
  var result = C.PDF.imprimirConControl(q, 'Chile', CONFIG_BASE);
  assertFalse(result, 'OBJ3-08: Estado C (ítem < 75%) debe bloquear aunque IEC global >= 75%');
  assertEqual(openCalls.length, 0, 'OBJ3-08: no debe abrir ventana');
});

test('OBJ3-09: INCLUIDO con iec_neto < 75% → bloqueado', function() {
  alertCalls = []; openCalls = [];
  var lineas = [mkLinea(90, 100, 5)];
  var q = {
    lineas: lineas,
    totales: { iec_global: 0.90 },
    despacho: { incluido: true, costo_despacho: 5000 },
    iec_transporte_info: { modo: 'INCLUIDO', iec_neto: 0.69, transporte: 5000 },
    autorizacion: {}, meta: {}, cliente: {}, moneda: 'CLP',
    observaciones: '', numero: 'TST-INCL', fecha: '2026-07-30',
    condicion_pago: '30d', validez_dias: 30, elaborado_por: 'Test'
  };
  var result = C.PDF.imprimirConControl(q, 'Chile', CONFIG_BASE);
  assertFalse(result, 'OBJ3-09: IEC neto 69% (INCLUIDO) debe bloquear aunque IEC bruto 90%');
});

test('OBJ3-10: INCLUIDO con iec_neto = 0.75 → PERMITIDO', function() {
  alertCalls = []; openCalls = [];
  var lineas = [mkLinea(85, 100, 5)];
  var q = {
    lineas: lineas,
    totales: { iec_global: 0.85 },
    despacho: { incluido: true, costo_despacho: 1000 },
    iec_transporte_info: { modo: 'INCLUIDO', iec_neto: 0.75, transporte: 1000 },
    autorizacion: {}, meta: {},
    cliente: { nombre: 'T', rut: '', contacto: '', direccion: '', ciudad: '' },
    moneda: 'CLP', observaciones: '', numero: 'TST-INCL75',
    fecha: '2026-07-30', condicion_pago: '30d', validez_dias: 30,
    elaborado_por: 'Test', lugar_entrega: ''
  };
  var result = C.PDF.imprimirConControl(q, 'Chile', CONFIG_BASE);
  assertTrue(result === true, 'OBJ3-10: IEC neto 75% (INCLUIDO) debe ser PERMITIDO, got ' + result);
});

// ════════════════════════════════════════════════════════════════════
// OBJ4 — precio_lista_unitario PRESERVADO INTERNAMENTE
// ════════════════════════════════════════════════════════════════════
console.log('\n── OBJ4: Precio YTD preservado internamente ──');

test('OBJ4-01: precio_lista_unitario sigue existiendo en los productos del catálogo', function() {
  // Verificar con el catálogo de prueba (el real usa productos_chile.json / productos_peru.json)
  CAT.forEach(function(p, i) {
    assertTrue(p.precio_lista_unitario !== undefined,
      'OBJ4-01: producto[' + i + '] debe tener precio_lista_unitario');
  });
});

test('OBJ4-02: precio_lista_unitario está en CAMPOS_PROHIBIDOS del PDF cliente', function() {
  // La función vistaCliente() debe excluir precio_lista_unitario
  var quoteConYTD = {
    numero: 'TST-OBJ4', fecha: '2026-07-30',
    cliente: { nombre: 'C', rut: '', contacto: '', direccion: '', ciudad: '' },
    elaborado_por: 'Test', condicion_pago: '30d', validez_dias: 30,
    lugar_entrega: '', observaciones: '', moneda: 'CLP',
    despacho: { incluido: false, costo_despacho: 0 },
    lineas: [{
      producto: 'TEST', presentacion: '1 L', cantidad_envases: 5,
      precio_venta_envase: 10000, total_linea: 50000,
      precio_lista_unitario: 12000,  // YTD — no debe aparecer en vista cliente
      precio_venta_unitario: 10000, factor_presentacion: 1, contenido_presentacion: 1
    }],
    totales: { valor_cotizado_total: 50000, subtotal_productos: 50000 }
  };
  var vista = C.PDF.vistaCliente(quoteConYTD);
  // La vista cliente nunca expone precio_lista_unitario
  vista.lineas.forEach(function(l, i) {
    assertTrue(l.precio_lista_unitario === undefined,
      'OBJ4-02: linea[' + i + '] vista cliente no debe tener precio_lista_unitario');
  });
  assertTrue(vista.precio_lista_unitario === undefined,
    'OBJ4-02: quote raíz en vista cliente no debe tener precio_lista_unitario');
});

test('OBJ4-03: precio_lista_unitario NO participa en cálculo de IEC', function() {
  // El IEC usa precio_piso_unitario (no precio_lista_unitario)
  // Si cambiamos precio_lista_unitario pero mantenemos precio_piso, el IEC no cambia
  var linea1 = { sku:'X', producto:'P', presentacion:'1L', cantidad_envases: 10,
    precio_piso_unitario: 1000, precio_venta_unitario: 900, precio_lista_unitario: 500,
    precio_objetivo_unitario: 900, costo_referencial_unitario: null,
    contenido_presentacion: 1, unidad: 'L' };
  var linea2 = { sku:'X', producto:'P', presentacion:'1L', cantidad_envases: 10,
    precio_piso_unitario: 1000, precio_venta_unitario: 900, precio_lista_unitario: 99999, // diferente
    precio_objetivo_unitario: 900, costo_referencial_unitario: null,
    contenido_presentacion: 1, unidad: 'L' };
  var t1 = C.Calc.calcularLinea(linea1, CONFIG_BASE);
  var t2 = C.Calc.calcularLinea(linea2, CONFIG_BASE);
  assertTrue(Math.abs(t1.iec_linea - t2.iec_linea) < 1e-9,
    'OBJ4-03: IEC no debe variar por precio_lista_unitario, t1=' + t1.iec_linea + ' t2=' + t2.iec_linea);
});

test('OBJ4-04: precio_lista_unitario NO participa en Precio Piso', function() {
  // precio_piso_unitario es independiente de precio_lista_unitario
  var linea = { sku:'X', producto:'P', presentacion:'1L', cantidad_envases: 5,
    precio_piso_unitario: 8000, precio_venta_unitario: 7000, precio_lista_unitario: 50000,
    precio_objetivo_unitario: 7500, costo_referencial_unitario: null,
    contenido_presentacion: 1, unidad: 'L' };
  var calc = C.Calc.calcularLinea(linea, CONFIG_BASE);
  assertEqual(calc.precio_piso_unitario, 8000, 'OBJ4-04: precio piso debe ser el campo precio_piso_unitario');
  assertTrue(calc.precio_piso_unitario !== 50000, 'OBJ4-04: precio piso no debe ser el precio_lista_unitario');
});

// ════════════════════════════════════════════════════════════════════
// RESUMEN
// ════════════════════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(60));
console.log('COTIZADOR v8 — RESULTADOS');
console.log('═'.repeat(60));
console.log('Total:   ' + total);
console.log('Pasaron: ' + passed);
console.log('Fallaron:' + failed);
console.log('─'.repeat(60));
if (failed > 0) {
  console.log('⛔  HAY TESTS FALLIDOS — NO HACER COMMIT');
  process.exit(1);
} else {
  console.log('✅  TODOS LOS TESTS PASARON — Listo para revisión de Javier Almeida');
  process.exit(0);
}
