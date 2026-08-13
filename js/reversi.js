var Reversi = (function () {
  var D = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

  function start() {
    var b = [];
    for (var r = 0; r < 8; r++) {
      b[r] = [];
      for (var c = 0; c < 8; c++) b[r][c] = 0;
    }
    b[3][3] = b[4][4] = -1;
    b[3][4] = b[4][3] = 1;
    return { b: b, turn: 1 };
  }

  function inb(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

  function flips(b, r, c, p) {
    if (b[r][c]) return [];
    var out = [];
    for (var i = 0; i < 8; i++) {
      var rr = r + D[i][0], cc = c + D[i][1], acc = [];
      while (inb(rr, cc) && b[rr][cc] === -p) {
        acc.push([rr, cc]);
        rr += D[i][0];
        cc += D[i][1];
      }
      if (acc.length && inb(rr, cc) && b[rr][cc] === p) out = out.concat(acc);
    }
    return out;
  }

  function moves(s) {
    var m = [];
    for (var r = 0; r < 8; r++)
      for (var c = 0; c < 8; c++)
        if (flips(s.b, r, c, s.turn).length) m.push([r, c]);
    return m;
  }

  function play(s, r, c) {
    var f = flips(s.b, r, c, s.turn);
    if (!f.length) return null;
    var n = { b: s.b.map(function (row) { return row.slice(); }), turn: s.turn };
    n.b[r][c] = s.turn;
    for (var i = 0; i < f.length; i++) n.b[f[i][0]][f[i][1]] = s.turn;
    n.turn = -s.turn;
    if (!moves(n).length) {
      n.turn = s.turn;
      if (!moves(n).length) n.turn = 0;
    }
    return n;
  }

  function count(b) {
    var a = 0, c = 0;
    for (var r = 0; r < 8; r++)
      for (var col = 0; col < 8; col++) {
        if (b[r][col] === 1) a++;
        else if (b[r][col] === -1) c++;
      }
    return { black: a, white: c };
  }

  function greedy(s) {
    var m = moves(s), best = m[0], bestN = -1;
    if (!m.length) return null;
    for (var i = 0; i < m.length; i++) {
      var n = flips(s.b, m[i][0], m[i][1], s.turn).length;
      if (n > bestN) { bestN = n; best = m[i]; }
    }
    return best;
  }

  return { start: start, moves: moves, play: play, count: count, greedy: greedy, flips: flips };
})();
if (typeof module !== "undefined") module.exports = Reversi;
