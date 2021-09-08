const Command = require('../bot_files/CommandTemplate');
const botConfig = require('../cfg/config.json');

class ProfilePicture extends Command {
	constructor(interaction) {
		super(interaction);

		const user = interaction.options.getUser('user');

		interaction.reply({ embeds: [{
			color: botConfig.colors.botColor,
			title: `${user.username} avatar`,
			description: `[Open in browser](${user.avatarURL({ size: 4096, dynamic: true })})`,
			image: {
				url: user.avatarURL({ size: 4096, dynamic: true }),
			},
		}] });
	}
}

module.exports = {
	interactionData: {
		name: 'profile_picture',
		description: 'No awatar pokazuje, co innego ma robić',
		options: [
			{
				name: 'user',
				type: 6,
				description: 'Użytkownik którego awatar chcemy zobaczyć',
				required: true,
			},
		],
	},
	execute(interaction) { new ProfilePicture(interaction); },
};