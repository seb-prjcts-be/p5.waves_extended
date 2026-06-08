// p5.waves × 100 v2 — "100 Tiny Worlds"
// 100 animated 50×50 frames showcasing p5.js + p5.waves v2.1.1
// Rows: Living · Optical · Chromatic · Waves · Textile · Fluid · Glitch · Type · Spatial · Cosmic

const FRAMES = [];
const STATE = {};
const COLS = 10, ROWS = 10, SZ = 50;

function setup() {
  createCanvas(COLS * SZ, ROWS * SZ);
  frameRate(30);
  initState();
  registerFrames();
}

function draw() {
  background(0);
  const t = millis() / 1000;
  const fc = frameCount;
  const ctx = drawingContext;
  for (let i = 0; i < 100; i++) {
    const cx = (i % COLS) * SZ;
    const cy = floor(i / COLS) * SZ;
    push();
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx, cy, SZ, SZ);
    ctx.clip();
    translate(cx, cy);
    if (FRAMES[i]) {
      try { FRAMES[i](t, fc); } catch(e) {}
    }
    ctx.restore();
    pop();
  }
}

// ── Wave shorthand ──
function W(coord, opts) { return Waves.wave(coord, opts); }

// ── State initialization ──
function initState() {
  // Row 0-1 state
  STATE[0] = { divisions: [] };
  STATE[1] = { angle: 0 };
  STATE[3] = { tendrils: Array.from({length:6}, (_,i) => ({seed: i*100, phase: i*0.7})) };
  STATE[5] = { spores: Array.from({length:12}, (_,i) => ({x: 10+Math.random()*30, y: 10+Math.random()*30, seed: i*77})) };
  STATE[7] = { nuclei: [{x:18,y:25},{x:32,y:25}], phase: 0 };
  STATE[10] = { gridCache: null };
  STATE[14] = { rot: 0 };

  // Row 2-3 state
  STATE[25] = { particles: Array.from({length: 12}, (_, i) => ({x: 10 + (i % 4) * 12, y: 10 + Math.floor(i / 4) * 12})) };
  STATE[35] = { pts: Array.from({length: 40}, (_, i) => ({x: Math.random() * 50, y: Math.random() * 50, s: Math.random() * 0.5 + 0.3})) };
  STATE[38] = { rings: Array.from({length: 6}, (_, i) => ({r: 5 + i * 4, phase: i * 0.4})) };

  // Row 6-7 state
  STATE[60] = { sortBuf: [] };
  STATE[70] = { chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('') };
  STATE[71] = { densityChars: ' .:-=+*#%@'.split('') };
  STATE[73] = { symbols: '\u25C6\u25C7\u25CB\u25CF\u25A1\u25A0\u25B3\u25BD\u2605\u2606\u2666\u2663\u2660\u2665'.split('') };
  STATE[74] = { morseMap: {'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..'} };
  STATE[78] = { words: ['WAVE','FLUX','BYTE','CODE','MESH','GRID','SYNC','LOOP','VOID','NULL'] };

  // Row 8-9 state
  STATE[90] = (() => {
    let stars = [];
    for (let i = 0; i < 60; i++) stars.push({ x: Math.random() * 50, y: Math.random() * 50, z: Math.random() * 3 + 0.5, b: Math.random() });
    return { stars };
  })();
  STATE[91] = (() => {
    let particles = [];
    for (let i = 0; i < 80; i++) particles.push({ x: Math.random() * 50, y: Math.random() * 50, vx: 0, vy: 0, r: Math.random(), g: Math.random(), life: Math.random() });
    return { particles };
  })();
  STATE[92] = { planets: [
    { dist: 8, speed: 2.0, size: 2, r: 200, g: 180, b: 140 },
    { dist: 13, speed: 1.2, size: 3, r: 80, g: 140, b: 220 },
    { dist: 18, speed: 0.7, size: 2.5, r: 180, g: 100, b: 80 },
    { dist: 22, speed: 0.4, size: 4, r: 210, g: 180, b: 120 }
  ]};
  STATE[96] = { cometTrail: [] };
  STATE[99] = (() => {
    let pts = [];
    for (let i = 0; i < 50; i++) pts.push({ a: Math.random() * TWO_PI, r: Math.random() * 22, s: Math.random() * 0.5 + 0.5, h: Math.random() * 360 });
    return { pts, sparks: [] };
  })();
}

// ── Register all 100 frames ──
function registerFrames() {

// ═══════════════════════════════════════
// ROW 0: Living Things (0-9)
// ═══════════════════════════════════════

FRAMES[0] = (t, fc) => {
  // Cell division / mitosis
  noStroke();
  let split = W(25, {wave:'smooth solid sine', t:t*0.4, range:[0,1], seed:42, frequency:0.5});
  let sepX = split * 14;
  stroke(80, 220, 120, 80); strokeWeight(1.5); noFill();
  let membraneWobble = W(t*50, {wave:'bumpy sine', t:t, range:[0,2], seed:7, frequency:2});
  if (split < 0.5) {
    ellipse(25, 25, 28 + membraneWobble, 26 + membraneWobble);
  } else {
    let pinch = map(split, 0.5, 1, 0, 12);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let r = 14 + W(a*10, {wave:'wobble sine', t:t, range:[-1,1], seed:3, frequency:3});
      let px = 25 + cos(a) * (r + abs(cos(a)) * sepX * 0.5);
      let py = 25 + sin(a) * max(4, r - sin(a*2) * pinch);
      vertex(px, py);
    }
    endShape(CLOSE);
  }
  fill(60, 180, 255, 180); noStroke();
  let cx1 = 25 - sepX * 0.4, cx2 = 25 + sepX * 0.4;
  for (let i = 0; i < 4; i++) {
    let wobble = W(i*10, {wave:'noise', t:t, range:[-2,2], seed:i+10, frequency:1.5});
    ellipse(cx1 + wobble, 22 + i*2, 3, 2);
    if (split > 0.3) ellipse(cx2 + wobble, 22 + i*2, 3, 2);
  }
};

FRAMES[1] = (t, fc) => {
  // Swimming paramecium
  let swimX = W(25, {wave:'meta sine', t:t*0.7, range:[8,42], seed:99, frequency:0.6});
  let swimY = W(25, {wave:'offset sine', t:t*0.5, range:[12,38], seed:55, frequency:0.8});
  stroke(100, 200, 180, 120); strokeWeight(0.7);
  for (let i = 0; i < 16; i++) {
    let a = (TWO_PI / 16) * i;
    let ciliaWave = W(i*5, {wave:'zig-zag sine', t:t*2, range:[4,9], seed:i, frequency:3});
    line(swimX + cos(a)*6, swimY + sin(a)*5, swimX + cos(a)*ciliaWave, swimY + sin(a)*ciliaWave);
  }
  noStroke(); fill(40, 160, 140, 200);
  let bodyW = W(swimY, {wave:'bumpy sine', t:t, range:[10,14], seed:33, frequency:1});
  ellipse(swimX, swimY, bodyW, bodyW * 0.7);
  fill(80, 100, 180, 200); ellipse(swimX - 1, swimY, 4, 3.5);
  fill(100, 220, 200, 100);
  let vacPulse = W(25, {wave:'half sine', t:t*2, range:[1,3], seed:22, frequency:2});
  ellipse(swimX + 3, swimY - 1, vacPulse, vacPulse);
};

FRAMES[2] = (t, fc) => {
  // Pulsing membrane rings
  noFill();
  for (let ring = 0; ring < 6; ring++) {
    let pulse = W(ring * 8, {wave:'ramp up sine', t:t*0.8, range:[5, 12 + ring*4], seed:ring, frequency:0.6 + ring*0.15, phase: ring*0.5});
    let hue = W(ring * 10, {wave:'triangle', t:t*0.3, range:[180, 320], seed:ring+50, frequency:0.4});
    colorMode(HSB, 360, 100, 100, 100);
    stroke(hue, 70, 80, map(ring, 0, 5, 90, 30)); strokeWeight(map(ring, 0, 5, 2.5, 0.8));
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.15) {
      let wobble = W(a * 15, {wave:'fuzzy peak sine', t:t, range:[-2, 2], seed:ring*7, frequency:2});
      vertex(25 + cos(a) * (pulse + wobble), 25 + sin(a) * (pulse + wobble));
    }
    endShape(CLOSE);
    colorMode(RGB, 255);
  }
};

FRAMES[3] = (t, fc) => {
  // Growing tendrils
  stroke(60, 180, 50); strokeWeight(1.2); noFill();
  for (let i = 0; i < 6; i++) {
    let seed = i * 100, ph = i * 0.7;
    beginShape();
    let px = 25, py = 48; vertex(px, py);
    let growLen = W(i * 8, {wave:'grow random', t:t*0.5, range:[3, 12], seed:seed, frequency:0.3, phase:ph});
    for (let s = 0; s < growLen; s++) {
      let bend = W(s * 10, {wave:'noise', t:t*0.3, range:[-6, 6], seed:seed+s, frequency:1.5});
      px += bend * 0.5; py -= 3.5;
      strokeWeight(map(s, 0, growLen, 2, 0.3)); vertex(px, py);
    }
    endShape();
    if (growLen > 6) {
      fill(80, 200, 60, 150); noStroke();
      let leafSize = W(i*5, {wave:'half sine', t:t, range:[1.5, 3.5], seed:seed+200, frequency:1});
      ellipse(px - 2, py, leafSize, leafSize * 0.6);
      ellipse(px + 2, py - 1, leafSize * 0.8, leafSize * 0.5);
      stroke(60, 180, 50);
    }
  }
};

FRAMES[4] = (t, fc) => {
  // Bacteria colony / petri dish
  background(240, 235, 220);
  noFill(); stroke(200, 190, 170); strokeWeight(2); ellipse(25, 25, 46, 46);
  noStroke();
  for (let i = 0; i < 20; i++) {
    let bx = W(i * 7, {wave:'noise', t:t*0.2, range:[6, 44], seed:i*31, frequency:0.5});
    let by = W(i * 11, {wave:'noise', t:t*0.2, range:[6, 44], seed:i*31+500, frequency:0.5});
    if (dist(bx, by, 25, 25) > 21) continue;
    let sz = W(i*3, {wave:'sharp peaks', t:t, range:[1.5, 4], seed:i*13, frequency:1.2});
    let ang = W(i*5, {wave:'saw up', t:t*0.5, range:[0, TWO_PI], seed:i*17, frequency:0.8});
    push(); translate(bx, by); rotate(ang);
    fill(180, 200, 80, 180); ellipse(0, 0, sz * 2, sz * 0.8);
    stroke(180, 200, 80, 100); strokeWeight(0.4);
    line(sz, 0, sz + 3, W(i*3, {wave:'sine', t:t*3, range:[-2,2], seed:i, frequency:4}));
    noStroke(); pop();
  }
};

FRAMES[5] = (t, fc) => {
  // Spore release / dandelion puff
  fill(80, 60, 40); noStroke(); ellipse(25, 38, 8, 6);
  stroke(70, 50, 30); strokeWeight(1.5); line(25, 41, 25, 50);
  for (let i = 0; i < 12; i++) {
    let drift = W(i * 8, {wave:'fade out', t:t*0.3, range:[0, 1], seed:i*77, frequency:0.2, phase:i*0.3});
    let baseAngle = (TWO_PI / 12) * i - HALF_PI;
    let sx = 25 + cos(baseAngle) * drift * 25 + W(i * 6, {wave:'wobble sine', t:t, range:[-3, 3], seed:i*33, frequency:1.5});
    let sy = 38 + sin(baseAngle) * drift * 20 - drift * 10;
    stroke(255, 255, 240, map(drift, 0, 1, 200, 60)); strokeWeight(0.3);
    for (let f = 0; f < 5; f++) { let fa = (TWO_PI / 5) * f; line(sx, sy, sx + cos(fa) * 2.5, sy + sin(fa) * 2.5); }
    noStroke(); fill(255, 255, 220, map(drift, 0, 1, 220, 40)); ellipse(sx, sy, 1.5, 1.5);
  }
};

FRAMES[6] = (t, fc) => {
  // DNA double helix
  strokeWeight(1.8); noFill();
  let yOff = (t * 15) % 10;
  for (let y = -5; y < 55; y += 2.5) {
    let yy = y + yOff;
    let twist = W(yy, {wave:'sine', t:t, range:[-10, 10], seed:1, frequency:1.2, phase:0});
    let twist2 = W(yy, {wave:'sine', t:t, range:[-10, 10], seed:1, frequency:1.2, phase:PI});
    let depth1 = W(yy, {wave:'sine', t:t, range:[0, 1], seed:1, frequency:1.2, phase: HALF_PI});
    stroke(lerpColor(color(100, 150, 255), color(255, 100, 150), depth1));
    strokeWeight(map(depth1, 0, 1, 1, 2.5)); point(25 + twist, yy);
    stroke(lerpColor(color(255, 100, 150), color(100, 150, 255), depth1));
    strokeWeight(map(depth1, 0, 1, 2.5, 1)); point(25 + twist2, yy);
    if (int(y) % 5 === 0) { stroke(100, 255, 180, 80); strokeWeight(0.6); line(25 + twist, yy, 25 + twist2, yy); }
  }
};

FRAMES[7] = (t, fc) => {
  // Mitosis splitting
  let phase = W(25, {wave:'ramp', t:t*0.15, range:[0, 1], seed:88, frequency:0.2});
  let sep = phase * 18;
  stroke(200, 200, 100, 60); strokeWeight(0.4);
  for (let i = 0; i < 8; i++) {
    let offsetY = W(i*7, {wave:'triangle sine', t:t, range:[-6, 6], seed:i*19, frequency:1});
    line(25 - sep * 0.5, 25 + offsetY, 25 + sep * 0.5, 25 - offsetY * 0.5);
  }
  noStroke(); fill(40, 140, 80, 160);
  let wobL = W(10, {wave:'round linked sine', t:t, range:[8, 12], seed:44, frequency:1.5});
  let wobR = W(20, {wave:'round linked sine', t:t, range:[8, 12], seed:45, frequency:1.5});
  ellipse(25 - sep * 0.5, 25, wobL, wobL * (1 - phase * 0.2));
  ellipse(25 + sep * 0.5, 25, wobR, wobR * (1 - phase * 0.2));
  fill(60, 100, 180, 200);
  ellipse(25 - sep * 0.5, 25, 4, 4); ellipse(25 + sep * 0.5, 25, 4, 4);
  if (phase < 0.8) { stroke(40, 140, 80, map(phase, 0, 0.8, 160, 0)); strokeWeight(map(phase, 0, 0.8, 4, 0.5)); line(25 - sep * 0.3, 25, 25 + sep * 0.3, 25); }
};

