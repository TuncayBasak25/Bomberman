import {H_GRID_NUMBER, V_GRID_NUMBER, GRID_SIZE, WINDOW_WIDTH, WINDOW_HEIGHT, GRASS, METAL, WALL, BREAK, BRICK, BOMBE, BOX, BOX_BOMBE, BOX_TNT, BOX_KEY, BOX_GOLD, BOMBE_TIMER, EXPLOSION_SOUNDS} from './constants.js';
import {gameContainer, generateGrid} from './gameContainer.js';
import {random100} from './functions.js';

import { Bomberman } from './bomberman.js';
import { Deamon } from './deamon.js';

var blockGrid = generateGrid(gameContainer);

var bomberman = new Bomberman(gameContainer, blockGrid);
bomberman.addBombe();

var bomberman2 = new Bomberman(gameContainer, blockGrid);
bomberman2.addBombe();
bomberman2.posX = 1;
bomberman2.posY = 2;
bomberman2.setAnimationSourceRouge();
bomberman2.assignTouch(81, 68, 90, 83, 17);


var deamons = [];
for (var i=0; i<10 ; i++){
  deamons.push(new Deamon(gameContainer, blockGrid));
}
function loop() {
  bomberman.update();

  bomberman2.update();

  for (var i=0; i<10 ; i++){
    deamons[i].update();
  }
  blockGrid = generateGrid(gameContainer);
  for (var hg=0 ; hg < H_GRID_NUMBER ; hg++) {
    for (var vg=0 ; vg < V_GRID_NUMBER ; vg++) {
      let block = blockGrid[hg][vg];
      if (block.animationRepeat > 0 || block.animationRepeat === -1) {
        if (block.animationTimer <= 0) {
          if (block.animationIndex > -1) {
            block.animationIndex += block.animationIndexOffset;
            block.animationIndexOffset = 0;
             block.style.backgroundImage = "url('" + block.animation[block.animationIndex] + "'), url('img/grass.png')";
           }
          block.animationIndex++;
          if (block.animationIndex === block.animation.length) {
            block.animationIndex = 0;
            if (block.animationRepeat !== -1) block.animationRepeat--;
            if (block.animationRepeat === 0) block.style.backgroundImage = "url('img/grass.png')";
          }
          block.animationTimer = 60;
          if (block.animationFps === 0) block.animationFps = block.animation.length;
        }block.animationTimer -= block.animationFps;
      }
      if (block.newSprite) {
        if (block.newSpriteTimer === 0) {
          block.style.backgroundImage = block.newSprite;
          block.newSpriteTimer = 0;
          block.newSprite = null;
        }
        block.newSpriteTimer--;
      }
    }
  }

window.requestAnimationFrame(loop);} // Loop refresh
window.requestAnimationFrame(loop); // Loop init


document.addEventListener('keyup', function(e) {
  bomberman.keyReleaseUpdate(e.which);
  bomberman2.keyReleaseUpdate(e.which);
});

document.addEventListener('keydown', function(e) {
	bomberman.keyPressUpdate(e.which);
	bomberman2.keyPressUpdate(e.which);
});
