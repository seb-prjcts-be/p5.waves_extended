// seven stages — Daily p5.waves 2026-04-22
// ============================================================
// 1.  MODE: F — Formal.
// 1a. FORMAL QUESTION:
//     What does a single wave-morph `wave: ['sine','square']`
//     look like when `mix` is NOT a sweeping gradient but a
//     FROZEN STEPPED LADDER across the picture plane —
//     seven vertical cells locked at mix = {0, 1/6, 2/6, 3/6,
//     4/6, 5/6, 1} — with time only driving phase (not mix),
//     so the viewer reads the morph as a stable taxonomy
//     strip that breathes in place? Observable between cells:
//     the discrete stages of wave-family interpolation —
//     cell 1 reads as pure sine, cell 7 reads as pure square,
//     cells 2-6 hold named positions on the route between.
// 2.  GESTURE: STEP — the mix axis steps left→right in seven
//     discrete stations. No sweep, no transition; each cell
//     is a held note in the morph.
// 3.  REFERENCE ANCHOR: Josef Albers, "Interaction of Color"
//     stepped-gradient plates + Karel Martens oefeningen —
//     the specimen chart as pedagogical artifact.
// 4.  SEB ANCHOR: p5.wavesX100 (specimen row methodology) +
//     yesterday's `five_windows` (2026-04-22 23:20). That
//     sketch was a taxonomy of INPUT DOMAIN (five horizontal
//     rows, ±Nπ). This one is a taxonomy of MIX (seven
//     vertical cells, 0→1). Same library, adjacent axes —
//     the two pieces ride as a diptych: input vs blend.
// 5.  LIBRARY MOVE: MORPH VIA MIX. `wave: ['sine','square']`
//     with a hard-locked per-cell `mix` value. This is the
//     p5.waves signature move — two formulas, one output,
//     a continuous blend axis exposed as a parameter. Shown
//     here as a legible specimen strip so the move is
//     unmistakable at thumbnail size.
// 6.  COLOR COMMITMENT: riso duotone — cream paper + one
//     deep riso red ink. No greys beyond faint baselines.
// 7.  RISK: a specimen strip can read as static — viewer
//     sees seven waves, misses that they're all the SAME
//     morph at different mix positions. Mitigation: each
//     cell's phase drifts at the same rate (so the whole
//     strip breathes as one organism), explicit mix-value
//     labels under every cell, and the terminal cells tagged
//     with the wave names so the axis is readable.
// 8.  MATERIAL: seven cells, each ~108 px wide, drawn as a
//     VERTICAL wave line (top→bottom). Cell 1 = pure sine
//     (mix=0), cell 7 = pure square (mix=1). t advances
//     +0.02 per frame @ 30 fps → visible phase motion in
//     every cell over a 5-second window, but the identity
//     of each cell (its mix) never changes. The LIBRARY
//     MOVE is what's promoted; the breath is just proof of
//     life.

const WAVE_A = 'sine';
const WAVE_B = 'square';
const N = 7;
const MIX_VALUES = [0, 1/6, 2/6, 3/6, 4/6, 5/6, 1];

const W = 900, H = 900;
const MX = 70;                 // left/right margin
const MY_TOP = 135;            // top margin (header strip)
const MY_BOT = 135;            // bottom margin (labels)

const PAPER = 245;
const INK = [178, 34, 52];     // riso red

const FREQ = 0.07;             // y-sample frequency into wave
const AMP_FRAC = 0.78;         // amplitude as fraction of cellW/2
const STEP_Y = 2;              // vertical sample pitch in px
const STROKE_W = 4.2;
const SPEED = 0.02;

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

  drawHeader();
  drawCells();
  drawFooter();

  t += SPEED;
}

