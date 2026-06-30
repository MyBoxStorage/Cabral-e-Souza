# ADR 003 — Rotação de credenciais obrigatória antes do deploy

**Data:** 2026-06-30  
**Status:** Aceito  
**Contexto:** Desenvolvimento local, sem push remoto. Credenciais de banco e serviços estão em `.env.local` (gitignored).

---

## Decisão

**Não rotacionar credenciais agora** durante o desenvolvimento local. A rotação torna-se **obrigatória e bloqueante** imediatamente antes do primeiro push para o GitHub e do deploy de produção.

---

## Checklist pré-launch (executar na ordem)

### 1. Inventário de segredos

- [ ] Listar todas as variáveis em `.env.local` e `.env.example` (sem valores reais no commit).
- [ ] Confirmar que `.env`, `.env.local`, `.env.production` estão no `.gitignore`.
- [ ] Verificar histórico git por vazamentos acidentais: `git log -p --all -S 'SUPABASE' -- .` e buscas por padrões de key (`sk_`, `eyJ`, connection strings).

### 2. Rotação no Supabase

- [ ] **Database password:** Supabase Dashboard → Project Settings → Database → Reset database password.
- [ ] Atualizar `DATABASE_URL` / connection string em `.env.local` e nas env vars da Vercel.
- [ ] **Service role key:** Settings → API → Regenerate `service_role` (se já exposta ou commitada por engano).
- [ ] **Anon key:** regenerar apenas se houver evidência de exposição (anon é pública por design, mas revisar RLS).
- [ ] Revisar **Storage policies** e buckets após rotação.

### 3. Rotação de terceiros

- [ ] **Resend:** nova API key em produção; revogar key de dev se compartilhada.
- [ ] **Webhooks** (`lead-created`, `sourcing-lead-created`): novo `WEBHOOK_SECRET` e atualizar consumidores.
- [ ] **Admin Supabase Auth:** revisar lista de emails autorizados (`admin-emails.ts` + Supabase Auth users).
- [ ] Qualquer outro segredo (WhatsApp bot, Claude API, etc.): rotacionar na origem.

### 4. Limpeza do histórico Git (se houve commit de segredo)

- [ ] **Antes do primeiro push** ao GitHub remoto, se qualquer credencial entrou no histórico:
  - Usar `git filter-repo` (ou BFG) para remover arquivos/chunks sensíveis.
  - Force-push **somente** em branch ainda não compartilhada com equipe.
  - Se o remoto já existir com vazamento: tratar como incidente — rotacionar tudo e limpar histórico com coordenação da equipe.
- [ ] Após filter-repo: `git log -p` spot-check nas paths sensíveis.

### 5. Produção (Vercel / DNS)

- [ ] Configurar env vars **apenas** no painel Vercel (nunca no repositório).
- [ ] `NEXT_PUBLIC_SITE_URL` com domínio canônico de produção.
- [ ] Domínio Resend verificado antes de ativar envio real de email.
- [ ] Confirmar que build de produção não embute segredos no bundle client.

### 6. Validação pós-rotação

- [ ] `pnpm db:migrate` / smoke test de queries públicas.
- [ ] Login admin + uma mutação (lead teste).
- [ ] Upload sourcing (bucket `sourcing-uploads`).
- [ ] Email em modo graceful degradation até Resend ativo (sem API key = log only, sem crash).

### 7. Documentação e governança

- [ ] Atualizar `.env.example` com placeholders descritivos (sem valores reais).
- [ ] Registrar data da rotação e responsável neste ADR ou em changelog interno.
- [ ] Definir cadência de rotação periódica pós-launch (ex.: 90 dias para service role em caso de turnover).

---

## Consequências

- Desenvolvimento local continua com credenciais atuais até o gate de pré-deploy.
- **Nenhum push para GitHub** sem executar seções 2–4 quando aplicável.
- Resend e domínio de email ficam para produção; notificações permanecem implementadas com degradação graciosa sem API key.

---

## Referências

- [ADR 001 — Monorepo](./001-monorepo-turborepo-pnpm.md)
- [ADR 002 — Next.js 15 App Router](./002-nextjs15-app-router-rsc.md)
- `git filter-repo`: https://github.com/newren/git-filter-repo
