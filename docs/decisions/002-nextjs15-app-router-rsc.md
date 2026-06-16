# ADR 002 — Next.js 15 com App Router e React Server Components

**Data:** 2026-06-16  
**Status:** Aceito

---

## Contexto

Necessitamos de um framework que suporte: SSR/SSG para SEO (Schema.org, Lighthouse 95+), i18n, Server Actions para mutations, routes API para webhooks, e deploy no Vercel sem custo inicial.

## Decisão

**Next.js 15** com App Router (RSC por padrão), Turbopack em dev, e `next-intl` para i18n (PT-BR/EN-US/FR-FR).

## Motivos

1. **RSC por padrão** → páginas de peça e artista são Server Components puros: zero JS enviado ao browser para conteúdo estático, melhor Lighthouse, melhor SEO.
2. **Server Actions** → mutations (formulário de lead, interesse em peça) sem API route explícita; validação Zod no servidor antes de qualquer I/O.
3. **`next/font`** → fontes (Cormorant Garamond, Inter) carregadas localmente com `display: swap`; elimina dependência do Google Fonts em runtime e melhora CLS.
4. **`next/image`** → AVIF + WebP automático, lazy loading, blurDataURL para imagens de obras.
5. **Vercel deploy** → Hobby tier suficiente para o início; ISR para páginas de peças e artistas.

## Consequências

- `"use client"` apenas onde houver interatividade real (menu mobile, lightbox de imagem, form multi-step).
- Mutações via Server Actions; sem `axios`/`fetch` client-side desnecessário.
- `middleware.ts` para i18n routing antes de qualquer render.
