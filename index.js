const {token} = require('./cfg/config.json');
const mongo = require('./bot_files/mongo.js');
const Discord = require('discord.js');
const messageLogs = require('./bot_files/message_logs.js');


class MrInba {
    constructor() {
        this.client = new Discord.Client();
        this.client.on('ready', (c) => {this.ready(c)});
        this.client.on('message', (msg) => {this.onMessage(msg)});

        

        this.ml = new messageLogs();

        this.client.login(token);
    }
    ready() {
        console.log("Zalogowano");
    }
    onMessage(msg) {
        this.ml.logs(msg);
        console.log(msg.content);
    }
}

new MrInba();