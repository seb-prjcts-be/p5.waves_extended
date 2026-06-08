/*
  FEELING         : hiss — an analog signal held between channels,
                    seething at the surface while something else drifts
                    quietly underneath.
  WAVE LOGIC      : duo, both pulse family for hard-edged texture:
                    • rows  : 'fuzzy pulse'   — sparse modulo spikes,
                              produces nervous, irregular grain
                    • cols  : 'up down pulse' — binary square breath,
                              produces strict on/off bands
                    A third sampler ('smooth solid sine') drives the
                    binarising threshold slowly — it decides, frame by
                    frame, where the hiss becomes ink.
  TIME LOGIC      : multi-speed, uncoupled divisors.
                    • carrier   t1 = ms /  240  (hyper-fast shimmer)
                    • threshold t2 = ms / 3200  (cinematic armature drift)
                    ms/1000 is banned; 240 does not divide 3200, so the
                    two clocks never re-lock.
  STRUCTURAL MOVE : 60 × 60 grid fills the 700×700 safe area. Each cell
                    samples one row wave and one column wave with cross-
                    contaminated inputs (row uses r + c·0.3, col uses
                    c + r·0.3), sums them, adds a stable per-cell grain,
                    and binarises against the drifting threshold — ink
                    (near-black) or paper. Result: a seething field that
                    flicks at cell-rate while whole zones of density slide
                    slowly across the frame. A thin vertical gauge at the
                    right margin plots the live threshold as a moving pip
                    on a reference rail — the silent armature.
*/

const W = 900, H = 900;
const M = 100;
const COLS = 60;
const ROWS = 60;
const CELL_W = (W - 2 * M) / COLS;
const CELL_H = (H - 2 * M) / ROWS;
const CELL_GAP = 1.0;

const TITLE = 'hiss';
const WAVE_LABEL = 'fuzzy pulse  ·  up down pulse';

let rowSampler, colSampler, thresholdSampler;
let grain;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(2);
  await document.fonts.ready;

  rowSampler = Waves.createSampler({
    wave: 'fuzzy pulse',
    frequency: 0.38,
    range: [-1, 1],
    seed: 3,
  });

  colSampler = Waves.createSampler({
    wave: 'up down pulse',
    frequency: 0.72,
    range: [-1, 1],
    seed: 11,
  });

  thresholdSampler = Waves.createSampler({
    wave: 'smooth solid sine',
    frequency: 0.55,
    range: [-0.32, 0.32],
    seed: 23,
  });

  const grainSampler = Waves.createSampler({
    wave: 'noise',
    frequency: 1.3,
    range: [-0.07, 0.07],
    seed: 71,
  });
  grain = new Float32Array(COLS * ROWS);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      grain[r * COLS + c] = grainSampler.sample(r * 1.7 + c * 0.9, 0);
    }
  }

  noStroke();
}

function __p5wSourceDraw() {
  background(245);

  const t1 = millis() / 240;    // hyper-fast carrier
  const t2 = millis() / 3200;   // slow threshold drift

  const threshold = thresholdSampler.sample(0, t2);

  fill(22);
  for (let r = 0; r < ROWS; r++) {
    const y = M + r * CELL_H;
    for (let c = 0; c < COLS; c++) {
      const vR = rowSampler.sample(r + c * 0.3, t1);
      const vC = colSampler.sample(c + r * 0.3, t1 + 3.14);
      const v = (vR + vC) * 0.5 + grain[r * COLS + c];
      if (v > threshold) {
        const x = M + c * CELL_W;
        rect(x, y, CELL_W - CELL_GAP, CELL_H - CELL_GAP);
      }
    }
  }

  drawArmature(threshold);
  drawLabels();
}

function drawArmature(threshold) {
  const gx = W - M + 18;
  const gy0 = M;
  const gy1 = H - M;
  const gh = gy1 - gy0;

  stroke(185);
  strokeWeight(0.6);
  noFill();
  line(gx, gy0, gx, gy1);

  strokeWeight(0.5);
  line(gx - 4, gy0 + gh * 0.5, gx + 4, gy0 + gh * 0.5);

  const top = gy0 + gh * 0.175;
  const bot = gy0 + gh * 0.825;
  line(gx - 2, top, gx + 2, top);
  line(gx - 2, bot, gx + 2, bot);

  const pipNorm = map(threshold, -0.32, 0.32, 0.175, 0.825);
  const pipY = gy0 + gh * pipNorm;
  noStroke();
  fill(26);
  circle(gx, pipY, 4);

  stroke(200);
  strokeWeight(0.5);
  for (let i = 1; i < 10; i++) {
    const y = M + i * (H - 2 * M) / 10;
    line(M - 7, y, M - 2, y);
  }
  noStroke();
}

function drawLabels() {
  drawingContext.textAlign = 'left';
  drawingContext.textBaseline = 'alphabetic';
  drawingContext.font = '300 22px Oswald';
  drawingContext.fillStyle = 'rgba(90,90,90,0.95)';
  drawingContext.fillText(TITLE, M, 854);

  drawingContext.font = '400 9.5px "IBM Plex Mono"';
  drawingContext.fillStyle = 'rgb(168,168,168)';
  drawingContext.fillText(WAVE_LABEL, M, 870);

  drawingContext.textAlign = 'right';
  drawingContext.font = '400 19px "IBM Plex Mono"';
  drawingContext.fillStyle = 'rgb(168,168,168)';
  drawingContext.fillText('p5.waves', W - M, 854);
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