FRAMES[8] = (t, fc) => {
  // Coral polyps / sea anemone
  fill(180, 80, 100); noStroke(); ellipse(25, 42, 20, 8);
  for (let i = 0; i < 10; i++) {
    let baseAng = map(i, 0, 9, -PI * 0.8, -PI * 0.2);
    let sway = W(i * 9, {wave:'classic sine', t:t, range:[-0.3, 0.3], seed:i*41, frequency:0.8 + i*0.1});
    let tentLen = W(i * 6, {wave:'stepped sine', t:t*0.5, range:[10, 20], seed:i*23, frequency:0.6});
    let startX = 25 + cos(baseAng + PI) * 6, startY = 40;
    stroke(lerpColor(color(255, 120, 160), color(255, 200, 100), i / 9)); strokeWeight(map(i, 0, 9, 1.8, 1)); noFill();
    beginShape();
    for (let s = 0; s < 8; s++) {
      let frac = s / 7;
      let sw = W(s * 10 + i * 5, {wave:'wobble sine', t:t, range:[-3, 3], seed:i*41+s, frequency:1.5});
      vertex(startX + cos(baseAng + sway) * tentLen * frac + sw, startY + sin(baseAng + sway) * tentLen * frac);
    }
    endShape();
    noStroke(); fill(255, 255, 150, 150);
    ellipse(startX + cos(baseAng + sway) * tentLen, startY + sin(baseAng + sway) * tentLen, 2, 2);
  }
};

FRAMES[9] = (t, fc) => {
  // Heartbeat / pulsing organ
  let beat = W(25, {wave:'sharp peaks', t:t*1.5, range:[0, 1], seed:12, frequency:1.2});
  stroke(120, 20, 20, 100); strokeWeight(0.8);
  for (let i = 0; i < 8; i++) {
    let a = (TWO_PI / 8) * i;
    let veinLen = W(i*10, {wave:'mountain peaks', t:t, range:[12, 22], seed:i*60, frequency:0.7});
    beginShape();
    for (let s = 0; s < 6; s++) { let frac = s / 5; vertex(25 + cos(a) * veinLen * frac, 25 + sin(a) * veinLen * frac); }
    endShape();
  }
  noStroke(); let sz = 12 + beat * 6;
  fill(180, 30, 30);
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.1) { let r = sz * 0.4; vertex(25 + r * 16 * pow(sin(a), 3) / 16, 24 - r * (13 * cos(a) - 5 * cos(2*a) - 2 * cos(3*a) - cos(4*a)) / 16); }
  endShape(CLOSE);
  fill(255, 50, 50, beat * 100); ellipse(25, 24, sz * 1.2, sz * 1.1);
};

// ═══════════════════════════════════════
// ROW 1: Optical Play (10-19)
// ═══════════════════════════════════════

FRAMES[10] = (t, fc) => {
  // Moiré overlapping line grids
  background(255); stroke(0); strokeWeight(0.6);
  let rot1 = W(25, {wave:'saw up', t:t*0.1, range:[0, 0.5], seed:10, frequency:0.15});
  let rot2 = W(25, {wave:'saw up', t:t*0.1, range:[0, 0.5], seed:20, frequency:0.12, phase:1});
  push(); translate(25, 25); rotate(rot1);
  for (let x = -35; x < 35; x += 3) line(x, -35, x, 35);
  pop();
  push(); translate(25, 25); rotate(rot2);
  for (let x = -35; x < 35; x += 3) line(x, -35, x, 35);
  pop();
};

FRAMES[11] = (t, fc) => {
  // Impossible triangle (Penrose)
  background(240);
  let pulse = W(25, {wave:'smooth solid sine', t:t*0.5, range:[0.85, 1.1], seed:11, frequency:0.6});
  let rotAngle = W(25, {wave:'sine', t:t*0.2, range:[-0.1, 0.1], seed:22, frequency:0.3});
  push(); translate(25, 27); rotate(rotAngle); scale(pulse); noStroke();
  let s = 10;
  fill(60, 120, 200); beginShape(); vertex(0, -s); vertex(-s*0.87, s*0.5); vertex(-s*0.87+4, s*0.5+2); vertex(4, -s+2); endShape(CLOSE);
  fill(200, 80, 80); beginShape(); vertex(0, -s); vertex(s*0.87, s*0.5); vertex(s*0.87-4, s*0.5+2); vertex(-4, -s+2); endShape(CLOSE);
  fill(80, 180, 80); beginShape(); vertex(-s*0.87, s*0.5); vertex(s*0.87, s*0.5); vertex(s*0.87-4, s*0.5-3); vertex(-s*0.87+4, s*0.5-3); endShape(CLOSE);
  fill(60, 120, 200, 200); beginShape(); vertex(s*0.87, s*0.5); vertex(s*0.87-4, s*0.5-3); vertex(0, -s); vertex(4, -s+2); endShape(CLOSE);
  pop();
};

FRAMES[12] = (t, fc) => {
  // Afterimage / complementary flash
  let flashCycle = W(25, {wave:'square', t:t*0.4, range:[0, 1], seed:33, frequency:0.5});
  if (flashCycle > 0.5) {
    background(0); noStroke();
    let sz = W(25, {wave:'triangle', t:t, range:[10, 22], seed:44, frequency:1});
    fill(0, 255, 0); ellipse(25, 25, sz, sz);
    fill(255, 0, 255); rect(5, 5, 10, 10); rect(35, 35, 10, 10);
  } else {
    background(128); noStroke();
    let ghostAlpha = W(25, {wave:'fade out', t:t*0.8, range:[120, 20], seed:55, frequency:0.5});
    let sz = W(25, {wave:'triangle', t:t, range:[10, 22], seed:44, frequency:1});
    fill(255, 128, 255, ghostAlpha); ellipse(25, 25, sz, sz);
    fill(128, 255, 128, ghostAlpha * 0.7); rect(5, 5, 10, 10); rect(35, 35, 10, 10);
  }
};

FRAMES[13] = (t, fc) => {
  // Op-art concentric rings (Bridget Riley)
  background(255); noFill();
  for (let r = 1; r < 26; r++) {
    let thick = W(r * 4, {wave:'stepped sine', t:t*0.5, range:[0.5, 3], seed:r, frequency:1 + r*0.05});
    let bw = W(r * 3, {wave:'pulse', t:t*0.3, range:[0, 255], seed:r*7, frequency:0.8, phase: r*0.2});
    stroke(bw); strokeWeight(thick); ellipse(25, 25, r * 2, r * 2);
  }
};

FRAMES[14] = (t, fc) => {
  // Necker cube ambiguous wireframe
  background(20); stroke(0, 255, 200); strokeWeight(1); noFill();
  let angle = t * 0.6;
  let sz = W(25, {wave:'valleys', t:t*0.3, range:[7, 12], seed:14, frequency:0.5});
  push(); translate(25, 25);
  let s = sz, off = 5, dx = cos(angle) * off, dy = sin(angle) * off * 0.5;
  rect(-s/2, -s/2, s, s); rect(-s/2 + dx, -s/2 + dy, s, s);
  line(-s/2, -s/2, -s/2+dx, -s/2+dy); line(s/2, -s/2, s/2+dx, -s/2+dy);
  line(s/2, s/2, s/2+dx, s/2+dy); line(-s/2, s/2, -s/2+dx, s/2+dy);
  pop();
};

FRAMES[15] = (t, fc) => {
  // Zoetrope running horse
  background(245, 235, 210);
  let frame = floor(W(25, {wave:'steps', t:t*0.8, range:[0, 5.99], seed:15, frequency:0.7}));
  noStroke(); fill(40, 30, 20);
  push(); translate(25, 30);
  ellipse(0, -3, 18, 8); ellipse(10, -9, 6, 5);
  strokeWeight(1.5); stroke(40, 30, 20);
  let legPhases = [
    [[-5,-1,-7,8],[0,-1,2,8],[5,1,7,8],[8,1,4,8]],
    [[-5,1,-3,8],[0,-1,4,8],[5,-1,8,8],[8,1,6,8]],
    [[-5,1,-8,8],[0,1,0,8],[5,1,3,8],[8,-1,10,8]],
    [[-5,-1,-4,8],[0,1,-2,8],[5,-1,6,8],[8,1,3,8]],
    [[-5,1,-6,8],[0,-1,3,8],[5,1,9,8],[8,-1,5,8]],
    [[-5,-1,-5,8],[0,1,1,8],[5,1,5,8],[8,-1,7,8]],
  ];
  for (let leg of legPhases[constrain(frame, 0, 5)]) line(leg[0], 1, leg[2], leg[3]);
  let tailWag = W(25, {wave:'batman', t:t*2, range:[-3, 3], seed:77, frequency:2});
  noFill(); stroke(40, 30, 20); strokeWeight(1); line(-9, -3, -13, -6 + tailWag);
  pop();
  noStroke(); fill(40, 30, 20, 50);
  for (let i = 0; i < 5; i++) { rect(2 + i * 10, 1, 4, 3, 1); rect(2 + i * 10, 46, 4, 3, 1); }
};

FRAMES[16] = (t, fc) => {
  // Hermann grid illusion
  background(255); noStroke(); fill(0);
  let cellSz = W(25, {wave:'sine', t:t*0.2, range:[7, 9], seed:16, frequency:0.3});
  let gap = 3;
  for (let gx = 0; gx < 5; gx++) for (let gy = 0; gy < 5; gy++) rect(2 + gx * (cellSz + gap), 2 + gy * (cellSz + gap), cellSz, cellSz);
  fill(80, 80, 80, W(t*20, {wave:'up down pulse', t:t, range:[0, 40], seed:77, frequency:1.5}));
  for (let gx = 0; gx < 4; gx++) for (let gy = 0; gy < 4; gy++) ellipse(2 + gx * (cellSz + gap) + cellSz + gap/2, 2 + gy * (cellSz + gap) + cellSz + gap/2, 2.5, 2.5);
};

FRAMES[17] = (t, fc) => {
  // Wave-grid distortion
  background(0); noStroke();
  let grid = Waves.createGrid(10, 10, {waveRow:'sine', waveCol:'triangle', speed:t*0.5, threshold:0.5});
  for (let gy = 0; gy < 10; gy++) for (let gx = 0; gx < 10; gx++) {
    let val = grid[gy * 10 + gx];
    fill(val > 0 ? 255 : 0);
    let warp = W(gx * 5 + gy * 5, {wave:'bald patch', t:t, range:[-1, 1], seed:gx+gy*10, frequency:0.8});
    rect(gx * 5 + warp, gy * 5 + warp, 5, 5);
  }
};

FRAMES[18] = (t, fc) => {
  // Rotating hypnotic spiral
  background(0);
  push(); translate(25, 25); rotate(t * 0.8);
  noFill();
  for (let i = 0; i < 200; i++) {
    let a = i * 0.15, r = i * 0.12;
    stroke(map(sin(a + t), -1, 1, 50, 255)); strokeWeight(1.5);
    point(cos(a) * r, sin(a) * r);
  }
  pop();
};

FRAMES[19] = (t, fc) => {
  // Café wall illusion
  background(128);
  let shift = W(25, {wave:'saw up', t:t*0.3, range:[0, 10], seed:19, frequency:0.25});
  noStroke();
  for (let row = 0; row < 10; row++) {
    let offsetX = (row % 2 === 0) ? shift : -shift;
    let mortar = W(row * 5, {wave:'steps down', t:t*0.2, range:[0.8, 1.5], seed:row*9, frequency:0.5});
    fill(128); rect(0, row * 5, 50, mortar);
    for (let col = -1; col < 6; col++) {
      fill((col + row) % 2 === 0 ? 0 : 255);
      rect(col * 10 + offsetX, row * 5 + mortar, 10, 5 - mortar);
    }
  }
};

// ═══════════════════════════════════════
// ROW 2: Chromatic (20-29)
// ═══════════════════════════════════════

FRAMES[20] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); noStroke();
  for (let i = 0; i < 10; i++) {
    let x = i * 5;
    let baseHue = W(i / 10, {wave: 'sine', t: t, range: [0, 360], frequency: 0.3, seed: 1});
    let bright = W(i / 10, {wave: 'bumpy sine', t: t * 1.5, range: [50, 100], seed: 2});
    for (let y = 0; y < 50; y++) {
      let hShift = W(y / 50, {wave: 'triangle', t: t * 0.7, range: [-30, 30], seed: 3});
      fill((baseHue + hShift + y * 2) % 360, 80, bright); rect(x, y, 5, 1);
    }
  }
  colorMode(RGB);
};

FRAMES[21] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); background(0, 0, 10);
  let hue1 = W(0.5, {wave: 'ramp', t: t * 0.2, range: [0, 360], seed: 21});
  let hue2 = (hue1 + 180) % 360;
  let s1 = W(0.3, {wave: 'sine', t: t, range: [8, 22], seed: 22});
  let s2 = W(0.7, {wave: 'sine', t: t, range: [8, 22], seed: 23, phase: PI});
  noStroke();
  fill(hue1, 85, 95, 70); ellipse(18, 25, s1, s1);
  fill(hue2, 85, 95, 70); ellipse(32, 25, s2, s2);
  let blend = W(0.5, {wave: 'smooth solid sine', t: t * 1.3, range: [0, 1], seed: 24});
  fill(lerpColor(color(hue1, 85, 95), color(hue2, 85, 95), blend)); ellipse(25, 25, 8, 8);
  colorMode(RGB);
};

FRAMES[22] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); background(0, 0, 5);
  let baseAngle = W(0.5, {wave: 'saw up', t: t * 0.15, range: [0, TWO_PI], seed: 30});
  let baseHue = W(0.5, {wave: 'ramp', t: t * 0.25, range: [0, 360], seed: 31});
  noStroke();
  for (let i = 0; i < 3; i++) {
    let angle = baseAngle + i * TWO_PI / 3;
    let r = W(i / 3, {wave: 'sine', t: t, range: [10, 18], seed: 32 + i});
    fill((baseHue + i * 120) % 360, 90, 95, 80);
    ellipse(25 + cos(angle) * r, 25 + sin(angle) * r, 14, 14);
  }
  fill(0, 0, 100, 50); ellipse(25, 25, 5, 5);
  colorMode(RGB);
};

