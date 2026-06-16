# PROMPT MESTRE PARA O CURSOR IA — PROJETO CABRAL & SOUZA

> **Como usar:** Cole este arquivo inteiro no Cursor (com Claude Sonnet 4.6 ou superior selecionado) dentro do diretório `C:\Users\pc\Desktop\Projetos\cabral e souza`. Mantenha o arquivo `00_DOCUMENTO_ESTRATEGICO.md` e `02_SCHEMA_SUPABASE.sql` na pasta `docs/` antes de iniciar. Execute o prompt em etapas — uma seção por vez — confirmando o resultado antes de avançar. Não execute tudo de uma vez.

---

## CONTEXTO DO PROJETO (LEIA PRIMEIRO)

Você é um arquiteto sênior full-stack atuando em parceria com o desenvolvedor da Cabral & Souza Galeria de Arte. O projeto é uma operação digital de classe internacional para uma galeria brasileira histórica (fundada em 1987) que comercializa arte moderna e contemporânea brasileira de alto valor (ticket médio R$ 50.000, faixa R$ 5k–500k+).

Antes de escrever qualquer código:
1. **Leia integralmente** `docs/00_DOCUMENTO_ESTRATEGICO.md`.
2. **Leia o schema** em `docs/02_SCHEMA_SUPABASE.sql`.
3. **Confirme** ao desenvolvedor que entendeu o contexto antes de prosseguir.

Princípios não-negociáveis:
- **Posicionamento premium**: nada do que você criar pode parecer e-commerce de massa. Referências de qualidade visual: David Zwirner, Hauser & Wirth, Pace Gallery, Almeida & Dale.
- **Tom de voz**: erudito mas acessível, denso mas sem prolixidade, formal mas sem rigidez, autoridade técnica sem arrogância acadêmica. Anti-referência: linguagem de marketplace.
- **Acessibilidade**: WCAG AA mínimo.
- **Performance**: Lighthouse 95+ em todas as métricas no homepage e páginas de peça.
- **SEO**: Schema.org `VisualArtwork`, `Person`, `LocalBusiness`, `Article` corretamente implementados em todas as páginas relevantes.
- **i18n**: PT-BR (default), EN-US, FR-FR. Cache de tradução por content_hash (nunca traduzir runtime).
- **Privacidade**: LGPD desde o dia 1. Política e Termos no rodapé.
- **Sem framework de UI pesado**: Tailwind v4 + shadcn/ui + Radix Primitives. Nada de Material UI ou Bootstrap.

---

## STACK CANÔNICA

```
Linguagem:       TypeScript (strict mode em todos os pacotes)
Framework:       Next.js 15 (App Router, RSC, Server Actions)
Estilo:          Tailwind CSS v4 + design tokens em CSS variables
UI primitives:   shadcn/ui + Radix
Database:        Supabase Postgres + pgvector
Auth:            Supabase Auth (magic link para admin e proveniência)
Storage:         Supabase Storage (imagens + KYC docs)
IA:              Anthropic Claude API (claude-sonnet-4-6) — tradução, dossiê, RAG, agente
Embeddings:      OpenAI text-embedding-3-small (1536 dim) OU Voyage AI (mais barato)
PDF:             react-pdf (preferencial) ou Puppeteer
Email:           Resend (free tier 3k/mês)
WhatsApp:        WPPConnect rodando em VPS
Deploy web:      Vercel (Hobby/Free no início)
Deploy bot:      VPS Hetzner/DigitalOcean (free credits)
Monorepo:        Turborepo
Package mgr:     pnpm
Validação:       Zod
Forms:           React Hook Form + Zod
Analytics:       GA4 + Meta Pixel + Vercel Analytics
Monitoring:      Sentry (free tier)
```

---

## ESTRUTURA DE PASTAS A CRIAR

