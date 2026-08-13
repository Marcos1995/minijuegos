var Parchis = (function () {
  // ponytail: 2 players, 40-ring, no barriers → 4 players + puentes
  var TRACK = 40, HOME = 5, Y = 0, G = 1, START = [0, 20], SAFE = { 0: 1, 10: 1, 20: 1, 30: 1 };

  function trackCells() {
    var cells = [], c, r;
    for (c = 5; c <= 10; c++) cells.push([10, c]);
    for (r = 9; r >= 0; r--) cells.push([r, 10]);
    for (c = 9; c >= 0; c--) cells.push([0, c]);
    for (r = 1; r <= 10; r++) cells.push([r, 0]);
    for (c = 1; c <= 4; c++) cells.push([10, c]);
    return cells;
  }

  function stretchCell(player, h) {
    return player === Y ? [9 - h, 5] : [1 + h, 5];
  }

  function casaCell(player, i) {
    return player === Y ? [[8, 1], [8, 2], [9, 1], [9, 2]][i] : [[1, 8], [1, 7], [2, 8], [2, 7]][i];
  }

  function start() {
    return {
      tok: [
        [-1, -1, -1, -1],
        [-1, -1, -1, -1]
      ],
      turn: Y,
      die: 0,
      extra: false,
      winner: -1
    };
  }

  function clone(s) {
    return {
      tok: [s.tok[0].slice(), s.tok[1].slice()],
      turn: s.turn, die: s.die, extra: s.extra, winner: s.winner
    };
  }

  function withDie(s, n) {
    var x = clone(s);
    x.die = n;
    return x;
  }

  function roll(s) {
    if (s.winner >= 0 || s.die) return s;
    var n = clone(s);
    n.die = 1 + Math.floor(Math.random() * 6);
    return n;
  }

  function dist(p) {
    if (p < 0) return -1;
    if (p >= 100) return 1000 + p;
    return p;
  }

  function dest(player, pos, die) {
    if (pos < 0) {
      if (die !== 5) return null;
      return START[player];
    }
    if (pos >= 100) {
      var h = pos - 100 + die;
      if (h === HOME) return 200;
      if (h < HOME) return 100 + h;
      return null;
    }
    var start = START[player];
    var stepsToGate = (start - 1 - pos + TRACK) % TRACK;
    if (die === stepsToGate + 1) return 100;
    if (die > stepsToGate + 1) {
      var into = die - (stepsToGate + 1);
      if (into === HOME) return 200;
      if (into < HOME) return 100 + into;
      return null;
    }
    return (pos + die) % TRACK;
  }

  function occupiedBy(s, player, cell) {
    for (var i = 0; i < 4; i++) if (s.tok[player][i] === cell) return i;
    return -1;
  }

  function canLand(s, player, cell) {
    if (cell === 200) return true;
    if (occupiedBy(s, player, cell) >= 0) return false;
    return true;
  }

  function options(s) {
    if (s.winner >= 0 || !s.die) return [];
    var p = s.turn, d = s.die, out = [];
    for (var i = 0; i < 4; i++) {
      var to = dest(p, s.tok[p][i], d);
      if (to === null || !canLand(s, p, to)) continue;
      out.push(i);
    }
    return out;
  }

  function applyMove(s, i) {
    var opts = options(s);
    if (opts.indexOf(i) < 0) return null;
    var n = clone(s);
    var p = n.turn;
    var to = dest(p, n.tok[p][i], n.die);
    var opp = 1 - p;
    var cap = -1;
    if (to < 100 && !SAFE[to]) cap = occupiedBy(n, opp, to);
    n.tok[p][i] = to;
    if (cap >= 0) n.tok[opp][cap] = -1;
    var extra = n.die === 6 || cap >= 0 || to === 200;
    n.die = 0;
    var done = 0;
    for (var k = 0; k < 4; k++) if (n.tok[p][k] === 200) done++;
    if (done === 4) { n.winner = p; return n; }
    if (!extra) n.turn = opp;
    return n;
  }

  function pass(s) {
    if (s.winner >= 0 || !s.die || options(s).length) return null;
    var n = clone(s);
    var extra = n.die === 6;
    n.die = 0;
    if (!extra) n.turn = 1 - n.turn;
    return n;
  }

  function greedy(s) {
    var opts = options(s);
    if (!opts.length) return -1;
    var best = opts[0], bestSc = -1e9;
    for (var j = 0; j < opts.length; j++) {
      var i = opts[j];
      var to = dest(s.turn, s.tok[s.turn][i], s.die);
      var sc = dist(to);
      if (to < 100 && !SAFE[to] && occupiedBy(s, 1 - s.turn, to) >= 0) sc += 500;
      if (to === 200) sc += 400;
      if (sc > bestSc) { bestSc = sc; best = i; }
    }
    return best;
  }

  return {
    start: start, roll: roll, withDie: withDie, options: options,
    applyMove: applyMove, pass: pass, greedy: greedy, dest: dest,
    trackCells: trackCells, stretchCell: stretchCell, casaCell: casaCell,
    TRACK: TRACK, START: START, HOME: HOME
  };
})();
if (typeof module !== "undefined") module.exports = Parchis;
