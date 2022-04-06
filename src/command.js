class Command {
  constructor (interaction, client) {
    this.intr = interaction;
    this.member = interaction.member;
    this.opt = interaction.options;
    this.guild = interaction.guild;
    this.client = client;

    this.goodEmoji = ['gigachad', 'jestwpyte', 'lul', 'lorneta', 'catjam'];
    this.badEmoji = ['despair', 'kotcry', 'kot', 'kotobiad', 'kris'];
  }

  async getEmoji (emojiName) {
    const emojis = await this.intr.guild.emojis.fetch(),
      emoji = emojis.find(e => e.name == emojiName);
    if (emoji) return `<:${emoji.name}:${emoji.id}>`;
    else return `:${emojiName}:`;
  }

  getEmbed(type, msg) {
    const embed = {};
    if (type == 0) {
      embed.color = '#B71C1C';
      embed.description = `⛔\xa0\xa0\xa0\xa0${msg}`;
    }
    else if (type == 1) {
      embed.color = '#388E3C';
      embed.description = `✅\xa0\xa0\xa0\xa0${msg}`;
    }
    return embed;
  }

  sendEmbed(type, msg) {
    if (type == 0) console.error(msg);
    this.intr.reply({embeds: [this.getEmbed(type, msg)]});
  }

  randomArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

module.exports = Command;