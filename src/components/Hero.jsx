import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ui/ProfileCard";
import RotatingText from "./ui/RotatingText";
import avatar from "../assets/avatar.png";
import icon from "../assets/icon.png";
import grain from "../assets/grain.png";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="hero"
    className="flex flex-col xl:flex-row items-center justify-between min-h-screen px-6 md:px-16 py-10 pt-24">
      {/* LEFT SIDE - Profile Card */}
      <div className="flex justify-center xl:justify-start w-full xl:w-1/2 mb-10 xl:mb-0 order-1 xl:order-1">
        <ProfileCard
          avatarUrl={avatar}
          iconUrl={icon}
          grainUrl={grain}
          name="Vishesh Rajput"
          title="Software Engineer"
          handle="VisheshRajput"
          status="Available"
          contactText="Let's Connect"
        />
      </div>

      {/* RIGHT SIDE - Hero Text / Content */}
      <div className="w-full xl:w-1/2 text-white text-center xl:text-left space-y-6 order-2 xl:order-2">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-snug">
          I Craft&nbsp;
          <RotatingText
            texts={["Beautiful", "Intuitive", "Impactful", "Modern"]}
            mainClassName="inline-flex bg-gradient-to-r from-cyan-300 to-blue-400 text-black font-semibold rounded-lg px-3 py-1"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
          <br />
          Digital Experiences
        </h1>

        <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto xl:mx-0">
          Turning imagination into interactive reality — building seamless,
          dynamic, and modern web experiences using React, Node.js, and the best
          of today's tech.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start">
          <button 
            onClick={() => navigate('/projects')}
            className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            View Projects
          </button>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
