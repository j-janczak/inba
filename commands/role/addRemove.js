const Discord = require('discord.js');
const db = require(`../../my_modules/database.js`);
const timeFormat = require(`../../my_modules/timeFormat.js`);
const sd = require(`../../my_modules/simpleDiscord.js`);
const op = require(`../../my_modules/inbaOutputs.js`);
const permissions = require('../checkPermission.js');

module.exports = {
    name: `add`,
    aliases: [`remove`],
    description: `adding user to role`,
    execute(message, args) {
        if (!permissions.execute(message, [false])) {
            sd.send(message, op.random(`unauthorized`));
            return;
        }
        if (message.mentions.members.size == 0) {
            sd.send(message, op.direct(`role`, `userNotSpecified`));
        }
        else if (message.mentions.roles.size == 0 && (args.length == 4 || args.length == 5) && args[3].startsWith(`@`)) {
            let roleName = args[3].slice(1);
            let roleRegEx = new RegExp(roleName, `i`);
            let rolePlace = message.content.search(roleRegEx);
            let foundRoleName = message.content.slice(rolePlace, rolePlace + roleName.length);
            let foundRole = null;
            if (foundRole = message.guild.roles.find(r => r.name == foundRoleName)) {
                if (args[1] == `add`) this.addRole(message, message.mentions.members.first(), foundRole, args);
                else if (args[1] == `remove`) this.remove(message, message.mentions.members.first(), foundRole);
            }
            else sd.send(message, op.direct(`role`, `roleNotFound`, [`@${foundRoleName}`]));
        }
        else if (message.mentions.roles.size == 0) sd.send(message, op.direct(`role`, `roleNotSpecified`));
        else if (args[1] == `add`) this.addRole(message, message.mentions.members.first(), message.mentions.roles.first(), args);
        else if (args[1] == `remove`) this.remove(message, message.mentions.members.first(), message.mentions.roles.first());
    },
    addRole(message, member, role, args) {
        if (member.roles.find(r => r.id == role.id)) 
            sd.send(message, sd.getEmbed(false, op.direct(`role`, `memberAlreadyHadRole`, [`<@${member.id}>`, `<@&${role.id}>`])));

        else if(args.length == 5) {
            let taskTimeStamp = false;
            if(taskTimeStamp = timeFormat.argToTime(args[4])) {
                db.query("INSERT INTO `mrinba`.`activeTasks` (`activeTaskID`, `serverFK`, `userFK`, `taskFK`, `taskData`, `endTimeStamp`) VALUES (null, '?', '?', 1, '?', '?')", [message.guild.id, member.id, role.id, taskTimeStamp], result => {
                    member.addRole(role.id)
                    .then(log => {
                        const successEmbed = new Discord.RichEmbed()
                            .setDescription(`✅ ` + op.direct(`role`, `roleAddSuccess`, [`<@${member.id}>`, `<@&${role.id}>`]))
                            .setColor(role.color)
                            .setFooter(op.direct(`role`, `timedRole`, [timeFormat.getDate(taskTimeStamp)]));
                        sd.send(message, successEmbed);
                    })
                    .catch(console.error);
                });
            } else {
                sd.send(message, op.direct(`role`, `wrongTimeSyntax`));
            }
        } else {
            member.addRole(role.id)
            .then(log => {
                sd.send(message, sd.getEmbed(true, op.direct(`role`, `roleAddSuccess`, [`<@${member.id}>`, `<@&${role.id}>`])));
            })
            .catch(console.error);
        }
    },
    remove(message, member, role) {
        if (!member.roles.find(r => r.id == role.id)) {
            sd.send(message, sd.getEmbed(false, op.direct(`role`, `roleInMemberNotFound`, [`<@${member.id}>`, `<@&${role.id}>`])));
        } else {
            member.removeRole(role.id)
            .then(log => {
                sd.send(message, sd.getEmbed(true, op.direct(`role`, `roleTakeAwaySuccess`, [`<@${member.id}>`, `<@&${role.id}>`])));
            })
            .catch(console.error);
        }
    }
};

db.serverEvents.on(`removeRole`, (server, member, role) => {
    setImmediate(() => {
        member.removeRole(role)
        .catch(console.error);
    });
});
