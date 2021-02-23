const Collection = require("./_Collection.js");

class RepPoint extends Collection {
    constructor(_name, _schema) {
        super(_name, _schema);

        this.router.get('/:serverID/:userID', this.getRep.bind(this));
    }
    getRep(req, res, next) {
        this.globasRes = res;
        this.model.findOne({
            server_id: req.params.serverID,
            user_id: req.params.userID
        }, (err, result) => {
            if (err) {
                this.sendResult('REP POINT GET', {error: err});
            } else {
                this.sendResult('REP POINT GET', result);
            }
        });
    }
    /* override */ post(data, req, res, next) {
        this.globasRes = res;
        this.model.findOneAndUpdate({
            server_id: data.server_id,
            user_id: data.user_id
        }, {
            $inc : {'points' : data.points}
        }, {
            upsert: true,
            setDefaultsOnInsert: true,
            new: true,
            useFindAndModify: false
        }, (err, result) => {
            if (err) this.sendResult('REP POINT UPDATE', {error: err});
            else this.sendResult('REP POINT UPDATE', result);
        });
    }
}

const repPoint = new RepPoint('rep_point', {
    server_id: {type: String, require: true},
    user_id: {type: String, require: true},
    points: {type: Number, require: true, default: 0},
});

module.exports = repPoint;

