/**
 * Tradução com cache por content_hash.
 * NUNCA traduz em runtime sem verificar o cache primeiro.
 */
import { anthropic, CLAUDE_MODEL } from './client'
import { contentHash } from '@cabral-souza/shared'
import { BRAND_VOICE_PROMPT } from '../prompts/brand-voice'
import type { Locale } from '@cabral-souza/shared'

const LANGUAGE_LABEL: Record<Locale, string> = {
  'pt-BR': 'Português do Brasil',
  'en-US': 'English (US)',
  'fr-FR': 'Français',
}

export interface TranslateOptions {
  text: string
  targetLocale: Locale
  /** Se fornecido, verifica cache antes de chamar a API */
  getCached?: (hash: string, locale: Locale) => Promise<string | null>
  /** Se fornecido, persiste a tradução no banco */
  setCached?: (hash: string, locale: Locale, translated: string) => Promise<void>
}

export interface TranslateResult {
  translated: string
  fromCache: boolean
  hash: string
}

export async function translate(opts: TranslateOptions): Promise<TranslateResult> {
  const { text, targetLocale, getCached, setCached } = opts
  const hash = contentHash(text)

  // 1. Verifica cache
  if (getCached) {
    const cached = await getCached(hash, targetLocale)
    if (cached) return { translated: cached, fromCache: true, hash }
  }

  // 2. Chama Claude
  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system: BRAND_VOICE_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Traduza o texto a seguir para ${LANGUAGE_LABEL[targetLocale]}, mantendo rigorosamente o tom de voz da marca, a formatação Markdown, e os nomes de artistas e obras intocados. Retorne APENAS a tradução, sem comentários adicionais.\n\n---\n\n${text}`,
      },
    ],
  })

  const block = message.content[0]
  if (!block || block.type !== 'text') {
    throw new Error('Claude returned unexpected response type')
  }
  const translated = block.text.trim()

  // 3. Persiste no cache
  if (setCached) {
    await setCached(hash, targetLocale, translated)
  }

  return { translated, fromCache: false, hash }
}
