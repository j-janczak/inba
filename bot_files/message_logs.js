const inbaDB = require('./inbaDB.js');

class MessageLogs {
    async logs(msg) {
        console.log(msg.content);
        await inbaDB.send('message_logs', {
            _id: msg.id,
            server_id: msg.channel.guild.id,
            server_name: msg.channel.guild.name,
            channel_id: msg.channel.id,
            channel_name: msg.channel.name,
            author_id: msg.author.id,
            author_name: msg.author.username,
            author_bot: msg.author.bot,
            content: msg.content,
            clearContent: msg.cleanContent,
            attachments: JSON.stringify(msg.attachments),
            createdTime: msg.createdTimestamp
        }).catch(console.error);
    }
}

module.exports = MessageLogs;