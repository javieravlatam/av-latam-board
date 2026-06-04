#!/usr/bin/env python3
"""
ppto_libro_base.py
==================
Módulo único de presupuesto AVBOARD — Chile y Perú.

Fuente principal : inbox/nuevo libro base AV 2026.xlsx → hoja "Presupuesto Pais"
Fallback         : constantes LEGACY (históricas hasta jun 2026)

Estructura real de la hoja:
  Fila 0  : "PRESUPUESTO 2026 — CHILE (CLP)"
  Fila 1  : RTC | ENE | FEB | ... | DIC | TOTAL
  Filas 2-8 : RTCs Chile
  Fila 9  : TOTAL Chile
  Fila 12 : "PRESUPUESTO 2026 — PERÚ (USD)"
  Fila 13 : RTC | ENE | FEB | ... | DIC | TOTAL
  Filas 14-20: RTCs Perú
  Fila 21 : TOTAL Perú

Compatible: Python 3.9.6+
"""

from pathlib import Path
from typing import Dict, List, Optional

# ─────────────────────────────────────────────────────────────
# LEGACY CHILE (CLP)
# "Presupuesto histórico utilizado hasta junio 2026"
# ─────────────────────────────────────────────────────────────

PPTO_MENSUAL_CL_LEGACY: List[float] = [
     83_558_032,   # Ene
     41_601_950,   # Feb
     42_000_000,   # Mar
     46_431_368,   # Abr
     51_000_000,   # May
     49_730_000,   # Jun
     62_800_000,   # Jul
     76_500_000,   # Ago
    110_800_000,   # Sep
    112_700_000,   # Oct
     97_500_000,   # Nov
     86_700_000,   # Dic
]
PPTO_ANUAL_CL_LEGACY: float = sum(PPTO_MENSUAL_CL_LEGACY)   # 861,321,350

# ─────────────────────────────────────────────────────────────
# LEGACY PERÚ (USD)
# "Presupuesto histórico utilizado hasta junio 2026"
# ─────────────────────────────────────────────────────────────

PPTO_MENSUAL_PE_LEGACY: List[float] = [
     51_674,   # Ene
     58_489,   # Feb
    103_222,   # Mar
     71_299,   # Abr
     61_946,   # May
     78_710,   # Jun
    100_675,   # Jul
    178_180,   # Ago
    125_564,   # Sep
    165_842,   # Oct
     98_481,   # Nov
     42_952,   # Dic
]
PPTO_ANUAL_PE_LEGACY: float = sum(PPTO_MENSUAL_PE_LEGACY)   # 1,137,034

# ─────────────────────────────────────────────────────────────
# VALORES ESPERADOS DESDE LIBRO_BASE (para validación)
# ─────────────────────────────────────────────────────────────

EXPECTED_CL_ANUAL:  float = 792_640_368.0
EXPECTED_CL_PPTO5M: float = 246_979_768.0
EXPECTED_PE_ANUAL:  float = 1_380_014.8
EXPECTED_PE_PPTO5M: float = 358_399.2

# ─────────────────────────────────────────────────────────────
# CONFIGURACIÓN
# ─────────────────────────────────────────────────────────────

REPO_DIR    = Path(__file__).parent.parent
INBOX_EXCEL = REPO_DIR / "inbox" / "nuevo libro base AV 2026.xlsx"
SHEET_NAME  = "Presupuesto Pais"

MONTH_VARIANTS: List[List[str]] = [
    ["ene", "jan", "enero",      "january"],
    ["feb",        "febrero",    "february"],
    ["mar",        "marzo",      "march"],
    ["abr", "apr", "abril",      "april"],
    ["may",        "mayo"],
    ["jun",        "junio",      "june"],
    ["jul",        "julio",      "july"],
    ["ago", "aug", "agosto",     "august"],
    ["sep",        "septiembre", "september"],
    ["oct",        "octubre",    "october"],
    ["nov",        "noviembre",  "november"],
    ["dic", "dec", "diciembre",  "december"],
]


# ─────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────

def _norm(value) -> str:
    if value is None:
        return ""
    t = str(value).strip().lower()
    for a, b in [("á","a"),("é","e"),("í","i"),("ó","o"),("ú","u"),("ü","u")]:
        t = t.replace(a, b)
    return t


def _safe_float(value) -> Optional[float]:
    if value is None:
        return None
    try:
        f = float(value)
        return f if f > 0 else None
    except (ValueError, TypeError):
        return None


