# LIFE-LINK: The Red-Cell Network v1.0

**Emergency Blood Donation Response System** - A mission-critical real-time SOS platform built with Node.js, React, Socket.io, and MongoDB.

## 🎯 Quick Start (10 Minutes)

### Prerequisites
- Node.js 16+
- MongoDB running locally or connection string ready
- Git

### Installation & Setup

#### 1️⃣ Clone & Navigate
```bash
cd life-link
```

#### 2️⃣ Setup Backend
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/life-link
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CORS_ORIGIN=http://localhost:3000
SOCKET_IO_CORS_ORIGIN=http://localhost:3000
```

Start backend:
```bash
npm run dev
```
✅ Backend running on `http://localhost:5000`

#### 3️⃣ Setup Frontend
```bash
cd ../frontend
npm install
```

Create `.env.local` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```
✅ Frontend running on `http://localhost:3000`

---

## 🚀 Features Overview

### 🗺️ Pulse Map HUD
- Dark-themed interactive map with Leaflet
- Real-time SOS alerts as pulsing red circles
- 5km radius indicator for nearby donors
- Live location tracking

### 🆘 Emergency SOS System
- **One-tap broadcast button** sends emergency alerts
- Real-time Socket.io notifications to nearby donors
- Blood type + urgency selection
- 5km proximity detection

### 🏆 Donor Leaderboard (Hero Rank)
- Gamified donor ranking system
- Badge system: Gold, Silver, Platinum, Lifesaver, FirstResponder
- Automatic badge awards based on donation count

### 📊 Live Blood Inventory
- Real-time stock updates for 8 blood types
- Color-coded stock status (Critical/Low/Healthy)
- Hospital inventory tracking

