const {client, clientEmiter} = require(`../my_modules/discordClient.js`);
const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const botConfig = require(`../config/config.json`);
const db = require(`../my_modules/database.js`);

class DefaultRole extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args);
        this.role;

        if (this.args.length < 2) {
            this.help();
            return;
        }

        this.action = this.args[1].toLowerCase();
        if (this.action == `add`) this.parseRole(0);
        else if (this.action == `remove`) this.parseRole(1);
        else if (this.action == `list`) this.list();
        else if (this.action == `help`) this.help();
        else this.sendEmbed(0, this.getString(`typical`, `unknownCommand`, [`defaultRole`]));
    }
    parseRole(type) {
        if (!this.checkPermission()) return;

        if (this.args.length < 3) {
            this.help();
            return;
        }

        this.role = this.getRole(2);
        if (!this.role) {
            this.sendEmbed(0, this.getString(`typical`, `error`, `noRoleFound`, [this.args[2]]));
            return;
        }
        if (type == 0) this.add();
        else if (type == 1) this.remove();
    }
    async add() {
        let checkForDuplicate = await db.query("SELECT (SELECT COUNT(*) FROM `defaultRoles` WHERE `serverFK` = ? AND defaultRoleFK = ?) as exist, (SELECT COUNT(*) FROM `defaultRoles` WHERE `serverFK` = ?) as server", [this.msg.guild.id, this.role.id, this.msg.guild.id]);
        if (checkForDuplicate[0].exist) {
            this.sendEmbed(2, this.getString(`defaultRoles`, `add`, `error`, `roleDuplicate`, [`<@&${this.role.id}>`]));
            return;
        }
        if (checkForDuplicate[0].server > 9) {
            this.sendEmbed(0, this.getString(`defaultRoles`, `add`, `error`, `tooMany`));
            return;
        }

        let result = await db.query("INSERT INTO `defaultRoles` (defaultRoleID, serverFK, defaultRoleFK) VALUES (NULL, ?, ?)", [this.msg.guild.id, this.role.id]);
        if (result.affectedRows == 1) this.sendEmbed(1, this.getString(`defaultRoles`, `add`, `success`, [`<@&${this.role.id}>`]));
        else this.sendEmbed(0, this.getString(`typical`, `error`, `dbError`));
    }
    async remove() {
        let checkForDuplicate = await db.query("SELECT COUNT(*) as exist FROM `defaultRoles` WHERE `serverFK` = ? AND `defaultRoleFK` = ?", [this.msg.guild.id, this.role.id]);
        if (!checkForDuplicate[0].exist) {
            this.sendEmbed(2, this.getString(`defaultRoles`, `remove`, `error`, [`<@&${this.role.id}>`]));
            return;
        }

        let result = await db.query("DELETE FROM `defaultRoles` WHERE `serverFK` = ? AND `defaultRoleFK` = ?", [this.msg.guild.id, this.role.id]);
        console.log(result);
        if (result.affectedRows > 0) this.sendEmbed(1, this.getString(`defaultRoles`, `remove`, `success`, [`<@&${this.role.id}>`]));
        else this.sendEmbed(0, this.getString(`typical`, `error`, `dbError`));
    }
    async list() {
        let result = await db.query("SELECT defaultRoleFK as roleID FROM `defaultRoles` WHERE `serverFK` = ?", [this.msg.guild.id]);
        if (!result) {
            this.sendEmbed(0, this.getString(`typical`, `error`, `dbError`));
            return;
        }

        let defRolesStr = ``;
        result.forEach(r => {
            defRolesStr += `• <@&${r.roleID}>\n`;
        })
        this.sendEmbed(1, this.getString(`defaultRoles`, `list`, `success`, [defRolesStr]));
    }
    help() {
        let descMsg = `
            \`${botConfig.prefix} ${this.args[0]} add <@role>\` - Adds roles to the default roles
            \`${botConfig.prefix} ${this.args[0]} remove <@role>\` - Removes a role
            \`${botConfig.prefix} ${this.args[0]} list\` - Shows a list of default roles
            \`${botConfig.prefix} ${this.args[0]} help\` - You're here
        `;
        this.sendHelp(`Default Role`, descMsg);
    }
}

async function assingRole(member) {
    let result = await db.query("SELECT defaultRoleFK as roleID FROM `defaultRoles` WHERE `serverFK` = ?", [member.guild.id]);
    if (!result) return;

    result.forEach(rDB => {
        let role = member.guild.roles.cache.find(r => r.id == rDB.roleID);
        if (role) member.roles.add(role).catch(console.error);
    })
}

clientEmiter.on(`memberJoined`, async (member) => {assingRole(member)});

module.exports = {
    name: `defaultrole`,
    aliases: [`dr`],
    execute(msg, args) {new DefaultRole(msg, args)}
}