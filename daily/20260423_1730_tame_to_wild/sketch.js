// tame_to_wild — Daily p5.waves 2026-04-23
// ============================================================
// 1.  MODE: F — Formal.
// 1a. FORMAL QUESTION:
//     For a single wave ('classic sine') at fixed frequency,
//     phase and seed, what is the continuous shape-spectrum
//     when mode: 'wild' is held constant and unpredictability
//     is swept from 0 to 1 in 25 equal steps? Rendered as 25
//     parallel horizontal traces stacked top-to-bottom, the
//     top trace frozen at u = 0.00 and the bottom at u = 1.00.
//     Time t advances continuously so the wild-mode noise
//     evolves without repeating. Observed: the top traces are
//     indistinguishable from one another (wild mode is
//     bypassed at u = 0); as u climbs, the same wave loses
//     first its amplitude regularity, then its frequency
//     regularity, then its spine — until the bottom trace is
//     structurally unrecognizable as the sine it started from.
// 2.  GESTURE: FRAYS. One shape, progressively losing its
//     rigor down the stack. Not a split, not a comparison —
//     a gradient.
// 3.  REFERENCE ANCHOR: Vera Molnár — systematic single-
//     variable variation, one parameter stepped cleanly, the
//     whole page as the study.
// 4.  SEB ANCHOR: p5.wavesX100 — the 100-sketch single-library
//     depth study, where the discipline is "one idea, enumerated
//     until exhausted". This is that move at 25 samplings.
// 5.  LIBRARY MOVE: mode: 'wild' + unpredictability treated as
//     a continuous axis rather than a single dial. The library
//     exposes unpredictability as a 0-1 knob; making the knob
//     visible as a gradient is the promoter payload. A viewer
//     sees, at a glance, what u = 0.25 looks like vs u = 0.75
//     without having to open the Wave Lab. No other animation
//     library I know of ships a parametric "controlled noise
//     inside a wave" feature — this is a p5.waves signature.
//     Deliberately chosen: the 7-day rotation has covered
//     waveRow/waveCol, morph, threshold, range, shift, tick
//     mode, input-domain, frequency-specimen and overprint.
//     stable_and_wild (2026-04-22) used wild mode as a binary
//     comparison; this sketch commits to it as a continuous
//     ramp — a different headline reading of the same feature.
// 6.  COLOR COMMITMENT: ink on paper. Single ink (30) on
//     cream paper (245). No second color. Labels in greys.
// 7.  RISK: at high u the wild-mode noise can drive a trace
//     past its allotted band and touch a neighbour. That
//     collision is not a bug — it IS the reading ("the wave
//     breaks its banks"). The real risk is that at thumbnail
//     size the fraying is legible but the "same-wave-all-the-
//     way-down" discipline is not, so the piece reads as
//     "noise increases downward" rather than "one wave, one
//     knob, twenty-five values". Mitigation: a single wave
//     name sits in both the header band and the series label,
//     and u values are printed at every fourth row so the
//     axis is readable without motion.
// 8.  MATERIAL: 25 rows × 220 samples = 5500 wild-mode
//     evaluations per frame — well under the 10k guideline.
//     Stroke weight 1.6 px on the traces, row spacing 26 px,
//     base amplitude 8 px. t advances at 0.3x so noise
//     evolution is slow enough to read as structural change,
//     not flicker.

const W           = 900;
const H           = 900;
const M           = 100;

const PAPER       = 245;
const INK         = 30;
const FAINT       = 200;
const LABEL_GREY  = 120;
const SERIES_TITLE_GREY = 90;
const SERIES_META_GREY  = 168;

const X0          = 130;
const X1          = 770;
const TRACE_W     = X1 - X0;

const N_ROWS      = 25;
const ROW_SPACING = 26;
const Y0          = 156;
const TOTAL_H     = (N_ROWS - 1) * ROW_SPACING;

const AMPLITUDE   = 8;
const WAVE_NAME   = 'classic sine';
const X_INPUT_SPAN = Math.PI * 60;  // 'classic sine' period ~20*PI; 60*PI = 3 cycles
const SEED        = 7;
const SAMPLES     = 220;
const SPEED       = 0.3;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  pixelDensity(2);
  noFill();
}

function __p5wSourceDraw() {
  background(PAPER);
  const t = millis() / 1000 * SPEED;
  drawHeader();
  drawAxis();
  drawTraces(t);
  drawSeriesLabels();
}

function drawHeader() {
  noStroke();
  fill(0);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(30);
  textAlign(LEFT, TOP);
  text('tame_to_wild', X0, 84);

  textFont('IBM Plex Mono');
  textSize(10);
  fill(LABEL_GREY);
  textAlign(LEFT, TOP);
  text("wave: \u2018classic sine\u2019   \u00B7   mode: 'wild'   \u00B7   unpredictability: 0 \u2192 1",
       X0, 118);

  textAlign(RIGHT, TOP);
  text('25 traces   \u00B7   one wave   \u00B7   one seed', X1, 118);
}

function drawAxis() {
  stroke(FAINT);
  strokeWeight(0.5);
  noFill();
  line(X0, Y0 - 14, X0, Y0 + TOTAL_H + 14);
  line(X1, Y0 - 14, X1, Y0 + TOTAL_H + 14);

  noStroke();
  fill(LABEL_GREY);
  textFont('IBM Plex Mono');
  textSize(9);
  textAlign(RIGHT, CENTER);
  for (let i = 0; i < N_ROWS; i++) {
    if (i % 4 === 0 || i === N_ROWS - 1) {
      const y = Y0 + i * ROW_SPACING;
      const u = i / (N_ROWS - 1);
      text('u = ' + nf(u, 1, 2), X0 - 12, y);
    }
  }

  textAlign(LEFT, CENTER);
  text('tame', X1 + 12, Y0);
  text('wild', X1 + 12, Y0 + TOTAL_H);
}

function drawTraces(t) {
  stroke(INK, 220);
  strokeWeight(1.6);
  strokeJoin(ROUND);
  noFill();

  for (let i = 0; i < N_ROWS; i++) {
    const u = i / (N_ROWS - 1);
    const yCenter = Y0 + i * ROW_SPACING;
    beginShape();
    for (let k = 0; k <= SAMPLES; k++) {
      const s = k / SAMPLES;
      const x = X0 + s * TRACE_W;
      const input = s * X_INPUT_SPAN;
      const v = Waves.wave(input, {
        wave:             WAVE_NAME,
        t:                t,
        amplitude:        AMPLITUDE,
        mode:             'wild',
        unpredictability: u,
        seed:             SEED
      });
      vertex(x, yCenter + v);
    }
    endShape();
  }
}

function drawSeriesLabels() {
  if (window.__P5WAVES_STAGE_ONLY__) return;
  push();
    resetMatrix();
    noStroke();

    fill(SERIES_TITLE_GREY, SERIES_TITLE_GREY, SERIES_TITLE_GREY, 244);
    textFont('Oswald');
    textStyle(NORMAL);
    textSize(22);
    textAlign(LEFT, BASELINE);
    text('tame_to_wild', M, 854);

    fill(SERIES_META_GREY);
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
