// p5-grid v06 — Oswald Grayscale Typography × p5.waves
// RULE: background 245, Oswald font, black/white/grayscale only (0–255, no color)
// RULE: every frame uses p5.waves + typography as subject

const FRAMES = [];
const STATE = {};
const COLS = 10, ROWS = 10, SZ = 50;
const GRID_W = COLS * SZ, GRID_H = ROWS * SZ;
const BG = 245;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  textFont('Oswald');
  initState();
  registerFrames();
}
function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function draw() {
  background(BG);
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
    // Cell background
    noStroke(); fill(BG); rect(0, 0, SZ, SZ);
    textFont('Oswald');
    if (FRAMES[i]) { try { FRAMES[i](t, fc); } catch(e) {} }
    ctx.restore(); pop();
  }
}

function W(c, o) { return Waves.wave(c, o); }
// Grayscale helper — clamp to 0-255
function G(c, o) { return constrain(floor(W(c, o)), 0, 255); }

function initState() {
  STATE[50] = Array.from({length:12},()=>({x:random(5,45),y:random(5,45),ch:String.fromCharCode(65+floor(random(26))),vx:random(-0.8,0.8),vy:random(-0.8,0.8)}));
  STATE[53] = {trail:[],idx:0};
  STATE[55] = {trail:[]};
  STATE[60] = {g:new Uint8Array(625),n:new Uint8Array(625),age:0};
  for(let i=0;i<625;i++) STATE[60].g[i]=random()<0.35?1:0;
  STATE[92] = {buf:[]};
}

