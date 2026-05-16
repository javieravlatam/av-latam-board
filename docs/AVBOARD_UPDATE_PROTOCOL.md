# AVBOARD — Protocolo de Actualización
**Agroveca Grupo LATAM · Paso a paso para futuras actualizaciones**
Versión: 1.0 · Fecha: 2026-05-15

---

## Principios Generales

Antes de comenzar cualquier actualización:

- **Un corte a la vez.** No mezclar actualizaciones de Chile y Perú en la misma sesión si los datos llegaron en distintos momentos.
- **Leer antes de escribir.** Siempre explorar los archivos nuevos del inbox antes de modificar cualquier dashboard.
- **Perú y Chile son independientes.** Los precios piso, las transacciones y los clientes de cada país no se tocan entre sí.
- **Los logs siempre al final.** Registrar en `update_log.txt` y `resumen_actualizacion.md` al completar, no durante.
- **Validar antes de cerrar.** Siempre correr una verificación de sintaxis JS y coherencia de datos antes de dar por terminado.

---

## Tipo A — Actualización de Ventas (Chile o Perú)

Se activa cuando llega un nuevo `Libro de Ventas *.xlsx` (Chile) o `AGROVECA PERU VENTAS *.xlsx` (Perú) al inbox.

### Paso 1 — Leer y explorar el archivo nuevo

```python
import pandas as pd

df = pd.read_excel('/avboard/inbox/Libro de Ventas DD-MM-YYYY.xlsx',
                   sheet_name='VENTAS', header=1)
df.columns = [str(c).strip() for c in df.columns]

# Chile: filtrar por PAÍS == 'CHILE'
# Perú: filtrar por PAÍS == 'PERU' o usar el archivo de Perú directamente

print(df.shape, df['MES'].unique(), df['PAÍS'].unique())
```

Columnas esperadas (Chile): `MES, Rut, Razón Social, Fecha, Región, Vendedor, Producto, UN, Documento, Folio, UM, Cantidad, Total, Precio Uni, Moneda, PAÍS`

### Paso 2 — Identificar el precio piso vigente

```python
pp = pd.read_csv('/tmp/pp_chile_vigente.csv')  # generado en actualización anterior
# o releer desde inbox si cambió:
# pp = pd.read_excel('/avboard/inbox/precios piso CHile .xlsx', sheet_name='Lista de precios', header=None)
```

### Paso 3 — Cruzar ventas con precio piso

Para cada transacción:
1. Parsear `producto_orig` (nombre del sistema contable) → `producto` canónico + `formato`
2. Buscar `(producto, formato)` en la tabla de precios piso → obtener `pp`
3. Si tiene `pp`: `elegible = True`, `cumple = (pv >= pp)`, `sp = total if cumple else 0`, `bp = total if not cumple else 0`
4. Si no tiene `pp`: `elegible = False`, `sp = 0`, `bp = 0`, `cumple = None`

**Referencia de normalización de nombres** (usar el mapeo existente en `tx_cl_old.json` o `avboard_clientes.js`):
- `VECA MOVE - 20 L` → producto: `AV MOVE`, formato: `20 L`
- `AV MOVE X 20LT` → producto: `AV MOVE`, formato: `20 L`
- `VECASIL FORTE - 20 L` → producto: `AV SILFORTE`, formato: `20 L`
- `ALGAP 30 - 20 L` → producto: `AV ALGAP 30`, formato: `20 L`

### Paso 4 — Generar nuevo TX_CL (o TX_PE)

```python
def tx_to_js(t):
    parts = []
    for k, v in t.items():
        if v is None: parts.append(f'"{k}":null')
        elif isinstance(v, bool): parts.append(f'"{k}":{"true" if v else "false"}')
        elif isinstance(v, float) and v != v: parts.append(f'"{k}":NaN')
        else: parts.append(f'"{k}":{json.dumps(v)}')
    return '{' + ','.join(parts) + '}'

js_arr = '[' + ','.join(tx_to_js(t) for t in transacciones) + ']'
```

### Paso 5 — Inyectar en Panel_IEC_Auditoria_2026.html

```python
import re

with open('/avboard/repo/Panel_IEC_Auditoria_2026.html') as f:
    html = f.read()

# Para Chile:
html_new = re.sub(r'(const TX_CL\s*=\s*)(\[.*?\]);', r'\g<1>' + nuevo_array + ';', html, flags=re.DOTALL)

# Para Perú:
# html_new = re.sub(r'(const TX_PE\s*=\s*)(\[.*?\]);', r'\g<1>' + nuevo_array + ';', html, flags=re.DOTALL)

with open('/avboard/repo/Panel_IEC_Auditoria_2026.html', 'w') as f:
    f.write(html_new)
```

### Paso 6 — Actualizar avboard_data.js

Recalcular con pandas los totales YTD, por mes, por RTC, e IEC resumen. Editar las secciones correspondientes (`chile_ventas` o `peru_ventas`) en `avboard_data.js`.

