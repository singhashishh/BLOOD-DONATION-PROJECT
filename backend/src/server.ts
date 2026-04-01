import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';
import { getDistance } from 'geolib';

import donorRoutes from './routes/donorRoutes';
import donationRequestRoutes from './routes/donationRequestRoutes';
import authRoutes from './routes/authRoutes';

import Donor from './models/Donor';
import SOSAlert from './models/SOSAlert';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.SOCKET_IO_CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/life-link');
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/donation-requests', donationRequestRoutes);

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// SOCKET.IO Real-Time Events
io.on('connection', (socket: Socket) => {
  console.log(`🔗 New connection: ${socket.id}`);

  // Donor registers online status
  socket.on('donor:register', async (data) => {
    socket.data.donorId = data.donorId;
    socket.data.location = data.location;
    console.log(`👤 Donor registered: ${data.donorId} at ${JSON.stringify(data.location)}`);
    socket.emit('donor:registration-success', { message: 'You are now registered for SOS alerts' });
  });

  // Hospital broadcasts SOS Alert (Emergency)
  socket.on('sos:broadcast', async (data) => {
    try {
      const { donorId, location, radius, bloodType, urgency, message } = data;

      console.log(`🚨 SOS Alert received from ${donorId}`);

      // Create SOS Alert in DB
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // expires in 1 hour

      const sosAlert = new SOSAlert({
        donorId,
        location,
        radius: radius || 5,
        timestamp: new Date(),
        message: message || `🆘 CRITICAL ${bloodType} BLOOD NEEDED - ${urgency} URGENCY`,
        recipients: [],
        responses: [],
        expiresAt,
      });

      await sosAlert.save();

      // Find all nearby connected donors
      const nearbyDonors: any[] = [];
      const allDonors = await Donor.find().lean();

      allDonors.forEach((donor) => {
        const distance = getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: donor.location.latitude, longitude: donor.location.longitude }
        );

        if (distance <= (radius || 5) * 1000) {
          // convert km to meters
          nearbyDonors.push(donor);
        }
      });

      // Emit to all connected sockets
      io.emit('sos:alert-incoming', {
        alertId: sosAlert._id,
        bloodType,
        urgency,
        location,
        message: sosAlert.message,
        timestamp: new Date(),
        nearbySoS: nearbyDonors.length,
      });

      console.log(`📢 SOS Alert broadcast to ${nearbyDonors.length} nearby donors`);

      socket.emit('sos:broadcast-success', {
        message: `Alert sent to ${nearbyDonors.length} nearby donors`,
        alertId: sosAlert._id,
      });
    } catch (error) {
      console.error('SOS Broadcast Error:', error);
      socket.emit('sos:error', { error: 'Failed to broadcast SOS alert' });
    }
  });

  // Donor responds to SOS
  socket.on('sos:respond', async (data) => {
    const { alertId, donorId, status } = data;

    try {
      const alert = await SOSAlert.findById(alertId);

      if (alert) {
        const existingResponse = alert.responses.find((r) => r.donorId === donorId);

        if (!existingResponse) {
          alert.responses.push({
            donorId,
            status,
            respondedAt: new Date(),
          });

          if (!alert.recipients.includes(donorId)) {
            alert.recipients.push(donorId);
          }

          await alert.save();
        }

        io.emit('sos:response-received', {
          alertId,
          donorId,
          status,
          totalResponses: alert.responses.length,
        });

        console.log(`✅ SOS Response: ${donorId} - ${status}`);
      }
    } catch (error) {
      console.error('SOS Response Error:', error);
      socket.emit('sos:error', { error: 'Failed to record response' });
    }
  });

  // Real-time Map Update
  socket.on('location:update', (data) => {
    socket.data.location = data.location;
    socket.broadcast.emit('map:donor-location-update', {
      donorId: socket.data.donorId,
      location: data.location,
      status: 'active',
    });
  });

  // Get Active SOS Alerts
  socket.on('sos:get-active', async () => {
    try {
      const activeAlerts = await SOSAlert.find({
        expiresAt: { $gt: new Date() },
      }).lean();

      socket.emit('sos:active-alerts', activeAlerts);
    } catch (error) {
      socket.emit('sos:error', { error: 'Failed to fetch active alerts' });
    }
  });

  // Get Leaderboard (Top Donors)
  socket.on('leaderboard:get', async () => {
    try {
      const topDonors = await Donor.find()
        .sort({ totalDonations: -1 })
        .limit(10)
        .lean();

      socket.emit('leaderboard:data', topDonors);
    } catch (error) {
      socket.emit('leaderboard:error', { error: 'Failed to fetch leaderboard' });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 Disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║         🔴 LIFE-LINK: The Red-Cell Network 🔴        ║
║               Backend Server v1.0                      ║
║      Emergency SOS Blood Donation System              ║
╚═══════════════════════════════════════════════════════╝

✅ Server running on: http://localhost:${PORT}
✅ WebSocket ready for real-time alerts
✅ MongoDB connected and synced
    `);
  });
};

startServer().catch((error) => {
  console.error('Server startup error:', error);
  process.exit(1);
});

export default server;
