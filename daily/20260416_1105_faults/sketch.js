/*
 * STRATA
 * Daily p5.waves sketch — 2026-04-16
 *
 * A geological cross-section from glacial surface to obsidian bedrock.
 * 13 strata are separated by 12 interior fault boundaries — each driven
 * by its own shift-enabled sampler. As the 34 wave families cycle,
 * boundaries ripple, plateau, fold, and fracture: sine anticlines give
 * way to square mesa layers, batman basins, noise turbulence, stepped
 * terraces, and smooth bumpy undulations.
 *
 * Shallower strata fold with higher amplitude and tighter frequency.
 * Deeper strata compress toward broader, lower-amplitude waves — a
 * nod to geological pressure at depth.
 *
 * Each fault line glows in a temperature gradient from glacial white
 * at surface to deep-magma pink at the base. The glow intensifies
 * mid-shift. Wave names are printed live as a stratigraphic legend.
 */

const N    = 13;                          // number of strata
const STEP = 3;                           // x resolution (px)
const COLS = Math.ceil(900 / STEP) + 1;  // number of x samples

// Stratum fill: k=1 (surface) → k=13 (bedrock), index = k-1
const LAYER_COLORS = [
  '#cce4f0',  //  1  glacial surface
  '#90c0dc',  //  2  ice sheet
  '#6494bc',  //  3  permafrost
  '#7a9868',  //  4  organic topsoil
  '#b09848',  //  5  loess / loam
  '#c87020',  //  6  red clay
  '#9c5010',  //  7  sandstone
  '#7a3a18',  //  8  deep sandstone
  '#582830',  //  9  shale
  '#3c1c2c',  // 10  iron mudstone
  '#28101e',  // 11  deep rock
  '#180a12',  // 12  granite
  '#0a0306',  // 13  bedrock / obsidian
];

// Depth labels shown at left margin
const LAYER_NAMES = [
  'GLACIAL', 'ICE', 'PERMAFROST', 'ORGANIC',
  'LOESS', 'CLAY', 'SANDSTONE', 'DEEP SAND',
  'SHALE', 'IRON', 'GRANITE', 'DEEP ROCK', 'BEDROCK',
];

// Fault-line glow colours for boundaries 1-12, index = k-1
const FAULT_COLORS = [
  '#f0f8ff',  //  1  white ice
  '#90d8f8',  //  2  glacial blue
  '#50a8e0',  //  3  melt blue
  '#60d870',  //  4  organic green
  '#e8c030',  //  5  mineral gold
  '#f07010',  //  6  rust orange
  '#e03818',  //  7  sandstone red
  '#c82818',  //  8  deep red
  '#e04858',  //  9  iron pink
  '#f83888',  // 10  hot mineral
  '#f828b8',  // 11  magma pink
  '#e040d8',  // 12  deep magma violet
];

let samplers   = [];   // N-1 = 12 interior boundary samplers
let boundaries = [];   // boundaries[k]: Float32Array of y at each column
let pg;                // off-screen buffer for stratum fills (perf)

function setup() {
  createCanvas(1080, 1080);
  textFont('monospace');

  // Build N-1 shift samplers for interior boundaries
  for (let k = 0; k < N - 1; k++) {
    const depth = k / (N - 2);  // 0 = surface, 1 = deepest interior
    samplers.push(Waves.createSampler({
      shift:         true,
      shiftInterval: 3.2 + k * 0.45,     // deeper = longer hold
      shiftDuration: 0.9 + k * 0.09,     // deeper = slower morph
      amplitude:     1
    }));
  }

  // Allocate boundary float arrays: indices 0 (top canvas) to N (bottom canvas)
  for (let k = 0; k <= N; k++) {
    boundaries.push(new Float32Array(COLS));
  }

  // Off-screen buffer for the filled layer polygons
  pg = createGraphics(900, 900);
  pg.noSmooth();
}

