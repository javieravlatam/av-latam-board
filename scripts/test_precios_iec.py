#!/usr/bin/env python3
"""
SUITE DE PRUEBAS AUTOMÁTICAS — SSOT Precios Piso e IEC
=======================================================
Certificación de la cadena completa:
  Libro Base → Master Dataset → Pipeline → avboard_data.js → Panel IEC → Cotizador

Ejecutar: python3 scripts/test_precios_iec.py
NO modifica ningún archivo. Solo lee y verifica.
Meta: 100% ✅ antes de emitir CERTIFICADO.
"""
import json, re, sys, pathlib
import openpyxl

BASE    = pathlib.Path(__file__).parent.parent
INBOX   = BASE / 'inbox'
SCRIPTS = BASE / 'scripts'
DATA    = BASE / 'data'

LIBRO_BASE  = INBOX / 'nuevo libro base AV 2026.xlsx'
PISO_CL_OLD = INBOX / 'precios piso CHile .xlsx'
COTIZ_CL    = BASE / 'apps/cotizador/data/productos_chile.json'
COTIZ_PE    = BASE / 'apps/cotizador/data/productos_peru.json'
AVBOARD_JS  = BASE / 'avboard_data.js'
PANEL_IEC   = BASE / 'Panel_IEC_Auditoria_2026.html'
UPDATE_PY   = SCRIPTS / 'update_avboard.py'
BUILD_MD    = SCRIPTS / 'build_master_dataset.py'
GEN_COT     = SCRIPTS / 'gen_cotizador_json.py'
MASTER_JSON = DATA / 'master_prices.json'

results = []


def test(name, ok, detail=''):
    status = '✅ PASS' if ok else '❌ FAIL'
    results.append({'name': name, 'ok': ok, 'detail': detail})
    print(f"{status} {name}")
    if detail:
        for line in detail.splitlines()[:2]:
            print(f"       {line}")


def extract_json_array(text, varname):
    pattern = f'const {varname} = '
    start = text.find(pattern)
    if start == -1: return None
    start += len(pattern)
    depth, i = 0, start
    while i < len(text):
        if text[i] == '[': depth += 1
        elif text[i] == ']':
            depth -= 1
            if depth == 0: return text[start:i+1]
        i += 1


print("=" * 70)
print("SUITE DE PRUEBAS — SSOT PRECIOS PISO E IEC")
print("=" * 70)
print()

# ─── T01 — Libro Base ────────────────────────────────────────────────────────
print("── T01: Libro Base (SSOT origen) ──────────────────────────────────────")
master = None
try:
    wb = openpyxl.load_workbook(LIBRO_BASE, data_only=True)
    sheets = wb.sheetnames
    test("T01a Libro Base accesible", LIBRO_BASE.exists(), str(LIBRO_BASE.name))
    test("T01b Libro Base tiene hoja Pricing Piso Chile", 'Pricing Piso Chile' in sheets)
    test("T01c Libro Base tiene hoja Pricing Piso Peru",  'Pricing Piso Peru'  in sheets)
except Exception as e:
    test("T01 Libro Base accesible", False, str(e))

# ─── T02 — Master Dataset ────────────────────────────────────────────────────
print("\n── T02: Master Dataset (data/master_prices.json) ──────────────────────")
try:
    with open(MASTER_JSON) as f:
        master = json.load(f)
    meta = master.get('_meta', {})
    test("T02a master_prices.json existe", True, f"{meta.get('total_productos')} SKUs")
    test("T02b Fuente es Libro Base nuevo (no archivo viejo)",
         'nuevo libro base' in meta.get('fuente','').lower(),
         f"Fuente: {meta.get('fuente','')}")
    test("T02c SSOT flag activo",
         meta.get('ssot') is True, "master_prices.json._meta.ssot = true")
    test("T02d Chile 100% con precio piso",
         meta.get('cl_sin_precio_piso', 1) == 0,
         f"Chile sin PP: {meta.get('cl_sin_precio_piso')}")
    test("T02e Perú 100% con precio piso",
         meta.get('pe_sin_precio_piso', 1) == 0,
         f"Perú sin PP: {meta.get('pe_sin_precio_piso')}")
