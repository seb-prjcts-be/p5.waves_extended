# 09 · Timbre → golf-identiteit

De meeste audio-visuals reageren alleen op **volume**. Dit concept reageert op
**timbre**: het spectraal zwaartepunt (helderheid) kiest *welke golf* je ziet.

## Concept
Een palet golven, geordend van dof → scherp:
```
classic sine → bumpy sine → triangle → mountain peaks → sharp peaks → square → up down noise
```
Het spectraal zwaartepunt (`audio.centroid`, 0..1) schuift een index door dat
palet. Tussen twee buren morphen we vloeiend:
```js
const f = centroid * (PALET.length - 1);
const lo = floor(f), hi = lo + 1, frac = f - lo;
Waves.wave(x, { wave: [PALET[lo], PALET[hi]], mix: frac, t, amplitude });
```
Donker geluid (veel bass) → zuivere sinus. Helder/scherp geluid (hi-hats, snares)
→ hoekige, ruige golven.

## Waarom dit méér is dan een waveform
De **vorm-vocabulaire** volgt de klankkleur, niet de luidheid. Twee even luide
passages met ander timbre zien er compleet anders uit — iets wat een
amplitude-scope nooit toont.

## Verwant
Je kunt het zwaartepunt ook op `group` mappen (`'gentle'` vs `'harsh'`) i.p.v. op
een handmatig palet.

## API
- `audio.centroid` (spectraal zwaartepunt, shared/audio.js)
- `Waves.wave(x, { wave: [a, b], mix })`
