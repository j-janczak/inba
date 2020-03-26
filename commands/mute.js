const {client, clientEmiter} = require(`../my_modules/discordClient.js`);
const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const timeFormat = require(`../my_modules/timeFormat.js`);
const botConfig = require(`../config/config.json`);
const {db} = require(`../my_modules/database.js`);
const Discord = require(`discord.js`);

const muteRoleName = `[Inba] Muted`;

class Mute extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args)
        
        if (!this.checkPermission()) return;
        const action = this.args[0].toLowerCase();
        if (action == `muteinit`) return this.createRole();
        if (this.args.length < 2) return this.help();

        if (this.args[1] == `help`) return this.help();

        let member = this.getMember(1);
        if (member) {
            if (action == `mute`) return this.mute(member);
            if (action == `unmute`) return this.unmute(member);
        } else this.sendEmbed(0, this.getString(`typical`, `error`, `memberNotFound`));
    }
    async mute(member) {
        const muteRole = this.msg.guild.roles.cache.find(r => r.name == muteRoleName);
        if (!muteRole) return this.sendEmbed(2, this.getString(`mute`, `assignRole`, `error`, [botConfig.prefix]));

        if (member.roles.cache.find(r => r.name == muteRoleName)) return this.sendEmbed(2, this.getString(`mute`, `assignRole`, `warning`, [`<@!${member.user.id}>`]));

        let executionTime;
        let timeStr;
        if (this.args.length < 3) {
            timeStr = `30m`;
            executionTime = timeFormat.argToTime(timeStr);
        } else {
            timeStr = this.args[2];
            executionTime = timeFormat.argToTime(timeStr);
            if (!executionTime) return this.sendEmbed(0, this.getString(`typical`, `error`, `timeFormat`, [botConfig.prefix]));
        }

        let dbData = JSON.stringify({mutedUser: member.user.id});

        let dbResult = await db.query("INSERT INTO `timeTasks` (id, serverFK, taskType, executionTime, data) VALUES (NULL, ?, 0, ?, ?)", [this.msg.guild.id, executionTime, dbData]);
        if (!dbResult.affectedRows) return this.sendEmbed(0, this.getString(`typical`, `error`, `dbError`));
        
        let assignSuccess = await member.roles.add(muteRole);
        if (!assignSuccess) return;

        this.sendSuccesMuteEmbed(`<@!${member.user.id}>`, timeStr, timeFormat.getDate(executionTime));
    }
    async unmute(member) {
        const dbResult = await db.query("DELETE FROM `timeTasks` WHERE JSON_EXTRACT(data, \"$.mutedUser\") = ? AND `serverFK` = ?", [member.user.id, this.msg.guild.id]);
        if (!dbResult) return this.sendEmbed(0, this.getString(`typical`, `error`, `dbError`));

        const muteRole = this.msg.guild.roles.cache.find(r => r.name == muteRoleName);
        if (!muteRole) return this.sendEmbed(2, this.getString(`mute`, `assignRole`, `error`, [botConfig.prefix]));

        if (!member.roles.cache.has(muteRole.id)) return this.sendEmbed(2, this.getString(`mute`, `unmute`, `warning`, [`<@!${member.user.id}>`]));

        member.roles.remove(muteRole).then(r => {
            this.sendEmbed(1, this.getString(`mute`, `unmute`, `success`, [`<@!${member.user.id}>`]));
        }).catch(console.error);
    }
    async createRole() {
        const muteRole = this.msg.guild.roles.cache.find(r => r.name == muteRoleName);
        if (muteRole) return this.sendEmbed(2, this.getString(`mute`, `createRole`, `warning`));

        muteRole = await this.msg.guild.roles.create({
            data: {
                name: muteRoleName,
                color: `#f4424b`,
                permissions: new Discord.Permissions(0)
            }
        });

        let successUpdatedChnnl = 0;
        await this.asyncForEach(this.msg.guild.channels.cache.array(), async (chnnl) => {
            await chnnl.overwritePermissions([{
                id: muteRole.id,
                deny: [`SEND_MESSAGES`]
            }]).then(ch => {
                successUpdatedChnnl++;
            }).catch(console.error);
        });
        
        this.sendEmbed(1, this.getString(`mute`, `createRole`, `success`, [successUpdatedChnnl, this.msg.guild.channels.cache.size]));
    }
    sendSuccesMuteEmbed(memberName, timeStr, timeEnd) {
        let muteEmbed = new Discord.MessageEmbed()
            .setDescription(`✅\xa0\xa0\xa0\xa0` + this.getString(`mute`, `assignRole`, `success`, `title`, [memberName, timeStr]))
            .setFooter(this.getString(`mute`, `assignRole`, `success`, `footer`, [timeEnd]))
            .setColor(`#00E676`);
        this.send(muteEmbed);
    }
    help() {
        let descMsg = `
            \`${botConfig.prefix} mute <@user> (time)\`
            \`${botConfig.prefix} unmute <@user>\`
            \`${botConfig.prefix} muteInit\` - Creates a mute rank and assigns it to each channel
        `;
        this.sendHelp(`Mute`, descMsg);
    }
}

clientEmiter.on(`takExecuteMute`, task => {
    const guild = client.guilds.cache.get(task.serverFK);
    if (!guild) return;

    const muteRole = guild.roles.cache.find(r => r.name == muteRoleName);
    if (!muteRole) return;

    const taskMemberID = JSON.parse(task.data).mutedUser;
    const member = guild.members.cache.get(taskMemberID);
    if (!member) return;

    member.roles.remove(muteRole);
});

client.on(`channelCreate`, chnnl => {
    if (chnnl.type != `text` && chnnl.type != `voice` && chnnl.type != `category`) return;

    const muteRole = chnnl.guild.roles.cache.find(r => r.name == muteRoleName);
    if (!muteRole) return;

    chnnl.overwritePermissions([{
        id: muteRole.id,
        deny: [`SEND_MESSAGES`]
    }]).catch(console.error);
})

module.exports = {
    name: `mute`,
    aliases: [`muteinit`, `unmute`],
    execute(msg, args) {new Mute(msg, args)}
}