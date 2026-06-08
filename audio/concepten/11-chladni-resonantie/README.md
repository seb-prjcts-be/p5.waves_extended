# 11 · Chladni-resonantie

Ernst Chladni (1756–1827) bestrooide trilplaten met zand en streek er een
strijkstok langs. Op de **nodal lines** (nulpunten) staat de plaat stil — zand
hoopt op. Op plekken met hoge amplitude vliegt het zand weg. De geometrische
patronen veranderen met de resonantiefrequentie (mode).

## De wiskunde

Symmetrische staandegolfformule voor een vierkante plaat:

```
f(x, y) = sX(x·m) · sY(y·n)  +  sX(x·n) · sY(y·m)
```

| Symbool | Betekenis |
|---|---|
| m, n | modenummers (gehele getallen ≥ 1) |
| sX, sY | twee p5.waves-samplers (zelfde golftype) |
| Nulpunt `\|f\| < drempel` | licht (zand) |
| Hoge amplitude `\|f\|` groot | donker (geen zand) |

De **symmetrische vorm** (twee termen) geeft de kenmerkende diagonale kruislijnen
van echte Chladni-patronen. Met alleen `sX(x·m)·sY(y·n)` krijg je een gewoon
rechthoekig raster.

## Verschil met concept 10 (interferentieveld)

| | Concept 10 | Concept 11 |
|---|---|---|
| Formule | `(sRow + sCol) × 0.5` | `sX·sY + sX'·sY'` |
| Visualisatie | kleurschaal | threshold bij ≈ 0 |
| Patroon | interferentiegolven | dunne nulpuntlijnen |

Eén verschil bepaalt alles: **product vs. som**, en **drempelwaarde vs. kleurschaal**.

## Audio-koppeling

| Audio | Parameter | Effect |
|---|---|---|
| bass | m (1–8) | horizontale mode-dichtheid |
| treble | n (1–8) | verticale mode-dichtheid |
| beat | snap (m,n) + volgend golftype | nieuwe resonantie-mode |
| energy | drempeldikte | luid = dikkere nodal lines |

Mode-wissel op de beat = audioanalogon van Chladni die een plaat van
resonantiefrequentie verandert. De integers m en n zijn de visuele harmonischen.

## p5.waves: meer dan een scope

Met `classic sine` → authentieke Chladni (identiek aan fysieke platen).
Met `triangle`, `batman`, `mountain peaks` → **niet-fysische Chladni**: dezelfde
topologische structuur (nulpuntnetwerken), maar formules die geen enkele plaat
kan realiseren. Dat is de meerwaarde: de golfidentiteit van p5.waves als
resonantiebron in plaats van een echte oscillator.

## Render-strategie

`pixels[]` met `pixelDensity(1)` en cellen van 4×4 px. Per cel: 4 sampler-calls,
daarna 16 pixel-writes. Op een 1920×1080 scherm: ~130k cellen × 4 calls = ~520k
sampler-calls/frame. Ruim snel genoeg voor 60fps.

## API

- `Waves.createSampler({ wave, range: [-1, 1] })`, `sampler.sample(x, t)`
- `audio.bands.{bass,treble}`, `audio.beat`, `audio.energy`
- `pixels[]`, `pixelDensity(1)`, `loadPixels()`, `updatePixels()`
