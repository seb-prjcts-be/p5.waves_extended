// Phase — 60 phase-staggered wave clones; each formula becomes a spatial portrait.
// p5.waves: phase sweep (0→2π), shift-switching sampler, wave morphing.

const M = 100;
const N = 60;

let sampler;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  sampler = Waves.createSampler({
    shift: true,
    shiftInterval: 5,
    shiftDuration: 2.5
  });
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 1000;
  sampler.sample(0, t);

  const wA = sampler.waveName;
  const wB = sampler.targetName || sampler.waveName;
  const mx = sampler.mix;

  const top = 125;
  const btm = 800;
  const step = (btm - top) / (N - 1);
  const amp = step * 2.3;

  noFill();
  strokeWeight(0.9);

  for (let i = 0; i < N; i++) {
    const cy = top + i * step;
    const phase = (i / N) * TWO_PI;
    const edge = abs((i / (N - 1)) - 0.5) * 2;
    stroke(20, 20, 20, lerp(62, 18, edge * edge));

    beginShape();
    for (let x = M; x <= 900 - M; x += 2) {
      const dy = Waves.wave(x, {
        wave: [wA, wB],
        mix: mx,
        phase: phase,
        amplitude: amp,
        t: t * 0.04
      });
      vertex(x, cy + dy);
    }
    endShape();
  }

  noStroke();
  textAlign(LEFT, BASELINE);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 242);
  text('Phase', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text(sampler.waveName, M, 870);

  textAlign(RIGHT, BASELINE);
  textSize(19);
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
