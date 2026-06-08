const M    = 100;
const COLS = 40;
const ROWS = 40;
const CW   = 700 / COLS;
const CH   = 700 / ROWS;
const HLEN = CW * 0.43;

let sAngle, sLen;

function setup() {
  createCanvas(1080, 1080);
  frameRate(30);
  strokeCap(ROUND);

  sAngle = Waves.createSampler({
    shift:         true,
    shiftInterval: 5,
    shiftDuration: 2.0,
    range:         [0, PI],
    frequency:     1.6
  });

  sLen = Waves.createSampler({
    shift:         true,
    shiftInterval: 8,
    shiftDuration: 2.5,
    range:         [1.5, HLEN],
    frequency:     2.2,
    seed:          5
  });
}

function __p5wSourceDraw() {
  background(245);
  let t = millis() / 1000;
  let N = COLS + ROWS;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let cx = M + (c + 0.5) * CW;
      let cy = M + (r + 0.5) * CH;

      let inA = (c + r) / N * TWO_PI * 2.5;
      let inB = (c - r + ROWS - 1) / N * TWO_PI * 2.5;

      let angle = sAngle.sample(inA, t);
      let len   = sLen.sample(inB, t * 0.6);

      let sw    = map(len, 1.5, HLEN, 0.6, 2.4);
      let alpha = map(len, 1.5, HLEN, 55, 215);

      stroke(18, alpha);
      strokeWeight(sw);

      let dx = cos(angle) * len;
      let dy = sin(angle) * len;
      line(cx - dx, cy - dy, cx + dx, cy + dy);
    }
  }
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
