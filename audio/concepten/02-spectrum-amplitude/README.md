# 02 · Spectrum → amplitude-lagen

Drie gestapelde golflijnen waarvan de **amplitude** door de frequentiebanden
wordt gestuurd: bass → laag 1, mid → laag 2, treble → laag 3.

## Concept
Elke laag is een eigen `Waves.createSampler()` met een andere golf en frequentie.
Het nummer "duwt" elke laag afzonderlijk omhoog/omlaag naargelang waar de energie
in het spectrum zit. Bij brunk – Akoxylo zie je de bass-laag pompen op de kick en de
treble-laag flikkeren op de hi-hats.

## Techniek-truc
Een sampler bakt zijn `amplitude` éénmalig in. Om de amplitude per frame
reactief te houden, configureer je de sampler **genormaliseerd** (`range: [-1, 1]`)
en vermenigvuldig je het resultaat in de sketch:
```js
const s = Waves.createSampler({ wave: 'classic sine', range: [-1, 1] });
const amp = base + audio.bands.bass * 240;     // reactief
const y = s.sample(x, t) * amp;
```

## API
- `Waves.createSampler({ wave, frequency, range })`
- `sampler.sample(x, t)`
- `audio.bands.{bass,mid,treble}`

## Detail
`blendMode(ADD)` zorgt voor glow op de kruispunten van de lagen.
