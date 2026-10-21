
// js/ui.js

document.addEventListener('DOMContentLoaded', () => {

  const mainMenu = document.getElementById('main-menu');

  const hud = document.getElementById('hud');

  const instructionsModal = document.getElementById('instructions-modal');

  const gameOverModal = document.getElementById('game-over-modal');



  const btnStart = document.getElementById('btn-start');

  const btnInstructions = document.getElementById('btn-instructions');

  const btnCloseInstructions = document.getElementById('btn-close-instructions');

  const btnPause = document.getElementById('btn-pause');

  const btnRestart = document.getElementById('btn-restart');



  // Reproductor de sonido retro básico (Web Audio API)

  function playClickSound() {

    try {

      const ctx = new (window.AudioContext || window.webkitAudioContext)();

      const osc = ctx.createOscillator();

      const gain = ctx.createGain();

      osc.type = 'sine';

      osc.frequency.setValueAtTime(600, ctx.currentTime);

      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);

      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);

      gain.connect(ctx.destination);

      osc.start();

      osc.stop(ctx.currentTime + 0.1);

    } catch (e) {

      // Audio contextual no interactuado aún

    }

  }



  // Eventos

  btnStart.addEventListener('click', () => {

    playClickSound();

    mainMenu.classList.add('hidden');

    hud.classList.remove('hidden');

    

    // ¡CORRECCIÓN CLAVE! Iniciar el motor del juego al hacer clic en JUGAR

    if (typeof Game !== 'undefined' && Game.start) {

      Game.start();

    }

  });



  btnInstructions.addEventListener('click', () => {

    playClickSound();

    instructionsModal.classList.remove('hidden');

  });



  btnCloseInstructions.addEventListener('click', () => {

    playClickSound();

    instructionsModal.classList.add('hidden');

  });



  btnPause.addEventListener('click', () => {

    playClickSound();

    alert("🎮 Juego Pausado");

  });



  if (btnRestart) {

    btnRestart.addEventListener('click', () => {

      playClickSound();

      gameOverModal.classList.add('hidden');

      mainMenu.classList.remove('hidden');

    });

  }

});