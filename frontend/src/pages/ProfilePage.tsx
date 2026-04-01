import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Droplets, Trophy, Award, LogOut, Edit2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const badgeIcons: { [key: string]: string } = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
  diamond: '👑',
};

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: '',
    bloodType: user?.bloodType || 'O+',
  });

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-obsidian-950 to-obsidian-900 flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-xl text-gray-400 mb-4">Please log in to view your profile</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-crimson-600 text-white font-bold rounded-lg hover:bg-crimson-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </motion.div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-obsidian-950 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">My Profile</h1>
            <div className="flex gap-3">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-crimson-500/20 text-crimson-400 rounded-lg hover:bg-crimson-500/30 transition-colors font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-crimson-500/10 border border-crimson-500/50 rounded-lg text-crimson-400"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-emerald-400"
            >
              ✓ {success}
            </motion.div>
          )}

          {/* Profile Card */}
          <div className="glass-accent rounded-3xl p-8 space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 pb-6 border-b border-obsidian-600">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-crimson-600 to-crimson-700 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
                <p className="text-emerald-400 font-semibold capitalize">{user.role}</p>
                {user.verified && (
                  <p className="text-emerald-300 text-sm flex items-center gap-1 mt-1">
                    ✓ Verified
                  </p>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-emerald-400 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-obsidian-700/50 border border-obsidian-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                ) : (
                  <p className="text-gray-300 text-lg">{user.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-gray-300">{user.email}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-obsidian-700/50 border border-obsidian-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                ) : (
                  <p className="text-gray-300">{formData.phone || 'Not provided'}</p>
                )}
              </div>

              {/* Blood Type */}
              {user.role === 'donor' && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-2">
                    <Droplets className="w-4 h-4" />
                    Blood Type
                  </label>
                  {isEditing ? (
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-obsidian-700/50 border border-obsidian-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    >
                      {bloodTypes.map((type) => (
                        <option key={type} value={type} className="bg-obsidian-700">
                          {type}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-300 text-lg font-bold">{user.bloodType}</p>
                  )}
                </div>
              )}
            </div>

            {/* Donation Stats */}
            {user.role === 'donor' && user.donationCount !== undefined && (
              <div className="pt-6 border-t border-obsidian-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-crimson-500" />
                    <span className="text-gray-400">Total Donations</span>
                  </div>
                  <span className="text-2xl font-bold text-crimson-500">{user.donationCount}</span>
                </div>
              </div>
            )}

            {/* Badges */}
            {user.role === 'donor' && user.badges && user.badges.length > 0 && (
              <div className="pt-6 border-t border-obsidian-600">
                <h3 className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
                  <Award className="w-5 h-5" />
                  Badges Earned
                </h3>
                <div className="flex flex-wrap gap-3">
                  {user.badges.map((badge) => (
                    <div
                      key={badge}
                      className="flex items-center gap-2 px-4 py-2 bg-obsidian-700/50 border border-emerald-500/30 rounded-lg hover:border-emerald-500/60 transition-colors"
                    >
                      <span className="text-2xl">{badgeIcons[badge] || '🏅'}</span>
                      <span className="text-gray-300 capitalize font-semibold">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            {isEditing && (
              <div className="flex gap-3 pt-6 border-t border-obsidian-600">
                <motion.button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </motion.button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 bg-obsidian-700 text-gray-300 font-bold rounded-lg hover:bg-obsidian-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="glass-accent rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-4">Account Information</h3>
            <div className="space-y-3 text-gray-400">
              <p>
                <span className="font-semibold">Account Type:</span> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{' '}
                <span className="text-emerald-400">{user.verified ? '✓ Verified' : 'Pending Verification'}</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
