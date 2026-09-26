import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Timeline from "./ExperienceTimeline";
import Projects from "./Projects";
import Footer from "./Footer";
import Resume from "./Resume";
import ContactDrawer from "./ContactDrawer";
import SplashScreen from "./SplashScreen";
import SmoothScroll from "./ui/SmoothScroll";

// The previous home page, kept at /classic while the v3 redesign settles in.
export default function ClassicHome() {
  const [showSplash, setShowSplash] = useState(true);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <SmoothScroll>
      <div className="relative min-h-screen overflow-x-hidden text-white">
        <Navbar onContactClick={() => setShowContact(true)} />
        <Hero />
        <About />
        <Timeline />
        <Resume />
        <Projects />
        {showContact && <ContactDrawer onClose={() => setShowContact(false)} />}
        <Footer />
      </div>
    </SmoothScroll>
  );
}
