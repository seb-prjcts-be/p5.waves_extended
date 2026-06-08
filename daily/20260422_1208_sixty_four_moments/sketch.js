/*
 * sixty_four_moments
 * ============================================================
 * 1. MODE: L — Literal.
 * 1a. STATEMENT / TITLE:
 *     It is one wave drawn sixty-four times, each frozen
 *     at a different moment in time.
 * 2. GESTURE: slide. Time advances; every cell's frozen
 *     moment advances with it. The whole grid rolls.
 * 3. REFERENCE ANCHOR: Hanne Darboven — gridded time-writing.
 *     Numbers counting days across uniform cells; tautological.
 *     A typography of time.
 * 4. SEB ANCHOR: p5.wavesX100 — the single-library depth
 *     study. This is a single-frame cousin: one feature,
 *     no decoys, promoted cleanly.
 * 5. LIBRARY MOVE: tick-time mode / seconds parameter.
 *     `Waves.wave(y, { wave, t: <number> })` — `t` is a
 *     plain number. Each of the 64 cells passes its OWN
 *     explicit t value. Nothing else varies. The viewer sees,
 *     literally, the `t` parameter made spatial — 64 parallel
 *     freeze-frames of a single wave, sliding forward together
 *     as a global drift is added to every cell's t.
 * 6. COLOR COMMITMENT: one ink. Black (#111) on paper
 *     (#f1f1f1). No second color, no gradient, no accent.
 *     Darboven-pure.
 * 7. RISK: 64 small waves can read as decorative texture
 *     instead of as "time". Mitigation: (a) cells large
 *     (≥100 × 100 px — above the legibility floor), (b)
 *     tiny mono `t=N` numerals in each cell's top-left —
 *     the tautological Darboven tick that forces the
 *     "time" reading, (c) a single wave choice with
 *     enough internal variety (`wobble sine`) so each
 *     frozen moment looks distinct.
 * 8. MATERIAL: 8 × 8 grid, inclusive borders. `wobble sine`
 *     — `sin(x*.1)*cos(x*.2)*.5`, a two-frequency beat.
 *     Cell t-step = 4 s (large enough for adjacent cells
 *     to read as clearly different moments; total window
 *     spans 0 → 252 s). Global drift = millis() / 1000 ·
 *     1.25 — adds to every cell's t. Over a 5-second
 *     capture window the drift is ~6.25 s, slightly
 *     more than one cell-step: the whole grid visibly
 *     rolls forward by a cell.
 *
 * Research note: confirmed against
 * C:/server/htdocs/p5.waves/p5.waves.js — `t` is read
 * directly via toNumber(secondParam.t, 0) and folded into
 * the evalKernel as `x = (y + t) * frequency + phase`.
 * This is literally all the move is: one number, different
 * per cell.
 *
 * Artwork typography: no display type. Tiny mono cell
 * numerals only. Label band: Oswald 300 + IBM Plex Mono 400.
 */

const CANVAS = 1080;
const M = 100;
const LABEL_BAND = 120;

const GRID_N = 8;
const CELL_T_STEP = 4;
const DRIFT_RATE = 1.25;

const WAVE_NAME = 'wobble sine';
const WAVE_FREQ = 1.1;

let fontsReady = false;
let artX0, artY0, artW, artH, cellW, cellH;

async function setup() {
  createCanvas(CANVAS, CANVAS);
  pixelDensity(1);
  await document.fonts.ready;
  fontsReady = true;

  artX0 = M;
  artY0 = M;
  artW = CANVAS - 2 * M;
  artH = CANVAS - 2 * M - LABEL_BAND;
  cellW = artW / GRID_N;
  cellH = artH / GRID_N;
}

function draw() {
  background(241);

  const drift = (millis() / 1000) * DRIFT_RATE;

  drawGridBorders();
  drawMoments(drift);
  if (fontsReady) drawCellNumerals(drift);
  if (fontsReady) drawLabelBand(drift);
}

function drawGridBorders() {
  stroke(0, 0, 0, 28);
  strokeWeight(0.75);
  noFill();
  for (let i = 0; i <= GRID_N; i++) {
    const x = artX0 + i * cellW;
    line(x, artY0, x, artY0 + artH);
    const y = artY0 + i * cellH;
    line(artX0, y, artX0 + artW, y);
  }
}

function drawMoments(drift) {
  stroke(17);
  strokeWeight(2);
  noFill();

  const amp = cellH * 0.34;
  const padX = 10;
  const samples = Math.floor((cellW - 2 * padX) / 1.5);

  for (let r = 0; r < GRID_N; r++) {
    for (let c = 0; c < GRID_N; c++) {
      const idx = r * GRID_N + c;
      const cellT = idx * CELL_T_STEP + drift;

      const cx0 = artX0 + c * cellW;
      const cy0 = artY0 + r * cellH;
      const yMid = cy0 + cellH * 0.58;

      beginShape();
      for (let s = 0; s <= samples; s++) {
        const xLocal = padX + (s / samples) * (cellW - 2 * padX);
        const yOffset = Waves.wave(xLocal, {
          wave: WAVE_NAME,
          t: cellT,
          amplitude: amp,
          frequency: WAVE_FREQ,
        });
        vertex(cx0 + xLocal, yMid + yOffset);
      }
      endShape();
    }
  }
}

function drawCellNumerals(drift) {
  push();
  noStroke();
  fill(0, 0, 0, 150);
  textFont('IBM Plex Mono');
  textSize(9);
  textAlign(LEFT, TOP);
  for (let r = 0; r < GRID_N; r++) {
    for (let c = 0; c < GRID_N; c++) {
      const idx = r * GRID_N + c;
      const baseT = idx * CELL_T_STEP;
      const cx0 = artX0 + c * cellW;
      const cy0 = artY0 + r * cellH;
      text('t=' + nf(baseT, 3), cx0 + 6, cy0 + 5);
    }
  }
  pop();
}

function drawLabelBand(drift) {
  push();
  noStroke();

  const yTitle = CANVAS - M + 26;
  const ySub = CANVAS - M + 50;

  fill(17);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(26);
  textAlign(LEFT, BASELINE);
  text('sixty_four_moments', M, yTitle);

  textAlign(RIGHT, BASELINE);
  textSize(22);
  text('p5.waves', CANVAS - M, yTitle);

  textFont('IBM Plex Mono');
  textSize(11);
  textAlign(LEFT, BASELINE);
  fill(0, 0, 0, 200);
  text(
    "one wave, 64 frozen moments · wave='" + WAVE_NAME +
    "' · t = cell_index × " + CELL_T_STEP + 's + drift',
    M, ySub
  );

  textAlign(RIGHT, BASELINE);
  text('drift = ' + nf(drift, 1, 2) + ' s', CANVAS - M, ySub);
  pop();
}
