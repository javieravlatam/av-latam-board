# REPORTE PRE-COMMIT — Normalización Vendedores Perú (Aguirre + Martha)
**Fecha:** 2026-07-21  
**Commit propuesto:** `fix SIC: normalización Lisbeth/Lizbeth Aguirre + Martha Hidalgo en selector [skip ci]`

---

## Problemas corregidos

| Problema | Causa raíz | Fix |
|----------|-----------|-----|
| Aguirre "Pendiente de carga" en SIC | `"LISBETH AGUIRRE"` (S) no estaba en VENDEDOR_MAP → clave derivada sin presupuesto | Agregar `"LISBETH AGUIRRE": "aguirre"` al mapa |
| Martha no aparece en selector SIC | Sin transacciones antes de ago 2026 → no entra en `vendedoresVistos` | Nuevo `VENDEDORES_SEMILLA` + lógica de inclusión por presupuesto |

---

## Archivos modificados

| Archivo | Líneas cambiadas |
|---------|-----------------|
| `apps/sic_av/js/sic_data_adapter.js` | +2 en VENDEDOR_MAP · +13 VENDEDORES_SEMILLA · +17 lógica semilla en construirCicloReal |

---

## Validación

### Pruebas específicas — 14/14 ✅

| Caso | Resultado |
|------|-----------|
| `LISBETH AGUIRRE` → clave `aguirre`, mapeado=true | ✅ |
| `LIZBETH AGUIRRE` → clave `aguirre`, mapeado=true | ✅ |
| `Lisbeth Aguirre` (mixed case) → clave `aguirre` | ✅ |
| Martha ppto agosto = 10.000 | ✅ |
| Martha aparece en selector cuando ppto > 0 (ciclo sep 2026) | ✅ |
| Martha NO aparece cuando ppto = 0 (ciclos pre-agosto) | ✅ |
| Sin duplicados cuando Martha tenga ventas reales | ✅ |

### Suites de regresión — 91/91 ✅

| Suite | OK/Total |
|-------|---------|
| Motor SIC | 49/49 ✅ |
| Adaptador datos reales | 26/26 ✅ |
| Modelo temporal v1.6 | 16/16 ✅ |

### Restricciones cumplidas

| Restricción | Estado |
|------------|--------|
| No modificar sic_core.js | ✅ |
| No modificar sic_chile.html / sic_peru.html | ✅ |
| No modificar reglas de cálculo comercial | ✅ |
| Normalización es regla global (VENDEDOR_MAP + VENDEDORES_SEMILLA) | ✅ |
| Auditoría entregada antes del commit | ✅ |

---

## Commit

```bash
rm -f ~/Documents/GitHub/av-latam-board/.git/index.lock

cd ~/Documents/GitHub/av-latam-board
git add apps/sic_av/js/sic_data_adapter.js \
        logs/REPORTE_AUDITORIA_NORMALIZACION.md \
        logs/REPORTE_PRECOMMIT_NORMALIZACION.md
git commit -m "fix SIC: normalización Lisbeth/Lizbeth Aguirre + Martha Hidalgo en selector [skip ci]"
git push origin main
```

> **Nota:** este commit puede hacerse junto con el de `rtc_mensual_ppto` Peru si aún no se ha hecho:
> ```bash
> git add scripts/update_avboard.py \
>         apps/sic_av/js/sic_data_adapter.js \
>         avboard_data.js \
>         logs/REPORTE_AUDITORIA_SIC.md \
>         logs/REPORTE_PRECOMMIT_SIC.md \
>         logs/REPORTE_AUDITORIA_NORMALIZACION.md \
>         logs/REPORTE_PRECOMMIT_NORMALIZACION.md
> git commit -m "fix SIC: presupuesto mensual Perú real + normalización Aguirre/Martha [skip ci]"
> git push origin main
> ```
