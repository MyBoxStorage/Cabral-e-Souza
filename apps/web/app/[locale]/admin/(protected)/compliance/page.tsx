import Link from 'next/link'

export const metadata = { title: 'Compliance CNART / COAF' }

export default function CompliancePage() {
  return (
    <div className="max-w-[800px]">
      <div className="mb-8">
        <h1 className="font-display text-[1.75rem] font-light text-[--color-ink]">
          Compliance CNART / COAF
        </h1>
        <p className="font-body text-[12px] text-[--color-ink-subtle] mt-1">
          Relatórios semestral e anual para o Conselho Nacional de Arte.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Exportação CSV */}
        <div className="border border-[--color-border] p-6">
          <h2 className="font-display text-[1rem] font-light text-[--color-ink] mb-2">
            Exportar relatório CSV
          </h2>
          <p className="font-body text-[12px] text-[--color-ink-subtle] mb-5">
            Exporta todas as vendas do período com dados de comprador, obra, valor e proveniência,
            no formato aceito pelo CNART.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/api/admin/export/cnart?period=semester"
              className="inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-accent] hover:bg-[--color-accent-deep] px-5 py-2.5 transition-colors w-fit"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Semestre atual
            </Link>
            <Link
              href="/api/admin/export/cnart?period=year"
              className="inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] border border-[--color-border] hover:border-[--color-accent] px-5 py-2.5 transition-colors w-fit"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Ano atual
            </Link>
          </div>
        </div>

        {/* Alertas */}
        <div className="border border-[--color-border] p-6">
          <h2 className="font-display text-[1rem] font-light text-[--color-ink] mb-2">
            Itens com atenção
          </h2>
          <p className="font-body text-[12px] text-[--color-ink-subtle] mb-5">
            Peças com restrição IPHAN, operações acima de R$ 30.000 ou sem documentação completa.
          </p>
          <Link
            href="/api/admin/export/cnart?filter=alerts"
            className="inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink] border border-[--color-border] hover:border-[--color-accent] px-5 py-2.5 transition-colors w-fit"
          >
            Ver alertas
          </Link>
        </div>
      </div>

      {/* Orientações */}
      <div className="border border-[--color-border] p-6 bg-[--color-surface]">
        <h3 className="font-body text-[11px] uppercase tracking-[0.1em] text-[--color-ink-subtle] mb-4">
          Orientações legais
        </h3>
        <ul className="space-y-2.5">
          {[
            'Relatório CNART semestral: prazo até 31 de janeiro e 31 de julho de cada ano.',
            'Operações acima de R$ 30.000 devem ser comunicadas ao COAF em até 24 horas.',
            'Manter toda documentação de proveniência por no mínimo 5 anos.',
            'Peças com restrição IPHAN não podem ser exportadas sem autorização prévia.',
            'Vendas a PEPs (Pessoas Expostas Politicamente) requerem diligência reforçada.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-[--color-accent] mt-2 shrink-0" aria-hidden />
              <p className="font-body text-[12px] text-[--color-ink]">{item}</p>
            </li>
          ))}
        </ul>
        <p className="font-body text-[11px] text-[--color-ink-subtle] mt-4">
          Referências:{' '}
          <a href="https://www.cnart.gov.br" target="_blank" rel="noopener noreferrer" className="text-[--color-accent] hover:underline">CNART</a>
          {' · '}
          <a href="https://www.coaf.fazenda.gov.br" target="_blank" rel="noopener noreferrer" className="text-[--color-accent] hover:underline">COAF</a>
          {' · '}
          <a href="http://www.planalto.gov.br/ccivil_03/leis/l9613.htm" target="_blank" rel="noopener noreferrer" className="text-[--color-accent] hover:underline">Lei 9.613/98</a>
        </p>
      </div>
    </div>
  )
}
