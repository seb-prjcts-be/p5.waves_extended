// p5-grid v05 — B&W Typography × p5.waves
// RULE: only #000 and #fff. No grays. No alpha. No color.
// RULE: every frame uses p5.waves + typography as subject.

const FRAMES = [];
const STATE = {};
const COLS = 10, ROWS = 10, SZ = 50;
const GRID_W = COLS * SZ, GRID_H = ROWS * SZ;
const BK = 0, WH = 255; // the only two values allowed

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  initState();
  registerFrames();
}
function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function draw() {
  background(BK);
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
// Binary threshold helper — wave > 0.5 = white, else black
function BW(c, o) { return W(c, o) > 0.5 ? WH : BK; }

function initState() {
  STATE[50] = Array.from({length:12},()=>({x:random(5,45),y:random(5,45),ch:String.fromCharCode(65+floor(random(26))),vx:random(-1,1),vy:random(-1,1)}));
  STATE[55] = {trail:[],idx:0};
  STATE[60] = {g:new Uint8Array(625),n:new Uint8Array(625),age:0};
  for(let i=0;i<625;i++) STATE[60].g[i]=random()<0.35?1:0;
  STATE[92] = {buf:[]};
}

function registerFrames() {

  // ═══════════════════════════════════════════════════════
  // ROW 0 — RAW: Waveforms drawn with characters
  // ═══════════════════════════════════════════════════════

  // 0: Classic sine spelled out in 'A's
  FRAMES[0] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let x=0;x<50;x+=4){
      const y=W(x*0.08,{wave:'classic sine',t:t,seed:0,range:[6,44]});
      text('A',x,y);
    }
  };

  // 1: Triangle wave — dots replaced with 'W'
  FRAMES[1] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let x=0;x<50;x+=4)
      text('W',x,W(x*0.08,{wave:'triangle',t:t,seed:10,range:[6,44]}));
  };

  // 2: Square wave — 'H' and 'L' for high/low
  FRAMES[2] = (t) => {
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let x=0;x<50;x+=4){
      const v=W(x*0.08,{wave:'square',t:t,seed:20,range:[0,1]});
      text(v>0.5?'H':'L', x, v>0.5?15:35);
    }
  };

  // 3: Batman wave — character size = wave value
  FRAMES[3] = (t) => {
    fill(WH); noStroke(); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let x=0;x<50;x+=5){
      const sz=W(x*0.08,{wave:'batman',t:t,seed:30,range:[3,14]});
      textSize(sz); text('B',x+2,25);
    }
  };

  // 4: Noise wave — random letters along path
  FRAMES[4] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let x=0;x<50;x+=4){
      const y=W(x*0.08,{wave:'noise',t:t,seed:40,range:[6,44]});
      const ch=String.fromCharCode(65+floor(W(x*0.1,{seed:41,t:t,range:[0,25.99]})));
      text(ch,x,y);
    }
  };

  // 5: Stepped sine — characters snap to grid positions
  FRAMES[5] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let x=0;x<50;x+=5){
      const y=W(x*0.08,{wave:'stepped sine',t:t,seed:50,range:[5,45]});
      text('T',x+2,floor(y/10)*10+5);
    }
  };

  // 6: Sharp peaks — exclamation marks at peaks
  FRAMES[6] = (t) => {
    fill(WH); noStroke(); textSize(6); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let x=0;x<50;x+=3){
      const y=W(x*0.08,{wave:'sharp peaks',t:t,seed:60,range:[5,45]});
      text('!',x,y);
    }
  };

  // 7: Mountain peaks — 'M' walks along mountain
  FRAMES[7] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let x=0;x<50;x+=5){
      const y=W(x*0.08,{wave:'mountain peaks',t:t,seed:70,range:[5,40]});
      text('M',x+2,y);
    }
  };

  // 8: Valleys wave — letters dip into valleys
  FRAMES[8] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    const word='VALLEY';
    for(let i=0;i<6;i++){
      const x=4+i*8;
      const y=W(x*0.08,{wave:'valleys',t:t,seed:80,range:[8,42]});
      text(word[i],x,y);
    }
  };

  // 9: Meta sine — word 'WAVE' repeats along path
  FRAMES[9] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    const word='WAVE';
    for(let i=0;i<12;i++){
      const x=2+i*4;
      const y=W(x*0.08,{wave:'meta sine',t:t,seed:90,range:[8,42]});
      text(word[i%4],x,y);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 1 — LETTER ANATOMY: Wave drives type structure
  // ═══════════════════════════════════════════════════════

  // 10: Baseline shift — wave moves baseline up/down
  FRAMES[10] = (t) => {
    fill(WH); noStroke(); textSize(8); textFont('serif'); textAlign(LEFT,BASELINE);
    const word='Type';
    for(let i=0;i<4;i++){
      const bl=30+W(i*0.5,{wave:'wobble sine',t:t,seed:100,range:[-8,8]});
      text(word[i],5+i*11,bl);
    }
    // Baseline reference
    stroke(WH); strokeWeight(0.5); line(3,30,47,30);
  };

  // 11: X-height pulse — wave scales lowercase vs uppercase
  FRAMES[11] = (t) => {
    fill(WH); noStroke(); textFont('serif'); textAlign(CENTER,CENTER);
    const sz=W(t,{wave:'bumpy sine',seed:110,range:[6,18]});
    textSize(sz); text('x',15,25);
    textSize(sz*1.5); text('X',35,25);
  };

  // 12: Serif growth — rectangles at stroke ends grow via wave
  FRAMES[12] = (t) => {
    fill(WH); noStroke();
    // Stem of letter I
    rect(22,10,6,30);
    // Serifs — size from wave
    const s=W(t,{wave:'pulse',seed:120,range:[2,10]});
    rect(25-s,8,s*2,3);   // top serif
    rect(25-s,39,s*2,3);  // bottom serif
  };

  // 13: Counter breathing — the hole in 'O' expands/contracts
  FRAMES[13] = (t) => {
    fill(WH); noStroke();
    ellipse(25,25,36,36);
    fill(BK);
    const hole=W(t,{wave:'classic sine',seed:130,range:[6,22]});
    ellipse(25,25,hole,hole);
  };

  // 14: Stem weight — wave controls stroke thickness
  FRAMES[14] = (t) => {
    fill(WH); noStroke();
    const w=W(t,{wave:'ramp',seed:140,range:[1,12]});
    // Letter 'l' with variable weight
    rect(25-w/2,8,w,34);
    // Crossbar reference
    const cw=W(t,{wave:'ramp',seed:141,range:[1,8]});
    rect(18,22,14,cw);
  };

  // 15: Ascender/descender — wave stretches 'p' up and down
  FRAMES[15] = (t) => {
    fill(WH); noStroke(); textFont('serif'); textAlign(CENTER,CENTER);
    const asc=W(t,{wave:'triangle',seed:150,range:[8,16]});
    textSize(asc); text('b',18,20);
    const desc=W(t,{wave:'triangle',seed:151,range:[8,16]});
    textSize(desc); text('p',35,32);
  };

  // 16: Bowl shape — wave distorts the round part of 'd'
  FRAMES[16] = (t) => {
    fill(WH); noStroke();
    // Stem
    rect(32,8,4,34);
    // Bowl — ellipse with wave-driven width
    const bw=W(t,{wave:'smooth solid sine',seed:160,range:[14,26]});
    const bh=W(t,{wave:'sine',seed:161,range:[16,24]});
    ellipse(26,25,bw,bh);
    fill(BK); ellipse(26,25,bw-5,bh-5);
  };

  // 17: Terminal flare — wave drives terminal shape at stroke ends
  FRAMES[17] = (t) => {
    stroke(WH); noFill(); strokeWeight(3);
    // Letter 'r' stem
    line(18,12,18,40);
    // Arm with wave-driven terminal
    const curl=W(t,{wave:'fade out',seed:170,range:[0,PI]});
    noFill();
    arc(25,18,14,14,-PI,curl-PI);
    // Terminal ball
    const sz=W(t,{wave:'half sine',seed:171,range:[2,6]});
    noStroke(); fill(WH);
    ellipse(25+7*cos(curl-PI),18+7*sin(curl-PI),sz,sz);
  };

  // 18: Ligature merge — two letters wave-driven closer together
  FRAMES[18] = (t) => {
    fill(WH); noStroke(); textSize(14); textFont('serif'); textAlign(CENTER,CENTER);
    const gap=W(t,{wave:'saw down',seed:180,range:[-4,12]});
    text('f',25-gap,25);
    text('i',25+gap,25);
  };

  // 19: Swash extension — wave grows a decorative tail
  FRAMES[19] = (t) => {
    fill(WH); noStroke(); textSize(14); textFont('serif'); textAlign(CENTER,CENTER);
    text('Q',22,22);
    // Extending tail
    stroke(WH); strokeWeight(2); noFill();
    const ext=W(t,{wave:'ramp up sine',seed:190,range:[5,25]});
    beginShape();
    for(let i=0;i<ext;i++){
      const x=28+i;
      const y=32+W(i*0.15,{wave:'sine',t:t,seed:191,range:[-3,3]});
      vertex(x,y);
    }
    endShape();
  };

  // ═══════════════════════════════════════════════════════
  // ROW 2 — KERNING & SPACING: Wave controls whitespace
  // ═══════════════════════════════════════════════════════

  // 20: Expanding word — wave pushes letters apart
  FRAMES[20] = (t) => {
    fill(WH); noStroke(); textSize(7); textFont('monospace'); textAlign(CENTER,CENTER);
    const word='KERN';
    const sp=W(t,{wave:'classic sine',seed:200,range:[6,12]});
    for(let i=0;i<4;i++) text(word[i],25+(i-1.5)*sp,25);
  };

  // 21: Line height — wave controls leading between lines
  FRAMES[21] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(LEFT,TOP);
    const leading=W(t,{wave:'triangle',seed:210,range:[6,14]});
    text('Line',3,5);
    text('height',3,5+leading);
    text('test',3,5+leading*2);
  };

  // 22: Justified text — wave stretches word spacing
  FRAMES[22] = (t) => {
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(LEFT,CENTER);
    const words=['THE','QUICK','FOX'];
    const totalW=W(t,{wave:'bumpy sine',seed:220,range:[30,48]});
    const gap=(totalW-18)/2;
    let x=1;
    for(let i=0;i<3;i++){
      text(words[i],x,25);
      x+=words[i].length*3+gap;
    }
  };

  // 23: Tracking — uniform letter-spacing wave
  FRAMES[23] = (t) => {
    fill(WH); noStroke(); textSize(8); textFont('serif'); textAlign(CENTER,CENTER);
    const word='AV';
    const track=W(t,{wave:'saw up',seed:230,range:[-2,15]});
    text('A',25-track/2,25);
    text('V',25+track/2,25);
  };

  // 24: Indentation wave — first-line indent oscillates
  FRAMES[24] = (t) => {
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(LEFT,TOP);
    for(let i=0;i<6;i++){
      const indent=i===0?W(t,{wave:'sine',seed:240,range:[0,20]}):0;
      const line=i===0?'Once upon':i===1?'a time in':i===2?'a land of':i===3?'black and':i===4?'white and':i===5?'waves...':'';
      text(line,2+indent,3+i*8);
    }
  };

  // 25: Vertical text — wave controls column spacing
  FRAMES[25] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    const cols=['T','Y','P','E'];
    const sp=W(t,{wave:'stepped sine',seed:250,range:[8,12]});
    for(let i=0;i<4;i++){
      for(let j=0;j<4;j++){
        text(cols[j],8+i*sp,8+j*10);
      }
    }
  };

  // 26: Text river — wave creates ugly gaps in justified text
  FRAMES[26] = (t) => {
    fill(WH); noStroke(); textSize(3); textFont('monospace');
    for(let row=0;row<10;row++){
      let x=1;
      for(let w=0;w<5;w++){
        const gap=W((row*5+w)*0.1,{wave:'noise',t:t,seed:260,range:[1,5]});
        const ch=String.fromCharCode(65+floor(W(row*5+w,{seed:261,t:t,range:[0,25.99]})));
        text(ch+ch,x,4+row*5);
        x+=6+gap;
      }
    }
  };

  // 27: Ragged right — wave creates rag edge
  FRAMES[27] = (t) => {
    fill(WH); noStroke(); textSize(3); textFont('monospace'); textAlign(LEFT,TOP);
    for(let i=0;i<10;i++){
      const len=floor(W(i*0.3,{wave:'noise',t:t,seed:270,range:[4,14]}));
      let line='';
      for(let j=0;j<len;j++) line+=String.fromCharCode(65+((i*7+j*3)%26));
      text(line,2,3+i*5);
    }
  };

  // 28: Paragraph shape — wave carves the text block outline
  FRAMES[28] = (t) => {
    fill(WH); noStroke(); textSize(2); textFont('monospace');
    for(let y=0;y<50;y+=3){
      const left=W(y*0.06,{wave:'sine',t:t,seed:280,range:[2,15]});
      const right=W(y*0.06,{wave:'sine',t:t,seed:281,range:[35,48]});
      for(let x=left;x<right;x+=3) text('x',x,y);
    }
  };

  // 29: Margin shift — wave moves entire text block left/right
  FRAMES[29] = (t) => {
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(LEFT,TOP);
    const mx=W(t,{wave:'wobble sine',seed:290,range:[1,20]});
    const lines=['BLACK','AND','WHITE','ONLY'];
    for(let i=0;i<4;i++) text(lines[i],mx,5+i*10);
  };

  // ═══════════════════════════════════════════════════════
  // ROW 3 — MOTION TYPE: Wave choreographs letters
  // ═══════════════════════════════════════════════════════

  // 30: Bouncing letters — each letter on its own wave
  FRAMES[30] = (t) => {
    fill(WH); noStroke(); textSize(8); textFont('monospace'); textAlign(CENTER,CENTER);
    const word='BOUNCE';
    for(let i=0;i<6;i++){
      const y=25+W(t+i*0.3,{wave:'sharp peaks',seed:300+i,range:[-12,12]});
      text(word[i],5+i*8,y);
    }
  };

  // 31: Spinning character — single letter rotates
  FRAMES[31] = (t) => {
    fill(WH); noStroke(); textSize(22); textFont('serif'); textAlign(CENTER,CENTER);
    push(); translate(25,25);
    rotate(W(t,{wave:'saw up',seed:310,range:[0,TWO_PI]}));
    text('R',0,0);
    pop();
  };

  // 32: Typewriter — characters appear one by one
  FRAMES[32] = (t) => {
    fill(WH); noStroke(); textSize(6); textFont('monospace'); textAlign(LEFT,TOP);
    const msg='THE WAVES';
    const idx=floor(W(t*1.5,{wave:'ramp',seed:320,range:[0,msg.length+0.99]}));
    text(msg.substring(0,idx),3,20);
    // Cursor blink
    if(W(t*2,{wave:'square',seed:321,range:[0,1]})>0.5){
      const cx=3+min(idx,msg.length)*4;
      rect(cx,20,2,7);
    }
  };

  // 33: Letter wave — word undulates as a wave
  FRAMES[33] = (t) => {
    fill(WH); noStroke(); textSize(7); textFont('monospace'); textAlign(CENTER,CENTER);
    const word='RIPPLE';
    for(let i=0;i<6;i++){
      const y=25+W(i*0.4,{wave:'sine',t:t*2,seed:330,range:[-10,10]});
      text(word[i],6+i*7,y);
    }
  };

  // 34: Scale pulse — letter grows and shrinks
  FRAMES[34] = (t) => {
    fill(WH); noStroke(); textFont('serif'); textAlign(CENTER,CENTER);
    const sz=W(t,{wave:'half sine',seed:340,range:[5,35]});
    textSize(sz);
    text('O',25,25);
  };

  // 35: Shaking text — wave drives displacement
  FRAMES[35] = (t) => {
    fill(WH); noStroke(); textSize(7); textFont('monospace'); textAlign(CENTER,CENTER);
    const word='SHAKE';
    const intensity=W(t,{wave:'up down noise',seed:350,range:[0,4]});
    for(let i=0;i<5;i++){
      const dx=W(t*5+i,{seed:351+i,wave:'noise',range:[-1,1]})*intensity;
      const dy=W(t*5+i+10,{seed:356+i,wave:'noise',range:[-1,1]})*intensity;
      text(word[i],7+i*9+dx,25+dy);
    }
  };

  // 36: Falling letters — gravity controlled by wave
  FRAMES[36] = (t) => {
    fill(WH); noStroke(); textSize(6); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let i=0;i<8;i++){
      const ch=String.fromCharCode(65+i);
      const speed=0.5+i*0.3;
      const y=((t*speed*15+i*20)%60)-5;
      const x=W(i,{seed:360+i,t:0,wave:'noise',range:[5,45]});
      text(ch,x,y);
    }
  };

  // 37: Orbit text — letters orbit center
  FRAMES[37] = (t) => {
    fill(WH); noStroke(); textSize(6); textFont('monospace'); textAlign(CENTER,CENTER);
    const word='ORBIT';
    for(let i=0;i<5;i++){
      const a=i*TWO_PI/5+W(t,{wave:'saw up',seed:370,range:[0,TWO_PI]});
      const r=W(i*0.5,{wave:'bumpy sine',t:t,seed:371,range:[10,20]});
      text(word[i],25+cos(a)*r,25+sin(a)*r);
    }
  };

  // 38: Flip book — wave selects which letter to show
  FRAMES[38] = (t) => {
    fill(WH); noStroke(); textSize(30); textFont('serif'); textAlign(CENTER,CENTER);
    const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const idx=floor(W(t*2,{wave:'noise',seed:380,range:[0,25.99]}));
    text(chars[idx],25,27);
  };

  // 39: Pendulum word — text swings from top
  FRAMES[39] = (t) => {
    fill(WH); noStroke(); textSize(6); textFont('serif'); textAlign(CENTER,TOP);
    const angle=W(t,{wave:'triangle',seed:390,range:[-PI/4,PI/4]});
    push(); translate(25,3); rotate(angle);
    stroke(WH); strokeWeight(0.5); line(0,0,0,20);
    noStroke();
    text('WAVE',0,22);
    pop();
  };

  // ═══════════════════════════════════════════════════════
  // ROW 4 — TYPE PATTERNS: Letters as tiles
  // ═══════════════════════════════════════════════════════

  // 40: Letter grid — wave picks character per cell
  FRAMES[40] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let r=0;r<10;r++)for(let c=0;c<10;c++){
      const idx=floor(W((r*10+c)*0.05,{wave:'noise',t:t,seed:400,range:[0,25.99]}));
      text(String.fromCharCode(65+idx),c*5+2.5,r*5+2.5);
    }
  };

  // 41: Checkerboard text — alternating black-on-white / white-on-black
  FRAMES[41] = (t) => {
    noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    const flip=W(t,{wave:'square',seed:410,range:[0,1]})>0.5?1:0;
    for(let r=0;r<5;r++)for(let c=0;c<5;c++){
      const isWhite=((r+c+flip)%2===0);
      fill(isWhite?WH:BK); rect(c*10,r*10,10,10);
      fill(isWhite?BK:WH);
      const ch=String.fromCharCode(65+((r*5+c)%26));
      text(ch,c*10+5,r*10+5);
    }
  };

  // 42: Diagonal text — letters along wave-bent diagonals
  FRAMES[42] = (t) => {
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let i=0;i<10;i++){
      const bend=W(i*0.3,{wave:'sine',t:t,seed:420,range:[-5,5]});
      for(let j=0;j<10;j++){
        if((i+j)%3===0) text('/',i*5+2.5+bend,j*5+2.5);
      }
    }
  };

  // 43: Hex character tiles — wave rotates each letter
  FRAMES[43] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let r=0;r<7;r++)for(let c=0;c<6;c++){
      const x=c*8+(r%2)*4+2,y=r*7+3;
      push(); translate(x,y);
      rotate(W((r*6+c)*0.2,{wave:'offset sine',t:t,seed:430,range:[0,TWO_PI]}));
      text('G',0,0);
      pop();
    }
  };

  // 44: Binary matrix — wave controls 0/1 pattern
  FRAMES[44] = (t) => {
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let r=0;r<10;r++)for(let c=0;c<10;c++){
      const v=W((r*10+c)*0.05,{wave:'square',t:t*0.5,seed:440,range:[0,1]});
      text(v>0.5?'1':'0',c*5+2.5,r*5+2.5);
    }
  };

  // 45: Letter cascade — staggered columns of characters
  FRAMES[45] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let c=0;c<10;c++){
      const speed=W(c*0.3,{wave:'ramp',seed:450,t:0,range:[0.5,2]});
      for(let r=0;r<10;r++){
        const y=((r*5+t*speed*20+c*7)%60)-5;
        const ch=String.fromCharCode(33+((r*7+c*3)%90));
        text(ch,c*5+2.5,y);
      }
    }
  };

  // 46: Truchet type — letter orientation as tile
  FRAMES[46] = (t) => {
    fill(WH); noStroke(); textSize(8); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let r=0;r<5;r++)for(let c=0;c<5;c++){
      push(); translate(c*10+5,r*10+5);
      const rot=floor(W((r*5+c)*0.2,{wave:'steps',t:t*0.3,seed:460,range:[0,3.99]}))*HALF_PI;
      rotate(rot);
      text('L',0,0);
      pop();
    }
  };

  // 47: Wave of dots and dashes — morse-like
  FRAMES[47] = (t) => {
    fill(WH); noStroke(); textSize(6); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let r=0;r<8;r++){
      for(let c=0;c<8;c++){
        const v=W((r*8+c)*0.1,{wave:'pulse',t:t,seed:470,range:[0,1]});
        text(v>0.5?'-':'.',c*6+3,r*6+3);
      }
    }
  };

  // 48: Sierpinski text — fractal made of characters
  FRAMES[48] = (t) => {
    fill(WH); noStroke(); textSize(2); textFont('monospace'); textAlign(CENTER,CENTER);
    const depth=floor(W(t*0.2,{wave:'steps',seed:480,range:[3,5.99]}));
    for(let y=0;y<32;y++)for(let x=0;x<32;x++){
      let a=x,b=y,show=true;
      while(a>0||b>0){if(a%2===1&&b%2===1){show=false;break;}a=floor(a/2);b=floor(b/2);}
      if(show) text('*',x*1.5+1,y*1.5+1);
    }
  };

  // 49: Word search grid — wave highlights letters
  FRAMES[49] = (t) => {
    noStroke(); textSize(4); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){
      const highlight=W((r*8+c)*0.08,{wave:'pulse',t:t*0.5,seed:490,range:[0,1]})>0.7;
      if(highlight){fill(BK);rect(c*6+0.5,r*6+0.5,5.5,5.5);fill(WH);}
      else{fill(WH);}
      const ch=String.fromCharCode(65+((r*11+c*7)%26));
      text(ch,c*6+3,r*6+3.5);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 5 — ORGANIC TYPE: Letters with life
  // ═══════════════════════════════════════════════════════

  // 50: Letter swarm — particles that are characters
  FRAMES[50] = (t) => {
    const ps=STATE[50];
    fill(WH); noStroke(); textSize(6); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let p of ps){
      p.vx+=W(t+ps.indexOf(p),{wave:'noise',seed:500+ps.indexOf(p),range:[-0.2,0.2]});
      p.vy+=W(t+ps.indexOf(p)+10,{wave:'noise',seed:506+ps.indexOf(p),range:[-0.2,0.2]});
      const sp=sqrt(p.vx*p.vx+p.vy*p.vy);if(sp>1.5){p.vx/=sp*0.7;p.vy/=sp*0.7;}
      p.x+=p.vx;p.y+=p.vy;p.x=(p.x+50)%50;p.y=(p.y+50)%50;
      text(p.ch,p.x,p.y);
    }
  };

  // 51: Growing word — letters emerge from center, scale up
  FRAMES[51] = (t) => {
    fill(WH); noStroke(); textFont('serif'); textAlign(CENTER,CENTER);
    const word='GROW';
    for(let i=0;i<4;i++){
      const phase=(t*0.5+i*0.25)%1;
      const sz=phase*12+2;
      const spread=phase*15;
      textSize(sz);
      text(word[i],25+(i-1.5)*spread*0.4,25);
    }
  };

  // 52: Breathing paragraph — text block expands and contracts
  FRAMES[52] = (t) => {
    fill(WH); noStroke(); textSize(3); textFont('monospace'); textAlign(CENTER,CENTER);
    const breath=W(t,{wave:'smooth solid sine',seed:520,range:[0.6,1.3]});
    push(); translate(25,25); scale(breath);
    const lines=['Black','and','white','type','waves'];
    for(let i=0;i<5;i++) text(lines[i],0,(i-2)*7);
    pop();
  };

  // 53: Letter DNA — two helical strands of characters
  FRAMES[53] = (t) => {
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let y=0;y<50;y+=3){
      const x1=25+W(y*0.1,{wave:'sine',t:t,seed:530,range:[-14,14]});
      const x2=25+W(y*0.1,{wave:'sine',t:t,seed:530,range:[-14,14],phase:PI});
      const c1=String.fromCharCode(65+(floor(y/3)%26));
      const c2=String.fromCharCode(90-(floor(y/3)%26));
      text(c1,x1,y);
      text(c2,x2,y);
    }
  };

  // 54: Decaying text — wave erodes letters over time
  FRAMES[54] = (t) => {
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(CENTER,CENTER);
    const word='ENTROPY';
    for(let i=0;i<7;i++){
      const visible=W(i*0.4,{wave:'fade out',t:t*0.5,seed:540,range:[0,1]})>0.3;
      if(visible) text(word[i],5+i*6,25);
    }
  };

  // 55: Morphing letter trail — letter changes along path
  FRAMES[55] = (t) => {
    const s=STATE[55];
    s.idx++;
    const ch=String.fromCharCode(65+floor(W(s.idx*0.1,{wave:'noise',t:t,seed:550,range:[0,25.99]})));
    const x=W(t,{wave:'wobble sine',seed:551,range:[5,45]});
    const y=W(t,{wave:'meta sine',seed:552,range:[5,45]});
    s.trail.unshift({x,y,ch});if(s.trail.length>15)s.trail.pop();
    noStroke(); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let i=0;i<s.trail.length;i++){
      const visible=i<s.trail.length-2;
      if(visible){fill(WH);textSize(map(i,0,s.trail.length,7,2));
      text(s.trail[i].ch,s.trail[i].x,s.trail[i].y);}
    }
  };

  // 56: Root growth — letters branch downward
  FRAMES[56] = (t) => {
    fill(WH); noStroke(); textSize(3); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let branch=0;branch<3;branch++){
      let x=12+branch*13, y=5;
      for(let i=0;i<12;i++){
        const dir=W(i*0.3+branch,{wave:'zig-zag sine',t:t,seed:560+branch,range:[-2,2]});
        x+=dir; y+=3;
        if(y<50) text(String.fromCharCode(97+((i+branch*4)%26)),constrain(x,2,48),y);
      }
    }
  };

  // 57: Mitosis text — word splits into two
  FRAMES[57] = (t) => {
    fill(WH); noStroke(); textSize(6); textFont('monospace'); textAlign(CENTER,CENTER);
    const split=W(t,{wave:'ramp',seed:570,range:[0,15]});
    const word='TYPE';
    for(let i=0;i<4;i++){
      text(word[i],10+i*7,25-split);
      text(word[i],10+i*7,25+split);
    }
  };

  // 58: Spiral text — letters along a spiral
  FRAMES[58] = (t) => {
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(CENTER,CENTER);
    const phrase='BLACKANDWHITE';
    for(let i=0;i<phrase.length;i++){
      const a=i*0.5+W(t,{wave:'saw up',seed:580,range:[0,TWO_PI]});
      const r=4+i*1.5;
      if(r<24) text(phrase[i],25+cos(a)*r,25+sin(a)*r);
    }
  };

  // 59: Heartbeat word — letters pulse with EKG rhythm
  FRAMES[59] = (t) => {
    fill(WH); noStroke(); textFont('serif'); textAlign(CENTER,CENTER);
    const word='PULSE';
    for(let i=0;i<5;i++){
      const beat=W(t*2+i*0.2,{wave:'sharp peaks',seed:590,range:[6,14]});
      textSize(beat);
      text(word[i],6+i*9,25);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 6 — PIXEL TYPE: Bitmap & dot-matrix text
  // ═══════════════════════════════════════════════════════

  // 60: Conway Life — living cells are letters
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
    fill(WH); noStroke(); textSize(2); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let y=0;y<25;y++)for(let x=0;x<25;x++)
      if(s.g[y*25+x]) text('*',x*2+1,y*2+1);
  };

  // 61: Dot matrix display — wave scrolls message
  FRAMES[61] = (t) => {
    fill(WH); noStroke(); textSize(3); textFont('monospace'); textAlign(LEFT,TOP);
    const msg='HELLO WORLD  ';
    const scroll=floor(W(t,{wave:'saw up',seed:610,range:[0,msg.length-0.01]}));
    const shifted=msg.substring(scroll)+msg.substring(0,scroll);
    for(let i=0;i<12;i++) text(shifted[i],i*4+1,22);
  };

  // 62: Barcode — wave controls bar widths
  FRAMES[62] = (t) => {
    fill(WH); noStroke();
    let x=2;
    for(let i=0;i<15&&x<48;i++){
      const w=W(i*0.2,{wave:'steps',t:t,seed:620,range:[1,4]});
      if(i%2===0) rect(x,8,w,34);
      x+=w+1;
    }
  };

  // 63: QR-code-like — wave fills grid cells
  FRAMES[63] = (t) => {
    noStroke();
    for(let r=0;r<10;r++)for(let c=0;c<10;c++){
      const on=W((r*10+c)*0.05,{wave:'square',t:t*0.3,seed:630,range:[0,1]})>0.5;
      fill(on?WH:BK); rect(c*5,r*5,5,5);
    }
  };

  // 64: Scanline text — wave reveals lines one at a time
  FRAMES[64] = (t) => {
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(LEFT,TOP);
    const lines=['SCAN','LINE','TEXT','MODE','WAVE'];
    const active=floor(W(t,{wave:'ramp',seed:640,range:[0,4.99]}));
    for(let i=0;i<=active;i++) text(lines[i],5,5+i*9);
    // Scanline
    const sy=5+active*9+7;
    stroke(WH);strokeWeight(0.5);line(0,sy,50,sy);
  };

  // 65: Glitch text — wave displaces character positions
  FRAMES[65] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    const word='GLITCH';
    for(let i=0;i<6;i++){
      const dx=W(t*3+i,{wave:'up down noise',seed:650+i,range:[-8,8]});
      const visible=W(t*2+i,{seed:656+i,wave:'square',range:[0,1]})>0.2;
      if(visible) text(word[i],6+i*7+dx,25);
    }
  };

  // 66: Pixel font — hand-drawn 5x7 characters via wave selection
  FRAMES[66] = (t) => {
    fill(WH); noStroke();
    // Draw blocky letter using rects — wave picks which letter
    const idx=floor(W(t*0.5,{wave:'noise',seed:660,range:[0,3.99]}));
    const letters=[
      // A
      [1,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1],
      // B
      [1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,1,1,0,0,0,0],
      // W
      [1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,0,1,0,0,0,0],
      // E
      [1,1,1,1,0,0,1,1,0,1,0,0,1,0,0,1,1,1,0,0,0]
    ];
    const L=letters[idx];
    for(let r=0;r<7;r++)for(let c=0;c<3;c++){
      if(r<7&&c<3&&L[r*3+c]) rect(17+c*6,8+r*5,5,4);
    }
  };

  // 67: Wave as font weight — stroke thins and thickens
  FRAMES[67] = (t) => {
    noFill(); strokeWeight(1); textAlign(CENTER,CENTER);
    const w=W(t,{wave:'triangle sine',seed:670,range:[1,6]});
    stroke(WH); strokeWeight(w);
    textSize(20); textFont('serif');
    text('a',25,27);
  };

  // 68: Monospace vs proportional — wave interpolates spacing
  FRAMES[68] = (t) => {
    fill(WH); noStroke(); textSize(6); textFont('serif'); textAlign(LEFT,CENTER);
    const word='Wave';
    const mono=W(t,{wave:'square',seed:680,range:[0,1]})>0.5;
    for(let i=0;i<4;i++){
      const x=mono?5+i*10:5+[0,8,14,20][i];
      text(word[i],x,25);
    }
  };

  // 69: Dither text — characters as halftone dots
  FRAMES[69] = (t) => {
    fill(WH); noStroke(); textSize(3); textFont('monospace'); textAlign(CENTER,CENTER);
    const chars=' .+#@';
    for(let y=0;y<50;y+=3)for(let x=0;x<50;x+=3){
      const v=W((x+y*50)*0.002,{wave:'sine',t:t,seed:690,range:[0,4.99]});
      const d=dist(x,y,25+W(t,{seed:691,range:[-8,8]}),25);
      const idx=constrain(floor(v-d*0.05),0,4);
      if(idx>0) text(chars[idx],x,y);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 7 — COMPOSITION: Multi-wave text layering
  // ═══════════════════════════════════════════════════════

  // 70: Overlapping words — two words cross at different angles
  FRAMES[70] = (t) => {
    fill(WH); noStroke(); textSize(6); textFont('monospace'); textAlign(CENTER,CENTER);
    push(); translate(25,25);
    rotate(W(t,{wave:'sine',seed:700,range:[-0.3,0.3]}));
    text('BLACK',0,-5);
    pop();
    push(); translate(25,25);
    rotate(W(t,{wave:'sine',seed:701,range:[-0.3,0.3]})+HALF_PI);
    text('WHITE',0,0);
    pop();
  };

  // 71: Text interference — two scrolling texts create moiré
  FRAMES[71] = (t) => {
    fill(WH); noStroke(); textSize(3); textFont('monospace'); textAlign(LEFT,TOP);
    for(let y=0;y<50;y+=4){
      const off1=W(y*0.04,{wave:'sine',t:t,seed:710,range:[0,20]});
      const off2=W(y*0.04,{wave:'triangle',t:t*1.1,seed:711,range:[0,20]});
      for(let x=0;x<50;x+=4){
        if(((x+floor(off1))%8)<4 || ((x+floor(off2))%6)<3)
          text('I',x,y);
      }
    }
  };

  // 72: Layered scales — big + medium + small characters
  FRAMES[72] = (t) => {
    fill(WH); noStroke(); textFont('serif'); textAlign(CENTER,CENTER);
    textSize(30);
    const big=String.fromCharCode(65+floor(W(t*0.3,{wave:'steps',seed:720,range:[0,25.99]})));
    text(big,25,25);
    fill(BK);textSize(14);
    const med=String.fromCharCode(65+floor(W(t*0.5,{wave:'steps',seed:721,range:[0,25.99]})));
    text(med,25+W(t,{seed:722,wave:'sine',range:[-8,8]}),25);
    fill(WH);textSize(6);
    const sm=String.fromCharCode(65+floor(W(t*0.8,{wave:'steps',seed:723,range:[0,25.99]})));
    text(sm,25,25+W(t,{seed:724,wave:'sine',range:[-6,6]}));
  };

  // 73: Text rain — columns of characters at different speeds
  FRAMES[73] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let c=0;c<8;c++){
      const speed=W(c*0.3,{wave:'noise',seed:730,t:0,range:[0.5,2]});
      for(let i=0;i<8;i++){
        const y=((i*6+t*speed*20+c*11)%55)-3;
        const ch=String.fromCharCode(33+((i*7+c*13)%90));
        text(ch,c*6+3,y);
      }
    }
  };

  // 74: Concrete poetry — wave shapes text into a circle
  FRAMES[74] = (t) => {
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(CENTER,CENTER);
    const phrase='ROUNDANDROUND';
    for(let i=0;i<phrase.length;i++){
      const a=i*TWO_PI/phrase.length+W(t,{wave:'saw up',seed:740,range:[0,TWO_PI*0.3]});
      const r=W(t,{wave:'sine',seed:741,range:[12,18]});
      text(phrase[i],25+cos(a)*r,25+sin(a)*r);
    }
  };

  // 75: Cross-word — wave picks intersection point
  FRAMES[75] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    const h='WAVE', v='TYPE';
    const cross=floor(W(t*0.3,{wave:'steps',seed:750,range:[0,3.99]}));
    for(let i=0;i<4;i++){
      text(h[i],10+i*9,10+cross*9);
      text(v[i],10+cross*9,10+i*9);
    }
  };

  // 76: Text as texture fill — wave defines shape, characters fill it
  FRAMES[76] = (t) => {
    fill(WH); noStroke(); textSize(3); textFont('monospace'); textAlign(CENTER,CENTER);
    const r=W(t,{wave:'bumpy sine',seed:760,range:[12,22]});
    for(let y=0;y<50;y+=3)for(let x=0;x<50;x+=3){
      if(dist(x,y,25,25)<r) text('#',x,y);
    }
  };

  // 77: Mirrored text — wave controls mirror axis
  FRAMES[77] = (t) => {
    fill(WH); noStroke(); textSize(7); textFont('serif'); textAlign(CENTER,CENTER);
    const word='TYPE';
    // Normal
    for(let i=0;i<4;i++) text(word[i],10+i*8,18);
    // Mirrored — wave flips
    push(); translate(25,W(t,{wave:'sine',seed:770,range:[30,42]}));
    scale(1,-1);
    for(let i=0;i<4;i++) text(word[i],-15+i*8,0);
    pop();
  };

  // 78: Wave-driven redaction — black bars over text
  FRAMES[78] = (t) => {
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(LEFT,TOP);
    text('TOP SECRET',3,10);
    text('CLASSIFIED',3,20);
    text('WAVE DATA',3,30);
    fill(BK);
    for(let i=0;i<3;i++){
      const w=W(i*0.5,{wave:'noise',t:t,seed:780,range:[10,40]});
      const x=W(i*0.3,{seed:781+i,t:t,wave:'sine',range:[2,20]});
      rect(x,9+i*10,w,7);
    }
  };

  // 79: Echo text — multiple copies with wave-driven offset
  FRAMES[79] = (t) => {
    noStroke(); textSize(10); textFont('serif'); textAlign(CENTER,CENTER);
    for(let i=4;i>=0;i--){
      const dx=W(i*0.5,{wave:'sine',t:t,seed:790,range:[-i*3,i*3]});
      const dy=W(i*0.5,{wave:'sine',t:t,seed:791,range:[-i*2,i*2]});
      fill(i===0?WH:BK);
      if(i>0){
        // White outline effect by drawing black copies around
        fill(WH);
      }
      // Only draw outermost and innermost
      if(i===4||i===0){
        fill(i===0?WH:WH);
        text('W',25+dx,25+dy);
      }
    }
    // Simple: just staggered white W's
    fill(WH);
    for(let i=0;i<3;i++){
      const dx=W(i*0.5,{wave:'sine',t:t,seed:790,range:[-4,4]});
      const dy=W(i*0.5+0.2,{wave:'sine',t:t,seed:791,range:[-3,3]});
      textSize(10-i*2);
      text('W',25+dx,25+dy);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 8 — SPATIAL: Type in the third dimension
  // ═══════════════════════════════════════════════════════

  // 80: Perspective text — wave drives vanishing point
  FRAMES[80] = (t) => {
    fill(WH); noStroke(); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let i=0;i<6;i++){
      const depth=i/5;
      const sz=14-i*2;
      const x=25+W(t,{wave:'sine',seed:800,range:[-3,3]})*depth;
      const y=25+W(t,{wave:'sine',seed:801,range:[-3,3]})*depth-(1-depth)*10;
      textSize(sz);
      text('A',x,y);
    }
  };

  // 81: Extrude shadow — wave controls shadow offset
  FRAMES[81] = (t) => {
    noStroke(); textSize(18); textFont('serif'); textAlign(CENTER,CENTER);
    const dx=W(t,{wave:'sine',seed:810,range:[1,4]});
    const dy=W(t,{wave:'sine',seed:811,range:[1,4]});
    // Shadow layers
    for(let i=floor(max(dx,dy));i>=0;i--){
      fill(i===0?WH:BK);
      text('B',25+i*(dx/max(dx,dy)),25+i*(dy/max(dx,dy)));
    }
    fill(WH); text('B',25,25);
  };

  // 82: Rotating word cube — 4 words on cube faces
  FRAMES[82] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    const angle=W(t,{wave:'saw up',seed:820,range:[0,TWO_PI]});
    const words=['TYPE','FONT','KERN','WAVE'];
    const face=floor((angle/(HALF_PI))%4);
    const sub=angle%(HALF_PI);
    const squeeze=cos(sub-PI/4);
    push(); translate(25,25);
    textSize(max(1,8*abs(squeeze)));
    text(words[face],0,0);
    pop();
  };

  // 83: Stacked letters — isometric letter pile
  FRAMES[83] = (t) => {
    fill(WH); noStroke(); textSize(6); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let i=0;i<6;i++){
      const h=W(i*0.4,{wave:'mountain peaks',t:t,seed:830,range:[0,4]});
      for(let layer=0;layer<=floor(h);layer++){
        const x=10+i*6-layer;
        const y=40-i*3-layer*4;
        text(String.fromCharCode(65+i),x,y);
      }
    }
  };

  // 84: Tunnel text — words shrink toward center
  FRAMES[84] = (t) => {
    fill(WH); noStroke(); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let i=0;i<6;i++){
      const phase=((t*0.3+i*0.167)%1);
      const sz=phase*14+1;
      textSize(sz);
      const r=W(i*0.5,{wave:'sine',t:t,seed:840,range:[0,TWO_PI]});
      text('O',25,25);
    }
  };

  // 85: Shadow play — letter + long shadow
  FRAMES[85] = (t) => {
    fill(WH); noStroke(); textSize(16); textFont('serif'); textAlign(CENTER,CENTER);
    const shadowLen=floor(W(t,{wave:'sine',seed:850,range:[2,8]}));
    const angle=W(t*0.3,{wave:'ramp',seed:851,range:[0,TWO_PI]});
    for(let i=shadowLen;i>=0;i--){
      text('K',25+cos(angle)*i,25+sin(angle)*i);
    }
  };

  // 86: Parallax text layers — 3 words at different depths
  FRAMES[86] = (t) => {
    fill(WH); noStroke(); textFont('monospace'); textAlign(CENTER,CENTER);
    const words=[['FAR',3],['MID',6],['NEAR',9]];
    for(let [w,sz] of words){
      textSize(sz);
      const speed=sz*0.3;
      const x=25+W(t,{wave:'sine',seed:860+sz,range:[-8*speed/3,8*speed/3]});
      text(w,x,25);
    }
  };

  // 87: Folding text — wave creates a page fold effect
  FRAMES[87] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(LEFT,TOP);
    const foldX=W(t,{wave:'triangle',seed:870,range:[10,40]});
    const lines=['FOLD','THIS','PAGE','HERE'];
    for(let i=0;i<4;i++){
      for(let j=0;j<4;j++){
        const cx=5+j*8;
        if(cx<foldX) text(lines[i][j],cx,10+i*9);
        else{
          const dist=cx-foldX;
          text(lines[i][j],foldX-dist,10+i*9);
        }
      }
    }
    stroke(WH);strokeWeight(0.5);line(foldX,0,foldX,50);
  };

  // 88: Anamorphic stretch — wave distorts letter height
  FRAMES[88] = (t) => {
    fill(WH); noStroke(); textFont('serif'); textAlign(CENTER,CENTER);
    push(); translate(25,25);
    const sx=W(t,{wave:'sine',seed:880,range:[0.5,2]});
    const sy=W(t,{wave:'sine',seed:881,range:[0.5,2],phase:PI/2});
    scale(sx,sy);
    textSize(16);
    text('W',0,0);
    pop();
  };

  // 89: Depth of field — wave controls which layer is sharp
  FRAMES[89] = (t) => {
    fill(WH); noStroke(); textFont('serif'); textAlign(CENTER,CENTER);
    const focus=floor(W(t*0.5,{wave:'steps',seed:890,range:[0,2.99]}));
    const layers=['A','B','C'];
    const sizes=[14,10,6];
    const ys=[18,28,38];
    for(let i=0;i<3;i++){
      textSize(sizes[i]);
      if(i===focus) text(layers[i],25,ys[i]);
      else {
        // "Blur" = offset duplicates
        text(layers[i],24,ys[i]);
        text(layers[i],26,ys[i]);
      }
    }
  };

  // ═══════════════════════════════════════════════════════
  // ROW 9 — EXTREMES: Type + waves pushed to the limit
  // ═══════════════════════════════════════════════════════

  // 90: All 34 wave types as 1-char labels
  FRAMES[90] = (t) => {
    fill(WH); noStroke(); textSize(3); textFont('monospace'); textAlign(LEFT,TOP);
    const names='CSTBNSMMVMOSSSBBWMTRSDSFGNFUBFRTRHSS'.split('');
    const scroll=(t*5)%85;
    for(let i=0;i<34;i++){
      const y=i*2.5-scroll;if(y<-3||y>50)continue;
      const x=W(i*0.1,{wave:'noise',t:t,seed:900+i,range:[2,40]});
      text(names[i]||'.',x,y);
    }
  };

  // 91: Typography clock — wave-smooth second hand
  FRAMES[91] = (t) => {
    fill(WH); noStroke(); textFont('monospace'); textAlign(CENTER,CENTER);
    const s=floor(t)%60;
    const m=floor(t/60)%60;
    textSize(8);
    text(nf(m,2)+':'+nf(s,2),25,20);
    // Ticking dots
    textSize(4);
    const tick=W(t,{wave:'steps',seed:910,range:[0,11.99]});
    for(let i=0;i<12;i++){
      const a=i*TWO_PI/12-HALF_PI;
      text(i===floor(tick)?'*':'.',25+cos(a)*16,38+sin(a)*5);
    }
  };

  // 92: Seismograph of letters — wave builds word
  FRAMES[92] = (t) => {
    const buf=STATE[92].buf;
    const ch=String.fromCharCode(65+floor(W(t*2,{wave:'noise',seed:920,range:[0,25.99]})));
    buf.unshift(ch); if(buf.length>50)buf.pop();
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let i=0;i<min(buf.length,12);i++){
      const y=W(i*0.3,{wave:'sharp peaks',t:t,seed:921,range:[15,35]});
      text(buf[i],4+i*4,y);
    }
  };

  // 93: Morse code — wave as dit/dah timing
  FRAMES[93] = (t) => {
    fill(WH); noStroke();
    let x=3;
    for(let i=0;i<12;i++){
      const isDah=W(i*0.3,{wave:'square',t:t,seed:930,range:[0,1]})>0.5;
      const w=isDah?6:2;
      rect(x,22,w,6);
      x+=w+W(i*0.2,{wave:'noise',t:t,seed:931,range:[2,5]});
      if(x>47) break;
    }
  };

  // 94: Alphabet wave — A-Z on a sine curve
  FRAMES[94] = (t) => {
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let i=0;i<26;i++){
      const x=(i*1.9+1);
      const y=25+W(i*0.12,{wave:'sine',t:t,seed:940,range:[-15,15]});
      if(x<50) text(String.fromCharCode(65+i),x,y);
    }
  };

  // 95: Type explosion — letters fly out from center
  FRAMES[95] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(CENTER,CENTER);
    for(let i=0;i<12;i++){
      const a=i*TWO_PI/12;
      const r=W(t+i*0.3,{wave:'ramp',seed:950+i,range:[0,30]});
      const ch=String.fromCharCode(65+i);
      if(r<24) text(ch,25+cos(a)*r,25+sin(a)*r);
    }
  };

  // 96: Wave feedback word — output feeds back into character selection
  FRAMES[96] = (t) => {
    fill(WH); noStroke(); textSize(5); textFont('monospace'); textAlign(LEFT,CENTER);
    let val=0;
    let word='';
    for(let i=0;i<8;i++){
      val=W(i*0.15+val*0.3,{wave:'noise',t:t,seed:960,range:[0,25.99]});
      word+=String.fromCharCode(65+floor(val));
    }
    text(word,3,25);
  };

  // 97: Infinite scroll — wave generates endless text
  FRAMES[97] = (t) => {
    fill(WH); noStroke(); textSize(3); textFont('monospace'); textAlign(LEFT,TOP);
    const scroll=(t*15)%200;
    for(let y=-5;y<55;y+=4){
      let line='';
      for(let c=0;c<14;c++){
        const idx=floor(W((y+scroll)*0.02+c*0.1,{wave:'noise',seed:970,t:0,range:[0,25.99]}));
        line+=String.fromCharCode(65+idx);
      }
      text(line,1,y);
    }
  };

  // 98: Meta frame — the word "WAVE" built from tiny wave symbols
  FRAMES[98] = (t) => {
    fill(WH); noStroke(); textSize(2); textFont('monospace'); textAlign(CENTER,CENTER);
    // W shape from characters
    const shape = [
      '1...1','1...1','1.1.1','1.1.1','11.11','.1.1.',
    ];
    for(let r=0;r<shape.length;r++)for(let c=0;c<shape[r].length;c++){
      if(shape[r][c]==='1'){
        const ch=String.fromCharCode(65+floor(W(r*5+c,{seed:980,t:t,wave:'noise',range:[0,25.99]})));
        text(ch,12+c*5,10+r*5);
      }
    }
  };

  // 99: Grand finale — every wave type selects a character, arranged in a grid
  FRAMES[99] = (t) => {
    fill(WH); noStroke(); textSize(4); textFont('monospace'); textAlign(CENTER,CENTER);
    const all=['classic sine','sine','sharp peaks','square','pulse','stepped sine',
      'mountain peaks','valleys','zig-zag sine','batman','offset sine','steps down','steps',
      'squared sine','bumpy sine','wobble sine','up down noise','meta sine','triangle','ramp',
      'saw down','saw up','fade out','grow random','noise','fuzzy pulse','up down pulse',
      'bald patch','fuzzy peak sine','ramp up sine','triangle sine','round linked sine',
      'half sine','smooth solid sine'];
    for(let i=0;i<34;i++){
      const x=(i%6)*8+5;
      const y=floor(i/6)*8+3;
      const ch=String.fromCharCode(65+floor(W(t,{wave:all[i],seed:990+i,range:[0,25.99]})));
      text(ch,x,y);
    }
  };
}
