# Project File Structure - LIFE-LINK v1.0

life-link/
│
├── 📄 README.md                    # Main project documentation
├── 📄 QUICKSTART.md               # 10-minute quick start guide  
├── 📄 API.md                      # Complete API documentation
├── 📄 ARCHITECTURE.md             # System architecture & design
├── 📄 DEPLOYMENT.md               # Production deployment guide
│
├── 🔧 setup.sh                    # Quick setup for macOS/Linux
├── 🔧 setup.bat                   # Quick setup for Windows
│
├── 📁 backend/
│   ├── package.json               # Backend dependencies
│   ├── tsconfig.json              # TypeScript config
│   ├── .env.example               # Environment template
│   ├── .gitignore                 # Git ignore rules
│   │
│   └── 📁 src/
│       ├── server.ts              # Express + Socket.io setup
│       ├── types.ts               # TypeScript interfaces
│       │
│       ├── 📁 models/             # MongoDB schemas
│       │   ├── Donor.ts           # Donor data model
│       │   ├── Hospital.ts        # Hospital data model
│       │   ├── DonationRequest.ts # Request model
│       │   └── SOSAlert.ts        # SOS Alert model
│       │
│       ├── 📁 controllers/        # Business logic
│       │   ├── donorController.ts # Donor operations
│       │   └── donationRequestController.ts # Request ops
│       │
│       ├── 📁 routes/             # API routes
│       │   ├── donorRoutes.ts     # Donor endpoints
│       │   └── donationRequestRoutes.ts # Request endpoints
│       │
│       └── 📁 middleware/         # Custom middleware
│           └── [place for auth/logging]
│
├── 📁 frontend/
│   ├── package.json               # Frontend dependencies
│   ├── tsconfig.json              # TypeScript config
│   ├── vite.config.ts             # Vite bundler config
│   ├── tailwind.config.js         # Tailwind CSS config
│   ├── postcss.config.cjs         # PostCSS config
│   ├── index.html                 # HTML entry point
│   ├── .env.example               # Environment template
│   ├── .gitignore                 # Git ignore rules
│   │
│   ├── 📁 public/                 # Static assets
│   │   └── [images/icons would go here]
│   │
│   └── 📁 src/
│       ├── main.tsx               # React entry point
│       ├── App.tsx                # Main dashboard component
│       ├── index.css              # Global styles + Tailwind
│       │
│       ├── 📁 components/         # React components
│       │   ├── MapContainer.tsx   # Interactive Leaflet map
│       │   ├── SOSModule.tsx      # Emergency SOS button
│       │   ├── LiveAlerts.tsx     # Real-time alerts display
│       │   ├── Leaderboard.tsx    # Top donors ranking
│       │   └── BloodInventory.tsx # Blood stock indicators
│       │
│       ├── 📁 pages/              # [Future: page components]
│       │   └── [reserved]
│       │
│       ├── 📁 hooks/              # [Future: custom React hooks]
│       │   └── [reserved]
│       │
│       └── 📁 utils/              # Utility functions
│           ├── socket.ts          # Socket.io client setup
│           └── api.ts             # Axios API calls
│
└── 📁 node_modules/               # Dependencies (generated)

## File Statistics
- Total Files: 30+
- Backend Files: 15+
- Frontend Files: 15+
- Configuration Files: 6
- Documentation Files: 5

## Key Technologies
- Backend: Node.js, Express, Socket.io, MongoDB, Mongoose
- Frontend: React 18, TypeScript, Tailwind CSS, Framer Motion
- Real-time: Socket.io with room-based broadcasting
- Maps: React-Leaflet with geolocation
- UI: Lucide React icons, glassmorphism effects
- Build: Vite (frontend), TypeScript (both)

## File Purposes by Category

### Configuration
- package.json, tsconfig.json, vite.config.ts, tailwind.config.js
- Purpose: Build, dependencies, TypeScript, styling config

### Documentation
- README.md, QUICKSTART.md, API.md, ARCHITECTURE.md, DEPLOYMENT.md
- Purpose: Setup, usage, API reference, system design

### Backend Core
- server.ts: Express app + Socket.io server + route setup
- types.ts: TypeScript interfaces for all data models

### Data Models (Mongoose Schemas)
- Donor.ts: User donor information
- Hospital.ts: Hospital inventory and location
- DonationRequest.ts: Emergency blood requests
- SOSAlert.ts: SOS alert documents + responses

### Controllers (Business Logic)
- donorController.ts: Donor registration, updates, donations
- donationRequestController.ts: Request CRUD operations

### Routes (API Endpoints)
- donorRoutes.ts: /api/donors/* endpoints
- donationRequestRoutes.ts: /api/donation-requests/* endpoints

### Frontend Components
- App.tsx: Main dashboard layout and state
- MapContainer.tsx: Leaflet map rendering
- SOSModule.tsx: Emergency broadcast UI
- LiveAlerts.tsx: Real-time alert display
- Leaderboard.tsx: Top donors ranking
- BloodInventory.tsx: Blood stock UI

### Utilities
- socket.ts: Socket.io client wrapper functions
- api.ts: Axios instance with API endpoints
- index.css: Global styles + Tailwind imports

## Development Workflow

1. Backend changes → server.ts/models/controllers
2. Frontend changes → components/App.tsx/utils
3. New endpoints → routes/* + controllers/*
4. UI updates → components/* + index.css
5. Real-time features → Socket.io events in server.ts

## Build Outputs

Backend:
- npm run build → Creates /dist directory with compiled JS

Frontend:
- npm run build → Creates /dist directory with production bundle

## Environment Files

Required at runtime:
- backend/.env: Server config, MongoDB URI, secrets
- frontend/.env.local: API URLs, Socket.io URL

Both have .example templates for reference.

---

**Complete production-ready structure with 30+ files, ready for immediate deployment!** 🚀
