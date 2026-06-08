// Forty-Nine Tilts - Daily p5.waves - 2026-04-24
//
// MODE          : F (Formal)
// QUESTION      : What does `range` do when the mapped output is not a
//                 coordinate, but a rotation angle?
// GESTURE       : forty-nine bars tilt from -90deg to +90deg.
// REFERENCE     : Sol LeWitt - one instruction, repeated with discipline.
// SEB ANCHOR    : p5.wavesX100 - one p5.waves move made explicit.
// LIBRARY MOVE  : Waves.wave(x, { wave: 'classic sine', frequency: 5,
//                 range: [-HALF_PI, HALF_PI] }) maps the wave output directly
//                 into the drawing domain. The bars do not post-process a
//                 normalized value; p5.waves returns the angle.
// AESTHETIC     : specimen strip + grid + live readout. The strip explains the
//                 mapping, the grid carries the poster image, and the color
//                 gradient marks negative/positive rotation without adding a
//                 second behavior.

const W = 1080;

const PAPER = [245, 245, 245];
const INK = [32, 32, 28];
const MUTED = [112, 107, 98];
const HAIR = [32, 32, 28, 42];
const NEG = [218, 48, 112];
const POS = [0, 164, 220];

const WAVE_NAME = 'classic sine';
const FREQUENCY = 5;
const DRIFT = 0.46;
const DOMAIN_STEP = 1.0;

const GRID_N = 7;
const GRID_X = 190;
const GRID_Y = 232;
const GRID_W = 700;
const CELL = GRID_W / GRID_N;
const GRID_H = GRID_W;
const BAR_LEN = CELL * 0.66;
const BAR_WEIGHT = 8;

const STRIP_X0 = GRID_X;
const STRIP_X1 = GRID_X + GRID_W;
const STRIP_Y0 = 150;
const STRIP_Y1 = 202;
const STRIP_MID = (STRIP_Y0 + STRIP_Y1) * 0.5;

const READOUT_Y = 958;

async function setup() {
  createCanvas(W, W);
  pixelDensity(2);
  await document.fonts.ready;
  frameRate(30);
  noFill();
  strokeCap(SQUARE);
}

function draw() {
  const seconds = millis() / 1000;

  background(PAPER[0], PAPER[1], PAPER[2]);
  drawHeader(seconds);
  drawRangeSpecimen(seconds);
  drawTiltField(seconds);
  drawReadout(seconds);
}

function drawHeader(seconds) {
  const centerAngle = sampleAngle(3, 3, seconds);

  noStroke();
  fill(INK[0], INK[1], INK[2]);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(32);
  textAlign(LEFT, BASELINE);
  text('forty_nine_tilts', GRID_X, 124);

  textFont('IBM Plex Mono');
  textSize(10);
  fill(MUTED[0], MUTED[1], MUTED[2]);
  text('Waves.wave -> range [-90deg, +90deg] -> rotate(bar)', GRID_X, 141);

  textAlign(RIGHT, BASELINE);
  text('center ' + angleLabel(centerAngle), GRID_X + GRID_W, 141);
}

function drawRangeSpecimen(seconds) {
  const domain = fieldDomain(seconds);

  stroke(HAIR[0], HAIR[1], HAIR[2], HAIR[3]);
  strokeWeight(0.75);
  line(STRIP_X0, STRIP_Y0, STRIP_X1, STRIP_Y0);
  line(STRIP_X0, STRIP_MID, STRIP_X1, STRIP_MID);
  line(STRIP_X0, STRIP_Y1, STRIP_X1, STRIP_Y1);

  noStroke();
  fill(MUTED[0], MUTED[1], MUTED[2]);
  textFont('IBM Plex Mono');
  textSize(9);
  textAlign(LEFT, BOTTOM);
  text('+90deg', STRIP_X0, STRIP_Y0 - 5);
  text('0deg', STRIP_X0, STRIP_MID - 4);
  text('-90deg', STRIP_X0, STRIP_Y1 + 14);

  drawSpecimenWave(domain);
  drawSampleMarkers(seconds, domain);
}

function drawSpecimenWave(domain) {
  stroke(INK[0], INK[1], INK[2], 190);
  strokeWeight(1.35);
  noFill();
  beginShape();
  for (let i = 0; i <= 360; i += 1) {
    const u = i / 360;
    const input = lerp(domain.min, domain.max, u);
    const angle = waveToAngle(input);
    const x = lerp(STRIP_X0, STRIP_X1, u);
    const y = angleToStripY(angle);
    vertex(x, y);
  }
  endShape();
}

