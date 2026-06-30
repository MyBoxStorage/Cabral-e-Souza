import { BUSINESS, whatsappUrl } from '@cabral-souza/shared'

export type SitePageSeed = {
  slug: string
  title_pt: string
  seo_title_pt: string
  seo_description_pt: string
  content_pt: string
  is_published: boolean
}

export const SITE_PAGES: SitePageSeed[] = [
  {
    slug: 'sobre',
    title_pt: 'Sobre a Galeria',
    seo_title_pt: 'Sobre a Cabral & Souza — Galeria de Arte desde 1987',
    seo_description_pt:
      'Conheça a história da Cabral & Souza, galeria carioca fundada em 1987, sua filosofia de curadoria e os sócios que conduzem a operação há quatro décadas.',
    is_published: true,
    content_pt: `# Cabral & Souza — quatro décadas de curadoria

A **Cabral & Souza** é uma galeria de arte com sede no Rio de Janeiro, fundada em **1987** por **Marcelo Cabral** e **Alexandre Teixeira de Souza**. Ao longo de quase quarenta anos de operação contínua, a galeria consolidou-se como referência no mercado secundário de arte moderna e contemporânea brasileira, com atuação também em antiguidades selecionadas e objetos de coleção.

Nossa trajetória começou em um momento de transição profunda no cenário artístico nacional: o mercado de leilões ainda se estruturava, os museus ampliavam suas coleções de modernismo e uma geração de colecionadores particulares buscava orientação técnica para formar acervos com critério. Foi nesse contexto que Marcelo e Alexandre estabeleceram uma galeria orientada não pela velocidade comercial, mas pela **integridade curatorial** — cada peça que entra em nosso acervo passa por avaliação rigorosa de autenticidade, estado de conservação e relevância histórica.

## Filosofia de curadoria

Nossa curadoria parte de uma convicção simples e exigente: **a obra deve falar por si**. Não comercializamos decoração nem apostamos em tendências passageiras. Priorizamos artistas cuja produção dialoga com os movimentos fundamentais da arte brasileira — do modernismo dos anos 1920 às vanguardas pós-guerra — e cujas obras apresentam condição técnica compatível com o valor que representam.

O processo curatorial envolve pesquisa documental, consulta a especialistas quando necessário e análise comparativa com obras de referência em museus e coleções institucionais. Trabalhamos com pintura, escultura, desenho e gravura, com ênfase em nomes como *Di Cavalcanti*, *Alfredo Volpi*, *Djanira*, *Sergio Camargo* e *Pedro Américo*, entre outros artistas cuja obra circula com regularidade no mercado secundário brasileiro e internacional.

Acreditamos que uma galeria de arte exerce função cultural além da comercial: **preservar, contextualizar e transmitir conhecimento**. Por isso investimos em verbetes de artistas, análises de mercado e documentação de proveniência — ferramentas que permitem ao colecionador tomar decisões informadas, não impulsivas.

## Os sócios

**Marcelo Cabral** conduz a operação comercial e as relações com colecionadores, vendedores e instituições. Sua experiência de quatro décadas no mercado carioca lhe confere leitura precisa sobre autenticidade, precificação e dinâmica de negociação em obras de alto valor. Marcelo mantém rede ativa de contatos no Brasil e na Europa, essencial para o sourcing internacional que complementa nosso acervo.

**Alexandre Teixeira de Souza** complementa a gestão com olhar técnico sobre conservação, documentação e avaliação estética. Sua participação garante que cada peça oferecida pela galeria atenda a padrões exigentes de condição e coerência com o conjunto curatorial que representamos.

A parceria entre os dois sócios estrutura uma operação que combina **conhecimento de mercado** com **rigor estético** — equilíbrio que sustenta a reputação da galeria desde a fundação.

## Compromisso com o colecionador

Entendemos que adquirir uma obra de arte de valor significativo é uma decisão que envolve confiança. Por isso documentamos proveniência sempre que possível, oferecemos transparência sobre condição e autenticidade, e mantemos canais diretos de comunicação com nossos clientes. A galeria não opera como marketplace anônimo: cada transação é conduzida com acompanhamento personalizado.

Convidamos colecionadores, pesquisadores e visitantes a conhecer nosso acervo, explorar os verbetes de artistas em nosso site e entrar em contato para visitas agendadas em nossa sede no Rio de Janeiro.`,
  },
  {
    slug: 'servicos',
    title_pt: 'Serviços',
    seo_title_pt: 'Serviços — Compra, venda, avaliação e consultoria de arte',
    seo_description_pt:
      'A Cabral & Souza oferece compra e venda de obras, avaliação técnica, consultoria para colecionadores e sourcing internacional de arte moderna brasileira.',
    is_published: true,
    content_pt: `# Serviços da galeria

A **Cabral & Souza** oferece um conjunto de serviços voltados a colecionadores, herdeiros, instituições e investidores que buscam orientação técnica no mercado de arte brasileira. Nossa atuação cobre todo o ciclo de uma obra — da identificação e avaliação à comercialização e aquisição — sempre com o rigor curatorial que define nossa operação desde 1987.

## Compra de obras

Adquirimos pinturas, esculturas, desenhos e gravuras de artistas modernos e contemporâneos brasileiros, com preferência por obras de autoria confirmada ou atribuição fundamentada. Avaliamos propostas de venda enviadas por colecionadores, herdeiros e outros detentores de obras, conduzindo análise preliminar a partir de fotografias e, quando necessário, inspeção presencial.

O processo de compra inclui verificação de autenticidade, avaliação de estado de conservação e pesquisa de mercado para definição de valor justo. Propostas são respondidas em prazo definido, com transparência sobre os critérios que orientam nossa decisão de aquisição.

## Venda e consignação

Comercializamos obras do acervo próprio da galeria e de consignação, com precificação baseada em comparáveis de leilão, transações privadas e condição específica de cada peça. Obras podem ser apresentadas em nosso catálogo digital, em viewing rooms privados para colecionadores qualificados ou mediante visita agendada em nossa sede.

Para vendedores que preferem consignar em vez de vender diretamente, estruturamos acordos com percentual definido, prazo de exposição e relatórios periódicos sobre interesse de mercado. A consignação permite ao proprietário manter a propriedade da obra enquanto a galeria conduz a comercialização com sua rede de contatos.

## Avaliação técnica

Oferecemos serviço de avaliação para fins de venda, seguro, partilha de espólio ou simples levantamento patrimonial. A avaliação considera autoria, datação, técnica, dimensões, estado de conservação, proveniência documentada e comparáveis de mercado recentes.

Laudos são elaborados com linguagem técnica adequada ao fim pretendido, distinguindo avaliação comercial (valor de mercado para transação) de avaliação para outros propósitos. Quando a autoria não puder ser confirmada com segurança, isso é explicitado no documento, preservando a integridade da informação.

## Consultoria para colecionadores

Auxiliamos colecionadores na formação, ampliação ou reorganização de acervos, com orientação sobre artistas, períodos, condição de obras e estratégia de aquisição. A consultoria pode envolver acompanhamento em leilões, identificação de oportunidades no mercado secundário e articulação com restauradores, transportadores e seguradoras especializadas.

Este serviço é particularmente relevante para colecionadores que desejam aprofundar conhecimento sobre movimentos específicos — modernismo brasileiro, concretismo, arte popular erudita — sem abdicar de critérios técnicos sólidos.

## Sourcing internacional

Mantemos operação ativa de sourcing na Europa, com viagens periódicas à França e contatos estabelecidos em mercados secundários europeus. O sourcing internacional permite identificar obras de artistas brasileiros em coleções no exterior — peças que retornam ao mercado nacional com documentação e contexto adequados.

Para colecionadores brasileiros, o sourcing internacional amplia o leque de obras disponíveis. Para vendedores no exterior, oferecemos ponte com compradores qualificados no Brasil. Toda operação internacional observa requisitos de exportação, importação e documentação alfandegária.

## Como iniciar

Para qualquer um destes serviços, entre em contato por WhatsApp ou e-mail com descrição inicial da obra ou da necessidade. Responderemos com orientação sobre próximos passos, documentação necessária e prazos estimados.`,
  },
  {
    slug: 'como-funciona',
    title_pt: 'Como Funciona',
    seo_title_pt: 'Como Funciona — Protocolo de segurança e transações',
    seo_description_pt:
      'Entenda o protocolo antifraude em quatro camadas, logística especializada, verificação KYC e pagamento escalonado da Cabral & Souza para transações de arte de alto valor.',
    is_published: true,
    content_pt: `# Como funcionam nossas transações

Transações com obras de arte de alto valor exigem procedimentos que vão além de uma compra convencional. A **Cabral & Souza** estruturou um protocolo operacional que combina **segurança jurídica**, **verificação de identidade** e **logística especializada**, permitindo que colecionadores em qualquer parte do Brasil — e no exterior — negociem com a mesma confiança de uma visita presencial à galeria.

## Protocolo antifraude em quatro camadas

Nosso sistema de proteção opera em camadas complementares, cada uma projetada para mitigar riscos específicos de fraudes no mercado de arte.

**Primeira camada — verificação documental da obra.** Antes de qualquer negociação, analisamos a documentação disponível: certificados de autenticidade, laudos de institutos especializados, registros de proveniência, fotografias históricas e publicações em catálogos. Obras sem documentação mínima aceitável não entram em nosso fluxo comercial.

**Segunda camada — inspeção técnica.** Quando a obra está sob nossa custódia ou acessível para visita, conduzimos inspeção detalhada de autenticidade, estado de conservação e coerência entre a documentação e o objeto físico. Inconsistências são investigadas antes de prosseguir.

**Terceira camada — verificação de contraparte (KYC).** Toda contraparte — comprador ou vendedor — passa por procedimento de identificação e verificação, conforme detalhado abaixo. Não realizamos transações com partes não identificadas ou que não atendam aos requisitos regulatórios aplicáveis.

**Quarta camada — custódia e pagamento escalonado.** Valores são movimentados apenas após confirmação de etapas definidas no contrato. O pagamento não é liberado integralmente antes da entrega e aceite da obra, reduzindo exposição de ambas as partes.

## Logística especializada

O transporte de obras de arte requer embalagem, seguro e transportadores com experiência comprovada. Trabalhamos com empresas especializadas em arte para deslocamentos nacionais e internacionais, com embalagem adequada ao meio (crating para obras de grande formato, caixas climatizadas quando necessário).

Cada remessa é segurada pelo valor acordado na transação. Rastreamento e confirmação de recebimento fazem parte do fluxo padrão. Para obras de valor excepcional, avaliamos a necessidade de transporte com escolta ou condições adicionais de segurança.

## Verificação de identidade (KYC)

Em conformidade com a regulamentação aplicável ao comércio de bens de valor e às normas de prevenção à lavagem de dinheiro, solicitamos documentação de identificação de compradores e vendedores antes de formalizar transações acima de determinados patamares de valor.

A documentação típica inclui documento de identidade com foto, comprovante de residência e, para pessoas jurídicas, contrato social e documentos dos representantes legais. Em transações internacionais, aplicam-se requisitos adicionais conforme a jurisdição envolvida.

As informações coletadas são tratadas com confidencialidade, em conformidade com a Lei Geral de Proteção de Dados (LGPD), e utilizadas exclusivamente para fins de verificação e cumprimento regulatório.

## Pagamento escalonado

Estruturamos pagamentos em etapas vinculadas a marcos objetivos da transação:

1. **Sinal ou reserva** — valor simbólico que garante exclusividade durante o período de due diligence.
2. **Confirmação da obra** — após inspeção e aceite, percentual adicional é depositado em conta vinculada à operação.
3. **Entrega e aceite final** — saldo liberado após confirmação de recebimento da obra em condições acordadas.

Este modelo protege comprador e vendedor: o comprador não desembolsa o valor integral antes de verificar a obra; o vendedor tem garantia de que o comprador está comprometido com a transação.

## Transações remotas

Para colecionadores que não podem visitar a galeria presencialmente, oferecemos viewing rooms digitais com imagens em alta resolução, vídeos e, quando disponível, relatórios de condição. A decisão de compra remota é sempre acompanhada pelos mesmos protocolos de verificação e pagamento escalonado descritos acima.

Dúvidas sobre qualquer etapa do processo podem ser esclarecidas diretamente com nossa equipe por WhatsApp ou e-mail.`,
  },
  {
    slug: 'contato',
    title_pt: 'Contato',
    seo_title_pt: 'Contato — Cabral & Souza Galeria de Arte, Rio de Janeiro',
    seo_description_pt:
      'Entre em contato com a Cabral & Souza. Galeria em Copacabana, Rio de Janeiro. WhatsApp, e-mail e horário de atendimento para visitas agendadas.',
    is_published: true,
    content_pt: `# Contato

A **Cabral & Souza** atende colecionadores, pesquisadores, herdeiros e visitantes por canais diretos, com preferência para agendamento prévio de visitas à galeria. Nossa equipe responde consultas sobre obras do acervo, avaliações, consignação e serviços de consultoria — sempre com a atenção personalizada que transações de arte de alto valor exigem.

## Endereço

**${BUSINESS.name} ${BUSINESS.tagline}**  
${BUSINESS.address.street}  
${BUSINESS.address.neighborhood} · ${BUSINESS.address.city} — ${BUSINESS.address.state}  
${BUSINESS.addressZipLine}

A galeria está localizada em Copacabana, na Zona Sul do Rio de Janeiro. Visitas são recebidas **mediante agendamento**, para que possamos dedicar atenção adequada a cada colecionador.

## Canais de comunicação

**WhatsApp:** [${BUSINESS.phone.whatsappDisplay}](${whatsappUrl()})  
Canal preferencial para consultas rápidas, envio de fotografias de obras para avaliação preliminar e agendamento de visitas.

**E-mail:** ${BUSINESS.email}  
Para propostas formais, envio de documentação, laudos, contratos e correspondência que exija registro escrito.

## Horário de atendimento

| Dia | Horário |
|-----|---------|
| Segunda a sexta | 10h às 18h |
| Sábado | 10h às 14h |
| Domingo e feriados | Fechado |

Atendimento por WhatsApp e e-mail pode ocorrer fora do horário comercial, com resposta no próximo dia útil.

## Como podemos ajudar

- **Consulta sobre obras do acervo** — disponibilidade, condição, proveniência, dimensões e valores.
- **Avaliação preliminar** — envie fotografias e informações básicas; orientamos sobre viabilidade de análise completa.
- **Agendamento de visita** — conheça obras presencialmente em ambiente adequado para contemplação.
- **Consultoria** — orientação para colecionadores em formação ou ampliação de acervo.
- **Consignação e venda** — propostas de obras para avaliação de compra ou consignação.

Aguardamos seu contato.`,
  },
  {
    slug: 'privacidade',
    title_pt: 'Política de Privacidade',
    seo_title_pt: 'Política de Privacidade — Cabral & Souza',
    seo_description_pt:
      'Política de privacidade da Cabral & Souza em conformidade com a LGPD. Saiba como coletamos, utilizamos e protegemos seus dados pessoais.',
    is_published: true,
    content_pt: `# Política de Privacidade

**Última atualização:** junho de 2026

A **Cabral & Souza Galeria de Arte**, com sede na ${BUSINESS.address.street}, ${BUSINESS.address.neighborhood}, ${BUSINESS.address.city} — ${BUSINESS.address.state}, ${BUSINESS.addressZipLine}, doravante denominada "Galeria", apresenta esta Política de Privacidade em conformidade com a Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (LGPD).

## 1. Controlador dos dados

O controlador dos dados pessoais tratados neste site e nos canais de comunicação da Galeria é a Cabral & Souza Galeria de Arte. Para exercer seus direitos como titular de dados ou esclarecer dúvidas sobre esta política, entre em contato pelo e-mail **${BUSINESS.privacyEmail}**.

## 2. Dados que coletamos

Podemos coletar as seguintes categorias de dados pessoais, conforme a interação do titular com nossos serviços:

- **Dados de identificação:** nome completo, CPF ou CNPJ, documento de identidade, data de nascimento.
- **Dados de contato:** endereço de e-mail, número de telefone, endereço residencial ou comercial.
- **Dados de navegação:** endereço IP, tipo de navegador, páginas visitadas, tempo de permanência, cookies e identificadores de dispositivo.
- **Dados de transação:** informações sobre obras consultadas, adquiridas ou oferecidas à venda, valores envolvidos e histórico de comunicação.
- **Dados de verificação (KYC):** documentação solicitada para cumprimento de obrigações regulatórias em transações de alto valor.

A coleta ocorre de forma voluntária — quando o titular preenche formulários, entra em contato ou realiza transações — ou automática, por meio de cookies e tecnologias similares durante a navegação no site.

## 3. Finalidades do tratamento

Utilizamos dados pessoais para as seguintes finalidades:

- Prestação de serviços de comercialização, avaliação e consultoria em obras de arte.
- Comunicação com colecionadores, vendedores e visitantes sobre obras, agendamentos e transações.
- Cumprimento de obrigações legais e regulatórias, incluindo prevenção à lavagem de dinheiro e verificação de identidade.
- Envio de newsletter e comunicações sobre o acervo, mediante consentimento prévio do titular.
- Melhoria da experiência de navegação e análise estatística de uso do site.
- Exercício regular de direitos em processos judiciais, administrativos ou arbitrais.

## 4. Base legal

O tratamento de dados pessoais pela Galeria fundamenta-se nas seguintes bases legais previstas na LGPD:

- **Execução de contrato** — para condução de transações e prestação de serviços solicitados.
- **Cumprimento de obrigação legal ou regulatória** — para atendimento a normas de prevenção à lavagem de dinheiro e outras exigências aplicáveis.
- **Legítimo interesse** — para segurança das operações, prevenção a fraudes e melhoria dos serviços.
- **Consentimento** — para envio de comunicações de marketing e uso de cookies não essenciais.

## 5. Compartilhamento de dados e subprocessadores

A Galeria não comercializa dados pessoais. O compartilhamento ocorre apenas quando necessário para:

- Prestadores de serviço que auxiliam em logística, pagamentos, seguros e tecnologia, sob contratos que exigem proteção adequada dos dados.
- **Subprocessadores de tecnologia:** utilizamos **Supabase** (banco de dados e armazenamento), **Resend** (envio de e-mails transacionais) e **Vercel** (hospedagem e entrega do site). Esses provedores tratam dados estritamente conforme nossas instruções e em ambiente compatível com a LGPD.
- Autoridades públicas, quando exigido por lei ou ordem judicial.
- Instituições financeiras e intermediários de pagamento, para processamento de transações.

## 6. Retenção e segurança

Mantemos dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política ou conforme exigido por lei. Dados de transações e verificação de identidade podem ser retidos por prazos superiores, em conformidade com regulamentação aplicável.

Adotamos medidas técnicas e administrativas para proteger dados contra acesso não autorizado, perda, alteração ou destruição, incluindo criptografia em trânsito, controle de acesso e políticas internas de confidencialidade.

## 7. Direitos do titular

Nos termos da LGPD, o titular de dados pessoais pode solicitar:

- Confirmação da existência de tratamento e acesso aos dados.
- Correção de dados incompletos, inexatos ou desatualizados.
- Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade.
- Portabilidade dos dados a outro fornecedor de serviço.
- Eliminação dos dados tratados com base no consentimento.
- Informação sobre compartilhamento com terceiros.
- Revogação do consentimento, quando aplicável.

Solicitações devem ser enviadas para **${BUSINESS.privacyEmail}**. Responderemos no prazo legal de até 15 dias.

## 8. Cookies

Utilizamos cookies essenciais para funcionamento do site e cookies analíticos para compreender padrões de uso. O titular pode gerenciar preferências de cookies nas configurações do navegador. A desativação de cookies essenciais pode afetar funcionalidades do site.

## 9. Alterações

Esta política pode ser atualizada periodicamente. A data da última atualização será indicada no topo do documento. Alterações relevantes serão comunicadas por meio do site ou por e-mail aos titulares cadastrados.`,
  },
  {
    slug: 'termos',
    title_pt: 'Termos de Uso',
    seo_title_pt: 'Termos de Uso — Cabral & Souza',
    seo_description_pt:
      'Termos de uso do site e dos serviços da Cabral & Souza Galeria de Arte. Condições de navegação, propriedade intelectual e limitações de responsabilidade.',
    is_published: true,
    content_pt: `# Termos de Uso

**Última atualização:** junho de 2026

Estes Termos de Uso regulam o acesso e a utilização do site **cabralesouza.com.br** e dos serviços oferecidos pela **Cabral & Souza Galeria de Arte**, com sede na ${BUSINESS.address.street}, ${BUSINESS.address.neighborhood}, ${BUSINESS.address.city} — ${BUSINESS.address.state}. Ao acessar o site ou utilizar nossos serviços, o usuário declara ter lido, compreendido e concordado com estes termos.

## 1. Objeto

O site tem caráter informativo e comercial, apresentando o acervo da galeria, verbetes de artistas, análises de mercado e canais de contato para transações de obras de arte. Os serviços oferecidos incluem compra, venda, avaliação, consultoria e sourcing internacional, conforme descrito na página de Serviços.

## 2. Elegibilidade e cadastro

O uso de determinadas funcionalidades — como newsletter, viewing rooms privados ou formalização de transações — pode exigir cadastro e fornecimento de dados pessoais. O usuário declara que as informações fornecidas são verdadeiras e atualizadas, responsabilizando-se por sua exatidão.

A Galeria reserva-se o direito de recusar ou encerrar cadastros que violem estes termos ou apresentem indícios de uso fraudulento.

## 3. Propriedade intelectual

Todo o conteúdo do site — textos, imagens de obras, logotipos, design, estrutura de navegação e materiais curatoriais — é de propriedade da Cabral & Souza ou de licenciadores, protegido pela legislação brasileira de direitos autorais e propriedade industrial.

É vedada a reprodução, distribuição, modificação ou uso comercial de qualquer conteúdo sem autorização prévia por escrito. O compartilhamento de links para páginas públicas do site é permitido, desde que não sugira associação, endosso ou parceria inexistente com a Galeria.

Imagens de obras de arte podem estar sujeitas a direitos de reprodução de artistas ou seus espólios. A Galeria envida esforços para garantir conformidade, mas o uso de imagens fora do contexto do site é de responsabilidade do usuário.

## 4. Informações sobre obras

As descrições, imagens e informações sobre obras apresentadas no site têm caráter informativo. Autenticidade, condição, dimensões e demais atributos são confirmados no momento da transação, mediante inspeção e documentação disponível.

A disponibilidade de obras pode alterar-se sem aviso prévio em razão de vendas, consignações ou decisões curatorial. A inclusão de uma obra no site não constitui oferta vinculante; propostas de compra estão sujeitas à confirmação pela Galeria.

Valores exibidos, quando presentes, referem-se a condições vigentes na data de publicação e podem ser alterados. Obras com preço "sob consulta" requerem contato direto para negociação.

## 5. Conduta do usuário

O usuário compromete-se a utilizar o site e os canais de comunicação da Galeria de forma lícita, abstendo-se de:

- Enviar informações falsas ou enganosas sobre obras ou identidade.
- Tentar acessar áreas restritas, sistemas ou dados de terceiros sem autorização.
- Utilizar robôs, scrapers ou meios automatizados para extração massiva de conteúdo.
- Praticar atos que prejudiquem o funcionamento do site ou a experiência de outros usuários.

## 6. Limitação de responsabilidade

A Galeria emprega esforços razoáveis para manter o site atualizado e funcional, mas não garante disponibilidade ininterrupta ou ausência de erros. Interrupções por manutenção, falhas técnicas ou eventos de força maior não geram responsabilidade por danos indiretos.

O conteúdo editorial — análises de mercado, verbetes de artistas, estimativas de valorização — reflete opinião curatorial baseada em fontes disponíveis e não constitui aconselhamento financeiro ou garantia de retorno. Decisões de investimento em arte são de exclusiva responsabilidade do colecionador.

## 7. Transações

Transações de compra e venda de obras são formalizadas por contrato específico, que prevalece sobre estes Termos de Uso em caso de conflito. Condições de pagamento, entrega, garantias e devolução são definidas em cada operação, conforme protocolo descrito na página Como Funciona.

## 8. Links externos

O site pode conter links para sites de terceiros. A Galeria não controla nem se responsabiliza pelo conteúdo, políticas de privacidade ou práticas de sites externos.

## 9. Alterações

A Cabral & Souza pode alterar estes Termos de Uso a qualquer momento. A versão vigente estará sempre disponível nesta página, com indicação da data de atualização. O uso continuado do site após alterações constitui aceitação dos novos termos.

## 10. Lei aplicável e foro

Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca do Rio de Janeiro para dirimir quaisquer controvérsias, com renúncia a outro, por mais privilegiado que seja.

## 11. Contato

Dúvidas sobre estes Termos de Uso podem ser dirigidas a **${BUSINESS.email}**.`,
  },
]
