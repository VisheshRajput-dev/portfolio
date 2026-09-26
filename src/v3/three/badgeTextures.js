import * as THREE from "three";

/**
 * Printed faces for the ID badge and its strap, drawn on 2D canvases so the
 * card carries the same engraving language as the rest of the site.
 */

const INK = "#0e0d0c";
const IVORY = "#eeeae2";
const RED = "#d2372c";
const MUTE = "#8f8a82";

const W = 800;
const H = 1125; // 1.6 : 2.25

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/** Re-draw a photo as horizontal engraved lines whose weight follows tone. */
function engraveInto(ctx, img, x, y, w, h) {
  const tmp = document.createElement("canvas");
  tmp.width = w;
  tmp.height = h;
  const t = tmp.getContext("2d");
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  t.drawImage(img, (w - dw) / 2, h - dh, dw, dh);
  const { data } = t.getImageData(0, 0, w, h);

  const gap = 6;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = IVORY;
  for (let row = 0; row < h; row += gap) {
    for (let col = 0; col < w; col += 2) {
      const i = ((row + (gap >> 1)) * w + col) * 4;
      const a = data[i + 3] / 255;
      if (a < 0.1) continue;
      const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      const tone = Math.pow(lum, 0.72);
      // Ivory lines on the black card: brighter tone, thicker line.
      const thick = Math.max(0, Math.min(gap - 0.5, tone * gap * 1.15)) * a;
      if (thick > 0.3) ctx.fillRect(x + col, y + row + (gap - thick) / 2, 2, thick);
    }
  }
  ctx.restore();
}

function barcode(ctx, x, y, w, h) {
  let cx = x;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  while (cx < x + w) {
    const bw = 1 + Math.floor(rnd() * 4);
    if (rnd() > 0.35) ctx.fillRect(cx, y, bw, h);
    cx += bw + 1 + Math.floor(rnd() * 3);
  }
}

export async function createCardTextures({ portrait, name, role, company }) {
  await document.fonts.ready;
  const img = await loadImage(portrait);

  // Front ---------------------------------------------------------------
  const front = document.createElement("canvas");
  front.width = W;
  front.height = H;
  const f = front.getContext("2d");
  f.fillStyle = INK;
  f.fillRect(0, 0, W, H);

  // Slot for the clip
  f.fillStyle = "#1e1c1a";
  f.beginPath();
  f.roundRect(W / 2 - 70, 34, 140, 22, 11);
  f.fill();

  f.font = "500 22px 'JetBrains Mono', monospace";
  f.fillStyle = IVORY;
  f.fillText("ACCESS — ALL STACKS", 56, 118);
  f.fillStyle = RED;
  f.textAlign = "right";
  f.fillText("NO. 001", W - 56, 118);
  f.textAlign = "left";

  f.fillStyle = "#171615";
  f.fillRect(56, 146, W - 112, 520);
  engraveInto(f, img, 56, 146, W - 112, 520);

  f.fillStyle = IVORY;
  f.font = "900 92px 'Archivo', sans-serif";
  f.fontStretch = "expanded";
  const first = name.split(" ")[0].toUpperCase();
  const last = name.split(" ").slice(1).join(" ").toUpperCase();
  f.fillText(first, 52, 790);
  f.fillText(last, 52, 872);

  f.font = "500 22px 'JetBrains Mono', monospace";
  f.fillStyle = MUTE;
  f.fillText(`${role.toUpperCase()} @ ${company.toUpperCase()}`, 56, 926);

  f.fillStyle = IVORY;
  barcode(f, 56, 990, 300, 76);
  f.font = "900 56px 'Archivo', sans-serif";
  f.textAlign = "right";
  f.fillText("VR", W - 80, 1062);
  f.fillStyle = RED;
  f.font = "700 22px 'Archivo', sans-serif";
  f.fillText("®", W - 54, 1024);

  // Back ----------------------------------------------------------------
  const back = document.createElement("canvas");
  back.width = W;
  back.height = H;
  const b = back.getContext("2d");
  b.fillStyle = IVORY;
  b.fillRect(0, 0, W, H);
  b.fillStyle = "#dcd7cd";
  b.beginPath();
  b.roundRect(W / 2 - 70, 34, 140, 22, 11);
  b.fill();
  b.fillStyle = INK;
  b.textAlign = "left";
  b.font = "900 300px 'Archivo', sans-serif";
  b.fontStretch = "expanded";
  b.fillText("VR", 50, 470);
  b.fillStyle = RED;
  b.font = "700 70px 'Archivo', sans-serif";
  b.fillText("®", 700, 250);
  b.fillStyle = INK;
  b.font = "italic 64px 'Instrument Serif', Georgia, serif";
  b.fillText("Sketch, ink,", 56, 640);
  b.fillText("build, ship.", 56, 710);
  b.font = "500 22px 'JetBrains Mono', monospace";
  b.fillStyle = "#6b665e";
  ["IF FOUND, SAY HELLO:", "VISHESHRAJPUT.DEV@GMAIL.COM"].forEach((l, i) => b.fillText(l, 56, 960 + i * 34));
  b.fillStyle = RED;
  b.fillRect(0, H - 40, W, 40);

  const toTex = (c) => {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };
  return { front: toTex(front), back: toTex(back) };
}

export function createStrapTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 64;
  const x = c.getContext("2d");
  x.fillStyle = RED;
  x.fillRect(0, 0, 512, 64);
  x.fillStyle = IVORY;
  x.font = "500 26px 'JetBrains Mono', monospace";
  x.textBaseline = "middle";
  x.fillText("VR® · ALL STACKS · ", 16, 33);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}
