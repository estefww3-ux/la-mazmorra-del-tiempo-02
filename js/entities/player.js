// js/entities/player.js — Kuromi: movimiento, colisiones y dibujo
const Player = {
  x: 50, y: 350,
  width: 28, height: 38,
  vx: 0, vy: 0,
  speed: 4,
  jumpForce: -11,
  gravity: 0.5,
  maxFall: 12,
  isGrounded: false,
  facing: 1,
  invuln: 0,      // frames de invulnerabilidad tras recibir daño
  coyote: 0,      // margen para saltar justo después de salir de una plataforma
  jumpBuffer: 0,  // margen para saltar justo antes de aterrizar
  walkTime: 0,
  keys: {},

  // Sprite 14x19 (cada píxel = 2px en pantalla)
  SPRITE: [
    '..KK......KK..',
    '.KKKK....KKKK.',
    '.KKKKK..KKKKK.',
    'KKKKKKKKKKKKKK',
    'KKKKKKPPKKKKKK',
    'KKKKKPPPPKKKKK',
    'KKWWWWWWWWWWKK',
    'KWWWWWWWWWWWWK',
    'KWWEWWWWWWEWWK',
    'KWWEWWWWWWEWWK',
    'KWRRWWPPWWRRWK',
    'KKWWWWWWWWWWKK',
    '.KKKKKKKKKKKK.',
    '...KKPPPPKK...',
    '..WWWWWWWWWW..',
    '..WWWWWWWWWW..',
    '..WWWWWWWWWW..'
  ],
  FEET_A: ['...KKK..KKK...', '...KKK..KKK...'],
  FEET_B: ['..KKK....KKK..', '..KKK....KKK..'],
  PAL: { K: '#2a2433', W: '#fff5f7', E: '#1a1523', P: '#ff5fa2', R: '#ffa6c9' },

  init(canvas) {
    this.canvas = canvas;
  },

  resetPosition(level) {
    if (level && level.spawnPoint) {
      this.x = level.spawnPoint.x;
      this.y = level.spawnPoint.y;
      this.vx = 0;
      this.vy = 0;
      this.facing = 1;
      this.isGrounded = false;
      this.coyote = 0;
      this.jumpBuffer = 0;
    }
  },

  isJumpKey(code) {
    return code === 'Space' || code === 'ArrowUp' || code === 'KeyW';
  },

  handleKeyDown(e) {
    this.keys[e.code] = true;
    if (!e.repeat && this.isJumpKey(e.code)) this.jumpBuffer = 8;
  },

  handleKeyUp(e) {
    this.keys[e.code] = false;
  },

  update(level) {
    // Movimiento horizontal
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.vx = -this.speed; this.facing = -1;
    } else if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.vx = this.speed; this.facing = 1;
    } else {
      this.vx = 0;
    }
    if (this.vx !== 0) this.walkTime++;

    // Salto (con coyote time y buffer para que se sienta fluido)
    if (this.isGrounded) this.coyote = 6;
    else if (this.coyote > 0) this.coyote--;
    if (this.jumpBuffer > 0) this.jumpBuffer--;

    if (this.jumpBuffer > 0 && this.coyote > 0) {
      this.vy = this.jumpForce;
      this.isGrounded = false;
      this.coyote = 0;
      this.jumpBuffer = 0;
      Sound.jump();
    }

    // Soltar la tecla corta el salto (salto variable)
    const jumpHeld = this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW'];
    if (!jumpHeld && this.vy < -4) this.vy = -4;

    this.vy = Math.min(this.vy + this.gravity, this.maxFall);

    this.x += this.vx;
    this.x = Math.max(0, Math.min(800 - this.width, this.x));
    this.checkPlatformCollisionsX(level);

    this.y += this.vy;
    this.checkPlatformCollisionsY(level);

    if (this.invuln > 0) this.invuln--;

    // Caída al agua
    if (this.y > 480) {
      Game.loseLife(true);
      return;
    }

    this.checkHazards(level);
    this.checkCollectibles(level);
    this.checkExit(level);
  },

  overlaps(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  },

  get box() {
    return { x: this.x, y: this.y, w: this.width, h: this.height };
  },

  checkPlatformCollisionsX(level) {
    if (!level || !level.platforms) return;
    level.platforms.forEach(plat => {
      if (
        this.x < plat.x + plat.width &&
        this.x + this.width > plat.x &&
        this.y < plat.y + plat.height &&
        this.y + this.height > plat.y
      ) {
        if (this.vx > 0) this.x = plat.x - this.width;
        else if (this.vx < 0) this.x = plat.x + plat.width;
      }
    });
  },

  checkPlatformCollisionsY(level) {
    if (!level || !level.platforms) return;
    this.isGrounded = false;
    level.platforms.forEach(plat => {
      if (
        this.x < plat.x + plat.width &&
        this.x + this.width > plat.x &&
        this.y < plat.y + plat.height &&
        this.y + this.height > plat.y
      ) {
        if (this.vy > 0) {
          this.y = plat.y - this.height;
          this.vy = 0;
          this.isGrounded = true;
        } else if (this.vy < 0) {
          this.y = plat.y + plat.height;
          this.vy = 0;
        }
      }
    });
  },

  checkHazards(level) {
    if (!level || !level.hazards || this.invuln > 0) return;
    const b = this.box;
    for (const h of level.hazards) {
      // Hitbox un poco más pequeña que el dibujo, para que sea justo
      const hb = { x: h.x + 3, y: h.y + 4, w: h.width - 6, h: h.height - 4 };
      if (this.overlaps(b, hb)) {
        Game.loseLife();
        return;
      }
    }
  },

  checkCollectibles(level) {
    if (!level || !level.collectibles) return;
    const b = this.box;
    level.collectibles.forEach(it => {
      if (it.taken) return;
      const ib = { x: it.x - 12, y: it.y - 12, w: 24, h: 24 };
      if (this.overlaps(b, ib)) {
        it.taken = true;
        Game.collect(it);
      }
    });
  },

  checkExit(level) {
    if (!level || !level.exitPoint) return;
    const e = level.exitPoint;
    if (this.overlaps(this.box, { x: e.x, y: e.y, w: e.width, h: e.height })) {
      Game.nextLevel();
    }
  },

  draw(ctx) {
    // Parpadeo mientras es invulnerable
    if (this.invuln > 0 && Math.floor(this.invuln / 4) % 2 === 0) return;

    const flip = this.facing < 0;
    const walking = this.vx !== 0 && this.isGrounded;
    const bob = walking && Math.floor(this.walkTime / 6) % 2 === 0 ? -1 : 0;
    const feet = walking && Math.floor(this.walkTime / 6) % 2 === 0 ? this.FEET_B : this.FEET_A;
    const rows = this.SPRITE.concat(feet);

    // Cola
    ctx.fillStyle = '#2a2433';
    ctx.fillRect(flip ? this.x + this.width : this.x - 4, this.y + 28 + bob, 4, 6);
    ctx.fillStyle = '#ff5fa2';
    ctx.fillRect(flip ? this.x + this.width + 2 : this.x - 4, this.y + 28 + bob, 2, 3);

    Art.sprite(ctx, rows, this.PAL, this.x, this.y + bob, 2, flip);
  }
};