const Discord = require('discord.js');
const db = require(`../my_modules/database.js`);
const op = require(`../my_modules/inbaOutputs.js`);
const sd = require(`../my_modules/simpleDiscord.js`);
const timeFormat = require('../my_modules/timeFormat.js');

function _execute(message, args) {
    let today = new Date();
    let todayTimestamp = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

    let logResult = {
        channels: [],
        users: [],
        bots: [],
        msgMembersTotal: 0,
        msgBotsTotal: 0,
        msgTotal: 0,
        step: 0,
        stepFinish: 5,
        stepCheck: function() {
            this.step++;
            if (this.step == this.stepFinish) {
                this.msgTotal = this.msgMembersTotal + this.msgBotsTotal;
                onDbWorkFinish(message, this);
            }
        }
    }

    db.query("SELECT DISTINCT(idMember) AS `member_id`, ( SELECT count(*) FROM `MessageLogs` WHERE `MessageLogs`.`idServer` = ? AND `MessageLogs`.`idMember` = `member_id` AND `MessageLogs`.`isDelete` = 0 AND `MessageLogs`.`sendTime` >= ? AND `MessageLogs`.`isAuthorBot` = 0 ) as `msgCount` FROM `MessageLogs` WHERE `MessageLogs`.`idServer` = ? AND `MessageLogs`.`isDelete` = 0 AND `MessageLogs`.`sendTime` >= ? AND `MessageLogs`.`isAuthorBot` = 0 ORDER BY `msgCount` DESC LIMIT 10", [message.guild.id, todayTimestamp, message.guild.id, todayTimestamp], result => {
        result.forEach(row => {
            logResult.users.push(row);
        });
        logResult.stepCheck();
    })

    db.query("SELECT count(*) FROM `MessageLogs` WHERE `MessageLogs`.`idServer` = ? AND `MessageLogs`.`sendTime` >= ? AND `MessageLogs`.`isAuthorBot` = 0;", [message.guild.id, todayTimestamp], result => {
        logResult.msgMembersTotal = result[0][`count(*)`];
        logResult.stepCheck();
    });

    db.query("SELECT DISTINCT(idMember) AS `member_id`, ( SELECT count(*) FROM `MessageLogs` WHERE `MessageLogs`.`idServer` = ? AND `MessageLogs`.`idMember` = `member_id` AND `MessageLogs`.`isDelete` = 0 AND `MessageLogs`.`sendTime` >= ? AND `MessageLogs`.`isAuthorBot` = 1 ) as `msgCount` FROM `MessageLogs` WHERE `MessageLogs`.`idServer` = ? AND `MessageLogs`.`isDelete` = 0 AND `MessageLogs`.`sendTime` >= ? AND `MessageLogs`.`isAuthorBot` = 1 ORDER BY `msgCount` DESC LIMIT 10", [message.guild.id, todayTimestamp, message.guild.id, todayTimestamp], result => {
        result.forEach(row => {
            logResult.bots.push(row);
        });
        logResult.stepCheck();
    })

    db.query("SELECT count(*) FROM `MessageLogs` WHERE `MessageLogs`.`idServer` = ? AND `MessageLogs`.`sendTime` >= ? AND `MessageLogs`.`isAuthorBot` = 1;", [message.guild.id, todayTimestamp], result => {
        logResult.msgBotsTotal = result[0][`count(*)`];
        logResult.stepCheck();
    });

    db.query("SELECT DISTINCT(idChannel) AS `channel_id`, (SELECT count(*) FROM `MessageLogs` WHERE `MessageLogs`.`idChannel` = `channel_id` AND `MessageLogs`.`isDelete` = 0 AND `MessageLogs`.`sendTime` >= ? AND `MessageLogs`.`isAuthorBot` = 0) as `msgCount` FROM`MessageLogs` WHERE `MessageLogs`.`idServer` = ? AND `MessageLogs`.`isDelete` = 0 AND `MessageLogs`.`sendTime` >= ? AND `MessageLogs`.`isAuthorBot` = 0 ORDER BY `msgCount` DESC LIMIT 10", [todayTimestamp, message.guild.id, todayTimestamp], result => {
        result.forEach(row => {
            logResult.channels.push(row);
        });
        logResult.stepCheck();
    })
}

