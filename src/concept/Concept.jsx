import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import avatar from "../assets/avatar.png";
import { deal, coast, BOUNCE_TAIL } from "../shared/deckEase";
import "./Concept.css";

/**
 * Concept: "The Deck". A poster-style hero: the name set in a waving line
 * over a red block, with outlined echoes; below, the work dealt as a wheel
 * of cards that turns on its own, with scroll, and when dragged.
 */

const NAME = "VISHESH RAJPUT";

const Plus = ({ style }) => <span className="cx-plus" style={style} aria-hidden="true" />;

function Barcode({ n = 34, seed = 3, color = "currentColor", h = 26 }) {
  let s = seed;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let x = 0;
  const bars = [];
  for (let i = 0; i < n; i++) {
    const w = 1 + Math.floor(r() * 3);
    if (i % 2 === 0) bars.push(<rect key={i} x={x} y="0" width={w} height={h} fill={color} />);
    x += w + 1;
  }
  return (
    <svg width={x} height={h} viewBox={`0 0 ${x} ${h}`} aria-hidden="true">
      {bars}
    </svg>
  );
}

const cards = [
  {
    kind: "portrait",
    body: (
      <>
        <img className="cx-card-photo" src={avatar} alt="Vishesh Rajput" />
        <span className="cx-tag cx-tl">Vishesh Rajput<br />Founding engineer</span>
        <span className="cx-tag cx-tr">VR<br />X26</span>
      </>
    ),
  },
  {
    kind: "shot dark",
    img: "/concept/realdesk_web-0.jpg",
    body: (
      <>
        <span className="cx-tag cx-tl">01 / Realdesk</span>
        <span className="cx-big">Real<br />Desk</span>
        <span className="cx-tag cx-bl">Internship simulator<br />React · Node · Firebase</span>
      </>
    ),
  },
  {
    kind: "ink",
    body: (
      <>
        <span className="cx-tag cx-tl">Now</span>
        <span className="cx-tag cx-tr">Dec 2025 →</span>
        <span className="cx-stack">Found&shy;ing<br />engi&shy;neer</span>
        <span className="cx-tag cx-bl">@ PointsFly<br />Web · App · AIRA</span>
        <span className="cx-plane" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="#d2372c"><path d="M2 11 22 3l-6 18-4-7-10-3z" /></svg>
        </span>
      </>
    ),
  },
  {
    kind: "shot",
    img: "/concept/devsync_web-3.jpg",
    body: (
      <>
        <span className="cx-tag cx-tl">02 / Devsync</span>
        <span className="cx-big">Dev<br />Sync</span>
        <span className="cx-tag cx-bl">Real-time code rooms<br />Socket.io · Monaco</span>
      </>
    ),
  },
  {
    kind: "paper",
    body: (
      <>
        <span className="cx-tag cx-tl">In numbers</span>
        <span className="cx-num">3+</span>
        <span className="cx-tag cx-bl">Client projects<br />in 2-week timelines</span>
        <span className="cx-tag cx-br"><Barcode seed={7} /></span>
      </>
    ),
  },
  {
    kind: "shot light",
    img: "/concept/vishti_shop_web-2.jpg",
    body: (
      <>
        <span className="cx-tag cx-tl">03 / Vishti-shop</span>
        <span className="cx-big">Vishti<br />Shop</span>
        <span className="cx-tag cx-bl">E-commerce, end to end<br />Cart · Pay · Orders</span>
      </>
    ),
  },
  {
    kind: "orb",
    body: (
      <>
        <span className="cx-tag cx-tl">AI</span>
        <span className="cx-orb-ball" aria-hidden="true" />
        <span className="cx-big cx-big-light">AIRA</span>
        <span className="cx-tag cx-bl">Autonomous rewards<br />agent · PointsFly</span>
      </>
    ),
  },
  {
    kind: "shot dark",
    img: "/concept/vishti_convertor_web-2.jpg",
    body: (
      <>
        <span className="cx-tag cx-tl">04 / Convertor</span>
        <span className="cx-big">Vishti<br />Conv.</span>
        <span className="cx-tag cx-bl">Image tools in-browser<br />Resize · Convert</span>
      </>
    ),
  },
  {
    kind: "paper process",
    body: (
      <>
        <span className="cx-tag cx-tl">Process</span>
        <ol className="cx-steps">
          <li><i>01</i>Sketch</li>
          <li><i>02</i>Ink</li>
          <li><i>03</i>Build</li>
          <li><i>04</i>Ship<b>↗</b></li>
        </ol>
      </>
    ),
  },
  {
    kind: "ticket",
    body: (
      <>
        <span className="cx-tag cx-tl">All stacks</span>
        <span className="cx-tag cx-tr cx-red">No. 001</span>
        <span className="cx-ticket-list">React<br />Node<br />Flutter<br />AWS</span>
        <span className="cx-tag cx-bl"><Barcode seed={11} color="#eeeae2" /></span>
      </>
    ),
  },
  {
    kind: "hello",
    body: (
      <>
        <span className="cx-tag cx-tl">Contact</span>
        <span className="cx-big">Say<br />hello</span>
        <span className="cx-tag cx-bl">visheshrajput.dev<br />@gmail.com</span>
        <span className="cx-tag cx-br">↗</span>
      </>
    ),
  },
  {
    kind: "red",
    body: (
      <>
        <div className="cx-card-center"><span className="cx-mark">VR<sup>®</sup></span></div>
        <span className="cx-tag cx-tl">▲</span>
        <span className="cx-tag cx-br">▼</span>
      </>
    ),
  },
];

