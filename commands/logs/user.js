const Discord = require('discord.js');
const db = require(`../../my_modules/database.js`);
const op = require(`../../my_modules/inbaOutputs.js`);
const timeFormat = require('../../my_modules/timeFormat.js');
const sd = require(`../../my_modules/simpleDiscord.js`);

function _execute(message, user) {
    let userData = {
        member: null,
        msgTotal: 0,
        msgToday: 0,
        topChannels: [],
        step: 0,
        stepFinish: 2,
        stepIncrement: function() {
            this.step++;
            if (this.step == this.stepFinish) afterDataDelivered(message, this);
        }
    }

    userData.member = message.member;

    db.query("SELECT (SELECT count(*) FROM `MessageLogs` WHERE `MessageLogs`.`idMember` = ? AND `MessageLogs`.`idServer` = ?) as msgTotal, (SELECT count(*) FROM `MessageLogs` WHERE `MessageLogs`.`idMember` = ? AND `MessageLogs`.`idServer` = ? AND `MessageLogs`.`sendTime` >= ?) as msgToday", [user.user.id, message.guild.id, user.user.id, message.guild.id, timeFormat.getTodayTimeStamp()], result => {
        userData.msgTotal = result[0].msgTotal;
        userData.msgToday = result[0].msgToday;
        userData.stepIncrement();
    })

    db.query("SELECT DISTINCT(idChannel) AS `channel_id`, ( SELECT count(*) FROM `MessageLogs` WHERE `MessageLogs`.`idChannel` = `channel_id` AND `MessageLogs`.`idMember` = ? AND `MessageLogs`.`idServer` = ?) as msgTotal, ( SELECT count(*) FROM `MessageLogs` WHERE `MessageLogs`.`idChannel` = `channel_id` AND `MessageLogs`.`idMember` = ? AND `MessageLogs`.`idServer` = ? AND `MessageLogs`.`sendTime` >= ? ) as msgToday FROM `MessageLogs` WHERE `MessageLogs`.`idMember` = ? AND `MessageLogs`.`idServer` = ? AND `MessageLogs`.`sendTime` >= ? LIMIT 10", [user.user.id, message.guild.id, user.user.id, message.guild.id, timeFormat.getTodayTimeStamp(), user.user.id, message.guild.id, timeFormat.getTodayTimeStamp()], result => {
        userData.topChannels = result;
        userData.stepIncrement();
    })
}

function afterDataDelivered(message, userData) {
    let channelsStr = ``;
    let channelsDataStr = ``;
    userData.topChannels.forEach((channel, channelIndex) => {
        channelsStr += `**\`${channelIndex + 1}\`**: <#${channel.channel_id}>\n`;
        channelsDataStr += `\`${channel.msgTotal}\` | \`${channel.msgToday}\`\n`;
    });
    if (channelsStr.trim() == ``) channelsStr = `Brak`;
    if (channelsDataStr.trim() == ``) channelsDataStr = `Brak`;

    let statsEmbed = new Discord.RichEmbed()
        .setTitle(`Statystyki użytkownika`)
        .setDescription(`${userData.member.displayName}`)
        .addField(`Wiadomości ogółem`, `\`${userData.msgTotal}\``, false)
        .addField(`Wiadomości dzisiaj`, `\`${userData.msgToday}\``, false)
        .addField(`Ulubione kanały`, channelsStr, true)
        .addField(`Ogółem | Dziś`, channelsDataStr, true)
        .setThumbnail(userData.member.user.avatarURL)
        .setColor(userData.member.displayColor)
        .setFooter(`Liczone od dnia 13.03.2020`);
    sd.send(message, statsEmbed);
}

module.exports = {
    name: 'user',
    description: 'logs user',
    execute(message, user) {_execute(message, user)}
}

/*  ------Select msg count total and today------
    SELECT
        (
            SELECT count(*)
            FROM `MessageLogs`
            WHERE 
                `MessageLogs`.`idMember` = '599569173990866965' AND
                `MessageLogs`.`idServer` = '599715795391610904'
        ) as msgTotal,
        (
            SELECT count(*)
            FROM `MessageLogs`
            WHERE
                `MessageLogs`.`idMember` = '599569173990866965' AND
                `MessageLogs`.`idServer` = '599715795391610904' AND
                `MessageLogs`.`sendTime` >= 1584230400000
        ) as msgToday
*/

/*  -----Top channels with msgs-----
    SELECT
        DISTINCT(idChannel) AS `channel_id`,
        (
            SELECT count(*)
            FROM `MessageLogs`
            WHERE
                `MessageLogs`.`idChannel` = `channel_id` AND
                `MessageLogs`.`idMember` = '599569173990866965' AND
                `MessageLogs`.`idServer` = '599715795391610904'
        ) as msgTotal,
        (
            SELECT count(*)
            FROM `MessageLogs`
            WHERE
                `MessageLogs`.`idChannel` = `channel_id` AND
                `MessageLogs`.`idMember` = '599569173990866965' AND
                `MessageLogs`.`idServer` = '599715795391610904' AND
                `MessageLogs`.`sendTime` >= 1584230400000
        ) as msgToday
    FROM `MessageLogs`
    WHERE
        `MessageLogs`.`idMember` = '599569173990866965' AND
        `MessageLogs`.`idServer` = '599715795391610904' AND
        `MessageLogs`.`sendTime` >= 1584230400000
*/