### Paso 7 — Actualizar avboard_clientes.js

Recalcular métricas por cliente (ventas YTD, mensual, n_tx, frecuencia, ticket_prom, tendencia, IEC, score). Usar búsqueda por `"nombre":"NOMBRE"` para localizar y editar cada bloque JSON del cliente.

### Paso 8 — Validación

```bash
# Sintaxis JS del Panel_IEC:
node -e "
const html = require('fs').readFileSync('/avboard/repo/Panel_IEC_Auditoria_2026.html','utf8');
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1]
  .replace(/const TX_CL\s*=\s*\[[\s\S]*?\];/, 'const TX_CL=[];')
  .replace(/const TX_PE\s*=\s*\[[\s\S]*?\];/, 'const TX_PE=[];');
new Function(js);
console.log('OK');
"

# Coherencia IEC:
# IEC global = sum(SP) / sum(Elig)
# sum(SP) + sum(BP) = sum(Elig)
```

### Paso 9 — Registrar en logs

Agregar entradas en:
- `/avboard/logs/update_log.txt` — detalle técnico
- `/avboard/logs/resumen_actualizacion.md` — resumen ejecutivo con KPIs y alertas

---

## Tipo B — Actualización de Precios Piso Chile

Se activa cuando llega un nuevo `precios piso CHile .xlsx` al inbox. **No modifica Perú.**

### Paso 1 — Leer nuevo archivo de precios piso

```python
pp = pd.read_excel('/avboard/inbox/precios piso CHile .xlsx',
                   sheet_name='Lista de precios', header=None)

# Encontrar fila de encabezado (buscar "PRODUCTO")
header_row = None
for i, row in pp.iterrows():
    if any('PRODUCTO' in str(v) for v in row.values):
        header_row = i; break

pp.columns = pp.iloc[header_row]
pp = pp.iloc[header_row+1:].dropna(subset=['PRODUCTO','FORMATO','Precio Piso AV'])
pp = pp[['PRODUCTO','FORMATO','Precio Piso AV']].rename(columns={
    'PRODUCTO':'producto', 'FORMATO':'formato', 'Precio Piso AV':'pp'})
pp['pp'] = pd.to_numeric(pp['pp'], errors='coerce')
```

### Paso 2 — Extraer TX_CL actual

```python
import re, json

with open('/avboard/repo/Panel_IEC_Auditoria_2026.html') as f:
    html = f.read()
m = re.search(r'const TX_CL\s*=\s*(\[.*?\]);', html, re.DOTALL)
tx_old = json.loads(m.group(1).replace(':NaN', ':null'))
```

### Paso 3 — Comparar precios (viejo vs nuevo)

Identificar qué combinaciones `(producto, formato)` cambiaron de precio piso. Documentar los cambios para el log.

### Paso 4 — Recalcular cada transacción TX_CL

Para cada `t` en TX_CL:
- Buscar `nuevo_pp = nuevo_lookup.get((t['producto'], t['formato']))`
- Si existe: actualizar `pp`, recalcular `cumple`, `sp`, `bp`
- Si no existe: mantener `elegible = False`, `pp = None`
- **Nunca tocar TX_PE**

### Paso 5 — Recalcular IEC resumen

```python
def get_factor(iec):
    if iec < 0.70: return 0.20
    if iec < 0.85: return 0.70
    if iec < 0.92: return 0.80
    if iec < 0.95: return 0.90
    return 1.05

el = [t for t in tx_new if t['elegible']]
iec_global = sum(t['sp'] for t in el) / sum(t['total'] for t in el)
# Calcular por vendedor y por cliente del mismo modo
```

### Paso 6 — Actualizar archivos

1. Inyectar nuevo TX_CL en `Panel_IEC_Auditoria_2026.html`
2. Editar sección `chile_ventas.iec` en `avboard_data.js`
3. Editar campos `iec` y `score` de los clientes afectados en `avboard_clientes.js`

### Paso 7 — Verificar integridad Perú

```python
# Confirmar que TX_PE no cambió
m = re.search(r'const TX_PE\s*=\s*(\[.*?\]);', html_nuevo, re.DOTALL)
tx_pe = json.loads(m.group(1).replace(':NaN','':null'))
iec_pe = sum(t['sp'] for t in tx_pe if t['elegible']) / sum(t['total'] for t in tx_pe if t['elegible'])
print(f"IEC Perú: {iec_pe*100:.2f}% (debe ser ~97.9%)")
```

### Paso 8 — Registrar en logs

---

## Tipo C — Actualización de CxC

Se activa cuando llegan nuevos archivos de cuentas por cobrar al inbox.

**Chile:** llegan 2 archivos separados (Agroveca Chile + Agrocomercial)
**Perú:** 1 archivo

### Paso 1 — Leer archivos CxC

Cada archivo tiene estructura de aging: columnas por tramo (0-30d, 31-60d, 61-90d, >90d). La fila de encabezado suele estar en las primeras 5 filas — buscar `Cliente` o `Razón Social`.

