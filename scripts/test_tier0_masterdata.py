#!/usr/bin/env python3
"""
test_tier0_masterdata.py — Certificación Master Data Tier 0
Tests A–J según especificación Foundation v1.0

Ejecutar: python3 scripts/test_tier0_masterdata.py
"""
import json, sys, subprocess, tempfile, shutil, copy
from pathlib import Path

ROOT = Path(__file__).parent.parent
MD_DIR = ROOT / "pipeline" / "master_data"
SCRIPTS = ROOT / "scripts"

PASS = "\033[92m✅ PASS\033[0m"
FAIL = "\033[91m❌ FAIL\033[0m"
results = []

def record(label, ok, detail=""):
    results.append((label, ok, detail))
    status = PASS if ok else FAIL
    print(f"  {status}  [{label}] {detail}")

# ─────────────────────────────────────────────────────────────────────────────
print("\n" + "="*62)
print("  CERTIFICACIÓN TIER 0 — MASTER DATA AV LATAM")
print("="*62 + "\n")

# ── A: KPIs antes = KPIs después ─────────────────────────────────────────────
print("[A] KPIs pre/post integridad")
import re
with open(ROOT / "avboard_data.js") as f:
    av = f.read()
pre_hash_cl = re.search(r'Chile YTD[^0-9]*([\d,]+)', av)
# Captura del run inmediato anterior ya validada: 414,135,939 CLP / 23,647,064 CxC
# Verificamos vs el output del pipeline reciente
result = subprocess.run(
    [sys.executable, str(SCRIPTS / "update_avboard.py")],
    capture_output=True, text=True, cwd=ROOT
)
out = result.stdout + result.stderr
ytd_cl_match  = re.search(r"Chile YTD:\s*CLP\s*([\d,]+)", out)
cxc90_match   = re.search(r"CxC \+90d:\s*CLP\s*([\d,]+)", out)
ytd_cl_post   = ytd_cl_match.group(1).replace(",","") if ytd_cl_match else "0"
cxc90_post    = cxc90_match.group(1).replace(",","") if cxc90_match else "0"
record("A", ytd_cl_post == "414135939" and cxc90_post == "23647064",
       f"Chile YTD={ytd_cl_post} · CxC+90d={cxc90_post}")

# ── B: FX leído desde Master Data ────────────────────────────────────────────
print("\n[B] TC CLP/USD desde fx_rates.json")
fx_path = MD_DIR / "fx_rates.json"
b_file_ok = fx_path.exists()
if b_file_ok:
    fx_data = json.loads(fx_path.read_text())
    active_rates = [r for r in fx_data.get("rates", []) if r.get("active")]
    b_has_active = bool(active_rates)
    b_value_ok   = active_rates[0]["valor"] == 950 if active_rates else False
else:
    b_has_active = b_value_ok = False
b_pipeline_reads = "💱 TC CLP/USD = 950 [fuente: fx_rates.json" in out
record("B", b_file_ok and b_has_active and b_value_ok and b_pipeline_reads,
       f"archivo={'OK' if b_file_ok else 'MISSING'} · rate_activo={'OK' if b_has_active else 'NO'}"
       f" · valor={'950' if b_value_ok else '?'} · pipeline_log={'OK' if b_pipeline_reads else 'MISSING'}")

# ── C: TC_CLP_USD=950 ya no es hardcode en update_avboard.py ─────────────────
print("\n[C] TC_CLP_USD eliminado como literal hardcode en Python")
src = (SCRIPTS / "update_avboard.py").read_text()
# Debe NO tener la asignación directa  (excluye comentarios y strings)
c_no_hardcode = not re.search(r'^TC_CLP_USD\s*=\s*950\b', src, re.MULTILINE)
# Debe tener la llamada a _load_fx_rate
c_has_loader  = "_load_fx_rate(\"CLP\", \"USD\")" in src
record("C", c_no_hardcode and c_has_loader,
       f"hardcode_eliminado={c_no_hardcode} · loader_presente={c_has_loader}")

