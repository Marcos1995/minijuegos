var Pong = (function () {
  var W = 320, H = 240, PH = 48, PW = 8, BS = 6;

  function start() {
    return { x: W / 2, y: H / 2, vx: 2.4, vy: 1.6, p1: H / 2 - PH / 2, p2: H / 2 - PH / 2, s1: 0, s2: 0, dead: false };
  }

  function step(s, up, down) {
    if (up) s.p1 -= 4;
    if (down) s.p1 += 4;
    if (s.p1 < 0) s.p1 = 0;
    if (s.p1 > H - PH) s.p1 = H - PH;
    var t = s.y - PH / 2;
    if (s.p2 < t - 2) s.p2 += 3.2;
    if (s.p2 > t + 2) s.p2 -= 3.2;
    if (s.p2 < 0) s.p2 = 0;
    if (s.p2 > H - PH) s.p2 = H - PH;
    s.x += s.vx;
    s.y += s.vy;
    if (s.y < 0) { s.y = 0; s.vy *= -1; }
    if (s.y > H - BS) { s.y = H - BS; s.vy *= -1; }
    if (s.x < PW && s.y + BS > s.p1 && s.y < s.p1 + PH) { s.x = PW; s.vx = Math.abs(s.vx) + 0.05; s.vy += (s.y - (s.p1 + PH / 2)) * 0.08; }
    if (s.x > W - PW - BS && s.y + BS > s.p2 && s.y < s.p2 + PH) { s.x = W - PW - BS; s.vx = -Math.abs(s.vx) - 0.05; s.vy += (s.y - (s.p2 + PH / 2)) * 0.08; }
    if (s.x < -10) { s.s2++; s.x = W / 2; s.y = H / 2; s.vx = 2.4; s.vy = 1.6; }
    if (s.x > W + 10) { s.s1++; s.x = W / 2; s.y = H / 2; s.vx = -2.4; s.vy = 1.6; }
    return s;
  }

  return { start: start, step: step, W: W, H: H, PH: PH, PW: PW, BS: BS };
})();
if (typeof module !== "undefined") module.exports = Pong;