FRAMES[23] = (t, fc) => {
  background(0); blendMode(ADD);
  let offR = W(0.2, {wave: 'wobble sine', t: t, range: [-3, 3], seed: 40});
  let offB = W(0.8, {wave: 'wobble sine', t: t, range: [-3, 3], seed: 41, phase: PI});
  noFill(); strokeWeight(1.5);
  for (let i = 0; i < 5; i++) {
    let r = 6 + i * 5;
    let wave_r = W(i / 5, {wave: 'sine', t: t, range: [-2, 2], seed: 42});
    stroke(255, 0, 0, 180); ellipse(25 + offR, 25, r + wave_r, r + wave_r);
    stroke(0, 255, 0, 180); ellipse(25, 25, r + wave_r, r + wave_r);
    stroke(0, 0, 255, 180); ellipse(25 + offB, 25, r + wave_r, r + wave_r);
  }
  blendMode(BLEND);
};

FRAMES[24] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); background(0, 0, 8); noStroke();
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
    let idx = r * 6 + c;
    let h = W(idx / 36, {wave: 'classic sine', t: t * 0.8, range: [0, 360], seed: idx + 50});
    let b = W(idx / 36, {wave: 'sharp peaks', t: t * 1.2, range: [40, 100], seed: idx + 100});
    let sz = W(idx / 36, {wave: 'pulse', t: t, range: [4, 8], seed: idx + 150});
    fill(h, 80, b, 85);
    push(); translate(r * 8.3 + 5, c * 8.3 + 5);
    rotate(W(idx / 36, {wave: 'triangle', t: t * 0.5, range: [-0.3, 0.3], seed: idx + 200}));
    beginShape(); vertex(0, -sz/2); vertex(sz/2, 0); vertex(0, sz/2); vertex(-sz/2, 0); endShape(CLOSE);
    pop();
  }
  colorMode(RGB);
};

FRAMES[25] = (t, fc) => {
  background(0); blendMode(ADD); noStroke();
  let st = STATE[25];
  for (let i = 0; i < st.particles.length; i++) {
    let px = W(i / 12, {wave: 'sine', t: t * 0.6, range: [5, 45], seed: i * 7 + 60});
    let py = W(i / 12, {wave: 'sine', t: t * 0.5, range: [5, 45], seed: i * 7 + 70, phase: PI / 3});
    let ch = i % 3;
    let sz = W(i / 12, {wave: 'mountain peaks', t: t, range: [6, 16], seed: i + 80});
    fill(ch === 0 ? 200 : 40, ch === 1 ? 200 : 40, ch === 2 ? 200 : 40, 120);
    ellipse(px, py, sz, sz);
  }
  blendMode(BLEND);
};

FRAMES[26] = (t, fc) => {
  colorMode(HSB, 360, 100, 100); noStroke();
  let steps = 10, sz = 5;
  let h00 = W(0.0, {wave: 'sine', t: t * 0.3, range: [0, 90], seed: 260});
  let h10 = W(0.3, {wave: 'sine', t: t * 0.3, range: [90, 180], seed: 261});
  let h01 = W(0.6, {wave: 'sine', t: t * 0.3, range: [180, 270], seed: 262});
  let h11 = W(0.9, {wave: 'sine', t: t * 0.3, range: [270, 360], seed: 263});
  for (let r = 0; r < steps; r++) for (let c = 0; c < steps; c++) {
    let u = c / 9, v = r / 9;
    let h = lerp(lerp(h00, h10, u), lerp(h01, h11, u), v) % 360;
    let s = W((r * steps + c) / 100, {wave: 'valleys', t: t, range: [60, 100], seed: 265});
    fill(h, s, 95); rect(c * sz, r * sz, sz + 0.5, sz + 0.5);
  }
  colorMode(RGB);
};

FRAMES[27] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); noStroke();
  for (let y = 0; y < 50; y++) {
    let ny = y / 50;
    let distort = W(ny, {wave: 'zig-zag sine', t: t, range: [-5, 5], seed: 270});
    let hue = map(y + distort, 0, 50, 0, 240);
    let sat = W(ny, {wave: 'offset sine', t: t * 0.8, range: [60, 100], seed: 271});
    let bri = W(ny, {wave: 'half sine', t: t * 1.2, range: [70, 100], seed: 272});
    fill(constrain(hue, 0, 240), sat, bri); rect(0, y, 50, 1);
  }
  let hy = W(0.5, {wave: 'sine', t: t * 0.4, range: [5, 45], seed: 273});
  fill(0, 0, 100, 40); ellipse(25, hy, 20, 6);
  colorMode(RGB);
};

FRAMES[28] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); background(0, 0, 5); noFill();
  for (let i = 0; i < 8; i++) {
    let r = W(i / 8, {wave: 'stepped sine', t: t * 0.7, range: [4, 24], seed: 280 + i});
    let h = (i * 45 + t * 40) % 360;
    let alpha = W(i / 8, {wave: 'sine', t: t * 1.5, range: [30, 90], seed: 290 + i});
    strokeWeight(3); stroke(h, 90, 100, alpha); ellipse(25, 25, r * 2, r * 2);
    strokeWeight(6); stroke(h, 70, 100, alpha * 0.3); ellipse(25, 25, r * 2, r * 2);
  }
  colorMode(RGB);
};

FRAMES[29] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); background(0, 0, 10); noStroke();
  let baseH = W(0.5, {wave: 'ramp', t: t * 0.15, range: [0, 360], seed: 300});
  let hues = [baseH, (baseH + 150) % 360, (baseH + 210) % 360];
  let sz = 10;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
    let idx = r * 5 + c;
    let bri = W(idx / 25, {wave: 'batman', t: t, range: [50, 100], seed: 301 + idx});
    let sat = W(idx / 25, {wave: 'squared sine', t: t * 0.8, range: [50, 100], seed: 330 + idx});
    fill(hues[idx % 3], sat, bri, 90);
    let pad = W(idx / 25, {wave: 'sine', t: t * 1.3, range: [0.5, 2], seed: 360 + idx});
    rect(c * sz + pad, r * sz + pad, sz - pad * 2, sz - pad * 2, 2);
  }
  colorMode(RGB);
};

// ═══════════════════════════════════════
// ROW 3: Wave Showcase (30-39)
// ═══════════════════════════════════════

FRAMES[30] = (t, fc) => {
  colorMode(HSB, 360, 100, 100); noStroke();
  let res = 10, sz = 5;
  for (let r = 0; r < res; r++) for (let c = 0; c < res; c++) {
    let val = W((r * res + c) / 100, {wave: 'noise', t: t * 0.3, range: [0, 1], seed: 400 + r * 10 + c, frequency: 2});
    fill(map(val, 0, 1, 120, 30), 70, map(val, 0, 1, 40, 100));
    rect(c * sz, r * sz, sz + 0.5, sz + 0.5);
  }
  colorMode(RGB);
};

FRAMES[31] = (t, fc) => {
  colorMode(HSB, 360, 100, 100); background(220, 80, 15); noStroke();
  let grid = 7, sz = 50 / grid;
  for (let r = 0; r < grid; r++) for (let c = 0; c < grid; c++) {
    let idx = r * grid + c;
    let v = W(idx / 49, {wave: 'square', t: t * 0.5, range: [0, 1], seed: 500 + idx, frequency: 0.8 + idx * 0.05});
    fill(v > 0.5 ? color(140, 90, 90) : color(220, 60, 25));
    rect(c * sz + 1, r * sz + 1, sz - 2, sz - 2, 1);
  }
  colorMode(RGB);
};

FRAMES[32] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); background(0, 0, 5);
  let rays = 20; strokeWeight(1.5);
  for (let i = 0; i < rays; i++) {
    let angle = (i / rays) * TWO_PI;
    let len = W(i / rays, {wave: 'sharp peaks', t: t, range: [5, 23], seed: 600 + i, frequency: 1.5});
    let h = (i / rays * 360 + t * 30) % 360;
    stroke(h, 80, 100, 80); line(25, 25, 25 + cos(angle) * len, 25 + sin(angle) * len);
    noStroke(); fill(h, 50, 100, 90);
    ellipse(25 + cos(angle) * len, 25 + sin(angle) * len, 2.5, 2.5);
  }
  colorMode(RGB);
};

FRAMES[33] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); background(220, 60, 20); noStroke();
  for (let l = 0; l < 5; l++) {
    let depth = l / 5;
    fill(lerp(260, 200, depth), 50, lerp(15, 50, depth), 90);
    beginShape(); vertex(0, 50);
    for (let x = 0; x <= 50; x += 2) vertex(x, W(x / 50, {wave: 'mountain peaks', t: t * (0.2 + l * 0.1), range: [15 + l * 6, 30 + l * 4], seed: 700 + l * 50, frequency: 1 + l * 0.5}));
    vertex(50, 50); endShape(CLOSE);
  }
  colorMode(RGB);
};

FRAMES[34] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); background(0, 0, 5); strokeWeight(0.8);
  for (let i = 0; i < 15; i++) {
    let y1 = W(i / 15, {wave: 'saw up', t: t * 0.6, range: [0, 50], seed: 800 + i, frequency: 1.2});
    let y2 = W(i / 15, {wave: 'saw down', t: t * 0.6, range: [0, 50], seed: 850 + i, frequency: 1.2});
    stroke((i * 24 + t * 20) % 360, 80, 90, 70); noFill();
    beginShape();
    for (let x = 0; x <= 50; x += 2) vertex(x, lerp(y1, y2, x / 50) + sin(x * 0.3 + t + i) * 3);
    endShape();
  }
  colorMode(RGB);
};

FRAMES[35] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); background(280, 40, 8); noStroke();
  let st = STATE[35];
  for (let i = 0; i < st.pts.length; i++) {
    let p = st.pts[i];
    let sz = W(i / 40, {wave: 'grow random', t: t * p.s, range: [1, 7], seed: 900 + i});
    let h = W(i / 40, {wave: 'sine', t: t * 0.4, range: [180, 320], seed: 950 + i});
    let alpha = W(i / 40, {wave: 'fade out', t: t * 0.3 + i * 0.1, range: [30, 95], seed: 970 + i});
    fill(h, 70, 90, alpha); ellipse((p.x + t * 3 * p.s) % 50, p.y, sz, sz);
  }
  colorMode(RGB);
};

FRAMES[36] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); background(160, 30, 8);
  stroke(140, 90, 95, 90); strokeWeight(1.5); noFill();
  beginShape();
  for (let x = 0; x <= 50; x++) vertex(x, W(x / 50, {wave: 'fuzzy pulse', t: t * 0.8, range: [15, 35], seed: 1000, frequency: 2}));
  endShape();
  stroke(140, 70, 80, 30); strokeWeight(4); noFill();
  beginShape();
  for (let x = 0; x <= 50; x++) vertex(x, W(x / 50, {wave: 'fuzzy pulse', t: t * 0.8, range: [15, 35], seed: 1000, frequency: 2}));
  endShape();
  let scanX = (t * 20) % 50;
  stroke(140, 100, 100, 60); strokeWeight(1); line(scanX, 0, scanX, 50);
  colorMode(RGB);
};

FRAMES[37] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); background(30, 20, 10); noFill(); strokeWeight(1.2);
  for (let row = 0; row < 5; row++) for (let col = 0; col < 5; col++) {
    let idx = row * 5 + col;
    let r = W(idx / 25, {wave: 'round linked sine', t: t * 0.7, range: [3, 6], seed: 1100 + idx});
    stroke((idx * 14 + t * 25) % 360, 70, 90, 80);
    ellipse(col * 10 + 5, row * 10 + 5, r * 2, r * 2);
  }
  colorMode(RGB);
};

FRAMES[38] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); background(0, 0, 3); noFill();
  let st = STATE[38];
  for (let i = 0; i < st.rings.length; i++) {
    let ring = st.rings[i];
    let r = W(i / 6, {wave: 'ramp up sine', t: t * 0.5 + ring.phase, range: [2, 24], seed: 1200 + i});
    let alpha = map(r, 2, 24, 90, 10);
    stroke((i * 60 + t * 15) % 360, 80, 95, alpha); strokeWeight(map(r, 2, 24, 2.5, 0.5));
    ellipse(25, 25, r * 2, r * 2);
  }
  colorMode(RGB);
};

FRAMES[39] = (t, fc) => {
  colorMode(HSB, 360, 100, 100, 100); background(0, 0, 5); noStroke();
  let res = 10, sz = 5;
  for (let r = 0; r < res; r++) for (let c = 0; c < res; c++) {
    let idx = r * res + c;
    let v1 = W(idx / 100, {wave: 'meta sine', t: t * 0.4, range: [0, 1], seed: 1300 + idx, frequency: 1.5});
    let v2 = W(idx / 100, {wave: 'triangle sine', t: t * 0.6, range: [0, 1], seed: 1400 + idx, frequency: 1.2});
    let v = lerp(v1, v2, (sin(t * 0.8) + 1) / 2);
    fill(map(v, 0, 1, 200, 360) % 360, map(v, 0, 1, 40, 90), map(v, 0, 1, 30, 100), 85);
    rect(c * sz, r * sz, sz + 0.5, sz + 0.5);
  }
  colorMode(RGB);
};

// ═══════════════════════════════════════
// ROW 4: Textile & Pattern (40-49)
// ═══════════════════════════════════════

FRAMES[40] = (t, fc) => {
  background(30, 25, 20);
  let spacing = W(t, {wave:'stepped sine', t:t, range:[4,7], seed:40, frequency:0.3});
  for (let y = 0; y < 50; y += spacing) {
    let warpShift = W(y, {wave:'sine', t:t, range:[-1,1], seed:401, frequency:0.8});
    stroke(180, 140, 90, 200); strokeWeight(spacing * 0.4); line(0, y + warpShift, 50, y - warpShift);
  }
  for (let x = 0; x < 50; x += spacing) {
    let weftShift = W(x, {wave:'sine', t:t, range:[-1,1], seed:402, frequency:0.6});
    let over = W(x + t * 10, {wave:'square', t:t, range:[0,1], seed:403, frequency:1.2});
    stroke(140, 90, 60, over > 0.5 ? 220 : 120); strokeWeight(spacing * 0.35);
    line(x + weftShift, 0, x - weftShift, 50);
  }
};

FRAMES[41] = (t, fc) => {
  background(220, 200, 190); noFill();
  for (let row = 0; row < 50; row += 8) for (let col = 0; col < 50; col += 6) {
    let wobble = W(row + col, {wave:'wobble sine', t:t, range:[-0.5,0.5], seed:41, frequency:0.5});
    let hue = W(col + row * 0.5, {wave:'sine', t:t, range:[0,40], seed:411, frequency:0.3});
    stroke(180 + hue, 80 + hue * 0.5, 90, 200); strokeWeight(1.2);
    let cx = col + 3, cy = row + 4 + wobble;
    beginShape(); vertex(cx - 2, cy - 3); bezierVertex(cx - 3, cy, cx - 1, cy + 1, cx, cy + 3); endShape();
    beginShape(); vertex(cx + 2, cy - 3); bezierVertex(cx + 3, cy, cx + 1, cy + 1, cx, cy + 3); endShape();
  }
};

