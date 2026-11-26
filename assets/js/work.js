(function () {
  var DATA = window.WORKS || {};
  var PAGE = 24;
  var TAB_ORDER = {
    web: ['UIUX 리뉴얼', '실서버 반영 시안', '제안시안', '개인작업'],
    promo: ['모바일', 'PC'],
    ad: ['골프', '공기관', '기타']
  };
  var LABEL = { promo: '기획전', ai: 'AI 이미지', ad: '광고' };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // ---------- Lightbox ----------
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  var lbList = [], lbIndex = 0, lastFocus = null;
  function lbShow(i) {
    lbIndex = (i + lbList.length) % lbList.length;
    var it = lbList[lbIndex];
    lbImg.src = it.full || it.thumb;
    lbImg.alt = it.alt;
    lb.scrollTop = 0;
  }
  function lbOpen(list, i) {
    lastFocus = document.activeElement;
    lbList = list; lb.setAttribute('open', ''); document.body.style.overflow = 'hidden';
    lbShow(i); lb.querySelector('.lb-close').focus();
  }
  function lbClose() {
    lb.removeAttribute('open'); document.body.style.overflow = ''; lbImg.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }
  lb.querySelector('.lb-close').addEventListener('click', lbClose);
  lb.querySelector('.lb-prev').addEventListener('click', function () { lbShow(lbIndex - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { lbShow(lbIndex + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') lbClose();
    else if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
    else if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
  });

  // ---------- Sections ----------
  document.querySelectorAll('.work-section').forEach(function (sec) {
    var cat = sec.getAttribute('data-cat');
    var items = DATA[cat] || [];
    var tabsBox = sec.querySelector('.subtabs');
    var grid = sec.querySelector('.gallery');
    var countEl = sec.querySelector('.count');
    var moreWrap = sec.querySelector('.more-wrap');
    var state = { tab: 'All', shown: PAGE };

    var tabs = (TAB_ORDER[cat] || []).filter(function (t) {
      return items.some(function (it) { return it.tab === t; });
    });
    if (tabs.length) {
      ['All'].concat(tabs).forEach(function (t) {
        var n = t === 'All' ? items.length : items.filter(function (it) { return it.tab === t; }).length;
        var b = el('button', 'filter', t + ' ');
        b.appendChild(el('sup', null, String(n)));
        b.type = 'button';
        b.setAttribute('aria-pressed', String(t === 'All'));
        b.addEventListener('click', function () {
          state.tab = t; state.shown = PAGE;
          tabsBox.querySelectorAll('.filter').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          render();
        });
        tabsBox.appendChild(b);
      });
    } else {
      tabsBox.remove();
    }

    function tile(it, i, list) {
      var isWeb = cat === 'web';
      var t;
      if (isWeb && it.link) {
        t = el('a', 'tile');
        t.href = it.link; t.target = '_blank'; t.rel = 'noopener';
      } else {
        t = el('button', 'tile' + (isWeb ? '' : ' tall'));
        t.type = 'button';
        t.addEventListener('click', function () { lbOpen(list, i); });
      }
      var ph = el('div', 'ph');
      var img = el('img');
      img.src = it.thumb; img.loading = 'lazy'; img.decoding = 'async';
      img.alt = it.alt;
      ph.appendChild(img);
      ph.appendChild(el('span', 'tag', (it.id || '').toUpperCase() + (it.tab ? ' · ' + it.tab : '')));
      t.appendChild(ph);
      if (isWeb) {
        var meta = el('div', 'meta');
        meta.appendChild(el('b', null, it.title || '웹사이트 작업'));
        var host = '';
        if (it.link) {
          host = /figma\.com/.test(it.link) ? 'Figma 프로토타입 열기 ↗'
            : /creatorlink\.net/.test(it.link) ? '상세 시안 보기 ↗' : '라이브 사이트 ↗';
        }
        if (host) meta.appendChild(el('small', null, host));
        t.appendChild(meta);
      } else {
        t.setAttribute('aria-label', it.alt + ' 크게 보기');
      }
      return t;
    }

    function render() {
      var list = state.tab === 'All' ? items : items.filter(function (it) { return it.tab === state.tab; });
      list = list.map(function (it, i) {
        return Object.assign({}, it, { alt: it.title || ((LABEL[cat] || '') + ' 작업 ' + (i + 1)) });
      });
      grid.innerHTML = '';
      var frag = document.createDocumentFragment();
      list.slice(0, state.shown).forEach(function (it, i) { frag.appendChild(tile(it, i, list)); });
      grid.appendChild(frag);
      countEl.textContent = Math.min(state.shown, list.length) + ' / ' + list.length + ' projects';
      moreWrap.innerHTML = '';
      if (state.shown < list.length) {
        var more = el('button', 'more', '더보기 (' + Math.min(state.shown, list.length) + ' / ' + list.length + ')');
        more.type = 'button';
        more.addEventListener('click', function () { state.shown += PAGE; render(); });
        moreWrap.appendChild(more);
      }
    }
    render();
  });

  // ---------- Top filters ----------
  var filters = document.querySelectorAll('.filters .filter');
  function applyFilter(f) {
    filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === f)); });
    document.querySelectorAll('.work-section').forEach(function (s) {
      s.hidden = !(f === 'all' || s.getAttribute('data-cat') === f);
    });
  }
  filters.forEach(function (b) {
    b.addEventListener('click', function () { applyFilter(b.getAttribute('data-filter')); });
  });
  // Deep link from index (work.html#promo): show that section only
  var hash = location.hash.replace('#', '');
  if (DATA[hash]) {
    applyFilter(hash);
    var target = document.getElementById(hash);
    if (target) setTimeout(function () { target.scrollIntoView(); }, 0);
  }
})();
