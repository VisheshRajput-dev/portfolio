import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import { projects } from "../data";
import "./Process.css";

const DeskScene = lazy(() => import("../three/DeskScene"));

const chapters = [
  {
    word: "Sketch",
    line: "It starts as a rough line.",
    body: "A notebook, a whiteboard, a question worth answering. Most of the work is deciding what not to build.",
  },
  {
    word: "Ink",
    line: "Then the lines get serious.",
    body: "Data models, API contracts and the unglamorous decisions that keep an app fast a year later.",
  },
  {
    word: "Build",
    line: "Code, compile, repeat.",
    body: "React on the front, Node underneath, Flutter when it has to live in a pocket.",
  },
  {
    word: "Ship",
    line: "And then it flies.",
    body: "Real users, real feedback, the next iteration. Shipping is where it starts, not where it ends.",
  },
];

export default function Process() {
  const root = useRef(null);
  const progress = useRef(0);
  const [active, setActive] = useState(false);
  const [chapter, setChapter] = useState(0);

  // Only render the scene while it is anywhere near the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "20% 0px" });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      scrub: prefersReducedMotion() ? false : true,
      onUpdate: (self) => {
        progress.current = self.progress;
        const next = Math.min(3, Math.floor(self.progress * 4));
        setChapter((c) => (c === next ? c : next));
        gsap.set(".proc-bar i", { scaleX: self.progress });
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section className="proc" id="process" ref={root} aria-label="Process: from sketch to ship">
      <div className="proc-stick">
        <div className="proc-canvas">
          <Suspense fallback={null}>
            <DeskScene progress={progress} active={active} video={projects[0].video} />
          </Suspense>
        </div>

        <header className="proc-head">
          <p className="t-mono is-mute">( 02 — Process )</p>
          <p className="t-mono">
            From sketch <span className="t-serif proc-to"><em>to</em></span> ship
          </p>
        </header>

        <div className="proc-copy" aria-live="polite">
          {chapters.map((c, i) => (
            <article key={c.word} className={`proc-ch ${i === chapter ? "is-on" : ""}`} aria-hidden={i !== chapter}>
              <p className="t-mono proc-idx">
                <span className="is-red">0{i + 1}</span> / 04
              </p>
              <h2 className="t-display proc-word">{c.word}</h2>
              <p className="t-serif proc-line"><em>{c.line}</em></p>
              <p className="t-mono proc-body">{c.body}</p>
            </article>
          ))}
        </div>

        <div className="proc-foot">
          <div className="proc-steps t-mono">
            {chapters.map((c, i) => (
              <span key={c.word} className={i <= chapter ? "is-done" : ""}>{c.word}</span>
            ))}
          </div>
          <div className="proc-bar"><i /></div>
        </div>
      </div>
    </section>
  );
}
