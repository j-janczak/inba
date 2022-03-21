const Command = require('../command.js');

class Ping extends Command {
  constructor(interaction, client) {
    super(interaction, client);

    const option = this.intr.options.get('wybierz');
    if (option.type == 'USER') {
      this.intr.reply({ files: [option.user.avatarURL({ size: 4096 })] });
    } else this.bigEmoji(option);
  }

  async bigEmoji(option) {
    const emojiID = (new RegExp('<:.+:(\\d+)>')).exec(option.value)[1],
      emoji = await this.intr.guild.emojis.fetch(emojiID);
    
    this.intr.reply({ files: [emoji.url] });
  }
}

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
            type: 6
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
            type: 3
          }
        ]
      }
    ]
  },
  execute: Ping
};