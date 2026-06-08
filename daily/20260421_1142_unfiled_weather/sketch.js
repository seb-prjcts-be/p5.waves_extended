/* === PRIORITY DECLARATION ===
   ABOUT:    weather radar from a day no one remembers —
             an archive of a storm that was never filed.
   GESTURE:  mourn — rings drift slowly around a solid redaction.
   REFERENCE: Karel Martens oefeningen — restraint that surprises itself;
              diagram rigor, not decoration.
   COLOR:    Pantone specimen — International Klein Blue in multiple
             values on warm 245.
   RISK:     radar imagery can slip into weather-app chic; monochrome can
             tame itself. The redaction bar must feel like loss, not ornament.
   MATERIAL: chorus of p5.waves samplers, one per contour ring; sampled in
             polar with integer cycle counts so each ring closes cleanly.
             Slow phase drift via millis()/2800.
============================== */

const W = 1080;
const H = 1080;
const M = 100;
const CX = W / 2;
const CY = 470;

const IKB_DEEP = [0, 47, 167];
const IKB_PALE = [190, 205, 232];

const RINGS = 36;
const R_MIN = 28;
const R_MAX = 340;

const WAVE_CHOIR = [
  'mountain peaks', 'round linked sine', 'wobble sine',
  'fuzzy pulse', 'smooth solid sine', 'bumpy sine',
  'meta sine', 'valleys', 'triangle sine', 'ramp up sine',
  'half sine', 'sharp peaks', 'stepped sine'
];

let samplers = [];
let bumpCounts = [];
let redactedIndex;
let redactedStart;
let redactedSpan;
let activeWaveName = '';

async function setup() {
  createCanvas(W, H);
  pixelDensity(2);
  await document.fonts.ready;

  for (let i = 0; i < RINGS; i++) {
    const name = WAVE_CHOIR[i % WAVE_CHOIR.length];
    const ampHere = map(pow(i / (RINGS - 1), 0.85), 0, 1, 3, 20);
    samplers.push(Waves.createSampler({
      wave: name,
      seed: i * 11 + 5,
      amplitude: ampHere,
      frequency: 1
    }));
    bumpCounts.push(4 + (i % 5));
  }

  redactedIndex = floor(random(14, 25));
  redactedStart = random(TWO_PI);
  redactedSpan = radians(random(72, 108));
  activeWaveName = WAVE_CHOIR[redactedIndex % WAVE_CHOIR.length];

  noFill();
}

function draw() {
  background(245);
  const t = millis() / 2800;

  drawRings(t);
  drawRedaction();
  drawCrosshair();
  drawArchiveMark();
  drawLabels();
}

function drawRings(t) {
  noFill();
  const STEPS = 260;

  for (let i = 0; i < RINGS; i++) {
    const baseR = lerp(R_MIN, R_MAX, pow(i / (RINGS - 1), 0.72));
    const s = samplers[i];
    const bumps = bumpCounts[i];

    const fade = i / (RINGS - 1);
    const col = lerpColor(
      color(IKB_DEEP[0], IKB_DEEP[1], IKB_DEEP[2]),
      color(IKB_PALE[0], IKB_PALE[1], IKB_PALE[2]),
      pow(fade, 0.85)
    );
    col.setAlpha(map(fade, 0, 1, 235, 130));
    stroke(col);
    strokeWeight(map(fade, 0, 1, 1.1, 0.5));

    beginShape();
    for (let k = 0; k <= STEPS; k++) {
      const theta = (k / STEPS) * TWO_PI;
      const u = (k / STEPS) * bumps;
      const w = s.sample(u, t + i * 0.045);
      const r = baseR + w;
      vertex(CX + cos(theta) * r, CY + sin(theta) * r);
    }
    endShape(CLOSE);
  }
}

function drawRedaction() {
  const baseR = lerp(R_MIN, R_MAX, pow(redactedIndex / (RINGS - 1), 0.72));
  const half = 22;
  const a0 = redactedStart;
  const a1 = a0 + redactedSpan;

  push();
  fill(IKB_DEEP[0], IKB_DEEP[1], IKB_DEEP[2]);
  noStroke();
  beginShape();
  const STEPS = 160;
  for (let k = 0; k <= STEPS; k++) {
    const a = lerp(a0, a1, k / STEPS);
    const r = baseR + half;
    vertex(CX + cos(a) * r, CY + sin(a) * r);
  }
  for (let k = STEPS; k >= 0; k--) {
    const a = lerp(a0, a1, k / STEPS);
    const r = baseR - half;
    vertex(CX + cos(a) * r, CY + sin(a) * r);
  }
  endShape(CLOSE);
  pop();
}

function drawCrosshair() {
  push();
  stroke(IKB_DEEP[0], IKB_DEEP[1], IKB_DEEP[2]);
  strokeWeight(0.8);
  line(CX - 9, CY, CX + 9, CY);
  line(CX, CY - 9, CX, CY + 9);
  noFill();
  strokeWeight(0.5);
  circle(CX, CY, 5);
  pop();
}

function drawArchiveMark() {
  push();
  noStroke();
  fill(168);
  textFont('IBM Plex Mono');
  textSize(10);
  textAlign(LEFT, TOP);
  text('no. ——', M, M);
  pop();
}

function drawLabels() {
  push();
  textFont('Oswald');
  textSize(22);
  fill('rgba(90,90,90,0.95)');
  noStroke();
  textAlign(LEFT, BASELINE);
  text('unfiled weather', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text(activeWaveName, M, 870);

  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', W - M, 854);
  pop();
}
