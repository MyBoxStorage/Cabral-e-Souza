import { MarkdownContent } from '../content/MarkdownContent'

/** Trechos editoriais extraídos do verbete institucional */
export function SobreEditorialSections() {
  return (
    <>
      <section id="filosofia" className="section-padding bg-cream-100 border-t border-cream-200">
        <div className="container-default max-w-narrow mx-auto">
          <MarkdownContent
            variant="editorial"
            dropcap
            content={`## Filosofia de curadoria

Nossa curadoria parte de uma convicção simples e exigente: **a obra deve falar por si**. Não comercializamos decoração nem apostamos em tendências passageiras. Priorizamos artistas cuja produção dialoga com os movimentos fundamentais da arte brasileira — do modernismo dos anos 1920 às vanguardas pós-guerra — e cujas obras apresentam condição técnica compatível com o valor que representam.

O processo curatorial envolve pesquisa documental, consulta a especialistas quando necessário e análise comparativa com obras de referência em museus e coleções institucionais.`}
          />
        </div>
      </section>

      <section id="compromisso" className="section-padding bg-cream-50">
        <div className="container-default max-w-narrow mx-auto">
          <MarkdownContent
            variant="editorial"
            content={`## Compromisso com o colecionador

Entendemos que adquirir uma obra de arte de valor significativo é uma decisão que envolve confiança. Por isso documentamos proveniência sempre que possível, oferecemos transparência sobre condição e autenticidade, e mantemos canais diretos de comunicação com nossos clientes. A galeria não opera como marketplace anônimo: cada transação é conduzida com acompanhamento personalizado.`}
          />
        </div>
      </section>
    </>
  )
}
