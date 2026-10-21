// js/core/audio.js — Efectos de sonido y música (Web Audio API, sin archivos externos)
const Sound = {
  ctx: null,
  master: null,
  muted: false,
  musicTimer: null,
  step: 0,

  init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.7;
      this.master.connect(this.ctx.destination);
    } catch (e) { /* sin audio disponible */ }
  },

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  tone(freq, dur, opts = {}) {
    if (!this.ctx || this.muted) return;
    const { type = 'square', vol = 0.15, slide = null, delay = 0 } = opts;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  },

  click()  { this.tone(600, 0.1, { type: 'sine', vol: 0.12, slide: 200 }); },
  jump()   { this.tone(280, 0.18, { type: 'square', vol: 0.1, slide: 700 }); },
  star()   {
    this.tone(988, 0.09, { type: 'triangle', vol: 0.18 });
    this.tone(1319, 0.18, { type: 'triangle', vol: 0.18, delay: 0.08 });
  },
  heart()  { [523, 659, 784].forEach((f, i) => this.tone(f, 0.14, { type: 'triangle', vol: 0.18, delay: i * 0.07 })); },
  hurt()   { this.tone(320, 0.35, { type: 'sawtooth', vol: 0.16, slide: 70 }); },
  levelUp() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.16, { type: 'square', vol: 0.12, delay: i * 0.09 })); },
  gameOver() { [392, 330, 262, 196].forEach((f, i) => this.tone(f, 0.3, { type: 'triangle', vol: 0.2, delay: i * 0.22 })); },
  win() {
    [523, 523, 659, 784, 659, 784, 1047].forEach((f, i) =>
      this.tone(f, 0.22, { type: 'square', vol: 0.12, delay: i * 0.14 }));
    this.tone(1047, 0.6, { type: 'triangle', vol: 0.15, delay: 1.0 });
  },

  // Música suave (escala pentatónica japonesa)
  startMusic() {
    this.stopMusic();
    const scale = [220, 247, 262, 330, 349, 440, 494, 523, 659];
    const melody = [5, 3, 4, 3, 2, 3, 1, 0, 5, 6, 5, 4, 3, 2, 3, 1];
    this.step = 0;
    this.musicTimer = setInterval(() => {
      if (typeof Game !== 'undefined' && Game.state !== 'playing') return;
      const n = melody[this.step % melody.length];
      this.tone(scale[n], 0.5, { type: 'triangle', vol: 0.05 });
      if (this.step % 8 === 0) this.tone(110, 1.4, { type: 'sine', vol: 0.07 });
      this.step++;
    }, 260);
  },

  stopMusic() {
    if (this.musicTimer) clearInterval(this.musicTimer);
    this.musicTimer = null;
  },

  toggleMute() {
    this.muted = !this.muted;
    const btn = document.getElementById('btn-mute');
    if (btn) btn.innerText = this.muted ? '🔇' : '🔊';
    return this.muted;
  }
};