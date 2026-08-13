var Tetris = (function () {
  var W = 10, H = 20;
  var SH = [
    [[0, 1], [1, 1], [2, 1], [3, 1]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[1, 0], [0, 1], [1, 1], [2, 1]],
    [[0, 0], [0, 1], [1, 1], [2, 1]],
    [[2, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [0, 1], [1, 1]],
    [[0, 0], [1, 0], [1, 1], [2, 1]]
  ];

  function empty() {
    var b = [];
    for (var y = 0; y < H; y++) {
      b[y] = [];
      for (var x = 0; x < W; x++) b[y][x] = 0;
    }
    return b;
  }

  function piece() {
    var id = 1 + Math.floor(Math.random() * 7);
    return { cells: SH[id - 1].map(function (c) { return c.slice(); }), x: 3, y: 0, id: id };
  }

  function start() {
    return { b: empty(), p: piece(), dead: false, score: 0, lines: 0 };
  }

  function cells(p) {
    return p.cells.map(function (c) { return [p.x + c[0], p.y + c[1]]; });
  }

  function hits(b, p) {
    var cs = cells(p);
    for (var i = 0; i < cs.length; i++) {
      var x = cs[i][0], y = cs[i][1];
      if (x < 0 || x >= W || y >= H) return true;
      if (y >= 0 && b[y][x]) return true;
    }
    return false;
  }

  function lock(s) {
    var cs = cells(s.p);
    for (var i = 0; i < cs.length; i++) {
      var x = cs[i][0], y = cs[i][1];
      if (y < 0) { s.dead = true; return s; }
      s.b[y][x] = s.p.id;
    }
    var cleared = 0, y, x, full;
    for (y = H - 1; y >= 0; y--) {
      full = true;
      for (x = 0; x < W; x++) if (!s.b[y][x]) { full = false; break; }
      if (full) {
        s.b.splice(y, 1);
        s.b.unshift([]);
        for (x = 0; x < W; x++) s.b[0][x] = 0;
        cleared++;
        y++;
      }
    }
    s.lines += cleared;
    s.score += [0, 100, 300, 500, 800][cleared];
    s.p = piece();
    if (hits(s.b, s.p)) s.dead = true;
    return s;
  }

  function tick(s) {
    if (s.dead) return s;
    var n = { cells: s.p.cells, x: s.p.x, y: s.p.y + 1, id: s.p.id };
    if (hits(s.b, n)) return lock(s);
    s.p = n;
    return s;
  }

  function move(s, dx) {
    if (s.dead) return s;
    var n = { cells: s.p.cells, x: s.p.x + dx, y: s.p.y, id: s.p.id };
    if (!hits(s.b, n)) s.p = n;
    return s;
  }

  // ponytail: rotate in place, no wall-kicks → SRS
  function rotate(s) {
    if (s.dead) return s;
    var cells = s.p.cells.map(function (c) { return [c[1], -c[0]]; });
    var minx = 9, miny = 9, i;
    for (i = 0; i < 4; i++) { if (cells[i][0] < minx) minx = cells[i][0]; if (cells[i][1] < miny) miny = cells[i][1]; }
    for (i = 0; i < 4; i++) { cells[i][0] -= minx; cells[i][1] -= miny; }
    var n = { cells: cells, x: s.p.x, y: s.p.y, id: s.p.id };
    if (!hits(s.b, n)) s.p = n;
    return s;
  }

  function hard(s) {
    if (s.dead) return s;
    var n = { cells: s.p.cells, x: s.p.x, y: s.p.y, id: s.p.id };
    while (!hits(s.b, { cells: n.cells, x: n.x, y: n.y + 1, id: n.id })) n.y++;
    s.p = n;
    return lock(s);
  }

  function withBoard(b, p) {
    return { b: b, p: p, dead: false, score: 0, lines: 0 };
  }

  return { start: start, tick: tick, move: move, rotate: rotate, hard: hard, cells: cells, withBoard: withBoard, W: W, H: H };
})();
if (typeof module !== "undefined") module.exports = Tetris;