except Exception as e:
    test("T02 Master Dataset accesible", False, str(e))
    master = None

# ─── T03 — Pipeline → Libro Base ─────────────────────────────────────────────
print("\n── T03: Pipeline usa Libro Base (no archivos viejos) ──────────────────")
with open(UPDATE_PY) as f:
    py_src = f.read()

test("T03a update_avboard.py detecta Libro Base en inbox",
     'nuevo libro base AV 2026*.xlsx' in py_src)
test("T03b archivo viejo solo en fallback deprecated (≤2 ocurrencias)",
     py_src.count("'precios piso CHile*.xlsx'") <= 2,
     f"Ocurrencias glob viejo: {py_src.count(chr(39)+'precios piso CHile*.xlsx'+chr(39))}")
# 0.867 puede aparecer en docstring — verificar que NO está en el bloque template
template_block = py_src[py_src.find('peru_ventas = {{'):py_src.find('var peru_cxc')]
hardcode_in_template = '0.867' in template_block
test("T03c IEC Perú NO hardcodeado en template de avboard_data.js",
     not hardcode_in_template,
     "FALLO: 0.867 encontrado en bloque template" if hardcode_in_template else "")
test("T03d compute_iec_peru() implementado",
     'def compute_iec_peru(' in py_src)
test("T03e _fn() helper existe",
     'def _fn(' in py_src)
test("T03f render_avboard_data_js acepta parámetro iec_pe",
     'iec_pe=None' in py_src)

# ─── T04 — Libro Base → Cotizador ────────────────────────────────────────────
print("\n── T04: Libro Base → Cotizador ─────────────────────────────────────────")
try:
    with open(COTIZ_CL) as f:
        cot_cl = json.load(f)
    with open(COTIZ_PE) as f:
        cot_pe = json.load(f)

    if master:
        master_idx_cl = {e['sku']: e for e in master['productos'] if e['pais'] == 'CL'}
        master_idx_pe = {e['sku']: e for e in master['productos'] if e['pais'] == 'PE'}

        cot_skus_cl = {e['sku'] for e in cot_cl if e.get('sku')}
        mst_skus_cl = set(master_idx_cl.keys())
        test("T04a Cotizador Chile tiene mismos SKUs que Master",
             cot_skus_cl == mst_skus_cl,
             f"Solo en cot: {len(cot_skus_cl - mst_skus_cl)} | Solo en master: {len(mst_skus_cl - cot_skus_cl)}")

        diffs_cl = []
        for sku in cot_skus_cl & mst_skus_cl:
            cp = next((e['precio_piso'] for e in cot_cl if e.get('sku') == sku), None)
            mp = master_idx_cl[sku].get('precio_piso')
            if cp and mp and abs(cp - mp) > 0.01:
                diffs_cl.append((sku, cp, mp))
        test("T04b Precios piso Cotizador Chile = Master Dataset",
             len(diffs_cl) == 0,
             f"FALLO: {len(diffs_cl)} diferencias" if diffs_cl else "")

        cot_skus_pe = {e['sku'] for e in cot_pe if e.get('sku')}
        mst_skus_pe = set(master_idx_pe.keys())
        test("T04c Cotizador Perú tiene mismos SKUs que Master",
             cot_skus_pe == mst_skus_pe,
             f"Cot={len(cot_skus_pe)} Master={len(mst_skus_pe)}")

        diffs_pe = []
        for sku in cot_skus_pe & mst_skus_pe:
            cp = next((e['precio_piso'] for e in cot_pe if e.get('sku') == sku), None)
            mp = master_idx_pe[sku].get('precio_piso')
            if cp and mp and abs(cp - mp) > 0.01:
                diffs_pe.append((sku, cp, mp))
        test("T04d Precios piso Cotizador Perú = Master Dataset",
             len(diffs_pe) == 0,
             f"FALLO: {len(diffs_pe)} diferencias" if diffs_pe else "")
    else:
        test("T04 Master Dataset disponible para comparar", False, "T02 falló")

