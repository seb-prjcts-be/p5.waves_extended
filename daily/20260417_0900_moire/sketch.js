const M = 100;
const N = 38;
const STEP = (900 - 2 * M) / N;

let sRow, sCol;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  noStroke();

  sRow = Waves.createSampler({
    shift: true,
    shiftInterval: 7,
    shiftDuration: 2,
    range: [0, 1],
    frequency: 0.55,
    seed: 4
  });

  sCol = Waves.createSampler({
    shift: true,
    shiftInterval: 11,
    shiftDuration: 2.5,
    range: [0, 1],
    frequency: 0.55,
    seed: 79
  });
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 1000;

  fill(26);

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const px = M + (c + 0.5) * STEP;
      const py = M + (r + 0.5) * STEP;

      const vR = sRow.sample(r * 0.52, t);
      const vC = sCol.sample(c * 0.52 + r * 0.1, t);

      const v = abs(sin((vR - vC) * TWO_PI));
      circle(px, py, v * STEP * 0.84);
    }
  }

  fill(90, 90, 90, 242);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT);
  text('MOIRÉ', M, 854);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  textAlign(LEFT);
  text(sRow.waveName + ' \u00d7 ' + sCol.waveName, M, 870);

  textSize(19);
  textAlign(RIGHT);
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
