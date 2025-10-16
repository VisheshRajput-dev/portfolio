import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { boxLayout } from "./ui/boxLayoutConfig";
import Box1 from "./Box1";
import Box2 from "./Box2";
import Box3 from "./Box3";
import Box4 from "./Box4";
import Box5 from "./Box5";

export default function AboutSection() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getBoxStyle = (box) => {
    if (screenWidth < 885 && box.positions.md) return box.positions.md;
    if (screenWidth < 1079 && box.positions.lg) return box.positions.lg;
    if (screenWidth < 1430 && box.positions.xl) return box.positions.xl;
    return box.positions.default;
  };

  const containerHeight = Math.max(
    ...boxLayout.map(
      (box) =>
        parseFloat(getBoxStyle(box).top) + parseFloat(getBoxStyle(box).height)
    )
  );

  const renderBoxContent = (boxId) => {
    switch (boxId) {
      case 1:
        return <Box1 />;
      case 2:
        return <Box2 />;
        case 3:
        return <Box3 />;
        case 4:
        return <Box4 />;
        case 5:
          return <Box5 />;
      default:
        return (
          <h2 className="text-xl font-semibold text-center">{`Box ${boxId}`}</h2>
        );
    }
  };

  return (
    <section
      id="about"
      className="relative text-white"
      style={{ height: `${containerHeight}vh` }}
    >
      {boxLayout.map((box) => {
        const style = getBoxStyle(box);

        return (
          <motion.div
            key={box.id}
            className="absolute flex flex-col items-center justify-center rounded-2xl transition-all duration-500"
            style={{
              ...style,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              boxShadow:
                "inset 0 0 30px rgba(255,255,255,0.25), 0 0 25px rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            whileHover={{ scale: 1.03 }}
          >
            {renderBoxContent(box.id)}
          </motion.div>
        );
      })}
    </section>
  );
}
