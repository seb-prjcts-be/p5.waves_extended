# p5.waves extended

## Missie
Eén platform dat de losse, alleenstaande p5.waves-experimenten samenbrengt als uitbreiding op de p5.waves library. Geen nieuwe library - een vitrine. Geordend per thema, doorzoekbaar met #trefwoorden, in dezelfde sobere zwart-wit huisstijl als p5.waves zelf. Kernwaarden: eenheid en juistheid.

## Boom
```
p5.waves_extended/
├── index.html        ← Landingspagina: levende wave-hero + intro + doorzoekbare collectie-grid
├── hero.js           ← Hero-sketch: gekleurde wave-banden via Waves.createSampler (zelfde techniek als library showcase)
├── styleguide.html   ← CANONIEKE styleguide - levende pagina, gedeeld kit + paginastructuur + regels
├── view.html         ← (ONGEBRUIKT) oude iframe-wrapper; alle 4 collecties linken nu rechtstreeks - kan weg
├── x100/             ← GEHARMONISEERD onderzoek #4: volledig gekopieerd (892 KB)
│   ├── index.html        ← Kit-launcher: 7 versie-kaarten + Frame Library, #navbar + zoek + #tags
│   ├── back.js           ← "← X100"-knop, geïnjecteerd in alle 7 versie-pagina's + library
│   ├── library/          ← frame-browser (zoek/filter/kopieer) - VOLLEDIG (670 frames, alle 7 versies); frames-library.json GEGENEREERD door build-library.mjs (zie library/README.md)
│   └── p5.wavesX100_v01..v07/  ← 7×100-frame grids (p5 1.x + p5.waves v2.1.0, ongewijzigd = de kunst)
├── audio/            ← GEHARMONISEERD onderzoek #2: volledig gekopieerd (8,5 MB, geluid incl.)
│   ├── index.html        ← Kit-index, 12 concepten uit inline data, #navbar + zoek + #tags
│   ├── shared/ui.js      ← gedeelde audiobalk + "← Audio"-knop (linksonder, alle conceptpagina's)
│   └── concepten/        ← 12 live audio×waves concepten (eigen donkere chrome = de instrumenten)
├── daily/            ← GEHARMONISEERD onderzoek #1: VOLLEDIGE kopie (360 MB, incl. mp4/png-exports) zodat origineel weg kan
│   ├── index.html        ← Data-gedreven kit-index uit campaign/manifest.json (#navbar + zoek + #tags)
│   ├── campaign/manifest.json ← databron (85 studies; gegenereerd door campaign/build.mjs uit de mappen)
│   └── 2026…/            ← 85 sketch-mappen (live p5-sketches, eigen chrome NOG niet geharmoniseerd)
├── style.css         ← Verbatim kopie van p5.waves/docs/style.css (canonieke huisstijl)
├── extended.css      ← Platform-kit: zoekbalk, #tag-chips, kaarten, view-shell/terug-balk
├── i18n.js           ← Gedeelde NL/EN-taallaag (toggle in nav, localStorage 'pwx-lang', chrome only)
└── cloud.md          ← Dit bestand
```
> Server: **XAMPP Apache draait altijd op poort 80** → `http://localhost/p5.waves_extended/`. NOOIT een python http.server of preview-server starten (geen launch.json meer).

## Regels
- **Scope = alleen deze vier collecties.** Alle andere p5.waves-mappen in htdocs zitten al op een andere manier in de library - afblijven.
- Huisstijl komt uit de **canonieke** `p5.waves/docs/style.css` (verbatim gekopieerd, niet gelinkt - zelfstandig, breekt niet mee als de library verandert). Platform-toevoegingen alleen in `extended.css`.
- De onderliggende projecten worden **niet aangeraakt** - ze draaien binnen de iframe van `view.html`, met de terugknop er altijd boven.
- Serveren = **XAMPP Apache, poort 80** (draait altijd). Bekijken/verifiëren op `http://localhost/p5.waves_extended/`. NOOIT zelf een python- of preview-server starten.
- #trefwoord-chips worden automatisch uit de `data-tags` van de kaarten opgebouwd - tags toevoegen/wijzigen gebeurt op de kaart, niet in de chip-lijst.
- Stijl: Oswald (uppercase koppen) + Inter (body) + Consolas (mono), bg #f5f5f5, scherpe hoeken, zwart als enige accent.

