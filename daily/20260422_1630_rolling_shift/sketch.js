/*
 * rolling_shift — 3D rethink
 * ============================================================
 * 1. MODE: F — Formal. (rebooted from the 2D line-stack version;
 *    see RISK.)
 * 1a. FORMAL QUESTION:
 *     When a single p5.waves sampler with shift: true drives a
 *     7×7×7 = 343-cube field — each cube held in place at its
 *     lattice position, but rotated on all three local axes by
 *     an independent sampler read (rx from i, ry from j, rz from
 *     k) — what does the shared wave-family mutation look like?
 *     Position is fixed, orientation is the only moving variable.
 *     The three loops are structurally symmetric; only the input
 *     coordinate and the time offset differ per axis. Variables:
 *     (a) shift interval and duration, (b) per-axis time offset,
 *     (c) spatial frequency of the sampler input, (d) slow global
 *     rotateY. Observation: whether the continuous wave-family
 *     churn reads as coherent angular breathing across the
 *     lattice, or as independent spin per cube.
 * 2. GESTURE: PIVOT. Three-axis rotation of cubes held in a
 *     fixed lattice, one shared sampler driving all of it.
 * 3. REFERENCE ANCHOR: Manfred Mohr — 3D cube rotations, lattice
 *     specimens, systematic variation on a single generative
 *     mechanic. "Cubic Limit" lineage.
 * 4. SEB ANCHOR: p5.wavesX100 — single-library depth. This
 *     extends the 2D 34-line version (earlier today) by asking
 *     the same formal question in a third dimension.
 * 5. LIBRARY MOVE: shift on a sampler, constrained with
 *     group: 'gentle'.
 *     Waves.createSampler({ shift: true, group: 'gentle',
 *                           shiftInterval, shiftDuration }).
 *     One sampler object. All 343 cubes read it. Three axis
 *     reads per cube — same sampler, different inputs. The
 *     library-managed cross-fade carries the whole lattice from
 *     one wave family into the next. group: 'gentle' narrows the
 *     shift pool to the 28 curved / sine / polynomial waves —
 *     excluding the 6 harsh ones (tan / noise / random / fuzzy
 *     pulse / up-down pulse / fuzzy peak sine) that would
 *     produce spike-discontinuities in cube positions. Per the
 *     README (p5.waves/README.md:102-107, docs/guide.html:288-292),
 *     group and shift compose directly; group is orthogonal to
 *     mode. The lattice should breathe, never jolt.
 * 6. COLOR COMMITMENT: single ink, wireframe-on-paper.
 *     stroke rgb(26,26,26) at 0.75 px, fill rgb(245,245,245)
 *     (matches canvas) so occlusion is clean and the piece reads
 *     as a line drawing with depth. Martens-pure.
 * 7. RISK: reboot — the original (2D stacked lines) commitment
 *     is rescinded. New commitment: 3D box lattice with rotateY.
 *     Second risk: 343 wireframe cubes can read as an M.C. Escher
 *     novelty instead of a library specimen. Mitigation: slow
 *     rotation (0.06 rad/s ≈ 100 s per full turn), small
 *     displacement (22 px max), flat wireframe (no lighting, no
 *     perspective tricks) — the cubes stay a specimen of the
 *     shift, not a sculpture. Third risk: WEBGL + fill-matches-bg
 *     occlusion can flicker at boundaries. Mitigation: pixelDensity(1),
 *     stable depth order.
 * 8. MATERIAL: WEBGL canvas 900×900. Three nested loops k→j→i
 *     place cubes on a fixed 480-unit axis-aligned lattice —
 *     NO translation offsets from the sampler. The three sampler
 *     reads drive local rotateX / rotateY / rotateZ per cube
 *     (radians), amplitude ROT_AMP ≈ 0.8 rad so each face sweeps
 *     ~±45°. Time offsets per axis: 0, +0.18 s, +0.36 s.
 *     The scene carries a slow global rotateY at 0.06 rad/s to
 *     expose the lattice from multiple viewpoints; rotateX is a
 *     fixed -0.28 rad tilt. Shift timing pushed to the library's
 *     floor: interval 0.1 s, duration 0.1 s — the sampler is in
 *     permanent churn, continuously crossing from one gentle wave
 *     into the next. The cubes pivot in place; the lattice
 *     breathes as orientation field, not position field.
 *     Label band composited as a 2D overlay at the end of each draw().
 *
 * Research note: verified against p5.waves example 05_basic_wave_webgl
 * (C:/server/htdocs/p5.waves_ultimate_showcase/examples/05_basic_wave_webgl/)
 * and p5.waves/examples/wave_shift. createSampler + shift are
 * renderer-agnostic; they return scalar values regardless of
 * the p5 rendering context.
 */

