"""
vendors_catalog.py — AV LATAM Pipeline · Catálogo canónico de vendedores
=========================================================================
Fuente de verdad única para mappings de nombre → vendor_id en todo el pipeline.
Reemplaza los dicts hardcodeados rtc_map, vend_map_pe, VEND_ORDER.

REGLA: solo editar pipeline/vendors.json para agregar/retirar vendedores.
NO editar este archivo salvo para cambiar la lógica de carga.

Uso:
    from vendors_catalog import get_rtc_map, get_vend_map, get_vendor_order, normalize_vendor
"""

import json
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# RUTA AL CATÁLOGO
# ---------------------------------------------------------------------------
_CATALOG_PATH = Path(__file__).parent.parent / "pipeline" / "vendors.json"
_catalog_cache: Optional[dict] = None


def _load() -> dict:
    """Carga el catálogo desde disco (con caché en memoria por proceso)."""
    global _catalog_cache
    if _catalog_cache is not None:
        return _catalog_cache
    if not _CATALOG_PATH.exists():
        raise FileNotFoundError(
            f"vendors.json no encontrado en {_CATALOG_PATH}. "
            "El archivo debe existir en pipeline/vendors.json."
        )
    with open(_CATALOG_PATH, encoding="utf-8") as f:
        _catalog_cache = json.load(f)
    return _catalog_cache


def reload():
    """Fuerza recarga del catálogo (útil en tests)."""
    global _catalog_cache
    _catalog_cache = None
    return _load()


# ---------------------------------------------------------------------------
# API PÚBLICA
# ---------------------------------------------------------------------------

def get_rtc_map(pais: str) -> dict:
    """
    Retorna {ALIAS_UPPER: vendor_id} para el país dado.
    Equivale al rtc_map (CL) o vend_map_pe (PE) hardcodeados anteriormente.
    Incluye vendedores con estado='fusionado' (ej. navarro→aguirre) para que
    el parser los detecte — la fusión ocurre después en GG decisions.
    """
    cat = _load()
    result = {}
    for v in cat["vendors"]:
        if v["pais"] != pais:
            continue
        vid = v["vendor_id"]
        for alias in v.get("aliases", []):
            result[alias.upper()] = vid
        # Incluir nombre canónico como alias adicional
        result[v["nombre_canonico"].upper()] = vid
    return result


def get_vend_map(pais: str) -> dict:
    """
    Alias de get_rtc_map — mismo contrato, nombre alternativo usado en PE.
    """
    return get_rtc_map(pais)


def get_vendor_order(pais: str, *, exclude_states=None) -> list:
    """
    Retorna lista ordenada de vendor_ids por orden_visual para el país dado.
    Por defecto excluye estados: ['fusionado'].
    """
    if exclude_states is None:
        exclude_states = {"fusionado"}
    cat = _load()
    vendors = [
        v for v in cat["vendors"]
        if v["pais"] == pais and v.get("estado") not in exclude_states
        and v.get("orden_visual") is not None
    ]
    vendors_sorted = sorted(vendors, key=lambda v: v["orden_visual"])
    return [v["vendor_id"] for v in vendors_sorted]


def get_vendor_ids(pais: str, *, estado="activo") -> set:
    """
    Retorna el set de vendor_ids activos (o del estado indicado) para el país.
    """
    cat = _load()
    return {
        v["vendor_id"]
        for v in cat["vendors"]
        if v["pais"] == pais and (estado is None or v.get("estado") == estado)
    }


def normalize_vendor(nombre: str, pais: str) -> tuple:
    """
    Dado el nombre de un vendedor como aparece en el Excel, retorna (vendor_id, is_known).
    Si no se encuentra: retorna (nombre_original, False) — vendor desconocido.
    """
    rtc = get_rtc_map(pais)
    key = nombre.strip().upper()
    if key in rtc:
        return rtc[key], True
    return nombre, False


def get_all_vendor_ids(pais: str) -> set:
    """Retorna todos los vendor_ids del país (sin filtro de estado)."""
    cat = _load()
    return {v["vendor_id"] for v in cat["vendors"] if v["pais"] == pais}


def get_catalog_version() -> str:
    cat = _load()
    return cat.get("version", "unknown")


# ---------------------------------------------------------------------------
# FALLBACK LEGACY — solo se usa si vendors.json no existe
# ---------------------------------------------------------------------------

_LEGACY_RTC_CL = {
    'PABLO LARATRO': 'laratro',
    'FRANCISCO VELASQUEZ': 'velasquez',
    'JORGE CAROCA': 'caroca',
    'RODRIGO ENCINA': 'encina',
    'IVAN VEVERKA': 'veverka',
    'VALENTINA MUÑOZ': 'munoz',
    'RAYEN BERNAZAR': 'bernazar',
    'JAVIER ALMEIDA': 'almeida',
}

_LEGACY_VEND_PE = {
    'OSCAR INFANTE':         'infante',
    'NICOLL NAVARRO':        'navarro',
    'OMAR ATALAYA':          'atalaya',
    'ANTONIO GONZALES':      'gonzales',
    'LISBETH AGUIRRE':       'aguirre',
    'LIZBETH AGUIRRE':       'aguirre',
    'PATRICIA VALLADARES':   'valladares',
    'SUSAN DIAZ':            'diaz',
    'SUSAN DÍAZ':            'diaz',
    'MARTHA HIDALGO':        'martha',
    'MARTHA HIDALGO - KAM':  'martha',
}

_LEGACY_ORDER_PE = ['aguirre', 'atalaya', 'diaz', 'gonzales', 'infante', 'martha', 'valladares']


def get_rtc_map_safe(pais: str) -> tuple:
    """
    Como get_rtc_map pero con fallback legacy si vendors.json no existe.
    Retorna (map_dict, source) donde source='catalog'|'legacy'.
    """
    try:
        return get_rtc_map(pais), "catalog"
    except FileNotFoundError:
        print(f"   ⚠ vendors.json no encontrado — usando rtc_map LEGACY para {pais}")
        if pais == "CL":
            return dict(_LEGACY_RTC_CL), "legacy"
        elif pais == "PE":
            return dict(_LEGACY_VEND_PE), "legacy"
        return {}, "legacy"


def get_vendor_order_safe(pais: str) -> tuple:
    """
    Como get_vendor_order pero con fallback legacy.
    Retorna (order_list, source).
    """
    try:
        return get_vendor_order(pais), "catalog"
    except FileNotFoundError:
        print(f"   ⚠ vendors.json no encontrado — usando VEND_ORDER LEGACY para {pais}")
        if pais == "PE":
            return list(_LEGACY_ORDER_PE), "legacy"
        return [], "legacy"


if __name__ == "__main__":
    print(f"Catálogo v{get_catalog_version()}")
    print(f"\nCL rtc_map ({len(get_rtc_map('CL'))} aliases):")
    for k, v in sorted(get_rtc_map('CL').items()):
        print(f"  {k:<35} → {v}")
    print(f"\nPE vend_map ({len(get_rtc_map('PE'))} aliases):")
    for k, v in sorted(get_rtc_map('PE').items()):
        print(f"  {k:<35} → {v}")
    print(f"\nPE vendor_order: {get_vendor_order('PE')}")
