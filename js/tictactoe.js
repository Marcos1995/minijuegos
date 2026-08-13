var TicTacToe = (function () {
  var WINS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  function start() {
    return { b: [0, 0, 0, 0, 0, 0, 0, 0, 0], turn: 1 };
  }

  function winner(b) {
    for (var i = 0; i < WINS.length; i++) {
      var a = WINS[i], x = b[a[0]];
      if (x && x === b[a[1]] && x === b[a[2]]) return x;
    }
    for (i = 0; i < 9; i++) if (!b[i]) return 0;
    return 2;
  }

  function moves(b) {
    var m = [];
    for (var i = 0; i < 9; i++) if (!b[i]) m.push(i);
    return m;
  }

  function play(s, i) {
    if (s.b[i] || winner(s.b)) return null;
    var n = { b: s.b.slice(), turn: -s.turn };
    n.b[i] = s.turn;
    return n;
  }

  function minimax(b, turn, ai) {
    var w = winner(b);
    if (w === ai) return 10;
    if (w === -ai) return -10;
    if (w === 2) return 0;
    var best = turn === ai ? -99 : 99;
    var m = moves(b);
    for (var i = 0; i < m.length; i++) {
      b[m[i]] = turn;
      var v = minimax(b, -turn, ai);
      b[m[i]] = 0;
      if (turn === ai) { if (v > best) best = v; }
      else if (v < best) best = v;
    }
    return best;
  }

  function bestMove(s) {
    var ai = s.turn, m = moves(s.b), choice = m[0], best = -99;
    for (var i = 0; i < m.length; i++) {
      s.b[m[i]] = ai;
      var v = minimax(s.b, -ai, ai);
      s.b[m[i]] = 0;
      if (v > best) { best = v; choice = m[i]; }
    }
    return choice;
  }

  return { start: start, winner: winner, play: play, bestMove: bestMove, moves: moves };
})();
if (typeof module !== "undefined") module.exports = TicTacToe;
