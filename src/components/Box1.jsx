import React from "react";
import ShinyText from "./ui/shinytext";

export default function Box1() {
  return (
    <div
      className="overflow-hidden text-center p-6 
      transition-all duration-500 
      hover:shadow-lg hover:shadow-purple-500/40"
    >
      <ShinyText
        text="Hi, I’m Vishesh Rajput"
        className="text-2xl md:text-3xl font-bold mb-2 text-gray-400 leading-relaxed max-w-[85%] mx-auto"
      />

      <h3 className="text-lg md:text-xl text-gray-300 mb-4 italic">
        Software Engineer
      </h3>

      <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-[85%] mx-auto">
        I turn coffee and ideas into working code — fast. From web apps to mobile
        and backend systems, I build full products using React, Node.js, Flutter,
        Firebase, and MongoDB. I also team up with my favorite AI colleagues —
        ChatGPT, Gemini, Copilot, Cursor, and n8n — to skip the boring stuff and
        focus on logic, design, and creativity. Why take months when I can ship
        it in weeks?
      </p>
    </div>
  );
}
