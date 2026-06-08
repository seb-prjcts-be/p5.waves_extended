/*
 * FEELING         — hush
 * WAVE LOGIC      — morph [round linked sine ↔ smooth solid sine]. Both are soft,
 *                    continuous, unhurried — the morph keeps the form alive without
 *                    introducing any sharp event. A faint 'fuzzy peak sine' detail
 *                    adds breath-level micro-tremor.
 * TIME LOGIC      — /3200 slow clock for the primary form; /220 for the 1-pixel
 *                    detail jitter; morph-mix driven by a 28-second sinusoidal cycle.
 * STRUCTURAL MOVE — a single horizontal line across the canvas, trailed by 20
 *                    temporal echoes above and below with progressive time lag.
 *                    Near-stillness; the echoes reveal the wave as it was moments ago.
 */

let mainSampler;
let detailSampler;

const MARGIN = 100;
const ECHOES = 10;
const OFFSET_STEP = 4.5;
const LAG_STEP = 0.18;

async function setup() {
  await document.fonts.ready;
  createCanvas(1080, 1080);
  const host = document.getElementById('canvas-host');
  if (host) host.appendChild(document.querySelector('canvas'));
  noFill();

  mainSampler = Waves.createSampler({
    wave: ['round linked sine', 'smooth solid sine'],
    range: [-42, 42],
    frequency: 0.009,
    phase: 1.3,
    seed: 4
  });

  detailSampler = Waves.createSampler({
    wave: 'fuzzy peak sine',
    amplitude: 1.8,
    frequency: 0.08,
    phase: 0.7,
    seed: 13
  });
}

function draw() {
  background(245);

  const t = millis() / 3200;
  const tFast = millis() / 220;
  const mx = (sin(millis() * 0.00022) * 0.5) + 0.5;

  const yCenter = height / 2;

  for (let i = -ECHOES; i <= ECHOES; i++) {
    const k = abs(i) / ECHOES;
    const offY = i * OFFSET_STEP;
    const tLag = t - i * LAG_STEP;

    const aVal = i === 0 ? 210 : floor(lerp(60, 4, k * k));
    const swVal = i === 0 ? 0.95 : 0.42;

    stroke(22, aVal);
    strokeWeight(swVal);

    beginShape();
    for (let x = MARGIN; x <= width - MARGIN; x += 3) {
      const y = mainSampler.sample(x, tLag, mx);
      const micro = detailSampler.sample(x, tFast);
      vertex(x, yCenter + offY + y + micro);
    }
    endShape();
  }

  // faint spine reference
  stroke(0, 16);
  strokeWeight(0.4);
  line(MARGIN, yCenter, width - MARGIN, yCenter);

  // silence markers at the edges
  stroke(0, 80);
  strokeWeight(0.6);
  line(MARGIN, yCenter - 2, MARGIN, yCenter + 2);
  line(width - MARGIN, yCenter - 2, width - MARGIN, yCenter + 2);

  drawLabels(mx);
}

function drawLabels(mx) {
  noStroke();
  textFont('Oswald');
  textWeight(300);
  textSize(22);
  fill(90, 90, 90, 242);
  textAlign(LEFT, BASELINE);
  text('Hush', MARGIN, 1020);

  textFont('IBM Plex Mono');
  textWeight(400);
  textSize(9.5);
  fill(168);
  const mixPct = nf(mx, 1, 2);
  text('morph · round linked sine ↔ smooth solid sine · mix ' + mixPct, MARGIN, 1040);

  textSize(19);
  fill(168);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', width - MARGIN, 1020);
}
