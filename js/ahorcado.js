var Ahorcado = (function () {
  var WORDS = ["casa", "perro", "gato", "luna", "nube", "fuego", "agua", "bosque", "juego", "teclado", "ventana", "barco", "tren", "libro", "planta"];

  function start(word) {
    var w = word || WORDS[Math.floor(Math.random() * WORDS.length)];
    return { w: w, guessed: {}, lives: 6 };
  }

  function mask(s) {
    var o = "", i;
    for (i = 0; i < s.w.length; i++) o += s.guessed[s.w[i]] ? s.w[i] : "_";
    return o;
  }

  function won(s) { return mask(s).indexOf("_") < 0; }
  function lost(s) { return s.lives <= 0; }

  function guess(s, ch) {
    ch = (ch || "").toLowerCase();
    if (!ch || s.guessed[ch] || won(s) || lost(s)) return s;
    s.guessed[ch] = 1;
    if (s.w.indexOf(ch) < 0) s.lives--;
    return s;
  }

  return { start: start, guess: guess, mask: mask, won: won, lost: lost, WORDS: WORDS };
})();
if (typeof module !== "undefined") module.exports = Ahorcado;
