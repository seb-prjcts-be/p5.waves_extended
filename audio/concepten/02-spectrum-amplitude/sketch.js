/* 02 · Spectrum → amplitude-lagen
 *
 * Drie gestapelde golflijnen. Elke laag is een aparte createSampler met een
 * eigen golf en frequentie. De drie frequentiebanden (bass/mid/treble) sturen
 * elk de AMPLITUDE van één laag. Additieve blending → glow op de kruispunten.
 *
 * Truc: sampler met range [-1,1] (genormaliseerd) en de reactieve amplitude
 * pas in de sketch erbij vermenigvuldigen — zo blijft de amplitude per frame
 * stuurbaar (de sampler bakt amplitude normaal éénmalig in).
 */
let audio, ctl, layers;

function setup() {
  createCanvas(windowWidth, windowHeight);
  audio = new WaveAudio({ fftSize: 1024 });
  ctl = createAudioControls(audio);
  layers = [
    { s: Waves.createSampler({ wave: 'classic sine', frequency: 0.5, range: [-1, 1] }),
      band: 'bass',   col: [255, 0, 125], base: 18, speed: 0.4 },
    { s: Waves.createSampler({ wave: 'triangle',     frequency: 1.1, range: [-1, 1] }),
      band: 'mid',    col: [90, 200, 255], base: 14, speed: 0.7 },
    { s: Waves.createSampler({ wave: 'sharp peaks',  frequency: 2.2, range: [-1, 1] }),
      band: 'treble', col: [255, 215, 70], base: 10, speed: 1.1 },
  ];
}

function draw() {
  background(8);
  const on = ctl.started();
  if (on) audio.update();
  const t = millis() / 1000;

  blendMode(ADD);
  for (let i = 0; i < layers.length; i++) {
    const L = layers[i];
    const amp = (on ? L.base + audio.bands[L.band] * 240 : L.base);
    noFill();
    stroke(L.col[0], L.col[1], L.col[2], 200);
    strokeWeight(2);
    beginShape();
    for (let x = 0; x <= width; x += 3) {
      const y = L.s.sample(x, t * L.speed) * amp;
      vertex(x, height / 2 + y);
    }
    endShape();
  }
  blendMode(BLEND);

  // band-meters
  noStroke(); textAlign(LEFT, TOP); textSize(12);
  const names = ['bass', 'mid', 'treble'];
  for (let i = 0; i < 3; i++) {
    const L = layers[i];
    fill(L.col[0], L.col[1], L.col[2]);
    const v = on ? audio.bands[L.band] : 0;
    text(names[i] + '  ' + '█'.repeat(Math.round(v * 20)), 16, 16 + i * 18);
  }
  if (!on) {
    fill(255); textAlign(CENTER, CENTER); textSize(18);
    text('Start een audiobron linksboven', width / 2, height / 2);
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
