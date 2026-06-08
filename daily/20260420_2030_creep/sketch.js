/*
 * CREEP — Daily p5.waves
 *
 * FEELING — creep: the geological kind. Slow, near-imperceptible deformation
 *           of layered material under steady pressure.
 *
 * WAVE LOGIC — four stacked bands, each with its own wave family so the
 *           cross-section reads as distinct strata rather than noise:
 *           · stepped sine        (quantized, the firm upper layer)
 *           · bald patch          (punctured, with silent gaps — absence as form)
 *           · mountain peaks + batman morph (the tension band; shape drifts)
 *           · wobble sine         (restless sediment at the bottom; wild mode)
 *           Secondary sampler in the top band uses shift — the underlayer
 *           slowly swaps wave identity every ~9 seconds to keep the quiet alive.
 *
 * TIME LOGIC — multi-speed, slowest at top: /3200, /1500, /900, /320.
 *           Bottom band is ~10× faster than top. The stack reads as pressure
 *           building from above, resolved into jitter below.
 *
 * STRUCTURAL MOVE — 64 horizontal contour lines within a 100px safe margin.
 *           Band transitions are softened by a sin() edge-fade on amplitude
 *           so bands don't hard-stop; strata merge at their seams.
 */

const W = 900;
const H = 900;
const M = 100;

const LINES = 64;
const STEP = 3;

let bands;
let bandLabel;

async function setup() {
  createCanvas(1080, 1080);
  pixelDensity(2);
  await document.fonts.ready;

  bands = [
    {
      name: 'stepped sine',
      primary: Waves.createSampler({ wave: 'stepped sine', amplitude: 22, frequency: 0.9, seed: 3 }),
      accent:  Waves.createSampler({ amplitude: 14, frequency: 1.7, seed: 17, shift: true, shiftInterval: 9, shiftDuration: 2.5 }),
      tDiv: 3200,
      alpha: 195,
      weight: 1.1,
      morph: false
    },
    {
      name: 'bald patch',
      primary: Waves.createSampler({ wave: 'bald patch', amplitude: 26, frequency: 0.65, seed: 7 }),
      accent:  Waves.createSampler({ wave: 'bald patch', amplitude: 10, frequency: 2.1, seed: 29 }),
      tDiv: 1500,
      alpha: 165,
      weight: 1.0,
      morph: false
    },
    {
      name: 'mountain peaks ↔ batman',
      primary: Waves.createSampler({ wave: ['mountain peaks', 'batman'], amplitude: 30, frequency: 0.7, seed: 5 }),
      accent:  Waves.createSampler({ wave: 'fuzzy pulse', amplitude: 8, frequency: 2.6, seed: 22 }),
      tDiv: 900,
      alpha: 155,
      weight: 0.95,
      morph: true
    },
    {
      name: 'wobble sine',
      primary: Waves.createSampler({ wave: 'wobble sine', amplitude: 32, frequency: 0.9, seed: 11 }),
      accent:  Waves.createSampler({ wave: 'wobble sine', amplitude: 18, frequency: 2.3, seed: 34, unpredictability: 0.28, mode: 'wild' }),
      tDiv: 320,
      alpha: 135,
      weight: 0.85,
      morph: false
    }
  ];

  bandLabel = bands.map(b => b.name).join(' · ');
}

function __p5wSourceDraw() {
  background(245);

  const usableTop = M;
  const usableBottom = H - M - 80;
  const span = usableBottom - usableTop;
  const lineGap = span / (LINES - 1);
  const bandSize = Math.ceil(LINES / bands.length);

  const now = millis();
  const morphMix = (Math.sin(now * 0.00028) + 1) / 2;

  noFill();

  for (let i = 0; i < LINES; i++) {
    const y0 = usableTop + i * lineGap;
    const bandIdx = Math.min(bands.length - 1, Math.floor(i / bandSize));
    const band = bands[bandIdx];
    const withinBand = (i % bandSize) / Math.max(1, bandSize - 1);

    const tPrimary = now / band.tDiv + i * 0.045;
    const tAccent  = now / (band.tDiv * 0.55) + i * 0.07;

    stroke(38, band.alpha);
    strokeWeight(band.weight);

    beginShape();
    for (let px = M; px <= W - M; px += STEP) {
      const u = (px - M) * 0.012;

      let off = band.primary.sample(u, tPrimary, band.morph ? morphMix : 0);
      off += band.accent.sample(u, tAccent, 0) * 0.55;

      // edge-fade so bands blur at their boundaries rather than hard-stop
      const edgeFade = Math.sin(withinBand * Math.PI);
      off *= 0.42 + edgeFade * 0.58;

      // bottom band has a drift that slowly shifts the sediment floor
      if (bandIdx === bands.length - 1) {
        off += Math.sin(now * 0.00015 + u * 0.8) * 3;
      }

      vertex(px, y0 + off);
    }
    endShape();
  }

  // faint vertical register marks — quiet structural grid on the margin
  registerMarks();

  drawLabels();
}

function registerMarks() {
  stroke(40, 35);
  strokeWeight(0.6);
  const ticks = 7;
  for (let k = 0; k <= ticks; k++) {
    const xPos = M + (k * (W - 2 * M)) / ticks;
    line(xPos, M - 4, xPos, M - 10);
    line(xPos, H - M - 80 + 4, xPos, H - M - 80 + 10);
  }
}

function drawLabels() {
  noStroke();

  // title — Oswald 300, 22px, rgba(90,90,90,0.95)
  drawingContext.font = '300 22px Oswald, sans-serif';
  fill(90, 90, 90, 242);
  textAlign(LEFT, BASELINE);
  text('creep', M, 854);

  // active wave names — IBM Plex Mono, 9.5px, fill(168)
  drawingContext.font = '400 9.5px "IBM Plex Mono", monospace';
  fill(168);
  textAlign(LEFT, BASELINE);
  text(bandLabel, M, 870);

  // mark — IBM Plex Mono 19px, right-aligned
  drawingContext.font = '400 19px "IBM Plex Mono", monospace';
  fill(168);
  textAlign(RIGHT, BASELINE);
  text('p5.waves', W - M, 854);
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
