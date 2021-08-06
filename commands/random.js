const Command = require('../bot_files/CommandTemplate');

class Random extends Command {
	constructor(interaction) {
		super(interaction);
		const inputMin = interaction.options.getInteger('min'),
			inputMax = interaction.options.getInteger('max');

		if (inputMin == null || inputMax == null) {
			const min = Math.ceil(Number.MAX_SAFE_INTEGER),
				max = Math.floor(Number.MIN_SAFE_INTEGER),
				result = Math.floor(Math.random() * (max - min + 1)) + min;

			interaction.reply(`${this.getString('ping')} ${result}`);
		}
		else {
			if (inputMin > inputMax) {
				interaction.reply('Hej, coś tu nie gra 🤔');
				return;
			}

			const min = Math.ceil(inputMin),
				max = Math.floor(inputMax),
				result = Math.floor(Math.random() * (max - min + 1)) + min;

			interaction.reply(`${this.getString('ping')} ${result}`);
		}
	}
}

module.exports = {
	interactionData: {
		name: 'random',
		description: 'Losuje liczbę z zakresu lub nawet bez',
		options: [
			{
				name: 'min',
				type: 'INTEGER',
				description: 'Wartość minimalna',
				required: false,
			},
			{
				name: 'max',
				type: 'INTEGER',
				description: 'Wartość maksymalna',
				required: false,
			},
		],
	},
	execute(interaction) { new Random(interaction); },
};