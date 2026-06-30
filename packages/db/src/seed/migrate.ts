import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import pg from 'pg'
import './client'

function getDatabaseUrl(): string | undefined {
  return process.env['DATABASE_URL']
}

export async function runMigrations(): Promise<void> {
  const databaseUrl = getDatabaseUrl()
  if (!databaseUrl) {
    console.warn('   ⚠ DATABASE_URL não encontrada — execute 0002_site_pages.sql manualmente')
    return
  }

  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })
  await client.connect()

  try {
    const migrationPath = resolve(__dirname, '../../migrations/0002_site_pages.sql')
    const sql = readFileSync(migrationPath, 'utf8')
    await client.query(sql)
    console.log('   ✓ Migration 0002 (site_pages) aplicada')
  } finally {
    await client.end()
  }
}
