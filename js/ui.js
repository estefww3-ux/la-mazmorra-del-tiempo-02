// js/ui.js — Menú principal, HUD, pausa y modales
document.addEventListener('DOMContentLoaded', () => {
  const mainMenu = document.getElementById('main-menu');
  const hud = document.getElementById('hud');
  const instructionsModal = document.getElementById('instructions-modal');
  const gameOverModal = document.getElementById('game-over-modal');
  const pauseModal = document.getElementById('pause-modal');

  const on = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  };

  function startGame() {
    Sound.resume();
    Sound.click();
    mainMenu.classList.add('hidden');
    gameOverModal.classList.add('hidden');
    pauseModal.classList.add('hidden');
    hud.classList.remove('hidden');
    Game.start();
  }

  on('btn-start', startGame);
  on('btn-restart', startGame);

  on('btn-instructions', () => {
    Sound.resume();
    Sound.click();
    instructionsModal.classList.remove('hidden');
  });

  on('btn-close-instructions', () => {
    Sound.click();
    instructionsModal.classList.add('hidden');
  });

  on('btn-pause', () => {
    Sound.click();
    Game.togglePause();
  });

  on('btn-resume', () => {
    Sound.click();
    Game.togglePause();
  });

  on('btn-mute', () => Sound.toggleMute());

  on('btn-menu', () => {
    Sound.click();
    Sound.stopMusic();
    Game.state = 'menu';
    Game.currentLevelIndex = 1;
    gameOverModal.classList.add('hidden');
    pauseModal.classList.add('hidden');
    hud.classList.add('hidden');
    mainMenu.classList.remove('hidden');
  });
});