const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const botConfig = require(`../config/config.json`);
const Discord = require(`discord.js`);

class Say extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args)

        if (this.msg.author.id == `599569173990866965`) {
            this.send(this.msg.content.slice(botConfig.prefix.length + 1 + `say`.length + 1));
            this.msg.delete();
        }
    }
}

module.exports = {
    name: `say`,
    execute(msg, args) {new Say(msg, args)}
}