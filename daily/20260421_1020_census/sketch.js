/*
  census — 2026-04-21 10:20

  FEELING — census. A quiet enumeration; specimens held in register,
            each unique, each still breathing in place. Like a taxonomic
            plate — authored, catalogued, but the subjects won't hold still.

  WAVE LOGIC — chorus of six wave families distributed across eleven rows.
              · rows 0-1  : round linked sine   (layered & smooth — the body)
              · rows 2-3  : up down pulse       (punched alternation)
              · rows 4-5  : batman              (iconic special form)
              · rows 6-7  : bald patch          (silent gaps — absence)
              · rows 8-9  : mountain peaks      (asymmetric spikes)
              · row  10   : fuzzy pulse ↔ wobble sine (morph — the outlier row)
              Per-cell seed (row * COLS + col + family offset) gives each
              specimen a distinct silhouette inside its family. Outlier row
              uses wild mode on even columns, stable on odd, with a low
              unpredictability lift. Frequency drifts slightly across columns
              so no two cells hold the same rhythm.

  TIME LOGIC — fast base clock  t = millis() / 400  (pulse, alive, not glitch).
              Per-column phase offset (col * 0.11) so neighbours are never
              in lock. Morph mix runs on a much slower second clock,
              (sin(millis()/3200) + 1)/2 — the outlier row breathes between
              fuzzy and wobble on its own cinematic time.

  STRUCTURAL MOVE — 11 rows × 7 columns = 77 specimen cells, hairline-bordered,
              centred horizontally, top-aligned inside the safe margin.
              Asymmetric on purpose (rows ≠ cols) so it doesn't read as a
              symmetric figure. Each cell: index label, wave trace, faint
              baseline. Family name printed in left gutter, sparse, mono.
              One outlier cell (row 10, col 3) is marked with a firm border
              and a live morph readout — the plate's one annotated specimen.
              Reads as a printed register, quietly in motion.
*/

const W = 1080;
const H = 1080;
const M = 100;

const ROWS = 11;
const COLS = 7;
const CELL_W = 80;
const CELL_H = 55;
const GUTTER_X = 12;
const GUTTER_Y = 8;

const GRID_W = COLS * CELL_W + (COLS - 1) * GUTTER_X;
const GRID_H = ROWS * CELL_H + (ROWS - 1) * GUTTER_Y;
const GX = (W - GRID_W) / 2;
const GY = 130;

const ROW_WAVES = [
  'round linked sine',
  'round linked sine',
  'up down pulse',
  'up down pulse',
  'batman',
  'batman',
  'bald patch',
  'bald patch',
  'mountain peaks',
  'mountain peaks',
  'MORPH'
];

const FAMILY_NAMES = [
  { rowStart: 0,  name: 'round linked sine' },
  { rowStart: 2,  name: 'up down pulse'     },
  { rowStart: 4,  name: 'batman'            },
  { rowStart: 6,  name: 'bald patch'        },
  { rowStart: 8,  name: 'mountain peaks'    },
  { rowStart: 10, name: 'fuzzy pulse ↔ wobble sine' }
];

const OUTLIER_ROW = 10;
const OUTLIER_COL = 3;

let samplers = [];

async function setup() {
  createCanvas(W, H);
  await document.fonts.ready;
  pixelDensity(2);
  frameRate(30);

  for (let r = 0; r < ROWS; r++) {
    samplers[r] = [];
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      if (r === OUTLIER_ROW) {
        samplers[r][c] = Waves.createSampler({
          wave: ['fuzzy pulse', 'wobble sine'],
          seed: idx + 97,
          range: [-20, 20],
          frequency: 1 + (c * 0.06),
          phase: c * 0.11,
          mode: c % 2 === 0 ? 'wild' : 'stable',
          unpredictability: 0.35
        });
      } else {
        samplers[r][c] = Waves.createSampler({
          wave: ROW_WAVES[r],
          seed: idx,
          range: [-20, 20],
          frequency: 1 + (c * 0.05),
          phase: c * 0.11
        });
      }
    }
  }
}

function draw() {
  background(245);

  const t = millis() / 400;
  const mix = (Math.sin(millis() / 3200) + 1) / 2;

  drawPageRules();
  drawFamilyNames();

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x0 = GX + c * (CELL_W + GUTTER_X);
      const y0 = GY + r * (CELL_H + GUTTER_Y);
      drawCell(r, c, x0, y0, t, mix);
    }
  }

  highlightOutlier(t, mix);
  drawLabels();
}

function drawPageRules() {
  stroke(215);
  strokeWeight(0.5);
  line(GX - 26, GY - 10, GX - 26, GY + GRID_H + 10);
  line(GX - 26, GY + GRID_H + 16, GX + GRID_W, GY + GRID_H + 16);

  // column heads
  drawingContext.save();
  drawingContext.font = "400 7.5px 'IBM Plex Mono', monospace";
  drawingContext.fillStyle = 'rgba(150,150,150,0.9)';
  drawingContext.textAlign = 'center';
  drawingContext.textBaseline = 'bottom';
  for (let c = 0; c < COLS; c++) {
    const cx = GX + c * (CELL_W + GUTTER_X) + CELL_W / 2;
    drawingContext.fillText(`col·${c}`, cx, GY - 6);
  }
  drawingContext.restore();
}

