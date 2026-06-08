/* 01 · FFT als t — de kernvraag van het onderzoekscentrum.
 *
 * Drie keer EXACT dezelfde golf ('mountain peaks'). Enige verschil: wat we als
 * `t` meegeven aan Waves.wave().
 *
 *   Paneel A — t = rauwe energie       → nerveus, springt heen en weer
 *   Paneel B — t = geaccumuleerde tijd → ademt: stil=traag, luid=snel  ⭐
 *   Paneel C — t = bass-bin (× accum)  → de bas is de motor van de tijd
 */
let audio, ctl;
let tBassAccum = 0;
const ACCENT = [255, 0, 125];

function setup() {
  createCanvas(windowWidth, windowHeight);
  audio = new WaveAudio({ fftSize: 1024, timeScale: 0.06 });
  ctl = createAudioControls(audio);
}

function draw() {
  background(10);
  const on = ctl.started();
  if (on) audio.update();

  const panelH = height / 3;
  if (on) tBassAccum += audio.bands.bass * 0.12;

  drawPanel(0,           panelH, 'A · t = rauwe energie',
            on ? audio.energy * 8 : 0, 'nerveus / glitch — niet-monotoon', on);
  drawPanel(panelH,      panelH, 'B · t = geaccumuleerde audio-tijd  ⭐',
            on ? audio.tAudio : 0, 'ademt: stilte traag, luid snel', on);
  drawPanel(panelH * 2,  panelH, 'C · t = bass-bin (geaccumuleerd)',
            tBassAccum, 'de bas is de motor', on);

  if (!on) {
    fill(255); noStroke(); textAlign(CENTER, CENTER); textSize(18);
    text('Start een audiobron linksboven', width / 2, height / 2);
  }
}

function drawPanel(y0, h, label, tValue, sub, on) {
  push();
  translate(0, y0);
  stroke(40); line(0, h, width, h);

  noFill();
  stroke(on ? ACCENT : [80]);
  strokeWeight(2);
  beginShape();
  for (let x = 0; x <= width; x += 3) {
    const yy = Waves.wave(x, {
      wave: 'mountain peaks', t: tValue, frequency: 0.6, amplitude: h * 0.32,
    });
    vertex(x, h / 2 + yy);
  }
  endShape();

  noStroke(); fill(235); textAlign(LEFT, TOP); textSize(14);
  text(label, 16, 14);
  fill(140); textSize(11);
  text(sub + '    ·    t = ' + tValue.toFixed(2), 16, 34);
  pop();
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
