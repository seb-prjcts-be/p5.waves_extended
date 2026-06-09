# p5.wavesX100

## Missie
Deep creative exploration of the p5.waves library through 100-frame animated grids. Each version pushes the library further — from basic showcase to library-as-engine. Built with the `/p5-grid` skill.

## Boom
```
p5.wavesX100/
├── index.html                  ← Link page to all versions
├── cloud.md                    ← This file
├── p5-grid-skill-v1.md         ← Exported skill prompt
├── p5.wavesX100_v01/           ← Original p5.js technique showcase
│   ├── index.html
│   └── sketch.js
├── p5.wavesX100_v02/           ← Library-driven (every frame uses p5.waves)
│   ├── index.html
│   └── sketch.js
├── p5.wavesX100_v03/           ← Third iteration (user-added)
│   ├── index.html
│   └── sketch.js
├── p5.wavesX100_v04/           ← Wildly creative edition
│   ├── index.html
│   └── sketch.js
├── p5.wavesX100_v05..v06/     ← B&W typografie + Oswald grayscale
├── p5.wavesX100_v07/           ← 100 Tiny Worlds (thematic)
│   ├── index.html
│   └── sketch.js
└── library/                    ← Frame Library (frame-browser, zoek/filter/kopieer)
    ├── index.html              ← laadt frames-library.json, live previews via mini-p5-runtime
    ├── build-library.mjs       ← GENERATOR: scant alle versies → frames-library.json (+_all_frames.json)
    ├── frames-library.json     ← GEGENEREERD - niet handmatig bewerken
    ├── _all_frames.json        ← GEGENEREERD - ruwe per-versie dump
    └── README.md               ← hoe regenereren / nieuwe versie toevoegen
```

## Regels
- Elke versie leeft in een eigen `p5.wavesX100_vXX/` map
- Twee bestanden per versie: `index.html` + `sketch.js`
- Canvas is fullscreen, grid (500×500) altijd gecentreerd
- Geen `createGraphics()` — single canvas met translate+clip
- Scaffold is vast, alleen frames variëren
- p5.waves v2.1.0 (v2.1.1 bestaat niet op CDN)

## Versies

### v01 — p5.js Technique Showcase
De eerste poging. 100 frames die p5.js zelf tonen, met p5.waves in ~35% van de frames.

| Rij | Thema |
|-----|-------|
| 0 | Shape primitives — circle, rect, triangle, arc, quad, bezier, points, lines, ellipses, blob |
| 1 | Math curves — Lissajous, spirograph, rose, Fermat spiral, superformula, epicycloid |
| 2 | Color & gradients — HSB sweep, plasma, neon glow, dither, alpha, gradient mesh |
| 3 | Wave visualization — 10 wave types als waveforms |
| 4 | Patterns — checkerboard, hex, voronoi, truchet, sierpinski, koch |
| 5 | Particles & physics — fountain, fireflies, double pendulum, flocking, gravity, brownian |
| 6 | Pixels & cellular — TV static, Conway Life, reaction-diffusion, Mandelbrot, XOR |
| 7 | Typography — typewriter, matrix rain, spiral text, binary counter, ASCII |
| 8 | 3D & illusions — isometric cubes, wireframe cube, sphere, tunnel, fog mountains |
| 9 | Advanced — flow field, Lorenz attractor, oscilloscope, kaleidoscope, clock |

### v02 — Library-Driven
Elke frame gebruikt p5.waves. 10 "visual lenses" als structuur.

| Rij | Lens |
|-----|------|
| 0 | Raw output — 10 wave types als labeled waveforms |
| 1 | Shape driver — waves sturen grootte, positie, hoeken |
| 2 | Color engine — waves → hue, saturation, brightness, alpha |
| 3 | Motion control — waves → snelheid, richting, rotatie |
| 4 | Pattern generator — waves → grids, tessellaties, Voronoi |
| 5 | Organic forms — particles, boids, blobs, tendrils, DNA |
| 6 | Texture & pixels — plasma, displacement, Life, reaction-diffusion, Mandelbrot |
| 7 | Composition — interference, layering, chained waves, beat sequencer |
| 8 | Spatial & 3D — isometric cubes, wireframe cube, sphere, fog mountains, parallax |
| 9 | Extremes — all 34 waves, Lorenz, frequency sweep, seed space, wave-of-waves |

### v03 — (user-supplied)
Inhoud door gebruiker toegevoegd.

### v04 — Wildly Creative
Maximale creativiteit. Library als engine voor alles.

