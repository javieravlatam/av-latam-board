#!/bin/bash
# ============================================================
#  AVBOARD — Actualización automática de datos
#  Uso: ./actualizar.sh
#  Coloca los archivos nuevos en /inbox antes de ejecutar.
# ============================================================

set -e
cd "$(dirname "$0")"

echo ""
echo "=================================================="
echo "  AVBOARD — Actualizando datos..."
echo "=================================================="
echo ""

# 1. Correr pipeline
echo "▶ Ejecutando pipeline..."
python3 scripts/update_avboard.py
echo ""

# 2. Ver qué cambió
echo "▶ Archivos modificados:"
git --no-optional-locks status --short
echo ""

# 3. Agregar todo al staging
git --no-optional-locks add \
  avboard_data.js \
  avboard_clientes.js \
  Panel_*.html \
  Panel_IEC_Auditoria_2026.html \
  logs/update_log.txt \
  logs/resumen_actualizacion.md \
  logs/alertas.md \
  scripts/ppto_libro_base.py

# Force-add cualquier xlsx nuevo en inbox
git --no-optional-locks add -f inbox/*.xlsx 2>/dev/null || true

# 4. Commit con fecha automática
FECHA=$(date '+%d/%m/%Y %H:%M')
git --no-optional-locks commit -m "data: actualización AVBOARD $FECHA [skip ci]" || {
  echo "ℹ️  Sin cambios nuevos para commitear."
  exit 0
}

# 5. Push
echo ""
echo "▶ Subiendo a GitHub..."
git --no-optional-locks push origin main

echo ""
echo "=================================================="
echo "  ✅ Dashboard actualizado correctamente"
echo "  ⏱  GitHub Pages se refresca en ~1 minuto"
echo "=================================================="
echo ""
