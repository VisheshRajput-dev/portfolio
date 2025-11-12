import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import SEO from "./SEO";
import realdeskVideo from "../assets/webview/realdesk_web.mp4";
import realdeskLogo from "../assets/logos/realdesk_logo.png";
import devsyncVideo from "../assets/webview/devsync_web.mp4";
import devsyncLogo from "../assets/logos/devsync_logo.png";
import vishtiShopVideo from "../assets/webview/vishti_shop_web.mp4";
import vishtiShopLogo from "../assets/logos/vishti_shop_logo.png";
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiNodedotjs, 
  SiMongodb, 
  SiStripe, 
  SiRedis, 
  SiPython, 
  SiTensorflow, 
  SiD3Dotjs, 
  SiPostgresql, 
  SiFlutter, 
  SiDart, 
  SiFirebase, 
  SiDocker, 
  SiKubernetes, 
  SiTerraform, 
  SiPrometheus, 
  SiSolidity, 
  SiWeb3Dotjs, 
  SiIpfs, 
  SiEthereum, 
  SiOpenai, 
  SiWebrtc,
  SiFramer,
  SiVite,
  SiTailwindcss,
} from "react-icons/si";
import { HiArrowUpRight, HiHome } from "react-icons/hi2";

// Add CSS for animated gradients and 3D card effects
const cardStyles = `
  html {
    scroll-behavior: smooth;
  }
  
  .perspective-1000 {
    perspective: 1000px;
  }
  .preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  
  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
  
  .animated-gradient {
    background-size: 200% 200%;
    animation: gradientShift 8s ease-in-out infinite;
  }
  
  .gradient-glow {
    position: relative;
    transition: all 0.3s ease;
  }
  
  .gradient-glow:hover {
    box-shadow: 
      0 0 20px rgba(102, 126, 234, 0.6),
      0 0 40px rgba(118, 75, 162, 0.4),
      0 0 60px rgba(240, 147, 251, 0.3);
  }
  
  .gradient-glow.glow-emerald:hover {
    box-shadow: 
      0 0 20px rgba(15, 52, 67, 0.6),
      0 0 40px rgba(52, 232, 158, 0.4),
      0 0 60px rgba(18, 194, 233, 0.3);
  }
  
  .gradient-glow.glow-sunset:hover {
    box-shadow: 
      0 0 20px rgba(255, 211, 165, 0.6),
      0 0 40px rgba(253, 101, 133, 0.4),
      0 0 60px rgba(246, 79, 89, 0.3);
  }
  
  .gradient-glow.glow-breeze:hover {
    box-shadow: 
      0 0 20px rgba(127, 127, 213, 0.6),
      0 0 40px rgba(145, 234, 228, 0.4),
      0 0 60px rgba(134, 168, 231, 0.3);
  }
  
  .preview-scale {
    transition: transform 0.3s ease;
  }
  
  .preview-scale:hover {
    transform: scale(1.05);
  }
`;


