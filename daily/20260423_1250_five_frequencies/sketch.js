// five_frequencies — Daily p5.waves 2026-04-23
// ============================================================
// 1.  MODE: L — Literal.
// 1a. STATEMENT (= title): "It is one wave at five frequencies."
//     Literally true of the rendered output. The canvas contains
//     five horizontal lines. Each line is the wave 'mountain peaks'
//     sampled across x. The five lines differ only in the frequency
//     parameter (0.25, 0.5, 1.0, 2.0, 4.0 — powers of two centred on
//     the library default of 1.0). A single shared time signal t
//     drives all five rows.
// 2.  GESTURE: enumerate. Same instruction performed five times,
//     exhaustively, by ascending parameter value.
// 3.  REFERENCE ANCHOR: Sol LeWitt — "Lines in Four Directions and
//     All Their Combinations" (1969). Work as the literal execution
//     of an instruction; the system is the meaning.
// 4.  SEB ANCHOR: p5.wavesX100 — the 100-sketch single-library study,
//     compressed here into one specimen page. Same impulse (deep into
//     one library), shorter run.
// 5.  LIBRARY MOVE: `frequency` parameter on Waves.createSampler().
//     Same wave, same t, same amplitude — only `frequency` changes
//     per row. Marketing payload: viewers see what `frequency` does
//     by watching it. The default value (1.0) is tagged in the margin
//     so a reader can locate themselves on the scale.
// 6.  COLOR COMMITMENT: ink on paper. Black 0 on canvas 245.
//     No second colour.
// 7.  RISK: textbook-page legibility. The bottom row at f=4.0 risks
//     reading as noise; the top row at f=0.25 risks reading as a
//     curve, not a wave. Mitigated by a ~5 cycle middle row that
//     anchors "wave" perceptually.
// 8.  MATERIAL: five createSampler() instances, all identical except
//     `frequency`. Single shared time signal millis()/3600 (slow but
//     clearly visible across 5 s — higher-frequency rows traverse
//     more cycles per unit t, so motion announces itself). No second
//     system. 4 px stroke clears the IG-thumbnail bar.
//
// WAVE COUNT:   solo (one wave name across all rows)
// WAVE CHOICE:  'mountain peaks' — strong silhouette across freq range
// TIMING:       millis() / 3600
// STRUCTURE:    stratum (5 horizontal rows, evenly spaced)
// FONT:         Oswald (header + footer title), IBM Plex Mono (labels)

const W = 1080;
const H = 1080;
const M = 100;

const WAVE_NAME = 'mountain peaks';
const FREQS     = [0.25, 0.5, 1.0, 2.0, 4.0];
const AMP       = 50;
const X_SCALE   = 0.04;

let samplers = [];
let yCenters = [];

async function setup() {
  createCanvas(W, H);
  pixelDensity(2);
  frameRate(30);
  await document.fonts.ready;

  const top    = 220;
  const bottom = 940;
  const span   = bottom - top;
  const slot   = span / FREQS.length;

  for (let i = 0; i < FREQS.length; i++) {
    samplers.push(Waves.createSampler({
      wave:      WAVE_NAME,
      frequency: FREQS[i],
      amplitude: AMP
    }));
    yCenters.push(top + slot * (i + 0.5));
  }
}

function draw() {
  background(245);
  const t = millis() / 3600;

  drawHeader();
  drawDividers();
  drawRows(t);
  drawFooter();
}

function drawHeader() {
  noStroke();
  textFont('Oswald');
  textStyle(NORMAL);
  textAlign(LEFT, BASELINE);

  fill(20);
  textSize(30);
  text('IT IS ONE WAVE AT FIVE FREQUENCIES.', M, 130);

  textFont('IBM Plex Mono');
  textSize(10.5);
  fill(140);
  text('wave: ' + WAVE_NAME + '   \u00B7   same t   \u00B7   same amplitude   \u00B7   frequency rises', M, 158);
}

function drawDividers() {
  stroke(225);
  strokeWeight(1);
  for (let i = 1; i < FREQS.length; i++) {
    const yLine = (yCenters[i - 1] + yCenters[i]) / 2;
    line(M, yLine, W - M, yLine);
  }
}

function drawRows(t) {
  for (let i = 0; i < FREQS.length; i++) {
    const y0 = yCenters[i];
    const s  = samplers[i];

    noFill();
    stroke(0);
    strokeWeight(4);
    beginShape();
    for (let x = M; x <= W - M; x += 2) {
      const u = (x - M) * X_SCALE;
      vertex(x, y0 + s.sample(u, t));
    }
    endShape();

    noStroke();
    fill(120);
    textFont('IBM Plex Mono');
    textSize(11);
    textAlign(LEFT, CENTER);
    text('f = ' + nf(FREQS[i], 1, 2), 36, y0);

    if (FREQS[i] === 1.0) {
      fill(160);
      textAlign(RIGHT, CENTER);
      textSize(9.5);
      text('default', W - 36, y0);
    }
  }
}

function drawFooter() {
  if (window.__P5WAVES_STAGE_ONLY__) return;
  noStroke();

  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT, BASELINE);
  fill(90, 90, 90, 240);
  text('five frequencies', M, 1020);

  textFont('IBM Plex Mono');
  textSize(10);
  fill(168);
  text('mountain peaks   \u00B7   frequency 0.25 \u2192 4.00   \u00B7   2026-04-23', M, 1040);

  textFont('IBM Plex Mono');
  textSize(20);
  textAlign(RIGHT, BASELINE);
  fill(168);
  text('p5.waves', W - M, 1020);
}
