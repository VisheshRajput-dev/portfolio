import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap, isTouch, prefersReducedMotion } from "../lib/motion";
import { projects } from "../data";
import "./Work.css";

/**
 * Selected work as a typeset index. On desktop a preview card trails the
 * cursor and plays the hovered project's screen recording; on touch the
 * recording sits inline under each title.
 */
export default function Work() {
  const root = useRef(null);
  const card = useRef(null);
  const videos = useRef([]);
  const [hovered, setHovered] = useState(-1);
  const touch = isTouch();

  // Card follows the cursor with a little lag and leans into the motion.
  useEffect(() => {
    if (touch) return undefined;
    const el = card.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    const rTo = gsap.quickTo(el, "rotation", { duration: 0.8, ease: "power3" });
    let lastX = 0;
    const onMove = (e) => {
      const r = root.current.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
      rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.35));
      lastX = e.clientX;
    };
    const section = root.current;
    section.addEventListener("pointermove", onMove);
    return () => section.removeEventListener("pointermove", onMove);
  }, [touch]);

  // Only the hovered recording plays.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === hovered) {
        if (v.preload !== "auto") v.preload = "auto";
        v.play().catch(() => {});
      } else v.pause();
    });
  }, [hovered]);

  // On touch, each inline recording loads and plays only while it's on
  // screen, so scrolling past the list doesn't download every video.
  useEffect(() => {
    if (!touch) return undefined;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(({ target: v, isIntersecting }) => {
          if (isIntersecting) {
            v.preload = "auto";
            v.play().catch(() => {});
          } else v.pause();
        }),
      { threshold: 0.5 }
    );
    root.current.querySelectorAll(".work-inline[data-video]").forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [touch]);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".work-row",
        { yPercent: 60, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".work-list", start: "top 80%" },
        }
      );
      gsap.to(".work-ghost", {
        xPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="work" id="work" ref={root} data-nav="dark" aria-labelledby="work-title">
      <div className="work-ghost t-display" aria-hidden="true">Selected work — Selected work</div>

      <header className="work-head">
        <p className="t-mono work-kicker">( 03 — Selected work )</p>
        <h2 id="work-title" className="t-display work-title">
          Work<sup className="t-mono">({String(projects.length).padStart(2, "0")})</sup>
        </h2>
        <p className="t-serif work-sub"><em>Things I shipped, not just started.</em></p>
      </header>

      <ol className={`work-list ${hovered >= 0 ? "has-hover" : ""}`} onPointerLeave={() => setHovered(-1)}>
        {projects.map((p, i) => (
          <li
            key={p.id}
            className={`work-row ${hovered === i ? "is-hover" : ""}`}
            onPointerEnter={() => !touch && setHovered(i)}
          >
            <Link to={`/project/${p.slug}`} className="work-link" aria-label={`${p.title} — case study`}>
              <span className="t-mono work-num">0{i + 1}</span>
              <span className="t-display work-name">{p.display || p.title}</span>
              <span className="work-meta">
                <span className="t-mono">{p.kind}</span>
                <span className="t-mono work-stack">{p.stack.join(" · ")}</span>
              </span>
              <span className="work-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
              </span>
            </Link>
            {touch &&
              (p.video ? (
                <video className="work-inline" data-video src={p.video} poster={p.cover} muted loop playsInline preload="none" />
              ) : (
                <img className="work-inline" src={p.cover} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} />
              ))}
            <p className="t-mono work-line">{p.line}</p>
          </li>
        ))}
      </ol>

      {!touch && (
        <div className={`work-card ${hovered >= 0 ? "is-on" : ""}`} ref={card} aria-hidden="true">
          <div className="work-card-inner">
            {projects.map((p, i) =>
              p.video ? (
                <video
                  key={p.id}
                  ref={(el) => (videos.current[i] = el)}
                  className={hovered === i ? "is-on" : ""}
                  src={p.video}
                  muted
                  loop
                  playsInline
                  preload="none"
                />
              ) : (
                <div key={p.id} className={`work-card-cover ${hovered === i ? "is-on" : ""}`}>
                  <img src={p.cover} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} />
                  <span className="t-display">{p.title}</span>
                </div>
              )
            )}
            <span className="t-mono work-card-tag">{hovered >= 0 ? projects[hovered].title : ""} — view case study</span>
          </div>
        </div>
      )}
    </section>
  );
}
