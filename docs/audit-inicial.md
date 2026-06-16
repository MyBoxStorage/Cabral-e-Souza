# Auditoria inicial do repositório — Cabral & Souza

**Data:** 2026-06-16  
**Escopo desta auditoria:** mapear o que existe hoje no repositório, identificar o que pode ser reaproveitado (UI/componentes, tipografia/estilo, conteúdo textual e decisões já “boas”), e registrar recomendações objetivas de próximos passos.

---

## 1) Visão geral (o que é o projeto hoje)

- **Tipo:** site institucional **100% estático**, em **arquivo único** (`index.html`) com CSS e JS inline.
- **Stack:** **HTML + CSS + JavaScript vanilla** (sem build, sem dependências, sem backend).
- **Entrega atual:** landing page completa com seções, navegação por âncoras, animações/reveal, CTA para WhatsApp e formulário que abre WhatsApp com mensagem pré-preenchida.
- **Documentação paralela:** há um conjunto de docs (`docs/`) descrevendo uma **fase 2** bem mais ambiciosa (Next.js + Supabase + automações + IA), que ainda **não está implementada** no código do repo.

---

## 2) Inventário do repositório (o que está “lá”)

### 2.1 Estrutura e arquivos relevantes

- **`index.html`**
  - **Conteúdo:** toda a landing (markup), **CSS completo** (tokens + layout + responsivo) e **JS** (preloader, navbar, reveal, smooth scroll, submit do form).
  - **Padrões visuais:** paleta “cream/ink/gold”, tipografia serifada premium, microinterações.
- **`README.md`**
  - Explica como rodar localmente (sem build), descreve assets e stack.
- **`AUDITORIA-PROJETO.md`**
  - Auditoria técnica anterior (2025), já listando: pontos fracos, melhorias recomendadas e o que estava funcionando.
- **`docs/00_DOCUMENTO_ESTRATEGICO.md`**
  - Documento estratégico e plano de execução (com stack “autorizada” e visão do produto).
- **`docs/01_PROMPT_CURSOR.md`**
  - “Prompt mestre” para iniciar a fase 2 (monorepo Next.js, i18n, Supabase, etc.).
- **`docs/02_SCHEMA_SUPABASE.sql`**
  - Schema completo (Postgres/Supabase) para catálogo, leads, viewing rooms, traduções, compliance, WhatsApp, etc.
- **`docs/03_CHECKLIST_15_DIAS.md`**
  - Checklist operacional da fase 2 (setup e execução em 15 dias).
- **Imagens e assets na raiz**
  - Imagens **locais** usadas no site (PNG/WEBP).
  - **Screenshots** (“Captura de tela …”) e alguns arquivos que **não aparecem referenciados** no `index.html` (potenciais órfãos).
- **`.gitignore`**
  - Ignora `.env*`, `node_modules/`, screenshots, `.vscode/`, `*.code-workspace`, etc.

### 2.2 O que NÃO existe (ainda)

- Sem `package.json`, sem `src/`, sem pipeline de build.
- Sem Next.js/Supabase no código atual (apenas docs para essa direção).
- Sem organização de componentes em arquivos reutilizáveis (tudo está concentrado em `index.html`).

---

## 3) O que dá para reaproveitar imediatamente (alto valor)

### 3.1 Sistema visual e decisões de tipografia (reaproveitar)

O `index.html` já contém um “design system” implícito, com tokens e padrões consistentes:

- **Tokens de cor em CSS variables** (em `:root`):
  - `--cream`, `--ink`, `--gold` e variações (base bem coesa para um posicionamento premium).
- **Pilha tipográfica (Google Fonts) já bem resolvida:**
  - **Display:** *Playfair Display*
  - **Body:** *Cormorant Garamond*
  - **Text:** *EB Garamond*
  - A combinação é consistente com o “tom” proposto nos docs (erudito/premium).
- **Padrões de “caps espaçado”**:
  - Uso de `letter-spacing` alto + `text-transform: uppercase` (nav, labels, eyebrow, meta) cria linguagem de galeria.
- **Escala e ritmo tipográfico:**
  - `html { font-size: 18px; }` + line-height generoso (boa leitura em textos mais longos).

**Recomendação de reaproveitamento:**
- Se evoluir para uma base com componentes (ex.: Next), **preserve os tokens e a hierarquia** (display/eyebrow/body/meta) como base do design system.

### 3.2 Componentes “implícitos” (padrões de UI reaproveitáveis)

Mesmo sem framework, o site já tem blocos que viram componentes com baixo esforço:

- **`nav` premium**: estado “scrolled” com blur + sombra + redução de padding.
- **Hero split** (texto à esquerda + frames de imagens à direita) com rótulos/legendas.
- **Cards de coleção** (`.artwork-card`):
  - imagem com aspect-ratio + hover zoom
  - moldura/borda interna animada
  - categoria, título, meta em itálico, CTA “Consultar via WhatsApp”
  - **badge** “Acervo Original”
- **Seção de estatísticas** (strip com divisores dourados).
- **Seção “Esculturas”** (layout texto + grid de cards com destaque wide).
- **Seção “A Galeria”** (layout 2 colunas com imagem principal + imagem accent, blockquote e assinatura).
- **Contato**:
  - bloco de detalhes (endereço/horário/whatsapp/email) com ícones inline
  - formulário com campos minimalistas (underline) + botão CTA.
