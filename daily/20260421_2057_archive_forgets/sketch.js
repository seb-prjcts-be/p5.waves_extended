/*
  ABOUT     : protest archive being deleted — a printed index of fragments
              from movements (Tahrir, Gezi, Standing Rock, Belarus, BLM,
              Gaza solidarity statements, Hong Kong umbrella docs) being
              actively scrubbed character by character.
  GESTURE   : decay — characters dropping into █ ░ ▒ ▓ noise, vermillion
              redaction bars sweeping down the column erasing whole rows.
  REFERENCE : Printed Matter NY catalog — bold catalog numerals, monospace
              body, ruthless left-alignment, the page as record.
  COLOR     : photocopy black workhorse + vermillion accent (#d62410) for
              the act of deletion. 245 paper. No third color.
  RISK      : decay tipping into pure noise — the words must remain just
              barely readable so the loss is felt, not abstracted.
  MATERIAL  : chorus of three p5.waves layers —
              · mountain peaks (slow, /3500ms) sets per-row decay rate
              · fuzzy pulse    (fast,  /520ms) decides which chars corrupt
              · stepped sine   (med,   /900ms) jitters char y-offset
              · plus a sweep position cycling vermillion through rows
*/

const W = 1080;
const H = 1080;
const M = 100;

const ENTRIES = [
  ['001', 'tahrir square — arabic transcripts',         '2011.01.25', 'archive.tahrir.eg/transcripts/vol-3'],
  ['002', 'occupy brooklyn — day 47 photographs',       '2011.10.30', 'occupy-bk.org/photo/d47/'],
  ['003', 'gezi park — eyewitness compilation',         '2013.06.01', 'gezi-eyewitness.tr/index'],
  ['004', 'hong kong umbrella docs, vol. 2',            '2014.09.28', 'hk-umbrella.archive/v2/manifest'],
  ['005', 'standing rock — legal filings',              '2016.04.01', 'nodapl.archive/legal/2016'],
  ['006', 'sudan revolution — songs and chants',        '2018.12.19', 'sudanuprising.org/audio/'],
  ['007', 'belarus 2020 — testimonies',                 '2020.08.09', 'by-witness.archive/testimony'],
  ['008', 'blm minneapolis — primary sources',          '2020.05.26', 'blm-mpls.archive/primary/'],
  ['009', 'iran women life freedom — journals',         '2022.09.16', 'jin-jiyan-azadi.archive/journals'],
  ['010', 'gaza solidarity — university statements',    '2023.10.20', 'campus-statements.archive/gaza'],
  ['011', 'letter to the editor, march',                '2019.03.04', 'archive.commons/ltr/0319'],
  ['012', 'march on washington — speech transcripts',   '1963.08.28', 'usnatarchive.gov/speech/mow-63'],
  ['013', 'tiananmen — foreign press cables',           '1989.06.04', 'declass.cables/cn-89/'],
  ['014', 'sharpeville inquiry — depositions',          '1960.03.21', 'truthcom.za/sharpe/depo'],
  ['015', 'soweto uprising — student diaries',          '1976.06.16', 'truthcom.za/soweto/diary'],
  ['016', 'plaza de mayo — letters from mothers',       '1977.04.30', 'madres.archive/letters/'],
  ['017', 'velvet revolution — leaflets scanned',       '1989.11.17', 'cs-velvet.archive/leaflets'],
  ['018', 'arab spring — friday sermons (audio)',       '2011.02.04', 'arabspring.archive/sermon-fri']
];

const ROT = ['█', '▓', '▒', '░', '·', ' ', '■', '▪', '▫'];
const INK = '#0a0a0a';
const VERM = '#d62410';

let cellH;
let listTop;

async function setup() {
  createCanvas(W, H);
  await document.fonts.ready;
  pixelDensity(2);
  textFont('IBM Plex Mono');
  cellH = 32;
  listTop = M + 200;
}

