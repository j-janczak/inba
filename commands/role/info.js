const Discord = require('discord.js');
const timeFormat = require(`../../my_modules/timeFormat.js`);
const op = require(`../../my_modules/inbaOutputs.js`);
const sd = require(`../../my_modules/simpleDiscord.js`);

function findRole(message, args) {
    let role = null;
    if (message.mentions.roles.size == 1) role = message.mentions.roles.first();
    else if (args.length > 3) {
        const roleRegex = /"([^"]+)"/;
        let rolesArray = [];
        if (rolesArray = message.content.match(roleRegex)) {
            role = rolesArray[1];
            role = message.guild.roles.find(r => r.name.toLowerCase() == role.toLowerCase());
        }
    } else if (args.length == 3) {
        role = (args[2].startsWith(`@`) ? args[2].slice(1) : args[2]);
        role = message.guild.roles.find(r => r.name.toLowerCase() == role.toLowerCase());
    }
    return role;
}

function getEmbed(role) {
    const permissions = new Discord.Permissions(role.permissions);
    let permissionsString = (role.permissions == 0 ? `None` : ``);
    permissions.toArray().forEach((permission, index) => {
        permission = permission.split(`_`).join(` `);
        permission = permission.slice(0, 1) + permission.slice(1).toLowerCase();
        permissionsString += `· ${permission}`
        if (index < permissions.toArray().length) permissionsString += `\n`;
    });

    return new Discord.RichEmbed()
        .setTitle(role.name)
        .setDescription(op.direct(`role`, `info_desc`))
        .setColor((role.color != 0 ? role.color : `#2f3136`))
        .addField(`Members`, role.members.size, true)
        .addField(`Position`, role.guild.roles.size - role.calculatedPosition, true)
        .addField(`Mentionable`, `${role.mentionable}`.slice(0, 1).toUpperCase() + `${role.mentionable}`.slice(1).toLowerCase(), true)
        .addField(`Created at`, timeFormat.getDate(role.createdTimestamp), true)
        .addField(`Permissions`, permissionsString, false);
}

module.exports = {
    name: 'info',
    description: 'displays info about role',
    execute(message, args) {
        let role = findRole(message, args);
        if (role) sd.send(message, getEmbed(role));
        else sd.send(message, sd.getEmbed(0, op.direct(`role`, `roleNotFound`, [args[2]])))
    },
};
