# AV LATAM BOARD
## Development Standard v1.0

---

## 1. Principios

Todo desarrollo debe:
- usar AVBOARD como fuente;
- evitar duplicidad;
- mantener compatibilidad;
- respetar Formato Javier;
- incluir pruebas;
- documentar cambios;
- preservar trazabilidad.

---

## 2. Prohibiciones

No se permite:
- hardcodear cifras operativas;
- duplicar reglas de negocio;
- crear arrays locales como fuente permanente;
- editar outputs manualmente;
- usar fallbacks silenciosos;
- ocultar errores;
- mostrar cero por falta de dato;
- romper otros paneles.

---

## 3. Flujo de desarrollo

1. Definición funcional.
2. Identificación de fuente.
3. Diseño de datos.
4. Implementación.
5. Pruebas unitarias.
6. Pruebas de integración.
7. Pruebas visuales.
8. Validación de negocio.
9. Commit.
10. Push.
11. Verificación publicada.

---

## 4. Reglas para gráficos

Cada gráfico debe:
- responder una pregunta;
- actualizarse con filtros;
- usar datos oficiales;
- mostrar fuente y corte;
- evitar series innecesarias;
- ser legible en escritorio y móvil.

---

## 5. Reglas para tablas

- Totales conciliados.
- Columnas claras.
- Formatos consistentes.
- Estados faltantes explícitos.
- Acumulados calculados desde valores, no promedios de porcentajes.

---

## 6. Reglas para el SIC

El SIC:
- consume datos del Board;
- aplica reglas de incentivos;
- no reconstruye ventas, presupuesto o IEC;
- no se modifica salvo Change Request aprobado.

---

## 7. Testing mínimo

Todo cambio debe validar:
- fuente;
- cálculo;
- interacción;
- consistencia;
- consola;
- publicación;
- regresión.

---

## 8. Git

- Un cambio funcional por commit.
- Mensaje descriptivo.
- No mezclar documentación con lógica sin necesidad.
- No incluir temporales.
- No incluir node_modules.
- No hacer push sin pruebas.
