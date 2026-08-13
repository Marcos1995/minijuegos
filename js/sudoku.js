var Sudoku = (function () {
  // ponytail: one baked puzzle → generator
  var GIVEN = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
  var SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";

  function start() {
    var b = [], g = [];
    for (var i = 0; i < 81; i++) {
      var v = GIVEN.charAt(i) === "0" ? 0 : +GIVEN.charAt(i);
      b[i] = v;
      g[i] = v > 0;
    }
    return { b: b, g: g };
  }

  function set(s, i, n) {
    if (s.g[i]) return s;
    n = +n;
    if (!(n >= 0 && n <= 9)) return s;
    s.b[i] = n;
    return s;
  }

  function okCell(b, i, n) {
    var r = (i / 9) | 0, c = i % 9, br = r - r % 3, bc = c - c % 3, x, y;
    for (x = 0; x < 9; x++) {
      if (x !== c && b[r * 9 + x] === n) return false;
      if (x !== r && b[x * 9 + c] === n) return false;
    }
    for (y = 0; y < 3; y++)
      for (x = 0; x < 3; x++) {
        var j = (br + y) * 9 + bc + x;
        if (j !== i && b[j] === n) return false;
      }
    return true;
  }

  function won(s) {
    for (var i = 0; i < 81; i++) {
      if (!s.b[i] || !okCell(s.b, i, s.b[i])) return false;
    }
    return true;
  }

  function conflicts(s) {
    var bad = {};
    for (var i = 0; i < 81; i++) {
      if (s.b[i] && !okCell(s.b, i, s.b[i])) bad[i] = 1;
    }
    return bad;
  }

  return { start: start, set: set, won: won, conflicts: conflicts, SOL: SOL, GIVEN: GIVEN };
})();
if (typeof module !== "undefined") module.exports = Sudoku;
