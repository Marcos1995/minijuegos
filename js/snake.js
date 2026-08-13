var Snake = (function () {
  var W = 16, H = 16;
  var DIRS = { L: [-1, 0], R: [1, 0], U: [0, -1], D: [0, 1] };
  var OPP = { L: "R", R: "L", U: "D", D: "U" };

  function start() {
    return {
      w: W, h: H,
      body: [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }],
      dir: "R", pending: "R",
      food: { x: 12, y: 8 },
      dead: false, score: 0
    };
  }

  function occ(s) {
    var o = {};
    for (var i = 0; i < s.body.length; i++) o[s.body[i].x + "," + s.body[i].y] = 1;
    return o;
  }

  function placeFood(s) {
    var o = occ(s), spots = [], x, y;
    for (y = 0; y < s.h; y++)
      for (x = 0; x < s.w; x++)
        if (!o[x + "," + y]) spots.push({ x: x, y: y });
    if (!spots.length) return;
    s.food = spots[Math.floor(Math.random() * spots.length)];
  }

  function turn(s, dir) {
    if (!DIRS[dir] || dir === OPP[s.dir]) return s;
    s.pending = dir;
    return s;
  }

  function step(s) {
    if (s.dead) return s;
    s.dir = s.pending;
    var d = DIRS[s.dir], h = s.body[0];
    var nx = h.x + d[0], ny = h.y + d[1];
    if (nx < 0 || ny < 0 || nx >= s.w || ny >= s.h) { s.dead = true; return s; }
    var eat = s.food && nx === s.food.x && ny === s.food.y;
    var o = occ(s);
    var tail = s.body[s.body.length - 1];
    if (!eat) delete o[tail.x + "," + tail.y];
    if (o[nx + "," + ny]) { s.dead = true; return s; }
    s.body.unshift({ x: nx, y: ny });
    if (eat) { s.score++; placeFood(s); }
    else s.body.pop();
    return s;
  }

  return { start: start, step: step, turn: turn, placeFood: placeFood, W: W, H: H };
})();
if (typeof module !== "undefined") module.exports = Snake;
