/*
 * stratum
 *
 * FEELING: pressure
 * WAVE LOGIC: chorus of 10 underused waves layered as horizontal strata
 *   (mountain peaks, batman, bald patch, fuzzy pulse, stepped sine,
 *   round linked sine, smooth solid sine, wobble sine, up down pulse, meta sine).
 *   Five morph rows blend between two waves with an animated mix —
 *   the geology slowly negotiates which formula it wants to be.
 * TIME LOGIC: 67 strata drift at t/2400 (slow cinematic).
 *   Three fault-line rows vibrate at t/180 (hyper-fast) — visual stress
 *   against the calm, like seismic noise on a quiet survey trace.
 * STRUCTURAL MOVE: amplitude swells toward the canvas center forming a
 *   pressure ridge — middle bulges, edges stay flat. Tiny depth marks on the
 *   left margin tie the form to a geological survey, anchoring drift to depth.
 */

const M = 100;
const ROWS = 70;
const FAULT_ROWS = [18, 35, 52];
const MORPH_ROWS = [9, 26, 43, 58, 65];

const WAVE_POOL = [
  'mountain peaks', 'batman', 'bald patch', 'fuzzy pulse',
  'stepped sine', 'round linked sine', 'smooth solid sine', 'wobble sine',
  'up down pulse', 'meta sine'
];

const MORPH_PAIRS = [
  ['mountain peaks', 'batman'],
  ['bald patch', 'fuzzy pulse'],
  ['stepped sine', 'wobble sine'],
  ['smooth solid sine', 'up down pulse'],
  ['round linked sine', 'meta sine']
];

const strata = [];

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;

  const center = (ROWS - 1) / 2;

  for (let r = 0; r < ROWS; r++) {
    const norm = Math.abs(r - center) / center;
    const swell = Math.pow(1 - norm, 1.6);
    const isFault = FAULT_ROWS.includes(r);
    const morphIdx = MORPH_ROWS.indexOf(r);
    const isMorph = morphIdx >= 0;

    const baseAmp = isFault ? 14 + swell * 26 : 2 + swell * 28;

    const waveCfg = isMorph
      ? MORPH_PAIRS[morphIdx]
      : WAVE_POOL[(r * 3 + 1) % WAVE_POOL.length];

    const sampler = Waves.createSampler({
      wave: waveCfg,
      amplitude: baseAmp,
      frequency: 0.55 + ((r * 0.19) % 1.4),
      phase: r * 0.41,
      seed: r * 7 + 3
    });

    strata.push({
      sampler, isFault, isMorph, swell,
      timeMult: isFault ? 1 / 180 : 1 / 2400,
      morphPeriod: 0.0003 + (r % 5) * 0.00007,
      stepX: isFault ? 1 : 2,
      strokeShade: isFault ? 35 : 20,
      alpha: isFault ? 215 : 70 + swell * 130,
      weight: isFault ? 1.25 : 0.55 + swell * 0.7
    });
  }

  noFill();
}

function draw() {
  background(245);
  const tNow = millis();

  drawDepthMarks();

  for (let r = 0; r < ROWS; r++) {
    const s = strata[r];
    const yBase = M + (r / (ROWS - 1)) * (height - 2 * M);
    const tt = tNow * s.timeMult;
    const blend = s.isMorph
      ? (Math.sin(tNow * s.morphPeriod + r * 0.5) + 1) * 0.5
      : 0;

    stroke(s.strokeShade, s.alpha);
    strokeWeight(s.weight);

    beginShape();
    for (let xPos = M; xPos <= width - M; xPos += s.stepX) {
      const v = s.sampler.sample(xPos * 0.012, tt, blend);
      vertex(xPos, yBase + v);
    }
    endShape();
  }

  drawLabels();
}

function drawDepthMarks() {
  push();
  stroke(168, 90);
  strokeWeight(0.5);
  for (let r = 0; r < ROWS; r += 5) {
    const y = M + (r / (ROWS - 1)) * (height - 2 * M);
    line(M - 6, y, M - 2, y);
  }
  noStroke();
  fill(168);
  textFont('IBM Plex Mono');
  textSize(8);
  textAlign(RIGHT, CENTER);
  for (let r = 0; r < ROWS; r += 10) {
    const y = M + (r / (ROWS - 1)) * (height - 2 * M);
    text(`${r * 4}m`, M - 12, y);
  }
  pop();
}

function drawLabels() {
  push();
  noStroke();

  textFont('Oswald');
  textSize(22);
  fill('rgba(90,90,90,0.95)');
  textAlign(LEFT, BASELINE);
  text('stratum', M, 1020);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text('chorus · morph', M, 1040);

  textFont('IBM Plex Mono');
  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', width - M, 1020);

  pop();
}
