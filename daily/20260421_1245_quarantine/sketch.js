// 20260421_1245 — QUARANTINE
// -----------------------------------------------------------
// ABOUT      : a spam folder as unintentional poetry archive
// GESTURE    : withhold
// REFERENCE  : Printed Matter NY catalog — artist-book sensibility, institutional
//              typography, the dryness of a catalogue raisonne as lens
// COLOR      : Pantone specimen — Klein blue (IKB) in multiple values on 245 bg
// RISK       : monochrome blue drifts toward meditative decoration.
//              This must read as institutional redaction / archive quarantine,
//              not pretty blue art. Typography carries the load — if the type
//              dissolves into pattern, the piece fails.
// MATERIAL   : duo. 'bald patch' cuts the redaction bars into gapped ink
//              (the withheld subject lines). 'fuzzy pulse' breathes the reveal
//              threshold in and out so the archive exhales. Slow timing
//              (millis/2800). Typography is the piece.

let barSampler;
let breathSampler;
let driftSampler;
let fontsReady = false;

const IKB   = [0, 47, 167];
const MID   = [47, 92, 184];
const PALE  = [138, 160, 214];
const VPALE = [215, 224, 240];

const SUBJECTS = [
  "RE: URGENT — Your account has been compromised",
  "You are the 10,000,000th visitor — CLAIM NOW",
  "Dearest Beloved in Christ, I write with tears",
  "Congratulations!!! Your prize is waiting inside",
  "A humble request from a widow in Abuja",
  "Reactivate within 24h or lose everything permanently",
  "Unclaimed inheritance USD 4,500,000.00",
  "Hot singles within 2 miles want to meet you",
  "Make $5000/week from home — guaranteed results",
  "Free iPhone 27 Pro — act before midnight tonight",
  "URGENT: Suspicious sign-in from Ulaanbaatar",
  "We tried to deliver your package (attempt 1 of 1)",
  "You may be entitled to substantial compensation",
  "Generic Viagra — the lowest prices online",
  "Work-from-home positions — no experience needed",
  "Click here to release your reward immediately",
  "Invoice #47281 — payment overdue 62 days",
  "Your subscription will expire tonight at midnight",
  "One weird trick doctors absolutely hate in 2026",
  "Final notice — respond immediately, dear Sir",
];

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(2);
  await document.fonts.ready;
  fontsReady = true;
  noStroke();

  barSampler = Waves.createSampler({
    wave: 'bald patch',
    range: [-60, 60],
    frequency: 1.4,
    seed: 17,
  });

  breathSampler = Waves.createSampler({
    wave: 'fuzzy pulse',
    range: [-30, 30],
    frequency: 0.9,
    seed: 3,
  });

  driftSampler = Waves.createSampler({
    wave: 'wobble sine',
    range: [-2.2, 2.2],
    frequency: 1.0,
    seed: 41,
  });
}

function draw() {
  if (!fontsReady) {
    background(245);
    return;
  }
  background(245);
  const M = 100;
  const T = millis() / 2800;

  drawTitle(M, M, T);
  drawMetaRow(M, T);
  drawSeparator(M);

  const listTop = M + 272;
  const lineH = 22;
  const listLeft = M;
  const listRight = width - M;

  const breath = breathSampler.sample(T * 0.6);
  const threshold = -16 - breath * 0.5;

  drawList(listTop, lineH, listLeft, listRight, T, breath, threshold);
  drawTimestamps(listRight + 10, listTop, lineH, SUBJECTS.length, T);
  drawLabels();
}

function drawTitle(x, y, T) {
  push();
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(208);
  textAlign(LEFT, TOP);
  fill(IKB);
  text('QUARANTINE', x, y - 12);

  const top = y + 4;
  const h   = 188;
  const right = width - x;
  for (let px = x; px <= right; px += 4) {
    const v = barSampler.sample(px * 0.0055 + 13, T * 0.32);
    if (v > -12) {
      const a = map(v, -12, 60, 210, 255);
      fill(IKB[0], IKB[1], IKB[2], a);
      rect(px, top, 4.1, h);
    }
  }
  pop();
}

function drawMetaRow(M, T) {
  push();
  textFont('IBM Plex Mono');
  textSize(10.5);
  textAlign(LEFT, TOP);
  fill(MID);
  text('INBOX  >  SPAM  >  ARCHIVE    ·    2,147 messages    ·    2,127 withheld', M, M + 232);
  textAlign(RIGHT, TOP);
  fill(PALE);
  text('CATALOGUE No 142   /   SERIES 05   /   2026', width - M, M + 232);
  pop();
}

function drawSeparator(M) {
  stroke(MID);
  strokeWeight(1);
  line(M, M + 252, width - M, M + 252);
  noStroke();
}

function drawList(listTop, lineH, listLeft, listRight, T, breath, threshold) {
  push();
  textFont('IBM Plex Mono');
  textSize(13);
  textAlign(LEFT, TOP);

  for (let i = 0; i < SUBJECTS.length; i++) {
    const y = listTop + i * lineH;
    const drift = driftSampler.sample(i * 0.3, T);

    const textAlpha = 60 + max(0, breath) * 2.0;
    fill(MID[0], MID[1], MID[2], textAlpha);
    const prefix = String(i + 1).padStart(3, '0');
    text(`${prefix}    ${SUBJECTS[i]}`, listLeft + drift, y);

    for (let px = listLeft; px <= listRight; px += 3) {
      const v = barSampler.sample(px * 0.012 + i * 0.47, T * 0.75 + i * 0.018);
      if (v > threshold) {
        const a = map(v, threshold, 60, 175, 252);
        fill(IKB[0], IKB[1], IKB[2], a);
        rect(px, y - 2, 3.1, 18);
      }
    }
  }
  pop();
}

function drawTimestamps(xRight, yTop, lineH, n, T) {
  push();
  textFont('IBM Plex Mono');
  textSize(9);
  textAlign(RIGHT, TOP);
  for (let i = 0; i < n; i++) {
    const y = yTop + i * lineH + 3;
    const v = breathSampler.sample(i * 0.28, T * 1.15);
    if (v > 12) {
      fill(MID[0], MID[1], MID[2], 195);
      const hh = 9 + ((i * 3) % 14);
      const mm = (i * 17) % 60;
      const ss = (i * 41) % 60;
      text(`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`, xRight, y);
    } else {
      fill(IKB[0], IKB[1], IKB[2], 235);
      text('##:##:##', xRight, y);
    }
  }
  pop();
}

function drawLabels() {
  const M = 100;
  push();
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 242);
  textAlign(LEFT, BASELINE);
  text('QUARANTINE', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text('bald patch / fuzzy pulse', M, 870);

  textSize(19);
  fill(168);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', width - M, 854);
  pop();
}
