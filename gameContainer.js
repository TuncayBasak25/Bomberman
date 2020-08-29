import {H_GRID_NUMBER, V_GRID_NUMBER, GRID_SIZE, WINDOW_WIDTH, WINDOW_HEIGHT, GRASS, METAL, WALL, BREAK, BRICK, BOMBE, BOX, BOX_BOMBE, BOX_TNT, BOX_KEY, BOX_GOLD, BOMBE_TIMER, EXPLOSION_SOUNDS} from './constants.js';

import {isPaire, random100} from './functions.js';



export class GameContainer {
  constructor(bomberman, bomberman2 = null, modelGrid = null) {
    document.body.style.backgroundImage = "url('img/wall.png')";

    this.div = document.createElement('div');
    this.div.style.width = WINDOW_WIDTH.toString() + 'px';
    this.div.style.height = WINDOW_HEIGHT.toString() + 'px';
    this.div.style.marginLeft = 'auto';
    this.div.style.marginRight = 'auto';
    this.div.style.backgroundColor = 'green';
    this.div.style.marginTop = 'calc((100vh - ' + WINDOW_HEIGHT + 'px) / 2)'; //Centre l'aire du jeu verticalement s'il y a de l'espace en bas de page
    this.div.style.display = 'flex';
    this.div.style.flexWrap = 'nowrap';
    document.body.appendChild(this.div);

    this.bombes = [];
    this.animationBlocks = [];
    this.newSpriteBlocks = [];

    if (!modelGrid) {
      this.randomList = [];
      this.regenerate = false;
    }
    else {
      this.randomList = modelGrid;
      this.regenerate = true;
    }

    this.generateGrid();

    this.scorpions = [];

    this.bomberman = bomberman;
    this.bomberman.gameContainer = this;
    this.bomberman.blockGrid = this.blockGrid;
    this.div.appendChild(this.bomberman.div);
    this.bomberman.addBombe();

    this.bomberman2 = bomberman2;
    if (this.bomberman2) {
      this.bomberman2.gameContainer = this;
      this.bomberman2.blockGrid = this.blockGrid;
      this.div.appendChild(this.bomberman2.div);
      this.bomberman2.addBombe();
    }

    this.generateInfoGrid();
  }

  generateGrid() {
    this.blockGrid = []; // Array containing all blocks
    let randomCounter = 0;
    for (var hg = 0; hg < H_GRID_NUMBER; hg++) {
      this.blockGrid.push([]);
      for (var vg = 0; vg < V_GRID_NUMBER; vg++) {
        let contain = METAL;
        let notSolid = false;
        if (hg > 0 && hg < H_GRID_NUMBER-1 && vg > 0 && vg < V_GRID_NUMBER-1) {//&& (!isPaire(hg) || !isPaire(vg))) { //Si vous le rajoutez ce code crée des mur en metal aux centre de chaque 3x3
          let random;
          if (this.regenerate) {
            random = parseInt(this.randomList[randomCounter]);
            randomCounter++;
          }
          else {
            random = random100();
            this.randomList.push(random);
          }
          if (random >=0 && random < 60) contain = GRASS;
          else if (random >=60 && random < 70) contain = BRICK;
          else if (random >=70 && random < 85) contain = WALL;
          else if (random >=85 && random < 95) contain = BOX;
          else if (random >=95 && random < 96) contain = BOX_BOMBE;
          else if (random >=96 && random < 97) contain = BOX_TNT;
          else if (random >=97 && random < 100) contain = BOX_GOLD;
        }

        if (contain === GRASS) {
          notSolid = true;
        }
        else if (hg === 1 && vg === 1 || hg === 1 && vg === 2 || hg === 2 && vg === 1) { //On se rassure qu'il y a au moin trois case vide pour notre joueur
          contain = GRASS;
          notSolid = true;
        }
        if (hg === H_GRID_NUMBER-2 && vg === V_GRID_NUMBER-2) {contain = BOX_KEY; notSolid = false;}

        this.blockGrid[hg].push(document.createElement('div'));

        this.blockGrid[hg][vg].posX = hg;
        this.blockGrid[hg][vg].posY = vg;
        this.blockGrid[hg][vg].contain = contain;
        this.blockGrid[hg][vg].notSolid = notSolid;
        this.blockGrid[hg][vg].safe = true;
        this.blockGrid[hg][vg].bombed = false;

        this.blockGrid[hg][vg].animation;
        this.blockGrid[hg][vg].animationIndex = 0;
        this.blockGrid[hg][vg].animationIndexOffset = 0;
        this.blockGrid[hg][vg].animationFps = 0;
        this.blockGrid[hg][vg].animationTimer = 0;

        this.blockGrid[hg][vg].newSprite = null;
        this.blockGrid[hg][vg].newSpriteTimer = 0;

        this.blockGrid[hg][vg].style.width = GRID_SIZE.toString() + 'px';
        this.blockGrid[hg][vg].style.height = GRID_SIZE.toString() + 'px';
        this.blockGrid[hg][vg].style.position = 'absolute';
        if (this.blockGrid[hg][vg].contain === METAL) this.blockGrid[hg][vg].style.backgroundImage = "url('img/metal.png')";
        else if (this.blockGrid[hg][vg].contain === WALL) this.blockGrid[hg][vg].style.backgroundImage = "url('img/wall.png')";
        else if (this.blockGrid[hg][vg].contain === BRICK) this.blockGrid[hg][vg].style.backgroundImage = "url('img/brick.png')";
        else if (this.blockGrid[hg][vg].contain === BOX) this.blockGrid[hg][vg].style.backgroundImage = "url('img/box_1.png')";
        else if (this.blockGrid[hg][vg].contain === BOX_TNT) this.blockGrid[hg][vg].style.backgroundImage = "url('img/box_tnt.png')";
        else if (this.blockGrid[hg][vg].contain === BOX_BOMBE) this.blockGrid[hg][vg].style.backgroundImage = "url('img/box_bombe.png')";
        else if (this.blockGrid[hg][vg].contain === BOX_GOLD) this.blockGrid[hg][vg].style.backgroundImage = "url('img/box_gold.png')";
        else if (this.blockGrid[hg][vg].contain === BOX_KEY) this.blockGrid[hg][vg].style.backgroundImage = "url('img/box_key.png')";
        else this.blockGrid[hg][vg].style.backgroundImage = "url('img/grass.png')";
        this.blockGrid[hg][vg].style.backgroundRepeat = 'no-repeat';
        this.blockGrid[hg][vg].style.backgroundSize = 'cover';
        this.blockGrid[hg][vg].style.transition = "background-image 0.01s ease-in-out";
        this.blockGrid[hg][vg].style.display = 'flex';
        this.blockGrid[hg][vg].style.marginLeft = (hg * GRID_SIZE).toString() + 'px';
        this.blockGrid[hg][vg].style.marginTop = (vg * GRID_SIZE).toString() + 'px';
        this.div.appendChild(this.blockGrid[hg][vg]);
      }
    }
  }

