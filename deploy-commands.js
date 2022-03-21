const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { dev, token } = require('./src/config.json');

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!')
]
  .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(dev.clientID, dev.guildID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);