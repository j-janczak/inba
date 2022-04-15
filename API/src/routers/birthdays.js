const Router = require('../router.js');

class Birthdays extends Router {
  constructor (server, sqlPool, callRouter) {
    super('birthdays', server, sqlPool, callRouter);

    this.addRoute('GET', '', this.get.bind(this));
    this.addRoute('GET', '{id}', this.getUser.bind(this));
  }

  async get(payload, params, sqlConn) {
    const birthdaysList = await sqlConn.query('SELECT * FROM birthdays ORDER BY MONTH(date), DAY(date)');
    return this.sendResult(birthdaysList.map(birthday => {
      return {
        userID: birthday.userID,
        userName: birthday.userName,
        date: birthday.date
      };
    }));
  }

  async getUser(payload, params, sqlConn) {
    const birthday = await sqlConn.query('SELECT * FROM birthdays WHERE userID = ?', [params.id]);
    return this.sendResult(birthday);
  }
}

module.exports = {
  name: 'birthdays',
  class: Birthdays
};