# ── D: GG-001 funciona desde JSON ────────────────────────────────────────────
print("\n[D] GG-001 (folio 926) aplicado correctamente desde gg_decisions.json")
gg_path = MD_DIR / "gg_decisions.json"
d_file_ok = gg_path.exists()
if d_file_ok:
    gg_data = json.loads(gg_path.read_text())
    gg001 = next((d for d in gg_data.get("decisiones",[]) if d["id"] == "GG-001"), None)
    d_json_ok = (gg001 is not None and gg001.get("active") and
                 gg001.get("criterio",{}).get("valor") == "926" and
                 gg001.get("accion",{}).get("vendor_id_override") == "infante")
else:
    d_json_ok = False
d_pipeline_applied = "GG-001 ✓" in out
record("D", d_file_ok and d_json_ok and d_pipeline_applied,
       f"archivo={'OK' if d_file_ok else 'MISSING'} · json_schema={'OK' if d_json_ok else 'BAD'}"
       f" · pipeline_aplicado={'OK' if d_pipeline_applied else 'NO'}")

# ── E: GG-002 funciona desde JSON ────────────────────────────────────────────
print("\n[E] GG-002 (fusión navarro→aguirre) aplicado correctamente desde gg_decisions.json")
if d_file_ok:
    gg002 = next((d for d in gg_data.get("decisiones",[]) if d["id"] == "GG-002"), None)
    e_json_ok = (gg002 is not None and gg002.get("active") and
                 gg002.get("criterio",{}).get("vendor_id") == "navarro" and
                 gg002.get("accion",{}).get("fused_into") == "aguirre")
else:
    e_json_ok = False
e_pipeline_applied = "GG-002 ✓" in out
e_no_hardcode = ("GG-001 (2026-07-21): Folio 926" not in src and
                 "GG-002 (2026-07-21): NICOLL NAVARRO" not in src)
record("E", e_json_ok and e_pipeline_applied and e_no_hardcode,
       f"json_schema={'OK' if e_json_ok else 'BAD'} · pipeline_aplicado={'OK' if e_pipeline_applied else 'NO'}"
       f" · hardcode_eliminado={e_no_hardcode}")

# ── F: GG ficticia sin editar Python ─────────────────────────────────────────
print("\n[F] GG-999 ficticia en JSON no requiere editar Python")
gg_backup = gg_path.read_text()
gg_test_data = json.loads(gg_backup)
gg_test_data["decisiones"].append({
    "id": "GG-999",
    "fecha": "2026-08-24",
    "tipo": "fusion_vendedor",
    "descripcion": "Decisión ficticia para test F — sin impacto real",
    "criterio": {"vendor_id": "vendor_inexistente_xyz"},
    "accion": {"fused_into": "infante", "nombre_display": "Test"},
    "autorizado_por": "QA Test",
    "active": True,
    "modulos_afectados": []
})
gg_path.write_text(json.dumps(gg_test_data, ensure_ascii=False, indent=2))
result_f = subprocess.run(
    [sys.executable, str(SCRIPTS / "update_avboard.py")],
    capture_output=True, text=True, cwd=ROOT
)
out_f = result_f.stdout + result_f.stderr
# Restore
gg_path.write_text(gg_backup)
f_loads_999   = "GG Decisions cargadas: 3 activas" in out_f
f_no_crash    = result_f.returncode == 0
f_kpi_stable  = "414,135,939" in out_f   # KPIs siguen OK
record("F", f_loads_999 and f_no_crash and f_kpi_stable,
       f"carga_3_activas={f_loads_999} · no_crash={f_no_crash} · kpis_ok={f_kpi_stable}")
# Ensure restored
subprocess.run([sys.executable, str(SCRIPTS / "update_avboard.py")],
               capture_output=True, cwd=ROOT)

