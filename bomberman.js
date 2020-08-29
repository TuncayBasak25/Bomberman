import {H_GRID_NUMBER, V_GRID_NUMBER, GRID_SIZE, WINDOW_WIDTH, WINDOW_HEIGHT, GRASS, METAL, WALL, BREAK, BRICK, BOMBE, BOX, BOX_BOMBE, BOX_TNT, BOX_KEY, BOX_GOLD, BOMBE_TIMER, EXPLOSION_SOUNDS, ANIMATION_EXPLOSION, ANIMATION_WALKING_UP_ORIGINAL, ANIMATION_WALKING_DOWN_ORIGINAL, ANIMATION_WALKING_LEFT_ORIGINAL, ANIMATION_WALKING_RIGHT_ORIGINAL, ANIMATION_WALKING_UP_ROUGE, ANIMATION_WALKING_DOWN_ROUGE, ANIMATION_WALKING_LEFT_ROUGE, ANIMATION_WALKING_RIGHT_ROUGE} from './constants.js';

export class Bomberman {
  constructor(player = 1) {
    this.player = player;
    this.posX = 1;
    this.posY = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.speed = GRID_SIZE/25;
    this.readyBombes = 0;
    this.maxBombes = 0;
    this.bombes = [];


    this.lives = 3;
    this.invincible = 0;
    this.power = 1;

    this.leftKey = 37;
    this.upKey = 38;
    this.rightKey = 39;
    this.downKey = 40;
    this.bombeKey = 32;
    this.lastDirection = 'down';

    this.leftPressed = false; this.leftReady = false;
    this.rightPressed = false; this.rightReady = false;
    this.upPressed = false; this.upReady = false;
    this.downPressed = false; this.downReady = false;

    this.upAnimation = ANIMATION_WALKING_UP_ORIGINAL;
    this.downAnimation = ANIMATION_WALKING_DOWN_ORIGINAL;
    this.leftAnimation = ANIMATION_WALKING_LEFT_ORIGINAL;
    this.rightAnimation = ANIMATION_WALKING_RIGHT_ORIGINAL;
    this.animation = null;
    this.animationFps = 8;
    this.animationTimer = 0;
    this.animationIndex = 0;
    this.animationIndexOffset = 0;

    this.upSprite = "url('img/animation_bomberman_originale/up_0.png')";
    this.downSprite = "url('img/animation_bomberman_originale/down_0.png')";
    this.leftSprite = "url('img/animation_bomberman_originale/left_0.png')";
    this.rightSprite = "url('img/animation_bomberman_originale/right_0.png')";

    this.player = 1;
    if (player === 2) this.setPlayer2();

    this.div = document.createElement('div');

    this.div.style.width = (GRID_SIZE).toString() + 'px';
    this.div.style.height = (GRID_SIZE).toString() + 'px';
    this.div.style.backgroundImage = "url('img/animation_bomberman_originale/down_0.png')";
    this.div.style.backgroundRepeat = 'no-repeat';
    this.div.style.backgroundSize = 'cover';
    this.div.style.position = 'absolute';
    this.div.style.display = 'flex';
    this.div.style.transition = "background-image 0.05s ease-in-out";
    this.div.style.zIndex = 100;
    this.div.style.marginLeft = (this.posX * GRID_SIZE + this.offsetX).toString() + 'px';
    this.div.style.marginTop = (this.posY * GRID_SIZE + this.offsetY).toString() + 'px';
  }

  setPlayer2() {
    this.setAnimationSourceRouge();
    this.assignTouch(81, 68, 90, 83, 17);
    this.player = 2;
  }

  assignTouch(leftKey, rightKey, upKey, downKey, bombeKey) {
    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.upKey = upKey;
    this.downKey = downKey;
    this.bombeKey = bombeKey;
  }

  setAnimationSourceRouge () {
    this.upSprite = "url('img/animation_bomberman_rouge/up_0.png')";
    this.downSprite = "url('img/animation_bomberman_rouge/down_0.png')";
    this.leftSprite = "url('img/animation_bomberman_rouge/left_0.png')";
    this.rightSprite = "url('img/animation_bomberman_rouge/right_0.png')";

    this.upAnimation = ANIMATION_WALKING_UP_ROUGE;
    this.downAnimation = ANIMATION_WALKING_DOWN_ROUGE;
    this.leftAnimation = ANIMATION_WALKING_LEFT_ROUGE;
    this.rightAnimation = ANIMATION_WALKING_RIGHT_ROUGE;
  }

