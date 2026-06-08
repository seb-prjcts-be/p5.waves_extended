// ABOUT     my grandfather's handwriting
// GESTURE   stutter
// REFERENCE Karel Martens oefeningen — restraint that surprises itself
// COLOR     photocopy black + red accent
// RISK      near-monochrome restraint risks reading decorative — the stutter
//           must carry the weight of a hand losing its line, and the red
//           must feel like correction, not ornament
// MATERIAL  pen with travel-angle (atan2 on a finite-difference of the y
//           wave) → calligraphic-nib thickness modulation per row.
//           waves drive vertical deviation; atan2 converts that into a
//           *direction* so down-strokes read heavy and up-strokes read light.
//           multi-speed: slow tremor, mid cursive, fast stutter.

let lines = [];
const M = 100;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(2);
  await document.fonts.ready;

  const rowH = 76;
  const startY = 175;
  const n = 9;
  const tremorWaves = [
    'wobble sine',
    'bumpy sine',
    'round linked sine',
    'meta sine',
    'wobble sine'
  ];
  const heavyStutter = new Set([2, 6]);

  for (let i = 0; i < n; i++) {
    lines.push({
      y: startY + i * rowH,
      tremorWave: tremorWaves[i % tremorWaves.length],
      tremorAmp: 3 + ((i * 5) % 4),
      freq: 0.018 + ((i * 5) % 4) * 0.004,
      seed: 13 + i * 5,
      cursiveSeed: 77 + i * 3,
      cursiveFreq: 0.10 + ((i * 3) % 4) * 0.028,
      cursiveAmp: 5 + ((i * 7) % 5),
      stutterSeed: 200 + i * 11,
      heavy: heavyStutter.has(i),
      // each row is "written" with a pen held at a slightly different tilt
      nibAngle: PI * (0.22 + ((i * 0.11) % 0.35)),
      maxNib: 2.6 + ((i * 11) % 7) * 0.25,
      indent: i === 0 ? 46 : ((i * 13) % 28),
      tailCut: 30 + ((i * 19) % 80)
    });
  }
}

function draw() {
  background(245);

  const t = millis() / 1000;

  for (const row of lines) {
    drawHandwriting(row, t);
  }

  drawRedCorrections(t);
  drawLabels();
}

function drawHandwriting(row, t) {
  const tremorS = Waves.createSampler({
    wave: row.tremorWave,
    amplitude: 1,
    frequency: row.freq,
    seed: row.seed
  });
  const cursiveS = Waves.createSampler({
    wave: 'round linked sine',
    amplitude: 1,
    frequency: row.cursiveFreq,
    seed: row.cursiveSeed
  });
  const stut = Waves.createSampler({
    wave: 'fuzzy pulse',
    amplitude: 1,
    frequency: 0.045,
    seed: row.stutterSeed,
    mode: 'wild',
    unpredictability: 0.65
  });

  const xStart = M + row.indent;
  const xEnd = width - M - row.tailCut;
  const stepX = 1.25;

  // unified y-offset function — one source of truth for position & derivative
  const yAt = (x) => {
    const tr = tremorS.sample(x, t * 0.09) * row.tremorAmp;
    const cu = cursiveS.sample(x, t * 0.55) * row.cursiveAmp;
    return tr + cu;
  };

  stroke(18);
  noFill();

  let prevX = null;
  let prevY = null;
  let prevSkip = true;

  for (let x = xStart; x <= xEnd; x += stepX) {
    const yOff = yAt(x);
    const yNext = yAt(x + stepX);

    // finite-difference derivative → travel direction of the pen
    const dy = yNext - yOff;
    const dx = stepX;
    const travel = atan2(dy, dx);

    // calligraphic nib: width = |sin(travel − nibAngle)| × maxNib + floor
    const thickness = max(0.35, abs(sin(travel - row.nibAngle)) * row.maxNib + 0.45);

    const sv = stut.sample(x, t * 1.7);
    const threshold = row.heavy ? 0.18 : 0.58;
    const skip = sv > threshold;

    const px = x;
    const py = row.y + yOff;

    if (!skip && !prevSkip && prevX !== null) {
      strokeWeight(thickness);
      line(prevX, prevY, px, py);
    }

    prevX = px;
    prevY = py;
    prevSkip = skip;
  }
}

function drawRedCorrections(t) {
  push();
  stroke(212, 34, 34);
  noFill();

  // firm strike through row 6 — the line is ruled out
  const strikeRow = lines[6];
  const strikeY = strikeRow.y - 1;
  strokeWeight(3.4);
  const strikeWave = Waves.createSampler({
    wave: 'classic sine',
    amplitude: 1.6,
    frequency: 0.015,
    seed: 3
  });
  beginShape();
  for (let x = M + 18; x <= width - M - 18; x += 3) {
    vertex(x, strikeY + strikeWave.sample(x, t * 0.22));
  }
  endShape();

  // scribbled-out word on row 2
  const row2 = lines[2];
  strokeWeight(2.6);
  const sx1 = 280;
  const sx2 = 520;
  const sy = row2.y;
  beginShape();
  for (let x = sx1; x <= sx2; x += 16) {
    const step = (x - sx1) / 16;
    const flip = step % 2 === 0 ? -1 : 1;
    vertex(x, sy + 9.5 * flip);
  }
  endShape();

  // small X in right margin by row 3
  strokeWeight(2.2);
  const tickY = lines[3].y;
  const tx = width - M + 14;
  line(tx, tickY - 7, tx + 14, tickY + 7);
  line(tx, tickY + 7, tx + 14, tickY - 7);

  pop();
}

function drawLabels() {
  push();
  noStroke();

  fill(90, 90, 90, 242);
  textFont('Oswald');
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('the signature fails', M, 854);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  text('p5.waves · atan2 nib · fuzzy pulse', M, 870);

  textAlign(RIGHT, BASELINE);
  textSize(19);
  text('p5.waves', width - M, 854);
  pop();
}