except Exception as e:
    test("T04 Cotizador verificable", False, str(e))

# ─── T05 — Fórmula IEC única ─────────────────────────────────────────────────
print("\n── T05: Una sola fórmula IEC (Fase 7 ponderada) ───────────────────────")
with open(PANEL_IEC, 'r', encoding='utf-8', errors='replace') as f:
    html = f.read()

uses_fase7         = 'vpt>0 ? ve/vpt' in html
binary_as_oficial  = bool(re.search(r'const iec\s*=\s*ve>0\s*\?\s*sp/ve', html))
py_fase7           = 'valor_piso_teorico' in py_src and 'compute_iec_chile' in py_src

test("T05a Panel IEC usa Fase 7 (vpt>0 ? ve/vpt)", uses_fase7)
test("T05b Panel IEC NO usa binario (sp/ve) como IEC oficial",
     not binary_as_oficial,
     "FALLO: binario aún es el IEC oficial" if binary_as_oficial else "")
test("T05c update_avboard.py implementa Fase 7 (valor_piso_teorico)", py_fase7)

# ─── T06 — IEC Chile en avboard_data.js ──────────────────────────────────────
print("\n── T06: avboard_data.js contiene IEC Chile ─────────────────────────────")
with open(AVBOARD_JS) as f:
    avb = f.read()

m_iec = re.search(r'total:\s*([01]\.\d+)', avb)
iec_val = float(m_iec.group(1)) if m_iec else None
test("T06a avboard_data.js tiene IEC Chile total numérico (0 < IEC < 2)",
     iec_val is not None and 0 < iec_val < 2,
     f"IEC Chile = {iec_val}" if iec_val else "FALLO: no encontrado")

# ─── T07 — IEC Perú avboard_data.js ──────────────────────────────────────────
print("\n── T07: IEC Perú calculado (sin hardcode) en avboard_data.js ───────────")
m_pe = re.search(r'peru[^}]+?iec:\s*\{([^}]+)\}', avb, re.DOTALL)
pe_block = m_pe.group(1) if m_pe else ''

has_hardcode_exact = 'atalaya: 0.867' in pe_block
has_all_null       = pe_block.count('null') >= 5

test("T07a IEC Perú no tiene ≥5 valores null (hardcode legacy)",
     not has_all_null,
     "FALLO: ≥5 null — correr update_avboard.py con los nuevos cambios" if has_all_null else "")
test("T07b IEC Perú atalaya no es hardcode 0.867",
     not has_hardcode_exact,
     "FALLO: hardcode viejo aún en avboard_data.js" if has_hardcode_exact else "")

# ─── T08 — Cobertura precio piso ─────────────────────────────────────────────
print("\n── T08: Cobertura precio piso en TX_CL / TX_PE ─────────────────────────")
try:
    TX_CL = json.loads(extract_json_array(html, 'TX_CL').replace('\t', '\\t'))
    TX_PE = json.loads(extract_json_array(html, 'TX_PE').replace('\t', '\\t'))

    cl_el      = sum(1 for t in TX_CL if t.get('elegible'))
    pe_el      = sum(1 for t in TX_PE if t.get('elegible'))
    # T08a: denominador = tx con total>0 (excluye muestras/demos con total=0)
    # Las 641 filas total=0 son entregas gratuitas; no tienen precio de venta → no aplica PP.
    cl_paid    = sum(1 for t in TX_CL if float(t.get('total') or 0) > 0)
    cl_pct     = cl_el/cl_paid*100 if cl_paid else 0
    pe_pct     = pe_el/len(TX_PE)*100 if TX_PE else 0

    test("T08a Chile: >80% transacciones pagadas con precio piso",
         cl_pct >= 80,
         f"{cl_pct:.1f}% elegibles sobre tx-pagadas ({cl_el}/{cl_paid}, total filas={len(TX_CL)})")
    test("T08b Perú: >65% transacciones con precio piso",
         pe_pct >= 65,
         f"{pe_pct:.1f}% elegibles ({pe_el}/{len(TX_PE)})")

    # T08c — REGLA DE NEGOCIO: muestras gratuitas Chile excluidas de VNE y VPT
    # Las 641 filas TX_CL con total=0 representan entregas gratuitas (muestras/demos/bonificaciones).
    # REGLA: una transacción sin valor de venta no puede participar en el cálculo IEC.
    # Esta prueba verifica que ninguna de esas filas tenga elegible=True ni contribuya al VNE o VPT.
    cl_zero_total = [t for t in TX_CL if float(t.get('total') or 0) == 0]
    cl_zero_elegibles = [t for t in cl_zero_total if t.get('elegible')]
    cl_zero_vpt = sum((t.get('qty',0) or 0)*(t.get('pp',0) or 0) for t in cl_zero_elegibles)
    test("T08c Chile: 641 muestras gratuitas (total=0) excluidas de VNE y VPT [REGLA DE NEGOCIO]",
         len(cl_zero_total) == 641 and len(cl_zero_elegibles) == 0 and cl_zero_vpt == 0,
         f"Filas total=0: {len(cl_zero_total)} | Con elegible=True: {len(cl_zero_elegibles)} "
         f"| VPT acumulado: {cl_zero_vpt:.0f} (todos deben ser 0)")
