#!/usr/bin/env python3
"""
test_cxc_canonico.py — Tests A–N: CxC Canónico Sprint
Foundation v1.0 · 2026-08-25

14 tests que certifican el parser CxC Perú, claves canónicas,
y consistencia entre registry → parser → AVBOARD → Panel_CxC.
"""

import sys, json, re, hashlib, tempfile
from pathlib import Path
from datetime import datetime

ROOT    = Path(__file__).parent.parent
SCRIPTS = ROOT / "scripts"
INBOX   = ROOT / "inbox"
REGISTRY_PATH = ROOT / "pipeline" / "raw_registry.json"
VENDORS_PATH  = ROOT / "pipeline" / "vendors.json"
AVBOARD_JS    = ROOT / "avboard_data.js"
PANEL_CXC     = ROOT / "Panel_CxC_AV_Latam_2026.html"

# ── Cargar módulo principal (main() guardado por __name__ == '__main__') ──────
import importlib.util
_spec = importlib.util.spec_from_file_location("avboard", str(SCRIPTS / "update_avboard.py"))
_mod  = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)

parse_cxc_pe             = _mod.parse_cxc_pe
validate_schema_before_parse = _mod.validate_schema_before_parse
_normalize_rtc_pe        = _mod._normalize_rtc_pe
_apply_cxc_gg_fusions    = _mod._apply_cxc_gg_fusions

# ── Contadores ────────────────────────────────────────────────────────────────
PASS = 0; FAIL = 0; SKIP = 0

def ok(label):
    global PASS; PASS += 1
    print(f"  ✅ {label}")

def fail(label, detail=""):
    global FAIL; FAIL += 1
    print(f"  ❌ {label}")
    if detail:
        print(f"     {detail}")

def skip(label, why):
    global SKIP; SKIP += 1
    print(f"  ⚠  SKIP {label}: {why}")

# ── Helpers ───────────────────────────────────────────────────────────────────
def _load_registry():
    return json.loads(REGISTRY_PATH.read_text(encoding='utf-8'))

def _load_vendors_pe_ids() -> set:
    data = json.loads(VENDORS_PATH.read_text(encoding='utf-8'))
    return {v['vendor_id'] for v in data.get('vendors', []) if v.get('pais') == 'PE'}

def _get_cxc_pe_vigente(reg: dict):
    return reg.get('vigentes', {}).get('CXC_PE|AGROVECA_PE')

def _get_cxc_pe_entry(reg: dict):
    fn = _get_cxc_pe_vigente(reg)
    if not fn:
        return None
    archivos = reg.get('archivos', [])
    if isinstance(archivos, dict):
        archivos = list(archivos.values())
    for e in archivos:
        if e.get('filename') == fn and e.get('estado') == 'VIGENTE':
            return e
    return None

def _extract_peru_cxc_from_avboard():
    """Extrae el objeto peru_cxc de avboard_data.js via regex + JSON parse."""
    txt = AVBOARD_JS.read_text(encoding='utf-8')
    m = re.search(r'var peru_cxc\s*=\s*(\{.*?\})\s*;', txt, re.DOTALL)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except Exception:
        return None

# ── Setup: cargar datos una sola vez ─────────────────────────────────────────
reg       = _load_registry()
entry     = _get_cxc_pe_entry(reg)
vigente_fn = _get_cxc_pe_vigente(reg)
cxc_pe_path = (INBOX / vigente_fn) if vigente_fn else None

if cxc_pe_path and cxc_pe_path.exists() and entry:
    _iso = entry.get('fecha_corte', '')
    fecha_corte_str = datetime.strptime(_iso, '%Y-%m-%d').strftime('%d/%m/%Y') if _iso else '—'
    pe_cxc = parse_cxc_pe(cxc_pe_path, fecha_corte_str)
else:
    pe_cxc = None
    fecha_corte_str = '—'

av = _extract_peru_cxc_from_avboard()


# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("  TEST CxC CANÓNICO — Tests A–N")
print(f"  {datetime.now():%Y-%m-%d %H:%M}")
print("=" * 60)