- **Animações e microinterações**:
  - reveal por `IntersectionObserver` via `[data-reveal]`
  - hover transitions consistentes (mesmo easing/tempo)

**Recomendação de reaproveitamento:**
- Transformar cada bloco em “componente” (mesmo que inicialmente em HTML+CSS separado), mantendo:
  - tokens (`:root`)
  - padrões de spacing (containers)
  - padrões de typography (display/body/meta)

### 3.3 Conteúdo textual/copy (reaproveitar)

Há copy já forte e alinhado com posicionamento premium. Trechos de alto valor:

- **Hero:** “Arte que atravessa o tempo.” + descrição curta e premium.
- **Stats:** “+500 Peças em Acervo”, “37 Anos de Tradição”, “100% Autenticidade Garantida”.
- **Seção Galeria:** narrativa institucional + assinatura dos diretores + promessa de certificado/autenticidade.
- **Contato:** “Sua próxima peça rara está aqui.” + instrução “consultar disponibilidade / avaliação / visitas”.

**Recomendação de reaproveitamento:**
- Reaproveitar como base do PT-BR (página institucional) e depois adaptar para EN/FR.

---

## 4) O que pode ser aproveitado com ressalvas (risco/ajustes)

### 4.1 Dependências externas de imagem (Unsplash)

Há cards que usam `images.unsplash.com`. Isso:
- adiciona dependência de terceiros (latência / disponibilidade / mudanças),
- limita controle de cache/performance,
- pode não ser desejável para um acervo “premium” (melhor self-host).

**Recomendação:** migrar essas imagens para assets próprios (mesmo que placeholders curados) e padronizar dimensões/formatos.

### 4.2 Preloader com timeout fixo

O preloader fecha em `2800ms` independente do carregamento real.

**Recomendação:** trocar para fechar baseado em eventos (ex.: `DOMContentLoaded` + fallback) ou reduzir o “bloqueio” percebido.

### 4.3 Monolito em `index.html`

O código é simples de servir, mas:
- dificulta manutenção,
- dificulta reaproveitar componentes,
- aumenta risco de regressões em mudanças rápidas.

**Recomendação:** separar em arquivos (`styles.css`, `main.js`) ou migrar por componentes (dependendo do roadmap).

---

## 5) Itens para limpeza/organização do repositório

- **Arquivos possivelmente órfãos**: há imagens/snapshots na raiz que não parecem ser usadas no `index.html`.
  - *Ação sugerida:* listar e decidir: remover, mover para `docs/assets/` (se forem referência) ou documentar uso futuro.
- **Organização de assets**:
  - *Ação sugerida:* criar `assets/` (ou `public/`) para imagens do site e evitar “raiz poluída”.

---

## 6) Alinhamento com os docs (fase 2) — o que já está decidido

Os docs estabelecem uma direção bem clara (ainda não implementada no código atual):

- **Produto:** catálogo digital + viewing room + captação de leads + compliance + automações.
- **Stack alvo (docs):** Next.js + TypeScript + Supabase + Tailwind + i18n + integrações (WhatsApp bot, geração de PDF, tradução com cache).
- **Dados:** `docs/02_SCHEMA_SUPABASE.sql` é bem completo e já cobre praticamente todo o “produto final”.

**O que reaproveitar do “projeto atual” na fase 2:**
- **Sistema visual** (paleta/tipografia/ritmo/estética) como base de tokens no novo design system.
- **Arquitetura de página** (hero → coleções → esculturas → institucional → contato), que já funciona como landing premium.
- **Copy base PT-BR** (com pequenos ajustes e expansão).

---

## 7) Recomendações objetivas (próximos passos)

### Caminho A — manter estático (rápido, baixo risco)

- Extrair CSS para `styles.css` e JS para `main.js`.
- Criar uma pasta `assets/` e mover imagens.
- Remover/arquivar screenshots e arquivos não usados.
- Ajustes pontuais: preloader, pequenas robustez/a11y, consistência de links externos.

### Caminho B — iniciar fase 2 (produto completo, médio/alto esforço)

- Usar `docs/01_PROMPT_CURSOR.md` + `docs/02_SCHEMA_SUPABASE.sql` como “fonte da verdade” do roadmap.
- Levar o design atual (tokens + tipografia + componentes implícitos) para um design system em componentes.
- Manter a landing atual como homepage do app (mesma narrativa), e evoluir o catálogo e admin por trás.

---

## 8) Resumo do que pode ser reaproveitado (lista curta)

- **Tipografia:** Playfair Display + Cormorant Garamond + EB Garamond (hierarquia e uso).
- **Paleta:** cream/ink/gold em CSS variables.
- **Componentes:** nav premium, hero split, cards de coleção/esculturas, strip de stats, layout “A Galeria”, bloco de contato.
- **Padrões de motion:** reveal via IntersectionObserver + hover zoom + easing consistente.
- **Copy:** hero, stats, narrativa institucional, CTAs para consulta/visita/avaliação.

