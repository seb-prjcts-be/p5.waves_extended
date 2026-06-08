/* 07b · Closed-form ring per band
 *
 * Variant op 07: elke ring heeft zijn eigen beat-bron en eigen beat-klok.
 * In 07 deelden alle ringen één globale tBeat → ze morphten altijd samen.
 * Hier evolueert elke ring op zijn eigen instrument:
 *
 *   Grootste ring  (8 lobes, goud)   → beatBass   (kick)
 *   Middelste ring (5 lobes, blauw)  → beatTreble (hi-hat)
 *   Binnenste ring (3 lobes, roze)   → beatMid    (snare/clap)
 *
 * Elke ring heeft zijn eigen target en tBeat, zodat ze volledig onafhankelijk
 * van vorm wisselen. De gesloten-vorm-garantie (closing-groep, gedeelde periode)
 * geldt nog steeds per ring — ze blijven altijd naadloos gesloten.
 *
 * De flash bij een beat-event kleurt mee met de ring die triggert.
 */
let audio, ctl, rings, basePeriod;
let flashR = 0, flashG = 0, flashB = 0, flashAmt = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  audio = new WaveAudio({ fftSize: 1024 });
  ctl   = createAudioControls(audio);

  rings = [
    // binnenste → mid (snare)
    { lobes: 3, R: 0.34, col: [255, 0, 125],  beatKey: 'beatMid',    label: 'mid (snare)'   },
    // middelste → treble (hi-hat)
    { lobes: 5, R: 0.58, col: [120, 210, 255], beatKey: 'beatTreble', label: 'treble (hi-hat)' },
    // grootste → bass (kick)
    { lobes: 8, R: 0.82, col: [255, 220, 80],  beatKey: 'beatBass',   label: 'bass (kick)'  },
  ].map((r, i) => ({
    ...r,
    s: Waves.createSampler({
      shift: true, group: 'closing', seed: i + 1,
      shiftInterval: 0.1, shiftDuration: 0.9, range: [-1, 1],
    }),
    tBeat:  0,
    target: 0,
    beats:  0,
  }));

  basePeriod = rings[0].s.period || 62.83;
}

function draw() {
  const on = ctl.started();
  if (on) audio.update();

  // per ring: eigen beat-bron → eigen target
  for (const ring of rings) {
    if (on && audio[ring.beatKey]) {
      ring.target += 1;
      ring.beats++;
      // flash in de kleur van de triggerende ring
      flashR = ring.col[0]; flashG = ring.col[1]; flashB = ring.col[2];
      flashAmt = 1;
    }
    ring.tBeat = lerp(ring.tBeat, ring.target, 0.12);
  }
  flashAmt *= 0.88;

  background(8 + flashAmt * 18);

  const Rbase = min(width, height) * 0.45;
  const amp   = on ? 26 + audio.energy * 70 : 30;

  push();
  translate(width / 2, height / 2);
  const segs = 260;

  for (const ring of rings) {
    noFill();
    stroke(
      ring.col[0],
      ring.col[1],
      ring.col[2],
      map(flashAmt, 0, 1, 200, 255)
    );
    strokeWeight(2 + flashAmt * 2);
    beginShape();
    for (let k = 0; k <= segs; k++) {
      const th  = k / segs * TWO_PI;
      const x   = th / TWO_PI * (ring.lobes * basePeriod);
      const off = ring.s.sample(x, ring.tBeat);   // eigen beat-klok
      const rad = ring.R * Rbase + off * amp;
      vertex(cos(th) * rad, sin(th) * rad);
    }
    endShape(CLOSE);
  }
  pop();

  // HUD
  noStroke(); textAlign(LEFT, TOP); textSize(12);
  for (let i = 0; i < rings.length; i++) {
    const r = rings[i];
    fill(r.col[0], r.col[1], r.col[2]);
    text(
      `${r.lobes} lobes [${r.label}]  beats: ${r.beats}` +
      (r.s.shifting ? `  ${r.s.waveName} → ${r.s.targetName}` : `  ${r.s.waveName}`),
      16, 16 + i * 18
    );
  }

  if (!on) {
    fill(255); textAlign(CENTER, CENTER); textSize(18);
    text('Start een audiobron linksboven', width / 2, height / 2);
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
