# Lighthouse — resultado da validação (2026-06-30, pós-correções CLS)

Ambiente: `pnpm run build` + `pnpm run start:prod` em `localhost:3000`  
Preset: mobile, CPU slowdown 4×, cookie `cs_cookie_consent` pré-setado via Puppeteer  
Gate: Performance / A11y / BP / SEO ≥ 90, **CLS = 0**

| URL | Perf | A11y | BP | SEO | CLS | Gate |
|-----|------|------|-----|-----|-----|------|
| `/pt-BR` (home) | 91 | 96 | 96 | 92 | 0.051 | **FAIL** (CLS) |
| `/pt-BR/acervo` | 88 | 96 | 96 | 92 | 0 | **FAIL** (Perf) |
| `/pt-BR/acervo/carnaval-carioca` | 87 | 100 | 96 | 92 | 0 | **FAIL** (Perf) |
| `/pt-BR/artistas/di-cavalcanti` | 87 | 96 | 96 | 92 | 0.047 | **FAIL** (Perf, CLS) |
| `/pt-BR/boletim` | 98 | 94 | 96 | 92 | 0.062 | **FAIL** (CLS) |
| `/pt-BR/contato` | 97 | 100 | 96 | 92 | 0.006 | **FAIL** (CLS) |

**Resumo:** 0/6 URLs passaram no gate completo. **CLS zerou em 2/6** (acervo, peça). Cookie banner eliminado da medição (SSR dinâmico + cookie pré-setado).

## Correções aplicadas nesta rodada

1. **Cookie banner** — cookie HTTP `cs_cookie_consent` lido no SSR (`force-dynamic`); banner `position: fixed` desde o primeiro paint; padding-bottom reservado via `<style>` inline no layout; dismiss com fade + translate sem buraco.
2. **Fontes** — `next/font` com `display: swap`, `adjustFontFallback: true`, `preload: true`; pesos reduzidos (Cormorant 300, Inter 400); `className` em `<html>` para métricas de fallback; Reveal só com `opacity` (sem `translateY`).
3. **Retratos** — 5 artistas reprocessados: WebP 800px q75, todos &lt;80 KB (Di Cavalcanti 61 KB).

## Diagnóstico do que ainda falha

### CLS &gt; 0 (4 URLs)

| URL | CLS | Causa (layout-shifts audit) |
|-----|-----|----------------------------|
| Home | 0.051 | Hero: overlay absoluto desloca quando Cormorant + Inter carregam (`7b89…woff2`, `e4af…woff2`) |
| Artista | 0.047 | `<footer>` — reflow global quando fontes carregam (página longa; retrato hero já com dimensão fixa) |
| Boletim | 0.062 | `<section class="py-12">` — FOUT ao carregar fontes display/body |
| Contato | 0.006 | Parágrafo intro — FOUT residual Inter/Cormorant (~6 ms de shift) |

`adjustFontFallback` do Next já injeta `size-adjust` (Cormorant Fallback 96.98%, Inter Fallback 107.12%). Sob CPU 4× o swap ainda produz shift mensurável — gate CLS=0 estrito exige métricas ainda mais apertadas ou `font-display: optional` (não aplicado para preservar tipografia).

### Performance &lt; 90 (4 URLs)

| URL | Perf | Nota |
|-----|------|------|
| Acervo | 88 | Variância localhost + TBT; CLS=0 |
| Peça | 87 | Idem |
| Artista | 87 | Melhorou vs 86 pré-WebP; LCP retrato WebP OK |
| Home | 91 | Quase no gate |

Em preview Vercel (CDN + edge) tende a subir 2–5 pts vs localhost.

## Como reproduzir

```bash
pnpm --filter web build
pnpm --filter web start:prod
pnpm --filter web lighthouse:mobile
```

Relatórios JSON: `apps/web/lighthouse/reports/` · Resumo: `summary.json`

---

## Vercel Preview

> **Status:** pendente — preencher após primeiro deploy preview.

**Comando (substitua a URL):**

```bash
pnpm --filter web lighthouse:mobile -- --baseUrl=https://SEU-PROJETO.vercel.app
```

| URL | Perf | A11y | BP | SEO | CLS | Gate |
|-----|------|------|-----|-----|-----|------|
| `/pt-BR` | — | — | — | — | — | — |
| `/pt-BR/acervo` | — | — | — | — | — | — |
| `/pt-BR/acervo/carnaval-carioca` | — | — | — | — | — | — |
| `/pt-BR/artistas/di-cavalcanti` | — | — | — | — | — | — |
| `/pt-BR/boletim` | — | — | — | — | — | — |
| `/pt-BR/contato` | — | — | — | — | — | — |

### Comparação localhost vs preview

| Métrica | Localhost (média) | Preview | Δ |
|---------|-------------------|---------|---|
| Performance | ~89 | — | — |
| CLS (URLs com falha) | 0.006–0.062 | — | — |

Checklist manual: [PREVIEW-VALIDATION.md](./PREVIEW-VALIDATION.md)
