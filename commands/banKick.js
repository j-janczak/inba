const CommandTemplate = require(`../my_modules/CommandTemplate.js`);

class BanKick extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args)
        this.type = (this.args[0].toLowerCase() == `ban` ? 0 : 1);

        if(!this.checkPermission(msg)) return;
        let member = this.getMember(1);
        if (member) this.kick(member);
        else this.sendEmbed(0, op.get(`typical`, `error`, `memberNotFound`));
    }
    kick(member) {
        let _reason;
        if (this.args.length > 2) {
            this.args.splice(0, 2);
            _reason = this.args.join(` `);
        } else {
            _reason = op.get(`banKick`, `noReason`);
        }
        
        if (this.type) {
            member.kick(_reason).then((exMember) => {
                this.sendEmbed(1, this.getString(`banKick`, `success`, this.type, [exMember.user.tag, _reason]));
            }).catch((e) => {
                console.error(e);
                this.sendEmbed(1, this.getString(`banKick`, `error`, [this.args[0]]));
            });
        } else {
            member.ban({reason: _reason}).then((exMember) => {
                this.sendEmbed(1, this.getString(`banKick`, `success`, this.type, [exMember.user.tag, _reason]));
            }).catch((e) => {
                console.error(e);
                this.sendEmbed(1, this.getString(`banKick`, `error`, [this.args[0]]));
            });
        }
    }
}

module.exports = {
    name: `kick`,
    aliases: [`ban`],
    execute(msg, args) {new BanKick(msg, args)}
}