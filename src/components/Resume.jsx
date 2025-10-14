import React from "react";
import { motion } from "framer-motion";
import CardSwap, { Card } from "./ui/CardSwap";

export default function Resume() {
    return (
        <section
            id="resume"
            className="relative flex flex-col lg:flex-row items-center justify-between min-h-screen text-white py-20 px-6 lg:px-24"
        >
            {/* LEFT TEXT SECTION */}
            <motion.div
                className="w-full lg:w-1/2 space-y-8 text-left"
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
            >
                <h2 className="text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-4">
                    My <span className="text-cyan-400">Resume</span>
                </h2>

                <p className="text-gray-300 text-xl lg:text-2xl leading-relaxed max-w-lg">
                    A quick scroll through my journey — where ideas meet execution, and pixels learn some manners. I build things that <span className="font-semibold text-cyan-400">look good</span>, <span className="font-semibold text-cyan-400">work fast</span>, and <span className="font-semibold text-cyan-400">actually make sense</span>.
                </p>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <a
                        href="/assets/Vishesh_Rajput_Resume.pdf"
                        download
                        className="inline-block px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold rounded-xl shadow-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 text-lg lg:text-xl"
                    >
                        Download Resume 
                    </a>
                </motion.div>
            </motion.div>

            {/* RIGHT SIDE - CARD SWAP SECTION */}
            <motion.div
                className="w-full lg:w-1/2 mt-14 lg:mt-0 relative flex justify-center items-center scale-95"
                style={{ height: "500px" }}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <CardSwap
                    width={550}
                    height={350}
                    cardDistance={60}
                    verticalDistance={70}
                    delay={5000}
                    skewAmount={6}
                    pauseOnHover={false}
                >
                    {/* CARD 1 */}
                    <Card className="bg-cyan-800/20 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-8 text-left hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-transform duration-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                        <h3 className="text-2xl font-semibold text-cyan-400 mb-3">
                            Frontend Sorcerer ✨
                        </h3>
                        <p className="text-gray-200 text-lg leading-relaxed">
                            I speak fluent React and Tailwind. My components not only render fast — they also behave better than most people on Monday mornings.
                        </p>
                    </Card>

                    {/* CARD 2 */}
                    <Card className="bg-cyan-800/20 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-8 text-left hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-transform duration-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                        <h3 className="text-2xl font-semibold text-cyan-400 mb-3">
                            Backend Alchemist ⚙️
                        </h3>
                        <p className="text-gray-200 text-lg leading-relaxed">
                            I turn messy ideas into smooth APIs using Node.js, Express, and MongoDB. Basically, I make logic that behaves like it actually passed QA.
                        </p>
                    </Card>

                    {/* CARD 3 */}
                    <Card className="bg-cyan-800/20 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-8 text-left hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-transform duration-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                        <h3 className="text-2xl font-semibold text-cyan-400 mb-3">
                            Stack Tamer 🧠
                        </h3>
                        <p className="text-gray-200 text-lg leading-relaxed">
                            React, Node, MongoDB, Firebase, Tailwind — I juggle them all without dropping performance. Console.logs are my spirit animal.
                        </p>
                    </Card>

                    {/* CARD 4 */}
                    <Card className="bg-cyan-800/20 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-8 text-left hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-transform duration-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                        <h3 className="text-2xl font-semibold text-cyan-400 mb-3">
                            Collaboration Enthusiast 🤝
                        </h3>
                        <p className="text-gray-200 text-lg mb-5 leading-relaxed">
                            Open to projects, partnerships, and people who believe “let’s debug this together” is a love language.
                        </p>
                        <a
                            href="mailto:visheshrajput.dev@gmail.com"
                            className="inline-block px-6 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition-all duration-300 text-lg"
                        >
                            Ping Me 💬
                        </a>
                    </Card>
                </CardSwap>
            </motion.div>
        </section>
    );
}
