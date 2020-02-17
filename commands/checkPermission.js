module.exports = {
    name: 'checkPermissions',
	description: 'Ping!',
	execute(message, args) {
		if(args.length < 1) return false;
		
		if(message.author.id === '599569173990866965' || message.member.hasPermission("ADMINISTRATOR")) {
			if(args[0]) message.channel.send("Posiadasz uprawnienia do bota");
			return true;
		} else {
			if(args[0]) message.channel.send("Nie posiadasz uprawnień do bota");
			return false;
		}
	},
};
