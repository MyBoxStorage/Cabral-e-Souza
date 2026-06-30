# DOCUMENTO ESTRATÉGICO — CABRAL & SOUZA
## Plano de transformação digital para galeria de arte brasileira de alto valor

**Cliente:** Cabral & Souza Antiguidades — Rua Siqueira Campos 143, Sala 63, Copacabana, RJ
**Fundada:** 1987 | **Sócios:** Marcelo Cabral & Alexandre Teixeira de Souza
**Executor:** Desenvolvedor full-stack (filho de sócio) com comissão sobre vendas geradas digitalmente
**Stack autorizada:** Next.js · TypeScript · Supabase · Claude API · Vercel · WPPConnect
**Investimento mensal a recuperar:** R$ 3.000 (aluguel + custo de vida no RJ + ferramentas)
**Prazo da base sólida:** 15 dias pré-mudança + ativação contínua pós dia 16

---

## 1. DIAGNÓSTICO

### 1.1 Posicionamento real
A Cabral & Souza opera como **galeria de arte moderna e contemporânea brasileira** com loja física que também comercializa antiguidades. Os concorrentes admirados pelos sócios (Nara Roesler, Luisa Strina, James Lisboa, ARTMG) confirmam o posicionamento: o jogo é **arte de mestres brasileiros**, não antiquário decorativo. A comunicação digital deve refletir isso desde o domínio principal — o termo "antiquário" sobrevive apenas como segunda camada da operação física.

### 1.2 Cenário de mercado (validado por pesquisa)
- Brasil concentra **23% dos novos colecionadores de arte do mundo** em 2024, segundo o Survey of Global Collecting Art Basel/UBS, atrás apenas dos EUA.
- Colecionadores brasileiros gastaram em média **US$ 1,03 milhão** em obras em 2024, o segundo maior valor global, perdendo apenas para a China continental.
- A **mediana global de gasto por colecionador foi de US$ 22–24 mil** em 2024–2025 — exatamente a faixa central do estoque da Cabral & Souza.
- Pinturas e esculturas representam, respectivamente, **67% e 56%** das compras dos colecionadores entrevistados — o foco declarado de Marcelo e Alexandre.
- Artistas brasileiros dominam os rankings de leilões nacionais (Aldemir Martins lidera há quase uma década na plataforma iArremate).
- Di Cavalcanti, Volpi, Djanira, Sergio Camargo, Pedro Américo — todos os artistas-âncora do acervo recorrente — são negociados com regularidade nos leilões majors (Bolsa de Arte, James Lisboa, BOLSA, Sotheby's, Christie's).

### 1.3 Forças atuais (preservar)
- **40 anos de operação** com reputação no Rio de Janeiro.
- Rede de indicação responsável por **90% das vendas de alto ticket**.
- Sourcing internacional ativo (viagens à França).
- Curadoria com rigor estético reconhecido pelos clientes.
- Sócios com conhecimento técnico profundo do mercado secundário brasileiro.

### 1.4 Gaps críticos identificados
| Gap | Impacto | Prioridade |
|---|---|---|
| Presença digital praticamente zero | Galeria invisível para novos compradores que pesquisam online | Crítica |
| Sem Google Meu Negócio otimizado | Perde tráfego local de alta intenção em Copacabana | Crítica |
| Sem catálogo digital estruturado | Impossível compartilhar acervo com leads remotos com aparência profissional | Crítica |
| Sem fichas técnicas padronizadas | Cada peça vendida com fricção; informação dispersa em papel/cabeça dos sócios | Alta |
| Sem CRM ou histórico digital | Não há base de relacionamento ativável para campanhas | Média (volume baixo justifica adiar CRM complexo) |
| Sem documentação sistemática de proveniência | Limita ticket máximo de cada peça; depende de especialista terceirizado | Alta |
| Dificuldade de fechar venda remota | Mercado restrito ao RJ; perde-se demanda do resto do Brasil | Alta |
| Sem captação ativa de sourcing | Depende 100% de indicações passivas; subutiliza capacidade de compra | Alta |
| Sem compliance digital CNART/COAF documentado | Risco regulatório com IPHAN (cadastro obrigatório, comunicação semestral) | Alta |

