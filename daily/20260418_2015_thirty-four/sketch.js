// Thirty-Four — all 34 p5.waves waveforms as a synchronized labeled catalog
// p5.waves: Waves.list(), Waves.wave() with every wave by index, t-driven animation

const M = 100;
const LABEL_X = 240;
const TRACE_X0 = 252;
const TRACE_X1 = 800;
const TW = TRACE_X1 - TRACE_X0;
const Y_TOP = M;
const Y_BOT = 800;
const TOTAL_H = Y_BOT - Y_TOP;

let waveData;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  waveData = Waves.list();
}

function __p5wSourceDraw() {
  background(245);

  const t = millis() / 1000;
  const N = waveData.length;
  const rowH = TOTAL_H / N;
  const AMP = rowH * 0.37;

  stroke(195);
  strokeWeight(0.4);
  line(TRACE_X0 - 6, Y_TOP, TRACE_X0 - 6, Y_BOT);

  for (let row = 0; row < N; row++) {
    const info = waveData[row];
    const yC = Y_TOP + row * rowH + rowH * 0.5;

    drawingContext.font = '300 7.8px "IBM Plex Mono"';
    drawingContext.fillStyle = 'rgba(95,95,95,0.88)';
    drawingContext.textAlign = 'right';
    drawingContext.textBaseline = 'middle';
    drawingContext.fillText(info.name, LABEL_X, yC);

    noFill();
    stroke(28);
    strokeWeight(0.7);

    beginShape();
    for (let px = TRACE_X0; px <= TRACE_X1; px += 2) {
      const wy = Waves.wave(px - TRACE_X0, {
        wave: info.index,
        t: t * 0.4,
        amplitude: AMP,
        frequency: 0.033
      });
      vertex(px, yC + wy);
    }
    endShape();
  }

  noStroke();
  drawingContext.font = '300 22px Oswald';
  drawingContext.fillStyle = 'rgba(90,90,90,0.95)';
  drawingContext.textAlign = 'left';
  drawingContext.textBaseline = 'alphabetic';
  drawingContext.fillText('Thirty-Four', M, 854);

  drawingContext.font = '300 9.5px "IBM Plex Mono"';
  drawingContext.fillStyle = 'rgb(168,168,168)';
  drawingContext.fillText('all 34 waves · synchronized', M, 870);

  drawingContext.font = '400 19px "IBM Plex Mono"';
  drawingContext.textAlign = 'right';
  drawingContext.fillText('p5.waves', 900 - M, 854);
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
