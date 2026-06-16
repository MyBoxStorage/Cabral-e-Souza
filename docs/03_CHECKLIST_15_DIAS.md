# CHECKLIST OPERACIONAL — 15 DIAS PRÉ-MUDANÇA

> **Como usar:** este é o seu painel de execução. Marque as tarefas conforme conclui. Os blocos `powershell` são comandos para você rodar manualmente — o Cursor IA nunca executa terminal direto, sempre devolve os comandos para você.

---

## DIA 0 — PREPARAÇÃO (antes de começar)

### Contas e acessos a providenciar (você precisa fazer manualmente)

- [ ] Conta no **Supabase** (free tier) — https://supabase.com
- [ ] Conta no **Vercel** (Hobby) — https://vercel.com
- [ ] Conta na **Anthropic** com créditos para Claude API — https://console.anthropic.com
- [ ] Conta na **OpenAI** para embeddings (ou Voyage AI como alternativa mais barata) — https://platform.openai.com
- [ ] Conta no **Resend** (free tier 3k emails/mês) — https://resend.com
- [ ] **Domínio** `cabralesouza.com.br` com acesso ao DNS (Registro.br ou Cloudflare)
- [ ] **Google Workspace** ou alternativa para email `@cabralesouza.com.br`
- [ ] **Google Search Console** + **Google Analytics 4** + **Google Meu Negócio** (reivindicar a ficha existente)
- [ ] **Sentry** (free tier) para monitoramento de erros — opcional dia 1
- [ ] **VPS** para WPPConnect (DigitalOcean $200 free credit, Hetzner free tier, ou Oracle Cloud free) — apenas para dia 10

### Ferramentas locais

- [ ] Node.js 20+ instalado
- [ ] pnpm instalado: `npm install -g pnpm`
- [ ] Git configurado
- [ ] Cursor com Claude Sonnet 4.6 selecionado
- [ ] Supabase CLI: `npm install -g supabase`
- [ ] Vercel CLI: `npm install -g vercel`

### Comandos iniciais (rode no PowerShell)

```powershell
cd "C:\Users\pc\Desktop\Projetos\cabral e souza"

# Backup do que já existe (importante antes de mexer)
git init
git add -A
git commit -m "chore: snapshot inicial antes da reestruturação"

# Garante branch principal
git branch -M main
```

---

## DIA 1 — Setup do monorepo

- [ ] Abra o Cursor na pasta do projeto
- [ ] Cole o arquivo `01_PROMPT_CURSOR.md` no chat do Cursor
- [ ] Inicie pela **Etapa 0** do prompt
- [ ] Confirme estrutura de pastas criada
- [ ] Configure `.env.local` com placeholders

### Comandos a rodar manualmente após o Cursor configurar o monorepo

```powershell
# Instalar dependências do workspace
pnpm install

# Build dos pacotes compartilhados
pnpm build --filter=@cabralesouza/ui
pnpm build --filter=@cabralesouza/db
pnpm build --filter=@cabralesouza/shared

# Subir dev do app web
pnpm --filter=web dev
```

- [ ] App rodando em `http://localhost:3000`
- [ ] Tipografia base aplicada
- [ ] Tokens de cor consumindo CSS variables

---

## DIA 2 — Banco de dados

- [ ] Criar projeto no Supabase (região: South America São Paulo)
- [ ] Copiar URL e anon key para `.env.local`
- [ ] Abrir SQL Editor no Supabase Studio
- [ ] Colar e executar `docs/02_SCHEMA_SUPABASE.sql` na íntegra
- [ ] Verificar que todas as tabelas, índices e RLS foram criados
- [ ] Verificar seed dos 5 artistas
- [ ] Criar os buckets de Storage manualmente no Studio:
  - `piece-images` (público)
  - `piece-documents-public` (público)
  - `piece-documents-private` (privado)
  - `kyc-documents` (privado)
  - `viewing-room-assets` (público)
  - `dossier-pdfs` (privado)
  - `provenance-reports` (privado)

### Comandos para gerar tipos TypeScript

```powershell
# Login no Supabase CLI (uma vez)
supabase login

# Link com seu projeto (substitua YOUR-PROJECT-REF)
supabase link --project-ref YOUR-PROJECT-REF

# Gerar tipos
supabase gen types typescript --linked > packages/db/types.ts
```

---

## DIA 3 — Layout base, header, footer, i18n

- [ ] Header minimalista funcionando
- [ ] Footer com endereço, CNPJ (a confirmar com sócios), links institucionais
- [ ] Cookie banner LGPD com consentimento granular
- [ ] Middleware de i18n: `/pt`, `/en`, `/fr` funcionando
- [ ] Detecção automática de idioma por Accept-Language
- [ ] Páginas institucionais com texto provisório:
  - `/sobre`
  - `/servicos`
  - `/como-funciona`
  - `/contato`
  - `/privacidade`
  - `/termos`

---

## DIA 4-5 — Admin CRUD de peças

