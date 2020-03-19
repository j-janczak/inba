const {client, clientEmiter} = require(`../my_modules/discordClient.js`);
const db = require(`../my_modules/database.js`);
const op = require(`../my_modules/inbaOutputs.js`);
const sd = require(`../my_modules/simpleDiscord.js`);
const permissions = require(`./checkPermission.js`);

function onMemberRemove(member) {
    db.query("SELECT leaveMessage FROM servers where serverID = ?", [member.guild.id], result => {
        console.log(`DX`);
        if (result.length == 1) {
            if(result[0].leaveMessage !== null && result[0].leaveMessage !== undefined) 
                member.guild.channels.find(channel => channel.id === member.guild.systemChannelID).send(result[0].leaveMessage.replace(`%u`, `\`\`${member.user.tag}\`\``));
        }
    });
}

module.exports = {
    name: 'leavemessage',
    description: 'Congiguration of server',
    execute(message, args) {
        if (!permissions.execute(message, [false])) {
            sd.send(message, op.random(`unauthorized`));
            return;
        }
        const leaveRegex = /(["'])(?:(?=(\\?))\2.)*?\1/;
        let newleaveMsg = [];

        if (args.length == 1 || args[1] == `help`) sd.send(message, op.direct(`serverConfig`, `leaveMessageHelp`));
        else if (args[1] == `test`) onMemberRemove(message.member);
        else if (newleaveMsg = message.content.match(leaveRegex)) {
            newleaveMsg = newleaveMsg[0].substring(1).substring(0, newleaveMsg[0].length - 2);

            if (newleaveMsg.search(`%u`) == -1) sd.send(message, sd.getEmbed(2, op.direct(`serverConfig`, `leaveMessageMissUser`)));

            db.query(`INSERT INTO servers (serverID, leaveMessage) VALUES(?, ?) ON DUPLICATE KEY UPDATE leaveMessage = ?`, [message.guild.id, newleaveMsg, newleaveMsg], result => {
                 sd.send(message, sd.getEmbed(true, op.direct(`serverConfig`, `leaveMessageSuccess`, [newleaveMsg.replace(`%u`, `@user`)])));
            });
             
        } else sd.send(message, sd.getEmbed(false, op.direct(`serverConfig`, `leaveMessageError`)));
    }
};

clientEmiter.on(`memberLeft`, member => { onMemberRemove(member) });
