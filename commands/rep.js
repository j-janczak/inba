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

        if (args[0] == `rep` && args[1] == `help`) {this.help(); return;}
        else if (args[0] == `rep` && args[1] == `ranking`) {this.ranking(); return;}
        else if (args[0] == `rep` && args[1] == `history`) {this.getMemberHistory(this.getMember(2)); return;}
        else if (args[0] == `myrep` && args[1] == `history`) {this.getMemberHistory(this.msg.member); return;}
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
        if (this.msg.author.id == memberToRep.id) {
            this.send(this.returnEmbed(2, this.getString(`repPoint`, `repMyself`)));
            return;
        }

        let repType = type ? `+` : `-`;
        let color = type ? `#00E676` : `#D32F2F`;

        let result1 = await db.query("INSERT INTO `mrinba`.`repPoints` (serverFK, userFK, points) VALUES (?, ?, " + repType + "1) ON DUPLICATE KEY UPDATE `repPoints`.`points` = `repPoints`.`points` " + repType + " 1",
            [this.msg.guild.id, memberToRep.id]);
        if (!result1) return;

        let reason = this.msg.content.slice(this.msg.content.indexOf(this.args[1]) + this.args[1].length + 1).trim();

        if (reason.length) {
            if (reason.length) reason = reason.length > 120 ? `${reason.slice(0, 117)}...` : reason;
            db.query("INSERT INTO `mrinba`.`repQuotes` (id, serverFK, senderFK, receiverFK, quote, pointType) VALUES (NULL, ?, ?, ?, ?, " + repType + "1)",
                [this.msg.guild.id, this.msg.author.id, memberToRep.id, reason]);
        }

        let result2 = await db.query("SELECT * FROM `mrinba`.`repPoints` WHERE `repPoints`.`serverFK` = ? AND `repPoints`.`userFK` = ?",
            [this.msg.guild.id, memberToRep.id]);
        if (!result2) return;

        let emojiPoints = this.pointsToEmoji(result2[0].points.toString());
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
    async getMemberHistory(member) {
        if (member === undefined) {
            this.send(this.returnEmbed(2, this.getString(`typical`, `error`, `memberNotFound`)));
            return;
        }

        let result = await db.query("SELECT * FROM repQuotes WHERE serverFK = ? AND receiverFK = ? ORDER BY id DESC LIMIT 10",
            [this.msg.guild.id, member.id]);
        if (!result) return;

        if (!result.length) {
            this.sendEmbed(2, `This user has no reputation history`);
            return;
        }

        let result2 = await db.query("SELECT * FROM repPoints WHERE serverFK = ? AND userFK = ?",
            [this.msg.guild.id, member.id]);
        if (!result2) return;

        let history = ``;
        result.forEach(row => {
            let point = row.pointType > 0 ? `+1` : `\xa0\xa0-1`;
            history += `**${point}**, "${row.quote}" ~ <@!${row.senderFK}>\n`;
        })

        let repEmbed = new Discord.MessageEmbed()
            .setAuthor(member.displayName)
            .setTitle(`Reputation history`)
            .setDescription(history)
            .setFooter(`In total: ${this.pointsToEmoji(result2[0].points.toString())}`)
            .setColor(botConfig.botColor);
        this.send(repEmbed);
    }
    async ranking() {
        let result = await db.query("SELECT * FROM repPoints WHERE serverFK = ? ORDER BY points DESC LIMIT 10",
            [this.msg.guild.id]);
        if (!result) return;

        let ranking = ``;
        result.forEach((row, index) => {
            ranking += `\`${index + 1}\`. <@!${row.userFK}> - **${this.pointsToEmoji(row.points.toString())}**\n`;
        })

        let repEmbed = new Discord.MessageEmbed()
            .setTitle(`Reputation ranking`)
            .setDescription(ranking)
            .setColor(botConfig.botColor);
        this.send(repEmbed);
    }
    pointsToEmoji(points) {
        let emojiPoints = ``;
        for (let i = 0; i < points.length; i++) {
            if (points.charAt(i) == `-`) emojiPoints += `—`;
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
            \`${botConfig.prefix} myRep history\` - History of your points
            \`${botConfig.prefix} rep <@user>\` - Shows user points
            \`${botConfig.prefix} rep history <@user>\` - User points history
            \`${botConfig.prefix} rep ranking\` - Users ranking
        `;
        this.sendHelp(`Reputation points`, descMsg);
    }
}

module.exports = {
    name: `rep`,
    aliases: [`+rep`, `-rep`, `myrep`],
    execute(msg, args) {new Rep(msg, args)}
}