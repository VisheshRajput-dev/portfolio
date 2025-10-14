import React, { useState, useEffect } from "react";
import { boxLayout } from "./ui/boxLayoutConfig";

export default function ProjectSection() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getBoxStyle = (box) => {
    if (screenWidth < 640 && box.positions.sm) return box.positions.sm;
    if (screenWidth < 1024 && box.positions.md) return box.positions.md;
    return box.positions.default;
  };

  // Compute container height dynamically
  const containerHeight = Math.max(
    ...boxLayout.map(
      (box) =>
        parseFloat(getBoxStyle(box).top) + parseFloat(getBoxStyle(box).height)
    )
  );

  return (
    <section
    id="projects"
      className="relative  text-white"
      style={{ height: `${containerHeight}vh` }}
    >
      {boxLayout.map((box) => (
        <div
          key={box.id}
          className="absolute flex items-center justify-center rounded-2xl transition-transform duration-300 hover:scale-105"
          style={{
            ...getBoxStyle(box),
            backgroundColor: `${box.color}CC`, // add slight transparency
            border: "1px solid rgba(255,255,255,0.2)", // subtle white border
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.15)", // soft glowing shadow
          }}
        >
          <h2 className="text-xl font-semibold text-center">{box.title}</h2>
        </div>
      ))}
    </section>
  );
}
