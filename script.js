const H_GRID_NUMBER = 16;
const V_GRID_NUMBER = 16;
const GRID_SIZE = 50;
const WINDOW_WIDTH = H_GRID_NUMBER * GRID_SIZE;
const WINDOW_HEIGHT = V_GRID_NUMBER * GRID_SIZE;


const BOMBE_TIMER = 30;

var gameContainer = document.createElement('div');
gameContainer.style.width = WINDOW_WIDTH.toString() + 'px';
gameContainer.style.height = WINDOW_HEIGHT.toString() + 'px';
//gameContainer.style.backgroundImage = "url('img/grass_bg.jpg')"
gameContainer.style.backgroundColor = 'green';
gameContainer.style.marginLeft = 'auto';
gameContainer.style.marginRight = 'auto';
gameContainer.style.marginTop = 'calc((100vh - ' + WINDOW_WIDTH + 'px) / 2)';
gameContainer.style.display = 'flex';
gameContainer.style.flexWrap = 'nowrap';
document.body.appendChild(gameContainer);


var bomberman = document.createElement('div');

bomberman.posX = 1;
bomberman.posY = 1;
bomberman.bombe = 1;


bomberman.style.width = (GRID_SIZE / 2).toString() + 'px';
bomberman.style.height = (GRID_SIZE / 2).toString() + 'px';
bomberman.style.backgroundImage = "url('img/bomberman.png')";
bomberman.style.backgroundRepeat = 'no-repeat';
bomberman.style.backgroundSize = 'cover';
bomberman.style.position = 'absolute';
bomberman.style.display = 'flex';
bomberman.style.zIndex = 100;
bomberman.style.marginLeft = (GRID_SIZE / 4 + bomberman.posX * GRID_SIZE).toString() + 'px';
bomberman.style.marginTop = (GRID_SIZE / 4 + bomberman.posY * GRID_SIZE).toString() + 'px';

gameContainer.appendChild(bomberman);

var bombe = document.createElement('div');

bombe.posX = -1;
bombe.posY = -1;
bombe.explosion = -1;

bombe.style.width = (GRID_SIZE / 2).toString() + 'px';
bombe.style.height = (GRID_SIZE / 2).toString() + 'px';
bombe.style.backgroundImage = "none";
bombe.style.backgroundRepeat = 'no-repeat';
bombe.style.backgroundSize = 'cover';
bombe.style.position = 'absolute';
bombe.style.display = 'flex';
bombe.style.zIndex = 99;
bombe.style.marginLeft = (GRID_SIZE / 4 + bombe.posX * GRID_SIZE).toString() + 'px';
bombe.style.marginTop = (GRID_SIZE / 4 + bombe.posY * GRID_SIZE).toString() + 'px';

gameContainer.appendChild(bombe);

