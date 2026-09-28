import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../v3.css";
import { gsap, ScrollTrigger, getLenis, prefersReducedMotion, splitChars, useSmoothScroll } from "../lib/motion";
import { cases, caseById } from "../cases";
import { person, socials } from "../data";
import SEO from "../../components/SEO";
import "./CaseStudy.css";

/**
 * A project, told as an editorial case study: the name set big, the live
 * product playing in a browser frame, what it does, the screens on a
 * horizontal strip, the hard parts, what came of it, and the next case.
 */

const pad = (n) => String(n).padStart(2, "0");
const domain = (url) => url?.replace(/^https?:\/\//, "").replace(/\/$/, "");

const Arrow = ({ d = "ne" }) => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d === "ne" && (
      <>
        <path d="M7 17 17 7" />
        <path d="M8 7h9v9" />
      </>
    )}
    {d === "w" && (
      <>
        <path d="M19 12H5" />
        <path d="m11 6-6 6 6 6" />
      </>
    )}
    {d === "e" && (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    )}
  </svg>
);

function Browser({ url, children, className = "" }) {
  return (
    <div className={`cs-browser ${className}`}>
      <div className="cs-browser-bar">
        <span className="cs-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="t-mono cs-url">{url}</span>
        <span className="cs-dots cs-dots-ghost" aria-hidden="true" />
      </div>
      <div className="cs-browser-body">{children}</div>
    </div>
  );
}

