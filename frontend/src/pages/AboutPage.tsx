import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Heart, Target, Users, Award, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const mission = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Our Mission',
      description: 'To revolutionize blood donation by creating real-time connections between donors and those in need, eliminating delays and saving lives.',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Our Vision',
      description: 'A world where no one dies from blood shortage. Where every donation is just one tap away from someone who desperately needs it.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Our Community',
      description: 'A global network of heroes - donors, hospitals, and emergency responders - all working together to save lives 24/7.',
    },
  ];

  const values = [
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Speed First',
      description: 'Emergency blood requests are critical - every second matters. Our platform ensures instant notification and rapid response.',
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: 'Community Driven',
      description: 'We recognize and celebrate donors through badges, rankings, and leaderboards. Your contribution shapes society.',
    },
    {
      icon: <Droplets className="w-12 h-12" />,
      title: 'Trust & Transparency',
      description: 'Real-time tracking, verified donors, and hospital partnerships ensure safe and reliable blood donation.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-accent border-b border-obsidian-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplets className="w-8 h-8 text-crimson-500" />
            <span className="text-xl font-bold text-transparent bg-gradient-to-r from-crimson-400 to-crimson-600 bg-clip-text cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
              LIFE-LINK
            </span>
          </div>
          <div className="flex gap-6 items-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white transition-colors font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/about')}
              className="text-crimson-400 font-semibold"
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
          <motion.div variants={itemVariants} className="mb-12">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              About
              <br />
              <span className="text-transparent bg-gradient-to-r from-crimson-400 via-crimson-500 to-crimson-600 bg-clip-text">
                LIFE-LINK
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8">
              Connecting heroes with lives. Real-time blood donation platform changing the world.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 variants={itemVariants} className="text-5xl font-bold text-white mb-16 text-center">
            Who We Are
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {mission.map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-accent p-8 rounded-2xl border border-obsidian-700/50 hover:border-crimson-500/30 transition-colors"
              >
                <div className="text-crimson-500 mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-obsidian-900/50"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 variants={itemVariants} className="text-5xl font-bold text-white mb-16 text-center">
            Our Core Values
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {values.map((value, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="text-center"
              >
                <div className="inline-block p-4 bg-crimson-500/10 rounded-full mb-6 text-crimson-400">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 variants={itemVariants} className="text-5xl font-bold text-white mb-16 text-center">
            Our Impact
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '50K+', label: 'Active Donors', color: 'crimson' },
              { number: '1M+', label: 'Lives Saved', color: 'emerald' },
              { number: '5000+', label: 'Hospitals', color: 'blue' },
              { number: '24/7', label: 'Emergency Support', color: 'amber' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`glass-accent p-8 rounded-2xl text-center border border-obsidian-700/50`}
              >
                <p className={`text-4xl font-bold text-${stat.color}-500 mb-2`}>{stat.number}</p>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 variants={itemVariants} className="text-5xl font-bold text-white mb-8">
            Ready to Make a Difference?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-gray-400 mb-8">
            Join our community of heroes and help save lives today.
          </motion.p>
          <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-crimson-600 to-crimson-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-crimson-500/50 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 glass-accent border border-crimson-500/50 text-crimson-400 font-bold rounded-full hover:bg-crimson-500/10 transition-all"
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-obsidian-700/50">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p>&copy; 2026 LIFE-LINK. Saving lives, one donation at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