### 1.5 Oportunidades únicas no contexto da Cabral & Souza
1. **40 anos de história + zero presença digital = barreira de entrada zero contra concorrentes.** Construir autoridade do zero em 6 meses é viável porque ninguém na faixa de antiquário/galeria média do RJ ocupa esse espaço hoje.
2. **Acesso a artistas-âncora de mercado consolidado** (Di Cavalcanti, Volpi, Djanira) permite criar conteúdo SEO de longo prazo com tese de valorização real.
3. **Operação no Rio com curadoria reconhecida** abre espaço para conquistar buscas locais ("galeria arte Copacabana", "comprar pintura modernista RJ") que hoje retornam resultados fracos.
4. **Sócios resistentes à exposição** transformam o filho-desenvolvedor em rosto único e coerente — vantagem narrativa de transição geracional ("nova geração assume galeria histórica").
5. **Sourcing internacional ativo** permite construir credibilidade como ponte Brasil–Europa, posicionamento que nenhum concorrente direto explora bem.

---

## 2. HIPÓTESE ESTRATÉGICA CENTRAL

> **O digital aqui não é canal primário de venda — é infraestrutura de confiança e captação.**
> O canal de venda continua sendo a rede de relacionamento + WhatsApp + visita presencial. O papel do projeto é (a) ser encontrável e crível quando alguém pesquisa um artista ou a galeria, (b) gerar leads novos para alimentar a rede, (c) capturar peças via sourcing reverso (famílias com espólio buscando avaliar), (d) digitalizar e amplificar o fluxo de venda que já funciona com viewing rooms privados.

Essa hipótese governa todas as decisões de arquitetura abaixo.

---

## 3. PLANO DE AÇÃO — 15 DIAS PRÉ-MUDANÇA (REMOTO)

Divisão em sprints de 3 dias.

### Sprint 1 (Dias 1–3): Fundação técnica
| Ação | Resultado mensurável | Tempo |
|---|---|---|
| Setup do monorepo Next.js 15 + TypeScript + Supabase + Tailwind | Repositório versionado, deploy preview funcionando na Vercel | 4h |
| Schema completo do Supabase (ver arquivo `02_SCHEMA_SUPABASE.sql`) com pgvector habilitado | Tabelas criadas, RLS configurado, seeds rodando | 6h |
| Sistema de design implementado em CSS variables + Tailwind preset | Tokens consumíveis por toda aplicação e pelo Claude Design | 4h |
| Estrutura de rotas i18n PT/EN/FR | URLs `/pt/`, `/en/`, `/fr/` ativas com fallback automático | 3h |
| Configuração de domínio na Vercel + SSL + email Google Workspace | `cabralesouza.com.br` apontando, emails `@cabralesouza.com.br` funcionando | 2h |

### Sprint 2 (Dias 4–6): Catálogo e dossiês
| Ação | Resultado mensurável | Tempo |
|---|---|---|
| CRUD admin de peças com upload de imagens (Supabase Storage + sharp para variantes) | Painel funcional para cadastrar peça com 8+ fotos | 8h |
| Página pública por peça com Schema.org `VisualArtwork` completo | URLs `/acervo/[slug]` com JSON-LD validando no Schema Validator | 4h |
| Sistema de status de visibilidade (rascunho, privado/link, público, vendido, reservado, arquivado) | Comportamento diferenciado por status no front e nos índices | 3h |
| Geração de PDF dossiê via Claude API + template profissional | PDF de 3–5 páginas com ficha técnica, proveniência, comparáveis | 6h |
| Sistema de tradução com cache por `content_hash` | Tradução roda uma vez por idioma, persiste no banco | 4h |

### Sprint 3 (Dias 7–9): Viewing Room + captação
| Ação | Resultado mensurável | Tempo |
|---|---|---|
| Viewing Room privado por link com expiração | Você gera URL única com N peças, mensagem personalizada, sem login | 8h |
| Tracking de visualização do viewing room | Dashboard mostra abertura, tempo por peça, repetição de visita, download de PDF | 5h |
| Formulário de captura de lead "Tenho interesse" com qualificação por perfil | Lead vai ao Supabase + dispara email automático com PDF dossiê | 4h |
| Landing "Quero vender uma obra" (sourcing reverso) com SEO otimizado | Página pública indexável para termos de captação | 5h |

