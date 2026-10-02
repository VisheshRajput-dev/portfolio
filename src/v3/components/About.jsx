import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, prefersReducedMotion, scrollToTarget } from "../lib/motion";
import { createDeckSound } from "../lib/deckSound";
import { deal, coast, BOUNCE_TAIL } from "../../shared/deckEase";
import { engrave, grain, motifs } from "./aboutCards";
import "./About.css";

/**
 * About, as a deck: not what I build (the hero says that) but how. Six
 * notes, dealt on a wheel that turns by itself; pick a card or drag the
 * deck and it clicks round under your hand.
 */

const INK = "#0e0d0c";
const IVORY = "#eeeae2";
const RED = "#d2372c";

// Titles use *word* for the serif accent.
const items = [
  {
    title: "How I *think*",
    body: "What I build is up top. This is how I build it: six notes I keep coming back to. Pick a card, drag the deck, or just watch.",
    motif: "seal",
    stock: "red",
    art: { color: INK },
  },
  {
    title: "Ship, *then* polish",
    body: "A rough version in real hands teaches more than a perfect plan in a doc. I get something live early, then earn the details.",
    motif: "sphere",
    stock: "ink",
    art: { color: IVORY },
  },
  {
    title: "Own the *whole* thing",
    body: "From the schema to the last easing curve. Fewer handoffs means fewer gaps, and I'd rather fix a problem than forward it.",
    motif: "layers",
    stock: "paper",
    art: { color: INK, invert: true },
  },
  {
    title: "Motion with *meaning*",
    body: "Animation is there to explain: where you came from, what changed, what to do next. If it only decorates, it goes.",
    motif: "flow",
    stock: "ink",
    art: { color: RED },
  },
  {
    title: "Fast is a *feature*",
    body: "Load time, response time, time to ship. People feel speed before they read a single word.",
    motif: "comet",
    stock: "paper",
    art: { color: INK, invert: true },
  },
  {
    title: "Boring *where* it counts",
    body: "Proven tools for auth, payments and data. The experiments go where they can't hurt anyone.",
    motif: "cube",
    stock: "ink",
    art: { color: IVORY },
  },
  {
    title: "Leave it *better*",
    body: "Clear names, small commits, a README someone can actually follow. The next person to open the code is often me.",
    motif: "torus",
    stock: "paper",
    art: { color: INK, invert: true },
  },
  {
    title: "Your idea, *next*",
    body: "If that sounds like how you'd want your product built, tell me what you're making.",
    motif: "arrow",
    stock: "hello",
    art: { color: RED, invert: true },
    cta: true,
  },
];

const N = items.length;
const STEP = 24;
const LOOP = N * STEP;
const wrap = (a) => ((((a + LOOP / 2) % LOOP) + LOOP) % LOOP) - LOOP / 2;
const mod = (k) => ((k % N) + N) % N;
// Slot s holds item (N - s) % N, so turning the wheel forward one step
// brings the next item to the front.
const itemOf = (s) => mod(N - s);
// How far the cards around the front part while the deck turns, and over
// what span (degrees) either side of it.
const PART = 1.4;
const PART_W = 26;

function Words({ text, card = false }) {
  // Spaces sit between the word boxes (not inside them) so lines can wrap.
  return text.split(" ").flatMap((w, i) => {
    const em = w.startsWith("*");
    const clean = w.replace(/\*/g, "");
    return [
      i ? " " : null,
      <span key={i} className={card ? "ab-cw" : "ab-w"} style={{ "--i": i }}>
        {em ? <em className="t-serif">{clean}</em> : <span>{clean}</span>}
      </span>,
    ];
  });
}

function Barcode({ seed }) {
  let s = seed;
  const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  let x = 0;
  const bars = [];
  for (let i = 0; i < 26; i++) {
    const w = 1 + Math.floor(r() * 3);
    if (i % 2 === 0) bars.push(<rect key={i} x={x} y="0" width={w} height="14" />);
    x += w + 1;
  }
  return (
    <svg className="ab-code" width={x} height="14" viewBox={`0 0 ${x} 14`} aria-hidden="true" fill="currentColor">
      {bars}
    </svg>
  );
}

