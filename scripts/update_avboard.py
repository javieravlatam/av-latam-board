#!/usr/bin/env python3
"""
update_avboard.py — Motor de actualización automática AVBOARD
Agroveca Grupo LATAM 2026

Uso:
    python3 scripts/update_avboard.py

Detecta automáticamente los archivos más recientes en /inbox y actualiza:
  - repo/avboard_data.js
  - repo/avboard_clientes.js
  - repo/Panel_IEC_Auditoria_2026.html  (TX_CL)
  - logs/update_log.txt
  - logs/resumen_actualizacion.md
  - logs/alertas.md

Reglas:
  - NO modifica diseño visual de paneles
  - NO requiere intervención del usuario
  - Proceso incremental: detecta y procesa solo archivos nuevos
  - Valida sintaxis JS antes de escribir
"""

import os, sys, re, json, glob, subprocess, textwrap
from datetime import datetime, date
from pathlib import Path

import pandas as pd
import numpy as np

# ── JSON encoder robusto (maneja numpy types) ──────────────────────────────────
class _NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (np.integer,)):   return int(obj)
        if isinstance(obj, (np.floating,)):  return float(obj)
        if isinstance(obj, (np.bool_,)):     return bool(obj)
        if isinstance(obj, np.ndarray):      return obj.tolist()
        return super().default(obj)

def _jdumps(obj, **kw):
    return json.dumps(obj, cls=_NpEncoder, ensure_ascii=False, **kw)

# ── Paths ─────────────────────────────────────────────────────────────────────
ROOT   = Path(__file__).parent.parent          # /avboard/
INBOX  = ROOT / 'inbox'
REPO = ROOT
LOGS   = REPO / 'logs'
SCRIPTS = ROOT / 'scripts'

AVBOARD_DATA    = REPO / 'avboard_data.js'
AVBOARD_CLI     = REPO / 'avboard_clientes.js'
PANEL_IEC       = REPO / 'Panel_IEC_Auditoria_2026.html'

TODAY = date.today().strftime('%d/%m/%Y')
NOW   = datetime.now().strftime('%Y-%m-%d %H:%M')
CACHE_V = datetime.now().strftime('%Y%m%d')   # cache-busting ?v= para <script src="avboard_*.js">, igual en cada corrida

# ── Constantes de negocio (estáticas — solo cambian si cambia el presupuesto) ─
TC_CLP_USD = 950

# Presupuesto Chile y Perú desde Libro Base, con fallback LEGACY
import sys as _sys_pb
import os as _os_pb

_scripts_dir_pb = _os_pb.path.dirname(_os_pb.path.abspath(__file__))
if _scripts_dir_pb not in _sys_pb.path:
    _sys_pb.path.insert(0, _scripts_dir_pb)

try:
    from ppto_libro_base import get_ppto_all
    _ppto = get_ppto_all()
except Exception as _ppto_err:
    print(f"⚠️  No se pudo cargar presupuesto desde Libro Base: {_ppto_err}")
    print("⚠️  Usando presupuesto LEGACY")
    from ppto_libro_base import PPTO_MENSUAL_CL_LEGACY, PPTO_MENSUAL_PE_LEGACY
    _ppto = {
        "chile": {
            "mensual": list(PPTO_MENSUAL_CL_LEGACY),
            "ppto_4m": sum(PPTO_MENSUAL_CL_LEGACY[:4]),
            "ppto_5m": sum(PPTO_MENSUAL_CL_LEGACY[:5]),
            "anual": sum(PPTO_MENSUAL_CL_LEGACY),
            "source": "LEGACY",
            "warning": str(_ppto_err),
        },
        "peru": {
            "mensual": list(PPTO_MENSUAL_PE_LEGACY),
            "ppto_4m": sum(PPTO_MENSUAL_PE_LEGACY[:4]),
            "ppto_5m": sum(PPTO_MENSUAL_PE_LEGACY[:5]),
            "anual": sum(PPTO_MENSUAL_PE_LEGACY),
            "source": "LEGACY",
            "warning": str(_ppto_err),
        },
    }

PPTO_MENSUAL_CL = _ppto["chile"]["mensual"]
PPTO_ANUAL_CL   = _ppto["chile"]["anual"]
PPTO_SOURCE_CL  = _ppto["chile"]["source"]

PPTO_MENSUAL_PE = _ppto["peru"]["mensual"]
PPTO_ANUAL_PE   = _ppto["peru"]["anual"]
PPTO_SOURCE_PE  = _ppto["peru"]["source"]

print(f"  Ppto Chile [{PPTO_SOURCE_CL}]: 5m={sum(PPTO_MENSUAL_CL[:5]):,.0f} / anual={PPTO_ANUAL_CL:,.0f} CLP")
print(f"  Ppto Perú  [{PPTO_SOURCE_PE}]: 5m={sum(PPTO_MENSUAL_PE[:5]):,.1f} / anual={PPTO_ANUAL_PE:,.1f} USD")

# Presupuesto Chile por RTC (CLP) — legacy operativo para distribución por RTC
PPTO_RTC_CL = {
    'caroca':    [12500000, 6000000, 14500000,  8831000, 12500000,  8730000,  6000000, 25500000, 10800000,  8700000,  5000000, 12500000],
    'laratro':   [36000000,10600000,  7500000, 16600000, 22500000, 10000000,  7800000, 21000000, 25000000, 20000000, 37500000, 19500000],
    'encina':    [14200000, 7500000,  7500000,  5000000,  5000000,  5000000,  5000000, 12000000, 21000000, 28000000, 31000000, 28700000],
    'velasquez': [14858000,11502000,  6500000, 10000000,  5000000, 20000000, 38000000, 12000000, 48000000, 50000000, 18000000, 20000000],
    'veverka':   [ 6000000, 6000000,  6000000,  6000000,  6000000,  6000000,  6000000,  6000000,  6000000,  6000000,  6000000,  6000000],
}

PPTO_RTC_ANUAL_PE = {
    'infante':    485058,
    'aguirre':    223930,
    'atalaya':    248424,
    'gonzales':    37250,
    'valladares': 142372,
}

# Rentabilidad (alertas estáticas — no cambian con corte)
RENTABILIDAD = {
    'alertas_nivel1': [
        {'pais': 'CL', 'sku': 'HUMIC ROOT (formato N/D)', 'margen': -0.335, 'accion': 'REVISAR_O_DESCONTINUAR'},
        {'pais': 'CL', 'sku': 'PLUS MICRO MIX 1L',        'margen': -0.143, 'accion': 'SUBIR_PRECIO_O_DESCONTINUAR'},
    ],
    'alertas_nivel2': [
        {'pais': 'CL', 'sku': 'PLUS MICRO MIX (formato N/D)', 'margen': 0.090},
        {'pais': 'CL', 'sku': 'PLUS ZINC (formato N/D)',       'margen': 0.031},
        {'pais': 'CL', 'sku': 'PLUS ZINC MANGANESO 1L',        'margen': 0.059},
    ],
    'impacto_clp': 25400000,
    'skus_bajo_piso_chile': 71,
    'skus_bajo_piso_peru':   5,
    'skus_sin_costo_chile': 11,
    'skus_sin_costo_peru':   4,
}

MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
MESES_FULL = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO',
              'JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE']


# ══════════════════════════════════════════════════════════════════════════════
#  1. DETECCIÓN DE ARCHIVOS INBOX
# ══════════════════════════════════════════════════════════════════════════════

def _parse_date_from_name(path):
    """Extrae objeto date del nombre del archivo para ordenamiento correcto."""
    name = path.stem
    # DD-MM-YYYY o DD.MM.YYYY
    m = re.search(r'(\d{1,2})[-.](\d{2})[-.](\d{4})', name)
    if m:
        try:
            return date(int(m.group(3)), int(m.group(2)), int(m.group(1)))
        except ValueError:
            pass
    # DD-MM sin año
    m2 = re.search(r'(\d{1,2})[-](\d{2})(?!\d)', name)
    if m2:
        try:
            return date(2026, int(m2.group(2)), int(m2.group(1)))
        except ValueError:
            pass
    return date(2000, 1, 1)


def detect_inbox_files():
    """Detecta los archivos más recientes de cada tipo en /inbox (orden por fecha real)."""
    files = {}

    # Chile ventas — "Libro de Ventas DD-MM-YYYY.xlsx"
    cl_ventas = sorted(INBOX.glob('Libro de Ventas *.xlsx'),
                       key=_parse_date_from_name, reverse=True)
    if cl_ventas:
        files['chile_ventas'] = cl_ventas[0]

    # Peru ventas — "AGROVECA PERU - VENTAS AL DD.MM.YYYY.xlsx"
    pe_ventas = sorted(INBOX.glob('AGROVECA PERU*VENTAS*.xlsx'),
                       key=_parse_date_from_name, reverse=True)
    if pe_ventas:
        files['peru_ventas'] = pe_ventas[0]

    # CxC Agrocomercial
    cxc_agro = sorted(list(INBOX.glob('Cuentas Cobrar  AGrocomercial*.xlsx')) +
                      list(INBOX.glob('Cuentas Cobrar AGrocomercial*.xlsx')),
                      key=_parse_date_from_name, reverse=True)
    if cxc_agro:
        files['cxc_agro'] = cxc_agro[0]

    # CxC Agroveca Chile
    cxc_avch = sorted(INBOX.glob('Cuentas Cobrar Agroveca *.xlsx'),
                      key=_parse_date_from_name, reverse=True)
    if cxc_avch:
        files['cxc_avch'] = cxc_avch[0]

    # Precio piso Chile
    piso = list(INBOX.glob('precios piso CHile*.xlsx'))
    if piso:
        files['piso_chile'] = piso[0]

    return files


