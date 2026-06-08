// one or zero — Daily p5.waves 2026-04-22  (rev: v3.3.0, made monumental)
//
// MODE: L (literal — statement is title is work)
// STATEMENT: "Every cell is 1 or 0. The wave decides which."
// LIBRARY MOVE: two Waves.createSampler() summed, thresholded at 0 — the
//   v3.3.0 binary field (createGrid was removed). rowWave + colWave > 0 → 1.
// REFERENCE: Sol LeWitt wall-drawing instructions + Lawrence Weiner declarations
// SEB ANCHOR: p5.wavesX100 specimen.
//
// The grid holds exactly 196 cells. Each is 1 (black) or 0 (paper).
// A round-linked-sine field evolves in time; threshold = 0 is the fixed rule.
// Bravery here is not chaos — it is conviction: the field goes edge to edge,
// the ink is pure black, the cells flip decisively. No apology, no grey.

const W = 1080;
const COLS = 14, ROWS = 14;          // exactly 196 cells (the statement)
const CELL = W / COLS;               // ~77 px, full bleed
const THRESH = 0;                    // the fixed rule
const SPEED = 1;

let rowS, colS;
let t = 0;

async function setup() {
  createCanvas(W, W);
  noSmooth();
  pixelDensity(2);
  await document.fonts.ready;

  // round linked sine on both axes — the wave that decides.
  rowS = Waves.createSampler({ wave: 'round linked sine', range: [-1, 1] });
  colS = Waves.createSampler({ wave: 'round linked sine', range: [-1, 1] });

  frameRate(30);
}

function draw() {
  background(245);

  t += 0.06;   // decisive, not hypnotic — cells visibly flip

  // separable additive field: one row sample per row, one col per col
  const rv = [];
  for (let r = 0; r < ROWS; r++) rv[r] = rowS.sample((r / ROWS) * TWO_PI + t * SPEED);
  const cv = [];
  for (let c = 0; c < COLS; c++) cv[c] = colS.sample((c / COLS) * TWO_PI + t * SPEED);

  // the execution — full bleed, pure black, no frame, no grey
  noStroke();
  fill(0);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (rv[r] + cv[c] > THRESH) {
        rect(c * CELL, r * CELL, CELL + 0.5, CELL + 0.5);
      }
    }
  }

  drawLabels();
}

function drawLabels() {
  if (window.__P5WAVES_STAGE_ONLY__) return;
  push();
  resetMatrix();
  blendMode(BLEND);
  noStroke();

  // 245 plate under the band so black labels stay readable over ink
  fill(245);
  rect(0, 980, W, 100);

  fill(0);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(26);
  textAlign(LEFT, BASELINE);
  text('one_or_zero', 100, 1020);

  textFont('IBM Plex Mono');
  textSize(11);
  text('round linked sine + round linked sine · ink iff sum > 0', 100, 1040);

  textAlign(RIGHT, BASELINE);
  textSize(22);
  text('p5.waves', W - 100, 1020);
  pop();
}
