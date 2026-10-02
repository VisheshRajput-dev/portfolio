import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import "../v3.css";
import { gsap, ScrollTrigger, getLenis, prefersReducedMotion, splitChars, useSmoothScroll } from "../lib/motion";
import { attachStepSnap } from "../lib/stepSnap";
import { cases, findCase } from "../cases";
import { person, socials } from "../data";
import SEO from "../../components/SEO";
import { caseSeo } from "../../seo/site.mjs";
import "./CaseStudy.css";

/**
 * A project on a dark stage. The device (a phone for apps, a browser for
 * the web) holds centre stage while you scroll; each step is a chapter:
 * the screen wipes to the next one, the device turns, and the caption
 * beside it changes. Then the hard parts, and the next case.
 */

const pad = (n) => String(n).padStart(2, "0");

// How the device sits for each chapter: it turns a little every step.
const POSES = [
  [-16, 6],
  [12, 4],
  [-8, -3],
  [16, 5],
  [-13, -2],
  [7, 6],
  [-4, 2],
];

const Arrow = ({ d = "ne" }) => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d === "ne" && <path d="M7 17 17 7M8 7h9v9" />}
    {d === "w" && <path d="M19 12H5m6-6-6 6 6 6" />}
    {d === "e" && <path d="M5 12h14m-6-6 6 6-6 6" />}
    {d === "s" && <path d="M12 5v14m-6-6 6 6 6-6" />}
  </svg>
);

/** One screen. Until its file exists, a placeholder in the app's voice. */
function Screen({ chapter, name, on, videoRef }) {
  const [missing, setMissing] = useState(false);
  const cls = `cs-screen ${on ? "is-on" : ""}`;
  if (chapter.video) {
    return (
      <div className={cls}>
        <div className="cs-crop">
          <video ref={videoRef} src={chapter.video} poster={chapter.poster} muted loop playsInline preload="metadata" />
        </div>
      </div>
    );
  }
  if (missing || !chapter.src) {
    return (
      <div className={`${cls} cs-ph`}>
        <span className="t-mono">{name}</span>
        <strong className="t-display">{chapter.title}</strong>
        <span className="t-mono cs-ph-note">Screen coming soon</span>
      </div>
    );
  }
  return (
    <div className={cls}>
      <img src={chapter.src} alt={`${name}: ${chapter.title}`} onError={() => setMissing(true)} draggable="false" />
    </div>
  );
}

