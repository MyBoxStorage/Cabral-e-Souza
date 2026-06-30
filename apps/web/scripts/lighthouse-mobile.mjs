#!/usr/bin/env node
/**
 * Lighthouse mobile audit — build de produção local.
 *
 * Pré-requisito: servidor rodando em http://localhost:3000
 *   pnpm --filter web build && pnpm --filter web start:prod
 *
 * Uso:
 *   pnpm --filter web lighthouse:mobile
 *   pnpm --filter web lighthouse:mobile -- --url=http://localhost:3000/pt-BR/acervo
 */

import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))
const configPath = join(__dirname, '../lighthouse/config.json')
const config = require(configPath)

const args = process.argv.slice(2)
const singleUrlArg = args.find((a) => a.startsWith('--url='))
const outDir = join(__dirname, '../lighthouse/reports')

function localePath(path) {
  const locale = config.locale ?? 'pt-BR'
  if (path === '/') return `/${locale}`
  return `/${locale}${path}`
}

function buildUrls() {
  if (singleUrlArg) return [singleUrlArg.replace('--url=', '')]
  const base = config.baseUrl.replace(/\/$/, '')
  return (config.paths ?? ['/']).map((p) => `${base}${localePath(p)}`)
}

function slugFromUrl(url) {
  try {
    const u = new URL(url)
    return u.pathname.replace(/\//g, '_').replace(/^_/, '') || 'home'
  } catch {
    return 'page'
  }
}

async function runLighthouse(url) {
  const slug = slugFromUrl(url)
  const outputBase = join(outDir, slug)

  return new Promise((resolve, reject) => {
    const child = spawn(
      'npx',
      [
        'lighthouse',
        url,
        '--preset=perf',
        '--only-categories=performance,accessibility,best-practices,seo',
        '--form-factor=mobile',
        '--screenEmulation.mobile=true',
        '--throttling.cpuSlowdownMultiplier=4',
        '--output=html',
        '--output=json',
        `--output-path=${outputBase}`,
        '--chrome-flags=--headless --no-sandbox --disable-gpu',
        '--quiet',
      ],
      { stdio: ['ignore', 'pipe', 'pipe'], shell: true },
    )

    let stderr = ''
    child.stderr?.on('data', (d) => { stderr += d.toString() })

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Lighthouse failed for ${url}\n${stderr}`))
        return
      }
      resolve({
        url,
        reportPath: `${outputBase}.report.html`,
        jsonPath: `${outputBase}.report.json`,
      })
    })
  })
}

async function summarize(jsonPath) {
  const lhr = JSON.parse(await readFile(jsonPath, 'utf8'))
  const cats = lhr.categories ?? {}
  const cls = lhr.audits?.['cumulative-layout-shift']?.numericValue ?? null

  return {
    performance: Math.round((cats.performance?.score ?? 0) * 100),
    accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
    'best-practices': Math.round((cats['best-practices']?.score ?? 0) * 100),
    seo: Math.round((cats.seo?.score ?? 0) * 100),
    cls: cls !== null ? Number(cls.toFixed(3)) : null,
  }
}

function passThresholds(scores, thresholds) {
  const failures = []
  for (const [key, min] of Object.entries(thresholds)) {
    if (key === 'cumulative-layout-shift') {
      if (scores.cls !== null && scores.cls > min) {
        failures.push(`CLS ${scores.cls} > ${min}`)
      }
      continue
    }
    const val = scores[key]
    if (val !== undefined && val < min) {
      failures.push(`${key} ${val} < ${min}`)
    }
  }
  return failures
}

async function main() {
  await mkdir(outDir, { recursive: true })
  const urls = buildUrls()
  const thresholds = config.thresholds ?? {}
  const results = []

  console.log(`\nLighthouse mobile — ${urls.length} URL(s)\n`)

  for (const url of urls) {
    process.stdout.write(`→ ${url} ... `)
    try {
      const { jsonPath, reportPath } = await runLighthouse(url)
      const scores = await summarize(jsonPath)
      const failures = passThresholds(scores, thresholds)
      const status = failures.length === 0 ? 'PASS' : 'FAIL'
      console.log(status)
      console.log(
        `   perf=${scores.performance} a11y=${scores.accessibility} bp=${scores['best-practices']} seo=${scores.seo} cls=${scores.cls}`,
      )
      if (failures.length) console.log(`   ✗ ${failures.join(', ')}`)
      console.log(`   report: ${reportPath}`)
      results.push({ url, scores, failures, status })
    } catch (err) {
      console.log('ERROR')
      console.error(`   ${err instanceof Error ? err.message : err}`)
      results.push({ url, error: String(err), status: 'ERROR' })
    }
  }

  const summaryPath = join(outDir, 'summary.json')
  await writeFile(summaryPath, JSON.stringify({ runAt: new Date().toISOString(), results }, null, 2))
  console.log(`\nResumo: ${summaryPath}\n`)

  const anyFail = results.some((r) => r.status !== 'PASS')
  process.exit(anyFail ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
