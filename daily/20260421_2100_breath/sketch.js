/*
  breath — 2026-04-21 · 21:00

  FEELING      : breath — one slow swell and release; a single
                 signal held with complete attention. Not a chorus,
                 not a tension, not a migration — the rehearsal of
                 one voice.

  WAVE LOGIC   : solo — `wobble sine` and nothing else.
                 wobble sine is amplitude-modulated inside its own
                 formula, so the wave self-breathes without a
                 second signal. No shift, no morph, no crossfade.
                 The discipline is subtraction: listening to one
                 wave until it reveals itself. Internal frequency
                 drifts on a slower clock so the breath tightens
                 and loosens over a ~48 s cycle.

  TIME LOGIC   : main t     = millis() / 2400   (slow cinematic drift)
                 envelope t = millis() / 5800   (slower breath-of-breath
                                                 shaping stroke weight)
                 frequency  = millis() / 7600   (long-cycle density
                                                 contraction)
                 NOTE: millis()/1000 is not used.

  STRUCTURAL   : single horizontal trace across the safe margin,
                 axis at y = 540. Stroke weight varies with local
                 |y| — quiet near the axis, heavier at the extremes
                 — so the line itself visually breathes under a
                 slow amplitude envelope. A hairline axis, sparse
                 ticks, amplitude rails, and nine small sample
                 readouts anchor the reading. A single moving
                 readhead on the right side states the current
                 normalised value. One wave, observed precisely.
*/

const W = 1080;
const H = 1080;
const M = 100;

const AXIS_Y = 540;
const AMP    = 240;
const BASE_FREQ = 0.0095;

let trace;

async function setup() {
  createCanvas(W, H);
  pixelDensity(2);
  await document.fonts.ready;

  trace = Waves.createSampler({
    wave: 'wobble sine',
    amplitude: AMP,
    seed: 7,
    phase: 0.15,
  });
}

function draw() {
  background(245);

  const t     = millis() / 2400;
  const tEnv  = (Math.sin(millis() / 5800) + 1) * 0.5;  // 0..1
  const fScale = 0.78 + 0.44 * (Math.sin(millis() / 7600) + 1) * 0.5; // 0.78..1.22
  const freq   = BASE_FREQ * fScale;

  const envK = 0.55 + tEnv * 0.45;  // 0.55..1.0 stroke-weight multiplier

  drawFrame();
  drawTrace(t, freq, envK);
  drawSampleReadouts(t, freq);
  drawReadHead(t, freq);
  drawLabels(freq, tEnv);
}

/* ── reference frame ──────────────────────────────────── */
function drawFrame() {
  noFill();

  // main axis
  stroke(30, 36);
  strokeWeight(0.8);
  line(M, AXIS_Y, W - M, AXIS_Y);

  // amplitude rails (upper / lower)
  stroke(30, 16);
  strokeWeight(0.5);
  line(M, AXIS_Y - AMP, W - M, AXIS_Y - AMP);
  line(M, AXIS_Y + AMP, W - M, AXIS_Y + AMP);

  // x-axis ticks
  stroke(30, 50);
  strokeWeight(0.8);
  const tickCount = 10;
  for (let i = 0; i <= tickCount; i++) {
    const x = M + (W - 2 * M) * i / tickCount;
    line(x, AXIS_Y - 5, x, AXIS_Y + 5);
  }

  // y-axis ticks (left + right)
  stroke(30, 36);
  strokeWeight(0.6);
  const ampTicks = 8;
  for (let i = -ampTicks / 2; i <= ampTicks / 2; i++) {
    const y = AXIS_Y + (AMP * i) / (ampTicks / 2);
    line(M - 7, y, M - 2, y);
    line(W - M + 2, y, W - M + 7, y);
  }
}

