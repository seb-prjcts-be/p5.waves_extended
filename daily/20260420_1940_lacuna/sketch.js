/*
 * lacuna — daily p5.waves · 2026-04-20 19:40
 *
 * FEELING        absence. A pattern that keeps skipping itself — gaps where
 *                there should be signal, a page where some lines refuse to speak.
 *
 * WAVE LOGIC     duo in tension.
 *                — 'bald patch' is the quiet body: soft modulations punctuated by
 *                  stretches of near-flatness, mirroring the way memory or
 *                  text can fall out for whole sentences at a time.
 *                — 'grow random' is the rupture: seed-driven, unstable, refusing
 *                  to hold a contour. It interrupts the strata where the lacuna
 *                  opens up.
 *
 * TIME LOGIC     multi-speed.
 *                — tSlow = millis() / 2600 carries the bald-patch strata in a
 *                  geological drift — nothing obviously moves, but the contours
 *                  settle and re-form across long cycles.
 *                — tFast = millis() / 210 drives the rupture lines with a
 *                  nervous pulse that reads as fragile, glitch-like.
 *                — a third tick (/ 4200) slowly repositions which lines are
 *                  ruptured, so the lacuna itself migrates vertically.
 *
 * STRUCTURAL     dense horizontal stratum: 72 contour slices stacked inside the
 * MOVE           safe frame. A single continuous pattern chooses which lines
 *                rupture, producing a vertical "patch" of absence that drifts
 *                through the page over ~70 seconds.
 */

const W = 900;
const H = 900;
const M = 100;
const LINES = 72;

let quietSampler;
let ruptureSampler;
let patchSampler;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(2);
  await document.fonts.ready;

  quietSampler = Waves.createSampler({
    wave: 'bald patch',
    range: [-8, 8],
    frequency: 1.15,
    seed: 3,
  });

  ruptureSampler = Waves.createSampler({
    wave: 'grow random',
    range: [-24, 24],
    frequency: 0.85,
    unpredictability: 0.3,
    seed: 17,
  });

  // Slowly drifting envelope that decides which lines belong to the lacuna.
  patchSampler = Waves.createSampler({
    wave: 'mountain peaks',
    range: [0, 1],
    frequency: 0.6,
    seed: 5,
  });

  noLoop();
  loop();
}

function __p5wSourceDraw() {
  background(245);

  const tSlow  = millis() / 2600;
  const tFast  = millis() / 210;
  const tDrift = millis() / 4200;

  // Reference frame — thin inner mark, structural geometry, not decoration.
  noFill();
  stroke(60, 26);
  strokeWeight(0.6);
  rect(M, M, W - 2 * M, H - 2 * M);

  const top    = M + 34;
  const bottom = H - M - 74;
  const step   = (bottom - top) / (LINES - 1);

  for (let i = 0; i < LINES; i++) {
    const y0 = top + i * step;
    const lineN = i / (LINES - 1);

    // Is this line inside the drifting lacuna?
    const envelope = patchSampler.sample(lineN * 2.8, tDrift);
    const ruptured = envelope > 0.62;

    // Faint tick on the left margin for every line — a page-edge register.
    noStroke();
    fill(160, 70);
    rect(M - 8, y0 - 0.3, 4, 0.6);

    noFill();
    if (ruptured) {
      stroke(22, 215);
      strokeWeight(1.15);
    } else {
      stroke(74, 150);
      strokeWeight(0.7);
    }

    beginShape();
    for (let x = M; x <= W - M; x += 2) {
      const u = (x - M) / (W - 2 * M);
      let dy;
      if (ruptured) {
        dy  = ruptureSampler.sample(u * 3.4 + i * 0.11, tFast + i * 0.6);
        dy += quietSampler.sample(u * 1.6 + i * 0.04, tSlow + lineN * 0.9) * 0.22;
      } else {
        dy = quietSampler.sample(u * 1.6 + i * 0.04, tSlow + lineN * 0.9);
      }
      vertex(x, y0 + dy);
    }
    endShape();
  }

  drawLacunaIndex(tDrift);
  drawLabels();
}

function drawLacunaIndex(tDrift) {
  // Small data annotation along the right inner margin — a system read-out of
  // the lacuna span in normalised coordinates.
  let first = -1, last = -1;
  for (let i = 0; i < LINES; i++) {
    const lineN = i / (LINES - 1);
    const e = patchSampler.sample(lineN * 2.8, tDrift);
    if (e > 0.62) {
      if (first === -1) first = i;
      last = i;
    }
  }

  if (first === -1) return;

  const topY = M + 34 + first * ((H - M - 74 - (M + 34)) / (LINES - 1));
  const botY = M + 34 + last  * ((H - M - 74 - (M + 34)) / (LINES - 1));

  stroke(30, 160);
  strokeWeight(0.6);
  noFill();
  line(W - M + 10, topY, W - M + 10, botY);
  line(W - M + 6,  topY, W - M + 14, topY);
  line(W - M + 6,  botY, W - M + 14, botY);

  noStroke();
  fill(120);
  textFont('IBM Plex Mono');
  textSize(8);
  textAlign(LEFT, CENTER);
  const span = nf((last - first + 1) / LINES, 0, 2);
  text(`lacuna  ${nf(first, 2)}–${nf(last, 2)}  Δ${span}`, W - M + 18, (topY + botY) / 2);
}

function drawLabels() {
  noStroke();

  fill(90, 90, 90, 242);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('lacuna', M, 854);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  textAlign(LEFT, BASELINE);
  text('bald patch · grow random', M, 870);

  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', W - M, 854);
}


function draw() {
  push();
  translate(100, 100);
  scale(880 / 700);
  translate(-100, -100);
  try {
    __p5wSourceDraw();
  } finally {
    pop();
  }
}
