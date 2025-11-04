// src/components/BackgroundParticles.jsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Particles from "./ui/Particles";

export default function BgParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 -z-10 pointer-events-none bg-black"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Particles
        particleColors={["#ffffff", "#60EFFF", "#7C6CFF"]}
        particleCount={150}
        particleSpread={15}
        speed={0.1}
        particleBaseSize={70}
        sizeRandomness={1.5}
        moveParticlesOnHover={false}
        alphaParticles={false}
        disableRotation={false}
        className="absolute inset-0"
      />
    </div>,
    document.body
  );
}