- [ ] Login admin via magic link
- [ ] Lista de peças com filtros (artista, status, categoria)
- [ ] Form de criação/edição com todos os campos do schema
- [ ] Upload múltiplo de imagens (drag-and-drop)
- [ ] Variantes geradas com `sharp` (thumbnail, medium, large)
- [ ] Upload de documentos (COA, laudos)
- [ ] Editor de markdown para descrição/proveniência com preview
- [ ] Seletor visual de status (rascunho → privado → público → reservado → vendido)
- [ ] Botão "Gerar slug a partir de artista + título + ano"

---

## DIA 6 — Catálogo público + Schema.org

- [ ] `/acervo` com grid filtrável
- [ ] `/acervo/[slug]` com:
  - Galeria de imagens com zoom (lightbox)
  - Ficha técnica formatada
  - Faixa de preço pública se < R$ 20.000 / "sob consulta" se ≥
  - CTA "Tenho interesse" + "Falar no WhatsApp"
  - JSON-LD Schema.org `VisualArtwork` + `Product`
- [ ] `/artistas/[slug]` com verbete + Schema.org `Person`
- [ ] Sitemap.xml dinâmico
- [ ] Robots.txt

### Validação

```powershell
# Após deploy preview na Vercel, testar Schema:
# https://search.google.com/test/rich-results
# Cole a URL da peça e verifique se VisualArtwork foi reconhecido
```

---

## DIA 7-8 — Viewing Room privado

- [ ] Admin: gerador de Viewing Room com multi-select de peças
- [ ] Mensagem personalizada por VR
- [ ] Expiração configurável (7, 15, 30 dias)
- [ ] Token único na URL (`/vr/[token]`)
- [ ] Layout dedicado, sem header/footer padrão
- [ ] Tracking de abertura, tempo por peça, scroll, downloads
- [ ] Dashboard de VR no admin mostrando atividade

---

## DIA 9 — Tradução + Dossiê PDF

- [ ] Função `translate()` com cache por `content_hash`
- [ ] Cron diário traduzindo pendentes em lote
- [ ] Geração de PDF dossiê via `react-pdf`
- [ ] Layout do PDF profissional (capa, ficha, biografia, proveniência, comparáveis, contato)
- [ ] Disparo automático por email via Resend quando lead envia "Tenho interesse"

### Variáveis adicionais no `.env.local`

```bash
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## DIA 10 — Bot WhatsApp (WPPConnect)

- [ ] Provisionar VPS (DigitalOcean droplet US$ 6/mês ou Hetzner CX11 €3.49/mês)
- [ ] Instalar Docker e Docker Compose
- [ ] Subir WPPConnect com persistência

### Comandos no VPS (via SSH)

```bash
# No VPS Ubuntu 22.04+
sudo apt update && sudo apt install -y docker.io docker-compose-plugin git

# Clonar o repo do projeto (apenas o service)
git clone https://github.com/SEU-USUARIO/cabral-e-souza.git
cd cabral-e-souza/services/whatsapp-bot

# Subir o container
docker compose up -d

# Pegar QR code para autenticar a sessão (uma vez)
docker compose logs -f
```

- [ ] Escanear QR code com WhatsApp do número da galeria
- [ ] Sessão persistida em volume
- [ ] Webhook apontando para `https://cabralesouza.com.br/api/webhooks/whatsapp`

### No app Next.js

- [ ] Rota `/api/webhooks/whatsapp` recebendo mensagens
- [ ] Classificador de intenção (Claude)
- [ ] RAG no pgvector buscando peças/artistas relevantes
- [ ] Sistema de hand-off com notificação ao executor

---

## DIA 11 — Sourcing reverso

- [ ] Landing `/vender-obra` com SEO otimizado
- [ ] Formulário multi-step
- [ ] Upload de fotos (3-8)
- [ ] Lead salvo em `sourcing_leads`
- [ ] Auto-resposta com prazo de 5 dias úteis
- [ ] Notificação ao executor por email

---

## DIA 12 — Agente de proveniência (subdomínio)

- [ ] Criar app `apps/proveniencia`
- [ ] Subdomínio `proveniencia.cabralesouza.com.br` configurado no DNS
- [ ] Auth restrita por magic link
- [ ] Formulário estruturado de pesquisa
- [ ] Processamento com Claude Vision + Claude com web search
- [ ] Geração de PDF de relatório
- [ ] Log de execuções com custo

---

## DIA 13 — Conteúdo: verbetes

- [ ] 8 verbetes profundos escritos com Claude API + revisão:
  - Di Cavalcanti
  - Pedro Américo (com aviso sobre Lei do Período Monárquico)
  - Djanira
  - Alfredo Volpi
  - Sergio Camargo
  - + 3 a confirmar com sócios (sugestões: Iberê Camargo, Pancetti, Guignard, Tarsila do Amaral)
- [ ] 1500–2500 palavras cada
- [ ] Schema.org `Person` correto
- [ ] Imagem hero por artista
- [ ] Cross-link com peças disponíveis

---

## DIA 14 — Conteúdo: 10 peças placeholder + 2 análises de leilão