function WaveLine({ text, className, lineRef }) {
  return (
    <span className={`cx-line ${className}`} ref={lineRef} aria-hidden="true">
      {[...text].map((c, i) => (
        <span key={i} className={c === " " ? "cx-ch cx-sp" : "cx-ch"}>
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}

export default function Concept() {
  const root = useRef(null);
  const wheel = useRef(null);
  const solid = useRef(null);
  const echoA = useRef(null);
  const echoB = useRef(null);
  const state = useRef({ angle: 0, drag: null, hover: false, wave: 1, mx: 0.5 });

  useEffect(() => {
    document.documentElement.classList.add("cx-root");
    window.scrollTo(0, 0);
    return () => document.documentElement.classList.remove("cx-root");
  }, []);

  // Intro choreography.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".cx-block", { scaleY: 0, transformOrigin: "50% 100%", duration: 1.3, ease: "expo.inOut" }, 0)
        .from(".cx-plus", { scale: 0, opacity: 0, duration: 0.8, stagger: 0.03 }, 0.2)
        .from(".cx-solid .cx-ch", { yPercent: 120, opacity: 0, duration: 1.2, stagger: 0.035 }, 0.55)
        .from([".cx-echo-a", ".cx-echo-b"], { opacity: 0, duration: 1.4 }, 1.0)
        .from(".cx-reveal", { y: 16, opacity: 0, duration: 1, stagger: 0.06 }, 0.9)
        .from(".cx-card", { y: "60vh", opacity: 0, duration: 1.5, stagger: 0.06, ease: "expo.out" }, 0.8)
        .from(".cx-ring", { scale: 0.6, opacity: 0, duration: 1.4 }, 1.2);
    }, root);
    return () => ctx.revert();
  }, []);

  // One loop drives the waving name and the deck.
  //
  // The deck is modelled on the reference video, measured frame by frame:
  // - a move is one card (24°) with a slow wind-up, a quick middle and a
  //   long soft settle (the fitted ease above);
  // - cards don't move as one block: the card at the back of the motion
  //   starts first and each card ahead of it a beat later, so the fan
  //   bunches up while it travels and fans back out as it settles; cards
  //   also drift slightly outward mid-move;
  // - the stacking order never changes (each card lies on its left
  //   neighbour); the deck rocks one card forward, holds, and rocks back.
  // Every change of plan (scroll, drag, release) keeps each card's current
  // speed, so motion never stops dead and restarts.
  useEffect(() => {
    const s = state.current;
    const slots = [...wheel.current.querySelectorAll(".cx-slot")];
    const n = slots.length;
    const step = 24;
    const loop = n * step;
    const DUR = 1.9;
    const STAGGER = 0.1;
    const COAST = 0.6;
    const HOLD = 1.8;
    s.step = step;

    const lines = [
      { el: solid.current, amp: 1, phase: 0, flip: 1 },
      { el: echoA.current, amp: 1.3, phase: 1.6, flip: 1 },
      { el: echoB.current, amp: 1.3, phase: 3.2, flip: -1 },
    ].map((l) => ({ ...l, chars: [...l.el.querySelectorAll(".cx-ch")] }));

    const wrap = (a) => ((((a + loop / 2) % loop) + loop) % loop) - loop / 2;

    // Each card's own view of the wheel angle, its speed, and its move.
    const cards = slots.map(() => ({ a: 0, v: 0, from: 0, to: 0, v0: 0, delay: 0, p: 0 }));
    const shownZ = slots.map(() => -1);
    const shownVis = slots.map(() => "");
    let move = null;
    let home = 0;
    let forward = true;
    let clock = 0;
    let holdUntil = 2.6; // first move waits for the intro

    const startMove = (target) => {
      const dir = Math.sign(target - cards[0].a) || 1;
      let maxDelay = 0;
      cards.forEach((c, i) => {
        c.from = c.a;
        c.to = target;
        c.v0 = c.v;
        // How far ahead this card is in the direction of travel.
        const lead = wrap(c.a + i * step) * dir;
        c.delay = STAGGER * Math.max(0, Math.min(8, (lead + 96) / step));
        maxDelay = Math.max(maxDelay, c.delay);
      });
      move = { start: clock, end: clock + Math.max(maxDelay + DUR * (1 + BOUNCE_TAIL), COAST) };
    };
    s.startMove = startMove;
    s.angle = () => cards.reduce((sum, c) => sum + c.a, 0) / n;
    s.snapTarget = (delta = 0) => Math.round((move ? cards[0].to : s.angle()) / step) * step + delta;
    s.rest = (target) => {
      home = target;
      forward = true;
    };
    s.grab = () => {
      move = null;
      s.dragTo = s.angle();
    };

    let t = 0;
    const tick = (time, dt) => {
      const d = Math.min(dt, 50) / 1000;
      if (d <= 0) return;
      clock += d;
      t += d;

      if (s.drag) {
        // Follow the pointer through a short per-card lag: smooth, and the
        // fan ripples a little behind the hand.
        cards.forEach((c, i) => {
          const a = wrap(c.a + i * step);
          const lag = 0.05 + (Math.abs(a) / 180) * 0.08;
          const prev = c.a;
          c.a += (s.dragTo - c.a) * (1 - Math.exp(-d / lag));
          c.v = (c.a - prev) / d;
          c.p = 0;
        });
      } else if (move) {
        const since = clock - move.start;
        cards.forEach((c) => {
          const u = (since - c.delay) / DUR;
          c.p = deal(u);
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
          move = null;
          holdUntil = clock + HOLD;
        }
      } else if (!s.hover && clock >= holdUntil) {
        // Rock: one card forward from home, then back home.
        startMove(forward ? home + step : home);
        forward = !forward;
      }

      // Stacking follows each card's place in the fan; it only changes when a
      // card crosses the seam at the bottom, so it is only written then.
      const placed = slots.map((_, i) => wrap(cards[i].a + i * step));
      const order = placed.map((a, i) => [a, i]).sort((x, y) => x[0] - y[0]);
      order.forEach(([, i], rank) => {
        if (shownZ[i] !== rank) {
          slots[i].style.zIndex = String(10 + rank);
          shownZ[i] = rank;
        }
      });
      slots.forEach((el, i) => {
        const a = placed[i];
        const push = Math.sin(Math.PI * Math.min(1, Math.max(0, cards[i].p))) * 10;
        el.style.transform = `rotate(${a.toFixed(3)}deg) translate3d(0, ${(-push).toFixed(2)}px, 0)`;
        const vis = Math.abs(a) > loop / 2 - step * 0.6 ? "hidden" : "visible";
        if (shownVis[i] !== vis) {
          el.style.visibility = vis;
          shownVis[i] = vis;
        }
      });

      const w = 0.35 + s.wave * 0.65;
      lines.forEach((l) => {
        l.chars.forEach((c, i) => {
          const ph = t * 1.6 + i * 0.52 + l.phase + (s.mx - 0.5) * 2;
          const yy = Math.sin(ph) * 0.09 * l.amp * w;
          const sy = 1 + Math.cos(ph) * 0.16 * l.amp * w;
          const rot = Math.cos(ph) * 5 * l.amp * w;
          c.style.transform = `translateY(${yy}em) rotate(${rot * l.flip}deg) scaleY(${sy * l.flip})`;
        });
      });
      s.wave += (1 - s.wave) * 0.02;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  // Drag turns the deck; on release the cards carry their speed into a
  // deal onto the nearest card. Scroll deals one card either way. Hover
  // pauses the rocking; the cursor stirs the wave.
  useEffect(() => {
    const s = state.current;
    const el = wheel.current;
    const center = () => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const ang = (e) => {
      const c = center();
      return (Math.atan2(e.clientY - c.y, e.clientX - c.x) * 180) / Math.PI;
    };
    const down = (e) => {
      s.grab();
      s.drag = { last: ang(e), v: 0, t: performance.now() };
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-drag");
    };
    const move = (e) => {
      if (!s.drag) return;
      const a = ang(e);
      let da = a - s.drag.last;
      if (da > 180) da -= 360;
      if (da < -180) da += 360;
      s.dragTo += da;
      const now = performance.now();
      // Smoothed pointer speed (deg/ms) for the fling.
      s.drag.v = s.drag.v * 0.6 + (da / Math.max(1, now - s.drag.t)) * 0.4;
      s.drag.last = a;
      s.drag.t = now;
    };
    const up = () => {
      if (!s.drag) return;
      const stale = performance.now() - s.drag.t > 90;
      const fling = stale ? 0 : s.drag.v * 180;
      s.drag = null;
      el.classList.remove("is-drag");
      const target = Math.round((s.dragTo + fling) / s.step) * s.step;
      s.startMove(target);
      s.rest(target);
    };
    let acc = 0;
    let lastY = window.scrollY;
    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (s.drag) return;
      acc += dy;
      if (Math.abs(acc) > 90) {
        const dir = Math.sign(acc);
        acc = 0;
        const target = s.snapTarget(dir * s.step);
        s.startMove(target);
        s.rest(target);
      }
    };
    const enter = () => (s.hover = true);
    const leave = () => (s.hover = false);
    const over = (e) => {
      s.mx = e.clientX / window.innerWidth;
      s.wave = Math.min(2.2, s.wave + Math.abs(e.movementX || 0) * 0.004);
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    window.addEventListener("pointermove", over);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      window.removeEventListener("pointermove", over);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="cx" ref={root}>
      <section className="cx-hero" aria-label="Introduction">
        {/* Registration marks */}
        {[6, 35, 65, 94].map((x) =>
          [11, 44].map((y) => <Plus key={`${x}-${y}`} style={{ left: `${x}%`, top: `${y}%` }} />)
        )}
        <span className="cx-arrow cx-arrow-l" aria-hidden="true" />
        <span className="cx-arrow cx-arrow-r" aria-hidden="true" />

        <header className="cx-top">
          <p className="cx-welcome cx-reveal">Welcome to<br />the work of</p>
          <nav className="cx-nav cx-reveal" aria-label="Sections">
            <a href="#work">Work</a>
            <a href="#process">Process</a>
            <a href="#journey">Journey</a>
            <a href="#contact">Contact</a>
          </nav>
          <span className="cx-logo cx-reveal" aria-label="VR">VR<sup>®</sup></span>
        </header>

        <div className="cx-block" aria-hidden="true" />

        <h1 className="cx-name" aria-label={NAME}>
          <WaveLine text={NAME} className="cx-echo-a" lineRef={echoA} />
          <WaveLine text={NAME} className="cx-solid" lineRef={solid} />
          <WaveLine text={NAME} className="cx-echo-b" lineRef={echoB} />
        </h1>

        <div className="cx-labels">
          <span className="cx-reveal">Founding engineer — PointsFly</span>
          <span className="cx-reveal cx-avail"><i />Available for projects</span>
          <span className="cx-reveal">Web · Mobile · AI — Noida, IN</span>
        </div>

        <div className="cx-wheel" ref={wheel} aria-label="Work, dealt as cards. Drag to spin.">
          <div className="cx-ring" aria-hidden="true">
            <svg viewBox="0 0 400 400">
              <defs>
                <path id="cx-circle" d="M200,200 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0" />
              </defs>
              <circle cx="200" cy="200" r="172" fill="none" stroke="#0e0d0c" strokeOpacity=".35" strokeDasharray="2 6" />
              <text className="cx-ring-text">
                <textPath href="#cx-circle">SKETCH · INK · BUILD · SHIP · SKETCH · INK · BUILD · SHIP · SKETCH · INK · BUILD · SHIP ·</textPath>
              </text>
            </svg>
            <span className="cx-me">▲<br />ME</span>
          </div>
          {cards.map((c, i) => (
            <div className="cx-slot" key={i}>
              <article className="cx-card">
                <div className={`cx-face cx-${c.kind.split(" ").join(" cx-")}`}>
                  {c.img && <img className="cx-card-img" src={c.img} alt="" draggable="false" />}
                  {c.body}
                  <span className="cx-idx">{String(i + 1).padStart(2, "0")}/{cards.length}</span>
                </div>
              </article>
            </div>
          ))}
        </div>

        <p className="cx-hint cx-reveal">( Drag the deck )</p>
      </section>
      <div className="cx-after">
        <p>Scroll to spin the deck — the rest of the page comes next.</p>
      </div>
    </div>
  );
}