FRAMES[42] = (t, fc) => {
  background(20, 40, 30);
  let bands = [{c:[180,30,30,90],w:8},{c:[30,80,30,70],w:12},{c:[200,180,40,50],w:3},{c:[30,30,120,80],w:6}];
  blendMode(ADD);
  let shift = W(t, {wave:'sine', t:t, range:[-2,2], seed:42, frequency:0.2});
  let idx = 0;
  for (let pos = -10; pos < 60; ) {
    let b = bands[idx % bands.length];
    let bw = b.w + W(pos, {wave:'stepped sine', t:t, range:[-1,1], seed:421, frequency:0.4});
    noStroke(); fill(b.c[0], b.c[1], b.c[2], b.c[3]); rect(pos + shift, 0, bw, 50);
    fill(b.c[0], b.c[1], b.c[2], b.c[3] * 0.7); rect(0, pos + shift, 50, bw);
    pos += bw; idx++;
  }
  blendMode(BLEND);
};

FRAMES[43] = (t, fc) => {
  background(240);
  let sz = W(t, {wave:'sine', t:t, range:[6,10], seed:43, frequency:0.25});
  for (let y = -sz; y < 55; y += sz) for (let x = -sz; x < 55; x += sz) {
    let gx = Math.floor((x + sz) / sz), gy = Math.floor((y + sz) / sz);
    let dark = (gx + gy) % 2 === 0;
    let rot = W(gx + gy * 10, {wave:'sine', t:t, range:[-0.05,0.05], seed:431, frequency:0.4});
    push(); translate(x + sz/2, y + sz/2); rotate(rot);
    if (dark) { fill(20); noStroke(); beginShape(); vertex(-sz/2, -sz/2); vertex(0, -sz/2); vertex(sz/2, 0); vertex(sz/2, sz/2); vertex(0, sz/2); vertex(-sz/2, 0); endShape(CLOSE); }
    else { fill(240); noStroke(); rect(-sz/2, -sz/2, sz, sz); fill(20); triangle(-sz/2, -sz/2, 0, -sz/2, -sz/2, 0); triangle(sz/2, sz/2, 0, sz/2, sz/2, 0); }
    pop();
  }
};

FRAMES[44] = (t, fc) => {
  background(250, 245, 240); noFill(); stroke(180, 160, 140, 150); strokeWeight(0.5);
  for (let i = 0; i < 12; i++) {
    let cx = W(i, {wave:'noise', t:t, range:[5,45], seed:44, frequency:0.3});
    let cy = W(i + 50, {wave:'noise', t:t, range:[5,45], seed:441, frequency:0.3});
    let r = W(i * 3, {wave:'sine', t:t, range:[4,12], seed:442, frequency:0.5});
    for (let p = 0; p < 6; p++) { let a = (p / 6) * TWO_PI + t * 0.3; ellipse(cx + cos(a) * r, cy + sin(a) * r, r * 0.8, r * 0.8); }
    ellipse(cx, cy, r * 0.5, r * 0.5);
  }
  stroke(200, 180, 160, 80);
  for (let y = 0; y < 50; y += 4) {
    let amp = W(y, {wave:'bumpy sine', t:t, range:[0,3], seed:443, frequency:0.7});
    beginShape(); for (let x = 0; x < 50; x += 2) vertex(x, y + sin(x * 0.5 + t) * amp); endShape();
  }
};

FRAMES[45] = (t, fc) => {
  background(240, 230, 210);
  stroke(220, 210, 190); strokeWeight(0.3);
  for (let y = 0; y < 50; y += 2) line(0, y, 50, y);
  for (let x = 0; x < 50; x += 2) line(x, 0, x, 50);
  let petalR = W(t, {wave:'sine', t:t, range:[8,12], seed:45, frequency:0.3});
  strokeWeight(1.8); strokeCap(ROUND);
  for (let p = 0; p < 8; p++) {
    let a = (p / 8) * TWO_PI + W(p, {wave:'sine', t:t, range:[-0.2,0.2], seed:451, frequency:0.5});
    let col = W(p, {wave:'sine', t:t, range:[0,1], seed:452, frequency:0.4});
    stroke(lerpColor(color(200, 50, 80), color(220, 120, 50), col));
    let px = 25 + cos(a) * petalR, py = 25 + sin(a) * petalR;
    for (let s = -2; s <= 2; s += 0.8) { let na = a + HALF_PI; line(25 + cos(a)*3 + cos(na)*s, 25 + sin(a)*3 + sin(na)*s, px + cos(na)*s, py + sin(na)*s); }
  }
  fill(220, 180, 50); noStroke();
  for (let k = 0; k < 5; k++) { let ka = k * 1.2 + t; ellipse(25 + cos(ka)*1.5, 25 + sin(ka)*1.5, 2, 2); }
};

FRAMES[46] = (t, fc) => {
  let patchSz = 12.5;
  let colors = [[70,100,140],[140,60,60],[180,160,100],[60,120,80],[160,120,160],[120,80,50]];
  for (let gy = 0; gy < 4; gy++) for (let gx = 0; gx < 4; gx++) {
    let idx = Math.abs(Math.floor(W(gx + gy * 4, {wave:'steps', t:t, range:[0,5.99], seed:46, frequency:0.15})));
    let c = colors[idx % colors.length];
    let puff = W(gx + gy * 4, {wave:'sine', t:t, range:[0,3], seed:461, frequency:0.4});
    fill(c[0]+puff*5, c[1]+puff*5, c[2]+puff*5); stroke(c[0]-30, c[1]-30, c[2]-30, 100); strokeWeight(0.8);
    rect(gx*patchSz+0.5, gy*patchSz+0.5, patchSz-1, patchSz-1, 1);
    stroke(255, 255, 255, 60); strokeWeight(0.4); noFill();
    for (let d = 2; d < patchSz-2; d += 3) { line(gx*patchSz+d, gy*patchSz+1, gx*patchSz+1, gy*patchSz+d); }
  }
};

FRAMES[47] = (t, fc) => {
  background(230, 220, 200);
  stroke(210, 200, 180); strokeWeight(0.3);
  for (let x = 0; x <= 50; x += 5) line(x, 0, x, 50);
  for (let y = 0; y <= 50; y += 5) line(0, y, 50, y);
  strokeCap(ROUND); strokeWeight(1.2);
  let heartMap = [[0,1,1,0,0,0,1,1,0,0],[1,1,1,1,0,1,1,1,1,0],[1,1,1,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,1,0,0],[0,0,1,1,1,1,1,0,0,0],[0,0,0,1,1,1,0,0,0,0],[0,0,0,0,1,0,0,0,0,0]];
  for (let r = 0; r < heartMap.length; r++) for (let c = 0; c < heartMap[r].length; c++) {
    if (heartMap[r][c]) {
      let px = c * 5 + 1, py = (r + 1.5) * 5 + 1;
      let bright = W(c + r * 10, {wave:'sine', t:t, range:[0.7,1], seed:47, frequency:0.5});
      stroke(200 * bright, 40 * bright, 60 * bright);
      line(px, py, px + 3, py + 3); line(px + 3, py, px, py + 3);
    }
  }
};

FRAMES[48] = (t, fc) => {
  background(35, 30, 50); noStroke();
  for (let x = 0; x < 50; x += 5) {
    let bandIdx = x / 5;
    let hueShift = W(bandIdx, {wave:'steps', t:t, range:[0,3], seed:48, frequency:0.2});
    let colors = [[50,40,100],[150,50,50],[200,170,60],[40,100,120]];
    let c = colors[Math.floor(abs(hueShift)) % colors.length];
    for (let y = 0; y < 50; y += 2) {
      let bleed = W(y + bandIdx * 7, {wave:'noise', t:t, range:[-2,2], seed:481, frequency:0.8});
      let feather = W(y * 3 + x, {wave:'fuzzy peak sine', t:t, range:[0.6,1], seed:482, frequency:0.6});
      fill(c[0]*feather, c[1]*feather, c[2]*feather, 220);
      rect(x + bleed, y, 5 - abs(bleed) * 0.5, 2.5);
    }
  }
};

FRAMES[49] = (t, fc) => {
  background(25, 45, 70);
  stroke(180, 160, 120, 40); strokeWeight(0.3);
  for (let i = 0; i < 20; i++) {
    let x1 = W(i, {wave:'noise', t:t*0.1, range:[0,50], seed:49, frequency:0.5});
    let y1 = W(i+30, {wave:'noise', t:t*0.1, range:[0,50], seed:491, frequency:0.5});
    line(x1, y1, x1 + W(i*2, {wave:'noise', t:t*0.1, range:[-15,15], seed:492, frequency:0.8}), y1 + W(i*3, {wave:'noise', t:t*0.1, range:[-15,15], seed:493, frequency:0.8}));
  }
  noStroke();
  for (let cy = 8; cy < 50; cy += 16) for (let cx = 8; cx < 50; cx += 16) {
    let rad = W(cx+cy, {wave:'sine', t:t, range:[3,6], seed:494, frequency:0.35});
    let dye = W(cx*cy, {wave:'sine', t:t, range:[0,1], seed:495, frequency:0.3});
    fill(lerpColor(color(30, 60, 100), color(160, 120, 40), dye));
    for (let a = 0; a < TWO_PI; a += 0.3) { let r = rad * (a / TWO_PI); ellipse(cx + cos(a+t*0.5)*r, cy + sin(a+t*0.5)*r, 1.5, 1.5); }
    fill(180, 160, 100, 100); ellipse(cx, cy, 2, 2);
  }
};

// ═══════════════════════════════════════
// ROW 5: Fluid & Flow (50-59)
// ═══════════════════════════════════════

FRAMES[50] = (t, fc) => {
  stroke(120, 180, 220, 80); strokeWeight(0.8); noFill();
  for (let y = 0; y < 50; y += 5) for (let x = 0; x < 50; x += 5) {
    let angle = W(x*0.1+y*0.1, {wave:'noise', t:t, range:[0, TWO_PI], seed:50, frequency:0.4});
    let len = W(x+y, {wave:'sine', t:t, range:[3,7], seed:501, frequency:0.6});
    let speed = W(x*y*0.01, {wave:'sine', t:t, range:[0.3,1], seed:502, frequency:0.5});
    stroke(80+speed*100, 150+speed*50, 220, 60+speed*80);
    line(x, y, x+cos(angle)*len, y+sin(angle)*len);
  }
};

FRAMES[51] = (t, fc) => {
  background(5, 5, 10, 50); noStroke();
  for (let i = 0; i < 30; i++) {
    let baseY = W(i, {wave:'ramp', t:t, range:[55, -10], seed:51, frequency:0.15 + i * 0.005});
    let drift = W(i+baseY, {wave:'noise', t:t, range:[-8, 8], seed:511, frequency:0.3});
    let cx = 25 + drift + W(i, {wave:'sine', t:t, range:[-5,5], seed:512, frequency:0.4});
    let sz = W(i+baseY*0.5, {wave:'sine', t:t, range:[2,10], seed:513, frequency:0.3});
    fill(180, 180, 200, max(0, map(baseY, 55, -10, 60, 5)));
    ellipse(cx, baseY, sz, sz * 1.3);
  }
};

FRAMES[52] = (t, fc) => {
  background(20, 50, 80); noFill();
  for (let r = 2; r < 35; r += 2.5) {
    let ripplePhase = W(r, {wave:'sine', t:t, range:[-1,1], seed:52, frequency:0.8});
    let wobble = W(r*5, {wave:'noise', t:t, range:[-0.5,0.5], seed:521, frequency:0.5});
    stroke(100+ripplePhase*40, 160+ripplePhase*30, 220, map(r, 2, 35, 180, 20));
    strokeWeight(0.8+ripplePhase*0.3); ellipse(25+wobble, 25+wobble, r*2, r*2);
  }
  noStroke(); fill(200, 230, 255, 40);
  ellipse(W(t, {wave:'sine', t:t, range:[15,35], seed:522, frequency:0.6}), W(t, {wave:'sine', t:t, range:[15,35], seed:523, frequency:0.45}), 4, 2);
};

FRAMES[53] = (t, fc) => {
  background(240, 238, 230, 30); noStroke();
  for (let i = 0; i < 15; i++) {
    let age = W(i, {wave:'ramp', t:t, range:[0,1], seed:53, frequency:0.1 + i * 0.002});
    let cx = 25 + W(i*7, {wave:'noise', t:t, range:[-15,15], seed:531, frequency:0.2});
    let cy = 25 + W(i*11, {wave:'noise', t:t, range:[-15,15], seed:532, frequency:0.2});
    let spread = age * 18;
    for (let j = 0; j < 8; j++) {
      let a = (j/8)*TWO_PI + W(j+i, {wave:'noise', t:t, range:[-1,1], seed:533, frequency:0.5});
      let r = spread * W(j+i*3, {wave:'noise', t:t, range:[0.3,1], seed:534, frequency:0.4});
      let sz = W(j*i, {wave:'sine', t:t, range:[2,6], seed:535, frequency:0.3}) * age;
      fill(20, 10, 40, 30 * (1 - age * 0.5)); ellipse(cx+cos(a)*r, cy+sin(a)*r, sz, sz);
    }
  }
};

FRAMES[54] = (t, fc) => {
  noStroke();
  let colors = [[220,60,80],[60,130,200],[240,200,50],[200,100,180],[40,180,140]];
  for (let y = 0; y < 50; y += 1.5) for (let ci = 0; ci < colors.length; ci++) {
    let xOff = W(y+ci*20, {wave:'noise', t:t, range:[-5, 55], seed:54+ci, frequency:0.25});
    let w = W(y*ci, {wave:'sine', t:t, range:[3, 12], seed:541+ci, frequency:0.3});
    let c = colors[ci]; fill(c[0], c[1], c[2], 180); ellipse(xOff, y, w, 2.5);
  }
};

FRAMES[55] = (t, fc) => {
  background(40, 10, 30); noStroke();
  fill(60, 15, 40, 30); rect(5, 0, 40, 50, 15);
  for (let i = 0; i < 5; i++) {
    let by = W(i, {wave:'sine', t:t, range:[5,45], seed:55+i, frequency:0.12+i*0.02});
    let bx = 25 + W(i*5, {wave:'sine', t:t, range:[-8,8], seed:551, frequency:0.18});
    let sz = W(i+t, {wave:'sine', t:t, range:[6,14], seed:552, frequency:0.2});
    let stretch = W(by+i, {wave:'sine', t:t, range:[0.7,1.4], seed:553, frequency:0.3});
    let warm = W(i*3, {wave:'sine', t:t, range:[0,1], seed:554, frequency:0.15});
    fill(lerpColor(color(220, 60, 20, 180), color(250, 180, 30, 160), warm));
    ellipse(bx, by, sz, sz * stretch);
    fill(lerpColor(color(220, 60, 20, 30), color(250, 180, 30, 20), warm));
    ellipse(bx, by, sz * 1.8, sz * stretch * 1.8);
  }
};