| Rij | Lens | Hoogtepunten |
|-----|------|-------------|
| 0 | Raw output | Polar waveform, bar chart, dot matrix, 3D ribbon, phase portrait, heatmap, spiral |
| 1 | Shape driver | Breathing heart, wave gear, morphing star, pac-man, crown, iris eye |
| 2 | Color engine | Aurora, stained glass voronoi, sunset, neon tubes, prismatic fan, thermal camera, RGB split |
| 3 | Motion | Newton's cradle, typewriter, windshield wiper, trampoline, pendulum wave, caterpillar, pinball |
| 4 | Pattern | Warp/weft weave, wave maze, fish scales, brick wall, spirograph, domino cascade, quilting |
| 5 | Organic | Ant colony, wave turtle, crystal growth, erosion, schooling fish, lightning, jellyfish, EKG |
| 6 | Texture | Wave Life, reaction-diffusion, woodgrain, water caustics, glitch bands, CRT scanlines, fire |
| 7 | Composition | 4-wave interference, mountain layers, oscilloscope, chained waves, beat sequencer, radar |
| 8 | Spatial | Voxel landscape, starfield warp, rotating donut, parallax city, galaxy, planet with ring, hologram |
| 9 | Extremes | All 34 waves, wave chess, seismograph, feedback, comet swarm, FM synthesis, 3D DNA, grand unified |

### v07 — 100 Tiny Worlds
Thematische rijen. ~11.800 W() calls per render. Elke frame gebruikt p5.waves meaningfully.

| Rij | Thema |
|-----|-------|
| 0 | Living Things — cell division, paramecium, DNA helix, coral, heartbeat |
| 1 | Optical Play — moiré, Penrose, afterimage, op-art, Hermann grid, zoetrope |
| 2 | Chromatic — rainbow, complementary, triadic, chromatic aberration, gradient mesh |
| 3 | Wave Showcase — noise terrain, square grid, sharp peaks, mountain silhouettes, ECG |
| 4 | Textile — woven fabric, knit, tartan, houndstooth, lace, embroidery, cross-stitch |
| 5 | Fluid — flow fields, smoke, ripples, ink, lava lamp, whirlpool |
| 6 | Glitch — pixel sort, VHS, RGB split, digital rain, CRT, BSOD, compression |
| 7 | Typographic — letter architecture, ASCII density, binary, Morse, barcode, QR |
| 8 | Spatial — wireframe cube, torus, isometric, parallax, depth fog, impossible triangle |
| 9 | Cosmic — starfield, nebula, solar system, black hole, aurora, galaxy, eclipse, grand finale |

## p5.waves API Samenvatting
- `Waves.wave(coordinate, options)` — hoofdfunctie, geeft altijd een getal terug
- 34 wave types (sine, triangle, square, batman, noise, pulse, ramp, etc.)
- Opties: `wave`, `seed`, `range:[min,max]`, `frequency`, `phase`, `t`, `amplitude`
- `Waves.createSampler(opts)` — snellere variant voor tight loops
- Seed strategie: `frameIndex * 10 + paramOffset` voor uniekheid
- CDN: `https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.waves@v2.1.0/p5.waves.min.js`

## Notities
- 2026-04-01: v2.1.1 tag bestaat niet op jsDelivr, gebruik altijd v2.1.0
- 2026-04-01: createGraphics() crasht in sommige preview-omgevingen (101 canvas contexts), daarom single-canvas + clip approach
- 2026-04-01: Skill `/p5-grid` aangemaakt in `~/.claude/commands/p5-grid.md`
- 2026-04-01: Toekomstidee v2 skill: global emergent layer (flow field, tide, pulse) die over alle 100 frames heen werkt
- 2026-06-09: Frame Library nu VOLLEDIG (670 frames, alle 7 versies) i.p.v. gecureerde 111. `build-library.mjs` is de herhaalbare generator: nieuwe versie = map `p5.wavesX100_vNN/` droppen + `node build-library.mjs`. Extractie draait elk frame in een p5-stub (waves_used = unie van source-literals + runtime-capture op meerdere t; w_calls = call-sites; titel uit comments). Closure/loop-frames (row0 van v02/v03/v06, 30 stuks) worden bewust overgeslagen: niet zelfstandig kopieerbaar/preview-baar. `DRAW_FNS` in script ⇄ `redirects` in index.html synchroon houden (script logt onbekende ids). Geverifieerd in browser: 670/670 compileren, 0 ReferenceErrors.
