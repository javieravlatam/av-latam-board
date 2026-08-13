"""
ventas_cl_parser.py — Sprint 1 Stage 2
AV LATAM Executive Intelligence Pipeline

Consume: pipeline/raw_registry.json  (nunca lee /inbox directamente)
Produce: pipeline/canonical/ventas_cl.parquet
         pipeline/canonical/ventas_cl.csv

Soporta esquemas:
  v20 — 20 cols estándar (2026-05 en adelante, vigente actual)
  v21 — 21 cols = v20 + Fecha Pago Fct.
  v25 — 25 cols = v21 + Tipo de Cliente + % Comisión + Moto Comisión + Plazo Facturación
  vSUMARIO — 10 cols presupuesto/cumplimiento → rechazado, no es transaccional

NO calcula IEC, comisiones ni presupuesto.
NO modifica dashboards, SIC, GAS ni autenticación.
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from datetime import date, datetime
from pathlib import Path
from typing import Any

import openpyxl
import pandas as pd

# ---------------------------------------------------------------------------
# Rutas
# ---------------------------------------------------------------------------
REPO_ROOT      = Path(__file__).parent.parent.parent
REGISTRY_PATH  = REPO_ROOT / "pipeline" / "raw_registry.json"
CANONICAL_DIR  = REPO_ROOT / "pipeline" / "canonical"
OUTPUT_PARQUET = CANONICAL_DIR / "ventas_cl.parquet"
OUTPUT_CSV     = CANONICAL_DIR / "ventas_cl.csv"

INBOX_PATH = REPO_ROOT / "inbox"   # sólo para resolver rutas; jamás se itera

PIPELINE_VERSION = "1.0.0"

# ---------------------------------------------------------------------------
# Diccionario oficial de vendedores → SIC ID
# Fuente: scripts/update_avboard.py (vendedor_map canónico)
# ---------------------------------------------------------------------------
VENDEDOR_SIC: dict[str, str] = {
    "PABLO LARATRO":      "laratro",
    "FRANCISCO VELASQUEZ": "velasquez",
    "JORGE CAROCA":       "caroca",
    "RODRIGO ENCINA":     "encina",
    "IVAN VEVERKA":       "veverka",
    "IVÁN VEVERKA":       "veverka",
    "VALENTINA MUÑOZ":    "munoz",
    "VALENTINA MUNOZ":    "munoz",
    "JUAN PABLO NEIRA":   "neira",
    "FRANCO RIFFO":       "franco_riffo",
    "RAYEN BERNAZAR":     "bernazar",
    "JAVIER ALMEIDA":     "almeida",
    # Entradas sin ID SIC conocida
    "EN TERRENO 1":       "terreno_1",
    "LABORATORIO":        "laboratorio",
}

# ---------------------------------------------------------------------------
# Constantes de esquema
# ---------------------------------------------------------------------------
# Columnas mínimas que identifican un archivo transaccional (v20/21/25)
_TRANSACCIONAL_SENTINEL = {"MES", "RUT", "RAZÓN SOCIAL", "FECHA", "VENDEDOR", "FOLIO"}

# Columnas mínimas que identifican el formato sumario (presupuesto/cumplimiento)
_SUMARIO_SENTINEL = {"PPTO", "CUMPLIMIENTO"}

# Mapeo posicional por versión detectada
#   key = ncols_efectivas (sin trailing None)
#   value = dict col_name → índice
_SCHEMA_BASE = {
    "mes":             0,
    "rut":             1,
    "razon_social":    2,
    "fecha":           3,
    "region":          4,
    "vendedor":        5,
    "producto":        6,
    "un":              7,
    "tipo_doc":        8,
    "folio":           9,
    "um":             10,
    "cantidad":       11,
    "total":          12,
    "precio_uni":     13,
    "moneda":         14,
    "pais":           15,
    "fecha_venc":     16,
    "negocio":        17,
    "comentarios":    18,
    "fecha_guia":     19,
}

# v21 y v25 agregan fecha_pago_fct en pos 20
# v25 además inserta tipo_cliente en pos 6 y agrega columnas al final

# ---------------------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------------------

def _sha256_tx(empresa_id: str, folio: Any, fecha: Any, rut: str,
               producto: str, cantidad: Any) -> str:
    """ID de transacción estable.
    Incluye cantidad para distinguir dos líneas del mismo producto en un folio
    (ej: 20u + 10u de AV CYTO PRIME en misma factura).
    """
    raw = f"{empresa_id}|{folio}|{fecha}|{rut}|{producto}|{cantidad}"
    return "tx_" + hashlib.sha256(raw.encode()).hexdigest()[:16]


def _parse_date(val: Any) -> date | None:
    """Convierte str DD/MM/YYYY o datetime a date. Retorna None si inválido."""
    if val is None:
        return None
    if isinstance(val, (datetime, date)):
        return val.date() if isinstance(val, datetime) else val
    s = str(val).strip()
    for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    return None


def _clean_rut(val: Any) -> str | None:
    if val is None:
        return None
    return re.sub(r"\s+", "", str(val).strip().upper())


def _clean_str(val: Any) -> str | None:
    if val is None:
        return None
    s = str(val).strip()
    return s if s else None


def _to_float(val: Any) -> float | None:
    if val is None:
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def _to_int(val: Any) -> int | None:
    if val is None:
        return None
    try:
        return int(val)
    except (ValueError, TypeError):
        return None


# ---------------------------------------------------------------------------
# Detección de esquema
# ---------------------------------------------------------------------------

def _header_ncols(row: tuple) -> int:
    """Número de columnas efectivas (descartando trailing None)."""
    cols = list(row)
    while cols and cols[-1] is None:
        cols.pop()
    return len(cols)


def detect_schema(header: tuple) -> str:
    """
    Devuelve: 'v20', 'v21', 'v25', 'vSUMARIO', 'vDESCONOCIDO'
    """
    ncols = _header_ncols(header)
    header_upper = {str(c).strip().upper() for c in header if c is not None}

    # Detección por contenido antes que por conteo (más robusta)
    if _SUMARIO_SENTINEL & header_upper or (
        "VENDEDOR" in header_upper and "PPTO ENERO ($)" in " ".join(header_upper)
    ):
        return "vSUMARIO"

    if not (_TRANSACCIONAL_SENTINEL & header_upper):
        return "vDESCONOCIDO"

    if ncols >= 25:
        return "v25"
    if ncols >= 21:
        return "v21"
    if ncols >= 20:
        return "v20"
    return "vDESCONOCIDO"


# ---------------------------------------------------------------------------
# Extracción de fila según esquema
# ---------------------------------------------------------------------------

def _extract_row_v20(row: tuple, schema: str, empresa_id: str,
                     pais_id: str, moneda: str, fecha_corte: str,
                     archivo_fuente: str) -> dict | None:
    """
    Extrae un dict canónico de una fila transaccional.
    v20: índices fijos según _SCHEMA_BASE.
    v21: igual + col 20 = fecha_pago_fct.
    v25: col 6 = tipo_cliente insertada → shift de producto en adelante.
    """
    # Determinar offsets para v25
    if schema == "v25":
        tipo_cliente_idx = 6
        prod_offset = 1   # todo después de col 6 se desplaza +1
    else:
        tipo_cliente_idx = None
        prod_offset = 0

    def col(base_idx: int) -> Any:
        idx = base_idx + (prod_offset if base_idx >= 6 else 0)
        return row[idx] if idx < len(row) else None

    mes       = _clean_str(col(0))
    rut       = _clean_rut(col(1))
    razon     = _clean_str(col(2))
    fecha_tx  = _parse_date(col(3))
    region    = _clean_str(col(4))
    vendedor  = _clean_str(col(5))
    tipo_cliente = _clean_str(row[tipo_cliente_idx]) if tipo_cliente_idx else None
    producto  = _clean_str(col(6))
    un        = _clean_str(col(7))
    tipo_doc  = _clean_str(col(8))
    folio     = _to_int(col(9))
    um        = _clean_str(col(10))
    cantidad  = _to_float(col(11))
    total     = _to_float(col(12))
    precio_u  = _to_float(col(13))
    mon_doc   = _clean_str(col(14))
    pais_doc  = _clean_str(col(15))
    fecha_vc  = _parse_date(col(16))
    negocio   = _clean_str(col(17))
    coment    = _clean_str(col(18))
    fecha_g   = _parse_date(col(19))

    # v21 / v25
    fecha_pago = _parse_date(col(20)) if schema in ("v21", "v25") else None

    # Vendedor → SIC ID
    vendedor_norm = vendedor.upper() if vendedor else None
    vendedor_id   = VENDEDOR_SIC.get(vendedor_norm) if vendedor_norm else None

    tx_id = _sha256_tx(empresa_id, folio, fecha_tx, rut or "", producto or "", cantidad)

    return {
        "tx_id":           tx_id,
        "empresa_id":      empresa_id,
        "pais_id":         pais_id,
        "moneda":          moneda,
        "fecha_corte":     fecha_corte,
        "mes":             mes,
        "rut_cliente":     rut,
        "razon_social":    razon,
        "fecha_tx":        fecha_tx,
        "region":          region,
        "vendedor_raw":    vendedor,
        "vendedor_id":     vendedor_id,
        "tipo_cliente":    tipo_cliente,
        "producto":        producto,
        "unidad_negocio":  un,
        "tipo_doc":        tipo_doc,
        "folio":           folio,
        "unidad_medida":   um,
        "cantidad":        cantidad,
        "total_clp":       total,
        "precio_unitario": precio_u,
        "moneda_doc":      mon_doc,
        "pais_doc":        pais_doc,
        "fecha_venc":      fecha_vc,
        "negocio":         negocio,
        "comentarios":     coment,
        "fecha_guia":      fecha_g,
        "fecha_pago_fct":  fecha_pago,
        "pipeline_version": PIPELINE_VERSION,
        "archivo_fuente":  archivo_fuente,
    }


# ---------------------------------------------------------------------------
# Parser principal
# ---------------------------------------------------------------------------

def parse(registry_path: Path = REGISTRY_PATH) -> dict:
    """
    Carga el archivo vigente de VENTAS_CL, normaliza y persiste.
    Retorna informe técnico.
    """
    # 1. Leer registry
    with open(registry_path, encoding="utf-8") as f:
        registry = json.load(f)

    vigente_key = "VENTAS_CL|AGROCOMERCIAL_CL"
    vigente_fn  = registry["vigentes"].get(vigente_key)

    if not vigente_fn:
        raise RuntimeError(
            f"No hay archivo vigente para {vigente_key} en raw_registry.json. "
            "Ejecutar inbox_detector.py primero."
        )

    # Buscar metadata del archivo vigente
    meta = next(
        (a for a in registry["archivos"] if a["filename"] == vigente_fn),
        {}
    )
    empresa_id  = meta.get("empresa_id", "AGROCOMERCIAL_CL")
    pais_id     = meta.get("pais_id",    "CL")
    moneda      = meta.get("moneda",     "CLP")
    fecha_corte = meta.get("fecha_corte", "")

    # 2. Localizar Excel en /inbox
    excel_path = INBOX_PATH / vigente_fn
    if not excel_path.exists():
        raise FileNotFoundError(
            f"Archivo vigente no encontrado en inbox: {excel_path}\n"
            "Asegúrate de que /inbox está montado correctamente."
        )

    # 3. Abrir Excel
    wb = openpyxl.load_workbook(str(excel_path), read_only=True, data_only=True)
    ws = wb.active
    all_rows = list(ws.iter_rows(values_only=True))
    wb.close()

    # 4. Encontrar fila de header (primera fila con ≥5 celdas no-None)
    header_idx = None
    header_row = None
    for i, row in enumerate(all_rows[:15]):
        non_none = [c for c in row if c is not None]
        if len(non_none) >= 5:
            header_idx = i
            header_row = row
            break

    if header_row is None:
        raise RuntimeError(f"No se encontró fila de header en {vigente_fn}")

    # 5. Detectar esquema
    schema = detect_schema(header_row)

    informe: dict = {
        "archivo_leido":     vigente_fn,
        "version_detectada": schema,
        "empresa_id":        empresa_id,
        "pais_id":           pais_id,
        "moneda":            moneda,
        "fecha_corte":       fecha_corte,
        "filas_raw":         len(all_rows) - header_idx - 1,
        "filas_procesadas":  0,
        "filas_descartadas": 0,
        "motivos_descarte":  {},
        "vendedores_encontrados": [],
        "vendedores_sin_sic_id":  [],
        "total_clp":         0.0,
        "advertencias":      [],
        "output_parquet":    str(OUTPUT_PARQUET),
        "output_csv":        str(OUTPUT_CSV),
    }

    # Rechazar sumario (no es transaccional)
    if schema == "vSUMARIO":
        informe["advertencias"].append(
            "ESQUEMA_SUMARIO: archivo es presupuesto/cumplimiento, no transacciones. "
            "No se puede normalizar. Verificar clasificación en inbox_detector.py."
        )
        return informe

    if schema == "vDESCONOCIDO":
        informe["advertencias"].append(
            f"ESQUEMA_DESCONOCIDO: header no reconocido ({_header_ncols(header_row)} cols). "
            "No se procesaron filas."
        )
        return informe

    # 6. Iterar filas de datos
    records: list[dict] = []
    descarte: dict[str, int] = {}

    def _discard(reason: str):
        descarte[reason] = descarte.get(reason, 0) + 1

    data_rows = all_rows[header_idx + 1:]

    for row in data_rows:
        # Descartar filas vacías
        if all(c is None for c in row):
            _discard("fila_vacia")
            continue

        # Descartar filas de total / re-header
        mes_val = row[0]
        if mes_val is None:
            _discard("mes_nulo")
            continue
        if str(mes_val).strip().upper() in ("MES", "TOTAL", "TOTALES", "SUBTOTAL"):
            _discard("fila_total_o_header")
            continue

        # Extraer
        rec = _extract_row_v20(
            row, schema, empresa_id, pais_id, moneda, fecha_corte, vigente_fn
        )
        if rec is None:
            _discard("extraccion_fallida")
            continue

        # Validar campos mínimos
        if rec["vendedor_raw"] is None:
            _discard("vendedor_nulo")
            continue
        if rec["producto"] is None:
            _discard("producto_nulo")
            continue

        records.append(rec)

    # 7. Construir DataFrame
    df = pd.DataFrame(records)

    # Tipos explícitos
    date_cols = ["fecha_tx", "fecha_venc", "fecha_guia", "fecha_pago_fct"]
    for col in date_cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce")

    int_cols = ["folio"]
    for col in int_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").astype("Int64")

    float_cols = ["cantidad", "total_clp", "precio_unitario"]
    for col in float_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # 8. Validaciones
    # Vendedores únicos
    vendedores_raw = sorted(df["vendedor_raw"].dropna().str.upper().unique().tolist())
    vendedores_con_id  = [v for v in vendedores_raw if VENDEDOR_SIC.get(v)]
    vendedores_sin_id  = [v for v in vendedores_raw if not VENDEDOR_SIC.get(v)]

    if vendedores_sin_id:
        informe["advertencias"].append(
            f"VENDEDORES_SIN_SIC_ID ({len(vendedores_sin_id)}): {vendedores_sin_id}"
        )

    # Folio nulls
    n_folio_null = df["folio"].isna().sum()
    if n_folio_null > 0:
        informe["advertencias"].append(
            f"FOLIO_NULO: {n_folio_null} filas sin folio"
        )

    # tx_id duplicados
    n_dup = df["tx_id"].duplicated().sum()
    if n_dup > 0:
        informe["advertencias"].append(
            f"TX_ID_DUPLICADO: {n_dup} hash repetidos "
            "(posibles folios duplicados o filas idénticas)"
        )

    # Total CLP
    total_clp = df["total_clp"].sum()

    # 9. Persistir
    CANONICAL_DIR.mkdir(parents=True, exist_ok=True)
    df.to_parquet(str(OUTPUT_PARQUET), index=False, engine="pyarrow")
    df.to_csv(str(OUTPUT_CSV), index=False, encoding="utf-8-sig")

    # 10. Completar informe
    informe["filas_procesadas"]  = len(df)
    informe["filas_descartadas"] = sum(descarte.values())
    informe["motivos_descarte"]  = descarte
    informe["vendedores_encontrados"] = vendedores_raw
    informe["vendedores_sin_sic_id"]  = vendedores_sin_id
    informe["total_clp"] = float(total_clp)

    return informe


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def _fmt_informe(inf: dict) -> str:
    lines = [
        "=" * 66,
        "  AV LATAM · Ventas CL Parser  v" + PIPELINE_VERSION,
        "=" * 66,
        f"  Archivo leído      : {inf['archivo_leido']}",
        f"  Versión detectada  : {inf['version_detectada']}",
        f"  Empresa / País     : {inf['empresa_id']} / {inf['pais_id']}",
        f"  Moneda             : {inf['moneda']}",
        f"  Fecha de corte     : {inf['fecha_corte']}",
        "",
        f"  Filas raw          : {inf['filas_raw']}",
        f"  Filas procesadas   : {inf['filas_procesadas']}",
        f"  Filas descartadas  : {inf['filas_descartadas']}",
    ]
    if inf["motivos_descarte"]:
        for k, v in inf["motivos_descarte"].items():
            lines.append(f"    · {k}: {v}")
    lines += [
        "",
        f"  Total CLP          : $ {inf['total_clp']:>20,.0f}",
        "",
        f"  Vendedores ({len(inf['vendedores_encontrados'])}):",
    ]
    for v in inf["vendedores_encontrados"]:
        sic = VENDEDOR_SIC.get(v, "⚠ SIN ID")
        lines.append(f"    · {v:<30} → {sic}")
    if inf.get("advertencias"):
        lines.append("")
        lines.append(f"  ADVERTENCIAS ({len(inf['advertencias'])}):")
        for a in inf["advertencias"]:
            lines.append(f"    ⚠ {a}")
    lines += [
        "",
        f"  Output parquet     : {inf.get('output_parquet', 'N/A')}",
        f"  Output CSV         : {inf.get('output_csv', 'N/A')}",
        "=" * 66,
    ]
    return "\n".join(lines)


if __name__ == "__main__":
    try:
        informe = parse()
        print(_fmt_informe(informe))
        if not informe.get("filas_procesadas"):
            sys.exit(1)
    except Exception as exc:
        print(f"\n✗ ERROR: {exc}", file=sys.stderr)
        sys.exit(2)
