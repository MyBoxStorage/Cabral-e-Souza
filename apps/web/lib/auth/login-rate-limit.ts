/** Rate limit in-memory — substituir por Upstash Redis em produção multi-instância. */

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

interface AttemptRecord {
  timestamps: number[]
}

const attemptsByIp = new Map<string, AttemptRecord>()

function pruneOld(timestamps: number[], now: number): number[] {
  return timestamps.filter((t) => now - t < WINDOW_MS)
}

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now()
  const record = attemptsByIp.get(ip) ?? { timestamps: [] }
  const recent = pruneOld(record.timestamps, now)

  if (recent.length >= MAX_ATTEMPTS) {
    const oldest = recent[0]!
    const retryAfterMs = WINDOW_MS - (now - oldest)
    return { allowed: false, retryAfterMs }
  }

  return { allowed: true }
}

export function recordLoginAttempt(ip: string): void {
  const now = Date.now()
  const record = attemptsByIp.get(ip) ?? { timestamps: [] }
  const recent = pruneOld(record.timestamps, now)
  recent.push(now)
  attemptsByIp.set(ip, { timestamps: recent })
}

export function clearLoginAttempts(ip: string): void {
  attemptsByIp.delete(ip)
}
