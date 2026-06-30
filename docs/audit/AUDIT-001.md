# AUDIT-001 — Lapidação qualidade máxima (site público)

**Data:** 2026-06-30  
**Auditor:** Revisão estática de código + smoke local (dev server)  
**Escopo:** `apps/web` — todas as rotas públicas em `(public)/`  
**Referências de benchmark:** David Zwirner, Hauser & Wirth, Almeida & Dale  
**Status:** Aguardando aprovação do plano de execução — **nenhuma correção implementada neste commit**

---

## Resumo executivo

O site tem **base visual sólida** (tipografia Cormorant + Inter, paleta ink/paper/accent, componentes consistentes) e **conteúdo institucional de alto nível** nos seeds. Porém, está **abaixo do padrão premium** em quatro frentes bloqueantes:

1. **i18n cosmético** — troca de idioma altera nav/footer, mas ~95% do conteúdo permanece em PT-BR.
2. **Dados de contato conflitantes** — endereço e email diferentes entre footer e página Contato.
3. **SEO técnico incompleto** — sem `sitemap.xml`, `robots.txt`, hreflang, Twitter Cards; Schema.org parcial.
4. **Renderização de conteúdo quebrada** — verbetes de artistas e markdown institucional (tabelas, links) não renderizam corretamente.

**Lighthouse mobile ≥ 90 em todas as páginas:** não validado nesta auditoria (Lighthouse em dev com Turbopack expirou por timeout). Recomenda-se medição em **build de produção** antes do gate de launch.

---

## Legenda de severidade

| Nível | Critério |
|-------|----------|
| **Crítico** | Dados errados, funcionalidade quebrada, SEO/i18n fundamental ausente, bloqueia confiança ou conversão |
| **Alto** | Degrada experiência premium, acessibilidade, SEO ou UX de forma significativa |
| **Médio** | Fricção perceptível; não impede uso mas afasta referências de galeria internacional |
| **Baixo** | Polish, microcopy, nice-to-have |

---

## 1. HOME (`app/[locale]/(public)/page.tsx`)

| Sev. | Problema | Localização | Solução proposta |
|------|----------|-------------|------------------|
| Alto | Hero **somente tipográfico** — sem obra, vídeo ou imagem editorial; referências premium usam arte como âncora visual imediata | `page.tsx:28-66` | Adicionar hero com imagem full-bleed ou split (obra em destaque + tipografia); LCP com `priority` + `sizes` explícitos |
| Alto | Copy e stats **hardcoded em PT**; chaves i18n em `messages/*.json` (`hero`, `stats`) não são usadas — drift com EN/FR | `page.tsx:32-85` vs `messages/pt-BR.json:19-33` | Migrar para `getTranslations`; unificar números (hoje seed diz "10+" obras, messages diz "+500") |
| Médio | Strip de credenciais **"10+ Obras"** subverte credibilidade (parece placeholder) | `page.tsx:73` | Usar métrica real ou formulção qualitativa ("Acervo selecionado") até catálogo crescer |
| Médio | Transições entre seções **abruptas** — sem ritmo scroll/reveal entre hero → stats → acervo | `page.tsx` (seções inteiras) | Espaçamento vertical maior entre blocos de fundo diferente; opcional `prefers-reduced-motion` reveal |
| Médio | Grid destaques `gap-y-12` adequado no desktop; mobile **1 coluna** pode parecer longo sem respiro entre cards | `page.tsx:108` | `gap-y-14` mobile ou destaque editorial assimétrico (1+2) |
| Baixo | Cards artistas: hover `grayscale-0` + `scale-[1.03]` — **ligeiramente exagerado** vs galerias de referência | `components/artwork/ArtistCard.tsx:27` | Reduzir scale para `1.015`; overlay apenas, sem grayscale toggle |
| Baixo | CTA final "Tem uma obra para vender?" — tom **neutro**, não agressivo; poderia ser mais convidativo | `page.tsx:190-201` | Copy: "Possui uma obra que merece avaliação cuidadosa?" + subcopy reforçando confidencialidade |
| Médio | Mobile: `text-[clamp(2.75rem,7vw,6rem)]` no H1 — testar **linhas quebradas** em viewports 320px | `page.tsx:36` | Ajustar `max-width` em ch ou reduzir clamp mínimo |
| Alto | Metadata sem `openGraph` / `twitter` / `alternates.canonical` | `page.tsx:12-16` | Metadata helper compartilhado com OG image padrão da galeria |

