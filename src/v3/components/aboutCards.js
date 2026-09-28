/**
 * Art for the About deck: each card carries a small line engraving (the
 * hero portrait's language, horizontal burin lines whose weight follows
 * the light), painted once into a canvas.
 */

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const L = (() => {
  const v = [-0.55, -0.6, 0.58];
  const n = Math.hypot(...v);
  return v.map((x) => x / n);
})();
const light = (nx, ny, nz) => Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);

function pip(poly, x, y) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/* Each motif maps a point (u, v in 0..1) to a tone l (0 dark .. 1 lit), an
   optional vertical warp dy, or null where there's nothing to engrave. */

const shadow = (u, v, cx, cy, rx, ry) => {
  const e = ((u - cx) / rx) ** 2 + ((v - cy) / ry) ** 2;
  return e < 1 ? { l: 0.05 + e * 0.25 } : null;
};

export const motifs = {
  // Concentric rings, like a seal.
  seal(u, v) {
    const d = Math.hypot(u - 0.5, v - 0.5);
    if (d > 0.42) return null;
    return { l: 0.5 + 0.5 * Math.cos(d * Math.PI * 2 * 8.5) * (1 - d * 0.6) };
  },
  // A lit sphere: one finished thing.
  sphere(u, v) {
    const dx = (u - 0.5) / 0.34;
    const dy = (v - 0.46) / 0.34;
    const r2 = dx * dx + dy * dy;
    if (r2 > 1) return shadow(u, v, 0.52, 0.86, 0.3, 0.035);
    const dz = Math.sqrt(1 - r2);
    return { l: 0.06 + 0.9 * light(dx, dy, dz) ** 1.3 + 0.18 * (1 - dz) ** 4 };
  },
  // Three floating layers: the whole stack.
  layers(u, v) {
    const rx = 0.34;
    const ry = 0.1;
    const th = 0.055;
    const x = (u - 0.5) / rx;
    if (Math.abs(x) > 1) return null;
    const sq = Math.sqrt(1 - x * x);
    for (const yc of [0.3, 0.47, 0.64]) {
      if (Math.abs(v - yc) <= ry * sq) return { l: 0.62 + 0.3 * (1 - (u - 0.5 + (v - yc)) * 1.4) * 0.5 };
      if (v > yc && v <= yc + th + ry * sq) return { l: 0.14 + 0.36 * (1 - x) * 0.5 };
    }
    return shadow(u, v, 0.5, 0.86, 0.32, 0.035);
  },
  // Lines that flow: motion.
  flow(u, v) {
    const d = Math.hypot(u - 0.5, v - 0.5);
    if (d > 0.43) return null;
    const fade = clamp01((0.43 - d) / 0.08);
    return {
      l: (0.25 + 0.55 * (0.5 + 0.5 * Math.sin(u * 7 - v * 4))) * fade,
      dy: 0.04 * Math.sin(u * 9 + v * 5) * fade,
    };
  },
  // A comet with its trail: speed.
  comet(u, v) {
    const hx = 0.68;
    const hy = 0.5;
    const r = 0.14;
    const dx = (u - hx) / r;
    const dy = (v - hy) / r;
    const r2 = dx * dx + dy * dy;
    if (r2 <= 1) {
      const dz = Math.sqrt(1 - r2);
      return { l: 0.1 + 0.88 * light(dx, dy, dz) ** 1.2 };
    }
    if (u < hx && u > 0.08) {
      const k = (u - 0.08) / (hx - 0.08);
      const half = r * (0.2 + 0.8 * k);
      if (Math.abs(v - hy) < half) return { l: k ** 1.6 * (1 - (Math.abs(v - hy) / half) ** 2) * 0.85 };
    }
    return null;
  },
  // A plain, solid cube: boring where it counts.
  cube(u, v) {
    const cx = 0.5;
    const cy = 0.52;
    const s = 0.27;
    const h = s * 0.866;
    const top = [[cx, cy - s], [cx + h, cy - s / 2], [cx, cy], [cx - h, cy - s / 2]];
    const left = [[cx - h, cy - s / 2], [cx, cy], [cx, cy + s], [cx - h, cy + s / 2]];
    const right = [[cx, cy], [cx + h, cy - s / 2], [cx + h, cy + s / 2], [cx, cy + s]];
    if (pip(top, u, v)) return { l: 0.9 - (v - (cy - s)) * 0.5 };
    if (pip(left, u, v)) return { l: 0.5 + (u - cx) * 0.4 };
    if (pip(right, u, v)) return { l: 0.2 + (cx + h - u) * 0.3 };
    return shadow(u, v, 0.52, 0.88, 0.3, 0.03);
  },
  // A ring: leave it better, go round again.
  torus(u, v) {
    const x = u - 0.5;
    const y = (v - 0.48) / 0.62;
    const dist = Math.hypot(x, y);
    const R = 0.27;
    const r = 0.1;
    const d = dist - R;
    if (Math.abs(d) > r) return shadow(u, v, 0.5, 0.84, 0.3, 0.035);
    const k = d / r;
    const nz = Math.sqrt(1 - k * k);
    return { l: 0.06 + 0.9 * light((x / dist) * k, (y / dist) * k, nz) ** 1.25 };
  },
  // A bevelled arrow, up and to the right: your move.
  arrow(u, v) {
    const c = Math.SQRT1_2;
    const x0 = u - 0.5;
    const y0 = v - 0.5;
    // Rotate so the arrow points straight up in (x, y).
    const x = x0 * c + y0 * c;
    const y = -x0 * c + y0 * c;
    const inShaft = Math.abs(x) < 0.06 && y > -0.08 && y < 0.3;
    const inHead = y >= -0.34 && y <= -0.08 && Math.abs(x) < (y + 0.34) * 0.85;
    if (!inShaft && !inHead) return null;
    return { l: x < 0 ? 0.88 : 0.3 };
  },
};

/** Paint a motif as engraved lines into a transparent canvas; returns a data URL. */
export function engrave(motif, { color, invert = false, size = 560, gap = 7 }) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  g.fillStyle = color;
  for (let y = gap / 2; y < size; y += gap) {
    const top = [];
    const bot = [];
    let any = false;
    for (let x = 0; x <= size; x += 3) {
      const r = motif(x / size, y / size);
      let t = 0;
      let dy = 0;
      if (r) {
        const l = invert ? 1 - r.l : r.l;
        t = clamp01(l) * gap * 0.9;
        dy = (r.dy || 0) * size;
        if (t > 0.2) any = true;
      }
      top.push([x, y + dy - t / 2]);
      bot.push([x, y + dy + t / 2]);
    }
    if (!any) continue;
    g.beginPath();
    top.forEach(([x, yy], i) => (i ? g.lineTo(x, yy) : g.moveTo(x, yy)));
    for (let i = bot.length - 1; i >= 0; i--) g.lineTo(bot[i][0], bot[i][1]);
    g.closePath();
    g.fill();
  }
  return c.toDataURL("image/png");
}

/** A small tile of paper grain, used on every card face. */
export function grain() {
  const c = document.createElement("canvas");
  c.width = 160;
  c.height = 160;
  const g = c.getContext("2d");
  const img = g.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = n;
    img.data[i + 3] = 22;
  }
  g.putImageData(img, 0, 0);
  return c.toDataURL("image/png");
}
