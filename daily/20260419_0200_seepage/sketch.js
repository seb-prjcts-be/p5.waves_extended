/*
FEELING: seepage — a contained signal leaking past its right-hand boundary.

WAVE LOGIC: fuzzy pulse carries the primary grain (modulo-based, irregular,
restless). Mountain peaks shapes a sharp vertical amplitude envelope across
the stack. One accent slice morphs between the two, letting the geometric
spikes bleed into the grain and back.

TIME LOGIC: two speeds only.
  tSlow = t / 2.8   — slow phase drift, the structural breath
  tMed  = t / 0.9   — the accent line's morph oscillator
millis()/1000 is never used.

STRUCTURAL MOVE: 55 topographic horizontal slices stacked in a vertical
band. Local amplitude grows left→right (≈1 px at the left safe margin,
≈32+ px past the right safe margin) — so the stack is quiet and contained
on the left and ruptures outward on the right. The right-margin breach is
intentional: that is the feeling the concept demands.

Reference geometry: dashed vertical line at the left margin (containment),
solid vertical line at the right margin (the threshold being breached),
tick marks along the right line (a seismic scale).
*/

const W = 900;
const H = 900;
const M = 100;

const SLICES   = 55;
const TOP      = 180;
const BOT      = 780;
const ACCENT_I = 18;

let fuzzy, envelope, accent;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(2);
  await document.fonts.ready;

  fuzzy = Waves.createSampler({
    wave: 'fuzzy pulse',
    range: [-1, 1],
    frequency: 1.05
  });

  envelope = Waves.createSampler({
    wave: 'mountain peaks',
    range: [0.22, 1]
  });

  accent = Waves.createSampler({
    wave: ['mountain peaks', 'fuzzy pulse'],
    range: [-1, 1],
    frequency: 0.85
  });
}

function __p5wSourceDraw() {
  background(245);

  const t = millis() / 1000;
  const tSlow = t / 2.8;
  const tMed  = t / 0.9;

  drawReferenceGeometry();

  for (let s = 0; s < SLICES; s++) {
    drawSlice(s, tSlow, tMed);
  }

  drawRightTicks();
  drawLabels();
}

function drawReferenceGeometry() {
  push();
  stroke(175, 70);
  strokeWeight(0.6);
  const d = 6;
  for (let y = 160; y <= 800; y += d * 2) {
    line(M, y, M, y + d);
  }
  stroke(175, 115);
  strokeWeight(0.6);
  line(W - M, 160, W - M, 800);
  pop();
}

function drawSlice(s, tSlow, tMed) {
  const yBase = map(s, 0, SLICES - 1, TOP, BOT);
  const isAccent = s === ACCENT_I;

  const envBase = envelope.sample(s * 0.11 + tSlow * 0.3, tSlow);
  const phaseSlice = s * 0.17 + tSlow;

  if (isAccent) {
    stroke(184, 68, 46, 232);
    strokeWeight(1.35);
  } else {
    const grey = 28 + (s % 7) * 5;
    const alph = 150 + envBase * 75;
    stroke(grey, alph);
    strokeWeight(0.55 + envBase * 0.85);
  }
  noFill();

  beginShape();
  for (let x = M; x <= W; x += 2) {
    const leakT = (x - M) / (W - M - M);
    const growth = max(0, leakT);
    const localAmp = lerp(1.1, 32, growth * growth);

    let v;
    if (isAccent) {
      const mx = 0.5 + 0.5 * sin(tMed * 0.55);
      v = accent.sample(x * 0.017 + phaseSlice, tSlow * 1.3, mx);
    } else {
      v = fuzzy.sample(x * 0.022 + phaseSlice, tSlow + s * 0.005);
    }

    const yOff = v * localAmp * envBase;
    vertex(x, yBase + yOff);
  }
  endShape();
}

function drawRightTicks() {
  push();
  stroke(150, 140);
  strokeWeight(0.5);
  for (let ty = 180; ty <= 780; ty += 50) {
    line(W - M - 4, ty, W - M + 4, ty);
  }
  pop();
}

function drawLabels() {
  noStroke();

  fill(90, 90, 90, 242);
  textFont('Oswald');
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('seepage', M, 854);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  text('fuzzy pulse \u00d7 mountain peaks', M, 870);

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
