const MARGIN = 100;
const COLS   = 70;
const ROWS   = 70;
const CELL   = 10;
const TH     = 6;
const OFF    = 2;

const C_BG   = [242, 238, 226];
const C_WARP = [28,  32,  68];
const C_WEFT = [190, 110, 48];

let sR, sC;
let cV, rV;

function setup() {
  createCanvas(1080, 1080);
  noStroke();
  frameRate(30);

  cV = new Float32Array(COLS);
  rV = new Float32Array(ROWS);

  sR = Waves.createSampler({
    shift:         true,
    shiftInterval: 5,
    shiftDuration: 2,
    seed:          17,
    range:         [-1, 1]
  });

  sC = Waves.createSampler({
    shift:         true,
    shiftInterval: 7,
    shiftDuration: 2.5,
    seed:          83,
    range:         [-1, 1]
  });
}

function __p5wSourceDraw() {
  const t  = millis() / 1000;
  const x0 = MARGIN;
  const y0 = MARGIN;

  background(C_BG[0], C_BG[1], C_BG[2]);

  for (let c = 0; c < COLS; c++) cV[c] = sR.sample(c * 0.15, t);
  for (let r = 0; r < ROWS; r++) rV[r] = sC.sample(r * 0.15, t);

  fill(C_WARP[0], C_WARP[1], C_WARP[2]);
  for (let c = 0; c < COLS; c++) {
    rect(x0 + c * CELL + OFF, y0, TH, ROWS * CELL);
  }

  fill(C_WEFT[0], C_WEFT[1], C_WEFT[2]);
  for (let r = 0; r < ROWS; r++) {
    const wy = y0 + r * CELL + OFF;
    for (let c = 0; c < COLS; c++) {
      if (cV[c] + rV[r] < 0) {
        rect(x0 + c * CELL, wy, CELL, TH);
      }
    }
  }

  textFont('monospace');

  fill(C_WARP[0], C_WARP[1], C_WARP[2]);
  textAlign(LEFT, BOTTOM);
  textSize(22);
  text('WEFT', x0, y0 - 18);

  textAlign(RIGHT, BOTTOM);
  textSize(8);
  fill(C_WARP[0], C_WARP[1], C_WARP[2], 80);
  text('p5.waves · 2026-04-16', x0 + COLS * CELL, y0 - 18);

  textAlign(LEFT, TOP);
  textSize(8);
  fill(C_WARP[0], C_WARP[1], C_WARP[2], 110);

  let warpLabel = 'warp  ' + sR.waveName;
  if (sR.shifting) warpLabel += '  →  ' + sR.targetName + '  (' + nf(sR.mix, 1, 2) + ')';
  text(warpLabel, x0, y0 + ROWS * CELL + 10);

  let weftLabel = 'weft  ' + sC.waveName;
  if (sC.shifting) weftLabel += '  →  ' + sC.targetName + '  (' + nf(sC.mix, 1, 2) + ')';
  text(weftLabel, x0, y0 + ROWS * CELL + 21);
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
