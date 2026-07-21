# GG CHANGE REQUEST 2026-002
## Reingeniería Corporativa del AV LATAM BOARD

**Proyecto:** AV LATAM BOARD  
**Responsable:** Gerencia General  
**Estándar visual:** Formato Javier  
**Estado:** Auditoría previa a implementación  
**Prioridad:** Crítica  

---

## 1. Rol

Actúa simultáneamente como:

- Chief Technology Officer (CTO)
- Enterprise Software Architect
- Business Intelligence Architect
- Data Governance Lead
- QA Director
- UX Executive Designer
- Especialista senior en Power BI, Tableau y SAP Analytics Cloud
- Consultor estratégico orientado a Directorio

No actúes como desarrollador ejecutando cambios.

Tu misión inicial es **auditar, simplificar y rediseñar conceptualmente** el AV LATAM BOARD antes de cualquier nueva implementación.

## 2. Visión corporativa

El AV LATAM BOARD pasa oficialmente a ser:

> **La plataforma corporativa de inteligencia comercial del Grupo AV LATAM.**

Debe servir como fuente oficial para Directorio, Gerencia General, Gerencias Comerciales, Finanzas, Operaciones, Reportes, PDF, Forecast, KPIs, IEC y SIC.

## 3. Arquitectura corporativa oficial

```text
LIBRO BASE
   ↓
PIPELINE DE ACTUALIZACIÓN
   ↓
AV LATAM BOARD (CORE)
   ↓
EXECUTIVE BOARD / DASHBOARDS / REPORTES
   ↓
SIC AV
```

### Libro Base
Es la única fuente primaria de información.

### Pipeline
Transforma la información del Libro Base al formato consumido por AVBOARD. Debe ser automático, trazable y reproducible.

### AV LATAM BOARD
Es la única fuente oficial de información comercial. Aquí deben vivir una sola vez ventas, presupuestos, forecast, cobranza, clientes, productos, IEC, KPIs, márgenes, rankings, tendencias e históricos.

### Executive Board
Es el cerebro ejecutivo del sistema.

### SIC AV
El SIC no es fuente de datos. No debe recalcular ni almacenar ventas, presupuestos, forecast, IEC, clientes, productos, KPIs o cobranza. Solo debe consumir datos validados de AVBOARD, aplicar reglas de incentivos, calcular remuneración variable, generar simulaciones, liquidaciones y PDF.

**Restricción obligatoria:** no modificar el SIC durante esta auditoría.

## 4. Principios intransables

### Single Source of Truth
Toda cifra debe existir una sola vez. No puede haber datos duplicados, arrays paralelos, JSON paralelos, hardcodeos o fallbacks permanentes.

### Consistencia corporativa
Una misma cifra debe coincidir exactamente entre Directorio, Panel Chile, Panel Perú, Paneles de Jefes, Executive Board, SIC, PDF y reportes.

### Automatización
```text
Libro Base → Scripts → AVBOARD → Paneles → Executive Board → SIC → PDF
```

### Formato Javier
Toda la plataforma debe usar el estándar visual oficial: azul corporativo, verde AV, blanco como base, amarillo para advertencias, rojo solo para críticos, cards ejecutivas, tablas limpias, espaciado amplio, jerarquía visual clara, tipografía legible y navegación consistente.

### Overview → Drill Down
Nivel 1: Gerencia General — KPIs, alertas, excepciones y decisiones.  
Nivel 2: Gerencia Comercial — país, vendedor, línea, cliente, forecast e IEC.  
Nivel 3: Operación — factura, producto, documento y movimiento.

## 5. Objetivo principal

No quiero más dashboards. Quiero menos dashboards, pero mejores.

La misión es eliminar, consolidar, simplificar, homologar y optimizar. Cada gráfico debe responder una pregunta ejecutiva. Si no permite tomar una decisión, debe proponerse para eliminación.

