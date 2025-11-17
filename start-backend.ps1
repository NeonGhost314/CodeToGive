# Start Backend Server
# This script starts the Flask backend server

Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment exists
if (-Not (Test-Path "backend\venv")) {
    Write-Host "ERROR: Virtual environment not found!" -ForegroundColor Red
    Write-Host "Please run '.\setup.ps1' first to set up the project" -ForegroundColor Red
    exit 1
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\backend\venv\Scripts\Activate.ps1

# Check for .flaskenv
if (-Not (Test-Path "backend\.flaskenv")) {
    Write-Host "WARNING: .flaskenv file not found" -ForegroundColor Yellow
    Write-Host "Using default Flask configuration" -ForegroundColor Yellow
}

# Start Flask server using root app.py
Write-Host ""
Write-Host "Starting Flask server on http://127.0.0.1:5000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python app.py

