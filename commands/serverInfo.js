const Discord = require('discord.js');
const sd = require(`../my_modules/simpleDiscord.js`);
const op = require(`../my_modules/inbaOutputs.js`);
const timeFormat = require('../my_modules/timeFormat.js');

module.exports = {
    name: 'serverinfo',
    description: 'Shows server info',
    execute(message, args) {
        const server = message.guild;
        const rolesEmbed = new Discord.RichEmbed();
        rolesEmbed
            .setTitle(`${server.name}`)
            .setDescription(op.direct(`serverInfo`, `server_info`))
            .addField(op.direct(`serverInfo`, `owner`), `<@${server.ownerID}>`, true)
            .addField(op.direct(`serverInfo`, `region`), server.region, true)
            .addField(op.direct(`serverInfo`, `creation_date`), timeFormat.getDate(server.createdTimestamp), true)
            .addField(op.direct(`serverInfo`, `users`), server.memberCount, true)
            .addField(op.direct(`serverInfo`, `roles`), server.roles.size, true)
            .addField(op.direct(`serverInfo`, `emojis`), server.emojis.size, true)
            .setColor('#0099ff')
            .setThumbnail(server.iconURL);
        sd.send(message, rolesEmbed);
    },
};
