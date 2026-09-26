import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomeV3 from "./v3/HomeV3";
import SEO from "./components/SEO";

// Everything except the v3 home loads on demand, so the home page doesn't
// ship the admin, Firebase and the classic page's effects.
const ClassicHome = lazy(() => import("./components/ClassicHome"));
const Admin = lazy(() => import("./components/admin/Admin"));
const AllProjects = lazy(() => import("./components/AllProjects"));
const ProjectDetail = lazy(() => import("./components/ProjectDetail"));
const BackgroundParticles = lazy(() => import("./components/backgroundparticles"));

// The particle field belongs to the classic pages; the v3 home paints its own ground.
function LegacyBackground() {
  const { pathname } = useLocation();
  return pathname === "/" ? null : <BackgroundParticles />;
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
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/" element={<HomeV3 />} />
            <Route path="/classic" element={<ClassicHome />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
