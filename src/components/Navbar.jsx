import React, { useState, useEffect } from "react";
import GooeyNav from "./ui/GooeyNav";

const Navbar = ({ onContactClick }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const items = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Resume", href: "#resume" },
    // 👇 no href for contact; we'll trigger manually
    { label: "Contact", href: null },
  ];

  // Detect screen width
  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth < 1250 && window.innerHeight < 650) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
        setMenuOpen(false);
      }
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Auto-hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 50) {
        setShowNav(false);
      } else if (currentScroll < lastScroll) {
        setShowNav(true);
      }
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // Smooth scroll + handle contact
  const handleClick = (item) => {
    if (item.label === "Contact") {
      // 👇 open contact drawer instead of scrolling
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

    if (window.lenis) {
      window.lenis.scrollTo(section, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      section.scrollIntoView({ behavior: "smooth" });
    }

    setShowNav(false);
    setMenuOpen(false);

    setTimeout(() => setIsScrolling(false), 1500);
  };

  return (
    <>
      {/* Desktop Gooey Nav */}
      {!isMobile && (
        <div
          className={`fixed top-4 right-4 z-50 transition-transform duration-300 ${
            showNav ? "translate-y-0" : "-translate-y-[350%]"
          }`}
        >
          <GooeyNav
            items={items.map((item) => ({
              ...item,
              onClick: () => handleClick(item),
            }))}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            initialActiveIndex={0}
            animationTime={600}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
        </div>
      )}

      {/* Mobile Navbar */}
      {isMobile && (
        <div
          className={`fixed top-4 right-4 z-50 transition-transform duration-300 ${
            showNav ? "translate-y-0" : "-translate-y-[350%]"
          }`}
        >
          {/* Hamburger Icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-3xl focus:outline-none bg-gray-800/70 p-2 rounded-lg"
          >
            ☰
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
              {items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleClick(item)}
                  className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
