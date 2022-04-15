module.exports = {
	interactionData: {
		name: 'ping',
		description: 'Check bot status',
	},
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};