function Case({ c }) {
  const root = useRef(null);
  const video = useRef(null);
  const navigate = useNavigate();
  const index = cases.indexOf(c);
  const next = cases[(index + 1) % cases.length];
  const [playing, setPlaying] = useState(false);

  // The recording only plays while it's on screen.
  useEffect(() => {
    const v = video.current;
    if (!v) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.preload = "auto";
          v.play()
            .then(() => setPlaying(true))
            .catch(() => {});
        } else {
          v.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.2 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {}, root);
    let alive = true;

    document.fonts.ready.then(() => {
      if (!alive) return;
      ctx.add(() => {
        // Opening: the name rises, then everything else settles in.
        const title = splitChars(".cs-title");
        gsap
          .timeline({ defaults: { ease: "expo.out" }, delay: 0.1 })
          .from(title.chars, { yPercent: 115, duration: 1.4, stagger: 0.035 })
          .from(".cs-in", { y: 24, opacity: 0, duration: 1.1, stagger: 0.06 }, 0.45)
          .from(".cs-meta > div", { y: 16, opacity: 0, duration: 1, stagger: 0.05 }, 0.7);

        // The film opens up as it comes into view.
        gsap.fromTo(
          ".cs-film .cs-browser",
          { scale: 0.84, borderRadius: 28 },
          {
            scale: 1,
            borderRadius: 10,
            ease: "none",
            scrollTrigger: { trigger: ".cs-film", start: "top bottom", end: "top 12%", scrub: true },
          }
        );

        // The overview reads itself in, word by word, as you scroll.
        gsap.fromTo(
          ".cs-ow",
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: ".cs-over-text", start: "top 78%", end: "bottom 52%", scrub: true },
          }
        );

        gsap.utils.toArray(".cs-reveal").forEach((el) =>
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          })
        );

        // Screens slide past on a strip while the section holds still.
        const mm = gsap.matchMedia();
        mm.add("(min-width: 761px)", () => {
          const track = root.current.querySelector(".cs-track");
          const dist = () => track.scrollWidth - window.innerWidth;
          gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
              trigger: ".cs-gal",
              start: "top top",
              end: () => `+=${dist()}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) => gsap.set(".cs-gal-bar i", { scaleX: self.progress }),
            },
          });
          gsap.to(".cs-gal-ghost", {
            xPercent: -20,
            ease: "none",
            scrollTrigger: { trigger: ".cs-gal", start: "top top", end: () => `+=${dist()}`, scrub: true },
          });
        });

        const nextName = splitChars(".cs-next-name");
        gsap.from(nextName.chars, {
          yPercent: 115,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.03,
          scrollTrigger: { trigger: ".cs-next", start: "top 70%" },
        });
        ScrollTrigger.refresh();
      });
    });

    return () => {
      alive = false;
      ctx.revert();
    };
  }, []);

  const goNext = (e) => {
    e.preventDefault();
    navigate(`/project/${next.id}`);
  };

  return (
    <div className="v3 cs" ref={root}>
      <SEO
        title={`${c.title} — case study | Vishesh Rajput`}
        description={c.line}
        keywords={`${c.title}, Vishesh Rajput, ${c.tech.join(", ")}`}
        image={c.cover}
      />

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
        <a className="t-mono cs-live" href={c.live} target="_blank" rel="noreferrer">
          Visit live <Arrow />
        </a>
      </header>

      <main>
        {/* Opening ------------------------------------------------------ */}
        <section className="cs-hero">
          <p className="t-mono is-mute cs-in">
            ( Case {pad(index + 1)} — {c.kind} )
          </p>
          <h1 className="t-display cs-title" style={{ "--len": c.title.length }}>
            {c.title}
          </h1>
          <div className="cs-lede">
            <p className="t-serif cs-tagline cs-in">
              <em>{c.tagline}</em>
            </p>
            <p className="t-body cs-line cs-in">{c.lede || c.line}</p>
          </div>
          <div className="cs-meta">
            <div>
              <p className="t-mono is-mute">Type</p>
              <p className="t-mono">{c.category}</p>
            </div>
            <div>
              <p className="t-mono is-mute">Built with</p>
              <p className="t-mono">{c.tech.slice(0, 4).join(" · ")}</p>
            </div>
            <div>
              <p className="t-mono is-mute">Live</p>
              <a className="t-mono cs-ul" href={c.live} target="_blank" rel="noreferrer">
                {domain(c.live)} <Arrow />
              </a>
            </div>
            <div>
              <p className="t-mono is-mute">Source</p>
              <a className="t-mono cs-ul" href={c.github} target="_blank" rel="noreferrer">
                GitHub <Arrow />
              </a>
            </div>
          </div>
        </section>

        {/* The product, running ------------------------------------------ */}
        <section className="cs-film" aria-label={`${c.title}, recorded`}>
          <Browser url={domain(c.live)}>
            <div className="cs-crop">
              <video ref={video} src={c.video} muted loop playsInline preload="metadata" />
            </div>
            <span className={`t-mono cs-rec ${playing ? "is-on" : ""}`}>
              <i /> Live recording
            </span>
          </Browser>
        </section>

        {/* Overview ----------------------------------------------------- */}
        <section className="cs-over">
          <p className="t-mono is-mute cs-label">( 01 — Overview )</p>
          <p className="cs-over-text">
            {c.overview.split(" ").map((w, i) => (
              <span key={i} className="cs-ow">
                {w}{" "}
              </span>
            ))}
          </p>
        </section>

        {/* What it does ------------------------------------------------- */}
        <section className="cs-feat">
          <p className="t-mono is-mute cs-label">( 02 — What it does )</p>
          <ol className="cs-feat-list">
            {c.highlights.map(([title, text], i) => (
              <li key={title} className="cs-reveal">
                <span className="t-mono is-red">{pad(i + 1)}</span>
                <h3 className="t-display">{title}</h3>
                <p className="t-body">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Screens ------------------------------------------------------ */}
        <section className="cs-gal" data-nav="dark" aria-label="Screens">
          <div className="cs-gal-ghost t-display" aria-hidden="true">
            Screens — {c.title} — Screens
          </div>
          <header className="cs-gal-head">
            <p className="t-mono">( 03 — Screens )</p>
            <div className="cs-gal-bar" aria-hidden="true">
              <i />
            </div>
          </header>
          <div className="cs-track">
            {c.gallery.map((src, i) => (
              <figure key={src} className="cs-shot">
                <Browser url={domain(c.live)}>
                  <img src={src} alt={`${c.title}, screen ${i + 1}`} loading="lazy" draggable="false" />
                </Browser>
                <figcaption className="t-mono">
                  Fig. {pad(i + 1)} <span>/ {pad(c.gallery.length)}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* The hard parts ----------------------------------------------- */}
        <section className="cs-hard" data-nav="dark">
          <p className="t-mono cs-label">( 04 — The hard parts )</p>
          <ol>
            {c.challenges.map((t, i) => (
              <li key={t} className="cs-reveal">
                <span className="t-display">{pad(i + 1)}</span>
                <p className="t-body">{t}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Outcome + stack ---------------------------------------------- */}
        <section className="cs-out">
          <p className="t-mono is-mute cs-label">( 05 — Outcome )</p>
          <blockquote className="t-serif cs-quote cs-reveal">
            <span className="is-red" aria-hidden="true">
              “
            </span>
            {c.outcome}
          </blockquote>
          <div className="cs-stack cs-reveal">
            <p className="t-mono is-mute">Stack</p>
            <ul>
              {c.tech.map((t) => (
                <li key={t} className="t-mono">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Next case ---------------------------------------------------- */}
        <a className="cs-next" href={`/project/${next.id}`} onClick={goNext} data-nav="dark">
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
            <span className="t-mono cs-next-go">
              Open case <Arrow d="e" />
            </span>
          </div>
          <img className="cs-next-cover" src={next.cover} alt="" aria-hidden="true" />
        </a>

        <footer className="cs-foot" data-nav="dark">
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

export default function CaseStudy() {
  const { id } = useParams();
  const c = caseById(id);
  const navigate = useNavigate();

  useSmoothScroll();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("v3-root");
    return () => html.classList.remove("v3-root");
  }, []);

  // Each case starts at the top.
  useLayoutEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [id]);

  if (!c) {
    return (
      <div className="v3 cs cs-missing">
        <p className="t-mono is-mute">( 404 )</p>
        <h1 className="t-display">No such case</h1>
        <button type="button" className="t-mono cs-live" onClick={() => navigate("/")}>
          <Arrow d="w" /> Back home
        </button>
      </div>
    );
  }
  return <Case key={c.id} c={c} />;
}
