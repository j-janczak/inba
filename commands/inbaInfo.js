const Discord = require('discord.js');
const op = require(`../my_modules/inbaOutputs.js`);

module.exports = {
    name: 'inbainfo',
    description: 'Shows bots info',
    execute(message, args) {
        const bot = (message.guild.members.get(`599715195740225537`) ? message.guild.members.get(`599715195740225537`).user : message.guild.members.get(`646389189977309185`).user);

        const inbaEmbed = new Discord.RichEmbed();
        inbaEmbed
            .setTitle(op.direct(`inbaInfo`, `bot_name`))
            .setDescription(op.direct(`inbaInfo`, `desc`))
            .setThumbnail(bot.avatarURL)
            .addField(op.direct(`inbaInfo`, `creator`), op.direct(`inbaInfo`, `creator_data`), true)
            .addField(op.direct(`inbaInfo`, `version`), op.direct(`inbaInfo`, `version_data`), true)
            .addField(op.direct(`inbaInfo`, `written`), op.direct(`inbaInfo`, `written_data`), true)
            .addField(op.direct(`inbaInfo`, `origin`), op.direct(`inbaInfo`, `origin_data`), true)
            .addField(`Thanks to R3l3ntl3ss for meme API <3`, `https://github.com/R3l3ntl3ss/Meme_Api`, false)
            .setFooter(op.direct(`inbaInfo`, `help`))
            .setColor('#ff8000')

        message.channel.send(op.direct(`inbaInfo`, `greeting`, [message.author.id]), {embed: inbaEmbed})
    },
};
