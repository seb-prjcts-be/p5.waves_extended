/*
 * STATIC
 *
 * FEELING      — static: radio interference, nervous tuning, one calm
 *                signal held inside the breakdown.
 * WAVE LOGIC   — duo in tension. A binary grid of fuzzy pulse × up down
 *                pulse produces the nervous chaos field; a single smooth
 *                solid sine draws the quiet signal running through it.
 * TIME LOGIC   — multi-speed. The static field ticks at millis()/120
 *                (hyper-fast, fragile, glitch). The calm line drifts at
 *                millis()/3000. A 25:1 ratio amplifies the order/disorder
 *                tension — one frame of noise for every slow breath.
 * STRUCTURAL   — the chaos field fills the canvas; a narrow horizontal
 *                corridor carves a silent band through the noise and lets
 *                the slow wave appear. A slow sine drives the corridor's
 *                vertical drift so the signal searches for its frequency.
 */

const CANVAS = 1080;
const M = 100;

const OSWALD = 'Oswald';
const MONO = 'IBM Plex Mono';

const COLS = 110;
const ROWS = 110;
const CELL = (CANVAS - M * 2) / COLS;

// v3.3.0: createGrid() removed. The static field was a binary additive
// grid (threshold 0). Two summed samplers reproduce it, separably/cheaply.
let staticRow, staticCol;
let calm;
let bandDriver;

async function setup() {
  createCanvas(CANVAS, CANVAS);
  pixelDensity(2);
  frameRate(30);
  await document.fonts.ready;

  staticRow = Waves.createSampler({ wave: 'fuzzy pulse',   range: [-1, 1] });
  staticCol = Waves.createSampler({ wave: 'up down pulse', range: [-1, 1] });

  calm = Waves.createSampler({
    wave: 'smooth solid sine',
    range: [-28, 28],
    frequency: 0.0045,
    phase: 0.8
  });

  bandDriver = Waves.createSampler({
    wave: 'classic sine',
    range: [-110, 110],
    frequency: 0.35
  });

  noStroke();
}

function draw() {
  background(245);

  const tFast = millis() / 120;
  const tSlow = millis() / 3000;
  const tBand = millis() / 8000;

  const SP = 1.2;
  const rVal = new Float32Array(ROWS);
  for (let r = 0; r < ROWS; r++) rVal[r] = staticRow.sample((r / ROWS) * TWO_PI + tFast * SP);
  const cVal = new Float32Array(COLS);
  for (let c = 0; c < COLS; c++) cVal[c] = staticCol.sample((c / COLS) * TWO_PI + tFast * SP);
  const on = (r, c) => rVal[r] + cVal[c] > 0;

  const bandY = CANVAS * 0.5 + bandDriver.sample(1, tBand);
  const bandHalf = 34;

  const topBand = bandY - bandHalf;
  const botBand = bandY + bandHalf;

  for (let r = 0; r < ROWS; r++) {
    const py = M + r * CELL;
    if (py + CELL > topBand && py < botBand) continue;
    for (let c = 0; c < COLS; c++) {
      if (!on(r, c)) continue;
      const px = M + c * CELL;
      fill(30);
      rect(px, py, CELL, CELL);
    }
  }

  const gutterSparsity = 0.18;
  for (let r = 0; r < ROWS; r++) {
    const py = M + r * CELL;
    if (py + CELL <= topBand || py >= botBand) continue;
    for (let c = 0; c < COLS; c++) {
      if (!on(r, c)) continue;
      if (Math.random() > gutterSparsity) continue;
      const px = M + c * CELL;
      fill(210);
      rect(px, py, CELL, CELL);
    }
  }

  stroke(205);
  strokeWeight(0.5);
  line(M, topBand, CANVAS - M, topBand);
  line(M, botBand, CANVAS - M, botBand);

  noFill();
  stroke(28);
  strokeWeight(1);
  beginShape();
  for (let x = M; x <= CANVAS - M; x += 2) {
    const y = calm.sample(x, tSlow);
    vertex(x, bandY + y);
  }
  endShape();

  noStroke();
  fill(30);
  const headX = M + ((millis() / 14) % (CANVAS - M * 2));
  const headY = bandY + calm.sample(headX, tSlow);
  circle(headX, headY, 5);

  drawLabels();
}

function drawLabels() {
  noStroke();

  textFont(OSWALD);
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 242);
  textAlign(LEFT, BASELINE);
  text('static', M, CANVAS - 46);

  textFont(MONO);
  textSize(9.5);
  fill(168);
  textAlign(LEFT, BASELINE);
  text('fuzzy pulse × up down pulse  /  smooth solid sine', M, CANVAS - 30);

  textFont(MONO);
  textSize(19);
  fill(168);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', CANVAS - M, CANVAS - 46);
}