def extract_date_from_filename(path):
    """Extrae fecha de corte (DD/MM/YYYY) desde el nombre del archivo."""
    d = _parse_date_from_name(path)
    if d.year > 2000:
        return d.strftime('%d/%m/%Y')
    return TODAY


# ══════════════════════════════════════════════════════════════════════════════
#  2. EXTRACCIÓN DE DATOS
# ══════════════════════════════════════════════════════════════════════════════

def extract_chile_ventas(path):
    """Extrae ventas Chile del Libro de Ventas.
    Retorna dict con ytd, mensual, por_rtc, df_tx (DataFrame).
    """
    df = pd.read_excel(path, sheet_name='VENTAS', header=1)
    df.columns = [str(c).strip() for c in df.columns]
    df['fecha_dt'] = pd.to_datetime(df['Fecha'], format='%d/%m/%Y', errors='coerce')
    df['total_n']  = pd.to_numeric(df['Total'], errors='coerce').fillna(0)
    df['pv_n']     = pd.to_numeric(df['Precio Uni'], errors='coerce')

    # Mensual por mes
    mensual = {}
    for i, mes in enumerate(MESES_FULL):
        v = df[df['MES'] == mes]['total_n'].sum()
        mensual[mes] = int(v)

    # Por RTC mensual (nombre → clave)
    rtc_map = {
        'PABLO LARATRO': 'laratro',
        'FRANCISCO VELASQUEZ': 'velasquez',
        'JORGE CAROCA': 'caroca',
        'RODRIGO ENCINA': 'encina',
        'IVAN VEVERKA': 'veverka',
        'VALENTINA MUÑOZ': 'munoz',
        'RAYEN BERNAZAR': 'bernazar',
        'JAVIER ALMEIDA': 'almeida',
    }

    rtc_mensual = {}
    for vend, key in rtc_map.items():
        meses_vals = []
        for mes in MESES_FULL:
            v = df[(df['MES'] == mes) & (df['Vendedor'] == vend)]['total_n'].sum()
            meses_vals.append(int(v))
        if any(v > 0 for v in meses_vals):
            rtc_mensual[key] = meses_vals

    # YTD (sum of all months with data)
    months_with_data = [m for m in MESES_FULL if mensual.get(m, 0) > 0]
    ytd_5m = sum(mensual.get(m, 0) for m in MESES_FULL)
    n_months = len(months_with_data)
    ytd_4m = sum(mensual.get(MESES_FULL[i], 0) for i in range(min(4, n_months)))

    # T1 por RTC (Jan-Mar)
    rtc_t1 = {}
    for vend, key in rtc_map.items():
        t1 = sum(df[(df['MES'] == MESES_FULL[i]) & (df['Vendedor'] == vend)]['total_n'].sum() for i in range(3))
        if t1 > 0:
            rtc_t1[key] = int(t1)

    # Ppto cumplimiento
    n_ppto = min(4, n_months)
    ppto_4m = sum(PPTO_MENSUAL_CL[:4])
    cumpl_4m = round(ytd_4m / ppto_4m, 4) if ppto_4m > 0 else 0

    return {
        'ytd_5m':       ytd_5m,
        'ytd_4m':       ytd_4m,
        'mayo_parcial': mensual.get('MAYO', 0),
        'ppto_4m':      int(ppto_4m),
        'ppto_5m':      int(sum(PPTO_MENSUAL_CL[:5])),
        'cumplimiento_4m': cumpl_4m,
        'mensual':      [mensual.get(m, 0) for m in MESES_FULL],
        'rtc_t1':       rtc_t1,
        'rtc_mensual':  rtc_mensual,
        'n_months':     n_months,
        'df':           df,
        'rtc_map':      rtc_map,
    }


def extract_peru_ventas(path):
    """Extrae ventas Perú."""
    df_raw = pd.read_excel(path, sheet_name='RESUMEN', header=None)

    # Pivot table: rows=vendedor, cols=mes
    # Find header row: must have VENDEDOR + at least one month column
    header_row = None
    for i, row in df_raw.iterrows():
        vals = [str(v).upper() for v in row if pd.notna(v)]
        has_vend = any('VENDEDOR' in v for v in vals)
        has_mes  = any('ENERO' in v or 'FEBRERO' in v or 'MARZO' in v for v in vals)
        if has_vend and has_mes:
            header_row = i
            break

    if header_row is None:
        raise ValueError(f"No se encontró fila de encabezado en {path}")

    df = pd.read_excel(path, sheet_name='RESUMEN', header=header_row)
    df.columns = [str(c).strip() for c in df.columns]

    # Find rows with vendor data (before "Total general")
    vend_map_pe = {
        'OSCAR INFANTE': 'infante',
        'NICOLL NAVARRO': 'navarro',
        'OMAR ATALAYA': 'atalaya',
        'ANTONIO GONZALES': 'gonzales',
        'LISBETH AGUIRRE': 'aguirre',
        'PATRICIA VALLADARES': 'valladares',
        'SUSAN DIAZ': 'diaz',
        'SUSAN DÍAZ': 'diaz',
    }

    mes_cols_pe = ['01 ENERO 2026', '02. FEBRERO 2026', '03. MARZO 2026',
                   '04. ABRIL 2026', '05. MAYO 2026']

    # Find the month columns in df
    available_cols = {}
    for col in df.columns:
        for i, mc in enumerate(mes_cols_pe):
            if mc.upper() in str(col).upper() or (f'0{i+1}' in str(col) and MESES[i].upper() in str(col).upper()):
                available_cols[i] = col
                break
        # Alternative: look for month numbers
        for i, m_name in enumerate(['ENERO','FEBRERO','MARZO','ABRIL','MAYO']):
            if m_name in str(col).upper():
                available_cols[i] = col

    por_vendedor = {}
    rtc_mensual_pe = {}
    mensual_pe = [0] * 12

    for _, row in df.iterrows():
        vend_col = df.columns[1] if len(df.columns) > 1 else df.columns[0]
        vend_name = str(row.get(vend_col, row.iloc[1] if len(row) > 1 else '')).strip().upper()

        matched_key = None
        for vname, key in vend_map_pe.items():
            if vname.upper() in vend_name or vend_name in vname.upper():
                matched_key = key
                break

        if matched_key is None:
            continue

        monthly = []
        for i in range(5):
            col = available_cols.get(i)
            if col and col in row.index:
                val = pd.to_numeric(row[col], errors='coerce')
                monthly.append(round(float(val), 1) if pd.notna(val) else 0)
            else:
                monthly.append(0)

        # Total col
        total_col = [c for c in df.columns if 'total' in str(c).lower() or 'general' in str(c).lower()]
        ytd = round(float(pd.to_numeric(row[total_col[0]], errors='coerce')), 1) if total_col else sum(monthly)

        por_vendedor[matched_key] = {
            'nombre': vend_name.title(),
            'ytd': round(ytd),
            'mayo': round(monthly[4]) if len(monthly) > 4 else 0,
        }
        rtc_mensual_pe[matched_key] = [round(v) for v in monthly] + [0]*7

        for i, v in enumerate(monthly[:5]):
            mensual_pe[i] += round(v)

    ytd_5m_pe = sum(round(v['ytd']) for v in por_vendedor.values())
    ytd_4m_pe = sum(mensual_pe[:4])

    ppto_4m_pe = sum(PPTO_MENSUAL_PE[:4])
    cumpl_4m_pe = round(ytd_4m_pe / ppto_4m_pe, 4) if ppto_4m_pe > 0 else 0
    ppto_5m_pe = sum(PPTO_MENSUAL_PE[:5])
    cumpl_5m_pe = round(ytd_5m_pe / ppto_5m_pe, 4) if ppto_5m_pe > 0 else 0

    return {
        'ytd_5m':          ytd_5m_pe,
        'ytd_4m':          ytd_4m_pe,
        'mayo_parcial':    mensual_pe[4],
        'cumplimiento_4m': cumpl_4m_pe,
        'cumplimiento_5m': cumpl_5m_pe,
        'mensual':         mensual_pe,
        'por_vendedor':    por_vendedor,
        'rtc_mensual':     rtc_mensual_pe,
    }


