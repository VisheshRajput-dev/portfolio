import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomeV3 from "./v3/HomeV3";
import SEO from "./components/SEO";

// Everything except the v3 home loads on demand, so the home page doesn't
// ship the admin, Firebase and the classic page's effects.
const ClassicHome = lazy(() => import("./components/ClassicHome"));
const Admin = lazy(() => import("./components/admin/Admin"));
const AllProjects = lazy(() => import("./components/AllProjects"));
const CaseStudy = lazy(() => import("./v3/pages/CaseStudy"));
const BackgroundParticles = lazy(() => import("./components/backgroundparticles"));
const Concept = lazy(() => import("./concept/Concept"));

// The particle field belongs to the classic pages; v3 pages paint their own ground.
function LegacyBackground() {
  const { pathname } = useLocation();
  const own = pathname === "/" || pathname === "/concept" || pathname.startsWith("/project/");
  return own ? null : <BackgroundParticles />;
}

function App() {
  return (
    <Router>
      <div className="App relative">
        <SEO
          title="Vishesh Rajput | Founding Engineer at PointsFly | Full-Stack Developer"
          description="Portfolio of Vishesh Rajput, Founding Engineer at PointsFly, building PointsFly and AIRA across web, mobile, credit card rewards, travel intelligence, and scalable full-stack systems."
          keywords="Vishesh Rajput, Founding Engineer, Founding Engineer at PointsFly, PointsFly, PointsFly developer, building PointsFly, AIRA, Autonomous Intelligent Rewards Agent, AI rewards agent, credit card points, travel rewards, fin travel, Next.js developer, Node.js developer, Express.js developer, MongoDB developer, AWS developer, Clerk, software engineer India, software engineer Noida"
          image="/logo.png"
        />
        <Suspense fallback={null}>
          <LegacyBackground />
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/project/:id" element={<CaseStudy />} />
            <Route path="/" element={<HomeV3 />} />
            <Route path="/classic" element={<ClassicHome />} />
            <Route path="/concept" element={<Concept />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
