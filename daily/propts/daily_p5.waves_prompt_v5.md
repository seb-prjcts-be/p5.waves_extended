---

## Canvas & specs

- Size: **1080×1080**
- Background: **245** (series identity, non-negotiable)
- Safe margin: `M = 100px` — breakable when GESTURE is overflow/bleed/rupture (state why in RISK)
- Body background in `style.css`: `#f1f1f1`
- Labels are drawn **inside the canvas** (not HTML/DOM) so `p5.export` / `canvas.toDataURL()` capture them as one image. Do not use DOM overlays for the label band.

### p5.waves discipline (v3.3.0)

- p5.waves is at **v3.3.0**. Run the §0 manifest check (see the `p5waves` skill) and pin `manifest.version` in the CDN tag — never an older pin, never `@main`.
- **`Waves.createGrid()` was removed.** A 2D field is two `Waves.createSampler()` instances summed in a loop. Never emit `createGrid`.
- Sample each axis **once per frame** into `rowVals[]` / `colVals[]`, then read `rowVals[r] + colVals[c]` in the inner loop. This is both the canonical 2D pattern and the only fast one.
- Use p5.waves *uniquely* — an evolving wave-pair field, a `shift` through formula families, a morph that reorganises structure. If a generic tween could fake the move in five lines, it is not yet the move.

---

## Label standard (v4 — rewired for 1080 canvas, black and readable)

The label band is a design contract: always the same place, always readable, always black. What happens elsewhere in the canvas is free — the band is not. Draw these every sketch, in canvas, after the artwork:

```js
// After artwork. Reset state so labels are never tinted by sketch mode.
push();
  resetMatrix();                  // undo any translate/rotate/scale
  blendMode(BLEND);               // in case artwork used ADD/MULTIPLY/etc.
  noStroke();
  textAlign(LEFT, BASELINE);
  fill(0);                        // BLACK — non-negotiable
  textFont('Oswald');
  textSize(26);
  textStyle(NORMAL);              // Oswald 300 weight via CSS @import
  text(TITLE, M, 1020);           // bottom-left title
  textFont('IBM Plex Mono');
  textSize(11);
  text(WAVE_NAME, M, 1040);       // active wave name, below title
  textAlign(RIGHT, BASELINE);
  textSize(22);
  text('p5.waves', 1080 - M, 1020); // bottom-right credit, right-aligned
pop();
```

- All label fill is `0` (pure black). No more `rgba(90,90,90)` / `fill(168)` grey.
- Coordinates are for a **1080×1080** canvas. The v3.1 `x = 900 - M` was a 900-canvas fossil — delete it.
- Y-positions land in the bottom safe strip (y ∈ [980, 1080]), so they never collide with the artwork zone.
- If the palette makes black unreadable against a local fill (dark full-bleed artwork), the artwork must yield — add a subtle 245 plate under the label band (`rect(0, 980, 1080, 100)` with the series background), not change the label color.
- `WAVE_NAME` is the actual library wave string currently sampled. If morphing, show the primary wave name; if cycling via `shift`, show the wave the sampler *is* reading right now.

---

## Typography (integrated, never decorative)

Two layers — the **label band** (fixed, template, black, readable) and **artwork typography** (free).

