const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./cfg/config.json');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.interactionData.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (!client.commands.has(interaction.commandName)) return;

	try {
		await client.commands.get(interaction.commandName).execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageCreate', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!mi deploy' && message.author.id === client.application?.owner.id) {
		console.log('Inicjacja komend\nUsuwanie starych komend');
		await client.guilds.cache.get(message.guild.id)?.commands.fetch();
		client.guilds.cache.get(message.guild.id)?.commands.cache.forEach(serverCommand => {
			client.guilds.cache.get(message.guild.id)?.commands.delete(serverCommand);
			console.log(`Usunięto ${serverCommand.name}`);
		});
		console.log('--------------\nDodawanie nowych komend');
		client.commands.forEach(command => {
			client.guilds.cache.get(message.guild.id)?.commands.create(command.interactionData);
			console.log(`Dodano ${command.interactionData.name}`);
		});
	}
});

client.login(token);