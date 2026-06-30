import { BUSINESS, whatsappUrl } from '@cabral-souza/shared'

export function ContactChannels() {
  const helpItems = [
    'Consulta sobre obras do acervo — disponibilidade, condição e proveniência',
    'Avaliação preliminar — envie fotografias e informações básicas',
    'Agendamento de visita presencial em Copacabana',
    'Consultoria para colecionadores em formação ou ampliação de acervo',
    'Propostas de consignação e venda de obras',
  ]

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h2 className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
          Endereço
        </h2>
        <p className="font-display text-title-xs text-ink-800 mb-2">
          {BUSINESS.name} {BUSINESS.tagline}
        </p>
        <address className="not-italic font-body text-body text-ink-700 leading-relaxed">
          {BUSINESS.address.street}
          <br />
          {BUSINESS.address.neighborhood} · {BUSINESS.address.city} — {BUSINESS.address.state}
          <br />
          {BUSINESS.addressZipLine}
        </address>
        <p className="font-body text-body-sm text-ink-700 mt-4">
          Visitas mediante agendamento prévio, para atenção personalizada a cada colecionador.
        </p>
      </div>

      <div>
        <h2 className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
          Canais de comunicação
        </h2>
        <div className="flex flex-col gap-4">
          <a
            href={whatsappUrl()}
            className="group inline-flex flex-col border border-cream-200 bg-cream-50 p-5 hover:border-bronze-500/40 transition-colors duration-base"
          >
            <span className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-1">
              WhatsApp
            </span>
            <span className="font-display text-title-xs text-ink-800 group-hover:text-bronze-500 transition-colors">
              {BUSINESS.phone.whatsappDisplay}
            </span>
            <span className="font-body text-body-sm text-ink-700 mt-2">
              Canal preferencial para consultas rápidas e envio de fotografias.
            </span>
          </a>
          <div className="border border-cream-200 bg-cream-50 p-5">
            <span className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-1 block">
              E-mail
            </span>
            <a
              href={`mailto:${BUSINESS.email}`}
              className="font-display text-title-xs text-ink-800 hover:text-bronze-500 transition-colors"
            >
              {BUSINESS.email}
            </a>
            <p className="font-body text-body-sm text-ink-700 mt-2">
              Para propostas formais, documentação e correspondência escrita.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
          Horário de atendimento
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <tbody>
              {[
                ['Segunda a sexta', '10h às 18h'],
                ['Sábado', '10h às 14h'],
                ['Domingo e feriados', 'Fechado'],
              ].map(([day, hours]) => (
                <tr key={day} className="border-b border-cream-200">
                  <th scope="row" className="py-3 pr-6 text-left font-body font-medium text-ink-800">
                    {day}
                  </th>
                  <td className="py-3 font-body text-ink-700">{hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-body text-body-sm text-ink-700 mt-4">
          Atendimento por WhatsApp e e-mail pode ocorrer fora do horário comercial, com resposta no próximo dia útil.
        </p>
      </div>

      <div>
        <h2 className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-500 mb-4">
          Como podemos ajudar
        </h2>
        <ul className="list-disc pl-5 space-y-2 font-body text-body text-ink-700">
          {helpItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="border-l-2 border-bronze-500 pl-6">
        <h2 className="font-display text-title-xs text-ink-800 mb-3">Colecionadores de outras cidades</h2>
        <p className="font-body text-body text-ink-700 leading-relaxed">
          Recebemos visitantes de todo o Brasil e do exterior. Podemos combinar viewing room privado, envio de
          dossiers digitais e orientação logística para deslocamento até nossa sede em Copacabana.
        </p>
      </div>
    </div>
  )
}