### Sprint 4 (Dias 10–12): Bot WhatsApp + agente de proveniência
| Ação | Resultado mensurável | Tempo |
|---|---|---|
| Servidor WPPConnect rodando em VPS (DigitalOcean droplet free credit ou Hetzner free tier) | Bot recebendo e respondendo mensagens via API | 6h |
| RAG sobre Supabase (pgvector) para o bot responder sobre peças do acervo | Bot consulta embeddings das fichas técnicas + verbetes ao responder | 6h |
| Sistema de hand-off humano + classificador de intenção (Claude) | Bot transfere para você quando detecta intenção de compra ou pergunta fora de escopo | 4h |
| Subdomínio `proveniencia.cabralesouza.com.br` com landing do agente de pesquisa | Acesso restrito (magic link), formulário padronizado, output estruturado | 8h |

### Sprint 5 (Dias 13–15): Conteúdo + SEO + analytics + dia de lançamento
| Ação | Resultado mensurável | Tempo |
|---|---|---|
| 8 verbetes profundos de artistas (Di Cavalcanti, Volpi, Djanira, Sergio Camargo, Pedro Américo + 3 da rede recorrente) com 1500–2500 palavras cada | URLs `/artistas/[slug]` indexáveis com Schema.org `Person` + `VisualArtist` | 16h |
| 10 peças placeholder com ficha técnica completa baseada em obras de referência dos artistas | Site lançado com aparência de acervo real, não com lorem ipsum | 6h |
| 2 análises de leilões recentes (Bolsa de Arte / James Lisboa) | Conteúdo `/boletim/` indicando atividade editorial ativa | 4h |
| Google Search Console + GA4 + Meta Pixel + Google Meu Negócio otimizado com fotos da galeria física | Tudo rastreando desde o lançamento; GMB com 10+ fotos, categoria "Art gallery", posts semanais agendados | 4h |
| Política de Privacidade + Termos de Uso + Cookie Banner (LGPD) | Compliance básico no rodapé do site | 3h |
| Sitemap, robots.txt, OpenGraph, fonte web otimizada, Lighthouse score 95+ | Site no ar, encontrável pelo Google, performance auditada | 4h |

**Total estimado:** ~135 horas em 15 dias = ~9h/dia útil. Realista para sprint de mudança.

---

## 4. PLANO PÓS-MUDANÇA — DIAS 16–90

### Semana 3 (Dias 16–22): Captura de acervo real
- Sessão fotográfica com fotógrafo profissional: 30–50 peças de alto valor (priorizar peças com proveniência mais sólida e maior potencial de SEO).
- Cadastro completo das peças no Supabase.
- Substituição gradual dos placeholders por peças reais.
- Primeiro disparo de newsletter para a base atual de contatos dos sócios (digitalizada da agenda).

### Semana 4 (Dias 23–30): Ativação de canais
- Instagram lançado com 12 posts iniciais (carrosséis de peças do acervo + 3 reels seu apresentando peças).
- Primeiro post no GMB com peça destaque.
- Submissão do site para Search Console + indexação manual de páginas principais.
- Configuração de campanha SEO local — meta de top 3 para "galeria de arte Copacabana" em 60 dias.

### Mês 2 (Dias 31–60): Conteúdo e relacionamento
- Cadência fixa: 2 verbetes/semana + 1 análise de leilão/semana + 3 reels Instagram/semana + 1 newsletter/mês.
- Lançamento do sourcing reverso com SEO ativo para "vender obra de arte rj", "avaliar pintura antiga", "vender espólio arte".
- Implementação de scraper de leilões (Sotheby's, Christie's, Bolsa de Arte, James Lisboa) para alimentar comparáveis de mercado nos dossiês PDF.
- Primeiras 50 peças do acervo cadastradas e publicadas.

### Mês 3 (Dias 61–90): Otimização e expansão
- A/B testing nas páginas de peça (variações de CTA, layout de PDF dossiê).
- Refinamento do bot WhatsApp com dados reais de conversas dos 60 dias.
- Avaliação de upgrade do WPPConnect → WhatsApp Business Cloud API (Meta) se volume justificar.
- Catálogo impresso anual em diagramação (lançamento até dia 120).
- Primeira venda atribuível ao digital documentada — meta para justificar comissão do executor.

