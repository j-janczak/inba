const Discord = require('discord.js');
const sd = require(`../my_modules/simpleDiscord.js`);
const commands = require(`../my_modules/commands.js`);

let roleCommands = commands.loadModules(`./commands/role`);

module.exports = {
    name: 'role',
    description: 'Congiguration of server',
    execute(message, args) {
        const command = roleCommands.get(args[1]) || roleCommands.find(cmd => cmd.aliases && cmd.aliases.includes(args[1]));
        if (command) command.execute(message, args);
        else {
            const helpEmbed = new Discord.RichEmbed()
                .setAuthor(`Inba Manual`)
                .setTitle(`Roles`)
                .addField(`**\`\`!mi role add @user @role *time\`\`**`, `It gives the user a roles.\nIf the role is not mentionable it can't contains whitespaces.\n*You can add time after which role disappears as the last argument.\nExample: \`\`30m\`\`, \`\`5h30m\`\`, \`\`7d\`\``)
                .addField(`**\`\`!mi role remove @user @role\`\`**`, `It simply removes the user role.`)
                .setColor(`#ff7f50`);
            sd.send(message, helpEmbed);
        }
    },
};