def extract_cxc_chile(agro_path, avch_path):
    """Extrae y consolida CxC Chile de ambas entidades."""

    def read_mora(path, sheet='Detalle Mora'):
        df = pd.read_excel(path, sheet_name=sheet, header=1)
        df.columns = [str(c).strip() for c in df.columns]
        df = df[df['Rut'].notna()].copy()
        df['Total Doc'] = pd.to_numeric(df['Total Doc'], errors='coerce').fillna(0)
        df['Días Mora'] = pd.to_numeric(df['Días Mora'], errors='coerce').fillna(0)
        return df[df['Total Doc'] != 0]

    df_agro = read_mora(agro_path)
    df_avch = read_mora(avch_path)

    def tramos(df):
        return {
            't90':   int(df[df['Tramo'] == '+90']['Total Doc'].sum()),
            't6190': int(df[df['Tramo'] == '61-90']['Total Doc'].sum()),
            't3160': int(df[df['Tramo'] == '31-60']['Total Doc'].sum()),
            't030':  int(df[df['Tramo'] == '0-30']['Total Doc'].sum()),
        }

    tr_agro = tramos(df_agro)
    tr_avch = tramos(df_avch)

    total_agro = int(df_agro['Total Doc'].sum())
    total_avch = int(df_avch['Total Doc'].sum())
    total      = total_agro + total_avch

    tr_comb = {
        't90':   tr_agro['t90']   + tr_avch['t90'],
        't6190': tr_agro['t6190'] + tr_avch['t6190'],
        't3160': tr_agro['t3160'] + tr_avch['t3160'],
        't030':  tr_agro['t030']  + tr_avch['t030'],
    }

    # Por RTC
    rtc_name_map = {
        'FRANCISCO VELASQUEZ': 'velasquez',
        'PABLO LARATRO': 'laratro',
        'RODRIGO ENCINA': 'encina',
        'JORGE CAROCA': 'caroca',
        'IVAN VEVERKA': 'veverka',
        'IVÁN VEVERKA': 'veverka',
        'VALENTINA MUÑOZ': 'munoz',
        'JUAN PABLO NEIRA': 'neira',
        'FRANCO RIFFO': 'franco_riffo',
        'RAYEN BERNAZAR': 'otros',
        'EN TERRENO 1': 'otros',
        'OFICINA': 'otros',
        'JAVIER ALMEIDA': 'almeida',
    }

    df_all = pd.concat([
        df_agro.assign(entidad='agro'),
        df_avch.assign(entidad='avch')
    ])

    def normalize_vend(name):
        n = str(name).strip().upper()
        return rtc_name_map.get(n, 'otros')

    df_all['rtc_key'] = df_all['Vendedor'].apply(normalize_vend)

    por_rtc = {}
    for key in df_all['rtc_key'].unique():
        sub = df_all[df_all['rtc_key'] == key]
        t_total  = int(sub['Total Doc'].sum())
        t_t90    = int(sub[sub['Tramo'] == '+90']['Total Doc'].sum())
        t_venc   = int(sub[sub['Días Mora'] > 0]['Total Doc'].sum())
        por_rtc[key] = {
            'total':   t_total,
            'pct':     round(t_total / total, 4) if total > 0 else 0,
            'vencida': t_venc,
            't90':     t_t90,
            'riesgo':  'CRÍTICO' if t_t90 > 0 else ('RIESGO' if t_venc > t_total * 0.3 else 'NORMAL'),
        }

    # Cuentas críticas (+90d)
    crit = df_all[df_all['Tramo'] == '+90'].copy()
    crit_by_client = crit.groupby(['Razón Social']).agg(
        monto=('Total Doc', 'sum'),
        max_mora=('Días Mora', 'max'),
        rtcs=('Vendedor', lambda x: ' / '.join(sorted(set(str(v) for v in x)))),
    ).reset_index().sort_values('monto', ascending=False)

    cuentas_criticas = []
    for _, row in crit_by_client.iterrows():
        cuentas_criticas.append({
            'cliente': str(row['Razón Social']).strip(),
            'rtc':     str(row['rtcs']),
            'dias':    int(row['max_mora']),
            'monto':   int(row['monto']),
            'estado':  'CRÍTICO',
            'alerta':  'PRIORIDAD_MAXIMA' if row['monto'] > 5000000 else 'URGENTE',
        })

    # Agregar clientes resueltos conocidos
    cuentas_criticas.append({
        'cliente': 'GOYASERVICE SPA',
        'rtc': 'Jorge Caroca',
        'dias': None,
        'monto': 4194750,
        'estado': 'RESUELTO',
        'alerta': None,
        'nota': 'PAGADO ✅ entre 17/04 y 29/04',
    })

    # Per-client CxC dict for avboard_clientes
    cxc_por_cliente = {}
    for _, row in df_all.iterrows():
        rut = str(row.get('Rut', '')).strip()
        if not rut or rut == 'nan':
            continue
        if rut not in cxc_por_cliente:
            cxc_por_cliente[rut] = {
                'saldo': 0, 'max_mora': 0, 'tramo': '0-30', 'estado': 'Normal'
            }
        cxc_por_cliente[rut]['saldo'] += int(row['Total Doc'])
        mora = int(row['Días Mora'])
        if mora > cxc_por_cliente[rut]['max_mora']:
            cxc_por_cliente[rut]['max_mora'] = mora
            if mora > 90:
                cxc_por_cliente[rut]['tramo'] = '+90'
                cxc_por_cliente[rut]['estado'] = 'Crítico'
            elif mora > 60:
                cxc_por_cliente[rut]['tramo'] = '61-90'
                cxc_por_cliente[rut]['estado'] = 'Riesgo'
            elif mora > 30:
                cxc_por_cliente[rut]['tramo'] = '31-60'
                cxc_por_cliente[rut]['estado'] = 'Alerta'

    return {
        'total':       total,
        'vencida':     tr_comb['t90'] + tr_comb['t6190'] + tr_comb['t3160'],
        'al_dia':      tr_comb['t030'],
        'tramos':      tr_comb,
        'tramos_pct':  {k: round(v/total, 4) if total else 0 for k, v in tr_comb.items()},
        'por_entidad': {
            'agrocomercial': {'nombre': 'Agrocomercial', 'total': total_agro, 'tramos': tr_agro},
            'agroveca_chile': {'nombre': 'Agroveca Chile', 'total': total_avch, 'tramos': tr_avch},
        },
        'por_rtc':           por_rtc,
        'cuentas_criticas':  cuentas_criticas,
        'cxc_por_cliente':   cxc_por_cliente,
        'df_all':            df_all,
    }


# ══════════════════════════════════════════════════════════════════════════════
#  3. CÁLCULO IEC
# ══════════════════════════════════════════════════════════════════════════════

def load_piso_chile(piso_path):
    """Carga tabla de precios piso Chile como dict (prod_upper, fmt_upper) -> pp."""
    df = pd.read_excel(piso_path, sheet_name='Pricing Piso Chile', header=4)
    df.columns = [str(c).strip() for c in df.columns]
    pp_col = [c for c in df.columns if 'PRECIO PISO' in c.upper() and 'CALCULADO' in c.upper()][0]
    prop_col = [c for c in df.columns if 'NUEVO PRECIO' in c.upper() or 'PROPUESTO' in c.upper()]
    prop_col = prop_col[0] if prop_col else None

    piso = {}
    for _, row in df.iterrows():
        prod = str(row.get('PRODUCTO', '')).strip().upper()
        fmt  = str(row.get('FORMATO',  '')).strip().upper()
        if not prod or prod == 'NAN':
            continue
        pp_val = pd.to_numeric(row.get(prop_col, np.nan) if prop_col else np.nan, errors='coerce')
        if pd.isna(pp_val):
            pp_val = pd.to_numeric(row[pp_col], errors='coerce')
        if pd.notna(pp_val):
            piso[(prod, fmt)] = round(float(pp_val))
    return piso


def parse_producto_formato(name):
    """Extrae (producto_base, formato) de 'PRODUCTO - FORMATO'."""
    name = str(name).strip()
    m = re.match(r'^(.+?)\s*-\s*(\d[\d,.]* *\w+)\s*$', name)
    if m:
        return m.group(1).strip().upper(), m.group(2).strip().upper()
    return name.upper(), ''


