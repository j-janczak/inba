const Discord = require(`discord.js`);
const botConfig = require(`../config/config.json`);

function _send(message, str, callback = null) {
    message.channel.send(str)
    .then(msg => {if(callback) callback(msg)})
    .catch(error => {console.error(`Failed to send message!\nserwer: ${message.guild.name}\nchannel:${message.channel.name}\nerror: ${error}`)});
}

function _getEmbed(type, msg) {
    let embed = new Discord.RichEmbed();
    if (type == 0) embed.setDescription(`⛔\xa0\xa0\xa0\xa0${msg}`).setColor(`#D32F2F`);
    else if (type == 1) embed.setDescription(`✅\xa0\xa0\xa0\xa0${msg}`).setColor(`#00E676`);
    else if (type == 2) embed.setDescription(`⚠\xa0\xa0\xa0\xa0${msg}`).setColor(`#F57C00`);
    return embed;
}

function _getMember(message, command, arg) {
    let member = undefined;
    if (message.mentions.users.size) {
        let memberMentionRegEx = new RegExp(/^<@!(\d+)>$/).exec(arg);
        if (memberMentionRegEx != null && memberMentionRegEx !== undefined) {
            member = message.guild.members.find(m => m.user.id == memberMentionRegEx[1]);
        }
    } else {
        let memberNick = message.content.slice(botConfig.prefix.length + 1 + command.length + 1).trim();
        member = message.guild.members.find(m => m.user.username == memberNick) || message.guild.members.find(m => m.nickname == memberNick);
    }
    return member;
}

module.exports = {
    send(message, str, callback = null) {return _send(message, str, callback)},
    getEmbed(type, msg) {return _getEmbed(type, msg)},
    getMember(message, command, arg) {return _getMember(message, command, arg)}
};