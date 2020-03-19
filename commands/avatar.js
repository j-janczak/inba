const Discord = require('discord.js');
const op = require(`../my_modules/inbaOutputs.js`);
const sd = require(`../my_modules/simpleDiscord.js`);

module.exports = {
    name: 'avatar',
    description: 'Shows avatar',
    execute(message, args) {
        let title = ``;
        let desc = ``;
        let color = ``;
        let image = ``;

        if (args[1] == `server`) {
            title = `Server icon`;
            desc = `What a beauty!`;
            color = `#2f3136`;
            image = message.guild.iconURL;
        } else {
            let member = sd.getMember(message, this.name, args[1]);
            if (member == null || member === undefined) {
                sd.send(message, sd.getEmbed(0, op.direct(`mainErrors`, `userNotFound`, [args[1]])));
                return;
            }
            title = `@${member.displayName}`;
            desc = op.direct(`avatar`, `user_avatar`);
            color = member.displayHexColor;
            image = member.user.avatarURL;
        }
        const iconEmbed = new Discord.RichEmbed()
            .setTitle(title)
            .setDescription(desc)
            .setColor(color)
            .setImage(image);

        if (iconEmbed != null || iconEmbed !== undefined) message.channel.send(iconEmbed).catch(console.error);
    },
};