### 🎨 Glassmorphism UI
- **Colors:**
  - Primary: #ef4444 (Crimson Red)
  - Secondary: #10b981 (Emerald Green)
  - Background: Radial gradient (#1a0505 to #050505)
  - Accent: Obsidian Black (#050505)

- **Effects:**
  - 24px border-radius
  - Backdrop blur glass effect
  - Smooth 60fps Framer Motion transitions
  - Pulsing animations for critical alerts

---

## 📁 Project Structure

```
life-link/
├── backend/
│   ├── src/
│   │   ├── server.ts              # Express + Socket.io setup
│   │   ├── types.ts               # TypeScript interfaces
│   │   ├── models/
│   │   │   ├── Donor.ts
│   │   │   ├── Hospital.ts
│   │   │   ├── DonationRequest.ts
│   │   │   └── SOSAlert.ts
│   │   ├── controllers/
│   │   │   ├── donorController.ts
│   │   │   └── donationRequestController.ts
│   │   └── routes/
│   │       ├── donorRoutes.ts
│   │       └── donationRequestRoutes.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                # Main dashboard
│   │   ├── main.tsx               # Entry point
│   │   ├── index.css              # Tailwind + custom styles
│   │   ├── components/
│   │   │   ├── MapContainer.tsx   # Leaflet map
│   │   │   ├── SOSModule.tsx      # Emergency broadcast
│   │   │   ├── LiveAlerts.tsx     # Real-time alerts
│   │   │   ├── Leaderboard.tsx    # Top donors
│   │   │   └── BloodInventory.tsx # Stock indicators
│   │   └── utils/
│   │       ├── socket.ts          # Socket.io client
│   │       └── api.ts             # Axios API calls
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

---

## 🔌 API Endpoints

### Donors
- `POST /api/donors/register` - Register new donor
- `GET /api/donors` - Get all donors
- `GET /api/donors/:id` - Get specific donor
- `GET /api/donors/nearby?latitude=X&longitude=Y&radius=5` - Nearby donors
- `PUT /api/donors/:id` - Update donor profile
- `POST /api/donors/:id/record-donation` - Record donation & award badges

### Donation Requests
- `POST /api/donation-requests/create` - Create emergency request
- `GET /api/donation-requests/active` - Get active requests
- `GET /api/donation-requests/:id` - Get request details
- `PUT /api/donation-requests/:id/status` - Update status
- `DELETE /api/donation-requests/:id` - Cancel request

---

## 🔌 Socket.io Events

### Client → Server
- `donor:register` - Register donor for alerts
- `sos:broadcast` - Send emergency broadcast
- `sos:respond` - Accept/decline SOS
- `location:update` - Update real-time location
- `sos:get-active` - Fetch active alerts
- `leaderboard:get` - Fetch top donors

### Server → Client
- `sos:alert-incoming` - New SOS alert received
- `sos:response-received` - Response recorded
- `map:donor-location-update` - Live location update
- `leaderboard:data` - Top donors list
- `donor:registration-success` - Registration confirmed

---

## 📦 Key Dependencies

**Backend:**
- `express` - Web framework
- `socket.io` - Real-time communication
- `mongoose` - MongoDB ORM
- `geolib` - Geolocation calculations
- `cors` - Cross-origin handling
- `typescript` - Type safety

**Frontend:**
- `react` - UI library
- `react-leaflet` - Interactive maps
- `framer-motion` - Animations
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `socket.io-client` - Real-time connection
- `axios` - HTTP requests

---

## ⚙️ Configuration

### Environment Variables

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/life-link
JWT_SECRET=your_secret_key_production_only
CORS_ORIGIN=http://localhost:3000
SOCKET_IO_CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🧪 Testing

### Test Donor Registration
```bash
curl -X POST http://localhost:5000/api/donors/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "bloodType": "O+",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  }'
```

### Test SOS Broadcast (via Socket.io)
```javascript
socket.emit('sos:broadcast', {
  donorId: 'donor-123',
  location: { latitude: 40.7128, longitude: -74.0060 },
  bloodType: 'O+',
  urgency: 'critical',
  message: '🆘 CRITICAL O+ BLOOD NEEDED'
});
```

---

## 🔐 Security Features

✅ CORS configuration
✅ Environment variable protection
✅ MongoDB connection pooling
✅ Real-time alert validation
✅ Geolocation precision checking
✅ Socket.io authentication ready

---

## 📊 Database Schema

### Donor
```typescript
{
  name: string
  email: string (unique)
  phone: string
  bloodType: BloodType
  location: { latitude, longitude }
  isVerified: boolean
  totalDonations: number
  lastDonationDate?: Date
  badges: BadgeType[]
  createdAt: Date
  updatedAt: Date
}
```

### SOSAlert
```typescript
{
  donorId: string
  location: { latitude, longitude }
  radius: number (km)
  message: string
  recipients: string[]
  responses: Array<{
    donorId: string
    status: 'accepted' | 'declined' | 'no-response'
    respondedAt?: Date
  }>
  expiresAt: Date
  timestamps
}
```

---

## 🚦 Performance Optimizations

✅ Lazy-loaded components with Framer Motion
✅ Socket.io connection pooling
✅ Geolocation caching (5-minute intervals)
✅ Map marker clustering
✅ MongoDB indexes on location queries
✅ TTL indexes for alert expiration

---

## 🐛 Troubleshooting

**Backend won't connect to MongoDB:**
```bash
# Ensure MongoDB is running
# On Windows: Start MongoDB from Services
# On Mac: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/life-link
```

**Socket.io connection fails:**
```
Check CORS settings in backend/src/server.ts
Ensure frontend URL matches CORS_ORIGIN in .env
```

**Map not loading:**
```
Verify Leaflet CSS is imported in App.tsx
Check geolocation permission in browser
Use fallback coordinates if denied
```

---

## 📝 License

MIT - Open Source Medical Emergency System

---

## 👨‍💻 Development Team

**LIFE-LINK v1.0** - Mission-Critical Medical Technology
- Built with ❤️ for emergency blood donation response
- Production-ready in minutes
- 24/7 SOS connectivity

---

**🔴 Ready to Save Lives?** Deploy and start receiving emergency alerts! 🚨
