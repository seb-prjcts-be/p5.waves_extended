let sampler;
const M = 100;
const CX = 450, CY = 450;

const FREQS   = [2,    4,    6,    8,    10];
const R_BASES = [75,   128,  178,  228,  275];
const R_AMPS  = [48,   58,   65,   70,   72];
const GRAYS   = [12,   40,   72,   100,  128];
const WEIGHTS = [1.45, 1.1,  0.85, 0.65, 0.5];
const N_RAYS  = 720;

async function setup() {
  createCanvas(1080, 1080);
  sampler = Waves.createSampler({
    shift: true,
    shiftInterval: 5,
    shiftDuration: 2,
    range: [-1, 1]
  });
  await document.fonts.ready;
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 500;

  noFill();
  stroke(205);
  strokeWeight(0.35);
  for (let fi = 0; fi < FREQS.length; fi++) {
    circle(CX, CY, R_BASES[fi] * 2);
  }

  for (let fi = 0; fi < FREQS.length; fi++) {
    stroke(GRAYS[fi]);
    strokeWeight(WEIGHTS[fi]);
    noFill();
    beginShape();
    for (let i = 0; i <= N_RAYS; i++) {
      const theta = (i / N_RAYS) * TWO_PI;
      const v = sampler.sample((theta / TWO_PI) * FREQS[fi], t);
      const r = R_BASES[fi] + v * R_AMPS[fi];
      vertex(CX + cos(theta) * r, CY + sin(theta) * r);
    }
    endShape(CLOSE);
  }

  noStroke();
  fill(30);
  circle(CX, CY, 4);

  fill(90, 90, 90, 242);
  textFont('Oswald');
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('HARMONIC', M, 854);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  text(sampler.waveName, M, 870);

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
