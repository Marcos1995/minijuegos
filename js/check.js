function runChecks(TicTacToe, Damas, Ajedrez, Parchis, Flappy) {
  function assert(c, m) {
    if (!c) throw new Error(m);
  }

  var t = TicTacToe.start();
  assert(TicTacToe.moves(t.b).length === 9, "tictactoe empty");
  var t2 = TicTacToe.play(t, 0);
  t2 = TicTacToe.play(t2, 3);
  t2 = TicTacToe.play(t2, 1);
  t2 = TicTacToe.play(t2, 4);
  t2 = TicTacToe.play(t2, 2);
  assert(TicTacToe.winner(t2.b) === 1, "tictactoe row win");
  var block = TicTacToe.start();
  block.b = [1, 1, 0, -1, 0, 0, 0, 0, 0];
  block.turn = -1;
  assert(TicTacToe.bestMove(block) === 2, "tictactoe blocks");

  var d = Damas.start();
  assert(Damas.legal(d).length > 0, "damas has moves");
  var cap = Damas.start();
  cap.b = cap.b.map(function (row) { return row.map(function () { return 0; }); });
  cap.b[4][3] = 1;
  cap.b[3][4] = -1;
  cap.turn = 1;
  var jm = Damas.legal(cap);
  assert(jm.length === 1 && jm[0].path.length === 2, "damas must jump");
  assert(jm[0].path[1][0] === 2 && jm[0].path[1][1] === 5, "damas jump land");

  var a = Ajedrez.start();
  assert(Ajedrez.legal(a).length === 20, "chess start 20");
  var e4 = Ajedrez.play(a, { fr: 6, fc: 4, tr: 4, tc: 4, promo: null, ep: false, castle: null });
  assert(e4 && e4.sq[4][4] === "P", "chess e4");
  var e4e5 = Ajedrez.play(e4, { fr: 1, fc: 4, tr: 3, tc: 4, promo: null, ep: false, castle: null });
  var d4 = Ajedrez.play(e4e5, { fr: 6, fc: 3, tr: 4, tc: 3, promo: null, ep: false, castle: null });
  var exd4 = Ajedrez.play(d4, { fr: 3, fc: 4, tr: 4, tc: 3, promo: null, ep: false, castle: null });
  assert(exd4 && exd4.sq[4][3] === "p" && exd4.sq[4][4] === "P", "chess capture");
  var empty = function () {
    return [0, 0, 0, 0, 0, 0, 0, 0].map(function () { return "........".split(""); });
  };
  var castle = Ajedrez.start();
  castle.sq = empty();
  castle.sq[7][4] = "K";
  castle.sq[7][7] = "R";
  castle.sq[0][4] = "k";
  var cms = Ajedrez.legal(castle).filter(function (m) { return m.castle === "K"; });
  assert(cms.length === 1, "chess kingside castle");
  var mate = Ajedrez.start();
  mate.sq = empty();
  mate.sq[0][0] = "k";
  mate.sq[2][2] = "K";
  mate.sq[3][1] = "Q";
  mate.w = true;
  mate.castle = { K: false, Q: false, k: false, q: false };
  var bm = Ajedrez.bestMove(mate);
  assert(bm && bm.fr === 3 && bm.fc === 1 && bm.tr === 1 && bm.tc === 1, "chess mate in 1 Qb7");

  var p = Parchis.withDie(Parchis.start(), 5);
  assert(Parchis.options(p).length === 4, "parchis leave home with 5");
  var p2 = Parchis.applyMove(p, 0);
  assert(p2.tok[0][0] === 0, "parchis on start");
  var p3 = Parchis.withDie(Parchis.start(), 4);
  assert(Parchis.options(p3).length === 0, "parchis 4 stays home");

  var f = Flappy.start();
  var f2 = Flappy.step(f, false);
  assert(f2.y > f.y, "flappy falls");
  var f3 = Flappy.step(f, true);
  assert(f3.vy < 0, "flappy flap");
  return "ok";
}

if (typeof module !== "undefined" && module.exports) {
  console.log(runChecks(
    require("./tictactoe"),
    require("./damas"),
    require("./ajedrez"),
    require("./parchis"),
    require("./flappy")
  ));
}
