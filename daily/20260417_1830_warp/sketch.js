const COLS = 28;
const ROWS = 28;
const M = 100;
const CELL = 25;

let xWave, yWave;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  noFill();

  xWave = Waves.createSampler({
    shift: true,
    shiftInterval: 5,
    shiftDuration: 1.8,
    range: [-15, 15]
  });

  yWave = Waves.createSampler({
    shift: true,
    shiftInterval: 7,
    shiftDuration: 2.2,
    range: [-15, 15],
    seed: 11
  });
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 1000;

  stroke(215);
  strokeWeight(0.35);
  for (let r = 0; r <= ROWS; r++) {
    line(M, M + r * CELL, M + COLS * CELL, M + r * CELL);
  }
  for (let c = 0; c <= COLS; c++) {
    line(M + c * CELL, M, M + c * CELL, M + ROWS * CELL);
  }

  stroke(25);
  strokeWeight(0.8);

  for (let r = 0; r <= ROWS; r++) {
    beginShape();
    for (let c = 0; c <= COLS; c++) {
      const bx = M + c * CELL;
      const by = M + r * CELL;
      const dx = xWave.sample(c * 0.5 + r * 0.15, t);
      const dy = yWave.sample(r * 0.5 + c * 0.15, t * 0.85);
      vertex(bx + dx, by + dy);
    }
    endShape();
  }

  for (let c = 0; c <= COLS; c++) {
    beginShape();
    for (let r = 0; r <= ROWS; r++) {
      const bx = M + c * CELL;
      const by = M + r * CELL;
      const dx = xWave.sample(c * 0.5 + r * 0.15, t);
      const dy = yWave.sample(r * 0.5 + c * 0.15, t * 0.85);
      vertex(bx + dx, by + dy);
    }
    endShape();
  }

  drawLabel();
}

function drawLabel() {
  noStroke();
  const waveLine = xWave.waveName + ' \u00d7 ' + yWave.waveName;

  textAlign(LEFT, BASELINE);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 242);
  text('Warp', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text(waveLine, M, 870);

  textAlign(RIGHT, BASELINE);
  textSize(19);
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
