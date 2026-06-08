/*
  Daily p5.waves — 2026-04-21 · 22:33

  ABOUT            a phone on 3% battery
  GESTURE          interrupt
  REFERENCE ANCHOR BYOB club flyers — collision of layers, time-pressure energy
  COLOR COMMITMENT Y2K gradient — chrome/iridescent via layered transparencies of complementary hues
  RISK             typographic work risks decorative type. The INTERRUPT has to *cut* the reading,
                   not decorate around it. A black slab has to take a slab of the frame and mean it.
  MATERIAL         one 'fuzzy pulse' wave at three asynchronous time scales, sliced type in cyan /
                   magenta / orange, periodic black scanline cut with hot magenta edges.
*/

const W = 1080;
const H = 1080;
const M = 100;

let waveSampler;

async function setup() {
  createCanvas(W, H);
  pixelDensity(2);
  await document.fonts.ready;

  waveSampler = Waves.createSampler({
    wave: 'fuzzy pulse',
    seed: 3,
    range: [-48, 48],
    frequency: 0.85,
    mode: 'wild',
    unpredictability: 0.55
  });

  frameRate(30);
  noStroke();
}

function draw() {
  background(245);

  const tC = millis() / 320;
  const tMg = millis() / 140;
  const tO = millis() / 720;

  drawStatusText(tMg);
  drawSlicedGlyph(tC, tMg, tO);
  drawInterruptBand(tMg);
  drawLabels();
}

function drawSlicedGlyph(tC, tMg, tO) {
  const layers = [
    { t: tC,  col: [14, 180, 235],  dx: -7, dy: -3 },
    { t: tMg, col: [232, 36, 158],  dx:  0, dy:  0 },
    { t: tO,  col: [244, 145, 40],  dx:  7, dy:  3 }
  ];

  const ctx = drawingContext;
  const stripes = 46;
  const topY = 170;
  const botY = H - 170;

  ctx.font = '800 720px "Oswald", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const L of layers) {
    ctx.fillStyle = `rgba(${L.col[0]}, ${L.col[1]}, ${L.col[2]}, 0.72)`;
    for (let i = 0; i < stripes; i++) {
      const y0 = map(i, 0, stripes, topY, botY);
      const y1 = map(i + 1, 0, stripes, topY, botY);
      const off = waveSampler.sample(i * 0.82 + L.dy * 0.2, L.t);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, y0, W, y1 - y0 + 1);
      ctx.clip();
      ctx.fillText('3%', W / 2 + L.dx + off, H / 2 + L.dy);
      ctx.restore();
    }
  }
}

function drawInterruptBand(t) {
  const gate = ((sin(t * 0.9) + 1) * 0.5) + ((sin(t * 2.3 + 1.7) + 1) * 0.5);
  if (gate <= 1.1) return;

  const intensity = constrain((gate - 1.1) / 0.9, 0, 1);
  const bandY = H / 2 + 220 * sin(t * 0.6);
  const bandH = 22 + 72 * intensity;

  const ctx = drawingContext;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
  ctx.fillRect(0, bandY, W, bandH);

  ctx.fillStyle = 'rgba(232, 36, 158, 0.88)';
  ctx.fillRect(0, bandY - 3, W, 2);
  ctx.fillRect(0, bandY + bandH + 1, W, 2);

  ctx.fillStyle = 'rgba(245, 245, 245, 1)';
  for (let i = 0; i < 64; i++) {
    const bx = (i * 73.7 + t * 120) % W;
    const by = bandY + 4 + Math.random() * (bandH - 8);
    const bw = 8 + Math.random() * 28;
    ctx.fillRect(bx, by, bw, 1.2);
  }

  ctx.fillStyle = 'rgba(14, 180, 235, 0.85)';
  ctx.font = '800 22px "Oswald", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('SIGNAL LOST', M, bandY + bandH / 2);
}

function drawStatusText(t) {
  const ctx = drawingContext;
  ctx.font = '400 14px "IBM Plex Mono", monospace';

  ctx.fillStyle = 'rgba(40, 40, 40, 0.62)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('LOW BATTERY — 3%', M, 64 + 4 * sin(t * 1.4));

  ctx.fillStyle = 'rgba(232, 36, 158, 0.78)';
  ctx.textAlign = 'right';
  ctx.fillText('TAP TO CANCEL', W - M, 64 + 4 * sin(t * 1.9 + 1.2));

  ctx.fillStyle = 'rgba(40, 40, 40, 0.42)';
  ctx.textAlign = 'left';
  ctx.fillText('22:33 · no service · ······', M, 96);
}

function drawLabels() {
  const ctx = drawingContext;

  ctx.font = '400 9.5px "IBM Plex Mono", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgba(168, 168, 168, 1)';
  ctx.fillText('fuzzy pulse · wild · unpredictability 0.55 · multi-speed', M, 870);

  ctx.font = '300 22px "Oswald", sans-serif';
  ctx.fillStyle = 'rgba(90, 90, 90, 0.95)';
  ctx.fillText('3%', M, 954);

  ctx.font = '400 19px "IBM Plex Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(168, 168, 168, 1)';
  ctx.fillText('p5.waves', W - M, 954);
}
