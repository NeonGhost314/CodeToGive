# Start Frontend Server
# This script starts the Angular development server

Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

Set-Location frontend

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "ERROR: Node modules not found!" -ForegroundColor Red
    Write-Host "Please run '.\setup.ps1' first to set up the project" -ForegroundColor Red
    exit 1
}

# Start Angular development server
Write-Host "Starting Angular development server on http://localhost:4200" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

ng serve -o

