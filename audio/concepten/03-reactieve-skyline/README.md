# 03 · Reactieve skyline (spectrum → x-as)

De **x-as wordt het frequentiespectrum**: links lage tonen, rechts hoge. Een
p5.waves-golf vormt de golvende middellijn; de **dikte** van het lint op elke x
is de FFT-magnitude van die frequentie.

## Concept
Een gewone spectrum-analyzer toont kale staafjes. Hier rijdt het spectrum mee op
een herkenbare golf-**vorm** (`'mountain peaks'`). Zo zie je tegelijk *waar* de
energie zit (data) én een esthetische identiteit (form) — iets wat een rauwe
waveform niet biedt.

```js
const bin    = floor(map(x, 0, width, 0, bins * 0.55));  // x = frequentie
const mag    = audio.spectrum[bin] / 255;                // energie daar
const center = height/2 + Waves.wave(x, { wave:'mountain peaks', t, amplitude:70 });
const thick  = mag * height * 0.42;                       // dikte = energie
```

## API
- `audio.spectrum` (Uint8Array, magnitudes 0..255)
- `Waves.wave(x, { wave, t, frequency, amplitude })`

## Detail
HSB-kleur volgt de x-positie (= frequentie), van magenta (laag) naar geel (hoog).
Het lint is één gevulde `beginShape`/`endShape(CLOSE)` over de boven- en onderrand.
