/*
  ABOUT:   old MSN away messages — the performance of unavailability.
           Status text from 2003-2008 messenger culture: "brb", "busy",
           song lyrics as mood, half-sentences pleading for attention.
           An archive that cannot sit still — the stutter of
           identity-through-status, a log that refuses to be logged.

  GESTURE: stutter — characters flicker between vertical positions,
           words fracture, glyphs drop out of their line and return.

  REF:     Y2K / brutalist web revival — MSN window chrome ghosts,
           red offline/away dot, pixel-edged UI from 2004 deconstructed.

  COLOR:   Photocopy black + red accent. Black carries the archive;
           red is the only hue that arrives at full strength.

  RISK:    nostalgia flattens into kitsch. The counter is formal:
           the stutter has to be severe enough to break readability,
           not cute enough to be retro-charming.

  MATERIAL: t = millis() / 120. Per-char y-offset from per-line morph
           samplers (fuzzy pulse <-> stepped sine). Red dot size pulses
           via 'up down pulse'. Occasional glyph-drop via 'grow random'
           above a threshold. Chorus of 37 samplers.
*/

const MARGIN = 100;
const RED = [215, 40, 45];

const ENTRIES = [
  ['x0x0_kelly',        'brb',                          '21:04'],
  ['deathcab4ever_',    'still up',                     '21:08'],
  ['~*LiL_mAtT*~',      'at soccer',                    '21:11'],
  ['a.s.l.18/f/ca',     'mom',                          '21:15'],
  ['ghost.in.shell',    'writing u a letter',           '21:19'],
  ['emo_bear_666',      ':-/',                          '21:23'],
  ['princess.peach',    'ttyl',                         '21:27'],
  ['cruel_summer_05',   'doing homework (not really)',  '21:31'],
  ['bella_hater',       'idk',                          '21:35'],
  ['.:*vampira*:.',     'gone',                         '21:39'],
  ['~iron_wine~',       'in love w her',                '21:43'],
  ['xXx_faded_xXx',     'appears offline',              '21:47'],
];

let lineSamplers = [];
let dotSamplers  = [];
let dropSamplers = [];
let titleSampler;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;

  for (let i = 0; i < ENTRIES.length; i++) {
    lineSamplers.push(Waves.createSampler({
      wave: ['fuzzy pulse', 'stepped sine'],
      range: [-14, 14],
      seed: i * 3 + 1,
      frequency: 0.9 + (i % 4) * 0.15,
    }));
    dotSamplers.push(Waves.createSampler({
      wave: 'up down pulse',
      range: [4, 11],
      seed: 77 + i,
      frequency: 1.3,
    }));
    dropSamplers.push(Waves.createSampler({
      wave: 'grow random',
      range: [0, 60],
      seed: 13 + i * 7,
      frequency: 0.4,
      mode: 'wild',
      unpredictability: 0.35,
    }));
  }

  titleSampler = Waves.createSampler({
    wave: ['stepped sine', 'zig-zag sine'],
    range: [-3, 3],
    seed: 9,
    frequency: 1.1,
  });
}

function setF(weight, size, family) {
  drawingContext.font = `${weight} ${size}px ${family}`;
}

function draw() {
  background(245);
  const t = millis() / 120;

  drawChrome(t);
  drawEntries(t);
  drawTyping(t);
  drawLabel();
}

function drawChrome(t) {
  noStroke();
  fill(15);
  rect(MARGIN, 120, 1080 - MARGIN * 2, 64);

  fill(245);
  setF(700, 22, 'Oswald');
  textAlign(LEFT, BASELINE);
  const title = 'MSN MESSENGER — STATUS ARCHIVE';
  let tx = MARGIN + 18;
  const ty = 120 + 40;
  for (let i = 0; i < title.length; i++) {
    const dy = titleSampler.sample(i * 0.9, t * 0.008, 0.5);
    text(title[i], tx, ty + dy);
    tx += textWidth(title[i]);
  }

  const xSize = 24;
  const xx = 1080 - MARGIN - 14 - xSize;
  const xy = 120 + 32 - xSize / 2;
  fill(...RED);
  rect(xx, xy, xSize, xSize);
  fill(245);
  setF(700, 16, 'IBM Plex Mono');
  textAlign(CENTER, CENTER);
  text('×', xx + xSize / 2, xy + xSize / 2 + 1);

  stroke(15);
  strokeWeight(2);
  line(MARGIN, 196, 1080 - MARGIN, 196);
  noStroke();
}

function drawEntries(t) {
  const topY  = 232;
  const lineH = 47;

  for (let i = 0; i < ENTRIES.length; i++) {
    const [user, message, time] = ENTRIES[i];
    const y = topY + i * lineH;

    const dotS = dotSamplers[i].sample(i * 0.4, t * 0.012);
    fill(...RED);
    noStroke();
    circle(MARGIN + 10, y - 9, dotS);

    fill(115);
    setF(400, 11, 'IBM Plex Mono');
    textAlign(LEFT, BASELINE);
    text(user, MARGIN + 28, y);

    fill(15);
    setF(400, 28, 'Oswald');
    const mixVal = (Math.sin(t * 0.004 + i * 0.6) + 1) / 2;

    let x = MARGIN + 210;
    for (let c = 0; c < message.length; c++) {
      const ch = message[c];
      const dy = lineSamplers[i].sample(c * 0.55, t * 0.006, mixVal);
      const dropVal = dropSamplers[i].sample(c * 1.3, t * 0.004, 0.5);
      const drop = dropVal > 48 ? dropVal - 48 : 0;
      text(ch, x, y + dy + drop);
      x += textWidth(ch);
    }

    fill(115);
    setF(400, 10, 'IBM Plex Mono');
    textAlign(RIGHT, BASELINE);
    text(time, 1080 - MARGIN - 8, y);
  }
}

function drawTyping(t) {
  const y = 818;
  fill(115);
  setF(400, 11, 'IBM Plex Mono');
  textAlign(LEFT, BASELINE);
  const label = 'someone is typing';
  text(label, MARGIN, y);

  const lw = textWidth(label);
  for (let i = 0; i < 3; i++) {
    const s = Waves.wave(t * 0.02 + i * 2.1, {
      wave: 'up down pulse',
      seed: 200 + i * 11,
      range: [2, 7],
    });
    fill(...RED);
    noStroke();
    circle(MARGIN + lw + 12 + i * 12, y - 3, s);
  }
}

function drawLabel() {
  push();
  setF(300, 22, 'Oswald');
  fill(90, 90, 90, 242);
  textAlign(LEFT, BASELINE);
  text('brb (idle)', MARGIN, 854);

  setF(400, 9.5, 'IBM Plex Mono');
  fill(168);
  text('fuzzy pulse ↔ stepped sine', MARGIN, 870);

  setF(400, 19, 'IBM Plex Mono');
  textAlign(RIGHT, BASELINE);
  text('p5.waves', 1080 - MARGIN, 854);
  pop();
}