except Exception as e:
    test("T08 Cobertura TX calculable", False, str(e))

# ─── T09 — Sin transacciones sin homologar ───────────────────────────────────
print("\n── T09: Sin transacciones con producto='?' ──────────────────────────────")
try:
    cl_q  = [t for t in TX_CL if t.get('producto','').strip() == '?']
    pe_q  = [t for t in TX_PE if t.get('producto','').strip() == '?']
    cl_vq = sum(t.get('total',0) for t in cl_q)
    pe_vq = sum(t.get('total',0) for t in pe_q)

    test("T09a Chile: cero transacciones con producto '?'",
         len(cl_q) == 0,
         f"FALLO: {len(cl_q)} tx = CLP {cl_vq:,.0f}" if cl_q else "")

    # T09b — Conjunto exacto NON-HOMOLOGABLE Perú (folios y cantidad)
    # Conjunto certificado el 2026-07-31: 11 facturas multi-producto sin desagregación posible.
    # El test FALLA si: aparece una tx adicional, desaparece alguna, o cambia algún folio.
    NON_HOMOLOGABLE_FOLIOS = {918, 922, 925, 948, 971, 977, 981, 993, 1019, 1027, 1031}
    pe_q_folios = set(int(t['folio']) for t in pe_q if t.get('folio'))
    test("T09b Perú: exactamente 11 tx NON-HOMOLOGABLE con folios certificados",
         len(pe_q) == 11 and pe_q_folios == NON_HOMOLOGABLE_FOLIOS,
         f"Count={len(pe_q)} (esperado 11) | "
         f"Folios extra={pe_q_folios - NON_HOMOLOGABLE_FOLIOS} | "
         f"Folios faltantes={NON_HOMOLOGABLE_FOLIOS - pe_q_folios}")

    # T09c — Monto total exacto NON-HOMOLOGABLE
    # El test FALLA si cambia el monto total de las 11 tx (nuevas facturas o correcciones).
    NON_HOMOLOGABLE_MONTO_USD = 38206.90
    monto_diff = abs(pe_vq - NON_HOMOLOGABLE_MONTO_USD)
    test("T09c Perú NON-HOMOLOGABLE: monto exacto USD 38,206.90",
         monto_diff < 0.01,
         f"Monto actual = USD {pe_vq:,.2f} | Esperado = USD {NON_HOMOLOGABLE_MONTO_USD:,.2f} "
         f"| Δ = USD {monto_diff:.2f}")

    # T09d — Exclusión explícita de VNE y VPT (numerador y denominador IEC)
    # Verifica que NINGUNA tx NON-HOMOLOGABLE tiene elegible=True ni precio piso asignado.
    # Si alguna entrara silenciosamente en el cálculo IEC, este test falla.
    pe_q_elegibles = [t for t in pe_q if t.get('elegible')]
    pe_q_con_pp    = [t for t in pe_q if t.get('pp') is not None]
    vne_nh = sum(t.get('total',0) for t in pe_q_elegibles)   # debe ser 0
    vpt_nh = sum((t.get('qty',0) or 0)*(t.get('pp',0) or 0) for t in pe_q_elegibles)  # debe ser 0
    test("T09d Perú NON-HOMOLOGABLE: excluidas explícitamente de VNE y VPT",
         len(pe_q_elegibles) == 0 and len(pe_q_con_pp) == 0 and vne_nh == 0 and vpt_nh == 0,
         f"Con elegible=True: {len(pe_q_elegibles)} | Con pp asignado: {len(pe_q_con_pp)} "
         f"| VNE acumulado: {vne_nh:.2f} | VPT acumulado: {vpt_nh:.2f} (todos deben ser 0)")
