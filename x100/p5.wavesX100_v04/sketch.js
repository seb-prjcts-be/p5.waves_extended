// p5-grid v04 — 100 Ways to Use p5.waves (wildly creative edition)
// Every frame: library as ENGINE, not decoration.

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
function windowResized() { resizeCanvas(windowWidth, windowHeight); }

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
    push(); ctx.save();
    ctx.beginPath(); ctx.rect(cx, cy, SZ, SZ); ctx.clip();
    translate(cx, cy);
    if (FRAMES[i]) { try { FRAMES[i](t, fc); } catch(e) {} }
    ctx.restore(); pop();
  }
}

function W(c, o) { return Waves.wave(c, o); }

// ── Stateful frames ──
function initState() {
  // 50: ant colony
  STATE[50] = Array.from({length:15},()=>({x:25,y:25,a:random(TWO_PI)}));
  // 51: wave-driven L-system turtle
  STATE[51] = {trail:[],age:0};
  // 52: growing crystal
  STATE[52] = {pts:[[25,25]],age:0};
  // 53: wave erosion landscape
  STATE[53] = new Float32Array(50).fill(0).map((_,i)=>20+10*sin(i*0.3));
  // 54: flocking fish
  STATE[54] = Array.from({length:8},()=>({x:random(5,45),y:random(5,45),vx:random(-1,1),vy:random(-1,1)}));
  // 55: lightning branches
  STATE[55] = {branches:[],timer:0};
  // 56: wave pendulum array
  STATE[56] = Array.from({length:7},(_,i)=>({len:10+i*2,a:PI/4,v:0}));
  // 60: wave-driven Game of Life
  STATE[60] = {g:new Uint8Array(625),n:new Uint8Array(625),age:0};
  for(let i=0;i<625;i++) STATE[60].g[i]=random()<0.4?1:0;
  // 61: reaction-diffusion
  const n=625;STATE[61]={A:new Float32Array(n).fill(1),B:new Float32Array(n).fill(0),nA:new Float32Array(n),nB:new Float32Array(n)};
  for(let i=8;i<17;i++)for(let j=8;j<17;j++)STATE[61].B[j*25+i]=1;
  // 85: galaxy spiral
  STATE[85]={stars:Array.from({length:60},(_,i)=>({a:random(TWO_PI),r:random(2,22),speed:random(0.2,0.8)}))};
  // 92: seismograph
  STATE[92]={buf:new Float32Array(50).fill(25)};
  // 95: comet swarm
  STATE[95]=Array.from({length:4},()=>({trail:[],phase:random(TWO_PI)}));
  // 98: wave DNA
  STATE[98]={rot:0};
}

