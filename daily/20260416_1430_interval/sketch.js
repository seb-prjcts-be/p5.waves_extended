const MARGIN = 100;
const N = 5;
const SPACING = 700 / (N + 1);

const CONFIGS = [
  { si: 14, sd: 4.0, amp:  10, freq: 0.022, wt: 0.6, g: 195, ts: 0.10 },
  { si:  8, sd: 2.5, amp:  24, freq: 0.016, wt: 1.2, g: 155, ts: 0.15 },
  { si:  5, sd: 2.0, amp:  40, freq: 0.011, wt: 2.0, g: 95,  ts: 0.22 },
  { si:  3, sd: 1.5, amp:  58, freq: 0.008, wt: 3.2, g: 45,  ts: 0.30 },
  { si:  2, sd: 1.0, amp:  72, freq: 0.006, wt: 5.0, g: 12,  ts: 0.40 },
];

let samplers;

function setup() {
  createCanvas(1080, 1080);
  textFont('monospace');
  samplers = CONFIGS.map(c => Waves.createSampler({
    shift: true,
    shiftInterval: c.si,
    shiftDuration: c.sd,
    amplitude: c.amp,
    frequency: c.freq
  }));
}

function __p5wSourceDraw() {
  background(245);
  const t = millis() / 1000;

  fill(185);
  noStroke();
  textSize(9.5);
  textAlign(CENTER, CENTER);
  text('I  N  T  E  R  V  A  L', 450, 62);

  fill(195);
  textSize(7.5);
  textAlign(LEFT, CENTER);
  text('p5.waves  ·  2026-04-16', MARGIN, 862);

  for (let i = 0; i < N; i++) {
    const cfg = CONFIGS[i];
    const s   = samplers[i];
    const cy  = MARGIN + SPACING * (i + 1);

    noStroke();
    fill(s.shifting ? 110 : 168);
    textSize(7.5);
    textAlign(LEFT, CENTER);
    text(s.waveName, MARGIN + 700 + 6, cy);

    stroke(cfg.g);
    strokeWeight(cfg.wt);
    noFill();
    beginShape();
    for (let x = MARGIN; x <= MARGIN + 700; x++) {
      const y = cy + s.sample(x, t * cfg.ts);
      vertex(x, y);
    }
    endShape();
  }
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
