import {H_GRID_NUMBER, V_GRID_NUMBER, GRID_SIZE, WINDOW_WIDTH, WINDOW_HEIGHT, GRASS, METAL, WALL, BREAK, BRICK, BOMBE, BOX, BOX_BOMBE, BOX_TNT, BOX_KEY, BOX_GOLD, BOMBE_TIMER, EXPLOSION_SOUNDS, ANIMATION_EXPLOSION, ANIMATION_WALKING_UP_ORIGINAL, ANIMATION_WALKING_DOWN_ORIGINAL, ANIMATION_WALKING_LEFT_ORIGINAL, ANIMATION_WALKING_RIGHT_ORIGINAL, ANIMATION_WALKING_UP_SCORPION, ANIMATION_WALKING_DOWN_SCORPION, ANIMATION_WALKING_LEFT_SCORPION, ANIMATION_WALKING_RIGHT_SCORPION} from './constants.js';

import {isPaire, random100} from './functions.js';

export class Scorpion {
  constructor(gameContainer) {
    this.gameContainer = gameContainer;
    this.blockGrid = gameContainer.blockGrid;

    this.posX = random100(H_GRID_NUMBER-6) + 3;
    this.posY = random100(V_GRID_NUMBER-6) + 3;
    if(isPaire(this.posX) && isPaire(this.posY)) this.posX++;
    this.blockGrid[this.posX][this.posY].contain = GRASS;
    this.blockGrid[this.posX][this.posY].notSolid = true;
    this.blockGrid[this.posX][this.posY].newSprite = "url('img/grass')";
    this.gameContainer.newSpriteBlocks.push(this.blockGrid[this.posX][this.posY]);
    this.offsetX = 0;
    this.offsetY = 0;
    this.speedDivider = 50;
    this.speed = GRID_SIZE/this.speedDivider;

    this.direction = 'left';
    this.nonRandomStack = 0;

    this.upAnimation = ANIMATION_WALKING_UP_SCORPION;
    this.downAnimation = ANIMATION_WALKING_DOWN_SCORPION;
    this.leftAnimation = ANIMATION_WALKING_LEFT_SCORPION;
    this.rightAnimation = ANIMATION_WALKING_RIGHT_SCORPION;
    this.animation = ANIMATION_WALKING_LEFT_SCORPION;
    this.animationFps = 8;
    this.animationTimer = 0;
    this.animationIndex = 0;
    this.animationIndexOffset = 0;

    this.upSprite = "url('img/animation_scorpion/up_0.png')";
    this.downSprite = "url('img/animation_scorpion/down_0.png')";
    this.leftSprite = "url('img/animation_scorpion/left_0.png')";
    this.rightSprite = "url('img/animation_scorpion/right_0.png')";

    this.div = document.createElement('div');

    this.div.style.width = (GRID_SIZE).toString() + 'px';
    this.div.style.height = (GRID_SIZE).toString() + 'px';
    this.div.style.backgroundImage = this.upSprite;
    this.div.style.backgroundRepeat = 'no-repeat';
    this.div.style.backgroundSize = 'cover';
    this.div.style.position = 'absolute';
    this.div.style.display = 'flex';
    this.div.style.transition = "background-image 0.1s ease-in-out";
    this.div.style.zIndex = 100;
    this.div.style.marginLeft = (this.posX * GRID_SIZE + this.offsetX).toString() + 'px';
    this.div.style.marginTop = (this.posY * GRID_SIZE + this.offsetY).toString() + 'px';

    this.gameContainer.div.appendChild(this.div);
    this.gameContainer.scorpions.push(this);
  }

  update() {
    this.findWayAndMove();
    this.updateAnimation();
    if (this.blockGrid[this.posX][this.posY].bombed) {
      this.div.remove();
    }
  }

