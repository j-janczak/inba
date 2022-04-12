const Command = require('../command.js');

class Ping extends Command {
  constructor() {
    super('big');
  }

  async startCommand() {
    const option = this.opt.get('wybierz');
    if (option.type == 'USER') {
      this.intr.reply({ files: [option.user.avatarURL({ size: 4096 })] });
    } else this.bigEmoji(option);
  }

  async bigEmoji(option) {
    const emojiRegex = new RegExp('^<:.+:(\\d+)>$');
    if (emojiRegex.test(option.value)) {
      const emojiID = emojiRegex.exec(option.value)[1],
        emoji = await this.intr.guild.emojis.fetch(emojiID);
      this.intr.reply({ files: [emoji.url] });
    } else {
      const kotemoji = await this.getEmoji('kot');
      this.intr.reply({ content: 'To nie jest poprawna emotka cwaniaku ' + kotemoji, ephemeral: true });
    }
  }
}

const ping = new Ping();

module.exports = {
  admin: false,
  commandData: {
    name: 'big',
    description: 'BIG',
    options: [
      {
        name: 'profilowe',
        description: 'Powiększ zdjęcie profilowe użytkownika',
        type: 1,
        options: [
          {
            name: 'wybierz',
            description: 'Wybierz użytkownika',
            type: 6,
            required: true
          }
        ]
      },
      {
        name: 'emoji',
        description: 'Powiększ emoji',
        type: 1,
        options: [
          {
            name: 'wybierz',
            description: 'Wstaw jedno emoji SERWEROWE',
            type: 3,
            required: true
          }
        ]
      }
    ]
  },
  execute: ping.execute.bind(ping)
};