FRAMES[56] = (t, fc) => {
  background(230, 225, 215); noStroke();
  for (let i = 0; i < 6; i++) {
    let x = 5 + i * 8;
    let dripLen = W(i, {wave:'ramp up sine', t:t, range:[0, 40], seed:56+i, frequency:0.15});
    let thick = W(i*3, {wave:'sine', t:t, range:[3, 6], seed:561, frequency:0.3});
    let colors = [[180,40,40],[40,100,180],[50,150,70],[180,140,40],[140,60,160]];
    let c = colors[i % colors.length]; fill(c[0], c[1], c[2], 210);
    ellipse(x + thick/2, 3, thick + 2, 5); rect(x, 2, thick, dripLen, 0, 0, thick/2, thick/2);
    let bulge = W(i+t, {wave:'sine', t:t, range:[1,2.5], seed:563, frequency:0.5});
    ellipse(x + thick/2, 2 + dripLen, thick * bulge, thick * bulge * 1.2);
  }
};

FRAMES[57] = (t, fc) => {
  background(30, 10, 5); noStroke();
  let cells = 4, sz = 12.5;
  for (let gy = 0; gy < cells; gy++) for (let gx = 0; gx < cells; gx++) {
    let cx = gx*sz+sz/2, cy = gy*sz+sz/2;
    let heat = W(gx+gy*cells, {wave:'sine', t:t, range:[0,1], seed:57, frequency:0.3});
    for (let a = 0; a < TWO_PI; a += 0.4) {
      let r = W(a+gx+gy, {wave:'sine', t:t, range:[2, sz*0.4], seed:571, frequency:0.5});
      let temp = heat * (1 - r / (sz * 0.5));
      fill(200+temp*55, 80*temp, 10, 100+temp*100);
      ellipse(cx+cos(a+t*0.8)*r, cy+sin(a+t*0.8)*r, 1.5, 1.5);
    }
    fill(255, 200, 50, heat * 60); ellipse(cx, cy, 4, 4);
  }
};

FRAMES[58] = (t, fc) => {
  background(15, 30, 60); strokeWeight(1); noFill();
  for (let i = 0; i < 25; i++) {
    let startY = W(i, {wave:'noise', t:t*0.3, range:[0,50], seed:58, frequency:0.3});
    let speed = W(i*7, {wave:'sine', t:t, range:[0.5,2], seed:581, frequency:0.2});
    let curl = W(i*3, {wave:'noise', t:t, range:[-0.08,0.08], seed:582, frequency:0.4});
    let depth = W(startY, {wave:'sine', t:t, range:[0,1], seed:583, frequency:0.3});
    stroke(40+depth*80, 100+depth*80, 180+depth*50, 60+depth*80);
    beginShape();
    let cy = startY;
    for (let x = 0; x < 50; x += 2) { cy += curl + W(x+i*10, {wave:'sine', t:t, range:[-0.5,0.5], seed:584, frequency:0.7}); curveVertex(x-(t*speed*10)%50+50, cy); }
    endShape();
  }
};

FRAMES[59] = (t, fc) => {
  background(10, 20, 50, 60); noFill();
  for (let i = 0; i < 20; i++) {
    let startAngle = (i/20)*TWO_PI + t*0.5;
    let spiralSpeed = W(i, {wave:'sine', t:t, range:[0.3,0.8], seed:59, frequency:0.3});
    let depth = W(i*5, {wave:'sine', t:t, range:[0.5,1], seed:591, frequency:0.4});
    stroke(60+depth*100, 120+depth*60, 200+depth*40, 40+depth*100); strokeWeight(0.6+depth*0.5);
    beginShape();
    for (let s = 0; s < 60; s++) {
      let angle = startAngle + s * 0.15 * spiralSpeed, r = 22 - s * 0.35;
      if (r < 1) break;
      let wobble = W(s+i*3, {wave:'noise', t:t, range:[-1,1], seed:592, frequency:0.6});
      curveVertex(25+cos(angle)*(r+wobble), 25+sin(angle)*(r+wobble));
    }
    endShape();
  }
  noStroke(); fill(5, 10, 30, 200); ellipse(25, 25, 5, 5);
};

// ═══════════════════════════════════════
// ROW 6: Glitch & Digital (60-69)
// ═══════════════════════════════════════

FRAMES[60] = (t, fc) => {
  let intensity = W(25, {wave:'ramp up sine', t:t, range:[0,1], frequency:0.3});
  let sortLine = W(25, {wave:'saw up', t:t, range:[0,50], frequency:0.7});
  background(0); noStroke();
  for (let y = 0; y < 50; y += 2) {
    let hue = W(y, {wave:'sine', t:t, range:[0,360], seed:60, frequency:0.5});
    let bright = W(y, {wave:'sharp peaks', t:t, range:[40,255], seed:61});
    let xOff = abs(y - sortLine) < 15 * intensity ? W(y, {wave:'noise', t:t, range:[-20, 20], seed:62, frequency:2}) * intensity : 0;
    colorMode(HSB, 360, 255, 255); fill(hue, 200, bright);
    rect(xOff, y, 50 - abs(xOff) * 0.5, 2);
  }
  colorMode(RGB);
  let tearY = W(0, {wave:'fuzzy pulse', t:t, range:[0,50], frequency:1.2, seed:63});
  fill(255, 0, 100, 180); rect(0, tearY, 50, intensity * 8);
};

FRAMES[61] = (t, fc) => {
  background(0);
  let corruptAmount = W(25, {wave:'wobble sine', t:t, range:[0,1], frequency:0.4});
  noStroke();
  for (let gx = 0; gx < 10; gx++) for (let gy = 0; gy < 10; gy++) {
    let idx = gx + gy * 10;
    let val = W(idx, {wave:'noise', t:t, range:[0,255], seed:64+idx, frequency:0.8});
    let corrupt = W(idx, {wave:'fuzzy pulse', t:t*2, range:[0,1], seed:65, frequency:1.5});
    if (corrupt > (1-corruptAmount)) { fill(W(idx, {wave:'square', t:t*3, range:[0,255], seed:66}), W(idx, {wave:'pulse', t:t*2.7, range:[0,255], seed:67}), 50); }
    else fill(val);
    rect(gx*5, gy*5, 5, 5);
  }
  let scanY = W(0, {wave:'saw up', t:t, range:[0,50], frequency:0.6});
  stroke(255, 0, 0, 150*corruptAmount); strokeWeight(1); line(0, scanY, 50, scanY);
};

FRAMES[62] = (t, fc) => {
  background(10, 5, 20);
  let tracking = W(25, {wave:'bumpy sine', t:t, range:[-8, 8], frequency:0.25});
  let rollSpeed = W(25, {wave:'stepped sine', t:t, range:[0.5, 3], frequency:0.15});
  noStroke();
  let colors = [[255,255,255],[255,255,0],[0,255,255],[0,255,0],[255,0,255],[255,0,0],[0,0,255]];
  let barW = 50/7;
  for (let i = 0; i < 7; i++) { fill(colors[i][0], colors[i][1], colors[i][2]); rect(i*barW+((i%2===0)?tracking:-tracking*0.5), 0, barW+1, 50); }
  stroke(0, 0, 0, 80); strokeWeight(1);
  for (let y = 0; y < 50; y += 2) line(0, y, 50, y);
  let barY = (t * rollSpeed * 30) % 70 - 10;
  noStroke(); fill(0, 0, 0, 200);
  let barH = W(0, {wave:'noise', t:t, range:[3, 12], seed:70, frequency:2});
  rect(0, barY, 50, barH);
  for (let px = 0; px < 50; px += 2) { fill(W(px, {wave:'noise', t:t*5, range:[0,255], seed:71+px, frequency:5})); rect(px, barY+random(barH), 2, 1); }
};

FRAMES[63] = (t, fc) => {
  background(0);
  let splitAmt = W(25, {wave:'sharp peaks', t:t, range:[0, 8], frequency:0.5});
  blendMode(ADD); noStroke();
  fill(255, 0, 0, 180); ellipse(25 - splitAmt, 25, 30, 30);
  fill(0, 255, 0, 180);
  let ySplit = W(25, {wave:'sine', t:t*1.3, range:[-4, 4], frequency:0.5, seed:80});
  ellipse(25, 25 + ySplit, 30, 30);
  fill(0, 0, 255, 180); ellipse(25 + splitAmt, 25, 30, 30);
  blendMode(BLEND);
};

FRAMES[64] = (t, fc) => {
  background(0, 10, 0, 40); fill(0, 255, 70); noStroke();
  textSize(7); textAlign(CENTER, CENTER); textFont('monospace');
  for (let c = 0; c < 7; c++) {
    let speed = W(c, {wave:'noise', t:0, range:[20, 50], seed:90+c, frequency:0.1});
    let dropY = (t * speed + c * 13) % 65 - 10;
    for (let i = 0; i < 8; i++) {
      let cy = dropY - i * 7;
      if (cy < 0 || cy > 50) continue;
      let alpha = map(i, 0, 7, 255, 0);
      let charCode = floor(W(c*8+i, {wave:'noise', t:t*2, range:[33, 126], seed:100+c*8+i, frequency:3}));
      if (i === 0) fill(180, 255, 180, 255); else fill(0, alpha, 0, alpha);
      text(String.fromCharCode(charCode), c * 7 + 4, cy);
    }
  }
};

FRAMES[65] = (t, fc) => {
  background(0); noStroke();
  let curvature = W(25, {wave:'sine', t:t, range:[0.002, 0.008], frequency:0.2});
  for (let y = 0; y < 50; y += 2) for (let x = 0; x < 50; x += 2) {
    let dx = (x-25)*(1+curvature*(y-25)*(y-25));
    let dy = (y-25)*(1+curvature*(x-25)*(x-25));
    let sx = dx+25, sy = dy+25;
    if (sx < 0 || sx > 50 || sy < 0 || sy > 50) continue;
    let val = W(sy*50+sx, {wave:'sine', t:t, range:[30,200], seed:110, frequency:0.3});
    let subPx = x % 6;
    if (subPx < 2) fill(val, 0, 0); else if (subPx < 4) fill(0, val, 0); else fill(0, 0, val);
    rect(x, y, 2, 2);
  }
  stroke(255, 255, 255, 30); strokeWeight(1); line(0, (t*25)%50, 50, (t*25)%50);
  noStroke(); fill(0, 0, 0, 120); ellipse(0, 0, 30, 30); ellipse(50, 0, 30, 30); ellipse(0, 50, 30, 30); ellipse(50, 50, 30, 30);
};

FRAMES[66] = (t, fc) => {
  background(0); noStroke();
  let bitShift = floor(W(25, {wave:'steps', t:t, range:[0, 7], frequency:0.3}));
  let opType = floor(W(25, {wave:'steps down', t:t, range:[0, 3], frequency:0.15}));
  for (let y = 0; y < 50; y += 5) for (let x = 0; x < 50; x += 5) {
    let ix = floor(x/5), iy = floor(y/5);
    let a = ix*25+floor(W(iy, {wave:'ramp', t:t, range:[0,255], seed:120}));
    let b = iy*25+floor(W(ix, {wave:'saw up', t:t*0.7, range:[0,255], seed:121}));
    let result;
    if (opType===0) result=(a^b)&255; else if(opType===1) result=(a&b)<<bitShift&255;
    else if(opType===2) result=(a|b)>>bitShift&255; else result=(~(a^b))&255;
    let hue = W(result, {wave:'sine', t:t*0.5, range:[0,360], seed:122});
    colorMode(HSB, 360, 255, 255); fill(hue, 200, result); rect(x, y, 5, 5);
  }
  colorMode(RGB);
};

FRAMES[67] = (t, fc) => {
  let phase = W(25, {wave:'square', t:t, range:[0, 1], frequency:0.15, seed:130});
  if (phase < 0.5) {
    background(0, 0, 170); fill(255); noStroke(); textSize(6); textAlign(LEFT, TOP); textFont('monospace');
    text('ERR 0x'+(floor(t*100)%65536).toString(16).toUpperCase().padStart(4,'0'), 2, 2);
    textSize(5);
    let errLines = ['FATAL_ERR','WAVE_FAULT','BAD_POOL','IRQ_LESS'];
    for (let i = 0; i < 4; i++) { let glitch = W(i, {wave:'noise', t:t, range:[0,1], seed:131+i, frequency:3}); fill(glitch > 0.7 ? color(255,255,0) : 255); text(errLines[i], 2, 12+i*8); }
    let prog = W(25, {wave:'ramp', t:t, range:[0, 46], frequency:0.1});
    stroke(255); strokeWeight(1); noFill(); rect(2, 44, 46, 4); noStroke(); fill(255); rect(2, 44, prog, 4);
  } else {
    background(0); noStroke();
    for (let i = 0; i < 50; i++) { fill(W(i, {wave:'pulse', t:t*4, range:[0,255], seed:140+i})); rect(i, W(i, {wave:'noise', t:t*8, range:[0,50], seed:135+i, frequency:5}), 1, random(3, 15)); }
  }
};

FRAMES[68] = (t, fc) => {
  background(0); noStroke();
  let quality = W(25, {wave:'bumpy sine', t:t, range:[2, 10], frequency:0.3});
  let blockSize = max(2, floor(quality));
  for (let by = 0; by < 50; by += blockSize) for (let bx = 0; bx < 50; bx += blockSize) {
    let baseVal = W(by+bx*0.5, {wave:'sine', t:t, range:[0,255], seed:150, frequency:0.4});
    let quantStep = max(1, floor(W(bx, {wave:'steps', t:t, range:[16,64], seed:151, frequency:0.2})));
    let quantized = floor(baseVal/quantStep)*quantStep;
    let rBleed = W(bx, {wave:'noise', t:t, range:[-30,30], seed:152, frequency:2});
    let gBleed = W(by, {wave:'noise', t:t, range:[-20,20], seed:153, frequency:2});
    fill(constrain(quantized+rBleed,0,255), constrain(quantized+gBleed,0,255), constrain(quantized-rBleed*0.5,0,255));
    rect(bx, by, blockSize, blockSize);
  }
  stroke(255, 0, 0, W(25, {wave:'fuzzy pulse', t:t, range:[0,60], frequency:0.8})); strokeWeight(0.5);
  for (let g = 0; g < 50; g += blockSize) { line(g, 0, g, 50); line(0, g, 50, g); }
};

