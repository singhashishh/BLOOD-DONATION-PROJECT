#!/bin/bash

# LIFE-LINK Quick Setup Script for macOS/Linux
# This script automates the 10-minute setup

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║         🔴 LIFE-LINK: The Red-Cell Network 🔴        ║"
echo "║               Automated Setup Script                  ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Check Node.js installation
echo "⏳ Checking Node.js..."
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install from https://nodejs.org/"
  exit 1
fi
echo "✅ Node.js installed: $(node --version)"

# Backend setup
echo ""
echo "[1/4] Setting up Backend..."
cd backend

if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env file"
fi

echo "⏳ Installing backend dependencies..."
npm install > /dev/null 2>&1
echo "✅ Backend dependencies installed"

# Frontend setup
cd ..
echo ""
echo "[2/4] Setting up Frontend..."
cd frontend

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "✅ Created .env.local file"
fi

echo "⏳ Installing frontend dependencies..."
npm install > /dev/null 2>&1
echo "✅ Frontend dependencies installed"

cd ..
echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║              ✅ Setup Complete!                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Start MongoDB:"
echo "    • Mac: brew services start mongodb-community"
echo "    • Linux: sudo systemctl start mongod"
echo ""
echo "2️⃣  Start Backend (Terminal 1):"
echo "    cd backend"
echo "    npm run dev"
echo ""
echo "3️⃣  Start Frontend (Terminal 2):"
echo "    cd frontend"
echo "    npm run dev"
echo ""
echo "4️⃣  Open Browser:"
echo "    http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "    • README.md - Overview and features"
echo "    • QUICKSTART.md - Feature walkthrough"
echo "    • API.md - API endpoints"
echo "    • ARCHITECTURE.md - System design"
echo "    • DEPLOYMENT.md - Production deployment"
echo ""
echo "🚨 Ready to save lives!"
echo ""
