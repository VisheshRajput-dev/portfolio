import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// Base tokens first so each section's stylesheet can override them.
import "./v3.css";
import { getLenis, useSmoothScroll, ScrollTrigger, scrollToTarget } from "./lib/motion";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Process from "./components/Process";
import Work from "./components/Work";
import Journey from "./components/Journey";
import Contact from "./components/Contact";

export default function HomeV3() {
  const [ready, setReady] = useState(false);
  const { state } = useLocation();

  useSmoothScroll();

  // Hold the page still until the intro hands over.
  useEffect(() => {
    const lenis = getLenis();
    if (ready) {
      lenis?.start();
      document.documentElement.style.overflow = "";
      ScrollTrigger.refresh();
      // Coming back from a case study: land on the section it came from.
      if (state?.to) requestAnimationFrame(() => scrollToTarget(state.to, { immediate: true }));
    } else {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    }
  }, [ready]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("v3-root");
    window.scrollTo(0, 0);
    return () => {
      html.classList.remove("v3-root");
      html.style.overflow = "";
    };
  }, []);

  return (
    <div className="v3">
      <Preloader onDone={() => setReady(true)} />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Work />
        <Journey />
        <Process />
        <Contact />
      </main>
      <div className="v3-grain" aria-hidden="true" />
    </div>
  );
}
