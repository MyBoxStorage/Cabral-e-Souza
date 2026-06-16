/**
 * Script de migração direta via pg (sem Supabase CLI).
 * Uso: node scripts/run-migration.mjs
 */
import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { Client } = pg

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// Transaction Pooler us-east-1 (IPv4, conectividade confirmada)
// DDL funciona via blocos individuais (sem transação implícita entre statements)
const client = new Client({
  host: 'aws-1-us-east-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.qbhiiwuigottaqmedrha',
  password: 'oiausgrbcxaisurgcabrallawiurgxb\\aosl',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
})

const MIGRATION_FILE = join(ROOT, 'packages', 'db', 'migrations', '0001_schema_completo.sql')

async function run() {
  console.log('🔌 Conectando ao banco...')
  await client.connect()
  console.log('✅ Conectado: db.qbhiiwuigottaqmedrha.supabase.co')

  const sql = readFileSync(MIGRATION_FILE, 'utf-8')
  console.log(`📄 Lendo migration: ${MIGRATION_FILE}`)
  console.log(`   Tamanho: ${(sql.length / 1024).toFixed(1)} KB`)

  // Transaction Pooler: executa cada statement individualmente
  console.log('\n🚀 Aplicando schema por blocos (Transaction Pooler)...')

  const statements = splitStatements(sql)
  console.log(`   ${statements.length} statements encontrados\n`)

  let ok = 0, skip = 0, fail = 0
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim()
    if (!stmt || stmt.startsWith('--')) { skip++; continue }
    try {
      await client.query(stmt)
      ok++
      if (ok % 10 === 0) process.stdout.write(`   [${ok} ok]...\n`)
    } catch (e) {
      const msg = e.message.toLowerCase()
      if (
        msg.includes('already exists') ||
        msg.includes('duplicate') ||
        (msg.includes('relation') && msg.includes('already'))
      ) {
        skip++
      } else {
        fail++
        console.error(`   [ERRO #${i+1}] ${e.message.slice(0, 140)}`)
      }
    }
  }
  console.log(`\n   Resultado: ${ok} ok | ${skip} já existiam | ${fail} erros críticos`)
  if (fail > 0) {
    console.error('❌ Houve erros críticos. Verifique acima.')
    process.exit(1)
  }
  console.log('✅ Schema aplicado!')

  await client.end()
  console.log('\n🎉 Etapa 1 — schema aplicado!')
}

/**
 * Split SQL em statements individuais, respeitando blocos $$ (dollar-quoting).
 */
function splitStatements(sql) {
  const statements = []
  let current = ''
  let inDollarQuote = false
  let dollarTag = ''
  const lines = sql.split('\n')

  for (const line of lines) {
    const dollarMatch = line.match(/(\$\$|\$[a-z_]+\$)/gi)
    if (dollarMatch) {
      for (const tag of dollarMatch) {
        if (!inDollarQuote) { inDollarQuote = true; dollarTag = tag }
        else if (tag === dollarTag) { inDollarQuote = false; dollarTag = '' }
      }
    }
    current += line + '\n'
    if (!inDollarQuote && line.trim().endsWith(';')) {
      statements.push(current.trim())
      current = ''
    }
  }
  if (current.trim()) statements.push(current.trim())
  return statements
}

run().catch(err => {
  console.error('💥 Erro fatal:', err.message)
  process.exit(1)
})
