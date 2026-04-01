import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { socket, respondToSOS } from '../utils/socket';

interface SOSAlert {
  _id: string;
  message: string;
  bloodType: string;
  urgency: string;
  timestamp: Date;
  location: { latitude: number; longitude: number };
  nearbySoS: number;
}

interface LiveAlertsProps {
  donorId: string;
}

export const LiveAlerts: React.FC<LiveAlertsProps> = ({ donorId }) => {
  const [activeAlerts, setActiveAlerts] = useState<SOSAlert[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: 'accepted' | 'declined' | 'pending' }>({});

  useEffect(() => {
    socket.on('sos:alert-incoming', (alert: SOSAlert) => {
      setActiveAlerts((prev) => [alert, ...prev].slice(0, 5)); // Keep last 5 alerts
      setResponses((prev) => ({
        ...prev,
        [alert._id]: 'pending',
      }));
    });

    socket.on('sos:response-received', (data) => {
      console.log('Response recorded:', data);
    });

    socket.on('sos:active-alerts', (alerts: SOSAlert[]) => {
      setActiveAlerts(alerts);
    });

    return () => {
      socket.off('sos:alert-incoming');
      socket.off('sos:response-received');
      socket.off('sos:active-alerts');
    };
  }, []);

  const handleRespond = (alertId: string, status: 'accepted' | 'declined') => {
    respondToSOS(alertId, donorId, status);
    setResponses((prev) => ({
      ...prev,
      [alertId]: status,
    }));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'from-red-600 to-red-500';
      case 'high':
        return 'from-orange-600 to-orange-500';
      default:
        return 'from-yellow-600 to-yellow-500';
    }
  };

  return (
    <div className="w-full glass p-6 rounded-3xl max-h-96 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-6 h-6 text-crimson-500 animate-pulse" />
        <h2 className="text-2xl font-bold text-crimson-400">Live SOS Alerts</h2>
      </div>

      <AnimatePresence>
        {activeAlerts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-400">
            No active alerts right now 🙏
          </motion.div>
        ) : (
          <div className="space-y-4">
            {activeAlerts.map((alert, index) => (
              <motion.div
                key={alert._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 border-crimson-500 bg-gradient-to-r ${getUrgencyColor(alert.urgency)} bg-opacity-10 group hover:bg-opacity-20 transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-bold text-white text-lg group-hover:text-crimson-300 transition-colors">
                      {alert.message}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                      <span>📍 {alert.nearbySoS} donors notified</span>
                    </div>
                  </div>
                </div>

                {/* Response Buttons */}
                {responses[alert._id] === 'pending' ? (
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => handleRespond(alert._id, 'accepted')}
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CheckCircle className="w-4 h-4" /> Accept
                    </motion.button>
                    <motion.button
                      onClick={() => handleRespond(alert._id, 'declined')}
                      className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <XCircle className="w-4 h-4" /> Decline
                    </motion.button>
                  </div>
                ) : (
                  <div
                    className={`py-2 text-center font-bold rounded-lg ${
                      responses[alert._id] === 'accepted'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-gray-600/20 text-gray-400'
                    }`}
                  >
                    {responses[alert._id] === 'accepted' ? '✅ You Accepted' : '❌ You Declined'}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveAlerts;
