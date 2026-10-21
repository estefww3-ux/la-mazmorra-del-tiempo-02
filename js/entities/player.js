const Player = {

  x: 50,

  y: 350,

  width: 28,

  height: 38,

  vx: 0,

  vy: 0,

  speed: 4,

  jumpForce: -11,

  gravity: 0.5,

  isGrounded: false,

  keys: {},



  init(canvas) {

    this.canvas = canvas;

  },



  resetPosition(level) {

    if (level && level.spawnPoint) {

      this.x = level.spawnPoint.x;

      this.y = level.spawnPoint.y;

      this.vx = 0;

      this.vy = 0;

    }

  },



  handleKeyDown(e) {

    this.keys[e.code] = true;

  },



  handleKeyUp(e) {

    this.keys[e.code] = false;

  },



  update(level) {

    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {

      this.vx = -this.speed;

    } else if (this.keys['ArrowRight'] || this.keys['KeyD']) {

      this.vx = this.speed;

    } else {

      this.vx = 0;

    }



    if ((this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW']) && this.isGrounded) {

      this.vy = this.jumpForce;

      this.isGrounded = false;

    }



    this.vy += this.gravity;



    this.x += this.vx;

    this.checkPlatformCollisionsX(level);



    this.y += this.vy;

    this.checkPlatformCollisionsY(level);



    this.checkHazards(level);

    this.checkExit(level);

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

    if (!level || !level.hazards) return;

    level.hazards.forEach(hazard => {

      if (

        this.x < hazard.x + hazard.width &&

        this.x + this.width > hazard.x &&

        this.y < hazard.y + hazard.height &&

        this.y + this.height > hazard.y

      ) {

        // Notificar al juego que perdió una vida

        Game.loseLife();

      }

    });

  },



  checkExit(level) {

    if (!level || !level.exitPoint) return;

    const exit = level.exitPoint;

    if (

      this.x < exit.x + exit.width &&

      this.x + this.width > exit.x &&

      this.y < exit.y + exit.height &&

      this.y + this.height > exit.y

    ) {

      // Avanzar al siguiente nivel

      Game.nextLevel();

    }

  },



  draw(ctx) {

    ctx.fillStyle = '#00f5d4';

    ctx.fillRect(this.x, this.y, this.width, this.height);

    

    ctx.fillStyle = '#ff0054';

    ctx.fillRect(this.x + 16, this.y + 8, 8, 4);

  }

};