---

## 2. ACERVO (`app/[locale]/(public)/acervo/page.tsx`)

| Sev. | Problema | Localização | Solução proposta |
|------|----------|-------------|------------------|
| Crítico | Filtros **só por categoria** — `searchParams` suporta `artista`, `busca`, `pagina` mas **sem UI** | `page.tsx:8-14`, `40-45` vs `66-86` | Barra de busca + filtro por artista; paginação quando > 48 obras |
| Alto | Empty state **idêntico** para acervo vazio vs filtro sem resultado | `page.tsx:91-105` | Dois estados: "Nenhuma obra nesta categoria" + link limpar filtros vs acervo vazio |
| Médio | Filtros usam `<a href>` em vez de `Link` — **full reload** | `page.tsx:70-72` | `Link` do next-intl com `scroll: false` |
| Médio | Classe `no-scrollbar` **não definida** em CSS — scroll horizontal sem indicação visual | `page.tsx:68` | Definir utility ou mostrar fade/gradient nas bordas |
| Médio | Categoria no contador exibida **raw** (`pintura`) não localizada | `page.tsx:110` | Mapa de labels como `CATEGORIES` |
| Alto | SEO: metadata sem OG/Twitter/hreflang | `page.tsx:17-22` | Helper de metadata + `ItemList` JSON-LD opcional |
| Médio | Grid 4 colunas em XL — ratio 4/5 ok; mobile **gap-y-12** aceitável | `page.tsx:112` | Manter; validar com obras reais de proporções extremas |

---

## 3. PEÇA INDIVIDUAL (`app/[locale]/(public)/acervo/[slug]/page.tsx`)

| Sev. | Problema | Localização | Solução proposta |
|------|----------|-------------|------------------|
| Alto | **Zoom** escala imagem dentro de `overflow-hidden` — sem pan, UX frustrante em mobile | `components/artwork/ImageGallery.tsx:28-43` | Lightbox dedicado (Dialog fullscreen) ou biblioteca mínima; pinch-zoom mobile |
| Alto | Galeria sem **navegação por teclado** (←/→) entre imagens | `ImageGallery.tsx:59-87` | `useEffect` keydown + `aria-live` para imagem ativa |
| Médio | Hierarquia: preço aparece **antes** da ficha técnica — olho vai ao valor antes do contexto curatorial | `page.tsx:141-173` | Em obras premium, considerar ficha antes do preço ou preço mais discreto |
| Médio | Ficha técnica: `Categoria` exibe slug (`pintura`) | `page.tsx:161` | Label localizada |
| Médio | Breadcrumb usa sempre `title_pt` mesmo em EN/FR | `page.tsx:109` | Usar `title` localizado |
| Médio | `technique_pt`, `provenance_pt` sem fallback i18n | `page.tsx:158-195` | Campos `_*_en` / `_*_fr` ou fallback explícito |
| Alto | Schema `VisualArtwork` **incompleto**: falta `url`, `@id`, `inLanguage`, `image[]` múltiplas, `artworkSurface`, `BreadcrumbList` | `page.tsx:59-94` | Completar schema + breadcrumb JSON-LD separado |
| Médio | OG só em `generateMetadata` parcial (`images` sem `type`, `locale`) | `page.tsx:34-38` | OG completo + `twitter:card` summary_large_image |
| Baixo | CTAs LeadForm + WhatsApp bem posicionados; contraste OK | `page.tsx:227-234`, `LeadForm.tsx` | Manter; testar ordem mobile (form antes de comparáveis longos) |

---

## 4. ARTISTA (`app/[locale]/(public)/artistas/[slug]/page.tsx`)

