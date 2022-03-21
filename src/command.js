class Command {
  constructor (interaction, client) {
    this.intr = interaction;
    this.member = interaction.member;
    this.client = client;
  }
}

module.exports = Command;