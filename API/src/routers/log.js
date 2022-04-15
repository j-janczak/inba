const Router = require('../router.js');

class Logs extends Router {
  constructor (server, sqlPool, callRouter) {
    super('logs', server, sqlPool, callRouter);

    this.addRoute('POST', '', this.logMsg.bind(this));
    this.addRoute('GET', '{serverID}', this.ranking.bind(this));
  }

  async logMsg(payload, params, sqlConn) {
    try {
      const sender = await this.callRouter('users', 'get', payload, {userID: payload.userID, serverID: payload.serverID}, sqlConn);
      const senderServer = await this.callRouter('servers', 'get', payload, {serverID: payload.serverID}, sqlConn);
      await sqlConn.query('UPDATE users SET msgCount = msgCount + 1 WHERE id = ?', [sender.data[0].id]);
      await sqlConn.query('UPDATE servers SET msgCount = msgCount + 1 WHERE id = ?', [senderServer.data[0].id]);
      await sqlConn.query('INSERT INTO messageLogs (serverID, channelID, userID, bot, content, attachment, date) VALUES (?, ?, ?, ?, ?, ?, NOW())', [payload.serverID, payload.channelID, payload.userID, payload.bot, payload.content, payload.attachment]);
      
      if ((senderServer.data[0].msgCount + 1) % 1000 == 0)
        return this.sendResult({serverMilestone: senderServer.data[0].msgCount});
      else
        return this.sendResult({serverMilestone: 0});
    } catch (error) { this.sendError({}); }
  }

  async ranking(payload, params, sqlConn) {
    try {
      const result = await sqlConn.query('SELECT userID, msgCount FROM users WHERE serverID = ? ORDER BY msgCount DESC LIMIT 10', [params.serverID]);
      return this.sendResult(result);
    } catch (error) { this.sendError(error); }
  }
}

module.exports = {
  name: 'logs',
  class: Logs
};