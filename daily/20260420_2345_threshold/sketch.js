/*
  FEELING — threshold: a quiet boundary about to be crossed;
            pressure rising from below while the upper half waits.

  WAVE LOGIC — chorus of ten curated waves distributed across 60 horizontal
            contour lines (bald patch, fuzzy pulse, batman, stepped sine,
            round linked sine, up down pulse, grow random, wobble sine,
            mountain peaks, smooth solid sine). One morph line at the
            centre of the bulge blends bald patch ↔ fuzzy pulse — that
            line is the threshold itself.

  TIME LOGIC — base t = millis() / 2800 (slow, cinematic drift).
            Per-line jitter (1 + (i % 5) * 0.035) keeps lines out of
            lock-step. Morph mix breathes on a separate 5200 ms cycle
            so the crossing feels independent from the surface motion.

  STRUCTURAL MOVE — 60 stacked topographic lines. Amplitude envelope is a
            Gaussian centred at i = 40 (below canvas middle), so motion
            blooms lower and the upper half stays nearly flat.
            Asymmetric on purpose — the threshold sits in the silence
            above, not at the geometric centre.
*/

const M = 100;
const ROWS = 60;

const WAVE_LIST = [
  'smooth solid sine',
  'round linked sine',
  'mountain peaks',
  'wobble sine',
  'bald patch',
  'up down pulse',
  'stepped sine',
  'fuzzy pulse',
  'batman',
  'grow random'
];

const MORPH_A = 'bald patch';
const MORPH_B = 'fuzzy pulse';

let samplers = [];
let morphSampler;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(2);

  await document.fonts.ready;

  const bulgeCenter = 40;
  const sigma = 13;

  for (let i = 0; i < ROWS; i++) {
    const env = Math.exp(-Math.pow((i - bulgeCenter) / sigma, 2));
    const amp = 6 + env * 180;
    const waveName = WAVE_LIST[(i * 3 + 1) % WAVE_LIST.length];

    samplers.push({
      sampler: Waves.createSampler({
        wave: waveName,
        seed: i * 7 + 3,
        range: [-amp, amp],
        frequency: 0.65 + ((i * 2) % 5) * 0.22,
        unpredictability: env > 0.45 ? 0.1 : 0
      }),
      env: env,
      amp: amp,
      waveName: waveName
    });
  }

  morphSampler = Waves.createSampler({
    wave: [MORPH_A, MORPH_B],
    range: [-190, 190],
    frequency: 0.9,
    seed: 91
  });
}

function draw() {
  background(245);

  const t = millis() / 2800;

  const xStart = M;
  const xEnd = width - M;
  const yStart = M + 10;
  const yEnd = 820;
  const rowSpacing = (yEnd - yStart) / (ROWS - 1);

  noFill();
  strokeCap(SQUARE);

  for (let i = 0; i < ROWS; i++) {
    const s = samplers[i];
    const y0 = yStart + i * rowSpacing;

    const alpha = 45 + s.env * 155;
    stroke(52, 52, 58, alpha);
    strokeWeight(0.6 + s.env * 0.9);

    const localT = t * (1 + (i % 5) * 0.035) + i * 0.27;

    beginShape();
    for (let x = xStart; x <= xEnd; x += 3) {
      const u = (x - xStart) / (xEnd - xStart);
      const sx = u * 8 - 4;
      const edgeFade = Math.sin(u * Math.PI);
      const y = s.sampler.sample(sx, localT) * (0.35 + 0.65 * edgeFade);
      vertex(x, y0 + y * 0.55);
    }
    endShape();
  }

  const morphIndex = 40;
  const y0Morph = yStart + morphIndex * rowSpacing;
  const mix = (Math.sin(millis() / 5200) + 1) / 2;

  stroke(22, 22, 26, 230);
  strokeWeight(1.15);
  beginShape();
  for (let x = xStart; x <= xEnd; x += 2) {
    const u = (x - xStart) / (xEnd - xStart);
    const sx = u * 6 - 3;
    const edgeFade = Math.sin(u * Math.PI);
    const y = morphSampler.sample(sx, t * 0.72, mix) * (0.3 + 0.7 * edgeFade);
    vertex(x, y0Morph + y * 0.55);
  }
  endShape();

  drawLabels(mix);
}

function drawLabels(mix) {
  drawingContext.save();
  drawingContext.textBaseline = 'alphabetic';

  drawingContext.font = "300 22px 'Oswald', sans-serif";
  drawingContext.fillStyle = 'rgba(90,90,90,0.95)';
  drawingContext.textAlign = 'left';
  drawingContext.fillText('threshold', M, 854);

  const activeName = mix < 0.5 ? MORPH_A : MORPH_B;
  drawingContext.font = "400 9.5px 'IBM Plex Mono', monospace";
  drawingContext.fillStyle = 'rgb(168,168,168)';
  drawingContext.textAlign = 'left';
  drawingContext.fillText('chorus / morph · ' + activeName, M, 870);

  drawingContext.font = "400 19px 'IBM Plex Mono', monospace";
  drawingContext.fillStyle = 'rgb(168,168,168)';
  drawingContext.textAlign = 'right';
  drawingContext.fillText('p5.waves', width - M, 854);

  drawingContext.restore();
}
