// js/levels/level3.js

const Level3 = {
    name: "Nivel 3: El Laberinto Final",
    mapWidth: 800,
    mapHeight: 450,
    
    // Punto de aparición del jugador (Spawn)
    spawnPoint: { x: 50, y: 380 },
    
    // Meta / Salida del laberinto
    exitPoint: { x: 720, y: 60, width: 40, height: 50 },

    // Plataformas y paredes que forman el laberinto
    platforms: [
        // Suelo principal
        { x: 0, y: 420, width: 800, height: 30, color: '#4a3b5c' },
        
        // Paredes y niveles del laberinto
        { x: 0, y: 0, width: 20, height: 450, color: '#4a3b5c' },      // Pared izquierda
        { x: 780, y: 0, width: 20, height: 450, color: '#4a3b5c' },    // Pared derecha
        { x: 0, y: 0, width: 800, height: 20, color: '#4a3b5c' },      // Techo

        // Obstáculos internos (Pasillos del laberinto)
        { x: 120, y: 340, width: 500, height: 20, color: '#6c5ce7' },
        { x: 200, y: 260, width: 580, height: 20, color: '#6c5ce7' },
        { x: 20, y: 180, width: 600, height: 20, color: '#6c5ce7' },
        { x: 150, y: 100, width: 630, height: 20, color: '#6c5ce7' }
    ],

    // Trampas de la mazmorra
    hazards: [
        { x: 300, y: 405, width: 60, height: 15, type: 'spikes', color: '#e74c3c' },
        { x: 450, y: 245, width: 50, height: 15, type: 'spikes', color: '#e74c3c' }
    ],

    // Método para renderizar el nivel en el Canvas
    draw(ctx) {
        // Dibujar Salida / Portal
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.exitPoint.x, this.exitPoint.y, this.exitPoint.width, this.exitPoint.height);

        // Dibujar Plataformas y Paredes
        this.platforms.forEach(plat => {
            ctx.fillStyle = plat.color;
            ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        });

        // Dibujar Trampas
        this.hazards.forEach(hazard => {
            ctx.fillStyle = hazard.color;
            ctx.fillRect(hazard.x, hazard.y, hazard.width, hazard.height);
        });
    }
};