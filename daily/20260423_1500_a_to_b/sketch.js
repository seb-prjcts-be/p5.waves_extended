// a_to_b — Daily p5.waves 2026-04-23
// ============================================================
// 1.  MODE: F — Formal.
// 1a. FORMAL QUESTION:
//     What does the p5.waves morph — Waves.wave(x, {
//     wave: ['sine','square'], mix: m }) — look like when
//     mix m travels 0 → 1 → 0 over an 18 s cosine cycle, with
//     phase frozen (t = 0), rendered as one thick waveline
//     band running left → right across the canvas, while
//     faint hairline references of the two endpoint waves
//     (pure sine above, pure square below) stay frozen for
//     the whole session? Observable: at m = 0 the bold line
//     is exactly the upper reference, at m = 1 it is exactly
//     the lower reference, and at every m between it is the
//     linear interpolation of the two normalized wave values
//     at each x. The identity transformation — smooth ↔ hard
//     — is the whole content.
// 2.  GESTURE: MORPHS. A single shape slowly acquires and
//     sheds another shape's character. No second voice.
// 3.  REFERENCE ANCHOR: Ellsworth Kelly — one bold, specific
//     gesture per canvas, color and edge as material.
// 4.  SEB ANCHOR: LIVE_P5_SIN+COS_SYSTEMS_DATA_Brain_Calming_
//     Device_v03 — the slow-structural-motion lineage where
//     near-stillness carries the reading.
// 5.  LIBRARY MOVE: MORPH via wave:[A,B] + animated mix. This
//     is a p5.waves signature: `wave: ['sine','square']` with
//     a scalar `mix ∈ [0,1]` lets you interpolate the
//     normalized value of two named waves in one call. No
//     tweening library does this at the wave-family level —
//     lerp is between numbers, not between wave identities.
//     Deliberately chosen: 7-day rotation had two spatial-mix
//     / shift-based entries and today's row+col grid sketch;
//     temporal morph (mix animated in t, phase frozen) has
//     not been the headline this week.
// 6.  COLOR COMMITMENT: cream paper (245) + oxide red ink
//     (168, 50, 40). Single-ink risograph register; the
//     reference hairlines are a desaturated graphite, never
//     a second color.
// 7.  RISK: with phase frozen, a 5 s window only sees mix
//     travel ~28 % of the cycle — the morph change could
//     read as "the wave is just wiggling a bit". Mitigation:
//     (a) A = 'sine' (fully smooth) and B = 'square' (fully
//     binary) is the maximum visual delta available in the
//     library, so even ±15 % mix shifts sharp corners and
//     flat plateaus visibly in / out of the line; (b) the
//     two frozen hairline endpoints stay on canvas as
//     ground-truth references so the morph is read against
//     them; (c) the active mix value is printed live in the
//     label band and on a right-edge mix meter.
// 8.  MATERIAL: 800 px band of 400 samples, stroked at 7 px
//     weight on the live line (well above 2 px min) and
//     0.9 px on the reference hairlines. Canvas is 1080 to
//     meet Instagram thumbnail legibility. The mix meter is
//     a 6 px vertical strip on the right margin — literal
//     backing vocal, under 1 % of pixel weight.

const W       = 1080;
const M       = 140;                 // margin
const BAND_X0 = M;
const BAND_X1 = W - M;
const BAND_W  = BAND_X1 - BAND_X0;   // 800

const Y_CENTER  = 540;               // live line center
const Y_A_REF   = 228;               // pure sine reference
const Y_B_REF   = 852;               // pure square reference
const AMP_LIVE  = 200;
const AMP_REF   = 46;

const PAPER   = 245;
const INK     = [168, 50, 40];       // oxide red
const HAIR    = 170;                 // reference hairline grey
const FAINT   = 210;                 // very faint frame lines
const LABEL   = 120;

const CYCLE_S = 18;                  // morph period
const SCALE_X = 120;                 // horizontal wave density

const WAVE_A = 'sine';
const WAVE_B = 'square';

const SAMPLES = 400;

async function setup() {
  createCanvas(W, W);
  await document.fonts.ready;
  pixelDensity(2);
  noFill();
}

function draw() {
  background(PAPER);

  const tNow = millis() / 1000;
  const mix  = 0.5 - 0.5 * Math.cos((tNow / CYCLE_S) * TWO_PI);

  drawHeader(mix);
  drawReferenceWave(Y_A_REF, AMP_REF, WAVE_A, 'A', HAIR);
  drawReferenceWave(Y_B_REF, AMP_REF, WAVE_B, 'B', HAIR);
  drawCenterAxis();
  drawMorphBand(mix);
  drawMixMeter(mix);
  drawLabelBand(mix);
}

