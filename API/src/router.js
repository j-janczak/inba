const { log } = require('../../src/utils');

class Router {
  constructor(routerName, server, sqlPool, callRouter) {
    log('Tworzenie routera ' + routerName.cyan);
    this.routerName = routerName;
    this.server = server;
    this.sqlPool = sqlPool;
    this.callRouter = callRouter;
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
          const querryResult = await callback(request.payload, request.params, sqlConn);
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

  sendError(e) {
    console.error(e);
    return {
      success: false,
      error: e
    };
  }

  sendResult(data) {
    return {
      success: true,
      data: data
    };
  }
}

module.exports = Router;