FRAMES[69] = (t, fc) => {
  let mode = floor(W(25, {wave:'noise', t:t, range:[0, 4], seed:160, frequency:1.5}));
  background(0); noStroke();
  if (mode < 1) { for (let y = 0; y < 50; y += 2) { let xOff = W(y, {wave:'noise', t:t*4, range:[-15,15], seed:161+y, frequency:4}); fill(W(y, {wave:'sine', t:t, range:[50,255], seed:162})); rect(xOff, y, 50, 2); } }
  else if (mode < 2) { let r = W(0, {wave:'square', t:t*3, range:[0,255], seed:163}); let g = W(1, {wave:'pulse', t:t*2.5, range:[0,255], seed:164}); background(r, g, W(2, {wave:'square', t:t*4, range:[0,255], seed:165})); fill(255-r, 255-g, 128); textSize(20); textAlign(CENTER,CENTER); textFont('monospace'); text('!', 25, 25); }
  else if (mode < 3) { for (let x = 0; x < 50; x += 3) { fill(W(x, {wave:'sine', t:t, range:[100,255], seed:167})*0.3, W(x, {wave:'sine', t:t, range:[100,255], seed:167}), W(x, {wave:'sine', t:t, range:[100,255], seed:167})*0.7); rect(x, W(x, {wave:'noise', t:t*3, range:[-10,10], seed:166+x, frequency:3}), 3, 50); } }
  else { for (let y = 0; y < 50; y++) { let xOff = (y%2===0)?W(y, {wave:'noise', t:t*6, range:[-5,5], seed:169, frequency:5}):0; fill(W(y, {wave:'ramp', t:t, range:[0,255], seed:170})); rect(xOff, y, 50, 1); } }
};

// ═══════════════════════════════════════
// ROW 7: Typographic & Symbol (70-79)
// ═══════════════════════════════════════

FRAMES[70] = (t, fc) => {
  background(10); fill(255); noStroke(); textFont('monospace'); textAlign(CENTER, CENTER);
  let chars = STATE[70].chars;
  for (let row = 0; row < 5; row++) for (let col = 0; col < 5; col++) {
    let idx = row*5+col;
    let sz = W(idx, {wave:'sine', t:t, range:[4, 14], seed:200+idx, frequency:0.3+idx*0.02});
    let rot = W(idx, {wave:'triangle', t:t, range:[-0.5, 0.5], seed:210+idx, frequency:0.2});
    let charIdx = floor(W(idx, {wave:'steps', t:t, range:[0, chars.length-0.01], seed:220+idx, frequency:0.1}));
    push(); translate(col*10+5, row*10+5); rotate(rot); textSize(sz);
    fill(W(idx, {wave:'sine', t:t, range:[100,255], seed:230+idx, frequency:0.5}), 200, 255);
    text(chars[constrain(charIdx,0,chars.length-1)], 0, 0); pop();
  }
};

FRAMES[71] = (t, fc) => {
  background(0); fill(0, 255, 100); noStroke(); textFont('monospace'); textSize(5); textAlign(CENTER, CENTER);
  let densityChars = STATE[71].densityChars;
  for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) {
    let d = sqrt((x-4.5)*(x-4.5)+(y-4.5)*(y-4.5));
    let wave = W(d*5, {wave:'sine', t:t, range:[0, densityChars.length-0.01], seed:240, frequency:0.4});
    let idx = constrain(floor(wave), 0, densityChars.length-1);
    fill(0, W(x+y*10, {wave:'sine', t:t, range:[80,255], seed:241, frequency:0.6}), 100);
    text(densityChars[idx], x*5+2.5, y*5+2.5);
  }
};

FRAMES[72] = (t, fc) => {
  background(0, 5, 0); noStroke(); textFont('monospace'); textSize(6); textAlign(CENTER, CENTER);
  for (let col = 0; col < 8; col++) {
    let speed = W(col, {wave:'noise', t:0, range:[15, 40], seed:250+col});
    let offset = (t * speed) % 60;
    for (let row = 0; row < 9; row++) {
      let cy = row*6-offset%6; if (cy < -5 || cy > 55) continue;
      let bit = floor(W(col*9+row, {wave:'noise', t:t*2, range:[0,2], seed:260+col*9+row, frequency:3}));
      let alpha = W(cy, {wave:'fade out', t:0, range:[40,255], seed:270});
      let isHighlight = W(col+row*8, {wave:'pulse', t:t, range:[0,1], seed:271+col, frequency:0.8});
      fill(isHighlight > 0.8 ? color(100,255,100,alpha) : color(0,180,50,alpha));
      text(min(1,max(0,bit)).toString(), col*6+4, cy+3);
    }
  }
};

FRAMES[73] = (t, fc) => {
  background(15, 5, 25); noStroke(); textAlign(CENTER, CENTER);
  let syms = STATE[73].symbols;
  for (let i = 0; i < 14; i++) {
    let angle = W(i, {wave:'sine', t:t, range:[0, TWO_PI], seed:280+i, frequency:0.2+i*0.01});
    let radius = W(i, {wave:'triangle', t:t, range:[5, 22], seed:290+i, frequency:0.15});
    let sz = W(i, {wave:'sine', t:t, range:[6, 16], seed:300+i, frequency:0.3});
    let hue = W(i, {wave:'sine', t:t, range:[0, 360], seed:310+i, frequency:0.25});
    colorMode(HSB, 360, 255, 255); fill(hue, 200, 240); textSize(sz);
    text(syms[i % syms.length], 25+cos(angle)*radius, 25+sin(angle)*radius);
  }
  colorMode(RGB);
};

FRAMES[74] = (t, fc) => {
  background(5);
  let morse = STATE[74].morseMap, word = 'WAVE';
  let fullMorse = word.split('').map(c => morse[c]||'').join(' ');
  let totalLen = fullMorse.length;
  let pos = floor(W(25, {wave:'ramp', t:t, range:[0, totalLen-0.01], frequency:0.08}));
  noStroke(); let xPos = 2, yBase = 25;
  for (let i = 0; i < totalLen; i++) {
    let ch = fullMorse[i], isActive = i <= pos;
    let pulse = (i===pos)?W(0, {wave:'sine', t:t*4, range:[150,255]}):(isActive?255:40);
    fill(pulse, pulse*0.8, 0);
    if (ch==='.') { ellipse(xPos+2, yBase, 3, 3); xPos+=5; }
    else if (ch==='-') { rect(xPos, yBase-1.5, 8, 3, 1); xPos+=10; }
    else xPos+=4;
    if (xPos>48) { xPos=2; yBase+=10; }
  }
  fill(255); textSize(8); textAlign(CENTER,TOP); textFont('monospace'); text(word, 25, 2);
  stroke(0,255,0,120); strokeWeight(1); noFill(); beginShape();
  for (let x = 0; x < 50; x++) vertex(x, W(x, {wave:'square', t:t, range:[42,48], seed:320, frequency:2}));
  endShape();
};

FRAMES[75] = (t, fc) => {
  background(255); noStroke(); fill(0);
  let seed = floor(W(25, {wave:'steps', t:t, range:[0,100], frequency:0.1, seed:330}));
  for (let x = 3; x < 47; x++) {
    let isBar = W(x, {wave:'square', t:t*0.3, range:[0,1], seed:340+x+seed, frequency:1.5});
    if (isBar > 0.5) { let barH = W(x, {wave:'sine', t:t, range:[25,38], seed:360, frequency:0.2}); rect(x, 5, max(1,1), barH); }
  }
  fill(0); textFont('monospace'); textSize(5); textAlign(CENTER,CENTER);
  let numStr = '';
  for (let i = 0; i < 8; i++) numStr += floor(W(i, {wave:'steps', t:t*0.3, range:[0,9.99], seed:370+i+seed, frequency:0.1})).toString();
  text(numStr, 25, 46);
  let laserX = W(0, {wave:'triangle', t:t, range:[3,47], frequency:0.7});
  stroke(255,0,0,150); strokeWeight(0.5); line(laserX, 3, laserX, 45);
};

FRAMES[76] = (t, fc) => {
  background(0); noStroke(); textAlign(CENTER,CENTER); textFont('monospace');
  let word = 'FLUX';
  for (let i = 0; i < word.length; i++) {
    let sz = W(i, {wave:'sine', t:t, range:[5,22], seed:380+i, frequency:0.4+i*0.08, phase:i*0.7});
    let yOff = W(i, {wave:'sine', t:t, range:[-8,8], seed:390+i, frequency:0.3, phase:i*0.5});
    let hue = W(i, {wave:'sine', t:t, range:[0,360], seed:396+i, frequency:0.2});
    colorMode(HSB, 360, 255, 255); fill(hue, 150, 255); textSize(sz);
    text(word[i], 7+i*12, 25+yOff);
  }
  colorMode(RGB);
};

FRAMES[77] = (t, fc) => {
  background(5, 0, 15); noStroke(); textFont('monospace'); textAlign(CENTER,CENTER);
  let msg = 'WAVES-OSCILLATE-', len = msg.length;
  for (let i = 0; i < len; i++) {
    let angle = (i/len)*TWO_PI + t*0.5;
    let radius = W(i, {wave:'sine', t:t, range:[16,22], seed:410+i, frequency:0.3});
    let sz = W(i, {wave:'sine', t:t, range:[4,7], seed:420+i, frequency:0.5});
    fill(W(i, {wave:'sine', t:t, range:[100,255], seed:430+i, frequency:0.4}), 180, 255);
    push(); translate(25+cos(angle)*radius, 25+sin(angle)*radius); rotate(angle+HALF_PI);
    textSize(sz); text(msg[i], 0, 0); pop();
  }
  let inner = 'CODE*';
  for (let i = 0; i < inner.length; i++) {
    let angle = (i/inner.length)*TWO_PI - t*0.8;
    fill(255, 200, 50); push(); translate(25+cos(angle)*7, 25+sin(angle)*7); rotate(angle+HALF_PI);
    textSize(5); text(inner[i], 0, 0); pop();
  }
};

FRAMES[78] = (t, fc) => {
  background(0); noStroke(); textFont('monospace'); textAlign(CENTER,CENTER);
  let words = STATE[78].words;
  let wordIdx = floor(W(25, {wave:'steps', t:t, range:[0, words.length-0.01], frequency:0.12}));
  let word = words[constrain(wordIdx, 0, words.length-1)];
  let phase = (t * 0.12 * words.length) % 1;
  for (let i = 0; i < word.length; i++) {
    let delay = i * 0.1, charPhase = constrain((phase-delay)*5, 0, 1);
    let sz = W(i, {wave:'sine', t:t, range:[8,18], seed:440+i, frequency:0.5, phase:i*0.3}) * charPhase;
    let x = 25 + (i-(word.length-1)/2)*10;
    let y = 25 + W(i, {wave:'sine', t:t, range:[-5,5], seed:450+i, frequency:0.7, phase:i*0.4}) + (1-charPhase)*30;
    let hue = W(i+wordIdx*4, {wave:'sine', t:t, range:[0,360], seed:460, frequency:0.2});
    colorMode(HSB, 360, 255, 255); fill(hue, 180, 255*charPhase); textSize(max(1,sz)); text(word[i], x, y);
  }
  colorMode(RGB);
};

FRAMES[79] = (t, fc) => {
  background(255); noStroke();
  let gridN = 9, cellSz = 50/gridN;
  let drawFinder = (ox, oy) => { fill(0); rect(ox,oy,cellSz*3,cellSz*3); fill(255); rect(ox+cellSz*0.5,oy+cellSz*0.5,cellSz*2,cellSz*2); fill(0); rect(ox+cellSz,oy+cellSz,cellSz,cellSz); };
  drawFinder(0, 0); drawFinder(50-cellSz*3, 0); drawFinder(0, 50-cellSz*3);
  for (let gy = 0; gy < gridN; gy++) for (let gx = 0; gx < gridN; gx++) {
    if (gx<3&&gy<3) continue; if(gx>=6&&gy<3) continue; if(gx<3&&gy>=6) continue;
    let idx = gx+gy*gridN;
    let val = W(idx, {wave:'square', t:t, range:[0,1], seed:500+idx, frequency:0.2+idx*0.005});
    fill(val > 0.5 ? W(idx, {wave:'sine', t:t, range:[0,40], seed:510+idx, frequency:1}) : 255);
    rect(gx*cellSz, gy*cellSz, cellSz, cellSz);
  }
};

// ═══════════════════════════════════════
// ROW 8: Spatial & 3D (80-89)
// ═══════════════════════════════════════

FRAMES[80] = (t, fc) => {
  let rotX = W(0, {wave:'sine', t:t, range:[0, PI], seed:80, frequency:0.3});
  let rotY = W(0, {wave:'ramp', t:t, range:[0, TWO_PI], seed:81, frequency:0.2});
  let sz = W(0, {wave:'smooth solid sine', t:t, range:[10, 18], seed:82, frequency:0.15});
  let verts = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  let edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  let cX=cos(rotX),sX=sin(rotX),cY=cos(rotY),sY=sin(rotY);
  let proj = verts.map(v => { let y1=v[1]*cX-v[2]*sX,z1=v[1]*sX+v[2]*cX; let x1=v[0]*cY-z1*sY,z2=v[0]*sY+z1*cY; let s=1.5/(3+z2); return{px:25+x1*sz*s, py:25+y1*sz*s, z:z2}; });
  strokeWeight(0.8);
  for (let e of edges) { let a=proj[e[0]],b=proj[e[1]]; stroke(80,160,map((a.z+b.z)/2,-2,2,100,255),200); line(a.px,a.py,b.px,b.py); }
  noStroke();
  for (let p of proj) { fill(140,200,255,map(p.z,-2,2,120,255)); circle(p.px,p.py,2.5); }
};

FRAMES[81] = (t, fc) => {
  let R=12, r=5;
  let rotA = W(0, {wave:'ramp', t:t, range:[0, TWO_PI], seed:810, frequency:0.15});
  let rotB = W(0, {wave:'sine', t:t, range:[-0.5, 0.5], seed:811, frequency:0.25});
  let wobble = W(0, {wave:'wobble sine', t:t, range:[0.8, 1.2], seed:812, frequency:0.4});
  noStroke(); let pts = [];
  for (let i = 0; i < 18; i++) { let u=(i/18)*TWO_PI; for (let j = 0; j < 10; j++) { let v=(j/10)*TWO_PI; let x=(R+r*cos(v))*cos(u), y=(R+r*cos(v))*sin(u), z=r*sin(v)*wobble; let cA=cos(rotA),sA=sin(rotA),cB=cos(rotB),sB=sin(rotB); let y1=y*cB-z*sB,z1=y*sB+z*cB; let x1=x*cA-z1*sA,z2=x*sA+z1*cA; let s=1.2/(3+z2/15); pts.push({px:25+x1*s, py:25+y1*s, z:z2}); } }
  pts.sort((a,b) => a.z-b.z);
  for (let p of pts) { fill(200,120,255,map(p.z,-18,18,40,255)); circle(p.px,p.py,map(p.z,-18,18,1,3)); }
};

