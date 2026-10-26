// Test harness, not part of the site. Paste into the browser tool's initScript (or DevTools
// snippets) to open index.html on one chosen theme without it redirecting away.
//
//   THEME   index into the theme list in index.html (0-based)
//   PATTERN 0 = glow, 1 = grid, 2 = dots
//
// What it does:
//   - forces the two Math.random() calls the page makes at load (theme, then pattern)
//   - clears the remembered "last theme" so the pick is not bumped
//   - runs performance.now() 100x slower so the 5 second countdown lasts ~8 minutes
//   - stretches the ring animation to 600s so a screenshot sees a full ring
(function () {
  var THEME = 0, PATTERN = 0, COUNT = 51;

  try { localStorage.clear(); } catch (e) {}

  var seq = [(THEME + 0.5) / COUNT, (PATTERN + 0.5) / 3], n = 0, random = Math.random;
  Math.random = function () { return n < seq.length ? seq[n++] : random(); };

  var now = performance.now.bind(performance);
  performance.now = function () { return now() / 100; };

  function stretch() {
    var s = document.createElement("style");
    s.textContent = ".bar{animation-duration:600s !important}";
    document.documentElement.appendChild(s);
  }
  if (document.documentElement) stretch();
  else new MutationObserver(function (m, o) {
    if (document.documentElement) { stretch(); o.disconnect(); }
  }).observe(document, { childList: true });
})();
