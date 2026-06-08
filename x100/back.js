/* p5.waves extended: vaste weg terug naar de X100-launcher (alle versie- en library-pagina's). */
(function () {
  function mount() {
    if (document.getElementById('px-back')) return;
    var a = document.createElement('a');
    a.id = 'px-back';
    a.href = '../index.html';
    a.textContent = '← X100';
    a.setAttribute('aria-label', 'Terug naar X100');
    var s = a.style;
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
