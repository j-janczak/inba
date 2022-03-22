const Router = require('../router.js');

class StartupTest extends Router {
  constructor (server, sqlPool) {
    super('startuptest', server, sqlPool);

    this.addRoute('GET', '', this.get.bind(this));
  }

  async get(data, sqlConn) {
    const dbCheck = await sqlConn.query('SELECT "ok"');
    return dbCheck;
  }
}

module.exports = StartupTest;