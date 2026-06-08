// five_windows — Daily p5.waves 2026-04-22
// ============================================================
// 1.  MODE: F — Formal.
// 1a. FORMAL QUESTION:
//     What does one wave ('round linked sine') look like when
//     five stacked horizontal lines each sample it through a
//     different input domain — row 1 spans ±π (one period),
//     row 5 spans ±8π (eight periods) — with a shared time
//     phase that drifts slowly? Observable between rows: the
//     same formula reads as a slow breath at the top and a
//     dense ripple at the bottom; the only variable across
//     rows is the input domain, nothing else.
// 2.  GESTURE: ZOOM — the input window opens row by row down
//     the stack. Each row is a different "zoom level" into the
//     same formula.
// 3.  REFERENCE ANCHOR: Bridget Riley — Current (1964) + Fall
//     (1963). Parallel-line field where rhythm shifts
//     continuously across the picture plane.
// 4.  SEB ANCHOR: p5.wavesX100 — specimen rows. This piece is
//     a single specimen row expanded: one wave, held still,
//     viewed through five input windows instead of one.
//     Also in conversation with range_to_radius (2026-04-22
//     20:10) — that sketch clamped wave OUTPUT to [4,32];
//     this one widens wave INPUT from ±π to ±8π. Output vs
//     input, paired.
// 5.  LIBRARY MOVE: custom input domain via map() remapping.
//     x on the canvas is mapped to u ∈ [-N·π, N·π] before being
//     passed to Waves.wave(u, …). Same library call, same
//     wave name, same amplitude — only the input range
//     changes per row. This is the exact move
//     examples/08_triangle_domain introduces, promoted at
//     specimen scale.
// 6.  COLOR COMMITMENT: riso duotone — cream paper + one deep
//     navy ink. No second color, no greys beyond faint baselines.
// 7.  RISK: at row 5 (±8π), the line can read as a crowded
//     wiggle that loses "wave" character at thumbnail size.
//     Mitigation: heavy stroke weight (6 px), reduced amplitude
//     so each period has headroom, a DEFAULT-domain reference
//     specimen in the top margin so the viewer can anchor the
//     widening against what ±π normally looks like.
// 8.  MATERIAL: time drifts at +0.025 per frame at 30 fps.
//     At row 1 (±π window), 1 radian of phase shifts the line
//     about 123 px; at row 5 (±8π window), the same 1 radian
//     shifts it about 15 px. This disparity IS the piece —
//     top row whooshes, bottom row crawls, both driven by the
//     same t. Observable in a 5-second capture.

const W = 900, H = 900;
const M = 90;                         // horizontal margin
const TOP_MARGIN = 90;                // top margin (default-domain specimen)
const BOTTOM = 110;                   // bottom margin (labels)
const ROW_LABEL_W = 64;               // left gutter for ±Nπ label
const N_ROWS = 5;
const DOMAINS = [1, 2, 3, 5, 8];      // window = [-N·π, N·π]

const PAPER = 245;
const INK = [26, 39, 68];             // deep navy

const WAVE = 'round linked sine';
const AMP  = 48;
const STROKE_W = 6;
const STEP = 2;                       // sample pitch in px
const SPEED = 0.025;                  // t advance per frame

let t = 0;
let oswald, mono;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(2);

  await document.fonts.ready;
  oswald = 'Oswald';
  mono   = 'IBM Plex Mono';

  frameRate(30);
  strokeJoin(ROUND);
  strokeCap(ROUND);
}

function __p5wSourceDraw() {
  background(PAPER);

  drawSpecimen();     // top: default-domain ±π reference line
  drawWindowRows();   // middle: the five domain windows
  drawLabels();       // bottom: title + caption + credit

  t += SPEED;
}

// ── top margin: DEFAULT DOMAIN reference specimen ──────────────
function drawSpecimen() {
  const x0 = M + ROW_LABEL_W;
  const x1 = W - M;
  const yc = TOP_MARGIN -28;

  noStroke();
  fill(145);
  textFont(mono);
  textSize(10.5);
  textAlign(LEFT, BASELINE);
  text('DEFAULT DOMAIN  \u00b1\u03c0', M, TOP_MARGIN -48);

  // thin reference line — small amplitude, thin stroke
  noFill();
  stroke(140);
  strokeWeight(1.2);
  beginShape();
  for (let x = x0; x <= x1; x += STEP) {
    const u = map(x, x0, x1, -PI, PI) + t;
    const y = Waves.wave(u, { wave: WAVE, amplitude: 10 });
    vertex(x, yc + y);
  }
  endShape();
}

// ── content: five rows, widening input domain ──────────────────
function drawWindowRows() {
  const rowH = (H - TOP_MARGIN -BOTTOM) / N_ROWS;   // 140 px per row
  const x0 = M + ROW_LABEL_W;
  const x1 = W - M;

  for (let r = 0; r < N_ROWS; r++) {
    const N = DOMAINS[r];
    const yc = TOP_MARGIN +rowH * (r + 0.5);

    // faint baseline
    stroke(INK[0], INK[1], INK[2], 28);
    strokeWeight(0.5);
    line(x0, yc, x1, yc);

    // row label: ±Nπ
    noStroke();
    fill(INK[0], INK[1], INK[2], 195);
    textFont(mono);
    textSize(13);
    textAlign(LEFT, CENTER);
    text('\u00b1' + N + '\u03c0', M, yc);

    // the wave line — input domain = [-N·π, N·π]
    noFill();
    stroke(INK[0], INK[1], INK[2]);
    strokeWeight(STROKE_W);
    beginShape();
    for (let x = x0; x <= x1; x += STEP) {
      const u = map(x, x0, x1, -N * PI, N * PI) + t;
      const y = Waves.wave(u, { wave: WAVE, amplitude: AMP });
      vertex(x, yc + y);
    }
    endShape();
  }
}

// ── bottom margin: standard Daily p5.waves labels ──────────────
function drawLabels() {
  if (window.__P5WAVES_STAGE_ONLY__) return;
  noStroke();

  // title
  fill(90);
  textFont(oswald);
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('five windows', M, H - 46);

  // caption
  fill(150);
  textFont(mono);
  textSize(9.5);
  text('same wave (round linked sine) · input domain widens row by row · \u00b1\u03c0, \u00b12\u03c0, \u00b13\u03c0, \u00b15\u03c0, \u00b18\u03c0', M, H - 30);

  // p5.waves credit, right
  fill(150);
  textFont(mono);
  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', W - M, H - 46);
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
