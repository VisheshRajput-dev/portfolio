import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Timeline from "./components/ExperienceTimeline";
import Projects from "./components/Projects";
import Footer from "./components/Footer"
import Resume from "./components/Resume";
import Game from "./components/Game";
import ContactDrawer from "./components/ContactDrawer"; // renamed for clarity
import SplashScreen from "./components/SplashScreen";
import SmoothScroll from "./components/ui/SmoothScroll";
import BackgroundParticles from "./components/backgroundparticles";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showContact, setShowContact] = useState(false); // 👈 added

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App relative">
      <BackgroundParticles />

      {showSplash ? (
        <SplashScreen />
      ) : (
        <SmoothScroll>
          <div className="relative min-h-screen overflow-x-hidden text-white">
            {/* Pass handler to Navbar */}
            <Navbar onContactClick={() => setShowContact(true)} />

            <Hero />
            <About />
            <Timeline />
            <Resume />
            <Projects />
            {/* <Game /> */}

            {/* Contact Drawer — only shows when Contact clicked */}
            {showContact && (
              <ContactDrawer onClose={() => setShowContact(false)} />
            )}
            <Footer/>
          </div>
        </SmoothScroll>
      )}
    </div>
  );
}

export default App;
