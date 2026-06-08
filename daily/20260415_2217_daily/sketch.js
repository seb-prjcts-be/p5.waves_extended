/*
 * AURORA SYNTH
 * Daily p5.waves sketch — 2026-04-15
 *
 * 7 aurora bands rendered as morphing wave ribbons.
 * Each band has TWO shift-enabled samplers defining its top
 * and bottom edge — so the band continuously morphs through
 * wave families. A fine-texture sampler adds undulation within
 * each band. Stars flicker with per-seed wave noise.
 * 3-pass glow (bloom → body → bright core) per band.
 */

const BAND_COUNT   = 7;
const STEP         = 4;          // x pixel step for shape vertices

let bands = [];
let stars = [];
let horizonS;   // sampler drives horizon shimmer intensity

function setup() {
  createCanvas(1080, 1080);
  colorMode(HSB, 360, 100, 100, 100);
  noSmooth();

  // --- Stars ---
  for (let i = 0; i < 200; i++) {
    stars.push({
      x:    random(width),
      y:    random(height * 0.72),
      seed: floor(random(9999)),
      r:    random(0.4, 2.0)
    });
  }

  // Horizon shimmer sampler
  horizonS = Waves.createSampler({
    shift: true,
    shiftInterval: 6,
    shiftDuration: 2.5,
    frequency: 0.005,
    seed: 99
  });

  // --- 7 Aurora bands ---
  //
  // Hue palette: cyan-green (bands 0-2) → teal-blue (3-4) → purple (5-6)
  // Each band:
  //   edgeA — upper boundary, longer shiftInterval → slower morphs
  //   edgeB — lower boundary, shorter shiftInterval → faster morphs
  //   texS  — fine texture modulation (no shift, stays consistent)
  //
  const hues      = [165, 190, 210, 235, 255, 275, 295];
  const intervals = [4.5, 3.8, 5.2, 4.0, 3.5, 5.8, 4.2]; // edgeA shiftInterval
  const seeds     = [3, 11, 19, 7, 23, 31, 41];

  for (let i = 0; i < BAND_COUNT; i++) {
    let t = i / (BAND_COUNT - 1);   // 0..1 top to bottom
    bands.push({
      edgeA: Waves.createSampler({
        shift: true,
        shiftInterval: intervals[i],
        shiftDuration: 1.8,
        seed: seeds[i],
        frequency: 0.003 + t * 0.003
      }),
      edgeB: Waves.createSampler({
        shift: true,
        shiftInterval: intervals[i] * 0.75,
        shiftDuration: 2.2,
        seed: seeds[i] * 3 + 5,
        frequency: 0.004 + t * 0.002
      }),
      texS: Waves.createSampler({
        wave: 'bumpy sine',
        frequency: 0.007 + t * 0.004,
        seed: i * 29 + 1
      }),
      baseY:     height * 0.08 + t * height * 0.58,
      amp:       40  + t * 95,        // wave amplitude in px
      thickness: 28  + t * 52,        // band half-thickness in px
      hue:       hues[i]
    });
  }
}

