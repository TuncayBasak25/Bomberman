export class GameMenu {
  constructor() {
    this.menu = document.createElement('div');
    this.menu.setAttribute('id', 'menu');

    this.menu.style.backgroundImage = "url('img/brick.png')";
    this.menu.style.width = String(window.innerWidth) + 'px';
    this.menu.style.height = String(window.innerHeight) + 'px';

    this.mode = 'choose';

    this.buttons = [];

    this.createButton('Play Online', window.innerWidth/4, window.innerHeight/2, 'this.gameMenu.online()');
    this.createButton('Two player', 3*window.innerWidth/4, window.innerHeight/2, 'this.gameMenu.coop()');
    this.createButton('Single player', window.innerWidth/2, window.innerHeight/2, 'this.gameMenu.single()');

    document.body.appendChild(this.menu);
  }
  single() {
    this.mode = 'single';
    document.getElementById('menu').remove();
  }
  coop() {
    this.mode = 'coop';
    document.getElementById('menu').remove();
  }
  online() {
    document.getElementById('Two player').remove();
    document.getElementById('Single player').remove();
    document.getElementById('Play Online').remove();

    this.createButton('Open server', window.innerWidth/4, window.innerHeight/2, 'this.gameMenu.openServer()');
    this.createButton('Connect to server', 3*window.innerWidth/4, window.innerHeight/2, 'this.gameMenu.connectToServer()');
  }

  openServer() {
    this.mode = 'online';
    document.getElementById('Open server').remove();
    document.getElementById('Connect to server').remove();

    this.serverId = Math.floor(Math.random() * 9000) + 1000;
    this.server = true;

    let title = document.createElement('h1');
    title.style.color = 'white';
    title.style.zIndex = 100;
    title.style.width = '320px';
    title.style.height = '60px';
    title.style.textAlign = 'center';
    title.style.marginLeft = String(window.innerWidth/2 - 160) + 'px';
    title.style.marginTop = String(window.innerHeight/2) + 'px';
    title.style.position = 'absolute';
    title.style.fontSize = '50px';
    title.appendChild(document.createTextNode('Your ID: ' + this.serverId + ' Waiting for connection!'));
    this.menu.appendChild(title);
  }

  connectToServer() {
    document.getElementById('Open server').remove();
    document.getElementById('Connect to server').remove();

    let title = document.createElement('h1');
    title.style.color = 'white';
    title.style.zIndex = 100;
    title.style.width = '320px';
    title.style.height = '60px';
    title.style.textAlign = 'center';
    title.style.marginLeft = String(window.innerWidth/2 - 160) + 'px';
    title.style.marginTop = String(window.innerHeight/2) + 'px';
    title.style.position = 'absolute';
    title.style.fontSize = '50px';
    title.appendChild(document.createTextNode('Server ID:'));

    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'server id');
    input.style.width = '160px';
    title.appendChild(input);

    this.createButton('Connect to server', window.innerWidth/2-80, window.innerHeight/1.5, 'this.gameMenu.getServerId()');

    this.menu.appendChild(title);

  }

  getServerId() {
    this.mode = 'online';
    this.server = false;
    this.serverId = document.getElementById('server id').value;
  }

  createButton(name, marginLeft, marginTop, onclick, id = '') {
    if (!id) id = name;
    let button = document.createElement('button');
    button.setAttribute('id', id)
    button.gameMenu = this;
    button.style.position = 'absolute';
    if (marginLeft === 'auto') {
      button.style.marginLeft = 'auto';
      button.style.marginLeft = 'auto';
    }
    else {
      button.style.marginLeft = String(marginLeft) + 'px';
    }
    button.style.marginTop = String(marginTop) + 'px';
    button.appendChild(document.createTextNode(name));
    button.setAttribute('onclick', onclick);
    this.buttons.push(button);
    this.menu.appendChild(button);
  }
}
