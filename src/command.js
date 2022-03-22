class Command {
  constructor (interaction, client) {
    this.intr = interaction;
    this.member = interaction.member;
    this.client = client;
  }

  async getEmoji (emojiName) {
    const emojis = await this.intr.guild.emojis.fetch(),
      emoji = emojis.find(e => e.name == emojiName);
    if (emoji) return `<:${emoji.name}:${emoji.id}>`;
    else return `:${emojiName}:`;
  }
}

module.exports = Command;