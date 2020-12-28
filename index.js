const botConfig = require('./cfg/config.json');
const Discord = require('discord.js');
const messageLogs = require('./bot_files/message_logs.js');

const commands = require(`./bot_files/commands.js`);

class MrInba {
    constructor() {
        this.client = new Discord.Client();
        this.client.commands = commands.loadModules(`./commands`);
        this.client.on('ready', (c) => {this.ready(c)});
        this.client.on('message', (msg) => {this.onMessage(msg)});

        this.ml = new messageLogs();

        this.client.login(botConfig.token);
    }
    ready() {
        this.client.user.setActivity(`!ji | Jestem w becie OwO`);
        console.log("Zalogowano");
    }
    onMessage(msg) {
        if (msg.channel.type != `text`) return;
        //this.ml.logs(msg);
        if (msg.author.id == this.client.user.id) return;

        //if (msg.content == botConfig.prefix) return msg.channel.send(outputs.get(`ping`, [`<@!${msg.author.id}>`]));
        if (!msg.content.match((new RegExp(`^${botConfig.prefix} `, `g`)))) return;


        let args = [],
            result,
            argsPatt = new RegExp(/(?: "([^"\n]+)")|(?: ([^"\n ]+))/g);
        while (result = argsPatt.exec(` ${msg.content.slice(botConfig.prefix.length + 1)}`)) args.push(result[1] ? result[1] : result[2]);

        const command = this.client.commands.get(args[0].toLowerCase()) || this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));
        if (command) command.execute(msg, args);
    }
}

new MrInba();