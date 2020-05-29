const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const botConfig = require(`../config/config.json`);
const {db} = require(`../my_modules/database.js`);
const Discord = require(`discord.js`);

class Logs extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args)

        if (this.args.length < 2) return this.msgCount(msg.member);

        this.action = this.args[1].toLowerCase();
        if (this.action == `count`) {
            if (this.args.length < 3) return this.msgCount(msg.member);
            else {
                let member = this.getMember(2);
                if (member) return this.msgCount(member);
                else this.sendEmbed(0, this.getString(`typical`, `error`, `memberNotFound`));
            }
        } else if (this.action == `ranking`) {
            if (this.checkPermission()) return this.ranking();
        }

        //let member = this.getMember(2);
    }
    async msgCount(member) {
        let count = await db.query("SELECT COUNT(*) AS msgCount FROM `messageLogs` WHERE `serverFK` = ? AND `userFK` = ?", [this.msg.guild.id, member.id]);
        if (!count) return;
        let countEmbed = this.returnEmbed(3, this.getString(`logs`, `msgCount`, [`<@!${member.id}>`, `\`${count[0].msgCount}\``]));
        countEmbed.setFooter(this.getString(`logs`, `footer`));
        this.send(countEmbed);
    }
    async ranking() {
        let rankingData = await db.query("SELECT DISTINCT userFK as userID, (SELECT count(*) FROM `messageLogs` WHERE `userFK` = userID AND `serverFK` = ?) as msgCount FROM `messageLogs` WHERE `serverFK` = ? AND `bot` = 0 ORDER BY `msgCount` DESC LIMIT 10;", [this.msg.guild.id, this.msg.guild.id]);
        if (!rankingData) return;

        let rankingEmbed = new Discord.MessageEmbed();
        rankingEmbed.setTitle(`Top of ${this.msg.guild.name}`);
        rankingEmbed.setColor(botConfig.botColor);
        rankingEmbed.setFooter(this.getString(`logs`, `footer`));

        let rankingTxt = ``;
        rankingData.forEach((member, memberIndex) => {
            rankingTxt += `\`${memberIndex+1}\`. <@!${member.userID}> - \`${member.msgCount}\`\n`;
        });

        rankingEmbed.setDescription(rankingTxt);

        this.send(rankingEmbed);
    }
}

module.exports = {
    name: `logs`,
    execute(msg, args) {new Logs(msg, args)}
}