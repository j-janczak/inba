const {client, clientEmiter} = require(`../my_modules/discordClient.js`);
const {db} = require(`./database.js`);
const colors = require('colors');

async function _execute(msg) {
    console.log(`•`.brightGreen, `${msg.member.displayName}`.cyan, `in`.grey, `${msg.guild.name}`.cyan, `at`.grey, `#${msg.channel.name}:`.cyan, `${msg.content}`);

    let content = msg.cleanContent;

    if (content.trim() == ``) {
        if (msg.attachments) {
            if (msg.attachments.first() !== undefined)
                content = msg.attachments.first().url;
        } else return;
    }

    db.query("INSERT INTO `mrinba`.`messageLogs` (id, serverFK, channelFK, messageFK, userFK, content, bot, deleted, sendTime) VALUES (NULL, ?, ?, ?, ?, ?, ?, FALSE, ?) ON DUPLICATE KEY UPDATE `messageLogs`.`id`=`messageLogs`.`id`;",
            [msg.guild.id, msg.channel.id, msg.id, msg.author.id, content, msg.author.bot, msg.createdTimestamp]);
}

client.on(`messageDelete`, msg => {
    db.query("UPDATE `mrinba`.`messageLogs` SET `messageLogs`.`deleted` = '1' WHERE `messageLogs`.`messageFK` = ? AND `messageLogs`.`serverFK` = ?", [msg.id, msg.guild.id]);
})

module.exports = {
    name: 'messagelogs',
    description: 'logging messages since 26.03.2020',
    execute(message) {_execute(message)},
    onDelete(message) {_onDelete(message)},
    onBulkDelete(messages) {_onBulkDelete(messages)}
}