const CommandTemplate = require('../bot_files/CommandTemplate');
const botConfig = require('../cfg/config.json');

class Poll extends CommandTemplate {
	static emojiArray = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
	static columnMaxWidth = 16;

	constructor(interaction) {
		super(interaction);

		const poll_name = this.interaction.options.getString('poll_name');

		const optionsArray = [];
		for (let i = 1 ; i <= 10; i++) {
			const tmpOpt = this.interaction.options.getString(`opt${i}`);
			if (tmpOpt) optionsArray.push(tmpOpt);
		}

		if (optionsArray.length < 2) {
			this.interaction.reply({ content: this.getString("poll", "error", "notEnoughOptions"), ephemeral: true });
		}

		let pollDescription = '';
		optionsArray.forEach((element, index) => {
			pollDescription += `${index + 1}. ${element}\n▓ 0%\n\n`;
		});

		const pollEmbed = {
			color: this.interaction.member.displayColor || botConfig.colors.botColor,
			title: poll_name,
			author: {
				name: this.interaction.member.displayName,
				icon_url: this.interaction.user.avatarURL(),
			},
			description: pollDescription,
			footer: {
				text: 'Mr. Inba Poll',
			},
			timestamp: new Date(),
		};

		this.interaction.reply({ embeds: [pollEmbed], fetchReply: true }).then(pollMsg => {
			this.asyncForEach(Poll.emojiArray.slice(0, optionsArray.length), async (emoji) => {
				await pollMsg.react(emoji);
			});
		});
	}
	static updatePoll(reaction) {
		let reactions = reaction.message.reactions.cache.map((r, i) => {
			return {emoji: i, count: r.count - 1}
		});
		reactions.forEach((r, i) => {
			if (!Poll.emojiArray.includes(r.emoji)) reactions.splice(i, 1);
		});

		let totalPoints = 0;
		reactions.forEach(r => {
			totalPoints += r.count
		});
		reactions.forEach((r, i) => {
			if (reactions[i] == undefined) return;
			if (totalPoints == 0) reactions[i].percent = 0;
			else reactions[i].percent = Math.round(((r.count / totalPoints) * 100) * 100) / 100
		});

		const pollEmbed = reaction.message.embeds[0];
		const pollEmbedDesc = pollEmbed.description.split('\n');
		let pollOptions = []
		pollEmbedDesc.forEach(line => {
			if (line.match(/^\d{1,2}. /g)) pollOptions.push(line)
		});

		let newDescription = ``;
		pollOptions.forEach((opt, i) => {
			newDescription += `${opt}\n`;

			let columnWidth = parseInt(Poll.columnMaxWidth * ((reactions[i] == undefined ? 0 : reactions[i].percent) / 100)) + 1;
			for (let cw = 0; cw < columnWidth; cw++) newDescription += `▓`;
			newDescription += ` ${(reactions[i] == undefined ? 0 : reactions[i].percent)}%\n\n`;
		})


		const newEmbed = {
			color: pollEmbed.color,
			title: pollEmbed.title,
			author: pollEmbed.author,
			description: newDescription,
			footer: {
				text: 'Mr. Inba Poll',
			},
			timestamp: pollEmbed.timestamp
		}

		reaction.message.edit({ embeds: [newEmbed] })
	}
}

module.exports = {
	interactionData: {
		name: 'poll',
		description: 'Create an interactive poll',
		options: [
			{
				name: 'poll_name',
				type: 3,
				description: 'Name of a poll',
				required: true,
			},
			{
				name: 'opt1',
				type: 3,
				description: 'Option 1',
				required: false,
			},
			{
				name: 'opt2',
				type: 3,
				description: 'Option 2',
				required: false,
			},
			{
				name: 'opt3',
				type: 3,
				description: 'Option 3',
				required: false,
			},
			{
				name: 'opt4',
				type: 3,
				description: 'Option 4',
				required: false,
			},
			{
				name: 'opt5',
				type: 3,
				description: 'Option 5',
				required: false,
			},
			{
				name: 'opt6',
				type: 3,
				description: 'Option 6',
				required: false,
			},
			{
				name: 'opt7',
				type: 3,
				description: 'Option 7',
				required: false,
			},
			{
				name: 'opt8',
				type: 3,
				description: 'Option 8',
				required: false,
			},
			{
				name: 'opt9',
				type: 3,
				description: 'Option 9',
				required: false,
			},
			{
				name: 'opt10',
				type: 3,
				description: 'Option 10',
				required: false,
			},
		],
	},
	execute(interaction) { new Poll(interaction); },
	reaction(reactionData) { Poll.updatePoll(reactionData) }
};