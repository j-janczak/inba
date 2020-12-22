const {mongoAdress} = require('../cfg/config.json')
const mongo = require('mongodb');

const mdb = mongo.MongoClient;

class MongoDB {
    constructor() {
        mdb.connect(mongoAdress, {useNewUrlParser: true, useUnifiedTopology: true}).then((db) => {
            console.log("Connected to mongoDB");
        }).catch((err) => {
            console.error(err);
        })
    }
    
}

exports = new MongoDB();