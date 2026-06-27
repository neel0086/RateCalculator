param(
  [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $ProjectRoot

function Remove-ProjectFolder {
  param([string]$RelativePath)

  $target = Join-Path $ProjectRoot $RelativePath
  if (-not (Test-Path $target)) {
    return
  }

  $resolved = (Resolve-Path $target).Path
  if (-not $resolved.StartsWith($ProjectRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to delete path outside project: $resolved"
  }

  Write-Host "Removing old $RelativePath folder..."
  Remove-Item -LiteralPath $resolved -Recurse -Force
}

function Invoke-Checked {
  param(
    [string]$Command,
    [string[]]$Arguments
  )

  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed: $Command $($Arguments -join ' ')"
  }
}

Write-Host "Smart Rate Calculator production installer build"
Write-Host "Project: $ProjectRoot"

if (-not $SkipInstall -and -not (Test-Path (Join-Path $ProjectRoot "node_modules"))) {
  Write-Host "node_modules not found. Installing dependencies with npm ci..."
  Invoke-Checked "npm" @("ci")
}

Remove-ProjectFolder "build"
Remove-ProjectFolder "dist"

$env:CI = "false"

Write-Host "Creating optimized React production build..."
Invoke-Checked "npm" @("run", "react-build")

Write-Host "Creating Windows installer..."
Invoke-Checked "npm" @("run", "electron-build", "--", "--win")

$distPath = Join-Path $ProjectRoot "dist"
if (-not (Test-Path $distPath)) {
  throw "Build finished but dist folder was not created."
}

$installer = Get-ChildItem -Path $distPath -Filter "*.exe" |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1

if (-not $installer) {
  throw "Build finished but no installer .exe was found in dist."
}

Write-Host ""
Write-Host "Done."
Write-Host "Share this installer:"
Write-Host $installer.FullName
Write-Host ""
Write-Host "Users can double-click it to install. Running a newer installer over an older install updates the app and keeps existing app/user data."