/* ── the single trace ─────────────────────────────────── */
function drawTrace(t, freq, envK) {
  noFill();
  stroke(28, 230);

  const step = 1;
  let prevX = M;
  let prevY = AXIS_Y + trace.sample((prevX - M) * freq, t);

  for (let x = M + step; x <= W - M; x += step) {
    const yOff = trace.sample((x - M) * freq, t);
    const y = AXIS_Y + yOff;

    const local = Math.max(Math.abs(prevY - AXIS_Y), Math.abs(y - AXIS_Y));
    const wLocal = lerp(0.4, 2.2, local / AMP) * envK;
    strokeWeight(wLocal);
    line(prevX, prevY, x, y);

    prevX = x;
    prevY = y;
  }
}

/* ── sparse sample readouts along the trace ──────────── */
function drawSampleReadouts(t, freq) {
  const DIVS = 9;   // readouts at 10%..90%
  for (let i = 1; i <= DIVS; i++) {
    const u = i / (DIVS + 1);
    const x = M + (W - 2 * M) * u;
    const yOff = trace.sample((x - M) * freq, t);
    const y = AXIS_Y + yOff;
    const norm = yOff / AMP;

    // dropline from axis to sample
    stroke(30, 44);
    strokeWeight(0.5);
    line(x, AXIS_Y, x, y);

    // dot
    noStroke();
    fill(30, 210);
    circle(x, y, 2.4);

    // numeric readout, offset away from axis
    const above = y < AXIS_Y;
    const labelY = above ? y - 10 : y + 14;
    fill(130);
    textFont('IBM Plex Mono');
    textStyle(NORMAL);
    textSize(8.5);
    textAlign(CENTER, above ? BASELINE : TOP);
    text(nf(norm, 1, 2), x, labelY);
  }
}

/* ── focal readhead (current value at canvas midpoint) ─ */
function drawReadHead(t, freq) {
  const x0 = W / 2;
  const yOff = trace.sample((x0 - M) * freq, t);
  const y0 = AXIS_Y + yOff;
  const norm = yOff / AMP;

  // prominent vertical reference through the readhead
  stroke(30, 32);
  strokeWeight(0.6);
  line(x0, AXIS_Y - AMP, x0, AXIS_Y + AMP);

  // larger marker
  noStroke();
  fill(25);
  circle(x0, y0, 4.2);

  // numeric readout — larger, sits just outside the amp rails
  const valStr = (norm >= 0 ? '+' : '−') + nf(Math.abs(norm), 1, 3);
  fill(90);
  textFont('IBM Plex Mono');
  textStyle(NORMAL);
  textSize(11);
  textAlign(CENTER, BASELINE);
  text(valStr, x0, AXIS_Y - AMP - 14);
}

/* ── labels (standard) ─────────────────────────────────── */
function drawLabels(freq, tEnv) {
  noStroke();

  // top-left meta
  fill(168);
  textFont('IBM Plex Mono');
  textStyle(NORMAL);
  textSize(9.5);
  textAlign(LEFT, BASELINE);
  text('solo  ·  single-line  ·  slow', M, M - 14);

  // top-right timestamp
  textAlign(RIGHT, BASELINE);
  text('2026.04.21 · 21:00', W - M, M - 14);

  // amplitude labels — left
  textAlign(RIGHT, CENTER);
  textSize(8.5);
  fill(150);
  text('+1.0', M - 14, AXIS_Y - AMP);
  text(' 0.0', M - 14, AXIS_Y);
  text('−1.0', M - 14, AXIS_Y + AMP);

  // frequency readout — right rail
  textAlign(LEFT, CENTER);
  fill(150);
  text('freq · ' + nf(freq * 1000, 1, 2), W - M + 14, AXIS_Y);

  // envelope readout — right rail, above
  text('env  · ' + nf(tEnv, 1, 2), W - M + 14, AXIS_Y - AMP);

  // bottom-left title — Oswald 300 22px, per standard
  fill(90, 90, 90, 242);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('breath', M, 854);

  // active wave label beneath title — Plex Mono 9.5px
  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  text('wobble sine', M, 870);

  // bottom-right p5.waves — Plex Mono 19px
  textFont('IBM Plex Mono');
  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', W - M, 854);
}
