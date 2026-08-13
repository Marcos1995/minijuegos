function runChecks(P) {
  function assert(c, m) {
    if (!c) throw new Error(m);
  }

  var t = P.TicTacToe.start();
  assert(P.TicTacToe.moves(t.b).length === 9, "tictactoe empty");
  var t2 = P.TicTacToe.play(t, 0);
  t2 = P.TicTacToe.play(t2, 3);
  t2 = P.TicTacToe.play(t2, 1);
  t2 = P.TicTacToe.play(t2, 4);
  t2 = P.TicTacToe.play(t2, 2);
  assert(P.TicTacToe.winner(t2.b) === 1, "tictactoe row win");
  var block = P.TicTacToe.start();
  block.b = [1, 1, 0, -1, 0, 0, 0, 0, 0];
  block.turn = -1;
  assert(P.TicTacToe.bestMove(block) === 2, "tictactoe blocks");

  var d = P.Damas.start();
  assert(P.Damas.legal(d).length > 0, "damas has moves");
  var cap = P.Damas.start();
  cap.b = cap.b.map(function (row) { return row.map(function () { return 0; }); });
  cap.b[4][3] = 1;
  cap.b[3][4] = -1;
  cap.turn = 1;
  var jm = P.Damas.legal(cap);
  assert(jm.length === 1 && jm[0].path.length === 2, "damas must jump");
  assert(jm[0].path[1][0] === 2 && jm[0].path[1][1] === 5, "damas jump land");

  var a = P.Ajedrez.start();
  assert(P.Ajedrez.legal(a).length === 20, "chess start 20");
  var e4 = P.Ajedrez.play(a, { fr: 6, fc: 4, tr: 4, tc: 4, promo: null, ep: false, castle: null });
  assert(e4 && e4.sq[4][4] === "P", "chess e4");
  var e4e5 = P.Ajedrez.play(e4, { fr: 1, fc: 4, tr: 3, tc: 4, promo: null, ep: false, castle: null });
  var d4 = P.Ajedrez.play(e4e5, { fr: 6, fc: 3, tr: 4, tc: 3, promo: null, ep: false, castle: null });
  var exd4 = P.Ajedrez.play(d4, { fr: 3, fc: 4, tr: 4, tc: 3, promo: null, ep: false, castle: null });
  assert(exd4 && exd4.sq[4][3] === "p" && exd4.sq[4][4] === "P", "chess capture");
  var empty = function () {
    return [0, 0, 0, 0, 0, 0, 0, 0].map(function () { return "........".split(""); });
  };
  var castle = P.Ajedrez.start();
  castle.sq = empty();
  castle.sq[7][4] = "K";
  castle.sq[7][7] = "R";
  castle.sq[0][4] = "k";
  var cms = P.Ajedrez.legal(castle).filter(function (m) { return m.castle === "K"; });
  assert(cms.length === 1, "chess kingside castle");
  var mate = P.Ajedrez.start();
  mate.sq = empty();
  mate.sq[0][0] = "k";
  mate.sq[2][2] = "K";
  mate.sq[3][1] = "Q";
  mate.w = true;
  mate.castle = { K: false, Q: false, k: false, q: false };
  var bm = P.Ajedrez.bestMove(mate);
  assert(bm && bm.fr === 3 && bm.fc === 1 && bm.tr === 1 && bm.tc === 1, "chess mate in 1 Qb7");

  var p = P.Parchis.withDie(P.Parchis.start(), 5);
  assert(P.Parchis.options(p).length === 4, "parchis leave home with 5");
  var p2 = P.Parchis.applyMove(p, 0);
  assert(p2.tok[0][0] === 0, "parchis on start");
  var p3 = P.Parchis.withDie(P.Parchis.start(), 4);
  assert(P.Parchis.options(p3).length === 0, "parchis 4 stays home");

  var f = P.Flappy.start();
  var f2 = P.Flappy.step(f, false);
  assert(f2.y > f.y, "flappy falls");
  var f3 = P.Flappy.step(f, true);
  assert(f3.vy < 0, "flappy flap");

  var c4 = P.Cuatro.start();
  c4.b[5] = [1, 1, 1, 0, 0, 0, 0];
  c4.turn = 1;
  c4 = P.Cuatro.play(c4, 3);
  assert(P.Cuatro.winner(c4.b) === 1, "cuatro win");

  assert(P.Reversi.moves(P.Reversi.start()).length === 4, "reversi opening");

  var m9 = P.Buscaminas.withMines([0], 3, 3);
  P.Buscaminas.openAt(m9, 8);
  assert(m9.open[8] && !m9.open[0] && !m9.dead, "mines flood skips mine");

  var sn = P.Snake.start();
  var hx = sn.body[0].x;
  P.Snake.step(sn);
  assert(sn.body[0].x === hx + 1, "snake steps");

  var sl = P.G2048.slideLeft([2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert(sl.b[0] === 4 && sl.score === 4 && sl.moved, "2048 merge");

  var tb = [];
  for (var y = 0; y < 20; y++) {
    tb[y] = [];
    for (var x = 0; x < 10; x++) tb[y][x] = y === 19 && x < 9 ? 1 : 0;
  }
  var tet = P.Tetris.withBoard(tb, { cells: [[0, 0], [0, 1], [0, 2], [0, 3]], x: 9, y: 16, id: 1 });
  P.Tetris.hard(tet);
  assert(tet.lines === 1, "tetris line clear");

  var po = P.Pong.start();
  var px = po.x;
  P.Pong.step(po, false, false);
  assert(po.x !== px, "pong moves");

  assert(P.Breakout.start().bricks.length === 40, "breakout bricks");

  var mem = P.Memory.from(["a", "a", "b", "b"]);
  P.Memory.flip(mem, 0);
  P.Memory.flip(mem, 1);
  P.Memory.flip(mem, 2);
  P.Memory.flip(mem, 3);
  assert(P.Memory.won(mem), "memory pairs");

  var ah = P.Ahorcado.start("sol");
  P.Ahorcado.guess(ah, "s");
  P.Ahorcado.guess(ah, "o");
  P.Ahorcado.guess(ah, "l");
  assert(P.Ahorcado.won(ah), "ahorcado win");

  var p15 = P.Puzzle15.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15]);
  P.Puzzle15.slide(p15, 15);
  assert(P.Puzzle15.won(p15), "puzzle15 last slide");

  var si = P.Simon.next(P.Simon.start(), 1);
  P.Simon.press(si, 0);
  assert(si.dead, "simon miss");

  var su = P.Sudoku.start();
  for (var i = 0; i < 81; i++) P.Sudoku.set(su, i, +P.Sudoku.SOL.charAt(i));
  assert(P.Sudoku.won(su), "sudoku solution");

  var inv = P.Invasores.start();
  P.Invasores.step(inv, false, false, true);
  assert(inv.bullets.length === 1, "invasores shot");

  var lu = P.Luces.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  P.Luces.toggle(lu, 12);
  P.Luces.toggle(lu, 12);
  assert(P.Luces.won(lu), "luces toggle twice");

  var to = P.Topo.start();
  to.up = 3;
  P.Topo.hit(to, 3);
  assert(to.score === 1 && to.up === -1, "topo hit");

  return "ok";
}

if (typeof module !== "undefined" && module.exports) {
  console.log(runChecks({
    TicTacToe: require("./tictactoe"),
    Damas: require("./damas"),
    Ajedrez: require("./ajedrez"),
    Parchis: require("./parchis"),
    Flappy: require("./flappy"),
    Cuatro: require("./cuatro"),
    Reversi: require("./reversi"),
    Buscaminas: require("./buscaminas"),
    Snake: require("./snake"),
    G2048: require("./g2048"),
    Tetris: require("./tetris"),
    Pong: require("./pong"),
    Breakout: require("./breakout"),
    Memory: require("./memory"),
    Ahorcado: require("./ahorcado"),
    Puzzle15: require("./puzzle15"),
    Simon: require("./simon"),
    Sudoku: require("./sudoku"),
    Invasores: require("./invasores"),
    Luces: require("./luces"),
    Topo: require("./topo")
  }));
}
