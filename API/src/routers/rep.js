const Router = require('../router.js');

class Rep extends Router {
  constructor (server, sqlPool, callRouter) {
    super('rep', server, sqlPool, callRouter);

    this.addRoute('GET', '{serverID}', this.ranking.bind(this));
    this.addRoute('GET', '{serverID}/{userID}', this.get.bind(this));
    this.addRoute('POST', 'giveRep', this.giveRep.bind(this));
  }

  async ranking(payload, params, sqlConn) {
    try {
      const ranking = await sqlConn.query('SELECT userID, nick, repPoints FROM users WHERE serverID = ? ORDER BY repPoints DESC', [params.serverID]);
      return this.sendResult(ranking);
    } catch (e) {
      return this.sendError('Wystapił problem podczas łączenia z bazą danych');
    }
  }

  async get(payload, params, sqlConn) {
    try {
      const userResult = await this.callRouter('users', 'get', payload, params, sqlConn);
      const repResult = await sqlConn.query('SELECT * FROM repHistory WHERE serverID = ? AND receiverID = ? LIMIT 5', [params.serverID, params.userID]);

      return this.sendResult({
        points: userResult.data[0].repPoints,
        repHistory: repResult
      });
    } catch (e) {
      return this.sendError('Wystapił problem podczas łączenia z bazą danych');
    }
  }

  async giveRep(payload, params, sqlConn) {
    try {
      const sender = await this.callRouter('users', 'get', payload, {userID: payload.senderUserID, serverID: payload.serverID}, sqlConn);
      if ((Date.now() / 1000) - sender.data[0].repCooldown < 60) {
        // return this.sendError('Punkty reputacji można przyznawać raz na minutę!');
      }
      const receiver = await this.callRouter('users', 'get', payload, {userID: payload.userID, serverID: payload.serverID}, sqlConn);
      await sqlConn.query('UPDATE users SET repPoints = repPoints + ? WHERE userID = ? AND serverID = ?', [payload.point, payload.userID, payload.serverID]);
      await sqlConn.query('UPDATE users SET repCooldown = UNIX_TIMESTAMP() WHERE userID = ? AND serverID = ?', [payload.senderUserID, payload.serverID]);
      await sqlConn.query('INSERT INTO repHistory (serverID, senderID, receiverID, point, reason) VALUES (?, ?, ?, ?, ?)', [payload.serverID, payload.senderUserID, payload.userID, (payload.point == 1) ? '+1' : '-1', payload.reason]);
      return this.sendResult({
        points: receiver.data[0].repPoints + payload.point
      });
    } catch (e) {
      return this.sendError('Wystapił problem podczas łączenia z bazą danych');
    }
  }
}

module.exports = {
  name: 'rep',
  class: Rep
};