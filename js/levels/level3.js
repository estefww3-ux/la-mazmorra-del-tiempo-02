// js/levels/level3.js — Nivel 3: Difícil (noche con luna, torii, cascadas y luciérnagas)
const Level3 = {
  name: "Nivel 3: Noche de Luna",
  badge: "NIVEL 3",
  subtitle: "DIFÍCIL",
  timeLimit: 60,
  spawnPoint: { x: 40, y: 342 },
  exitPoint: { x: 752, y: 135, width: 40, height: 65 },
  theme: { grass: '#4fae7a', grass2: '#7ad9a0', dirt: '#3a2a5e', dirt2: '#2a1d47', flower: '#e59bff' },

  platforms: [
    { x: 0,   y: 380, width: 120, height: 70,  type: 'ground' },
    { x: 160, y: 330, width: 70,  height: 20,  type: 'float' },
    { x: 270, y: 280, width: 60,  height: 20,  type: 'float' },
    { x: 365, y: 330, width: 80,  height: 20,  type: 'float' },
    { x: 470, y: 380, width: 90,  height: 70,  type: 'ground' },
    { x: 590, y: 330, width: 60,  height: 20,  type: 'float' },
    { x: 680, y: 270, width: 55,  height: 20,  type: 'float' },
    { x: 745, y: 200, width: 55,  height: 250, type: 'ground' }
  ],

  hazards: [
    { x: 395, y: 315, width: 25,  height: 15 },
    { x: 505, y: 365, width: 25,  height: 15 },
    { x: 130, y: 430, width: 330, height: 20 },
    { x: 565, y: 430, width: 175, height: 20 }
  ],

  collectibles: [
    { type: 'star',  x: 195, y: 290 },
    { type: 'star',  x: 300, y: 240 },
    { type: 'star',  x: 710, y: 225 },
    { type: 'heart', x: 405, y: 275 },
    { type: 'heart', x: 620, y: 290 }
  ],

  draw(ctx, t = 0) {
    const sky = Art.cached('l3-sky', c => {
      Art.sky(c, ['#0a0620', '#150b3a', '#1f1150', '#2b1a6b', '#3a2285', '#4c2a95']);
      Art.stars(c, 77, 70, 260);
    });
    ctx.drawImage(sky, 0, 0);

    const scene = Art.cached('l3-scene', c => {
      const leaf = ['#b46cf0', '#9b59e8', '#d29bff', '#7f4bd8'];
      c.globalAlpha = 0.22; Art.disc(c, 690, 115, 52, '#cdb8ff'); c.globalAlpha = 1;
      Art.disc(c, 690, 115, 28, '#fff7d6');
      Art.mountains(c, 340, '#2a1b5c', 1.7, 80);
      Art.mountains(c, 380, '#1d1448', 3.3, 55);
      Art.r(c, 0, 380, 800, 70, '#173a8c');
      Art.tree(c, 330, 400, 0.9, 41, leaf, '#2a1f45');
      Art.tree(c, 600, 400, 0.8, 53, leaf, '#2a1f45');
      Art.gate(c, { x: 20, y: 312, width: 56, height: 68 }, 0, '#e63946', false);
      Art.lantern(c, 215, 296);
      Art.lantern(c, 640, 296);
      Art.tree(c, 40, 430, 1.7, 3, leaf, '#2a1f45');
      Art.tree(c, 785, 430, 1.7, 19, leaf, '#2a1f45');
    });
    ctx.drawImage(scene, 0, 0);

    Art.waterfall(ctx, 235, 200, 22, 212, t);
    Art.waterfall(ctx, 520, 230, 22, 182, t);
    Art.water(ctx, t, 405, '#1c4fb8', '#2a6fe0', '#7fb8ff');
    Art.lotus(ctx, 300, 414);
    Art.lotus(ctx, 420, 418);
    Art.lotus(ctx, 620, 414);

    this.platforms.forEach(p => Art.platform(ctx, p, this.theme));
    this.hazards.forEach(h => Art.spikes(ctx, h, '#ff4d9a', '#ffd0e6'));
    Art.gate(ctx, this.exitPoint, t);
    Art.collectibles(ctx, this, t);
    Art.fireflies(ctx, t, 18, '#ffe680');
    Art.petals(ctx, t, ['#e8b4ff', '#ff9ed8', '#c58cff'], 24);
  }
};