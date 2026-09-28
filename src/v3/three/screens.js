import * as THREE from "three";

/**
 * The laptop and phone screens, painted into canvases that are mapped onto
 * the 3D glass. Living in the scene (not as HTML over it) keeps them locked
 * to the devices with no lag, hidden when the lid is shut, and lit like
 * everything else.
 */

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ramp = (v, a, b) => clamp01((v - a) / (b - a));
const smooth = (v) => v * v * (3 - 2 * v);

const loadImage = (src) =>
  new Promise((res) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => res(null);
    i.src = src;
  });

function makeTexture(canvas, renderer) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 4;
  return t;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ------------------------------------------------------------------ */
/* Laptop: this page being made                                         */
/* ------------------------------------------------------------------ */

// Laid out in a 1440×900 page; painted at a higher resolution.
const PW = 1440, PH = 900, BAR = 52;
const SCALE = 1.25;

const STAGES = [
  { at: 0, url: "sketch — hero / draft 1" },
  { at: 0.4, url: "localhost:3100 — type & grid" },
  { at: 0.56, url: "localhost:3100 — motion" },
  { at: 0.7, url: "localhost:3100 — build" },
  { at: 0.82, url: "visheshrajput.dev" },
];

export function createLaptopScreen(renderer) {
  const canvas = document.createElement("canvas");
  canvas.width = PW * SCALE;
  canvas.height = PH * SCALE;
  const ctx = canvas.getContext("2d");
  const texture = makeTexture(canvas, renderer);

  const assets = { paths: [], notes: [], img: {} };
  let ready = false;
  let last = "";

  // The pencil sketch: real strokes from the SVG, measured once so each
  // can be drawn on with a dash.
  const loadSketch = async () => {
    const text = await fetch("/process/sketch.svg").then((r) => r.text());
    const host = document.createElement("div");
    host.style.cssText = "position:absolute;left:-9999px;top:0;width:1440px;height:900px;visibility:hidden";
    host.innerHTML = text;
    document.body.appendChild(host);
    host.querySelectorAll("path").forEach((p) => {
      const d = p.getAttribute("d");
      if (!d) return;
      assets.paths.push({
        path: new Path2D(d),
        len: p.getTotalLength(),
        stroke: p.getAttribute("stroke") || "#3b3935",
        width: parseFloat(p.getAttribute("stroke-width") || "1.5"),
      });
    });
    host.querySelectorAll("text").forEach((t) => {
      const m = /rotate\(([-\d.]+)/.exec(t.getAttribute("transform") || "");
      assets.notes.push({
        text: t.textContent,
        x: parseFloat(t.getAttribute("x")),
        y: parseFloat(t.getAttribute("y")),
        size: parseFloat(t.getAttribute("font-size") || "30"),
        fill: t.getAttribute("fill") || "#3b3935",
        rot: m ? parseFloat(m[1]) : 0,
      });
    });
    host.remove();
  };

  const init = Promise.all([
    loadSketch(),
    ...["ink", "build", "engrave", "ship"].map((k) => loadImage(`/process/${k}.jpg`).then((i) => (assets.img[k] = i))),
    document.fonts.load("700 30px Caveat"),
    document.fonts.load("400 15px 'JetBrains Mono'"),
  ]).then(() => {
    ready = true;
    last = "";
  });

  // Page image, cover-fitted under the browser bar, anchored at the top.
  const page = (img, alpha = 1, scale = 1) => {
    if (!img || alpha <= 0) return;
    const w = PW, h = PH - BAR;
    const k = Math.max(w / img.width, h / img.height) * scale;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (w - img.width * k) / 2, BAR, img.width * k, img.height * k);
    ctx.globalAlpha = 1;
  };

  function draw(s) {
    const key = ready ? s.toFixed(4) : "wait";
    if (key === last) return false;
    last = key;

    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    ctx.fillStyle = "#f1ede4";
    ctx.fillRect(0, 0, PW, PH);

    if (ready) {
      // 1. Sketch: strokes draw in order, notes are written after.
      const draw = ramp(s, 0.02, 0.34);
      const sketchAlpha = 1 - smooth(ramp(s, 0.46, 0.54));
      if (sketchAlpha > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, BAR, PW, PH - BAR);
        ctx.clip();
        ctx.globalAlpha = sketchAlpha;
        ctx.lineCap = "round";
        const n = assets.paths.length || 1;
        assets.paths.forEach((p, i) => {
          const k = smooth(clamp01((draw - (i / n) * 0.8) / 0.2));
          if (k <= 0) return;
          ctx.strokeStyle = p.stroke;
          ctx.lineWidth = p.width;
          ctx.setLineDash([p.len, p.len]);
          ctx.lineDashOffset = p.len * (1 - k);
          ctx.stroke(p.path);
        });
        ctx.setLineDash([]);
        assets.notes.forEach((t, i) => {
          const a = smooth(ramp(draw, 0.72 + i * 0.03, 0.86 + i * 0.03));
          if (a <= 0) return;
          ctx.save();
          ctx.globalAlpha = a * sketchAlpha;
          ctx.translate(t.x, t.y + (1 - a) * 6);
          ctx.rotate((t.rot * Math.PI) / 180);
          ctx.fillStyle = t.fill;
          ctx.font = `700 ${t.size}px Caveat`;
          ctx.fillText(t.text, 0, 0);
          ctx.restore();
        });
        ctx.restore();
      }

      // 2. Ink wipes in from the left.
      const ink = smooth(ramp(s, 0.38, 0.5));
      if (ink > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, BAR, PW * ink, PH - BAR);
        ctx.clip();
        page(assets.img.ink);
        ctx.restore();
      }
      // 3–5. Motion, build, and the live page.
      page(assets.img.engrave, smooth(ramp(s, 0.54, 0.6)));
      page(assets.img.build, smooth(ramp(s, 0.68, 0.74)));
      const ship = smooth(ramp(s, 0.8, 0.9));
      page(assets.img.ship, ship, 1.04 - ship * 0.04);
    }

    // Browser bar.
    ctx.fillStyle = "#e4e0d7";
    ctx.fillRect(0, 0, PW, BAR);
    ctx.fillStyle = "rgba(14,13,12,0.1)";
    ctx.fillRect(0, BAR - 1, PW, 1);
    ["#d2372c", "rgba(14,13,12,.18)", "rgba(14,13,12,.18)"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(28 + i * 22, BAR / 2, 6.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    roundRect(ctx, PW / 2 - 310, 10, 620, 32, 8);
    ctx.fill();
    const phase = STAGES.reduce((acc, st, i) => (s >= st.at ? i : acc), 0);
    ctx.fillStyle = "#3b3935";
    ctx.font = "400 15px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(STAGES[phase].url, PW / 2, BAR / 2 + 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    // Loading line between stages.
    const from = STAGES[phase].at;
    const to = STAGES[phase + 1]?.at ?? 1;
    const load = phase === STAGES.length - 1 ? 1 : smooth(ramp(s, from, from + (to - from) * 0.35));
    ctx.fillStyle = "#d2372c";
    ctx.fillRect(0, BAR - 2, PW * load, 2);

    texture.needsUpdate = true;
    return true;
  }

  return { texture, draw, init, dispose: () => texture.dispose() };
}

