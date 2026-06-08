(() => {
  const meta = window.__P5WAVES_PROMO__;
  if (!meta || window.__P5WAVES_MILLIS_PATCHED__) return;
  if (!window.p5 || !window.p5.prototype || typeof window.p5.prototype.millis !== 'function') return;

  const scale = Number(meta.timeScale) || 1.6;
  const originalMillis = window.p5.prototype.millis;

  window.p5.prototype.millis = function promoMillis(...args) {
    const value = originalMillis.apply(this, args);
    return value * scale;
  };

  window.__P5WAVES_MILLIS_PATCHED__ = true;
  window.__P5WAVES_TIME_SCALE__ = scale;
})();
