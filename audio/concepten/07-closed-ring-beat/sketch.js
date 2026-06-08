/* 07 · Closed-form ring op de beat  ⭐  (het vlaggenschip)
 *
 * Combineert de twee sterkste v3.3.0-eigenschappen:
 *   1. de 'closing'-groep — 17 golven die DEZELFDE basisperiode delen, dus een
 *      polaire ring blijft naadloos gesloten, ook TIJDENS een morph van A → B.
 *   2. shift heeft geen eigen klok → we voeden een beat-gequantiseerde t, zodat
 *      elke ring op de beat naar een nieuwe gesloten vorm klikt.
 *
 * Drie concentrische ringen, elk een eigen aantal lobes en eigen golf-sequentie,
 * maar gesynchroniseerd op dezelfde beat-klok. Dit kan een opgenomen audiogolf
 * principieel niet: een scope toont, hij kiest geen gesloten vorm.
 */
let audio, ctl, rings, basePeriod;
let tBeat = 0, target = 0, flash = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  audio = new WaveAudio({ fftSize: 1024 });
  ctl = createAudioControls(audio);

  rings = [
    { lobes: 3, R: 0.34, col: [255, 0, 125] },
    { lobes: 5, R: 0.58, col: [120, 210, 255] },
    { lobes: 8, R: 0.82, col: [255, 220, 80] },
  ].map((r, i) => ({
    ...r,
    s: Waves.createSampler({
      shift: true, group: 'closing', seed: i + 1,
      shiftInterval: 0.1, shiftDuration: 0.9, range: [-1, 1],
    }),
  }));
  basePeriod = rings[0].s.period || 62.83;   // gedeelde periode van de closing-groep
}

function draw() {
  const on = ctl.started();
  if (on) {
    audio.update();
    if (audio.beatBass) { target += 1; flash = 1; }  // kick kiest de nieuwe ringvorm
  }
  tBeat = lerp(tBeat, target, 0.12);
  flash *= 0.88;

  background(8 + flash * 18);

  const Rbase = min(width, height) * 0.45;
  const amp = (on ? 26 + audio.energy * 70 : 30);

  push();
  translate(width / 2, height / 2);
  const segs = 260;
  for (const ring of rings) {
    noFill();
    stroke(ring.col[0], ring.col[1], ring.col[2], 220);
    strokeWeight(2 + flash * 2);
    beginShape();
    for (let k = 0; k <= segs; k++) {
      const th = k / segs * TWO_PI;
      // veeg over een GEHEEL aantal periodes → ring sluit naadloos
      const x = th / TWO_PI * (ring.lobes * basePeriod);
      const off = ring.s.sample(x, tBeat);
      const rad = ring.R * Rbase + off * amp;
      vertex(cos(th) * rad, sin(th) * rad);
    }
    endShape(CLOSE);
  }
  pop();

  // info
  noStroke(); textAlign(LEFT, TOP); textSize(12);
  fill(235); text('beats: ' + target, 16, 16);
  for (let i = 0; i < rings.length; i++) {
    fill(rings[i].col);
    text(rings[i].lobes + ' lobes: ' + rings[i].s.waveName +
         (rings[i].s.shifting ? ' → ' + rings[i].s.targetName : ''), 16, 36 + i * 18);
  }
  if (!on) {
    fill(255); textAlign(CENTER, CENTER); textSize(18);
    text('Start een audiobron linksboven', width / 2, height / 2);
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