  addBombe() {
    this.maxBombes++;
    this.readyBombes++;
    this.bombes.push(document.createElement('div'));
    this.gameContainer.bombes.push(this.bombes[this.bombes.length-1]);
    this.bombes[this.bombes.length - 1].posX = -1;
    this.bombes[this.bombes.length - 1].posY = -1;
    this.bombes[this.bombes.length - 1].explosion = -1;
    this.bombes[this.bombes.length - 1].isFree = true;
    this.bombes[this.bombes.length - 1].idNumber = this.maxBombes -1;

    this.bombes[this.bombes.length - 1].style.width = (GRID_SIZE / 2).toString() + 'px';
    this.bombes[this.bombes.length - 1].style.height = (GRID_SIZE / 2).toString() + 'px';
    this.bombes[this.bombes.length - 1].style.backgroundImage = "none";
    this.bombes[this.bombes.length - 1].style.backgroundRepeat = 'no-repeat';
    this.bombes[this.bombes.length - 1].style.backgroundSize = 'cover';
    this.bombes[this.bombes.length - 1].style.position = 'absolute';
    this.bombes[this.bombes.length - 1].style.display = 'flex';
    this.bombes[this.bombes.length - 1].style.zIndex = 101;
    this.bombes[this.bombes.length - 1].style.marginLeft = (GRID_SIZE / 4 + this.bombes[this.bombes.length - 1].posX * GRID_SIZE).toString() + 'px';
    this.bombes[this.bombes.length - 1].style.marginTop = (GRID_SIZE / 4 + this.bombes[this.bombes.length - 1].posY * GRID_SIZE).toString() + 'px';

    this.gameContainer.div.appendChild(this.bombes[this.bombes.length - 1]);
  }


  dropBombe() {
    if (this.readyBombes > 0 && this.blockGrid[this.posX][this.posY].contain !== BOMBE) {
      this.readyBombes--;
      this.updateInfoGrid();
      let bombeSetled = true; //Permet de lacher une bombe et pas plus

      for (var index=0 ; index<this.bombes.length ; index++) {
        let bombe = this.bombes[index];
        if (bombe.isFree && bombeSetled) {
          bombeSetled = false; //Quand on trouve une bombe libre on le set et on ignore le reste
          bombe.isFree = false;
          bombe.posX = this.posX;
          bombe.posY = this.posY;
          this.blockGrid[this.posX][this.posY].contain = BOMBE;
          bombe.style.marginLeft = (GRID_SIZE / 4 + bombe.posX * GRID_SIZE).toString() + 'px';
          bombe.style.marginTop = (GRID_SIZE / 4 + bombe.posY * GRID_SIZE).toString() + 'px';
          bombe.explosion = BOMBE_TIMER;
          bombe.style.backgroundImage = "url('img/bombe.gif')";
        }
      }
    }
  }

  updateInfoGrid() {
    let remainingLives = this.lives;
    let remainingBombes = this.readyBombes;
    let offset = 0;
    if (this.player === 2) offset = (H_GRID_NUMBER+1)/2
    for (var i= offset ; i<(H_GRID_NUMBER-1)/2 + offset ; i++) {
      this.gameContainer.gameInfoGrid[i].style.backgroundImage = "url('img/wall.png')";
      let gameInfo = this.gameContainer.gameInfoGrid[i];
      if (i === 0) this.gameContainer.gameInfoGrid[i].style.backgroundImage = "url('img/animation_bomberman_originale/down_0.png'), url('img/wall.png')";
      else if (i > 1 && i < (H_GRID_NUMBER+1)/2 && remainingLives > 0) {this.gameContainer.gameInfoGrid[i].style.backgroundImage = "url('img/heart.png'), url('img/wall.png')"; remainingLives--;}
      else if (i > this.lives+2 && i < (H_GRID_NUMBER+1)/2 && remainingBombes > 0) {this.gameContainer.gameInfoGrid[i].style.backgroundImage = "url('img/bombe.png'), url('img/wall.png')"; remainingBombes--;}
      else if (this.player === 2 && i === (H_GRID_NUMBER+1)/2) {
        this.gameContainer.gameInfoGrid[i].style.backgroundImage = "url('img/animation_bomberman_rouge/down_0.png'), url('img/wall.png')";
        remainingLives = this.lives;
        remainingBombes = this.readyBombes;
      }
      else if (this.player === 2 && i > (H_GRID_NUMBER+3)/2 && remainingLives > 0) {this.gameContainer.gameInfoGrid[i].style.backgroundImage = "url('img/heart.png'), url('img/wall.png')"; remainingLives--;}
      else if (this. player === 2 && i > (H_GRID_NUMBER+5)/2 + this.lives && remainingBombes > 0) {this.gameContainer.gameInfoGrid[i].style.backgroundImage = "url('img/bombe.png'), url('img/wall.png')"; remainingBombes--;}
    }
  }

