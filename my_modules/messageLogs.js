const db = require(`./database.js`);

function _execute(message) {
    let idServer = message.guild.id;
    let idChannel = message.channel.id;
    let idMessage = message.id;
    let idMember = message.author.id;
    let messageContent = message.cleanContent;
    let sendTime = message.createdTimestamp;
    let isAuthorBot = message.author.bot;

    db.query("INSERT INTO `mrinba`.`MessageLogs` (idMessage, idServer, idChannel, idMember, messageContent, sendTime, isDelete, isAuthorBot) VALUES (?, ?, ?, ?, ?, ?, 0, ?);",
            [idMessage, idServer, idChannel, idMember, messageContent, sendTime, isAuthorBot], 
            (result) => {}
    );
}

function _onDelete(message) {
    db.query("UPDATE `mrinba`.`MessageLogs` SET `isDelete` = '1' WHERE (`idMessage` = ?)",
            [message.id], (result) => {
    });
}

module.exports = {
    name: 'messagelogs',
    description: 'logging messages since 13.03.2020',
    execute(message) {_execute(message)},
    onDelete(message) {_onDelete(message)},
    onBulkDelete(messages) {_onBulkDelete(messages)}
}