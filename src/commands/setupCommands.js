const { log } = require('../utils.js');

class SetupCommands {
  constructor(msg, commandsList) {
    this.addCommands(msg, commandsList);
  }

  async addCommands(msg, commandsList) {
    const membersCommands = commandsList.filter(c => !c.admin);
    for (const [i, command] of membersCommands.entries()) {
      await msg.guild.commands.create(command.commandData);
      console.log(command.commandData);
      log(`Dodano ${i+1}/${membersCommands.length} komend`);
    }
  }
}

module.exports = {
  admin: true,
  commandData: {
    name: 'setupCommands',
  },
  execute: SetupCommands
};