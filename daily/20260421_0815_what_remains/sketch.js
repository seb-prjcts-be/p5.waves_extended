/*
================================================================
 what remains — 2026·04·21
----------------------------------------------------------------
 ABOUT      a protest archive, being deleted. the index stays
            on file — dates, IDs, filenames, authority intact —
            but the voices are drifting off the page, offset
            from their rows, fading through the ink. the record
            is legible. the meaning is escaping.
 GESTURE    whisper
 REFERENCE  Sub Studio / Superimpose Global — editorial design
            as spatial thinking. the page itself carries the
            argument; the composition is the argument.
 COLOR      risograph mistake — misregistered duotone, black
            plate and riso red plate on cream 245. channel
            separation is the subject. the red has drifted off
            the black. the gap between them is the work.
 RISK       whispered piece. commitment to quietness — no
            blocked-out letters, no shouting censor bars, no
            poster-graphic energy. if it reads as "nothing
            happening" it failed. if it reads as "you have
            to lean in" it worked. restraint is the gamble.
 MATERIAL   smooth solid sine → red plate drift (very slow)
            grow random       → per-entry voice decay
            wobble sine       → per-letter fade modulation
            fuzzy pulse       → subtle ink-variance on black
            stepped sine      → stuttering subheader date
            multi-speed chorus · typographic structure
================================================================
*/

const W = 1080;
const H = 1080;
const M = 100;
const BG = 245;
const INK = [16, 16, 18];
const RED = [241, 80, 96];
const MUTED = 168;

const ENTRIES = [
  { id: '0001', date: '2019 · 03 · 14', file: 'doc_0001.txt', phrase: 'we were here' },
  { id: '0002', date: '2019 · 06 · 09', file: 'doc_0002.pdf', phrase: 'say their names' },
  { id: '0003', date: '2020 · 01 · 11', file: 'img_0003.jpg', phrase: 'not a slogan' },
  { id: '0004', date: '2020 · 05 · 28', file: 'doc_0004.txt', phrase: 'witness' },
  { id: '0005', date: '2021 · 02 · 02', file: 'vid_0005.mov', phrase: 'remember' },
  { id: '0006', date: '2021 · 08 · 17', file: 'doc_0006.txt', phrase: 'no justice' },
  { id: '0007', date: '2022 · 04 · 05', file: 'img_0007.jpg', phrase: 'documented' },
  { id: '0008', date: '2022 · 10 · 22', file: 'doc_0008.pdf', phrase: 'everyone saw' },
  { id: '0009', date: '2023 · 03 · 19', file: 'aud_0009.mp3', phrase: 'it happened' },
  { id: '0010', date: '2023 · 07 · 01', file: 'doc_0010.txt', phrase: 'we kept the tapes' },
  { id: '0011', date: '2024 · 01 · 30', file: 'img_0011.jpg', phrase: 'still here' },
  { id: '0012', date: '2024 · 09 · 11', file: 'doc_0012.txt', phrase: 'make a copy' },
];

const LINE_H = 38;
const BODY_TOP = 340;
const COL_X = { id: 0, date: 80, file: 270, phrase: 490 };

const TITLE_STRING = 'what remains';
const ACTIVE_WAVE = 'grow random';

const rowY = (i) => BODY_TOP + i * LINE_H;
const inkRGBA = (a) => `rgba(${INK[0]},${INK[1]},${INK[2]},${a})`;
const redRGBA = (a) => `rgba(${RED[0]},${RED[1]},${RED[2]},${a})`;

async function setup() {
  const canvas = createCanvas(W, H);
  canvas.parent('sketch');
  pixelDensity(1);
  await document.fonts.ready;
  noStroke();
}

