const M = 100;
const CX = 450;

let sampler;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;

  sampler = Waves.createSampler({
    shift: true,
    shiftInterval: 7,
    shiftDuration: 2.5,
    range: [14, 192],
    frequency: 0.006
  });
}

function __p5wSourceDraw() {
  background(18);

  const t = millis() / 400 * 0.055;

  // Collect half-widths along y-axis
  const steps = [];
  for (let y = M; y <= 900 - M; y += 2) {
    steps.push({ y, hw: sampler.sample(y, t) });
  }

  // Column silhouette — light form on dark field
  fill(244);
  noStroke();
  beginShape();
  for (const s of steps) vertex(CX - s.hw, s.y);
  for (let i = steps.length - 1; i >= 0; i--) vertex(CX + steps[i].hw, steps[i].y);
  endShape(CLOSE);

  // Ruled interior — very subtle horizontal marks inside the column
  stroke(18, 30);
  strokeWeight(0.5);
  for (let i = 0; i < steps.length; i += 9) {
    const { y, hw } = steps[i];
    if (hw > 6) line(CX - hw + 4, y, CX + hw - 4, y);
  }

  // Labels — adapted for dark canvas
  noStroke();
  textAlign(LEFT, BASELINE);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(182, 182, 178, 242);
  text('Column', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(118);
  text(sampler.waveName, M, 870);

  textAlign(RIGHT, BASELINE);
  textSize(19);
  fill(118);
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
