/*
  loom — 2026-04-21 14:00

  FEELING — looming: an enormous presence gathering, slow, unwilling to
            commit to appearing fully. The word is there, just past the
            edge of visibility, and the air around it is already
            conducting the mass.

  WAVE LOGIC — duo in tension.
             · INSIDE the letterform: morph ['wobble sine' ↔ 'round linked sine'].
               Body of the letter — surge and layer, never flat, continuously
               re-woven on a slow mix.
             · OUTSIDE the letterform: 'stepped sine' with shift enabled.
               Every ~6s the ambient picks a new wave identity (a quantized
               breath of the surround), never matching the body inside.
             · Per-line seed drift + column-ward phase so no two lines lock.

  TIME LOGIC — medium primary  t = millis() / 800  (breath, loop).
             Morph mix = (sin(millis()/4600)+1)/2 — a ~29s sinusoid, so
             the body texture drifts without any obvious event. Outside
             shift runs on its own 6s hold / 2s crossfade clock. The word
             is almost still; only the material moves.

  STRUCTURAL MOVE — typographic. "LOOM" in Oswald 300 at massive scale
             is rasterized once to a binary mask. Underneath, 160 horizontal
             wave traces span the safe margin. Inside the mask: body wave,
             stroke alpha 225. Outside: ghost wave, alpha 22 — the field
             the letter emerges from. Not two separate images: one
             continuous surface, denser where the word collects it.
*/

const W = 1080;
const H = 1080;
const M = 100;

const LINES = 160;
const STEP = 3;

let maskGfx;
let maskData;

const insideSamplers = [];
const outsideSamplers = [];

async function setup() {
  createCanvas(W, H);
  pixelDensity(2);
  await document.fonts.ready;
  frameRate(30);

  buildMask();

  for (let i = 0; i < LINES; i++) {
    const seedBase = i * 41 + 3;
    insideSamplers.push(Waves.createSampler({
      wave: ['wobble sine', 'round linked sine'],
      range: [-11, 11],
      frequency: 0.78 + (i % 9) * 0.018,
      phase: i * 0.07,
      seed: seedBase
    }));
    outsideSamplers.push(Waves.createSampler({
      wave: 'stepped sine',
      shift: true,
      shiftInterval: 6,
      shiftDuration: 2,
      range: [-4.5, 4.5],
      frequency: 0.55 + (i % 7) * 0.013,
      phase: i * 0.11,
      seed: seedBase + 131
    }));
  }
}

function buildMask() {
  maskGfx = createGraphics(W, H);
  maskGfx.pixelDensity(1);
  const ctx = maskGfx.drawingContext;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  const word = 'LOOM';
  const targetW = W - 2 * M - 20;
  let fontSize = 520;
  ctx.font = `300 ${fontSize}px 'Oswald', sans-serif`;
  while (ctx.measureText(word).width > targetW && fontSize > 80) {
    fontSize -= 8;
    ctx.font = `300 ${fontSize}px 'Oswald', sans-serif`;
  }
  ctx.fillText(word, W / 2, H / 2 - 30);

  maskGfx.loadPixels();
  maskData = new Uint8Array(W * H);
  const px = maskGfx.pixels;
  for (let i = 0, n = W * H; i < n; i++) {
    maskData[i] = px[i * 4] > 128 ? 1 : 0;
  }
}

function draw() {
  background(245);

  const t = millis() / 800;
  const mix = (Math.sin(millis() / 4600) + 1) / 2;

  drawWaveField(t, mix);
  drawLabels();
}

function drawWaveField(t, mix) {
  const top = M;
  const bot = H - M;
  const spacing = (bot - top) / LINES;
  noFill();

  const xStart = M - 12;
  const xEnd = W - M + 12;

  for (let i = 0; i < LINES; i++) {
    const baseY = top + i * spacing + spacing / 2;
    const sIn = insideSamplers[i];
    const sOut = outsideSamplers[i];
    const rowIdx = Math.round(baseY) * W;

    let state = -1;
    let shapeOpen = false;

    for (let x = xStart; x <= xEnd; x += STEP) {
      const clampedX = Math.max(0, Math.min(W - 1, x));
      const isInside = maskData[rowIdx + clampedX] === 1 ? 1 : 0;

      if (isInside !== state) {
        if (shapeOpen) endShape();
        if (isInside) {
          stroke(28, 28, 34, 225);
          strokeWeight(0.95);
        } else {
          stroke(28, 28, 34, 22);
          strokeWeight(0.7);
        }
        beginShape();
        shapeOpen = true;
        state = isInside;
      }

      const y = isInside
        ? baseY + sIn.sample(x * 0.0065, t, mix)
        : baseY + sOut.sample(x * 0.0045, t);
      vertex(x, y);
    }
    if (shapeOpen) endShape();
  }
}

function drawLabels() {
  drawingContext.save();
  drawingContext.textBaseline = 'alphabetic';

  drawingContext.font = "300 22px 'Oswald', sans-serif";
  drawingContext.fillStyle = 'rgba(90,90,90,0.95)';
  drawingContext.textAlign = 'left';
  drawingContext.fillText('loom', M, 854);

  drawingContext.font = "400 9.5px 'IBM Plex Mono', monospace";
  drawingContext.fillStyle = 'rgb(168,168,168)';
  drawingContext.textAlign = 'left';
  drawingContext.fillText('morph · wobble sine \u2194 round linked sine', M, 870);

  drawingContext.font = "400 19px 'IBM Plex Mono', monospace";
  drawingContext.fillStyle = 'rgb(168,168,168)';
  drawingContext.textAlign = 'right';
  drawingContext.fillText('p5.waves', W - M, 854);

  drawingContext.restore();
}
