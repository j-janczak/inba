const apiConfig = require('./src/config.json'),
  { log } = require('../src/utils'),
  Hapi = require('@hapi/hapi'),
  mariadb = require('mariadb'),
  path = require('path'),
  fs = require('fs');
require('colors');

class InbaApi {
  constructor() {
    this.routers = [];
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

  initRouters() {
    const callRouter = async (routerName, path, payload, params, sqlConn) => {
      const router = this.routers.find(r => r.name == routerName);
      if (router) return await router.class[path](payload, params, sqlConn);
    };

    const files = fs.readdirSync('./src/routers/');
    files.forEach(file => {
      if (path.extname(file) == '.js') {
        const router = require('./src/routers/' + file);
        this.routers.push({
          name: router.name,
          class: new router.class(this.server, this.sqlPool, callRouter)
        });
      }
    });
  }

  async startServer() {
    try {
      await this.server.start();
      log('InbaAPI ' + 'działa'.green + ' pod adresem: ' + this.server.info.uri.cyan);
    } catch (e) {
      console.error(e);
    }
  }
}

new InbaApi();