except Exception as e:
    test("T09 Sin homologar verificable", False, str(e))

# ─── T10 — Reconciliación IEC Chile ──────────────────────────────────────────
print("\n── T10: IEC Chile TX_CL Fase 7 > 75% ───────────────────────────────────")
try:
    el_cl  = [t for t in TX_CL if t.get('elegible')]
    vne_cl = sum(t.get('total', 0) for t in el_cl)
    vpt_cl = sum((t.get('qty', 0) or 0)*(t.get('pp', 0) or 0) for t in el_cl)
    iec_cl = vne_cl/vpt_cl if vpt_cl else 0

    test("T10a IEC Chile Fase 7 (TX_CL) > 75%",
         iec_cl > 0.75,
         f"IEC Chile = {iec_cl:.1%} VNE={vne_cl:,.0f} VPT={vpt_cl:,.0f}")
    test("T10b VPT Chile > 0 (hay qty × pp calculable)",
         vpt_cl > 0)
except Exception as e:
    test("T10 Reconciliación Chile", False, str(e))

# ─── T11 — Reconciliación IEC Perú ───────────────────────────────────────────
print("\n── T11: IEC Perú TX_PE Fase 7 > 85% ────────────────────────────────────")
try:
    el_pe  = [t for t in TX_PE if t.get('elegible')]
    vne_pe = sum(t.get('total', 0) for t in el_pe)
    vpt_pe = sum((t.get('qty', 0) or 0)*(t.get('pp', 0) or 0) for t in el_pe)
    iec_pe = vne_pe/vpt_pe if vpt_pe else 0

    test("T11a IEC Perú Fase 7 (TX_PE) > 85%",
         iec_pe > 0.85,
         f"IEC Perú = {iec_pe:.1%} VNE={vne_pe:,.2f} VPT={vpt_pe:,.2f}")
    test("T11b VPT Perú > 0",
         vpt_pe > 0)
except Exception as e:
    test("T11 Reconciliación Perú", False, str(e))

# ─── T12 — Archivos SSOT existen ─────────────────────────────────────────────
print("\n── T12: Scripts y archivos SSOT existen ────────────────────────────────")
test("T12a build_master_dataset.py existe", BUILD_MD.exists())
test("T12b gen_cotizador_json.py existe",   GEN_COT.exists())
test("T12c data/master_prices.json existe", MASTER_JSON.exists())
test("T12d test_precios_iec.py existe",     (SCRIPTS/'test_precios_iec.py').exists())

# ─── RESUMEN ─────────────────────────────────────────────────────────────────
print()
print("=" * 70)
total  = len(results)
passed = sum(1 for r in results if r['ok'])
failed = total - passed
print(f"RESULTADO: {passed}/{total} pruebas pasaron  |  {failed} fallaron")
print("=" * 70)

if failed:
    print("\nFALLOS:")
    for r in results:
        if not r['ok']:
            print(f"  ❌ {r['name']}")
            if r['detail']:
                print(f"     {r['detail'].splitlines()[0]}")

sys.exit(0 if failed == 0 else 1)