### Paso 2 — Consolidar (Chile)

Sumar los 2 archivos. Calcular totales por entidad y consolidado.

### Paso 3 — Actualizar avboard_data.js

Editar sección `chile_cxc` (o `peru_cxc`):
- `total`, `vencida` (>30d), `al_dia`
- `por_entidad` (Chile)
- `por_cliente` (Perú)

### Paso 4 — Actualizar avboard_clientes.js

Para cada cliente con saldo en CxC, localizar su registro en `CLIENTES_CL` o `CLIENTES_PE` y actualizar el bloque `cxc: { saldo, max_mora, tramo, estado }`.

Recalcular el `cxc_score` y el `score` total de los clientes afectados.

**Tramos CxC:**
- `estado: "Normal"` → días de mora 0 o menor (pagado adelantado o al día, 0-30d)
- `estado: "Alerta"` → 31-60d vencido
- `estado: "Mora"` → 61-90d vencido
- `estado: "Crítico"` → >90d vencido

### Paso 5 — Validar y registrar en logs

---

## Revisión Visual (todas las actualizaciones)

Después de toda actualización, abrir en el navegador y verificar:

**Panel_IEC_Auditoria_2026.html**
- [ ] Los filtros de País y Mes funcionan
- [ ] La tabla de vendedores muestra IEC correcto
- [ ] El drill-down de vendedor muestra transacciones
- [ ] El tab "⚡ Impacto Comercial" carga al seleccionar un vendedor
- [ ] La simulación de 3 escenarios se muestra correctamente
- [ ] La consola del navegador no muestra errores

**Panel_Clientes_AV_2026.html**
- [ ] La lista de clientes carga (151 CL + 42 PE)
- [ ] Al hacer clic en un cliente, el panel 360° aparece
- [ ] El gráfico de evolución mensual se renderiza
- [ ] La recomendación automática se muestra
- [ ] Los filtros por estado, vendedor y país funcionan

**avboard_data.js (paneles ejecutivos)**
- [ ] Panel_Chile muestra el IEC actualizado en la barra lateral
- [ ] Dashboard_Comercial refleja los KPIs del último corte
- [ ] Executive_Board muestra cifras coherentes con avboard_data.js

---

## Reglas de Commits y GitHub

El repositorio GitHub espeja `/avboard/repo/`. Commitear solo cuando:

1. Se ha validado toda la actualización (sintaxis, datos, visual)
2. Se han actualizado los logs
3. Se ha generado el resumen ejecutivo

**Archivos a commitear:**
- `avboard_data.js`
- `avboard_clientes.js`
- `Panel_IEC_Auditoria_2026.html`
- Cualquier panel HTML que se haya modificado

**Archivos que NO van al commit:**
- Archivos temporales de `/tmp/` o de trabajo de Claude
- Archivos `.xlsx` del inbox (son fuentes, no outputs)

**Mensaje de commit recomendado:**
```
[AVBOARD] Actualización corte DD/MM/YYYY — Chile ventas + IEC (o: precios piso Chile)

- IEC global Chile: X.X% → Y.Y%
- N clientes afectados
- Archivos: avboard_data.js, avboard_clientes.js, Panel_IEC_Auditoria_2026.html
```

---

## Checklist Completo por Actualización

```
CHECKLIST ACTUALIZACIÓN AVBOARD
================================
Tipo: [ ] Ventas  [ ] Precios piso  [ ] CxC

PRE-PROCESO
[ ] Identificar archivo(s) nuevo(s) en /inbox
[ ] Verificar fecha de corte del archivo
[ ] Confirmar país(es) afectado(s)

PROCESO
[ ] Leer y explorar archivo con pandas
[ ] Cruzar con precio piso vigente (si aplica)
[ ] Recalcular IEC por transacción
[ ] Recalcular IEC por vendedor
[ ] Recalcular IEC por cliente
[ ] Recalcular scores de clientes afectados

ACTUALIZACIÓN DE ARCHIVOS
[ ] Panel_IEC_Auditoria_2026.html — TX_CL y/o TX_PE
[ ] avboard_data.js — sección correspondiente
[ ] avboard_clientes.js — clientes afectados

VALIDACIÓN
[ ] Sintaxis JS: node -e "new Function(js)" → OK
[ ] IEC: SP + BP = Elig → OK
[ ] Perú intacto (si solo se actualizó Chile) → OK
[ ] Consola navegador limpia → OK

LOGS
[ ] update_log.txt actualizado (append)
[ ] resumen_actualizacion.md actualizado (append)
[ ] alertas.md revisado (actualizar solo si hay cambios)

COMMIT
[ ] git add [archivos específicos]
[ ] git commit -m "[AVBOARD] Corte DD/MM/YYYY — ..."
[ ] git push origin main
```

---

*Documento generado por Claude · Agroveca AVBOARD 2026*
