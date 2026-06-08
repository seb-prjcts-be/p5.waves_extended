// stet — Daily p5.waves — 2026-05-17  (rev: de-riso'd, one gesture)
//
// MODE          : S (Sketch)
// SUBJECT       : stet — the proofreader's mark meaning "let it stand".
//                 The instruction is to leave the word alone. The system
//                 refuses: it keeps rewriting the word's weight.
// GESTURE       : a word the rule says to leave alone is continuously
//                 re-set — swelling, softening, going wonky and back.
// REFERENCE     : Karel Martens — proof corrections, the mark kept rather
//                 than obeyed.
// SEB ANCHOR    : p5.wavesX100 — one p5.waves move, made into an image.
// LIBRARY MOVE  : a Waves.createSampler({ shift:true }) over a pinned
//                 sine/curve pool drives the VARIABLE-FONT axes of
//                 p5.js 2.x (Fraunces: wght / SOFT / WONK / opsz), one
//                 axis read per glyph. Because the sampler shifts through
//                 wave *formulas* (not a single tween), the way the word
//                 deforms keeps reorganising — a generic ease cannot do
//                 this. A second detuned sampler decorrelates SOFT/WONK.
// TREND         : CC Radar S4 — p5.js 2.x is the maturing tool layer
//                 (editor default July 2026); its flagship typography
//                 capability is variable fonts. Used confidently here,
//                 plus the post-AI tactile / ugly-serif edge (Fraunces
//                 WONK). NOT a riso piece — riso is one idea of a
//                 thousand; this concept is type rewriting itself, so the
//                 wave-driven axes ARE the whole image. One ink, no ghost.
// RISK          : full-bleed, single gesture. The type ruptures the
//                 M=100 margin; at peak wght the letters crowd and
//                 collide; readability of STET comes and goes by design.
//                 No second plate to hide behind — the wave carries it.
// P5.JS 2.x     : async setup, await document.fonts.load + fonts.ready,
//                 no preload(); axes set via the Chromium-native
//                 drawingContext.fontVariationSettings.
// ARTWORK FONT  : Fraunces (variable) — opsz 9..144, wght 100..900,
//                 SOFT 0..100, WONK 0..1. Loaded from Google Fonts.

const W = 1080;
const M = 100;
const PAPER = 245;
const INK = [20, 18, 24];      // single ink — the text itself, nothing else

const WORD = 'STET';
const FS = 540;                // base type size (huge, full-bleed)

// pinned sine/curve pool — group:'gentle' leaks 'up down noise' in v3.3.0,
// so the shift pool is explicit. The word stays a word, never noise.
const POOL = ['classic sine', 'sine', 'smooth solid sine', 'half sine',
              'round linked sine', 'offset sine', 'bumpy sine',
              'meta sine', 'triangle sine'];

let sampW, sampS;
const GRAIN = [];

async function setup() {
  createCanvas(W, W);
  pixelDensity(2);
  // p5.js 2.x: force the variable font to load, then wait for all fonts.
  await document.fonts.load('700 120px "Fraunces"');
  await document.fonts.ready;
  frameRate(30);

  sampW = Waves.createSampler({
    wave: 'classic sine', frequency: 22, range: [-1, 1],
    shift: true, group: POOL, shiftInterval: 5, shiftDuration: 1.6
  });
  sampS = Waves.createSampler({
    wave: 'round linked sine', frequency: 17, range: [-1, 1],
    shift: true, group: POOL, shiftInterval: 3.4, shiftDuration: 1.0, seed: 4
  });

  for (let i = 0; i < 1100; i++) {
    const h = frac(Math.sin(i * 12.9898) * 43758.5453);
    const g = frac(Math.sin(i * 78.233) * 12733.197);
    GRAIN.push([h * W, g * W]);
  }
}

function draw() {
  const t = millis() / 1000;          // prelude time-scales this
  background(PAPER);
  drawGrain();

  const n = WORD.length;
  // per-glyph axis values from the wave samplers
  const ax = [];
  for (let i = 0; i < n; i++) {
    const a = sampW.sample(i + t * 0.35, t);          // -1..1, shifting
    const b = sampS.sample(i - t * 0.28, t);          // -1..1, detuned
    const wght = mapc(a, -1, 1, 130, 900);
    const SOFT = mapc(b, -1, 1, 0, 100);
    const WONK = mapc(Math.abs(a) * 0.6 + Math.abs(b) * 0.4, 0, 1, 0, 1);
    const opsz = mapc(wght, 130, 900, 28, 144);       // heavy → display optical size
    ax.push({ wght, SOFT, WONK, opsz });
  }

  const ctx = drawingContext;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // measure total advance at current axes to centre the word
  let total = 0;
  const adv = [];
  for (let i = 0; i < n; i++) {
    setFont(ctx, ax[i]);
    const w = ctx.measureText(WORD[i]).width;
    adv.push(w);
    total += w;
  }
  total += (n - 1) * (FS * 0.02);
  const x0 = W / 2 - total / 2;
  const yBase = W * 0.5 + FS * 0.34
              + Waves.wave(t, { wave: 'classic sine', amplitude: 70, frequency: 0.3 });

  // ONE ink, ONE pass — the variable-font wave is the entire gesture
  ctx.save();
  ctx.fillStyle = `rgb(${INK[0]}, ${INK[1]}, ${INK[2]})`;
  let cx = x0;
  for (let i = 0; i < n; i++) {
    setFont(ctx, ax[i]);
    ctx.fillText(WORD[i], cx, yBase);
    cx += adv[i] + FS * 0.02;
  }
  ctx.restore();

  drawLabelBand();
}

function setFont(ctx, a) {
  ctx.font = `${Math.round(a.wght)} ${FS}px "Fraunces", serif`;
  ctx.fontVariationSettings =
    `"opsz" ${a.opsz.toFixed(1)}, "wght" ${a.wght.toFixed(0)}, ` +
    `"SOFT" ${a.SOFT.toFixed(1)}, "WONK" ${a.WONK.toFixed(3)}`;
}

function drawGrain() {
  noStroke();
  fill(20, 18, 24, 15);
  for (let i = 0; i < GRAIN.length; i++) circle(GRAIN[i][0], GRAIN[i][1], 1.5);
  noFill();
}

function drawLabelBand() {
  let wn = sampW.waveName;
  if (sampW.shifting && sampW.mix > 0.5 && sampW.targetName) wn = sampW.targetName;

  push();
  resetMatrix();
  blendMode(BLEND);
  noStroke();
  fill(PAPER);
  rect(0, 980, W, 100);            // 245 plate keeps the band readable
  textAlign(LEFT, BASELINE);
  fill(0);
  textFont('Oswald');
  textSize(26);
  textStyle(NORMAL);
  text('stet', M, 1020);
  textFont('IBM Plex Mono');
  textSize(11);
  text(wn + ' → Fraunces wght/SOFT/WONK', M, 1040);
  textAlign(RIGHT, BASELINE);
  textSize(22);
  text('p5.waves', W - M, 1020);
  pop();
}

function mapc(v, a, b, c, d) {
  const u = (v - a) / (b - a);
  return c + Math.max(0, Math.min(1, u)) * (d - c);
}

function frac(x) { return x - Math.floor(x); }
