var Breakout = (function () {
  var W = 320, H = 400, PW = 56, PH = 8, BS = 6, COLS = 8, ROWS = 5, BW = 40, BH = 14;

  function bricks() {
    var b = [];
    for (var r = 0; r < ROWS; r++)
      for (var c = 0; c < COLS; c++)
        b.push({ x: c * BW, y: 40 + r * (BH + 4), live: 1 });
    return b;
  }

  function start() {
    return { x: 160, y: 300, vx: 2.2, vy: -2.6, px: 132, bricks: bricks(), score: 0, dead: false, won: false };
  }

  function step(s, left, right) {
    if (s.dead || s.won) return s;
    if (left) s.px -= 5;
    if (right) s.px += 5;
    if (s.px < 0) s.px = 0;
    if (s.px > W - PW) s.px = W - PW;
    s.x += s.vx;
    s.y += s.vy;
    if (s.x < 0) { s.x = 0; s.vx *= -1; }
    if (s.x > W - BS) { s.x = W - BS; s.vx *= -1; }
    if (s.y < 0) { s.y = 0; s.vy *= -1; }
    if (s.y > H) { s.dead = true; return s; }
    if (s.vy > 0 && s.y + BS >= H - 24 && s.y < H - 24 + PH && s.x + BS > s.px && s.x < s.px + PW) {
      s.y = H - 24 - BS;
      s.vy = -Math.abs(s.vy);
      s.vx += (s.x - (s.px + PW / 2)) * 0.08;
    }
    for (var i = 0; i < s.bricks.length; i++) {
      var br = s.bricks[i];
      if (!br.live) continue;
      if (s.x + BS > br.x && s.x < br.x + BW && s.y + BS > br.y && s.y < br.y + BH) {
        br.live = 0;
        s.score += 10;
        s.vy *= -1;
        break;
      }
    }
    var live = 0;
    for (i = 0; i < s.bricks.length; i++) if (s.bricks[i].live) live++;
    if (!live) s.won = true;
    return s;
  }

  return { start: start, step: step, W: W, H: H, PW: PW, PH: PH, BS: BS, BW: BW, BH: BH };
})();
if (typeof module !== "undefined") module.exports = Breakout;
