# Desenvolvimento local — troubleshooting

## Servidor caiu / porta ocupada

Sintoma: `next dev` sobe na **3002** (ou outra porta) com aviso `Port 3000 is in use`, ou o Turbopack morre com `Next.js package not found` após horas rodando.

Causa usual: processos **Next.js órfãos** (`start-server.js`) de sessões anteriores ainda escutando na 3000.

### Resolver em ~30 segundos (PowerShell)

```powershell
# 1. Ver quem ocupa 3000 e 3002
netstat -ano | findstr ":3000 :3002" | findstr LISTENING

# 2. Confirmar que é Next (opcional — troque o PID)
Get-CimInstance Win32_Process -Filter "ProcessId=SEU_PID" | Select-Object ProcessId, CommandLine

# 3. Encerrar servidores Next órfãos nas portas 3000/3002
$ports = 3000, 3002
foreach ($port in $ports) {
  $line = netstat -ano | findstr ":$port " | findstr LISTENING | Select-Object -First 1
  if ($line -match '\s+(\d+)\s*$') {
    $pid = [int]$Matches[1]
    $cmd = (Get-CimInstance Win32_Process -Filter "ProcessId=$pid").CommandLine
    if ($cmd -match 'next') {
      Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
      Write-Host "Encerrado PID $pid (porta $port)"
    }
  }
}

# 4. Subir de novo na 3000
cd apps\web
pnpm run dev
```

Confirme no log: `Local: http://localhost:3000` (sem fallback de porta).

### Turbopack panic após `pnpm install`

Se o dev server estava rodando durante `pnpm install`, reinicie:

```powershell
# matar portas (comandos acima)
cd apps\web
pnpm run dev
```

Para medição Lighthouse, use sempre **build de produção** — ver [LIGHTHOUSE-GATE.md](../audit/LIGHTHOUSE-GATE.md).

### Retratos de artistas quebrados

Se fotos de artistas não carregam (erro 400 em Wikimedia), reenvie para o Supabase Storage:

```powershell
pnpm --filter @cabral-souza/db seed:artist-portraits
```

Imagens ficam em `piece-images/artist-portraits/` no bucket público.
