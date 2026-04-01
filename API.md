# LIFE-LINK: API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

---

## 👥 Donor Endpoints

### Register Donor
```
POST /donors/register
Content-Type: application/json

Request Body:
{
  "name": string (required),
  "email": string (required, unique),
  "phone": string (required),
  "bloodType": "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" (required),
  "location": {
    "latitude": number (required),
    "longitude": number (required)
  }
}

Response (201):
{
  "message": "Donor registered successfully",
  "donor": {
    "_id": string,
    "name": string,
    "email": string,
    "phone": string,
    "bloodType": string,
    "location": { latitude: number, longitude: number },
    "isVerified": boolean,
    "totalDonations": number,
    "badges": string[],
    "createdAt": ISO8601,
    "updatedAt": ISO8601
  }
}

Error (400):
{ "error": "Donor already exists" | "Invalid input" }
```

### Get All Donors
```
GET /donors

Response (200):
[
  {
    "_id": string,
    "name": string,
    "email": string,
    "phone": string,
    "bloodType": string,
    "location": { latitude: number, longitude: number },
    "isVerified": boolean,
    "totalDonations": number,
    "lastDonationDate": ISO8601 | null,
    "badges": string[]
  }
]

Error (500):
{ "error": "Failed to fetch donors" }
```

### Get Donor by ID
```
GET /donors/:id

Response (200):
{
  "_id": string,
  "name": string,
  "email": string,
  "phone": string,
  "bloodType": string,
  "location": { latitude: number, longitude: number },
  "isVerified": boolean,
  "totalDonations": number,
  "lastDonationDate": ISO8601 | null,
  "badges": string[],
  "createdAt": ISO8601,
  "updatedAt": ISO8601
}

Error (404):
{ "error": "Donor not found" }
```

### Get Donors Near Location
```
GET /donors/nearby
Query Parameters:
  - latitude: number (required)
  - longitude: number (required)
  - radius: number (optional, default: 5, in km)

Example:
GET /donors/nearby?latitude=40.7128&longitude=-74.0060&radius=5

Response (200):
[
  {
    "_id": string,
    "name": string,
    "location": { latitude: number, longitude: number },
    "bloodType": string,
    "totalDonations": number,
    "badges": string[]
  }
]

Error (400):
{ "error": "Latitude and longitude required" }
```

### Update Donor
```
PUT /donors/:id
Content-Type: application/json

Request Body (partially update):
{
  "name": string (optional),
  "phone": string (optional),
  "location": { latitude: number, longitude: number } (optional),
  "isVerified": boolean (optional)
}

Response (200):
{
  "message": "Donor updated successfully",
  "donor": { /* updated donor object */ }
}

Error (404):
{ "error": "Donor not found" }
```

### Record Donation
```
POST /donors/:id/record-donation

Response (200):
{
  "message": "Donation recorded successfully",
  "donor": {
    "_id": string,
    "name": string,
    "totalDonations": number (incremented),
    "lastDonationDate": ISO8601 (current time),
    "badges": string[] (updated with new badges if earned)
  }
}

Error (404):
{ "error": "Donor not found" }

Rules:
- totalDonations incremented by 1
- lastDonationDate set to current time
- Badges awarded:
  * 1 donation: "Lifesaver"
  * 3 donations: "Silver"
  * 5 donations: "Gold"
  * 10 donations: "Platinum"
```

---

## 🩸 Donation Request Endpoints

### Create Donation Request
```
POST /donation-requests/create
Content-Type: application/json

Request Body:
{
  "hospitalId": string (required),
  "bloodType": "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" (required),
  "unitsNeeded": number (required, min: 1),
  "urgency": "critical" | "high" | "medium" | "low" (required),
  "location": {
    "latitude": number (required),
    "longitude": number (required)
  },
  "description": string (required)
}

Response (201):
{
  "message": "Donation request created successfully",
  "donationRequest": {
    "_id": string,
    "hospitalId": string,
    "bloodType": string,
    "unitsNeeded": number,
    "urgency": string,
    "location": { latitude: number, longitude: number },
    "description": string,
    "status": "active",
    "expiresAt": ISO8601,
    "createdAt": ISO8601,
    "updatedAt": ISO8601
  }
}

Note:
- Automatically expires in 24 hours
- Immediately broadcast via Socket.io
```

### Get Active Donation Requests
```
GET /donation-requests/active

Response (200):
[
  {
    "_id": string,
    "hospitalId": string,
    "bloodType": string,
    "unitsNeeded": number,
    "urgency": string,
    "location": { latitude: number, longitude: number },
    "description": string,
    "status": "active",
    "createdAt": ISO8601
  }
]

Returns only requests where status = "active"
```

### Get Donation Request by ID
```
GET /donation-requests/:id

Response (200):
{
  "_id": string,
  "hospitalId": string,
  "bloodType": string,
  "unitsNeeded": number,
  "urgency": string,
  "location": { latitude: number, longitude: number },
  "description": string,
  "status": string,
  "expiresAt": ISO8601,
  "createdAt": ISO8601,
  "updatedAt": ISO8601
}

Error (404):
{ "error": "Donation request not found" }
```

