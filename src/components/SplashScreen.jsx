import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import splashAnimation from "../assets/splash.json";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Adjust timeout to match your Lottie animation duration
    const timer = setTimeout(() => setIsVisible(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Lottie Animation */}
          <Lottie
            animationData={splashAnimation}
            loop={false}
            autoplay={true}
            style={{
              width: "600px",
              height: "600px",
            }}
          />

          {/* Optional fade-in name or tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute bottom-[20%] text-center"
          >
           <h2 className="text-3xl sm:text-5xl font-semibold text-white tracking-wider">
  console.log("Hello, World!");
</h2>
<p className="text-gray-400 text-lg mt-2">
  Just another dev trying to make the web awesome ⚡
</p>


          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
