import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CardSwap, { Card } from "./ui/CardSwap";

export default function Resume() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <section
            id="resume"
            className={`relative flex flex-col ${screenWidth >= 1224 ? 'lg:flex-row' : 'flex-col'} items-center justify-between min-h-screen text-white py-20 px-6 lg:px-24 overflow-hidden`}
        >
            {/* Black transparent background */}
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)]" />
            
            {/* LEFT TEXT SECTION */}
            <motion.div
                className={`w-full ${screenWidth >= 1224 ? 'lg:w-1/2' : 'w-full'} space-y-8 ${screenWidth >= 1224 ? 'text-left' : 'text-center'} relative z-10`}
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
            >
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
                    My <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">Resume</span>
                </h2>

                <p className={`text-gray-300 text-lg lg:text-xl leading-relaxed ${screenWidth >= 1224 ? 'max-w-lg' : 'max-w-full mx-auto'}`}>
                    A quick scroll through my journey — where ideas meet execution, and pixels learn some manners. I build things that <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">look good</span>, <span className="font-semibold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">work fast</span>, and <span className="font-semibold bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">actually make sense</span>.
                </p>

                <div>
                    <a
                        href="/assets/Vishesh_Rajput_Resume.pdf"
                        download
                        className="inline-block px-10 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:from-purple-400 hover:via-pink-400 hover:to-orange-400 transition-all duration-300 text-lg lg:text-xl hover:shadow-purple-500/30"
                    >
                        Download Resume 
                    </a>
                </div>
            </motion.div>

            {/* RIGHT SIDE - CARD SWAP SECTION */}
            {screenWidth >= 774 && (
                <motion.div
                    className={`w-full ${screenWidth >= 1224 ? 'lg:w-1/2' : 'w-full'} ${screenWidth >= 1224 ? 'mt-14 lg:mt-0' : 'mt-8'} relative flex justify-center items-center ${screenWidth >= 1224 ? 'scale-95' : 'scale-75'} z-10`}
                    style={{ height: screenWidth >= 1224 ? "500px" : "400px" }}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                <CardSwap
                    width={screenWidth >= 1224 ? 550 : 400}
                    height={screenWidth >= 1224 ? 350 : 250}
                    cardDistance={screenWidth >= 1224 ? 60 : 40}
                    verticalDistance={screenWidth >= 1224 ? 70 : 50}
                    delay={5000}
                    skewAmount={screenWidth >= 1224 ? 6 : 4}
                    pauseOnHover={false}
                >
                    {/* CARD 1 */}
                    <Card className="bg-[rgba(0,0,0,0.75)] backdrop-blur-md border border-purple-500/50 rounded-2xl p-0 text-left hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:border-purple-400/70 overflow-hidden">
                        {/* Fake Browser Bar */}
                        <div className="bg-[rgba(0,0,0,0.75)] border-b border-gray-700 px-4 py-3 flex items-center space-x-2">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="flex-1 bg-gray-700 rounded-md px-3 py-1 ml-4">
                                <div className="text-gray-300 text-sm">frontend-sorcerer.dev</div>
                            </div>
                        </div>
                        {/* Content */}
                        <div className={`${screenWidth >= 1224 ? 'p-6' : 'p-4'}`}>
                            <h3 className={`${screenWidth >= 1224 ? 'text-2xl' : 'text-xl'} font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3`}>
                                Frontend Sorcerer ✨
                            </h3>
                            <p className={`text-gray-200 ${screenWidth >= 1224 ? 'text-lg' : 'text-base'} leading-relaxed`}>
                                I speak fluent React and Tailwind. My components not only render fast — they also behave better than most people on Monday mornings.
                            </p>
                        </div>
                    </Card>

                    {/* CARD 2 */}
                    <Card className="bg-[rgba(0,0,0,0.75)] backdrop-blur-md border border-pink-500/50 rounded-2xl p-0 text-left hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all duration-400 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:border-pink-400/70 overflow-hidden">
                        {/* Fake Browser Bar */}
                        <div className="bg-[rgba(0,0,0,0.75)] border-b border-gray-700 px-4 py-3 flex items-center space-x-2">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="flex-1 bg-gray-700 rounded-md px-3 py-1 ml-4">
                                <div className="text-gray-300 text-sm">backend-alchemist.api</div>
                            </div>
                        </div>
                        {/* Content */}
                        <div className={`${screenWidth >= 1224 ? 'p-6' : 'p-4'}`}>
                            <h3 className={`${screenWidth >= 1224 ? 'text-2xl' : 'text-xl'} font-semibold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent mb-3`}>
                                Backend Alchemist ⚙️
                            </h3>
                            <p className={`text-gray-200 ${screenWidth >= 1224 ? 'text-lg' : 'text-base'} leading-relaxed`}>
                                I turn messy ideas into smooth APIs using Node.js, Express, and MongoDB. Basically, I make logic that behaves like it actually passed QA.
                            </p>
                        </div>
                    </Card>

                    {/* CARD 3 */}
                    <Card className="bg-[rgba(0,0,0,0.75)] backdrop-blur-md border border-orange-500/50 rounded-2xl p-0 text-left hover:scale-105 hover:shadow-[0_0_30px_rgba(251,146,60,0.5)] transition-all duration-400 shadow-[0_0_20px_rgba(251,146,60,0.3)] hover:border-orange-400/70 overflow-hidden">
                        {/* Fake Browser Bar */}
                        <div className="bg-[rgba(0,0,0,0.75)] border-b border-gray-700 px-4 py-3 flex items-center space-x-2">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="flex-1 bg-gray-700 rounded-md px-3 py-1 ml-4">
                                <div className="text-gray-300 text-sm">stack-tamer.tech</div>
                            </div>
                        </div>
                        {/* Content */}
                        <div className={`${screenWidth >= 1224 ? 'p-6' : 'p-4'}`}>
                            <h3 className={`${screenWidth >= 1224 ? 'text-2xl' : 'text-xl'} font-semibold bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent mb-3`}>
                                Stack Tamer 🧠
                            </h3>
                            <p className={`text-gray-200 ${screenWidth >= 1224 ? 'text-lg' : 'text-base'} leading-relaxed`}>
                                React, Node, MongoDB, Firebase, Tailwind — I juggle them all without dropping performance. Console.logs are my spirit animal.
                            </p>
                        </div>
                    </Card>

                    {/* CARD 4 */}
                    <Card className="bg-[rgba(0,0,0,0.75)] backdrop-blur-md border border-cyan-500/50 rounded-2xl p-0 text-left hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:border-cyan-400/70 overflow-hidden">
                        {/* Fake Browser Bar */}
                        <div className="bg-[rgba(0,0,0,0.75)] border-b border-gray-700 px-4 py-3 flex items-center space-x-2">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="flex-1 bg-gray-700 rounded-md px-3 py-1 ml-4">
                                <div className="text-gray-300 text-sm">collaboration.team</div>
                            </div>
                        </div>
                        {/* Content */}
                        <div className={`${screenWidth >= 1224 ? 'p-6' : 'p-4'}`}>
                            <h3 className={`${screenWidth >= 1224 ? 'text-2xl' : 'text-xl'} font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-3`}>
                                Collaboration Enthusiast 🤝
                            </h3>
                            <p className={`text-gray-200 ${screenWidth >= 1224 ? 'text-lg' : 'text-base'} leading-relaxed`}>
                                Open to projects, partnerships, and people who believe "let's debug this together" is a love language.
                            </p>
                        </div>
                    </Card>
                </CardSwap>
                </motion.div>
            )}
        </section>
    );
}
