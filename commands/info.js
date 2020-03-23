const {client, clientEmiter} = require(`../my_modules/discordClient.js`);
const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const timeFormat = require(`../my_modules/timeFormat.js`);
const botConfig = require(`../config/config.json`);
const Discord = require(`discord.js`);
const roleCmd = require(`./role.js`);

class Info extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args);

        if (this.args.length < 2) {
            this.help();
            return;
        }

        this.action = this.args[1].toLowerCase();
        if (this.action == `server`) this.server();
        else if (this.action == `inba`) this.inba();
        else if (this.action == `help`) this.help();
        else {
            let member = this.getMember(1);
            let role = this.getRole(1);
            if (member) this.member(member);
            else if (role) this.role();
            else this.sendEmbed(0, this.getString(`typical`, `unknownCommand`, [`info`]));
        }
    }
    server() {
        let s = this.msg.guild;
        let txtChnn = 0;
        let voChnn = 0;
        let catChnn = 0;
        s.channels.cache.find(chnn => {
            if (chnn.type == `text`) txtChnn++;
            if (chnn.type == `voice`) voChnn++;
            if (chnn.type == `category`) catChnn++;
        })
        let serverEmbed = new Discord.MessageEmbed()
            .setAuthor(`Server info`)
            .setTitle(s.name)
            .setThumbnail(s.iconURL({format: `png`, size: 2048, dynamic: true}))
            .addFields(
                {name: `Owner`, value: `<@!${s.ownerID}>`, inline: true},
                {name: `Region`, value: s.region, inline: true},
                {name: `Creation date`, value: timeFormat.getDate(s.createdTimestamp), inline: true},
                {name: `Members`, value: s.memberCount, inline: true},
                {name: `Roles`, value: s.roles.cache.size, inline: true},
                {name: `Custom emojis`, value: s.emojis.cache.size, inline: true},
                {name: `Categories`, value: catChnn, inline: true},
                {name: `Channels`, value: txtChnn, inline: true},
                {name: `Voice Channels`, value: voChnn, inline: true},
            )
            .setColor(botConfig.botColor)
            .setFooter(this.getString(`typical`, `embed`, `footer`, [this.msg.member.displayName]));
        this.send(serverEmbed);
    }
    inba() {
        let inbaEmbed = new Discord.MessageEmbed()
            .setTitle(`Impossibly Nice Bot Ai`)
            .setDescription(`aka Mr. Inba. Some information about me:`)
            .setThumbnail(client.user.avatarURL({format: `png`, size: 2048, dynamic: true}))
            //.setThumbnail(this.msg.guild.iconURL({format: `png`, size: 2048, dynamic: true}))
            .addFields(
                {name: `Creator`, value: `Kuba Janczak 🇵🇱\n\`Kuba#7487\``, inline: false},
                {name: `Version`, value: `1.0`, inline: true},
                {name: `Wirtten in`, value: `JS with Discord.js`, inline: true},
                {name: `Homeland`, value: `DosMasters ❤`, inline: false},
                {name: `GitHub`, value: `[Link](https://github.com/TheFlashes/Inba, 'https://github.com/TheFlashes/Inba')`, inline: true},
            )
            .setColor(botConfig.botColor)
            .setFooter(`To view information about commands, type !mi help`);
        this.send(inbaEmbed);
    }
    member(m) {
        let nick = (m.nickname ? m.nickname : `None`);
        let roles = ``;
        m._roles.forEach(rid => {
            roles += `• ` + m.guild.roles.cache.find(r => r.id == rid).name + `\n`;
        })

        let userEmbed = new Discord.MessageEmbed()
            .setAuthor(`Member info`)
            .setTitle(`@` + m.displayName)
            .setThumbnail(m.user.avatarURL({format: `png`, size: 2048, dynamic: true}))
            .addFields(
                {name: `Names`, value: `Main: *\`${m.user.username}\`*\nNick: *\`${nick}\`*\nTag: *\`${m.user.tag}\`*`, inline: true},
                {name: `Joined`, value: timeFormat.getDate(m.joinedTimestamp), inline: true},
                {name: `Bot`, value: m.user.bot, inline: true},
                {name: `Roles`, value: roles, inline: false},
            )
            .setColor(m.displayHexColor)
            .setFooter(this.getString(`typical`, `embed`, `footer`, [this.msg.member.displayName]));
        this.send(userEmbed);
    }
    role() {
        roleCmd.execute(this.msg, [`role`, `info`, this.args[1]]);
    }
    help() {
        let descMsg = `
            \`${botConfig.prefix} ${this.args[0]} <@user>\` - User information
            \`${botConfig.prefix} ${this.args[0]} <@role>\` - Role information
            \`${botConfig.prefix} ${this.args[0]} server\` - Server information
            \`${botConfig.prefix} ${this.args[0]} inba\` - Mr. Inba info
            \`${botConfig.prefix} ${this.args[0]} help\` - You're here
        `;
        this.sendHelp(`Info`, descMsg);
    }
}

module.exports = {
    name: `info`,
    aliases: [`i`],
    execute(msg, args) {new Info(msg, args)}
}