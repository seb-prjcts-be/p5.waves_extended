# 01 · FFT als `t`  ⭐

**De kernvraag van het onderzoekscentrum:** wat gebeurt er als je een
FFT-resultaat als `t` aan `Waves.wave()` meegeeft?

## Concept
`t` is in p5.waves de tijd-driver. Normaal `t = millis()/1000` (lineair). Dit
concept toont **dezelfde golf** (`'mountain peaks'`) drie keer naast elkaar, met
telkens een andere `t`-bron:

| Paneel | `t` = | Gedrag |
|---|---|---|
| **A** | rauwe energie | Niet-monotoon → de golf stuitert nerveus heen en weer (glitch-look) |
| **B** ⭐ | geaccumuleerde audio-tijd | Monotoon maar variabel tempo → **ademt**: stilte traag, luid snel |
| **C** | bass-bin (geaccumuleerd) | De bas wordt de motor van de tijd |

## Kern-inzicht
Rauwe energie als `t` is schokkerig. De mooiste, muzikaal-organische beweging
krijg je met **geaccumuleerde** energie:
```js
audio.tAudio += energy * timeScale;   // in shared/audio.js
```
Dan loopt de "tijd" van de visual mee met de intensiteit van het nummer.

## API
- `Waves.wave(x, { wave, t, frequency, amplitude })`
- `audio.energy`, `audio.tAudio`, `audio.bands.bass` (shared/audio.js)

## Bediening
♪ Nummer (brunk – Akoxylo / demo-loop) · ▶ Synth · 🎤 Mic
