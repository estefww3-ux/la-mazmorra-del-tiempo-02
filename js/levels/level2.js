// js/levels/level2.js

const Level2 = {

  name: "Nivel 2: Obstáculos y Trampas",

  mapWidth: 800,

  mapHeight: 450,

  

  // Punto de aparición cómodo al inicio del nivel

  spawnPoint: { x: 40, y: 370 },

  

  // Meta / Salida accesible en una plataforma superior derecha

  exitPoint: { x: 730, y: 50, width: 40, height: 55 },



  // Plataformas diseñadas con un flujo claro de salto en escalera

  platforms: [

    // Suelo principal

    { x: 0, y: 420, width: 800, height: 30, color: '#4a3b5c' },

    

    // Bordes de la mazmorra

    { x: 0, y: 0, width: 20, height: 450, color: '#4a3b5c' },   // Izquierda

    { x: 780, y: 0, width: 20, height: 450, color: '#4a3b5c' },  // Derecha

    { x: 0, y: 0, width: 800, height: 20, color: '#4a3b5c' },   // Techo



    // Escalones y plataformas intermedias bien espaciadas para saltar con comodidad

    { x: 100, y: 320, width: 250, height: 16, color: '#6c5ce7' },

    { x: 420, y: 250, width: 260, height: 16, color: '#6c5ce7' },

    { x: 150, y: 170, width: 240, height: 16, color: '#6c5ce7' },

    { x: 480, y: 110, width: 280, height: 16, color: '#6c5ce7' }

  ],



  // Trampas estratégicas que dejan suficiente espacio en los bordes para pasar caminando o saltando

  hazards: [

    { x: 220, y: 304, width: 35, height: 16, type: 'spikes', color: '#e74c3c' },

    { x: 530, y: 234, width: 35, height: 16, type: 'spikes', color: '#e74c3c' },

    { x: 250, y: 154, width: 35, height: 16, type: 'spikes', color: '#e74c3c' }

  ],



  draw(ctx) {

    // Dibujar Salida / Portal

    ctx.fillStyle = '#2ecc71';

    ctx.fillRect(this.exitPoint.x, this.exitPoint.y, this.exitPoint.width, this.exitPoint.height);



    // Dibujar Plataformas

    this.platforms.forEach(p => {

      ctx.fillStyle = p.color;

      ctx.fillRect(p.x, p.y, p.width, p.height);

    });



    // Dibujar Trampas

    this.hazards.forEach(h => {

      ctx.fillStyle = h.color;

      ctx.fillRect(h.x, h.y, h.width, h.height);

    });

  }

};