```
cabral-e-souza/
├── apps/
│   ├── web/                         # Site público + admin
│   │   ├── app/
│   │   │   ├── [locale]/
│   │   │   │   ├── (public)/
│   │   │   │   │   ├── page.tsx                    # Home
│   │   │   │   │   ├── acervo/
│   │   │   │   │   │   ├── page.tsx                # Listagem
│   │   │   │   │   │   └── [slug]/page.tsx         # Peça individual
│   │   │   │   │   ├── artistas/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [slug]/page.tsx         # Verbete do artista
│   │   │   │   │   ├── boletim/                    # Análises de leilão / blog
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [slug]/page.tsx
│   │   │   │   │   ├── sobre/page.tsx
│   │   │   │   │   ├── servicos/page.tsx
│   │   │   │   │   ├── como-funciona/page.tsx      # Protocolo antifraude e logística
│   │   │   │   │   ├── vender-obra/page.tsx        # Landing sourcing reverso
│   │   │   │   │   ├── contato/page.tsx
│   │   │   │   │   ├── privacidade/page.tsx
│   │   │   │   │   └── termos/page.tsx
│   │   │   │   ├── vr/
│   │   │   │   │   └── [token]/page.tsx            # Viewing Room privado
│   │   │   │   └── admin/                          # Painel administrativo
│   │   │   │       ├── layout.tsx                  # Auth guard
│   │   │   │       ├── page.tsx                    # Dashboard com KPIs
│   │   │   │       ├── pecas/
│   │   │   │       ├── artistas/
│   │   │   │       ├── viewing-rooms/
│   │   │   │       ├── leads/
│   │   │   │       ├── boletim/
│   │   │   │       └── compliance/                 # Relatórios CNART/COAF
│   │   │   ├── api/
│   │   │   │   ├── revalidate/
│   │   │   │   ├── webhooks/
│   │   │   │   └── cron/                           # Scrapers de leilão, relatórios
│   │   │   ├── sitemap.ts
│   │   │   ├── robots.ts
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   ├── styles/
│   │   ├── public/
│   │   ├── middleware.ts                           # i18n routing
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   └── proveniencia/                               # Subdomínio do agente
│       └── (estrutura similar, menor)
├── packages/
│   ├── db/
│   │   ├── migrations/
│   │   ├── seed/
│   │   ├── types.ts                                # Geradas via supabase-js
│   │   └── client.ts
│   ├── ui/                                         # Design system
│   │   ├── components/
│   │   ├── tokens/
│   │   └── tailwind-preset.ts
│   ├── claude/
│   │   ├── translate.ts
│   │   ├── dossier.ts
│   │   ├── provenance-agent.ts
│   │   ├── whatsapp-bot.ts
│   │   └── prompts/                                # System prompts versionados
│   └── shared/
│       ├── schemas/                                # Zod schemas
│       ├── types/
│       └── utils/
├── services/
│   └── whatsapp-bot/
│       ├── src/
│       └── Dockerfile
├── docs/
│   ├── 00_DOCUMENTO_ESTRATEGICO.md
│   ├── 01_PROMPT_CURSOR.md
│   ├── 02_SCHEMA_SUPABASE.sql
│   ├── 03_CHECKLIST_15_DIAS.md
│   ├── contratos/
│   ├── compliance/
│   └── marca/
├── .env.example
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

## SISTEMA DE DESIGN — TOKENS BASE

Crie em `packages/ui/tokens/` os tokens abaixo. **Estes são tokens iniciais — o usuário pode ajustar via Claude Design depois.**

```css
/* packages/ui/tokens/colors.css */
:root {
  /* Paleta principal — neutros refinados */
  --color-ink: #0A0A0A;              /* Texto principal */
  --color-ink-muted: #4A4A4A;        /* Texto secundário */
  --color-ink-subtle: #8A8A8A;       /* Texto terciário */
  --color-paper: #FAFAF7;            /* Background principal — off-white quente */
  --color-paper-muted: #F2F1EC;      /* Background de seção */
  --color-paper-deep: #E8E6DF;       /* Borders sutis */

  /* Acento único — dourado envelhecido (referência a moldura clássica) */
  --color-accent: #8B7355;
  --color-accent-deep: #5C4A36;

  /* Estados */
  --color-success: #4A6B3D;
  --color-warning: #B8895A;
  --color-danger: #8B3A2E;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-ink: #FAFAF7;
    --color-ink-muted: #B8B6AD;
    --color-paper: #1A1A18;
    --color-paper-muted: #242420;
  }
}
```

```css
/* packages/ui/tokens/typography.css */
:root {
  /* Famílias — serifa elegante para títulos, sans neutra para corpo */
  --font-display: 'GT Sectra', 'Editorial New', Georgia, serif;
  --font-body: 'Söhne', 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Escala tipográfica baseada em razão áurea adaptada */
  --text-xs: 0.75rem;       /* 12px — caption */
  --text-sm: 0.875rem;      /* 14px — small */
  --text-base: 1rem;        /* 16px — body */
  --text-lg: 1.125rem;      /* 18px — body large */
  --text-xl: 1.5rem;        /* 24px — h4 */
  --text-2xl: 2rem;         /* 32px — h3 */
  --text-3xl: 2.75rem;      /* 44px — h2 */
  --text-4xl: 4rem;         /* 64px — h1 / hero */
  --text-5xl: 6rem;         /* 96px — display */

  /* Leading */
  --leading-tight: 1.1;
  --leading-snug: 1.3;
  --leading-normal: 1.6;
  --leading-loose: 1.8;     /* para texto longo de verbete */

  /* Tracking */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.04em;
  --tracking-wider: 0.12em; /* caps */
}
```

```css
/* packages/ui/tokens/spacing.css */
:root {
  --space-1: 0.25rem;   /* 4 */
  --space-2: 0.5rem;    /* 8 */
  --space-3: 0.75rem;   /* 12 */
  --space-4: 1rem;      /* 16 */
  --space-6: 1.5rem;    /* 24 */
  --space-8: 2rem;      /* 32 */
  --space-12: 3rem;     /* 48 */
  --space-16: 4rem;     /* 64 */
  --space-24: 6rem;     /* 96 */
  --space-32: 8rem;     /* 128 */

  --container-narrow: 720px;
  --container-default: 1200px;
  --container-wide: 1440px;
  --container-full: 1680px;

  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
}
```

**Princípios de uso:**
- Espaços generosos. Nunca empilhar conteúdo sem respiração.
- Tipografia serifada sempre para nomes de artistas, títulos de obras, headings.
- Sans-serif neutra para corpo e UI.
- Imagens em viewport completo no detalhe da peça, com zoom obrigatório.
- Animações sutis (200–400ms ease-out), nunca espetaculares.
- Cursor customizado opcional em hover de imagens de obras (`zoom-in`).

---

## ETAPAS DE EXECUÇÃO

### ETAPA 0 — Setup do monorepo
1. Inicialize Turborepo com pnpm workspaces.
2. Crie a estrutura de pastas conforme árvore acima.
3. Configure TypeScript strict em todos os pacotes.
4. Configure ESLint + Prettier compartilhados.
5. Crie `.env.example` com todas as variáveis necessárias.
6. Configure Tailwind v4 com preset compartilhado em `packages/ui/tailwind-preset.ts`.

**Entregue ao desenvolvedor:**
- Comandos exatos para ele rodar no PowerShell:
  - `pnpm install`
  - `pnpm dev`
- Lista de variáveis de ambiente que ele precisa configurar antes do primeiro run.

### ETAPA 1 — Banco de dados
1. Crie o projeto Supabase via instrução ao desenvolvedor (free tier).
2. Aplique o schema completo de `docs/02_SCHEMA_SUPABASE.sql`.
3. Gere os tipos TypeScript em `packages/db/types.ts` via comando `supabase gen types typescript`.
4. Crie o cliente Supabase em `packages/db/client.ts` (server e browser separados).
5. Crie seeds básicos com os 5 artistas-âncora confirmados:
   - Di Cavalcanti (1897–1976)
   - Pedro Américo (1843–1905)
   - Djanira (1914–1979)
   - Alfredo Volpi (1896–1988)
   - Sergio Camargo (1930–1990)

**Comandos para o desenvolvedor:**
- Comandos de migration entregues em texto para ele rodar no Supabase Studio.

### ETAPA 2 — Layout e navegação base
1. Implemente o `RootLayout` com tipografia carregada via `next/font` (Söhne ou alternativa free como Inter).
2. Header minimalista: logo wordmark à esquerda, navegação central, idioma + buscar à direita.
3. Footer com: endereço físico, contato, redes sociais (placeholders), CNPJ, link CNART/IPHAN, política de privacidade, termos.
4. Cookie banner LGPD (consentimento granular: essenciais / analytics / marketing).
5. Middleware de i18n com detecção por header `Accept-Language` + override em cookie.

### ETAPA 3 — Catálogo público
1. Página `/acervo` com grid de peças filtráveis (por artista, técnica, período, faixa de preço).
2. Página `/acervo/[slug]` da peça individual com:
   - Galeria de imagens em alta (zoom obrigatório).
   - Ficha técnica completa.
   - Histórico de proveniência (quando disponível).
   - Documentos anexos (COA, laudos).
   - Comparáveis de leilão (quando preenchidos).
   - Texto curatorial.
   - CTA "Tenho interesse" (form) + "Falar no WhatsApp" (link).
   - Schema.org `VisualArtwork` em JSON-LD.
   - Faixa de preço pública abaixo de R$ 20.000; "sob consulta" acima.
3. Página `/artistas/[slug]` (verbete) com biografia, escola, mercado, comparáveis, peças disponíveis na galeria, Schema.org `Person`.

### ETAPA 4 — Admin
1. Login via Supabase Auth (magic link, restrito a emails autorizados).
2. CRUD de peças com upload múltiplo de imagens (drag-and-drop), sharp para gerar variantes (thumbnail, medium, large, AVIF + WebP).
3. Editor de ficha técnica com campos do CNART explicitamente identificados.
4. Status de visibilidade da peça com seletor visual.
5. CRUD de artistas (verbetes editáveis em Markdown com preview).
6. CRUD de posts do boletim.
7. Gerenciador de leads.
8. Gerador de viewing room (multi-select de peças + mensagem personalizada + expiração + token único).
9. Dashboard com KPIs (sessões, leads, viewing rooms abertos, peças mais visualizadas, conversões).
10. Relatório de exportação semestral CNART em CSV.

### ETAPA 5 — Viewing Room
1. Rota dinâmica `/vr/[token]` sem auth (acesso por token).
2. Layout dedicado: mensagem personalizada do executor, peças em galeria vertical com tipografia generosa.
3. CTAs: "Tenho interesse na peça X", "Marcar visita", "Falar no WhatsApp".
4. Tracking: registrar abertura, tempo por peça, scroll depth, downloads, compartilhamentos.
5. Eventos enviados para `viewing_room_events` no Supabase em tempo real.
6. Painel no admin mostrando atividade de cada VR enviado.

### ETAPA 6 — Tradução
1. Implementar `packages/claude/translate.ts` com função que:
   - Recebe `content_hash`, `text`, `target_language`.
   - Verifica cache no Supabase.
   - Se não existe, chama Claude API com system prompt do tom de voz.
   - Salva no cache e retorna.
2. Aplicar em todos os campos traduzíveis: descrições de peça, verbetes, posts do boletim, páginas institucionais.
3. Pipeline: ao editar campo PT em admin → marcar `needs_retranslation = true` para EN/FR → cron diário traduz pendentes em lote (economiza Claude API).

### ETAPA 7 — Dossiê PDF
1. Implementar `packages/claude/dossier.ts`:
   - Recebe `piece_id`.
   - Busca dados da peça, artista, comparáveis.
   - Gera textos curatoriais com Claude API (sob system prompt de tom de voz).
   - Renderiza PDF via `react-pdf`.
   - Salva em Supabase Storage e retorna URL temporária assinada (válida 7 dias).
2. Acionado quando lead envia "Tenho interesse" → PDF chega por email automaticamente via Resend.
3. Layout do PDF: capa visual, ficha técnica, biografia do artista, proveniência, comparáveis, análise de mercado, contato.

### ETAPA 8 — Sourcing reverso
1. Página `/vender-obra` com SEO otimizado para termos de captação.
2. Formulário multi-step com:
   - Step 1: contato (nome, email, telefone).
   - Step 2: tipo de obra + artista + dimensões + técnica.
   - Step 3: upload de fotos (mínimo 3, máximo 8).
   - Step 4: histórico de aquisição + expectativa de valor + contexto.
3. Lead salvo em `sourcing_leads` com status `aguardando_analise`.
4. Email automático para o executor + auto-resposta para o vendedor com prazo de 5 dias.
5. Botão no admin "Rodar análise preliminar" → dispara o agente de proveniência com os dados do lead.

### ETAPA 9 — Agente de proveniência (subdomínio)
1. App separado em `apps/proveniencia` com layout próprio.
2. Auth restrita por magic link a emails autorizados (executor + sócios).
3. Formulário estruturado de entrada (foto principal, assinatura, verso, detalhes, dados conhecidos).
4. Processamento:
   - Claude Vision analisa imagens (assinatura, técnica, estado de conservação).
   - Claude Sonnet com web search pesquisa catálogos online, leilões, museus.
   - Cruza dados com `auction_comparables` e `artist_signatures` no banco.
5. Output: relatório PDF estruturado com nível de confiança (0–100%), hipóteses ordenadas, fontes a investigar adicionalmente, comparáveis encontrados, estimativa de valor, alertas (peça com lei do período monárquico, possível restrição IPHAN, etc.).
6. Log de cada execução (custo de tokens, tempo, output).

### ETAPA 10 — Bot WhatsApp (`services/whatsapp-bot`)
1. Setup WPPConnect (Docker) com persistência de sessão em volume.
2. Endpoint `/webhook/message` recebe mensagens.
3. Classificador (Claude) decide categoria:
   - Saudação / qualificação inicial → coleta nome, interesse, perfil.
   - Pergunta sobre peça específica → RAG no pgvector → resposta Claude com tom de voz.
   - Pergunta sobre artista/mercado → RAG nos verbetes → resposta Claude.
   - Intenção de compra alta → hand-off ao executor (notificação + flag no admin).
   - Fora de escopo → mensagem educada de transferência humana.
4. Conversa salva em `whatsapp_conversations` com tracking de turnos.
5. Painel no admin para acompanhar conversas em tempo real e assumir manualmente.

### ETAPA 11 — Conteúdo inicial
1. Escrever 8 verbetes de artistas com Claude API (revisão pelo executor antes de publicar):
   - Di Cavalcanti, Volpi, Djanira, Sergio Camargo, Pedro Américo (confirmados).
   - + 3 a confirmar com sócios (sugestões: Iberê Camargo, Pancetti, Guignard).
2. Criar 10 peças placeholder no admin com fichas técnicas completas baseadas em obras conhecidas de cada artista (sem inventar — usar dados públicos de catálogos raisonné e leilões registrados).
3. Escrever 2 análises de leilão recentes para o `/boletim/`.
4. Criar páginas institucionais (Sobre, Serviços, Como Funciona, Contato).

### ETAPA 12 — SEO, analytics, compliance, lançamento
1. Configurar GA4 + Meta Pixel + Vercel Analytics.
2. Submeter sitemap ao Google Search Console.
3. Otimizar Google Meu Negócio (categoria "Art gallery", fotos profissionais da galeria, posts iniciais).
4. Política de Privacidade + Termos de Uso + Cookie Banner.
5. Implementar relatório semanal automático (PDF gerado segunda-feira de manhã via cron + Resend para os sócios).
6. Lighthouse audit final — corrigir até score 95+.
7. Lançamento.

---

## REGRAS DE CÓDIGO

1. **Server Components por padrão**. Client Components só quando estritamente necessário (interatividade, hooks).
2. **Server Actions** para mutations. Sem API routes desnecessárias.
3. **Zod everywhere**: todo input validado, todo response tipado.
4. **Não usar `any`**. Quando ESLint reclamar, refatore.
5. **Imagens otimizadas**: `next/image` com `sizes` explícito em toda imagem above-the-fold.
6. **Fontes locais** ou via `next/font` com `display: swap`.
7. **Acessibilidade**: `alt` em toda imagem (não vazio), `aria-label` em botões sem texto, `role` quando necessário, contraste mínimo 4.5:1.
8. **Componentes pequenos**: max 200 linhas. Acima disso, decompor.
9. **Comentários só onde o "porquê" não é óbvio**. Nada de comentário óbvio.
10. **Commits** em português, claros, no padrão Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).

---

## VARIÁVEIS DE AMBIENTE (`.env.example`)

```bash
# Public
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://cabralesouza.com.br

