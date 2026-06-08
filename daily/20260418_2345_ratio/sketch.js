const M    = 100;
const W    = 900;
const H    = 900;
const COLS = 6;
const ROWS = 6;
const cellW = (W - 2 * M) / COLS;
const cellH = (H - 2 * M) / ROWS;
const oAmp  = 38;

let sampler;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  sampler = Waves.createSampler({
    shift:         true,
    range:         [-oAmp, oAmp],
    shiftInterval: 8,
    shiftDuration: 2.5,
    seed:          0
  });
}

function __p5wSourceDraw() {
  background(245);
  const t  = millis() / 1000;
  const tS = t * 0.018;

  // Cell grid
  stroke(218, 214, 208);
  strokeWeight(0.5);
  for (let c = 0; c <= COLS; c++) {
    line(M + c * cellW, M, M + c * cellW, H - M);
  }
  for (let r = 0; r <= ROWS; r++) {
    line(M, M + r * cellH, W - M, M + r * cellH);
  }

  // Axis frequency labels
  noStroke();
  textFont('IBM Plex Mono');
  textSize(9);
  fill(172);
  textAlign(CENTER, CENTER);
  for (let c = 0; c < COLS; c++) {
    text(c + 1, M + c * cellW + cellW * 0.5, M - 20);
  }
  textAlign(RIGHT, CENTER);
  for (let r = 0; r < ROWS; r++) {
    text(r + 1, M - 12, M + r * cellH + cellH * 0.5);
  }

  // Cells
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const ax = M + col * cellW + cellW * 0.5;
      const ay = M + row * cellH + cellH * 0.5;
      const kx = col + 1;
      const ky = row + 1;

      // Ratio label
      noStroke();
      textFont('IBM Plex Mono');
      textSize(7.5);
      fill(208);
      textAlign(LEFT, TOP);
      text(kx + ':' + ky, M + col * cellW + 5, M + row * cellH + 4);

      // Cell center mark
      stroke(188);
      strokeWeight(1);
      point(ax, ay);

      // Orbit curve
      noFill();
      stroke(28, 28, 28, 68);
      strokeWeight(0.8);
      beginShape();
      for (let i = 0; i <= 200; i++) {
        const theta = (i / 200) * TWO_PI;
        const px = ax + sampler.sample(theta * kx / TWO_PI, tS);
        const py = ay + sampler.sample(theta * ky / TWO_PI + 0.25, tS);
        vertex(px, py);
      }
      endShape(CLOSE);

      // Moving dot
      const phase = (col + row * COLS) / (COLS * ROWS) * TWO_PI;
      const thetaDot = (t * 0.38 + phase) % TWO_PI;
      const dx = ax + sampler.sample(thetaDot * kx / TWO_PI, tS);
      const dy = ay + sampler.sample(thetaDot * ky / TWO_PI + 0.25, tS);
      fill(20);
      noStroke();
      circle(dx, dy, 4);
    }
  }

  // Bottom labels
  noStroke();
  textAlign(LEFT, BASELINE);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 242);
  text('Ratio', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text(sampler.waveName, M, 870);

  textAlign(RIGHT, BASELINE);
  textSize(19);
  text('p5.waves', W - M, 854);

  textAlign(LEFT, BASELINE);
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
