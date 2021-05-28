const Collection = require("./_Collection.js");

class Server extends Collection {
    constructor(_name, _schema) {
        super(_name, _schema);
        this.router.get('/welcomeMessages/:serverID', (req, res, next) => {this.getWelcomeFarewellMessages(req, res, next, 1)});
        this.router.get('/farewellMessages/:serverID', (req, res, next) => {this.getWelcomeFarewellMessages(req, res, next, 0)});
    }
    /* override */ get(req, res, next) {
        let query = this.model.find({}).select('_id msgCount games welcome_messages farewell_messages');
        
        query.exec((err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    }
    /* override */ async post(data, req, res, next) {
        this.globasRes = res;

        try {
            await this.model.findOneAndUpdate({
                _id: data._id
            }, {
                _id: data._id,
                name: data.name,
            }, {
                upsert: true,
                setDefaultsOnInsert: true
            }).exec();
            this.sendResult({result: 'Ok'})
        } catch(e) {
            this.sendResult({error: e})
        } 
    }

    async getWelcomeFarewellMessages(req, res, next, type) {
        this.globasRes = res;
        try {
            const result = await this.model.findById(req.params.serverID).exec();
            if (type) this.sendResult({messages: result.welcome_messages})
            else this.sendResult({messages: result.farewell_messages})
        } catch(e) {
            this.sendResult({error: e})
        }       
    }
}

const serverRouter = new Server('server', {
    _id: {type: String, require: true},
    name: {type: String, default: ""},
    msgCount: {type: Number, default: 0},
    games: {type: Array, default: []},
    welcome_messages: {type: Array, default: []},
    farewell_messages:{type: Array, default: []}
});

module.exports = serverRouter;

