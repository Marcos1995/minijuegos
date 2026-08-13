var Simon = (function () {
  function start() {
    return { seq: [], input: 0, dead: false, score: 0 };
  }

  function next(s, color) {
    s.seq.push(color === undefined ? Math.floor(Math.random() * 4) : color);
    s.input = 0;
    s.dead = false;
    return s;
  }

  function press(s, c) {
    if (s.dead || !s.seq.length) return s;
    if (s.seq[s.input] !== c) { s.dead = true; return s; }
    s.input++;
    if (s.input === s.seq.length) { s.score++; return { seq: s.seq, input: s.input, dead: false, score: s.score, done: true }; }
    return s;
  }

  return { start: start, next: next, press: press };
})();
if (typeof module !== "undefined") module.exports = Simon;
