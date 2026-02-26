# Cabral & Souza Antiguidades

Site institucional da galeria Cabral & Souza — quadros a óleo, esculturas em bronze e arte clássica. Rio de Janeiro, desde 1987.

---

## ⚡ Como rodar localmente

Não há dependências ou build. Basta servir os arquivos estáticos:

**Opção 1 — VS Code + Live Server:**
Clique com botão direito em `index.html` → "Open with Live Server"

**Opção 2 — Python:**
```bash
python -m http.server 8080
```
Acesse: `http://localhost:8080`

**Opção 3 — Node (npx):**
```bash
npx serve .
```

---

## 📁 Estrutura de arquivos

```
/
├── index.html              # Página principal (todo o site)
├── obra-diva.png           # Hero + Seção A Galeria
├── obra-modernista.png     # Hero + Card coleção
├── obra-escola.png         # Card destaque coleção + Galeria
├── obra-herbo.png          # Card "Jovem com Leque" — Léon Herbo
├── escultura-bronze.webp   # Card escultura destaque
├── busto-classico.webp     # Card Busto Clássico Feminino
├── figura-devocional.webp  # Card Figura Devocional
├── .gitignore
└── README.md
```

---

## 🛠️ Stack

- **HTML5 + CSS3 + JavaScript vanilla** — sem frameworks, sem build
- **Fontes:** Google Fonts (Cormorant Garamond, Playfair Display, EB Garamond)
- **Contato:** Formulário abre WhatsApp com mensagem pré-preenchida

---

## 🚀 Deploy

O projeto é 100% estático. Pode ser publicado em:

- **Vercel:** conectar repositório GitHub → pasta raiz → deploy automático
- **Netlify:** arrastar a pasta para [app.netlify.com/drop](https://app.netlify.com/drop) ou conectar via GitHub
- **GitHub Pages:** Settings → Pages → Branch `main` → `/ (root)`

**URL de produção:** *(atualizar após o deploy)*

---

## 📞 Contato da galeria

- WhatsApp: (21) 97002-7830
- Endereço: Rua Siqueira Campos, 143 — Sl. 63, Copacabana · Rio de Janeiro, RJ
- Horário: Seg–Sex 10h–18h · Sáb 10h–14h
