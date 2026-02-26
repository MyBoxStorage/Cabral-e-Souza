# AUDITORIA TÉCNICA COMPLETA — Cabral & Souza Antiguidades

**Data:** 2025  
**Objetivo:** Preparar contexto para colaboração com IA externa (Claude) até o deploy.

---

## 📁 1. ESTRUTURA DO PROJETO

### Arquivos e pastas (raiz do repositório)

| Caminho | Função |
|---------|--------|
| `index.html` | Única página do site: HTML + CSS inline + JavaScript inline. Contém toda a landing. |
| `obra-diva.png` | Imagem hero e seção "A Galeria" — Dama Reclinada (óleo). |
| `obra-modernista.png` | Imagem hero e card coleção — Composição Modernista. |
| `obra-escola.png` | Card "Pátio Escolar com Freira" e detalhe na seção A Galeria. |
| `obra-escola2.png` | Não referenciado no HTML atual (redundante com obra-escola.png). |
| `obra-herbo.png` | Card "Jovem com Leque" — Léon Herbo. |
| `obra-escultura.png` | Não referenciado no HTML (esculturas usam .webp). |
| `img_escola.png` | Não referenciado no HTML (substituído por obra-escola.png). |
| `escultura-bronze.webp` | Card "Figura Humana Agachada" (esculturas). |
| `busto-classico.webp` | Card "Busto Clássico Feminino". |
| `figura-devocional.webp` | Card "Figura Devocional" (terracota). |
| `Captura de tela 2026-02-24 220432.png` … `220948.png` | 6 screenshots; não usados no site. |
| `cabral e souza.code-workspace` | Workspace VS Code (aponta para `.`). |
| `.git/` | Repositório Git (remote: GitHub MyBoxStorage/Cabral-e-Souza). |

Não existem: `package.json`, `README.md`, `.gitignore`, `.env`, Dockerfile, CI/CD, pasta `src/` ou `assets/` dedicada.

### Tipo de projeto

- **Single Page Application (SPA) estática**: uma única página HTML com rolagem por âncoras.
- Não é monorepo, não há backend, não há banco de dados, não há microserviços.

### Fluxo de dados

```
Usuário (navegador)
  → index.html (estático)
  → Links externos: WhatsApp (wa.me), Google Fonts, Unsplash (imagens em 4 cards)
  → Formulário de contato: não envia para servidor; apenas abre WhatsApp com texto montado (client-side).
```

Não há fluxo backend → banco → serviços externos; o “backend” é o WhatsApp.

---

## ⚙️ 2. STACK TECNOLÓGICA

| Item | Detalhe |
|------|---------|
| **Linguagens** | HTML5, CSS3, JavaScript (ES5-style, sem módulos). |
| **Frameworks / libs** | Nenhum. Vanilla HTML/CSS/JS. |
| **Gerenciador de pacotes** | Nenhum no projeto (sem `package.json`). |
| **Runtime** | Apenas navegador. Node não é necessário para rodar o site. |
| **Banco de dados** | Nenhum. |
| **Serviços externos** | Google Fonts (Cormorant Garamond, Playfair Display, EB Garamond), Unsplash (4 imagens em cards da coleção), WhatsApp (wa.me). |

Versões: não aplicável (sem dependências declaradas).

---

## 🏗️ 3. ARQUITETURA E PADRÕES

| Aspecto | Situação |
|---------|----------|
| **Padrão arquitetural** | Página única; não há separação por camadas (apenas um arquivo). |
| **Roteamento** | Por âncoras: `#inicio`, `#colecao`, `#esculturas`, `#galeria`, `#contato`. Smooth scroll via JS. |
| **Estado global** | Nenhum (sem Redux, Context, etc.). Apenas DOM e scroll. |
| **Autenticação/autorização** | Inexistente (site público). |
| **Busca/cache/invalidação de dados** | Nenhuma; conteúdo fixo no HTML. Imagens externas (Unsplash) dependem do CDN deles. |

---

## 🔧 4. CONFIGURAÇÃO E AMBIENTE

| Item | Situação |
|------|----------|
| **Variáveis de ambiente** | Nenhuma. Sem `.env` ou `.env.example`. Número de WhatsApp está hardcoded em `index.html` (5521970027830). |
| **Scripts (package.json)** | Inexistente. |
| **Como rodar localmente** | Abrir `index.html` no navegador ou servir a pasta com um servidor estático (ex.: `npx serve .`, `python -m http.server`). |
| **Build** | Não há. O “build” é o próprio `index.html` e os arquivos estáticos. |
| **Docker / CI/CD / Infra** | Nenhum. Sem Dockerfile, GitHub Actions, Vercel/Netlify config no repositório. |

---

## 🚨 5. PROBLEMAS IDENTIFICADOS

### 🔴 Bugs e erros

