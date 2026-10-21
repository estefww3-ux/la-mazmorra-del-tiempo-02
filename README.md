# La Mazmorra del Tiempo

Videojuego de plataformas en 2D inspirado en *Prince of Persia*, desarrollado con JavaScript Vanilla y HTML5 Canvas. En esta aventura controlas a Kuromi y recorres tres niveles con escenarios de estilo pixel art pastel, desde un jardín de cerezos durante el día hasta una noche iluminada por la luna. Durante el recorrido tendrás que esquivar pinchos, evitar caer al agua y recoger estrellas y corazones antes de que se acabe el tiempo.


Jugar en línea: https://estefww3-ux.github.io/la-mazmorra-del-tiempo-02/
## Cómo jugar



### Controles

- **Moverse:** flechas izquierda/derecha o teclas A/D.
- **Saltar:** Espacio, W o flecha arriba. Mantén presionada la tecla para saltar más alto.
- **Pausar:** P o Esc.
- **Silenciar sonido:** M.

### Objetivo

Llega al portal torii de cada nivel antes de que termine el tiempo.

- **Estrellas:** suman 50 puntos.
- **Corazones:** recuperan una vida, hasta un máximo de 5.
- **Tiempo restante:** otorga puntos extra al completar el nivel.
- **Vidas:** comienzas con 3. Pierdes una al tocar los pinchos o caer al agua.

## Niveles

- **Nivel 1 – Primer intento:** jardín de cerezos durante el día. Tiempo límite: 2 minutos.
- **Nivel 2 – Intermedio:** atardecer con pagodas y un puente colgante. Tiempo límite: 1 minuto y 30 segundos.
- **Nivel 3 – Difícil:** noche de luna con cascadas y luciérnagas. Tiempo límite: 1 minuto.

## Arquitectura del proyecto

El código está organizado en archivos separados para facilitar su mantenimiento y permitir que los cambios en un nivel no afecten las mecánicas generales del juego.

- `index.html`: estructura principal del juego.
- `css/styles.css`: estilos del HUD, los menús y las ventanas.
- `js/core/game.js`: bucle del juego, estados, puntuación, vidas, tiempo y transiciones.
- `js/core/audio.js`: efectos de sonido generados con Web Audio API.
- `js/core/art.js`: utilidades compartidas para dibujar pixel art.
- `js/entities/player.js`: movimiento, físicas, colisiones y sprites de Kuromi.
- `js/levels/level1.js`: escenario del jardín de cerezos.
- `js/levels/level2.js`: escenario del atardecer y las pagodas.
- `js/levels/level3.js`: escenario de la noche de luna.
- `js/ui.js`: menú principal, pausa y ventanas del juego.

## Desarrollo

Proyecto desarrollado individualmente por Ruth Estefani Huillca Condori, desde la programación de las mecánicas hasta el diseño de los escenarios y la interfaz.

El trabajo incluye el sistema de movimiento y colisiones, el control de vidas y tiempo, las transiciones entre niveles, el diseño de escenarios con colores pastel, los elementos coleccionables y los efectos de sonido retro.
