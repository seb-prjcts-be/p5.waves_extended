const W   = 900;
const H   = 900;
const M   = 100;
const SC  = 5;
const SX1 = 268;
const SY1 = 422;
const SX2 = 632;
const SY2 = 422;

let s1, s2;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;

  s1 = Waves.createSampler({
    shift:         true,
    shiftInterval: 7,
    shiftDuration: 2.5,
    amplitude:     1,
    frequency:     0.008,
    seed:          0
  });

  s2 = Waves.createSampler({
    shift:         true,
    shiftInterval: 9,
    shiftDuration: 2.5,
    amplitude:     1,
    frequency:     0.008,
    seed:          4
  });
}

function __p5wSourceDraw() {
  const t = millis() / 1000;

  loadPixels();

  for (let row = 0; row < H; row += SC) {
    for (let col = 0; col < W; col += SC) {
      const cx = col + SC * 0.5;
      const cy = row + SC * 0.5;

      const dx1 = cx - SX1, dy1 = cy - SY1;
      const dx2 = cx - SX2, dy2 = cy - SY2;
      const d1  = Math.sqrt(dx1 * dx1 + dy1 * dy1);
      const d2  = Math.sqrt(dx2 * dx2 + dy2 * dy2);

      const v1 = s1.sample(d1, t);
      const v2 = s2.sample(d2, t);

      let bright = (v1 + v2) * 54.5 + 131;
      if (bright < 22)  bright = 22;
      if (bright > 240) bright = 240;
      const b = bright | 0;

      for (let dy = 0; dy < SC && row + dy < H; dy++) {
        const rowBase = ((row + dy) * W + col) * 4;
        for (let dx = 0; dx < SC && col + dx < W; dx++) {
          const idx = rowBase + dx * 4;
          pixels[idx]     = b;
          pixels[idx + 1] = b;
          pixels[idx + 2] = b;
          pixels[idx + 3] = 255;
        }
      }
    }
  }

  updatePixels();

  // Source markers
  noStroke();
  fill(22, 22, 28);
  circle(SX1, SY1, 5);
  circle(SX2, SY2, 5);

  // Label strip background
  fill(248, 247, 244, 220);
  noStroke();
  rect(0, 828, W, 72);

  // Labels
  textAlign(LEFT, BASELINE);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 242);
  text('INTERFERENCE', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text(s1.waveName + '  ×  ' + s2.waveName, M, 870);

  textAlign(RIGHT, BASELINE);
  textSize(19);
  text('p5.waves', W - M, 854);

  textAlign(LEFT, BASELINE);
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
