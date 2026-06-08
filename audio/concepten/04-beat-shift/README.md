# 04 · Beat → shift

Elke **beat** kiest het nummer een nieuwe golfvorm. De morph tussen de golven
eased soepel in de tussentijd.

## Kern-inzicht
Uit de p5.waves-guide:
> *"shift has no internal clock — it reads the `t` value you pass in."*

Dus stuur je `shift` niet met de wandklok maar met de **muziek**. Eén shift-cyclus
duurt `shiftInterval + shiftDuration` t-eenheden. Zet die samen op `1.0`, verhoog
een `target` met `+1` per beat, en lerp `t` er soepel naartoe:

```js
const sampler = Waves.createSampler({
  shift: true, shiftInterval: 0.1, shiftDuration: 0.9   // cyclus = 1.0
});
if (audio.beat) target += 1;          // één nieuwe golf per beat
tBeat = lerp(tBeat, target, 0.12);    // morph eased ertussenin
sampler.sample(x, tBeat);
```

Stilte → geen beats → `target` bevriest → de golf staat stil. Drum & bass met
veel beats → snelle, ritmische golfwissels.

## API
- `Waves.createSampler({ shift, shiftInterval, shiftDuration, group })`
- getters: `sampler.waveName`, `sampler.targetName`, `sampler.mix`, `sampler.shifting`
- `audio.beat` (true op het frame van een beat — shared/audio.js)