// Premium project data with enhanced styling
const projectsData = [
  {
    id: 1,
    title: "RealDesk",
    subtitle: "a developer internship simulator",
    description: "Simulate a real developer workspace with realistic tasks, bug reports, deadlines, and client interactions — a developer internship simulator.",
    tech: ["React", "Vite", "TypeScript", "Tailwind", "shadcn/ui", "Monaco", "Firebase", "Gemini"],
    category: "Full-Stack",
    liveUrl: "https://realdesk.vercel.app/",
    githubUrl: "https://github.com/VisheshRajput-dev/real-desk",
    highlights: ["Professional in-browser code editor with multi-file support", "Hybrid evaluation: static checks & AI review", "Gamified learning experience"],
    previewImage: realdeskVideo,
    logo: realdeskLogo,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    gradientName: "Royal Purple",
    accentColor: "violet"
  },
  {
    id: 2,
    title: "DevSync",  
    subtitle: "A collaborative platform for developers to sync their code and collaborate on projects",
    description: "DevSync is a collaborative platform for developers to sync their code and collaborate on projects. It allows developers to sync their code and collaborate on projects with other developers.",
    tech: ["React", "Vite", "TypeScript", "Tailwind", "socket.io", "node.js","express","python","cors", "Monaco", "Firebase", "Gemini"],
    category: "Full-Stack",
    liveUrl: "https://devsync-dev.vercel.app/",
    githubUrl: "https://github.com/VisheshRajput-dev/devsync",
    highlights: ["Real-time Collaboration", "Code Syncing", "Multi-file Support", ],
    previewImage: devsyncVideo,
    logo: devsyncLogo,
    gradient: "linear-gradient(135deg, #0F3443 0%, #34E89E 50%, #12C2E9 100%)",
    gradientName: "Tech Emerald",
    accentColor: "cyan"
  },
  {
    id: 3,
    title: "vishti-shop",
    subtitle: "An e-commerce platform ",
    description: "vishti-shop is an e-commerce platform for selling products, multi-user login along with admin dashboard to manage the products and orders.",
    tech: ["React", "Vite", "javascript", "Tailwind", "cloudinary", "Firebase", "Node.js", "MongoDB", "Razorpay", "cors","express"],
    category: "full-stack",
    liveUrl: "https://vishti-shop.vercel.app/",
    githubUrl: "https://github.com/VisheshRajput-dev/vishti-shop",
      highlights: ["Admin dashboard", "Product&Order management", "payment integration"],
    previewImage: vishtiShopVideo,
    logo: vishtiShopLogo,
    gradient: "linear-gradient(135deg, #FFD3A5 0%, #FD6585 50%, #F64F59 100%)",
    gradientName: "Warm Sunset",
    accentColor: "emerald"
  },
  
];

// Tech stack icon mapping
const getTechIcon = (tech) => {
  const iconMap = {
    'React': SiReact,
    'Next.js': SiNextdotjs,
    'TypeScript': SiTypescript,
    'Node.js': SiNodedotjs,
    'MongoDB': SiMongodb,
    'Stripe': SiStripe,
    'Redis': SiRedis,
    'Python': SiPython,
    'TensorFlow': SiTensorflow,
    'D3.js': SiD3Dotjs,
    'PostgreSQL': SiPostgresql,
    'Flutter': SiFlutter,
    'Dart': SiDart,
    'Firebase': SiFirebase,
    'Docker': SiDocker,
    'Kubernetes': SiKubernetes,
    'Terraform': SiTerraform,
    'Prometheus': SiPrometheus,
    'Solidity': SiSolidity,
    'Web3.js': SiWeb3Dotjs,
    'IPFS': SiIpfs,
    'Ethereum': SiEthereum,
    'OpenAI': SiOpenai,
    'WebRTC': SiWebrtc,
    'Framer Motion': SiFramer,
    'Vite': SiVite,
    'Tailwind': SiTailwindcss,
    'Monaco': null,
    'Gemini': null // No icon available, will use first letter
  };
  
  const IconComponent = iconMap[tech];
  return IconComponent ? <IconComponent className="w-4 h-4" /> : tech.charAt(0).toUpperCase();
};

// Skeleton Loading Components
const SkeletonPreviewCard = () => (
  <div className="bg-gray-800/50 rounded-2xl p-6 animate-pulse">
    {/* Browser Header */}
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
      <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
      <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
      <div className="flex-1 h-6 bg-gray-600 rounded ml-4"></div>
    </div>
    
    {/* Content Area */}
    <div className="space-y-4">
      <div className="h-4 bg-gray-600 rounded w-3/4"></div>
      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
      <div className="h-32 bg-gray-600 rounded"></div>
      <div className="flex gap-2">
        <div className="h-6 bg-gray-600 rounded w-16"></div>
        <div className="h-6 bg-gray-600 rounded w-20"></div>
        <div className="h-6 bg-gray-600 rounded w-14"></div>
      </div>
    </div>
  </div>
);

