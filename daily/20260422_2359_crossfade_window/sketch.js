// Crossfade Window — p5.waves Daily · 2026-04-22
// Formal specimen of createSampler({ shift: true }).
// Eight asynchronous shift-mode samplers; each row renders its .waveName curve
// in graphite and overlays the incoming .targetName in cadmium during the
// 1-second shiftDuration window. The library's era boundary becomes the event.

const ROWS = 8;
const M = 100;

const BAND_TOP = 180;
const BAND_H = 64;
const BAND_L = M;
const BAND_R = 900 - M;
const BAND_W = BAND_R - BAND_L;

const SAMPLE_COUNT = 220;
const WAVE_DOMAIN = 60;

const INK_A = [28, 28, 28];
const INK_B = [208, 60, 42];
const PAPER = 245;

const SHIFT_INTERVAL = 4;
const SHIFT_DURATION = 1;
const CYCLE_DUR = SHIFT_INTERVAL + SHIFT_DURATION;

const samplers = [];
const seedList = [];
const offsets = [];

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;

  for (let i = 0; i < ROWS; i++) {
    const seed = 11 + i * 37;
    samplers.push(Waves.createSampler({
      shift: true,
      shiftInterval: SHIFT_INTERVAL,
      shiftDuration: SHIFT_DURATION,
      seed: seed,
      group: 'gentle',
      amplitude: 1,
      range: [-1, 1]
    }));
    seedList.push(seed);
    offsets.push((CYCLE_DUR / ROWS) * i);
  }

  pixelDensity(2);
}

function __p5wSourceDraw() {
  background(PAPER);
  const tNow = millis() / 1000;

  drawHeader();
  for (let i = 0; i < ROWS; i++) drawBand(i, tNow);
  drawTimeline(tNow);
  drawFooter();
}

function drawHeader() {
  noStroke();
  fill(INK_A[0], INK_A[1], INK_A[2]);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(34);
  textAlign(LEFT, TOP);
  text('crossfade window', M, 92);

  textFont('IBM Plex Mono');
  textSize(10);
  fill(150);
  textAlign(LEFT, TOP);
  text('createSampler · shift:true · shiftInterval 4 · shiftDuration 1', M, 138);

  textAlign(RIGHT, TOP);
  text('n=8  group:gentle  cycle=5s', 900 - M, 138);

  stroke(225);
  strokeWeight(0.5);
  line(M, 160, 900 - M, 160);
  noStroke();
}

function drawBand(i, tNow) {
  const s = samplers[i];
  const tLocal = tNow + offsets[i];
  s.sample(0, tLocal);

  const mix = s.mix;
  const shifting = s.shifting;
  const waveName = s.waveName;
  const targetName = s.targetName;

  const y0 = BAND_TOP + i * BAND_H;
  const yCenter = y0 + BAND_H / 2;
  const yAmp = BAND_H * 0.4;

  if (shifting) {
    noStroke();
    fill(INK_B[0], INK_B[1], INK_B[2], 20 * mix);
    rect(BAND_L, y0 + 1, BAND_W, BAND_H - 2);
  }

  stroke(230);
  strokeWeight(0.5);
  line(BAND_L, y0, BAND_R, y0);

  stroke(228);
  strokeWeight(0.5);
  line(BAND_L, yCenter, BAND_R, yCenter);
  noStroke();

  plotCurve(waveName, seedList[i], yCenter, yAmp, INK_A, 255);
  if (shifting) {
    plotCurve(targetName, seedList[i], yCenter, yAmp, INK_B, 255);
  }

  textFont('IBM Plex Mono');
  textStyle(NORMAL);
  textSize(9);
  textAlign(LEFT, TOP);
  fill(165);
  text(nf(i + 1, 2), BAND_L + 4, y0 + 8);

  textFont('Oswald');
  textSize(15);
  fill(INK_A[0], INK_A[1], INK_A[2]);
  text(waveName, BAND_L + 26, y0 + 5);

  if (shifting) {
    textAlign(RIGHT, TOP);
    fill(INK_B[0], INK_B[1], INK_B[2], 255 * mix);
    text('→ ' + targetName, BAND_R - 4, y0 + 5);
  }

  if (shifting) {
    noStroke();
    fill(INK_B[0], INK_B[1], INK_B[2]);
    rect(BAND_L, y0 + BAND_H - 3, BAND_W * mix, 1.5);
  }

  if (i === ROWS - 1) {
    stroke(230);
    strokeWeight(0.5);
    line(BAND_L, y0 + BAND_H, BAND_R, y0 + BAND_H);
    noStroke();
  }
}

function plotCurve(waveName, seed, yCenter, yAmp, ink, alpha) {
  stroke(ink[0], ink[1], ink[2], alpha);
  strokeWeight(1.8);
  noFill();
  beginShape();
  for (let k = 0; k <= SAMPLE_COUNT; k++) {
    const u = k / SAMPLE_COUNT;
    const xPos = BAND_L + u * BAND_W;
    const val = Waves.wave(u * WAVE_DOMAIN, {
      wave: waveName,
      t: 0,
      seed: seed,
      range: [-1, 1]
    });
    vertex(xPos, yCenter - val * yAmp);
  }
  endShape();
}

function drawTimeline(tNow) {
  const yTop = 728;
  const yH = 54;

  textFont('IBM Plex Mono');
  textSize(9);
  fill(165);
  textAlign(LEFT, TOP);
  noStroke();
  text('cycle timeline · shift region in cadmium', BAND_L, yTop - 14);
  textAlign(RIGHT, TOP);
  text('shiftInterval=4  shiftDuration=1', BAND_R, yTop - 14);

  for (let i = 0; i < ROWS; i++) {
    const tLocal = tNow + offsets[i];
    const progress = (tLocal % CYCLE_DUR) / CYCLE_DUR;
    const laneY = yTop + yH * ((i + 0.5) / ROWS);

    stroke(232);
    strokeWeight(0.4);
    line(BAND_L, laneY, BAND_R, laneY);

    stroke(INK_B[0], INK_B[1], INK_B[2], 85);
    strokeWeight(1);
    line(
      BAND_L + BAND_W * (SHIFT_INTERVAL / CYCLE_DUR),
      laneY,
      BAND_R,
      laneY
    );

    noStroke();
    fill(INK_A[0], INK_A[1], INK_A[2]);
    circle(BAND_L + progress * BAND_W, laneY, 3);
  }
}

function drawFooter() {
  if (window.__P5WAVES_STAGE_ONLY__) return;
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 242);
  textAlign(LEFT, BASELINE);
  noStroke();
  text('crossfade window', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text('8 × createSampler({ shift:true })', M, 870);

  textSize(19);
  fill(168);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', 900 - M, 854);
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
