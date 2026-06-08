# 08 · Golf op golf (domein-warp / nesting)

Een rauwe golf is plat. Formules kun je **stapelen** — golf A vervormt de *ruimte*
van golf B.

## Concept
```js
warped(x) = Waves.wave( x + Waves.wave(x, A), B );
```
De binnenste golf (A) buigt het **domein** (de x-as) waarop de buitenste golf (B)
wordt geëvalueerd — verwant aan domain warping en FM-synthese, maar met
bibliotheekgolven. Audio (bass) stuurt de warp-sterkte → de ruimte van B ademt
op de kick.

Op het scherm: grijs = B zonder warp (referentie), blauw = A (de vervormer),
roze = het resultaat.

## Andere nesting-vormen (zelfde idee)
- **Parameter-modulatie:** output van A → `frequency` / `amplitude` / `phase` / `t` van B
- **Som-veld:** `waveRow(row) + waveCol(col)` → zie concept 10
- **Recursieve diepte op de beat:** elke beat een laag erbij, reset op de drop

## Waarom dit méér is dan een waveform
Nesting geeft **compositie en hiërarchie**: een trage golf die een snelle golf
stuurt. Een scope toont één signaal; hier bouw je structuur in lagen.

## API
- `Waves.wave(x, { wave, t, frequency, amplitude })` — genest
- `audio.bands.bass` (shared/audio.js)
