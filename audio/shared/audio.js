/* shared/audio.js — mini audio-engine voor het p5.waves onderzoekscentrum
 *
 * Native Web Audio (AnalyserNode). Bewust GEEN p5.sound: robuust, geen
 * addon-versieproblemen met p5.js 2.x, en exact dezelfde API voor mic + bestand.
 *
 * Gebruik:
 *   const audio = new WaveAudio({ fftSize: 1024 });
 *   await audio.useMic();         // of: await audio.useFile('song.mp3');
 *   audio.update();               // 1x per frame (bovenaan draw)
 *   audio.energy                  // 0..1  globale luidheid
 *   audio.tAudio                  // geaccumuleerde audio-tijd (voor "FFT als t")
 *   audio.bands                   // { bass, mid, treble }  elk 0..1
 *   audio.spectrum                // Uint8Array  frequentie-magnitudes 0..255
 *   audio.waveform                // Float32Array  tijdsdomein -1..1
 *   audio.beat                    // true op het frame van een beat (OR van alle banden)
 *   audio.beatBass                // true op kick / sub-beat
 *   audio.beatMid                 // true op snare / clap
 *   audio.beatTreble              // true op hi-hat / percussie
 *
 * Beat-detectie: variantie-gebaseerd per band (zie BeatDetector hieronder).
 * Vervangt de klassieke EMA-ratio aanpak die inconsistent reageert bij
 * dynamische muziek — dezelfde variatie triggert nu altijd, ongeacht het
 * absolute energieniveau van het stukje.
 */

/* ── BeatDetector ─────────────────────────────────────────────────────────────
 *
 * Methode: energie > gemiddelde(buffer) + k × standaarddeviatie(buffer)
 * Per band (bass / mid / treble) een eigen ring-buffer en cooldown.
 * Volledige documentatie: /building_blocks/p5_beat_detector/beat-detector.js
 */
class BeatDetector {
  constructor(opts = {}) {
    this.sensitivity    = opts.sensitivity    ?? 1.4;
    this.historySize    = opts.historySize    ?? 60;   // ~1s bij 60fps
    this.minEnergy      = opts.minEnergy      ?? 0.03;
    this.cooldownBass   = opts.cooldownBass   ?? 10;   // ~167ms
    this.cooldownMid    = opts.cooldownMid    ??  8;   // ~133ms
    this.cooldownTreble = opts.cooldownTreble ??  5;   //  ~83ms

    this._initBand('bass');
    this._initBand('mid');
    this._initBand('treble');
    this._warmup = this.historySize;

    this.beat = false; this.beatBass = false;
    this.beatMid = false; this.beatTreble = false;
  }

  _initBand(n) {
    this[`_h_${n}`]  = new Float32Array(this.historySize);
    this[`_p_${n}`]  = 0;
    this[`_cd_${n}`] = 0;
  }

  _push(n, v) { this[`_h_${n}`][this[`_p_${n}`]++ % this.historySize] = v; }

  _stats(n) {
    const h = this[`_h_${n}`], sz = this.historySize;
    let sum = 0;
    for (let i = 0; i < sz; i++) sum += h[i];
    const mean = sum / sz;
    let vsum = 0;
    for (let i = 0; i < sz; i++) { const d = h[i] - mean; vsum += d * d; }
    return { mean, std: Math.sqrt(vsum / sz) };
  }

  _detect(n, v, cd) {
    this._push(n, v);
    if (this._warmup > 0) return false;
    const key = `_cd_${n}`;
    if (this[key] > 0) { this[key]--; return false; }
    const { mean, std } = this._stats(n);
    if (v > mean + this.sensitivity * std && v > this.minEnergy) {
      this[key] = cd; return true;
    }
    return false;
  }

  update(bands) {
    if (this._warmup > 0) this._warmup--;
    this.beatBass   = this._detect('bass',   bands.bass,   this.cooldownBass);
    this.beatMid    = this._detect('mid',    bands.mid,    this.cooldownMid);
    this.beatTreble = this._detect('treble', bands.treble, this.cooldownTreble);
    this.beat       = this.beatBass || this.beatMid || this.beatTreble;
  }
}

