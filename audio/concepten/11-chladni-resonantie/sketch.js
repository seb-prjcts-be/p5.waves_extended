/* 11 · Chladni-resonantie — nulpuntlijnen van staande 2D-golven
 *
 * Ernst Chladni (1756-1827) bestrooide trilplaten met zand: op de nodal lines
 * (nulpunten) staat de plaat stil → zand hoopt op. Op plekken met hoge
 * amplitude vliegt het zand weg. De patronen veranderen met de resonantiemode.
 *
 * Wiskundige kern — symmetrische staandegolfformule:
 *   f(x,y) = sX(x·m) · sY(y·n)  +  sX(x·n) · sY(y·m)
 * Nulpunten (|f| < drempel): licht (zand)
 * Hoge amplitude: donker (geen zand)
 *
 * Cruciaal verschil t.o.v. concept 10: PRODUCT (geen som) + threshold.
 * 'classic sine' → authentieke Chladni; andere golven → exotische varianten.
 *
 * Audio-koppeling:
 *   bass   → m  (horizontale modenummer 1–8)
 *   treble → n  (verticale modenummer 1–8)
 *   beat   → snap naar nieuwe (m, n) + volgend golftype
 *   energy → drempeldikte (luid = dikkere lijnen)
 *
 * Render: pixels[] met pixelDensity(1) → cel-gebaseerd (CELL px per cel),
 * snel genoeg voor 60fps op elke schermgrootte.
 */

const WAVE_TYPES = [
  'classic sine',   // authentieke Chladni
  'triangle',       // scherpe kruislijnen
  'mountain peaks', // gedrapeerde knooppunten
  'batman',         // gebroken symmetrie
  'bumpy sine',     // rimpelende nulvlakken
];
let waveIdx = 0;
let sX, sY;

let m = 3, n = 2;     // huidige moden (gehele getallen ≥ 1)
let flashBri = 0;     // witte flits bij mode-wissel (0..255)

let audio, ctl;
const CELL = 4;       // pixels per berekeningscel

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);    // eenvoudige pixels[]-indexering
  noStroke();
  audio = new WaveAudio({ fftSize: 1024 });
  ctl   = createAudioControls(audio);
  buildSamplers();
}

function buildSamplers() {
  const w = WAVE_TYPES[waveIdx];
  sX = Waves.createSampler({ wave: w, range: [-1, 1] });
  sY = Waves.createSampler({ wave: w, range: [-1, 1] });
}

function draw() {
  const on = ctl.started();
  if (on) audio.update();

  const bass   = on ? audio.bands.bass   : 0.28;
  const treble = on ? audio.bands.treble : 0.20;
  const energy = on ? audio.energy       : 0.35;

  // beatBass (kick) → update m + nieuw golftype (structurele modale sprong)
  if (on && audio.beatBass) {
    const newM = max(1, round(map(bass, 0, 1, 1, 9)));
    if (newM !== m) {
      m = newM;
      waveIdx = (waveIdx + 1) % WAVE_TYPES.length;
      buildSamplers();
      flashBri = 255;
    }
  }
  // beatTreble (hi-hat) → update n alleen (subtiele verticale aanpassing)
  if (on && audio.beatTreble) {
    const newN = max(1, round(map(treble, 0, 1, 1, 9)));
    if (newN !== n) {
      n = newN;
      flashBri = max(flashBri, 110);  // zachtere flits dan bass-beat
    }
  }

  // flits vervaagt per frame
  flashBri = max(0, flashBri - 38);

  // achtergrondkleur: donker paars-zwart, witte flits bij mode-wissel
  const frac  = flashBri / 255;
  const bgR   = round(lerp(10,  255, frac));
  const bgG   = round(lerp(8,   255, frac));
  const bgB   = round(lerp(14,  255, frac));

  // drempel: luid = dikkere nodal lines
  const thresh = map(energy, 0, 1, 0.05, 0.24);

  // tSlow: trage fasedrift zodat het patroon levend aanvoelt
  // (echte staande golven bewegen niet, maar dit is mooier)
  const tSlow = millis() / 28000;

  const COLS = floor(width  / CELL);
  const ROWS = floor(height / CELL);

  loadPixels();

  for (let row = 0; row < ROWS; row++) {
    const fy = (row + 0.5) / ROWS;   // genormaliseerd 0..1, midden van cel

    for (let col = 0; col < COLS; col++) {
      const fx = (col + 0.5) / COLS;

      // Symmetrische Chladni:
      //   f = sX(fx·m)·sY(fy·n) + sX(fx·n)·sY(fy·m)
      const vXm = sX.sample(fx * m, tSlow);
      const vYn = sY.sample(fy * n, tSlow);
      const vXn = sX.sample(fx * n, tSlow);
      const vYm = sY.sample(fy * m, tSlow);
      const field = vXm * vYn + vXn * vYm;
      const absF  = abs(field);

      let r, g, b;

      if (absF < thresh) {
        // nodaal (nulpunt) → warm wit — helderste in het hart
        const t01 = pow(1 - absF / thresh, 2);
        r = round(lerp(bgR, 255, t01));
        g = round(lerp(bgG, 238, t01));
        b = round(lerp(bgB, 215, t01));
      } else {
        // hoge-amplitude zone → donker met zwak violet gloed
        const glow = max(0, 1 - (absF - thresh) / 0.55);
        r = round(lerp(bgR, 35, glow * 0.18));
        g = round(lerp(bgG, 15, glow * 0.10));
        b = round(lerp(bgB, 60, glow * 0.22));
      }

      // schrijf CELL×CELL blok naar pixels[]
      for (let py = 0; py < CELL; py++) {
        const base = ((row * CELL + py) * width + col * CELL) << 2;
        for (let px = 0; px < CELL; px++) {
          const idx = base + (px << 2);
          pixels[idx]     = r;
          pixels[idx + 1] = g;
          pixels[idx + 2] = b;
          pixels[idx + 3] = 255;
        }
      }
    }
  }

  updatePixels();

  // ── HUD ────────────────────────────────────────────────────────────────────
  noStroke();
  fill(155);
  textAlign(LEFT, TOP);
  textSize(12);
  text(`mode (${m}, ${n})  —  ${WAVE_TYPES[waveIdx]}`, 16, 16);
  text('bass → m (kick)  ·  treble → n (hi-hat)', 16, 34);

  if (!on) {
    fill(180);
    textAlign(CENTER, CENTER);
    textSize(18);
    text('Start een audiobron linksboven', width / 2, height / 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
