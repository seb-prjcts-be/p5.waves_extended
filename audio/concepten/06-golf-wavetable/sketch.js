/* 06 · Golf als wavetable — golf → geluid (de omkering van "FFT als t")
 *
 * Eén periode van een p5.waves-golf wordt in een AudioBuffer gesampled en in
 * loop afgespeeld → je HOORT de golfvorm als oscillator-timbre. De live FFT van
 * de output toont de harmonischen: een sinus heeft één balk, een square oneven
 * harmonischen, batman iets heel eigens.
 *
 * Native Web Audio (geen p5.sound). De nieuwe v3.3.0 getter sampler.period geeft
 * exact één golfperiode om in de tabel te leggen.
 */
const TABLE = 2048;
const WAVES = ['classic sine', 'triangle', 'square', 'saw up',
               'sharp peaks', 'batman', 'stepped sine', 'fuzzy pulse'];
let actx, gain, analyser, specData, source;
let baseFreq, freq = 110, waveName = 'classic sine';
let tableArr = new Float32Array(TABLE);

function setup() {
  createCanvas(windowWidth, windowHeight);
  buildUI();
}

function buildUI() {
  const bar = document.createElement('div');
  bar.id = 'ui';
  WAVES.forEach((w) => {
    const b = document.createElement('button');
    b.textContent = w;
    b.onclick = () => { startAudio(); waveName = w; rebuild(); markActive(); };
    b.dataset.w = w;
    bar.appendChild(b);
  });
  document.body.appendChild(bar);
}
function markActive() {
  document.querySelectorAll('#ui button').forEach((b) => {
    b.style.borderColor = b.dataset.w === waveName ? 'rgb(255,0,125)' : '#444';
  });
}

function startAudio() {
  if (actx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  actx = new AC();
  baseFreq = actx.sampleRate / TABLE;
  gain = actx.createGain(); gain.gain.value = 0.16;
  analyser = actx.createAnalyser(); analyser.fftSize = 2048;
  specData = new Uint8Array(analyser.frequencyBinCount);
  gain.connect(analyser); analyser.connect(actx.destination);
}

function rebuild() {
  if (!actx) return;
  if (source) { try { source.stop(); } catch (e) {} source.disconnect(); }
  const s = Waves.createSampler({ wave: waveName, range: [-1, 1] });
  const period = s.period || 62.83;
  const buf = actx.createBuffer(1, TABLE, actx.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < TABLE; i++) {
    const v = s.sample(i / TABLE * period);
    ch[i] = v; tableArr[i] = v;
  }
  source = actx.createBufferSource();
  source.buffer = buf; source.loop = true;
  source.playbackRate.value = freq / baseFreq;
  source.connect(gain); source.start();
}

function draw() {
  background(8);

  // wavetable (één periode)
  stroke(255, 0, 125); strokeWeight(2); noFill();
  beginShape();
  for (let i = 0; i < TABLE; i++) {
    vertex(map(i, 0, TABLE, 40, width - 40),
           height * 0.30 - tableArr[i] * height * 0.16);
  }
  endShape();
  noStroke(); fill(150); textAlign(LEFT, BOTTOM); textSize(12);
  text('golfvorm (1 periode) — ' + waveName, 40, height * 0.30 + 90);

  // live harmonischen van de output
  if (actx) {
    analyser.getByteFrequencyData(specData);
    const n = 64;
    const bw = (width - 80) / n;
    for (let i = 0; i < n; i++) {
      const h = specData[i] / 255 * height * 0.32;
      fill(90, 200, 255);
      rect(40 + i * bw, height * 0.86 - h, bw - 1, h);
    }
    fill(150); text('harmonischen (live FFT van de klank)', 40, height * 0.86 + 18);
  }

  if (!actx) {
    fill(255); textAlign(CENTER, CENTER); textSize(18);
    text('Klik een golf bovenaan om te horen', width / 2, height / 2);
  }
}

function keyPressed() {
  if (!actx) return;
  if (keyCode === UP_ARROW)   freq *= Math.pow(2, 1 / 12);    // halve toon hoger
  if (keyCode === DOWN_ARROW) freq /= Math.pow(2, 1 / 12);
  freq = constrain(freq, 40, 880);
  if (source) source.playbackRate.value = freq / baseFreq;
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
