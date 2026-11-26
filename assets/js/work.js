(function () {
  var RAW = window.WORKS || {};
  // 광고·배너 = 기획전(promo) + 광고(ad). 기획전은 하나의 세부 탭으로 묶어요.
  var DATA = {
    web: RAW.web || [],
    ad: (RAW.promo || []).map(function (it) { return Object.assign({}, it, { tab: '기획전', kind: '기획전' }); })
      .concat((RAW.ad || []).map(function (it) { return Object.assign({}, it, { kind: '광고' }); })),
    ai: RAW.ai || []
  };
  // Old deep links from index.html (work.html#promo) land on the 기획전 tab.
  var HASH_ALIAS = { promo: { cat: 'ad', tab: '기획전' } };
  var PAGE = 24;
  var TAB_ORDER = {
    web: ['UIUX 리뉴얼', '앱 디자인', '실서버 반영 시안', '제안시안', '개인작업'],
    ad: ['기획전', '골프', '공기관', '기타']
  };
  var LABEL = { ai: 'AI 이미지', ad: '광고' };

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
        var b = el('button', 'filter', t);
        b.appendChild(el('sup', null, String(n)));
        b.type = 'button';
        b.setAttribute('data-tab', t);
        b.setAttribute('aria-pressed', String(t === 'All'));
        b.addEventListener('click', function () { selectTab(t); });
        tabsBox.appendChild(b);
      });
    } else {
      tabsBox.remove();
    }

    function selectTab(t) {
      state.tab = t; state.shown = PAGE;
      tabsBox.querySelectorAll('.filter').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-tab') === t)); });
      render();
    }
    sec.selectTab = selectTab;

    function tile(it, i, list) {
      var isWeb = cat === 'web';
      var t;
      if (isWeb && it.link) {
        t = el('a', 'tile');
        // App items open the store that matches the visitor's device.
        t.href = (it.link_android && /Android/i.test(navigator.userAgent)) ? it.link_android : it.link;
        t.target = '_blank'; t.rel = 'noopener';
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
      if (it.tab) ph.appendChild(el('span', 'tag', it.tab));
      t.appendChild(ph);
      if (isWeb) {
        var meta = el('div', 'meta');
        meta.appendChild(el('b', null, it.title || '웹사이트 작업'));
        var host = '';
        if (it.link) {
          host = it.link_android ? '앱스토어 · 구글플레이 ↗'
            : /figma\.com\/design/.test(it.link) ? 'Figma 디자인 보기 ↗'
            : /figma\.com/.test(it.link) ? 'Figma 프로토타입 열기 ↗'
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
        return Object.assign({}, it, { alt: it.title || ((it.kind || LABEL[cat] || '') + ' 작업 ' + (i + 1)) });
      });
      grid.innerHTML = '';
      var frag = document.createDocumentFragment();
      list.slice(0, state.shown).forEach(function (it, i) { frag.appendChild(tile(it, i, list)); });
      grid.appendChild(frag);
      countEl.textContent = Math.min(state.shown, list.length) + ' / ' + list.length + ' projects';
      moreWrap.innerHTML = '';
      if (state.shown < list.length) {
        var more = el('button', 'btn btn-ghost', '더보기 (' + Math.min(state.shown, list.length) + ' / ' + list.length + ')');
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
  // Deep link from index (work.html#ad, #promo): show that section only
  var hash = location.hash.replace('#', '');
  var alias = HASH_ALIAS[hash];
  var cat = alias ? alias.cat : hash;
  if (DATA[cat]) {
    applyFilter(cat);
    var target = document.getElementById(cat);
    if (target) {
      if (alias && target.selectTab) target.selectTab(alias.tab);
      setTimeout(function () { target.scrollIntoView(); }, 0);
    }
  }
})();
