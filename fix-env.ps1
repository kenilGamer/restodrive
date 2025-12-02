# PowerShell script to help fix .env file
Write-Host "`n=== .env File Fixer ===" -ForegroundColor Cyan

$envFile = ".env"

# Check if .env exists
if (-not (Test-Path $envFile)) {
    Write-Host "`nCreating .env file..." -ForegroundColor Yellow
    New-Item -Path $envFile -ItemType File | Out-Null
}

# Read current content
$content = Get-Content $envFile -ErrorAction SilentlyContinue

# Check for DATABASE_URL
$hasDbUrl = $content | Where-Object { $_ -match '^DATABASE_URL' }

if (-not $hasDbUrl) {
    Write-Host "`n❌ DATABASE_URL not found!" -ForegroundColor Red
    Write-Host "`nAdding DATABASE_URL template..." -ForegroundColor Yellow
    
    $dbUrl = 'DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.ddwmgwqwilpfdhjkdscw.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"'
    
    Add-Content -Path $envFile -Value "`n# Database Connection (Supabase)"
    Add-Content -Path $envFile -Value $dbUrl
    
    Write-Host "✓ Added DATABASE_URL template" -ForegroundColor Green
    Write-Host "`n⚠️  IMPORTANT: Replace [YOUR-PASSWORD] with your actual Supabase password!" -ForegroundColor Yellow
} else {
    Write-Host "`n✓ DATABASE_URL found" -ForegroundColor Green
    
    # Check format
    if ($hasDbUrl -notmatch 'postgresql://|postgres://') {
        Write-Host "`n❌ ERROR: DATABASE_URL format is invalid" -ForegroundColor Red
        Write-Host "It must start with 'postgresql://' or 'postgres://'" -ForegroundColor Yellow
    } else {
        Write-Host "✓ Format looks correct" -ForegroundColor Green
        
        # Check for SSL
        if ($hasDbUrl -notmatch 'sslmode') {
            Write-Host "`n⚠️  WARNING: Missing sslmode parameter" -ForegroundColor Yellow
            Write-Host "Add ?sslmode=require to your DATABASE_URL" -ForegroundColor Yellow
        }
    }
}

# Check for NEXTAUTH_SECRET
$hasNextAuth = $content | Where-Object { $_ -match '^NEXTAUTH_SECRET' }

if (-not $hasNextAuth) {
    Write-Host "`n⚠️  NEXTAUTH_SECRET not found" -ForegroundColor Yellow
    Write-Host "Adding NEXTAUTH_SECRET template..." -ForegroundColor Yellow
    
    Add-Content -Path $envFile -Value "`n# NextAuth Configuration"
    Add-Content -Path $envFile -Value 'NEXTAUTH_URL="http://localhost:3000"'
    Add-Content -Path $envFile -Value 'NEXTAUTH_SECRET="[generate-with-openssl-rand-base64-32]"'
    
    Write-Host "✓ Added NEXTAUTH_SECRET template" -ForegroundColor Green
    Write-Host "`n⚠️  Generate a secret with: openssl rand -base64 32" -ForegroundColor Yellow
}

Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Open .env file and replace [YOUR-PASSWORD] with your Supabase password" -ForegroundColor White
Write-Host "2. Generate NEXTAUTH_SECRET: openssl rand -base64 32" -ForegroundColor White
Write-Host "3. Test connection: npx prisma db pull" -ForegroundColor White
Write-Host "4. Run migrations: npx prisma migrate dev`n" -ForegroundColor White

