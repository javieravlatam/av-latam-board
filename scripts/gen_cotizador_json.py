#!/usr/bin/env python3
"""
gen_cotizador_json.py
=====================
Regenera apps/cotizador/data/productos_chile.json y productos_peru.json
desde data/master_prices.json (SSOT).

Este script es el ÚNICO que debe actualizar los JSONs del cotizador.
No modificar los JSONs manualmente — siempre regenerar con este script.

Pipeline:
  nuevo libro base AV 2026.xlsx
        ↓ (build_master_dataset.py)
  data/master_prices.json
        ↓ (este script)
  apps/cotizador/data/productos_chile.json
  apps/cotizador/data/productos_peru.json

Ejecutar: python3 scripts/gen_cotizador_json.py
"""
import json
import pathlib
import datetime
import re

ROOT    = pathlib.Path(__file__).parent.parent
DATA    = ROOT / 'data'
COTIZ   = ROOT / 'apps' / 'cotizador' / 'data'
MASTER  = DATA / 'master_prices.json'

# ─── Normalización de nombres (mantener compatibilidad con SIC y Panel IEC) ─

def _normalize_fmt(raw):
    """Normaliza formato: '20 L' → '20 L', '20L' → '20 L', '200 ML' → '200 ML'"""
    if not raw:
        return ''
    raw = str(raw).strip().upper()
    # Insertar espacio entre número y unidad si no existe
    raw = re.sub(r'^(\d+[\d.]*)\s*([A-Z]+)$', r'\1 \2', raw)
    return raw


def _sku_to_linea(sku):
    """Infiere línea comercial desde SKU o nombre."""
    if not sku:
        return 'Otro'
    sku = sku.upper()
    if 'AMI'  in sku: return 'AV Aminoácidos'
    if 'SUE'  in sku: return 'AV Suelos'
    if 'NUT'  in sku: return 'AV Nutrición'
    if 'PRO'  in sku: return 'AV Protección'
    if 'EST'  in sku: return 'AV Estimulantes'
    if 'EFI'  in sku: return 'AV Eficiencia'
    return 'AV Línea Base'


def _tamaño_fmt(formato):
    """Extrae valor numérico del formato para calcular precio_piso_presentación."""
    m = re.match(r'^([\d.]+)', str(formato).strip())
    return float(m.group(1)) if m else 1.0


def build_cotizador_entry(entry, precio_lista_promedio=None):
    """
    Convierte una entrada del master dataset al formato del cotizador.
    precio_lista_promedio: precio promedio real de venta (de avboard_data.js) — opcional.
    """
    pp = entry.get('precio_piso')
    fmt = entry.get('formato', '')
    tamano = _tamaño_fmt(fmt)
    costo_u = entry.get('costo_unitario')

    pp_presentacion     = round(pp * tamano, 2)  if pp  else None
    costo_presentacion  = round(costo_u * tamano, 2) if costo_u else None
    margen              = entry.get('margen_propuesto') or entry.get('margen_calc')

    return {
        'sku':          entry['sku'],
        'producto':     entry['producto'],
        'presentacion': fmt,
        'unidad':       _unidad(fmt),
        'precio_piso':  round(pp, 2) if pp else None,
        'costo_referencial': round(costo_u, 4) if costo_u else None,
        'margen_pct_ref':    round(margen, 4)  if margen else None,
        'estado':       entry.get('estado', 'ACTIVO'),
        'linea_comercial': _sku_to_linea(entry['sku']),
        'moneda':       entry.get('moneda', 'CLP'),
        'precio_lista_ref':  precio_lista_promedio,
        'precio_lista_nota': (
            'Referencial: precio promedio de venta YTD (avboard_data.js). '
            'Pendiente definir lista oficial.'
            if precio_lista_promedio else
            'Pendiente — regenerar con avboard_data.js disponible.'
        ),
        'tipo_precio':  _tipo_precio(fmt),
        'contenido_presentacion': tamano,
        'unidad_contenido': _unidad(fmt),
        'precio_piso_presentacion':      pp_presentacion,
        'precio_lista_presentacion':     round(precio_lista_promedio * tamano, 2) if precio_lista_promedio else None,
        'precio_objetivo_presentacion':  pp_presentacion,
        'costo_referencial_presentacion': costo_presentacion,
        'precio_piso_unitario':     round(pp, 2)     if pp else None,
        'precio_lista_unitario':    round(precio_lista_promedio, 2) if precio_lista_promedio else None,
        'costo_referencial_unitario': round(costo_u, 4) if costo_u else None,
        'precio_objetivo_unitario': round(pp, 2)     if pp else None,
    }


def _unidad(fmt):
    m = re.search(r'[A-Z]+$', str(fmt).strip().upper())
    return m.group(0) if m else 'L'


def _tipo_precio(fmt):
    u = _unidad(fmt)
    if u in ('L', 'ML'): return 'LITRO'
    if u in ('KG', 'GR', 'G'): return 'KILO'
    return 'UNIDAD'


def generate(master_path=MASTER):
    if not master_path.exists():
        print(f"❌ {master_path} no encontrado. Ejecutar primero: python3 scripts/build_master_dataset.py")
        return

    with open(master_path, encoding='utf-8') as f:
        master = json.load(f)

    meta = master.get('_meta', {})
    print(f"📦 Master dataset: {meta.get('fuente')} · {meta.get('version')}")
    print(f"   {meta.get('total_cl')} Chile · {meta.get('total_pe')} Perú")

    prods_cl = [e for e in master['productos'] if e['pais'] == 'CL']
    prods_pe = [e for e in master['productos'] if e['pais'] == 'PE']

    # Construir entradas cotizador
    cotiz_cl = [build_cotizador_entry(e) for e in prods_cl]
    cotiz_pe = [build_cotizador_entry(e) for e in prods_pe]

    # Guardar
    COTIZ.mkdir(parents=True, exist_ok=True)

    cl_path = COTIZ / 'productos_chile.json'
    pe_path = COTIZ / 'productos_peru.json'

    with open(cl_path, 'w', encoding='utf-8') as f:
        json.dump(cotiz_cl, f, ensure_ascii=False, indent=2)
    print(f"✅ {cl_path.name}: {len(cotiz_cl)} SKUs")

    with open(pe_path, 'w', encoding='utf-8') as f:
        json.dump(cotiz_pe, f, ensure_ascii=False, indent=2)
    print(f"✅ {pe_path.name}: {len(cotiz_pe)} SKUs")

    # Comparar con versión anterior
    print(f"\n📊 Resumen cambios:")
    print(f"   Chile: {len(cotiz_cl)} SKUs (antes: depende de versión anterior)")
    print(f"   Perú:  {len(cotiz_pe)} SKUs")
    print(f"\n⚠️  Ejecutar 'python3 scripts/test_precios_iec.py' para certificar.")


if __name__ == '__main__':
    generate()
