// breathing_threshold — Daily p5.waves 2026-04-23
// ============================================================
// 1.  MODE: F — Formal.
// 1a. FORMAL QUESTION:
//     For a fixed wave field (`round linked sine` × `round
//     linked sine`, seed 7, speed 1), sampled as a 14×14
//     additive grid, what does threshold *do* across its full
//     operating range when swept continuously in time? T is
//     driven by a cosine so it travels slow→fast→slow between
//     the 5th and 95th percentile of the raw field — i.e. the
//     dial actually visits "almost empty" and "almost full".
//     Observed: the pattern doesn't fill or drain uniformly.
//     The topology of the underlying field reveals itself as
//     ridges — cells along wave crests flip on first, cells in
//     the valleys flip last. At the midpoint (T ≈ 0) the
//     pattern is balanced and maximally busy; at the extremes
//     it collapses to near-monochrome.
// 2.  GESTURE: BREATHES. One grid, filling and emptying, the
//     cells flipping in a specific field-determined order.
// 3.  REFERENCE ANCHOR: Bridget Riley — binary optical fields
//     that reveal a continuous structure through quantization.
// 4.  SEB ANCHOR: 20260422_2230_one_or_zero — same round-linked-
//     sine grid, same THRESH = 0 as the still image; this sketch
//     takes that frozen Weiner tautology and animates the one
//     parameter it held constant. The companion, not the sequel.
// 5.  LIBRARY MOVE: threshold, treated as a SWEPT DIAL.
//     p5.waves exposes `threshold` as a static option on
//     `createGrid`; most demos pick one value and commit. This
//     sketch samples the RAW (no-threshold) grid output each
//     frame and applies the cutoff manually, so the viewer sees
//     the full parameter spectrum play out without rebuilding
//     the grid. The 7-day rotation has covered wild mode,
//     morph/mix, frequency, waveRow/waveCol, shift, custom
//     domain and range-mapping recently; threshold last
//     appeared yesterday as a frozen rule (one_or_zero) — here
//     it becomes cinema. A binary-flip feature with clean
//     edges is, per the brief, one of the strong promoters —
//     "every cell is 1 or 0, the wave decides which" reads in
//     a 150-px thumbnail.
// 6.  COLOR COMMITMENT: ink on paper. Single ink (25) on cream
//     paper (245). Labels, rules and the histogram are greys.
//     No second color — the binary-ness of the move is the
//     palette argument.
// 7.  RISK: a swept threshold on a slow wave field can produce
//     hypnotic but structureless breathing — the grid just
//     fills and empties and the viewer can't name the move.
//     Mitigation: (a) a thin histogram strip tethered 6 px
//     above the grid shows the current distribution of raw
//     field values with a live vertical rule marking T; the
//     rule slides left/right through the bell, and the ink
//     share in the grid tracks the area to the right of the
//     rule. That's the explainer. (b) A live "T = ±.XX" and
//     "ink = XX%" readout sits in the header band so the dial
//     is named as well as shown.
// 8.  MATERIAL: 14×14 grid = 196 cells, cheap. Per frame: 196
//     evaluations + a 196-bin histogram + one threshold
//     comparison per cell. Sweep period 14 s (slow enough to
//     read the topology, fast enough for a 5 s README GIF to
//     show visible change). Grid cells are 40×40 — the stated
//     legibility minimum.

const W       = 900;
const H       = 900;
const M       = 100;

const PAPER   = 245;
const INK     = 25;
const FAINT   = 210;
const RULE    = 170;
const LABEL   = 120;
const TITLE_GREY = 90;
const META_GREY  = 168;

const COLS    = 14;
const ROWS    = 14;
const CELL    = 40;
const GRID_X  = M + 80;          // 180
const GRID_Y  = 200;
const GRID_W  = COLS * CELL;     // 560
const GRID_H  = ROWS * CELL;     // 560

// Histogram lane — tethered 6 px above the grid, merged with T-indicator.
const HIST_X  = GRID_X;
const HIST_W  = GRID_W;
const HIST_H  = 34;
const HIST_Y  = GRID_Y - 6 - HIST_H;  // 160

const WAVE_NAME = 'round linked sine';
const SEED    = 7;
const SPEED   = 1;

const SWEEP_PERIOD = 14;   // seconds for one -->  back oscillation
const FIELD_SPEED  = 0.04; // grid t increment per frame

// v3.3.0: createGrid() removed. The field was additive —
// cell(r,c) = rowFn(ri) + colFn(ci). Two samplers reproduce it.
let rowS, colS;
let stats = { min: -1.5, max: 1.5 };  // overwritten in setup from empirical samples
let fieldT = 0;
let histBins;
const N_BINS = 64;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  pixelDensity(2);
  noSmooth();

  rowS = Waves.createSampler({ wave: WAVE_NAME, range: [-1, 1] });
  colS = Waves.createSampler({ wave: WAVE_NAME, range: [-1, 1] });

  // Pre-sample the field across many t values to get robust stats.
  // Gives a stable sweep range that the in-flight values stay inside.
  const samples = [];
  for (let k = 0; k < 80; k++) {
    const tk = (k / 80) * 20;
    const cells = fieldCells(tk);
    for (let i = 0; i < cells.length; i++) samples.push(cells[i]);
  }
  samples.sort((a, b) => a - b);
  const lo = samples[Math.floor(samples.length * 0.05)];
  const hi = samples[Math.floor(samples.length * 0.95)];
  stats = { min: lo, max: hi };

  histBins = new Uint32Array(N_BINS);
  frameRate(30);
}

