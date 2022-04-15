const { Client, Intents } = require('discord.js'),
  botConfig = require('./src/config.json'),
  { log } = require('./src/utils.js'),
  axios = require('./src/axios.js'),
  path = require('path'),
  fs = require('fs');
require('colors');

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

    //this.commands.find(c => c.commandData.name == 'scifun').loadGif();
    //this.commands.find(c => c.commandData.name == 'enjoyer').loadGif();
  }

  async onReady() {
    log('Inba ' + 'powstała'.green);
    log('Testowanie połączenia z api ' + botConfig.apiURL.cyan);
    try {
      await axios.get('startuptest');
      log('Pomyślnie ' + 'połączono'.green + ' z api');
    } catch (e) {
      log('ERROR'.red + ' nie udało się nawiązać połączenia z api'.brightRed);
      console.error(e);
    }
  }

  onMessageCreate(msg) {
    this.commands.find(c => c.commandData.name == 'log').logMsg(msg);

    let adminCommand = null;
    if (msg.content.startsWith('!mi deleteCommands') && msg.author.id == botConfig.owner) {
      adminCommand = this.commands.find(c => c.commandData.name == 'deleteCommand');
      if (adminCommand) new adminCommand.execute(msg, this.client);
    }
    if (msg.content.startsWith('!mi setupCommands') && msg.author.id == botConfig.owner) {
      adminCommand = this.commands.find(c => c.commandData.name == 'setupCommands');
      if (adminCommand) new adminCommand.execute(msg, this.commands);
    }
  }

  interactionCreate(interaction) {
    if (interaction.isCommand()) {
      const command = this.commands.find(c => c.commandData.name == interaction.commandName);
      if (command) command.execute(interaction, this.client, false);
    } else if (interaction.isSelectMenu() || interaction.isButton()) {
      const command = this.commands.find(c => c.commandData.name == interaction.customId.split('_')[0]);
      if (command) command.execute(interaction, this.client, true);
    }
  }
}

new MrInba();