function draw() {
  background(BG);
  const t = millis() / 1000;

  // per-entry decay, shared by both plates
  const decay = new Array(ENTRIES.length);
  for (let i = 0; i < ENTRIES.length; i++) {
    decay[i] = Waves.wave(0, {
      wave: 'grow random',
      seed: i * 17 + 5,
      t: t * 0.28,
      range: [0, 1.1],
      mode: 'wild',
      unpredictability: 0.3,
    });
  }

  // slow page breath
  const breath = Waves.wave(0, {
    wave: 'smooth solid sine',
    t: t * 0.08,
    amplitude: 1.3,
  });

  push();
  translate(0, breath);

  drawBlackPlate(t);

  // red plate misregistration — drifts off the black plate
  const plateDX = Waves.wave(0, {
    wave: 'smooth solid sine',
    seed: 3,
    t: t * 0.19,
    amplitude: 7,
  });
  const plateDY = Waves.wave(0, {
    wave: 'smooth solid sine',
    seed: 17,
    t: t * 0.15,
    amplitude: 3.5,
  });

  push();
  translate(plateDX, plateDY);
  drawRedPlate(t, decay);
  pop();

  drawFooter(t, decay);

  pop();

  drawLabels();
}

function subheaderDate(t) {
  const idx = Math.floor(Waves.wave(0, {
    wave: 'stepped sine',
    t: t * 0.32,
    range: [0, 4.99],
  }));
  const variants = [
    '2026 · 04 · 21',
    '2026 · 04 · ██',
    '2026 · ██ · 21',
    '████ · 04 · 21',
    '████ · ██ · ██',
  ];
  return variants[((idx % variants.length) + variants.length) % variants.length];
}

function drawBlackPlate(t) {
  const ctx = drawingContext;

  // stamped header — authority
  ctx.font = '700 56px "Oswald", sans-serif';
  ctx.fillStyle = inkRGBA(1);
  ctx.fillText('PROTEST  ARCHIVE', M, 200);

  // red annotation on header — tells you the plate is unstable
  ctx.font = '500 11px "IBM Plex Mono", monospace';
  ctx.fillStyle = redRGBA(0.85);
  ctx.fillText('PLATE 02  ·  OFFSET UNSTABLE', M + 515, 198);

  // subheader: stuttering metadata
  ctx.font = '400 12px "IBM Plex Mono", monospace';
  ctx.fillStyle = inkRGBA(1);
  ctx.fillText(
    `INDEX  ·  LAST VERIFIED  ${subheaderDate(t)}  ·  ${ENTRIES.length} ENTRIES  ·  RECORD INTACT / VOICES DRIFTING`,
    M,
    244
  );

  // top rule
  ctx.strokeStyle = inkRGBA(1);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(M, 272);
  ctx.lineTo(W - M, 272);
  ctx.stroke();

  // column headers
  ctx.font = '500 10px "IBM Plex Mono", monospace';
  ctx.fillStyle = inkRGBA(0.55);
  ctx.fillText('ID',       M + COL_X.id,     300);
  ctx.fillText('DATE',     M + COL_X.date,   300);
  ctx.fillText('FILENAME', M + COL_X.file,   300);
  ctx.fillText('MESSAGE',  M + COL_X.phrase, 300);

  // hairline under headers
  ctx.strokeStyle = inkRGBA(0.35);
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(M, 312);
  ctx.lineTo(W - M, 312);
  ctx.stroke();

  // entries — metadata only (no phrases here — that's the red plate)
  for (let i = 0; i < ENTRIES.length; i++) {
    const e = ENTRIES[i];
    const y = rowY(i);

    // subtle ink variance per row
    const variance = Waves.wave(i * 0.7, {
      wave: 'fuzzy pulse',
      seed: i * 31 + 2,
      t: t * 0.45,
      range: [0.82, 1.0],
    });

    ctx.font = '400 16px "IBM Plex Mono", monospace';
    ctx.fillStyle = inkRGBA(variance);
    ctx.fillText(e.id,   M + COL_X.id,   y);
    ctx.fillText(e.date, M + COL_X.date, y);
    ctx.fillText(e.file, M + COL_X.file, y);

    // ghost dots in the message column — marking where voices should be
    ctx.fillStyle = inkRGBA(0.11);
    ctx.font = '400 16px "IBM Plex Mono", monospace';
    const dots = '· · · · · · · · · · · · · · · · · · · · · · · · · ·';
    ctx.fillText(dots, M + COL_X.phrase, y);
  }
}

