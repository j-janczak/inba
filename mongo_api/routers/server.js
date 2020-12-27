const Collection = require("./_Collection.js");

class Server extends Collection {
    constructor(_name, _schema) {
        super(_name, _schema);
    }
    /* override */ get(req, res, next) {
        this.model.find({}, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    }
    /* override */ post(data, req, res, next) {
        const newServer = new this.model({
            _id: data._id,
        })
        newServer.save();
        res.send('yes');
    }
}

const serverRouter = new Server('server', {
    _id: {type: Number, require: true},
    msgCount: {type: Number, default: 0},
    games: {type: Array, default: []},
    welcome_messages: {type: Array, default: []},
    farewell_messages:{type: Array, default: []}
});

module.exports = serverRouter;

