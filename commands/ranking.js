const CommandTemplate = require(`./_Command.js`);
const inbaDB = require('../bot_files/inbaDB.js');
const botConfig = require(`../cfg/config.json`);

class Ranking extends CommandTemplate {
    constructor(msg, args, client) {
        super(msg, args, client);

        if (!this.checkPermission()) return;
        this.getServerRanking();
    }
    async getServerRanking() {
        try {
            const rankingResult = await inbaDB.get('message_logs/serverRanking', [this.msg.guild.id]);
            
            let descContent = '';
            rankingResult.data.forEach((user, i) => {
                descContent += `\`${i+1}\`: <@${user._id}>: ${user.count}\n`;
            })
        
            const rankingEmbed = {
                color: botConfig.colors.botColor,
                title: `Top of ${this.msg.guild.name} 🏆`,
                thumbnail: {
                    url: this.msg.guild.iconURL(),
                },
                description: `Most active members\n\n${descContent}`
            }

            this.send({embed: rankingEmbed});
        } catch (e) {
            this.sendEmbed(0, 'Wystąpił błąd podczas łączenia z db');
        }
    }
}

module.exports = {
    name: `ranking`,
    execute(msg, args, client) {new Ranking(msg, args, client)}
}