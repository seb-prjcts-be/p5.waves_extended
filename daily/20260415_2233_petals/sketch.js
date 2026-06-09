/*
 * MORPHIC BLOOM
 * Daily p5.waves sketch — 2026-04-15
 *
 * 12 concentric polar wave rings, each driven by a shift-enabled
 * sampler. Ring i has frequency (i+1) — so ring 0 = 1 petal,
 * ring 11 = 12 petals. As shift cycles through the 34 wave
 * families, petal shapes morph from smooth sine to square,
 * triangle, batman, bald-patch, fuzzy-pulse… while petal count
 * stays consistent. Alternating rings rotate in opposite directions.
 *
 * Three ghost rings give a large hazy backdrop.
 * 48 particles orbit mid-rings, hugging the live wave radius.
 * A central core pulses via its own shift sampler.
 */

const RINGS = 12;
const STEPS = 360;    // polygon resolution per ring
const GHOST = 3;      // large background rings

let rings      = [];
let ghosts     = [];
let pulseS;           // central core wave sampler
let orbitMod;         // particle speed modulator
let particles  = [];

function setup() {
  createCanvas(1080, 1080);
  colorMode(HSB, 360, 100, 100, 100);
  smooth();

  // ── Central core ──────────────────────────────────────────────
  pulseS = Waves.createSampler({
    shift:         true,
    shiftInterval: 5,
    shiftDuration: 2,
    frequency:     1,
    seed:          42,
    range:         [-1, 1]
  });

  // ── Particle orbit speed modulator ────────────────────────────
  orbitMod = Waves.createSampler({
    shift:         true,
    shiftInterval: 7,
    shiftDuration: 2.5,
    frequency:     2,
    seed:          77,
    range:         [-0.004, 0.004]
  });

  // ── Ghost backdrop rings ──────────────────────────────────────
  for (let gi = 0; gi < GHOST; gi++) {
    ghosts.push({
      sampler: Waves.createSampler({
        shift:         true,
        shiftInterval: 14 + gi * 6,
        shiftDuration: 5,
        frequency:     2 + gi,
        seed:          gi * 53 + 100,
        range:         [-1, 1]
      }),
      baseR:   290 + gi * 100,
      amp:     55  + gi * 25,
      rotDir:  gi % 2 === 0 ? 1 : -1,
      rotRate: 0.003 + gi * 0.001
    });
  }

  // ── Main 12 rings ─────────────────────────────────────────────
  // Hue: warm gold (inner) → cyan/teal (mid) → violet (outer)
  const hueAt = (norm) => {
    if (norm < 0.5) return map(norm, 0, 0.5, 42, 185);   // gold → cyan
    else            return map(norm, 0.5, 1,  185, 290);  // cyan → violet
  };

  for (let i = 0; i < RINGS; i++) {
    let n = i / (RINGS - 1);   // 0..1 inner → outer
    rings.push({
      sampler: Waves.createSampler({
        shift:         true,
        shiftInterval: 2.5 + i * 0.6,   // inner rings morph fastest
        shiftDuration: 0.9 + i * 0.15,
        frequency:     i + 1,            // 1 petal → 12 petals
        seed:          i * 19 + 7,
        range:         [-1, 1]
      }),
      baseR:   38  + n * 358,
      amp:     7   + n * 30,             // outer rings have more swing
      hue:     hueAt(n),
      rotDir:  i % 2 === 0 ? 1 : -1,
      rotRate: 0.007 + n * 0.015,        // outer rings spin faster
      filled:  i % 4 === 0,              // every 4th ring is filled
      weight:  2.6  - n * 1.4           // inner rings slightly thicker
    });
  }

  // ── 48 orbiting particles ─────────────────────────────────────
  for (let p = 0; p < 48; p++) {
    let ri = floor(random(3, 10));      // orbit mid-rings
    particles.push({
      angle:   random(TWO_PI),
      speed:   random(0.004, 0.015) * (random() > 0.5 ? 1 : -1),
      ringIdx: ri,
      seed:    floor(random(9999)),
      size:    random(1.5, 3.5)
    });
  }
}

