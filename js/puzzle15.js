var Puzzle15 = (function () {
  function solved() {
    var a = [];
    for (var i = 1; i <= 15; i++) a.push(i);
    a.push(0);
    return a;
  }

  function from(a) { return { a: a.slice() }; }

  function hole(a) { return a.indexOf(0); }

  function start() {
    var a = solved(), i, n = 80;
    var s = { a: a };
    for (i = 0; i < n; i++) {
      var m = moves(s);
      slide(s, m[Math.floor(Math.random() * m.length)]);
    }
    return s;
  }

  function moves(s) {
    var h = hole(s.a), r = (h / 4) | 0, c = h % 4, o = [];
    if (r > 0) o.push(h - 4);
    if (r < 3) o.push(h + 4);
    if (c > 0) o.push(h - 1);
    if (c < 3) o.push(h + 1);
    return o;
  }

  function slide(s, i) {
    var m = moves(s);
    if (m.indexOf(i) < 0) return s;
    var h = hole(s.a), t = s.a[i];
    s.a[i] = 0;
    s.a[h] = t;
    return s;
  }

  function won(s) {
    var a = solved();
    for (var i = 0; i < 16; i++) if (s.a[i] !== a[i]) return false;
    return true;
  }

  return { start: start, from: from, slide: slide, moves: moves, won: won };
})();
if (typeof module !== "undefined") module.exports = Puzzle15;
