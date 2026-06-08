/*
 * lull
 *
 * FEELING — lull: long stillness interrupted by something that almost stirs,
 * then settles back.
 *
 * WAVE LOGIC — bald patch is the wave of held breath: flat stretches
 * punctuated by a single soft excursion. Used as the primary archetype
 * with shift=true so it morphs slowly into new quiet formulas every 9s.
 * Rare lines are assigned to stepped sine (micro-rupture bands, quantised
 * activity) or round linked sine (smooth recovery bands). Archetype per
 * line is picked at setup using fuzzy pulse — sparse, mostly-zero sampling
 * gives most lines the bald-patch mood and only a few the ruptures.
 *
 * TIME LOGIC — three slow speeds, no fast layer on purpose:
 *   main   /3200  cinematic drift, near-still
 *   space  /1800  breath tempo for vertical spacing
 *   alpha  /2200  atmospheric band fade
 * All three are explicitly not multiples of each other so phase relations
 * between spacing, tone and motion never re-align.
 *
 * STRUCTURAL MOVE — 150 horizontal wave-lines stacked inside the 100px
 * margin. Line y-positions are breath-modulated: spacingSampler expands
 * some intervals and compresses others, creating drifting horizontal zones
 * of density. A third sampler bands stroke alpha into topographic veils
 * that glide vertically over time. A single thin reference rule at the
 * vertical centre anchors weight without asserting symmetry.
 */

const M = 100;
const N_LINES = 150;

let archetypes = [];
let lineArch = [];
let linePhase = [];
let spacingSampler;
let alphaSampler;

async function setup() {
  const cnv = createCanvas(1080, 1080);
  cnv.parent('sketch');
  pixelDensity(2);
  await document.fonts.ready;

  archetypes = [
    Waves.createSampler({
      wave: 'bald patch',
      shift: true,
      shiftInterval: 9,
      shiftDuration: 3.5,
      range: [-18, 18]
    }),
    Waves.createSampler({
      wave: 'stepped sine',
      range: [-12, 12],
      frequency: 1.3
    }),
    Waves.createSampler({
      wave: 'round linked sine',
      range: [-24, 24],
      frequency: 0.7
    })
  ];

  spacingSampler = Waves.createSampler({
    wave: 'meta sine',
    amplitude: 1,
    frequency: 0.9
  });

  alphaSampler = Waves.createSampler({
    wave: 'wobble sine',
    range: [28, 168]
  });

  for (let i = 0; i < N_LINES; i++) {
    const selector = Waves.wave(i * 0.11, { wave: 'fuzzy pulse' });
    let idx = 0;
    if (selector > 55) idx = 1;
    else if (selector < -55) idx = 2;
    lineArch.push(idx);
    linePhase.push(i * 0.03);
  }
}

function draw() {
  background(245);

  const tMain = millis() / 3200;
  const tSpacing = millis() / 1800;
  const tAlpha = millis() / 2200;

  const topY = M;
  const botY = 810;
  const availH = botY - topY;
  const baseSpacing = availH / (N_LINES - 1);

  const rawSteps = new Array(N_LINES - 1);
  let rawSum = 0;
  for (let i = 0; i < N_LINES - 1; i++) {
    const breath = spacingSampler.sample(i * 0.05, tSpacing);
    const gap = baseSpacing * (1 + breath * 0.35);
    rawSteps[i] = gap;
    rawSum += gap;
  }
  const normScale = availH / rawSum;
  const yPos = new Array(N_LINES);
  yPos[0] = topY;
  for (let i = 1; i < N_LINES; i++) {
    yPos[i] = yPos[i - 1] + rawSteps[i - 1] * normScale;
  }

  noFill();
  strokeWeight(0.8);
  for (let i = 0; i < N_LINES; i++) {
    const arch = archetypes[lineArch[i]];
    const phase = linePhase[i];
    const a = alphaSampler.sample(i * 0.05, tAlpha);
    stroke(55, a);
    const yBase = yPos[i];
    beginShape();
    for (let x = M; x <= width - M; x += 2) {
      const dy = arch.sample(x * 0.012 + phase, tMain);
      vertex(x, yBase + dy);
    }
    endShape();
  }

  stroke(40, 170);
  strokeWeight(0.5);
  line(M, height / 2, width - M, height / 2);

  drawLabels();
}

function drawLabels() {
  noStroke();

  fill(90, 90, 90, 242);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT, BASELINE);
  text('lull', M, 1020);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(9.5);
  textAlign(LEFT, BASELINE);
  const main = archetypes[0];
  const waveName = main.shifting
    ? `${main.waveName} \u2192 ${main.targetName}`
    : main.waveName;
  text(waveName, M, 1040);

  fill(168);
  textFont('IBM Plex Mono');
  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', width - M, 1020);
}
