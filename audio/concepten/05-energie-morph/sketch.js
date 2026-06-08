/* 05 · Energie → morph (mix) + flux → wild
 *
 * Twee continue audio-features sturen twee continue golf-eigenschappen:
 *   energie → mix   : blend van 'classic sine' (stil) naar 'batman' (luid)
 *   flux    → wild  : plotse spectrale veranderingen injecteren chaos
 *
 * Geen schakelaars, geen beats — een vloeiend "ademend" timbre dat de intensiteit
 * van het nummer volgt. Op de drop (hoge flux) verwildert de vorm.
 */
let audio, ctl;
let mixS = 0, wildS = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  audio = new WaveAudio({ fftSize: 1024 });
  ctl = createAudioControls(audio);
}

function draw() {
  background(8);
  const on = ctl.started();
  if (on) audio.update();
  const t = millis() / 1000;

  // gesmoothe features → stabiele, organische beweging
  mixS  = lerp(mixS,  on ? constrain(audio.energy * 1.7, 0, 1) : 0, 0.08);
  wildS = lerp(wildS, on ? audio.flux : 0, 0.12);
  const wild = wildS > 0.22;

  noFill();
  stroke(255, 0, 125);
  strokeWeight(2);
  beginShape();
  for (let x = 0; x <= width; x += 3) {
    const y = Waves.wave(x, {
      wave: ['classic sine', 'batman'],
      mix: mixS,
      t,
      frequency: 1,
      amplitude: 70 + (on ? audio.energy * 90 : 0),
      mode: wild ? 'wild' : 'stable',
      unpredictability: wildS,
    });
    vertex(x, height / 2 + y);
  }
  endShape();

  // meters
  noStroke(); textAlign(LEFT, TOP); textSize(12);
  fill(235); text('mix (sine→batman)  ' + '█'.repeat(round(mixS * 20)), 16, 16);
  fill(wild ? [255, 80, 80] : [150]);
  text('flux → wild       ' + '█'.repeat(round(wildS * 20)) + (wild ? '  WILD' : ''), 16, 34);

  if (!on) {
    fill(255); textAlign(CENTER, CENTER); textSize(18);
    text('Start een audiobron linksboven', width / 2, height / 2);
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
