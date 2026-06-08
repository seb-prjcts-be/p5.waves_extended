/*
  FEELING         : vigil — held attention during near-stillness
  WAVE LOGIC      : morph 'smooth solid sine' <-> 'batman'
                    unbroken breath alternating with spiked interruption
  TIME LOGIC      : ms/3400 drives the wave formula (slow cinematic drift)
                    ms/2600 drives the morph mix (second uncorrelated tide)
                    ms/1000 explicitly banned — both are slow compound multipliers
  STRUCTURAL MOVE : one continuous archimedean spiral, 14 revolutions from outer
                    edge to center; radial offset comes from the sampler, scaled
                    by an envelope that tapers near the core. A pale ghost of
                    the untouched spiral is drawn underneath — silence made
                    visible beneath the vigil.
*/

const CANVAS    = 900;
const MARGIN    = 100;

const CX        = 450;
const CY        = 435;
const R_START   = 310;
const REVS      = 14;
const STEPS     = 12000;
const AMP       = 12;

let sampler;

async function setup() {
  await document.fonts.ready;
  createCanvas(1080, 1080);
  pixelDensity(2);

  sampler = Waves.createSampler({
    wave: ['smooth solid sine', 'batman'],
    amplitude: AMP,
    frequency: 1
  });
}

function __p5wSourceDraw() {
  background(245);

  const ms     = millis();
  const tWave  = ms / 3400;
  const tMix   = ms / 2600;
  const mixAmt = (Math.cos(tMix) + 1) * 0.5;

  const totalTheta = REVS * TAU;

  // ghost spiral — the untouched silence
  stroke(90, 90, 95, 30);
  strokeWeight(0.45);
  noFill();
  beginShape();
  for (let i = 0; i <= STEPS; i += 3) {
    const p     = i / STEPS;
    const theta = p * totalTheta;
    const r     = R_START * (1 - p);
    vertex(CX + r * Math.cos(theta), CY + r * Math.sin(theta));
  }
  endShape();

  // live spiral — the wave-displaced vigil
  stroke(22, 28, 38, 222);
  strokeWeight(0.58);
  noFill();
  beginShape();
  for (let i = 0; i <= STEPS; i++) {
    const p        = i / STEPS;
    const theta    = p * totalTheta;
    const r        = R_START * (1 - p);
    const disp     = sampler.sample(theta * 0.613, tWave, mixAmt);
    const envelope = Math.min(1, r / 95);
    const rMod     = r + disp * envelope;
    vertex(CX + rMod * Math.cos(theta), CY + rMod * Math.sin(theta));
  }
  endShape();

  drawLabels();
}

function drawLabels() {
  noStroke();

  fill(90, 90, 90, 242);
  textFont('Oswald');
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('vigil', MARGIN, 854);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  text('smooth solid sine  <->  batman', MARGIN, 870);

  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', CANVAS - MARGIN, 854);
}


function draw() {
  push();
  translate(100, 100);
  scale(880 / 700);
  translate(-100, -100);
  try {
    __p5wSourceDraw();
  } finally {
    pop();
  }
}