FRAMES[82] = (t, fc) => {
  let cols=5, rows=5, bw=7, bh=4, ox=25, oy=8;
  for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
    let h = W(r*cols+c, {wave:'mountain peaks', t:t, range:[2,14], seed:820+c*7, frequency:0.3+r*0.05, phase:c*0.5+r*0.3});
    let ix=(c-r)*bw*0.5+ox, iy=(c+r)*bh*0.3+oy, topY=iy-h;
    let hue = W(c+r, {wave:'sine', t:t, range:[160,280], seed:825, frequency:0.2, phase:(c+r)*0.4});
    noStroke();
    fill(hue%256, 140, 220, 220); quad(ix,topY, ix+bw/2,topY-bh/2, ix+bw,topY, ix+bw/2,topY+bh/2);
    fill(hue%256*0.5, 80, 160, 200); quad(ix,topY, ix+bw/2,topY+bh/2, ix+bw/2,topY+bh/2+h*0.4, ix,topY+h*0.4);
    fill(hue%256*0.7, 100, 180, 200); quad(ix+bw/2,topY+bh/2, ix+bw,topY, ix+bw,topY+h*0.4, ix+bw/2,topY+bh/2+h*0.4);
  }
};

FRAMES[83] = (t, fc) => {
  background(10, 5, 30); noStroke();
  for (let layer = 0; layer < 5; layer++) {
    let depth = layer/5;
    let speed = W(layer, {wave:'sine', t:t, range:[-12,12], seed:830+layer, frequency:0.15*(1+depth*2)});
    let alpha = map(layer, 0, 4, 40, 220);
    for (let x = -5; x < 60; x += 6+layer*2) {
      let xp = ((x+speed)%60+60)%60-5;
      let h = W(x+layer*10, {wave:'valleys', t:t, range:[4,20-layer*2], seed:840+layer, frequency:0.2, phase:x*0.1});
      fill(map(layer,0,4,20,100), map(layer,0,4,10,60), map(layer,0,4,60,200), alpha);
      rect(xp, 50-h-layer*3, 5+layer, h+layer*3);
    }
    fill(10, 5, 30, 30-layer*5); rect(0, 0, 50, 50);
  }
};

FRAMES[84] = (t, fc) => {
  background(20, 25, 40);
  let fogDensity = W(0, {wave:'smooth solid sine', t:t, range:[0.03, 0.08], seed:840, frequency:0.12});
  noStroke();
  for (let z = 10; z >= 0; z--) {
    let zNorm = z/10, fog = 1-exp(-fogDensity*z*z*10), scale = 1/(1+zNorm*2);
    let xOff = W(z, {wave:'sine', t:t, range:[-5,5], seed:841+z, frequency:0.2+z*0.02});
    let yOff = W(z, {wave:'triangle', t:t, range:[-3,3], seed:845+z, frequency:0.15});
    let bx=25+xOff, by=25+yOff+zNorm*8, sz=8*scale;
    fill(lerp(80,20,fog), lerp(180,25,fog), lerp(255,40,fog), lerp(255,60,fog));
    rectMode(CENTER); rect(bx, by, sz, sz, 1);
    fill(lerp(80,20,fog), lerp(180,25,fog), lerp(255,40,fog), lerp(255,60,fog)*0.3); circle(bx, by, sz*2);
  }
  rectMode(CORNER);
  for (let i = 0; i < 8; i++) { fill(20,25,40,30); ellipse(W(i, {wave:'noise', t:t, range:[0,50], seed:850+i, frequency:0.05}), W(i, {wave:'bumpy sine', t:t, range:[25,50], seed:855+i, frequency:0.08}), 20, 8); }
};

FRAMES[85] = (t, fc) => {
  background(30, 25, 20);
  let lightX = W(0, {wave:'sine', t:t, range:[10,40], seed:850, frequency:0.2});
  let lightY = W(0, {wave:'triangle', t:t, range:[5,15], seed:851, frequency:0.15});
  noStroke();
  for (let r = 20; r > 0; r--) { fill(255,220,100,map(r,0,20,40,0)); circle(lightX,lightY,r); }
  let objects = [{x:15,y:35,w:8,h:10},{x:30,y:30,w:6,h:15},{x:40,y:38,w:7,h:8}];
  for (let i = 0; i < objects.length; i++) {
    let o = objects[i];
    let bounce = W(i, {wave:'half sine', t:t, range:[0,4], seed:852+i, frequency:0.3+i*0.1});
    let oy = o.y-bounce, dx=o.x-lightX, dy=oy-lightY, dist2=sqrt(dx*dx+dy*dy), shadowLen=map(dist2,0,50,0.5,3);
    fill(0,0,0,60); beginShape(); vertex(o.x-o.w/2,48); vertex(o.x+o.w/2,48); vertex(o.x+o.w/2+dx*shadowLen*0.5,48+abs(dy)*shadowLen*0.3); vertex(o.x-o.w/2+dx*shadowLen*0.5,48+abs(dy)*shadowLen*0.3); endShape(CLOSE);
    fill(map(dist2,0,40,255,120), map(dist2,0,40,255,120)*0.7, map(dist2,0,40,255,120)*0.4);
    rect(o.x-o.w/2, oy, o.w, 48-oy, 1);
  }
};

FRAMES[86] = (t, fc) => {
  let sz = W(0, {wave:'smooth solid sine', t:t, range:[14,18], seed:860, frequency:0.15});
  let rot = W(0, {wave:'ramp', t:t, range:[0, TWO_PI], seed:861, frequency:0.08});
  let thick = W(0, {wave:'sine', t:t, range:[3,5], seed:862, frequency:0.2});
  let hueShift = W(0, {wave:'ramp', t:t, range:[0, 360], seed:863, frequency:0.1});
  let pts = [];
  for (let i = 0; i < 3; i++) { let a=rot+i*TWO_PI/3-HALF_PI; pts.push({x:25+cos(a)*sz, y:26+sin(a)*sz}); }
  strokeWeight(thick); noFill();
  for (let i = 0; i < 3; i++) {
    let p1=pts[i], p2=pts[(i+1)%3];
    let hue = (hueShift+i*120)%360;
    let cr=127+127*cos(radians(hue)), cg=127+127*cos(radians(hue-120)), cb=127+127*cos(radians(hue-240));
    stroke(cr,cg,cb,230); line(p1.x,p1.y,p2.x,p2.y);
    stroke(cr*0.6,cg*0.6,cb*0.6,200); strokeWeight(thick*0.7);
    let ix1=lerp(p1.x,p2.x,0.15)+-(p2.y-p1.y)/sqrt((p2.x-p1.x)**2+(p2.y-p1.y)**2)*thick*1.2;
    let iy1=lerp(p1.y,p2.y,0.15)+(p2.x-p1.x)/sqrt((p2.x-p1.x)**2+(p2.y-p1.y)**2)*thick*1.2;
    let ix2=lerp(p1.x,p2.x,0.85)+-(p2.y-p1.y)/sqrt((p2.x-p1.x)**2+(p2.y-p1.y)**2)*thick*1.2;
    let iy2=lerp(p1.y,p2.y,0.85)+(p2.x-p1.x)/sqrt((p2.x-p1.x)**2+(p2.y-p1.y)**2)*thick*1.2;
    line(ix1,iy1,ix2,iy2); strokeWeight(thick);
  }
  noStroke(); fill(255,255,255,W(0, {wave:'sine', t:t, range:[0,40], seed:864, frequency:0.5}));
  circle(25, 26, 3);
};

FRAMES[87] = (t, fc) => {
  let cols=12, rows=12, spacing=4, ox=5, oy=10;
  stroke(40,180,120,180); strokeWeight(0.5); noFill();
  for (let r=0; r<rows; r++) {
    beginShape(); noFill();
    for (let c=0; c<cols; c++) {
      let h = W(r*cols+c, {wave:'noise', t:t, range:[0,18], seed:870+r, frequency:0.15, phase:c*0.3+r*0.2});
      stroke(40, map(h,0,18,60,255), 120, 180);
      vertex(ox+c*spacing-r*1.5, oy+r*3-h+c*0.8);
    }
    endShape();
  }
  for (let c=0; c<cols; c+=2) for (let r=0; r<rows-1; r++) {
    let h1 = W(r*cols+c, {wave:'noise', t:t, range:[0,18], seed:870+r, frequency:0.15, phase:c*0.3+r*0.2});
    let h2 = W((r+1)*cols+c, {wave:'noise', t:t, range:[0,18], seed:871+r, frequency:0.15, phase:c*0.3+(r+1)*0.2});
    stroke(40,140,120,60);
    line(ox+c*spacing-r*1.5, oy+r*3-h1+c*0.8, ox+c*spacing-(r+1)*1.5, oy+(r+1)*3-h2+c*0.8);
  }
};

FRAMES[88] = (t, fc) => {
  background(0);
  let drift = W(0, {wave:'ramp', t:t, range:[0,1], seed:880, frequency:0.3}); noFill();
  for (let i = 0; i < 10; i++) {
    let zf = ((i/10+drift)%1), sz=map(zf,0,1,2,35), alpha=map(zf,0,1,255,20);
    let rot = W(i, {wave:'sine', t:t, range:[-0.3,0.3], seed:881+i, frequency:0.2, phase:i*0.5});
    let hue = W(i, {wave:'ramp', t:t, range:[0,360], seed:882, frequency:0.12, phase:i*0.3});
    stroke(127+127*sin(radians(hue)), 127+127*sin(radians(hue+120)), 127+127*sin(radians(hue+240)), alpha);
    strokeWeight(map(zf,0,1,0.3,1.5));
    let wobX = W(0, {wave:'sine', t:t, range:[-3,3], seed:885, frequency:0.18})*(1-zf);
    let wobY = W(0, {wave:'triangle', t:t, range:[-3,3], seed:886, frequency:0.15})*(1-zf);
    beginShape(); for (let s=0;s<=6;s++) { let a=s*TWO_PI/6+rot; vertex(25+wobX+cos(a)*sz, 25+wobY+sin(a)*sz); } endShape();
  }
  noStroke(); fill(255,255,255,W(0, {wave:'sine', t:t, range:[100,255], seed:888, frequency:0.5})); circle(25, 25, 3);
};

FRAMES[89] = (t, fc) => {
  background(0);
  let sep = W(0, {wave:'sine', t:t, range:[1,3], seed:890, frequency:0.15});
  noStroke();
  for (let i = 0; i < 30; i++) {
    let x = W(i, {wave:'noise', t:t, range:[8,42], seed:891+i, frequency:0.1});
    let y = W(i, {wave:'noise', t:t, range:[5,45], seed:892+i*3, frequency:0.12});
    let z = W(i, {wave:'sine', t:t, range:[0,1], seed:893+i*2, frequency:0.2, phase:i*0.4});
    let sz = map(z,0,1,1.5,4), offset = z*sep;
    fill(255,50,50,150+z*100); circle(x-offset, y, sz);
    fill(50,255,255,150+z*100); circle(x+offset, y, sz);
    fill(255,255,255,z*80); circle(x, y, sz*0.6);
  }
};

// ═══════════════════════════════════════
// ROW 9: Cosmic & Grand Finale (90-99)
// ═══════════════════════════════════════

FRAMES[90] = (t, fc) => {
  background(0, 0, 5);
  let stars=STATE[90].stars;
  let speed = W(0, {wave:'smooth solid sine', t:t, range:[0.3,1.5], seed:900, frequency:0.1});
  noStroke();
  for (let s of stars) {
    s.z -= speed*0.02; if(s.z<=0.1){s.z=3.5;s.x=25+(Math.random()-0.5)*10;s.y=25+(Math.random()-0.5)*10;}
    let sx=25+(s.x-25)/s.z, sy=25+(s.y-25)/s.z, sz=map(s.z,0.1,3.5,3,0.3), bright=map(s.z,0.1,3.5,255,30);
    let twinkle = W(s.b*100, {wave:'sine', t:t, range:[0.5,1], seed:901, frequency:1+s.b, phase:s.b*10});
    if (sx>-5&&sx<55&&sy>-5&&sy<55) {
      fill(255,240,200+s.b*55,bright*twinkle); circle(sx,sy,sz);
      if (s.z < 1.5) { stroke(255,240,220,bright*0.3); strokeWeight(0.3); line(sx,sy,sx-(sx-25)*0.05,sy-(sy-25)*0.05); noStroke(); }
    }
  }
};

FRAMES[91] = (t, fc) => {
  background(5, 2, 15, 40);
  let parts=STATE[91].particles; noStroke();
  for (let p of parts) {
    p.x += W(p.r*100, {wave:'noise', t:t, range:[-0.3,0.3], seed:910+floor(p.r*10), frequency:0.08});
    p.y += W(p.g*100, {wave:'noise', t:t, range:[-0.3,0.3], seed:915+floor(p.g*10), frequency:0.07});
    if(p.x<0)p.x=50;if(p.x>50)p.x=0;if(p.y<0)p.y=50;if(p.y>50)p.y=0;
    let hue = W(p.life*50, {wave:'sine', t:t, range:[0,1], seed:912, frequency:0.05, phase:p.life*5});
    let pulse = W(p.life*100, {wave:'smooth solid sine', t:t, range:[20,80], seed:913, frequency:0.3, phase:p.life*3});
    fill(lerp(180,80,hue), lerp(40,60,hue), lerp(200,255,hue), pulse); circle(p.x,p.y,4+p.life*3);
    fill(lerp(230,130,hue), lerp(70,90,hue), lerp(250,255,hue), pulse*0.4); circle(p.x,p.y,8+p.life*5);
  }
  let coreX = W(0, {wave:'sine', t:t, range:[20,30], seed:916, frequency:0.06});
  let coreY = W(0, {wave:'sine', t:t, range:[20,30], seed:917, frequency:0.05});
  for (let r=12;r>0;r--) { fill(255,200,255,map(r,0,12,30,0)); circle(coreX,coreY,r); }
};

