const botConfig = require(`../config/config.json`);

module.exports = {
    name: 'mock',
    description: 'Congiguration of server',
    execute(message, args) {
        let startCheck = `${botConfig.prefix} mock `;
        if (message.cleanContent.startsWith(startCheck)) {
            let msgToMock = message.cleanContent.replace(/<:(.+?):[0-9]+>/g, ":$1:").slice(startCheck.length);
            let mockMsg = ``;
            for(let i = 0; i < msgToMock.length; i++) {
                if (Math.round(Math.random()) == 1) mockMsg += msgToMock.charAt(i).toUpperCase();
                else mockMsg += msgToMock.charAt(i).toLowerCase();
            };
            message.reply(mockMsg);
        } else if (message.cleanContent == `${botConfig.prefix} mock ` || message.cleanContent == `${botConfig.prefix} mock`) {
            message.reply(`Write a message to mock!`);
        }
    } 
};
