var Cuatro = (function () {
  var R = 6, C = 7;

  function empty() {
    var b = [];
    for (var r = 0; r < R; r++) {
      b[r] = [];
      for (var c = 0; c < C; c++) b[r][c] = 0;
    }
    return b;
  }

  function start() { return { b: empty(), turn: 1 }; }

  function copy(b) {
    return b.map(function (row) { return row.slice(); });
  }

  function drop(b, c, p) {
    if (c < 0 || c >= C || b[0][c]) return null;
    var n = copy(b);
    for (var r = R - 1; r >= 0; r--) {
      if (!n[r][c]) { n[r][c] = p; return n; }
    }
    return null;
  }

  function play(s, c) {
    if (winner(s.b)) return null;
    var n = drop(s.b, c, s.turn);
    if (!n) return null;
    return { b: n, turn: -s.turn };
  }

  function line(b, r, c, dr, dc, p) {
    for (var i = 0; i < 4; i++) {
      var rr = r + dr * i, cc = c + dc * i;
      if (rr < 0 || rr >= R || cc < 0 || cc >= C || b[rr][cc] !== p) return false;
    }
    return true;
  }

  function winner(b) {
    var r, c, p;
    for (r = 0; r < R; r++) {
      for (c = 0; c < C; c++) {
        p = b[r][c];
        if (!p) continue;
        if (line(b, r, c, 0, 1, p) || line(b, r, c, 1, 0, p)
          || line(b, r, c, 1, 1, p) || line(b, r, c, 1, -1, p)) return p;
      }
    }
    for (c = 0; c < C; c++) if (!b[0][c]) return 0;
    return 2;
  }

  function negamax(b, turn, depth) {
    var w = winner(b);
    if (w === 2) return 0;
    if (w) return w * turn * (20 + depth);
    if (depth === 0) return 0;
    var best = -99, c, n, v, any = false;
    for (c = 0; c < C; c++) {
      n = drop(b, c, turn);
      if (!n) continue;
      any = true;
      v = -negamax(n, -turn, depth - 1);
      if (v > best) best = v;
    }
    return any ? best : 0;
  }

  function bestMove(s) {
    var bestC = 3, best = -99, order = [3, 2, 4, 1, 5, 0, 6];
    for (var i = 0; i < 7; i++) {
      var c = order[i], n = drop(s.b, c, s.turn);
      if (!n) continue;
      var v = -negamax(n, -s.turn, 3);
      if (v > best) { best = v; bestC = c; }
    }
    return bestC;
  }

  return { start: start, play: play, winner: winner, bestMove: bestMove, R: R, C: C };
})();
if (typeof module !== "undefined") module.exports = Cuatro;
