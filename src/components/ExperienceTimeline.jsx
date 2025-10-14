// src/components/ExperienceTimeline.jsx
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/**
 * Experience data inspired by Aayush Bharti's portfolio
 * Keep descriptions concise and impactful for visual balance.
 */
const experiences = [
  {
    company: "Roboto Studio",
    role: "Frontend Engineer",
    duration: "JAN 2025 - Present",
    location: "London Area, United Kingdom",
    description:
      "Architected enterprise-scale, CMS-driven reusable pagebuilder blocks with dynamic configurability using Sanity and Contentful, enabling non-technical teams to manage content across 6+ production websites. Delivered high-performance web applications using Next.js, React, and Tailwind CSS with advanced rendering strategies, achieving 25% increase in user engagement.",
    tech: ["TypeScript", "Next.js", "Sanity CMS", "Contentful CMS", "Tailwind CSS", "Figma", "Turborepo", "Vercel AI SDK"],
    highlights: ["40% faster content delivery", "25% increase in user engagement", "20% improvement in Core Web Vitals", "15% reduction in production defects"]
  },
  {
    company: "GitHub",
    role: "Open Source Contributor",
    duration: "JUN 2024 - Present",
    location: "Remote",
    description:
      "Contributed to open-source projects with 15,000+ Github stars, improving code quality, feature implementations, and documentation. Engaged with developer communities, collaborating on innovative solutions and best practices.",
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Turborepo"],
    highlights: ["15,000+ GitHub stars", "Active community engagement", "Quality improvements"]
  },
  {
    company: "Freelance",
    role: "Full-stack Developer & Problem Solver",
    duration: "Sep 2023 – Present",
    location: "Remote",
    description:
      "Delivered production-ready MVPs using modern web technologies and AI-assisted development. Specialized in creating dynamic web experiences with clean, efficient code across frontend and backend systems.",
    tech: ["React", "Node.js", "TypeScript", "Next.js", "AI Tools"],
    highlights: ["Production-ready MVPs", "AI-assisted development", "Full-stack solutions"]
  },
  {
    company: "Personal Projects",
    role: "Creator & Continuous Learner",
    duration: "Ongoing",
    location: "Global",
    description:
      "Building innovative projects, rapid prototypes, and experiments with cutting-edge technologies. Focus on creating seamless user experiences and staying ahead of industry trends.",
    tech: ["AI", "React", "Cloud", "Innovation"],
    highlights: ["Rapid prototyping", "Technology experimentation", "Industry trend analysis"]
  },
];