| Sev. | Problema | Localização | Solução proposta |
|------|----------|-------------|------------------|
| Crítico | **Parser de markdown caseiro** não renderiza listas (`- item`), bold inline, links — verbetes seed têm listas extensas | `page.tsx:141-161` vs `packages/db/.../di-cavalcanti.ts:27-35` | Substituir por `MarkdownContent` ou MDX; unificar com boletim/institucional |
| Alto | Hero escuro sem foto: bloco vazio à direita quando `hero_image_url` ausente | `page.tsx:116-127` | Placeholder tipográfico ou obra representativa; layout single-column sem buraco |
| Alto | `grayscale` forçado na foto — pode **esmagar** retratos com pouco contraste | `page.tsx:123` | Remover grayscale ou aplicar só no hover |
| Médio | Sidebar peças: CTA "Consultar" genérico | `page.tsx:213-225` | "Solicitar dossier" ou pré-preencher contato com nome do artista |
| Alto | Schema `Person` incompleto: falta `sameAs`, `worksFor`, `image` absoluta, `@id` | `page.tsx:53-65` | Completar + link para obras como `subjectOf` |
| Médio | Só mostra link "ver todo acervo" quando `pieces.length === 8` — limite arbitrário | `page.tsx:177` | Usar `totalCount` da query |

---

## 5. BOLETIM

### Listagem (`boletim/page.tsx`)

| Sev. | Problema | Localização | Solução proposta |
|------|----------|-------------|------------------|
| Médio | Listagem **sem imagens** — cards da home (`BoletimCard`) são mais atraentes | `page.tsx:44-74` vs `BoletimCard.tsx` | Reutilizar `BoletimCard` ou adicionar imagem hero do post |
| Baixo | Empty state uma linha seca | `page.tsx:41` | Estado ilustrado + CTA newsletter/contato |
| Alto | Sem Schema `Blog` / `CollectionPage` | `page.tsx` | JSON-LD na listagem |

### Post (`boletim/[slug]/page.tsx`)

| Sev. | Problema | Localização | Solução proposta |
|------|----------|-------------|------------------|
| Alto | Schema `Article` sem `image`, `mainEntityOfPage`, `dateModified`, `wordCount` | `page.tsx:33-48` | Completar Article |
| Alto | **Sem compartilhamento social** (OG ok parcial via metadata default) | `page.tsx` inteiro | Botões copy-link / WhatsApp / LinkedIn; OG image por post |
| Médio | Conteúdo só `content_pt` — sem locale EN/FR | `page.tsx:92` | Campos traduzidos ou fallback documentado |

---

## 6. PÁGINAS INSTITUCIONAIS (`sobre`, `servicos`, `como-funciona`, `contato`)

| Sev. | Problema | Localização | Solução proposta |
|------|----------|-------------|------------------|
| Crítico | **Endereço conflitante:** footer Copacabana vs contato Ipanema | `Footer.tsx` via `messages:38` vs `site-pages.ts:157-160` | Unificar com endereço canônico real; uma fonte de verdade |
| Crítico | **Email conflitante:** `contato@` (footer) vs `galeria@` (contato seed) | `messages/pt-BR.json:49` vs `site-pages.ts:171` | Definir email canônico; propagar em todo o site |
| Alto | `MarkdownContent` **não renderiza tabelas** — horário de atendimento em contato vira texto cru | `MarkdownContent.tsx:18-62`, `site-pages.ts:176-180` | Suporte a `\| table \|` ou substituir por HTML/componente `HoursTable` |
| Alto | Links markdown `[texto](url)` **não funcionam** | `MarkdownContent.tsx` | Parser de links inline |
| Médio | Tom de voz geral **bom** (alinhado `brand-voice.ts`); trecho "marketplace anônimo" em sobre é intencional contraste | `site-pages.ts:42` | Manter |
| Médio | **Sem CTA final** nas páginas institucionais (só conteúdo) | `lib/pages/institutional.tsx:21-41` | Bloco CTA padrão: contato / acervo / vender obra |
| Médio | Hierarquia: só H1 no hero — conteúdo longo sem nav lateral / sumário | `institutional.tsx:35-38` | TOC sticky para páginas > 3 seções |
| Alto | `ContactForm` usa `t('submitting')` — chave **inexistente** (deveria ser `sending`) | `ContactForm.tsx:122`, `messages/pt-BR.json:58` | Corrigir para `sending` ou adicionar chave |

