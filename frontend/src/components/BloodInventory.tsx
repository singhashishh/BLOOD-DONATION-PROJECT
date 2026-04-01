import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, MapPin } from 'lucide-react';
import { donationRequestAPI } from '../utils/api';

interface BloodInventory {
  [key: string]: number;
}

export const BloodInventory: React.FC = () => {
  const [inventory, setInventory] = useState<BloodInventory>({
    'O+': 15,
    'O-': 8,
    'A+': 12,
    'A-': 6,
    'B+': 10,
    'B-': 5,
    'AB+': 4,
    'AB-': 3,
  });

  const bloodTypes = Object.keys(inventory);
  const maxStock = 20;

  const getStockColor = (stock: number) => {
    if (stock <= 5) return 'from-red-600 to-red-500';
    if (stock <= 10) return 'from-yellow-600 to-yellow-500';
    return 'from-emerald-600 to-emerald-500';
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 5) return 'Critical';
    if (stock <= 10) return 'Low';
    return 'Healthy';
  };

  return (
    <div className="w-full glass p-6 rounded-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Droplet className="w-6 h-6 text-crimson-500" />
        <h2 className="text-2xl font-bold text-crimson-400">Blood Inventory</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {bloodTypes.map((type, index) => {
          const stock = inventory[type];
          const percentage = (stock / maxStock) * 100;

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-obsidian-700 p-4 rounded-xl hover:bg-obsidian-600 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white group-hover:text-crimson-400 transition-colors">{type}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-opacity-20 ${getStockColor(stock)}`}>
                  {getStockStatus(stock)}
                </span>
              </div>

              <div className="w-full bg-obsidian-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                  className={`h-full bg-gradient-to-r ${getStockColor(stock)} rounded-full`}
                />
              </div>

              <div className="mt-2 text-sm text-gray-400 text-center">
                {stock} / {maxStock} units
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-emerald-400 text-sm"
      >
        📍 Displaying nearest hospital inventory
      </motion.div>
    </div>
  );
};

export default BloodInventory;
