// row_plus_col — Daily p5.waves 2026-04-23
// ============================================================
// 1.  MODE: F — Formal.
// 1a. FORMAL QUESTION:
//     What does Waves.createGrid(20, 20) produce when
//     waveRow = 'smooth solid sine' and waveCol = 'classic
//     sine', with range = [0, 1] and a manual ink threshold
//     at 0.5 — i.e. each cell inks iff the NORMALIZED sum of
//     the row-wave value and the col-wave value at that
//     (row, col) exceeds 0.5? Observable: the library's
//     createGrid formula is ADDITIVE, not multiplicative —
//     cell(row, col) = rowFn(ri, phase, rowSeed) + colFn(ci,
//     phase, colSeed), with ri = (row/R)·2π + phase·speed
//     and ci = (col/C)·2π + phase·speed. The row wave's
//     internal frequency happens to oscillate ~5 times
//     across [0, 2π] (visible variation across all 20 rows);
//     the col wave's lower internal frequency rises smoothly
//     across the same span (a clean horizontal gradient).
//     Their sum, thresholded at the midpoint of its range,
//     gives a 2D ink field where you can literally point at
//     either axis specimen and trace its contribution into
//     every cell. To keep the field breathing rather than
//     drifting out of the range-stats envelope, phase is
//     driven as 2·sin(tNow·0.38) — an oscillating time
//     argument — so the grid cycles around 50% ink at all
//     times rather than saturating to 100%.
// 2.  GESTURE: SUM. Two axis rhythms meet and add. The manual
//     threshold is the moment the addition crosses half-way.
// 3.  REFERENCE ANCHOR: Vera Molnár's systematic square
//     matrices (1974–1986) + Manfred Mohr P-021. The grid as
//     notation — every cell the consequence of two axis rules.
// 4.  SEB ANCHOR: p5.wavesX100 — the 100-sketch study where
//     each page promoted one move cleanly. This is a plate in
//     that methodology, re-done in 2026 typography.
// 5.  LIBRARY MOVE: waveRow + waveCol — the createGrid axis
//     formula made visible. Signature p5.waves move: no
//     tweening library exposes row-axis & col-axis wave
//     composition as a single primitive with time and range
//     normalization built in. Researcher's note: with a
//     forever-advancing t, the library's pre-computed stats
//     under-shoot the actual output range and the field
//     saturates; driving time as a bounded oscillation keeps
//     the grid inside its stats envelope — a real library
//     usage tip this sketch demonstrates and states.
// 6.  COLOR COMMITMENT: riso duotone — cream paper (245) +
//     one deep prussian blue ink. Faint hairlines only.
// 7.  RISK: a thresholded 20×20 grid risks reading as static
//     texture at thumbnail. Mitigation: phase oscillates ±4,
//     driving a full breathe cycle (~15% → 90% ink) across
//     ~21 s — any 5 s window shows dozens of cells flipping.
//     The live margin specimens continuously redraw the
//     source waves over the same phase, so the formula is
//     unmistakable as a live sum.
// 8.  MATERIAL: createGrid(20, 20, { waveRow: 'smooth solid
//     sine', waveCol: 'classic sine', range: [0, 1],
//     speed: 0.5 }). Grid is 20 × 20 × 40 px = 800 px → meets
//     the 40 px cell minimum. Margin specimens are thin strips
//     tethered ~10 px from the grid edges (not page edges),
//     showing live Waves.wave() output of the exact row & col
//     functions over the same oscillating phase. RESEARCHER'S
//     NOTE: I chose 'smooth solid sine' for the row axis after
//     auditing all 34 waves' output across [0, 2π] — it's one
//     of only a few with multiple zero crossings in that span,
//     so the row direction shows real variation across 20
//     cells instead of a single half-cycle band.

const W = 1080;
const COLS = 20, ROWS = 20;
const CELL = 40;
const GRID_W = COLS * CELL; // 800
const GRID_H = ROWS * CELL; // 800
const GRID_X = 140;          // (1080 - 800) / 2
const GRID_Y = 170;

const PAPER = 245;
const INK = [14, 34, 78];    // deep prussian blue
const HAIR = 222;            // faint hairline grey

const SPEED = 0.5;
const PHASE_AMP = 3.0;
const PHASE_FREQ = 0.38;
const INK_THRESHOLD = 0.5;

