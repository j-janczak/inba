const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const botConfig = require(`../config/config.json`);
const Discord = require(`discord.js`);

class Help extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args)

        const desc = `
            This is only a list of available commands, for details type \`${botConfig.prefix} <command> help\`

            \`${botConfig.prefix} avatar|icon\` - Shows the user avatar or server icon
            \`${botConfig.prefix} ban\`
            \`${botConfig.prefix} kick\`
            \`${botConfig.prefix} color|c\` - Colorful nicknames
            \`${botConfig.prefix} defaultRole|dr\` - The role each new server member gets
            \`${botConfig.prefix} help\`
            \`${botConfig.prefix} info|i\` - Server, user information etc.
            \`${botConfig.prefix} mute\`
            \`${botConfig.prefix} ping\`
            \`${botConfig.prefix} purge\`
            \`${botConfig.prefix} role\` - Managing member roles
            \`${botConfig.prefix} welcomeMessage|wm\` - A welcome message at the entrance of a new member
            \`${botConfig.prefix} farewellMessage|fm\` - As above
        `.replace(`    `, ``);

        let embed = new Discord.MessageEmbed()
            .setAuthor(`Mr. Inba Manual`)
            .setTitle(`Main`)
            .setDescription(desc)
            .setColor(botConfig.botColor);
        this.msg.author.send(embed).then(m => {
            this.msg.react(`👌`);
        }).catch(e => {
            this.msg.reply(`An error occurred :\\ See if you have unlocked dm`);
        });
    }
}

module.exports = {
    name: `help`,
    execute(msg, args) {new Help(msg, args)}
}