#!/bin/bash
# ============================================================
#  AVBOARD — Actualizar AV Board
#  Uso: doble clic en la app Automator, o ./actualizar.sh
#  Coloca los archivos nuevos en /inbox antes de ejecutar.
# ============================================================

# ── PATH explícito (necesario cuando se lanza desde GUI/Automator) ──
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# ── Ir al repo ──
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

# ── Limpiar locks de git (evita fallos silenciosos en commit) ──
rm -f .git/HEAD.lock .git/index.lock 2>/dev/null || true

echo ""
echo "=================================================="
echo "  AVBOARD — Actualizando datos..."
echo "  $(date '+%d/%m/%Y %H:%M')"
echo "=================================================="
echo ""

# ── Verificar dependencias ──
if ! command -v python3 &>/dev/null; then
  echo "❌ ERROR: python3 no encontrado. Instala Homebrew y Python."
  exit 1
fi
if ! command -v git &>/dev/null; then
  echo "❌ ERROR: git no encontrado."
  exit 1
fi

echo "🐍 Python: $(python3 --version)"
echo "📁 Repo:   $REPO_DIR"
echo ""

# ── 1. Pipeline principal ──
echo "▶ Ejecutando pipeline AVBOARD..."
python3 scripts/update_avboard.py
echo ""

# ── 2. Pipeline SIC Perú (sic_tx_pe.js) — si existe el script ──
if [ -f "scripts/build_master_dataset.py" ]; then
  echo "▶ Actualizando SIC Perú (sic_tx_pe.js)..."
  python3 scripts/build_master_dataset.py 2>/dev/null && echo "   → OK" || echo "   ⚠ Sin cambios en SIC PE"
  echo ""
fi

# ── 3. Archivos modificados ──
echo "▶ Archivos modificados:"
git --no-optional-locks status --short
echo ""

# ── 4. Staging ──
git --no-optional-locks add \
  avboard_data.js \
  avboard_clientes.js \
  Panel_*.html \
  apps/sic_av/sic_tx_pe.js \
  apps/sic_av/sic_tx_cl.js \
  apps/sic_av/js/sic_data_adapter.js \
  logs/update_log.txt \
  logs/resumen_actualizacion.md \
  logs/alertas.md \
  scripts/ppto_libro_base.py 2>/dev/null || true

# ── 5. Commit ──
FECHA=$(date '+%d/%m/%Y %H:%M')
git --no-optional-locks commit -m "data: actualización AVBOARD $FECHA" || \
  echo "ℹ️  Sin cambios nuevos para commitear — se hará push de commits pendientes."

# ── 6. Push (siempre — para subir commits locales aunque no haya uno nuevo) ──
echo ""
echo "▶ Subiendo a GitHub..."
git --no-optional-locks push origin main

echo ""
echo "=================================================="
echo "  ✅ Dashboard actualizado correctamente"
echo "  ⏱  GitHub Pages se refresca en ~1 minuto"
echo "=================================================="
echo ""
