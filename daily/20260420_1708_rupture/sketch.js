/*
  rupture

  FEELING        — rupture. The moment structure gives way without announcing itself.
  WAVE LOGIC     — bald patch ↔ stepped sine, morphed. Bald patch drops the letters
                   to silence (flat baseline); stepped sine quantises them into
                   discrete steps. The morph oscillates between these two failure
                   modes. Fuzzy pulse drives the hyper-fast horizontal erasure —
                   irregular bright bars that slice the word.
  TIME LOGIC     — multi-speed. /2600 for letter displacement (slow cinematic drift),
                   /230 for scan erasure (hyper-fast glitch), /5400 for the morph mix
                   itself (ultra-slow breath between failure types).
  STRUCTURAL MOVE — typographic, colliding systems. A single word at scale, each
                   letter independently displaced by the wave, over-written by
                   horizontal scan-erasure at a radically faster tempo. Below,
                   a quiet tick meter logs the wave's current state per letter,
                   like a seismograph for the word.
*/

const WORD = 'RUPTURE';
const M = 100;
let titleSampler, scanSampler, textureSampler;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  pixelDensity(2);
  frameRate(30);

  titleSampler = Waves.createSampler({
    wave: ['bald patch', 'stepped sine'],
    range: [-52, 52],
    frequency: 0.95
  });

  scanSampler = Waves.createSampler({
    wave: 'fuzzy pulse',
    range: [0, 1],
    frequency: 1.8,
    unpredictability: 0.35,
    mode: 'wild'
  });

  textureSampler = Waves.createSampler({
    wave: 'grow random',
    range: [0, 1],
    frequency: 0.9,
    seed: 7
  });
}

function draw() {
  background(245);

  const tSlow = millis() / 2600;
  const tFast = millis() / 230;
  const tBreath = millis() / 5400;
  const mix = (sin(tBreath) + 1) / 2;

  const baseY = 395;

  // --- measure letters -----------------------------------------------------
  textFont('Oswald');
  textStyle(BOLD);
  textSize(210);
  const widths = [];
  let totalW = 0;
  for (let i = 0; i < WORD.length; i++) {
    const w = textWidth(WORD[i]);
    widths.push(w);
    totalW += w;
  }
  const startX = (width - totalW) / 2;

  // --- per-letter displacement --------------------------------------------
  const dys = [];
  for (let i = 0; i < WORD.length; i++) {
    dys.push(titleSampler.sample(i * 0.85, tSlow, mix));
  }

  // --- reference baseline --------------------------------------------------
  stroke(215);
  strokeWeight(1);
  line(M, baseY, width - M, baseY);

  // faint vertical registration marks (reference geometry)
  stroke(225);
  let px = startX;
  for (let i = 0; i <= WORD.length; i++) {
    line(px, baseY - 130, px, baseY + 130);
    if (i < WORD.length) px += widths[i];
  }

  // --- letters -------------------------------------------------------------
  noStroke();
  fill(22);
  textAlign(LEFT, CENTER);
  let xPen = startX;
  for (let i = 0; i < WORD.length; i++) {
    text(WORD[i], xPen, baseY + dys[i]);
    xPen += widths[i];
  }

  // --- bright scan erasure (fast) -----------------------------------------
  strokeWeight(1.8);
  for (let y = baseY - 160; y < baseY + 160; y += 2) {
    const s = scanSampler.sample(y * 0.04, tFast);
    if (s > 0.52) {
      const a = map(s, 0.52, 1, 130, 245);
      stroke(245, a);
      line(startX - 18, y, startX + totalW + 18, y);
    }
  }

  // --- dark fine texture lines (slow, subtle) -----------------------------
  strokeWeight(0.5);
  for (let y = baseY - 160; y < baseY + 160; y += 4) {
    const s = textureSampler.sample(y * 0.013, tSlow * 0.7);
    if (s > 0.68) {
      stroke(60, 32);
      line(startX - 24, y, startX + totalW + 24, y);
    }
  }

  // --- tick meter (wave state per letter) ---------------------------------
  const trackY = baseY + 240;
  stroke(220);
  strokeWeight(1);
  line(startX - 10, trackY, startX + totalW + 10, trackY);

  stroke(90);
  strokeWeight(1.2);
  xPen = startX;
  for (let i = 0; i < WORD.length; i++) {
    const cx = xPen + widths[i] / 2;
    const magn = abs(dys[i]);
    const tickLen = map(magn, 0, 52, 2, 26);
    const dir = dys[i] < 0 ? -1 : 1;
    line(cx, trackY, cx, trackY - tickLen * dir);
    // small dot at tip
    noStroke();
    fill(90);
    circle(cx, trackY - tickLen * dir, 2.4);
    stroke(90);
    xPen += widths[i];
  }

  // --- data readout --------------------------------------------------------
  noStroke();
  textFont('IBM Plex Mono');
  textStyle(NORMAL);
  textSize(9);
  fill(130);
  textAlign(LEFT, TOP);
  const readout = WORD.split('').map((ch, i) =>
    `${ch}:${nf(dys[i], 2, 1)}`
  ).join('  ');
  text(readout, startX - 10, trackY + 14);

  textAlign(RIGHT, TOP);
  text(`morph mix ${nf(mix, 1, 2)}`, startX + totalW + 10, trackY + 14);

  // --- small marker: "rupture index" --------------------------------------
  // count of active bright scan rows (rough proxy for how fractured it is)
  let active = 0;
  for (let y = baseY - 160; y < baseY + 160; y += 8) {
    if (scanSampler.sample(y * 0.04, tFast) > 0.52) active++;
  }
  textAlign(LEFT, TOP);
  fill(140);
  text(`rupture index  ${nf(active, 2)}`, startX - 10, trackY + 30);

  // --- labels --------------------------------------------------------------
  drawLabels();
}

function drawLabels() {
  noStroke();

  // bottom-left title
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT, BASELINE);
  fill('rgba(90,90,90,0.95)');
  text('rupture', M, 1020);

  // active wave name
  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text('bald patch ↔ stepped sine  /  fuzzy pulse', M, 1040);

  // bottom-right signature
  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', 1080 - M, 1020);
}
