/* 03 · Reactieve skyline — spectrum als x-as-input
 *
 * De x-as is HET SPECTRUM (links = bass, rechts = treble). Een p5.waves-golf
 * ('mountain peaks') tekent de golvende middellijn; de DIKTE van het lint op
 * elke x = de FFT-magnitude van die frequentie. Zo fuseert data (waar zit de
 * energie?) met vorm (een herkenbare golf-identiteit).
 */
let audio, ctl;
const TOP = [], BOT = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  audio = new WaveAudio({ fftSize: 2048, smoothing: 0.7 });
  ctl = createAudioControls(audio);
}

function draw() {
  background(0);
  const on = ctl.started();
  if (on) audio.update();
  const t = millis() / 1000;
  const bins = audio.spectrum.length;

  TOP.length = 0; BOT.length = 0;
  for (let x = 0; x <= width; x += 3) {
    // gebruik de onderste ~55% van het spectrum (daar zit de muzikale energie)
    const bin = floor(map(x, 0, width, 0, bins * 0.55));
    const mag = on ? audio.spectrum[bin] / 255 : 0.04;
    const center = height / 2 + Waves.wave(x, {
      wave: 'mountain peaks', t, frequency: 0.7, amplitude: 70,
    });
    const thick = mag * height * 0.42 + 2;
    TOP.push([x, center - thick / 2]);
    BOT.push([x, center + thick / 2]);
  }

  // gevuld lint, hue volgt de x (frequentiepositie)
  noStroke();
  beginShape();
  for (const [x, y] of TOP) { fill(map(x, 0, width, 320, 60), 85, 100, 0.9); vertex(x, y); }
  for (let i = BOT.length - 1; i >= 0; i--) { const [x, y] = BOT[i]; vertex(x, y); }
  endShape(CLOSE);

  if (!on) {
    fill(0, 0, 100); textAlign(CENTER, CENTER); textSize(18);
    text('Start een audiobron linksboven', width / 2, height / 2);
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
