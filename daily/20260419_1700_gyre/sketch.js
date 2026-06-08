/*
  FEELING         : gyre — five nested currents, each on its own clock
  WAVE LOGIC      : chorus of five radial rings, distinct underused formulas
                    inner → outer:
                      1. smooth solid sine      (calm core, slowest)
                      2. stepped sine           (terraced)
                      3. mountain peaks         (shift active, slow evolution)
                      4. fuzzy pulse            (nervous modulo grain)
                      5. morph [batman, round linked sine]  (spiked ⇄ rounded)
                    Shift on ring 3 quietly cycles its wave every 6s.
                    Morph on ring 5 animates its blend via an uncorrelated sine.
  TIME LOGIC      : five uncorrelated divisors — ms/1400, ms/900, ms/620,
                    ms/380, ms/200. Slow core, hyper-fast rim. ms/1000 banned.
                    Morph mix uses ms/1300 so outer shape never locks to its clock.
  STRUCTURAL MOVE : five concentric wave-rings at base radii 80..320 centred on
                    (450,450). r(angle) = base + sampler.sample(angle · lobes, t).
                    Prime lobe counts (3,5,7,11,13) prevent harmonic alignment.
                    Reference: outer circle at r=350 with 60 tick marks, a
                    small centre cross — the silent armature the gyres ignore.
*/

const M  = 100;
const CX = 450;
const CY = 450;
const TITLE = 'gyre';
const CHORUS_LABEL = 'chorus · smooth solid sine · stepped sine · mountain peaks · fuzzy pulse · batman ⇄ round linked sine';

const RINGS = [
  { r: 80,  wave: 'smooth solid sine',             amp: 8,  lobes: 3,  seed: 1, div: 1400, weight: 0.8, shade: 70,  shift: false },
  { r: 140, wave: 'stepped sine',                  amp: 14, lobes: 5,  seed: 2, div: 900,  weight: 0.9, shade: 85,  shift: false },
  { r: 200, wave: 'mountain peaks',                amp: 18, lobes: 7,  seed: 3, div: 620,  weight: 1.0, shade: 100, shift: true  },
  { r: 260, wave: 'fuzzy pulse',                   amp: 22, lobes: 11, seed: 4, div: 380,  weight: 1.1, shade: 120, shift: false },
  { r: 320, wave: ['batman', 'round linked sine'], amp: 26, lobes: 13, seed: 5, div: 200,  weight: 1.2, shade: 140, shift: false }
];

let samplers;

async function setup() {
  const cnv = createCanvas(1080, 1080);
  cnv.parent('sketch');
  pixelDensity(2);
  await document.fonts.ready;

  samplers = RINGS.map(ring => Waves.createSampler({
    wave: ring.wave,
    range: [-ring.amp, ring.amp],
    frequency: 1,
    seed: ring.seed,
    phase: ring.seed * 0.23,
    shift: !!ring.shift,
    shiftInterval: 6,
    shiftDuration: 2
  }));
}

function __p5wSourceDraw() {
  background(245);
  drawReference();

  // outer → inner so inner sits on top
  for (let i = RINGS.length - 1; i >= 0; i--) {
    drawRing(i);
  }

  drawLabels();
}

function drawReference() {
  noFill();
  stroke(218, 214, 210);
  strokeWeight(0.5);
  circle(CX, CY, 700);

  for (let k = 0; k < 60; k++) {
    const a = (k / 60) * TWO_PI - HALF_PI;
    const inner = k % 5 === 0 ? 342 : 346;
    const outer = 354;
    line(
      CX + inner * cos(a), CY + inner * sin(a),
      CX + outer * cos(a), CY + outer * sin(a)
    );
  }

  stroke(185);
  strokeWeight(0.7);
  line(CX - 7, CY, CX + 7, CY);
  line(CX, CY - 7, CX, CY + 7);
}

function drawRing(i) {
  const ring = RINGS[i];
  const s = samplers[i];
  const t = millis() / ring.div;

  const isMorph = Array.isArray(ring.wave);
  const morphMix = isMorph
    ? (sin(millis() / 1300 + i * 0.7) + 1) * 0.5
    : 0;

  noFill();
  stroke(ring.shade);
  strokeWeight(ring.weight);

  const STEPS = 480;
  beginShape();
  for (let k = 0; k <= STEPS; k++) {
    const a = (k / STEPS) * TWO_PI;
    const input = (a / TWO_PI) * ring.lobes;
    const offset = isMorph
      ? s.sample(input, t, morphMix)
      : s.sample(input, t);
    const rad = ring.r + offset;
    vertex(CX + rad * cos(a), CY + rad * sin(a));
  }
  endShape(CLOSE);
}

function drawLabels() {
  noStroke();

  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT, BASELINE);
  fill('rgba(90,90,90,0.95)');
  text(TITLE, M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text(CHORUS_LABEL, M, 870);

  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', 900 - M, 854);
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