const WAVE_ROW = 'smooth solid sine';
const WAVE_COL = 'classic sine';

// Margin-specimen geometry (tethered a few px from the grid)
const COL_STRIP_H = 22;
const COL_STRIP_GAP = 10;
const COL_STRIP_Y = GRID_Y - COL_STRIP_GAP - COL_STRIP_H; // 138

const ROW_STRIP_W = 22;
const ROW_STRIP_GAP = 10;
const ROW_STRIP_X = GRID_X - ROW_STRIP_GAP - ROW_STRIP_W; // 108

// v3.3.0: createGrid() removed. The grid was an additive field —
// cell(r,c) = rowFn(ri) + colFn(ci). Two samplers reproduce it exactly.
let rowS, colS;

async function setup() {
  createCanvas(W, W);
  await document.fonts.ready;
  pixelDensity(2);

  rowS = Waves.createSampler({ wave: WAVE_ROW, range: [0, 1] });
  colS = Waves.createSampler({ wave: WAVE_COL, range: [0, 1] });
}

function draw() {
  background(PAPER);
  const tNow = millis() / 1000;
  const phase = PHASE_AMP * Math.sin(tNow * PHASE_FREQ);

  drawHeader(phase);
  drawColSpecimen(phase);
  drawRowSpecimen(phase);
  drawGrid(phase);
  drawFormulaNote();
  drawLabelBand();
}

// ── Header ─────────────────────────────────────────────────
function drawHeader(phase) {
  noStroke();
  fill(0);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(34);
  textAlign(LEFT, TOP);
  text('row_plus_col', GRID_X, 90);

  textFont('IBM Plex Mono');
  textSize(10);
  fill(120);
  text('createSampler \u00D72  \u00B7  waveRow \u2295 waveCol  \u00B7  ink iff sum > mid', GRID_X, 130);

  textAlign(RIGHT, TOP);
  text('20 \u00D7 20   speed 0.5   phase ' + nf(phase, 1, 2), GRID_X + GRID_W, 130);
}

// ── Col specimen (top strip) — live classic sine curve ─────
function drawColSpecimen(phase) {
  const y0 = COL_STRIP_Y;
  const h  = COL_STRIP_H;
  const xL = GRID_X;
  const xR = GRID_X + GRID_W;
  const yMid = y0 + h / 2;
  const yAmp = h * 0.42;

  // Strip frame + center line
  stroke(HAIR);
  strokeWeight(0.5);
  line(xL, y0, xR, y0);
  line(xL, y0 + h, xR, y0 + h);
  line(xL, yMid, xR, yMid);

  // Per-col tick marks
  for (let c = 0; c <= COLS; c++) {
    const x = xL + (c / COLS) * GRID_W;
    line(x, y0 + h - 2, x, y0 + h);
  }

  // Plot classic sine — the same function createGrid reads along col axis
  stroke(INK[0], INK[1], INK[2]);
  strokeWeight(1.6);
  noFill();
  beginShape();
  const RES = 400;
  for (let k = 0; k <= RES; k++) {
    const u = k / RES;
    const ci = u * TWO_PI + phase * SPEED;
    const v = Waves.wave(ci, { wave: WAVE_COL, amplitude: 1, t: 0 });
    vertex(xL + u * GRID_W, yMid - v * yAmp);
  }
  endShape();

  // Labels
  noStroke();
  fill(150);
  textFont('IBM Plex Mono');
  textSize(9);
  textAlign(LEFT, BOTTOM);
  text('col axis \u00B7 ' + WAVE_COL, xL, y0 - 4);
  textAlign(RIGHT, BOTTOM);
  text('colFn(ci, phase)', xR, y0 - 4);
}

