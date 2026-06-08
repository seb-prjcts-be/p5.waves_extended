/*
  linger — 2026-04-21 · 16:15

  FEELING      : linger — the held breath, the refusal to pass.
  WAVE LOGIC   : main field samples a morph between `round linked sine`
                 and `smooth solid sine` — two gentle curvatures that
                 inhale across each other. A base tick band uses
                 `stepped sine` under auto-shift, so the pulse at the
                 floor of the composition slowly migrates between
                 discrete wave formulas. The field flows; the floor
                 counts. Two ways of waiting.
  TIME LOGIC   : main  = millis() / 3200  — cinematic, near-still
                 mix   = sin(millis()/5200) — slow crossfade breathing
                 ticks = millis() / 2400  — steadier cadence
                 shiftInterval 7s, shiftDuration 2.5s
  STRUCTURAL   : 72 horizontal contour slices. Amplitude follows a
                 half-sine envelope: pinched at top and bottom,
                 swelling at the middle — a tidal bulge held. Every
                 8th slice is emphasised as a reference rung. A tick
                 band at the base provides a counting pulse against
                 the stillness above.
*/

const W = 1080, H = 1080, M = 100;
const SLICES = 72;

let mainS, tickS;

async function setup() {
  createCanvas(W, H);
  await document.fonts.ready;

  mainS = Waves.createSampler({
    wave: ['round linked sine', 'smooth solid sine'],
    range: [-1, 1],
    frequency: 0.72,
    phase: 0.35,
  });

  tickS = Waves.createSampler({
    wave: 'stepped sine',
    shift: true,
    shiftInterval: 7,
    shiftDuration: 2.5,
    range: [-6.5, 6.5],
    frequency: 1.55,
    seed: 7,
  });

  noFill();
}

function draw() {
  background(245);

  const tMain = millis() / 3200;
  const tTick = millis() / 2400;
  const mixVal = (Math.sin(millis() / 5200) + 1) * 0.5;

  const fieldTop = M + 12;
  const fieldBottom = H - M - 110;
  const sliceH = (fieldBottom - fieldTop) / (SLICES - 1);

  for (let i = 0; i < SLICES; i++) {
    const u = i / (SLICES - 1);
    const envelope = Math.sin(Math.PI * u);
    const amp = 14 + envelope * 86;
    const phaseOff = u * 1.85;
    const accent = (i % 8 === 0);

    const aLine = accent ? 172 : 34 + envelope * 74;
    stroke(28, 28, 34, aLine);
    strokeWeight(accent ? 0.95 : 0.55);

    const yBase = fieldTop + i * sliceH;

    beginShape();
    for (let x = M; x <= W - M; x += 3) {
      const xn = (x - M) / (W - 2 * M);
      const v = mainS.sample(xn * 6.4 + phaseOff, tMain, mixVal);
      vertex(x, yBase + v * amp);
    }
    endShape();
  }

  const tickY = H - M - 44;
  stroke(70, 70, 78, 150);
  strokeWeight(0.6);
  line(M, tickY - 18, W - M, tickY - 18);

  stroke(40, 40, 48, 205);
  strokeWeight(0.9);
  const tickCount = 74;
  for (let i = 0; i < tickCount; i++) {
    const u = i / (tickCount - 1);
    const tx = M + u * (W - 2 * M);
    const v = tickS.sample(u * 5.6 + 0.25, tTick);
    line(tx, tickY - 2 + v, tx, tickY + 2 + v);
  }

  drawLabels();
}

function drawLabels() {
  noStroke();

  drawingContext.font = '300 22px "Oswald", sans-serif';
  drawingContext.fillStyle = 'rgba(90, 90, 90, 0.95)';
  drawingContext.textBaseline = 'alphabetic';
  drawingContext.textAlign = 'left';
  drawingContext.fillText('linger', M, 854);

  drawingContext.font = '400 9.5px "IBM Plex Mono", monospace';
  drawingContext.fillStyle = 'rgb(168, 168, 168)';
  drawingContext.fillText('round linked sine  ·  smooth solid sine', M, 870);

  drawingContext.font = '400 19px "IBM Plex Mono", monospace';
  drawingContext.textAlign = 'right';
  drawingContext.fillText('p5.waves', W - M, 854);
}
