#!/usr/bin/env python3
"""
version_avboard.py
==================
Módulo de versionado automático para el ecosistema AVBOARD.
 
Uso desde update_avboard.py:
    from scripts.version_avboard import create_version_snapshot
    snapshot = create_version_snapshot(avboard_vals, audit_passed)
 
Uso standalone:
    python3 scripts/version_avboard.py
"""
 
import json
import re
import shutil
import sys
import os
from datetime import datetime
from pathlib import Path
from typing import Optional
 
# ─────────────────────────────────────────────────────────────
# CONFIGURACIÓN DE RUTAS
# ─────────────────────────────────────────────────────────────
 
REPO_DIR = Path(__file__).parent.parent
 
# Fuentes
INBOX_BASE  = REPO_DIR / "inbox" / "nuevo libro base AV 2026.xlsx"
DATA_JS     = REPO_DIR / "avboard_data.js"
CLIENTES_JS = REPO_DIR / "avboard_clientes.js"
 
# Destinos versions/
VERSIONS_DIR      = REPO_DIR / "versions"
VERSIONS_BASE     = VERSIONS_DIR / "base"
VERSIONS_DATA     = VERSIONS_DIR / "data"
VERSIONS_LOGS     = VERSIONS_DIR / "logs"
MANIFEST_PATH     = VERSIONS_DIR / "manifest.json"
 
# Logs y docs a versionar
AUDIT_REPORT  = REPO_DIR / "docs" / "AVBOARD_PANEL_AUDIT_REPORT.md"
LOG_UPDATE    = REPO_DIR / "logs" / "update_log.txt"
LOG_RESUMEN   = REPO_DIR / "logs" / "resumen_actualizacion.md"
LOG_ALERTAS   = REPO_DIR / "logs" / "alertas.md"
 
 
# ─────────────────────────────────────────────────────────────
# EXTRACTOR DE VALORES RAÍZ (mismo patrón que audit_avboard_panels.py)
# ─────────────────────────────────────────────────────────────
 
def _extract_value(content: str, pattern: str, as_float=True):
    m = re.search(pattern, content, re.DOTALL)
    if not m:
        return None
    val = m.group(1).strip().strip('"').strip("'")
    if as_float:
        try:
            return float(val.replace(",", ""))
        except:
            return None
    return val
 
 
def _extract_object_block(content: str, obj_name: str) -> Optional[str]:
    """
    Extrae el contenido interno del objeto JS `obj_name = { ... }`,
    manejando correctamente llaves anidadas.
    Retorna el string interno (sin las llaves externas) o None si no se encuentra.
    """
    pattern = re.compile(r'\b' + re.escape(obj_name) + r'\s*=\s*\{', re.DOTALL)
    m = pattern.search(content)
    if not m:
        return None
 
    start = m.end()  # posición después del primer '{'
    depth = 1
    i = start
    while i < len(content) and depth > 0:
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
        i += 1
 
    return content[start:i - 1]  # contenido entre llaves externas
 
 
def _field_int(block: str, field: str) -> Optional[int]:
    """Extrae un campo numérico entero de un bloque JS."""
    m = re.search(r'\b' + re.escape(field) + r'\s*:\s*([\d.]+)', block)
    if m:
        try:
            return int(float(m.group(1)))
        except (ValueError, TypeError):
            return None
    return None
 
 
def _field_float(block: str, field: str) -> Optional[float]:
    """Extrae un campo numérico float de un bloque JS."""
    m = re.search(r'\b' + re.escape(field) + r'\s*:\s*([\d.]+)', block)
    if m:
        try:
            return float(m.group(1))
        except (ValueError, TypeError):
            return None
    return None
 
 
def _field_str(block: str, field: str) -> Optional[str]:
    """Extrae un campo string (entre comillas) de un bloque JS."""
    m = re.search(r'\b' + re.escape(field) + r'''\s*:\s*['"]([^'"]+)['"]''', block)
    return m.group(1) if m else None
 
 