## Collecties (3)
| # | Kaart | Bron-map | Inhoud |
|---|-------|----------|--------|
| 01 | X100 - Grids | p5.wavesX100 | 7 versies × 100-frame grids |
| 02 | Daily - Studies | daily_p5.waves | 85 gedateerde, geannoteerde sketches |
| 03 | Audio × Waves | p5.wavs | 11 audio×waves research-concepten |

## Architectuur (beslist 2026-06-08)
- De onderzoeken bestaan NIET los als GH-Pages-repo's → het platform **bundelt** ze als submappen, zodat het één zelfstandig deploybaar geheel is (`seb-prjcts-be.github.io/p5.waves_extended/x100/` enz.). Originele htdocs-mappen blijven onaangeroerd als archief.
- **Interne eenheid is een harde eis:** elk onderzoek moet binnenin aan dezelfde opmaak én structuur voldoen - niet enkel een wrapper eromheen. De canonieke spec is **`styleguide.html`** (levende pagina, single source of truth). Diepte = "chrome unificeren, kunst behouden": pagina-opmaak overal identiek sober B&W, generatieve sketches houden hun eigen beeld/kleur.
- Links worden intern (`./x100/` i.p.v. `../`) zodra gebundeld.

## Familie met de p5.waves-library (review 2026-06-08)
- Structureel al familie: zelfde `style.css` (verbatim), identieke `#navbar`-markup, `.section`/`.section-header`/`.section-tag`/`.section-desc`, fonts Oswald+Inter, p5.js 2.2.2. Alleen de nav-links verschillen per site (correct).
- Canonieke **footer** = twee `<p>`: `Built with p5.waves + p5.js` / `.footer-sub` met versie. Extended-footers hierop gelijkgetrokken (`Part of the p5.waves ecosystem · v3.3.0`).
- Canonieke conventie + te vermijden anomalieën staan nu in `styleguide.html` §12.
- **Library-anomalieën NIET overnemen bij harmonisatie:** `periodicity.html` gebruikt afwijkende `.nav` i.p.v. `#navbar`; about/waves/curation-engine hebben page-scoped inline CSS (geen kit). Alleen nav + footer + `.section*` zijn universeel; de rest is pagina-eigen.
- Library-docs: index.html (hero-showcase) + docs/{about,examples,guide,periodicity,waves}.html + docs/curation-engine/. p5.waves-bron lokaal = dev `p5.waves.js`; live/CDN = v3.3.0.

