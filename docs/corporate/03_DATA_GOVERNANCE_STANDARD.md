# AV LATAM BOARD
## Data Governance Standard v1.0

---

## 1. Objetivo

Garantizar que toda cifra sea única, confiable, trazable y consistente.

---

## 2. Fuente oficial

El Libro Base y las fuentes formalmente aprobadas son las únicas fuentes primarias.

Toda cifra derivada debe conservar:
- fuente;
- fecha de actualización;
- transformación;
- responsable;
- versión.

---

## 3. Single Source of Truth

Queda prohibido:
- duplicar ventas;
- duplicar presupuestos;
- mantener arrays paralelos;
- copiar cifras manualmente;
- crear JSON alternativos permanentes;
- usar hardcodeos como fuente operacional;
- recalcular una misma regla en varios módulos.

---

## 4. Flujo oficial

```text
FUENTE
→ VALIDACIÓN
→ TRANSFORMACIÓN
→ AVBOARD CORE
→ CONSUMIDORES
```

---

## 5. Datos maestros

Deben existir catálogos únicos para:
- vendedores;
- clientes;
- productos;
- países;
- monedas;
- períodos;
- cargos;
- equipos;
- aliases.

---

## 6. Reglas de calidad

Todo dato debe validarse por:
- completitud;
- unicidad;
- consistencia;
- formato;
- rango;
- relación con otros datos;
- fecha de actualización.

---

## 7. Tratamiento de faltantes

Nunca reemplazar faltantes con cero.

Usar:
- Pendiente de carga.
- Pendiente de integración.
- Pendiente de validación.
- No disponible.

---

## 8. Trazabilidad

Cada KPI debe poder reconstruirse desde la fuente.

Debe existir evidencia de:
- dato origen;
- transformación;
- fórmula;
- resultado;
- módulo consumidor.

---

## 9. Control de cambios

Toda modificación de:
- fórmula;
- fuente;
- alias;
- período;
- presupuesto;
- lógica;
debe registrarse en CHANGELOG y aprobarse cuando afecte decisiones de negocio.

---

## 10. Conciliación

Antes de producción:
- total país debe coincidir con fuente;
- total vendedor debe coincidir con detalle;
- acumulado debe coincidir con suma mensual;
- PDF debe coincidir con dashboard;
- SIC debe consumir la misma cifra del Board.

---

## 11. Responsabilidades

- Data Owner: valida cifra oficial.
- Finanzas: valida cobranza y cierres.
- Comercial: valida atribución y forecast.
- Tecnología: garantiza pipeline.
- Gerencia General: aprueba reglas estructurales.
