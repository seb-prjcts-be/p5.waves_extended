/* shared/ui.js — gedeelde audiobedieningsbalk voor alle concepten.
 *
 * Maakt de knoppen (♪ Nummer / ▶ Synth / 🎤 Mic) aan, koppelt ze aan een
 * WaveAudio-instance en regelt de track-fallback (mp3 → demo-loop.wav).
 *
 * Gebruik in een sketch:
 *   let audio, ctl;
 *   function setup() {
 *     createCanvas(windowWidth, windowHeight);
 *     audio = new WaveAudio({ fftSize: 1024 });
 *     ctl = createAudioControls(audio);     // bouwt de balk
 *   }
 *   function draw() { if (ctl.started()) audio.update(); ... }
 */
/* p5.waves extended: vaste weg terug naar de Audio-index (alle conceptpagina's). */
(function addBackLink() {
  if (typeof document === 'undefined') return;
  function mount() {
    if (document.getElementById('px-back')) return;
    var a = document.createElement('a');
    a.id = 'px-back';
    a.href = '../../index.html';
    a.textContent = '← p5.wavs';
    a.setAttribute('aria-label', 'Terug naar p5.wavs');
    a.title = 'p5.wavs — waves zonder de e, .wav mét het geluid';
    var s = a.style;
    // linksONDER: de audiobalk staat bovenaan, dus blijf daar weg
    s.position = 'fixed'; s.bottom = '14px'; s.left = '14px'; s.zIndex = '99999';
    s.font = "500 12px/1 'Oswald', sans-serif";
    s.letterSpacing = '0.1em'; s.textTransform = 'uppercase';
    s.textDecoration = 'none'; s.color = '#111';
    s.background = 'rgba(245, 245, 245, 0.92)';
    s.border = '1px solid rgba(0, 0, 0, 0.7)';
    s.padding = '8px 12px';
    s.backdropFilter = 'blur(6px)';
    a.addEventListener('mouseenter', function () { s.background = '#000'; s.color = '#fff'; });
    a.addEventListener('mouseleave', function () { s.background = 'rgba(245, 245, 245, 0.92)'; s.color = '#111'; });
    document.body.appendChild(a);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();

function createAudioControls(audio, opts = {}) {
  const tracks = opts.tracks || [
    '../../sound/brunk_akoxylo.mp3',     // brunk — Akoxylo (rechtenvrij / Creative Commons)
    '../../sound/demo-loop.wav',         // fallback: zelf gegenereerde loop
  ];

  let bar = document.getElementById('ui');
  if (!bar) { bar = document.createElement('div'); bar.id = 'ui'; document.body.appendChild(bar); }
  bar.innerHTML =
    '<button data-a="track">♪ Nummer</button>' +
    '<button data-a="synth">▶ Synth</button>' +
    '<button data-a="mic">🎤 Mic</button>' +
    '<span id="status">— kies een bron —</span>';
  const status = bar.querySelector('#status');

  let started = false;
  const once = (fn) => async () => {
    if (started) return;
    try { await fn(); started = true; }
    catch (e) { status.textContent = 'fout: ' + (e.message || e); }
  };

  bar.querySelector('[data-a=track]').onclick = once(async () => {
    for (const url of tracks) {
      const ok = await fetch(url, { method: 'HEAD' }).then(r => r.ok).catch(() => false);
      if (ok) { await audio.useFile(url); status.textContent = '♪ ' + url.split('/').pop(); return; }
    }
    throw new Error('geen audiobestand gevonden');
  });
  bar.querySelector('[data-a=synth]').onclick =
    once(async () => { await audio.useSynth(); status.textContent = '▶ synth-demo'; });
  bar.querySelector('[data-a=mic]').onclick =
    once(async () => { await audio.useMic(); status.textContent = '🎤 microfoon'; });

  // ?demo in de URL → start meteen de geluidloze gesimuleerde bron (overzichtspagina)
  if (new URLSearchParams(location.search).has('demo')) {
    audio.useSimulated(); started = true;
    status.textContent = '▱ demo (gesimuleerd)';
  }

  return { started: () => started, status };
}
window.createAudioControls = createAudioControls;
