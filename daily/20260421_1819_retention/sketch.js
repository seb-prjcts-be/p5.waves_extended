// ABOUT: a protest archive being deleted from a government server — the
//   specific moment of selective erasure where some records survive, some
//   get redacted, and the system keeps hesitating on the deletion itself.
// GESTURE: stutter — the deletion hesitates, repeats, refuses to commit.
// REFERENCE: Karel Martens oefeningen — restraint via repeated small units,
//   the rigid ledger grid with content that shifts inside it.
// COLOR: photocopy black + red accent — pure black workhorse, red is the
//   pen that disagrees with what got kept.
// RISK: type-heavy sketches risk being literal ("REDACTED" written out) or
//   editorial (looking like an infographic). Mitigation: no readable
//   phrases, only archival notation — refs, dates, fragments, flags. The
//   viewer reads "censored record", not a thesis. Hyper-fast stutter risks
//   nausea; mitigation: small jump amplitude and stepped sine so motion
//   quantizes rather than blurs.
// MATERIAL: three samplers, hyper-fast timing (millis()/110).
//   · stepped sine → per-row horizontal jump (the stutter itself)
//   · fuzzy pulse (wild) → black deletion bars that hesitate mid-sweep
//   · up-down pulse → red strike-throughs on lines not yet erased

let fontsReady = false;
let rows = [];
let stutterS, eraseS, strikeS;
const M = 100;
const ROW_COUNT = 52;
const TOP = 218;
const LINE_H = 11;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(2);
  await document.fonts.ready;
  fontsReady = true;

  randomSeed(20260421);

  for (let i = 0; i < ROW_COUNT; i++) rows.push(buildRow(i));

  stutterS = Waves.createSampler({
    wave: 'stepped sine',
    range: [-8, 8],
    frequency: 1.4,
    seed: 7
  });

  eraseS = Waves.createSampler({
    wave: 'fuzzy pulse',
    range: [0, 1],
    frequency: 0.35,
    mode: 'wild',
    unpredictability: 0.45,
    seed: 3
  });

  strikeS = Waves.createSampler({
    wave: 'up down pulse',
    range: [0, 1],
    frequency: 0.9,
    seed: 11
  });
}

function buildRow(i) {
  const codes = ['AR', 'CS', 'MN', 'DF', 'HX', 'RQ', 'VN', 'PS', 'KL', 'TR'];
  const flags = ['pending', 'review', 'restricted', 'archived', 'withheld', 'sealed', 'expunge'];
  const frags = ['×××', '§§§', '░░░', '██', '▓▓', '‡‡', '¶¶', '— —', '·····'];

  const code = random(codes);
  const num = nf(floor(random(100, 9999)), 4);
  const mo = nf(floor(random(1, 13)), 2);
  const da = nf(floor(random(1, 29)), 2);
  const yr = nf(floor(random(14, 26)), 2);
  const tail = nf(floor(random(1000)), 3);
  return {
    code: `${code}/${num}`,
    date: `${yr}-${mo}-${da}`,
    frag: random(frags),
    tail,
    flag: random(flags)
  };
}

function draw() {
  if (!fontsReady) return;
  background(245);
  const t = millis() / 110;

  drawHeader(t);
  drawBody(t);
  drawFooter();
  drawLabel();
}

function drawHeader(t) {
  push();
  noStroke();
  const hjx = stutterS.sample(0, t) * 0.25;

  fill(12);
  textFont('Oswald');
  textSize(34);
  textAlign(LEFT, BASELINE);
  text('RETENTION SCHEDULE', M + hjx, 148);

  textFont('IBM Plex Mono');
  textSize(10);
  fill(130);
  text('policy 04/2026  ·  status: applied  ·  source gov.archive/dossier', M, 172);

  stroke(135);
  strokeWeight(0.75);
  line(M, 188, width - M, 188);
  pop();
}

function drawBody(t) {
  const xIdx = M;
  const xMain = M + 54;
  const xTail = M + 640;
  const xFlag = M + 720;

  // Pass 1: rows
  push();
  textFont('IBM Plex Mono');
  textSize(10);
  textAlign(LEFT, BASELINE);
  noStroke();

  for (let i = 0; i < rows.length; i++) {
    const y = TOP + i * LINE_H;
    const jx = stutterS.sample(i * 0.14, t);
    const a = 220 - (i % 7) * 6;

    // Rigid anchor: index never moves (Martens grid)
    fill(165);
    text(nf(i + 1, 3), xIdx, y);

    // Content: stutters as a unit
    fill(15, a);
    text(`${rows[i].code}    ${rows[i].date}    ${rows[i].frag}`, xMain + jx, y);

    fill(15, a - 32);
    text(rows[i].tail, xTail + jx, y);

    fill(150);
    text(rows[i].flag, xFlag + jx, y);

    // Red strike on rows the pen disagrees with
    const sv = strikeS.sample(i * 0.27, t * 0.45);
    if (sv > 0.7) {
      stroke(205, 20, 25, 235);
      strokeWeight(1.3);
      const sx = xMain + jx - 3;
      const ex = xFlag + jx + textWidth(rows[i].flag) + 4;
      line(sx, y - 3, ex, y - 3);
      noStroke();
    }
  }
  pop();

  // Pass 2: deletion bars overlay (hesitate, sweep, fail to commit)
  push();
  noStroke();
  fill(10);
  for (let i = 0; i < rows.length; i++) {
    const y = TOP + i * LINE_H;
    const ev = eraseS.sample(i * 0.095, t * 0.22);
    if (ev > 0.5) {
      const jx = stutterS.sample(i * 0.14, t);
      const w = map(ev, 0.5, 1, 0, 760);
      rect(xMain + jx - 4, y - 9, w, 10);
    }
  }
  pop();
}

function drawFooter() {
  const y = TOP + ROW_COUNT * LINE_H + 6;
  push();
  stroke(135);
  strokeWeight(0.75);
  line(M, y, width - M, y);
  noStroke();
  textFont('IBM Plex Mono');
  textSize(10);
  fill(130);
  textAlign(LEFT, BASELINE);
  text(
    `end of record  ·  pages 1–${ROW_COUNT} of ${ROW_COUNT}  ·  do not reissue`,
    M,
    y + 16
  );
  pop();
}

function drawLabel() {
  push();
  noStroke();

  textFont('Oswald');
  textSize(22);
  fill(90, 90, 90, 242);
  textAlign(LEFT, BASELINE);
  text('retention', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text('stepped sine · fuzzy pulse · up down pulse', M, 870);

  textFont('IBM Plex Mono');
  textSize(19);
  fill(168);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', width - M, 854);

  pop();
}
