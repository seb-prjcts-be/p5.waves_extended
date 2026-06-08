// PRESSURE
// 180 horizontal rules displaced vertically by a single shifting wave sampler.
// The wave is never drawn as a curve — only felt as density:
// where lines compress, darkness accumulates; where they spread, light opens.

const M = 100;
const N = 180;

let sampler;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;

  sampler = Waves.createSampler({
    shift: true,
    range: [-65, 65],
    frequency: 0.027,
    shiftInterval: 5,
    shiftDuration: 2.5
  });
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 1000;

  stroke(22, 140);
  strokeWeight(0.45);
  noFill();

  for (let i = 0; i < N; i++) {
    const baseY = map(i, 0, N - 1, M, 900 - M);
    const dy = sampler.sample(baseY + t * 8, t);
    const y = baseY + dy;
    line(M, y, 900 - M, y);
  }

  drawLabel();
}

function drawLabel() {
  noStroke();

  drawingContext.font = '300 22px Oswald';
  drawingContext.fillStyle = 'rgba(90,90,90,0.95)';
  drawingContext.textAlign = 'left';
  drawingContext.textBaseline = 'alphabetic';
  drawingContext.fillText('Pressure', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  textAlign(LEFT, BASELINE);
  fill(168);
  text(sampler.waveName, M, 870);

  textAlign(RIGHT, BASELINE);
  fill(168);
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
