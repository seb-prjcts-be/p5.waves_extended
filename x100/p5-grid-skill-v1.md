---
description: "Generate a 10x10 grid of 100 animated 50x50 p5.js frames that deeply explore a single library. Use when the user says /p5-grid, asks for a '100 frames grid', or wants to creatively showcase a library. The user provides a library CDN and optionally a theme. Every frame MUST use the library — this is a library exploration tool, not a generic p5 sampler."
---

# p5-grid — 100 Ways to Use One Library

Generate **100 unique animated 50×50 frames** in a 10×10 grid. The goal is extreme creative exploration of **one library**. Every single frame must use the library in at least one meaningful way. The grid is a love letter to the library — showing what it can do when pushed in 100 different directions.

## Input

The user provides:
- **Library** (required): a CDN `<script>` tag (e.g. p5.waves, p5.grain, p5.brush)
- **Theme** (optional): a mood or visual direction (e.g. "cosmic", "organic", "brutalist")
- **Target folder** (optional): where to write files (default: cwd)

You produce: `index.html` + `sketch.js`

---

## Step 0 — Study the library

Before writing ANY code, you MUST understand the library's API. Use WebFetch on the CDN URL and/or the library's GitHub README to learn:
- What functions/objects it exposes
- Parameter signatures and options
- Available presets, modes, wave types, brush types, etc.
- Performance characteristics

Create a mental inventory of every feature. You will need to spread these across 100 frames so that all features appear.

---

## Step 1 — Design the 100 frames

Break into 10 rows. Each row explores the library through a different **visual lens**:

| Row | Lens | What it means |
|-----|------|--------------|
| 0 | Raw output | Show the library's basic outputs directly — waveforms, textures, values plotted plainly |
| 1 | Shape driver | Library values drive size, position, or count of simple shapes |
| 2 | Color engine | Library values mapped to hue, saturation, brightness, alpha |
| 3 | Motion control | Library values control speed, direction, rotation, oscillation |
| 4 | Pattern generator | Library values create grids, tessellations, repetitions |
| 5 | Organic forms | Library values shape curves, blobs, tendrils, growth |
| 6 | Texture & pixels | Library values per-pixel or per-row for bitmap-level effects |
| 7 | Composition | Multiple library calls combined — interference, layering, mixing |
| 8 | Spatial & 3D | Library values for depth, perspective, projection, parallax |
| 9 | Extremes | Push the library to its limits — unusual params, chained calls, unexpected combinations |

Within each row, the 10 frames should use **different library features/parameters**. No two frames should call the library the same way.

---

## Step 2 — Write index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>p5-grid — {LIBRARY_NAME}</title>
  <style>
    body { margin: 0; background: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    canvas { display: block; }
  </style>
</head>
<body>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.3/p5.min.js"></script>
  {LIBRARY_SCRIPT_TAG}
  <script src="sketch.js"></script>
</body>
</html>
```

---

## Step 3 — Write sketch.js

### Scaffold (copy exactly, never modify)

```javascript
const FRAMES = [];
const STATE = {};
const COLS = 10, ROWS = 10, SZ = 50;

function setup() {
  createCanvas(COLS * SZ, ROWS * SZ);
  frameRate(30);
  initState();
  registerFrames();
}

function draw() {
  background(0);
  const t = millis() / 1000;
  const fc = frameCount;
  const ctx = drawingContext;
  for (let i = 0; i < 100; i++) {
    const cx = (i % COLS) * SZ;
    const cy = floor(i / COLS) * SZ;
    push();
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx, cy, SZ, SZ);
    ctx.clip();
    translate(cx, cy);
    if (FRAMES[i]) {
      try { FRAMES[i](t, fc); } catch(e) {}
    }
    ctx.restore();
    pop();
  }
}

function initState() {
  // Stateful frames init here
}

