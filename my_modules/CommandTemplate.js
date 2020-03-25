const botConfig = require(`../config/config.json`);
const outputs = require(`../config/outputs.json`);
const Discord = require(`discord.js`);

class CommandTemplate{
    constructor(msg, args) {
        this.msg = msg;
        this.args = args;
    }
    checkPermission() {
        let perm = (this.msg.author.id === '599569173990866965' || this.msg.member.hasPermission("ADMINISTRATOR"));
        if (!perm) this.sendEmbed(0, this.getString.get(`noPermission`));
        return perm;
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
    getRole(argIndex) {
        let role;
        if (this.msg.mentions.roles.size) {
            let roleMentionRegEx = new RegExp(/^<@&(\d+)>$/).exec(this.args[argIndex]);
            if (roleMentionRegEx != null && roleMentionRegEx !== undefined) {
                role = this.msg.guild.roles.cache.find(r => r.id == roleMentionRegEx[1]);
            }
        }
        else role = this.msg.guild.roles.cache.find(r => r.name == this.args[argIndex]);
        return role;
    }
    send(str, callback = null) {
        this.msg.channel.send(str)
        .then(m => {if(callback) callback(m)})
        .catch(error => {console.error(`Failed to send msg!\nserwer: ${this.msg.guild.name}\nchannel:${this.msg.channel.name}\nerror: ${error}`)});
    }
    sendEmbed(type, str) {
        this.send(this.returnEmbed(type, str));
    }
    returnEmbed(type, str) {
        let embed = new Discord.MessageEmbed();
        if (type == 0) embed.setDescription(`⛔\xa0\xa0\xa0\xa0${str}`).setColor(`#D32F2F`);
        else if (type == 1) embed.setDescription(`✅\xa0\xa0\xa0\xa0${str}`).setColor(`#00E676`);
        else if (type == 2) embed.setDescription(`⚠\xa0\xa0\xa0\xa0${str}`).setColor(`#F57C00`);
        else if (type == 3) embed.setDescription(`➡\xa0\xa0\xa0\xa0${str}`).setColor(`#F57C00`);
        return embed;
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
    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    } //https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404 <3
    sendHelp(title, desc) {
        let embed = new Discord.MessageEmbed()
            .setAuthor(`Mr. Inba Manual`)
            .setTitle(title)
            .setDescription(desc)
            .setColor(botConfig.botColor);
        this.send(embed);
    }
}

module.exports = CommandTemplate;