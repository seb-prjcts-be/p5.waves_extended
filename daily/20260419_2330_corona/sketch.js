/*
 * FEELING: pulse
 * WAVE LOGIC: morph between 'up down pulse' and 'fuzzy pulse' — both pulse-family,
 *   but different rhythms. One is steady binary beat, the other a broken ping-pulse.
 *   The morph shifts the pulse character over time. Each ring holds a unique seed,
 *   so wave selection differs per ring — the chorus feels layered, not copied.
 * TIME LOGIC: millis()/400 for the wave driver (fast: pulse, energetic) and
 *   millis()/1800 for the morph mix drift — the pulse changes character slowly,
 *   while the rings themselves breathe visibly.
 * STRUCTURAL MOVE: radial chorus — 12 concentric rings, angle → radius offset.
 *   Small amplitudes keep the silhouette near-still while the surface shimmers;
 *   a stopped corona rather than a fireworks burst.
 */

const W = 900, H = 900, MARGIN = 100;
const RING_COUNT = 12;

let samplers = [];

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(1);
  await document.fonts.ready;

  for (let i = 0; i < RING_COUNT; i++) {
    samplers.push(Waves.createSampler({
      wave: ['up down pulse', 'fuzzy pulse'],
      range: [-1, 1],
      frequency: 0.65 + i * 0.11,
      phase: i * 0.43,
      seed: i * 7 + 3,
      unpredictability: 0.12,
    }));
  }
}

function __p5wSourceDraw() {
  background(245);

  const cx = W / 2;
  const cy = H / 2 - 10;

  const tWave = millis() / 400;
  const tMix = millis() / 1800;
  const morphMix = (Math.sin(tMix * 0.7) + 1) / 2;

  noFill();

  for (let i = 0; i < RING_COUNT; i++) {
    const baseR = 60 + i * 25;
    const amp = 3 + i * 1.2;

    const shade = 30 + i * 6;
    const bell = i < 6 ? 80 + i * 18 : 80 + (11 - i) * 18;
    stroke(shade, bell);
    strokeWeight(i === 3 || i === 7 ? 1.3 : 0.85);

    beginShape();
    const step = 0.013;
    for (let a = 0; a <= Math.PI * 2 + step; a += step) {
      const v = samplers[i].sample(a * 2.2, tWave + i * 0.15, morphMix);
      const rad = baseR + v * amp;
      vertex(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    }
    endShape(CLOSE);
  }

  const coreV = samplers[0].sample(0, tWave, morphMix);
  noStroke();
  fill(40, 150);
  circle(cx, cy, 4 + coreV * 1.5);

  drawLabels(morphMix);
}

function drawLabels(morphMix) {
  noStroke();
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT, BASELINE);
  fill(90, 90, 90, 242);
  text('corona', MARGIN, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  const leaning = morphMix < 0.5 ? 'up down pulse' : 'fuzzy pulse';
  text(leaning + '  ·  mix ' + morphMix.toFixed(2), MARGIN, 870);

  textSize(19);
  textAlign(RIGHT, BASELINE);
  fill(168);
  text('p5.waves', W - MARGIN, 854);
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
