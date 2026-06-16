# =============================================================================
# setup-database.ps1 — Etapa 1: Aplica schema, buckets e seed no Supabase
# Uso: .\scripts\setup-database.ps1
# Pré-requisito: apps/web/.env.local preenchido com NEXT_PUBLIC_SUPABASE_URL
#                e SUPABASE_SERVICE_ROLE_KEY
# =============================================================================
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

# --- Lê .env.local ---
$envFile = Join-Path $root "apps\web\.env.local"
if (-not (Test-Path $envFile)) {
    Write-Error "apps/web/.env.local não encontrado."
}

$envVars = @{}
Get-Content $envFile | Where-Object { $_ -match '^\s*([^#][^=]+)=(.*)$' } | ForEach-Object {
    $key   = $Matches[1].Trim()
    $value = $Matches[2].Trim()
    if ($value -ne '') { $envVars[$key] = $value }
}

$supabaseUrl     = $envVars['NEXT_PUBLIC_SUPABASE_URL']
$serviceRoleKey  = $envVars['SUPABASE_SERVICE_ROLE_KEY']

if (-not $supabaseUrl -or -not $serviceRoleKey) {
    Write-Host ""
    Write-Host "ERRO: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY vazio em apps/web/.env.local" -ForegroundColor Red
    Write-Host ""
    Write-Host "Preencha o arquivo apps/web/.env.local e rode novamente." -ForegroundColor Yellow
    exit 1
}

# Extrai project-ref da URL (ex: https://abcdefgh.supabase.co → abcdefgh)
$projectRef = ([System.Uri]$supabaseUrl).Host.Split('.')[0]
Write-Host ""
Write-Host "Project ref: $projectRef" -ForegroundColor Cyan

# --- Verifica supabase CLI ---
$supabaseBin = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabaseBin) {
    Write-Error "supabase CLI não encontrado. Rode: npm install -g supabase"
}

# --- Login (abre browser se não estiver logado) ---
Write-Host ""
Write-Host "Verificando login no Supabase CLI..." -ForegroundColor Cyan
supabase projects list 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Abrindo login no browser..." -ForegroundColor Yellow
    supabase login
}

# --- Link ao projeto ---
Write-Host ""
Write-Host "Linkando ao projeto $projectRef..." -ForegroundColor Cyan
Push-Location $root
supabase link --project-ref $projectRef
if ($LASTEXITCODE -ne 0) { Write-Error "Falha ao linkar projeto." }

# --- Aplica migration ---
$migrationFile = Join-Path $root "packages\db\migrations\0001_schema_completo.sql"
Write-Host ""
Write-Host "Aplicando migration..." -ForegroundColor Cyan
supabase db execute --file $migrationFile
if ($LASTEXITCODE -ne 0) { Write-Error "Falha ao aplicar migration." }

Write-Host "Migration aplicada com sucesso." -ForegroundColor Green

# --- Gera tipos TypeScript ---
Write-Host ""
Write-Host "Gerando tipos TypeScript..." -ForegroundColor Cyan
$typesFile = Join-Path $root "packages\db\src\types.ts"
supabase gen types typescript --linked | Set-Content -Path $typesFile -Encoding UTF8
if ($LASTEXITCODE -ne 0) { Write-Error "Falha ao gerar tipos." }

Write-Host "Tipos gerados em packages/db/src/types.ts" -ForegroundColor Green

Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " Etapa 1 concluída com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. Verifique as tabelas no Supabase Studio"
Write-Host "  2. Confirme os 5 artistas-âncora em: Table Editor → artists"
Write-Host "  3. Rode: pnpm --filter=web build  (para validar os tipos gerados)"
Write-Host ""