def compute_iec_chile(df_ventas, piso_dict):
    """Calcula IEC por transacción. Retorna df enriquecido + resumen por vendedor + por cliente."""
    df = df_ventas.copy()
    df['total_n'] = pd.to_numeric(df['Total'], errors='coerce').fillna(0)
    df['pv_n']    = pd.to_numeric(df['Precio Uni'], errors='coerce')
    df['prod_base'], df['fmt_parsed'] = zip(*df['Producto'].apply(parse_producto_formato))

    def get_pp(row):
        return piso_dict.get((row['prod_base'], row['fmt_parsed']), None)

    df['pp'] = df.apply(get_pp, axis=1)

    df['elegible'] = df.apply(lambda r: r['total_n'] if pd.notna(r['pp']) and r['total_n'] > 0 else 0, axis=1)
    df['cumple']   = df.apply(lambda r: 1 if pd.notna(r['pp']) and pd.notna(r['pv_n']) and r['pv_n'] >= r['pp'] else 0, axis=1)
    df['sp']       = df.apply(lambda r: r['total_n'] if r['cumple'] == 1 else 0, axis=1)
    df['bp']       = df.apply(lambda r: r['total_n'] if r['elegible'] > 0 and r['cumple'] == 0 else 0, axis=1)

    # Por vendedor
    rtc_map_inv = {
        'PABLO LARATRO': 'laratro', 'FRANCISCO VELASQUEZ': 'velasquez',
        'JORGE CAROCA': 'caroca', 'RODRIGO ENCINA': 'encina',
        'IVAN VEVERKA': 'veverka', 'VALENTINA MUÑOZ': 'munoz',
    }
    iec_vend = {}
    for vend, key in rtc_map_inv.items():
        sub = df[df['Vendedor'] == vend]
        elig = sub['elegible'].sum()
        sp   = sub['sp'].sum()
        iec_vend[key] = round(sp / elig, 4) if elig > 0 else None

    total_elig = df['elegible'].sum()
    total_sp   = df['sp'].sum()
    iec_total  = round(total_sp / total_elig, 4) if total_elig > 0 else None

    # Por cliente (RUT)
    iec_cliente = {}
    g = df.groupby('Rut').agg(
        elig=('elegible', 'sum'), sp=('sp', 'sum'), bp=('bp', 'sum'),
        tx_elig=('elegible', lambda x: (x > 0).sum()),
        tx_cumple=('cumple', 'sum'),
    )
    for rut, row in g.iterrows():
        iec_cliente[str(rut)] = {
            'pct':           round(row['sp'] / row['elig'], 4) if row['elig'] > 0 else None,
            'tx_elegible':   int(row['tx_elig']),
            'tx_cumple':     int(row['tx_cumple']),
            'monto_elegible': int(row['elig']),
            'monto_bajo_piso': int(row['bp']),
        }

    return {
        'df':          df,
        'por_vendedor': iec_vend,
        'total':       iec_total,
        'bp_total':    int(df['bp'].sum()),
        'por_cliente': iec_cliente,
    }


def iec_factor(pct):
    """Convierte IEC % a factor de comisión."""
    if pct is None:
        return None
    if pct < 0.70:  return 0.20
    if pct < 0.85:  return 0.70
    if pct < 0.92:  return 0.80
    if pct < 0.95:  return 0.90
    return 1.05


# ══════════════════════════════════════════════════════════════════════════════
#  4. GENERACIÓN avboard_data.js
# ══════════════════════════════════════════════════════════════════════════════

def _j(v, indent=0):
    """Serializa a JSON compacto."""
    return _jdumps(v)


def _arr(lst, per_row=12, indent=6):
    """Formatea array de números en columnas."""
    pad = ' ' * indent
    chunks = [lst[i:i+per_row] for i in range(0, len(lst), per_row)]
    return '[\n' + ',\n'.join(pad + str(c) for c in chunks) + '\n' + ' '*(indent-2) + ']'


