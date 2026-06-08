/*
 * murmur
 *
 * FEELING: murmur — a low collective voice, near-still, restlessly reorganizing.
 * WAVE LOGIC: morph between 'fuzzy pulse' and 'round linked sine' —
 *   two underused waves. Fuzzy pulse is soft binary flicker; round linked
 *   sine is continuous and linked. Together, each column holds both the
 *   possibility of stepping and of breathing, blended slowly.
 * TIME LOGIC: three uncorrelated slow clocks —
 *   /2800 sample clock (column breath),
 *   /4200 morph clock (voice character),
 *   /3600 envelope clock (chorus-wide swell).
 *   No clock is at /1000. All below 1 Hz.
 * STRUCTURAL MOVE: typographic murmuration. 25 columns × 40 rows of mono
 *   glyphs, each column owns its own wave sampler (unique seed). A bow-shaped
 *   spatial envelope (sin across columns) × a slow temporal swell (wave sampler)
 *   modulates amplitude so the centre columns breathe while the edges hold
 *   almost perfectly still. The flock is only motion where it needs to be.
 */

const M = 100;
const COLS = 25;
const ROWS = 40;
const BLOCK_TOP = 180;
const BLOCK_H = 600;

const colSamplers = [];
let envelope;
let letters;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  noStroke();

  for (let i = 0; i < COLS; i++) {
    colSamplers.push(Waves.createSampler({
      wave: ['fuzzy pulse', 'round linked sine'],
      seed: i * 11 + 3,
      frequency: 1 + (i % 5) * 0.08,
      range: [-9, 9]
    }));
  }

  envelope = Waves.createSampler({
    wave: 'round linked sine',
    seed: 17,
    range: [0.18, 1.15]
  });

  letters = new Array(COLS * ROWS);
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const code = 97 + ((c * 37 + r * 13 + 5) % 26);
      letters[c * ROWS + r] = String.fromCharCode(code);
    }
  }
}

function __p5wSourceDraw() {
  background(245);

  const tSample = millis() / 2800;
  const tMorph = millis() / 4200;
  const tEnv = millis() / 3600;
  const morphMix = (sin(tMorph) + 1) / 2;

  const blockW = 900 - 2 * M;
  const colW = blockW / COLS;
  const rowH = BLOCK_H / ROWS;

  textFont('IBM Plex Mono');
  textSize(12);
  textAlign(CENTER, CENTER);

  for (let c = 0; c < COLS; c++) {
    const cx = M + (c + 0.5) * colW;
    const bow = sin(PI * (c / (COLS - 1)));
    const envVal = envelope.sample(c * 0.14, tEnv);
    const amp = bow * envVal;

    for (let r = 0; r < ROWS; r++) {
      const baseY = BLOCK_TOP + (r + 0.5) * rowH;
      const dy = colSamplers[c].sample(r * 0.09, tSample, morphMix) * amp;

      const alpha = 65 + amp * 130;
      fill(40, alpha);
      text(letters[c * ROWS + r], cx, baseY + dy);
    }
  }

  drawReferenceTicks();
  drawLabels();
}

function drawReferenceTicks() {
  push();
  stroke(185);
  strokeWeight(0.5);
  noFill();
  const y1 = BLOCK_TOP - 22;
  const y2 = BLOCK_TOP + BLOCK_H + 22;
  line(M - 8, y1, M + 14, y1);
  line(900 - M - 14, y1, 900 - M + 8, y1);
  line(M - 8, y2, M + 14, y2);
  line(900 - M - 14, y2, 900 - M + 8, y2);
  pop();
}

function drawLabels() {
  push();
  noStroke();

  textFont('Oswald');
  textSize(22);
  fill('rgba(90,90,90,0.95)');
  textAlign(LEFT, BASELINE);
  text('murmur', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text('fuzzy pulse  \u2194  round linked sine', M, 870);

  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', 900 - M, 854);

  pop();
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
