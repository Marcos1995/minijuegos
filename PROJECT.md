<!-- managed-by-telegram-cursor-bot:agent-kit -->
# Contexto del proyecto

## Produccion
- URL: (estático; aún sin deploy)
- Deploy: copiar la carpeta o Pages/Netlify sobre estos HTML

## Stack
- HTML + CSS + JS en el navegador. Sin build, sin npm.
- Hub `index.html`, juegos en `games/`, reglas en `js/`, estilos `app.css`.

## Comandos utiles
- Instalar: nada
- Test: abrir `check.html`, o `node js/check.js` si hay Node
- Dev: abrir `index.html`, o `python -m http.server 8080`

## Notas para el agente
- Preferencias: Ponytail; un HTML por juego; IA = minimax (máquina de contar).
- Cosas que NO tocar: kit `.cursor/`, `AGENTS.md`, secretos.
- Ponytail siempre activo (ver AGENTS.md)

## Fases (todas)

0. Rules + docs (este archivo, README, `.cursor/rules/minijuegos.mdc`)
1. Hub
2. Tres en raya + minimax perfecto
3. Damas (inglesas 8x8) + negamax
4. Ajedrez + negamax (máquina de contar)
5. Parchís simplificado 2 jugadores
6. Flappy Bird (canvas)

## Máquina de contar (ajedrez / damas)

No "piensa": enumera jugadas legales, simula las respuestas del rival hasta una profundidad fija, y en las hojas suma material (o fichas). Elige la jugada con mejor peor caso (minimax / negamax + poda alfa-beta).

- Tres en raya: busca el árbol entero.
- Damas: profundidad 4, fichas (dama = 2).
- Ajedrez: profundidad 3, material (D=9, T=5, A/C=3, P=1).

Techo (ponytail): sin tablas de finales, sin quiescencia, sin redes. Subir profundidad o añadir evaluación de casillas si se queda floja.
