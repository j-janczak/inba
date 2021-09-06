/* eslint-disable no-useless-escape */
const CommandTemplate = require('../bot_files/CommandTemplate');
const botConfig = require('../cfg/config.json');
const axios = require('axios');

class Poll extends CommandTemplate {
	static emojiArray = [`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`, `7️⃣`, `8️⃣`, `9️⃣`, `🔟`];
    static columnMaxWidth = 16;

	constructor(interaction) {
		super(interaction);

		const poll_name = this.interaction.options.getString('poll_name');

		const optionsArray = [];
		for (let i = 1 ; i <= 10; i++) {
			const tmpOpt = this.interaction.options.getString(`opt${i}`);
			if (tmpOpt) optionsArray.push(tmpOpt);
		}

		let pollDescription = '';
		optionsArray.forEach((element, index) => {
			if (index == 0) return;
			pollDescription += `${index}. ${element}\n▓ 0%\n\n`;
		});

		const pollEmbed = {
			color: this.interaction.member.displayColor || botConfig.colors.botColor,
			title: poll_name,
			author: {
				name: `${this.interaction.member.displayName}`,
				icon_url: this.interaction.user.avatarURL(),
			},
			description: pollDescription,
			footer: {
				text: 'Mr. Inba Poll',
			},
			timestamp: new Date(),
		};

		this.interaction.reply({ embeds: [pollEmbed] }).then(pollMsg => {
			/*this.asyncForEach(Poll.emojiArray.slice(0, optionsArray.length - 1), async (emoji) => {
				await pollMsg.react(emoji);
			});*/
			console.log(pollMsg)
		});
	}
	help() {
		this.sendHelp('Crypto', `df`);
	}
}

module.exports = {
	interactionData: {
		name: 'poll',
		description: 'Create an interactive poll',
		options: [
			{
				name: 'poll_name',
				type: 'STRING',
				description: 'Name of a poll',
				required: true,
			},
			{
				name: 'opt1',
				type: 'STRING',
				description: 'Option 1',
				required: false,
			},
			{
				name: 'opt2',
				type: 'STRING',
				description: 'Option 2',
				required: false,
			},
			{
				name: 'opt3',
				type: 'STRING',
				description: 'Option 3',
				required: false,
			},
			{
				name: 'opt4',
				type: 'STRING',
				description: 'Option 4',
				required: false,
			},
			{
				name: 'opt5',
				type: 'STRING',
				description: 'Option 5',
				required: false,
			},
			{
				name: 'opt6',
				type: 'STRING',
				description: 'Option 6',
				required: false,
			},
			{
				name: 'opt7',
				type: 'STRING',
				description: 'Option 7',
				required: false,
			},
			{
				name: 'opt8',
				type: 'STRING',
				description: 'Option 8',
				required: false,
			},
			{
				name: 'opt9',
				type: 'STRING',
				description: 'Option 9',
				required: false,
			},
			{
				name: 'opt10',
				type: 'STRING',
				description: 'Option 10',
				required: false,
			},
		],
	},
	execute(interaction) { new Poll(interaction); },
};