| # | Problema | Local | Detalhe |
|---|----------|--------|---------|
| 1 | **Possível erro de runtime se o formulário não existir** | `index.html` ~L681 | `document.getElementById('contactForm').addEventListener(...)` — se `contactForm` for null (ex.: ID alterado ou elemento removido), quebra. Falta guard: `if (contactForm) { ... }`. |
| 2 | **Smooth scroll com `href="#"`** | ~L689–693 | `querySelector(a.getAttribute('href'))` para `href="#"` retorna o primeiro elemento com `id=""` ou comportamento estranho. Nenhum link no site usa só `#`, então hoje não quebra, mas é frágil. |
| 3 | **Nenhum tratamento de erro em scripts** | Bloco `<script>` | Sem try/catch; qualquer falha em um listener pode interromper os demais. |

### 🟠 Code smells e dívida técnica

| # | Problema | Local | Detalhe |
|---|----------|--------|---------|
| 1 | **Arquivos de imagem órfãos/redundantes** | Raiz | `img_escola.png`, `obra-escola2.png`, `obra-escultura.png` existem na pasta mas não são referenciados no HTML. Poluem o repositório e podem confundir deploy. |
| 2 | **Screenshots no repositório** | Raiz | 6 PNGs "Captura de tela 2026-02-24…" não usados no site; aumentam tamanho do repo sem necessidade. |
| 3 | **CSS e JS monolíticos** | `index.html` | ~240 linhas de CSS e ~45 de JS inline; difícil manter e reutilizar. Ideal extrair para arquivos ou pelo menos seções bem delimitadas. |
| 4 | **Duplicação do número WhatsApp** | Vários | Número `5521970027830` repetido em muitos pontos (hrefs, placeholder, JS). Qualquer mudança exige busca e substituição manual. |
| 5 | **Sem .gitignore** | Raiz | Não há .gitignore; risco de commitar arquivos sensíveis ou desnecessários (ex.: `.env`, `node_modules/`, novas capturas de tela). |
| 6 | **Sem package.json** | Raiz | Não há registro de dependências ou scripts; auditorias (npm audit) e padronização de ambiente não aplicáveis. |

### 🟡 Performance

| # | Problema | Local | Detalhe |
|---|----------|--------|---------|
| 1 | **Fontes bloqueantes** | `<head>` L8–10 | Google Fonts sem `font-display: swap` (implícito); pode atrasar First Contentful Paint. Considerar `display=swap` na URL ou preload. |
| 2 | **Imagens hero sem dimensões** | L319, L324 | `<img>` sem `width`/`height`; causa layout shift (CLS). Deveria ter dimensões ou aspect-ratio no CSS. |
| 3 | **Imagens Unsplash externas** | L418, 432, 446 | 3 cards da coleção (Paisagem, Retrato, Natureza morta) usam URLs Unsplash; dependência de terceiro e latência. Considerar self-host ou cache. |
| 4 | **Preloader fixo 2,8s** | L653 | `setTimeout(hidePreloader, 2800)` independente do carregamento real; usuário pode esperar mesmo com página já pronta. |
| 5 | **Nenhum lazy load nativo para iframe** | N/A | Não há iframes; imagens já usam `loading="lazy"` onde faz sentido. |

### 🔵 UX/UI

| # | Problema | Local | Detalhe |
|---|----------|--------|---------|
| 1 | **Acessibilidade limitada** | Global | Poucos `aria-label` (apenas WhatsApp float e hamburger). Falta: skip link, foco visível em links/botões, indicação de estado do menu (aria-expanded no hamburger). |
| 2 | **Formulário sem feedback visual** | Form ~L434–458 | Submit só abre WhatsApp; não há mensagem de “enviado” ou “preencha X”. Usuário pode não perceber que deve concluir no WhatsApp. |
| 3 | **Footer “Arte Sacra” e “Avaliações”** | L631–632 | Links para `#contato`; não há seção específica. Pode gerar expectativa de conteúdo dedicado. |
| 4 | **Ano no footer** | L644 | “© 2025” hardcoded; ficará desatualizado. |
| 5 | **Menu mobile sem overlay** | ~L239–241 | Ao abrir o menu, o fundo continua rolável (body overflow corrigido); não há overlay escuro, pode confundir. |

### ⚫ Segurança

| # | Problema | Local | Detalhe |
|---|----------|--------|---------|
| 1 | **Número de telefone exposto** | Todo o HTML | WhatsApp e telefone visíveis no front (aceitável para site institucional; apenas registrar). |
| 2 | **E-mail no HTML** | L451 | contato@cabralesouza.com.br exposto (normal para contato). |
| 3 | **Formulário sem validação de formato** | Campos tel e nome | Apenas `required`; não valida formato de telefone nem sanitiza texto antes de colar na URL do WhatsApp. Risco baixo (abre só WhatsApp), mas pode gerar URLs muito longas ou caracteres estranhos. |
| 4 | **Links externos** | Vários | `target="_blank"` usado; há `rel="noopener"` no float WhatsApp, mas não em todos os links que abrem nova aba (ex.: nav-cta, artwork-card-cta). Deveria ter `rel="noopener noreferrer"` em todos. |

