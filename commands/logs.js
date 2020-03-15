const Discord = require('discord.js');
const botConfig = require(`../config/config.json`);
const op = require(`../my_modules/inbaOutputs.js`);
const sd = require(`../my_modules/simpleDiscord.js`);
const commands = require(`../my_modules/commands.js`);

let logsCommands = commands.loadModules(`./commands/logs`);

function _execute(message, args) {
    if (args.length > 1) {
        const command = logsCommands.get(args[1]) || logsCommands.find(cmd => cmd.aliases && cmd.aliases.includes(args[1]));
        if (command) command.execute(message, args);
        else {
            let user = undefined;
            let userNick = args[1];
            if (args[1].match(/^<@!\d+>$/)) user = message.guild.members.find(member => member.user.id == message.mentions.users.first().id);
            else {
                userNick = message.content.slice(botConfig.prefix.length + 1 + `logs`.length + 1);
                user = message.guild.members.find(member => member.user.username == userNick) || message.guild.members.find(member => member.nickname == userNick);
            }

            if (user) logsCommands.get(`user`).execute(message, user);
            else sd.send(message, sd.getEmbed(0, op.direct(`userLogs`, `errorCantFindUser`, [userNick])));
        }
    }
}

module.exports = {
    name: 'logs',
    description: 'logs commands',
    execute(message, args) {_execute(message, args)}
}

/*
const helpEmbed = new Discord.RichEmbed()
            .setAuthor(`Inba Manual`)
            .setTitle(`Logs`)
            .addField(`**\`\`!mi logs @user\`\`**`, `Wyświetla logi danego użytkownika`)
            .addField(`**\`\`!mi role server\`\`**`, `Wyświetla statystyki serwera z obecnego dnia`)
            .setColor(`#ff7f50`);
        sd.send(message, helpEmbed);
*/