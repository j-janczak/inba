const botConfig = require('../config.json'),
  Command = require('../command.js');

class Ping extends Command {
  constructor() {
    super('ping');
  }

  async startCommand() {
    const pingEmbed = {
      color: botConfig.color,
      title: '🏓 Pong!',
      description: 'Kalkulowanie... ⌛'
    };

    await this.intr.reply({embeds: [pingEmbed]});
    const replyMsg = await this.intr.fetchReply();
    pingEmbed.description = `🕑 ${Date.now() - replyMsg.createdTimestamp}ms`;
    this.intr.editReply({embeds: [pingEmbed]});
  }
}

const ping = new Ping();

module.exports = {
  admin: false,
  commandData: {
    name: 'ping',
    description: 'Sprawdź czy bot żyje. Chociaż, co to za życie...',
  },
  execute: ping.execute.bind(ping)
};