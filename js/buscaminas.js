var Buscaminas = (function () {
  var W = 9, H = 9, N = 10;

  function start() {
    return { w: W, h: H, n: N, mines: null, open: {}, flag: {}, dead: false, win: false };
  }

  function idx(x, y, w) { return y * w + x; }

  function neighbors(x, y, w, h) {
    var o = [];
    for (var dy = -1; dy <= 1; dy++)
      for (var dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        var nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) o.push(idx(nx, ny, w));
      }
    return o;
  }

  function place(s, safe) {
    var mines = {}, spots = [], i;
    for (i = 0; i < s.w * s.h; i++) if (i !== safe) spots.push(i);
    for (i = spots.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = spots[i];
      spots[i] = spots[j];
      spots[j] = t;
    }
    for (i = 0; i < s.n; i++) mines[spots[i]] = 1;
    return mines;
  }

  function around(s, i) {
    var x = i % s.w, y = (i / s.w) | 0, n = 0, nb = neighbors(x, y, s.w, s.h);
    for (var k = 0; k < nb.length; k++) if (s.mines[nb[k]]) n++;
    return n;
  }

  function flood(s, i) {
    var q = [i];
    while (q.length) {
      var cur = q.pop();
      if (s.open[cur] || s.flag[cur]) continue;
      s.open[cur] = 1;
      if (s.mines[cur] || around(s, cur)) continue;
      var x = cur % s.w, y = (cur / s.w) | 0, nb = neighbors(x, y, s.w, s.h);
      for (var k = 0; k < nb.length; k++) if (!s.open[nb[k]]) q.push(nb[k]);
    }
  }

  function checkWin(s) {
    var opened = 0;
    for (var k in s.open) if (s.open[k]) opened++;
    s.win = !s.dead && opened === s.w * s.h - s.n;
  }

  function openAt(s, i) {
    if (s.dead || s.win || s.flag[i] || s.open[i]) return s;
    if (!s.mines) s.mines = place(s, i);
    if (s.mines[i]) { s.dead = true; s.open[i] = 1; return s; }
    flood(s, i);
    checkWin(s);
    return s;
  }

  function toggleFlag(s, i) {
    if (s.dead || s.win || s.open[i]) return s;
    if (s.flag[i]) delete s.flag[i];
    else s.flag[i] = 1;
    return s;
  }

  function withMines(mines, w, h) {
    var s = start();
    s.w = w || W;
    s.h = h || H;
    s.n = 0;
    s.mines = {};
    for (var i = 0; i < mines.length; i++) { s.mines[mines[i]] = 1; s.n++; }
    return s;
  }

  return { start: start, openAt: openAt, toggleFlag: toggleFlag, around: around, withMines: withMines, neighbors: neighbors };
})();
if (typeof module !== "undefined") module.exports = Buscaminas;
