import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import DomeGallery from "./ui/DomeGallery";
import BgParticles from "./bgparticle";
import { FaGithub } from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import realdeskImage1 from "../assets/domeimages/realdesk/1.png";
import realdeskImage2 from "../assets/domeimages/realdesk/2.png";
import realdeskImage3 from "../assets/domeimages/realdesk/3.png";
import realdeskImage4 from "../assets/domeimages/realdesk/4.png";
import realdeskImage5 from "../assets/domeimages/realdesk/5.png";
import realdeskImage6 from "../assets/domeimages/realdesk/6.png";
import realdeskImage7 from "../assets/domeimages/realdesk/7.png";
import realdeskImage8 from "../assets/domeimages/realdesk/8.png";
import realdeskImage9 from "../assets/domeimages/realdesk/9.png";
import devsyncImage1 from "../assets/domeimages/devsync/1.png";
import devsyncImage2 from "../assets/domeimages/devsync/2.png";
import devsyncImage3 from "../assets/domeimages/devsync/3.png";
import devsyncImage4 from "../assets/domeimages/devsync/4.png";
import devsyncImage5 from "../assets/domeimages/devsync/5.png";
import devsyncImage6 from "../assets/domeimages/devsync/6.png";
import devsyncImage7 from "../assets/domeimages/devsync/7.png";
import devsyncImage8 from "../assets/domeimages/devsync/8.png";
import devsyncImage9 from "../assets/domeimages/devsync/9.png";

import vishtiShopImage1 from "../assets/domeimages/vishtishop/1.png";
import vishtiShopImage2 from "../assets/domeimages/vishtishop/2.png";
import vishtiShopImage3 from "../assets/domeimages/vishtishop/3.png";
import vishtiShopImage4 from "../assets/domeimages/vishtishop/4.png";
import vishtiShopImage5 from "../assets/domeimages/vishtishop/5.png";
import vishtiShopImage6 from "../assets/domeimages/vishtishop/6.png";
import vishtiShopImage7 from "../assets/domeimages/vishtishop/7.png";
import vishtiShopImage8 from "../assets/domeimages/vishtishop/8.png";
import vishtiShopImage9 from "../assets/domeimages/vishtishop/9.png";
import vishtiShopImage10 from "../assets/domeimages/vishtishop/10.png";
import vishtiShopImage11 from "../assets/domeimages/vishtishop/11.png";
import vishtiShopImage12 from "../assets/domeimages/vishtishop/12.png";
import vishtiShopImage13 from "../assets/domeimages/vishtishop/13.png";
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
} from "react-icons/si";

