(() => {
  const FRAME = 1080;
  const SAFE = 100;
  const PAPER = '#f5f5f5';
  const PAPER_FIELD = '#f1f1f1';
  const INK = '#080808';
  const MUTED = '#5f5a52';
  const RULE = 'rgba(8, 8, 8, 0.16)';

  const meta = window.__P5WAVES_PROMO__;
  if (!meta) return;

  const root = document.getElementById('campaign-root');
  if (!root) return;

  document.body.classList.add('campaign-sketch');
  document.title = meta.pageTitle || meta.displayTitle;

  // ── p5.waves extended: vaste weg terug naar Daily (alle sketch-pagina's) ──
  (function addBackLink() {
    if (document.getElementById('px-back')) return;
    var a = document.createElement('a');
    a.id = 'px-back';
    a.href = '../index.html';
    a.textContent = '← Daily';
    a.setAttribute('aria-label', 'Terug naar Daily');
    var s = a.style;
    s.position = 'fixed'; s.top = '14px'; s.left = '14px'; s.zIndex = '9999';
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
  })();
  document.documentElement.style.setProperty('--accent', INK);
  document.documentElement.style.setProperty('--accent-soft', PAPER);
  document.documentElement.style.setProperty('--accent-strong', PAPER_FIELD);

  root.innerHTML = `
    <section class="campaign-shell">
      <div class="campaign-stage-shell">
        <div class="campaign-stage-frame">
          <div class="campaign-stage">
            <canvas class="campaign-stage-canvas" id="campaign-stage-canvas" width="1080" height="1080"></canvas>
            <div class="campaign-source-layer" aria-hidden="true">
              <div id="sketch">
                <div id="canvas-host"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="campaign-stage-caption">
          <div class="campaign-caption-main">
            <div class="campaign-caption-copy">${escapeHtml(meta.deck)}</div>
            <div class="campaign-caption-stamp">${escapeHtml(meta.stamp)}</div>
          </div>
          <div class="campaign-badges">
            ${(meta.badges || []).map((badge) => `<span class="campaign-badge">${escapeHtml(badge)}</span>`).join('')}
          </div>
        </div>
      </div>
    </section>
  `;

  const stageCanvas = document.getElementById('campaign-stage-canvas');
  const stageContext = stageCanvas.getContext('2d', { alpha: false });
  const canvasHost = document.getElementById('canvas-host');

  let sourceCanvas = null;

  adoptCanvases();

  const observer = new MutationObserver(() => {
    adoptCanvases();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('load', adoptCanvases, { once: true });
  window.addEventListener('beforeunload', () => observer.disconnect(), { once: true });

  requestAnimationFrame(renderLoop);

  function adoptCanvases() {
    const canvases = Array.from(document.querySelectorAll('canvas'));
    for (const canvas of canvases) {
      if (canvas === stageCanvas) continue;
      if (canvasHost.contains(canvas)) continue;
      canvasHost.appendChild(canvas);
    }

    sourceCanvas = canvasHost.querySelector('canvas');
  }

  function renderLoop() {
    renderComposite();
    requestAnimationFrame(renderLoop);
  }

  function renderComposite() {
    const bounds = normalizeBounds(meta.artBounds);
    const fit = fitArtwork(bounds);
    const motionTime = performance.now() * 0.001 * (meta.timeScale || 1.6);

    stageContext.save();
    stageContext.clearRect(0, 0, FRAME, FRAME);
    drawBackdrop(stageContext, motionTime);
    drawArtwork(stageContext, sourceCanvas, bounds, fit);
    drawBands(stageContext);
    stageContext.restore();
  }

  function drawBackdrop(ctx, motionTime) {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, FRAME, FRAME);

    ctx.fillStyle = PAPER_FIELD;
    ctx.fillRect(0, 0, FRAME, SAFE);
    ctx.fillRect(0, FRAME - SAFE, FRAME, SAFE);
    ctx.fillRect(0, SAFE, SAFE, FRAME - SAFE * 2);
    ctx.fillRect(FRAME - SAFE, SAFE, SAFE, FRAME - SAFE * 2);

    ctx.strokeStyle = RULE;
    ctx.lineWidth = 1;
    ctx.strokeRect(SAFE, SAFE, FRAME - SAFE * 2, FRAME - SAFE * 2);
    ctx.beginPath();
    ctx.moveTo(SAFE, SAFE);
    ctx.lineTo(FRAME - SAFE, SAFE);
    ctx.moveTo(SAFE, FRAME - SAFE);
    ctx.lineTo(FRAME - SAFE, FRAME - SAFE);
    ctx.stroke();
  }

  function drawArtwork(ctx, canvas, bounds, fit) {
    if (!canvas) return;
    const sourceWidth = canvas.width || FRAME;
    const sourceHeight = canvas.height || FRAME;
    if (!sourceWidth || !sourceHeight) return;

    const scaleX = sourceWidth / FRAME;
    const scaleY = sourceHeight / FRAME;
    const cropWidth = bounds.right - bounds.left;
    const cropHeight = bounds.bottom - bounds.top;

    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(
      canvas,
      bounds.left * scaleX,
      bounds.top * scaleY,
      cropWidth * scaleX,
      cropHeight * scaleY,
      fit.tx,
      fit.ty,
      cropWidth * fit.scale,
      cropHeight * fit.scale
    );
  }

  function drawBands(ctx) {
    const title = meta.canvasTitle || meta.titleCase || meta.displayTitle;
    const kicker = truncateToWidth(ctx, meta.kicker || 'p5.waves promo', 300, 12, '"IBM Plex Mono", monospace', '500');
    const stageLine = truncateToWidth(ctx, meta.stageLine || meta.settingsLine || '', 620, 11, '"IBM Plex Mono", monospace', '500');

    ctx.save();
    ctx.textBaseline = 'alphabetic';

    // top-right kicker (kept)
    ctx.fillStyle = INK;
    ctx.textAlign = 'right';
    ctx.font = '500 12px "IBM Plex Mono", monospace';
    ctx.fillText(kicker, FRAME - SAFE, 64);

    // bottom-left title + settings line (kept)
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    drawFittedText(ctx, title, SAFE, FRAME - 58, 660, 34, 22, '"Oswald", sans-serif', '500');

    ctx.fillStyle = MUTED;
    ctx.font = '500 11px "IBM Plex Mono", monospace';
    ctx.fillText(stageLine, SAFE, FRAME - 36);
    ctx.restore();
  }

  function drawFittedText(ctx, value, x, y, maxWidth, startSize, minSize, family, weight) {
    let size = startSize;
    while (size > minSize) {
      ctx.font = `${weight} ${size}px ${family}`;
      if (ctx.measureText(value).width <= maxWidth) break;
      size -= 1;
    }

    ctx.fillText(value, x, y);
  }

  function truncateToWidth(ctx, value, maxWidth, size, family, weight) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(value).width <= maxWidth) return value;

    const ellipsis = '...';
    let clipped = value;
    while (clipped.length > 1) {
      clipped = clipped.slice(0, -1).trimEnd();
      if (ctx.measureText(clipped + ellipsis).width <= maxWidth) {
        return clipped + ellipsis;
      }
    }

    return ellipsis;
  }

  function normalizeBounds(bounds) {
    const fallback = { left: 100, top: 100, right: 980, bottom: 980 };
    if (!bounds || typeof bounds !== 'object') return fallback;

    const left = clamp(Number(bounds.left), 0, FRAME);
    const top = clamp(Number(bounds.top), 0, FRAME);
    const right = clamp(Number(bounds.right), left + 1, FRAME);
    const bottom = clamp(Number(bounds.bottom), top + 1, FRAME);

    return { left, top, right, bottom };
  }

  function fitArtwork(bounds) {
    const fitBox = FRAME - SAFE * 2;
    const width = Math.max(1, bounds.right - bounds.left);
    const height = Math.max(1, bounds.bottom - bounds.top);
    const scale = Math.min(fitBox / width, fitBox / height);
    const fittedWidth = width * scale;
    const fittedHeight = height * scale;

    return {
      scale,
      tx: SAFE + (fitBox - fittedWidth) / 2,
      ty: SAFE + (fitBox - fittedHeight) / 2
    };
  }

  function clamp(value, min, max) {
    if (!Number.isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