# Server only
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=                   # para embeddings (alternativa: VOYAGE_API_KEY)
RESEND_API_KEY=
GA4_MEASUREMENT_ID=
META_PIXEL_ID=

# WhatsApp bot (service separado)
WPP_SESSION_NAME=cabralesouza
WPP_WEBHOOK_URL=https://cabralesouza.com.br/api/webhooks/whatsapp
WPP_SHARED_SECRET=                # HMAC entre bot e site

# Compliance
ADMIN_EMAILS=                     # Lista separada por vírgula com emails autorizados ao admin
```

---

## INSTRUÇÕES FINAIS PARA O CURSOR

1. **Sempre confirme** antes de executar comandos shell ou criar arquivos críticos.
2. **Nunca rode** comandos no terminal. **Devolva ao desenvolvedor** os comandos exatos para ele executar manualmente no PowerShell, marcados em bloco de código.
3. **Documente decisões** importantes em `docs/decisions/NNN-titulo.md` (estilo ADR — Architecture Decision Record).
4. **Teste cada etapa** localmente antes de marcar como concluída.
5. **Reporte progresso** a cada etapa concluída com checklist do que foi feito + próximo passo proposto.
6. **Quando bater em dúvida** que afete posicionamento de marca (cor, tom, copy, tipografia), pare e pergunte. Nunca decida sozinho sobre marca.

**Pronto. Comece pela Etapa 0 e confirme com o desenvolvedor antes de avançar.**
