// js/levels/level1.js

const Level1 = {

  name: "Nivel 1: Tutorial de la Mazmorra",

  spawnPoint: { x: 50, y: 350 },

  exitPoint: { x: 730, y: 340, width: 40, height: 80 },

  platforms: [

    { x: 0, y: 420, width: 800, height: 30, color: '#4a3b5c' },

    { x: 0, y: 0, width: 20, height: 450, color: '#4a3b5c' },

    { x: 780, y: 0, width: 20, height: 450, color: '#4a3b5c' },

    { x: 300, y: 320, width: 200, height: 20, color: '#6c5ce7' },

    { x: 150, y: 220, width: 150, height: 20, color: '#6c5ce7' }

  ],

  hazards: [],

  draw(ctx) {

    ctx.fillStyle = '#2ecc71';

    ctx.fillRect(this.exitPoint.x, this.exitPoint.y, this.exitPoint.width, this.exitPoint.height);

    this.platforms.forEach(p => {

      ctx.fillStyle = p.color;

      ctx.fillRect(p.x, p.y, p.width, p.height);

    });

  }

};