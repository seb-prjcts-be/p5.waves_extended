# p5.waves × Audio — Onderzoekscentrum

> Doel: in kaart brengen wat er gebeurt als je **p5.waves** koppelt aan
> **audioreactiviteit** (FFT, waveform, beat) — in beide richtingen:
> **geluid → golf** (visualisatie) en **golf → geluid** (sonificatie / wavetable).
>
> p5.waves v3.3.0 — **enkel leesrechten**, geconsumeerd via CDN. Geen `createGrid`
> (verwijderd in v3.3.0); velden bouw ik met twee samplers + nested loop.

---

## De kernvraag: "Wat als je een FFT-resultaat als `t` meegeeft?"

In p5.waves is `t` de **tijd-driver**. Normaal: `t = millis()/1000` — monotoon
stijgend, lineair. De golf evolueert dan met een constante, voorspelbare snelheid.

`t` doet echter méér dan alleen fase opschuiven:
1. **Vorm-evolutie** — bij animerende golven schuift de vorm met `t`.
2. **Shift/morph-timing** — `shiftInterval` en `shiftDuration` zijn in *eenheden
   van `t`*. Dus `t` bepaalt óók hoe snel golven naar nieuwe golven morphen.

### Wat gebeurt er als `t` = audio-energie?

| `t`-bron | Gedrag van de golf |
|---|---|
| `millis()/1000` (normaal) | Constante, vloeiende evolutie |
| FFT-energie (luidheid) | Golf **springt vooruit** bij luid, **bevriest** bij stilte → de golf "ademt" op de muziek i.p.v. op de klok |
| Gecumuleerde energie (`t += energy`) | Tijd loopt *sneller* bij luide passages → tempo van de visual = tempo van het nummer |
| Eén FFT-bin (bv. bass) | De golf reageert op één frequentieband; bass = motor |

**Belangrijk inzicht:** rauwe FFT-energie als `t` is *niet-monotoon* en *schokkerig*
→ de golf stuitert heen en weer (visueel nerveus, soms mooi als "glitch"). Voor
muzikaal-organische beweging werkt **geaccumuleerde** energie beter:
`tAudio += map(energy, 0, 255, 0, 0.06)`. Dan is stilte = traag, luid = snel,
maar altijd vooruit. Dit is de spannendste variant en krijgt concept 01.

---

## De concepten (elk in een eigen p5.js-mapje)

### Richting A — geluid → golf
1. **01 · FFT als `t`** ⭐ — geaccumuleerde energie stuurt de tijd. Drie modi
   naast elkaar: rauw / geaccumuleerd / per-bin. De vlaggenschip-demo.
2. **02 · Spectrum → amplitude-lagen** — bass/mid/treble sturen elk de
   `amplitude` van een eigen golflaag (3 gestapelde lijnen).
3. **03 · Spectrum → x-as** — elke frequentie-bin wordt één golf-sample;
   sonogram-achtige reactieve skyline.
4. **04 · Beat → shift** — beat-detectie forceert een `shift` naar een nieuwe
   golf. Het nummer "kiest" de golfvorm.
5. **05 · Energie → morph (`mix`)** — luid morpht van `gentle` sine naar
   `harsh` batman; spectrale flux → `unpredictability` (wild mode).

### Richting B — golf → geluid (sonificatie)
6. **06 · Golf als wavetable** — sample één periode van een p5.waves-golf in een
   `Float32Array` → Web Audio `PeriodicWave` → je *hoort* de golfvorm. Kies een
   golf, hoor zijn timbre. De omkering van "FFT als t".

### Meta
- **00 · index.html** — dashboard dat alle concepten linkt, met korte uitleg.
- **shared/audio.js** — mini audio-engine (native Web Audio `AnalyserNode`):
  mic + audiobestand, levert `getEnergy()`, `getSpectrum()`, `getWaveform()`,
  `getBands()`, `getBeat()`. Bewust *native* Web Audio i.p.v. p5.sound → robuust,
  geen addon-versieproblemen met p5.js 2.x.

---

## Verdieping — wat maakt p5.waves méér dan een opgenomen audiogolf?

Een rauwe audiogolf tekenen is *letterlijk*: amplitude over tijd, een rafelige
lijn zonder structuur, geheugen of identiteit. Elk nummer ziet er hetzelfde uit.
p5.waves geeft je **benoemde, wiskundige golf-identiteiten** (batman, mountain
peaks, stepped) met **periodiciteit** en **morph**. De winst zit erin om audio
de *dirigent* van die structuur te maken, niet de structuur zélf. Drie assen:

### Inzicht 1 — `shift` heeft geen eigen klok (de linchpin)
Uit de guide: *"shift has no internal clock — it reads the t value you pass in."*
Dus als je `t` **op het ritme quantiseert** i.p.v. `millis()/1000`, gebeurt élke
golfwissel exact op de beat:
```js
// elke beat: schuif t precies één shiftInterval op → nieuwe golf op de tel
if (audio.beat) tBeat += sampler.shiftInterval ?? 3;
sampler.sample(x, tBeat);          // shiftDuration klein = snap, groot = glide
```
Geen audiogolf kan dit: een scope toont wat er is, hij *kiest* geen nieuwe vorm.

