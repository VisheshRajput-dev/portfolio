import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiMagnifyingGlass, HiXMark, HiHome, HiUser, HiBriefcase, HiDocumentText, HiCodeBracket, HiEnvelope } from "react-icons/hi2";

// Searchable content data - moved outside component
const searchableContent = [
    {
      id: "hero",
      title: "Hero Section",
      content: "Vishesh Rajput Software Engineer Craft Beautiful Intuitive Impactful Modern Digital Experiences React Node.js",
      href: "#hero",
      icon: HiHome,
      category: "Section"
    },
    {
      id: "about",
      title: "About Me",
      content: "I build stuff that works fast Web mobile backend React Node Flutter Firebase MongoDB AI ChatGPT Gemini Copilot Cursor n8n Software Engineer",
      href: "#about",
      icon: HiUser,
      category: "Section"
    },
    {
      id: "experience",
      title: "Experience",
      content: "Professional experience timeline work history companies roles positions career",
      href: "#experience",
      icon: HiBriefcase,
      category: "Section"
    },
    {
      id: "resume",
      title: "Resume",
      content: "Resume download CV skills qualifications education background",
      href: "#resume",
      icon: HiDocumentText,
      category: "Section"
    },
    {
      id: "projects",
      title: "Projects",
      content: "RealDesk DevSync vishti-shop projects portfolio React TypeScript Node.js MongoDB Firebase Full-Stack applications",
      href: "#projects",
      icon: HiCodeBracket,
      category: "Section"
    },
    {
      id: "contact",
      title: "Contact",
      content: "Get in touch email contact form reach out connect",
      href: "#contact",
      icon: HiEnvelope,
      category: "Section"
    },
    {
      id: "realdesk",
      title: "RealDesk",
      content: "Developer internship simulator realistic tasks bug reports deadlines client interactions code editor multi-file support AI review",
      href: "/project/1",
      icon: HiCodeBracket,
      category: "Project"
    },
    {
      id: "devsync",
      title: "DevSync",
      content: "Collaborative platform developers sync code collaborate projects real-time collaboration code syncing multi-file support",
      href: "/project/2",
      icon: HiCodeBracket,
      category: "Project"
    },
    {
      id: "vishti-shop",
      title: "vishti-shop",
      content: "E-commerce platform selling products multi-user login admin dashboard product order management payment integration Razorpay",
      href: "/project/3",
      icon: HiCodeBracket,
      category: "Project"
    }
];

// Quick search options - moved outside component
const quickSearches = [
    { label: "About Me", query: "about", icon: HiUser },
    { label: "Projects", query: "projects", icon: HiCodeBracket },
    { label: "Experience", query: "experience", icon: HiBriefcase },
    { label: "Resume", query: "resume", icon: HiDocumentText },
    { label: "Contact", query: "contact", icon: HiEnvelope },
    { label: "Skills", query: "react node mongodb", icon: HiCodeBracket }
];

// Calculate relevance score - moved outside component
const calculateRelevance = (item, query) => {
  const title = item.title.toLowerCase();
  const content = item.content.toLowerCase();
  let score = 0;

  // Title matches are more relevant
  if (title.includes(query)) score += 10;
  if (title.startsWith(query)) score += 5;

  // Content matches
  const contentMatches = (content.match(new RegExp(query, 'g')) || []).length;
  score += contentMatches;

  return score;
};

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Global Esc key handler - works even when input is not focused
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        setSearchQuery("");
      }
    };

    // Add event listener to document
    document.addEventListener("keydown", handleEscape, true);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleEscape, true);
    };
  }, [isOpen, onClose]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setSelectedIndex(0);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = searchableContent
      .filter(item => {
        const searchText = `${item.title} ${item.content}`.toLowerCase();
        return searchText.includes(query);
      })
      .map(item => ({
        ...item,
        relevance: calculateRelevance(item, query)
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 8);

    setSearchResults(results);
    setSelectedIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Handle navigation
  const handleResultClick = (result) => {
    if (result.href.startsWith('/')) {
      navigate(result.href);
    } else {
      const section = document.querySelector(result.href);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    onClose();
    setSearchQuery("");
  };

  // Handle quick search
  const handleQuickSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      e.preventDefault();
      e.stopPropagation();
      onClose();
      setSearchQuery("");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && searchResults.length > 0) {
      e.preventDefault();
      handleResultClick(searchResults[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-start justify-center pt-32 px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl">
              {/* Search Input */}
              <motion.div
                className="relative mb-6"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
                  <div className="flex items-center px-4 py-4">
                    <HiMagnifyingGlass className="w-6 h-6 text-white/60 mr-3 flex-shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search anything about me or page content..."
                      className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-lg"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          inputRef.current?.focus();
                        }}
                        className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors"
                      >
                        <HiXMark className="w-5 h-5 text-white/60" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Quick Search Options */}
              {searchQuery === "" && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <p className="text-white/60 text-sm mb-3 px-2">Quick Search</p>
                  <div className="flex flex-wrap gap-2">
                    {quickSearches.map((quick, index) => {
                      const Icon = quick.icon;
                      return (
                        <motion.button
                          key={index}
                          onClick={() => handleQuickSearch(quick.query)}
                          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm transition-all duration-200 hover:scale-105"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{quick.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Search Results */}
              {searchQuery && (
                <motion.div
                  className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden max-h-[400px] overflow-y-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map((result, index) => {
                        const Icon = result.icon;
                        return (
                          <motion.button
                            key={result.id}
                            onClick={() => handleResultClick(result)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                              index === selectedIndex
                                ? "bg-white/20 text-white"
                                : "bg-transparent hover:bg-white/10 text-white/90"
                            }`}
                            whileHover={{ x: 4 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Icon className="w-5 h-5 text-white/60 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-white">{result.title}</span>
                                <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                                  {result.category}
                                </span>
                              </div>
                              <p className="text-sm text-white/60 line-clamp-1">
                                {result.content.substring(0, 80)}...
                              </p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-white/60">No results found for "{searchQuery}"</p>
                      <p className="text-white/40 text-sm mt-2">Try a different search term</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Footer hint */}
              <motion.div
                className="mt-4 text-center text-white/40 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p>Press <kbd className="px-2 py-1 bg-white/10 rounded text-white/60">Esc</kbd> to close</p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;

