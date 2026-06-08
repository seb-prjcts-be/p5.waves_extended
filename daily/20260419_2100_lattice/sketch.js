/*
  lattice
  ─────────────────────────────────────────────
  FEELING          interlace — two thread systems passing through one another
  WAVE LOGIC       wobble sine on vertical threads (horizontal sway, amplitude-modulated for soft pulse)
                   meta sine on horizontal threads (vertical drift, layered sine for breathing)
                   chosen because both families carry internal slow modulation — threads never tick identical
  TIME LOGIC       multi-speed: vertical system /800, horizontal system /1150
                   uncorrelated divisors keep the weave from snapping into a moiré lock
  STRUCTURAL MOVE  colliding systems on one canvas — a textile lattice of 40 + 40 thread trails.
                   Each thread is its own sampler; the field stays near-still, only its mesh
                   tension breathes.
*/

const W = 900;
const H = 900;
const M = 100;

const V_COUNT = 40;
const H_COUNT = 40;

const vSamplers = [];
const hSamplers = [];

let oswald, mono;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(2);
  await document.fonts.ready;
  oswald = 'Oswald';
  mono  = 'IBM Plex Mono';

  for (let i = 0; i < V_COUNT; i++) {
    vSamplers.push(Waves.createSampler({
      wave: 'wobble sine',
      seed: i * 7 + 3,
      amplitude: 26,
      frequency: 0.9 + (i % 5) * 0.07,
      phase: i * 0.17
    }));
  }

  for (let j = 0; j < H_COUNT; j++) {
    hSamplers.push(Waves.createSampler({
      wave: 'meta sine',
      seed: j * 11 + 2,
      amplitude: 22,
      frequency: 1.1 + (j % 4) * 0.05,
      phase: j * 0.23
    }));
  }
}

function __p5wSourceDraw() {
  background(245);

  const tV = millis() / 800;
  const tH = millis() / 1150;

  const innerW = W - 2 * M;
  const innerH = H - 2 * M;

  // ── thin reference frame inside the safe margin ──
  noFill();
  stroke(210);
  strokeWeight(1);
  rect(M, M, innerW, innerH);

  // ── vertical threads (sampled along y, displaced in x) ──
  stroke(40, 140);
  strokeWeight(0.8);
  noFill();
  for (let i = 0; i < V_COUNT; i++) {
    const baseX = M + (innerW / (V_COUNT - 1)) * i;
    const s = vSamplers[i];
    beginShape();
    for (let y = M; y <= H - M; y += 3) {
      const dx = s.sample(y * 0.022, tV);
      vertex(baseX + dx, y);
    }
    endShape();
  }

  // ── horizontal threads (sampled along x, displaced in y) ──
  stroke(30, 180);
  strokeWeight(0.8);
  for (let j = 0; j < H_COUNT; j++) {
    const baseY = M + (innerH / (H_COUNT - 1)) * j;
    const s = hSamplers[j];
    beginShape();
    for (let x = M; x <= W - M; x += 3) {
      const dy = s.sample(x * 0.022, tH);
      vertex(x, baseY + dy);
    }
    endShape();
  }

  drawLabels();
}

function drawLabels() {
  noStroke();
  textFont(oswald);
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 242);
  textAlign(LEFT, BASELINE);
  text('lattice', M, 854);

  textFont(mono);
  textSize(9.5);
  fill(168);
  text('wobble sine · meta sine', M, 870);

  textFont(mono);
  textSize(19);
  fill(168);
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
