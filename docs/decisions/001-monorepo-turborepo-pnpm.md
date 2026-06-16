# ADR 001 — Monorepo com Turborepo + pnpm workspaces

**Data:** 2026-06-16  
**Status:** Aceito  
**Autores:** Executor (full-stack) + Claude (arquiteto)

---

## Contexto

O projeto Cabral & Souza Digital requer múltiplos apps e pacotes compartilhados:
- `apps/web` — site público + admin (Next.js 15)
- `apps/proveniencia` — subdomínio restrito do agente (Next.js 15)
- `services/whatsapp-bot` — bot Node.js em VPS separado
- `packages/db` — cliente e tipos Supabase
- `packages/ui` — design system + tokens
- `packages/claude` — wrappers Claude API
- `packages/shared` — Zod schemas, tipos, utils

## Decisão

Adotar **Turborepo** como orquestrador de builds/lint/typecheck com **pnpm workspaces** como gerenciador de pacotes.

## Motivos

1. **Compartilhamento sem duplicação:** os tipos do Supabase, schemas Zod e tokens de design vivem em um único lugar e são consumidos por todos os apps sem copiar código.
2. **Cache de build inteligente:** Turborepo não rebuilda pacotes que não mudaram, acelerando o CI e o dev local.
3. **pnpm:** resolução de dependências mais rápida e correta que npm/yarn; workspace protocol (`workspace:*`) garante que mudanças locais propagam sem `npm link`.
4. **Alternativa considerada:** nx — descartado por overhead de configuração maior para este porte de projeto.

## Consequências

- Todo comando `pnpm install` deve ser rodado na raiz (não dentro de cada app).
- Novos pacotes internos devem ser adicionados como `"@cabral-souza/nome": "workspace:*"`.
- CI deve usar `pnpm install --frozen-lockfile` para reproducibilidade.
