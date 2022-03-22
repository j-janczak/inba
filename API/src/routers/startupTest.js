const Router = require('../router.js');

class StartupTest extends Router {
  constructor (server, sqlPool, callRouter) {
    super('startuptest', server, sqlPool, callRouter);

    this.addRoute('GET', '', this.get.bind(this));
  }

  async get(payload, params, sqlConn) {
    const dbCheck = await sqlConn.query('SELECT "ok"');
    return this.sendResult(dbCheck);
  }
}

module.exports = {
  name: 'startupTest',
  class: StartupTest
};