function draw() {
  background(245);

  // ------ slow timing
  const tSlow  = millis() / 3500;
  const tFast  = millis() / 520;
  const tMed   = millis() / 900;
  const tBeat  = millis() / 110;

  // ------ HEADER ------
  push();
  fill(INK);
  noStroke();
  textFont('Oswald');
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  textSize(112);
  text('ARCHIVE', M, M - 18);

  // 404 in vermillion, slight horizontal jitter from a fast wave
  const j404 = Waves.wave(0, { wave: 'fuzzy pulse', t: tFast, range: [-2, 2] });
  fill(VERM);
  text('404', M + 488, M - 18 + j404);
  pop();

  // sub-header rule
  push();
  stroke(INK); strokeWeight(2);
  line(M, M + 110, W - M, M + 110);
  pop();

  // sub-header text — corruption stamp
  push();
  fill(INK);
  noStroke();
  textFont('IBM Plex Mono');
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  textSize(12);
  const stampWave = Waves.wave(0, { wave: 'stepped sine', t: tMed, range: [0, 9] });
  const stamp = `index/${nf(floor(frameCount/4)%10000,4)}  ·  fragments  ·  undated  ·  accessed 2026.04.21  ·  cks ${nf(floor(stampWave*111)%999,3)}`;
  text(stamp, M, M + 124);

  // legend right
  textAlign(RIGHT, TOP);
  text('STATUS / 404 / GONE / REDACTED', W - M, M + 124);
  pop();

  // ------ LIST OF ENTRIES ------
  // Per-row decay value driven by a slow mountain-peaks wave
  // Offset per row spreads decay across the column
  for (let i = 0; i < ENTRIES.length; i++) {
    const y = listTop + i * cellH;
    const decay = Waves.wave(i * 0.42, {
      wave: 'mountain peaks',
      t: tSlow,
      range: [0.05, 0.92]
    });

    drawRow(i, y, decay, tFast, tMed, tBeat);
  }

  // ------ VERMILLION SWEEP — the act of deletion ------
  // Two staggered sweeps moving down the list at different speeds
  drawSweep(0, 6.0);
  drawSweep(0.43, 9.5);

  // ------ FOOTER LABELS ------
  push();
  fill(168);
  noStroke();
  textFont('IBM Plex Mono');
  textStyle(NORMAL);
  textSize(9.5);
  textAlign(LEFT, TOP);
  text('mountain peaks · fuzzy pulse · stepped sine', M, 870);

  textAlign(RIGHT, TOP);
  textSize(19);
  text('p5.waves', W - M, 854);
  pop();

  // title bottom-left
  push();
  fill(90, 90, 90);
  noStroke();
  textFont('Oswald');
  textStyle(LIGHT);
  textSize(22);
  textAlign(LEFT, TOP);
  text('the archive forgets', M, 854);
  pop();
}

function drawRow(rowIdx, y, decay, tFast, tMed, tBeat) {
  const entry = ENTRIES[rowIdx];
  const [num, title, date, url] = entry;

  // catalog number — Oswald bold, big
  push();
  fill(INK);
  noStroke();
  textFont('Oswald');
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  textSize(20);
  text(num, M, y + 5);
  pop();

  // body text — mono
  textFont('IBM Plex Mono');
  textStyle(NORMAL);
  textSize(13);
  textAlign(LEFT, TOP);

  // Compose the line: title (left), date (mid-right), url (far right area)
  // We render character-by-character so we can corrupt individually.
  const titleX = M + 60;
  const dateX  = M + 480;
  const urlX   = M + 600;

  drawCorruptedString(title, titleX, y + 8, decay, rowIdx, tFast, tMed, 0);
  drawCorruptedString(date,  dateX,  y + 8, decay * 0.7, rowIdx, tFast, tMed, 100);
  drawCorruptedString(url,   urlX,   y + 8, decay * 1.05, rowIdx, tFast, tMed, 200);

  // status sigil far right
  const sigilWave = Waves.wave(rowIdx * 7.3, {
    wave: 'fuzzy pulse',
    t: tBeat,
    range: [0, 3.99]
  });
  const sigil = decay > 0.65 ? '◼' : decay > 0.4 ? '▨' : decay > 0.18 ? '◫' : '◻';
  push();
  fill(decay > 0.55 ? VERM : INK);
  noStroke();
  textAlign(RIGHT, TOP);
  textSize(13);
  text(sigil, W - M, y + 8);
  pop();

  // hairline rule under each row, fading with decay
  push();
  stroke(0, 30 - decay * 25);
  strokeWeight(0.5);
  line(M, y + cellH - 2, W - M, y + cellH - 2);
  pop();
}

