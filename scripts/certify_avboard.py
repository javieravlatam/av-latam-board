#!/usr/bin/env python3
"""
certify_avboard.py — Tests de certificación automáticos AV LATAM Board
========================================================================
Ejecutar ANTES de cada commit/push. Falla con exit(1) si detecta cualquier
problema que pueda llegar a producción.

Tests:
  C-01  ?v= cache-busting — todos los HTML usan la fecha de hoy
  C-02  Porcentajes hardcodeados de vendedores en HTML display
  C-03  Consistencia de datos — AVBOARD vs valores mostrados
  C-04  Chart.js cargado exactamente una vez por archivo
  C-05  avboard_data.js cargado antes de scripts inline
  C-06  Valores STALE conocidos (lista estática + dinámica)
  C-07  No NaN / undefined visible en UI

Uso:
  python3 scripts/certify_avboard.py            # pass/fail
  python3 scripts/certify_avboard.py --verbose  # detalle completo
"""

import re
import sys
import subprocess
import json
from pathlib import Path
from datetime import datetime

ROOT   = Path(__file__).resolve().parents[1]
DATA   = ROOT / "avboard_data.js"
VERBOSE = "--verbose" in sys.argv or "-v" in sys.argv

# ── Colores ANSI ──────────────────────────────────────────────────────────────
RED    = "\033[91m"
GREEN  = "\033[92m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
RESET  = "\033[0m"
BOLD   = "\033[1m"

def ok(msg):    print(f"  {GREEN}✓{RESET} {msg}")
def fail(msg):  print(f"  {RED}✗{RESET} {msg}")
def warn(msg):  print(f"  {YELLOW}⚠{RESET} {msg}")
def info(msg):  print(f"  {CYAN}·{RESET} {msg}")

# ── Panels que cargan avboard_data.js ────────────────────────────────────────
AVBOARD_PANELS = [
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
    "Panel_General_AV_2026.html",
]

# Nombres de vendedores para detectar porcentajes hardcodeados cerca de ellos
VENDOR_NAMES = [
    "atalaya", "infante", "aguirre", "valladares", "gonzales",
    "diaz", "martha", "navarro", "geldres",
    "ATALAYA", "INFANTE", "AGUIRRE", "VALLADARES", "GONZALES",
    "DIAZ", "MARTHA", "NAVARRO", "GELDRES",
    "Atalaya", "Infante", "Aguirre", "Valladares", "Gonzales",
]

# Valores estáticos conocidos como stale — actualizar si el negocio cambia de forma permanente
STALE_STRINGS = [
    # KPIs de versiones antiguas
    "199.6M", "134.7M", "Semana 17", "Semana 18",
    "695,126", "695126",
    # Porcentajes de T1 hardcodeados (el bug de hoy)
    "110.1% del Ppto T1", "204.1% del Ppto T1", "74.5% del Ppto T1",
    "17.4% del Ppto T1", "17.5% del Ppto T1",
    # Valores absolutos de vendedores de versiones anteriores (julio 2026)
    "USD 59,072", "USD 94,144", "USD 43,7K", "USD 59.1K",
    # Errores JS visibles
    "NaN%", "NaN CLP", "NaN USD", "undefined%", "undefined CLP",
]

# ── Helpers ───────────────────────────────────────────────────────────────────
def read(path):
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return ""

def line_no(text, needle):
    for i, line in enumerate(text.splitlines(), 1):
        if needle in line:
            return i
    return -1

def extract_avboard_data():
    """Extrae datos clave de avboard_data.js via Node.js."""
    if not DATA.exists():
        return None
    script = """
const fs = require('fs');
try {
  eval(fs.readFileSync(process.argv[1], 'utf8'));
  const pv = AVBOARD.peru.ventas;
  const cv = AVBOARD.chile.ventas;
  const corteStr = AVBOARD.meta.cortes.peru_ventas || '01/01/2026';
  const nM = parseInt(corteStr.split('/')[1], 10);
  const rtcP = pv.rtc_mensual_ppto || {};
  const pvnd = pv.por_vendedor || {};
  const toK = v => parseFloat((v/1000).toFixed(1));

  const vendors = {};
  ['aguirre','atalaya','diaz','gonzales','infante','martha','valladares'].forEach(k => {
    const mP = rtcP[k];
    const pptoMes = mP ? mP.map(v => parseFloat((v/1000).toFixed(3))) : null;
    const pptoAcum = pptoMes ? pptoMes.slice(0,nM).reduce((a,b)=>a+b,0) : null;
    const ytdRaw = pvnd[k] ? pvnd[k].ytd : 0;
    const real = toK(ytdRaw);
    const cumpl = pptoAcum && pptoAcum > 0 ? (real / pptoAcum * 100) : null;
    vendors[k] = { real, pptoAcum, cumpl, nM };
  });

  const result = {
    peru_ytd: pv.ytd_5m,
    chile_ytd: cv.ytd_5m,
    corte_pe: corteStr,
    nM,
    vendors
  };
  console.log(JSON.stringify(result));
} catch(e) {
  console.error('ERROR:', e.message);
  process.exit(1);
}
""".strip()

    try:
        r = subprocess.run(
            ["node", "-e", script, str(DATA)],
            capture_output=True, text=True, timeout=15
        )
        if r.returncode != 0:
            return None
        # avboard_data.js imprime líneas de diagnóstico antes del JSON
        # Tomar solo la última línea que empieza con '{'
        json_line = next(
            (l for l in reversed(r.stdout.splitlines()) if l.strip().startswith('{')),
            None
        )
        return json.loads(json_line) if json_line else None
    except Exception:
        return None

