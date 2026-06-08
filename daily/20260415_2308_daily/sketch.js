/*
 * FLUX ATLAS
 * Daily p5.waves sketch — 2026-04-15
 *
 * 2500 particles flow through a morphing vector field.
 * Two shift-enabled samplers (velX, velY) define the field's
 * X and Y velocity components. Each sampler independently
 * cycles through all 34 wave families — laminar sine flows
 * become stepped plateaus, batman basins, pulse grids, or
 * chaotic noise storms. A third shift sampler drives a spatial
 * hue landscape so colour evolves independently of flow.
 *
 * Five attractor points drift in slow elliptical orbits,
 * creating persistent gravity wells that bend flow around them.
 * Short stroked segments per particle show the local flow
 * direction; long-lived trails build into a painted atlas.
 *
 * Techniques:
 *   createSampler({ shift:true }) × 3  — morphing field + hue
 *   sample(pos, t) per particle         — spatial wave query
 *   Waves.wave() for attractor halos    — per-frame ring pulse
 *   shift getters (waveName, shifting,  — live HUD labels
 *                  targetName, mix)
 */

const N      = 2500;
const SPEED  = 2.2;        // base particle speed (px/frame)
const FREQ   = 0.0038;     // spatial frequency of velocity field

let particles = [];
let velX, velY, hueS;

// ─── Attractor configuration ─────────────────────────────────────
// Each attractor orbits a different ellipse; G controls pull strength.
const ATT_DEFS = [
  { rx: 280, ry: 200, freq: 0.082, phase: 0.00, G: 90 },
  { rx: 220, ry: 280, freq: 0.067, phase: 1.26, G: 70 },
  { rx: 310, ry: 160, freq: 0.055, phase: 2.51, G: 85 },
  { rx: 180, ry: 310, freq: 0.095, phase: 3.77, G: 65 },
  { rx: 260, ry: 260, freq: 0.042, phase: 5.03, G: 75 }
];

function setup() {
  createCanvas(1080, 1080);
  colorMode(HSB, 360, 100, 100, 100);
  background(244, 65, 3); // very dark blue-navy seed

  // ── Velocity field samplers ─────────────────────────────────────
  velX = Waves.createSampler({
    shift: true, shiftInterval: 4,   shiftDuration: 1.6,
    frequency: FREQ,
    seed: 11,
    range: [-1, 1]
  });

  velY = Waves.createSampler({
    shift: true, shiftInterval: 5.5, shiftDuration: 2.1,
    frequency: FREQ,
    seed: 22,
    range: [-1, 1]
  });

  // ── Colour landscape sampler ────────────────────────────────────
  // Slow spatial hue drift independent of flow structure
  hueS = Waves.createSampler({
    shift: true, shiftInterval: 9, shiftDuration: 3.5,
    frequency: FREQ * 0.55,
    seed: 77,
    range: [0, 360]
  });

  // ── Particles ───────────────────────────────────────────────────
  for (let i = 0; i < N; i++) {
    particles.push({
      x:    random(width),
      y:    random(height),
      seed: i
    });
  }
}

