/*
  FEELING — flicker: rapid on/off signal, nervous radiation,
            particles briefly illuminated then gone.

  WAVE LOGIC — duo in tension.
            A: 'fuzzy pulse' (wild mode, low unpredictability) drives a
               binary-ish gate deciding which angular positions on each
               ring illuminate as radial dashes. Sharp, sparse, random-feeling.
            B: 'wobble sine' gently deforms the radius of every ring so
               no circle is perfectly round — a slow-breathing envelope
               over the fast flicker. Smooth vs spike.

  TIME LOGIC — base t = millis() / 180 (hyper-fast, strobing tempo).
            Per-ring tempo jitter (1 + i * 0.043) + per-ring phase offset
            so rings never strobe in lock. Wobble runs on a much slower
            second clock t2 = millis() / 420, letting the ring shape
            drift beneath the flicker pattern.

  STRUCTURAL MOVE — 22 concentric rings, radii 60 → 430, centered.
            96 angular samples per ring. Dashes are short radial tics.
            Central symmetry is intentional (pulse concept requires a
            center). Density/alpha envelope peaks mid-radius and fades
            inward + outward → the form reads as a thin halo, not a disc.
            Two faint reference circles (innermost + outermost) as
            structural anchors beneath the chatter.
*/

const M = 100;

const RINGS = 22;
const SAMPLES = 96;
const R_MIN = 60;
const R_MAX = 430;

const WAVE_A = 'fuzzy pulse';
const WAVE_B = 'wobble sine';

let pulseSampler;
let wobSampler;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(2);

  await document.fonts.ready;

  pulseSampler = Waves.createSampler({
    wave: WAVE_A,
    range: [0, 1],
    frequency: 1.9,
    mode: 'wild',
    unpredictability: 0.18,
    seed: 7
  });

  wobSampler = Waves.createSampler({
    wave: WAVE_B,
    range: [-1, 1],
    frequency: 0.55,
    seed: 13
  });
}

function draw() {
  background(245);

  const cx = width / 2;
  const cy = height / 2;
  const tBase = millis() / 180;
  const t2 = millis() / 420;

  strokeCap(ROUND);

  noFill();
  stroke(30, 30, 36, 18);
  strokeWeight(0.6);
  circle(cx, cy, R_MIN * 2);
  circle(cx, cy, R_MAX * 2);

  for (let i = 0; i < RINGS; i++) {
    const ringU = i / (RINGS - 1);
    const baseR = R_MIN + ringU * (R_MAX - R_MIN);
    const localT = tBase * (1 + i * 0.043) + i * 0.31;

    const envelope = Math.sin(ringU * Math.PI);
    const wobAmp = baseR * 0.018 + 3;

    for (let k = 0; k < SAMPLES; k++) {
      const ang = (k / SAMPLES) * Math.PI * 2;
      const sx = (k / SAMPLES) * 8 + i * 1.7;

      const v = pulseSampler.sample(sx, localT);
      if (v < 0.28) continue;

      const wob = wobSampler.sample(sx * 0.7 + i * 0.4, t2 + i * 0.1) * wobAmp;
      const r = baseR + wob;

      const gate = (v - 0.28) / 0.72;
      const dashLen = 3 + envelope * 5 + gate * 4;
      const innerR = r - dashLen * 0.5;
      const outerR = r + dashLen * 0.5;

      const alphaBase = 55 + envelope * 170 * gate;
      stroke(24, 24, 30, alphaBase);
      strokeWeight(0.65 + envelope * 0.85 + gate * 0.3);

      const ca = Math.cos(ang);
      const sa = Math.sin(ang);
      line(
        cx + ca * innerR,
        cy + sa * innerR,
        cx + ca * outerR,
        cy + sa * outerR
      );
    }
  }

  drawLabels();
}

function drawLabels() {
  drawingContext.save();
  drawingContext.textBaseline = 'alphabetic';

  drawingContext.font = "300 22px 'Oswald', sans-serif";
  drawingContext.fillStyle = 'rgba(90,90,90,0.95)';
  drawingContext.textAlign = 'left';
  drawingContext.fillText('flicker', M, 854);

  drawingContext.font = "400 9.5px 'IBM Plex Mono', monospace";
  drawingContext.fillStyle = 'rgb(168,168,168)';
  drawingContext.textAlign = 'left';
  drawingContext.fillText('duo · fuzzy pulse / wobble sine', M, 870);

  drawingContext.font = "400 19px 'IBM Plex Mono', monospace";
  drawingContext.fillStyle = 'rgb(168,168,168)';
  drawingContext.textAlign = 'right';
  drawingContext.fillText('p5.waves', width - M, 854);

  drawingContext.restore();
}
