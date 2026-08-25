"""
test_p0_pipeline.py — Sprint P0: Pruebas de certificación de la capa de entrada
================================================================================
Tests A–L que verifican que el pipeline consolidado cumple las garantías del sprint:
  A. update_avboard consume raw_registry (no hay glob independiente activo)
  B. No existe segundo selector independiente activo en código
  C. Archivo válido renombrado se detecta por estructura (openpyxl)
  D. Archivo con schema roto genera ERROR_SCHEMA, no ceros silenciosos
  E. Archivo duplicado no se procesa dos veces
  F. Snapshot más reciente es el único vigente
  G. Vendedor nuevo no desaparece silenciosamente (VENDEDOR_NO_HOMOLOGADO)
  H. Alias conocido se normaliza al vendor_id correcto
  I. Vendedor desconocido genera alerta (no excepción)
  J. Agregar vendedor al catálogo no requiere modificar parser
  K. AVBOARD y SIC reciben el mismo vendor_id desde el catálogo
  L. Ejecutar dos veces el mismo inbox produce exactamente el mismo resultado

Uso:
    python3 scripts/test_p0_pipeline.py
"""

import sys
import os
import json
import shutil
import tempfile
import hashlib
from pathlib import Path

# Asegurar que scripts/ esté en el path
REPO = Path(__file__).parent.parent
sys.path.insert(0, str(REPO / "scripts"))

PASS = "✅ PASS"
FAIL = "❌ FAIL"
results = []


def record(test_id, name, passed, detail=""):
    icon = PASS if passed else FAIL
    results.append((test_id, name, passed, detail))
    print(f"  {icon}  [{test_id}] {name}")
    if detail:
        for line in detail.strip().split("\n"):
            print(f"       {line}")


# ─────────────────────────────────────────────────────────────────
# A. update_avboard consume raw_registry — no globs independientes
# ─────────────────────────────────────────────────────────────────
def test_A():
    txt = (REPO / "scripts" / "update_avboard.py").read_text(encoding="utf-8")
    # detect_inbox_files debe llamar a load_files_from_registry
    body_start = txt.find("def detect_inbox_files():")
    body_end   = txt.find("\ndef ", body_start + 1)
    body = txt[body_start:body_end]
    calls_registry = "load_files_from_registry" in body
    # main() debe llamar a inbox_detector.run() antes de load_files_from_registry
    main_start = txt.rfind("def main():")
    main_body  = txt[main_start:main_start + 3000]
    calls_detector = "inbox_detector" in main_body and "_inbox_det.run()" in main_body
    calls_load     = "load_files_from_registry" in main_body
    passed = calls_registry and calls_detector and calls_load
    record("A", "update_avboard consume raw_registry (no globs propios)",
           passed,
           f"detect_inbox_files→registry: {calls_registry} | main→detector.run: {calls_detector} | main→load_from_registry: {calls_load}")


# ─────────────────────────────────────────────────────────────────
# B. No hay segundo selector independiente activo
# ─────────────────────────────────────────────────────────────────
def test_B():
    txt = (REPO / "scripts" / "update_avboard.py").read_text(encoding="utf-8")
    # Patrones que indican globs independientes (líneas activas, no comentadas)
    forbidden_patterns = [
        "INBOX.glob('Libro de Ventas",
        "INBOX.glob('AGROVECA PERU*VENTAS",
        "INBOX.glob('Cuentas Cobrar  AGrocomercial",
        "INBOX.glob('Cuentas Cobrar AGrocomercial",
        "INBOX.glob('nuevo libro base",
    ]
    # Solo contar líneas no comentadas
    bad_lines = []
    for i, line in enumerate(txt.splitlines(), 1):
        stripped = line.strip()
        if stripped.startswith("#"):
            continue
        for pat in forbidden_patterns:
            if pat in line:
                bad_lines.append(f"L{i}: {stripped[:80]}")
    passed = len(bad_lines) == 0
    detail = "\n".join(bad_lines) if bad_lines else "Ningún glob independiente encontrado"
    record("B", "No existe segundo selector independiente activo", passed, detail)


