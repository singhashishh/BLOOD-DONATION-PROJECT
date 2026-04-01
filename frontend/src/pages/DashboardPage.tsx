import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Icons import
import { LogOut, User, MapPin, Heart, Trophy, Droplets } from 'lucide-react';

// Context aur Components
import { useAuth } from '../context/AuthContext';
import MapComponentWithSearch, { Location } from '../components/MapComponentWithSearch';

// Placeholders (Agar files missing hain toh error nahi aayega)
const LiveAlerts = () => <div className="text-gray-400 p-4 bg-white/5 rounded-2xl">🚨 Alerts system is active. Scanning...</div>;
const Leaderboard = () => <div className="text-gray-400 p-4 bg-white/5 rounded-2xl">🏆 Global donor rankings loading...</div>;
const BloodInventory = () => <div className="text-gray-400 p-4 bg-white/5 rounded-2xl">🩸 Inventory stock status online.</div>;

const SOSModule = ({ donorId, userLocation }: any) => (
  <div className="p-8 bg-red-600/10 border border-red-500/20 rounded-[32px] text-center">
    <h2 className="text-red-500 font-black italic text-xl uppercase tracking-tighter">Emergency SOS System Active</h2>
    <p className="text-xs text-gray-500 mt-2">Broadcasting to: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</p>
  </div>
);

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  // 'as any' use karne se AuthContext ki red lines chali jayengi
  const { user, logout } = useAuth() as any;
  
  const [userLocation, setUserLocation] = useState({ latitude: 19.0760, longitude: 72.8777 });
  const [mockLocations, setMockLocations] = useState<Location[]>([]);
  const [activeTab, setActiveTab] = useState<'map' | 'alerts' | 'leaderboard' | 'inventory'>('map');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ latitude: lat, longitude: lng });
        setMockLocations([
          { id: '1', latitude: lat + 0.005, longitude: lng + 0.005, name: 'Local Donor 1', type: 'donor', bloodType: 'O+' },
          { id: '2', latitude: lat - 0.003, longitude: lng + 0.007, name: 'City Hospital', type: 'hospital' },
          { id: '3', latitude: lat + 0.002, longitude: lng - 0.002, name: 'SOS Request', type: 'sos', urgency: 'Critical' },
        ]);
      });
    }
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-4 selection:bg-red-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-center mb-10 p-8 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">Hello, {user.fullName.split(' ')[0]}! 🩸</h1>
            <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-sm">Blood Type: <span className="text-red-500">{user.bloodType}</span></p>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
             <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 px-8 py-4 bg-red-600/10 text-red-500 rounded-2xl border border-red-500/20 font-black hover:bg-red-600/20 transition uppercase italic">
               <LogOut size={20} /> Logout
             </button>
          </div>
        </motion.div>

        {/* SOS MODULE */}
        <div className="mb-12">
          <SOSModule donorId={user.id} userLocation={userLocation} />
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex gap-2 mb-8 bg-white/5 p-2 rounded-2xl overflow-x-auto no-scrollbar border border-white/5">
          {[
            { id: 'map', icon: MapPin, label: 'Live Map' },
            { id: 'alerts', icon: Heart, label: 'SOS Alerts' },
            { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
            { id: 'inventory', icon: Droplets, label: 'Inventory' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 rounded-xl font-black uppercase transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/40' : 'text-gray-500 hover:text-white'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'map' && <MapComponentWithSearch userLocation={userLocation} locations={mockLocations} />}
            {activeTab === 'alerts' && <LiveAlerts />}
            {activeTab === 'leaderboard' && <Leaderboard />}
            {activeTab === 'inventory' && <BloodInventory />}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
};

export default DashboardPage;