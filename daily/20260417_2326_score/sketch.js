let melodySampler;
const M = 100;
const NSYS = 6;
const N_STAVE = 5;
const STAVE_STEP = 10;
const XFREQS = [0.003, 0.0038, 0.0046, 0.0055, 0.0066, 0.008];
const systemCenters = [];

async function setup() {
  createCanvas(1080, 1080);

  const staveSpan = STAVE_STEP * (N_STAVE - 1);
  const gap = (900 - 2 * M - NSYS * staveSpan) / (NSYS - 1);
  for (let s = 0; s < NSYS; s++) {
    systemCenters.push(M + staveSpan / 2 + s * (staveSpan + gap));
  }

  melodySampler = Waves.createSampler({
    shift: true,
    shiftInterval: 5,
    shiftDuration: 2,
    range: [-22, 22]
  });

  await document.fonts.ready;
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 1000;

  for (let sys = 0; sys < NSYS; sys++) {
    const sc = systemCenters[sys];

    strokeWeight(0.45);
    stroke(172, 120);
    for (let k = -(N_STAVE - 1) / 2; k <= (N_STAVE - 1) / 2; k++) {
      line(M, sc + k * STAVE_STEP, 900 - M, sc + k * STAVE_STEP);
    }

    strokeWeight(1.15);
    stroke(22, 210);
    noFill();
    beginShape();
    for (let x = M; x <= 900 - M; x += 2) {
      const dy = melodySampler.sample(x * XFREQS[sys] + sys * 0.8, t);
      vertex(x, sc + dy);
    }
    endShape();
  }

  noStroke();
  fill(90, 90, 90, 242);
  textFont('Oswald');
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('SCORE', M, 854);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  text(melodySampler.waveName, M, 870);

  textAlign(RIGHT, BASELINE);
  textSize(19);
  text('p5.waves', 900 - M, 854);

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
