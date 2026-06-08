/* 08 · Golf op golf — domein-warp / nesting
 *
 * Een rauwe golf is plat. Formules kun je STAPELEN:
 *   warped(x) = wave( x + wave(x, A), B )
 * Golf A (de "inner") vervormt het DOMEIN (de x-ruimte) van golf B (de "outer").
 * Audio (bass) stuurt hoe sterk A buigt → de ruimte van B ademt op de kick.
 *
 * Op het scherm:
 *   grijs  = golf B zonder warp (referentie)
 *   blauw  = golf A (de vervormer), klein bovenaan
 *   roze   = het resultaat: B met A-vervormde ruimte
 */
let audio, ctl;
let warpS = 30;

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

  warpS = lerp(warpS, on ? 20 + audio.bands.bass * 160 : 30, 0.12);

  // referentie: golf B zonder warp
  noFill(); stroke(70); strokeWeight(1);
  beginShape();
  for (let x = 0; x <= width; x += 3) {
    const y = Waves.wave(x, { wave: 'classic sine', t, frequency: 1.2, amplitude: 95 });
    vertex(x, height / 2 + y);
  }
  endShape();

  // golf A (de vervormer), klein bovenaan getekend
  stroke(90, 200, 255); strokeWeight(1.5);
  beginShape();
  for (let x = 0; x <= width; x += 3) {
    const a = Waves.wave(x, { wave: 'triangle', t: t * 0.6, frequency: 0.4, amplitude: warpS });
    vertex(x, 70 + a);
  }
  endShape();
  noStroke(); fill(90, 200, 255); textAlign(LEFT, TOP); textSize(11);
  text('golf A — vervormt de ruimte (bass-gestuurd)', 16, 96);

  // resultaat: B met A-vervormde x
  stroke(255, 0, 125); strokeWeight(2.5);
  beginShape();
  for (let x = 0; x <= width; x += 2) {
    const inner = Waves.wave(x, { wave: 'triangle', t: t * 0.6, frequency: 0.4, amplitude: warpS });
    const y = Waves.wave(x + inner, { wave: 'classic sine', t, frequency: 1.2, amplitude: 95 });
    vertex(x, height / 2 + y);
  }
  endShape();
  noStroke(); fill(235); textSize(12);
  text('resultaat: wave(x + wave(x,A), B)   ·   warp = ' + warpS.toFixed(0), 16, height / 2 + 110);

  if (!on) {
    fill(255); textAlign(CENTER, CENTER); textSize(18);
    text('Start een audiobron linksboven', width / 2, height / 2 - 30);
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
