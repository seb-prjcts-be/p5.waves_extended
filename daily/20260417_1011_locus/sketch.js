const M = 100;
const CX = 450;
const CY = 450;
const N = 4000;
const RANGE = 295;
const CYCLES = 5;

let sX, sY;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  noStroke();

  sX = Waves.createSampler({
    shift: true,
    shiftInterval: 7,
    shiftDuration: 2.5,
    range: [-1, 1],
    frequency: 1,
    seed: 0
  });

  sY = Waves.createSampler({
    shift: true,
    shiftInterval: 11,
    shiftDuration: 3,
    range: [-1, 1],
    frequency: 1,
    seed: 31
  });
}

function __p5wSourceDraw() {
  background(255);
  const t = millis() / 1000;

  fill(26, 210);
  for (let i = 0; i < N; i++) {
    const p = (i / N) * Math.PI * 2 * CYCLES;
    const px = CX + sX.sample(p, t) * RANGE;
    const py = CY + sY.sample(p + Math.PI / 2, t) * RANGE;
    circle(px, py, 2.8);
  }

  noStroke();
  fill(90, 90, 90, 242);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT);
  text('LOCUS', M, 854);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  textAlign(LEFT);
  text(sX.waveName + ' \u00d7 ' + sY.waveName, M, 870);

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
