const M         = 100;
const FONT_SIZE = 30;
const COLS      = 20;
const ROWS      = 20;
const CW        = 700 / COLS;
const CH        = 700 / ROWS;

let sX, sY;

function dirMark(angle) {
  const a = ((angle % PI) + PI) % PI;
  if (a < PI / 8 || a > 7 * PI / 8) return '\u2013';
  if (a < 3 * PI / 8) return '/';
  if (a < 5 * PI / 8) return '|';
  return '\\';
}

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  textAlign(CENTER, CENTER);
  textFont('IBM Plex Mono');

  sX = Waves.createSampler({
    shift:         true,
    shiftInterval: 2.5,
    shiftDuration: 1.2,
    range:         [-1, 1],
    frequency:     0.18,
    seed:          3
  });

  sY = Waves.createSampler({
    shift:         true,
    shiftInterval: 3.8,
    shiftDuration: 1.5,
    range:         [-1, 1],
    frequency:     0.18,
    seed:          13
  });
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 1000;

  noStroke();
  textFont('IBM Plex Mono');
  textSize(FONT_SIZE);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cx = M + (c + 0.5) * CW;
      const cy = M + (r + 0.5) * CH;

      const dx  = sX.sample(c * 0.40 + r * 0.14, t);
      const dy  = sY.sample(r * 0.40 + c * 0.14, t * 0.78);
      const len = sqrt(dx * dx + dy * dy);

      const mark    = len < 0.22 ? '\u00B7' : dirMark(atan2(dy, dx));
      const grayVal = map(len, 0, 1.414, 195, 14);

      fill(grayVal);
      text(mark, cx, cy);
    }
  }

  drawingContext.font = '300 32px Oswald';
  drawingContext.fillStyle = '#555';
  drawingContext.textAlign = 'center';
  drawingContext.textBaseline = 'middle';
  drawingContext.fillText('Bearing', 450, 58);

  textFont('IBM Plex Mono');
  textStyle(NORMAL);
  textSize(11);
  fill(155);
  textAlign(LEFT, CENTER);
  text(sX.waveName, M, 840);
  textAlign(RIGHT, CENTER);
  text(sY.waveName, M + 700, 840);
  textAlign(CENTER, CENTER);
  fill(175);
  textSize(12);
  text('p5.waves  \u00B7  2026-04-16', 450, 858);
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
