require('colors');
const { Client, Intents } = require('discord.js');
const botConfig = require('./src/config.json');
const log = require('./src/log.js');
const path = require('path');
const fs = require('fs');

class MrInba {
  constructor () {
    this.commands = [];
    this.includeCommands();

    const F = Intents.FLAGS;
    this.client = new Client({ intents: [F.GUILDS, F.GUILD_MESSAGES] });

    this.client.once('ready', this.onReady.bind(this));
    this.client.on('messageCreate', this.onMessageCreate.bind(this));
    this.client.on('interactionCreate', this.interactionCreate.bind(this));

    this.client.login(botConfig.token);
  }

  includeCommands() {
    const files = fs.readdirSync(botConfig.commandsPath);
    files.forEach(file => {
      if (path.extname(file) == '.js') 
        this.commands.push(require(botConfig.commandsPath + file));
    });
  }

  onReady() {
    log('Inba ' + 'powstała'.green);
  }

  onMessageCreate(msg) {
    if (msg.author.id != botConfig.owner) return;

    let adminCommand = null;
    if (msg.content.startsWith('!mi deleteCommands')) {
      adminCommand = this.commands.find(c => c.commandData.name == 'deleteCommand');
      if (adminCommand) new adminCommand.execute(msg, this.client);
    }
    if (msg.content.startsWith('!mi setupCommands')) {
      adminCommand = this.commands.find(c => c.commandData.name == 'setupCommands');
      if (adminCommand) new adminCommand.execute(msg, this.commands);
    }
  }

  interactionCreate(interaction) {
    const command = this.commands.find(c => c.commandData.name == interaction.commandName);
    if (command) new command.execute(interaction, this.client);
  }
}

new MrInba();