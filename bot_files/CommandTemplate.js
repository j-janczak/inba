const outputs = require('./inbaOutputs.js');
const botConfig = require('../cfg/config.json');
const { MessageEmbed } = require('discord.js');

class CommandTemplate {
	constructor(interaction) {
		this.interaction = interaction;
	}
	sendEmbed(type, str) {
		this.interaction.reply({ embeds: [this.returnEmbed(type, str)] });
	}
	returnEmbed(type, str) {
		const embed = new MessageEmbed();
		if (type == 0) embed.setDescription(`⛔\xa0\xa0\xa0\xa0${str}`).setColor('#D32F2F');
		else if (type == 1) embed.setDescription(`✅\xa0\xa0\xa0\xa0${str}`).setColor('#00E676');
		else if (type == 2) embed.setDescription(`⚠\xa0\xa0\xa0\xa0${str}`).setColor('#F57C00');
		else if (type == 3) embed.setDescription(`➡\xa0\xa0\xa0\xa0${str}`).setColor('#039BE5');
		return embed;
	}
	getString() {
		return outputs.get.apply(null, arguments);
	}
}

module.exports = CommandTemplate;