function drawFamilyNames() {
  drawingContext.save();
  drawingContext.font = "400 8.5px 'IBM Plex Mono', monospace";
  drawingContext.fillStyle = 'rgba(120,120,120,0.95)';
  drawingContext.textAlign = 'left';
  drawingContext.textBaseline = 'top';
  for (const f of FAMILY_NAMES) {
    const y = GY + f.rowStart * (CELL_H + GUTTER_Y) + 3;
    drawingContext.fillText(f.name, M, y);
    // bracket tick: mark the family block height
    const h = (f.rowStart === 10)
      ? CELL_H
      : 2 * CELL_H + GUTTER_Y;
    drawingContext.strokeStyle = 'rgba(180,180,180,0.9)';
    drawingContext.lineWidth = 0.5;
    drawingContext.beginPath();
    drawingContext.moveTo(GX - 34, y + 12);
    drawingContext.lineTo(GX - 34, y + h - 4);
    drawingContext.stroke();
  }
  drawingContext.restore();
}

function drawCell(r, c, x0, y0, t, mix) {
  // hairline border
  noFill();
  stroke(215);
  strokeWeight(0.5);
  rect(x0 + 0.5, y0 + 0.5, CELL_W, CELL_H);

  // cell index
  drawingContext.save();
  drawingContext.font = "400 7px 'IBM Plex Mono', monospace";
  drawingContext.fillStyle = 'rgba(150,150,150,0.85)';
  drawingContext.textAlign = 'left';
  drawingContext.textBaseline = 'top';
  const idx = `${r.toString().padStart(2, '0')}·${c.toString().padStart(2, '0')}`;
  drawingContext.fillText(idx, x0 + 4, y0 + 4);
  drawingContext.restore();

  // trace
  const s = samplers[r][c];
  const cy = y0 + CELL_H / 2 + 4;
  const startX = x0 + 7;
  const endX = x0 + CELL_W - 5;
  const traceW = endX - startX;
  const samples = 44;

  // faint baseline
  stroke(222);
  strokeWeight(0.5);
  line(startX, cy, endX, cy);

  // wave
  stroke(28, 28, 34, 220);
  strokeWeight(0.85);
  noFill();
  beginShape();
  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    const sx = u * 12;
    const v = (r === OUTLIER_ROW) ? s.sample(sx, t, mix) : s.sample(sx, t);
    const px = startX + u * traceW;
    const py = cy + v * 0.55;
    vertex(px, py);
  }
  endShape();
}

function highlightOutlier(t, mix) {
  const x0 = GX + OUTLIER_COL * (CELL_W + GUTTER_X);
  const y0 = GY + OUTLIER_ROW * (CELL_H + GUTTER_Y);

  noFill();
  stroke(28, 28, 34, 255);
  strokeWeight(1.1);
  rect(x0 - 1.5, y0 - 1.5, CELL_W + 3, CELL_H + 3);

  // connector + readout
  drawingContext.save();
  drawingContext.strokeStyle = 'rgba(90,90,90,0.7)';
  drawingContext.lineWidth = 0.5;
  drawingContext.beginPath();
  drawingContext.moveTo(x0 + CELL_W + 4, y0 + CELL_H / 2);
  drawingContext.lineTo(x0 + CELL_W + 14, y0 + CELL_H / 2);
  drawingContext.stroke();

  drawingContext.font = "400 8px 'IBM Plex Mono', monospace";
  drawingContext.fillStyle = 'rgba(90,90,90,0.95)';
  drawingContext.textAlign = 'left';
  drawingContext.textBaseline = 'middle';
  drawingContext.fillText(`mix ${mix.toFixed(2)}`, x0 + CELL_W + 18, y0 + CELL_H / 2);
  drawingContext.restore();
}

function drawLabels() {
  drawingContext.save();
  drawingContext.textBaseline = 'alphabetic';

  drawingContext.font = "300 22px 'Oswald', sans-serif";
  drawingContext.fillStyle = 'rgba(90,90,90,0.95)';
  drawingContext.textAlign = 'left';
  drawingContext.fillText('census', M, 854);

  drawingContext.font = "400 9.5px 'IBM Plex Mono', monospace";
  drawingContext.fillStyle = 'rgb(168,168,168)';
  drawingContext.textAlign = 'left';
  drawingContext.fillText('chorus · 6 wave families · morph row', M, 870);

  drawingContext.font = "400 19px 'IBM Plex Mono', monospace";
  drawingContext.fillStyle = 'rgb(168,168,168)';
  drawingContext.textAlign = 'right';
  drawingContext.fillText('p5.waves', width - M, 854);

  drawingContext.restore();
}
