/*
  ABOUT           a protest archive being deleted, one page at a time.
                  the file is maintained past the moment permission was withdrawn.
  GESTURE         decay
  REFERENCE       Printed Matter NY catalog — artist-book sensibility
                  (restraint, the page as ledger, the redaction as event)
  COLOR           photocopy black on 245, single red accent (210, 35, 35)
  RISK            type has to carry it. if the words read as generic protest stock,
                  the piece collapses into decorative distress.
  MATERIAL        one wave ('bald patch'). a decay front descends slowly across
                  the page; the wave gives the front an uneven, bitten edge.
                  text above the front is gone. text crossing the front is a
                  red redaction bar. text below is intact.
*/

const M = 100;                  // safe margin
const CANVAS = 1080;
const RED = [210, 35, 35];
const INK = [15];
const BG = 245;
const TITLE_GREY = [90];
const META_GREY = [168];

// archival material — the record being erased
const ARCHIVE = [
  // header — file metadata
  { txt: 'FILE  01-47-B',                     x: M,   y: 140, size: 11, mono: true },
  { txt: 'CASE REF  ·  0342.19',              x: M,   y: 160, size: 11, mono: true },
  { txt: 'STATUS  ·  open / reviewed / open', x: M,   y: 180, size: 11, mono: true },
  { txt: 'CLASSIFICATION  ·  restricted',     x: M,   y: 200, size: 11, mono: true },
  { txt: 'DISPOSITION  ·  delete on sight',   x: M,   y: 220, size: 11, mono: true },

  // slogan — large oswald
  { txt: 'WE',     x: M, y: 340, size: 170, mono: false, bold: true },
  { txt: 'WERE',   x: M, y: 498, size: 170, mono: false, bold: true },
  { txt: 'HERE.',  x: M, y: 656, size: 170, mono: false, bold: true },

  // witness list — right column
  { txt: '01 · 10 · 1968  assembly',   x: 640, y: 336, size: 12, mono: true },
  { txt: '06 · 04 · 1989  square',     x: 640, y: 356, size: 12, mono: true },
  { txt: '11 · 15 · 2019  boulevard',  x: 640, y: 376, size: 12, mono: true },
  { txt: '03 · 22 · 2024  bridge',     x: 640, y: 396, size: 12, mono: true },
  { txt: '08 · 19 · 2025  ring road',  x: 640, y: 416, size: 12, mono: true },
  { txt: '12 · 01 · 2025  embassy',    x: 640, y: 436, size: 12, mono: true },
  { txt: '02 · 14 · 2026  ministry',   x: 640, y: 456, size: 12, mono: true },
  { txt: '04 · 09 · 2026  quay',       x: 640, y: 476, size: 12, mono: true },

  // redaction indices
  { txt: '[redacted]  × 037',  x: 640, y: 530, size: 12, mono: true },
  { txt: '[redacted]  × 052',  x: 640, y: 550, size: 12, mono: true },
  { txt: '[redacted]  × 104',  x: 640, y: 570, size: 12, mono: true },
  { txt: '[redacted]  × 311',  x: 640, y: 590, size: 12, mono: true },

  // body — the clause
  { txt: 'the record was maintained until',       x: M, y: 748, size: 15, mono: true },
  { txt: 'permission was withdrawn, then',        x: M, y: 770, size: 15, mono: true },
  { txt: 'the record was maintained despite',     x: M, y: 792, size: 15, mono: true },
  { txt: 'the withdrawal of permission.',         x: M, y: 814, size: 15, mono: true },
  { txt: 'this is that record.',                  x: M, y: 836, size: 15, mono: true, accent: true },
];

let wasDrawn = [];   // which entries were ever pristine this frame — for after-dust

function setup() {
  createCanvas(CANVAS, CANVAS);
  textLeading(1.05);
}

function draw() {
  background(BG);

  const t = millis() / 3000;                          // slow
  const cycleSec = 42;                                // decay cycle
  const localT = (millis() / 1000) % cycleSec;
  const frontY = map(localT, 0, cycleSec, -200, CANVAS + 180);

  // draw each archival entry against the decay front
  for (const item of ARCHIVE) {
    applyTypeStyle(item);

    // wave perturbation of the front, sampled at the item's x
    const w = Waves.wave(item.x * 0.5 + (item.y * 0.12), {
      wave: 'bald patch',
      amplitude: 95,
      frequency: 0.9,
      t: t,
      phase: item.mono ? 0 : 1.3,
    });
    const localFront = frontY + w;

    // anchor point for comparisons (baseline roughly = y + size*0.8 with TOP align)
    const anchor = item.y + item.size * 0.35;
    const bandHi = localFront;                        // above this = decayed
    const bandLo = localFront + 42;                   // below this = pristine

    if (anchor > bandLo) {
      // pristine ink
      noStroke();
      fill(item.accent ? RED[0] : INK[0], item.accent ? RED[1] : INK[0], item.accent ? RED[2] : INK[0]);
      text(item.txt, item.x, item.y);
    } else if (anchor > bandHi) {
      // in the decay band — red redaction bar
      drawRedactionBar(item);
    } else {
      // fully decayed — nothing
      // (optional) occasional residue dot to show the page had content:
      if (((item.x + item.y) % 7) === 0) {
        noStroke();
        fill(INK[0], 60);
        circle(item.x + (item.size * 0.3), item.y + item.size * 0.6, 1.2);
      }
    }
  }

  // subtle grain — photocopy residue
  drawPhotocopyGrain();

  // label frame
  drawLabel();
}

// --- helpers ---------------------------------------------------------------

function applyTypeStyle(item) {
  if (item.mono) {
    textFont('IBM Plex Mono');
    textStyle(NORMAL);
  } else {
    textFont('Oswald');
    textStyle(item.bold ? BOLD : NORMAL);
  }
  textSize(item.size);
  textAlign(LEFT, TOP);
}

function drawRedactionBar(item) {
  applyTypeStyle(item);
  const w = textWidth(item.txt);
  const h = item.size * (item.mono ? 1.15 : 0.78);
  const yOffset = item.mono ? -2 : item.size * 0.12;
  noStroke();
  fill(RED[0], RED[1], RED[2]);
  rect(item.x - 2, item.y + yOffset, w + 4, h);

  // a tiny catalog index stamp next to some bars
  if ((item.y + item.x) % 3 === 0) {
    textFont('IBM Plex Mono');
    textStyle(NORMAL);
    textSize(8);
    fill(RED[0], RED[1], RED[2], 170);
    textAlign(LEFT, TOP);
    text('· del', item.x + w + 6, item.y + yOffset + h * 0.25);
  }
}

function drawPhotocopyGrain() {
  noStroke();
  const N = 260;
  for (let i = 0; i < N; i++) {
    const gx = (noise(i * 0.13, frameCount * 0.003) * CANVAS);
    const gy = (noise(i * 0.17 + 999, frameCount * 0.003) * CANVAS);
    fill(INK[0], 14);
    circle(gx, gy, 0.9);
  }
}

function drawLabel() {
  // title — bottom-left (Oswald 300)
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(TITLE_GREY[0], TITLE_GREY[0], TITLE_GREY[0], 242);
  noStroke();
  textAlign(LEFT, BASELINE);
  text('archive null', M, 954);

  // active wave name — small mono above title
  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(META_GREY[0]);
  textAlign(LEFT, BASELINE);
  text('bald patch', M, 870);

  // p5.waves — bottom-right
  textFont('IBM Plex Mono');
  textSize(19);
  fill(META_GREY[0]);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', CANVAS - M, 954);
}
