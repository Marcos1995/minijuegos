var Invasores = (function () {
  var W = 320, H = 400;

  function start() {
    var aliens = [], r, c;
    for (r = 0; r < 4; r++)
      for (c = 0; c < 8; c++)
        aliens.push({ x: 24 + c * 32, y: 30 + r * 28, live: 1 });
    return { aliens: aliens, px: 150, bullets: [], ab: [], dx: 1.2, score: 0, dead: false, won: false, cool: 0 };
  }

  function step(s, left, right, fire) {
    if (s.dead || s.won) return s;
    if (left) s.px -= 4;
    if (right) s.px += 4;
    if (s.px < 8) s.px = 8;
    if (s.px > W - 24) s.px = W - 24;
    if (s.cool > 0) s.cool--;
    if (fire && s.cool === 0) { s.bullets.push({ x: s.px + 8, y: H - 40 }); s.cool = 12; }
    var i, a, hitEdge = false, live = 0;
    for (i = 0; i < s.aliens.length; i++) {
      a = s.aliens[i];
      if (!a.live) continue;
      live++;
      a.x += s.dx;
      if (a.x < 8 || a.x > W - 20) hitEdge = true;
    }
    if (hitEdge) {
      s.dx *= -1;
      for (i = 0; i < s.aliens.length; i++) {
        if (!s.aliens[i].live) continue;
        s.aliens[i].y += 12;
        if (s.aliens[i].y > H - 60) s.dead = true;
      }
    }
    s.bullets = s.bullets.filter(function (b) {
      b.y -= 6;
      if (b.y < 0) return false;
      for (var k = 0; k < s.aliens.length; k++) {
        a = s.aliens[k];
        if (!a.live) continue;
        if (b.x > a.x && b.x < a.x + 18 && b.y > a.y && b.y < a.y + 14) {
          a.live = 0;
          s.score += 10;
          return false;
        }
      }
      return true;
    });
    if (Math.random() < 0.02) {
      var shooters = s.aliens.filter(function (al) { return al.live; });
      if (shooters.length) {
        a = shooters[Math.floor(Math.random() * shooters.length)];
        s.ab.push({ x: a.x + 8, y: a.y + 14 });
      }
    }
    s.ab = s.ab.filter(function (b) {
      b.y += 3;
      if (b.y > H) return false;
      if (b.x > s.px && b.x < s.px + 20 && b.y > H - 28) { s.dead = true; return false; }
      return true;
    });
    live = 0;
    for (i = 0; i < s.aliens.length; i++) if (s.aliens[i].live) live++;
    if (!live) s.won = true;
    return s;
  }

  return { start: start, step: step, W: W, H: H };
})();
if (typeof module !== "undefined") module.exports = Invasores;
