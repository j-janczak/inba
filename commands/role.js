const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const timeFormat = require(`../my_modules/timeFormat.js`);
const botConfig = require(`../config/config.json`);
const Discord = require(`discord.js`);

class Role extends CommandTemplate{
    constructor(msg, args) {
        super(msg, args);
        this.member;
        this.role;

        if (args.length < 2) this.help();

        this.action = this.args[1].toLowerCase();
        if (this.action == `add`) this.parseRole(`add`);
        else if (this.action == `remove`) this.parseRole(`remove`);
        else if (this.action == `info`) this.parseRole(`info`);
        else if (this.action == `list`) this.list();
        else if (this.action == `help`) this.help();
        else this.sendEmbed(0, this.getString(`typical`, `unknownCommand`, [`role`]));
    }
    parseRole(type) {
        this.role = (type == `info` ? this.getRole(2) : this.getRole(3));
        if (!this.role) {
            let roleName = (type == `info` ? this.args[2] : this.args[3]).replace(/`/g, ``);
            this.sendEmbed(0, this.getString(`typical`, `error`, `noRoleFound`, [roleName]));
            return;
        }
        if (type == `add` || type == `remove`) this.parseMember(type);
        else if (type == `info`) this.info();
    }
    parseMember(type) {
        this.member = this.getMember(2);
        if (!this.member)
            return this.sendEmbed(0, this.getString(`typical`, `error`, `memberNotFound`));

        if (type == `add`) this.add();
        else if (type == `remove`) this.remove();
    }
    add() {
        if (!this.checkPermission()) return;
        if (this.member.roles.cache.find(r => r.id == this.role.id))
            return this.sendEmbed(2, this.getString(`role`, `add`, `error`, `alreadyOwns`, [`<@!${this.member.id}>`, `<@&${this.role.id}>`]));

        this.member.roles.add(this.role).then(m => {
            this.sendEmbed(1, this.getString(`role`, `add`, `success`, [`<@&${this.role.id}>`, `<@!${this.member.user.id}>`]));
        }).catch(e => {
            console.error(e);
            if (e.code == 50013) {
                this.sendEmbed(0, this.getString(`role`, `add`, `error`, `missingPerm`));
            }
            else this.sendEmbed(0, this.getString(`role`, `add`, `error`, `other`));
        })
    }
    remove() {
        if (!this.checkPermission()) return;
        if (!this.member.roles.cache.find(r => r.id == this.role.id))
            return this.sendEmbed(2, this.getString(`role`, `remove`, `error`, `alreadyOwns`, [`<@!${this.member.id}>`, `<@&${this.role.id}>`]));

        this.member.roles.remove(this.role).then(m => {
            this.sendEmbed(1, this.getString(`role`, `remove`, `success`, [`<@&${this.role.id}>`, `<@!${this.member.user.id}>`]));
        }).catch(e => {
            console.error(e);
            if (e.code == 50013) {
                this.sendEmbed(0, this.getString(`role`, `remove`, `error`, `missingPerm`));
            }
            else this.sendEmbed(0, this.getString(`role`, `remove`, `error`, `other`));
        })
    }
    info() {
        const perms = new Discord.Permissions(this.role.permissions);
        let permsString = (this.role.permissions == 0 ? `None` : ``);
        perms.toArray().forEach(p => {
            p = p.split(`_`).join(` `);
            p = p.slice(0, 1) + p.slice(1).toLowerCase();
            permsString += `• ${p}\n`
        });

        let roleEmbed = new Discord.MessageEmbed()
            .setTitle(`@` + this.role.name)
            .setAuthor(this.getString(`role`, `info`, `desc`))
            .addField(this.getString(`role`, `info`, `members`), this.role.members.size, true)
            .addField(this.getString(`role`, `info`, `position`), `${Math.abs(this.role.position - this.msg.guild.roles.cache.size)}`, true)
            .addField(this.getString(`role`, `info`, `mention`), `${this.role.mentionable}`.slice(0, 1).toUpperCase() + `${this.role.mentionable}`.slice(1).toLowerCase(), true)
            .addField(this.getString(`role`, `info`, `create`), timeFormat.getDate(this.role.createdTimestamp), false)
            .addField(this.getString(`role`, `info`, `perm`), permsString, false)
            .setColor(this.role.hexColor)
            .setFooter(this.getString(`typical`, `embed`, `footer`, [this.msg.member.displayName]));
        this.send(roleEmbed);
    }
    list() {
        let rolesStr = this.getString(`role`, `list`, `desc`, [this.msg.guild.name]) + `\n\n`;
        for(let i = this.msg.guild.roles.cache.size - 1; i >= 0; i--)
            rolesStr += `*\`${Math.abs(i - this.msg.guild.roles.cache.size)}\`*. ${this.msg.guild.roles.cache.find(r => r.position == i).name}\n`;
        
        const rolesEmbed = new Discord.MessageEmbed()
            .setTitle(this.getString(`role`, `list`, `title`))
            .setDescription(rolesStr)
            .setColor(botConfig.botColor)
            .setFooter(this.getString(`typical`, `embed`, `footer`, [`${this.msg.member.displayName}`]));
        this.send(rolesEmbed);
    }
    help() {
        let descMsg = `
            \`${botConfig.prefix} ${this.args[0]} add <@user> <@role>\` - Assigns a role to user
            \`${botConfig.prefix} ${this.args[0]} remove <@user> <@role>\` - Removes the role
            \`${botConfig.prefix} ${this.args[0]} info <@role>\` - Shows info about the role
            \`${botConfig.prefix} ${this.args[0]} list\` - Shows all roles
            \`${botConfig.prefix} ${this.args[0]} help\` - You're here
        `;
        this.sendHelp(`Role`, descMsg);
    }
}

module.exports = {
    name: `role`,
    aliases: [`r`],
    execute(msg, args) {new Role(msg, args)}
}