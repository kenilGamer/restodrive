# PostgreSQL Quick Setup Script (PowerShell)
# This script provides a quick way to set up databases using the automation generator

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptDir)

Write-Host "🚀 PostgreSQL Database Automation - Quick Setup" -ForegroundColor Cyan
Write-Host ""

# Check if config file exists
$ConfigPath = Join-Path $ScriptDir "config.json"
if (-not (Test-Path $ConfigPath)) {
    Write-Host "⚠️  Config file not found. Creating from template..." -ForegroundColor Yellow
    $TemplatePath = Join-Path $ScriptDir "config.template.json"
    Copy-Item $TemplatePath $ConfigPath
    Write-Host "✅ Created config.json. Please edit it with your parameters." -ForegroundColor Green
    Write-Host ""
    Write-Host "Edit the file: $ConfigPath" -ForegroundColor Blue
    exit 0
}

# Generate SQL
Write-Host "📝 Generating SQL script..." -ForegroundColor Cyan
$OutputFile = Join-Path $ScriptDir "generated_setup.sql"

# Check for tsx
$TsxCommand = Get-Command tsx -ErrorAction SilentlyContinue
if (-not $TsxCommand) {
    Write-Host "❌ Error: tsx not found. Please install:" -ForegroundColor Red
    Write-Host "   npm install -g tsx" -ForegroundColor Yellow
    Write-Host "   or" -ForegroundColor Yellow
    Write-Host "   npm install -D tsx" -ForegroundColor Yellow
    exit 1
}

& tsx (Join-Path $ScriptDir "generator.ts") --config $ConfigPath --output $OutputFile

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error generating SQL script" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ SQL script generated: $OutputFile" -ForegroundColor Green
Write-Host ""

# Ask if user wants to execute
$Execute = Read-Host "Do you want to execute this SQL script? (y/N)"
if ($Execute -eq "y" -or $Execute -eq "Y") {
    $PgUser = Read-Host "PostgreSQL admin user (default: postgres)"
    if ([string]::IsNullOrWhiteSpace($PgUser)) {
        $PgUser = "postgres"
    }
    
    $PgHost = Read-Host "PostgreSQL host (default: localhost)"
    if ([string]::IsNullOrWhiteSpace($PgHost)) {
        $PgHost = "localhost"
    }
    
    $PgPort = Read-Host "PostgreSQL port (default: 5432)"
    if ([string]::IsNullOrWhiteSpace($PgPort)) {
        $PgPort = "5432"
    }
    
    Write-Host ""
    Write-Host "⚠️  Executing SQL script..." -ForegroundColor Yellow
    
    $env:PGPASSWORD = Read-Host "Password for $PgUser" -AsSecureString | ConvertFrom-SecureString -AsPlainText
    & psql -U $PgUser -h $PgHost -p $PgPort -f $OutputFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Database setup completed successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Error executing SQL script" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "📄 SQL script saved. You can execute it manually:" -ForegroundColor Blue
    Write-Host "   psql -U postgres -f $OutputFile" -ForegroundColor Yellow
}

