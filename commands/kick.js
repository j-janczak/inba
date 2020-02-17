const sd = require(`../my_modules/simpleDiscord.js`);
const op = require(`../my_modules/inbaOutputs.js`);
const permissions = require(`./checkPermission.js`);

module.exports = {
    name: `kick`,
    description: `just a kick`,
    execute(message, args) {
        if(permissions.execute(message, [false])) {
			var member = message.mentions.members.first();
			member.kick().then((member) => {
				sd.send(message, sd.getEmbed(true, op.direct(`kick`, `success`, [member.user.tag])));
			}).catch(() => {
				sd.send(message, sd.getEmbed(false, op.direct(`kick`, `error`)));
			});
        } else sd.send(message, op.random(`unauthorized`));
    },
};