---

## 5. SOLUÇÕES TECNOLÓGICAS INÉDITAS NO MERCADO BRASILEIRO

### 5.1 Agente de pesquisa de proveniência (`proveniencia.cabralesouza.com.br`)
**Problema:** Documentar proveniência de uma peça leva hoje 1–30 dias e exige especialista terceirizado. Sem documentação, valor cai drasticamente.
**Como funciona:** Landing simples com formulário padronizado (foto principal, foto da assinatura, foto do verso, foto de detalhes, artista presumido, técnica, dimensões, época estimada, histórico conhecido de posse, observações). O Claude API recebe os inputs estruturados e:
1. Pesquisa em catálogos públicos online (raisonné, museus, leilões anteriores) via web search.
2. Analisa assinatura visualmente (Claude Vision).
3. Cruza dimensões e técnica com obras conhecidas do artista.
4. Devolve relatório estruturado em PDF com nível de confiança, hipóteses, fontes a investigar adicionalmente, comparáveis de leilão, estimativa de valor de mercado, alertas de divergência.
**Stack:** Next.js + Supabase Auth (magic link) + Claude Sonnet 4.6 com web search e vision + geração de PDF (Puppeteer ou react-pdf).
**Esforço:** 8h iniciais + iteração contínua de prompt engineering.
**Impacto:** Reduz dependência de especialista terceirizado; libera os sócios para focar em curadoria e negociação; torna ágil avaliar oportunidades de sourcing remoto na França e em outros lugares; aumenta margem (peça com proveniência documentada vale 30–60% mais).
**Diferencial competitivo:** Nenhum concorrente brasileiro oferece isso. Almeida & Dale tem equipe interna; James Lisboa tem rede de peritos. Cabral & Souza terá ferramenta proprietária com escalabilidade.

### 5.2 Dossiê PDF automatizado por peça
**Problema:** Apresentar uma peça para lead exige material visual + textual profissional. Hoje os sócios mandam fotos no WhatsApp sem padrão.
**Como funciona:** A partir dos dados da peça no Supabase, o sistema gera automaticamente um PDF de 3–5 páginas com: capa visual, ficha técnica completa, biografia resumida do artista, proveniência documentada, comparáveis de leilão (extraídos do scraper), análise de mercado curta, certificado de autenticidade quando disponível, dados de contato da galeria.
**Stack:** react-pdf ou Puppeteer renderizando HTML estilizado + Claude API gerando textos curatoriais a partir dos dados estruturados.
**Esforço:** 6h iniciais + refinamento.
**Impacto:** Vira o "wow factor" da primeira interação com lead. Cliente recebe material que parece feito por curador, não copy-paste de WhatsApp. Diferencia radicalmente da experiência média no mercado brasileiro.

### 5.3 Viewing Room privado (digitaliza o fluxo atual)
**Problema:** Sócios mandam fotos soltas no WhatsApp para leads quentes — funciona mas não tem rastreabilidade, escala mal, e perde apresentação.
**Como funciona:** Você seleciona N peças no admin, clica "criar viewing room para [nome]", recebe URL única com expiração configurável. Cliente abre URL (sem login), vê peças em layout impecável, com mensagem personalizada sua. Sistema rastreia: quando abriu, quanto tempo em cada peça, quais repetiu, se baixou PDF, se compartilhou.
**Stack:** Next.js rota dinâmica `/vr/[token]` + Supabase para tracking + análise no admin.
**Esforço:** 8h iniciais.
**Impacto:** Digitaliza exatamente o fluxo de venda atual dos sócios sem mudar comportamento deles. Você ganha timing perfeito para follow-up. Christie's e Sotheby's chamam isso de "Private Viewing Room" — agora a Cabral & Souza tem o equivalente.

### 5.4 Sourcing reverso com landing dedicada
**Problema:** A galeria depende 100% de indicações passivas para encontrar peças novas. Famílias com espólio googlam "como vender pintura herdada" e caem em sites fracos ou em leiloeiros que cobram comissão alta.
**Como funciona:** Landing `/vender-obra` com SEO agressivo para termos de captação. Formulário coleta foto + contexto + expectativa de valor + contato. Lead cai no admin → agente de proveniência roda análise preliminar → você retorna com proposta em até 5 dias úteis (compra à vista ou consignação).
**Stack:** mesma stack do site público + integração com agente de proveniência.
**Esforço:** 5h.
**Impacto:** Sua comissão maior é em sourcing (20% da venda quando você capta a peça). Este é o canal mais alavancado para retorno financeiro do projeto.

