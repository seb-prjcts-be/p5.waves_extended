/*
  palimpsest — 2026-04-21 · 18:30

  FEELING      : erasure — writing laid over writing, meaning eroding
                 beneath itself but never fully gone.
  WAVE LOGIC   : `fuzzy pulse`  drives per-letter x-displacement,
                 fracturing each word into a broken signal.
                 `bald patch`   drives per-letter y-displacement —
                 rare vertical breaks that pull single letters out of
                 their row.
                 morph [`wobble sine`, `stepped sine`] governs the
                 per-row amplitude envelope: some rows breathe
                 smoothly towards legibility, others quantise into
                 discrete shifted states.
                 `smooth solid sine` modulates per-row opacity — a
                 slow ghost-layer pulse so the palimpsest surfaces
                 and withdraws.
  TIME LOGIC   : letters-x     = millis() / 2400   (slow drift)
                 letters-y     = millis() / 3100   (slower structural)
                 envelope      = millis() / 3800   (slowest breath)
                 opacity       = millis() / 1900   (faster ghost pulse)
                 morph mix     = sin(millis()/5600) → 0..1 crossfade
  STRUCTURAL   : 22 stacked rows of the word PALIMPSEST, tightly
                 packed so each row bleeds into the next — a
                 manuscript overwritten on itself. Amplitude,
                 vertical drift, and opacity vary row-by-row, so
                 some strata are nearly readable while others
                 disperse sideways into pure rhythm.
*/

const W = 1080, H = 1080, M = 100;
const WORD = 'PALIMPSEST';
const ROWS = 22;
const FONT_SIZE = 48;

let dispX, dispY, envelope, opac;
let CHAR_ADV = null;

async function setup() {
  createCanvas(W, H);
  pixelDensity(2);
  await document.fonts.ready;

  dispX = Waves.createSampler({
    wave: 'fuzzy pulse',
    seed: 3,
    range: [-1, 1],
    frequency: 1.35,
    unpredictability: 0.25,
  });

  dispY = Waves.createSampler({
    wave: 'bald patch',
    seed: 17,
    range: [-1, 1],
    frequency: 0.9,
  });

  envelope = Waves.createSampler({
    wave: ['wobble sine', 'stepped sine'],
    seed: 9,
    range: [0, 1],
    frequency: 0.7,
  });

  opac = Waves.createSampler({
    wave: 'smooth solid sine',
    seed: 22,
    range: [30, 215],
    frequency: 0.55,
    phase: 0.2,
  });

  noStroke();
}

function draw() {
  background(245);

  const tX   = millis() / 2400;
  const tY   = millis() / 3100;
  const tEnv = millis() / 3800;
  const tOp  = millis() / 1900;
  const mixVal = (Math.sin(millis() / 5600) + 1) * 0.5;

  drawingContext.font = `500 ${FONT_SIZE}px "IBM Plex Mono", monospace`;
  drawingContext.textBaseline = 'alphabetic';
  drawingContext.textAlign = 'left';

  if (CHAR_ADV === null) {
    CHAR_ADV = drawingContext.measureText('M').width;
  }

  const wordW = CHAR_ADV * WORD.length;
  const fieldTop = 220;
  const fieldBot = 800;
  const rowGap = (fieldBot - fieldTop) / (ROWS - 1);
  const wordStart = (W - wordW) / 2;

  for (let r = 0; r < ROWS; r++) {
    const u = r / (ROWS - 1);
    const rowY = fieldTop + r * rowGap;

    // envelope 0..1 — how much this row is shattered
    const env = envelope.sample(r * 0.42, tEnv, mixVal);

    // horizontal shatter amplitude, gentle at top+bottom, stronger at mid rows
    const spine = Math.sin(Math.PI * u);
    const ampX = 3 + env * (64 + spine * 34);
    const ampY = env * 22;

    const alpha = opac.sample(r * 0.27, tOp);

    // accent: every 7th row gets a denser weight for structural rhythm
    const accent = (r % 7 === 0);
    const weight = accent ? 600 : 500;
    drawingContext.font = `${weight} ${FONT_SIZE}px "IBM Plex Mono", monospace`;
    drawingContext.fillStyle = `rgba(28, 30, 36, ${alpha / 255})`;

    for (let i = 0; i < WORD.length; i++) {
      const ch = WORD[i];
      const baseX = wordStart + i * CHAR_ADV;
      const dx = dispX.sample(i * 0.9 + r * 0.4, tX + r * 0.03) * ampX;
      const dy = dispY.sample(i * 1.3 + r * 0.5, tY + r * 0.02) * ampY;
      drawingContext.fillText(ch, baseX + dx, rowY + dy);
    }
  }

  drawLabels();
}

function drawLabels() {
  drawingContext.font = '300 22px "Oswald", sans-serif';
  drawingContext.fillStyle = 'rgba(90, 90, 90, 0.95)';
  drawingContext.textBaseline = 'alphabetic';
  drawingContext.textAlign = 'left';
  drawingContext.fillText('palimpsest', M, 854);

  drawingContext.font = '400 9.5px "IBM Plex Mono", monospace';
  drawingContext.fillStyle = 'rgb(168, 168, 168)';
  drawingContext.fillText('fuzzy pulse  ·  bald patch  ·  morph [wobble sine, stepped sine]', M, 870);

  drawingContext.font = '400 19px "IBM Plex Mono", monospace';
  drawingContext.textAlign = 'right';
  drawingContext.fillText('p5.waves', W - M, 854);
}
