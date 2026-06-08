/*
 * fold — 2026-04-20 22:15
 *
 * FEELING        — pressure. Slow tectonic compression folding flat strata
 *                  into ridges; some beds buckle, others stay quiet.
 *
 * WAVE LOGIC     — mountain peaks (index 6) drives vertical displacement:
 *                  sharp asymmetric ridges that read as geology. bald patch
 *                  (index 27) gates both the horizontal envelope (bald zones
 *                  where strata flatten) and a vertical row-weight mask
 *                  (which beds are prominent, which recede). Morph of
 *                  fuzzy pulse ↔ mountain peaks animates a single signal
 *                  line near the base — a reading across the terrain.
 *
 * TIME LOGIC     — multi-speed, three layers:
 *                    tSlow = millis() / 2800  → structural drift
 *                    tMed  = millis() / 900   → envelope + row weight
 *                    tFast = millis() / 400   → signal-line wobble
 *                    mix   = slow sinus over 7s → morph between signal waves
 *
 * STRUCTURAL MOVE — 112 horizontal contour lines stacked inside the margin.
 *                   Per-row prominence drifts vertically; per-line bald zones
 *                   drift horizontally. Every 22nd row is a disturbed stratum
 *                   with larger amplitude. A single signal line at y ≈ 760
 *                   morphs continuously. Left-edge depth ticks register the
 *                   beds; right margin reads the morph state.
 */

const W = 1080;
const H = 1080;
const M = 100;

const LINE_COUNT = 112;
const STEP = 3;

let displaceSampler;
let envSampler;
let rowSampler;
let signalSampler;

async function setup() {
  createCanvas(W, H);
  pixelDensity(2);
  await document.fonts.ready;

  displaceSampler = Waves.createSampler({
    wave: 'mountain peaks',
    range: [-1, 1],
    seed: 7
  });

  envSampler = Waves.createSampler({
    wave: 'bald patch',
    range: [0, 1],
    seed: 13
  });

  rowSampler = Waves.createSampler({
    wave: 'bald patch',
    range: [0.05, 1],
    seed: 23
  });

  signalSampler = Waves.createSampler({
    wave: ['fuzzy pulse', 'mountain peaks'],
    range: [-34, 34],
    seed: 5
  });

  noFill();
}

function draw() {
  background(245);

  const tSlow = millis() / 2800;
  const tMed  = millis() / 900;
  const tFast = millis() / 400;
  const mix   = (sin(millis() / 3500) + 1) / 2;

  drawDepthTicks(tMed);
  drawStrata(tSlow, tMed);
  drawSignalLine(tFast, mix);
  drawLabels(mix);
}

function drawStrata(tSlow, tMed) {
  const top = M + 40;
  const bot = H - M - 90;

  for (let i = 0; i < LINE_COUNT; i++) {
    const tRow = i / (LINE_COUNT - 1);
    const baseY = top + (bot - top) * tRow;

    const rowWeight = rowSampler.sample(tRow * 4.2, tMed);
    const disturbed = (i % 22 === 11);
    const amp = (disturbed ? 34 : 11) * rowWeight;

    const alpha = 38 + 168 * rowWeight;
    stroke(38, 42, 48, alpha);
    strokeWeight(disturbed ? 1.0 : 0.55);

    beginShape();
    for (let x = M; x <= W - M; x += STEP) {
      const env = envSampler.sample(x * 0.0062 + tRow * 4.0, tMed);
      const disp = displaceSampler.sample(x * 0.0072 + tRow * 2.3, tSlow) * amp * env;
      vertex(x, baseY + disp);
    }
    endShape();
  }
}

function drawDepthTicks(tMed) {
  const top = M + 40;
  const bot = H - M - 90;
  const TICKS = 14;

  stroke(90, 90, 95, 110);
  strokeWeight(0.5);
  for (let i = 0; i <= TICKS; i++) {
    const t = i / TICKS;
    const y = top + (bot - top) * t;
    const w = (i % 5 === 0) ? 18 : 8;
    line(M - 28, y, M - 28 + w, y);
  }

  noStroke();
  fill(150);
  textFont('IBM Plex Mono');
  textSize(8);
  textAlign(RIGHT, CENTER);
  for (let i = 0; i <= TICKS; i += 5) {
    const t = i / TICKS;
    const y = top + (bot - top) * t;
    const depth = nf(i * 30, 2) + 'm';
    text(depth, M - 34, y);
  }
}

function drawSignalLine(tFast, mix) {
  const y0 = H - M - 50;

  stroke(50, 64, 92, 210);
  strokeWeight(0.9);
  noFill();
  beginShape();
  for (let x = M; x <= W - M; x += 2) {
    const v = signalSampler.sample(x * 0.018, tFast, mix);
    vertex(x, y0 + v);
  }
  endShape();

  stroke(50, 64, 92, 80);
  strokeWeight(0.4);
  line(M, y0, W - M, y0);
}

function drawLabels(mix) {
  noStroke();

  fill(90, 90, 90, 242);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('fold', M, 854);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  textAlign(LEFT, BASELINE);
  text('mountain peaks  ·  bald patch  ·  signal morph', M, 870);

  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', W - M, 854);

  textSize(8.5);
  textAlign(RIGHT, BASELINE);
  const pct = nf(mix * 100, 2, 1) + '%';
  text('fuzzy pulse ↔ mountain peaks  ' + pct, W - M, 870);
}
