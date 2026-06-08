// ═════════════════════════════════════════════════════════════
// p5.waves extended — HERO
// Zelfde techniek als de p5.waves-library showcase: subtiele grijze
// achtergrond-banden + gekleurde voorgrond-banden, elk een shiftende
// Waves.createSampler. Familie met de library, en gebruikt p5.waves zelf.
// ═════════════════════════════════════════════════════════════
new p5(function (p) {
  var BG = [
    { yPct: 0.60, range: [-45, 45], freq: 0.006, phase: 0,   gray: 225, fillAlpha: 18, seed: 10 },
    { yPct: 0.70, range: [-40, 40], freq: 0.009, phase: 1.4, gray: 205, fillAlpha: 22, seed: 11 },
    { yPct: 0.80, range: [-35, 35], freq: 0.012, phase: 2.8, gray: 180, fillAlpha: 28, seed: 12 },
    { yPct: 0.90, range: [-25, 25], freq: 0.016, phase: 0.6, gray: 150, fillAlpha: 40, seed: 13 }
  ];
  var FG = [
    { yPct: 0.55, range: [-90, 90], freq: 0.007, phase: 0.3, color: '#174cff', alpha: 140, thickness: 80, seed: 20 },
    { yPct: 0.63, range: [-80, 80], freq: 0.010, phase: 1.8, color: '#ff3b2f', alpha: 150, thickness: 80, seed: 21 },
    { yPct: 0.72, range: [-70, 70], freq: 0.013, phase: 3.2, color: '#d7ff22', alpha: 160, thickness: 80, seed: 22 },
    { yPct: 0.80, range: [-65, 65], freq: 0.015, phase: 0.9, color: '#ff4fb3', alpha: 170, thickness: 80, seed: 23 },
    { yPct: 0.88, range: [-55, 55], freq: 0.018, phase: 2.1, color: '#00c7ff', alpha: 180, thickness: 80, seed: 24 }
  ];
  var bgSamplers = [], fgSamplers = [];
  var heroT = 0;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight).parent('hero-canvas');
    p.frameRate(30);
    bgSamplers = [];
    fgSamplers = [];
    for (var i = 0; i < BG.length; i++) {
      var b = BG[i];
      bgSamplers.push(Waves.createSampler({
        shift: true, shiftInterval: 4 + i, shiftDuration: 1.5,
        seed: b.seed, range: b.range, frequency: b.freq, phase: b.phase
      }));
    }
    for (var i = 0; i < FG.length; i++) {
      var f = FG[i];
      fgSamplers.push(Waves.createSampler({
        shift: true, shiftInterval: 3 + i, shiftDuration: 1.2,
        seed: f.seed, range: f.range, frequency: f.freq, phase: f.phase
      }));
    }
  };

  p.draw = function () {
    p.background(245);
    heroT += 0.018;

    for (var i = 0; i < BG.length; i++) {
      var b = BG[i];
      var baseY = p.height * b.yPct;
      p.noStroke();
      p.fill(b.gray, b.fillAlpha);
      p.beginShape();
      p.vertex(0, p.height);
      for (var x = 0; x <= p.width; x += 6) {
        p.vertex(x, baseY + bgSamplers[i].sample(x * 0.4, heroT));
      }
      p.vertex(p.width, p.height);
      p.endShape(p.CLOSE);
    }

    for (var i = 0; i < FG.length; i++) {
      var f = FG[i];
      var baseY = p.height * f.yPct;
      p.noStroke();
      var c = p.color(f.color);
      c.setAlpha(f.alpha);
      p.fill(c);
      p.beginShape();
      for (var x = 0; x <= p.width; x += 3) {
        p.vertex(x, baseY + fgSamplers[i].sample(x * 0.4, heroT));
      }
      for (var x = p.width; x >= 0; x -= 3) {
        p.vertex(x, baseY + f.thickness);
      }
      p.endShape(p.CLOSE);
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}, 'hero-canvas');
