const db = require('./mongo.js');

class MessageLogs {
    logs(msg) {
        let msgData = {
            _id: msg.id,
            server: {
                id: msg.channel.guild.id,
                name: msg.channel.guild.name
            },
            channel: {
                id: msg.channel.id,
                name: msg.channel.name
            },
            author: {
                id: msg.author.id,
                name: msg.author.username,
                bot: msg.author.bot
            },
            content: msg.content,
            clearContent: msg.cleanContent,
            attachments: msg.attachments,
            deleted: false
        }
        db.logMessage(msgData);
    }
}

module.exports = MessageLogs;