  updateBombe() {
    for (var index=0 ; index<this.bombes.length ; index++) {
      let bombe = this.bombes[index];
      if (bombe.explosion > -1) {
        if (bombe.explosion === 0) {
          bombe.style.backgroundImage = 'none';
          EXPLOSION_SOUNDS[bombe.idNumber].pause();
          EXPLOSION_SOUNDS[bombe.idNumber].currentTime = 0;
          EXPLOSION_SOUNDS[bombe.idNumber].play();

          this.resetBombeAnimation(bombe.posX, bombe.posY);
          this.blockGrid[bombe.posX][bombe.posY].animation = ANIMATION_EXPLOSION;
          this.blockGrid[bombe.posX][bombe.posY].animationIndex = 0;
          this.blockGrid[bombe.posX][bombe.posY].animationTimer = 0;
          this.blockGrid[bombe.posX][bombe.posY].animationIndexOffset = 0;
          this.gameContainer.animationBlocks.push(this.blockGrid[bombe.posX][bombe.posY]);
          let reachRight = true;
          let reachLeft = true;
          let reachTop = true;
          let reachBot = true;
          let slowedRight = -1;
          let slowedLeft = -1;
          let slowedTop = -1;
          let slowedBot = -1;
          for (var reach = 1 ; reach <= this.power ; reach++) {
            for (var index2=0 ; index2<this.gameContainer.bombes.length ; index2++) {
              let otherBombe = this.gameContainer.bombes[index2];
              let ox = otherBombe.posX;
              let oy = otherBombe.posY;
              let tx = bombe.posX;
              let ty = bombe.posY;
              if (((tx-reach === ox && ty === oy) || (tx+reach === ox && ty === oy) || (tx === ox && ty-reach === oy) || (tx === ox && ty+reach === oy)) && otherBombe.explosion > reach) {
                otherBombe.explosion = reach * 4;
              }
            }

            if (bombe.posY >= reach && this.blockGrid[bombe.posX][bombe.posY-reach].contain !== METAL && reachTop && this.power - reach > slowedTop) {
              if (this.blockGrid[bombe.posX][bombe.posY-reach].contain === WALL) {
                this.blockGrid[bombe.posX][bombe.posY-reach].contain = BREAK;
                this.blockGrid[bombe.posX][bombe.posY-reach].newSprite = "url('img/break.png'), url('img/wall.png')";
                this.blockGrid[bombe.posX][bombe.posY-reach].newSpriteTimer = 4 * reach;
                this.gameContainer.newSpriteBlocks.push(this.blockGrid[bombe.posX][bombe.posY-reach]);
                reachTop = false;
              }
              else {
                if (this.blockGrid[bombe.posX][bombe.posY-reach].contain === BRICK || this.blockGrid[bombe.posX][bombe.posY-reach].contain === BREAK) reachTop = false;
                if (this.blockGrid[bombe.posX][bombe.posY-reach].contain !== GRASS) slowedTop++;
                if (this.blockGrid[bombe.posX][bombe.posY-reach].contain === BOX_BOMBE) this.addBombe();
                if (this.blockGrid[bombe.posX][bombe.posY-reach].contain === BOX_TNT) this.power++;
                this.blockGrid[bombe.posX][bombe.posY-reach].contain = GRASS;
                this.blockGrid[bombe.posX][bombe.posY-reach].notSolid = true;
                this.resetBombeAnimation(bombe.posX, bombe.posY-reach);
                this.blockGrid[bombe.posX][bombe.posY-reach].animation = ANIMATION_EXPLOSION;
                this.blockGrid[bombe.posX][bombe.posY-reach].animationIndex = -reach;
                this.blockGrid[bombe.posX][bombe.posY-reach].animationIndexOffset = reach;
                this.gameContainer.animationBlocks.push(this.blockGrid[bombe.posX][bombe.posY-reach]);
              }
            }else reachTop = false;
            if (bombe.posY < this.blockGrid[0].length - reach && this.blockGrid[bombe.posX][bombe.posY+reach].contain !== METAL && reachBot && this.power - reach > slowedBot) {
              if (this.blockGrid[bombe.posX][bombe.posY+reach].contain === WALL) {
                this.blockGrid[bombe.posX][bombe.posY+reach].contain = BREAK;
                this.blockGrid[bombe.posX][bombe.posY+reach].newSprite = "url('img/break.png'), url('img/wall.png')";
                this.blockGrid[bombe.posX][bombe.posY+reach].newSpriteTimer = 4 * reach;
                this.gameContainer.newSpriteBlocks.push(this.blockGrid[bombe.posX][bombe.posY+reach]);
                reachBot = false;
              }
              else {
                if (this.blockGrid[bombe.posX][bombe.posY+reach].contain === BRICK || this.blockGrid[bombe.posX][bombe.posY+reach].contain === BREAK) reachBot = false;
                else if (this.blockGrid[bombe.posX][bombe.posY+reach].contain !== GRASS) slowedBot++;
                if (this.blockGrid[bombe.posX][bombe.posY+reach].contain === BOX_BOMBE) this.addBombe();
                if (this.blockGrid[bombe.posX][bombe.posY+reach].contain === BOX_TNT) this.power++;
                this.blockGrid[bombe.posX][bombe.posY+reach].contain = GRASS;
                this.blockGrid[bombe.posX][bombe.posY+reach].notSolid = true;
                this.resetBombeAnimation(bombe.posX, bombe.posY+reach);
                this.blockGrid[bombe.posX][bombe.posY+reach].animation = ANIMATION_EXPLOSION;
                this.blockGrid[bombe.posX][bombe.posY+reach].animationIndex = -reach;
                this.blockGrid[bombe.posX][bombe.posY+reach].animationIndexOffset = reach;
                this.gameContainer.animationBlocks.push(this.blockGrid[bombe.posX][bombe.posY+reach]);
              }
            }else reachBot = false;
            if (bombe.posX >= reach && this.blockGrid[bombe.posX-reach][bombe.posY].contain !== METAL && reachLeft && this.power - reach > slowedLeft) {
              if (this.blockGrid[bombe.posX-reach][bombe.posY].contain === WALL) {
                this.blockGrid[bombe.posX-reach][bombe.posY].contain = BREAK;
                this.blockGrid[bombe.posX-reach][bombe.posY].newSprite = "url('img/break.png'), url('img/wall.png')";
                this.blockGrid[bombe.posX-reach][bombe.posY].newSpriteTimer = 4 * reach;
                this.gameContainer.newSpriteBlocks.push(this.blockGrid[bombe.posX-reach][bombe.posY]);
                reachLeft = false;
              }
              else {
                if (this.blockGrid[bombe.posX-reach][bombe.posY].contain === BRICK || this.blockGrid[bombe.posX-reach][bombe.posY].contain === BREAK) reachLeft = false;
                else if (this.blockGrid[bombe.posX-reach][bombe.posY].contain !== GRASS) slowedLeft++;
                if (this.blockGrid[bombe.posX-reach][bombe.posY].contain === BOX_BOMBE) this.addBombe();
                if (this.blockGrid[bombe.posX-reach][bombe.posY].contain === BOX_TNT) this.power++;
                this.blockGrid[bombe.posX-reach][bombe.posY].contain = GRASS;
                this.blockGrid[bombe.posX-reach][bombe.posY].notSolid = true;
                this.resetBombeAnimation(bombe.posX-reach, bombe.posY);
                this.blockGrid[bombe.posX-reach][bombe.posY].animation = ANIMATION_EXPLOSION;
                this.blockGrid[bombe.posX-reach][bombe.posY].animationIndex = -reach;
                this.blockGrid[bombe.posX-reach][bombe.posY].animationIndexOffset = reach;
                this.gameContainer.animationBlocks.push(this.blockGrid[bombe.posX-reach][bombe.posY]);
              }
            }else reachLeft = false;
            if (bombe.posX < this.blockGrid.length - reach && this.blockGrid[bombe.posX+reach][bombe.posY].contain !== METAL && reachRight && this.power - reach > slowedRight) {
              if (this.blockGrid[bombe.posX+reach][bombe.posY].contain === WALL) {
                this.blockGrid[bombe.posX+reach][bombe.posY].contain = BREAK;
                this.blockGrid[bombe.posX+reach][bombe.posY].newSprite = "url('img/break.png'), url('img/wall.png')";
                this.blockGrid[bombe.posX+reach][bombe.posY].newSpriteTimer = 4 * reach;
                this.gameContainer.newSpriteBlocks.push(this.blockGrid[bombe.posX+reach][bombe.posY]);
                reachRight = false;
              }
              else {
                if (this.blockGrid[bombe.posX+reach][bombe.posY].contain === BRICK || this.blockGrid[bombe.posX+reach][bombe.posY].contain === BREAK) reachRight = false;
                else if (this.blockGrid[bombe.posX+reach][bombe.posY].contain !== GRASS) slowedRight++;
                if (this.blockGrid[bombe.posX+reach][bombe.posY].contain === BOX_BOMBE) this.addBombe();
                if (this.blockGrid[bombe.posX+reach][bombe.posY].contain === BOX_TNT) this.power++;
                this.blockGrid[bombe.posX+reach][bombe.posY].contain = GRASS;
                this.blockGrid[bombe.posX+reach][bombe.posY].notSolid = true;
                this.resetBombeAnimation(bombe.posX+reach, bombe.posY);
                this.blockGrid[bombe.posX+reach][bombe.posY].animation = ANIMATION_EXPLOSION;
                this.blockGrid[bombe.posX+reach][bombe.posY].animationIndex = -reach;
                this.blockGrid[bombe.posX+reach][bombe.posY].animationIndexOffset = reach;
                this.gameContainer.animationBlocks.push(this.blockGrid[bombe.posX+reach][bombe.posY]);
              }
            }else reachRight = false;
          }
          this.blockGrid[bombe.posX][bombe.posY].notSolid = true;
          this.blockGrid[bombe.posX][bombe.posY].contain = GRASS;
          this.readyBombes++;
          this.updateInfoGrid();
          bombe.isFree = true;
          bombe.posX = -1;
          bombe.posY = -1;
        }
        bombe.explosion--;
      }
    }
  }

