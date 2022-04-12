const botConfig = require('../config.json'),
  Command = require('../command.js'),
  axios = require('../axios.js'),
  { log } = require('../utils');

class Logs extends Command {
  constructor() {
    super('logs');
  }

  async startCommand() {
    if (this.intr.options.getSubcommand() == 'ranking') this.ranking();
  }

  async ranking() {
    try {
      const serverRanking = await axios.get(`logs/${this.intr.guild.id}`);
      let embedDescription = '';
      serverRanking.forEach((user, index) => {
        embedDescription += `${index + 1}. <@${user.userID}> — ${user.msgCount} ✉️\n`;
      });

      const rankingEmbed = {
        color: botConfig.color,
        title: `🏆 Top of the Top ${this.intr.guild.name}`,
        thumbnail: {
          url: this.intr.guild.iconURL()
        },
        description: embedDescription
      };
      this.intr.reply({embeds: [rankingEmbed]});
    } catch (error) {
      this.sendEmbed(0, 'Wystąpił błąd podczas łączenia z api');
    }
  }
}

async function logMsg(msg) {
  try {
    const logResponse = await axios.post('logs', {
      serverID: msg.guildId,
      channelID: msg.channelId,
      userID: msg.author.id,
      bot: msg.author.bot,
      content: msg.cleanContent,
      attachment: JSON.stringify(msg.attachments),
      date: msg.createdTimestamp
    });

    if (logResponse.serverMilestone != 0) {
      msg.reply(`Jasny gwint, to jest ${logResponse.serverMilestone} wiadomośc na tym serwerze!`);
    }

  } catch (e) {
    log('ERROR! '.red + 'Wystąpił błąd podczas logowania wiadomości'.brightRed);
    console.error(e);
  }
}

const logs = new Logs();

module.exports = {
  admin: false,
  commandData: {
    name: 'log',
    description: 'Statystyki wysłanych wiadomości',
    options: [
      {
        name: 'ranking',
        description: 'Ranking wysłanych wiadomości',
        type: 1
      }
    ]
  },
  execute: logs.execute.bind(logs),
  logMsg
};