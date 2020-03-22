const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const colorfulRoles = require(`../config/colorfulRoles.json`);
const botConfig = require(`../config/config.json`);
const Discord = require(`discord.js`);

class Color extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args);

        if (this.args.length < 2) {
            this.sendHelp();
            return;
        }

        if (this.args[1].toLowerCase() == `init`) this.roleManagement(`init`);
        else if (this.args[1].toLowerCase() == `cleanup`) this.roleManagement(`cleanup`);
        else if (this.args[1].toLowerCase() == `remove`) this.remove();
        else if (this.args[1].toLowerCase() == `list`) this.list();
        else if (this.args[1].toLowerCase() == `help`) this.sendHelp();
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
        if (!colorFound) {
            this.sendEmbed(0, this.getString(`color`, `set`, `error`, `notFound`, [this.args[1].replace(/\`/g, ``), botConfig.prefix]));
            return;
        }

        if (this.msg.member.roles.cache.find(r => r.name == `${colorfulRoles.prefix}${colorFound}`)) {
            this.sendEmbed(2, this.getString(`color`, `set`, `warning`, `alreadyOwns`, [colorFound]));
            return;
        }

        let roleToAssign = this.msg.guild.roles.cache.find(r => r.name == `${colorfulRoles.prefix}${colorFound}`);
        if (!roleToAssign) {
            this.sendEmbed(0, this.getString(`color`, `set`, `error`, `notRoleFound`, [botConfig.prefix]));
            return
        }

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
        if (!this.msg.member.roles.cache.find(r => r.name.startsWith(colorfulRoles.prefix))) {
            this.sendEmbed(2, this.getString(`color`, `remove`, `warning`));
            return;
        }

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
    sendHelp() {
        let descMsg = `
            \`${botConfig.prefix} ${this.args[0]} <color>\` - Sets the color of your nick to the given one
            \`${botConfig.prefix} ${this.args[0]} list\` - Sends a color list
            \`${botConfig.prefix} ${this.args[0]} remove\` - Removes color from your nick
            \`${botConfig.prefix} ${this.args[0]} init\` - Creates colorful roles
            \`${botConfig.prefix} ${this.args[0]} cleanup\` - Removes colorful ranks
            \`${botConfig.prefix} ${this.args[0]} help\` - You're here
        `;
        let embed = new Discord.MessageEmbed()
            .setAuthor(`Mr. Inba Manual`)
            .setTitle(`Colorful nicks`)
            .setDescription(descMsg)
            .setColor(botConfig.botColor);
        this.send(embed);
    }
}

module.exports = {
    name: `color`,
    aliases: [`c`],
    execute(msg, args) {new Color(msg, args)}
}