def _match_month(header_norm: str) -> Optional[int]:
    for idx, variants in enumerate(MONTH_VARIANTS):
        if any(header_norm == v or header_norm.startswith(v) for v in variants):
            return idx
    return None


def _build_result(mensual: List[float], source: str,
                  warning: Optional[str]) -> dict:
    return {
        "mensual": mensual,
        "ppto_4m": round(sum(mensual[:4]), 2),
        "ppto_5m": round(sum(mensual[:5]), 2),
        "anual":   round(sum(mensual),     2),
        "source":  source,
        "warning": warning,
    }


# ─────────────────────────────────────────────────────────────
# PARSER EXCEL
# ─────────────────────────────────────────────────────────────

def _find_sheet(wb) -> Optional[str]:
    target_norm = _norm(SHEET_NAME)
    for name in wb.sheetnames:
        if _norm(name) == target_norm:
            return name
    for name in wb.sheetnames:
        if "presupuesto" in _norm(name) and "pais" in _norm(name):
            return name
    return None


def _parse_month_headers(row: tuple) -> Dict[int, int]:
    month_map: Dict[int, int] = {}
    for j, cell in enumerate(row):
        n = _norm(cell)
        if n in ("total", "anual", "suma"):
            continue
        m = _match_month(n)
        if m is not None and m not in month_map:
            month_map[m] = j
    return month_map


def _read_total_row(rows: List[tuple], start_idx: int,
                    month_map: Dict[int, int]) -> Optional[List[float]]:
    for row in rows[start_idx:]:
        if not any(c is not None for c in row):
            continue
        is_total = False
        for k in range(min(3, len(row))):
            if "total" in _norm(row[k]):
                is_total = True
                break
        if not is_total:
            continue
        mensual = [0.0] * 12
        has_values = False
        for month_idx, col_idx in month_map.items():
            if col_idx < len(row):
                v = _safe_float(row[col_idx])
                if v is not None:
                    mensual[month_idx] = v
                    has_values = True
        if has_values:
            return mensual
    return None


def _load_presupuesto() -> Optional[Dict[str, List[float]]]:
    try:
        import openpyxl
    except ImportError:
        return None

    if not INBOX_EXCEL.exists():
        return None

    try:
        wb = openpyxl.load_workbook(str(INBOX_EXCEL), data_only=True, read_only=True)
    except Exception:
        return None

    sheet_name = _find_sheet(wb)
    if sheet_name is None:
        wb.close()
        return None

    try:
        rows = list(wb[sheet_name].iter_rows(values_only=True))
    except Exception:
        wb.close()
        return None

    wb.close()

    if len(rows) < 10:
        return None

    result: Dict[str, List[float]] = {}

    # ── Chile ─────────────────────────────────────────────────
    cl_header_row = None
    cl_month_map: Dict[int, int] = {}

    for i, row in enumerate(rows):
        row_text = " ".join(_norm(c) for c in row if c is not None)
        if "chile" in row_text and "presupuesto" in row_text:
            if i + 1 < len(rows):
                cl_month_map = _parse_month_headers(rows[i + 1])
                if len(cl_month_map) >= 6:
                    cl_header_row = i + 1
            break

    if cl_header_row is not None and cl_month_map:
        cl_total = _read_total_row(rows, cl_header_row + 1, cl_month_map)
        if cl_total:
            result["chile"] = cl_total

    # ── Perú ──────────────────────────────────────────────────
    pe_header_row = None
    pe_month_map: Dict[int, int] = {}

    for i, row in enumerate(rows):
        row_text = " ".join(_norm(c) for c in row if c is not None)
        if ("peru" in row_text or "per" in row_text) and "presupuesto" in row_text:
            if i + 1 < len(rows):
                pe_month_map = _parse_month_headers(rows[i + 1])
                if len(pe_month_map) >= 6:
                    pe_header_row = i + 1
            break

    if pe_header_row is not None and pe_month_map:
        pe_total = _read_total_row(rows, pe_header_row + 1, pe_month_map)
        if pe_total:
            result["peru"] = pe_total

    return result if result else None


# ─────────────────────────────────────────────────────────────
# FUNCIÓN PRINCIPAL
# ─────────────────────────────────────────────────────────────

