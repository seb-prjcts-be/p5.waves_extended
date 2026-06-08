import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const campaignDir = path.join(root, 'campaign');

const ACCENTS = {
  THRESHOLD: '#ff3b2f',
  SHIFT: '#174cff',
  MORPH: '#ff4fb3',
  'WILD MODE': '#ff8b2b',
  GRID: '#d7ff22',
  RANGE: '#00c7ff',
  SAMPLER: '#174cff',
  TIME: '#ff8b2b',
  OVERRIDE: '#ff3b2f',
  WEBGL: '#d7ff22',
  'WAVE STUDY': '#ff4fb3'
};

const MOTION_CONFIG = {
  THRESHOLD: { scale: 1.9, energy: 0.94, style: 'gate' },
  SHIFT: { scale: 1.72, energy: 0.92, style: 'sweep' },
  MORPH: { scale: 1.68, energy: 0.9, style: 'blend' },
  'WILD MODE': { scale: 1.86, energy: 0.98, style: 'glitch' },
  GRID: { scale: 1.48, energy: 0.76, style: 'grid' },
  RANGE: { scale: 1.56, energy: 0.82, style: 'beam' },
  SAMPLER: { scale: 1.58, energy: 0.78, style: 'specimen' },
  TIME: { scale: 1.34, energy: 0.74, style: 'orbit' },
  OVERRIDE: { scale: 1.64, energy: 0.86, style: 'override' },
  WEBGL: { scale: 1.52, energy: 0.84, style: 'beam' },
  'WAVE STUDY': { scale: 1.46, energy: 0.7, style: 'study' }
};

