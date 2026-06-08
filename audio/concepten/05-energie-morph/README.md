# 05 · Energie → morph + flux → wild

Twee **continue** audio-features sturen twee **continue** golf-eigenschappen —
geen schakelaars, geen beats, maar een vloeiend ademend timbre.

## Concept
| Audio-feature | Golf-parameter | Effect |
|---|---|---|
| energie (luidheid) | `mix` | blend `'classic sine'` (stil) → `'batman'` (luid) |
| spectrale flux | `mode: 'wild'` + `unpredictability` | plotse spectrale sprongen → chaos op de drop |

```js
Waves.wave(x, {
  wave: ['classic sine', 'batman'],   // morph-paar
  mix:  energySmooth,                  // 0=sine, 1=batman
  mode: flux > 0.22 ? 'wild' : 'stable',
  unpredictability: fluxSmooth,
  t, amplitude
});
```

## Waarom dit méér is dan een waveform
Een rauwe golf wordt alleen luider/zachter. Hier verandert de **identiteit** van
de vorm met de muziek: rustige passages zijn zuivere sinussen, de drop wordt
hoekig én chaotisch. De vorm *interpreteert* het nummer.

## API
- `Waves.wave(x, { wave: [a, b], mix, mode, unpredictability })`
- `audio.energy`, `audio.flux` (shared/audio.js)

## Detail
Beide features worden gelerpt (`lerp(..., 0.08)`) → stabiele, organische beweging
i.p.v. nerveus geflikker.