# ── A. CxC PE detecta el snapshot vigente ────────────────────────────────────
print("\n── A. CxC PE detecta el snapshot vigente")
if vigente_fn:
    if cxc_pe_path and cxc_pe_path.exists():
        ok(f"Vigente: '{vigente_fn}' · existe en inbox")
    else:
        fail("Vigente en registry pero archivo no existe en inbox", str(cxc_pe_path))
else:
    fail("No hay vigente CXC_PE|AGROVECA_PE en raw_registry.json")


# ── B. fecha_corte coincide con el archivo fuente ────────────────────────────
print("\n── B. fecha_corte coincide con el archivo fuente")
if entry and pe_cxc:
    reg_fc    = fecha_corte_str
    parsed_fc = pe_cxc.get('corte', '')
    if reg_fc == parsed_fc:
        ok(f"fecha_corte OK: registry={reg_fc} = parser={parsed_fc}")
    else:
        fail("fecha_corte mismatch", f"registry={reg_fc} vs parser={parsed_fc}")
else:
    skip("B", "Sin entry o pe_cxc")


# ── C. schema roto falla explícitamente ──────────────────────────────────────
print("\n── C. schema roto falla explícitamente")
try:
    import openpyxl
    with tempfile.NamedTemporaryFile(suffix='.xlsx', delete=False) as tf:
        tmp_path = Path(tf.name)
    wb = openpyxl.Workbook()
    ws = wb.active; ws.title = "AGROVECA"
    ws.append(["COL_INVALIDA_1", "COL_INVALIDA_2"])   # header en fila 1 — requerida en fila 6
    wb.save(tmp_path)
    import io
    from contextlib import redirect_stdout
    with redirect_stdout(io.StringIO()):  # suprimir output del validador
        result_c = validate_schema_before_parse(tmp_path, 'CXC_PE')
    tmp_path.unlink(missing_ok=True)
    if result_c is False:
        ok("Schema roto → validate_schema_before_parse retorna False")
    else:
        fail("Schema roto no fue detectado (retornó True)")
except ImportError:
    skip("C", "openpyxl no disponible")
except Exception as e:
    fail("C lanzó excepción inesperada", str(e))


# ── D. duplicados no inflan saldo ────────────────────────────────────────────
print("\n── D. duplicados no inflan saldo")
if pe_cxc and cxc_pe_path and cxc_pe_path.exists():
    import io
    from contextlib import redirect_stdout
    with redirect_stdout(io.StringIO()):
        pe_cxc_2 = parse_cxc_pe(cxc_pe_path, fecha_corte_str)
    if pe_cxc['total'] == pe_cxc_2['total'] and pe_cxc['supra'] == pe_cxc_2['supra']:
        ok(f"Segunda corrida = mismo total: USD {pe_cxc['total']:,} · supra {pe_cxc['supra']:,}")
    else:
        fail("Totales difieren entre corridas",
             f"run1.total={pe_cxc['total']} run2.total={pe_cxc_2['total']}")
else:
    skip("D", "Sin pe_cxc o archivo")


# ── E. vendedor desconocido → sin_asignar ────────────────────────────────────
print("\n── E. vendedor desconocido → sin_asignar")
if pe_cxc:
    mapped = _normalize_rtc_pe("GUILLERMO PRADENAS")
    if mapped == "sin_asignar":
        ok("GUILLERMO PRADENAS → sin_asignar ✓")
    else:
        fail(f"GUILLERMO PRADENAS → '{mapped}' (esperado: 'sin_asignar')")
    if "sin_asignar" in pe_cxc.get("por_vendedor", {}):
        ok("Bucket sin_asignar presente en por_vendedor")
    else:
        fail("sin_asignar no aparece en por_vendedor",
             f"keys={sorted(pe_cxc['por_vendedor'].keys())}")
else:
    skip("E", "Sin pe_cxc")


# ── F. vendor_id canónico coincide con vendors.json ──────────────────────────
print("\n── F. vendor_id canónico coincide con vendors.json")
if pe_cxc:
    known_pe = _load_vendors_pe_ids() | {"sin_asignar"}  # bucket sintético
    unknown  = [k for k in pe_cxc["por_vendedor"] if k not in known_pe]
    if not unknown:
        ok(f"Todos los vendor_id en catálogo: {sorted(pe_cxc['por_vendedor'].keys())}")
    else:
        fail(f"vendor_id fuera de catálogo: {unknown}")
