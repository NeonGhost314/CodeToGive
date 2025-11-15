# Start Development Environment
# This script starts both backend and frontend servers in parallel

Write-Host "Starting Development Environment..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if setup has been done
if (-Not (Test-Path "backend\venv") -Or -Not (Test-Path "frontend\node_modules")) {
    Write-Host "ERROR: Project not set up!" -ForegroundColor Red
    Write-Host "Please run '.\setup.ps1' first to set up the project" -ForegroundColor Red
    exit 1
}

Write-Host "Starting both servers..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend will run on: http://127.0.0.1:5000" -ForegroundColor Green
Write-Host "Frontend will run on: http://localhost:4200" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

# Start backend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; .\venv\Scripts\Activate.ps1; flask run"

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend in current window
Set-Location frontend
ng serve -o