  update() {
    this.updateBombe();
    this.keyApply();
    this.updateAnimation();
    this.div.style.marginLeft = (this.posX * GRID_SIZE + this.offsetX).toString() + 'px';
    this.div.style.marginTop = (this.posY * GRID_SIZE + this.offsetY).toString() + 'px';
    if (!this.blockGrid[this.posX][this.posY].safe && this.invincible === 0) {
      if (this.lives === 1) alert('DEAD XD');
      this.lives--;
      this.updateInfoGrid();
      this.invincible = 100;
    }
    if (this.invincible > 0) this.invincible--;
  }

  updateAnimation() {
    if (this.animation) {
      if (this.animationTimer <= 0) {
        if (this.animationIndex > -1) this.div.style.backgroundImage = this.animation[this.animationIndex];
        this.animationIndex++;
        if (this.animationIndex === this.animation.length) this.animationIndex = 0;
        this.animationTimer = 60;
      }this.animationTimer -= this.animationFps;
    }
  }

  keyReleaseUpdate(key) {
    if (key === this.leftKey) {
      this.leftPressed = false;
      this.leftReady = false;
      if (!this.rightReady && !this.upReady && !this.downReady && !this.downPressed && !this.upPressed && !this.rightPressed) {
        this.animationTimer = 0;
        this.animationIndex = 0;
        this.animation = null;
        this.div.backgroundImage = this.leftSprite;
      }
      else if (this.upReady) {this.upPressed = true; this.upReady = false; this.animation = this.upAnimation;}
      else if (this.downReady) {this.downPressed = true; this.downReady = false; this.animation = this.downAnimation;}
      else if (this.rightReady) {this.rightPressed = true; this.rightReady = false; this.animation = this.rightAnimation;}
  	}
    // up arrow key
  	else if (key === this.upKey) {
      this.upPressed = false;
      this.upReady = false;
      if (!this.rightReady && !this.leftReady && !this.downReady && !this.downPressed && !this.rightPressed && !this.leftPressed) {
        this.animationTimer = 0;
        this.animationIndex = 0;
        this.animation = null;
        this.div.backgroundImage = this.upSprite;
    	}
      else if (this.rightReady) {this.rightPressed = true; this.rightReady = false; this.animation = this.rightAnimation;}
      else if (this.leftReady) {this.leftPressed = true; this.leftReady = false; this.animation = this.leftAnimation;}
      else if (this.downReady) {this.downPressed = true; this.downReady = false; this.animation = this.downAnimation;}
    }
  	// right arrow key
  	else if (key === this.rightKey) {
      this.rightPressed = false;
      this.rightReady = false;
      if (!this.leftReady && !this.upReady && !this.downReady && !this.downPressed && !this.upPressed && !this.leftPressed) {
        this.animationTimer = 0;
        this.animationIndex = 0;
        this.animation = null;
        this.div.backgroundImage = this.rightSprite;
    	}
      else if (this.upReady) {this.upPressed = true; this.upReady = false; this.animation = this.upAnimation;}
      else if (this.downReady) {this.downPressed = true; this.downReady = false; this.animation = this.downAnimation;}
      else if (this.leftReady) {this.leftPressed = true; this.leftReady = false; this.animation = this.leftAnimation;}
    }
    else if (key === this.downKey) {
      this.downPressed = false;
      this.downReady = false;
      if (!this.rightReady && !this.upReady && !this.leftReady && !this.rightPressed && !this.upPressed && !this.leftPressed) {
        this.animationTimer = 0;
        this.animationIndex = 0;
        this.animation = null;
        this.div.backgroundImage = this.downSprite;
      }
      else if (this.rightReady) {this.rightPressed = true; this.rightReady = false; this.animation = this.rightAnimation;}
      else if (this.leftReady) {this.leftPressed = true; this.leftReady = false; this.animation = this.leftAnimation;}
      else if (this.upReady) {this.upPressed = true; this.upReady = false; this.animation = this.upAnimation;}
    }
    else if (key === this.bombeKey) {
      this.dropBombe();
      this.bombePressed = false;
    }
  }

