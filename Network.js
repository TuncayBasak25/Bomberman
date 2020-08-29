var status;
var incommingData;
class Network {
  constructor(baseId = 'defaultConnectionNetwork', applicationName = 'Default application', hostValues = null, clientLimit = 1, groupIndex = 0) {
    this.hostValues = hostValues;

    this.baseId = baseId;
    this.serverId = 'server' + baseId + String(groupIndex);
    this.clientId = 'client' + baseId + String(groupIndex);
    this.applicationName = applicationName;
    this.groupIndex = groupIndex;

    this.clientLimit = clientLimit;
    this.testedClient = clientLimit; //On l'initialise au max afin de proceder a l'inistilisation sans switch

    this.status = null;
    this.serverPeer = null;
    this.clientPeer = null;

    this.connectionMap = {};
    this.serverConn = null;
    this.clientConn = null;
  }

  startServer() {
    let id = 'server' + this.getBaseId() + String(this.getGroupIndex());
    if(this.getStatus() === null) {
      this.setServerPeer(id);
      this.peerServerBehavior();
      return true;
    }
    else {
      console.log('Cannot start with not null status.');
      return false;
    }
  }


  startClient() {
    let id = 'client' + this.getBaseId() + String(this.getGroupIndex());
    if(this.getStatus() === null) {
      this.setClientPeer(id);
      this.peerClientBehavior();
      return true;
    }
    else {
      console.log('Cannot start with not null status.');
      return false;
    }
  }

  nextGroup() {
    this.groupIndex++;
    this.setServerId('server' + this.getBaseId() + this.getGroupIndex());
    this.setClientId('client' + this.getBaseId() + this.getGroupIndex());
  }

  peerServerBehavior() {
    this.serverPeer.on('open', function() {
      console.log('Vous etes devenu serveur du group.');
    });
    this.serverPeer.on('connection', function(conn) {
      conn.on('open', function() {
        console.log('Connéctée avec: ' + conn.peer);
      });
      conn.on('data', function(data) {
        incommingData = data;
        console.log(conn.peer + ' dit ' + data);
      });
      conn.on('close', function() {
        console.log('La connectio avec ' + conn.peer + ' est terminé.');
      });
    });
    this.serverPeer.on('close', function() {
      console.log('Le client est desynchronisé, etablissez une nouvelle connection.');
    });
  }
  peerClientBehavior() {
    this.clientPeer.on('open', function() {
      console.log('Vous etes devenu client du group.');
    });
    this.clientPeer.on('connection', function(conn) {
      conn.on('open', function() {
        console.log('Connéctée avec: ' + conn.peer);
        conn.send('Himatlos');
      });
      conn.on('data', function(data) {
        incommingData = data;
        console.log(conn.peer + ' dit ' + data);
      });
      conn.on('close', function() {
        console.log('La connectio avec ' + conn.peer + ' est terminé.');
      });
    });
    this.clientPeer.on('close', function() {
      console.log('Le client est desynchronisé, etablissez une nouvelle connection.');
    });
  }

  connect(targetId) {
    if (this.isServer()) {
      this.serverConn = this.getServerPeer().connect(targetId);
      this.serverConn.on('open', function() {
        console.log('La connection ' + targetId + ' est établie.');
      });
    }
    else if (this.isClient()) {
      this.clientConn = this.getClientPeer().connect(targetId);
      this.clientConn.on('open', function() {
        console.log('La connection avec ' + targetId + 'est établie.');
      });
    }
    else {
      console.log("Il n'y a aucune voie pour établire une nouvelle connection.");
    }
  }

  send(sendingData) {
    if (this.isServer() && this.getServerConn()) {
      this.serverConn.send(String(sendingData));
    }
    else if (this.isClient() && this.getClientConn()) {
      this.clientConn.send(String(sendingData));
    }
    else {
      console.log("Il n'y a aucune connection établie, connectez vous sur une voie pour envoyer votre message.");
    }
  }

  destroy() {
    if (this.isServer()) {
      this.getServerPeer().destroy();
      this.setServerPeer(null);
    }
    else {
      this.getClientPeer().destroy();
      this.setClientPeer(null);
    }
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////Status////////////////////////////////////////////////////////////////////////////

  isServerAvailable() {
    if (this.getServerPeer().open) {
      this.setStatus('server');
      return true;
    }
    else return false;
  }

  isClientAvailable() {
    if (this.getClientPeer().open) {
      this.setStatus('client');
      return true;
    }
    else return false;
  }

  isServer() { if(this.status === 'server') return true; else return false;}
  isClient() { if(this.status === 'client') return true; else return false;}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////SETTERS//////////////////////////////////////////////////////////////////////////
  setHostValues(hostValues) { this.hostValues = hostValues;}
  setClientLimit(clientLimit) { this.clientLimit = clientLimit;}

  setBaseId(baseId) { this.baseId = baseId;}
  setServerId(serverId) { this.serverId = serverId;}
  setClientId(clientId) { this.clientId = clientId;}
  setApplicationName( applicationName) { this.applicationName = applicationName;}
  setGroup(groupIndex) { this.groupIndex = groupIndex;}

  setStatus(status) { this.status = status;}
  setServerPeer(targetId, hostValues = null) {
    if (targetId && hostValues === null) {
      this.serverPeer = new Peer(targetId);
    }
    else if (targetId === null) {
      this.serverPeer = null;
    }
    else {
      ///////////Code to coplete if the hostValues is not null
      console.log('Host values are not taken in consideration for now.');
    }
  }
  setClientPeer(targetId, hostValues = null) {
    if (targetId && hostValues === null) {
      this.clientPeer = new Peer(targetId);
      return true;
    }
    else if (targetId === null) {
      this.clientPeer = null;
    }
    else {
      //////////////Code to complete if the hostValues is not null
      console.log('Host values are not taken in consideration for now.');
      return false;
    }
  }

  setConnection(targetId, peer) { this.connectionMap[targetId] = peer.connect(targetId);}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////GETTERS//////////////////////////////////////////////////////////////////////////
  logServerInfo() {
    console.log("Server de l'application " + this.getApplicationName() + " group numero: " + this.getGroupIndex());
  }

  getHostValues() { return this.hostValues;}
  getClientLimit() { return this.clientLimit;}

  getBaseId() { return this.baseId;}
  getServerId() { return this.serverId;}
  getClientId() { return this.clientId;}
  getApplicationName() { return this.applicationName;}
  getGroupIndex() { return this.groupIndex;}


  getStatus() { return this.status;}
  getServerPeer() { return this.serverPeer;}
  getClientPeer() { return this.clientPeer;}

  getConnectionMap() { return this.connectionMap;}
  getServerConn() { return this.serverConn;}
  getClientConn() { return this.clientConn;}

  getDefaultAppName() { return 'Default application';}
  getDefaultConName() { return 'defaultConnectionNetwork';}
}
