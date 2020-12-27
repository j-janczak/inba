const mongo = require('./mongo.js');

class MessageLogs {
    logs(msg) {
        let msgData = mongo.templates.message_log;
        msgData._id = msg.id;
        msgData.server._id = msg.channel.guild.id;
        msgData.server.name = msg.channel.guild.name;
        msgData.channel._id = msg.channel.id;
        msgData.channel.name = msg.channel.name;
        msgData.author._id = msg.author.id;
        msgData.author.name = `${msg.author.username}#${msg.author.discriminator}`;
        msgData.author.bot = msg.author.bot;
        msgData.content = msg.content;
        msgData.clearContent = msg.cleanContent;
        msgData.attachments = msg.attachments;
        msgData.createdTime = msg.createdTimestamp;
        //console.log(msgData);
        mongo.db.logMessage(msgData);
    }
}

module.exports = MessageLogs;