/* ---------------------------------------------------------------------------
   p5.waves extended — i18n (NL/EN)
   ---------------------------------------------------------------------------
   Eén gedeelde taal-laag voor de hele platform-chrome. Elke vertaalbare tekst
   draagt op zijn element een `data-i18n="sleutel"`. Attributen (placeholder,
   title, aria-label) gaan via `data-i18n-attr="placeholder:sleutel"`.

   - Default = Nederlands (de HTML staat in NL geschreven).
   - Keuze wordt onthouden in localStorage ('pwx-lang') → reist mee tussen
     pagina's én collecties (subpagina's laden ../i18n.js).
   - Een toggle-knop met id="lang-toggle" (of class "lang-toggle") wisselt.
     Het label toont de TAAL waar je naartoe schakelt (NL → toont "EN").

   Bereik = chrome only. Collectie-content (annotaties, sketch-data) blijft NL.
   Sleutels zijn genamespaced per pagina; een ontbrekende sleutel wordt gewoon
   overgeslagen, dus elke pagina draagt enkel de sleutels die ze gebruikt.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var DICT = {
    nl: {
      /* --- gedeeld: navigatie --- */
      'nav.collections': 'Collecties',
      'nav.about': 'Over',
      'nav.overview': 'Overzicht',
      'lang.toggle': 'EN',            // label van de knop in NL-modus

      /* --- gedeeld: filter/zoek (alle kit-index'en) --- */
      'search.placeholder': 'Zoek op titel of trefwoord…',
      'filter.of': 'van',
      'filter.items': 'items',
      'noresults.item': 'Geen item gevonden voor deze filter.',

      /* --- x100 kit-index --- */
      'x100.doc.title': 'X100 - Grids · p5.waves extended',
      'x100.tag': 'x100 · honderd-frame grids',
      'x100.title': 'X100 - <span class="accent">Grids</span>',
      'x100.desc': 'Een doorlopend onderzoek naar wat de p5.waves library kan, verteld in honderden kleine 50×50 animaties - telkens een 10×10 raster van 100 frames. Zeven versies, elk een eigen lens. Zoek of klik een trefwoord om op thema te filteren.',

      /* --- audio kit-index --- */
      'nav.live12': 'Alle 12 live',
      'audio.doc.title': 'Audio × Waves · p5.waves extended',
      'audio.tag': 'audio × waves · onderzoek',
      'audio.title': 'p5.<span class="accent">wavs</span>',
      'audio.desc': 'Wat maakt p5.waves méér dan een opgenomen audiogolf? Geluid stuurt hier niet de <em>vorm</em> maar de <em>structuur</em>: de tijd, de morph, de golf-identiteit, gesloten vormen op de beat - en omgekeerd wordt een golf geluid. Zoek of klik een trefwoord om op thema te filteren.',
      'filter.concepts': 'concepten',
      'noresults.concept': 'Geen concept gevonden voor deze filter.',

      /* --- daily kit-index --- */
      'daily.doc.title': 'Daily - Studies · p5.waves extended',
      'daily.tag': 'daily · gedateerde studies',
      'daily.title': 'Daily - <span class="accent">Studies</span>',
      'daily.desc': 'Een dagelijkse reeks p5.waves-studies, elk met een eigen move: threshold, shift, morph, wild mode, grid-logica, sampler. Zoek of klik een trefwoord om op move-familie te filteren.',
      'daily.search.placeholder': 'Zoek op titel, move of trefwoord…',
      'filter.studies': 'studies',
      'noresults.study': 'Geen studie gevonden voor deze filter.',

      /* --- landing: hero --- */
      'doc.title': 'p5.waves extended - experimenten, per thema doorzoekbaar',
      'hero.badge': 'uitbreiding op de p5.waves library',
      'hero.sub': 'De losse experimenten, samengebracht op één plek.<br>Geordend per thema, doorzoekbaar met #trefwoorden.',
      'hero.cta': 'Naar de collecties &#8595;',

      /* --- landing: intro --- */
      'intro.lead': 'Rond p5.waves zijn losse studies gegroeid - grids, dagelijkse posters, audio-onderzoek. <strong>p5.waves extended</strong> bundelt ze tot één samenhangend geheel in dezelfde sobere vormgeving als de library zelf, zodat je per thema kunt bladeren en zoeken in plaats van losse mappen.',

      /* --- landing: collections --- */
      'collections.tag': 'doorzoekbaar met #trefwoorden',
      'collections.title': 'De <span class="accent">collecties</span>',
      'collections.desc': 'Type een woord of klik een trefwoord aan om te filteren.',
      'filter.collections': 'collecties',
      'noresults': 'Geen collectie gevonden voor deze filter.',

      /* --- landing: kaarten (platform-chrome, niet uit manifest) --- */
      'card.x100.status': '7 versies',
      'card.x100.count': '7 versies × 100 frames',
      'card.x100.desc': 'Diepe verkenning van p5.waves via een 10×10 raster van geanimeerde frames. Van techniek-showcase tot "100 Tiny Worlds".',
      'card.daily.status': '98 sketches',
      'card.daily.count': '98 gedateerde sketches',
      'card.daily.desc': 'Een dagelijkse reeks geannoteerde studies - threshold, shift, morph, grid-logica - met verwijzingen naar Riley, Molnár, LeWitt, Kelly.',
      'card.audio.status': '11 concepten',
      'card.audio.count': '11 research-concepten',
      'card.audio.desc': 'Geluid en waves die elkaar sturen: FFT als tijddriver, spectrum naar amplitude, beat-getriggerde shifts, Chladni-patronen, sonificatie.',

      /* --- landing: about --- */
      'about.tag': 'over dit platform',
      'about.title': 'Eén <span class="accent">geheel</span>',
      'about.desc': 'p5.waves extended is geen nieuwe library, maar een vitrine: het toont de experimenten rond p5.waves als één samenhangend, doorzoekbaar geheel in dezelfde sobere zwart-wit vormgeving. Eenheid en juistheid voorop.'
    },

    en: {
      /* --- shared: navigation --- */
      'nav.collections': 'Collections',
      'nav.about': 'About',
      'nav.overview': 'Overview',
      'lang.toggle': 'NL',            // button label in EN mode

      /* --- shared: filter/search (all kit indexes) --- */
      'search.placeholder': 'Search by title or keyword…',
      'filter.of': 'of',
      'filter.items': 'items',
      'noresults.item': 'No item found for this filter.',

      /* --- x100 kit index --- */
      'x100.doc.title': 'X100 - Grids · p5.waves extended',
      'x100.tag': 'x100 · hundred-frame grids',
      'x100.title': 'X100 - <span class="accent">Grids</span>',
      'x100.desc': 'An ongoing exploration of what the p5.waves library can do, told in hundreds of tiny 50×50 animations - each a 10×10 grid of 100 frames. Seven versions, each its own lens. Search or click a keyword to filter by theme.',

      /* --- audio kit index --- */
      'nav.live12': 'All 12 live',
      'audio.doc.title': 'Audio × Waves · p5.waves extended',
      'audio.tag': 'audio × waves · research',
      'audio.title': 'p5.<span class="accent">wavs</span>',
      'audio.desc': 'What makes p5.waves more than a recorded audio wave? Here sound drives not the <em>shape</em> but the <em>structure</em>: the time, the morph, the wave identity, closed forms on the beat - and conversely a wave becomes sound. Search or click a keyword to filter by theme.',
      'filter.concepts': 'concepts',
      'noresults.concept': 'No concept found for this filter.',

      /* --- daily kit index --- */
      'daily.doc.title': 'Daily - Studies · p5.waves extended',
      'daily.tag': 'daily · dated studies',
      'daily.title': 'Daily - <span class="accent">Studies</span>',
      'daily.desc': 'A daily series of p5.waves studies, each with its own move: threshold, shift, morph, wild mode, grid logic, sampler. Search or click a keyword to filter by move family.',
      'daily.search.placeholder': 'Search by title, move or keyword…',
      'filter.studies': 'studies',
      'noresults.study': 'No study found for this filter.',

      /* --- landing: hero --- */
      'doc.title': 'p5.waves extended - experiments, searchable by theme',
      'hero.badge': 'an extension of the p5.waves library',
      'hero.sub': 'The standalone experiments, brought together in one place.<br>Ordered by theme, searchable with #keywords.',
      'hero.cta': 'To the collections &#8595;',

      /* --- landing: intro --- */
      'intro.lead': 'A set of standalone studies has grown around p5.waves - grids, daily posters, audio research. <strong>p5.waves extended</strong> bundles them into one coherent whole in the same restrained design as the library itself, so you can browse and search by theme instead of through scattered folders.',

      /* --- landing: collections --- */
      'collections.tag': 'searchable with #keywords',
      'collections.title': 'The <span class="accent">collections</span>',
      'collections.desc': 'Type a word or click a keyword to filter.',
      'filter.collections': 'collections',
      'noresults': 'No collection found for this filter.',

      /* --- landing: cards (platform chrome, not from manifest) --- */
      'card.x100.status': '7 versions',
      'card.x100.count': '7 versions × 100 frames',
      'card.x100.desc': 'A deep exploration of p5.waves through a 10×10 grid of animated frames. From technique showcase to "100 Tiny Worlds".',
      'card.daily.status': '98 sketches',
      'card.daily.count': '98 dated sketches',
      'card.daily.desc': 'A daily series of annotated studies - threshold, shift, morph, grid logic - with references to Riley, Molnár, LeWitt, Kelly.',
      'card.audio.status': '11 concepts',
      'card.audio.count': '11 research concepts',
      'card.audio.desc': 'Sound and waves driving each other: FFT as a time driver, spectrum to amplitude, beat-triggered shifts, Chladni patterns, sonification.',

      /* --- landing: about --- */
      'about.tag': 'about this platform',
      'about.title': 'One <span class="accent">whole</span>',
      'about.desc': 'p5.waves extended is not a new library but a showcase: it presents the experiments around p5.waves as one coherent, searchable whole in the same restrained black-and-white design. Unity and correctness first.'
    }
  };

  var STORE = 'pwx-lang';
  var lang = (function () {
    try { return localStorage.getItem(STORE) || 'nl'; } catch (e) { return 'nl'; }
  })();
  if (lang !== 'nl' && lang !== 'en') lang = 'nl';

  function t(key, l) {
    var d = DICT[l] || DICT.nl;
    return Object.prototype.hasOwnProperty.call(d, key) ? d[key] : null;
  }

  function apply(l) {
    if (l !== 'nl' && l !== 'en') l = 'nl';
    lang = l;
    document.documentElement.lang = l;

    // text / inline-HTML nodes
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = t(el.getAttribute('data-i18n'), l);
      if (val != null) el.innerHTML = val;
    });

    // attributes: "placeholder:search.placeholder; title:some.key"
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length !== 2) return;
        var attr = bits[0].trim(), val = t(bits[1].trim(), l);
        if (val != null) el.setAttribute(attr, val);
      });
    });

    // NB: de browser-tab volgt automatisch als het <title>-element een
    // data-i18n draagt (de loop hierboven zet zijn tekst) — elke pagina tagt
    // zijn EIGEN titel-sleutel, dus hier niets globaal forceren.

    try { localStorage.setItem(STORE, l); } catch (e) {}

    // let the page react if it wants (e.g. re-render dynamic chrome)
    document.dispatchEvent(new CustomEvent('pwx:lang', { detail: { lang: l } }));
  }

  function toggle() { apply(lang === 'nl' ? 'en' : 'nl'); }

  function wire() {
    var btns = document.querySelectorAll('#lang-toggle, .lang-toggle');
    btns.forEach(function (b) { b.addEventListener('click', toggle); });
    apply(lang);
  }

  // public hook — pages can read/translate manually if needed
  window.PWX_I18N = {
    apply: apply,
    toggle: toggle,
    t: function (key) { return t(key, lang); },
    get lang() { return lang; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
