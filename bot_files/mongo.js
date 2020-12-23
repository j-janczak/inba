const {mongoAdress} = require('../cfg/config.json')
const mongo = require('mongodb');
class MongoDB {
    constructor() {
        this.mrinbaDB = null;
        const mdb = mongo.MongoClient;
        mdb.connect(mongoAdress, {useNewUrlParser: true, useUnifiedTopology: true}).then((client) => {
            this.mrinbaDB = client.db("mrinba");
            console.log("Connected to mongoDB");
        }).catch((err) => {
            console.error(err);
        })
    }
    logMessage(data) {
        this.mrinbaDB.collection("message_logs").insertOne(data, (err, res) => {
            if (err) console.error(err);
        })
    }
}

const connection = new MongoDB();

module.exports = connection