# ── G: Navarro/Aguirre consistente en todos los módulos ──────────────────────
print("\n[G] NAVARRO→AGUIRRE consistente en todos los consumidores")
# vendors.json: navarro estado=fusionado
vend = json.loads((ROOT / "pipeline" / "vendors.json").read_text())
nav_entry = next((v for v in vend["vendors"] if v["vendor_id"] == "navarro"), None)
g_vendors  = nav_entry is not None and nav_entry.get("estado") == "fusionado"
g_fused_to = nav_entry.get("fused_into") == "aguirre" if nav_entry else False
# gg_decisions.json: GG-002 activo
gg_data_fresh = json.loads(gg_path.read_text())
gg002_fresh = next((d for d in gg_data_fresh["decisiones"] if d["id"] == "GG-002"), None)
g_gg_json  = gg002_fresh is not None and gg002_fresh.get("active")
# clientes_peru.json: 0 registros NAVARRO
cl_pe = json.loads((ROOT / "apps/cotizador/data/clientes_peru.json").read_text())
navarro_residual = [c["nombre"] for c in cl_pe if "NAVARRO" in c.get("vendedor_rtc","").upper()]
g_clients  = len(navarro_residual) == 0
# sic_tx_pe.js: folio 926 → OSCAR INFANTE
sic_tx = (ROOT / "apps/sic_av/sic_tx_pe.js").read_text()
g_sic_f926 = '"folio":"926"' in sic_tx and (
    sic_tx[sic_tx.find('"folio":"926"')-5:sic_tx.find('"folio":"926"')+80].find('"vendedor":"OSCAR INFANTE"') >= 0
    or '"vendedor":"OSCAR INFANTE"' in sic_tx[max(0,sic_tx.find('"folio":"926"')-10):sic_tx.find('"folio":"926"')+150]
)
record("G", g_vendors and g_fused_to and g_gg_json and g_clients and not navarro_residual,
       f"vendors_fusionado={g_vendors} · fused_to_aguirre={g_fused_to} · gg_json={g_gg_json}"
       f" · clientes_pe_limpio={g_clients} · navarro_residual={navarro_residual}")

# ── H: Cotizador sin clientes mal asignados ───────────────────────────────────
print("\n[H] Cotizador sin clientes asignados a vendedor fusionado")
navarro_cl = [c["nombre"] for c in json.loads(
    (ROOT / "apps/cotizador/data/clientes_chile.json").read_text()
) if c.get("vendedor_rtc","").upper() == "NICOLL NAVARRO"]
navarro_pe = [c["nombre"] for c in cl_pe if c.get("vendedor_rtc","").upper() == "NICOLL NAVARRO"]
record("H", len(navarro_cl) == 0 and len(navarro_pe) == 0,
       f"CL_navarro={len(navarro_cl)} · PE_navarro={len(navarro_pe)}")

# ── I: AVBOARD = SIC para vendor_id canónico ─────────────────────────────────
print("\n[I] avboard_data.js: aguirre presente, navarro no es clave activa en por_vendedor")
av_post = (ROOT / "avboard_data.js").read_text()
# avboard_data.js usa JS object literal: claves sin comillas (aguirre: {...})
i_aguirre_present = re.search(r'\baguirre\s*:', av_post) is not None
# navarro NO debe aparecer como clave de vendedor activo en la sección por_vendedor
i_navarro_absent  = not re.search(r'\bnavarro\s*:\s*\{', av_post)
record("I", i_aguirre_present and i_navarro_absent,
       f"aguirre_presente={i_aguirre_present} · navarro_key_activa={not i_navarro_absent}")

# ── J: Idempotencia ───────────────────────────────────────────────────────────
print("\n[J] Dos ejecuciones idénticas producen mismo resultado")
import hashlib
def md5file(p):
    return hashlib.md5(Path(p).read_bytes()).hexdigest()
h1_av = md5file(ROOT / "avboard_data.js")
subprocess.run([sys.executable, str(SCRIPTS / "update_avboard.py")],
               capture_output=True, cwd=ROOT)
h2_av = md5file(ROOT / "avboard_data.js")
record("J", h1_av == h2_av, f"avboard_data.js hash1={h1_av[:8]} · hash2={h2_av[:8]}")

# ─────────────────────────────────────────────────────────────────────────────
n_pass = sum(1 for _, ok, _ in results if ok)
n_fail = sum(1 for _, ok, _ in results if not ok)
print("\n" + "="*62)
print(f"  RESULTADO: {n_pass}/{len(results)} PASS  |  {n_fail} FAIL")
print("="*62)
if n_fail == 0:
    print("\n  \033[92m\033[1m✅ TIER 0 MASTER DATA CERTIFICADO\033[0m\n")
else:
    print(f"\n  \033[91m\033[1m❌ BLOQUEADO — {n_fail} test(s) fallando\033[0m\n")
    for label, ok, detail in results:
        if not ok:
            print(f"     FAIL [{label}]: {detail}")
sys.exit(0 if n_fail == 0 else 1)
