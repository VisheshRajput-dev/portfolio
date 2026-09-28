import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, scrollToTarget } from "../lib/motion";
import { person } from "../data";
import "./Nav.css";

const links = [
  { label: "About", target: "#about" },
  { label: "Work", target: "#work" },
  { label: "Journey", target: "#journey" },
  { label: "Process", target: "#process" },
  { label: "Contact", target: "#contact" },
];

/** Text that rolls to a duplicate of itself on hover. */
export function Roll({ children }) {
  return (
    <span className="roll">
      <span className="roll-a">{children}</span>
      <span className="roll-b" aria-hidden="true">{children}</span>
    </span>
  );
}

function useLocalTime(timeZone) {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return time;
}

export default function Nav({ ready }) {
  const root = useRef(null);
  const [open, setOpen] = useState(false);
  const time = useLocalTime(person.timezone);

  useLayoutEffect(() => {
    if (!ready) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".nav-item", { yPercent: 120, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.05, delay: 0.35 });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  // Tuck the detail cells away while reading down; bring them back on the way up.
  useEffect(() => {
    if (!ready) return undefined;
    const st = ScrollTrigger.create({
      start: 240,
      end: "max",
      onUpdate: (self) => root.current?.classList.toggle("is-min", self.direction === 1),
      onLeaveBack: () => root.current?.classList.remove("is-min"),
    });
    return () => st.kill();
  }, [ready]);

  // Swap to ivory over any section marked data-nav="dark".
  useEffect(() => {
    if (!ready) return undefined;
    const triggers = gsap.utils.toArray('[data-nav="dark"]').map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 40px",
        end: "bottom 40px",
        onToggle: (self) => root.current?.classList.toggle("is-dark", self.isActive),
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, [ready]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (target) => (e) => {
    e.preventDefault();
    setOpen(false);
    scrollToTarget(target);
  };

  return (
    <>
      <header className={`nav ${open ? "is-open" : ""}`} ref={root}>
        <div className="nav-cell">
          <a href="#top" onClick={go(0)} className="nav-item nav-logo t-display" aria-label="Back to top">
            VR<sup>®</sup>
          </a>
        </div>
        <div className="nav-cell nav-detail nav-hide-sm">
          <p className="nav-item t-mono">
            {person.first} {person.last}
            <br />
            <span className="nav-dim">{person.role} @ {person.company}</span>
          </p>
        </div>
        <div className="nav-cell nav-detail nav-hide-md">
          <p className="nav-item t-mono">
            {person.location.split(",")[0]} — {time} IST
            <br />
            <span className="nav-dim nav-dot">Available for projects</span>
          </p>
        </div>
        <nav className="nav-cell nav-detail nav-links nav-hide-sm" aria-label="Sections">
          {links.map((l) => (
            <a key={l.label} href={l.target} onClick={go(l.target)} className="nav-item t-mono">
              <Roll>{l.label}</Roll>
            </a>
          ))}
        </nav>
        <div className="nav-cell nav-end">
          <a href="#contact" onClick={go("#contact")} className="nav-item nav-cta t-mono nav-hide-sm">
            <Roll>Let's talk</Roll>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
          </a>
          <button
            type="button"
            className="nav-item nav-burger t-mono"
            aria-expanded={open}
            aria-controls="v3-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <div id="v3-menu" className={`menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav className="menu-links" aria-label="Menu">
          {links.map((l, i) => (
            <a key={l.label} href={l.target} onClick={go(l.target)} className="t-display" tabIndex={open ? 0 : -1}>
              <span className="t-mono menu-idx">0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <p className="t-mono menu-foot">
          {person.email}
          <br />
          {person.location}
        </p>
      </div>
    </>
  );
}
