import * as THREE from "three";

/**
 * The laptop screen, drawn on a 2D canvas each frame the story moves:
 * a blank file with a blinking cursor, code typing itself, a build running,
 * then the shipped product (a real screen recording) in full colour.
 */

const W = 1024;
const H = 640;

const CODE = [
  "import { useState } from 'react';",
  "import { rewards } from './api';",
  "",
  "export default function Redeem({ card }) {",
  "  const [points, setPoints] = useState(0);",
  "",
  "  const value = rewards.valueOf(card, points);",
  "  const best = rewards.bestRoute(card, {",
  "    cabin: 'business',",
  "    partners: ['air', 'hotel'],",
  "  });",
  "",
  "  return <Summary value={value} best={best} />;",
  "}",
];

const BUILD = [
  "$ npm run build",
  "",
  "  creating an optimized production build…",
  "  compiled 214 modules",
  "",
  "  ✓ type check",
  "  ✓ tests passed",
  "  ✓ bundle 182 kB gzipped",
  "",
  "$ deploy --prod",
];

const C = {
  bg: "#0f0f10",
  panel: "#151516",
  line: "#232325",
  text: "#e9e6df",
  dim: "#6f6b64",
  kw: "#e9e6df",
  str: "#d2372c",
  num: "#b8b3aa",
};

export function createScreen(videoSrc) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const video = document.createElement("video");
  video.src = videoSrc;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.colorSpace = THREE.SRGBColorSpace;

  let lastKey = "";

  function chrome(title) {
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = C.panel;
    ctx.fillRect(0, 0, W, 44);
    ctx.fillStyle = C.line;
    ctx.fillRect(0, 44, W, 1);
    ["#3a3a3c", "#3a3a3c", "#3a3a3c"].forEach((f, i) => {
      ctx.fillStyle = f;
      ctx.beginPath();
      ctx.arc(24 + i * 20, 22, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.font = "500 15px 'JetBrains Mono', monospace";
    ctx.fillStyle = C.dim;
    ctx.fillText(title, 96, 27);
  }

  // Stage 0: the screen is still a pencil wireframe on paper.
  function sketch(blink) {
    ctx.fillStyle = "#e8e4db";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#8d887f";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    const wobble = (x1, y1, x2, y2) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 3;
      const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 3;
      ctx.quadraticCurveTo(mx, my, x2, y2);
      ctx.stroke();
    };
    const rect = (x, y, w, h) => {
      wobble(x, y, x + w, y);
      wobble(x + w, y, x + w, y + h);
      wobble(x + w, y + h, x, y + h);
      wobble(x, y + h, x, y);
    };
    // A rough layout: nav, headline, a card grid, a button.
    wobble(40, 56, W - 40, 56);
    rect(40, 96, 520, 58);
    wobble(40, 190, 420, 190);
    wobble(40, 214, 360, 214);
    rect(40, 260, 170, 130);
    rect(232, 260, 170, 130);
    rect(424, 260, 170, 130);
    rect(40, 430, 150, 46);
    ctx.beginPath();
    ctx.arc(820, 300, 110, 0, Math.PI * 2);
    ctx.stroke();
    wobble(740, 220, 900, 380);
    ctx.font = "italic 26px 'Instrument Serif', Georgia, serif";
    ctx.fillStyle = "#6b665e";
    ctx.fillText("idea.md — what if points had a price tag?", 40, H - 60);
    if (blink) {
      ctx.fillStyle = "#0e0d0c";
      ctx.fillRect(40 + ctx.measureText("idea.md — what if points had a price tag?").width + 6, H - 82, 3, 28);
    }
  }

  function colourise(line, x, y) {
    // Tiny tokenizer: strings in red, keywords bright, the rest soft.
    const parts = line.split(/('.*?'|\b(?:import|from|export|default|function|const|return)\b)/g);
    let cx = x;
    parts.forEach((p) => {
      if (!p) return;
      if (p.startsWith("'")) ctx.fillStyle = C.str;
      else if (/^(import|from|export|default|function|const|return)$/.test(p)) ctx.fillStyle = C.kw;
      else ctx.fillStyle = C.num;
      ctx.fillText(p, cx, y);
      cx += ctx.measureText(p).width;
    });
    return cx;
  }

  /**
   * @param {number} stage 0 sketch, 1 ink, 2 build, 3 ship
   * @param {number} t progress inside the stage, 0..1
   * @param {number} time seconds, for the cursor blink
   */
  function draw(stage, t, time) {
    const blink = Math.floor(time * 2) % 2 === 0;
    const key = `${stage}-${Math.round(t * 400)}-${blink}`;
    if (key === lastKey) return;
    lastKey = key;

    ctx.textBaseline = "alphabetic";

    if (stage <= 0) {
      sketch(blink);
    } else if (stage === 1) {
      chrome("src/Redeem.jsx");
      ctx.font = "500 20px 'JetBrains Mono', monospace";
      const total = CODE.join("\n").length;
      let budget = Math.floor(total * Math.min(1, t * 1.15));
      let y = 96;
      let cursor = null;
      CODE.forEach((line, i) => {
        ctx.fillStyle = C.dim;
        ctx.fillText(String(i + 1).padStart(2, " "), 22, y);
        if (budget > 0) {
          const shown = line.slice(0, budget);
          const end = colourise(shown, 76, y);
          if (budget <= line.length) cursor = [end, y];
          budget -= line.length + 1;
        }
        y += 36;
      });
      if (cursor && blink) {
        ctx.fillStyle = C.text;
        ctx.fillRect(cursor[0] + 2, cursor[1] - 20, 10, 24);
      }
    } else if (stage === 2) {
      chrome("zsh — build");
      ctx.font = "500 20px 'JetBrains Mono', monospace";
      const rows = Math.floor(BUILD.length * Math.min(1, t * 1.3));
      let y = 96;
      BUILD.slice(0, rows).forEach((line) => {
        ctx.fillStyle = line.startsWith("$") ? C.text : line.includes("✓") ? C.num : C.dim;
        ctx.fillText(line, 32, y);
        y += 36;
      });
      // Progress bar
      const p = Math.min(1, t * 1.1);
      ctx.fillStyle = C.line;
      ctx.fillRect(32, H - 70, W - 64, 6);
      ctx.fillStyle = C.str;
      ctx.fillRect(32, H - 70, (W - 64) * p, 6);
      ctx.fillStyle = C.dim;
      ctx.fillText(`${Math.round(p * 100)}%`, W - 96, H - 86);
    }
    texture.needsUpdate = true;
  }

  return {
    texture,
    videoTexture,
    draw,
    play: () => video.play().catch(() => {}),
    pause: () => video.pause(),
    dispose: () => {
      video.pause();
      video.removeAttribute("src");
      texture.dispose();
      videoTexture.dispose();
    },
  };
}