- [ ] 10 peças placeholder com:
  - Ficha técnica completa baseada em obras conhecidas (sem inventar)
  - Imagens placeholder (gerar ou usar fotos públicas com cuidado)
  - Status `rascunho` ou `arquivado` para não confundir compradores
  - Marcador visual claro "exemplo do tipo de obra que comercializamos"
- [ ] 2 análises de leilão para `/boletim/`:
  - Pesquisar leilões recentes (últimos 60 dias) da Bolsa de Arte e James Lisboa
  - Identificar peças relevantes de artistas do acervo
  - Escrever análise de 800-1500 palavras com Claude + revisão

---

## DIA 15 — SEO, analytics, GMB, compliance, lançamento

- [ ] Google Search Console verificado e sitemap enviado
- [ ] GA4 com eventos customizados (form_submit, vr_opened, pdf_downloaded, whatsapp_clicked)
- [ ] Meta Pixel configurado
- [ ] **Google Meu Negócio:**
  - Reivindicar ficha existente (ou criar) com categoria primária "Art gallery" e secundária "Antique store"
  - Adicionar 10+ fotos profissionais (da fachada, interior, peças destaque, sócios se aceitarem)
  - Endereço, telefone, horário de funcionamento, site
  - 3 posts iniciais ("Cabral & Souza apresenta nova presença digital", "Conheça nosso acervo de mestres brasileiros", "Como avaliamos uma peça")
  - Solicitar review de clientes recorrentes
- [ ] Política de Privacidade e Termos revisados
- [ ] Cookie banner funcional
- [ ] Relatório semanal automatizado (cron toda segunda-feira 8h)
- [ ] Lighthouse audit:
  - Performance ≥ 95
  - Accessibility ≥ 95
  - Best Practices ≥ 95
  - SEO 100
- [ ] Deploy de produção na Vercel
- [ ] Domínio apontando

### Comandos finais

```powershell
# Deploy de produção
cd "C:\Users\pc\Desktop\Projetos\cabral e souza"
vercel --prod

# Verificar status do domínio
vercel domains inspect cabralesouza.com.br
```

- [ ] 🚀 **LANÇAMENTO**
- [ ] Compartilhar o site com 5 contatos próximos para feedback honesto antes da divulgação ampla
- [ ] Postar no LinkedIn pessoal (executor): "Comecei um projeto na galeria do meu pai..."

---

## DIA 16+ — PÓS-MUDANÇA

### Semana 3 (Dias 16–22)

- [ ] Mudança para o RJ
- [ ] Conhecer pessoalmente a galeria e os sócios em ambiente de trabalho
- [ ] Sessão fotográfica profissional (orçar fotógrafo, ~R$ 1.500–3.000 para sessão de 50 peças)
- [ ] Cadastro de 30–50 peças reais no admin
- [ ] Substituir placeholders por peças reais

### Semana 4 (Dias 23–30)

- [ ] Instagram lançado com 12 posts iniciais
- [ ] 3 reels seus apresentando peças
- [ ] Primeira newsletter enviada para base digitalizada
- [ ] Posts no GMB
- [ ] Indexação manual de páginas principais no Search Console

---

## CHECKPOINTS DE VALIDAÇÃO

### Checkpoint 30 dias

| Critério | Meta |
|---|---|
| Peças catalogadas | ≥ 30 |
| Verbetes publicados | ≥ 8 |
| Posts no boletim | ≥ 4 |
| Leads capturados | ≥ 15 |
| Posts Instagram | ≥ 12 |
| Tráfego orgânico | iniciado |
| GMB ranqueando localmente | top 10 para "galeria arte copacabana" |

### Checkpoint 60 dias

| Critério | Meta |
|---|---|
| Peças catalogadas | ≥ 60 |
| Primeira venda atribuída ao digital | ≥ 1 |
| Sourcing reverso ativo | ≥ 3 leads |
| Agente de proveniência usado | ≥ 5 vezes |
| Newsletter | ≥ 1 envio |

### Checkpoint 90 dias

| Critério | Meta |
|---|---|
| Comissão paga ao executor | ≥ R$ 3.000 (cobre o custo mensal) |
| Pipeline ativo | ≥ 3 negociações |
| Peças captadas via sourcing | ≥ 1 |
| Top 3 GMB | "galeria arte copacabana" |

---

## OBSERVAÇÕES FINAIS

1. **Versionamento:** commite ao final de cada dia. Branch `main` é sagrada — features em branches separadas.
2. **Backup:** Supabase tem backup diário automático. Configure também export semanal manual em CSV.
3. **Custos:** monitore consumo de Claude API e OpenAI embeddings diariamente nos primeiros 30 dias. Estimativa: <R$ 100/mês no início.
4. **Burnout:** 9h/dia por 15 dias é insano. Pode haver atraso de 1-3 dias — replaneje sem culpa.
5. **Comunicação com sócios:** envie um update semanal por escrito (mesmo que curto) durante os 15 dias remotos. Eles precisam ver atividade.
