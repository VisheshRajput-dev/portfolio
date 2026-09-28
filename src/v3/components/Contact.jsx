import { useLayoutEffect, useRef, useState } from "react";
import { gsap, splitChars, prefersReducedMotion, scrollToTarget } from "../lib/motion";
import { person, socials } from "../data";
import { Roll } from "./Nav";
import "./Contact.css";

export default function Contact() {
  const root = useRef(null);
  const [copied, setCopied] = useState(false);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {}, root);
    let alive = true;
    // Split only once the display face is in, so line boxes are measured right.
    document.fonts.ready.then(() => {
      if (!alive) return;
      ctx.add(() => {
        const a = splitChars(".ct-a");
        const b = splitChars(".ct-b");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".ct-words", start: "top 75%" },
          defaults: { ease: "expo.out", duration: 1.4 },
        });
        tl.from(a.chars, { yPercent: 110, stagger: 0.04 })
          .fromTo(".ct-into", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.3, ease: "power3.inOut" }, 0.35)
          .from(b.chars, { yPercent: 110, stagger: 0.04 }, 0.5)
          .from(".ct-reveal", { y: 20, opacity: 0, stagger: 0.06, duration: 1 }, 0.8);
      });
    });
    return () => {
      alive = false;
      ctx.revert();
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <section className="ct" id="contact" ref={root} data-nav="dark" aria-labelledby="ct-title">
      <header className="ct-head">
        <p className="t-mono is-mute">( 06 — Contact )</p>
        <p className="t-mono is-mute">Got an idea?</p>
      </header>

      <h2 id="ct-title" className="ct-words">
        <span className="t-display ct-a">Someday</span>
        <span className="t-serif ct-into is-red"><em>into</em></span>
        <span className="t-display ct-b">Done.</span>
      </h2>

      <div className="ct-row">
        <p className="t-mono ct-reveal ct-lead">
          Let's turn your someday
          <br />
          into done.
        </p>
        <a className="t-display ct-mail ct-reveal" href={`mailto:${person.email}`}>
          {person.email}
        </a>
        <button type="button" className="t-mono ct-copy ct-reveal" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="ct-foot">
        <nav className="ct-social ct-reveal" aria-label="Social">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="t-mono">
              <Roll>{s.label} ↗</Roll>
            </a>
          ))}
        </nav>
        <p className="t-mono is-mute ct-reveal">
          © 2026 {person.first} {person.last} — {person.location}
        </p>
        <button type="button" className="t-mono ct-top ct-reveal" onClick={() => scrollToTarget(0, { duration: 2.2 })}>
          <Roll>Back to top ↑</Roll>
        </button>
      </div>
    </section>
  );
}
