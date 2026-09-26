import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

let lenis = null;

export const getLenis = () => lenis;

/** Smooth scroll driven by GSAP's ticker so ScrollTrigger and Lenis share one clock. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
    window.lenis = lenis; // legacy components look for this

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenis = null;
      window.lenis = null;
    };
  }, []);
}

export function scrollToTarget(target, opts = {}) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4), ...opts });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else if (el) el.scrollIntoView({ behavior: "smooth" });
}

/** Split an element into chars inside clipped lines, so chars can rise from behind the clip. */
export function splitChars(el) {
  return new SplitText(el, { type: "lines,chars", mask: "lines", linesClass: "split-line" });
}
