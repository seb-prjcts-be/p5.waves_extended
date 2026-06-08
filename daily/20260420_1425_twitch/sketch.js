/*
 * twitch
 *
 * FEELING — twitch: a single nervous line that can't hold a shape.
 *   Hyper-fast vibration at the pixel level, slow identity crisis at the
 *   structural level.
 *
 * WAVE LOGIC — one sampler with shift:true, cycling the full catalog at a
 *   long interval. The line reshapes itself in place — never settles,
 *   never repeats — which is exactly the rupture we want. An echo sampler
 *   at the same config but sampled 0.9s behind prints what the line just
 *   was, so every frame carries the ghost of the previous formula.
 *
 * TIME LOGIC — hyper-fast wave clock millis()/120 (nervous pixel noise);
 *   shiftInterval 5.8s hold, shiftDuration 1.6s morph — the character
 *   breathes once every ~7s. Echo lag 0.9s (short enough to feel present,
 *   long enough to disagree with the live line during a shift).
 *
 * STRUCTURAL MOVE — one single horizontal line dead-centre across the
 *   canvas — no stacking, no composition, no grid. Maximum attention to
 *   one gesture. Sample dots along the line mark the discrete sampling
 *   rhythm; a pale reference axis underneath holds the stillness the
 *   line is twitching around; top-gutter ticks count the columns.
 *   Tiny data overlay (top-right) reads out the live wave identity
 *   and the morph progress bar, making the shift itself legible.
 */

const M = 100;
const CANVAS = 900;

let waveSampler;
let samplePoints = [];

async function setup() {
  const canvas = createCanvas(1080, 1080);
  canvas.parent('stage');
  pixelDensity(2);
  await document.fonts.ready;

  waveSampler = Waves.createSampler({
    shift: true,
    shiftInterval: 5.8,
    shiftDuration: 1.6,
    amplitude: 210,
    frequency: 1.15,
    seed: 11,
  });

  for (let x = M; x <= CANVAS - M; x += 14) {
    samplePoints.push(x);
  }
}

function __p5wSourceDraw() {
  background(245);

  const t = millis() / 120;
  const tEcho = t - 0.9 * (1000 / 120);
  const cx = CANVAS / 2;
  const cy = CANVAS / 2;

  // --- pale centre axis ---------------------------------------------
  stroke(205);
  strokeWeight(0.4);
  line(M, cy, CANVAS - M, cy);

  // --- top-gutter sample-column ticks -------------------------------
  stroke(210);
  strokeWeight(0.4);
  for (const x of samplePoints) {
    line(x, M - 8, x, M - 3);
  }

  // --- echo ghost (0.9s behind) -------------------------------------
  noFill();
  stroke(30, 30, 30, 34);
  strokeWeight(0.6);
  beginShape();
  for (let x = M; x <= CANVAS - M; x += 2) {
    const input = (x - cx) * 0.019;
    const yy = waveSampler.sample(input, tEcho);
    vertex(x, cy + yy);
  }
  endShape();

  // --- main twitch line ---------------------------------------------
  stroke(18);
  strokeWeight(1.1);
  beginShape();
  for (let x = M; x <= CANVAS - M; x += 2) {
    const input = (x - cx) * 0.019;
    const yy = waveSampler.sample(input, t);
    vertex(x, cy + yy);
  }
  endShape();

  // --- sample dots on the main line --------------------------------
  noStroke();
  fill(18);
  for (const x of samplePoints) {
    const input = (x - cx) * 0.019;
    const yy = waveSampler.sample(input, t);
    circle(x, cy + yy, 2.6);
  }

  // --- tiny vertical drops from each dot to the axis ---------------
  stroke(18, 18, 18, 45);
  strokeWeight(0.4);
  for (const x of samplePoints) {
    const input = (x - cx) * 0.019;
    const yy = waveSampler.sample(input, t);
    line(x, cy + yy, x, cy);
  }

  drawOverlay();
  drawLabels();
}

function drawOverlay() {
  // top-right readout: morph progress bar
  const boxW = 180;
  const boxX = CANVAS - M - boxW;
  const boxY = M - 26;

  noStroke();
  fill(168);
  textFont('IBM Plex Mono');
  textSize(8.5);
  textAlign(LEFT, BASELINE);
  text('WAVE STATE', boxX, boxY);

  const barY = boxY + 6;
  stroke(205);
  strokeWeight(0.5);
  noFill();
  rect(boxX, barY, boxW, 4);

  noStroke();
  const mix = waveSampler.mix;
  const progress = waveSampler.shifting ? mix : 0;
  fill(60);
  rect(boxX, barY, boxW * progress, 4);

  fill(168);
  textSize(8.5);
  textAlign(LEFT, BASELINE);
  const status = waveSampler.shifting
    ? `${waveSampler.waveName}  →  ${waveSampler.targetName}`
    : `${waveSampler.waveName}`;
  text(status.toLowerCase(), boxX, barY + 16);
}

function drawLabels() {
  // bottom-left: title
  noStroke();
  fill(90, 90, 90, 242);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('twitch', M, 854);

  // bottom-left secondary: current wave name (tiny)
  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  textAlign(LEFT, BASELINE);
  text(waveSampler.waveName.toLowerCase(), M, 870);

  // bottom-right: p5.waves
  fill(168);
  textSize(19);
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
