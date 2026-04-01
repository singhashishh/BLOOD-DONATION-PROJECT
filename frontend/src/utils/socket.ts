import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

export const registerDonor = (donorId: string, location: { latitude: number; longitude: number }) => {
  socket.emit('donor:register', { donorId, location });
};

export const broadcastSOS = (
  donorId: string,
  location: { latitude: number; longitude: number },
  bloodType: string,
  urgency: string,
  message: string
) => {
  socket.emit('sos:broadcast', {
    donorId,
    location,
    bloodType,
    urgency,
    message,
    radius: 5,
  });
};

export const respondToSOS = (alertId: string, donorId: string, status: 'accepted' | 'declined') => {
  socket.emit('sos:respond', { alertId, donorId, status });
};

export const updateLocation = (location: { latitude: number; longitude: number }) => {
  socket.emit('location:update', { location });
};

export const getActiveAlerts = () => {
  socket.emit('sos:get-active');
};

export const getLeaderboard = () => {
  socket.emit('leaderboard:get');
};

export default socket;
