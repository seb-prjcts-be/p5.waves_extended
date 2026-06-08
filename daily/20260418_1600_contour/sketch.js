const M = 100;
const STEP = 3;
const BANDS = 12;
const TOL = 0.014;

let samplerH, samplerV;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  frameRate(30);

  samplerH = Waves.createSampler({
    shift: true,
    shiftInterval: 6,
    shiftDuration: 2,
    range: [-1, 1]
  });

  samplerV = Waves.createSampler({
    shift: true,
    shiftInterval: 9,
    shiftDuration: 2.5,
    range: [-1, 1]
  });
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 1000;
  const INTERVAL = 2 / BANDS;

  stroke(20, 20, 26, 88);
  strokeWeight(2);

  for (let y = M; y < 900 - M; y += STEP) {
    for (let x = M; x < 900 - M; x += STEP) {
      const vh = samplerH.sample(x * 0.014, t * 0.14);
      const vv = samplerV.sample(y * 0.014, t * 0.11);
      const f = (vh + vv) * 0.5;

      const norm = f + 1;
      const mod = norm % INTERVAL;

      if (mod < TOL || mod > INTERVAL - TOL) {
        point(x, y);
      }
    }
  }

  stroke(140, 140, 140, 45);
  strokeWeight(0.5);
  noFill();
  rect(M, M, 900 - 2 * M, 900 - 2 * M);

  drawLabels();
}

function drawLabels() {
  noStroke();
  textAlign(LEFT, BASELINE);
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  fill(90, 90, 90, 242);
  text('Contour', M, 854);

  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text(samplerH.waveName + ' \xd7 ' + samplerV.waveName, M, 870);

  textAlign(RIGHT, BASELINE);
  textSize(19);
  fill(168);
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
