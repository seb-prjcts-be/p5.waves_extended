# 07 · Closed-form ring op de beat  ⭐

Het vlaggenschip — het concept dat een opgenomen audiogolf **principieel niet kan**:
gesloten ringen die op elke beat naar een nieuwe gesloten vorm klikken, zonder
naad-sprong.

## Twee v3.3.0-eigenschappen die samenkomen

**1. De `closing`-groep (naadloze gesloten vorm)**
17 golven die dezelfde basisperiode delen. In een polaire mapping sluit een ring
alleen naadloos als je over een **geheel veelvoud** van de periode veegt. Omdat
alle closing-golven die periode delen, blijft de ring gesloten — óók *tijdens* de
morph van golf A naar golf B.

```js
const ring = Waves.createSampler({ shift: true, group: 'closing', range: [-1, 1] });
const basePeriod = ring.period;                       // v3.3.0 getter
// per hoek:
const x   = theta / TWO_PI * (lobes * basePeriod);    // geheel aantal periodes
const rad = R + ring.sample(x, tBeat) * amp;
```

**2. Shift heeft geen eigen klok → beat-gequantiseerde t**
Net als concept 04: `if (audio.beat) target += 1; tBeat = lerp(tBeat, target, 0.12)`.
Elke beat = één nieuwe gesloten vorm; de morph eased ertussenin.

## Compositie
Drie concentrische ringen (3 / 5 / 8 lobes), elk een eigen golf-sequentie maar
gesynchroniseerd op dezelfde beat-klok → een mandala die ademt op het nummer.
Energie → ring-amplitude; beat → vorm-wissel + flits.

## API
- `Waves.createSampler({ shift, group: 'closing', shiftInterval, shiftDuration })`
- **`sampler.period`** (v3.3.0) → exact aantal lobes berekenen
- `sampler.waveName`, `sampler.targetName`, `sampler.shifting`
- `audio.beat`, `audio.energy`