# ─────────────────────────────────────────────────────────────────
# C. Archivo válido renombrado → clasificado por estructura
# ─────────────────────────────────────────────────────────────────
def test_C():
    try:
        import openpyxl
    except ImportError:
        record("C", "Archivo renombrado detectado por estructura",
               False, "openpyxl no disponible — instalar con pip install openpyxl")
        return

    # Buscar un archivo VENTAS_CL real en inbox para usarlo como fixture
    inbox = REPO / "inbox"
    cl_files = list(inbox.glob("Libro de Ventas *.xlsx"))
    if not cl_files:
        record("C", "Archivo renombrado detectado por estructura",
               False, "No hay archivo VENTAS_CL en inbox para crear fixture")
        return

    # Crear fixture en /tmp con nombre inválido pero estructura válida
    # (no escribir en inbox para evitar conflictos con el clasificador real)
    fixture_name = "ARCHIVO_SIN_NOMBRE_CORRECTO_fixture_test.xlsx"
    with tempfile.TemporaryDirectory() as tmpdir:
        fixture_path = Path(tmpdir) / fixture_name
        shutil.copy2(cl_files[0], fixture_path)

        import inbox_detector as det
        result = det.classify_by_structure(fixture_path)
        detected = result.get("tipo_archivo")
        passed = detected == "VENTAS_CL"
        record("C", "Archivo renombrado detectado por estructura",
               passed,
               f"Fixture: {fixture_name}\nNombre clasifica como: SIN_CLASIFICAR\nEstructura detecta: {detected} (confianza: {result.get('confianza')})")


# ─────────────────────────────────────────────────────────────────
# D. Archivo con schema roto → ERROR_SCHEMA explícito
# ─────────────────────────────────────────────────────────────────
def test_D():
    try:
        import openpyxl
    except ImportError:
        record("D", "Schema roto genera ERROR_SCHEMA",
               False, "openpyxl no disponible")
        return

    import sys as _sys
    from io import StringIO

    # Crear un Excel mínimo con sheet VENTAS pero sin columna "Vendedor"
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "VENTAS"
    ws.append([""])  # fila vacía (row 1)
    ws.append(["Fecha", "Monto", "SinColumnaVendedor", "MES"])  # header sin 'Vendedor' ni 'Total'

    with tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False) as tf:
        broken_path = Path(tf.name)
    wb.save(str(broken_path))

    try:
        # Capturar stdout para verificar que se imprime ERROR_SCHEMA
        old_stdout = _sys.stdout
        _sys.stdout = captured = StringIO()
        import update_avboard as ua
        result = ua.validate_schema_before_parse(broken_path, "VENTAS_CL")
        _sys.stdout = old_stdout
        output = captured.getvalue()

        passed = result == False and "ERROR_SCHEMA" in output
        record("D", "Schema roto genera ERROR_SCHEMA",
               passed,
               f"validate_schema_before_parse retornó: {result}\nOutput: {output[:200].strip()}")
    finally:
        broken_path.unlink(missing_ok=True)