const SkeletonProjectDetails = () => (
  <div className="space-y-6 animate-pulse">
    {/* Title */}
    <div className="flex items-center gap-3">
      <div className="w-8 h-0.5 bg-gray-600 rounded-full"></div>
      <div className="h-8 bg-gray-600 rounded w-48"></div>
    </div>
    
    {/* Description */}
    <div className="space-y-2 ml-11">
      <div className="h-4 bg-gray-600 rounded w-full"></div>
      <div className="h-4 bg-gray-600 rounded w-3/4"></div>
      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
    </div>
    
    {/* Highlights */}
    <div className="space-y-3 ml-11">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        <div className="h-4 bg-gray-600 rounded w-64"></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        <div className="h-4 bg-gray-600 rounded w-56"></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        <div className="h-4 bg-gray-600 rounded w-48"></div>
      </div>
    </div>
    
    {/* Tech Stack */}
    <div className="flex flex-wrap gap-2 ml-11">
      <div className="h-6 bg-gray-600 rounded w-16"></div>
      <div className="h-6 bg-gray-600 rounded w-20"></div>
      <div className="h-6 bg-gray-600 rounded w-14"></div>
      <div className="h-6 bg-gray-600 rounded w-18"></div>
      <div className="h-6 bg-gray-600 rounded w-12"></div>
    </div>
  </div>
);

