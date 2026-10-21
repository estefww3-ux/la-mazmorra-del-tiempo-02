// js/levels/level1.js — Nivel 1: Primer intento (día en el jardín de cerezos)
const Level1 = {
  name: "Nivel 1: Jardín de los Cerezos",
  badge: "NIVEL 1",
  subtitle: "PRIMER INTENTO",
  timeLimit: 120,
  spawnPoint: { x: 40, y: 332 },
  exitPoint: { x: 742, y: 305, width: 40, height: 65 },
  theme: { grass: '#6cc24a', grass2: '#9be564', dirt: '#7a4e3a', dirt2: '#5d3a2a', flower: '#ff9ec7' },

  platforms: [
    { x: 0,   y: 370, width: 260, height: 80, type: 'ground' },
    { x: 340, y: 370, width: 220, height: 80, type: 'ground' },
    { x: 620, y: 370, width: 180, height: 80, type: 'ground' },
    { x: 150, y: 290, width: 110, height: 22, type: 'float' },
    { x: 400, y: 270, width: 120, height: 22, type: 'float' },
    { x: 570, y: 210, width: 110, height: 22, type: 'float' }
  ],

  hazards: [
    { x: 440, y: 355, width: 40, height: 15, type: 'spikes' }
  ],

  collectibles: [
    { type: 'star',  x: 205, y: 262 },
    { type: 'star',  x: 460, y: 242 },
    { type: 'star',  x: 625, y: 182 },
    { type: 'heart', x: 300, y: 320 },
    { type: 'heart', x: 680, y: 335 }
  ],

  draw(ctx, t = 0) {
    const sky = Art.cached('l1-sky', c =>
      Art.sky(c, ['#7fcdff', '#93d6ff', '#a9deff', '#bfe6ff', '#d3eeff', '#e6f4ff', '#f6e9f7', '#ffdcec']));
    ctx.drawImage(sky, 0, 0);

    Art.cloud(ctx, ((60 + t * 0.12) % 1000) - 150, 90, 2, '#ffffff', '#dcefff');
    Art.cloud(ctx, ((420 + t * 0.08) % 1000) - 150, 150, 1.6, '#ffffff', '#dcefff');
    Art.cloud(ctx, ((700 + t * 0.1) % 1000) - 150, 75, 1.4, '#ffffff', '#dcefff');

    const scene = Art.cached('l1-scene', c => {
      const leaf = ['#ffb7d5', '#ff9ec7', '#ffd1e3', '#f78fb8'];
      Art.mountains(c, 300, '#a7dccf', 1.2, 70);
      Art.mountains(c, 345, '#7fc79d', 3.1, 48);
      Art.pagoda(c, 590, 345, 0.55, '#a98bc9');
      Art.r(c, 0, 346, 800, 104, '#8fd6f6');
      Art.tree(c, 150, 372, 0.8, 11, leaf, '#6b4a3a');
      Art.tree(c, 480, 372, 0.7, 23, leaf, '#6b4a3a');
      Art.lantern(c, 92, 336);
      Art.sign(c, 14, 336);
      Art.tree(c, 40, 430, 1.7, 5, leaf, '#6b4a3a');
      Art.tree(c, 775, 430, 1.7, 9, leaf, '#6b4a3a');
    });
    ctx.drawImage(scene, 0, 0);

    Art.water(ctx, t, 410, '#46b4f0', '#6fd0ff', '#d6f3ff');
    this.platforms.forEach(p => Art.platform(ctx, p, this.theme));
    this.hazards.forEach(h => Art.spikes(ctx, h, '#ff5e9c', '#ffd0e6'));
    Art.gate(ctx, this.exitPoint, t);
    Art.collectibles(ctx, this, t);
    Art.petals(ctx, t, ['#ffc2dc', '#ffb3d1', '#ffe0ee'], 26);
  }
};