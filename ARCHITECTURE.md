# LIFE-LINK Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LIFE-LINK Ecosystem                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│    React Frontend        │
│  (Vite + TypeScript)     │
│                          │
│  ┌────────────────────┐  │
│  │   Map HUD          │  │
│  │   (Leaflet)        │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │   SOS Module       │  │
│  │   (Broadcasts)     │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │   Leaderboard      │  │
│  │   (Hero Rankings)  │  │
│  └────────────────────┘  │
└──────────────┬───────────┘
               │
        ┌──────┴───────────┐
        │                  │
    HTTP/REST       WebSocket
    (Axios)         (Socket.io)
        │                  │
   ┌────▼──────────────────▼───┐
   │   Node.js Backend         │
   │   (Express + Socket.io)   │
   │                           │
   │  ┌──────────────────────┐ │
   │  │ REST API Endpoints   │ │
   │  └──────────────────────┘ │
   │  ┌──────────────────────┐ │
   │  │ Socket.io Server     │ │
   │  │ (Real-time Events)   │ │
   │  └──────────────────────┘ │
   │  ┌──────────────────────┐ │
   │  │ Business Logic       │ │
   │  │ Controllers/Routes   │ │
   │  └──────────────────────┘ │
   └────┬─────────────────────┬┘
        │                     │
       TCP                   TCP
        │                     │
   ┌────▼──────────┐    ┌─────▼──────────┐
   │  MongoDB      │    │  Geolocation   │
   │  Database     │    │  Service       │
   │               │    │  (geolib)      │
   │ • Donors      │    │                │
   │ • Hospitals   │    │ • Distance     │
   │ • Requests    │    │ • Proximity    │
   │ • SOS Alerts  │    │ • Radius calc  │
   └───────────────┘    └────────────────┘
```

---

## Data Flow

### SOS Broadcast Flow
```
User Clicks SOS
      ↓
Frontend collects:
  • Blood Type
  • Urgency Level
  • Current Location
      ↓
Socket.io sends 'sos:broadcast' event
      ↓
Backend receives and:
  • Creates SOSAlert document
  • Calculates nearby donors (5km radius)
  • Broadcasts to all connected clients
      ↓
All connected donors receive 'sos:alert-incoming'
      ↓
Map updates with pulsing red circle
Notification appears in LiveAlerts component
      ↓
Donors can Accept/Decline
      ↓
Backend records response
Event emitted: 'sos:response-received'
      ↓
Dashboard updates with response count
```

### Real-time Location Tracking
```
Donor Allows Geolocation
      ↓
Frontend gets coordinates via Geolocation API
      ↓
Socket.io sends 'location:update' event
      ↓
Backend broadcasts 'map:donor-location-update'
      ↓
Other donors' maps update with live marker positions
      ↓
Used for proximity calculations for next SOS
```

---

## Socket.io Event Diagram

```
CLIENT (Frontend)              SERVER (Backend)              DATABASE
    │                              │                              │
    ├─ 'donor:register' ──────────>│                              │
    │                              ├─ Create session             │
    │                              ├─ Store socket ID            │
    │                              │- emit 'donor:registration-success'
    │<─────────────────────────────┤                              │
    │                              │                              │
    ├─ 'sos:broadcast' ──────────>│                              │
    │                              ├─ Create SOSAlert ───────────>│
    │                              ├─ Find nearby donors          │
    │                              ├─ emit 'sos:alert-incoming' to all
    │<─────────────────────────────┤                              │
    │                              │                              │
    ├─ 'sos:respond' ────────────>│                              │
    │                              ├─ Update SOSAlert ──────────>│
    │                              ├─ Record decision            │
    │                              ├─ emit 'sos:response-received'
    │<─────────────────────────────┤                              │
    │                              │                              │
    ├─ 'location:update' ───────>│                              │
    │                              ├─ emit 'map:donor-location-update'
    │<─────────────────────────────┤  to other donors             │
    │                              │                              │
    ├─ 'leaderboard:get' ───────>│                              │
    │                              ├─ Query top 10 donors ──────>│
    │                              ├─ emit 'leaderboard:data'    │
    │<─────────────────────────────┤                              │
```

---

## API Request Response Cycle

### Register Donor
```
REQUEST:
POST /api/donors/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "bloodType": "O+",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}

RESPONSE (201):
{
  "message": "Donor registered successfully",
  "donor": {
    "_id": "ObjectId",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "bloodType": "O+",
    "location": { "latitude": 40.7128, "longitude": -74.0060 },
    "isVerified": false,
    "totalDonations": 0,
    "badges": [],
    "createdAt": "2024-01-26T...",
    "updatedAt": "2024-01-26T..."
  }
}
```

### Get Nearby Donors
```
REQUEST:
GET /api/donors/nearby?latitude=40.7128&longitude=-74.0060&radius=5

