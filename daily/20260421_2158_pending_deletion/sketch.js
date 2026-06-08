// ABOUT       — a protest archive being deleted. Filenames, dates, testimony — a
//               working record of people who were here, vanishing at the rate a
//               content moderation queue can process it.
// GESTURE     — dissolve
// REFERENCE   — Pouët demoscene current: constraint as signal, text as weapon,
//               no apology for the pixels.
// COLOR       — Photocopy black + one red accent. The red is not decoration.
//               It is the redaction order.
// RISK        — making deletion look beautiful. Making the red feel like a
//               fashion accent rather than a stamp pressed into paper.
// MATERIAL    — four waves acting as erosion functions on a typographic
//               chorus: sharp peaks per-character in the headline, bald patch
//               across the archive list, stepped sine binary flicker on the
//               stamp glyphs, meta sine sweep for redaction bars.
//               Three tempos running at once: fast chars (/200), mid entries
//               (/750), slow stamp and redaction (/2400).

const W = 1080;
const M = 100;
const RED = [198, 30, 30];

const TITLE_LINES = ['WE WILL', 'NOT BE', 'ARCHIVED'];

const ARCHIVE = [
  '001  2024-06-12  protest_brooklyn.pdf',
  '002  2024-06-13  signatures_00382.csv',
  '003  2024-06-15  testimony_anon_04.wav',
  '004  2024-06-18  photographs_batch02.zip',
  '005  2024-06-19  statement_draft.docx',
  '006  2024-06-22  legal_notice_response.pdf',
  '007  2024-06-24  video_rally_march.mp4',
  '008  2024-06-27  transcript_meeting.txt',
  '009  2024-07-01  manifesto_final_v3.pdf',
  '010  2024-07-03  list_of_names.csv',
];

const GLITCH = ['/', '\\', '|', '#', '+', '=', '*', '.', ':', '-'];

let titleSampler, entrySampler, strikeSampler, stampSampler, barSampler;

async function setup() {
  createCanvas(W, W);
  pixelDensity(2);
  await document.fonts.ready;
  noStroke();

  titleSampler = Waves.createSampler({
    wave: 'sharp peaks',
    range: [0, 100],
    frequency: 1.1,
  });

  entrySampler = Waves.createSampler({
    wave: 'bald patch',
    range: [0, 100],
    frequency: 0.9,
  });

  strikeSampler = Waves.createSampler({
    wave: 'wobble sine',
    range: [-14, 14],
    frequency: 2.2,
  });

  stampSampler = Waves.createSampler({
    wave: 'stepped sine',
    range: [0, 100],
    frequency: 1.0,
  });

  barSampler = Waves.createSampler({
    wave: 'meta sine',
    range: [0, 100],
    frequency: 0.6,
  });
}

function draw() {
  background(245);
  if (typeof titleSampler === 'undefined') return;

  const tFast = millis() / 200;
  const tMid  = millis() / 750;
  const tSlow = millis() / 2400;

  drawHeader();
  drawTitle(tFast);
  drawRedactionBars(tSlow);
  drawArchiveList(tMid);
  drawStamp(tSlow);
  drawLabels();
}

// ----------------------------------------------------------------------------

function drawHeader() {
  noStroke();
  fill(0);
  drawingContext.font = '500 11px "IBM Plex Mono", monospace';
  drawingContext.textBaseline = 'top';
  drawingContext.textAlign = 'left';
  drawingContext.fillStyle = '#000';
  drawingContext.fillText('ARCHIVE_ID 7742  //  STATUS  PENDING_DELETION  //  T-00:00:00', M, M);
  drawingContext.fillText('LAST_MOD 2024-07-03   ENTRIES 10   INTEGRITY DISSOLVING', M, M + 16);

  drawingContext.textAlign = 'right';
  drawingContext.fillStyle = 'rgb(198,30,30)';
  drawingContext.fillText('// 404_NOT_FOUND', W - M, M);
  drawingContext.fillStyle = '#000';
  drawingContext.fillText('order: REDACT_ALL', W - M, M + 16);
}

function drawTitle(t) {
  drawingContext.font = 'bold 200px "Oswald", sans-serif';
  drawingContext.textBaseline = 'top';
  drawingContext.textAlign = 'left';

  const lineGap = 170;
  const startY = 160;

  for (let li = 0; li < TITLE_LINES.length; li++) {
    drawDissolvingText(TITLE_LINES[li], M, startY + li * lineGap, t + li * 0.45);
  }
}

