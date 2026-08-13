var Topo = (function () {
  var N = 9;

  function start() {
    return { up: -1, score: 0, miss: 0, t: 0, dead: false };
  }

  function step(s) {
    if (s.dead) return s;
    s.t++;
    if (s.t % 18 === 0) {
      if (s.up >= 0) s.miss++;
      s.up = Math.floor(Math.random() * N);
      if (s.miss >= 5) s.dead = true;
    }
    return s;
  }

  function hit(s, i) {
    if (s.dead) return s;
    if (i === s.up) { s.score++; s.up = -1; }
    else s.miss++;
    if (s.miss >= 5) s.dead = true;
    return s;
  }

  return { start: start, step: step, hit: hit, N: N };
})();
if (typeof module !== "undefined") module.exports = Topo;