### 5.5 Bot WhatsApp concierge com RAG sobre o acervo
**Problema:** Botão "falar no WhatsApp" sem bot vira inbox lotado de leads de baixa qualificação. Bot genérico não conhece o acervo.
**Como funciona:** WPPConnect roda em VPS. Mensagens entram → classificador (Claude) decide se é (a) qualificação inicial, (b) pergunta sobre peça específica, (c) pergunta sobre artista/mercado, (d) intenção de compra alta → resposta apropriada via RAG + Claude. Hand-off para você quando detecta sinal de compra ou pergunta fora de escopo.
**Stack:** WPPConnect + Next.js API routes + Supabase pgvector + Claude API.
**Esforço:** 12h.
**Impacto:** Triagem 24/7. Você recebe leads pré-qualificados com contexto. Bot vira porta-voz da curadoria fora do horário comercial.

### 5.6 Monitor de leilões para inteligência de mercado
**Problema:** Comparáveis de leilão precisam ser pesquisados manualmente toda vez que se monta um dossiê.
**Como funciona:** Scraper semanal nos sites de Sotheby's, Christie's, Phillips, Bolsa de Arte, James Lisboa, BOLSA e iArremate. Captura: lote, artista, obra, ano, técnica, dimensões, estimativa, preço de martelo. Armazena no Supabase. Quando um dossiê é gerado, sistema busca comparáveis automaticamente.
**Stack:** Cron job no Vercel + Puppeteer ou Playwright + Supabase.
**Esforço:** 12h para os 5 principais sites; depois manutenção quando estruturas HTML mudam.
**Impacto:** Cada dossiê passa a incluir dados reais de valorização. Posição editorial única — a galeria fala com números, não apenas com narrativa estética. **Implementação recomendada: mês 2.**

### 5.7 Catálogo impresso anual (back to physical)
**Problema:** Mercado de arte premia o tangível. Colecionadores valorizam catálogos físicos como objeto de coleção.
**Como funciona:** Sistema gera, a partir do Supabase, um InDesign-ready PDF com 50–80 peças destaque + verbetes + ensaio curatorial anual. Gráfica imprime 50–100 exemplares.
**Stack:** Pandoc + LaTeX ou template react-pdf de alta qualidade + gráfica boutique no RJ ou SP.
**Esforço:** 20h primeira edição.
**Custo:** ~R$ 80–150 por exemplar em tiragem pequena.
**Impacto:** Material de presente para top clientes; peça de marketing tátil; reforça o ar de tradição. **Implementação recomendada: mês 4–6.**

---

## 6. COMPLIANCE REGULATÓRIO

### 6.1 CNART/IPHAN — obrigação ativa
Toda galeria de arte e antiquário no Brasil é obrigada por lei (Decreto-Lei 25/1937, Instrução Normativa IPHAN 01/2007, Portaria IPHAN 396/2016, Lei 9.613/1998 antilavagem) a:
- Cadastrar-se no CNART (Cadastro Nacional de Negociantes de Obras de Arte e Antiguidades).
- Apresentar **semestralmente** a relação descritiva de bens postos à venda.
- Comunicar **anualmente** ao IPHAN a não-ocorrência de operações suspeitas (ou as ocorrências quando houver).
- Comunicar ao **COAF** imediatamente operações em dinheiro acima de R$ 10.000 ou suspeitas.
- Manter cadastro de clientes para operações relevantes.

**Ação operacional no sistema:** o admin do Supabase precisa ter um relatório de exportação semestral em CSV com os campos exigidos pelo CNART, e um workflow de alerta quando operação em dinheiro vivo ultrapassa R$ 10.000.

### 6.2 Lei do Período Monárquico (Lei 4.845/1965)
Proíbe exportação de obras produzidas no Brasil até 1889. **Não afeta Di Cavalcanti, Volpi, Djanira, Sergio Camargo** (todos pós-1889). Afeta Pedro Américo (1843–1905) parcialmente — obras produzidas antes de 1889 não podem ser exportadas. Sistema deve flagar peças nessa condição.