FRAMES[92] = (t, fc) => {
  background(0, 0, 10); noStroke();
  let sunPulse = W(0, {wave:'sine', t:t, range:[3,5], seed:920, frequency:0.5});
  for (let r=sunPulse+4;r>0;r--) { fill(255,200,50,map(r,0,sunPulse+4,255,0)); circle(25,25,r*2); }
  let planets = STATE[92].planets;
  stroke(255,255,255,15); strokeWeight(0.3); noFill();
  for (let p of planets) ellipse(25,25,p.dist*2,p.dist*2);
  noStroke();
  for (let i=0;i<planets.length;i++) {
    let p=planets[i];
    let angle = W(i, {wave:'ramp', t:t, range:[0, TWO_PI], seed:921+i, frequency:0.05*p.speed});
    let ecc = W(i, {wave:'sine', t:t, range:[0.9,1.1], seed:925+i, frequency:0.1});
    fill(p.r,p.g,p.b); circle(25+cos(angle)*p.dist*ecc, 25+sin(angle)*p.dist*ecc*0.6, p.size);
    fill(p.r,p.g,p.b,40); circle(25+cos(angle)*p.dist*ecc, 25+sin(angle)*p.dist*ecc*0.6, p.size*3);
  }
};

FRAMES[93] = (t, fc) => {
  background(0);
  let eventHorizon = W(0, {wave:'smooth solid sine', t:t, range:[5,7], seed:930, frequency:0.1});
  noFill();
  for (let i=0;i<40;i++) {
    let angle = W(i, {wave:'ramp', t:t, range:[0, TWO_PI], seed:931, frequency:0.15, phase:i*0.3});
    let d = eventHorizon+2+i*0.4;
    let distort = W(i, {wave:'sine', t:t, range:[0.7,1.3], seed:932+i, frequency:0.3, phase:i});
    let heat = map(d, eventHorizon, eventHorizon+18, 255, 40);
    noStroke(); fill(heat, heat*0.5, heat*0.2, heat*0.8);
    circle(25+cos(angle)*d*distort, 25+sin(angle)*d*0.35*distort, map(d, eventHorizon, eventHorizon+18, 2.5, 0.8));
  }
  noFill(); strokeWeight(1.5);
  for (let a=0;a<TWO_PI;a+=0.15) {
    let bright = W(a*10, {wave:'sine', t:t, range:[80,255], seed:935, frequency:0.4, phase:a*2});
    stroke(255,200,100,bright); point(25+cos(a)*(eventHorizon+1), 25+sin(a)*(eventHorizon+1)*0.9);
  }
  noStroke(); fill(0); circle(25, 25, eventHorizon*2);
  noFill(); stroke(255,220,150,60); strokeWeight(0.5); ellipse(25,25,eventHorizon*2.2,eventHorizon*2.2);
};

FRAMES[94] = (t, fc) => {
  background(5, 5, 20); noStroke();
  for (let i=0;i<15;i++) { fill(255,255,255,100+sin(t*2+i)*50); circle((i*17+7)%50, (i*23+3)%25, 1); }
  noFill();
  for (let curtain=0;curtain<4;curtain++) {
    let baseY = 10+curtain*5;
    for (let x=0;x<50;x++) {
      let h = W(x+curtain*50, {wave:'sine', t:t, range:[5,20], seed:941+curtain, frequency:0.1+curtain*0.03, phase:x*0.1});
      let waveY = W(x, {wave:'wobble sine', t:t, range:[-3,3], seed:942+curtain, frequency:0.15, phase:x*0.15+curtain});
      let intensity = W(x+curtain*30, {wave:'smooth solid sine', t:t, range:[0,1], seed:943+curtain, frequency:0.08, phase:x*0.05});
      let y1 = baseY+waveY;
      for (let dy=0;dy<h;dy++) { let fade=1-dy/h; stroke(lerp(20,100,curtain/4), lerp(80,255,intensity)*fade, (120+100*(1-fade)), 40*intensity*fade); point(x, y1+dy); }
    }
  }
  fill(5,5,10); noStroke(); beginShape(); vertex(0,50);
  for (let x=0;x<=50;x+=2) vertex(x, W(x, {wave:'mountain peaks', t:0, range:[40,46], seed:949, frequency:0.3, phase:x*0.2}));
  vertex(50,50); endShape(CLOSE);
};

FRAMES[95] = (t, fc) => {
  background(2, 2, 10); noStroke();
  for (let r=10;r>0;r--) { fill(255,230,180,map(r,0,10,60,0)); circle(25,25,r); }
  let armRot = W(0, {wave:'ramp', t:t, range:[0, TWO_PI], seed:950, frequency:0.04});
  for (let arm=0;arm<2;arm++) {
    for (let i=0;i<80;i++) {
      let d=i*0.28+2, angle=arm*PI+armRot+d*0.4;
      let spread = W(i+arm*80, {wave:'noise', t:t, range:[-2,2], seed:951+arm, frequency:0.05, phase:i*0.1});
      let px=25+cos(angle)*d+cos(angle+HALF_PI)*spread, py=25+sin(angle)*d*0.7+sin(angle+HALF_PI)*spread*0.7;
      if(px<-2||px>52||py<-2||py>52) continue;
      let bright = W(i, {wave:'sine', t:t, range:[80,255], seed:952, frequency:0.3, phase:i*0.2});
      fill(map(d,2,24,255,140), 200, map(d,2,24,180,255), bright*map(d,2,24,0.9,0.3));
      circle(px, py, map(d,2,24,2,1));
    }
  }
  fill(255,250,220,200); circle(25,25,2.5);
};

FRAMES[96] = (t, fc) => {
  background(2, 2, 12, 80);
  let trail=STATE[96].cometTrail;
  let cx = W(0, {wave:'sine', t:t, range:[5,45], seed:960, frequency:0.12});
  let cy = W(0, {wave:'triangle sine', t:t, range:[5,40], seed:961, frequency:0.09});
  trail.unshift({x:cx,y:cy}); if(trail.length>25) trail.pop();
  noStroke();
  for (let i=0;i<12;i++) { fill(255,255,255,60); circle((i*17+7)%50,(i*23+3)%50, 0.8); }
  for (let i=trail.length-1;i>=1;i--) {
    let p=trail[i], frac=1-i/trail.length;
    let tailBright = W(i, {wave:'fade out', t:t, range:[20,180], seed:962, frequency:0.2, phase:i*0.1});
    fill(180+75*frac, 200*frac, 100*frac, tailBright*frac); circle(p.x, p.y, 4*frac+1);
    fill(200,200,255,tailBright*frac*0.3); circle(p.x+sin(i)*2, p.y+cos(i)*1.5, (4*frac+1)*0.6);
  }
  let glow = W(0, {wave:'sine', t:t, range:[6,10], seed:963, frequency:0.5});
  for (let r=glow;r>0;r--) { fill(200,230,255,map(r,0,glow,200,0)); circle(cx,cy,r); }
  fill(255,255,240); circle(cx,cy,3);
};

FRAMES[97] = (t, fc) => {
  background(0, 0, 5);
  let moonOffset = W(0, {wave:'sine', t:t, range:[-12,12], seed:970, frequency:0.06});
  let moonY = W(0, {wave:'sine', t:t, range:[-3,3], seed:971, frequency:0.08});
  let coronaIntensity = map(abs(moonOffset), 0, 12, 1, 0.1);
  for (let a=0;a<TWO_PI;a+=0.08) {
    let rayLen = W(a*10, {wave:'noise', t:t, range:[8,20], seed:972, frequency:0.1, phase:a})*coronaIntensity;
    stroke(255,200,100,60*coronaIntensity); strokeWeight(W(a*5, {wave:'sine', t:t, range:[0.5,2], seed:973, frequency:0.2, phase:a*3}));
    line(25+cos(a)*9, 25+sin(a)*9, 25+cos(a)*(9+rayLen), 25+sin(a)*(9+rayLen));
  }
  noStroke();
  for (let r=14;r>7;r--) { fill(255,180,50,map(r,7,14,80,0)*coronaIntensity); circle(25,25,r*2); }
  fill(255,220,100); circle(25,25,16);
  fill(10,10,15); circle(25+moonOffset, 25+moonY, 17);
  if (abs(moonOffset) < 2) {
    let diamond = W(0, {wave:'sharp peaks', t:t, range:[0,255], seed:975, frequency:0.8});
    fill(255,255,255,diamond*coronaIntensity); circle(25+moonOffset*-1.1+8.5, 25+moonY, 2);
    for (let i=0;i<4;i++) { let ba=(i/4)*PI-HALF_PI; fill(255,255,200,diamond*0.5); circle(25+cos(ba)*8.5, 25+sin(ba)*8.5, 1); }
  }
};

FRAMES[98] = (t, fc) => {
  background(2, 2, 12);
  let lensStrength = W(0, {wave:'smooth solid sine', t:t, range:[3,8], seed:980, frequency:0.1});
  let lensX = 25+W(0, {wave:'sine', t:t, range:[-5,5], seed:981, frequency:0.07});
  let lensY = 25+W(0, {wave:'sine', t:t, range:[-5,5], seed:982, frequency:0.06});
  noStroke();
  for (let i=0;i<50;i++) {
    let origX=(i*13+5)%50, origY=(i*19+11)%50;
    let dx=origX-lensX, dy=origY-lensY, dist2=sqrt(dx*dx+dy*dy)+0.1;
    let deflection = lensStrength/(dist2*0.5+1);
    let sx=origX+(dx/dist2)*deflection, sy=origY+(dy/dist2)*deflection;
    let stretch = map(deflection, 0, 5, 1, 2.5);
    fill(200,210,255,map(dist2,0,30,255,80));
    push(); translate(sx, sy); rotate(atan2(dy, dx)); ellipse(0, 0, 1.5*stretch, 1.5/stretch); pop();
  }
  noFill(); stroke(180,200,255,40); strokeWeight(1); ellipse(lensX, lensY, lensStrength*3.6, lensStrength*3.6);
  for (let a=0;a<3;a++) { stroke(150,180,255,W(a, {wave:'sine', t:t, range:[60,180], seed:985+a, frequency:0.2, phase:a})); strokeWeight(1.2); noFill(); arc(lensX,lensY,lensStrength*3.6+2,lensStrength*3.6+2, a*TWO_PI/3+t*0.1, a*TWO_PI/3+t*0.1+0.8); }
  noStroke(); fill(2,2,12); circle(lensX, lensY, 4);
};

FRAMES[99] = (t, fc) => {
  background(2, 1, 8);
  let st=STATE[99];
  let energy = W(0, {wave:'sine', t:t, range:[0,1], seed:991, frequency:0.15});
  let pulse = W(0, {wave:'sharp peaks', t:t, range:[0,1], seed:992, frequency:0.25});
  noStroke();
  // Nebula bg
  for (let i=0;i<20;i++) {
    let hue = W(i, {wave:'sine', t:t, range:[0,1], seed:995, frequency:0.04, phase:i*0.5});
    fill(lerp(60,200,hue), 30+hue*40, lerp(180,80,hue), 15+energy*15);
    circle(W(i, {wave:'noise', t:t, range:[0,50], seed:993+i, frequency:0.03}), W(i, {wave:'noise', t:t, range:[0,50], seed:994+i*2, frequency:0.025}), 12+energy*5);
  }
  // Galaxy spiral
  let armRot = W(0, {wave:'ramp', t:t, range:[0, TWO_PI], seed:996, frequency:0.05});
  for (let arm=0;arm<3;arm++) for (let i=0;i<40;i++) {
    let d=i*0.5+2, angle=arm*TWO_PI/3+armRot+d*0.35;
    let spread = W(i+arm*40, {wave:'noise', t:t, range:[-1.5,1.5], seed:997+arm, frequency:0.06, phase:i*0.1});
    let px=25+cos(angle)*d+cos(angle+HALF_PI)*spread, py=25+sin(angle)*d*0.65+sin(angle+HALF_PI)*spread*0.65;
    if(px<-2||px>52||py<-2||py>52) continue;
    let bright = 120+135*energy*sin(i*0.2+t);
    fill(255, lerp(180,255,energy), map(d,2,22,200,255), bright*map(d,2,22,0.8,0.2));
    circle(px, py, map(d,2,22,2,0.8));
  }
  // Orbiting particles
  for (let p of st.pts) {
    let orbitSpeed = W(p.a*10, {wave:'sine', t:t, range:[0.5,2], seed:998, frequency:0.1, phase:p.a});
    p.a += 0.01*orbitSpeed*p.s;
    let wobble = W(p.r, {wave:'wobble sine', t:t, range:[0.8,1.2], seed:999, frequency:0.2});
    let hShift = (p.h+t*30)%360;
    fill(127+127*cos(radians(hShift)), 127+127*cos(radians(hShift-120)), 127+127*cos(radians(hShift-240)), 160+energy*80);
    circle(25+cos(p.a)*p.r*wobble, 25+sin(p.a)*p.r*0.6*wobble, 1.5+pulse*1.5);
  }
  // Energy bursts
  if (pulse > 0.7) {
    for (let a=0;a<TWO_PI;a+=PI/8) {
      stroke(255,220,150,(pulse-0.7)*800); strokeWeight(0.6);
      let rayLen = W(a*5, {wave:'noise', t:t, range:[5,pulse*22], seed:1000, frequency:0.3, phase:a});
      line(25+cos(a)*3, 25+sin(a)*3, 25+cos(a)*rayLen, 25+sin(a)*rayLen);
    }
    noStroke();
  }
  // Core glow
  let coreHue = W(0, {wave:'ramp', t:t, range:[0,360], seed:1001, frequency:0.08});
  for (let r=8;r>0;r--) { fill(127+127*sin(radians(coreHue)), 127+127*sin(radians(coreHue+120)), 127+127*sin(radians(coreHue+240)), map(r,0,8,100+pulse*155,0)); circle(25, 25, r*(1+energy*0.5)); }
  fill(255,255,255,200+pulse*55); circle(25, 25, 2.5);
  // Sparks
  if (fc%3===0&&st.sparks.length<15) { let sa=random(TWO_PI); st.sparks.push({x:25,y:25,vx:cos(sa)*(1+energy*2),vy:sin(sa)*(1+energy*2),life:1}); }
  for (let i=st.sparks.length-1;i>=0;i--) {
    let sp=st.sparks[i]; sp.x+=sp.vx;sp.y+=sp.vy;sp.vx*=0.96;sp.vy*=0.96;sp.life-=0.03;
    if(sp.life<=0||sp.x<-2||sp.x>52||sp.y<-2||sp.y>52){st.sparks.splice(i,1);continue;}
    fill(255,220,150,sp.life*255); circle(sp.x,sp.y,sp.life*2.5);
  }
};

} // end registerFrames
