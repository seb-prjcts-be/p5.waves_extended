const CX    = 450;
const CY    = 450;
const RINGS = 21;
const R_MIN = 28;
const R_MAX = 328;
const STEPS = 300;

let samplers;

function setup() {
  createCanvas(1080, 1080);
  frameRate(30);

  samplers = [];
  for (let i = 0; i < RINGS; i++) {
    const p = i / (RINGS - 1);
    samplers.push(Waves.createSampler({
      shift:         true,
      shiftInterval: 2.5 + i * 0.5,
      shiftDuration: 0.8 + p * 2.0,
      amplitude:     2 + p * 44,
      frequency:     0.5 + p * 1.2,
      seed:          i * 17 + 3
    }));
  }
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 1000;

  noFill();

  for (let i = 0; i < RINGS; i++) {
    const p     = i / (RINGS - 1);
    const baseR = R_MIN + p * (R_MAX - R_MIN);
    const speed = 0.04 + p * 0.16;

    stroke(12, 18 + p * 215);
    strokeWeight(0.3 + p * 1.8);

    beginShape();
    for (let step = 0; step <= STEPS; step++) {
      const a    = (step / STEPS) * TWO_PI;
      const disp = samplers[i].sample(a * 55, t * speed);
      vertex(
        CX + cos(a) * (baseR + disp),
        CY + sin(a) * (baseR + disp)
      );
    }
    endShape(CLOSE);
  }

  noStroke();
  fill(12);
  circle(CX, CY, 6);

  fill(175);
  textSize(8.5);
  textFont('monospace');
  textAlign(CENTER, CENTER);
  text('F  I  E  L  D', CX, 68);

  textAlign(LEFT, CENTER);
  text('p5.waves · 2026-04-16', 100, 848);
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
