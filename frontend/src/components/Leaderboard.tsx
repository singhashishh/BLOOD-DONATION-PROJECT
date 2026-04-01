import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Star } from 'lucide-react';
import { socket } from '../utils/socket';

interface Donor {
  _id: string;
  name: string;
  totalDonations: number;
  badges: string[];
  bloodType: string;
}

interface LeaderboardProps {
  limit?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ limit = 10 }) => {
  const [topDonors, setTopDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.emit('leaderboard:get');

    socket.on('leaderboard:data', (data: Donor[]) => {
      setTopDonors(data.slice(0, limit));
      setLoading(false);
    });

    return () => {
      socket.off('leaderboard:data');
    };
  }, [limit]);

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Platinum':
        return '💎';
      case 'Gold':
        return '🥇';
      case 'Silver':
        return '🥈';
      case 'Lifesaver':
        return '💚';
      case 'FirstResponder':
        return '⚡';
      default:
        return '⭐';
    }
  };

  return (
    <div className="w-full glass p-6 rounded-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Award className="w-6 h-6 text-crimson-500" />
        <h2 className="text-2xl font-bold text-crimson-400">Top Heroes</h2>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading leaderboard...</div>
      ) : (
        <div className="space-y-3">
          {topDonors.map((donor, index) => (
            <motion.div
              key={donor._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-obsidian-700 hover:bg-obsidian-600 p-4 rounded-xl flex items-center justify-between transition-all group hover:translate-x-1"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-crimson-500 to-crimson-600 rounded-full font-bold text-white">
                  #{index + 1}
                </div>

                <div className="flex-1">
                  <p className="font-bold text-white group-hover:text-crimson-400 transition-colors">{donor.name}</p>
                  <p className="text-xs text-gray-400">🩸 {donor.bloodType}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-400">{donor.totalDonations}</p>
                  <p className="text-xs text-gray-400">donations</p>
                </div>

                <div className="flex gap-1">
                  {donor.badges.slice(0, 3).map((badge, i) => (
                    <span key={i} className="text-lg animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                      {getBadgeIcon(badge)}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
