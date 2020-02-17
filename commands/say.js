const botConfig = require(`../config/config.json`);

module.exports = {
    name: 'say',
    description: 'say',
    execute(message, args) {
        if (message.author.id == `599569173990866965`) {
            message.delete();
            message.channel.send(message.content.slice(botConfig.prefix.length + this.name.length + 1));
        }
    } 
};
