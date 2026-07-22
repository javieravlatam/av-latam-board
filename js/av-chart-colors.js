/**
 * FORMATO JAVIER v1.1 — Chart Colors & Defaults
 * AV LATAM Design System · Estándar Oficial
 * Autor: Javier Almeida · 2026-07-21
 *
 * Paleta centralizada para Chart.js.
 * Elimina todos los hex hardcodeados en los paneles.
 * Cargar una sola vez, ANTES que los scripts de panel.
 *
 * Uso en panel:
 *   backgroundColor: window.AV_CHART_COLORS.GREEN,
 *   ...window.AV_CHART_DEFAULTS({ tension: 0.4 })
 */

;(function (global) {
  'use strict';

  /* -------------------------------------------------------------------------
     PALETA PRINCIPAL
     Coincide 1:1 con los tokens CSS de formato-javier-tokens.css.
     No modificar valores independientemente — deben mantenerse sincronizados.
  --------------------------------------------------------------------------- */
  var COLORS = {
    /* Marca AV */
    GREEN:      '#7AB648',
    GREEN_DARK: '#5a8f35',
    GREEN_DIM:  'rgba(122, 182, 72, 0.18)',

    /* Estados semánticos */
    DANGER:     '#E74C3C',
    DANGER_DIM: 'rgba(231, 76, 60, 0.18)',
    WARNING:    '#F5A623',
    WARNING_DIM:'rgba(245, 166, 35, 0.18)',
    INFO:       '#4A9EDB',
    INFO_DIM:   'rgba(74, 158, 219, 0.18)',

    /* Corporativo */
    CORPORATE:  '#0d3b66',
    TEAL:       '#2bbfb0',
    VIOLET:     '#8b5cf6',

    /* Neutros para texto en charts */
    TEXT_MUTED: '#6a8070',
    TEXT_DIM:   '#8fa892',
    TEXT:       '#e8f0e9',

    /* Grid y ejes */
    GRID:       'rgba(122, 182, 72, 0.08)',
    BORDER:     'rgba(122, 182, 72, 0.18)',
  };

  /* -------------------------------------------------------------------------
     SECUENCIAS — series categóricas (hasta 8 categorías)
  --------------------------------------------------------------------------- */
  var SEQUENCES = {
    /* Secuencia estándar para gráficos de barras/línea multi-serie */
    DEFAULT: [
      '#7AB648',   /* verde AV */
      '#4A9EDB',   /* azul info */
      '#F5A623',   /* ámbar */
      '#2bbfb0',   /* teal */
      '#8b5cf6',   /* violeta */
      '#E74C3C',   /* rojo */
      '#8fa892',   /* neutral */
      '#0d3b66',   /* corporativo */
    ],

    /* Secuencia para comparativas presupuesto vs real */
    BUDGET_VS_ACTUAL: [
      '#7AB648',   /* real — verde */
      '#4A9EDB',   /* presupuesto — azul */
    ],

    /* Escala de verde para rankings dentro de una misma categoría */
    GREEN_SCALE: [
      '#3d6024',
      '#5a8f35',
      '#7AB648',
      '#a8d07d',
      '#d4ebb8',
    ],
  };

  /* -------------------------------------------------------------------------
     DEFAULTS DE CONFIGURACIÓN
     Retorna el objeto de defaults de Chart.js para el tipo solicitado.
     Merge con opciones específicas del gráfico usando Object.assign.
  --------------------------------------------------------------------------- */
  function AV_CHART_DEFAULTS(overrides) {
    var base = {
      responsive:          true,
      maintainAspectRatio: false,

      animation: {
        duration: 500,
        easing:   'easeOutQuart',
      },

      plugins: {
        legend: {
          labels: {
            color:    COLORS.TEXT_DIM,
            font:     { family: "'DM Sans', system-ui, sans-serif", size: 11 },
            boxWidth: 10,
            padding:  12,
          },
        },
        tooltip: {
          backgroundColor: '#0f1a10',
          titleColor:      COLORS.TEXT,
          bodyColor:       COLORS.TEXT_DIM,
          borderColor:     COLORS.BORDER,
          borderWidth:     1,
          padding:         10,
          titleFont:  { family: "'DM Sans', system-ui, sans-serif", weight: '600', size: 12 },
          bodyFont:   { family: "'DM Mono', 'Courier New', monospace", size: 11 },
        },
      },

      scales: {
        x: {
          grid:  { color: COLORS.GRID, drawBorder: false },
          ticks: { color: COLORS.TEXT_MUTED, font: { family: "'DM Mono', 'Courier New', monospace", size: 10 } },
        },
        y: {
          grid:  { color: COLORS.GRID, drawBorder: false },
          ticks: { color: COLORS.TEXT_MUTED, font: { family: "'DM Mono', 'Courier New', monospace", size: 10 } },
          beginAtZero: true,
        },
      },
    };

    if (!overrides) return base;

    /* merge superficial — para merge profundo, el panel debe hacerlo manualmente */
    return Object.assign({}, base, overrides);
  }

  /* -------------------------------------------------------------------------
     EXPORTS GLOBALES
  --------------------------------------------------------------------------- */
  global.AV_CHART_COLORS    = COLORS;
  global.AV_CHART_SEQUENCES = SEQUENCES;
  global.AV_CHART_DEFAULTS  = AV_CHART_DEFAULTS;

}(typeof window !== 'undefined' ? window : this));
