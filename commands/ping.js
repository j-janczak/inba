const sd = require(`../my_modules/simpleDiscord.js`);

module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
		sd.send(message, 'Penis');
	},
};
