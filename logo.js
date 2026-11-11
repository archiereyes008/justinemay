/* Animated logo with leading-edge blur */
(function () {
  var root = document.getElementById('logo-mark');
  if (!root) return;
  var svg = root.querySelector('svg');

  // Hide static helper layers to prevent rendering duplicate artifacts
  var extraLayers = svg.querySelectorAll('.lm-stroke[data-layer="1"], .lm-stroke[data-layer="2"]');
  [].forEach.call(extraLayers, function (el) { el.style.display = 'none'; });

  // Target primary stroke paths
  var primaryStrokes = [].slice.call(svg.querySelectorAll('.lm-stroke[data-layer="0"]'));

  // Dynamically generate a paired leading-edge tip stroke for each path
  var strokePairs = primaryStrokes.map(function (mainEl) {
    var tipEl = mainEl.cloneNode(true);
    tipEl.classList.remove('lm-stroke');
    tipEl.classList.add('lm-stroke-tip');
    tipEl.setAttribute('stroke-linecap', 'round');
    mainEl.parentNode.appendChild(tipEl);

    var len = mainEl.getTotalLength ? mainEl.getTotalLength() : 1500;
    return {
      mainEl: mainEl,
      tipEl: tipEl,
      len: len,
      delay: parseFloat(mainEl.getAttribute('data-delay') || '0'),
      dur: parseFloat(mainEl.getAttribute('data-dur') || '0.5')
    };
  });

  var ringPieces = [].slice.call(svg.querySelectorAll('[data-lm="ringfade"]'));
  var play = svg.querySelector('#part-play');
  var gear = svg.querySelector('#part-gear');
  if (play) { play.style.transformBox = 'fill-box'; play.style.transformOrigin = 'center'; }

  var TIMES = { play: [0.30, 0.12], ring: [0.96, 0.12], gear: [1.00, 0.22], spin: 1.00 };
  var TOTAL = 1.5, raf = 0, spinOn = false;

  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var seg = function (t, a) { return clamp((t - a[0]) / a[1]); };
  var smooth = function (v) { return v * v * (3 - 2 * v); };
  var backOut = function (v) { var c = 1.4; return 1 + (c + 1) * Math.pow(v - 1, 3) + c * Math.pow(v - 1, 2); };

  function draw(t) {
    strokePairs.forEach(function (s) {
      var k = clamp((t - s.delay) / s.dur);
      var u = smooth(k);
      var S = u * s.len;

      // Tip length and blur fade calculation
      var maxTipLen = Math.min(80, s.len * 0.3);
      var fade = u < 0.75 ? 1 : (1 - u) / 0.25; // Smoothly dissolve tip blur in final 25%
      var activeTipLen = maxTipLen * fade;
      var activeBlur = 12 * fade;

      var S_body = Math.max(0, S - activeTipLen);

      // 1. Draw solid sharp trailing body
      if (S_body <= 0.5) {
        s.mainEl.style.display = 'none';
      } else {
        s.mainEl.style.display = '';
        s.mainEl.setAttribute('stroke-dasharray', s.len + ' ' + (s.len * 2));
        s.mainEl.setAttribute('stroke-dashoffset', String(s.len - S_body));
      }

      // 2. Draw soft blurred active tip segment
      if (S <= 0.5 || activeTipLen <= 0.5) {
        s.tipEl.style.display = 'none';
      } else {
        var tipStart = Math.max(0, S - activeTipLen);
        var tipDrawLen = S - tipStart;

        s.tipEl.style.display = '';
        s.tipEl.setAttribute('stroke-dasharray', '0 ' + tipStart.toFixed(1) + ' ' + tipDrawLen.toFixed(1) + ' ' + (s.len * 2));
        s.tipEl.setAttribute('stroke-dashoffset', '0');
        s.tipEl.style.filter = 'blur(' + activeBlur.toFixed(1) + 'px)';
      }
    });

    var r = seg(t, TIMES.ring);
    ringPieces.forEach(function (p) { p.style.opacity = String(r); });

    if (play) {
      var u = seg(t, TIMES.play);
      play.style.opacity = String(clamp(u * 1.6));
      play.style.transform = 'scale(' + (0.5 + 0.5 * backOut(u)) + ')';
    }

    if (gear) gear.style.opacity = String(smooth(seg(t, TIMES.gear)));
    if (t >= TIMES.spin && !spinOn) { root.classList.add('lm-spin'); spinOn = true; }
  }

  function finish() {
    strokePairs.forEach(function (s) {
      s.mainEl.style.display = '';
      s.mainEl.removeAttribute('stroke-dasharray');
      s.mainEl.removeAttribute('stroke-dashoffset');
      s.tipEl.style.display = 'none';
    });
    ringPieces.forEach(function (p) { p.style.opacity = ''; });
    if (play) { play.style.opacity = ''; play.style.transform = ''; }
    if (gear) gear.style.opacity = '';
  }

  function start() {
    cancelAnimationFrame(raf);
    root.classList.remove('lm-throb', 'lm-spin');
    spinOn = false;
    root.classList.remove('lm-pre');
    draw(0);

    var t0 = null;
    function frame(now) {
      if (t0 === null) t0 = now;
      var t = (now - t0) / 1000;
      if (t >= TOTAL) {
        draw(TOTAL);
        finish();
        root.classList.add('lm-throb');
        return;
      }
      draw(t);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }

  start();

  root.addEventListener('click', function () { start(); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) start(); });
})();