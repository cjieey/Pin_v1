/* Pin. home page: the hands-on demos and the scroll-linked motion. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var setPressed = function (group, active) {
    group.querySelectorAll('[aria-pressed]').forEach(function (el) {
      el.setAttribute('aria-pressed', el === active ? 'true' : 'false');
    });
  };

  /* ---- frames ---- */
  var FRAMES = [['none', 'No frame'], ['polaroid', 'Polaroid'], ['taped', 'Taped'], ['film', 'Film'], ['dashed', 'Dashed border'], ['outline', 'Outline'], ['circle', 'Circle']];
  var frameDemo = document.getElementById('frame-demo');
  var frameChips = document.getElementById('frame-chips');
  FRAMES.forEach(function (f) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = f[1];
    b.setAttribute('aria-pressed', f[0] === 'polaroid' ? 'true' : 'false');
    b.addEventListener('click', function () {
      frameDemo.setAttribute('data-f', f[0]);
      setPressed(frameChips, b);
    });
    frameChips.appendChild(b);
  });

  /* ---- cut-out before / after ---- */
  var compare = document.getElementById('compare');
  var range = document.getElementById('cut-range');
  var userMoved = false;
  function setWipe(v) { compare.style.setProperty('--w', v + '%'); range.value = Math.round(v); }
  range.addEventListener('input', function () { userMoved = true; setWipe(Number(range.value)); });
  function dragAt(x) { var r = compare.getBoundingClientRect(); userMoved = true; setWipe(clamp((x - r.left) / r.width * 100, 0, 100)); }
  var dragging = false;
  compare.addEventListener('pointerdown', function (e) { dragging = true; dragAt(e.clientX); });
  window.addEventListener('pointermove', function (e) { if (dragging) dragAt(e.clientX); });
  window.addEventListener('pointerup', function () { dragging = false; });

  var ring = function (c, w) { return ['drop-shadow(' + w + 'px 0 0 ' + c + ')', 'drop-shadow(-' + w + 'px 0 0 ' + c + ')', 'drop-shadow(0 ' + w + 'px 0 ' + c + ')', 'drop-shadow(0 -' + w + 'px 0 ' + c + ')'].join(' '); };
  var OUTLINES = [
    ['None', 'none'],
    ['White', ring('#FFFFFF', 4) + ' drop-shadow(0 8px 10px rgba(0,0,0,.25))'],
    ['Neon', ring('#B6F23B', 4) + ' drop-shadow(0 0 10px rgba(182,242,59,.8))'],
    ['Ink', ring('#FFFFFF', 3) + ' ' + ring('#1F1A19', 2)],
    ['Shadow', 'drop-shadow(10px 12px 0 rgba(201,58,71,.55))']
  ];
  var outlineChips = document.getElementById('outline-chips');
  OUTLINES.forEach(function (o, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = o[0];
    b.setAttribute('aria-pressed', i === 1 ? 'true' : 'false');
    b.addEventListener('click', function () {
      compare.style.setProperty('--outline-filter', o[1]);
      setPressed(outlineChips, b);
      if (!userMoved) { userMoved = true; setWipe(12); }
    });
    outlineChips.appendChild(b);
  });
  compare.style.setProperty('--outline-filter', OUTLINES[1][1]);

  /* ---- fonts ---- */
  // Great Vibes, Archivo Black and Caveat are self-hosted (site.css). The
  // others only load once the Fonts section is close, to keep the first
  // visit fast.
  var LAZY_FONTS = 'https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Pacifico&family=Playfair+Display:ital,wght@1,700&family=Abril+Fatface&family=Fredoka:wght@600&family=Permanent+Marker&family=Anton&family=Bebas+Neue&family=Righteous&display=swap';
  var fontsRequested = false;
  function loadDemoFonts() {
    if (fontsRequested) return;
    fontsRequested = true;
    var l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = LAZY_FONTS;
    document.head.appendChild(l);
  }
  var fontsSection = document.getElementById('fonts');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { loadDemoFonts(); io.disconnect(); }
    }, { rootMargin: '600px 0px' });
    io.observe(fontsSection);
  } else {
    loadDemoFonts();
  }

  var FONTS = [
    ['Great Vibes', "'Great Vibes', cursive", 'Script'],
    ['Pinyon Script', "'Pinyon Script', cursive", 'Script'],
    ['Pacifico', "'Pacifico', cursive", 'Script'],
    ['Playfair Display', "'Playfair Display', serif", 'Serif'],
    ['Abril Fatface', "'Abril Fatface', serif", 'Serif'],
    ['Archivo Black', "'Archivo Black', sans-serif", 'Display'],
    ['Fredoka', "'Fredoka', sans-serif", 'Display'],
    ['Caveat', "'Caveat', cursive", 'Handwritten'],
    ['Permanent Marker', "'Permanent Marker', cursive", 'Handwritten'],
    ['Anton', "'Anton', sans-serif", 'Condensed'],
    ['Bebas Neue', "'Bebas Neue', sans-serif", 'Condensed'],
    ['Righteous', "'Righteous', sans-serif", 'Retro']
  ];
  var fontGrid = document.getElementById('font-grid');
  var fontOut = document.getElementById('font-out');
  var fontText = document.getElementById('font-text');
  var samples = [];
  FONTS.forEach(function (f, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'font-btn';
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    var s = document.createElement('span'); s.className = 's'; s.style.fontFamily = f[1];
    if (f[0] === 'Playfair Display') s.style.fontStyle = 'italic';
    var n = document.createElement('span'); n.className = 'n'; n.textContent = f[0] + ' · ' + f[2];
    b.appendChild(s); b.appendChild(n); samples.push(s);
    b.addEventListener('click', function () {
      fontOut.style.fontFamily = f[1];
      fontOut.style.fontStyle = f[0] === 'Playfair Display' ? 'italic' : 'normal';
      setPressed(fontGrid, b);
    });
    fontGrid.appendChild(b);
  });
  function syncText() {
    var t = fontText.value.trim() || 'a Timeless Place';
    fontOut.textContent = t;
    samples.forEach(function (s) { s.textContent = t; });
  }
  fontText.addEventListener('input', syncText);
  syncText();

  /* ---- layers ---- */
  var LAYERS = [
    [5, 'Text', 'Today DUMP!, Forest Road'],
    [4, 'Sticker', 'Couple cut-out'],
    [3, 'Photo', 'hand in hand'],
    [2, 'Photo', 'into the woods'],
    [1, 'Photo', 'the whole fam'],
    [0, 'Background', 'Grid paper']
  ];
  var planes = document.querySelectorAll('#stack .plane');
  var list = document.getElementById('layer-list');
  var eye = '<svg class="eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g class="open"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></g><g class="shut"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2"/><path d="M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/></g></svg>';
  LAYERS.forEach(function (l) {
    var name = l[1] === 'Background' ? 'Background' : l[1] + ': ' + l[2];
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'layer-btn'; b.setAttribute('aria-pressed', 'true');
    b.setAttribute('aria-label', name + ', visible. Tap to hide');
    b.innerHTML = eye + '<span>' + l[1] + '</span><span class="k">' + l[2] + '</span>';
    var plane = planes[l[0]];
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') === 'true';
      b.setAttribute('aria-pressed', on ? 'false' : 'true');
      b.setAttribute('aria-label', name + (on ? ', hidden. Tap to show' : ', visible. Tap to hide'));
      plane.classList.toggle('off', on);
    });
    var hi = function (v) { return function () { plane.classList.toggle('on', v); }; };
    b.addEventListener('mouseenter', hi(true)); b.addEventListener('mouseleave', hi(false));
    b.addEventListener('focus', hi(true)); b.addEventListener('blur', hi(false));
    li.appendChild(b); list.appendChild(li);
  });

  /* ---- scroll-linked motion ---- */
  var hero = document.querySelector('.hero');
  var layers = document.getElementById('layers');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var vh = window.innerHeight;
    var hp = clamp(window.scrollY / (Math.max(hero.offsetHeight, 400) * 0.55), 0, 1);
    hero.style.setProperty('--p', (1 - Math.pow(1 - hp, 3)).toFixed(4));

    var r = layers.getBoundingClientRect();
    var span = r.height - vh;
    var lp = span > 0 ? clamp((-r.top) / span / 0.75, 0, 1) : 1;
    layers.style.setProperty('--lp', (1 - Math.pow(1 - lp, 2)).toFixed(4));

    if (!userMoved) {
      var cr = compare.getBoundingClientRect();
      var cp = clamp((vh - cr.top) / (vh + cr.height * 0.4), 0, 1);
      setWipe(clamp(90 - cp * 80, 8, 90));
    }
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  if (reduce) {
    hero.style.setProperty('--p', '1');
    layers.style.setProperty('--lp', '1');
  } else {
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    onScroll();
  }
})();
