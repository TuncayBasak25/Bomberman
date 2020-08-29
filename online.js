export class Connection {
  constructor(id) {
    this.peer = new Perr(id);
    this.connection = null;
  }

  connectTo(id) {
    this.connection = this.peer.connect(id);
  }
}