### 6.3 Consulta IPHAN para exportação
Toda venda internacional de obra brasileira exige consulta prévia ao IPHAN via Portal de Serviços para verificar restrições legais (gratuito, resposta em até 15 dias). Sistema deve registrar essa consulta como etapa obrigatória do checklist de venda internacional.

### 6.4 LGPD
- Política de Privacidade e Termos de Uso obrigatórios no rodapé.
- DPO pode ser um dos sócios (Marcelo ou Alexandre) — formalizar nome + email.
- Documentos KYC retidos por 5 anos (prescrição civil para vícios redibitórios), depois exclusão automática.
- **Lembrete para o executor: confirmar com os sócios antes do lançamento se há restrições legais ou éticas no acervo atual (peças tombadas, disputas de proveniência, sigilo de consignantes).**

---

## 7. PROTOCOLO ANTIFRAUDE — DIFERENCIAL COMPETITIVO

Sistema documentado de 4 camadas, com templates de contrato em anexo (`docs/contratos/`):

### Camada 1 — KYC do comprador
Para qualquer venda acima de R$ 20.000:
- CPF + RG ou CNH + comprovante de residência (últimos 90 dias) + selfie segurando o documento.
- Documentos armazenados em Supabase Storage privado com RLS estrita.
- Validação prévia à emissão de qualquer NF ou retirada de peça.

### Camada 2 — Pagamento escalonado
Padrão fixo para venda à distância:
1. **30% de sinal via PIX** (com recibo de sinal emitido) + KYC validado.
2. **Frete contratado pela galeria** com transportadora especializada (Millenium, Atlantis Brazil, Grupo Alke, New Expo) + seguro de transporte integral pelo valor da peça.
3. **Entrega com inspeção pelo comprador**.
4. **5 dias úteis de período de aprovação** (cláusula contratual de devolução se peça divergir do laudo).
5. **70% restante via PIX** antes da liberação do certificado de propriedade e da assinatura do termo de venda definitiva.

### Camada 3 — Vídeo de unboxing obrigatório
Cláusula contratual: comprador grava vídeo contínuo da abertura da embalagem na presença do entregador. Sem vídeo, **não há cobertura para alegação de avaria ou troca**. Protege contra golpe clássico de "chegou quebrada" / "não era essa peça".

### Camada 4 — Validação de procedência ANTES de retirar do vendedor
Quando galeria capta peça nova:
- Documentos de posse (escritura, inventário, certidão de espólio).
- Histórico de aquisição declarado por escrito.
- COA emitido por especialista (interno ou terceirizado) **antes do pagamento ao vendedor**.
- Consulta CNART/COAF para verificar se peça consta em alerta.
- Protege contra **receptação de obra roubada**, que no Brasil é crime mesmo para comprador de boa-fé (art. 180 CP).

### Como isso vira diferencial competitivo
Nenhuma galeria média no Brasil documenta esse rigor publicamente. Página `/como-funciona` no site da Cabral & Souza explicitando o protocolo vira **prova de seriedade** para colecionadores e investidores que tiveram más experiências em outros lugares.

---

## 8. LOGÍSTICA E TRANSPORTADORAS HOMOLOGADAS

Transportadoras especializadas em obras de arte no Brasil (validar contato e orçamento na semana pós-mudança):

| Transportadora | Sede | Pontos fortes |
|---|---|---|
| **Millenium Transportes** | São Paulo (11 3602-6844) | Padrão Gallery and Museum, depósito climatizado, marcenaria própria, histórico com exposições Picasso/Kandinsky/Rodin |
| **Atlantis Brazil** | RJ + SP | Seguro nacional e internacional, reserva climatizada, foco em fine arts |
| **Grupo Alke** | Nacional | Frota própria, art handlers, seguro integral, opção de caminhão compartilhado para reduzir custo |
| **New Expo** | São Paulo | Atende museus e galerias, embalagem sob medida, seguro nacional e internacional |

**Ação:** estabelecer contrato-padrão com 2 dessas (uma para entregas dentro do RJ/SE e outra para nacional) com tabela de preços negociada — antes do primeiro envio.

---

## 9. ESTRATÉGIA DE CONTEÚDO E SEO

