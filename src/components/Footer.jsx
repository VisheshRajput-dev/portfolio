import React, { useState, useEffect } from "react";
import { FaGithub, FaLinkedin, FaEnvelope,  FaHeart, FaCode, FaRocket, FaCoffee } from "react-icons/fa";
import { SiX } from "react-icons/si";

import { motion } from "framer-motion";

export default function Footer() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <footer className="relative bg-[rgba(0,0,0,0.75)] backdrop-blur-xl overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 max-w-6xl mx-auto px-6 ${screenWidth < 768 ? 'py-8' : 'py-12'}`}>
        {/* Top Section */}
        <div className={`text-center ${screenWidth < 768 ? 'mb-8' : 'mb-12'}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={screenWidth < 768 ? 'mb-4' : 'mb-6'}
          >
            <h2 className={`${screenWidth < 480 ? 'text-2xl' : screenWidth < 768 ? 'text-3xl' : screenWidth < 1024 ? 'text-4xl' : 'text-5xl'} font-bold mb-4`}>
              Let's Build Something
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent block leading-tight">
                Amazing Together
              </span>
            </h2>
            <p className={`${screenWidth < 480 ? 'text-base' : screenWidth < 768 ? 'text-lg' : 'text-xl'} text-gray-300 ${screenWidth < 768 ? 'max-w-lg' : 'max-w-2xl'} mx-auto leading-relaxed`}>
              Ready to turn your wildest ideas into pixel-perfect reality? 
              <span className="text-purple-300 font-semibold"> Let's make magic happen.</span>
            </p>
          </motion.div>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full ${screenWidth < 480 ? 'px-4 py-2' : 'px-6 py-3'}`}
          >
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className={`text-green-300 font-medium ${screenWidth < 480 ? 'text-sm' : 'text-base'}`}>
              {screenWidth < 480 ? 'Available' : 'Available for new projects'}
            </span>
            <FaRocket className="text-green-400 text-lg" />
          </motion.div>
        </div>

        {/* Middle Section - Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`flex justify-center items-center ${screenWidth < 768 ? 'mb-8' : 'mb-12'}`}
        >
          {/* Social Icons */}
          <div className={`flex ${screenWidth < 480 ? 'gap-4' : 'gap-8'}`}>
            {[
              { icon: FaGithub, href: "https://github.com/VisheshRajput-dev", label: "GitHub", color: "hover:text-purple-400" },
              { icon: FaLinkedin, href: "https://www.linkedin.com/in/vishesh-rajput-dev", label: "LinkedIn", color: "hover:text-blue-400" },
              { icon: SiX, href: "https://x.com/vishesh_ra3046", label: "Twitter", color: "hover:text-pink-400" },
              { icon: FaEnvelope, href: "mailto:visheshrajput.dev@gmail.com", label: "Email", color: "hover:text-orange-400" }
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className={`${screenWidth < 480 ? 'text-2xl' : 'text-3xl'} text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:drop-shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <social.icon />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="border-t border-gray-700/50 pt-8"
        >
          <div className={`flex flex-col ${screenWidth < 1024 ? 'items-center' : 'md:flex-row justify-between items-center'} gap-8`}>
            {/* Left - Brand */}
            <div className={`text-center ${screenWidth < 1024 ? '' : 'md:text-left'}`}>
              <h4 className={`${screenWidth < 480 ? 'text-xl' : 'text-2xl'} font-bold text-white mb-2`}>Vishesh Rajput</h4>
              <p className={`text-gray-400 ${screenWidth < 480 ? 'text-sm' : 'text-base'}`}>
                {screenWidth < 480 ? 'Full-Stack Developer' : 'Full-Stack Developer & Digital Craftsman'}
              </p>
            </div>

            {/* Center - Quote */}
            <div className={`text-center ${screenWidth < 768 ? 'max-w-sm' : 'max-w-md'}`}>
              <p className={`${screenWidth < 480 ? 'text-base' : 'text-lg'} text-purple-200 font-medium italic mb-2`}>
                "Code is poetry written in logic"
              </p>
              <div className={`flex items-center justify-center gap-2 text-gray-400 ${screenWidth < 480 ? 'text-xs' : 'text-sm'}`}>
                <FaCode className="text-sm" />
                <span>Made with</span>
                <FaHeart className="text-red-400 text-sm animate-pulse" />
                <span>and lots of</span>
                <FaCoffee className="text-orange-400 text-sm" />
              </div>
            </div>

            {/* Right - Copyright */}
            <div className={`text-center ${screenWidth < 1024 ? '' : 'md:text-right'}`}>
              <p className={`text-gray-400 ${screenWidth < 480 ? 'text-xs' : 'text-sm'}`}>
                © {new Date().getFullYear()} Vishesh Rajput
              </p>
              <p className={`text-gray-500 mt-1 ${screenWidth < 480 ? 'text-xs' : 'text-xs'}`}>
                {screenWidth < 480 ? 'All rights reserved' : 'All rights reserved • Built with React & Tailwind'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-orange-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]"></div>
    </footer>
  );
}
