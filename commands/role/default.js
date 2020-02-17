const {client, clientEmiter} = require(`../../my_modules/discordClient.js`);
const Discord = require('discord.js');
const db = require(`../../my_modules/database.js`);
const sd = require(`../../my_modules/simpleDiscord.js`);
const op = require(`../../my_modules/inbaOutputs.js`);
const permissions = require(`../checkPermission.js`);

function onMemberAdd(member) {
    db.query("SELECT `servers`.`defaultRole` FROM `servers` WHERE `servers`.`serverID` = ?", [member.guild.id], result => {
        if (result.length == 1) {
            let roles = JSON.parse(result[0].defaultRole);
            roles.forEach(role => {
                if (member.guild.roles.find(r => r.id == role)) member.addRole(role);
            });
        }
    });
}

clientEmiter.on(`memberJoined`, member => { onMemberAdd(member) });

module.exports = {
    name: 'default',
    description: 'adding user to role',
    execute(message, args) {
        if (args.length == 2) this.sendHelp(message);
        else if (!permissions.execute(message, [false])) {
            sd.send(message, op.random(`unauthorized`));
            return;
        }
        else if (args[2] == `add`) this.addDefaultRole(message, this.searchForRoles(message, args));
        else if (args[2] == `remove`) this.remDefRoles(message, args);
        else if (args[2] == `list`) this.listDefRoles(message);
    },
    sendHelp(message) {
        const helpEmbed = new Discord.RichEmbed()
            .setAuthor(`Inba Manual`)
            .setTitle(`Default Roles`)
            .setDescription(`Defaults roles are granted to each new server member`)
            .addField(`**\`\`!mi role default add <role1 role2...>\`\`**`, `Adds a default role\\roles`)
            .addField(`**\`\`!mi role default remove [all|<role1 role2...>]\`\`**`, `Removes the default role\\roles`)
            .addField(`**\`\`!mi role default list\`\`**`, `Shows a list of defaults roles`)
            .setColor(`#ff7f50`);
        sd.send(message, helpEmbed);
    },
    listDefRoles(message) {
        db.query("SELECT `servers`.`defaultRole` FROM `servers` WHERE `servers`.`serverID` = ?", [message.guild.id], result => {
            if (result.length != 1) return;
            if (result[0].defaultRole == null) return;
            let successMsg = ``;
            JSON.parse(result[0].defaultRole).forEach((rID, index) => {
                if (index > 0) successMsg += `, `;
                successMsg += `<@&${rID}>`;
            });
            const successEmbed = new Discord.RichEmbed()
                .setDescription(op.direct(`role`, `default_roleList`, [successMsg]))
                .setColor(`#00ff7f`);
            sd.send(message, successEmbed);
        });
    },
    addDefaultRole(message, roles) {
        if (roles == null) return;
        db.query("SELECT `servers`.`defaultRole` FROM `servers` WHERE `servers`.`serverID` = ?", [message.guild.id], result => {
            if (result.length != 1) return;
            if (result[0].defaultRole != null) {
                JSON.parse(result[0].defaultRole).forEach((rID, index) => {
                    roles.push(rID);
                });
                roles = this.checkForRepeat(roles);
            }

            db.query("UPDATE `servers` SET `defaultRole` = ? WHERE (`serverID` = ?)", [JSON.stringify(roles), message.guild.id], result => {
                let successMsg = ``;
                roles.forEach((rID, index) => {
                     if (index > 0) successMsg += `, `;
                     successMsg += `<@&${rID}>`;
                });
                const successEmbed = new Discord.RichEmbed()
                    .setDescription(op.direct(`role`, `default_roleSuccess`, [successMsg]))
                    .setColor(`#00ff7f`);
                sd.send(message, successEmbed);
            });
        });
    },
    remDefRoles(message, args) {
        if (args[3] == `all`) {
            db.query("UPDATE `servers` SET `defaultRole` = NULL WHERE (`serverID` = ?)", [message.guild.id], result => {
                const successEmbed = new Discord.RichEmbed()
                    .setDescription(op.direct(`role`, `default_roleRemoveAllSuccess`))
                    .setColor(`#00ff7f`);
                sd.send(message, successEmbed);
            })
        } else {
            let roles = this.searchForRoles(message, args);
            if (roles == null) return;
            db.query("SELECT `servers`.`defaultRole` FROM `servers` WHERE `servers`.`serverID` = ?", [message.guild.id], result => {
                if (result.length != 1) return;
                if (result[0].defaultRole == null) return;

                let newRoles = [];
                let delRoles = [];
                let dbRoles = JSON.parse(result[0].defaultRole);
                dbRoles.forEach((r0, r0i) => {
                    let roleFound = false;
                    roles.forEach((r1, r1i) => {
                        if (r0 == r1) roleFound = true;
                    });
                    if (!roleFound) newRoles.push(r0);
                    else delRoles.push(r0);
                });

                let newRolesMsg = ``;
                newRoles.forEach((rID, index) => {
                    if (index > 0) newRolesMsg += `, `;
                    newRolesMsg += `<@&${rID}>`;
                });

                let delRolesMsg = ``;
                delRoles.forEach((rID, index) => {
                    if (index > 0) delRolesMsg += `, `;
                    delRolesMsg += `<@&${rID}>`;
                });

                const successEmbed = new Discord.RichEmbed()
                    .setDescription(op.direct(`role`, `default_roleRemoveSuccess`, [delRolesMsg, newRolesMsg]))
                    .setColor(`#00ff7f`);
                sd.send(message, successEmbed);

                db.query("UPDATE `servers` SET `defaultRole` = ? WHERE (`serverID` = ?)", [JSON.stringify(newRoles), message.guild.id]);
            });
        }
    },
    searchForRoles(message, args) {
        if (args.length < 4) {
            const failEmbed = new Discord.RichEmbed()
                .setDescription(op.direct(`role`, `default_roleNotSpecified`))
                .setColor(`#ff0000`);
            sd.send(message, failEmbed);
        } else {
            let roleIDs = [];
            args.forEach((element, index) => {
                if (index < 3) return;

                let roleID = null;
                if (roleID = element.match(/^<@&(\d+)>$/)) {
                    roleIDs.push(roleID[1]);
                } else {
                    let roleName = args[index].slice(1);
                    let roleRegEx = new RegExp(roleName, `i`);
                    let rolePlace = message.content.search(roleRegEx);
                    let foundRoleName = message.content.slice(rolePlace, rolePlace + roleName.length);
                    let foundRole = null;
                    if (foundRole = message.guild.roles.find(r => r.name == foundRoleName)) roleIDs.push(foundRole.id);
                }
            });
            if (roleIDs.length != (args.length - 3)) {
                const failEmbed = new Discord.RichEmbed()
                    .setDescription(op.direct(`role`, `default_rolesNotFound`))
                    .setColor(`#ff0000`);
                sd.send(message, failEmbed);
            } else {
                let roles = this.checkForRepeat(roleIDs);
                if (roles.length > 10) {
                    const failEmbed = new Discord.RichEmbed()
                        .setDescription(op.direct(`role`, `default_toMannyRoles`))
                        .setColor(`#ff0000`);
                    sd.send(message, failEmbed);
                } else return roles;
            }
        }
        return null;
    },
    checkForRepeat(r) {
        let roles = [];
        r.forEach((r0, r0i) => {
            let repeat = false;
            roles.forEach((r1, r1i) => {
                if (r0i == r1i) return;
                else if (r0 == r1) repeat = true;
            })
            if (!repeat) roles.push(r0);
        });
        return roles;
    }
};
