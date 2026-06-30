export const CONSENT_COOKIE_NAME = 'cs_cookie_consent'
export const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export interface ConsentState {
  analytics: boolean
  marketing: boolean
  decided: boolean
}

export function parseConsentCookie(value: string | undefined): ConsentState | null {
  if (!value) return null
  try {
    const decoded = value.startsWith('%') ? decodeURIComponent(value) : value
    return JSON.parse(decoded) as ConsentState
  } catch {
    return null
  }
}

export function serializeConsentCookie(state: ConsentState): string {
  return encodeURIComponent(JSON.stringify(state))
}

export function consentCookieAttributes(): string {
  return `path=/;max-age=${CONSENT_COOKIE_MAX_AGE};SameSite=Lax`
}