function drawDissolvingText(s, x, y, t) {
  const ctx = drawingContext;
  let cx = x;
  ctx.font = 'bold 200px "Oswald", sans-serif';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === ' ') {
      cx += ctx.measureText(' ').width;
      continue;
    }
    const val = titleSampler.sample(i * 0.6 + x * 0.001, t);
    const w = ctx.measureText(ch).width;

    if (val < 22) {
      // vanished — leave a faint dot
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.font = '500 20px "IBM Plex Mono", monospace';
      ctx.fillText('·', cx + w * 0.45, y + 80);
      ctx.font = 'bold 200px "Oswald", sans-serif';
    } else if (val < 46) {
      // glitched replacement glyph
      ctx.fillStyle = '#000';
      const idx = Math.floor(val * 1.7 + i) % GLITCH.length;
      ctx.font = 'bold 140px "Oswald", sans-serif';
      ctx.fillText(GLITCH[idx], cx + w * 0.15, y + 25);
      ctx.font = 'bold 200px "Oswald", sans-serif';
    } else if (val < 64) {
      // faint ghost
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.fillText(ch, cx, y);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillText(ch, cx, y);
    }
    cx += w;
  }
}

function drawRedactionBars(t) {
  const startY = 160;
  const lineGap = 170;
  drawingContext.fillStyle = `rgb(${RED[0]},${RED[1]},${RED[2]})`;
  for (let li = 0; li < TITLE_LINES.length; li++) {
    const v = barSampler.sample(li * 1.3, t);
    if (v > 62) {
      const barW = mapVal(v, 62, 100, 90, 360);
      const barX = M + ((li * 137 + 40) % 260);
      const y = startY + li * lineGap + 74;
      drawingContext.fillRect(barX, y, barW, 38);
    }
  }
}

function drawArchiveList(t) {
  const ctx = drawingContext;
  ctx.font = '500 15px "IBM Plex Mono", monospace';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  const startY = 690;
  const lineH = 20;

  for (let li = 0; li < ARCHIVE.length; li++) {
    const y = startY + li * lineH;
    const entry = ARCHIVE[li];
    const erode = entrySampler.sample(li * 0.7 + 0.3, t);

    let cx = M;
    for (let i = 0; i < entry.length; i++) {
      const ch = entry[i];
      const local = (erode + i * 2.9 + li * 7) % 100;
      const w = ctx.measureText(ch).width;

      if (local < 18) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillText('·', cx, y);
      } else if (local < 28) {
        ctx.fillStyle = 'rgba(0,0,0,0.32)';
        ctx.fillText(ch, cx, y);
      } else {
        ctx.fillStyle = '#000';
        ctx.fillText(ch, cx, y);
      }
      cx += w;
    }

    // red strikethrough on heavily-eroded lines
    if (erode > 58) {
      const yOff = strikeSampler.sample(li, t);
      const sy = y + 9 + yOff * 0.2;
      ctx.strokeStyle = `rgb(${RED[0]},${RED[1]},${RED[2]})`;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(M - 6, sy);
      ctx.lineTo(M + mapVal(erode, 58, 100, 180, 520), sy);
      ctx.stroke();
    }
  }
}

function drawStamp(t) {
  const ctx = drawingContext;
  ctx.save();
  ctx.translate(W - 340, 560);
  ctx.rotate(-0.14);

  // box
  ctx.strokeStyle = `rgb(${RED[0]},${RED[1]},${RED[2]})`;
  ctx.lineWidth = 9;
  ctx.strokeRect(-22, -14, 430, 140);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-22, 68);
  ctx.lineTo(408, 68);
  ctx.stroke();

  // stamped word — eroded
  ctx.font = 'bold 118px "Oswald", sans-serif';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  const word = 'DELETED';
  let cx = 0;
  for (let i = 0; i < word.length; i++) {
    const val = stampSampler.sample(i * 0.85, t);
    const w = ctx.measureText(word[i]).width;
    if (val > 30) {
      const a = mapVal(val, 30, 100, 0.55, 1.0);
      ctx.fillStyle = `rgba(${RED[0]},${RED[1]},${RED[2]},${a})`;
      ctx.fillText(word[i], cx, -12);
    }
    cx += w;
  }

  // sub-line inside box
  ctx.font = '500 12px "IBM Plex Mono", monospace';
  ctx.fillStyle = `rgb(${RED[0]},${RED[1]},${RED[2]})`;
  ctx.fillText('REDACTION_ORDER_7742', 0, 90);

  // date stamp under
  ctx.font = '500 11px "IBM Plex Mono", monospace';
  ctx.fillStyle = `rgba(${RED[0]},${RED[1]},${RED[2]},0.88)`;
  ctx.fillText('EXECUTED 2024-07-11  //  NO APPEAL', 0, 148);

  ctx.restore();
}

function drawLabels() {
  const ctx = drawingContext;

  // title label
  ctx.font = '300 22px "Oswald", sans-serif';
  ctx.fillStyle = 'rgba(90,90,90,0.95)';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText('pending deletion', M, 854);

  // wave name
  ctx.font = '400 9.5px "IBM Plex Mono", monospace';
  ctx.fillStyle = 'rgb(168,168,168)';
  ctx.fillText('sharp peaks / bald patch / stepped sine / meta sine', M, 870);

  // right label
  ctx.font = '400 19px "IBM Plex Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgb(168,168,168)';
  ctx.fillText('p5.waves', W - M, 854);

  // reset
  ctx.textAlign = 'left';
}

// ----------------------------------------------------------------------------

function mapVal(v, a, b, c, d) {
  return c + (d - c) * ((v - a) / (b - a));
}