# ─────────────────────────────────────────────────────────────────
# E. Archivo duplicado no se procesa dos veces
# ─────────────────────────────────────────────────────────────────
def test_E():
    reg_path = REPO / "pipeline" / "raw_registry.json"
    if not reg_path.exists():
        record("E", "Duplicado no procesado dos veces", False, "raw_registry.json no existe")
        return

    with open(reg_path, encoding="utf-8") as f:
        reg = json.load(f)

    # Verificar que ningún archivo DUPLICADO aparece en vigentes
    vigentes_fns = set(reg.get("vigentes", {}).values())
    duplicados = [
        a["filename"] if isinstance(a, dict) else a
        for alerta in reg.get("alertas", [])
        if alerta.get("tipo") == "DUPLICADO_EXACTO"
        for a in ([alerta] if "filename" in alerta else
                  [{"filename": fn} for fn in alerta.get("archivos", [])[1:]])
    ]
    # El vigente de un hash duplicado debe ser solo el primero/más reciente
    dup_vigentes = [d for d in duplicados if d in vigentes_fns]
    # Solo los archivos marcados como SUPERSEDED (no el primero del hash)
    archivos = reg.get("archivos", [])
    dup_estados = {
        r["filename"]: r["estado"]
        for r in archivos
        if r.get("estado") == "DUPLICADO"
    }
    # Verificar que los archivos DUPLICADO no son vigentes
    bad = [fn for fn in dup_estados if fn in vigentes_fns]
    passed = len(bad) == 0
    record("E", "Duplicado no procesado dos veces", passed,
           f"Archivos DUPLICADO en vigentes: {bad or 'ninguno'}")


# ─────────────────────────────────────────────────────────────────
# F. Snapshot más reciente es el único vigente
# ─────────────────────────────────────────────────────────────────
def test_F():
    reg_path = REPO / "pipeline" / "raw_registry.json"
    if not reg_path.exists():
        record("F", "Snapshot más reciente es vigente", False, "raw_registry.json no existe")
        return

    with open(reg_path, encoding="utf-8") as f:
        reg = json.load(f)

    archivos = reg.get("archivos", [])
    vigentes = reg.get("vigentes", {})

    # Para cada tipo+empresa, verificar que el vigente tenga la fecha más reciente
    from collections import defaultdict
    grupos = defaultdict(list)
    for r in archivos:
        if r.get("es_procesable") and r["tipo_archivo"] not in ("IGNORADO", "SIN_CLASIFICAR", "REFERENCIA"):
            clave = f"{r['tipo_archivo']}|{r.get('empresa_id')}"
            grupos[clave].append(r)

    errors = []
    for clave, grupo in grupos.items():
        if len(grupo) <= 1:
            continue
        vigente_fn = vigentes.get(clave)
        if not vigente_fn:
            continue
        vigente_reg = next((r for r in grupo if r["filename"] == vigente_fn), None)
        if not vigente_reg:
            continue
        # El vigente debe tener la mayor fecha (o la variante de mayor prioridad)
        fechas = [r.get("fecha_corte") or "0000-00-00" for r in grupo]
        max_fecha = max(fechas)
        v_fecha = vigente_reg.get("fecha_corte") or "0000-00-00"
        if v_fecha < max_fecha:
            errors.append(f"{clave}: vigente {vigente_fn} ({v_fecha}) < max ({max_fecha})")

    passed = len(errors) == 0
    record("F", "Snapshot más reciente es el único vigente", passed,
           "\n".join(errors) if errors else "Todos los vigentes tienen la fecha más reciente")


# ─────────────────────────────────────────────────────────────────
# G. Vendedor nuevo no desaparece silenciosamente
# ─────────────────────────────────────────────────────────────────
def test_G():
    import sys as _sys
    from io import StringIO

    # Cargar catálogo, agregar un vendedor ficticio, verificar que normalize_vendor lo detecta
    try:
        import vendors_catalog as vc
        vc.reload()  # asegurar estado fresco
        # Un nombre desconocido debe retornar is_known=False
        vid, is_known = vc.normalize_vendor("JUAN DESCONOCIDO NUEVO", "CL")
        passed = not is_known and vid == "JUAN DESCONOCIDO NUEVO"
        record("G", "Vendedor nuevo → VENDEDOR_NO_HOMOLOGADO (is_known=False)",
               passed,
               f"normalize_vendor('JUAN DESCONOCIDO NUEVO', 'CL') → ({vid}, {is_known})")
    except Exception as e:
        record("G", "Vendedor nuevo → VENDEDOR_NO_HOMOLOGADO", False, str(e))