function registerFrames() {

  // ═══════════════════════════════════════════════════════
  // ROW 0 — RAW: Waveforms as typographic lines
  // ═══════════════════════════════════════════════════════

  const row0w = ['classic sine','triangle','square','batman','noise',
                 'stepped sine','sharp peaks','mountain peaks','valleys','meta sine'];
  for (let n = 0; n < 10; n++) {
    FRAMES[n] = ((wv) => (t) => {
      // Wave as character string
      noStroke(); textSize(4); textAlign(CENTER,CENTER);
      for(let x=0;x<50;x+=3){
        const y=W(x*0.08,{wave:wv,t:t,seed:n*10,range:[8,42]});
        const gray=G(x*0.08,{wave:wv,t:t,seed:n*10+1,range:[0,180]});
        fill(gray); text(wv[0].toUpperCase(),x,y);
      }
      // Label
      fill(180); textSize(3); textAlign(LEFT,BOTTOM);
      text(wv,2,49);
    })(row0w[n]);
  }

  // ═══════════════════════════════════════════════════════
  // ROW 1 — LETTER ANATOMY: Wave sculpts type parts
  // ═══════════════════════════════════════════════════════

  // 10: Weight breathing — Oswald weight shifts
  FRAMES[10] = (t) => {
    const w = floor(W(t,{wave:'sine',seed:100,range:[300,700]}));
    // Simulate weight by size + stroke
    fill(30); noStroke(); textAlign(CENTER,CENTER);
    textSize(W(t,{wave:'sine',seed:101,range:[16,28]}));
    textStyle(BOLD);
    text('Aa',25,25);
    textStyle(NORMAL);
  };

  // 11: Baseline dance — each letter on own baseline
  FRAMES[11] = (t) => {
    fill(20); noStroke(); textSize(9); textAlign(CENTER,BASELINE);
    const word='Type';
    for(let i=0;i<4;i++){
      const bl=32+W(i*0.5+t,{wave:'wobble sine',seed:110,range:[-8,8]});
      text(word[i],8+i*10,bl);
    }
    stroke(180); strokeWeight(0.5); line(3,32,47,32);
  };

  // 12: Tracking wave — letter spacing oscillates
  FRAMES[12] = (t) => {
    fill(40); noStroke(); textSize(8); textAlign(CENTER,CENTER);
    const word='KERN';
    const sp=W(t,{wave:'bumpy sine',seed:120,range:[7,13]});
    for(let i=0;i<4;i++) text(word[i],25+(i-1.5)*sp,25);
  };

  // 13: Serif vs sans — wave morphs between (size switch)
  FRAMES[13] = (t) => {
    const phase=W(t,{wave:'triangle',seed:130,range:[0,1]});
    fill(20); noStroke(); textAlign(CENTER,CENTER);
    textSize(18);
    if(phase>0.5) textFont('serif'); else textFont('Oswald');
    text('Rg',25,25);
    textFont('Oswald');
    fill(160); textSize(3); textAlign(CENTER,BOTTOM);
    text(phase>0.5?'serif':'sans',25,48);
  };

  // 14: Counter pulse — 'O' hole breathes
  FRAMES[14] = (t) => {
    fill(30); noStroke(); ellipse(25,25,34,34);
    fill(BG);
    const hole=W(t,{wave:'smooth solid sine',seed:140,range:[6,22]});
    ellipse(25,25,hole,hole);
  };

  // 15: Stem weight variation — I with variable thickness
  FRAMES[15] = (t) => {
    fill(20); noStroke();
    const w=W(t,{wave:'ramp up sine',seed:150,range:[2,14]});
    rect(25-w/2,8,w,34);
    // Serifs
    rect(18,6,14,3); rect(18,41,14,3);
  };

  // 16: Ascender stretch — 'h' ascender grows
  FRAMES[16] = (t) => {
    fill(30); noStroke(); textSize(10); textAlign(CENTER,CENTER);
    const stretch=W(t,{wave:'pulse',seed:160,range:[1,2]});
    push(); translate(25,30); scale(1,stretch);
    text('h',0,-5);
    pop();
  };

  // 17: X-height study — lowercase vs caps height
  FRAMES[17] = (t) => {
    const xh=W(t,{wave:'fade out',seed:170,range:[5,12]});
    fill(40); noStroke(); textAlign(CENTER,CENTER);
    textSize(xh); text('x',15,30);
    textSize(xh*1.4); text('X',35,27);
    stroke(160); strokeWeight(0.3);
    const baseline=36;
    line(3,baseline,47,baseline);
    line(3,baseline-xh*1.5,47,baseline-xh*1.5);
    fill(180); noStroke(); textSize(3); textAlign(RIGHT,TOP);
    text('x-ht',47,2);
  };

  // 18: Ligature glide — 'fi' merges smoothly
  FRAMES[18] = (t) => {
    fill(20); noStroke(); textSize(16); textAlign(CENTER,CENTER);
    const gap=W(t,{wave:'saw down',seed:180,range:[-3,14]});
    text('f',25-gap*0.5-2,25);
    text('i',25+gap*0.5+2,25);
  };

  // 19: Drop cap — initial letter scale wave
  FRAMES[19] = (t) => {
    // Drop cap
    const sz=W(t,{wave:'half sine',seed:190,range:[12,30]});
    fill(20); noStroke(); textAlign(LEFT,TOP);
    textSize(sz); text('A',3,3);
    // Body text
    fill(120); textSize(3);
    const lines=['lorem ipsum','dolor sit','amet cons','ectetur ad'];
    const indent=sz*0.7+2;
    text(lines[0],indent,5);
    text(lines[1],indent,10);
    for(let i=2;i<4;i++) text(lines[i],3,5+i*5+sz*0.3);
  };

  // ═══════════════════════════════════════════════════════
  // ROW 2 — GRAYSCALE: Wave drives tonal value
  // ═══════════════════════════════════════════════════════

  // 20: Gradient text — each letter a different gray
  FRAMES[20] = (t) => {
    noStroke(); textSize(7); textAlign(CENTER,CENTER);
    const word='SHADES';
    for(let i=0;i<6;i++){
      fill(G(i*0.4,{wave:'sine',t:t,seed:200,range:[0,220]}));
      text(word[i],5+i*8,25);
    }
  };

  // 21: Gray noise field — chars at random grays
  FRAMES[21] = (t) => {
    noStroke(); textSize(4); textFont('Oswald'); textAlign(CENTER,CENTER);
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){
      fill(G((r*8+c)*0.05,{wave:'noise',t:t,seed:210,range:[0,200]}));
      const ch=String.fromCharCode(65+((r*8+c)%26));
      text(ch,c*6+3,r*6+3);
    }
  };

  // 22: Fading word — letters fade in and out
  FRAMES[22] = (t) => {
    noStroke(); textSize(8); textAlign(CENTER,CENTER);
    const word='GHOST';
    for(let i=0;i<5;i++){
      fill(G(i*0.5+t,{wave:'classic sine',seed:220+i,range:[BG,0]}));
      text(word[i],6+i*9,25);
    }
  };

  // 23: Halftone dots as letters — size = gray value
  FRAMES[23] = (t) => {
    noStroke(); textAlign(CENTER,CENTER);
    for(let r=0;r<10;r++)for(let c=0;c<10;c++){
      const v=W((r*10+c)*0.04,{wave:'sine',t:t,seed:230,range:[0,1]});
      const d=dist(c*5+2.5,r*5+2.5,25,25)*0.04;
      const sz=max(1,constrain((v-d)*10,1,6));
      fill(40); textSize(sz);
      text('O',c*5+2.5,r*5+2.5);
    }
  };

  // 24: Depth fog — text gets lighter with distance
  FRAMES[24] = (t) => {
    noStroke(); textSize(5); textAlign(CENTER,CENTER);
    const word='DEPTH';
    for(let layer=4;layer>=0;layer--){
      const gray=map(layer,0,4,20,200);
      const y=15+layer*6+W(layer*0.5,{wave:'sine',t:t,seed:240,range:[-3,3]});
      const sz=map(layer,0,4,8,4);
      fill(gray); textSize(sz);
      text(word,25,y);
    }
  };

  // 25: Vignette text — darker at edges
  FRAMES[25] = (t) => {
    noStroke(); textSize(3); textFont('Oswald'); textAlign(CENTER,CENTER);
    for(let r=0;r<10;r++)for(let c=0;c<10;c++){
      const d=dist(c*5+2.5,r*5+2.5,25,25);
      const edge=constrain(map(d,0,25,20,200),20,200);
      const wave=G((r*10+c)*0.04,{wave:'bumpy sine',t:t,seed:250,range:[0,60]});
      fill(constrain(edge+wave,0,220));
      text(String.fromCharCode(65+((r+c*3)%26)),c*5+2.5,r*5+2.5);
    }
  };

  // 26: Light sweep — diagonal highlight crosses text
  FRAMES[26] = (t) => {
    noStroke(); textSize(5); textAlign(CENTER,CENTER);
    const sweepPos=W(t,{wave:'saw up',seed:260,range:[-20,70]});
    const word='LIGHT';
    for(let i=0;i<5;i++){
      const x=6+i*9;
      const d=abs(x-sweepPos);
      fill(constrain(map(d,0,15,20,180),20,180));
      text(word[i],x,25);
    }
  };

  // 27: Emboss effect — light/dark offset
  FRAMES[27] = (t) => {
    noStroke(); textSize(16); textAlign(CENTER,CENTER);
    const off=W(t,{wave:'sine',seed:270,range:[0.5,2]});
    fill(200); text('E',25-off,25-off); // highlight
    fill(80); text('E',25+off,25+off);  // shadow
    fill(BG-20); text('E',25,25);       // face
  };

  // 28: Gray bars — each bar a different wave-driven gray
  FRAMES[28] = (t) => {
    noStroke();
    for(let i=0;i<10;i++){
      const gray=G(i*0.3,{wave:'triangle',t:t,seed:280,range:[20,220]});
      fill(gray); rect(i*5,0,5,38);
      fill(gray<120?200:20); textSize(3); textAlign(CENTER,TOP);
      text(nf(floor(gray),3),i*5+2.5,40);
    }
  };

  // 29: Shadow text — long cast shadow in gray
  FRAMES[29] = (t) => {
    noStroke(); textSize(14); textAlign(CENTER,CENTER);
    const angle=W(t*0.3,{wave:'ramp',seed:290,range:[0,TWO_PI]});
    const len=W(t,{wave:'sine',seed:291,range:[2,6]});
    for(let i=floor(len);i>=0;i--){
      fill(map(i,0,len,180,BG));
      text('S',25+cos(angle)*i,25+sin(angle)*i);
    }
    fill(20); text('S',25,25);
  };

  // ═══════════════════════════════════════════════════════
  // ROW 3 — MOTION: Wave choreographs Oswald letters
  // ═══════════════════════════════════════════════════════

  // 30: Bounce line — word bounces as a unit
  FRAMES[30] = (t) => {
    fill(20); noStroke(); textSize(7); textAlign(CENTER,CENTER);
    const y=25+W(t*2,{wave:'sharp peaks',seed:300,range:[-12,0]});
    text('BOUNCE',25,y);
    // Ground
    stroke(180); strokeWeight(0.5); line(5,38,45,38);
  };

  // 31: Spinning glyph — single character rotates
  FRAMES[31] = (t) => {
    fill(20); noStroke(); textSize(24); textAlign(CENTER,CENTER);
    push(); translate(25,25);
    rotate(W(t,{wave:'saw up',seed:310,range:[0,TWO_PI]}));
    text('R',0,0);
    pop();
  };

  // 32: Typewriter effect — Oswald monospaced appearance
  FRAMES[32] = (t) => {
    fill(30); noStroke(); textSize(6); textAlign(LEFT,CENTER);
    const msg='OSWALD';
    const idx=floor(W(t*1.5,{wave:'ramp',seed:320,range:[0,msg.length+0.99]}));
    text(msg.substring(0,min(idx,msg.length)),5,25);
    if(W(t*2,{wave:'square',seed:321,range:[0,1]})>0.5){
      fill(80); rect(5+min(idx,msg.length)*4.5,21,2,8);
    }
  };

  // 33: Wave word — letters undulate
  FRAMES[33] = (t) => {
    noStroke(); textSize(7); textAlign(CENTER,CENTER);
    const word='RIPPLE';
    for(let i=0;i<6;i++){
      const y=25+W(i*0.4,{wave:'sine',t:t*2,seed:330,range:[-10,10]});
      fill(G(i*0.3,{wave:'sine',t:t,seed:331,range:[20,100]}));
      text(word[i],6+i*7,y);
    }
  };

  // 34: Scale pulse — glyph breathes
  FRAMES[34] = (t) => {
    const sz=W(t,{wave:'smooth solid sine',seed:340,range:[6,32]});
    const gray=G(t,{wave:'sine',seed:341,range:[0,120]});
    fill(gray); noStroke(); textSize(sz); textAlign(CENTER,CENTER);
    text('O',25,25);
  };

  // 35: Falling chars — gravity pull
  FRAMES[35] = (t) => {
    noStroke(); textSize(6); textAlign(CENTER,CENTER);
    for(let i=0;i<8;i++){
      const speed=0.5+W(i*0.3,{seed:350+i,t:0,wave:'noise',range:[0,1.5]});
      const y=((t*speed*18+i*15)%58)-4;
      const x=W(i,{seed:358+i,t:0,wave:'noise',range:[5,45]});
      fill(G(i,{seed:366,t:t,range:[20,150]}));
      text(String.fromCharCode(65+i),x,y);
    }
  };

  // 36: Pendulum word — swinging from top
  FRAMES[36] = (t) => {
    const angle=W(t,{wave:'triangle',seed:360,range:[-PI/4,PI/4]});
    push(); translate(25,3);
    stroke(140); strokeWeight(0.5); noFill();
    rotate(angle); line(0,0,0,22);
    fill(30); noStroke(); textSize(6); textAlign(CENTER,TOP);
    text('WAVE',0,23);
    pop();
  };

  // 37: Orbit letters — characters circle center
  FRAMES[37] = (t) => {
    noStroke(); textSize(6); textAlign(CENTER,CENTER);
    const word='ORBIT';
    for(let i=0;i<5;i++){
      const a=i*TWO_PI/5+W(t,{wave:'saw up',seed:370,range:[0,TWO_PI]});
      const r=W(i*0.5,{wave:'bumpy sine',t:t,seed:371,range:[10,19]});
      fill(G(i,{seed:372,t:t,range:[20,140]}));
      text(word[i],25+cos(a)*r,25+sin(a)*r);
    }
  };

  // 38: Metronome letter — snaps left/right
  FRAMES[38] = (t) => {
    const side=W(t,{wave:'square',seed:380,range:[0,1]})>0.5;
    fill(20); noStroke(); textSize(14); textAlign(CENTER,CENTER);
    text('T',side?14:36,25);
    stroke(160); strokeWeight(0.3); line(25,8,25,42);
  };

  // 39: Elastic snap — letters pulled and released
  FRAMES[39] = (t) => {
    noStroke(); textSize(7); textAlign(CENTER,CENTER);
    const word='SNAP';
    for(let i=0;i<4;i++){
      const x=10+i*10+W(t,{wave:'pulse',seed:390+i,range:[-4,4]});
      fill(G(i,{seed:394,t:t,range:[20,120]}));
      text(word[i],x,25);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 4 — PATTERN: Type as texture
  // ═══════════════════════════════════════════════════════

  // 40: Letter grid — wave picks gray per cell
  FRAMES[40] = (t) => {
    noStroke(); textSize(4); textAlign(CENTER,CENTER);
    for(let r=0;r<10;r++)for(let c=0;c<10;c++){
      fill(G((r*10+c)*0.04,{wave:'noise',t:t,seed:400,range:[30,200]}));
      text(String.fromCharCode(65+((r*3+c*7)%26)),c*5+2.5,r*5+2.5);
    }
  };

  // 41: Checkerboard — wave flips pattern
  FRAMES[41] = (t) => {
    noStroke(); textSize(5); textAlign(CENTER,CENTER);
    const flip=W(t,{wave:'square',seed:410,range:[0,1]})>0.5?1:0;
    for(let r=0;r<5;r++)for(let c=0;c<5;c++){
      const dark=((r+c+flip)%2===0);
      fill(dark?30:210); rect(c*10,r*10,10,10);
      fill(dark?210:30);
      text(String.fromCharCode(65+((r*5+c)%26)),c*10+5,r*10+5);
    }
  };

  // 42: Diagonal waterfall — characters cascade diagonally
  FRAMES[42] = (t) => {
    noStroke(); textSize(4); textAlign(CENTER,CENTER);
    for(let i=0;i<15;i++){
      const offset=W(i*0.2,{wave:'saw up',t:t,seed:420,range:[0,50]});
      const x=(i*4+offset)%55-2;
      const y=(i*4+offset*0.7)%55-2;
      fill(G(i,{seed:421,t:t,range:[20,160]}));
      text(String.fromCharCode(65+i),x,y);
    }
  };

  // 43: Rotated tile grid — each letter rotated differently
  FRAMES[43] = (t) => {
    noStroke(); textSize(6); textAlign(CENTER,CENTER);
    for(let r=0;r<5;r++)for(let c=0;c<5;c++){
      push(); translate(c*10+5,r*10+5);
      rotate(W((r*5+c)*0.2,{wave:'offset sine',t:t,seed:430,range:[0,TWO_PI]}));
      fill(G(r*5+c,{seed:431,t:t,range:[20,150]}));
      text('A',0,0); pop();
    }
  };

  // 44: Binary matrix — 0/1 with gray variation
  FRAMES[44] = (t) => {
    noStroke(); textSize(4); textAlign(CENTER,CENTER);
    for(let r=0;r<10;r++)for(let c=0;c<10;c++){
      const v=W((r*10+c)*0.05,{wave:'square',t:t*0.4,seed:440,range:[0,1]});
      fill(G(r*10+c,{seed:441,t:t,range:[30,180]}));
      text(v>0.5?'1':'0',c*5+2.5,r*5+2.5);
    }
  };

  // 45: Column rain — matrix-style Oswald
  FRAMES[45] = (t) => {
    noStroke(); textSize(5); textAlign(CENTER,CENTER);
    for(let c=0;c<8;c++){
      const speed=W(c*0.3,{seed:450+c,t:0,wave:'noise',range:[0.5,2]});
      for(let i=0;i<8;i++){
        const y=((i*6+t*speed*20+c*11)%55)-3;
        const gray=map(y,0,50,40,180);
        fill(gray);
        text(String.fromCharCode(65+((i*7+c*3)%26)),c*6+3,y);
      }
    }
  };

  // 46: Hex character grid
  FRAMES[46] = (t) => {
    noStroke(); textSize(4); textAlign(CENTER,CENTER);
    for(let r=0;r<7;r++)for(let c=0;c<6;c++){
      const x=c*8+(r%2)*4+2,y=r*7+3;
      fill(G((r*6+c)*0.1,{wave:'triangle sine',t:t,seed:460,range:[20,180]}));
      text(String.fromCharCode(65+((r*6+c)%26)),x,y);
    }
  };

  // 47: Morse dots and dashes
  FRAMES[47] = (t) => {
    fill(40); noStroke(); textSize(6); textAlign(CENTER,CENTER);
    for(let r=0;r<6;r++)for(let c=0;c<8;c++){
      const v=W((r*8+c)*0.1,{wave:'pulse',t:t,seed:470,range:[0,1]});
      text(v>0.5?'\u2014':'.',c*6+3,r*8+4);
    }
  };

  // 48: Sierpinski characters
  FRAMES[48] = (t) => {
    fill(40); noStroke(); textSize(2); textAlign(CENTER,CENTER);
    for(let y=0;y<32;y++)for(let x=0;x<32;x++){
      let a=x,b=y,show=true;
      while(a>0||b>0){if(a%2===1&&b%2===1){show=false;break;}a=floor(a/2);b=floor(b/2);}
      if(show){
        const ch=String.fromCharCode(65+floor(W(x+y*32,{seed:480,t:t,wave:'noise',range:[0,25.99]})));
        text(ch,x*1.5+1,y*1.5+1);
      }
    }
  };

  // 49: Cross-stitch pattern — X chars in grid
  FRAMES[49] = (t) => {
    noStroke(); textSize(4); textAlign(CENTER,CENTER);
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){
      const on=W((r*8+c)*0.08,{wave:'bumpy sine',t:t,seed:490,range:[0,1]})>0.4;
      if(on){
        fill(G(r*8+c,{seed:491,t:t,range:[20,140]}));
        text('X',c*6+3,r*6+3);
      }
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 5 — ORGANIC: Living typography
  // ═══════════════════════════════════════════════════════

  // 50: Letter swarm — characters drift organically
  FRAMES[50] = (t) => {
    const ps=STATE[50]; noStroke(); textSize(5); textAlign(CENTER,CENTER);
    for(let p of ps){
      const i=ps.indexOf(p);
      p.vx+=W(t+i,{wave:'noise',seed:500+i,range:[-0.15,0.15]});
      p.vy+=W(t+i+10,{wave:'noise',seed:506+i,range:[-0.15,0.15]});
      const sp=sqrt(p.vx*p.vx+p.vy*p.vy);if(sp>1){p.vx/=sp;p.vy/=sp;}
      p.x+=p.vx;p.y+=p.vy;p.x=(p.x+50)%50;p.y=(p.y+50)%50;
      fill(G(i,{seed:512,t:t,range:[20,140]}));
      text(p.ch,p.x,p.y);
    }
  };

  // 51: Growing word — emerges from center
  FRAMES[51] = (t) => {
    noStroke(); textAlign(CENTER,CENTER);
    const word='GROW';
    for(let i=0;i<4;i++){
      const phase=(t*0.5+i*0.25)%1;
      const sz=phase*10+3;
      fill(G(i,{seed:510,t:t,range:[30,map(phase,0,1,180,20)]}));
      textSize(sz);
      text(word[i],25+(i-1.5)*phase*5,25);
    }
  };

  // 52: Breathing block — text block expands
  FRAMES[52] = (t) => {
    fill(40); noStroke(); textSize(3); textAlign(CENTER,CENTER);
    const breath=W(t,{wave:'classic sine',seed:520,range:[0.7,1.2]});
    push(); translate(25,25); scale(breath);
    const lines=['The quick','brown fox','jumps over','the lazy','dog today'];
    for(let i=0;i<5;i++) text(lines[i],0,(i-2)*7);
    pop();
  };

  // 53: Letter trail — character leaves fading path
  FRAMES[53] = (t) => {
    const s=STATE[53];
    const x=W(t,{wave:'wobble sine',seed:530,range:[5,45]});
    const y=W(t,{wave:'meta sine',seed:531,range:[5,45]});
    const ch=String.fromCharCode(65+floor(W(t*2,{seed:532,wave:'noise',range:[0,25.99]})));
    s.trail.unshift({x,y,ch});if(s.trail.length>15)s.trail.pop();
    noStroke(); textAlign(CENTER,CENTER);
    for(let i=0;i<s.trail.length;i++){
      fill(map(i,0,s.trail.length,30,210));
      textSize(map(i,0,s.trail.length,7,2));
      text(s.trail[i].ch,s.trail[i].x,s.trail[i].y);
    }
  };

  // 54: Decaying text — wave erodes visibility
  FRAMES[54] = (t) => {
    noStroke(); textSize(5); textAlign(CENTER,CENTER);
    const word='ENTROPY';
    for(let i=0;i<7;i++){
      const decay=W(i*0.4+t*0.5,{wave:'fade out',seed:540,range:[0,1]});
      if(decay>0.25){
        fill(map(decay,0.25,1,200,20));
        text(word[i],5+i*6,25);
      }
    }
  };

  // 55: Morphing trail — evolving character string
  FRAMES[55] = (t) => {
    const s=STATE[55];
    const ch=String.fromCharCode(65+floor(W(t*3,{seed:550,wave:'noise',range:[0,25.99]})));
    s.trail.unshift(ch);if(s.trail.length>20)s.trail.pop();
    fill(40); noStroke(); textSize(3); textFont('Oswald'); textAlign(LEFT,TOP);
    let str='';for(let c of s.trail) str+=c;
    text(str.substring(0,14),2,20);
    if(str.length>14) text(str.substring(14),2,26);
  };

  // 56: Root word — branches downward
  FRAMES[56] = (t) => {
    noStroke(); textSize(3); textAlign(CENTER,CENTER);
    for(let branch=0;branch<3;branch++){
      let x=12+branch*13,y=5;
      for(let i=0;i<10;i++){
        const dir=W(i*0.3+branch,{wave:'zig-zag sine',t:t,seed:560+branch,range:[-2,2]});
        x+=dir;y+=4;
        fill(G(i+branch*10,{seed:563,t:t,range:[30,160]}));
        if(y<50) text(String.fromCharCode(97+((i+branch*4)%26)),constrain(x,3,47),y);
      }
    }
  };

  // 57: Mitosis — word splits in two
  FRAMES[57] = (t) => {
    noStroke(); textSize(6); textAlign(CENTER,CENTER);
    const split=W(t,{wave:'ramp',seed:570,range:[0,12]});
    fill(40); text('TYPE',25,25-split);
    fill(120); text('TYPE',25,25+split);
  };

  // 58: Spiral text — letters along spiral
  FRAMES[58] = (t) => {
    noStroke(); textSize(4); textAlign(CENTER,CENTER);
    const phrase='OSWALD';
    for(let i=0;i<phrase.length*2;i++){
      const a=i*0.5+W(t,{wave:'saw up',seed:580,range:[0,TWO_PI*0.5]});
      const r=4+i*1.8;
      if(r<24){
        fill(G(i,{seed:581,t:t,range:[20,150]}));
        text(phrase[i%phrase.length],25+cos(a)*r,25+sin(a)*r);
      }
    }
  };

  // 59: Heartbeat word — letters pulse like EKG
  FRAMES[59] = (t) => {
    noStroke(); textAlign(CENTER,CENTER);
    const word='PULSE';
    for(let i=0;i<5;i++){
      const beat=W(t*2+i*0.2,{wave:'sharp peaks',seed:590,range:[5,13]});
      fill(G(i,{seed:591,t:t,range:[20,100]}));
      textSize(beat); text(word[i],6+i*9,25);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 6 — PIXEL TYPE: Bitmap text effects
  // ═══════════════════════════════════════════════════════

  // 60: Conway Life — cells are tiny letters
  FRAMES[60] = (t,fc) => {
    const s=STATE[60];
    if(fc%3===0){
      s.n.fill(0);let alive=0;
      for(let y=0;y<25;y++)for(let x=0;x<25;x++){
        let c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
          if(!dx&&!dy)continue;c+=s.g[((y+dy+25)%25)*25+((x+dx+25)%25)];}
        const i=y*25+x;s.n[i]=s.g[i]?(c===2||c===3?1:0):(c===3?1:0);
        if(!s.n[i]&&W((x+y*25)*0.01,{wave:'pulse',t:t,seed:600,range:[0,1]})>0.97)s.n[i]=1;
        alive+=s.n[i];
      }
      [s.g,s.n]=[s.n,s.g];s.age++;
      if(alive<3||s.age>200){for(let i=0;i<625;i++)s.g[i]=random()<0.35?1:0;s.age=0;}
    }
    noStroke(); textSize(2); textAlign(CENTER,CENTER);
    for(let y=0;y<25;y++)for(let x=0;x<25;x++)
      if(s.g[y*25+x]){fill(40);text('*',x*2+1,y*2+1);}
  };

  // 61: Scrolling LED — Oswald chars slide through
  FRAMES[61] = (t) => {
    fill(30); noStroke(); textSize(8); textAlign(LEFT,CENTER);
    const msg='HELLO WORLD  ';
    const off=W(t,{wave:'saw up',seed:610,range:[0,msg.length*6]});
    for(let i=0;i<msg.length;i++){
      const x=i*6-off;
      if(x>-8&&x<55) text(msg[i],x,25);
    }
  };

  // 62: Barcode text — wave controls bar widths
  FRAMES[62] = (t) => {
    fill(30); noStroke();
    let x=3;
    for(let i=0;i<15&&x<47;i++){
      const w=floor(W(i*0.2,{wave:'steps',t:t,seed:620,range:[1,4.99]}));
      if(i%2===0) rect(x,10,w,28);
      x+=w+1;
    }
    textSize(3); textAlign(CENTER,BOTTOM);
    text('ISBN WAVE',25,47);
  };

  // 63: QR-like grid — wave fills/empties cells
  FRAMES[63] = (t) => {
    noStroke();
    for(let r=0;r<10;r++)for(let c=0;c<10;c++){
      const on=W((r*10+c)*0.05,{wave:'square',t:t*0.3,seed:630,range:[0,1]})>0.5;
      fill(on?40:BG); rect(c*5,r*5,5,5);
    }
  };

  // 64: Scanline reveal — wave uncovers text line by line
  FRAMES[64] = (t) => {
    noStroke(); textSize(4); textAlign(LEFT,TOP);
    const lines=['SCAN','LINE','TEXT','GRAY','MODE'];
    const active=floor(W(t,{wave:'ramp',seed:640,range:[0,4.99]}));
    for(let i=0;i<=active;i++){
      fill(map(i,0,4,30,140));
      text(lines[i],5,5+i*9);
    }
    stroke(120); strokeWeight(0.5);
    const sy=5+active*9+7;
    line(0,sy,50,sy);
  };

  // 65: Glitch displacement — wave shifts chars horizontally
  FRAMES[65] = (t) => {
    noStroke(); textSize(5); textAlign(CENTER,CENTER);
    const word='GLITCH';
    for(let i=0;i<6;i++){
      const dx=W(t*3+i,{wave:'up down noise',seed:650+i,range:[-8,8]});
      const visible=W(t*2+i,{seed:656+i,wave:'square',range:[0,1]})>0.15;
      if(visible){
        fill(G(i,{seed:662,t:t,range:[20,140]}));
        text(word[i],6+i*7+dx,25);
      }
    }
  };

  // 66: Pixel font blocks — blocky character rendering
  FRAMES[66] = (t) => {
    fill(30); noStroke();
    const idx=floor(W(t*0.5,{wave:'noise',seed:660,range:[0,3.99]}));
    // Simple block letters
    const patterns=[
      [1,1,1,1,0,1,1,1,1,1,0,1,1,0,1], // A
      [1,1,0,1,0,1,1,1,0,1,0,1,1,1,0], // B
      [0,1,1,1,0,0,1,0,0,1,0,0,0,1,1], // C
      [1,1,0,1,0,1,1,0,1,1,0,1,1,1,0], // D
    ];
    const P=patterns[idx];
    for(let r=0;r<5;r++)for(let c=0;c<3;c++){
      if(P[r*3+c]) rect(17+c*6,8+r*7,5,6);
    }
  };

  // 67: Halftone text — dot size encodes gray
  FRAMES[67] = (t) => {
    noStroke(); textAlign(CENTER,CENTER);
    for(let r=0;r<10;r++)for(let c=0;c<10;c++){
      const v=W((r*10+c)*0.04,{wave:'sine',t:t,seed:670,range:[0,1]});
      const d=dist(c*5+2.5,r*5+2.5,25,25)*0.03;
      const sz=constrain((v-d)*8,1,5);
      fill(40); textSize(sz);
      text('.',c*5+2.5,r*5+2.5);
    }
  };

  // 68: Gradient fill text — big letter with gradient
  FRAMES[68] = (t) => {
    noStroke(); textAlign(CENTER,CENTER);
    // Multiple overlapping lines of the same letter at different grays
    for(let y=8;y<42;y+=2){
      const gray=G(y*0.04,{wave:'sine',t:t,seed:680,range:[20,200]});
      fill(gray);
      // Clip each horizontal band
      textSize(28);
      const ctx=drawingContext;
      ctx.save();
      ctx.beginPath();ctx.rect(0,y,50,2);ctx.clip();
      text('W',25,25);
      ctx.restore();
    }
  };

  // 69: Dither characters — density encodes value
  FRAMES[69] = (t) => {
    noStroke(); textSize(2); textAlign(CENTER,CENTER);
    const chars=' .,:;+*#@';
    for(let y=0;y<50;y+=3)for(let x=0;x<50;x+=3){
      const v=W((x+y*50)*0.001,{wave:'valleys',t:t,seed:690,range:[0,8.99]});
      const d=dist(x,y,25+W(t,{seed:691,range:[-6,6]}),25);
      const idx=constrain(floor(v-d*0.08),0,8);
      if(idx>0){fill(60);text(chars[idx],x,y);}
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 7 — COMPOSITION: Multi-layer type
  // ═══════════════════════════════════════════════════════

  // 70: Crossed words — BLACK horizontal, WHITE vertical
  FRAMES[70] = (t) => {
    noStroke(); textSize(6); textAlign(CENTER,CENTER);
    const cross=floor(W(t*0.3,{wave:'steps',seed:700,range:[0,4.99]}));
    fill(40);
    const h='BLACK';
    for(let i=0;i<5;i++) text(h[i],6+i*9,6+cross*9);
    fill(120);
    const v='WHITE';
    for(let i=0;i<5;i++) text(v[i],6+cross*9,6+i*9);
  };

  // 71: Layered silhouette text — stacked words at decreasing sizes
  FRAMES[71] = (t) => {
    noStroke(); textAlign(CENTER,CENTER);
    const words=['WAVE','WAVE','WAVE','WAVE','WAVE'];
    for(let i=4;i>=0;i--){
      const sz=6+i*3;
      const y=25+W(i*0.5,{wave:'sine',t:t*0.5,seed:710+i,range:[-4,4]});
      fill(map(i,0,4,30,190));
      textSize(sz); text(words[i],25,y);
    }
  };

  // 72: Text columns — wave controls column widths
  FRAMES[72] = (t) => {
    noStroke(); textSize(3); textAlign(LEFT,TOP); fill(60);
    const w1=floor(W(t,{wave:'sine',seed:720,range:[15,35]}));
    for(let y=3;y<48;y+=4){
      let line1='',line2='';
      for(let x=0;x<floor(w1/3);x++) line1+=String.fromCharCode(97+((y+x)%26));
      for(let x=0;x<floor((45-w1)/3);x++) line2+=String.fromCharCode(97+((y+x+5)%26));
      text(line1,2,y);
      text(line2,w1+5,y);
    }
    stroke(140);strokeWeight(0.3);line(w1+2,0,w1+2,50);
  };

  // 73: Concrete circle — text fills a circle shape
  FRAMES[73] = (t) => {
    noStroke(); textSize(3); textAlign(CENTER,CENTER);
    const r=W(t,{wave:'bumpy sine',seed:730,range:[12,22]});
    for(let y=0;y<50;y+=3)for(let x=0;x<50;x+=3){
      if(dist(x,y,25,25)<r){
        fill(G(x+y,{seed:731,t:t,range:[30,130]}));
        text('#',x,y);
      }
    }
  };

  // 74: Reflection — word + mirrored below baseline
  FRAMES[74] = (t) => {
    noStroke(); textSize(8); textAlign(CENTER,CENTER);
    fill(30); text('GRAY',25,18);
    // Reflection — lighter
    push(); translate(25,W(t,{wave:'sine',seed:740,range:[34,40]}));
    scale(1,-0.8); fill(180);
    text('GRAY',0,0); pop();
    stroke(160);strokeWeight(0.3);line(5,27,45,27);
  };

  // 75: Redaction — black bars over text, wave controlled
  FRAMES[75] = (t) => {
    fill(60); noStroke(); textSize(4); textAlign(LEFT,TOP);
    text('TOP SECRET',3,10);
    text('CLASSIFIED',3,20);
    text('WAVE DATA',3,30);
    fill(30);
    for(let i=0;i<3;i++){
      const w=W(i*0.5,{wave:'noise',t:t,seed:750,range:[10,40]});
      const x=W(i*0.3,{seed:753+i,t:t,wave:'sine',range:[2,15]});
      rect(x,9+i*10,w,6);
    }
  };

  // 76: Beat sequencer — Oswald letters as beats
  FRAMES[76] = (t) => {
    noStroke(); textSize(4); textAlign(CENTER,CENTER);
    const step=floor((t*4)%8);
    const word='TYPEFACE';
    for(let r=0;r<4;r++)for(let c=0;c<8;c++){
      const on=W((r*8+c)*0.12,{wave:'square',t:t*0.4,seed:760+r,range:[0,1]})>0.5;
      const active=c===step&&on;
      fill(active?20:on?100:210);
      text(word[c],c*6+3,r*12+6);
    }
  };

  // 77: Text wave interference — two word scrolls cross
  FRAMES[77] = (t) => {
    noStroke(); textSize(3); textAlign(LEFT,TOP);
    for(let y=0;y<50;y+=5){
      const off1=W(y*0.04,{wave:'sine',t:t,seed:770,range:[0,15]});
      const off2=W(y*0.04,{wave:'triangle',t:t*1.1,seed:771,range:[0,15]});
      fill(80); text('WAVE',off1,y);
      fill(140); text('TYPE',25+off2,y);
    }
  };

  // 78: Footnotes — wave controls which footnote is visible
  FRAMES[78] = (t) => {
    fill(40); noStroke(); textSize(5); textAlign(LEFT,TOP);
    text('Text here',3,5);
    const note=floor(W(t*0.5,{wave:'steps',seed:780,range:[1,3.99]}));
    textSize(3); fill(120);
    text('['+note+']',38,5);
    // Footnote at bottom
    textSize(3); fill(100);
    const notes=['see appendix','cf. wave theory','ibid. p.42'];
    text(note+'. '+notes[note-1],3,42);
  };

  // 79: Flow field of letters — direction from wave
  FRAMES[79] = (t) => {
    noStroke(); textSize(4); textAlign(CENTER,CENTER);
    for(let r=0;r<6;r++)for(let c=0;c<6;c++){
      const angle=W((r*6+c)*0.15,{wave:'offset sine',t:t,seed:790,range:[0,TWO_PI]});
      const x=4+c*8,y=4+r*8;
      // Arrow character based on angle
      const arrows=['\u2192','\u2197','\u2191','\u2196','\u2190','\u2199','\u2193','\u2198'];
      const idx=floor(((angle+PI)/(TWO_PI))*8)%8;
      fill(G(r*6+c,{seed:791,t:t,range:[30,150]}));
      text(arrows[idx],x,y);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 8 — SPATIAL: Type in perspective
  // ═══════════════════════════════════════════════════════

  // 80: Depth layers — 3 words at different sizes/grays
  FRAMES[80] = (t) => {
    noStroke(); textAlign(CENTER,CENTER);
    const layers=[['FAR',3,180],['MID',6,120],['NEAR',10,40]];
    for(let [w,sz,gray] of layers){
      textSize(sz);fill(gray);
      const dx=W(t,{wave:'sine',seed:800+sz,range:[-sz,sz]});
      text(w,25+dx,25);
    }
  };

  // 81: Extrude — wave controls extrusion depth
  FRAMES[81] = (t) => {
    noStroke(); textSize(18); textAlign(CENTER,CENTER);
    const d=floor(W(t,{wave:'sine',seed:810,range:[1,6]}));
    for(let i=d;i>=0;i--){
      fill(map(i,0,d,180,BG));
      text('B',25+i*0.7,25+i*0.7);
    }
    fill(30); text('B',25,25);
  };

  // 82: Rotating word — 3D spin illusion via squeeze
  FRAMES[82] = (t) => {
    noStroke(); textAlign(CENTER,CENTER);
    const angle=W(t,{wave:'saw up',seed:820,range:[0,TWO_PI]});
    const squeeze=cos(angle);
    const gray=map(abs(squeeze),0,1,160,30);
    fill(gray); textSize(max(1,10*abs(squeeze)));
    push(); translate(25,25); scale(squeeze,1);
    text('SPIN',0,0); pop();
  };

  // 83: Stacked isometric — letters piled up
  FRAMES[83] = (t) => {
    noStroke(); textSize(5); textAlign(CENTER,CENTER);
    for(let i=0;i<6;i++){
      const h=floor(W(i*0.4,{wave:'mountain peaks',t:t,seed:830,range:[1,4.99]}));
      for(let layer=0;layer<h;layer++){
        fill(map(layer,0,3,40,160));
        text(String.fromCharCode(65+i),8+i*7-layer,38-i*3-layer*5);
      }
    }
  };

  // 84: Tunnel text — words shrink to center
  FRAMES[84] = (t) => {
    noStroke(); textAlign(CENTER,CENTER);
    for(let i=0;i<6;i++){
      const phase=((t*0.4+i*0.167)%1);
      textSize(2+phase*10);
      fill(map(phase,0,1,180,30));
      text('O',25,25);
    }
  };

  // 85: Long shadow — cast shadow extends
  FRAMES[85] = (t) => {
    noStroke(); textSize(14); textAlign(CENTER,CENTER);
    const angle=W(t*0.3,{wave:'ramp',seed:850,range:[0,TWO_PI]});
    const len=floor(W(t,{wave:'sine',seed:851,range:[2,8]}));
    for(let i=len;i>=0;i--){
      fill(map(i,0,len,180,BG));
      text('K',25+cos(angle)*i,25+sin(angle)*i);
    }
    fill(20); text('K',25,25);
  };

  // 86: Parallax words — 3 layers scroll at different speeds
  FRAMES[86] = (t) => {
    noStroke(); textAlign(LEFT,CENTER);
    const layers=[{word:'BACK',sz:3,gray:180,speed:0.3},{word:'MID',sz:5,gray:100,speed:0.7},{word:'FRONT',sz:7,gray:30,speed:1.5}];
    for(let l of layers){
      fill(l.gray); textSize(l.sz);
      const x=((t*l.speed*20)%70)-15;
      text(l.word,x,25);
    }
  };

  // 87: Fold effect — text folds at wave-driven crease
  FRAMES[87] = (t) => {
    noStroke(); textSize(5); textAlign(LEFT,TOP);
    const foldX=W(t,{wave:'triangle',seed:870,range:[12,38]});
    const word='FOLD';
    for(let i=0;i<4;i++){
      const cx=8+i*9;
      if(cx+4<foldX){fill(40);text(word[i],cx,22);}
      else{fill(140);text(word[i],foldX-(cx-foldX)-4,22);}
    }
    stroke(120);strokeWeight(0.5);line(foldX,5,foldX,45);
  };

  // 88: Anamorphic — wave stretches letter
  FRAMES[88] = (t) => {
    noStroke(); textSize(16); textAlign(CENTER,CENTER);
    push(); translate(25,25);
    const sx=W(t,{wave:'sine',seed:880,range:[0.4,2]});
    const sy=W(t,{wave:'sine',seed:881,range:[0.4,2],phase:HALF_PI});
    scale(sx,sy); fill(30);
    text('W',0,0); pop();
  };

  // 89: Vanishing point — text converges to center
  FRAMES[89] = (t) => {
    noStroke(); textAlign(CENTER,CENTER);
    for(let i=0;i<5;i++){
      const depth=i/4;
      const sz=12-i*2;
      const gray=map(depth,0,1,30,180);
      fill(gray); textSize(sz);
      const spread=W(t,{wave:'sine',seed:890,range:[0.5,1.5]});
      text('A',25,10+i*8*spread);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 9 — EXTREMES: Pushing Oswald + waves
  // ═══════════════════════════════════════════════════════

  // 90: All 34 waves — each picks a letter
  FRAMES[90] = (t) => {
    noStroke(); textSize(3); textAlign(LEFT,TOP);
    const all=['classic sine','sine','sharp peaks','square','pulse','stepped sine',
      'mountain peaks','valleys','zig-zag sine','batman','offset sine','steps down','steps',
      'squared sine','bumpy sine','wobble sine','up down noise','meta sine','triangle','ramp',
      'saw down','saw up','fade out','grow random','noise','fuzzy pulse','up down pulse',
      'bald patch','fuzzy peak sine','ramp up sine','triangle sine','round linked sine',
      'half sine','smooth solid sine'];
    for(let i=0;i<34;i++){
      const x=(i%6)*8+2;
      const y=floor(i/6)*7+2;
      fill(G(t,{wave:all[i],seed:900+i,range:[20,180]}));
      text(String.fromCharCode(65+floor(W(t,{wave:all[i],seed:930+i,range:[0,25.99]}))),x,y);
    }
  };

  // 91: Clock — Oswald time display
  FRAMES[91] = (t) => {
    fill(30); noStroke(); textAlign(CENTER,CENTER);
    const s=floor(t)%60, m=floor(t/60)%60;
    textSize(10); text(nf(m,2)+':'+nf(s,2),25,20);
    // Tick wave
    textSize(4);
    const tick=floor(W(t,{wave:'steps',seed:910,range:[0,5.99]}));
    const dots=['.','.','.','.','.'];dots[tick]='|';
    text(dots.join(' '),25,38);
  };

  // 92: Seismograph letters — wave shakes a word
  FRAMES[92] = (t) => {
    const buf=STATE[92].buf;
    const ch=String.fromCharCode(65+floor(W(t*2,{wave:'noise',seed:920,range:[0,25.99]})));
    buf.unshift(ch);if(buf.length>12)buf.pop();
    noStroke(); textSize(4); textAlign(CENTER,CENTER);
    for(let i=0;i<buf.length;i++){
      const y=25+W(i*0.3+t,{wave:'sharp peaks',seed:921,range:[-10,10]});
      fill(map(i,0,buf.length,30,180));
      text(buf[i],4+i*4,y);
    }
  };

  // 93: Feedback word — output picks next character
  FRAMES[93] = (t) => {
    noStroke(); textSize(5); textAlign(LEFT,CENTER);
    let val=0, word='';
    for(let i=0;i<8;i++){
      val=W(i*0.15+val*0.3,{wave:'noise',t:t,seed:930,range:[0,25.99]});
      word+=String.fromCharCode(65+floor(val));
    }
    fill(40); text(word,3,25);
  };

  // 94: Alphabet sine — A-Z on a wave
  FRAMES[94] = (t) => {
    noStroke(); textSize(4); textAlign(CENTER,CENTER);
    for(let i=0;i<26;i++){
      const x=i*1.9+1;
      const y=25+W(i*0.12,{wave:'sine',t:t,seed:940,range:[-14,14]});
      if(x<50){
        fill(G(i,{seed:941,t:t,range:[20,150]}));
        text(String.fromCharCode(65+i),x,y);
      }
    }
  };

  // 95: Type explosion — letters radiate outward
  FRAMES[95] = (t) => {
    noStroke(); textSize(5); textAlign(CENTER,CENTER);
    for(let i=0;i<12;i++){
      const a=i*TWO_PI/12;
      const r=W(t+i*0.3,{wave:'ramp',seed:950+i,range:[0,25]});
      if(r<23){
        fill(G(i,{seed:962,t:t,range:[20,150]}));
        text(String.fromCharCode(65+i),25+cos(a)*r,25+sin(a)*r);
      }
    }
  };

  // 96: Frequency modulation text — wave controls letter spacing rhythmically
  FRAMES[96] = (t) => {
    noStroke(); textSize(6); textAlign(CENTER,CENTER);
    const word='OSWALD';
    const modulator=W(t,{wave:'sine',seed:960,range:[4,12]});
    for(let i=0;i<6;i++){
      fill(G(i,{seed:961,t:t,range:[20,120]}));
      text(word[i],25+(i-2.5)*modulator,25);
    }
  };

  // 97: Infinite scroll — wave generates endless text
  FRAMES[97] = (t) => {
    fill(60); noStroke(); textSize(3); textAlign(LEFT,TOP);
    const scroll=(t*12)%200;
    for(let y=-5;y<55;y+=4){
      let line='';
      for(let c=0;c<14;c++){
        const idx=floor(W((y+scroll)*0.02+c*0.1,{wave:'noise',seed:970,t:0,range:[0,25.99]}));
        line+=String.fromCharCode(65+idx);
      }
      text(line,1,y);
    }
  };

  // 98: Meta — word 'WAVE' built from wave-chosen tiny letters
  FRAMES[98] = (t) => {
    noStroke(); textSize(2); textAlign(CENTER,CENTER);
    const shape=[
      '1...1','1...1','1.1.1','1.1.1','11.11','.1.1.'
    ];
    for(let r=0;r<shape.length;r++)for(let c=0;c<shape[r].length;c++){
      if(shape[r][c]==='1'){
        const ch=String.fromCharCode(65+floor(W(r*5+c,{seed:980,t:t,wave:'noise',range:[0,25.99]})));
        fill(G(r*5+c,{seed:981,t:t,range:[20,120]}));
        text(ch,12+c*5,10+r*5);
      }
    }
  };

  // 99: Grand finale — all 34 wave types each driving a letter, all in Oswald
  FRAMES[99] = (t) => {
    const all=['classic sine','sine','sharp peaks','square','pulse','stepped sine',
      'mountain peaks','valleys','zig-zag sine','batman','offset sine','steps down','steps',
      'squared sine','bumpy sine','wobble sine','up down noise','meta sine','triangle','ramp',
      'saw down','saw up','fade out','grow random','noise','fuzzy pulse','up down pulse',
      'bald patch','fuzzy peak sine','ramp up sine','triangle sine','round linked sine',
      'half sine','smooth solid sine'];
    noStroke(); textAlign(CENTER,CENTER);
    for(let i=0;i<34;i++){
      const x=W(t,{wave:all[i],seed:990+i,range:[4,46]});
      const y=W(t,{wave:all[i],seed:1024+i,range:[4,46]});
      const sz=W(i*0.2,{wave:all[i],t:t,seed:1058+i,range:[3,10]});
      fill(G(i,{wave:all[i],t:t,seed:1092+i,range:[20,180]}));
      textSize(sz);
      text(String.fromCharCode(65+i%26),x,y);
    }
  };
}
