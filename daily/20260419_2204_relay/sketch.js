/*
 * Daily p5.waves — 2026-04-19 · 22:04 — "relay"
 *
 * FEELING — relay. The handoff of one signal through three
 *   different states of attention.
 *
 * WAVE LOGIC — morph between 'fuzzy pulse' (twitchy hard-edged
 *   pulses) and 'batman' (paired asymmetric peaks). The same
 *   formula-pair runs in all three bands, so what the eye sees
 *   across the triptych reads as TIME, not as a change of wave.
 *
 * TIME LOGIC — three uncorrelated clocks, left → right:
 *     /180   ms  — hyper-fast, nervous
 *     /800   ms  — medium, breath
 *     /2800  ms  — slow, drift
 *   Three more clocks (/5200, /7200, /11000) drive the morph-mix
 *   in each band so the character itself breathes at its own pace.
 *   millis() / 1000 is never used.
 *
 * STRUCTURAL MOVE — triptych. 160 horizontal wave-lines per band,
 *   each line with its own seed, frequency, phase and amplitude
 *   so no band reads flat. The thin vertical ticks are silent
 *   scaffolding; the captions above each band name the clock that
 *   drives it.
 */

const M       = 100;
const GAP     = 22;
const BAND_W  = (900 - 2 * M - 2 * GAP) / 3;   // 218.67
const TOP_Y   = 150;
const BOT_Y   = 790;
const HGT     = BOT_Y - TOP_Y;
const ROWS    = 160;
const STEP    = HGT / ROWS;

const BANDS = [
  { label: '180',  div: 180,  seed: 11, mixDiv: 5200,  freqBase: 0.14, ampBase: 2.1 },
  { label: '800',  div: 800,  seed: 37, mixDiv: 7200,  freqBase: 0.08, ampBase: 2.6 },
  { label: '2800', div: 2800, seed: 73, mixDiv: 11000, freqBase: 0.04, ampBase: 3.1 }
];

let samplers = [];

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(2);
  await document.fonts.ready;

  for (let b = 0; b < 3; b++) {
    const row = [];
    for (let i = 0; i < ROWS; i++) {
      row.push(Waves.createSampler({
        wave: ['fuzzy pulse', 'batman'],
        amplitude: BANDS[b].ampBase + (i % 7) * 0.13,
        frequency: BANDS[b].freqBase + ((i * 13 + BANDS[b].seed) % 17) * 0.007,
        phase:    (i * 0.41 + BANDS[b].seed * 0.09) % 6.2831853,
        seed:     BANDS[b].seed + i
      }));
    }
    samplers.push(row);
  }

  noFill();
}

function __p5wSourceDraw() {
  background(245);
  const mNow = millis();

  // silent scaffolding — thin vertical frame on each band
  stroke(212);
  strokeWeight(1);
  for (let b = 0; b < 3; b++) {
    const bx = M + b * (BAND_W + GAP);
    line(bx,          TOP_Y - 14, bx,          BOT_Y + 14);
    line(bx + BAND_W, TOP_Y - 14, bx + BAND_W, BOT_Y + 14);
  }

  // wave lines, band by band
  for (let b = 0; b < 3; b++) {
    const bx  = M + b * (BAND_W + GAP);
    const tB  = mNow / BANDS[b].div;
    const mx  = (Math.sin(mNow / BANDS[b].mixDiv) + 1) / 2;

    stroke(50, 50, 50, 170);
    strokeWeight(0.8);
    noFill();

    for (let i = 0; i < ROWS; i++) {
      const y0 = TOP_Y + i * STEP + STEP * 0.5;
      const s  = samplers[b][i];
      beginShape();
      for (let x = 0; x <= BAND_W; x += 1.25) {
        vertex(bx + x, y0 + s.sample(x, tB, mx));
      }
      endShape();
    }

    // band caption — clock
    noStroke();
    fill(140);
    textFont('IBM Plex Mono');
    textSize(9.5);
    textAlign(LEFT, BASELINE);
    text('tempo  ·  ms / ' + BANDS[b].label, bx, TOP_Y - 22);

    // live mix readout — evidence that the character breathes
    fill(185);
    textSize(8.5);
    text('mix  ' + mx.toFixed(2), bx, BOT_Y + 28);
  }

  // labels
  noStroke();
  fill(90, 90, 90, 240);
  textFont('Oswald');
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('relay', M, 854);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  text('fuzzy pulse ↔ batman', M, 870);

  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', 900 - M, 854);
}


function draw() {
  push();
  translate(100, 100);
  scale(880 / 700);
  translate(-100, -100);
  try {
    __p5wSourceDraw();
  } finally {
    pop();
  }
}