// Recompute all boundary y-values for the current time
function computeBoundaries(t) {
  boundaries[0].fill(0);    // canvas top
  boundaries[N].fill(910);  // canvas bottom (+10 to avoid gap)

  for (let k = 1; k < N; k++) {
    const si    = k - 1;                        // sampler index
    const depth = si / (N - 2);                 // 0 = shallow, 1 = deep
    // Shallower strata fold more dramatically
    const amp   = 38 * (1 - depth * 0.62);
    // Shallower strata have tighter spatial frequency
    const freq  = 0.006 - depth * 0.003;
    const baseY = k / N * 900;

    for (let col = 0; col < COLS; col++) {
      const disp = samplers[si].sample(col * STEP * freq, t) * amp;
      boundaries[k][col] = baseY + disp;
    }
  }
}

function __p5wSourceDraw() {
  const t = millis() / 1000;
  background(4, 2, 10);
  computeBoundaries(t);

  // ── Stratum fills (into off-screen buffer for performance) ──
  pg.clear();
  pg.noStroke();
  for (let k = 1; k <= N; k++) {
    pg.fill(LAYER_COLORS[k - 1]);
    pg.beginShape();
    for (let col = 0; col < COLS; col++) {
      pg.vertex(col * STEP, boundaries[k - 1][col]);
    }
    for (let col = COLS - 1; col >= 0; col--) {
      pg.vertex(col * STEP, boundaries[k][col]);
    }
    pg.endShape(CLOSE);
  }
  image(pg, 0, 0);

  // ── Depth labels at left margin ────────────────────────────
  textAlign(LEFT);
  for (let k = 1; k <= N; k++) {
    // vertical midpoint of the stratum at left edge
    const yTop = boundaries[k - 1][0];
    const yBot = boundaries[k][0];
    const yMid = (yTop + yBot) / 2;
    const layerH = yBot - yTop;
    if (layerH < 12) continue;  // skip if too thin to label
    fill(255, 255, 255, 35);
    textSize(constrain(layerH * 0.22, 6, 9));
    text(LAYER_NAMES[k - 1], 8, yMid + 3);
  }

  // ── Fault lines (glow + core + labels) ────────────────────
  for (let k = 1; k < N; k++) {
    const si = k - 1;
    const fc = color(FAULT_COLORS[si]);
    const r  = red(fc), g = green(fc), b = blue(fc);

    // Glow intensifies while shift is in progress
    const isShifting  = samplers[si].shifting;
    const glowAlpha   = isShifting ? 90 : 30;
    const coreAlpha   = isShifting ? 210 : 110;
    const glowWeight  = isShifting ? 7 : 4;

    // Wide soft glow
    stroke(r, g, b, glowAlpha);
    strokeWeight(glowWeight);
    noFill();
    beginShape();
    for (let col = 0; col < COLS; col++) {
      vertex(col * STEP, boundaries[k][col]);
    }
    endShape();

    // Bright core line
    stroke(r, g, b, coreAlpha);
    strokeWeight(1);
    beginShape();
    for (let col = 0; col < COLS; col++) {
      vertex(col * STEP, boundaries[k][col]);
    }
    endShape();

    // Wave name at right margin
    const labelY = boundaries[k][COLS - 1];
    noStroke();
    fill(r, g, b, isShifting ? 220 : 130);
    textAlign(RIGHT);
    textSize(8);
    text(samplers[si].waveName, 890, labelY - 4);

    // Small blinking dot when mid-shift
    if (isShifting) {
      const pulse = (sin(millis() * 0.012) + 1) * 0.5;
      fill(r, g, b, 150 + pulse * 100);
      circle(895, labelY, 4);
    }
  }

  // ── Title block ────────────────────────────────────────────
  noStroke();
  fill(200, 220, 240, 180);
  textAlign(LEFT);
  textSize(11);
  text('STRATA', 14, 18);
  textSize(7.5);
  fill(160, 190, 220, 80);
  text('p5.waves daily  ·  2026-04-16', 14, 29);
}


function draw() {
  push();
  scale(1080 / 900);
  try {
    __p5wSourceDraw();
  } finally {
    pop();
  }
}