## 6. Fase 1 — Arquitectura y pipeline

Construir el mapa completo Libro Base → Scripts → Transformaciones → AVBOARD → Paneles → Executive Board → SIC → PDF.

Para cada tramo indicar archivo origen, script, función, archivo generado, variable, consumidor, estado y riesgo.

Determinar qué debería ocurrir al actualizar el Libro Base, qué ocurre realmente, dónde se rompe la cadena, qué outputs deberían regenerarse, cuáles no se regeneran y si commit + push es suficiente o requiere proceso adicional.

## 7. Fase 2 — Integridad de datos

Tomar al menos cinco datos reales —venta, presupuesto, cliente, producto, vendedor, IEC o cobranza— y trazarlos desde Libro Base hasta PDF. Documentar cualquier diferencia. No aceptar discrepancias.

## 8. Fase 3 — Auditoría funcional completa

Revisar todos los botones, filtros, tabs, dropdowns, cambios de vendedor, cliente, país y período, gráficos, tablas, tooltips, navegación, exportación y PDF.

Caso confirmado:

```text
Panel Presupuesto → Curva acumulada → Selección de vendedor → El gráfico no cambia
```

Buscar todos los casos equivalentes.

## 9. Fase 4 — Componentes pendientes o perdidos

Verificar el estado del Cuadro Ejecutivo Mensual por vendedor:

| Mes | Presupuesto | Venta Real | Cumplimiento % |
|---|---:|---:|---:|

Debe incluir todos los meses y una fila final con presupuesto acumulado, venta acumulada y cumplimiento acumulado.

Determinar si existe, se perdió, fue sobrescrito, quedó fuera del commit, nunca se implementó o existe pero no está conectado. Buscar otros componentes pendientes.

## 10. Fase 5 — Redundancias

Identificar gráficos, KPIs, tablas, botones, filtros, paneles e indicadores repetidos. Para cada componente responder: ¿qué decisión ejecutiva permite tomar? Si la respuesta es ninguna, proponer eliminación.

## 11. Fase 6 — Datos hardcodeados

Buscar demo, fallback, hardcoded, arrays locales, const, vendedoresData, rtc_mensual_real, rtc_mensual_ppto, pptoMes, meses[], JSON paralelos, cifras embebidas, datos estáticos y scripts obsoletos.

Documentar archivo, línea o función, dato, panel afectado, riesgo y fuente correcta esperada.

## 12. Fase 7 — IEC

El IEC es prioridad estratégica. Auditar fórmula, fuente, reglas, consistencia, histórico, actualización, integración con AVBOARD, visualización, ranking, tendencia, causas e impacto.

No modificarlo todavía. Certificar si el cálculo es único, si todos los módulos usan la misma cifra, si existe duplicidad, si se actualiza desde el Libro Base y si el SIC lo consume correctamente.

## 13. Fase 8 — Formato Javier

Revisar toda la plataforma. Identificar pantallas que no cumplen, estilos antiguos, colores inconsistentes, tipografías pequeñas, cards distintas, tablas diferentes, exceso de información, navegación incoherente y saturación visual. Proponer homologación sin modificar.

## 14. Fase 9 — Publicación

Verificar GitHub Pages, rama y carpeta publicada, último commit, caché, manifests, service workers, versionado, query strings, timestamps y archivos JS servidos. Confirmar si la URL pública corresponde al último commit. No concluir “es caché” sin evidencia.

## 15. Fase 10 — Calidad de código y mantenibilidad

Detectar código duplicado, funciones repetidas, scripts innecesarios, archivos muertos, dependencias innecesarias, lógica duplicada, módulos obsoletos, acoplamientos riesgosos, deuda técnica y riesgos de escalabilidad.

Evaluar si la plataforma puede crecer durante cinco años incorporando nuevos países, empresas, líneas de negocio, usuarios, módulos e integraciones.

## 16. Fase 11 — Reingeniería corporativa

