// p5-grid — 100 Ways to Use p5.waves
// Every frame calls the library. The library is the engine.

const FRAMES = [];
const STATE = {};
const COLS = 10, ROWS = 10, SZ = 50;
const GRID_W = COLS * SZ, GRID_H = ROWS * SZ;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  initState();
  registerFrames();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  const t = millis() / 1000;
  const fc = frameCount;
  const ctx = drawingContext;
  const ox = floor((width - GRID_W) / 2);
  const oy = floor((height - GRID_H) / 2);
  for (let i = 0; i < 100; i++) {
    const cx = ox + (i % COLS) * SZ;
    const cy = oy + floor(i / COLS) * SZ;
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

// ── Shorthand ──
function W(c, o) { return Waves.wave(c, o); }

// ── Stateful frames ──
function initState() {
  // 50: particle fountain
  STATE[50] = Array.from({length:20}, ()=>({x:25,y:48,vx:0,vy:0,life:0}));
  // 51: firefly swarm
  STATE[51] = Array.from({length:12}, (_,i)=>({x:random(5,45),y:random(5,45),phase:random(TWO_PI)}));
  // 52: boid flock
  STATE[52] = Array.from({length:10}, ()=>({x:random(5,45),y:random(5,45),vx:random(-1,1),vy:random(-1,1)}));
  // 53: brownian trail
  STATE[53] = {x:25,y:25,trail:[]};
  // 54: gravity orbiter
  STATE[54] = Array.from({length:8}, (_,i)=>({x:25+15*cos(i),y:25+15*sin(i),vx:random(-0.5,0.5),vy:random(-0.5,0.5)}));
  // 55: bouncing balls
  STATE[55] = Array.from({length:5}, ()=>({x:random(10,40),y:random(10,40),vx:random(-2,2),vy:random(-2,2)}));
  // 62: Conway Life
  STATE[62] = {g:new Uint8Array(625),n:new Uint8Array(625),age:0};
  for(let i=0;i<625;i++) STATE[62].g[i]=random()<0.35?1:0;
  // 63: reaction-diffusion
  const n=625; STATE[63]={A:new Float32Array(n).fill(1),B:new Float32Array(n).fill(0),nA:new Float32Array(n),nB:new Float32Array(n)};
  for(let i=10;i<15;i++) for(let j=10;j<15;j++) STATE[63].B[j*25+i]=1;
  // 91: Lorenz
  const pts=[];let lx=0.1,ly=0,lz=0;
  for(let i=0;i<2000;i++){const dt=0.005;lx+=10*(ly-lx)*dt;ly+=(lx*(28-lz)-ly)*dt;lz+=(lx*ly-8/3*lz)*dt;pts.push([lx,ly,lz]);}
  STATE[91]={pts,idx:0};
  // 96: comet trail
  STATE[96]={trail:[]};
}

// ── All 100 frames ──
function registerFrames() {

  // ═══════════════════════════════════════════════════════
  // ROW 0 — RAW OUTPUT: 10 waveforms plotted directly
  // Wave types: classic sine, triangle, square, batman,
  //   noise, stepped sine, sharp peaks, mountain peaks,
  //   valleys, meta sine
  // ═══════════════════════════════════════════════════════

  const row0waves = ['classic sine','triangle','square','batman','noise',
                     'stepped sine','sharp peaks','mountain peaks','valleys','meta sine'];
  const row0colors = [[0,255,180],[255,180,0],[0,200,255],[255,255,0],[200,200,255],
                      [255,100,100],[255,0,180],[100,255,100],[180,100,255],[255,150,50]];
  for (let n = 0; n < 10; n++) {
    FRAMES[n] = ((wv, col) => (t) => {
      noFill(); stroke(col[0],col[1],col[2]); strokeWeight(1.4);
      beginShape();
      for (let x = 0; x < 50; x++) vertex(x, W(x*0.08, {wave:wv, t:t, range:[6,44], seed:n*10}));
      endShape();
      // Tiny label
      noStroke(); fill(col[0],col[1],col[2],120); textSize(4); textAlign(LEFT,BOTTOM);
      text(wv, 2, 49);
    })(row0waves[n], row0colors[n]);
  }

  // ═══════════════════════════════════════════════════════
  // ROW 1 — SHAPE DRIVER: library drives geometry
  // Wave types: wobble sine, bumpy sine, pulse, ramp,
  //   saw up, fade out, fuzzy pulse, offset sine,
  //   zig-zag sine, up down noise
  // ═══════════════════════════════════════════════════════

  // 10: Pulsing circles — wobble sine drives radius
  FRAMES[10] = (t) => {
    noFill(); strokeWeight(1.2);
    for (let i = 0; i < 5; i++) {
      const r = W(t, {wave:'wobble sine', seed:100+i, range:[4,20-i*2]});
      stroke(200-i*30, 100+i*30, 255, 200);
      ellipse(25, 25, r*2, r*2);
    }
  };

  // 11: Morphing polygon — bumpy sine drives vertex radii
  FRAMES[11] = (t) => {
    noFill(); stroke(255,180,100); strokeWeight(1);
    beginShape();
    for (let i = 0; i < 8; i++) {
      const a = i*TWO_PI/8;
      const r = W(a, {wave:'bumpy sine', t:t, seed:110, range:[8,20]});
      vertex(25+cos(a)*r, 25+sin(a)*r);
    }
    endShape(CLOSE);
  };

  // 12: Pulse-driven rectangles — pulse controls width
  FRAMES[12] = (t) => {
    noStroke();
    for (let i = 0; i < 6; i++) {
      const w = W(t, {wave:'pulse', seed:120+i, range:[2,8]});
      const h = W(t*0.7, {wave:'pulse', seed:121+i, range:[3,12]});
      fill(W(i*0.3,{seed:125+i,t:t,range:[80,255]}), 100, 200);
      rect(4+i*7, 25-h/2, w, h, 1);
    }
  };

  // 13: Ramp-driven staircase
  FRAMES[13] = (t) => {
    noStroke();
    for (let i = 0; i < 10; i++) {
      const h = W(i*0.1, {wave:'ramp', t:t, seed:130, range:[2,40]});
      fill(100, W(i*0.3,{seed:131,t:t,range:[100,255]}), 200);
      rect(i*5, 50-h, 4, h);
    }
  };

  // 14: Saw-up driven line fan
  FRAMES[14] = (t) => {
    stroke(0,255,200); strokeWeight(0.8);
    translate(25,25);
    for (let i = 0; i < 12; i++) {
      const len = W(i, {wave:'saw up', t:t, seed:140, range:[5,22]});
      const a = i*TWO_PI/12 + W(t,{wave:'saw up',seed:141,range:[0,0.5]});
      line(0,0,cos(a)*len,sin(a)*len);
    }
  };

  // 15: Fade-out driven dot sizes
  FRAMES[15] = (t) => {
    noStroke();
    for (let i = 0; i < 16; i++) {
      const sz = W(i*0.2, {wave:'fade out', t:t, seed:150, range:[1,8]});
      const x = (i%4)*12+7, y = floor(i/4)*12+7;
      fill(255, W(i,{seed:151,t:t,range:[80,255]}), 100);
      ellipse(x, y, sz, sz);
    }
  };

  // 16: Fuzzy pulse arc segments
  FRAMES[16] = (t) => {
    noFill(); strokeWeight(3);
    for (let i = 0; i < 6; i++) {
      const span = W(t, {wave:'fuzzy pulse', seed:160+i, range:[0.3,2.5]});
      const start = i*TWO_PI/6 + W(t,{seed:165+i,range:[0,1]});
      stroke(W(i,{seed:167+i,t:t,range:[100,255]}), 150, 255);
      arc(25,25,30+i*2,30+i*2,start,start+span);
    }
  };

  // 17: Offset sine triangle sizes
  FRAMES[17] = (t) => {
    noFill(); strokeWeight(0.8);
    for (let i = 0; i < 9; i++) {
      const sz = W(i*0.3, {wave:'offset sine', t:t, seed:170, range:[3,12]});
      const x = (i%3)*16+9, y = floor(i/3)*16+9;
      stroke(255, 200, W(i,{seed:171,t:t,range:[0,255]}));
      push(); translate(x,y); rotate(W(t,{seed:172+i,range:[0,TWO_PI]}));
      triangle(0,-sz, -sz*0.866,sz*0.5, sz*0.866,sz*0.5);
      pop();
    }
  };

  // 18: Zig-zag sine quad distortion
  FRAMES[18] = (t) => {
    noFill(); stroke(0,200,180); strokeWeight(1);
    for (let i = 0; i < 4; i++) {
      const d = W(t, {wave:'zig-zag sine', seed:180+i, range:[-6,6]});
      const y0 = 8+i*10;
      quad(5+d, y0, 45-d, y0+d, 45+d, y0+8, 5-d, y0+8-d);
    }
  };

  // 19: Up-down noise ellipse scatter
  FRAMES[19] = (t) => {
    noStroke();
    for (let i = 0; i < 15; i++) {
      const x = W(i*0.2, {wave:'up down noise', t:t, seed:190, range:[3,47]});
      const y = W(i*0.2, {wave:'up down noise', t:t*0.7, seed:191, range:[3,47]});
      const sz = W(i, {wave:'up down noise', t:t, seed:192, range:[2,7]});
      fill(W(i,{seed:193,t:t,range:[150,255]}), 100, 200, 180);
      ellipse(x, y, sz, sz);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 2 — COLOR ENGINE: library maps to color
  // Wave types: smooth solid sine, half sine, round linked sine,
  //   triangle sine, ramp up sine, grow random, steps,
  //   steps down, squared sine, bald patch
  // ═══════════════════════════════════════════════════════

  // 20: Hue columns — smooth solid sine
  FRAMES[20] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    for (let x = 0; x < 50; x += 2) {
      fill(W(x*0.04, {wave:'smooth solid sine', t:t, seed:200, range:[0,360]})%360, 85, 90);
      rect(x, 0, 2, 50);
    }
    colorMode(RGB);
  };

  // 21: Saturation grid — half sine
  FRAMES[21] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
      const sat = W((r*10+c)*0.03, {wave:'half sine', t:t, seed:210, range:[10,100]});
      fill(260, sat, 90);
      rect(c*5, r*5, 5, 5);
    }
    colorMode(RGB);
  };

  // 22: Brightness rings — round linked sine
  FRAMES[22] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    for (let y = 0; y < 50; y += 2) for (let x = 0; x < 50; x += 2) {
      const d = dist(x,y,25,25);
      const b = W(d*0.05, {wave:'round linked sine', t:t, seed:220, range:[10,100]});
      fill(200, 70, b);
      rect(x, y, 2, 2);
    }
    colorMode(RGB);
  };

  // 23: Alpha waves — triangle sine
  FRAMES[23] = (t) => {
    noStroke();
    for (let i = 0; i < 8; i++) {
      const a = W(i*0.4, {wave:'triangle sine', t:t, seed:230, range:[30,220]});
      const hue = W(i*0.3, {wave:'triangle sine', t:t*0.5, seed:231, range:[0,255]});
      fill(hue, 100, 255, a);
      ellipse(25, 25, 40-i*4, 40-i*4);
    }
  };

  // 24: Complementary flash — ramp up sine
  FRAMES[24] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    const h = W(t, {wave:'ramp up sine', seed:240, range:[0,360]});
    fill(h%360,85,90); rect(0,0,25,50);
    fill((h+180)%360,85,90); rect(25,0,25,50);
    colorMode(RGB);
  };

  // 25: Neon glow — grow random drives intensity
  FRAMES[25] = (t) => {
    noStroke();
    const pulse = W(t, {wave:'grow random', seed:250, range:[0.3,1]});
    for (let i = 6; i >= 0; i--) {
      const a = map(i,6,0,5,200) * pulse;
      fill(255, 0, W(t,{wave:'grow random',seed:251,range:[100,255]}), a);
      ellipse(25, 25, 8+i*6, 8+i*6);
    }
  };

  // 26: Stepped hue blocks — steps
  FRAMES[26] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      const h = W((r*5+c)*0.1, {wave:'steps', t:t, seed:260, range:[0,360]});
      fill(h%360, 80, 85);
      rect(c*10, r*10, 10, 10);
    }
    colorMode(RGB);
  };

  // 27: Descending color — steps down
  FRAMES[27] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    for (let y = 0; y < 50; y += 2) {
      const h = W(y*0.04, {wave:'steps down', t:t, seed:270, range:[0,360]});
      const b = W(y*0.04, {wave:'steps down', t:t*0.5, seed:271, range:[40,100]});
      fill(h%360, 75, b);
      rect(0, y, 50, 2);
    }
    colorMode(RGB);
  };

  // 28: Warm/cool interplay — squared sine
  FRAMES[28] = (t) => {
    noStroke();
    for (let y = 0; y < 50; y += 2) for (let x = 0; x < 50; x += 2) {
      const warm = W(x*0.04, {wave:'squared sine', t:t, seed:280, range:[0,255]});
      const cool = W(y*0.04, {wave:'squared sine', t:t*0.7, seed:281, range:[0,255]});
      fill(warm, 80, cool);
      rect(x, y, 2, 2);
    }
  };

  // 29: Bald patch color gaps
  FRAMES[29] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    for (let x = 0; x < 50; x += 2) {
      const v = W(x*0.06, {wave:'bald patch', t:t, seed:290, range:[0,100]});
      fill((x*7+t*30)%360, v, 90);
      rect(x, 0, 2, 50);
    }
    colorMode(RGB);
  };

  // ═══════════════════════════════════════════════════════
  // ROW 3 — MOTION CONTROL: library drives movement
  // ═══════════════════════════════════════════════════════

  // 30: Orbital speed — saw down controls angular velocity
  FRAMES[30] = (t) => {
    noStroke();
    for (let i = 0; i < 8; i++) {
      const speed = W(t, {wave:'saw down', seed:300+i, range:[0.5,4]});
      const a = t*speed + i*TWO_PI/8;
      const r = 12 + i*1.5;
      fill(W(i,{seed:308+i,t:t,range:[100,255]}), 150, 255);
      ellipse(25+cos(a)*r, 25+sin(a)*r, 4, 4);
    }
  };

  // 31: Pendulum swing — up down pulse drives angle
  FRAMES[31] = (t) => {
    stroke(255,200,100); strokeWeight(1.5);
    const angle = W(t, {wave:'up down pulse', seed:310, range:[-PI/3,PI/3]});
    push(); translate(25,5);
    rotate(angle);
    line(0,0,0,30);
    noStroke(); fill(255,200,100);
    ellipse(0,30,8,8);
    pop();
  };

  // 32: Breathing square — fuzzy peak sine for scale
  FRAMES[32] = (t) => {
    noFill(); strokeWeight(1.5);
    const s = W(t, {wave:'fuzzy peak sine', seed:320, range:[8,40]});
    const rot = W(t, {wave:'fuzzy peak sine', seed:321, range:[0,PI/4]});
    stroke(W(t,{seed:322,wave:'sine',range:[100,255]}), 200, 255);
    push(); translate(25,25); rotate(rot); rectMode(CENTER);
    rect(0,0,s,s);
    pop();
  };

  // 33: Bouncing dots — classic sine x/y motion
  FRAMES[33] = (t) => {
    noStroke();
    for (let i = 0; i < 10; i++) {
      const x = W(t, {wave:'classic sine', seed:330+i, range:[5,45]});
      const y = W(t, {wave:'triangle', seed:340+i, range:[5,45]});
      fill(255, W(i,{seed:350+i,t:t,range:[80,200]}), 100);
      ellipse(x, y, 4, 4);
    }
  };

  // 34: Rotating spokes — noise drives per-spoke rotation
  FRAMES[34] = (t) => {
    stroke(180,255,180); strokeWeight(0.8);
    translate(25,25);
    for (let i = 0; i < 10; i++) {
      const extra = W(i, {wave:'noise', t:t, seed:340, range:[0,PI/2]});
      const a = i*TWO_PI/10 + extra;
      const len = W(i,{wave:'noise',t:t,seed:341,range:[8,22]});
      line(0,0,cos(a)*len,sin(a)*len);
    }
  };

  // 35: Wave rider — object follows waveform path
  FRAMES[35] = (t) => {
    noFill(); stroke(80,80,255,100); strokeWeight(0.8);
    beginShape();
    for (let x = 0; x < 50; x++) vertex(x, W(x*0.08,{wave:'wobble sine',t:t,seed:350,range:[10,40]}));
    endShape();
    const px = (t*15)%50;
    const py = W(px*0.08, {wave:'wobble sine',t:t,seed:350,range:[10,40]});
    noStroke(); fill(255,100,100);
    ellipse(px, py, 6, 6);
  };

  // 36: Jittering grid — mountain peaks drives displacement
  FRAMES[36] = (t) => {
    noStroke();
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      const dx = W(r*5+c, {wave:'mountain peaks', t:t, seed:360, range:[-3,3]});
      const dy = W(r*5+c, {wave:'mountain peaks', t:t*1.3, seed:361, range:[-3,3]});
      fill(W(r*5+c,{seed:362,t:t,range:[120,255]}), 180, 220);
      ellipse(5+c*10+dx, 5+r*10+dy, 5, 5);
    }
  };

  // 37: Metronome — square wave snap between positions
  FRAMES[37] = (t) => {
    const side = W(t, {wave:'square', seed:370, range:[0,1]}) > 0.5;
    noStroke(); fill(255,220,0);
    ellipse(side?12:38, 25, 14, 14);
    stroke(255,220,0,60); strokeWeight(0.5);
    line(25,10,25,40);
  };

  // 38: Spiral arm — ramp drives angular growth
  FRAMES[38] = (t) => {
    noFill(); stroke(200,150,255); strokeWeight(1);
    beginShape();
    for (let i = 0; i < 60; i++) {
      const a = i*0.2 + W(t,{wave:'ramp',seed:380,range:[0,TWO_PI]});
      const r = W(i*0.05, {wave:'saw up', t:t, seed:381, range:[1,22]});
      vertex(25+cos(a)*r, 25+sin(a)*r);
    }
    endShape();
  };

  // 39: Elastic snap — pulse creates sudden movements
  FRAMES[39] = (t) => {
    noStroke();
    for (let i = 0; i < 6; i++) {
      const x = W(t, {wave:'pulse', seed:390+i, range:[8,42]});
      const y = W(t, {wave:'pulse', seed:396+i, range:[8,42]});
      const sz = W(t, {wave:'pulse', seed:402+i, range:[3,10]});
      fill(100+i*25, W(i,{seed:408+i,t:t,range:[100,200]}), 255,180);
      ellipse(x, y, sz, sz);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 4 — PATTERN GENERATOR: library creates structure
  // ═══════════════════════════════════════════════════════

  // 40: Wave-driven checkerboard
  FRAMES[40] = (t) => {
    noStroke();
    const sz = max(3, W(t, {wave:'stepped sine', seed:400, range:[3,10]}));
    for (let y = 0; y < 50; y += sz) for (let x = 0; x < 50; x += sz) {
      const on = (floor(x/sz)+floor(y/sz))%2===0;
      fill(on ? W(t,{seed:401,wave:'sine',range:[180,255]}) : 0);
      rect(x, y, sz, sz);
    }
  };

  // 41: Hex brightness — wave per cell
  FRAMES[41] = (t) => {
    noFill(); strokeWeight(0.6);
    for (let r = 0; r < 7; r++) for (let c = 0; c < 6; c++) {
      const x = c*9+(r%2)*4.5, y = r*7;
      const b = W((r*6+c)*0.08, {wave:'bumpy sine', t:t, seed:410, range:[40,255]});
      stroke(b, b*0.8, 255);
      beginShape();
      for (let i = 0; i < 6; i++) vertex(x+4*cos(i*PI/3), y+4*sin(i*PI/3));
      endShape(CLOSE);
    }
  };

  // 42: Truchet tile selector — wave picks orientation
  FRAMES[42] = (t) => {
    noFill(); stroke(255,180,0); strokeWeight(1.2);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      const pick = W((r*5+c)*0.2, {wave:'square', t:t*0.3, seed:420, range:[0,1]}) > 0.5;
      const x = c*10, y = r*10;
      if (pick) { arc(x,y,10,10,0,HALF_PI); arc(x+10,y+10,10,10,PI,PI+HALF_PI); }
      else { arc(x+10,y,10,10,HALF_PI,PI); arc(x,y+10,10,10,PI+HALF_PI,TWO_PI); }
    }
  };

  // 43: Crosshatch density — wave controls spacing
  FRAMES[43] = (t) => {
    stroke(200,200,255); strokeWeight(0.4);
    const sp = max(2, W(t, {wave:'triangle', seed:430, range:[2,8]}));
    for (let i = -50; i < 100; i += sp) { line(i,0,i+50,50); line(i,50,i+50,0); }
  };

  // 44: Voronoi — wave moves seeds
  FRAMES[44] = (t) => {
    const seeds = [];
    for (let i = 0; i < 7; i++) seeds.push({
      x: W(t, {seed:440+i, wave:'wobble sine', range:[5,45]}),
      y: W(t, {seed:447+i, wave:'bumpy sine', range:[5,45]})
    });
    noStroke();
    for (let y = 0; y < 50; y += 2) for (let x = 0; x < 50; x += 2) {
      let md=999,mi=0;
      for (let i=0;i<seeds.length;i++){const d=dist(x,y,seeds[i].x,seeds[i].y);if(d<md){md=d;mi=i;}}
      fill((mi*50)%256, 180, max(0,240-md*4));
      rect(x, y, 2, 2);
    }
  };

  // 45: Moiré — wave shifts offset
  FRAMES[45] = (t) => {
    noFill(); stroke(255,100); strokeWeight(0.5);
    const off = W(t, {wave:'classic sine', seed:450, range:[-5,5]});
    for (let i = 1; i < 14; i++) {
      ellipse(25, 25, i*7, i*7);
      ellipse(25+off, 25+off*0.5, i*7, i*7);
    }
  };

  // 46: Concentric wave rings
  FRAMES[46] = (t) => {
    noFill(); strokeWeight(1.5);
    for (let i = 0; i < 8; i++) {
      const r = W(i*0.3, {wave:'steps', t:t, seed:460, range:[4,22]});
      stroke(W(i,{seed:461,t:t,range:[100,255]}), 150, 255);
      ellipse(25, 25, r*2, r*2);
    }
  };

  // 47: Diamond lattice — wave drives diamond size
  FRAMES[47] = (t) => {
    noFill(); stroke(255,200,150); strokeWeight(0.7);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      const s = W((r*5+c)*0.15, {wave:'fade out', t:t, seed:470, range:[2,5]});
      const x = 5+c*10, y = 5+r*10;
      quad(x,y-s, x+s,y, x,y+s, x-s,y);
    }
  };

  // 48: Sierpinski depth — wave controls recursion visual
  FRAMES[48] = (t) => {
    noFill(); stroke(255); strokeWeight(0.5);
    translate(25,25); rotate(W(t,{wave:'saw down',seed:480,range:[0,TWO_PI*0.2]}));
    function s(x,y,sz,d){
      if(d===0){triangle(x,y-sz,x-sz*0.866,y+sz*0.5,x+sz*0.866,y+sz*0.5);return;}
      s(x,y-sz/2,sz/2,d-1);s(x-sz*0.433,y+sz/4,sz/2,d-1);s(x+sz*0.433,y+sz/4,sz/2,d-1);
    }
    const depth = floor(W(t*0.3,{wave:'steps',seed:481,range:[1,4.99]}));
    s(0,0,20,depth);
  };

  // 49: Tiled arcs — wave picks start angle
  FRAMES[49] = (t) => {
    noFill(); stroke(0,255,200); strokeWeight(1.5);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      const start = W((r*5+c)*0.2, {wave:'noise', t:t, seed:490, range:[0,TWO_PI]});
      const span = W((r*5+c)*0.2, {wave:'noise', t:t*0.5, seed:491, range:[0.5,PI]});
      arc(c*10+5, r*10+5, 8, 8, start, start+span);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 5 — ORGANIC FORMS: library shapes life
  // ═══════════════════════════════════════════════════════

  // 50: Particle fountain — wave drives ejection
  FRAMES[50] = (t) => {
    noStroke();
    for (let p of STATE[50]) {
      p.vy += 0.08;
      p.x += p.vx; p.y += p.vy; p.life -= 0.015;
      if (p.life <= 0 || p.y > 50) {
        p.x = 25; p.y = 46;
        p.vx = W(t,{wave:'noise',seed:500+floor(random(10)),range:[-2,2]});
        p.vy = W(t,{wave:'sharp peaks',seed:510+floor(random(10)),range:[-4,-1.5]});
        p.life = 1;
      }
      fill(255, W(p.life*5,{seed:520,range:[100,255]}), 50, 255*p.life);
      ellipse(p.x, p.y, 3, 3);
    }
  };

  // 51: Firefly swarm — waves drive drift + glow
  FRAMES[51] = (t) => {
    noStroke();
    for (let f of STATE[51]) {
      f.x += W(t,{wave:'noise',seed:510+STATE[51].indexOf(f),range:[-0.8,0.8]});
      f.y += W(t,{wave:'noise',seed:520+STATE[51].indexOf(f),range:[-0.8,0.8]});
      f.x = (f.x+50)%50; f.y = (f.y+50)%50;
      const glow = W(t+f.phase,{wave:'half sine',seed:530,range:[30,255]});
      fill(255,230,80,glow);
      ellipse(f.x,f.y,W(t,{seed:540+STATE[51].indexOf(f),wave:'sine',range:[2,5]}));
    }
  };

  // 52: Flocking boids — wave modulates cohesion
  FRAMES[52] = (t) => {
    const boids=STATE[52];
    const coh = W(t,{wave:'wobble sine',seed:520,range:[0.005,0.03]});
    for(let b of boids){
      let sx=0,sy=0,ax=0,ay=0,cx=0,cy=0,n=0;
      for(let o of boids){if(o===b)continue;const d=dist(b.x,b.y,o.x,o.y);
        if(d<12){sx+=b.x-o.x;sy+=b.y-o.y;}ax+=o.vx;ay+=o.vy;cx+=o.x;cy+=o.y;n++;}
      if(n>0){ax/=n;ay/=n;cx/=n;cy/=n;
        b.vx+=sx*0.04+(ax-b.vx)*0.04+(cx-b.x)*coh;
        b.vy+=sy*0.04+(ay-b.vy)*0.04+(cy-b.y)*coh;}
      const sp=sqrt(b.vx*b.vx+b.vy*b.vy);if(sp>2){b.vx=b.vx/sp*2;b.vy=b.vy/sp*2;}
      b.x+=b.vx;b.y+=b.vy;b.x=(b.x+50)%50;b.y=(b.y+50)%50;
    }
    fill(255); noStroke();
    for(let b of boids){push();translate(b.x,b.y);rotate(atan2(b.vy,b.vx));triangle(3,0,-2,-2,-2,2);pop();}
  };

  // 53: Brownian trail — wave drives step size
  FRAMES[53] = (t) => {
    const s = STATE[53];
    const step = W(t,{wave:'up down noise',seed:530,range:[0.5,3]});
    s.x += random(-step,step); s.y += random(-step,step);
    s.x = constrain(s.x,2,48); s.y = constrain(s.y,2,48);
    s.trail.push([s.x,s.y]); if(s.trail.length>80) s.trail.shift();
    noFill();
    for(let i=1;i<s.trail.length;i++){
      stroke(0, W(i*0.05,{seed:531,t:t,range:[100,255]}), 220, map(i,0,s.trail.length,20,220));
      strokeWeight(0.8); line(s.trail[i-1][0],s.trail[i-1][1],s.trail[i][0],s.trail[i][1]);
    }
  };

  // 54: Gravity orbiter — wave modulates gravity strength
  FRAMES[54] = (t) => {
    noStroke();
    const grav = W(t,{wave:'meta sine',seed:540,range:[0.5,4]});
    for(let p of STATE[54]){
      const dx=25-p.x,dy=25-p.y,d=max(3,sqrt(dx*dx+dy*dy)),f=grav/(d*d);
      p.vx+=dx*f;p.vy+=dy*f;p.x+=p.vx;p.y+=p.vy;
      if(d<3){p.x=random(5,45);p.y=random(5,45);p.vx=random(-0.5,0.5);p.vy=random(-0.5,0.5);}
      fill(180,200,255,180); ellipse(p.x,p.y,2.5,2.5);
    }
    fill(W(t,{seed:541,wave:'sine',range:[200,255]}),180,50); ellipse(25,25,5,5);
  };

  // 55: Bouncing balls — wave drives elasticity
  FRAMES[55] = (t) => {
    const bounce = W(t,{wave:'ramp up sine',seed:550,range:[0.7,1.0]});
    noStroke();
    for(let b of STATE[55]){
      b.x+=b.vx;b.y+=b.vy;
      if(b.x<3||b.x>47){b.vx*=-bounce;b.x=constrain(b.x,3,47);}
      if(b.y<3||b.y>47){b.vy*=-bounce;b.y=constrain(b.y,3,47);}
      fill(W(STATE[55].indexOf(b),{seed:551,t:t,range:[100,255]}),180,255);
      ellipse(b.x,b.y,5,5);
    }
  };

  // 56: Blob creature — wave shapes radial outline
  FRAMES[56] = (t) => {
    noStroke();
    fill(W(t,{seed:560,wave:'sine',range:[80,200]}), 220, 150);
    beginShape();
    for (let a = 0; a <= TWO_PI; a += 0.15) {
      const r = W(a, {wave:'bumpy sine', t:t, seed:561, range:[8,18]})
              + W(a*2, {wave:'noise', t:t*0.5, seed:562, range:[-3,3]});
      vertex(25+cos(a)*r, 25+sin(a)*r);
    }
    endShape(CLOSE);
    // Eyes
    fill(0); ellipse(22,22,3,3); ellipse(28,22,3,3);
  };

  // 57: Tendril growth — wave controls curl
  FRAMES[57] = (t) => {
    noFill(); strokeWeight(1);
    for (let j = 0; j < 3; j++) {
      stroke(80, W(j,{seed:570+j,t:t,range:[150,255]}), 100);
      let x = 25, y = 48;
      beginShape();
      for (let i = 0; i < 25; i++) {
        const angle = W(i*0.15, {wave:'zig-zag sine', t:t+j, seed:573+j, range:[-PI/3,PI/3]}) - PI/2;
        x += cos(angle)*2; y += sin(angle)*2;
        vertex(x,y);
      }
      endShape();
    }
  };

  // 58: Ripple pond — wave controls ring spacing
  FRAMES[58] = (t) => {
    noFill(); strokeWeight(1.2);
    const spacing = W(t, {wave:'triangle sine', seed:580, range:[4,10]});
    for (let i = 0; i < 6; i++) {
      const r = ((t*8+i*spacing)%40);
      stroke(100,180,255,max(0,255-r*7));
      ellipse(25, 25, r*2, r*2);
    }
  };

  // 59: DNA helix — waves for two strands
  FRAMES[59] = (t) => {
    strokeWeight(1.5);
    for (let y = 0; y < 50; y += 2) {
      const x1 = 25 + W(y*0.08, {wave:'classic sine', t:t, seed:590, range:[-12,12]});
      const x2 = 25 + W(y*0.08, {wave:'classic sine', t:t, seed:590, range:[-12,12], phase:PI});
      const depth1 = W(y*0.08,{wave:'sine',t:t,seed:591,range:[0,1]});
      stroke(255*depth1,100,255*(1-depth1)); point(x1,y);
      stroke(255*(1-depth1),100,255*depth1); point(x2,y);
      if (y%6===0) { stroke(255,80); line(x1,y,x2,y); }
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 6 — TEXTURE & PIXELS: library per-pixel
  // ═══════════════════════════════════════════════════════

  // 60: Plasma field — two wave calls per pixel
  FRAMES[60] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    for (let y=0;y<50;y+=2) for (let x=0;x<50;x+=2) {
      const v1 = W(x*0.06,{wave:'classic sine',t:t,seed:600,range:[-1,1]});
      const v2 = W(y*0.06,{wave:'meta sine',t:t*0.7,seed:601,range:[-1,1]});
      fill(((v1+v2+2)*90)%360,85,90);
      rect(x,y,2,2);
    }
    colorMode(RGB);
  };

  // 61: Row displacement — wave shifts each row
  FRAMES[61] = (t) => {
    noStroke();
    for (let y=0;y<50;y+=2) {
      const dx = W(y*0.08,{wave:'zig-zag sine',t:t,seed:610,range:[-10,10]});
      for (let x=0;x<50;x+=2) {
        const v = map((x+dx+50)%50,0,50,50,255);
        fill(v,100,255-v); rect(x,y,2,2);
      }
    }
  };

  // 62: Conway Life — wave reseeds pattern
  FRAMES[62] = (t,fc) => {
    const s=STATE[62];
    if(fc%3===0){
      s.n.fill(0);let alive=0;
      for(let y=0;y<25;y++)for(let x=0;x<25;x++){
        let c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;c+=s.g[((y+dy+25)%25)*25+((x+dx+25)%25)];}
        const i=y*25+x;s.n[i]=s.g[i]?(c===2||c===3?1:0):(c===3?1:0);alive+=s.n[i];
      }
      [s.g,s.n]=[s.n,s.g];s.age++;
      if(alive<5||s.age>150){
        const density=W(t,{wave:'noise',seed:620,range:[0.2,0.5]});
        for(let i=0;i<625;i++)s.g[i]=random()<density?1:0;s.age=0;
      }
    }
    noStroke();
    const hue = W(t,{wave:'smooth solid sine',seed:621,range:[30,60]});
    for(let y=0;y<25;y++)for(let x=0;x<25;x++) if(s.g[y*25+x]){
      fill(255,hue+150,hue); rect(x*2,y*2,2,2);
    }
  };

  // 63: Reaction diffusion — wave tunes feed rate
  FRAMES[63] = (t,fc) => {
    const s=STATE[63];
    const feed=0.04+W(t*0.1,{wave:'sine',seed:630,range:[0,0.03]});
    const kill=0.06+W(t*0.1,{wave:'sine',seed:631,range:[0,0.005]});
    for(let iter=0;iter<2;iter++){
      s.nA.set(s.A);s.nB.set(s.B);
      for(let y=1;y<24;y++)for(let x=1;x<24;x++){
        const i=y*25+x;
        const lA=s.A[i-1]+s.A[i+1]+s.A[i-25]+s.A[i+25]-4*s.A[i];
        const lB=s.B[i-1]+s.B[i+1]+s.B[i-25]+s.B[i+25]-4*s.B[i];
        const ab=s.A[i]*s.B[i]*s.B[i];
        s.nA[i]=constrain(s.A[i]+(1.0*lA-ab+feed*(1-s.A[i]))*0.8,0,1);
        s.nB[i]=constrain(s.B[i]+(0.5*lB+ab-(kill+feed)*s.B[i])*0.8,0,1);
      }
      [s.A,s.nA]=[s.nA,s.A];[s.B,s.nB]=[s.nB,s.B];
    }
    noStroke();
    for(let y=0;y<25;y++)for(let x=0;x<25;x++){
      const v=s.A[y*25+x]-s.B[y*25+x];
      fill(0,map(v,-1,1,0,255),map(v,-1,1,100,200));rect(x*2,y*2,2,2);
    }
  };

  // 64: Perlin + wave blend
  FRAMES[64] = (t) => {
    noStroke();
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      const n = noise(x*0.08,y*0.08,t*0.3);
      const w = W((x+y)*0.02,{wave:'valleys',t:t,seed:640,range:[0,1]});
      fill((n*0.5+w*0.5)*255); rect(x,y,2,2);
    }
  };

  // 65: XOR + wave scroll
  FRAMES[65] = (t) => {
    noStroke();
    const off = floor(W(t,{wave:'saw up',seed:650,range:[0,50]}));
    const hShift = W(t,{wave:'triangle',seed:651,range:[0,100]});
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      const v=((x+off)^y)%256;
      fill(v, v*0.6+hShift, 255-v); rect(x,y,2,2);
    }
  };

  // 66: Horizontal scanlines — wave amplitude
  FRAMES[66] = (t) => {
    noStroke();
    for(let y=0;y<50;y++){
      const b = W(y*0.06,{wave:'sharp peaks',t:t,seed:660,range:[0,255]});
      fill(b, b*0.7, W(y*0.06,{seed:661,t:t,wave:'sine',range:[100,255]}));
      rect(0,y,50,1);
    }
  };

  // 67: Sine interference — two waves multiplied
  FRAMES[67] = (t) => {
    noStroke();
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      const v1=W(x*0.06,{wave:'sine',t:t,seed:670,range:[-1,1]});
      const v2=W(y*0.06,{wave:'triangle',t:t*0.8,seed:671,range:[-1,1]});
      fill(128+127*v1*v2); rect(x,y,2,2);
    }
  };

  // 68: Mandelbrot — wave shifts color palette
  FRAMES[68] = (t) => {
    noStroke();
    const palOff = W(t,{wave:'ramp',seed:680,range:[0,256]});
    for(let py=0;py<50;py+=2)for(let px=0;px<50;px+=2){
      let x0=map(px,0,50,-2,1),y0=map(py,0,50,-1.2,1.2),x=0,y=0,i=0;
      while(x*x+y*y<4&&i<30){const xt=x*x-y*y+x0;y=2*x*y+y0;x=xt;i++;}
      if(i===30)fill(0);
      else{const c=(i*8+palOff)%256;fill(c,c*0.6,255-c);}
      rect(px,py,2,2);
    }
  };

  // 69: Column sort threshold — wave drives boundary
  FRAMES[69] = (t) => {
    noStroke();
    const thr = W(t,{wave:'ramp up sine',seed:690,range:[50,200]});
    for(let y=0;y<50;y+=2){
      const vals=[];for(let x=0;x<25;x++)vals.push(noise(x*0.2,y*0.15)*255);
      const sorted=[...vals].sort((a,b)=>a-b);
      for(let x=0;x<25;x++){
        const v=vals[x]>thr?sorted[x]:vals[x];
        fill(v,v*0.5,W(y*0.04,{seed:691,t:t,range:[100,255]}));
        rect(x*2,y,2,2);
      }
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 7 — COMPOSITION: multiple wave calls combined
  // ═══════════════════════════════════════════════════════

  // 70: Triple wave interference — 3 radial sources
  FRAMES[70] = (t) => {
    noStroke();
    const cx1=15,cy1=15,cx2=35,cy2=15,cx3=25,cy3=38;
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      const v1=W(dist(x,y,cx1,cy1)*0.1,{wave:'sine',t:t,seed:700,range:[-1,1]});
      const v2=W(dist(x,y,cx2,cy2)*0.1,{wave:'triangle',t:t,seed:701,range:[-1,1]});
      const v3=W(dist(x,y,cx3,cy3)*0.1,{wave:'square',t:t*0.5,seed:702,range:[-1,1]});
      fill(map(v1+v2+v3,-3,3,0,255),100,map(v1+v2+v3,-3,3,200,50));
      rect(x,y,2,2);
    }
  };

  // 71: Layered wave landscape — 5 mountain layers
  FRAMES[71] = (t) => {
    noStroke();
    const waves = ['valleys','mountain peaks','noise','bumpy sine','sharp peaks'];
    for(let layer=0;layer<5;layer++){
      fill(20+layer*20, 40+layer*25, 60+layer*30, map(layer,0,4,80,240));
      beginShape(); vertex(0,50);
      for(let x=0;x<=50;x+=2){
        const y = 10+layer*8 + W(x*0.04,{wave:waves[layer],t:t*0.2+layer*0.5,seed:710+layer,range:[-8,8]});
        vertex(x,y);
      }
      vertex(50,50); endShape(CLOSE);
    }
  };

  // 72: Oscilloscope X/Y — two waves as Lissajous
  FRAMES[72] = (t) => {
    noFill(); stroke(0,255,100); strokeWeight(1);
    beginShape();
    for(let i=0;i<100;i++){
      const u=i*0.05;
      const x=25+W(u,{wave:'wobble sine',t:t,seed:720,range:[-20,20]});
      const y=25+W(u,{wave:'batman',t:t,seed:721,range:[-20,20]});
      vertex(x,y);
    }
    endShape();
    stroke(0,255,100,30);strokeWeight(0.5);for(let y=0;y<50;y+=4)line(0,y,50,y);
  };

  // 73: Chained wave — output of one feeds another
  FRAMES[73] = (t) => {
    noFill(); stroke(255,150,200); strokeWeight(1.2);
    beginShape();
    for(let x=0;x<50;x++){
      const w1 = W(x*0.06,{wave:'sine',t:t,seed:730,range:[0,5]});
      const w2 = W(w1,{wave:'noise',t:t,seed:731,range:[10,40]});
      vertex(x,w2);
    }
    endShape();
  };

  // 74: Wave grid — different wave per row and column
  FRAMES[74] = (t) => {
    noStroke();
    const rowWaves=['sine','square','triangle','ramp','noise'];
    const colWaves=['pulse','steps','fade out','saw up','batman'];
    for(let r=0;r<5;r++)for(let c=0;c<5;c++){
      const rv=W(c*0.3,{wave:rowWaves[r],t:t,seed:740+r,range:[0,255]});
      const cv=W(r*0.3,{wave:colWaves[c],t:t*0.8,seed:745+c,range:[0,255]});
      fill(rv,100,cv); rect(c*10,r*10,10,10);
    }
  };

  // 75: Additive glow layers — 4 waves, blendMode ADD
  FRAMES[75] = (t) => {
    noStroke(); blendMode(ADD);
    const wvs=['classic sine','bumpy sine','wobble sine','meta sine'];
    const cols=[[255,0,0],[0,255,0],[0,0,255],[255,255,0]];
    for(let i=0;i<4;i++){
      const x=W(t,{wave:wvs[i],seed:750+i,range:[10,40]});
      const y=W(t,{wave:wvs[i],seed:754+i,range:[10,40]});
      fill(cols[i][0],cols[i][1],cols[i][2],80);
      ellipse(x,y,20,20);
    }
    blendMode(BLEND);
  };

  // 76: Beat sequencer — stepped wave as rhythm
  FRAMES[76] = (t) => {
    noStroke();
    for(let r=0;r<4;r++){
      const active = floor(W(t*2,{wave:'steps',seed:760+r,range:[0,7.99]}));
      for(let c=0;c<8;c++){
        fill(c===active?color(255,W(r,{seed:764+r,t:t,range:[100,255]}),0):color(30));
        rect(c*6+1, r*12+2, 5, 10, 1);
      }
    }
  };

  // 77: Moiré wave overlay — two wave-driven stripe sets
  FRAMES[77] = (t) => {
    stroke(255,80); strokeWeight(0.5);
    for(let i=0;i<25;i++){
      const y1=W(i*0.15,{wave:'sine',t:t,seed:770,range:[0,50]});
      line(0,y1,50,y1);
      const y2=W(i*0.15,{wave:'triangle',t:t*1.1,seed:771,range:[0,50]});
      line(0,y2,50,y2);
    }
  };

  // 78: Typewriter — wave picks characters + cursor blink
  FRAMES[78] = (t) => {
    fill(0,255,0); noStroke(); textSize(7); textFont('monospace'); textAlign(LEFT,CENTER);
    const chars = 'WAVES';
    let s = '';
    for(let i=0;i<5;i++){
      const show = W(t*2,{wave:'steps',seed:780,range:[0,5.99]}) > i;
      if(show) s += chars[i];
    }
    const blink = W(t,{wave:'square',seed:781,range:[0,1]})>0.5?'_':'';
    text(s+blink, 5, 25);
  };

  // 79: Wave terrain map — createSampler for performance
  FRAMES[79] = (t) => {
    noStroke();
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      const h=W((x+y*50)*0.001,{wave:'mountain peaks',t:t*0.3,seed:790,range:[0,255]});
      const w=W((x-y+50)*0.01,{wave:'valleys',t:t*0.2,seed:791,range:[0,1]});
      // Terrain coloring: low=blue, mid=green, high=white
      if(h<80) fill(30,30,h+100);
      else if(h<180) fill(30,h*0.5+50,30);
      else fill(h,h,h);
      rect(x,y,2,2);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 8 — SPATIAL & 3D: library drives depth
  // ═══════════════════════════════════════════════════════

  // 80: Isometric cubes — wave controls heights
  FRAMES[80] = (t) => {
    noStroke();
    for(let r=0;r<3;r++)for(let c=0;c<3;c++){
      const h=W(r*3+c,{wave:'mountain peaks',seed:800,t:t,range:[4,18]});
      const ix=12+(c-r)*8,iy=20+(c+r)*5-h;
      fill(W(r*3+c,{seed:801,t:t,range:[120,200]}),180,255);
      quad(ix,iy,ix+8,iy-4,ix,iy-8,ix-8,iy-4);
      fill(60,100,W(r*3+c,{seed:802,t:t,range:[140,200]}));
      quad(ix-8,iy-4,ix,iy,ix,iy+h*0.5,ix-8,iy+h*0.5-4);
      fill(30,60,W(r*3+c,{seed:803,t:t,range:[100,160]}));
      quad(ix,iy,ix+8,iy-4,ix+8,iy+h*0.5-4,ix,iy+h*0.5);
    }
  };

  // 81: Tunnel zoom — wave controls ring speed
  FRAMES[81] = (t) => {
    noFill(); strokeWeight(1); rectMode(CENTER);
    for(let i=0;i<8;i++){
      const speed = W(i,{wave:'saw up',seed:810,t:t,range:[0.3,1.2]});
      const phase=(t*speed+i*0.125)%1;
      stroke(255,255*(1-phase));
      rect(25,25,phase*45,phase*45);
    }
  };

  // 82: Wireframe cube — wave drives rotation speeds
  FRAMES[82] = (t) => {
    stroke(255); strokeWeight(0.8); noFill();
    const s=12;
    const rX = W(t,{wave:'sine',seed:820,range:[0,TWO_PI]});
    const rY = W(t,{wave:'triangle',seed:821,range:[0,TWO_PI]});
    const ca=cos(rX),sa=sin(rX),cb=cos(rY),sb=sin(rY);
    const pts=[[-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],[-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]];
    const proj=pts.map(([x,y,z])=>{let x1=x*ca-z*sa,z1=x*sa+z*ca,y1=y*cb-z1*sb;return[25+x1,25+y1];});
    const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    for(let[a,b]of edges)line(proj[a][0],proj[a][1],proj[b][0],proj[b][1]);
  };

  // 83: Sphere of dots — wave modulates spin
  FRAMES[83] = (t) => {
    noStroke();
    const spin = W(t,{wave:'wobble sine',seed:830,range:[0.1,0.8]});
    for(let i=0;i<50;i++){
      const y=-1+2*i/50,r=sqrt(1-y*y),phi=i*2.399+t*spin;
      const x3=r*cos(phi),z3=r*sin(phi);
      const ca=cos(t*0.2),sa=sin(t*0.2);
      const x4=x3*ca-z3*sa,z4=x3*sa+z3*ca;
      fill(map(z4,-1,1,60,255),W(i*0.1,{seed:831,t:t,range:[100,200]}),255);
      ellipse(25+x4*18,25+y*18,map(z4,-1,1,1,3.5));
    }
  };

  // 84: Parallax layers — wave drives scroll speed
  FRAMES[84] = (t) => {
    noStroke();
    for(let layer=0;layer<4;layer++){
      const speed = W(layer*0.5,{wave:'ramp',seed:840,t:t*0.1,range:[0.2,1.5]});
      const b = 30+layer*40;
      fill(b*0.3, b*0.5, b, 180);
      for(let x=-10;x<60;x+=14) rect(((x+t*speed*25)%65)-5, 40-layer*8, 7, 10+layer*3);
    }
  };

  // 85: Fog mountains — wave per silhouette layer
  FRAMES[85] = (t) => {
    noStroke();
    const waves=['valleys','mountain peaks','noise','bumpy sine','sharp peaks'];
    for(let l=0;l<5;l++){
      fill(30+l*18, 50+l*25, 70+l*30, map(l,0,4,50,230));
      beginShape();vertex(0,50);
      for(let x=0;x<=50;x+=2)
        vertex(x, 12+l*7+W(x*0.04,{wave:waves[l],t:t*0.15+l*0.7,seed:850+l,range:[-10,10]}));
      vertex(50,50);endShape(CLOSE);
    }
  };

  // 86: Star field depth — wave controls twinkle + size
  FRAMES[86] = (t) => {
    noStroke();
    for(let i=0;i<40;i++){
      const x=(i*13.7+5)%50, y=(i*17.3+3)%50;
      const depth = W(i*0.1,{wave:'noise',seed:860,t:0,range:[0,1]});
      const twinkle = W(t*3+i,{wave:'half sine',seed:861+i,range:[0.3,1]});
      fill(255,255,W(i,{seed:862,t:t,range:[200,255]}), 255*twinkle);
      ellipse(x,y, 0.5+depth*2.5);
    }
  };

  // 87: Rotating 3D ring — wave drives ring wobble
  FRAMES[87] = (t) => {
    noFill(); stroke(200,150,255); strokeWeight(1);
    const wobble = W(t,{wave:'bumpy sine',seed:870,range:[0,0.3]});
    beginShape();
    for(let a=0;a<=TWO_PI;a+=0.1){
      const x=cos(a)*18;
      const z=sin(a)*18;
      const y=sin(a*3+t)*4*wobble;
      const ca=cos(t*0.5),sa=sin(t*0.5);
      const x2=x*ca-z*sa;
      vertex(25+x2,25+y+sin(a)*W(a,{seed:871,t:t,range:[-3,3]}));
    }
    endShape(CLOSE);
  };

  // 88: Depth circles — wave controls z-order opacity
  FRAMES[88] = (t) => {
    noStroke();
    for(let i=0;i<12;i++){
      const z=W(i*0.3,{wave:'sine',t:t,seed:880+i,range:[0,1]});
      const x=W(t,{wave:'noise',seed:884+i,range:[10,40]});
      const y=W(t,{wave:'noise',seed:896+i,range:[10,40]});
      fill(W(i,{seed:908+i,t:t,range:[100,255]}),150,255, z*200+30);
      ellipse(x,y, 4+z*8);
    }
  };

  // 89: Infinite corridor — wave controls perspective taper
  FRAMES[89] = (t) => {
    noFill(); strokeWeight(1);
    for(let i=0;i<10;i++){
      const depth = W(i*0.3,{wave:'fade out',t:t*0.3,seed:890,range:[0.1,1]});
      const s = depth*40;
      stroke(255, W(i,{seed:891,t:t,range:[50,200]}), 150, 255*depth);
      rectMode(CENTER); rect(25,25,s,s);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 9 — EXTREMES: push the library to its limits
  // ═══════════════════════════════════════════════════════

  // 90: All 34 waves stacked — visual index
  FRAMES[90] = (t) => {
    noFill(); strokeWeight(0.7);
    const scroll = (t*4)%170;
    const allWaves=['classic sine','sine','sharp peaks','square','pulse','stepped sine',
      'mountain peaks','valleys','zig-zag sine','batman','offset sine','steps down','steps',
      'squared sine','bumpy sine','wobble sine','up down noise','meta sine','triangle','ramp',
      'saw down','saw up','fade out','grow random','noise','fuzzy pulse','up down pulse',
      'bald patch','fuzzy peak sine','ramp up sine','triangle sine','round linked sine',
      'half sine','smooth solid sine'];
    for(let w=0;w<34;w++){
      const y=w*5-scroll; if(y<-5||y>50) continue;
      stroke((w*10.5)%256,180,220);
      beginShape();
      for(let x=0;x<50;x+=2)vertex(x,W(x*0.08,{wave:allWaves[w],t:t,seed:w,range:[y,y+4]}));
      endShape();
    }
  };

  // 91: Lorenz + wave color — chaotic attractor
  FRAMES[91] = (t) => {
    const s=STATE[91];
    s.idx=(s.idx+3)%s.pts.length;
    noFill(); strokeWeight(0.6);
    for(let i=max(0,s.idx-200);i<s.idx-1;i++){
      const p=s.pts[i],q=s.pts[i+1];
      stroke(W(i*0.01,{wave:'sine',t:t,seed:910,range:[150,255]}),80,
             W(i*0.01,{wave:'triangle',t:t,seed:911,range:[50,200]}));
      line(25+p[0]*0.8,40-p[2]*0.55, 25+q[0]*0.8,40-q[2]*0.55);
    }
  };

  // 92: Frequency sweep — same wave, 10 frequencies
  FRAMES[92] = (t) => {
    noFill(); strokeWeight(1);
    for(let i=0;i<10;i++){
      stroke((i*25)%256, 200, 255, 180);
      const freq = 0.02 + i*0.015;
      beginShape();
      for(let x=0;x<50;x++)vertex(x,5+i*4.5+W(x*freq,{wave:'sine',t:t,seed:920,range:[-2,2]}));
      endShape();
    }
  };

  // 93: Seed space — same wave, 25 different seeds
  FRAMES[93] = (t) => {
    noStroke();
    for(let r=0;r<5;r++)for(let c=0;c<5;c++){
      const v=W(t,{wave:'noise',seed:r*5+c,range:[0,255]});
      fill(v,v*0.7,255-v); rect(c*10,r*10,10,10);
    }
  };

  // 94: Wave as Truchet + Voronoi + flow hybrid
  FRAMES[94] = (t) => {
    noFill(); strokeWeight(0.8);
    for(let r=0;r<5;r++)for(let c=0;c<5;c++){
      const angle=W((r*5+c)*0.2,{wave:'offset sine',t:t,seed:940,range:[0,TWO_PI]});
      const x=c*10+5,y=r*10+5;
      stroke(W(r*5+c,{seed:941,t:t,range:[100,255]}),180,255);
      push();translate(x,y);rotate(angle);
      line(-4,0,4,0);line(3,-1.5,4,0);line(3,1.5,4,0);
      pop();
    }
  };

  // 95: Kaleidoscope — 6-fold symmetry driven by waves
  FRAMES[95] = (t) => {
    noStroke();
    for(let seg=0;seg<6;seg++){
      const base=seg*TWO_PI/6+W(t,{wave:'sine',seed:950,range:[0,0.3]});
      for(let i=0;i<5;i++){
        const r=W(i*0.5,{wave:'bumpy sine',t:t,seed:951+seg,range:[4,20]});
        const a=base+i*0.2;
        fill((seg*60+i*30)%256,W(i,{seed:955+seg,t:t,range:[100,200]}),240,180);
        ellipse(25+cos(a)*r,25+sin(a)*r,W(i,{seed:960+seg,t:t,range:[2,6]}));
      }
    }
  };

  // 96: Comet trail — wave drives trajectory
  FRAMES[96] = (t) => {
    const s=STATE[96];
    const cx=25+W(t,{wave:'wobble sine',seed:960,range:[-18,18]});
    const cy=25+W(t,{wave:'meta sine',seed:961,range:[-18,18]});
    s.trail.unshift({x:cx,y:cy}); if(s.trail.length>30) s.trail.pop();
    noStroke();
    for(let i=0;i<s.trail.length;i++){
      const a=map(i,0,s.trail.length,255,0);
      fill(255,W(i*0.2,{seed:962,t:t,range:[100,200]}),50,a);
      ellipse(s.trail[i].x,s.trail[i].y,map(i,0,s.trail.length,6,1));
    }
  };

  // 97: Analog clock — wave as second hand smoothing
  FRAMES[97] = (t) => {
    translate(25,25); noFill();
    stroke(W(t,{seed:970,wave:'sine',range:[150,255]})); strokeWeight(0.5);
    ellipse(0,0,44,44);
    for(let i=0;i<12;i++){const a=i*TWO_PI/12-HALF_PI;line(cos(a)*19,sin(a)*19,cos(a)*21,sin(a)*21);}
    const s=second(),m=minute(),h=hour()%12;
    strokeWeight(2);const ha=(h+m/60)*TWO_PI/12-HALF_PI;
    stroke(255);line(0,0,cos(ha)*10,sin(ha)*10);
    strokeWeight(1.2);const ma=(m+s/60)*TWO_PI/60-HALF_PI;
    line(0,0,cos(ma)*15,sin(ma)*15);
    stroke(255,50,50);strokeWeight(0.5);
    const smooth=W(t,{wave:'smooth solid sine',seed:971,range:[0,TWO_PI]});
    const sa2=s*TWO_PI/60-HALF_PI+sin(smooth)*0.02;
    line(0,0,cos(sa2)*18,sin(sa2)*18);
  };

  // 98: Maximum W density — every pixel from chained waves
  FRAMES[98] = (t) => {
    noStroke();
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      const r=W(x*0.04,{wave:'sharp peaks',t:t,seed:980,range:[0,255]});
      const g=W(y*0.04,{wave:'valleys',t:t*0.8,seed:981,range:[0,255]});
      const b=W((x+y)*0.02,{wave:'batman',t:t*0.5,seed:982,range:[0,255]});
      fill(r,g,b); rect(x,y,2,2);
    }
  };

  // 99: The wave of waves — one wave modulates another's params
  FRAMES[99] = (t) => {
    noFill(); strokeWeight(1.5);
    // Wave 1's output controls wave 2's frequency
    const freq = W(t,{wave:'sine',seed:990,range:[0.02,0.15]});
    // Wave 2's output controls wave 3's range
    stroke(255,200,100);
    beginShape();
    for(let x=0;x<50;x++){
      const mid = W(x*freq,{wave:'triangle',t:t,seed:991,range:[15,35]});
      const final = W(x*0.08,{wave:'noise',t:t,seed:992,range:[mid-8,mid+8]});
      vertex(x,final);
    }
    endShape();
    // Second chain with different waves
    stroke(100,200,255);
    beginShape();
    for(let x=0;x<50;x++){
      const phase = W(t,{wave:'ramp',seed:993,range:[0,PI]});
      const y = W(x*0.06,{wave:'wobble sine',t:t,seed:994,range:[10,40],phase:phase});
      vertex(x,y);
    }
    endShape();
  };
}
