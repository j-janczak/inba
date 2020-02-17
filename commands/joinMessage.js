const {client, clientEmiter} = require(`../my_modules/discordClient.js`);
const db = require(`../my_modules/database.js`);
const op = require(`../my_modules/inbaOutputs.js`);
const sd = require(`../my_modules/simpleDiscord.js`);
const permissions = require(`./checkPermission.js`);

function onMemberAdd(member) {
    db.query("SELECT joinMessage, logMessagesChannelID FROM servers where serverID = ?", [member.guild.id], result => {
        if (result.length == 1) {
            if(result[0].joinMessage !== null && result[0].joinMessage !== undefined) 
                member.guild.channels.find(channel => channel.id === member.guild.systemChannelID).send(result[0].joinMessage.replace(`%u`, `<@${member.id}>`));
        }
    });
}

module.exports = {
    name: 'joinmessage',
    description: 'Congiguration of server',
    execute(message, args) {
        if (!permissions.execute(message, [false])) {
            sd.send(message, op.random(`unauthorized`));
            return;
        }

        const joinRegex = /(["'])(?:(?=(\\?))\2.)*?\1/;
        let newJoinMsg = [];

        if (args.length == 1 || args[1] == `help`) sd.send(message, op.direct(`serverConfig`, `joinMessageHelp`));
        else if (args[1] == `test`) onMemberAdd(message.member);
        else if (newJoinMsg = message.content.match(joinRegex)) {
            newJoinMsg = newJoinMsg[0].substring(1).substring(0, newJoinMsg[0].length - 2);

            if (newJoinMsg.search(`%u`) == -1) sd.send(message, sd.getEmbed(2, op.direct(`serverConfig`, `joinMessageMissUser`)));

            db.query("INSERT INTO servers (serverID, joinMessage) VALUES(?, ?) ON DUPLICATE KEY UPDATE joinMessage = ?", [message.guild.id, newJoinMsg, newJoinMsg], result => {
                sd.send(message, sd.getEmbed(true, op.direct(`serverConfig`, `joinMessageSuccess`, [newJoinMsg.replace(`%u`, `@user`)])));
            });
             
        } else sd.send(message, sd.getEmbed(false, op.direct(`serverConfig`, `joinMessageError`)));
    } 
};

clientEmiter.on(`memberJoined`, member => { onMemberAdd(member) });