/*
  ebb

  FEELING        — ebb. The retreating phase, a field slowly emptying itself.
  WAVE LOGIC     — morph between smooth solid sine (fullness, held body of water)
                   and valleys (drained basins, concave recesses). Each horizontal
                   slice holds its own mix position and breathes over 5.6s, so the
                   whole field slides between filled and emptied without ever
                   settling. A second sampler on bald patch drives a per-line
                   alpha mask — sections intermittently drop to near silence,
                   as if draining off the plate.
  TIME LOGIC     — multi-speed. /3200 primary drift (slow, cinematic). /5600 for
                   the morph mix (ultra-slow breath between filled and drained).
                   /520 for the alpha mask — medium pulse that lets certain slices
                   disappear then return. The three speeds never align, so the
                   surface never repeats.
  STRUCTURAL MOVE — topographic. 94 horizontal contour lines stacked between
                   y=158 and y=802. Amplitude follows a bell curve across vertical
                   position — middle lines swell, outer lines hold near-still.
                   A thin reference baseline at mid-canvas anchors the composition;
                   a narrow tick column on the right edge logs each line's
                   current mask value, a quiet record of where the field is thin.
*/

const W = 900;
const H = 900;
const M = 100;

const NUM_LINES = 94;
const TOP_Y = 158;
const BOT_Y = 802;

let maskSampler;

async function setup() {
  createCanvas(1080, 1080);
  await document.fonts.ready;
  pixelDensity(2);
  frameRate(30);

  maskSampler = Waves.createSampler({
    wave: 'bald patch',
    range: [0, 1],
    frequency: 0.85,
    phase: 1.3,
  });
}

function __p5wSourceDraw() {
  background(245);

  const t       = millis() / 3200;
  const tMorph  = millis() / 5600;
  const tMask   = millis() / 520;

  // --- reference geometry: thin mid baseline ---------------------------------
  stroke(196);
  strokeWeight(0.5);
  line(M, H / 2, W - M, H / 2);

  // --- contour stack ---------------------------------------------------------
  noFill();
  const maskVals = new Array(NUM_LINES);

  for (let i = 0; i < NUM_LINES; i++) {
    const u = i / (NUM_LINES - 1);             // 0..1 top → bottom
    const yBase = TOP_Y + u * (BOT_Y - TOP_Y);

    // bell amplitude profile — loudest in the middle
    const bell = Math.sin(u * Math.PI);        // 0..1..0

    const amp  = 2 + bell * 36;

    // per-line mix — offset so lines morph out of phase, slowly
    const mixVal = (Math.sin(tMorph * Math.PI * 2 + u * 4.4) + 1) / 2;

    // mask per line — stored for the tick column
    const mskVal = maskSampler.sample(i * 0.14, tMask);
    maskVals[i] = mskVal;

    // darker where the bell is low (outer lines carry density)
    const grey  = 40 + (1 - bell) * 110;
    const alphaVal = (50 + bell * 150) * (0.35 + 0.65 * mskVal);

    stroke(grey, alphaVal);
    strokeWeight(0.8);

    const freq = 0.0105 + u * 0.0065;
    const ph   = u * 2.1 + i * 0.29;

    beginShape();
    for (let x = M; x <= W - M; x += 2) {
      const xu = (x - M) * freq;
      const y = Waves.wave(xu, {
        wave: ['smooth solid sine', 'valleys'],
        t: t + u * 0.38,
        seed: i * 3 + 11,
        amplitude: amp,
        phase: ph,
        mix: mixVal,
      });
      vertex(x, yBase + y);
    }
    endShape();
  }

  // --- tick column right edge: records per-line mask state -------------------
  drawTickColumn(maskVals);

  // --- small vertical witness marks: slow meter of morph position -----------
  drawMorphMeter(tMorph);

  drawLabels();
}

function drawTickColumn(maskVals) {
  const colX = W - M + 22;      // just outside the right margin
  const topY = TOP_Y;
  const botY = BOT_Y;

  // column baseline
  stroke(212);
  strokeWeight(0.5);
  line(colX, topY, colX, botY);

  // ticks per line
  noStroke();
  for (let i = 0; i < maskVals.length; i++) {
    const u = i / (maskVals.length - 1);
    const y = topY + u * (botY - topY);
    const mskVal = maskVals[i];
    const len = 2 + mskVal * 11;
    const a = 80 + mskVal * 140;
    fill(90, a);
    rect(colX + 2, y - 0.4, len, 0.8);
  }
}

function drawMorphMeter(tMorph) {
  // small horizontal meter below the title, reads the global morph phase
  const mx = M;
  const my = 122;
  const mw = 180;

  stroke(210);
  strokeWeight(0.5);
  line(mx, my, mx + mw, my);

  const phase01 = (Math.sin(tMorph * Math.PI * 2) + 1) / 2;   // 0..1
  const px = mx + phase01 * mw;

  stroke(110);
  strokeWeight(1.2);
  line(px, my - 4, px, my + 4);

  noStroke();
  fill(150);
  textFont('IBM Plex Mono');
  textStyle(NORMAL);
  textSize(8.5);
  textAlign(LEFT, BASELINE);
  text('morph   full ——— drained', mx, my - 10);

  textAlign(RIGHT, BASELINE);
  text(nf(phase01, 1, 2), mx + mw, my - 10);
}

function drawLabels() {
  if (window.__P5WAVES_STAGE_ONLY__) return;
  noStroke();

  // bottom-left title
  textFont('Oswald');
  textStyle(NORMAL);
  textSize(22);
  textAlign(LEFT, BASELINE);
  fill('rgba(90,90,90,0.95)');
  text('ebb', M, 854);

  // active wave name
  textFont('IBM Plex Mono');
  textSize(9.5);
  fill(168);
  text('smooth solid sine  ↔  valleys   /   bald patch (mask)', M, 870);

  // bottom-right signature
  textSize(19);
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