// Project data with additional fields for challenges and outcome
const projectsData = [
  {
    id: 1,
    title: "RealDesk",
    subtitle: "A Developer Internship Simulator",
    description: "Experience the life of a professional developer through realistic simulations — from debugging and client interactions to task deadlines and performance reviews.",
    overview: "RealDesk is an interactive developer internship simulator designed to bridge the gap between theory and industry practice. It replicates the real-life experience of working in a tech company, where users receive realistic tasks, bug reports, deadlines, and client messages. The platform integrates a professional-grade in-browser code editor with multi-file support, syntax highlighting, and AI-powered feedback, allowing developers to learn through hands-on experience.",
    tech: ["React", "Vite", "TypeScript", "Tailwind", "shadcn/ui", "Monaco", "Firebase", "Gemini API"],
    category: "Full-Stack",
    liveUrl: "https://realdesk.vercel.app/",
    githubUrl: "https://github.com/VisheshRajput-dev/real-desk",
    highlights: [
      "Integrated Monaco Editor with multi-file and syntax support",
      "AI-assisted code evaluation combining static and contextual checks",
      "Gamified XP and ranking system for engagement and progression"
    ],
    challenges: [
      "Implementing real-time code evaluation using hybrid static and AI review models",
      "Designing a modular workspace simulation with realistic task scenarios",
      "Building a reward-driven experience system that adapts to user progress dynamically"
    ],
    outcome: "Launched a fully functional developer simulator that blends learning with real-world practice. RealDesk helps developers gain experience in a controlled yet authentic environment through project-based simulations and AI-guided feedback.",
    galleryImages: [
      realdeskImage1,
      realdeskImage2,
      realdeskImage3,
      realdeskImage4,
      realdeskImage5,
      realdeskImage6,
      realdeskImage7,
      realdeskImage8,
      realdeskImage9
    ],
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    gradientName: "Royal Purple",
    accentColor: "violet"
  },
  {
    id: 2,
    title: "DevSync",
    subtitle: "Team Collaboration & Project Sync Platform",
    description: "A modern developer collaboration platform that syncs teams, tasks, and codebases — bringing seamless workflow to distributed projects.",
    overview: "DevSync streamlines software team collaboration by integrating real-time communication, version tracking, and task management into a single platform. It offers developers an intuitive dashboard to manage commits, issues, and updates with GitHub synchronization and live activity tracking. Designed for modern teams, DevSync fosters a transparent and efficient workflow from idea to deployment.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Socket.io", "Tailwind", "Firebase Auth"],
    category: "MERN Stack",
    liveUrl: "https://devsync.vercel.app/",
    githubUrl: "https://github.com/VisheshRajput-dev/devsync",
    highlights: [
      "Real-time team communication and activity updates using WebSockets",
      "GitHub integration for commit and branch synchronization",
      "Kanban-style task management system for agile development teams"
    ],
    challenges: [
      "Integrating real-time data synchronization with Socket.io",
      "Designing an efficient project-state architecture supporting multiple teams",
      "Building secure role-based access and user authentication flows"
    ],
    outcome: "Delivered a functional developer collaboration platform that enables real-time teamwork and project visibility. DevSync enhances productivity and coordination among remote software teams by syncing tasks, discussions, and commits into a unified space.",
    galleryImages:  [
      devsyncImage1,
      devsyncImage2,
      devsyncImage3,
      devsyncImage4,
      devsyncImage5,
      devsyncImage6,
      devsyncImage7,
      devsyncImage8,
      devsyncImage9
    ],
    gradient: "linear-gradient(135deg, #0F3443 0%, #34E89E 50%, #12C2E9 100%)",
    gradientName: "Tech Emerald",
    accentColor: "cyan"
  },
  {
    id: 3,
    title: "Vishti Shop",
    subtitle: "Modern E-Commerce Platform",
    description: "A fast, scalable, and beautifully designed online store offering a seamless shopping experience with integrated payments and admin management.",
    overview: "Vishti Shop is a full-featured e-commerce web application built to provide users with a clean, responsive, and high-performance shopping experience. It includes essential features like product browsing, cart management, secure payments, and a powerful admin panel for managing products, orders, and users. The platform prioritizes both usability and aesthetics with smooth UI interactions and efficient backend APIs.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Razorpay", "Tailwind", "Firebase Auth"],
    category: "E-Commerce",
    liveUrl: "https://vishti-shop.vercel.app/",
    githubUrl: "https://github.com/VisheshRajput-dev/vishti-shop",
    highlights: [
      "Dynamic product catalog with category-based filtering",
      "Secure payment gateway integration using Razorpay API",
      "Admin dashboard for real-time order and inventory management"
    ],
    challenges: [
      "Implementing secure and reliable payment handling with Razorpay",
      "Designing a scalable architecture supporting admin, user, and guest roles",
      "Optimizing product queries for performance and quick search results"
    ],
    outcome: "Successfully developed and deployed a modern e-commerce solution that offers both a delightful user experience and robust administrative control. Vishti Shop demonstrates scalable architecture and real-world business readiness.",
    galleryImages: [
      vishtiShopImage1,
      vishtiShopImage2,
      vishtiShopImage3,
      vishtiShopImage4,
      vishtiShopImage5,
      vishtiShopImage6,
      vishtiShopImage7,
      vishtiShopImage8,
      vishtiShopImage9,
      vishtiShopImage10,
      vishtiShopImage11,
      vishtiShopImage12,
      vishtiShopImage13
    ],
    gradient: "linear-gradient(135deg, #FFD3A5 0%, #FD6585 50%, #F64F59 100%)",
    gradientName: "Warm Sunset",
    accentColor: "emerald"
  }
];

