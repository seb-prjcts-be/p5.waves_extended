/*
 * stable_and_wild
 * ============================================================
 * 1. MODE: L — Literal.
 * 1a. STATEMENT / TITLE:
 *     It is one wave, drawn twice: stable on the left,
 *     wild on the right.
 * 2. GESTURE: DOUBLE. Same formula, rendered in two states,
 *     printed side by side so the difference IS the piece.
 * 3. REFERENCE ANCHOR: Lawrence Weiner — declarative statements
 *     that are literally the work. No hidden meaning; the
 *     declaration is the art. Typographic, specimen-like.
 * 4. SEB ANCHOR: p5.wavesX100 — single-library depth study.
 *     This is a one-capability specimen in that spirit:
 *     one feature, promoted by comparison, nothing else.
 * 5. LIBRARY MOVE: mode: 'wild' + unpredictability.
 *     A p5.waves signature. Controlled noise is engaged ONLY
 *     when `mode === 'wild'` AND `unpredictability > 0`.
 *     Left column: default stable mode. Right column:
 *     `mode: 'wild'`, `unpredictability: 0.55`. Same wave
 *     name, same amplitude, same frequency, same seed,
 *     same t. One parameter flipped — the delta between the
 *     two columns is the advert.
 * 6. COLOR COMMITMENT: one ink — near-black (#141414) on
 *     paper (#f5f5f5 canvas, #f1f1f1 page). Weiner-pure.
 * 7. RISK: side-by-side comparisons can read as textbook
 *     figure rather than art. Mitigation: plate-like framing,
 *     thin divider, restrained mono column labels, the literal
 *     statement as the title. Also: pick a wave with enough
 *     profile ('mountain peaks') that both sides read at
 *     thumbnail AND the jitter is unmistakable.
 * 8. MATERIAL: two vertical dotted plots separated by a hair
 *     divider. Wave 'mountain peaks', amplitude 170. Time
 *     drifts ~0.55 rad/s so both columns visibly evolve over
 *     any 5-second capture. The wild column shows structured
 *     jitter layered on top of the mountain profile; the
 *     stable column does not.
 *
 * Research note: unpredictability is a no-op in stable mode
 * (confirmed against the library source in C:/server/htdocs/p5.waves).
 * That is exactly why the comparison is legible: one call
 * ignores the knob, the other honors it.
 */

const CANVAS = 1080;
const M = 100;
const LABEL_BAND = 120;

const WAVE_NAME = 'mountain peaks';
const SEED = 4;
const AMP = 170;
const FREQ = 1.0;
const UNPREDICT = 0.55;
const DRIFT_RATE = 0.55;

const COL_SPACING = 12;
const DOT_SIZE = 5;

let fontsReady = false;

async function setup() {
  createCanvas(CANVAS, CANVAS);
  pixelDensity(1);
  await document.fonts.ready;
  fontsReady = true;
}

function draw() {
  background(245);

  const t = (millis() / 1000) * DRIFT_RATE;

  const artY0 = M;
  const artY1 = CANVAS - M - LABEL_BAND;
  const plotY0 = artY0 + 58;
  const plotY1 = artY1 - 24;

  const mid = CANVAS / 2;
  const colLcx = (M + mid) / 2;
  const colRcx = (mid + (CANVAS - M)) / 2;

  drawDivider(mid, artY0 + 28, artY1);
  drawColumn(colLcx, plotY0, plotY1, t, false);
  drawColumn(colRcx, plotY0, plotY1, t, true);

  if (fontsReady) {
    drawColumnHeads(colLcx, colRcx, artY0 + 22);
    drawLabelBand();
  }
}

function drawDivider(x, y0, y1) {
  stroke(0, 0, 0, 34);
  strokeWeight(0.75);
  line(x, y0, x, y1);
  noStroke();
}

function drawColumn(cx, y0, y1, t, wild) {
  noStroke();
  fill(20);
  for (let y = y0; y <= y1; y += COL_SPACING) {
    const yn = (y - y0) * 0.017;
    const opts = {
      wave: WAVE_NAME,
      seed: SEED,
      amplitude: AMP,
      frequency: FREQ,
      t: t,
    };
    if (wild) {
      opts.mode = 'wild';
      opts.unpredictability = UNPREDICT;
    }
    const xOff = Waves.wave(yn, opts);
    circle(cx + xOff, y, DOT_SIZE);
  }
}

function drawColumnHeads(lcx, rcx, y) {
  noStroke();
  fill(0, 0, 0, 180);
  textFont('IBM Plex Mono');
  textSize(11);
  textAlign(CENTER, BASELINE);
  text('STABLE', lcx, y);
  text("MODE: 'WILD'   ·   UNPREDICTABILITY 0.55", rcx, y);
}

function drawLabelBand() {
  const yTitle = CANVAS - M + 26;
  const ySub = CANVAS - M + 50;

  noStroke();
  fill(17);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(26);
  textAlign(LEFT, BASELINE);
  text('stable_and_wild', M, yTitle);

  textAlign(RIGHT, BASELINE);
  textSize(22);
  text('p5.waves', CANVAS - M, yTitle);

  textFont('IBM Plex Mono');
  textSize(11);
  fill(0, 0, 0, 200);
  textAlign(LEFT, BASELINE);
  text(
    "one wave, drawn twice · wave='" + WAVE_NAME +
    "' · amp " + AMP + " · freq " + FREQ,
    M, ySub
  );

  textAlign(RIGHT, BASELINE);
  text('mode ⇢ stable | wild', CANVAS - M, ySub);
}
