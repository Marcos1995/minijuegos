# Minijuegos

Cinco juegos en HTML, sin instalar nada. Abre `index.html` en el navegador.

- **Tres en raya** — contra máquina (minimax).
- **Damas** — variante inglesa 8×8, capturas obligatorias, contra máquina.
- **Ajedrez** — reglas normales (enroque, al paso, coronación a dama). Negras = máquina de contar (negamax, profundidad 3).
- **Parchís** — 2 jugadores, recorrido 40, salís con 5. Máquina greedy.
- **Flappy** — clic / espacio / toque.

```bash
python -m http.server 8080
# check: abrir check.html  (o node js/check.js)
```

## Máquina de contar

En ajedrez y damas la IA no usa redes: genera todas las jugadas, cuenta posiciones unos plies adelante y se queda con la que peor le deja al rival. Detalle en `PROJECT.md`.

## Docs

- `PROJECT.md` — fases, stack, techos de la IA
- `AGENTS.md` — Ponytail
- `.cursor/rules/minijuegos.mdc` — cómo añadir un juego
