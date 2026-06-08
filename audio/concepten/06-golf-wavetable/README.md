# 06 · Golf als wavetable (golf → geluid)

De **omkering** van "FFT als t": in plaats van geluid → golf maken we hier
golf → geluid. Een p5.waves-golf wordt een **oscillator** die je hoort.

## Concept
Eén periode van een golf wordt in een Web Audio `AudioBuffer` gesampled en in
loop afgespeeld. De golfvorm bepaalt het **timbre**:
- `'classic sine'` → één harmonische (zuivere toon)
- `'square'` / `'saw up'` → rijke harmonischen (bizzig)
- `'batman'` → een heel eigen spectrum

De live FFT van de output (de balken onderaan) toont die harmonischen — zo
verbind je de *vorm* van een golf met zijn *klank*.

## Techniek
```js
const s = Waves.createSampler({ wave: waveName, range: [-1, 1] });
const period = s.period;                          // v3.3.0 getter: 1 golfperiode
const buf = actx.createBuffer(1, TABLE, actx.sampleRate);
const ch = buf.getChannelData(0);
for (let i = 0; i < TABLE; i++) ch[i] = s.sample(i / TABLE * period);
source.buffer = buf; source.loop = true;
source.playbackRate.value = freq / (actx.sampleRate / TABLE);   // toonhoogte
```

## Bediening
Klik een golf bovenaan (start de audio) · **↑ / ↓** = toonhoogte (halve tonen).

## API
- `Waves.createSampler({ wave, range })`, `sampler.sample(x)`, **`sampler.period`** (v3.3.0)
- Web Audio: `AudioBuffer`, `AudioBufferSourceNode` (loop), `AnalyserNode`
