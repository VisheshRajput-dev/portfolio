import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeV3 from "./v3/HomeV3";

// Everything except the home loads on demand, so the home page doesn't
// ship the admin or Firebase.
const Admin = lazy(() => import("./components/admin/Admin"));
const CaseStudy = lazy(() => import("./v3/pages/CaseStudy"));
const Concept = lazy(() => import("./concept/Concept"));

function App() {
  return (
    <Router>
      <div className="App relative">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/project/:slug" element={<CaseStudy />} />
            <Route path="/" element={<HomeV3 />} />
            <Route path="/concept" element={<Concept />} />
            {/* The old portfolio (/classic, /projects) is retired; anything unknown goes home. */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
