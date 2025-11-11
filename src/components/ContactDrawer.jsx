import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { addContactSubmission } from "../firebase/database";

export default function ContactDrawer({ onClose }) {
  const [mode, setMode] = useState("quick");
  const [showCallForm, setShowCallForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    callType: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await addContactSubmission(formData);
      if (result.success) {
        setSuccess(true);
        setFormData({ 
          name: '', 
          email: '', 
          message: '', 
          phone: '', 
          preferredDate: '', 
          preferredTime: '', 
          callType: 'general' 
        });
        // Smooth delay before closing
        setTimeout(() => {
          setSuccess(false);
          setLoading(false);
          setTimeout(() => {
            onClose();
          }, 300);
        }, 2000);
      } else {
        setError(result.error);
        setLoading(false);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end z-[999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: 0.3, 
          ease: [0.4, 0, 0.2, 1]
        }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.4, 0, 0.2, 1],
            type: "tween"
          }}
          className="relative w-full max-w-5xl bg-[rgba(0,0,0,0.95)] backdrop-blur-xl border-t border-white/10 rounded-t-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.5)] px-6 py-8 text-center overflow-y-auto max-h-[90vh]"
        >
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-sm"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg 
              className="w-4 h-4 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </motion.button>

          {/* Handle */}
          <motion.div 
            className="w-16 h-1.5 bg-white/30 rounded-full mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.1, duration: 0.2, ease: "easeOut" }}
          />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-2">
              Let's Connect
            </h2>
            <p className="text-white/70 text-lg">
              Ready to bring your ideas to life? Let's make it happen!
            </p>
          </motion.div>

          {/* Social Icons */}
          <motion.div 
            className="flex justify-center gap-6 text-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
          >
            <motion.a
              href="https://github.com/VisheshRajput-dev"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-purple-400 transition-all duration-300 hover:scale-110"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub />
            </motion.a>
            <motion.a
              href="https://x.com/vishesh_ra3046"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-pink-400 transition-all duration-300 hover:scale-110"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaXTwitter />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/vishesh-rajput-dev"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-orange-400 transition-all duration-300 hover:scale-110"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaLinkedin />
            </motion.a>
          </motion.div>

          {/* Toggle Options */}
          <motion.div 
            className="flex justify-center gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3, ease: "easeOut" }}
          >
            <motion.button
              onClick={() => setMode("quick")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                mode === "quick"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                  : "bg-white/10 border border-white/20 text-white/70 hover:bg-white/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚡ Quick Connect
            </motion.button>
            <motion.button
              onClick={() => setMode("form")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                mode === "form"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                  : "bg-white/10 border border-white/20 text-white/70 hover:bg-white/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📝 Contact Form
            </motion.button>
          </motion.div>

          {/* Sections */}
          <AnimatePresence mode="wait">
            {mode === "quick" ? (
              <motion.div
                key="quick"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="max-w-4xl mx-auto"
              >
                {!showCallForm ? (
                  <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                    {/* Email */}
                    <motion.div 
                      className="bg-white/5 border border-white/10 rounded-2xl p-8 w-80 hover:bg-white/10 transition-all duration-300 shadow-lg backdrop-blur-sm"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaEnvelope className="text-purple-400 text-4xl mb-4 mx-auto" />
                      <h3 className="text-xl font-semibold text-white mb-3">
                        Email Me
                      </h3>
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=visheshrajput.dev@gmail.com&su=Hello from Portfolio&body=Hi Vishesh, I'd like to discuss..."
                        target="_blank"
                        rel="noreferrer"
                        className="block text-white/70 hover:text-purple-300 transition-all duration-300 text-sm"
                      >
                        visheshrajput.dev@gmail.com
                      </a>
                    </motion.div>

                    {/* Call */}
                    <motion.div 
                      className="bg-white/5 border border-white/10 rounded-2xl p-8 w-80 hover:bg-white/10 transition-all duration-300 shadow-lg backdrop-blur-sm cursor-pointer"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCallForm(true)}
                    >
                      <FaPhoneAlt className="text-pink-400 text-4xl mb-4 mx-auto" />
                      <h3 className="text-xl font-semibold text-white mb-3">
                        Book a Call
                      </h3>
                      <p className="text-white/70 hover:text-pink-300 transition-all duration-300 text-sm">
                        Click to fill out call request form 📅
                      </p>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white">
                        📞 Book a Call
                      </h3>
                      <motion.button
                        onClick={() => setShowCallForm(false)}
                        className="text-white/60 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ✕
                      </motion.button>
                    </div>
                    
                    <motion.form
                      className="space-y-6"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      {success && (
                        <motion.div 
                          className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-green-300 text-center">Call request sent successfully! 🎉</p>
                        </motion.div>
                      )}
                      
                      {error && (
                        <motion.div 
                          className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-red-300 text-center">{error}</p>
                        </motion.div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.input
                          type="text"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                          required
                          whileFocus={{ scale: 1.02 }}
                        />
                        <motion.input
                          type="email"
                          name="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                          required
                          whileFocus={{ scale: 1.02 }}
                        />
                      </div>

                      <motion.input
                        type="tel"
                        name="phone"
                        placeholder="Your Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                        required
                        whileFocus={{ scale: 1.02 }}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                          required
                          whileFocus={{ scale: 1.02 }}
                        />
                        <motion.input
                          type="time"
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                          required
                          whileFocus={{ scale: 1.02 }}
                        />
                      </div>

                      <select
                        name="callType"
                        value={formData.callType}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                        required
                      >
                        <option value="general" style={{ backgroundColor: '#000000', color: '#ffffff' }}>General Discussion</option>
                        <option value="project" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Project Consultation</option>
                        <option value="collaboration" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Collaboration</option>
                        <option value="mentoring" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Mentoring Session</option>
                      </select>

                      <motion.textarea
                        name="message"
                        placeholder="Tell me about your project or what you'd like to discuss..."
                        rows="4"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 resize-none"
                        required
                        whileFocus={{ scale: 1.02 }}
                      />

                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl py-4 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 relative overflow-hidden"
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                      >
                        {loading && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ 
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                        )}
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {loading ? (
                            <>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="inline-block"
                              >
                                ⏳
                              </motion.span>
                              Sending...
                            </>
                          ) : (
                            '📞 Book My Call'
                          )}
                        </span>
                      </motion.button>
                    </motion.form>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="max-w-2xl mx-auto"
              >
                <motion.form
                  className="space-y-6"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  {success && (
                    <motion.div 
                      className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-green-300 text-center">Message sent successfully! 🎉</p>
                    </motion.div>
                  )}
                  
                  {error && (
                    <motion.div 
                      className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-red-300 text-center">{error}</p>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>

                  <motion.input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone (Optional)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                  />

                  <motion.textarea
                    name="message"
                    placeholder="Your Message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 resize-none"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl py-4 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 relative overflow-hidden"
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    {loading && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block"
                          >
                            ⏳
                          </motion.span>
                          Sending...
                        </>
                      ) : (
                        'Send Message 🚀'
                      )}
                    </span>
                  </motion.button>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Status */}
          <motion.div 
            className="mt-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <motion.div
              className="flex items-center gap-3 text-green-400 text-sm font-medium bg-white/5 rounded-full px-4 py-2 backdrop-blur-sm"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.span 
                className="w-2.5 h-2.5 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span>Currently online — open for collaborations & ideas</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