function registerFrames() {
  // All 100 FRAMES[0..99] here
}
```

### Library shorthand

Create a short alias for the library's main function to reduce verbosity:
```javascript
// p5.waves example:
function W(coord, opts) { return Waves.wave(coord, opts); }
```

### Frame function signature

```javascript
FRAMES[i] = (t, fc) => {
  // t  = seconds elapsed — smooth animation
  // fc = frameCount — discrete steps
  // Canvas: local (0,0) to (50,50), already translated and clipped
  // RULE: must call the library at least once
};
```

---

## The core creative principle

The library is not decoration — it is the **engine** of every frame. Every visual decision (position, size, color, angle, count, speed, shape) should be driven by a library call wherever possible.

**Bad** (library as afterthought):
```javascript
// Draws a circle, tacks on one wave call for radius
ellipse(25, 25, 20 + W(t, {range:[-5,5]}), 20);
```

**Good** (library drives everything):
```javascript
// Library controls radius, color, AND position
const r = W(t, {wave:'bumpy sine', range:[5,20], seed:42});
const hue = W(t*0.5, {wave:'triangle', range:[180,300], seed:43});
const x = 25 + W(t, {wave:'wobble sine', range:[-10,10], seed:44});
colorMode(HSB,360,100,100);
fill(hue, 80, 90); noStroke();
ellipse(x, 25, r*2, r*2);
```

**Great** (library creates the unexpected):
```javascript
// Library as a Voronoi seed mover, pixel displacer, or Truchet tile selector
// Library values XOR'd together for interference
// Library driving a double pendulum's damping coefficient
// Library as a musical sequencer (stepped values → note heights)
```

---

## Creative strategies per frame type

**For shapes**: library drives vertex positions, corner radii, arc angles, point counts
**For grids**: library value per cell → brightness, hue, size, or rotation
**For particles**: library drives spawn rate, velocity, lifetime, gravity
**For curves**: library modulates frequency, amplitude, phase of mathematical curves
**For pixels**: library value per row/column → displacement, threshold, sort boundary
**For text**: library drives character selection, spacing, size, shake intensity
**For 3D**: library drives rotation speed, depth, projection distance, fog density
**For patterns**: library selects tile orientation, spacing, nesting level

---

## Library-specific reference: p5.waves

When the library is p5.waves, use this API:

```javascript
// Main function — always returns a number
Waves.wave(coordinate, options)

// Options:
// wave:      string — one of 34 wave types (see below)
// seed:      number — deterministic random seed (different seed = different wave instance)
// range:     [min, max] — output range (default [0,1])
// frequency: number — wave density (default 1)
// phase:     number — horizontal shift
// t:         number — time offset for animation
// amplitude: number — wave height multiplier

// 34 wave types:
// 'classic sine', 'sine', 'sharp peaks', 'square', 'pulse',
// 'stepped sine', 'mountain peaks', 'valleys', 'zig-zag sine', 'batman',
// 'offset sine', 'steps down', 'steps', 'squared sine', 'bumpy sine',
// 'wobble sine', 'up down noise', 'meta sine', 'triangle', 'ramp',
// 'saw down', 'saw up', 'fade out', 'grow random', 'noise',
// 'fuzzy pulse', 'up down pulse', 'bald patch', 'fuzzy peak sine',
// 'ramp up sine', 'triangle sine', 'round linked sine', 'half sine',
// 'smooth solid sine'

// Performance helper — pre-resolve config for hot loops:
// const sampler = Waves.createSampler({wave:'sine', range:[0,1], seed:1});
// sampler(coordinate) — faster than Waves.wave() in tight loops

// Seed strategy for 100 frames:
// Use i*10 + paramIndex as seed (where i = frame index)
// This guarantees every frame gets a unique wave instance
// Example: frame 42, third parameter → seed: 423
```

**Coverage target**: use ALL 34 wave types at least once across 100 frames. Row 0 should plot 10 different wave types as raw waveforms. The remaining rows should use diverse types — don't default to 'sine' everywhere.

---

## Quality rules

1. **EVERY frame MUST call the library** — this is non-negotiable. The library is the point.
2. **Every frame MUST animate** — use `t` for motion. No static images.
3. **No two frames may look alike** — vary technique, color, timing, library params.
4. **Library diversity**: spread all available library features across the 100 frames. If the library has 34 wave types, use all 34. If it has 5 modes, show all 5.
5. **Seed uniqueness**: every library call should use a unique seed. Pattern: `frameIndex * 10 + paramOffset`.
6. **Performance**: pixel loops use `+=2` step. Max 25×25 grids. Cap particle arrays at ~20. Target 30fps.
7. **Stateful frames**: init in `initState()`, update in frame function. Trail limits: `if(trail.length > N) trail.shift()`.
8. **Color variety**: use HSB mode generously. Let the library drive hue/saturation. Match theme mood.
9. **No createGraphics()** — single canvas with translate+clip only.
10. **Write all 100 frames** — no placeholders, no stubs, no skipping. Use agents for parallel implementation if needed.
11. **Push/pop discipline**: always wrap translate/rotate/scale in push/pop.

---

## Output

When done, report:
- Files created + paths
- Row-by-row summary (one line each)
- Which library features/types were covered
- Screenshot from browser (use Chrome tools, not preview tools)
