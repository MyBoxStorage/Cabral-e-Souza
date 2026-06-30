import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import pg from 'pg'
import './client'

const PROJECT_REF = 'qbhiiwuigottaqmedrha'
const DEFAULT_REGION = 'sa-east-1'
/** Pooler real do projeto (Dashboard → Connect); sa-east-1 usa aws-1-us-east-1 */
const DEFAULT_POOLER_HOST = 'aws-1-us-east-1.pooler.supabase.com'

function extractProjectRef(): string {
  const url = process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? ''
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/)
  return match?.[1] ?? PROJECT_REF
}

function getDbPassword(): string | undefined {
  return process.env['SUPABASE_DB_PASSWORD'] ?? undefined
}

/** Constrói URL do pooler Supabase (formato recomendado para migrations). */
export function buildDatabaseUrl(): string | undefined {
  const password = getDbPassword()
  const ref = extractProjectRef()
  const region = process.env['SUPABASE_DB_REGION'] ?? DEFAULT_REGION

  const poolerHost = process.env['SUPABASE_DB_POOLER_HOST'] ?? DEFAULT_POOLER_HOST
  if (password) {
    return `postgresql://postgres.${ref}:${encodeURIComponent(password)}@${poolerHost}:6543/postgres`
  }

  const legacy = process.env['DATABASE_URL']
  if (legacy && !legacy.includes('\\')) return legacy

  return undefined
}

export async function runMigrations(): Promise<void> {
  const password = getDbPassword()
  const ref = extractProjectRef()
  const region = process.env['SUPABASE_DB_REGION'] ?? DEFAULT_REGION

  if (!password) {
    throw new Error(
      'Configure SUPABASE_DB_PASSWORD em apps/web/.env.local (Dashboard → Settings → Database → Database password)',
    )
  }

  const encoded = encodeURIComponent(password)
  const poolerHost = process.env['SUPABASE_DB_POOLER_HOST'] ?? DEFAULT_POOLER_HOST
  const legacyHost = `aws-0-${region}.pooler.supabase.com`
  const candidates = [
    `postgresql://postgres.${ref}:${encoded}@${poolerHost}:6543/postgres`,
    `postgresql://postgres.${ref}:${encoded}@${poolerHost}:5432/postgres`,
    `postgresql://postgres.${ref}:${encoded}@${legacyHost}:6543/postgres`,
    `postgresql://postgres.${ref}:${encoded}@${legacyHost}:5432/postgres`,
    process.env['DATABASE_URL']?.includes('[YOUR-PASSWORD]') ? undefined : process.env['DATABASE_URL'],
  ].filter(Boolean) as string[]

  let lastError: Error | undefined
  for (const databaseUrl of candidates) {
    const client = new pg.Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    })
    try {
      await client.connect()
      const migrationsDir = resolve(__dirname, '../../migrations')
      const files = readdirSync(migrationsDir)
        .filter((f) => f.endsWith('.sql') && /^000[2-9]|^00[1-9][0-9]/.test(f))
        .sort()

      for (const file of files) {
        const sql = readFileSync(resolve(migrationsDir, file), 'utf8')
        await client.query(sql)
        console.log(`   ✓ Migration ${file} aplicada`)
      }
      await client.end()
      return
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      await client.end().catch(() => {})
    }
  }

  throw lastError ?? new Error('Não foi possível conectar ao PostgreSQL')
}

export async function verifySitePagesTable(): Promise<boolean> {
  const databaseUrl = buildDatabaseUrl()
  if (!databaseUrl) return false

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    const { rows } = await client.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'site_pages'
      ) AS ok`,
    )
    return rows[0]?.ok === true
  } catch {
    return false
  } finally {
    await client.end().catch(() => {})
  }
}
