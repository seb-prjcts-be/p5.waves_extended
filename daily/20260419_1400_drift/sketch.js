/*
  FEELING: drift
  WAVE LOGIC: morph ['round linked sine', 'fuzzy peak sine'] — a gentle sine carrier
              interrupted by soft modulo spikes. The word breathes and occasionally tears.
  TIME LOGIC: slice offset t = millis()/2400 (cinematic slow);
              morph morphMix driven by sin(millis()/1800) — asynchronous from offset,
              so carrier-drift and tear-events almost never line up.
  STRUCTURAL MOVE: one word "DRIFT" sliced into 3px horizontal scanlines;
                   each scanline offset horizontally by the morphing wave.
                   Near-stillness with underlying structural shear.
*/

const M = 100;
const SLICE = 3;
const WORD_STR = 'DRIFT';
const TITLE = 'drift';

let buf, ghost;
let sampler;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(1);
  await document.fonts.ready;

  buf = createGraphics(1080, 1080);
  buf.pixelDensity(1);
  buf.clear();
  buf.textFont('Oswald');
  buf.textStyle(BOLD);
  buf.textAlign(CENTER, CENTER);
  buf.textSize(340);
  buf.noStroke();
  buf.fill(32);
  buf.text(WORD_STR, 450, 470);

  ghost = createGraphics(1080, 1080);
  ghost.pixelDensity(1);
  ghost.clear();
  ghost.textFont('Oswald');
  ghost.textStyle(BOLD);
  ghost.textAlign(CENTER, CENTER);
  ghost.textSize(340);
  ghost.noStroke();
  ghost.fill(210);
  ghost.text(WORD_STR, 450, 470);

  sampler = Waves.createSampler({
    wave: ['round linked sine', 'fuzzy peak sine'],
    range: [-68, 68],
    frequency: 0.006,
    seed: 4
  });
  loop();
}

function draw() {
  background(245);
  image(ghost, 0, 0);

  const t = millis() / 2400;
  const morphMix = (Math.sin(millis() / 1800) + 1) / 2;

  for (let y = 0; y < 1080; y += SLICE) {
    const dx = sampler.sample(y, t, morphMix);
    image(buf, dx, y, width, SLICE, 0, y, width, SLICE);
  }

  drawFrameMarks();
  drawLabels();
}

function drawFrameMarks() {
  stroke(195);
  strokeWeight(1);
  line(M, M, M + 24, M);
  line(M, M, M, M + 24);
  line(1080 - M, M, 1080 - M - 24, M);
  line(1080 - M, M, 1080 - M, M + 24);
  line(M, 1080 - M, M + 24, 1080 - M);
  line(M, 1080 - M, M, 1080 - M - 24);
  line(1080 - M, 1080 - M, 1080 - M - 24, 1080 - M);
  line(1080 - M, 1080 - M, 1080 - M, 1080 - M - 24);
  noStroke();
}

function drawLabels() {
  noStroke();
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 242);
  textAlign(LEFT, BASELINE);
  text(TITLE, M, 1020);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  const waveLabel = sampler.shifting
    ? `${sampler.waveName} → ${sampler.targetName}`
    : 'morph · round linked sine ↔ fuzzy peak sine';
  text(waveLabel, M, 1040);

  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', 1080 - M, 1020);
}