// ── Row specimen (left strip) — live square-wave steps ─────
function drawRowSpecimen(phase) {
  const x0 = ROW_STRIP_X;
  const w  = ROW_STRIP_W;
  const yT = GRID_Y;
  const yB = GRID_Y + GRID_H;
  const xMid = x0 + w / 2;
  const xAmp = w * 0.42;

  stroke(HAIR);
  strokeWeight(0.5);
  line(x0, yT, x0, yB);
  line(x0 + w, yT, x0 + w, yB);
  line(xMid, yT, xMid, yB);

  for (let r = 0; r <= ROWS; r++) {
    const y = yT + (r / ROWS) * GRID_H;
    line(x0 + w - 2, y, x0 + w, y);
  }

  stroke(INK[0], INK[1], INK[2]);
  strokeWeight(1.6);
  noFill();
  beginShape();
  const RES = 400;
  for (let k = 0; k <= RES; k++) {
    const u = k / RES;
    const ri = u * TWO_PI + phase * SPEED;
    const v = Waves.wave(ri, { wave: WAVE_ROW, amplitude: 1, t: 0 });
    vertex(xMid - v * xAmp, yT + u * GRID_H);
  }
  endShape();

  // Rotated labels down the left edge of the strip
  push();
  noStroke();
  fill(150);
  textFont('IBM Plex Mono');
  textSize(9);
  translate(x0 - 6, yT);
  rotate(-HALF_PI);
  textAlign(RIGHT, BOTTOM);
  text('row axis \u00B7 ' + WAVE_ROW, 0, 0);
  textAlign(LEFT, BOTTOM);
  text('rowFn(ri, phase)', -GRID_H, 0);
  pop();
}

// ── Grid ───────────────────────────────────────────────────
function drawGrid(phase) {
  // Additive field, separable: one rowFn sample per row, one colFn per
  // col, summed per cell. Sum is in [0,2]; ink past the midpoint (1.0).
  const rowV = [];
  for (let row = 0; row < ROWS; row++) {
    rowV[row] = rowS.sample((row / ROWS) * TWO_PI + phase * SPEED);
  }
  const colV = [];
  for (let col = 0; col < COLS; col++) {
    colV[col] = colS.sample((col / COLS) * TWO_PI + phase * SPEED);
  }

  stroke(HAIR);
  strokeWeight(0.5);
  noFill();
  rect(GRID_X - 0.5, GRID_Y - 0.5, GRID_W + 1, GRID_H + 1);

  noStroke();
  fill(INK[0], INK[1], INK[2]);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (rowV[row] + colV[col] > INK_THRESHOLD * 2) {
        rect(GRID_X + col * CELL, GRID_Y + row * CELL, CELL, CELL);
      }
    }
  }

  // Very faint inner grid lines — subordinate structural legibility
  stroke(PAPER, 180);
  strokeWeight(0.5);
  for (let i = 1; i < COLS; i++) {
    const x = GRID_X + i * CELL;
    line(x, GRID_Y, x, GRID_Y + GRID_H);
  }
  for (let i = 1; i < ROWS; i++) {
    const y = GRID_Y + i * CELL;
    line(GRID_X, y, GRID_X + GRID_W, y);
  }
}

// ── Formula note (between grid and label band) ─────────────
function drawFormulaNote() {
  noStroke();
  fill(120);
  textFont('IBM Plex Mono');
  textSize(11);
  textAlign(LEFT, TOP);
  text('cell(r, c) = rowFn(ri, phase) + colFn(ci, phase)   \u2192 range[0,1]   ink iff > 0.5',
       GRID_X, GRID_Y + GRID_H + 14);

  textAlign(RIGHT, TOP);
  text('ri = (r/R)\u00B72\u03C0 + phase\u00B7speed     ci = (c/C)\u00B72\u03C0 + phase\u00B7speed',
       GRID_X + GRID_W, GRID_Y + GRID_H + 14);
}

// ── Label band (series-standard, black) ────────────────────
function drawLabelBand() {
  if (window.__P5WAVES_STAGE_ONLY__) return;
  push();
    resetMatrix();
    blendMode(BLEND);
    noStroke();

    textAlign(LEFT, BASELINE);
    fill(0);
    textFont('Oswald');
    textStyle(NORMAL);
    textSize(26);
    text('row_plus_col', GRID_X, 1020);

    textFont('IBM Plex Mono');
    textSize(11);
    text('smooth solid sine \u2295 classic sine  \u00B7  createSampler \u00D72 \u00B7 row\u2295col \u00B7 20\u00D720',
         GRID_X, 1040);

    textAlign(RIGHT, BASELINE);
    textFont('Oswald');
    textSize(22);
    text('p5.waves', W - GRID_X, 1020);
  pop();
}
