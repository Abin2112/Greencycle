# GreenCycle Project Setup Script (PowerShell)

Write-Host "🌱 Setting up GreenCycle project..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend
npm install
Set-Location ..

# Install frontend dependencies  
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location frontend
npm install
Set-Location ..

Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green

# Create upload directories
Write-Host "📁 Creating upload directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "backend/uploads/devices" -Force | Out-Null
New-Item -ItemType Directory -Path "backend/uploads/documents" -Force | Out-Null

Write-Host "✅ Upload directories created!" -ForegroundColor Green

# Check environment files
Write-Host "🔧 Checking environment configuration..." -ForegroundColor Yellow

if (-not (Test-Path "backend/.env")) {
    Write-Host "❌ Backend .env file missing!" -ForegroundColor Red
    Write-Host "Please configure your environment variables in backend/.env" -ForegroundColor Yellow
} else {
    Write-Host "✅ Backend .env file found" -ForegroundColor Green
}

if (-not (Test-Path "frontend/.env")) {
    Write-Host "❌ Frontend .env file missing!" -ForegroundColor Red
    Write-Host "Please configure your environment variables in frontend/.env" -ForegroundColor Yellow
} else {
    Write-Host "✅ Frontend .env file found" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Setup complete! Next steps:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Configure your environment variables in .env files" -ForegroundColor White
Write-Host "2. Set up your PostgreSQL database (check database/schema.sql)" -ForegroundColor White
Write-Host "3. Get your Google Vision API key and add it to backend/.env" -ForegroundColor White
Write-Host "4. Start the backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "5. Start the frontend: cd frontend && npm start" -ForegroundColor White
Write-Host ""
Write-Host "📚 For more detailed setup instructions, check the README.md" -ForegroundColor Cyan