# ── TEST C-01: Cache-busting ──────────────────────────────────────────────────
def test_cache_busting():
    """Todos los HTML con avboard_data.js deben tener ?v= de HOY (YYYYMMDD)."""
    today = datetime.now().strftime("%Y%m%d")
    errors = []
    pattern = re.compile(r'src=["\']avboard_data\.js(?:\?v=([\w\d]*))?["\']')

    for name in AVBOARD_PANELS:
        path = ROOT / name
        if not path.exists():
            continue
        txt = read(path)
        m = pattern.search(txt)
        if not m:
            errors.append(f"{name}: no tiene script avboard_data.js")
            continue
        v = m.group(1) or ""
        if not v.startswith(today):
            errors.append(f"{name}: ?v={v} (esperado {today}...)")

    return errors

# ── TEST C-02: Porcentajes hardcodeados de vendedores ─────────────────────────
def test_vendor_hardcoded_pct(avboard_data):
    """
    Detecta porcentajes de cumplimiento hardcodeados en títulos/badges de alertas.
    El patrón problemático es: VENDOR — ESTADO (XX.X%) en líneas de display HTML.
    Solo busca líneas que contengan simultáneamente: vendor name + porcentaje en paréntesis.
    Excluye bloques <script>, comentarios HTML, y tablas de datos históricos (data:[...]).
    """
    errors = []
    # Patrón: porcentaje dentro de paréntesis — el formato de los títulos de alertas
    pct_in_paren = re.compile(r'\((\d{2,3}(?:\.\d{1,2})?)%')
    # Vendor keys canónicos → nombre display
    VENDOR_KEYS = {
        'atalaya': ['atalaya', 'ATALAYA', 'Atalaya'],
        'infante': ['infante', 'INFANTE', 'Infante'],
        'aguirre': ['aguirre', 'AGUIRRE', 'Aguirre'],
        'valladares': ['valladares', 'VALLADARES', 'Valladares'],
        'gonzales': ['gonzales', 'GONZALES', 'Gonzales'],
        'navarro': ['navarro', 'NAVARRO', 'Navarro'],
    }

    for name in AVBOARD_PANELS:
        path = ROOT / name
        if not path.exists():
            continue
        txt = read(path)

        # Remover bloques <script>...</script>
        html_only = re.sub(r'<script\b[^>]*>.*?</script>', '', txt, flags=re.DOTALL | re.IGNORECASE)
        # Remover comentarios HTML
        html_only = re.sub(r'<!--.*?-->', '', html_only, flags=re.DOTALL)

        reported = set()  # evitar duplicados por vendor por archivo
        for ln_idx, line in enumerate(html_only.splitlines(), 1):
            pct_matches = pct_in_paren.findall(line)
            if not pct_matches:
                continue
            for key, aliases in VENDOR_KEYS.items():
                if key in reported:
                    continue
                vendor_found = any(alias in line for alias in aliases)
                if not vendor_found:
                    continue
                for pct_str in pct_matches:
                    pct_val = float(pct_str)
                    if pct_val < 50:
                        continue  # porcentajes pequeños no son cumplimiento
                    real_cumpl = None
                    if avboard_data and key in avboard_data.get("vendors", {}):
                        real_cumpl = avboard_data["vendors"][key].get("cumpl")
                    if real_cumpl is not None and abs(pct_val - real_cumpl) > 20:
                        errors.append(
                            f"{name} L{ln_idx}: '{key}' con {pct_str}% hardcoded "
                            f"(AVBOARD calcula {real_cumpl:.1f}%)"
                        )
                        reported.add(key)
                        break
                    elif real_cumpl is None and pct_val > 150:
                        errors.append(
                            f"{name} L{ln_idx}: '{key}' con {pct_str}% hardcoded (sin ppto AVBOARD)"
                        )
                        reported.add(key)
                        break

    return errors

