const CommandTemplate = require(`./_Command.js`);
const botConfig = require(`../cfg/config.json`);
const Discord = require(`discord.js`);

class Mute extends CommandTemplate {
    static muteRoleName = `[Inba] Muted`

    constructor(msg, args, client) {
        super(msg, args, client);

        if (!this.checkPermission) return;
        if (this.args.length < 1) return;

        if (this.args[1] == `init`) this.initializeMute();
        else {
            const userToMute = this.getMember(1);
            if (userToMute) {
                if (this.args[0] == `mute`) this.mute(userToMute);
                if (this.args[0] == `unmute`) this.unmute(userToMute);
            }
        }
    }
    async mute(userToMute) {
        const muteRole = this.msg.guild.roles.cache.find(r => r.name == Mute.muteRoleName);
        if (!muteRole) {
            this.sendEmbed(0, this.getString('mute', 'assignRole', 'error', [Mute.muteRoleName, botConfig.prefix, this.args[0]]))
            return;
        }

        try {
            await userToMute.roles.add(muteRole);
            this.sendEmbed(1, this.getString('mute', 'assignRole', 'success', [userToMute.displayName]))
        }
        catch(e) {
            console.error(e)
        }
    }
    async unmute(userToMute) {
        const muteRole = this.msg.guild.roles.cache.find(r => r.name == Mute.muteRoleName);
        if (!muteRole) {
            this.sendEmbed(0, this.getString('mute', 'assignRole', 'error', [Mute.muteRoleName, botConfig.prefix, this.args[0]]))
            return;
        }

        try {
            await userToMute.roles.remove(muteRole);
            this.sendEmbed(1, this.getString('mute', 'unmute', 'success', [userToMute.displayName]))
        }
        catch(e) {
            console.error(e)
        }
    }
    async initializeMute() {
        await this.msg.guild.roles.fetch();

        if (!this.msg.guild.roles.cache.find(r => r.name == Mute.muteRoleName)) {
            try {
                const role = await this.msg.guild.roles.create({
                    data: {
                        name: Mute.muteRoleName,
                        color: 'BLACK',
                    },
                });
                
                let channelsUpdated = 0;
                const totalChannels = this.msg.guild.channels.cache.array().length
                this.msg.guild.channels.cache.forEach(channel => {
                    channel.createOverwrite(role, {
                        SEND_MESSAGES: false
                    });
                    channelsUpdated++;
                });
                this.sendEmbed(1, this.getString('mute', 'createRole', 'success', [Mute.muteRoleName, channelsUpdated, totalChannels]));
            } catch (e) {console.error(e)}
        } else {
            this.sendEmbed(2, this.getString('mute', 'createRole', 'warning', [Mute.muteRoleName]));
        }
    }
    static async newChannel(channel) {
        await channel.guild.roles.fetch();

        const muteRole = channel.guild.roles.cache.find(r => r.name == Mute.muteRoleName);
        if (!muteRole) return;
        
        channel.createOverwrite(muteRole, {
            SEND_MESSAGES: false
        });
    }
}

module.exports = {
    name: `mute`,
    aliases: [`unmute`],
    execute(msg, args, client) {new Mute(msg, args, client)},
    newChannel(channel) {Mute.newChannel(channel)}
}