function draw() {
  background(222, 55, 4);
  let t = millis() / 1000;

  // =========================================================
  // STARFIELD — flicker driven by per-seed wobble sine
  // =========================================================
  noStroke();
  for (let s of stars) {
    let bri = Waves.wave(s.x * 0.01, {
      wave: 'wobble sine',
      t: t * 0.4,
      seed: s.seed,
      range: [20, 90]
    });
    fill(205, 8, bri, 80);
    circle(s.x, s.y, s.r * 2);
  }

  // =========================================================
  // HORIZON SHIMMER — thin gradient line at horizon
  // =========================================================
  let horizonY = height * 0.72;
  for (let x = 0; x <= width; x += 3) {
    let sh = horizonS.sample(x * 0.006, t * 0.5);
    let shimH = (190 + sh * 50 + t * 6) % 360;
    stroke(shimH, 60, 70, map(sh, -1, 1, 15, 55));
    strokeWeight(1);
    point(x, horizonY + sh * 4);
  }

  // =========================================================
  // AURORA BANDS — back to front (widest/lowest first)
  // =========================================================
  for (let i = BAND_COUNT - 1; i >= 0; i--) {
    let b   = bands[i];
    let hue = (b.hue + t * 7 + i * 2) % 360;

    // Build vertex arrays (one calc, used by all 3 passes + spine)
    let xArr = [], topY = [], botY = [];
    for (let x = -10; x <= width + 10; x += STEP) {
      let ea  = b.edgeA.sample(x * 0.006, t * 0.75 + i * 0.55);
      let eb  = b.edgeB.sample(x * 0.005, t * 0.65 + i * 0.40);
      let tex = b.texS.sample(x * 0.009, t * 0.35) * 0.18;

      xArr.push(x);
      topY.push(b.baseY + ea * b.amp * (1 + tex)  - b.thickness);
      botY.push(b.baseY + eb * b.amp * (1 - tex)  + b.thickness);
    }
    let n = xArr.length;

    // --- 3 Passes: bloom → body → bright core ---
    const PASSES = [
      { expand: 22, alpha: 10, sat: 60, bri: 72 },
      { expand:  7, alpha: 28, sat: 78, bri: 86 },
      { expand:  0, alpha: 52, sat: 88, bri: 100 }
    ];

    for (let p of PASSES) {
      fill(hue, p.sat, p.bri, p.alpha);
      noStroke();
      beginShape();
      for (let k = 0;     k < n;  k++) vertex(xArr[k], topY[k] - p.expand);
      for (let k = n - 1; k >= 0; k--) vertex(xArr[k], botY[k] + p.expand);
      endShape(CLOSE);
    }

    // --- Bright centre spine ---
    noFill();
    stroke(hue, 35, 100, 45);
    strokeWeight(0.8);
    beginShape();
    for (let k = 0; k < n; k++) vertex(xArr[k], (topY[k] + botY[k]) * 0.5);
    endShape();

    // --- Subtle upper fringe (ionosphere glow) ---
    stroke(hue, 45, 90, 20);
    strokeWeight(3);
    beginShape();
    for (let k = 0; k < n; k++) vertex(xArr[k], topY[k] - 28);
    endShape();
  }

  // =========================================================
  // REFLECTION — faint mirror of bands at horizon
  // =========================================================
  for (let i = BAND_COUNT - 1; i >= 0; i--) {
    let b   = bands[i];
    let hue = (b.hue + t * 7 + i * 2) % 360;

    noStroke();
    fill(hue, 70, 60, 8);
    beginShape();
    let reflect = (y) => horizonY + (horizonY - y) * 0.35;
    for (let x = -10; x <= width + 10; x += STEP * 2) {
      let ea = b.edgeA.sample(x * 0.006, t * 0.75 + i * 0.55);
      vertex(x, reflect(b.baseY + ea * b.amp - b.thickness));
    }
    for (let x = width + 10; x >= -10; x -= STEP * 2) {
      let eb = b.edgeB.sample(x * 0.005, t * 0.65 + i * 0.40);
      vertex(x, reflect(b.baseY + eb * b.amp + b.thickness));
    }
    endShape(CLOSE);
  }

  // =========================================================
  // HUD — live wave names per band
  // =========================================================
  noStroke();
  textFont('monospace');
  textSize(10);
  textAlign(LEFT, TOP);
  for (let i = 0; i < BAND_COUNT; i++) {
    let b   = bands[i];
    let hue = (b.hue + t * 7) % 360;
    fill(hue, 55, 95, 70);

    let label = b.edgeA.waveName;
    if (b.edgeA.shifting) label += '  →  ' + b.edgeA.targetName;
    text(label, 10, 10 + i * 14);
  }

  // Active morph progress bar (right side, thin)
  for (let i = 0; i < BAND_COUNT; i++) {
    let b = bands[i];
    if (b.edgeA.shifting) {
      let hue = (b.hue + t * 7) % 360;
      let barY = 10 + i * 14 + 4;
      let mix  = b.edgeA.mix;
      stroke(hue, 80, 100, 80);
      strokeWeight(2);
      noFill();
      line(width - 82, barY, width - 12 + mix * 70, barY);
    }
  }

  // Horizon sampler name (bottom-left)
  noStroke();
  fill(190, 30, 80, 35);
  textSize(10);
  textAlign(LEFT, BOTTOM);
  text('horizon: ' + horizonS.waveName, 10, height - 10);

  // Title
  fill(210, 15, 100, 20);
  textSize(11);
  textAlign(RIGHT, BOTTOM);
  text('AURORA SYNTH  ·  p5.waves v3.1  ·  2026-04-15', width - 10, height - 10);
}