function draw() {
  background(244, 65, 3, 4); // slow deep-navy fade → long trails
  const t  = millis() / 1000;
  const cx = width  / 2;
  const cy = height / 2;

  // ================================================================
  // ATTRACTOR POSITIONS (computed once per frame)
  // ================================================================
  const att = ATT_DEFS.map(d => ({
    x: cx + cos(t * d.freq + d.phase) * d.rx,
    y: cy + sin(t * d.freq + d.phase) * d.ry,
    G: d.G
  }));

  // ================================================================
  // PARTICLE UPDATE + DRAW
  // ================================================================
  for (let p of particles) {
    const px = p.x, py = p.y;

    // — Velocity from wave field (spatial query) ——————————————————
    let vx = velX.sample(px * FREQ + py * FREQ * 0.55, t) * SPEED;
    let vy = velY.sample(px * FREQ * 0.55 + py * FREQ, t) * SPEED;

    // — Attractor gravity (1/r² with soft minimum distance) ———————
    for (const a of att) {
      const dx = a.x - px, dy = a.y - py;
      const d  = max(sqrt(dx * dx + dy * dy), 22);
      const ac = a.G / (d * d);       // acceleration magnitude
      vx += (dx / d) * ac;
      vy += (dy / d) * ac;
    }

    // — Speed cap —————————————————————————————————————————————————
    const spd = sqrt(vx * vx + vy * vy);
    if (spd > SPEED * 2.8) {
      const s = (SPEED * 2.8) / spd;
      vx *= s; vy *= s;
    }

    // — Move ———————————————————————————————————————————————————————
    p.x += vx;
    p.y += vy;

    // — Respawn at random edge when particle exits canvas ——————————
    if (p.x < -1 || p.x > width + 1 || p.y < -1 || p.y > height + 1) {
      const edge = floor(random(4));
      if      (edge === 0) { p.x = random(width);  p.y = -1; }
      else if (edge === 1) { p.x = width + 1;      p.y = random(height); }
      else if (edge === 2) { p.x = random(width);  p.y = height + 1; }
      else                 { p.x = -1;              p.y = random(height); }
      continue;
    }

    // — Colour ————————————————————————————————————————————————————
    // Spatial hue landscape + velocity-angle offset
    // → nearby co-flowing particles share similar hues
    const baseHue  = hueS.sample(px * FREQ * 0.9 + py * FREQ * 0.45, t * 0.15);
    const angleDeg = degrees(atan2(vy, vx));
    const hue      = (baseHue + angleDeg * 0.5 + 200) % 360;
    const sat      = constrain(68 + spd * 6, 45, 100);
    const bri      = constrain(80 + spd * 8, 65, 100);
    const al       = constrain(38 + spd * 14, 22, 80);

    // — Draw as short directed stroke ——————————————————————————————
    stroke(hue, sat, bri, al);
    strokeWeight(1.3);
    line(px, py, p.x, p.y);
  }

  // ================================================================
  // ATTRACTOR HALOS — faint pulsing rings
  // ================================================================
  noFill();
  for (let i = 0; i < att.length; i++) {
    const a = att[i];

    // Pulse radius driven by Waves.wave (not shift — keeps halos stable)
    const pulse = Waves.wave(t, {
      wave:      'wobble sine',
      t:         t * 0.8,
      seed:      i * 17,
      range:     [12, 22]
    });

    const halo = (t * 22 + i * 72) % 360;
    stroke(halo, 55, 100, 22);
    strokeWeight(0.9);
    circle(a.x, a.y, pulse * 2);

    stroke(halo, 35, 80, 9);
    strokeWeight(0.5);
    circle(a.x, a.y, pulse * 5);
  }

  // ================================================================
  // WAVE PREVIEW STRIP — bottom-right mini readout
  // ================================================================
  // Draw a tiny waveform of velX and velY at the bottom of canvas
  const STRIP_W = 180;
  const STRIP_H = 30;
  const STRIP_X = width  - STRIP_W - 10;
  const STRIP_Y = height - STRIP_H - 20;
  const STEPS   = 60;

  noFill();
  // velX wave preview
  stroke(180, 70, 100, 45);
  strokeWeight(1);
  beginShape();
  for (let i = 0; i <= STEPS; i++) {
    const xN = i / STEPS;
    const wv = velX.sample(xN * 0.8, t);
    vertex(STRIP_X + xN * STRIP_W, STRIP_Y + STRIP_H / 2 - wv * STRIP_H * 0.4);
  }
  endShape();

  // velY wave preview
  stroke(270, 70, 100, 45);
  beginShape();
  for (let i = 0; i <= STEPS; i++) {
    const xN = i / STEPS;
    const wv = velY.sample(xN * 0.8, t);
    vertex(STRIP_X + xN * STRIP_W, STRIP_Y + STRIP_H / 2 - wv * STRIP_H * 0.4);
  }
  endShape();

  // Strip border
  stroke(255, 0, 100, 10);
  strokeWeight(0.4);
  noFill();
  rect(STRIP_X - 2, STRIP_Y - 4, STRIP_W + 4, STRIP_H + 8, 2);

  // ================================================================
  // HUD — live wave names + morph progress bars
  // ================================================================
  noStroke();
  textFont('monospace');
  textSize(9);
  textAlign(LEFT, TOP);

  // velX label
  let l1 = `vx: ${velX.waveName}`;
  if (velX.shifting) l1 += `  →  ${velX.targetName}`;
  fill(180, 60, 95, 72);
  text(l1, 10, 10);
  if (velX.shifting) {
    stroke(180, 90, 100, 80);
    strokeWeight(1.5);
    line(10, 18, 10 + velX.mix * 85, 18);
    noStroke();
  }

  // velY label
  let l2 = `vy: ${velY.waveName}`;
  if (velY.shifting) l2 += `  →  ${velY.targetName}`;
  fill(270, 60, 95, 72);
  text(l2, 10, 24);
  if (velY.shifting) {
    stroke(270, 90, 100, 80);
    strokeWeight(1.5);
    line(10, 32, 10 + velY.mix * 85, 32);
    noStroke();
  }

  // hue sampler label
  let l3 = `hue: ${hueS.waveName}`;
  if (hueS.shifting) l3 += `  →  ${hueS.targetName}`;
  fill(80, 45, 90, 50);
  text(l3, 10, 38);
  if (hueS.shifting) {
    stroke(80, 70, 100, 65);
    strokeWeight(1.5);
    line(10, 46, 10 + hueS.mix * 85, 46);
    noStroke();
  }

  // Title
  noStroke();
  fill(230, 12, 85, 20);
  textAlign(RIGHT, BOTTOM);
  textSize(9);
  text('FLUX ATLAS  ·  p5.waves v3.1  ·  2026-04-15', width - 10, height - 10);
}