function registerFrames() {

  // ═══════════════════════════════════════════════════════
  // ROW 0 — RAW: Waveform fingerprints (unusual rendering)
  // ═══════════════════════════════════════════════════════

  // 0: Circular waveform — wave plotted as polar radius
  FRAMES[0] = (t) => {
    noFill(); stroke(255,80,200); strokeWeight(1);
    beginShape();
    for(let a=0;a<=TWO_PI;a+=0.08){
      const r=W(a*2,{wave:'batman',t:t,seed:0,range:[6,20]});
      vertex(25+cos(a)*r,25+sin(a)*r);
    }
    endShape(CLOSE);
  };

  // 1: Waveform as bar chart — stepped sine
  FRAMES[1] = (t) => {
    noStroke();
    for(let i=0;i<10;i++){
      const h=W(i*0.3,{wave:'stepped sine',t:t,seed:10,range:[3,45]});
      fill(W(i,{seed:11,t:t,range:[80,255]}),100,200);
      rect(i*5,50-h,4,h);
    }
  };

  // 2: Waveform as dot matrix — noise values as dot sizes
  FRAMES[2] = (t) => {
    noStroke();
    for(let r=0;r<10;r++)for(let c=0;c<10;c++){
      const sz=W((r*10+c)*0.05,{wave:'noise',t:t,seed:20,range:[0.5,5]});
      fill(255,W(r*10+c,{seed:21,t:t,range:[100,255]}),150);
      ellipse(c*5+2.5,r*5+2.5,sz);
    }
  };

  // 3: Twin waveforms — classic sine vs batman overlay
  FRAMES[3] = (t) => {
    noFill(); strokeWeight(1.2);
    stroke(0,255,180); beginShape();
    for(let x=0;x<50;x++) vertex(x,W(x*0.06,{wave:'classic sine',t:t,seed:30,range:[5,45]}));
    endShape();
    stroke(255,255,0); beginShape();
    for(let x=0;x<50;x++) vertex(x,W(x*0.06,{wave:'batman',t:t,seed:31,range:[5,45]}));
    endShape();
  };

  // 4: 3D ribbon — wave as height, drawn with parallelogram strips
  FRAMES[4] = (t) => {
    noStroke();
    for(let x=0;x<50;x+=2){
      const h1=W(x*0.06,{wave:'mountain peaks',t:t,seed:40,range:[5,30]});
      const h2=W((x+2)*0.06,{wave:'mountain peaks',t:t,seed:40,range:[5,30]});
      fill(100,W(x*0.04,{seed:41,t:t,range:[150,255]}),200);
      quad(x,40-h1, x+2,40-h2, x+2,42, x,42);
    }
  };

  // 5: Phase portrait — x=wave1, y=wave2, plot trajectory
  FRAMES[5] = (t) => {
    noFill(); stroke(255,100,50); strokeWeight(0.8);
    beginShape();
    for(let i=0;i<80;i++){
      const u=i*0.05+t*0.2;
      vertex(W(u,{wave:'wobble sine',seed:50,range:[3,47]}),
             W(u,{wave:'meta sine',seed:51,range:[3,47]}));
    }
    endShape();
  };

  // 6: Waveform heatmap — 10 waves stacked, brightness = value
  FRAMES[6] = (t) => {
    noStroke();
    const wvs=['sine','triangle','square','noise','pulse','ramp','saw up','steps','batman','valleys'];
    for(let r=0;r<10;r++)for(let x=0;x<50;x+=2){
      const v=W(x*0.06,{wave:wvs[r],t:t,seed:60+r,range:[0,255]});
      fill(v,v*0.5,255-v); rect(x,r*5,2,5);
    }
  };

  // 7: Spiral waveform — wave value along expanding spiral
  FRAMES[7] = (t) => {
    noFill(); stroke(0,200,255); strokeWeight(1);
    beginShape();
    for(let i=0;i<100;i++){
      const a=i*0.15+t*0.5;
      const baseR=1.5+i*0.18;
      const wave=W(i*0.05,{wave:'sharp peaks',t:t,seed:70,range:[-3,3]});
      vertex(25+cos(a)*(baseR+wave),25+sin(a)*(baseR+wave));
    }
    endShape();
  };

  // 8: Mirrored waveform — top half + reflected bottom
  FRAMES[8] = (t) => {
    noFill(); strokeWeight(1.2);
    stroke(255,0,100);
    beginShape();
    for(let x=0;x<50;x++){const y=W(x*0.06,{wave:'fuzzy pulse',t:t,seed:80,range:[2,23]});vertex(x,y);}
    endShape();
    stroke(255,0,100,100);
    beginShape();
    for(let x=0;x<50;x++){const y=W(x*0.06,{wave:'fuzzy pulse',t:t,seed:80,range:[2,23]});vertex(x,50-y);}
    endShape();
  };

  // 9: Frequency spectrum — 25 bars, each a different frequency
  FRAMES[9] = (t) => {
    noStroke();
    for(let i=0;i<25;i++){
      const freq=0.01+i*0.008;
      const h=W(t,{wave:'sine',seed:90+i,range:[2,40],frequency:freq*20});
      const hue=W(i*0.1,{seed:91,t:t,range:[0,255]});
      fill(hue,150,255); rect(i*2,50-h,2,h);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 1 — SHAPE: Wave-sculpted geometry
  // ═══════════════════════════════════════════════════════

  // 10: Breathing heart — cardioid with wave-driven scale
  FRAMES[10] = (t) => {
    noStroke();
    const beat=W(t,{wave:'sharp peaks',seed:100,range:[0.7,1.2]});
    fill(255,W(t,{seed:101,wave:'sine',range:[30,80]}),80);
    beginShape();
    for(let a=0;a<=TWO_PI;a+=0.05){
      const r=13*beat*(1-sin(a))*0.45;
      vertex(25+r*sin(a)*0.9,30-r*cos(a)*0.7);
    }
    endShape(CLOSE);
  };

  // 11: Wave-driven gear — teeth count and depth from library
  FRAMES[11] = (t) => {
    noFill(); stroke(255,200,0); strokeWeight(1);
    const teeth=floor(W(t*0.3,{wave:'steps',seed:110,range:[6,14.99]}));
    const depth=W(t,{wave:'bumpy sine',seed:111,range:[2,6]});
    translate(25,25); rotate(W(t,{wave:'saw up',seed:112,range:[0,TWO_PI]}));
    beginShape();
    for(let i=0;i<teeth*2;i++){
      const a=i*PI/teeth;
      const r=i%2===0?12+depth:12-depth;
      vertex(cos(a)*r,sin(a)*r);
    }
    endShape(CLOSE);
  };

  // 12: Morphing star — point count oscillates
  FRAMES[12] = (t) => {
    noFill(); stroke(200,100,255); strokeWeight(1.2);
    const pts=floor(W(t*0.2,{wave:'stepped sine',seed:120,range:[3,8.99]}));
    translate(25,25); rotate(W(t,{seed:121,wave:'sine',range:[0,1]}));
    beginShape();
    for(let i=0;i<pts*2;i++){
      const a=i*PI/pts-HALF_PI;
      const r=i%2===0?18:8;
      vertex(cos(a)*r,sin(a)*r);
    }
    endShape(CLOSE);
  };

  // 13: Wave ruler — tick marks with wave-driven heights
  FRAMES[13] = (t) => {
    stroke(255); strokeWeight(0.5);
    line(0,40,50,40);
    for(let i=0;i<25;i++){
      const h=W(i*0.15,{wave:'grow random',t:t,seed:130,range:[3,25]});
      stroke(255,W(i,{seed:131,t:t,range:[80,255]}),100);
      line(i*2+1,40,i*2+1,40-h);
    }
  };

  // 14: Elastic string — wave displaces a horizontal line
  FRAMES[14] = (t) => {
    noFill(); stroke(0,255,200); strokeWeight(2);
    beginShape();
    for(let x=0;x<50;x++){
      const pluck=sin(x*PI/50);
      const y=25+W(x*0.06,{wave:'triangle sine',t:t,seed:140,range:[-12,12]})*pluck;
      vertex(x,y);
    }
    endShape();
    // Fixed endpoints
    fill(255); noStroke();
    ellipse(0,25,4,4); ellipse(49,25,4,4);
  };

  // 15: Pac-man — mouth angle from wave
  FRAMES[15] = (t) => {
    const mouth=W(t*2,{wave:'half sine',seed:150,range:[0.05,0.8]});
    fill(255,220,0); noStroke();
    arc(25,25,30,30,mouth*PI,TWO_PI-mouth*PI,PIE);
    fill(0); ellipse(27,18,4,4);
  };

  // 16: Wave crown — spikes radiating from center
  FRAMES[16] = (t) => {
    noFill(); stroke(255,180,50); strokeWeight(1);
    translate(25,25);
    for(let i=0;i<16;i++){
      const a=i*TWO_PI/16;
      const inner=W(i,{wave:'pulse',t:t,seed:160,range:[5,10]});
      const outer=W(i,{wave:'sharp peaks',t:t,seed:161,range:[12,22]});
      line(cos(a)*inner,sin(a)*inner,cos(a)*outer,sin(a)*outer);
    }
  };

  // 17: DNA ladder — two wave helices with rungs
  FRAMES[17] = (t) => {
    strokeWeight(1.5);
    for(let y=0;y<50;y+=2){
      const x1=25+W(y*0.1,{wave:'sine',t:t,seed:170,range:[-14,14]});
      const x2=25+W(y*0.1,{wave:'sine',t:t,seed:170,range:[-14,14],phase:PI});
      stroke(0,200,255); point(x1,y);
      stroke(255,100,200); point(x2,y);
      if(y%4===0){stroke(255,60);line(x1,y,x2,y);}
    }
  };

  // 18: Wave-driven brackets — nested ( ) shapes
  FRAMES[18] = (t) => {
    noFill(); strokeWeight(1);
    for(let i=0;i<5;i++){
      const w=W(i,{wave:'fade out',t:t,seed:180,range:[4,20]});
      const h=W(i,{wave:'ramp up sine',t:t,seed:181,range:[10,40]});
      stroke(W(i,{seed:182,t:t,range:[100,255]}),150,255);
      arc(25-w/2,25,w,h,HALF_PI,PI+HALF_PI);
      arc(25+w/2,25,w,h,-HALF_PI,HALF_PI);
    }
  };

  // 19: Eye iris — pupil + layered iris rings all wave-driven
  FRAMES[19] = (t) => {
    noStroke();
    fill(240); ellipse(25,25,42,28);
    for(let i=14;i>0;i--){
      const h=W(i*0.3,{wave:'noise',t:t*0.5,seed:190,range:[15,45]});
      const s=W(i*0.2,{seed:191,t:t,range:[60,100]});
      colorMode(HSB,360,100,100); fill(h,s,70-i*3); colorMode(RGB);
      ellipse(25,25,i*2,i*2);
    }
    const pupil=W(t,{wave:'smooth solid sine',seed:192,range:[4,10]});
    fill(0); ellipse(25,25,pupil,pupil);
    fill(255,180); ellipse(28,22,3,2);
  };

  // ═══════════════════════════════════════════════════════
  // ROW 2 — COLOR: Wave as chromatic instrument
  // ═══════════════════════════════════════════════════════

  // 20: Aurora — layered horizontal color bands
  FRAMES[20] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    for(let y=0;y<50;y++){
      const h=W(y*0.04,{wave:'wobble sine',t:t,seed:200,range:[80,200]});
      const a=W(y*0.06,{wave:'fade out',t:t*0.5,seed:201,range:[0,80]});
      fill(h,70,90,a/100); rect(0,y,50,1);
    }
    colorMode(RGB);
  };

  // 21: Stained glass — wave picks hue per voronoi cell
  FRAMES[21] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    const seeds=[];
    for(let i=0;i<6;i++) seeds.push({
      x:W(t,{seed:210+i,wave:'noise',range:[5,45]}),
      y:W(t,{seed:216+i,wave:'noise',range:[5,45]}),
      h:W(i,{seed:222+i,t:t,wave:'ramp',range:[0,360]})
    });
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      let md=999,ms=null;
      for(let s of seeds){const d=dist(x,y,s.x,s.y);if(d<md){md=d;ms=s;}}
      fill(ms.h%360,80,max(30,90-md*2)); rect(x,y,2,2);
    }
    colorMode(RGB);
  };

  // 22: Sunset gradient — wave bends the horizon line
  FRAMES[22] = (t) => {
    noStroke();
    for(let y=0;y<50;y++){
      const bend=W(y*0.04,{wave:'smooth solid sine',t:t*0.3,seed:220,range:[-5,5]});
      const yy=y+bend;
      const r=map(yy,0,50,255,20);
      const g=map(yy,0,50,150,0);
      const b=map(yy,0,50,50,80);
      fill(r,g,b); rect(0,y,50,1);
    }
  };

  // 23: Color organ — 5x5 grid, each cell a wave-driven color chord
  FRAMES[23] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    for(let r=0;r<5;r++)for(let c=0;c<5;c++){
      const h=W((r*5+c)*0.1,{wave:'triangle',t:t,seed:230,range:[0,360]});
      const s=W((r*5+c)*0.15,{wave:'up down pulse',t:t*0.5,seed:231,range:[40,100]});
      const b=W((r*5+c)*0.12,{wave:'bald patch',t:t*0.7,seed:232,range:[30,100]});
      fill(h%360,s,b); rect(c*10,r*10,10,10);
    }
    colorMode(RGB);
  };

  // 24: Neon tubes — glowing lines with wave-shifted colors
  FRAMES[24] = (t) => {
    for(let i=0;i<6;i++){
      const y=8+i*7;
      const hue=W(i,{wave:'saw up',t:t,seed:240,range:[0,255]});
      for(let g=4;g>=0;g--){
        stroke(hue,100+g*30,255,50-g*10); strokeWeight(1+g*1.5);
        const y1=y+W(0,{wave:'noise',t:t+i,seed:241+i,range:[-2,2]});
        const y2=y+W(1,{wave:'noise',t:t+i,seed:242+i,range:[-2,2]});
        line(3,y1,47,y2);
      }
    }
  };

  // 25: Prismatic fan — rotating gradient wedges
  FRAMES[25] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    translate(25,25);
    const n=floor(W(t*0.2,{wave:'steps',seed:250,range:[6,18.99]}));
    for(let i=0;i<n;i++){
      const a1=i*TWO_PI/n+W(t,{seed:251,wave:'sine',range:[0,0.3]});
      const a2=a1+TWO_PI/n;
      fill((i*360/n+W(t,{seed:252,wave:'ramp',range:[0,120]}))%360,85,90);
      arc(0,0,40,40,a1,a2,PIE);
    }
    colorMode(RGB);
  };

  // 26: Thermal camera — wave creates heat map
  FRAMES[26] = (t) => {
    noStroke();
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      const heat=W((x+y*50)*0.003,{wave:'squared sine',t:t*0.4,seed:260,range:[0,1]});
      const d=dist(x,y,25+W(t,{seed:261,range:[-8,8]}),25)*0.04;
      const v=constrain(heat-d*0.3,0,1);
      if(v<0.33) fill(0,0,v*3*255);
      else if(v<0.66) fill(v*2*255,0,255-v*255);
      else fill(255,(v-0.5)*500,0);
      rect(x,y,2,2);
    }
  };

  // 27: Candy stripes — diagonal stripes with wave-bent angle
  FRAMES[27] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    const bend=W(t,{wave:'wobble sine',seed:270,range:[-0.5,0.5]});
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      const v=((x*cos(bend)+y*sin(bend))*0.15+t*2)%1;
      fill(v*360,80,90); rect(x,y,2,2);
    }
    colorMode(RGB);
  };

  // 28: Color breathing — single cell, layers of fading halos
  FRAMES[28] = (t) => {
    noStroke(); colorMode(HSB,360,100,100);
    for(let i=8;i>=0;i--){
      const r=W(t,{wave:'classic sine',seed:280+i,range:[4+i*3,8+i*5]});
      const h=W(t*0.5+i*0.3,{wave:'triangle',seed:281,range:[0,360]});
      fill(h%360,80,90,30); ellipse(25,25,r*2,r*2);
    }
    colorMode(RGB);
  };

  // 29: RGB split — three offset images
  FRAMES[29] = (t) => {
    noStroke();
    const dx=W(t,{wave:'zig-zag sine',seed:290,range:[-4,4]});
    const dy=W(t,{wave:'zig-zag sine',seed:291,range:[-4,4]});
    blendMode(ADD);
    for(let y=0;y<50;y+=3)for(let x=0;x<50;x+=3){
      const v=W((x+y)*0.02,{wave:'noise',t:t*0.5,seed:292,range:[0,180]});
      fill(v,0,0); rect(x-dx,y-dy,3,3);
      fill(0,v,0); rect(x,y,3,3);
      fill(0,0,v); rect(x+dx,y+dy,3,3);
    }
    blendMode(BLEND);
  };

  // ═══════════════════════════════════════════════════════
  // ROW 3 — MOTION: Wave as choreographer
  // ═══════════════════════════════════════════════════════

  // 30: Newton's cradle — wave-timed energy transfer
  FRAMES[30] = (t) => {
    stroke(150); strokeWeight(0.5);
    noFill();
    const active=floor(W(t,{wave:'square',seed:300,range:[0,1.99]}));
    for(let i=0;i<5;i++){
      let ang=0;
      if(i===0&&active===0) ang=W(t*3,{wave:'half sine',seed:301,range:[-0.6,0]});
      if(i===4&&active===1) ang=W(t*3,{wave:'half sine',seed:302,range:[0,0.6]});
      const bx=15+i*5+sin(ang)*15;
      const by=10+cos(ang)*15;
      line(15+i*5,5,bx,by);
      fill(200); ellipse(bx,by,5,5); noFill();
    }
  };

  // 31: Typewriter carriage — wave drives x position, steps y
  FRAMES[31] = (t) => {
    const chars='p5waves';
    const x=W(t*1.5,{wave:'saw up',seed:310,range:[3,45]});
    const row=floor(W(t*0.3,{wave:'steps down',seed:311,range:[0,5.99]}));
    fill(0,255,0); noStroke(); textSize(7); textFont('monospace');
    const ci=floor(W(t*3,{wave:'ramp',seed:312,range:[0,6.99]}));
    text(chars[ci],x,10+row*7);
    const blink=W(t*2,{wave:'square',seed:313,range:[0,1]})>0.5;
    if(blink){fill(0,255,0,150);rect(x+5,6+row*7,1,7);}
  };

  // 32: Windshield wiper — wave-driven arc sweep
  FRAMES[32] = (t) => {
    const angle=W(t,{wave:'triangle',seed:320,range:[-PI/3,PI/3]});
    const speed=W(t*0.3,{wave:'stepped sine',seed:321,range:[0.5,2]});
    stroke(255,200,100); strokeWeight(2);
    push(); translate(25,45); rotate(angle*speed);
    line(0,0,0,-35);
    noStroke(); fill(255,200,100);
    ellipse(0,-35,4,4);
    pop();
  };

  // 33: Wave trampoline — ball bounces on wave surface
  FRAMES[33] = (t) => {
    // Wave surface
    noFill(); stroke(100,100,255); strokeWeight(1);
    beginShape();
    for(let x=0;x<50;x++) vertex(x,35+W(x*0.06,{wave:'bumpy sine',t:t,seed:330,range:[-5,5]}));
    endShape();
    // Ball
    const bx=W(t,{wave:'saw up',seed:331,range:[5,45]});
    const surface=35+W(bx*0.06,{wave:'bumpy sine',t:t,seed:330,range:[-5,5]});
    const bounce=abs(W(t*2,{wave:'triangle',seed:332,range:[-15,0]}));
    noStroke(); fill(255,100,100);
    ellipse(bx,surface-4-bounce,6,6);
  };

  // 34: Clock hands — three hands, each wave-driven independently
  FRAMES[34] = (t) => {
    translate(25,25); noFill();
    stroke(60); strokeWeight(0.5); ellipse(0,0,44,44);
    // Hour
    stroke(255); strokeWeight(2);
    const ha=W(t*0.05,{wave:'ramp',seed:340,range:[0,TWO_PI]});
    line(0,0,cos(ha-HALF_PI)*10,sin(ha-HALF_PI)*10);
    // Minute
    strokeWeight(1.2);
    const ma=W(t*0.3,{wave:'ramp',seed:341,range:[0,TWO_PI]});
    line(0,0,cos(ma-HALF_PI)*16,sin(ma-HALF_PI)*16);
    // Second — jerky
    stroke(255,50,50); strokeWeight(0.5);
    const sa=W(t,{wave:'steps',seed:342,range:[0,TWO_PI]});
    line(0,0,cos(sa-HALF_PI)*19,sin(sa-HALF_PI)*19);
  };

  // 35: Pendulum wave — 7 pendulums with wave-driven lengths
  FRAMES[35] = (t) => {
    stroke(200); strokeWeight(0.8);
    for(let i=0;i<7;i++){
      const len=W(i*0.3,{wave:'ramp up sine',t:t*0.1,seed:350,range:[12,35]});
      const period=sqrt(len)*0.5;
      const angle=0.5*sin(t*TWO_PI/period);
      const bx=5+i*6.5+sin(angle)*len;
      const by=3+cos(angle)*len;
      line(5+i*6.5,3,bx,by);
      noStroke();fill(W(i,{seed:351,t:t,range:[150,255]}),200,255);
      ellipse(bx,by,4,4);stroke(200);strokeWeight(0.8);
    }
  };

  // 36: Caterpillar — wave drives body segments
  FRAMES[36] = (t) => {
    noStroke();
    for(let i=0;i<8;i++){
      const x=5+i*5.5+W(t+i*0.3,{wave:'sine',seed:360,range:[-2,2]});
      const y=25+W(t+i*0.3,{wave:'sine',seed:361,range:[-6,6]});
      const sz=W(i*0.3,{wave:'bumpy sine',t:t,seed:362,range:[3,7]});
      fill(50,W(i,{seed:363,t:t,range:[150,255]}),50);
      ellipse(x,y,sz,sz);
    }
    // Eyes on first segment
    fill(0); ellipse(8,22,2,2); ellipse(11,22,2,2);
  };

  // 37: Slingshot — charge & release controlled by wave
  FRAMES[37] = (t) => {
    const phase=W(t,{wave:'saw up',seed:370,range:[0,1]});
    stroke(150); strokeWeight(1);
    // Slingshot Y
    line(10,40,10,15); line(10,15,5,10); line(10,15,15,10);
    // Elastic + projectile
    const stretch=phase<0.7?phase/0.7:0;
    const fly=phase>=0.7?(phase-0.7)/0.3:0;
    const px=10+stretch*5+fly*35;
    const py=25-fly*15;
    if(phase<0.7){stroke(200,100,50);line(5,10,px,py);line(15,10,px,py);}
    noStroke();fill(255,80,80);ellipse(px,py,5,5);
  };

  // 38: Metronome — weighted arm swings, wave = tempo
  FRAMES[38] = (t) => {
    const tempo=W(t*0.2,{wave:'stepped sine',seed:380,range:[1,4]});
    const angle=W(t*tempo,{wave:'triangle',seed:381,range:[-PI/4,PI/4]});
    stroke(200); strokeWeight(1.5);
    push(); translate(25,45); rotate(angle);
    line(0,0,0,-35);
    fill(180); noStroke();
    const wPos=W(t*0.1,{wave:'ramp',seed:382,range:[10,30]});
    rect(-3,-wPos,6,5);
    pop();
    // Base
    noStroke(); fill(100);
    triangle(15,45,35,45,25,42);
  };

  // 39: Pinball — wave launches ball, wave curves flippers
  FRAMES[39] = (t) => {
    const bx=W(t,{wave:'wobble sine',seed:390,range:[5,45]});
    const by=W(t,{wave:'meta sine',seed:391,range:[5,40]});
    noStroke();fill(200); ellipse(bx,by,5,5);
    // Flippers
    stroke(255,150,0);strokeWeight(2);
    const fL=W(t*2,{wave:'pulse',seed:392,range:[-0.3,0.3]});
    push();translate(15,44);rotate(fL);line(0,0,10,-3);pop();
    push();translate(35,44);rotate(-fL);line(0,0,-10,-3);pop();
    // Bumpers
    noStroke();
    fill(W(t*4,{seed:393,wave:'square',range:[60,255]}),0,0); ellipse(15,20,6,6);
    fill(0,W(t*4,{seed:394,wave:'square',range:[60,255]}),0); ellipse(35,20,6,6);
    fill(0,0,W(t*4,{seed:395,wave:'square',range:[60,255]})); ellipse(25,12,6,6);
  };

  // ═══════════════════════════════════════════════════════
  // ROW 4 — PATTERN: Wave-generated structure
  // ═══════════════════════════════════════════════════════

  // 40: Wave weave — warp and weft driven by different waves
  FRAMES[40] = (t) => {
    strokeWeight(0.8);
    for(let i=0;i<12;i++){
      const y=i*4+W(i*0.3,{wave:'sine',t:t,seed:400,range:[-2,2]});
      stroke(W(i,{seed:401,t:t,range:[100,255]}),100,150);
      line(0,y,50,y+W(t,{seed:402+i,wave:'noise',range:[-3,3]}));
    }
    for(let i=0;i<12;i++){
      const x=i*4+W(i*0.3,{wave:'triangle',t:t,seed:403,range:[-2,2]});
      stroke(100,W(i,{seed:404,t:t,range:[100,255]}),150);
      line(x,0,x+W(t,{seed:405+i,wave:'noise',range:[-3,3]}),50);
    }
  };

  // 41: Tile rotation — each square tile rotated by wave
  FRAMES[41] = (t) => {
    noFill(); stroke(0,255,180); strokeWeight(0.7); rectMode(CENTER);
    for(let r=0;r<5;r++)for(let c=0;c<5;c++){
      push();translate(c*10+5,r*10+5);
      rotate(W((r*5+c)*0.2,{wave:'offset sine',t:t,seed:410,range:[0,HALF_PI]}));
      rect(0,0,8,8);pop();
    }
  };

  // 42: Wave-driven maze — walls appear/disappear
  FRAMES[42] = (t) => {
    stroke(255); strokeWeight(0.8);
    for(let r=0;r<5;r++)for(let c=0;c<5;c++){
      const x=c*10,y=r*10;
      if(W((r*5+c)*0.2,{wave:'square',t:t*0.3,seed:420,range:[0,1]})>0.5) line(x+10,y,x+10,y+10);
      if(W((r*5+c)*0.2+0.1,{wave:'square',t:t*0.3,seed:421,range:[0,1]})>0.5) line(x,y+10,x+10,y+10);
    }
  };

  // 43: Scale pattern — overlapping circles like fish scales
  FRAMES[43] = (t) => {
    noFill(); strokeWeight(0.6);
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){
      const off=(r%2)*3.5;
      const x=c*7+off-3, y=r*6-2;
      const sz=W((r*8+c)*0.08,{wave:'bumpy sine',t:t,seed:430,range:[5,9]});
      stroke(W(r*8+c,{seed:431,t:t,range:[80,200]}),180,255);
      arc(x,y,sz,sz,-0.3,PI+0.3);
    }
  };

  // 44: Brick wall — wave shifts rows
  FRAMES[44] = (t) => {
    stroke(60); strokeWeight(0.5);
    for(let r=0;r<8;r++){
      const off=W(r,{wave:'noise',t:t,seed:440,range:[-4,4]});
      for(let c=-1;c<7;c++){
        const x=c*8+(r%2)*4+off;
        fill(W((r*7+c)*0.1,{seed:441,t:t,wave:'noise',range:[140,200]}),80,50);
        rect(x,r*6.25,7.5,5.5);
      }
    }
  };

  // 45: Spirograph — wave modulates inner/outer radius ratio
  FRAMES[45] = (t) => {
    noFill(); stroke(255,100,200); strokeWeight(0.6);
    const R=16,d=W(t*0.2,{wave:'sine',seed:450,range:[6,14]});
    const r=W(t*0.15,{wave:'triangle',seed:451,range:[3,8]});
    beginShape();
    for(let a=0;a<TWO_PI*5;a+=0.03){
      const x=(R-r)*cos(a)+d*cos((R-r)/r*a);
      const y=(R-r)*sin(a)-d*sin((R-r)/r*a);
      vertex(25+x,25+y);
    }
    endShape();
  };

  // 46: Kaleidoscope hexagons — wave picks hex fill
  FRAMES[46] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    for(let r=0;r<7;r++)for(let c=0;c<6;c++){
      const x=c*9+(r%2)*4.5,y=r*7;
      const h=W((r*6+c)*0.12,{wave:'triangle sine',t:t,seed:460,range:[0,360]});
      fill(h%360,75,85);
      beginShape();
      for(let i=0;i<6;i++) vertex(x+4*cos(i*PI/3),y+4*sin(i*PI/3));
      endShape(CLOSE);
    }
    colorMode(RGB);
  };

  // 47: Op-art wave — concentric shapes with wave offset
  FRAMES[47] = (t) => {
    noFill(); strokeWeight(1.5);
    const ox=W(t,{wave:'sine',seed:470,range:[-4,4]});
    const oy=W(t*0.8,{wave:'sine',seed:471,range:[-4,4]});
    for(let i=1;i<12;i++){
      stroke(i%2===0?255:0);
      ellipse(25+ox*(i/12),25+oy*(i/12),i*4,i*4);
    }
  };

  // 48: Domino cascade — wave tips each piece
  FRAMES[48] = (t) => {
    for(let i=0;i<8;i++){
      const tip=constrain(W(t-i*0.15,{wave:'ramp',seed:480,range:[-0.2,1.2]}),0,1)*HALF_PI;
      push(); translate(4+i*6,40);rotate(-tip);
      fill(W(i,{seed:481,t:t,range:[180,255]})); noStroke();
      rect(-2,-15,4,15,1);
      pop();
    }
  };

  // 49: Wave quilting — diamond patches with wave-shifted hues
  FRAMES[49] = (t) => {
    colorMode(HSB,360,100,100); noStroke();
    for(let r=0;r<7;r++)for(let c=0;c<7;c++){
      const x=c*8-3,y=r*8-3;
      const h=W((r*7+c)*0.1,{wave:'grow random',t:t,seed:490,range:[0,360]});
      fill(h%360,70,80);
      quad(x+4,y, x+8,y+4, x+4,y+8, x,y+4);
    }
    colorMode(RGB);
  };

  // ═══════════════════════════════════════════════════════
  // ROW 5 — ORGANIC: Wave as life force
  // ═══════════════════════════════════════════════════════

  // 50: Ant colony — wave drives pheromone trail direction
  FRAMES[50] = (t) => {
    noStroke();
    for(let ant of STATE[50]){
      ant.a += W(ant.x*0.06+ant.y*0.06,{wave:'noise',t:t,seed:500,range:[-0.3,0.3]});
      ant.x += cos(ant.a)*0.8; ant.y += sin(ant.a)*0.8;
      ant.x=(ant.x+50)%50; ant.y=(ant.y+50)%50;
      fill(W(t+STATE[50].indexOf(ant),{seed:501,wave:'sine',range:[100,200]}),80,60);
      ellipse(ant.x,ant.y,2,2);
    }
    fill(180,120,60); ellipse(25,25,5,5); // nest
  };

  // 51: Wave turtle — L-system-like drawing
  FRAMES[51] = (t,fc) => {
    const s=STATE[51];
    if(fc%2===0){
      let x=s.trail.length?s.trail[s.trail.length-1][0]:25;
      let y=s.trail.length?s.trail[s.trail.length-1][1]:25;
      const a=W(s.age*0.2,{wave:'zig-zag sine',t:t,seed:510,range:[-PI,PI]});
      const step=W(s.age*0.1,{wave:'noise',t:t,seed:511,range:[1,4]});
      x+=cos(a)*step;y+=sin(a)*step;
      x=(x+50)%50;y=(y+50)%50;
      s.trail.push([x,y]);
      if(s.trail.length>120) s.trail.shift();
      s.age++;
    }
    noFill();
    for(let i=1;i<s.trail.length;i++){
      stroke(80,W(i*0.05,{seed:512,t:t,range:[150,255]}),80,map(i,0,s.trail.length,30,255));
      strokeWeight(0.8); line(s.trail[i-1][0],s.trail[i-1][1],s.trail[i][0],s.trail[i][1]);
    }
  };

  // 52: Crystal growth — wave picks growth direction
  FRAMES[52] = (t,fc) => {
    const s=STATE[52];
    if(fc%4===0&&s.pts.length<200){
      const last=s.pts[s.pts.length-1];
      const dir=floor(W(s.age,{wave:'noise',t:t,seed:520,range:[0,3.99]}));
      const dx=[1,-1,0,0][dir]*2,dy=[0,0,1,-1][dir]*2;
      const nx=constrain(last[0]+dx,2,48),ny=constrain(last[1]+dy,2,48);
      s.pts.push([nx,ny]);s.age++;
      if(s.pts.length>180){s.pts=[[25,25]];s.age=0;}
    }
    noStroke();
    for(let i=0;i<s.pts.length;i++){
      fill(180,220,W(i*0.05,{seed:521,t:t,range:[200,255]}),map(i,0,s.pts.length,50,255));
      rect(s.pts[i][0]-1,s.pts[i][1]-1,2,2);
    }
  };

  // 53: Erosion landscape — wave eats into terrain
  FRAMES[53] = (t) => {
    const h=STATE[53];
    for(let x=0;x<50;x++){
      const erode=W(x*0.06,{wave:'sharp peaks',t:t,seed:530,range:[-0.3,0.3]});
      h[x]=constrain(h[x]+erode,5,45);
    }
    noStroke();fill(80,140,60);
    beginShape();vertex(0,50);
    for(let x=0;x<50;x++)vertex(x,h[x]);
    vertex(50,50);endShape(CLOSE);
    fill(30,80,180);rect(0,0,50,min(...h));
  };

  // 54: Schooling fish — wave modulates alignment
  FRAMES[54] = (t) => {
    const fish=STATE[54];
    const align=W(t,{wave:'up down noise',seed:540,range:[0.01,0.08]});
    for(let f of fish){
      let ax=0,ay=0,cx=0,cy=0,sx=0,sy=0,n=0;
      for(let o of fish){if(o===f)continue;const d=dist(f.x,f.y,o.x,o.y);
        if(d<15){sx+=f.x-o.x;sy+=f.y-o.y;}ax+=o.vx;ay+=o.vy;cx+=o.x;cy+=o.y;n++;}
      if(n>0){ax/=n;ay/=n;cx/=n;cy/=n;
        f.vx+=sx*0.03+(ax-f.vx)*align+(cx-f.x)*0.008;
        f.vy+=sy*0.03+(ay-f.vy)*align+(cy-f.y)*0.008;}
      const sp=sqrt(f.vx*f.vx+f.vy*f.vy);if(sp>1.5){f.vx=f.vx/sp*1.5;f.vy=f.vy/sp*1.5;}
      f.x+=f.vx;f.y+=f.vy;f.x=(f.x+50)%50;f.y=(f.y+50)%50;
    }
    fill(W(t,{seed:541,wave:'sine',range:[100,200]}),180,255);noStroke();
    for(let f of fish){push();translate(f.x,f.y);rotate(atan2(f.vy,f.vx));
      triangle(4,0,-3,-2,-3,2);pop();}
  };

  // 55: Lightning — wave triggers branch generation
  FRAMES[55] = (t,fc) => {
    const s=STATE[55];
    s.timer+=W(t,{wave:'sharp peaks',seed:550,range:[0,0.15]});
    if(s.timer>1){
      s.timer=0;s.branches=[];
      let x=W(t,{seed:551,wave:'noise',range:[10,40]}),y=0;
      const pts=[[x,y]];
      while(y<50){
        x+=W(y*0.1,{wave:'noise',t:t,seed:552,range:[-5,5]});
        y+=random(3,6);pts.push([constrain(x,2,48),y]);
      }
      s.branches=pts;
    }
    if(s.branches.length>1){
      stroke(200,200,255);strokeWeight(1.5);noFill();
      for(let i=1;i<s.branches.length;i++)
        line(s.branches[i-1][0],s.branches[i-1][1],s.branches[i][0],s.branches[i][1]);
    }
  };

  // 56: Pendulum array — 7 pendulums, wave sets damping
  FRAMES[56] = (t) => {
    const pends=STATE[56];
    const damp=W(t*0.1,{wave:'smooth solid sine',seed:560,range:[0.995,0.9999]});
    stroke(200);strokeWeight(0.8);
    for(let i=0;i<7;i++){
      const p=pends[i];
      const acc=-0.02*sin(p.a)*p.len;
      p.v+=acc;p.v*=damp;p.a+=p.v;
      const bx=5+i*6.5+sin(p.a)*p.len;
      const by=5+cos(p.a)*p.len;
      line(5+i*6.5,5,bx,by);
      noStroke();fill(255,W(i,{seed:561,t:t,range:[100,200]}),100);
      ellipse(bx,by,3,3);stroke(200);strokeWeight(0.8);
    }
  };

  // 57: Jellyfish — bell pulses via wave, tentacles trail
  FRAMES[57] = (t) => {
    const pulse=W(t*2,{wave:'half sine',seed:570,range:[0.8,1.2]});
    // Bell
    noStroke();fill(150,100,255,150);
    arc(25,18,22*pulse,18*pulse,0,PI);
    // Tentacles
    stroke(150,100,255,100);strokeWeight(0.8);noFill();
    for(let i=0;i<5;i++){
      beginShape();
      const bx=17+i*4;
      for(let j=0;j<8;j++){
        const dx=W(j*0.3,{wave:'sine',t:t+i,seed:571+i,range:[-3,3]});
        vertex(bx+dx,18+j*4);
      }
      endShape();
    }
  };

  // 58: Vine growth — wave drives curl direction
  FRAMES[58] = (t) => {
    noFill();strokeWeight(1.2);
    for(let v=0;v<3;v++){
      stroke(40,W(v,{seed:580+v,t:t,range:[120,220]}),40);
      let x=10+v*15,y=48;
      beginShape();
      for(let i=0;i<20;i++){
        const curl=W(i*0.2,{wave:'wobble sine',t:t+v,seed:582+v,range:[-PI/4,PI/4]})-HALF_PI;
        x+=cos(curl)*2.5;y+=sin(curl)*2.5;
        vertex(x,y);
      }
      endShape();
    }
  };

  // 59: Heartbeat EKG — wave shapes the PQRST complex
  FRAMES[59] = (t) => {
    noFill();stroke(0,255,100);strokeWeight(1.5);
    beginShape();
    for(let x=0;x<50;x++){
      const phase=((x*0.04+t*0.8)%1);
      let y=25;
      if(phase<0.1) y+=W(phase*30,{wave:'half sine',seed:590,range:[0,3]});
      else if(phase<0.2) y-=W((phase-0.1)*30,{wave:'sharp peaks',seed:591,range:[0,15]});
      else if(phase<0.3) y+=W((phase-0.2)*30,{wave:'half sine',seed:592,range:[0,4]});
      else y+=W(phase,{seed:593,wave:'noise',t:t,range:[-0.5,0.5]});
      vertex(x,y);
    }
    endShape();
    // Scanlines
    stroke(0,255,100,20);strokeWeight(0.5);
    for(let y=0;y<50;y+=4) line(0,y,50,y);
  };

  // ═══════════════════════════════════════════════════════
  // ROW 6 — TEXTURE: Wave as bitmap sculptor
  // ═══════════════════════════════════════════════════════

  // 60: Wave-reseeded Life — wave controls mutation rate
  FRAMES[60] = (t,fc) => {
    const s=STATE[60];
    if(fc%3===0){
      s.n.fill(0);let alive=0;
      for(let y=0;y<25;y++)for(let x=0;x<25;x++){
        let c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
          if(!dx&&!dy)continue;c+=s.g[((y+dy+25)%25)*25+((x+dx+25)%25)];}
        const i=y*25+x;
        s.n[i]=s.g[i]?(c===2||c===3?1:0):(c===3?1:0);
        // Wave-driven spontaneous generation
        if(!s.n[i]&&W((x+y*25)*0.01,{wave:'pulse',t:t,seed:600,range:[0,1]})>0.97) s.n[i]=1;
        alive+=s.n[i];
      }
      [s.g,s.n]=[s.n,s.g];s.age++;
      if(alive<3||s.age>200){for(let i=0;i<625;i++)s.g[i]=random()<0.35?1:0;s.age=0;}
    }
    noStroke();
    const hue=W(t,{wave:'ramp',seed:601,range:[0,255]});
    for(let y=0;y<25;y++)for(let x=0;x<25;x++)
      if(s.g[y*25+x]){fill(hue,255,150);rect(x*2,y*2,2,2);}
  };

  // 61: Reaction-diffusion — wave modulates kill rate
  FRAMES[61] = (t,fc) => {
    const s=STATE[61];
    const feed=0.055,kill=0.062+W(t*0.05,{wave:'sine',seed:610,range:[-0.003,0.003]});
    for(let iter=0;iter<2;iter++){
      s.nA.set(s.A);s.nB.set(s.B);
      for(let y=1;y<24;y++)for(let x=1;x<24;x++){
        const i=y*25+x;
        const lA=s.A[i-1]+s.A[i+1]+s.A[i-25]+s.A[i+25]-4*s.A[i];
        const lB=s.B[i-1]+s.B[i+1]+s.B[i-25]+s.B[i+25]-4*s.B[i];
        const ab=s.A[i]*s.B[i]*s.B[i];
        s.nA[i]=constrain(s.A[i]+(lA-ab+feed*(1-s.A[i]))*0.8,0,1);
        s.nB[i]=constrain(s.B[i]+(0.5*lB+ab-(kill+feed)*s.B[i])*0.8,0,1);
      }
      [s.A,s.nA]=[s.nA,s.A];[s.B,s.nB]=[s.nB,s.B];
    }
    noStroke();
    for(let y=0;y<25;y++)for(let x=0;x<25;x++){
      const v=s.A[y*25+x]-s.B[y*25+x];
      fill(map(v,-1,1,0,255),0,map(v,-1,1,200,50));rect(x*2,y*2,2,2);
    }
  };

  // 62: Woodgrain — wave creates ring pattern
  FRAMES[62] = (t) => {
    noStroke();
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      const d=dist(x,y,25+W(y*0.02,{seed:620,t:t,range:[-5,5]}),25);
      const ring=W(d*0.08,{wave:'triangle',t:t*0.1,seed:621,range:[0,1]});
      fill(140+ring*60,80+ring*40,40+ring*20);
      rect(x,y,2,2);
    }
  };

  // 63: Water caustics — overlapping wave interference
  FRAMES[63] = (t) => {
    noStroke();
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      const v1=W(x*0.08,{wave:'sine',t:t,seed:630,range:[-1,1]});
      const v2=W(y*0.08,{wave:'sine',t:t*1.3,seed:631,range:[-1,1]});
      const v3=W((x+y)*0.04,{wave:'sine',t:t*0.7,seed:632,range:[-1,1]});
      const bright=map(v1+v2+v3,-3,3,30,220);
      fill(bright*0.5,bright*0.8,bright);
      rect(x,y,2,2);
    }
  };

  // 64: Fabric weave — alternating pixel rows displaced
  FRAMES[64] = (t) => {
    noStroke();
    for(let y=0;y<50;y+=2){
      const dx=y%4===0?W(y*0.04,{wave:'sine',t:t,seed:640,range:[-3,3]}):0;
      const dy=y%4===2?W(y*0.04,{wave:'sine',t:t,seed:641,range:[-3,3]}):0;
      for(let x=0;x<50;x+=2){
        const c=y%4===0?
          color(W(x*0.04,{seed:642,t:t,range:[120,220]}),60,80):
          color(60,W(x*0.04,{seed:643,t:t,range:[120,220]}),80);
        fill(c);rect(x+dx,y+dy,2,2);
      }
    }
  };

  // 65: Glitch bands — wave picks glitch offset per row
  FRAMES[65] = (t) => {
    noStroke();
    for(let y=0;y<50;y+=2){
      const glitch=W(y*0.04,{wave:'pulse',t:t,seed:650,range:[-15,15]});
      for(let x=0;x<50;x+=2){
        const v=W((x+glitch)*0.04,{wave:'stepped sine',t:t,seed:651,range:[0,255]});
        fill(v,v*0.5,W(y*0.02,{seed:652,t:t,range:[100,255]}));
        rect(x,y,2,2);
      }
    }
  };

  // 66: Topographic map — wave as contour lines
  FRAMES[66] = (t) => {
    noStroke();
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      const h=W((x*x+y*y)*0.0005,{wave:'valleys',t:t*0.2,seed:660,range:[0,10]});
      const contour=h%1;
      fill(contour<0.1?color(80,60,40):color(40+h*20,80+h*15,30+h*10));
      rect(x,y,2,2);
    }
  };

  // 67: CRT scanlines — wave modulates brightness per line
  FRAMES[67] = (t) => {
    noStroke();
    for(let y=0;y<50;y++){
      const scanB=W(y*0.1,{wave:'square',t:0,seed:670,range:[0.6,1]});
      const lineB=W(y*0.04,{wave:'sine',t:t,seed:671,range:[50,200]});
      fill(0,lineB*scanB,0);rect(0,y,50,1);
    }
    // Phosphor afterglow
    noStroke();fill(0,255,0,30);
    const scanY=(t*30)%50;
    rect(0,scanY,50,3);
  };

  // 68: Marble texture — veined pattern
  FRAMES[68] = (t) => {
    noStroke();
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      const vein=W(x*0.03+W(y*0.04,{wave:'noise',t:t*0.2,seed:680,range:[-2,2]}),
                    {wave:'sharp peaks',t:t*0.1,seed:681,range:[0,1]});
      const b=180+vein*70;
      fill(b,b-20,b-10); rect(x,y,2,2);
    }
  };

  // 69: Pixelated fire — wave as heat source
  FRAMES[69] = (t) => {
    noStroke();
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      const heat=W(x*0.06,{wave:'noise',t:t*2,seed:690+floor(y/10),range:[0,1]});
      const cooldown=y/50;
      const v=max(0,heat-cooldown*0.7);
      if(v>0.5) fill(255,255*v,0);
      else if(v>0.2) fill(255*v*2,0,0);
      else fill(v*200,0,0);
      rect(x,y,2,2);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 7 — COMPOSITION: Multi-wave masterworks
  // ═══════════════════════════════════════════════════════

  // 70: Four-wave interference — visible beats
  FRAMES[70] = (t) => {
    noStroke();
    for(let y=0;y<50;y+=2)for(let x=0;x<50;x+=2){
      const v=W(x*0.06,{wave:'sine',t:t,seed:700,range:[-1,1]})
             +W(y*0.06,{wave:'sine',t:t*1.1,seed:701,range:[-1,1]})
             +W((x-y)*0.04,{wave:'triangle',t:t*0.7,seed:702,range:[-1,1]})
             +W(dist(x,y,25,25)*0.05,{wave:'sine',t:t*0.5,seed:703,range:[-1,1]});
      fill(map(v,-4,4,0,255),100,map(v,-4,4,200,50)); rect(x,y,2,2);
    }
  };

  // 71: Layered silhouettes — 6 mountain ranges at different speeds
  FRAMES[71] = (t) => {
    noStroke();
    const wvs=['mountain peaks','valleys','noise','sharp peaks','bumpy sine','wobble sine'];
    for(let l=0;l<6;l++){
      fill(10+l*15,15+l*20,30+l*25,map(l,0,5,50,240));
      beginShape();vertex(0,50);
      for(let x=0;x<=50;x+=2)
        vertex(x,8+l*7+W(x*0.04,{wave:wvs[l],t:t*(0.1+l*0.05),seed:710+l,range:[-10,10]}));
      vertex(50,50);endShape(CLOSE);
    }
  };

  // 72: Wave organ — 8 pipes, height=wave, width=wave
  FRAMES[72] = (t) => {
    noStroke();
    for(let i=0;i<8;i++){
      const h=W(i*0.3,{wave:'ramp up sine',t:t,seed:720,range:[10,45]});
      const w=W(i*0.4,{wave:'sine',t:t*0.5,seed:721,range:[2,5]});
      fill(W(i,{seed:722,t:t,range:[150,220]}),140+i*10,100);
      rect(3+i*6,50-h,w,h,w/2);
    }
  };

  // 73: Chained oscilloscope — wave1→freq of wave2→amp of wave3
  FRAMES[73] = (t) => {
    noFill();stroke(0,255,180);strokeWeight(1.5);
    beginShape();
    for(let x=0;x<50;x++){
      const freq=W(t,{wave:'sine',seed:730,range:[0.03,0.12]});
      const amp=W(x*freq,{wave:'triangle',t:t,seed:731,range:[3,18]});
      const y=25+W(x*0.08,{wave:'bumpy sine',t:t,seed:732,range:[-1,1]})*amp;
      vertex(x,y);
    }
    endShape();
    stroke(0,255,180,25);for(let y=0;y<50;y+=4)line(0,y,50,y);
  };

  // 74: Radar sweep — rotating line reveals wave-driven terrain
  FRAMES[74] = (t) => {
    const sweepAngle=W(t,{wave:'ramp',seed:740,range:[0,TWO_PI]});
    translate(25,25);
    // Circles
    noFill();stroke(0,100,0);strokeWeight(0.3);
    for(let r=5;r<25;r+=5) ellipse(0,0,r*2,r*2);
    // Blips
    noStroke();
    for(let i=0;i<12;i++){
      const a=W(i*0.5,{wave:'noise',seed:741+i,t:0,range:[0,TWO_PI]});
      const r=W(i*0.3,{seed:753+i,t:0,wave:'noise',range:[5,20]});
      const angleDiff=abs(((a-sweepAngle+PI)%(TWO_PI))-PI);
      const bright=max(0,1-angleDiff*2);
      fill(0,255*bright,0,255*bright);
      ellipse(cos(a)*r,sin(a)*r,3,3);
    }
    // Sweep line
    stroke(0,255,0,200);strokeWeight(1);
    line(0,0,cos(sweepAngle)*23,sin(sweepAngle)*23);
  };

  // 75: Stacked waveforms — 5 overlapping, each unique color + wave
  FRAMES[75] = (t) => {
    noFill();strokeWeight(1);
    const wvs=['batman','noise','wobble sine','stepped sine','meta sine'];
    const cols=[[255,0,100],[0,255,150],[100,100,255],[255,200,0],[255,100,255]];
    for(let i=0;i<5;i++){
      stroke(cols[i][0],cols[i][1],cols[i][2],180);
      beginShape();
      for(let x=0;x<50;x++)
        vertex(x,10+i*8+W(x*0.06,{wave:wvs[i],t:t+i*0.3,seed:750+i,range:[-4,4]}));
      endShape();
    }
  };

  // 76: Beat grid — 8×4 sequencer, wave triggers beats
  FRAMES[76] = (t) => {
    noStroke();
    const step=floor((t*4)%8);
    for(let r=0;r<4;r++)for(let c=0;c<8;c++){
      const on=W((r*8+c)*0.15,{wave:'square',t:t*0.4,seed:760+r,range:[0,1]})>0.5;
      const active=c===step&&on;
      fill(active?color(255,W(r,{seed:764,t:t,range:[100,200]}),0):on?color(60):color(20));
      rect(c*6+1,r*12+2,5,10,1);
    }
    // Playhead
    stroke(255,255,0,100);strokeWeight(0.5);
    line(step*6+3,0,step*6+3,50);
  };

  // 77: Moiré weave — two wave-stripe sets crossing
  FRAMES[77] = (t) => {
    stroke(255,60);strokeWeight(0.4);
    const a1=W(t,{wave:'sine',seed:770,range:[-0.3,0.3]});
    const a2=W(t*0.7,{wave:'triangle',seed:771,range:[-0.3,0.3]});
    for(let i=-20;i<70;i+=3){
      line(i+a1*20,0,i-a1*20,50);
      line(0,i+a2*20,50,i-a2*20);
    }
  };

  // 78: Double exposure — two different wave scenes overlaid
  FRAMES[78] = (t) => {
    noStroke();blendMode(ADD);
    // Scene 1: radial
    for(let y=0;y<50;y+=3)for(let x=0;x<50;x+=3){
      const d=dist(x,y,25,25);
      fill(W(d*0.05,{wave:'sine',t:t,seed:780,range:[0,120]}),0,0);
      rect(x,y,3,3);
    }
    // Scene 2: linear
    for(let y=0;y<50;y+=3)for(let x=0;x<50;x+=3){
      fill(0,0,W(x*0.04,{wave:'triangle',t:t*0.8,seed:781,range:[0,120]}));
      rect(x,y,3,3);
    }
    blendMode(BLEND);
  };

  // 79: Flow field — wave drives arrow direction
  FRAMES[79] = (t) => {
    stroke(255); strokeWeight(0.7);
    for(let r=0;r<6;r++)for(let c=0;c<6;c++){
      const angle=W((r*6+c)*0.15,{wave:'offset sine',t:t,seed:790,range:[-PI,PI]});
      const x=4+c*8,y=4+r*8;
      push();translate(x,y);rotate(angle);
      line(-3,0,3,0);line(2,-1.5,3,0);line(2,1.5,3,0);
      pop();
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 8 — SPATIAL: Wave in the third dimension
  // ═══════════════════════════════════════════════════════

  // 80: Wave-extruded terrain — 3D bars from above
  FRAMES[80] = (t) => {
    noStroke();
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){
      const h=W((r*8+c)*0.08,{wave:'mountain peaks',t:t,seed:800,range:[2,12]});
      const x=3+c*6-r*0.5,y=3+r*6-h;
      const bright=map(h,2,12,60,240);
      fill(bright,bright*0.8,W(r*8+c,{seed:801,t:t,range:[100,200]}));
      rect(x,y,5,h);
    }
  };

  // 81: Voxel landscape — isometric blocks with wave height
  FRAMES[81] = (t) => {
    noStroke();
    for(let r=4;r>=0;r--)for(let c=0;c<5;c++){
      const h=floor(W(r*5+c,{wave:'noise',t:t*0.3,seed:810,range:[1,4.99]}));
      for(let layer=0;layer<h;layer++){
        const ix=8+(c-r)*5,iy=25+(c+r)*3-layer*5;
        fill(80+layer*30,140+layer*20,80+layer*20);
        quad(ix,iy,ix+5,iy-2.5,ix,iy-5,ix-5,iy-2.5);
        fill(50+layer*20,100+layer*15,50+layer*15);
        quad(ix-5,iy-2.5,ix,iy,ix,iy+3,ix-5,iy+0.5);
        fill(30+layer*15,70+layer*10,30+layer*10);
        quad(ix,iy,ix+5,iy-2.5,ix+5,iy+0.5,ix,iy+3);
      }
    }
  };

  // 82: Starfield warp — wave controls warp speed
  FRAMES[82] = (t) => {
    const warp=W(t,{wave:'ramp up sine',seed:820,range:[0.3,3]});
    noStroke();
    for(let i=0;i<30;i++){
      const a=(i*2.4+0.5);
      const baseR=(i*1.3+t*warp*5)%25;
      const x=25+cos(a)*baseR,y=25+sin(a)*baseR;
      const sz=map(baseR,0,25,0.5,2.5);
      fill(255,map(baseR,0,25,80,255));
      ellipse(x,y,sz);
    }
  };

  // 83: Rotating donut — torus cross-section
  FRAMES[83] = (t) => {
    noStroke();
    const R=14,r=5;
    for(let a=0;a<TWO_PI;a+=0.15){
      for(let b=0;b<TWO_PI;b+=0.3){
        const x3=(R+r*cos(b))*cos(a);
        const y3=(R+r*cos(b))*sin(a);
        const z3=r*sin(b);
        const rot=W(t,{wave:'sine',seed:830,range:[0,TWO_PI]});
        const x2=x3*cos(rot)-z3*sin(rot);
        const z2=x3*sin(rot)+z3*cos(rot);
        const depth=map(z2,-20,20,40,255);
        fill(W(a*2,{seed:831,t:t,range:[100,200]}),depth*0.7,depth,depth);
        ellipse(25+x2*0.9,25+y3*0.9,map(z2,-20,20,0.5,2.5));
      }
    }
  };

  // 84: Parallax city skyline — 4 layers
  FRAMES[84] = (t) => {
    noStroke();
    for(let l=0;l<4;l++){
      const speed=0.15+l*0.25;
      const b=20+l*40;
      fill(b*0.3,b*0.4,b);
      for(let i=-1;i<8;i++){
        const x=((i*8+t*speed*20)%64)-8;
        const h=W(i+l*10,{wave:'steps',seed:840+l,t:t*0.1,range:[8,25+l*5]});
        rect(x,50-h,6,h);
      }
    }
  };

  // 85: Galaxy spiral — wave drives arm curvature
  FRAMES[85] = (t) => {
    noStroke();
    const twist=W(t*0.1,{wave:'sine',seed:850,range:[0.3,0.8]});
    for(let s of STATE[85].stars){
      s.a+=s.speed*0.01;
      const spiralA=s.a+s.r*twist;
      const x=25+cos(spiralA)*s.r;
      const y=25+sin(spiralA)*s.r;
      fill(255,W(s.r*0.1,{seed:851,t:t,range:[180,255]}),200,W(t+s.a,{seed:852,wave:'half sine',range:[80,255]}));
      ellipse(x,y,map(s.r,2,22,1,2.5));
    }
    fill(255,240,200);ellipse(25,25,4,4);
  };

  // 86: Depth-sorted spheres — wave controls Z
  FRAMES[86] = (t) => {
    noStroke();
    const spheres=[];
    for(let i=0;i<15;i++){
      const z=W(i*0.3,{wave:'sine',t:t+i,seed:860+i,range:[-1,1]});
      spheres.push({
        x:W(t*0.5,{wave:'noise',seed:870+i,range:[8,42]}),
        y:W(t*0.4,{wave:'noise',seed:880+i,range:[8,42]}),z,i
      });
    }
    spheres.sort((a,b)=>a.z-b.z);
    for(let s of spheres){
      const sz=map(s.z,-1,1,2,8);
      fill(W(s.i,{seed:890+s.i,t:t,range:[100,255]}),150,255,map(s.z,-1,1,80,255));
      ellipse(s.x,s.y,sz);
    }
  };

  // 87: Infinite tunnel — wave modulates tunnel shape
  FRAMES[87] = (t) => {
    noFill();strokeWeight(1);
    for(let i=0;i<10;i++){
      const depth=((t*0.5+i*0.1)%1);
      const sz=depth*45;
      const sides=floor(W(i,{wave:'steps',seed:870,t:t*0.2,range:[3,6.99]}));
      stroke(255,255*(1-depth));
      push();translate(25,25);rotate(W(i*0.3,{seed:871,t:t,range:[0,PI/6]}));
      beginShape();
      for(let j=0;j<sides;j++){
        const a=j*TWO_PI/sides-HALF_PI;
        vertex(cos(a)*sz/2,sin(a)*sz/2);
      }
      endShape(CLOSE);pop();
    }
  };

  // 88: Planet with ring — wave tilts ring
  FRAMES[88] = (t) => {
    noStroke();
    // Ring (behind)
    const tilt=W(t,{wave:'smooth solid sine',seed:880,range:[0.2,0.8]});
    stroke(180,160,140);strokeWeight(1);noFill();
    ellipse(25,25,38,38*tilt);
    // Planet
    noStroke();
    for(let i=12;i>0;i--){
      fill(W(i*0.3,{seed:881,t:t*0.2,range:[40,120]}),80+i*8,W(i*0.2,{seed:882,t:t,range:[80,150]}));
      ellipse(25,25,i*2,i*2);
    }
    // Ring (in front) — brighter arc
    noFill();stroke(200,180,160,200);strokeWeight(1.5);
    arc(25,25,38,38*tilt,-0.3,PI+0.3);
  };

  // 89: Hologram flicker — wave controls visibility
  FRAMES[89] = (t) => {
    const flicker=W(t*4,{wave:'up down noise',seed:890,range:[0.2,1]});
    const scanY=(t*40)%50;
    // Holographic shape
    noFill();stroke(0,200,255,200*flicker);strokeWeight(1);
    push();translate(25,25);rotate(W(t,{seed:891,wave:'sine',range:[0,TWO_PI]}));
    for(let i=0;i<3;i++){
      const s=10+i*5;
      rect(-s/2,-s/2,s,s);
    }
    pop();
    // Scan line
    stroke(0,200,255,80*flicker);strokeWeight(2);
    line(0,scanY,50,scanY);
  };

  // ═══════════════════════════════════════════════════════
  // ROW 9 — EXTREMES: Wave pushed to breaking point
  // ═══════════════════════════════════════════════════════

  // 90: All 34 waves in one frame — stacked micro-lines
  FRAMES[90] = (t) => {
    const all=['classic sine','sine','sharp peaks','square','pulse','stepped sine',
      'mountain peaks','valleys','zig-zag sine','batman','offset sine','steps down','steps',
      'squared sine','bumpy sine','wobble sine','up down noise','meta sine','triangle','ramp',
      'saw down','saw up','fade out','grow random','noise','fuzzy pulse','up down pulse',
      'bald patch','fuzzy peak sine','ramp up sine','triangle sine','round linked sine',
      'half sine','smooth solid sine'];
    noFill();strokeWeight(0.5);
    const scroll=(t*5)%170;
    for(let i=0;i<34;i++){
      const y=i*5-scroll;if(y<-5||y>50)continue;
      stroke((i*10)%256,180,220);
      beginShape();
      for(let x=0;x<50;x+=2)vertex(x,W(x*0.08,{wave:all[i],t:t,seed:i,range:[y,y+4]}));
      endShape();
    }
  };

  // 91: Wave chess — wave picks which squares have pieces
  FRAMES[91] = (t) => {
    noStroke();
    const pieces=['\u265A','\u265B','\u265C','\u265D','\u265E','\u265F'];
    for(let r=0;r<6;r++)for(let c=0;c<6;c++){
      fill((r+c)%2===0?60:30);rect(c*8+1,r*8+1,8,8);
      const hasPiece=W((r*6+c)*0.12,{wave:'square',t:t*0.3,seed:910,range:[0,1]})>0.5;
      if(hasPiece){
        const pi=floor(W(r*6+c,{seed:911,t:t*0.2,wave:'steps',range:[0,5.99]}));
        fill(W(r*6+c,{seed:912,t:t,wave:'square',range:[0,1]})>0.5?220:100);
        textSize(6);textAlign(CENTER,CENTER);
        text(pieces[pi],c*8+5,r*8+5);
      }
    }
  };

  // 92: Seismograph — wave amplitude builds and releases
  FRAMES[92] = (t) => {
    const buf=STATE[92].buf;
    // Shift left, add new sample
    for(let i=0;i<49;i++) buf[i]=buf[i+1];
    const quake=W(t,{wave:'sharp peaks',seed:920,range:[0,1]});
    buf[49]=25+W(t*3,{wave:'noise',seed:921,range:[-15,15]})*quake;
    noFill();stroke(255,50,50);strokeWeight(1.2);
    beginShape();for(let x=0;x<50;x++)vertex(x,buf[x]);endShape();
    // Baseline
    stroke(255,30);line(0,25,50,25);
  };

  // 93: Wave feedback — output feeds back as input
  FRAMES[93] = (t) => {
    noFill();stroke(255,200,100);strokeWeight(1);
    let val=0;
    beginShape();
    for(let x=0;x<50;x++){
      val=W(x*0.06+val*0.3,{wave:'sine',t:t,seed:930,range:[-1,1]});
      vertex(x,25+val*18);
    }
    endShape();
    // Second pass with different seed
    stroke(100,200,255);
    val=0;beginShape();
    for(let x=0;x<50;x++){
      val=W(x*0.06+val*0.5,{wave:'noise',t:t,seed:931,range:[-1,1]});
      vertex(x,25+val*18);
    }
    endShape();
  };

  // 94: Wave as random number generator — scatter plot
  FRAMES[94] = (t) => {
    noStroke();
    for(let i=0;i<50;i++){
      const x=W(i*0.07,{wave:'grow random',t:t,seed:940,range:[2,48]});
      const y=W(i*0.07,{wave:'grow random',t:t,seed:941,range:[2,48]});
      const sz=W(i*0.1,{seed:942,t:t,wave:'noise',range:[1,4]});
      fill(W(i,{seed:943,t:t,range:[100,255]}),180,255,180);
      ellipse(x,y,sz);
    }
  };

  // 95: Comet swarm — 4 comets with wave-driven orbits
  FRAMES[95] = (t) => {
    noStroke();
    for(let c of STATE[95]){
      const cx=25+W(t+c.phase,{wave:'wobble sine',seed:950+STATE[95].indexOf(c),range:[-20,20]});
      const cy=25+W(t+c.phase,{wave:'meta sine',seed:954+STATE[95].indexOf(c),range:[-20,20]});
      c.trail.unshift({x:cx,y:cy});if(c.trail.length>20)c.trail.pop();
      for(let i=0;i<c.trail.length;i++){
        fill(255,W(i*0.2,{seed:958,t:t,range:[100,200]}),50,map(i,0,c.trail.length,220,0));
        ellipse(c.trail[i].x,c.trail[i].y,map(i,0,c.trail.length,4,0.5));
      }
    }
  };

  // 96: Wave conductor — wand position affects all sub-waves
  FRAMES[96] = (t) => {
    const wx=W(t,{wave:'sine',seed:960,range:[5,45]});
    const wy=W(t*0.7,{wave:'triangle',seed:961,range:[5,20]});
    // Wand
    noStroke();fill(255);ellipse(wx,wy,3,3);
    stroke(200);strokeWeight(0.5);line(wx,wy,wx,wy+8);
    // Sub-waves influenced by wand position
    noFill();strokeWeight(1);
    for(let i=0;i<3;i++){
      stroke(W(i,{seed:962+i,t:t,range:[100,255]}),150,255);
      beginShape();
      for(let x=0;x<50;x++){
        const influence=1/(1+dist(x,35+i*5,wx,wy)*0.1);
        vertex(x,35+i*5+W(x*0.06,{wave:'sine',t:t,seed:965+i,range:[-5,5]})*influence*3);
      }
      endShape();
    }
  };

  // 97: Frequency modulation — wave1 modulates wave2's frequency
  FRAMES[97] = (t) => {
    noFill();strokeWeight(1.5);
    stroke(200,100,255);
    beginShape();
    for(let x=0;x<50;x++){
      const modulator=W(x*0.04,{wave:'sine',t:t,seed:970,range:[0.02,0.15]});
      const carrier=W(x*modulator*3,{wave:'sine',t:t,seed:971,range:[-18,18]});
      vertex(x,25+carrier);
    }
    endShape();
    // Show modulator as ghost
    stroke(200,100,255,40);strokeWeight(0.5);
    beginShape();
    for(let x=0;x<50;x++)
      vertex(x,25+W(x*0.04,{wave:'sine',t:t,seed:970,range:[-18,18]}));
    endShape();
  };

  // 98: DNA double helix 3D — waves create depth illusion
  FRAMES[98] = (t) => {
    STATE[98].rot+=0.02;
    strokeWeight(1.8);
    for(let y=0;y<50;y++){
      const phase=y*0.15+STATE[98].rot;
      const x1=25+W(phase,{wave:'sine',seed:980,range:[-12,12],t:0});
      const x2=25+W(phase+PI,{wave:'sine',seed:980,range:[-12,12],t:0});
      const z1=W(phase,{wave:'sine',seed:981,range:[0,1],t:0});
      const z2=W(phase+PI,{wave:'sine',seed:981,range:[0,1],t:0});
      // Draw back strand first
      if(z1<z2){
        stroke(0,150,255,z1*255);point(x1,y);
        if(y%4===0){stroke(255,50);line(x1,y,x2,y);}
        stroke(255,100,200,z2*255);point(x2,y);
      } else {
        stroke(255,100,200,z2*255);point(x2,y);
        if(y%4===0){stroke(255,50);line(x1,y,x2,y);}
        stroke(0,150,255,z1*255);point(x1,y);
      }
    }
  };

  // 99: The Grand Unified Wave — every visual property from a different wave type
  FRAMES[99] = (t) => {
    colorMode(HSB,360,100,100);
    const n=floor(W(t*0.3,{wave:'steps',seed:990,range:[4,12.99]}));
    for(let i=0;i<n;i++){
      const x=W(t+i*0.5,{wave:'wobble sine',seed:991+i,range:[5,45]});
      const y=W(t+i*0.5,{wave:'meta sine',seed:1001+i,range:[5,45]});
      const sz=W(i*0.3,{wave:'bumpy sine',t:t,seed:1011+i,range:[3,12]});
      const h=W(i,{wave:'triangle',t:t*0.5,seed:1021+i,range:[0,360]});
      const s=W(t,{wave:'half sine',seed:1031+i,range:[50,100]});
      const b=W(t*0.7,{wave:'ramp up sine',seed:1041+i,range:[50,100]});
      const rot=W(t,{wave:'saw up',seed:1051+i,range:[0,TWO_PI]});
      const sides=floor(W(i*0.5,{wave:'stepped sine',t:t*0.2,seed:1061+i,range:[3,6.99]}));
      noStroke();fill(h%360,s,b);
      push();translate(x,y);rotate(rot);
      beginShape();
      for(let j=0;j<sides;j++){
        const a=j*TWO_PI/sides-HALF_PI;
        vertex(cos(a)*sz,sin(a)*sz);
      }
      endShape(CLOSE);pop();
    }
    colorMode(RGB);
  };
}
