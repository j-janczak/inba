const Discord = require(`discord.js`);
const fs = require(`fs`);

const outputsJson = fs.readFileSync(`./config/outputs.json`);
const outputs = JSON.parse(outputsJson);

class CommandTemplate{
    constructor(msg, args) {
        this.msg = msg;
        this.args = args;
    }
    checkPermission() {
        let perm = (msg.author.id === '599569173990866965' || this.msg.member.hasPermission("ADMINISTRATOR"));
        if (!perm) _send(this.msg, _getEmbed(0, this.getString.get(`noPermission`)));
        return perm
    }
    getMember(argIndex) {
        let member;
        if (this.msg.mentions.users.size) {
            let memberMentionRegEx = new RegExp(/^<@!(\d+)>$/).exec(this.args[argIndex]);
            if (memberMentionRegEx != null && memberMentionRegEx !== undefined) {
                member = this.msg.guild.members.cache.find(m => m.user.id == memberMentionRegEx[1]);
            }
        } else {
            member = this.msg.guild.members.cache.find(m => m.user.username == this.args[argIndex]) || this.msg.guild.members.cache.find(m => m.nickname == this.args[argIndex]);
        }
        return member;
    }
    send(str, callback = null) {
        this.msg.channel.send(str)
        .then(m => {if(callback) callback(m)})
        .catch(error => {console.error(`Failed to send msg!\nserwer: ${this.msg.guild.name}\nchannel:${this.msg.channel.name}\nerror: ${error}`)});
    }
    sendEmbed(type, str) {
        let embed = new Discord.MessageEmbed();
        if (type == 0) embed.setDescription(`⛔\xa0\xa0\xa0\xa0${str}`).setColor(`#D32F2F`);
        else if (type == 1) embed.setDescription(`✅\xa0\xa0\xa0\xa0${str}`).setColor(`#00E676`);
        else if (type == 2) embed.setDescription(`⚠\xa0\xa0\xa0\xa0${str}`).setColor(`#F57C00`);
        this.send(embed);
    }
    getString() {
        let values;
        let skip;
        if (Array.isArray(arguments[Object.keys(arguments)[Object.keys(arguments).length - 1]])) {
            values = arguments[Object.keys(arguments)[Object.keys(arguments).length - 1]];
            skip = Object.keys(arguments)[Object.keys(arguments).length - 1];
        }
        
        let currentArray = outputs;
        for (const arg in arguments) {
            if (arg == skip) continue;
            currentArray = currentArray[arguments[arg]];
        }
    
        if (Array.isArray(currentArray))
            currentArray = currentArray[Math.floor(Math.random() * currentArray.length)];
    
        if (values) {
            values.forEach(value => {
                currentArray = currentArray.replace("%s", value);
            });
        }
        return currentArray;
    }
}

module.exports = CommandTemplate;