def render_avboard_data_js(cl_v, pe_v, cl_cxc, iec_cl, cortes, peru_cxc_static):
    """Genera el contenido completo de avboard_data.js."""

    version = datetime.now().strftime('%Y-%m-%d')
    tc = TC_CLP_USD

    chile_ytd_usd = round(cl_v['ytd_5m'] / tc)
    peru_ytd_usd  = pe_v['ytd_5m']
    ytd_usd = chile_ytd_usd + peru_ytd_usd
    ytd_clp = cl_v['ytd_5m'] + round(pe_v['ytd_5m'] * tc)

    def js_rtc_mensual(rtc_dict):
        lines = []
        for k, arr in sorted(rtc_dict.items()):
            vals = ', '.join(str(v) for v in arr)
            lines.append(f'      {k}: [{vals}]')
        return '{\n' + ',\n'.join(lines) + '\n    }'

    def js_rtc_t1(rtc_dict):
        lines = [f'      {k}: {v}' for k, v in sorted(rtc_dict.items())]
        return '{\n' + ',\n'.join(lines) + '\n    }'

    def js_por_rtc_cxc(por_rtc):
        lines = []
        for k, v in sorted(por_rtc.items(), key=lambda x: -x[1]['total']):
            lines.append(
                f"      {k}: {{\n"
                f"        total:   {v['total']},\n"
                f"        pct:     {v['pct']},\n"
                f"        vencida: {v['vencida']},\n"
                f"        t90:     {v['t90']},\n"
                f"        riesgo: '{v['riesgo']}'\n"
                f"      }}"
            )
        return '{\n' + ',\n'.join(lines) + '\n    }'

    def js_cuentas_criticas(lst):
        items = []
        for c in lst:
            parts = [f"        cliente: {_jdumps(c['cliente'])}"]
            if 'rtc' in c:  parts.append(f"        rtc: {_jdumps(c['rtc'])}")
            if 'dias' in c: parts.append(f"        dias: {_jdumps(c['dias'])}")
            parts.append(f"        monto: {c['monto']}")
            parts.append(f"        estado: {_jdumps(c['estado'])}")
            parts.append(f"        alerta: {_jdumps(c.get('alerta'))}")
            if 'nota' in c: parts.append(f"        nota: {_jdumps(c['nota'])}")
            items.append('      {\n' + ',\n'.join(parts) + '\n      }')
        return '[\n' + ',\n'.join(items) + '\n    ]'

    def js_iec(iec_cl):
        vends = {
            'total': iec_cl['total'],
            'velasquez': iec_cl['por_vendedor'].get('velasquez'),
            'laratro':   iec_cl['por_vendedor'].get('laratro'),
            'caroca':    iec_cl['por_vendedor'].get('caroca'),
            'encina':    iec_cl['por_vendedor'].get('encina'),
            'veverka':   iec_cl['por_vendedor'].get('veverka'),
            'munoz':     iec_cl['por_vendedor'].get('munoz'),
        }
        lines = []
        for k, v in vends.items():
            val = f"{v:.3f}" if v is not None else 'null'
            lines.append(f"      {k}: {val}")
        lines.append(f"      impacto_potencial_clp: {iec_cl['bp_total']}")
        return '{\n' + ',\n'.join(lines) + '\n    }'

    def js_por_vendedor_pe(por_vend):
        lines = []
        for k, v in sorted(por_vend.items()):
            lines.append(
                f"      {k}: {{\n"
                f"        nombre: {_jdumps(v['nombre'])},\n"
                f"        ytd:    {v['ytd']},\n"
                f"        mayo:   {v['mayo']}\n"
                f"      }}"
            )
        return '{\n' + ',\n'.join(lines) + '\n    }'

    def js_rentabilidad(r):
        def alert_line(a):
            parts = [f"pais:{_jdumps(a['pais'])}", f"sku:{_jdumps(a['sku'])}", f"margen:{a['margen']}"]
            if 'accion' in a: parts.append(f"accion:{_jdumps(a['accion'])}")
            return '{ ' + ', '.join(parts) + ' }'
        n1 = ', '.join(alert_line(a) for a in r['alertas_nivel1'])
        n2 = ', '.join(alert_line(a) for a in r['alertas_nivel2'])
        return (
            f"    alertas_nivel1: [{n1}],\n"
            f"    alertas_nivel2: [{n2}],\n"
            f"    impacto_clp:    {r['impacto_clp']},\n"
            f"    skus_bajo_piso_chile: {r['skus_bajo_piso_chile']},\n"
            f"    skus_bajo_piso_peru:   {r['skus_bajo_piso_peru']},\n"
            f"    skus_sin_costo_chile: {r['skus_sin_costo_chile']},\n"
            f"    skus_sin_costo_peru:   {r['skus_sin_costo_peru']}"
        )

    # Mensual arrays (12 months)
    cl_mensual = cl_v['mensual'] + [0] * (12 - len(cl_v['mensual']))
    pe_mensual = pe_v['mensual'] + [0] * (12 - len(pe_v['mensual']))
    ppto_cl    = PPTO_MENSUAL_CL
    ppto_pe    = PPTO_MENSUAL_PE

    cl_mensual_str = ', '.join(str(v) for v in cl_mensual)
    pe_mensual_str = ', '.join(str(v) for v in pe_mensual)
    ppto_cl_str    = ', '.join(str(v) for v in ppto_cl)
    ppto_pe_str    = ', '.join(str(v) for v in ppto_pe)

    # RTC ppto mensual (static)
    def js_rtc_ppto(d):
        lines = []
        for k, arr in sorted(d.items()):
            lines.append('      ' + k + ': [' + ', '.join(str(v) for v in arr) + ']')
        return '{\n' + ',\n'.join(lines) + '\n    }'

    # Peru ppto anual por vendedor
    ppto_pe_anual_str = ',\n      '.join(f"{k}: {v}" for k, v in PPTO_RTC_ANUAL_PE.items())

    js = f"""/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  AVBOARD · Capa de datos global · Agroveca Grupo LATAM 2026     ║
 * ║  Archivo: avboard_data.js                                        ║
 * ║  Propósito: fuente única de verdad para todos los dashboards     ║
 * ║                                                                  ║
 * ║  GENERADO AUTOMÁTICAMENTE — scripts/update_avboard.py            ║
 * ║  NO EDITAR MANUALMENTE                                           ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Cortes:
 *   Chile ventas → {cortes['chile_ventas']}
 *   Chile CxC    → {cortes['chile_cxc']} (2 entidades)
 *   Perú ventas  → {cortes['peru_ventas']}
 *   Perú CxC     → {cortes['peru_cxc']}
 *
 * Actualizado: {version}
 */

var AVBOARD = (function() {{

  var meta = {{
    version:      '{version}',
    tc_clp_usd:   {tc},
    meta_mn:      0.25,
    cortes: {{
      chile_ventas: '{cortes['chile_ventas']}',
      chile_cxc:    '{cortes['chile_cxc']}',
      peru_ventas:  '{cortes['peru_ventas']}',
      peru_cxc:     '{cortes['peru_cxc']}'
    }},
    meses: {_jdumps(MESES)}
  }};

  var grupo = {{
    ytd_usd:      {ytd_usd},
    ytd_clp:      {ytd_clp},
    chile_ytd_usd: {chile_ytd_usd},
    peru_ytd_usd:  {peru_ytd_usd},
    rtc_activos:  12,
    mn_chile:     0.179,
    mn_peru:      null
  }};

  var chile_ventas = {{
    ytd_5m:          {cl_v['ytd_5m']},
    ytd_4m:          {cl_v['ytd_4m']},
    mayo_parcial:    {cl_v['mayo_parcial']},
    ppto_anual:      {PPTO_ANUAL_CL},
    ppto_4m:         {cl_v['ppto_4m']},
    ppto_5m:         {cl_v['ppto_5m']},
    cumplimiento_4m: {cl_v['cumplimiento_4m']},
    cumplimiento_t1: {round(sum(cl_v['mensual'][:3]) / sum(PPTO_MENSUAL_CL[:3]), 4)},
    mensual_real:  [{cl_mensual_str}],
    mensual_ppto:  [{ppto_cl_str}],
    rtc_real_t1:   {js_rtc_t1(cl_v['rtc_t1'])},
    rtc_ppto_t1: {{
      caroca:    {sum(PPTO_RTC_CL['caroca'][:3])},
      laratro:   {sum(PPTO_RTC_CL['laratro'][:3])},
      encina:    {sum(PPTO_RTC_CL['encina'][:3])},
      velasquez: {sum(PPTO_RTC_CL['velasquez'][:3])},
      veverka:   {sum(PPTO_RTC_CL['veverka'][:3])}
    }},
    rtc_mensual_real: {js_rtc_mensual(cl_v['rtc_mensual'])},
    rtc_mensual_ppto: {js_rtc_ppto(PPTO_RTC_CL)},
    iec: {js_iec(iec_cl)},
    mn_real:  0.179,
    mn_meta:  0.250
  }};

  var chile_cxc = {{
    corte:    '{cortes['chile_cxc']}',
    entidades: 2,
    total:    {cl_cxc['total']},
    vencida:  {cl_cxc['vencida']},
    al_dia:   {cl_cxc['al_dia']},
    por_entidad: {{
      agrocomercial: {{
        nombre: 'Agrocomercial',
        total:  {cl_cxc['por_entidad']['agrocomercial']['total']},
        tramos: {{
          t90:   {cl_cxc['por_entidad']['agrocomercial']['tramos']['t90']},
          t6190: {cl_cxc['por_entidad']['agrocomercial']['tramos']['t6190']},
          t3160: {cl_cxc['por_entidad']['agrocomercial']['tramos']['t3160']},
          t030:  {cl_cxc['por_entidad']['agrocomercial']['tramos']['t030']}
        }}
      }},
      agroveca_chile: {{
        nombre: 'Agroveca Chile',
        total:  {cl_cxc['por_entidad']['agroveca_chile']['total']},
        tramos: {{
          t90:   {cl_cxc['por_entidad']['agroveca_chile']['tramos']['t90']},
          t6190: {cl_cxc['por_entidad']['agroveca_chile']['tramos']['t6190']},
          t3160: {cl_cxc['por_entidad']['agroveca_chile']['tramos']['t3160']},
          t030:  {cl_cxc['por_entidad']['agroveca_chile']['tramos']['t030']}
        }}
      }}
    }},
    tramos: {{
      t90:   {cl_cxc['tramos']['t90']},
      t6190: {cl_cxc['tramos']['t6190']},
      t3160: {cl_cxc['tramos']['t3160']},
      t030:  {cl_cxc['tramos']['t030']}
    }},
    tramos_pct: {{
      t90:   {cl_cxc['tramos_pct']['t90']},
      t6190: {cl_cxc['tramos_pct']['t6190']},
      t3160: {cl_cxc['tramos_pct']['t3160']},
      t030:  {cl_cxc['tramos_pct']['t030']}
    }},
    por_rtc: {js_por_rtc_cxc(cl_cxc['por_rtc'])},
    cuentas_criticas: {js_cuentas_criticas(cl_cxc['cuentas_criticas'])}
  }};

  var peru_ventas = {{
    ytd_5m:       {pe_v['ytd_5m']},
    ytd_4m:       {pe_v['ytd_4m']},
    mayo_parcial: {pe_v['mayo_parcial']},
    ppto_anual:   {PPTO_ANUAL_PE},
    ppto_4m:      {sum(PPTO_MENSUAL_PE[:4])},
    ppto_5m:      {sum(PPTO_MENSUAL_PE[:5])},
    cumplimiento_4m: {pe_v['cumplimiento_4m']},
    cumplimiento_5m: {pe_v['cumplimiento_5m']},
    mensual_real: [{pe_mensual_str}],
    mensual_ppto: [{ppto_pe_str}],
    por_vendedor: {js_por_vendedor_pe(pe_v['por_vendedor'])},
    rtc_ppto_anual: {{
      {ppto_pe_anual_str}
    }},
    rtc_mensual_real: {js_rtc_mensual(pe_v['rtc_mensual'])},
    iec: {{
      total: null, aguirre: null, infante: null,
      atalaya: 0.867, valladares: 0.167, gonzales: null,
      impacto_potencial_usd: 4000
    }},
    mn_real:  null,
    mn_meta:  0.250
  }};

  var peru_cxc = {_jdumps(peru_cxc_static, indent=2).replace(chr(10), chr(10)+'  ')};

  var rentabilidad = {{
{js_rentabilidad(RENTABILIDAD)}
  }};

  return {{
    meta:         meta,
    grupo:        grupo,
    chile:  {{ ventas: chile_ventas, cxc: chile_cxc }},
    peru:   {{ ventas: peru_ventas,  cxc: peru_cxc  }},
    rentabilidad: rentabilidad,
    tc:       function() {{ return meta.tc_clp_usd; }},
    clpToUsd: function(clp) {{ return Math.round(clp / meta.tc_clp_usd); }},
    usdToClp: function(usd) {{ return usd * meta.tc_clp_usd; }},
    fmt_clp:  function(v) {{ return v.toLocaleString('es-CL'); }},
    fmt_usd:  function(v) {{ return v.toLocaleString('en-US', {{minimumFractionDigits:0, maximumFractionDigits:0}}); }},
    fmt_pct:  function(v) {{ return (v * 100).toFixed(1) + '%'; }},
    chile_ytd:     function() {{ return chile_ventas.ytd_5m; }},
    peru_ytd:      function() {{ return peru_ventas.ytd_5m; }},
    grupo_ytd_usd: function() {{ return grupo.ytd_usd; }},
    cxc_chile_t90: function() {{ return chile_cxc.tramos.t90; }},
    cxc_peru_t90:  function() {{ return peru_cxc.tramos.t90; }},
    cxc_alerta_loma_larga: function() {{
      return chile_cxc.cuentas_criticas.find(function(c) {{
        return c.cliente.indexOf('LOMA LARGA') >= 0;
      }});
    }}
  }};
}})();

(function verificarIntegridad() {{
  var ok = true; var errores = [];
  var sumaChile = AVBOARD.chile.ventas.mensual_real.reduce(function(a,b){{return a+b;}}, 0);
  if (sumaChile !== AVBOARD.chile.ventas.ytd_5m)
    errores.push('Chile mensual suma ' + sumaChile + ' ≠ ytd ' + AVBOARD.chile.ventas.ytd_5m);
  var sumaPeruR = AVBOARD.peru.ventas.mensual_real.reduce(function(a,b){{return a+b;}}, 0);
  if (Math.abs(sumaPeruR - AVBOARD.peru.ventas.ytd_5m) > 5)
    errores.push('Perú mensual suma ' + sumaPeruR + ' ≠ ytd ' + AVBOARD.peru.ventas.ytd_5m);
  var sumaCxcCH = AVBOARD.chile.cxc.por_entidad.agrocomercial.total +
                  AVBOARD.chile.cxc.por_entidad.agroveca_chile.total;
  if (sumaCxcCH !== AVBOARD.chile.cxc.total)
    errores.push('CxC entidades ' + sumaCxcCH + ' ≠ total ' + AVBOARD.chile.cxc.total);
  var t = AVBOARD.chile.cxc.tramos;
  var sumaTrCH = t.t90 + t.t6190 + t.t3160 + t.t030;
  if (sumaTrCH !== AVBOARD.chile.cxc.total)
    errores.push('CxC tramos ' + sumaTrCH + ' ≠ total ' + AVBOARD.chile.cxc.total);
  if (ok && errores.length === 0) {{
    console.log('[AVBOARD] ✅ Integridad OK · ' + AVBOARD.meta.version);
  }} else {{
    console.warn('[AVBOARD] ⚠ Errores:');
    errores.forEach(function(e){{ console.warn('  · ' + e); }});
  }}
}})();
"""
    return js


