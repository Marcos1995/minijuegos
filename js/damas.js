var Damas = (function () {
  // ponytail: English draughts (no flying kings, no majority-capture) → damas españolas
  function start() {
    var b = [];
    for (var r = 0; r < 8; r++) {
      b[r] = [];
      for (var c = 0; c < 8; c++) {
        var dark = (r + c) % 2 === 1;
        b[r][c] = 0;
        if (dark && r < 3) b[r][c] = -1;
        if (dark && r > 4) b[r][c] = 1;
      }
    }
    return { b: b, turn: 1 };
  }

  function clone(s) {
    return { b: s.b.map(function (row) { return row.slice(); }), turn: s.turn };
  }

  function inb(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

  function manDirs(p) {
    return p > 0 ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
  }

  function dirs(p) {
    var abs = Math.abs(p);
    if (abs === 2) return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    return manDirs(p);
  }

  function crown(p, r) {
    if (p === 1 && r === 0) return 2;
    if (p === -1 && r === 7) return -2;
    return p;
  }

  function jumpsFrom(b, r, c, p, path, eaten) {
    var found = [];
    var d = dirs(p);
    for (var i = 0; i < d.length; i++) {
      var mr = r + d[i][0], mc = c + d[i][1];
      var lr = r + 2 * d[i][0], lc = c + 2 * d[i][1];
      if (!inb(lr, lc) || b[lr][lc] !== 0) continue;
      var mid = b[mr][mc];
      if (!mid || (mid > 0) === (p > 0)) continue;
      var key = mr + "," + mc;
      if (eaten[key]) continue;
      var nb = b.map(function (row) { return row.slice(); });
      nb[r][c] = 0;
      nb[mr][mc] = 0;
      var np = crown(p, lr);
      nb[lr][lc] = np;
      var npath = path.concat([[lr, lc]]);
      var ne = {};
      for (var ek in eaten) ne[ek] = eaten[ek];
      ne[key] = true;
      // English: crowning ends the jump
      var more = (np === p) ? jumpsFrom(nb, lr, lc, np, npath, ne) : [];
      if (more.length) found = found.concat(more);
      else found.push({ path: npath, b: nb });
    }
    return found;
  }

  function allJumps(s) {
    var out = [];
    var t = s.turn;
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var p = s.b[r][c];
        if (!p || (p > 0) !== (t > 0)) continue;
        out = out.concat(jumpsFrom(s.b, r, c, p, [[r, c]], {}));
      }
    }
    return out;
  }

  function steps(s) {
    var out = [];
    var t = s.turn;
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var p = s.b[r][c];
        if (!p || (p > 0) !== (t > 0)) continue;
        var d = dirs(p);
        for (var i = 0; i < d.length; i++) {
          var nr = r + d[i][0], nc = c + d[i][1];
          if (inb(nr, nc) && s.b[nr][nc] === 0) {
            var nb = s.b.map(function (row) { return row.slice(); });
            nb[r][c] = 0;
            nb[nr][nc] = crown(p, nr);
            out.push({ path: [[r, c], [nr, nc]], b: nb });
          }
        }
      }
    }
    return out;
  }

  function legal(s) {
    var j = allJumps(s);
    return j.length ? j : steps(s);
  }

  function applyPath(s, path) {
    var ms = legal(s);
    var key = JSON.stringify(path);
    for (var i = 0; i < ms.length; i++) {
      if (JSON.stringify(ms[i].path) === key) {
        return { b: ms[i].b, turn: -s.turn };
      }
    }
    return null;
  }

  function result(s) {
    if (legal(s).length) return 0;
    return -s.turn;
  }

  function evalBoard(s) {
    var v = 0;
    for (var r = 0; r < 8; r++)
      for (var c = 0; c < 8; c++) {
        var p = s.b[r][c];
        if (p === 1) v += 100;
        else if (p === 2) v += 200;
        else if (p === -1) v -= 100;
        else if (p === -2) v -= 200;
      }
    return v;
  }

  function negamax(s, depth, a, b) {
    var r = result(s);
    if (r) return r * s.turn * 10000;
    if (depth === 0) return evalBoard(s) * s.turn;
    var ms = legal(s), best = -1e9;
    for (var i = 0; i < ms.length; i++) {
      var n = { b: ms[i].b, turn: -s.turn };
      var sc = -negamax(n, depth - 1, -b, -a);
      if (sc > best) best = sc;
      if (best > a) a = best;
      if (a >= b) break;
    }
    return best;
  }

  function bestMove(s) {
    var ms = legal(s);
    if (!ms.length) return null;
    var best = ms[0], bestSc = -1e9;
    for (var i = 0; i < ms.length; i++) {
      var n = { b: ms[i].b, turn: -s.turn };
      var sc = -negamax(n, 3, -1e9, 1e9);
      if (sc > bestSc) { bestSc = sc; best = ms[i]; }
    }
    return best.path;
  }

  return {
    start: start, clone: clone, legal: legal, applyPath: applyPath,
    result: result, bestMove: bestMove, evalBoard: evalBoard
  };
})();
if (typeof module !== "undefined") module.exports = Damas;
