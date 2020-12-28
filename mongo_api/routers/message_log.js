const Collection = require("./_Collection.js");

class MessageLog extends Collection {
    constructor(_name, _schema) {
        super(_name, _schema);
    }
    /* override */ get(req, res, next) {
        let query = this.model.find({}).select('_id server channel author content clearContent attachments createdTime deleted');
        
        query.exec((err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    }
    /* override */ getOne(req, res, next) {
        console.log(req.params.id)
        let query = this.model.findById(req.params.id).select('_id server channel author content clearContent attachments createdTime deleted');
        
        query.exec((err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    }
    /* override */ post(data, req, res, next) {
        const newLog = new this.model({
            _id: data._id,
            server: {
                _id: data.server_id,
                name: data.server_name
            },
            channel: {
                _id: data.channel_id,
                name: data.channel_name
            },
            author: {
                _id: data.author_id,
                name: data.author_name,
                bot: data.author_bot
            },
            content: data.content,
            clearContent: data.clearContent,
            attachments: data.attachments,
            createdTime: data.createdTime,
            deleted: data.deleted
        })
        newLog.save(err => {
            if (err) res.status(500).send(err);
            else res.send({
                success: true
            })
        });
    }
}

const messageLog = new MessageLog('message_log', {
    _id: {type: String, require: true},
    server: {
        _id: {type: String, require: true},
        name: {type: String, require: true}
    },
    channel: {
        _id: {type: String, require: true},
        name: {type: String, require: true}
    },
    author: {
        _id: {type: String, require: true},
        name: {type: String, require: true},
        bot: {type: Boolean, require: true}
    },
    content: {type: String, require: true},
    clearContent: {type: String, require: true},
    attachments: {type: Object, default: {}},
    createdTime: {type: Number, require: true},
    deleted: {type: Boolean, default: false}
});

module.exports = messageLog;

