const CommandTemplate = require(`./_Command.js`);
const botConfig = require('../cfg/config.json');

class Help extends CommandTemplate {
    constructor(msg, args, client) {
        super(msg, args, client);

        const helpEmbed = {
            color: botConfig.colors.botColor,
            title: 'Impossible Nice Bot Ai aka Mr. Inba',
            thumbnail: this.client.user.avatarURL(), 
            description: `To view help for a particular command, type \`${botConfig.prefix} <command> help\`

Available commands:
\`${botConfig.prefix} crypto\` Displays the current value of the selected cryptocurrency
\`${botConfig.prefix} status\` Displays the XCH Garden Pool statistics
\`${botConfig.prefix} poll\` Polls wizard
\`${botConfig.prefix} +rep/-rep\` Show love to other users, give them reputation points ❤`,
            fields: [
                {
                    name: 'Author',
                    value: '<@599569173990866965>',
                    inline: true,
                },
                {
                    name: 'GitHub',
                    value: 'https://github.com/TheFlashes/inba',
                    inline: true,
                },
            ]
        };
        
        this.send({ embed: helpEmbed });
    }
}

module.exports = {
    name: `help`,
    execute(msg, args, client) {new Help(msg, args, client)}
}