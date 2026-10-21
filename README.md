# ⏳ La Mazmorra del Tiempo (EcoPrince-2D)

Videojuego de plataformas 2D colaborativo inspirado en *Prince of Persia*, desarrollado con arquitectura modular en JavaScript y HTML5 Canvas.

## 👥 Equipo de Desarrollo y Roles
- **Integrante 1 (Core Developer):** Físicas, movimiento del personaje, colisiones y gestión global de estados.
- **Integrante 2 (Level Designer 1 & 2):** Creación e implementación del Nivel 1 (Tutorial) y Nivel 2 (Obstáculos y trampas).
- **Integrante 3 (Level Designer 3 & UI):** Creación del Nivel 3 (Laberinto final), interfaz gráfica (HUD) y menús.

## 🏛️ Arquitectura Modular
Para minimizar los conflictos en Git, el código se encuentra estrictamente desacoplado:
- `js/entities/player.js`: Lógica exclusiva del protagonista.
- `js/levels/`: Archivos independientes por cada nivel (`level1.js`, `level2.js`, `level3.js`).
- `js/core/game.js`: Bucle principal y control de escenas.