const CANVAS = 900;
const M = 100;

const DIM = 7;
const SPAN = 480;
const BOX_SIZE = 24;
const ROT_AMP = 0.8;

const SPATIAL_STRIDE = 0.42;
const T_OFFSET_X = 0.0;
const T_OFFSET_Y = 0.18;
const T_OFFSET_Z = 0.36;

const SHIFT_INTERVAL = 0.1;
const SHIFT_DURATION = 0.1;
const ROT_Y_RATE = 0.06;
const ROT_X_TILT = -0.28;

let sampler;
let fontsReady = false;
let pulseStart = -10;
let labelLayer;

async function setup() {
  createCanvas(1080, 1080, WEBGL);
  pixelDensity(1);

  sampler = Waves.createSampler({
    shift: true,
    group: 'gentle',
    shiftInterval: SHIFT_INTERVAL,
    shiftDuration: SHIFT_DURATION,
    amplitude: 1,
    frequency: 0.55
  });

  labelLayer = createGraphics(CANVAS, CANVAS);
  labelLayer.pixelDensity(1);

  await document.fonts.ready;
  fontsReady = true;
}

function __p5wSourceDraw() {
  background(245);

  const t = millis() / 1000;

  if (sampler.shifting && (t - pulseStart) > 2) {
    pulseStart = t;
  }

  push();
  rotateX(ROT_X_TILT);
  rotateY(t * ROT_Y_RATE);

  const step = SPAN / (DIM - 1);
  const half = SPAN / 2;

  stroke(26);
  strokeWeight(0.75);
  fill(245);

  for (let k = 0; k < DIM; k++) {
    const rz = sampler.sample(k * SPATIAL_STRIDE, t + T_OFFSET_Z) * ROT_AMP;
    const z0 = -half + k * step;

    for (let j = 0; j < DIM; j++) {
      const ry = sampler.sample(j * SPATIAL_STRIDE, t + T_OFFSET_Y) * ROT_AMP;
      const y0 = -half + j * step;

      for (let i = 0; i < DIM; i++) {
        const rx = sampler.sample(i * SPATIAL_STRIDE, t + T_OFFSET_X) * ROT_AMP;
        const x0 = -half + i * step;

        push();
        translate(x0, y0, z0);
        rotateX(rx);
        rotateY(ry);
        rotateZ(rz);
        box(BOX_SIZE);
        pop();
      }
    }
  }
  pop();

  drawLabels(t);
}

function drawLabels(t) {
  if (window.__P5WAVES_STAGE_ONLY__) return;
  if (!fontsReady) return;

  labelLayer.clear();
  labelLayer.noStroke();

  labelLayer.fill(90, 90, 90, 242);
  labelLayer.textFont('Oswald');
  labelLayer.textStyle(NORMAL);
  labelLayer.textSize(22);
  labelLayer.textAlign(LEFT, BASELINE);
  labelLayer.text('rolling_shift', M, 854);

  labelLayer.textFont('IBM Plex Mono');
  labelLayer.textSize(9.5);
  labelLayer.fill(168);
  labelLayer.text(sampler.waveName, M, 870);

  labelLayer.textFont('IBM Plex Mono');
  labelLayer.textSize(19);
  labelLayer.fill(168);
  labelLayer.textAlign(RIGHT, BASELINE);
  labelLayer.text('p5.waves', CANVAS - M, 854);

  const sinceShift = t - pulseStart;
  if (sampler.shifting || sinceShift < 0.8) {
    const a = sampler.shifting ? 220 : 220 * (1 - sinceShift / 0.8);
    labelLayer.textFont('IBM Plex Mono');
    labelLayer.textSize(9.5);
    labelLayer.textAlign(RIGHT, BASELINE);
    labelLayer.fill(26, 26, 26, a);
    labelLayer.text('◆ shifting', CANVAS - M, 870);
  }

  push();
  resetMatrix();
  translate(-CANVAS / 2, -CANVAS / 2, 0);
  noStroke();
  image(labelLayer, 0, 0);
  pop();
}


function draw() {
  push();
  scale(1080 / 900);
  try {
    __p5wSourceDraw();
  } finally {
    pop();
  }
}
