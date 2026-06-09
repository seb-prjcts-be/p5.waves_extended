# Frame Library — build pipeline

The Frame Library (`index.html`) is a browser over **every self-contained frame** across
all `p5.wavesX100_v*` versions. It loads `frames-library.json`, which is **generated** —
do not hand-edit it.

## Regenerate

```bash
cd x100/library
node build-library.mjs
```

This (re)writes two files:

| file                  | what                                                                 |
|-----------------------|----------------------------------------------------------------------|
| `frames-library.json` | flat list the library page loads (id, title, code, waves_used, tags…) |
| `_all_frames.json`    | raw per-version dump (no titles/tags) — handy for other tooling      |

## Adding a new grid version

1. Drop the new sketch in `x100/p5.wavesX100_vNN/sketch.js` (same shape as the others:
   a top-level `const FRAMES = [];` populated inside `setup()` → `registerFrames()`).
2. Run `node build-library.mjs`.
3. That's it — the new version's frames appear in the library, filterable by `vNN`.

Add the version card to `x100/index.html` (`ITEMS` array) for the launcher grid too.

## How extraction works

For each version the script runs `sketch.js` in a stubbed-p5 sandbox to populate
`FRAMES[]`, then per frame:

- **code** — `FRAMES[i].toString()` (verbatim, copy-pasteable).
- **waves_used** — union of every `wave:`/`waveRow:`/`waveCol:` literal in the source
  *and* the wave names captured by actually invoking the frame at several time points
  (catches gallery frames that cycle a name array), then enriched against the project-wide
  wave vocabulary.
- **w_calls** — number of `W()` / `Waves.wave()` call-sites in the source.
- **title / description** — harvested from the sketch comments (`// N: Title` or the first
  `// …` line in the frame body), with a row-based fallback.

### What gets skipped

Frames defined inside a loop via a closure (e.g. the `row 0` waveform strips:
`FRAMES[n] = ((wv,col)=>(t)=>…)(…)`) reference variables that don't exist once the frame
is serialized on its own, so they can't be previewed or copied standalone. The build skips
exactly those and logs the count per version. Everything else is included.

The set of p5 functions the library preview provides is mirrored between this script
(`DRAW_FNS`) and the `redirects` list in `index.html` — keep them in sync if a new sketch
uses a p5 drawing function not yet covered (the script logs unknown identifiers).