  keyPressUpdate(key) {
    if (key === this.leftKey) {
  		this.lastPressed = "left";
      if (!this.rightPressed && !this.upPressed && !this.downPressed) {
        this.leftPressed = true;
      }
      else if (!this.upReady && !this.downReady && !this.rightReady) this.leftReady = true;
    }
    // up arrow key
  	else if (key === this.upKey) {
  		this.lastPressed = "up";
      if (!this.downPressed && !this.rightPressed && !this.leftPressed) {
        this.upPressed = true;
      }
      else if (!this.leftReady && !this.downReady && !this.rightReady) this.upReady = true;
    }
  	// right arrow key
  	else if (key === this.rightKey) {
  		this.lastPressed = "right";
      if (!this.leftPressed && !this.upPressed && !this.downPressed) {
        this.rightPressed = true;
      }
      else if (!this.upReady && !this.downReady && !this.leftReady) this.rightReady = true;
    }
    // down arrow key
    else if (key === this.downKey) {
    	this.lastPressed = "down";
      if (!this.upPressed && !this.leftPressed && !this.rightPressed) {
        this.downPressed = true;
      }
      else if (!this.upReady && !this.leftReady && !this.rightReady) this.downReady = true;
    }
    else if (key === this.bombeKey) {
      this.dropBombe();
      this.bombePressed = true;
    }
  }