function drawCorruptedString(str, x, y, decay, rowIdx, tFast, tMed, offsetSeed) {
  const charW = 7.85; // approximate mono advance at size 13
  for (let c = 0; c < str.length; c++) {
    const ch = str.charAt(c);

    // Per-char fast wave decides if this char corrupts
    const corruptWave = Waves.wave(rowIdx * 17.1 + c * 3.7 + offsetSeed, {
      wave: 'fuzzy pulse',
      t: tFast,
      range: [0, 1]
    });

    // Per-char y-jitter (stuttering displacement)
    const jY = Waves.wave(rowIdx * 5.3 + c * 2.1 + offsetSeed * 0.3, {
      wave: 'stepped sine',
      t: tMed,
      range: [-1.6, 1.6]
    }) * (0.4 + decay * 1.6);

    let drawn = ch;
    let useVerm = false;

    if (ch !== ' ' && corruptWave < decay) {
      // pick a corruption glyph based on severity
      const sev = (decay - corruptWave) / max(decay, 0.001);
      let idx;
      if (sev > 0.75) idx = 0;          // █ full block
      else if (sev > 0.55) idx = 1;     // ▓
      else if (sev > 0.35) idx = 2;     // ▒
      else if (sev > 0.18) idx = 3;     // ░
      else if (sev > 0.08) idx = 4;     // ·
      else idx = 5;                     // space
      drawn = ROT[idx];
      // Heavy corruption stays black (photocopy ink); occasional vermillion flicker
      if (sev > 0.6 && (Waves.wave(rowIdx + c, { wave: 'pulse', t: tFast * 0.4, range: [0, 1] }) > 0.85)) {
        useVerm = true;
      }
    }

    push();
    noStroke();
    fill(useVerm ? VERM : INK);
    text(drawn, x + c * charW, y + jY);
    pop();
  }
}

function drawSweep(phaseOffset, period) {
  const list = ENTRIES.length;
  const totalH = list * cellH;
  const tNorm = ((millis() / 1000) / period + phaseOffset) % 1;
  const sweepY = listTop + tNorm * (totalH + cellH * 2) - cellH;
  const sweepH = cellH * 1.05;

  // Solid vermillion bar — the active deletion
  push();
  noStroke();
  fill(VERM);
  rect(M + 55, sweepY, W - M - (M + 55), sweepH - 6);
  pop();

  // White cuts that suggest the bar is "eating" the row
  push();
  noStroke();
  fill(245);
  for (let k = 0; k < 6; k++) {
    const cutX = Waves.wave(k * 11 + tNorm * 50, {
      wave: 'fuzzy pulse',
      t: millis() / 200,
      range: [0, W - M - (M + 55)]
    });
    rect(M + 55 + cutX, sweepY + 4, 3 + (k % 3), sweepH - 14);
  }
  pop();

  // Tiny white "deletion log" text on the bar
  push();
  fill(245);
  noStroke();
  textFont('IBM Plex Mono');
  textStyle(BOLD);
  textSize(11);
  textAlign(LEFT, CENTER);
  text('REDACTED  ·  REASON: —  ·  AUTHORITY: —', M + 65, sweepY + (sweepH - 6) / 2);
  pop();
}
