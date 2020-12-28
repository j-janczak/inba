const CommandTemplate = require(`./_Command.js`);
const botConfig = require(`../cfg/config.json`);
const Discord = require(`discord.js`);

class Ping extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args);
        this.sendPingEmbed();
    }
    sendPingEmbed() {
        let pingEmbed = new Discord.MessageEmbed()
            .setTitle(`⌛ Pong!`)
            .addField(`API`, `${Math.round(this.msg.client.ping)}ms`, false)
            .addField(`Pong`, `Loading...`, false)
            .setColor(botConfig.botColor)
            .setFooter(this.getString(`typical`, `embed`, `footer`, [this.msg.member.displayName]));
        this.send(pingEmbed, m => this.calculateResponse(m));
    }
    calculateResponse(m) {
        let responseLatency = m.createdTimestamp - this.msg.createdTimestamp;

        const updatedEmbed = new Discord.MessageEmbed(m.embeds[0])
            .spliceFields(1, 1, {name: `Pong`, value: `${responseLatency}ms`});
        m.edit(updatedEmbed);
    }
}

module.exports = {
    name: `ping`,
    execute(msg, args) {new Ping(msg, args)}
}