// ── top: taxonomy header ─────────────────────────────────────
function drawHeader() {
  const contentX0 = MX;
  const contentX1 = W - MX;

  noStroke();

  // category label
  fill(145);
  textFont(mono);
  textSize(10.5);
  textAlign(LEFT, BASELINE);
  text('MORPH TAXONOMY  ·  mix axis  0 \u2192 1', contentX0, 64);

  // wave: [A, B] written as code, as promo copy
  fill(INK[0], INK[1], INK[2], 220);
  textFont(mono);
  textSize(15);
  textAlign(LEFT, BASELINE);
  text('wave: [\u2018' + WAVE_A + '\u2019, \u2018' + WAVE_B + '\u2019]', contentX0, 90);

  // method-call pointer, right side
  fill(145);
  textFont(mono);
  textSize(10.5);
  textAlign(RIGHT, BASELINE);
  text('Waves.wave(y, { wave: [A,B], mix: m, t })', contentX1, 90);

  // thin rule under header
  stroke(INK[0], INK[1], INK[2], 55);
  strokeWeight(0.6);
  line(contentX0, 108, contentX1, 108);
}

// ── middle: the seven cells ──────────────────────────────────
function drawCells() {
  const contentX0 = MX;
  const contentX1 = W - MX;
  const contentW = contentX1 - contentX0;
  const cellW = contentW / N;

  const y0 = MY_TOP;
  const y1 = H - MY_BOT;
  const cellH = y1 - y0;

  const amp = cellW * AMP_FRAC;

  // cell dividers + waves
  for (let c = 0; c < N; c++) {
    const cx0 = contentX0 + c * cellW;
    const cx1 = cx0 + cellW;
    const cxc = cx0 + cellW / 2;
    const m   = MIX_VALUES[c];

    // faint vertical baseline down cell center
    stroke(INK[0], INK[1], INK[2], 26);
    strokeWeight(0.5);
    line(cxc, y0 + 6, cxc, y1 - 6);

    // vertical wave line — THE library move
    noFill();
    stroke(INK[0], INK[1], INK[2]);
    strokeWeight(STROKE_W);
    beginShape();
    for (let y = y0 + 8; y <= y1 - 8; y += STEP_Y) {
      const u = (y - y0) * FREQ;
      const x = Waves.wave(u, {
        wave: [WAVE_A, WAVE_B],
        mix:  m,
        t:    t,
        amplitude: amp
      });
      vertex(cxc + x, y);
    }
    endShape();

    // mix label under each cell
    noStroke();
    fill(INK[0], INK[1], INK[2], 200);
    textFont(mono);
    textSize(11);
    textAlign(CENTER, BASELINE);
    const mixStr = (c === 0) ? '0.00'
                 : (c === N - 1) ? '1.00'
                 : m.toFixed(3);
    text('mix = ' + mixStr, cxc, y1 + 26);

    // stage index, small, above label
    fill(150);
    textFont(mono);
    textSize(9);
    text(String(c + 1).padStart(2, '0') + ' / 07', cxc, y1 + 40);
  }

  // terminal tags — WAVE A under cell 1, WAVE B under cell 7
  noStroke();
  fill(INK[0], INK[1], INK[2], 230);
  textFont(mono);
  textSize(10);
  textAlign(CENTER, BASELINE);
  text('\u2190 pure ' + WAVE_A,
       contentX0 + cellW * 0.5, y0 - 10);
  textAlign(CENTER, BASELINE);
  text('pure ' + WAVE_B + ' \u2192',
       contentX0 + cellW * (N - 0.5), y0 - 10);
}

// ── bottom: title, caption, credit ───────────────────────────
function drawFooter() {
  if (window.__P5WAVES_STAGE_ONLY__) return;
  noStroke();

  // title
  fill(90);
  textFont(oswald);
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('seven stages', MX, H - 46);

  // caption
  fill(150);
  textFont(mono);
  textSize(9.5);
  text('one morph, seven locked stations  \u00b7  mix stepped at 1/6  \u00b7  phase breathes; identity does not',
       MX, H - 30);

  // credit, right
  fill(150);
  textFont(mono);
  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', W - MX, H - 46);
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
