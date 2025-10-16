import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import DotGrid from "./ui/dotgrid";

export default function Box3() {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden p-8 pt-10 rounded-2xl
        bg-[rgba(0,0,0,0.75)] border border-white/10 shadow-inner shadow-white/10
        transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/40 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* 🌐 Dot Grid Background */}
      <DotGrid
  dotSize={6}
  gap={20}
  baseColor="rgba(255,255,255,0.05)" // barely visible
  activeColor="#C9C9FF"              // light purple to match your theme
  proximity={100}                    // smaller influence area
  shockRadius={100}                  // smaller radius
  shockStrength={2}                  // gentle push
  resistance={750}
  returnDuration={1.5}
  cursorX={cursorPos.x}
  cursorY={cursorPos.y}
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  }}
/>


      {/* 🕒 Title (Top) */}
      <div className="relative z-10 text-center">
        <h2 className="text-lg md:text-xl font-bold leading-tight bg-gradient-to-r from-[#edeffd] via-[#c9c9ff] to-[#b0aaff] bg-clip-text text-transparent">
          Time Zones? Pfft…
        </h2>
        <h2 className="text-lg md:text-xl font-bold leading-tight bg-gradient-to-r from-[#edeffd] via-[#c9c9ff] to-[#b0aaff] bg-clip-text text-transparent">
          I work everywhere!
        </h2>
      </div>

      {/* 😆 Centered Description */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <p className="text-sm md:text-base text-gray-300 leading-relaxed text-center max-w-[90%]">
          Morning in New York, Coffee in London, Evening in Tokyo — I’m always coding somewhere!
        </p>
      </div>

      
      {/* 🌍 Bottom-left location - Only show for screens >= 1079px */}
      {screenWidth >= 1079 && (
        <div
          className="flex flex-col items-center gap-1 relative z-10 self-start mb-2 ml-2"
        >
          <FaMapMarkerAlt
            className={`text-purple-400 text-3xl transition-transform duration-300 ${
              isHovered ? "animate-bounce" : ""
            }`}
          />
          <span className="text-gray-300 text-sm">Remote</span>
          <span className="text-gray-400 text-xs">India</span>
        </div>
      )}

    </div>
  );
}
