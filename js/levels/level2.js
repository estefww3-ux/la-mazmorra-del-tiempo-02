// js/levels/level2.js — Nivel 2: Intermedio (atardecer con pagodas y puente colgante)
const Level2 = {
  name: "Nivel 2: Atardecer en los Templos",
  badge: "NIVEL 2",
  subtitle: "INTERMEDIO",
  timeLimit: 90,
  spawnPoint: { x: 40, y: 342 },
  exitPoint: { x: 750, y: 185, width: 40, height: 65 },
  theme: { grass: '#6fae4e', grass2: '#9ad66b', dirt: '#6b3f5a', dirt2: '#4e2c45', flower: '#ffd1e8' },

  platforms: [
    { x: 0,   y: 380, width: 180, height: 70,  type: 'ground' },
    { x: 200, y: 320, width: 90,  height: 20,  type: 'float' },
    { x: 330, y: 380, width: 120, height: 70,  type: 'ground' },
    { x: 480, y: 300, width: 110, height: 8,   type: 'bridge' },
    { x: 640, y: 250, width: 160, height: 200, type: 'ground' }
  ],

  hazards: [
    { x: 365, y: 365, width: 30,  height: 15 },
    { x: 690, y: 235, width: 30,  height: 15 },
    { x: 190, y: 428, width: 140, height: 22 },
    { x: 450, y: 428, width: 190, height: 22 }
  ],

  collectibles: [
    { type: 'star',  x: 245, y: 285 },
    { type: 'star',  x: 520, y: 262 },
    { type: 'star',  x: 705, y: 185 },
    { type: 'heart', x: 150, y: 340 },
    { type: 'heart', x: 395, y: 325 }
  ],

  draw(ctx, t = 0) {
    const sky = Art.cached('l2-sky', c =>
      Art.sky(c, ['#4b2a6b', '#7a3f8f', '#b44f9a', '#e5679f', '#ff8aa0', '#ffab8a', '#ffc78a', '#ffe0a3']));
    ctx.drawImage(sky, 0, 0);

    Art.cloud(ctx, ((100 + t * 0.1) % 1000) - 150, 100, 1.8, '#ffb0cf', '#e68ab5');
    Art.cloud(ctx, ((560 + t * 0.07) % 1000) - 150, 150, 1.4, '#ffc0a8', '#f09c9c');

    const scene = Art.cached('l2-scene', c => {
      const leaf = ['#ff9ad1', '#f77fbe', '#ffc2e2', '#d96ad0'];
      c.globalAlpha = 0.3; Art.disc(c, 400, 320, 64, '#ffe9a8'); c.globalAlpha = 1;
      Art.disc(c, 400, 320, 40, '#fff3c4');
      Art.mountains(c, 330, '#8e4f9f', 2.2, 80);
      Art.pagoda(c, 120, 330, 0.9, '#5b2c78');
      Art.pagoda(c, 300, 335, 0.6, '#5b2c78');
      Art.pagoda(c, 620, 325, 0.75, '#5b2c78');
      Art.mountains(c, 372, '#6d3a8a', 4, 55);
      Art.r(c, 0, 372, 800, 78, '#d96fb4');
      Art.tree(c, 130, 382, 0.8, 31, leaf, '#5a3550');
      Art.lantern(c, 95, 346);
      Art.tree(c, 35, 430, 1.7, 7, leaf, '#5a3550');
      Art.tree(c, 785, 430, 1.7, 13, leaf, '#5a3550');
    });
    ctx.drawImage(scene, 0, 0);

    Art.waterfall(ctx, 545, 330, 28, 82, t);
    Art.water(ctx, t, 410, '#d96fb4', '#f08ac8', '#ffd1e8');
    this.platforms.forEach(p => Art.platform(ctx, p, this.theme));
    this.hazards.forEach(h => Art.spikes(ctx, h, '#ff5e9c', '#ffd0e6'));
    Art.gate(ctx, this.exitPoint, t);
    Art.collectibles(ctx, this, t);
    Art.petals(ctx, t, ['#ffb3d1', '#ffd0a8', '#ffe0ee'], 28);
  }
};