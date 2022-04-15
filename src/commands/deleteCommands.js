const { log } = require('../utils.js');
class DeleteCommand {
  constructor(msg, client) {
    this.fetchCommands(msg, client);
  }

  async fetchCommands(msg, client) {
    const clientCommands = await client.application.commands.fetch(),
      clientArrCommands = Array.from(clientCommands.values());

    for (const [i, command] of clientArrCommands.entries()) {
      try {
        await client.application.commands.delete(command.id);
        log(`Usunięto ${i+1}/${clientArrCommands.length} komend ` + 'globalnych'.yellow);
      } catch (e) {
        console.error(e);
      }
    }

    const guildCommands = await msg.guild.commands.fetch(),
      guildArrCommands = Array.from(guildCommands.values());

    for (const [i, command] of guildArrCommands.entries()) {
      try {
        await msg.guild.commands.delete(command.id);
        log(`Usunięto ${i+1}/${guildArrCommands.length} komend ` + 'serwerowych'.yellow);
      } catch (e) {
        console.error(e);
      }
    }
  }
}

module.exports = {
  admin: true,
  commandData: {
    name: 'deleteCommand',
  },
  execute: DeleteCommand
};