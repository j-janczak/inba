const Router = require('../router.js');

class Birthdays extends Router {
  constructor (server, sqlPool) {
    super('birthdays', server, sqlPool);

    this.addRoute('GET', '', this.get.bind(this));
    this.addRoute('GET', '{id}', this.getUser.bind(this));
  }

  async get(data, sqlConn) {
    const birthdaysList = await sqlConn.query('SELECT * FROM birthdays ORDER BY MONTH(date), DAY(date)');
    return birthdaysList.map(birthday => {
      return {
        userID: birthday.userID,
        userName: birthday.userName,
        date: birthday.date
      };
    });
  }

  async getUser(data, sqlConn, request) {
    const birthday = await sqlConn.query('SELECT * FROM birthdays WHERE userID = ?', [request.params.id]);
    return birthday;
  }
}

module.exports = Birthdays;