No entregar una lista de problemas independientes. Identificar cambios estructurales que resuelvan múltiples problemas a la vez.

Responder qué conservar, eliminar, consolidar, mover, unificar, convertir en componente reutilizable, sacar del SIC y llevar a AVBOARD, y qué paneles deben fusionarse.

Objetivo orientativo: reducir entre 30% y 40% la carga visual y componentes redundantes sin perder funcionalidad ni información crítica.

## 17. Plan Maestro de Cierre

Clasificar hallazgos en:

- Cambios arquitectónicos
- Cambios de datos
- Cambios funcionales
- Cambios visuales
- Mejoras evolutivas

Cada fase debe indicar objetivo, problemas resueltos, archivos afectados, dependencias, riesgo, impacto, validación y criterio de aceptación.

No quiero 40 correcciones. Quiero el mínimo número posible de cambios estructurales con el máximo impacto.

## 18. Matrices obligatorias

### Matriz de dependencias
| Módulo | Fuente | Script | Archivo | Variable | Estado | Riesgo |

### Matriz funcional
| Funcionalidad | Estado | Archivo | Resultado | Prioridad |

Estados: FUNCIONA, PARCIAL, ERROR, NO IMPLEMENTADA, OBSOLETA.

### Matriz de integridad
| Dato | Libro Base | AVBOARD | Panel | SIC | PDF | Coincide |

### Matriz de redundancias
| Componente | Repetición | Valor ejecutivo | Acción recomendada |

## 19. Definición de Done

El proyecto solo podrá considerarse terminado cuando:

- exista una única fuente de datos;
- todas las cifras coincidan;
- el Libro Base actualice toda la plataforma;
- no existan controles rotos;
- todos los gráficos respondan dinámicamente;
- no existan datos hardcodeados;
- el IEC esté completamente integrado;
- el SIC consuma únicamente AVBOARD;
- todos los paneles utilicen Formato Javier;
- GitHub Pages publique correctamente;
- el Executive Board sea la fuente oficial para Gerencia General;
- la arquitectura esté preparada para cinco años de crecimiento.

## 20. Entregables

Crear:

1. `01_BOARD_FULL_AUDIT.md`
2. `02_BOARD_DATA_INTEGRITY.md`
3. `03_BOARD_PIPELINE.md`
4. `04_BOARD_FUNCTIONAL_AUDIT.md`
5. `05_BOARD_VISUAL_AUDIT.md`
6. `06_BOARD_FORMATO_JAVIER.md`
7. `07_BOARD_REDUNDANCY_REPORT.md`
8. `08_BOARD_PENDING_FEATURES.md`
9. `09_BOARD_MASTER_REFACTOR_PLAN.md`
10. `10_BOARD_CORPORATE_READINESS.md`

## 21. Restricciones

No modificar código.  
No regenerar outputs.  
No corregir.  
No hacer commit.  
No hacer push.  
No tocar el SIC.  
Primero entregar la auditoría completa.

## 22. Informe final

Responder únicamente:

1. Estado general.
2. Corporate Readiness Score.
3. Data Integrity Score.
4. Architecture Score.
5. Functional Score.
6. UX Score.
7. Maintainability Score.
8. Scalability Score.
9. Riesgo general.
10. Causa raíz principal.
11. Punto donde se rompe el pipeline.
12. Paneles con problemas.
13. Funcionalidades rotas.
14. Componentes redundantes.
15. Funcionalidades pendientes.
16. Estado del IEC.
17. Estado de integración SIC–AVBOARD.
18. Plan Maestro de Cierre.
19. Recomendación como CTO.
20. Dictamen: **APTO PARA PRODUCCIÓN** o **NO APTO PARA PRODUCCIÓN**.

Finalmente, proponer **un único CHANGE REQUEST priorizado** que resuelva el máximo número de hallazgos con el mínimo número de cambios.
