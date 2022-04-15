const Discord = require(`discord.js`);
const fs = require(`fs`);

module.exports = {
	loadModules(path) {
		let commands = new Discord.Collection();

		const commandFiles = fs.readdirSync(path).filter(file => file.endsWith(`.js`));
		
		for (const file of commandFiles) {
			const command = require(`.${path}/${file}`);
			commands.set(command.name, command);
		}
		return commands;
	},
	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}
};