// Additive field, separable: rowFn(ri) + colFn(ci). One sample per row,
// one per col, summed per cell — the v3.3.0 two-sampler replacement for
// the removed createGrid().
function fieldCells(ph) {
  const rv = new Float32Array(ROWS);
  for (let r = 0; r < ROWS; r++) rv[r] = rowS.sample((r / ROWS) * TWO_PI + ph * SPEED);
  const cv = new Float32Array(COLS);
  for (let c = 0; c < COLS; c++) cv[c] = colS.sample((c / COLS) * TWO_PI + ph * SPEED);
  const out = new Float32Array(ROWS * COLS);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) out[r * COLS + c] = rv[r] + cv[c];
  }
  return out;
}

function __p5wSourceDraw() {
  background(PAPER);

  fieldT += FIELD_SPEED;
  const cells = fieldCells(fieldT);

  // Swept threshold T — cosine between stats.min and stats.max.
  const u = 0.5 - 0.5 * Math.cos((millis() / 1000) * (Math.PI * 2 / SWEEP_PERIOD));
  const T = stats.min + u * (stats.max - stats.min);

  // Binarize and tally histogram.
  let inkCount = 0;
  histBins.fill(0);
  const span = stats.max - stats.min;
  for (let i = 0; i < cells.length; i++) {
    const v = cells[i];
    if (v > T) inkCount++;
    const b = Math.max(0, Math.min(N_BINS - 1,
      Math.floor(((v - stats.min) / span) * N_BINS)));
    histBins[b]++;
  }

  drawHeader(T, inkCount / cells.length);
  drawHistogram(T);
  drawGrid(cells, T);
  drawSeriesLabels();
}

function drawHeader(T, inkShare) {
  noStroke();
  fill(0);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(30);
  textAlign(LEFT, TOP);
  text('breathing_threshold', GRID_X, 84);

  textFont('IBM Plex Mono');
  textSize(10);
  fill(LABEL);
  textAlign(LEFT, TOP);
  text("wave: \u2018round linked sine\u2019 \u00D7 \u2018round linked sine\u2019   \u00B7   two samplers \u2192 raw field   \u00B7   threshold swept",
       GRID_X, 118);

  textAlign(RIGHT, TOP);
  const tStr  = (T >= 0 ? '+' : '') + nf(T, 1, 2);
  const pctStr = nf(Math.round(inkShare * 100), 2) + '%';
  text('T = ' + tStr + '   \u00B7   ink = ' + pctStr, GRID_X + GRID_W, 118);
}

function drawHistogram(T) {
  noFill();
  stroke(FAINT);
  strokeWeight(0.5);
  line(HIST_X, HIST_Y + HIST_H, HIST_X + HIST_W, HIST_Y + HIST_H);

  // bars
  let maxBin = 1;
  for (let i = 0; i < N_BINS; i++) if (histBins[i] > maxBin) maxBin = histBins[i];

  noStroke();
  fill(RULE);
  const binW = HIST_W / N_BINS;
  for (let i = 0; i < N_BINS; i++) {
    const h = (histBins[i] / maxBin) * (HIST_H - 2);
    const x = HIST_X + i * binW;
    rect(x, HIST_Y + HIST_H - h, binW - 0.6, h);
  }

  // T indicator — vertical rule sliding across the bell
  const span = stats.max - stats.min;
  const tx = HIST_X + ((T - stats.min) / span) * HIST_W;
  stroke(INK);
  strokeWeight(1.2);
  line(tx, HIST_Y - 6, tx, HIST_Y + HIST_H);
  noStroke();
  fill(INK);
  triangle(tx - 4, HIST_Y - 10, tx + 4, HIST_Y - 10, tx, HIST_Y - 5);

  // axis ticks: min, 0, max
  fill(LABEL);
  textFont('IBM Plex Mono');
  textSize(9);
  textAlign(CENTER, TOP);
  const xMin  = HIST_X;
  const xZero = HIST_X + ((0 - stats.min) / span) * HIST_W;
  const xMax  = HIST_X + HIST_W;
  text(nf(stats.min, 1, 2), xMin, HIST_Y + HIST_H + 4);
  text('0', xZero, HIST_Y + HIST_H + 4);
  text('+' + nf(stats.max, 1, 2), xMax, HIST_Y + HIST_H + 4);

  // tiny label for the strip
  textAlign(LEFT, BASELINE);
  fill(LABEL);
  text('raw field distribution \u00B7 T slides \u2194', HIST_X, HIST_Y - 8);
}

function drawGrid(cells, T) {
  // frame rule
  noFill();
  stroke(FAINT);
  strokeWeight(0.5);
  rect(GRID_X, GRID_Y, GRID_W, GRID_H);

  noStroke();
  fill(INK);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = cells[r * COLS + c];
      if (v > T) {
        rect(GRID_X + c * CELL, GRID_Y + r * CELL, CELL, CELL);
      }
    }
  }
}

function drawSeriesLabels() {
  if (window.__P5WAVES_STAGE_ONLY__) return;
  push();
    resetMatrix();
    noStroke();

    fill(TITLE_GREY, TITLE_GREY, TITLE_GREY, 244);
    textFont('Oswald');
    textStyle(NORMAL);
    textSize(22);
    textAlign(LEFT, BASELINE);
    text('breathing_threshold', M, 854);

    fill(META_GREY);
    textFont('IBM Plex Mono');
    textSize(9.5);
    textAlign(LEFT, BASELINE);
    text(WAVE_NAME, M, 870);

    textSize(19);
    textAlign(RIGHT, BASELINE);
    text('p5.waves', W - M, 854);
  pop();
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
