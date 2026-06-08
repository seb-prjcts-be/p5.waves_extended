/*
  singularity

  FEELING: pull
  WAVE LOGIC:
    - round linked sine (#31): organic radial perturbation of each ring.
    - grow random (#23): nervous disturbance inside the collapse cone.
    - bald patch (#27): per-ring silence gating — rings dim toward near-circles.
    - smooth solid sine (#33): slow rotation of the collapse cone axis.
  TIME LOGIC:
    slow   = millis() / 3200 — cosmic drift for ring geometry and cone rotation.
    medium = millis() / 850  — ring-level breathing along the circumference.
    fast   = millis() / 160  — hyper-fast collapse-cone vibration.
    Multi-speed: slow cosmic geometry collides with fast nervous collapse.
  STRUCTURAL MOVE:
    72 concentric rings, slightly off-center, pierced by an angular
    collapse cone that pulls radii inward and fragments the arc. The
    cone drifts slowly around the field.
*/

const M = 100;
const CX = 452;
const CY = 458;
const N_RINGS = 72;
const R_MIN = 26;
const R_MAX = 340;
const STEPS = 220;

let ringSampler;
let pullSampler;
let silenceSampler;
let coneSampler;
let breatheSampler;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;

  ringSampler = Waves.createSampler({
    wave: 'round linked sine',
    range: [-12, 12],
    frequency: 2.2,
    seed: 11
  });

  pullSampler = Waves.createSampler({
    wave: 'grow random',
    range: [0, 1],
    frequency: 1.5,
    seed: 7
  });

  silenceSampler = Waves.createSampler({
    wave: 'bald patch',
    range: [-255, 255],
    frequency: 1.1,
    seed: 17
  });

  coneSampler = Waves.createSampler({
    wave: 'smooth solid sine',
    range: [0, TWO_PI],
    seed: 3
  });

  breatheSampler = Waves.createSampler({
    wave: 'round linked sine',
    range: [-2.6, 2.6],
    frequency: 1.0,
    seed: 19
  });
}

function __p5wSourceDraw() {
  background(245);

  const slow = millis() / 3200;
  const medium = millis() / 850;
  const fast = millis() / 160;

  const coneAngle = coneSampler.sample(slow * 0.35, slow);
  const coneHalf = 0.38;
  const collapseDepth = 0.44;

  noFill();

  for (let i = 0; i < N_RINGS; i++) {
    const tNorm = i / (N_RINGS - 1);
    const r0 = R_MIN + pow(tNorm, 1.12) * (R_MAX - R_MIN);

    const ringDrift = ringSampler.sample(i * 0.27 + slow, slow);
    const silence = abs(silenceSampler.sample(i * 0.33 + slow * 0.6, slow));
    const alpha = min(255, 62 + silence * 0.8);

    strokeWeight(i % 8 === 0 ? 1.1 : (i % 3 === 0 ? 0.75 : 0.5));
    stroke(35, alpha);

    let drawing = false;
    for (let k = 0; k <= STEPS; k++) {
      const theta = (k / STEPS) * TWO_PI;

      let dTheta = abs(theta - coneAngle);
      if (dTheta > PI) dTheta = TWO_PI - dTheta;

      let r = r0 + ringDrift * 0.85;
      r += breatheSampler.sample(theta * 3 + i * 0.11, medium);

      let breakHere = false;

      if (dTheta < coneHalf) {
        const coneR = 1 - dTheta / coneHalf;
        const pullVal = pullSampler.sample(theta * 2.1 + i * 0.7 + fast * 0.25, fast);
        r *= 1 - collapseDepth * coneR * (0.5 + 0.5 * pullVal);
        if (pullVal > 0.7 && coneR > 0.45) breakHere = true;
      }

      const px = CX + r * cos(theta);
      const py = CY + r * sin(theta);

      if (breakHere) {
        if (drawing) { endShape(); drawing = false; }
        continue;
      }
      if (!drawing) { beginShape(); drawing = true; }
      vertex(px, py);
    }
    if (drawing) endShape();
  }

  // faint cone axis — a thin ray marking the collapse direction
  const axisInner = 22;
  const axisOuter = R_MAX + 16;
  stroke(205);
  strokeWeight(0.45);
  line(
    CX + axisInner * cos(coneAngle),
    CY + axisInner * sin(coneAngle),
    CX + axisOuter * cos(coneAngle),
    CY + axisOuter * sin(coneAngle)
  );

  drawLabels();
}

function drawLabels() {
  noStroke();

  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 242);
  textAlign(LEFT, BASELINE);
  text('singularity', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text('round linked sine / grow random / bald patch', M, 870);

  textSize(19);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', 900 - M, 854);
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
