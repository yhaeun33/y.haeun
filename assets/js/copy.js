// Contact button: copies the email address and shows a short confirmation.
(function () {
  var btn = document.querySelector('.copy-mail');
  var msg = document.getElementById('copy-msg');
  if (!btn || !msg) return;
  var timer;

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function show(text) {
    msg.textContent = text;
    msg.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(function () { msg.classList.remove('show'); }, 2000);
  }

  btn.addEventListener('click', function () {
    var text = btn.getAttribute('data-copy');
    var done = function () { show('메일 주소가 복사되었습니다.'); };
    var fail = function () {
      if (fallbackCopy(text)) done();
      else show('복사하지 못했어요. ' + text + ' 로 연락 주세요.');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fail);
    } else {
      fail();
    }
  });
})();
