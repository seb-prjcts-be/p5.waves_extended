/*
 * range_to_radius
 * ============================================================
 * 1. MODE: F — Formal.
 * 1a. FORMAL QUESTION:
 *     What does 'round linked sine' look like when range: [4, 32]
 *     drives the RADIUS — not the y-position — of a 10x10 circle
 *     grid sampled at s = col * 0.42 + row * 0.17, with slow
 *     continuous time drift, rendered alongside a margin-preview
 *     strip that draws the same wave curve between the same
 *     [4, 32] clamp markers?
 *     Variables: (a) sample formula's row/col weights,
 *     (b) range min and max, (c) time drift speed.
 *     Observation: whether the range parameter is visibly the
 *     thing driving the plate — i.e. whether the viewer can read
 *     the preview curve, look down at the circle grid, and
 *     recognise that the curve's local y IS each cell's radius.
 *
 * 2. GESTURE: BREATHES. Each cell expands and contracts inside
 *    the [4, 32] clamp; the whole field breathes together but at
 *    row- and col-offset phase.
 *
 * 3. REFERENCE ANCHOR: Vera Molnár — parametrised systematic
 *    grids; same element, exhaustive controlled variation.
 *
 * 4. SEB ANCHOR: p5.wavesX100 — the single-library depth study.
 *    This plate is exactly a p5.wavesX100 page: one capability,
 *    shown once, legibly, with its own preview of the mechanism.
 *
 * 5. LIBRARY MOVE: range: [min, max].
 *    In p5.waves, `range` overrides `amplitude` and maps the
 *    wave output into the exact numeric band [min, max] via the
 *    wave's observed stats. Here that band is PIXELS and is fed
 *    directly to circle() as radius. The promotional point: a
 *    p5.waves wave can drive any scalar parameter — radius,
 *    alpha, scale, stroke weight, hue — not only y-displacement.
 *    The preview strip proves the move: the curve you see in
 *    the strip is literally what the circle radii are doing.
 *
 * 6. COLOR COMMITMENT: single ink on paper.
 *    rgb(26,26,26) on canvas #f5f5f5 / page #f1f1f1. No second
 *    hue, no tint, no overprint. Martens / Molnár register.
 *
 * 7. RISK: a grid of breathing circles will read, by default, as
 *    "breathing circles" — the RANGE move hides behind the nice
 *    aesthetic and the sketch scores as a 7/10 vibe instead of
 *    a 9/10 advert. Mitigation: the margin-preview lane shows
 *    the exact wave curve between horizontal [min, max] bounds,
 *    labeled "range: [4, 32]". The preview is tethered to the
 *    grid's column x-positions so the viewer can trace a preview
 *    y-value down to the matching column of circles. The preview
 *    is one subordinate lane, not a competing system.
 *    Second risk: 10x10 = 100 cells at max diameter 64 could
 *    crowd. Mitigation: cells are 68px, max diameter 64px, so
 *    the largest state always leaves a 2px gutter.
 *
 * 8. MATERIAL: one primary surface (the 10x10 circle grid) and
 *    one subordinate lane (the preview curve + range clamps).
 *    One wave formula, one time driver, one range. The LIBRARY
 *    MOVE is the entire composition logic.
 *
 * Research notes (2026-04-22):
 * - Verified range behaviour in C:/server/htdocs/p5.waves/p5.waves.js
 *   (mapToRange at line 330): output is lerp(range[0], range[1], t)
 *   where t is the wave's self-normalised position. range overrides
 *   amplitude.
 * - Wave `round linked sine` — index 31, family "Layered Sine".
 * - Example 09_range_0_1 applies range to brightness; this plate
 *   transposes the same move to a different scalar axis (radius).
 * - Not a shift or morph sketch — deliberately off the recent
 *   rotation (shift/wild/tick/mix/grid/selectbyindex/morph all
 *   covered in last 24h). This is the range promo.
 */

const CANVAS = 900;
const M = 100;

const COLS = 10;
const ROWS = 10;
const CELL = 68;
const GRID_W = COLS * CELL;
const GRID_H = ROWS * CELL;
const GX0 = (CANVAS - GRID_W) / 2;
const GY0 = M + 24;

const WAVE_NAME = 'round linked sine';
const R_MIN = 4;
const R_MAX = 32;
const ROW_W = 0.17;
const COL_W = 0.42;
const T_SCALE = 0.35;

const PV_Y0 = 78;
const PV_Y1 = 106;
const PV_X0 = GX0 + CELL / 2;
const PV_X1 = GX0 + GRID_W - CELL / 2;

let fontsReady = false;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(1);
  await document.fonts.ready;
  fontsReady = true;
}

function __p5wSourceDraw() {
  background(245);

  const t = millis() / 1000 * T_SCALE;

  drawPreview(t);
  drawGrid(t);

  if (fontsReady) drawLabels();
}

function drawGrid(t) {
  noStroke();
  fill(26);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cx = GX0 + col * CELL + CELL / 2;
      const cy = GY0 + row * CELL + CELL / 2;
      const s = col * COL_W + row * ROW_W;
      const r = Waves.wave(s, {
        wave: WAVE_NAME,
        t: t,
        range: [R_MIN, R_MAX]
      });
      circle(cx, cy, r * 2);
    }
  }
}

function drawPreview(t) {
  stroke(26, 55);
  strokeWeight(0.8);
  line(PV_X0, PV_Y0, PV_X1, PV_Y0);
  line(PV_X0, PV_Y1, PV_X1, PV_Y1);

  stroke(26);
  strokeWeight(1.1);
  noFill();
  beginShape();
  for (let x = PV_X0; x <= PV_X1; x += 2) {
    const col = (x - PV_X0) / (PV_X1 - PV_X0) * (COLS - 1);
    const s = col * COL_W;
    const r = Waves.wave(s, {
      wave: WAVE_NAME,
      t: t,
      range: [R_MIN, R_MAX]
    });
    const py = map(r, R_MIN, R_MAX, PV_Y1, PV_Y0);
    vertex(x, py);
  }
  endShape();

  noStroke();
  fill(26);
  for (let col = 0; col < COLS; col++) {
    const x = PV_X0 + col * (PV_X1 - PV_X0) / (COLS - 1);
    const s = col * COL_W;
    const r = Waves.wave(s, {
      wave: WAVE_NAME,
      t: t,
      range: [R_MIN, R_MAX]
    });
    const py = map(r, R_MIN, R_MAX, PV_Y1, PV_Y0);
    circle(x, py, 2.4);
  }
}

function drawLabels() {
  if (window.__P5WAVES_STAGE_ONLY__) return;
  noStroke();

  textFont('IBM Plex Mono');
  textSize(9);
  textAlign(LEFT, BASELINE);
  fill(26, 170);
  text('range: [4, 32]  →  radius', PV_X0, PV_Y0 - 8);
  textAlign(RIGHT, BASELINE);
  fill(120);
  text('row 0 · preview', PV_X1, PV_Y0 - 8);

  fill(90, 90, 90, 242);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('range_to_radius', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text(WAVE_NAME, M, 870);

  textFont('IBM Plex Mono');
  textSize(19);
  fill(168);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', CANVAS - M, 854);
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
