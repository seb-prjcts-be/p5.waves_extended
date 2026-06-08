/*
  FEELING         — ballast (pressure as held weight; compression that endures, not collapse).
  WAVE LOGIC      — mountain peaks: compressed vertical forms read as stacked load.
                    stepped sine (shift): quantized horizontal tremor, strain-gauge jitter.
                    batman ⇄ fuzzy pulse (morph): one critical column at the fracture point.
  TIME LOGIC      — columns:   millis() / 2800  — slow cinematic breath under weight.
                    tremor:    millis() /  260  — hyper-fast surface instability (~11x columns).
                    morph mix: sin(millis() * 0.00045) + 1 / 2 — ~28 s cycle between two shapes.
  STRUCTURAL MOVE — 36 vertical sample-columns with amplitude/frequency cones peaking just
                    left of center (asymmetric pressure point). A red critical column at
                    0.42 W holds the morphing batman↔fuzzy pulse line. Six thin horizontal
                    tremor ticks shiver across at fixed y-positions. Hard lower baseline
                    and faint vertical mid-line fix the compression as real geometry.
*/

const W = 1080;
const H = 1080;
const M = 100;
const COLS = 36;
const SAMPLES = 160;
const STEP = 0.05;
const BASELINE_Y = H - 260;
const CRITICAL_X = W * 0.42;

let columns = [];
let tremor;
let critical;

async function setup() {
  createCanvas(W, H);
  await document.fonts.ready;
  pixelDensity(1);

  for (let i = 0; i < COLS; i++) {
    const centerDist = abs(i - (COLS - 1) / 2) / ((COLS - 1) / 2);
    const amp = lerp(28, 135, pow(1 - centerDist, 2.1));
    const freq = lerp(0.9, 1.4, 1 - centerDist);
    columns.push({
      sampler: Waves.createSampler({
        wave: 'mountain peaks',
        seed: i + 7,
        range: [-amp, amp],
        frequency: freq
      }),
      x: map(i, 0, COLS - 1, M, W - M),
      phase: i * 0.41
    });
  }

  tremor = Waves.createSampler({
    wave: 'stepped sine',
    shift: true,
    shiftInterval: 3.2,
    shiftDuration: 1.4,
    range: [-7, 7],
    frequency: 1.8
  });

  critical = Waves.createSampler({
    wave: ['batman', 'fuzzy pulse'],
    range: [-165, 165],
    frequency: 1.1
  });
}

function draw() {
  background(245);
  const tSlow = millis() / 2800;
  const tFast = millis() / 260;

  // Reference geometry — faint vertical mid-line and hard lower baseline
  stroke(212);
  strokeWeight(0.5);
  line(W / 2, M, W / 2, BASELINE_Y);

  stroke(190);
  strokeWeight(0.7);
  line(M, BASELINE_Y, W - M, BASELINE_Y);

  // Primary: 36 mountain-peaks columns
  strokeWeight(0.8);
  stroke(25, 180);
  noFill();
  for (let i = 0; i < COLS; i++) {
    const c = columns[i];
    beginShape();
    for (let s = 0; s <= SAMPLES; s++) {
      const yy = map(s, 0, SAMPLES, M, BASELINE_Y);
      const v = c.sampler.sample(s * STEP, tSlow + c.phase);
      vertex(c.x + v, yy);
    }
    endShape();
  }

  // Critical column — muted red, morphing batman ⇄ fuzzy pulse
  const mixVal = (sin(millis() * 0.00045) + 1) / 2;
  stroke(158, 52, 48, 220);
  strokeWeight(1.3);
  noFill();
  beginShape();
  for (let s = 0; s <= SAMPLES; s++) {
    const yy = map(s, 0, SAMPLES, M, BASELINE_Y);
    const v = critical.sample(s * STEP, tSlow * 0.55, mixVal);
    vertex(CRITICAL_X + v, yy);
  }
  endShape();

  // Tremor ticks — six thin horizontal stepped-sine shivers
  const yMarks = [M + 46, M + 214, H / 2 - 90, H / 2 + 86, BASELINE_Y - 72, BASELINE_Y - 24];
  stroke(55, 150);
  strokeWeight(0.55);
  for (let k = 0; k < yMarks.length; k++) {
    const yy = yMarks[k];
    beginShape();
    for (let xx = M; xx <= W - M; xx += 4) {
      const v = tremor.sample(xx * 0.04 + k * 2.7, tFast);
      vertex(xx, yy + v);
    }
    endShape();
  }

  // Critical-point marker at baseline
  noStroke();
  fill(158, 52, 48, 225);
  rectMode(CENTER);
  rect(CRITICAL_X, BASELINE_Y, 5, 5);

  drawLabels();
}

function drawLabels() {
  noStroke();

  fill(90, 90, 90, 242);
  textFont('Oswald');
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('Ballast', M, 854);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  const tname = (tremor && tremor.waveName) ? tremor.waveName : 'stepped sine';
  text('mountain peaks  ·  ' + tname + '  ·  batman \u21C4 fuzzy pulse', M, 870);

  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', W - M, 854);
}
