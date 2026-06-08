/*
 * punch_card (rev 5 — v3.3.0, decluttered to the card itself)
 * =========================================================
 * ABOUT: two Hollerith decks overprinted on one card. Deck A
 *   breathes on batman × triangle (coral). Deck B on round
 *   linked sine × sharp peaks (cyan), time-shifted so it peaks
 *   when A troughs. Where both punch the same cell the ink
 *   overprints to magenta. The card never goes still.
 * GESTURE: rehearse — two programs on one card, forever out
 *   of phase.
 * REFERENCE: Grilli Type specimen × risograph misregister —
 *   the overprint celebrated as the accident that makes it real.
 * SEB ANCHOR: p5.wavesX100 — single-library depth.
 * LIBRARY MOVE: four Waves.createSampler() instances, two
 *   summed per deck (the v3.3.0 replacement for the removed
 *   createGrid). Cells that pass BOTH decks mix ink.
 * RISK (rev 4 note): two grids + four margin curves cluttered
 *   the card and tamed it. Rev 5 cuts every preview lane,
 *   legend and guide tick — the overprint goes full bleed and
 *   carries the frame alone. Bold by subtraction, not noise.
 * COLOR: coral rgb(210,90,85) / cyan rgb(80,225,225) /
 *   magenta rgb(240,95,240) on paper 245. Stated inks.
 */

const W = 1080;
const COLS = 40, ROWS = 40;
const CELL = W / COLS;            // 27 px, full bleed
const SPEED = 4;
const B_OFFSET = 1.2;

const INK_A  = 'rgb(210, 90, 85)';
const INK_B  = 'rgb(80, 225, 225)';
const INK_AB = 'rgb(240, 95, 240)';

let aRowS, aColS, bRowS, bColS;

async function setup() {
  createCanvas(W, W);
  pixelDensity(1);
  await document.fonts.ready;

  aRowS = Waves.createSampler({ wave: 'batman',            range: [-1, 1] });
  aColS = Waves.createSampler({ wave: 'triangle',          range: [-1, 1] });
  bRowS = Waves.createSampler({ wave: 'round linked sine', range: [-1, 1] });
  bColS = Waves.createSampler({ wave: 'sharp peaks',       range: [-1, 1] });

  frameRate(30);
}

function axisVals(sampler, n, ph) {
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = sampler.sample((i / n) * TWO_PI + ph * SPEED);
  return out;
}

function draw() {
  background(245);
  const t = millis() / 1500;
  const tB = t + B_OFFSET;

  const aR = axisVals(aRowS, ROWS, t);
  const aC = axisVals(aColS, COLS, t);
  const bR = axisVals(bRowS, ROWS, tB);
  const bC = axisVals(bColS, COLS, tB);

  noStroke();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const a = aR[r] + aC[c] > 0;
      const b = bR[r] + bC[c] > 0;
      if (!a && !b) continue;
      fill(a && b ? INK_AB : a ? INK_A : INK_B);
      // punched hole: inset cell so the card reads as Hollerith
      rect(c * CELL + 3, r * CELL + 3, CELL - 6, CELL - 6);
    }
  }

  drawLabelBand();
}

function drawLabelBand() {
  push();
  resetMatrix();
  blendMode(BLEND);
  noStroke();
  fill(245);
  rect(0, 980, W, 100);
  fill(0);
  textAlign(LEFT, BASELINE);
  textFont('Oswald');
  textSize(26);
  textStyle(NORMAL);
  text('punch_card', 100, 1020);
  textFont('IBM Plex Mono');
  textSize(11);
  text('A batman×triangle  ·  B round linked sine×sharp peaks  ·  overprint', 100, 1040);
  textAlign(RIGHT, BASELINE);
  textSize(22);
  text('p5.waves', W - 100, 1020);
  pop();
}
