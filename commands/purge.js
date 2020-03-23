const CommandTemplate = require(`../my_modules/CommandTemplate.js`);

class Purge extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args);

        if (this.args.length < 2) {
            this.sendEmbed(0, this.getString(`purge`, `error`, `blankNumber`));
            return;
        }
        if (isNaN(this.args[1])) {
            this.sendEmbed(0, this.getString(`purge`, `error`, `notValidNumber`));
            return;
        }
        if (parseInt(this.args[1]) < 1 || parseInt(this.args[1]) > 100) {
            this.sendEmbed(0, this.getString(`purge`, `error`, `numberRange`));
            return;
        }

        this.bulk();
    }
    bulk() {
        this.msg.delete();
        this.msg.channel.bulkDelete(this.args[1], false).then(m => {
            let successEmbed = this.returnEmbed(1, this.getString(`purge`, `success`, [m.size]));
            this.send(successEmbed, ms => {
                ms.delete({timeout: 3000});
            })
        }).catch(e => {
            console.error(e);
            this.sendEmbed(0, this.getString(`purge`, `error`, `bulk`, [e.message]));
        })
    }
}

module.exports = {
    name: `purge`,
    aliases: [`p`],
    execute(msg, args) {new Purge(msg, args)}
}