const M    = 100;
const COLS = 50;
const ROWS = 50;
const CW   = 700 / COLS;
const CH   = 700 / ROWS;

let sx, sy;

function setup() {
  createCanvas(1080, 1080);
  noStroke();
  frameRate(30);

  sx = Waves.createSampler({
    wave:          'classic sine',
    shift:         true,
    shiftInterval: 4.5,
    shiftDuration: 2.2,
    range:         [0, 1],
    frequency:     0.45
  });

  sy = Waves.createSampler({
    wave:          'triangle',
    shift:         true,
    shiftInterval: 7.3,
    shiftDuration: 2.8,
    range:         [0, 1],
    frequency:     0.30,
    seed:          9
  });
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 1000;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const vx = sx.sample(c, t);
      const vy = sy.sample(r, t);
      const v  = vx * vy;
      const d  = map(v, 0, 1, 1.2, CW * 0.9);

      fill(18);
      circle(M + (c + 0.5) * CW, M + (r + 0.5) * CH, d);
    }
  }

  noStroke();
  textFont('Oswald');
  textSize(10);
  textAlign(CENTER, CENTER);
  fill(188);
  text('N  O  D  E  S', 450, 62);

  textFont('IBM Plex Mono');
  textSize(7.5);
  fill(185);
  textAlign(LEFT, CENTER);
  text('p5.waves  ·  2026-04-16', M, 862);
  textAlign(RIGHT, CENTER);
  text(sx.waveName + ' × ' + sy.waveName, M + 700, 862);
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
