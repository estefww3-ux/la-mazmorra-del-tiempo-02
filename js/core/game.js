// js/core/game.js — Motor principal del juego
const Game = {
  canvas: null,
  ctx: null,
  levels: {},
  currentLevelIndex: 1,

  // Estados: menu | playing | paused | transition | ended
  state: 'menu',

  score: 0,
  lives: 3,
  maxLives: 5,
  timeLeft: 120,
  transitionTimer: 0,
  bonus: 0,

  clock: 0,        // reloj de animación (en frames de 60fps)
  acc: 0,          // acumulador para paso de tiempo fijo
  last: 0,
  STEP: 1 / 60,

  particles: [],
  hudCache: {},

  init() {
    this.canvas = document.getElementById('gameCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.levels = {
      1: typeof Level1 !== 'undefined' ? Level1 : null,
      2: typeof Level2 !== 'undefined' ? Level2 : null,
      3: typeof Level3 !== 'undefined' ? Level3 : null
    };

    Player.init(this.canvas);
    window.addEventListener('keydown', e => this.onKeyDown(e));
    window.addEventListener('keyup', e => Player.handleKeyUp(e));

    this.currentLevelIndex = 1;
    this.last = performance.now();
    requestAnimationFrame(t => this.frame(t));
  },

  onKeyDown(e) {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    if (e.code === 'KeyP' || e.code === 'Escape') { this.togglePause(); return; }
    if (e.code === 'KeyM') { Sound.toggleMute(); return; }
    Player.handleKeyDown(e);
  },

  // ---------- Ciclo principal ----------
  frame(now) {
    const dt = Math.min((now - this.last) / 1000, 0.1);
    this.last = now;

    if (this.state !== 'paused') this.clock += dt * 60;

    if (this.state === 'playing' || this.state === 'transition') {
      this.acc += dt;
      while (this.acc >= this.STEP) {
        this.step();
        this.acc -= this.STEP;
      }
    }

    this.render();
    requestAnimationFrame(t => this.frame(t));
  },

  step() {
    const level = this.levels[this.currentLevelIndex];
    this.updateParticles();

    if (this.state === 'transition') {
      if (--this.transitionTimer <= 0) this.loadLevel(this.currentLevelIndex + 1);
      return;
    }

    this.timeLeft -= this.STEP;
    Player.update(level);
    if (this.state !== 'playing') return;

    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.updateHud();
      this.gameOver('¡Se acabó el tiempo!');
      return;
    }
    this.updateHud();
  },

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const level = this.levels[this.currentLevelIndex] || this.levels[1];
    if (level && typeof level.draw === 'function') level.draw(ctx, this.clock);

    if (this.state !== 'menu') Player.draw(ctx);
    this.drawParticles(ctx);
    if (this.state === 'transition') this.drawBanner(ctx);
  },

  // ---------- Flujo de partida ----------
  start() {
    Sound.resume();
    this.score = 0;
    this.lives = 3;
    this.acc = 0;
    this.particles = [];
    Sound.startMusic();
    this.loadLevel(1);
  },

  loadLevel(index) {
    const level = this.levels[index];
    if (!level) { this.winGame(); return; }

    this.currentLevelIndex = index;
    (level.collectibles || []).forEach(c => { c.taken = false; });
    this.timeLeft = level.timeLimit || 90;
    Player.resetPosition(level);
    Player.invuln = 0;
    this.state = 'playing';
    this.updateHud();
  },

  nextLevel() {
    if (this.state !== 'playing') return;
    this.bonus = Math.floor(this.timeLeft) * 2;
    this.addScore(this.bonus);

    if (this.levels[this.currentLevelIndex + 1]) {
      Sound.levelUp();
      this.state = 'transition';
      this.transitionTimer = 100;
    } else {
      this.winGame();
    }
  },

  loseLife(force = false) {
    if (this.state !== 'playing') return;
    if (!force && Player.invuln > 0) return;

    this.lives--;
    Sound.hurt();
    this.updateHud();

    if (this.lives <= 0) {
      this.gameOver('¡Te has quedado sin vidas!');
    } else {
      Player.resetPosition(this.levels[this.currentLevelIndex]);
      Player.invuln = 90;
    }
  },

  collect(item) {
    if (item.type === 'star') {
      Sound.star();
      this.addScore(50);
      this.spawnBurst(item.x, item.y, '#ffd23f');
    } else {
      Sound.heart();
      if (this.lives < this.maxLives) this.lives++;
      else this.addScore(25);
      this.spawnBurst(item.x, item.y, '#ff4d8d');
    }
    this.updateHud();
  },

  addScore(n) {
    this.score += n;
    this.updateHud();
  },

  gameOver(mensaje) {
    this.state = 'ended';
    Sound.stopMusic();
    Sound.gameOver();
    this.showModal('¡GAME OVER!', `${mensaje} Puntos: ${this.score}`, 'REINTENTAR');
  },

  winGame() {
    this.state = 'ended';
    Sound.stopMusic();
    Sound.win();
    this.showModal('¡VICTORIA!', `¡Escapaste con éxito! Puntos finales: ${this.score}`, 'JUGAR DE NUEVO');
  },

  showModal(title, msg, btnText) {
    const modal = document.getElementById('game-over-modal');
    const t = document.getElementById('game-over-title');
    const m = document.getElementById('game-over-msg');
    const b = document.getElementById('btn-restart');
    if (t) t.innerText = title;
    if (m) m.innerText = msg;
    if (b) b.innerText = btnText;
    if (modal) modal.classList.remove('hidden');
  },

  togglePause() {
    const modal = document.getElementById('pause-modal');
    if (this.state === 'playing') {
      this.state = 'paused';
      if (modal) modal.classList.remove('hidden');
    } else if (this.state === 'paused') {
      this.state = 'playing';
      this.last = performance.now();
      if (modal) modal.classList.add('hidden');
    }
  },

  // ---------- HUD ----------
  setHud(id, value) {
    if (this.hudCache[id] === value) return;
    this.hudCache[id] = value;
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  },

  updateHud() {
    const level = this.levels[this.currentLevelIndex];
    if (level) {
      this.setHud('level-num', level.badge || `NIVEL ${this.currentLevelIndex}`);
      this.setHud('level-sub', level.subtitle || '');
    }
    this.setHud('lives-display', '💗'.repeat(Math.max(0, this.lives)));
    const secs = Math.max(0, Math.ceil(this.timeLeft));
    const mm = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');
    this.setHud('timer-display', `${mm}:${ss}`);
    this.setHud('score-display', String(this.score));
    const timer = document.getElementById('timer-display');
    if (timer) timer.classList.toggle('low', secs <= 10);
  },

  // ---------- Efectos ----------
  spawnBurst(x, y, color) {
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * 2 * i) / 10;
      this.particles.push({ x, y, vx: Math.cos(a) * 2.5, vy: Math.sin(a) * 2.5 - 1, life: 25, color });
    }
  },

  updateParticles() {
    this.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--; });
    this.particles = this.particles.filter(p => p.life > 0);
  },

  drawParticles(ctx) {
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life / 25;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 4, 4);
    });
    ctx.globalAlpha = 1;
  },

  drawBanner(ctx) {
    ctx.fillStyle = 'rgba(20, 10, 50, 0.78)';
    ctx.fillRect(0, 170, 800, 110);
    ctx.textAlign = 'center';
    ctx.font = "16px 'Press Start 2P', monospace";
    ctx.fillStyle = '#ffd23f';
    ctx.fillText('¡NIVEL COMPLETADO!', 400, 215);
    ctx.font = "12px 'Press Start 2P', monospace";
    ctx.fillStyle = '#ffb3dd';
    ctx.fillText(`Bonus de tiempo: +${this.bonus}`, 400, 250);
    ctx.textAlign = 'left';
  }
};

document.addEventListener('DOMContentLoaded', () => Game.init());