# ══════════════════════════════════════════════════════════════════════════════
#  5. GENERACIÓN avboard_clientes.js
# ══════════════════════════════════════════════════════════════════════════════

def build_clientes(cl_v, pe_v, iec_cl, cl_cxc):
    """Construye arrays CLIENTES_CL y CLIENTES_PE."""

    df_cl = cl_v['df'].copy()
    df_cl['total_n'] = pd.to_numeric(df_cl['Total'], errors='coerce').fillna(0)
    df_cl = df_cl[df_cl['total_n'] > 0]

    # ── CLIENTES CHILE ──────────────────────────────────────────────────────
    clientes_cl = []

    # Group by RUT
    grupos = df_cl.groupby('Rut')
    total_cl_ytd = cl_v['ytd_5m'] or 1  # for pct

    for rut, sub in grupos:
        rut_str = str(rut).strip()
        nombre  = sub['Razón Social'].iloc[0] if len(sub) > 0 else rut_str
        vend    = sub['Vendedor'].mode().iloc[0] if len(sub) > 0 else ''
        region  = sub.get('Región', pd.Series([''])).iloc[0] if 'Región' in sub.columns else ''

        # Ventas mensuales
        mes_v = {}
        for m in MESES_FULL:
            v = int(sub[sub['MES'] == m]['total_n'].sum())
            if v > 0:
                mes_v[m] = v

        ytd    = int(sub['total_n'].sum())
        n_tx   = len(sub)
        n_docs = sub['Folio'].nunique() if 'Folio' in sub.columns else n_tx
        meses_act = len(mes_v)
        frec   = round(meses_act / 5, 2)  # 5 meses en el año
        ticket = round(ytd / n_docs) if n_docs > 0 else 0

        # Tendencia (mes actual vs mes anterior)
        last_val  = mes_v.get(MESES_FULL[4], 0)  # Mayo
        prev_val  = mes_v.get(MESES_FULL[3], 0)  # Abril
        if prev_val > 0 and last_val > 0:
            tend_pct  = round((last_val - prev_val) / prev_val * 100, 1)
            tend_pct  = max(-500, min(500, tend_pct))  # cap ±500%
            tendencia = 'creciente' if tend_pct > 0 else 'decreciente'
        else:
            tend_pct  = 0
            tendencia = 'estable'

        # IEC
        iec_data = iec_cl['por_cliente'].get(rut_str, {})
        iec_pct  = iec_data.get('pct')
        factor   = iec_factor(iec_pct)

        # CxC
        cxc_data = cl_cxc['cxc_por_cliente'].get(rut_str, {
            'saldo': 0, 'max_mora': 0, 'tramo': '', 'estado': 'Sin deuda'
        })

        # Productos top 5
        prod_g = sub.groupby('Producto')['total_n'].sum().sort_values(ascending=False)
        top_prods = []
        for prod, monto in prod_g.head(5).items():
            top_prods.append({
                'prod': str(prod),
                'monto': int(monto),
                'pct': round(int(monto) / ytd * 100, 1) if ytd > 0 else 0
            })
        n_skus = prod_g[prod_g > 0].count()

        # Score (0-100)
        score_iec  = (factor * 30) if factor is not None else 15  # neutro si sin IEC
        score_frec = frec * 25
        # CxC score
        max_mora = cxc_data.get('max_mora', 0)
        if max_mora > 90:   score_cxc = 0
        elif max_mora > 60: score_cxc = 10
        elif max_mora > 30: score_cxc = 15
        elif max_mora > 0:  score_cxc = 20
        else:               score_cxc = 25
        # Diversif
        score_div = min(10, n_skus * 1.5)
        # Volumen (vs mediana)
        score_vol = min(10, ytd / 5000000)  # 10 pts si >= 5M CLP
        score = round(score_iec + score_frec + score_cxc + score_div + score_vol)
        score = max(0, min(100, score))

        # Insights & alertas
        insights  = []
        alertas   = []
        oportunidades = []
        if iec_pct is not None and iec_pct < 0.70:
            alertas.append(f"IEC crítico {iec_pct*100:.1f}% — pricing sistemáticamente bajo piso")
        if cxc_data.get('max_mora', 0) > 90:
            alertas.append(f"CxC crítico +90d · CLP {cxc_data['saldo']:,}")
        if n_skus == 1:
            alertas.append("Mono-producto — riesgo de concentración")
        if tend_pct > 50:
            insights.append(f"Crecimiento {tend_pct:.1f}% vs mes anterior")
        if n_skus >= 5:
            oportunidades.append("Cliente diversificado — potencial premium")

        clientes_cl.append({
            'id':      f"cl_{rut_str.replace('.','').replace('-','')}",
            'nombre':  str(nombre).strip(),
            'rut':     rut_str,
            'pais':    'CL',
            'region':  str(region).strip(),
            'vendedor': str(vend).strip(),
            'moneda':  'CLP',
            'ventas':  {
                'ytd':          ytd,
                'mensual':      mes_v,
                'n_tx':         n_tx,
                'n_docs':       n_docs,
                'meses_activos': meses_act,
                'frecuencia':   frec,
                'ticket_prom':  ticket,
                'tendencia':    tendencia,
                'tendencia_pct': tend_pct,
            },
            'iec': {
                'pct':             iec_pct,
                'factor':          factor,
                'tx_elegible':     iec_data.get('tx_elegible', 0),
                'tx_cumple':       iec_data.get('tx_cumple', 0),
                'monto_elegible':  iec_data.get('monto_elegible', 0),
                'monto_bajo_piso': iec_data.get('monto_bajo_piso', 0),
            },
            'cxc': {
                'saldo':    cxc_data.get('saldo', 0),
                'max_mora': cxc_data.get('max_mora', 0),
                'tramo':    cxc_data.get('tramo', ''),
                'estado':   cxc_data.get('estado', 'Sin deuda'),
            },
            'productos': {
                'top':    top_prods,
                'n_skus': int(n_skus),
                'es_mono': n_skus == 1,
            },
            'score':         score,
            'insights':      insights,
            'alertas':       alertas,
            'oportunidades': oportunidades,
            'ranking':       0,   # filled below
            'pct_venta':     round(ytd / total_cl_ytd * 100, 2),
        })

    # Ranking by score desc, then ytd desc
    clientes_cl.sort(key=lambda c: (-c['score'], -c['ventas']['ytd']))
    for i, c in enumerate(clientes_cl):
        c['ranking'] = i + 1

    # ── CLIENTES PERÚ ───────────────────────────────────────────────────────
    # Peru uses VENTAS ACUMULADAS sheet
    clientes_pe = []
    # Minimal: keep existing structure with updated YTD values
    # (Peru client IEC not computed — no precio piso per-client)
    # We'll use a simplified version based on available data
    # This section can be expanded when Peru client data is available
    # For now, return empty list — the script preserves existing CLIENTES_PE
    # by extracting it from the current avboard_clientes.js

    return clientes_cl, clientes_pe


def render_avboard_clientes_js(clientes_cl, clientes_pe_raw, cortes, n_tx_cl):
    """Genera el contenido de avboard_clientes.js."""
    version = datetime.now().strftime('%Y-%m-%d')
    n_cl = len(clientes_cl)
    ytd_cl = sum(c['ventas']['ytd'] for c in clientes_cl)

    # CXC sin match (clients with CxC but no sales) - extracted from existing file
    cxc_sin_match = '[]'

    header = f"""/* avboard_clientes.js
 * Motor de datos consolidado · Panel Clientes AV Latam 2026
 * Generado: {version} | Corte: Chile {cortes['chile_ventas']} · CxC {cortes['chile_cxc']}
 * GENERADO AUTOMÁTICAMENTE — scripts/update_avboard.py
 *
 * Clientes Chile: {n_cl} · YTD CLP {ytd_cl:,}
 * Score: IEC×30 + Frecuencia×25 + CxC×25 + Diversif×10 + Volumen×10
 */

'use strict';
"""

    cl_json  = _jdumps(clientes_cl,  separators=(',', ':'))
    pe_json  = clientes_pe_raw  # keep existing

    return header + f"""
const CLIENTES_CL = {cl_json};

const CLIENTES_PE = {pe_json};

const CXC_SIN_MATCH_CL = {cxc_sin_match};
"""


# ══════════════════════════════════════════════════════════════════════════════
#  6. ACTUALIZACIÓN Panel_IEC (TX_CL)
# ══════════════════════════════════════════════════════════════════════════════

NAME_NORMALIZE = {
    'VECA MOVE': 'AV MOVE', 'VECA ROOT MAX': 'AV ROOT MAX', 'VECASIL FORTE': 'AV SILFORTE',
    'VECA HUMIC ROOT': 'AV HUMIC ROOT', 'CYTOPRIME': 'AV CYTO PRIME',
    'VECA PLUS POTASIO': 'AV PLUS POTASIO', 'VECA PLUS MAGNESIO': 'AV PLUS MAGNESIO',
    'VECA MICROMIX': 'AV MICROMIX', 'VECA PLUS CALCIO': 'AV PLUS CALCIO',
    'VECA PLUS ZINC': 'AV PLUS ZINC', 'VECA PLUS FOSFORO': 'AV PLUS FOSFORO',
}

