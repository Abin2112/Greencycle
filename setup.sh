#!/bin/bash

# GreenCycle Project Setup Script

echo "🌱 Setting up GreenCycle project..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies  
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Dependencies installed successfully!"

# Create upload directories
echo "📁 Creating upload directories..."
mkdir -p backend/uploads/devices
mkdir -p backend/uploads/documents

echo "✅ Upload directories created!"

# Check environment files
echo "🔧 Checking environment configuration..."

if [ ! -f "backend/.env" ]; then
    echo "❌ Backend .env file missing!"
    echo "Please copy backend/.env.example to backend/.env and configure your environment variables"
else
    echo "✅ Backend .env file found"
fi

if [ ! -f "frontend/.env" ]; then
    echo "❌ Frontend .env file missing!"
    echo "Please copy frontend/.env.example to frontend/.env and configure your environment variables"
else
    echo "✅ Frontend .env file found"
fi

echo ""
echo "🚀 Setup complete! Next steps:"
echo ""
echo "1. Configure your environment variables in .env files"
echo "2. Set up your PostgreSQL database (check database/schema.sql)"
echo "3. Get your Google Vision API key and add it to backend/.env"
echo "4. Start the backend: cd backend && npm run dev"
echo "5. Start the frontend: cd frontend && npm start"
echo ""
echo "📚 For more detailed setup instructions, check the README.md"