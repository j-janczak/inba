const {token} = require('./cfg/config.json')
const Discord = require('discord.js');
const DB = require('./bot_files/mongo.js');


class MrInba {
    constructor() {
        const client = new Discord.Client();
        client.on('ready', this.ready);
        client.on('message', this.onMessage);
        client.login(token);
    }
    ready() {
        console.log(`Zalogowano`);
    }
    onMessage(msg) {
        console.log(msg.content);
    }
}

new MrInba();