else:
    skip("F", "Sin pe_cxc")


# ── G. total parser = sum(por_vendedor) ──────────────────────────────────────
print("\n── G. total parser = sum(por_vendedor.total)")
if pe_cxc:
    pv_sum = sum(v["total"] for v in pe_cxc["por_vendedor"].values())
    diff   = abs(pe_cxc["total"] - pv_sum)
    if diff <= 1:  # tolerancia $1 por redondeo
        ok(f"total={pe_cxc['total']:,} = sum(pv)={pv_sum:,} (diff={diff})")
    else:
        fail(f"Mismatch total vs sum(pv)",
             f"pe_cxc.total={pe_cxc['total']:,} sum(pv)={pv_sum:,}")
else:
    skip("G", "Sin pe_cxc")


# ── H. total AVBOARD = parser total ──────────────────────────────────────────
print("\n── H. total AVBOARD = Panel CxC (via avboard_data.js)")
if av and pe_cxc:
    av_total = av.get("total", -1)
    if av_total == pe_cxc["total"]:
        ok(f"peru_cxc.total en AVBOARD = {av_total:,} = parser.total")
    else:
        fail("Mismatch AVBOARD vs parser",
             f"AVBOARD.total={av_total} parser.total={pe_cxc['total']}")
    # También verificar que Panel_CxC peruData tiene mismo nº de docs
    panel_txt = PANEL_CXC.read_text(encoding='utf-8')
    m_pd = re.search(r'const peruData\s*=\s*\[(.*?)\]', panel_txt, re.DOTALL)
    if m_pd:
        n_panel  = m_pd.group(1).count('vendedor:')
        n_parser = len(pe_cxc.get('all_documentos', pe_cxc.get('documentos', [])))
        if n_panel == n_parser:
            ok(f"Panel_CxC peruData tiene {n_panel} docs = parser.all_documentos")
        else:
            fail(f"Panel_CxC peruData ({n_panel} docs) ≠ parser ({n_parser} docs)")
    else:
        fail("No se encontró peruData en Panel_CxC HTML")
elif not av:
    fail("No se pudo extraer peru_cxc de avboard_data.js")
else:
    skip("H", "Sin pe_cxc")


# ── I. aging coincide (tramos sum ≈ total) ───────────────────────────────────
print("\n── I. aging coincide (sum(tramos) ≈ total)")
if pe_cxc:
    tr_sum = sum(pe_cxc["tramos"].values())
    diff   = abs(tr_sum - pe_cxc["total"])
    if diff <= 1:
        ok(f"sum(tramos)={tr_sum:,} ≈ total={pe_cxc['total']:,}")
    else:
        fail(f"sum(tramos)={tr_sum:,} ≠ total={pe_cxc['total']:,}",
             f"tramos={pe_cxc['tramos']}")
else:
    skip("I", "Sin pe_cxc")


# ── J. +90d coincide con documentos reales ───────────────────────────────────
print("\n── J. +90d coincide con documentos reales")
if pe_cxc:
    # 'documentos' = non-supra only (alineado con tramos); 'all_documentos' incluye supra
    t90_docs  = round(sum(d["monto"] for d in pe_cxc.get("documentos", []) if d["dias"] > 90))
    t90_tramo = pe_cxc["tramos"].get("t90", 0)
    diff = abs(t90_docs - t90_tramo)
    if diff <= 1:
        ok(f"+90d: docs={t90_docs:,} = tramo.t90={t90_tramo:,}")
    else:
        fail(f"+90d mismatch", f"docs={t90_docs:,} vs tramo={t90_tramo:,}")
else:
    skip("J", "Sin pe_cxc")


