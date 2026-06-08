// CELLS — three-state binary field from two independently shifting wave samplers
// p5.waves: two createSampler instances with shift, product-sign threshold

const COLS = 50;
const ROWS = 50;
const M = 100;
const CELL = 14;

let rowSampler, colSampler;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  noStroke();

  rowSampler = Waves.createSampler({
    shift: true,
    shiftInterval: 5,
    shiftDuration: 1.5,
    range: [-1, 1]
  });

  colSampler = Waves.createSampler({
    shift: true,
    shiftInterval: 7,
    shiftDuration: 2,
    range: [-1, 1],
    seed: 3
  });
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 1000;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const rv = rowSampler.sample(col * 0.35 + row * 0.08, t);
      const cv = colSampler.sample(row * 0.35 + col * 0.08, t * 0.78);
      const x = M + col * CELL;
      const y = M + row * CELL;

      if (rv > 0 && cv > 0) {
        fill(22);
        rect(x + 1, y + 1, CELL - 2, CELL - 2);
      } else if (rv < 0 && cv < 0) {
        fill(152);
        rect(x + 1, y + 1, CELL - 2, CELL - 2);
      }
    }
  }

  drawLabel();
}

function drawLabel() {
  const waveLine = rowSampler.waveName + ' \u00d7 ' + colSampler.waveName;

  textAlign(LEFT, BASELINE);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 242);
  text('Cells', M, 854);

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
