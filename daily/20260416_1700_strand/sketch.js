const M       = 100;
const N       = 40;
const SPACING = 700 / (N - 1);
const MAX_D   = 18;

let sampler;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  noFill();

  sampler = Waves.createSampler({
    shift:         true,
    shiftInterval: 6,
    shiftDuration: 2.8,
    range:         [-MAX_D, MAX_D],
    frequency:     0.027,
    seed:          17
  });
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 1000;

  for (let i = 0; i < N; i++) {
    const baseX = M + i * SPACING;
    const px    = i * 52;

    const g = map(i, 0, N - 1, 16, 148);
    const w = map(i, 0, N - 1, 2.2, 0.55);

    stroke(g);
    strokeWeight(w);

    beginShape();
    for (let y = M; y <= 900 - M; y += 2) {
      vertex(baseX + sampler.sample(y + px, t), y);
    }
    endShape();
  }

  noStroke();
  drawingContext.font = '300 22px Oswald';
  drawingContext.fillStyle = 'rgba(90,90,90,0.95)';
  drawingContext.textAlign = 'left';
  drawingContext.textBaseline = 'middle';
  drawingContext.fillText('STRAND', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  textAlign(LEFT, CENTER);
  fill(168);
  text(sampler.waveName, M, 870);

  textAlign(RIGHT, CENTER);
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
