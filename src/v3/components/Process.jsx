import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { attachStepSnap } from "../lib/stepSnap";
import "./Process.css";

const DeskSetup = lazy(() => import("../three/DeskSetup"));

/**
 * Process: a late-evening desk. A reminder lights up the phone, the laptop
 * opens, and the camera pushes into the screen, where this page gets made —
 * pencil sketch, type, build, motion — until the live page fills the frame.
 */

// Section progress at which each beat happens.
const BEAT = {
  notify: [0.15, 0.24], // phone wakes, the banner drops in
  open: [0.33, 0.47], // lid opens
  power: [0.45, 0.52], // display wakes
  story: [0.5, 0.95], // the page gets made on screen
};

const steps = [
  { at: 0, name: "Brief", line: "It starts with a reminder: time to upgrade the portfolio." },
  { at: 0.33, name: "Open", line: "Lid up, coffee still warm." },
  { at: 0.5, name: "Sketch", line: "Pencil first: what's loud, what's quiet, where the one red goes." },
  { at: 0.7, name: "Ink", line: "Then the type goes down: extended caps, a serif voice, a six-column grid." },
  { at: 0.76, name: "Motion", line: "It learns to move: the portrait engraves itself, the name rises." },
  { at: 0.82, name: "Build", line: "Every box accounted for: React, GSAP timelines, WebGL shaders." },
  { at: 0.88, name: "Ship", line: "And it ships. You're looking at it." },
];

// Where the story rests: after any scroll inside the section it glides on
// to the next of these, so every flick finishes a whole step (desk, reminder, lid, sketch, ink, motion, build, ship).
const STOPS = [0, 0.28, 0.48, 0.66, 0.73, 0.78, 0.84, 0.93, 1];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ramp = (p, [a, b]) => clamp01((p - a) / (b - a));
const smooth = (v) => v * v * (3 - 2 * v);

export default function Process() {
  const root = useRef(null);
  const progress = useRef(0);
  const beats = useRef({ p: 0, notify: 0, open: 0, power: 0, story: 0 });
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "30% 0px" });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    let st = null;
    const ctx = gsap.context(() => {
      st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          progress.current = p;
          const next = steps.reduce((acc, st, i) => (p >= st.at ? i : acc), 0);
          setStep((c) => (c === next ? c : next));
          gsap.set(".desk-bar i", { scaleX: p });
        },
      });

      // The title steps back as the camera starts to push in.
      gsap.to(".desk-title", {
        opacity: 0,
        y: -30,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top+=6% top", end: "top+=16% top", scrub: true },
      });
    }, root);

    // Every beat eases toward where the scroll says it should be, so nothing
    // on the desk ever jumps.
    const tick = (t, dt) => {
      const b = beats.current;
      const k = prefersReducedMotion() ? 1 : 1 - Math.exp(-dt / 170);
      const p = progress.current;
      b.p = p;
      b.notify += (smooth(ramp(p, BEAT.notify)) - b.notify) * k;
      b.open += (smooth(ramp(p, BEAT.open)) - b.open) * k;
      b.power += (ramp(p, BEAT.power) - b.power) * k;
      b.story += (ramp(p, BEAT.story) - b.story) * k;
    };
    gsap.ticker.add(tick);

    // Every flick finishes a whole step.
    const unsnap = attachStepSnap(() => st, STOPS);

    return () => {
      unsnap();
      gsap.ticker.remove(tick);
      ctx.revert();
    };
  }, []);

  return (
    <section className="proc" id="process" ref={root} data-nav="dark" aria-label="Process: from brief to ship">
      <div className="desk-stage">
        <div className="desk-canvas">
          <Suspense fallback={null}>
            <DeskSetup beats={beats} active={active} />
          </Suspense>
        </div>

        <header className="desk-head">
          <p className="t-mono is-mute">( 05 — Process )</p>
          <p className="t-mono">
            From brief <span className="t-serif desk-to"><em>to</em></span> ship
          </p>
        </header>

        <h2 className="t-display desk-title">
          The making
          <br />
          <span className="t-serif is-red"><em>of</em></span> this page
        </h2>

        <div className="desk-cap" aria-live="polite">
          <p className="t-mono desk-count">
            <span className="is-red">{String(step + 1).padStart(2, "0")}</span> / {String(steps.length).padStart(2, "0")}
          </p>
          <p className="desk-line" key={step}>
            <span className="t-mono desk-name">{steps[step].name}</span>
            <span className="t-body">{steps[step].line}</span>
          </p>
          <div className="desk-bar" aria-hidden="true"><i /></div>
        </div>
      </div>
    </section>
  );
}
