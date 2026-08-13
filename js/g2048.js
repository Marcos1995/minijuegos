var G2048 = (function () {
  function empty() {
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  function spawn(b) {
    var z = [];
    for (var i = 0; i < 16; i++) if (!b[i]) z.push(i);
    if (!z.length) return b;
    b = b.slice();
    b[z[Math.floor(Math.random() * z.length)]] = Math.random() < 0.9 ? 2 : 4;
    return b;
  }

  function start() {
    return { b: spawn(spawn(empty())), score: 0, won: false, dead: false };
  }

  function from(b, score) {
    return { b: b.slice(), score: score || 0, won: false, dead: false };
  }

  function rot(b) {
    var n = empty();
    for (var r = 0; r < 4; r++)
      for (var c = 0; c < 4; c++) n[c * 4 + (3 - r)] = b[r * 4 + c];
    return n;
  }

  function slideLeft(b) {
    var n = empty(), score = 0, moved = false;
    for (var r = 0; r < 4; r++) {
      var row = [], c;
      for (c = 0; c < 4; c++) if (b[r * 4 + c]) row.push(b[r * 4 + c]);
      for (c = 0; c < row.length - 1; c++) {
        if (row[c] === row[c + 1]) { row[c] *= 2; score += row[c]; row.splice(c + 1, 1); }
      }
      for (c = 0; c < 4; c++) {
        var v = row[c] || 0;
        n[r * 4 + c] = v;
        if (v !== b[r * 4 + c]) moved = true;
      }
    }
    return { b: n, score: score, moved: moved };
  }

  function slide(s, dir) {
    if (s.dead) return s;
    var b = s.b, i, res;
    for (i = 0; i < dir; i++) b = rot(b);
    res = slideLeft(b);
    b = res.b;
    for (i = 0; i < (4 - dir) % 4; i++) b = rot(b);
    if (!res.moved) return s;
    var n = { b: spawn(b), score: s.score + res.score, won: s.won, dead: false };
    for (i = 0; i < 16; i++) if (n.b[i] >= 2048) n.won = true;
    n.dead = stuck(n.b);
    return n;
  }

  function stuck(b) {
    var t = slideLeft(b);
    if (t.moved) return false;
    var r = b, i;
    for (i = 0; i < 3; i++) {
      r = rot(r);
      if (slideLeft(r).moved) return false;
    }
    return true;
  }

  return { start: start, from: from, slide: slide, slideLeft: slideLeft, stuck: stuck };
})();
if (typeof module !== "undefined") module.exports = G2048;
