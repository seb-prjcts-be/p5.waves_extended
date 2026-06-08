/* 04 · Beat → shift
 *
 * Kerninzicht (uit de guide): "shift has no internal clock — it reads the t you
 * pass in." Dus geven we GEEN millis()/1000, maar een t die op de beat opspringt.
 *
 * Eén shift-cyclus = shiftInterval + shiftDuration = 1.0 t-eenheid. Door per beat
 * het doel met +1 te verhogen en t er soepel naartoe te lerpen, krijg je exact
 * één nieuwe golf per beat, met een vloeiende morph ertussenin. Stilte = geen
 * beats = de golf bevriest.
 */
let audio, ctl, sampler;
let tBeat = 0, target = 0, flash = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  audio = new WaveAudio({ fftSize: 1024 });
  ctl = createAudioControls(audio);
  sampler = Waves.createSampler({
    shift: true, group: 'all',
    shiftInterval: 0.1, shiftDuration: 0.9,   // samen = 1.0 per cyclus
    range: [-1, 1],
  });
}

function draw() {
  const on = ctl.started();
  if (on) {
    audio.update();
    if (audio.beatBass) { target += 1; flash = 1; }  // kick stuurt de golfwissel
  }
  tBeat = lerp(tBeat, target, 0.12);
  flash *= 0.9;

  background(8 + flash * 30);

  const amp = (on ? 60 + audio.energy * 140 : 70);
  noFill();
  stroke(255, 0, 125);
  strokeWeight(2.5 + flash * 3);
  beginShape();
  for (let x = 0; x <= width; x += 3) {
    vertex(x, height / 2 + sampler.sample(x * 0.6, tBeat) * amp);
  }
  endShape();

  // info
  noStroke(); textAlign(LEFT, TOP); textSize(13);
  fill(235); text('nu:     ' + sampler.waveName, 16, 16);
  fill(150);
  text('volgend: ' + sampler.targetName, 16, 36);
  text('morph:   ' + (sampler.mix).toFixed(2) + (sampler.shifting ? '  (shifting)' : ''), 16, 56);
  text('beats:   ' + target, 16, 76);

  if (!on) {
    fill(255); textAlign(CENTER, CENTER); textSize(18);
    text('Start een audiobron linksboven', width / 2, height / 2);
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
