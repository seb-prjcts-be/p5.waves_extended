// thirty_four_waves — Daily p5.waves 2026-04-23
// ============================================================
// 1.  MODE: L — Literal.
// 1a. STATEMENT: Thirty-four waves, named and drawn.
//     The title is the work and the work is the title. The
//     sketch contains nothing the statement doesn't cover:
//     every wave in p5.waves.v3.1.0, selected by numeric
//     index, one per row, labeled with the library's own
//     name, drawn as a single line that travels with time.
// 2.  GESTURE: TRAVELS. Each wave is a horizontal trace that
//     scrolls its phase with a global t. Thirty-four rivers of
//     ink, moving in sync to their own period.
// 3.  REFERENCE ANCHOR: Karel Martens oefeningen — systematic
//     specimen sheets where the rule IS the work and taste
//     arrives through rigor, not through styling.
// 4.  SEB ANCHOR: p5.wavesX100 — the 100-sketch study that
//     explored single-library depth across many pages. This is
//     the same catalog impulse compressed onto one sheet:
//     everything the library names, side by side.
// 5.  LIBRARY MOVE: select by index. p5.waves ships 34 named
//     waves addressable by integer (0 = classic sine, 33 =
//     smooth solid sine). Most sketches pick one wave and sit
//     on it. This one walks the full list by index and prints
//     the name the library returns from Waves.list() next to
//     each trace. The supporting move is range:[rowTop, rowBot]
//     so each wave auto-fits its row pixel box regardless of
//     its native amplitude — a second p5.waves signature that
//     falls out for free. No sweep, no morph, no mix — one
//     capability, shown exhaustively. That is the promo.
// 6.  COLOR COMMITMENT: ink on paper. Single ink (#222) on
//     cream (245). Label greys are tints of the same ink, not
//     a second color. The specimen sheet is monochrome: the
//     job is to name and draw, not to decorate.
// 7.  RISK: a 34-row page on a 1080 canvas can read as stamp-
//     album texture at thumbnail scale. Mitigation: the index
//     and name columns are wide and monospace at display size
//     (print-legible), the traces use 2 px strokes (promoter
//     minimum), and at 150 px thumbnail the field still reads
//     as "a dictionary of moving waves" — which is exactly the
//     marketing payload.
// 8.  MATERIAL: for i in 0..33, draw one horizontal trace per
//     row with { wave: i, t, range: [rowTop+3, rowBot-3] }.
//     Global t advances .03 per frame at 30 fps (= 0.9 / s),
//     so a 5 s capture window traverses 4.5 units — visible
//     motion on every wave, including the low-frequency
//     classic sine and the monotone log fade-out.
// ============================================================

const W = 1080;
const H = 1080;

const PAPER = 245;
const INK   = 34;

const HEAD_Y = 110;      // body starts at y = 110
const FOOT_Y = 1050;     // body ends at y = 1050
const BODY_H = FOOT_Y - HEAD_Y;  // 940
const N_ROWS = 34;
const ROW_H  = BODY_H / N_ROWS;  // ~27.65

const COL_IDX  = 40;     // "#00"
const COL_NAME = 110;    // "classic sine"
const TRACE_X0 = 310;
const TRACE_X1 = 1040;
const TRACE_W  = TRACE_X1 - TRACE_X0;

let allWaves;

async function setup() {
  createCanvas(W, H);
  await document.fonts.ready;
  pixelDensity(2);
  noSmooth();

  allWaves = Waves.list();   // 34 descriptors — names from the library
  frameRate(30);
}

function draw() {
  background(PAPER);

  const t = frameCount * 0.03;

  drawHeader();
  drawRowsFrame();
  drawAllWaves(t);
  drawFooter(t);
}

// ─── Header ─────────────────────────────────────────────────

function drawHeader() {
  // Title — primary type, promoter-legibility size.
  noStroke();
  fill(INK);
  textFont('IBM Plex Mono');
  textStyle(BOLD);
  textSize(44);
  textAlign(LEFT, BASELINE);
  text('thirty_four_waves', 40, 66);

  // Subtitle / specimen row — smaller, grey.
  textStyle(NORMAL);
  textSize(12);
  fill(INK, 150);
  text('p5.waves v3.1.0  ·  specimen sheet  ·  select by index  ·  Waves.wave(x, { wave: i })', 40, 92);

  // Right-side legend — column headers.
  fill(INK, 110);
  textSize(10);
  textAlign(LEFT, BASELINE);
  text('#', COL_IDX,  104);
  text('NAME', COL_NAME, 104);
  text('TRACE  (range-mapped to row)', TRACE_X0, 104);

  // Thin rule under the header.
  stroke(INK, 60);
  strokeWeight(0.5);
  line(40, HEAD_Y - 2, W - 40, HEAD_Y - 2);
  noStroke();
}

// ─── Row frame (faint dividers between rows) ────────────────

function drawRowsFrame() {
  stroke(INK, 18);
  strokeWeight(0.5);
  for (let i = 1; i < N_ROWS; i++) {
    const y = HEAD_Y + i * ROW_H;
    line(40, y, W - 40, y);
  }
  // Vertical separators between the three columns.
  stroke(INK, 28);
  line(COL_NAME - 8, HEAD_Y, COL_NAME - 8, FOOT_Y);
  line(TRACE_X0 - 8, HEAD_Y, TRACE_X0 - 8, FOOT_Y);
  noStroke();
}

// ─── The thirty-four waves ──────────────────────────────────

function drawAllWaves(t) {
  textFont('IBM Plex Mono');
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);

  for (let i = 0; i < N_ROWS; i++) {
    const rowTop = HEAD_Y + i * ROW_H;
    const rowBot = rowTop + ROW_H;
    const rowMid = (rowTop + rowBot) * 0.5;

    // Index column — "#00"..
    noStroke();
    fill(INK, 200);
    textStyle(BOLD);
    textSize(13);
    const idxStr = '#' + (i < 10 ? '0' + i : i);
    text(idxStr, COL_IDX, rowMid + 1);

    // Name column — from the library itself.
    textStyle(NORMAL);
    textSize(13);
    fill(INK, 220);
    text(allWaves[i].name, COL_NAME, rowMid + 1);

    // Wave trace — select by index, range-mapped to row.
    stroke(INK, 230);
    strokeWeight(2);
    noFill();
    beginShape();
    const stepPx = 3;
    for (let x = TRACE_X0; x <= TRACE_X1; x += stepPx) {
      const u = (x - TRACE_X0) * 0.06;   // wave input domain
      const y = Waves.wave(u, {
        wave:  i,
        t:     t,
        range: [rowTop + 3, rowBot - 3]
      });
      vertex(x, y);
    }
    endShape();
  }
}

// ─── Footer ─────────────────────────────────────────────────

function drawFooter(t) {
  if (window.__P5WAVES_STAGE_ONLY__) return;
  noStroke();
  fill(INK, 110);
  textFont('IBM Plex Mono');
  textStyle(NORMAL);
  textSize(10);
  textAlign(LEFT, BASELINE);
  text('2026-04-23  ·  seb  ·  Daily p5.waves  ·  sister to p5.wavesX100',
       40, H - 18);

  textAlign(RIGHT, BASELINE);
  text('t = ' + t.toFixed(2).padStart(6, ' '), W - 40, H - 18);
}