# ─────────────────────────────────────────────────────────────────
# H. Alias conocido se normaliza al vendor_id correcto
# ─────────────────────────────────────────────────────────────────
def test_H():
    try:
        import vendors_catalog as vc
        vc.reload()
        test_cases = [
            ("PABLO LARATRO",    "CL", "laratro"),
            ("LIZBETH AGUIRRE",  "PE", "aguirre"),
            ("LISBETH AGUIRRE",  "PE", "aguirre"),   # variante ortográfica
            ("NICOLL NAVARRO",   "PE", "navarro"),    # fusionado, pero debe mapear
            ("SUSAN DÍAZ",       "PE", "diaz"),       # tilde
            ("VALENTINA MUÑOZ",  "CL", "munoz"),      # eñe
        ]
        errors = []
        for nombre, pais, expected in test_cases:
            vid, is_known = vc.normalize_vendor(nombre, pais)
            if vid != expected or not is_known:
                errors.append(f"'{nombre}' ({pais}) → {vid} (expected {expected}), known={is_known}")
        passed = len(errors) == 0
        record("H", "Aliases conocidos normalizan al vendor_id correcto",
               passed, "\n".join(errors) if errors else f"{len(test_cases)} alias verificados OK")
    except Exception as e:
        record("H", "Aliases conocidos normalizan al vendor_id correcto", False, str(e))


# ─────────────────────────────────────────────────────────────────
# I. Vendedor desconocido genera alerta, no excepción
# ─────────────────────────────────────────────────────────────────
def test_I():
    try:
        import vendors_catalog as vc
        vc.reload()
        # normalize_vendor no debe lanzar excepción para nombre desconocido
        try:
            vid, is_known = vc.normalize_vendor("NOMBRE TOTALMENTE DESCONOCIDO XYZ", "PE")
            no_exception = True
        except Exception as exc:
            no_exception = False
            vid, is_known = None, None

        passed = no_exception and not is_known
        record("I", "Vendedor desconocido no lanza excepción (retorna is_known=False)",
               passed,
               f"retornó ({vid}, {is_known}), excepción: {not no_exception}")
    except Exception as e:
        record("I", "Vendedor desconocido no lanza excepción", False, str(e))


# ─────────────────────────────────────────────────────────────────
# J. Agregar vendedor al catálogo no requiere modificar parser
# ─────────────────────────────────────────────────────────────────
def test_J():
    """
    Agrega temporalmente un vendedor ficticio al vendors.json,
    verifica que get_rtc_map() lo incluye sin tocar el parser.
    """
    catalog_path = REPO / "pipeline" / "vendors.json"
    try:
        with open(catalog_path, encoding="utf-8") as f:
            original = json.load(f)

        # Agregar vendedor ficticio
        new_vendor = {
            "vendor_id": "test_nuevo_vendor",
            "nombre_canonico": "Test Nuevo",
            "aliases": ["TEST NUEVO VENDEDOR TEMPORAL"],
            "pais": "CL",
            "empresa": "AGROCOMERCIAL_CL",
            "estado": "activo",
            "rol_comercial": "RTC",
            "orden_visual": 99,
            "en_ppto_cl": False,
            "en_rtc_ventas": False
        }
        modified = dict(original)
        modified["vendors"] = original["vendors"] + [new_vendor]

        with open(catalog_path, "w", encoding="utf-8") as f:
            json.dump(modified, f, ensure_ascii=False, indent=2)

        import vendors_catalog as vc
        vc.reload()  # forzar recarga
        rtc = vc.get_rtc_map("CL")
        in_map = "TEST NUEVO VENDEDOR TEMPORAL" in rtc
        maps_correctly = rtc.get("TEST NUEVO VENDEDOR TEMPORAL") == "test_nuevo_vendor"
        passed = in_map and maps_correctly

        record("J", "Agregar vendedor al catálogo no requiere modificar parser",
               passed,
               f"'TEST NUEVO VENDEDOR TEMPORAL' en rtc_map: {in_map}, mapea a: {rtc.get('TEST NUEVO VENDEDOR TEMPORAL')}")
    except Exception as e:
        record("J", "Agregar vendedor al catálogo no requiere modificar parser", False, str(e))
    finally:
        # Restaurar catálogo original
        with open(catalog_path, "w", encoding="utf-8") as f:
            json.dump(original, f, ensure_ascii=False, indent=2)
        import vendors_catalog as vc
        vc.reload()


