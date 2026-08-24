#!/bin/bash
# ============================================================
#  Actualizar AV Board — doble clic para ejecutar
#  Detecta inbox, corre pipeline y hace push a GitHub
# ============================================================

# PATH explícito para que funcione desde Finder
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# Ir al repo (el .command está en la raíz del repo)
cd "$(dirname "$0")"

bash actualizar.sh

# Mantener Terminal abierto para leer el resultado
echo ""
read -p "Presiona ENTER para cerrar..." _
