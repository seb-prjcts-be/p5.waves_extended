// build-library.mjs — regenerate the x100 Frame Library from the version sketches.
//
// Scans every p5.wavesX100_v* folder, runs each sketch in a stubbed p5 sandbox to
// populate its FRAMES[] array, then for every frame:
//   • measures waves_used + w_calls by actually invoking the frame (real seeded STATE)
//   • verifies the frame is self-contained (its toString() runs standalone — no leaked
//     closure variables) so the library's eval-and-preview actually works
//   • harvests a title / description / row name from the sketch comments
//
// Output: _all_frames.json (raw per-version dump) + frames-library.json (the file the
// library page loads). Re-run after adding a new version folder — nothing else needed.
//
//   node build-library.mjs
//
// No dependencies. Node 18+.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const HERE = dirname(fileURLToPath(import.meta.url));
const X100 = join(HERE, '..');

// ── Locate version folders (p5.wavesX100_vNN), sorted ──────────────────────
const versionDirs = readdirSync(X100, { withFileTypes: true })
  .filter(d => d.isDirectory() && /^p5\.wavesX100_v\d+$/.test(d.name))
  .map(d => d.name)
  .sort();

// ── p5 stub: numeric maths return real numbers; everything else is a no-op ──
function buildSandbox(recorder) {
  const noop = () => {};
  // A self-absorbing value for things used as objects (color(), etc.).
  const absorber = new Proxy(function () {}, {
    get: () => absorber, apply: () => absorber, construct: () => absorber,
  });

  const R = (a, b) => (b === undefined ? a : a + (b - a) * 0.5); // deterministic "random"
  const maths = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan, atan: Math.atan, atan2: Math.atan2,
    asin: Math.asin, acos: Math.acos, sqrt: Math.sqrt, pow: Math.pow, exp: Math.exp,
    log: Math.log, abs: Math.abs, floor: Math.floor, ceil: Math.ceil, round: Math.round,
    min: (...a) => Math.min(...a.flat()), max: (...a) => Math.max(...a.flat()),
    sq: x => x * x, int: x => Math.trunc(x) || 0, float: x => +x || 0,
    norm: (v, a, b) => (v - a) / (b - a || 1),
    map: (v, a, b, c, d) => c + (d - c) * ((v - a) / (b - a || 1)),
    lerp: (a, b, t) => a + (b - a) * t,
    constrain: (v, a, b) => Math.min(Math.max(v, a), b),
    dist: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
    mag: (x, y) => Math.hypot(x, y),
    radians: d => d * Math.PI / 180, degrees: r => r * 180 / Math.PI,
    random: (a, b) => {
      if (Array.isArray(a)) return a[0];
      if (a === undefined) return 0.5;
      return R(a, b);
    },
    randomGaussian: () => 0, noise: () => 0.5, nf: (n) => String(n),
    millis: () => 0, second: () => 0, minute: () => 0, hour: () => 0,
    red: () => 0, green: () => 0, blue: () => 0, alpha: () => 255,
    hue: () => 0, saturation: () => 0, brightness: () => 0, lightness: () => 0,
    color: () => absorber, lerpColor: () => absorber, colorMode: noop,
  };

  const consts = {
    PI: Math.PI, TWO_PI: Math.PI * 2, HALF_PI: Math.PI / 2, QUARTER_PI: Math.PI / 4,
    TAU: Math.PI * 2, DEG_TO_RAD: Math.PI / 180, RAD_TO_DEG: 180 / Math.PI,
    CENTER: 'center', LEFT: 'left', RIGHT: 'right', TOP: 'top', BOTTOM: 'bottom',
    BASELINE: 'baseline', CORNER: 'corner', CORNERS: 'corners', RADIUS: 'radius',
    HSB: 'hsb', HSL: 'hsl', RGB: 'rgb', CLOSE: 'close', OPEN: 'open',
    BOLD: 'bold', NORMAL: 'normal', ITALIC: 'italic', BLEND: 'source-over',
    ADD: 'lighter', PIE: 'pie', CHORD: 'chord', PROJECT: 'project', ROUND: 'round',
    SQUARE: 'butt', MITER: 'miter', BEVEL: 'bevel',
  };

  const drawingContext = new Proxy({}, { get: () => noop });

  const base = {
    ...maths, ...consts,
    width: 50, height: 50, windowWidth: 50, windowHeight: 50,
    frameCount: 0, mouseX: 25, mouseY: 25, deltaTime: 16, displayDensity: () => 1,
    textWidth: () => 5,
    drawingContext,
    Waves: {
      wave: (c, o) => recorder.hit(o),
      createGrid: (rows, cols, o) => { recorder.note(o); return new Array((rows | 0) * (cols | 0) || 100).fill(0); },
      createSampler: (o) => { recorder.note(o); return absorber; },
    },
    console: { log: noop, warn: noop, error: noop },
    Math, JSON, Array, Object, Number, String, Boolean, Symbol, Date,
    Uint8Array, Float32Array, Float64Array, Int32Array, Map, Set, isNaN, isFinite,
    parseInt, parseFloat, Error, RegExp, Infinity, NaN, undefined,
  };

  // p5 drawing / typography / transform API the library's preview runtime provides
  // (kept in sync with the redirect list in index.html). These are legitimate
  // no-ops here; any OTHER unknown identifier is a leaked closure var -> not standalone.
  const DRAW_FNS = new Set([
    'fill', 'stroke', 'noFill', 'noStroke', 'strokeWeight', 'strokeCap', 'strokeJoin',
    'background', 'clear', 'ellipse', 'circle', 'rect', 'square', 'line', 'point',
    'triangle', 'quad', 'arc', 'beginShape', 'vertex', 'curveVertex', 'bezierVertex',
    'quadraticVertex', 'endShape', 'bezier', 'curve', 'beginContour', 'endContour',
    'push', 'pop', 'translate', 'rotate', 'scale', 'shearX', 'shearY', 'resetMatrix',
    'applyMatrix', 'rectMode', 'ellipseMode', 'angleMode', 'noLoop', 'loop',
    'textSize', 'textAlign', 'textFont', 'textStyle', 'textLeading', 'textWrap', 'text',
    'colorMode', 'color', 'lerpColor', 'blendMode', 'erase', 'noErase', 'tint', 'noTint',
    'image', 'imageMode', 'smooth', 'noSmooth', 'pixelDensity',
  ]);

  // Proxy backing store so undeclared p5 calls (ellipse, push, …) become no-ops
  // and reads of unknown globals don't throw — except inside the standalone check,
  // where we WANT ReferenceError for leaked closure vars.
  let strict = false;
  const missing = new Set();
  const target = { ...base };
  const handler = {
    has: () => true,
    get(t, prop) {
      if (prop === Symbol.unscopables) return undefined;
      if (prop in t) return t[prop];
      if (typeof prop === 'symbol') return undefined;
      if (DRAW_FNS.has(prop)) return noop; // provided by the library preview runtime
      if (strict) { missing.add(String(prop)); throw new ReferenceError(`${String(prop)} is not defined`); }
      return noop; // non-strict (metrics pass): everything else is a silent no-op
    },
    set(t, prop, val) { t[prop] = val; return true; },
  };
  const ctx = vm.createContext(new Proxy(target, handler));
  return { ctx, setStrict: (v) => { strict = v; }, missing };
}