// ── Header ─────────────────────────────────────────────────
function drawHeader(mix) {
  noStroke();
  fill(0);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(34);
  textAlign(LEFT, TOP);
  text('a_to_b', BAND_X0, 90);

  textFont('IBM Plex Mono');
  textSize(10);
  fill(LABEL);
  textAlign(LEFT, TOP);
  text('morph  \u00B7  wave: [\u2018sine\u2019, \u2018square\u2019]  \u00B7  mix animated  \u00B7  t frozen',
       BAND_X0, 130);

  textAlign(RIGHT, TOP);
  text('18 s cycle   \u00B7   mix = ' + nf(mix, 1, 3),
       BAND_X1, 130);
}

// ── Frozen reference wave (A or B) ─────────────────────────
function drawReferenceWave(yCenter, amp, waveName, label, inkGrey) {
  // frame hairlines
  stroke(FAINT);
  strokeWeight(0.5);
  line(BAND_X0, yCenter - amp - 6, BAND_X1, yCenter - amp - 6);
  line(BAND_X0, yCenter + amp + 6, BAND_X1, yCenter + amp + 6);

  // axis
  stroke(FAINT);
  line(BAND_X0, yCenter, BAND_X1, yCenter);

  // the wave itself
  stroke(inkGrey);
  strokeWeight(0.9);
  noFill();
  beginShape();
  for (let k = 0; k <= SAMPLES; k++) {
    const u = k / SAMPLES;
    const x = BAND_X0 + u * BAND_W;
    const v = Waves.wave(u * SCALE_X, {
      wave: waveName,
      amplitude: 1,
      t: 0
    });
    vertex(x, yCenter - v * amp * 2);  // *2 since internal amp is ~0.25–0.5
  }
  endShape();

  // labels
  noStroke();
  fill(LABEL);
  textFont('IBM Plex Mono');
  textSize(9);
  textAlign(LEFT, BOTTOM);
  text(label + '  \u00B7  ' + waveName, BAND_X0, yCenter - amp - 10);
  textAlign(RIGHT, BOTTOM);
  text('reference (frozen)', BAND_X1, yCenter - amp - 10);
}

// ── Faint axis for the live band ───────────────────────────
function drawCenterAxis() {
  stroke(FAINT);
  strokeWeight(0.5);
  line(BAND_X0, Y_CENTER, BAND_X1, Y_CENTER);

  // subtle end caps
  line(BAND_X0, Y_CENTER - AMP_LIVE, BAND_X0, Y_CENTER + AMP_LIVE);
  line(BAND_X1, Y_CENTER - AMP_LIVE, BAND_X1, Y_CENTER + AMP_LIVE);
}

// ── Live morph band (the primary element) ──────────────────
function drawMorphBand(mix) {
  stroke(INK[0], INK[1], INK[2]);
  strokeWeight(7);
  strokeJoin(ROUND);
  strokeCap(ROUND);
  noFill();

  beginShape();
  for (let k = 0; k <= SAMPLES; k++) {
    const u = k / SAMPLES;
    const x = BAND_X0 + u * BAND_W;
    const v = Waves.wave(u * SCALE_X, {
      wave: [WAVE_A, WAVE_B],
      mix:  mix,
      t:    0,
      range: [-1, 1]
    });
    vertex(x, Y_CENTER - v * AMP_LIVE);
  }
  endShape();
}

// ── Mix meter (right margin, 6 px wide) ────────────────────
function drawMixMeter(mix) {
  const mx = W - 80;              // meter x
  const mw = 6;
  const my0 = 300;
  const my1 = 780;
  const mh  = my1 - my0;

  // track
  stroke(FAINT);
  strokeWeight(0.5);
  noFill();
  rect(mx - 0.5, my0 - 0.5, mw + 1, mh + 1);

  // fill
  noStroke();
  fill(INK[0], INK[1], INK[2]);
  const filled = mh * mix;
  rect(mx, my1 - filled, mw, filled);

  // endpoint labels
  fill(LABEL);
  textFont('IBM Plex Mono');
  textSize(9);
  textAlign(LEFT, CENTER);
  text('1.0  \u00B7  B', mx + mw + 6, my0);
  text('0.0  \u00B7  A', mx + mw + 6, my1);
  text('mix = ' + nf(mix, 1, 2), mx + mw + 6, (my0 + my1) / 2);
}

// ── Label band (series-standard, bottom) ───────────────────
function drawLabelBand(mix) {
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
    text('a_to_b', BAND_X0, 1020);

    textFont('IBM Plex Mono');
    textSize(11);
    text('morph  \u00B7  wave: [\u2018sine\u2019, \u2018square\u2019]  \u00B7  mix = ' + nf(mix, 1, 2) + '  \u00B7  18 s cycle',
         BAND_X0, 1040);

    textAlign(RIGHT, BASELINE);
    textFont('Oswald');
    textSize(22);
    text('p5.waves', W - BAND_X0, 1020);
  pop();
}