var gameGrid = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 2, 1],
  [1, 0, 2, 0, 2, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 1],
  [1, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2, 2, 0, 2, 1],
  [1, 0, 2, 0, 2, 0, 2, 2, 0, 2, 0, 2, 0, 0, 0, 1],
  [1, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 1],
  [1, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 1],
  [1, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 1],
  [1, 2, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 1],
  [1, 0, 0, 0, 2, 0, 2, 2, 0, 2, 0, 0, 0, 2, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 2, 2, 0, 1],
  [1, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 2, 1],
  [1, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 1],
  [1, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 2, 1],
  [1, 0, 2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

blockGrid = [];

for (var i = 0; i < V_GRID_NUMBER; i++) {
  blockGrid.push([]);
  for (var j = 0; j < H_GRID_NUMBER; j++) {
    blockGrid[i].push(document.createElement('div'));

    blockGrid[i][j].style.width = GRID_SIZE.toString() + 'px';
    blockGrid[i][j].style.height = GRID_SIZE.toString() + 'px';
    blockGrid[i][j].style.position = 'absolute';
    if (gameGrid[j][i] === 1) {
      blockGrid[i][j].style.backgroundImage = "url('img/strong_wall.png')";
      blockGrid[i][j].style.backgroundRepeat = 'no-repeat';
      blockGrid[i][j].style.backgroundSize = 'cover';
    }
    else if (gameGrid[j][i] === 2) {
      blockGrid[i][j].style.backgroundImage = "url('img/brick.png')";
      blockGrid[i][j].style.backgroundRepeat = 'no-repeat';
      blockGrid[i][j].style.backgroundSize = 'cover';
    }
    else {
      blockGrid[i][j].style.backgroundImage = "url('img/grass.png')";
      blockGrid[i][j].style.backgroundRepeat = 'no-repeat';
      blockGrid[i][j].style.backgroundSize = 'cover';
    }
    blockGrid[i][j].style.display = 'flex';
    blockGrid[i][j].style.marginLeft = (i * GRID_SIZE).toString() + 'px';
    blockGrid[i][j].style.marginTop = (j * GRID_SIZE).toString() + 'px';
    gameContainer.appendChild(blockGrid[i][j]);
  }
}

var loop_fps_timer_index = 0;
function loop() {if (loop_fps_timer_index === 5) {

  if (bombe.explosion > -1) {
    if (bombe.explosion === 16) {
      bombe.style.backgroundImage = 'none';
      bombe.area = [];
      bombe.area.push(blockGrid[bombe.posX][bombe.posY]);
      bombe.area[0].style.backgroundImage = "url('img/explosion/exp_0.png'), url('img/grass.png')";
      if (gameGrid[bombe.posY-1][bombe.posX] !== 1) {
        bombe.area.push(blockGrid[bombe.posX][bombe.posY-1]);
        gameGrid[bombe.posY-1][bombe.posX] = 0;
      }
      if (gameGrid[bombe.posY+1][bombe.posX] !== 1) {
        bombe.area.push(blockGrid[bombe.posX][bombe.posY+1]);
        gameGrid[bombe.posY+1][bombe.posX] = 0;
      }
      if (gameGrid[bombe.posY][bombe.posX-1] !== 1) {
        bombe.area.push(blockGrid[bombe.posX-1][bombe.posY]);
        gameGrid[bombe.posY][bombe.posX-1] = 0;
      }
      if (gameGrid[bombe.posY][bombe.posX+1] !== 1) {
        bombe.area.push(blockGrid[bombe.posX+1][bombe.posY]);
        gameGrid[bombe.posY][bombe.posX+1] = 0;
      }
    }
    else if (bombe.explosion === 15) {
      bombe.area[0].style.backgroundImage = "url('img/explosion/exp_1.png'), url('img/grass.png')";
    }
    else if (bombe.explosion > 0 && bombe.explosion < 15) {
      let sprite_index = 16 - bombe.explosion;
      bombe.area.forEach( function(area) {area.style.backgroundImage = "url('img/explosion/exp_" + sprite_index + ".png'), url('img/grass.png')";});
    }
    else if (bombe.explosion === 0) {
      bombe.area.forEach( function(area) {area.style.backgroundImage = "url(img/grass.png)";});
      bomberman.bombe = 1;
    }
    bombe.explosion--;
  }

loop_fps_timer_index = 0;}loop_fps_timer_index++;window.requestAnimationFrame(loop);}

window.requestAnimationFrame(loop);


document.addEventListener('keydown', function(e) {
	// left arrow key
	if (e.which === 37) {
		lastPressed = "left";
    bomberman.style.transform = 'scaleX(-1)';
    if (gameGrid[bomberman.posY][bomberman.posX - 1] === 0){
      bomberman.posX--;
      bomberman.style.marginLeft = (GRID_SIZE / 4 + bomberman.posX * GRID_SIZE).toString() + 'px';
    }
	}
  // up arrow key
	else if (e.which === 38) {
		lastPressed = "up";
    bomberman.style.transform = 'rotate(-90deg)';
    if (gameGrid[bomberman.posY - 1][bomberman.posX] === 0){
      bomberman.posY--;
      bomberman.style.marginTop = (GRID_SIZE / 4 + bomberman.posY * GRID_SIZE).toString() + 'px';
    }
	}
	// right arrow key
	else if (e.which === 39) {
		lastPressed = "right";
    bomberman.style.transform = 'scaleX(1)';
    if (gameGrid[bomberman.posY][bomberman.posX + 1] === 0){
      bomberman.posX++;
      bomberman.style.marginLeft = (GRID_SIZE / 4 + bomberman.posX * GRID_SIZE).toString() + 'px';
    }
	}
  // down arrow key
  else if (e.which === 40) {
  	lastPressed = "down";
    bomberman.style.transform = 'rotate(90deg)';
    if (gameGrid[bomberman.posY + 1][bomberman.posX] === 0){
      bomberman.posY++;
      bomberman.style.marginTop = (GRID_SIZE / 4 + bomberman.posY * GRID_SIZE).toString() + 'px';
    }
  }
  // space bar key
  else if (e.which === 32) {
    if (bomberman.bombe > 0) {
      bomberman.bombe = 0;
      bombe.posX = bomberman.posX;
      bombe.posY = bomberman.posY;
      bombe.style.marginLeft = (GRID_SIZE / 4 + bombe.posX * GRID_SIZE).toString() + 'px';
      bombe.style.marginTop = (GRID_SIZE / 4 + bombe.posY * GRID_SIZE).toString() + 'px';
      bombe.explosion = BOMBE_TIMER;
      bombe.style.backgroundImage = "url('img/bombe.gif')";
    }
    /*
    if (lastPressed === 'left' && gameGrid[bomberman.posY][bomberman.posX - 1] === 2) {
      let cache = document.getElementById('grid' + (bomberman.posX - 1).toString() + ':' + bomberman.posY);
      console.log(cache);
      cache.style.backgroundImage = 'none';
      gameGrid[bomberman.posY][bomberman.posX - 1] = 0;
    }
    else if (lastPressed === 'right' && gameGrid[bomberman.posY][bomberman.posX + 1] === 2) {
      let cache = document.getElementById('grid' + (bomberman.posX + 1).toString() + ':' + bomberman.posY);
      cache.style.backgroundImage = 'none';
      gameGrid[bomberman.posY][bomberman.posX + 1] = 0;
    }
    else if (lastPressed === 'up' && gameGrid[bomberman.posY - 1][bomberman.posX] === 2) {
      let cache = document.getElementById('grid' + bomberman.posX + ':' + (bomberman.posY - 1).toString());
      console.log(cache.id);
      cache.style.backgroundImage = 'none';
      gameGrid[bomberman.posY - 1][bomberman.posX] = 0;
    }
    else if (lastPressed === 'down' && gameGrid[bomberman.posY + 1][bomberman.posX] === 2) {
      let cache = document.getElementById('grid' + bomberman.posX + ':' + (bomberman.posY + 1).toString());
      cache.style.backgroundImage = 'none';
      gameGrid[bomberman.posY + 1][bomberman.posX] = 0;
    }*/
    lastPressed = "space-bar";
  }

});