export default function ExperienceTimeline() {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  // Scroll progress for the timeline line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"]
  });

  // Transform scroll progress to height percentage
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section 
      id="experience" 
      ref={containerRef}
      className="relative w-full min-h-screen py-20 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)]" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
          My Career Adventures
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          From “I hope this works” to “Oops, it actually works!” – a timeline of my professional mischiefs and victories.
          </p>
        </motion.div>

        {/* Main Timeline Container */}
        <div className="relative">
          {/* Animated Progress Line - Left aligned */}
          <div className="absolute left-16 md:left-20 top-0 bottom-0 w-[3px]">
            {/* Static gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent rounded-full" />
            
            {/* Animated progress fill */}
            <motion.div
              style={{ height: progressHeight }}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-purple-400 via-pink-400 to-orange-400 rounded-full shadow-lg shadow-purple-500/60"
            />
            
            {/* Glowing effect on progress line */}
            <motion.div
              style={{ height: progressHeight }}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-purple-400 via-pink-400 to-orange-400 rounded-full blur-sm opacity-60"
            />
          </div>

          {/* Timeline Items - All left aligned */}
          <div className="relative z-10 space-y-16 md:space-y-20">
            {experiences.map((exp, idx) => (
              <TimelineItem 
                key={idx}
                experience={exp}
                index={idx}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute right-8 bottom-8 w-16 h-16 opacity-60 pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="floatingGradient" x1="0" x2="1">
                <stop offset="0" stopColor="#7C3AED" />
                <stop offset="1" stopColor="#FB7185" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="24" fill="url(#floatingGradient)" opacity="0.8"/>
            <path d="M20 28h24v8H20z" fill="white" opacity="0.9"/>
            <circle cx="26" cy="32" r="2" fill="#7C3AED"/>
            <circle cx="38" cy="32" r="2" fill="#FB7185"/>
          </svg>
        </motion.div>
      </div>

      {/* Additional floating particles */}
      <div className="absolute top-20 left-10 w-4 h-4 opacity-40 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -30, 0],
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-full h-full bg-purple-400 rounded-full blur-sm"
        />
      </div>

      <div className="absolute top-1/2 right-20 w-3 h-3 opacity-30 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="w-full h-full bg-pink-400 rounded-full blur-sm"
        />
      </div>

      <div className="absolute bottom-1/3 left-20 w-2 h-2 opacity-50 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -25, 0],
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="w-full h-full bg-orange-400 rounded-full blur-sm"
        />
      </div>
    </section>
  );
}

// Individual Timeline Item Component
function TimelineItem({ experience, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -100, y: 40 }}
      transition={{ 
        duration: 0.8, 
        delay: isInView ? index * 0.2 : 0,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="relative"
    >
      {/* Timeline Dot with Enhanced Animations */}
      <div className="absolute top-10 left-12 md:left-16 z-30">
        <motion.div
          animate={isInView ? { 
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
            boxShadow: [
              "0 0 0 0 rgba(124, 58, 237, 0.4)",
              "0 0 0 15px rgba(124, 58, 237, 0.1)",
              "0 0 0 0 rgba(124, 58, 237, 0)"
            ]
          } : { scale: 1, rotate: 0, boxShadow: "0 0 0 0 rgba(124, 58, 237, 0)" }}
          transition={{ 
            duration: 2, 
            delay: isInView ? index * 0.2 + 0.5 : 0,
            ease: "easeInOut"
          }}
          whileHover={{ 
            scale: 1.3,
            rotate: 360,
            transition: { duration: 0.6 }
          }}
          className="relative cursor-pointer group/dot"
        >
          {/* Main dot */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 shadow-lg shadow-purple-500/50" />
          
          {/* Inner glow */}
          <div className="absolute inset-1 rounded-full bg-white/30 backdrop-blur-sm" />
          
          {/* Continuous pulse animation */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5
            }}
            className="absolute inset-0 rounded-full bg-purple-400/40 blur-sm"
          />
          
          {/* Rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -inset-2 rounded-full border-2 border-purple-400/20"
          />
        </motion.div>
      </div>

      {/* Card Container - Left aligned with consistent spacing */}
      <div className="ml-24 md:ml-32 w-full max-w-4xl">
        <motion.article
          whileHover={{ 
            y: -12,
            scale: 1.02,
            transition: { 
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          }}
          whileTap={{ scale: 0.98 }}
          className="group relative"
        >
          {/* Enhanced Glassmorphism Card */}
          <div className="relative bg-white/[0.04] border border-white/[0.1] backdrop-blur-2xl p-8 rounded-3xl shadow-2xl
            hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-purple-500/20 hover:shadow-2xl
            transition-all duration-700 cursor-pointer overflow-hidden">
            
            {/* Animated background gradient */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-purple-400/20 rounded-full blur-sm"
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400/20 rounded-full blur-sm"
                animate={{
                  y: [0, 20, 0],
                  x: [0, -10, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.7,
                }}
              />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Date & Location with enhanced styling */}
              <motion.div 
                className="flex items-center gap-2 mb-4"
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: isInView ? index * 0.2 + 0.3 : 0 }}
              >
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider bg-purple-500/10 px-3 py-1 rounded-full border border-purple-400/20">
                  {experience.duration}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400 font-medium">{experience.location}</span>
              </motion.div>

              {/* Role & Company with enhanced typography */}
              <motion.h3 
                className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-purple-100 transition-colors duration-300"
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: isInView ? index * 0.2 + 0.4 : 0 }}
                whileHover={{ x: 5 }}
              >
                {experience.role}
              </motion.h3>
              
              <motion.h4 
                className="text-lg md:text-xl font-semibold text-purple-300 mb-6"
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: isInView ? index * 0.2 + 0.5 : 0 }}
                whileHover={{ x: 5 }}
              >
                @ {experience.company}
              </motion.h4>

              {/* Description with improved readability */}
              <motion.p 
                className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base max-w-3xl"
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: isInView ? index * 0.2 + 0.6 : 0 }}
              >
                {experience.description}
              </motion.p>

              {/* Enhanced Highlights */}
              {experience.highlights && (
                <motion.div 
                  className="mb-6"
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: isInView ? index * 0.2 + 0.7 : 0 }}
                >
                  <div className="flex flex-wrap gap-2">
                    {experience.highlights.map((highlight, i) => (
                      <motion.span
                        key={i}
                        whileHover={{ 
                          scale: 1.05,
                          y: -2,
                          transition: { duration: 0.2 }
                        }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ delay: isInView ? i * 0.1 + index * 0.3 : 0 }}
                        className="text-xs px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200
                          hover:bg-purple-500/30 hover:border-purple-300/50 hover:text-purple-100 
                          transition-all duration-300 cursor-pointer relative overflow-hidden group/highlight"
                      >
                        {/* Highlight shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/20 to-transparent 
                          -translate-x-full group-hover/highlight:translate-x-full transition-transform duration-700" />
                        <span className="relative z-10">{highlight}</span>
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Enhanced Tech Stack */}
              <motion.div 
                className="flex flex-wrap gap-2"
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: isInView ? index * 0.2 + 0.8 : 0 }}
              >
                {experience.tech.map((tech, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ 
                      scale: 1.1,
                      y: -2,
                      rotate: [0, -2, 2, 0],
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: isInView ? i * 0.1 + index * 0.2 : 0 }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.08] border border-white/[0.15] text-gray-200
                      hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-400/30 
                      hover:text-white transition-all duration-300 cursor-pointer relative overflow-hidden group/tech"
                  >
                    {/* Tech tag shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                      -translate-x-full group-hover/tech:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10">{tech}</span>
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.article>
      </div>
    </motion.div>
  );
}
