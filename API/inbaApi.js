const apiConfig = require('./src/config.json'),
  Hapi = require('@hapi/hapi'),
  mariadb = require('mariadb'),
  log = require('../src/log');
require('colors');

const StartupTest = require('./src/routers/startupTest.js');
const Birthdays = require('./src/routers/birthdays.js');

class InbaApi {
  constructor() {
    this.sqlPool = mariadb.createPool(apiConfig.mariadb);
    this.server = Hapi.server(apiConfig.server);
    this.asyncConstructor();
  }

  async asyncConstructor() {
    await this.testDBConnection();
    this.initRouters();
    this.startServer();
  }

  async testDBConnection() {
    let conn;
    try {
      conn = await this.sqlPool.getConnection();
      await conn.query('SELECT 1');
      log('Pomyślnie ' + 'połączono'.green + ' z bazą danych ' + (apiConfig.mariadb.host + ':' + apiConfig.mariadb.database).cyan);
    } catch (error) {
      log('ERROR! Nie udało się nawiązać połączenia z bazą danych '.red + (apiConfig.mariadb.host + ':' + apiConfig.mariadb.database).brightRed);
      console.error(error);
      process.exit(1);
    } finally {
      if (conn) conn.release();
    }
  }

  async startServer() {
    try {
      await this.server.start();
      log('InbaAPI ' + 'działa'.green + ' pod adresem: ' + this.server.info.uri.cyan);
    } catch (e) {
      console.error(e);
    }
  }

  initRouters() {
    new StartupTest(this.server, this.sqlPool);
    new Birthdays(this.server, this.sqlPool);
  }
}

new InbaApi();