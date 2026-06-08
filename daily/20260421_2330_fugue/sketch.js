/*
  fugue — 2026-04-21 · 23:30

  FEELING      : fugue — two voices pursuing each other through
                 the same space. Counterpoint, not harmony; the
                 voices agree to occupy the same air and keep
                 their own tempo. What the eye finds at the
                 crossings is the interference of two minds
                 thinking in parallel.

  WAVE LOGIC   : duo in collision — two independent wave systems
                 superposed on the same field.
                 VOICE A (horizontal) : `round linked sine` —
                   layered, smooth curvature. Medium, flowing.
                   This is the "melody"; drawn as a stack of
                   horizontal wave lines that drift in y.
                 VOICE B (vertical)   : `batman` — special
                   twin-peak form, iconic, jagged. Faster,
                   nervous. This is the "countermelody"; drawn
                   as a stack of vertical wave lines that drift
                   in x.
                 INTERSECTIONS        : at each of the 26×26
                   grid crossings, a small dot is placed whose
                   radius and ink are driven by the *sum* of the
                   two voices at that point — the crossings
                   brighten where the two voices agree, flatten
                   where they cancel. A slow envelope breathes
                   across the intersection field so the whole
                   counterpoint rises and falls as one body.

  TIME LOGIC   : voiceA = millis() / 420    (fast  — melody)
                 voiceB = millis() / 240    (hyper-fast — counter)
                 env    = millis() / 3200   (slow — crossing bloom)
                 NOTE: millis()/1000 is not used.

  STRUCTURAL   : colliding systems. Two stacked wave fields,
                 one horizontal + one vertical, share the same
                 inner 880×880 area. The two systems never
                 synchronise — each is sampled from its own
                 wave formula at its own tempo. At every lattice
                 crossing (26×26 = 676 points), a mark is placed
                 whose size reports how the two voices interfere
                 at that instant. Reference geometry — a single
                 mid-canvas cross in dashed rule — fixes the
                 silent axis both voices weave around.
*/

const W = 1080;
const H = 1080;
const M = 100;

const INNER = W - 2 * M;      // 880
const COUNT = 26;             // lines per voice
const STEP  = INNER / (COUNT - 1);  // ~35.2 px

const AMP_H = 14;             // vertical displacement of horizontal voice lines
const AMP_V = 14;             // horizontal displacement of vertical voice lines

let voiceA, voiceB;

async function setup() {
  createCanvas(W, H);
  pixelDensity(2);
  await document.fonts.ready;

  voiceA = Waves.createSampler({
    wave: 'round linked sine',
    range: [-AMP_H, AMP_H],
    seed: 11,
    frequency: 1.0,
  });
  voiceB = Waves.createSampler({
    wave: 'batman',
    range: [-AMP_V, AMP_V],
    seed: 23,
    frequency: 1.0,
  });
}

function draw() {
  background(245);

  const tA   = millis() / 420;
  const tB   = millis() / 240;
  const tEnv = (Math.sin(millis() / 3200) + 1) * 0.5;  // 0..1

  drawReferenceCross();
  drawVoiceA(tA);
  drawVoiceB(tB);
  drawIntersections(tA, tB, tEnv);
  drawLabels(tEnv);
}

/* ── silent reference axes ────────────────────────────── */
function drawReferenceCross() {
  stroke(168, 168, 168, 110);
  strokeWeight(1);
  dashedLine(M, H / 2, W - M, H / 2, 4, 6);
  dashedLine(W / 2, M, W / 2, H - M, 4, 6);
}

function dashedLine(x1, y1, x2, y2, dash, gap) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len;
  let d = 0;
  while (d < len) {
    const d2 = Math.min(d + dash, len);
    line(x1 + ux * d, y1 + uy * d, x1 + ux * d2, y1 + uy * d2);
    d = d2 + gap;
  }
}

/* ── VOICE A · horizontal melody ──────────────────────── */
function drawVoiceA(t) {
  stroke(30, 30, 38, 82);
  strokeWeight(0.9);
  noFill();

  for (let r = 0; r < COUNT; r++) {
    const y0 = M + r * STEP;
    const phase = r * 0.21;
    beginShape();
    for (let x = M; x <= W - M; x += 3) {
      const u = (x - M) * 0.012;
      const dy = voiceA.sample(u + phase, t);
      vertex(x, y0 + dy);
    }
    endShape();
  }
}

/* ── VOICE B · vertical countermelody ─────────────────── */
function drawVoiceB(t) {
  stroke(92, 44, 32, 78);
  strokeWeight(0.9);
  noFill();

  for (let c = 0; c < COUNT; c++) {
    const x0 = M + c * STEP;
    const phase = c * 0.17;
    beginShape();
    for (let y = M; y <= H - M; y += 3) {
      const u = (y - M) * 0.014;
      const dx = voiceB.sample(u + phase, t);
      vertex(x0 + dx, y);
    }
    endShape();
  }
}

/* ── intersections · the counterpoint itself ──────────── */
function drawIntersections(tA, tB, tEnv) {
  noStroke();

  for (let r = 0; r < COUNT; r++) {
    const y0 = M + r * STEP;
    const uR = (y0 - M) * 0.014 + r * 0.17;

    for (let c = 0; c < COUNT; c++) {
      const x0 = M + c * STEP;
      const uC = (x0 - M) * 0.012 + c * 0.21;

      // Voice A evaluated at this column's x
      const aVal = voiceA.sample(uC, tA);
      // Voice B evaluated at this row's y
      const bVal = voiceB.sample(uR, tB);

      // interference: sum normalised to 0..1
      const sum = (aVal + bVal);
      const mag = Math.min(1, Math.abs(sum) / (AMP_H + AMP_V));

      // envelope bloom so the field breathes
      const bloom = 0.35 + 0.65 * tEnv;

      const radius = 1.2 + 4.2 * mag * bloom;
      const alpha  = 40 + 180 * mag * bloom;

      // tint depends on which voice dominates
      if (sum >= 0) {
        fill(26, 28, 34, alpha);
      } else {
        fill(92, 44, 32, alpha * 0.9);
      }
      circle(x0, y0, radius * 2);
    }
  }
}

/* ── labels ───────────────────────────────────────────── */
function drawLabels(tEnv) {
  noStroke();

  // title (bottom-left)
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 242);
  textAlign(LEFT, BASELINE);
  text('fugue', M, 854);

  // active waves (below title)
  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text('round linked sine  ×  batman', M, 870);

  // right label
  textSize(19);
  fill(168);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', W - M, 854);

  // tiny counter-reading: envelope state
  textSize(9);
  fill(168);
  textAlign(LEFT, BASELINE);
  const pct = Math.round(tEnv * 100);
  text('env ' + String(pct).padStart(3, '0'), M, 886);
}
