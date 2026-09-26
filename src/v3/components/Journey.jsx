import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import { journey, person, projects } from "../data";
import "./Journey.css";

const Lanyard = lazy(() => import("../three/Lanyard"));

const badge = {
  portrait: "/avatar.png",
  name: `${person.first} ${person.last}`,
  role: person.role,
  company: person.company,
};

const stats = [
  { n: "3+", label: "Client projects shipped\nin 2-week timelines" },
  { n: "2 mo", label: "Navadurga portal,\ncontract to production" },
  { n: String(projects.length).padStart(2, "0"), label: "Products of mine\nlive on the web" },
];

export default function Journey() {
  const root = useRef(null);
  const stage = useRef(null);
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "10% 0px" });
    io.observe(stage.current);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".jr-row", {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ".jr-list", start: "top 82%" },
      });
      gsap.utils.toArray(".jr-stat-n").forEach((el) => {
        gsap.from(el, {
          yPercent: 100,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="jr" id="journey" ref={root} aria-labelledby="jr-title">
      <div className="jr-stage" ref={stage}>
        <div className="jr-canvas">
          <Suspense fallback={null}>
            <Lanyard active={active} person={badge} />
          </Suspense>
        </div>
        <p className="t-mono is-mute jr-hint">( Grab the badge — it swings )</p>
      </div>

      <div className="jr-main">
        <p className="t-mono is-mute">( 04 — Journey )</p>
        <h2 id="jr-title" className="jr-title">
          <span className="t-serif jr-the"><em>the</em></span>
          <span className="t-display">Journey</span>
        </h2>
        <p className="t-body jr-intro">
          I like the part where an idea stops being a slide and starts having users. Lately that means building
          PointsFly from the first commit, and before that, shipping fast for founders who needed something real.
        </p>

        <ol className="jr-list">
          {journey.map((j, i) => {
            const isOpen = open === i;
            return (
              <li key={j.org} className={`jr-row ${isOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="jr-btn"
                  aria-expanded={isOpen}
                  aria-controls={`jr-note-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="t-mono jr-years">
                    {j.current && <span className="jr-live" aria-label="current" />}
                    {j.years}
                  </span>
                  <span className="t-display jr-role">{j.role}</span>
                  <span className="t-mono jr-org">{j.org}</span>
                  <span className="jr-plus" aria-hidden="true" />
                </button>
                <div className="jr-note" id={`jr-note-${i}`} role="region">
                  <div>
                    <p className="t-mono">
                      <span className="is-mute">{j.where} — </span>
                      {j.note}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="jr-stats">
          {stats.map((s) => (
            <div key={s.label} className="jr-stat">
              <div className="jr-stat-clip">
                <span className="t-display jr-stat-n">{s.n}</span>
              </div>
              <p className="t-mono is-mute">{s.label}</p>
            </div>
          ))}
        </div>

        <a className="t-mono jr-resume" href={person.resume} target="_blank" rel="noreferrer">
          Download résumé (PDF)
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></svg>
        </a>
      </div>
    </section>
  );
}