def get_ppto_all() -> Dict[str, dict]:
    """
    Retorna presupuesto de Chile y Perú.
    Fallback independiente por país: LIBRO_BASE → LEGACY.

    Retorna:
    {
        "chile": { mensual, ppto_4m, ppto_5m, anual, source, warning },
        "peru":  { mensual, ppto_4m, ppto_5m, anual, source, warning },
    }
    """
    libro = _load_presupuesto()
    resultados: Dict[str, dict] = {}

    cl_data = libro.get("chile") if libro else None
    if cl_data and sum(cl_data) > 0:
        resultados["chile"] = _build_result(cl_data, "LIBRO_BASE", None)
    else:
        msg = (
            f"⚠️  PPTO CHILE: no se pudo leer desde hoja '{SHEET_NAME}'. "
            f"Usando LEGACY: anual={PPTO_ANUAL_CL_LEGACY:,.0f} CLP"
        )
        print(msg)
        resultados["chile"] = _build_result(
            list(PPTO_MENSUAL_CL_LEGACY), "LEGACY", msg
        )

    pe_data = libro.get("peru") if libro else None
    if pe_data and sum(pe_data) > 0:
        resultados["peru"] = _build_result(pe_data, "LIBRO_BASE", None)
    else:
        msg = (
            f"⚠️  PPTO PERÚ: no se pudo leer desde hoja '{SHEET_NAME}'. "
            f"Usando LEGACY: anual={PPTO_ANUAL_PE_LEGACY:,.0f} USD"
        )
        print(msg)
        resultados["peru"] = _build_result(
            list(PPTO_MENSUAL_PE_LEGACY), "LEGACY", msg
        )

    return resultados


# ─────────────────────────────────────────────────────────────
# VALIDACIÓN
# ─────────────────────────────────────────────────────────────

def validar_resultado(ppto: Dict[str, dict]) -> bool:
    TOL = 1.0
    checks = [
        ("Chile anual",   ppto["chile"]["anual"],  EXPECTED_CL_ANUAL),
        ("Chile ppto_5m", ppto["chile"]["ppto_5m"], EXPECTED_CL_PPTO5M),
        ("Peru anual",    ppto["peru"]["anual"],   EXPECTED_PE_ANUAL),
        ("Peru ppto_5m",  ppto["peru"]["ppto_5m"],  EXPECTED_PE_PPTO5M),
    ]
    all_pass = True
    for label, got, expected in checks:
        ok = abs(got - expected) <= TOL
        status = "✅" if ok else "❌"
        if not ok:
            all_pass = False
        print(f"  {status} {label:<18} esperado={expected:>16,.1f}  obtenido={got:>16,.1f}")
    return all_pass


# ─────────────────────────────────────────────────────────────
# TEST STANDALONE
# ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    MESES = ["Ene","Feb","Mar","Abr","May","Jun",
             "Jul","Ago","Sep","Oct","Nov","Dic"]

    print("=" * 65)
    print("  AVBOARD — Módulo presupuesto por país")
    print("=" * 65)
    print()

    ppto = get_ppto_all()

    for pais, moneda in [("chile", "CLP"), ("peru", "USD")]:
        p = ppto[pais]
        print(f"{'─'*45}")
        print(f"  {pais.upper()} [{p['source']}] — {moneda}")
        print(f"{'─'*45}")
        print(f"  Anual    : {moneda} {p['anual']:>18,.1f}")
        print(f"  Ppto 5m  : {moneda} {p['ppto_5m']:>18,.1f}")
        print(f"  Ppto 4m  : {moneda} {p['ppto_4m']:>18,.1f}")
        print()
        for i, (mes, val) in enumerate(zip(MESES, p["mensual"])):
            marca = " ◄ 5m" if i == 4 else ""
            print(f"    {mes}  {val:>18,.1f}{marca}")
        if p["warning"]:
            print(f"\n  {p['warning']}")
        print()

    print("─" * 45)
    print("  VALIDACIÓN vs valores esperados del Libro Base")
    print("─" * 45)
    ok = validar_resultado(ppto)
    print()
    if ok:
        print("  ✅ PASS TOTAL — valores coinciden con Libro Base real")
    else:
        print("  ❌ FAIL — revisar parser o estructura de la hoja")

    print()
    print("Constantes LEGACY:")
    print(f"  CL anual = {PPTO_ANUAL_CL_LEGACY:>18,.0f} CLP")
    print(f"  PE anual = {PPTO_ANUAL_PE_LEGACY:>18,.0f} USD")
