const { log } = require('../../src/utils');

class Router {
  constructor(routerName, server, sqlPool) {
    log('Tworzenie routera ' + routerName.cyan);
    this.routerName = routerName;
    this.server = server;
    this.sqlPool = sqlPool;
  }

  addRoute(method, name, callback) {
    log(' • ' + method.yellow + ` /${name}`.cyan);
    this.server.route({
      method: method,
      path: (name != '') ? '/' + this.routerName + '/' + name : '/' + this.routerName,
      handler: async (request) => {
        log('Wywołano ' + method.yellow + ' ' + (this.routerName + '/' + name).cyan);
        let sqlConn;
        try {
          sqlConn = await this.sqlPool.getConnection();
          const querryResult = await callback(request.payload, sqlConn, request);
          return querryResult;
        } catch (error) {
          log('ERROR!'.red);
          console.error(error);
        } finally {
          if (sqlConn) sqlConn.release();
        }
      }
    });
  }
}

module.exports = Router;