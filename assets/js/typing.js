// Hero role line: types each word, holds it, deletes it, then moves to the next.
(function () {
  var el = document.querySelector('.typed');
  if (!el) return;
  var words = el.getAttribute('data-words').split('|');
  var TYPE = 110;     // ms per character while typing
  var ERASE = 55;     // ms per character while deleting (faster than typing)
  var HOLD = 1800;    // ms the full word stays on screen
  var GAP = 450;      // ms of empty line before the next word

  // Reduced motion: no typing, just swap whole words at a calm pace.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var j = 0;
    setInterval(function () { j = (j + 1) % words.length; el.textContent = words[j]; }, 2600);
    return;
  }

  var i = 0, n = 0, deleting = false;
  el.textContent = '';
  function tick() {
    var w = Array.from(words[i]);   // split by character, safe for Korean and "·"
    if (!deleting) {
      n++;
      el.textContent = w.slice(0, n).join('');
      if (n === w.length) { deleting = true; return setTimeout(tick, HOLD); }
      return setTimeout(tick, TYPE);
    }
    n--;
    el.textContent = w.slice(0, n).join('');
    if (n === 0) { deleting = false; i = (i + 1) % words.length; return setTimeout(tick, GAP); }
    setTimeout(tick, ERASE);
  }
  setTimeout(tick, 500);
})();
