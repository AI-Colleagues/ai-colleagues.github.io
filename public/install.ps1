$ErrorActionPreference = 'Stop'

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
  Write-Host 'uv not found. Installing uv...'
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install uv. See https://docs.astral.sh/uv/getting-started/installation/ for manual install options."
    exit 1
  }
  $uvBinDir = if ($env:UV_INSTALL_DIR) {
    $env:UV_INSTALL_DIR
  }
  elseif ($env:XDG_BIN_HOME) {
    $env:XDG_BIN_HOME
  }
  elseif ($env:XDG_DATA_HOME) {
    [System.IO.Path]::GetFullPath((Join-Path $env:XDG_DATA_HOME '../bin'))
  }
  else {
    Join-Path $HOME '.local/bin'
  }
  $env:PATH = "$uvBinDir;$env:PATH"
}

uv tool install -U orcheo-sdk
uv tool install -U skill-mgr
if ($LASTEXITCODE -ne 0) {
  Write-Error @"
Failed to install orcheo-sdk.
If uv cannot write to its default storage locations, set these environment variables:
  UV_CACHE_DIR, UV_TOOL_DIR, UV_TOOL_BIN_DIR, UV_PYTHON_INSTALL_DIR
See https://docs.astral.sh/uv/reference/storage/ for details.
"@
  exit 1
}

$installArgs = @()
if ($args.Count -gt 0) {
  $installArgs = $args
}
elseif ($env:ORCHEO_INSTALL_ARGS) {
  # Note: splits on whitespace; quoted values with spaces are not supported.
  # Pass arguments directly via script args instead: .\install.ps1 arg1 arg2
  $installArgs = ($env:ORCHEO_INSTALL_ARGS -split '\s+') | Where-Object { $_ }
}

orcheo install @installArgs