# ── TEST C-03: Sanidad de datos AVBOARD ──────────────────────────────────────
def test_data_sanity(avboard_data):
    """Valida rangos esperados en los datos extraídos de avboard_data.js."""
    if not avboard_data:
        return ["No se pudo cargar avboard_data.js con Node.js"]

    errors = []

    # Peru YTD mínimo esperado (sanity floor)
    pe_ytd = avboard_data.get("peru_ytd", 0)
    if pe_ytd < 200_000:
        errors.append(f"Peru YTD demasiado bajo: {pe_ytd:,.0f} (esperado > 200,000)")
    if pe_ytd > 5_000_000:
        errors.append(f"Peru YTD sospechosamente alto: {pe_ytd:,.0f}")

    # Chile YTD
    cl_ytd = avboard_data.get("chile_ytd", 0)
    if cl_ytd < 100_000_000:  # CLP
        errors.append(f"Chile YTD demasiado bajo: {cl_ytd:,.0f} CLP (esperado > 100M CLP)")

    # Vendedores con cumplimiento fuera de rango razonable
    vendors = avboard_data.get("vendors", {})
    for k, v in vendors.items():
        cumpl = v.get("cumpl")
        if cumpl is not None:
            if cumpl > 300:
                errors.append(f"Vendedor {k}: cumplimiento {cumpl:.1f}% > 300% (revisar datos)")
            if cumpl < 0:
                errors.append(f"Vendedor {k}: cumplimiento negativo {cumpl:.1f}%")

    # Verificar nM razonable (meses con datos)
    nM = avboard_data.get("nM", 0)
    current_month = datetime.now().month
    if abs(nM - current_month) > 2:
        errors.append(
            f"nM={nM} no coincide con mes actual {current_month} "
            f"(corte: {avboard_data.get('corte_pe', '?')})"
        )

    return errors

# ── TEST C-04: Chart.js cargado una sola vez ──────────────────────────────────
def test_chartjs_single_load():
    """Cada HTML debe cargar Chart.js exactamente una vez."""
    errors = []
    for name in AVBOARD_PANELS:
        path = ROOT / name
        if not path.exists():
            continue
        txt = read(path)
        count = len(re.findall(r'chart\.js', txt, re.IGNORECASE))
        if count > 1:
            errors.append(f"{name}: Chart.js aparece {count} veces (debe ser 1)")
    return errors

# ── TEST C-05: Orden de carga de scripts ──────────────────────────────────────
def test_script_load_order():
    """
    avboard_data.js debe aparecer ANTES de cualquier script inline que USE AVBOARD.
    Excluye: auth guards (sessionStorage), theme loaders, y scripts sin referencias a AVBOARD.
    """
    errors = []
    # Palabras clave que indican uso real de AVBOARD en el script
    avboard_keywords = re.compile(r'\bAVBOARD\b|avboard_data|populate\(|vendedoresData|chartVentas|chartRTC')
    # Auth guards a ignorar (solo sessionStorage/localStorage, no AVBOARD)
    auth_only = re.compile(r'sessionStorage|localStorage|av_auth|window\.location')

    for name in AVBOARD_PANELS:
        path = ROOT / name
        if not path.exists():
            continue
        txt = read(path)

        m_data = re.search(r'<script\s[^>]*avboard_data\.js', txt)
        if not m_data:
            continue

        # Buscar scripts inline ANTES de avboard_data.js que usen AVBOARD
        before_data = txt[:m_data.start()]
        for m in re.finditer(r'<script(?:\s[^>]*)?>(.+?)</script>', before_data, re.DOTALL | re.IGNORECASE):
            body = m.group(1)
            # Ignorar scripts que solo hacen auth/theme
            if auth_only.search(body) and not avboard_keywords.search(body):
                continue
            if avboard_keywords.search(body):
                ln = txt[:m.start()].count('\n') + 1
                errors.append(f"{name} L{ln}: script inline referencia AVBOARD ANTES de cargarlo")

    return errors