## Notities
- 2026-06-09: 🔪 DAILY-CURATIE na 3-assen agent-audit (93→85). Verwijderd: a_to_b, one_or_zero, row_plus_col, breath, thirty-four (dubbel van thirty_four_waves), not_an_ocean + 2 zwakke "daily" (radiale ringen 5/5, binaire weave 5/5). Reden = as 1 (toont code de slimheid van de lib?): library gereduceerd tot domme lookup. **As 3 (3.3.0-compat) bleek non-issue:** géén study roept echt `createGrid`/`waveRow`/`waveCol` aan — enkel in commentaar; alles draait op 3.3.0. NIET gesneden: de ~25 studies die identiek 8/7/10 scoren zijn artistiek verschillend (variatie, geen redundantie). Manifest hand-gefilterd (consistent met latere `build.mjs`-run); telling is runtime-dynamisch. Rapport: `daily/docs/audit_3axis_2026-06-09.md`. Nog niet gecommit. De 9 sterke "daily"-genoemde studies HERNOEMD naar betekenisvolle slugs (horizon, petals, current, faults, caustics, hatch, nodes, interval, bearings) — map-rename + manifest-entry + embedded `window.__P5WAVES_PROMO__` in elke study-index.html gepatcht. Bewust GEEN `build.mjs` gedraaid: die zou de geharmoniseerde root `daily/index.html` (navbar+i18n) overschrijven met de oude campagne-catalogus. Geen "daily"-slug meer over; alles 200.
- 2026-06-08: ✅ LIVE GEDEPLOYD → **https://seb-prjcts-be.github.io/p5.waves_extended/** (GH-Pages, bron main /root, https enforced). `git init` + 408 bestanden + push gedaan; Pages via gh-api geactiveerd (eerste build draaide). Root `.gitignore` sluit `.claude/` + `.htaccess` uit. **LET OP `audio/.gitignore`:** blokkeert ALLE mp3 (Roni-veiligheidsslot) MAAR met expliciete uitzondering `!sound/brunk_akoxylo.mp3` + `!sound/demo-loop.wav` → die twee gaan WEL mee; nieuwe muziek toevoegen = nieuwe `!`-regel nodig anders ontbreekt het geluid live. Te checken na build: site bereikbaar + audio speelt (brunk-mp3 geserveerd).
- 2026-06-08: 🚀 DEPLOY-TARGET = `https://github.com/seb-prjcts-be/p5.waves_extended.git` → GH-Pages `seb-prjcts-be.github.io/p5.waves_extended/`. Lokaal NOG GEEN git-repo / geen `.gitignore`. **Grootte-check meegevallen:** hele project = **28 MB** (daily 22 / audio 5,3 / x100 0,9), en **0 png-exports** gevonden in `daily/.../export/` → de oude "honderden MB png/mp4"-zorg is achterhaald (mp4 al gewist). Niks groots meer uit te sluiten. Klaar om te pushen na: git init + remote + minimale `.gitignore` (OS-rommel) — nog NIET gedaan (publiceren = expliciete go van Seb nodig).
- 2026-06-09 (GEPLAND): 🔍 Streng testen op **relevantie & impact van de lib**. Per collectie/concept kritisch nagaan: gebruikt het p5.waves écht betekenisvol (relevantie) en landt het visueel/conceptueel (impact), of is het vulling? Mogelijk de `/evaluate` (cc-evaluate) skill inzetten als kader. Uitkomst = punch-list wat blijft / aanscherpen / sneuvelt.
- 2026-06-08: ✅ AUDIO-TRACK VERVANGEN (deploy-blokker weg). Roni Size (commercieel, 7,1 MB) verwijderd; Seb plaatste rechtenvrije **brunk – Akoxylo** (`audio/sound/brunk_akoxylo.mp3`, 3,8 MB). Gewired in `shared/ui.js` (`tracks`-array, brunk eerst, `demo-loop.wav` blijft fallback) → alle 12 concepten. Proza bijgewerkt: RESEARCH.md + README 01 & 02; geen "Roni" meer in de map. Geverifieerd: brunk 200 op poort 80. CREDIT toegevoegd (footer p5.wavs-pagina + RESEARCH.md): "♪ brunk – Akoxylo · Creative Commons · brunk.be". brunk = goede vriend van Seb, hij brengt de maker zelf op de hoogte. Exacte CC-smaak (BY/BY-NC/…) nog te bevestigen via de maker; credit + bron-link staan er al.
- 2026-06-08: 🌐 ENGELSE VERSIE via NL/EN-toggle. Gedeelde `i18n.js` (root): dictionary `{nl,en}`, elk vertaalbaar element draagt `data-i18n="sleutel"` (attributen via `data-i18n-attr="placeholder:sleutel"`), toggle-knop `.lang-toggle` in elke nav, keuze in `localStorage 'pwx-lang'` → reist mee tussen pagina's/collecties. Default NL. Subpagina's laden `../i18n.js`. Toggle-stijl in `extended.css` (.lang-toggle). Bereik = chrome only: landing + styleguide + 3 kit-index'en (nav/hero/intro/kaarten/headers/zoek/filter/footer). **Geharmoniseerd & geverifieerd:** alle 5 pagina's 200 op poort 80, alle HTML-sleutels bestaan in dict, sleutels nl+en in balans. RESTPUNT: styleguide-BODY (spec-proza 00-12) bewust nog NL gelaten = coherent blok; alleen nav/toggle daar gewired. Collectie-content (94 daily-annotaties, 12 audio-concepten, sketch-data) blijft NL per scope. Nog te doen: laatste visuele klik-test door Seb (EN-knop) + evt. volledige styleguide-body-vertaling als aparte pas.
- 2026-06-08: 🗑️ Closing (onderzoek #3) VERWIJDERD - staat nu in de p5.waves-library zelf. Weg: `closing/`-map, platform-kaart in `index.html`, `closing:`-entry in `view.html`, boom + collectie-tabel (4→3) + architectuurtekst in cloud.md. Platform telt nu 3 collecties: X100, Daily, Audio.
- 2026-06-08: 🗑️ Alle 14 mp4-exports verwijderd (~340 MB vrij) uit `daily/.../export/`. Waren alleen renders, geen sketch-afhankelijkheid. Deploy-blokker (zware media) deels weg; resterende zware png-exports nog te filteren bij publiceren.
- 2026-06-08: ✅ MIJLPAAL - alle 4 onderzoeken geharmoniseerd & gebundeld. Platform-kaarten linken alle rechtstreeks intern; `view.html` is nergens meer in gebruik (kan verwijderd). Patroon consistent: volledige kopie + kit-index (#navbar/footer/zoek/#tags) + weg-terug-knop op alle deelpagina's, kunst/kleur behouden.
- 2026-06-08: X100 GEHARMONISEERD (onderzoek #4). Volledig gekopieerd (892 KB, geen zware media). `x100/index.html` = kit-launcher met 8 kaarten (Frame Library ★ + 7 versies) uit inline data, 30 #tag-chips. "← X100"-knop via gedeelde `back.js`, geïnjecteerd in de 7 versie-pagina's + library (8 bestanden, PowerShell-loop). Versie-sketches ONGEWIJZIGD (p5 1.11.3 + p5.waves v2.1.0 - werken, niet breken). Geverifieerd: launcher, v07 (draait, kleur behouden), library (114 frames).
- 2026-06-08: Closing GEHARMONISEERD (onderzoek #3). Andere vorm: 1 PoC + NOTES, dus een GUIDE-pagina i.p.v. kaarten-galerij. `closing/index.html` = kit-guide met `.guide-wrap`, embedt de live PoC via iframe (`poc.html`) en rendert de 10 NOTES-secties (tabellen als `.opts-table`, conclusie als `.callout`, oplossing als `.step-list`). #tags zijn anker-links naar secties. PoC-lib-src moest van `../p5.waves/` (bestaat niet in bundel) → CDN v3.3.0; `createWaveSampler` global + closing-groep draaien daar. Geverifieerd. Platform-kaart rechtstreeks.
- 2026-06-08: Audio GEHARMONISEERD (onderzoek #2). Volledig gekopieerd (8,5 MB, geluid mp3/wav = functioneel, behouden). Nieuwe `audio/index.html` = kit-index met 12 concepten uit inline data-array (geen manifest), #navbar + footer + filter-bar, 31 #tag-chips uit thema's. "← p5.wavs"-knop (woordgrap: waves zonder de e + .wav) via één edit in `shared/ui.js` (linksONDER - de audiobalk staat bovenaan). Platform-kaart linkt rechtstreeks. RESTPUNT: `audio/overzicht.html` (live 12-grid) is nog donker/roze; conceptpagina's behouden hun donkere instrument-chrome (= de kunst). Beide optioneel later.
- 2026-06-08: Daily nu VOLLEDIG gekopieerd (robocopy /XO, ~360 MB incl. 14 mp4 + png-exports) zodat het origineel `daily_p5.waves` later weg kan. /XO beschermde de geharmoniseerde `index.html` + bewerkte `shell.js` (nieuwer dan bron). **Bundel-policy vastgesteld:** elke collectie wordt VOLLEDIG gekopieerd (archief-compleet → origineel verwijderbaar). LET OP voor deploy: mp4/zware png zijn alleen exports, niet nodig om de sketches te draaien → bij publiceren uitsluiten (deploy-filter/.gitignore), anders is de site honderden MB's.
- 2026-06-08: Daily GEHARMONISEERD (onderzoek #1). Nieuwe `daily/index.html` is data-gedreven uit `campaign/manifest.json`: kit-`#navbar` + footer + filter-bar, 93 kaarten client-side gerenderd, #tags afgeleid uit moveFamily/primaryMove/mode. Cards sober B&W (styleguide-trouw). Platform-kaart linkt nu RECHTSTREEKS (`daily/index.html`), niet meer via view.html. **Architectuurpatroon vastgesteld:** geharmoniseerd onderzoek = eigen kit-`#navbar` met weg-terug → view.html-wrapper alleen nog voor niet-geharmoniseerde collecties.
- 2026-06-08: Daily sketch-pagina's hebben nu een vaste **"← Daily"-knop** - toegevoegd via één edit in `daily/campaign/shell.js` (de gedeelde runtime die alle 94 sketches laden). Zwevende chip linksboven, huisstijl, raakt de canvas-layout niet. RESTPUNT-light: de sketch-pagina's hebben verder nog hun eigen chrome (fonts/kleur), maar de weg-terug is opgelost.
- 2026-06-08: Server = **XAMPP Apache op poort 80** → site op `http://localhost/p5.waves_extended/`. (Mijn losse python-server op 8412 was alleen voor preview en stuurt geen no-cache; negeer of stop die.) `.htaccess` met no-cache headers toegevoegd in `p5.waves_extended/` (mod_headers) → geen stale CSS/JS meer tijdens bouwen, zonder herstart/process-kill. NIET aan XAMPP-processen komen.
- 2026-06-08: Styleguide §01 uitgebreid naar "Kleur & wave-banden": chrome-palet (B&W) + wave-palet (5 hero-kleuren: #174cff/#ff3b2f/#d7ff22/#ff4fb3/#00c7ff) + live contained banden-demo. Twee paletten strikt gescheiden.
- 2026-06-08: Extended-landing kreeg de levende wave-hero van de library (`hero.js`) - 4 grijze + 5 gekleurde shiftende banden, `Waves.createSampler`, p5@2.2.2 + p5.waves@v3.3.0 (CDN). Maakt het familie met de library én gebruikt p5.waves zelf.
- 2026-06-08: Platform opgezet met huisstijl, doorzoekbare collectie-grid (zoek + #tag-filter, client-side) en `view.html`-wrapper voor consistente terugnavigatie.
- 2026-06-08: Showcase (ultimate_showcase) bewust verwijderd - zit al in de library.
- 2026-06-08: Thuisbasis BESLIST → **p5waves.org**, met een link in de linker kolom.
- 2026-06-08: p5waves.org INGEZIEN - het is zélf een **iframe-launcher**: vaste linker-kolom `.rail` (280px) + grote `.stage` iframe. Rail-links zijn `<button class="rail-link" data-src="…">` die de iframe-`src` wisselen. Huidige 3 entries laden `seb-prjcts-be.github.io/{p5.waves, processing.waves, p5.waves_lab}/`. Rail-shell heeft een EIGEN stijl (IBM Plex Mono, rood accent #ff0000) - maar de iframe-INHOUD (docs-site) gebruikt de sobere B&W Oswald/Inter-stijl die wij al matchen. → **geen herontwerp nodig**; ons platform past als 4e sublocatie in het iframe.
- 2026-06-08: Integreren = één rail-`<li>` toevoegen aan p5waves.org met `data-src="https://seb-prjcts-be.github.io/p5.waves_extended/"`, `<span>p5.waves_extended</span>` + tag `extended`. p5waves.org zelf staat NIET lokaal in htdocs - snippet aan Seb gegeven; repo-locatie nog te vinden om het echt toe te voegen.
- 2026-06-08: DEPLOY-afhankelijkheid → platform moet als GitHub-Pages-repo live (`seb-prjcts-be.github.io/p5.waves_extended/`). De `../`-links in view.html (p5.wavesX100, daily_p5.waves, p5.wavs, closing) resolven dan naar `seb-prjcts-be.github.io/<repo>/` - werkt ALLEEN als die 4 ook als GH-Pages-repos gepubliceerd zijn. Te bevestigen.
- 2026-06-08: Open richtingvraag: diepere doorzoekbaarheid - per-thema tot op losse sketches met hún #trefwoorden, i.p.v. alleen op collectie-niveau.
