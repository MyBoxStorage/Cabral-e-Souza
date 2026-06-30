import { BUSINESS } from '@cabral-souza/shared'

/** Mapa estilizado estático — sem dependência de API externa */
export function ContactMap() {
  return (
    <div
      className="relative aspect-[16/7] overflow-hidden border border-cream-200 bg-gradient-to-br from-cream-100 via-cream-200 to-bronze-300/20"
      aria-label={`Localização da galeria: ${BUSINESS.addressFormatted}`}
    >
      {/* Grade urbana abstrata */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#8b6914" strokeWidth="0.5" opacity="0.35" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <path
          d="M0 70% Q30% 55% 55% 62% T100% 48%"
          fill="none"
          stroke="#b8956a"
          strokeWidth="2"
          opacity="0.5"
        />
      </svg>

      {/* Pin bronze */}
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-full flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-bronze-500 ring-4 ring-bronze-500/25 shadow-md" />
        <div className="w-px h-8 bg-bronze-500/60" />
      </div>

      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink-900/75 to-transparent px-6 py-5">
        <p className="font-body font-medium uppercase tracking-eyebrow text-eyebrow text-bronze-300 mb-1">
          Copacabana
        </p>
        <p className="font-display text-title-xs text-cream-100">{BUSINESS.address.street}</p>
        <p className="font-body text-body-sm text-cream-300/80 mt-1">
          {BUSINESS.address.neighborhood} · {BUSINESS.address.city}, {BUSINESS.address.state}
        </p>
      </div>
    </div>
  )
}