---

## 7. VENDER OBRA (`vender-obra/page.tsx`)

| Sev. | Problema | Localização | Solução proposta |
|------|----------|-------------|------------------|
| Médio | Eyebrow **"Sourcing reverso"** — jargão interno, não premium | `page.tsx:34` | "Avaliação de obras" ou remover eyebrow |
| Médio | Formulário **single-step longo** — aceitável para B2B arte; multi-step reduz abandono em mobile | `SourcingForm.tsx:66-164` | Avaliar wizard 3 passos (dados → obra → fotos) em A/B |
| Médio | Trust signals **fracos** visualmente — "40 anos" só no parágrafo intro | `page.tsx:38-42` | Strip de credenciais (como home) acima do form |
| Médio | Upload: input file nativo — **sem preview**, sem contagem 3–8 | `SourcingForm.tsx:129-141` | Preview thumbnails + validação client-side antes do submit |
| Baixo | Copy persuasivo **forte** no H1 e intro | `page.tsx:35-42` | Manter tom; revisar "Sourcing" |

---

## 8. NAVEGAÇÃO GERAL

| Sev. | Problema | Localização | Solução proposta |
|------|----------|-------------|------------------|
| Alto | Header **sem estado ativo** no link da rota atual | `Header.tsx:42-50` | `usePathname` + underline persistente |
| Médio | Header fixo desde o topo — referências premium costumam **transição** scroll (transparente → sólido) | `Header.tsx:18-21` | `useScroll` para border/background |
| Médio | Footer links nav **hardcoded PT** ("Vender Obra") ignorando locale | `Footer.tsx:13-18` | `useTranslations('nav')` |
| Crítico | **CNPJ placeholder** `00.000.000/0001-00` | `Footer.tsx:6,152` | CNPJ real ou remover até ter valor |
| Médio | Locale switcher funciona; conteúdo **não traduz** — falsa expectativa | `LocaleSwitcher.tsx` + páginas | Ver seção i18n |
| Baixo | Cookie banner bem desenhado, delay 1.5s para LCP | `CookieBanner.tsx:41-42` | Conectar GA/Meta só após `cs:consent` |
| Crítico | **Sem páginas 404/500** estilizadas | ausente em `app/` | `not-found.tsx` + `error.tsx` no locale layout |
| Alto | **Sem loading states** (skeleton) | ausente `loading.tsx` | Skeletons para acervo, peça, artista |
| Baixo | Sem skip-link para `#main-content` | `layout.tsx:14` | Link "Ir para conteúdo" visually hidden |

---

## 9. PERFORMANCE

| Sev. | Problema | Localização | Solução proposta |
|------|----------|-------------|------------------|
| Alto | **Sem pasta `public/`** — favicon, apple-touch-icon, og-default ausentes | ausente | `app/icon.tsx` ou assets em `public/` |
| Médio | `next/image` com AVIF/WebP configurado | `next.config.ts:25-26` | OK — manter |
| Médio | `sizes` presentes na maioria dos cards; hero **sem imagem** | `PieceCard.tsx:35` | Ao adicionar hero image, `sizes="100vw"` |
| Médio | Fontes com `display: 'swap'` | `app/[locale]/layout.tsx:14,20` | OK; considerar `preload` da variante display principal |
| Alto | Dev com Turbopack + Lighthouse = timeout; **meta ≥90 não verificada** | N/A | `next build && next start` + Lighthouse CI em 6 URLs |
| Médio | Imagens sem `placeholder="blur"` / `blurDataURL` | `PieceCard.tsx`, `ImageGallery.tsx` | Gerar blur no upload ou placeholder estático |
| Médio | `prefers-color-scheme: dark` inverte tokens globalmente — **quebra** seções desenhadas para light | `packages/ui/tokens/colors.css:29-40` | Desabilitar dark automático no site público ou `color-scheme: light only` |
| Alto | Build produção **falha no lint** (admin) — bloqueia CI/CD | `SourcingLeadsTable.tsx:100` | Corrigir ESLint config ou regra |

