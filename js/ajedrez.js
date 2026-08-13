var Ajedrez = (function () {
  var VAL = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };
  var NDIR = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
  var KDIR = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  var BDIR = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  var RDIR = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  function start() {
    return {
      sq: [
        "rnbqkbnr".split(""),
        "pppppppp".split(""),
        "........".split(""),
        "........".split(""),
        "........".split(""),
        "........".split(""),
        "PPPPPPPP".split(""),
        "RNBQKBNR".split("")
      ],
      w: true,
      castle: { K: true, Q: true, k: true, q: true },
      ep: null
    };
  }

  function clone(s) {
    return {
      sq: s.sq.map(function (r) { return r.slice(); }),
      w: s.w,
      castle: { K: s.castle.K, Q: s.castle.Q, k: s.castle.k, q: s.castle.q },
      ep: s.ep ? s.ep.slice() : null
    };
  }

  function inb(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
  function isW(p) { return p !== "." && p === p.toUpperCase(); }
  function mine(s, p) { return p !== "." && isW(p) === s.w; }
  function theirs(s, p) { return p !== "." && isW(p) !== s.w; }

  function findK(s, white) {
    var k = white ? "K" : "k";
    for (var r = 0; r < 8; r++)
      for (var c = 0; c < 8; c++)
        if (s.sq[r][c] === k) return [r, c];
    return null;
  }

  function rayHit(sq, r, c, dirs, a, b) {
    for (var i = 0; i < dirs.length; i++) {
      var nr = r + dirs[i][0], nc = c + dirs[i][1];
      while (inb(nr, nc)) {
        var p = sq[nr][nc];
        if (p !== ".") return p === a || p === b;
        nr += dirs[i][0];
        nc += dirs[i][1];
      }
    }
    return false;
  }

  function attacked(s, r, c, byWhite) {
    var sq = s.sq, pd = byWhite ? 1 : -1, pc = byWhite ? "P" : "p";
    if (inb(r + pd, c - 1) && sq[r + pd][c - 1] === pc) return true;
    if (inb(r + pd, c + 1) && sq[r + pd][c + 1] === pc) return true;
    var n = byWhite ? "N" : "n", k = byWhite ? "K" : "k";
    var i, nr, nc;
    for (i = 0; i < 8; i++) {
      nr = r + NDIR[i][0]; nc = c + NDIR[i][1];
      if (inb(nr, nc) && sq[nr][nc] === n) return true;
    }
    for (i = 0; i < 8; i++) {
      nr = r + KDIR[i][0]; nc = c + KDIR[i][1];
      if (inb(nr, nc) && sq[nr][nc] === k) return true;
    }
    return rayHit(sq, r, c, BDIR, byWhite ? "B" : "b", byWhite ? "Q" : "q")
      || rayHit(sq, r, c, RDIR, byWhite ? "R" : "r", byWhite ? "Q" : "q");
  }

  function inCheck(s, white) {
    var k = findK(s, white);
    if (!k) return true;
    return attacked(s, k[0], k[1], !white);
  }

  function mv(fr, fc, tr, tc, extra) {
    extra = extra || {};
    return { fr: fr, fc: fc, tr: tr, tc: tc, promo: extra.promo || null, ep: !!extra.ep, castle: extra.castle || null };
  }

  function addSlide(s, r, c, dirs, list) {
    for (var i = 0; i < dirs.length; i++) {
      var nr = r + dirs[i][0], nc = c + dirs[i][1];
      while (inb(nr, nc)) {
        var p = s.sq[nr][nc];
        if (p === ".") list.push(mv(r, c, nr, nc));
        else {
          if (theirs(s, p)) list.push(mv(r, c, nr, nc));
          break;
        }
        nr += dirs[i][0];
        nc += dirs[i][1];
      }
    }
  }

  function addStep(s, r, c, dirs, list) {
    for (var i = 0; i < dirs.length; i++) {
      var nr = r + dirs[i][0], nc = c + dirs[i][1];
      if (!inb(nr, nc)) continue;
      var p = s.sq[nr][nc];
      if (p === "." || theirs(s, p)) list.push(mv(r, c, nr, nc));
    }
  }

  function addPawn(s, r, c, list) {
    var dir = s.w ? -1 : 1, startR = s.w ? 6 : 1, last = s.w ? 0 : 7;
    var nr = r + dir;
    if (inb(nr, c) && s.sq[nr][c] === ".") {
      if (nr === last) list.push(mv(r, c, nr, c, { promo: s.w ? "Q" : "q" }));
      else {
        list.push(mv(r, c, nr, c));
        if (r === startR && s.sq[nr + dir][c] === ".") list.push(mv(r, c, nr + dir, c));
      }
    }
    for (var dc = -1; dc <= 1; dc += 2) {
      var nc = c + dc;
      if (!inb(nr, nc)) continue;
      if (theirs(s, s.sq[nr][nc])) {
        list.push(mv(r, c, nr, nc, nr === last ? { promo: s.w ? "Q" : "q" } : {}));
      } else if (s.ep && s.ep[0] === nr && s.ep[1] === nc) {
        list.push(mv(r, c, nr, nc, { ep: true }));
      }
    }
  }

  function addCastle(s, r, c, list) {
    if (inCheck(s, s.w)) return;
    if (s.w && r === 7 && c === 4) {
      if (s.castle.K && s.sq[7][5] === "." && s.sq[7][6] === "." && s.sq[7][7] === "R"
        && !attacked(s, 7, 5, false) && !attacked(s, 7, 6, false))
        list.push(mv(7, 4, 7, 6, { castle: "K" }));
      if (s.castle.Q && s.sq[7][1] === "." && s.sq[7][2] === "." && s.sq[7][3] === "." && s.sq[7][0] === "R"
        && !attacked(s, 7, 3, false) && !attacked(s, 7, 2, false))
        list.push(mv(7, 4, 7, 2, { castle: "Q" }));
    }
    if (!s.w && r === 0 && c === 4) {
      if (s.castle.k && s.sq[0][5] === "." && s.sq[0][6] === "." && s.sq[0][7] === "r"
        && !attacked(s, 0, 5, true) && !attacked(s, 0, 6, true))
        list.push(mv(0, 4, 0, 6, { castle: "k" }));
      if (s.castle.q && s.sq[0][1] === "." && s.sq[0][2] === "." && s.sq[0][3] === "." && s.sq[0][0] === "r"
        && !attacked(s, 0, 3, true) && !attacked(s, 0, 2, true))
        list.push(mv(0, 4, 0, 2, { castle: "q" }));
    }
  }

  function genPseudo(s) {
    var list = [];
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var p = s.sq[r][c];
        if (!mine(s, p)) continue;
        var t = p.toUpperCase();
        if (t === "P") addPawn(s, r, c, list);
        else if (t === "N") addStep(s, r, c, NDIR, list);
        else if (t === "K") { addStep(s, r, c, KDIR, list); addCastle(s, r, c, list); }
        else if (t === "B") addSlide(s, r, c, BDIR, list);
        else if (t === "R") addSlide(s, r, c, RDIR, list);
        else if (t === "Q") addSlide(s, r, c, BDIR.concat(RDIR), list);
      }
    }
    return list;
  }

  function apply(s, m) {
    var n = clone(s);
    var p = n.sq[m.fr][m.fc];
    n.sq[m.fr][m.fc] = ".";
    if (m.ep) n.sq[m.fr][m.tc] = ".";
    n.sq[m.tr][m.tc] = m.promo || p;
    if (m.castle === "K") { n.sq[7][7] = "."; n.sq[7][5] = "R"; }
    if (m.castle === "Q") { n.sq[7][0] = "."; n.sq[7][3] = "R"; }
    if (m.castle === "k") { n.sq[0][7] = "."; n.sq[0][5] = "r"; }
    if (m.castle === "q") { n.sq[0][0] = "."; n.sq[0][3] = "r"; }
    n.ep = null;
    if (p === "P" && m.fr === 6 && m.tr === 4) n.ep = [5, m.fc];
    if (p === "p" && m.fr === 1 && m.tr === 3) n.ep = [2, m.fc];
    if (p === "K") { n.castle.K = false; n.castle.Q = false; }
    if (p === "k") { n.castle.k = false; n.castle.q = false; }
    if (p === "R" && m.fr === 7 && m.fc === 0) n.castle.Q = false;
    if (p === "R" && m.fr === 7 && m.fc === 7) n.castle.K = false;
    if (p === "r" && m.fr === 0 && m.fc === 0) n.castle.q = false;
    if (p === "r" && m.fr === 0 && m.fc === 7) n.castle.k = false;
    if (m.tr === 7 && m.tc === 0) n.castle.Q = false;
    if (m.tr === 7 && m.tc === 7) n.castle.K = false;
    if (m.tr === 0 && m.tc === 0) n.castle.q = false;
    if (m.tr === 0 && m.tc === 7) n.castle.k = false;
    n.w = !s.w;
    return n;
  }

  function legal(s) {
    var ps = genPseudo(s), out = [];
    for (var i = 0; i < ps.length; i++) {
      var n = apply(s, ps[i]);
      if (!inCheck(n, s.w)) out.push(ps[i]);
    }
    return out;
  }

  function sameMove(a, b) {
    return a.fr === b.fr && a.fc === b.fc && a.tr === b.tr && a.tc === b.tc
      && a.promo === b.promo && !!a.ep === !!b.ep && a.castle === b.castle;
  }

  function play(s, m) {
    var ms = legal(s);
    for (var i = 0; i < ms.length; i++) if (sameMove(ms[i], m)) return apply(s, ms[i]);
    return null;
  }

  function status(s) {
    var ms = legal(s);
    if (ms.length) return "ok";
    return inCheck(s, s.w) ? "mate" : "ahogado";
  }

  function evalBoard(s) {
    var v = 0;
    for (var r = 0; r < 8; r++)
      for (var c = 0; c < 8; c++) {
        var p = s.sq[r][c];
        if (p === ".") continue;
        var sign = isW(p) ? 1 : -1;
        v += sign * VAL[p.toUpperCase()];
      }
    return v;
  }

  // ponytail: material + depth 3, no quiescence → PST + iterative deepening
  function negamax(s, depth, a, b) {
    var st = status(s);
    if (st === "mate") return -20000 + (3 - depth);
    if (st === "ahogado") return 0;
    if (depth === 0) return evalBoard(s) * (s.w ? 1 : -1);
    var ms = legal(s), best = -1e9;
    ms.sort(function (x, y) {
      var cx = s.sq[x.tr][x.tc] !== "." ? 1 : 0;
      var cy = s.sq[y.tr][y.tc] !== "." ? 1 : 0;
      return cy - cx;
    });
    for (var i = 0; i < ms.length; i++) {
      var sc = -negamax(apply(s, ms[i]), depth - 1, -b, -a);
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
      var sc = -negamax(apply(s, ms[i]), 2, -1e9, 1e9);
      if (sc > bestSc) { bestSc = sc; best = ms[i]; }
    }
    return best;
  }

  return {
    start: start, clone: clone, legal: legal, play: play, apply: apply,
    status: status, inCheck: inCheck, bestMove: bestMove, evalBoard: evalBoard,
    sameMove: sameMove
  };
})();
if (typeof module !== "undefined") module.exports = Ajedrez;
