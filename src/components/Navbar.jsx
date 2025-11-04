import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.svg";

const Navbar = ({ onContactClick }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");

  const items = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Resume", href: "#resume" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: null },
  ];

  // Detect screen width
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Real-time active section tracking based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = items
        .filter(item => item.href)
        .map(item => ({
          id: item.href,
          element: document.querySelector(item.href),
          label: item.label
        }))
        .filter(section => section.element);

      if (sections.length === 0) return;

      const scrollPosition = window.scrollY + 100; // Offset for better detection

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const rect = section.element.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection(section.label);
          break;
        }
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll + handle contact
  const handleClick = (item) => {
    if (item.label === "Contact") {
      onContactClick?.();
      setMenuOpen(false);
      return;
    }

    if (isScrolling) return;

    const section = document.querySelector(item.href);
    if (!section) {
      console.warn(`Section not found: ${item.href}`);
      return;
    }

    setIsScrolling(true);
    setActiveSection(item.label);
    setMenuOpen(false);

    // Immediate scroll without delays
    if (window.lenis) {
      window.lenis.scrollTo(section, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      section.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }

    setTimeout(() => setIsScrolling(false), 1000);
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Pill-shaped container */}
      <div className="relative mt-4">
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full" />
        
        <div className="relative flex items-center justify-center h-16 px-6">
          
          {/* Logo Section - Left */}
          <motion.div
            className="flex items-center mr-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.img
              src={logo}
              alt="Vishesh Rajput"
              className="w-10 h-10 rounded-full border-2 border-purple-400/30"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>

          {/* Desktop Navigation - Center */}
          {!isMobile && (
            <div className="flex items-center space-x-2">
              {items.map((item, index) => (
                <motion.button
                  key={item.label}
                  onClick={() => handleClick(item)}
                  className={`relative px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    activeSection === item.label
                      ? "text-black bg-white"
                      : "text-white bg-transparent hover:bg-white/10"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          )}

          {/* Right side infinity symbol - Hidden on mobile */}
          {!isMobile && (
            <motion.div
              className="ml-6 w-10 h-10 rounded-full bg-black border border-purple-400/30 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-white text-lg font-bold">∞</span>
            </motion.div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              className="ml-6 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-6 h-6 flex flex-col justify-center space-y-1"
                animate={menuOpen ? "open" : "closed"}
              >
                <motion.span
                  className="w-full h-0.5 bg-white"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 6 }
                  }}
                />
                <motion.span
                  className="w-full h-0.5 bg-white"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                />
                <motion.span
                  className="w-full h-0.5 bg-white"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -6 }
                  }}
                />
              </motion.div>
            </motion.button>
          )}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobile && menuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-black/40 backdrop-blur-xl rounded-xl mt-2 border border-white/10">
                {items.map((item, index) => (
                  <motion.button
                    key={item.label}
                    onClick={() => handleClick(item)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                      activeSection === item.label
                        ? "text-black bg-white"
                        : "text-white bg-transparent hover:bg-white/10"
                    }`}
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
