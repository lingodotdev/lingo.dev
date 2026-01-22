# PowerShell script for Lingo.dev Translation (Windows)

# Load API Key from .env.local if present
if (Test-Path .env.local) {
    Get-Content .env.local | ForEach-Object {
        if ($_ -match '^([^#=]+)=(.*)$') {
            $name = $matches[1]
            $value = $matches[2]
            [System.Environment]::SetEnvironmentVariable($name, $value)
        }
    }
}

Write-Host "🚀 Starting Galactic Translation via Lingo CLI (Docker)..." -ForegroundColor Cyan

# Check if Docker is running
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
}

# Run Docker Compose
# We use 'docker compose' (v2) or 'docker-compose' (v1) depending on availability
if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    docker-compose -f docker-compose.translate.yml up --build
} else {
    docker compose -f docker-compose.translate.yml up --build
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Translations complete! Check messages/ folder." -ForegroundColor Green
} else {
    Write-Error "❌ Translation process failed."
}
