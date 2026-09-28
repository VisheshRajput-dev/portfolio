/**
 * Card sounds, synthesised with Web Audio (no files): a papery flick each
 * time a card passes the front, and a soft thump when the deck lands.
 * The audio context starts on the first gesture, as browsers require.
 */
export function createDeckSound() {
  let ctx = null;
  let out = null;
  let noise = null;
  let enabled = true;
  let lastFlick = 0;

  const ensure = () => {
    if (ctx) return ctx.state === "running";
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    out = ctx.createGain();
    out.gain.value = 0.55;
    out.connect(ctx.destination);
    noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.25), ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return true;
  };

  const burst = (t, { freq, q, peak, decay, type = "bandpass" }) => {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    src.connect(f).connect(g).connect(out);
    src.start(t, Math.random() * 0.15);
    src.stop(t + decay + 0.02);
  };

  return {
    /** Call from a user gesture (pointerdown, click). */
    wake() {
      if (!enabled) return;
      ensure();
      if (ctx && ctx.state === "suspended") ctx.resume();
    },
    setEnabled(on) {
      enabled = on;
    },
    /** A card passing the front. `speed` 0..1 scales it. */
    flick(speed = 0.6) {
      if (!enabled || !ctx || ctx.state !== "running") return;
      const t = ctx.currentTime;
      if (t - lastFlick < 0.035) return;
      lastFlick = t;
      const s = Math.min(1, Math.max(0.25, speed));
      burst(t, { freq: 2600 + Math.random() * 900, q: 0.9, peak: 0.22 * s, decay: 0.045 });
      burst(t, { freq: 5200, q: 0.7, peak: 0.06 * s, decay: 0.02, type: "highpass" });
    },
    /** The deck settling. */
    land() {
      if (!enabled || !ctx || ctx.state !== "running") return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(62, t + 0.12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + 0.2);
      burst(t, { freq: 700, q: 0.8, peak: 0.07, decay: 0.05 });
    },
  };
}