// Tech stack icon mapping
const getTechIcon = (tech) => {
  const iconMap = {
    'React': SiReact,
    'Next.js': SiNextdotjs,
    'TypeScript': SiTypescript,
    'Node.js': SiNodedotjs,
    'node.js': SiNodedotjs,
    'MongoDB': SiMongodb,
    'Stripe': SiStripe,
    'Redis': SiRedis,
    'Python': SiPython,
    'python': SiPython,
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
    'OpenAI API': SiOpenai,
    'WebRTC': SiWebrtc,
    'Framer Motion': SiFramer,
    'javascript': null,
    'socket.io': null,
    'express': null,
    'cors': null,
    'Monaco': null,
    'Gemini': null,
    'cloudinary': null,
    'Razorpay': null,
    'Tailwind': null,
    'shadcn/ui': null,
    'Vite': null
  };
  
  const IconComponent = iconMap[tech];
  return IconComponent ? <IconComponent className="w-5 h-5" /> : tech.charAt(0).toUpperCase();
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGalleryReady, setIsGalleryReady] = useState(false);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const foundProject = projectsData.find(p => p.id === parseInt(id));
    setProject(foundProject);
    setTimeout(() => {
      setIsLoading(false);
      // Wait a bit more for DOM to be ready before showing gallery
      setTimeout(() => {
        setIsGalleryReady(true);
      }, 100);
    }, 300);
  }, [id]);

  // Track screen width for responsive gallery
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add close button functionality for full-screen images
  useEffect(() => {
    const addCloseButton = () => {
      const enlarge = document.querySelector('.sphere-root .enlarge');
      if (enlarge && !enlarge.querySelector('.close-icon-btn')) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-icon-btn';
        closeBtn.innerHTML = '✕';
        closeBtn.setAttribute('aria-label', 'Close image');
        closeBtn.onclick = (e) => {
          e.stopPropagation();
          const scrim = document.querySelector('.sphere-root[data-enlarging="true"] .scrim');
          if (scrim) {
            scrim.click();
          }
        };
        enlarge.appendChild(closeBtn);
      }
    };

    const observer = new MutationObserver(() => {
      addCloseButton();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial check
    addCloseButton();

    return () => {
      observer.disconnect();
    };
  }, []);

  // Auto-rotation animation (left swipe)
  useEffect(() => {
    // Only run if project exists and component is mounted
    if (!project) return;

    let autoRotateRAF = null;
    let isHovered = false;
    let isDragging = false;
    let lastTransformSnapshot = '';
    let transformChangeTime = 0;
    let lastFrameTime = 0;
    let isMounted = true;
    // 0.8 degrees per second = 0.8/60 = ~0.0133 degrees per frame (at 60fps)
    // But we'll calculate based on actual frame time for precision
    const autoRotationSpeedPerSecond = 0.8; // degrees per second
    const INERTIA_CHECK_DELAY = 1200; // ms to wait after interaction ends before checking
    const TRANSFORM_STABLE_TIME = 600; // ms of no transform changes before resuming

    const getSphereElement = () => {
      if (!isMounted) return null;
      return document.querySelector('.sphere-root .sphere');
    };

    const getSphereRoot = () => {
      if (!isMounted) return null;
      return document.querySelector('.sphere-root');
    };

    const shouldResume = () => {
      const sphereRoot = getSphereRoot();
      return !isHovered && !isDragging && 
             sphereRoot && !sphereRoot.hasAttribute('data-enlarging');
    };

    const updateAndRotate = (currentTime) => {
      if (!isMounted) {
        if (autoRotateRAF) {
          cancelAnimationFrame(autoRotateRAF);
          autoRotateRAF = null;
        }
        return;
      }

      const sphere = getSphereElement();
      const sphereRoot = getSphereRoot();
      if (!sphere || !sphereRoot) {
        if (autoRotateRAF) {
          cancelAnimationFrame(autoRotateRAF);
          autoRotateRAF = null;
        }
        return;
      }

      // Check if image is enlarged
      const hasEnlarge = sphereRoot.hasAttribute('data-enlarging');
      if (hasEnlarge) {
        autoRotateRAF = requestAnimationFrame(updateAndRotate);
        return;
      }

      // Get current rotation
      const currentTransform = sphere.style.transform || '';
      const yMatch = currentTransform.match(/rotateY\(([^)]+)\)/);
      const xMatch = currentTransform.match(/rotateX\(([^)]+)\)/);
      
      let currentY = yMatch ? parseFloat(yMatch[1]) : 0;
      const currentX = xMatch ? parseFloat(xMatch[1]) : 0;

      // Calculate frame delta for smooth rotation
      const frameDelta = lastFrameTime > 0 ? (currentTime - lastFrameTime) / 1000 : 0.016; // Default to ~60fps
      lastFrameTime = currentTime;

      // Check if transform changed externally (user interaction or inertia)
      if (currentTransform !== lastTransformSnapshot && !isDragging) {
        // Transform changed, likely from user interaction or inertia
        lastTransformSnapshot = currentTransform;
        transformChangeTime = Date.now();
        autoRotateRAF = requestAnimationFrame(updateAndRotate);
        return; // Don't auto-rotate this frame, let inertia complete
      }

      // Apply auto-rotation (left swipe = negative Y rotation)
      if (!isHovered && !isDragging && !hasEnlarge) {
        const timeSinceLastChange = Date.now() - transformChangeTime;
        
        // Only auto-rotate if transform has been stable (inertia has stopped)
        if (timeSinceLastChange > TRANSFORM_STABLE_TIME) {
          const rotationDelta = autoRotationSpeedPerSecond * frameDelta;
          currentY = (currentY - rotationDelta) % 360;
          const newTransform = `translateZ(calc(var(--radius) * -1)) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
          sphere.style.transform = newTransform;
          lastTransformSnapshot = newTransform;
        }
      }

      autoRotateRAF = requestAnimationFrame(updateAndRotate);
    };

    const startAutoRotate = () => {
      if (!autoRotateRAF && shouldResume()) {
        const sphere = getSphereElement();
        if (sphere) {
          lastTransformSnapshot = sphere.style.transform || '';
          transformChangeTime = Date.now();
          lastFrameTime = 0; // Reset frame time
        }
        autoRotateRAF = requestAnimationFrame(updateAndRotate);
      }
    };

    const stopAutoRotate = () => {
      if (autoRotateRAF) {
        cancelAnimationFrame(autoRotateRAF);
        autoRotateRAF = null;
        lastFrameTime = 0;
      }
    };

    // Track dragging state
    const handlePointerDown = () => {
      isDragging = true;
      stopAutoRotate();
      const sphere = getSphereElement();
      if (sphere) {
        lastTransformSnapshot = sphere.style.transform || '';
        transformChangeTime = Date.now();
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
      // Wait for inertia to complete before resuming
      setTimeout(() => {
        if (shouldResume()) {
          const sphere = getSphereElement();
          if (sphere) {
            lastTransformSnapshot = sphere.style.transform || '';
            transformChangeTime = Date.now();
          }
          startAutoRotate();
        }
      }, INERTIA_CHECK_DELAY);
    };

    // Hover events
    const handleMouseEnter = () => {
      isHovered = true;
      stopAutoRotate();
    };

    const handleMouseLeave = () => {
      isHovered = false;
      if (shouldResume()) {
        setTimeout(() => {
          if (shouldResume()) {
            startAutoRotate();
          }
        }, 500);
      }
    };

    // Monitor for enlarged image state changes (when user closes gallery)
    const monitorEnlargeState = () => {
      const sphereRoot = getSphereRoot();
      if (!sphereRoot) return;

      const hasEnlarge = sphereRoot.hasAttribute('data-enlarging');
      
      if (!hasEnlarge && !autoRotateRAF && shouldResume()) {
        // Image was closed, resume auto-rotation
        setTimeout(() => {
          if (shouldResume()) {
            const sphere = getSphereElement();
            if (sphere) {
              lastTransformSnapshot = sphere.style.transform || '';
              transformChangeTime = Date.now();
            }
            startAutoRotate();
          }
        }, 300);
      }
    };

    // Monitor sphere element creation and enlarged state changes
    const observer = new MutationObserver(() => {
      monitorEnlargeState();
      const sphere = getSphereElement();
      const sphereRoot = getSphereRoot();
      if (sphere && sphereRoot && !autoRotateRAF && shouldResume()) {
        setTimeout(() => startAutoRotate(), 1000);
      }
    });

    // Setup event listeners
    const sphereRoot = getSphereRoot();
    if (sphereRoot) {
      sphereRoot.addEventListener('mouseenter', handleMouseEnter);
      sphereRoot.addEventListener('mouseleave', handleMouseLeave);
      sphereRoot.addEventListener('pointerdown', handlePointerDown);
      sphereRoot.addEventListener('pointerup', handlePointerUp);
      sphereRoot.addEventListener('pointercancel', handlePointerUp);
      // Touch events for mobile
      sphereRoot.addEventListener('touchstart', handlePointerDown);
      sphereRoot.addEventListener('touchend', handlePointerUp);
    }

    // Monitor enlarged state with interval check
    const enlargeCheckInterval = setInterval(() => {
      monitorEnlargeState();
    }, 200);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Observe sphere-root for attribute changes (data-enlarging)
    let attributeObserver = null;
    if (sphereRoot) {
      attributeObserver = new MutationObserver(() => {
        monitorEnlargeState();
      });
      attributeObserver.observe(sphereRoot, {
        attributes: true,
        attributeFilter: ['data-enlarging']
      });
    }

    // Initial start
    setTimeout(() => {
      if (getSphereElement() && shouldResume()) {
        startAutoRotate();
      }
    }, 1000);

    return () => {
      isMounted = false;
      stopAutoRotate();
      observer.disconnect();
      if (attributeObserver) attributeObserver.disconnect();
      clearInterval(enlargeCheckInterval);
      const cleanupRoot = document.querySelector('.sphere-root');
      if (cleanupRoot) {
        cleanupRoot.removeEventListener('mouseenter', handleMouseEnter);
        cleanupRoot.removeEventListener('mouseleave', handleMouseLeave);
        cleanupRoot.removeEventListener('pointerdown', handlePointerDown);
        cleanupRoot.removeEventListener('pointerup', handlePointerUp);
        cleanupRoot.removeEventListener('pointercancel', handlePointerUp);
        cleanupRoot.removeEventListener('touchstart', handlePointerDown);
        cleanupRoot.removeEventListener('touchend', handlePointerUp);
      }
    };
  }, [project]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-cyan-500/20 border border-cyan-500/30 rounded-full hover:bg-cyan-500/30 transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Prepare images for DomeGallery
  const galleryImages = project.galleryImages || [project.previewImage];

  return (
    <div className="min-h-screen bg-transparent text-white relative overflow-x-hidden">
      {/* Particle Background */}
      <BgParticles />

      {/* Main Content */}
      <section className="relative z-10 pt-8 pb-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Top Section - Back Button, Title, Subtitle */}
          <div className="mb-12 relative">
            {/* Action Buttons - Top Right - Responsive */}
            <div className="absolute top-0 right-0 flex items-center gap-2 sm:gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-110 hover:shadow-lg hover:shadow-white/10"
                  title="View on GitHub"
                >
                  <FaGithub className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-all duration-300 group-hover:rotate-12" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105 hover:shadow-lg hover:shadow-white/10"
                >
                  <span className="text-[10px] sm:text-xs font-medium tracking-wide uppercase text-gray-400 group-hover:text-white transition-colors duration-300 whitespace-nowrap">
                    <span className="hidden sm:inline">Check it out</span>
                    <span className="sm:hidden">Check</span>
                  </span>
                  <HiArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 flex-shrink-0" />
                </a>
              )}
            </div>

            {/* Back Button - Top Left */}
            <button
              onClick={() => navigate('/')}
              className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group pr-20 sm:pr-0"
            >
              <div className="w-6 h-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                <svg
                  className="w-3 h-3 transform group-hover:-translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium tracking-wide uppercase">Back to Projects</span>
            </button>

            {/* Project Title - Responsive with padding for buttons */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-2 leading-[1.2] tracking-wide text-white/95 pr-20 sm:pr-0">
              {project.title}
            </h1>

            {/* Project Subtitle - Responsive */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-400/80 font-light leading-relaxed max-w-4xl tracking-wide pr-20 sm:pr-0">
              {project.subtitle}
            </p>
          </div>

          {/* DomeGallery - Responsive for Mobile */}
          {isGalleryReady && (
            <div className="mb-12 sm:mb-16 lg:mb-24 w-full bg-transparent" style={{ 
              minHeight: screenWidth < 640 ? '300px' : screenWidth < 1024 ? '450px' : '600px', 
              height: screenWidth < 640 ? '40vh' : screenWidth < 1024 ? '55vh' : '70vh' 
            }}>
              <style>{`
                .sphere-root .stage {
                  background-color: transparent !important;
                }
                .sphere-root [style*="radial-gradient"] {
                  opacity: 0 !important;
                  display: none !important;
                }
                .sphere-root [style*="linear-gradient"] {
                  opacity: 0 !important;
                  display: none !important;
                }
                .sphere-root .item__image img {
                  object-fit: cover !important;
                  object-position: center !important;
                  width: 100% !important;
                  height: 100% !important;
                }
                .sphere-root .item__image {
                  background-color: #000;
                }
                .sphere-root .enlarge {
                  position: fixed !important;
                  left: 50% !important;
                  top: 50% !important;
                  transform: translate(-50%, -50%) !important;
                  width: 90vw !important;
                  height: 90vh !important;
                  max-width: 1200px !important;
                  max-height: 900px !important;
                  z-index: 9999 !important;
                  display: flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                  border-radius: 16px !important;
                  overflow: hidden !important;
                  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
                }
                @media (min-width: 640px) {
                  .sphere-root .enlarge {
                    width: 85vw !important;
                    height: 85vh !important;
                  }
                }
                .sphere-root .enlarge img {
                  object-fit: contain !important;
                  object-position: center !important;
                  width: 100% !important;
                  height: 100% !important;
                  max-width: 100% !important;
                  max-height: 100% !important;
                  background-color: rgba(0, 0, 0, 0.9) !important;
                  border-radius: 16px !important;
                }
                .sphere-root[data-enlarging="true"] .scrim {
                  position: fixed !important;
                  inset: 0 !important;
                  width: 100vw !important;
                  height: 100vh !important;
                  z-index: 9998 !important;
                  background-color: rgba(0, 0, 0, 0.7) !important;
                  backdrop-filter: blur(20px) !important;
                  -webkit-backdrop-filter: blur(20px) !important;
                }
                .sphere-root .close-icon-btn {
                  position: absolute;
                  top: 20px;
                  right: 20px;
                  width: 48px;
                  height: 48px;
                  background-color: rgba(0, 0, 0, 0.7);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 24px;
                  font-weight: bold;
                  cursor: pointer;
                  z-index: 10000;
                  transition: all 0.3s ease;
                  backdrop-filter: blur(10px);
                  border: 2px solid rgba(255, 255, 255, 0.2);
                  padding: 0;
                  margin: 0;
                }
                .sphere-root .close-icon-btn:hover {
                  background-color: rgba(255, 255, 255, 0.2);
                  transform: scale(1.1);
                  border-color: rgba(255, 255, 255, 0.4);
                }
                /* Mobile responsive close button */
                @media (max-width: 639px) {
                  .sphere-root .close-icon-btn {
                    top: 10px;
                    right: 10px;
                    width: 40px;
                    height: 40px;
                    font-size: 20px;
                  }
                }
                /* Mobile scroll fix - allow vertical scrolling */
                @media (max-width: 1023px) {
                  .sphere-root main {
                    touch-action: pan-y !important;
                    overflow-y: auto !important;
                    -webkit-overflow-scrolling: touch !important;
                  }
                  .sphere-root .stage {
                    touch-action: pan-y !important;
                  }
                  .sphere-root .sphere {
                    touch-action: pan-y !important;
                  }
                  /* Only prevent default on horizontal drag, allow vertical scroll */
                  body.dg-scroll-lock {
                    overflow: hidden !important;
                    position: fixed !important;
                    width: 100% !important;
                  }
                }
                /* Ensure page can scroll on mobile when gallery is not being interacted with */
                @media (max-width: 1023px) {
                  html {
                    -webkit-overflow-scrolling: touch !important;
                  }
                }
              `}</style>
              <DomeGallery 
                images={galleryImages}
                fit={screenWidth < 640 ? 0.35 : screenWidth < 1024 ? 0.4 : 0.5}
                minRadius={screenWidth < 640 ? 180 : screenWidth < 1024 ? 240 : 300}
                maxVerticalRotationDeg={2}
                segments={screenWidth < 640 ? 16 : screenWidth < 1024 ? 20 : 22}
                overlayBlurColor="#060010"
                grayscale={true}
                openedImageWidth={screenWidth < 640 ? "90vw" : "85vw"}
                openedImageHeight={screenWidth < 640 ? "90vh" : "85vh"}
              />
            </div>
          )}

          {/* Content Sections - Responsive Spacing */}
          <div className="space-y-12 sm:space-y-16 lg:space-y-24">
            {/* Overview Section */}
            <section>
              <div className="max-w-4xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-6 sm:mb-8 leading-[1.2] tracking-wide text-white/95">
                  Overview
                </h2>
                <p className="text-sm sm:text-base lg:text-base text-gray-300/90 leading-relaxed font-light tracking-wide">
                  {project.overview || project.description}
                </p>
              </div>
            </section>

            {/* Key Features Section */}
            <section>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-8 sm:mb-10 leading-[1.2] tracking-wide text-white/95">
                Key Features
              </h2>
              <div className="max-w-5xl">
                <div className="space-y-4 sm:space-y-6">
                  {project.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <span 
                          className="text-sm font-medium"
                          style={{ 
                            background: project.gradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >
                          &gt;
                        </span>
                      </div>
                      <p className="text-sm lg:text-base text-white/90 font-light leading-relaxed tracking-wide flex-1">
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Tech Stack Section */}
            <section>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-8 sm:mb-10 leading-[1.2] tracking-wide text-white/95">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 max-w-5xl">
                {project.tech.map((tech, index) => (
                  <div
                    key={index}
                    className="group relative"
                  >
                    <div className="relative flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 hover:bg-white/10 transition-all duration-300 overflow-hidden">
                      {/* Shiny hover effect */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 tech-shimmer"
                        style={{
                          background: `linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)`
                        }}
                      ></div>
                      
                      {/* Content */}
                      <div className="relative z-10 flex items-center gap-2.5">
                        <div className="text-white/80 group-hover:text-white text-lg transition-colors duration-300">
                          {getTechIcon(tech)}
                        </div>
                        <span className="text-white/80 group-hover:text-white font-light text-sm tracking-wide transition-colors duration-300">
                          {tech}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Shimmer animation */}
              <style>{`
                @keyframes shimmer {
                  0% {
                    transform: translateX(-100%) translateY(-100%) rotate(45deg);
                  }
                  100% {
                    transform: translateX(100%) translateY(100%) rotate(45deg);
                  }
                }
                .tech-shimmer {
                  width: 200%;
                  height: 200%;
                }
                .group:hover .tech-shimmer {
                  animation: shimmer 1s ease-in-out;
                }
              `}</style>
            </section>

            {/* Challenges & Learnings Section */}
            <section>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-8 sm:mb-10 leading-[1.2] tracking-wide text-white/95">
                Challenges & Learnings
              </h2>
              <div className="max-w-5xl">
                <div className="space-y-4 sm:space-y-6">
                  {project.challenges.map((challenge, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <span 
                          className="text-sm font-medium"
                          style={{ 
                            background: project.gradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >
                          &gt;
                        </span>
                      </div>
                      <p className="text-sm lg:text-base text-gray-300/90 leading-relaxed font-light flex-1 tracking-wide">
                        {challenge}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Outcome Section */}
            <section>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-8 sm:mb-10 leading-[1.2] tracking-wide text-white/95">
                Outcome
              </h2>
              <div className="max-w-4xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <span 
                      className="text-sm font-medium"
                      style={{ 
                        background: project.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      &gt;
                    </span>
                  </div>
                  <p className="text-sm lg:text-base text-white/90 leading-relaxed font-light tracking-wide flex-1">
                    {project.outcome}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProjectDetail;
