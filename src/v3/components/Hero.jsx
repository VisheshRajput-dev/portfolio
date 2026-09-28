import { Suspense, useLayoutEffect, useRef } from "react";
import { gsap, splitChars, prefersReducedMotion, isTouch } from "../lib/motion";
import EngravedPortrait, { createPortraitState } from "../three/EngravedPortrait";
import { person, disciplines } from "../data";
import "./Hero.css";

const PORTRAIT = "/avatar.png";

export default function Hero({ ready }) {
  const root = useRef(null);
  const portrait = useRef(createPortraitState());

  // Intro, once the preloader hands over.
  useLayoutEffect(() => {
    if (!ready) return undefined;
    const quick = prefersReducedMotion();
    const ctx = gsap.context(() => {}, root);
    let alive = true;
    document.fonts.ready.then(() => alive && ctx.add(() => {
      const first = splitChars(".hero-first");
      const last = splitChars(".hero-last");

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(first.chars, { yPercent: 115, duration: quick ? 0.01 : 1.5, stagger: 0.045 }, 0)
        .to(portrait.current, { reveal: 1, duration: quick ? 0.01 : 2.6, ease: "power2.inOut" }, 0.15)
        .from(last.chars, { yPercent: 115, duration: quick ? 0.01 : 1.5, stagger: 0.045 }, 0.35)
        .fromTo(
          ".hero-flourish",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: quick ? 0.01 : 1.6, ease: "power3.inOut" },
          1.1
        )
        .from(".hero-reveal", { y: 18, opacity: 0, duration: 1, stagger: 0.07 }, 0.9);

      if (!quick) {
        // Scrolling develops the real photograph through the engraving,
        // line by line from the top, like the loupe but across the portrait.
        gsap.fromTo(
          portrait.current,
          { photo: 0 },
          {
            photo: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=55%", scrub: 1.4 },
          }
        );

        // Scroll-out: the page peels apart as you leave the hero.
        const out = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        out.to(".hero-first", { yPercent: -60, ease: "none" }, 0)
          .to(".hero-last", { xPercent: -12, ease: "none" }, 0)
          .to(".hero-flourish", { yPercent: -120, rotate: -14, ease: "none" }, 0)
          .to(".hero-side", { opacity: 0, ease: "none" }, 0);
      }
    }));
    return () => {
      alive = false;
      ctx.revert();
    };
  }, [ready]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    portrait.current.mouse.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
  };

  return (
    <section className="hero" id="top" ref={root} aria-label="Introduction">
      <h1 className="hero-name">
        <span className="hero-first t-display">{person.first}</span>
        <span className="sr-only"> </span>
        <span className="hero-last t-display">{person.last}</span>
      </h1>

      <div
        className="hero-portrait"
        onPointerMove={isTouch() ? undefined : onMove}
        onPointerEnter={() => (portrait.current.lens = 1)}
        onPointerLeave={() => (portrait.current.lens = 0)}
      >
        <Suspense fallback={null}>
          <EngravedPortrait src={PORTRAIT} state={portrait} className="hero-canvas" />
        </Suspense>
      </div>

      <p className="hero-flourish t-serif is-red" aria-hidden="true">
        <em>full-stack</em>
      </p>

      <div className="hero-side hero-side-l">
        <p className="t-mono is-mute hero-reveal">( What I build )</p>
        <ul className="t-mono hero-reveal">
          {disciplines.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>

      <div className="hero-side hero-side-r">
        <p className="t-mono is-mute hero-reveal">( Currently )</p>
        <p className="t-mono hero-reveal">
          {person.role} at {person.company}
        </p>
      </div>

      <div className="hero-foot">
        <p className="t-mono hero-reveal hero-scroll">
          Scroll
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></svg>
        </p>
        <p className="t-mono is-mute hero-reveal hero-hint">( Hover the portrait )</p>
        <p className="t-mono hero-reveal">Portfolio © 2026</p>
      </div>
    </section>
  );
}
