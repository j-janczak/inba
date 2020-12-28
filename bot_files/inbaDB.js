const botConfig = require('../cfg/config.json')
const axios = require('axios');

function send(collName, dataArray) {
    return new Promise((resolve, reject) => {
        let urlEncodedDataArray = [];

        for (data in dataArray)
            urlEncodedDataArray.push(`${encodeURIComponent(data)}=${encodeURIComponent(dataArray[data])}`);

        const urlEncodedData = urlEncodedDataArray.join('&').replace(/%20/g, '+');

        axios.post(botConfig.dbUri + collName, urlEncodedData, {header: {"Content-type": "application/x-www-form-urlencoded"}})
        .then(resolve)
        .catch(reject);
    });
}

module.exports = {
    send
}