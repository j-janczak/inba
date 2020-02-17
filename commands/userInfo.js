const Discord = require('discord.js');
const sd = require(`../my_modules/simpleDiscord.js`);
const op = require(`../my_modules/inbaOutputs.js`);
const timeFormat = require('../my_modules/timeFormat.js');

module.exports = {
	name: `userinfo`,
	description: ``,
	execute(message, args) {
		var member = (message.mentions.members.size ? message.mentions.members.first() : message.member);
		var roles = ``;
		member._roles.forEach(r => {
			roles += message.channel.guild.roles.get(r).name + '\n';
		});
		if (roles == ``) roles = `None`;
		var nick = member.nickname;
		if (nick === null) nick = `None`;

		const otherMemberEmbed = new Discord.RichEmbed()
			.setColor('#0099ff')
			.setTitle(member.user.username)
			.setThumbnail(member.user.avatarURL)
			.setDescription(op.direct(`userInfo`, `member_information`))
			.addField(op.direct(`userInfo`, `joined`), timeFormat.getDate(member.joinedTimestamp), true)
			.addField(op.direct(`userInfo`, `nick`), nick, true)
			.addField(op.direct(`userInfo`, `roles`), roles, true)
		sd.send(message, otherMemberEmbed);
	},
};
