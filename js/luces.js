var Luces = (function () {
  var N = 5;

  function start() {
    var b = [];
    for (var i = 0; i < N * N; i++) b[i] = Math.random() < 0.5 ? 1 : 0;
    return { b: b, n: N };
  }

  function from(b) { return { b: b.slice(), n: N }; }

  function toggle(s, i) {
    var n = s.n, x = i % n, y = (i / n) | 0;
    function flip(x, y) {
      if (x < 0 || y < 0 || x >= n || y >= n) return;
      var j = y * n + x;
      s.b[j] = s.b[j] ? 0 : 1;
    }
    flip(x, y);
    flip(x - 1, y);
    flip(x + 1, y);
    flip(x, y - 1);
    flip(x, y + 1);
    return s;
  }

  function won(s) {
    for (var i = 0; i < s.b.length; i++) if (s.b[i]) return false;
    return true;
  }

  return { start: start, from: from, toggle: toggle, won: won, N: N };
})();
if (typeof module !== "undefined") module.exports = Luces;
