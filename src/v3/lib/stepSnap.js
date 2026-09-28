import { getLenis, prefersReducedMotion } from "./motion";

/**
 * Snap-to-step scrolling for a pinned section: once scrolling settles
 * inside it, glide on to the next stop in the direction you were going,
 * so every flick, small or large, finishes a whole step.
 *
 * `getTrigger` returns the section's ScrollTrigger; `stops` are progress
 * values (0..1). Returns a cleanup function.
 */
export function attachStepSnap(getTrigger, stops) {
  // Smooth scrolling starts after the sections mount; wait for it.
  let lenis = null;
  let raf = 0;
  let idle = null;
  let snapping = false;
  let dir = 1;

  const settle = () => {
    const st = getTrigger();
    if (!st || snapping || !lenis) return;
    const range = st.end - st.start;
    const p = (lenis.scroll - st.start) / range;
    if (p <= 0.002 || p >= 0.998) return; // outside: scroll freely
    const eps = 0.006;
    if (stops.some((v) => Math.abs(v - p) <= eps)) return; // already resting on a step
    const target =
      dir > 0 ? stops.find((v) => v > p + eps) ?? 1 : [...stops].reverse().find((v) => v < p - eps) ?? 0;
    snapping = true;
    const dist = Math.abs(target - p) * range;
    lenis.scrollTo(st.start + target * range, {
      duration: prefersReducedMotion() ? 0 : Math.min(1.8, 0.9 + dist / 2400),
      easing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
      lock: true,
      onComplete: () => {
        snapping = false;
      },
    });
  };
  const onScroll = (l) => {
    if (l.direction) dir = l.direction;
    clearTimeout(idle);
    if (!snapping) idle = setTimeout(settle, 140);
  };
  const attach = () => {
    lenis = getLenis();
    if (!lenis) {
      raf = requestAnimationFrame(attach);
      return;
    }
    lenis.on("scroll", onScroll);
  };
  attach();

  return () => {
    cancelAnimationFrame(raf);
    clearTimeout(idle);
    lenis?.off("scroll", onScroll);
  };
}