def extract_avboard_kpis(js_path: Path) -> dict:
    """
    Extrae KPIs clave de avboard_data.js para el manifest.
 
    Estructura real del archivo:
      - meta = { cortes: { chile_ventas: 'DD/MM/YYYY', peru_ventas: 'DD/MM/YYYY' } }
      - var chile_ventas = { ytd_5m, ppto_5m, ppto_anual, cumplimiento_5m, ... }
      - var peru_ventas  = { ytd_5m, ppto_5m, ppto_anual, cumplimiento_5m, ... }
      - var grupo        = { ytd_usd, ... }
      - var chile_cxc    = { total, tramos: { t90, ... } }
      - var peru_cxc     = { total, tramos: { t90, ... } }
      - semana: no existe en avboard_data.js → null (no es error)
    """
    if not js_path.exists():
        return {}
 
    content = js_path.read_text(encoding="utf-8")
    kpis = {}
 
    # ── Cortes desde meta.cortes ──────────────────────────────
    # Estructura: meta = { cortes: { chile_ventas: 'fecha', peru_ventas: 'fecha' } }
    meta_block = _extract_object_block(content, "meta")
    if meta_block:
        cortes_block = _extract_object_block("var cortes=" + meta_block.split("cortes", 1)[-1]
                                             if "cortes" in meta_block else "", "cortes")
        if not cortes_block:
            # Fallback: buscar cortes: { ... } dentro del bloque meta
            m = re.search(r'cortes\s*:\s*\{([^}]+)\}', meta_block, re.DOTALL)
            cortes_block = m.group(1) if m else None
 
        if cortes_block:
            kpis["corte_chile"] = _field_str(cortes_block, "chile_ventas")
            kpis["corte_peru"]  = _field_str(cortes_block, "peru_ventas")
 
    # ── Chile ventas ─────────────────────────────────────────
    cl = _extract_object_block(content, "chile_ventas")
    if cl:
        kpis["chile_ytd_clp"]        = _field_int(cl, "ytd_5m")
        kpis["chile_ppto_5m_clp"]    = _field_int(cl, "ppto_5m")
        kpis["chile_ppto_anual_clp"] = _field_int(cl, "ppto_anual")
        v = _field_float(cl, "cumplimiento_5m")
        kpis["chile_cumpl_5m"] = round(v, 4) if v is not None else None
 
    # ── Perú ventas ──────────────────────────────────────────
    pe = _extract_object_block(content, "peru_ventas")
    if pe:
        kpis["peru_ytd_usd"]         = _field_int(pe, "ytd_5m")
        kpis["peru_ppto_5m_usd"]     = _field_int(pe, "ppto_5m")
        kpis["peru_ppto_anual_usd"]  = _field_int(pe, "ppto_anual")
        v = _field_float(pe, "cumplimiento_5m")
        kpis["peru_cumpl_5m"] = round(v, 4) if v is not None else None
 
    # ── Grupo ────────────────────────────────────────────────
    gr = _extract_object_block(content, "grupo")
    if gr:
        kpis["grupo_ytd_usd"] = _field_int(gr, "ytd_usd")
        # grupo_ppto_anual_usd: solo si existe explícitamente en avboard_data.js
        v = _field_int(gr, "ppto_anual")
        if v is not None:
            kpis["grupo_ppto_anual_usd"] = v
        else:
            kpis["grupo_ppto_anual_usd"] = None
            kpis["grupo_ppto_nota"] = "ppto_anual no existe en grupo — calcular externamente si se necesita"
 
    # ── CxC Chile — desde variable chile_cxc ─────────────────
    cl_cxc = _extract_object_block(content, "chile_cxc")
    if cl_cxc:
        kpis["cxc_chile_total"] = _field_int(cl_cxc, "total")
        # t90 dentro de tramos
        tramos_m = re.search(r'tramos\s*:\s*\{([^}]+)\}', cl_cxc, re.DOTALL)
        if tramos_m:
            kpis["cxc_chile_t90"] = _field_int(tramos_m.group(1), "t90")
        else:
            kpis["cxc_chile_t90"] = _field_int(cl_cxc, "t90")
 
    # ── CxC Perú — desde variable peru_cxc ───────────────────
    pe_cxc = _extract_object_block(content, "peru_cxc")
    if pe_cxc:
        kpis["cxc_peru_total"] = _field_int(pe_cxc, "total")
        tramos_m = re.search(r'tramos\s*:\s*\{([^}]+)\}', pe_cxc, re.DOTALL)
        if tramos_m:
            kpis["cxc_peru_t90"] = _field_int(tramos_m.group(1), "t90")
        else:
            kpis["cxc_peru_t90"] = _field_int(pe_cxc, "t90")
 
    # ── Semana ───────────────────────────────────────────────
    # No existe en avboard_data.js → null sin considerarlo error
    kpis["semana"] = None
 
    return kpis
 
    # Semana
    v = _extract_value(content, r"semana\s*:\s*(\d+)")
    if v: kpis["semana"] = int(v)
 
    # PE guard value
    v = _extract_value(content, r"peru_ytd_usd\s*:\s*(\d+)")
    if v: kpis["pe_ytd_usd_guard"] = int(v)
 
    return kpis
 
 
