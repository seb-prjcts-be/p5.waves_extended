// ───────────────────────────────────────────────────────────────────────
// quartz_movement  — Daily p5.waves · 2026-04-21
//
// ABOUT          the inside of a cheap battery wall clock, where the
//                quartz-driven tick wants to be a sweep.
// GESTURE        pulse
// REFERENCE      Karel Martens oefeningen — restraint, printed-matter
// SEB ANCHOR     LIVE_P5_SIN+COS_SYSTEMS_DATA_Brain_Calming_Device_v03
//                (slow structural motion lineage).
// LIBRARY MOVE   morph — wave: ['stepped sine', 'round linked sine']
//                with animated mix, staggered per ring.
// COLOR          Risograph duotone, hand-picked:
//                  #FF2D87  fluo pink
//                  #1E3FAA  cobalt
//                Overprint via blendMode(MULTIPLY) on 245 — crossings
//                read as deep purple, the registration error on purpose.
// RISK           morph legibility inside a radial; mitigated by
//                letting mix=0 read as a stepped silhouette and mix=1
//                as a visibly beating line, and by shortening each
//                ring's rotation so the stutter is seen, not blurred.
// KNOBS          wave (morph), mix (per-ring + global), amplitude,
//                phase, t — five of eight.
//
// RESEARCH NOTES (verified this session, p5.waves v3.1.0):
//   · Waves.list() = 34 formulas. 'round linked sine' = sin(x*.1)*cos(x*1)*.5
//     — amplitude modulation (a beat), not jitter. Not a generic
//     "smoother sine".
//   · 'stepped sine' = ceil(sin(x*.1))*.25 — a pure two-level step.
//     The morph between these two is the clearest tick→sweep the
//     library can write.
//   · 'smooth step' / 'plasma' in the showcase examples do NOT exist
//     in v3.1.0 — do not invent.
// ───────────────────────────────────────────────────────────────────────

const W = 1080, H = 1080, M = 100;
const CX = W / 2, CY = H / 2;

const RINGS    = 12;
const R_MIN    = 150;
const R_MAX    = 400;
const SAMPLES  = 320;
const WOBBLE   = 14;
const PERIOD_S = 14;

const TITLE = 'quartz_movement';

const INK_PINK = '#FF2D87';
const INK_BLUE = '#1E3FAA';

async function setup() {
  const c = createCanvas(W, H);
  c.parent('stage');
  await document.fonts.ready;
  pixelDensity(2);
}

function draw() {
  background(245);

  const tt        = millis() / 1000;
  const globalMix = 0.5 + 0.5 * Math.sin(tt * (TAU / PERIOD_S));

  drawRings(tt, 0, 0);                // pink pass, clean register
  drawRings(tt, 2.4, 1.6);            // cobalt pass, intentionally offset
  drawHourMarks(tt);
  drawCenter(tt);
  drawLabels(globalMix);
}

function drawRings(tt, dx, dy) {
  const usePink = (dx === 0 && dy === 0);
  push();
    blendMode(MULTIPLY);
    noFill();
    stroke(usePink ? INK_PINK : INK_BLUE);
    strokeWeight(1.3);

    for (let i = 0; i < RINGS; i++) {
      const r0      = map(i, 0, RINGS - 1, R_MIN, R_MAX);
      const mixRing = 0.5 + 0.5 * Math.sin(tt * (TAU / PERIOD_S) - i * 0.42);
      const rot     = tt * (0.035 + i * 0.0012) * (usePink ? 1 : -1 * 0.97);

      beginShape();
      for (let s = 0; s <= SAMPLES; s++) {
        const a = (s / SAMPLES) * TAU + rot;
        const u = (s / SAMPLES) * 6 * TAU;

        const rOff = Waves.wave(u, {
          wave:      ['stepped sine', 'round linked sine'],
          mix:       mixRing,
          amplitude: WOBBLE,
          phase:     i * 0.45 + (usePink ? 0 : 0.12),
          t:         tt * 0.55
        });

        const r = r0 + rOff;
        vertex(CX + dx + r * Math.cos(a), CY + dy + r * Math.sin(a));
      }
      endShape(CLOSE);
    }
  pop();
}

function drawHourMarks(tt) {
  push();
    noStroke();
    fill(INK_BLUE);
    textFont('IBM Plex Mono');
    textStyle(NORMAL);
    textSize(11);
    textAlign(CENTER, CENTER);
    const labels = ['12', '3', '6', '9'];
    const positions = [
      [CX,           CY - R_MAX - 22],
      [CX + R_MAX + 22, CY],
      [CX,           CY + R_MAX + 22],
      [CX - R_MAX - 22, CY]
    ];
    for (let k = 0; k < 4; k++) {
      text(labels[k], positions[k][0], positions[k][1]);
    }
  pop();
}

function drawCenter(tt) {
  const pulse = 0.5 + 0.5 * Math.sin(tt * TAU / 2.1);
  push();
    blendMode(MULTIPLY);
    noStroke();
    fill(INK_BLUE);
    circle(CX, CY, 8);
    fill(INK_PINK);
    circle(CX + 1.5, CY + 1, 6 + pulse * 2);
  pop();
}

function drawLabels(globalMix) {
  const waveName = globalMix < 0.5 ? 'stepped sine' : 'round linked sine';
  const waveLabel = waveName + '  ·  mix ' + globalMix.toFixed(2);

  push();
    resetMatrix();
    blendMode(BLEND);
    noStroke();
    fill(0);
    textAlign(LEFT, BASELINE);
    textFont('Oswald');
    textStyle(NORMAL);
    textSize(26);
    text(TITLE, M, 1020);

    textFont('IBM Plex Mono');
    textSize(11);
    text(waveLabel, M, 1040);

    textAlign(RIGHT, BASELINE);
    textSize(22);
    textFont('Oswald');
    text('p5.waves', W - M, 1020);
  pop();
}