  changeDirection(newDirection) {
    if (newDirection === 'left') {
      this.animation = this.leftAnimation;
      this.direction = 'left';
    }
    else if (newDirection === 'right') {
      this.animation = this.rightAnimation;
      this.direction = 'right';
    }
    else if (newDirection === 'up') {
      this.animation = this.upAnimation;
      this.direction = 'up';
    }
    else if (newDirection === 'down') {
      this.animation = this.downAnimation;
      this.direction = 'down';
    }
  }

  findWayAndMove() {
    let random = random100();
    if (!this.blockGrid[this.posX][this.posY-1].notSolid && !this.blockGrid[this.posX][this.posY+1].notSolid && !this.blockGrid[this.posX-1][this.posY].notSolid && !this.blockGrid[this.posX+1][this.posY].notSolid){
      this.animation = null;
      this.div.backgroundImage = this.downSprite;
      return null;
    }
    if (random < 30 && this.nonRandomStack === this.speedDivider) {
      if ((this.direction === 'left' || this.direction === 'right') && (this.blockGrid[this.posX][this.posY-1].notSolid || this.blockGrid[this.posX][this.posY+1].notSolid)) {
        if (this.blockGrid[this.posX][this.posY-1].notSolid && this.blockGrid[this.posX][this.posY+1].notSolid) {
          if (random < 15) this.changeDirection('up');
          else this.changeDirection('down');
        }
        else if (this.blockGrid[this.posX][this.posY-1].notSolid) this.changeDirection('up');
        else this.changeDirection('down');
      }
      else if ((this.direction === 'up' || this.direction === 'down') && (this.blockGrid[this.posX+1][this.posY].notSolid || this.blockGrid[this.posX-1][this.posY].notSolid)) {
        if (this.blockGrid[this.posX+1][this.posY].notSolid && this.blockGrid[this.posX-1][this.posY].notSolid) {
          if (random < 15) this.changeDirection('left');
          else this.changeDirection('right');
        }
        else if (this.blockGrid[this.posX+1][this.posY].notSolid) this.changeDirection('right');
        else this.changeDirection('left');
      }
    }if (this.nonRandomStack === this.speedDivider) this.nonRandomStack = 0; this.nonRandomStack++
    if (this.direction === 'left') {
      if (this.blockGrid[this.posX-1][this.posY].notSolid || this.offsetX > 0) {
        this.offsetX -= this.speed;
        if (this.offsetY > this.speed) this.offsetY -= this.speed;
        else if (this.offsetY < -this.speed) this.offsetY += this.speed;
        else this.offsetY = 0;
      }
      else if (this.blockGrid[this.posX][this.posY-1].notSolid && this.blockGrid[this.posX][this.posY+1].notSolid) {
        if (random > 50) {
          this.changeDirection('up');
          this.offsetY -= this.speed;
        }
        else {
          this.changeDirection('down');
          this.offsetY += this.speed;
        }
      }
      else if (this.blockGrid[this.posX][this.posY-1].notSolid) {
        this.changeDirection('up');
        this.offsetY -= this.speed;
      }
      else if (this.blockGrid[this.posX][this.posY+1].notSolid) {
        this.changeDirection('down');
        this.offsetY += this.speed;
      }
      else {
        this.changeDirection('down');
        this.offsetX += this.speed;
      }
    }
    else if (this.direction === 'right') {
      if (this.blockGrid[this.posX+1][this.posY].notSolid || this.offsetX < 0) {
        this.offsetX += this.speed;
        if (this.offsetY > this.speed) this.offsetY -= this.speed;
        else if (this.offsetY < -this.speed) this.offsetY += this.speed;
        else this.offsetY = 0;
      }
      else if (this.blockGrid[this.posX][this.posY-1].notSolid && this.blockGrid[this.posX][this.posY+1].notSolid) {
        if (random > 50) {
          this.changeDirection('up')
          this.offsetY -= this.speed;
        }
        else {
          this.changeDirection('down');
          this.offsetY += this.speed;
        }
      }
      else if (this.blockGrid[this.posX][this.posY-1].notSolid) {
        this.changeDirection('up');
        this.offsetY -= this.speed;
      }
      else if (this.blockGrid[this.posX][this.posY+1].notSolid) {
        this.changeDirection('down');
        this.offsetY += this.speed;
      }
      else {
        this.changeDirection('left');
        this.offsetX -= this.speed;
      }
    }
    else if (this.direction === 'up') {
      if (this.blockGrid[this.posX][this.posY-1].notSolid || this.offsetY > 0) {
        this.offsetY -= this.speed;
        if (this.offsetX > this.speed) this.offsetX -= this.speed;
        else if (this.offsetX < -this.speed) this.offsetX += this.speed;
        else this.offsetX = 0;
      }
      else if (this.blockGrid[this.posX+1][this.posY].notSolid && this.blockGrid[this.posX-1][this.posY].notSolid) {
        if (random > 50) {
          this.changeDirection('left');
          this.offsetX -= this.speed;
        }
        else {
          this.changeDirection('right');
          this.offsetX += this.speed;
        }
      }
      else if (this.blockGrid[this.posX-1][this.posY].notSolid) {
        this.changeDirection('left');
        this.offsetX -= this.speed;
      }
      else if (this.blockGrid[this.posX+1][this.posY].notSolid) {
        this.changeDirection('right');
        this.offsetX += this.speed;
      }
      else {
        this.changeDirection('down');
        this.offsetY += this.speed;
      }
    }
    else if (this.direction === 'down') {
      if (this.blockGrid[this.posX][this.posY+1].notSolid || this.offsetY < 0) {
        this.offsetY += this.speed;
        if (this.offsetX > this.speed) this.offsetX -= this.speed;
        else if (this.offsetX < -this.speed) this.offsetX += this.speed;
        else this.offsetX = 0;
      }
      else if (this.blockGrid[this.posX+1][this.posY].notSolid && this.blockGrid[this.posX-1][this.posY].notSolid) {
        if (random > 50) {
          this.changeDirection('left');
          this.offsetX -= this.speed;
        }
        else {
          this.changeDirection('right');
          this.offsetX += this.speed;
        }
      }
      else if (this.blockGrid[this.posX-1][this.posY].notSolid) {
        this.changeDirection('left');
        this.offsetX -= this.speed;
      }
      else if (this.blockGrid[this.posX+1][this.posY].notSolid) {
        this.changeDirection('right');
        this.offsetX += this.speed;
      }
      else {
        this.changeDirection('up');
        this.offsetY -= this.speed;
      }
    }
    if (this.offsetX < -GRID_SIZE / 2) {
      this.blockGrid[this.posX][this.posY].safe = true;
      this.offsetX += GRID_SIZE;
      this.posX--;
      this.blockGrid[this.posX][this.posY].safe = false;
    }
    if (this.offsetX > GRID_SIZE / 2) {
      this.blockGrid[this.posX][this.posY].safe = true;
      this.offsetX -= GRID_SIZE;
      this.posX++;
      this.blockGrid[this.posX][this.posY].safe = false;
    }
    if (this.offsetY < -GRID_SIZE / 2) {
      this.blockGrid[this.posX][this.posY].safe = true;
      this.offsetY += GRID_SIZE;
      this.posY--;
      this.blockGrid[this.posX][this.posY].safe = false;
    }
    if (this.offsetY > GRID_SIZE / 2) {
      this.blockGrid[this.posX][this.posY].safe = true;
      this.offsetY -= GRID_SIZE;
      this.posY++;
      this.blockGrid[this.posX][this.posY].safe = false;
    }
    this.div.style.marginLeft = (this.posX * GRID_SIZE + this.offsetX).toString() + 'px';
    this.div.style.marginTop = (this.posY * GRID_SIZE + this.offsetY).toString() + 'px';
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

}
