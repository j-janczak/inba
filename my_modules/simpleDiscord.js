const Discord = require(`discord.js`);

module.exports = {
    send(message, str, callback = null) {
        message.channel.send(str)
        .then(msg => {if(callback) callback(msg)})
        .catch(error => {console.error(`Failed to send message!\nserwer: ${message.guild.name}\nchannel:${message.channel.name}\nerror: ${error}`)});
    },
    getEmbed(type, msg) {
        let embed = new Discord.RichEmbed();
        if (type == 0) embed.setDescription(`⛔\xa0\xa0\xa0\xa0${msg}`).setColor(`#D32F2F`);
        else if (type == 1) embed.setDescription(`✅\xa0\xa0\xa0\xa0${msg}`).setColor(`#00E676`);
        else if (type == 2) embed.setDescription(`⚠\xa0\xa0\xa0\xa0${msg}`).setColor(`#F57C00`);
        return embed;
    },
};