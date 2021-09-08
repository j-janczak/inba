const { Client, Intents, Collection } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');

const inbaDB = require('./bot_files/inbaDB.js');
const { token } = require('./cfg/config.json');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commandsData = [];

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.interactionData.name, command);
	commandsData.push(command.interactionData);
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
		console.log(client.user.id);

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

		const rest = new REST({ version: '9' }).setToken(token);

		(async () => {
			try {
				console.log('Started refreshing application (/) commands.');

				await rest.put(
					Routes.applicationCommands(client.user.id),
					{ body: commandsData },
				);

				console.log('Successfully reloaded application (/) commands.');
			}
			catch (error) {
				console.error(error);
			}
		})();
	}
});

async function onGuildMemberAddRemove(guildMember, type) {
	try {
		const messagesToSend = (type) ? await inbaDB.get('servers/welcomeMessages', [guildMember.guild.id]) : await inbaDB.get('servers/farewellMessages', [guildMember.guild.id]);
		if (messagesToSend.data.messages.length > 0) {
			const mNo = Math.floor(Math.random() * messagesToSend.data.messages.length);
			const messageToSend = (type) ? messagesToSend.data.messages[mNo].replace('%u', `<@${guildMember.user.id}>`) : messagesToSend.data.messages[mNo].replace('%u', `\`${guildMember.user.tag}\``);

			guildMember.guild.systemChannel.send(messageToSend);
		}
	}
	catch(e) { console.error(e); }
}

async function onMessageReaction(reaction, user) {
	if (user.id == client.user.id) return;
	if (reaction.partial) await reaction.fetch();
	if (reaction.message.partial) await reaction.message.fetch();

	if (reaction.message.author.id == client.user.id && reaction.message.embeds) {
		if (reaction.message.embeds[0].footer != null && reaction.message.embeds[0].footer.text == 'Mr. Inba Poll') {
			client.commands.get('poll').reaction(reaction);
		}
	}
}

client.on('guildMemberAdd', (guildMember) => { onGuildMemberAddRemove(guildMember, 1); });
client.on('guildMemberRemove', (guildMember) => { onGuildMemberAddRemove(guildMember, 0); });
client.on('messageReactionAdd', (reaction, user) => { onMessageReaction(reaction, user); });
client.on('messageReactionRemove', (reaction, user) => { onMessageReaction(reaction, user); });

client.login(token);