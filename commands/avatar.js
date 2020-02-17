const Discord = require('discord.js');
const op = require(`../my_modules/inbaOutputs.js`);

module.exports = {
    name: 'avatar',
    description: 'Shows avatar',
    execute(message, args) {
        var member = (message.mentions.members.size ? message.mentions.members.first(): message.member);
        const rolesEmbed = new Discord.RichEmbed()
            .setTitle(`@${member.displayName}`)
            .setDescription(op.direct(`avatar`, `user_avatar`))
            .setColor('#0099ff')
            .setImage(member.user.avatarURL);
        message.channel.send(rolesEmbed);
    },
};
