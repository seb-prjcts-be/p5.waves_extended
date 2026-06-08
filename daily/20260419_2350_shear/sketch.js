/*
 * Daily p5.waves — 2026-04-19 · 23:50
 * shear
 *
 * FEELING          shear — two materials rubbing past one another, their
 *                  shared surface building fine stress and release.
 *
 * WAVE LOGIC       morph([ 'round linked sine', 'fuzzy pulse' ])
 *                  The smooth rounded sine is continuous mass. Fuzzy pulse is
 *                  broken grain. Morphing between them along every contour
 *                  line is the act of shearing — mass becoming particle and
 *                  back again. A second sampler ('grow random') feeds a fine
 *                  alpha tremor along the boundary band.
 *
 * TIME LOGIC       multi-speed. Three uncorrelated clocks:
 *                    wave     t_w  = millis() / 900   (breathing)
 *                    morph    t_m  = millis() / 3200  (cinematic drift)
 *                    shiver   t_s  = millis() / 180   (fracture tremor)
 *                  Bans millis()/1000. The slow morph never fully arrives at
 *                  either extreme — it sits on the sliding boundary.
 *
 * STRUCTURAL MOVE  56 horizontal contour lines descending the canvas. The
 *                  line frequency compresses with depth; phase fans per row;
 *                  row-local morph mix biases lower lines toward grain. A
 *                  thin vertical seam marks the still axis the whole stack
 *                  is shearing around.
 */

const W    = 900;
const H    = 900;
const M    = 100;
const ROWS = 56;

const TOP  = 168;
const BOT  = H - 180;

let sampler;
let shiverSampler;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;

  sampler = Waves.createSampler({
    wave: ['round linked sine', 'fuzzy pulse'],
    range: [-44, 44],
  });

  shiverSampler = Waves.createSampler({
    wave: 'grow random',
    range: [0, 1],
    seed: 7,
  });

  noFill();
}

function __p5wSourceDraw() {
  background(245);

  const tW = millis() / 900;
  const tM = millis() / 3200;
  const tS = millis() / 180;

  // Global morph drift. Stays mostly on the smooth side,
  // occasionally collapsing toward the broken wave.
  const globalMix = (sin(tM) * 0.5 + 0.5) * 0.78;

  for (let r = 0; r < ROWS; r++) {
    const u = r / (ROWS - 1);
    const y0 = lerp(TOP, BOT, u);

    // frequency compresses downward; phase fans per row
    const freq  = lerp(0.0095, 0.028, u);
    const phase = r * 0.42 + sin(tW * 0.28 + r * 0.11) * 1.6;
    const amp   = lerp(14, 60, u);

    // Row-local mix bends with depth — upper lines smooth,
    // lower lines edge toward pulsed grain.
    const rowMix = constrain(globalMix * lerp(0.32, 1.35, u), 0, 1);

    // Alpha emphasises the shear band around 55% depth.
    const bandCurve = 1.0 - abs(u - 0.55) * 1.55;
    const tremor    = shiverSampler.sample(r * 0.35, tS + r * 0.04);
    const alpha     = constrain(64 + bandCurve * 92 + tremor * 36, 36, 210);

    stroke(58, alpha);
    strokeWeight(u < 0.5 ? 0.9 : 1.2);

    beginShape();
    for (let x = M - 8; x <= W - M + 8; x += 2) {
      const v = sampler.sample(
        x * freq + phase,
        tW + r * 0.025,
        rowMix
      ) * (amp / 44);
      vertex(x, y0 + v);
    }
    endShape();
  }

  // Still axis — the seam the stack shears around.
  stroke(180, 90);
  strokeWeight(0.6);
  line(W / 2, M - 4, W / 2, H - M + 4);

  drawLabels();
}

function drawLabels() {
  noStroke();

  fill(90, 90, 90, 245);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('shear', M, 854);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  textAlign(LEFT, BASELINE);
  text('round linked sine  /  fuzzy pulse   — morph', M, 870);

  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', W - M, 854);
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