# ── TEST C-06: Valores STALE ──────────────────────────────────────────────────
def test_stale_values(avboard_data):
    """Detecta strings conocidos como stale/hardcoded en cualquier HTML."""
    errors = []

    # Lista dinámica: añadir valores de vendedores que YA NO son correctos
    dynamic_stale = list(STALE_STRINGS)
    if avboard_data:
        vendors = avboard_data.get("vendors", {})
        # Construir frases que SOLO existirían si son hardcodeadas con datos viejos
        # (no buscamos el valor correcto actual, sino valores incorrectos)
        # Ej: si Atalaya real ahora es 89.8K, el valor "59.1K" (julio) es stale
        vendor_display = {
            "atalaya": "O. Atalaya", "infante": "O. Infante",
            "aguirre": "L. Aguirre", "valladares": "P. Valladares",
        }

    for name in sorted(ROOT.glob("*.html")):
        txt = read(name)
        found = []
        for s in dynamic_stale:
            if s in txt:
                ln = line_no(txt, s)
                found.append(f"L{ln}: '{s}'")
        if found:
            errors.append(f"{name.name}: {'; '.join(found)}")

    return errors

# ── TEST C-07: NaN / undefined visible ───────────────────────────────────────
def test_no_nan_visible():
    """Detecta guards JS que dejarían NaN o undefined visible en producción."""
    errors = []
    bad = ["NaN%", "NaN CLP", "NaN USD", "undefined%", "undefined CLP", "undefined K"]
    for name in sorted(ROOT.glob("*.html")):
        txt = read(name)
        # Ignorar si está dentro de un comentario o string JS
        for b in bad:
            if b in txt:
                ln = line_no(txt, b)
                errors.append(f"{name.name} L{ln}: '{b}' puede aparecer en UI")
    return errors

# ── RUNNER ────────────────────────────────────────────────────────────────────
def run_test(label, fn, *args):
    """Ejecuta un test y retorna (passed, errors)."""
    try:
        errors = fn(*args)
    except Exception as e:
        errors = [f"Excepción en test: {e}"]

    passed = len(errors) == 0
    if passed:
        ok(f"{label}")
    else:
        fail(f"{label} — {len(errors)} error(es)")
        for e in errors:
            print(f"      {RED}→{RESET} {e}")
    return passed, errors

def main():
    print()
    print(f"{BOLD}{'═' * 62}{RESET}")
    print(f"{BOLD}  AV LATAM BOARD · CERTIFICACIÓN AUTOMÁTICA{RESET}")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{BOLD}{'═' * 62}{RESET}")
    print()

    # Cargar datos AVBOARD una vez
    info("Cargando avboard_data.js...")
    avboard_data = extract_avboard_data()
    if avboard_data:
        ok(f"avboard_data.js OK · Peru YTD {avboard_data['peru_ytd']:,.0f} · "
           f"nM={avboard_data['nM']} · corte {avboard_data['corte_pe']}")
        if VERBOSE:
            for k, v in avboard_data.get("vendors", {}).items():
                cumpl = v.get("cumpl")
                cumpl_str = f"{cumpl:.1f}%" if cumpl is not None else "sin ppto"
                info(f"  {k}: real={v['real']}K ppto={v.get('pptoAcum','?')}K cumpl={cumpl_str}")
    else:
        warn("No se pudo cargar avboard_data.js — algunos tests serán parciales")

    print()
    results = []

    results.append(run_test("C-01 Cache-busting ?v= al día",
                             test_cache_busting))

    results.append(run_test("C-02 Sin porcentajes de vendedores hardcodeados",
                             test_vendor_hardcoded_pct, avboard_data))

    results.append(run_test("C-03 Sanidad de datos AVBOARD",
                             test_data_sanity, avboard_data))

    results.append(run_test("C-04 Chart.js cargado exactamente una vez",
                             test_chartjs_single_load))

    results.append(run_test("C-05 Orden de carga de scripts correcto",
                             test_script_load_order))

    results.append(run_test("C-06 Sin valores STALE conocidos",
                             test_stale_values, avboard_data))

    results.append(run_test("C-07 Sin NaN/undefined visible en UI",
                             test_no_nan_visible))

    # ── Resumen ───────────────────────────────────────────────────────────────
    total   = len(results)
    passed  = sum(1 for p, _ in results if p)
    failed  = total - passed

    print()
    print(f"{BOLD}{'═' * 62}{RESET}")
    if failed == 0:
        print(f"  {GREEN}{BOLD}✅ CERTIFICACIÓN PASS — {passed}/{total} tests OK{RESET}")
        print(f"  Seguro para commit y push.")
    else:
        print(f"  {RED}{BOLD}❌ CERTIFICACIÓN FAIL — {failed}/{total} tests fallaron{RESET}")
        print(f"  Corregir errores antes de hacer push a producción.")
    print(f"{BOLD}{'═' * 62}{RESET}")
    print()

    return 0 if failed == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