/* ── WaveAudio ────────────────────────────────────────────────────────────── */
class WaveAudio {
  constructor(opts = {}) {
    this.fftSize   = opts.fftSize   || 1024;
    this.smoothing = opts.smoothing ?? 0.8;
    this.timeScale = opts.timeScale ?? 0.06;

    this.ctx = null;
    this.analyser = null;
    this.source = null;
    this.ready = false;
    this.mode = 'none';

    // afgeleide signalen (gevuld door update())
    this.spectrum = new Uint8Array(this.fftSize / 2);
    this.waveform = new Float32Array(this.fftSize);
    this.energy = 0;
    this.tAudio = 0;
    this.bands = { bass: 0, mid: 0, treble: 0 };
    this.centroid = 0;
    this.flux = 0;
    this._prevSpec = new Float32Array(this.fftSize / 2);

    // beat-detectie — variantie-gebaseerd, per band
    this._beatDet   = new BeatDetector();
    this.beat       = false;
    this.beatBass   = false;
    this.beatMid    = false;
    this.beatTreble = false;
  }

  _initContext() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = this.fftSize;
    this.analyser.smoothingTimeConstant = this.smoothing;
    this._freqData = new Uint8Array(this.analyser.frequencyBinCount);
    this._timeData = new Float32Array(this.analyser.fftSize);
  }

  async useMic() {
    this._initContext();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.source = this.ctx.createMediaStreamSource(stream);
    this.source.connect(this.analyser);
    this.mode = 'mic';
    this.ready = true;
    await this.ctx.resume();
  }

  async useFile(url) {
    this._initContext();
    this.audioEl = new Audio(url);
    this.audioEl.crossOrigin = 'anonymous';
    this.audioEl.loop = true;
    this.source = this.ctx.createMediaElementSource(this.audioEl);
    this.source.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
    this.mode = 'file';
    this.ready = true;
    await this.ctx.resume();
    await this.audioEl.play();
  }

  async useSynth() {
    this._initContext();
    const t = this.ctx.currentTime;
    const merger = this.ctx.createGain();
    merger.gain.value = 0.0;

    const bass = this.ctx.createOscillator();
    bass.type = 'sine'; bass.frequency.value = 55;
    const bassGain = this.ctx.createGain(); bassGain.gain.value = 0.6;
    bass.connect(bassGain).connect(merger);

    const lead = this.ctx.createOscillator();
    lead.type = 'triangle'; lead.frequency.value = 330;
    const leadGain = this.ctx.createGain(); leadGain.gain.value = 0.25;
    lead.connect(leadGain).connect(merger);

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine'; lfo.frequency.value = 1.6;
    const lfoGain = this.ctx.createGain(); lfoGain.gain.value = 0.5;
    lfo.connect(lfoGain).connect(merger.gain);
    merger.gain.value = 0.5;

    lead.frequency.setValueAtTime(330, t);
    lead.frequency.linearRampToValueAtTime(520, t + 6);
    lead.frequency.linearRampToValueAtTime(247, t + 12);

    const out = this.ctx.createGain(); out.gain.value = 0.35;
    merger.connect(out);
    out.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    [bass, lead, lfo].forEach(o => o.start());
    this.source = merger;
    this.mode = 'synth';
    this.ready = true;
    await this.ctx.resume();
  }

  // Gesimuleerde bron: geen Web Audio, geen geluid — alleen procedurele
  // signalen zodat de visuals bewegen. Voor de overzichtspagina.
  useSimulated() {
    this.mode = 'sim';
    this.ready = true;
    this._simFrame = 0;
    this._simFlux = 0;
    this._lastBeatIdx = -1;
  }

  _updateSim() {
    const t = this._simFrame++ / 60;
    const beatPhase = t * 2;                       // ~120 BPM
    const beatEnv = Math.pow(Math.max(0, Math.sin(beatPhase * Math.PI)), 0.6);

    const bass   = 0.40 + 0.50 * beatEnv;
    const mid    = 0.35 + 0.30 * Math.abs(Math.sin(t * 1.7));
    const treble = 0.22 + 0.40 * Math.abs(Math.sin(t * 5.0)) * (0.5 + 0.5 * beatEnv);
    this.bands = { bass, mid, treble };

    this.energy = Math.min(1, 0.30 + 0.32 * beatEnv + 0.10 * Math.sin(t * 0.6));
    this.tAudio += this.energy * this.timeScale;
    this.centroid = Math.min(1, Math.max(0, 0.35 + 0.25 * Math.sin(t * 0.4) + 0.12 * treble));

    this._simFlux *= 0.9;
    const bi = Math.floor(beatPhase);
    if (bi !== this._lastBeatIdx) { this._lastBeatIdx = bi; this._simFlux = 0.7; }
    this.flux = this._simFlux;

    // synthetisch spectrum (bass-hump + bewegende pieken)
    const n = this.spectrum.length;
    for (let i = 0; i < n; i++) {
      const f = i / n;
      let v = Math.exp(-f * 5) * bass;
      v += 0.6 * mid * Math.exp(-Math.pow((f - 0.25) * 7, 2));
      v += 0.5 * treble * Math.exp(-Math.pow((f - 0.55 - 0.1 * Math.sin(t)) * 9, 2));
      v += 0.04 * Math.abs(Math.sin(i * 1.3 + t * 7));
      this.spectrum[i] = Math.min(255, v * 255);
    }
    for (let i = 0; i < this.waveform.length; i++) {
      this.waveform[i] = (Math.sin(i * 0.09 + t * 6) * 0.4 +
                          Math.sin(i * 0.22 + t * 3) * 0.2) * (0.5 + 0.5 * this.energy);
    }

    // beat-detectie via dezelfde BeatDetector als echte audio
    this._beatDet.update(this.bands);
    this.beat       = this._beatDet.beat;
    this.beatBass   = this._beatDet.beatBass;
    this.beatMid    = this._beatDet.beatMid;
    this.beatTreble = this._beatDet.beatTreble;
  }

  // Roep dit 1x per frame aan, bovenaan draw().
  update() {
    if (!this.ready) return;
    if (this.mode === 'sim') { this._updateSim(); return; }

    this.analyser.getByteFrequencyData(this._freqData);
    this.analyser.getFloatTimeDomainData(this._timeData);
    this.spectrum = this._freqData;
    this.waveform = this._timeData;

    // globale energie = gemiddelde magnitude, genormaliseerd 0..1
    let sum = 0;
    for (let i = 0; i < this._freqData.length; i++) sum += this._freqData[i];
    const raw = sum / this._freqData.length / 255;
    this.energy = raw;
    this.tAudio += raw * this.timeScale;

    // banden (bass < 250Hz, mid < 2kHz, treble erboven)
    const nyquist = this.ctx.sampleRate / 2;
    const binHz = nyquist / this._freqData.length;
    this.bands = {
      bass:   this._bandAvg(20,   250,   binHz),
      mid:    this._bandAvg(250,  2000,  binHz),
      treble: this._bandAvg(2000, 16000, binHz),
    };

    // spectraal zwaartepunt (helderheid) + flux (verandering t.o.v. vorig frame)
    let wsum = 0, msum = 0, fl = 0;
    for (let i = 0; i < this._freqData.length; i++) {
      const m = this._freqData[i];
      wsum += i * m; msum += m;
      const d = m - this._prevSpec[i];
      if (d > 0) fl += d;
      this._prevSpec[i] = m;
    }
    this.centroid = msum > 0 ? (wsum / msum) / this._freqData.length : 0;
    this.flux = Math.min(1, fl / this._freqData.length / 60);

    // beat-detectie: variantie-gebaseerd per band
    this._beatDet.update(this.bands);
    this.beat       = this._beatDet.beat;
    this.beatBass   = this._beatDet.beatBass;
    this.beatMid    = this._beatDet.beatMid;
    this.beatTreble = this._beatDet.beatTreble;
  }

  _bandAvg(lo, hi, binHz) {
    const a = Math.floor(lo / binHz);
    const b = Math.min(this._freqData.length - 1, Math.floor(hi / binHz));
    let sum = 0, n = 0;
    for (let i = a; i <= b; i++) { sum += this._freqData[i]; n++; }
    return n ? sum / n / 255 : 0;
  }
}

window.WaveAudio = WaveAudio;