RESPONSE (200):
[
  {
    "_id": "ObjectId",
    "name": "Jane Smith",
    "bloodType": "O+",
    "location": { "latitude": 40.7150, "longitude": -74.0065 },
    "totalDonations": 3,
    "badges": ["Gold"],
    "isVerified": true
  },
  {
    "_id": "ObjectId",
    "name": "Bob Johnson",
    "bloodType": "A+",
    "location": { "latitude": 40.7100, "longitude": -74.0050 },
    "totalDonations": 1,
    "badges": [],
    "isVerified": false
  }
]
```

---

## Component Hierarchy

```
App (Root)
├── Header
│   ├── Logo
│   ├── Status Indicator (Connected/Offline)
│   └── Navigation
├── Main Content
│   ├── MapDisplay
│   │   ├── TileLayer (Leaflet)
│   │   ├── Markers (Donors, Hospitals, SOS)
│   │   └── Circle (5km radius)
│   ├── Right Sidebar
│   │   ├── SOSModule
│   │   │   ├── Emergency Button
│   │   │   └── Details Panel
│   │   └── Donor ID Display
│   ├── Secondary Section
│   │   ├── LiveAlerts
│   │   │   └── Alert Cards (Accept/Decline buttons)
│   │   └── BloodInventory
│   │       └── Blood Type Progress Bars
│   └── Tertiary Section
│       ├── Leaderboard
│       │   └── Donor Rankings
│       └── Stats Card
│           └── Network Statistics
└── Footer
```

---

## Database Relationships

```
Donor (1) ────────── (*) DonationRequest
  _id                  hospitalId
  email
  name

Donor (1) ────────── (*) SOSAlert
  _id                  donorId
  totalDonations
  badges

Hospital (1) ────────── (*) DonationRequest
  _id                     hospitalId
  bloodInventory

SOSAlert (1) ────────── (*) Responses
  _id                      alertId
  donorId

DonationRequest (1) ────────── (*) Responses (implicit)
  hospitalId
  bloodType
```

---

## Scalability Considerations

### Horizontal Scaling
```
┌─────────────────────────────────────────────────┐
│              Load Balancer (Nginx)              │
└──────┬──────────────────────────────┬───────────┘
       │                              │
   ┌───▼──────┐                  ┌────▼────┐
   │ Backend  │                  │ Backend  │
   │ Instance │                  │ Instance │
   │  :5001   │                  │  :5002   │
   └───┬──────┘                  └────┬─────┘
       │                              │
       └──────────────┬───────────────┘
                      │
              ┌───────▼────────┐
              │  MongoDB Atlas │
              │   (Cluster)    │
              └────────────────┘
```

### Redis Caching Layer
```
Frontend ──> Backend Cache (Redis) ──> MongoDB
             (Location data)
             (Leaderboard)
             (Active alerts)
```

### WebSocket Connection Pooling
```
Socket.io with Adapter (Redis/MongoDB)
├── Handles client reconnections
├── Manages room-based broadcasting
└── Scales across multiple server instances
```

---

## Error Handling Strategy

```
Frontend Error
     ↓
Try-Catch Block
     ↓
┌────────────────────────┐
│ Type of Error?         │
└─┬──────────────────────┘
  │
  ├─ Network Error ──> Retry 3x with exponential backoff
  │                   Show "Connection Failed" message
  │
  ├─ Validation Error ──> Display form error
  │                       Highlight invalid fields
  │
  ├─ Authentication Error ──> Redirect to login
  │
  └─ Server Error (500) ──> Show error toast
                            Log to Sentry
                            Suggest page refresh
```

---

## Performance Metrics

### Target KPIs
```
Frontend:
- Page Load Time: < 2 seconds
- Time to Interactive: < 3 seconds
- Map Render: < 500ms
- SOS Broadcast: < 100ms

Backend:
- API Response: < 100ms (p95)
- Socket.io emit: < 50ms
- Geolocation query: < 200ms
- Database query: < 50ms

Database:
- Index lookup: < 10ms
- Aggregation: < 100ms
- Write operations: < 50ms
```

---

## Security Architecture

```
┌──────────────────────────────┐
│  HTTPS/TLS Encryption        │
└──────────────────────────────┘
         ↓
┌──────────────────────────────┐
│  CORS Policy Validation      │
└──────────────────────────────┘
         ↓
┌──────────────────────────────┐
│  Rate Limiting (DDoS)        │
└──────────────────────────────┘
         ↓
┌──────────────────────────────┐
│  Input Validation            │
└──────────────────────────────┘
         ↓
┌──────────────────────────────┐
│  Database Query Parameterization
└──────────────────────────────┘
         ↓
┌──────────────────────────────┐
│  MongoDB Auditing            │
└──────────────────────────────┘
```

---

**Architecture designed for mission-critical reliability and scalability** 🚀
