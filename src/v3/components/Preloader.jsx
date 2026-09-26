import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import "./Preloader.css";

/**
 * A short print-shop intro: the counter runs to 100 while the monogram is
 * inked in, then the sheet lifts off the page and hands over to the hero.
 */
export default function Preloader({ onDone }) {
  const root = useRef(null);
  const count = useRef(null);
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const quick = prefersReducedMotion();
      const counter = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => setGone(true),
      });

      tl.from(".pl-mark span", {
        yPercent: 110,
        duration: quick ? 0.01 : 0.9,
        ease: "expo.out",
        stagger: 0.06,
      })
        .from(".pl-meta", { opacity: 0, y: 10, duration: 0.6, stagger: 0.08 }, "<0.1")
        .to(
          counter,
          {
            v: 100,
            duration: quick ? 0.01 : 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0
        )
        .to(".pl-bar i", { scaleX: 1, duration: quick ? 0.01 : 1.5, ease: "power2.inOut" }, 0)
        .add(() => onDone?.(), "exit")
        .to(".pl-mark span", { yPercent: -110, duration: 0.6, ease: "expo.in", stagger: 0.04 }, "exit-=0.05")
        .to(root.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: quick ? 0.01 : 1.05,
          ease: "expo.inOut",
        }, "exit+=0.25");
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div className="pl" ref={root} aria-hidden="true">
      <div className="pl-mark t-display">
        <span>V</span>
        <span>R</span>
        <span className="is-red pl-reg">®</span>
      </div>
      <div className="pl-foot">
        <div className="pl-meta t-mono">
          Vishesh Rajput
          <br />
          <span className="is-mute">Portfolio — 2026</span>
        </div>
        <div className="pl-bar"><i /></div>
        <div className="pl-count t-display" ref={count}>000</div>
      </div>
    </div>
  );
}
