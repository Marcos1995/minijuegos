var Memory = (function () {
  var ICONS = ["★", "♥", "●", "▲", "■", "◆", "☀", "☂"];

  function start() {
    var deck = ICONS.concat(ICONS), i, j, t;
    for (i = deck.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = deck[i]; deck[i] = deck[j]; deck[j] = t;
    }
    return { deck: deck, open: [-1, -1], matched: {}, locked: false, moves: 0 };
  }

  function from(deck) {
    return { deck: deck.slice(), open: [-1, -1], matched: {}, locked: false, moves: 0 };
  }

  function won(s) {
    var n = 0;
    for (var k in s.matched) if (s.matched[k]) n++;
    return n === s.deck.length;
  }

  function flip(s, i) {
    if (s.locked || s.matched[i] || i === s.open[0]) return s;
    if (s.open[0] < 0) { s.open[0] = i; return s; }
    if (s.open[1] < 0) {
      s.open[1] = i;
      s.moves++;
      if (s.deck[s.open[0]] === s.deck[i]) {
        s.matched[s.open[0]] = 1;
        s.matched[i] = 1;
        s.open = [-1, -1];
      } else s.locked = true;
    }
    return s;
  }

  function hide(s) {
    s.open = [-1, -1];
    s.locked = false;
    return s;
  }

  return { start: start, from: from, flip: flip, hide: hide, won: won };
})();
if (typeof module !== "undefined") module.exports = Memory;
