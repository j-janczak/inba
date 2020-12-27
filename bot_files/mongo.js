const {mongoAdress} = require('../cfg/config.json');
const dbTemplates = require('../cfg/db_templates.json');
const mongo = require('mongodb');
class MongoDB {
    constructor() {
        this.mrinbaDB = null;
        const mdb = mongo.MongoClient;
        mdb.connect(mongoAdress, {useNewUrlParser: true, useUnifiedTopology: true}).then((client) => {
            this.mrinbaDB = client.db("mrinba_test");
            console.log("Connected to mongoDB");
        }).catch((err) => {
            console.error(err);
        })
    }
    findServer(serverID, callback) {
        this.mrinbaDB.collection("servers").findOne({"_id": serverID}, (err, res) => {
            if (err) { console.error(err); return; }
            else if (res === null) {
                const serverTemplate = dbTemplates.server;
                serverTemplate._id = serverID;
                this.mrinbaDB.collection("servers").insertOne(serverTemplate, (err, res1) => {
                    if (err) { console.error(err); return; }
                    else callback(res1.ops[0]);
                });
            } else callback(res);
        });
    }
    updateServerMsgCount(serverID, value) {
        this.mrinbaDB.collection("servers").updateOne(
            { _id: serverID },
            { $inc: { msgCount: value } }
        );
    }
    findMember(author, serverID, callback) {
        this.mrinbaDB.collection("members").findOne({"_id": author._id, "_serverID": serverID}, (err, res) => {
            if (err) { console.error(err); return; }
            else if (res === null) {
                const memberTemplate = dbTemplates.member;
                memberTemplate._id = author._id;
                memberTemplate._serverID = serverID;
                memberTemplate.name = author.name;
                this.mrinbaDB.collection("members").insertOne(memberTemplate, (err, res1) => {
                    if (err) { console.error(err); return; }
                    else callback(res1.ops[0]);
                });
            } else callback(res);
        });
    }
    updateMemberMsgCount(memberID, serverID, value) {
        this.mrinbaDB.collection("members").updateOne(
            { _id: memberID, _serverID: serverID },
            { $inc: { msgCount: value } }
        );
    }
    logMessage(data) {
        //console.log(data);
        this.findServer(data.server._id, res => this.updateServerMsgCount(res._id, 1));
        this.findMember(data.author, data.server._id, res => this.updateMemberMsgCount(res._id, res._serverID, 1));
        this.mrinbaDB.collection("message_logs").insertOne(data, (err, res) => { if (err) console.error(err) })
    }
}

const connection = new MongoDB();

module.exports = {
    db: connection,
    templates: dbTemplates
}