const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const botConfig = require(`../config/config.json`);
const {db} = require(`../my_modules/database.js`);
const Discord = require(`discord.js`);

class Logs extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args)

        if (this.args.length < 2) return this.help();

        this.action = this.args[1].toLowerCase();
        if (this.action == `user`) this.user();
        else if (this.action == `channel`) this.channel();
        else this.help();

        //let member = this.getMember(2);
    }
    user() {
        if (this.args.length < 3) return this.userMsgCount(this.msg.member);
        else if (this.args[2].toLowerCase() == `ranking`) {
            if (this.checkPermission()) return this.ranking(true);
        } else {
            let member = this.getMember(2);
            if (member !== undefined) return this.userMsgCount(member);
            else this.sendEmbed(0, this.getString(`typical`, `error`, `memberNotFound`));
        }
    }
    async userMsgCount(member) {
        let count = await db.query("SELECT COUNT(*) AS msgCount FROM `messageLogs` WHERE `serverFK` = ? AND `userFK` = ?", [this.msg.guild.id, member.id]);
        if (!count) return;
        let countEmbed = this.returnEmbed(3, this.getString(`logs`, `msgCount`, [`<@!${member.id}>`, count[0].msgCount]));
        countEmbed.setFooter(this.getString(`logs`, `footer`));
        this.send(countEmbed);
    }
    channel() {
        if (this.args.length < 3) {
            let descMsg = `
            \`${botConfig.prefix} ${this.args[1]} <channel>\` - Number of messages on the channel
            \`${botConfig.prefix} ${this.args[1]} ranking\` - Ranking of the most popular channels on server
            `;
            this.sendHelp(`Logs channel`, descMsg);
        }
        else if (this.args[2].toLowerCase() == `ranking`) {
            if (this.checkPermission()) return this.ranking(false);
        } else {
            let channel = this.getChannel(2);
            if (channel !== undefined) return this.channelMsgCount(channel);
            else this.sendEmbed(0, this.getString(`typical`, `error`, `channelNotFound`));
        }
    }
    async channelMsgCount(channel) {
        let count = await db.query("SELECT COUNT(*) AS msgCount FROM `messageLogs` WHERE `serverFK` = ? AND `channelFK` = ?", [this.msg.guild.id, channel.id]);
        if (!count) return;
        let countEmbed = this.returnEmbed(3, this.getString(`logs`, `channelMsgCount`, [`<#${channel.id}>`, count[0].msgCount]));
        countEmbed.setFooter(this.getString(`logs`, `footer`));
        this.send(countEmbed);
    }
    async ranking(type) { //true: user | false: channel
        let rankingData;
        
        if (type) rankingData = await db.query("SELECT DISTINCT userFK as elementID, (SELECT count(*) FROM `messageLogs` WHERE `userFK` = elementID AND `serverFK` = ?) as msgCount FROM `messageLogs` WHERE `serverFK` = ? AND `bot` = 0 ORDER BY `msgCount` DESC LIMIT 10;", [this.msg.guild.id, this.msg.guild.id]);
        else rankingData = await db.query("SELECT DISTINCT channelFK as elementID, (SELECT count(*) FROM `messageLogs` WHERE `channelFK` = elementID AND `serverFK` = ? AND `bot` = 0) as msgCount FROM `messageLogs` WHERE `serverFK` = ? AND `bot` = 0 ORDER BY `msgCount` DESC LIMIT 10;", [this.msg.guild.id, this.msg.guild.id]);
        if (!rankingData) return;

        let rankingEmbed = new Discord.MessageEmbed();
        rankingEmbed.setTitle(`Top of ${this.msg.guild.name}`);
        rankingEmbed.setColor(botConfig.botColor);
        rankingEmbed.setFooter(this.getString(`logs`, `footer`));

        let rankingTxt = ``;
        if (type) rankingTxt += `*Members ranking*\n\n`;
        else rankingTxt += `*Channels ranking*\n\n`
        rankingData.forEach((element, elementIndex) => {
            if (type) rankingTxt += `\`${elementIndex+1}\`. <@!${element.elementID}> - \`${element.msgCount}\`\n`;
            else rankingTxt += `\`${elementIndex+1}\`. <#${element.elementID}> - \`${element.msgCount}\`\n`;
        });

        rankingEmbed.setDescription(rankingTxt);

        this.send(rankingEmbed);
    }
    help() {
        let descMsg = `
            \`${botConfig.prefix} ${this.args[0]} user\` - Number of messages you sent
            \`${botConfig.prefix} ${this.args[0]} user <@user>\` - Number of messages someone sent
            \`${botConfig.prefix} ${this.args[0]} user ranking\` - Ranking of the most active members
            \`${botConfig.prefix} ${this.args[0]} channel <#channel>\` - Number of messages on the channel
            \`${botConfig.prefix} ${this.args[0]} channel ranking\` - Ranking of the most popular channels on server
        `;
        this.sendHelp(`Logs`, descMsg);
    }
}

module.exports = {
    name: `logs`,
    execute(msg, args) {new Logs(msg, args)}
}