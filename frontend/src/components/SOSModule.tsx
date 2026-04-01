import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Volume2, X } from 'lucide-react';
import { broadcastSOS } from '../utils/socket';

interface SOSModuleProps {
  donorId: string;
  userLocation: { latitude: number; longitude: number };
  onBroadcast?: (data: any) => void;
}

export const SOSModule: React.FC<SOSModuleProps> = ({ donorId, userLocation, onBroadcast }) => {
  const [isActive, setIsActive] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [bloodType, setBloodType] = useState('O+');
  const [urgency, setUrgency] = useState('critical');

  const handleEmergencyBroadcast = async () => {
    const message = `🆘 CRITICAL ${bloodType} BLOOD NEEDED - ${urgency.toUpperCase()} URGENCY`;

    broadcastSOS(donorId, userLocation, bloodType, urgency, message);

    setIsActive(true);

    onBroadcast?.({
      bloodType,
      urgency,
      timestamp: new Date(),
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => setIsActive(false), 5000);
  };

  return (
    <div className="relative w-full">
      {/* SOS Main Button */}
      <motion.button
        onClick={() => setShowDetails(!showDetails)}
        className={`w-full py-6 rounded-3xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 glass-accent hover:bg-crimson-500/20 transform hover:scale-105 ${
          isActive ? 'ring-4 ring-crimson-500 animate-pulse' : ''
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AlertCircle className="w-6 h-6 text-crimson-500" />
        <span className={isActive ? 'text-glow' : ''}>🚨 EMERGENCY SOS BROADCAST</span>
      </motion.button>

      {/* Status Indicator */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-crimson-500/10 border border-crimson-500 rounded-3xl text-center text-crimson-400 font-semibold animate-pulse"
        >
          ✅ Alert Broadcasting to Donors Within 5KM
        </motion.div>
      )}

      {/* Details Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-6 glass-accent space-y-4 rounded-3xl"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-crimson-400">Emergency Blood Request</h3>
              <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Blood Type Selector */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-emerald-400">Blood Type</label>
              <div className="grid grid-cols-4 gap-2">
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setBloodType(type)}
                    className={`py-2 rounded-lg font-bold transition-all ${
                      bloodType === type
                        ? 'bg-crimson-500 text-white'
                        : 'bg-obsidian-700 text-gray-300 hover:bg-obsidian-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency Selector */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-emerald-400">Urgency Level</label>
              <div className="grid grid-cols-2 gap-2">
                {['critical', 'high'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setUrgency(level)}
                    className={`py-2 rounded-lg font-bold transition-all capitalize ${
                      urgency === level
                        ? 'bg-crimson-500 text-white'
                        : 'bg-obsidian-700 text-gray-300 hover:bg-obsidian-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Broadcast Button */}
            <motion.button
              onClick={handleEmergencyBroadcast}
              className="w-full py-3 bg-gradient-to-r from-crimson-600 to-crimson-500 text-white font-bold rounded-3xl hover:shadow-lg hover:shadow-crimson-500/50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Volume2 className="inline w-5 h-5 mr-2" />
              Broadcast Emergency Alert
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SOSModule;
