# Minijuegos

Juegos en HTML, sin instalar nada. En el móvil: https://marcos1995.github.io/minijuegos/

O abre `index.html` en el PC.

Tablero: tres en raya, 4 en raya, damas, ajedrez, reversi, parchís.

Puzzle: buscaminas, 2048, memory, ahorcado, puzzle 15, sudoku, simon, luces.

Arcade: flappy, snake, tetris, pong, breakout, invasores, topo.

```bash
python -m http.server 8080
# check: abrir check.html  (o node js/check.js)
```

## Máquina de contar

En ajedrez, damas y 4 en raya la IA enumera jugadas y elige el peor caso del rival. Reversi usa greedy (más fichas). Detalle en `PROJECT.md`.

## Docs

- `PROJECT.md` — stack y techos
- `AGENTS.md` — Ponytail
- `.cursor/rules/minijuegos.mdc` — cómo añadir un juego
