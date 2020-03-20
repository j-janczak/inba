const botConfig = require(`../config/config.json`);
const sd = require(`../my_modules/simpleDiscord.js`);
const op = require(`../my_modules/inbaOutputs.js`);
const Discord = require(`discord.js`);

class Avatar {
    constructor(msg, args) {
        this.msg = msg;
        this.args = args;

        if (args.length < 2) {
            this.sendHelp();
            return;
        }

        if (args[1] == `help`) this.sendHelp();
        else if (args[1] == `server`) this.getServerIcon();
        else {
            let member = sd.getMember(this.msg, this.args, this.args[1]);
            if (member) this.getAvatar(member);
            else sd.send(msg, sd.getEmbed(0, op.get(`typical`, `error`, `memberNotFound`)));
        }
    }
    getAvatar(member) {
        let title = op.get(`avatar`, `embed`, `user`, `title`, [member.displayName]);
        let desc = `[Link](${member.user.avatarURL({size: 2048, format: `png`})} 'Avatar URL')`;
        let image = member.user.avatarURL({size: 2048});
        let color = member.displayColor;
        let footer = op.get(`avatar`, `embed`, `footer`, [this.msg.member.displayName]);
        this.sendEmbed(title, desc, image, color, footer);
    }
    getServerIcon() {
        let title = op.get(`avatar`, `embed`, `server`, `title`);
        let desc = `[Link](${this.msg.guild.iconURL({size: 2048, format: `png`})} 'Avatar URL')`;
        let image = this.msg.guild.iconURL({size: 2048});
        let color = botConfig.botColor;
        let footer = op.get(`avatar`, `embed`, `footer`, [this.msg.member.displayName]);
        this.sendEmbed(title, desc, image, color, footer);
    }
    sendEmbed(title, desc, image, color, footer) {
        let avatarEmbed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(desc)
            .setImage(image)
            .setColor(color)
            .setFooter(footer);
        sd.send(this.msg, avatarEmbed);
    }
    sendHelp() {
        let descMsg = `
            \`${botConfig.prefix} ${this.args[0]} <@user>\` - Shows the user's avatar
            \`${botConfig.prefix} ${this.args[0]} server\` - Shows the server icon
            \`${botConfig.prefix} ${this.args[0]} help\` - You're here
        `;
        let embed = new Discord.MessageEmbed()
            .setAuthor(`Mr. Inba Manual`)
            .setTitle(`Avatar`)
            .setDescription(descMsg)
            .setColor(botConfig.botColor);
        this.msg.channel.send(embed);
    }
}

module.exports = {
    name: `avatar`,
    aliases: [`icon`],
    execute(msg, args) {new Avatar(msg, args)}
}