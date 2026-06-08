// Grain — wave probability field as ink stipple
// p5.waves: shift-switching sampler, mix morph, diagonal 2D sampling, slow drift

const M = 100;
const STEP = 3;

let sampler;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  frameRate(30);

  sampler = Waves.createSampler({
    shift: true,
    shiftInterval: 7,
    shiftDuration: 2
  });
}

function __p5wSourceDraw() {
  background(245);

  const t = millis() / 1000;
  sampler.sample(0, t);

  const wA = sampler.waveName;
  const wB = sampler.targetName || sampler.waveName;
  const mx = sampler.mix;
  const drift = t * 0.007;

  noStroke();
  fill(22);

  for (let y = M; y < 900 - M; y += STEP) {
    for (let x = M; x < 900 - M; x += STEP) {
      const v = Waves.wave(x * 0.003 + y * 0.002 + drift, {
        wave: [wA, wB],
        mix: mx,
        range: [-1, 1]
      });

      const prob = (v + 1) * 0.5;
      const hash = ((x * 1637 + y * 2053) % 997) / 997;

      if (hash < prob) {
        rect(x - 1, y - 1, 2, 2);
      }
    }
  }

  drawLabels();
}

function drawLabels() {
  noStroke();
  textAlign(LEFT, BASELINE);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 242);
  text('Grain', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text(sampler.waveName || '', M, 870);

  textAlign(RIGHT, BASELINE);
  textSize(19);
  fill(168);
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