function Case({ c }) {
  const root = useRef(null);
  const stage = useRef(null);
  const video = useRef(null);
  const trigger = useRef(null);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const index = cases.indexOf(c);
  const next = cases[(index + 1) % cases.length];
  const n = c.chapters.length;
  const ch = c.chapters[active];
  const kinds = [...new Set(c.chapters.map((x) => x.device))];
  const [ry, rx] = POSES[active % POSES.length];

  // Scroll drives the chapter; each flick finishes one.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      trigger.current = ScrollTrigger.create({
        trigger: ".cs-stage",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const k = Math.round(self.progress * (n - 1));
          setActive((a) => (a === k ? a : k));
          gsap.set(".cs-prog i", { scaleX: self.progress });
        },
      });
    }, root);
    const stops = c.chapters.map((_, i) => i / (n - 1));
    const unsnap = n > 1 ? attachStepSnap(() => trigger.current, stops) : () => {};
    return () => {
      unsnap();
      ctx.revert();
    };
  }, [c, n]);

  // Opening and section reveals.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {}, root);
    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      ctx.add(() => {
        const title = splitChars(".cs-title");
        gsap
          .timeline({ defaults: { ease: "expo.out" }, delay: 0.1 })
          .from(title.chars, { yPercent: 115, duration: 1.5, stagger: 0.035 })
          .from(".cs-in", { y: 24, opacity: 0, duration: 1.1, stagger: 0.07 }, 0.5);
        // The device rises out of the opening as you scroll into the stage.
        gsap.from(".cs-rig", {
          yPercent: 30,
          scale: 0.86,
          ease: "none",
          scrollTrigger: { trigger: ".cs-stage", start: "top bottom", end: "top top", scrub: true },
        });
        gsap.utils.toArray(".cs-reveal").forEach((el) =>
          gsap.from(el, { y: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } })
        );
        const nextName = splitChars(".cs-next-name");
        gsap.from(nextName.chars, {
          yPercent: 115,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.03,
          scrollTrigger: { trigger: ".cs-next", start: "top 72%" },
        });
        ScrollTrigger.refresh();
      });
    });
    return () => {
      alive = false;
      ctx.revert();
    };
  }, []);

  // The device leans toward the cursor, on top of its pose.
  useEffect(() => {
    const el = stage.current;
    if (!el || prefersReducedMotion()) return undefined;
    const move = (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      el.style.setProperty("--px", `${(x * 8).toFixed(2)}deg`);
      el.style.setProperty("--py", `${(-y * 6).toFixed(2)}deg`);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // The recording plays only while its chapter is up.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (ch.video) {
      v.preload = "auto";
      v.play().catch(() => {});
    } else v.pause();
  }, [ch]);

  const goTo = (i) => {
    const st = trigger.current;
    const lenis = getLenis();
    if (!st) return;
    const y = st.start + (i / (n - 1)) * (st.end - st.start);
    if (lenis) lenis.scrollTo(y, { duration: 1.2, lock: true });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const goNext = (e) => {
    e.preventDefault();
    navigate(`/project/${next.slug}`);
  };

  const hasNotes = c.challenges || c.outcome || c.tech;
  const seo = caseSeo(c.slug);

  return (
    <div className="v3 cs" ref={root}>
      <SEO {...seo} />

      <header className="cs-bar">
        <Link to="/" className="cs-logo" aria-label="Home">
          VR<sup>®</sup>
        </Link>
        <Link to="/" state={{ to: "#work" }} className="t-mono cs-back">
          <Arrow d="w" /> All work
        </Link>
        <p className="t-mono cs-of">
          Case {pad(index + 1)} / {pad(cases.length)}
        </p>
        {c.links[0] ? (
          <a className="t-mono cs-pill" href={c.links[0].href} target="_blank" rel="noreferrer">
            Visit <Arrow />
          </a>
        ) : (
          <span />
        )}
      </header>

      <main>
        {/* Opening ------------------------------------------------------ */}
        <section className="cs-hero">
          <div className="cs-glow" aria-hidden="true" />
          <p className="t-mono cs-kick cs-in">
            ( Case {pad(index + 1)} — {c.kind} )
          </p>
          <div className="cs-hero-side">
            <p className="t-serif cs-tagline cs-in">
              <em>{c.tagline}</em>
            </p>
            <p className="t-body cs-lede cs-in">{c.lede}</p>
            <dl className="cs-meta cs-in">
              <div>
                <dt className="t-mono">Role</dt>
                <dd className="t-mono">{c.role}</dd>
              </div>
              <div>
                <dt className="t-mono">Platforms</dt>
                <dd className="t-mono">{c.platforms.join(" · ")}</dd>
              </div>
              {c.links.length > 0 && (
                <div>
                  <dt className="t-mono">Links</dt>
                  <dd className="t-mono cs-links">
                    {c.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                        {l.label} <Arrow />
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <h1 className="t-display cs-title" style={{ "--len": c.title.length }}>
            {c.title}
          </h1>
          <p className="t-mono cs-down cs-in">
            <Arrow d="s" /> {n} chapters
          </p>
        </section>

        {/* The stage ---------------------------------------------------- */}
        <section className="cs-stage" style={{ "--n": n }} aria-label={`${c.title}, chapter by chapter`}>
          <div className="cs-pin" ref={stage} data-device={ch.device}>
            <span className="cs-bignum t-display" aria-hidden="true" key={active}>
              {pad(active + 1)}
            </span>

            <div className="cs-caps" aria-live="polite">
              {c.chapters.map((x, i) => (
                <div key={x.title} className={`cs-cap ${i === active ? "is-on" : i < active ? "is-past" : ""}`}>
                  <p className="t-mono cs-cap-k">
                    <span className="is-red">{pad(i + 1)}</span> / {pad(n)} — {x.kicker}
                  </p>
                  <h2 className="t-display">{x.title}</h2>
                  <p className="t-body">{x.text}</p>
                </div>
              ))}
            </div>

            <div className="cs-rig" style={{ "--ry": `${ry}deg`, "--rx": `${rx}deg` }}>
              {kinds.includes("phone") && (
                <div className={`cs-phone ${ch.device === "phone" ? "is-shown" : ""}`}>
                  <div className="cs-phone-glass">
                    {c.chapters.map((x, i) =>
                      x.device === "phone" ? <Screen key={i} chapter={x} name={c.title} on={i === active || (ch.device !== "phone" && i === lastOf(c.chapters, "phone", active))} /> : null
                    )}
                    <span className="cs-island" />
                  </div>
                </div>
              )}
              {kinds.includes("web") && (
                <div className={`cs-web ${ch.device === "web" ? "is-shown" : ""}`}>
                  <div className="cs-web-bar">
                    <span className="cs-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="t-mono cs-url">{c.links[0]?.label || `${c.slug}.app`}</span>
                    <span />
                  </div>
                  <div className="cs-web-glass">
                    {c.chapters.map((x, i) =>
                      x.device === "web" ? (
                        <Screen
                          key={i}
                          chapter={x}
                          name={c.title}
                          on={i === active || (ch.device !== "web" && i === lastOf(c.chapters, "web", active))}
                          videoRef={x.video ? video : undefined}
                        />
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>

            <nav className="cs-steps" aria-label="Chapters">
              {c.chapters.map((x, i) => (
                <button
                  key={x.title}
                  type="button"
                  className={`t-mono ${i === active ? "is-on" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Chapter ${i + 1}: ${x.title}`}
                >
                  {pad(i + 1)}
                </button>
              ))}
              <span className="cs-prog" aria-hidden="true">
                <i />
              </span>
            </nav>
          </div>
        </section>

        {/* Notes -------------------------------------------------------- */}
        {hasNotes && (
          <section className="cs-notes">
            {c.challenges && (
              <div className="cs-hard">
                <p className="t-mono cs-label">( The hard parts )</p>
                <ol>
                  {c.challenges.map((t, i) => (
                    <li key={t} className="cs-reveal">
                      <span className="t-display">{pad(i + 1)}</span>
                      <p className="t-body">{t}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {c.outcome && (
              <blockquote className="t-serif cs-quote cs-reveal">
                <span className="is-red" aria-hidden="true">
                  “
                </span>
                {c.outcome}
              </blockquote>
            )}
            {c.tech && (
              <div className="cs-stack cs-reveal">
                <p className="t-mono cs-label">Built with</p>
                <ul>
                  {c.tech.map((t) => (
                    <li key={t} className="t-mono">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Next case ---------------------------------------------------- */}
        <a className="cs-next" href={`/project/${next.slug}`} onClick={goNext}>
          <div className="cs-next-top">
            <p className="t-mono">( Next case )</p>
            <p className="t-mono">
              {pad(cases.indexOf(next) + 1)} / {pad(cases.length)}
            </p>
          </div>
          <h2 className="t-display cs-next-name" style={{ "--len": next.title.length }}>
            {next.title}
          </h2>
          <div className="cs-next-foot">
            <p className="t-serif">
              <em>{next.tagline}</em>
            </p>
            <span className="t-mono cs-pill">
              Open case <Arrow d="e" />
            </span>
          </div>
        </a>

        <footer className="cs-foot">
          <a className="t-mono" href={`mailto:${person.email}`}>
            {person.email}
          </a>
          <ul>
            {socials.map((s) => (
              <li key={s.label}>
                <a className="t-mono" href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="t-mono">
            © {new Date().getFullYear()} {person.first} {person.last}
          </p>
        </footer>
      </main>
      <div className="v3-grain" aria-hidden="true" />
    </div>
  );
}

// When the stage shows the other device, the hidden one keeps the screen
// it last showed (the nearest chapter of its kind), so it never goes blank.
function lastOf(chapters, kind, active) {
  let best = -1;
  let dist = Infinity;
  chapters.forEach((x, i) => {
    if (x.device === kind && Math.abs(i - active) < dist) {
      best = i;
      dist = Math.abs(i - active);
    }
  });
  return best;
}

export default function CaseStudy() {
  const { slug } = useParams();
  const c = findCase(slug);
  const navigate = useNavigate();

  useSmoothScroll();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("v3-root", "cs-root");
    return () => html.classList.remove("v3-root", "cs-root");
  }, []);

  // Each case starts at the top.
  useLayoutEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [slug]);

  if (!c) {
    return (
      <div className="v3 cs cs-missing">
        <p className="t-mono">( 404 )</p>
        <h1 className="t-display">No such case</h1>
        <button type="button" className="t-mono cs-pill" onClick={() => navigate("/")}>
          <Arrow d="w" /> Back home
        </button>
      </div>
    );
  }
  // Old links (/project/1) move to the named URL.
  if (slug !== c.slug) return <Navigate to={`/project/${c.slug}`} replace />;
  return <Case key={c.id} c={c} />;
}