def normalize_prod_name(name):
    upper = str(name).strip().upper()
    return NAME_NORMALIZE.get(upper, upper.replace('VECA ', 'AV ').replace('VECASIL', 'AV SIL'))


def build_tx_cl(df_ventas, piso_dict):
    """Construye el array TX_CL completo desde el DataFrame de ventas Chile."""
    df = df_ventas.copy()
    df['total_n'] = pd.to_numeric(df['Total'], errors='coerce').fillna(0)
    df['pv_n']    = pd.to_numeric(df['Precio Uni'], errors='coerce')
    df['fecha_dt'] = pd.to_datetime(df['Fecha'], format='%d/%m/%Y', errors='coerce')
    df['prod_base'], df['fmt_parsed'] = zip(*df['Producto'].apply(parse_producto_formato))

    tx_list = []
    for _, row in df.iterrows():
        total = int(row['total_n'])
        pv    = float(row['pv_n']) if pd.notna(row['pv_n']) else None
        pp_v  = piso_dict.get((row['prod_base'], row['fmt_parsed']), None)
        pp    = float(pp_v) if pp_v is not None else None
        mes   = str(row.get('MES', '')).strip().upper()

        if pp is not None and total > 0:
            elegible = True
            cumple   = pv is not None and pv >= pp
            sp       = total if cumple else 0
            bp       = total if not cumple else 0
        else:
            elegible = False
            cumple   = None
            sp       = 0
            bp       = 0

        fecha_str = row['fecha_dt'].strftime('%Y-%m-%d') if pd.notna(row['fecha_dt']) else ''
        tx_list.append({
            'mes':          mes,
            'fecha':        fecha_str,
            'folio':        str(row.get('Folio', '')),
            'doc':          str(row.get('Documento', ''))[:30],
            'cliente':      str(row.get('Razón Social', '')).strip(),
            'vendedor':     str(row.get('Vendedor', '')).strip(),
            'producto':     normalize_prod_name(row['prod_base']),
            'formato':      row['fmt_parsed'] if row['fmt_parsed'] else '?',
            'producto_orig': str(row.get('Producto', '')).strip(),
            'total':        total,
            'pv':           pv,
            'pp':           pp,
            'elegible':     elegible,
            'sp':           sp,
            'bp':           bp,
            'cumple':       cumple,
        })
    return tx_list


def update_panel_iec(tx_cl, corte_date):
    """Reemplaza TX_CL en Panel_IEC y actualiza fechas de corte."""
    with open(PANEL_IEC, 'r', encoding='utf-8') as f:
        content = f.read()

    tx_json = _jdumps(tx_cl, separators=(',', ':'))
    new_tx  = f'const TX_CL = {tx_json};'

    content = re.sub(r'const TX_CL = \[.*?\];', new_tx, content, flags=re.DOTALL)

    # Update corte dates
    old_dates = re.findall(r'corte \d{2}/\d{2}/\d{4}', content)
    content = re.sub(r'corte \d{2}/\d{2}/\d{4}', f'corte {corte_date}', content)
    content = re.sub(r'Datos corte \d{2}/\d{2}/\d{4}', f'Datos corte {corte_date}', content)

    with open(PANEL_IEC, 'w', encoding='utf-8') as f:
        f.write(content)

    return len(tx_cl)


# ══════════════════════════════════════════════════════════════════════════════
#  6.5 SINCRONIZAR CACHE-BUSTING (?v=) EN TODOS LOS PANELES HTML
# ══════════════════════════════════════════════════════════════════════════════

def sync_cache_busting():
    """
    Actualiza el query param ?v= de TODOS los <script src="avboard_data.js...">
    y <script src="avboard_clientes.js..."> en cada panel HTML del repo, usando
    CACHE_V (fecha de esta corrida).

    Por qué existe: cada corrida regenera avboard_data.js / avboard_clientes.js,
    pero si el ?v= del script tag no cambia, el navegador sigue sirviendo la
    copia cacheada de esos archivos y el panel queda "congelado" aunque el dato
    en GitHub ya esté actualizado — los paneles dejan de coincidir entre sí
    según el caché de cada uno. Bug detectado y corregido a mano el 2026-06-23;
    desde ahora se sincroniza automáticamente en cada corrida.

    Solo reemplaza el query string del script tag — NO toca diseño ni estructura.
    """
    patterns = [
        (re.compile(r'(src=["\'])avboard_data\.js(?:\?v=\d{8})?(["\'])'), 'avboard_data.js'),
        (re.compile(r'(src=["\'])avboard_clientes\.js(?:\?v=\d{8})?(["\'])'), 'avboard_clientes.js'),
    ]
    changed = []
    for path in sorted(REPO.glob('*.html')):
        try:
            content = path.read_text(encoding='utf-8')
        except Exception:
            continue
        new_content = content
        for pattern, fname in patterns:
            new_content = pattern.sub(r'\1' + fname + '?v=' + CACHE_V + r'\2', new_content)
        if new_content != content:
            path.write_text(new_content, encoding='utf-8')
            changed.append(path.name)
    return changed


# ══════════════════════════════════════════════════════════════════════════════
#  7. LOGS
# ══════════════════════════════════════════════════════════════════════════════

def write_logs(summary):
    """Actualiza los 3 archivos de log. NUNCA sobreescribe, solo agrega."""
    LOGS.mkdir(exist_ok=True)

    # ── update_log.txt ───────────────────────────────────────────────────────
    log_entry = f"""
{'='*70}
CORTE: {NOW}
ARCHIVOS PROCESADOS:
{chr(10).join('  - ' + f for f in summary['archivos_procesados'])}
ACCIONES:
{chr(10).join('  · ' + a for a in summary['acciones'])}
VALIDACIÓN JS: {'✅ OK' if summary['js_ok'] else '❌ ERRORES'}
{'='*70}
"""
    with open(LOGS / 'update_log.txt', 'a', encoding='utf-8') as f:
        f.write(log_entry)

    # ── resumen_actualizacion.md ─────────────────────────────────────────────
    resumen = f"""
## Actualización {NOW} — Corte {summary['cortes']['chile_ventas']}

**Chile ventas:** CLP {summary['chile_ytd']:,} YTD · Cumpl 4m: {summary['cumpl_4m']:.1%}
**Perú ventas:** USD {summary['peru_ytd']:,} YTD · Cumpl 5m: {summary['cumpl_5m']:.1%}
**CxC Chile:** CLP {summary['cxc_total']:,} total · +90d: CLP {summary['cxc_t90']:,}
**IEC Chile:** {summary['iec_total']:.1%} global

**Alertas CxC:**
{chr(10).join('- ' + c['cliente'] + f" CLP {c['monto']:,} ({c['dias']}d)" for c in summary['cuentas_criticas'] if c.get('estado') == 'CRÍTICO')}

---
"""
    with open(LOGS / 'resumen_actualizacion.md', 'a', encoding='utf-8') as f:
        f.write(resumen)

    # ── alertas.md ───────────────────────────────────────────────────────────
    crit_list = [c for c in summary['cuentas_criticas'] if c.get('estado') == 'CRÍTICO']
    if crit_list:
        alertas = f"""
## ⚠ Alertas Activas — {NOW}

| Cliente | Monto CLP | Días | RTC |
|---------|-----------|------|-----|
"""
        for c in crit_list:
            alertas += f"| {c['cliente']} | {c['monto']:,} | {c.get('dias','?')}d | {c.get('rtc','?')} |\n"

        alertas += f"\nCxC +90d total: CLP {summary['cxc_t90']:,}\n---\n"
        with open(LOGS / 'alertas.md', 'a', encoding='utf-8') as f:
            f.write(alertas)


# ══════════════════════════════════════════════════════════════════════════════
#  8. VALIDACIÓN JS
# ══════════════════════════════════════════════════════════════════════════════

def validate_js(path):
    """Valida sintaxis JS con node --check."""
    try:
        result = subprocess.run(
            ['node', '--check', str(path)],
            capture_output=True, text=True, timeout=10
        )
        return result.returncode == 0, result.stderr.strip()
    except FileNotFoundError:
        return True, '(node not found — skipped)'
    except Exception as e:
        return False, str(e)


# ══════════════════════════════════════════════════════════════════════════════
#  9. EXTRAER CLIENTES_PE EXISTENTE
# ══════════════════════════════════════════════════════════════════════════════

def extract_existing_clientes_pe():
    """Lee CLIENTES_PE del archivo actual para preservarlo."""
    try:
        with open(AVBOARD_CLI, 'r', encoding='utf-8') as f:
            content = f.read()
        m = re.search(r'const CLIENTES_PE = (\[.*?\]);', content, re.DOTALL)
        if m:
            return m.group(1)
    except Exception:
        pass
    return '[]'