/* ------------------------------------------------------------------ */
/* Phone: the lock screen                                               */
/* ------------------------------------------------------------------ */

const LW = 390, LH = 834, LS = 2;

// Wallpaper: an engraved sphere, the same line-work as the hero portrait,
// lit from the upper left and warmed by a red glow. Painted once.
function paintWallpaper() {
  const c = document.createElement("canvas");
  c.width = LW * LS;
  c.height = LH * LS;
  const g = c.getContext("2d");
  g.scale(LS, LS);

  let grad = g.createLinearGradient(0, 0, 0, LH);
  grad.addColorStop(0, "#151311");
  grad.addColorStop(1, "#0b0a09");
  g.fillStyle = grad;
  g.fillRect(0, 0, LW, LH);

  grad = g.createRadialGradient(LW * 0.5, LH * 0.98, 0, LW * 0.5, LH * 0.98, LH * 0.55);
  grad.addColorStop(0, "rgba(210,55,44,0.5)");
  grad.addColorStop(0.5, "rgba(150,34,26,0.16)");
  grad.addColorStop(1, "rgba(210,55,44,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, LW, LH);

  // Horizontal engraving lines; each one swells where the sphere is lit.
  const cx = LW * 0.62, cy = LH * 0.6, R = LW * 0.62;
  const L = [-0.55, -0.62, 0.56];
  for (let y = 4; y < LH; y += 5) {
    g.beginPath();
    const pts = [];
    for (let x = -4; x <= LW + 4; x += 3) {
      const dx = (x - cx) / R, dy = (y - cy) / R;
      const r2 = dx * dx + dy * dy;
      let lum = 0.03;
      if (r2 < 1) {
        const dz = Math.sqrt(1 - r2);
        lum = Math.max(0, dx * L[0] + dy * L[1] + dz * L[2]) ** 1.6 * 0.95 + 0.06;
      }
      pts.push([x, lum]);
    }
    // Stroke as a ribbon whose half-width follows the light.
    pts.forEach(([x, lum], i) => (i ? g.lineTo(x, y - lum * 1.6) : g.moveTo(x, y - lum * 1.6)));
    for (let i = pts.length - 1; i >= 0; i--) g.lineTo(pts[i][0], y + pts[i][1] * 1.6);
    g.closePath();
    g.fillStyle = "rgba(243,240,234,0.34)";
    g.fill();
  }

  // A soft shade under the clock so it always reads.
  grad = g.createLinearGradient(0, 0, 0, 300);
  grad.addColorStop(0, "rgba(11,10,9,0.55)");
  grad.addColorStop(1, "rgba(11,10,9,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, LW, 300);
  return c;
}

export function createPhoneScreen(renderer, timeZone) {
  const canvas = document.createElement("canvas");
  canvas.width = LW * LS;
  canvas.height = LH * LS;
  const ctx = canvas.getContext("2d");
  const texture = makeTexture(canvas, renderer);
  let last = "";
  let fontsReady = false;
  Promise.all([
    document.fonts.load("700 104px Archivo"),
    document.fonts.load("900 15px Archivo"),
  ]).then(() => {
    fontsReady = true;
    last = "";
  });

  const wallpaper = paintWallpaper();

  const time = () => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(new Date());
  const date = () => new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone }).format(new Date());

  function draw(w) {
    const t = time();
    const key = `${w.toFixed(3)}|${t}|${fontsReady}`;
    if (key === last) return false;
    last = key;

    ctx.setTransform(LS, 0, 0, LS, 0, 0);
    ctx.clearRect(0, 0, LW, LH);
    ctx.save();
    roundRect(ctx, 0, 0, LW, LH, 52);
    ctx.clip();

    ctx.drawImage(wallpaper, 0, 0, LW, LH);

    const ink = "#f3f0ea";
    ctx.fillStyle = ink;
    ctx.font = "600 16px Archivo, sans-serif";
    ctx.fillText(t, 34, 42);
    // Status icons.
    ctx.fillRect(LW - 96, 32, 16, 11);
    ctx.fillRect(LW - 74, 32, 16, 11);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    roundRect(ctx, LW - 52, 31, 26, 13, 4);
    ctx.stroke();
    ctx.fillRect(LW - 50, 33, 17, 9);

    ctx.textAlign = "center";
    ctx.globalAlpha = 0.85;
    ctx.font = "500 19px Archivo, sans-serif";
    ctx.fillText(date(), LW / 2, 120);
    ctx.globalAlpha = 1;
    ctx.font = "700 104px Archivo, sans-serif";
    ctx.fillText(t, LW / 2, 222);
    ctx.textAlign = "left";

    // A reminder drops in with a little overshoot.
    const n = clamp01((w - 0.35) / 0.4);
    if (n > 0) {
      const e = 1 + 2.2 * Math.pow(n - 1, 3) + 1.2 * Math.pow(n - 1, 2);
      const y = 270 + (1 - e) * -140;
      const a = smooth(clamp01(n * 2));
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = "rgba(38,35,33,0.9)";
      roundRect(ctx, 14, y, LW - 28, 104, 24);
      ctx.fill();
      ctx.strokeStyle = "rgba(243,240,234,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Reminders-style icon: ivory tile, a red ring, two lines.
      ctx.fillStyle = ink;
      roundRect(ctx, 28, y + 16, 38, 38, 9);
      ctx.fill();
      ctx.strokeStyle = "#d2372c";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(39, y + 29, 4.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#d2372c";
      ctx.beginPath();
      ctx.arc(39, y + 42, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(14,13,12,0.35)";
      ctx.fillRect(48, y + 28, 12, 2);
      ctx.fillRect(48, y + 41, 12, 2);

      ctx.fillStyle = ink;
      ctx.globalAlpha = a * 0.55;
      ctx.font = "600 11px Archivo, sans-serif";
      ctx.fillText("REMINDERS", 80, y + 27);
      ctx.textAlign = "right";
      ctx.font = "400 13px Archivo, sans-serif";
      ctx.fillText("now", LW - 30, y + 27);
      ctx.textAlign = "left";
      ctx.globalAlpha = a;
      ctx.font = "700 16px Archivo, sans-serif";
      ctx.fillText("Time to upgrade the portfolio", 80, y + 50);
      ctx.globalAlpha = a * 0.8;
      ctx.font = "400 14px Archivo, sans-serif";
      ctx.fillText("New work, new motion. Ship v3", 80, y + 71);
      ctx.fillText("before the weekend.", 80, y + 89);
      ctx.restore();
    }

    // Lock-screen buttons and the home bar.
    ctx.fillStyle = "rgba(40,38,36,0.6)";
    [71, LW - 71].forEach((x) => {
      ctx.beginPath();
      ctx.arc(x, LH - 47, 25, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = ink;
    roundRect(ctx, LW / 2 - 70, LH - 14, 140, 5, 3);
    ctx.fill();

    // Screen off → on.
    const off = 1 - smooth(clamp01(w * 2.2));
    if (off > 0) {
      ctx.fillStyle = `rgba(4,4,5,${off})`;
      ctx.fillRect(0, 0, LW, LH);
    }
    ctx.restore();
    texture.needsUpdate = true;
    return true;
  }

  return { texture, draw, dispose: () => texture.dispose() };
}

/* ------------------------------------------------------------------ */
/* The mark on the back of the lid                                      */
/* ------------------------------------------------------------------ */

export async function createMarkTexture() {
  await document.fonts.load("900 200px Archivo");
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 150px Archivo, sans-serif";
  ctx.fillText("VR", 236, 136);
  ctx.font = "700 40px Archivo, sans-serif";
  ctx.fillText("®", 420, 74);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 8;
  return t;
}
