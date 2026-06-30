# ADR 004 — i18n completo adiado pós-MVP; site público PT-only

**Data:** 2026-06-30  
**Status:** Aceito

---

## Contexto

O site tem infraestrutura i18n (next-intl, rotas `/en-US`, `/fr-FR`, middleware), mas **conteúdo editorial permanece em português**. Expor o seletor de idioma cria expectativa falsa e prejudica credibilidade (AUDIT-001, achado #1).

Foco estratégico dos primeiros 90 dias: **mercado brasileiro**, conteúdo PT.

---

## Decisão

1. **Ocultar** seletor de idioma no header e menu mobile para usuário final.
2. **Manter** infraestrutura técnica intacta (middleware, rotas localizadas, messages JSON).
3. Aplicar **`noindex, nofollow`** em todas as rotas `/en-US/*` e `/fr-FR/*` até tradução real.
4. Tradução completa fica para **etapa pós-MVP**, via pipeline Claude com cache por `content_hash` (conforme plano original).

---

## Consequências

- Site público percebido como **monolíngue PT** — alinhado ao posicionamento atual.
- SEO concentrado em `pt-BR` (canonical sem hreflang prematuro).
- Reativar locales exige: conteúdo traduzido + remover noindex + restaurar `LocaleSwitcher` (flag em `business.ts`: `i18nPublicEnabled`).

---

## Referências

- [AUDIT-001](../audit/AUDIT-001.md)
- [ADR 005 — Placeholders canônicos](./005-placeholders-business-constants.md)
