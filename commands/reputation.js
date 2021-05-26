const CommandTemplate = require(`./_Command.js`);
const inbaDB = require('../bot_files/inbaDB.js');
const botConfig = require(`../cfg/config.json`);
const Discord = require(`discord.js`);

class Reputation extends CommandTemplate {
    constructor(msg, args, client) {
        super(msg, args, client);
        
        console.log(args);
        args[1] = args[1].replace('.', '');
        console.log(args);

        const memberToRep = this.getMember(2);
        if (memberToRep === undefined) {
            this.sendEmbed(2, this.getString('typical', 'error', 'memberNotFound'));
            return;
        }

        if (memberToRep.id == msg.member.id) {
            if (args[0] == botConfig.prefix) this.sendEmbed(0, "Oh no no no no no");
            else msg.react('⛔');
            return;
        }

        const point = (args[1] == '+rep') ? 1 : -1;
        
        this.sendRepToDB(msg.guild.id, memberToRep, point);
    }
    async sendRepToDB(serverID, member, point) {
        try {
            const result = await inbaDB.send('rep_points', {
                server_id: serverID,
                user_id: member.id,
                points: point
            });
            
            if (this.args[0] == botConfig.prefix) {
                const repMessage = this.args.slice(3).join(' ');
                const totalPoints = this.numberToEmoji(result.points, false);

                if (repMessage == '') {
                    const resultEmbed = new Discord.MessageEmbed()
                        .setColor((point == 1) ? botConfig.colors.success : botConfig.colors.error)
                        .setTitle(`${this.getString('repPoint', 'titles')} | ${(point == 1) ? '+1' : '-1'}`)
                        .setDescription(`${member.displayName}: ${totalPoints}`)
                        .setFooter(`By ${this.msg.member.displayName}`);
                    this.send(resultEmbed);
                } else {
                    const resultEmbed = new Discord.MessageEmbed()
                        .setColor((point == 1) ? botConfig.colors.success : botConfig.colors.error)
                        .setTitle(`${this.getString('repPoint', 'titles')}`)
                        .setDescription(`**${(point == 1) ? '+1' : '-1'}** "*${repMessage.substring(0,150)}*" ~ ${this.msg.member.displayName}`)
                        .setFooter(`${member.displayName}: ${totalPoints}`);
                    this.send(resultEmbed);
                }
            } else {
                const emojiPoints = this.numberToEmoji(result.points, true);
                const firstEmoji = (point == 1) ? '✅' : '🔻';
        
                if (emojiPoints.some(x => emojiPoints.indexOf(x) !== emojiPoints.lastIndexOf(x))) {
                    this.msg.react(firstEmoji);
                } else {
                    emojiPoints.unshift(firstEmoji);
                    this.asyncForEach(emojiPoints, async (emoji) => {
                        await this.msg.react(emoji);
                    })
                }
            }
        } catch (err) {
            console.error('ERROR');
        }
    }
}

module.exports = {
    name: `reputation`,
    execute(msg, args, client) {new Reputation(msg, args, client)}
}