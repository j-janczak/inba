const sd = require(`../my_modules/simpleDiscord.js`);
const op = require(`../my_modules/inbaOutputs.js`);
const permissions = require('./checkPermission.js');

module.exports = {
	name: 'ban',
	description: 'Banhammer',
	execute(message, args) {
		if(permissions.execute(message, [false])) {
			var member = message.mentions.members.first();
			member.ban().then((member) => {
				sd.send(message, sd.getEmbed(true, op.direct(`ban`, `success`, [member.user.tag])));
			}).catch(() => {
				sd.send(message, sd.getEmbed(false, op.direct(`ban`, `error`)));
      		});
    	} else sd.send(message, op.random(`unauthorized`));
  	},
};
