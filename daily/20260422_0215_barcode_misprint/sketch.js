// ABOUT: a product barcode that misprinted. The CMY plates were off-register
//        in the press; the code never scans. What you are reading is the library's
//        own wave taxonomy, exposed as the misprint — each column is a different
//        named wave, stretched vertical, pretending to be a stripe.
// GESTURE: break.
// REFERENCE ANCHOR: Grilli Type specimens — type-as-stage; here wave-as-stage.
// SEB ANCHOR: p5.wavesX100 — this is a single-frame, compressed 34-specimen
//             cousin of that 100-sketch gallery.
// LIBRARY MOVE: select by index (Waves.wave(y, { wave: i })) + range mapping.
//               Every column i pulls Waves.list()[i] and maps it to a strict x-range.
//               Across the piece, all 34 waves are on screen at once.
// COLOR COMMITMENT: Pure CMY, hand-picked process approximations (no black —
//                   channel overlaps generate the darks).
//   C  #00AEEF   M  #EC008C   Y  #FFF200
// RISK: a specimen chart reads as a textbook. The break is enforced by three
//       offset CMY passes, a slow index-dependent x-offset, and noise() drop-outs
//       that refuse certain columns each frame.
// TIMING: millis()/2400 — slow drift. millis()/1000 is banned.
// STRUCTURE: grid (34 specimen columns, no symmetry — CMY offsets see to that).
// WAVE COUNT: chorus — every wave in the library, simultaneous.
// WAVE CHOICE: none (select by index surfaces all of them). The active wave name
//              shown in the label rotates so a viewer can read the taxonomy entry
//              currently being emphasized in the title row.
// FONT: artwork type is absent by design — the label band carries the only type.
//       Label band: Oswald 300 (title), IBM Plex Mono 400 (wave name + credit).

const CANVAS = 1080;
const M      = 100;

const CYAN    = [0,   174, 239];
const MAGENTA = [236, 0,   140];
const YELLOW  = [255, 242, 0];

let waveNames = [];
let activeWaveName = '';

async function setup() {
  createCanvas(CANVAS, CANVAS);
  pixelDensity(1);
  await document.fonts.ready;
  waveNames = Waves.list().map(w => w.name);
  noFill();
}

function draw() {
  background(245);
  const t = millis() / 2400;

  const cols  = waveNames.length;        // 34
  const artX0 = M;
  const artX1 = CANVAS - M;
  const artY0 = M;
  const artY1 = 940;                     // clean buffer before label band
  const artW  = artX1 - artX0;
  const colW  = artW / cols;

  // Which wave name to surface in the label — rotates slowly (~9s / wave).
  const activeIdx = Math.floor(t * 0.45) % cols;
  activeWaveName  = '#' + activeIdx + '  ' + waveNames[activeIdx];

  // Active-column highlight plate (soft warm cream — stays in palette family).
  noStroke();
  fill(245);
  rect(artX0 + activeIdx * colW, artY0, colW, artY1 - artY0);
  stroke(0, 24);
  strokeWeight(0.5);
  noFill();
  rect(artX0 + activeIdx * colW, artY0, colW, artY1 - artY0);

  // Three CMY passes — each offset further; the press was REALLY off today.
  const passes = [
    { col: CYAN,    dx:  6.5, dt: 0.00 },
    { col: MAGENTA, dx: -9.0, dt: 0.31 },
    { col: YELLOW,  dx:  3.4, dt: 0.59 },
  ];

  for (let i = 0; i < cols; i++) {
    const x0 = artX0 + i * colW;
    const cx = x0 + colW * 0.5;

    // Dropouts — actual noise() because this is noise, not a wave wearing a wig.
    const health = noise(i * 0.23, t * 0.11);
    if (health < 0.18) continue;

    // Per-column skew — the whole page tilts; breaks the textbook grid.
    const skew = (i - cols / 2) * 0.55;

    // Individual column per-frame x-wobble: wave drives wave — one low-freq
    // sway samples index 0 at a slow t and offsets the whole stripe a few px.
    const wobble = Waves.wave(i * 0.37, {
      wave: 0, t: t * 0.15, range: [-4, 4],
    });

    for (const pass of passes) {
      stroke(pass.col[0], pass.col[1], pass.col[2], 230);
      strokeWeight(1.05);

      beginShape();
      for (let y = artY0; y <= artY1; y += 3) {
        // LIBRARY MOVE: select-by-index (wave: i) + range mapping.
        const x = Waves.wave(y * 0.018, {
          wave:      i,
          t:         t + pass.dt,
          frequency: 1.15,
          phase:     i * 0.23,
          mode:      'stable',
          range:     [cx - colW * 0.44, cx + colW * 0.44],
        });
        vertex(x + pass.dx + skew + wobble, y);
      }
      endShape();
    }
  }

  // Index ticks across the top — every 5th column, tiny, black.
  // Reads as a scanner's edge marks, binds the specimens into a code.
  noStroke();
  fill(0);
  for (let i = 0; i < cols; i++) {
    const cx = artX0 + i * colW + colW * 0.5;
    if (i % 5 === 0) {
      circle(cx, M - 22, 2.8);
      // tiny index numeral
      push();
        textFont('IBM Plex Mono');
        textSize(8);
        textAlign(CENTER, BASELINE);
        fill(0, 160);
        text(i, cx, M - 30);
      pop();
    }
  }

  // Clean 245 plate before labels — guarantees label legibility.
  noStroke();
  fill(245);
  rect(0, artY1 + 5, CANVAS, CANVAS - (artY1 + 5));

  drawLabels();
}

function drawLabels() {
  push();
    resetMatrix();
    blendMode(BLEND);
    noStroke();
    textAlign(LEFT, BASELINE);
    fill(0);
    textFont('Oswald');
    textSize(26);
    textStyle(NORMAL);
    text('barcode_misprint', M, 1020);

    textFont('IBM Plex Mono');
    textSize(11);
    text(activeWaveName, M, 1040);

    textAlign(RIGHT, BASELINE);
    textSize(22);
    text('p5.waves', CANVAS - M, 1020);
  pop();
}