### 9.1 Pilares de conteúdo
1. **Verbetes de artistas** (motor de SEO de longo prazo) — biografia, escola, mercado, comparáveis de leilão, peças disponíveis. 2/semana.
2. **Análises de leilão** (autoridade editorial) — quando peça relevante é negociada em Sotheby's, Christie's, Bolsa de Arte, James Lisboa. 1/semana.
3. **Fichas detalhadas de peças** (catálogo) — cada peça vira página indexável com Schema.org `VisualArtwork`. Conforme acervo é cadastrado.
4. **Newsletter mensal "Boletim Cabral & Souza"** — peças destaque + 1 análise + agenda de eventos. 1/mês.

### 9.2 Palavras-chave prioritárias
**Compra (alta intenção):**
- "galeria arte Copacabana", "galeria arte rio de janeiro", "antiquário copacabana"
- "comprar obra [artista]" para cada artista do acervo
- "pintura modernista brasileira", "escultura bronze brasileira"

**Sourcing reverso (alta intenção, baixa concorrência):**
- "como vender pintura herdada", "vender obra de arte rj"
- "avaliar quadro antigo", "vender espólio arte"
- "vender [nome do artista]"

**Autoridade (long-tail):**
- "[nome do artista] biografia", "[nome do artista] obras"
- "mercado de arte brasileira", "valorização [nome do artista]"
- "como identificar obra original [artista]"

### 9.3 Tom de voz da marca (codificado no system prompt do Claude)
**Erudito mas acessível. Denso mas sem prolixidade. Formal mas sem rigidez. Autoridade técnica sem arrogância acadêmica.**
Referências de tom: revista *Bravo!*, catálogos da Pinacoteca de São Paulo, ensaios curatoriais do MASP.
Anti-referências: blog de decoração, copy de e-commerce, linguagem de marketplace.

---

## 10. MÉTRICAS DE SUCESSO E REPORTE

### 10.1 Dashboard interno (admin)
- Sessões e origens de tráfego (GA4)
- Leads capturados (formulário, viewing rooms abertos, conversas WhatsApp)
- Peças mais visualizadas (ranking semanal)
- Funil: lead → conversa → viewing room → venda
- Vendas atribuídas ao digital (UTM + flag manual)
- Custo operacional (Claude API tokens, infra)

### 10.2 Relatório semanal automatizado
PDF de 1 página gerado automaticamente toda segunda-feira com KPIs da semana anterior + peça destaque + análise breve. Profissional e acessível aos sócios.

### 10.3 Marcos de validação
| Marco | Indicador |
|---|---|
| **30 dias** | Site no ar, GMB ranqueando localmente, 30+ peças no catálogo, 15+ leads capturados |
| **60 dias** | Primeira venda atribuível ao digital (qualquer ticket), 60+ leads, tráfego orgânico iniciado, agente de proveniência usado em 5+ peças |
| **90 dias** | Cobertura do investimento mensal (comissão do executor pagou R$ 3.000), pipeline de 3+ negociações ativas via digital, sourcing reverso gerando 1+ peça captada/mês |
| **180 dias** | 100+ peças catalogadas, 3+ vendas digitais documentadas, posição top 3 para "galeria arte Copacabana" |

---

## 11. ESTRATÉGIA DE COMISSÃO E ATRIBUIÇÃO

### 11.1 Modelo a negociar com o sócio (sugestão de baseline)
- **10%** sobre vendas do acervo dos sócios fechadas via canal digital.
- **10%** sobre vendas de peças que o executor captou (sourcing) realizadas pelos sócios.
- **20%** quando o executor capta a peça do vendedor **E** fecha a venda com o comprador.

### 11.2 Sistema de atribuição (defesa política do executor)
Mesmo o executor controlando os leads pessoalmente, manter rastro documentado:
- UTMs em todos os links externos (Instagram, GMB, email, etc.).
- Tabela `lead_attribution` no Supabase com `source`, `medium`, `campaign`, `first_touch_at`, `last_touch_before_sale_at`.
- Cada venda vinculada a um `lead_id`.
- Relatório mensal de atribuição.

**Por quê:** se a operação crescer e houver questionamento futuro sobre comissão (sócio querendo renegociar, ou disputa de atribuição entre canais), o executor tem dado defensável. Custo: zero. Benefício: alto.