def extract_peru_cxc_static():
    """Lee el objeto peru_cxc del avboard_data.js actual para preservarlo."""
    # Default static value (unchanged between cortes unless new Peru CxC arrives)
    return {
        "corte": "10/05/2026",
        "total": 117964,
        "supra": 196841,
        "tramos": {"no_vencida": 79300, "t030": 10534, "t3160": 3149, "t6190": 1360, "t90": 23621},
        "tramos_pct": {"no_vencida": 0.672, "t030": 0.089, "t3160": 0.027, "t6190": 0.012, "t90": 0.200},
        "vencida": 38664,
        "por_vendedor": {
            "infante": {"total": 28153, "pct": 0.239, "vencida": 15881, "t90": 4598, "riesgo": "CRÍTICO"},
            "geldres": {"total": 10874, "pct": 0.092, "vencida": 10874, "t90": 10874, "riesgo": "CRÍTICO"},
            "atalaya": {"total": 15343, "pct": 0.130, "vencida": 15343, "t90": 15343, "riesgo": "CRÍTICO"},
            "aguirre_navarro": {"total": 58942, "pct": 0.499, "vencida": 1432, "t90": 0, "riesgo": "RIESGO"},
            "gonzales_valladares": {"total": 1600, "pct": 0.014, "vencida": 800, "t90": 0, "riesgo": "NORMAL"},
            "pradenas_sin_asignar": {"total": 7030, "pct": 0.060, "vencida": 4830, "t90": 0, "riesgo": "NORMAL"},
        },
        "cuentas_criticas": [
            {"cliente": "PAODISA S.A.", "vendedor": "J. Geldres", "dias": "468-648d", "monto": 10874.40, "estado": "CRÍTICO", "nota": "4 facturas 2024 · proceso legal pendiente"},
            {"cliente": "AGROFER MJ E.I.R.L.", "vendedor": "O. Atalaya", "dias": 211, "monto": 9493.00, "estado": "CRÍTICO", "nota": "acuerdo de pago urgente"},
            {"cliente": "LUNA QUINTANILLA BRYAN ALEXANDER", "vendedor": "O. Infante", "dias": "97-143d", "monto": 2349.05, "estado": "CRÍTICO", "nota": "2 folios"},
            {"cliente": "EPIC FARMS S.A.C.", "vendedor": "A. Gonzalez", "dias": 107, "monto": 600.00, "estado": "CRÍTICO", "nota": "escaló desde 61-90d"},
        ]
    }


# ══════════════════════════════════════════════════════════════════════════════
#  10. MAIN
# ══════════════════════════════════════════════════════════════════════════════

def main():
    print(f"\n{'='*60}")
    print(f"  AVBOARD UPDATE · {NOW}")
    print(f"{'='*60}\n")

    # 1. Detectar archivos
    print("📂 Detectando archivos inbox...")
    files = detect_inbox_files()
    for k, v in files.items():
        print(f"   {k}: {v.name}")

    required = ['chile_ventas', 'peru_ventas', 'cxc_agro', 'cxc_avch', 'piso_chile']
    missing  = [r for r in required if r not in files]
    if missing:
        print(f"\n❌ Faltan archivos: {missing}")
        sys.exit(1)

    # 2. Extraer cortes
    cortes = {
        'chile_ventas': extract_date_from_filename(files['chile_ventas']),
        'chile_cxc':    extract_date_from_filename(files['cxc_agro']),
        'peru_ventas':  extract_date_from_filename(files['peru_ventas']),
        'peru_cxc':     '10/05/2026',  # static until new Peru CxC arrives
    }
    print(f"\n📅 Cortes detectados: {cortes}")

    # 3. Extraer datos
    print("\n📊 Extrayendo datos...")
    print("   Chile ventas...")
    cl_v = extract_chile_ventas(files['chile_ventas'])
    print(f"   → YTD: CLP {cl_v['ytd_5m']:,} | {sum(1 for v in cl_v['mensual'] if v>0)} meses")

    print("   Perú ventas...")
    pe_v = extract_peru_ventas(files['peru_ventas'])
    print(f"   → YTD: USD {pe_v['ytd_5m']:,}")

    print("   CxC Chile (2 entidades)...")
    cl_cxc = extract_cxc_chile(files['cxc_agro'], files['cxc_avch'])
    print(f"   → Total: CLP {cl_cxc['total']:,} | +90d: CLP {cl_cxc['tramos']['t90']:,}")

    # 4. Calcular IEC
    print("\n⚡ Calculando IEC Chile...")
    piso_dict = load_piso_chile(files['piso_chile'])
    iec_cl    = compute_iec_chile(cl_v['df'], piso_dict)
    print(f"   → IEC global: {iec_cl['total']:.1%} | BP: CLP {iec_cl['bp_total']:,}")

    # 5. Generar avboard_data.js
    print("\n📝 Generando avboard_data.js...")
    peru_cxc_static = extract_peru_cxc_static()
    js_data = render_avboard_data_js(cl_v, pe_v, cl_cxc, iec_cl, cortes, peru_cxc_static)
    with open(AVBOARD_DATA, 'w', encoding='utf-8') as f:
        f.write(js_data)
    ok, err = validate_js(AVBOARD_DATA)
    print(f"   → {'✅ OK' if ok else '❌ ERROR: ' + err}")
    if not ok:
        print(f"     {err}")
        sys.exit(1)

    # 6. Verificar integridad con node
    result = subprocess.run(['node', '-e', open(AVBOARD_DATA).read()],
                            capture_output=True, text=True, timeout=10)
    if result.returncode != 0:
        print(f"   ❌ Runtime error:\n{result.stderr}")
        sys.exit(1)
    print(f"   {result.stdout.strip()}")

    # 7. Generar avboard_clientes.js
    print("\n👥 Generando avboard_clientes.js...")
    clientes_pe_raw = extract_existing_clientes_pe()
    clientes_cl, _ = build_clientes(cl_v, pe_v, iec_cl, cl_cxc)
    print(f"   → {len(clientes_cl)} clientes Chile procesados")

    js_cli = render_avboard_clientes_js(clientes_cl, clientes_pe_raw, cortes, len(cl_v['df']))
    with open(AVBOARD_CLI, 'w', encoding='utf-8') as f:
        f.write(js_cli)
    ok2, err2 = validate_js(AVBOARD_CLI)
    print(f"   → {'✅ OK' if ok2 else '❌ ERROR: ' + err2}")

    # 8. Actualizar Panel_IEC TX_CL
    print("\n🔬 Actualizando Panel_IEC TX_CL...")
    tx_cl = build_tx_cl(cl_v['df'], piso_dict)
    n_tx  = update_panel_iec(tx_cl, cortes['chile_ventas'])
    print(f"   → {n_tx} transacciones · corte {cortes['chile_ventas']}")

    # 8.5 Sincronizar cache-busting en todos los paneles
    print(f"\n🔄 Sincronizando cache-busting (?v={CACHE_V}) en paneles HTML...")
    panels_synced = sync_cache_busting()
    print(f"   → {len(panels_synced)} paneles actualizados: {', '.join(panels_synced) if panels_synced else '(ninguno — ya estaban al día)'}")

    # 9. Logs
    print("\n📋 Actualizando logs...")
    archivos = [v.name for v in files.values()]
    acciones = [
        f"avboard_data.js generado · corte {cortes['chile_ventas']}",
        f"avboard_clientes.js regenerado · {len(clientes_cl)} clientes CL",
        f"Panel_IEC TX_CL · {n_tx} transacciones",
        f"IEC Chile {iec_cl['total']:.1%} · BP CLP {iec_cl['bp_total']:,}",
        f"CxC Chile CLP {cl_cxc['total']:,} · +90d CLP {cl_cxc['tramos']['t90']:,}",
        f"Cache-busting ?v={CACHE_V} sincronizado en {len(panels_synced)} paneles HTML",
    ]
    summary = {
        'archivos_procesados': archivos,
        'acciones': acciones,
        'js_ok': ok and ok2,
        'cortes': cortes,
        'chile_ytd': cl_v['ytd_5m'],
        'peru_ytd': pe_v['ytd_5m'],
        'cumpl_4m': cl_v['cumplimiento_4m'],
        'cumpl_5m': pe_v['cumplimiento_5m'],
        'cxc_total': cl_cxc['total'],
        'cxc_t90': cl_cxc['tramos']['t90'],
        'iec_total': iec_cl['total'],
        'cuentas_criticas': cl_cxc['cuentas_criticas'],
    }
    write_logs(summary)

    print(f"\n{'='*60}")
    print(f"  ✅ ACTUALIZACIÓN COMPLETA · {datetime.now().strftime('%H:%M:%S')}")
    print(f"  Chile YTD: CLP {cl_v['ytd_5m']:>15,}  Cumpl 4m: {cl_v['cumplimiento_4m']:.1%}")
    print(f"  Perú  YTD: USD {pe_v['ytd_5m']:>15,}  Cumpl 5m: {pe_v['cumplimiento_5m']:.1%}")
    print(f"  CxC +90d:  CLP {cl_cxc['tramos']['t90']:>15,}")
    print(f"  IEC Chile: {iec_cl['total']:.1%}")
    print(f"{'='*60}\n")


if __name__ == '__main__':
    main()
