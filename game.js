import {H_GRID_NUMBER, V_GRID_NUMBER, GRID_SIZE, WINDOW_WIDTH, WINDOW_HEIGHT, GRASS, METAL, WALL, BREAK, BRICK, BOMBE, BOX, BOX_BOMBE, BOX_TNT, BOX_KEY, BOX_GOLD, BOMBE_TIMER, EXPLOSION_SOUNDS} from './constants.js';
import {GameContainer} from './GameContainer.js';
import {random100} from './functions.js';
import { Bomberman } from './bomberman.js';
import { Scorpion } from './scorpion.js';
import { GameMenu} from './gameMenu.js';


var gameMenu = new GameMenu();
var bomberman;
var bomberman2 = null;
var gameContainer;
var peer;
var conn;
var connTest;
var myData;
var bombermanClone;
var testData;
var connectionTime;
var synchronised = false;
var generator;

function connect() {
  peer.on('connection', function(conn) {
    conn.on('data', function(data){
        // Will print 'hi!'
        if (typeof data === 'object') bombermanClone = data;
        else myData = data;
    });
  });
}

var serverSendBomb = 0;

var timePast = 0;
var serverWaitingTime = 0;
var shownOn60 = 0;
var firstConnClient = true;
var firstConnServer = true;
var frame = 0;
function loop() {
  let time1 = (new Date()).getTime();
  if (gameMenu.mode === 'single') {
    bomberman = new Bomberman();
    bomberman2 = null;
    gameContainer = new GameContainer(bomberman, bomberman2);
    for (var i=0; i<10 ; i++){
      new Scorpion(gameContainer);
    }
    gameMenu.mode = null;
  }
  if (gameMenu.mode === 'coop') {
    bomberman = new Bomberman();
    bomberman2 = new Bomberman(2);
    gameContainer = new GameContainer(bomberman, bomberman2);
    for (var i=0; i<10 ; i++){
      new Scorpion(gameContainer);
    }
    gameMenu.mode = null
  }
  if (gameMenu.mode === 'online') {
    if (peer && shownOn60 === 60) { console.log(peer._id); if (!peer._id) { peer = null;} shownOn60 = 0;}shownOn60++;
    if (myData) console.log(myData);
    if (!peer && gameMenu.server) {
      let serverId = 'serverSideOfBomberDivProgramIdontThinkYouWillCollideWithThisId' + String(gameMenu.serverId);
      peer = new Peer(serverId)/*, {
            host: 'localhost',
            port: 9000,
            path: '/myapp'
      });*/
      connect();
      connectionTime = (new Date()).getTime();
      conn = peer.connect('clientSideOfBomberDivProgramIdontThinkYouWillCollideWithThisId' + String(gameMenu.serverId));
      connTest = peer.connect('clientSideOfBomberDivProgramIdontThinkYouWillCollideWithThisId' + String(gameMenu.serverId));
      console.log(peer);
    }
    else if (gameMenu.server && serverWaitingTime === 60 && conn && !conn._open) {
      peer._connections.clear();
      conn = peer.connect('clientSideOfBomberDivProgramIdontThinkYouWillCollideWithThisId' + String(gameMenu.serverId), 'first-conn');
      connTest = peer.connect('clientSideOfBomberDivProgramIdontThinkYouWillCollideWithThisId' + String(gameMenu.serverId), 'first-conn');
      serverWaitingTime = 0;
    }
    else if (!peer && !gameMenu.server || !peer._id) {
      let clientId = 'clientSideOfBomberDivProgramIdontThinkYouWillCollideWithThisId' + String(gameMenu.serverId);
      peer = new Peer(clientId);/*, {
            host: 'localhost',
            port: 9000,
            path: '/myapp'
      });*/
      connect();
      //alert(peer._id)
      //conn = peer.connect('server');
      //console.log(conn);
      //connectionTime = (new Date()).getTime();
    }
    else if (!gameMenu.server && myData && firstConnClient) {
      conn = peer.connect('serverSideOfBomberDivProgramIdontThinkYouWillCollideWithThisId' + String(gameMenu.serverId));
      connTest = peer.connect('serverSideOfBomberDivProgramIdontThinkYouWillCollideWithThisId' + String(gameMenu.serverId));
      connectionTime = (new Date()).getTime();
      firstConnClient = false;
    }
    serverWaitingTime++;
    if (conn) conn.send('S' + String(connectionTime));
    if (myData && conn) {
      if (myData.substring(0, 1) === 'S') {
        if (connectionTime - parseInt(myData.substring(1)) < 0) {
          synchronised = true;
          generator = true;
        }
      }
      else {
        synchronised = true;
        generator = false;
      }
    }
    if (synchronised && generator) {
      document.getElementById('menu').remove();
      gameMenu.mode = 'online-update';
      bomberman = new Bomberman();
      bomberman2 = new Bomberman(2);
      gameContainer = new GameContainer(bomberman, bomberman2);

      let message = String(gameContainer.randomList[0]);
      for (let i=1 ; i<gameContainer.randomList.length ; i++) {
        message = message + ' ' + String(gameContainer.randomList[i]);
      }

      conn.send(message);
    }
    else if (synchronised && !generator) {
      let randomList = myData.split(' ');

      if (randomList.length > 10) {
        document.getElementById('menu').remove();
        gameMenu.mode = 'online-update';
        conn.send('T');
        bomberman = new Bomberman();
        bomberman2 = new Bomberman(2);
        gameContainer = new GameContainer(bomberman, bomberman2, randomList);
      }
    }
  }

  if (gameMenu.mode === 'online-update') {
    if (connTest) {
      let bombermanClone = {
        x: bomberman.posX,
        y: bomberman.posY,
        oX: bomberman.offsetX,
        oY: bomberman.offsetY,
        live: bomberman.lives,
        envoyTime: (new Date().getTime())
      }
      connTest.send(bombermanClone);
    }
    if (myData && myData.substring(0, 1) === 'T') {
      let touches = myData.split(' ');
      if (touches[1] === 'true') bomberman2.upPressed = true;
      else bomberman2.upPressed = false;
      if (touches[2] === 'true') bomberman2.downPressed = true;
      else bomberman2.downPressed = false;
      if (touches[3] === 'true') bomberman2.leftPressed = true;
      else bomberman2.leftPressed = false;
      if (touches[4] === 'true') bomberman2.rightPressed = true;
      else bomberman2.rightPressed = false;
      if (touches[5] === 'true') bomberman2.upReady = true;
      else bomberman2.upReady = false;
      if (touches[6] === 'true') bomberman2.downReady = true;
      else bomberman2.downReady = false;
      if (touches[7] === 'true') bomberman2.leftReady = true;
      else bomberman2.leftReady = false;
      if (touches[8] === 'true') bomberman2.rightReady = true;
      else bomberman2.rightReady = false;
      if (touches[9] === 'true') {bomberman2.dropBombe();}
    }
    gameContainer.update();
    if (serverSendBomb < 1) {
      if (conn && myData.substring(0, 1) === 'T') conn.send('T ' + bomberman.upPressed + ' ' + bomberman.downPressed + ' ' + bomberman.leftPressed + ' ' + bomberman.rightPressed + ' ' + bomberman.upReady + ' ' + bomberman.downReady + ' ' + bomberman.leftReady + ' ' + bomberman.rightReady + ' ' + 'false');
    }
    else {
      if (conn && myData.substring(0, 1) === 'T') conn.send('T ' + bomberman.upPressed + ' ' + bomberman.downPressed + ' ' + bomberman.leftPressed + ' ' + bomberman.rightPressed + ' ' + bomberman.upReady + ' ' + bomberman.downReady + ' ' + bomberman.leftReady + ' ' + bomberman.rightReady + ' ' + 'true');
      serverSendBomb--;
    }
    if (bombermanClone) {
      bomberman2.posX = bombermanClone.x;
      bomberman2.posY = bombermanClone.y;
      bomberman2.offsetX = bombermanClone.oX;
      bomberman2.offsetY = bombermanClone.oY;
      bomberman2.lives = bombermanClone.lives;
    }
  }



  if (!gameMenu.mode) {gameContainer.update()}

  timePast += (new Date()).getTime() - time1;
  if (frame === 60) {
    console.log(timePast/1000);
    //console.log(serverWaitingTime + ' ' + myData);

    frame = 0;
    timePast = 0;
  }frame++
window.requestAnimationFrame(loop);} // Loop refresh
window.requestAnimationFrame(loop); // Loop init


document.addEventListener('keyup', function(e) {
  if (e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40 || e.which === 32) {
    bomberman.keyReleaseUpdate(e.which);
  }
  if (bomberman2 && (e.which === 81 || e.which === 68 || e.which === 90 || e.which === 83 || e.which === 17)) bomberman2.keyReleaseUpdate(e.which);

});

document.addEventListener('keydown', function(e) {
	if (e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40 || e.which === 32) {
    bomberman.keyPressUpdate(e.which);
  }
	if (bomberman2 && (e.which === 81 || e.which === 68 || e.which === 90 || e.which === 83 || e.which === 17)) bomberman2.keyPressUpdate(e.which);
  if (e.which === 32 && serverSendBomb === 0) {
    serverSendBomb = 3;
    if (conn && myData.substring(0, 1) === 'T') conn.send('T ' + bomberman.upPressed + ' ' + bomberman.downPressed + ' ' + bomberman.leftPressed + ' ' + bomberman.rightPressed + ' ' + bomberman.upReady + ' ' + bomberman.downReady + ' ' + bomberman.leftReady + ' ' + bomberman.rightReady + ' ' + 'true');
  }
});

window.onunload = window.onbeforeunload = function(e) {
  peer.destroy();
}
