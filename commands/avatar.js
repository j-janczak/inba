const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const botConfig = require(`../config/config.json`);
const Discord = require(`discord.js`);

class Avatar extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args)

        if (args.length < 2) {
            this.help();
            return;
        }

        if (args[1] == `help`) this.help();
        else if (args[1] == `server`) this.getServerIcon();
        else {
            let member = this.getMember(1);
            if (member) this.getAvatar(member);
            else this.sendEmbed(0, this.getString(`typical`, `error`, `memberNotFound`));
        }
    }
    getAvatar(member) {
        let title = this.getString(`avatar`, `embed`, `user`, `title`, [member.displayName]);
        let desc = `[Link](${member.user.avatarURL({size: 2048, format: `png`})} 'Avatar URL')`;
        let image = member.user.avatarURL({size: 2048});
        let color = member.displayColor;
        let footer = this.getString(`avatar`, `embed`, `footer`, [this.msg.member.displayName]);
        this.sendAvEmbed(title, desc, image, color, footer);
    }
    getServerIcon() {
        let title = this.getString(`avatar`, `embed`, `server`, `title`);
        let desc = `[Link](${this.msg.guild.iconURL({size: 2048, format: `png`})} 'Avatar URL')`;
        let image = this.msg.guild.iconURL({size: 2048});
        let color = botConfig.botColor;
        let footer = this.getString(`avatar`, `embed`, `footer`, [this.msg.member.displayName]);
        this.sendAvEmbed(title, desc, image, color, footer);
    }
    sendAvEmbed(title, desc, image, color, footer) {
        let avatarEmbed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(desc)
            .setImage(image)
            .setColor(color)
            .setFooter(footer);
        this.send(avatarEmbed);
    }
    help() {
        let descMsg = `
            \`${botConfig.prefix} ${this.args[0]} <@user>\` - Shows the user's avatar
            \`${botConfig.prefix} ${this.args[0]} server\` - Shows the server icon
            \`${botConfig.prefix} ${this.args[0]} help\` - You're here
        `;
        this.sendHelp(`Avatar`, descMsg);
    }
}

module.exports = {
    name: `avatar`,
    aliases: [`icon`, `av`],
    execute(msg, args) {new Avatar(msg, args)}
}