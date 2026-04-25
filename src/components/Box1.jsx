import React, { useState, useEffect } from "react";
import ShinyText from "./ui/shinytext";

export default function Box1() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getTextContent = () => {
    if (screenWidth < 1430) {
      return "I build things that ship fast. Web, mobile, and backend are all in play with React, Node, and Flutter. AI helps with the repetitive parts so I can stay focused on product thinking and clean execution.";
    }
    return "I turn rough ideas into working products fast. From web apps to mobile builds and backend systems, I work across React, Node.js, Flutter, Firebase, and MongoDB. I also use tools like ChatGPT, Gemini, Copilot, Cursor, and n8n to cut down repetitive work and spend more time on architecture, design, and the parts that actually need judgment.";
  };

  return (
    <div
      className="overflow-hidden text-center p-6 
      transition-all duration-500 
      hover:shadow-lg hover:shadow-purple-500/40"
    >
      <ShinyText
        text="Hi, I'm Vishesh Rajput"
        className="text-2xl md:text-3xl font-bold mb-2 text-gray-400 leading-relaxed max-w-[85%] mx-auto"
      />

      <h3 className="text-lg md:text-xl text-gray-300 mb-4 italic">
        Software Engineer
      </h3>

      <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-[85%] mx-auto">
        {getTextContent()}
      </p>
    </div>
  );
}