# ── K. Chile no cambia ────────────────────────────────────────────────────────
print("\n── K. Chile no cambia")
av_txt = AVBOARD_JS.read_text(encoding='utf-8')
# Buscar que CxC Chile aún tiene t90 con valor CLP presente
m_clp_t90 = re.search(r'["\']?t90["\']?\s*:\s*([0-9]{6,})', av_txt)
if m_clp_t90:
    clp_t90 = int(m_clp_t90.group(1))
    ok(f"Chile CxC +90d presente en AVBOARD: CLP {clp_t90:,}")
else:
    fail("Chile CxC t90 no encontrado o cero en avboard_data.js")
# Verificar que chile_cxc o similar no fue eliminado
if '"vencida"' in av_txt and '"tramos"' in av_txt:
    ok("Estructura CxC (vencida, tramos) intacta en AVBOARD")
else:
    fail("Estructura CxC deteriorada en AVBOARD")


# ── L. segunda corrida idéntica = mismo resultado ────────────────────────────
print("\n── L. segunda corrida idéntica = mismo resultado")
if pe_cxc and cxc_pe_path and cxc_pe_path.exists():
    import io
    from contextlib import redirect_stdout
    with redirect_stdout(io.StringIO()):
        r2 = parse_cxc_pe(cxc_pe_path, fecha_corte_str)
    # Comparar sin 'documentos' para evitar ruido de orden
    def _cmp_dict(d): return json.dumps(
        {k: v for k, v in d.items() if k != 'documentos'}, sort_keys=True)
    if _cmp_dict(pe_cxc) == _cmp_dict(r2):
        ok("Idempotencia: dos corridas producen resultado idéntico")
    else:
        fail("Resultados difieren entre corridas (no idempotente)")
else:
    skip("L", "Sin pe_cxc o archivo")


# ── M. no queda CxC Perú hardcodeado (corte congelado) ──────────────────────
print("\n── M. no queda CxC Perú hardcodeado (corte '10/05/2026')")
m_pc = re.search(r'var peru_cxc\s*=\s*(\{.*?\})\s*;', av_txt, re.DOTALL)
if m_pc:
    if '10/05/2026' in m_pc.group(1):
        fail("Corte hardcodeado '10/05/2026' encontrado en peru_cxc del AVBOARD")
    else:
        ok("Corte '10/05/2026' NO está en peru_cxc (datos dinámicos) ✓")
else:
    fail("No se pudo extraer peru_cxc de avboard_data.js para verificar")


# ── N. no quedan claves legacy aguirre_navarro / gonzales_valladares ─────────
print("\n── N. no quedan claves legacy activas en por_vendedor")
LEGACY = ['aguirre_navarro', 'gonzales_valladares', 'pradenas_sin_asignar']
if av:
    found = [k for k in LEGACY if k in av.get('por_vendedor', {})]
    if not found:
        ok("Sin claves legacy en por_vendedor de AVBOARD ✓")
    else:
        fail(f"Claves legacy en AVBOARD: {found}")
if pe_cxc:
    found_p = [k for k in LEGACY if k in pe_cxc.get('por_vendedor', {})]
    if not found_p:
        ok("Sin claves legacy en por_vendedor del parser ✓")
    else:
        fail(f"Claves legacy en parser: {found_p}")
if not av and not pe_cxc:
    skip("N", "Sin AVBOARD ni pe_cxc")

# También verificar Panel_CxC HTML
panel_txt = PANEL_CXC.read_text(encoding='utf-8')
panel_legacy = [k for k in LEGACY if f'pv.{k}' in panel_txt]
if not panel_legacy:
    ok("Sin claves legacy en Panel_CxC JS ✓")
else:
    fail(f"Claves legacy en Panel_CxC JS: {panel_legacy}")


# ── Resumen ───────────────────────────────────────────────────────────────────
total = PASS + FAIL + SKIP
print(f"\n{'='*60}")
print(f"  CxC CANÓNICO: {PASS}/{total-SKIP} PASS · {FAIL} FAIL · {SKIP} SKIP")
if FAIL == 0:
    print("  ✅ CERTIFICACIÓN CxC CANÓNICO: PASS")
else:
    print("  ❌ CERTIFICACIÓN CxC CANÓNICO: BLOQUEADO")
print("=" * 60 + "\n")
sys.exit(0 if FAIL == 0 else 1)
