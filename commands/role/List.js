const Discord = require('discord.js');

module.exports = {
    name: 'list',
    description: 'Ping!',
    execute(message, args) {
        let rolesArray = Array.from(message.guild.roles);

        var roles = [];
        rolesArray.forEach(role => {
            roles[role[1].position] = role[1].name;
        });

        var rolesString = "";
        for (let roleIndex = roles.length - 1; roleIndex >= 0; roleIndex--) {
            rolesString += `· ${roles[roleIndex]}\n`;
        }

        const rolesEmbed = new Discord.RichEmbed();
        rolesEmbed
            .setTitle(`Znalazłem ${rolesArray.length} role`)
            .setColor('#0099ff')
            .setDescription(rolesString);
        message.channel.send(rolesEmbed);
    },
};
