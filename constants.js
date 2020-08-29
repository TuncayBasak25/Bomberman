var hNumber = 37;
var vNumber = 18;
var gridSize, gridSizeH, gridSizeV;

if (window.innerWidth < 1900) hNumber = 37;
if (window.innerWidth < 1800) hNumber = 35;
if (window.innerWidth < 1700) hNumber = 33;
if (window.innerWidth < 1600) hNumber = 31;
if (window.innerWidth < 1500) hNumber = 29;
if (window.innerWidth < 1400) hNumber = 27;
if (window.innerWidth < 1300) hNumber = 25;
if (window.innerWidth < 1200) hNumber = 23;
if (window.innerWidth < 1100) hNumber = 21;
if (window.innerWidth < 1000) hNumber = 19;
if (window.innerWidth < 900) hNumber = 17;


if (window.innerHeight < 800) vNumber = 16;
if (window.innerHeight < 700) vNumber = 14;
if (window.innerHeight < 600) vNumber = 12;
if (window.innerHeight < 500) vNumber = 10;
if (window.innerHeight < 400) vNumber = 8;

hNumber -= 0;

gridSizeH = Math.floor(window.innerWidth / hNumber);

gridSizeV = Math.floor(window.innerHeight / vNumber);

if (gridSizeH > gridSizeV) {
  gridSize = gridSizeV;
  hNumber = Math.floor(window.innerWidth / gridSize);
}
else {
  gridSize = gridSizeH;
  vNumber = Math.floor(window.innerHeight / gridSize);
}


// export const H_GRID_NUMBER = hNumber; H_GRID_NUMBER;
// export const V_GRID_NUMBER = vNumber - 1; V_GRID_NUMBER;
// export const GRID_SIZE = gridSize; GRID_SIZE;
//
// export const WINDOW_WIDTH = GRID_SIZE * H_GRID_NUMBER; WINDOW_WIDTH;
// export const WINDOW_HEIGHT = GRID_SIZE * vNumber; WINDOW_HEIGHT;

export const H_GRID_NUMBER = 31; H_GRID_NUMBER;
export const V_GRID_NUMBER = 22; V_GRID_NUMBER;
export const GRID_SIZE = 30; GRID_SIZE;

export const WINDOW_WIDTH = GRID_SIZE * H_GRID_NUMBER; WINDOW_WIDTH;
export const WINDOW_HEIGHT = GRID_SIZE * (V_GRID_NUMBER+1); WINDOW_HEIGHT;


export const GRASS = 0; GRASS;
export const METAL = 1; METAL
export const WALL = 2; WALL;
export const BREAK = 3; BREAK;
export const BRICK = 4; BRICK;
export const BOMBE = 5; BOMBE;
export const BOX = 6; BOX;
export const BOX_BOMBE = 7; BOX_BOMBE;
export const BOX_TNT = 8; BOX_TNT;
export const BOX_KEY = 9; BOX_KEY;
export const BOX_GOLD = 10; BOX_GOLD;

export const BOMBE_TIMER = 200; BOMBE_TIMER;

let sound = 0;
var explosionSounds = [];
for (var i=0 ; i<10 ; i++) {
  explosionSounds.push(new Audio());
  let src = document.createElement('source');
  src.type = "audio/wav";
  if(sound > 2) sound = 0;
  src.src = "wav/explosion_" + String(sound) + ".wav";
  sound++;
  explosionSounds[i].appendChild(src);
}
export const EXPLOSION_SOUNDS = explosionSounds;

var animationExplosion = [];
for (var i=0 ; i<16 ; i++) animationExplosion.push('img/animation_explosion/explosion_' + i + '.png');
export const ANIMATION_EXPLOSION = animationExplosion;


var animationWalkingUp = [];
for (var i=1 ; i<7 ; i++) animationWalkingUp.push("url('img/animation_bomberman_originale/up_" + i + ".png')");
export const ANIMATION_WALKING_UP_ORIGINAL = animationWalkingUp;

var animationWalkingDown = [];
for (var i=1 ; i<7 ; i++) animationWalkingDown.push("url('img/animation_bomberman_originale/down_" + i + ".png')");
export const ANIMATION_WALKING_DOWN_ORIGINAL = animationWalkingDown;

var animationWalkingLeft = [];
for (var i=1 ; i<7 ; i++) animationWalkingLeft.push("url('img/animation_bomberman_originale/left_" + i + ".png')");
export const ANIMATION_WALKING_LEFT_ORIGINAL = animationWalkingLeft;

var animationWalkingRight = [];
for (var i=1 ; i<7 ; i++) animationWalkingRight.push("url('img/animation_bomberman_originale/right_" + i + ".png')");
export const ANIMATION_WALKING_RIGHT_ORIGINAL = animationWalkingRight;

var animationWalkingUp = [];
for (var i=1 ; i<7 ; i++) animationWalkingUp.push("url('img/animation_bomberman_rouge/up_" + i + ".png')");
export const ANIMATION_WALKING_UP_ROUGE = animationWalkingUp;

var animationWalkingDown = [];
for (var i=1 ; i<7 ; i++) animationWalkingDown.push("url('img/animation_bomberman_rouge/down_" + i + ".png')");
export const ANIMATION_WALKING_DOWN_ROUGE = animationWalkingDown;

var animationWalkingLeft = [];
for (var i=1 ; i<7 ; i++) animationWalkingLeft.push("url('img/animation_bomberman_rouge/left_" + i + ".png')");
export const ANIMATION_WALKING_LEFT_ROUGE = animationWalkingLeft;

var animationWalkingRight = [];
for (var i=1 ; i<7 ; i++) animationWalkingRight.push("url('img/animation_bomberman_rouge/right_" + i + ".png')");
export const ANIMATION_WALKING_RIGHT_ROUGE = animationWalkingRight;

var animationWalkingUp = [];
for (var i=0 ; i<6 ; i++) animationWalkingUp.push("url('img/animation_scorpion/up_" + i + ".png')");
export const ANIMATION_WALKING_UP_SCORPION = animationWalkingUp;

var animationWalkingDown = [];
for (var i=0 ; i<6 ; i++) animationWalkingDown.push("url('img/animation_scorpion/down_" + i + ".png')");
export const ANIMATION_WALKING_DOWN_SCORPION = animationWalkingDown;

var animationWalkingLeft = [];
for (var i=0 ; i<6 ; i++) animationWalkingLeft.push("url('img/animation_scorpion/left_" + i + ".png')");
export const ANIMATION_WALKING_LEFT_SCORPION = animationWalkingLeft;

var animationWalkingRight = [];
for (var i=0 ; i<6 ; i++) animationWalkingRight.push("url('img/animation_scorpion/right_" + i + ".png')");
export const ANIMATION_WALKING_RIGHT_SCORPION = animationWalkingRight;