  keyApply() {
    if (!this.leftPressed && !this.rightPressed && !this.upPressed && !this.downPressed) {
      this.animation = null;
      if (this.lastDirection === 'down') this.div.backgroundImage = this.downSprite;
      if (this.lastDirection === 'up') this.div.backgroundImage = this.upSprite;
      if (this.lastDirection === 'right') this.div.backgroundImage = this.rightSprite;
      if (this.lastDirection === 'left') this.div.backgroundImage = this.leftSprite;
    }
    else if (this.leftPressed) {
      this.lastDirection = 'left'
      this.animation = this.leftAnimation;
      if (this.blockGrid[this.posX - 1][this.posY].notSolid || this.offsetX > 0) {
        this.offsetX -= this.speed;
        if (!this.blockGrid[this.posX - 1][this.posY - 1].notSolid && this.offsetY < 0) this.offsetY += this.speed;
        if (!this.blockGrid[this.posX - 1][this.posY + 1].notSolid && this.offsetY > 0) this.offsetY -= this.speed;
      }
      else if (!this.upReady && !this.downReady) {
        if (this.blockGrid[this.posX - 1][this.posY - 1].notSolid && this.blockGrid[this.posX][this.posY-1].notSolid && this.offsetY < 0 || (this.offsetY === 0 && !this.blockGrid[this.posX][this.posY+1].notSolid)) this.offsetY -= this.speed;
        if (this.blockGrid[this.posX - 1][this.posY + 1].notSolid && this.blockGrid[this.posX][this.posY+1].notSolid && this.offsetY > 0 || (this.offsetY === 0 && !this.blockGrid[this.posX][this.posY-1].notSolid)) this.offsetY += this.speed;
      }
      else if (this.upReady && this.blockGrid[this.posX][this.posY-1].notSolid) {this.leftPressed = false; this.upPressed = true; this.leftReady = true; this.upReady = false;}
      else if (this.downReady && this.blockGrid[this.posX][this.posY+1].notSolid) {this.leftPressed = false; this.downPressed = true; this.leftReady = true; this.downReady = false;}
      this.offsetX = Math.round(this.offsetX);
      this.offsetY = Math.round(this.offsetY);
      if (this.offsetX < -GRID_SIZE / 2) {this.offsetX += GRID_SIZE;this.posX--;}
      if (this.offsetY < -GRID_SIZE / 2) {this.offsetY += GRID_SIZE;this.posY--;}
      if (this.offsetY > GRID_SIZE / 2) {this.offsetY -= GRID_SIZE;this.posY++;}
      this.div.style.marginLeft = (this.posX * GRID_SIZE + this.offsetX).toString() + 'px';
      this.div.style.marginTop = (this.posY * GRID_SIZE + this.offsetY).toString() + 'px';
  	}
  	else if (this.upPressed) {
      this.lastDirection = 'up';
      this.animation = this.upAnimation;
      if (this.blockGrid[this.posX][this.posY - 1].notSolid || this.offsetY > 0) {
        this.offsetY -= this.speed;
        (this.offsetX === 0 && !this.blockGrid[this.posX][this.posY].notSolid)
        if (!this.blockGrid[this.posX - 1][this.posY - 1].notSolid && this.offsetX < 0) this.offsetX += this.speed;
        if (!this.blockGrid[this.posX + 1][this.posY - 1].notSolid && this.offsetX > 0) this.offsetX -= this.speed;
      }
      else if (!this.leftReady && !this.rightReady) {
        if (this.blockGrid[this.posX - 1][this.posY - 1].notSolid && this.blockGrid[this.posX-1][this.posY].notSolid && this.offsetX < 0 || (this.offsetX === 0 && !this.blockGrid[this.posX+1][this.posY].notSolid)) this.offsetX -= this.speed;
        if (this.blockGrid[this.posX + 1][this.posY - 1].notSolid && this.blockGrid[this.posX+1][this.posY].notSolid && this.offsetX > 0 || (this.offsetX === 0 && !this.blockGrid[this.posX-1][this.posY].notSolid)) this.offsetX += this.speed;
      }
      else if (this.leftReady && this.blockGrid[this.posX-1][this.posY].notSolid) {this.upPressed = false; this.leftPressed = true; this.upReady = true; this.leftReady = false;}
      else if (this.rightReady && this.blockGrid[this.posX+1][this.posY].notSolid) {this.upPressed = false; this.rightPressed = true; this.upReady = true; this.rightReady = false;}
      this.offsetX = Math.round(this.offsetX);
      this.offsetY = Math.round(this.offsetY);
      if (this.offsetY < -GRID_SIZE / 2) {this.offsetY += GRID_SIZE;this.posY--;}
      if (this.offsetX < -GRID_SIZE / 2) {this.offsetX += GRID_SIZE;this.posX--;}
      if (this.offsetX > GRID_SIZE / 2) {this.offsetX -= GRID_SIZE;this.posX++;}
      this.div.style.marginLeft = (this.posX * GRID_SIZE + this.offsetX).toString() + 'px';
      this.div.style.marginTop = (this.posY * GRID_SIZE + this.offsetY).toString() + 'px';
  	}
  	else if (this.rightPressed) {
      this.lastDirection = 'right';
      this.animation = this.rightAnimation;
      if (this.blockGrid[this.posX + 1][this.posY].notSolid || this.offsetX < 0) {
        this.offsetX += this.speed;
        if (!this.blockGrid[this.posX + 1][this.posY - 1].notSolid && this.offsetY < 0) this.offsetY += this.speed;
        if (!this.blockGrid[this.posX + 1][this.posY + 1].notSolid && this.offsetY > 0) this.offsetY -= this.speed;
      }
      else if (!this.upReady && !this.downReady) {
        if (this.blockGrid[this.posX + 1][this.posY - 1].notSolid && this.blockGrid[this.posX][this.posY-1].notSolid && this.offsetY < 0 || (this.offsetY === 0 && !this.blockGrid[this.posX][this.posY+1].notSolid)) this.offsetY -= this.speed;
        if (this.blockGrid[this.posX + 1][this.posY + 1].notSolid && this.blockGrid[this.posX][this.posY+1].notSolid && this.offsetY > 0 || (this.offsetY === 0 && !this.blockGrid[this.posX][this.posY-1].notSolid)) this.offsetY += this.speed;
      }
      else if (this.upReady && this.blockGrid[this.posX][this.posY-1].notSolid) {this.rightPressed = false; this.upPressed = true; this.rightReady = true; this.upReady = false;}
      else if (this.downReady && this.blockGrid[this.posX][this.posY+1].notSolid) {this.rightPressed = false; this.downPressed = true; this.rightReady = true; this.downReady = false;}
      this.offsetX = Math.round(this.offsetX);
      this.offsetY = Math.round(this.offsetY);
      if (this.offsetX > GRID_SIZE / 2) {this.offsetX -= GRID_SIZE;this.posX++;}
      if (this.offsetY > GRID_SIZE / 2) {this.offsetY -= GRID_SIZE;this.posY++;}
      if (this.offsetY < -GRID_SIZE / 2) {this.offsetY += GRID_SIZE;this.posY--;}
      this.div.style.marginLeft = (this.posX * GRID_SIZE + this.offsetX).toString() + 'px';
      this.div.style.marginTop = (this.posY * GRID_SIZE + this.offsetY).toString() + 'px';
  	}
    else if (this.downPressed) {
      this.lastDirection = 'down';
      this.animation = this.downAnimation;
      if (this.blockGrid[this.posX][this.posY + 1].notSolid || this.offsetY < 0) {
        this.offsetY += this.speed;
        if (!this.blockGrid[this.posX - 1][this.posY + 1].notSolid && this.offsetX < 0) this.offsetX += this.speed;
        if (!this.blockGrid[this.posX + 1][this.posY + 1].notSolid && this.offsetX > 0) this.offsetX -= this.speed;
      }
      else if (!this.leftReady && !this.rightReady) {
        if (this.blockGrid[this.posX - 1][this.posY + 1].notSolid && this.blockGrid[this.posX-1][this.posY].notSolid && this.offsetX < 0 || (this.offsetX === 0 && !this.blockGrid[this.posX+1][this.posY].notSolid)) this.offsetX -= this.speed;
        if (this.blockGrid[this.posX + 1][this.posY + 1].notSolid && this.blockGrid[this.posX+1][this.posY].notSolid && this.offsetX > 0 || (this.offsetX === 0 && !this.blockGrid[this.posX-1][this.posY].notSolid)) this.offsetX += this.speed;
      }
      else if (this.leftReady && this.blockGrid[this.posX-1][this.posY].notSolid) {this.downPressed = false; this.leftPressed = true; this.downReady = true; this.leftReady = false;}
      else if (this.rightReady && this.blockGrid[this.posX+1][this.posY].notSolid) {this.downPressed = false; this.rightPressed = true; this.downReady = true; this.rightReady = false;}
      this.offsetX = Math.round(this.offsetX);
      this.offsetY = Math.round(this.offsetY);
      if (this.offsetY > GRID_SIZE / 2) {this.offsetY -= GRID_SIZE;this.posY++;}
      if (this.offsetX > GRID_SIZE / 2) {this.offsetX -= GRID_SIZE;this.posX++;}
      if (this.offsetX < -GRID_SIZE / 2) {this.offsetX += GRID_SIZE;this.posX--;}
      this.div.style.marginLeft = (this.posX * GRID_SIZE + this.offsetX).toString() + 'px';
      this.div.style.marginTop = (this.posY * GRID_SIZE + this.offsetY).toString() + 'px';
    }
  }


  resetBombeAnimation(posX, posY) {
    for (var i=0 ; i<this.gameContainer.animationBlocks.length ; i++) {
      if (this.gameContainer.animationBlocks[i].posX === posX && this.gameContainer.animationBlocks[i].posY === posY) {
        this.gameContainer.animationBlocks.splice(i, 1);
        i--;
        return;
      }
    }
  }
}
