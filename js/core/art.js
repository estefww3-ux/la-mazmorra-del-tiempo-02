// js/core/art.js — Utilidades de dibujo pixel art (sin imágenes externas)
const Art = {
  _cache: {},

  rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },

  // Dibuja una capa estática una sola vez y la guarda (mejor rendimiento)
  cached(key, fn) {
    if (!this._cache[key]) {
      const cv = document.createElement('canvas');
      cv.width = 800; cv.height = 450;
      const c = cv.getContext('2d');
      c.imageSmoothingEnabled = false;
      fn(c);
      this._cache[key] = cv;
    }
    return this._cache[key];
  },

  r(c, x, y, w, h, col) {
    c.fillStyle = col;
    c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  },

  sprite(c, rows, pal, x, y, px, flip) {
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let i = 0; i < row.length; i++) {
        const ch = row[flip ? row.length - 1 - i : i];
        if (ch === '.' || !pal[ch]) continue;
        c.fillStyle = pal[ch];
        c.fillRect(Math.round(x + i * px), Math.round(y + r * px), px, px);
      }
    }
  },

  // ---------- Fondo ----------
  sky(c, colors) {
    const h = Math.ceil(450 / colors.length);
    colors.forEach((col, i) => this.r(c, 0, i * h, 800, h, col));
  },

  disc(c, cx, cy, rad, col, px = 4) {
    c.fillStyle = col;
    for (let y = -rad; y <= rad; y += px)
      for (let x = -rad; x <= rad; x += px)
        if (x * x + y * y <= rad * rad) c.fillRect(cx + x, cy + y, px, px);
  },

  mountains(c, baseY, col, seed, amp) {
    c.fillStyle = col;
    for (let x = 0; x < 800; x += 8) {
      let h = amp + Math.sin(x * 0.012 + seed) * amp * 0.6 + Math.sin(x * 0.031 + seed * 2) * amp * 0.25;
      h = Math.round(h / 4) * 4;
      c.fillRect(x, baseY - h, 8, h + 2);
    }
  },

  cloud(c, x, y, s, col, shade) {
    const parts = [[0, 12, 64, 14], [12, 4, 30, 14], [30, 0, 26, 16], [46, 8, 26, 14]];
    parts.forEach(p => this.r(c, x + p[0] * s, y + p[1] * s, p[2] * s, p[3] * s, col));
    this.r(c, x + 2 * s, y + 22 * s, 66 * s, 4 * s, shade);
  },

  stars(c, seed, n, maxY) {
    const rnd = this.rng(seed);
    for (let i = 0; i < n; i++) {
      const s = rnd() < 0.2 ? 3 : 2;
      this.r(c, rnd() * 800, rnd() * maxY, s, s, rnd() < 0.3 ? '#ffd9f2' : '#ffffff');
    }
  },

  tree(c, x, baseY, s, seed, leaf, trunk) {
    this.r(c, x - 7 * s, baseY - 125 * s, 14 * s, 125 * s, trunk);
    this.r(c, x - 3 * s, baseY - 125 * s, 4 * s, 125 * s, 'rgba(255,255,255,0.12)');
    this.r(c, x - 34 * s, baseY - 118 * s, 34 * s, 8 * s, trunk);
    this.r(c, x, baseY - 100 * s, 36 * s, 8 * s, trunk);
    const rnd = this.rng(seed);
    for (let i = 0; i < 110; i++) {
      const a = rnd() * Math.PI * 2;
      const rad = Math.sqrt(rnd()) * 70 * s;
      const px = Math.round((x + Math.cos(a) * rad * 1.25) / 4) * 4;
      const py = Math.round((baseY - 135 * s + Math.sin(a) * rad * 0.8) / 4) * 4;
      const size = Math.round((8 + rnd() * 8) * s / 4) * 4;
      this.r(c, px, py, size, size, leaf[Math.floor(rnd() * leaf.length)]);
    }
  },

  pagoda(c, x, baseY, s, col) {
    for (let k = 0; k < 3; k++) {
      const w = (50 - k * 12) * s;
      const top = baseY - (k + 1) * 26 * s;
      this.r(c, x - w / 2, top, w, 16 * s, col);
      this.r(c, x - w / 2 - 8 * s, top - 6 * s, w + 16 * s, 6 * s, col);
    }
    this.r(c, x - 2 * s, baseY - 3 * 26 * s - 22 * s, 4 * s, 16 * s, col);
  },

  lantern(c, x, y) {
    this.r(c, x - 2, y, 4, 34, '#3b2a3f');
    this.r(c, x - 9, y - 15, 18, 17, '#2b2036');
    this.r(c, x - 6, y - 12, 12, 11, '#ffd666');
    c.globalAlpha = 0.18;
    this.r(c, x - 22, y - 28, 44, 44, '#ffd666');
    c.globalAlpha = 1;
  },

  sign(c, x, y) {
    this.r(c, x + 10, y + 12, 6, 24, '#6b4a3a');
    this.r(c, x, y, 26, 18, '#c89b6d');
    this.r(c, x + 2, y - 4, 5, 5, '#c89b6d');
    this.r(c, x + 19, y - 4, 5, 5, '#c89b6d');
    this.r(c, x + 7, y + 7, 3, 3, '#6b4a3a');
    this.r(c, x + 16, y + 7, 3, 3, '#6b4a3a');
  },

  lotus(c, x, y) {
    this.r(c, x - 14, y, 28, 5, '#2f8f5b');
    this.r(c, x - 6, y - 6, 12, 6, '#ff9ed8');
    this.r(c, x - 3, y - 9, 6, 4, '#ffd1ee');
  },

  // ---------- Animados ----------
  petals(c, t, cols, n) {
    for (let i = 0; i < n; i++) {
      const sp = 0.4 + (i % 4) * 0.18;
      const x = ((i * 131 + t * sp * 0.8 + Math.sin(t * 0.03 + i) * 18) % 860) - 30;
      const y = ((i * 71 + t * sp) % 480) - 15;
      const s = 3 + (i % 3);
      this.r(c, x, y, s, s - 1, cols[i % cols.length]);
    }
  },

  fireflies(c, t, n, col) {
    for (let i = 0; i < n; i++) {
      const x = ((i * 97) % 800) + Math.sin(t * 0.02 + i) * 22;
      const y = 110 + ((i * 53) % 260) + Math.cos(t * 0.025 + i * 2) * 15;
      c.globalAlpha = 0.18 + 0.18 * Math.sin(t * 0.1 + i);
      this.r(c, x - 3, y - 3, 9, 9, col);
      c.globalAlpha = 0.9;
      this.r(c, x, y, 3, 3, col);
    }
    c.globalAlpha = 1;
  },

  waterfall(c, x, y, w, h, t) {
    this.r(c, x, y, w, h, '#8fdcff');
    c.fillStyle = 'rgba(255,255,255,0.7)';
    for (let i = 0; i < w / 6; i++) {
      const sy = y + ((t * 2 + i * 23) % h);
      c.fillRect(x + i * 6 + 1, sy, 3, Math.min(10, y + h - sy));
    }
  },

  water(c, t, y, base, mid, hi) {
    this.r(c, 0, y, 800, 450 - y, base);
    for (let row = 0; y + row * 12 < 450; row++) {
      const yy = y + row * 12;
      for (let k = 0; k < 12; k++) {
        const x = ((k * 70 + row * 31 + t * (0.3 + row * 0.05)) % 860) - 30;
        this.r(c, x, yy + 4, 28, 3, mid);
      }
      for (let k = 0; k < 6; k++) {
        const x = ((((k * 140 + row * 53 - t * 0.4) % 860) + 860) % 860) - 30;
        this.r(c, x, yy + 8, 10, 2, hi);
      }
    }
  },

  // ---------- Elementos del nivel ----------
  platform(c, p, th) {
    const { x, y, width: w, height: h } = p;
    const type = p.type || 'ground';

    if (type === 'bridge') {
      this.r(c, x, y, w, h, '#8a5a3b');
      this.r(c, x, y, w, 2, '#b57a4f');
      for (let i = 0; i < w; i += 10) this.r(c, x + i, y, 2, h, '#5e3a24');
      this.r(c, x - 2, y - 14, 6, 24, '#5e3a24');
      this.r(c, x + w - 4, y - 14, 6, 24, '#5e3a24');
      for (let i = 0; i < w; i += 4)
        this.r(c, x + i, y + 10 + Math.sin(i / w * Math.PI) * 8, 4, 2, '#c9a26b');
      return;
    }

    const grassH = 8;
    const rnd = this.rng(x * 7 + y * 13 + w);

    if (type === 'float') {
      const rows = Math.ceil((h - grassH) / 4) + 3;
      for (let r = 0; r < rows; r++) {
        const inset = Math.min(r * 3, w / 2 - 6);
        this.r(c, x + inset, y + grassH + r * 4, w - inset * 2, 4, r % 2 ? th.dirt2 : th.dirt);
      }
    } else {
      this.r(c, x, y + grassH, w, h - grassH, th.dirt);
      const n = Math.floor(w * h / 500);
      for (let i = 0; i < n; i++)
        this.r(c, x + rnd() * (w - 6), y + grassH + 4 + rnd() * (h - grassH - 8), 6, 6, th.dirt2);
    }

    this.r(c, x, y, w, grassH, th.grass);
    this.r(c, x, y, w, 3, th.grass2);
    for (let i = 0; i < w; i += 8) this.r(c, x + i, y + grassH, 4, 3 + ((i / 8) % 2) * 3, th.grass);
    for (let i = 0; i < w - 4; i += 14) this.r(c, x + i + 3, y - 3, 2, 3, th.grass2);
    for (let i = 0; i < w - 14; i += 26) {
      const fx = x + 8 + i + rnd() * 8;
      const fy = y - 5;
      this.r(c, fx - 2, fy, 6, 2, th.flower);
      this.r(c, fx, fy - 2, 2, 6, th.flower);
      this.r(c, fx, fy, 2, 2, '#ffe066');
    }
  },

  spikes(c, h, col, tip) {
    const n = Math.max(1, Math.floor(h.width / 10));
    const sw = h.width / n;
    for (let i = 0; i < n; i++) {
      const cx = h.x + i * sw + sw / 2;
      for (let r = 0; r < h.height; r += 3) {
        const w = Math.max(2, Math.round(sw * (r + 3) / h.height));
        this.r(c, cx - w / 2, h.y + r, w, 3, r < 6 ? tip : col);
      }
    }
  },

  gate(c, e, t, col = '#e63946', glowOn = true) {
    const { x, y, width: w, height: h } = e;
    if (glowOn) {
      const a = 0.35 + 0.2 * Math.sin(t * 0.08);
      c.fillStyle = `rgba(255,240,150,${a})`;
      c.fillRect(x + 6, y + 10, w - 12, h - 10);
      c.fillStyle = `rgba(255,255,255,${a * 0.8})`;
      c.fillRect(x + 12, y + 18, w - 24, h - 24);
    }
    this.r(c, x + 3, y + 6, 6, h - 6, col);
    this.r(c, x + w - 9, y + 6, 6, h - 6, col);
    this.r(c, x - 4, y, w + 8, 7, col);
    this.r(c, x - 4, y + 7, w + 8, 2, '#9d1c28');
    this.r(c, x + 3, y + 16, w - 6, 4, col);
    if (glowOn) {
      for (let i = 0; i < 3; i++) {
        const sx = x + 10 + ((t * 0.7 + i * 13) % (w - 20));
        const sy = y + h - ((t * 0.9 + i * 21) % (h - 12));
        this.r(c, sx, sy, 2, 2, '#ffffff');
      }
    }
  },

  collectibles(c, level, t) {
    const HEART = ['.XX.XX.', 'XHXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];
    const STAR = ['...X...', '..XXX..', 'XHXXXXX', '.XXXXX.', '..XXX..', '.XX.XX.', '.X...X.'];
    (level.collectibles || []).forEach(it => {
      if (it.taken) return;
      const bob = Math.sin(t * 0.07 + it.x * 0.05) * 3;
      const cx = it.x, cy = it.y + bob;
      if (it.type === 'star') {
        c.globalAlpha = 0.22; this.r(c, cx - 14, cy - 14, 28, 28, '#ffe680'); c.globalAlpha = 1;
        this.sprite(c, STAR, { X: '#ffd23f', H: '#fff3a8' }, cx - 10, cy - 10, 3, false);
      } else {
        c.globalAlpha = 0.2; this.r(c, cx - 14, cy - 12, 28, 24, '#ff8fb8'); c.globalAlpha = 1;
        this.sprite(c, HEART, { X: '#ff4d8d', H: '#ffd0e6' }, cx - 10, cy - 9, 3, false);
      }
    });
  }
};