# ─────────────────────────────────────────────────────────────
# GESTIÓN DE CARPETAS
# ─────────────────────────────────────────────────────────────
 
def ensure_version_dirs():
    """Crea la estructura de carpetas de versions/ si no existe."""
    for d in [VERSIONS_DIR, VERSIONS_BASE, VERSIONS_DATA, VERSIONS_LOGS]:
        d.mkdir(parents=True, exist_ok=True)
 
 
# ─────────────────────────────────────────────────────────────
# COPIA DE ARCHIVOS
# ─────────────────────────────────────────────────────────────
 
def _safe_copy(src: Path, dst: Path) -> bool:
    """Copia src → dst. Retorna True si tuvo éxito."""
    if not src.exists():
        return False
    try:
        shutil.copy2(src, dst)
        return True
    except Exception as e:
        print(f"  ⚠️  No se pudo copiar {src.name}: {e}")
        return False
 
 
def snapshot_sources(ts: str) -> dict:
    """
    Copia fuentes y salidas a versions/.
    ts: timestamp string YYYY-MM-DD_HHMM
    Retorna dict con archivos copiados.
    """
    copied = {}
 
    # 1. Libro base Excel (inbox → versions/base/)
    dst_base = VERSIONS_BASE / f"libro_base_AV_2026_{ts}.xlsx"
    if _safe_copy(INBOX_BASE, dst_base):
        copied["libro_base"] = str(dst_base.relative_to(REPO_DIR))
 
    # 2. avboard_data.js → versions/data/
    dst_data = VERSIONS_DATA / f"avboard_data_{ts}.js"
    if _safe_copy(DATA_JS, dst_data):
        copied["avboard_data"] = str(dst_data.relative_to(REPO_DIR))
 
    # 3. avboard_clientes.js → versions/data/
    dst_clientes = VERSIONS_DATA / f"avboard_clientes_{ts}.js"
    if _safe_copy(CLIENTES_JS, dst_clientes):
        copied["avboard_clientes"] = str(dst_clientes.relative_to(REPO_DIR))
 
    # 4. Logs y auditoría → versions/logs/
    log_sources = [
        (AUDIT_REPORT, f"audit_report_{ts}.md"),
        (LOG_UPDATE,   f"update_log_{ts}.txt"),
        (LOG_RESUMEN,  f"resumen_{ts}.md"),
        (LOG_ALERTAS,  f"alertas_{ts}.md"),
    ]
    for src, dst_name in log_sources:
        dst = VERSIONS_LOGS / dst_name
        if _safe_copy(src, dst):
            copied[src.stem] = str(dst.relative_to(REPO_DIR))
 
    return copied
 
 
# ─────────────────────────────────────────────────────────────
# MANIFEST
# ─────────────────────────────────────────────────────────────
 
def load_manifest() -> list:
    """Carga manifest.json existente o retorna lista vacía."""
    if MANIFEST_PATH.exists():
        try:
            data = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
            return data if isinstance(data, list) else []
        except:
            return []
    return []
 
 
