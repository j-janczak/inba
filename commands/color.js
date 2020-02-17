const sd = require(`../my_modules/simpleDiscord.js`);
const op = require(`../my_modules/inbaOutputs.js`);
const botConfig = require(`../config/config.json`);
const permissions = require(`./checkPermission.js`);

const fs = require(`fs`);
const rolesColorJson = fs.readFileSync(`./config/roles_color.json`);
const rolesColor = JSON.parse(rolesColorJson);

const colorPrefix = `[InColor]`;

module.exports = {
	name: `color`,
	description: `Custom nick colors for users`,
	execute(message, args) {
        if (args.length == 1) this.help(message);
        else if (args[1] == `help`) this.help(message);
        else if (args[1] == `initialize`) this.initialize(message);
        else if (args[1] == `list`) this.list(message);
        else if (args[1] == `destruction`) this.destruction(message);
        else this.setColor(message, args[1]);
    },
    initialize(message) {
        if(permissions.execute(message, [false])) {
            Object.keys(rolesColor).forEach(colorName => {
                message.channel.guild.createRole({
                    name: `${colorPrefix} ${colorName}`,
                    color: rolesColor[colorName],
                }).catch(console.error)
            });
            sd.send(message, `Preparing roles...`);
        } else sd.send(message, op.random(`unauthorized`));
    },
    destruction(message) {
        if(permissions.execute(message, [false])) {
            message.guild.roles.forEach(role => {
                if(role.name.startsWith(`${colorPrefix} `)) role.delete();
            });
            sd.send(message, `Deleting roles...`);
        } else sd.send(message, op.random(`unauthorized`));
    },
    list(message) {
        message.channel.send(``, {files: [`./resources/color_list.jpg`]});
    },
    setColor(message, wantedColor) {
        let found = false;
        Object.keys(rolesColor).forEach(colorName => {
            if(found) return;
            if(colorName.toUpperCase() == wantedColor.toUpperCase()) {
                found = true;
                wantedColor = colorName;
            }
        });
        if(found) {
            message.member._roles.forEach(roleID => {
                let userRole = message.guild.roles.find(role => role.id === roleID);
                if(userRole.name.startsWith(`${colorPrefix} `)) message.member.removeRole(userRole).catch(console.error);
            });

            let role = message.guild.roles.find(role => role.name === `${colorPrefix} ${wantedColor}`)
            message.member.addRole(role)
                .then(() => {
                    sd.send(message, `<@${message.author.id}> Your nick now has ${wantedColor} color`);
                })
                .catch(() => {
                    sd.send(message, `<@${message.author.id}> Whoops! I didn't find role responsible for this color. Ask the administrator to use \`\`${botConfig.prefix} color initialize\`\``);
                });
        } else {
            sd.send(message, `<@${message.author.id}> I didn't find that color, write \`\`${botConfig.prefix} color list\`\` to see colors list`);
        }
    },
    help(message) {
        sd.send(message, `**Color manual**\n\n\`\`"any available color"\`\` - Sets the color of your nick\n\`\`list\`\` - Shows color list\n\`\`initialize\`\` - Creates color roles | *Admin*\n\`\`destruction\`\` - Removes color roles | *Admin*`);
    }
};