---

## 10. ACESSIBILIDADE

| Sev. | Problema | Localização | Solução proposta |
|------|----------|-------------|------------------|
| Médio | Hero subcopy `rgba(250,250,247,0.6)` em fundo escuro — **pode falhar AA** em 14px | `page.tsx:41` | Aumentar opacidade para ≥ 0.75 ou `text-[--color-paper-muted]` token |
| Médio | Footer text `rgba(...,0.3)` no copyright — **contraste baixo** | `Footer.tsx:148-152` | Mínimo 0.45 opacity |
| Médio | `ContactForm` inputs sem `aria-invalid` / `aria-describedby` (LeadForm tem) | `ContactForm.tsx:62-105` | Paridade com `LeadForm.tsx:83-89` |
| Baixo | Alt text geralmente bom (`title` ou `alt_text_pt`); fallback `"retrato"` aceitável | `ArtistCard.tsx:24` | Enriquecer com período/obra quando disponível |
| Médio | Mobile menu drawer: quando fechado (`translate-x-full`), foco ainda pode escapar? | `MobileMenu.tsx:82-94` | `inert` ou `hidden` quando fechado; focus trap quando aberto |
| Baixo | `lang` no `<html>` correto por locale | `layout.tsx:46` | OK |
| Médio | Tabelas markdown inacessíveis (não renderizam como `<table>`) | `MarkdownContent.tsx` | Ver seção institucional |

---

## 11. SEO TÉCNICO

| Sev. | Problema | Localização | Solução proposta |
|------|----------|-------------|------------------|
| Crítico | **`sitemap.ts` ausente** | `app/` | Implementar com todas URLs públicas × locales |
| Crítico | **`robots.ts` ausente** | `app/` | Allow público; disallow `/admin`, `/api` |
| Crítico | **hreflang** não configurado | metadata em todas as pages | `alternates.languages` em helper |
| Alto | **Canonical** não definido por página | `app/layout.tsx:10` tem `metadataBase` | `alternates.canonical` por rota |
| Alto | OpenGraph + Twitter **só parcial** na peça | grep: só `acervo/[slug]` | Helper `buildPageMetadata()` |
| Alto | `LocalBusiness` / `ArtGallery` **não global** | ausente no layout | JSON-LD no layout público com NAP unificado |
| Alto | `BreadcrumbList` ausente onde há breadcrumb visual | peça, artista, boletim | JSON-LD espelhando `<nav aria-label="Breadcrumb">` |
| Médio | `generateStaticParams` de peça/artista **sem `locale`** | `acervo/[slug]/page.tsx:16-18` | Incluir locale para pré-render i18n |
| Médio | Títulos duplicam sufixo via template — OK | `layout.tsx:24-27` | Evitar "Acervo \| Cabral & Souza \| Cabral & Souza" |

---

## 12. COPY E TOM DE VOZ

| Sev. | Problema | Localização | Solução proposta |
|------|----------|-------------|------------------|
| Médio | "Conheça **nossos** artistas" — coloquial vs tom erudito | `page.tsx:124` | "Artistas do acervo" |
| Baixo | CTAs "Ver acervo completo →" — ok, não é "Saiba mais" | vários | OK |
| Médio | `messages` hero antigo ("Arte que atravessa o tempo") **diverge** do live ("Arte brasileira com rigor curatorial") | `messages` vs `page.tsx` | Uma fonte canônica |
| Baixo | Sem lorem ipsum detectado | — | OK |
| Médio | PieceCard sempre `title_pt` em listagens para usuário EN | `PieceCard.tsx:66` | Prop locale ou título localizado |

---

## 13. i18n (transversal — CRÍTICO)