### 11.3 Marcos de evolução do projeto
- **3 vendas atribuídas em 90 dias** → renegociar comissão para +5% ou expansão de escopo.
- **Cobertura consistente do custo mensal por 3 meses** → propor projeto formalizado com contrato.
- **Operação digital responsável por 20% da receita da galeria** → propor sociedade ou equity.

---

## 12. REGISTRO DE PENDÊNCIAS DO EXECUTOR

Itens a confirmar com os sócios antes do lançamento ou no início da operação no RJ:

1. ⚠️ **Política de privacidade e DPO**: confirmar nome do encarregado de dados (Marcelo ou Alexandre).
2. ⚠️ **Restrições legais e éticas no acervo**: peças tombadas, com disputas de proveniência, ou consignantes que exigem sigilo absoluto.
3. ⚠️ **Cadastro CNART**: confirmar se a galeria já está cadastrada no IPHAN e se as comunicações semestrais estão em dia.
4. ⚠️ **Lista de contatos**: digitalizar agenda dos sócios para alimentar base de relacionamento (com consentimento LGPD para envio de newsletter).
5. ⚠️ **Logos, fontes e ativos visuais**: confirmar com os sócios se existe identidade visual antiga a respeitar ou liberdade total para refazer.
6. ⚠️ **Especialidade não-declarada**: pergunta da Fase 1 que ficou aberta — investigar com os sócios pessoalmente no RJ.
7. ⚠️ **Logística remota interna deles hoje**: pergunta da Fase 1 que ficou aberta — quando vendem para longe, como fazem?
8. ⚠️ **Acordo formal executor ↔ sócios**: contrato curto definindo propriedade do código (executor), propriedade dos dados (galeria), comissão, transição em caso de saída.

---

## 13. ESTRUTURA DE ARQUIVOS DO PROJETO

Sugestão de organização da pasta `C:\Users\pc\Desktop\Projetos\cabral e souza`:

```
cabral e souza/
├── apps/
│   ├── web/                    # Next.js — site público + admin
│   └── proveniencia/           # Next.js — landing do agente de proveniência (subdomínio)
├── packages/
│   ├── db/                     # Schema Supabase, migrations, seeds
│   ├── ui/                     # Design system compartilhado
│   ├── claude/                 # Wrappers Claude API (tradução, dossiê, agente, RAG)
│   └── shared/                 # Tipos TypeScript, validators, utils
├── services/
│   └── whatsapp-bot/           # WPPConnect server (deploy separado em VPS)
├── docs/
│   ├── 00_DOCUMENTO_ESTRATEGICO.md
│   ├── 01_PROMPT_CURSOR.md
│   ├── 02_SCHEMA_SUPABASE.sql
│   ├── 03_CHECKLIST_15_DIAS.md
│   ├── contratos/
│   ├── compliance/
│   └── marca/
├── .github/workflows/          # CI/CD
└── README.md
```

---

## 14. CONCLUSÃO EXECUTIVA

O projeto Cabral & Souza Digital tem condições reais de viabilidade porque:

1. **O mercado está em alta confirmada por dados:** Brasil é hoje o 2º maior mercado de novos colecionadores do mundo.
2. **O posicionamento da galeria é defensável:** 40 anos, curadoria reconhecida, foco em mestres brasileiros.
3. **O gap competitivo é gritante:** ausência total de presença digital em nicho onde concorrentes diretos também têm execução digital mediana.
4. **A hipótese central é financeiramente sólida:** o digital aqui não precisa virar canal primário de venda — basta amplificar e capturar para a rede existente. Isso reduz risco e prazo de retorno.
5. **As soluções tecnológicas propostas têm impacto direto em comissão:** agente de proveniência, sourcing reverso, viewing room e bot WhatsApp atacam diretamente os gargalos que limitam volume.
6. **O executor tem o perfil técnico exato para construir** sem dependência de terceiros nos primeiros 90 dias.

**O risco principal não é técnico, é político-familiar:** sustentar o projeto com sócios resistentes à internet exige reporte profissional consistente desde a semana 1. O PDF semanal automatizado é o mecanismo crítico para isso.

**Próximo passo:** executar o prompt em `01_PROMPT_CURSOR.md`.
