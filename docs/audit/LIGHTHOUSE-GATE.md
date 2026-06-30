# Lighthouse Gate — validação mobile (Fase 4)

Gate de qualidade antes do launch: **≥ 90** em Performance, Acessibilidade, Best Practices e SEO, com **CLS = 0**, medido em **build de produção** (não em `next dev`).

## URLs auditadas

| Rota | URL completa (locale pt-BR) |
|------|---------------------------|
| Home | `http://localhost:3000/pt-BR` |
| Acervo | `http://localhost:3000/pt-BR/acervo` |
| Peça (exemplo seed) | `http://localhost:3000/pt-BR/acervo/carnaval-carioca` |
| Artista (exemplo seed) | `http://localhost:3000/pt-BR/artistas/di-cavalcanti` |
| Boletim | `http://localhost:3000/pt-BR/boletim` |
| Contato | `http://localhost:3000/pt-BR/contato` |

Slugs de peça/artista podem variar conforme o seed do banco. Ajuste em `apps/web/lighthouse/config.json` se necessário.

## Pré-requisitos

1. **Node 20+** e **pnpm** instalados
2. **Google Chrome** instalado (Lighthouse usa Chrome headless)
3. `.env.local` configurado com Supabase válido (páginas dinâmicas precisam de dados)
4. Build de produção — **nunca** medir com Turbopack/dev server

## Passo a passo

### 1. Build e servidor de produção

Na raiz do monorepo:

```bash
pnpm --filter web build
pnpm --filter web start:prod
```

O servidor sobe em `http://localhost:3000`. Deixe este terminal aberto.

### 2. Suprimir cookie banner no teste automatizado

O script `lighthouse:mobile` envia o cookie HTTP `cs_cookie_consent` via `--extra-headers` (arquivo `lighthouse/consent-headers.json`) — o banner não é renderizado no SSR quando `decided: true`.

Para testes manuais no Chrome DevTools → Application → Cookies → `localhost`:

| Nome | Valor |
|------|-------|
| `cs_cookie_consent` | `%7B%22analytics%22%3Afalse%2C%22marketing%22%3Afalse%2C%22decided%22%3Atrue%7D` |

Ou no Console (define cookie + localStorage legado):

```javascript
document.cookie = 'cs_cookie_consent=' + encodeURIComponent(JSON.stringify({ analytics: false, marketing: false, decided: true })) + ';path=/;max-age=31536000;SameSite=Lax'
```

Recarregue a página.

### 3. Auditoria automatizada (CLI)

Em outro terminal:

```bash
pnpm --filter web lighthouse:mobile
```

Relatórios HTML/JSON em `apps/web/lighthouse/reports/`. Resumo em `summary.json`.

Testar uma URL isolada:

```bash
pnpm --filter web lighthouse:mobile -- --url=http://localhost:3000/pt-BR/acervo
```

Exit code `0` = todas as URLs passaram nos thresholds de `lighthouse/config.json`.

### 4. Auditoria manual (Chrome DevTools) — referência oficial

Útil para inspecionar oportunidades e confirmar CLS visualmente:

1. Abra `http://localhost:3000/pt-BR` no Chrome
2. DevTools → **Lighthouse**
3. Modo: **Navigation**
4. Device: **Mobile**
5. Categories: Performance, Accessibility, Best Practices, SEO
6. **Clear storage** desmarcado (para manter consent se já definido)
7. **Analyze page load**

Repita para as 6 URLs da tabela acima.

### 5. Critérios de aceite

| Métrica | Gate |
|---------|------|
| Performance | ≥ 90 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 90 |
| SEO | ≥ 90 |
| Cumulative Layout Shift (CLS) | **0** |

## Configuração

Thresholds e paths: `apps/web/lighthouse/config.json`

```json
{
  "baseUrl": "http://localhost:3000",
  "locale": "pt-BR",
  "paths": ["/", "/acervo", "/acervo/carnaval-carioca", "/artistas/di-cavalcanti", "/boletim", "/contato"],
  "thresholds": {
    "performance": 90,
    "accessibility": 90,
    "best-practices": 90,
    "seo": 90,
    "cumulative-layout-shift": 0
  }
}
```

## Troubleshooting

| Problema | Solução |
|----------|---------|
| `Chrome not found` | Instale Google Chrome ou defina `CHROME_PATH` |
| Páginas 500 / vazias | Verifique `.env.local` e conexão Supabase |
| CLS > 0 | Cookie banner, fontes ou imagens sem dimensão — verifique Network/Performance |
| Performance < 90 em localhost | Normal em máquina lenta; compare tendências entre páginas; valide em preview Vercel |
| `next dev` scores baixos | **Esperado** — use sempre `build` + `start` |

## Próximo passo (Fase 4)

- Micro-reveals com `prefers-reduced-motion`
- Spot-check teclado + leitor de tela
- Ajustes finos com base nos relatórios gerados

Relacionado: [AUDIT-001](./AUDIT-001.md)
