# Validação manual — Vercel Preview

Use após o primeiro deploy preview. Substitua `PREVIEW_URL` pela URL real (ex: `https://cabral-e-souza-xxx.vercel.app`).

## Setup

- [ ] `NEXT_PUBLIC_SITE_URL` na Vercel = URL do preview (atualizar após cada deploy se a URL mudar)
- [ ] Variáveis Supabase, Resend, webhooks e `ADMIN_EMAILS` configuradas
- [ ] Redeploy após alterar env vars

---

## Navegação e conteúdo

| # | Teste | URL | OK |
|---|-------|-----|-----|
| 1 | Home carrega sem flash de layout | `PREVIEW_URL/pt-BR` | ☐ |
| 2 | Acervo lista as 10 peças do seed | `PREVIEW_URL/pt-BR/acervo` | ☐ |
| 3 | Filtro de categoria funciona | `PREVIEW_URL/pt-BR/acervo?categoria=...` | ☐ |
| 4 | Página de peça + galeria | `PREVIEW_URL/pt-BR/acervo/carnaval-carioca` | ☐ |
| 5 | Lightbox — clique abre, Esc fecha, setas navegam | (na peça acima) | ☐ |
| 6 | Verbete artista + markdown | `PREVIEW_URL/pt-BR/artistas/di-cavalcanti` | ☐ |
| 7 | Boletim — 2 posts | `PREVIEW_URL/pt-BR/boletim` | ☐ |
| 8 | Sobre | `PREVIEW_URL/pt-BR/sobre` | ☐ |
| 9 | Serviços | `PREVIEW_URL/pt-BR/servicos` | ☐ |
| 10 | Como funciona | `PREVIEW_URL/pt-BR/como-funciona` | ☐ |
| 11 | Contato | `PREVIEW_URL/pt-BR/contato` | ☐ |
| 12 | Privacidade | `PREVIEW_URL/pt-BR/privacidade` | ☐ |
| 13 | Termos | `PREVIEW_URL/pt-BR/termos` | ☐ |

---

## Formulários (dados de teste — grava no Supabase real)

| # | Teste | URL | OK |
|---|-------|-----|-----|
| 14 | Vender obra — envio completo | `PREVIEW_URL/pt-BR/vender-obra` | ☐ |
| 15 | Tenho interesse (peça) | `PREVIEW_URL/pt-BR/acervo/carnaval-carioca` | ☐ |

Sugestão de dados de teste: nome `Teste Preview`, email `preview-test+YYYYMMDD@seu-dominio.com`, telefone fictício.

---

## Cookie banner

| # | Teste | OK |
|---|-------|-----|
| 16 | Primeira visita (aba anônima): banner visível, fixo no rodapé | ☐ |
| 17 | Após aceitar/rejeitar + reload: banner não aparece | ☐ |

---

## Erros e SEO técnico

| # | Teste | URL | OK |
|---|-------|-----|-----|
| 18 | 404 estilizada | `PREVIEW_URL/pt-BR/url-inexistente` | ☐ |
| 19 | robots.txt — bloqueia `/admin/`, `/vr/`, `/en-US/`, `/fr-FR/` | `PREVIEW_URL/robots.txt` | ☐ |
| 20 | sitemap.xml acessível | `PREVIEW_URL/sitemap.xml` | ☐ |
| 21 | `/en-US` e `/fr-FR` com `noindex` (view-source) | `PREVIEW_URL/en-US` | ☐ |

---

## JSON-LD — Rich Results Test (manual)

Validar em https://search.google.com/test/rich-results

| Página | URL para testar |
|--------|-----------------|
| Home (LocalBusiness) | `PREVIEW_URL/pt-BR` |
| Peça (VisualArtwork) | `PREVIEW_URL/pt-BR/acervo/carnaval-carioca` |
| Artista (Person) | `PREVIEW_URL/pt-BR/artistas/di-cavalcanti` |
| Acervo (CollectionPage) | `PREVIEW_URL/pt-BR/acervo` |

---

## Lighthouse preview

```bash
pnpm --filter web lighthouse:mobile -- --baseUrl=https://SUA-PREVIEW.vercel.app
```

Resultados: `docs/audit/LIGHTHOUSE-RESULTS.md` (seção Vercel Preview).

---

## Próxima etapa (após gate Lighthouse)

- [ ] Login admin: `PREVIEW_URL/pt-BR/admin/login`
- [ ] Criar peça, viewing room, export CNART
- [ ] Validar fluxo completo no preview antes de `--prod`
