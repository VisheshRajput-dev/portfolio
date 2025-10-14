import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function ContactDrawer({ onClose }) {
  const [mode, setMode] = useState("quick");

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-end z-[999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full max-w-4xl bg-gradient-to-b from-[#1a1a2e]/90 to-[#141414]/90 border-t border-purple-400/40 backdrop-blur-lg rounded-t-3xl shadow-[0_-4px_50px_rgba(180,130,255,0.15)] px-6 py-10 text-center"
        >
          {/* Handle */}
          <div className="w-20 h-2 bg-purple-400/50 rounded-full mx-auto mb-6" />

          {/* Social Icons */}
          <div className="flex justify-center gap-8 text-2xl mb-8">
            <a
              href="https://github.com/jerry16-coder"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-400 transition-all duration-200"
            >
              <FaGithub />
            </a>
            <a
              href="https://x.com/yourhandle"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-400 transition-all duration-200"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://linkedin.com/in/vishesh-rajput"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-400 transition-all duration-200"
            >
              <FaLinkedin />
            </a>
          </div>

          {/* Toggle Options */}
          <div className="flex justify-center gap-6 mb-10">
            <button
              onClick={() => setMode("quick")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                mode === "quick"
                  ? "bg-purple-500 text-black"
                  : "bg-transparent border border-purple-400/40 text-purple-300"
              }`}
            >
              ⚡ Quick Connect
            </button>
            <button
              onClick={() => setMode("form")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                mode === "form"
                  ? "bg-purple-500 text-black"
                  : "bg-transparent border border-purple-400/40 text-purple-300"
              }`}
            >
              📝 Contact Form
            </button>
          </div>

          {/* Sections */}
          <AnimatePresence mode="wait">
            {mode === "quick" ? (
              <motion.div
                key="quick"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col md:flex-row justify-center items-center gap-8"
              >
                {/* Email */}
                <div className="bg-[#2a1b2e]/50 border border-purple-400/40 rounded-xl p-6 w-72 hover:scale-105 transition-all duration-200 shadow-[0_0_25px_rgba(180,130,255,0.2)]">
                  <FaEnvelope className="text-purple-400 text-3xl mb-3 mx-auto" />
                  <h3 className="text-lg font-semibold text-purple-300">
                    Email Me
                  </h3>
                  <a
                    href="mailto:visheshrajput.dev@gmail.com"
                    className="block mt-2 text-white/90 hover:text-purple-300 transition-all"
                  >
                    visheshrajput.dev@gmail.com
                  </a>
                </div>

                {/* Call */}
                <div className="bg-[#2a1b2e]/50 border border-purple-400/40 rounded-xl p-6 w-72 hover:scale-105 transition-all duration-200 shadow-[0_0_25px_rgba(180,130,255,0.2)]">
                  <FaPhoneAlt className="text-purple-400 text-3xl mb-3 mx-auto" />
                  <h3 className="text-lg font-semibold text-purple-300">
                    Book a Call
                  </h3>
                  <a
                    href="https://cal.com/visheshrajput"
                    target="_blank"
                    rel="noreferrer"
                    className="block mt-2 text-white/90 hover:text-purple-300 transition-all"
                  >
                    Schedule a quick chat 📅
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
                className="max-w-lg mx-auto space-y-4"
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-[#2a1b2e]/50 border border-purple-400/40 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full bg-[#2a1b2e]/50 border border-purple-400/40 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  className="w-full bg-[#2a1b2e]/50 border border-purple-400/40 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="submit"
                  className="w-full bg-purple-500 text-black font-semibold rounded-lg py-3 hover:bg-purple-400 transition-all duration-200"
                >
                  Send Message 🚀
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer Status */}
          <div className="mt-10 flex flex-col items-center">
            <motion.div
              className="flex items-center gap-2 text-green-400 text-sm font-medium"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
              <span>Currently online — open for collaborations & ideas</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
