/* 10 · Interferentie-veld — golf op golf in 2D
 *
 * In p5.waves v3.3.0 is Waves.createGrid() VERWIJDERD. Een 2D-veld bouw je nu
 * handmatig met twee samplers + een geneste loop — flexibeler:
 *   cel(rij, kol) = waveRij.sample(kol, t) + waveKol.sample(rij, t)
 *
 * Twee sinussen op dezelfde frequentie → interferentie. Audio stuurt de
 * coördinaat-schaal: bass = horizontale dichtheid, treble = verticale dichtheid,
 * energie = contrast. Zo "ribbelt" het hele veld mee met het spectrum.
 */
let audio, ctl, sRow, sCol;
const COLS = 72, ROWS = 44;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  audio = new WaveAudio({ fftSize: 1024 });
  ctl = createAudioControls(audio);
  sRow = Waves.createSampler({ wave: 'classic sine', range: [-1, 1] });
  sCol = Waves.createSampler({ wave: 'triangle',     range: [-1, 1] });
}

function draw() {
  background(0);
  const on = ctl.started();
  if (on) audio.update();
  const t = millis() / 1000;

  const bass = on ? audio.bands.bass : 0.2;
  const treb = on ? audio.bands.treble : 0.2;
  const contrast = on ? 0.5 + audio.energy * 1.6 : 1;

  const sx = 0.18 * (0.5 + bass * 3.0);   // horizontale dichtheid ← bass
  const sy = 0.18 * (0.5 + treb * 3.0);   // verticale dichtheid   ← treble
  const cw = width / COLS, ch = height / ROWS;

  for (let row = 0; row < ROWS; row++) {
    const colWave = sCol.sample(row * sy, t * 1.1);    // 1× per rij
    for (let col = 0; col < COLS; col++) {
      const v = (sRow.sample(col * sx, t) + colWave) * 0.5 * contrast; // ~[-1,1]
      const hue = map(v, -1, 1, 200, 340);
      const bri = map(abs(v), 0, 1, 12, 100);
      fill(hue, 80, bri);
      rect(col * cw, row * ch, cw + 1, ch + 1);
    }
  }

  noStroke(); fill(0, 0, 100); textAlign(LEFT, TOP); textSize(12);
  text('bass→horizontaal  ' + '█'.repeat(round(bass * 16)), 16, 16);
  text('treble→verticaal  ' + '█'.repeat(round(treb * 16)), 16, 34);
  if (!on) { textAlign(CENTER, CENTER); textSize(18);
    text('Start een audiobron linksboven', width / 2, height / 2); }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