### Inzicht 2 — `closing`-groep = naadloze gesloten vorm tijdens de morph
v3.3.0 voegt een `closing`-groep toe (17 golven met periodes die gelijk in de
basisperiode delen). In een **polaire** mapping (golf rond een cirkel) sluit de
ring alleen naadloos als je over een geheel veelvoud van de periode veegt. Omdat
álle closing-golven dezelfde basisperiode delen, blijft de ring **gesloten ook
tíjdens** een shift-morph van golf A → golf B. Dus: een gesloten vorm die op de
beat naar een nieuwe gesloten vorm klikt, zonder naad-sprong.
```js
const ring = Waves.createSampler({ shift: true, group: 'closing', shiftDuration: 0.4 });
// r = R + ring.sample(angle * lobesPerPeriod, tBeat);  → polair tekenen
// ring.period / ring.targetPeriod (v3.3.0) → exact aantal lobes berekenen
```

### Inzicht 3 — golf op golf (nesting / domain warping)
De rauwe golf is plat; formules kun je **stapelen**:
- **Domein-warp:** `Waves.wave(Waves.wave(x, A), B)` — golf A vervormt de *ruimte*
  van golf B. Audio → amplitude van A → de "ruimte" van B ademt.
- **Parameter-modulatie:** de output van golf A wordt de `frequency`, `amplitude`,
  `phase` of zelfs `t` van golf B (FM/AM met bibliotheekgolven).
- **Som-veld (de oude createGrid, nu handmatig):** `cell = waveRow(row) + waveCol(col)`
  met twee samplers → interferentie; bass stuurt rij-amplitude, treble kol-amplitude.
- **Recursieve diepte op de beat:** elke beat een nesting-laag erbij; reset op de drop.

### Bonus-assen (timbre → identiteit, niet alleen amplitude)
- **Spectraal zwaartepunt → `group`:** donker → `gentle`, helder → `harsh`.
- **Dominante band → golf bij naam:** bass-zwaar → `mountain peaks`, bright → `sharp peaks`.
  De *vorm-vocabulaire* volgt het timbre, niet enkel het volume.
- **Spectrale flux → `unpredictability` (wild mode):** stabiel couplet, wilde drop.
- **Pitch → `frequency`:** gedetecteerde grondtoon = ruimtelijke frequentie → "visuele toonhoogte".

### Inzicht 4 — Chladni: product van twee samplers + threshold = fysische resonantie
Chladni-patronen zijn de **nulpuntlijnen** van een 2D-staandegolf. Met twee
p5.waves-samplers (sX, sY) en de symmetrische formule
```
f(x,y) = sX(x·m)·sY(y·n) + sX(x·n)·sY(y·m)
```
geeft `|f| < drempel → licht (zand), hoge amplitude → donker (geen zand)`.

Drie sleutels:
1. **Product** (niet som): som geeft interferentiegolven (concept 10); product geeft
   dunne nulpuntlijnen. Één operator verandert het visuele vocabulaire volledig.
2. **Gehele getallen m, n**: Chladni werkt op harmonische verhoudingen — bass→m,
   treble→n (1..8). Beat snapped naar nieuwe integers = modale sprong, exact
   zoals een plaat van resonantiefrequentie wisselt.
3. **Niet-sinusvormige Chladni**: met `batman`, `triangle`, `mountain peaks` als
   basisgolf ontstaan patronen die geen fysieke plaat kan realiseren. Dezelfde
   topologische structuur (nulpuntnetwerken), ander golfkarakter. Dit is de
   meerwaarde van p5.waves t.o.v. een echte oscilloscoop.

### Nieuwe concepten die hieruit volgen (te bouwen)
- **07 · Closed-form ring op de beat** ⭐ — polaire `closing`-ring, `t` beat-
  gequantiseerd, lobes via `sampler.period`. Het sterkste "dit-kan-een-scope-niet".
- **08 · Golf op golf** — domein-warp + audio-gemoduleerde nesting.
- **09 · Timbre → identiteit** — spectraal zwaartepunt kiest golf/groep.

## Status
- [x] Onderzoekscentrum opgezet + plan
- [x] shared/audio.js — audio-engine (native Web Audio + synth-fallback + centroid/flux)
- [x] shared/ui.js + style.css — gedeelde bedieningsbalk
- [x] sound/ — rechtenvrije brunk – Akoxylo mp3 (CC · brunk.be) + demo-loop.wav (fallback) + generator
- [x] 01 · FFT als t ⭐
- [x] 02 · Spectrum → amplitude-lagen
- [x] 03 · Reactieve skyline (spectrum → x-as)
- [x] 04 · Beat → shift
- [x] 05 · Energie → morph + flux → wild
- [x] 06 · Golf als wavetable (golf → geluid)
- [x] 07 · Closed-form ring op de beat ⭐
- [x] 08 · Golf op golf (nesting / domain warping)
- [x] 09 · Timbre → golf-identiteit
- [x] 10 · Interferentie-veld (golf op golf 2D)
- [x] 11 · Chladni-resonantie (product van twee samplers + threshold = nodal lines)
- [x] index dashboard
- [x] overzicht.html — 11 iframes live in 4×3 grid

**Alle 11 concepten gebouwd, elk met index.html + sketch.js + README.md.**

## Notities (geleerd)
- 2026-06-06: p5.waves v3.3.0 — `createGrid` verwijderd, gebruik 2× sampler.
  Nieuwe `closing`-groep voor naadloze gesloten vormen bij shift.
