/**
 * The card deck's motion curves, shared by /concept and the home page deck.
 */

// The deck's ease: a cubic-bezier(0.47, 0, 0.15, 1) least-squares fitted to
// the reference card's measured positions (within ~1.4%). A smooth curve
// rather than the raw samples, so the speed never wobbles.
function bezierEase(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const e = sx(t) - x;
      const d = dx(t);
      if (Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    if (t < 0 || t > 1 || Math.abs(sx(t) - x) > 1e-4) {
      let lo = 0, hi = 1;
      for (let i = 0; i < 24; i++) {
        t = (lo + hi) / 2;
        if (sx(t) < x) lo = t;
        else hi = t;
      }
    }
    return sy(t);
  };
}
const settle = bezierEase(0.47, 0, 0.15, 1.3);
const SETTLE_END_V = -0.35; // slope of `settle` at u = 1 (it is heading back)
const BOUNCE_W = Math.PI / 0.14; // second bounce: half a swing in 0.14 of a move
const BOUNCE_DECAY = 0.12;
export const BOUNCE_TAIL = 0.5; // how long the tail rings, in moves

// The deck's move: the fitted curve pushed slightly past its mark (~4%),
// then a small damped second bounce, with speed continuous throughout, so
// each card lands, overshoots, dips back and settles.
export function deal(u) {
  if (u <= 0) return 0;
  if (u <= 1) return settle(u);
  const t = u - 1;
  if (t >= BOUNCE_TAIL) return 1;
  return 1 + (SETTLE_END_V / BOUNCE_W) * Math.exp(-t / BOUNCE_DECAY) * Math.sin(BOUNCE_W * t);
}

// Momentum carried into a new move: starts at slope 1, fades to rest.
export const coast = (u) => (u <= 0 ? 0 : u >= 1 ? 0 : u * (1 - u) * (1 - u));
