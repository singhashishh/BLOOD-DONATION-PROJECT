import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const contactInfo = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email',
      details: 'support@life-link.com',
      value: 'support@life-link.com',
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Phone',
      details: '+1 (800) BLOOD-11',
      value: '+1 (800) 256-5311',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Address',
      details: 'Global Headquarters',
      value: '123 Life Saving Street, World City, WC 00001',
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

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
              className="text-gray-300 hover:text-white transition-colors font-semibold"
            >
              About
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-crimson-400 font-semibold"
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
        className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div variants={itemVariants} className="mb-12">
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              Get In Touch
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Info Cards */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {contactInfo.map((info, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-accent p-8 rounded-2xl border border-obsidian-700/50 hover:border-crimson-500/30 transition-colors text-center"
              >
                <div className="inline-block p-4 bg-crimson-500/10 rounded-full mb-4 text-crimson-500">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{info.title}</h3>
                <p className="text-gray-400 mb-2">{info.details}</p>
                <a href={`mailto:${info.value}`} className="text-crimson-400 hover:text-crimson-300 transition-colors font-semibold">
                  {info.value}
                </a>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="max-w-3xl mx-auto glass-accent p-8 md:p-12 rounded-2xl border border-obsidian-700/50"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white mb-8">
              Send us a Message
            </motion.h2>

            {submitted ? (
              <motion.div
                variants={itemVariants}
                className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-6 text-center"
              >
                <p className="text-emerald-400 text-lg font-semibold">
                  ✓ Message sent successfully! We'll get back to you soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-obsidian-800/50 border border-obsidian-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-crimson-500/50 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-obsidian-800/50 border border-obsidian-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-crimson-500/50 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-white font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-obsidian-800/50 border border-obsidian-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-crimson-500/50 transition-colors"
                    placeholder="What's this about?"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-white font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-obsidian-800/50 border border-obsidian-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-crimson-500/50 transition-colors resize-none"
                    placeholder="Tell us your message..."
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-crimson-600 to-crimson-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-crimson-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-obsidian-900/50 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white mb-6">
            Ready to Save Lives?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-gray-400 mb-8">
            Join thousands of donors making a real difference in your community.
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
              onClick={() => navigate('/about')}
              className="px-8 py-4 glass-accent border border-crimson-500/50 text-crimson-400 font-bold rounded-full hover:bg-crimson-500/10 transition-all"
            >
              Learn About Us
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

export default ContactPage;