function drawRedPlate(t, decay) {
  const ctx = drawingContext;
  ctx.font = '400 17px "IBM Plex Mono", monospace';

  for (let i = 0; i < ENTRIES.length; i++) {
    const d = decay[i];
    if (d > 0.95) continue; // phrase is gone — silence on the red plate

    const y = rowY(i);
    const e = ENTRIES[i];
    const str = '"' + e.phrase + '"';

    // voice alpha falls with decay; age (older = further down list) adds a
    // bit of extra fade so the older voices are quieter
    const age = i / (ENTRIES.length - 1); // 0..1
    const baseA = Math.max(0, (1 - d) * 0.78) * (1 - age * 0.22);

    // phrase-level lateral drift — age amplifies
    const voiceJitX = Waves.wave(0, {
      wave: 'wobble sine',
      seed: i * 41 + 3,
      t: t * 0.22,
      amplitude: 1.5 + age * 5,
    });
    const voiceJitY = Waves.wave(0, {
      wave: 'wobble sine',
      seed: i * 47 + 19,
      t: t * 0.18,
      amplitude: 0.6 + age * 2.2,
    });

    let cursorX = M + COL_X.phrase + voiceJitX;
    const yy = y + voiceJitY;

    for (let li = 0; li < str.length; li++) {
      const ch = str[li];
      const charW = ctx.measureText(ch).width;

      if (ch === ' ') {
        cursorX += charW;
        continue;
      }

      // per-letter fade modulation — wobble sine gives soft breathing
      const letterMod = Waves.wave(li * 0.45, {
        wave: 'wobble sine',
        seed: i * 73 + li * 7,
        t: t * 0.38,
        range: [0.35, 1.0],
      });

      // per-letter dropout driven by fuzzy pulse + entry decay
      const dropNoise = Waves.wave(li * 0.3, {
        wave: 'fuzzy pulse',
        seed: i * 97 + li * 11,
        t: t * 0.52,
        range: [0, 1],
        unpredictability: 0.3,
        mode: 'wild',
      });
      const dropThreshold = 0.82 - d * 0.52;

      if (dropNoise < dropThreshold) {
        const alpha = baseA * letterMod;
        if (alpha > 0.03) {
          ctx.fillStyle = redRGBA(alpha);
          ctx.fillText(ch, cursorX, yy);
        }
      }
      cursorX += charW;
    }
  }
}

function drawFooter(t, decay) {
  const ctx = drawingContext;
  const ruleY = rowY(ENTRIES.length) + 8;

  ctx.strokeStyle = inkRGBA(1);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(M, ruleY);
  ctx.lineTo(W - M, ruleY);
  ctx.stroke();

  // count missing — entries whose voices are mostly eaten
  let missing = 0, unstable = 0;
  for (let i = 0; i < decay.length; i++) {
    if (decay[i] > 0.55) missing++;
    else if (decay[i] > 0.25) unstable++;
  }
  const pad2 = (n) => (n < 10 ? '0' : '') + n;

  ctx.font = '400 11px "IBM Plex Mono", monospace';
  ctx.fillStyle = inkRGBA(1);
  ctx.fillText(
    `MISSING ${pad2(missing)}  ·  UNSTABLE ${pad2(unstable)}  ·  RECOVERABLE ${pad2(ENTRIES.length - missing - unstable)}  /  ${pad2(ENTRIES.length)} TOTAL`,
    M,
    ruleY + 24
  );

  ctx.fillStyle = redRGBA(0.78);
  ctx.fillText(
    'DO NOT RECOMPILE  ·  ORIGINAL VOICES UNRECOVERABLE  ·  THE RECORD IS NOT THE EVENT',
    M,
    ruleY + 44
  );
}

function drawLabels() {
  const ctx = drawingContext;

  // active wave name (above title)
  ctx.font = '400 9.5px "IBM Plex Mono", monospace';
  ctx.fillStyle = `rgb(${MUTED},${MUTED},${MUTED})`;
  ctx.textAlign = 'left';
  ctx.fillText(ACTIVE_WAVE, M, 870);

  // sketch title
  ctx.font = '300 22px "Oswald", sans-serif';
  ctx.fillStyle = 'rgba(90,90,90,0.95)';
  ctx.fillText(TITLE_STRING, M, 954);

  // p5.waves mark
  ctx.font = '400 19px "IBM Plex Mono", monospace';
  ctx.fillStyle = `rgb(${MUTED},${MUTED},${MUTED})`;
  ctx.textAlign = 'right';
  ctx.fillText('p5.waves', W - M, 954);
  ctx.textAlign = 'left';
}