  generateInfoGrid() {
    this.gameInfoGrid = [];
    let remainingLives = this.bomberman.lives;
    let remainingBombes = this.bomberman.readyBombes;
    for (var i=0 ; i<H_GRID_NUMBER ; i++) {
      this.gameInfoGrid.push(document.createElement('div'));
      this.gameInfoGrid[i].style.width = GRID_SIZE.toString() + 'px';
      this.gameInfoGrid[i].style.height = GRID_SIZE.toString() + 'px';
      this.gameInfoGrid[i].style.position = 'absolute';
      this.gameInfoGrid[i].style.backgroundImage = "url('img/wall.png')";
      this.gameInfoGrid[i].style.transition = "background-image 0.01s ease-in-out";

      if (i === 0) this.gameInfoGrid[i].style.backgroundImage = "url('img/animation_bomberman_originale/down_0.png'), url('img/wall.png')";
      else if (i > 1 && i < (H_GRID_NUMBER+1)/2 && remainingLives > 0) {this.gameInfoGrid[i].style.backgroundImage = "url('img/heart.png'), url('img/wall.png')"; remainingLives--;}
      else if (i > this.bomberman.lives+2 && i < (H_GRID_NUMBER+1)/2 && remainingBombes > 0) {this.gameInfoGrid[i].style.backgroundImage = "url('img/bombe.png'), url('img/wall.png')"; remainingBombes--;}
      else if (this.bomberman2 && i === (H_GRID_NUMBER+1)/2) {
        this.gameInfoGrid[i].style.backgroundImage = "url('img/animation_bomberman_rouge/down_0.png'), url('img/wall.png')";
        remainingLives = this.bomberman2.lives;
        remainingBombes = this.bomberman2.readyBombes;
      }
      else if (this.bomberman2 && i > (H_GRID_NUMBER+3)/2 && remainingLives > 0) {this.gameInfoGrid[i].style.backgroundImage = "url('img/heart.png'), url('img/wall.png')"; remainingLives--;}
      else if (this.bomberman2 && i > (H_GRID_NUMBER+5)/2 + this.bomberman2.lives && remainingBombes > 0) {this.gameInfoGrid[i].style.backgroundImage = "url('img/bombe.png'), url('img/wall.png')"; remainingBombes--;}
      this.gameInfoGrid[i].style.backgroundSize = "contain";
      this.gameInfoGrid[i].style.display = 'flex';
      this.gameInfoGrid[i].style.marginLeft = (i * GRID_SIZE).toString() + 'px';
      this.gameInfoGrid[i].style.marginTop = (V_GRID_NUMBER * GRID_SIZE).toString() + 'px';
      this.div.appendChild(this.gameInfoGrid[i]);
    }
  }

  update() {
    if (this.bomberman2) this.bomberman2.update();
    this.bomberman.update();

    for (var i=0; i<this.scorpions.length ; i++){
      this.scorpions[i].update();
    }

    this.animationBlocks.forEach( function(block) {
      if (block.animation) {
        if (block.animationTimer <= 0) {
          if (block.animationIndex > -1) {
            block.safe = false;
            block.bombed = true;
            block.animationIndex += block.animationIndexOffset;
            block.animationIndexOffset = 0;
             block.style.backgroundImage = "url('" + block.animation[block.animationIndex] + "'), url('img/grass.png')";
           }
          block.animationIndex++;
          if (block.animationIndex === block.animation.length) {
            block.animationIndex = 0;
            block.style.backgroundImage = "url('img/grass.png')";
            block.animation = null;
            block.safe = true;
            block.bombed = false;
          }
          block.animationTimer += 60;
          if (block.animationFps === 0) block.animationFps = 20;
        }block.animationTimer -= block.animationFps;
      }
    });

    for (var i=0; i<this.animationBlocks.length ; i++) {
      if (!this.animationBlocks[i].animation) {this.animationBlocks.splice(i, 1); i--;}
    }

    this.newSpriteBlocks.forEach( function(block) {
      if (block.newSprite) {
        if (block.newSpriteTimer === 0) {
          block.style.backgroundImage = block.newSprite;
          block.newSpriteTimer = 0;
          block.newSprite = null;
        }
        block.newSpriteTimer--;
      }
    });
    for (var i=0; i<this.newSpriteBlocks.length ; i++) {
      if (!this.newSpriteBlocks[i].newSprite) {this.newSpriteBlocks.splice(i, 1); i--;}
    }

  }

}
