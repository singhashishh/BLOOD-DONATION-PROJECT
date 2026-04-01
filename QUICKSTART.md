# LIFE-LINK: Developer Quick Start Guide

## ⚡ 10-Minute Quick Start

### Prerequisites Check
```bash
node --version  # Should be v16+
npm --version   # Should be v8+
```

### Step 1: Backend Setup (3 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Start MongoDB locally (if not running)
# Windows: Windows Search > Services > MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Start backend
npm run dev
```

✅ Backend should output:
```
╔═══════════════════════════════════════════════════════╗
║         🔴 LIFE-LINK: The Red-Cell Network 🔴        ║
║               Backend Server v1.0                      ║
╚═══════════════════════════════════════════════════════╝
✅ Server running on: http://localhost:5000
✅ WebSocket ready for real-time alerts
✅ MongoDB connected and synced
```

### Step 2: Frontend Setup (3 minutes)

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local file
copy .env.example .env.local

# Start frontend
npm run dev
```

✅ Frontend should output:
```
  VITE v5.1.0  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h + enter to show help
```

### Step 3: Test Everything (final minute)

1. **Open Browser**: Navigate to `http://localhost:3000`
2. **Check Map**: Should show dark-themed map
3. **Click SOS Button**: Should open emergency panel
4. **Select Blood Type & Urgency**: Choose from dropdowns
5. **Click Broadcast**: Should see "Alert sent to X nearby donors"
6. **Check Console**: Both frontend and backend should log events

---

## 🔧 Common Issues & Fixes

### Issue: "Cannot find module 'socket.io'"
```bash
cd backend
npm install socket.io
```

### Issue: "MongoDB connection failed"
```
# Make sure MongoDB is running:
# Windows: Check Services > MongoDB Server
# Mac: brew services list
# Linux: sudo systemctl status mongod

# Or use MongoDB Atlas cloud:
# 1. Create free tier cluster
# 2. Update MONGODB_URI in .env
```

### Issue: "CORS error" in frontend
```
✓ Backend .env:
  CORS_ORIGIN=http://localhost:3000
  SOCKET_IO_CORS_ORIGIN=http://localhost:3000

✓ Frontend .env.local:
  VITE_SOCKET_URL=http://localhost:5000
```

### Issue: "Port 3000/5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# Mac/Linux
lsof -i :5000
kill -9 [PID]
```

### Issue: "Geolocation not working"
```
✓ Browser permission: Check HTTPS or localhost
✓ Firefox: Settings > Privacy > Location
✓ Chrome: Settings > Privacy > Site Settings > Location
```

---

## 📱 Features Walkthrough

### Feature 1: Pulse Map HUD
- **What**: Interactive dark map showing donors and SOS locations
- **How to test**: 
  1. Click on map markers
  2. Should show donor name and blood type
  3. Red circles appear for SOS alerts

### Feature 2: Emergency SOS System
- **What**: 1-tap broadcast button for critical blood requests
- **How to test**:
  1. Click "🚨 EMERGENCY SOS BROADCAST"
  2. Expand details panel
  3. Select O+ blood type
  4. Select "critical" urgency
  5. Click "Broadcast Emergency Alert"
  6. See "Alert sent to X nearby donors"

### Feature 3: Live Alerts
- **What**: Real-time incoming SOS notifications
- **How to test**:
  1. Broadcast SOS from one donor
  2. Other donors see alert immediately
  3. Click "Accept" or "Decline"
  4. See confirmation

### Feature 4: Leaderboard
- **What**: Top donors ranked by donation count
- **How to test**:
  1. Scroll to "Top Heroes" section
  2. See donors ranked 1-10
  3. Badges show for high donors (Gold, Platinum, etc.)

### Feature 5: Blood Inventory
- **What**: Real-time blood stock for hospitals
- **How to test**:
  1. Look at blood type cards
  2. Progress bars show stock levels
  3. Colors indicate: Critical (red), Low (yellow), Healthy (green)

---

## 🧪 Testing API Calls

### Test Donor Registration
```bash
curl -X POST http://localhost:5000/api/donors/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Donor",
    "email": "test@example.com",
    "phone": "555-1234",
    "bloodType": "O+",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  }'
```

### Test Get All Donors
```bash
curl http://localhost:5000/api/donors
```

### Test Get Nearby Donors
```bash
curl "http://localhost:5000/api/donors/nearby?latitude=40.7128&longitude=-74.0060&radius=5"
```

### Test Create Donation Request
```bash
curl -X POST http://localhost:5000/api/donation-requests/create \
  -H "Content-Type: application/json" \
  -d '{
    "hospitalId": "hospital-1",
    "bloodType": "A+",
    "unitsNeeded": 5,
    "urgency": "critical",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "description": "Emergency surgery"
  }'
```

---

## 📊 Socket.io Events Testing

### Using Socket.io Client (Node.js)
```bash
npm install socket.io-client
```

```javascript
// test-socket.js
const io = require('socket.io-client');
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected!');
  
  // Register as donor
  socket.emit('donor:register', {
    donorId: 'test-donor-1',
    location: { latitude: 40.7128, longitude: -74.0060 }
  });
  
  // Get leaderboard
  socket.emit('leaderboard:get');
  
  // Get active SOS alerts
  socket.emit('sos:get-active');
});

socket.on('leaderboard:data', (data) => {
  console.log('Leaderboard:', data);
});

socket.on('sos:alert-incoming', (alert) => {
  console.log('New SOS Alert:', alert);
});
```

Run with: `node test-socket.js`

---

## 🎯 Next Steps After Setup

### 1. Customize Colors
- File: `frontend/tailwind.config.js`
- Change `crimson`, `obsidian`, `emerald` colors
- Rebuild: `npm run build`

### 2. Add More Blood Types
- File: `backend/src/types.ts`
- Update `BloodType` union
- Update BloodInventory interface

### 3. Add Hospital Panel
- Create `frontend/src/components/HospitalPanel.tsx`
- Add route in App.tsx
- Implement hospital-specific features

### 4. Deploy
- See [DEPLOYMENT.md](./DEPLOYMENT.md)
- Choose: Heroku, Railway, Render, or custom server

### 5. Scale Database
- Set up MongoDB Atlas (free tier to start)
- Add indexes for performance
- Enable backups

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `backend/src/server.ts` | Express + Socket.io setup |
| `backend/src/models/*.ts` | MongoDB schemas |
| `frontend/src/App.tsx` | Main dashboard |
| `frontend/src/components/MapContainer.tsx` | Interactive map |
| `frontend/src/utils/socket.ts` | Socket.io client |
| `frontend/tailwind.config.js` | Styling configuration |

---

## 🚀 Production Readiness Checklist

Before deployment:
- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster created
- [ ] HTTPS certificate obtained
- [ ] Backend passes health check
- [ ] Frontend builds without warnings
- [ ] All Socket.io events tested
- [ ] Error logging configured (Sentry)
- [ ] Rate limiting enabled
- [ ] CORS properly restricted
- [ ] Database backups scheduled

---

**Ready to launch? Let's save lives! 🚨❤️**