// Browser-Style Preview Card Component
const PreviewCard = ({ project }) => {
  return (
    <>
      {/* Mobile View - Simplified: Title, Arrow, Video, and Compact Description */}
      <div className="lg:hidden w-full space-y-4">
        {/* Simple Title and Arrow Row */}
        <div className="flex items-center justify-between px-2">
          <h4 className="text-white text-lg font-bold">{project.title}</h4>
          {project.liveUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
              }}
              className="group flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110"
              title={`Visit ${project.title}`}
            >
              <HiArrowUpRight className="w-4 h-4 text-white/80 group-hover:text-white transition-colors duration-300" />
            </button>
          )}
        </div>
        
        {/* Direct Webview - No containers */}
        <div className="w-full relative" style={{ aspectRatio: '16/9', minHeight: '200px' }}>
          {project.previewImage && (project.previewImage === realdeskVideo || (typeof project.previewImage === 'string' && project.previewImage.includes('.mp4'))) ? (
            <video 
              src={project.previewImage}
              alt={`${project.title} preview`}
              className="w-full h-full object-contain rounded-lg"
              autoPlay
              loop
              muted
              playsInline
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.parentElement.querySelector('.fallback-animation');
                if (fallback) {
                  fallback.style.display = 'flex';
                  fallback.style.alignItems = 'center';
                  fallback.style.justifyContent = 'center';
                }
              }}
            />
          ) : (
            <img 
              src={project.previewImage} 
              alt={`${project.title} preview`}
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.parentElement.querySelector('.fallback-animation');
                if (fallback) {
                  fallback.style.display = 'flex';
                  fallback.style.alignItems = 'center';
                  fallback.style.justifyContent = 'center';
                }
              }}
            />
          )}
          
          {/* Fallback Animation - Hidden by default */}
          <div className="fallback-animation w-full h-full items-center justify-center absolute inset-0 z-0 hidden" style={{ display: 'none' }}>
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div className="w-8 h-8 border-2 border-cyan-400/50 border-t-cyan-400 rounded-full"></div>
            </motion.div>
          </div>
        </div>

        {/* Compact Description Card for Mobile */}
        <div className="px-2 space-y-3">
          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {project.description}
          </p>
          
          {/* Key Highlights - Compact */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-2">
              {project.highlights.slice(0, 2).map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div 
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                    style={{ background: project.gradient }}
                  />
                  <span className="text-white text-xs leading-relaxed">{highlight}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tech Stack - Compact Scrollable */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tech.slice(0, 6).map((tech) => (
              <div 
                key={tech}
                className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md border border-white/10 text-white text-[10px] font-medium"
              >
                <div className="flex-shrink-0 text-white">
                  {getTechIcon(tech)}
                </div>
                <span className="whitespace-nowrap">{tech}</span>
              </div>
            ))}
            {project.tech.length > 6 && (
              <div className="flex items-center px-2 py-1 bg-white/5 rounded-md border border-white/10 text-gray-400 text-[10px]">
                +{project.tech.length - 6}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop View - Full Card Design */}
      <div 
        className="hidden lg:flex w-full h-[32rem] rounded-2xl border border-white/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex-col bg-black/60"
      >
        {/* Website Logo & Title Section - Top */}
        <div 
          className="relative z-10 backdrop-blur-sm border-b border-white/20 p-4 flex-shrink-0 bg-black/60"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-black/60 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {project.logo ? (
                  <img 
                    src={project.logo} 
                    alt={`${project.title} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-white text-lg font-bold">{project.title.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-white text-lg font-semibold truncate mb-1">{project.title}</h4>
                <p className="text-gray-400 text-sm break-words leading-tight" style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  maxHeight: '2.5rem'
                }}>{project.subtitle}</p>
              </div>
            </div>
            
            {/* External Link Button - Top Right */}
            {project.liveUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
                }}
                className="group flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 flex-shrink-0"
                title={`Visit ${project.title}`}
              >
                <HiArrowUpRight className="w-4 h-4 text-white/80 group-hover:text-white transition-colors duration-300" />
              </button>
            )}
          </div>
        </div>
        
        {/* Preview Content Area - Full Space */}
        <div className="flex-1 relative overflow-hidden bg-black/60">
          {/* Website Preview Content - GIF/Video with Fallback Animation */}
          <div className="h-full w-full bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 p-4 relative overflow-hidden preview-scale">
            {/* Live Preview Badge */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-green-500/20 via-emerald-500/25 to-green-500/20 backdrop-blur-md rounded-full border border-green-400/50 shadow-lg shadow-green-500/20">
              <div className="relative">
                <div className="w-1.5 h-1.5 bg-gradient-to-br from-green-400 to-emerald-300 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                <div className="absolute inset-0 w-1.5 h-1.5 bg-green-400/60 rounded-full animate-ping"></div>
              </div>
              <span className="text-white text-[10px] font-semibold tracking-wide">Live</span>
            </div>
            
            {/* Real Website Preview GIF/Video - Responsive Container */}
            <div className="w-full h-full flex items-center justify-center relative">
              {project.previewImage && (project.previewImage === realdeskVideo || (typeof project.previewImage === 'string' && project.previewImage.includes('.mp4'))) ? (
                <div className="w-full h-full relative flex items-center justify-center">
                  <video 
                    src={project.previewImage}
                    alt={`${project.title} preview`}
                    className="w-full h-full object-contain rounded-lg shadow-lg relative z-10"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.parentElement.querySelector('.fallback-animation');
                      if (fallback) {
                        fallback.style.display = 'flex';
                        fallback.style.alignItems = 'center';
                        fallback.style.justifyContent = 'center';
                      }
                    }}
                  />
                </div>
              ) : (
                <img 
                  src={project.previewImage} 
                  alt={`${project.title} preview`}
                  className="w-full h-full object-contain rounded-lg shadow-lg relative z-10"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.parentElement.querySelector('.fallback-animation');
                    if (fallback) {
                      fallback.style.display = 'flex';
                      fallback.style.alignItems = 'center';
                      fallback.style.justifyContent = 'center';
                    }
                  }}
                />
              )}
            
            {/* Fallback Animation - Hidden by default, shown only on error */}
            <div className="fallback-animation w-full h-full items-center justify-center absolute inset-0 z-0 hidden" style={{ display: 'none' }}>
              {/* Animated Website Elements */}
              <motion.div
                className="absolute top-4 left-4 w-16 h-2 bg-cyan-400/60 rounded"
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute top-4 right-4 w-12 h-2 bg-blue-400/60 rounded"
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              <motion.div
                className="absolute top-12 left-4 w-20 h-1 bg-purple-400/60 rounded"
                animate={{ 
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.9, 1.1, 0.9]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              <motion.div
                className="absolute top-16 right-4 w-8 h-1 bg-green-400/60 rounded"
                animate={{ 
                  opacity: [0.4, 0.9, 0.4],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ 
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              />
              
              {/* Interactive Elements */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                <motion.div
                  className="w-8 h-6 bg-cyan-500/30 rounded border border-cyan-400/50"
                  animate={{ 
                    boxShadow: ["0 0 0px rgba(6, 182, 212, 0)", "0 0 10px rgba(6, 182, 212, 0.3)", "0 0 0px rgba(6, 182, 212, 0)"]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="w-12 h-6 bg-blue-500/30 rounded border border-blue-400/50"
                  animate={{ 
                    boxShadow: ["0 0 0px rgba(59, 130, 246, 0)", "0 0 10px rgba(59, 130, 246, 0.3)", "0 0 0px rgba(59, 130, 246, 0)"]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <motion.div
                  className="w-6 h-6 bg-purple-500/30 rounded border border-purple-400/50"
                  animate={{ 
                    boxShadow: ["0 0 0px rgba(147, 51, 234, 0)", "0 0 10px rgba(147, 51, 234, 0.3)", "0 0 0px rgba(147, 51, 234, 0)"]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </div>
              
              {/* Loading Animation */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="w-8 h-8 border-2 border-cyan-400/50 border-t-cyan-400 rounded-full"></div>
              </motion.div>
            </div>
          </div>
          
            {/* Overlay for realistic browser feel */}
            <div className="absolute inset-0 bg-black/60 "></div>
          </div>
        </div>
      </div>
    </>
  );
};

const AllProjects = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Scroll to top when component mounts and ensure it stays at top
  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Also use scrollIntoView as backup after a short delay
    const timer1 = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);

    // Additional check after component fully renders
    const timer2 = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 second loading simulation

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SEO 
        title="All Projects - Vishesh Rajput | Full-Stack Developer Portfolio"
        description="Explore all projects by Vishesh Rajput - Software Engineer. View RealDesk, DevSync, Vishti Shop and more innovative full-stack web applications built with React, Node.js, TypeScript, and modern technologies."
        keywords="Vishesh Rajput projects, Vishesh Rajput portfolio projects, RealDesk, DevSync, Vishti Shop, full-stack projects, React projects, web development projects"
      />
      <style>{cardStyles}</style>
      <div className="min-h-screen bg-black text-white relative overflow-x-hidden" style={{ scrollBehavior: 'smooth' }}>
        <section id="all-projects" className="pt-24 pb-32 bg-[rgba(0,0,0,0.3)] relative overflow-hidden">
          {/* Premium Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-blue-500/5" />
          
          {/* Animated Background Orbs */}
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          <div className="container mx-auto px-6 relative z-10">
            {/* Premium Section Header - Visible immediately */}
            <motion.div 
              className="text-center mb-20 pt-8"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.h2 
                className="text-6xl font-bold text-white mb-6 tracking-tight"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                All <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">Projects</span>
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              >
                A complete collection of my work — where ideas meet execution, and pixels learn some manners.
              </motion.p>
            </motion.div>

            {/* Direct Layout - No Card Container */}
            <div className="space-y-16 lg:space-y-32">
              {isLoading ? (
                // Loading State - Show Skeleton Screens
                Array.from({ length: projectsData.length }).map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[24rem] lg:min-h-[32rem]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* Skeleton Preview Card */}
                    <div className="w-full lg:w-[65%] lg:pl-[90px] px-4 lg:px-0">
                      <div className="p-[10px] bg-black rounded-3xl border border-white/20">
                        <SkeletonPreviewCard />
                      </div>
                    </div>
                    
                    {/* Skeleton Project Details */}
                    <div className="w-full lg:w-[40%] flex flex-col pt-5 pr-4 lg:pr-8 px-4 lg:px-0">
                      <SkeletonProjectDetails />
                    </div>
                  </motion.div>
                ))
              ) : (
                // Loaded State - Show Actual Projects
                projectsData.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[24rem] lg:min-h-[32rem] cursor-pointer group"
                    onClick={() => navigate(`/project/${project.id}`)}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: "easeOut"
                      }
                    }}
                    viewport={{ once: true, margin: "-100px" }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Large Preview Card - Left Side (65% width, left positioned) */}
                    <div className="w-full lg:w-[65%] lg:pl-[90px] px-4 lg:px-0">
                      {/* Beautiful Wrapper Card */}
                      <div className={`p-[10px] bg-black/60 rounded-3xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 backdrop-blur-sm ${
                        project.id === 1 ? 'gradient-glow' :
                        project.id === 2 ? 'gradient-glow glow-emerald' :
                        project.id === 3 ? 'gradient-glow glow-sunset' :
                        project.id === 4 ? 'gradient-glow glow-breeze' :
                        'gradient-glow'
                      }`}>
                        <PreviewCard project={project} />
                      </div>
                    </div>
                    
                    {/* Project Details - Right Side (40% width) - Hidden on mobile, shown on desktop */}
                    <div className="hidden lg:flex w-full lg:w-[40%] flex-col pt-5 pr-4 lg:pr-8 px-4 lg:px-0">
                      {/* Project Title with Gradient Dash */}
                      <div className="flex items-center gap-3 mb-4">
                        <div 
                          className="w-6 lg:w-8 h-0.5 rounded-full flex-shrink-0"
                          style={{ background: project.gradient }}
                        ></div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                          {project.title}
                        </h3>
                      </div>
                      
                      {/* Project Description */}
                      <p className="text-gray-300 text-sm lg:text-base mb-6 leading-relaxed ml-8 lg:ml-11">
                        {project.description}
                      </p>
                      
                      {/* Three Highlight Points */}
                      <div className="mb-8 ml-8 lg:ml-11">
                        <div className="space-y-3">
                          {project.highlights.slice(0, 3).map((highlight, highlightIndex) => (
                            <div key={highlightIndex} className="flex items-center gap-3">
                              <div 
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ background: project.gradient }}
                              ></div>
                              <span className="text-white text-xs lg:text-sm font-medium">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stack - Rectangular Boxes */}
                      <div className="mb-8 ml-8 lg:ml-11">
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech, techIndex) => (
                            <div 
                              key={tech}
                              className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1.5 lg:py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 w-fit hover:scale-105"
                            >
                              <div className="flex-shrink-0 text-white">
                                {getTechIcon(tech)}
                              </div>
                              <span className="text-white text-xs font-medium whitespace-nowrap">{tech}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Back to Home Button */}
            {!isLoading && (
              <motion.div 
                className="flex justify-center mt-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => {
                    navigate('/');
                    // Scroll to hero section after navigation - using multiple attempts to ensure it works
                    const scrollToHero = () => {
                      const heroSection = document.getElementById('hero');
                      if (heroSection) {
                        heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        return true;
                      }
                      return false;
                    };
                    
                    // Try immediately
                    requestAnimationFrame(() => {
                      if (!scrollToHero()) {
                        // Try after a short delay
                        setTimeout(() => {
                          if (!scrollToHero()) {
                            // Final fallback: scroll to top
                            setTimeout(() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 200);
                          }
                        }, 150);
                      }
                    });
                  }}
                  className="group flex items-center gap-3 px-8 py-4 bg-black border border-white/20 rounded-2xl text-white font-semibold text-base transition-all duration-300 hover:bg-black/80 hover:border-white/30 hover:shadow-lg hover:shadow-white/10 hover:scale-105 active:scale-95"
                >
                  <HiHome className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Back to Home</span>
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default AllProjects;