// ── Recorder for W()/Waves.wave() calls ────────────────────────────────────
function makeRecorder() {
  let used = [];
  let calls = 0;
  const add = n => { if (n && !used.includes(n)) used.push(n); };
  return {
    hit(opts) {
      calls++;
      // A W() call with no `wave` option lets p5.waves hash-pick a wave from the seed
      // — not a fixed name — so we don't fabricate one. Runtime capture still catches
      // dynamically-computed names (e.g. wave: allWaves[w]).
      if (typeof opts === 'string') add(opts);                         // W(x, 'square')
      else this.note(opts);
      return 25; // mid-canvas numeric so geometry maths stay finite
    },
    // Record wave-name strings from any options object (wave / waveRow / waveCol).
    note(opts) {
      if (!opts || typeof opts !== 'object') return;
      ['wave', 'waveRow', 'waveCol'].forEach(k => { if (typeof opts[k] === 'string') add(opts[k]); });
    },
    reset() { used = []; calls = 0; },
    get used() { return used.slice(); },
    get calls() { return calls; },
  };
}

// ── Comment harvesting ──────────────────────────────────────────────────────
function harvestComments(src) {
  const lines = src.split(/\r?\n/);
  const titles = {};       // index -> { title, desc }
  const rowNames = {};     // row -> name
  for (const raw of lines) {
    const line = raw.trim();
    // // ROW 2: Chromatic (20-29)   |   // ROW 0 — RAW OUTPUT: ...
    let m = line.match(/^\/\/\s*ROW\s+(\d+)\s*[:—\-]\s*(.+?)\s*(?:\(.*\))?$/i);
    if (m) {
      let name = m[2].replace(/\s*[:—-].*$/, '').trim(); // keep the headline part
      rowNames[+m[1]] = name || m[2].trim();
      continue;
    }
    // // 50: ant colony   |   // 10: Pulsing circles — wobble sine drives radius
    m = line.match(/^\/\/\s*(\d+)\s*:\s*(.+)$/);
    if (m) {
      const idx = +m[1];
      const text = m[2].trim();
      const parts = text.split(/\s+[—-]\s+/); // em-dash or " - "
      titles[idx] = { title: parts[0].trim(), desc: text };
    }
  }
  return { titles, rowNames };
}

