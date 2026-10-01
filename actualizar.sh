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
# Mata cualquier proceso git colgado antes de limpiar los locks
pkill -f "git commit" 2>/dev/null || true
pkill -f "git push" 2>/dev/null || true
sleep 2
find .git -name "*.lock" -delete 2>/dev/null || true
rm -f .git/HEAD.lock .git/index.lock .git/refs/heads/main.lock 2>/dev/null || true

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

# ── 1. Espera de seguridad (60s) ──
# Permite que los archivos del inbox terminen de copiarse antes de procesar
echo "⏳ Esperando 60 segundos para que los archivos del inbox estén completos..."
sleep 60
echo ""

# ── 2. Pipeline principal ──
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
git --no-optional-locks add -A

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