# ─────────────────────────────────────────────────────────────────
# K. AVBOARD y SIC reciben el mismo vendor_id desde el catálogo
# ─────────────────────────────────────────────────────────────────
def test_K():
    try:
        import vendors_catalog as vc
        vc.reload()

        # get_rtc_map PE (usada por extract_peru_ventas → AVBOARD)
        rtc_pe = vc.get_rtc_map("PE")
        # get_vendor_order PE (usada por write_sic_tx_pe → SIC)
        order_pe = vc.get_vendor_order("PE")

        # Todos los IDs en order_pe deben existir como valores en rtc_pe
        rtc_ids = set(rtc_pe.values())
        order_ids = set(order_pe)
        # Excluir vendedores fusionados del order (navarro no está en order)
        missing_from_rtc = order_ids - rtc_ids
        passed = len(missing_from_rtc) == 0
        record("K", "AVBOARD y SIC usan los mismos vendor_ids",
               passed,
               f"order_PE: {order_pe}\nrtc_ids: {sorted(rtc_ids)}\nEn order pero no en rtc: {missing_from_rtc or 'ninguno'}")
    except Exception as e:
        record("K", "AVBOARD y SIC usan los mismos vendor_ids", False, str(e))


# ─────────────────────────────────────────────────────────────────
# L. Ejecutar dos veces el mismo inbox → mismo resultado
# ─────────────────────────────────────────────────────────────────
def test_L():
    try:
        import inbox_detector as det

        def run_and_hash():
            out = det.run()
            # Serializar vigentes + conteos (sin timestamp que siempre cambia)
            comparable = {
                "vigentes": out.get("vigentes", {}),
                "conteos": {k: v for k, v in out.get("metadata", {}).get("conteos", {}).items()},
                "n_archivos": len(out.get("archivos", [])),
            }
            return hashlib.md5(
                json.dumps(comparable, sort_keys=True).encode()
            ).hexdigest()

        h1 = run_and_hash()
        h2 = run_and_hash()
        passed = h1 == h2
        record("L", "Dos corridas del mismo inbox producen resultado idéntico",
               passed, f"Run 1 hash: {h1}\nRun 2 hash: {h2}")
    except Exception as e:
        record("L", "Dos corridas del mismo inbox producen resultado idéntico", False, str(e))


# ─────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print(f"\n{'='*60}")
    print(f"  SPRINT P0 — Tests de Certificación Pipeline")
    print(f"{'='*60}\n")

    test_A()
    test_B()
    test_C()
    test_D()
    test_E()
    test_F()
    test_G()
    test_H()
    test_I()
    test_J()
    test_K()
    test_L()

    print(f"\n{'='*60}")
    passed_count = sum(1 for _, _, p, _ in results if p)
    failed_count = len(results) - passed_count
    print(f"  RESULTADO: {passed_count}/{len(results)} PASS  |  {failed_count} FAIL")
    print(f"{'='*60}")

    if failed_count == 0:
        print("\n  ✅ P0 PIPELINE BASE CERTIFICADO\n")
        sys.exit(0)
    else:
        print("\n  ❌ BLOQUEADO — revisar errores antes de commit/push\n")
        for tid, name, passed, detail in results:
            if not passed:
                print(f"    FAIL [{tid}] {name}")
                if detail:
                    for line in detail.strip().split("\n")[:3]:
                        print(f"         {line}")
        sys.exit(1)
