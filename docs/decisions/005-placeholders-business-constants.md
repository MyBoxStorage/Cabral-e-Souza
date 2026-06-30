# ADR 005 — Placeholders canônicos centralizados em `business.ts`

**Data:** 2026-06-30  
**Status:** Aceito

---

## Contexto

Conflitos de endereço (Copacabana vs Ipanema), email (`contato@` vs `galeria@`) e CNPJ placeholder no footer não são bugs de código — são **lacunas de informação** que só os sócios podem resolver (ver [PENDENCIAS_SOCIOS.md](../PENDENCIAS_SOCIOS.md)).

---

## Decisão

1. **Single source of truth:** `packages/shared/src/constants/business.ts` exporta `BUSINESS` e helpers (`whatsappUrl`, etc.).
2. **Valores provisórios** (até confirmação dos sócios):
   - Endereço: Rua Siqueira Campos, 143 — Sala 63, Copacabana, RJ (CEP a confirmar)
   - Email: contato@cabralesouza.com.br
   - CNPJ: **não exibir** no site
   - WhatsApp: número do briefing original, marcado `TODO(socios)` no código
3. Footer, forms, seeds e metadata consumem `BUSINESS` — não strings duplicadas.
4. Cada campo pendente carrega comentário `TODO(socios)` apontando para `PENDENCIAS_SOCIOS.md`.

---

## Consequências

- Atualização futura = editar um arquivo + re-seed se necessário.
- `packages/db` depende de `@cabral-souza/shared` para conteúdo seed de contato/privacidade.
- Remover placeholders exige checklist em `PENDENCIAS_SOCIOS.md` completo.

---

## Referências

- [ADR 003 — Rotação credenciais pré-deploy](./003-rotacao-credenciais-pre-deploy.md)
- [PENDENCIAS_SOCIOS.md](../PENDENCIAS_SOCIOS.md)