export default function About() {
  const root = useRef(null);
  const wheel = useRef(null);
  const api = useRef({});
  const [active, setActive] = useState(0);
  const [art, setArt] = useState(null);
  const [soundOn, setSoundOn] = useState(() => {
    try {
      return localStorage.getItem("v3-sound") !== "off";
    } catch {
      return true;
    }
  });
  const sound = useMemo(createDeckSound, []);

  useEffect(() => {
    sound.setEnabled(soundOn);
    try {
      localStorage.setItem("v3-sound", soundOn ? "on" : "off");
    } catch {
      /* private mode: the toggle still works for this visit */
    }
  }, [soundOn, sound]);

  // Paint the engravings once, when the browser is idle.
  useEffect(() => {
    const paint = () =>
      setArt({
        grain: grain(),
        img: items.map((it) => engrave(motifs[it.motif], it.art)),
      });
    if (window.requestIdleCallback) {
      const id = window.requestIdleCallback(paint, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(paint, 60);
    return () => clearTimeout(id);
  }, []);

  // The wheel. Same deal as /concept: each card on its own clock, the one
  // behind the motion first, so the fan bunches, lands, and bounces once.
  useEffect(() => {
    const slots = [...wheel.current.querySelectorAll(".ab-slot")];
    const DUR = 1.9;
    const STAGGER = 0.1;
    const COAST = 0.6;
    const HOLD = 3.4;
    const cards = slots.map(() => ({
      a: 0,
      v: 0,
      from: 0,
      to: 0,
      v0: 0,
      delay: 0,
      p: 0,
    }));
    const shownZ = slots.map(() => -1);
    const shownVis = slots.map(() => "");
    const s = api.current;
    let move = null;
    let clock = 0;
    let nextAuto = 2.2;
    let front = 0;
    let frontSlot = -1;
    let visible = false;
    let open = 0;

    s.target = 0;
    s.goTo = (target, user) => {
      const dir = Math.sign(target - cards[0].a) || 1;
      let maxDelay = 0;
      cards.forEach((c, i) => {
        c.from = c.a;
        c.to = target;
        c.v0 = c.v;
        const lead = wrap(c.a + i * STEP) * dir;
        c.delay = STAGGER * Math.max(0, Math.min(8, (lead + 96) / STEP));
        maxDelay = Math.max(maxDelay, c.delay);
      });
      s.target = target;
      s.user = user;
      move = {
        start: clock,
        end: clock + Math.max(maxDelay + DUR * (1 + BOUNCE_TAIL), COAST),
        user,
      };
      nextAuto = clock + (user ? 7 : 0) + DUR + HOLD;
    };
    s.angle = () => cards.reduce((sum, c) => sum + c.a, 0) / cards.length;
    s.placed = () => slots.map((_, i) => wrap(cards[i].a + i * STEP));
    s.grab = () => {
      move = null;
      s.dragTo = s.angle();
    };
    s.hold = () => (nextAuto = clock + 7);

    // Give people a moment with the first card before the deck turns.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !visible && !move) nextAuto = Math.max(nextAuto, clock + 3.2);
        visible = e.isIntersecting;
      },
      { threshold: 0.35 }
    );
    io.observe(root.current);

    // Browsers only allow audio after a gesture; any click or key on the
    // page counts, so the auto-turn can be heard without touching the deck.
    const wake = () => sound.wake();
    window.addEventListener("pointerdown", wake, { passive: true });
    window.addEventListener("keydown", wake);

    const tick = (time, dt) => {
      const d = Math.min(dt, 50) / 1000;
      if (d <= 0) return;
      clock += d;

      if (s.drag) {
        cards.forEach((c, i) => {
          const a = wrap(c.a + i * STEP);
          const lag = 0.05 + (Math.abs(a) / 180) * 0.08;
          const prev = c.a;
          c.a += (s.dragTo - c.a) * (1 - Math.exp(-d / lag));
          c.v = (c.a - prev) / d;
          c.p = 0;
        });
      } else if (move) {
        const since = clock - move.start;
        cards.forEach((c) => {
          c.p = deal((since - c.delay) / DUR);
          const prev = c.a;
          c.a = c.from + (c.to - c.from) * c.p + c.v0 * COAST * coast(since / COAST);
          c.v = (c.a - prev) / d;
        });
        if (clock >= move.end) {
          cards.forEach((c) => {
            c.a = c.to;
            c.v = 0;
            c.p = 0;
          });
          if (visible) sound.land();
          move = null;
        }
      } else if (visible && !s.hover && !document.hidden && !prefersReducedMotion() && clock >= nextAuto) {
        s.goTo(s.target + STEP, false);
      }

      // Which card is in front; a flick each time one passes, whether you or
      // the deck itself is turning it, as long as the deck is on screen.
      const k = Math.round(s.angle() / STEP);
      if (k !== front) {
        front = k;
        setActive(mod(k));
        if (visible && (s.drag || move)) sound.flick(Math.max(0.45, Math.abs(cards[0].v) / 260));
      }

      // While the deck turns, the cards around the front part a little, so
      // the old front card and the new one are clear of each other by the
      // time they swap places in the stack; at rest the fan is unchanged.
      let q = 0;
      cards.forEach((c) => (q += Math.min(1, Math.max(0, c.p))));
      q /= cards.length;
      const openTo = s.drag ? 1 : move ? Math.min(1, 1.6 * Math.sin(Math.PI * q)) : 0;
      open += (openTo - open) * (1 - Math.exp(-d / 0.12));
      const spread = (a) => a * (1 + PART * open * Math.exp(-((a / PART_W) ** 2)));

      const placed = s.placed();
      const shown = placed.map(spread);
      shown
        .map((a, i) => [a, i])
        .sort((x, y) => Math.abs(y[0]) - Math.abs(x[0]))
        .forEach(([, i], rank) => {
          if (shownZ[i] !== rank) {
            slots[i].style.zIndex = String(10 + rank);
            shownZ[i] = rank;
          }
        });
      let near = 0;
      slots.forEach((el, i) => {
        const a = shown[i];
        if (Math.abs(placed[i]) < Math.abs(placed[near])) near = i;
        const push = Math.sin(Math.PI * Math.min(1, Math.max(0, cards[i].p))) * 10;
        el.style.transform = `rotate(${a.toFixed(3)}deg) translate3d(0, ${(-push).toFixed(2)}px, 0)`;
        const vis = Math.abs(a) > LOOP / 2 - STEP * 0.6 ? "hidden" : "visible";
        if (shownVis[i] !== vis) {
          el.style.visibility = vis;
          shownVis[i] = vis;
        }
      });
      if (near !== frontSlot) {
        slots[frontSlot]?.classList.remove("is-front");
        slots[near].classList.add("is-front");
        frontSlot = near;
      }
    };
    gsap.ticker.add(tick);
    return () => {
      io.disconnect();
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
      gsap.ticker.remove(tick);
    };
  }, [sound]);

  // Drag spins the deck; a tap on a card brings it to the front; the card
  // in front tilts toward the cursor and catches the light.
  useEffect(() => {
    const s = api.current;
    const el = wheel.current;
    const center = () => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const ang = (e) => {
      const c = center();
      return (Math.atan2(e.clientY - c.y, e.clientX - c.x) * 180) / Math.PI;
    };
    let press = null;

    const down = (e) => {
      if (e.button !== 0) return;
      sound.wake();
      press = {
        x: e.clientX,
        y: e.clientY,
        slot: e.target.closest(".ab-slot"),
        dragging: false,
        id: e.pointerId,
      };
      el.setPointerCapture(e.pointerId);
    };
    const moveP = (e) => {
      if (!press) {
        tilt(e);
        return;
      }
      if (!press.dragging && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 6) {
        press.dragging = true;
        s.grab();
        s.drag = { last: ang(e), v: 0, t: performance.now() };
        el.classList.add("is-drag");
        untilt();
      }
      if (!press.dragging) return;
      const a = ang(e);
      let da = a - s.drag.last;
      if (da > 180) da -= 360;
      if (da < -180) da += 360;
      s.dragTo += da;
      const now = performance.now();
      s.drag.v = s.drag.v * 0.6 + (da / Math.max(1, now - s.drag.t)) * 0.4;
      s.drag.last = a;
      s.drag.t = now;
    };
    const up = () => {
      if (!press) return;
      if (press.dragging) {
        const stale = performance.now() - s.drag.t > 90;
        const fling = stale ? 0 : s.drag.v * 180;
        s.drag = null;
        el.classList.remove("is-drag");
        s.goTo(Math.round((s.dragTo + fling) / STEP) * STEP, true);
      } else if (press.slot) {
        // A tap: bring that card round to the front.
        const i = [...el.querySelectorAll(".ab-slot")].indexOf(press.slot);
        const off = s.placed()[i];
        if (Math.abs(off) > STEP / 2) s.goTo(Math.round((s.target - off) / STEP) * STEP, true);
      }
      press = null;
    };

    let tilted = null;
    const tilt = (e) => {
      const face = e.target.closest(".ab-slot.is-front .ab-face");
      if (face !== tilted) untilt();
      if (!face || s.drag) return;
      tilted = face;
      const r = face.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      face.style.setProperty("--rx", `${((0.5 - y) * 10).toFixed(2)}deg`);
      face.style.setProperty("--ry", `${((x - 0.5) * 12).toFixed(2)}deg`);
      face.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      face.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      face.classList.add("is-tilt");
    };
    const untilt = () => {
      if (!tilted) return;
      tilted.classList.remove("is-tilt");
      tilted.style.removeProperty("--rx");
      tilted.style.removeProperty("--ry");
      tilted = null;
    };

    const enter = () => (s.hover = true);
    const leave = () => {
      s.hover = false;
      untilt();
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", moveP);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", moveP);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [sound]);

  const step = (dir) => {
    sound.wake();
    const s = api.current;
    s.goTo(s.target + dir * STEP, true);
  };

  const it = items[active];

  return (
    <section className="ab" id="about" ref={root} aria-labelledby="ab-title">
      <header className="ab-head">
        <p className="t-mono is-mute">( 02 — About )</p>
        <p className="t-mono ab-count">
          <span className="is-red">{String(active + 1).padStart(2, "0")}</span> / {String(N).padStart(2, "0")}
        </p>
      </header>

      <div className="ab-copy">
        <h2 id="ab-title" className="t-display ab-title" key={`t${active}`} aria-live="polite">
          <Words text={it.title} />
        </h2>
      </div>

      <div className="ab-right">
        <div className="ab-side" key={`b${active}`}>
          <p className="t-body ab-body">{it.body}</p>
          {it.cta && (
            <button type="button" className="t-mono ab-cta" onClick={() => scrollToTarget("#contact")}>
              Start a conversation <span aria-hidden="true">→</span>
            </button>
          )}
        </div>

        <div className="ab-controls">
          <button type="button" className="ab-btn" onClick={() => step(-1)} aria-label="Previous card">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="m11 6-6 6 6 6" />
            </svg>
          </button>
          <button type="button" className="ab-btn" onClick={() => step(1)} aria-label="Next card">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
          <button
            type="button"
            className={`t-mono ab-sound ${soundOn ? "is-on" : ""}`}
            onClick={() => {
              setSoundOn((v) => !v);
              sound.wake();
            }}
            aria-pressed={soundOn}
          >
            <span className="ab-eq" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            Sound {soundOn ? "on" : "off"}
          </button>
        </div>
      </div>

      <div
        className="ab-wheel"
        ref={wheel}
        aria-hidden="true"
        style={art ? { "--grain": `url(${art.grain})` } : undefined}
      >
        <div className="ab-ring">
          <svg viewBox="0 0 400 400">
            <defs>
              <path id="ab-circle" d="M200,200 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0" />
            </defs>
            <circle cx="200" cy="200" r="172" fill="none" stroke="#0e0d0c" strokeOpacity=".3" strokeDasharray="2 6" />
            <text className="ab-ring-text">
              <textPath href="#ab-circle">
                HOW I THINK · HOW I BUILD · HOW I THINK · HOW I BUILD · HOW I THINK · HOW I BUILD ·
              </textPath>
            </text>
          </svg>
        </div>
        {items.map((_, s) => {
          const idx = itemOf(s);
          const c = items[idx];
          return (
            <div className="ab-slot" key={s}>
              <article className="ab-card">
                <div className={`ab-face ab-${c.stock}`}>
                  <span className="ab-frame" />
                  <span className="ab-tag ab-tl">No. {String(idx + 1).padStart(2, "0")}</span>
                  <span className="ab-tag ab-tr">
                    VR<sup>®</sup>
                  </span>
                  {art && <img className="ab-art" src={art.img[idx]} alt="" draggable="false" />}
                  <span className="t-display ab-name">
                    <Words text={c.title} card />
                  </span>
                  <span className="ab-foot">
                    <Barcode seed={idx * 7 + 3} />
                    <span className="ab-tag">
                      S.01 — {String(idx + 1).padStart(2, "0")}/{String(N).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="ab-foil" />
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
