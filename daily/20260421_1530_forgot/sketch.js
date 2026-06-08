/*
  ABOUT             a password I can't remember — the ghosting of a thing I was supposed to keep.
  GESTURE           sprout — letters pushing up through the mask, trying to emerge.
  REFERENCE ANCHOR  Tyler Hobbs / Manfred Mohr lineage — systematic rule with chaos inside it.
  COLOR COMMITMENT  Photocopy black + red accent. Most marks are ink-black. Red is the flare
                    of "wrong" — a rejected attempt, visible for a beat, then gone.
  RISK              Typography as primary material. If the type reads as decorative instead of
                    conceptual, this fails. "Password" is an overused motif — survival depends
                    on committing to the specific emotional truth of private failure, not
                    illustrating the idea. Also risky: letting a few cells flare at once while
                    the rest stay masked — too few and nothing reads, too many and it's noise.
  MATERIAL          Duo of samplers. grow random in wild mode drives the sprout rhythm (some
                    cells push through, most stay hidden). fuzzy pulse drives the red flare —
                    short bursts, nervous. millis()/400 for the fast typing pulse underneath.
*/

const ROWS = 24;
const COLS = 14;
const MASK = '\u2022';
const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789_-!@#$%&*'.split('');

let sampReveal;
let sampFlare;
let rowsData = [];

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(2);
  await document.fonts.ready;

  sampReveal = Waves.createSampler({
    wave: 'grow random',
    range: [0, 1],
    frequency: 0.85,
    mode: 'wild',
    unpredictability: 0.55
  });

  sampFlare = Waves.createSampler({
    wave: 'fuzzy pulse',
    range: [0, 1],
    frequency: 1.4
  });

  for (let r = 0; r < ROWS; r++) {
    let row = {
      chars: [],
      rejected: Math.random() < 0.78,
      rejectSeed: r * 17 + 1000,
      prefix:
        '#' + nf(r + 1, 3) + '  ' +
        nf(Math.floor(Math.random() * 3 + 21), 2) + ':' +
        nf(Math.floor(Math.random() * 60), 2) + ':' +
        nf(Math.floor(Math.random() * 60), 2)
    };
    for (let c = 0; c < COLS; c++) {
      row.chars.push({
        truth: CHARS[Math.floor(Math.random() * CHARS.length)],
        seed: r * 53 + c * 7,
        offset: Math.random() * 4
      });
    }
    rowsData.push(row);
  }
}

function draw() {
  background(245);

  const t = millis() / 400;

  textFont('IBM Plex Mono');
  textSize(10);
  fill(168);
  textAlign(LEFT, BASELINE);
  text('auth.log  \u2014  session unresolved', 100, 142);

  textAlign(RIGHT, BASELINE);
  text('attempts \u2014 ' + nf(ROWS, 3), 980, 142);

  stroke(220);
  strokeWeight(0.5);
  line(100, 156, 980, 156);
  noStroke();

  const prefixW = 170;
  const cellW = 30;
  const gap = 14;
  const endW = 44;
  const gridWidth = prefixW + gap + COLS * cellW + endW;
  const gridX = (width - gridWidth) / 2;
  const startY = 188;
  const rowH = 26;
  const cellH = 22;

  for (let r = 0; r < ROWS; r++) {
    const y = startY + r * rowH;
    const row = rowsData[r];

    textFont('IBM Plex Mono');
    textSize(10);
    fill(135);
    textAlign(LEFT, CENTER);
    text(row.prefix, gridX, y + cellH / 2);

    for (let c = 0; c < COLS; c++) {
      const cell = row.chars[c];
      const cx = gridX + prefixW + gap + c * cellW + cellW / 2;
      const cy = y + cellH / 2;

      const reveal = sampReveal.sample(cell.seed + cell.offset, t * 0.07);
      const flare = sampFlare.sample(cell.seed * 0.61 + 500, t * 0.14);

      const growth = Math.max(0, Math.min(1, reveal));
      const wrongFlare = growth > 0.55 && flare > 0.78;

      textAlign(CENTER, CENTER);

      // mask layer fades as the letter sprouts
      fill(30, 255 * (1 - growth * 0.95));
      textSize(20);
      text(MASK, cx, cy);

      // sprouting letter — size grows from 9 to 20
      const letterSize = 9 + growth * 13;
      textSize(letterSize);
      if (wrongFlare) {
        fill(210, 28, 36, 255 * growth);
      } else {
        fill(18, 255 * growth);
      }
      text(cell.truth, cx, cy);
    }

    const endX = gridX + prefixW + gap + COLS * cellW + 14;
    if (row.rejected) {
      const rejectFlare = sampFlare.sample(row.rejectSeed, t * 0.09);
      const bright = rejectFlare > 0.5 ? 255 : 190;
      fill(210, 28, 36, bright);
      textFont('IBM Plex Mono');
      textSize(16);
      textAlign(LEFT, CENTER);
      text('\u00d7', endX, y + cellH / 2);
    }
  }

  // footer micro-text
  textFont('IBM Plex Mono');
  textSize(9);
  fill(168);
  textAlign(LEFT, BASELINE);
  text('hint \u2014 something you\u2019d remember', 100, 822);
  textAlign(RIGHT, BASELINE);
  text('status \u2014 locked', 980, 822);

  drawLabels();
}

function drawLabels() {
  const M = 100;

  drawingContext.font = '300 22px Oswald, sans-serif';
  fill(90, 90, 90, 242);
  textAlign(LEFT, BASELINE);
  text('forgot', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  textAlign(LEFT, BASELINE);
  text('grow random  \u00d7  fuzzy pulse', M, 870);

  drawingContext.font = '400 19px IBM Plex Mono, monospace';
  fill(168);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', width - M, 854);
}
