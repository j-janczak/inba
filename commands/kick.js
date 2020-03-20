const sd = require(`../my_modules/simpleDiscord.js`);
const op = require(`../my_modules/inbaOutputs.js`);

class Kick {
    constructor(msg, args) {
        this.msg = msg;
        this.args = args;

        if(!sd.checkPermission(msg)) return;
        let member = sd.getMember(msg, args, args[1]);
        if (member) this.kick(member);
        else sd.send(msg, sd.getEmbed(0, op.get(`typical`, `error`, `memberNotFound`)));
    }
    kick(member) {
        /*let reason;
        if (this.args.length > 2) {
            this.args.splice(0, 1);
            reason = this.args.join(` `);
        } else {
            reason = op.get(`kick`, `noReason`);
        }*/
        //TODO
        
        member.kick(reason).then((exMember) => {
            sd.send(msg, sd.getEmbed(1, op.get(`kick`, `success`, [exMember.user.tag])));
        }).catch((e) => {
            console.error(e);
            sd.send(msg, sd.getEmbed(1, op.get(`kick`, `error`)));
        });
    }
}

module.exports = {
    name: `kick`,
    execute(msg, args) {new Kick(msg, args)}
}