const MOVE_CONFIG = [
  { key: 'THRESHOLD', family: 'THRESHOLD', score: 24, cta: 'Open threshold poster', pattern: /\bthreshold\b|binary flip|one or zero|swept dial/i },
  { key: 'SHIFT GROUPS', family: 'SHIFT', score: 22, cta: 'Open shifting group card', pattern: /grouped wave|shift on a sampler.*group|group:\s*[a-z]+|wave-family cycling/i },
  { key: 'SHIFT', family: 'SHIFT', score: 21, cta: 'Open shift specimen', pattern: /\bshift\b|dissolves into the next|continuous wave-family cycling/i },
  { key: 'MORPH', family: 'MORPH', score: 21, cta: 'Open morph card', pattern: /\bmorph\b|animated mix|wave:\s*\[\s*[a-z]/i },
  { key: 'WILD MODE', family: 'WILD MODE', score: 19, cta: 'Open wild-mode card', pattern: /wild|unpredictability|controlled instability/i },
  { key: 'GRID AXES', family: 'GRID', score: 19, cta: 'Open grid-axes poster', pattern: /waverow|wavecol|creategrid axis|axis formula/i },
  { key: 'CUSTOM DOMAIN', family: 'RANGE', score: 18, cta: 'Open domain card', pattern: /custom input domain|input domain|domain via map|window opens/i },
  { key: 'INDEX', family: 'SAMPLER', score: 17, cta: 'Open index specimen', pattern: /select by index|wave:\s*i\b|34 named waves|specimen sheet/i },
  { key: 'TICK TIME', family: 'TIME', score: 17, cta: 'Open time specimen', pattern: /tick[\s-]?time|seconds parameter|explicit parameter/i },
  { key: 'FREQUENCY', family: 'SAMPLER', score: 15, cta: 'Open frequency plate', pattern: /frequency parameter|five frequencies|different frequencies|ascending parameter value|frequency study|only\s+`?frequency`?\s+changes|same wave,\s*same t,\s*same amplitude/i },
  { key: 'RANGE', family: 'RANGE', score: 14, cta: 'Open range card', pattern: /range mapping|range mapped|maps? .*range|drives .*rotation|drives .*radius|drives .*spacing/i },
  { key: 'WAVE GROUPS', family: 'SAMPLER', score: 13, cta: 'Open grouped-wave card', pattern: /\bgroup\b|wave family/i },
  { key: 'SAMPLER', family: 'SAMPLER', score: 12, cta: 'Open sampler specimen', pattern: /createsampler/i },
  { key: 'GRID', family: 'GRID', score: 12, cta: 'Open grid poster', pattern: /creategrid/i },
  { key: 'OVERRIDE', family: 'OVERRIDE', score: 16, cta: 'Open override specimen', pattern: /override|custom wave/i },
  { key: 'WEBGL', family: 'WEBGL', score: 15, cta: 'Open WEBGL poster', pattern: /\bWEBGL\b/i },
  { key: 'WAVE STUDY', family: 'WAVE STUDY', score: 9, cta: 'Open wave study', pattern: /wave study|specimen|library card/i }
];

const SHELF_CONFIG = [
  {
    key: 'THRESHOLD',
    title: 'Threshold Posters',
    copy: 'Binary gates, hard flips and clean edge demos that read even as a thumbnail.'
  },
  {
    key: 'SHIFT',
    title: 'Shift Engine',
    copy: 'Wave-family cycling staged as headline motion, not background animation.'
  },
  {
    key: 'MORPH',
    title: 'Morph Engine',
    copy: 'Named wave identities blended as if they were type weights or states of matter.'
  },
  {
    key: 'WILD MODE',
    title: 'Wild Mode',
    copy: 'Controlled instability where a wave keeps its spine and starts misbehaving on purpose.'
  },
  {
    key: 'GRID',
    title: 'Grid Systems',
    copy: 'createGrid promoted as a compositional engine with readable axis logic and cell choreography.'
  },
  {
    key: 'RANGE',
    title: 'Range And Domain',
    copy: 'Input and output remapping turned into layout, density, tilt, radius and other graphic systems.'
  },
  {
    key: 'SAMPLER',
    title: 'Sampler Plates',
    copy: 'Specimens, wave indexes and parameter studies that make the API legible at a glance.'
  },
  {
    key: 'TIME',
    title: 'Time Systems',
    copy: 'Seconds and tick-time treated as explicit choreography instead of invisible drift.'
  },
  {
    key: 'OVERRIDE',
    title: 'Override Paths',
    copy: 'Places where the stock vocabulary gets bent or rewritten and the library becomes an instrument.'
  },
  {
    key: 'WEBGL',
    title: 'Renderer Space',
    copy: 'Spatial or renderer-specific sketches where the p5.waves move survives outside flat poster logic.'
  },
  {
    key: 'WAVE STUDY',
    title: 'Archive Studies',
    copy: 'Residual plates, specimen essays and quieter proofs that still belong in the body of work.'
  }
];

const DEFAULT_ART_BOUNDS = {
  left: 100,
  top: 100,
  right: 980,
  bottom: 980
};

const ART_BOUNDS_OVERRIDES = {
  '20260419_2204_relay': { left: 100, top: 135, right: 980, bottom: 1004 },
  '20260420_1005_ebb': { left: 100, top: 115, right: 1024, bottom: 983 },
  '20260422_2010_range_to_radius': { left: 157, top: 62, right: 1011, bottom: 959 },
  '20260422_2320_five_windows': { left: 70, top: 50, right: 972, bottom: 948 },
  '20260422_2355_seven_stages': { left: 84, top: 130, right: 996, bottom: 966 },
  '20260422_2359_crossfade_window': { left: 100, top: 201, right: 980, bottom: 959 },
  '20260423_0930_row_plus_col': { left: 108, top: 138, right: 948, bottom: 1000 },
  '20260423_1250_five_frequencies': { left: 36, top: 220, right: 1044, bottom: 940 },
  '20260423_1500_a_to_b': { left: 140, top: 172, right: 1018, bottom: 904 },
  '20260423_1730_tame_to_wild': { left: 123, top: 153, right: 983, bottom: 980 },
  '20260423_2030_breathing_threshold': { left: 201, top: 163, right: 905, bottom: 931 },
  '20260423_2315_thirty_four_waves': { left: 40, top: 110, right: 1040, bottom: 1050 }
};

const dirents = await fs.readdir(root, { withFileTypes: true });
const sketchDirs = [];

for (const entry of dirents) {
  if (!entry.isDirectory()) continue;
  if (entry.name.startsWith('.')) continue;
  if (entry.name === 'campaign' || entry.name === 'propts') continue;

  const sketchPath = path.join(root, entry.name, 'sketch.js');
  const indexPath = path.join(root, entry.name, 'index.html');
  try {
    await fs.access(sketchPath);
    await fs.access(indexPath);
    sketchDirs.push(entry.name);
  } catch {
    // ignore incomplete folders
  }
}

const manifest = [];

for (const id of sketchDirs.sort()) {
  const dir = path.join(root, id);
  const sketchSource = await fs.readFile(path.join(dir, 'sketch.js'), 'utf8');
  const indexSource = await fs.readFile(path.join(dir, 'index.html'), 'utf8');

  const meta = buildMeta(id, sketchSource, indexSource);
  manifest.push(meta);
}

manifest.sort((a, b) => (a.id < b.id ? 1 : -1));

await fs.mkdir(campaignDir, { recursive: true });
await fs.writeFile(
  path.join(campaignDir, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8'
);

for (const meta of manifest) {
  const dir = path.join(root, meta.id);
  const page = renderSketchPage(meta);
  await fs.writeFile(path.join(dir, 'index.html'), page, 'utf8');
  await fs.writeFile(path.join(dir, 'style.css'), '@import url("../campaign/base.css");\n', 'utf8');
}

await fs.writeFile(path.join(root, 'index.html'), renderCatalog(manifest), 'utf8');

console.log(`Campaign rebuild complete: ${manifest.length} sketches reframed.`);

function buildMeta(id, sketchSource, indexSource) {
  const codeOnly = stripComments(sketchSource);
  const match = id.match(/^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})_(.+)$/);
  const slug = match ? match[6] : id;
  const displayTitle = slugToDisplay(slug);
  const titleCase = slugToTitleCase(slug);
  const canvasTitle = slugToCanvasTitle(slug);
  const notes = extractHeaderNotes(sketchSource);
  const dateStamp = match ? `${match[1]}-${match[2]}-${match[3]}` : 'undated';
  const timeStamp = match ? `${match[4]}:${match[5]}` : '--:--';
  const mode = extractMode(sketchSource);
  const waveNames = extractWaveNames(codeOnly);
  const groupValue = extractGroup(codeOnly);
  const thresholdValue = extractValue(codeOnly, /(?:^|[,{;\s])threshold\s*:\s*([-+]?[\d.]+)/im);
  const canvas = extractCanvasSize(sketchSource);
  const timingProfile = extractTimingProfile(sketchSource);
  const p5Src = extractScript(indexSource, /<script\s+src="([^"]*p5[^"]*\/p5\.js[^"]*)"/i, 'https://cdn.jsdelivr.net/npm/p5@2.2.2/lib/p5.js');
  const wavesSrc = extractScript(indexSource, /<script\s+src="([^"]*p5\.waves[^"]*\.js[^"]*)"/i, 'https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.waves@v3.1.0/p5.waves.js');
  const wavesVersion = extractWavesVersion(wavesSrc);
  const flags = {
    usesCreateGrid: /createGrid\s*\(/i.test(codeOnly),
    usesCreateSampler: /createSampler\s*\(/i.test(codeOnly),
    usesShift: /(?:^|[,{;\s])shift\s*:\s*true/im.test(codeOnly),
    usesWild: /(?:^|[,{;\s])mode\s*:\s*['"]wild['"]/im.test(codeOnly) || /(?:^|[,{;\s])unpredictability\s*:/im.test(codeOnly),
    usesThreshold: /threshold/i.test(slug) || /(?:^|[,{;\s])threshold\s*:/im.test(codeOnly),
    usesRange: /(?:^|[,{;\s])range\s*:/im.test(codeOnly),
    usesGroup: /(?:^|[,{;\s])group\s*:/im.test(codeOnly),
    usesMorph: /(?:^|[,{;\s])wave\s*:\s*\[/im.test(codeOnly),
    usesWEBGL: /\bWEBGL\b/.test(sketchSource),
    usesRotation: /rotate[XYZ]?\s*\(/.test(codeOnly)
  };

  const move = inferMoveMeta({ notes, flags, codeOnly });
  const primaryMove = move.key;
  const moveFamily = move.family;
  const accent = ACCENTS[moveFamily] || ACCENTS[primaryMove] || '#174cff';
  const accentSoft = hexToRgba(accent, 0.12);
  const accentStrong = hexToRgba(accent, 0.22);
  const settingsLine = buildSettingsLine({ waveNames, groupValue, thresholdValue, canvas, wavesVersion, flags, primaryMove, moveFamily });
  const stageLine = buildStageLine({ waveNames, groupValue, thresholdValue, flags, primaryMove, moveFamily });
  const deck = buildDeck({ titleCase, waveNames, groupValue, flags, primaryMove, moveFamily, notes, mode });
  const curatorLine = buildCuratorLine({ notes, titleCase, primaryMove, moveFamily });
  const promoScore = scorePromo({ notes, flags, primaryMove, moveFamily, mode });
  const promoTier = classifyPromoTier(promoScore);
  const timeScale = inferTimeScale({ timingProfile, moveFamily, primaryMove, promoTier });
  const promoStyle = inferPromoStyle(moveFamily, primaryMove);
  const promoEnergy = inferPromoEnergy({ moveFamily, primaryMove, promoTier, timeScale });
  const kicker = `${mode.label} / ${primaryMove}`;
  const catalogKicker = `p5.waves promo / ${mode.label} / ${primaryMove}`;
  const linkLabel = buildLinkLabel(primaryMove);
  const artBounds = inferArtworkBounds(id);
  const badges = [
    `${dateStamp} ${timeStamp}`,
    `source ${canvas.label}`,
    `native 1080×1080`,
    primaryMove,
    `tempo ×${formatTempoScale(timeScale)}`,
    wavesVersion
  ];

  return {
    id,
    slug,
    url: `${id}/`,
    displayTitle,
    titleCase,
    canvasTitle,
    dateStamp,
    timeStamp,
    mode: mode.label,
    modeCode: mode.code,
    primaryMove,
    moveFamily,
    accent,
    accentSoft,
    accentStrong,
    settingsLine,
    stageLine,
    deck,
    curatorLine,
    kicker,
    catalogKicker,
    linkLabel,
    promoScore,
    promoTier,
    timeScale,
    promoStyle,
    promoEnergy,
    artBounds,
    badges,
    stamp: `${dateStamp} · ${timeStamp} · source ${canvas.label} · native 1080×1080`,
    pageTitle: `${titleCase} — p5.waves promo frame`,
    p5Src,
    wavesSrc,
    wavesVersion,
    sourceCanvas: canvas.label,
    nativeCanvas: '1080×1080'
  };
}

function renderSketchPage(meta) {
  const metaJson = JSON.stringify(meta).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(meta.pageTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body class="campaign-sketch">
  <main id="campaign-root"></main>
  <script>window.__P5WAVES_PROMO__ = ${metaJson}; window.__P5WAVES_STAGE_ONLY__ = true;</script>
  <script src="${meta.p5Src}"></script>
  <script src="${meta.wavesSrc}"></script>
  <script src="../campaign/prelude.js"></script>
  <script src="sketch.js"></script>
  <script src="../campaign/shell.js"></script>
</body>
</html>
`;
}

function renderCatalog(manifest) {
  const featured = selectFeatured(manifest);
  const shelves = buildShelves(manifest);
  const heroTitle = `${manifest.length} sketches, re-cut as a p5.waves curation engine.`;
  const featuredCards = featured.map((meta) => renderCard(meta, { featured: true })).join('\n');
  const shelfMarkup = shelves.map((shelf) => renderShelf(shelf)).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Daily p5.waves — live 1080 campaign catalogue</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="campaign/base.css" />
</head>
<body class="campaign-index">
  <main class="catalog-shell">
    <header class="catalog-hero">
      <div class="catalog-kicker">p5.waves curation engine / live 1080 remixes</div>
      <h1 class="catalog-title">${escapeHtml(heroTitle)}</h1>
      <div class="catalog-copy">
        The engine now reads each sketch's declared gesture, library move, risk and reference notes,
        scores its promo strength, then pulls the clearest p5.waves hooks to the front. Featured plates
        lead the page; the full body follows in move shelves instead of one flat date dump.
      </div>
      <div class="catalog-stats">
        <span class="campaign-badge">${manifest.length} sketches</span>
        <span class="campaign-badge">${featured.length} featured plates</span>
        <span class="campaign-badge">${shelves.length} move shelves</span>
        <span class="campaign-badge">promo scoring from sketch notes</span>
        <span class="campaign-badge">Oswald / IBM Plex</span>
      </div>
    </header>
    <section class="catalog-section catalog-section--featured">
      <div class="catalog-section-head">
        <div class="catalog-section-kicker">featured</div>
        <h2 class="catalog-section-title">Best promo plates first</h2>
        <div class="catalog-section-copy">
          One lead card per strong move family where possible: threshold, shift, morph, wild mode,
          grid logic, range/domain and sampler studies that can actually sell the library in motion.
        </div>
      </div>
      <div class="catalog-grid catalog-grid--featured">
${featuredCards}
      </div>
    </section>
    ${shelfMarkup}
  </main>
</body>
</html>
`;
}

function renderCard(meta, options = {}) {
  const featured = Boolean(options.featured);
  const badges = [meta.mode, meta.primaryMove, meta.nativeCanvas].map((badge) => (
    `<span class="campaign-badge">${escapeHtml(badge)}</span>`
  )).join('');
  const tier = featured
    ? `<div class="catalog-card-tier">${escapeHtml(meta.promoTier)} · ${escapeHtml(String(meta.promoScore))}</div>`
    : '';
  const curatorLine = meta.curatorLine
    ? `<div class="catalog-card-curator">${escapeHtml(meta.curatorLine)}</div>`
    : '';

  return `      <a class="catalog-card${featured ? ' catalog-card--featured' : ''}" href="${meta.url}" aria-label="Open ${escapeHtml(meta.titleCase)}" style="--accent:${meta.accent};--accent-soft:${meta.accentSoft};--accent-strong:${meta.accentStrong};">
        <div class="catalog-card-head">
          <div class="catalog-card-kicker">${escapeHtml(meta.catalogKicker)}</div>
          <div class="catalog-card-meta">
            ${tier}
            <div class="catalog-card-date">${escapeHtml(meta.dateStamp)}<br />${escapeHtml(meta.timeStamp)}</div>
          </div>
        </div>
        <div class="catalog-card-title">${escapeHtml(meta.canvasTitle)}</div>
        <div class="catalog-card-copy">${escapeHtml(meta.deck)}</div>
        ${curatorLine}
        <div class="catalog-card-settings">${escapeHtml(meta.settingsLine)}</div>
        <div class="catalog-card-footer">
          <div class="catalog-card-badges">${badges}</div>
          <div class="catalog-card-linkrow">
            <span class="catalog-card-link">${escapeHtml(meta.linkLabel)}</span>
            <span class="catalog-card-path">${escapeHtml(meta.url)}</span>
          </div>
        </div>
      </a>`;
}

function renderShelf(shelf) {
  const cards = shelf.items.map((meta) => renderCard(meta)).join('\n');
  return `    <section class="catalog-section" id="shelf-${slugify(shelf.key)}">
      <div class="catalog-section-head">
        <div class="catalog-section-kicker">library move</div>
        <h2 class="catalog-section-title">${escapeHtml(shelf.title)}</h2>
        <div class="catalog-section-copy">${escapeHtml(shelf.copy)}</div>
      </div>
      <div class="catalog-grid">
${cards}
      </div>
    </section>`;
}

function extractMode(source) {
  const hit = source.match(/MODE:\s*([SFL])/i);
  const code = hit ? hit[1].toUpperCase() : 'F';
  const label = code === 'S' ? 'SUBJECT' : code === 'L' ? 'LITERAL' : 'FORMAL';
  return { code, label };
}

function extractWaveNames(source) {
  const names = new Set();

  for (const match of source.matchAll(/\bWAVE[A-Z_]*\s*=\s*['"]([^'"]+)['"]/gi)) {
    names.add(cleanWaveName(match[1]));
  }
  for (const match of source.matchAll(/(?:^|[,{;\s])(wave(?:Row|Col)?)\s*:\s*['"]([^'"]+)['"]/gim)) {
    names.add(cleanWaveName(match[2]));
  }
  for (const match of source.matchAll(/(?:^|[,{;\s])wave\s*:\s*\[\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\]/gim)) {
    names.add(cleanWaveName(match[1]));
    names.add(cleanWaveName(match[2]));
  }

  return Array.from(names).slice(0, 3);
}

function extractGroup(source) {
  const hit = source.match(/(?:^|[,{;\s])group\s*:\s*['"]([^'"]+)['"]/im);
  return hit ? hit[1] : '';
}

function extractValue(source, pattern) {
  const hit = source.match(pattern);
  return hit ? hit[1] : '';
}

function extractCanvasSize(source) {
  const constants = new Map();

  for (const match of source.matchAll(/const\s+([A-Za-z_$][\w$]*)\s*=\s*(\d+(?:\.\d+)?)/g)) {
    constants.set(match[1], Number(match[2]));
  }
  for (const match of source.matchAll(/const\s+([A-Za-z_$][\w$]*)\s*=\s*(\d+(?:\.\d+)?)\s*,\s*([A-Za-z_$][\w$]*)\s*=\s*(\d+(?:\.\d+)?)/g)) {
    constants.set(match[1], Number(match[2]));
    constants.set(match[3], Number(match[4]));
  }

  const createCanvas = source.match(/createCanvas\s*\(\s*([^,\s)]+)\s*,\s*([^,\s)]+)/);
  let width = 900;
  let height = 900;

  if (createCanvas) {
    width = resolveNumeric(createCanvas[1], constants) ?? width;
    height = resolveNumeric(createCanvas[2], constants) ?? height;
  } else {
    width = constants.get('W') ?? width;
    height = constants.get('H') ?? height;
  }

  const usesWEBGL = /\bWEBGL\b/.test(source);
  return {
    width,
    height,
    label: `${Math.round(width)}×${Math.round(height)}${usesWEBGL ? ' WEBGL' : ''}`
  };
}

function extractTimingProfile(source) {
  const values = Array.from(source.matchAll(/millis\s*\(\s*\)\s*\/\s*(\d+(?:\.\d+)?)/g))
    .map((match) => Number(match[1]))
    .filter(Number.isFinite);

  if (!values.length) {
    return { count: 0, min: null, median: null, max: null };
  }

  values.sort((a, b) => a - b);
  return {
    count: values.length,
    min: values[0],
    median: values[Math.floor(values.length / 2)],
    max: values[values.length - 1]
  };
}

function inferTimeScale({ timingProfile, moveFamily, primaryMove, promoTier }) {
  const base = MOTION_CONFIG[moveFamily] || MOTION_CONFIG[primaryMove] || MOTION_CONFIG['WAVE STUDY'];
  let scale = base.scale;
  const median = timingProfile.median;

  if (median != null) {
    if (median >= 5000) scale += 0.75;
    else if (median >= 3600) scale += 0.58;
    else if (median >= 2600) scale += 0.42;
    else if (median >= 1800) scale += 0.28;
    else if (median >= 1200) scale += 0.18;
    else if (median >= 800) scale += 0.08;
    else if (median <= 320) scale -= 0.12;
  }

  if ((timingProfile.count || 0) >= 6 && (median || 0) >= 1800) scale += 0.08;
  if (promoTier === 'hero') scale += 0.04;
  if (promoTier === 'study') scale -= 0.02;
  if (moveFamily === 'TIME') scale = Math.min(scale, 1.58);

  return clampTempoScale(scale);
}

function inferPromoStyle(moveFamily, primaryMove) {
  const config = MOTION_CONFIG[moveFamily] || MOTION_CONFIG[primaryMove] || MOTION_CONFIG['WAVE STUDY'];
  return config.style;
}

function inferPromoEnergy({ moveFamily, primaryMove, promoTier, timeScale }) {
  const config = MOTION_CONFIG[moveFamily] || MOTION_CONFIG[primaryMove] || MOTION_CONFIG['WAVE STUDY'];
  let energy = config.energy;

  if (promoTier === 'hero') energy += 0.04;
  if (promoTier === 'study') energy -= 0.04;
  energy += Math.max(0, timeScale - 1.5) * 0.08;

  return Math.max(0.58, Math.min(1, Number(energy.toFixed(2))));
}

function clampTempoScale(value) {
  return Math.max(1.28, Math.min(2.48, Number(value.toFixed(2))));
}

function formatTempoScale(value) {
  return Number(value).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

function resolveNumeric(token, constants) {
  if (/^\d+(?:\.\d+)?$/.test(token)) return Number(token);
  return constants.get(token);
}

function inferMoveMeta({ notes, flags, codeOnly }) {
  const declared = takeSentences(notes['LIBRARY MOVE'], 1);
  const explicit = classifyMoveText(declared, flags);
  if (explicit) return explicit;

  const secondary = classifyMoveText([
    notes.MATERIAL,
    notes['WAVE LOGIC'],
    notes['TIME LOGIC'],
    notes['STRUCTURAL MOVE'],
    notes.GESTURE
  ].filter(Boolean).join(' · '), flags);
  if (secondary) return secondary;

  if (flags.usesThreshold && flags.usesCreateGrid) return { key: 'THRESHOLD', family: 'THRESHOLD', score: 24 };
  if (flags.usesShift && flags.usesGroup) return { key: 'SHIFT GROUPS', family: 'SHIFT', score: 22 };
  if (flags.usesShift) return { key: 'SHIFT', family: 'SHIFT', score: 21 };
  if (flags.usesMorph) return { key: 'MORPH', family: 'MORPH', score: 21 };
  if (flags.usesWild) return { key: 'WILD MODE', family: 'WILD MODE', score: 19 };
  if (flags.usesCreateGrid) return { key: 'GRID', family: 'GRID', score: 12 };
  if (flags.usesGroup) return { key: 'WAVE GROUPS', family: 'SAMPLER', score: 13 };
  if (flags.usesCreateSampler) return { key: 'SAMPLER', family: 'SAMPLER', score: 12 };
  if (flags.usesRange) return { key: 'RANGE', family: 'RANGE', score: 14 };
  if (flags.usesWEBGL) return { key: 'WEBGL', family: 'WEBGL', score: 15 };
  return { key: 'WAVE STUDY', family: 'WAVE STUDY', score: 9 };
}

function classifyMoveText(value, flags) {
  if (!value) return null;

  for (const entry of MOVE_CONFIG) {
    if (entry.key === 'SHIFT GROUPS' && !(flags.usesShift && flags.usesGroup)) continue;
    if (entry.key === 'WAVE GROUPS' && flags.usesShift) continue;
    if (hasPositiveMoveMatch(value, entry.pattern)) {
      return { key: entry.key, family: entry.family, score: entry.score };
    }
  }

  return null;
}

function hasPositiveMoveMatch(value, pattern) {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const regex = new RegExp(pattern.source, flags);
  let match = regex.exec(value);

  while (match) {
    if (!isNegatedMoveMention(value, match.index)) return true;
    if (!match[0].length) regex.lastIndex += 1;
    match = regex.exec(value);
  }

  return false;
}

function isNegatedMoveMention(value, index) {
  const prefix = value.slice(Math.max(0, index - 24), index).toLowerCase();
  return /(?:\bno|\bnot|\bwithout|\bavoid|\bbanned?)\s*$/.test(prefix);
}

function buildSettingsLine({ waveNames, groupValue, thresholdValue, canvas, wavesVersion, flags, primaryMove, moveFamily }) {
  const parts = [];

  if (flags.usesCreateGrid) parts.push('createGrid()');
  else if (flags.usesCreateSampler) parts.push('createSampler()');
  else parts.push('Waves.wave()');

  if (waveNames.length === 1) parts.push(`wave ${waveNames[0]}`);
  if (waveNames.length === 2) parts.push(`waves ${waveNames[0]} × ${waveNames[1]}`);
  if (waveNames.length === 3) parts.push(`waves ${waveNames[0]} / ${waveNames[1]} / ${waveNames[2]}`);

  if (primaryMove === 'SHIFT GROUPS' && groupValue) parts.push(`group ${groupValue}`);
  else if (primaryMove === 'WAVE GROUPS' && groupValue) parts.push(`group ${groupValue}`);

  if (primaryMove === 'SHIFT' || primaryMove === 'SHIFT GROUPS') parts.push('shift on');
  if (primaryMove === 'MORPH') parts.push('morph');
  if (primaryMove === 'WILD MODE') parts.push('wild mode');
  if (primaryMove === 'THRESHOLD') parts.push(`threshold ${thresholdValue || 'active'}`);
  if (primaryMove === 'GRID AXES') parts.push('waveRow + waveCol');
  if (primaryMove === 'CUSTOM DOMAIN') parts.push('custom domain');
  if (primaryMove === 'INDEX') parts.push('select by index');
  if (primaryMove === 'TICK TIME') parts.push('tick time');
  if (primaryMove === 'FREQUENCY') parts.push('frequency');
  if (primaryMove === 'RANGE' || moveFamily === 'RANGE') {
    if (primaryMove !== 'CUSTOM DOMAIN') parts.push('range mapped');
  }
  if (flags.usesWEBGL) parts.push('WEBGL');

  parts.push(`source ${canvas.label}`);
  parts.push('native 1080×1080');
  parts.push(wavesVersion);

  return uniq(parts).join(' · ');
}

function buildStageLine({ waveNames, groupValue, thresholdValue, flags, primaryMove, moveFamily }) {
  const parts = [];

  if (waveNames.length === 1) parts.push(waveNames[0]);
  if (waveNames.length === 2) parts.push(`${waveNames[0]} × ${waveNames[1]}`);
  if (waveNames.length === 3) parts.push(`${waveNames[0]} / ${waveNames[1]} / ${waveNames[2]}`);

  if (!waveNames.length) {
    if (flags.usesCreateGrid) parts.push('createGrid');
    else if (flags.usesCreateSampler) parts.push('createSampler');
    else parts.push('Waves.wave');
  }

  if (primaryMove === 'THRESHOLD') parts.push(`threshold ${thresholdValue || 'sweep'}`);
  else if (primaryMove === 'SHIFT GROUPS') parts.push(groupValue ? `shift · ${groupValue}` : 'shift groups');
  else if (primaryMove === 'SHIFT') parts.push('shift');
  else if (primaryMove === 'MORPH') parts.push('morph');
  else if (primaryMove === 'WILD MODE') parts.push('wild mode');
  else if (primaryMove === 'GRID AXES') parts.push('grid axes');
  else if (primaryMove === 'CUSTOM DOMAIN') parts.push('custom domain');
  else if (primaryMove === 'INDEX') parts.push('index specimen');
  else if (primaryMove === 'TICK TIME') parts.push('tick time');
  else if (primaryMove === 'FREQUENCY') parts.push('frequency study');
  else if (primaryMove === 'RANGE' || moveFamily === 'RANGE') parts.push('range mapped');
  else if (primaryMove === 'WAVE GROUPS' && groupValue) parts.push(`group ${groupValue}`);
  else if (primaryMove && primaryMove !== 'WAVE STUDY') parts.push(primaryMove.toLowerCase());

  if (flags.usesWEBGL) parts.push('WEBGL');

  return uniq(parts).join(' · ');
}

function buildDeck({ titleCase, waveNames, groupValue, flags, primaryMove, moveFamily, notes, mode }) {
  const gestureLead = polishLeadText(takeSentences(notes.GESTURE, 2));
  const libraryMoveLead = polishLeadText(takeSentences(notes['LIBRARY MOVE'], 1));
  const aboutLead = polishLeadText(takeSentences(notes.ABOUT, 1));
  const formalLead = polishLeadText(takeSentences(notes['FORMAL QUESTION'], 1));
  const statementLead = polishLeadText(stripWrappingQuotes(notes.STATEMENT || ''));
  const feelingLead = polishLeadText(takeSentences(notes.FEELING, 1));
  const structuralLead = polishLeadText(takeSentences(notes['STRUCTURAL MOVE'], 1));

  if (mode.code === 'L' && statementLead && libraryMoveLead) {
    return `${statementLead} p5.waves move: ${libraryMoveLead}`;
  }
  if (mode.code === 'S' && aboutLead && libraryMoveLead) {
    return `${aboutLead} p5.waves move: ${libraryMoveLead}`;
  }
  if (mode.code === 'F' && formalLead && libraryMoveLead) {
    return `${formalLead} p5.waves move: ${libraryMoveLead}`;
  }

  if (gestureLead && libraryMoveLead) {
    return `${gestureLead} p5.waves move: ${libraryMoveLead}`;
  }
  if (aboutLead && libraryMoveLead) {
    return `${aboutLead} p5.waves move: ${libraryMoveLead}`;
  }
  if (statementLead && libraryMoveLead) {
    return `${statementLead} p5.waves move: ${libraryMoveLead}`;
  }
  if (formalLead && libraryMoveLead) {
    return `${formalLead} p5.waves move: ${libraryMoveLead}`;
  }
  if (gestureLead) {
    return gestureLead;
  }
  if (aboutLead) {
    return aboutLead;
  }
  if (statementLead) {
    return statementLead;
  }
  if (formalLead) {
    return formalLead;
  }
  if (feelingLead && feelingLead.length >= 28) {
    return feelingLead;
  }
  if (structuralLead) {
    return structuralLead;
  }
  if (feelingLead) {
    return feelingLead;
  }
  if (libraryMoveLead) {
    return `p5.waves move: ${libraryMoveLead}`;
  }

  if (primaryMove === 'GRID AXES') {
    return `${titleCase} turns the createGrid axis formula into a readable field, so row logic and column logic stay legible at once.`;
  }
  if (primaryMove === 'CUSTOM DOMAIN') {
    return `${titleCase} sells domain remapping directly: the same wave reads as a different instrument as the input window opens or contracts.`;
  }
  if (primaryMove === 'INDEX') {
    return `${titleCase} reframes the library as a specimen sheet, where wave selection itself becomes the event being advertised.`;
  }
  if (primaryMove === 'TICK TIME') {
    return `${titleCase} pitches explicit time control instead of ambient drift, so the library move reads as choreography rather than mood.`;
  }
  if (primaryMove === 'FREQUENCY') {
    const waveNote = waveNames[0] ? ` on ${waveNames[0]}` : '';
    return `${titleCase} makes frequency readable as a family of behaviors${waveNote}, not a buried parameter knob.`;
  }
  if (primaryMove === 'SHIFT GROUPS') {
    return `${titleCase} turns grouped wave families into a readable shifting campaign panel, with the sampler itself acting as the headline.`;
  }
  if (primaryMove === 'SHIFT') {
    return `${titleCase} sells the shift engine directly: one waveform dissolves into the next and the transition becomes the composition.`;
  }
  if (primaryMove === 'MORPH') {
    return `${titleCase} pitches p5.waves as a morph tool, using named wave identities as endpoints instead of abstract tween values.`;
  }
  if (primaryMove === 'WILD MODE') {
    return `${titleCase} promotes wild mode as controlled instability, where the wave keeps its spine but starts to misbehave on purpose.`;
  }
  if (primaryMove === 'RANGE') {
    return `${titleCase} uses range mapping as the pitch: the same waveform becomes layout, spacing or rotation instead of a plain line trace.`;
  }
  if (primaryMove === 'GRID') {
    return `${titleCase} frames the grid engine as a compositional system, not just a helper, by letting two wave axes do the talking.`;
  }
  if (primaryMove === 'WAVE GROUPS' && groupValue) {
    return `${titleCase} is recut as a wave-family card, showing how grouped selections give the library a curatorial voice.`;
  }
  if (primaryMove === 'SAMPLER') {
    const waveNote = waveNames[0] ? ` with ${waveNames[0]}` : '';
    return `${titleCase} turns the sampler${waveNote} into a clean specimen, making the API read like a graphic instrument.`;
  }
  if (flags.usesCreateGrid && flags.usesThreshold) {
    return `${titleCase} reframes createGrid() as a binary threshold poster, so the library move reads before the mood does.`;
  }
  if (flags.usesShift && flags.usesGroup) {
    return `${titleCase} turns grouped wave families into a readable shifting campaign panel, with the sampler itself acting as the headline.`;
  }
  if (flags.usesShift) {
    return `${titleCase} sells the shift engine directly: one waveform dissolves into the next and the transition becomes the composition.`;
  }
  if (flags.usesMorph) {
    return `${titleCase} pitches p5.waves as a morph tool, using named wave identities as endpoints instead of abstract tween values.`;
  }
  if (flags.usesWild) {
    return `${titleCase} promotes wild mode as controlled instability, where the wave keeps its spine but starts to misbehave on purpose.`;
  }
  if (flags.usesCreateGrid) {
    return `${titleCase} frames the grid engine as a compositional system, not just a helper, by letting two wave axes do the talking.`;
  }
  if (flags.usesRange) {
    return `${titleCase} uses range mapping as the pitch: the same waveform becomes layout, spacing or rotation instead of a plain line trace.`;
  }
  if (flags.usesCreateSampler) {
    const waveNote = waveNames[0] ? ` with ${waveNames[0]}` : '';
    return `${titleCase} turns the sampler${waveNote} into a clean specimen, making the API read like a graphic instrument.`;
  }
  if (groupValue) {
    return `${titleCase} is recut as a wave-family card, showing how grouped selections give the library a curatorial voice.`;
  }
  return `${titleCase} is reframed as a ${mode.label.toLowerCase()} library card, where the sketch acts less like atmosphere and more like a proof of capability.`;
}

function buildLinkLabel(primaryMove) {
  const hit = MOVE_CONFIG.find((entry) => entry.key === primaryMove);
  return hit?.cta || 'Open promo frame';
}

function buildCuratorLine({ notes, titleCase, primaryMove, moveFamily }) {
  const reference = extractAnchorName(notes['REFERENCE ANCHOR'] || notes.REFERENCE);
  const seb = extractAnchorName(notes['SEB ANCHOR']);
  const risk = polishLeadText(takeSentences(notes.RISK, 1));

  if (reference && seb) return `Between ${reference} and ${seb}.`;
  if (seb) return `In dialogue with ${seb}.`;
  if (reference) return `Staged against ${reference}.`;
  if (risk) return risk;

  switch (primaryMove) {
    case 'THRESHOLD':
      return 'Built to read as an on/off demo before it reads as atmosphere.';
    case 'SHIFT':
    case 'SHIFT GROUPS':
      return 'A library-first motion plate where the transition is the headline.';
    case 'MORPH':
      return 'One wave identity acquires another without hiding the mechanism.';
    case 'WILD MODE':
      return 'The instability stays named and visible instead of dissolving into texture.';
    case 'GRID AXES':
      return 'Row logic and column logic stay visible inside the same field.';
    case 'CUSTOM DOMAIN':
      return 'The wave changes character because the input window changes, not the wave itself.';
    case 'INDEX':
      return 'A specimen-sheet approach that promotes the vocabulary as a set of choices.';
    case 'FREQUENCY':
      return 'One parameter is allowed to carry the full argument.';
    case 'TICK TIME':
      return 'Time is treated as a named parameter, not background drift.';
    default:
      return `${titleCase} is carried by the ${moveFamily.toLowerCase()} shelf rather than by chronology alone.`;
  }
}

function scorePromo({ notes, flags, primaryMove, moveFamily, mode }) {
  const moveMeta = MOVE_CONFIG.find((entry) => entry.key === primaryMove);
  let score = 34 + (moveMeta?.score || 10);

  if (notes.GESTURE) score += 4;
  if (notes['LIBRARY MOVE']) score += 8;
  if (notes['REFERENCE ANCHOR'] || notes.REFERENCE) score += 3;
  if (notes['SEB ANCHOR']) score += 3;
  if (notes.RISK) score += 3;
  if (notes.ABOUT || notes['FORMAL QUESTION'] || notes.STATEMENT) score += 5;
  if (notes.FEELING) score += 2;
  if (notes['WAVE LOGIC']) score += 2;
  if (notes['TIME LOGIC']) score += 1;
  if (notes['STRUCTURAL MOVE'] || notes.MATERIAL) score += 3;

  if (mode.code === 'L') score += 1;

  if (primaryMove === 'GRID AXES' || primaryMove === 'CUSTOM DOMAIN' || primaryMove === 'INDEX' || primaryMove === 'TICK TIME' || primaryMove === 'FREQUENCY') {
    score += 2;
  }

  if (flags.usesThreshold) score += 1;
  if (flags.usesShift) score += 1;
  if (flags.usesMorph) score += 1;
  if (flags.usesWild) score += 1;
  if (moveFamily === 'WAVE STUDY') score -= 5;

  return Math.max(52, Math.min(94, score));
}

function classifyPromoTier(score) {
  if (score >= 88) return 'hero';
  if (score >= 80) return 'lead';
  if (score >= 72) return 'strong';
  return 'study';
}

function selectFeatured(manifest) {
  const sorted = [...manifest].sort((a, b) => {
    if (b.promoScore !== a.promoScore) return b.promoScore - a.promoScore;
    return a.id < b.id ? 1 : -1;
  });

  const picks = [];
  const seenFamilies = new Set();

  for (const meta of sorted) {
    if (picks.length >= 6) break;
    if (seenFamilies.has(meta.moveFamily)) continue;
    if (meta.promoTier === 'study') continue;
    picks.push(meta);
    seenFamilies.add(meta.moveFamily);
  }

  for (const meta of sorted) {
    if (picks.length >= 6) break;
    if (picks.includes(meta)) continue;
    if (meta.promoTier === 'study') continue;
    picks.push(meta);
  }

  return picks;
}

function buildShelves(manifest) {
  const groups = new Map();

  for (const meta of manifest) {
    if (!groups.has(meta.moveFamily)) groups.set(meta.moveFamily, []);
    groups.get(meta.moveFamily).push(meta);
  }

  return SHELF_CONFIG
    .map((config) => ({
      ...config,
      items: (groups.get(config.key) || []).sort((a, b) => {
        if (b.promoScore !== a.promoScore) return b.promoScore - a.promoScore;
        return a.id < b.id ? 1 : -1;
      })
    }))
    .filter((shelf) => shelf.items.length);
}

function inferArtworkBounds(id) {
  const override = ART_BOUNDS_OVERRIDES[id];
  if (!override) return DEFAULT_ART_BOUNDS;

  return {
    left: clampFrameValue(override.left),
    top: clampFrameValue(override.top),
    right: clampFrameValue(override.right),
    bottom: clampFrameValue(override.bottom)
  };
}

function extractScript(source, pattern, fallback) {
  const hit = source.match(pattern);
  return hit ? hit[1] : fallback;
}

function extractWavesVersion(source) {
  const hit = source.match(/p5\.waves@([^/]+)\//i);
  return hit ? `p5.waves ${hit[1]}` : 'p5.waves';
}

function extractAnchorName(value) {
  if (!value) return '';
  const normalized = value
    .split(/\s+[—-]\s+/)[0]
    .split(/;\s+|\.\s+(?=[A-Z])/)[0]
    .replace(/^\d{8}[_\s-]?\d{3,4}[_\s-]?/i, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return '';
  return normalized
    .split(' ')
    .filter(Boolean)
    .map((part) => {
      if (/^[A-Z0-9.+-]+$/.test(part)) return part;
      if (part === part.toUpperCase()) return part;
      if (/[0-9.]/.test(part)) return part;
      return part[0].toUpperCase() + part.slice(1);
    })
    .join(' ');
}

function slugToDisplay(slug) {
  return slug
    .replace(/[_-]+/g, ' ')
    .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function slugToTitleCase(slug) {
  return slug
    .replace(/[_-]+/g, ' ')
    .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function slugToCanvasTitle(slug) {
  return slug
    .replace(/[_-]+/g, ' ')
    .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function cleanWaveName(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function extractHeaderNotes(source) {
  return {
    ...extractLegacyCommentFields(source),
    ...extractCommentSections(source)
  };
}

function extractHeaderLines(source) {
  const lines = source.split(/\r?\n/);
  const headerLines = [];
  let seenHeader = false;
  let inBlock = false;

  for (const rawLine of lines) {
    if (inBlock) {
      const endIndex = rawLine.indexOf('*/');
      const segment = endIndex >= 0 ? rawLine.slice(0, endIndex) : rawLine;
      headerLines.push(stripHeaderLine(segment));
      if (endIndex >= 0) inBlock = false;
      continue;
    }

    const trimmed = rawLine.trim();
    if (!trimmed) {
      if (seenHeader) headerLines.push('');
      continue;
    }

    if (/^\/\//.test(trimmed)) {
      seenHeader = true;
      headerLines.push(stripHeaderLine(trimmed.replace(/^\/\/+\s?/, '')));
      continue;
    }

    if (/^\/\*/.test(trimmed)) {
      seenHeader = true;
      let segment = rawLine.replace(/^\s*\/\*+\s?/, '');
      const endIndex = segment.indexOf('*/');
      if (endIndex >= 0) {
        segment = segment.slice(0, endIndex);
      } else {
        inBlock = true;
      }
      headerLines.push(stripHeaderLine(segment));
      continue;
    }

    if (seenHeader) break;
  }

  return headerLines;
}

function stripHeaderLine(value) {
  return String(value)
    .replace(/^\s*\*\s?/, '')
    .trim();
}

function extractCommentSections(source) {
  const sections = {};
  let currentKey = '';

  for (const rawLine of extractHeaderLines(source)) {
    const text = rawLine.trim();
    if (!text || /^=+$/.test(text)) continue;

    const sectionMatch = text.match(/^(\d+[a-z]?)\.\s+([A-Z][A-Z' ]+):\s*(.*)$/);
    if (sectionMatch) {
      currentKey = normalizeSectionKey(sectionMatch[2]);
      sections[currentKey] = [];
      if (sectionMatch[3]) sections[currentKey].push(sectionMatch[3]);
      continue;
    }

    if (!currentKey) continue;
    sections[currentKey].push(text);
  }

  return Object.fromEntries(
    Object.entries(sections).map(([key, value]) => [key, normalizeNarrative(value.join(' '))])
  );
}

function extractLegacyCommentFields(source) {
  const fields = {};
  let currentKey = '';

  for (const rawLine of extractHeaderLines(source)) {
    const text = rawLine.trim();
    if (!text || /^[-=]+$/.test(text)) continue;

    const fieldMatch = text.match(/^([A-Z][A-Z ']+?)\s*:\s*(.*)$/);
    if (fieldMatch) {
      currentKey = normalizeSectionKey(remapLegacyFieldKey(fieldMatch[1]));
      fields[currentKey] = [];
      if (fieldMatch[2]) fields[currentKey].push(fieldMatch[2]);
      continue;
    }

    if (!currentKey) continue;
    fields[currentKey].push(text);
  }

  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, normalizeNarrative(value.join(' '))])
  );
}

function remapLegacyFieldKey(value) {
  const normalized = value.replace(/\s+/g, ' ').trim().toUpperCase();
  if (normalized === 'REF') return 'REFERENCE ANCHOR';
  if (normalized === 'REFERENCE') return 'REFERENCE ANCHOR';
  if (normalized === 'SEB') return 'SEB ANCHOR';
  if (normalized === 'STRUCTURAL') return 'STRUCTURAL MOVE';
  if (normalized === 'COLOR') return 'COLOR COMMITMENT';
  return normalized;
}

function normalizeSectionKey(value) {
  return value.replace(/\s+/g, ' ').trim().toUpperCase();
}

function normalizeNarrative(value) {
  return value
    .replace(/`/g, '')
    .replace(/(\w)-\s+(and|or)\b/gi, '$1- $2')
    .replace(/(\w)-\s+(?!and\b|or\b)(\w)/gi, '$1$2')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([([{])\s+/g, '$1')
    .replace(/\s+([)\]}])/g, '$1')
    .trim();
}

function takeSentences(value, count) {
  if (!value) return '';
  return splitSentences(value)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, count)
    .join(' ');
}

function splitSentences(value) {
  const text = String(value).trim();
  if (!text) return [];

  const parts = [];
  let start = 0;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (!'.!?'.includes(char)) continue;

    const prev = text[index - 1] || '';
    const next = text[index + 1] || '';
    if (char === '.' && /[A-Za-z0-9]/.test(prev) && /[A-Za-z0-9]/.test(next)) continue;

    let end = index + 1;
    while (end < text.length && /['")\]]/.test(text[end])) end += 1;

    let nextToken = end;
    while (nextToken < text.length && /\s/.test(text[nextToken])) nextToken += 1;
    if (nextToken < text.length && /[a-z]/.test(text[nextToken])) continue;

    const segment = text.slice(start, nextToken).trim();
    if (segment) parts.push(segment);
    start = nextToken;
    index = nextToken - 1;
  }

  const tail = text.slice(start).trim();
  if (tail) parts.push(tail);

  return parts;
}

function polishLeadText(value) {
  if (!value) return '';
  const cleaned = softenLeadCaps(value.trim());
  const normalized = cleaned[0].toUpperCase() + cleaned.slice(1);
  return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
}

function clampFrameValue(value) {
  return Math.max(0, Math.min(1080, Math.round(value)));
}

function uniq(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function softenLeadCaps(value) {
  return value.replace(/^([A-Z0-9][A-Z0-9 +/&'-]{1,32}\.)/, (match) => {
    const inner = match.slice(0, -1).toLowerCase();
    return inner.replace(/\b[a-z]/g, (char) => char.toUpperCase()) + '.';
  });
}

function stripWrappingQuotes(value) {
  return String(value).trim().replace(/^["']|["']$/g, '');
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;
  const num = Number.parseInt(value, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}
