// Ink — wave as calligraphic pressure along 32 horizontal paths
// p5.waves: createSampler with shift, wave value drives mark height

const M = 100;
const ROWS = 32;
const SEG = 3;
const FREQ = 0.009;
const PHASE_STEP = 0.42;

let sampler;
let rowY = [];

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;

  sampler = Waves.createSampler({
    shift: true,
    shiftInterval: 5,
    shiftDuration: 1.5,
    range: [-1, 1]
  });

  for (let i = 0; i < ROWS; i++) {
    rowY.push(lerp(M + 50, 1080 - M - 50, i / (ROWS - 1)));
  }
}

function draw() {
  background(245);

  const t = millis() / 300;

  drawingContext.fillStyle = 'rgb(35,35,35)';
  for (let i = 0; i < ROWS; i++) {
    const y = rowY[i];
    for (let x = M; x <= 1080 - M; x += SEG) {
      const v = sampler.sample(x * FREQ + i * PHASE_STEP, t);
      const h = lerp(0.3, 12, (v + 1) * 0.5);
      drawingContext.fillRect(x, y - h * 0.5, SEG - 0.5, h);
    }
  }

  drawLabels();
}

function drawLabels() {
  drawingContext.save();

  drawingContext.textAlign = 'left';
  drawingContext.font = '300 22px Oswald';
  drawingContext.fillStyle = 'rgba(90,90,90,0.95)';
  drawingContext.fillText('Ink', M, 1020);

  drawingContext.font = '400 9.5px "IBM Plex Mono"';
  drawingContext.fillStyle = 'rgb(168,168,168)';
  drawingContext.fillText(sampler.waveName, M, 1040);

  drawingContext.textAlign = 'right';
  drawingContext.font = '400 19px "IBM Plex Mono"';
  drawingContext.fillStyle = 'rgb(168,168,168)';
  drawingContext.fillText('p5.waves', 1080 - M, 1020);

  drawingContext.restore();
}
