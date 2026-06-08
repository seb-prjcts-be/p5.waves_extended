let sampler;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;

  sampler = Waves.createSampler({
    shift:         true,
    amplitude:     45,
    frequency:     4,
    shiftInterval: 7,
    shiftDuration: 2.5
  });
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 1000;

  const N      = 20;
  const BASE_R = 300;
  const STEP   = 10;
  const SEGS   = 360;
  const ROT    = 0.008;

  noFill();

  for (let i = N - 1; i >= 0; i--) {
    const r        = BASE_R - (N - 1 - i) * STEP;
    const rotation = (N - 1 - i) * ROT;
    const al       = map(i, N - 1, 0, 40, 195);
    const wt       = map(r, 300, 110, 0.55, 1.2);

    stroke(18, al);
    strokeWeight(wt);

    beginShape();
    for (let j = 0; j <= SEGS; j++) {
      const theta  = map(j, 0, SEGS, 0, TWO_PI);
      const dr     = sampler.sample(theta, t * 0.3);
      const finalR = r + dr;
      vertex(
        450 + cos(theta + rotation - HALF_PI) * finalR,
        450 + sin(theta + rotation - HALF_PI) * finalR
      );
    }
    endShape(CLOSE);
  }

  noStroke();
  textAlign(LEFT, BASELINE);
  textFont('Oswald');
  textSize(22);
  fill(90, 90, 90, 242);
  text('Whorl', 100, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text(sampler.waveName, 100, 870);

  textAlign(RIGHT, BASELINE);
  textSize(19);
  text('p5.waves', 800, 854);
}


function draw() {
  push();
  scale(1080 / 900);
  try {
    __p5wSourceDraw();
  } finally {
    pop();
  }
}