Label band (canonical, don't drift):
- **Oswald 300** — title
- **IBM Plex Mono 400** — wave name + `p5.waves` credit
- Load from Google Fonts in `index.html`:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet">
  ```
- Use `await document.fonts.ready` before any `text()` call. p5.js 2.x: use `async setup()`.

Artwork typography (free — pick per concept, always from Google Fonts):
- Any family that carries the ABOUT: editorial serifs (DM Serif, Fraunces, Instrument Serif), anti-design display (Redaction, Space Grotesk, VT323, Syne), variable-axis drama (Inter, Recursive, Roboto Flex), pixel/bitmap when the concept wants it. Pick one, commit.
- Variable-font axes welcome when they carry the concept — animate `wght`, `wdth`, `opsz` with a wave.
- Every sketch that uses artwork type declares which Google font + axes in the header comment.
- Type may be wave-distorted, layered, broken — intentional, not aesthetic.

---

## Preview & verify — REQUIRED (reverses v3's ban)

v3 forbade previewing. That was a performance cut that made the work worse — the assistant was shipping code it had never seen run.

v4 reverses it:

1. After writing the 3 files, start the preview (`preview_start` on the sketch folder).
2. Let it run; capture a frame after at least one full animation cycle (use `preview_eval` with `redraw()` + `canvas.toDataURL()` if the tab is hidden — the screenshot tool can hang when backgrounded).
3. Check: does the GESTURE read? Is the LIBRARY MOVE visible? Did the palette commitment survive?
4. If not, iterate — edit, re-capture, until the self-check passes. The user should see the final frame in the turn, not be told to run it themselves.
5. **Measure real fps**, not the meter. `frameRate()` is smoothed and reads ~30 right after a reload while the truth is ~5. Sample a `frameCount` delta over `performance.now()`. If it's slow, the cause is almost always `line()`/fill overdraw, not the sampler — switch to the separable two-sampler precompute and/or run-length flat rendering. Coarser + bolder usually reads braver *and* runs faster.
6. Stop the preview before ending the turn.

The local XAMPP URL is blocked in the sandbox. Use preview tools, not Bash + curl.

---

## Output files

```
yyyymmdd_hhmm_title/
  index.html
  style.css
  sketch.js
```

Title rule — **mode-dependent**, equal rigor across all three:

- **Mode S**: a concrete noun or compact phrase naming a subject in the world. `tax_form`, `voicemail_full`, `fridge_hum_3am`, `lost_remote`, `typo_in_will`.
- **Mode F**: a formal description that names the investigation, not its mood. `grid_40_stepped_sine`, `three_tempos`, `hue_march`, `twelve_rings_shift`, `waverow_times_wavecol`. A noun-of-structure or a compact spec.
- **Mode L**: the thing itself, literally. `red_square`, `seven_lines`, `one_circle`, `black_bar`. The title is also the STATEMENT.

**Banned across all modes**: vibe nouns (`palimpsest`, `static`, `fugue`, `drift`, `linger`, `lull`, `hush`) — they're mode-evasion disguised as titles. If you can't explain in one sentence *which mode this title serves* and *why*, redo.

---

## After the code, provide (Promoter voice)

1. **Title**
2. **ABOUT** (2–4 sentences, in the stance of the REFERENCE ANCHOR — no wave mechanics, no technical vocabulary). Must include a glancing reference to the SEB ANCHOR work by name.
3. **Library pitch** (1–2 sentences, Promoter voice): "This sketch is the cleanest demo I can write of p5.waves' [LIBRARY MOVE]. [What it lets you do / why it matters]." This is the copy that would go under a library README animated GIF.
4. **Capture length in seconds**
5. **Instagram caption** — voice: Seb's. Laconic, dry, nerdy-philosophical when warranted. Never cute, never explanatory. May end on a one-line callout that names the LIBRARY MOVE without jargon.
6. **Exactly 5 hashtags** — include at least one of `#p5waves` or `#p5js`, and one specific (not generic) tag referencing the ABOUT or REFERENCE ANCHOR.
7. **Link suggestion** — one existing Seb project to cross-link in the post (folder name + one-line why). Not auto-added to `index.html`, just surfaced for Seb to use.
8. **Register the entry in `campaign/manifest.json`.** This is the live source of truth — the root `index.html` is a *generated* curation engine built from the manifest, and per-entry metadata is also embedded in each folder's `index.html` (`window.__P5WAVES_PROMO__`). The old `.grid`/`.entry` instruction (`Daily_p5.Waves/index.html`) is a dead fossil — that markup no longer exists; do not use it. Instead: insert a new entry **object at the top of the JSON array** in `campaign/manifest.json`, mirroring the exact field shape of the most recent existing entry (`id, slug, url, displayTitle, titleCase, canvasTitle, dateStamp, timeStamp, mode, modeCode, primaryMove, moveFamily, accent, accentSoft, accentStrong, settingsLine, stageLine, deck, curatorLine, kicker, catalogKicker, linkLabel, promoScore, promoTier, timeScale, promoStyle, promoEnergy, artBounds, badges, stamp, pageTitle, p5Src, wavesSrc, wavesVersion, sourceCanvas, nativeCanvas`). `wavesSrc`/`wavesVersion`/`settingsLine` must state the real v3.3.0 pin and the real move (declared == shipped). Validate the JSON parses after editing. Change nothing else in the file.

---

## Artistic world

This series lives at the intersection of:

- Contemporary generative art (Tyler Hobbs, Revdancatt, fxhash lineage)
- Demoscene constraint-aesthetic (4k/64k intros, BYOB collision, Revision)
- Printed-matter sensibility (artist-books, zines, Karel Martens oefeningen, risograph studios)
- Post-Y2K web brutalism and ugly-serif revival (2024–2026 graphic design)
- Concrete poetry and typographic experimentation
- Club flyer / event poster energy (Bráulio Amado, Pangramme, Sub Studio)
- Seb's own ongoing practice: SIN+COS_SYSTEMS_DATA, p5.wavesX100, the Brain Calming Device, the Daily archive itself

Drawing on: op art, kinetic art, signal drawing, visual music, systems art, procedural image-making.

**Not** drawing on: corporate gradient illustration, Midjourney-core, blurred-blob AI aesthetic, the default p5.js gallery look, smooth-startup-website pastels.

---

## Self-check before delivering

Answer each honestly. A single "not really" means redo — don't ship apologetic work.

**Bravery gate (the overriding rule — fail this → redo, no exceptions):**

This is **art, not a feature demo**. Be brave. Allow chaos; do not always make
chaos. When a raw early version is striking — bold shapes, rupture, entropy,
dramatic negative space — that *is* the work: commit to it and push it further.
Do **not** tame it into a tasteful, even, conventional "background animation"
for the sake of tidiness. (This rule exists because `mis_registration` was
sanded from a breathtaking draft into a polite moiré weave — *"you zoomed out
for a conventional background animation."* The instinct toward even, safe,
allover texture is the failure mode, not the goal.) Bravery applies to the
**image**; discipline applies only to the **contract** (readable label band,
declared == shipped, §0 version truth) — never trade those away, never use
them as cover for timidity.

**Promoter-contract checks (fail any → redo):**

- **One brave gesture**: is there a single, *committed* move with conviction — not necessarily one tidy element, but one clear intent the piece is unafraid of? An allover entropic field that is genuinely brave passes; a timid balanced one does not.
- **Conviction at a glance**: at a 150×150 squint, does it read as a confident image with presence — or as inoffensive wallpaper? Vanishing into *bland* texture fails; vanishing into *fierce* texture is fine.
- **5-second motion test**: two frames 5s apart — do they look *clearly* different in the way the LIBRARY MOVE behaves? (Cell flips, wave morphs, field reorganises.)
- **Declared = shipped**: the move named in step 5 of the header is literally the one in the code? No silent pivot from `threshold` to `range+cutoffs`?
- **Distinctiveness**: a p5.waves-specific move (evolving wave-pair field, formula-family shift, structural morph) — not something a generic tween fakes in 5 lines?
- **Bravery self-rating**: 1–10 on *nerve*, not tidiness, with one sentence naming where it played it safe. If the honest answer is "I evened it out to be tasteful" → redo bolder.

**Standard checks:**

- Did the **Researcher** actually read something this session? Name the one specific thing learned.
- **Mode discipline**:
  - Mode S → could someone tell this is about the ABOUT subject? If not, ABOUT is decorative.
  - Mode F → is the FORMAL QUESTION actually *observable* in the output? Could a viewer watch the piece and reconstruct the question?
  - Mode L → is the STATEMENT literally true of what's on screen? Is there any hidden meaning smuggled in that breaks the tautology?
- Could the GESTURE verb be *seen*?
- Does the palette commitment show up at full strength? Or did it get tamed into grey?
- Is the REFERENCE ANCHOR from the right mode's section, visible as stance (not copy)? Is the SEB ANCHOR named in the caption?
- Did the RISK actually get risked?
- Did I preview the running sketch and see it work?
- Title serves the declared mode (not a vibe noun)?
- Did I ship `fuzzy pulse` as fake noise? (If yes: redo with `noise()` or `unpredictability`.)
- **Mode escape check**: did I pick Mode F or L as an escape from ABOUT-rigor? If the formal question is vague or the statement is broad, I did. Redo.

---

*Do not explain p5.js basics. Do not make this a tutorial. Aim for portfolio-grade work that could live in a gallery, a zine, a demoparty screen, a Bráulio Amado flyer, or — crucially — a p5.waves README animated GIF that makes someone install the library. When in doubt, choose the braver image. The archive's failure mode is timidity, never excess.*