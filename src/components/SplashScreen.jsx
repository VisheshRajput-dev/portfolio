import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoloaderVideo from "../assets/logoloader.mp4";

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    // Set timeout to match video duration (adjust as needed)
    const timer = setTimeout(() => setIsVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.75)] z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo Loader Video */}
          <video
            ref={videoRef}
            className="w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] object-contain"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
          >
            <source src={logoloaderVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
