# Setup script for CodeToGive project
# This script sets up both backend and frontend environments

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CodeToGive - Project Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Python installation
Write-Host "Checking Python installation..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://www.python.org/" -ForegroundColor Red
    exit 1
}
Write-Host "Found: $pythonVersion" -ForegroundColor Green

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "Found: $nodeVersion" -ForegroundColor Green

Write-Host ""
Write-Host "Setting up Backend..." -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

# Setup backend
Set-Location backend

# Create virtual environment if it doesn't exist
if (-Not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create virtual environment" -ForegroundColor Red
        exit 1
    }
    Write-Host "Virtual environment created successfully" -ForegroundColor Green
} else {
    Write-Host "Virtual environment already exists" -ForegroundColor Yellow
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install Python dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "Backend dependencies installed successfully" -ForegroundColor Green

# Check for .flaskenv file
if (-Not (Test-Path ".flaskenv")) {
    Write-Host "WARNING: .flaskenv file not found" -ForegroundColor Yellow
    Write-Host "Please copy .flaskenv.example to .flaskenv and configure it" -ForegroundColor Yellow
}

Set-Location ..

Write-Host ""
Write-Host "Setting up Frontend..." -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

# Setup frontend
Set-Location frontend

# Install Node.js dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install Node.js dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "Frontend dependencies installed successfully" -ForegroundColor Green

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure .flaskenv in the backend/ directory" -ForegroundColor White
Write-Host "2. Run '.\start-dev.ps1' to start both servers" -ForegroundColor White
Write-Host "   Or run '.\start-backend.ps1' and '.\start-frontend.ps1' separately" -ForegroundColor White
Write-Host ""

