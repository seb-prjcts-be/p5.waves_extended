// not_an_ocean — ninety parallel wavelines morphing between
// wave #1 "sine" and wave #14 "bumpy sine". Two samplers:
//   timer  — a shift:true clock. Controls only timing (phase,
//            frequency) and frame (range). Does NOT drive mix.
//   offset — static per-row scalar reused for both vertical and
//            horizontal row displacement.
// mix is spatial: left edge = pure sine, right edge = pure wave #14.
// Timer-driven parameters roll left to right: each x column reads
// the timer at t - lag(x). Setting-change amplitude scaled to 0.75.

const M = 100;
const ROWS = 90;
const ROLL_SEC = 1.5;

let fontsReady = false;
let timer;
let offsetSampler;
let rowSpan;
const yTop = M + 120;
const yBottom = 1080 - M - 120;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(1);
  await document.fonts.ready;
  fontsReady = true;
  rowSpan = (yBottom - yTop) / (ROWS - 1);

  timer = Waves.createSampler({
    shift: true,
    group: 'smooth',
    shiftInterval: 1.40,
    shiftDuration: 0.72,
    range: [-0.5, 1.5],
    frequency: 1.8,
  });

  offsetSampler = Waves.createSampler({
    wave: 'meta sine',
    range: [-rowSpan * 1.1, rowSpan * 1.1],
    frequency: 0.4,
    seed: 42,
  });
}

function draw() {
  background(245);
  const t = millis() / 1000;
  const xStep = 2;
  const xCount = Math.floor((1080 - 2 * M) / xStep) + 1;
  const xSpan = 1080 - 2 * M;

  // Precompute per-x timer-driven parameters (rolling left to right).
  // Timer controls timing + frame only; mix is spatial.
  // Timer output is fed through Perlin noise(tim, t) for extra smoothing;
  // noise [0,1] is remapped to the timer's nominal range [-0.5, 1.5]
  // so the downstream map() calibration stays intact.
  const xParams = new Array(xCount);
  let leftRaw = 0;
  for (let i = 0; i < xCount; i++) {
    const x = M + i * xStep;
    const tLag = ((x - M) / xSpan) * ROLL_SEC;
    const tSeq = (t - tLag) * (1.6 / 4);
    const tim = timer.sample(0, tSeq);
    // 3D noise: tim axis = timer state, tSeq axis = slow time drift,
    // x axis = independent spatial variation. The lag still propagates
    // features right, but columns no longer march in lockstep.
    const n = noise(tim * 1.2 + 5.0, tSeq * 0.3, x * 0.004);
    const raw = map(n, 0, 1, -0.5, 1.5);
    if (i === 0) leftRaw = raw;
    xParams[i] = {
      x,
      m: (x - M) / xSpan,
      rangeAmp: map(raw, -0.7, 1.7, 12.5, 87.5),
      freq: map(raw, -0.7, 1.7, 0.018, 0.054),
      phase: raw * 2.25,
    };
  }

  stroke(0);
  strokeWeight(1.0);
  noFill();

  for (let r = 0; r < ROWS; r++) {
    const off = offsetSampler.sample(r, 0);
    const y0 = yTop + r * rowSpan + off;
    beginShape();
    for (let i = 0; i < xCount; i++) {
      const p = xParams[i];
      const y = y0 + Waves.wave(p.x + r * 18, {
        wave: [1, 14],
        mix: p.m,
        range: [-p.rangeAmp, p.rangeAmp],
        frequency: p.freq,
        phase: p.phase,
      });
      vertex(p.x + off, y);
    }
    endShape();
  }

  if (fontsReady) drawLabels(leftRaw);
}

function drawLabels(raw) {
  const rangeAmp = map(raw, -0.7, 1.7, 12.5, 87.5);
  const freq = map(raw, -0.7, 1.7, 0.018, 0.054);
  const phase = raw * 2.25;
  push();
  resetMatrix();
  blendMode(BLEND);
  noStroke();
  textAlign(LEFT, BASELINE);
  fill(0);
  textFont('Oswald');
  textSize(26);
  textStyle(NORMAL);
  text('not_an_ocean', M, 1020);
  textFont('IBM Plex Mono');
  textSize(11);
  const timerName = (timer && timer.waveName) ? timer.waveName : '\u2026';
  text(
    'timer: ' + timerName + ' [smooth] \u2192 noise(tim,t)' +
    '   roll=' + ROLL_SEC + 's L\u2192R' +
    '   mix=spatial [1\u219214]' +
    '   range=\u00b1' + nf(rangeAmp, 1, 1) +
    '   freq=' + nf(freq, 1, 3) +
    '   phase=' + nf(phase, 1, 2) +
    '   scale=0.75',
    M, 1040
  );
  textAlign(RIGHT, BASELINE);
  textSize(22);
  text('p5.waves', 1080 - M, 1020);
  pop();
}
