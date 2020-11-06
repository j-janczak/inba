const {client, clientEmiter} = require(`./my_modules/discordClient.js`);
const messageLogs = require(`./my_modules/messageLogs.js`);
const outputs = require(`./my_modules/inbaOutputs.js`);
const commands = require(`./my_modules/commands.js`);
client.commands = commands.loadModules(`./commands`);
const botConfig = require(`./config/config.json`);
const colors = require('colors');

class MrInba {
    constructor() {
        client.once(`ready`, () => this.onReady());
        client.on(`message`, msg => this.onMessage(msg));
        client.on('raw', packet => this.rawToReaction(packet));

        client.login(botConfig.token);
    }
    onReady() {
        client.user.setActivity(`Type ${botConfig.prefix} help`);
        console.log(`Inba powstał! - ${client.guilds.cache.size} serwerów 🖥`.gray);
        client.guilds.cache.forEach(g => {console.log(g.name.gray)});
    }
    onMessage(msg) {
        if (msg.channel.type != `text`) return;
        messageLogs.execute(msg);
        if (msg.author.id == client.user.id) return;
        if (msg.content == botConfig.prefix) return msg.channel.send(outputs.get(`ping`, [`<@!${msg.author.id}>`]));
        if (!msg.content.match((new RegExp(`^${botConfig.prefix} `, `g`)))) return;
    
        let args = [];
        let result;
        let argsPatt = new RegExp(/(?: "([^"\n]+)")|(?: ([^"\n ]+))/g);
        while (result = argsPatt.exec(` ${msg.content.slice(botConfig.prefix.length + 1)}`)) args.push(result[1] ? result[1] : result[2]);
    
        const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));
        if (command) command.execute(msg, args);
        else msg.channel.send(outputs.get(`typical`, `unknownCommand`, [``]).replace(`  `, ` `));
    }
    rawToReaction(packet) {
        if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
        const channel = client.channels.get(packet.d.channel_id);
        if (channel.messages.has(packet.d.message_id)) return;
        channel.fetchMessage(packet.d.message_id).then(message => {
            const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
            const reaction = message.reactions.get(emoji);
            if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
            if (packet.t === 'MESSAGE_REACTION_ADD') {
                client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
            }
            if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
            }
        });
    } //https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/raw-events.md <3
}

new MrInba();