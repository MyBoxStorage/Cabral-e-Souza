# Lighthouse — resultado da validação (2026-06-30)

Ambiente: `pnpm run build` + `pnpm run start:prod` em `localhost:3000`  
Preset: mobile, CPU slowdown 4×  
Gate: Performance / A11y / BP / SEO ≥ 90, **CLS = 0**

| URL | Perf | A11y | BP | SEO | CLS | Gate |
|-----|------|------|-----|-----|-----|------|
| `/pt-BR` (home) | 93 | 97 | 96 | 92 | 0.056 | **FAIL** (CLS) |
| `/pt-BR/acervo` | 92 | 97 | 96 | 92 | 0.019 | **FAIL** (CLS) |
| `/pt-BR/acervo/carnaval-carioca` | 92 | 100 | 96 | 92 | 0 | **PASS** |
| `/pt-BR/artistas/di-cavalcanti` | 86 | 97 | 96 | 92 | 0.047 | **FAIL** (Perf, CLS) |
| `/pt-BR/boletim` | 93 | 95 | 96 | 92 | 0.063 | **FAIL** (CLS) |
| `/pt-BR/contato` | 93 | 100 | 96 | 92 | 0.006 | **FAIL** (CLS) |

**Resumo:** 1/6 URLs passou no gate completo. Todas as categorias exceto Performance (artista) e CLS estão ≥ 90.

## Otimizações sensatas (sem comprometer qualidade visual)

### CLS (principal bloqueio)

1. **Cookie banner** — aparição tardia desloca o viewport; considerar entrada só com `transform` (já fixo) ou adiar até interação. Para medição: `localStorage.setItem('cs_cookie_consent', ...)` antes do teste (ver [LIGHTHOUSE-GATE.md](./LIGHTHOUSE-GATE.md)).
2. **Fontes** — `next/font` já usa `display: swap`; FOFT residual pode contribuir ~0.01 CLS em páginas curtas.
3. **Reveal on scroll** — usa `transform`/`opacity` (não deveria causar CLS); manter `prefers-reduced-motion`.

### Performance (artista 86)

1. **Hero portrait** (~220 KB JPEG Di Cavalcanti) — servir WebP/AVIF via Supabase transform ou redimensionar seed para ~800px largura.
2. **LCP** — `priority` já na imagem do hero; avaliar `fetchPriority` em retratos acima da dobra.

### SEO (92 em todas)

1. Links crawlers em conteúdo markdown — já resolvido na Fase 1.
2. Verificar `robots` e canonical — infra OK desde Fase 1.

## Como reproduzir

```bash
pnpm --filter web build
pnpm --filter web start:prod
pnpm --filter web lighthouse:mobile
```

Relatórios JSON: `apps/web/lighthouse/reports/`
