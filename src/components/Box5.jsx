import React, { useRef, useState, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import coffeeAnimation from "../assets/coffee.json"; // your downloaded Lottie

export default function Box5() {
  const playerRef = useRef(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="w-full h-full relative overflow-hidden rounded-2xl
      bg-[rgba(0,0,0,0.75)] border border-white/10 shadow-inner shadow-white/10
      transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/40
      flex flex-col justify-center items-center p-6"
      onMouseEnter={() => screenWidth >= 1079 && playerRef.current?.play()}
      onMouseLeave={() => screenWidth >= 1079 && playerRef.current?.stop()}
    >
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-100 text-center">
        Fueled by coffee and curiosity ☕
      </h2>

      {/* Subtitle */}
      <p className="text-gray-400 text-sm md:text-base font-light text-center max-w-[90%] mt-2">
        I learn something new every night — sometimes on purpose.
      </p>

      {/* ☕ Coffee Lottie Animation at bottom-right - Only show for screens >= 1079px */}
      {screenWidth >= 1079 && (
        <div className="absolute bottom-4 right-4 w-32 h-32 md:w-40 md:h-40">
          <Player
            ref={playerRef}
            autoplay={false}
            loop
            src={coffeeAnimation}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
