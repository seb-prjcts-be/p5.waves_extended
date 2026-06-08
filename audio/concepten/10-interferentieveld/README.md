# 10 · Interferentie-veld (golf op golf in 2D)

Golf op golf, maar nu in **twee dimensies** → een interferentieveld dat met het
spectrum meeribbelt.

## v3.3.0-migratie: createGrid is weg
In p5.waves v3.3.0 is `Waves.createGrid()` **verwijderd**. Een 2D-veld bouw je nu
handmatig met twee samplers + een geneste loop (flexibeler, en je houdt controle
over elke cel):
```js
const sRow = Waves.createSampler({ wave: 'classic sine', range: [-1, 1] });
const sCol = Waves.createSampler({ wave: 'triangle',     range: [-1, 1] });

for (let row = 0; row < ROWS; row++) {
  const colWave = sCol.sample(row * sy, t);          // 1× per rij (efficiënt)
  for (let col = 0; col < COLS; col++) {
    const v = (sRow.sample(col * sx, t) + colWave) * 0.5;   // cel = som van twee golven
  }
}
```

## Audio-koppeling
| Audio | Stuurt | Effect |
|---|---|---|
| bass | `sx` (horizontale coördinaat-schaal) | dichtheid links-rechts |
| treble | `sy` (verticale schaal) | dichtheid boven-onder |
| energie | contrast | feller veld bij meer energie |

Twee gelijke frequenties → interferentiestrepen; een sinus + een driehoek →
gestreepte banden. Het hele patroon "ademt" met het spectrum.

## Prestatie
72 × 44 = 3168 cellen, 2 sampler-calls elk. De buitenste sampler-call staat
buiten de binnenlus (1× per rij) → ruim snel genoeg.

## API
- `Waves.createSampler({ wave, range })`, `sampler.sample(x, t)`
- `audio.bands.{bass,treble}`, `audio.energy`
