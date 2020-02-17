const botConfig = require(`../config/config.json`);

module.exports = {
    name: 'reverse',
    description: 'Congiguration of server',
    execute(message, args) {
        let startCheck = `${botConfig.prefix} reverse `;
        if (message.cleanContent.startsWith(startCheck)) {
            let msgToReverse = message.cleanContent.replace(/<:(.+?):[0-9]+>/g, ":$1:").slice(startCheck.length);
            let reverseMsg = ``;
            for (let i = msgToReverse.length - 1; i >= 0; i--) reverseMsg += msgToReverse[i];
            message.reply(reverseMsg);
        } else if (message.cleanContent == `${botConfig.prefix} reverse ` || message.cleanContent == `${botConfig.prefix} reverse`) {
            message.reply(`Write a message to reverse!`);
        }
    } 
};
