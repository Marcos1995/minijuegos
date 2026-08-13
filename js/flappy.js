var Flappy = (function () {
  var W = 320, H = 480, GAP = 130, PW = 46, G = 0.45, FLAP = -7.2, SPEED = 2.3;

  function start() {
    return { y: H / 2, vy: 0, x: 64, pipes: [{ x: 300, gap: 180 }], dead: false, score: 0, t: 0 };
  }

  function hit(s, p) {
    if (s.y < 8 || s.y > H - 16) return true;
    if (s.x + 14 < p.x || s.x - 10 > p.x + PW) return false;
    return s.y - 10 < p.gap || s.y + 10 > p.gap + GAP;
  }

  function step(s, flap) {
    if (s.dead) return s;
    var n = {
      y: s.y, vy: s.vy, x: s.x, pipes: s.pipes.map(function (p) { return { x: p.x, gap: p.gap }; }),
      dead: false, score: s.score, t: s.t + 1
    };
    if (flap) n.vy = FLAP;
    n.vy += G;
    n.y += n.vy;
    var pipes = [];
    for (var i = 0; i < n.pipes.length; i++) {
      var p = n.pipes[i];
      var nx = p.x - SPEED;
      if (p.x + PW >= s.x && nx + PW < s.x) n.score++;
      if (nx + PW > 0) pipes.push({ x: nx, gap: p.gap });
      if (hit(n, { x: nx, gap: p.gap })) n.dead = true;
    }
    if (!pipes.length || pipes[pipes.length - 1].x < 180) {
      pipes.push({ x: W + 20, gap: 50 + ((n.t * 17) % 220) });
    }
    n.pipes = pipes;
    return n;
  }

  return { start: start, step: step, W: W, H: H, GAP: GAP, PW: PW };
})();
if (typeof module !== "undefined") module.exports = Flappy;