const titleCase = s => s.replace(/\b\w/g, c => c.toUpperCase());

// ── Per-version extraction ──────────────────────────────────────────────────
function extractVersion(version) {
  const src = readFileSync(join(X100, `p5.wavesX100_${version}`, 'sketch.js'), 'utf8');
  const { titles, rowNames } = harvestComments(src);

  const recorder = makeRecorder();
  const { ctx, setStrict, missing } = buildSandbox(recorder);

  // Run sketch + capture FRAMES/STATE out of its lexical scope.
  const wrapped = src +
    '\n;try{ if(typeof setup==="function") setup(); }catch(e){}' +
    '\n;globalThis.__FRAMES = (typeof FRAMES!=="undefined") ? FRAMES : [];';
  try {
    vm.runInContext(wrapped, ctx, { filename: `${version}/sketch.js`, timeout: 8000 });
  } catch (e) {
    console.warn(`  ! ${version}: sketch threw during setup: ${e.message}`);
  }
  const FRAMES = vm.runInContext('globalThis.__FRAMES', ctx) || [];

  const frames = [];
  let skipped = 0;
  for (let i = 0; i < 100; i++) {
    const fn = FRAMES[i];
    if (typeof fn !== 'function') continue;
    const code = fn.toString();

    // (1) metrics — invoke the real closure (STATE seeded) at several time points so
    // waves behind time-gated branches / scrolling galleries get captured. Via vm so a
    // runaway loop under the stub gets interrupted by the timeout.
    recorder.reset();
    setStrict(false);
    for (const tv of [0, 0.37, 1.1, 2.7, 6.3, 13, 27]) {
      try {
        vm.runInContext(`globalThis.__FRAMES[${i}](${tv}, ${Math.round(tv * 30)})`, ctx, { timeout: 1500 });
      } catch (e) { /* drawing-stub edge / timeout, ignore */ }
    }
    // waves_used = union of every `wave:'…'` literal in the source (catches names in
    // untaken branches / galleries) and the names captured at runtime (catches names
    // computed dynamically). Either source alone is incomplete; the union is correct.
    const staticWaves = [...code.matchAll(/wave(?:Row|Col)?\s*:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
    const waves_used = [...new Set([...staticWaves, ...recorder.used])];
    // w_calls = number of W()/Waves.wave() call-sites in the source (a code-complexity
    // hint), matching the original library's semantics — not per-render executions.
    const w_calls = (code.match(/\bW\s*\(/g) || []).length
      + (code.match(/\bWaves\s*\.\s*wave\s*\(/g) || []).length;

    // (2) standalone check — re-eval the source with NO closure; leaked vars throw
    setStrict(true);
    let standalone = true;
    try {
      vm.runInContext('(' + code + ')(0,0)', ctx, { timeout: 2000 });
    } catch (e) {
      if (e instanceof ReferenceError || e.name === 'ReferenceError') standalone = false;
    }
    setStrict(false);
    if (!standalone) { skipped++; continue; }

    const row = Math.floor(i / 10);
    const col = i % 10;
    const meta = titles[i];
    const row_name = rowNames[row] || `row ${row}`;
    // Title priority: an explicit `// <index>: Title` comment, else the first
    // descriptive `// …` comment inside the frame body (v01/v07 style), else a
    // row-based fallback.
    const bodyComment = (code.match(/\/\/\s*([^\n]+)/) || [])[1];
    let title, description;
    if (meta) {
      title = titleCase(meta.title);
      description = meta.desc;
    } else if (bodyComment && !/^\d+:/.test(bodyComment.trim())) {
      const c = bodyComment.trim().replace(/\.$/, '');
      title = titleCase(c);
      description = c;
    } else {
      title = `${row_name} #${col}`;
      description = `${version} frame ${i} — ${row_name}.`;
    }
    const params = (code.match(/^\(?\s*([^)=]*)\)?\s*=>/) || [, 't'])[1]
      .split(',').map(s => s.trim()).filter(Boolean).join(', ') || 't';

    const tags = [...new Set([
      version, row_name.toLowerCase(),
      ...waves_used,
      ...(w_calls === 0 ? ['no-waves'] : ['waves']),
    ])].filter(Boolean);

    frames.push({
      id: `${version}-${i}`, version, index: i, row, col, row_name,
      title, description, params, code, waves_used, w_calls, tags,
    });
  }
  return { frames, skipped, total: FRAMES.filter(f => typeof f === 'function').length, missing };
}

// ── Run all versions ─────────────────────────────────────────────────────────
console.log(`Scanning ${versionDirs.length} version(s): ${versionDirs.join(', ')}\n`);

const all = [];
for (const dir of versionDirs) {
  const version = dir.replace('p5.wavesX100_', '');
  const { frames, skipped, total, missing } = extractVersion(version);
  all.push(...frames);
  console.log(`  ${version}: ${frames.length} frames  (${skipped} skipped of ${total})`);
  if (missing && missing.size) console.log(`      external ids: ${[...missing].sort().join(', ')}`);
}

// ── Vocabulary enrichment ────────────────────────────────────────────────────
// Some frames cycle through wave names held in an array literal (wave: list[i]) and
// only render a subset at any given time. Build a vocabulary of every wave name that
// appears explicitly somewhere, then add any string literal in a frame that matches
// it. Safe (only confirmed wave names are added) and catches the gallery frames.
const vocab = new Set(all.flatMap(f => f.waves_used));
let enriched = 0;
for (const f of all) {
  const lits = [...f.code.matchAll(/['"]([^'"]{2,40})['"]/g)].map(m => m[1]);
  for (const s of lits) {
    if (vocab.has(s) && !f.waves_used.includes(s)) {
      f.waves_used.push(s);
      if (!f.tags.includes(s)) f.tags.push(s);
      enriched++;
    }
  }
}
if (enriched) console.log(`\nVocabulary enrichment: +${enriched} wave reference(s) across gallery frames`);

// ── Write _all_frames.json (raw per-version) ─────────────────────────────────
const byVersion = {};
for (const f of all) {
  const { id, row_name, title, description, tags, ...raw } = f;
  (byVersion[f.version] ||= []).push(raw);
}
writeFileSync(join(HERE, '_all_frames.json'), JSON.stringify(byVersion, null, 2));

// ── Write frames-library.json (the file the library page loads) ──────────────
const library = {
  schema_version: 2,
  library_version: '2.0.0',
  description: 'Complete 50x50 p5.waves frame library — every self-contained frame across all x100 versions.',
  generated_from: versionDirs,
  frame_count: all.length,
  scaffold: {
    canvas_size: 50,
    signature: '(t, fc) => void',
    context: 'drawn at local 0,0 to 50,50 (already translated and clipped)',
    helpers: {
      W: 'function W(c, o) { return Waves.wave(c, o); }',
      STATE: 'shared per-frame state object (seed in your own setup if needed)',
      dependencies: ['p5.js ^1.11.3', 'p5.waves ^2.1.0'],
    },
  },
  frames: all,
};
writeFileSync(join(HERE, 'frames-library.json'), JSON.stringify(library, null, 2));

console.log(`\nTotal: ${all.length} frames -> frames-library.json + _all_frames.json`);