function drawSampleMarkers(seconds, domain) {
  for (let row = 0; row < GRID_N; row += 1) {
    for (let col = 0; col < GRID_N; col += 1) {
      const input = sampleInput(row, col, seconds);
      const angle = waveToAngle(input);
      const u = remap(input, domain.min, domain.max, 0, 1);
      const x = lerp(STRIP_X0, STRIP_X1, u);
      const y = angleToStripY(angle);
      const ink = angleInk(angle, 180);

      stroke(ink[0], ink[1], ink[2], ink[3]);
      strokeWeight(1);
      line(x, STRIP_Y1 + 6, x, STRIP_Y1 + 15);

      noStroke();
      fill(ink[0], ink[1], ink[2], ink[3]);
      circle(x, y, 4.2);
    }
  }
}

function drawTiltField(seconds) {
  drawFieldFrame();

  for (let row = 0; row < GRID_N; row += 1) {
    for (let col = 0; col < GRID_N; col += 1) {
      const cx = GRID_X + (col + 0.5) * CELL;
      const cy = GRID_Y + (row + 0.5) * CELL;
      const angle = sampleAngle(row, col, seconds);
      drawTiltCell(cx, cy, angle);
    }
  }
}

function drawFieldFrame() {
  stroke(HAIR[0], HAIR[1], HAIR[2], HAIR[3]);
  strokeWeight(0.75);
  noFill();
  rect(GRID_X - 0.5, GRID_Y - 0.5, GRID_W + 1, GRID_H + 1);

  for (let i = 1; i < GRID_N; i += 1) {
    const x = GRID_X + i * CELL;
    const y = GRID_Y + i * CELL;
    line(x, GRID_Y, x, GRID_Y + GRID_H);
    line(GRID_X, y, GRID_X + GRID_W, y);
  }
}

function drawTiltCell(cx, cy, angle) {
  push();
  translate(cx, cy);

  stroke(INK[0], INK[1], INK[2], 28);
  strokeWeight(0.75);
  line(-BAR_LEN * 0.55, 0, BAR_LEN * 0.55, 0);
  line(0, -BAR_LEN * 0.42, 0, BAR_LEN * 0.42);

  rotate(angle);
  const ink = angleInk(angle, 245);
  stroke(ink[0], ink[1], ink[2], ink[3]);
  strokeWeight(BAR_WEIGHT);
  line(-BAR_LEN / 2, 0, BAR_LEN / 2, 0);

  stroke(ink[0], ink[1], ink[2], 110);
  strokeWeight(2);
  point(-BAR_LEN / 2, 0);
  point(BAR_LEN / 2, 0);

  pop();
}

function drawReadout(seconds) {
  const domain = fieldDomain(seconds);
  const leftAngle = waveToAngle(domain.min);
  const rightAngle = waveToAngle(domain.max);

  noStroke();
  fill(MUTED[0], MUTED[1], MUTED[2]);
  textFont('IBM Plex Mono');
  textSize(9.5);
  textAlign(LEFT, BASELINE);
  text(
    "Waves.wave(input, { range: [-HALF_PI, HALF_PI] })",
    GRID_X,
    READOUT_Y
  );

  textAlign(RIGHT, BASELINE);
  text(
    'domain ' + domain.min.toFixed(2) + '..' + domain.max.toFixed(2) +
      '   49 inputs   edge ' + angleLabel(leftAngle) + ' / ' + angleLabel(rightAngle),
    GRID_X + GRID_W,
    READOUT_Y
  );
}

function sampleInput(row, col, seconds) {
  return (col - row * 0.5) * DOMAIN_STEP + seconds * DRIFT;
}

function sampleAngle(row, col, seconds) {
  return waveToAngle(sampleInput(row, col, seconds));
}

function waveToAngle(input) {
  return Waves.wave(input, {
    wave: WAVE_NAME,
    frequency: FREQUENCY,
    range: [-HALF_PI, HALF_PI]
  });
}

function fieldDomain(seconds) {
  return {
    min: sampleInput(GRID_N - 1, 0, seconds),
    max: sampleInput(0, GRID_N - 1, seconds)
  };
}

function angleToStripY(angle) {
  return remap(angle, -HALF_PI, HALF_PI, STRIP_Y1, STRIP_Y0);
}

function angleInk(angle, alpha) {
  const n = constrain((angle + HALF_PI) / PI, 0, 1);
  const edge = Math.abs(n - 0.5) * 2;
  const target = n < 0.5 ? NEG : POS;
  const mix = 0.22 + edge * 0.78;

  return [
    lerp(INK[0], target[0], mix),
    lerp(INK[1], target[1], mix),
    lerp(INK[2], target[2], mix),
    alpha
  ];
}

function angleLabel(angle) {
  const deg = Math.round(degrees(angle));
  return (deg > 0 ? '+' : '') + deg + 'deg';
}

function remap(value, inMin, inMax, outMin, outMax) {
  if (Math.abs(inMax - inMin) < 0.00001) return (outMin + outMax) * 0.5;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
