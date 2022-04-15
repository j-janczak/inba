const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');

const mongoConfig = require('./config.json');
const serversRouter = require('./routers/server.js')
const messageLogsRouter = require('./routers/message_log.js')
const repPointsRouter = require('./routers/rep_point.js')

mongoose.connect(mongoConfig.mongo.uri, mongoConfig.mongo.opt);
const connection = mongoose.connection;
connection.once('open', function() {
    console.log('Połączono z MongoDB', mongoConfig.mongo.uri);
});

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);
app.use('/servers', serversRouter.router);
app.use('/message_logs', messageLogsRouter.router);
app.use('/rep_points', repPointsRouter.router);

router.get('/', (req, res, next) => {
    res.send("Welcome to Mr. Inba™ Api")
})
app.get('*', function(req, res){
    res.status(404).send('Not found');
});

app.listen(4000, () => {
    console.log("Serwer API działa na porcie 4000");
});