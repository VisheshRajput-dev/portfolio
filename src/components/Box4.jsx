import React, { useState, useEffect } from "react";
import { FaRegCopy, FaCheckDouble } from "react-icons/fa";
import ShinyText from "./ui/shinytext";
import Aurora from "./ui/Aurora";

export default function Box4() {
  const [copied, setCopied] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const email = "visheshrajput.dev@gmail.com";

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }; 

  return (
    <div
      className="w-full h-full relative overflow-hidden rounded-2xl
        bg-[rgba(0,0,0,0.75)] border border-white/10 shadow-inner shadow-white/10
        transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/40"
    >
      {/* 🌌 Aurora Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          // Adjust for different breakpoints to ensure perfect fit
          width: screenWidth < 370 ? "calc(100% - 2px)" : 
                 screenWidth < 773 ? "calc(100% - 1px)" : 
                 screenWidth < 898 ? "calc(100% - 1px)" : 
                 screenWidth < 1065 ? "calc(100% - 1px)" : "100%",
          height: screenWidth < 370 ? "calc(100% - 2px)" : 
                  screenWidth < 773 ? "calc(100% - 1px)" : 
                  screenWidth < 898 ? "calc(100% - 1px)" : 
                  screenWidth < 1065 ? "calc(100% - 1px)" : "100%",
        }}
      >
        <Aurora
          colorStops={[ "#FF94B4","#76D0FA", "#F1BC72"]}
          interactive={true}
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* 🪄 Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full gap-6 px-4 -translate-y-4">
        {/* 😎 Funny Title */}
        <ShinyText
          text="Got an idea? Let’s turn your ‘someday’ into ‘done’!"
          className="text-2xl md:text-3xl font-bold text-center text-white"
        />

        {/* 📋 Copy Email Box */}
        <div
          onClick={handleCopy}
          className="cursor-pointer bg-white/10 border border-white/20 text-gray-200 px-4 py-2 rounded-lg 
          hover:bg-purple-500/20 transition-all flex items-center justify-center w-72 gap-2 text-center backdrop-blur-sm"
        >
          {copied ? (
            <FaCheckDouble className="text-green-400 text-lg transition-all duration-300" />
          ) : (
            <FaRegCopy className="text-gray-300 text-lg" />
          )}
          <span className="select-none">{copied ? "Copied!" : email}</span>
        </div>
      </div>

      {/* 🔔 Toast Notification */}
      {copied && (
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
          bg-white/10 border border-white/20 text-gray-100 px-4 py-2 rounded-lg text-sm
          animate-fadeInUp backdrop-blur-md shadow-md"
        >
          ✅ Email copied successfully!
        </div>
      )}

      {/* ✨ Simple Toast Animation */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translate(-50%, 20px); }
          20% { opacity: 1; transform: translate(-50%, 0); }
          80% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, 20px); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 2.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
