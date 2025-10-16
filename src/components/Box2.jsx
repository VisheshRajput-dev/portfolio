import React, { useRef, useEffect, useState } from "react";
import box2Animation from "../assets/box2.json";
import LogoLoop from "./ui/LogoLoop";
import { Player } from "@lottiefiles/react-lottie-player";
import {
  SiReact,
  SiTailwindcss,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiFirebase,
  SiOpenai,
  SiGoogle,
  SiGithubcopilot,
} from "react-icons/si";

export default function Box2() {
  const playerRef = useRef(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // start animation on mount only for screens >= 1430px
    if (screenWidth >= 1430) {
      playerRef.current?.play();
    }
  }, [screenWidth]);

  // 🧠 Tech groups
  const frontendTech = [
    { node: <SiReact />, title: "React" },
    { node: <SiTailwindcss />, title: "TailwindCSS" },
    { node: <SiJavascript />, title: "JavaScript" },
    { node: <SiHtml5 />, title: "HTML5" },
    { node: <SiCss3 />, title: "CSS3" },
  ];

  const backendTech = [
    { node: <SiNodedotjs />, title: "Node.js" },
    { node: <SiExpress />, title: "Express" },
    { node: <SiMongodb />, title: "MongoDB" },
    { node: <SiFirebase />, title: "Firebase" },
  ];

  const aiTech = [
    { node: <SiOpenai />, title: "ChatGPT" },
    { node: <SiGoogle />, title: "Gemini" },
    { node: <SiGithubcopilot />, title: "GitHub Copilot" },
  ];

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-between p-6 rounded-2xl 
      bg-[rgba(0,0,0,0.75)] border border-white/10 shadow-inner shadow-white/10 
      transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/30"
      onMouseEnter={() => screenWidth >= 1430 && playerRef.current?.pause()}
      onMouseLeave={() => screenWidth >= 1430 && playerRef.current?.play()}
    >
      {/* 🔮 Title */}
      <h2
        className={`font-bold text-transparent 
        bg-gradient-to-r from-[#00e0ff] via-[#8b5cf6] to-[#ff4ecd] 
        bg-clip-text text-center animate-gradient-move ${
          screenWidth < 623 ? "text-xl mb-4" : "text-2xl md:text-3xl mb-6"
        }`}
      >
        Tools I bribe to make my code look smarter 😎
      </h2>

      {/* 💻 Frontend Tech Loop */}
      <div className={`w-full ${screenWidth < 623 ? "mt-1" : "mt-2"}`}>
        <LogoLoop
          logos={frontendTech}
          speed={60}
          direction="left"
          logoHeight={screenWidth < 623 ? 35 : 45}
          gap={screenWidth < 623 ? 30 : 40}
          pauseOnHover
          scaleOnHover
          fadeOut
          ariaLabel="Frontend technologies"
        />
      </div>

      {/* ⚙️ Backend Tech Loop */}
      <div className={`w-full ${screenWidth < 623 ? "mt-4" : "mt-6"}`}>
        <LogoLoop
          logos={backendTech}
          speed={60}
          direction="right"
          logoHeight={screenWidth < 623 ? 35 : 45}
          gap={screenWidth < 623 ? 30 : 40}
          pauseOnHover
          scaleOnHover
          fadeOut
          ariaLabel="Backend technologies"
        />
      </div>

      {/* 🤖 AI Tech Loop */}
      <div className={`w-full ${screenWidth < 623 ? "mt-4 mb-2" : "mt-6 mb-4"}`}>
        <LogoLoop
          logos={aiTech}
          speed={60}
          direction="left"
          logoHeight={screenWidth < 623 ? 35 : 45}
          gap={screenWidth < 623 ? 30 : 40}
          pauseOnHover
          scaleOnHover
          fadeOut
          ariaLabel="AI technologies"
        />
      </div>

      {/* 🎞️ Lottie Animation (auto-play, pause on hover) - Only show for screens >= 1430px */}
      {screenWidth >= 1430 && (
        <div className="w-[200px] h-[200px] mt-2">
          <Player
            ref={playerRef}
            autoplay
            loop
            src={box2Animation}
            className="w-full h-full"
            style={{
              filter:
                "drop-shadow(0 0 10px rgba(168,85,247,0.7)) drop-shadow(0 0 20px rgba(236,72,153,0.5))",
            }}
          />
        </div>
      )}
    </div>
  );
}


