const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const {db} = require(`../my_modules/database.js`);

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
}

module.exports = {
    name: `logs`,
    execute(msg, args) {new Logs(msg, args)}
}