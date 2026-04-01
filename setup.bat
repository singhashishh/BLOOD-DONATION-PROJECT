@echo off
REM LIFE-LINK Quick Setup Script for Windows PowerShell
REM This script automates the 10-minute setup

echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║         🔴 LIFE-LINK: The Red-Cell Network 🔴        ║
echo ║               Automated Setup Script                  ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Check Node.js installation
echo ⏳ Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
  echo ❌ Node.js not found. Please install from https://nodejs.org/
  exit /b 1
)
echo ✅ Node.js installed

REM Navigate to backend
echo.
echo [1/4] Setting up Backend...
cd backend
if not exist .env (
  copy .env.example .env
  echo ✅ Created .env file
)

echo ⏳ Installing backend dependencies...
call npm install >nul 2>&1
echo ✅ Backend dependencies installed

REM Navigate to frontend
cd ..
echo.
echo [2/4] Setting up Frontend...
cd frontend
if not exist .env.local (
  copy .env.example .env.local
  echo ✅ Created .env.local file
)

echo ⏳ Installing frontend dependencies...
call npm install >nul 2>&1
echo ✅ Frontend dependencies installed

cd ..
echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║              ✅ Setup Complete!                       ║
echo ╚═══════════════════════════════════════════════════════╝
echo.
echo 📋 Next Steps:
echo.
echo 1️⃣  Start MongoDB:
echo    • Windows: Open Services, find MongoDB, click Start
echo    • Mac: brew services start mongodb-community
echo    • Linux: sudo systemctl start mongod
echo.
echo 2️⃣  Start Backend (Terminal 1):
echo    cd backend
echo    npm run dev
echo.
echo 3️⃣  Start Frontend (Terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo 4️⃣  Open Browser:
echo    http://localhost:3000
echo.
echo 📚 Documentation:
echo    • README.md - Overview and features
echo    • QUICKSTART.md - Feature walkthrough
echo    • API.md - API endpoints
echo    • ARCHITECTURE.md - System design
echo    • DEPLOYMENT.md - Production deployment
echo.
echo 🚨 Ready to save lives!
echo.
