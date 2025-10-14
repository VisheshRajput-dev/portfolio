import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="relative bg-black/70 backdrop-blur-lg border-t border-purple-400/20 transition-all duration-300 hover:shadow-[0_0_40px_rgba(180,130,255,0.5)] hover:border-purple-400/40">
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row justify-between items-center gap-10">

        {/* Left Section — Text */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
          <p className="text-xl md:text-2xl text-purple-200 font-semibold">
            Crafted with 🪄 magic, wit, and a pinch of audacity.
          </p>
          <p className="text-gray-300 text-sm md:text-base">
            P.S. No pixels were harmed in the making of this site.
          </p>
        </div>

        {/* Center Section — Social Icons */}
        <div className="flex gap-8 text-3xl">
          <a
            href="https://github.com/jerry16-coder"
            target="_blank"
            rel="noreferrer"
            className="hover:text-purple-400 transition-all duration-300"
          >
            <FaGithub />
          </a>
          <a
            href="https://x.com/yourhandle"
            target="_blank"
            rel="noreferrer"
            className="hover:text-purple-400 transition-all duration-300"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://linkedin.com/in/vishesh-rajput"
            target="_blank"
            rel="noreferrer"
            className="hover:text-purple-400 transition-all duration-300"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:visheshrajput.dev@gmail.com"
            className="hover:text-purple-400 transition-all duration-300"
          >
            <FaEnvelope />
          </a>
        </div>

        {/* Right Section — Status & Copyright */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-3">
          <p className="text-green-400 font-medium animate-pulse text-sm md:text-base">
            Online & open for collaborations 💡
          </p>
          <p className="text-gray-400 text-xs md:text-sm">
            © {new Date().getFullYear()} Vishesh Rajput. All rights reserved.
          </p>
        </div>
      </div>

      {/* Optional Bottom Glow */}
      <div className="absolute inset-x-0 bottom-0 h-2 bg-purple-400/20 shadow-[0_0_20px_rgba(180,130,255,0.25)] rounded-t-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(180,130,255,0.45)]"></div>
    </footer>
  );
}