---

## ✅ 6. O QUE JÁ ESTÁ FUNCIONANDO

- **Conteúdo e estrutura:** Hero, números (+500 peças, 37 anos, 100% autenticidade), seção Coleção (6 cards), Esculturas (3 cards), A Galeria (sobre), Contato (dados + formulário), Footer.
- **Navegação:** Links de âncora, smooth scroll, navbar fixa com estado “scrolled”, menu hamburger no mobile que abre/fecha e fecha ao clicar em link.
- **Formulário:** Monta mensagem e abre WhatsApp em nova aba com nome, tipo de interesse, mensagem e WhatsApp preenchidos.
- **WhatsApp flutuante:** Botão fixo com link e aria-label.
- **Imagens:** Hero (obra-diva, obra-modernista), coleção (obra-escola, obra-herbo, obra-modernista + 3 Unsplash), esculturas (escultura-bronze, busto-classico, figura-devocional em .webp), A Galeria (obra-diva, obra-escola).
- **Visual:** Paleta (cream, ink, gold), tipografia (Google Fonts), preloader, animações de reveal no scroll, responsivo (breakpoints 1024px e 768px).
- **Git:** Repositório inicializado, remote `origin` apontando para `https://github.com/MyBoxStorage/Cabral-e-Souza.git`, branch `main`, histórico de commits (incl. “feat: adiciona fotos reais das esculturas nos 3 cards”).

**Testes:** Nenhum teste automatizado (unit, e2e, a11y).  
**Integrações:** Google Fonts, Unsplash (imagens), WhatsApp (links e formulário).

---

## 🚀 7. O QUE FALTA PARA O DEPLOY

1. **Configuração de produção**
   - Definir onde hospedar (Vercel, Netlify, GitHub Pages, etc.).
   - Se usar Vercel/Netlify: configurar projeto (e opcionalmente `vercel.json` / `netlify.toml` para headers, redirects).
   - Domínio próprio (se houver): DNS e SSL.

2. **Limpeza do repositório**
   - Adicionar `.gitignore` (ex.: `.env`, `node_modules/`, `*.log`, pastas de IDE).
   - Remover ou não versionar: screenshots (“Captura de tela…”), arquivos de imagem não usados (`img_escola.png`, `obra-escola2.png`, `obra-escultura.png`) ou documentar uso futuro.

3. **Otimizações recomendadas**
   - Evitar quebra se `#contactForm` não existir (guard no script).
   - Adicionar `width`/`height` ou aspect-ratio nas imagens hero para reduzir CLS.
   - Incluir `rel="noopener noreferrer"` em todos os `target="_blank"`.
   - Considerar `font-display: swap` para Google Fonts.

4. **Documentação mínima**
   - README com: nome do projeto, como abrir localmente, link do repositório e (após deploy) URL de produção.

5. **Opcional para pós-deploy**
   - Melhorar acessibilidade (skip link, aria-expanded no menu, foco visível).
   - Substituir ano do footer por valor dinâmico (ex.: ano atual via JS).
   - Centralizar número/e-mail em uma variável ou comentário único no HTML para manutenção.

---

## 📋 8. RESUMO EXECUTIVO PARA IA EXTERNA

```
=== RESUMO PARA CLAUDE ===
Projeto: Cabral & Souza Antiguidades (site da galeria)
Tipo: Landing page estática (single HTML + assets)
Stack principal: HTML5, CSS3, JavaScript vanilla. Sem framework, sem build, sem backend.
Status geral: ~85% — site funcional e responsivo; falta config de deploy, limpeza de repo e pequenos ajustes de robustez/a11y/performance.
Prioridade imediata: Garantir que o deploy possa ser feito sem erros (servir index.html + imagens) e corrigir o único ponto de falha crítica no JS (contactForm null check).
Próximos 3 passos recomendados:
1. Adicionar guard em index.html para document.getElementById('contactForm') antes de addEventListener('submit', ...) (evitar erro se o elemento não existir).
2. Criar .gitignore e opcionalmente remover ou ignorar arquivos não usados (screenshots, img_escola.png, obra-escola2.png, obra-escultura.png).
3. Configurar deploy (ex.: Vercel ou Netlify) conectando o repositório GitHub e definindo pasta raiz como public; após isso, adicionar README com URL de produção.
Bloqueadores para deploy: Nenhum crítico. O site é estático e pode ser servido em qualquer host de arquivos estáticos. Bloqueadores operacionais: (a) escolher e configurar a plataforma de deploy; (b) opcionalmente aplicar as correções de script e links (noopener) para evitar erros e boas práticas.
```

---

*Fim do relatório de auditoria. Arquivo: `AUDITORIA-PROJETO.md` na raiz do projeto.*
