import { useEffect, useRef } from "react";
import { gsap, getLenis, prefersReducedMotion } from "../lib/motion";
import "./Marquee.css";

const items = [
  "Web applications",
  "Mobile applications",
  "Scalable backends & APIs",
  "AI — RAG & LLM apps",
  "Founding engineer @ PointsFly",
  "Available for projects",
];

/**
 * A red press band. It drifts on its own and leans into your scroll:
 * faster with scroll speed, reversing when you scroll back up.
 */
export default function Marquee() {
  const track = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const el = track.current;
    let x = 0;
    let dir = -1;
    const half = () => el.scrollWidth / 2;

    const tick = (_, dt) => {
      const lenis = getLenis();
      const v = lenis ? lenis.velocity : 0;
      if (Math.abs(v) > 0.4) dir = v > 0 ? -1 : 1;
      const speed = 0.045 + Math.min(Math.abs(v) * 0.02, 0.6);
      x += dir * speed * dt;
      const w = half();
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const row = (hidden) =>
    items.map((t, i) => (
      <span className="mq-item" key={`${hidden}-${i}`} aria-hidden={hidden || undefined}>
        {t}
        <svg className="mq-star" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    ));

  return (
    <div className="mq" role="marquee" data-nav="dark" aria-label={items.join(", ")}>
      <div className="mq-track t-mono" ref={track}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
