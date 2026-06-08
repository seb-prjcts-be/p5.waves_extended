/*
 * FEELING: fold — the slow moment inside a geological compression.
 * WAVE LOGIC: morph(['stepped sine', 'smooth solid sine']) — quantized
 *   seismic layering relaxing into continuous breath, seeded (7) so the
 *   sampler settles into a specific personality rather than drifting.
 * TIME LOGIC: drift t = millis()/2800 (slow cinematic cadence); morph
 *   mix from sin(millis()/3600); horizon sway from sin(millis()/4200).
 *   Three uncorrelated slow clocks = structural motion without velocity.
 * STRUCTURAL MOVE: horizontal contour lines densify around a drifting
 *   horizon (compression) and splay loose toward the top/bottom margins
 *   (release); line amplitude inverts this — tight-and-small inside the
 *   fold, wide-and-open in the outflow.
 */

const M = 100;
let sampler;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(2);
  await document.fonts.ready;
  noFill();

  sampler = Waves.createSampler({
    wave: ['stepped sine', 'smooth solid sine'],
    range: [-100, 100],
    frequency: 1,
    seed: 7,
    unpredictability: 0.12
  });
}

function __p5wSourceDraw() {
  background(245);

  const ms = millis();
  const t = ms / 2800;
  const mixAmt = (Math.sin(ms / 3600) + 1) / 2;
  const horizon = 450 + 72 * Math.sin(ms / 4200 * 0.6);

  const N_LINES = 118;
  const SPAN = 420;

  for (let i = 0; i < N_LINES; i++) {
    const u = i / (N_LINES - 1);
    const side = u < 0.5 ? -1 : 1;
    const d = Math.abs(u - 0.5) * 2;
    const eased = Math.pow(d, 1.75);
    const lineY = horizon + side * eased * SPAN;

    if (lineY < M * 0.55 || lineY > 900 - M * 0.55) continue;

    const lineAmp = 3 + d * d * 34;
    const lineA = 100 + (1 - Math.pow(d, 0.7)) * 95;
    const lineShift = i * 0.11;
    const tLine = t + i * 0.028 * side;

    stroke(55, 55, 60, lineA);
    strokeWeight(0.9);

    beginShape();
    for (let x = M; x <= 900 - M; x += 2) {
      const wy = sampler.sample(x * 0.012 + lineShift, tLine, mixAmt);
      vertex(x, lineY + wy * 0.01 * lineAmp);
    }
    endShape();
  }

  // faint horizon reference
  stroke(90, 90, 95, 32);
  strokeWeight(0.6);
  line(M, horizon, 900 - M, horizon);

  drawLabels();
}

function drawLabels() {
  noStroke();

  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 240);
  textAlign(LEFT, BASELINE);
  text('strata', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  textAlign(LEFT, BASELINE);
  text('stepped sine  >  smooth solid sine', M, 870);

  textSize(19);
  textAlign(RIGHT, BASELINE);
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
