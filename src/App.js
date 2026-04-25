import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Timeline from "./components/ExperienceTimeline";
import Projects from "./components/Projects";
import Footer from "./components/Footer"
import Resume from "./components/Resume";
import ContactDrawer from "./components/ContactDrawer"; // renamed for clarity
import SplashScreen from "./components/SplashScreen";
import SmoothScroll from "./components/ui/SmoothScroll";
import BackgroundParticles from "./components/backgroundparticles";
import Admin from "./components/admin/Admin";
import AllProjects from "./components/AllProjects";
import ProjectDetail from "./components/ProjectDetail";
import SEO from "./components/SEO";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showContact, setShowContact] = useState(false); // 👈 added

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="App relative">
        <SEO
          title="Vishesh Rajput | Founding Engineer at PointsFly | Full-Stack Developer"
          description="Portfolio of Vishesh Rajput, Founding Engineer at PointsFly, building PointsFly and AIRA across web, mobile, credit card rewards, travel intelligence, and scalable full-stack systems."
          keywords="Vishesh Rajput, Founding Engineer, Founding Engineer at PointsFly, PointsFly, PointsFly developer, building PointsFly, AIRA, Autonomous Intelligent Rewards Agent, AI rewards agent, credit card points, travel rewards, fin travel, Next.js developer, Node.js developer, Express.js developer, MongoDB developer, AWS developer, Clerk, software engineer India, software engineer Noida"
          image="/logo.png"
        />
        <BackgroundParticles />

        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/" element={
            showSplash ? (
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

                  {/* Contact Drawer only shows when Contact is clicked */}
                  {showContact && (
                    <ContactDrawer onClose={() => setShowContact(false)} />
                  )}
                  <Footer/>
                </div>
              </SmoothScroll>
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
