/* Pin. download page: device hints, QR code for desktop visitors,
   download feedback and the checksum copy button. */
(function () {
  'use strict';
  var ua = navigator.userAgent || '';
  var isAndroid = /Android/i.test(ua);
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isDesktop = !isAndroid && !isIOS;

  if (isIOS) document.getElementById('notice-ios').hidden = false;
  if (isDesktop) document.getElementById('notice-desktop').hidden = false;

  /* QR code so desktop visitors can open this page on their phone. */
  if (isDesktop && typeof window.qrcode === 'function') {
    try {
      var url = location.href.split('#')[0];
      var qr = window.qrcode(0, 'M');
      qr.addData(url);
      qr.make();
      document.getElementById('qr').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
      document.getElementById('qr-card').hidden = false;
    } catch (e) {
      /* No QR code: the download button still works. */
    }
  }

  /* Download feedback */
  var dl = document.getElementById('dl');
  var dlStatus = document.getElementById('dl-status');
  dl.addEventListener('click', function () {
    dlStatus.textContent = isAndroid
      ? 'Opening the download. If Google Drive asks, tap "Download anyway". When it finishes, tap Pin.apk in your notifications to install.'
      : 'Opening the download. If Google Drive asks, click "Download anyway", then copy Pin.apk to your Android phone and open it there.';
  });

  /* Copy checksum */
  var copyBtn = document.getElementById('copy-sha');
  var copyStatus = document.getElementById('copy-status');
  var sha = document.getElementById('sha');
  copyBtn.addEventListener('click', function () {
    var text = sha.textContent.trim();
    var fallback = function () {
      var range = document.createRange();
      range.selectNodeContents(sha);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      copyStatus.textContent = 'Selected. Press Copy to copy it.';
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        copyStatus.textContent = 'Copied';
      }, fallback);
    } else {
      fallback();
    }
  });
})();
