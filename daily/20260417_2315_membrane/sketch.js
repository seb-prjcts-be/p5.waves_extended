let sampler;
const N = 28;
const M = 28;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;

  sampler = Waves.createSampler({
    shift: true,
    amplitude: 72,
    shiftInterval: 5,
    shiftDuration: 2.5
  });
}

function __p5wSourceDraw() {
  background(245);

  const t = millis() / 1000;
  const halfN = (N - 1) * 0.5;
  const halfM = (M - 1) * 0.5;

  const cx = 450;
  const cy = 418;
  const cw = 16;
  const sx = 8;
  const sy = 5;
  const LM = 100;

  const pts = [];
  for (let row = 0; row < M; row++) {
    pts[row] = [];
    for (let col = 0; col < N; col++) {
      const dc = col - halfN;
      const dr = row - halfM;
      const radius = Math.sqrt(dc * dc + dr * dr) * 0.62;
      const z = sampler.sample(radius, t);
      pts[row][col] = {
        x: cx + dc * cw + dr * sx,
        y: cy + dr * sy - z
      };
    }
  }

  noFill();

  // Row lines — back (row 0) to front (row M-1)
  for (let row = 0; row < M; row++) {
    const alpha = map(row, 0, M - 1, 38, 118);
    stroke(22, alpha);
    strokeWeight(0.65);
    beginShape();
    for (let col = 0; col < N; col++) {
      vertex(pts[row][col].x, pts[row][col].y);
    }
    endShape();
  }

  // Col lines
  for (let col = 0; col < N; col++) {
    const alpha = map(col, 0, N - 1, 35, 92);
    stroke(22, alpha);
    strokeWeight(0.5);
    beginShape();
    for (let row = 0; row < M; row++) {
      vertex(pts[row][col].x, pts[row][col].y);
    }
    endShape();
  }

  // Labels
  noStroke();
  textAlign(LEFT, BASELINE);

  fill(90, 90, 90, 242);
  textFont('Oswald');
  textSize(22);
  text('Membrane', LM, 854);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  text(sampler.waveName, LM, 870);

  fill(168);
  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', 900 - LM, 854);
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
