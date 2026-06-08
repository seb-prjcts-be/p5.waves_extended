const M = 100;
const N = 7;

const PALETTE = [
  [230, 220, 200],
  [205, 185, 155],
  [175, 145, 95],
  [140, 108, 55],
  [102,  74, 30],
  [ 65,  46, 14],
  [ 34,  22,  6]
];

let sampler;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  noStroke();

  sampler = Waves.createSampler({
    shift:         true,
    shiftInterval: 8,
    shiftDuration: 3.5,
    amplitude:     30,
    frequency:     0.014,
    seed:          5
  });
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 1000;

  for (let i = 0; i < N; i++) {
    const c = PALETTE[i];
    fill(c[0], c[1], c[2]);

    beginShape();
    for (let x = M; x <= 900 - M; x += 3) {
      vertex(x, boundaryY(i, x, t));
    }
    for (let x = 900 - M; x >= M; x -= 3) {
      vertex(x, boundaryY(i + 1, x, t));
    }
    endShape(CLOSE);
  }

  noStroke();
  fill(110);
  textFont('Oswald');
  textSize(11);
  textAlign(LEFT);
  text('SEDIMENT', M, 72);

  fill(165);
  textFont('IBM Plex Mono');
  textSize(9);
  textAlign(RIGHT);
  text(sampler.waveName, 900 - M, 840);
}

function boundaryY(idx, x, t) {
  const base = map(idx, 0, N, M, 900 - M);
  return base + sampler.sample(x * 0.014 + idx * 820, t);
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
