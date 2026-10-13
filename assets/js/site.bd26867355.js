(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var $ = function (s, n) { return (n || doc).querySelector(s); };
  var $$ = function (s, n) { return Array.prototype.slice.call((n || doc).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  var sheet = $('link[rel="stylesheet"][href*="assets/css/site."]');
  var SITE = sheet ? sheet.href.split('assets/css/site.')[0] : new URL('.', doc.baseURI).href;
  var fromRoot = function (p) { return SITE + String(p).split('/').filter(Boolean).join('/'); };
  window.__sdRoot = fromRoot;
  function trap(box, e) {
    if (e.key !== 'Tab') return;
    var items = $$(FOCUSABLE, box).filter(function (el) { return el.offsetParent !== null || el === doc.activeElement; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function setInert(on, except) {
    $$('body > *').forEach(function (el) { if (el === except || el.tagName === 'SCRIPT') return; if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
  }
  (function () {
    var gate = $('[data-gate]');
    if (!gate) return;
    var KEY = 'stashdash_preview_age';
    var passed = false;
    try { passed = localStorage.getItem(KEY) === '1'; } catch (e) {   }
    if (passed) { root.classList.add('age-ok'); return; }
    var box = $('#gate-agree', gate), yes = $('#gate-yes', gate), no = $('#gate-no', gate), err = $('#gate-error', gate);
    setInert(true, gate);
    (box || yes).focus({ preventScroll: true });
    gate.addEventListener('keydown', function (e) { trap(gate, e); });
    if (box) box.addEventListener('change', function () { err.hidden = true; box.removeAttribute('aria-invalid'); });
    yes.addEventListener('click', function (e) {
      e.preventDefault();
      if (box && !box.checked) { err.hidden = false; box.setAttribute('aria-invalid', 'true'); box.focus(); return; }
      try { localStorage.setItem(KEY, '1'); } catch (e2) {   }
      root.classList.add('age-ok');
      setInert(false);
      var main = $('#main');
      if (main) main.focus({ preventScroll: true });
    });
    yes.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); yes.click(); } });
    no.addEventListener('click', function (e) { e.preventDefault(); window.location.replace('about:blank'); });
  })();
  (function () {
    var dlg = $('#chooser');
    if (!dlg || typeof dlg.showModal !== 'function') return;
    var opener = null;
    doc.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-chooser]') : null;
      if (!t || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      e.preventDefault();
      opener = t;
      closeDrawer();
      dlg.showModal();
    });
    var close = $('[data-chooser-close]', dlg);
    if (close) close.addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { if (opener) opener.focus(); });
  })();
  var drawer = $('[data-drawer]'), drawerOpener = null;
  function closeDrawer() {
    if (!drawer || drawer.hidden) return;
    drawer.hidden = true;
    root.classList.remove('has-drawer');
    doc.body.style.overflow = '';
    $$('[data-drawer-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (drawerOpener) drawerOpener.focus();
  }
  function showPanel(id) {
    $$('[data-drawer-panel]', drawer).forEach(function (p) { var on = p.id === id; p.hidden = !on; p.classList.toggle('is-open', on); });
    var first = $('#' + id + ' ' + FOCUSABLE.split(',')[0] + ', #' + id + ' button', drawer);
    if (first) first.focus();
  }
  if (drawer) {
    $$('[data-drawer-open]').forEach(function (b) {
      b.setAttribute('role', 'button');
      b.addEventListener('click', function (e) {
        e.preventDefault();
        drawerOpener = b;
        drawer.hidden = false;
        b.setAttribute('aria-expanded', 'true');
        doc.body.style.overflow = 'hidden';
        showPanel('drawer-root');
        var c = $('[data-drawer-close]', drawer);
        if (c) c.focus();
      });
    });
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer || e.target.closest('[data-drawer-close]')) { closeDrawer(); return; }
      var push = e.target.closest('[data-drawer-push]');
      if (push) { showPanel(push.getAttribute('data-drawer-push')); return; }
      if (e.target.closest('[data-drawer-back]')) showPanel('drawer-root');
    });
    drawer.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); else trap(drawer, e); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1280) closeDrawer(); });
  }
  (function () {
    var nav = $('.nav');
    if (!nav) return;
    var items = $$('.nav__item.has-panel', nav);
    var isOpen = function (it) { return !it.classList.contains('is-shut') && (it.classList.contains('is-open') || it.matches(':hover')); };
    function sync() { items.forEach(function (it) { var b = $('[data-panel]', it); if (b) b.setAttribute('aria-expanded', String(isOpen(it))); }); }
    function closeAll(except) { items.forEach(function (it) { if (it !== except) it.classList.remove('is-open'); }); sync(); }
    items.forEach(function (it) {
      var btn = $('[data-panel]', it);
      it.addEventListener('mouseenter', sync);
      it.addEventListener('mouseleave', function () { it.classList.remove('is-open'); it.classList.remove('is-shut'); sync(); });
      if (btn) btn.addEventListener('click', function () {
        var on = !isOpen(it);
        closeAll(it);
        it.classList.toggle('is-open', on);
        it.classList.toggle('is-shut', !on);
        sync();
      });
      it.addEventListener('focusout', function () { setTimeout(function () { if (!it.contains(doc.activeElement)) { it.classList.remove('is-open'); sync(); } }, 0); });
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = items.filter(isOpen)[0];
      if (!open) return;
      var inside = open.contains(doc.activeElement);
      open.classList.remove('is-open');
      open.classList.add('is-shut');
      sync();
      var btn = $('[data-panel]', open);
      if (inside && btn) btn.focus();
    });
    doc.addEventListener('click', function (e) { if (!e.target.closest('.nav__item.has-panel')) closeAll(); });
  })();
  (function () {
    var h = $('[data-header]');
    if (!h) return;
    var on = function () { h.classList.toggle('is-stuck', window.scrollY > 24); };
    window.addEventListener('scroll', on, { passive: true });
    on();
  })();
  (function () {
    var heroes = $$('.hero--home, .hero');
    requestAnimationFrame(function () { heroes.forEach(function (h) { h.classList.add('is-ready'); }); doc.body.classList.add('is-ready'); });
    var els = $$('.rv');
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  })();
  $$('[data-rail]').forEach(function (rail) {
    var track = $('.rail__track', rail), prev = $('[data-rail-prev]', rail), next = $('[data-rail-next]', rail);
    if (!track || !prev || !next) return;
    var step = function () { return Math.max(240, Math.round(track.clientWidth * 0.8)); };
    var state = function () {
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
      var none = max <= 0;
      prev.parentNode.hidden = none;
    };
    prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', state, { passive: true });
    window.addEventListener('resize', state);
    state();
  });
  $$('[data-filter]').forEach(function (filter) {
    var scope = filter.closest('.band') || doc;
    var chips = $$('[data-strain]', filter), clear = $('[data-filter-clear]', filter), count = $('[data-filter-count]', filter);
    var cards = $$('.pcard', scope), groups = $$('[data-group]', scope);
    var total = cards.length;
    function apply() {
      var on = chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; }).map(function (c) { return c.getAttribute('data-strain'); });
      var shown = 0;
      cards.forEach(function (card) {
        var keep = !on.length || on.indexOf(card.getAttribute('data-strain') || '') >= 0;
        if (keep && card.classList.contains('is-off')) { card.classList.add('is-back'); setTimeout(function () { card.classList.remove('is-back'); }, 400); }
        card.classList.toggle('is-off', !keep);
        if (keep) shown++;
      });
      groups.forEach(function (g) {
        var left = $$('.pcard:not(.is-off)', g).length;
        g.classList.toggle('is-empty', !left);
        var n = $('.group__n', g);
        if (n) { if (!n.hasAttribute('data-all')) n.setAttribute('data-all', n.textContent); n.textContent = on.length ? String(left) : n.getAttribute('data-all'); }
      });
      if (clear) clear.hidden = !on.length;
      if (count) count.textContent = shown + ' / ' + total;
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true')); apply(); }); });
    if (clear) clear.addEventListener('click', function () { chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); }); apply(); chips[0].focus(); });
    var asked = '';
    try { asked = (new URLSearchParams(location.search).get('strain') || '').toLowerCase(); } catch (e) { asked = ''; }
    var chosen = asked ? chips.filter(function (c) { return c.getAttribute('data-strain') === asked; })[0] : null;
    if (chosen) { chosen.setAttribute('aria-pressed', 'true'); apply(); }
  });
  (function () {
    var loops = $$('[data-loop]');
    if (!loops.length || reduce) return;
    var conn = navigator.connection || {};
    if (conn.saveData) return;
    var start = function (box) {
      if (box._started) return;
      box._started = true;
      var small = box.getAttribute('data-loop-small');
      var src = small && window.innerWidth < 800 ? small : box.getAttribute('data-loop');
      var v = doc.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = 'auto';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true'); v.tabIndex = -1;
      v.disablePictureInPicture = true;
      v.addEventListener('playing', function () { box.classList.add('is-playing'); }, { once: true });
      v.src = fromRoot(src);
      box.appendChild(v);
      var p = v.play();
      if (p && p.catch) p.catch(function () {   });
    };
    if (!('IntersectionObserver' in window)) { loops.forEach(start); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target.querySelector('video');
        if (en.isIntersecting) { if (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else start(en.target); }
        else if (v) v.pause();
      });
    }, { rootMargin: '120px' });
    loops.forEach(function (l) { io.observe(l); });
  })();
  var under = function (im) { return im && im.tagName === 'IMG' && im.closest('.seal') && im.closest('.seal').querySelector('.seal__under'); };
  document.addEventListener('error', function (e) { if (under(e.target)) e.target.hidden = true; }, true);
  Array.prototype.forEach.call(document.querySelectorAll('.seal img'), function (im) { if (under(im) && im.loading !== 'lazy' && im.complete && !im.naturalWidth) im.hidden = true; });
})();
(function () {
  'use strict';
  var box = document.querySelector('[data-search-results]');
  if (!box) return;
  var link = document.getElementById('search-index');
  var status = document.querySelector('[data-search-status]');
  var input = document.getElementById('sq');
  var idle = document.querySelector('[data-search-idle]');
  var fromRoot = window.__sdRoot || function (p) { return p; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var fold = function (s) { return String(s || '').toLowerCase().normalize('NFKD').replace(/\p{M}/gu, ''); };
  var SMALL = { and: 1, the: 1, of: 1, a: 1, an: 1, 'for': 1, 'with': 1, 'in': 1 };
  var norm = function (w) {
    w = w.replace(/[^a-z0-9]+/g, '');
    if (w.length > 4 && /ies$/.test(w)) w = w.slice(0, -3) + 'y';
    else if (w.length > 4 && /(ch|sh|x|s)es$/.test(w)) w = w.slice(0, -2);
    else if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) w = w.slice(0, -1);
    return w.replace(/(.)\1+/g, '$1');
  };
  var APOS = new RegExp("['" + String.fromCharCode(0x2019) + "]", "g");
  var wordsOf = function (s) { return fold(s).replace(APOS, "").split(/[^a-z0-9]+/).filter(Boolean).map(norm).filter(Boolean); };
  var q = new URLSearchParams(location.search).get('q') || '';
  if (input) input.value = q;
  var index = null;
  function prepare(e) {
    var name = wordsOf(e.t), rest = wordsOf([e.b, e.c, e.y, e.s, e.a].join(' '));
    var all = name.concat(rest), set = {}, i;
    for (i = 0; i < all.length; i++) { set[all[i]] = 1; if (i + 1 < all.length) set[all[i] + all[i + 1]] = 1; }
    var nameSet = {};
    for (i = 0; i < name.length; i++) { nameSet[name[i]] = 1; if (i + 1 < name.length) nameSet[name[i] + name[i + 1]] = 1; }
    return { words: Object.keys(set), set: set, name: nameSet, run: all.join('') };
  }
  function found(w, h) {
    if (h.set[w]) return h.name[w] ? 6 : 4;
    var best = 0, i, x;
    for (i = 0; i < h.words.length; i++) {
      x = h.words[i];
      if (x.length >= 3 && w.length >= 3 && x.indexOf(w) === 0) best = Math.max(best, 3);
      else if (x.length >= 4 && w.indexOf(x) === 0) best = Math.max(best, 2);
    }
    if (!best && w.length >= 4 && h.run.indexOf(w) >= 0) best = 1;
    return best;
  }
  function card(e) {
    if (e.k === 'p') {
      return '<article class="pcard"><a class="pcard__link" href="' + esc(fromRoot(e.u)) + '">'
        + '<span class="pcard__plate">' + (e.i ? '<img src="' + esc(fromRoot(e.i)) + '" alt="' + esc(e.a || '') + '" width="220" height="220" loading="lazy" decoding="async">' : '<span class="pcard__blank" aria-hidden="true"></span>') + '</span>'
        + '<span class="pcard__tags">' + (e.s ? '<span class="pill pill--' + esc(e.s.toLowerCase()) + '">' + esc(e.s) + '</span>' : '') + (e.d ? '<span class="pill pill--sale">' + esc(e.d) + '</span>' : '') + '</span>'
        + '<span class="pcard__body">' + (e.b ? '<span class="pcard__brand">' + esc(e.b) + '</span>' : '') + '<h2 class="pcard__name">' + esc(e.t) + '</h2>' + (e.y ? '<span class="pcard__type">' + esc(e.y) + '</span>' : '')
        + (e.w ? '<span class="pcard__facts"><span>' + esc(e.w) + '</span></span>' : '')
        + (e.p ? '<span class="price"><span class="price__now">' + esc(e.p) + '</span>' + (e.o ? ' <s class="price__was">' + esc(e.o) + '</s>' : '') + (box.getAttribute('data-tax') ? ' <span class="price__tax">' + esc(box.getAttribute('data-tax')) + '</span>' : '') + '</span>' : '')
        + '</span></a></article>';
    }
    return '<a class="btile btile--hit" href="' + esc(fromRoot(e.u)) + '"><span class="seal" aria-hidden="true">' + esc((e.t || '?').slice(0, 1)) + '</span><h2 class="btile__name">' + esc(e.t) + '</h2></a>';
  }
  function run() {
    var words = wordsOf(q).filter(function (w) { return !SMALL[w]; });
    if (!words.length) words = wordsOf(q);
    if (!words.length) { box.innerHTML = ''; if (status) status.textContent = ''; if (idle) idle.hidden = false; return; }
    var every = [], some = [];
    for (var i = 0; i < index.length; i++) {
      var e = index[i], h = e._h || (e._h = prepare(e));
      var score = 0, hit = 0;
      for (var w = 0; w < words.length; w++) { var f = found(words[w], h); if (f) { hit++; score += f; } }
      if (!hit) continue;
      score += (e.k === 'b' ? 3 : 0) + (e.k === 'g' ? 1 : 0);
      (hit === words.length ? every : some).push({ e: e, score: score + hit * 10 });
    }
    var hits = every.length ? every : some;
    hits.sort(function (a, b) { return b.score - a.score; });
    box.innerHTML = hits.slice(0, 120).map(function (x) { return card(x.e); }).join('');
    if (status) status.textContent = hits.length ? hits.length + ' ' + box.getAttribute(hits.length === 1 ? 'data-count-one' : 'data-count') : box.getAttribute('data-none');
    if (idle) idle.hidden = hits.length > 0;
  }
  if (!link) return;
  fetch(link.href).then(function (r) { return r.json(); }).then(function (data) { index = data; run(); }).catch(function () { if (status) status.textContent = box.getAttribute('data-none'); });
  var form = input && input.form;
  if (form) form.addEventListener('submit', function (e) {
    if (!index) return;
    e.preventDefault();
    q = input.value;
    history.replaceState(null, '', location.pathname + (q ? '?q=' + encodeURIComponent(q) : ''));
    run();
  });
})();
