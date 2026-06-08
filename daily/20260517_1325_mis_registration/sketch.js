// Mis Registration - Daily p5.waves - 2026-05-17
//
// MODE          : S (Sketch)
// SUBJECT       : mis_registration - a press jammed mid-run. Two plates
//                 sheared apart, the wave under them refusing to hold still.
// GESTURE       : huge inked continents heave, fracture and tear out of
//                 register as the wave pair lurches through every formula.
// REFERENCE     : Karel Martens - the press as an instrument, the violent
//                 misprint kept and framed, not corrected.
// SEB ANCHOR    : p5.wavesX100 - one p5.waves move, taken to the edge.
// LIBRARY MOVE  : two Waves.createSampler() fields, SUMMED and thresholded
//                 (the v3.3.0 two-sampler pattern that replaced createGrid).
//                 Row sampler: shift:true over group:'all' - it lurches
//                 through ALL 34 formulas (square, pulse, noise, batman,
//                 saw), so the continents fracture, not breathe. Column
//                 sampler: a SECOND independent shift:'all' sampler on a
//                 shorter, detuned rhythm - the two plates change formula
//                 polyrhythmically, so the field tears unpredictably. The
//                 single thresholded image is printed twice with a large
//                 fixed offset = the misregistration.
// RISK          : full-bleed. The v5 safe margin (M=100) is deliberately
//                 ruptured - the field runs edge to edge, 0..1080, because
//                 the gesture IS overflow. The only disciplined zone is the
//                 label band on its 245 plate (y 980..1080). Entropy is the
//                 point; the contract band is the only thing held.
// AESTHETIC     : brave riso. 245 paper, heavy near-black key, full
//                 fluorescent pink spot, MULTIPLY overprint. Hard-edged
//                 flat colour fields - the thresholded continents rendered
//                 as run-length bars per row, hand-torn at the edges.
//                 Print brutality, not pen-fuss; cost scales with the
//                 number of shapes, not pixels, so the entropy can run.
// ARTWORK TYPE  : none. The torn field is the whole image.
//                 Label band only (Oswald 300 + IBM Plex Mono 400, v5).

const W = 1080;
const M = 100;                 // label-band reference only; field ignores it
const CELL = 14;               // run-length: cost = #shapes, not cells
const N = Math.round(W / CELL); // ~77 rows/cols, full bleed (overscans)

const K = 1.0;                 // input units per cell (input = cell index)
const ROW_F = 1.5;             // very low -> ~3 huge continents
const COL_F = 2.2;             // detuned -> slow beat across the landmass
const ROW_SLIDE = 0.7;         // continents drift
const COL_SLIDE = -0.5;
const T = 0.30;                // high threshold -> violent voids tear through

const JIT = 7;                 // px: hand-torn jitter on each run edge
const OFFX = 38;               // violent registration error, x
const OFFY = -26;              // violent registration error, y

const PAPER = 245;
let KEY, SPOT;

let rowS, colS;
let rowVals = new Array(N);
let colVals = new Array(N);

// fixed paper tooth - generated once, never boils
const GRAIN = [];

async function setup() {
  createCanvas(W, W);
  pixelDensity(2);
  await document.fonts.ready;
  frameRate(30);

  KEY  = color(20, 18, 24, 220);   // heavy near-black key
  SPOT = color(255, 72, 176, 214); // #FF48B0 fluorescent pink spot

  rowS = Waves.createSampler({
    wave: 'classic sine',
    frequency: ROW_F,
    range: [-1, 1],
    shift: true,
    group: 'all',                  // entropy: every formula, including harsh
    shiftInterval: 3.4,            // short hold -> it lurches
    shiftDuration: 0.9             // abrupt-ish transitions, not smooth
  });
  colS = Waves.createSampler({
    wave: 'classic sine',
    frequency: COL_F,
    range: [-1, 1],
    shift: true,
    group: 'all',                  // second plate, also every formula
    shiftInterval: 2.6,            // detuned vs row -> polyrhythmic tearing
    shiftDuration: 0.7,
    seed: 4
  });

  for (let i = 0; i < 900; i++) {
    const h = frac(sin(i * 12.9898) * 43758.5453);
    const g = frac(sin(i * 78.233) * 12733.197);
    GRAIN.push([h * W, g * W]);
  }

  strokeCap(ROUND);
  noFill();
}

function draw() {
  const t = millis() / 1000; // already time-scaled by campaign/prelude.js

  blendMode(BLEND);
  background(PAPER);
  drawGrain();

  // separable: row sampler per row, wild col sampler per column (only N
  // wild calls/frame - the 5x cost never enters the N*N inner loop)
  for (let r = 0; r < N; r++) rowVals[r] = rowS.sample(r * K + t * ROW_SLIDE, t);
  for (let c = 0; c < N; c++) colVals[c] = colS.sample(c * K + t * COL_SLIDE, t);

  // riso: two passes of the SAME torn image, offset = misregistration
  blendMode(MULTIPLY);
  printPass(KEY,  -OFFX * 0.5, -OFFY * 0.5);
  printPass(SPOT,  OFFX * 0.5,  OFFY * 0.5);

  blendMode(BLEND);
  drawLabelBand();
}

// Run-length: one rect per horizontal run of inked cells. A few huge
// continents -> a few long bars. Each edge is hand-torn with deterministic
// jitter so the misprint never looks gridded.
function printPass(inkColor, dx, dy) {
  noStroke();
  fill(inkColor);
  for (let r = 0; r < N; r++) {
    const rv = rowVals[r];
    const y = r * CELL + dy;
    let c = 0;
    while (c < N) {
      if (rv + colVals[c] <= T) { c++; continue; }
      let c1 = c + 1;
      while (c1 < N && rv + colVals[c1] > T) c1++;
      const hL = frac(sin(r * 91.7 + c * 47.3) * 9173.13);
      const hR = frac(sin(r * 53.1 + c1 * 88.9) * 6571.77);
      const hY = frac(sin(r * 12.9 + c * 7.7) * 4391.51);
      const x0 = c * CELL + dx + (hL - 0.5) * 2 * JIT;
      const x1 = c1 * CELL + dx + (hR - 0.5) * 2 * JIT;
      const yy = y + (hY - 0.5) * JIT;
      rect(x0, yy, x1 - x0, CELL + JIT * 0.5);
      c = c1;
    }
  }
}

function drawGrain() {
  noStroke();
  fill(20, 18, 24, 16);
  for (let i = 0; i < GRAIN.length; i++) {
    circle(GRAIN[i][0], GRAIN[i][1], 1.5);
  }
  noFill();
}

function drawLabelBand() {
  let wn = rowS.waveName;
  if (rowS.shifting && rowS.mix > 0.5 && rowS.targetName) wn = rowS.targetName;

  push();
  resetMatrix();
  blendMode(BLEND);
  noStroke();
  fill(PAPER);
  rect(0, 980, W, 100);          // 245 plate: the one disciplined zone
  textAlign(LEFT, BASELINE);
  fill(0);
  textFont('Oswald');
  textSize(26);
  textStyle(NORMAL);
  text('mis_registration', M, 1020);
  textFont('IBM Plex Mono');
  textSize(11);
  text(wn, M, 1040);
  textAlign(RIGHT, BASELINE);
  textSize(22);
  text('p5.waves', W - M, 1020);
  pop();
}

function frac(x) {
  return x - Math.floor(x);
}
