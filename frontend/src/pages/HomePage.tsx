import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Heart, MapPin, Users, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Emergency SOS',
      description: 'One-tap broadcast alerts to nearby donors within 5km radius',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Live Map Tracking',
      description: 'Real-time donor and hospital locations with pulsing alerts',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Leaderboard & Badges',
      description: 'Gamified ranking with Bronze, Silver, Gold, Platinum badges',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Network',
      description: 'Connect with donors, hospitals, and emergency responders',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-accent border-b border-obsidian-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplets className="w-8 h-8 text-crimson-500" />
            <span className="text-xl font-bold text-transparent bg-gradient-to-r from-crimson-400 to-crimson-600 bg-clip-text">
              LIFE-LINK
            </span>
          </div>
          <div className="flex gap-6 items-center">
            <button
              onClick={() => navigate('/')}
              className="text-crimson-400 font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/about')}
              className="text-gray-300 hover:text-white transition-colors font-semibold"
            >
              About
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-gray-300 hover:text-white transition-colors font-semibold"
            >
              Contact
            </button>
            <div className="flex gap-4">
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors font-semibold"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-semibold"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 bg-crimson-600 text-white rounded-lg hover:bg-crimson-700 transition-colors font-semibold"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20"
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Hero */}
          <motion.div variants={itemVariants} className="mb-12">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              Save Lives
              <br />
              <span className="text-transparent bg-gradient-to-r from-crimson-400 via-crimson-500 to-crimson-600 bg-clip-text">
                In Seconds
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8">
              LIFE-LINK connects blood donors with emergency blood requests in real-time.
              <br />
              One tap. Five kilometers. One life at a time.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-crimson-600 to-crimson-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-crimson-500/50 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 glass-accent border border-emerald-500/50 text-emerald-400 font-bold rounded-full hover:bg-emerald-500/10 transition-all"
            >
              Already a Member?
            </button>
          </motion.div>

          {/* Hero Stats */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { number: '50K+', label: 'Active Donors' },
              { number: '1M+', label: 'Lives Saved' },
              { number: '24/7', label: 'Emergency Support' },
            ].map((stat, i) => (
              <div key={i} className="glass-accent p-6 rounded-2xl">
                <p className="text-4xl font-bold text-crimson-500 mb-2">{stat.number}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features Built for
              <br />
              <span className="text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text">
                Life-Saving Impact
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to become a blood donation hero
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-accent p-8 rounded-2xl hover:border-emerald-500/50 border border-obsidian-600 transition-all group hover:shadow-lg hover:shadow-emerald-500/20"
              >
                <div className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto glass-accent p-12 rounded-3xl border border-emerald-500/30 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Save Lives?</h2>
          <p className="text-lg text-gray-400 mb-8">Join thousands of heroes who are making a difference</p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-gradient-to-r from-crimson-600 to-crimson-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-crimson-500/50 transition-all"
          >
            Start Your Journey Today
          </button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-obsidian-700 py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
        <p>&copy; 2026 LIFE-LINK. All rights reserved. | Saving lives, one donation at a time.</p>
      </footer>
    </div>
  );
};

export default HomePage;
