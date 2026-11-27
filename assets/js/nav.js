(function () {
  var btn = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { links.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  });
})();

// Highlight the menu item for the section currently on screen (main page only).
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="index.html#"]'));
  var onMain = /(^|\/)(index\.html)?$/.test(location.pathname);
  if (!onMain || !links.length) return;
  var items = links.map(function (a) {
    return { a: a, sec: document.getElementById(a.getAttribute('href').split('#')[1]) };
  }).filter(function (x) { return x.sec; });
  function update() {
    var offset = 140, current = null;
    items.forEach(function (x) { if (x.sec.getBoundingClientRect().top - offset <= 0) current = x; });
    // At the very bottom the last section (Contact) may never reach the top.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = items[items.length - 1];
    items.forEach(function (x) {
      var on = x === current;
      x.a.classList.toggle('is-active', on);
      if (on) x.a.setAttribute('aria-current', 'location'); else x.a.removeAttribute('aria-current');
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { update(); ticking = false; }); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
