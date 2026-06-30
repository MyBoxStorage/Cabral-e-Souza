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
 *   pnpm --filter web lighthouse:mobile -- --baseUrl=https://preview.vercel.app
 */

import * as chromeLauncher from 'chrome-launcher'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import lighthouse from 'lighthouse'
import puppeteer from 'puppeteer-core'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))
const configPath = join(__dirname, '../lighthouse/config.json')
const config = require(configPath)

const args = process.argv.slice(2)
const singleUrlArg = args.find((a) => a.startsWith('--url='))
const baseUrlArg = args.find((a) => a.startsWith('--baseUrl='))
const outDir = join(__dirname, '../lighthouse/reports')

const effectiveConfig = {
  ...config,
  baseUrl: baseUrlArg?.replace('--baseUrl=', '') ?? config.baseUrl,
}

const CONSENT_COOKIE_VALUE = encodeURIComponent(
  JSON.stringify({ analytics: false, marketing: false, decided: true }),
)

function localePath(path) {
  const locale = effectiveConfig.locale ?? 'pt-BR'
  if (path === '/') return `/${locale}`
  return `/${locale}${path}`
}

function buildUrls() {
  if (singleUrlArg) return [singleUrlArg.replace('--url=', '')]
  const base = effectiveConfig.baseUrl.replace(/\/$/, '')
  return (effectiveConfig.paths ?? ['/']).map((p) => `${base}${localePath(p)}`)
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
  const jsonPath = join(outDir, slug)

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  })

  try {
    const browser = await puppeteer.connect({
      browserURL: `http://127.0.0.1:${chrome.port}`,
    })
    const page = await browser.newPage()
    const targetHost = new URL(url).hostname
    await page.setCookie({
      name: 'cs_cookie_consent',
      value: CONSENT_COOKIE_VALUE,
      domain: targetHost,
      path: '/',
      sameSite: 'Lax',
      secure: url.startsWith('https'),
    })
    await page.close()
    browser.disconnect()

    const runnerResult = await lighthouse(url, {
      logLevel: 'error',
      output: 'json',
      port: chrome.port,
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'mobile',
      screenEmulation: { mobile: true },
      throttling: { cpuSlowdownMultiplier: 4 },
      disableStorageReset: true,
    })

    if (!runnerResult?.report) {
      throw new Error(`Lighthouse returned no report for ${url}`)
    }

    await writeFile(jsonPath, runnerResult.report)
    return { url, jsonPath }
  } finally {
    await chrome.kill()
  }
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
  const thresholds = effectiveConfig.thresholds ?? {}
  const results = []

  console.log(`\nLighthouse mobile — ${urls.length} URL(s)\n`)

  for (const url of urls) {
    process.stdout.write(`→ ${url} ... `)
    try {
      const { jsonPath } = await runLighthouse(url)
      const scores = await summarize(jsonPath)
      const failures = passThresholds(scores, thresholds)
      const status = failures.length === 0 ? 'PASS' : 'FAIL'
      console.log(status)
      console.log(
        `   perf=${scores.performance} a11y=${scores.accessibility} bp=${scores['best-practices']} seo=${scores.seo} cls=${scores.cls}`,
      )
      if (failures.length) console.log(`   ✗ ${failures.join(', ')}`)
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
