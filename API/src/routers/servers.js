const Router = require('../router.js');

class Servers extends Router {
  constructor (server, sqlPool, callRouter) {
    super('servers', server, sqlPool, callRouter);

    this.addRoute('GET', '{serverID}', this.get.bind(this));
  }

  async get(payload, params, sqlConn) {
    try {
      let server;
      while (
        !(server = 
          await sqlConn.query('SELECT * FROM servers WHERE serverID = ?',
            [params.serverID])
        ).length) {
        await sqlConn.query('INSERT INTO servers (serverID) VALUES (?)', [params.serverID]);
      }
      return this.sendResult(server);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  name: 'servers',
  class: Servers
};