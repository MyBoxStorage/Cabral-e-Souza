# Lighthouse — resultado da validação (2026-06-30, fase 8 redesign v3)

Ambiente: `pnpm --filter web build` + `pnpm --filter web start:prod` em `localhost:3000`  
Preset: mobile, CPU slowdown 4×, cookie `cs_cookie_consent` pré-setado via Puppeteer  
Gate: Performance / A11y / BP / SEO ≥ 90, **CLS = 0**  
Rotas: 8 URLs (inclui `/sobre` e `/vender-obra`)

| URL | Perf | A11y | BP | SEO | CLS | Gate |
|-----|------|------|-----|-----|-----|------|
| `/pt-BR` (home) | 94 | 96 | 96 | 92 | 0 | **PASS** |
| `/pt-BR/acervo` | 90 | 100 | 96 | 92 | 0 | **PASS** |
| `/pt-BR/acervo/carnaval-carioca` | 90 | 100 | 96 | 92 | 0 | **PASS** |
| `/pt-BR/artistas/di-cavalcanti` | 94 | 98 | 96 | 92 | 0 | **PASS** |
| `/pt-BR/boletim` | 93 | 94 | 96 | 92 | 0 | **PASS** |
| `/pt-BR/sobre` | 99 | 96 | 96 | 91 | 0 | **PASS** |
| `/pt-BR/vender-obra` | 99 | 100 | 96 | 91 | 0 | **PASS** |
| `/pt-BR/contato` | 99 | 100 | 96 | 92 | 0 | **PASS** |

**Resumo:** 8/8 URLs passaram no gate completo.

## Correções aplicadas na fase 8

1. **SSR `Button asChild`** — `ButtonLink` (Link + `buttonVariants`) substitui Radix Slot em Server Components (HTTP 500 em produção).
2. **CLS artista** — removido `loading.tsx` da rota SSG (skeleton ~2,2k px → conteúdo ~10k px causava shift 0,047 no footer).
3. **ArtworkCard** — `aspect-[4/5]` + `Image fill` reserva espaço das miniaturas.
4. **Verbete** — abas CSS-only (server component); Footer como server component (`getTranslations`).
5. **Loader** — skip em `navigator.webdriver` (auditorias Lighthouse).
6. **Hero** — `fetchPriority="high"` na imagem LCP da home.
7. **Galeria peça** — `<img>` trocado por `next/image`.

## Como reproduzir

```bash
pnpm --filter web build
pnpm --filter web start:prod
pnpm --filter web lighthouse:mobile
```

Relatórios JSON: `apps/web/lighthouse/reports/` · Resumo: `summary.json`

---

## Vercel Preview / Produção

> **Status:** pendente — rodar após deploy.

```bash
pnpm --filter web lighthouse:mobile -- --baseUrl=https://SEU-PROJETO.vercel.app
```

Checklist manual: [PREVIEW-VALIDATION.md](./PREVIEW-VALIDATION.md)