function draw() {
  background(248, 50, 4, 20);   // slow fade — keeps motion trails short
  let t = millis() / 1000;

  push();
  translate(width / 2, height / 2);

  // ============================================================
  // GHOST BACKDROP RINGS
  // ============================================================
  noFill();
  for (let gi = 0; gi < GHOST; gi++) {
    let g   = ghosts[gi];
    let rot = t * g.rotDir * g.rotRate;
    let hue = (t * 5 + gi * 110) % 360;
    stroke(hue, 30, 55, 7);
    strokeWeight(0.6);
    beginShape();
    for (let a = 0; a < STEPS; a++) {
      let angle = (a / STEPS) * TWO_PI + rot;
      let rv    = g.sampler.sample(a / STEPS, t * 0.3);
      let r     = g.baseR + rv * g.amp;
      vertex(cos(angle) * r, sin(angle) * r);
    }
    endShape(CLOSE);
  }

  // ============================================================
  // MAIN RINGS  (outer → inner, so inner draws on top)
  // ============================================================
  for (let i = RINGS - 1; i >= 0; i--) {
    let ring = rings[i];
    let hue  = (ring.hue + t * 10) % 360;
    let rot  = t * ring.rotDir * ring.rotRate;

    // Build vertex array once, reuse across passes
    let pts = new Array(STEPS);
    for (let a = 0; a < STEPS; a++) {
      let angle = (a / STEPS) * TWO_PI + rot;
      let rv    = ring.sampler.sample(a / STEPS, t);
      let r     = ring.baseR + rv * ring.amp;
      pts[a] = [cos(angle) * r, sin(angle) * r];
    }

    // Pass 1 — outer glow bloom
    if (i > 2) {
      noFill();
      stroke(hue, 65, 80, 14);
      strokeWeight(ring.weight + 7);
      beginShape();
      for (let pt of pts) vertex(pt[0], pt[1]);
      endShape(CLOSE);
    }

    // Pass 2 — main ring
    if (ring.filled) {
      fill(hue, 60, 72, 14);
    } else {
      noFill();
    }
    stroke(hue, 88, 100, 68);
    strokeWeight(ring.weight);
    beginShape();
    for (let pt of pts) vertex(pt[0], pt[1]);
    endShape(CLOSE);

    // Spoke tick marks at every petal peak position
    // ring i has (i+1) petals → 2*(i+1) symmetry points
    let freq  = i + 1;
    let ticks = freq * 2;
    stroke(hue, 50, 90, 22);
    strokeWeight(0.6);
    for (let k = 0; k < ticks; k++) {
      let a     = (k / ticks) * TWO_PI + rot;
      let inner = ring.baseR - ring.amp - 5;
      let outer = ring.baseR + ring.amp + 5;
      line(cos(a) * inner, sin(a) * inner, cos(a) * outer, sin(a) * outer);
    }
  }

  // ============================================================
  // ORBITING PARTICLES
  // ============================================================
  for (let p of particles) {
    let ring = rings[p.ringIdx];
    let ov   = orbitMod.sample(p.angle * 0.15, t);
    p.angle += p.speed + ov;

    // Sample the ring's wave at this particle's angle position
    let rot    = t * ring.rotDir * ring.rotRate;
    let localA = ((p.angle - rot) / TWO_PI % 1 + 1) % 1;
    let rv     = ring.sampler.sample(localA, t);
    let r      = ring.baseR + rv * ring.amp;

    let px = cos(p.angle) * r;
    let py = sin(p.angle) * r;

    // Per-particle brightness driven by a seed-unique wobble
    let bri = Waves.wave(p.seed * 0.1 + t * 0.4, {
      wave:      'wobble sine',
      t:         t * 0.5,
      seed:      p.seed,
      range:     [45, 100]
    });

    let hue = (rings[p.ringIdx].hue + t * 10 + 35) % 360;

    // Trail dot (one step back)
    let trailA  = p.angle - p.speed * 10;
    let localT  = ((trailA - rot) / TWO_PI % 1 + 1) % 1;
    let trailRv = ring.sampler.sample(localT, t);
    let trailR  = ring.baseR + trailRv * ring.amp;
    noStroke();
    fill(hue, 55, bri * 0.5, 28);
    circle(cos(trailA) * trailR, sin(trailA) * trailR, p.size * 1.4);

    // Main particle dot
    fill(hue, 72, bri, 88);
    circle(px, py, p.size * 2);
  }

  // ============================================================
  // CENTRAL CORE
  // ============================================================
  let pv      = pulseS.sample(t * 0.4, t);
  let coreR   = 22 + pv * 14;
  let coreHue = (t * 18 + 195) % 360;

  // Layered glow rings
  noFill();
  for (let g = 6; g >= 1; g--) {
    stroke(coreHue, 55, 90, 8 + g);
    strokeWeight(g * 3.5);
    circle(0, 0, (coreR + g * 6) * 2);
  }
  // Solid core
  noStroke();
  fill(coreHue, 50, 100, 92);
  circle(0, 0, coreR * 2);
  // Inner highlight
  fill(coreHue, 15, 100, 75);
  circle(0, 0, coreR * 0.55);

  pop();

  // ============================================================
  // HUD — wave names for 4 representative rings
  // ============================================================
  noStroke();
  textFont('monospace');
  textSize(9);
  textAlign(LEFT, TOP);

  const HUD = [0, 3, 7, 11];
  for (let hi = 0; hi < HUD.length; hi++) {
    let ring = rings[HUD[hi]];
    let hue  = (ring.hue + millis() * 0.01) % 360;
    fill(hue, 55, 92, 68);

    let petals = HUD[hi] + 1;
    let label  = `r${String(HUD[hi] + 1).padStart(2,' ')} [${petals}✦] ${ring.sampler.waveName}`;
    if (ring.sampler.shifting) label += ` → ${ring.sampler.targetName}`;
    text(label, 10, 10 + hi * 13);

    // Morph progress bar
    if (ring.sampler.shifting) {
      stroke(hue, 85, 100, 72);
      strokeWeight(1.5);
      let barY = 16 + hi * 13;
      let mix  = ring.sampler.mix;
      line(10, barY, 10 + mix * 90, barY);
      noStroke();
    }
  }

  // Core wave name
  noStroke();
  fill(200, 22, 80, 28);
  textSize(9);
  textAlign(CENTER, BOTTOM);
  text(`core: ${pulseS.waveName}`, width / 2, height - 10);

  // Title
  fill(220, 12, 88, 22);
  textAlign(RIGHT, BOTTOM);
  text('MORPHIC BLOOM  ·  p5.waves v3.1  ·  2026-04-15', width - 10, height - 10);
}
