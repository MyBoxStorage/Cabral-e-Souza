import { FaqAccordion, type FaqItem } from '../institutional/FaqAccordion'

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Quanto tempo leva a avaliação completa?',
    answer:
      'A análise preliminar é respondida em até 5 dias úteis após o envio das fotografias e informações solicitadas. Avaliações que exigem inspeção presencial ou consulta a especialistas podem demandar prazo adicional, sempre comunicado com antecedência.',
  },
  {
    question: 'Vocês cobram pela avaliação?',
    answer:
      'A avaliação preliminar para possível aquisição ou consignação não tem custo para o proprietário. Laudos formais para seguro, partilha ou outros fins são tratados como serviço à parte, com escopo e valor definidos previamente.',
  },
  {
    question: 'Como funciona a consignação?',
    answer:
      'Na consignação, a obra permanece de sua propriedade enquanto a galeria conduz a comercialização. Definimos percentual, prazo de exposição e relatórios periódicos sobre o interesse de mercado. A proposta é apresentada por escrito antes de qualquer exposição pública.',
  },
  {
    question: 'E se eu não quiser vender depois?',
    answer:
      'Não há obrigação de venda após a avaliação. Se a proposta não for do seu interesse, encerramos o processo com confidencialidade total. Suas informações e imagens não são utilizadas para outros fins.',
  },
  {
    question: 'Vocês compram diretamente?',
    answer:
      'Sim, quando a obra se alinha ao perfil curatorial do acervo e os termos comerciais são acordados. Em outros casos, recomendamos consignação ou orientamos sobre alternativas no mercado, sempre com transparência.',
  },
]

export function SourcingFaq() {
  return (
    <section aria-labelledby="faq-heading" className="section-padding bg-cream-100">
      <div className="container-default max-w-narrow">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
          Dúvidas frequentes
        </p>
        <h2 id="faq-heading" className="font-display font-normal text-title-sm text-ink-800 mb-10">
          Perguntas frequentes
        </h2>
        <FaqAccordion items={FAQ_ITEMS} />
      </div>
    </section>
  )
}
