/*
 * PRISMATIC CASCADE
 * Daily p5.waves sketch — 2026-04-16
 *
 * 48 spectral light beams descend from top to bottom.
 * Each beam's lateral path is shaped by an independent
 * shift-enabled sampler — cycling through all 34 wave families.
 *
 * Classic sine arcs become pulse-jump prism breaks, batman
 * basins, triangle zigzags, or noise-driven turbulence.
 * ADD blend mode causes converging beams to bloom into caustic
 * white pools; diverging beams reveal pure spectral hues.
 * Slope-to-brightness mapping intensifies refraction cusps —
 * the steeper the bend, the brighter the spark.
 *
 * A slow background fade gives long-persistence luminous trails
 * so the cascade builds a layered memory of its own history.
 *
 * Techniques:
 *   createSampler({ shift:true }) × 48 — fully independent beams
 *   blendMode(ADD) — caustic luminescence from overlap
 *   Slope → brightness + de-saturation — cusps glow white-hot
 *   Per-beam spatial scale — varied wavelength density
 *   Hue rotation over time — slow full-spectrum drift
 */

const N_BEAMS = 48;
const STEP    = 3;    // vertical resolution in px

let beams = [];

function setup() {
  createCanvas(1080, 1080);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);

  for (let i = 0; i < N_BEAMS; i++) {
    beams.push({
      s: Waves.createSampler({
        shift:         true,
        shiftInterval: 2.8 + (i % 8) * 0.38,   // 2.8 – 5.4 s per beam
        shiftDuration: 0.9 + (i % 5) * 0.22,   // 0.9 – 1.8 s morph
        seed:          i * 13 + 7,
        range:         [-70, 70]
      }),
      baseX:  map(i, 0, N_BEAMS - 1, 28, 872),  // evenly spaced across width
      hueOff: (i / N_BEAMS) * 300,               // rainbow spread 0–300°
      sc:     0.0028 + (i % 7) * 0.0007          // spatial scale: 0.0028–0.0070
    });
  }
}

function draw() {
  // Long-persistence trail — alpha 10 ≈ 100-frame memory
  blendMode(BLEND);
  background(0, 0, 0, 10);

  const t = millis() / 1000;

  blendMode(ADD);
  strokeWeight(1.5);
  noFill();

  for (const b of beams) {
    // Full-spectrum hue rotation: each beam offset + slow global drift
    const hue   = (b.hueOff + t * 7) % 360;
    let   prevX = b.baseX + b.s.sample(0, t);

    for (let y = STEP; y <= height; y += STEP) {
      const x     = b.baseX + b.s.sample(y * b.sc, t);
      const slope = abs(x - prevX) / STEP;    // lateral change per pixel

      // Steeper slope → hotter, whiter spark (caustic refraction)
      const bri = constrain(40 + slope * 750, 20, 100);
      const sat = constrain(90 - slope * 280, 0, 90);
      const al  = constrain(16 + slope * 140, 6, 62);

      stroke(hue, sat, bri, al);
      line(prevX, y - STEP, x, y);
      prevX = x;
    }
  }

  // ── HUD — wave readout ──────────────────────────────────────────
  blendMode(BLEND);
  noStroke();
  textFont('monospace');
  textSize(9);
  textAlign(LEFT, TOP);

  // Show live wave name for beam 0 and beam N/2
  const b0   = beams[0];
  const bMid = beams[Math.floor(N_BEAMS / 2)];

  fill(60, 45, 90, 32);
  text(`a: ${b0.s.waveName}`, 10, 10);
  if (b0.s.shifting) {
    fill(60, 30, 70, 22);
    text(`  → ${b0.s.targetName}  (${nf(b0.s.mix, 1, 2)})`, 10, 20);
  }

  fill(200, 40, 90, 28);
  text(`b: ${bMid.s.waveName}`, 10, 32);
  if (bMid.s.shifting) {
    fill(200, 25, 70, 18);
    text(`  → ${bMid.s.targetName}  (${nf(bMid.s.mix, 1, 2)})`, 10, 42);
  }

  // Title watermark
  textAlign(RIGHT, BOTTOM);
  fill(0, 0, 72, 10);
  text('PRISMATIC CASCADE  ·  p5.waves v3.1  ·  2026-04-16', width - 10, height - 10);
}
