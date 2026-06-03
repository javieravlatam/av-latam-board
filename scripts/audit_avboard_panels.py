#!/usr/bin/env python3
import re
import sys
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "avboard_data.js"
REPORT = ROOT / "docs" / "AVBOARD_PANEL_AUDIT_REPORT.md"

PANELS = [
    "dashboard.html",
    "Dashboard_Comercial_AV_Latam_2026.html",
    "Executive_Board_View_AV_Latam_2026.html",
    "Executive_Intelligence_2026.html",
    "Panel_Chile_AV_2026.html",
    "Panel_Peru_AV_2026.html",
    "Panel_Presupuesto_AV_2026.html",
    "Panel_CxC_AV_Latam_2026.html",
    "Panel_IEC_Auditoria_2026.html",
    "Panel_Clientes_AV_2026.html",
    "Panel_Productos_AV_2026.html",
    "Panel_Rentabilidad_AV_2026.html",
    "Panel_Jefes_Index.html",
    "Panel_Jefes_Chile_2026.html",
    "Panel_Jefes_Peru_2026.html",
    "Panel_Jefes_Grupo_AV_2026.html",
]

REQUIRE_AVBOARD = [
    "dashboard.html",
    "Dashboard_Comercial_AV_Latam_2026.html",
    "Executive_Board_View_AV_Latam_2026.html",
    "Executive_Intelligence_2026.html",
    "Panel_Chile_AV_2026.html",
    "Panel_Peru_AV_2026.html",
    "Panel_Presupuesto_AV_2026.html",
    "Panel_CxC_AV_Latam_2026.html",
    "Panel_Jefes_Index.html",
    "Panel_Jefes_Chile_2026.html",
    "Panel_Jefes_Peru_2026.html",
    "Panel_Jefes_Grupo_AV_2026.html",
]

STALE = [
    "199.6M", "199,6", "270K", "480K", "134.7M", "134,7",
    "Semana 17", "Semana 18", "Semana 19",
    "325K", "325,104", "325.104", "325.1K", "334,136", "334136",
    "695,126", "695126"
]

ERRORS = [
    "NaN%", "NaN CLP", "undefined%", "caché desactualizado"
]

def read(path):
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return ""

def extract_root_values():
    txt = read(DATA)
    vals = {}

    def num(key, pattern):
        m = re.search(pattern, txt, re.S)
        if m:
            vals[key] = int(float(m.group(1).replace(",", "")))

    num("cl_ytd", r"chile_ventas\s*=\s*\{.*?ytd_5m\s*:\s*([0-9.]+)")
    num("pe_ytd", r"peru_ventas\s*=\s*\{.*?ytd_5m\s*:\s*([0-9.]+)")
    num("grupo_ytd", r"grupo\s*=\s*\{.*?ytd_usd\s*:\s*([0-9.]+)")

    m = re.search(r"semana\s*:\s*(\d+)", txt)
    if m:
        vals["semana"] = int(m.group(1))

    return vals

def line_no(text, needle):
    for i, line in enumerate(text.splitlines(), 1):
        if needle in line:
            return i
    return "-"

def audit_panel(panel, vals):
    path = ROOT / panel
    findings = []

    if not path.exists():
        findings.append(("HIGH", "Archivo no encontrado", "-", panel))
        return findings

    txt = read(path)

    if panel in REQUIRE_AVBOARD and "avboard_data.js" not in txt:
        findings.append(("HIGH", "No carga avboard_data.js", "-", "Agregar script avboard_data.js"))

    for s in STALE:
        if s in txt:
            findings.append(("HIGH", "Valor antiguo/hardcode detectado", line_no(txt, s), s))

    for e in ERRORS:
        if e in txt:
            findings.append(("CRITICAL", "Error visible o guard antiguo detectado", line_no(txt, e), e))

    # Detección simple de arrays operativos sospechosos
    suspicious_patterns = [
        "CH_REAL = [", "PE_REAL = [", "real2026 = [",
        "clReal26 = [", "peReal26 = [", "const datos = ["
    ]
    for p in suspicious_patterns:
        if p in txt:
            findings.append(("MEDIUM", "Array operativo potencialmente hardcodeado", line_no(txt, p), p))

    return findings

def main():
    vals = extract_root_values()
    print("=" * 60)
    print("AVBOARD PANEL AUDIT")
    print(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print("=" * 60)

    if not DATA.exists():
        print("CRITICAL: no existe avboard_data.js")
        return 1

    print("Fuente raíz:")
    print("Chile YTD:", vals.get("cl_ytd", "N/D"))
    print("Perú YTD:", vals.get("pe_ytd", "N/D"))
    print("Grupo YTD:", vals.get("grupo_ytd", "N/D"))
    print("Semana:", vals.get("semana", "N/D"))
    print("")

    all_results = {}
    failed = 0

    for panel in PANELS:
        findings = audit_panel(panel, vals)
        all_results[panel] = findings

        blocking = [f for f in findings if f[0] in ("CRITICAL", "HIGH")]
        if blocking:
            failed += 1
            print("FAIL:", panel)
            for sev, msg, ln, detail in findings:
                if sev in ("CRITICAL", "HIGH"):
                    print(" ", sev, "linea", ln, "-", msg, ":", detail)
        else:
            print("PASS:", panel)

    ROOT.joinpath("docs").mkdir(exist_ok=True)
    lines = []
    lines.append("# AVBOARD Panel Audit Report")
    lines.append("")
    lines.append(f"Generado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append("")
    lines.append("## Fuente raíz")
    lines.append("")
    lines.append(f"- Chile YTD: {vals.get('cl_ytd', 'N/D')}")
    lines.append(f"- Perú YTD: {vals.get('pe_ytd', 'N/D')}")
    lines.append(f"- Grupo YTD: {vals.get('grupo_ytd', 'N/D')}")
    lines.append(f"- Semana: {vals.get('semana', 'N/D')}")
    lines.append("")
    lines.append("## Resultado por panel")
    lines.append("")
    lines.append("| Panel | Estado | Hallazgos |")
    lines.append("|---|---|---|")

    for panel, findings in all_results.items():
        blocking = [f for f in findings if f[0] in ("CRITICAL", "HIGH")]
        state = "FAIL" if blocking else "PASS"
        detail = "<br>".join([f"{sev} L{ln}: {msg} ({d})" for sev, msg, ln, d in findings]) or "-"
        lines.append(f"| {panel} | {state} | {detail} |")

    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print("")
    print("Reporte:", REPORT)

    if failed:
        print("")
        print("AUDITORÍA FALLÓ:", failed, "panel(es) con errores bloqueantes.")
        return 1

    print("")
    print("AUDITORÍA PASS TOTAL")
    return 0

if __name__ == "__main__":
    sys.exit(main())
