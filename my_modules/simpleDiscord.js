const botConfig = require(`../config/config.json`);
const op = require(`./inbaOutputs.js`);
const Discord = require(`discord.js`);

function _send(msg, str, callback = null) {
    msg.channel.send(str)
    .then(m => {if(callback) callback(m)})
    .catch(error => {console.error(`Failed to send msg!\nserwer: ${msg.guild.name}\nchannel:${msg.channel.name}\nerror: ${error}`)});
}

function _getEmbed(type, msg) {
    let embed = new Discord.MessageEmbed();
    if (type == 0) embed.setDescription(`⛔\xa0\xa0\xa0\xa0${msg}`).setColor(`#D32F2F`);
    else if (type == 1) embed.setDescription(`✅\xa0\xa0\xa0\xa0${msg}`).setColor(`#00E676`);
    else if (type == 2) embed.setDescription(`⚠\xa0\xa0\xa0\xa0${msg}`).setColor(`#F57C00`);
    return embed;
}

function _getMember(msg, args, arg) {
    let member;
    if (msg.mentions.users.size) {
        let memberMentionRegEx = new RegExp(/^<@!(\d+)>$/).exec(arg);
        if (memberMentionRegEx != null && memberMentionRegEx !== undefined) {
            member = msg.guild.members.cache.find(m => m.user.id == memberMentionRegEx[1]);
        }
    } else {
        args.splice(0, 1);
        let memberNick = args.join(` `);
        member = msg.guild.members.cache.find(m => m.user.username == memberNick) || msg.guild.members.cache.find(m => m.nickname == memberNick);
    }
    return member;
}

function _checkPermission(msg) {
    let perm = (msg.author.id === '599569173990866965' || msg.member.hasPermission("ADMINISTRATOR"));
    if (!perm) _send(msg, _getEmbed(0, op.get(`noPermission`)));
    return perm
}

module.exports = {
    send(msg, str, callback = null) {return _send(msg, str, callback)},
    getEmbed(type, msg) {return _getEmbed(type, msg)},
    getMember(msg, args, arg) {return _getMember(msg, args, arg)},
    checkPermission(msg) {return _checkPermission(msg)}
};