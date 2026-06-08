/* 09 · Timbre → golf-identiteit
 *
 * De meeste audio-visuals reageren alleen op VOLUME. Hier stuurt het TIMBRE:
 * het spectraal zwaartepunt (helderheid, audio.centroid) kiest WELKE golf je ziet.
 *
 * Een palet golven, geordend van dof → scherp. Het zwaartepunt schuift een index
 * door dat palet; tussen twee buren morphen we vloeiend met wave:[a,b] + mix.
 * Donker geluid → zuivere sinus. Helder/scherp geluid → hoekige, ruige golven.
 */
let audio, ctl;
let cS = 0;
const PALET = ['classic sine', 'bumpy sine', 'triangle',
               'mountain peaks', 'sharp peaks', 'square', 'up down noise'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  audio = new WaveAudio({ fftSize: 2048 });
  ctl = createAudioControls(audio);
}

function draw() {
  background(8);
  const on = ctl.started();
  if (on) audio.update();
  const t = millis() / 1000;

  // helderheid → positie in het palet (gesmoothd, en wat opgerekt voor bereik)
  cS = lerp(cS, on ? constrain(audio.centroid * 2.4, 0, 1) : 0, 0.06);
  const f = cS * (PALET.length - 1);
  const lo = floor(f), hi = min(lo + 1, PALET.length - 1), frac = f - lo;

  noFill();
  stroke(255, 0, 125); strokeWeight(2.5);
  beginShape();
  for (let x = 0; x <= width; x += 3) {
    const y = Waves.wave(x, {
      wave: [PALET[lo], PALET[hi]],
      mix: frac, t, frequency: 1, amplitude: 90 + (on ? audio.energy * 70 : 0),
    });
    vertex(x, height / 2 + y);
  }
  endShape();

  // helderheidsmeter + huidige identiteit
  noStroke(); textAlign(LEFT, TOP); textSize(12);
  fill(150); text('helderheid (centroid)  ' + '█'.repeat(round(cS * 22)), 16, 16);
  fill(235); textSize(15);
  text('identiteit:  ' + PALET[lo] + (frac > 0.02 ? '  →  ' + PALET[hi] : '') +
       '   (' + frac.toFixed(2) + ')', 16, 38);

  // het palet (dof → scherp) onderaan, actieve buren gemarkeerd
  textSize(11); textAlign(LEFT, BOTTOM);
  let xx = 16;
  for (let i = 0; i < PALET.length; i++) {
    fill(i === lo || i === hi ? [255, 0, 125] : [90]);
    text(PALET[i], xx, height - 30); xx += textWidth(PALET[i]) + 16;
  }

  if (!on) {
    fill(255); textAlign(CENTER, CENTER); textSize(18);
    text('Start een audiobron linksboven', width / 2, height / 2 - 30);
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
