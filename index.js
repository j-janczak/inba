const {token} = require('./cfg/config.json')
const Discord = require('discord.js');
const MongoDB = require('./bot_files/mongo.js');
const messageLogs = require('./bot_files/message_logs.js');

class MrInba {
    constructor() {
        const client = new Discord.Client();
        client.on('ready', this.ready);
        client.on('message', (msg) => {this.onMessage(msg)});

        this.ml = new messageLogs();

        client.login(token);
    }
    ready() {
        console.log(`Zalogowano`);
    }
    onMessage(msg) {
        this.ml.logs(msg);
        console.log(msg.content);
    }
}

new MrInba();