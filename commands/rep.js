const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const botConfig = require(`../config/config.json`);
const {db} = require(`../my_modules/database.js`);
const Discord = require(`discord.js`);

/*
    type:
    0: -rep
    1: +rep
*/

class Rep extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args)

        if (args[0] == `rep` && args[1] == `help`) {
            this.help();
            return;
        }
        else if (args[0] == `-rep`) this.changeRepPoint(0, this.getMember(1));
        else if (args[0] == `+rep`) this.changeRepPoint(1, this.getMember(1));
        else if (args[0] == `myrep`) this.getMemberRep(this.msg.member);
        else if (args[0] == `rep`) this.getMemberRep(this.getMember(1));
    }
    async changeRepPoint(type, memberToRep) {
        if (memberToRep === undefined) {
            this.send(this.returnEmbed(2, this.getString(`typical`, `error`, `memberNotFound`)));
            return;
        }

        let repType = type ? `+` : `-`;
        let color = type ? `#00E676` : `#D32F2F`;

        let result1 = await db.query("INSERT INTO `mrinba`.`repPoints` (serverFK, userFK, points) VALUES (?, ?, 0) ON DUPLICATE KEY UPDATE `repPoints`.`points` = `repPoints`.`points` " + repType + " 1",
            [this.msg.guild.id, memberToRep.id]);
        if (!result1) return;

        let result2 = await db.query("SELECT * FROM `mrinba`.`repPoints` WHERE `repPoints`.`serverFK` = ? AND `repPoints`.`userFK` = ?",
            [this.msg.guild.id, memberToRep.id]);
        if (!result2) return;

        let emojiPoints = this.pointsToEmoji(result2[0].points.toString());

        let reason = this.msg.content.slice(this.msg.content.indexOf(this.args[1]) + this.args[1].length + 1).trim();
        let reasonEmbed = reason.length ? this.getString(`repPoint`, `repChanged`, [`<@!${this.msg.author.id}>`, `<@!${memberToRep.id}>`, `${repType}1`, reason, this.msg.member.displayName]) : this.getString(`repPoint`, `repChangedNoReason`, [`<@!${this.msg.author.id}>`, `<@!${memberToRep.id}>`, `${repType}1`])

        let repEmbed = new Discord.MessageEmbed()
            .setTitle(this.getString(`repPoint`, `titles`))
            .setDescription(reasonEmbed)
            .setFooter(`${memberToRep.displayName} points: ${emojiPoints}`)
            .setColor(color);
        this.send(repEmbed);
    }
    async getMemberRep(member) {
        if (member === undefined) {
            this.help();
            return;
        }

        let result = await db.query("SELECT * FROM `mrinba`.`repPoints` WHERE `repPoints`.`serverFK` = ? AND `repPoints`.`userFK` = ?",
            [this.msg.guild.id, member.id]);
        if (!result) return;

        let p = result[0] === undefined ? 0 : result[0].points;
        let emojiPoints = this.pointsToEmoji(p.toString());

        this.send(this.returnEmbed(3, this.getString(`repPoint`, `memberPoints`, [member.displayName, emojiPoints])));
    }
    pointsToEmoji(points) {
        let emojiPoints = ``;
        for (let i = 0; i < points.length; i++) {
            if (points.charAt(i) == `-`) emojiPoints += `-`;
            else if (points.charAt(i) == `0`) emojiPoints += `0️⃣`;
            else if (points.charAt(i) == `1`) emojiPoints += `1️⃣`;
            else if (points.charAt(i) == `2`) emojiPoints += `2️⃣`;
            else if (points.charAt(i) == `3`) emojiPoints += `3️⃣`;
            else if (points.charAt(i) == `4`) emojiPoints += `4️⃣`;
            else if (points.charAt(i) == `5`) emojiPoints += `5️⃣`;
            else if (points.charAt(i) == `6`) emojiPoints += `6️⃣`;
            else if (points.charAt(i) == `7`) emojiPoints += `7️⃣`;
            else if (points.charAt(i) == `8`) emojiPoints += `8️⃣`;
            else if (points.charAt(i) == `9`) emojiPoints += `9️⃣`;
        }
        return emojiPoints;
    }
    help() {
        let descMsg = `
            \`${botConfig.prefix} +rep <@user>\` - Increases the user's rating
            \`${botConfig.prefix} -rep <@user>\` - Lowers the user's rating
            \`${botConfig.prefix} myRep\` - Shows your points
            \`${botConfig.prefix} rep <@user>\` - Shows user points
        `;
        this.sendHelp(`Reputation points`, descMsg);
    }
}

module.exports = {
    name: `rep`,
    aliases: [`+rep`, `-rep`, `myrep`],
    execute(msg, args) {new Rep(msg, args)}
}