function onDbWorkFinish(message, dbData) {
    console.log(`tak`);

    let channelsStr = ``;
    dbData.channels.forEach((channel, channelIndex) => {
        channelsStr += `\`${channelIndex + 1}\`: <#${channel.channel_id}> - ${channel.msgCount}\n`; 
    })

    let usersStr = ``;
    dbData.users.forEach((user, userIndex) => {
        usersStr += `\`${userIndex + 1}\`: <@${user.member_id}> - ${user.msgCount}\n`; 
    })

    let botsStr = ``;
    dbData.bots.forEach((bot, botIndex) => {
        botsStr += `\`${botIndex + 1}\`: <@${bot.member_id}> - ${bot.msgCount}\n`; 
    })

    const logEmbed = new Discord.RichEmbed()
        .setTitle(op.direct(`dailyLogs`, `title`))
        .setDescription(op.direct(`dailyLogs`, `desc`, [message.guild.name]))
        .setThumbnail(message.guild.icon)
        .setColor(`#B0E0E6`)
        .addField(`Te kanały dziś rządziły`, channelsStr, true)
        .addField(`Wiadomości ogółem`, dbData.msgTotal, true)
        .addBlankField(false)
        .addField(`Najaktywniejsi`, usersStr, true)
        .addField(`Wiadomości użyszkodników`, dbData.msgMembersTotal, true)
        .addBlankField(false)
        .addField(`moksori i reszta`, botsStr, true)
        .addField(`azjatki i reszta`, dbData.msgBotsTotal, true)
        .setTimestamp();
    message.channel.send(logEmbed);
}

module.exports = {
    name: 'logs',
    description: 'logs commands',
    execute(message, args) {_execute(message, args)}
}

/*  ------Select unique channels from server with message count------
    SELECT 
        DISTINCT(idChannel) AS `channel_id`,
        (
            SELECT 
                count(*) 
            FROM 
                `MessageLogs` 
            WHERE 
                `MessageLogs`.`idChannel` = `channel_id` AND
                `MessageLogs`.`isDelete` = 0 AND
                `MessageLogs`.`sendTime` >= 1584144000000 AND
                `MessageLogs`.`isAuthorBot` = 0
        ) as `msgCount`
    FROM 
        `MessageLogs`
    WHERE 
        `MessageLogs`.`idServer` = '616029849882066959' AND
        `MessageLogs`.`isDelete` = 0 AND
        `MessageLogs`.`sendTime` >= 1584144000000 AND
        `MessageLogs`.`isAuthorBot` = 0
    ORDER BY
        `msgCount`
        DESC
    LIMIT 
        10
*/

/*  ------Select unique members from server with message count------
    SELECT
        DISTINCT(idMember) AS `member_id`,
        (
            SELECT
                count(*)
            FROM
                `MessageLogs`
            WHERE
				`MessageLogs`.`idServer` = '616029849882066959' AND
                `MessageLogs`.`idMember` = `member_id` AND
                `MessageLogs`.`isDelete` = 0 AND
                `MessageLogs`.`sendTime` >= 1584144000000 AND
                `MessageLogs`.`isAuthorBot` = 0
        ) as `msgCount`
    FROM
        `MessageLogs`
    WHERE
        `MessageLogs`.`idServer` = '616029849882066959' AND
        `MessageLogs`.`isDelete` = 0 AND
        `MessageLogs`.`sendTime` >= 1584144000000 AND
        `MessageLogs`.`isAuthorBot` = 0
    ORDER BY
        `msgCount`
        DESC
    LIMIT
        10
*/

/*  ------Select unique bots from server with message count------
	SELECT
        DISTINCT(idMember) AS `member_id`,
        (
            SELECT
                count(*)
            FROM
                `MessageLogs`
            WHERE
				`MessageLogs`.`idServer` = '616029849882066959' AND
                `MessageLogs`.`idMember` = `member_id` AND
                `MessageLogs`.`isDelete` = 0 AND
                `MessageLogs`.`sendTime` >= 1584144000000 AND
                `MessageLogs`.`isAuthorBot` = 1
        ) as `msgCount`
    FROM
        `MessageLogs`
    WHERE
        `MessageLogs`.`idServer` = '616029849882066959' AND
        `MessageLogs`.`isDelete` = 0 AND
        `MessageLogs`.`sendTime` >= 1584144000000 AND
        `MessageLogs`.`isAuthorBot` = 1
    ORDER BY
        `msgCount`
        DESC
    LIMIT
        10
*/

/*  ------Select messages count from users------
    SELECT count(*) FROM `MessageLogs` WHERE `MessageLogs`.`idServer` = '616029849882066959' AND `MessageLogs`.`sendTime` >= 1584144000000 AND `MessageLogs`.`isAuthorBot` = 0;
*/

/*  ------Select messages count from bots------
    SELECT count(*) FROM `MessageLogs` WHERE `MessageLogs`.`idServer` = '616029849882066959' AND `MessageLogs`.`sendTime` >= 1584144000000 AND `MessageLogs`.`isAuthorBot` = 1;
*/