| Sev. | Problema | Localização | Solução proposta |
|------|----------|-------------|------------------|
| Crítico | Apenas `nav`, `footer`, `lead_form`, `cookie` traduzidos; **páginas inteiras em PT** | todas `page.tsx` em `(public)/` | Plano de tradução: conteúdo DB (`_*_en`, `_*_fr`) + messages para UI chrome |
| Crítico | Locale switcher **cria falsa fluência** — URL muda, conteúdo não | `LocaleSwitcher.tsx:17-26` | Até traduzir: tooltip "Conteúdo em português" ou desabilitar EN/FR |
| Alto | `site_pages` seed só `*_pt` | `site-pages.ts` | Colunas EN/FR ou tradução via pipeline Claude |

---

## Plano de execução (priorizado)

### Fase 1 — Críticos (bloqueiam confiança e launch) — estimativa 3–5 dias

1. **Unificar dados canônicos** — endereço, email, CNPJ (footer, messages, site-pages seed).
2. **Corrigir renderização de conteúdo** — `MarkdownContent` com links + tabelas; artistas usando mesmo parser.
3. **Infra SEO** — `robots.ts`, `sitemap.ts`, helper metadata (canonical, OG, Twitter).
4. **Páginas de erro** — `not-found.tsx`, `error.tsx` estilizadas.
5. **Assets essenciais** — favicon, `og-default.jpg`, `metadataBase` validado.
6. **i18n gate** — decisão: traduzir conteúdo OU desabilitar locales até conteúdo pronto.

### Fase 2 — Altos (premium UX + SEO rico) — estimativa 4–6 dias

1. **Acervo** — filtros busca/artista, empty states, paginação.
2. **Schema.org completo** — VisualArtwork, Person, Article, LocalBusiness, BreadcrumbList.
3. **hreflang** em todas as rotas públicas.
4. **Hero home** — imagem editorial + metadata OG.
5. **ImageGallery** — lightbox com teclado e mobile.
6. **Header** — link ativo + comportamento scroll.
7. **Loading skeletons** nas rotas dinâmicas.
8. **Corrigir** `ContactForm` submitting + a11y inputs.
9. **Desabilitar dark mode** acidental no público.
10. **Build CI** — corrigir ESLint para `next build` passar.

### Fase 3 — Médios (lapidação visual/copy) — estimativa 3–4 dias

1. CTAs finais nas institucionais.
2. Boletim — cards com imagem + share buttons.
3. Vender obra — trust strip, preview de fotos, eyebrow copy.
4. Stats home realistas; unificar messages.
5. Ajustes hover artist cards; contraste footer/hero.
6. Skip link; mobile menu `inert`.
7. `PieceCard` títulos localizados.

### Fase 4 — Baixos + validação — estimativa 2 dias

1. Micro-reveals entre seções (com `prefers-reduced-motion`).
2. Lighthouse produção mobile em: `/`, `/acervo`, `/acervo/[slug]`, `/artistas/[slug]`, `/boletim`, `/contato` — gate **≥ 90** todas categorias, **CLS = 0**.
3. Auditoria manual teclado + VoiceOver/NVDA spot-check.

---

## Métricas de aceite (definição de "lapidado")

- [ ] Zero conflitos de dados de contato
- [ ] Verbetes e páginas institucionais renderizam listas, links e tabelas
- [ ] `sitemap.xml` e `robots.txt` válidos
- [ ] hreflang + canonical em 100% das páginas públicas
- [ ] Schema.org validado no [Rich Results Test](https://search.google.com/test/rich-results) para peça, artista, artigo
- [ ] Lighthouse mobile ≥ 90 (performance, a11y, SEO, best practices) em 6 URLs de produção
- [ ] CLS = 0 nas mesmas URLs
- [ ] Locale switcher coerente com conteúdo traduzido (ou desabilitado com transparência)

---

## Próximo passo

**Aguardando sua aprovação** do plano acima (fases e prioridades). Após OK, executar Fase 1 sem desvio de escopo.

Documento relacionado: [ADR 003 — Rotação de credenciais pré-deploy](../decisions/003-rotacao-credenciais-pre-deploy.md)