def save_manifest(entries: list):
    """Guarda manifest.json con formato legible."""
    MANIFEST_PATH.write_text(
        json.dumps(entries, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )
 
 
def build_manifest_entry(ts: str, kpis: dict, audit_passed: Optional[bool], copied: dict) -> dict:
    """Construye una entrada del manifest para esta versión."""
    now = datetime.now()
    entry = {
        "version":          ts,
        "timestamp":        now.isoformat(),
        "fecha_ejecucion":  now.strftime("%Y-%m-%d"),
        "hora_ejecucion":   now.strftime("%H:%M"),
        "auditoria":        "PASS" if audit_passed else ("FAIL" if audit_passed is False else "N/D"),
        "kpis": {
            # Chile
            "chile_ytd_clp":         kpis.get("chile_ytd_clp"),
            "chile_ppto_5m_clp":     kpis.get("chile_ppto_5m_clp"),
            "chile_ppto_anual_clp":  kpis.get("chile_ppto_anual_clp"),
            "chile_cumpl_5m":        kpis.get("chile_cumpl_5m"),
            "corte_chile":           kpis.get("corte_chile"),
            # Perú
            "peru_ytd_usd":          kpis.get("peru_ytd_usd"),
            "peru_ppto_5m_usd":      kpis.get("peru_ppto_5m_usd"),
            "peru_ppto_anual_usd":   kpis.get("peru_ppto_anual_usd"),
            "peru_cumpl_5m":         kpis.get("peru_cumpl_5m"),
            "corte_peru":            kpis.get("corte_peru"),
            # Grupo
            "grupo_ytd_usd":         kpis.get("grupo_ytd_usd"),
            "grupo_ppto_anual_usd":  kpis.get("grupo_ppto_anual_usd"),
            # CxC Chile
            "cxc_chile_total":       kpis.get("cxc_chile_total"),
            "cxc_chile_t90":         kpis.get("cxc_chile_t90"),
            # CxC Perú
            "cxc_peru_total":        kpis.get("cxc_peru_total"),
            "cxc_peru_t90":          kpis.get("cxc_peru_t90"),
            # Grupo notas
            "grupo_ppto_nota":       kpis.get("grupo_ppto_nota"),
            # Semana (no existe en avboard_data.js)
            "semana":                None,
        },
        "archivos_copiados": copied,
    }
    return entry
 
 
# ─────────────────────────────────────────────────────────────
# FUNCIÓN PRINCIPAL (llamada desde update_avboard.py)
# ─────────────────────────────────────────────────────────────
 
def create_version_snapshot(kpis: dict = None, audit_passed: bool = None) -> dict:
    """
    Crea snapshot completo: carpetas, copia archivos, actualiza manifest.
 
    Parámetros:
        kpis         dict de KPIs (si None, los extrae de avboard_data.js)
        audit_passed bool o None si la auditoría no se ejecutó
 
    Retorna:
        dict con entrada del manifest generada
    """
    now = datetime.now()
    ts = now.strftime("%Y-%m-%d_%H%M")
 
    print(f"\n📦 Versionado AVBOARD — {ts}")
 
    # Asegurar carpetas
    ensure_version_dirs()
 
    # Extraer KPIs si no se pasaron
    if kpis is None:
        kpis = extract_avboard_kpis(DATA_JS)
 
    # Copiar archivos
    copied = snapshot_sources(ts)
 
    print(f"   Archivos copiados: {len(copied)}")
    for key, path in copied.items():
        print(f"   ✅ {path}")
 
    # Construir y guardar entrada manifest
    entry = build_manifest_entry(ts, kpis, audit_passed, copied)
 
    manifest = load_manifest()
    manifest.append(entry)
    # Mantener solo las últimas 50 versiones para no crecer indefinidamente
    if len(manifest) > 50:
        manifest = manifest[-50:]
    save_manifest(manifest)
 
    print(f"   📄 Manifest actualizado: versions/manifest.json ({len(manifest)} versiones)")
    print(f"   Auditoría: {entry['auditoria']}")
    if kpis.get("chile_ytd_clp"):
        cl = kpis["chile_ytd_clp"]
        print(f"   Chile YTD: CLP {cl:,.0f}")
    if kpis.get("peru_ytd_usd"):
        pe = kpis["peru_ytd_usd"]
        print(f"   Perú YTD:  USD {pe:,.0f}")
    if kpis.get("grupo_ytd_usd"):
        gr = kpis["grupo_ytd_usd"]
        print(f"   Grupo YTD: USD {gr:,.0f}")
 
    return entry
 
 
# ─────────────────────────────────────────────────────────────
# EJECUCIÓN STANDALONE
# ─────────────────────────────────────────────────────────────
 
if __name__ == "__main__":
    print("=" * 55)
    print("  AVBOARD — Versionado standalone")
    print("=" * 55)
    entry = create_version_snapshot()
    print("\nEntrada generada en manifest:")
    print(json.dumps(entry, indent=2, ensure_ascii=False))
    print("\n✅ Versionado completado")
 