### Update Donation Request Status
```
PUT /donation-requests/:id/status
Content-Type: application/json

Request Body:
{
  "status": "active" | "fulfilled" | "cancelled" (required)
}

Response (200):
{
  "message": "Donation request updated successfully",
  "donationRequest": { /* updated request object */ }
}

Error (400):
{ "error": "Invalid status" }

Error (404):
{ "error": "Donation request not found" }
```

### Delete Donation Request
```
DELETE /donation-requests/:id

Response (200):
{ "message": "Donation request deleted successfully" }

Error (404):
{ "error": "Donation request not found" }
```

---

## 🌐 Health Check

### Health Status
```
GET /health

Response (200):
{
  "status": "healthy",
  "timestamp": "2024-01-26T10:30:00.000Z",
  "environment": "development" | "production"
}
```

---

## 🔌 Socket.io Events

### Client → Server Events

#### Donor Registration
```javascript
socket.emit('donor:register', {
  donorId: string,
  location: {
    latitude: number,
    longitude: number
  }
});
```

#### Broadcast SOS Alert
```javascript
socket.emit('sos:broadcast', {
  donorId: string,
  location: { latitude: number, longitude: number },
  bloodType: "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-",
  urgency: "critical" | "high" | "medium" | "low",
  message: string,
  radius: number (optional, km)
});
```

#### Respond to SOS
```javascript
socket.emit('sos:respond', {
  alertId: string,
  donorId: string,
  status: "accepted" | "declined"
});
```

#### Update Location (Real-time)
```javascript
socket.emit('location:update', {
  location: { latitude: number, longitude: number }
});
```

#### Get Active SOS Alerts
```javascript
socket.emit('sos:get-active');
```

#### Get Leaderboard
```javascript
socket.emit('leaderboard:get');
```

---

### Server → Client Events

#### Donor Registration Success
```javascript
socket.on('donor:registration-success', (data) => {
  // { message: "You are now registered for SOS alerts" }
});
```

#### Incoming SOS Alert
```javascript
socket.on('sos:alert-incoming', (alert) => {
  // {
  //   alertId: string,
  //   bloodType: string,
  //   urgency: string,
  //   location: { latitude, longitude },
  //   message: string,
  //   timestamp: ISO8601,
  //   nearbySoS: number (count of donors notified)
  // }
});
```

#### SOS Response Received (Broadcast to All)
```javascript
socket.on('sos:response-received', (data) => {
  // {
  //   alertId: string,
  //   donorId: string,
  //   status: "accepted" | "declined",
  //   totalResponses: number
  // }
});
```

#### SOS Broadcast Success
```javascript
socket.on('sos:broadcast-success', (data) => {
  // {
  //   message: "Alert sent to X nearby donors",
  //   alertId: string
  // }
});
```

#### Map Location Update (Broadcast to All)
```javascript
socket.on('map:donor-location-update', (data) => {
  // {
  //   donorId: string,
  //   location: { latitude: number, longitude: number },
  //   status: "active"
  // }
});
```

#### Active SOS Alerts List
```javascript
socket.on('sos:active-alerts', (alerts) => {
  // Array of active SOSAlert documents
});
```

#### Leaderboard Data
```javascript
socket.on('leaderboard:data', (donors) => {
  // [
  //   {
  //     _id: string,
  //     name: string,
  //     totalDonations: number,
  //     badges: string[],
  //     bloodType: string
  //   }
  // ]
});
```

#### Error
```javascript
socket.on('error', (data) => {
  // { error: "Error message" }
});

socket.on('sos:error', (data) => {
  // { error: "SOS-specific error" }
});
```

---

## 📊 Data Models

### Donor Schema
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  phone: string,
  bloodType: string,
  location: {
    latitude: number,
    longitude: number
  },
  isVerified: boolean,
  totalDonations: number,
  lastDonationDate: Date | null,
  badges: string[],
  createdAt: Date,
  updatedAt: Date
}
```

### Hospital Schema
```typescript
{
  _id: ObjectId,
  name: string,
  location: {
    latitude: number,
    longitude: number
  },
  email: string (unique),
  phone: string,
  bloodInventory: {
    "O+": number,
    "O-": number,
    "A+": number,
    "A-": number,
    "B+": number,
    "B-": number,
    "AB+": number,
    "AB-": number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### DonationRequest Schema
```typescript
{
  _id: ObjectId,
  hospitalId: string,
  bloodType: string,
  unitsNeeded: number,
  urgency: "critical" | "high" | "medium" | "low",
  location: {
    latitude: number,
    longitude: number
  },
  description: string,
  status: "active" | "fulfilled" | "cancelled",
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### SOSAlert Schema
```typescript
{
  _id: ObjectId,
  donorId: string,
  location: {
    latitude: number,
    longitude: number
  },
  radius: number (km),
  timestamp: Date,
  message: string,
  recipients: string[],
  responses: [
    {
      donorId: string,
      status: "accepted" | "declined" | "no-response",
      respondedAt: Date | null
    }
  ],
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

**API Documentation v1.0 - LIFE-LINK Emergency Blood Donation System** 🚨❤️
