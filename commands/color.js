const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const colorfulRoles = require(`../config/colorfulRoles.json`);
const botConfig = require(`../config/config.json`);

class Color extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args);

        if (this.args.length < 2) return this.help();

        this.action = this.args[1].toLowerCase();
        if (this.action == `init`) this.roleManagement(`init`);
        else if (this.action == `cleanup`) this.roleManagement(`cleanup`);
        else if (this.action == `remove`) this.remove();
        else if (this.action == `list`) this.list();
        else if (this.action == `help`) this.help();
        else this.setColor();
    }
    async roleManagement(type) {
        if (!this.checkPermission()) return;
        this.msg.react(`⏳`);
        let roleManagementError = false;
        let processedRoles = 0;
        for (const color in colorfulRoles.colors) {
            if (roleManagementError) break;
            let colorName = `${colorfulRoles.prefix}${color}`;
            if (type == `init`) {
                if (!this.msg.guild.roles.cache.find(r => r.name == colorName)) {
                    await this.msg.guild.roles.create({
                        data: {
                            name: colorName,
                            color: colorfulRoles.colors[color]
                        },
                        reason: `Created automatically by Mr. Inba`
                    }).catch(e => {roleManagementError = true});
                    processedRoles++;
                }
            } else if (type == `cleanup`) {
                let roleToDelete = this.msg.guild.roles.cache.find(r => r.name == colorName);
                if (roleToDelete) {
                    await roleToDelete.delete(`Deleted automatically by Mr. Inba`).catch(e => {roleManagementError = true});
                    processedRoles++;
                }
            }
        }
        if (!roleManagementError) {
            if (processedRoles) this.sendEmbed(1, this.getString(`color`, type, `success`, [processedRoles]));
            else this.sendEmbed(2, this.getString(`color`, type, `warning`));
        }
        else this.sendEmbed(0, this.getString(`color`, type, `error`));
        this.msg.reactions.removeAll();
    }
    setColor() {
        let colorFound;
        for (const color in colorfulRoles.colors) if (color.toLowerCase() == this.args[1].toLowerCase()) colorFound = color;
        if (!colorFound) 
            return this.sendEmbed(0, this.getString(`color`, `set`, `error`, `notFound`, [this.args[1].replace(/\`/g, ``), botConfig.prefix]));

        if (this.msg.member.roles.cache.find(r => r.name == `${colorfulRoles.prefix}${colorFound}`)) 
            return this.sendEmbed(2, this.getString(`color`, `set`, `warning`, `alreadyOwns`, [colorFound]));

        let roleToAssign = this.msg.guild.roles.cache.find(r => r.name == `${colorfulRoles.prefix}${colorFound}`);
        if (!roleToAssign)
            return this.sendEmbed(0, this.getString(`color`, `set`, `error`, `notRoleFound`, [botConfig.prefix]));

        let isOldDeleted = true;
        this.msg.member.roles.cache.find((r) => {
            if (r.name.startsWith(colorfulRoles.prefix)) {
                this.msg.member.roles.remove(r).catch(e => {
                    this.sendEmbed(0, this.getString(`color`, `set`, `error`, `notAssigned`));
                    isOldDeleted = false;
                });
            }
        })

        if (!isOldDeleted) return;

        this.msg.member.roles.add(roleToAssign).then(member => {
            this.sendEmbed(1, this.getString(`color`, `set`, `success`, [colorFound]));
        }).catch(e => {
            this.sendEmbed(0, this.getString(`color`, `set`, `error`, `notAssigned`));
        });
    }
    remove() {
        if (!this.msg.member.roles.cache.find(r => r.name.startsWith(colorfulRoles.prefix))) return this.sendEmbed(2, this.getString(`color`, `remove`, `warning`));

        let isOldDeleted = true;
        this.msg.member.roles.cache.find((r) => {
            if (r.name.startsWith(colorfulRoles.prefix)) {
                this.msg.member.roles.remove(r).catch(e => {
                    this.sendEmbed(0, this.getString(`color`, `set`, `error`, `notAssigned`));
                    isOldDeleted = false;
                });
            }
        })
        if (isOldDeleted) this.sendEmbed(1, this.getString(`color`, `remove`, `success`));
    }
    list() {
        this.msg.channel.send(``, {files: [`./resources/color_list.png`]});
    }
    help() {
        let descMsg = `
            \`${botConfig.prefix} ${this.args[0]} <color>\` - Sets the color of your nick to the given one
            \`${botConfig.prefix} ${this.args[0]} list\` - Sends a color list
            \`${botConfig.prefix} ${this.args[0]} remove\` - Removes color from your nick
            \`${botConfig.prefix} ${this.args[0]} init\` - Creates colorful roles
            \`${botConfig.prefix} ${this.args[0]} cleanup\` - Removes colorful ranks
            \`${botConfig.prefix} ${this.args[0]} help\` - You're here
        `;
        this.sendHelp(`Colorful nicks`, descMsg)
    }
}

module.exports = {
    name: `color`,
    aliases: [`c`],
    execute(msg, args) {new Color(msg, args)}
}