const Router = require('../router.js');

class Users extends Router {
  constructor (server, sqlPool, callRouter) {
    super('users', server, sqlPool, callRouter);

    this.addRoute('GET', '{serverID}/{userID}', this.get.bind(this));
  }

  async get(payload, params, sqlConn) {
    try {
      let user;
      while (
        !(user = 
          await sqlConn.query('SELECT * FROM users WHERE userID = ? AND serverID = ?',
            [params.userID, params.serverID])
        ).length) {
        await sqlConn.query('INSERT INTO users (userID, serverID) VALUES (?, ?)', [params.userID, params.serverID]);
      }
      return this.sendResult(user);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  name: 'users',
  class: Users
};